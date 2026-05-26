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

GetCacheDirResult MediaPlayerCacheManagerBridge::getCacheDir(int length) {
    if (!_cacheManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    std::string path(static_cast<size_t>(length), '\0');
    int ret = _cacheManager->getCacheDir(&path[0], length);
    if (ret == 0) { path.resize(path.find('\0')); }
    return {ret, path};
}

GetMaxCacheFileCountResult MediaPlayerCacheManagerBridge::getMaxCacheFileCount() {
    if (!_cacheManager) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int count = _cacheManager->getMaxCacheFileCount();
    return {0, count};
}

GetMaxCacheFileSizeResult MediaPlayerCacheManagerBridge::getMaxCacheFileSize() {
    if (!_cacheManager) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int64_t cacheSize = _cacheManager->getMaxCacheFileSize();
    return {0, cacheSize};
}

GetCacheFileCountResult MediaPlayerCacheManagerBridge::getCacheFileCount() {
    if (!_cacheManager) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int count = _cacheManager->getCacheFileCount();
    return {0, count};
}
