#include "agora/MusicContentCenterBridge.h"
#include "agora/MusicContentCenterEventHandlerBridge.h"
#include "agora/MusicPlayerBridge.h"

#include <algorithm>

#include "AgoraBase.h"
#include "bindings/jswrapper/SeApi.h"

MusicContentCenterBridge::MusicContentCenterBridge(agora::rtc::IMusicContentCenter *musicContentCenter)
    : _musicContentCenter(musicContentCenter) {}

MusicContentCenterBridge::~MusicContentCenterBridge() = default;

bool MusicContentCenterBridge::hasMusicContentCenter() const {
    return _musicContentCenter != nullptr;
}

agora::rtc::IMusicContentCenter *MusicContentCenterBridge::musicContentCenter() const {
    return _musicContentCenter;
}

void MusicContentCenterBridge::invalidate() {
    if (_eventHandler != nullptr) {
        _musicContentCenter->unregisterEventHandler();
        _eventHandler->invalidateCallbacks();
        _eventHandler.reset();
    }
    for (auto &player : _musicPlayers) {
        if (player) {
            if (_musicContentCenter) { _musicContentCenter->destroyMusicPlayer(player->musicPlayer()); }
            player->invalidate();
        }
    }
    _musicPlayers.clear();
}

int MusicContentCenterBridge::initialize(const agora::rtc::MusicContentCenterConfiguration &configuration) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicContentCenter->initialize(configuration);
}

int MusicContentCenterBridge::renewToken(const std::string &token) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicContentCenter->renewToken(token.c_str());
}

int MusicContentCenterBridge::registerEventHandler(se::Object *eventHandler) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    if (eventHandler == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    _eventHandler = std::make_shared<MusicContentCenterEventHandlerBridge>(eventHandler);
    int ret = _musicContentCenter->registerEventHandler(_eventHandler.get());
    if (ret != 0) {
        _eventHandler->invalidateCallbacks();
        _eventHandler.reset();
    }
    return ret;
}

int MusicContentCenterBridge::unregisterEventHandler() {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    int ret = _musicContentCenter->unregisterEventHandler();
    if (_eventHandler != nullptr) {
        _eventHandler->invalidateCallbacks();
        _eventHandler.reset();
    }
    return ret;
}

MusicPlayerBridge *MusicContentCenterBridge::createMusicPlayer() {
    if (!_musicContentCenter) { return nullptr; }
    auto player = _musicContentCenter->createMusicPlayer();
    if (!player) { return nullptr; }
    auto bridge = std::make_shared<MusicPlayerBridge>(player);
    _musicPlayers.push_back(bridge);
    return bridge.get();
}

int MusicContentCenterBridge::destroyMusicPlayer(MusicPlayerBridge *musicPlayer) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    if (!musicPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    int ret = _musicContentCenter->destroyMusicPlayer(musicPlayer->musicPlayer());
    musicPlayer->invalidate();
    auto it = std::find_if(_musicPlayers.begin(), _musicPlayers.end(),
        [musicPlayer](const std::shared_ptr<MusicPlayerBridge>& ptr) {
            return ptr.get() == musicPlayer;
        });
    if (it != _musicPlayers.end()) { it->reset(); }
    return ret;
}

MCCRequestResult MusicContentCenterBridge::getMusicCharts() {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    agora::util::AString requestId;
    int ret = _musicContentCenter->getMusicCharts(requestId);
    return {ret, std::string(requestId->c_str())};
}

MCCRequestResult MusicContentCenterBridge::getMusicCollectionByMusicChartId(int32_t musicChartId, int32_t page,
                                                                            int32_t pageSize,
                                                                            const std::string &jsonOption) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    agora::util::AString requestId;
    const char *opt = jsonOption.empty() ? nullptr : jsonOption.c_str();
    int ret = _musicContentCenter->getMusicCollectionByMusicChartId(requestId, musicChartId, page, pageSize, opt);
    return {ret, std::string(requestId->c_str())};
}

MCCRequestResult MusicContentCenterBridge::searchMusic(const std::string &keyword, int32_t page, int32_t pageSize,
                                                       const std::string &jsonOption) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    agora::util::AString requestId;
    const char *opt = jsonOption.empty() ? nullptr : jsonOption.c_str();
    int ret = _musicContentCenter->searchMusic(requestId, keyword.c_str(), page, pageSize, opt);
    return {ret, std::string(requestId->c_str())};
}

int MusicContentCenterBridge::preload(int64_t songCode, const std::string &jsonOption) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicContentCenter->preload(songCode, jsonOption.c_str());
}

MCCRequestResult MusicContentCenterBridge::preload(int64_t songCode) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    agora::util::AString requestId;
    int ret = _musicContentCenter->preload(requestId, songCode);
    return {ret, std::string(requestId->c_str())};
}

int MusicContentCenterBridge::removeCache(int64_t songCode) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicContentCenter->removeCache(songCode);
}

GetCachesResult MusicContentCenterBridge::getCaches(int cacheInfoSize) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, {}}; }
    std::vector<agora::rtc::MusicCacheInfo> cacheInfo(static_cast<size_t>(cacheInfoSize));
    int32_t size = cacheInfoSize;
    int ret = _musicContentCenter->getCaches(cacheInfo.data(), &size);
    if (size > 0) { cacheInfo.resize(static_cast<size_t>(size)); }
    return {ret, cacheInfo};
}

int MusicContentCenterBridge::isPreloaded(int64_t songCode) {
    if (!_musicContentCenter) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicContentCenter->isPreloaded(songCode);
}

MCCRequestResult MusicContentCenterBridge::getLyric(int64_t songCode, int32_t lyricType) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    agora::util::AString requestId;
    int ret = _musicContentCenter->getLyric(requestId, songCode, lyricType);
    return {ret, std::string(requestId->c_str())};
}

MCCRequestResult MusicContentCenterBridge::getSongSimpleInfo(int64_t songCode) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    agora::util::AString requestId;
    int ret = _musicContentCenter->getSongSimpleInfo(requestId, songCode);
    return {ret, std::string(requestId->c_str())};
}

GetInternalSongCodeResult MusicContentCenterBridge::getInternalSongCode(int64_t songCode,
                                                                        const std::string &jsonOption) {
    if (!_musicContentCenter) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int64_t internalSongCode = 0;
    const char *opt = jsonOption.empty() ? nullptr : jsonOption.c_str();
    int ret = _musicContentCenter->getInternalSongCode(songCode, opt, internalSongCode);
    // Cast to long to prevent JavaScript BigInt conversion.
    return {ret, static_cast<long>(internalSongCode)};
}
