import AgoraRTC, {
    ConnectionState as WebConnectionState,
    ConnectionDisconnectedReason as WebConnectionDisconnectedReason,
    ChannelMediaRelayState as WebChannelMediaRelayState,
    ChannelMediaRelayError as WebChannelMediaRelayError,
    EncryptionMode,
    DeviceState,
    IAgoraRTCError,
    VideoEncoderConfiguration as WebVideoEncoderConfiguration,
    ClientRoleOptions as WebClientRoleOptions,
    AudienceLatencyLevelType,
    LiveStreamingTranscodingConfig,
    IChannelMediaRelayConfiguration,
    AREAS,
    AgoraRTCErrorCode,
} from "agora-rtc-sdk-ng";
import { AgoraRTCErrorCode_FAKE, AREAS_FAKE, AudienceLatencyLevelType_FAKE } from "./rtc-sdk-ext";
import {
    CONNECTION_CHANGED_REASON_TYPE,
    CONNECTION_STATE_TYPE,
    USER_OFFLINE_REASON_TYPE,
    CLIENT_ROLE_TYPE,
    CHANNEL_PROFILE_TYPE,
    VIDEO_STREAM_TYPE,
    CHANNEL_MEDIA_RELAY_STATE,
    CHANNEL_MEDIA_RELAY_ERROR,
    ENCRYPTION_MODE,
    AREA_CODE,
    AREA_CODE_EX,
    ERROR_CODE_TYPE,
    VIDEO_CODEC_TYPE,
    VideoEncoderConfiguration as NativeVideoEncoderConfiguration,
    ClientRoleOptions as NativeClientRoleOptions,
    AUDIENCE_LATENCY_LEVEL_TYPE,
    LiveTranscoding,
    ChannelMediaRelayConfiguration,
    ChannelMediaInfo,
} from "../../types/AgoraBase";
import { CLOUD_PROXY_TYPE, MEDIA_DEVICE_STATE_TYPE, STREAM_FALLBACK_OPTIONS } from "../../types/AgoraRtcEngine";
import { SIMULCAST_STREAM_MODE } from "../../types/AgoraBase";
import { LOG_LEVEL } from "../../types/AgoraLog";

export class Web2Native {
    public static ConnectionState(webState: WebConnectionState): CONNECTION_STATE_TYPE {
        switch (webState) {
            case "DISCONNECTED":
                return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
            case "CONNECTING":
                return CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTING;
            case "CONNECTED":
                return CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED;
            case "RECONNECTING":
                return CONNECTION_STATE_TYPE.CONNECTION_STATE_RECONNECTING;
            case "DISCONNECTING":
                return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
            default:
                return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
        }
    }

    public static ConnectionDisconnectedReason(
        webReason: WebConnectionDisconnectedReason,
    ): CONNECTION_CHANGED_REASON_TYPE {
        switch (webReason) {
            case "LEAVE":
                return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_LEAVE_CHANNEL;
            case "UID_BANNED":
            case "IP_BANNED":
            case "CHANNEL_BANNED":
                return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_BANNED_BY_SERVER;
            case "NETWORK_ERROR":
                return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_KEEP_ALIVE_TIMEOUT;
            case "SERVER_ERROR":
                return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_REJECTED_BY_SERVER;
            case "TOKEN_EXPIRE":
                return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_TOKEN_EXPIRED;
            default:
                return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_INTERRUPTED;
        }
    }

    public static string2USER_OFFLINE_REASON_TYPE(reason: string): USER_OFFLINE_REASON_TYPE {
        switch (reason) {
            case "Quit":
                return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_QUIT;
            case "ServerTimeOut":
                return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_DROPPED;
            case "BecomeAudience":
                return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_BECOME_AUDIENCE;
            default:
                return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_DROPPED;
        }
    }

    public static ClientRole(webRole: string): CLIENT_ROLE_TYPE {
        return webRole === "host" ? CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER : CLIENT_ROLE_TYPE.CLIENT_ROLE_AUDIENCE;
    }

    public static VideoStreamType(webType: number): VIDEO_STREAM_TYPE {
        return webType === 0 ? VIDEO_STREAM_TYPE.VIDEO_STREAM_HIGH : VIDEO_STREAM_TYPE.VIDEO_STREAM_LOW;
    }

