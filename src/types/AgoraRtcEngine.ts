import { IRtcEngineEventHandler } from "../interface/IRtcEngineEventHandler";
import {
    QUALITY_ADAPT_INDICATION,
    VIDEO_CODEC_TYPE,
    CAPTURE_BRIGHTNESS_LEVEL_TYPE,
    VideoDimensions,
    VIDEO_STREAM_TYPE,
    AUDIO_SAMPLE_RATE_TYPE,
    CAMERA_FOCAL_LENGTH_TYPE,
    VideoFormat,
    VIDEO_MIRROR_MODE_TYPE,
    CLIENT_ROLE_TYPE,
    AUDIENCE_LATENCY_LEVEL_TYPE,
    CHANNEL_PROFILE_TYPE,
    MultipathMode,
    MultipathType,
    AUDIO_SCENARIO_TYPE,
    AREA_CODE,
    THREAD_PRIORITY_TYPE,
    Rectangle,
    ScreenCaptureParameters,
} from "./AgoraBase";
import { LogConfig } from "./AgoraLog";
import { RENDER_MODE_TYPE, MEDIA_SOURCE_TYPE } from "./AgoraMediaBase";

export enum MEDIA_DEVICE_TYPE {
    UNKNOWN_AUDIO_DEVICE = -1,

    AUDIO_PLAYOUT_DEVICE = 0,

    AUDIO_RECORDING_DEVICE = 1,

    VIDEO_RENDER_DEVICE = 2,

    VIDEO_CAPTURE_DEVICE = 3,

    AUDIO_APPLICATION_PLAYOUT_DEVICE = 4,

    AUDIO_VIRTUAL_PLAYOUT_DEVICE = 5,

    AUDIO_VIRTUAL_RECORDING_DEVICE = 6,
}

export enum AUDIO_MIXING_STATE_TYPE {
    AUDIO_MIXING_STATE_PLAYING = 710,

    AUDIO_MIXING_STATE_PAUSED = 711,

    AUDIO_MIXING_STATE_STOPPED = 713,

    AUDIO_MIXING_STATE_FAILED = 714,
}

export enum AUDIO_MIXING_REASON_TYPE {
    AUDIO_MIXING_REASON_CAN_NOT_OPEN = 701,

    AUDIO_MIXING_REASON_TOO_FREQUENT_CALL = 702,

    AUDIO_MIXING_REASON_INTERRUPTED_EOF = 703,

    AUDIO_MIXING_REASON_ONE_LOOP_COMPLETED = 721,

    AUDIO_MIXING_REASON_ALL_LOOPS_COMPLETED = 723,

    AUDIO_MIXING_REASON_STOPPED_BY_USER = 724,

    AUDIO_MIXING_REASON_RESUMED_BY_USER = 726,

    AUDIO_MIXING_REASON_OK = 0,
}

export enum INJECT_STREAM_STATUS {
    INJECT_STREAM_STATUS_START_SUCCESS = 0,

    INJECT_STREAM_STATUS_START_ALREADY_EXISTS = 1,

    INJECT_STREAM_STATUS_START_UNAUTHORIZED = 2,

    INJECT_STREAM_STATUS_START_TIMEDOUT = 3,

    INJECT_STREAM_STATUS_START_FAILED = 4,

    INJECT_STREAM_STATUS_STOP_SUCCESS = 5,

    INJECT_STREAM_STATUS_STOP_NOT_FOUND = 6,

    INJECT_STREAM_STATUS_STOP_UNAUTHORIZED = 7,

    INJECT_STREAM_STATUS_STOP_TIMEDOUT = 8,

    INJECT_STREAM_STATUS_STOP_FAILED = 9,

    INJECT_STREAM_STATUS_BROKEN = 10,
}

export enum AUDIO_EQUALIZATION_BAND_FREQUENCY {
    AUDIO_EQUALIZATION_BAND_31 = 0,

    AUDIO_EQUALIZATION_BAND_62 = 1,

    AUDIO_EQUALIZATION_BAND_125 = 2,

    AUDIO_EQUALIZATION_BAND_250 = 3,

    AUDIO_EQUALIZATION_BAND_500 = 4,

    AUDIO_EQUALIZATION_BAND_1K = 5,

    AUDIO_EQUALIZATION_BAND_2K = 6,

    AUDIO_EQUALIZATION_BAND_4K = 7,

    AUDIO_EQUALIZATION_BAND_8K = 8,

    AUDIO_EQUALIZATION_BAND_16K = 9,
}

export enum AUDIO_REVERB_TYPE {
    AUDIO_REVERB_DRY_LEVEL = 0,

