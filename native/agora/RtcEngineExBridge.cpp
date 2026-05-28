#include "agora/RtcEngineExBridge.h"

#include "agora/RtcEngineEventHandlerExBridge.h"
#include "agora/AudioDeviceManagerBridge.h"
#include "agora/H265TranscoderBridge.h"
#include "agora/LocalSpatialAudioEngineBridge.h"
#include "agora/MediaPlayerBridge.h"
#include "agora/MediaPlayerCacheManagerBridge.h"
#include "agora/MediaRecorderBridge.h"
#include "agora/MusicContentCenterBridge.h"
#include "agora/ScreenCaptureSourceListBridge.h"
#include "agora/VideoDeviceManagerBridge.h"
#include "agora/VideoEffectObjectBridge.h"

#include "IAgoraMediaPlayer.h"
#include "IAgoraMediaRecorder.h"

#include <algorithm>

namespace {
const char *nullableCString(const std::string &value) {
    return value.empty() ? nullptr : value.c_str();
}
} // namespace

RtcEngineExBridge::RtcEngineExBridge() = default;

RtcEngineExBridge::~RtcEngineExBridge() {}

void RtcEngineExBridge::release(bool sync) {
    (void)sync;
    if (_eventHandler != nullptr) {
        // Queued Cocos-thread callbacks may still hold the handler alive after release(),
        // but they must not call back into TS once the engine has been released.
        _eventHandler->invalidateCallbacks();
    }
    releaseMediaPlayers();
    releaseMediaRecorders();
    releaseVideoEffects();
    if (_screenCaptureSources) {
        _screenCaptureSources->invalidate();
        _screenCaptureSources.reset();
    }
    if (_audioDeviceManager) {
        _audioDeviceManager->invalidate();
        _audioDeviceManager.reset();
    }
    if (_videoDeviceManager) {
        _videoDeviceManager->invalidate();
        _videoDeviceManager.reset();
    }
    if (_musicContentCenter) {
        _musicContentCenter->invalidate();
        _musicContentCenter.reset();
    }
    if (_mediaPlayerCacheManager) {
        _mediaPlayerCacheManager->invalidate();
        _mediaPlayerCacheManager.reset();
    }
    if (_localSpatialAudioEngine) {
        _localSpatialAudioEngine->invalidate();
        _localSpatialAudioEngine.reset();
    }
    if (_h265Transcoder) {
        _h265Transcoder->invalidate();
        _h265Transcoder.reset();
    }
    if (_engine != nullptr) {
        agora::rtc::IRtcEngine::release(nullptr);
        _engine = nullptr;
    }
    _eventHandler.reset();
    delete this;
}

void RtcEngineExBridge::releaseMediaPlayers() {
    // Media player bridge objects may still be referenced by TS after engine release.
    // Clear their SDK refs first so stale TS objects cannot operate on released SDK state.
    for (const auto &mediaPlayerBridge : _mediaPlayers) {
        if (mediaPlayerBridge == nullptr) { continue; }
        if (_engine != nullptr && mediaPlayerBridge->hasMediaPlayer()) {
            _engine->destroyMediaPlayer(mediaPlayerBridge->mediaPlayer());
        }
        mediaPlayerBridge->invalidate();
    }
    _mediaPlayers.clear();
}

void RtcEngineExBridge::releaseMediaRecorders() {
    if (_engine != nullptr) {
        for (auto &bridge : _mediaRecorders) {
            if (bridge && bridge->hasMediaRecorder()) { _engine->destroyMediaRecorder(bridge->mediaRecorder()); }
            if (bridge) { bridge->invalidate(); }
        }
    }
    _mediaRecorders.clear();
}

void RtcEngineExBridge::releaseVideoEffects() {
    if (_engine != nullptr) {
        for (auto &bridge : _videoEffects) {
            if (bridge && bridge->hasVideoEffectObject()) {
                _engine->destroyVideoEffectObject(bridge->videoEffectObject());
            }
            if (bridge) { bridge->invalidate(); }
        }
    }
    _videoEffects.clear();
}

int RtcEngineExBridge::initialize(const agora::rtc::RtcEngineContext &context, se::Object *eventHandler) {
    release(true);
    _engine = static_cast<agora::rtc::IRtcEngineEx *>(createAgoraRtcEngine());
    if (_engine == nullptr) { return -1; }
    _eventHandler = std::make_shared<RtcEngineEventHandlerExBridge>(eventHandler);
    agora::rtc::RtcEngineContext rtcContext = context;
    rtcContext.eventHandler = _eventHandler.get();
    return _engine->initialize(rtcContext);
}

AudioDeviceManagerBridge *RtcEngineExBridge::getAudioDeviceManager() {
    if (_engine == nullptr) { return nullptr; }
    if (!_audioDeviceManager || !_audioDeviceManager->hasAudioDeviceManager()) {
        agora::rtc::IAudioDeviceManager *rawPtr = nullptr;
        _engine->queryInterface(agora::rtc::AGORA_IID_AUDIO_DEVICE_MANAGER, reinterpret_cast<void **>(&rawPtr));
        if (!rawPtr) { return nullptr; }
        _audioDeviceManager =
            std::make_shared<AudioDeviceManagerBridge>(agora::agora_refptr<agora::rtc::IAudioDeviceManager>(rawPtr));
    }
    return _audioDeviceManager.get();
}

VideoDeviceManagerBridge *RtcEngineExBridge::getVideoDeviceManager() {
    if (_engine == nullptr) { return nullptr; }
    if (!_videoDeviceManager || !_videoDeviceManager->hasVideoDeviceManager()) {
        agora::rtc::IVideoDeviceManager *rawPtr = nullptr;
        _engine->queryInterface(agora::rtc::AGORA_IID_VIDEO_DEVICE_MANAGER, reinterpret_cast<void **>(&rawPtr));
        if (!rawPtr) { return nullptr; }
        _videoDeviceManager = std::make_shared<VideoDeviceManagerBridge>(rawPtr);
    }
    return _videoDeviceManager.get();
}

MusicContentCenterBridge *RtcEngineExBridge::getMusicContentCenter() {
    if (_engine == nullptr) { return nullptr; }
    if (!_musicContentCenter || !_musicContentCenter->hasMusicContentCenter()) {
        agora::rtc::IMusicContentCenter *rawPtr = nullptr;
        _engine->queryInterface(agora::rtc::AGORA_IID_MUSIC_CONTENT_CENTER, reinterpret_cast<void **>(&rawPtr));
        if (!rawPtr) { return nullptr; }
        _musicContentCenter = std::make_shared<MusicContentCenterBridge>(rawPtr);
    }
    return _musicContentCenter.get();
}

MediaPlayerCacheManagerBridge *RtcEngineExBridge::getMediaPlayerCacheManager() {
    if (!_mediaPlayerCacheManager || !_mediaPlayerCacheManager->hasCacheManager()) {
        auto *cacheManager = ::getMediaPlayerCacheManager();
        if (!cacheManager) { return nullptr; }
        _mediaPlayerCacheManager = std::make_shared<MediaPlayerCacheManagerBridge>(cacheManager);
    }
    return _mediaPlayerCacheManager.get();
}

LocalSpatialAudioEngineBridge *RtcEngineExBridge::getLocalSpatialAudioEngine() {
    if (_engine == nullptr) { return nullptr; }
    if (!_localSpatialAudioEngine || !_localSpatialAudioEngine->hasSpatialAudioEngine()) {
        agora::rtc::ILocalSpatialAudioEngine *rawPtr = nullptr;
        _engine->queryInterface(agora::rtc::AGORA_IID_LOCAL_SPATIAL_AUDIO, reinterpret_cast<void **>(&rawPtr));
        if (!rawPtr) { return nullptr; }
        agora::rtc::LocalSpatialAudioConfig config{};
        config.rtcEngine = _engine;
        rawPtr->initialize(config);
        _localSpatialAudioEngine = std::make_shared<LocalSpatialAudioEngineBridge>(
            agora::agora_refptr<agora::rtc::ILocalSpatialAudioEngine>(rawPtr));
    }
    return _localSpatialAudioEngine.get();
}

H265TranscoderBridge *RtcEngineExBridge::getH265Transcoder() {
    if (_engine == nullptr) { return nullptr; }
    if (!_h265Transcoder || !_h265Transcoder->hasH265Transcoder()) {
        agora::rtc::IH265Transcoder *rawPtr = nullptr;
        _engine->queryInterface(agora::rtc::AGORA_IID_H265_TRANSCODER, reinterpret_cast<void **>(&rawPtr));
        if (!rawPtr) { return nullptr; }
        _h265Transcoder =
            std::make_shared<H265TranscoderBridge>(agora::agora_refptr<agora::rtc::IH265Transcoder>(rawPtr));
    }
    return _h265Transcoder.get();
}

