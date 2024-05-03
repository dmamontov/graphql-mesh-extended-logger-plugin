import { type Logger } from '@graphql-mesh/types';
import { LogLevel } from './types';

export const removeTypename = (obj: object): object => {
    if (Array.isArray(obj)) return obj.map(removeTypename);
    if (typeof obj !== 'object' || obj === null) return obj;

    return Object.fromEntries(
        Object.entries(obj)
            .filter(([key]) => key !== '__typename')
            .map(([key, val]) => [key, removeTypename(val)]),
    );
};

export const toLog = (logger: Logger, level: LogLevel, message: any): void => {
    switch (level) {
        case LogLevel.Info: {
            logger.info(message);

            break;
        }
        case LogLevel.Debug: {
            logger.debug(message);

            break;
        }
        case LogLevel.Warning: {
            logger.warn(message);

            break;
        }
        case LogLevel.Error: {
            logger.error(message);

            break;
        }
    }
};
