#pragma once

#include <memory>
#include <string>

#include "IAgoraRtcEngine.h"

namespace se {
class Object;
}
class RtcEngineEventHandlerExBridge;

// =============================================================================
// Simplified structs (replacing Agora SDK types)
// =============================================================================

struct AgoraRtcNativeContext {
    std::string appId;
    int channelProfile{static_cast<int>(agora::CHANNEL_PROFILE_COMMUNICATION)};
    int audioScenario{static_cast<int>(agora::rtc::AUDIO_SCENARIO_DEFAULT)};
    unsigned int areaCode{agora::rtc::AREA_CODE_GLOB};
};

// =============================================================================
// Result structs for Pattern A / B (out-param methods)
// =============================================================================

struct GetVersionResult {
    int errorCode;
    int build;
};

struct GetEffectsVolumeResult {
    int errorCode;
    int volume;
};

struct QueryCodecCapabilityResult {
    int errorCode;
    int size;
};

struct GetAudioMixingDurationResult {
    int errorCode;
    int duration;
};

struct GetAudioMixingCurrentPositionResult {
    int errorCode;
    int position;
};

struct GetAudioMixingPublishVolumeResult {
    int errorCode;
    int volume;
};

struct GetAudioMixingPlayoutVolumeResult {
    int errorCode;
    int volume;
};

struct GetAudioTrackCountResult {
    int errorCode;
    int count;
};

struct GetVolumeOfEffectResult {
    int errorCode;
    int volume;
};

struct GetEffectDurationResult {
    int errorCode;
    int duration;
};

struct GetEffectCurrentPositionResult {
    int errorCode;
    int position;
};

struct GetCameraMaxZoomFactorResult {
    int errorCode;
    float factor;
};

struct GetLoopbackRecordingVolumeResult {
    int errorCode;
    int volume;
};

struct GetNetworkTypeResult {
    int errorCode;
    int type;
};

struct GetFaceShapeBeautyOptionsResult {
    int errorCode;
    int options;
};

struct GetFaceShapeAreaOptionsResult {
    int errorCode;
    int options;
};

// =============================================================================
// RtcEngineExBridge
// =============================================================================

class RtcEngineExBridge {
public:
    RtcEngineExBridge();
    ~RtcEngineExBridge();

    // -------------------------------------------------------------------------
    // 0. release (SDK: static void release in IRtcEngine, first method)
    // -------------------------------------------------------------------------
    void release(bool sync);

    // -------------------------------------------------------------------------
    // 1. initialize
    // -------------------------------------------------------------------------
    int initialize(const AgoraRtcNativeContext &context, se::Object *eventHandler);

    // -------------------------------------------------------------------------
    // 2. queryInterface — stub (not supported)
    // -------------------------------------------------------------------------
    int queryInterface(int iid);

    // -------------------------------------------------------------------------
    // 3. getVersion
    // -------------------------------------------------------------------------
    GetVersionResult getVersion();

    // -------------------------------------------------------------------------
    // 4. getErrorDescription
    // -------------------------------------------------------------------------
    const char *getErrorDescription(int code);

    // -------------------------------------------------------------------------
    // 5. queryCodecCapability
    // -------------------------------------------------------------------------
    QueryCodecCapabilityResult queryCodecCapability();

    // -------------------------------------------------------------------------
    // 6. queryDeviceScore
    // -------------------------------------------------------------------------
    int queryDeviceScore();

