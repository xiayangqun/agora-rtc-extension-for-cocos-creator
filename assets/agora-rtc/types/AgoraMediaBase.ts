export interface ExtensionContext {
    isValid: boolean;

    uid: number;

    providerName: string;

    extensionName: string;
}

export enum VIDEO_SOURCE_TYPE {
    VIDEO_SOURCE_CAMERA_PRIMARY = 0,

    VIDEO_SOURCE_CAMERA = VIDEO_SOURCE_CAMERA_PRIMARY,

    VIDEO_SOURCE_CAMERA_SECONDARY = 1,

    VIDEO_SOURCE_SCREEN_PRIMARY = 2,

    VIDEO_SOURCE_SCREEN = VIDEO_SOURCE_SCREEN_PRIMARY,

    VIDEO_SOURCE_SCREEN_SECONDARY = 3,

    VIDEO_SOURCE_CUSTOM = 4,

    VIDEO_SOURCE_MEDIA_PLAYER = 5,

    VIDEO_SOURCE_RTC_IMAGE_PNG = 6,

    VIDEO_SOURCE_RTC_IMAGE_JPEG = 7,

    VIDEO_SOURCE_RTC_IMAGE_GIF = 8,

    VIDEO_SOURCE_REMOTE = 9,

    VIDEO_SOURCE_TRANSCODED = 10,

    VIDEO_SOURCE_CAMERA_THIRD = 11,

    VIDEO_SOURCE_CAMERA_FOURTH = 12,

    VIDEO_SOURCE_SCREEN_THIRD = 13,

    VIDEO_SOURCE_SCREEN_FOURTH = 14,

    VIDEO_SOURCE_SPEECH_DRIVEN = 15,

    VIDEO_SOURCE_UNKNOWN = 100,
}

export enum AUDIO_SOURCE_TYPE {
    AUDIO_SOURCE_MICROPHONE = 0,

    AUDIO_SOURCE_CUSTOM = 1,

    AUDIO_SOURCE_MEDIA_PLAYER = 2,

    AUDIO_SOURCE_LOOPBACK_RECORDING = 3,

    AUDIO_SOURCE_MIXED_STREAM = 4,

    AUDIO_SOURCE_REMOTE_USER = 5,

    AUDIO_SOURCE_REMOTE_CHANNEL = 6,

    AUDIO_SOURCE_UNKNOWN = 100,
}

export enum AudioRoute {
    ROUTE_DEFAULT = -1,

    ROUTE_HEADSET = 0,

    ROUTE_EARPIECE = 1,

    ROUTE_HEADSETNOMIC = 2,

    ROUTE_SPEAKERPHONE = 3,

    ROUTE_LOUDSPEAKER = 4,

    ROUTE_BLUETOOTH_DEVICE_HFP = 5,

    ROUTE_USB = 6,

    ROUTE_HDMI = 7,

    ROUTE_DISPLAYPORT = 8,

    ROUTE_AIRPLAY = 9,

    ROUTE_BLUETOOTH_DEVICE_A2DP = 10,
}

export enum BYTES_PER_SAMPLE {
    TWO_BYTES_PER_SAMPLE = 2,
}

export interface AudioParameters {
    sample_rate: number;

    channels: number;

    frames_per_buffer: number;
}

export enum RAW_AUDIO_FRAME_OP_MODE_TYPE {
    RAW_AUDIO_FRAME_OP_MODE_READ_ONLY = 0,

    RAW_AUDIO_FRAME_OP_MODE_READ_WRITE = 2,
}

export enum MEDIA_SOURCE_TYPE {
    AUDIO_PLAYOUT_SOURCE = 0,

    AUDIO_RECORDING_SOURCE = 1,

    PRIMARY_CAMERA_SOURCE = 2,

    SECONDARY_CAMERA_SOURCE = 3,

    PRIMARY_SCREEN_SOURCE = 4,

    SECONDARY_SCREEN_SOURCE = 5,

    CUSTOM_VIDEO_SOURCE = 6,

    MEDIA_PLAYER_SOURCE = 7,

    RTC_IMAGE_PNG_SOURCE = 8,

    RTC_IMAGE_JPEG_SOURCE = 9,

    RTC_IMAGE_GIF_SOURCE = 10,

