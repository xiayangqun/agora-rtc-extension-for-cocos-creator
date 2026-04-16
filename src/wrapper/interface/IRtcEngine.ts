import {
    CHANNEL_PROFILE_TYPE,
    CLIENT_ROLE_TYPE,
    ClientRoleOptions,
    EchoTestConfiguration,
    LastmileProbeConfig,
    VideoEncoderConfiguration,
    BeautyOptions,
    FaceShapeBeautyOptions,
    FaceShapeAreaOptions,
    FACE_SHAPE_AREA,
    FilterEffectOptions,
    LowlightEnhanceOptions,
    VideoDenoiserOptions,
    ColorEnhanceOptions,
    VirtualBackgroundSource,
    SegmentationProperty,
    VideoCanvas,
    VIDEO_APPLICATION_SCENARIO_TYPE,
    VIDEO_QOE_PREFERENCE_TYPE,
    AUDIO_PROFILE_TYPE,
    AUDIO_SCENARIO_TYPE,
    VIDEO_STREAM_TYPE,
    VideoSubscriptionOptions,
    AUDIO_RECORDING_QUALITY_TYPE,
    AudioRecordingConfiguration,
    AudioEncodedFrameObserverConfig,
    RecorderStreamInfo,
    SpatialAudioParams,
    VOICE_BEAUTIFIER_PRESET,
    AUDIO_EFFECT_PRESET,
    VOICE_CONVERSION_PRESET,
    HEADPHONE_EQUALIZER_PRESET,
    VOICE_AI_TUNER_TYPE,
    VIDEO_MIRROR_MODE_TYPE,
    SimulcastStreamConfig,
    SIMULCAST_STREAM_MODE,
    SimulcastConfig,
    SenderOptions,
    CAMERA_STABILIZATION_MODE,
    AUDIO_SESSION_OPERATION_RESTRICTION,
    ScreenCaptureParameters,
    VIDEO_CONTENT_HINT,
    ScreenCaptureParameters2,
    FocalLengthInfo,
    SCREEN_SCENARIO_TYPE,
    LiveTranscoding,
    LocalTranscoderConfiguration,
    LocalAudioMixerConfiguration,
    VIDEO_ORIENTATION,
    CONNECTION_STATE_TYPE,
    DataStreamConfig,
    RdtStreamType,
    RtcImage,
    WatermarkOptions,
    WatermarkConfig,
    AUDIO_AINS_MODE,
    ChannelMediaRelayConfiguration,
    LocalAccessPointConfiguration,
    VIDEO_MODULE_TYPE,
    HDR_CAPABILITY,
    AUDIO_TRACK_TYPE,
    AudioTrackConfig,
    EncodedVideoFrameInfo,
    CodecCapInfo,
    DeviceInfo,
    EncryptionConfig,
    UserInfo,
    Rectangle,
} from "../types/AgoraBase";
import { LOG_LEVEL } from "../types/AgoraLog";
import {
    VIDEO_SOURCE_TYPE,
    VIDEO_MODULE_POSITION,
    AUDIO_FRAME_POSITION,
    MEDIA_SOURCE_TYPE,
    RENDER_MODE_TYPE,
    RAW_AUDIO_FRAME_OP_MODE_TYPE,
    SnapshotConfig,
    ContentInspectConfig,
    AudioFrame,
    EXTERNAL_VIDEO_SOURCE_TYPE,
    ExternalVideoFrame,
} from "../types/AgoraMediaBase";
import { AUDIO_MIXING_DUAL_MONO_MODE } from "../types/AgoraMediaEngine";
import { AgoraRhythmPlayerConfig } from "../types/AgoraRhythmPlayer";
import {
    Metadata,
    RtcEngineContext,
    ChannelMediaOptions,
    LeaveChannelOptions,
    CameraCapturerConfiguration,
    AUDIO_EQUALIZATION_BAND_FREQUENCY,
    AUDIO_REVERB_TYPE,
    STREAM_FALLBACK_OPTIONS,
    SIZE,
    ScreenCaptureSourceInfo,
    ScreenCaptureConfiguration,
    PRIORITY_TYPE,
    METADATA_TYPE,
    DirectCdnStreamingMediaOptions,
    CLOUD_PROXY_TYPE,
    AdvancedAudioOptions,
    ImageTrackOptions,
    FeatureType,
    ExtensionInfo,
} from "../types/AgoraRtcEngine";
import { IAudioDeviceManager } from "./IAudioDeviceManager";
import { IAudioEncodedFrameObserver } from "./IAudioEncodedFrameObserver";
import { IFaceInfoObserver } from "./IFaceInfoObserver";
import { IH265Transcoder } from "./IH265Transcoder";
import { ILocalSpatialAudioEngine } from "./ILocalSpatialAudioEngine";
import { IMediaPlayer } from "./IMediaPlayer";
import { IMediaPlayerCacheManager } from "./IMediaPlayerCacheManager";
import { IMediaRecorder } from "./IMediaRecorder";
import { IMusicContentCenter } from "./IMusicContentCenter";
import { IRtcEngineEventHandler } from "./IRtcEngineEventHandler";
import { IVideoDeviceManager } from "./IVideoDeviceManager";
import { IVideoEffectObject } from "./IVideoEffectObject";
import { IVideoFrameObserver } from "./IVideoFrameObserver";