GetVersionResult RtcEngineExBridge::getVersion() {
    GetVersionResult result{};
    if (_engine == nullptr) { return result; }
    int build = 0;
    result.version = _engine->getVersion(&build);
    result.build = build;
    return result;
}

std::string RtcEngineExBridge::getErrorDescription(int code) {
    if (_engine == nullptr) { return ""; }
    return _engine->getErrorDescription(code);
}

QueryCodecCapabilityResult RtcEngineExBridge::queryCodecCapability(int &size) {
    QueryCodecCapabilityResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }

    result.codecInfo.resize(size);
    result.errorCode = _engine->queryCodecCapability(result.codecInfo.data(), size);
    if (size < result.codecInfo.size()) {
        // Shrink codecInfo to the actual item count so the result does not contain unused entries.
        result.codecInfo.resize(static_cast<size_t>(size));
    }
    return result;
}

int RtcEngineExBridge::queryDeviceScore() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->queryDeviceScore();
}

int RtcEngineExBridge::preloadChannel(const std::string &token, const std::string &channelId, agora::rtc::uid_t uid) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadChannel(nullableCString(token), channelId.c_str(), uid);
}

int RtcEngineExBridge::preloadChannelWithUserAccount(const std::string &token, const std::string &channelId,
                                                     const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadChannelWithUserAccount(nullableCString(token), channelId.c_str(), userAccount.c_str());
}

int RtcEngineExBridge::updatePreloadChannelToken(const std::string &token) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updatePreloadChannelToken(nullableCString(token));
}

int RtcEngineExBridge::joinChannel(const std::string &token, const std::string &channelId, const std::string &info,
                                   agora::rtc::uid_t uid) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannel(nullableCString(token), channelId.c_str(), nullableCString(info), uid);
}

int RtcEngineExBridge::joinChannel(const std::string &token, const std::string &channelId, agora::rtc::uid_t uid,
                                   const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannel(nullableCString(token), channelId.c_str(), uid, options);
}

int RtcEngineExBridge::updateChannelMediaOptions(const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateChannelMediaOptions(options);
}

int RtcEngineExBridge::leaveChannel() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannel();
}

int RtcEngineExBridge::leaveChannel(const agora::rtc::LeaveChannelOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannel(options);
}

int RtcEngineExBridge::renewToken(const std::string &token) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->renewToken(nullableCString(token));
}

int RtcEngineExBridge::setChannelProfile(agora::CHANNEL_PROFILE_TYPE profile) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setChannelProfile(profile);
}

int RtcEngineExBridge::setClientRole(agora::rtc::CLIENT_ROLE_TYPE role) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setClientRole(role);
}

int RtcEngineExBridge::setClientRole(agora::rtc::CLIENT_ROLE_TYPE role, const agora::rtc::ClientRoleOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setClientRole(role, options);
}

int RtcEngineExBridge::startEchoTest(const agora::rtc::EchoTestConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startEchoTest(config);
}

int RtcEngineExBridge::stopEchoTest() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopEchoTest();
}

int RtcEngineExBridge::enableMultiCamera(bool enabled, const agora::rtc::CameraCapturerConfiguration &config) {
    (void)enabled;
    (void)config;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::enableVideo() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVideo();
}

int RtcEngineExBridge::disableVideo() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->disableVideo();
}

int RtcEngineExBridge::startPreview() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startPreview();
}

int RtcEngineExBridge::startPreview(agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startPreview(sourceType);
}

int RtcEngineExBridge::stopPreview() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopPreview();
}

int RtcEngineExBridge::stopPreview(agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopPreview(sourceType);
}

int RtcEngineExBridge::startLastmileProbeTest(const agora::rtc::LastmileProbeConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startLastmileProbeTest(config);
}

int RtcEngineExBridge::stopLastmileProbeTest() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopLastmileProbeTest();
}

int RtcEngineExBridge::setVideoEncoderConfiguration(const agora::rtc::VideoEncoderConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoEncoderConfiguration(config);
}

int RtcEngineExBridge::setBeautyEffectOptions(bool enabled, const agora::rtc::BeautyOptions &options,
                                              agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setBeautyEffectOptions(enabled, options, type);
}

int RtcEngineExBridge::setFaceShapeBeautyOptions(bool enabled, const agora::rtc::FaceShapeBeautyOptions &options,
                                                 agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setFaceShapeBeautyOptions(enabled, options, type);
}

int RtcEngineExBridge::setFaceShapeAreaOptions(const agora::rtc::FaceShapeAreaOptions &options,
                                               agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setFaceShapeAreaOptions(options, type);
}

GetFaceShapeBeautyOptionsResult RtcEngineExBridge::getFaceShapeBeautyOptions(agora::media::MEDIA_SOURCE_TYPE type) {
    GetFaceShapeBeautyOptionsResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getFaceShapeBeautyOptions(result.options, type);
    return result;
}

GetFaceShapeAreaOptionsResult RtcEngineExBridge::getFaceShapeAreaOptions(
    agora::rtc::FaceShapeAreaOptions::FACE_SHAPE_AREA shapeArea, agora::media::MEDIA_SOURCE_TYPE type) {
    GetFaceShapeAreaOptionsResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getFaceShapeAreaOptions(shapeArea, result.options, type);
    return result;
}

int RtcEngineExBridge::setFilterEffectOptions(bool enabled, const agora::rtc::FilterEffectOptions &options,
                                              agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setFilterEffectOptions(enabled, options, type);
}

VideoEffectObjectBridge *RtcEngineExBridge::createVideoEffectObject(const std::string &bundlePath,
                                                                    agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return nullptr; }
    auto effect = _engine->createVideoEffectObject(bundlePath.c_str(), type);
    if (!effect) { return nullptr; }
    auto bridge = std::make_shared<VideoEffectObjectBridge>(effect);
    _videoEffects.push_back(bridge);
    return bridge.get();
}

int RtcEngineExBridge::destroyVideoEffectObject(VideoEffectObjectBridge *videoEffectObject) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    if (!videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    int ret = _engine->destroyVideoEffectObject(videoEffectObject->videoEffectObject());
    if (ret == 0) {
        videoEffectObject->invalidate();
        auto it = std::find_if(_videoEffects.begin(), _videoEffects.end(),
                               [videoEffectObject](const std::shared_ptr<VideoEffectObjectBridge> &ptr) {
                                   return ptr.get() == videoEffectObject;
                               });
        if (it != _videoEffects.end()) { _videoEffects.erase(it); }
    }
    return ret;
}

int RtcEngineExBridge::setLowlightEnhanceOptions(bool enabled, const agora::rtc::LowlightEnhanceOptions &options,
                                                 agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLowlightEnhanceOptions(enabled, options, type);
}

int RtcEngineExBridge::setVideoDenoiserOptions(bool enabled, const agora::rtc::VideoDenoiserOptions &options,
                                               agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoDenoiserOptions(enabled, options, type);
}

int RtcEngineExBridge::setColorEnhanceOptions(bool enabled, const agora::rtc::ColorEnhanceOptions &options,
                                              agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setColorEnhanceOptions(enabled, options, type);
}

int RtcEngineExBridge::enableVirtualBackground(bool enabled,
                                               const agora::rtc::VirtualBackgroundSource &backgroundSource,
                                               const agora::rtc::SegmentationProperty &segproperty,
                                               agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVirtualBackground(enabled, backgroundSource, segproperty, type);
}

int RtcEngineExBridge::setupRemoteVideo(const agora::rtc::VideoCanvas &canvas) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setupRemoteVideo(canvas);
}

int RtcEngineExBridge::setupLocalVideo(const agora::rtc::VideoCanvas &canvas) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setupLocalVideo(canvas);
}

int RtcEngineExBridge::setVideoScenario(agora::rtc::VIDEO_APPLICATION_SCENARIO_TYPE scenarioType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoScenario(scenarioType);
}

int RtcEngineExBridge::setVideoQoEPreference(agora::rtc::VIDEO_QOE_PREFERENCE_TYPE qoePreference) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoQoEPreference(qoePreference);
}

int RtcEngineExBridge::enableAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudio();
}

int RtcEngineExBridge::disableAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->disableAudio();
}

int RtcEngineExBridge::setAudioProfile(agora::rtc::AUDIO_PROFILE_TYPE profile,
                                       agora::rtc::AUDIO_SCENARIO_TYPE scenario) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioProfile(profile, scenario);
}

int RtcEngineExBridge::setAudioProfile(agora::rtc::AUDIO_PROFILE_TYPE profile) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioProfile(profile);
}

int RtcEngineExBridge::setAudioScenario(agora::rtc::AUDIO_SCENARIO_TYPE scenario) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioScenario(scenario);
}

int RtcEngineExBridge::enableLocalAudio(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLocalAudio(enabled);
}