    REMOTE_VIDEO_SOURCE = 11,

    TRANSCODED_VIDEO_SOURCE = 12,

    SPEECH_DRIVEN_VIDEO_SOURCE = 13,

    UNKNOWN_MEDIA_SOURCE = 100,
}

export interface PacketOptions {
    timestamp: number;

    audioLevelIndication: number;
}

export interface AudioEncodedFrameInfo {
    sendTs: number;

    codec: number;
}

export interface AudioPcmFrame {
    capture_timestamp: number;

    samples_per_channel_: number;

    sample_rate_hz_: number;

    num_channels_: number;

    audio_track_number_: number;

    bytes_per_sample: BYTES_PER_SAMPLE;

    data_: Uint16Array;

    is_stereo_: boolean;
}

export enum AUDIO_DUAL_MONO_MODE {
    AUDIO_DUAL_MONO_STEREO = 0,

    AUDIO_DUAL_MONO_L = 1,

    AUDIO_DUAL_MONO_R = 2,

    AUDIO_DUAL_MONO_MIX = 3,
}

export enum VIDEO_PIXEL_FORMAT {
    VIDEO_PIXEL_DEFAULT = 0,

    VIDEO_PIXEL_I420 = 1,

    VIDEO_PIXEL_BGRA = 2,

    VIDEO_PIXEL_NV21 = 3,

    VIDEO_PIXEL_RGBA = 4,

    VIDEO_PIXEL_NV12 = 8,

    VIDEO_TEXTURE_2D = 10,

    VIDEO_TEXTURE_OES = 11,

    VIDEO_CVPIXEL_NV12 = 12,

    VIDEO_CVPIXEL_I420 = 13,

    VIDEO_CVPIXEL_BGRA = 14,

    VIDEO_CVPIXEL_P010 = 15,

    VIDEO_PIXEL_I422 = 16,

    VIDEO_TEXTURE_ID3D11TEXTURE2D = 17,

    VIDEO_PIXEL_I010 = 18,
}

export enum RENDER_MODE_TYPE {
    RENDER_MODE_HIDDEN = 1,

    RENDER_MODE_FIT = 2,

    RENDER_MODE_ADAPTIVE = 3,
}

export enum CAMERA_VIDEO_SOURCE_TYPE {
    CAMERA_SOURCE_FRONT = 0,

    CAMERA_SOURCE_BACK = 1,

    VIDEO_SOURCE_UNSPECIFIED = 2,
}

export enum META_INFO_KEY {
    KEY_FACE_CAPTURE = 0,
}

export interface ColorSpace {
    primaries: PrimaryID;

    transfer: TransferID;

    matrix: MatrixID;

    range: RangeID;
}

export enum PrimaryID {
    PRIMARYID_BT709 = 1,

    PRIMARYID_UNSPECIFIED = 2,

    PRIMARYID_BT470M = 4,

    PRIMARYID_BT470BG = 5,

    PRIMARYID_SMPTE170M = 6,

    PRIMARYID_SMPTE240M = 7,

    PRIMARYID_FILM = 8,

    PRIMARYID_BT2020 = 9,

    PRIMARYID_SMPTEST428 = 10,

    PRIMARYID_SMPTEST431 = 11,

    PRIMARYID_SMPTEST432 = 12,

    PRIMARYID_JEDECP22 = 22,
}

export enum RangeID {
    RANGEID_INVALID = 0,

    RANGEID_LIMITED = 1,

    RANGEID_FULL = 2,

    RANGEID_DERIVED = 3,
}

export enum MatrixID {
    MATRIXID_RGB = 0,

    MATRIXID_BT709 = 1,

    MATRIXID_UNSPECIFIED = 2,

    MATRIXID_FCC = 4,

    MATRIXID_BT470BG = 5,

    MATRIXID_SMPTE170M = 6,

    MATRIXID_SMPTE240M = 7,

    MATRIXID_YCOCG = 8,

    MATRIXID_BT2020_NCL = 9,

    MATRIXID_BT2020_CL = 10,

    MATRIXID_SMPTE2085 = 11,

    MATRIXID_CDNCLS = 12,

    MATRIXID_CDCLS = 13,

    MATRIXID_BT2100_ICTCP = 14,
}

