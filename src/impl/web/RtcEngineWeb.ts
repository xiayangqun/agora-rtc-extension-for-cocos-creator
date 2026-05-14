import { UserInfo } from "../../types/AgoraBase";
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
    Rectangle,
    VIDEO_CODEC_CAPABILITY_LEVEL,
    DeviceInfo,
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
    VideoEncoderConfiguration as NativeVideoEncoderConfiguration,
    ERROR_CODE_TYPE,
    AREA_CODE,
    THREAD_PRIORITY_TYPE,
} from "../../types/AgoraBase";
import { LOG_LEVEL, LogConfig } from "../../types/AgoraLog";
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
    ExtensionInfo,
    MEDIA_DEVICE_TYPE,
} from "../../types/AgoraRtcEngine";
import { RtcConnection } from "../../types/AgoraRtcEngineEx";
import { IRtcEngineEventHandler } from "../../interface/IRtcEngineEventHandler";
import AgoraRTC, {
    IAgoraRTCClient,
    ILocalAudioTrack,
    ILocalVideoTrack,
    ILocalDataChannel,
    ClientConfig,
    UID,
    DeviceInfo as WebDeviceInfo,
    AREAS,
    IAgoraRTCError,
} from "agora-rtc-sdk-ng";
import { AgoraRTCClientProxy } from "./AgoraRTCClientProxy";
import { TrackManager } from "./TrackManager";
import { isAgoraRTCError, Native2Web, Web2Native } from "./Helper";
import { AudioDeviceManagerWeb } from "./AudioDeviceManagerWeb";
import { VideoDeviceManagerWeb } from "./VideoDeviceManagerWeb";
import { MusicContentCenterWeb } from "./MusicContentCenterWeb";
import { MediaPlayerCacheManagerWeb } from "./MediaPlayerCacheManagerWeb";
import { MediaPlayerWeb } from "./MediaPlayerWeb";
import { LocalSpatialAudioEngineWeb } from "./LocalSpatialAudioEngineWeb";
import { H265TranscoderWeb } from "./H265TranscoderWeb";
import { set } from "../../../@types/packages/scene/@types/cce/utils/lodash";

const ERR_OK = ERROR_CODE_TYPE.ERR_OK;
const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
const ERR_NOT_READY = ERROR_CODE_TYPE.ERR_NOT_READY;
const ERR_INVALID_ARGUMENT = ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
const ERR_FAILED = ERROR_CODE_TYPE.ERR_FAILED;

function connectionKey(connection: RtcConnection): string {
    return `${connection.channelId}_${connection.localUid}`;
}

export class RtcEngineWeb implements IRtcEngineEx {
    public rtcEngineEventHandler?: IRtcEngineEventHandler;

    //come from  initialize parameters
    public appId: string;
    public channelProfile: CHANNEL_PROFILE_TYPE = CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_COMMUNICATION;
    public audioScenario: AUDIO_SCENARIO_TYPE = AUDIO_SCENARIO_TYPE.AUDIO_SCENARIO_DEFAULT;
    public areaCode: AREA_CODE = AREA_CODE.AREA_CODE_GLOB;
    public logConfig: LogConfig = { level: LOG_LEVEL.LOG_LEVEL_NONE, filePath: "", fileSizeInKB: 0 };
    public threadPriority: THREAD_PRIORITY_TYPE = THREAD_PRIORITY_TYPE.NORMAL;
    public useExternalEglContext = false;
    public domainLimit = false;

    //copy from setLocalVideoDataSourcePosition parameters
    public localVideoDataSourcePosition: VIDEO_MODULE_POSITION = VIDEO_MODULE_POSITION.POSITION_POST_CAPTURER;

    public mainClientProxy: AgoraRTCClientProxy;
    public mainClientVideoEncoderConfiguration: NativeVideoEncoderConfiguration;
    public subClientProxies: Map<string, AgoraRTCClientProxy> = new Map();
    public subClientVideoEncoderConfigurations: Map<string, NativeVideoEncoderConfiguration> = new Map();
    public audioEnabled = true;
    public videoEnabled = false;
    public dualStreamEnabled = false;
    public audioVolumeIndicationEnabled = false;

    public trackManager: TrackManager = new TrackManager();

    private _localVideoTrack?: ILocalVideoTrack;
    private _mediaPlayerIdCounter = 0;
    private _mediaPlayers: Map<number, MediaPlayerWeb> = new Map();

    constructor() {
        AgoraRTC.on("camera-changed", this.onCameraChanged.bind(this));
        AgoraRTC.on("microphone-changed", this.onMicrophoneChanged.bind(this));
        AgoraRTC.on("playback-device-changed", this.onPlaybackDeviceChanged.bind(this));
        AgoraRTC.on("autoplay-failed", this.onAutoplayFailed.bind(this));
        AgoraRTC.on("security-policy-violation", this.onSecurityPolicyViolation.bind(this));
        AgoraRTC.on("audio-context-state-changed", this.onAudioContextStateChanged.bind(this));
    }

    onCameraChanged(deviceInfo: WebDeviceInfo) {
        const type = Web2Native.DeviceState(deviceInfo.state);
        this.rtcEngineEventHandler?.onVideoDeviceStateChanged(
            deviceInfo.device.deviceId,
            MEDIA_DEVICE_TYPE.VIDEO_CAPTURE_DEVICE,
            type,
        );
    }
    onMicrophoneChanged(deviceInfo: WebDeviceInfo) {
        const type = Web2Native.DeviceState(deviceInfo.state);
        this.rtcEngineEventHandler?.onAudioDeviceStateChanged(
            deviceInfo.device.deviceId,
            MEDIA_DEVICE_TYPE.AUDIO_RECORDING_DEVICE,
            type,
        );
    }
    onPlaybackDeviceChanged(deviceInfo: WebDeviceInfo) {
        const type = Web2Native.DeviceState(deviceInfo.state);
        this.rtcEngineEventHandler?.onAudioDeviceStateChanged(
            deviceInfo.device.deviceId,
            MEDIA_DEVICE_TYPE.AUDIO_PLAYOUT_DEVICE,
            type,
        );
    }
    onAutoplayFailed() {
        console.log("Autoplay failed!");
    }
    onSecurityPolicyViolation() {
        console.log("Security policy violation!");
    }
    onAudioContextStateChanged(
        currState: AudioContextState | "interrupted",
        prevState: AudioContextState | "interrupted" | undefined,
    ) {}

    // ==================== Lifecycle ====================

    async release(sync: boolean): Promise<void> {}

    async getAudioDeviceManager(): Promise<IAudioDeviceManager> {
        return new AudioDeviceManagerWeb();
    }

    async getVideoDeviceManager(): Promise<IVideoDeviceManager> {
        return new VideoDeviceManagerWeb();
    }

    async getMusicContentCenter(): Promise<IMusicContentCenter> {
        return new MusicContentCenterWeb();
    }

    async getMediaPlayerCacheManager(): Promise<IMediaPlayerCacheManager> {
        return new MediaPlayerCacheManagerWeb();
    }

    async getLocalSpatialAudioEngine(): Promise<ILocalSpatialAudioEngine> {
        return new LocalSpatialAudioEngineWeb();
    }

    async getH265Transcoder(): Promise<IH265Transcoder> {
        return new H265TranscoderWeb();
    }

    async setLocalVideoDataSourcePosition(position: VIDEO_MODULE_POSITION): Promise<number> {
        this.localVideoDataSourcePosition = position;
        return ERR_OK;
    }

    async initialize(context: RtcEngineContext): Promise<number> {
        this.appId = context.appId;
        this.rtcEngineEventHandler = context.eventHandler;
        this.channelProfile = context.channelProfile;
        this.audioScenario = context.audioScenario;
        this.areaCode = context.areaCode;
        this.logConfig = context.logConfig;
        if (context.threadPriority) {
            this.threadPriority = context.threadPriority;
        }
        this.useExternalEglContext = context.useExternalEglContext;
        this.domainLimit = context.domainLimit;

        if (AgoraRTC.checkSystemRequirements() == false) {
            console.error("The current browser does not support AgoraRTC!");
        }
        const webAreas: AREAS[] = Native2Web.AreaCodes(this.areaCode);
        AgoraRTC.setArea(webAreas);
        const logLevel = Native2Web.LogLevel(this.logConfig.level);
        AgoraRTC.setLogLevel(logLevel);

        const config: ClientConfig = {
            mode: Native2Web.ChannelProfile(this.channelProfile),
            codec: "vp8",
        };
        this.mainClientProxy = new AgoraRTCClientProxy(config, this, this.trackManager);
        this.mainClientProxy.init();

        return ERR_OK;
    }

