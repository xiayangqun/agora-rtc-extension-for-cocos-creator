export enum LOG_LEVEL {
    LOG_LEVEL_NONE = 0x0000,

    LOG_LEVEL_INFO = 0x0001,

    LOG_LEVEL_WARN = 0x0002,

    LOG_LEVEL_ERROR = 0x0004,

    LOG_LEVEL_FATAL = 0x0008,

    LOG_LEVEL_API_CALL = 0x0010,

    LOG_LEVEL_DEBUG = 0x0020,
}

export enum LOG_FILTER_TYPE {
    LOG_FILTER_OFF = 0,

    LOG_FILTER_DEBUG = 0x080f,

    LOG_FILTER_INFO = 0x000f,

    LOG_FILTER_WARN = 0x000e,

    LOG_FILTER_ERROR = 0x000c,

    LOG_FILTER_CRITICAL = 0x0008,

    LOG_FILTER_MASK = 0x80f,
}

export interface LogConfig {
    filePath: string;

    fileSizeInKB: number;

    level: LOG_LEVEL;
}
