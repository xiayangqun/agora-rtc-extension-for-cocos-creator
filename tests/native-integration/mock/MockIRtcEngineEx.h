#pragma once
#include "IAgoraRtcEngineEx.h"
#include "IAgoraMediaPlayer.h"
#include "IAgoraMediaRecorder.h"
#include "IAgoraSpatialAudio.h"
#include "IAgoraH265Transcoder.h"
#include "IAgoraMusicContentCenter.h"
#include "IAudioDeviceManager.h"
#include <string>
#include <fstream>
#include <chrono>

namespace agora {
namespace rtc {

class MockIRtcEngineEx : public IRtcEngineEx {
public:
    static MockIRtcEngineEx& instance() {
        static MockIRtcEngineEx inst;
        return inst;
    }

    // Stored state
    IRtcEngineEventHandler* eventHandler{nullptr};
    RtcEngineContext storedContext{};

    // Mock sub-interfaces
    IAudioDeviceManager* mockAudioDeviceManager{nullptr};
    IVideoDeviceManager* mockVideoDeviceManager{nullptr};

    // Log-based verification
    void setLogPath(const std::string& path);
    void clearLog();
    std::string readLog();
    void appendLog(const std::string& functionName, const std::string& paramsJson);

    // IRtcEngine + IRtcEngineEx pure virtual overrides
    void release();
    int initialize(const RtcEngineContext& context) override;
    int queryInterface(INTERFACE_ID_TYPE iid, void** inter) override;
    const char* getVersion(int* build) override;
    const char* getErrorDescription(int code) override;
    int queryCodecCapability(CodecCapInfo* codecInfo, int& size) override;
    int queryDeviceScore() override;
    int preloadChannel(const char* token, const char* channelId, uid_t uid) override;
    int preloadChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount) override;
    int updatePreloadChannelToken(const char* token) override;
    int joinChannel(const char* token, const char* channelId, const char* info, uid_t uid) override;
    int joinChannel(const char* token, const char* channelId, uid_t uid, const ChannelMediaOptions& options) override;
    int updateChannelMediaOptions(const ChannelMediaOptions& options) override;
    int leaveChannel() override;
    int leaveChannel(const LeaveChannelOptions& options) override;
    int renewToken(const char* token) override;
    int setChannelProfile(CHANNEL_PROFILE_TYPE profile) override;
    int setClientRole(CLIENT_ROLE_TYPE role) override;
    int setClientRole(CLIENT_ROLE_TYPE role, const ClientRoleOptions& options) override;
    int startEchoTest(const EchoTestConfiguration& config) override;
    int stopEchoTest() override;
#if defined(__APPLE__) && TARGET_OS_IOS
    int enableMultiCamera(bool enabled, const CameraCapturerConfiguration& config) override;
#endif
    int enableVideo() override;
    int disableVideo() override;
    int startPreview() override;
    int startPreview(VIDEO_SOURCE_TYPE sourceType) override;
    int stopPreview() override;
    int stopPreview(VIDEO_SOURCE_TYPE sourceType) override;
    int startLastmileProbeTest(const LastmileProbeConfig& config) override;
    int stopLastmileProbeTest() override;
    int setVideoEncoderConfiguration(const VideoEncoderConfiguration& config) override;
    int setBeautyEffectOptions(bool enabled, const BeautyOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int setFaceShapeBeautyOptions(bool enabled, const FaceShapeBeautyOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int setFaceShapeAreaOptions(const FaceShapeAreaOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int getFaceShapeBeautyOptions(FaceShapeBeautyOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int getFaceShapeAreaOptions(agora::rtc::FaceShapeAreaOptions::FACE_SHAPE_AREA shapeArea, FaceShapeAreaOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int setFilterEffectOptions(bool enabled, const FilterEffectOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    agora_refptr<IVideoEffectObject> createVideoEffectObject(const char* bundlePath, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int destroyVideoEffectObject(agora_refptr<IVideoEffectObject> videoEffectObject) override;
    int setLowlightEnhanceOptions(bool enabled, const LowlightEnhanceOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int setVideoDenoiserOptions(bool enabled, const VideoDenoiserOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int setColorEnhanceOptions(bool enabled, const ColorEnhanceOptions& options, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int enableVirtualBackground(bool enabled, VirtualBackgroundSource backgroundSource, SegmentationProperty segproperty, agora::media::MEDIA_SOURCE_TYPE type = agora::media::PRIMARY_CAMERA_SOURCE) override;
    int setupRemoteVideo(const VideoCanvas& canvas) override;
    int setupLocalVideo(const VideoCanvas& canvas) override;
    int setVideoScenario(VIDEO_APPLICATION_SCENARIO_TYPE scenarioType) override;
    int setVideoQoEPreference(VIDEO_QOE_PREFERENCE_TYPE qoePreference) override;
    int enableAudio() override;
    int disableAudio() override;
    int setAudioProfile(AUDIO_PROFILE_TYPE profile, AUDIO_SCENARIO_TYPE scenario) override;
    int setAudioProfile(AUDIO_PROFILE_TYPE profile) override;
    int setAudioScenario(AUDIO_SCENARIO_TYPE scenario) override;
    int enableLocalAudio(bool enabled) override;
    int muteLocalAudioStream(bool mute) override;
    int muteAllRemoteAudioStreams(bool mute) override;
    int muteRemoteAudioStream(uid_t uid, bool mute) override;
    int muteLocalVideoStream(bool mute) override;
    int enableLocalVideo(bool enabled) override;
    int muteAllRemoteVideoStreams(bool mute) override;
    int setRemoteDefaultVideoStreamType(VIDEO_STREAM_TYPE streamType) override;
    int muteRemoteVideoStream(uid_t uid, bool mute) override;
    int setRemoteVideoStreamType(uid_t uid, VIDEO_STREAM_TYPE streamType) override;
    int setRemoteVideoSubscriptionOptions(uid_t uid, const VideoSubscriptionOptions &options) override;
    int setSubscribeAudioBlocklist(uid_t* uidList, int uidNumber) override;
    int setSubscribeAudioAllowlist(uid_t* uidList, int uidNumber) override;
    int setSubscribeVideoBlocklist(uid_t* uidList, int uidNumber) override;
    int setSubscribeVideoAllowlist(uid_t* uidList, int uidNumber) override;
    int enableAudioVolumeIndication(int interval, int smooth, bool reportVad) override;
    int startAudioRecording(const char* filePath, AUDIO_RECORDING_QUALITY_TYPE quality) override;
    int startAudioRecording(const char* filePath, int sampleRate, AUDIO_RECORDING_QUALITY_TYPE quality) override;
    int startAudioRecording(const AudioRecordingConfiguration& config) override;
    int registerAudioEncodedFrameObserver(const AudioEncodedFrameObserverConfig& config,  IAudioEncodedFrameObserver *observer) override;
    int stopAudioRecording() override;
    agora_refptr<IMediaPlayer> createMediaPlayer() override;
    int destroyMediaPlayer(agora_refptr<IMediaPlayer> media_player) override;
    agora_refptr<IMediaRecorder> createMediaRecorder(const RecorderStreamInfo& info) override;
    int destroyMediaRecorder(agora_refptr<IMediaRecorder> mediaRecorder) override;
    int startAudioMixing(const char* filePath, bool loopback, int cycle) override;
    int startAudioMixing(const char* filePath, bool loopback, int cycle, int startPos) override;
    int stopAudioMixing() override;
    int pauseAudioMixing() override;
    int resumeAudioMixing() override;
    int selectAudioTrack(int index) override;
    int getAudioTrackCount() override;
    int adjustAudioMixingVolume(int volume) override;
    int adjustAudioMixingPublishVolume(int volume) override;
    int getAudioMixingPublishVolume() override;
    int adjustAudioMixingPlayoutVolume(int volume) override;
    int getAudioMixingPlayoutVolume() override;
    int getAudioMixingDuration() override;
    int getAudioMixingCurrentPosition() override;
    int setAudioMixingPosition(int pos /*in ms*/) override;
    int setAudioMixingDualMonoMode(media::AUDIO_MIXING_DUAL_MONO_MODE mode) override;
    int setAudioMixingPitch(int pitch) override;
    int setAudioMixingPlaybackSpeed(int speed) override;
    int getEffectsVolume() override;
    int setEffectsVolume(int volume) override;
    int preloadEffect(int soundId, const char* filePath, int startPos = 0) override;
    int playEffect(int soundId, const char* filePath, int loopCount, double pitch, double pan, int gain, bool publish = false, int startPos = 0) override;
    int playAllEffects(int loopCount, double pitch, double pan, int gain, bool publish = false) override;
    int getVolumeOfEffect(int soundId) override;
    int setVolumeOfEffect(int soundId, int volume) override;
    int pauseEffect(int soundId) override;
    int pauseAllEffects() override;
    int resumeEffect(int soundId) override;
    int resumeAllEffects() override;
    int stopEffect(int soundId) override;
    int stopAllEffects() override;
    int unloadEffect(int soundId) override;
    int unloadAllEffects() override;
    int getEffectDuration(const char* filePath) override;
    int setEffectPosition(int soundId, int pos) override;
    int getEffectCurrentPosition(int soundId) override;
    int enableSoundPositionIndication(bool enabled) override;
    int setRemoteVoicePosition(uid_t uid, double pan, double gain) override;
    int enableSpatialAudio(bool enabled) override;
    int setRemoteUserSpatialAudioParams(uid_t uid, const agora::SpatialAudioParams& params) override;
    int setVoiceBeautifierPreset(VOICE_BEAUTIFIER_PRESET preset) override;
    int setAudioEffectPreset(AUDIO_EFFECT_PRESET preset) override;
    int setVoiceConversionPreset(VOICE_CONVERSION_PRESET preset) override;
    int setAudioEffectParameters(AUDIO_EFFECT_PRESET preset, int param1, int param2) override;
    int setVoiceBeautifierParameters(VOICE_BEAUTIFIER_PRESET preset, int param1, int param2) override;
    int setVoiceConversionParameters(VOICE_CONVERSION_PRESET preset, int param1, int param2) override;
    int setLocalVoicePitch(double pitch) override;
    int setLocalVoiceFormant(double formantRatio) override;
    int setLocalVoiceEqualization(AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency, int bandGain) override;
    int setLocalVoiceReverb(AUDIO_REVERB_TYPE reverbKey, int value) override;
    int setHeadphoneEQPreset(HEADPHONE_EQUALIZER_PRESET preset) override;
    int setHeadphoneEQParameters(int lowGain, int highGain) override;
    int enableVoiceAITuner(bool enabled, VOICE_AI_TUNER_TYPE type) override;
    int setLogFile(const char* filePath) override;
    int setLogFilter(unsigned int filter) override;
    int setLogLevel(commons::LOG_LEVEL level) override;
    int setLogFileSize(unsigned int fileSizeInKBytes) override;
    int uploadLogFile(agora::util::AString& requestId) override;
    int writeLog(commons::LOG_LEVEL level, const char* fmt, ...) override;
    int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
    int setRemoteRenderMode(uid_t uid, media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
    int setLocalRenderTargetFps(VIDEO_SOURCE_TYPE sourceType, int targetFps) override;
    int setRemoteRenderTargetFps(int targetFps) override;
    int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode) override;
    int setLocalVideoMirrorMode(VIDEO_MIRROR_MODE_TYPE mirrorMode) override;
    int enableDualStreamMode(bool enabled) override;
    int enableDualStreamMode(bool enabled, const SimulcastStreamConfig& streamConfig) override;
    int setDualStreamMode(SIMULCAST_STREAM_MODE mode) override;
    int setSimulcastConfig(const SimulcastConfig& simulcastConfig) override;
    int setDualStreamMode(SIMULCAST_STREAM_MODE mode, const SimulcastStreamConfig& streamConfig) override;
    int enableCustomAudioLocalPlayback(track_id_t trackId, bool enabled) override;
    int setRecordingAudioFrameParameters(int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode, int samplesPerCall) override;
    int setPlaybackAudioFrameParameters(int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode, int samplesPerCall) override;
    int setMixedAudioFrameParameters(int sampleRate, int channel, int samplesPerCall) override;
    int setEarMonitoringAudioFrameParameters(int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode, int samplesPerCall) override;
    int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel) override;
    int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel, int samplesPerCall) override;
    int enableAudioSpectrumMonitor(int intervalInMS = 100) override;
    int disableAudioSpectrumMonitor() override;
    int registerAudioSpectrumObserver(agora::media::IAudioSpectrumObserver * observer) override;
    int unregisterAudioSpectrumObserver(agora::media::IAudioSpectrumObserver * observer) override;
    int adjustRecordingSignalVolume(int volume) override;
    int muteRecordingSignal(bool mute) override;
    int adjustPlaybackSignalVolume(int volume) override;
    int adjustUserPlaybackSignalVolume(uid_t uid, int volume) override;
    int setRemoteSubscribeFallbackOption(STREAM_FALLBACK_OPTIONS option) override;
    int setHighPriorityUserList(uid_t* uidList, int uidNum, STREAM_FALLBACK_OPTIONS option) override;
    int enableExtension(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, bool enable = true) override;
    int setExtensionProperty(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, const char* key, const char* value) override;
    int getExtensionProperty(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, const char* key, char* value, int buf_len) override;
    int enableLoopbackRecording(bool enabled, const char* deviceName = NULL) override;
    int adjustLoopbackSignalVolume(int volume) override;
    int getLoopbackRecordingVolume() override;
    int enableInEarMonitoring(bool enabled, int includeAudioFilters) override;
    int setInEarMonitoringVolume(int volume) override;
#if defined(_WIN32) || defined(__ANDROID__) || (defined(__linux__) && !defined(__OHOS__))
    int loadExtensionProvider(const char* path, bool unload_after_use = false) override;
#endif
    int setExtensionProviderProperty(const char* provider, const char* key, const char* value) override;
    int registerExtension(const char* provider, const char* extension, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) override;
    int enableExtension(const char* provider, const char* extension, bool enable=true, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) override;
    int setExtensionProperty(const char* provider, const char* extension, const char* key, const char* value, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) override;
    int getExtensionProperty(const char* provider, const char* extension, const char* key, char* value, int buf_len, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) override;
    int setCameraCapturerConfiguration(const CameraCapturerConfiguration& config) override;
    video_track_id_t createCustomVideoTrack() override;
    video_track_id_t createCustomEncodedVideoTrack(const SenderOptions& sender_option) override;
    int destroyCustomVideoTrack(video_track_id_t video_track_id) override;
    int destroyCustomEncodedVideoTrack(video_track_id_t video_track_id) override;
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    int switchCamera() override;
    bool isCameraZoomSupported() override;
    bool isCameraFaceDetectSupported() override;
    bool isCameraTorchSupported() override;
    bool isCameraFocusSupported() override;
    bool isCameraAutoFocusFaceModeSupported() override;
    int setCameraZoomFactor(float factor) override;
    int enableFaceDetection(bool enabled) override;
    float getCameraMaxZoomFactor() override;
    int setCameraFocusPositionInPreview(float positionX, float positionY) override;
    int setCameraTorchOn(bool isOn) override;
    int setCameraAutoFocusFaceModeEnabled(bool enabled) override;
    bool isCameraExposurePositionSupported() override;
    int setCameraExposurePosition(float positionXinView, float positionYinView) override;
    bool isCameraExposureSupported() override;
    int setCameraExposureFactor(float factor) override;
    bool isCameraAutoExposureFaceModeSupported() override;
    int setCameraAutoExposureFaceModeEnabled(bool enabled) override;
    int setCameraStabilizationMode(CAMERA_STABILIZATION_MODE mode) override;
#endif
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    int setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker) override;
    int setEnableSpeakerphone(bool speakerOn) override;
    bool isSpeakerphoneEnabled() override;
    int setRouteInCommunicationMode(int route) override;
#endif
#if defined(__APPLE__)
    bool isCameraCenterStageSupported() override;
    int enableCameraCenterStage(bool enabled) override;
#endif
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    IScreenCaptureSourceList* getScreenCaptureSources(const SIZE& thumbSize, const SIZE& iconSize, const bool includeScreen) override;
    int startScreenCaptureByDisplayId(int64_t displayId, const Rectangle& regionRect, const ScreenCaptureParameters& captureParams) override;
#if defined(_WIN32)
    int startScreenCaptureByScreenRect(const Rectangle& screenRect, const Rectangle& regionRect, const ScreenCaptureParameters& captureParams) override;
#endif
    int startScreenCaptureByWindowId(int64_t windowId, const Rectangle& regionRect, const ScreenCaptureParameters& captureParams) override;
    int setScreenCaptureContentHint(VIDEO_CONTENT_HINT contentHint) override;
    int updateScreenCaptureRegion(const Rectangle& regionRect) override;
    int updateScreenCaptureParameters(const ScreenCaptureParameters& captureParams) override;
#endif
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    int getAudioDeviceInfo(DeviceInfo& deviceInfo) override;
    int startScreenCapture(const ScreenCaptureParameters2& captureParams) override;
    int updateScreenCapture(const ScreenCaptureParameters2& captureParams) override;
    int queryScreenCaptureCapability() override;
    int queryCameraFocalLengthCapability(agora::rtc::FocalLengthInfo* focalLengthInfos, int& size) override;
    int setExternalMediaProjection(void* mediaProjection) override;
#endif
    int setScreenCaptureScenario(SCREEN_SCENARIO_TYPE screenScenario) override;
    int stopScreenCapture() override;
    int getCallId(agora::util::AString& callId) override;
    int rate(const char* callId, int rating, const char* description) override;
    int complain(const char* callId, const char* description) override;
    int startRtmpStreamWithoutTranscoding(const char* url) override;
    int startRtmpStreamWithTranscoding(const char* url, const LiveTranscoding& transcoding) override;
    int updateRtmpTranscoding(const LiveTranscoding& transcoding) override;
    int startLocalVideoTranscoder(const LocalTranscoderConfiguration& config) override;
    int updateLocalTranscoderConfiguration(const LocalTranscoderConfiguration& config) override;
    int stopRtmpStream(const char* url) override;
    int stopLocalVideoTranscoder() override;
    int startLocalAudioMixer(const LocalAudioMixerConfiguration& config) override;
    int updateLocalAudioMixerConfiguration(const LocalAudioMixerConfiguration& config) override;
    int stopLocalAudioMixer() override;
    int startCameraCapture(VIDEO_SOURCE_TYPE sourceType, const CameraCapturerConfiguration& config) override;
    int stopCameraCapture(VIDEO_SOURCE_TYPE sourceType) override;
    int setCameraDeviceOrientation(VIDEO_SOURCE_TYPE type, VIDEO_ORIENTATION orientation) override;
    int setScreenCaptureOrientation(VIDEO_SOURCE_TYPE type, VIDEO_ORIENTATION orientation) override;
    int startScreenCapture(VIDEO_SOURCE_TYPE sourceType, const ScreenCaptureConfiguration& config) override;
    int stopScreenCapture(VIDEO_SOURCE_TYPE sourceType) override;
    CONNECTION_STATE_TYPE getConnectionState() override;
    bool registerEventHandler(IRtcEngineEventHandler* eventHandler) override;
    bool unregisterEventHandler(IRtcEngineEventHandler* eventHandler) override;
    int setRemoteUserPriority(uid_t uid, PRIORITY_TYPE userPriority) override;
    int registerPacketObserver(IPacketObserver* observer) override;
    int enableEncryption(bool enabled, const EncryptionConfig& config) override;
    int createDataStream(int* streamId, bool reliable, bool ordered) override;
    int createDataStream(int* streamId, const DataStreamConfig& config) override;
    int sendStreamMessage(int streamId, const char* data, size_t length) override;
    int sendRdtMessage(uid_t uid, RdtStreamType type, const char *data, size_t length) override;
    int sendMediaControlMessage(uid_t uid, const char* data, size_t length) override;
    int addVideoWatermark(const RtcImage& watermark) override;
    int addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) override;
    int addVideoWatermark(const WatermarkConfig& configs) override;
    int removeVideoWatermark(const char* id) override;
    int clearVideoWatermarks() override;
    int pauseAudio() override;
    int resumeAudio() override;
    int enableWebSdkInteroperability(bool enabled) override;
    int sendCustomReportMessage(const char* id, const char* category, const char* event, const char* label, int value) override;
    int registerMediaMetadataObserver(IMetadataObserver *observer, IMetadataObserver::METADATA_TYPE type) override;
    int unregisterMediaMetadataObserver(IMetadataObserver* observer, IMetadataObserver::METADATA_TYPE type) override;
    int startAudioFrameDump(const char* channel_id, uid_t uid, const char* location, const char* uuid, const char* passwd, long duration_ms, bool auto_upload) override;
    int stopAudioFrameDump(const char* channel_id, uid_t uid, const char* location) override;
    int setAINSMode(bool enabled,  AUDIO_AINS_MODE mode) override;
    int registerLocalUserAccount(const char* appId, const char* userAccount) override;
    int joinChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount) override;
    int joinChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount, const ChannelMediaOptions& options) override;
    int joinChannelWithUserAccountEx(const char* token, const char* channelId, const char* userAccount, const ChannelMediaOptions& options, IRtcEngineEventHandler* eventHandler) override;
    int getUserInfoByUserAccount(const char* userAccount, rtc::UserInfo* userInfo) override;
    int getUserInfoByUid(uid_t uid, rtc::UserInfo* userInfo) override;
    int startOrUpdateChannelMediaRelay(const ChannelMediaRelayConfiguration &configuration) override;
    int stopChannelMediaRelay() override;
    int pauseAllChannelMediaRelay() override;
    int resumeAllChannelMediaRelay() override;
    int setDirectCdnStreamingAudioConfiguration(AUDIO_PROFILE_TYPE profile) override;
    int setDirectCdnStreamingVideoConfiguration(const VideoEncoderConfiguration& config) override;
    int startDirectCdnStreaming(IDirectCdnStreamingEventHandler* eventHandler, const char* publishUrl, const DirectCdnStreamingMediaOptions& options) override;
    int stopDirectCdnStreaming() override;
    int updateDirectCdnStreamingMediaOptions(const DirectCdnStreamingMediaOptions& options) override;
    int startRhythmPlayer(const char* sound1, const char* sound2, const AgoraRhythmPlayerConfig& config) override;
    int stopRhythmPlayer() override;
    int configRhythmPlayer(const AgoraRhythmPlayerConfig& config) override;
    int takeSnapshot(uid_t uid, const char* filePath) override;
    int takeSnapshot(uid_t uid, const media::SnapshotConfig& config) override;
    int enableContentInspect(bool enabled, const media::ContentInspectConfig &config) override;
    int adjustCustomAudioPublishVolume(track_id_t trackId, int volume) override;
    int adjustCustomAudioPlayoutVolume(track_id_t trackId, int volume) override;
    int setCloudProxy(CLOUD_PROXY_TYPE proxyType) override;
    int setLocalAccessPoint(const LocalAccessPointConfiguration& config) override;
    int setAdvancedAudioOptions(AdvancedAudioOptions& options, int sourceType = 0) override;
    int setAVSyncSource(const char* channelId, uid_t uid) override;
    int enableVideoImageSource(bool enable, const ImageTrackOptions& options) override;
    int64_t getCurrentMonotonicTimeInMs() override;
    int getNetworkType() override;
    int setParameters(const char* parameters) override;
    int startMediaRenderingTracing() override;
    int enableInstantMediaRendering() override;
    uint64_t getNtpWallTimeInMs() override;
    bool isFeatureAvailableOnDevice(FeatureType type) override;
    int sendAudioMetadata(const char* metadata, size_t length) override;
    int queryHDRCapability(VIDEO_MODULE_TYPE videoModule, HDR_CAPABILITY& capability) override;
    int joinChannelEx(const char* token, const RtcConnection& connection, const ChannelMediaOptions& options, IRtcEngineEventHandler* eventHandler) override;
    int leaveChannelEx(const RtcConnection& connection) override;
    int leaveChannelEx(const RtcConnection& connection, const LeaveChannelOptions& options) override;
    int leaveChannelWithUserAccountEx(const char* channelId, const char* userAccount) override;
    int leaveChannelWithUserAccountEx(const char* channelId, const char* userAccount, const LeaveChannelOptions& options) override;
    int updateChannelMediaOptionsEx(const ChannelMediaOptions& options, const RtcConnection& connection) override;
    int setVideoEncoderConfigurationEx(const VideoEncoderConfiguration& config, const RtcConnection& connection) override;
    int setupRemoteVideoEx(const VideoCanvas& canvas, const RtcConnection& connection) override;
    int muteRemoteAudioStreamEx(uid_t uid, bool mute, const RtcConnection& connection) override;
    int muteRemoteVideoStreamEx(uid_t uid, bool mute, const RtcConnection& connection) override;
    int setRemoteVideoStreamTypeEx(uid_t uid, VIDEO_STREAM_TYPE streamType, const RtcConnection& connection) override;
    int muteLocalAudioStreamEx(bool mute, const RtcConnection& connection) override;
    int muteLocalVideoStreamEx(bool mute, const RtcConnection& connection) override;
    int muteAllRemoteAudioStreamsEx(bool mute, const RtcConnection& connection) override;
    int muteAllRemoteVideoStreamsEx(bool mute, const RtcConnection& connection) override;
    int setSubscribeAudioBlocklistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) override;
    int setSubscribeAudioAllowlistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) override;
    int setSubscribeVideoBlocklistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) override;
    int setSubscribeVideoAllowlistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) override;
    int setRemoteVideoSubscriptionOptionsEx(uid_t uid, const VideoSubscriptionOptions& options, const RtcConnection& connection) override;
    int setRemoteVoicePositionEx(uid_t uid, double pan, double gain, const RtcConnection& connection) override;
    int setRemoteUserSpatialAudioParamsEx(uid_t uid, const agora::SpatialAudioParams& params, const RtcConnection& connection) override;
    int setRemoteRenderModeEx(uid_t uid, media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode, const RtcConnection& connection) override;
    int enableLoopbackRecordingEx(const RtcConnection& connection, bool enabled, const char* deviceName = NULL) override;
    int adjustRecordingSignalVolumeEx(int volume, const RtcConnection& connection) override;
    int muteRecordingSignalEx(bool mute, const RtcConnection& connection) override;
    int adjustUserPlaybackSignalVolumeEx(uid_t uid, int volume, const RtcConnection& connection) override;
    CONNECTION_STATE_TYPE getConnectionStateEx(const RtcConnection& connection) override;
    int enableEncryptionEx(const RtcConnection& connection, bool enabled, const EncryptionConfig& config) override;
    int createDataStreamEx(int* streamId, bool reliable, bool ordered, const RtcConnection& connection) override;
    int createDataStreamEx(int* streamId, const DataStreamConfig& config, const RtcConnection& connection) override;
    int sendStreamMessageEx(int streamId, const char* data, size_t length, const RtcConnection& connection) override;
    int sendRdtMessageEx(uid_t uid, RdtStreamType type, const char *data, size_t length, const RtcConnection& connection) override;
    int sendMediaControlMessageEx(uid_t uid, const char *data, size_t length, const RtcConnection& connection) override;
    int addVideoWatermarkEx(const char* watermarkUrl, const WatermarkOptions& options, const RtcConnection& connection) override;
    int addVideoWatermarkEx(const WatermarkConfig& config, const RtcConnection& connection) override;
    int removeVideoWatermarkEx(const char* id, const RtcConnection& connection) override;
    int clearVideoWatermarkEx(const RtcConnection& connection) override;
    int sendCustomReportMessageEx(const char* id, const char* category, const char* event, const char* label, int value, const RtcConnection& connection) override;
    int enableAudioVolumeIndicationEx(int interval, int smooth, bool reportVad, const RtcConnection& connection) override;
    int startRtmpStreamWithoutTranscodingEx(const char* url, const RtcConnection& connection) override;
    int startRtmpStreamWithTranscodingEx(const char* url, const LiveTranscoding& transcoding, const RtcConnection& connection) override;
    int updateRtmpTranscodingEx(const LiveTranscoding& transcoding, const RtcConnection& connection) override;
    int stopRtmpStreamEx(const char* url, const RtcConnection& connection) override;
    int startOrUpdateChannelMediaRelayEx(const ChannelMediaRelayConfiguration& configuration, const RtcConnection& connection) override;
    int stopChannelMediaRelayEx(const RtcConnection& connection) override;
    int pauseAllChannelMediaRelayEx(const RtcConnection& connection) override;
    int resumeAllChannelMediaRelayEx(const RtcConnection& connection) override;
    int getUserInfoByUserAccountEx(const char* userAccount, rtc::UserInfo* userInfo, const RtcConnection& connection) override;
    int getUserInfoByUidEx(uid_t uid, rtc::UserInfo* userInfo, const RtcConnection& connection) override;
    int enableDualStreamModeEx(bool enabled, const SimulcastStreamConfig& streamConfig, const RtcConnection& connection) override;
    int setDualStreamModeEx(SIMULCAST_STREAM_MODE mode, const SimulcastStreamConfig& streamConfig, const RtcConnection& connection) override;
    int setSimulcastConfigEx(const SimulcastConfig& simulcastConfig, const RtcConnection& connection) override;
    int setHighPriorityUserListEx(uid_t* uidList, int uidNum, STREAM_FALLBACK_OPTIONS option, const RtcConnection& connection) override;
    int takeSnapshotEx(const RtcConnection& connection, uid_t uid, const char* filePath) override;
    int takeSnapshotEx(const RtcConnection& connection, uid_t uid, const media::SnapshotConfig& config) override;
    int enableContentInspectEx(bool enabled, const media::ContentInspectConfig &config, const RtcConnection& connection) override;
    int startMediaRenderingTracingEx(const RtcConnection& connection) override;
    int setParametersEx(const RtcConnection& connection, const char* parameters) override;
    int getCallIdEx(agora::util::AString& callId, const RtcConnection& connection) override;
    int sendAudioMetadataEx(const RtcConnection& connection, const char* metadata, size_t length) override;
    int preloadEffectEx(const RtcConnection& connection, int soundId, const char* filePath, int startPos = 0) override;
    int playEffectEx(const RtcConnection& connection, int soundId, const char* filePath, int loopCount, double pitch, double pan, int gain, bool publish = false, int startPos = 0) override;

private:
    MockIRtcEngineEx() = default;
    ~MockIRtcEngineEx() override = default;
    MockIRtcEngineEx(const MockIRtcEngineEx&) = delete;
    MockIRtcEngineEx& operator=(const MockIRtcEngineEx&) = delete;

    std::string logFilePath_;
};

}  // namespace rtc
}  // namespace agora
