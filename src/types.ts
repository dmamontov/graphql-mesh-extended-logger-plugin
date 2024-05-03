export interface ExtendedLoggerPluginConfig {
    operations: ExtendedLoggerDetailOperationsPluginConfig;
    delegations: ExtendedLoggerDetailDelegationsPluginConfig;
}

export interface ExtendedLoggerDetailOperationsPluginConfig {
    success: boolean;
    error: boolean;
    result: boolean;
    document: boolean;
}

export interface ExtendedLoggerDetailDelegationsPluginConfig {
    success: boolean;
    error: boolean;
    result: boolean;
    args: boolean;
}

export enum LogLevel {
    Info,
    Warning,
    Error,
    Debug,
}

export enum AttributeName {
    COMPONENT = 'component',
    MESSAGE = 'msg',
    RESULT = 'result',
    DOCUMENT = 'document',
    TRACE_ID = 'trace_id',
    NAME = 'name',
    TYPE = 'type',
    FIELD_NAME = 'field',
    SOURCE_NAME = 'source',
    VARIABLES = 'variables',
    ARGS = 'args',
    USER = 'user',
}

export enum Component {
    OPERATION = 'graphql-mesh-operation',
    DELEGATION = 'graphql-mesh-delegation',
}