export enum TransferID {
    TRANSFERID_BT709 = 1,

    TRANSFERID_UNSPECIFIED = 2,

    TRANSFERID_GAMMA22 = 4,

    TRANSFERID_GAMMA28 = 5,

    TRANSFERID_SMPTE170M = 6,

    TRANSFERID_SMPTE240M = 7,

    TRANSFERID_LINEAR = 8,

    TRANSFERID_LOG = 9,

    TRANSFERID_LOG_SQRT = 10,

    TRANSFERID_IEC61966_2_4 = 11,

    TRANSFERID_BT1361_ECG = 12,

    TRANSFERID_IEC61966_2_1 = 13,

    TRANSFERID_BT2020_10 = 14,

    TRANSFERID_BT2020_12 = 15,

    TRANSFERID_SMPTEST2084 = 16,

    TRANSFERID_SMPTEST428 = 17,

    TRANSFERID_ARIB_STD_B67 = 18,
}

export interface Hdr10MetadataInfo {
    redPrimaryX: number;

    redPrimaryY: number;

    greenPrimaryX: number;

    greenPrimaryY: number;

    bluePrimaryX: number;

    bluePrimaryY: number;

    whitePointX: number;

    whitePointY: number;

    maxMasteringLuminance: number;

    minMasteringLuminance: number;

    maxContentLightLevel: number;

    maxFrameAverageLightLevel: number;
}

export enum ALPHA_STITCH_MODE {
    NO_ALPHA_STITCH = 0,

    ALPHA_STITCH_UP = 1,

    ALPHA_STITCH_BELOW = 2,

    ALPHA_STITCH_LEFT = 3,

    ALPHA_STITCH_RIGHT = 4,
}

export interface ExternalVideoFrame {
    type: VIDEO_BUFFER_TYPE;

    format: VIDEO_PIXEL_FORMAT;

    buffer: Uint8Array;

    stride: number;

    height: number;

    cropLeft: number;

    cropTop: number;

    cropRight: number;

    cropBottom: number;

    rotation: number;

    timestamp: number;

    eglContext: unknown;

    eglType: EGL_CONTEXT_TYPE;

    textureId: number;

    fenceObject: number;

    matrix: number[];

    metadataBuffer: Uint8Array;

    metadataSize: number;

    alphaBuffer: Uint8Array;

    fillAlphaBuffer: boolean;

    alphaStitchMode: ALPHA_STITCH_MODE;

    d3d11Texture2d: unknown;

    textureSliceIndex: number;

    hdr10MetadataInfo: Hdr10MetadataInfo;

    colorSpace: ColorSpace;
}

export enum EGL_CONTEXT_TYPE {
    EGL_CONTEXT10 = 0,

    EGL_CONTEXT14 = 1,
}

export enum VIDEO_BUFFER_TYPE {
    VIDEO_BUFFER_RAW_DATA = 1,

    VIDEO_BUFFER_ARRAY = 2,

    VIDEO_BUFFER_TEXTURE = 3,
}

export interface VideoFrame {
    type: VIDEO_PIXEL_FORMAT;

    width: number;

    height: number;

    yStride: number;

    uStride: number;

    vStride: number;

    yBuffer: Uint8Array;

    uBuffer: Uint8Array[];

    vBuffer: Uint8Array[];

    rotation: number;

    renderTimeMs: number;

    avsync_type: number;

    metadata_buffer: unknown;

    metadata_size: number;

    sharedContext: unknown;

    textureId: number;

    d3d11Texture2d: unknown;

    matrix: number[];

    alphaBuffer: Uint8Array;

    alphaStitchMode: ALPHA_STITCH_MODE;

    pixelBuffer: unknown;

    hdr10MetadataInfo: Hdr10MetadataInfo;

    colorSpace: ColorSpace;
}

export enum MEDIA_PLAYER_SOURCE_TYPE {
    MEDIA_PLAYER_SOURCE_DEFAULT,

    MEDIA_PLAYER_SOURCE_FULL_FEATURED,

    MEDIA_PLAYER_SOURCE_SIMPLE,
}

export enum VIDEO_MODULE_POSITION {
    POSITION_POST_CAPTURER = 1 << 0,

    POSITION_PRE_RENDERER = 1 << 1,

