#pragma once

#include "IAgoraMediaPlayer.h"
#include <string>

struct GetCacheDirResult {
    int errorCode;
    std::string path;
};

class MediaPlayerCacheManagerBridge {
public:
    explicit MediaPlayerCacheManagerBridge(agora::rtc::IMediaPlayerCacheManager *cacheManager);
    ~MediaPlayerCacheManagerBridge();

    //jsb ignore
    bool hasCacheManager() const;

    //jsb ignore
    agora::rtc::IMediaPlayerCacheManager *cacheManager() const;

    //jsb ignore
    void invalidate();

    int removeAllCaches();
    int removeOldCache();
    int removeCacheByUri(const std::string &uri);
    int setCacheDir(const std::string &path);
    int setMaxCacheFileCount(int count);
    int setMaxCacheFileSize(int64_t cacheSize);
    int enableAutoRemoveCache(bool enable);
    GetCacheDirResult getCacheDir();
    int getMaxCacheFileCount();
    // Use long instead of int64_t to prevent JavaScript BigInt conversion.
    // Cocos engine converts long → number, int64_t → BigInt.
    long getMaxCacheFileSize();
    int getCacheFileCount();

private:
    agora::rtc::IMediaPlayerCacheManager *_cacheManager{nullptr};
};