int RtcEngineExBridge::muteLocalAudioStream(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteLocalAudioStream(mute);
}

int RtcEngineExBridge::muteAllRemoteAudioStreams(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteAllRemoteAudioStreams(mute);
}

int RtcEngineExBridge::muteRemoteAudioStream(agora::rtc::uid_t uid, bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRemoteAudioStream(uid, mute);
}

int RtcEngineExBridge::muteLocalVideoStream(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteLocalVideoStream(mute);
}

int RtcEngineExBridge::enableLocalVideo(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLocalVideo(enabled);
}

int RtcEngineExBridge::muteAllRemoteVideoStreams(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteAllRemoteVideoStreams(mute);
}

int RtcEngineExBridge::setRemoteDefaultVideoStreamType(agora::rtc::VIDEO_STREAM_TYPE streamType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteDefaultVideoStreamType(streamType);
}

int RtcEngineExBridge::muteRemoteVideoStream(agora::rtc::uid_t uid, bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRemoteVideoStream(uid, mute);
}

int RtcEngineExBridge::setRemoteVideoStreamType(agora::rtc::uid_t uid, agora::rtc::VIDEO_STREAM_TYPE streamType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVideoStreamType(uid, streamType);
}

int RtcEngineExBridge::setRemoteVideoSubscriptionOptions(agora::rtc::uid_t uid,
                                                         const agora::rtc::VideoSubscriptionOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVideoSubscriptionOptions(uid, options);
}

int RtcEngineExBridge::setSubscribeAudioBlocklist(const std::vector<agora::rtc::uid_t> &uidList) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeAudioBlocklist(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                               static_cast<int>(uidList.size()));
}

int RtcEngineExBridge::setSubscribeAudioAllowlist(const std::vector<agora::rtc::uid_t> &uidList) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeAudioAllowlist(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                               static_cast<int>(uidList.size()));
}

int RtcEngineExBridge::setSubscribeVideoBlocklist(const std::vector<agora::rtc::uid_t> &uidList) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeVideoBlocklist(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                               static_cast<int>(uidList.size()));
}

int RtcEngineExBridge::setSubscribeVideoAllowlist(const std::vector<agora::rtc::uid_t> &uidList) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeVideoAllowlist(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                               static_cast<int>(uidList.size()));
}

int RtcEngineExBridge::enableAudioVolumeIndication(int interval, int smooth, bool reportVad) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudioVolumeIndication(interval, smooth, reportVad);
}

int RtcEngineExBridge::startAudioRecording(const std::string &filePath,
                                           agora::rtc::AUDIO_RECORDING_QUALITY_TYPE quality) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioRecording(filePath.c_str(), quality);
}

int RtcEngineExBridge::startAudioRecording(const std::string &filePath, int sampleRate,
                                           agora::rtc::AUDIO_RECORDING_QUALITY_TYPE quality) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioRecording(filePath.c_str(), sampleRate, quality);
}

int RtcEngineExBridge::startAudioRecording(const agora::rtc::AudioRecordingConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioRecording(config);
}

// int RtcEngineExBridge::registerAudioEncodedFrameObserver(const agora::rtc::AudioEncodedFrameObserverConfig &config,
//                                                          agora::rtc::IAudioEncodedFrameObserver *observer) {
//     if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
//     return _engine->registerAudioEncodedFrameObserver(config, observer);
// }

int RtcEngineExBridge::stopAudioRecording() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopAudioRecording();
}

MediaPlayerBridge *RtcEngineExBridge::createMediaPlayer() {
    if (_engine == nullptr) { return nullptr; }
    auto mediaPlayer = _engine->createMediaPlayer();
    if (!mediaPlayer) { return nullptr; }

    auto bridge = std::make_shared<MediaPlayerBridge>(mediaPlayer);
    _mediaPlayers.push_back(bridge);
    return bridge.get();
}

int RtcEngineExBridge::destroyMediaPlayer(MediaPlayerBridge *mediaPlayer) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    if (mediaPlayer == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }

    auto iter = std::find_if(_mediaPlayers.begin(), _mediaPlayers.end(),
                             [mediaPlayer](const std::shared_ptr<MediaPlayerBridge> &item) {
                                 return item.get() == mediaPlayer;
                             });
    if (iter == _mediaPlayers.end() || !(*iter)->hasMediaPlayer()) { return -agora::ERR_INVALID_ARGUMENT; }

    int result = _engine->destroyMediaPlayer((*iter)->mediaPlayer());
    if (result == 0) {
        (*iter)->invalidate();
        _mediaPlayers.erase(iter);
    }
    return result;
}

MediaRecorderBridge *RtcEngineExBridge::createMediaRecorder(const agora::rtc::RecorderStreamInfo &info) {
    if (_engine == nullptr) { return nullptr; }
    auto recorder = _engine->createMediaRecorder(info);
    if (!recorder) { return nullptr; }
    auto bridge = std::make_shared<MediaRecorderBridge>(recorder);
    _mediaRecorders.push_back(bridge);
    return bridge.get();
}

int RtcEngineExBridge::destroyMediaRecorder(MediaRecorderBridge *mediaRecorder) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    if (!mediaRecorder) { return -agora::ERR_INVALID_ARGUMENT; }
    int ret = _engine->destroyMediaRecorder(mediaRecorder->mediaRecorder());
    if (ret == 0) {
        mediaRecorder->invalidate();
        auto it = std::find_if(_mediaRecorders.begin(), _mediaRecorders.end(),
                               [mediaRecorder](const std::shared_ptr<MediaRecorderBridge> &ptr) {
                                   return ptr.get() == mediaRecorder;
                               });
        if (it != _mediaRecorders.end()) { _mediaRecorders.erase(it); }
    }
    return ret;
}

int RtcEngineExBridge::startAudioMixing(const std::string &filePath, bool loopback, int cycle) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioMixing(filePath.c_str(), loopback, cycle);
}

int RtcEngineExBridge::startAudioMixing(const std::string &filePath, bool loopback, int cycle, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioMixing(filePath.c_str(), loopback, cycle, startPos);
}

int RtcEngineExBridge::stopAudioMixing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopAudioMixing();
}

int RtcEngineExBridge::pauseAudioMixing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAudioMixing();
}

int RtcEngineExBridge::resumeAudioMixing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAudioMixing();
}

int RtcEngineExBridge::selectAudioTrack(int index) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->selectAudioTrack(index);
}

int RtcEngineExBridge::getAudioTrackCount() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getAudioTrackCount();
}

int RtcEngineExBridge::adjustAudioMixingVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustAudioMixingVolume(volume);
}

int RtcEngineExBridge::adjustAudioMixingPublishVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustAudioMixingPublishVolume(volume);
}

int RtcEngineExBridge::getAudioMixingPublishVolume() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getAudioMixingPublishVolume();
}

int RtcEngineExBridge::adjustAudioMixingPlayoutVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustAudioMixingPlayoutVolume(volume);
}

int RtcEngineExBridge::getAudioMixingPlayoutVolume() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getAudioMixingPlayoutVolume();
}

int RtcEngineExBridge::getAudioMixingDuration() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getAudioMixingDuration();
}

int RtcEngineExBridge::getAudioMixingCurrentPosition() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getAudioMixingCurrentPosition();
}

int RtcEngineExBridge::setAudioMixingPosition(int pos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingPosition(pos);
}

int RtcEngineExBridge::setAudioMixingDualMonoMode(agora::media::AUDIO_MIXING_DUAL_MONO_MODE mode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingDualMonoMode(mode);
}

int RtcEngineExBridge::setAudioMixingPitch(int pitch) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingPitch(pitch);
}

int RtcEngineExBridge::setAudioMixingPlaybackSpeed(int speed) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingPlaybackSpeed(speed);
}

int RtcEngineExBridge::getEffectsVolume() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getEffectsVolume();
}

int RtcEngineExBridge::setEffectsVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setEffectsVolume(volume);
}

int RtcEngineExBridge::preloadEffect(int soundId, const std::string &filePath, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadEffect(soundId, filePath.c_str(), startPos);
}

int RtcEngineExBridge::playEffect(int soundId, const std::string &filePath, int loopCount, double pitch, double pan,
                                  int gain, bool publish, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->playEffect(soundId, filePath.c_str(), loopCount, pitch, pan, gain, publish, startPos);
}

int RtcEngineExBridge::playAllEffects(int loopCount, double pitch, double pan, int gain, bool publish) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->playAllEffects(loopCount, pitch, pan, gain, publish);
}

int RtcEngineExBridge::getVolumeOfEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getVolumeOfEffect(soundId);
}

int RtcEngineExBridge::setVolumeOfEffect(int soundId, int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVolumeOfEffect(soundId, volume);
}

int RtcEngineExBridge::pauseEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseEffect(soundId);
}

