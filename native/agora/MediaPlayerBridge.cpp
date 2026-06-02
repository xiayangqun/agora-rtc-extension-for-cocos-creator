#include "agora/MediaPlayerBridge.h"
#include "agora/MediaPlayerSourceObserverBridge.h"
#include "AgoraBase.h"
#include <utility>

MediaPlayerBridge::MediaPlayerBridge(agora::agora_refptr<agora::rtc::IMediaPlayer> mediaPlayer)
    : _mediaPlayer(std::move(mediaPlayer)) {}

MediaPlayerBridge::~MediaPlayerBridge() {
    invalidate();
}

int MediaPlayerBridge::getId() const {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->getMediaPlayerId();
}

bool MediaPlayerBridge::hasMediaPlayer() const {
    return static_cast<bool>(_mediaPlayer);
}

agora::agora_refptr<agora::rtc::IMediaPlayer> MediaPlayerBridge::mediaPlayer() const {
    return _mediaPlayer;
}

void MediaPlayerBridge::invalidate() {
    if (_playerSourceObserver != nullptr) {
        _playerSourceObserver->invalidateCallbacks();
        _playerSourceObserver.reset();
    }
    if (_mediaPlayer) { _mediaPlayer.reset(); }
}

int MediaPlayerBridge::open(const std::string &url, int64_t startPos) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->open(url.c_str(), startPos);
}

int MediaPlayerBridge::openWithMediaSource(const agora::media::base::MediaSource &source) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->openWithMediaSource(source);
}

int MediaPlayerBridge::play() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->play();
}

int MediaPlayerBridge::pause() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->pause();
}

int MediaPlayerBridge::stop() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->stop();
}

int MediaPlayerBridge::resume() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->resume();
}

int MediaPlayerBridge::seek(int64_t newPos) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->seek(newPos);
}

int MediaPlayerBridge::setAudioPitch(int pitch) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setAudioPitch(pitch);
}

GetDurationResult MediaPlayerBridge::getDuration() {
    GetDurationResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getDuration(result.duration);
    return result;
}

GetPlayPositionResult MediaPlayerBridge::getPlayPosition() {
    GetPlayPositionResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getPlayPosition(result.pos);
    return result;
}

GetStreamCountResult MediaPlayerBridge::getStreamCount() {
    GetStreamCountResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getStreamCount(result.count);
    return result;
}

GetStreamInfoResult MediaPlayerBridge::getStreamInfo(int64_t index) {
    GetStreamInfoResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getStreamInfo(index, &result.info);
    return result;
}

int MediaPlayerBridge::setLoopCount(int loopCount) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setLoopCount(loopCount);
}

int MediaPlayerBridge::setPlaybackSpeed(int speed) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setPlaybackSpeed(speed);
}

int MediaPlayerBridge::selectAudioTrack(int index) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->selectAudioTrack(index);
}

int MediaPlayerBridge::selectMultiAudioTrack(int playoutTrackIndex, int publishTrackIndex) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->selectMultiAudioTrack(playoutTrackIndex, publishTrackIndex);
}

int MediaPlayerBridge::setPlayerOption(const std::string &key, int value) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setPlayerOption(key.c_str(), value);
}

int MediaPlayerBridge::setPlayerOption(const std::string &key, const std::string &value) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setPlayerOption(key.c_str(), value.c_str());
}

int MediaPlayerBridge::takeScreenshot(const std::string &filename) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->takeScreenshot(filename.c_str());
}

int MediaPlayerBridge::selectInternalSubtitle(int index) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->selectInternalSubtitle(index);
}

int MediaPlayerBridge::setExternalSubtitle(const std::string &url) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setExternalSubtitle(url.c_str());
}

agora::media::base::MEDIA_PLAYER_STATE MediaPlayerBridge::getState() {
    if (!_mediaPlayer) { return agora::media::base::PLAYER_STATE_IDLE; }
    return _mediaPlayer->getState();
}

int MediaPlayerBridge::mute(bool muted) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->mute(muted);
}

GetMuteResult MediaPlayerBridge::getMute() {
    GetMuteResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getMute(result.muted);
    return result;
}

