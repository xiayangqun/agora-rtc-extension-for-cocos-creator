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

    //todo jsb ignore
    bool hasCacheManager() const;

    //todo jsb ignore
    agora::rtc::IMediaPlayerCacheManager *cacheManager() const;

    //todo jsb ignore
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
