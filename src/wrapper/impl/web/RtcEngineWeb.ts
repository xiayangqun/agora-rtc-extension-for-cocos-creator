import { IAudioDeviceManager } from "../../interface/IAudioDeviceManager";
import { IFaceInfoObserver } from "../../interface/IFaceInfoObserver";
import { IH265Transcoder } from "../../interface/IH265Transcoder";
import { ILocalSpatialAudioEngine } from "../../interface/ILocalSpatialAudioEngine";
import { IMediaPlayer } from "../../interface/IMediaPlayer";
import { IMediaPlayerCacheManager } from "../../interface/IMediaPlayerCacheManager";
import { IMediaRecorder } from "../../interface/IMediaRecorder";
import { IMusicContentCenter } from "../../interface/IMusicContentCenter";
import { IRtcEngine } from "../../interface/IRtcEngine";
import { IRtcEngineEx } from "../../interface/IRtcEngineEx";
import { IVideoDeviceManager } from "../../interface/IVideoDeviceManager";
import { IVideoEffectObject } from "../../interface/IVideoEffectObject";
import { IVideoFrameObserver } from "../../interface/IVideoFrameObserver";
import {
    VideoEncoderConfiguration,
    VideoCanvas,
    VIDEO_STREAM_TYPE,
    VideoSubscriptionOptions,
    SpatialAudioParams,
    VIDEO_MIRROR_MODE_TYPE,
    CONNECTION_STATE_TYPE,
    EncryptionConfig,
    DataStreamConfig,
    RdtStreamType,
    WatermarkOptions,
    WatermarkConfig,
    LiveTranscoding,
    ChannelMediaRelayConfiguration,
    UserInfo,
    SimulcastStreamConfig,
    SIMULCAST_STREAM_MODE,
    SimulcastConfig,
    CodecCapInfo,
    CHANNEL_PROFILE_TYPE,
    CLIENT_ROLE_TYPE,
    ClientRoleOptions,
    EchoTestConfiguration,
    LastmileProbeConfig,
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
    VIDEO_APPLICATION_SCENARIO_TYPE,
    VIDEO_QOE_PREFERENCE_TYPE,
    AUDIO_PROFILE_TYPE,
    AUDIO_SCENARIO_TYPE,
    AUDIO_RECORDING_QUALITY_TYPE,
    AudioRecordingConfiguration,
    AudioEncodedFrameObserverConfig,
    RecorderStreamInfo,
    VOICE_BEAUTIFIER_PRESET,
    AUDIO_EFFECT_PRESET,
    VOICE_CONVERSION_PRESET,
    HEADPHONE_EQUALIZER_PRESET,
    VOICE_AI_TUNER_TYPE,
    SenderOptions,
    CAMERA_STABILIZATION_MODE,
    AUDIO_SESSION_OPERATION_RESTRICTION,
    Rectangle,
    ScreenCaptureParameters,
    DeviceInfo,
    VIDEO_CONTENT_HINT,
    ScreenCaptureParameters2,
    FocalLengthInfo,
    SCREEN_SCENARIO_TYPE,
    LocalTranscoderConfiguration,
    LocalAudioMixerConfiguration,
    VIDEO_ORIENTATION,
    RtcImage,
    AUDIO_AINS_MODE,
    LocalAccessPointConfiguration,
    VIDEO_MODULE_TYPE,
    HDR_CAPABILITY,
    AUDIO_TRACK_TYPE,
    AudioTrackConfig,
    EncodedVideoFrameInfo,
} from "../../types/AgoraBase";
import { LOG_LEVEL } from "../../types/AgoraLog";
import {
    RENDER_MODE_TYPE,
    SnapshotConfig,
    ContentInspectConfig,
    VIDEO_MODULE_POSITION,
    VIDEO_SOURCE_TYPE,
    MEDIA_SOURCE_TYPE,
    RAW_AUDIO_FRAME_OP_MODE_TYPE,
    AudioFrame,
    EXTERNAL_VIDEO_SOURCE_TYPE,
    ExternalVideoFrame,
} from "../../types/AgoraMediaBase";
import { AUDIO_MIXING_DUAL_MONO_MODE } from "../../types/AgoraMediaEngine";
import { AgoraRhythmPlayerConfig } from "../../types/AgoraRhythmPlayer";
import {
    ChannelMediaOptions,
    LeaveChannelOptions,
    STREAM_FALLBACK_OPTIONS,
    RtcEngineContext,
    CameraCapturerConfiguration,
    AUDIO_EQUALIZATION_BAND_FREQUENCY,
    AUDIO_REVERB_TYPE,
    ExtensionInfo,
    SIZE,
    ScreenCaptureSourceInfo,
    ScreenCaptureConfiguration,
    PRIORITY_TYPE,
    DirectCdnStreamingMediaOptions,
    CLOUD_PROXY_TYPE,
    AdvancedAudioOptions,
    ImageTrackOptions,
    FeatureType,
} from "../../types/AgoraRtcEngine";
import { RtcConnection } from "../../types/AgoraRtcEngineEx";