int RtcEngineExBridge::pauseAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAllEffects();
}

int RtcEngineExBridge::resumeEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeEffect(soundId);
}

int RtcEngineExBridge::resumeAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAllEffects();
}

int RtcEngineExBridge::stopEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopEffect(soundId);
}

int RtcEngineExBridge::stopAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopAllEffects();
}

int RtcEngineExBridge::unloadEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->unloadEffect(soundId);
}

int RtcEngineExBridge::unloadAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->unloadAllEffects();
}

int RtcEngineExBridge::getEffectDuration(const std::string &filePath) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getEffectDuration(filePath.c_str());
}

int RtcEngineExBridge::setEffectPosition(int soundId, int pos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setEffectPosition(soundId, pos);
}

int RtcEngineExBridge::getEffectCurrentPosition(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getEffectCurrentPosition(soundId);
}

int RtcEngineExBridge::enableSoundPositionIndication(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableSoundPositionIndication(enabled);
}

int RtcEngineExBridge::setRemoteVoicePosition(agora::rtc::uid_t uid, double pan, double gain) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVoicePosition(uid, pan, gain);
}

int RtcEngineExBridge::enableSpatialAudio(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableSpatialAudio(enabled);
}

int RtcEngineExBridge::setRemoteUserSpatialAudioParams(agora::rtc::uid_t uid, const agora::SpatialAudioParams &params) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteUserSpatialAudioParams(uid, params);
}

int RtcEngineExBridge::setVoiceBeautifierPreset(agora::rtc::VOICE_BEAUTIFIER_PRESET preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVoiceBeautifierPreset(preset);
}

int RtcEngineExBridge::setAudioEffectPreset(agora::rtc::AUDIO_EFFECT_PRESET preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioEffectPreset(preset);
}

int RtcEngineExBridge::setVoiceConversionPreset(agora::rtc::VOICE_CONVERSION_PRESET preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVoiceConversionPreset(preset);
}

int RtcEngineExBridge::setAudioEffectParameters(agora::rtc::AUDIO_EFFECT_PRESET preset, int param1, int param2) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioEffectParameters(preset, param1, param2);
}

int RtcEngineExBridge::setVoiceBeautifierParameters(agora::rtc::VOICE_BEAUTIFIER_PRESET preset, int param1,
                                                    int param2) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVoiceBeautifierParameters(preset, param1, param2);
}

int RtcEngineExBridge::setVoiceConversionParameters(agora::rtc::VOICE_CONVERSION_PRESET preset, int param1,
                                                    int param2) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVoiceConversionParameters(preset, param1, param2);
}

int RtcEngineExBridge::setLocalVoicePitch(double pitch) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoicePitch(pitch);
}

int RtcEngineExBridge::setLocalVoiceFormant(double formantRatio) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoiceFormant(formantRatio);
}

int RtcEngineExBridge::setLocalVoiceEqualization(agora::rtc::AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency,
                                                 int bandGain) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoiceEqualization(bandFrequency, bandGain);
}

int RtcEngineExBridge::setLocalVoiceReverb(agora::rtc::AUDIO_REVERB_TYPE reverbKey, int value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoiceReverb(reverbKey, value);
}

int RtcEngineExBridge::setHeadphoneEQPreset(agora::rtc::HEADPHONE_EQUALIZER_PRESET preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setHeadphoneEQPreset(preset);
}

int RtcEngineExBridge::setHeadphoneEQParameters(int lowGain, int highGain) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setHeadphoneEQParameters(lowGain, highGain);
}

int RtcEngineExBridge::enableVoiceAITuner(bool enabled, agora::rtc::VOICE_AI_TUNER_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVoiceAITuner(enabled, type);
}

int RtcEngineExBridge::setLogFile(const std::string &filePath) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogFile(filePath.c_str());
}

int RtcEngineExBridge::setLogFilter(unsigned int filter) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogFilter(filter);
}

int RtcEngineExBridge::setLogLevel(agora::commons::LOG_LEVEL level) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogLevel(level);
}

int RtcEngineExBridge::setLogFileSize(unsigned int fileSizeInKBytes) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogFileSize(fileSizeInKBytes);
}

UploadLogFileResult RtcEngineExBridge::uploadLogFile() {
    if (_engine == nullptr) { return {-agora::ERR_NOT_INITIALIZED, ""}; }
    agora::util::AString sdkRequestId;
    int result = _engine->uploadLogFile(sdkRequestId);
    return {result, sdkRequestId->c_str() != nullptr ? sdkRequestId->c_str() : ""};
}

int RtcEngineExBridge::writeLog(agora::commons::LOG_LEVEL level, const std::string &fmt) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->writeLog(level, fmt.c_str());
}

int RtcEngineExBridge::setLocalRenderMode(agora::media::base::RENDER_MODE_TYPE renderMode,
                                          agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalRenderMode(renderMode, mirrorMode);
}

int RtcEngineExBridge::setRemoteRenderMode(agora::rtc::uid_t uid, agora::media::base::RENDER_MODE_TYPE renderMode,
                                           agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteRenderMode(uid, renderMode, mirrorMode);
}

int RtcEngineExBridge::setLocalRenderTargetFps(agora::rtc::VIDEO_SOURCE_TYPE sourceType, int targetFps) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalRenderTargetFps(sourceType, targetFps);
}

int RtcEngineExBridge::setRemoteRenderTargetFps(int targetFps) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteRenderTargetFps(targetFps);
}

int RtcEngineExBridge::setLocalRenderMode(agora::media::base::RENDER_MODE_TYPE renderMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalRenderMode(renderMode);
}

int RtcEngineExBridge::setLocalVideoMirrorMode(agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVideoMirrorMode(mirrorMode);
}

int RtcEngineExBridge::enableDualStreamMode(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableDualStreamMode(enabled);
}

int RtcEngineExBridge::enableDualStreamMode(bool enabled, const agora::rtc::SimulcastStreamConfig &streamConfig) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableDualStreamMode(enabled, streamConfig);
}

int RtcEngineExBridge::setDualStreamMode(agora::rtc::SIMULCAST_STREAM_MODE mode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDualStreamMode(mode);
}

int RtcEngineExBridge::setSimulcastConfig(const agora::rtc::SimulcastConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSimulcastConfig(config);
}

int RtcEngineExBridge::setDualStreamMode(agora::rtc::SIMULCAST_STREAM_MODE mode,
                                         const agora::rtc::SimulcastStreamConfig &streamConfig) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDualStreamMode(mode, streamConfig);
}

int RtcEngineExBridge::enableCustomAudioLocalPlayback(agora::rtc::track_id_t trackId, bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableCustomAudioLocalPlayback(trackId, enabled);
}

int RtcEngineExBridge::setRecordingAudioFrameParameters(int sampleRate, int channel,
                                                        agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                                        int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
}

int RtcEngineExBridge::setPlaybackAudioFrameParameters(int sampleRate, int channel,
                                                       agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                                       int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
}

int RtcEngineExBridge::setMixedAudioFrameParameters(int sampleRate, int channel, int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setMixedAudioFrameParameters(sampleRate, channel, samplesPerCall);
}

int RtcEngineExBridge::setEarMonitoringAudioFrameParameters(int sampleRate, int channel,
                                                            agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                                            int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setEarMonitoringAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
}

int RtcEngineExBridge::setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setPlaybackAudioFrameBeforeMixingParameters(sampleRate, channel);
}

int RtcEngineExBridge::setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel, int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setPlaybackAudioFrameBeforeMixingParameters(sampleRate, channel, samplesPerCall);
}

int RtcEngineExBridge::enableAudioSpectrumMonitor(int intervalInMS) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudioSpectrumMonitor(intervalInMS);
}

int RtcEngineExBridge::disableAudioSpectrumMonitor() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->disableAudioSpectrumMonitor();
}

int RtcEngineExBridge::adjustRecordingSignalVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustRecordingSignalVolume(volume);
}

int RtcEngineExBridge::muteRecordingSignal(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRecordingSignal(mute);
}

int RtcEngineExBridge::adjustPlaybackSignalVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustPlaybackSignalVolume(volume);
}

int RtcEngineExBridge::adjustUserPlaybackSignalVolume(agora::rtc::uid_t uid, int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustUserPlaybackSignalVolume(uid, volume);
}

int RtcEngineExBridge::setRemoteSubscribeFallbackOption(agora::rtc::STREAM_FALLBACK_OPTIONS option) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteSubscribeFallbackOption(option);
}

int RtcEngineExBridge::setHighPriorityUserList(const std::vector<agora::rtc::uid_t> &uidList,
                                               agora::rtc::STREAM_FALLBACK_OPTIONS option) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setHighPriorityUserList(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                            static_cast<int>(uidList.size()), option);
}