    AUDIO_REVERB_WET_LEVEL = 1,

    AUDIO_REVERB_ROOM_SIZE = 2,

    AUDIO_REVERB_WET_DELAY = 3,

    AUDIO_REVERB_STRENGTH = 4,
}

export enum STREAM_FALLBACK_OPTIONS {
    STREAM_FALLBACK_OPTION_DISABLED = 0,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1,

    STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LAYER_1 = 3,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LAYER_2 = 4,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LAYER_3 = 5,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LAYER_4 = 6,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LAYER_5 = 7,

    STREAM_FALLBACK_OPTION_VIDEO_STREAM_LAYER_6 = 8,
}

export enum PRIORITY_TYPE {
    PRIORITY_HIGH = 50,

    PRIORITY_NORMAL = 100,
}

export interface LocalVideoStats {
    uid: number;

    sentBitrate: number;

    sentFrameRate: number;

    captureFrameRate: number;

    captureFrameWidth: number;

    captureFrameHeight: number;

    regulatedCaptureFrameRate: number;

    regulatedCaptureFrameWidth: number;

    regulatedCaptureFrameHeight: number;

    encoderOutputFrameRate: number;

    encodedFrameWidth: number;

    encodedFrameHeight: number;

    rendererOutputFrameRate: number;

    targetBitrate: number;

    targetFrameRate: number;

    qualityAdaptIndication: QUALITY_ADAPT_INDICATION;

    encodedBitrate: number;

    encodedFrameCount: number;

    codecType: VIDEO_CODEC_TYPE;

    txPacketLossRate: number;

    captureBrightnessLevel: CAPTURE_BRIGHTNESS_LEVEL_TYPE;

    dualStreamEnabled: boolean;

    hwEncoderAccelerating: number;

    simulcastDimensions: VideoDimensions[];

    encodedFrameDepth: number;
}

export interface RemoteAudioStats {
    uid: number;

    quality: number;

    networkTransportDelay: number;

    jitterBufferDelay: number;

    audioLossRate: number;

    numChannels: number;

    receivedSampleRate: number;

    receivedBitrate: number;

    totalFrozenTime: number;

    frozenRate: number;

    mosValue: number;

    frozenRateByCustomPlcCount: number;

    plcCount: number;

    frozenCntByCustom: number;

    frozenTimeByCustom: number;

    totalActiveTime: number;

    publishDuration: number;

    qoeQuality: number;

    qualityChangedReason: number;

    rxAudioBytes: number;

    e2eDelay: number;
}

export interface RemoteVideoStats {
    uid: number;

    delay: number;

    e2eDelay: number;

    width: number;

    height: number;

    receivedBitrate: number;

    decoderInputFrameRate: number;

    decoderOutputFrameRate: number;

    rendererOutputFrameRate: number;

    frameLossRate: number;

    packetLossRate: number;

    rxStreamType: VIDEO_STREAM_TYPE;

    totalFrozenTime: number;

    frozenRate: number;

    avSyncTimeMs: number;

    totalActiveTime: number;

    publishDuration: number;

    mosValue: number;

    rxVideoBytes: number;
}

export interface VideoCompositingLayout {
    canvasWidth: number;

    canvasHeight: number;

    backgroundColor: string;

    regions: Region[];

    regionCount: number;

    appData: string;

    appDataLength: number;
}

export interface Region {
    uid: number;

    x: number;

    y: number;

    width: number;

    height: number;

    zOrder: number;

    alpha: number;

    renderMode: RENDER_MODE_TYPE;
}

export interface InjectStreamConfig {
    width: number;

    height: number;

    videoGop: number;

    videoFramerate: number;

    videoBitrate: number;

    audioSampleRate: AUDIO_SAMPLE_RATE_TYPE;

    audioBitrate: number;

    audioChannels: number;
}

export enum RTMP_STREAM_LIFE_CYCLE_TYPE {
    RTMP_STREAM_LIFE_CYCLE_BIND2CHANNEL = 1,

    RTMP_STREAM_LIFE_CYCLE_BIND2OWNER = 2,
}

export interface PublisherConfiguration {
    width: number;

    height: number;

    framerate: number;

    bitrate: number;

    defaultLayout: number;

    lifecycle: number;

    owner: boolean;

    injectStreamWidth: number;

    injectStreamHeight: number;

    injectStreamUrl: string;

    publishUrl: string;

    rawStreamUrl: string;

    extraInfo: string;
}

export enum CAMERA_DIRECTION {
    CAMERA_REAR = 0,

    CAMERA_FRONT = 1,
}

