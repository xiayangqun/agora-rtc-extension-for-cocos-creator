#include "agora/RtcEngineExBridge.h"

#include "agora/RtcEngineEventHandlerExBridge.h"

namespace {
const char *nullableCString(const std::string &value) {
    return value.empty() ? nullptr : value.c_str();
}
} // namespace

// =============================================================================
// Constructor / Destructor
// =============================================================================

RtcEngineExBridge::RtcEngineExBridge() = default;

RtcEngineExBridge::~RtcEngineExBridge() {
    release(true);
}

// =============================================================================
// 0. release (SDK: static void release in IRtcEngine, first method)
// =============================================================================

void RtcEngineExBridge::release(bool sync) {
    (void)sync;
    if (_eventHandler != nullptr) {
        // Stop already queued Cocos-thread callbacks before releasing the SDK
        // object. Those lambdas may still hold the handler bridge alive, but
        // they must not call back into the TS engine after release().
        _eventHandler->invalidateCallbacks();
    }
    if (_engine != nullptr) {
        agora::rtc::IRtcEngine::release(nullptr);
        _engine = nullptr;
    }
    _eventHandler.reset();
    _appId.clear();
}

// =============================================================================
// 1. initialize
// =============================================================================

int RtcEngineExBridge::initialize(
    const AgoraRtcNativeContext &context,
    se::Object *eventHandler) {
    release(true);

    _engine = createAgoraRtcEngine();
    if (_engine == nullptr) {
        return -1;
    }

    _eventHandler = std::make_shared<RtcEngineEventHandlerExBridge>(eventHandler);
    _appId = context.appId;

    agora::rtc::RtcEngineContext rtcContext;
    rtcContext.eventHandler = _eventHandler.get();
    rtcContext.appId = _appId.c_str();
    rtcContext.context = nullptr;
    rtcContext.channelProfile = static_cast<agora::CHANNEL_PROFILE_TYPE>(context.channelProfile);
    rtcContext.audioScenario = static_cast<agora::rtc::AUDIO_SCENARIO_TYPE>(context.audioScenario);
    rtcContext.areaCode = context.areaCode;

    return _engine->initialize(rtcContext);
}

// =============================================================================
// 2. queryInterface — stub
// =============================================================================

int RtcEngineExBridge::queryInterface(int /*iid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 3. getVersion
// =============================================================================

GetVersionResult RtcEngineExBridge::getVersion() {
    GetVersionResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    int build = 0;
    _engine->getVersion(&build);
    result.errorCode = 0;
    result.build = build;
    return result;
}

// =============================================================================
// 4. getErrorDescription
// =============================================================================

const char *RtcEngineExBridge::getErrorDescription(int code) {
    if (_engine == nullptr) { return ""; }
    return _engine->getErrorDescription(code);
}

// =============================================================================
// 5. queryCodecCapability
// =============================================================================

QueryCodecCapabilityResult RtcEngineExBridge::queryCodecCapability() {
    QueryCodecCapabilityResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    int size = 0;
    result.errorCode = _engine->queryCodecCapability(nullptr, size);
    result.size = size;
    return result;
}

// =============================================================================
// 6. queryDeviceScore
// =============================================================================

int RtcEngineExBridge::queryDeviceScore() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->queryDeviceScore();
}

// =============================================================================
// 7. preloadChannel
// =============================================================================

int RtcEngineExBridge::preloadChannel(
    const std::string &token,
    const std::string &channelId,
    agora::rtc::uid_t uid) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadChannel(nullableCString(token), channelId.c_str(), uid);
}

// =============================================================================
// 8. preloadChannelWithUserAccount
// =============================================================================

int RtcEngineExBridge::preloadChannelWithUserAccount(
    const std::string &token,
    const std::string &channelId,
    const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadChannelWithUserAccount(
        nullableCString(token), channelId.c_str(), userAccount.c_str());
}

// =============================================================================
// 9. updatePreloadChannelToken
// =============================================================================

int RtcEngineExBridge::updatePreloadChannelToken(const std::string &token) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updatePreloadChannelToken(token.c_str());
}

// =============================================================================
// 10–11. joinChannel (2 overloads)
// =============================================================================

int RtcEngineExBridge::joinChannel(
    const std::string &token,
    const std::string &channelId,
    const std::string &info,
    agora::rtc::uid_t uid) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannel(nullableCString(token), channelId.c_str(), nullableCString(info), uid);
}

int RtcEngineExBridge::joinChannel(
    const std::string &token,
    const std::string &channelId,
    agora::rtc::uid_t uid,
    const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannel(nullableCString(token), channelId.c_str(), uid, options);
}

// =============================================================================
// 12. updateChannelMediaOptions
// =============================================================================

int RtcEngineExBridge::updateChannelMediaOptions(const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->updateChannelMediaOptions(options);
}

// =============================================================================
// 13. leaveChannel
// =============================================================================

int RtcEngineExBridge::leaveChannel() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannel();
}

// =============================================================================
// 14. leaveChannel (with LeaveChannelOptions)
// =============================================================================

int RtcEngineExBridge::leaveChannel(const agora::rtc::LeaveChannelOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->leaveChannel(options);
}

// =============================================================================
// 15. renewToken
// =============================================================================

int RtcEngineExBridge::renewToken(const std::string &token) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->renewToken(token.c_str());
}

// =============================================================================
// 16. setChannelProfile
// =============================================================================

int RtcEngineExBridge::setChannelProfile(int profile) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setChannelProfile(static_cast<agora::CHANNEL_PROFILE_TYPE>(profile));
}

// =============================================================================
// 17–18. setClientRole (2 overloads)
// =============================================================================

int RtcEngineExBridge::setClientRole(int role) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setClientRole(static_cast<agora::rtc::CLIENT_ROLE_TYPE>(role));
}

int RtcEngineExBridge::setClientRole(int role, int audienceLatencyLevel) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    agora::rtc::ClientRoleOptions opt;
    opt.audienceLatencyLevel = static_cast<agora::rtc::AUDIENCE_LATENCY_LEVEL_TYPE>(audienceLatencyLevel);
    return _engine->setClientRole(static_cast<agora::rtc::CLIENT_ROLE_TYPE>(role), opt);
}

// =============================================================================
// 19. startEchoTest — stub
// =============================================================================

int RtcEngineExBridge::startEchoTest(const agora::rtc::EchoTestConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startEchoTest(config);
}

// =============================================================================
// 20. stopEchoTest
// =============================================================================

int RtcEngineExBridge::stopEchoTest() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopEchoTest();
}

// =============================================================================
// 21. enableMultiCamera — stub
// =============================================================================

int RtcEngineExBridge::enableMultiCamera(bool enabled, const agora::rtc::CameraCapturerConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(__APPLE__) && TARGET_OS_IOS
    return _engine->enableMultiCamera(enabled, config);
#else
    (void)enabled;
    (void)config;
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

// =============================================================================
// 22. enableVideo
// =============================================================================

int RtcEngineExBridge::enableVideo() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVideo();
}

// =============================================================================
// 23. disableVideo
// =============================================================================

int RtcEngineExBridge::disableVideo() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->disableVideo();
}

// =============================================================================
// 24–25. startPreview (2 overloads)
// =============================================================================

int RtcEngineExBridge::startPreview() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startPreview();
}

int RtcEngineExBridge::startPreview(int sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startPreview(static_cast<agora::rtc::VIDEO_SOURCE_TYPE>(sourceType));
}

// =============================================================================
// 26–27. stopPreview (2 overloads)
// =============================================================================

int RtcEngineExBridge::stopPreview() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopPreview();
}

int RtcEngineExBridge::stopPreview(int sourceType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopPreview(static_cast<agora::rtc::VIDEO_SOURCE_TYPE>(sourceType));
}

// =============================================================================
// 28. startLastmileProbeTest — stub
// =============================================================================

int RtcEngineExBridge::startLastmileProbeTest(const agora::rtc::LastmileProbeConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startLastmileProbeTest(config);
}

// =============================================================================
// 29. stopLastmileProbeTest
// =============================================================================

int RtcEngineExBridge::stopLastmileProbeTest() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopLastmileProbeTest();
}

// =============================================================================
// 30. setVideoEncoderConfiguration — stub
// =============================================================================

int RtcEngineExBridge::setVideoEncoderConfiguration(const agora::rtc::VideoEncoderConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoEncoderConfiguration(config);
}

// =============================================================================
// 31–42: Beauty / filter / video effect — stubs
// =============================================================================

int RtcEngineExBridge::setBeautyEffectOptions(
    bool enabled, const agora::rtc::BeautyOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setBeautyEffectOptions(enabled, options, type);
}

int RtcEngineExBridge::setFaceShapeBeautyOptions(
    bool enabled, const agora::rtc::FaceShapeBeautyOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setFaceShapeBeautyOptions(enabled, options, type);
}

int RtcEngineExBridge::setFaceShapeAreaOptions(
    const agora::rtc::FaceShapeAreaOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setFaceShapeAreaOptions(options, type);
}

GetFaceShapeBeautyOptionsResult RtcEngineExBridge::getFaceShapeBeautyOptions(int /*type*/) {
    GetFaceShapeBeautyOptionsResult result{};
    result.errorCode = -agora::ERR_NOT_SUPPORTED;
    return result;
}