    public static ChannelMediaRelayState(webState: WebChannelMediaRelayState): CHANNEL_MEDIA_RELAY_STATE {
        switch (webState) {
            case "RELAY_STATE_IDLE":
                return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_IDLE;
            case "RELAY_STATE_CONNECTING":
                return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_CONNECTING;
            case "RELAY_STATE_RUNNING":
                return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_RUNNING;
            case "RELAY_STATE_FAILURE":
                return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_FAILURE;
            default:
                return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_FAILURE;
        }
    }

    public static ChannelMediaRelayError(webError: WebChannelMediaRelayError): CHANNEL_MEDIA_RELAY_ERROR {
        switch (webError) {
            case "RELAY_OK":
                return CHANNEL_MEDIA_RELAY_ERROR.RELAY_OK;
            case "SERVER_CONNECTION_LOST":
                return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_SERVER_CONNECTION_LOST;
            case "SRC_TOKEN_EXPIRED":
                return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_SRC_TOKEN_EXPIRED;
            case "DEST_TOKEN_EXPIRED":
                return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_DEST_TOKEN_EXPIRED;
            default:
                return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_INTERNAL_ERROR;
        }
    }

    public static DeviceState(param: DeviceState): MEDIA_DEVICE_STATE_TYPE {
        switch (param) {
            case "ACTIVE":
                return MEDIA_DEVICE_STATE_TYPE.MEDIA_DEVICE_STATE_ACTIVE;
            case "INACTIVE":
                return MEDIA_DEVICE_STATE_TYPE.MEDIA_DEVICE_STATE_IDLE;
            default:
                return MEDIA_DEVICE_STATE_TYPE.MEDIA_DEVICE_STATE_IDLE;
        }
    }

    // "H264" | "H265" | "VP8" | "VP9" | "AV1X" | "AV1";
    public static string2VIDEO_CODEC_TYPE(webCodec: string): VIDEO_CODEC_TYPE {
        switch (webCodec) {
            case "H264":
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_H264;
            case "H265":
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_H265;
            case "VP8":
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_VP8;
            case "VP9":
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_VP9;
            case "AV1X":
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_AV1;
            case "AV1":
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_AV1;
            default:
                return VIDEO_CODEC_TYPE.VIDEO_CODEC_NONE;
        }
    }

