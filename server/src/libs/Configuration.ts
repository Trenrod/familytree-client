import { config } from "process";
import { isNumber } from "util";
import Logger from "./Logger";

const log = Logger.getInstance();

enum CONFIG_NAMES {
    FT_DB_USER = "FT_DB_USER",
    FT_DB_PASSWORD = "FT_DB_PASSWORD",
    FT_DB_HOST = "FT_DB_HOST",
    FT_DB_PORT = "FT_DB_PORT",
    FT_DB_NAME = "FT_DB_NAME",
}

class ConfigManager {
    private static instance: ConfigManager | null = null;
    private constructor() { }

    private map: Map<CONFIG_NAMES, string> = new Map();

    public static getInstance(): ConfigManager {
        if (ConfigManager.instance == null) {
            ConfigManager.instance = new ConfigManager();
            ConfigManager.instance.init();
        }
        return ConfigManager.instance;
    }

    private init() {
        for (const configNameStr in CONFIG_NAMES) {
            const configName: CONFIG_NAMES = CONFIG_NAMES[configNameStr as keyof typeof CONFIG_NAMES];
            const value = process.env[configNameStr];
            if (value)
                this.map.set(configName, value);
            else {
                log.error(`System stops. Failed to load env variable ${configName}`);
                process.exit(1);
            }
        }
    }

    public getValue(configName: CONFIG_NAMES): string {
        const value = this.map.get(configName);
        if (value == null) {
            log.error(`System stops. Failed to load env variable ${configName}`);
            process.exit(1);
        } else {
            return value;
        }
    }
}

export {
    CONFIG_NAMES,
    ConfigManager
};
