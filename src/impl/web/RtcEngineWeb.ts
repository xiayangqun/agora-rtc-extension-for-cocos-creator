import { warn } from "cc";
import { ExtensionInfo, Rectangle } from "electron";
import { UserInfo } from "os";
import { IAudioDeviceManager } from "../../interface/IAudioDeviceManager";
import { IH265Transcoder } from "../../interface/IH265Transcoder";
import { ILocalSpatialAudioEngine } from "../../interface/ILocalSpatialAudioEngine";
import { IMediaPlayer } from "../../interface/IMediaPlayer";
import { IMediaPlayerCacheManager } from "../../interface/IMediaPlayerCacheManager";
import { IMediaRecorder } from "../../interface/IMediaRecorder";
import { IMusicContentCenter } from "../../interface/IMusicContentCenter";
import { IRtcEngineEx } from "../../interface/IRtcEngineEx";
import { IVideoDeviceManager } from "../../interface/IVideoDeviceManager";
import { IVideoEffectObject } from "../../interface/IVideoEffectObject";
import {
    CodecCapInfo,
    CHANNEL_PROFILE_TYPE,
    CLIENT_ROLE_TYPE,
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
    EncryptionConfig,
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
    ClientRoleOptions,
    VideoEncoderConfiguration,
    ERROR_CODE_TYPE,
} from "../../types/AgoraBase";
import { LOG_LEVEL } from "../../types/AgoraLog";
import {
    VIDEO_MODULE_POSITION,
    VIDEO_SOURCE_TYPE,
    MEDIA_SOURCE_TYPE,
    RENDER_MODE_TYPE,
    RAW_AUDIO_FRAME_OP_MODE_TYPE,
    SnapshotConfig,
    ContentInspectConfig,
} from "../../types/AgoraMediaBase";
import { AUDIO_MIXING_DUAL_MONO_MODE } from "../../types/AgoraMediaEngine";
import { AgoraRhythmPlayerConfig } from "../../types/AgoraRhythmPlayer";
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
} from "../../types/AgoraRtcEngine";
import { RtcConnection } from "../../types/AgoraRtcEngineEx";
import { IRtcEngineEventHandler } from "../../interface/IRtcEngineEventHandler";
import AgoraRTC, { DeviceInfo } from "agora-rtc-sdk-ng";

export class RtcEngineWeb implements IRtcEngineEx {
    public rtcEngineEventHandler?: IRtcEngineEventHandler;

    constructor() {
        AgoraRTC.on("camera-changed", this.onCameraChanged.bind(this));
        AgoraRTC.on("microphone-changed", this.onMicrophoneChanged.bind(this));
        AgoraRTC.on("playback-device-changed", this.onPlaybackDeviceChanged.bind(this));
        AgoraRTC.on("autoplay-failed", this.onAutoplayFailed.bind(this));
        AgoraRTC.on("security-policy-violation", this.onSecurityPolicyViolation.bind(this));
        AgoraRTC.on("audio-context-state-changed", this.onAudioContextStateChanged.bind(this));
    }

    onCameraChanged(deviceInfo: DeviceInfo) {}
    onMicrophoneChanged(deviceInfo: DeviceInfo) {}
    onPlaybackDeviceChanged(deviceInfo: DeviceInfo) {}
    onAutoplayFailed() {}
    onSecurityPolicyViolation() {}
    onAudioContextStateChanged(
        currState: AudioContextState | "interrupted",
        prevState: AudioContextState | "interrupted" | undefined,
    ) {}

    async release(sync: boolean): Promise<void> {
        return;
    }