    public static AgoraRTCErrorCode(code: AgoraRTCErrorCode): ERROR_CODE_TYPE {
        switch (code) {
            // 参数非法
            case AgoraRTCErrorCode_FAKE.INVALID_PARAMS:
            case AgoraRTCErrorCode_FAKE.MEDIA_OPTION_INVALID:
            case AgoraRTCErrorCode_FAKE.INVALID_LOCAL_TRACK:
            case AgoraRTCErrorCode_FAKE.INVALID_TRACK:
            case AgoraRTCErrorCode_FAKE.SENDER_NOT_FOUND:
            case AgoraRTCErrorCode_FAKE.INVALID_UINT_UID_FROM_STRING_UID:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_INVALID_ARGUMENT:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_INVALID_RAW_STREAM:
            case AgoraRTCErrorCode_FAKE.INVALID_PLUGIN:
                return ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;

            // 状态非法/未就绪
            case AgoraRTCErrorCode_FAKE.INVALID_OPERATION:
            case AgoraRTCErrorCode_FAKE.TRACK_IS_DISABLED:
            case AgoraRTCErrorCode_FAKE.TRACK_STATE_UNREACHABLE:
            case AgoraRTCErrorCode_FAKE.EXIST_DISABLED_VIDEO_TRACK:
                return ERROR_CODE_TYPE.ERR_INVALID_STATE;

            // 不支持
            case AgoraRTCErrorCode_FAKE.NOT_SUPPORTED:
            case AgoraRTCErrorCode_FAKE.CONSTRAINT_NOT_SATISFIED:
            case AgoraRTCErrorCode_FAKE.ELECTRON_IS_NULL:
            case AgoraRTCErrorCode_FAKE.ELECTRON_DESKTOP_CAPTURER_GET_SOURCES_ERROR:
            case AgoraRTCErrorCode_FAKE.CHROME_PLUGIN_NO_RESPONSE:
            case AgoraRTCErrorCode_FAKE.CHROME_PLUGIN_NOT_INSTALL:
            case AgoraRTCErrorCode_FAKE.GET_LOCAL_CAPABILITIES_FAILED:
            case AgoraRTCErrorCode_FAKE.CAN_NOT_PUBLISH_MULTIPLE_VIDEO_TRACKS:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_TRANSCODING_NOT_SUPPORTED:
                return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

            // 权限不足
            case AgoraRTCErrorCode_FAKE.PERMISSION_DENIED:
            case AgoraRTCErrorCode_FAKE.SHARE_AUDIO_NOT_ALLOWED:
                return ERROR_CODE_TYPE.ERR_NO_PERMISSION;

            // 超时
            case AgoraRTCErrorCode_FAKE.TIMEOUT:
            case AgoraRTCErrorCode_FAKE.NETWORK_TIMEOUT:
            case AgoraRTCErrorCode_FAKE.API_INVOKE_TIMEOUT:
            case AgoraRTCErrorCode_FAKE.INIT_DATACHANNEL_TIMEOUT:
            case AgoraRTCErrorCode_FAKE.DATACHANNEL_CONNECTION_TIMEOUT:
                return ERROR_CODE_TYPE.ERR_TIMEDOUT;

            // 操作被取消/中止
            case AgoraRTCErrorCode_FAKE.OPERATION_ABORTED:
                return ERROR_CODE_TYPE.ERR_ABORTED;

            // 网络错误
            case AgoraRTCErrorCode_FAKE.NETWORK_ERROR:
            case AgoraRTCErrorCode_FAKE.NETWORK_RESPONSE_ERROR:
            case AgoraRTCErrorCode_FAKE.WS_ERR:
                return ERROR_CODE_TYPE.ERR_NET_DOWN;

            // 连接断开/中断 (P2P/WebSocket层)
            case AgoraRTCErrorCode_FAKE.PC_CLOSED:
            case AgoraRTCErrorCode_FAKE.GATEWAY_P2P_LOST:
            case AgoraRTCErrorCode_FAKE.WS_ABORT:
            case AgoraRTCErrorCode_FAKE.WS_DISCONNECT:
            case AgoraRTCErrorCode_FAKE.EXTERNAL_SIGNAL_ABORT:
            case AgoraRTCErrorCode_FAKE.DISCONNECT_P2P:
            case AgoraRTCErrorCode_FAKE.CROSS_CHANNEL_FAILED_PACKET_SENT_TO_DEST:
            case AgoraRTCErrorCode_FAKE.P2P_MESSAGE_FAILED:
                return ERROR_CODE_TYPE.ERR_CONNECTION_LOST;

            // P2P 信令交互失败
            case AgoraRTCErrorCode_FAKE.EXCHANGE_SDP_FAILED:
            case AgoraRTCErrorCode_FAKE.ADD_CANDIDATE_FAILED:
            case AgoraRTCErrorCode_FAKE.CREATE_OFFER_FAILED:
            case AgoraRTCErrorCode_FAKE.SET_ANSWER_FAILED:
            case AgoraRTCErrorCode_FAKE.ICE_FAILED:
            case AgoraRTCErrorCode_FAKE.NO_ICE_CANDIDATE:
                return ERROR_CODE_TYPE.ERR_CONNECTION_INTERRUPTED;

            // 拒绝/安全策略
            case AgoraRTCErrorCode_FAKE.WEB_SECURITY_RESTRICT:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_PUBLISH_STREAM_NOT_AUTHORIZED:
                return ERROR_CODE_TYPE.ERR_REFUSED;

            // DataChannel / 数据流
            case AgoraRTCErrorCode_FAKE.DATACHANNEL_FAILED:
            case AgoraRTCErrorCode_FAKE.CREATE_DATACHANNEL_ERROR:
                return ERROR_CODE_TYPE.ERR_DATASTREAM_DECRYPTION_FAILED;

            // 资源受限/设备不可用
            case AgoraRTCErrorCode_FAKE.NOT_READABLE:
            case AgoraRTCErrorCode_FAKE.ENUMERATE_DEVICES_FAILED:
            case AgoraRTCErrorCode_FAKE.DEVICE_NOT_FOUND:
            case AgoraRTCErrorCode_FAKE.LOCAL_AEC_ERROR:
                return ERROR_CODE_TYPE.ERR_RESOURCE_LIMITED;

            // 服务器资源不足 / 网关不可用
            case AgoraRTCErrorCode_FAKE.CAN_NOT_GET_PROXY_SERVER:
            case AgoraRTCErrorCode_FAKE.CAN_NOT_GET_GATEWAY_SERVER:
            case AgoraRTCErrorCode_FAKE.VOID_GATEWAY_ADDRESS:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_INTERNAL_SERVER_ERROR:
            case AgoraRTCErrorCode_FAKE.CROSS_CHANNEL_SERVER_ERROR_RESPONSE:
                return ERROR_CODE_TYPE.ERR_NO_SERVER_RESOURCES;

            // Token 过期
            case AgoraRTCErrorCode_FAKE.TOKEN_EXPIRE:
                return ERROR_CODE_TYPE.ERR_TOKEN_EXPIRED;

            // UID 冲突
            case AgoraRTCErrorCode_FAKE.UID_CONFLICT:
                return ERROR_CODE_TYPE.ERR_LOGIN_ALREADY_LOGIN;

            // 远端用户不存在/未就绪
            case AgoraRTCErrorCode_FAKE.INVALID_REMOTE_USER:
                return ERROR_CODE_TYPE.ERR_INVALID_USER_ID;
            case AgoraRTCErrorCode_FAKE.REMOTE_USER_IS_NOT_PUBLISHED:
                return ERROR_CODE_TYPE.ERR_RDT_USER_NOT_READY;

            // 已被占用
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_TASK_CONFLICT:
                return ERROR_CODE_TYPE.ERR_ALREADY_IN_USE;

            // 频率/数量超限
            case AgoraRTCErrorCode_FAKE.CUSTOM_REPORT_FREQUENCY_TOO_HIGH:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_WARN_FREQUENT_REQUEST:
                return ERROR_CODE_TYPE.ERR_TOO_OFTEN;
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_WARN_STREAM_NUM_REACH_LIMIT:
                return ERROR_CODE_TYPE.ERR_TOO_MANY_DATA_STREAMS;

            // 数据过大
            case AgoraRTCErrorCode_FAKE.METADATA_OUT_OF_RANGE:
                return ERROR_CODE_TYPE.ERR_SIZE_TOO_LARGE;

            // 禁止的操作
            case AgoraRTCErrorCode_FAKE.PROHIBITED_OPERATION:
                return ERROR_CODE_TYPE.ERR_FUNC_IS_PROHIBITED;

            // 跨频道加入失败
            case AgoraRTCErrorCode_FAKE.CROSS_CHANNEL_FAILED_JOIN_SRC:
            case AgoraRTCErrorCode_FAKE.CROSS_CHANNEL_FAILED_JOIN_DEST:
                return ERROR_CODE_TYPE.ERR_JOIN_CHANNEL_REJECTED;

            // 其余全部兜底到 ERR_FAILED
            case AgoraRTCErrorCode_FAKE.UNEXPECTED_ERROR:
            case AgoraRTCErrorCode_FAKE.UNEXPECTED_RESPONSE:
            case AgoraRTCErrorCode_FAKE.PB_ERROR:
            case AgoraRTCErrorCode_FAKE.GET_VIDEO_ELEMENT_VISIBLE_ERROR:
            case AgoraRTCErrorCode_FAKE.LOW_STREAM_ENCODING_ERROR:
            case AgoraRTCErrorCode_FAKE.SET_ENCODING_PARAMETER_ERROR:
            case AgoraRTCErrorCode_FAKE.MULTI_UNILBS_RESPONSE_ERROR:
            case AgoraRTCErrorCode_FAKE.UPDATE_TICKET_FAILED:
            case AgoraRTCErrorCode_FAKE.SENDER_REPLACE_FAILED:
            case AgoraRTCErrorCode_FAKE.GET_LOCAL_CONNECTION_PARAMS_FAILED:
            case AgoraRTCErrorCode_FAKE.SUBSCRIBE_FAILED:
            case AgoraRTCErrorCode_FAKE.UNSUBSCRIBE_FAILED:
            case AgoraRTCErrorCode_FAKE.CUSTOM_REPORT_SEND_FAILED:
            case AgoraRTCErrorCode_FAKE.FETCH_AUDIO_FILE_FAILED:
            case AgoraRTCErrorCode_FAKE.READ_LOCAL_AUDIO_FILE_ERROR:
            case AgoraRTCErrorCode_FAKE.DECODE_AUDIO_FILE_FAILED:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_CDN_ERROR:
            case AgoraRTCErrorCode_FAKE.LIVE_STREAMING_WARN_FAILED_LOAD_IMAGE:
            case AgoraRTCErrorCode_FAKE.WEBGL_INTERNAL_ERROR:
            case AgoraRTCErrorCode_FAKE.BEAUTY_PROCESSOR_INTERNAL_ERROR:
            case AgoraRTCErrorCode_FAKE.CROSS_CHANNEL_WAIT_STATUS_ERROR:
            case AgoraRTCErrorCode_FAKE.CONVERTING_IMAGEDATA_TO_BLOB_FAILED:
            case AgoraRTCErrorCode_FAKE.CONVERTING_VIDEO_FRAME_TO_BLOB_FAILED:
            case AgoraRTCErrorCode_FAKE.IMAGE_MODERATION_UPLOAD_FAILED:
            default:
                return ERROR_CODE_TYPE.ERR_FAILED;
        }
    }
}

