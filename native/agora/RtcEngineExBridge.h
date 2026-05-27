#pragma once

#include <memory>
#include <string>
#include <vector>

#include "IAgoraRtcEngine.h"
#include "IAgoraRtcEngineEx.h"

namespace se {
class Object;
}
class AudioDeviceManagerBridge;
class H265TranscoderBridge;
class LocalSpatialAudioEngineBridge;
class MediaPlayerBridge;
class MediaPlayerCacheManagerBridge;
class MediaRecorderBridge;
class MusicContentCenterBridge;
class ScreenCaptureSourceListBridge;
class VideoDeviceManagerBridge;
class VideoEffectObjectBridge;
class RtcEngineEventHandlerExBridge;

struct AgoraRtcNativeContext {
    std::string appId;
    int channelProfile{static_cast<int>(agora::CHANNEL_PROFILE_COMMUNICATION)};
    int audioScenario{static_cast<int>(agora::rtc::AUDIO_SCENARIO_DEFAULT)};
    unsigned int areaCode{agora::rtc::AREA_CODE_GLOB};
};

struct GetVersionResult {
    std::string version;
    int build;
};

struct QueryCodecCapabilityResult {
    int errorCode;
    std::vector<agora::rtc::CodecCapInfo> codecInfo;
};

struct GetFaceShapeBeautyOptionsResult {
    int errorCode;
    agora::rtc::FaceShapeBeautyOptions options;
};

struct GetFaceShapeAreaOptionsResult {
    int errorCode;
    agora::rtc::FaceShapeAreaOptions options;
};

struct GetExtensionPropertyResult {
    int errorCode;
    std::string value;
};

struct GetAudioDeviceInfoResult {
    int errorCode;
    agora::rtc::DeviceInfo deviceInfo;
};

struct GetCallIdResult {
    int errorCode;
    std::string callId;
};

struct GetUserInfoResult {
    int errorCode;
    agora::rtc::UserInfo userInfo;
};

struct QueryCameraFocalLengthCapabilityResult {
    int errorCode;
    std::vector<agora::rtc::FocalLengthInfo> focalLengthInfos;
};

struct QueryHDRCapabilityResult {
    int errorCode;
    agora::rtc::HDR_CAPABILITY capability;
};

struct CreateDataStreamResult {
    int errorCode;
    int streamId;
};

struct UploadLogFileResult {
    int errorCode;
    std::string requestId;
};

class RtcEngineExBridge {
public:
    RtcEngineExBridge();
    ~RtcEngineExBridge();
    void release(bool sync);
    //todo jsb manual
    int initialize(const agora::rtc::RtcEngineContext &context, se::Object *eventHandler);

    //todo jsb manual
    std::shared_ptr<AudioDeviceManagerBridge> getAudioDeviceManager();
    //todo jsb manual
    std::shared_ptr<VideoDeviceManagerBridge> getVideoDeviceManager();
    //todo jsb manual
    std::shared_ptr<MusicContentCenterBridge> getMusicContentCenter();
    //todo jsb manual
    std::shared_ptr<MediaPlayerCacheManagerBridge> getMediaPlayerCacheManager();
    //todo jsb manual
    std::shared_ptr<LocalSpatialAudioEngineBridge> getLocalSpatialAudioEngine();
    //todo jsb manual
    std::shared_ptr<H265TranscoderBridge> getH265Transcoder();