int RtcEngineExBridge::enableExtension(const std::string &provider, const std::string &extension,
                                       const agora::rtc::ExtensionInfo &extensionInfo, bool enable) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableExtension(provider.c_str(), extension.c_str(), extensionInfo, enable);
}

int RtcEngineExBridge::setExtensionProperty(const std::string &provider, const std::string &extension,
                                            const agora::rtc::ExtensionInfo &extensionInfo, const std::string &key,
                                            const std::string &value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setExtensionProperty(provider.c_str(), extension.c_str(), extensionInfo, key.c_str(),
                                         value.c_str());
}

GetExtensionPropertyResult RtcEngineExBridge::getExtensionProperty(const std::string &provider,
                                                                   const std::string &extension,
                                                                   const agora::rtc::ExtensionInfo &extensionInfo,
                                                                   const std::string &key) {
    GetExtensionPropertyResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    char value[4096] = {};
    result.errorCode = _engine->getExtensionProperty(provider.c_str(), extension.c_str(), extensionInfo, key.c_str(),
                                                     value, sizeof(value));
    result.value = value;
    return result;
}

int RtcEngineExBridge::enableLoopbackRecording(bool enabled, const std::string &deviceName) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLoopbackRecording(enabled, deviceName.empty() ? nullptr : deviceName.c_str());
}

int RtcEngineExBridge::adjustLoopbackSignalVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustLoopbackSignalVolume(volume);
}

int RtcEngineExBridge::getLoopbackRecordingVolume() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getLoopbackRecordingVolume();
}

int RtcEngineExBridge::enableInEarMonitoring(bool enabled, int includeAudioFilters) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableInEarMonitoring(enabled, includeAudioFilters);
}

int RtcEngineExBridge::setInEarMonitoringVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setInEarMonitoringVolume(volume);
}

int RtcEngineExBridge::loadExtensionProvider(const std::string &path, bool unload_after_use) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(_WIN32) || defined(__linux__) || defined(__ANDROID__)
    return _engine->loadExtensionProvider(path.c_str(), unload_after_use);
#else
    (void)path;
    (void)unload_after_use;
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

int RtcEngineExBridge::setExtensionProviderProperty(const std::string &provider, const std::string &key,
                                                    const std::string &value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setExtensionProviderProperty(provider.c_str(), key.c_str(), value.c_str());
}

int RtcEngineExBridge::registerExtension(const std::string &provider, const std::string &extension,
                                         agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->registerExtension(provider.c_str(), extension.c_str(), type);
}

int RtcEngineExBridge::enableExtension(const std::string &provider, const std::string &extension, bool enable,
                                       agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableExtension(provider.c_str(), extension.c_str(), enable, type);
}

int RtcEngineExBridge::setExtensionProperty(const std::string &provider, const std::string &extension,
                                            const std::string &key, const std::string &value,
                                            agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setExtensionProperty(provider.c_str(), extension.c_str(), key.c_str(), value.c_str(), type);
}

GetExtensionPropertyResult RtcEngineExBridge::getExtensionProperty(const std::string &provider,
                                                                   const std::string &extension, const std::string &key,
                                                                   agora::media::MEDIA_SOURCE_TYPE type) {
    GetExtensionPropertyResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    char value[4096] = {};
    result.errorCode =
        _engine->getExtensionProperty(provider.c_str(), extension.c_str(), key.c_str(), value, sizeof(value), type);
    result.value = value;
    return result;
}

int RtcEngineExBridge::setCameraCapturerConfiguration(const agora::rtc::CameraCapturerConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setCameraCapturerConfiguration(config);
}

int RtcEngineExBridge::switchCamera() {
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraZoomSupported() {
    return false;
}

bool RtcEngineExBridge::isCameraFaceDetectSupported() {
    return false;
}

bool RtcEngineExBridge::isCameraTorchSupported() {
    return false;
}

bool RtcEngineExBridge::isCameraFocusSupported() {
    return false;
}

bool RtcEngineExBridge::isCameraAutoFocusFaceModeSupported() {
    return false;
}

int RtcEngineExBridge::setCameraZoomFactor(float factor) {
    (void)factor;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::enableFaceDetection(bool enabled) {
    (void)enabled;
    return -agora::ERR_NOT_SUPPORTED;
}

float RtcEngineExBridge::getCameraMaxZoomFactor() {
    return 0.0F;
}

int RtcEngineExBridge::setCameraFocusPositionInPreview(float positionX, float positionY) {
    (void)positionX;
    (void)positionY;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraTorchOn(bool isOn) {
    (void)isOn;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraAutoFocusFaceModeEnabled(bool enabled) {
    (void)enabled;
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraExposurePositionSupported() {
    return false;
}

int RtcEngineExBridge::setCameraExposurePosition(float positionXinView, float positionYinView) {
    (void)positionXinView;
    (void)positionYinView;
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraExposureSupported() {
    return false;
}

int RtcEngineExBridge::setCameraExposureFactor(float factor) {
    (void)factor;
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraAutoExposureFaceModeSupported() {
    return false;
}

int RtcEngineExBridge::setCameraAutoExposureFaceModeEnabled(bool enabled) {
    (void)enabled;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraStabilizationMode(agora::rtc::CAMERA_STABILIZATION_MODE mode) {
    (void)mode;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker) {
    (void)defaultToSpeaker;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setEnableSpeakerphone(bool speakerOn) {
    (void)speakerOn;
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isSpeakerphoneEnabled() {
    return false;
}

int RtcEngineExBridge::setRouteInCommunicationMode(int route) {
    (void)route;
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraCenterStageSupported() {
    if (_engine == nullptr) { return false; }
    return _engine->isCameraCenterStageSupported();
}

int RtcEngineExBridge::enableCameraCenterStage(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableCameraCenterStage(enabled);
}

ScreenCaptureSourceListBridge *RtcEngineExBridge::getScreenCaptureSources(const agora::rtc::SIZE &thumbSize,
                                                                          const agora::rtc::SIZE &iconSize,
                                                                          bool includeScreen) {
    if (_engine == nullptr) { return nullptr; }
    if (!_screenCaptureSources) { _screenCaptureSources = std::make_shared<ScreenCaptureSourceListBridge>(); }
    auto *list = _engine->getScreenCaptureSources(thumbSize, iconSize, includeScreen);
    if (!list) { return nullptr; }
    _screenCaptureSources->setList(list);
    return _screenCaptureSources.get();
}

int RtcEngineExBridge::setAudioSessionOperationRestriction(agora::AUDIO_SESSION_OPERATION_RESTRICTION restriction) {
    (void)restriction;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::startScreenCaptureByDisplayId(int64_t displayId, const agora::rtc::Rectangle &regionRect,
                                                     const agora::rtc::ScreenCaptureParameters &captureParams) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startScreenCaptureByDisplayId(displayId, regionRect, captureParams);
}

int RtcEngineExBridge::startScreenCaptureByScreenRect(const agora::rtc::Rectangle &screenRect,
                                                      const agora::rtc::Rectangle &regionRect,
                                                      const agora::rtc::ScreenCaptureParameters &captureParams) {
    (void)screenRect;
    (void)regionRect;
    (void)captureParams;
    return -agora::ERR_NOT_SUPPORTED;
}

GetAudioDeviceInfoWithDeviceInfoResult RtcEngineExBridge::getAudioDeviceInfo() {
    GetAudioDeviceInfoWithDeviceInfoResult result{};
    result.errorCode = -agora::ERR_NOT_SUPPORTED;
    return result;
}

int RtcEngineExBridge::startScreenCaptureByWindowId(int64_t windowId, const agora::rtc::Rectangle &regionRect,
                                                    const agora::rtc::ScreenCaptureParameters &captureParams) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startScreenCaptureByWindowId(windowId, regionRect, captureParams);
}

int RtcEngineExBridge::setScreenCaptureContentHint(agora::rtc::VIDEO_CONTENT_HINT contentHint) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setScreenCaptureContentHint(contentHint);
}

int RtcEngineExBridge::updateScreenCaptureRegion(const agora::rtc::Rectangle &regionRect) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateScreenCaptureRegion(regionRect);
}

int RtcEngineExBridge::updateScreenCaptureParameters(const agora::rtc::ScreenCaptureParameters &captureParams) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateScreenCaptureParameters(captureParams);
}

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int RtcEngineExBridge::startScreenCapture(const agora::rtc::ScreenCaptureParameters2 &captureParams) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startScreenCapture(captureParams);
}

int RtcEngineExBridge::updateScreenCapture(const agora::rtc::ScreenCaptureParameters2 &captureParams) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateScreenCapture(captureParams);
}
#endif

int RtcEngineExBridge::queryScreenCaptureCapability() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    return _engine->queryScreenCaptureCapability();
#else
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

QueryCameraFocalLengthCapabilityResult RtcEngineExBridge::queryCameraFocalLengthCapability(int &size) {
    QueryCameraFocalLengthCapabilityResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
    if (size < 0) {
        result.errorCode = -agora::ERR_INVALID_ARGUMENT;
        return result;
    }
    result.focalLengthInfos.resize(static_cast<size_t>(size));
    auto *focalLengthInfos = result.focalLengthInfos.empty() ? nullptr : result.focalLengthInfos.data();
    result.errorCode = _engine->queryCameraFocalLengthCapability(focalLengthInfos, size);
    if (result.errorCode == 0 && size >= 0 && static_cast<size_t>(size) < result.focalLengthInfos.size()) {
        // Shrink result.focalLengthInfos to size, so the structure contains no redundant invalid data.
        result.focalLengthInfos.resize(static_cast<size_t>(size));
    }
#else
    (void)size;
    result.errorCode = -agora::ERR_NOT_SUPPORTED;
#endif
    return result;
}

int RtcEngineExBridge::setExternalMediaProjection(void *mediaProjection) {
    (void)mediaProjection;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setScreenCaptureScenario(agora::rtc::SCREEN_SCENARIO_TYPE screenScenario) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setScreenCaptureScenario(screenScenario);
}

int RtcEngineExBridge::stopScreenCapture() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopScreenCapture();
}

GetCallIdResult RtcEngineExBridge::getCallId() {
    GetCallIdResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    agora::util::AString callId;
    result.errorCode = _engine->getCallId(callId);
    if (callId.get() != nullptr && callId->c_str() != nullptr) { result.callId = callId->c_str(); }
    return result;
}

int RtcEngineExBridge::rate(const std::string &callId, int rating, const std::string &description) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->rate(callId.c_str(), rating, description.c_str());
}

int RtcEngineExBridge::complain(const std::string &callId, const std::string &description) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->complain(callId.c_str(), description.c_str());
}

int RtcEngineExBridge::startRtmpStreamWithoutTranscoding(const std::string &url) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startRtmpStreamWithoutTranscoding(url.c_str());
}

int RtcEngineExBridge::startRtmpStreamWithTranscoding(const std::string &url,
                                                      const agora::rtc::LiveTranscoding &transcoding) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startRtmpStreamWithTranscoding(url.c_str(), transcoding);
}