export class Native2Web {
    public static ClientRole(nativeRole: CLIENT_ROLE_TYPE): "host" | "audience" {
        return nativeRole === CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER ? "host" : "audience";
    }

    public static ChannelProfile(nativeProfile: CHANNEL_PROFILE_TYPE): "rtc" | "live" {
        return nativeProfile === CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_LIVE_BROADCASTING ? "live" : "rtc";
    }

    public static VideoStreamType(nativeType: VIDEO_STREAM_TYPE): number {
        return nativeType === VIDEO_STREAM_TYPE.VIDEO_STREAM_HIGH ? 0 : 1;
    }

    public static EncryptionMode(mode: ENCRYPTION_MODE): EncryptionMode {
        switch (mode) {
            case ENCRYPTION_MODE.AES_128_XTS:
                return "aes-128-xts";
            case ENCRYPTION_MODE.AES_128_ECB:
                return "aes-128-ecb";
            case ENCRYPTION_MODE.AES_256_XTS:
                return "aes-256-xts";
            case ENCRYPTION_MODE.SM4_128_ECB:
                return "sm4-128-ecb";
            case ENCRYPTION_MODE.AES_128_GCM:
                return "aes-128-gcm";
            case ENCRYPTION_MODE.AES_256_GCM:
                return "aes-256-gcm";
            case ENCRYPTION_MODE.AES_128_GCM2:
                return "aes-128-gcm2";
            case ENCRYPTION_MODE.AES_256_GCM2:
                return "aes-256-gcm2";
            default:
                return "none";
        }
    }

