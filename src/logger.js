import log4js from 'log4js';

const getDefaultLogProvider = () => {
    const levels = {
        production: log4js.levels.ERROR.levelStr,
        test: log4js.levels.FATAL.levelStr,
        default: log4js.levels.DEBUG.levelStr,
    };

    const level = levels[process.env.NODE_ENV] ?? levels.default;

    log4js.configure({
        appenders: {
            console: { type: 'console' },
        },
        categories: {
            default: { appenders: [ 'console' ], level },
        },
    });

    return log4js.getLogger;
};
export const defaultLogProvider = getDefaultLogProvider()
export let getLogger = defaultLogProvider

const validate = (isValid, msg) => {
    if (!isValid) throw new TypeError(msg);
};

const validateLogProvider = provider => {
    validate(provider instanceof Function, 'Provider needs to be a function');

    const logger = provider('demo:logger');
    [ 'debug', 'info', 'warn', 'error' ].forEach(method =>
        validate(logger[method] instanceof Function, `Logger must implement ${method}`)
    )
};

export const useLogProvider = provider => {
    validateLogProvider(provider)
    getLogger = provider()
}