int RtcEngineExBridge::updateRtmpTranscoding(const agora::rtc::LiveTranscoding &transcoding) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateRtmpTranscoding(transcoding);
}

int RtcEngineExBridge::startLocalVideoTranscoder(const agora::rtc::LocalTranscoderConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startLocalVideoTranscoder(config);
}

int RtcEngineExBridge::updateLocalTranscoderConfiguration(const agora::rtc::LocalTranscoderConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateLocalTranscoderConfiguration(config);
}

int RtcEngineExBridge::stopRtmpStream(const std::string &url) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopRtmpStream(url.c_str());
}

int RtcEngineExBridge::stopLocalVideoTranscoder() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopLocalVideoTranscoder();
}

int RtcEngineExBridge::startLocalAudioMixer(const agora::rtc::LocalAudioMixerConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startLocalAudioMixer(config);
}

int RtcEngineExBridge::updateLocalAudioMixerConfiguration(const agora::rtc::LocalAudioMixerConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateLocalAudioMixerConfiguration(config);
}

int RtcEngineExBridge::stopLocalAudioMixer() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopLocalAudioMixer();
}

int RtcEngineExBridge::startCameraCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType,
                                          const agora::rtc::CameraCapturerConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startCameraCapture(sourceType, config);
}

int RtcEngineExBridge::stopCameraCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopCameraCapture(sourceType);
}

int RtcEngineExBridge::setCameraDeviceOrientation(agora::rtc::VIDEO_SOURCE_TYPE type,
                                                  agora::rtc::VIDEO_ORIENTATION orientation) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setCameraDeviceOrientation(type, orientation);
}

int RtcEngineExBridge::setScreenCaptureOrientation(agora::rtc::VIDEO_SOURCE_TYPE type,
                                                   agora::rtc::VIDEO_ORIENTATION orientation) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setScreenCaptureOrientation(type, orientation);
}

int RtcEngineExBridge::startScreenCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType,
                                          const agora::rtc::ScreenCaptureConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startScreenCapture(sourceType, config);
}

int RtcEngineExBridge::stopScreenCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopScreenCapture(sourceType);
}

int RtcEngineExBridge::getConnectionState() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getConnectionState();
}

int RtcEngineExBridge::setRemoteUserPriority(agora::rtc::uid_t uid, agora::rtc::PRIORITY_TYPE userPriority) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteUserPriority(uid, userPriority);
}

int RtcEngineExBridge::enableEncryption(bool enabled, const agora::rtc::EncryptionConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableEncryption(enabled, config);
}

CreateDataStreamResult RtcEngineExBridge::createDataStream(bool reliable, bool ordered) {
    CreateDataStreamResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->createDataStream(&result.streamId, reliable, ordered);
    return result;
}

CreateDataStreamResult RtcEngineExBridge::createDataStream(const agora::rtc::DataStreamConfig &config) {
    CreateDataStreamResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->createDataStream(&result.streamId, config);
    return result;
}

int RtcEngineExBridge::sendStreamMessage(int streamId, const void *data, size_t length) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendStreamMessage(streamId, static_cast<const char *>(data), length);
}

int RtcEngineExBridge::sendRdtMessage(agora::rtc::uid_t uid, agora::rtc::RdtStreamType type, const void *data,
                                      size_t length) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendRdtMessage(uid, type, static_cast<const char *>(data), length);
}

int RtcEngineExBridge::sendMediaControlMessage(agora::rtc::uid_t uid, const void *data, size_t length) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendMediaControlMessage(uid, static_cast<const char *>(data), length);
}

int RtcEngineExBridge::addVideoWatermark(const agora::rtc::RtcImage &watermark) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->addVideoWatermark(watermark);
}

int RtcEngineExBridge::addVideoWatermark(const std::string &watermarkUrl, const agora::rtc::WatermarkOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->addVideoWatermark(watermarkUrl.c_str(), options);
}

int RtcEngineExBridge::addVideoWatermark(const agora::rtc::WatermarkConfig &configs) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->addVideoWatermark(configs);
}

int RtcEngineExBridge::removeVideoWatermark(const std::string &id) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->removeVideoWatermark(id.c_str());
}

int RtcEngineExBridge::clearVideoWatermarks() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->clearVideoWatermarks();
}

int RtcEngineExBridge::pauseAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAudio();
}

int RtcEngineExBridge::resumeAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAudio();
}

int RtcEngineExBridge::enableWebSdkInteroperability(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableWebSdkInteroperability(enabled);
}

int RtcEngineExBridge::sendCustomReportMessage(const std::string &id, const std::string &category,
                                               const std::string &event, const std::string &label, int value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendCustomReportMessage(id.c_str(), category.c_str(), event.c_str(), label.c_str(), value);
}

int RtcEngineExBridge::startAudioFrameDump(const std::string &channelId, agora::rtc::uid_t uid) {
    (void)channelId;
    (void)uid;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopAudioFrameDump(const std::string &channelId, agora::rtc::uid_t uid) {
    (void)channelId;
    (void)uid;
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setAINSMode(bool enabled, agora::rtc::AUDIO_AINS_MODE mode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAINSMode(enabled, mode);
}

int RtcEngineExBridge::registerLocalUserAccount(const std::string &appId, const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->registerLocalUserAccount(appId.c_str(), userAccount.c_str());
}

int RtcEngineExBridge::joinChannelWithUserAccount(const std::string &token, const std::string &channelId,
                                                  const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannelWithUserAccount(nullableCString(token), channelId.c_str(), userAccount.c_str());
}

int RtcEngineExBridge::joinChannelWithUserAccount(const std::string &token, const std::string &channelId,
                                                  const std::string &userAccount,
                                                  const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannelWithUserAccount(nullableCString(token), channelId.c_str(), userAccount.c_str(), options);
}

GetUserInfoResult RtcEngineExBridge::getUserInfoByUserAccount(const std::string &userAccount) {
    GetUserInfoResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getUserInfoByUserAccount(userAccount.c_str(), &result.userInfo);
    return result;
}

GetUserInfoResult RtcEngineExBridge::getUserInfoByUid(agora::rtc::uid_t uid) {
    GetUserInfoResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getUserInfoByUid(uid, &result.userInfo);
    return result;
}

int RtcEngineExBridge::startOrUpdateChannelMediaRelay(const agora::rtc::ChannelMediaRelayConfiguration &configuration) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startOrUpdateChannelMediaRelay(configuration);
}

int RtcEngineExBridge::stopChannelMediaRelay() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopChannelMediaRelay();
}

int RtcEngineExBridge::pauseAllChannelMediaRelay() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAllChannelMediaRelay();
}