    //not support
    // int queryInterface(int iid);
    GetVersionResult getVersion();
    const char *getErrorDescription(int code);
    QueryCodecCapabilityResult queryCodecCapability(int &size);
    int queryDeviceScore();
    int preloadChannel(const std::string &token, const std::string &channelId, agora::rtc::uid_t uid);
    int preloadChannelWithUserAccount(const std::string &token, const std::string &channelId,
                                      const std::string &userAccount);
    int updatePreloadChannelToken(const std::string &token);
    int joinChannel(const std::string &token, const std::string &channelId, const std::string &info,
                    agora::rtc::uid_t uid);
    int joinChannel(const std::string &token, const std::string &channelId, agora::rtc::uid_t uid,
                    const agora::rtc::ChannelMediaOptions &options);
    int updateChannelMediaOptions(const agora::rtc::ChannelMediaOptions &options);
    int leaveChannel();
    int leaveChannel(const agora::rtc::LeaveChannelOptions &options);
    int renewToken(const std::string &token);
    int setChannelProfile(agora::CHANNEL_PROFILE_TYPE profile);
    int setClientRole(agora::rtc::CLIENT_ROLE_TYPE role);
    int setClientRole(agora::rtc::CLIENT_ROLE_TYPE role, const agora::rtc::ClientRoleOptions &options);
    int startEchoTest(const agora::rtc::EchoTestConfiguration &config);
    int stopEchoTest();
    int enableMultiCamera(bool enabled, const agora::rtc::CameraCapturerConfiguration &config);
    int enableVideo();
    int disableVideo();
    int startPreview();
    int startPreview(agora::rtc::VIDEO_SOURCE_TYPE sourceType);
    int stopPreview();
    int stopPreview(agora::rtc::VIDEO_SOURCE_TYPE sourceType);
    int startLastmileProbeTest(const agora::rtc::LastmileProbeConfig &config);
    int stopLastmileProbeTest();
    int setVideoEncoderConfiguration(const agora::rtc::VideoEncoderConfiguration &config);
    int setBeautyEffectOptions(bool enabled, const agora::rtc::BeautyOptions &options,
                               agora::media::MEDIA_SOURCE_TYPE type);
    int setFaceShapeBeautyOptions(bool enabled, const agora::rtc::FaceShapeBeautyOptions &options,
                                  agora::media::MEDIA_SOURCE_TYPE type);
    int setFaceShapeAreaOptions(const agora::rtc::FaceShapeAreaOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    GetFaceShapeBeautyOptionsResult getFaceShapeBeautyOptions(agora::media::MEDIA_SOURCE_TYPE type);
    GetFaceShapeAreaOptionsResult getFaceShapeAreaOptions(agora::rtc::FaceShapeAreaOptions::FACE_SHAPE_AREA shapeArea,
                                                          agora::media::MEDIA_SOURCE_TYPE type);
    int setFilterEffectOptions(bool enabled, const agora::rtc::FilterEffectOptions &options,
                               agora::media::MEDIA_SOURCE_TYPE type);
    //todo jsb manual
    std::shared_ptr<VideoEffectObjectBridge> createVideoEffectObject(const std::string &bundlePath,
                                                                     agora::media::MEDIA_SOURCE_TYPE type);
    //todo jsb manual
    int destroyVideoEffectObject(std::shared_ptr<VideoEffectObjectBridge> videoEffectObject);
    int setLowlightEnhanceOptions(bool enabled, const agora::rtc::LowlightEnhanceOptions &options,
                                  agora::media::MEDIA_SOURCE_TYPE type);
    int setVideoDenoiserOptions(bool enabled, const agora::rtc::VideoDenoiserOptions &options,
                                agora::media::MEDIA_SOURCE_TYPE type);
    int setColorEnhanceOptions(bool enabled, const agora::rtc::ColorEnhanceOptions &options,
                               agora::media::MEDIA_SOURCE_TYPE type);
    int enableVirtualBackground(bool enabled, const agora::rtc::VirtualBackgroundSource &backgroundSource,
                                const agora::rtc::SegmentationProperty &segproperty,
                                agora::media::MEDIA_SOURCE_TYPE type);
    int setupRemoteVideo(const agora::rtc::VideoCanvas &canvas);
    int setupLocalVideo(const agora::rtc::VideoCanvas &canvas);
    int setVideoScenario(agora::rtc::VIDEO_APPLICATION_SCENARIO_TYPE scenarioType);
    int setVideoQoEPreference(agora::rtc::VIDEO_QOE_PREFERENCE_TYPE qoePreference);
    int enableAudio();
    int disableAudio();
    int setAudioProfile(agora::rtc::AUDIO_PROFILE_TYPE profile, agora::rtc::AUDIO_SCENARIO_TYPE scenario);
    int setAudioProfile(agora::rtc::AUDIO_PROFILE_TYPE profile);
    int setAudioScenario(agora::rtc::AUDIO_SCENARIO_TYPE scenario);
    int enableLocalAudio(bool enabled);
    int muteLocalAudioStream(bool mute);
    int muteAllRemoteAudioStreams(bool mute);
    int muteRemoteAudioStream(agora::rtc::uid_t uid, bool mute);
    int muteLocalVideoStream(bool mute);
    int enableLocalVideo(bool enabled);
    int muteAllRemoteVideoStreams(bool mute);
    int setRemoteDefaultVideoStreamType(agora::rtc::VIDEO_STREAM_TYPE streamType);
    int muteRemoteVideoStream(agora::rtc::uid_t uid, bool mute);
    int setRemoteVideoStreamType(agora::rtc::uid_t uid, agora::rtc::VIDEO_STREAM_TYPE streamType);
    int setRemoteVideoSubscriptionOptions(agora::rtc::uid_t uid, const agora::rtc::VideoSubscriptionOptions &options);
    int setSubscribeAudioBlocklist(const std::vector<agora::rtc::uid_t> &uidList);
    int setSubscribeAudioAllowlist(const std::vector<agora::rtc::uid_t> &uidList);
    int setSubscribeVideoBlocklist(const std::vector<agora::rtc::uid_t> &uidList);
    int setSubscribeVideoAllowlist(const std::vector<agora::rtc::uid_t> &uidList);
    int enableAudioVolumeIndication(int interval, int smooth, bool reportVad);
    int startAudioRecording(const std::string &filePath, agora::rtc::AUDIO_RECORDING_QUALITY_TYPE quality);
    int startAudioRecording(const std::string &filePath, int sampleRate,
                            agora::rtc::AUDIO_RECORDING_QUALITY_TYPE quality);
    int startAudioRecording(const agora::rtc::AudioRecordingConfiguration &config);

    //not support
    // int registerAudioEncodedFrameObserver(const agora::rtc::AudioEncodedFrameObserverConfig &config,
    //                                       agora::rtc::IAudioEncodedFrameObserver *observer);
    int stopAudioRecording();
    //todo jsb manual
    std::shared_ptr<MediaPlayerBridge> createMediaPlayer();
    //todo jsb manual
    int destroyMediaPlayer(std::shared_ptr<MediaPlayerBridge> mediaPlayer);
    //todo jsb manual
    std::shared_ptr<MediaRecorderBridge> createMediaRecorder(const agora::rtc::RecorderStreamInfo &info);
    //todo jsb manual
    int destroyMediaRecorder(std::shared_ptr<MediaRecorderBridge> mediaRecorder);
    int startAudioMixing(const std::string &filePath, bool loopback, int cycle);
    int startAudioMixing(const std::string &filePath, bool loopback, int cycle, int startPos);
    int stopAudioMixing();
    int pauseAudioMixing();
    int resumeAudioMixing();
    int selectAudioTrack(int index);
    int getAudioTrackCount();
    int adjustAudioMixingVolume(int volume);
    int adjustAudioMixingPublishVolume(int volume);
    int getAudioMixingPublishVolume();
    int adjustAudioMixingPlayoutVolume(int volume);
    int getAudioMixingPlayoutVolume();
    int getAudioMixingDuration();
    int getAudioMixingCurrentPosition();
    int setAudioMixingPosition(int pos);
    int setAudioMixingDualMonoMode(agora::media::AUDIO_MIXING_DUAL_MONO_MODE mode);
    int setAudioMixingPitch(int pitch);
    int setAudioMixingPlaybackSpeed(int speed);
    int getEffectsVolume();
    int setEffectsVolume(int volume);
    int preloadEffect(int soundId, const std::string &filePath, int startPos);
    int playEffect(int soundId, const std::string &filePath, int loopCount, double pitch, double pan, int gain,
                   bool publish, int startPos);
    int playAllEffects(int loopCount, double pitch, double pan, int gain, bool publish);
    int getVolumeOfEffect(int soundId);
    int setVolumeOfEffect(int soundId, int volume);
    int pauseEffect(int soundId);
    int pauseAllEffects();
    int resumeEffect(int soundId);
    int resumeAllEffects();
    int stopEffect(int soundId);
    int stopAllEffects();
    int unloadEffect(int soundId);
    int unloadAllEffects();
    int getEffectDuration(const std::string &filePath);
    int setEffectPosition(int soundId, int pos);
    int getEffectCurrentPosition(int soundId);
    int enableSoundPositionIndication(bool enabled);
    int setRemoteVoicePosition(agora::rtc::uid_t uid, double pan, double gain);
    int enableSpatialAudio(bool enabled);
    int setRemoteUserSpatialAudioParams(agora::rtc::uid_t uid, const agora::SpatialAudioParams &params);
    int setVoiceBeautifierPreset(agora::rtc::VOICE_BEAUTIFIER_PRESET preset);
    int setAudioEffectPreset(agora::rtc::AUDIO_EFFECT_PRESET preset);
    int setVoiceConversionPreset(agora::rtc::VOICE_CONVERSION_PRESET preset);
    int setAudioEffectParameters(agora::rtc::AUDIO_EFFECT_PRESET preset, int param1, int param2);
    int setVoiceBeautifierParameters(agora::rtc::VOICE_BEAUTIFIER_PRESET preset, int param1, int param2);
    int setVoiceConversionParameters(agora::rtc::VOICE_CONVERSION_PRESET preset, int param1, int param2);
    int setLocalVoicePitch(double pitch);
    int setLocalVoiceFormant(double formantRatio);
    int setLocalVoiceEqualization(agora::rtc::AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency, int bandGain);
    int setLocalVoiceReverb(agora::rtc::AUDIO_REVERB_TYPE reverbKey, int value);
    int setHeadphoneEQPreset(agora::rtc::HEADPHONE_EQUALIZER_PRESET preset);
    int setHeadphoneEQParameters(int lowGain, int highGain);
    int enableVoiceAITuner(bool enabled, agora::rtc::VOICE_AI_TUNER_TYPE type);
    int setLogFile(const std::string &filePath);
    int setLogFilter(unsigned int filter);
    int setLogLevel(agora::commons::LOG_LEVEL level);
    int setLogFileSize(unsigned int fileSizeInKBytes);
    UploadLogFileResult uploadLogFile();
    int writeLog(agora::commons::LOG_LEVEL level, const std::string &fmt);
    int setLocalRenderMode(agora::media::base::RENDER_MODE_TYPE renderMode,
                           agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode);
    int setRemoteRenderMode(agora::rtc::uid_t uid, agora::media::base::RENDER_MODE_TYPE renderMode,
                            agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode);
    int setLocalRenderTargetFps(agora::rtc::VIDEO_SOURCE_TYPE sourceType, int targetFps);
    int setRemoteRenderTargetFps(int targetFps);
    int setLocalRenderMode(agora::media::base::RENDER_MODE_TYPE renderMode);
    int setLocalVideoMirrorMode(agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode);
    int enableDualStreamMode(bool enabled);
    int enableDualStreamMode(bool enabled, const agora::rtc::SimulcastStreamConfig &streamConfig);
    int setDualStreamMode(agora::rtc::SIMULCAST_STREAM_MODE mode);
    int setSimulcastConfig(const agora::rtc::SimulcastConfig &config);
    int setDualStreamMode(agora::rtc::SIMULCAST_STREAM_MODE mode,
                          const agora::rtc::SimulcastStreamConfig &streamConfig);
    int enableCustomAudioLocalPlayback(agora::rtc::track_id_t trackId, bool enabled);
    int setRecordingAudioFrameParameters(int sampleRate, int channel, agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                         int samplesPerCall);
    int setPlaybackAudioFrameParameters(int sampleRate, int channel, agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                        int samplesPerCall);
    int setMixedAudioFrameParameters(int sampleRate, int channel, int samplesPerCall);
    int setEarMonitoringAudioFrameParameters(int sampleRate, int channel, agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                             int samplesPerCall);
    int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel);
    int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel, int samplesPerCall);
    int enableAudioSpectrumMonitor(int intervalInMS);
    int disableAudioSpectrumMonitor();

    //not support
    // int registerAudioSpectrumObserver();
    // int unregisterAudioSpectrumObserver();
    int adjustRecordingSignalVolume(int volume);
    int muteRecordingSignal(bool mute);
    int adjustPlaybackSignalVolume(int volume);
    int adjustUserPlaybackSignalVolume(agora::rtc::uid_t uid, int volume);
    int setRemoteSubscribeFallbackOption(agora::rtc::STREAM_FALLBACK_OPTIONS option);
    int setHighPriorityUserList(const std::vector<agora::rtc::uid_t> &uidList,
                                agora::rtc::STREAM_FALLBACK_OPTIONS option);
    int enableExtension(const std::string &provider, const std::string &extension,
                        const agora::rtc::ExtensionInfo &extensionInfo, bool enable);
    int setExtensionProperty(const std::string &provider, const std::string &extension,
                             const agora::rtc::ExtensionInfo &extensionInfo, const std::string &key,
                             const std::string &value);
    GetExtensionPropertyResult getExtensionProperty(const std::string &provider, const std::string &extension,
                                                    const agora::rtc::ExtensionInfo &extensionInfo,
                                                    const std::string &key);
    int enableLoopbackRecording(bool enabled, const std::string &deviceName);
    int adjustLoopbackSignalVolume(int volume);
    int getLoopbackRecordingVolume();
    int enableInEarMonitoring(bool enabled, int includeAudioFilters);
    int setInEarMonitoringVolume(int volume);
    int loadExtensionProvider(const std::string &path, bool unload_after_use = false);
    int setExtensionProviderProperty(const std::string &provider, const std::string &key, const std::string &value);
    int registerExtension(const std::string &provider, const std::string &extension,
                          agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE);
    int enableExtension(const std::string &provider, const std::string &extension, bool enable,
                        agora::media::MEDIA_SOURCE_TYPE type);
    int setCameraCapturerConfiguration(const agora::rtc::CameraCapturerConfiguration &config);
    //not support
    // int createCustomVideoTrack();
    // int createCustomEncodedVideoTrack();
    // int destroyCustomVideoTrack();
    // int destroyCustomEncodedVideoTrack();
    int switchCamera();
    bool isCameraZoomSupported();
    bool isCameraFaceDetectSupported();
    bool isCameraTorchSupported();
    bool isCameraFocusSupported();
    bool isCameraAutoFocusFaceModeSupported();
    int setCameraZoomFactor(float factor);
    int enableFaceDetection(bool enabled);
    float getCameraMaxZoomFactor();
    int setCameraFocusPositionInPreview(float positionX, float positionY);
    int setCameraTorchOn(bool isOn);
    int setCameraAutoFocusFaceModeEnabled(bool enabled);
    bool isCameraExposurePositionSupported();
    int setCameraExposurePosition(float positionXinView, float positionYinView);
    bool isCameraExposureSupported();
    int setCameraExposureFactor(float factor);
    bool isCameraAutoExposureFaceModeSupported();
    int setCameraAutoExposureFaceModeEnabled(bool enabled);
    int setCameraStabilizationMode(agora::rtc::CAMERA_STABILIZATION_MODE mode);
    int setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker);
    int setEnableSpeakerphone(bool speakerOn);
    bool isSpeakerphoneEnabled();
    int setRouteInCommunicationMode(int route);
    bool isCameraCenterStageSupported();
    int enableCameraCenterStage(bool enabled);
    //todo jsb manual
    std::shared_ptr<ScreenCaptureSourceListBridge> getScreenCaptureSources(const agora::rtc::SIZE &thumbSize,
                                                                           const agora::rtc::SIZE &iconSize,
                                                                           bool includeScreen);
    int setAudioSessionOperationRestriction(agora::AUDIO_SESSION_OPERATION_RESTRICTION restriction);
    int startScreenCaptureByDisplayId(int64_t displayId, const agora::rtc::Rectangle &regionRect,
                                      const agora::rtc::ScreenCaptureParameters &captureParams);
    int startScreenCaptureByScreenRect(const agora::rtc::Rectangle &screenRect, const agora::rtc::Rectangle &regionRect,
                                       const agora::rtc::ScreenCaptureParameters &captureParams);

    GetAudioDeviceInfoResult getAudioDeviceInfo();
    int startScreenCaptureByWindowId(int64_t windowId, const agora::rtc::Rectangle &regionRect,
                                     const agora::rtc::ScreenCaptureParameters &captureParams);
    int setScreenCaptureContentHint(agora::rtc::VIDEO_CONTENT_HINT contentHint);
    int updateScreenCaptureRegion(const agora::rtc::Rectangle &regionRect);
    int updateScreenCaptureParameters(const agora::rtc::ScreenCaptureParameters &captureParams);
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
    int startScreenCapture(const agora::rtc::ScreenCaptureParameters2 &captureParams);
    int updateScreenCapture(const agora::rtc::ScreenCaptureParameters2 &captureParams);
