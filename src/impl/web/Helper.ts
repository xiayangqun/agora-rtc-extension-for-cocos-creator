import { ConnectionState } from "agora-rtc-sdk-ng";
import { CONNECTION_CHANGED_REASON_TYPE, CONNECTION_STATE_TYPE } from "../../types/AgoraBase";

export class Web2Native {
    public static RTCPeerConnectionState(param: RTCPeerConnectionState): CONNECTION_STATE_TYPE {
        //todo
    }

    public static ConnectionState(parm: ConnectionState): CONNECTION_STATE_TYPE {
        //todo
    }

    public static ConnectionDisconnectedReason(param: ConnectionDisconnectedReason): CONNECTION_CHANGED_REASON_TYPE {
        //todo
    }

    // * - `"Quit"`: The user calls {@link leave} and leaves the channel.
    //* - `"ServerTimeOut"`: The user has dropped offline.
    //* - `"BecomeAudience"`: The client role is switched from host to audience.
    public static string2USER_OFFLINE_REASON_TYPE(param: string): USER_OFFLINE_REASON_TYPE {
        //todo
    }

    public static ChannelMediaRelayState(param: ChannelMediaRelayState): CHANNEL_MEDIA_RELAY_STATE {}

    public static ChannelMediaRelayError(param: ChannelMediaRelayError): CHANNEL_MEDIA_RELAY_ERROR {}
}