GetFaceShapeAreaOptionsResult RtcEngineExBridge::getFaceShapeAreaOptions(int /*shapeArea*/, int /*type*/) {
    GetFaceShapeAreaOptionsResult result{};
    result.errorCode = -agora::ERR_NOT_SUPPORTED;
    return result;
}

int RtcEngineExBridge::setFilterEffectOptions(
    bool enabled, const agora::rtc::FilterEffectOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setFilterEffectOptions(enabled, options, type);
}

int RtcEngineExBridge::createVideoEffectObject(const std::string & /*bundlePath*/, int /*type*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::destroyVideoEffectObject(int /*videoEffectObject*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setLowlightEnhanceOptions(
    bool enabled, const agora::rtc::LowlightEnhanceOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLowlightEnhanceOptions(enabled, options, type);
}

int RtcEngineExBridge::setVideoDenoiserOptions(
    bool enabled, const agora::rtc::VideoDenoiserOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoDenoiserOptions(enabled, options, type);
}

int RtcEngineExBridge::setColorEnhanceOptions(
    bool enabled, const agora::rtc::ColorEnhanceOptions &options, agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setColorEnhanceOptions(enabled, options, type);
}

int RtcEngineExBridge::enableVirtualBackground(
    bool enabled,
    const agora::rtc::VirtualBackgroundSource &backgroundSource,
    const agora::rtc::SegmentationProperty &segproperty,
    agora::media::MEDIA_SOURCE_TYPE type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVirtualBackground(enabled, backgroundSource, segproperty, type);
}

// =============================================================================
// 43. setupRemoteVideo — stub
// =============================================================================

int RtcEngineExBridge::setupRemoteVideo(const agora::rtc::VideoCanvas &canvas) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setupRemoteVideo(canvas);
}

// =============================================================================
// 44. setupLocalVideo — stub
// =============================================================================

int RtcEngineExBridge::setupLocalVideo(const agora::rtc::VideoCanvas &canvas) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setupLocalVideo(canvas);
}

// =============================================================================
// 45. setVideoScenario
// =============================================================================

int RtcEngineExBridge::setVideoScenario(int scenarioType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoScenario(
        static_cast<agora::rtc::VIDEO_APPLICATION_SCENARIO_TYPE>(scenarioType));
}

// =============================================================================
// 46. setVideoQoEPreference
// =============================================================================

int RtcEngineExBridge::setVideoQoEPreference(int qoePreference) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVideoQoEPreference(
        static_cast<agora::rtc::VIDEO_QOE_PREFERENCE_TYPE>(qoePreference));
}

// =============================================================================
// 47. enableAudio
// =============================================================================

int RtcEngineExBridge::enableAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudio();
}

// =============================================================================
// 48. disableAudio
// =============================================================================

int RtcEngineExBridge::disableAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->disableAudio();
}

// =============================================================================
// 49. setAudioProfile (deprecated, 2 params)
// =============================================================================

int RtcEngineExBridge::setAudioProfile(int profile, int scenario) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioProfile(
        static_cast<agora::rtc::AUDIO_PROFILE_TYPE>(profile),
        static_cast<agora::rtc::AUDIO_SCENARIO_TYPE>(scenario));
}

// =============================================================================
// 50. setAudioProfile (1 param)
// =============================================================================

int RtcEngineExBridge::setAudioProfile(int profile) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioProfile(
        static_cast<agora::rtc::AUDIO_PROFILE_TYPE>(profile));
}

// =============================================================================
// 51. setAudioScenario
// =============================================================================

int RtcEngineExBridge::setAudioScenario(int scenario) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioScenario(
        static_cast<agora::rtc::AUDIO_SCENARIO_TYPE>(scenario));
}

// =============================================================================
// 52. enableLocalAudio
// =============================================================================

int RtcEngineExBridge::enableLocalAudio(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLocalAudio(enabled);
}

// =============================================================================
// 53. muteLocalAudioStream
// =============================================================================

int RtcEngineExBridge::muteLocalAudioStream(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteLocalAudioStream(mute);
}

// =============================================================================
// 54. muteAllRemoteAudioStreams
// =============================================================================

int RtcEngineExBridge::muteAllRemoteAudioStreams(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteAllRemoteAudioStreams(mute);
}

// =============================================================================
// 55. muteRemoteAudioStream
// =============================================================================

int RtcEngineExBridge::muteRemoteAudioStream(agora::rtc::uid_t uid, bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRemoteAudioStream(uid, mute);
}

// =============================================================================
// 56. muteLocalVideoStream
// =============================================================================

int RtcEngineExBridge::muteLocalVideoStream(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteLocalVideoStream(mute);
}

// =============================================================================
// 57. enableLocalVideo
// =============================================================================

int RtcEngineExBridge::enableLocalVideo(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLocalVideo(enabled);
}

// =============================================================================
// 58. muteAllRemoteVideoStreams
// =============================================================================

int RtcEngineExBridge::muteAllRemoteVideoStreams(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteAllRemoteVideoStreams(mute);
}

// =============================================================================
// 59. setRemoteDefaultVideoStreamType
// =============================================================================

int RtcEngineExBridge::setRemoteDefaultVideoStreamType(int streamType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteDefaultVideoStreamType(
        static_cast<agora::rtc::VIDEO_STREAM_TYPE>(streamType));
}

// =============================================================================
// 60. muteRemoteVideoStream
// =============================================================================

int RtcEngineExBridge::muteRemoteVideoStream(agora::rtc::uid_t uid, bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRemoteVideoStream(uid, mute);
}

// =============================================================================
// 61. setRemoteVideoStreamType
// =============================================================================

int RtcEngineExBridge::setRemoteVideoStreamType(agora::rtc::uid_t uid, int streamType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVideoStreamType(
        uid, static_cast<agora::rtc::VIDEO_STREAM_TYPE>(streamType));
}

// =============================================================================
// 62. setRemoteVideoSubscriptionOptions — stub
// =============================================================================

int RtcEngineExBridge::setRemoteVideoSubscriptionOptions(
    agora::rtc::uid_t uid, const agora::rtc::VideoSubscriptionOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVideoSubscriptionOptions(uid, options);
}

// =============================================================================
// 63–66: Subscribe blocklist/allowlist — stubs
// =============================================================================

int RtcEngineExBridge::setSubscribeAudioBlocklist(int /*uidList*/, int /*uidNumber*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setSubscribeAudioAllowlist(int /*uidList*/, int /*uidNumber*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setSubscribeVideoBlocklist(int /*uidList*/, int /*uidNumber*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setSubscribeVideoAllowlist(int /*uidList*/, int /*uidNumber*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 67. enableAudioVolumeIndication
// =============================================================================

int RtcEngineExBridge::enableAudioVolumeIndication(int interval, int smooth, bool reportVad) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudioVolumeIndication(interval, smooth, reportVad);
}

// =============================================================================
// 68–69. startAudioRecording — stubs
// =============================================================================

int RtcEngineExBridge::startAudioRecording(const std::string &filePath, int quality) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioRecording(
        filePath.c_str(), static_cast<agora::rtc::AUDIO_RECORDING_QUALITY_TYPE>(quality));
}

int RtcEngineExBridge::startAudioRecording(const std::string &filePath, int sampleRate, int quality) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioRecording(
        filePath.c_str(), sampleRate, static_cast<agora::rtc::AUDIO_RECORDING_QUALITY_TYPE>(quality));
}

int RtcEngineExBridge::startAudioRecording(const agora::rtc::AudioRecordingConfiguration &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioRecording(config);
}

// =============================================================================
// 70. registerAudioEncodedFrameObserver — stub
// =============================================================================

int RtcEngineExBridge::registerAudioEncodedFrameObserver(int /*config*/, int /*observer*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 71. stopAudioRecording
// =============================================================================

int RtcEngineExBridge::stopAudioRecording() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopAudioRecording();
}

// =============================================================================
// 72–75. Media player / recorder — stubs
// =============================================================================

int RtcEngineExBridge::createMediaPlayer() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::destroyMediaPlayer(int /*mediaPlayer*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::createMediaRecorder(int /*info*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::destroyMediaRecorder(int /*mediaRecorder*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 76–77. startAudioMixing (2 overloads)
// =============================================================================

int RtcEngineExBridge::startAudioMixing(const std::string &filePath, bool loopback, int cycle) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioMixing(filePath.c_str(), loopback, cycle);
}

int RtcEngineExBridge::startAudioMixing(
    const std::string &filePath, bool loopback, int cycle, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startAudioMixing(filePath.c_str(), loopback, cycle, startPos);
}

// =============================================================================
// 78. stopAudioMixing
// =============================================================================

int RtcEngineExBridge::stopAudioMixing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopAudioMixing();
}

// =============================================================================
// 79. pauseAudioMixing
// =============================================================================

int RtcEngineExBridge::pauseAudioMixing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAudioMixing();
}

// =============================================================================
// 80. resumeAudioMixing
// =============================================================================

int RtcEngineExBridge::resumeAudioMixing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAudioMixing();
}

// =============================================================================
// 81. selectAudioTrack
// =============================================================================

int RtcEngineExBridge::selectAudioTrack(int index) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->selectAudioTrack(index);
}

// =============================================================================
// 82. getAudioTrackCount
// =============================================================================

GetAudioTrackCountResult RtcEngineExBridge::getAudioTrackCount() {
    GetAudioTrackCountResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getAudioTrackCount();
    return result;
}

// =============================================================================
// 83. adjustAudioMixingVolume
// =============================================================================

int RtcEngineExBridge::adjustAudioMixingVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustAudioMixingVolume(volume);
}

// =============================================================================
// 84. adjustAudioMixingPublishVolume
// =============================================================================

int RtcEngineExBridge::adjustAudioMixingPublishVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustAudioMixingPublishVolume(volume);
}

// =============================================================================
// 85. getAudioMixingPublishVolume
// =============================================================================

GetAudioMixingPublishVolumeResult RtcEngineExBridge::getAudioMixingPublishVolume() {
    GetAudioMixingPublishVolumeResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getAudioMixingPublishVolume();
    return result;
}

// =============================================================================
// 86. adjustAudioMixingPlayoutVolume
// =============================================================================

int RtcEngineExBridge::adjustAudioMixingPlayoutVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustAudioMixingPlayoutVolume(volume);
}

// =============================================================================
// 87. getAudioMixingPlayoutVolume
// =============================================================================

GetAudioMixingPlayoutVolumeResult RtcEngineExBridge::getAudioMixingPlayoutVolume() {
    GetAudioMixingPlayoutVolumeResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getAudioMixingPlayoutVolume();
    return result;
}

// =============================================================================
// 88. getAudioMixingDuration
// =============================================================================

GetAudioMixingDurationResult RtcEngineExBridge::getAudioMixingDuration() {
    GetAudioMixingDurationResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getAudioMixingDuration();
    return result;
}

// =============================================================================
// 89. getAudioMixingCurrentPosition
// =============================================================================

GetAudioMixingCurrentPositionResult RtcEngineExBridge::getAudioMixingCurrentPosition() {
    GetAudioMixingCurrentPositionResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getAudioMixingCurrentPosition();
    return result;
}

// =============================================================================
// 90. setAudioMixingPosition
// =============================================================================

int RtcEngineExBridge::setAudioMixingPosition(int pos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingPosition(pos);
}

// =============================================================================
// 91. setAudioMixingDualMonoMode
// =============================================================================

int RtcEngineExBridge::setAudioMixingDualMonoMode(int mode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingDualMonoMode(
        static_cast<agora::media::AUDIO_MIXING_DUAL_MONO_MODE>(mode));
}

// =============================================================================
// 92. setAudioMixingPitch
// =============================================================================

int RtcEngineExBridge::setAudioMixingPitch(int pitch) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingPitch(pitch);
}

// =============================================================================
// 93. setAudioMixingPlaybackSpeed
// =============================================================================

int RtcEngineExBridge::setAudioMixingPlaybackSpeed(int speed) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioMixingPlaybackSpeed(speed);
}

// =============================================================================
// 94. getEffectsVolume
// =============================================================================

GetEffectsVolumeResult RtcEngineExBridge::getEffectsVolume() {
    GetEffectsVolumeResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    int volume = _engine->getEffectsVolume();
    result.errorCode = volume < 0 ? volume : 0;
    result.volume = volume < 0 ? 0 : volume;
    return result;
}

// =============================================================================
// 95. setEffectsVolume
// =============================================================================

int RtcEngineExBridge::setEffectsVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setEffectsVolume(volume);
}

// =============================================================================
// 96. preloadEffect
// =============================================================================

int RtcEngineExBridge::preloadEffect(int soundId, const std::string &filePath, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->preloadEffect(soundId, filePath.c_str(), startPos);
}

// =============================================================================
// 97. playEffect
// =============================================================================

int RtcEngineExBridge::playEffect(
    int soundId, const std::string &filePath, int loopCount,
    double pitch, double pan, int gain, bool publish, int startPos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->playEffect(
        soundId, filePath.c_str(), loopCount, pitch, pan,
        gain, publish, startPos);
}

// =============================================================================
// 98. playAllEffects
// =============================================================================

int RtcEngineExBridge::playAllEffects(
    int loopCount, double pitch, double pan, int gain, bool publish) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->playAllEffects(loopCount, pitch, pan, gain, publish);
}

// =============================================================================
// 99. getVolumeOfEffect
// =============================================================================

GetVolumeOfEffectResult RtcEngineExBridge::getVolumeOfEffect(int soundId) {
    GetVolumeOfEffectResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    int volume = _engine->getVolumeOfEffect(soundId);
    result.errorCode = volume < 0 ? volume : 0;
    result.volume = volume < 0 ? 0 : volume;
    return result;
}

// =============================================================================
// 100. setVolumeOfEffect
// =============================================================================

int RtcEngineExBridge::setVolumeOfEffect(int soundId, int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVolumeOfEffect(soundId, volume);
}

// =============================================================================
// 101. pauseEffect
// =============================================================================

int RtcEngineExBridge::pauseEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseEffect(soundId);
}

// =============================================================================
// 102. pauseAllEffects
// =============================================================================

int RtcEngineExBridge::pauseAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAllEffects();
}

// =============================================================================
// 103. resumeEffect
// =============================================================================

int RtcEngineExBridge::resumeEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeEffect(soundId);
}

// =============================================================================
// 104. resumeAllEffects
// =============================================================================

int RtcEngineExBridge::resumeAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAllEffects();
}

// =============================================================================
// 105. stopEffect
// =============================================================================

int RtcEngineExBridge::stopEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopEffect(soundId);
}

// =============================================================================
// 106. stopAllEffects
// =============================================================================

int RtcEngineExBridge::stopAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopAllEffects();
}

// =============================================================================
// 107. unloadEffect
// =============================================================================

int RtcEngineExBridge::unloadEffect(int soundId) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->unloadEffect(soundId);
}

// =============================================================================
// 108. unloadAllEffects
// =============================================================================

int RtcEngineExBridge::unloadAllEffects() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->unloadAllEffects();
}

// =============================================================================
// 109. getEffectDuration
// =============================================================================

GetEffectDurationResult RtcEngineExBridge::getEffectDuration(const std::string &filePath) {
    GetEffectDurationResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getEffectDuration(filePath.c_str());
    return result;
}

// =============================================================================
// 110. setEffectPosition
// =============================================================================

int RtcEngineExBridge::setEffectPosition(int soundId, int pos) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setEffectPosition(soundId, pos);
}

// =============================================================================
// 111. getEffectCurrentPosition
// =============================================================================

GetEffectCurrentPositionResult RtcEngineExBridge::getEffectCurrentPosition(int soundId) {
    GetEffectCurrentPositionResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getEffectCurrentPosition(soundId);
    return result;
}

// =============================================================================
// 112. enableSoundPositionIndication
// =============================================================================

int RtcEngineExBridge::enableSoundPositionIndication(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableSoundPositionIndication(enabled);
}

// =============================================================================
// 113. setRemoteVoicePosition
// =============================================================================

int RtcEngineExBridge::setRemoteVoicePosition(agora::rtc::uid_t uid, double pan, double gain) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteVoicePosition(uid, pan, gain);
}

// =============================================================================
// 114. enableSpatialAudio
// =============================================================================

int RtcEngineExBridge::enableSpatialAudio(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableSpatialAudio(enabled);
}

// =============================================================================
// 115. setRemoteUserSpatialAudioParams — stub
// =============================================================================

int RtcEngineExBridge::setRemoteUserSpatialAudioParams(agora::rtc::uid_t /*uid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 116. setVoiceBeautifierPreset
// =============================================================================

int RtcEngineExBridge::setVoiceBeautifierPreset(int preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVoiceBeautifierPreset(
        static_cast<agora::rtc::VOICE_BEAUTIFIER_PRESET>(preset));
}

// =============================================================================
// 117. setAudioEffectPreset
// =============================================================================

int RtcEngineExBridge::setAudioEffectPreset(int preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioEffectPreset(
        static_cast<agora::rtc::AUDIO_EFFECT_PRESET>(preset));
}

// =============================================================================
// 118. setVoiceConversionPreset
// =============================================================================

int RtcEngineExBridge::setVoiceConversionPreset(int preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setVoiceConversionPreset(
        static_cast<agora::rtc::VOICE_CONVERSION_PRESET>(preset));
}

// =============================================================================
// 119. setAudioEffectParameters
// =============================================================================

int RtcEngineExBridge::setAudioEffectParameters(int preset, int param1, int param2) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAudioEffectParameters(
        static_cast<agora::rtc::AUDIO_EFFECT_PRESET>(preset), param1, param2);
}

// =============================================================================
// 120. setLocalVoicePitch
// =============================================================================

int RtcEngineExBridge::setLocalVoicePitch(double pitch) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoicePitch(pitch);
}

// =============================================================================
// 121. setLocalVoiceFormant
// =============================================================================

int RtcEngineExBridge::setLocalVoiceFormant(double formantRatio) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoiceFormant(formantRatio);
}

// =============================================================================
// 122. setLocalVoiceEqualization
// =============================================================================

int RtcEngineExBridge::setLocalVoiceEqualization(int bandFrequency, int bandGain) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoiceEqualization(
        static_cast<agora::rtc::AUDIO_EQUALIZATION_BAND_FREQUENCY>(bandFrequency), bandGain);
}

// =============================================================================
// 123. setLocalVoiceReverb
// =============================================================================

int RtcEngineExBridge::setLocalVoiceReverb(int reverbKey, int value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVoiceReverb(
        static_cast<agora::rtc::AUDIO_REVERB_TYPE>(reverbKey), value);
}

// =============================================================================
// 124. setHeadphoneEQPreset
// =============================================================================

int RtcEngineExBridge::setHeadphoneEQPreset(int preset) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setHeadphoneEQPreset(
        static_cast<agora::rtc::HEADPHONE_EQUALIZER_PRESET>(preset));
}

// =============================================================================
// 125. setHeadphoneEQParameters
// =============================================================================

int RtcEngineExBridge::setHeadphoneEQParameters(int lowGain, int highGain) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setHeadphoneEQParameters(lowGain, highGain);
}

// =============================================================================
// 126. enableVoiceAITuner
// =============================================================================

int RtcEngineExBridge::enableVoiceAITuner(bool enabled, int type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableVoiceAITuner(
        enabled, static_cast<agora::rtc::VOICE_AI_TUNER_TYPE>(type));
}

// =============================================================================
// 127. setLogFile
// =============================================================================

int RtcEngineExBridge::setLogFile(const std::string &filePath) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogFile(filePath.c_str());
}

// =============================================================================
// 128. setLogFilter
// =============================================================================

int RtcEngineExBridge::setLogFilter(unsigned int filter) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogFilter(filter);
}

// =============================================================================
// 129. setLogLevel
// =============================================================================

int RtcEngineExBridge::setLogLevel(int level) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogLevel(static_cast<agora::commons::LOG_LEVEL>(level));
}

// =============================================================================
// 130. setLogFileSize
// =============================================================================

int RtcEngineExBridge::setLogFileSize(unsigned int fileSizeInKBytes) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLogFileSize(fileSizeInKBytes);
}

// =============================================================================
// 131. uploadLogFile — stub
// =============================================================================

int RtcEngineExBridge::uploadLogFile() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 132. writeLog — stub (varargs)
// =============================================================================

int RtcEngineExBridge::writeLog(int /*level*/, const std::string & /*message*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 133. setLocalRenderMode (2 params) — stub
// =============================================================================

int RtcEngineExBridge::setLocalRenderMode(int renderMode, int mirrorMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalRenderMode(
        static_cast<agora::media::base::RENDER_MODE_TYPE>(renderMode),
        static_cast<agora::rtc::VIDEO_MIRROR_MODE_TYPE>(mirrorMode));
}

// =============================================================================
// 134. setLocalRenderTargetFps
// =============================================================================

int RtcEngineExBridge::setLocalRenderTargetFps(int sourceType, int targetFps) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalRenderTargetFps(
        static_cast<agora::rtc::VIDEO_SOURCE_TYPE>(sourceType), targetFps);
}

// =============================================================================
// 135. setRemoteRenderTargetFps
// =============================================================================

int RtcEngineExBridge::setRemoteRenderTargetFps(int targetFps) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteRenderTargetFps(targetFps);
}

// =============================================================================
// 136. setLocalRenderMode (deprecated, 1 param)
// =============================================================================

int RtcEngineExBridge::setLocalRenderMode(int renderMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalRenderMode(
        static_cast<agora::media::base::RENDER_MODE_TYPE>(renderMode));
}

// =============================================================================
// 137. setLocalVideoMirrorMode
// =============================================================================

int RtcEngineExBridge::setLocalVideoMirrorMode(int mirrorMode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setLocalVideoMirrorMode(
        static_cast<agora::rtc::VIDEO_MIRROR_MODE_TYPE>(mirrorMode));
}

// =============================================================================
// 138. enableDualStreamMode (deprecated, 1 param)
// =============================================================================

int RtcEngineExBridge::enableDualStreamMode(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableDualStreamMode(enabled);
}

int RtcEngineExBridge::enableDualStreamMode(
    bool enabled, const agora::rtc::SimulcastStreamConfig &streamConfig) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableDualStreamMode(enabled, streamConfig);
}

// =============================================================================
// 139. setDualStreamMode
// =============================================================================

int RtcEngineExBridge::setDualStreamMode(int mode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDualStreamMode(
        static_cast<agora::rtc::SIMULCAST_STREAM_MODE>(mode));
}

// =============================================================================
// 140. setSimulcastConfig — stub
// =============================================================================

int RtcEngineExBridge::setSimulcastConfig() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 141. setDualStreamModeEx (with config) — stub
// =============================================================================

int RtcEngineExBridge::setDualStreamMode(int mode, const agora::rtc::SimulcastStreamConfig &streamConfig) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setDualStreamMode(
        static_cast<agora::rtc::SIMULCAST_STREAM_MODE>(mode), streamConfig);
}

// =============================================================================
// 142. enableCustomAudioLocalPlayback — stub
// =============================================================================

int RtcEngineExBridge::enableCustomAudioLocalPlayback() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 143. setMixedAudioFrameParameters
// =============================================================================

int RtcEngineExBridge::setMixedAudioFrameParameters(
    int sampleRate, int channel, int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setMixedAudioFrameParameters(sampleRate, channel, samplesPerCall);
}

// =============================================================================
// 144. setPlaybackAudioFrameBeforeMixingParameters
// =============================================================================

int RtcEngineExBridge::setPlaybackAudioFrameBeforeMixingParameters(
    int sampleRate, int channel) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setPlaybackAudioFrameBeforeMixingParameters(sampleRate, channel);
}

int RtcEngineExBridge::setPlaybackAudioFrameBeforeMixingParameters(
    int sampleRate, int channel, int samplesPerCall) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setPlaybackAudioFrameBeforeMixingParameters(sampleRate, channel, samplesPerCall);
}

// =============================================================================
// 145. enableAudioSpectrumMonitor
// =============================================================================

int RtcEngineExBridge::enableAudioSpectrumMonitor(int intervalInMS) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableAudioSpectrumMonitor(intervalInMS);
}

// =============================================================================
// 146. disableAudioSpectrumMonitor
// =============================================================================

int RtcEngineExBridge::disableAudioSpectrumMonitor() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->disableAudioSpectrumMonitor();
}

// =============================================================================
// 147. registerAudioSpectrumObserver — stub
// =============================================================================

int RtcEngineExBridge::registerAudioSpectrumObserver() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 148. unregisterAudioSpectrumObserver — stub
// =============================================================================

int RtcEngineExBridge::unregisterAudioSpectrumObserver() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 149. adjustRecordingSignalVolume
// =============================================================================

int RtcEngineExBridge::adjustRecordingSignalVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustRecordingSignalVolume(volume);
}

// =============================================================================
// 150. muteRecordingSignal
// =============================================================================

int RtcEngineExBridge::muteRecordingSignal(bool mute) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->muteRecordingSignal(mute);
}

// =============================================================================
// 151. adjustPlaybackSignalVolume
// =============================================================================

int RtcEngineExBridge::adjustPlaybackSignalVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustPlaybackSignalVolume(volume);
}

// =============================================================================
// 152. adjustUserPlaybackSignalVolume
// =============================================================================

int RtcEngineExBridge::adjustUserPlaybackSignalVolume(agora::rtc::uid_t uid, int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustUserPlaybackSignalVolume(uid, volume);
}

// =============================================================================
// 153. setRemoteSubscribeFallbackOption
// =============================================================================

int RtcEngineExBridge::setRemoteSubscribeFallbackOption(int option) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteSubscribeFallbackOption(
        static_cast<agora::rtc::STREAM_FALLBACK_OPTIONS>(option));
}

// =============================================================================
// 154. setHighPriorityUserList — stub
// =============================================================================

int RtcEngineExBridge::setHighPriorityUserList() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 155–157. Extension — stubs
// =============================================================================

int RtcEngineExBridge::enableExtension(
    const std::string &provider, const std::string &extension,
    const agora::rtc::ExtensionInfo &extensionInfo, bool enable) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableExtension(provider.c_str(), extension.c_str(), extensionInfo, enable);
}

int RtcEngineExBridge::enableExtension(
    const std::string &provider, const std::string &extension,
    bool enable, int type) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableExtension(
        provider.c_str(), extension.c_str(), enable,
        static_cast<agora::media::MEDIA_SOURCE_TYPE>(type));
}

int RtcEngineExBridge::setExtensionProperty(
    const std::string &provider, const std::string &extension,
    const std::string &key, const std::string &value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setExtensionProperty(
        provider.c_str(), extension.c_str(), key.c_str(), value.c_str());
}

int RtcEngineExBridge::getExtensionProperty(
    const std::string & /*provider*/, const std::string & /*extension*/,
    const std::string & /*key*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 158. enableLoopbackRecording
// =============================================================================

int RtcEngineExBridge::enableLoopbackRecording(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableLoopbackRecording(enabled);
}

// =============================================================================
// 159. adjustLoopbackSignalVolume
// =============================================================================

int RtcEngineExBridge::adjustLoopbackSignalVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->adjustLoopbackSignalVolume(volume);
}

// =============================================================================
// 160. getLoopbackRecordingVolume
// =============================================================================

GetLoopbackRecordingVolumeResult RtcEngineExBridge::getLoopbackRecordingVolume() {
    GetLoopbackRecordingVolumeResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getLoopbackRecordingVolume();
    return result;
}

// =============================================================================
// 161. enableInEarMonitoring
// =============================================================================

int RtcEngineExBridge::enableInEarMonitoring(bool enabled, int includeAudioFilters) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableInEarMonitoring(enabled, includeAudioFilters);
}

// =============================================================================
// 162. setInEarMonitoringVolume
// =============================================================================

int RtcEngineExBridge::setInEarMonitoringVolume(int volume) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setInEarMonitoringVolume(volume);
}

// =============================================================================
// 163. loadExtensionProvider — stub
// =============================================================================

int RtcEngineExBridge::loadExtensionProvider(const std::string &path) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(_WIN32) || defined(__linux__) || defined(__ANDROID__)
    return _engine->loadExtensionProvider(path.c_str());
#else
    (void)path;
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

// =============================================================================
// 164. setExtensionProviderProperty — stub
// =============================================================================

int RtcEngineExBridge::setExtensionProviderProperty(
    const std::string &provider, const std::string &key,
    const std::string &value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setExtensionProviderProperty(provider.c_str(), key.c_str(), value.c_str());
}

// =============================================================================
// 165. registerExtension — stub
// =============================================================================

int RtcEngineExBridge::registerExtension(
    const std::string &provider, const std::string &extension) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->registerExtension(provider.c_str(), extension.c_str());
}


// =============================================================================
// 167–189. Camera — stubs
// =============================================================================

int RtcEngineExBridge::setCameraCapturerConfiguration() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::createCustomVideoTrack() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::createCustomEncodedVideoTrack() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::destroyCustomVideoTrack() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::destroyCustomEncodedVideoTrack() {
    return -agora::ERR_NOT_SUPPORTED;
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

int RtcEngineExBridge::setCameraZoomFactor(float /*factor*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::enableFaceDetection(bool /*enabled*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

GetCameraMaxZoomFactorResult RtcEngineExBridge::getCameraMaxZoomFactor() {
    GetCameraMaxZoomFactorResult result{};
    result.errorCode = -agora::ERR_NOT_SUPPORTED;
    return result;
}

int RtcEngineExBridge::setCameraFocusPositionInPreview(float /*positionX*/, float /*positionY*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraTorchOn(bool /*isOn*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraAutoFocusFaceModeEnabled(bool /*enabled*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraExposurePositionSupported() {
    return false;
}

int RtcEngineExBridge::setCameraExposurePosition(float /*positionXinView*/, float /*positionYinView*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraExposureSupported() {
    return false;
}

int RtcEngineExBridge::setCameraExposureFactor(float /*factor*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraAutoExposureFaceModeSupported() {
    return false;
}

int RtcEngineExBridge::setCameraAutoExposureFaceModeEnabled(bool /*enabled*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraStabilizationMode(int /*mode*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

bool RtcEngineExBridge::isCameraCenterStageSupported() {
    return false;
}

int RtcEngineExBridge::enableCameraCenterStage(bool /*enabled*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 190. setDefaultAudioRouteToSpeakerphone
// =============================================================================

int RtcEngineExBridge::setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    return _engine->setDefaultAudioRouteToSpeakerphone(defaultToSpeaker);
#else
    (void)defaultToSpeaker;
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

// =============================================================================
// 191. setEnableSpeakerphone
// =============================================================================

int RtcEngineExBridge::setEnableSpeakerphone(bool speakerOn) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    return _engine->setEnableSpeakerphone(speakerOn);
#else
    (void)speakerOn;
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

// =============================================================================
// 192. isSpeakerphoneEnabled
// =============================================================================

bool RtcEngineExBridge::isSpeakerphoneEnabled() {
    if (_engine == nullptr) { return false; }
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    return _engine->isSpeakerphoneEnabled();
#else
    return false;
#endif
}

// =============================================================================
// 193. setRouteInCommunicationMode
// =============================================================================

int RtcEngineExBridge::setRouteInCommunicationMode(int route) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    return _engine->setRouteInCommunicationMode(route);
#else
    (void)route;
    return -agora::ERR_NOT_SUPPORTED;
#endif
}

// =============================================================================
// 194. getScreenCaptureSources — stub
// =============================================================================

int RtcEngineExBridge::getScreenCaptureSources() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 195. setAudioSessionOperationRestriction — stub
// =============================================================================

int RtcEngineExBridge::setAudioSessionOperationRestriction(int /*restriction*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 196. getAudioDeviceInfo — stub
// =============================================================================

int RtcEngineExBridge::getAudioDeviceInfo() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 197. setScreenCaptureContentHint
// =============================================================================

int RtcEngineExBridge::setScreenCaptureContentHint(int contentHint) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setScreenCaptureContentHint(
        static_cast<agora::rtc::VIDEO_CONTENT_HINT>(contentHint));
}

// =============================================================================
// 198. updateScreenCaptureRegion — stub
// =============================================================================

int RtcEngineExBridge::updateScreenCaptureRegion() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 199. updateScreenCaptureParameters — stub
// =============================================================================

int RtcEngineExBridge::updateScreenCaptureParameters() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 200–202. Screen capture — stubs
// =============================================================================

int RtcEngineExBridge::startScreenCapture() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::updateScreenCapture() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::queryScreenCaptureCapability() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 203. queryCameraFocalLengthCapability — stub
// =============================================================================

int RtcEngineExBridge::queryCameraFocalLengthCapability() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 204. setExternalMediaProjection — stub
// =============================================================================

int RtcEngineExBridge::setExternalMediaProjection() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 205. setScreenCaptureScenario
// =============================================================================

int RtcEngineExBridge::setScreenCaptureScenario(int screenScenario) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setScreenCaptureScenario(
        static_cast<agora::rtc::SCREEN_SCENARIO_TYPE>(screenScenario));
}

// =============================================================================
// 206. stopScreenCapture
// =============================================================================

int RtcEngineExBridge::stopScreenCapture() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->stopScreenCapture();
}

// =============================================================================
// 207. getCallId — stub (out param)
// =============================================================================

int RtcEngineExBridge::getCallId() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 208. rate
// =============================================================================

int RtcEngineExBridge::rate(
    const std::string &callId, int rating, const std::string &description) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->rate(callId.c_str(), rating, description.c_str());
}

// =============================================================================
// 209. complain
// =============================================================================

int RtcEngineExBridge::complain(const std::string &callId, const std::string &description) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->complain(callId.c_str(), description.c_str());
}

// =============================================================================
// 210–216. RTMP streaming / transcoder — stubs
// =============================================================================

int RtcEngineExBridge::startRtmpStreamWithoutTranscoding(const std::string & /*url*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::startRtmpStreamWithTranscoding(const std::string & /*url*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::updateRtmpTranscoding() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::startLocalVideoTranscoder() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::updateLocalTranscoderConfiguration() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopRtmpStream(const std::string & /*url*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopLocalVideoTranscoder() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 217–219. Local audio mixer — stubs
// =============================================================================

int RtcEngineExBridge::startLocalAudioMixer() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::updateLocalAudioMixerConfiguration() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopLocalAudioMixer() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 220–224. Camera/screen capture source type — stubs
// =============================================================================

int RtcEngineExBridge::startCameraCapture(int /*sourceType*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopCameraCapture(int /*sourceType*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setCameraDeviceOrientation(int /*type*/, int /*orientation*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setScreenCaptureOrientation(int /*type*/, int /*orientation*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::startScreenCapture(int /*sourceType*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopScreenCapture(int /*sourceType*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 225. getConnectionState
// =============================================================================

int RtcEngineExBridge::getConnectionState() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return static_cast<int>(_engine->getConnectionState());
}

// =============================================================================
// 226–227. registerEventHandler / unregisterEventHandler — stubs
// =============================================================================

int RtcEngineExBridge::registerEventHandler() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::unregisterEventHandler() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 228. setRemoteUserPriority
// =============================================================================

int RtcEngineExBridge::setRemoteUserPriority(agora::rtc::uid_t uid, int userPriority) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setRemoteUserPriority(
        uid, static_cast<agora::rtc::PRIORITY_TYPE>(userPriority));
}

// =============================================================================
// 229. registerPacketObserver — stub
// =============================================================================

int RtcEngineExBridge::registerPacketObserver() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 230. enableEncryption
// =============================================================================

int RtcEngineExBridge::enableEncryption(bool enabled, const agora::rtc::EncryptionConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableEncryption(enabled, config);
}

// =============================================================================
// 231. createDataStream (bool) — stub (out param)
// =============================================================================

int RtcEngineExBridge::createDataStream(bool /*reliable*/, bool /*ordered*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 232. createDataStreamWithConfig — stub (out param)
// =============================================================================

int RtcEngineExBridge::createDataStream(const agora::rtc::DataStreamConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    int streamId = 0;
    return _engine->createDataStream(&streamId, config);
}

// =============================================================================
// 233. sendStreamMessage
// =============================================================================

int RtcEngineExBridge::sendStreamMessage(int streamId, const std::string &data) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendStreamMessage(streamId, data.c_str(), data.length());
}

// =============================================================================
// 234. sendRdtMessage — stub
// =============================================================================

int RtcEngineExBridge::sendRdtMessage(agora::rtc::uid_t /*uid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 235. sendMediaControlMessage — stub
// =============================================================================

int RtcEngineExBridge::sendMediaControlMessage(agora::rtc::uid_t /*uid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 236–239. Watermark — stubs
// =============================================================================

int RtcEngineExBridge::addVideoWatermark() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::addVideoWatermarkByUrl(const std::string & /*watermarkUrl*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::removeVideoWatermark(const std::string & /*id*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::clearVideoWatermarks() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 240–241. pauseAudio / resumeAudio (deprecated)
// =============================================================================

int RtcEngineExBridge::pauseAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->pauseAudio();
}

int RtcEngineExBridge::resumeAudio() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->resumeAudio();
}

// =============================================================================
// 242. enableWebSdkInteroperability
// =============================================================================

int RtcEngineExBridge::enableWebSdkInteroperability(bool enabled) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableWebSdkInteroperability(enabled);
}

// =============================================================================
// 243. sendCustomReportMessage
// =============================================================================

int RtcEngineExBridge::sendCustomReportMessage(
    const std::string &id, const std::string &category,
    const std::string &event, const std::string &label, int value) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendCustomReportMessage(
        id.c_str(), category.c_str(), event.c_str(), label.c_str(), value);
}

// =============================================================================
// 244–245. Media metadata observer — stubs
// =============================================================================

int RtcEngineExBridge::registerMediaMetadataObserver() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::unregisterMediaMetadataObserver() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 246–247. Audio frame dump — stubs
// =============================================================================

int RtcEngineExBridge::startAudioFrameDump(
    const std::string & /*channelId*/, agora::rtc::uid_t /*uid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopAudioFrameDump(
    const std::string & /*channelId*/, agora::rtc::uid_t /*uid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 248. setAINSMode
// =============================================================================

int RtcEngineExBridge::setAINSMode(bool enabled, int mode) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAINSMode(enabled, static_cast<agora::rtc::AUDIO_AINS_MODE>(mode));
}

// =============================================================================
// 249. registerLocalUserAccount
// =============================================================================

int RtcEngineExBridge::registerLocalUserAccount(const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->registerLocalUserAccount(_appId.c_str(), userAccount.c_str());
}

// =============================================================================
// 250–251. joinChannelWithUserAccount (2 overloads)
// =============================================================================

int RtcEngineExBridge::joinChannelWithUserAccount(
    const std::string &token, const std::string &channelId,
    const std::string &userAccount) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannelWithUserAccount(
        nullableCString(token), channelId.c_str(), userAccount.c_str());
}

int RtcEngineExBridge::joinChannelWithUserAccount(
    const std::string &token, const std::string &channelId,
    const std::string &userAccount, const agora::rtc::ChannelMediaOptions &options) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->joinChannelWithUserAccount(
        nullableCString(token), channelId.c_str(), userAccount.c_str(), options);
}

// =============================================================================
// 252–253. getUserInfo — stubs (out param)
// =============================================================================

int RtcEngineExBridge::getUserInfoByUserAccount(const std::string & /*userAccount*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::getUserInfoByUid(agora::rtc::uid_t /*uid*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 254–257. Channel media relay — stubs
// =============================================================================

int RtcEngineExBridge::startOrUpdateChannelMediaRelay() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopChannelMediaRelay() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::pauseAllChannelMediaRelay() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::resumeAllChannelMediaRelay() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 258–261. Direct CDN streaming — stubs
// =============================================================================

int RtcEngineExBridge::setDirectCdnStreamingAudioConfiguration(int /*profile*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::setDirectCdnStreamingVideoConfiguration() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopDirectCdnStreaming() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::updateDirectCdnStreamingMediaOptions() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 262–264. Rhythm player — stubs
// =============================================================================

int RtcEngineExBridge::startRhythmPlayer(
    const std::string & /*sound1*/, const std::string & /*sound2*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::stopRhythmPlayer() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::configRhythmPlayer() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 265–266. takeSnapshot
// =============================================================================

int RtcEngineExBridge::takeSnapshot(agora::rtc::uid_t uid, const std::string &filePath) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->takeSnapshot(uid, filePath.c_str());
}

int RtcEngineExBridge::takeSnapshot(agora::rtc::uid_t uid, const agora::media::SnapshotConfig &config) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->takeSnapshot(uid, config);
}

// =============================================================================
// 267. enableContentInspect — stub
// =============================================================================

int RtcEngineExBridge::enableContentInspect(bool /*enabled*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 268–269. Custom audio volume — stubs
// =============================================================================

int RtcEngineExBridge::adjustCustomAudioPublishVolume() {
    return -agora::ERR_NOT_SUPPORTED;
}

int RtcEngineExBridge::adjustCustomAudioPlayoutVolume() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 270. setCloudProxy
// =============================================================================

int RtcEngineExBridge::setCloudProxy(int proxyType) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setCloudProxy(static_cast<agora::rtc::CLOUD_PROXY_TYPE>(proxyType));
}

// =============================================================================
// 271. setLocalAccessPoint — stub
// =============================================================================

int RtcEngineExBridge::setLocalAccessPoint() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 272. setAdvancedAudioOptions — stub
// =============================================================================

int RtcEngineExBridge::setAdvancedAudioOptions() {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 273. setAVSyncSource
// =============================================================================

int RtcEngineExBridge::setAVSyncSource(
    const std::string &channelId, agora::rtc::uid_t uid) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setAVSyncSource(channelId.c_str(), uid);
}

// =============================================================================
// 274. enableVideoImageSource — stub
// =============================================================================

int RtcEngineExBridge::enableVideoImageSource(bool /*enable*/) {
    return -agora::ERR_NOT_SUPPORTED;
}

