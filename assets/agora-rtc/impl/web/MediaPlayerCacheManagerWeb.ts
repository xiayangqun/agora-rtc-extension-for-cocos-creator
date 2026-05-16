import { IMediaPlayerCacheManager } from "../../interface/IMediaPlayerCacheManager";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class MediaPlayerCacheManagerWeb implements IMediaPlayerCacheManager {
    async removeAllCaches(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async removeOldCache(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async removeCacheByUri(uri: string): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setCacheDir(path: string): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setMaxCacheFileCount(count: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setMaxCacheFileSize(cacheSize: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async enableAutoRemoveCache(enable: boolean): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getCacheDir(path: string, length: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getMaxCacheFileCount(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getMaxCacheFileSize(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getCacheFileCount(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }
}