    public static StreamFallbackOption(option: STREAM_FALLBACK_OPTIONS): 0 | 1 | 2 {
        switch (option) {
            case STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_DISABLED:
                return 0;
            case STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW:
                return 1;
            case STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_AUDIO_ONLY:
                return 2;
            default:
                return 0;
        }
    }

    public static SimulcastMode(mode: SIMULCAST_STREAM_MODE): -1 | 0 | 1 {
        switch (mode) {
            case SIMULCAST_STREAM_MODE.AUTO_SIMULCAST_STREAM:
                return -1;
            case SIMULCAST_STREAM_MODE.DISABLE_SIMULCAST_STREAM:
                return 0;
            case SIMULCAST_STREAM_MODE.ENABLE_SIMULCAST_STREAM:
                return 1;
            default:
                return -1;
        }
    }

    public static AreaCode(areaCode: AREA_CODE | AREA_CODE_EX): AREAS {
        let webArea = AREAS_FAKE.GLOBAL;
        switch (areaCode) {
            case AREA_CODE.AREA_CODE_CN:
                webArea = AREAS_FAKE.CHINA;
                break;
            case AREA_CODE.AREA_CODE_NA:
                webArea = AREAS_FAKE.NORTH_AMERICA;
                break;
            case AREA_CODE.AREA_CODE_EU:
                webArea = AREAS_FAKE.EUROPE;
                break;
            case AREA_CODE.AREA_CODE_AS:
                webArea = AREAS_FAKE.ASIA;
                break;
            case AREA_CODE.AREA_CODE_JP:
                webArea = AREAS_FAKE.JAPAN;
                break;
            case AREA_CODE.AREA_CODE_IN:
                webArea = AREAS_FAKE.INDIA;
                break;
            case AREA_CODE_EX.AREA_CODE_OC:
                webArea = AREAS_FAKE.OCEANIA;
                break;
            case AREA_CODE_EX.AREA_CODE_SA:
                webArea = AREAS_FAKE.SOUTH_AMERICA;
                break;
            case AREA_CODE_EX.AREA_CODE_AF:
                webArea = AREAS_FAKE.AFRICA;
                break;
            case AREA_CODE_EX.AREA_CODE_KR:
                webArea = AREAS_FAKE.KOREA;
                break;
            case AREA_CODE_EX.AREA_CODE_HKMC:
                webArea = AREAS_FAKE.HKMC;
                break;
            case AREA_CODE_EX.AREA_CODE_US:
                webArea = AREAS_FAKE.US;
                break;
            case AREA_CODE_EX.AREA_CODE_OVS:
                webArea = AREAS_FAKE.OVERSEA;
                break;
            case AREA_CODE.AREA_CODE_GLOB:
                webArea = AREAS_FAKE.GLOBAL;
                break;
            default:
                webArea = AREAS_FAKE.GLOBAL;
                break;
        }
        return webArea as unknown as AREAS;
    }

