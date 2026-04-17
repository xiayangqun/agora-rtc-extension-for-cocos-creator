import {
    ConnectionState as WebConnectionState,
    ConnectionDisconnectedReason as WebConnectionDisconnectedReason,
    ChannelMediaRelayState as WebChannelMediaRelayState,
    ChannelMediaRelayError as WebChannelMediaRelayError,
    EncryptionMode,
    DeviceState,
    AREAS,
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
} from "../../types/AgoraBase";
import { MEDIA_DEVICE_STATE_TYPE, STREAM_FALLBACK_OPTIONS } from "../../types/AgoraRtcEngine";
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
}