#endif
    int queryScreenCaptureCapability();

    QueryCameraFocalLengthCapabilityResult queryCameraFocalLengthCapability(int &size);
    int setExternalMediaProjection(void *mediaProjection);
    int setScreenCaptureScenario(agora::rtc::SCREEN_SCENARIO_TYPE screenScenario);
    int stopScreenCapture();

    GetCallIdResult getCallId();
    int rate(const std::string &callId, int rating, const std::string &description);
    int complain(const std::string &callId, const std::string &description);
    int startRtmpStreamWithoutTranscoding(const std::string &url);
    int startRtmpStreamWithTranscoding(const std::string &url, const agora::rtc::LiveTranscoding &transcoding);
    int updateRtmpTranscoding(const agora::rtc::LiveTranscoding &transcoding);
    int startLocalVideoTranscoder(const agora::rtc::LocalTranscoderConfiguration &config);
    int updateLocalTranscoderConfiguration(const agora::rtc::LocalTranscoderConfiguration &config);
    int stopRtmpStream(const std::string &url);
    int stopLocalVideoTranscoder();
    int startLocalAudioMixer(const agora::rtc::LocalAudioMixerConfiguration &config);
    int updateLocalAudioMixerConfiguration(const agora::rtc::LocalAudioMixerConfiguration &config);
    int stopLocalAudioMixer();
    int startCameraCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType,
                           const agora::rtc::CameraCapturerConfiguration &config);
    int stopCameraCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType);
    int setCameraDeviceOrientation(agora::rtc::VIDEO_SOURCE_TYPE type, agora::rtc::VIDEO_ORIENTATION orientation);
    int setScreenCaptureOrientation(agora::rtc::VIDEO_SOURCE_TYPE type, agora::rtc::VIDEO_ORIENTATION orientation);
    int startScreenCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType,
                           const agora::rtc::ScreenCaptureConfiguration &config);
    int stopScreenCapture(agora::rtc::VIDEO_SOURCE_TYPE sourceType);
    int getConnectionState();

    //not suport
    // int registerEventHandler();

    //not suport
    // int unregisterEventHandler();
    int setRemoteUserPriority(agora::rtc::uid_t uid, agora::rtc::PRIORITY_TYPE userPriority);

    //not suport
    // int registerPacketObserver();
    int enableEncryption(bool enabled, const agora::rtc::EncryptionConfig &config);

    CreateDataStreamResult createDataStream(bool reliable, bool ordered);
    CreateDataStreamResult createDataStream(const agora::rtc::DataStreamConfig &config);
    int sendStreamMessage(int streamId, const void *data, size_t length);
    int sendRdtMessage(agora::rtc::uid_t uid, agora::rtc::RdtStreamType type, const void *data, size_t length);
    int sendMediaControlMessage(agora::rtc::uid_t uid, const void *data, size_t length);
    int addVideoWatermark(const agora::rtc::RtcImage &watermark);
    int addVideoWatermark(const std::string &watermarkUrl, const agora::rtc::WatermarkOptions &options);
    int addVideoWatermark(const agora::rtc::WatermarkConfig &configs);
    int removeVideoWatermark(const std::string &id);
    int clearVideoWatermarks();
    int pauseAudio();
    int resumeAudio();
    int enableWebSdkInteroperability(bool enabled);
    int sendCustomReportMessage(const std::string &id, const std::string &category, const std::string &event,
                                const std::string &label, int value);

    //not support
    // int registerMediaMetadataObserver();
    // int unregisterMediaMetadataObserver();

    int startAudioFrameDump(const std::string &channelId, agora::rtc::uid_t uid);
    int stopAudioFrameDump(const std::string &channelId, agora::rtc::uid_t uid);
    int setAINSMode(bool enabled, agora::rtc::AUDIO_AINS_MODE mode);
    int registerLocalUserAccount(const std::string &appId, const std::string &userAccount);
    int joinChannelWithUserAccount(const std::string &token, const std::string &channelId,
                                   const std::string &userAccount);
    int joinChannelWithUserAccount(const std::string &token, const std::string &channelId,
                                   const std::string &userAccount, const agora::rtc::ChannelMediaOptions &options);

    GetUserInfoResult getUserInfoByUserAccount(const std::string &userAccount);

    GetUserInfoResult getUserInfoByUid(agora::rtc::uid_t uid);
    int startOrUpdateChannelMediaRelay(const agora::rtc::ChannelMediaRelayConfiguration &configuration);
    int stopChannelMediaRelay();
    int pauseAllChannelMediaRelay();
    int resumeAllChannelMediaRelay();
    int setDirectCdnStreamingAudioConfiguration(agora::rtc::AUDIO_PROFILE_TYPE profile);
    int setDirectCdnStreamingVideoConfiguration(const agora::rtc::VideoEncoderConfiguration &config);

    int startDirectCdnStreaming(const std::string &publishUrl,
                                const agora::rtc::DirectCdnStreamingMediaOptions &options);
    int stopDirectCdnStreaming();
    int updateDirectCdnStreamingMediaOptions(const agora::rtc::DirectCdnStreamingMediaOptions &options);
    int startRhythmPlayer(const std::string &sound1, const std::string &sound2,
                          const agora::rtc::AgoraRhythmPlayerConfig &config);
    int stopRhythmPlayer();
    int configRhythmPlayer(const agora::rtc::AgoraRhythmPlayerConfig &config);
    int takeSnapshot(agora::rtc::uid_t uid, const std::string &filePath);
    int takeSnapshot(agora::rtc::uid_t uid, const agora::media::SnapshotConfig &config);
    int enableContentInspect(bool enabled, const agora::media::ContentInspectConfig &config);
    int adjustCustomAudioPublishVolume(agora::rtc::track_id_t trackId, int volume);
    int adjustCustomAudioPlayoutVolume(agora::rtc::track_id_t trackId, int volume);
    int setCloudProxy(agora::rtc::CLOUD_PROXY_TYPE proxyType);
    int setLocalAccessPoint(const agora::rtc::LocalAccessPointConfiguration &config);
    int setAdvancedAudioOptions(agora::rtc::AdvancedAudioOptions &options, int sourceType);
    int setAVSyncSource(const std::string &channelId, agora::rtc::uid_t uid);
    int enableVideoImageSource(bool enable, const agora::rtc::ImageTrackOptions &options);
    int64_t getCurrentMonotonicTimeInMs();
    int getNetworkType();
    int setParameters(const std::string &parameters);
    int startMediaRenderingTracing();
    int enableInstantMediaRendering();
    uint64_t getNtpWallTimeInMs();
    bool isFeatureAvailableOnDevice(agora::rtc::FeatureType type);
    int sendAudioMetadata(const void *metadata, size_t length);
    QueryHDRCapabilityResult queryHDRCapability(agora::rtc::VIDEO_MODULE_TYPE videoModule);
    int joinChannelEx(const std::string &token, const agora::rtc::RtcConnection &connection,
                      const agora::rtc::ChannelMediaOptions &options);
    int leaveChannelEx(const agora::rtc::RtcConnection &connection);
    int leaveChannelEx(const agora::rtc::RtcConnection &connection, const agora::rtc::LeaveChannelOptions &options);
    int leaveChannelWithUserAccountEx(const std::string &channelId, const std::string &userAccount);
    int leaveChannelWithUserAccountEx(const std::string &channelId, const std::string &userAccount,
                                      const agora::rtc::LeaveChannelOptions &options);
    int updateChannelMediaOptionsEx(const agora::rtc::ChannelMediaOptions &options,
                                    const agora::rtc::RtcConnection &connection);
    int setVideoEncoderConfigurationEx(const agora::rtc::VideoEncoderConfiguration &config,
                                       const agora::rtc::RtcConnection &connection);
    int setupRemoteVideoEx(const agora::rtc::VideoCanvas &canvas, const agora::rtc::RtcConnection &connection);
    int muteRemoteAudioStreamEx(agora::rtc::uid_t uid, bool mute, const agora::rtc::RtcConnection &connection);
    int muteRemoteVideoStreamEx(agora::rtc::uid_t uid, bool mute, const agora::rtc::RtcConnection &connection);
    int setRemoteVideoStreamTypeEx(agora::rtc::uid_t uid, agora::rtc::VIDEO_STREAM_TYPE streamType,
                                   const agora::rtc::RtcConnection &connection);
    int muteLocalAudioStreamEx(bool mute, const agora::rtc::RtcConnection &connection);
    int muteLocalVideoStreamEx(bool mute, const agora::rtc::RtcConnection &connection);
    int muteAllRemoteAudioStreamsEx(bool mute, const agora::rtc::RtcConnection &connection);
    int muteAllRemoteVideoStreamsEx(bool mute, const agora::rtc::RtcConnection &connection);
    int setSubscribeAudioBlocklistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                     const agora::rtc::RtcConnection &connection);
    int setSubscribeAudioAllowlistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                     const agora::rtc::RtcConnection &connection);
    int setSubscribeVideoBlocklistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                     const agora::rtc::RtcConnection &connection);
    int setSubscribeVideoAllowlistEx(const std::vector<agora::rtc::uid_t> &uidList,
                                     const agora::rtc::RtcConnection &connection);
    int setRemoteVideoSubscriptionOptionsEx(agora::rtc::uid_t uid, const agora::rtc::VideoSubscriptionOptions &options,
                                            const agora::rtc::RtcConnection &connection);
    int setRemoteVoicePositionEx(agora::rtc::uid_t uid, double pan, double gain,
                                 const agora::rtc::RtcConnection &connection);
    int setRemoteUserSpatialAudioParamsEx(agora::rtc::uid_t uid, const agora::SpatialAudioParams &params,
                                          const agora::rtc::RtcConnection &connection);
    int setRemoteRenderModeEx(agora::rtc::uid_t uid, agora::media::base::RENDER_MODE_TYPE renderMode,
                              agora::rtc::VIDEO_MIRROR_MODE_TYPE mirrorMode,
                              const agora::rtc::RtcConnection &connection);
    int enableLoopbackRecordingEx(const agora::rtc::RtcConnection &connection, bool enabled,
                                  const std::string &deviceName);
    int adjustRecordingSignalVolumeEx(int volume, const agora::rtc::RtcConnection &connection);
    int muteRecordingSignalEx(bool mute, const agora::rtc::RtcConnection &connection);
    int adjustUserPlaybackSignalVolumeEx(agora::rtc::uid_t uid, int volume,
                                         const agora::rtc::RtcConnection &connection);
    int getConnectionStateEx(const agora::rtc::RtcConnection &connection);
    int enableEncryptionEx(const agora::rtc::RtcConnection &connection, bool enabled,
                           const agora::rtc::EncryptionConfig &config);
    CreateDataStreamResult createDataStreamEx(bool reliable, bool ordered, const agora::rtc::RtcConnection &connection);
    CreateDataStreamResult createDataStreamEx(const agora::rtc::DataStreamConfig &config,
                                              const agora::rtc::RtcConnection &connection);
    int sendStreamMessageEx(int streamId, const void *data, size_t length, const agora::rtc::RtcConnection &connection);
    int sendRdtMessageEx(agora::rtc::uid_t uid, agora::rtc::RdtStreamType type, const void *data, size_t length,
                         const agora::rtc::RtcConnection &connection);
    int sendMediaControlMessageEx(agora::rtc::uid_t uid, const void *data, size_t length,
                                  const agora::rtc::RtcConnection &connection);
    int addVideoWatermarkEx(const std::string &watermarkUrl, const agora::rtc::WatermarkOptions &options,
                            const agora::rtc::RtcConnection &connection);
    int addVideoWatermarkEx(const agora::rtc::WatermarkConfig &config, const agora::rtc::RtcConnection &connection);
    int removeVideoWatermarkEx(const std::string &id, const agora::rtc::RtcConnection &connection);
    int clearVideoWatermarkEx(const agora::rtc::RtcConnection &connection);
    int sendCustomReportMessageEx(const std::string &id, const std::string &category, const std::string &event,
                                  const std::string &label, int value, const agora::rtc::RtcConnection &connection);
    int enableAudioVolumeIndicationEx(int interval, int smooth, bool reportVad,
                                      const agora::rtc::RtcConnection &connection);
    int startRtmpStreamWithoutTranscodingEx(const std::string &url, const agora::rtc::RtcConnection &connection);
    int startRtmpStreamWithTranscodingEx(const std::string &url, const agora::rtc::LiveTranscoding &transcoding,
                                         const agora::rtc::RtcConnection &connection);
    int updateRtmpTranscodingEx(const agora::rtc::LiveTranscoding &transcoding,
                                const agora::rtc::RtcConnection &connection);
    int stopRtmpStreamEx(const std::string &url, const agora::rtc::RtcConnection &connection);
    int startOrUpdateChannelMediaRelayEx(const agora::rtc::ChannelMediaRelayConfiguration &configuration,
                                         const agora::rtc::RtcConnection &connection);
    int stopChannelMediaRelayEx(const agora::rtc::RtcConnection &connection);
    int pauseAllChannelMediaRelayEx(const agora::rtc::RtcConnection &connection);
    int resumeAllChannelMediaRelayEx(const agora::rtc::RtcConnection &connection);

    GetUserInfoResult getUserInfoByUserAccountEx(const std::string &userAccount,
                                                 const agora::rtc::RtcConnection &connection);

    GetUserInfoResult getUserInfoByUidEx(agora::rtc::uid_t uid, const agora::rtc::RtcConnection &connection);
    int enableDualStreamModeEx(bool enabled, const agora::rtc::SimulcastStreamConfig &streamConfig,
                               const agora::rtc::RtcConnection &connection);
    int setDualStreamModeEx(agora::rtc::SIMULCAST_STREAM_MODE mode,
                            const agora::rtc::SimulcastStreamConfig &streamConfig,
                            const agora::rtc::RtcConnection &connection);
    int setSimulcastConfigEx(const agora::rtc::SimulcastConfig &simulcastConfig,
                             const agora::rtc::RtcConnection &connection);
    int setHighPriorityUserListEx(const std::vector<agora::rtc::uid_t> &uidList,
                                  agora::rtc::STREAM_FALLBACK_OPTIONS option,
                                  const agora::rtc::RtcConnection &connection);
    int takeSnapshotEx(const agora::rtc::RtcConnection &connection, agora::rtc::uid_t uid, const std::string &filePath);
    int takeSnapshotEx(const agora::rtc::RtcConnection &connection, agora::rtc::uid_t uid,
                       const agora::media::SnapshotConfig &config);
    int enableContentInspectEx(bool enabled, const agora::media::ContentInspectConfig &config,
                               const agora::rtc::RtcConnection &connection);
    int startMediaRenderingTracingEx(const agora::rtc::RtcConnection &connection);
    int setParametersEx(const agora::rtc::RtcConnection &connection, const std::string &parameters);

    GetCallIdResult getCallIdEx(const agora::rtc::RtcConnection &connection);
    int sendAudioMetadataEx(const agora::rtc::RtcConnection &connection, const void *metadata, size_t length);
    int preloadEffectEx(const agora::rtc::RtcConnection &connection, int soundId, const std::string &filePath,
                        int startPos);
    int playEffectEx(const agora::rtc::RtcConnection &connection, int soundId, const std::string &filePath,
                     int loopCount, double pitch, double pan, int gain, bool publish, int startPos);

private:
    void releaseMediaPlayers();
    void releaseMediaRecorders();
    void releaseVideoEffects();

    agora::rtc::IRtcEngineEx *_engine{nullptr};
    std::shared_ptr<RtcEngineEventHandlerExBridge> _eventHandler;
    std::vector<std::shared_ptr<MediaPlayerBridge>> _mediaPlayers;
    std::vector<std::shared_ptr<MediaRecorderBridge>> _mediaRecorders;
    std::vector<std::shared_ptr<VideoEffectObjectBridge>> _videoEffects;
    std::shared_ptr<ScreenCaptureSourceListBridge> _screenCaptureSources;
    std::shared_ptr<AudioDeviceManagerBridge> _audioDeviceManager;
    std::shared_ptr<VideoDeviceManagerBridge> _videoDeviceManager;
    std::shared_ptr<MusicContentCenterBridge> _musicContentCenter;
    std::shared_ptr<MediaPlayerCacheManagerBridge> _mediaPlayerCacheManager;
    std::shared_ptr<LocalSpatialAudioEngineBridge> _localSpatialAudioEngine;
    std::shared_ptr<H265TranscoderBridge> _h265Transcoder;
};