    public static AreaCodes(areaCode: number): AREAS[] {
        const areas: AREAS[] = [];
        Object.values(AREA_CODE).forEach((code) => {
            if (typeof code === "number" && areaCode & code) {
                areas.push(this.AreaCode(code));
            }
        });
        Object.values(AREA_CODE_EX).forEach((code) => {
            if (typeof code === "number" && areaCode & code) {
                areas.push(this.AreaCode(code));
            }
        });
        return areas;
    }

    // * - 0: DEBUG。输出所有的 SDK 日志。
    // * - 1: INFO。输出 INFO、WARNING 和 ERROR 级别的日志。
    // * - 2: WARNING。输出 WARNING 和 ERROR 级别的日志。
    // * - 3: ERROR。输出 ERROR 级别的日志。
    // * - 4: NONE。不输出日志。
    public static LogLevel(logLevel: LOG_LEVEL): number {
        switch (logLevel) {
            case LOG_LEVEL.LOG_LEVEL_DEBUG:
                return 0;
            case LOG_LEVEL.LOG_LEVEL_INFO:
                return 1;
            case LOG_LEVEL.LOG_LEVEL_WARN:
                return 2;
            case LOG_LEVEL.LOG_LEVEL_ERROR:
                return 3;
            case LOG_LEVEL.LOG_LEVEL_NONE:
                return 4;
            default:
                return 1;
        }
    }