export enum CLOUD_PROXY_TYPE {
    NONE_PROXY = 0,

    UDP_PROXY = 1,

    TCP_PROXY = 2,
}

export interface CameraCapturerConfiguration {
    cameraDirection?: CAMERA_DIRECTION;

    cameraFocalLengthType?: CAMERA_FOCAL_LENGTH_TYPE;

    deviceId?: string;

    cameraId?: string;

    followEncodeDimensionRatio?: boolean;

    format: VideoFormat;
}

export interface ScreenCaptureConfiguration {
    isCaptureWindow: boolean;

    displayId: number;

    screenRect: Rectangle;

    windowId: number;

    params: ScreenCaptureParameters;

    regionRect: Rectangle;
}

export interface SIZE {
    width: number;

    height: number;
}

export interface ThumbImageBuffer {
    buffer: Uint8Array;

    length: number;

    width: number;

    height: number;
}

export enum ScreenCaptureSourceType {
    ScreenCaptureSourceType_Unknown = -1,

    ScreenCaptureSourceType_Window = 0,

    ScreenCaptureSourceType_Screen = 1,

    ScreenCaptureSourceType_Custom = 2,
}

export interface ScreenCaptureSourceInfo {
    type: ScreenCaptureSourceType;

    sourceId: number;

    sourceName: string;

    thumbImage: ThumbImageBuffer;

    iconImage: ThumbImageBuffer;

    processPath: string;

    sourceTitle: string;

    primaryMonitor: boolean;

    isOccluded: boolean;

    position: Rectangle;

    minimizeWindow: boolean;

    sourceDisplayId: number;
}

export interface AdvancedAudioOptions {
    audioProcessingChannels?: number;
}

export interface ImageTrackOptions {
    imageUrl: string;

    fps: number;

    mirrorMode: VIDEO_MIRROR_MODE_TYPE;
}

export interface ChannelMediaOptions {
    publishCameraTrack?: boolean;

    publishSecondaryCameraTrack?: boolean;

    publishThirdCameraTrack?: boolean;

    publishFourthCameraTrack?: boolean;

    publishMicrophoneTrack?: boolean;

    publishScreenCaptureAudio?: boolean;

    publishScreenCaptureVideo?: boolean;

    publishScreenTrack?: boolean;

    publishSecondaryScreenTrack?: boolean;

    publishThirdScreenTrack?: boolean;

    publishFourthScreenTrack?: boolean;

    publishCustomAudioTrack?: boolean;

    publishCustomAudioTrackId?: number;

    publishCustomVideoTrack?: boolean;

    publishEncodedVideoTrack?: boolean;

    publishMediaPlayerAudioTrack?: boolean;

    publishMediaPlayerVideoTrack?: boolean;

    publishTranscodedVideoTrack?: boolean;

    publishMixedAudioTrack?: boolean;

    publishLipSyncTrack?: boolean;

    autoSubscribeAudio?: boolean;

    autoSubscribeVideo?: boolean;

    enableAudioRecordingOrPlayout?: boolean;

    publishMediaPlayerId?: number;

    clientRoleType?: CLIENT_ROLE_TYPE;

    audienceLatencyLevel?: AUDIENCE_LATENCY_LEVEL_TYPE;

    defaultVideoStreamType?: VIDEO_STREAM_TYPE;

    channelProfile?: CHANNEL_PROFILE_TYPE;

    audioDelayMs?: number;

    mediaPlayerAudioDelayMs?: number;

    token?: string;

    enableBuiltInMediaEncryption?: boolean;

    publishRhythmPlayerTrack?: boolean;

    isInteractiveAudience?: boolean;

    customVideoTrackId?: number;

    isAudioFilterable?: boolean;

    parameters?: string;

    enableMultipath?: boolean;

    uplinkMultipathMode?: MultipathMode;

    downlinkMultipathMode?: MultipathMode;

    preferMultipathType?: MultipathType;
}

export enum PROXY_TYPE {
    NONE_PROXY_TYPE = 0,

    UDP_PROXY_TYPE = 1,

    TCP_PROXY_TYPE = 2,

    LOCAL_PROXY_TYPE = 3,

    TCP_PROXY_AUTO_FALLBACK_TYPE = 4,

    HTTP_PROXY_TYPE = 5,

    HTTPS_PROXY_TYPE = 6,
}

export enum FeatureType {
    VIDEO_VIRTUAL_BACKGROUND = 1,

    VIDEO_BEAUTY_EFFECT = 2,
}

export interface LeaveChannelOptions {
    stopAudioMixing: boolean;

    stopAllEffect: boolean;

    stopMicrophoneRecording: boolean;
}

