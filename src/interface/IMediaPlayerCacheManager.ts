export interface IMediaPlayerCacheManager {
    removeAllCaches(): Promise<number>;

    removeOldCache(): Promise<number>;

    removeCacheByUri(uri: string): Promise<number>;

    setCacheDir(path: string): Promise<number>;

    setMaxCacheFileCount(count: number): Promise<number>;

    setMaxCacheFileSize(cacheSize: number): Promise<number>;

    enableAutoRemoveCache(enable: boolean): Promise<number>;

    getCacheDir(path: string, length: number): Promise<number>;

    getMaxCacheFileCount(): Promise<number>;

    getMaxCacheFileSize(): Promise<number>;

    getCacheFileCount(): Promise<number>;
}