int RtcEngineExBridge::resumeAllChannelMediaRelay() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAllChannelMediaRelay();
}

int RtcEngineExBridge::setDirectCdnStreamingAudioConfiguration(agora::rtc::AUDIO_PROFILE_TYPE profile) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDirectCdnStreamingAudioConfiguration(profile);
}

int RtcEngineExBridge::setDirectCdnStreamingVideoConfiguration(const agora::rtc::VideoEncoderConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDirectCdnStreamingVideoConfiguration(config);
}

int RtcEngineExBridge::startDirectCdnStreaming(const std::string &publishUrl,
                                               const agora::rtc::DirectCdnStreamingMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    if (_eventHandler == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    return _engine->startDirectCdnStreaming(_eventHandler.get(), publishUrl.c_str(), options);
}

int RtcEngineExBridge::stopDirectCdnStreaming() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopDirectCdnStreaming();
}

int RtcEngineExBridge::updateDirectCdnStreamingMediaOptions(const agora::rtc::DirectCdnStreamingMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateDirectCdnStreamingMediaOptions(options);
}

int RtcEngineExBridge::startRhythmPlayer(const std::string &sound1, const std::string &sound2,
                                         const agora::rtc::AgoraRhythmPlayerConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startRhythmPlayer(sound1.c_str(), sound2.c_str(), config);
}

int RtcEngineExBridge::stopRhythmPlayer() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopRhythmPlayer();
}

int RtcEngineExBridge::configRhythmPlayer(const agora::rtc::AgoraRhythmPlayerConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->configRhythmPlayer(config);
}

int RtcEngineExBridge::takeSnapshot(agora::rtc::uid_t uid, const std::string &filePath) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->takeSnapshot(uid, filePath.c_str());
}

int RtcEngineExBridge::takeSnapshot(agora::rtc::uid_t uid, const agora::media::SnapshotConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->takeSnapshot(uid, config);
}

int RtcEngineExBridge::enableContentInspect(bool enabled, const agora::media::ContentInspectConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableContentInspect(enabled, config);
}

int RtcEngineExBridge::adjustCustomAudioPublishVolume(agora::rtc::track_id_t trackId, int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustCustomAudioPublishVolume(trackId, volume);
}

int RtcEngineExBridge::adjustCustomAudioPlayoutVolume(agora::rtc::track_id_t trackId, int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustCustomAudioPlayoutVolume(trackId, volume);
}

int RtcEngineExBridge::setCloudProxy(agora::rtc::CLOUD_PROXY_TYPE proxyType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setCloudProxy(proxyType);
}

int RtcEngineExBridge::setLocalAccessPoint(const agora::rtc::LocalAccessPointConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalAccessPoint(config);
}

int RtcEngineExBridge::setAdvancedAudioOptions(agora::rtc::AdvancedAudioOptions &options, int sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAdvancedAudioOptions(options, sourceType);
}

int RtcEngineExBridge::setAVSyncSource(const std::string &channelId, agora::rtc::uid_t uid) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAVSyncSource(channelId.c_str(), uid);
}

int RtcEngineExBridge::enableVideoImageSource(bool enable, const agora::rtc::ImageTrackOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVideoImageSource(enable, options);
}

int64_t RtcEngineExBridge::getCurrentMonotonicTimeInMs() {
    if (_engine == nullptr) { return -1; }
    return _engine->getCurrentMonotonicTimeInMs();
}

int RtcEngineExBridge::getNetworkType() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getNetworkType();
}

int RtcEngineExBridge::setParameters(const std::string &parameters) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setParameters(parameters.c_str());
}

int RtcEngineExBridge::startMediaRenderingTracing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startMediaRenderingTracing();
}

int RtcEngineExBridge::enableInstantMediaRendering() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableInstantMediaRendering();
}

uint64_t RtcEngineExBridge::getNtpWallTimeInMs() {
    if (_engine == nullptr) { return 0; }
    return _engine->getNtpWallTimeInMs();
}

bool RtcEngineExBridge::isFeatureAvailableOnDevice(agora::rtc::FeatureType type) {
    if (_engine == nullptr) { return false; }
    return _engine->isFeatureAvailableOnDevice(type);
}

int RtcEngineExBridge::sendAudioMetadata(const void *metadata, size_t length) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendAudioMetadata(static_cast<const char *>(metadata), length);
}

QueryHDRCapabilityResult RtcEngineExBridge::queryHDRCapability(agora::rtc::VIDEO_MODULE_TYPE videoModule) {
    QueryHDRCapabilityResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->queryHDRCapability(videoModule, result.capability);
    return result;
}

int RtcEngineExBridge::joinChannelEx(const std::string &token, const agora::rtc::RtcConnection &connection,
                                     const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannelEx(nullableCString(token), connection, options, _eventHandler.get());
}

int RtcEngineExBridge::leaveChannelEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannelEx(connection);
}

int RtcEngineExBridge::leaveChannelEx(const agora::rtc::RtcConnection &connection,
                                      const agora::rtc::LeaveChannelOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannelEx(connection, options);
}

int RtcEngineExBridge::leaveChannelWithUserAccountEx(const std::string &channelId, const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannelWithUserAccountEx(channelId.c_str(), userAccount.c_str());
}

int RtcEngineExBridge::leaveChannelWithUserAccountEx(const std::string &channelId, const std::string &userAccount,
                                                     const agora::rtc::LeaveChannelOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannelWithUserAccountEx(channelId.c_str(), userAccount.c_str(), options);
}

int RtcEngineExBridge::updateChannelMediaOptionsEx(const agora::rtc::ChannelMediaOptions &options,
                                                   const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateChannelMediaOptionsEx(options, connection);
}

int RtcEngineExBridge::setVideoEncoderConfigurationEx(const agora::rtc::VideoEncoderConfiguration &config,
                                                      const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoEncoderConfigurationEx(config, connection);
}

int RtcEngineExBridge::setupRemoteVideoEx(const agora::rtc::VideoCanvas &canvas,
                                          const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setupRemoteVideoEx(canvas, connection);
}

int RtcEngineExBridge::muteRemoteAudioStreamEx(agora::rtc::uid_t uid, bool mute,
                                               const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRemoteAudioStreamEx(uid, mute, connection);
}

int RtcEngineExBridge::muteRemoteVideoStreamEx(agora::rtc::uid_t uid, bool mute,
                                               const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRemoteVideoStreamEx(uid, mute, connection);
}

int RtcEngineExBridge::setRemoteVideoStreamTypeEx(agora::rtc::uid_t uid, agora::rtc::VIDEO_STREAM_TYPE streamType,
                                                  const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVideoStreamTypeEx(uid, streamType, connection);
}

int RtcEngineExBridge::muteLocalAudioStreamEx(bool mute, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteLocalAudioStreamEx(mute, connection);
}

int RtcEngineExBridge::muteLocalVideoStreamEx(bool mute, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteLocalVideoStreamEx(mute, connection);
}

int RtcEngineExBridge::muteAllRemoteAudioStreamsEx(bool mute, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteAllRemoteAudioStreamsEx(mute, connection);
}

int RtcEngineExBridge::muteAllRemoteVideoStreamsEx(bool mute, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteAllRemoteVideoStreamsEx(mute, connection);
}

int RtcEngineExBridge::setSubscribeAudioBlocklistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                                    const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeAudioBlocklistEx(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                                 static_cast<int>(uidList.size()), connection);
}

int RtcEngineExBridge::setSubscribeAudioAllowlistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                                    const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeAudioAllowlistEx(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                                 static_cast<int>(uidList.size()), connection);
}

int RtcEngineExBridge::setSubscribeVideoBlocklistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                                    const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeVideoBlocklistEx(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                                 static_cast<int>(uidList.size()), connection);
}

int RtcEngineExBridge::setSubscribeVideoAllowlistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                                    const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSubscribeVideoAllowlistEx(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                                 static_cast<int>(uidList.size()), connection);
}

int RtcEngineExBridge::setRemoteVideoSubscriptionOptionsEx(agora::rtc::uid_t uid,
                                                           const agora::rtc::VideoSubscriptionOptions &options,
                                                           const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVideoSubscriptionOptionsEx(uid, options, connection);
}

int RtcEngineExBridge::setRemoteVoicePositionEx(agora::rtc::uid_t uid, double pan, double gain,
                                                const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVoicePositionEx(uid, pan, gain, connection);
}

int RtcEngineExBridge::setRemoteUserSpatialAudioParamsEx(agora::rtc::uid_t uid, const agora::SpatialAudioParams &params,
                                                         const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteUserSpatialAudioParamsEx(uid, params, connection);
}