    POSITION_PRE_ENCODER = 1 << 2,

    POSITION_POST_CAPTURER_ORIGIN = 1 << 3,
}

export enum CONTENT_INSPECT_RESULT {
    CONTENT_INSPECT_NEUTRAL = 1,

    CONTENT_INSPECT_SEXY = 2,

    CONTENT_INSPECT_PORN = 3,
}

export enum CONTENT_INSPECT_TYPE {
    CONTENT_INSPECT_INVALID = 0,

    CONTENT_INSPECT_MODERATION = 1,

    CONTENT_INSPECT_SUPERVISION = 2,

    CONTENT_INSPECT_IMAGE_MODERATION = 3,
}

export interface ContentInspectModule {
    type: CONTENT_INSPECT_TYPE;

    interval: number;

    position: VIDEO_MODULE_POSITION;
}

export interface ContentInspectConfig {
    extraInfo: string;

    serverConfig: string;

    modules: ContentInspectModule[];

    moduleCount: number;
}

export interface SnapshotConfig {
    filePath: string;

    position: VIDEO_MODULE_POSITION;
}

export enum AUDIO_FRAME_TYPE {
    FRAME_TYPE_PCM16 = 0,
}

export interface AudioFrame {
    type: AUDIO_FRAME_TYPE;

    samplesPerChannel: number;

    bytesPerSample: BYTES_PER_SAMPLE;

    channels: number;

    samplesPerSec: number;

    buffer: unknown;

    renderTimeMs: number;

    avsync_type: number;

    presentationMs: number;

    audioTrackNumber: number;

    rtpTimestamp: number;
}

export enum AUDIO_FRAME_POSITION {
    AUDIO_FRAME_POSITION_NONE = 0x0000,

    AUDIO_FRAME_POSITION_PLAYBACK = 0x0001,

    AUDIO_FRAME_POSITION_RECORD = 0x0002,

    AUDIO_FRAME_POSITION_MIXED = 0x0004,

    AUDIO_FRAME_POSITION_BEFORE_MIXING = 0x0008,

    AUDIO_FRAME_POSITION_EAR_MONITORING = 0x0010,
}

export interface AudioParams {
    sample_rate: number;

    channels: number;

    mode: RAW_AUDIO_FRAME_OP_MODE_TYPE;

    samples_per_call: number;
}

export interface AudioSpectrumData {
    audioSpectrumData: number[];

    dataLength: number;
}

export interface UserAudioSpectrumInfo {
    uid: number;

    spectrumData: AudioSpectrumData;
}

export enum VIDEO_FRAME_PROCESS_MODE {
    PROCESS_MODE_READ_ONLY,

    PROCESS_MODE_READ_WRITE,
}

export enum EXTERNAL_VIDEO_SOURCE_TYPE {
    VIDEO_FRAME = 0,

    ENCODED_VIDEO_FRAME,
}

export enum MediaRecorderContainerFormat {
    FORMAT_MP4 = 1,
}

export enum MediaRecorderStreamType {
    STREAM_TYPE_AUDIO = 0x01,

    STREAM_TYPE_VIDEO = 0x02,

    STREAM_TYPE_BOTH = STREAM_TYPE_AUDIO | STREAM_TYPE_VIDEO,
}

export enum RecorderState {
    RECORDER_STATE_ERROR = -1,

    RECORDER_STATE_START = 2,

    RECORDER_STATE_STOP = 3,
}

export enum RecorderReasonCode {
    RECORDER_REASON_NONE = 0,

    RECORDER_REASON_WRITE_FAILED = 1,

    RECORDER_REASON_NO_STREAM = 2,

    RECORDER_REASON_OVER_MAX_DURATION = 3,

    RECORDER_REASON_CONFIG_CHANGED = 4,
}

export interface MediaRecorderConfiguration {
    storagePath: string;

    containerFormat: MediaRecorderContainerFormat;

    streamType: MediaRecorderStreamType;

    maxDurationMs: number;

    recorderInfoUpdateInterval: number;

    width: number;

    height: number;

    fps: number;

    sample_rate: number;

    channel_num: number;

    videoSourceType: VIDEO_SOURCE_TYPE;
}

export interface RecorderInfo {
    fileName: string;

    durationMs: number;

    fileSize: number;
}
