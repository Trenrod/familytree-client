export enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
    FATAL
}

export class Logger {
    private static instance: Logger | null = null;
    private constructor() { }

    public static getInstance(): Logger {
        if (Logger.instance == null) {
            Logger.instance = new Logger();
            Logger.instance.init();
        }
        return Logger.instance!;
    }

    private init() {
    }

    public log(logLevel: LogLevel, message: string, meta: object | undefined, exception: Error | undefined) {
        switch (logLevel) {
            case LogLevel.DEBUG:
                console.log(Object.assign({}, {
                    timestamp: new Date(),
                    message,
                    meta,
                    exception
                }));
                break;
            case LogLevel.INFO:
                console.info(Object.assign({}, {
                    timestamp: new Date(),
                    message,
                    meta,
                    exception
                }));
                break;
            case LogLevel.ERROR:
                console.error(Object.assign({}, {
                    timestamp: new Date(),
                    message,
                    meta,
                    exception
                }));
                break;
        }
    }

    public static debug(message: string, meta: object = {}) {
        Logger.getInstance().log(LogLevel.DEBUG, message, meta, undefined);
    }

    public static info(message: string, meta: object = {}) {
        Logger.getInstance().log(LogLevel.INFO, message, meta, undefined);
    }

    public static error(message: string, meta: object = {}, error: Error | undefined) {
        Logger.getInstance().log(LogLevel.ERROR, message, meta, error);
    }
}