    // -------------------------------------------------------------------------
    // 7. preloadChannel
    // -------------------------------------------------------------------------
    int preloadChannel(const std::string &token, const std::string &channelId, agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 8. preloadChannelWithUserAccount
    // -------------------------------------------------------------------------
    int preloadChannelWithUserAccount(const std::string &token, const std::string &channelId, const std::string &userAccount);

    // -------------------------------------------------------------------------
    // 9. updatePreloadChannelToken
    // -------------------------------------------------------------------------
    int updatePreloadChannelToken(const std::string &token);

    // -------------------------------------------------------------------------
    // 10–11. joinChannel (2 overloads)
    // -------------------------------------------------------------------------
    int joinChannel(
        const std::string &token,
        const std::string &channelId,
        const std::string &info,
        agora::rtc::uid_t uid);
    int joinChannel(
        const std::string &token,
        const std::string &channelId,
        agora::rtc::uid_t uid,
        const agora::rtc::ChannelMediaOptions &options);

    // -------------------------------------------------------------------------
    // 12. updateChannelMediaOptions
    // -------------------------------------------------------------------------
    int updateChannelMediaOptions(const agora::rtc::ChannelMediaOptions &options);

    // -------------------------------------------------------------------------
    // 13. leaveChannel
    // -------------------------------------------------------------------------
    int leaveChannel();

    // -------------------------------------------------------------------------
    // 14. leaveChannel (with LeaveChannelOptions)
    // -------------------------------------------------------------------------
    int leaveChannel(const agora::rtc::LeaveChannelOptions &options);

    // -------------------------------------------------------------------------
    // 15. renewToken
    // -------------------------------------------------------------------------
    int renewToken(const std::string &token);

    // -------------------------------------------------------------------------
    // 16. setChannelProfile
    // -------------------------------------------------------------------------
    int setChannelProfile(int profile);

    // -------------------------------------------------------------------------
    // 17–18. setClientRole (2 overloads)
    // -------------------------------------------------------------------------
    int setClientRole(int role);
    int setClientRole(int role, int audienceLatencyLevel);

    // -------------------------------------------------------------------------
    // 19. startEchoTest — stub
    // -------------------------------------------------------------------------
    int startEchoTest(const agora::rtc::EchoTestConfiguration &config);

    // -------------------------------------------------------------------------
    // 20. stopEchoTest
    // -------------------------------------------------------------------------
    int stopEchoTest();

    // -------------------------------------------------------------------------
    // 21. enableMultiCamera — stub
    // -------------------------------------------------------------------------
    int enableMultiCamera(bool enabled, const agora::rtc::CameraCapturerConfiguration &config);

    // -------------------------------------------------------------------------
    // 22. enableVideo
    // -------------------------------------------------------------------------
    int enableVideo();

    // -------------------------------------------------------------------------
    // 23. disableVideo
    // -------------------------------------------------------------------------
    int disableVideo();

    // -------------------------------------------------------------------------
    // 24–25. startPreview (2 overloads)
    // -------------------------------------------------------------------------
    int startPreview();
    int startPreview(int sourceType);

    // -------------------------------------------------------------------------
    // 26–27. stopPreview (2 overloads)
    // -------------------------------------------------------------------------
    int stopPreview();
    int stopPreview(int sourceType);

    // -------------------------------------------------------------------------
    // 28. startLastmileProbeTest — stub
    // -------------------------------------------------------------------------
    int startLastmileProbeTest(const agora::rtc::LastmileProbeConfig &config);

    // -------------------------------------------------------------------------
    // 29. stopLastmileProbeTest
    // -------------------------------------------------------------------------
    int stopLastmileProbeTest();

    // -------------------------------------------------------------------------
    // 30. setVideoEncoderConfiguration — stub
    // -------------------------------------------------------------------------
    int setVideoEncoderConfiguration(const agora::rtc::VideoEncoderConfiguration &config);

    // -------------------------------------------------------------------------
    // 31–42: Beauty / filter / video effect — stubs
    // -------------------------------------------------------------------------
    int setBeautyEffectOptions(bool enabled, const agora::rtc::BeautyOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    int setFaceShapeBeautyOptions(bool enabled, const agora::rtc::FaceShapeBeautyOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    int setFaceShapeAreaOptions(const agora::rtc::FaceShapeAreaOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    GetFaceShapeBeautyOptionsResult getFaceShapeBeautyOptions(int type);
    GetFaceShapeAreaOptionsResult getFaceShapeAreaOptions(int shapeArea, int type);
    int setFilterEffectOptions(bool enabled, const agora::rtc::FilterEffectOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    int createVideoEffectObject(const std::string &bundlePath, int type);
    int destroyVideoEffectObject(int videoEffectObject);
    int setLowlightEnhanceOptions(bool enabled, const agora::rtc::LowlightEnhanceOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    int setVideoDenoiserOptions(bool enabled, const agora::rtc::VideoDenoiserOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    int setColorEnhanceOptions(bool enabled, const agora::rtc::ColorEnhanceOptions &options, agora::media::MEDIA_SOURCE_TYPE type);
    int enableVirtualBackground(bool enabled, const agora::rtc::VirtualBackgroundSource &backgroundSource, const agora::rtc::SegmentationProperty &segproperty, agora::media::MEDIA_SOURCE_TYPE type);

    // -------------------------------------------------------------------------
    // 43. setupRemoteVideo — stub
    // -------------------------------------------------------------------------
    int setupRemoteVideo(const agora::rtc::VideoCanvas &canvas);

    // -------------------------------------------------------------------------
    // 44. setupLocalVideo — stub
    // -------------------------------------------------------------------------
    int setupLocalVideo(const agora::rtc::VideoCanvas &canvas);

    // -------------------------------------------------------------------------
    // 45. setVideoScenario
    // -------------------------------------------------------------------------
    int setVideoScenario(int scenarioType);

    // -------------------------------------------------------------------------
    // 46. setVideoQoEPreference
    // -------------------------------------------------------------------------
    int setVideoQoEPreference(int qoePreference);

    // -------------------------------------------------------------------------
    // 47. enableAudio
    // -------------------------------------------------------------------------
    int enableAudio();

    // -------------------------------------------------------------------------
    // 48. disableAudio
    // -------------------------------------------------------------------------
    int disableAudio();

    // -------------------------------------------------------------------------
    // 49. setAudioProfile (deprecated, 2 params)
    // -------------------------------------------------------------------------
    int setAudioProfile(int profile, int scenario);

    // -------------------------------------------------------------------------
    // 50. setAudioProfile (1 param)
    // -------------------------------------------------------------------------
    int setAudioProfile(int profile);

    // -------------------------------------------------------------------------
    // 51. setAudioScenario
    // -------------------------------------------------------------------------
    int setAudioScenario(int scenario);

    // -------------------------------------------------------------------------
    // 52. enableLocalAudio
    // -------------------------------------------------------------------------
    int enableLocalAudio(bool enabled);

    // -------------------------------------------------------------------------
    // 53. muteLocalAudioStream
    // -------------------------------------------------------------------------
    int muteLocalAudioStream(bool mute);

    // -------------------------------------------------------------------------
    // 54. muteAllRemoteAudioStreams
    // -------------------------------------------------------------------------
    int muteAllRemoteAudioStreams(bool mute);

    // -------------------------------------------------------------------------
    // 55. muteRemoteAudioStream
    // -------------------------------------------------------------------------
    int muteRemoteAudioStream(agora::rtc::uid_t uid, bool mute);

    // -------------------------------------------------------------------------
    // 56. muteLocalVideoStream
    // -------------------------------------------------------------------------
    int muteLocalVideoStream(bool mute);

    // -------------------------------------------------------------------------
    // 57. enableLocalVideo
    // -------------------------------------------------------------------------
    int enableLocalVideo(bool enabled);

    // -------------------------------------------------------------------------
    // 58. muteAllRemoteVideoStreams
    // -------------------------------------------------------------------------
    int muteAllRemoteVideoStreams(bool mute);

    // -------------------------------------------------------------------------
    // 59. setRemoteDefaultVideoStreamType
    // -------------------------------------------------------------------------
    int setRemoteDefaultVideoStreamType(int streamType);

    // -------------------------------------------------------------------------
    // 60. muteRemoteVideoStream
    // -------------------------------------------------------------------------
    int muteRemoteVideoStream(agora::rtc::uid_t uid, bool mute);

    // -------------------------------------------------------------------------
    // 61. setRemoteVideoStreamType
    // -------------------------------------------------------------------------
    int setRemoteVideoStreamType(agora::rtc::uid_t uid, int streamType);

    // -------------------------------------------------------------------------
    // 62. setRemoteVideoSubscriptionOptions — stub
    // -------------------------------------------------------------------------
    int setRemoteVideoSubscriptionOptions(agora::rtc::uid_t uid, const agora::rtc::VideoSubscriptionOptions &options);

    // -------------------------------------------------------------------------
    // 63–66: Subscribe blocklist/allowlist — stubs
    // -------------------------------------------------------------------------
    int setSubscribeAudioBlocklist(int uidList, int uidNumber);
    int setSubscribeAudioAllowlist(int uidList, int uidNumber);
    int setSubscribeVideoBlocklist(int uidList, int uidNumber);
    int setSubscribeVideoAllowlist(int uidList, int uidNumber);

    // -------------------------------------------------------------------------
    // 67. enableAudioVolumeIndication
    // -------------------------------------------------------------------------
    int enableAudioVolumeIndication(int interval, int smooth, bool reportVad);

    // -------------------------------------------------------------------------
    // 68–70. startAudioRecording — stubs
    // -------------------------------------------------------------------------
    int startAudioRecording(const std::string &filePath, int quality);
    int startAudioRecording(const std::string &filePath, int sampleRate, int quality);
    int startAudioRecording(const agora::rtc::AudioRecordingConfiguration &config);

    // -------------------------------------------------------------------------
    // 71. registerAudioEncodedFrameObserver — stub
    // -------------------------------------------------------------------------
    int registerAudioEncodedFrameObserver(int config, int observer);

    // -------------------------------------------------------------------------
    // 72. stopAudioRecording
    // -------------------------------------------------------------------------
    int stopAudioRecording();

    // -------------------------------------------------------------------------
    // 73. createMediaPlayer — stub
    // -------------------------------------------------------------------------
    int createMediaPlayer();

    // -------------------------------------------------------------------------
    // 74. destroyMediaPlayer — stub
    // -------------------------------------------------------------------------
    int destroyMediaPlayer(int mediaPlayer);

    // -------------------------------------------------------------------------
    // 75. createMediaRecorder — stub
    // -------------------------------------------------------------------------
    int createMediaRecorder(int info);

    // -------------------------------------------------------------------------
    // 76. destroyMediaRecorder — stub
    // -------------------------------------------------------------------------
    int destroyMediaRecorder(int mediaRecorder);

    // -------------------------------------------------------------------------
    // 77–78. startAudioMixing (2 overloads)
    // -------------------------------------------------------------------------
    int startAudioMixing(const std::string &filePath, bool loopback, int cycle);
    int startAudioMixing(const std::string &filePath, bool loopback, int cycle, int startPos);

    // -------------------------------------------------------------------------
    // 79. stopAudioMixing
    // -------------------------------------------------------------------------
    int stopAudioMixing();

    // -------------------------------------------------------------------------
    // 80. pauseAudioMixing
    // -------------------------------------------------------------------------
    int pauseAudioMixing();

    // -------------------------------------------------------------------------
    // 81. resumeAudioMixing
    // -------------------------------------------------------------------------
    int resumeAudioMixing();

    // -------------------------------------------------------------------------
    // 82. selectAudioTrack
    // -------------------------------------------------------------------------
    int selectAudioTrack(int index);

    // -------------------------------------------------------------------------
    // 83. getAudioTrackCount
    // -------------------------------------------------------------------------
    GetAudioTrackCountResult getAudioTrackCount();

    // -------------------------------------------------------------------------
    // 84. adjustAudioMixingVolume
    // -------------------------------------------------------------------------
    int adjustAudioMixingVolume(int volume);

    // -------------------------------------------------------------------------
    // 85. adjustAudioMixingPublishVolume
    // -------------------------------------------------------------------------
    int adjustAudioMixingPublishVolume(int volume);

    // -------------------------------------------------------------------------
    // 86. getAudioMixingPublishVolume
    // -------------------------------------------------------------------------
    GetAudioMixingPublishVolumeResult getAudioMixingPublishVolume();

    // -------------------------------------------------------------------------
    // 87. adjustAudioMixingPlayoutVolume
    // -------------------------------------------------------------------------
    int adjustAudioMixingPlayoutVolume(int volume);

    // -------------------------------------------------------------------------
    // 88. getAudioMixingPlayoutVolume
    // -------------------------------------------------------------------------
    GetAudioMixingPlayoutVolumeResult getAudioMixingPlayoutVolume();

    // -------------------------------------------------------------------------
    // 89. getAudioMixingDuration
    // -------------------------------------------------------------------------
    GetAudioMixingDurationResult getAudioMixingDuration();

    // -------------------------------------------------------------------------
    // 90. getAudioMixingCurrentPosition
    // -------------------------------------------------------------------------
    GetAudioMixingCurrentPositionResult getAudioMixingCurrentPosition();

    // -------------------------------------------------------------------------
    // 91. setAudioMixingPosition
    // -------------------------------------------------------------------------
    int setAudioMixingPosition(int pos);

    // -------------------------------------------------------------------------
    // 92. setAudioMixingDualMonoMode
    // -------------------------------------------------------------------------
    int setAudioMixingDualMonoMode(int mode);

    // -------------------------------------------------------------------------
    // 93. setAudioMixingPitch
    // -------------------------------------------------------------------------
    int setAudioMixingPitch(int pitch);

    // -------------------------------------------------------------------------
    // 94. setAudioMixingPlaybackSpeed
    // -------------------------------------------------------------------------
    int setAudioMixingPlaybackSpeed(int speed);

    // -------------------------------------------------------------------------
    // 95. getEffectsVolume
    // -------------------------------------------------------------------------
    GetEffectsVolumeResult getEffectsVolume();

    // -------------------------------------------------------------------------
    // 96. setEffectsVolume
    // -------------------------------------------------------------------------
    int setEffectsVolume(int volume);

    // -------------------------------------------------------------------------
    // 97. preloadEffect
    // -------------------------------------------------------------------------
    int preloadEffect(int soundId, const std::string &filePath, int startPos);

    // -------------------------------------------------------------------------
    // 98. playEffect
    // -------------------------------------------------------------------------
    int playEffect(int soundId, const std::string &filePath, int loopCount, double pitch, double pan, int gain, bool publish, int startPos);

    // -------------------------------------------------------------------------
    // 99. playAllEffects
    // -------------------------------------------------------------------------
    int playAllEffects(int loopCount, double pitch, double pan, int gain, bool publish);

    // -------------------------------------------------------------------------
    // 100. getVolumeOfEffect
    // -------------------------------------------------------------------------
    GetVolumeOfEffectResult getVolumeOfEffect(int soundId);

    // -------------------------------------------------------------------------
    // 101. setVolumeOfEffect
    // -------------------------------------------------------------------------
    int setVolumeOfEffect(int soundId, int volume);

    // -------------------------------------------------------------------------
    // 102. pauseEffect
    // -------------------------------------------------------------------------
    int pauseEffect(int soundId);

    // -------------------------------------------------------------------------
    // 103. pauseAllEffects
    // -------------------------------------------------------------------------
    int pauseAllEffects();

    // -------------------------------------------------------------------------
    // 104. resumeEffect
    // -------------------------------------------------------------------------
    int resumeEffect(int soundId);

    // -------------------------------------------------------------------------
    // 105. resumeAllEffects
    // -------------------------------------------------------------------------
    int resumeAllEffects();

    // -------------------------------------------------------------------------
    // 106. stopEffect
    // -------------------------------------------------------------------------
    int stopEffect(int soundId);

    // -------------------------------------------------------------------------
    // 107. stopAllEffects
    // -------------------------------------------------------------------------
    int stopAllEffects();

    // -------------------------------------------------------------------------
    // 108. unloadEffect
    // -------------------------------------------------------------------------
    int unloadEffect(int soundId);

    // -------------------------------------------------------------------------
    // 109. unloadAllEffects
    // -------------------------------------------------------------------------
    int unloadAllEffects();

    // -------------------------------------------------------------------------
    // 110. getEffectDuration
    // -------------------------------------------------------------------------
    GetEffectDurationResult getEffectDuration(const std::string &filePath);

    // -------------------------------------------------------------------------
    // 111. setEffectPosition
    // -------------------------------------------------------------------------
    int setEffectPosition(int soundId, int pos);

    // -------------------------------------------------------------------------
    // 112. getEffectCurrentPosition
    // -------------------------------------------------------------------------
    GetEffectCurrentPositionResult getEffectCurrentPosition(int soundId);

    // -------------------------------------------------------------------------
    // 113. enableSoundPositionIndication
    // -------------------------------------------------------------------------
    int enableSoundPositionIndication(bool enabled);

    // -------------------------------------------------------------------------
    // 114. setRemoteVoicePosition
    // -------------------------------------------------------------------------
    int setRemoteVoicePosition(agora::rtc::uid_t uid, double pan, double gain);

    // -------------------------------------------------------------------------
    // 115. enableSpatialAudio
    // -------------------------------------------------------------------------
    int enableSpatialAudio(bool enabled);

    // -------------------------------------------------------------------------
    // 116. setRemoteUserSpatialAudioParams — stub
    // -------------------------------------------------------------------------
    int setRemoteUserSpatialAudioParams(agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 117. setVoiceBeautifierPreset
    // -------------------------------------------------------------------------
    int setVoiceBeautifierPreset(int preset);

    // -------------------------------------------------------------------------
    // 118. setAudioEffectPreset
    // -------------------------------------------------------------------------
    int setAudioEffectPreset(int preset);

    // -------------------------------------------------------------------------
    // 119. setVoiceConversionPreset
    // -------------------------------------------------------------------------
    int setVoiceConversionPreset(int preset);

    // -------------------------------------------------------------------------
    // 120. setAudioEffectParameters
    // -------------------------------------------------------------------------
    int setAudioEffectParameters(int preset, int param1, int param2);

    // -------------------------------------------------------------------------
    // 121. setLocalVoicePitch
    // -------------------------------------------------------------------------
    int setLocalVoicePitch(double pitch);

    // -------------------------------------------------------------------------
    // 122. setLocalVoiceFormant
    // -------------------------------------------------------------------------
    int setLocalVoiceFormant(double formantRatio);

    // -------------------------------------------------------------------------
    // 123. setLocalVoiceEqualization
    // -------------------------------------------------------------------------
    int setLocalVoiceEqualization(int bandFrequency, int bandGain);

    // -------------------------------------------------------------------------
    // 124. setLocalVoiceReverb
    // -------------------------------------------------------------------------
    int setLocalVoiceReverb(int reverbKey, int value);

    // -------------------------------------------------------------------------
    // 125. setHeadphoneEQPreset
    // -------------------------------------------------------------------------
    int setHeadphoneEQPreset(int preset);

    // -------------------------------------------------------------------------
    // 126. setHeadphoneEQParameters
    // -------------------------------------------------------------------------
    int setHeadphoneEQParameters(int lowGain, int highGain);

    // -------------------------------------------------------------------------
    // 127. enableVoiceAITuner
    // -------------------------------------------------------------------------
    int enableVoiceAITuner(bool enabled, int type);

    // -------------------------------------------------------------------------
    // 128. setLogFile
    // -------------------------------------------------------------------------
    int setLogFile(const std::string &filePath);

    // -------------------------------------------------------------------------
    // 129. setLogFilter
    // -------------------------------------------------------------------------
    int setLogFilter(unsigned int filter);

    // -------------------------------------------------------------------------
    // 130. setLogLevel
    // -------------------------------------------------------------------------
    int setLogLevel(int level);

    // -------------------------------------------------------------------------
    // 131. setLogFileSize
    // -------------------------------------------------------------------------
    int setLogFileSize(unsigned int fileSizeInKBytes);

    // -------------------------------------------------------------------------
    // 132. uploadLogFile — stub
    // -------------------------------------------------------------------------
    int uploadLogFile();

    // -------------------------------------------------------------------------
    // 133. writeLog — stub (varargs)
    // -------------------------------------------------------------------------
    int writeLog(int level, const std::string &message);

    // -------------------------------------------------------------------------
    // 134. setLocalRenderMode (2 params) — stub
    // -------------------------------------------------------------------------
    int setLocalRenderMode(int renderMode, int mirrorMode);

    // -------------------------------------------------------------------------
    // 135. setLocalRenderTargetFps
    // -------------------------------------------------------------------------
    int setLocalRenderTargetFps(int sourceType, int targetFps);

    // -------------------------------------------------------------------------
    // 136. setRemoteRenderTargetFps
    // -------------------------------------------------------------------------
    int setRemoteRenderTargetFps(int targetFps);

    // -------------------------------------------------------------------------
    // 137. setLocalRenderMode (deprecated, 1 param)
    // -------------------------------------------------------------------------
    int setLocalRenderMode(int renderMode);

    // -------------------------------------------------------------------------
    // 138. setLocalVideoMirrorMode
    // -------------------------------------------------------------------------
    int setLocalVideoMirrorMode(int mirrorMode);

    // -------------------------------------------------------------------------
    // 139–140. enableDualStreamMode (deprecated)
    // -------------------------------------------------------------------------
    int enableDualStreamMode(bool enabled);
    int enableDualStreamMode(bool enabled, const agora::rtc::SimulcastStreamConfig &streamConfig);

    // -------------------------------------------------------------------------
    // 141. setDualStreamMode
    // -------------------------------------------------------------------------
    int setDualStreamMode(int mode);

    // -------------------------------------------------------------------------
    // 142. setSimulcastConfig — stub
    // -------------------------------------------------------------------------
    int setSimulcastConfig();

    // -------------------------------------------------------------------------
    // 143. setDualStreamMode (with config) — stub
    // -------------------------------------------------------------------------
    int setDualStreamMode(int mode, const agora::rtc::SimulcastStreamConfig &streamConfig);

    // -------------------------------------------------------------------------
    // 144. enableCustomAudioLocalPlayback — stub
    // -------------------------------------------------------------------------
    int enableCustomAudioLocalPlayback();

    // -------------------------------------------------------------------------
    // 145–147. Audio frame parameters — stubs
    // -------------------------------------------------------------------------
    int setMixedAudioFrameParameters(int sampleRate, int channel, int samplesPerCall);
    int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel);
    int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel, int samplesPerCall);

    // -------------------------------------------------------------------------
    // 148. enableAudioSpectrumMonitor
    // -------------------------------------------------------------------------
    int enableAudioSpectrumMonitor(int intervalInMS);

    // -------------------------------------------------------------------------
    // 149. disableAudioSpectrumMonitor
    // -------------------------------------------------------------------------
    int disableAudioSpectrumMonitor();

    // -------------------------------------------------------------------------
    // 150. registerAudioSpectrumObserver — stub
    // -------------------------------------------------------------------------
    int registerAudioSpectrumObserver();

    // -------------------------------------------------------------------------
    // 151. unregisterAudioSpectrumObserver — stub
    // -------------------------------------------------------------------------
    int unregisterAudioSpectrumObserver();

    // -------------------------------------------------------------------------
    // 152. adjustRecordingSignalVolume
    // -------------------------------------------------------------------------
    int adjustRecordingSignalVolume(int volume);

    // -------------------------------------------------------------------------
    // 153. muteRecordingSignal
    // -------------------------------------------------------------------------
    int muteRecordingSignal(bool mute);

    // -------------------------------------------------------------------------
    // 154. adjustPlaybackSignalVolume
    // -------------------------------------------------------------------------
    int adjustPlaybackSignalVolume(int volume);

    // -------------------------------------------------------------------------
    // 155. adjustUserPlaybackSignalVolume
    // -------------------------------------------------------------------------
    int adjustUserPlaybackSignalVolume(agora::rtc::uid_t uid, int volume);

    // -------------------------------------------------------------------------
    // 156. setRemoteSubscribeFallbackOption
    // -------------------------------------------------------------------------
    int setRemoteSubscribeFallbackOption(int option);

    // -------------------------------------------------------------------------
    // 157. setHighPriorityUserList — stub
    // -------------------------------------------------------------------------
    int setHighPriorityUserList();

    // -------------------------------------------------------------------------
    // 158–160. Extension — stubs
    // -------------------------------------------------------------------------
    int enableExtension(const std::string &provider, const std::string &extension, const agora::rtc::ExtensionInfo &extensionInfo, bool enable);
    int enableExtension(const std::string &provider, const std::string &extension, bool enable, int type);
    int setExtensionProperty(const std::string &provider, const std::string &extension, const std::string &key, const std::string &value);
    int getExtensionProperty(const std::string &provider, const std::string &extension, const std::string &key);

    // -------------------------------------------------------------------------
    // 161. enableLoopbackRecording
    // -------------------------------------------------------------------------
    int enableLoopbackRecording(bool enabled);

    // -------------------------------------------------------------------------
    // 162. adjustLoopbackSignalVolume
    // -------------------------------------------------------------------------
    int adjustLoopbackSignalVolume(int volume);

    // -------------------------------------------------------------------------
    // 163. getLoopbackRecordingVolume
    // -------------------------------------------------------------------------
    GetLoopbackRecordingVolumeResult getLoopbackRecordingVolume();

    // -------------------------------------------------------------------------
    // 164. enableInEarMonitoring
    // -------------------------------------------------------------------------
    int enableInEarMonitoring(bool enabled, int includeAudioFilters);

    // -------------------------------------------------------------------------
    // 165. setInEarMonitoringVolume
    // -------------------------------------------------------------------------
    int setInEarMonitoringVolume(int volume);

    // -------------------------------------------------------------------------
    // 166–168. Extension provider — stubs
    // -------------------------------------------------------------------------
    int loadExtensionProvider(const std::string &path);
    int setExtensionProviderProperty(const std::string &provider, const std::string &key, const std::string &value);
    int registerExtension(const std::string &provider, const std::string &extension);


    // -------------------------------------------------------------------------
    // 170–244. Camera — stubs
    // -------------------------------------------------------------------------
    int setCameraCapturerConfiguration();
    int createCustomVideoTrack();
    int createCustomEncodedVideoTrack();
    int destroyCustomVideoTrack();
    int destroyCustomEncodedVideoTrack();
    int switchCamera();
    bool isCameraZoomSupported();
    bool isCameraFaceDetectSupported();
    bool isCameraTorchSupported();
    bool isCameraFocusSupported();
    bool isCameraAutoFocusFaceModeSupported();
    int setCameraZoomFactor(float factor);
    int enableFaceDetection(bool enabled);
    GetCameraMaxZoomFactorResult getCameraMaxZoomFactor();
    int setCameraFocusPositionInPreview(float positionX, float positionY);
    int setCameraTorchOn(bool isOn);
    int setCameraAutoFocusFaceModeEnabled(bool enabled);
    bool isCameraExposurePositionSupported();
    int setCameraExposurePosition(float positionXinView, float positionYinView);
    bool isCameraExposureSupported();
    int setCameraExposureFactor(float factor);
    bool isCameraAutoExposureFaceModeSupported();
    int setCameraAutoExposureFaceModeEnabled(bool enabled);
    int setCameraStabilizationMode(int mode);
    bool isCameraCenterStageSupported();
    int enableCameraCenterStage(bool enabled);

    // -------------------------------------------------------------------------
    // 245. setDefaultAudioRouteToSpeakerphone
    // -------------------------------------------------------------------------
    int setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker);

    // -------------------------------------------------------------------------
    // 246. setEnableSpeakerphone
    // -------------------------------------------------------------------------
    int setEnableSpeakerphone(bool speakerOn);

    // -------------------------------------------------------------------------
    // 247. isSpeakerphoneEnabled
    // -------------------------------------------------------------------------
    bool isSpeakerphoneEnabled();

    // -------------------------------------------------------------------------
    // 248. setRouteInCommunicationMode
    // -------------------------------------------------------------------------
    int setRouteInCommunicationMode(int route);

    // -------------------------------------------------------------------------
    // 249. getScreenCaptureSources — stub
    // -------------------------------------------------------------------------
    int getScreenCaptureSources();

    // -------------------------------------------------------------------------
    // 250. setAudioSessionOperationRestriction — stub
    // -------------------------------------------------------------------------
    int setAudioSessionOperationRestriction(int restriction);

    // -------------------------------------------------------------------------
    // 251. getAudioDeviceInfo — stub
    // -------------------------------------------------------------------------
    int getAudioDeviceInfo();

    // -------------------------------------------------------------------------
    // 252. setScreenCaptureContentHint
    // -------------------------------------------------------------------------
    int setScreenCaptureContentHint(int contentHint);

    // -------------------------------------------------------------------------
    // 253. updateScreenCaptureRegion — stub
    // -------------------------------------------------------------------------
    int updateScreenCaptureRegion();

    // -------------------------------------------------------------------------
    // 254. updateScreenCaptureParameters — stub
    // -------------------------------------------------------------------------
    int updateScreenCaptureParameters();

    // -------------------------------------------------------------------------
    // 255–258. Screen capture — stubs
    // -------------------------------------------------------------------------
    int startScreenCapture();
    int updateScreenCapture();
    int queryScreenCaptureCapability();

    // -------------------------------------------------------------------------
    // 259. queryCameraFocalLengthCapability — stub
    // -------------------------------------------------------------------------
    int queryCameraFocalLengthCapability();

    // -------------------------------------------------------------------------
    // 260. setExternalMediaProjection — stub
    // -------------------------------------------------------------------------
    int setExternalMediaProjection();

    // -------------------------------------------------------------------------
    // 261. setScreenCaptureScenario
    // -------------------------------------------------------------------------
    int setScreenCaptureScenario(int screenScenario);

    // -------------------------------------------------------------------------
    // 262. stopScreenCapture
    // -------------------------------------------------------------------------
    int stopScreenCapture();

    // -------------------------------------------------------------------------
    // 263. getCallId — stub (out param)
    // -------------------------------------------------------------------------
    int getCallId();

    // -------------------------------------------------------------------------
    // 264. rate
    // -------------------------------------------------------------------------
    int rate(const std::string &callId, int rating, const std::string &description);

    // -------------------------------------------------------------------------
    // 265. complain
    // -------------------------------------------------------------------------
    int complain(const std::string &callId, const std::string &description);

    // -------------------------------------------------------------------------
    // 266–274. RTMP streaming / transcoder — stubs
    // -------------------------------------------------------------------------
    int startRtmpStreamWithoutTranscoding(const std::string &url);
    int startRtmpStreamWithTranscoding(const std::string &url);
    int updateRtmpTranscoding();
    int startLocalVideoTranscoder();
    int updateLocalTranscoderConfiguration();
    int stopRtmpStream(const std::string &url);
    int stopLocalVideoTranscoder();

    // -------------------------------------------------------------------------
    // 275–277. Local audio mixer — stubs
    // -------------------------------------------------------------------------
    int startLocalAudioMixer();
    int updateLocalAudioMixerConfiguration();
    int stopLocalAudioMixer();

    // -------------------------------------------------------------------------
    // 278–282. Camera/screen capture source type — stubs
    // -------------------------------------------------------------------------
    int startCameraCapture(int sourceType);
    int stopCameraCapture(int sourceType);
    int setCameraDeviceOrientation(int type, int orientation);
    int setScreenCaptureOrientation(int type, int orientation);
    int startScreenCapture(int sourceType);

    // -------------------------------------------------------------------------
    // 283. stopScreenCapture (by sourceType) — stub
    // -------------------------------------------------------------------------
    int stopScreenCapture(int sourceType);

    // -------------------------------------------------------------------------
    // 284. getConnectionState
    // -------------------------------------------------------------------------
    int getConnectionState();

    // -------------------------------------------------------------------------
    // 285–286. registerEventHandler / unregisterEventHandler — stubs
    // -------------------------------------------------------------------------
    int registerEventHandler();
    int unregisterEventHandler();

    // -------------------------------------------------------------------------
    // 287. setRemoteUserPriority
    // -------------------------------------------------------------------------
    int setRemoteUserPriority(agora::rtc::uid_t uid, int userPriority);

    // -------------------------------------------------------------------------
    // 288. registerPacketObserver — stub
    // -------------------------------------------------------------------------
    int registerPacketObserver();

    // -------------------------------------------------------------------------
    // 289. enableEncryption
    // -------------------------------------------------------------------------
    int enableEncryption(bool enabled, const agora::rtc::EncryptionConfig &config);

    // -------------------------------------------------------------------------
    // 290. createDataStream (bool) — stub (out param)
    // -------------------------------------------------------------------------
    int createDataStream(bool reliable, bool ordered);

    // -------------------------------------------------------------------------
    // 291. createDataStream (config) — stub (out param)
    // -------------------------------------------------------------------------
    int createDataStream(const agora::rtc::DataStreamConfig &config);

    // -------------------------------------------------------------------------
    // 292. sendStreamMessage
    // -------------------------------------------------------------------------
    int sendStreamMessage(int streamId, const std::string &data);

    // -------------------------------------------------------------------------
    // 293. sendRdtMessage — stub
    // -------------------------------------------------------------------------
    int sendRdtMessage(agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 294. sendMediaControlMessage — stub
    // -------------------------------------------------------------------------
    int sendMediaControlMessage(agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 295–297. addVideoWatermark — stubs
    // -------------------------------------------------------------------------
    int addVideoWatermark();
    int addVideoWatermarkByUrl(const std::string &watermarkUrl);
    int removeVideoWatermark(const std::string &id);
    int clearVideoWatermarks();

    // -------------------------------------------------------------------------
    // 298–299. pauseAudio / resumeAudio (deprecated)
    // -------------------------------------------------------------------------
    int pauseAudio();
    int resumeAudio();

    // -------------------------------------------------------------------------
    // 300. enableWebSdkInteroperability
    // -------------------------------------------------------------------------
    int enableWebSdkInteroperability(bool enabled);

    // -------------------------------------------------------------------------
    // 301. sendCustomReportMessage
    // -------------------------------------------------------------------------
    int sendCustomReportMessage(const std::string &id, const std::string &category, const std::string &event, const std::string &label, int value);

    // -------------------------------------------------------------------------
    // 302–303. Media metadata observer — stubs
    // -------------------------------------------------------------------------
    int registerMediaMetadataObserver();
    int unregisterMediaMetadataObserver();

    // -------------------------------------------------------------------------
    // 304–305. Audio frame dump — stubs
    // -------------------------------------------------------------------------
    int startAudioFrameDump(const std::string &channelId, agora::rtc::uid_t uid);
    int stopAudioFrameDump(const std::string &channelId, agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 306. setAINSMode
    // -------------------------------------------------------------------------
    int setAINSMode(bool enabled, int mode);

    // -------------------------------------------------------------------------
    // 307. registerLocalUserAccount
    // -------------------------------------------------------------------------
    int registerLocalUserAccount(const std::string &userAccount);

    // -------------------------------------------------------------------------
    // 308–309. joinChannelWithUserAccount (2 overloads)
    // -------------------------------------------------------------------------
    int joinChannelWithUserAccount(const std::string &token, const std::string &channelId, const std::string &userAccount);
    int joinChannelWithUserAccount(const std::string &token, const std::string &channelId, const std::string &userAccount, const agora::rtc::ChannelMediaOptions &options);

    // -------------------------------------------------------------------------
    // 310–311. getUserInfo — stubs (out param)
    // -------------------------------------------------------------------------
    int getUserInfoByUserAccount(const std::string &userAccount);
    int getUserInfoByUid(agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 312–315. Channel media relay — stubs
    // -------------------------------------------------------------------------
    int startOrUpdateChannelMediaRelay();
    int stopChannelMediaRelay();
    int pauseAllChannelMediaRelay();
    int resumeAllChannelMediaRelay();

    // -------------------------------------------------------------------------
    // 316–319. Direct CDN streaming — stubs
    // -------------------------------------------------------------------------
    int setDirectCdnStreamingAudioConfiguration(int profile);
    int setDirectCdnStreamingVideoConfiguration();
    int stopDirectCdnStreaming();
    int updateDirectCdnStreamingMediaOptions();

    // -------------------------------------------------------------------------
    // 320–322. Rhythm player — stubs
    // -------------------------------------------------------------------------
    int startRhythmPlayer(const std::string &sound1, const std::string &sound2);
    int stopRhythmPlayer();
    int configRhythmPlayer();

    // -------------------------------------------------------------------------
    // 323–324. takeSnapshot
    // -------------------------------------------------------------------------
    int takeSnapshot(agora::rtc::uid_t uid, const std::string &filePath);
    int takeSnapshot(agora::rtc::uid_t uid, const agora::media::SnapshotConfig &config);

    // -------------------------------------------------------------------------
    // 325. enableContentInspect — stub
    // -------------------------------------------------------------------------
    int enableContentInspect(bool enabled);

    // -------------------------------------------------------------------------
    // 326–327. Custom audio volume — stubs
    // -------------------------------------------------------------------------
    int adjustCustomAudioPublishVolume();
    int adjustCustomAudioPlayoutVolume();

    // -------------------------------------------------------------------------
    // 328. setCloudProxy
    // -------------------------------------------------------------------------
    int setCloudProxy(int proxyType);

    // -------------------------------------------------------------------------
    // 329. setLocalAccessPoint — stub
    // -------------------------------------------------------------------------
    int setLocalAccessPoint();

    // -------------------------------------------------------------------------
    // 330. setAdvancedAudioOptions — stub
    // -------------------------------------------------------------------------
    int setAdvancedAudioOptions();

    // -------------------------------------------------------------------------
    // 331. setAVSyncSource
    // -------------------------------------------------------------------------
    int setAVSyncSource(const std::string &channelId, agora::rtc::uid_t uid);

    // -------------------------------------------------------------------------
    // 332. enableVideoImageSource — stub
    // -------------------------------------------------------------------------
    int enableVideoImageSource(bool enable);

    // -------------------------------------------------------------------------
    // 333. getCurrentMonotonicTimeInMs
    // -------------------------------------------------------------------------
    int64_t getCurrentMonotonicTimeInMs();

    // -------------------------------------------------------------------------
    // 334. getNetworkType
    // -------------------------------------------------------------------------
    GetNetworkTypeResult getNetworkType();

    // -------------------------------------------------------------------------
    // 335. setParameters
    // -------------------------------------------------------------------------
    int setParameters(const std::string &parameters);

    // -------------------------------------------------------------------------
    // 336. startMediaRenderingTracing
    // -------------------------------------------------------------------------
    int startMediaRenderingTracing();

    // -------------------------------------------------------------------------
    // 337. enableInstantMediaRendering
    // -------------------------------------------------------------------------
    int enableInstantMediaRendering();

    // -------------------------------------------------------------------------
    // 338. getNtpWallTimeInMs
    // -------------------------------------------------------------------------
    uint64_t getNtpWallTimeInMs();

    // -------------------------------------------------------------------------
    // 339. isFeatureAvailableOnDevice — stub
    // -------------------------------------------------------------------------
    bool isFeatureAvailableOnDevice(int type);

    // -------------------------------------------------------------------------
    // 340. sendAudioMetadata
    // -------------------------------------------------------------------------
    int sendAudioMetadata(const std::string &metadata);

    // -------------------------------------------------------------------------
    // 341. queryHDRCapability — stub
    // -------------------------------------------------------------------------
    int queryHDRCapability(int videoModule);

private:
    agora::rtc::IRtcEngine *_engine{nullptr};
    std::shared_ptr<RtcEngineEventHandlerExBridge> _eventHandler;
    std::string _appId;
};