    public static ERROR_CODE_TYPE(code: ERROR_CODE_TYPE): AgoraRTCErrorCode | string {
        switch (code) {
            case ERROR_CODE_TYPE.ERR_OK:
                return "everything is fine";
            case ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT:
            case ERROR_CODE_TYPE.ERR_INVALID_APP_ID:
            case ERROR_CODE_TYPE.ERR_INVALID_CHANNEL_NAME:
            case ERROR_CODE_TYPE.ERR_INVALID_TOKEN:
            case ERROR_CODE_TYPE.ERR_INVALID_USER_ID:
            case ERROR_CODE_TYPE.ERR_INVALID_USER_ACCOUNT:
                return AgoraRTCErrorCode_FAKE.INVALID_PARAMS;
            case ERROR_CODE_TYPE.ERR_NOT_READY:
            case ERROR_CODE_TYPE.ERR_NOT_INITIALIZED:
            case ERROR_CODE_TYPE.ERR_INVALID_STATE:
            case ERROR_CODE_TYPE.ERR_NOT_IN_CHANNEL:
                return AgoraRTCErrorCode_FAKE.INVALID_OPERATION;
            case ERROR_CODE_TYPE.ERR_NOT_SUPPORTED:
                return AgoraRTCErrorCode_FAKE.NOT_SUPPORTED;
            case ERROR_CODE_TYPE.ERR_NO_PERMISSION:
            case ERROR_CODE_TYPE.ERR_SET_CLIENT_ROLE_NOT_AUTHORIZED:
            case ERROR_CODE_TYPE.ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISH:
            case ERROR_CODE_TYPE.ERR_VDM_CAMERA_NOT_AUTHORIZED:
                return AgoraRTCErrorCode_FAKE.PERMISSION_DENIED;
            case ERROR_CODE_TYPE.ERR_TIMEDOUT:
            case ERROR_CODE_TYPE.ERR_STREAM_MESSAGE_TIMEOUT:
                return AgoraRTCErrorCode_FAKE.TIMEOUT;
            case ERROR_CODE_TYPE.ERR_CANCELED:
            case ERROR_CODE_TYPE.ERR_ABORTED:
                return AgoraRTCErrorCode_FAKE.OPERATION_ABORTED;
            case ERROR_CODE_TYPE.ERR_BIND_SOCKET:
            case ERROR_CODE_TYPE.ERR_NET_DOWN:
            case ERROR_CODE_TYPE.ERR_INIT_NET_ENGINE:
            case ERROR_CODE_TYPE.ERR_CONNECTION_INTERRUPTED:
            case ERROR_CODE_TYPE.ERR_CONNECTION_LOST:
                return AgoraRTCErrorCode_FAKE.NETWORK_ERROR;
            case ERROR_CODE_TYPE.ERR_FUNC_IS_PROHIBITED:
                return AgoraRTCErrorCode_FAKE.PROHIBITED_OPERATION;
            case ERROR_CODE_TYPE.ERR_NO_SERVER_RESOURCES:
                return AgoraRTCErrorCode_FAKE.CAN_NOT_GET_GATEWAY_SERVER;
            case ERROR_CODE_TYPE.ERR_TOKEN_EXPIRED:
                return AgoraRTCErrorCode_FAKE.TOKEN_EXPIRE;
            case ERROR_CODE_TYPE.ERR_RDT_USER_NOT_EXIST:
                return AgoraRTCErrorCode_FAKE.INVALID_REMOTE_USER;
            case ERROR_CODE_TYPE.ERR_RDT_USER_NOT_READY:
                return AgoraRTCErrorCode_FAKE.REMOTE_USER_IS_NOT_PUBLISHED;
            case ERROR_CODE_TYPE.ERR_RDT_DATA_BLOCKED:
                return AgoraRTCErrorCode_FAKE.DATACHANNEL_FAILED;
            case ERROR_CODE_TYPE.ERR_LOGIN_ALREADY_LOGIN:
                return AgoraRTCErrorCode_FAKE.UID_CONFLICT;
            default:
                return AgoraRTCErrorCode_FAKE.UNEXPECTED_ERROR;
        }
    }

    public static VideoEncoderConfiguration(config: NativeVideoEncoderConfiguration): WebVideoEncoderConfiguration {
        return {
            width: config.dimensions.width,
            height: config.dimensions.height,
            frameRate: config.frameRate,
            bitrateMin: config.minBitrate,
            bitrateMax: config.bitrate,
        };
    }

    public static ClientRoleOptions(config: NativeClientRoleOptions): WebClientRoleOptions {
        return {
            level: Native2Web.AudienceLatencyLevelType(config.audienceLatencyLevel),
        };
    }

    public static AudienceLatencyLevelType(type: AUDIENCE_LATENCY_LEVEL_TYPE): AudienceLatencyLevelType {
        let level = AudienceLatencyLevelType_FAKE.AUDIENCE_LEVEL_LOW_LATENCY;
        switch (type) {
            case AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_LOW_LATENCY:
                level = AudienceLatencyLevelType_FAKE.AUDIENCE_LEVEL_LOW_LATENCY;
                break;
            case AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_ULTRA_LOW_LATENCY:
                level = AudienceLatencyLevelType_FAKE.AUDIENCE_LEVEL_ULTRA_LOW_LATENCY;
                break;
            default:
                level = AudienceLatencyLevelType_FAKE.AUDIENCE_LEVEL_LOW_LATENCY;
                break;
        }
        return level as unknown as AudienceLatencyLevelType;
    }