int MediaPlayerBridge::adjustPlayoutVolume(int volume) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->adjustPlayoutVolume(volume);
}

GetPlayoutVolumeResult MediaPlayerBridge::getPlayoutVolume() {
    GetPlayoutVolumeResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getPlayoutVolume(result.volume);
    return result;
}

int MediaPlayerBridge::adjustPublishSignalVolume(int volume) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->adjustPublishSignalVolume(volume);
}

GetPublishSignalVolumeResult MediaPlayerBridge::getPublishSignalVolume() {
    GetPublishSignalVolumeResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getPublishSignalVolume(result.volume);
    return result;
}

int MediaPlayerBridge::registerPlayerSourceObserver(se::Object *observer) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    if (observer == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    _playerSourceObserver = std::make_shared<MediaPlayerSourceObserverBridge>(observer);
    int ret = _mediaPlayer->registerPlayerSourceObserver(_playerSourceObserver.get());
    if (ret != 0) {
        _playerSourceObserver->invalidateCallbacks();
        _playerSourceObserver.reset();
    }
    return ret;
}

int MediaPlayerBridge::unregisterPlayerSourceObserver() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    if (_playerSourceObserver == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    int ret = _mediaPlayer->unregisterPlayerSourceObserver(_playerSourceObserver.get());
    _playerSourceObserver->invalidateCallbacks();
    _playerSourceObserver.reset();
    return ret;
}

int MediaPlayerBridge::setAudioDualMonoMode(agora::media::base::AUDIO_DUAL_MONO_MODE mode) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setAudioDualMonoMode(mode);
}

std::string MediaPlayerBridge::getPlayerSdkVersion() {
    if (!_mediaPlayer) { return ""; }
    return _mediaPlayer->getPlayerSdkVersion();
}

std::string MediaPlayerBridge::getPlaySrc() {
    if (!_mediaPlayer) { return ""; }
    return _mediaPlayer->getPlaySrc();
}

int MediaPlayerBridge::openWithAgoraCDNSrc(const std::string &src, int64_t startPos) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->openWithAgoraCDNSrc(src.c_str(), startPos);
}

int MediaPlayerBridge::getAgoraCDNLineCount() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->getAgoraCDNLineCount();
}

int MediaPlayerBridge::switchAgoraCDNLineByIndex(int index) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->switchAgoraCDNLineByIndex(index);
}

int MediaPlayerBridge::getCurrentAgoraCDNIndex() {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->getCurrentAgoraCDNIndex();
}

int MediaPlayerBridge::enableAutoSwitchAgoraCDN(bool enable) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->enableAutoSwitchAgoraCDN(enable);
}

int MediaPlayerBridge::renewAgoraCDNSrcToken(const std::string &token, int64_t ts) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->renewAgoraCDNSrcToken(token.c_str(), ts);
}

int MediaPlayerBridge::switchAgoraCDNSrc(const std::string &src, bool syncPts) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->switchAgoraCDNSrc(src.c_str(), syncPts);
}

int MediaPlayerBridge::switchSrc(const std::string &src, bool syncPts) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->switchSrc(src.c_str(), syncPts);
}

int MediaPlayerBridge::preloadSrc(const std::string &src, int64_t startPos) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->preloadSrc(src.c_str(), startPos);
}

int MediaPlayerBridge::playPreloadedSrc(const std::string &src) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->playPreloadedSrc(src.c_str());
}

int MediaPlayerBridge::unloadSrc(const std::string &src) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->unloadSrc(src.c_str());
}

int MediaPlayerBridge::setSpatialAudioParams(const agora::SpatialAudioParams &params) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setSpatialAudioParams(params);
}

int MediaPlayerBridge::setSoundPositionParams(float pan, float gain) {
    if (!_mediaPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaPlayer->setSoundPositionParams(pan, gain);
}

GetAudioBufferDelayResult MediaPlayerBridge::getAudioBufferDelay() {
    GetAudioBufferDelayResult result{};
    if (!_mediaPlayer) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.errorCode = _mediaPlayer->getAudioBufferDelay(result.delayMs);
    return result;
}
