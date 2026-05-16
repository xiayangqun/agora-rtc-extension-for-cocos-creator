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
    MEDIA_SOURCE_TYPE,
    RENDER_MODE_TYPE,
    RAW_AUDIO_FRAME_OP_MODE_TYPE,
    SnapshotConfig,
    ContentInspectConfig,
} from "../types/AgoraMediaBase";
import { AUDIO_MIXING_DUAL_MONO_MODE } from "../types/AgoraMediaEngine";
import { AgoraRhythmPlayerConfig } from "../types/AgoraRhythmPlayer";
import {
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
    DirectCdnStreamingMediaOptions,
    CLOUD_PROXY_TYPE,
    AdvancedAudioOptions,
    ImageTrackOptions,
    FeatureType,
    ExtensionInfo,
} from "../types/AgoraRtcEngine";
import { IAudioDeviceManager } from "./IAudioDeviceManager";
import { IH265Transcoder } from "./IH265Transcoder";
import { ILocalSpatialAudioEngine } from "./ILocalSpatialAudioEngine";
import { IMediaPlayer } from "./IMediaPlayer";
import { IMediaPlayerCacheManager } from "./IMediaPlayerCacheManager";
import { IMediaRecorder } from "./IMediaRecorder";
import { IMusicContentCenter } from "./IMusicContentCenter";
import { IVideoDeviceManager } from "./IVideoDeviceManager";
import { IVideoEffectObject } from "./IVideoEffectObject";

import { _decorator } from "cc";

export interface IRtcEngine {
    release(sync: boolean): Promise<void>;

    getAudioDeviceManager(): Promise<IAudioDeviceManager>;

    getVideoDeviceManager(): Promise<IVideoDeviceManager>;

    getMusicContentCenter(): Promise<IMusicContentCenter>;

    getMediaPlayerCacheManager(): Promise<IMediaPlayerCacheManager>;

    getLocalSpatialAudioEngine(): Promise<ILocalSpatialAudioEngine>;

    getH265Transcoder(): Promise<IH265Transcoder>;

    setLocalVideoDataSourcePosition(position: VIDEO_MODULE_POSITION): Promise<number>;

    initialize(context: RtcEngineContext): Promise<number>;

    getVersion(): Promise<{ version: string; build: number }>;

    getErrorDescription(code: number): Promise<string>;

    queryCodecCapability(): Promise<{ errorCode: number; codecInfo: CodecCapInfo[] }>;

    queryDeviceScore(): Promise<number>;

    preloadChannel(token: string, channelId: string, uid: number): Promise<number>;

    preloadChannelWithUserAccount(token: string, channelId: string, userAccount: string): Promise<number>;

    updatePreloadChannelToken(token: string): Promise<number>;

    joinChannel(token: string, channelId: string, info: string, uid: number): Promise<number>;

    joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): Promise<number>;

    updateChannelMediaOptions(options: ChannelMediaOptions): Promise<number>;

    leaveChannel(): Promise<number>;

    leaveChannel(options: LeaveChannelOptions): Promise<number>;

    renewToken(token: string): Promise<number>;

    setChannelProfile(profile: CHANNEL_PROFILE_TYPE): Promise<number>;

    setClientRole(role: CLIENT_ROLE_TYPE): Promise<number>;

    setClientRole(role: CLIENT_ROLE_TYPE, options: ClientRoleOptions): Promise<number>;

    startEchoTest(config: EchoTestConfiguration): Promise<number>;

    stopEchoTest(): Promise<number>;

    enableMultiCamera(enabled: boolean, config: CameraCapturerConfiguration): Promise<number>;

    enableVideo(): Promise<number>;

    disableVideo(): Promise<number>;

    startPreview(): Promise<number>;

    startPreview(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;

    stopPreview(): Promise<number>;

    stopPreview(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;

    startLastmileProbeTest(config: LastmileProbeConfig): Promise<number>;

    stopLastmileProbeTest(): Promise<number>;

    setVideoEncoderConfiguration(config: VideoEncoderConfiguration): Promise<number>;

    setBeautyEffectOptions(enabled: boolean, options: BeautyOptions, type: MEDIA_SOURCE_TYPE): Promise<number>;

    setFaceShapeBeautyOptions(
        enabled: boolean,
        options: FaceShapeBeautyOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;

    setFaceShapeAreaOptions(options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): Promise<number>;

    getFaceShapeBeautyOptions(options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): Promise<number>;

    getFaceShapeAreaOptions(
        shapeArea: FACE_SHAPE_AREA,
        options: FaceShapeAreaOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;

    setFilterEffectOptions(enabled: boolean, options: FilterEffectOptions, type: MEDIA_SOURCE_TYPE): Promise<number>;

    createVideoEffectObject(bundlePath: string, type: MEDIA_SOURCE_TYPE): Promise<IVideoEffectObject>;

    destroyVideoEffectObject(videoEffectObject: IVideoEffectObject): Promise<number>;

    setLowlightEnhanceOptions(
        enabled: boolean,
        options: LowlightEnhanceOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;

    setVideoDenoiserOptions(enabled: boolean, options: VideoDenoiserOptions, type: MEDIA_SOURCE_TYPE): Promise<number>;

    setColorEnhanceOptions(enabled: boolean, options: ColorEnhanceOptions, type: MEDIA_SOURCE_TYPE): Promise<number>;

    enableVirtualBackground(
        enabled: boolean,
        backgroundSource: VirtualBackgroundSource,
        segproperty: SegmentationProperty,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;

    setupRemoteVideo(
        canvas: VideoCanvas,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<number>;

    setupLocalVideo(
        canvas: VideoCanvas,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<number>;

    setVideoScenario(scenarioType: VIDEO_APPLICATION_SCENARIO_TYPE): Promise<number>;

    setVideoQoEPreference(qoePreference: VIDEO_QOE_PREFERENCE_TYPE): Promise<number>;

    enableAudio(): Promise<number>;

    disableAudio(): Promise<number>;

    setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): Promise<number>;

    setAudioProfile(profile: AUDIO_PROFILE_TYPE): Promise<number>;

    setAudioScenario(scenario: AUDIO_SCENARIO_TYPE): Promise<number>;

    enableLocalAudio(enabled: boolean): Promise<number>;

    muteLocalAudioStream(mute: boolean): Promise<number>;

    muteAllRemoteAudioStreams(mute: boolean): Promise<number>;

    muteRemoteAudioStream(uid: number, mute: boolean): Promise<number>;

    muteLocalVideoStream(mute: boolean): Promise<number>;

    enableLocalVideo(enabled: boolean): Promise<number>;

    muteAllRemoteVideoStreams(mute: boolean): Promise<number>;

    setRemoteDefaultVideoStreamType(streamType: VIDEO_STREAM_TYPE): Promise<number>;

    muteRemoteVideoStream(uid: number, mute: boolean): Promise<number>;

    setRemoteVideoStreamType(uid: number, streamType: VIDEO_STREAM_TYPE): Promise<number>;

    setRemoteVideoSubscriptionOptions(uid: number, options: VideoSubscriptionOptions): Promise<number>;

    setSubscribeAudioBlocklist(uidList: number[], uidNumber: number): Promise<number>;

    setSubscribeAudioAllowlist(uidList: number[], uidNumber: number): Promise<number>;

    setSubscribeVideoBlocklist(uidList: number[], uidNumber: number): Promise<number>;

    setSubscribeVideoAllowlist(uidList: number[], uidNumber: number): Promise<number>;

    enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): Promise<number>;

    startAudioRecording(filePath: string, quality: AUDIO_RECORDING_QUALITY_TYPE): Promise<number>;

    startAudioRecording(filePath: string, sampleRate: number, quality: AUDIO_RECORDING_QUALITY_TYPE): Promise<number>;

    startAudioRecording(config: AudioRecordingConfiguration): Promise<number>;

    stopAudioRecording(): Promise<number>;

    createMediaPlayer(): Promise<IMediaPlayer>;

    destroyMediaPlayer(media_player: IMediaPlayer): Promise<number>;

    createMediaRecorder(info: RecorderStreamInfo): Promise<IMediaRecorder>;

    destroyMediaRecorder(mediaRecorder: IMediaRecorder): Promise<number>;

    startAudioMixing(filePath: string, loopback: boolean, cycle: number): Promise<number>;

    startAudioMixing(filePath: string, loopback: boolean, cycle: number, startPos: number): Promise<number>;

    stopAudioMixing(): Promise<number>;

    pauseAudioMixing(): Promise<number>;

    resumeAudioMixing(): Promise<number>;

    selectAudioTrack(index: number): Promise<number>;

    getAudioTrackCount(): Promise<number>;

    adjustAudioMixingVolume(volume: number): Promise<number>;

    adjustAudioMixingPublishVolume(volume: number): Promise<number>;

    getAudioMixingPublishVolume(): Promise<number>;

    adjustAudioMixingPlayoutVolume(volume: number): Promise<number>;

    getAudioMixingPlayoutVolume(): Promise<number>;

    getAudioMixingDuration(): Promise<number>;

    getAudioMixingCurrentPosition(): Promise<number>;

    setAudioMixingPosition(pos: number): Promise<number>;

    setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): Promise<number>;

    setAudioMixingPitch(pitch: number): Promise<number>;

    setAudioMixingPlaybackSpeed(speed: number): Promise<number>;

    getEffectsVolume(): Promise<number>;

    setEffectsVolume(volume: number): Promise<number>;

    preloadEffect(soundId: number, filePath: string, startPos: number): Promise<number>;

    playEffect(
        soundId: number,
        filePath: string,
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
        startPos: number,
    ): Promise<number>;

    playAllEffects(loopCount: number, pitch: number, pan: number, gain: number, publish: boolean): Promise<number>;

    getVolumeOfEffect(soundId: number): Promise<number>;

    setVolumeOfEffect(soundId: number, volume: number): Promise<number>;

    pauseEffect(soundId: number): Promise<number>;

    pauseAllEffects(): Promise<number>;

    resumeEffect(soundId: number): Promise<number>;

    resumeAllEffects(): Promise<number>;

    stopEffect(soundId: number): Promise<number>;

    stopAllEffects(): Promise<number>;

    unloadEffect(soundId: number): Promise<number>;

    unloadAllEffects(): Promise<number>;

    getEffectDuration(filePath: string): Promise<number>;

    setEffectPosition(soundId: number, pos: number): Promise<number>;

    getEffectCurrentPosition(soundId: number): Promise<number>;

    enableSoundPositionIndication(enabled: boolean): Promise<number>;

    setRemoteVoicePosition(uid: number, pan: number, gain: number): Promise<number>;

    enableSpatialAudio(enabled: boolean): Promise<number>;

    setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): Promise<number>;

    setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): Promise<number>;

    setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): Promise<number>;

    setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): Promise<number>;

    setAudioEffectParameters(preset: AUDIO_EFFECT_PRESET, param1: number, param2: number): Promise<number>;

    setVoiceBeautifierParameters(preset: VOICE_BEAUTIFIER_PRESET, param1: number, param2: number): Promise<number>;

    setVoiceConversionParameters(preset: VOICE_CONVERSION_PRESET, param1: number, param2: number): Promise<number>;

    setLocalVoicePitch(pitch: number): Promise<number>;

    setLocalVoiceFormant(formantRatio: number): Promise<number>;

    setLocalVoiceEqualization(bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY, bandGain: number): Promise<number>;

    setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): Promise<number>;

    setHeadphoneEQPreset(preset: HEADPHONE_EQUALIZER_PRESET): Promise<number>;

    setHeadphoneEQParameters(lowGain: number, highGain: number): Promise<number>;

    enableVoiceAITuner(enabled: boolean, type: VOICE_AI_TUNER_TYPE): Promise<number>;

    setLogFile(filePath: string): Promise<number>;

    setLogFilter(filter: number): Promise<number>;

    setLogLevel(level: LOG_LEVEL): Promise<number>;

    setLogFileSize(fileSizeInKBytes: number): Promise<number>;

    uploadLogFile(): Promise<{ requestId: string; errorCode: number }>;

    writeLog(level: LOG_LEVEL, fmt: string): Promise<number>;

    setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number>;

    setRemoteRenderMode(uid: number, renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number>;

    setLocalRenderTargetFps(sourceType: VIDEO_SOURCE_TYPE, targetFps: number): Promise<number>;

    setRemoteRenderTargetFps(targetFps: number): Promise<number>;

    setLocalRenderMode(renderMode: RENDER_MODE_TYPE): Promise<number>;

    setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number>;

    enableDualStreamMode(enabled: boolean): Promise<number>;

    enableDualStreamMode(enabled: boolean, streamConfig: SimulcastStreamConfig): Promise<number>;

    setDualStreamMode(mode: SIMULCAST_STREAM_MODE): Promise<number>;

    setSimulcastConfig(simulcastConfig: SimulcastConfig): Promise<number>;

    setDualStreamMode(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig): Promise<number>;

    setRecordingAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number>;

    setPlaybackAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number>;

    setMixedAudioFrameParameters(sampleRate: number, channel: number, samplesPerCall: number): Promise<number>;

    setEarMonitoringAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number>;

    setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number): Promise<number>;

    setPlaybackAudioFrameBeforeMixingParameters(
        sampleRate: number,
        channel: number,
        samplesPerCall: number,
    ): Promise<number>;

    enableAudioSpectrumMonitor(intervalInMS: number): Promise<number>;

    disableAudioSpectrumMonitor(): Promise<number>;

    adjustRecordingSignalVolume(volume: number): Promise<number>;

    muteRecordingSignal(mute: boolean): Promise<number>;

    adjustPlaybackSignalVolume(volume: number): Promise<number>;

    adjustUserPlaybackSignalVolume(uid: number, volume: number): Promise<number>;

    setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): Promise<number>;

    setHighPriorityUserList(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS): Promise<number>;

    enableExtension(
        provider: string,
        extension: string,
        extensionInfo: ExtensionInfo,
        enable: boolean,
    ): Promise<number>;

    setExtensionProperty(
        provider: string,
        extension: string,
        extensionInfo: ExtensionInfo,
        key: string,
        value: string,
    ): Promise<number>;

    getExtensionProperty(
        provider: string,
        extension: string,
        extensionInfo: ExtensionInfo,
        key: string,
        buf_len: number,
    ): Promise<{ errorCode: number; value: string }>;

    enableLoopbackRecording(enabled: boolean, deviceName: string): Promise<number>;

    adjustLoopbackSignalVolume(volume: number): Promise<number>;

    getLoopbackRecordingVolume(): Promise<number>;

    enableInEarMonitoring(enabled: boolean, includeAudioFilters: number): Promise<number>;

    setInEarMonitoringVolume(volume: number): Promise<number>;

    loadExtensionProvider(path: string, unload_after_use: boolean): Promise<number>;

    setExtensionProviderProperty(provider: string, key: string, value: string): Promise<number>;

    registerExtension(provider: string, extension: string, type: MEDIA_SOURCE_TYPE): Promise<number>;

    enableExtension(provider: string, extension: string, enable: boolean, type: MEDIA_SOURCE_TYPE): Promise<number>;

    setExtensionProperty(
        provider: string,
        extension: string,
        key: string,
        value: string,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;

    getExtensionProperty(
        provider: string,
        extension: string,
        key: string,
        buf_len: number,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<{ errorCode: number; value: number }>;

    setCameraCapturerConfiguration(config: CameraCapturerConfiguration): Promise<number>;

    createCustomVideoTrack(): Promise<number>;

    createCustomEncodedVideoTrack(sender_option: SenderOptions): Promise<number>;

    destroyCustomVideoTrack(video_track_id: number): Promise<number>;

    destroyCustomEncodedVideoTrack(video_track_id: number): Promise<number>;

    switchCamera(): Promise<number>;

    isCameraZoomSupported(): Promise<boolean>;

    isCameraFaceDetectSupported(): Promise<boolean>;

    isCameraTorchSupported(): Promise<boolean>;

    isCameraFocusSupported(): Promise<boolean>;

    isCameraAutoFocusFaceModeSupported(): Promise<boolean>;

    setCameraZoomFactor(factor: number): Promise<number>;

    enableFaceDetection(enabled: boolean): Promise<number>;

    getCameraMaxZoomFactor(): Promise<number>;

    setCameraFocusPositionInPreview(positionX: number, positionY: number): Promise<number>;

    setCameraTorchOn(isOn: boolean): Promise<number>;

    setCameraAutoFocusFaceModeEnabled(enabled: boolean): Promise<number>;

    isCameraExposurePositionSupported(): Promise<boolean>;

    setCameraExposurePosition(positionXinView: number, positionYinView: number): Promise<number>;

    isCameraExposureSupported(): Promise<boolean>;

    setCameraExposureFactor(factor: number): Promise<number>;

    isCameraAutoExposureFaceModeSupported(): Promise<boolean>;

    setCameraAutoExposureFaceModeEnabled(enabled: boolean): Promise<number>;

    setCameraStabilizationMode(mode: CAMERA_STABILIZATION_MODE): Promise<number>;

    setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): Promise<number>;

    setEnableSpeakerphone(speakerOn: boolean): Promise<number>;

    isSpeakerphoneEnabled(): Promise<boolean>;

    setRouteInCommunicationMode(route: number): Promise<number>;

    isCameraCenterStageSupported(): Promise<boolean>;

    enableCameraCenterStage(enabled: boolean): Promise<number>;

    getScreenCaptureSources(
        thumbSize: SIZE,
        iconSize: SIZE,
        includeScreen: boolean,
    ): Promise<ScreenCaptureSourceInfo[]>;

    setAudioSessionOperationRestriction(restriction: AUDIO_SESSION_OPERATION_RESTRICTION): Promise<number>;

    startScreenCaptureByDisplayId(
        displayId: number,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number>;

    startScreenCaptureByScreenRect(
        screenRect: Rectangle,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number>;

    getAudioDeviceInfo(): Promise<{ errorCode: number; deviceInfo: DeviceInfo }>;

    startScreenCaptureByWindowId(
        windowId: number,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number>;

    setScreenCaptureContentHint(contentHint: VIDEO_CONTENT_HINT): Promise<number>;

    updateScreenCaptureRegion(regionRect: Rectangle): Promise<number>;

    updateScreenCaptureParameters(captureParams: ScreenCaptureParameters): Promise<number>;

    startScreenCapture(captureParams: ScreenCaptureParameters2): Promise<number>;

    updateScreenCapture(captureParams: ScreenCaptureParameters2): Promise<number>;

    queryScreenCaptureCapability(): Promise<number>;

    queryCameraFocalLengthCapability(focalLengthInfos: FocalLengthInfo[], size: number): Promise<number>;

    setExternalMediaProjection(mediaProjection: unknown): Promise<number>;

    setScreenCaptureScenario(screenScenario: SCREEN_SCENARIO_TYPE): Promise<number>;

    stopScreenCapture(): Promise<number>;

    getCallId(callId: string): Promise<number>;

    rate(callId: string, rating: number, description: string): Promise<number>;

    complain(callId: string, description: string): Promise<number>;

    startRtmpStreamWithoutTranscoding(url: string): Promise<number>;

    startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): Promise<number>;

    updateRtmpTranscoding(transcoding: LiveTranscoding): Promise<number>;

    startLocalVideoTranscoder(config: LocalTranscoderConfiguration): Promise<number>;

    updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): Promise<number>;

    stopRtmpStream(url: string): Promise<number>;

    stopLocalVideoTranscoder(): Promise<number>;

    startLocalAudioMixer(config: LocalAudioMixerConfiguration): Promise<number>;

    updateLocalAudioMixerConfiguration(config: LocalAudioMixerConfiguration): Promise<number>;

    stopLocalAudioMixer(): Promise<number>;

    startCameraCapture(sourceType: VIDEO_SOURCE_TYPE, config: CameraCapturerConfiguration): Promise<number>;

    stopCameraCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;

    setCameraDeviceOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number>;

    setScreenCaptureOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number>;

    startScreenCapture(sourceType: VIDEO_SOURCE_TYPE, config: ScreenCaptureConfiguration): Promise<number>;

    stopScreenCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;

    getConnectionState(): Promise<CONNECTION_STATE_TYPE>;

    setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): Promise<number>;

    enableEncryption(enabled: boolean, config: EncryptionConfig): Promise<number>;

    createDataStream(reliable: boolean, ordered: boolean): Promise<{ streamId: number; errorCode: number }>;

    createDataStream(config: DataStreamConfig): Promise<{ streamId: number; errorCode: number }>;

    sendStreamMessage(streamId: number, data: ArrayBuffer, length: number): Promise<number>;

    sendRdtMessage(uid: number, type: RdtStreamType, data: string, length: number): Promise<number>;

    sendMediaControlMessage(uid: number, data: string, length: number): Promise<number>;

    addVideoWatermark(watermark: RtcImage): Promise<number>;

    addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): Promise<number>;

    addVideoWatermark(configs: WatermarkConfig): Promise<number>;

    removeVideoWatermark(id: string): Promise<number>;

    clearVideoWatermarks(): Promise<number>;

    pauseAudio(): Promise<number>;

    resumeAudio(): Promise<number>;

    enableWebSdkInteroperability(enabled: boolean): Promise<number>;

    sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): Promise<number>;

    startAudioFrameDump(
        channel_id: string,
        uid: number,
        location: string,
        uuid: string,
        passwd: string,
        duration_ms: number,
        auto_upload: boolean,
    ): Promise<number>;

    stopAudioFrameDump(channel_id: string, uid: number, location: string): Promise<number>;

    setAINSMode(enabled: boolean, mode: AUDIO_AINS_MODE): Promise<number>;

    registerLocalUserAccount(appId: string, userAccount: string): Promise<number>;

    joinChannelWithUserAccount(token: string, channelId: string, userAccount: string): Promise<number>;

    joinChannelWithUserAccount(
        token: string,
        channelId: string,
        userAccount: string,
        options: ChannelMediaOptions,
    ): Promise<number>;

    getUserInfoByUserAccount(userAccount: string): Promise<{ errorCode: number; userInfo: UserInfo }>;

    getUserInfoByUid(uid: number): Promise<{ errorCode: number; userInfo: UserInfo }>;

    startOrUpdateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): Promise<number>;

    stopChannelMediaRelay(): Promise<number>;

    pauseAllChannelMediaRelay(): Promise<number>;

    resumeAllChannelMediaRelay(): Promise<number>;

    setDirectCdnStreamingAudioConfiguration(profile: AUDIO_PROFILE_TYPE): Promise<number>;

    setDirectCdnStreamingVideoConfiguration(config: VideoEncoderConfiguration): Promise<number>;

    startDirectCdnStreaming(publishUrl: string, options: DirectCdnStreamingMediaOptions): Promise<number>;

    stopDirectCdnStreaming(): Promise<number>;

    updateDirectCdnStreamingMediaOptions(options: DirectCdnStreamingMediaOptions): Promise<number>;

    startRhythmPlayer(sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): Promise<number>;

    stopRhythmPlayer(): Promise<number>;

    configRhythmPlayer(config: AgoraRhythmPlayerConfig): Promise<number>;

    takeSnapshot(uid: number, filePath: string): Promise<number>;

    takeSnapshot(uid: number, config: SnapshotConfig): Promise<number>;

    enableContentInspect(enabled: boolean, config: ContentInspectConfig): Promise<number>;

    adjustCustomAudioPublishVolume(trackId: number, volume: number): Promise<number>;

    adjustCustomAudioPlayoutVolume(trackId: number, volume: number): Promise<number>;

    setCloudProxy(proxyType: CLOUD_PROXY_TYPE): Promise<number>;

    setLocalAccessPoint(config: LocalAccessPointConfiguration): Promise<number>;

    setAdvancedAudioOptions(options: AdvancedAudioOptions, sourceType: number): Promise<number>;

    setAVSyncSource(channelId: string, uid: number): Promise<number>;

    enableVideoImageSource(enable: boolean, options: ImageTrackOptions): Promise<number>;

    getCurrentMonotonicTimeInMs(): Promise<number>;

    getNetworkType(): Promise<number>;

    setParameters(parameters: object): Promise<number>;

    startMediaRenderingTracing(): Promise<number>;

    enableInstantMediaRendering(): Promise<number>;

    getNtpWallTimeInMs(): Promise<number>;

    isFeatureAvailableOnDevice(type: FeatureType): Promise<boolean>;

    sendAudioMetadata(metadata: Uint8Array, length: number): Promise<number>;

    queryHDRCapability(videoModule: VIDEO_MODULE_TYPE): Promise<{ errorCode: number; capability: HDR_CAPABILITY }>;
}
