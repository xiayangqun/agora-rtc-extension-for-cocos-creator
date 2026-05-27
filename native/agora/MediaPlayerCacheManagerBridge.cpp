#include "agora/MediaPlayerCacheManagerBridge.h"

#include "AgoraBase.h"

MediaPlayerCacheManagerBridge::MediaPlayerCacheManagerBridge(agora::rtc::IMediaPlayerCacheManager *cacheManager)
    : _cacheManager(cacheManager) {}

MediaPlayerCacheManagerBridge::~MediaPlayerCacheManagerBridge() {
    invalidate();
}

bool MediaPlayerCacheManagerBridge::hasCacheManager() const {
    return _cacheManager != nullptr;
}

agora::rtc::IMediaPlayerCacheManager *MediaPlayerCacheManagerBridge::cacheManager() const {
    return _cacheManager;
}

void MediaPlayerCacheManagerBridge::invalidate() {
    if (_cacheManager != nullptr) { _cacheManager = nullptr; }
}

int MediaPlayerCacheManagerBridge::removeAllCaches() {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->removeAllCaches();
}

int MediaPlayerCacheManagerBridge::removeOldCache() {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->removeOldCache();
}

int MediaPlayerCacheManagerBridge::removeCacheByUri(const std::string &uri) {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->removeCacheByUri(uri.c_str());
}

int MediaPlayerCacheManagerBridge::setCacheDir(const std::string &path) {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->setCacheDir(path.c_str());
}

int MediaPlayerCacheManagerBridge::setMaxCacheFileCount(int count) {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->setMaxCacheFileCount(count);
}

int MediaPlayerCacheManagerBridge::setMaxCacheFileSize(int64_t cacheSize) {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->setMaxCacheFileSize(cacheSize);
}

int MediaPlayerCacheManagerBridge::enableAutoRemoveCache(bool enable) {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->enableAutoRemoveCache(enable);
}

GetCacheDirResult MediaPlayerCacheManagerBridge::getCacheDir() {
    if (!_cacheManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    constexpr int kCacheDirBufferSize = 1024;
    std::string path(static_cast<size_t>(kCacheDirBufferSize), '\0');
    int ret = _cacheManager->getCacheDir(&path[0], kCacheDirBufferSize);
    if (ret == 0) { path.resize(path.find('\0')); }
    return {ret, path};
}

int MediaPlayerCacheManagerBridge::getMaxCacheFileCount() {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->getMaxCacheFileCount();
}

int64_t MediaPlayerCacheManagerBridge::getMaxCacheFileSize() {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->getMaxCacheFileSize();
}

int MediaPlayerCacheManagerBridge::getCacheFileCount() {
    if (!_cacheManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _cacheManager->getCacheFileCount();
}
