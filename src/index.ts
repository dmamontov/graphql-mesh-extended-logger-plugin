import { getOperationAST, print } from 'graphql';
import { getDocumentString, isAsyncIterable, isIntrospectionOperationString } from '@envelop/core';
import { type OnExecuteHookResult } from '@envelop/types';
import { type MeshPlugin, type MeshPluginOptions } from '@graphql-mesh/types';
import { AttributeName, Component, LogLevel, type ExtendedLoggerPluginConfig } from './types';
import { removeTypename, toLog } from './utils';

export default function useExtendedLogger(
    pluginOptions: MeshPluginOptions<ExtendedLoggerPluginConfig>,
): MeshPlugin<any> {
    const logger = pluginOptions.logger;

    return {
        onPluginInit: function ({ addPlugin }) {
            addPlugin({
                onExecute({ args }) {
                    if (!pluginOptions.operations?.success && !pluginOptions.operations?.error) {
                        return undefined;
                    }

                    const operationAst = getOperationAST(args.document, args.operationName);
                    if (!operationAst) {
                        return undefined;
                    }

                    const document = getDocumentString(args.document, print);

                    if (isIntrospectionOperationString(document)) {
                        return undefined;
                    }

                    const message = {
                        [AttributeName.COMPONENT]: Component.OPERATION,
                        [AttributeName.TYPE]: operationAst.operation,
                        [AttributeName.NAME]: operationAst.name?.value || 'anonymous',
                        [AttributeName.TRACE_ID]: args.contextValue?.propagator?.traceId,
                        [AttributeName.USER]:
                            args.contextValue?.currentUser?.id ||
                            args.contextValue?.currentUser?.email ||
                            args.contextValue?.currentUser?.name ||
                            args.contextValue?.currentUser,
                        ...(pluginOptions.operations?.document
                            ? {
                                  [AttributeName.DOCUMENT]: document,
                                  [AttributeName.VARIABLES]: args.variableValues ?? {},
                              }
                            : {}),
                    };

                    const logResult = (result: any): void => {
                        if (
                            pluginOptions.operations?.error &&
                            result.errors &&
                            result.errors.length > 0
                        ) {
                            toLog(logger, LogLevel.Error, {
                                ...message,
                                [AttributeName.MESSAGE]: result.errors,
                            });
                        } else if (pluginOptions.operations?.success && result.data) {
                            toLog(logger, LogLevel.Info, {
                                ...message,
                                [AttributeName.MESSAGE]: 'Success',
                                ...(pluginOptions.operations?.result
                                    ? {
                                          [AttributeName.RESULT]: result.data,
                                      }
                                    : {}),
                            });
                        }
                    };

                    return {
                        onExecuteDone({ result }) {
                            if (!isAsyncIterable(result)) {
                                logResult(result);
                            }

                            return {
                                onNext: ({ result }) => {
                                    logResult(result);
                                },
                                onEnd: () => {},
                            };
                        },
                    } as OnExecuteHookResult<any>;
                },
            });
        },
        onDelegate(payload) {
            const message = {
                [AttributeName.COMPONENT]: Component.DELEGATION,
                [AttributeName.TYPE]: payload.typeName,
                [AttributeName.SOURCE_NAME]: payload.sourceName,
                [AttributeName.FIELD_NAME]: payload.fieldName,
                [AttributeName.TRACE_ID]: payload.context?.propagator?.traceId,
                [AttributeName.USER]:
                    payload.context?.currentUser?.id ||
                    payload.context?.currentUser?.email ||
                    payload.context?.currentUser?.name ||
                    payload.context?.currentUser,
                ...(pluginOptions.delegations.args
                    ? {
                          [AttributeName.ARGS]: payload.key
                              ? payload.argsFromKeys([payload.key])
                              : payload.args,
                      }
                    : {}),
            };

            return ({ result }) => {
                if (pluginOptions.delegations?.error && result instanceof Error) {
                    toLog(logger, LogLevel.Error, {
                        ...message,
                        [AttributeName.MESSAGE]: result?.message || result.toString(),
                    });
                } else if (pluginOptions.delegations?.success && result) {
                    toLog(logger, LogLevel.Info, {
                        ...message,
                        [AttributeName.MESSAGE]: 'Success',
                        ...(pluginOptions.delegations?.result
                            ? {
                                  [AttributeName.RESULT]: removeTypename(result),
                              }
                            : {}),
                    });
                }
            };
        },
    };
}
