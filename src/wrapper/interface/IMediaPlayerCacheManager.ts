export interface IMediaPlayerCacheManager {
    removeAllCaches(): number;

    removeOldCache(): number;

    removeCacheByUri(uri: string): number;

    setCacheDir(path: string): number;

    setMaxCacheFileCount(count: number): number;

    setMaxCacheFileSize(cacheSize: number): number;

    enableAutoRemoveCache(enable: boolean): number;

    getCacheDir(path: string, length: number): number;

    getMaxCacheFileCount(): number;

    getMaxCacheFileSize(): number;

    getCacheFileCount(): number;
}