    /* @param level The output log level.
     * - 0: DEBUG. Output all API logs.
     * - 1: INFO. Output logs of the INFO, WARNING and ERROR level.
     * - 2: WARNING. Output logs of the WARNING and ERROR level.
     * - 3: ERROR. Output logs of the ERROR level.
     * - 4: NONE. Do not output any log.
     */
    public static LOG_LEVEL(level: LOG_LEVEL): number {
        switch (level) {
            case LOG_LEVEL.LOG_LEVEL_DEBUG:
                return 0;
            case LOG_LEVEL.LOG_LEVEL_INFO:
                return 1;
            case LOG_LEVEL.LOG_LEVEL_WARN:
                return 2;
            case LOG_LEVEL.LOG_LEVEL_ERROR:
                return 3;
            case LOG_LEVEL.LOG_LEVEL_NONE:
                return 4;
            default:
                return 1;
        }
    }

    public static LiveTranscoding(config: LiveTranscoding): LiveStreamingTranscodingConfig {
        return {
            width: config.width,
            height: config.height,
            videoBitrate: config.videoBitrate,
            videoFrameRate: config.videoFramerate,
            lowLatency: config.lowLatency,
            videoGop: config.videoGop,
            videoCodecProfile: config.videoCodecProfile,
            backgroundColor: config.backgroundColor,
            audioSampleRate: config.audioSampleRate,
            audioBitrate: config.audioBitrate,
            audioChannels: config.audioChannels as 1 | 2 | 3 | 4 | 5,
            transcodingUsers: config.transcodingUsers.map((user) => ({
                uid: user.uid,
                x: user.x,
                y: user.y,
                width: user.width,
                height: user.height,
                zOrder: user.zOrder,
                alpha: user.alpha,
                audioChannel: user.audioChannel,
            })),
            userConfigExtraInfo: config.transcodingExtraInfo,
            images:
                config.watermark.length > 0
                    ? config.watermark.map((img) => ({
                          url: img.url,
                          x: img.x,
                          y: img.y,
                          width: img.width,
                          height: img.height,
                          alpha: img.alpha,
                      }))
                    : undefined,
            backgroundImage:
                config.backgroundImage.length > 0
                    ? {
                          url: config.backgroundImage[0].url,
                          x: config.backgroundImage[0].x,
                          y: config.backgroundImage[0].y,
                          width: config.backgroundImage[0].width,
                          height: config.backgroundImage[0].height,
                          alpha: config.backgroundImage[0].alpha,
                      }
                    : undefined,
        };
    }

    public static ChannelMediaRelayConfiguration(
        config: ChannelMediaRelayConfiguration,
    ): IChannelMediaRelayConfiguration {
        const conf = AgoraRTC.createChannelMediaRelayConfiguration();
        conf.setSrcChannelInfo({
            channelName: config.srcInfo.channelName,
            uid: config.srcInfo.uid,
            token: config.srcInfo.token,
        });

        for (let i = 0; i < config.destInfos.length; i++) {
            conf.addDestChannelInfo({
                channelName: config.destInfos[i].channelName,
                uid: config.destInfos[i].uid,
                token: config.destInfos[i].token,
            });
        }
        return conf;
    }

    public static CLOUD_PROXY_TYPE(type: CLOUD_PROXY_TYPE): number {
        switch (type) {
            case CLOUD_PROXY_TYPE.NONE_PROXY:
                return 0;
            case CLOUD_PROXY_TYPE.UDP_PROXY:
                return 3;
            case CLOUD_PROXY_TYPE.TCP_PROXY:
                return 5;
            default:
                return 0;
        }
    }
}

export function isAgoraRTCError(e: unknown): boolean {
    return (
        e instanceof Error &&
        "code" in e &&
        typeof (e as IAgoraRTCError).code === "string" &&
        (e as IAgoraRTCError).code !== undefined
    );
}