export interface IRtcEngine {
    release(sync: boolean): void;

    setParameters(key: string, value: string): number;

    getAudioDeviceManager(): IAudioDeviceManager;

    getVideoDeviceManager(): IVideoDeviceManager;

    getMusicContentCenter(): IMusicContentCenter;

    getMediaPlayerCacheManager(): IMediaPlayerCacheManager;

    getLocalSpatialAudioEngine(): ILocalSpatialAudioEngine;

    getH265Transcoder(): IH265Transcoder;

    setLocalVideoDataSourcePosition(position: VIDEO_MODULE_POSITION): number;

    registerVideoFrameObserver(observer: IVideoFrameObserver): number;

    unregisterVideoFrameObserver(): number;

    unregisterVideoEncodedFrameObserver(): number;

    unregisterAudioFrameObserver(): number;

    unregisterFaceInfoObserver(): number;

    initialize(context: RtcEngineContext): number;

    getVersion(): { version: string; build: number };

    getErrorDescription(code: number): string;

    queryCodecCapability(): { errorCode: number; codecInfo: CodecCapInfo[] };

    queryDeviceScore(): number;

    preloadChannel(token: string, channelId: string, uid: number): number;

    preloadChannelWithUserAccount(token: string, channelId: string, userAccount: string): number;

    updatePreloadChannelToken(token: string): number;

    joinChannel(token: string, channelId: string, info: string, uid: number): number;

    joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): number;

    updateChannelMediaOptions(options: ChannelMediaOptions): number;

    leaveChannel(): number;

    leaveChannel(options: LeaveChannelOptions): number;

    renewToken(token: string): number;

    setChannelProfile(profile: CHANNEL_PROFILE_TYPE): number;

    setClientRole(role: CLIENT_ROLE_TYPE): number;

    setClientRole(role: CLIENT_ROLE_TYPE, options: ClientRoleOptions): number;

    startEchoTest(config: EchoTestConfiguration): number;

    stopEchoTest(): number;

    enableMultiCamera(enabled: boolean, config: CameraCapturerConfiguration): number;

    enableVideo(): number;

    disableVideo(): number;

    startPreview(): number;

    startPreview(sourceType: VIDEO_SOURCE_TYPE): number;

    stopPreview(): number;

    stopPreview(sourceType: VIDEO_SOURCE_TYPE): number;

    startLastmileProbeTest(config: LastmileProbeConfig): number;

    stopLastmileProbeTest(): number;

    setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number;

    setBeautyEffectOptions(enabled: boolean, options: BeautyOptions, type: MEDIA_SOURCE_TYPE): number;

    setFaceShapeBeautyOptions(enabled: boolean, options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): number;

    setFaceShapeAreaOptions(options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): number;

    getFaceShapeBeautyOptions(options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): number;

    getFaceShapeAreaOptions(shapeArea: FACE_SHAPE_AREA, options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): number;

    setFilterEffectOptions(enabled: boolean, options: FilterEffectOptions, type: MEDIA_SOURCE_TYPE): number;

    createVideoEffectObject(bundlePath: string, type: MEDIA_SOURCE_TYPE): IVideoEffectObject;

    destroyVideoEffectObject(videoEffectObject: IVideoEffectObject): number;

    setLowlightEnhanceOptions(enabled: boolean, options: LowlightEnhanceOptions, type: MEDIA_SOURCE_TYPE): number;

    setVideoDenoiserOptions(enabled: boolean, options: VideoDenoiserOptions, type: MEDIA_SOURCE_TYPE): number;

    setColorEnhanceOptions(enabled: boolean, options: ColorEnhanceOptions, type: MEDIA_SOURCE_TYPE): number;

    enableVirtualBackground(enabled: boolean, backgroundSource: VirtualBackgroundSource, segproperty: SegmentationProperty, type: MEDIA_SOURCE_TYPE): number;

    setupRemoteVideo(canvas: VideoCanvas): number;

    setupLocalVideo(canvas: VideoCanvas): number;

    setVideoScenario(scenarioType: VIDEO_APPLICATION_SCENARIO_TYPE): number;

    setVideoQoEPreference(qoePreference: VIDEO_QOE_PREFERENCE_TYPE): number;

    enableAudio(): number;

    disableAudio(): number;

    setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): number;

    setAudioProfile(profile: AUDIO_PROFILE_TYPE): number;

    setAudioScenario(scenario: AUDIO_SCENARIO_TYPE): number;

    enableLocalAudio(enabled: boolean): number;

    muteLocalAudioStream(mute: boolean): number;

    muteAllRemoteAudioStreams(mute: boolean): number;

    muteRemoteAudioStream(uid: number, mute: boolean): number;

    muteLocalVideoStream(mute: boolean): number;

    enableLocalVideo(enabled: boolean): number;

    muteAllRemoteVideoStreams(mute: boolean): number;

    setRemoteDefaultVideoStreamType(streamType: VIDEO_STREAM_TYPE): number;

    muteRemoteVideoStream(uid: number, mute: boolean): number;

    setRemoteVideoStreamType(uid: number, streamType: VIDEO_STREAM_TYPE): number;

    setRemoteVideoSubscriptionOptions(uid: number, options: VideoSubscriptionOptions): number;

    setSubscribeAudioBlocklist(uidList: number[], uidNumber: number): number;

    setSubscribeAudioAllowlist(uidList: number[], uidNumber: number): number;

    setSubscribeVideoBlocklist(uidList: number[], uidNumber: number): number;

    setSubscribeVideoAllowlist(uidList: number[], uidNumber: number): number;

    enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): number;

    startAudioRecording(filePath: string, quality: AUDIO_RECORDING_QUALITY_TYPE): number;

    startAudioRecording(filePath: string, sampleRate: number, quality: AUDIO_RECORDING_QUALITY_TYPE): number;

    startAudioRecording(config: AudioRecordingConfiguration): number;

    registerAudioEncodedFrameObserver(config: AudioEncodedFrameObserverConfig, observer: IAudioEncodedFrameObserver): number;

    stopAudioRecording(): number;

    createMediaPlayer(): IMediaPlayer;

    destroyMediaPlayer(media_player: IMediaPlayer): number;

    createMediaRecorder(info: RecorderStreamInfo): IMediaRecorder;

    destroyMediaRecorder(mediaRecorder: IMediaRecorder): number;

    startAudioMixing(filePath: string, loopback: boolean, cycle: number): number;

    startAudioMixing(filePath: string, loopback: boolean, cycle: number, startPos: number): number;

    stopAudioMixing(): number;

    pauseAudioMixing(): number;

    resumeAudioMixing(): number;

    selectAudioTrack(index: number): number;

    getAudioTrackCount(): number;

    adjustAudioMixingVolume(volume: number): number;

    adjustAudioMixingPublishVolume(volume: number): number;

    getAudioMixingPublishVolume(): number;

    adjustAudioMixingPlayoutVolume(volume: number): number;

    getAudioMixingPlayoutVolume(): number;

    getAudioMixingDuration(): number;

    getAudioMixingCurrentPosition(): number;

    setAudioMixingPosition(pos: number): number;

    setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): number;

    setAudioMixingPitch(pitch: number): number;

    setAudioMixingPlaybackSpeed(speed: number): number;

    getEffectsVolume(): number;

    setEffectsVolume(volume: number): number;

    preloadEffect(soundId: number, filePath: string, startPos: number): number;

    playEffect(soundId: number, filePath: string, loopCount: number, pitch: number, pan: number, gain: number, publish: boolean, startPos: number): number;

    playAllEffects(loopCount: number, pitch: number, pan: number, gain: number, publish: boolean): number;

    getVolumeOfEffect(soundId: number): number;

    setVolumeOfEffect(soundId: number, volume: number): number;

    pauseEffect(soundId: number): number;

    pauseAllEffects(): number;

    resumeEffect(soundId: number): number;

    resumeAllEffects(): number;

    stopEffect(soundId: number): number;

    stopAllEffects(): number;

    unloadEffect(soundId: number): number;

    unloadAllEffects(): number;

    getEffectDuration(filePath: string): number;

    setEffectPosition(soundId: number, pos: number): number;

    getEffectCurrentPosition(soundId: number): number;

    enableSoundPositionIndication(enabled: boolean): number;

    setRemoteVoicePosition(uid: number, pan: number, gain: number): number;

    enableSpatialAudio(enabled: boolean): number;

    setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): number;

    setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): number;

    setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): number;

    setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): number;

    setAudioEffectParameters(preset: AUDIO_EFFECT_PRESET, param1: number, param2: number): number;

    setVoiceBeautifierParameters(preset: VOICE_BEAUTIFIER_PRESET, param1: number, param2: number): number;

    setVoiceConversionParameters(preset: VOICE_CONVERSION_PRESET, param1: number, param2: number): number;

    setLocalVoicePitch(pitch: number): number;

    setLocalVoiceFormant(formantRatio: number): number;

    setLocalVoiceEqualization(bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY, bandGain: number): number;

    setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): number;

    setHeadphoneEQPreset(preset: HEADPHONE_EQUALIZER_PRESET): number;

    setHeadphoneEQParameters(lowGain: number, highGain: number): number;

    enableVoiceAITuner(enabled: boolean, type: VOICE_AI_TUNER_TYPE): number;

    setLogFile(filePath: string): number;

    setLogFilter(filter: number): number;

    setLogLevel(level: LOG_LEVEL): number;

    setLogFileSize(fileSizeInKBytes: number): number;

    uploadLogFile(requestId: string): number;

    writeLog(level: LOG_LEVEL, fmt: string): number;

    setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): number;

    setRemoteRenderMode(uid: number, renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): number;

    setLocalRenderTargetFps(sourceType: VIDEO_SOURCE_TYPE, targetFps: number): number;

    setRemoteRenderTargetFps(targetFps: number): number;

    setLocalRenderMode(renderMode: RENDER_MODE_TYPE): number;

    setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): number;

    enableDualStreamMode(enabled: boolean): number;

    enableDualStreamMode(enabled: boolean, streamConfig: SimulcastStreamConfig): number;

    setDualStreamMode(mode: SIMULCAST_STREAM_MODE): number;

    setSimulcastConfig(simulcastConfig: SimulcastConfig): number;

    setDualStreamMode(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig): number;

    enableCustomAudioLocalPlayback(trackId: number, enabled: boolean): number;

    setRecordingAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number;

    setPlaybackAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number;

    setMixedAudioFrameParameters(sampleRate: number, channel: number, samplesPerCall: number): number;

    setEarMonitoringAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number;

    setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number): number;

    setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number, samplesPerCall: number): number;

    enableAudioSpectrumMonitor(intervalInMS: number): number;

    disableAudioSpectrumMonitor(): number;

    adjustRecordingSignalVolume(volume: number): number;

    muteRecordingSignal(mute: boolean): number;

    adjustPlaybackSignalVolume(volume: number): number;

    adjustUserPlaybackSignalVolume(uid: number, volume: number): number;

    setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): number;

    setHighPriorityUserList(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS): number;

    enableExtension(provider: string, extension: string, extensionInfo: ExtensionInfo, enable: boolean): number;

    setExtensionProperty(provider: string, extension: string, extensionInfo: ExtensionInfo, key: string, value: string): number;

    getExtensionProperty(provider: string, extension: string, extensionInfo: ExtensionInfo, key: string, buf_len: number): { errorCode: number; value: string };

    enableLoopbackRecording(enabled: boolean, deviceName: string): number;

    adjustLoopbackSignalVolume(volume: number): number;

    getLoopbackRecordingVolume(): number;

    enableInEarMonitoring(enabled: boolean, includeAudioFilters: number): number;

    setInEarMonitoringVolume(volume: number): number;

    loadExtensionProvider(path: string, unload_after_use: boolean): number;

    setExtensionProviderProperty(provider: string, key: string, value: string): number;

    registerExtension(provider: string, extension: string, type: MEDIA_SOURCE_TYPE): number;

    enableExtension(provider: string, extension: string, enable: boolean, type: MEDIA_SOURCE_TYPE): number;

    setExtensionProperty(provider: string, extension: string, key: string, value: string, type: MEDIA_SOURCE_TYPE): number;

    getExtensionProperty(provider: string, extension: string, key: string, buf_len: number, type: MEDIA_SOURCE_TYPE): { errorCode: number; value: number };

    setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number;

    createCustomVideoTrack(): number;

    createCustomEncodedVideoTrack(sender_option: SenderOptions): number;

    destroyCustomVideoTrack(video_track_id: number): number;

    destroyCustomEncodedVideoTrack(video_track_id: number): number;

    switchCamera(): number;

    isCameraZoomSupported(): boolean;

    isCameraFaceDetectSupported(): boolean;

    isCameraTorchSupported(): boolean;

    isCameraFocusSupported(): boolean;

    isCameraAutoFocusFaceModeSupported(): boolean;

    setCameraZoomFactor(factor: number): number;

    enableFaceDetection(enabled: boolean): number;

    getCameraMaxZoomFactor(): number;

    setCameraFocusPositionInPreview(positionX: number, positionY: number): number;

    setCameraTorchOn(isOn: boolean): number;

    setCameraAutoFocusFaceModeEnabled(enabled: boolean): number;

    isCameraExposurePositionSupported(): boolean;

    setCameraExposurePosition(positionXinView: number, positionYinView: number): number;

    isCameraExposureSupported(): boolean;

    setCameraExposureFactor(factor: number): number;

    isCameraAutoExposureFaceModeSupported(): boolean;

    setCameraAutoExposureFaceModeEnabled(enabled: boolean): number;

    setCameraStabilizationMode(mode: CAMERA_STABILIZATION_MODE): number;

    setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): number;

    setEnableSpeakerphone(speakerOn: boolean): number;

    isSpeakerphoneEnabled(): boolean;

    setRouteInCommunicationMode(route: number): number;

    isCameraCenterStageSupported(): boolean;

    enableCameraCenterStage(enabled: boolean): number;

    getScreenCaptureSources(thumbSize: SIZE, iconSize: SIZE, includeScreen: boolean): ScreenCaptureSourceInfo[];

    setAudioSessionOperationRestriction(restriction: AUDIO_SESSION_OPERATION_RESTRICTION): number;

    startScreenCaptureByDisplayId(displayId: number, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number;

    startScreenCaptureByScreenRect(screenRect: Rectangle, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number;

    getAudioDeviceInfo(): { errorCode: number; deviceInfo: DeviceInfo };

    startScreenCaptureByWindowId(windowId: number, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number;

    setScreenCaptureContentHint(contentHint: VIDEO_CONTENT_HINT): number;

    updateScreenCaptureRegion(regionRect: Rectangle): number;

    updateScreenCaptureParameters(captureParams: ScreenCaptureParameters): number;

    startScreenCapture(captureParams: ScreenCaptureParameters2): number;

    updateScreenCapture(captureParams: ScreenCaptureParameters2): number;

    queryScreenCaptureCapability(): number;

    queryCameraFocalLengthCapability(focalLengthInfos: FocalLengthInfo[], size: number): number;

    setExternalMediaProjection(mediaProjection: unknown): number;

    setScreenCaptureScenario(screenScenario: SCREEN_SCENARIO_TYPE): number;

    stopScreenCapture(): number;

    getCallId(callId: string): number;

    rate(callId: string, rating: number, description: string): number;

    complain(callId: string, description: string): number;

    startRtmpStreamWithoutTranscoding(url: string): number;

    startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): number;

    updateRtmpTranscoding(transcoding: LiveTranscoding): number;

    startLocalVideoTranscoder(config: LocalTranscoderConfiguration): number;

    updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): number;

    stopRtmpStream(url: string): number;

    stopLocalVideoTranscoder(): number;

    startLocalAudioMixer(config: LocalAudioMixerConfiguration): number;

    updateLocalAudioMixerConfiguration(config: LocalAudioMixerConfiguration): number;

    stopLocalAudioMixer(): number;

    startCameraCapture(sourceType: VIDEO_SOURCE_TYPE, config: CameraCapturerConfiguration): number;

    stopCameraCapture(sourceType: VIDEO_SOURCE_TYPE): number;

    setCameraDeviceOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): number;

    setScreenCaptureOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): number;

    startScreenCapture(sourceType: VIDEO_SOURCE_TYPE, config: ScreenCaptureConfiguration): number;

    stopScreenCapture(sourceType: VIDEO_SOURCE_TYPE): number;

    getConnectionState(): CONNECTION_STATE_TYPE;

    setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): number;

    enableEncryption(enabled: boolean, config: EncryptionConfig): number;

    createDataStream(streamId: number, reliable: boolean, ordered: boolean): number;

    createDataStream(streamId: number, config: DataStreamConfig): number;

    sendStreamMessage(streamId: number, data: Uint8Array, length: number): number;

    sendRdtMessage(uid: number, type: RdtStreamType, data: string, length: number): number;

    sendMediaControlMessage(uid: number, data: string, length: number): number;

    addVideoWatermark(watermark: RtcImage): number;

    addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): number;

    addVideoWatermark(configs: WatermarkConfig): number;

    removeVideoWatermark(id: string): number;

    clearVideoWatermarks(): number;

    pauseAudio(): number;

    resumeAudio(): number;

    enableWebSdkInteroperability(enabled: boolean): number;

    sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): number;

    startAudioFrameDump(channel_id: string, uid: number, location: string, uuid: string, passwd: string, duration_ms: number, auto_upload: boolean): number;

    stopAudioFrameDump(channel_id: string, uid: number, location: string): number;

    setAINSMode(enabled: boolean, mode: AUDIO_AINS_MODE): number;

    registerLocalUserAccount(appId: string, userAccount: string): number;

    joinChannelWithUserAccount(token: string, channelId: string, userAccount: string): number;

    joinChannelWithUserAccount(token: string, channelId: string, userAccount: string, options: ChannelMediaOptions): number;

    getUserInfoByUserAccount(userAccount: string): { errorCode: number; userInfo: UserInfo };

    getUserInfoByUid(uid: number): { errorCode: number; userInfo: UserInfo };

    startOrUpdateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): number;

    stopChannelMediaRelay(): number;

    pauseAllChannelMediaRelay(): number;

    resumeAllChannelMediaRelay(): number;

    setDirectCdnStreamingAudioConfiguration(profile: AUDIO_PROFILE_TYPE): number;

    setDirectCdnStreamingVideoConfiguration(config: VideoEncoderConfiguration): number;

    startDirectCdnStreaming(publishUrl: string, options: DirectCdnStreamingMediaOptions): number;

    stopDirectCdnStreaming(): number;

    updateDirectCdnStreamingMediaOptions(options: DirectCdnStreamingMediaOptions): number;

    startRhythmPlayer(sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): number;

    stopRhythmPlayer(): number;

    configRhythmPlayer(config: AgoraRhythmPlayerConfig): number;

    takeSnapshot(uid: number, filePath: string): number;

    takeSnapshot(uid: number, config: SnapshotConfig): number;

    enableContentInspect(enabled: boolean, config: ContentInspectConfig): number;

    adjustCustomAudioPublishVolume(trackId: number, volume: number): number;

    adjustCustomAudioPlayoutVolume(trackId: number, volume: number): number;

    setCloudProxy(proxyType: CLOUD_PROXY_TYPE): number;

    setLocalAccessPoint(config: LocalAccessPointConfiguration): number;

    setAdvancedAudioOptions(options: AdvancedAudioOptions, sourceType: number): number;

    setAVSyncSource(channelId: string, uid: number): number;

    enableVideoImageSource(enable: boolean, options: ImageTrackOptions): number;

    getCurrentMonotonicTimeInMs(): number;

    getNetworkType(): number;

    setParameters(parameters: string): number;

    startMediaRenderingTracing(): number;

    enableInstantMediaRendering(): number;

    getNtpWallTimeInMs(): number;

    isFeatureAvailableOnDevice(type: FeatureType): boolean;

    sendAudioMetadata(metadata: Uint8Array, length: number): number;

    queryHDRCapability(videoModule: VIDEO_MODULE_TYPE, capability: HDR_CAPABILITY): number;

    registerFaceInfoObserver(observer: IFaceInfoObserver): number;

    pushAudioFrame(frame: AudioFrame, trackId: number): number;

    pullAudioFrame(frame: AudioFrame): number;

    setExternalVideoSource(enabled: boolean, useTexture: boolean, sourceType: EXTERNAL_VIDEO_SOURCE_TYPE, encodedVideoOption: SenderOptions): number;

    setExternalRemoteEglContext(eglContext: unknown): number;

    setExternalAudioSource(enabled: boolean, sampleRate: number, channels: number, localPlayback: boolean, publish: boolean): number;

    createCustomAudioTrack(trackType: AUDIO_TRACK_TYPE, config: AudioTrackConfig): number;

    destroyCustomAudioTrack(trackId: number): number;

    setExternalAudioSink(enabled: boolean, sampleRate: number, channels: number): number;

    pushVideoFrame(frame: ExternalVideoFrame, videoTrackId: number): number;

    pushEncodedVideoImage(imageBuffer: Uint8Array, length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo, videoTrackId: number): number;
}