    async getAudioDeviceManager(): Promise<IAudioDeviceManager> {
        console.warn("getAudioDeviceManager not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getVideoDeviceManager(): Promise<IVideoDeviceManager> {
        console.warn("getVideoDeviceManager not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getMusicContentCenter(): Promise<IMusicContentCenter> {
        console.warn("getMusicContentCenter not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getMediaPlayerCacheManager(): Promise<IMediaPlayerCacheManager> {
        console.warn("getMediaPlayerCacheManager not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getLocalSpatialAudioEngine(): Promise<ILocalSpatialAudioEngine> {
        console.warn("getLocalSpatialAudioEngine not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getH265Transcoder(): Promise<IH265Transcoder> {
        console.warn("getH265Transcoder not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalVideoDataSourcePosition(position: VIDEO_MODULE_POSITION): Promise<number> {
        console.warn("setLocalVideoDataSourcePosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async initialize(context: RtcEngineContext): Promise<number> {
        console.warn("initialize not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getVersion(): Promise<{ version: string; build: number }> {
        console.warn("getVersion not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getErrorDescription(code: number): Promise<string> {
        console.warn("getErrorDescription not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async queryCodecCapability(): Promise<{ errorCode: number; codecInfo: CodecCapInfo[] }> {
        console.warn("queryCodecCapability not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async queryDeviceScore(): Promise<number> {
        console.warn("queryDeviceScore not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async preloadChannel(token: string, channelId: string, uid: number): Promise<number> {
        console.warn("preloadChannel not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async preloadChannelWithUserAccount(token: string, channelId: string, userAccount: string): Promise<number> {
        console.warn("preloadChannelWithUserAccount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updatePreloadChannelToken(token: string): Promise<number> {
        console.warn("updatePreloadChannelToken not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async joinChannel(token: string, channelId: string, info: string, uid: number): Promise<number>;
    async joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): Promise<number>;
    async joinChannel(token: unknown, channelId: unknown, uid: unknown, options: unknown): Promise<number> {
        console.warn("joinChannel not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateChannelMediaOptions(options: ChannelMediaOptions): Promise<number> {
        console.warn("updateChannelMediaOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async leaveChannel(): Promise<number>;
    async leaveChannel(options: LeaveChannelOptions): Promise<number>;
    async leaveChannel(options?: unknown): Promise<number> {
        console.warn("leaveChannel not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async renewToken(token: string): Promise<number> {
        console.warn("renewToken not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setChannelProfile(profile: CHANNEL_PROFILE_TYPE): Promise<number> {
        console.warn("setChannelProfile not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setClientRole(role: CLIENT_ROLE_TYPE): Promise<number>;
    async setClientRole(role: CLIENT_ROLE_TYPE, options: ClientRoleOptions): Promise<number>;
    async setClientRole(role: unknown, options?: unknown): Promise<number> {
        console.warn("setClientRole not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startEchoTest(config: EchoTestConfiguration): Promise<number> {
        console.warn("startEchoTest not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopEchoTest(): Promise<number> {
        console.warn("stopEchoTest not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableMultiCamera(enabled: boolean, config: CameraCapturerConfiguration): Promise<number> {
        console.warn("enableMultiCamera not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableVideo(): Promise<number> {
        console.warn("enableVideo not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async disableVideo(): Promise<number> {
        console.warn("disableVideo not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startPreview(): Promise<number>;
    async startPreview(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;
    async startPreview(sourceType?: unknown): Promise<number> {
        console.warn("startPreview not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopPreview(): Promise<number>;
    async stopPreview(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;
    async stopPreview(sourceType?: unknown): Promise<number> {
        console.warn("stopPreview not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startLastmileProbeTest(config: LastmileProbeConfig): Promise<number> {
        console.warn("startLastmileProbeTest not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopLastmileProbeTest(): Promise<number> {
        console.warn("stopLastmileProbeTest not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVideoEncoderConfiguration(config: VideoEncoderConfiguration): Promise<number> {
        console.warn("setVideoEncoderConfiguration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setBeautyEffectOptions(enabled: boolean, options: BeautyOptions, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("setBeautyEffectOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setFaceShapeBeautyOptions(
        enabled: boolean,
        options: FaceShapeBeautyOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setFaceShapeBeautyOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setFaceShapeAreaOptions(options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("setFaceShapeAreaOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getFaceShapeBeautyOptions(options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("getFaceShapeBeautyOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getFaceShapeAreaOptions(
        shapeArea: FACE_SHAPE_AREA,
        options: FaceShapeAreaOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("getFaceShapeAreaOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setFilterEffectOptions(
        enabled: boolean,
        options: FilterEffectOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setFilterEffectOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createVideoEffectObject(bundlePath: string, type: MEDIA_SOURCE_TYPE): Promise<IVideoEffectObject> {
        console.warn("createVideoEffectObject not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async destroyVideoEffectObject(videoEffectObject: IVideoEffectObject): Promise<number> {
        console.warn("destroyVideoEffectObject not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLowlightEnhanceOptions(
        enabled: boolean,
        options: LowlightEnhanceOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setLowlightEnhanceOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVideoDenoiserOptions(
        enabled: boolean,
        options: VideoDenoiserOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setVideoDenoiserOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setColorEnhanceOptions(
        enabled: boolean,
        options: ColorEnhanceOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setColorEnhanceOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableVirtualBackground(
        enabled: boolean,
        backgroundSource: VirtualBackgroundSource,
        segproperty: SegmentationProperty,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("enableVirtualBackground not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setupRemoteVideo(canvas: VideoCanvas): Promise<number> {
        console.warn("setupRemoteVideo not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setupLocalVideo(canvas: VideoCanvas): Promise<number> {
        console.warn("setupLocalVideo not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVideoScenario(scenarioType: VIDEO_APPLICATION_SCENARIO_TYPE): Promise<number> {
        console.warn("setVideoScenario not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVideoQoEPreference(qoePreference: VIDEO_QOE_PREFERENCE_TYPE): Promise<number> {
        console.warn("setVideoQoEPreference not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableAudio(): Promise<number> {
        console.warn("enableAudio not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async disableAudio(): Promise<number> {
        console.warn("disableAudio not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): Promise<number>;
    async setAudioProfile(profile: AUDIO_PROFILE_TYPE): Promise<number>;
    async setAudioProfile(profile: unknown, scenario?: unknown): Promise<number> {
        console.warn("setAudioProfile not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioScenario(scenario: AUDIO_SCENARIO_TYPE): Promise<number> {
        console.warn("setAudioScenario not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableLocalAudio(enabled: boolean): Promise<number> {
        console.warn("enableLocalAudio not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteLocalAudioStream(mute: boolean): Promise<number> {
        console.warn("muteLocalAudioStream not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteAllRemoteAudioStreams(mute: boolean): Promise<number> {
        console.warn("muteAllRemoteAudioStreams not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteRemoteAudioStream(uid: number, mute: boolean): Promise<number> {
        console.warn("muteRemoteAudioStream not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteLocalVideoStream(mute: boolean): Promise<number> {
        console.warn("muteLocalVideoStream not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableLocalVideo(enabled: boolean): Promise<number> {
        console.warn("enableLocalVideo not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteAllRemoteVideoStreams(mute: boolean): Promise<number> {
        console.warn("muteAllRemoteVideoStreams not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteDefaultVideoStreamType(streamType: VIDEO_STREAM_TYPE): Promise<number> {
        console.warn("setRemoteDefaultVideoStreamType not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteRemoteVideoStream(uid: number, mute: boolean): Promise<number> {
        console.warn("muteRemoteVideoStream not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteVideoStreamType(uid: number, streamType: VIDEO_STREAM_TYPE): Promise<number> {
        console.warn("setRemoteVideoStreamType not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteVideoSubscriptionOptions(uid: number, options: VideoSubscriptionOptions): Promise<number> {
        console.warn("setRemoteVideoSubscriptionOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeAudioBlocklist(uidList: number[], uidNumber: number): Promise<number> {
        console.warn("setSubscribeAudioBlocklist not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeAudioAllowlist(uidList: number[], uidNumber: number): Promise<number> {
        console.warn("setSubscribeAudioAllowlist not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeVideoBlocklist(uidList: number[], uidNumber: number): Promise<number> {
        console.warn("setSubscribeVideoBlocklist not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeVideoAllowlist(uidList: number[], uidNumber: number): Promise<number> {
        console.warn("setSubscribeVideoAllowlist not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): Promise<number> {
        console.warn("enableAudioVolumeIndication not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startAudioRecording(filePath: string, quality: AUDIO_RECORDING_QUALITY_TYPE): Promise<number>;
    async startAudioRecording(
        filePath: string,
        sampleRate: number,
        quality: AUDIO_RECORDING_QUALITY_TYPE,
    ): Promise<number>;
    async startAudioRecording(config: AudioRecordingConfiguration): Promise<number>;
    async startAudioRecording(filePath: unknown, sampleRate?: unknown, quality?: unknown): Promise<number> {
        console.warn("startAudioRecording not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async registerAudioEncodedFrameObserver(
        config: AudioEncodedFrameObserverConfig,
        observer: IAudioEncodedFrameObserver,
    ): Promise<number> {
        console.warn("registerAudioEncodedFrameObserver not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopAudioRecording(): Promise<number> {
        console.warn("stopAudioRecording not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createMediaPlayer(): Promise<IMediaPlayer> {
        console.warn("createMediaPlayer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async destroyMediaPlayer(media_player: IMediaPlayer): Promise<number> {
        console.warn("destroyMediaPlayer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createMediaRecorder(info: RecorderStreamInfo): Promise<IMediaRecorder> {
        console.warn("createMediaRecorder not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async destroyMediaRecorder(mediaRecorder: IMediaRecorder): Promise<number> {
        console.warn("destroyMediaRecorder not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startAudioMixing(filePath: string, loopback: boolean, cycle: number): Promise<number>;
    async startAudioMixing(filePath: string, loopback: boolean, cycle: number, startPos: number): Promise<number>;
    async startAudioMixing(filePath: unknown, loopback: unknown, cycle: unknown, startPos?: unknown): Promise<number> {
        console.warn("startAudioMixing not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopAudioMixing(): Promise<number> {
        console.warn("stopAudioMixing not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async pauseAudioMixing(): Promise<number> {
        console.warn("pauseAudioMixing not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async resumeAudioMixing(): Promise<number> {
        console.warn("resumeAudioMixing not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async selectAudioTrack(index: number): Promise<number> {
        console.warn("selectAudioTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getAudioTrackCount(): Promise<number> {
        console.warn("getAudioTrackCount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustAudioMixingVolume(volume: number): Promise<number> {
        console.warn("adjustAudioMixingVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustAudioMixingPublishVolume(volume: number): Promise<number> {
        console.warn("adjustAudioMixingPublishVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getAudioMixingPublishVolume(): Promise<number> {
        console.warn("getAudioMixingPublishVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustAudioMixingPlayoutVolume(volume: number): Promise<number> {
        console.warn("adjustAudioMixingPlayoutVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getAudioMixingPlayoutVolume(): Promise<number> {
        console.warn("getAudioMixingPlayoutVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getAudioMixingDuration(): Promise<number> {
        console.warn("getAudioMixingDuration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getAudioMixingCurrentPosition(): Promise<number> {
        console.warn("getAudioMixingCurrentPosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioMixingPosition(pos: number): Promise<number> {
        console.warn("setAudioMixingPosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): Promise<number> {
        console.warn("setAudioMixingDualMonoMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioMixingPitch(pitch: number): Promise<number> {
        console.warn("setAudioMixingPitch not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioMixingPlaybackSpeed(speed: number): Promise<number> {
        console.warn("setAudioMixingPlaybackSpeed not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getEffectsVolume(): Promise<number> {
        console.warn("getEffectsVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setEffectsVolume(volume: number): Promise<number> {
        console.warn("setEffectsVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async preloadEffect(soundId: number, filePath: string, startPos: number): Promise<number> {
        console.warn("preloadEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async playEffect(
        soundId: number,
        filePath: string,
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
        startPos: number,
    ): Promise<number> {
        console.warn("playEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async playAllEffects(
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
    ): Promise<number> {
        console.warn("playAllEffects not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getVolumeOfEffect(soundId: number): Promise<number> {
        console.warn("getVolumeOfEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVolumeOfEffect(soundId: number, volume: number): Promise<number> {
        console.warn("setVolumeOfEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async pauseEffect(soundId: number): Promise<number> {
        console.warn("pauseEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async pauseAllEffects(): Promise<number> {
        console.warn("pauseAllEffects not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async resumeEffect(soundId: number): Promise<number> {
        console.warn("resumeEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async resumeAllEffects(): Promise<number> {
        console.warn("resumeAllEffects not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopEffect(soundId: number): Promise<number> {
        console.warn("stopEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopAllEffects(): Promise<number> {
        console.warn("stopAllEffects not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async unloadEffect(soundId: number): Promise<number> {
        console.warn("unloadEffect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async unloadAllEffects(): Promise<number> {
        console.warn("unloadAllEffects not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getEffectDuration(filePath: string): Promise<number> {
        console.warn("getEffectDuration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setEffectPosition(soundId: number, pos: number): Promise<number> {
        console.warn("setEffectPosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getEffectCurrentPosition(soundId: number): Promise<number> {
        console.warn("getEffectCurrentPosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableSoundPositionIndication(enabled: boolean): Promise<number> {
        console.warn("enableSoundPositionIndication not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteVoicePosition(uid: number, pan: number, gain: number): Promise<number> {
        console.warn("setRemoteVoicePosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableSpatialAudio(enabled: boolean): Promise<number> {
        console.warn("enableSpatialAudio not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): Promise<number> {
        console.warn("setRemoteUserSpatialAudioParams not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): Promise<number> {
        console.warn("setVoiceBeautifierPreset not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): Promise<number> {
        console.warn("setAudioEffectPreset not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): Promise<number> {
        console.warn("setVoiceConversionPreset not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioEffectParameters(preset: AUDIO_EFFECT_PRESET, param1: number, param2: number): Promise<number> {
        console.warn("setAudioEffectParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVoiceBeautifierParameters(
        preset: VOICE_BEAUTIFIER_PRESET,
        param1: number,
        param2: number,
    ): Promise<number> {
        console.warn("setVoiceBeautifierParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVoiceConversionParameters(
        preset: VOICE_CONVERSION_PRESET,
        param1: number,
        param2: number,
    ): Promise<number> {
        console.warn("setVoiceConversionParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalVoicePitch(pitch: number): Promise<number> {
        console.warn("setLocalVoicePitch not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalVoiceFormant(formantRatio: number): Promise<number> {
        console.warn("setLocalVoiceFormant not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalVoiceEqualization(
        bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY,
        bandGain: number,
    ): Promise<number> {
        console.warn("setLocalVoiceEqualization not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): Promise<number> {
        console.warn("setLocalVoiceReverb not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setHeadphoneEQPreset(preset: HEADPHONE_EQUALIZER_PRESET): Promise<number> {
        console.warn("setHeadphoneEQPreset not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setHeadphoneEQParameters(lowGain: number, highGain: number): Promise<number> {
        console.warn("setHeadphoneEQParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableVoiceAITuner(enabled: boolean, type: VOICE_AI_TUNER_TYPE): Promise<number> {
        console.warn("enableVoiceAITuner not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLogFile(filePath: string): Promise<number> {
        console.warn("setLogFile not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLogFilter(filter: number): Promise<number> {
        console.warn("setLogFilter not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLogLevel(level: LOG_LEVEL): Promise<number> {
        console.warn("setLogLevel not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLogFileSize(fileSizeInKBytes: number): Promise<number> {
        console.warn("setLogFileSize not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async uploadLogFile(requestId: string): Promise<number> {
        console.warn("uploadLogFile not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async writeLog(level: LOG_LEVEL, fmt: string): Promise<number> {
        console.warn("writeLog not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number>;
    async setLocalRenderMode(renderMode: RENDER_MODE_TYPE): Promise<number>;
    async setLocalRenderMode(renderMode: unknown, mirrorMode?: unknown): Promise<number> {
        console.warn("setLocalRenderMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteRenderMode(
        uid: number,
        renderMode: RENDER_MODE_TYPE,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE,
    ): Promise<number> {
        console.warn("setRemoteRenderMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalRenderTargetFps(sourceType: VIDEO_SOURCE_TYPE, targetFps: number): Promise<number> {
        console.warn("setLocalRenderTargetFps not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteRenderTargetFps(targetFps: number): Promise<number> {
        console.warn("setRemoteRenderTargetFps not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number> {
        console.warn("setLocalVideoMirrorMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableDualStreamMode(enabled: boolean): Promise<number>;
    async enableDualStreamMode(enabled: boolean, streamConfig: SimulcastStreamConfig): Promise<number>;
    async enableDualStreamMode(enabled: unknown, streamConfig?: unknown): Promise<number> {
        console.warn("enableDualStreamMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setDualStreamMode(mode: SIMULCAST_STREAM_MODE): Promise<number>;
    async setDualStreamMode(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig): Promise<number>;
    async setDualStreamMode(mode: unknown, streamConfig?: unknown): Promise<number> {
        console.warn("setDualStreamMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSimulcastConfig(simulcastConfig: SimulcastConfig): Promise<number> {
        console.warn("setSimulcastConfig not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRecordingAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number> {
        console.warn("setRecordingAudioFrameParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setPlaybackAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number> {
        console.warn("setPlaybackAudioFrameParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setMixedAudioFrameParameters(sampleRate: number, channel: number, samplesPerCall: number): Promise<number> {
        console.warn("setMixedAudioFrameParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setEarMonitoringAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number> {
        console.warn("setEarMonitoringAudioFrameParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number): Promise<number>;
    async setPlaybackAudioFrameBeforeMixingParameters(
        sampleRate: number,
        channel: number,
        samplesPerCall: number,
    ): Promise<number>;
    async setPlaybackAudioFrameBeforeMixingParameters(
        sampleRate: unknown,
        channel: unknown,
        samplesPerCall?: unknown,
    ): Promise<number> {
        console.warn("setPlaybackAudioFrameBeforeMixingParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableAudioSpectrumMonitor(intervalInMS: number): Promise<number> {
        console.warn("enableAudioSpectrumMonitor not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async disableAudioSpectrumMonitor(): Promise<number> {
        console.warn("disableAudioSpectrumMonitor not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustRecordingSignalVolume(volume: number): Promise<number> {
        console.warn("adjustRecordingSignalVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteRecordingSignal(mute: boolean): Promise<number> {
        console.warn("muteRecordingSignal not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustPlaybackSignalVolume(volume: number): Promise<number> {
        console.warn("adjustPlaybackSignalVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustUserPlaybackSignalVolume(uid: number, volume: number): Promise<number> {
        console.warn("adjustUserPlaybackSignalVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): Promise<number> {
        console.warn("setRemoteSubscribeFallbackOption not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setHighPriorityUserList(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS): Promise<number> {
        console.warn("setHighPriorityUserList not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableExtension(
        provider: string,
        extension: string,
        extensionInfo: ExtensionInfo,
        enable: boolean,
    ): Promise<number>;
    async enableExtension(
        provider: string,
        extension: string,
        enable: boolean,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;
    async enableExtension(provider: unknown, extension: unknown, enable: unknown, type: unknown): Promise<number> {
        console.warn("enableExtension not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setExtensionProperty(
        provider: string,
        extension: string,
        extensionInfo: ExtensionInfo,
        key: string,
        value: string,
    ): Promise<number>;
    async setExtensionProperty(
        provider: string,
        extension: string,
        key: string,
        value: string,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number>;
    async setExtensionProperty(
        provider: unknown,
        extension: unknown,
        key: unknown,
        value: unknown,
        type: unknown,
    ): Promise<number> {
        console.warn("setExtensionProperty not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getExtensionProperty(
        provider: string,
        extension: string,
        extensionInfo: ExtensionInfo,
        key: string,
        buf_len: number,
    ): Promise<{ errorCode: number; value: string }>;
    async getExtensionProperty(
        provider: string,
        extension: string,
        key: string,
        buf_len: number,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<{ errorCode: number; value: number }>;
    async getExtensionProperty(
        provider: unknown,
        extension: unknown,
        key: unknown,
        buf_len: unknown,
        type: unknown,
    ): Promise<{ errorCode: number; value: string }> | Promise<{ errorCode: number; value: number }> {
        console.warn("getExtensionProperty not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableLoopbackRecording(enabled: boolean, deviceName: string): Promise<number> {
        console.warn("enableLoopbackRecording not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustLoopbackSignalVolume(volume: number): Promise<number> {
        console.warn("adjustLoopbackSignalVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getLoopbackRecordingVolume(): Promise<number> {
        console.warn("getLoopbackRecordingVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableInEarMonitoring(enabled: boolean, includeAudioFilters: number): Promise<number> {
        console.warn("enableInEarMonitoring not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setInEarMonitoringVolume(volume: number): Promise<number> {
        console.warn("setInEarMonitoringVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async loadExtensionProvider(path: string, unload_after_use: boolean): Promise<number> {
        console.warn("loadExtensionProvider not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setExtensionProviderProperty(provider: string, key: string, value: string): Promise<number> {
        console.warn("setExtensionProviderProperty not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async registerExtension(provider: string, extension: string, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("registerExtension not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraCapturerConfiguration(config: CameraCapturerConfiguration): Promise<number> {
        console.warn("setCameraCapturerConfiguration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createCustomVideoTrack(): Promise<number> {
        console.warn("createCustomVideoTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createCustomEncodedVideoTrack(sender_option: SenderOptions): Promise<number> {
        console.warn("createCustomEncodedVideoTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async destroyCustomVideoTrack(video_track_id: number): Promise<number> {
        console.warn("destroyCustomVideoTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async destroyCustomEncodedVideoTrack(video_track_id: number): Promise<number> {
        console.warn("destroyCustomEncodedVideoTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async switchCamera(): Promise<number> {
        console.warn("switchCamera not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraZoomSupported(): Promise<boolean> {
        console.warn("isCameraZoomSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraFaceDetectSupported(): Promise<boolean> {
        console.warn("isCameraFaceDetectSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraTorchSupported(): Promise<boolean> {
        console.warn("isCameraTorchSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraFocusSupported(): Promise<boolean> {
        console.warn("isCameraFocusSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraAutoFocusFaceModeSupported(): Promise<boolean> {
        console.warn("isCameraAutoFocusFaceModeSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraZoomFactor(factor: number): Promise<number> {
        console.warn("setCameraZoomFactor not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableFaceDetection(enabled: boolean): Promise<number> {
        console.warn("enableFaceDetection not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getCameraMaxZoomFactor(): Promise<number> {
        console.warn("getCameraMaxZoomFactor not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraFocusPositionInPreview(positionX: number, positionY: number): Promise<number> {
        console.warn("setCameraFocusPositionInPreview not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraTorchOn(isOn: boolean): Promise<number> {
        console.warn("setCameraTorchOn not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraAutoFocusFaceModeEnabled(enabled: boolean): Promise<number> {
        console.warn("setCameraAutoFocusFaceModeEnabled not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraExposurePositionSupported(): Promise<boolean> {
        console.warn("isCameraExposurePositionSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraExposurePosition(positionXinView: number, positionYinView: number): Promise<number> {
        console.warn("setCameraExposurePosition not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraExposureSupported(): Promise<boolean> {
        console.warn("isCameraExposureSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraExposureFactor(factor: number): Promise<number> {
        console.warn("setCameraExposureFactor not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraAutoExposureFaceModeSupported(): Promise<boolean> {
        console.warn("isCameraAutoExposureFaceModeSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraAutoExposureFaceModeEnabled(enabled: boolean): Promise<number> {
        console.warn("setCameraAutoExposureFaceModeEnabled not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraStabilizationMode(mode: CAMERA_STABILIZATION_MODE): Promise<number> {
        console.warn("setCameraStabilizationMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): Promise<number> {
        console.warn("setDefaultAudioRouteToSpeakerphone not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setEnableSpeakerphone(speakerOn: boolean): Promise<number> {
        console.warn("setEnableSpeakerphone not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isSpeakerphoneEnabled(): Promise<boolean> {
        console.warn("isSpeakerphoneEnabled not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRouteInCommunicationMode(route: number): Promise<number> {
        console.warn("setRouteInCommunicationMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isCameraCenterStageSupported(): Promise<boolean> {
        console.warn("isCameraCenterStageSupported not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableCameraCenterStage(enabled: boolean): Promise<number> {
        console.warn("enableCameraCenterStage not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getScreenCaptureSources(
        thumbSize: SIZE,
        iconSize: SIZE,
        includeScreen: boolean,
    ): Promise<ScreenCaptureSourceInfo[]> {
        console.warn("getScreenCaptureSources not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAudioSessionOperationRestriction(restriction: AUDIO_SESSION_OPERATION_RESTRICTION): Promise<number> {
        console.warn("setAudioSessionOperationRestriction not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startScreenCaptureByDisplayId(
        displayId: number,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        console.warn("startScreenCaptureByDisplayId not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startScreenCaptureByScreenRect(
        screenRect: Rectangle,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        console.warn("startScreenCaptureByScreenRect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getAudioDeviceInfo(): Promise<{ errorCode: number; deviceInfo: DeviceInfo }> {
        console.warn("getAudioDeviceInfo not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startScreenCaptureByWindowId(
        windowId: number,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        console.warn("startScreenCaptureByWindowId not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setScreenCaptureContentHint(contentHint: VIDEO_CONTENT_HINT): Promise<number> {
        console.warn("setScreenCaptureContentHint not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateScreenCaptureRegion(regionRect: Rectangle): Promise<number> {
        console.warn("updateScreenCaptureRegion not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateScreenCaptureParameters(captureParams: ScreenCaptureParameters): Promise<number> {
        console.warn("updateScreenCaptureParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startScreenCapture(captureParams: ScreenCaptureParameters2): Promise<number>;
    async startScreenCapture(sourceType: VIDEO_SOURCE_TYPE, config: ScreenCaptureConfiguration): Promise<number>;
    async startScreenCapture(sourceType: unknown, config?: unknown): Promise<number> {
        console.warn("startScreenCapture not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateScreenCapture(captureParams: ScreenCaptureParameters2): Promise<number> {
        console.warn("updateScreenCapture not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async queryScreenCaptureCapability(): Promise<number> {
        console.warn("queryScreenCaptureCapability not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async queryCameraFocalLengthCapability(focalLengthInfos: FocalLengthInfo[], size: number): Promise<number> {
        console.warn("queryCameraFocalLengthCapability not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setExternalMediaProjection(mediaProjection: unknown): Promise<number> {
        console.warn("setExternalMediaProjection not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setScreenCaptureScenario(screenScenario: SCREEN_SCENARIO_TYPE): Promise<number> {
        console.warn("setScreenCaptureScenario not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopScreenCapture(): Promise<number>;
    async stopScreenCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;
    async stopScreenCapture(sourceType?: unknown): Promise<number> {
        console.warn("stopScreenCapture not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getCallId(callId: string): Promise<number> {
        console.warn("getCallId not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async rate(callId: string, rating: number, description: string): Promise<number> {
        console.warn("rate not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async complain(callId: string, description: string): Promise<number> {
        console.warn("complain not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startRtmpStreamWithoutTranscoding(url: string): Promise<number> {
        console.warn("startRtmpStreamWithoutTranscoding not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): Promise<number> {
        console.warn("startRtmpStreamWithTranscoding not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateRtmpTranscoding(transcoding: LiveTranscoding): Promise<number> {
        console.warn("updateRtmpTranscoding not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startLocalVideoTranscoder(config: LocalTranscoderConfiguration): Promise<number> {
        console.warn("startLocalVideoTranscoder not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): Promise<number> {
        console.warn("updateLocalTranscoderConfiguration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopRtmpStream(url: string): Promise<number> {
        console.warn("stopRtmpStream not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopLocalVideoTranscoder(): Promise<number> {
        console.warn("stopLocalVideoTranscoder not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startLocalAudioMixer(config: LocalAudioMixerConfiguration): Promise<number> {
        console.warn("startLocalAudioMixer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateLocalAudioMixerConfiguration(config: LocalAudioMixerConfiguration): Promise<number> {
        console.warn("updateLocalAudioMixerConfiguration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopLocalAudioMixer(): Promise<number> {
        console.warn("stopLocalAudioMixer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startCameraCapture(sourceType: VIDEO_SOURCE_TYPE, config: CameraCapturerConfiguration): Promise<number> {
        console.warn("startCameraCapture not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopCameraCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number> {
        console.warn("stopCameraCapture not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCameraDeviceOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number> {
        console.warn("setCameraDeviceOrientation not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setScreenCaptureOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number> {
        console.warn("setScreenCaptureOrientation not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getConnectionState(): Promise<CONNECTION_STATE_TYPE> {
        console.warn("getConnectionState not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): Promise<number> {
        console.warn("setRemoteUserPriority not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableEncryption(enabled: boolean, config: EncryptionConfig): Promise<number> {
        console.warn("enableEncryption not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createDataStream(streamId: number, reliable: boolean, ordered: boolean): Promise<number>;
    async createDataStream(streamId: number, config: DataStreamConfig): Promise<number>;
    async createDataStream(streamId: unknown, reliable: unknown, ordered?: unknown): Promise<number> {
        console.warn("createDataStream not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendStreamMessage(streamId: number, data: Uint8Array, length: number): Promise<number> {
        console.warn("sendStreamMessage not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendRdtMessage(uid: number, type: RdtStreamType, data: string, length: number): Promise<number> {
        console.warn("sendRdtMessage not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendMediaControlMessage(uid: number, data: string, length: number): Promise<number> {
        console.warn("sendMediaControlMessage not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async addVideoWatermark(watermark: RtcImage): Promise<number>;
    async addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): Promise<number>;
    async addVideoWatermark(configs: WatermarkConfig): Promise<number>;
    async addVideoWatermark(watermarkUrl: unknown, options?: unknown): Promise<number> {
        console.warn("addVideoWatermark not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async removeVideoWatermark(id: string): Promise<number> {
        console.warn("removeVideoWatermark not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async clearVideoWatermarks(): Promise<number> {
        console.warn("clearVideoWatermarks not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async pauseAudio(): Promise<number> {
        console.warn("pauseAudio not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async resumeAudio(): Promise<number> {
        console.warn("resumeAudio not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableWebSdkInteroperability(enabled: boolean): Promise<number> {
        console.warn("enableWebSdkInteroperability not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendCustomReportMessage(
        id: string,
        category: string,
        event: string,
        label: string,
        value: number,
    ): Promise<number> {
        console.warn("sendCustomReportMessage not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startAudioFrameDump(
        channel_id: string,
        uid: number,
        location: string,
        uuid: string,
        passwd: string,
        duration_ms: number,
        auto_upload: boolean,
    ): Promise<number> {
        console.warn("startAudioFrameDump not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopAudioFrameDump(channel_id: string, uid: number, location: string): Promise<number> {
        console.warn("stopAudioFrameDump not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAINSMode(enabled: boolean, mode: AUDIO_AINS_MODE): Promise<number> {
        console.warn("setAINSMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async registerLocalUserAccount(appId: string, userAccount: string): Promise<number> {
        console.warn("registerLocalUserAccount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async joinChannelWithUserAccount(token: string, channelId: string, userAccount: string): Promise<number>;
    async joinChannelWithUserAccount(
        token: string,
        channelId: string,
        userAccount: string,
        options: ChannelMediaOptions,
    ): Promise<number>;
    async joinChannelWithUserAccount(
        token: unknown,
        channelId: unknown,
        userAccount: unknown,
        options?: unknown,
    ): Promise<number> {
        console.warn("joinChannelWithUserAccount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getUserInfoByUserAccount(userAccount: string): Promise<{ errorCode: number; userInfo: UserInfo }> {
        console.warn("getUserInfoByUserAccount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getUserInfoByUid(uid: number): Promise<{ errorCode: number; userInfo: UserInfo }> {
        console.warn("getUserInfoByUid not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startOrUpdateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): Promise<number> {
        console.warn("startOrUpdateChannelMediaRelay not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopChannelMediaRelay(): Promise<number> {
        console.warn("stopChannelMediaRelay not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async pauseAllChannelMediaRelay(): Promise<number> {
        console.warn("pauseAllChannelMediaRelay not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async resumeAllChannelMediaRelay(): Promise<number> {
        console.warn("resumeAllChannelMediaRelay not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setDirectCdnStreamingAudioConfiguration(profile: AUDIO_PROFILE_TYPE): Promise<number> {
        console.warn("setDirectCdnStreamingAudioConfiguration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setDirectCdnStreamingVideoConfiguration(config: VideoEncoderConfiguration): Promise<number> {
        console.warn("setDirectCdnStreamingVideoConfiguration not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startDirectCdnStreaming(publishUrl: string, options: DirectCdnStreamingMediaOptions): Promise<number> {
        console.warn("startDirectCdnStreaming not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopDirectCdnStreaming(): Promise<number> {
        console.warn("stopDirectCdnStreaming not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateDirectCdnStreamingMediaOptions(options: DirectCdnStreamingMediaOptions): Promise<number> {
        console.warn("updateDirectCdnStreamingMediaOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startRhythmPlayer(sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): Promise<number> {
        console.warn("startRhythmPlayer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopRhythmPlayer(): Promise<number> {
        console.warn("stopRhythmPlayer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async configRhythmPlayer(config: AgoraRhythmPlayerConfig): Promise<number> {
        console.warn("configRhythmPlayer not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async takeSnapshot(uid: number, filePath: string): Promise<number>;
    async takeSnapshot(uid: number, config: SnapshotConfig): Promise<number>;
    async takeSnapshot(uid: unknown, config: unknown): Promise<number> {
        console.warn("takeSnapshot not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableContentInspect(enabled: boolean, config: ContentInspectConfig): Promise<number> {
        console.warn("enableContentInspect not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustCustomAudioPublishVolume(trackId: number, volume: number): Promise<number> {
        console.warn("adjustCustomAudioPublishVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustCustomAudioPlayoutVolume(trackId: number, volume: number): Promise<number> {
        console.warn("adjustCustomAudioPlayoutVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setCloudProxy(proxyType: CLOUD_PROXY_TYPE): Promise<number> {
        console.warn("setCloudProxy not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setLocalAccessPoint(config: LocalAccessPointConfiguration): Promise<number> {
        console.warn("setLocalAccessPoint not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAdvancedAudioOptions(options: AdvancedAudioOptions, sourceType: number): Promise<number> {
        console.warn("setAdvancedAudioOptions not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setAVSyncSource(channelId: string, uid: number): Promise<number> {
        console.warn("setAVSyncSource not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableVideoImageSource(enable: boolean, options: ImageTrackOptions): Promise<number> {
        console.warn("enableVideoImageSource not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getCurrentMonotonicTimeInMs(): Promise<number> {
        console.warn("getCurrentMonotonicTimeInMs not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getNetworkType(): Promise<number> {
        console.warn("getNetworkType not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setParameters(parameters: object): Promise<number> {
        console.warn("setParameters not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startMediaRenderingTracing(): Promise<number> {
        console.warn("startMediaRenderingTracing not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableInstantMediaRendering(): Promise<number> {
        console.warn("enableInstantMediaRendering not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getNtpWallTimeInMs(): Promise<number> {
        console.warn("getNtpWallTimeInMs not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async isFeatureAvailableOnDevice(type: FeatureType): Promise<boolean> {
        console.warn("isFeatureAvailableOnDevice not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendAudioMetadata(metadata: Uint8Array, length: number): Promise<number> {
        console.warn("sendAudioMetadata not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async queryHDRCapability(videoModule: VIDEO_MODULE_TYPE, capability: HDR_CAPABILITY): Promise<number> {
        console.warn("queryHDRCapability not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setParametersEx(connection: RtcConnection, parameters: object): Promise<number>;
    async setParametersEx(connection: RtcConnection, parameters: string): Promise<number>;
    async setParametersEx(connection: unknown, parameters: unknown): Promise<number> {
        console.warn("setParametersEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): Promise<number> {
        console.warn("joinChannelEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async leaveChannelEx(connection: RtcConnection): Promise<number>;
    async leaveChannelEx(connection: RtcConnection, options: LeaveChannelOptions): Promise<number>;
    async leaveChannelEx(connection: unknown, options?: unknown): Promise<number> {
        console.warn("leaveChannelEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async leaveChannelWithUserAccountEx(channelId: string, userAccount: string): Promise<number>;
    async leaveChannelWithUserAccountEx(
        channelId: string,
        userAccount: string,
        options: LeaveChannelOptions,
    ): Promise<number>;
    async leaveChannelWithUserAccountEx(channelId: unknown, userAccount: unknown, options?: unknown): Promise<number> {
        console.warn("leaveChannelWithUserAccountEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): Promise<number> {
        console.warn("updateChannelMediaOptionsEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setVideoEncoderConfigurationEx(
        config: VideoEncoderConfiguration,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setVideoEncoderConfigurationEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): Promise<number> {
        console.warn("setupRemoteVideoEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteRemoteAudioStreamEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteRemoteVideoStreamEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteVideoStreamTypeEx(
        uid: number,
        streamType: VIDEO_STREAM_TYPE,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setRemoteVideoStreamTypeEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteLocalAudioStreamEx(mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteLocalAudioStreamEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteLocalVideoStreamEx(mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteLocalVideoStreamEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteAllRemoteAudioStreamsEx(mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteAllRemoteAudioStreamsEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteAllRemoteVideoStreamsEx(mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteAllRemoteVideoStreamsEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeAudioBlocklistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setSubscribeAudioBlocklistEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeAudioAllowlistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setSubscribeAudioAllowlistEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeVideoBlocklistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setSubscribeVideoBlocklistEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSubscribeVideoAllowlistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setSubscribeVideoAllowlistEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteVideoSubscriptionOptionsEx(
        uid: number,
        options: VideoSubscriptionOptions,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setRemoteVideoSubscriptionOptionsEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): Promise<number> {
        console.warn("setRemoteVoicePositionEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteUserSpatialAudioParamsEx(
        uid: number,
        params: SpatialAudioParams,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setRemoteUserSpatialAudioParamsEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setRemoteRenderModeEx(
        uid: number,
        renderMode: RENDER_MODE_TYPE,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setRemoteRenderModeEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName: string): Promise<number> {
        console.warn("enableLoopbackRecordingEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustRecordingSignalVolumeEx(volume: number, connection: RtcConnection): Promise<number> {
        console.warn("adjustRecordingSignalVolumeEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async muteRecordingSignalEx(mute: boolean, connection: RtcConnection): Promise<number> {
        console.warn("muteRecordingSignalEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async adjustUserPlaybackSignalVolumeEx(uid: number, volume: number, connection: RtcConnection): Promise<number> {
        console.warn("adjustUserPlaybackSignalVolumeEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getConnectionStateEx(connection: RtcConnection): Promise<CONNECTION_STATE_TYPE> {
        console.warn("getConnectionStateEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): Promise<number> {
        console.warn("enableEncryptionEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async createDataStreamEx(
        streamId: number,
        reliable: boolean,
        ordered: boolean,
        connection: RtcConnection,
    ): Promise<number>;
    async createDataStreamEx(streamId: number, config: DataStreamConfig, connection: RtcConnection): Promise<number>;
    async createDataStreamEx(
        streamId: unknown,
        reliable: unknown,
        ordered: unknown,
        connection?: unknown,
    ): Promise<number> {
        console.warn("createDataStreamEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendStreamMessageEx(
        streamId: number,
        data: Uint8Array,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("sendStreamMessageEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendRdtMessageEx(
        uid: number,
        type: RdtStreamType,
        data: string,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("sendRdtMessageEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendMediaControlMessageEx(
        uid: number,
        data: string,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("sendMediaControlMessageEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async addVideoWatermarkEx(
        watermarkUrl: string,
        options: WatermarkOptions,
        connection: RtcConnection,
    ): Promise<number>;
    async addVideoWatermarkEx(config: WatermarkConfig, connection: RtcConnection): Promise<number>;
    async addVideoWatermarkEx(watermarkUrl: unknown, options: unknown, connection?: unknown): Promise<number> {
        console.warn("addVideoWatermarkEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async removeVideoWatermarkEx(id: string, connection: RtcConnection): Promise<number> {
        console.warn("removeVideoWatermarkEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async clearVideoWatermarkEx(connection: RtcConnection): Promise<number> {
        console.warn("clearVideoWatermarkEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendCustomReportMessageEx(
        id: string,
        category: string,
        event: string,
        label: string,
        value: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("sendCustomReportMessageEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableAudioVolumeIndicationEx(
        interval: number,
        smooth: number,
        reportVad: boolean,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("enableAudioVolumeIndicationEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startRtmpStreamWithoutTranscodingEx(url: string, connection: RtcConnection): Promise<number> {
        console.warn("startRtmpStreamWithoutTranscodingEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startRtmpStreamWithTranscodingEx(
        url: string,
        transcoding: LiveTranscoding,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("startRtmpStreamWithTranscodingEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async updateRtmpTranscodingEx(transcoding: LiveTranscoding, connection: RtcConnection): Promise<number> {
        console.warn("updateRtmpTranscodingEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopRtmpStreamEx(url: string, connection: RtcConnection): Promise<number> {
        console.warn("stopRtmpStreamEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startOrUpdateChannelMediaRelayEx(
        configuration: ChannelMediaRelayConfiguration,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("startOrUpdateChannelMediaRelayEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async stopChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        console.warn("stopChannelMediaRelayEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async pauseAllChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        console.warn("pauseAllChannelMediaRelayEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async resumeAllChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        console.warn("resumeAllChannelMediaRelayEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getUserInfoByUserAccountEx(
        userAccount: string,
        userInfo: UserInfo,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("getUserInfoByUserAccountEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getUserInfoByUidEx(uid: number, userInfo: UserInfo, connection: RtcConnection): Promise<number> {
        console.warn("getUserInfoByUidEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableDualStreamModeEx(
        enabled: boolean,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("enableDualStreamModeEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setDualStreamModeEx(
        mode: SIMULCAST_STREAM_MODE,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setDualStreamModeEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setSimulcastConfigEx(simulcastConfig: SimulcastConfig, connection: RtcConnection): Promise<number> {
        console.warn("setSimulcastConfigEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async setHighPriorityUserListEx(
        uidList: number[],
        uidNum: number,
        option: STREAM_FALLBACK_OPTIONS,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setHighPriorityUserListEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async takeSnapshotEx(connection: RtcConnection, uid: number, filePath: string): Promise<number>;
    async takeSnapshotEx(connection: RtcConnection, uid: number, config: SnapshotConfig): Promise<number>;
    async takeSnapshotEx(connection: unknown, uid: unknown, config: unknown): Promise<number> {
        console.warn("takeSnapshotEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async enableContentInspectEx(
        enabled: boolean,
        config: ContentInspectConfig,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("enableContentInspectEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async startMediaRenderingTracingEx(connection: RtcConnection): Promise<number> {
        console.warn("startMediaRenderingTracingEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async getCallIdEx(callId: string, connection: RtcConnection): Promise<number> {
        console.warn("getCallIdEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async sendAudioMetadataEx(connection: RtcConnection, metadata: Uint8Array, length: number): Promise<number> {
        console.warn("sendAudioMetadataEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async preloadEffectEx(
        connection: RtcConnection,
        soundId: number,
        filePath: string,
        startPos: number,
    ): Promise<number> {
        console.warn("preloadEffectEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
    async playEffectEx(
        connection: RtcConnection,
        soundId: number,
        filePath: string,
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
        startPos: number,
    ): Promise<number> {
        console.warn("playEffectEx not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
}