export class RtcEngineWeb implements IRtcEngineEx {
    release(sync: boolean): void {
        throw new Error("Method not implemented.");
    }
    setParameters(key: string, value: string): number;
    setParameters(parameters: string): number;
    setParameters(key: unknown, value?: unknown): number {
        throw new Error("Method not implemented.");
    }
    getAudioDeviceManager(): IAudioDeviceManager {
        throw new Error("Method not implemented.");
    }
    getVideoDeviceManager(): IVideoDeviceManager {
        throw new Error("Method not implemented.");
    }
    getMusicContentCenter(): IMusicContentCenter {
        throw new Error("Method not implemented.");
    }
    getMediaPlayerCacheManager(): IMediaPlayerCacheManager {
        throw new Error("Method not implemented.");
    }
    getLocalSpatialAudioEngine(): ILocalSpatialAudioEngine {
        throw new Error("Method not implemented.");
    }
    getH265Transcoder(): IH265Transcoder {
        throw new Error("Method not implemented.");
    }
    setLocalVideoDataSourcePosition(position: VIDEO_MODULE_POSITION): number {
        throw new Error("Method not implemented.");
    }
    registerVideoFrameObserver(observer: IVideoFrameObserver): number {
        throw new Error("Method not implemented.");
    }
    unregisterVideoFrameObserver(): number {
        throw new Error("Method not implemented.");
    }
    unregisterVideoEncodedFrameObserver(): number {
        throw new Error("Method not implemented.");
    }
    unregisterAudioFrameObserver(): number {
        throw new Error("Method not implemented.");
    }
    unregisterFaceInfoObserver(): number {
        throw new Error("Method not implemented.");
    }
    initialize(context: RtcEngineContext): number {
        throw new Error("Method not implemented.");
    }
    getVersion(): { version: string; build: number } {
        throw new Error("Method not implemented.");
    }
    getErrorDescription(code: number): string {
        throw new Error("Method not implemented.");
    }
    queryCodecCapability(): { errorCode: number; codecInfo: CodecCapInfo[] } {
        throw new Error("Method not implemented.");
    }
    queryDeviceScore(): number {
        throw new Error("Method not implemented.");
    }
    preloadChannel(token: string, channelId: string, uid: number): number {
        throw new Error("Method not implemented.");
    }
    preloadChannelWithUserAccount(token: string, channelId: string, userAccount: string): number {
        throw new Error("Method not implemented.");
    }
    updatePreloadChannelToken(token: string): number {
        throw new Error("Method not implemented.");
    }
    joinChannel(token: string, channelId: string, info: string, uid: number): number;
    joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): number;
    joinChannel(token: unknown, channelId: unknown, uid: unknown, options: unknown): number {
        throw new Error("Method not implemented.");
    }
    updateChannelMediaOptions(options: ChannelMediaOptions): number {
        throw new Error("Method not implemented.");
    }
    leaveChannel(): number;
    leaveChannel(options: LeaveChannelOptions): number;
    leaveChannel(options?: unknown): number {
        throw new Error("Method not implemented.");
    }
    renewToken(token: string): number {
        throw new Error("Method not implemented.");
    }
    setChannelProfile(profile: CHANNEL_PROFILE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setClientRole(role: CLIENT_ROLE_TYPE): number;
    setClientRole(role: CLIENT_ROLE_TYPE, options: ClientRoleOptions): number;
    setClientRole(role: unknown, options?: unknown): number {
        throw new Error("Method not implemented.");
    }
    startEchoTest(config: EchoTestConfiguration): number {
        throw new Error("Method not implemented.");
    }
    stopEchoTest(): number {
        throw new Error("Method not implemented.");
    }
    enableMultiCamera(enabled: boolean, config: CameraCapturerConfiguration): number {
        throw new Error("Method not implemented.");
    }
    enableVideo(): number {
        throw new Error("Method not implemented.");
    }
    disableVideo(): number {
        throw new Error("Method not implemented.");
    }
    startPreview(): number;
    startPreview(sourceType: VIDEO_SOURCE_TYPE): number;
    startPreview(sourceType?: unknown): number {
        throw new Error("Method not implemented.");
    }
    stopPreview(): number;
    stopPreview(sourceType: VIDEO_SOURCE_TYPE): number;
    stopPreview(sourceType?: unknown): number {
        throw new Error("Method not implemented.");
    }
    startLastmileProbeTest(config: LastmileProbeConfig): number {
        throw new Error("Method not implemented.");
    }
    stopLastmileProbeTest(): number {
        throw new Error("Method not implemented.");
    }
    setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number {
        throw new Error("Method not implemented.");
    }
    setBeautyEffectOptions(enabled: boolean, options: BeautyOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setFaceShapeBeautyOptions(enabled: boolean, options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setFaceShapeAreaOptions(options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    getFaceShapeBeautyOptions(options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    getFaceShapeAreaOptions(shapeArea: FACE_SHAPE_AREA, options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setFilterEffectOptions(enabled: boolean, options: FilterEffectOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    createVideoEffectObject(bundlePath: string, type: MEDIA_SOURCE_TYPE): IVideoEffectObject {
        throw new Error("Method not implemented.");
    }
    destroyVideoEffectObject(videoEffectObject: IVideoEffectObject): number {
        throw new Error("Method not implemented.");
    }
    setLowlightEnhanceOptions(enabled: boolean, options: LowlightEnhanceOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setVideoDenoiserOptions(enabled: boolean, options: VideoDenoiserOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setColorEnhanceOptions(enabled: boolean, options: ColorEnhanceOptions, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    enableVirtualBackground(enabled: boolean, backgroundSource: VirtualBackgroundSource, segproperty: SegmentationProperty, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setupRemoteVideo(canvas: VideoCanvas): number {
        throw new Error("Method not implemented.");
    }
    setupLocalVideo(canvas: VideoCanvas): number {
        throw new Error("Method not implemented.");
    }
    setVideoScenario(scenarioType: VIDEO_APPLICATION_SCENARIO_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setVideoQoEPreference(qoePreference: VIDEO_QOE_PREFERENCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    enableAudio(): number {
        throw new Error("Method not implemented.");
    }
    disableAudio(): number {
        throw new Error("Method not implemented.");
    }
    setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): number;
    setAudioProfile(profile: AUDIO_PROFILE_TYPE): number;
    setAudioProfile(profile: unknown, scenario?: unknown): number {
        throw new Error("Method not implemented.");
    }
    setAudioScenario(scenario: AUDIO_SCENARIO_TYPE): number {
        throw new Error("Method not implemented.");
    }
    enableLocalAudio(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    muteLocalAudioStream(mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    muteAllRemoteAudioStreams(mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    muteRemoteAudioStream(uid: number, mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    muteLocalVideoStream(mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    enableLocalVideo(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    muteAllRemoteVideoStreams(mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    setRemoteDefaultVideoStreamType(streamType: VIDEO_STREAM_TYPE): number {
        throw new Error("Method not implemented.");
    }
    muteRemoteVideoStream(uid: number, mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    setRemoteVideoStreamType(uid: number, streamType: VIDEO_STREAM_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setRemoteVideoSubscriptionOptions(uid: number, options: VideoSubscriptionOptions): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeAudioBlocklist(uidList: number[], uidNumber: number): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeAudioAllowlist(uidList: number[], uidNumber: number): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeVideoBlocklist(uidList: number[], uidNumber: number): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeVideoAllowlist(uidList: number[], uidNumber: number): number {
        throw new Error("Method not implemented.");
    }
    enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): number {
        throw new Error("Method not implemented.");
    }
    startAudioRecording(filePath: string, quality: AUDIO_RECORDING_QUALITY_TYPE): number;
    startAudioRecording(filePath: string, sampleRate: number, quality: AUDIO_RECORDING_QUALITY_TYPE): number;
    startAudioRecording(config: AudioRecordingConfiguration): number;
    startAudioRecording(filePath: unknown, sampleRate?: unknown, quality?: unknown): number {
        throw new Error("Method not implemented.");
    }
    registerAudioEncodedFrameObserver(config: AudioEncodedFrameObserverConfig, observer: IAudioEncodedFrameObserver): number {
        throw new Error("Method not implemented.");
    }
    stopAudioRecording(): number {
        throw new Error("Method not implemented.");
    }
    createMediaPlayer(): IMediaPlayer {
        throw new Error("Method not implemented.");
    }
    destroyMediaPlayer(media_player: IMediaPlayer): number {
        throw new Error("Method not implemented.");
    }
    createMediaRecorder(info: RecorderStreamInfo): IMediaRecorder {
        throw new Error("Method not implemented.");
    }
    destroyMediaRecorder(mediaRecorder: IMediaRecorder): number {
        throw new Error("Method not implemented.");
    }
    startAudioMixing(filePath: string, loopback: boolean, cycle: number): number;
    startAudioMixing(filePath: string, loopback: boolean, cycle: number, startPos: number): number;
    startAudioMixing(filePath: unknown, loopback: unknown, cycle: unknown, startPos?: unknown): number {
        throw new Error("Method not implemented.");
    }
    stopAudioMixing(): number {
        throw new Error("Method not implemented.");
    }
    pauseAudioMixing(): number {
        throw new Error("Method not implemented.");
    }
    resumeAudioMixing(): number {
        throw new Error("Method not implemented.");
    }
    selectAudioTrack(index: number): number {
        throw new Error("Method not implemented.");
    }
    getAudioTrackCount(): number {
        throw new Error("Method not implemented.");
    }
    adjustAudioMixingVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    adjustAudioMixingPublishVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    getAudioMixingPublishVolume(): number {
        throw new Error("Method not implemented.");
    }
    adjustAudioMixingPlayoutVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    getAudioMixingPlayoutVolume(): number {
        throw new Error("Method not implemented.");
    }
    getAudioMixingDuration(): number {
        throw new Error("Method not implemented.");
    }
    getAudioMixingCurrentPosition(): number {
        throw new Error("Method not implemented.");
    }
    setAudioMixingPosition(pos: number): number {
        throw new Error("Method not implemented.");
    }
    setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): number {
        throw new Error("Method not implemented.");
    }
    setAudioMixingPitch(pitch: number): number {
        throw new Error("Method not implemented.");
    }
    setAudioMixingPlaybackSpeed(speed: number): number {
        throw new Error("Method not implemented.");
    }
    getEffectsVolume(): number {
        throw new Error("Method not implemented.");
    }
    setEffectsVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    preloadEffect(soundId: number, filePath: string, startPos: number): number {
        throw new Error("Method not implemented.");
    }
    playEffect(soundId: number, filePath: string, loopCount: number, pitch: number, pan: number, gain: number, publish: boolean, startPos: number): number {
        throw new Error("Method not implemented.");
    }
    playAllEffects(loopCount: number, pitch: number, pan: number, gain: number, publish: boolean): number {
        throw new Error("Method not implemented.");
    }
    getVolumeOfEffect(soundId: number): number {
        throw new Error("Method not implemented.");
    }
    setVolumeOfEffect(soundId: number, volume: number): number {
        throw new Error("Method not implemented.");
    }
    pauseEffect(soundId: number): number {
        throw new Error("Method not implemented.");
    }
    pauseAllEffects(): number {
        throw new Error("Method not implemented.");
    }
    resumeEffect(soundId: number): number {
        throw new Error("Method not implemented.");
    }
    resumeAllEffects(): number {
        throw new Error("Method not implemented.");
    }
    stopEffect(soundId: number): number {
        throw new Error("Method not implemented.");
    }
    stopAllEffects(): number {
        throw new Error("Method not implemented.");
    }
    unloadEffect(soundId: number): number {
        throw new Error("Method not implemented.");
    }
    unloadAllEffects(): number {
        throw new Error("Method not implemented.");
    }
    getEffectDuration(filePath: string): number {
        throw new Error("Method not implemented.");
    }
    setEffectPosition(soundId: number, pos: number): number {
        throw new Error("Method not implemented.");
    }
    getEffectCurrentPosition(soundId: number): number {
        throw new Error("Method not implemented.");
    }
    enableSoundPositionIndication(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    setRemoteVoicePosition(uid: number, pan: number, gain: number): number {
        throw new Error("Method not implemented.");
    }
    enableSpatialAudio(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): number {
        throw new Error("Method not implemented.");
    }
    setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): number {
        throw new Error("Method not implemented.");
    }
    setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): number {
        throw new Error("Method not implemented.");
    }
    setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): number {
        throw new Error("Method not implemented.");
    }
    setAudioEffectParameters(preset: AUDIO_EFFECT_PRESET, param1: number, param2: number): number {
        throw new Error("Method not implemented.");
    }
    setVoiceBeautifierParameters(preset: VOICE_BEAUTIFIER_PRESET, param1: number, param2: number): number {
        throw new Error("Method not implemented.");
    }
    setVoiceConversionParameters(preset: VOICE_CONVERSION_PRESET, param1: number, param2: number): number {
        throw new Error("Method not implemented.");
    }
    setLocalVoicePitch(pitch: number): number {
        throw new Error("Method not implemented.");
    }
    setLocalVoiceFormant(formantRatio: number): number {
        throw new Error("Method not implemented.");
    }
    setLocalVoiceEqualization(bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY, bandGain: number): number {
        throw new Error("Method not implemented.");
    }
    setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): number {
        throw new Error("Method not implemented.");
    }
    setHeadphoneEQPreset(preset: HEADPHONE_EQUALIZER_PRESET): number {
        throw new Error("Method not implemented.");
    }
    setHeadphoneEQParameters(lowGain: number, highGain: number): number {
        throw new Error("Method not implemented.");
    }
    enableVoiceAITuner(enabled: boolean, type: VOICE_AI_TUNER_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setLogFile(filePath: string): number {
        throw new Error("Method not implemented.");
    }
    setLogFilter(filter: number): number {
        throw new Error("Method not implemented.");
    }
    setLogLevel(level: LOG_LEVEL): number {
        throw new Error("Method not implemented.");
    }
    setLogFileSize(fileSizeInKBytes: number): number {
        throw new Error("Method not implemented.");
    }
    uploadLogFile(requestId: string): number {
        throw new Error("Method not implemented.");
    }
    writeLog(level: LOG_LEVEL, fmt: string): number {
        throw new Error("Method not implemented.");
    }
    setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): number;
    setLocalRenderMode(renderMode: RENDER_MODE_TYPE): number;
    setLocalRenderMode(renderMode: unknown, mirrorMode?: unknown): number {
        throw new Error("Method not implemented.");
    }
    setRemoteRenderMode(uid: number, renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setLocalRenderTargetFps(sourceType: VIDEO_SOURCE_TYPE, targetFps: number): number {
        throw new Error("Method not implemented.");
    }
    setRemoteRenderTargetFps(targetFps: number): number {
        throw new Error("Method not implemented.");
    }
    setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    enableDualStreamMode(enabled: boolean): number;
    enableDualStreamMode(enabled: boolean, streamConfig: SimulcastStreamConfig): number;
    enableDualStreamMode(enabled: unknown, streamConfig?: unknown): number {
        throw new Error("Method not implemented.");
    }
    setDualStreamMode(mode: SIMULCAST_STREAM_MODE): number;
    setDualStreamMode(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig): number;
    setDualStreamMode(mode: unknown, streamConfig?: unknown): number {
        throw new Error("Method not implemented.");
    }
    setSimulcastConfig(simulcastConfig: SimulcastConfig): number {
        throw new Error("Method not implemented.");
    }
    enableCustomAudioLocalPlayback(trackId: number, enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    setRecordingAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number {
        throw new Error("Method not implemented.");
    }
    setPlaybackAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number {
        throw new Error("Method not implemented.");
    }
    setMixedAudioFrameParameters(sampleRate: number, channel: number, samplesPerCall: number): number {
        throw new Error("Method not implemented.");
    }
    setEarMonitoringAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number {
        throw new Error("Method not implemented.");
    }
    setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number): number;
    setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number, samplesPerCall: number): number;
    setPlaybackAudioFrameBeforeMixingParameters(sampleRate: unknown, channel: unknown, samplesPerCall?: unknown): number {
        throw new Error("Method not implemented.");
    }
    enableAudioSpectrumMonitor(intervalInMS: number): number {
        throw new Error("Method not implemented.");
    }
    disableAudioSpectrumMonitor(): number {
        throw new Error("Method not implemented.");
    }
    adjustRecordingSignalVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    muteRecordingSignal(mute: boolean): number {
        throw new Error("Method not implemented.");
    }
    adjustPlaybackSignalVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    adjustUserPlaybackSignalVolume(uid: number, volume: number): number {
        throw new Error("Method not implemented.");
    }
    setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): number {
        throw new Error("Method not implemented.");
    }
    setHighPriorityUserList(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS): number {
        throw new Error("Method not implemented.");
    }
    enableExtension(provider: string, extension: string, extensionInfo: ExtensionInfo, enable: boolean): number;
    enableExtension(provider: string, extension: string, enable: boolean, type: MEDIA_SOURCE_TYPE): number;
    enableExtension(provider: unknown, extension: unknown, enable: unknown, type: unknown): number {
        throw new Error("Method not implemented.");
    }
    setExtensionProperty(provider: string, extension: string, extensionInfo: ExtensionInfo, key: string, value: string): number;
    setExtensionProperty(provider: string, extension: string, key: string, value: string, type: MEDIA_SOURCE_TYPE): number;
    setExtensionProperty(provider: unknown, extension: unknown, key: unknown, value: unknown, type: unknown): number {
        throw new Error("Method not implemented.");
    }
    getExtensionProperty(provider: string, extension: string, extensionInfo: ExtensionInfo, key: string, buf_len: number): { errorCode: number; value: string };
    getExtensionProperty(provider: string, extension: string, key: string, buf_len: number, type: MEDIA_SOURCE_TYPE): { errorCode: number; value: number };
    getExtensionProperty(provider: unknown, extension: unknown, key: unknown, buf_len: unknown, type: unknown): { errorCode: number; value: string } | { errorCode: number; value: number } {
        throw new Error("Method not implemented.");
    }
    enableLoopbackRecording(enabled: boolean, deviceName: string): number {
        throw new Error("Method not implemented.");
    }
    adjustLoopbackSignalVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    getLoopbackRecordingVolume(): number {
        throw new Error("Method not implemented.");
    }
    enableInEarMonitoring(enabled: boolean, includeAudioFilters: number): number {
        throw new Error("Method not implemented.");
    }
    setInEarMonitoringVolume(volume: number): number {
        throw new Error("Method not implemented.");
    }
    loadExtensionProvider(path: string, unload_after_use: boolean): number {
        throw new Error("Method not implemented.");
    }
    setExtensionProviderProperty(provider: string, key: string, value: string): number {
        throw new Error("Method not implemented.");
    }
    registerExtension(provider: string, extension: string, type: MEDIA_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number {
        throw new Error("Method not implemented.");
    }
    createCustomVideoTrack(): number {
        throw new Error("Method not implemented.");
    }
    createCustomEncodedVideoTrack(sender_option: SenderOptions): number {
        throw new Error("Method not implemented.");
    }
    destroyCustomVideoTrack(video_track_id: number): number {
        throw new Error("Method not implemented.");
    }
    destroyCustomEncodedVideoTrack(video_track_id: number): number {
        throw new Error("Method not implemented.");
    }
    switchCamera(): number {
        throw new Error("Method not implemented.");
    }
    isCameraZoomSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    isCameraFaceDetectSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    isCameraTorchSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    isCameraFocusSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    isCameraAutoFocusFaceModeSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    setCameraZoomFactor(factor: number): number {
        throw new Error("Method not implemented.");
    }
    enableFaceDetection(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    getCameraMaxZoomFactor(): number {
        throw new Error("Method not implemented.");
    }
    setCameraFocusPositionInPreview(positionX: number, positionY: number): number {
        throw new Error("Method not implemented.");
    }
    setCameraTorchOn(isOn: boolean): number {
        throw new Error("Method not implemented.");
    }
    setCameraAutoFocusFaceModeEnabled(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    isCameraExposurePositionSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    setCameraExposurePosition(positionXinView: number, positionYinView: number): number {
        throw new Error("Method not implemented.");
    }
    isCameraExposureSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    setCameraExposureFactor(factor: number): number {
        throw new Error("Method not implemented.");
    }
    isCameraAutoExposureFaceModeSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    setCameraAutoExposureFaceModeEnabled(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    setCameraStabilizationMode(mode: CAMERA_STABILIZATION_MODE): number {
        throw new Error("Method not implemented.");
    }
    setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): number {
        throw new Error("Method not implemented.");
    }
    setEnableSpeakerphone(speakerOn: boolean): number {
        throw new Error("Method not implemented.");
    }
    isSpeakerphoneEnabled(): boolean {
        throw new Error("Method not implemented.");
    }
    setRouteInCommunicationMode(route: number): number {
        throw new Error("Method not implemented.");
    }
    isCameraCenterStageSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    enableCameraCenterStage(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    getScreenCaptureSources(thumbSize: SIZE, iconSize: SIZE, includeScreen: boolean): ScreenCaptureSourceInfo[] {
        throw new Error("Method not implemented.");
    }
    setAudioSessionOperationRestriction(restriction: AUDIO_SESSION_OPERATION_RESTRICTION): number {
        throw new Error("Method not implemented.");
    }
    startScreenCaptureByDisplayId(displayId: number, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number {
        throw new Error("Method not implemented.");
    }
    startScreenCaptureByScreenRect(screenRect: Rectangle, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number {
        throw new Error("Method not implemented.");
    }
    getAudioDeviceInfo(): { errorCode: number; deviceInfo: DeviceInfo } {
        throw new Error("Method not implemented.");
    }
    startScreenCaptureByWindowId(windowId: number, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number {
        throw new Error("Method not implemented.");
    }
    setScreenCaptureContentHint(contentHint: VIDEO_CONTENT_HINT): number {
        throw new Error("Method not implemented.");
    }
    updateScreenCaptureRegion(regionRect: Rectangle): number {
        throw new Error("Method not implemented.");
    }
    updateScreenCaptureParameters(captureParams: ScreenCaptureParameters): number {
        throw new Error("Method not implemented.");
    }
    startScreenCapture(captureParams: ScreenCaptureParameters2): number;
    startScreenCapture(sourceType: VIDEO_SOURCE_TYPE, config: ScreenCaptureConfiguration): number;
    startScreenCapture(sourceType: unknown, config?: unknown): number {
        throw new Error("Method not implemented.");
    }
    updateScreenCapture(captureParams: ScreenCaptureParameters2): number {
        throw new Error("Method not implemented.");
    }
    queryScreenCaptureCapability(): number {
        throw new Error("Method not implemented.");
    }
    queryCameraFocalLengthCapability(focalLengthInfos: FocalLengthInfo[], size: number): number {
        throw new Error("Method not implemented.");
    }
    setExternalMediaProjection(mediaProjection: unknown): number {
        throw new Error("Method not implemented.");
    }
    setScreenCaptureScenario(screenScenario: SCREEN_SCENARIO_TYPE): number {
        throw new Error("Method not implemented.");
    }
    stopScreenCapture(): number;
    stopScreenCapture(sourceType: VIDEO_SOURCE_TYPE): number;
    stopScreenCapture(sourceType?: unknown): number {
        throw new Error("Method not implemented.");
    }
    getCallId(callId: string): number {
        throw new Error("Method not implemented.");
    }
    rate(callId: string, rating: number, description: string): number {
        throw new Error("Method not implemented.");
    }
    complain(callId: string, description: string): number {
        throw new Error("Method not implemented.");
    }
    startRtmpStreamWithoutTranscoding(url: string): number {
        throw new Error("Method not implemented.");
    }
    startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): number {
        throw new Error("Method not implemented.");
    }
    updateRtmpTranscoding(transcoding: LiveTranscoding): number {
        throw new Error("Method not implemented.");
    }
    startLocalVideoTranscoder(config: LocalTranscoderConfiguration): number {
        throw new Error("Method not implemented.");
    }
    updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): number {
        throw new Error("Method not implemented.");
    }
    stopRtmpStream(url: string): number {
        throw new Error("Method not implemented.");
    }
    stopLocalVideoTranscoder(): number {
        throw new Error("Method not implemented.");
    }
    startLocalAudioMixer(config: LocalAudioMixerConfiguration): number {
        throw new Error("Method not implemented.");
    }
    updateLocalAudioMixerConfiguration(config: LocalAudioMixerConfiguration): number {
        throw new Error("Method not implemented.");
    }
    stopLocalAudioMixer(): number {
        throw new Error("Method not implemented.");
    }
    startCameraCapture(sourceType: VIDEO_SOURCE_TYPE, config: CameraCapturerConfiguration): number {
        throw new Error("Method not implemented.");
    }
    stopCameraCapture(sourceType: VIDEO_SOURCE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setCameraDeviceOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): number {
        throw new Error("Method not implemented.");
    }
    setScreenCaptureOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): number {
        throw new Error("Method not implemented.");
    }
    getConnectionState(): CONNECTION_STATE_TYPE {
        throw new Error("Method not implemented.");
    }
    setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): number {
        throw new Error("Method not implemented.");
    }
    enableEncryption(enabled: boolean, config: EncryptionConfig): number {
        throw new Error("Method not implemented.");
    }
    createDataStream(streamId: number, reliable: boolean, ordered: boolean): number;
    createDataStream(streamId: number, config: DataStreamConfig): number;
    createDataStream(streamId: unknown, reliable: unknown, ordered?: unknown): number {
        throw new Error("Method not implemented.");
    }
    sendStreamMessage(streamId: number, data: Uint8Array, length: number): number {
        throw new Error("Method not implemented.");
    }
    sendRdtMessage(uid: number, type: RdtStreamType, data: string, length: number): number {
        throw new Error("Method not implemented.");
    }
    sendMediaControlMessage(uid: number, data: string, length: number): number {
        throw new Error("Method not implemented.");
    }
    addVideoWatermark(watermark: RtcImage): number;
    addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): number;
    addVideoWatermark(configs: WatermarkConfig): number;
    addVideoWatermark(watermarkUrl: unknown, options?: unknown): number {
        throw new Error("Method not implemented.");
    }
    removeVideoWatermark(id: string): number {
        throw new Error("Method not implemented.");
    }
    clearVideoWatermarks(): number {
        throw new Error("Method not implemented.");
    }
    pauseAudio(): number {
        throw new Error("Method not implemented.");
    }
    resumeAudio(): number {
        throw new Error("Method not implemented.");
    }
    enableWebSdkInteroperability(enabled: boolean): number {
        throw new Error("Method not implemented.");
    }
    sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): number {
        throw new Error("Method not implemented.");
    }
    startAudioFrameDump(channel_id: string, uid: number, location: string, uuid: string, passwd: string, duration_ms: number, auto_upload: boolean): number {
        throw new Error("Method not implemented.");
    }
    stopAudioFrameDump(channel_id: string, uid: number, location: string): number {
        throw new Error("Method not implemented.");
    }
    setAINSMode(enabled: boolean, mode: AUDIO_AINS_MODE): number {
        throw new Error("Method not implemented.");
    }
    registerLocalUserAccount(appId: string, userAccount: string): number {
        throw new Error("Method not implemented.");
    }
    joinChannelWithUserAccount(token: string, channelId: string, userAccount: string): number;
    joinChannelWithUserAccount(token: string, channelId: string, userAccount: string, options: ChannelMediaOptions): number;
    joinChannelWithUserAccount(token: unknown, channelId: unknown, userAccount: unknown, options?: unknown): number {
        throw new Error("Method not implemented.");
    }
    getUserInfoByUserAccount(userAccount: string): { errorCode: number; userInfo: UserInfo } {
        throw new Error("Method not implemented.");
    }
    getUserInfoByUid(uid: number): { errorCode: number; userInfo: UserInfo } {
        throw new Error("Method not implemented.");
    }
    startOrUpdateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): number {
        throw new Error("Method not implemented.");
    }
    stopChannelMediaRelay(): number {
        throw new Error("Method not implemented.");
    }
    pauseAllChannelMediaRelay(): number {
        throw new Error("Method not implemented.");
    }
    resumeAllChannelMediaRelay(): number {
        throw new Error("Method not implemented.");
    }
    setDirectCdnStreamingAudioConfiguration(profile: AUDIO_PROFILE_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setDirectCdnStreamingVideoConfiguration(config: VideoEncoderConfiguration): number {
        throw new Error("Method not implemented.");
    }
    startDirectCdnStreaming(publishUrl: string, options: DirectCdnStreamingMediaOptions): number {
        throw new Error("Method not implemented.");
    }
    stopDirectCdnStreaming(): number {
        throw new Error("Method not implemented.");
    }
    updateDirectCdnStreamingMediaOptions(options: DirectCdnStreamingMediaOptions): number {
        throw new Error("Method not implemented.");
    }
    startRhythmPlayer(sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): number {
        throw new Error("Method not implemented.");
    }
    stopRhythmPlayer(): number {
        throw new Error("Method not implemented.");
    }
    configRhythmPlayer(config: AgoraRhythmPlayerConfig): number {
        throw new Error("Method not implemented.");
    }
    takeSnapshot(uid: number, filePath: string): number;
    takeSnapshot(uid: number, config: SnapshotConfig): number;
    takeSnapshot(uid: unknown, config: unknown): number {
        throw new Error("Method not implemented.");
    }
    enableContentInspect(enabled: boolean, config: ContentInspectConfig): number {
        throw new Error("Method not implemented.");
    }
    adjustCustomAudioPublishVolume(trackId: number, volume: number): number {
        throw new Error("Method not implemented.");
    }
    adjustCustomAudioPlayoutVolume(trackId: number, volume: number): number {
        throw new Error("Method not implemented.");
    }
    setCloudProxy(proxyType: CLOUD_PROXY_TYPE): number {
        throw new Error("Method not implemented.");
    }
    setLocalAccessPoint(config: LocalAccessPointConfiguration): number {
        throw new Error("Method not implemented.");
    }
    setAdvancedAudioOptions(options: AdvancedAudioOptions, sourceType: number): number {
        throw new Error("Method not implemented.");
    }
    setAVSyncSource(channelId: string, uid: number): number {
        throw new Error("Method not implemented.");
    }
    enableVideoImageSource(enable: boolean, options: ImageTrackOptions): number {
        throw new Error("Method not implemented.");
    }
    getCurrentMonotonicTimeInMs(): number {
        throw new Error("Method not implemented.");
    }
    getNetworkType(): number {
        throw new Error("Method not implemented.");
    }
    startMediaRenderingTracing(): number {
        throw new Error("Method not implemented.");
    }
    enableInstantMediaRendering(): number {
        throw new Error("Method not implemented.");
    }
    getNtpWallTimeInMs(): number {
        throw new Error("Method not implemented.");
    }
    isFeatureAvailableOnDevice(type: FeatureType): boolean {
        throw new Error("Method not implemented.");
    }
    sendAudioMetadata(metadata: Uint8Array, length: number): number {
        throw new Error("Method not implemented.");
    }
    queryHDRCapability(videoModule: VIDEO_MODULE_TYPE, capability: HDR_CAPABILITY): number {
        throw new Error("Method not implemented.");
    }
    registerFaceInfoObserver(observer: IFaceInfoObserver): number {
        throw new Error("Method not implemented.");
    }
    pushAudioFrame(frame: AudioFrame, trackId: number): number {
        throw new Error("Method not implemented.");
    }
    pullAudioFrame(frame: AudioFrame): number {
        throw new Error("Method not implemented.");
    }
    setExternalVideoSource(enabled: boolean, useTexture: boolean, sourceType: EXTERNAL_VIDEO_SOURCE_TYPE, encodedVideoOption: SenderOptions): number {
        throw new Error("Method not implemented.");
    }
    setExternalRemoteEglContext(eglContext: unknown): number {
        throw new Error("Method not implemented.");
    }
    setExternalAudioSource(enabled: boolean, sampleRate: number, channels: number, localPlayback: boolean, publish: boolean): number {
        throw new Error("Method not implemented.");
    }
    createCustomAudioTrack(trackType: AUDIO_TRACK_TYPE, config: AudioTrackConfig): number {
        throw new Error("Method not implemented.");
    }
    destroyCustomAudioTrack(trackId: number): number {
        throw new Error("Method not implemented.");
    }
    setExternalAudioSink(enabled: boolean, sampleRate: number, channels: number): number {
        throw new Error("Method not implemented.");
    }
    pushVideoFrame(frame: ExternalVideoFrame, videoTrackId: number): number {
        throw new Error("Method not implemented.");
    }
    pushEncodedVideoImage(imageBuffer: Uint8Array, length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo, videoTrackId: number): number {
        throw new Error("Method not implemented.");
    }
    setParametersEx(connection: RtcConnection, key: string, value: object): number;
    setParametersEx(connection: RtcConnection, parameters: string): number;
    setParametersEx(connection: unknown, key: unknown, value?: unknown): number {
        throw new Error("Method not implemented.");
    }
    joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): number {
        throw new Error("Method not implemented.");
    }
    leaveChannelEx(connection: RtcConnection): number;
    leaveChannelEx(connection: RtcConnection, options: LeaveChannelOptions): number;
    leaveChannelEx(connection: unknown, options?: unknown): number {
        throw new Error("Method not implemented.");
    }
    leaveChannelWithUserAccountEx(channelId: string, userAccount: string): number;
    leaveChannelWithUserAccountEx(channelId: string, userAccount: string, options: LeaveChannelOptions): number;
    leaveChannelWithUserAccountEx(channelId: unknown, userAccount: unknown, options?: unknown): number {
        throw new Error("Method not implemented.");
    }
    updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setVideoEncoderConfigurationEx(config: VideoEncoderConfiguration, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setRemoteVideoStreamTypeEx(uid: number, streamType: VIDEO_STREAM_TYPE, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteLocalAudioStreamEx(mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteLocalVideoStreamEx(mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteAllRemoteAudioStreamsEx(mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteAllRemoteVideoStreamsEx(mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeAudioBlocklistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeAudioAllowlistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeVideoBlocklistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setSubscribeVideoAllowlistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setRemoteVideoSubscriptionOptionsEx(uid: number, options: VideoSubscriptionOptions, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setRemoteUserSpatialAudioParamsEx(uid: number, params: SpatialAudioParams, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setRemoteRenderModeEx(uid: number, renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName: string): number {
        throw new Error("Method not implemented.");
    }
    adjustRecordingSignalVolumeEx(volume: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    muteRecordingSignalEx(mute: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    adjustUserPlaybackSignalVolumeEx(uid: number, volume: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    getConnectionStateEx(connection: RtcConnection): CONNECTION_STATE_TYPE {
        throw new Error("Method not implemented.");
    }
    enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): number {
        throw new Error("Method not implemented.");
    }
    createDataStreamEx(streamId: number, reliable: boolean, ordered: boolean, connection: RtcConnection): number;
    createDataStreamEx(streamId: number, config: DataStreamConfig, connection: RtcConnection): number;
    createDataStreamEx(streamId: unknown, reliable: unknown, ordered: unknown, connection?: unknown): number {
        throw new Error("Method not implemented.");
    }
    sendStreamMessageEx(streamId: number, data: Uint8Array, length: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    sendRdtMessageEx(uid: number, type: RdtStreamType, data: string, length: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    sendMediaControlMessageEx(uid: number, data: string, length: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    addVideoWatermarkEx(watermarkUrl: string, options: WatermarkOptions, connection: RtcConnection): number;
    addVideoWatermarkEx(config: WatermarkConfig, connection: RtcConnection): number;
    addVideoWatermarkEx(watermarkUrl: unknown, options: unknown, connection?: unknown): number {
        throw new Error("Method not implemented.");
    }
    removeVideoWatermarkEx(id: string, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    clearVideoWatermarkEx(connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    sendCustomReportMessageEx(id: string, category: string, event: string, label: string, value: number, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    enableAudioVolumeIndicationEx(interval: number, smooth: number, reportVad: boolean, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    startRtmpStreamWithoutTranscodingEx(url: string, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    startRtmpStreamWithTranscodingEx(url: string, transcoding: LiveTranscoding, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    updateRtmpTranscodingEx(transcoding: LiveTranscoding, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    stopRtmpStreamEx(url: string, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    startOrUpdateChannelMediaRelayEx(configuration: ChannelMediaRelayConfiguration, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    stopChannelMediaRelayEx(connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    pauseAllChannelMediaRelayEx(connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    resumeAllChannelMediaRelayEx(connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    getUserInfoByUserAccountEx(userAccount: string, userInfo: UserInfo, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    getUserInfoByUidEx(uid: number, userInfo: UserInfo, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    enableDualStreamModeEx(enabled: boolean, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setDualStreamModeEx(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setSimulcastConfigEx(simulcastConfig: SimulcastConfig, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    setHighPriorityUserListEx(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    takeSnapshotEx(connection: RtcConnection, uid: number, filePath: string): number;
    takeSnapshotEx(connection: RtcConnection, uid: number, config: SnapshotConfig): number;
    takeSnapshotEx(connection: unknown, uid: unknown, config: unknown): number {
        throw new Error("Method not implemented.");
    }
    enableContentInspectEx(enabled: boolean, config: ContentInspectConfig, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    startMediaRenderingTracingEx(connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    getCallIdEx(callId: string, connection: RtcConnection): number {
        throw new Error("Method not implemented.");
    }
    sendAudioMetadataEx(connection: RtcConnection, metadata: Uint8Array, length: number): number {
        throw new Error("Method not implemented.");
    }
    preloadEffectEx(connection: RtcConnection, soundId: number, filePath: string, startPos: number): number {
        throw new Error("Method not implemented.");
    }
    playEffectEx(connection: RtcConnection, soundId: number, filePath: string, loopCount: number, pitch: number, pan: number, gain: number, publish: boolean, startPos: number): number {
        throw new Error("Method not implemented.");
    }
}