// =============================================================================
// 275. getCurrentMonotonicTimeInMs
// =============================================================================

int64_t RtcEngineExBridge::getCurrentMonotonicTimeInMs() {
    if (_engine == nullptr) { return -1; }
    return _engine->getCurrentMonotonicTimeInMs();
}

// =============================================================================
// 276. getNetworkType
// =============================================================================

GetNetworkTypeResult RtcEngineExBridge::getNetworkType() {
    GetNetworkTypeResult result{};
    if (_engine == nullptr) {
        result.errorCode = -agora::ERR_NOT_INITIALIZED;
        return result;
    }
    result.errorCode = _engine->getNetworkType();
    return result;
}

// =============================================================================
// 277. setParameters
// =============================================================================

int RtcEngineExBridge::setParameters(const std::string &parameters) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->setParameters(parameters.c_str());
}

// =============================================================================
// 278. startMediaRenderingTracing
// =============================================================================

int RtcEngineExBridge::startMediaRenderingTracing() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->startMediaRenderingTracing();
}

// =============================================================================
// 279. enableInstantMediaRendering
// =============================================================================

int RtcEngineExBridge::enableInstantMediaRendering() {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->enableInstantMediaRendering();
}

// =============================================================================
// 280. getNtpWallTimeInMs
// =============================================================================

uint64_t RtcEngineExBridge::getNtpWallTimeInMs() {
    if (_engine == nullptr) { return 0; }
    return _engine->getNtpWallTimeInMs();
}

// =============================================================================
// 281. isFeatureAvailableOnDevice — stub
// =============================================================================

bool RtcEngineExBridge::isFeatureAvailableOnDevice(int /*type*/) {
    return false;
}

// =============================================================================
// 282. sendAudioMetadata
// =============================================================================

int RtcEngineExBridge::sendAudioMetadata(const std::string &metadata) {
    if (_engine == nullptr) { return -agora::ERR_NOT_INITIALIZED; }
    return _engine->sendAudioMetadata(metadata.c_str(), metadata.length());
}

// =============================================================================
// 283. queryHDRCapability — stub
// =============================================================================

int RtcEngineExBridge::queryHDRCapability(int /*videoModule*/) {
    return -agora::ERR_NOT_SUPPORTED;
}
