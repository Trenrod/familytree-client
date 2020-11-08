import winston from 'winston';

export default class Logger {
    private static instance: Logger | null = null;
    private constructor() { }
    private logger: winston.Logger | null = null;

    public static getInstance(): winston.Logger {
        if (Logger.instance == null) {
            Logger.instance = new Logger();
            Logger.instance.init();
        }
        return Logger.instance.logger!;
    }

    private init() {
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'familytree.log' }),
            ],
        });
    }
}
// const manager = require('simple-node-logger').createLogManager();