int RtcEngineExBridge::setRemoteRenderModeEx(agora::rtc::uid_t uid, agora::media::base::RENDER_MODE_TYPE renderMode,
                                             agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode,
                                             const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteRenderModeEx(uid, renderMode, mirrorMode, connection);
}

int RtcEngineExBridge::enableLoopbackRecordingEx(const agora::rtc::RtcConnection &connection, bool enabled,
                                                 const std::string &deviceName) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLoopbackRecordingEx(connection, enabled, deviceName.empty() ? nullptr : deviceName.c_str());
}

int RtcEngineExBridge::adjustRecordingSignalVolumeEx(int volume, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustRecordingSignalVolumeEx(volume, connection);
}

int RtcEngineExBridge::muteRecordingSignalEx(bool mute, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRecordingSignalEx(mute, connection);
}

int RtcEngineExBridge::adjustUserPlaybackSignalVolumeEx(agora::rtc::uid_t uid, int volume,
                                                        const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustUserPlaybackSignalVolumeEx(uid, volume, connection);
}

int RtcEngineExBridge::getConnectionStateEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->getConnectionStateEx(connection);
}

int RtcEngineExBridge::enableEncryptionEx(const agora::rtc::RtcConnection &connection, bool enabled,
                                          const agora::rtc::EncryptionConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableEncryptionEx(connection, enabled, config);
}

CreateDataStreamResult RtcEngineExBridge::createDataStreamEx(bool reliable, bool ordered,
                                                             const agora::rtc::RtcConnection &connection) {
    CreateDataStreamResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->createDataStreamEx(&result.streamId, reliable, ordered, connection);
    return result;
}

CreateDataStreamResult RtcEngineExBridge::createDataStreamEx(const agora::rtc::DataStreamConfig &config,
                                                             const agora::rtc::RtcConnection &connection) {
    CreateDataStreamResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->createDataStreamEx(&result.streamId, config, connection);
    return result;
}

int RtcEngineExBridge::sendStreamMessageEx(int streamId, const void *data, size_t length,
                                           const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendStreamMessageEx(streamId, static_cast<const char *>(data), length, connection);
}

int RtcEngineExBridge::sendRdtMessageEx(agora::rtc::uid_t uid, agora::rtc::RdtStreamType type, const void *data,
                                        size_t length, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendRdtMessageEx(uid, type, static_cast<const char *>(data), length, connection);
}

int RtcEngineExBridge::sendMediaControlMessageEx(agora::rtc::uid_t uid, const void *data, size_t length,
                                                 const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendMediaControlMessageEx(uid, static_cast<const char *>(data), length, connection);
}

int RtcEngineExBridge::addVideoWatermarkEx(const std::string &watermarkUrl, const agora::rtc::WatermarkOptions &options,
                                           const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->addVideoWatermarkEx(watermarkUrl.c_str(), options, connection);
}

int RtcEngineExBridge::addVideoWatermarkEx(const agora::rtc::WatermarkConfig &config,
                                           const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->addVideoWatermarkEx(config, connection);
}

int RtcEngineExBridge::removeVideoWatermarkEx(const std::string &id, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->removeVideoWatermarkEx(id.c_str(), connection);
}

int RtcEngineExBridge::clearVideoWatermarkEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->clearVideoWatermarkEx(connection);
}

int RtcEngineExBridge::sendCustomReportMessageEx(const std::string &id, const std::string &category,
                                                 const std::string &event, const std::string &label, int value,
                                                 const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendCustomReportMessageEx(id.c_str(), category.c_str(), event.c_str(), label.c_str(), value,
                                              connection);
}

int RtcEngineExBridge::enableAudioVolumeIndicationEx(int interval, int smooth, bool reportVad,
                                                     const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudioVolumeIndicationEx(interval, smooth, reportVad, connection);
}

int RtcEngineExBridge::startRtmpStreamWithoutTranscodingEx(const std::string &url,
                                                           const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startRtmpStreamWithoutTranscodingEx(url.c_str(), connection);
}

int RtcEngineExBridge::startRtmpStreamWithTranscodingEx(const std::string &url,
                                                        const agora::rtc::LiveTranscoding &transcoding,
                                                        const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startRtmpStreamWithTranscodingEx(url.c_str(), transcoding, connection);
}

int RtcEngineExBridge::updateRtmpTranscodingEx(const agora::rtc::LiveTranscoding &transcoding,
                                               const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateRtmpTranscodingEx(transcoding, connection);
}

int RtcEngineExBridge::stopRtmpStreamEx(const std::string &url, const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopRtmpStreamEx(url.c_str(), connection);
}

int RtcEngineExBridge::startOrUpdateChannelMediaRelayEx(const agora::rtc::ChannelMediaRelayConfiguration &configuration,
                                                        const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startOrUpdateChannelMediaRelayEx(configuration, connection);
}

int RtcEngineExBridge::stopChannelMediaRelayEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopChannelMediaRelayEx(connection);
}

int RtcEngineExBridge::pauseAllChannelMediaRelayEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAllChannelMediaRelayEx(connection);
}

int RtcEngineExBridge::resumeAllChannelMediaRelayEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAllChannelMediaRelayEx(connection);
}

GetUserInfoResult RtcEngineExBridge::getUserInfoByUserAccountEx(const std::string &userAccount,
                                                                const agora::rtc::RtcConnection &connection) {
    GetUserInfoResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getUserInfoByUserAccountEx(userAccount.c_str(), &result.userInfo, connection);
    return result;
}

GetUserInfoResult RtcEngineExBridge::getUserInfoByUidEx(agora::rtc::uid_t uid,
                                                        const agora::rtc::RtcConnection &connection) {
    GetUserInfoResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getUserInfoByUidEx(uid, &result.userInfo, connection);
    return result;
}

int RtcEngineExBridge::enableDualStreamModeEx(bool enabled, const agora::rtc::SimulcastStreamConfig &streamConfig,
                                              const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableDualStreamModeEx(enabled, streamConfig, connection);
}

int RtcEngineExBridge::setDualStreamModeEx(agora::rtc::SIMULCAST_STREAM_MODE mode,
                                           const agora::rtc::SimulcastStreamConfig &streamConfig,
                                           const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDualStreamModeEx(mode, streamConfig, connection);
}

int RtcEngineExBridge::setSimulcastConfigEx(const agora::rtc::SimulcastConfig &simulcastConfig,
                                            const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setSimulcastConfigEx(simulcastConfig, connection);
}

int RtcEngineExBridge::setHighPriorityUserListEx(const std::vector<agora::rtc::uid_t> &uidList,
                                                 agora::rtc::STREAM_FALLBACK_OPTIONS option,
                                                 const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setHighPriorityUserListEx(const_cast<agora::rtc::uid_t *>(uidList.data()),
                                              static_cast<int>(uidList.size()), option, connection);
}

int RtcEngineExBridge::takeSnapshotEx(const agora::rtc::RtcConnection &connection, agora::rtc::uid_t uid,
                                      const std::string &filePath) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->takeSnapshotEx(connection, uid, filePath.c_str());
}

int RtcEngineExBridge::takeSnapshotEx(const agora::rtc::RtcConnection &connection, agora::rtc::uid_t uid,
                                      const agora::media::SnapshotConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->takeSnapshotEx(connection, uid, config);
}

int RtcEngineExBridge::enableContentInspectEx(bool enabled, const agora::media::ContentInspectConfig &config,
                                              const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableContentInspectEx(enabled, config, connection);
}

int RtcEngineExBridge::startMediaRenderingTracingEx(const agora::rtc::RtcConnection &connection) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startMediaRenderingTracingEx(connection);
}

int RtcEngineExBridge::setParametersEx(const agora::rtc::RtcConnection &connection, const std::string &parameters) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setParametersEx(connection, parameters.c_str());
}

GetCallIdResult RtcEngineExBridge::getCallIdEx(const agora::rtc::RtcConnection &connection) {
    GetCallIdResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    agora::util::AString callId;
    result.errorCode = _engine->getCallIdEx(callId, connection);
    if (callId.get() != nullptr && callId->c_str() != nullptr) { result.callId = callId->c_str(); }
    return result;
}

int RtcEngineExBridge::sendAudioMetadataEx(const agora::rtc::RtcConnection &connection, const void *metadata,
                                           size_t length) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendAudioMetadataEx(connection, static_cast<const char *>(metadata), length);
}

int RtcEngineExBridge::preloadEffectEx(const agora::rtc::RtcConnection &connection, int soundId,
                                       const std::string &filePath, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadEffectEx(connection, soundId, filePath.c_str(), startPos);
}

int RtcEngineExBridge::playEffectEx(const agora::rtc::RtcConnection &connection, int soundId,
                                    const std::string &filePath, int loopCount, double pitch, double pan, int gain,
                                    bool publish, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->playEffectEx(connection, soundId, filePath.c_str(), loopCount, pitch, pan, gain, publish, startPos);
}
