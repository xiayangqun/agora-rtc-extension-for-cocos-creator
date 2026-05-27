export interface IMediaPlayerCacheManager {
    removeAllCaches(): Promise<number>;

    removeOldCache(): Promise<number>;

    removeCacheByUri(uri: string): Promise<number>;

    setCacheDir(path: string): Promise<number>;

    setMaxCacheFileCount(count: number): Promise<number>;

    setMaxCacheFileSize(cacheSize: number): Promise<number>;

    enableAutoRemoveCache(enable: boolean): Promise<number>;

    getCacheDir(): Promise<{ path: string; errorCode: number }>;

    getMaxCacheFileCount(): Promise<number>;

    getMaxCacheFileSize(): Promise<number>;

    getCacheFileCount(): Promise<number>;
}