    async getVersion(): Promise<{ version: string; build: number }> {
        return { version: AgoraRTC.VERSION, build: 0 };
    }

    async getErrorDescription(code: ERROR_CODE_TYPE): Promise<string> {
        return Native2Web.ERROR_CODE_TYPE(code);
    }

    async queryCodecCapability(): Promise<{ errorCode: number; codecInfo: CodecCapInfo[] }> {
        try {
            const webCodecs = await AgoraRTC.getSupportedCodec();
            const codecInfo: CodecCapInfo[] = webCodecs.video.map((video) => {
                return {
                    codecType: Web2Native.string2VIDEO_CODEC_TYPE(video),
                    codecCapMask: 0,
                    codecLevels: {
                        hwDecodingLevel: VIDEO_CODEC_CAPABILITY_LEVEL.CODEC_CAPABILITY_LEVEL_BASIC_SUPPORT,
                        swDecodingLevel: VIDEO_CODEC_CAPABILITY_LEVEL.CODEC_CAPABILITY_LEVEL_BASIC_SUPPORT,
                    },
                };
            });
            return { errorCode: ERR_OK, codecInfo };
        } catch (e: any) {
            console.error("queryCodecCapability failed:", e.toString ? e.toString() : "");
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return { errorCode: -Web2Native.AgoraRTCErrorCode(err.code), codecInfo: [] };
            } else {
                return { errorCode: -ERROR_CODE_TYPE.ERR_FAILED, codecInfo: [] };
            }
        }
    }

    async queryDeviceScore(): Promise<number> {
        console.warn("queryDeviceScore not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async preloadChannel(token: string, channelId: string, uid: number): Promise<number> {
        try {
            await AgoraRTC.preload(this.appId, channelId, token, uid);
            return ERR_OK;
        } catch (e: any) {
            console.error("preloadChannel failed:", e.toString ? e.toString() : "");
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async preloadChannelWithUserAccount(token: string, channelId: string, userAccount: string): Promise<number> {
        try {
            await AgoraRTC.preload(this.appId, channelId, token, userAccount);
            return ERR_OK;
        } catch (e: any) {
            console.error("preloadChannelWithUserAccount failed:", e.toString ? e.toString() : "");
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async updatePreloadChannelToken(token: string): Promise<number> {
        console.warn("updatePreloadChannelToken not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Channel ====================

    async joinChannel(token: string, channelId: string, info: string, uid: number): Promise<number>;
    async joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): Promise<number>;
    async joinChannel(token: unknown, channelId: unknown, infoOrUid: unknown, uidOrOptions: unknown): Promise<number> {
        if (typeof infoOrUid === "string") {
            console.warn("The 'info' parameter in joinChannel is not support in web");
            const info = infoOrUid as string;
            const uid = uidOrOptions as number;
            try {
                const selfUid = await this.mainClientProxy.join(this.appId, channelId as string, token as string, uid, {
                    autoSubscribe: true,
                    networkQualityProbe: true,
                });
                this.rtcEngineEventHandler?.onJoinChannelSuccess(
                    { channelId: channelId as string, localUid: selfUid as number },
                    0,
                );
                return ERROR_CODE_TYPE.ERR_OK;
            } catch (e: any) {
                console.error("joinChannel failed:", e.toString ? e.toString() : "");
                if (isAgoraRTCError(e)) {
                    const err = e as IAgoraRTCError;
                    return -Web2Native.AgoraRTCErrorCode(err.code);
                } else {
                    return -ERROR_CODE_TYPE.ERR_FAILED;
                }
            }
        } else {
            try {
                const uid = infoOrUid as number;
                const options = uidOrOptions as ChannelMediaOptions;
                const autoSubscribe = (options.autoSubscribeVideo ?? true) || (options.autoSubscribeAudio ?? true);
                const selfUid = await this.mainClientProxy.join(this.appId, channelId as string, token as string, uid, {
                    autoSubscribe: autoSubscribe,
                    networkQualityProbe: true,
                });
                await this.updateChannelMediaOptions(options);
                this.rtcEngineEventHandler?.onJoinChannelSuccess(
                    { channelId: channelId as string, localUid: selfUid as number },
                    0,
                );
                return ERROR_CODE_TYPE.ERR_OK;
            } catch (e: any) {
                console.error("joinChannel failed:", e.toString ? e.toString() : "");
                if (isAgoraRTCError(e)) {
                    const err = e as IAgoraRTCError;
                    return -Web2Native.AgoraRTCErrorCode(err.code);
                } else {
                    return -ERROR_CODE_TYPE.ERR_FAILED;
                }
            }
        }
    }

    async updateChannelMediaOptions(options: ChannelMediaOptions): Promise<number> {
        try {
            await this.mainClientProxy.updateChannelMediaOptions(options);
            return ERR_OK;
        } catch (e) {
            console.error("updateChannelMediaOptions failed:", e.toString ? e.toString() : "");
            return ERR_FAILED;
        }
    }

    async leaveChannel(): Promise<number>;
    async leaveChannel(options: LeaveChannelOptions): Promise<number>;
    async leaveChannel(options?: unknown): Promise<number> {
        const mainClientProxy = this.mainClientProxy;
        if (!mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            if (options && (options as LeaveChannelOptions).stopMicrophoneRecording) {
                await mainClientProxy.enableMicrophoneRecording(false);
            }

            await mainClientProxy.leave();
            if (mainClientProxy.channelName && mainClientProxy.uid) {
                this.rtcEngineEventHandler?.onLeaveChannel(
                    {
                        channelId: mainClientProxy.channelName,
                        localUid: mainClientProxy.uid as number,
                    },
                    {} as any,
                );
            }
            return ERR_OK;
        } catch (e) {
            console.error("leaveChannel failed:", e.toString ? e.toString() : "");
            return ERR_NOT_READY;
        }
    }

    async renewToken(token: string): Promise<number> {
        const mainClientProxy = this.mainClientProxy;
        if (mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            await mainClientProxy.renewToken(token);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setChannelProfile(profile: CHANNEL_PROFILE_TYPE): Promise<number> {
        console.warn("setChannelProfile can only set in initialize in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setClientRole(role: CLIENT_ROLE_TYPE): Promise<number>;
    async setClientRole(role: CLIENT_ROLE_TYPE, options: ClientRoleOptions): Promise<number>;
    async setClientRole(role: unknown, options?: unknown): Promise<number> {
        const mainClientProxy = this.mainClientProxy;
        if (mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            const webRole = Native2Web.ClientRole(role as CLIENT_ROLE_TYPE);
            const opts = options as ClientRoleOptions | undefined;
            if (opts) {
                await mainClientProxy.setClientRole(webRole, Native2Web.ClientRoleOptions(opts));
            } else {
                await mainClientProxy.setClientRole(webRole);
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startEchoTest(config: EchoTestConfiguration): Promise<number> {
        console.warn("startEchoTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopEchoTest(): Promise<number> {
        console.warn("stopEchoTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableMultiCamera(enabled: boolean, config: CameraCapturerConfiguration): Promise<number> {
        console.warn("enableMultiCamera not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Video ====================

    async enableVideo(): Promise<number> {
        this.videoEnabled = true;
        this.trackManager.enableVideo();
        return ERR_OK;
    }

    async disableVideo(): Promise<number> {
        this.videoEnabled = false;
        this.trackManager.disableVideo();
        return ERR_OK;
    }

    async startPreview(): Promise<number>;
    async startPreview(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;
    async startPreview(sourceType?: unknown): Promise<number> {
        const vs = sourceType == null ? VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA : (sourceType as VIDEO_SOURCE_TYPE);
        const encoderConfig = Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration);
        switch (vs) {
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA:
                await this.trackManager.createLocalFirstCameraVideoTrack(encoderConfig);
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_SECONDARY:
                await this.trackManager.createLocalSecondCameraVideoTrack(encoderConfig);
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_THIRD:
                await this.trackManager.createLocalThirdCameraVideoTrack(encoderConfig);
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_FOURTH:
                await this.trackManager.createLocalFourthCameraVideoTrack(encoderConfig);
                break;
            default:
                return -ERR_INVALID_ARGUMENT;
                break;
        }
        return ERR_OK;
    }

    async stopPreview(): Promise<number>;
    async stopPreview(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;
    async stopPreview(sourceType?: unknown): Promise<number> {
        const vs = sourceType == null ? VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA : (sourceType as VIDEO_SOURCE_TYPE);
        switch (vs) {
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA:
                await this.trackManager.localFirstCameraTrack?.setEnabled(false);
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_SECONDARY:
                await this.trackManager.localSecondCameraTrack?.setEnabled(false);
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_THIRD:
                await this.trackManager.localThirdCameraTrack?.setEnabled(false);
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_FOURTH:
                await this.trackManager.localFourthCameraTrack?.setEnabled(false);
                break;
            default:
                return -ERR_INVALID_ARGUMENT;
                break;
        }

        return ERR_OK;
    }

    async startLastmileProbeTest(config: LastmileProbeConfig): Promise<number> {
        console.warn("startLastmileProbeTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopLastmileProbeTest(): Promise<number> {
        console.warn("stopLastmileProbeTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVideoEncoderConfiguration(config: NativeVideoEncoderConfiguration): Promise<number> {
        this.mainClientVideoEncoderConfiguration = config;
        await this.mainClientProxy.setVideoEncoderConfiguration(config);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async setBeautyEffectOptions(enabled: boolean, options: BeautyOptions, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("setBeautyEffectOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setFaceShapeBeautyOptions(
        enabled: boolean,
        options: FaceShapeBeautyOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setFaceShapeBeautyOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setFaceShapeAreaOptions(options: FaceShapeAreaOptions, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("setFaceShapeAreaOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getFaceShapeBeautyOptions(options: FaceShapeBeautyOptions, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("getFaceShapeBeautyOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getFaceShapeAreaOptions(
        shapeArea: FACE_SHAPE_AREA,
        options: FaceShapeAreaOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("getFaceShapeAreaOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setFilterEffectOptions(
        enabled: boolean,
        options: FilterEffectOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setFilterEffectOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async createVideoEffectObject(bundlePath: string, type: MEDIA_SOURCE_TYPE): Promise<IVideoEffectObject> {
        console.warn("createVideoEffectObject not support in web");
        throw new Error("createVideoEffectObject not support in web");
    }

    async destroyVideoEffectObject(videoEffectObject: IVideoEffectObject): Promise<number> {
        console.warn("destroyVideoEffectObject not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLowlightEnhanceOptions(
        enabled: boolean,
        options: LowlightEnhanceOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setLowlightEnhanceOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVideoDenoiserOptions(
        enabled: boolean,
        options: VideoDenoiserOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setVideoDenoiserOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setColorEnhanceOptions(
        enabled: boolean,
        options: ColorEnhanceOptions,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("setColorEnhanceOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableVirtualBackground(
        enabled: boolean,
        backgroundSource: VirtualBackgroundSource,
        segproperty: SegmentationProperty,
        type: MEDIA_SOURCE_TYPE,
    ): Promise<number> {
        console.warn("enableVirtualBackground not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setupRemoteVideo(canvas: VideoCanvas): Promise<number> {
        console.warn("setupRemoteVideo not support in web, use track.play() instead");
        return ERR_OK;
    }

    async setupLocalVideo(canvas: VideoCanvas): Promise<number> {
        console.warn("setupLocalVideo not support in web, use track.play() instead");
        return ERR_OK;
    }

    async setVideoScenario(scenarioType: VIDEO_APPLICATION_SCENARIO_TYPE): Promise<number> {
        console.warn("setVideoScenario not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVideoQoEPreference(qoePreference: VIDEO_QOE_PREFERENCE_TYPE): Promise<number> {
        console.warn("setVideoQoEPreference not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Audio ====================

    async enableAudio(): Promise<number> {
        this.audioEnabled = true;
        try {
            if (!this._localAudioTrack) {
                this._localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            }
            return ERR_OK;
        } catch (e) {
            console.error("enableAudio failed:", e);
            return ERR_FAILED;
        }
    }

    async disableAudio(): Promise<number> {
        this.audioEnabled = false;
        if (this._localAudioTrack) {
            this._localAudioTrack.close();
            this._localAudioTrack = undefined;
        }
        return ERR_OK;
    }

    async setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): Promise<number>;
    async setAudioProfile(profile: AUDIO_PROFILE_TYPE): Promise<number>;
    async setAudioProfile(profile: unknown, scenario?: unknown): Promise<number> {
        return ERR_OK;
    }

    async setAudioScenario(scenario: AUDIO_SCENARIO_TYPE): Promise<number> {
        return ERR_OK;
    }

    async enableLocalAudio(enabled: boolean): Promise<number> {
        try {
            if (!this._localAudioTrack) {
                if (enabled) {
                    this._localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                }
            } else {
                await this._localAudioTrack.setEnabled(enabled);
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteLocalAudioStream(mute: boolean): Promise<number> {
        if (!this._localAudioTrack) {
            return mute ? ERR_OK : ERR_NOT_READY;
        }
        try {
            await this._localAudioTrack.setEnabled(!mute);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteAllRemoteAudioStreams(mute: boolean): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        for (const user of this.mainClientProxy!.remoteUsers) {
            if (user.audioTrack) {
                user.audioTrack.setVolume(mute ? 0 : 100);
            }
        }
        return ERR_OK;
    }

    async muteRemoteAudioStream(uid: number, mute: boolean): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        const user = this.mainClientProxy!.remoteUsers.find((u) => u.uid === uid);
        if (user?.audioTrack) {
            user.audioTrack.setVolume(mute ? 0 : 100);
        }
        return ERR_OK;
    }

    async muteLocalVideoStream(mute: boolean): Promise<number> {
        if (!this._localVideoTrack) {
            return mute ? ERR_OK : ERR_NOT_READY;
        }
        try {
            await this._localVideoTrack.setEnabled(!mute);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async enableLocalVideo(enabled: boolean): Promise<number> {
        try {
            if (!this._localVideoTrack) {
                if (enabled) {
                    this._localVideoTrack = await AgoraRTC.createCameraVideoTrack();
                }
            } else {
                await this._localVideoTrack.setEnabled(enabled);
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteAllRemoteVideoStreams(mute: boolean): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        for (const user of this.mainClientProxy!.remoteUsers) {
            if (user.videoTrack) {
                if (mute) {
                    await this.mainClientProxy!.unsubscribe(user, "video").catch(() => {});
                } else {
                    await this.mainClientProxy!.subscribe(user, "video").catch(() => {});
                }
            }
        }
        return ERR_OK;
    }

    async setRemoteDefaultVideoStreamType(streamType: VIDEO_STREAM_TYPE): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setRemoteDefaultVideoStreamType(Native2Web.VideoStreamType(streamType));
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteRemoteVideoStream(uid: number, mute: boolean): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        const user = this.mainClientProxy!.remoteUsers.find((u) => u.uid === uid);
        if (user) {
            if (mute) {
                await this.mainClientProxy!.unsubscribe(user, "video").catch(() => {});
            } else {
                await this.mainClientProxy!.subscribe(user, "video").catch(() => {});
            }
        }
        return ERR_OK;
    }

    async setRemoteVideoStreamType(uid: number, streamType: VIDEO_STREAM_TYPE): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setRemoteVideoStreamType(uid, Native2Web.VideoStreamType(streamType));
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setRemoteVideoSubscriptionOptions(uid: number, options: VideoSubscriptionOptions): Promise<number> {
        console.warn("setRemoteVideoSubscriptionOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setSubscribeAudioBlocklist(uidList: number[], uidNumber: number): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setSubscribeAudioBlocklist(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeAudioAllowlist(uidList: number[], uidNumber: number): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setSubscribeAudioAllowlist(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeVideoBlocklist(uidList: number[], uidNumber: number): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setSubscribeVideoBlocklist(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeVideoAllowlist(uidList: number[], uidNumber: number): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setSubscribeVideoAllowlist(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        if (!this.audioVolumeIndicationEnabled) {
            this.mainClientProxy!.enableAudioVolumeIndicator();
            this.audioVolumeIndicationEnabled = true;
        }
        return ERR_OK;
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
        return -ERR_NOT_SUPPORTED;
    }

    async registerAudioEncodedFrameObserver(
        config: AudioEncodedFrameObserverConfig,
        observer: unknown,
    ): Promise<number> {
        console.warn("registerAudioEncodedFrameObserver not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopAudioRecording(): Promise<number> {
        console.warn("stopAudioRecording not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async createMediaPlayer(): Promise<IMediaPlayer> {
        this._mediaPlayerIdCounter++;
        const mediaPlayer = new MediaPlayerWeb(this._mediaPlayerIdCounter);
        this._mediaPlayers.set(this._mediaPlayerIdCounter, mediaPlayer);
        return mediaPlayer;
    }

    async destroyMediaPlayer(media_player: IMediaPlayer): Promise<number> {
        const id = await media_player.getId();
        const player = this._mediaPlayers.get(id);
        if (player) {
            await player.dispose();
            this._mediaPlayers.delete(id);
        }
        return ERR_OK;
    }

    getMediaPlayerById(id: number): MediaPlayerWeb {
        const player = this._mediaPlayers.get(id);
        if (player) {
            return player;
        } else {
            return null;
        }
    }

    async createMediaRecorder(info: RecorderStreamInfo): Promise<IMediaRecorder> {
        console.warn("createMediaRecorder not support in web");
        throw new Error("createMediaRecorder not support in web");
    }

    async destroyMediaRecorder(mediaRecorder: IMediaRecorder): Promise<number> {
        console.warn("destroyMediaRecorder not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startAudioMixing(filePath: string, loopback: boolean, cycle: number): Promise<number>;
    async startAudioMixing(filePath: string, loopback: boolean, cycle: number, startPos: number): Promise<number>;
    async startAudioMixing(filePath: unknown, loopback: unknown, cycle: unknown, startPos?: unknown): Promise<number> {
        console.warn("startAudioMixing not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopAudioMixing(): Promise<number> {
        console.warn("stopAudioMixing not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pauseAudioMixing(): Promise<number> {
        console.warn("pauseAudioMixing not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeAudioMixing(): Promise<number> {
        console.warn("resumeAudioMixing not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async selectAudioTrack(index: number): Promise<number> {
        console.warn("selectAudioTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getAudioTrackCount(): Promise<number> {
        console.warn("getAudioTrackCount not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustAudioMixingVolume(volume: number): Promise<number> {
        console.warn("adjustAudioMixingVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustAudioMixingPublishVolume(volume: number): Promise<number> {
        console.warn("adjustAudioMixingPublishVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getAudioMixingPublishVolume(): Promise<number> {
        console.warn("getAudioMixingPublishVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustAudioMixingPlayoutVolume(volume: number): Promise<number> {
        console.warn("adjustAudioMixingPlayoutVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getAudioMixingPlayoutVolume(): Promise<number> {
        console.warn("getAudioMixingPlayoutVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getAudioMixingDuration(): Promise<number> {
        console.warn("getAudioMixingDuration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getAudioMixingCurrentPosition(): Promise<number> {
        console.warn("getAudioMixingCurrentPosition not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioMixingPosition(pos: number): Promise<number> {
        console.warn("setAudioMixingPosition not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): Promise<number> {
        console.warn("setAudioMixingDualMonoMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioMixingPitch(pitch: number): Promise<number> {
        console.warn("setAudioMixingPitch not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioMixingPlaybackSpeed(speed: number): Promise<number> {
        console.warn("setAudioMixingPlaybackSpeed not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getEffectsVolume(): Promise<number> {
        console.warn("getEffectsVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setEffectsVolume(volume: number): Promise<number> {
        console.warn("setEffectsVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async preloadEffect(soundId: number, filePath: string, startPos: number): Promise<number> {
        console.warn("preloadEffect not support in web");
        return -ERR_NOT_SUPPORTED;
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
        return -ERR_NOT_SUPPORTED;
    }

    async playAllEffects(
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
    ): Promise<number> {
        console.warn("playAllEffects not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getVolumeOfEffect(soundId: number): Promise<number> {
        console.warn("getVolumeOfEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVolumeOfEffect(soundId: number, volume: number): Promise<number> {
        console.warn("setVolumeOfEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pauseEffect(soundId: number): Promise<number> {
        console.warn("pauseEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pauseAllEffects(): Promise<number> {
        console.warn("pauseAllEffects not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeEffect(soundId: number): Promise<number> {
        console.warn("resumeEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeAllEffects(): Promise<number> {
        console.warn("resumeAllEffects not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopEffect(soundId: number): Promise<number> {
        console.warn("stopEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopAllEffects(): Promise<number> {
        console.warn("stopAllEffects not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async unloadEffect(soundId: number): Promise<number> {
        console.warn("unloadEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async unloadAllEffects(): Promise<number> {
        console.warn("unloadAllEffects not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getEffectDuration(filePath: string): Promise<number> {
        console.warn("getEffectDuration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setEffectPosition(soundId: number, pos: number): Promise<number> {
        console.warn("setEffectPosition not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getEffectCurrentPosition(soundId: number): Promise<number> {
        console.warn("getEffectCurrentPosition not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableSoundPositionIndication(enabled: boolean): Promise<number> {
        console.warn("enableSoundPositionIndication not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteVoicePosition(uid: number, pan: number, gain: number): Promise<number> {
        console.warn("setRemoteVoicePosition not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableSpatialAudio(enabled: boolean): Promise<number> {
        console.warn("enableSpatialAudio not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): Promise<number> {
        console.warn("setRemoteUserSpatialAudioParams not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): Promise<number> {
        console.warn("setVoiceBeautifierPreset not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): Promise<number> {
        console.warn("setAudioEffectPreset not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): Promise<number> {
        console.warn("setVoiceConversionPreset not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioEffectParameters(preset: AUDIO_EFFECT_PRESET, param1: number, param2: number): Promise<number> {
        console.warn("setAudioEffectParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVoiceBeautifierParameters(
        preset: VOICE_BEAUTIFIER_PRESET,
        param1: number,
        param2: number,
    ): Promise<number> {
        console.warn("setVoiceBeautifierParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVoiceConversionParameters(
        preset: VOICE_CONVERSION_PRESET,
        param1: number,
        param2: number,
    ): Promise<number> {
        console.warn("setVoiceConversionParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLocalVoicePitch(pitch: number): Promise<number> {
        console.warn("setLocalVoicePitch not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLocalVoiceFormant(formantRatio: number): Promise<number> {
        console.warn("setLocalVoiceFormant not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLocalVoiceEqualization(
        bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY,
        bandGain: number,
    ): Promise<number> {
        console.warn("setLocalVoiceEqualization not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): Promise<number> {
        console.warn("setLocalVoiceReverb not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setHeadphoneEQPreset(preset: HEADPHONE_EQUALIZER_PRESET): Promise<number> {
        console.warn("setHeadphoneEQPreset not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setHeadphoneEQParameters(lowGain: number, highGain: number): Promise<number> {
        console.warn("setHeadphoneEQParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableVoiceAITuner(enabled: boolean, type: VOICE_AI_TUNER_TYPE): Promise<number> {
        console.warn("enableVoiceAITuner not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Log ====================

    async setLogFile(filePath: string): Promise<number> {
        return ERR_OK;
    }

    async setLogFilter(filter: number): Promise<number> {
        return ERR_OK;
    }

    async setLogLevel(level: LOG_LEVEL): Promise<number> {
        const sdkLevel = level === 0 ? 4 : level <= 2 ? 3 : level <= 4 ? 2 : level <= 8 ? 1 : 4;
        AgoraRTC.setLogLevel(sdkLevel as any);
        return ERR_OK;
    }

    async setLogFileSize(fileSizeInKBytes: number): Promise<number> {
        return ERR_OK;
    }

    async uploadLogFile(requestId: string): Promise<number> {
        try {
            AgoraRTC.enableLogUpload();
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async writeLog(level: LOG_LEVEL, fmt: string): Promise<number> {
        return ERR_OK;
    }

    // ==================== Render ====================

    async setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number>;
    async setLocalRenderMode(renderMode: RENDER_MODE_TYPE): Promise<number>;
    async setLocalRenderMode(renderMode: unknown, mirrorMode?: unknown): Promise<number> {
        return ERR_OK;
    }

    async setRemoteRenderMode(
        uid: number,
        renderMode: RENDER_MODE_TYPE,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE,
    ): Promise<number> {
        return ERR_OK;
    }

    async setLocalRenderTargetFps(sourceType: VIDEO_SOURCE_TYPE, targetFps: number): Promise<number> {
        return ERR_OK;
    }

    async setRemoteRenderTargetFps(targetFps: number): Promise<number> {
        return ERR_OK;
    }

    async setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number> {
        return ERR_OK;
    }

    // ==================== Dual Stream ====================

    async enableDualStreamMode(enabled: boolean): Promise<number>;
    async enableDualStreamMode(enabled: boolean, streamConfig: SimulcastStreamConfig): Promise<number>;
    async enableDualStreamMode(enabled: unknown, streamConfig?: unknown): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.dualStreamEnabled = enabled as boolean;
            if (enabled) {
                await this.mainClientProxy!.setDualStreamMode(1 as any, streamConfig as any);
            } else {
                await this.mainClientProxy!.setDualStreamMode(0 as any);
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setDualStreamMode(mode: SIMULCAST_STREAM_MODE): Promise<number>;
    async setDualStreamMode(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig): Promise<number>;
    async setDualStreamMode(mode: unknown, streamConfig?: unknown): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            const webMode = Native2Web.SimulcastMode(mode as SIMULCAST_STREAM_MODE);
            await this.mainClientProxy!.setDualStreamMode(webMode, streamConfig as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSimulcastConfig(simulcastConfig: SimulcastConfig): Promise<number> {
        console.warn("setSimulcastConfig not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRecordingAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number> {
        console.warn("setRecordingAudioFrameParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setPlaybackAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number> {
        console.warn("setPlaybackAudioFrameParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setMixedAudioFrameParameters(sampleRate: number, channel: number, samplesPerCall: number): Promise<number> {
        console.warn("setMixedAudioFrameParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setEarMonitoringAudioFrameParameters(
        sampleRate: number,
        channel: number,
        mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
        samplesPerCall: number,
    ): Promise<number> {
        console.warn("setEarMonitoringAudioFrameParameters not support in web");
        return -ERR_NOT_SUPPORTED;
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
        return -ERR_NOT_SUPPORTED;
    }

    async enableAudioSpectrumMonitor(intervalInMS: number): Promise<number> {
        console.warn("enableAudioSpectrumMonitor not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async disableAudioSpectrumMonitor(): Promise<number> {
        console.warn("disableAudioSpectrumMonitor not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Volume ====================

    async adjustRecordingSignalVolume(volume: number): Promise<number> {
        if (this._localAudioTrack) {
            this._localAudioTrack.setVolume(volume);
        }
        return ERR_OK;
    }

    async muteRecordingSignal(mute: boolean): Promise<number> {
        if (this._localAudioTrack) {
            await this._localAudioTrack.setEnabled(!mute);
        }
        return ERR_OK;
    }

    async adjustPlaybackSignalVolume(volume: number): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        for (const user of this.mainClientProxy!.remoteUsers) {
            if (user.audioTrack) {
                user.audioTrack.setVolume(volume);
            }
        }
        return ERR_OK;
    }

    async adjustUserPlaybackSignalVolume(uid: number, volume: number): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        const user = this.mainClientProxy!.remoteUsers.find((u) => u.uid === uid);
        if (user?.audioTrack) {
            user.audioTrack.setVolume(volume);
        }
        return ERR_OK;
    }

    async setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.setStreamFallbackOption(0, Native2Web.StreamFallbackOption(option));
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setHighPriorityUserList(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            for (const uid of uidList) {
                this.mainClientProxy!.setStreamFallbackOption(uid, Native2Web.StreamFallbackOption(option));
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    // ==================== Extension ====================

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
        return -ERR_NOT_SUPPORTED;
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
        return -ERR_NOT_SUPPORTED;
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
    ): Promise<{ errorCode: number; value: string } | { errorCode: number; value: number }> {
        console.warn("getExtensionProperty not support in web");
        return { errorCode: ERR_NOT_SUPPORTED, value: "" };
    }

    async enableLoopbackRecording(enabled: boolean, deviceName: string): Promise<number> {
        console.warn("enableLoopbackRecording not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustLoopbackSignalVolume(volume: number): Promise<number> {
        console.warn("adjustLoopbackSignalVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getLoopbackRecordingVolume(): Promise<number> {
        console.warn("getLoopbackRecordingVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableInEarMonitoring(enabled: boolean, includeAudioFilters: number): Promise<number> {
        console.warn("enableInEarMonitoring not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setInEarMonitoringVolume(volume: number): Promise<number> {
        console.warn("setInEarMonitoringVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async loadExtensionProvider(path: string, unload_after_use: boolean): Promise<number> {
        console.warn("loadExtensionProvider not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setExtensionProviderProperty(provider: string, key: string, value: string): Promise<number> {
        console.warn("setExtensionProviderProperty not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async registerExtension(provider: string, extension: string, type: MEDIA_SOURCE_TYPE): Promise<number> {
        console.warn("registerExtension not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setCameraCapturerConfiguration(config: CameraCapturerConfiguration): Promise<number> {
        console.warn("setCameraCapturerConfiguration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async createCustomVideoTrack(): Promise<number> {
        console.warn("createCustomVideoTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async createCustomEncodedVideoTrack(sender_option: SenderOptions): Promise<number> {
        console.warn("createCustomEncodedVideoTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async destroyCustomVideoTrack(video_track_id: number): Promise<number> {
        console.warn("destroyCustomVideoTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async destroyCustomEncodedVideoTrack(video_track_id: number): Promise<number> {
        console.warn("destroyCustomEncodedVideoTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Camera ====================

    async switchCamera(): Promise<number> {
        console.warn("switchCamera not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async isCameraZoomSupported(): Promise<boolean> {
        return false;
    }

    async isCameraFaceDetectSupported(): Promise<boolean> {
        return false;
    }

    async isCameraTorchSupported(): Promise<boolean> {
        return false;
    }

    async isCameraFocusSupported(): Promise<boolean> {
        return false;
    }

    async isCameraAutoFocusFaceModeSupported(): Promise<boolean> {
        return false;
    }

    async setCameraZoomFactor(factor: number): Promise<number> {
        console.warn("setCameraZoomFactor not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableFaceDetection(enabled: boolean): Promise<number> {
        console.warn("enableFaceDetection not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getCameraMaxZoomFactor(): Promise<number> {
        return 1;
    }

    async setCameraFocusPositionInPreview(positionX: number, positionY: number): Promise<number> {
        console.warn("setCameraFocusPositionInPreview not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setCameraTorchOn(isOn: boolean): Promise<number> {
        console.warn("setCameraTorchOn not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setCameraAutoFocusFaceModeEnabled(enabled: boolean): Promise<number> {
        console.warn("setCameraAutoFocusFaceModeEnabled not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async isCameraExposurePositionSupported(): Promise<boolean> {
        return false;
    }

    async setCameraExposurePosition(positionXinView: number, positionYinView: number): Promise<number> {
        console.warn("setCameraExposurePosition not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async isCameraExposureSupported(): Promise<boolean> {
        return false;
    }

    async setCameraExposureFactor(factor: number): Promise<number> {
        console.warn("setCameraExposureFactor not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async isCameraAutoExposureFaceModeSupported(): Promise<boolean> {
        return false;
    }

    async setCameraAutoExposureFaceModeEnabled(enabled: boolean): Promise<number> {
        console.warn("setCameraAutoExposureFaceModeEnabled not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setCameraStabilizationMode(mode: CAMERA_STABILIZATION_MODE): Promise<number> {
        console.warn("setCameraStabilizationMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): Promise<number> {
        console.warn("setDefaultAudioRouteToSpeakerphone not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setEnableSpeakerphone(speakerOn: boolean): Promise<number> {
        console.warn("setEnableSpeakerphone not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async isSpeakerphoneEnabled(): Promise<boolean> {
        return false;
    }

    async setRouteInCommunicationMode(route: number): Promise<number> {
        console.warn("setRouteInCommunicationMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async isCameraCenterStageSupported(): Promise<boolean> {
        return false;
    }

    async enableCameraCenterStage(enabled: boolean): Promise<number> {
        console.warn("enableCameraCenterStage not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Screen Capture ====================

    async getScreenCaptureSources(
        thumbSize: SIZE,
        iconSize: SIZE,
        includeScreen: boolean,
    ): Promise<ScreenCaptureSourceInfo[]> {
        console.warn("getScreenCaptureSources not support in web");
        throw new Error("getScreenCaptureSources not support in web");
    }

    async setAudioSessionOperationRestriction(restriction: AUDIO_SESSION_OPERATION_RESTRICTION): Promise<number> {
        console.warn("setAudioSessionOperationRestriction not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startScreenCaptureByDisplayId(
        displayId: number,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        console.warn("startScreenCaptureByDisplayId not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startScreenCaptureByScreenRect(
        screenRect: Rectangle,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        console.warn("startScreenCaptureByScreenRect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getAudioDeviceInfo(): Promise<{ errorCode: number; deviceInfo: DeviceInfo }> {
        console.warn("getAudioDeviceInfo not support in web");
        throw new Error("getAudioDeviceInfo not support in web");
    }

    async startScreenCaptureByWindowId(
        windowId: number,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        console.warn("startScreenCaptureByWindowId not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setScreenCaptureContentHint(contentHint: VIDEO_CONTENT_HINT): Promise<number> {
        console.warn("setScreenCaptureContentHint not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateScreenCaptureRegion(regionRect: Rectangle): Promise<number> {
        console.warn("updateScreenCaptureRegion not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateScreenCaptureParameters(captureParams: ScreenCaptureParameters): Promise<number> {
        console.warn("updateScreenCaptureParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startScreenCapture(captureParams: ScreenCaptureParameters2): Promise<number>;
    async startScreenCapture(sourceType: VIDEO_SOURCE_TYPE, config: ScreenCaptureConfiguration): Promise<number>;
    async startScreenCapture(sourceType: unknown, config?: unknown): Promise<number> {
        try {
            this._screenTrack = await AgoraRTC.createScreenVideoTrack(config as any, "disable");
            if (this.mainClientProxy && this.mainClientProxy.connectionState === "CONNECTED") {
                await this.mainClientProxy!.publish([this._screenTrack]);
            }
            return ERR_OK;
        } catch (e) {
            console.error("startScreenCapture failed:", e);
            return ERR_FAILED;
        }
    }

    async updateScreenCapture(captureParams: ScreenCaptureParameters2): Promise<number> {
        console.warn("updateScreenCapture not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async queryScreenCaptureCapability(): Promise<number> {
        console.warn("queryScreenCaptureCapability not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async queryCameraFocalLengthCapability(focalLengthInfos: FocalLengthInfo[], size: number): Promise<number> {
        console.warn("queryCameraFocalLengthCapability not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setExternalMediaProjection(mediaProjection: unknown): Promise<number> {
        console.warn("setExternalMediaProjection not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setScreenCaptureScenario(screenScenario: SCREEN_SCENARIO_TYPE): Promise<number> {
        console.warn("setScreenCaptureScenario not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopScreenCapture(): Promise<number>;
    async stopScreenCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number>;
    async stopScreenCapture(sourceType?: unknown): Promise<number> {
        if (this._screenTrack) {
            if (this.mainClientProxy) {
                await this.mainClientProxy.unpublish([this._screenTrack]).catch(() => {});
            }
            this._screenTrack.close();
            this._screenTrack = undefined;
        }
        return ERR_OK;
    }

    // ==================== Misc ====================

    async getCallId(callId: string): Promise<number> {
        console.warn("getCallId not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async rate(callId: string, rating: number, description: string): Promise<number> {
        console.warn("rate not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async complain(callId: string, description: string): Promise<number> {
        console.warn("complain not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== CDN Streaming ====================

    async startRtmpStreamWithoutTranscoding(url: string): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            await this.mainClientProxy!.startLiveStreaming(url, false);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            await this.mainClientProxy!.startLiveStreaming(url, true);
            await this.mainClientProxy!.setLiveTranscoding(transcoding as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async updateRtmpTranscoding(transcoding: LiveTranscoding): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            await this.mainClientProxy!.setLiveTranscoding(transcoding as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startLocalVideoTranscoder(config: LocalTranscoderConfiguration): Promise<number> {
        console.warn("startLocalVideoTranscoder not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): Promise<number> {
        console.warn("updateLocalTranscoderConfiguration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopRtmpStream(url: string): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            await this.mainClientProxy!.stopLiveStreaming(url);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async stopLocalVideoTranscoder(): Promise<number> {
        console.warn("stopLocalVideoTranscoder not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startLocalAudioMixer(config: LocalAudioMixerConfiguration): Promise<number> {
        console.warn("startLocalAudioMixer not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateLocalAudioMixerConfiguration(config: LocalAudioMixerConfiguration): Promise<number> {
        console.warn("updateLocalAudioMixerConfiguration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopLocalAudioMixer(): Promise<number> {
        console.warn("stopLocalAudioMixer not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startCameraCapture(sourceType: VIDEO_SOURCE_TYPE, config: CameraCapturerConfiguration): Promise<number> {
        console.warn("startCameraCapture not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopCameraCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number> {
        console.warn("stopCameraCapture not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setCameraDeviceOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number> {
        return ERR_OK;
    }

    async setScreenCaptureOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number> {
        return ERR_OK;
    }

    async getConnectionState(): Promise<CONNECTION_STATE_TYPE> {
        if (!this.mainClientProxy) {
            return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
        }
        const { Web2Native } = await import("./Helper");
        return Web2Native.ConnectionState(this.mainClientProxy!.connectionState);
    }

    async setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): Promise<number> {
        console.warn("setRemoteUserPriority not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Encryption ====================

    async enableEncryption(enabled: boolean, config: EncryptionConfig): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            if (enabled && config.encryptionKey) {
                const webMode = Native2Web.EncryptionMode(config.encryptionMode);
                this.mainClientProxy!.setEncryptionConfig(
                    webMode,
                    config.encryptionKey,
                    config.encryptionKdfSalt || undefined,
                    config.datastreamEncryptionEnabled,
                );
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    // ==================== Data Stream ====================

    async createDataStream(streamId: number, reliable: boolean, ordered: boolean): Promise<number>;
    async createDataStream(streamId: number, config: DataStreamConfig): Promise<number>;
    async createDataStream(_streamId: unknown, reliable: unknown, orderedParam?: unknown): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            let isOrdered: boolean;
            if (typeof reliable === "boolean") {
                isOrdered = orderedParam as boolean;
            } else {
                const cfg = reliable as DataStreamConfig;
                isOrdered = cfg.ordered;
            }
            const id = this._nextDataStreamId++;
            const dc = await this.mainClientProxy!.publish({ id, ordered: isOrdered, metadata: "" });
            this._dataChannels.set(id, dc);
            return id;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async sendStreamMessage(streamId: number, data: Uint8Array, length: number): Promise<number> {
        const dc = this._dataChannels.get(streamId);
        if (!dc) {
            return ERR_INVALID_ARGUMENT;
        }
        try {
            dc.send(data.buffer);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async sendRdtMessage(uid: number, type: RdtStreamType, data: string, length: number): Promise<number> {
        console.warn("sendRdtMessage not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async sendMediaControlMessage(uid: number, data: string, length: number): Promise<number> {
        console.warn("sendMediaControlMessage not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Watermark ====================

    async addVideoWatermark(watermark: RtcImage): Promise<number>;
    async addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): Promise<number>;
    async addVideoWatermark(configs: WatermarkConfig): Promise<number>;
    async addVideoWatermark(watermarkUrl: unknown, options?: unknown): Promise<number> {
        console.warn("addVideoWatermark not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async removeVideoWatermark(id: string): Promise<number> {
        console.warn("removeVideoWatermark not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async clearVideoWatermarks(): Promise<number> {
        console.warn("clearVideoWatermarks not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Audio Pause/Resume ====================

    async pauseAudio(): Promise<number> {
        if (this._localAudioTrack) {
            await this._localAudioTrack.setEnabled(false);
        }
        return ERR_OK;
    }

    async resumeAudio(): Promise<number> {
        if (this._localAudioTrack) {
            await this._localAudioTrack.setEnabled(true);
        }
        return ERR_OK;
    }

    async enableWebSdkInteroperability(enabled: boolean): Promise<number> {
        return ERR_OK;
    }

    // ==================== Report ====================

    async sendCustomReportMessage(
        id: string,
        category: string,
        event: string,
        label: string,
        value: number,
    ): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.sendCustomReportMessage(id, category, event, label, value);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
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
        return -ERR_NOT_SUPPORTED;
    }

    async stopAudioFrameDump(channel_id: string, uid: number, location: string): Promise<number> {
        console.warn("stopAudioFrameDump not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAINSMode(enabled: boolean, mode: AUDIO_AINS_MODE): Promise<number> {
        console.warn("setAINSMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async registerLocalUserAccount(appId: string, userAccount: string): Promise<number> {
        console.warn("registerLocalUserAccount not support in web");
        return -ERR_NOT_SUPPORTED;
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
        return -ERR_NOT_SUPPORTED;
    }

    async getUserInfoByUserAccount(userAccount: string): Promise<{ errorCode: number; userInfo: UserInfo }> {
        console.warn("getUserInfoByUserAccount not support in web");
        throw new Error("getUserInfoByUserAccount not support in web");
    }

    async getUserInfoByUid(uid: number): Promise<{ errorCode: number; userInfo: UserInfo }> {
        console.warn("getUserInfoByUid not support in web");
        throw new Error("getUserInfoByUid not support in web");
    }

    // ==================== Channel Media Relay ====================

    async startOrUpdateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            const webConfig: any = {
                srcInfo: {
                    channel: configuration.srcInfo.channelName,
                    token: configuration.srcInfo.token,
                    uid: configuration.srcInfo.uid,
                },
                destInfos: configuration.destInfos.map((info) => ({
                    channel: info.channelName,
                    token: info.token,
                    uid: info.uid,
                })),
                channelCount: configuration.destInfos.length,
            };
            await this.mainClientProxy!.startChannelMediaRelay(webConfig);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async stopChannelMediaRelay(): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            await this.mainClientProxy!.stopChannelMediaRelay();
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async pauseAllChannelMediaRelay(): Promise<number> {
        console.warn("pauseAllChannelMediaRelay not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeAllChannelMediaRelay(): Promise<number> {
        console.warn("resumeAllChannelMediaRelay not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Direct CDN ====================

    async setDirectCdnStreamingAudioConfiguration(profile: AUDIO_PROFILE_TYPE): Promise<number> {
        console.warn("setDirectCdnStreamingAudioConfiguration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setDirectCdnStreamingVideoConfiguration(config: VideoEncoderConfiguration): Promise<number> {
        console.warn("setDirectCdnStreamingVideoConfiguration not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startDirectCdnStreaming(publishUrl: string, options: DirectCdnStreamingMediaOptions): Promise<number> {
        console.warn("startDirectCdnStreaming not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopDirectCdnStreaming(): Promise<number> {
        console.warn("stopDirectCdnStreaming not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateDirectCdnStreamingMediaOptions(options: DirectCdnStreamingMediaOptions): Promise<number> {
        console.warn("updateDirectCdnStreamingMediaOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Rhythm Player ====================

    async startRhythmPlayer(sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): Promise<number> {
        console.warn("startRhythmPlayer not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopRhythmPlayer(): Promise<number> {
        console.warn("stopRhythmPlayer not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async configRhythmPlayer(config: AgoraRhythmPlayerConfig): Promise<number> {
        console.warn("configRhythmPlayer not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Snapshot / Content Inspect ====================

    async takeSnapshot(uid: number, filePath: string): Promise<number>;
    async takeSnapshot(uid: number, config: SnapshotConfig): Promise<number>;
    async takeSnapshot(uid: unknown, config: unknown): Promise<number> {
        console.warn("takeSnapshot not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableContentInspect(enabled: boolean, config: ContentInspectConfig): Promise<number> {
        console.warn("enableContentInspect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustCustomAudioPublishVolume(trackId: number, volume: number): Promise<number> {
        console.warn("adjustCustomAudioPublishVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustCustomAudioPlayoutVolume(trackId: number, volume: number): Promise<number> {
        console.warn("adjustCustomAudioPlayoutVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Cloud Proxy ====================

    async setCloudProxy(proxyType: CLOUD_PROXY_TYPE): Promise<number> {
        if (!this.mainClientProxy) {
            return ERR_NOT_READY;
        }
        try {
            this.mainClientProxy!.startProxyServer(proxyType);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setLocalAccessPoint(config: LocalAccessPointConfiguration): Promise<number> {
        console.warn("setLocalAccessPoint not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAdvancedAudioOptions(options: AdvancedAudioOptions, sourceType: number): Promise<number> {
        console.warn("setAdvancedAudioOptions not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAVSyncSource(channelId: string, uid: number): Promise<number> {
        console.warn("setAVSyncSource not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableVideoImageSource(enable: boolean, options: ImageTrackOptions): Promise<number> {
        console.warn("enableVideoImageSource not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getCurrentMonotonicTimeInMs(): Promise<number> {
        return Date.now();
    }

    async getNetworkType(): Promise<number> {
        return (navigator as any).connection?.effectiveType ? 3 : -1;
    }

    async setParameters(parameters: object): Promise<number> {
        return ERR_OK;
    }

    async startMediaRenderingTracing(): Promise<number> {
        return ERR_OK;
    }

    async enableInstantMediaRendering(): Promise<number> {
        return ERR_OK;
    }

    async getNtpWallTimeInMs(): Promise<number> {
        return Date.now();
    }

    async isFeatureAvailableOnDevice(type: FeatureType): Promise<boolean> {
        return true;
    }

    async sendAudioMetadata(metadata: Uint8Array, length: number): Promise<number> {
        console.warn("sendAudioMetadata not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async queryHDRCapability(videoModule: VIDEO_MODULE_TYPE, capability: HDR_CAPABILITY): Promise<number> {
        console.warn("queryHDRCapability not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Ex Methods ====================

    async setParametersEx(connection: RtcConnection, parameters: object): Promise<number>;
    async setParametersEx(connection: RtcConnection, parameters: string): Promise<number>;
    async setParametersEx(connection: unknown, parameters: unknown): Promise<number> {
        return ERR_OK;
    }

    async joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): Promise<number> {
        if (!this.appId) {
            return ERR_NOT_READY;
        }
        const key = connectionKey(connection);
        try {
            const config: ClientConfig = {
                mode: Native2Web.ChannelProfile(options.channelProfile || this.channelProfile),
                codec: "vp8",
            };
            const proxy = new AgoraRTCClientProxy(config, this, this.trackManager);
            proxy.init();
            const client = proxy.getClient();

            await client.join(this.appId, connection.channelId, token || null, connection.localUid);

            this.subClients.set(key, client);
            this.subClientProxies.set(key, proxy);

            if (options.publishMicrophoneTrack && this._localAudioTrack) {
                await client.publish([this._localAudioTrack]).catch(() => {});
            }
            if (options.publishCameraTrack && this._localVideoTrack) {
                await client.publish([this._localVideoTrack]).catch(() => {});
            }

            this.rtcEngineEventHandler?.onJoinChannelSuccess(connection, 0);
            return ERR_OK;
        } catch (e) {
            console.error("joinChannelEx failed:", e);
            return ERR_FAILED;
        }
    }

    async leaveChannelEx(connection: RtcConnection): Promise<number>;
    async leaveChannelEx(connection: RtcConnection, options: LeaveChannelOptions): Promise<number>;
    async leaveChannelEx(connection: unknown, options?: unknown): Promise<number> {
        const key = connectionKey(connection as RtcConnection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            await client.leave();
            this.subClients.delete(key);
            this.subClientProxies.delete(key);
            this.rtcEngineEventHandler?.onLeaveChannel(connection as RtcConnection, {} as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async leaveChannelWithUserAccountEx(channelId: string, userAccount: string): Promise<number>;
    async leaveChannelWithUserAccountEx(
        channelId: string,
        userAccount: string,
        options: LeaveChannelOptions,
    ): Promise<number>;
    async leaveChannelWithUserAccountEx(channelId: unknown, userAccount: unknown, options?: unknown): Promise<number> {
        console.warn("leaveChannelWithUserAccountEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        if (options.clientRoleType) {
            const webRole = Native2Web.ClientRole(options.clientRoleType);
            await client.setClientRole(webRole);
        }
        return ERR_OK;
    }

    async setVideoEncoderConfigurationEx(
        config: NativeVideoEncoderConfiguration,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        this.subClientVideoEncoderConfigurations.set(key, config);

        const client = this.subClientProxies.get(key);
        client?.setVideoEncoderConfiguration(config);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): Promise<number> {
        return ERR_OK;
    }

    async muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        const user = client.remoteUsers.find((u) => u.uid === uid);
        if (user?.audioTrack) {
            user.audioTrack.setVolume(mute ? 0 : 100);
        }
        return ERR_OK;
    }

    async muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            const user = client.remoteUsers.find((u) => u.uid === uid);
            if (!user) return ERR_INVALID_ARGUMENT;
            if (mute && user.hasVideo) {
                await client.unsubscribe(user, "video");
            } else if (!mute && user.hasVideo) {
                await client.subscribe(user, "video");
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setRemoteVideoStreamTypeEx(
        uid: number,
        streamType: VIDEO_STREAM_TYPE,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            client.setRemoteVideoStreamType(uid, Native2Web.VideoStreamType(streamType));
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteLocalAudioStreamEx(mute: boolean, connection: RtcConnection): Promise<number> {
        if (!this._localAudioTrack) {
            return mute ? ERR_OK : ERR_NOT_READY;
        }
        await this._localAudioTrack.setEnabled(!mute);
        return ERR_OK;
    }

    async muteLocalVideoStreamEx(mute: boolean, connection: RtcConnection): Promise<number> {
        if (!this._localVideoTrack) {
            return mute ? ERR_OK : ERR_NOT_READY;
        }
        await this._localVideoTrack.setEnabled(!mute);
        return ERR_OK;
    }

    async muteAllRemoteAudioStreamsEx(mute: boolean, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        for (const user of client.remoteUsers) {
            if (user.audioTrack) {
                user.audioTrack.setVolume(mute ? 0 : 100);
            }
        }
        return ERR_OK;
    }

    async muteAllRemoteVideoStreamsEx(mute: boolean, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            for (const user of client.remoteUsers) {
                if (mute && user.hasVideo) {
                    await client.unsubscribe(user, "video");
                } else if (!mute && user.hasVideo) {
                    await client.subscribe(user, "video");
                }
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeAudioBlocklistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            (client as any).setSubscribeAudioBlocklist?.(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeAudioAllowlistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            (client as any).setSubscribeAudioAllowlist?.(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeVideoBlocklistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            (client as any).setSubscribeVideoBlocklist?.(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeVideoAllowlistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            (client as any).setSubscribeVideoAllowlist?.(uidList);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setRemoteVideoSubscriptionOptionsEx(
        uid: number,
        options: VideoSubscriptionOptions,
        connection: RtcConnection,
    ): Promise<number> {
        return ERR_OK;
    }

    async setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): Promise<number> {
        console.warn("setRemoteVoicePositionEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteUserSpatialAudioParamsEx(
        uid: number,
        params: SpatialAudioParams,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setRemoteUserSpatialAudioParamsEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteRenderModeEx(
        uid: number,
        renderMode: RENDER_MODE_TYPE,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE,
        connection: RtcConnection,
    ): Promise<number> {
        return ERR_OK;
    }

    async enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName: string): Promise<number> {
        console.warn("enableLoopbackRecordingEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async adjustRecordingSignalVolumeEx(volume: number, connection: RtcConnection): Promise<number> {
        if (this._localAudioTrack) {
            this._localAudioTrack.setVolume(volume);
        }
        return ERR_OK;
    }

    async muteRecordingSignalEx(mute: boolean, connection: RtcConnection): Promise<number> {
        if (this._localAudioTrack) {
            await this._localAudioTrack.setEnabled(!mute);
        }
        return ERR_OK;
    }

    async adjustUserPlaybackSignalVolumeEx(uid: number, volume: number, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key) || this.mainClientProxy?.getClient();
        if (!client) {
            return ERR_NOT_READY;
        }
        const user = client.remoteUsers.find((u) => u.uid === uid);
        if (user?.audioTrack) {
            user.audioTrack.setVolume(volume);
        }
        return ERR_OK;
    }

    async getConnectionStateEx(connection: RtcConnection): Promise<CONNECTION_STATE_TYPE> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
        }
        const { Web2Native } = await import("./Helper");
        return Web2Native.ConnectionState(client.connectionState);
    }

    async enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            if (enabled && config.encryptionKey) {
                const webMode = Native2Web.EncryptionMode(config.encryptionMode);
                client.setEncryptionConfig(
                    webMode,
                    config.encryptionKey,
                    config.encryptionKdfSalt || undefined,
                    config.datastreamEncryptionEnabled,
                );
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async createDataStreamEx(
        streamId: number,
        reliable: boolean,
        ordered: boolean,
        connection: RtcConnection,
    ): Promise<number>;
    async createDataStreamEx(streamId: number, config: DataStreamConfig, connection: RtcConnection): Promise<number>;
    async createDataStreamEx(
        _streamId: unknown,
        reliable: unknown,
        orderedParam: unknown,
        connection?: unknown,
    ): Promise<number> {
        const key = connectionKey(connection as RtcConnection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            let isOrdered: boolean;
            if (typeof reliable === "boolean") {
                isOrdered = orderedParam as boolean;
            } else {
                const cfg = reliable as DataStreamConfig;
                isOrdered = cfg.ordered;
            }
            const id = this._nextDataStreamId++;
            const dc = await client.publish({ id, ordered: isOrdered, metadata: "" });
            this._dataChannels.set(id, dc);
            return id;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async sendStreamMessageEx(
        streamId: number,
        data: Uint8Array,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        return this.sendStreamMessage(streamId, data, length);
    }

    async sendRdtMessageEx(
        uid: number,
        type: RdtStreamType,
        data: string,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("sendRdtMessageEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async sendMediaControlMessageEx(
        uid: number,
        data: string,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("sendMediaControlMessageEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async addVideoWatermarkEx(
        watermarkUrl: string,
        options: WatermarkOptions,
        connection: RtcConnection,
    ): Promise<number>;
    async addVideoWatermarkEx(config: WatermarkConfig, connection: RtcConnection): Promise<number>;
    async addVideoWatermarkEx(watermarkUrl: unknown, options: unknown, connection?: unknown): Promise<number> {
        console.warn("addVideoWatermarkEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async removeVideoWatermarkEx(id: string, connection: RtcConnection): Promise<number> {
        console.warn("removeVideoWatermarkEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async clearVideoWatermarkEx(connection: RtcConnection): Promise<number> {
        console.warn("clearVideoWatermarkEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async sendCustomReportMessageEx(
        id: string,
        category: string,
        event: string,
        label: string,
        value: number,
        connection: RtcConnection,
    ): Promise<number> {
        return this.sendCustomReportMessage(id, category, event, label, value);
    }

    async enableAudioVolumeIndicationEx(
        interval: number,
        smooth: number,
        reportVad: boolean,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        client.enableAudioVolumeIndicator();
        return ERR_OK;
    }

    async startRtmpStreamWithoutTranscodingEx(url: string, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            await client.startLiveStreaming(url, false);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startRtmpStreamWithTranscodingEx(
        url: string,
        transcoding: LiveTranscoding,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            await client.startLiveStreaming(url, true);
            await client.setLiveTranscoding(transcoding as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async updateRtmpTranscodingEx(transcoding: LiveTranscoding, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            await client.setLiveTranscoding(transcoding as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async stopRtmpStreamEx(url: string, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            await client.stopLiveStreaming(url);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startOrUpdateChannelMediaRelayEx(
        configuration: ChannelMediaRelayConfiguration,
        connection: RtcConnection,
    ): Promise<number> {
        return this.startOrUpdateChannelMediaRelay(configuration);
    }

    async stopChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        return this.stopChannelMediaRelay();
    }

    async pauseAllChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        console.warn("pauseAllChannelMediaRelayEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeAllChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        console.warn("resumeAllChannelMediaRelayEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getUserInfoByUserAccountEx(
        userAccount: string,
        userInfo: UserInfo,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("getUserInfoByUserAccountEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getUserInfoByUidEx(uid: number, userInfo: UserInfo, connection: RtcConnection): Promise<number> {
        console.warn("getUserInfoByUidEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableDualStreamModeEx(
        enabled: boolean,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            if (enabled) {
                await client.setDualStreamMode(1 as any, streamConfig as any);
            } else {
                await client.setDualStreamMode(0 as any);
            }
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setDualStreamModeEx(
        mode: SIMULCAST_STREAM_MODE,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        const client = this.subClients.get(key);
        if (!client) {
            return ERR_NOT_READY;
        }
        try {
            const webMode = Native2Web.SimulcastMode(mode);
            await client.setDualStreamMode(webMode, streamConfig as any);
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSimulcastConfigEx(simulcastConfig: SimulcastConfig, connection: RtcConnection): Promise<number> {
        console.warn("setSimulcastConfigEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setHighPriorityUserListEx(
        uidList: number[],
        uidNum: number,
        option: STREAM_FALLBACK_OPTIONS,
        connection: RtcConnection,
    ): Promise<number> {
        return this.setHighPriorityUserList(uidList, uidNum, option);
    }

    async takeSnapshotEx(connection: RtcConnection, uid: number, filePath: string): Promise<number>;
    async takeSnapshotEx(connection: RtcConnection, uid: number, config: SnapshotConfig): Promise<number>;
    async takeSnapshotEx(connection: unknown, uid: unknown, config: unknown): Promise<number> {
        console.warn("takeSnapshotEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableContentInspectEx(
        enabled: boolean,
        config: ContentInspectConfig,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("enableContentInspectEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startMediaRenderingTracingEx(connection: RtcConnection): Promise<number> {
        return ERR_OK;
    }

    async getCallIdEx(callId: string, connection: RtcConnection): Promise<number> {
        console.warn("getCallIdEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async sendAudioMetadataEx(connection: RtcConnection, metadata: Uint8Array, length: number): Promise<number> {
        console.warn("sendAudioMetadataEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async preloadEffectEx(
        connection: RtcConnection,
        soundId: number,
        filePath: string,
        startPos: number,
    ): Promise<number> {
        console.warn("preloadEffectEx not support in web");
        return -ERR_NOT_SUPPORTED;
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
        return -ERR_NOT_SUPPORTED;
    }

    async initSubClientProxy(subClient: AgoraRTCClientProxy, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);

        if (this.subClientVideoEncoderConfigurations.has(key)) {
            subClient.setVideoEncoderConfiguration(this.subClientVideoEncoderConfigurations.get(key)!);
        }

        return ERR_OK;
    }
}
