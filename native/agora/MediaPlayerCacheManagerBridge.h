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

    bool hasCacheManager() const;
    agora::rtc::IMediaPlayerCacheManager *cacheManager() const;
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
    int64_t getMaxCacheFileSize();
    int getCacheFileCount();

private:
    agora::rtc::IMediaPlayerCacheManager *_cacheManager{nullptr};
};
