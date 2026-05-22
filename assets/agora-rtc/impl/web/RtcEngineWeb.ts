import {
    COMPRESSION_PREFERENCE,
    DEGRADATION_PREFERENCE,
    ENCODING_PREFERENCE,
    ORIENTATION_MODE,
    RtcStats,
    UserInfo,
    VIDEO_CODEC_TYPE,
} from "../../types/AgoraBase";
import { IAudioDeviceManager } from "../../interface/IAudioDeviceManager";
import { IH265Transcoder } from "../../interface/IH265Transcoder";
import { ILocalSpatialAudioEngine } from "../../interface/ILocalSpatialAudioEngine";
import { IMediaPlayer } from "../../interface/IMediaPlayer";
import { IMediaPlayerCacheManager } from "../../interface/IMediaPlayerCacheManager";
import { IMediaRecorder } from "../../interface/IMediaRecorder";
import { MediaRecordWeb } from "./MediaRecordWeb";
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
    ScreenCaptureSourceType,
} from "../../types/AgoraRtcEngine";
import { RtcConnection } from "../../types/AgoraRtcEngineEx";
import { IRtcEngineEventHandler } from "../../interface/IRtcEngineEventHandler";
import AgoraRTC, {
    IAgoraRTCClient,
    ILocalAudioTrack,
    ILocalVideoTrack,
    ILocalDataChannel,
    IAgoraRTCRemoteUser,
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
import { VideoTextureManager } from "./VideoTextureManager";

const ERR_OK = ERROR_CODE_TYPE.ERR_OK;
const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
const ERR_NOT_READY = ERROR_CODE_TYPE.ERR_NOT_READY;
const ERR_INVALID_ARGUMENT = ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
const ERR_FAILED = ERROR_CODE_TYPE.ERR_FAILED;
const ERR_INVALID_USER_ACCOUNT = ERROR_CODE_TYPE.ERR_INVALID_USER_ACCOUNT;
const EMPTY_RtcStats: RtcStats = {
    duration: 0,
    txBytes: 0,
    rxBytes: 0,
    txAudioBytes: 0,
    txVideoBytes: 0,
    rxAudioBytes: 0,
    rxVideoBytes: 0,
    txKBitRate: 0,
    rxKBitRate: 0,
    rxAudioKBitRate: 0,
    txAudioKBitRate: 0,
    rxVideoKBitRate: 0,
    txVideoKBitRate: 0,
    lastmileDelay: 0,
    userCount: 0,
    cpuAppUsage: 0,
    cpuTotalUsage: 0,
    gatewayRtt: 0,
    memoryAppUsageRatio: 0,
    memoryTotalUsageRatio: 0,
    memoryAppUsageInKbytes: 0,
    connectTimeMs: 0,
    firstAudioPacketDuration: 0,
    firstVideoPacketDuration: 0,
    firstVideoKeyFramePacketDuration: 0,
    packetsBeforeFirstKeyFramePacket: 0,
    firstAudioPacketDurationAfterUnmute: 0,
    firstVideoPacketDurationAfterUnmute: 0,
    firstVideoKeyFramePacketDurationAfterUnmute: 0,
    firstVideoKeyFrameDecodedDurationAfterUnmute: 0,
    firstVideoKeyFrameRenderedDurationAfterUnmute: 0,
    txPacketLossRate: 0,
    rxPacketLossRate: 0,
    lanAccelerateState: 0,
};

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
    public mainClientVideoEncoderConfiguration: NativeVideoEncoderConfiguration = {
        codecType: VIDEO_CODEC_TYPE.VIDEO_CODEC_H264,
        dimensions: {
            width: 640,
            height: 360,
        },
        frameRate: 15,
        bitrate: 0,
        minBitrate: 0,
        orientationMode: ORIENTATION_MODE.ORIENTATION_MODE_FIXED_LANDSCAPE,
        degradationPreference: DEGRADATION_PREFERENCE.MAINTAIN_AUTO,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_AUTO,
        advanceOptions: {
            encodingPreference: ENCODING_PREFERENCE.PREFER_AUTO,
            compressionPreference: COMPRESSION_PREFERENCE.PREFER_COMPRESSION_AUTO,
            encodeAlpha: true,
        },
    };
    public subClientProxies: Map<string, AgoraRTCClientProxy> = new Map();
    public subClientVideoEncoderConfigurations: Map<string, NativeVideoEncoderConfiguration> = new Map();
    public audioEnabled = true;
    public videoEnabled = false;
    public dualStreamEnabled = false;

    public trackManager: TrackManager = new TrackManager();

    private _mediaPlayerIdCounter = 0;
    private _mediaPlayers: Map<number, MediaPlayerWeb> = new Map();
    private _videoTextureManager: VideoTextureManager = new VideoTextureManager();

    private _localVideoTextureKey(canvas: VideoCanvas): string {
        if (canvas.sourceType === VIDEO_SOURCE_TYPE.VIDEO_SOURCE_MEDIA_PLAYER) {
            return `local_media_player_${canvas.mediaPlayerId}`;
        }
        return `local_${canvas.sourceType ?? VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA}`;
    }

    private _remoteVideoTextureKey(uid: UID, connection?: RtcConnection): string {
        const connectionPart = connection ? connectionKey(connection) : "main";
        return `remote_${connectionPart}_${uid}`;
    }

    private _findRemoteUserByUid(proxy: AgoraRTCClientProxy | undefined, uid: UID): IAgoraRTCRemoteUser | undefined {
        return proxy?.remoteUsers.find((user) => {
            return user.uid === uid || (user as any)._uintUid === uid || String(user.uid) === String(uid);
        });
    }

    public clearRemoteVideoTrack(uid: UID, connection?: RtcConnection): void {
        this._videoTextureManager.detachTrack(this._remoteVideoTextureKey(uid, connection));
    }

    private _getLocalVideoTrack(canvas: VideoCanvas): ILocalVideoTrack | null {
        switch (canvas.sourceType ?? VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA) {
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA:
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_PRIMARY:
                return this.trackManager.localFirstCameraTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_SECONDARY:
                return this.trackManager.localSecondCameraTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_THIRD:
                return this.trackManager.localThirdCameraTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_FOURTH:
                return this.trackManager.localFourthCameraTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN:
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_PRIMARY:
                return this.trackManager.localFirstScreenVideoTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_SECONDARY:
                return this.trackManager.localSecondScreenVideoTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_THIRD:
                return this.trackManager.localThirdScreenVideoTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_FOURTH:
                return this.trackManager.localFourthScreenVideoTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CUSTOM:
                return this.trackManager.localCustomVideoTrack;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_MEDIA_PLAYER:
                return this._mediaPlayers.get(canvas.mediaPlayerId)?.video ?? null;
            default:
                return null;
        }
    }

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

    async release(sync: boolean): Promise<void> {
        try {
            for (const proxy of this.subClientProxies.values()) {
                await proxy.release();
            }
            this.subClientProxies.clear();
            this.subClientVideoEncoderConfigurations.clear();

            await this.mainClientProxy?.release();
            this.mainClientProxy = null;

            for (const player of this._mediaPlayers.values()) {
                await player.dispose();
            }
            this._mediaPlayers.clear();
            this._mediaPlayerIdCounter = 0;

            this.trackManager.clearAll();
            this._videoTextureManager.destroy();

            this.rtcEngineEventHandler = undefined;
            this.mainClientVideoEncoderConfiguration = undefined;
            this.localVideoDataSourcePosition = VIDEO_MODULE_POSITION.POSITION_POST_CAPTURER;
            this.audioEnabled = true;
            this.videoEnabled = false;
            this.dualStreamEnabled = false;
        } catch (e) {
            console.error("RtcEngineWeb release failed", e);
        }
    }

    async getAudioDeviceManager(): Promise<IAudioDeviceManager> {
        const manager = new AudioDeviceManagerWeb();
        await manager.init();
        return manager;
    }

    async getVideoDeviceManager(): Promise<IVideoDeviceManager> {
        const manager = new VideoDeviceManagerWeb();
        await manager.init();
        return manager;
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

        // When a MediaPlayer audio track is replaced (e.g. selectAudioTrack),
        // notify all client proxies so they re-publish the new track.
        this.trackManager.onMediaPlayerAudioTrackReplaced = (playerId: number) => {
            this.mainClientProxy?.syncMediaPlayerTrackPublish(playerId);
            this.subClientProxies.forEach((proxy) => proxy.syncMediaPlayerTrackPublish(playerId));
        };

        AgoraRTC.setAppType(10);
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
    async joinChannel(token: string, channelId: unknown, infoOrUid: unknown, uidOrOptions: unknown): Promise<number> {
        try {
            if (typeof infoOrUid === "string") {
                console.warn("The 'info' parameter in joinChannel is not support in web");
                const info = infoOrUid as string;
                const uid = uidOrOptions as number;
                const options: ChannelMediaOptions = {
                    publishCameraTrack: true,
                    publishMicrophoneTrack: true,
                    autoSubscribeVideo: true,
                    autoSubscribeAudio: true,
                };
                this.mainClientProxy.applyAutoSubscribeOptions(options);
                token = token || null;
                const selfUid = await this.mainClientProxy.join(this.appId, channelId as string, token, uid, {
                    autoSubscribe: false,
                    networkQualityProbe: true,
                });
                await this.updateChannelMediaOptions(options);
                this.rtcEngineEventHandler?.onJoinChannelSuccess(
                    { channelId: channelId as string, localUid: selfUid as number },
                    0,
                );
                return ERROR_CODE_TYPE.ERR_OK;
            } else {
                const uid = infoOrUid as number;
                const options = uidOrOptions as ChannelMediaOptions;
                this.mainClientProxy.applyAutoSubscribeOptions(options);
                const selfUid = await this.mainClientProxy.join(this.appId, channelId as string, token as string, uid, {
                    autoSubscribe: false,
                    networkQualityProbe: true,
                });
                await this.updateChannelMediaOptions(options);
                this.rtcEngineEventHandler?.onJoinChannelSuccess(
                    { channelId: channelId as string, localUid: selfUid as number },
                    0,
                );
                return ERROR_CODE_TYPE.ERR_OK;
            }
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

    async updateChannelMediaOptions(options: ChannelMediaOptions): Promise<number> {
        try {
            const proxy = this.mainClientProxy;
            return await this.__updateChannelMediaOptions(proxy, options);
        } catch (e) {
            console.error("updateChannelMediaOptions failed:", e.toString ? e.toString() : "");
            return ERR_FAILED;
        }
    }

    async __updateChannelMediaOptions(proxy: AgoraRTCClientProxy, options: ChannelMediaOptions): Promise<number> {
        return await proxy.updateChannelMediaOptions(options);
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
            this._videoTextureManager.detachTracksByPrefix("remote_main_");
            if (mainClientProxy.channelName && mainClientProxy.uid) {
                this.rtcEngineEventHandler?.onLeaveChannel(
                    {
                        channelId: mainClientProxy.channelName,
                        localUid: mainClientProxy.uid as number,
                    },
                    EMPTY_RtcStats,
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
        await this.trackManager.enableVideo();
        return ERR_OK;
    }

    async disableVideo(): Promise<number> {
        this.videoEnabled = false;
        await this.trackManager.disableVideo();
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

    async setupRemoteVideo(
        canvas: VideoCanvas,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<number> {
        try {
            const key = this._remoteVideoTextureKey(canvas.uid);
            if (!canvas.view) {
                this._videoTextureManager.unbind(key);
                return ERR_OK;
            }
            await this._videoTextureManager.setupRemoteVideo(
                key,
                () => this._findRemoteUserByUid(this.mainClientProxy, canvas.uid)?.videoTrack,
                canvas.view,
                onAspectRatioChanged,
            );
            return ERR_OK;
        } catch (e) {
            console.error("setupRemoteVideo failed", e);
            return ERR_FAILED;
        }
    }

    async setRtcVideoDebugViewEnabled(enabled: boolean): Promise<number> {
        this._videoTextureManager.setDebugVisible(enabled);
        return ERR_OK;
    }

    async setupLocalVideo(
        canvas: VideoCanvas,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<number> {
        try {
            const key = this._localVideoTextureKey(canvas);
            if (!canvas.view) {
                this._videoTextureManager.unbind(key);
                return ERR_OK;
            }
            await this._videoTextureManager.setupLocalVideo(
                key,
                () => this._getLocalVideoTrack(canvas),
                canvas.view,
                onAspectRatioChanged,
            );
            return ERR_OK;
        } catch (e) {
            console.error("setupLocalVideo failed", e);
            return ERR_FAILED;
        }
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
        await this.trackManager.enableAudio();
        return ERR_OK;
    }

    async disableAudio(): Promise<number> {
        this.audioEnabled = false;
        await this.trackManager.disableAudio();
        return ERR_OK;
    }

    async setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): Promise<number>;
    async setAudioProfile(profile: AUDIO_PROFILE_TYPE): Promise<number>;
    async setAudioProfile(profile: unknown, scenario?: unknown): Promise<number> {
        console.warn("setAudioProfile not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioScenario(scenario: AUDIO_SCENARIO_TYPE): Promise<number> {
        console.warn("setAudioScenario not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableLocalAudio(enabled: boolean): Promise<number> {
        //do it for all client
        await this.trackManager.enableLocalAudio(enabled);
        return ERR_OK;
    }

    async muteLocalAudioStream(mute: boolean): Promise<number> {
        try {
            return await this.__muteLocalAudioStream(this.mainClientProxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteLocalAudioStream(proxy: AgoraRTCClientProxy, mute: boolean): Promise<number> {
        await proxy.muteLocalAudioStream(mute);
        return ERR_OK;
    }

    async muteAllRemoteAudioStreams(mute: boolean): Promise<number> {
        try {
            return await this.__muteAllRemoteAudioStreams(this.mainClientProxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteAllRemoteAudioStreams(proxy: AgoraRTCClientProxy, mute: boolean): Promise<number> {
        await proxy?.muteAllRemoteAudioStreams(mute);
        return ERR_OK;
    }

    async muteRemoteAudioStream(uid: number, mute: boolean): Promise<number> {
        try {
            return await this.__muteRemoteAudioStream(this.mainClientProxy, uid, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteRemoteAudioStream(proxy: AgoraRTCClientProxy, uid: number, mute: boolean): Promise<number> {
        await proxy?.muteRemoteAudioStream(uid, mute);
        return ERR_OK;
    }

    async muteLocalVideoStream(mute: boolean): Promise<number> {
        try {
            return await this.__muteLocalVideoStream(this.mainClientProxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteLocalVideoStream(proxy: AgoraRTCClientProxy, mute: boolean): Promise<number> {
        await proxy.muteLocalVideoStream(mute);
        return ERR_OK;
    }

    async enableLocalVideo(enabled: boolean): Promise<number> {
        await this.trackManager.enableLocalVideo(enabled);
        return ERR_OK;
    }

    async muteAllRemoteVideoStreams(mute: boolean): Promise<number> {
        try {
            return await this.__muteAllRemoteVideoStreams(this.mainClientProxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteAllRemoteVideoStreams(proxy: AgoraRTCClientProxy, mute: boolean): Promise<number> {
        await proxy?.muteAllRemoteVideoStreams(mute);
        return ERR_OK;
    }

    async setRemoteDefaultVideoStreamType(streamType: VIDEO_STREAM_TYPE): Promise<number> {
        try {
            const st = Native2Web.VideoStreamType(streamType);
            await this.mainClientProxy?.setRemoteDefaultVideoStreamType(st);

            await Promise.all(
                Array.from(this.subClientProxies.values()).map((client) => client.setRemoteDefaultVideoStreamType(st)),
            );
            return ERR_OK;
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteRemoteVideoStream(uid: number, mute: boolean): Promise<number> {
        try {
            return await this.__muteRemoteVideoStream(this.mainClientProxy, uid, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteRemoteVideoStream(proxy: AgoraRTCClientProxy, uid: number, mute: boolean): Promise<number> {
        await proxy.muteRemoteVideoStream(uid, mute);
        return ERR_OK;
    }

    async setRemoteVideoStreamType(uid: number, streamType: VIDEO_STREAM_TYPE): Promise<number> {
        try {
            return await this.__setRemoteVideoStreamType(this.mainClientProxy, uid, streamType);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __setRemoteVideoStreamType(
        proxy: AgoraRTCClientProxy,
        uid: number,
        streamType: VIDEO_STREAM_TYPE,
    ): Promise<number> {
        await proxy?.setRemoteVideoStreamType(uid, Native2Web.VideoStreamType(streamType));
        return ERR_OK;
    }

    async setRemoteVideoSubscriptionOptions(uid: number, options: VideoSubscriptionOptions): Promise<number> {
        try {
            return await this.__setRemoteVideoSubscriptionOptions(this.mainClientProxy, uid, options);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __setRemoteVideoSubscriptionOptions(
        proxy: AgoraRTCClientProxy,
        uid: number,
        options: VideoSubscriptionOptions,
    ): Promise<number> {
        await proxy?.setRemoteVideoStreamType(uid, Native2Web.VideoStreamType(options.type));
        return ERR_OK;
    }

    async setSubscribeAudioBlocklist(uidList: number[], uidNumber: number): Promise<number> {
        try {
            return await this.__setSubscribeAudioBlocklist(this.mainClientProxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __setSubscribeAudioBlocklist(proxy: AgoraRTCClientProxy, uidList: number[]): Promise<number> {
        await proxy?.setSubscribeAudioBlocklist(uidList);
        return ERR_OK;
    }

    async setSubscribeAudioAllowlist(uidList: number[], uidNumber: number): Promise<number> {
        try {
            return await this.__setSubscribeAudioAllowlist(this.mainClientProxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __setSubscribeAudioAllowlist(proxy: AgoraRTCClientProxy, uidList: number[]): Promise<number> {
        await proxy?.setSubscribeAudioAllowlist(uidList);
        return ERR_OK;
    }

    async setSubscribeVideoBlocklist(uidList: number[], uidNumber: number): Promise<number> {
        try {
            return await this.__setSubscribeVideoBlocklist(this.mainClientProxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __setSubscribeVideoBlocklist(proxy: AgoraRTCClientProxy, uidList: number[]): Promise<number> {
        await proxy?.setSubscribeVideoBlocklist(uidList);
        return ERR_OK;
    }

    async setSubscribeVideoAllowlist(uidList: number[], uidNumber: number): Promise<number> {
        try {
            return await this.__setSubscribeVideoAllowlist(this.mainClientProxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __setSubscribeVideoAllowlist(proxy: AgoraRTCClientProxy, uidList: number[]): Promise<number> {
        await proxy?.setSubscribeVideoAllowlist(uidList);
        return ERR_OK;
    }

    async enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): Promise<number> {
        try {
            return await this.__enableAudioVolumeIndication(this.mainClientProxy);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __enableAudioVolumeIndication(proxy: AgoraRTCClientProxy): Promise<number> {
        await proxy?.enableAudioVolumeIndicator();
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
        const mediaPlayer = new MediaPlayerWeb(this._mediaPlayerIdCounter, this.trackManager);
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
        return new MediaRecordWeb();
    }

    async destroyMediaRecorder(mediaRecorder: IMediaRecorder): Promise<number> {
        //do nothing
        return ERR_OK;
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
        console.warn("playEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async playAllEffects(
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
    ): Promise<number> {
        console.warn("playAllEffects not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async getVolumeOfEffect(soundId: number): Promise<number> {
        console.warn("getVolumeOfEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setVolumeOfEffect(soundId: number, volume: number): Promise<number> {
        console.warn("setVolumeOfEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async pauseEffect(soundId: number): Promise<number> {
        console.warn("pauseEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async pauseAllEffects(): Promise<number> {
        console.warn("pauseAllEffects not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeEffect(soundId: number): Promise<number> {
        console.warn("resumeEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeAllEffects(): Promise<number> {
        console.warn("resumeAllEffects not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async stopEffect(soundId: number): Promise<number> {
        console.warn("stopEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async stopAllEffects(): Promise<number> {
        console.warn("stopAllEffects not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async unloadEffect(soundId: number): Promise<number> {
        console.warn("unloadEffect not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async unloadAllEffects(): Promise<number> {
        console.warn("unloadAllEffects not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async getEffectDuration(filePath: string): Promise<number> {
        console.warn("getEffectDuration not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setEffectPosition(soundId: number, pos: number): Promise<number> {
        console.warn("setEffectPosition not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async getEffectCurrentPosition(soundId: number): Promise<number> {
        console.warn("getEffectCurrentPosition not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async enableSoundPositionIndication(enabled: boolean): Promise<number> {
        console.warn("enableSoundPositionIndication not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteVoicePosition(uid: number, pan: number, gain: number): Promise<number> {
        console.warn("setRemoteVoicePosition not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async enableSpatialAudio(enabled: boolean): Promise<number> {
        console.warn("enableSpatialAudio not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): Promise<number> {
        console.warn("setRemoteUserSpatialAudioParams not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): Promise<number> {
        console.warn("setVoiceBeautifierPreset not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): Promise<number> {
        console.warn("setAudioEffectPreset not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): Promise<number> {
        console.warn("setVoiceConversionPreset not support in web (will support later)");
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioEffectParameters(preset: AUDIO_EFFECT_PRESET, param1: number, param2: number): Promise<number> {
        console.warn("setAudioEffectParameters not support in web (will support later)");
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
        const sdkLevel = Native2Web.LOG_LEVEL(level);
        AgoraRTC.setLogLevel(sdkLevel);
        return ERR_OK;
    }

    async setLogFileSize(fileSizeInKBytes: number): Promise<number> {
        console.warn("setLogFileSize not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async uploadLogFile(): Promise<{ requestId: string; errorCode: number }> {
        try {
            AgoraRTC.enableLogUpload();
            return { requestId: "", errorCode: ERR_OK };
        } catch (e) {
            console.error("uploadLogFile failed:", e.toString ? e.toString() : "");
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return { errorCode: -Web2Native.AgoraRTCErrorCode(err.code), requestId: "" };
            } else {
                return { errorCode: -ERROR_CODE_TYPE.ERR_FAILED, requestId: "" };
            }
        }
    }

    async writeLog(level: LOG_LEVEL, fmt: string): Promise<number> {
        console.warn("writeLog not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Render ====================

    async setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number>;
    async setLocalRenderMode(renderMode: RENDER_MODE_TYPE): Promise<number>;
    async setLocalRenderMode(renderMode: unknown, mirrorMode?: unknown): Promise<number> {
        console.warn("setLocalRenderMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteRenderMode(
        uid: number,
        renderMode: RENDER_MODE_TYPE,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE,
    ): Promise<number> {
        console.warn("setRemoteRenderMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLocalRenderTargetFps(sourceType: VIDEO_SOURCE_TYPE, targetFps: number): Promise<number> {
        console.warn("setLocalRenderTargetFps not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteRenderTargetFps(targetFps: number): Promise<number> {
        console.warn("setRemoteRenderTargetFps not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): Promise<number> {
        console.warn("setLocalVideoMirrorMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Dual Stream ====================

    async enableDualStreamMode(enabled: boolean): Promise<number>;
    async enableDualStreamMode(enabled: boolean, streamConfig: SimulcastStreamConfig): Promise<number>;
    async enableDualStreamMode(enabled: unknown, streamConfig?: unknown): Promise<number> {
        console.warn("enableDualStreamMode not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setDualStreamMode(mode: SIMULCAST_STREAM_MODE): Promise<number>;
    async setDualStreamMode(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig): Promise<number>;
    async setDualStreamMode(mode: unknown, streamConfig?: unknown): Promise<number> {
        console.warn("setDualStreamMode not support in web");
        return -ERR_NOT_SUPPORTED;
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
        console.warn("adjustRecordingSignalVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async muteRecordingSignal(mute: boolean): Promise<number> {
        try {
            return await this.__muteRecordingSignal(mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __muteRecordingSignal(mute: boolean): Promise<number> {
        await this.trackManager.MuteRecordingSignal(mute);
        return ERR_OK;
    }

    async adjustPlaybackSignalVolume(volume: number): Promise<number> {
        this.mainClientProxy?.remoteUsers.forEach((user) => {
            if (user.audioTrack) {
                user.audioTrack.setVolume(volume / 4);
            }
        });

        this.subClientProxies.forEach((subClientProxy) => {
            const remoteUsers = subClientProxy.remoteUsers;
            remoteUsers.forEach((user) => {
                if (user.audioTrack) {
                    user.audioTrack.setVolume(volume / 4);
                }
            });
        });
        return ERR_OK;
    }

    async adjustUserPlaybackSignalVolume(uid: number, volume: number): Promise<number> {
        try {
            return await this.__adjustUserPlaybackSignalVolume(this.mainClientProxy, uid, volume);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __adjustUserPlaybackSignalVolume(proxy: AgoraRTCClientProxy, uid: number, volume: number): Promise<number> {
        const remoteUser = proxy?.remoteUsers.find((u) => u.uid === uid);
        if (remoteUser?.audioTrack) {
            remoteUser.audioTrack.setVolume(volume);
        }
        return ERR_OK;
    }

    async setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): Promise<number> {
        console.warn("setRemoteSubscribeFallbackOption not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setHighPriorityUserList(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS): Promise<number> {
        console.warn("setHighPriorityUserList not support in web");
        return -ERR_NOT_SUPPORTED;
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
        console.warn("web screen capture sources wiill always return fake data");
        const sources: ScreenCaptureSourceInfo[] = [];
        sources.push({
            type: ScreenCaptureSourceType.ScreenCaptureSourceType_Screen,
            sourceId: 0,
            sourceName: "Screen",
            thumbImage: null,
            iconImage: null,
            processPath: "",
            sourceTitle: "",
            primaryMonitor: false,
            isOccluded: false,
            position: null,
            minimizeWindow: false,
            sourceDisplayId: 0,
        });
        sources.push({
            type: ScreenCaptureSourceType.ScreenCaptureSourceType_Window,
            sourceId: 1,
            sourceName: "Window",
            thumbImage: null,
            iconImage: null,
            processPath: "",
            sourceTitle: "",
            primaryMonitor: false,
            isOccluded: false,
            position: null,
            minimizeWindow: false,
            sourceDisplayId: 0,
        });
        return sources;
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
        return await this.trackManager.createLocalFirstScreenTrack(
            Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
        );
    }

    async startScreenCaptureByScreenRect(
        screenRect: Rectangle,
        regionRect: Rectangle,
        captureParams: ScreenCaptureParameters,
    ): Promise<number> {
        return await this.trackManager.createLocalFirstScreenTrack(
            Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
        );
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
        await this.trackManager.createLocalFirstCameraVideoTrack(
            Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
        );
        return ERR_OK;
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
            let st: VIDEO_SOURCE_TYPE = VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_PRIMARY;
            if (config) {
                st = sourceType as VIDEO_SOURCE_TYPE;
            }
            switch (st) {
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_PRIMARY:
                    return await this.trackManager.createLocalFirstScreenTrack(
                        Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
                    );
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_SECONDARY:
                    return await this.trackManager.createLocalSecondScreenTrack(
                        Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
                    );
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_THIRD:
                    return await this.trackManager.createLocalThirdScreenTrack(
                        Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
                    );
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_FOURTH:
                    return await this.trackManager.createLocalFourthScreenTrack(
                        Native2Web.VideoEncoderConfiguration(this.mainClientVideoEncoderConfiguration),
                    );
                    break;
                default:
                    return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
                    break;
            }
            return ERR_OK;
        } catch (e) {
            console.error("startScreenCapture failed:", e.toString ? e.toString() : "");
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
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
        let st = VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_PRIMARY;
        if (sourceType) {
            st = sourceType as VIDEO_SOURCE_TYPE;
        }
        switch (st) {
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_PRIMARY:
                await this.trackManager.closeLocalFirstScreenTrack();
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_SECONDARY:
                await this.trackManager.closeLocalSecondScreenTrack();
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_THIRD:
                await this.trackManager.closeLocalThirdScreenTrack();
                break;
            case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_SCREEN_FOURTH:
                await this.trackManager.closeLocalFourthScreenTrack();
                break;
            default:
                return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
                break;
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
        try {
            return await this.__startRtmpStreamWithoutTranscoding(this.mainClientProxy, url);
        } catch (e) {
            console.error("startRtmpStreamWithoutTranscoding failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __startRtmpStreamWithoutTranscoding(proxy: AgoraRTCClientProxy, url: string): Promise<number> {
        await proxy?.startLiveStreaming(url, false);
        return ERR_OK;
    }

    async startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): Promise<number> {
        try {
            return await this.__startRtmpStreamWithTranscoding(this.mainClientProxy, url, transcoding);
        } catch (e) {
            console.error("startRtmpStreamWithTranscoding failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __startRtmpStreamWithTranscoding(
        proxy: AgoraRTCClientProxy,
        url: string,
        transcoding: LiveTranscoding,
    ): Promise<number> {
        await proxy?.setLiveTranscoding(Native2Web.LiveTranscoding(transcoding));
        await proxy?.startLiveStreaming(url, true);
        return ERR_OK;
    }

    async updateRtmpTranscoding(transcoding: LiveTranscoding): Promise<number> {
        try {
            return await this.__updateRtmpTranscoding(this.mainClientProxy, transcoding);
        } catch (e) {
            console.error("updateRtmpTranscoding failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __updateRtmpTranscoding(proxy: AgoraRTCClientProxy, transcoding: LiveTranscoding): Promise<number> {
        await proxy?.setLiveTranscoding(Native2Web.LiveTranscoding(transcoding));
        return ERR_OK;
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
        try {
            return await this.__stopRtmpStream(this.mainClientProxy, url);
        } catch (e) {
            console.error("stopRtmpStream failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __stopRtmpStream(proxy: AgoraRTCClientProxy, url: string): Promise<number> {
        await proxy?.stopLiveStreaming(url);
        return ERR_OK;
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
        try {
            switch (sourceType) {
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_PRIMARY:
                    return await this.trackManager.createLocalFirstCameraVideoTrack();
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_SECONDARY:
                    return await this.trackManager.createLocalSecondCameraVideoTrack();
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_THIRD:
                    return await this.trackManager.createLocalThirdCameraVideoTrack();
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_FOURTH:
                    return await this.trackManager.createLocalFourthCameraVideoTrack();
                    break;
                default:
                    return -ERR_INVALID_ARGUMENT;
                    break;
            }
        } catch (e) {
            console.error("startCameraCapture failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async stopCameraCapture(sourceType: VIDEO_SOURCE_TYPE): Promise<number> {
        try {
            switch (sourceType) {
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_PRIMARY:
                    await this.trackManager.closeLocalFirstCameraVideoTrack();
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_SECONDARY:
                    await this.trackManager.closeLocalSecondCameraVideoTrack();
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_THIRD:
                    await this.trackManager.closeLocalSecondCameraVideoTrack();
                    break;
                case VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA_FOURTH:
                    await this.trackManager.closeLocalFourthCameraVideoTrack();
                    break;
                default:
                    return -ERR_INVALID_ARGUMENT;
                    break;
            }
        } catch (e) {
            console.error("startCameraCapture failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async setCameraDeviceOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number> {
        return ERR_OK;
    }

    async setScreenCaptureOrientation(type: VIDEO_SOURCE_TYPE, orientation: VIDEO_ORIENTATION): Promise<number> {
        return ERR_OK;
    }

    async getConnectionState(): Promise<CONNECTION_STATE_TYPE> {
        try {
            return await this.__getConnectionState(this.mainClientProxy);
        } catch (e) {
            return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
        }
    }

    async __getConnectionState(proxy: AgoraRTCClientProxy): Promise<CONNECTION_STATE_TYPE> {
        if (!proxy) {
            return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
        }
        return Web2Native.ConnectionState(proxy.connectionState);
    }

    async setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): Promise<number> {
        console.warn("setRemoteUserPriority not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    // ==================== Encryption ====================

    async enableEncryption(enabled: boolean, config: EncryptionConfig): Promise<number> {
        try {
            return await this.__enableEncryption(this.mainClientProxy, enabled, config);
        } catch (e) {
            console.error("enableEncryption failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __enableEncryption(proxy: AgoraRTCClientProxy, enabled: boolean, config: EncryptionConfig): Promise<number> {
        if (enabled) {
            const webMode = Native2Web.EncryptionMode(config.encryptionMode);
            proxy?.setEncryptionConfig(
                webMode,
                config.encryptionKey,
                config.encryptionKdfSalt,
                config.datastreamEncryptionEnabled,
            );
        } else {
            proxy?.setEncryptionConfig(
                "none",
                config.encryptionKey,
                config.encryptionKdfSalt,
                config.datastreamEncryptionEnabled,
            );
        }
        return ERR_OK;
    }

    // ==================== Data Stream ====================

    async createDataStream(reliable: boolean, ordered: boolean): Promise<{ streamId: number; errorCode: number }>;
    async createDataStream(config: DataStreamConfig): Promise<{ streamId: number; errorCode: number }>;
    async createDataStream(
        reliableParam: unknown,
        orderedParam?: unknown,
    ): Promise<{ streamId: number; errorCode: number }> {
        try {
            let reliable: boolean = true;
            let ordered: boolean = true;
            if (typeof reliableParam === "boolean") {
                reliable = reliableParam as boolean;
                ordered = orderedParam as boolean;
            } else {
                const cfg = reliableParam as DataStreamConfig;
                ordered = cfg.ordered;
            }
            const streamId = await this.__createDataStream(this.mainClientProxy, reliable, ordered);
            return { streamId, errorCode: ERR_OK };
        } catch (e) {
            console.error("createDataStream failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return { streamId: -1, errorCode: -Web2Native.AgoraRTCErrorCode(err.code) };
            } else {
                return { streamId: -1, errorCode: -ERROR_CODE_TYPE.ERR_FAILED };
            }
        }
    }

    async __createDataStream(proxy: AgoraRTCClientProxy, reliable: boolean, ordered: boolean): Promise<number> {
        return await proxy?.createDataStream(reliable, ordered);
    }

    async sendStreamMessage(streamId: number, data: ArrayBuffer, length: number): Promise<number> {
        try {
            return await this.__sendStreamMessage(this.mainClientProxy, streamId, data);
        } catch (e) {
            console.error("sendStreamMessage failed", e.toString?.());
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __sendStreamMessage(proxy: AgoraRTCClientProxy, streamId: number, data: ArrayBuffer): Promise<number> {
        await proxy?.sendData(streamId, data);
        return ERR_OK;
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
        console.warn("pauseAudio not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async resumeAudio(): Promise<number> {
        console.warn("resumeAudio not support in web");
        return -ERR_NOT_SUPPORTED;
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
        console.warn("sendCustomReportMessage not support in web");
        return -ERR_NOT_SUPPORTED;
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
        token: string,
        channelId: string,
        userAccount: string,
        optionsParam?: unknown,
    ): Promise<number> {
        if (!optionsParam) {
            try {
                token = token || null;
                const selfUid = await this.mainClientProxy.join(this.appId, channelId, token, userAccount, {
                    autoSubscribe: false,
                    networkQualityProbe: true,
                });
                this.rtcEngineEventHandler?.onJoinChannelSuccess(
                    { channelId: channelId, localUid: this.mainClientProxy.numberUid },
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
                const options = optionsParam as ChannelMediaOptions;
                const selfUid = await this.mainClientProxy.join(this.appId, channelId, token, userAccount, {
                    autoSubscribe: false,
                    networkQualityProbe: true,
                });
                await this.updateChannelMediaOptions(options);
                this.rtcEngineEventHandler?.onJoinChannelSuccess(
                    { channelId: channelId, localUid: this.mainClientProxy.numberUid },
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

    async getUserInfoByUserAccount(userAccount: string): Promise<{ errorCode: number; userInfo: UserInfo }> {
        return this.__getUserInfoByUserAccount(this.mainClientProxy, userAccount);
    }

    async __getUserInfoByUserAccount(
        proxy: AgoraRTCClientProxy,
        userAccount: string,
    ): Promise<{ errorCode: number; userInfo: UserInfo }> {
        const userInfo = proxy.getUserInfoByUserAccount(userAccount);
        if (userInfo) {
            return { errorCode: ERR_OK, userInfo: userInfo };
        } else {
            return { errorCode: ERR_INVALID_USER_ACCOUNT, userInfo: null };
        }
    }

    async getUserInfoByUid(uid: number): Promise<{ errorCode: number; userInfo: UserInfo }> {
        return this.__getUserInfoByUid(this.mainClientProxy, uid);
    }

    async __getUserInfoByUid(
        proxy: AgoraRTCClientProxy,
        uid: number,
    ): Promise<{ errorCode: number; userInfo: UserInfo }> {
        const userInfo = proxy.getUserInfoByUid(uid);
        if (userInfo) {
            return { errorCode: ERR_OK, userInfo: userInfo };
        } else {
            return { errorCode: ERR_INVALID_ARGUMENT, userInfo: null };
        }
    }

    // ==================== Channel Media Relay ====================
    async startOrUpdateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): Promise<number> {
        try {
            return await this.__startOrUpdateChannelMediaRelay(this.mainClientProxy, configuration);
        } catch (e) {
            console.error("startOrUpdateChannelMediaRelay failed:", e.toString ? e.toString() : "");
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async __startOrUpdateChannelMediaRelay(
        proxy: AgoraRTCClientProxy,
        configuration: ChannelMediaRelayConfiguration,
    ): Promise<number> {
        const conf = Native2Web.ChannelMediaRelayConfiguration(configuration);
        await proxy?.startOrUpdateChannelMediaRelay(conf);
        return ERR_OK;
    }

    async stopChannelMediaRelay(): Promise<number> {
        try {
            return await this.__stopChannelMediaRelay(this.mainClientProxy);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async __stopChannelMediaRelay(proxy: AgoraRTCClientProxy): Promise<number> {
        await proxy?.stopChannelMediaRelay();
        return ERR_OK;
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

    async setDirectCdnStreamingVideoConfiguration(config: NativeVideoEncoderConfiguration): Promise<number> {
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
        try {
            if (proxyType == CLOUD_PROXY_TYPE.NONE_PROXY) {
                this.mainClientProxy?.stopProxyServer();
            } else {
                const mode = Native2Web.CLOUD_PROXY_TYPE(proxyType);
                this.mainClientProxy?.startProxyServer(mode);
            }
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
        console.warn("setParameters not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startMediaRenderingTracing(): Promise<number> {
        console.warn("startMediaRenderingTracing not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableInstantMediaRendering(): Promise<number> {
        console.warn("enableInstantMediaRendering not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getNtpWallTimeInMs(): Promise<number> {
        return Date.now();
    }

    async isFeatureAvailableOnDevice(type: FeatureType): Promise<boolean> {
        console.warn("isFeatureAvailableOnDevice not support in web");
        return true;
    }

    async sendAudioMetadata(metadata: Uint8Array, length: number): Promise<number> {
        console.warn("sendAudioMetadata not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async queryHDRCapability(
        videoModule: VIDEO_MODULE_TYPE,
    ): Promise<{ errorCode: number; capability: HDR_CAPABILITY }> {
        console.warn("queryHDRCapability not support in web");
        return { errorCode: -ERR_NOT_SUPPORTED, capability: HDR_CAPABILITY.HDR_CAPABILITY_UNKNOWN };
    }

    // ==================== Ex Methods ====================

    async setParametersEx(connection: RtcConnection, parameters: object): Promise<number>;
    async setParametersEx(connection: RtcConnection, parameters: string): Promise<number>;
    async setParametersEx(connection: unknown, parameters: unknown): Promise<number> {
        console.warn("setParametersEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): Promise<number> {
        if (!this.appId) {
            return ERR_NOT_READY;
        }
        const key = connectionKey(connection);
        try {
            let proxy = this.subClientProxies.get(key);
            if (!proxy) {
                const config: ClientConfig = {
                    mode: Native2Web.ChannelProfile(options.channelProfile || this.channelProfile),
                    codec: "vp8",
                };
                proxy = new AgoraRTCClientProxy(config, this, this.trackManager);
                proxy.init();
                await this.initSubClientProxy(proxy, connection);
                this.subClientProxies.set(key, proxy);
            }
            token = token || null;
            proxy.applyAutoSubscribeOptions(options);
            await proxy.join(this.appId, connection.channelId, token, connection.localUid);
            await this.__updateChannelMediaOptions(proxy, options);
            this.rtcEngineEventHandler?.onJoinChannelSuccess(connection, 0);
            return ERR_OK;
        } catch (e) {
            console.error("joinChannelEx failed:", e);
            if (isAgoraRTCError(e)) {
                const err = e as IAgoraRTCError;
                return -Web2Native.AgoraRTCErrorCode(err.code);
            } else {
                return -ERROR_CODE_TYPE.ERR_FAILED;
            }
        }
    }

    async leaveChannelEx(connection: RtcConnection): Promise<number>;
    async leaveChannelEx(connection: RtcConnection, options: LeaveChannelOptions): Promise<number>;
    async leaveChannelEx(connection: unknown, options?: unknown): Promise<number> {
        const key = connectionKey(connection as RtcConnection);
        const proxy = this.subClientProxies.get(key);
        if (!proxy) {
            return ERR_NOT_READY;
        }
        try {
            if (options && (options as LeaveChannelOptions).stopMicrophoneRecording) {
                await proxy.enableMicrophoneRecording(false);
            }
            await proxy.leave();
            this._videoTextureManager.detachTracksByPrefix(`remote_${key}_`);
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
        let proxy: AgoraRTCClientProxy = null;
        let proxyKey: string = "";
        for (const [key, p] of this.subClientProxies.entries()) {
            if (p.channelName === channelId && p.uid === userAccount) {
                proxy = p;
                proxyKey = key;
                break;
            }
        }

        if (!proxy) {
            return ERR_NOT_READY;
        }

        if (options && (options as LeaveChannelOptions).stopMicrophoneRecording) {
            await proxy.enableMicrophoneRecording(false);
        }
        await proxy.leave();
        this._videoTextureManager.detachTracksByPrefix(`remote_${proxyKey}_`);
        this.rtcEngineEventHandler?.onLeaveChannel(
            {
                channelId: proxy.channelName,
                localUid: proxy.numberUid,
            },
            EMPTY_RtcStats,
        );
        console.warn("leaveChannelWithUserAccountEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__updateChannelMediaOptions(proxy, options);
        } catch (e) {
            console.error("updateChannelMediaOptionsEx failed:", e.toString ? e.toString() : "");
            return ERR_FAILED;
        }
    }

    async setVideoEncoderConfigurationEx(
        config: NativeVideoEncoderConfiguration,
        connection: RtcConnection,
    ): Promise<number> {
        const key = connectionKey(connection);
        this.subClientVideoEncoderConfigurations.set(key, config);

        const client = this.subClientProxies.get(key);
        await client?.setVideoEncoderConfiguration(config);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async setupRemoteVideoEx(
        canvas: VideoCanvas,
        connection: RtcConnection,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            const textureKey = this._remoteVideoTextureKey(canvas.uid, connection);
            if (!canvas.view) {
                this._videoTextureManager.unbind(textureKey);
                return ERR_OK;
            }
            await this._videoTextureManager.setupRemoteVideo(
                textureKey,
                () => this._findRemoteUserByUid(proxy, canvas.uid)?.videoTrack,
                canvas.view,
                onAspectRatioChanged,
            );
            return ERR_OK;
        } catch (e) {
            console.error("setupRemoteVideoEx failed", e);
            return ERR_FAILED;
        }
    }

    async muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__muteRemoteAudioStream(proxy, uid, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__muteRemoteVideoStream(proxy, uid, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setRemoteVideoStreamTypeEx(
        uid: number,
        streamType: VIDEO_STREAM_TYPE,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__setRemoteVideoStreamType(proxy, uid, streamType);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteLocalAudioStreamEx(mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__muteLocalAudioStream(proxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteLocalVideoStreamEx(mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__muteLocalVideoStream(proxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteAllRemoteAudioStreamsEx(mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__muteAllRemoteAudioStreams(proxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async muteAllRemoteVideoStreamsEx(mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__muteAllRemoteVideoStreams(proxy, mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeAudioBlocklistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__setSubscribeAudioBlocklist(proxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeAudioAllowlistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__setSubscribeAudioAllowlist(proxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeVideoBlocklistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__setSubscribeVideoBlocklist(proxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setSubscribeVideoAllowlistEx(
        uidList: number[],
        uidNumber: number,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__setSubscribeVideoAllowlist(proxy, uidList);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async setRemoteVideoSubscriptionOptionsEx(
        uid: number,
        options: VideoSubscriptionOptions,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__setRemoteVideoSubscriptionOptions(proxy, uid, options);
        } catch (e) {
            return ERR_FAILED;
        }
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
        console.warn("adjustRecordingSignalVolumeEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async muteRecordingSignalEx(mute: boolean, connection: RtcConnection): Promise<number> {
        try {
            return await this.__muteRecordingSignal(mute);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async adjustUserPlaybackSignalVolumeEx(uid: number, volume: number, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__adjustUserPlaybackSignalVolume(proxy, uid, volume);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async getConnectionStateEx(connection: RtcConnection): Promise<CONNECTION_STATE_TYPE> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            return await this.__getConnectionState(proxy);
        } catch (e) {
            return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
        }
    }

    async enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__enableEncryption(proxy, enabled, config);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async createDataStreamEx(
        reliable: boolean,
        ordered: boolean,
        connection: RtcConnection,
    ): Promise<{ streamId: number; errorCode: number }>;
    async createDataStreamEx(
        config: DataStreamConfig,
        connection: RtcConnection,
    ): Promise<{ streamId: number; errorCode: number }>;
    async createDataStreamEx(
        reliableOrConfig: unknown,
        orderedParam: unknown,
        orderedOrConnection?: unknown,
    ): Promise<{ streamId: number; errorCode: number }> {
        try {
            let reliable: boolean = true;
            let ordered: boolean = true;
            let connection: RtcConnection = null;
            if (typeof reliableOrConfig === "boolean") {
                reliable = reliableOrConfig as boolean;
                ordered = orderedParam as boolean;
                connection = orderedOrConnection as RtcConnection;
            } else {
                const cfg = reliableOrConfig as DataStreamConfig;
                ordered = cfg.ordered;
                connection = orderedParam as RtcConnection;
            }
            const key = connectionKey(connection as RtcConnection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return { streamId: -1, errorCode: -ERR_NOT_READY };
            }
            return { streamId: await this.__createDataStream(proxy, reliable, ordered), errorCode: ERR_OK };
        } catch (e) {
            return { streamId: -1, errorCode: -ERR_FAILED };
        }
    }

    async sendStreamMessageEx(
        streamId: number,
        data: ArrayBuffer,
        length: number,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__sendStreamMessage(proxy, streamId, data);
        } catch (e) {
            return ERR_FAILED;
        }
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
        console.warn("sendCustomReportMessageEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableAudioVolumeIndicationEx(
        interval: number,
        smooth: number,
        reportVad: boolean,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__enableAudioVolumeIndication(proxy);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startRtmpStreamWithoutTranscodingEx(url: string, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__startRtmpStreamWithoutTranscoding(proxy, url);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startRtmpStreamWithTranscodingEx(
        url: string,
        transcoding: LiveTranscoding,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__startRtmpStreamWithTranscoding(proxy, url, transcoding);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async updateRtmpTranscodingEx(transcoding: LiveTranscoding, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__updateRtmpTranscoding(proxy, transcoding);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async stopRtmpStreamEx(url: string, connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__stopRtmpStream(proxy, url);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async startOrUpdateChannelMediaRelayEx(
        configuration: ChannelMediaRelayConfiguration,
        connection: RtcConnection,
    ): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__startOrUpdateChannelMediaRelay(proxy, configuration);
        } catch (e) {
            return ERR_FAILED;
        }
    }

    async stopChannelMediaRelayEx(connection: RtcConnection): Promise<number> {
        try {
            const key = connectionKey(connection);
            const proxy = this.subClientProxies.get(key);
            if (!proxy) {
                return ERR_NOT_READY;
            }
            return await this.__stopChannelMediaRelay(proxy);
        } catch (e) {
            return ERR_FAILED;
        }
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
        const key = connectionKey(connection);
        const proxy = this.subClientProxies.get(key);
        if (!proxy) {
            return ERR_NOT_READY;
        }
        const result = await this.__getUserInfoByUserAccount(proxy, userAccount);
        return result.errorCode;
    }

    async getUserInfoByUidEx(uid: number, userInfo: UserInfo, connection: RtcConnection): Promise<number> {
        const key = connectionKey(connection);
        const proxy = this.subClientProxies.get(key);
        if (!proxy) {
            return ERR_NOT_READY;
        }
        const result = await this.__getUserInfoByUid(proxy, uid);
        return result.errorCode;
    }

    async enableDualStreamModeEx(
        enabled: boolean,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("enableDualStreamModeEx not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setDualStreamModeEx(
        mode: SIMULCAST_STREAM_MODE,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number> {
        console.warn("setDualStreamModeEx not support in web");
        return -ERR_NOT_SUPPORTED;
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
        console.warn("setHighPriorityUserListEx not support in web");
        return -ERR_NOT_SUPPORTED;
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
            const config = this.subClientVideoEncoderConfigurations.get(key);
            if (config) {
                await subClient.setVideoEncoderConfiguration(config);
            }
        }

        return ERR_OK;
    }
}
