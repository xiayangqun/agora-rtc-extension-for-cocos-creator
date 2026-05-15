import AgoraRTC, {
    ConnectionState as WebConnectionState,
    ConnectionDisconnectedReason as WebConnectionDisconnectedReason,
    ChannelMediaRelayState as WebChannelMediaRelayState,
    ChannelMediaRelayError as WebChannelMediaRelayError,
    EncryptionMode,
    DeviceState,
    AREAS,
    IAgoraRTCError,
    VideoEncoderConfiguration as WebVideoEncoderConfiguration,
    ClientRoleOptions as WebClientRoleOptions,
    AudienceLatencyLevelType,
    LiveStreamingTranscodingConfig,
    IChannelMediaRelayConfiguration,
    ChannelMediaRelayInfo,
} from "agora-rtc-sdk-ng";
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
import { AgoraRTCErrorCode } from "@agora-js/shared";
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
            case AgoraRTCErrorCode.INVALID_PARAMS:
            case AgoraRTCErrorCode.MEDIA_OPTION_INVALID:
            case AgoraRTCErrorCode.INVALID_LOCAL_TRACK:
            case AgoraRTCErrorCode.INVALID_TRACK:
            case AgoraRTCErrorCode.SENDER_NOT_FOUND:
            case AgoraRTCErrorCode.INVALID_UINT_UID_FROM_STRING_UID:
            case AgoraRTCErrorCode.LIVE_STREAMING_INVALID_ARGUMENT:
            case AgoraRTCErrorCode.LIVE_STREAMING_INVALID_RAW_STREAM:
            case AgoraRTCErrorCode.INVALID_PLUGIN:
                return ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;

            // 状态非法/未就绪
            case AgoraRTCErrorCode.INVALID_OPERATION:
            case AgoraRTCErrorCode.TRACK_IS_DISABLED:
            case AgoraRTCErrorCode.TRACK_STATE_UNREACHABLE:
            case AgoraRTCErrorCode.EXIST_DISABLED_VIDEO_TRACK:
                return ERROR_CODE_TYPE.ERR_INVALID_STATE;

            // 不支持
            case AgoraRTCErrorCode.NOT_SUPPORTED:
            case AgoraRTCErrorCode.CONSTRAINT_NOT_SATISFIED:
            case AgoraRTCErrorCode.ELECTRON_IS_NULL:
            case AgoraRTCErrorCode.ELECTRON_DESKTOP_CAPTURER_GET_SOURCES_ERROR:
            case AgoraRTCErrorCode.CHROME_PLUGIN_NO_RESPONSE:
            case AgoraRTCErrorCode.CHROME_PLUGIN_NOT_INSTALL:
            case AgoraRTCErrorCode.GET_LOCAL_CAPABILITIES_FAILED:
            case AgoraRTCErrorCode.CAN_NOT_PUBLISH_MULTIPLE_VIDEO_TRACKS:
            case AgoraRTCErrorCode.LIVE_STREAMING_TRANSCODING_NOT_SUPPORTED:
                return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

            // 权限不足
            case AgoraRTCErrorCode.PERMISSION_DENIED:
            case AgoraRTCErrorCode.SHARE_AUDIO_NOT_ALLOWED:
                return ERROR_CODE_TYPE.ERR_NO_PERMISSION;

            // 超时
            case AgoraRTCErrorCode.TIMEOUT:
            case AgoraRTCErrorCode.NETWORK_TIMEOUT:
            case AgoraRTCErrorCode.API_INVOKE_TIMEOUT:
            case AgoraRTCErrorCode.INIT_DATACHANNEL_TIMEOUT:
            case AgoraRTCErrorCode.DATACHANNEL_CONNECTION_TIMEOUT:
                return ERROR_CODE_TYPE.ERR_TIMEDOUT;

            // 操作被取消/中止
            case AgoraRTCErrorCode.OPERATION_ABORTED:
                return ERROR_CODE_TYPE.ERR_ABORTED;

            // 网络错误
            case AgoraRTCErrorCode.NETWORK_ERROR:
            case AgoraRTCErrorCode.NETWORK_RESPONSE_ERROR:
            case AgoraRTCErrorCode.WS_ERR:
                return ERROR_CODE_TYPE.ERR_NET_DOWN;

            // 连接断开/中断 (P2P/WebSocket层)
            case AgoraRTCErrorCode.PC_CLOSED:
            case AgoraRTCErrorCode.GATEWAY_P2P_LOST:
            case AgoraRTCErrorCode.WS_ABORT:
            case AgoraRTCErrorCode.WS_DISCONNECT:
            case AgoraRTCErrorCode.EXTERNAL_SIGNAL_ABORT:
            case AgoraRTCErrorCode.DISCONNECT_P2P:
            case AgoraRTCErrorCode.CROSS_CHANNEL_FAILED_PACKET_SENT_TO_DEST:
            case AgoraRTCErrorCode.P2P_MESSAGE_FAILED:
                return ERROR_CODE_TYPE.ERR_CONNECTION_LOST;

            // P2P 信令交互失败
            case AgoraRTCErrorCode.EXCHANGE_SDP_FAILED:
            case AgoraRTCErrorCode.ADD_CANDIDATE_FAILED:
            case AgoraRTCErrorCode.CREATE_OFFER_FAILED:
            case AgoraRTCErrorCode.SET_ANSWER_FAILED:
            case AgoraRTCErrorCode.ICE_FAILED:
            case AgoraRTCErrorCode.NO_ICE_CANDIDATE:
                return ERROR_CODE_TYPE.ERR_CONNECTION_INTERRUPTED;

            // 拒绝/安全策略
            case AgoraRTCErrorCode.WEB_SECURITY_RESTRICT:
            case AgoraRTCErrorCode.LIVE_STREAMING_PUBLISH_STREAM_NOT_AUTHORIZED:
                return ERROR_CODE_TYPE.ERR_REFUSED;

            // DataChannel / 数据流
            case AgoraRTCErrorCode.DATACHANNEL_FAILED:
            case AgoraRTCErrorCode.CREATE_DATACHANNEL_ERROR:
                return ERROR_CODE_TYPE.ERR_DATASTREAM_DECRYPTION_FAILED;

            // 资源受限/设备不可用
            case AgoraRTCErrorCode.NOT_READABLE:
            case AgoraRTCErrorCode.ENUMERATE_DEVICES_FAILED:
            case AgoraRTCErrorCode.DEVICE_NOT_FOUND:
            case AgoraRTCErrorCode.LOCAL_AEC_ERROR:
                return ERROR_CODE_TYPE.ERR_RESOURCE_LIMITED;

            // 服务器资源不足 / 网关不可用
            case AgoraRTCErrorCode.CAN_NOT_GET_PROXY_SERVER:
            case AgoraRTCErrorCode.CAN_NOT_GET_GATEWAY_SERVER:
            case AgoraRTCErrorCode.VOID_GATEWAY_ADDRESS:
            case AgoraRTCErrorCode.LIVE_STREAMING_INTERNAL_SERVER_ERROR:
            case AgoraRTCErrorCode.CROSS_CHANNEL_SERVER_ERROR_RESPONSE:
                return ERROR_CODE_TYPE.ERR_NO_SERVER_RESOURCES;

            // Token 过期
            case AgoraRTCErrorCode.TOKEN_EXPIRE:
                return ERROR_CODE_TYPE.ERR_TOKEN_EXPIRED;

            // UID 冲突
            case AgoraRTCErrorCode.UID_CONFLICT:
                return ERROR_CODE_TYPE.ERR_LOGIN_ALREADY_LOGIN;

            // 远端用户不存在/未就绪
            case AgoraRTCErrorCode.INVALID_REMOTE_USER:
                return ERROR_CODE_TYPE.ERR_INVALID_USER_ID;
            case AgoraRTCErrorCode.REMOTE_USER_IS_NOT_PUBLISHED:
                return ERROR_CODE_TYPE.ERR_RDT_USER_NOT_READY;

            // 已被占用
            case AgoraRTCErrorCode.LIVE_STREAMING_TASK_CONFLICT:
                return ERROR_CODE_TYPE.ERR_ALREADY_IN_USE;

            // 频率/数量超限
            case AgoraRTCErrorCode.CUSTOM_REPORT_FREQUENCY_TOO_HIGH:
            case AgoraRTCErrorCode.LIVE_STREAMING_WARN_FREQUENT_REQUEST:
                return ERROR_CODE_TYPE.ERR_TOO_OFTEN;
            case AgoraRTCErrorCode.LIVE_STREAMING_WARN_STREAM_NUM_REACH_LIMIT:
                return ERROR_CODE_TYPE.ERR_TOO_MANY_DATA_STREAMS;

            // 数据过大
            case AgoraRTCErrorCode.METADATA_OUT_OF_RANGE:
                return ERROR_CODE_TYPE.ERR_SIZE_TOO_LARGE;

            // 禁止的操作
            case AgoraRTCErrorCode.PROHIBITED_OPERATION:
                return ERROR_CODE_TYPE.ERR_FUNC_IS_PROHIBITED;

            // 跨频道加入失败
            case AgoraRTCErrorCode.CROSS_CHANNEL_FAILED_JOIN_SRC:
            case AgoraRTCErrorCode.CROSS_CHANNEL_FAILED_JOIN_DEST:
                return ERROR_CODE_TYPE.ERR_JOIN_CHANNEL_REJECTED;

            // 其余全部兜底到 ERR_FAILED
            case AgoraRTCErrorCode.UNEXPECTED_ERROR:
            case AgoraRTCErrorCode.UNEXPECTED_RESPONSE:
            case AgoraRTCErrorCode.PB_ERROR:
            case AgoraRTCErrorCode.GET_VIDEO_ELEMENT_VISIBLE_ERROR:
            case AgoraRTCErrorCode.LOW_STREAM_ENCODING_ERROR:
            case AgoraRTCErrorCode.SET_ENCODING_PARAMETER_ERROR:
            case AgoraRTCErrorCode.MULTI_UNILBS_RESPONSE_ERROR:
            case AgoraRTCErrorCode.UPDATE_TICKET_FAILED:
            case AgoraRTCErrorCode.SENDER_REPLACE_FAILED:
            case AgoraRTCErrorCode.GET_LOCAL_CONNECTION_PARAMS_FAILED:
            case AgoraRTCErrorCode.SUBSCRIBE_FAILED:
            case AgoraRTCErrorCode.UNSUBSCRIBE_FAILED:
            case AgoraRTCErrorCode.CUSTOM_REPORT_SEND_FAILED:
            case AgoraRTCErrorCode.FETCH_AUDIO_FILE_FAILED:
            case AgoraRTCErrorCode.READ_LOCAL_AUDIO_FILE_ERROR:
            case AgoraRTCErrorCode.DECODE_AUDIO_FILE_FAILED:
            case AgoraRTCErrorCode.LIVE_STREAMING_CDN_ERROR:
            case AgoraRTCErrorCode.LIVE_STREAMING_WARN_FAILED_LOAD_IMAGE:
            case AgoraRTCErrorCode.WEBGL_INTERNAL_ERROR:
            case AgoraRTCErrorCode.BEAUTY_PROCESSOR_INTERNAL_ERROR:
            case AgoraRTCErrorCode.CROSS_CHANNEL_WAIT_STATUS_ERROR:
            case AgoraRTCErrorCode.CONVERTING_IMAGEDATA_TO_BLOB_FAILED:
            case AgoraRTCErrorCode.CONVERTING_VIDEO_FRAME_TO_BLOB_FAILED:
            case AgoraRTCErrorCode.IMAGE_MODERATION_UPLOAD_FAILED:
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
        switch (areaCode) {
            case AREA_CODE.AREA_CODE_CN:
                return AREAS.CHINA;
            case AREA_CODE.AREA_CODE_NA:
                return AREAS.NORTH_AMERICA;
            case AREA_CODE.AREA_CODE_EU:
                return AREAS.EUROPE;
            case AREA_CODE.AREA_CODE_AS:
                return AREAS.ASIA;
            case AREA_CODE.AREA_CODE_JP:
                return AREAS.JAPAN;
            case AREA_CODE.AREA_CODE_IN:
                return AREAS.INDIA;
            case AREA_CODE_EX.AREA_CODE_OC:
                return AREAS.OCEANIA;
            case AREA_CODE_EX.AREA_CODE_SA:
                return AREAS.SOUTH_AMERICA;
            case AREA_CODE_EX.AREA_CODE_AF:
                return AREAS.AFRICA;
            case AREA_CODE_EX.AREA_CODE_KR:
                return AREAS.KOREA;
            case AREA_CODE_EX.AREA_CODE_HKMC:
                return AREAS.HKMC;
            case AREA_CODE_EX.AREA_CODE_US:
                return AREAS.US;
            case AREA_CODE_EX.AREA_CODE_OVS:
                return AREAS.OVERSEA;
            case AREA_CODE.AREA_CODE_GLOB:
                return AREAS.GLOBAL;
            default:
                return AREAS.GLOBAL;
        }
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
                return AgoraRTCErrorCode.INVALID_PARAMS;
            case ERROR_CODE_TYPE.ERR_NOT_READY:
            case ERROR_CODE_TYPE.ERR_NOT_INITIALIZED:
            case ERROR_CODE_TYPE.ERR_INVALID_STATE:
            case ERROR_CODE_TYPE.ERR_NOT_IN_CHANNEL:
                return AgoraRTCErrorCode.INVALID_OPERATION;
            case ERROR_CODE_TYPE.ERR_NOT_SUPPORTED:
                return AgoraRTCErrorCode.NOT_SUPPORTED;
            case ERROR_CODE_TYPE.ERR_NO_PERMISSION:
            case ERROR_CODE_TYPE.ERR_SET_CLIENT_ROLE_NOT_AUTHORIZED:
            case ERROR_CODE_TYPE.ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISH:
            case ERROR_CODE_TYPE.ERR_VDM_CAMERA_NOT_AUTHORIZED:
                return AgoraRTCErrorCode.PERMISSION_DENIED;
            case ERROR_CODE_TYPE.ERR_TIMEDOUT:
            case ERROR_CODE_TYPE.ERR_STREAM_MESSAGE_TIMEOUT:
                return AgoraRTCErrorCode.TIMEOUT;
            case ERROR_CODE_TYPE.ERR_CANCELED:
            case ERROR_CODE_TYPE.ERR_ABORTED:
                return AgoraRTCErrorCode.OPERATION_ABORTED;
            case ERROR_CODE_TYPE.ERR_BIND_SOCKET:
            case ERROR_CODE_TYPE.ERR_NET_DOWN:
            case ERROR_CODE_TYPE.ERR_INIT_NET_ENGINE:
            case ERROR_CODE_TYPE.ERR_CONNECTION_INTERRUPTED:
            case ERROR_CODE_TYPE.ERR_CONNECTION_LOST:
                return AgoraRTCErrorCode.NETWORK_ERROR;
            case ERROR_CODE_TYPE.ERR_FUNC_IS_PROHIBITED:
                return AgoraRTCErrorCode.PROHIBITED_OPERATION;
            case ERROR_CODE_TYPE.ERR_NO_SERVER_RESOURCES:
                return AgoraRTCErrorCode.CAN_NOT_GET_GATEWAY_SERVER;
            case ERROR_CODE_TYPE.ERR_TOKEN_EXPIRED:
                return AgoraRTCErrorCode.TOKEN_EXPIRE;
            case ERROR_CODE_TYPE.ERR_RDT_USER_NOT_EXIST:
                return AgoraRTCErrorCode.INVALID_REMOTE_USER;
            case ERROR_CODE_TYPE.ERR_RDT_USER_NOT_READY:
                return AgoraRTCErrorCode.REMOTE_USER_IS_NOT_PUBLISHED;
            case ERROR_CODE_TYPE.ERR_RDT_DATA_BLOCKED:
                return AgoraRTCErrorCode.DATACHANNEL_FAILED;
            case ERROR_CODE_TYPE.ERR_LOGIN_ALREADY_LOGIN:
                return AgoraRTCErrorCode.UID_CONFLICT;
            default:
                return AgoraRTCErrorCode.UNEXPECTED_ERROR;
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
        switch (type) {
            case AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_LOW_LATENCY:
                return AudienceLatencyLevelType.AUDIENCE_LEVEL_LOW_LATENCY;
            case AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_ULTRA_LOW_LATENCY:
                return AudienceLatencyLevelType.AUDIENCE_LEVEL_ULTRA_LOW_LATENCY;
            default:
                return AudienceLatencyLevelType.AUDIENCE_LEVEL_LOW_LATENCY;
        }
    }

    /* @param level The output log level.
     * - 0: DEBUG. Output all API logs.
     * - 1: INFO. Output logs of the INFO, WARNING and ERROR level.
     * - 2: WARNING. Output logs of the WARNING and ERROR level.
     * - 3: ERROR. Output logs of the ERROR level.
     * - 4: NONE. Do not output any log.
     */
    public static LOG_LEVEL(level: LOG_LEVEL): number {
        //ai todo
    }

    public static LiveTranscoding(config: LiveTranscoding): LiveStreamingTranscodingConfig {
        //ai todo
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