export enum VIDEO_EFFECT_NODE_ID {
    BEAUTY = 1 << 0,

    STYLE_MAKEUP = 1 << 1,

    FILTER = 1 << 2,
}

export enum VIDEO_EFFECT_ACTION {
    SAVE = 1,

    RESET = 2,
}

export interface RtcEngineContext {
    eventHandler: IRtcEngineEventHandler;

    appId: string;

    context: number;

    channelProfile: CHANNEL_PROFILE_TYPE;

    license: string;

    audioScenario: AUDIO_SCENARIO_TYPE;

    areaCode: AREA_CODE;

    logConfig: LogConfig;

    threadPriority?: THREAD_PRIORITY_TYPE;

    useExternalEglContext: boolean;

    domainLimit: boolean;

    autoRegisterAgoraExtensions: boolean;
}

export enum METADATA_TYPE {
    UNKNOWN_METADATA = -1,

    VIDEO_METADATA = 0,
}

export enum MAX_METADATA_SIZE_TYPE {
    INVALID_METADATA_SIZE_IN_BYTE = -1,

    DEFAULT_METADATA_SIZE_IN_BYTE = 512,

    MAX_METADATA_SIZE_IN_BYTE = 1024,
}

export interface Metadata {
    channelId: string;

    uid: number;

    size: number;

    buffer: unknown;

    timeStampMs: number;
}

export enum DIRECT_CDN_STREAMING_REASON {
    DIRECT_CDN_STREAMING_REASON_OK = 0,

    DIRECT_CDN_STREAMING_REASON_FAILED = 1,

    DIRECT_CDN_STREAMING_REASON_AUDIO_PUBLICATION = 2,

    DIRECT_CDN_STREAMING_REASON_VIDEO_PUBLICATION = 3,

    DIRECT_CDN_STREAMING_REASON_NET_CONNECT = 4,

    DIRECT_CDN_STREAMING_REASON_BAD_NAME = 5,
}

export enum DIRECT_CDN_STREAMING_STATE {
    DIRECT_CDN_STREAMING_STATE_IDLE = 0,

    DIRECT_CDN_STREAMING_STATE_RUNNING = 1,

    DIRECT_CDN_STREAMING_STATE_STOPPED = 2,

    DIRECT_CDN_STREAMING_STATE_FAILED = 3,

    DIRECT_CDN_STREAMING_STATE_RECOVERING = 4,
}

export interface DirectCdnStreamingStats {
    videoWidth: number;

    videoHeight: number;

    fps: number;

    videoBitrate: number;

    audioBitrate: number;
}

export interface DirectCdnStreamingMediaOptions {
    publishCameraTrack?: boolean;

    publishMicrophoneTrack?: boolean;

    publishCustomAudioTrack?: boolean;

    publishCustomVideoTrack?: boolean;

    publishMediaPlayerAudioTrack?: boolean;

    publishMediaPlayerId?: number;

    customVideoTrackId?: number;
}

export interface ExtensionInfo {
    mediaSourceType: MEDIA_SOURCE_TYPE;

    remoteUid: number;

    channelId: string;

    localUid: number;
}

export enum QUALITY_REPORT_FORMAT_TYPE {
    QUALITY_REPORT_JSON = 0,

    QUALITY_REPORT_HTML = 1,
}

export enum MEDIA_DEVICE_STATE_TYPE {
    MEDIA_DEVICE_STATE_IDLE = 0,

    MEDIA_DEVICE_STATE_ACTIVE = 1,

    MEDIA_DEVICE_STATE_DISABLED = 2,

    MEDIA_DEVICE_STATE_PLUGGED_IN = 3,

    MEDIA_DEVICE_STATE_NOT_PRESENT = 4,

    MEDIA_DEVICE_STATE_UNPLUGGED = 8,
}

export enum VIDEO_PROFILE_TYPE {
    VIDEO_PROFILE_LANDSCAPE_120P = 0,

    VIDEO_PROFILE_LANDSCAPE_120P_3 = 2,

    VIDEO_PROFILE_LANDSCAPE_180P = 10,

    VIDEO_PROFILE_LANDSCAPE_180P_3 = 12,

    VIDEO_PROFILE_LANDSCAPE_180P_4 = 13,

    VIDEO_PROFILE_LANDSCAPE_240P = 20,

    VIDEO_PROFILE_LANDSCAPE_240P_3 = 22,

    VIDEO_PROFILE_LANDSCAPE_240P_4 = 23,

    VIDEO_PROFILE_LANDSCAPE_360P = 30,

    VIDEO_PROFILE_LANDSCAPE_360P_3 = 32,

    VIDEO_PROFILE_LANDSCAPE_360P_4 = 33,

    VIDEO_PROFILE_LANDSCAPE_360P_6 = 35,

    VIDEO_PROFILE_LANDSCAPE_360P_7 = 36,

    VIDEO_PROFILE_LANDSCAPE_360P_8 = 37,

    VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,

    VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,

    VIDEO_PROFILE_LANDSCAPE_360P_11 = 100,

    VIDEO_PROFILE_LANDSCAPE_480P = 40,

    VIDEO_PROFILE_LANDSCAPE_480P_3 = 42,

    VIDEO_PROFILE_LANDSCAPE_480P_4 = 43,

    VIDEO_PROFILE_LANDSCAPE_480P_6 = 45,

    VIDEO_PROFILE_LANDSCAPE_480P_8 = 47,

    VIDEO_PROFILE_LANDSCAPE_480P_9 = 48,

    VIDEO_PROFILE_LANDSCAPE_480P_10 = 49,

    VIDEO_PROFILE_LANDSCAPE_720P = 50,

    VIDEO_PROFILE_LANDSCAPE_720P_3 = 52,

    VIDEO_PROFILE_LANDSCAPE_720P_5 = 54,

    VIDEO_PROFILE_LANDSCAPE_720P_6 = 55,

    VIDEO_PROFILE_LANDSCAPE_1080P = 60,

    VIDEO_PROFILE_LANDSCAPE_1080P_3 = 62,

    VIDEO_PROFILE_LANDSCAPE_1080P_5 = 64,

    VIDEO_PROFILE_LANDSCAPE_1440P = 66,

    VIDEO_PROFILE_LANDSCAPE_1440P_2 = 67,

    VIDEO_PROFILE_LANDSCAPE_4K = 70,

    VIDEO_PROFILE_LANDSCAPE_4K_3 = 72,

    VIDEO_PROFILE_PORTRAIT_120P = 1000,

    VIDEO_PROFILE_PORTRAIT_120P_3 = 1002,

    VIDEO_PROFILE_PORTRAIT_180P = 1010,

    VIDEO_PROFILE_PORTRAIT_180P_3 = 1012,

    VIDEO_PROFILE_PORTRAIT_180P_4 = 1013,

    VIDEO_PROFILE_PORTRAIT_240P = 1020,

    VIDEO_PROFILE_PORTRAIT_240P_3 = 1022,

    VIDEO_PROFILE_PORTRAIT_240P_4 = 1023,

    VIDEO_PROFILE_PORTRAIT_360P = 1030,

    VIDEO_PROFILE_PORTRAIT_360P_3 = 1032,

    VIDEO_PROFILE_PORTRAIT_360P_4 = 1033,

    VIDEO_PROFILE_PORTRAIT_360P_6 = 1035,

    VIDEO_PROFILE_PORTRAIT_360P_7 = 1036,

    VIDEO_PROFILE_PORTRAIT_360P_8 = 1037,

    VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,

    VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,

    VIDEO_PROFILE_PORTRAIT_360P_11 = 1100,

    VIDEO_PROFILE_PORTRAIT_480P = 1040,

    VIDEO_PROFILE_PORTRAIT_480P_3 = 1042,

    VIDEO_PROFILE_PORTRAIT_480P_4 = 1043,

    VIDEO_PROFILE_PORTRAIT_480P_6 = 1045,

    VIDEO_PROFILE_PORTRAIT_480P_8 = 1047,

    VIDEO_PROFILE_PORTRAIT_480P_9 = 1048,

    VIDEO_PROFILE_PORTRAIT_480P_10 = 1049,

    VIDEO_PROFILE_PORTRAIT_720P = 1050,

    VIDEO_PROFILE_PORTRAIT_720P_3 = 1052,

    VIDEO_PROFILE_PORTRAIT_720P_5 = 1054,

    VIDEO_PROFILE_PORTRAIT_720P_6 = 1055,

    VIDEO_PROFILE_PORTRAIT_1080P = 1060,

    VIDEO_PROFILE_PORTRAIT_1080P_3 = 1062,

    VIDEO_PROFILE_PORTRAIT_1080P_5 = 1064,

    VIDEO_PROFILE_PORTRAIT_1440P = 1066,

    VIDEO_PROFILE_PORTRAIT_1440P_2 = 1067,

    VIDEO_PROFILE_PORTRAIT_4K = 1070,

    VIDEO_PROFILE_PORTRAIT_4K_3 = 1072,

    VIDEO_PROFILE_DEFAULT = VIDEO_PROFILE_LANDSCAPE_360P,
}
