import AgoraRTC, {
    ClientConfig,
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ILocalTrack,
    ILocalDataChannel,
    UID,
    ConnectionState,
    ConnectionDisconnectedReason,
    RemoteStreamType,
    NetworkQuality,
    IAgoraRTCError,
    ChannelMediaRelayState,
    ChannelMediaRelayError,
    ChannelMediaRelayEvent,
    ClientRole,
    ClientRoleOptions,
    ILocalVideoTrack,
    ICameraVideoTrack,
    VideoEncoderConfiguration as WebVideoEncoderConfiguration,
    IMicrophoneAudioTrack,
    ILocalAudioTrack,
    LiveStreamingTranscodingConfig,
    EncryptionMode,
    IChannelMediaRelayConfiguration,
} from "agora-rtc-sdk-ng";
import { RtcEngineWeb } from "./RtcEngineWeb";
import { Native2Web, Web2Native } from "./Helper";
import { TrackManager } from "./TrackManager";
import { RtcConnection } from "../../types/AgoraRtcEngineEx";
import {
    AUDIENCE_LATENCY_LEVEL_TYPE,
    CHANNEL_PROFILE_TYPE,
    CLIENT_ROLE_TYPE,
    ENCRYPTION_ERROR_TYPE,
    ERROR_CODE_TYPE,
    MultipathMode,
    MultipathType,
    VIDEO_STREAM_TYPE,
    VideoEncoderConfiguration as NativeVideoEncoderConfiguration,
    UserInfo,
} from "../../types/AgoraBase";
import { ChannelMediaOptions } from "../../types/AgoraRtcEngine";
import { ClientRequest } from "http";

export class AgoraRTCClientProxy {
    private _client!: IAgoraRTCClient;
    private _rtcEngine!: RtcEngineWeb;

    // TrackManager 引用，管理全局本地轨道
    private _trackManager: TrackManager;

    private _streamIdCount: number = 0;
    private _streamChannels: Map<number, ILocalDataChannel> = new Map();

    constructor(config: ClientConfig, rtcEngineWeb: RtcEngineWeb, trackManager: TrackManager) {
        this._client = AgoraRTC.createClient(config);
        this._rtcEngine = rtcEngineWeb;
        this._trackManager = trackManager;
    }

    async release(): Promise<void> {
        this._client.localTracks.forEach((track) => track.close());
        await this._client.unpublish();
        for (const user of this._client.remoteUsers) {
            await this._client.unsubscribe(user);
        }
        await this._client.leave();
    }

    getClient(): IAgoraRTCClient {
        return this._client;
    }

    setupMainClient(client: IAgoraRTCClient): void {
        this._client = client;
    }

    // ==================== Properties ====================

    get remoteUsers(): IAgoraRTCRemoteUser[] {
        return this._client.remoteUsers;
    }

    getUserInfoByUserAccount(userAccount: string): UserInfo {
        const user = this._client.remoteUsers.find((u) => u.uid === userAccount);
        if (user) {
            return {
                uid: (user as any)._uintUid,
                userAccount: user.uid as string,
            };
        }
        return null;
    }

    getUserInfoByUid(uid: number): UserInfo {
        const user = this._client.remoteUsers.find((u) => (u as any)._uintUid === uid);
        if (user) {
            return {
                uid: (user as any)._uintUid,
                userAccount: user.uid as string,
            };
        }
        return null;
    }

    get connectionState(): ConnectionState {
        return this._client.connectionState;
    }

    get channelName(): string {
        return this._client.channelName || "";
    }

    get uid(): UID {
        return this._client.uid;
    }

    get numberUid(): number {
        return this._client.uid as number;
    }

    get stringUid(): string {
        return this._client.uid as string;
    }

    // ==================== Connection ====================

    async join(
        appid: string,
        channel: string,
        token: string | null,
        uid?: UID | null,
        options?: {
            autoSubscribe?: boolean;
            networkQualityProbe?: boolean;
        },
    ): Promise<UID> {
        return await this._client.join(appid, channel, token, uid, options);
    }

    async leave(): Promise<void> {
        return await this._client.leave();
    }

    async renewToken(token: string): Promise<void> {
        return await this._client.renewToken(token);
    }

    async setClientRole(role: ClientRole, options?: ClientRoleOptions): Promise<void> {
        if (options) {
            return await this._client.setClientRole(role, options);
        }
        return await this._client.setClientRole(role);
    }

    async createDataStream(reliable: boolean, ordered: boolean): Promise<number> {
        this._streamIdCount++;
        const streamId = this._streamIdCount;
        const channel = await this._client.publish({
            id: streamId,
            ordered: ordered,
            metadata: "",
        });

        this._streamChannels.set(streamId, channel);
        return streamId;
    }

    async sendData(streamId: number, data: ArrayBuffer): Promise<void> {
        const channel = this._streamChannels.get(streamId);
        if (channel) {
            channel.send(data);
        }
    }
    // ==================== Publish / Subscribe ====================
    async unpublish(tracks?: ILocalTrack | ILocalTrack[]): Promise<void> {
        return this._client.unpublish(tracks);
    }

    async subscribe(user: IAgoraRTCRemoteUser | UID, mediaType: "video"): Promise<any>;
    async subscribe(user: IAgoraRTCRemoteUser | UID, mediaType: "audio"): Promise<any>;
    async subscribe(
        user: IAgoraRTCRemoteUser | UID,
        mediaType: "video" | "audio" | "datachannel",
        channelId?: number,
    ): Promise<any> {
        if (channelId !== undefined) {
            return (this._client as any).subscribe(user, mediaType, channelId);
        }
        return (this._client as any).subscribe(user, mediaType);
    }

    async unsubscribe(
        user: IAgoraRTCRemoteUser | UID,
        mediaType?: "video" | "audio" | "datachannel",
        channelId?: number,
    ): Promise<void> {
        return (this._client as any).unsubscribe(user, mediaType, channelId);
    }

    // ==================== Video Stream Control ====================

    async setRemoteVideoStreamType(uid: UID, streamType: RemoteStreamType): Promise<void> {
        return await this._client.setRemoteVideoStreamType(uid, streamType);
    }

    async setRemoteDefaultVideoStreamType(streamType: RemoteStreamType): Promise<void> {
        return await this._client.setRemoteDefaultVideoStreamType(streamType);
    }

    async setDualStreamMode(mode: number, streamParameter?: any): Promise<void> {
        //ai todo
    }

    async setStreamFallbackOption(uid: UID, fallbackType: any): Promise<void> {
        //ai todo
    }

    // ==================== Subscription Filters ====================

    async setSubscribeAudioBlocklist(uidList: UID[]): Promise<void> {
        //ai todo
    }

    async setSubscribeAudioAllowlist(uidList: UID[]): Promise<void> {
        //ai todo
    }

    async setSubscribeVideoBlocklist(uidList: UID[]): Promise<void> {
        //ai todo
    }

    async setSubscribeVideoAllowlist(uidList: UID[]): Promise<void> {
        //ai todo
    }

    // ==================== Volume ====================

    enableAudioVolumeIndicator(): void {
        this._client.enableAudioVolumeIndicator();
    }

    // ==================== Encryption ====================

    setEncryptionConfig(
        encryptionMode: EncryptionMode,
        secret: string,
        salt?: Uint8Array,
        encryptDataStream?: boolean,
    ): void {
        this._client.setEncryptionConfig(encryptionMode, secret, salt, encryptDataStream);
    }

    // ==================== CDN Streaming ====================

    async startLiveStreaming(url: string, transcodingEnabled?: boolean): Promise<void> {
        return await this._client.startLiveStreaming(url, transcodingEnabled);
    }

    async setLiveTranscoding(config: LiveStreamingTranscodingConfig): Promise<void> {
        return await this._client.setLiveTranscoding(config);
    }

    async stopLiveStreaming(url: string): Promise<void> {
        return await this._client.stopLiveStreaming(url);
    }

    // ==================== Channel Media Relay ====================

    _isChannelMediaRelayStarted = false;
    async startOrUpdateChannelMediaRelay(config: IChannelMediaRelayConfiguration): Promise<void> {
        if (this._isChannelMediaRelayStarted) {
            return await this._client.updateChannelMediaRelay(config);
        } else {
            this._isChannelMediaRelayStarted = true;
            return await this._client.startChannelMediaRelay(config);
        }
    }

    async stopChannelMediaRelay(): Promise<void> {
        this._isChannelMediaRelayStarted = false;
        return await this._client.stopChannelMediaRelay();
    }

    // ==================== Proxy ====================

    startProxyServer(mode: number): void {
        this._client.startProxyServer(mode);
    }

    stopProxyServer(): void {
        this._client.stopProxyServer();
    }

    init() {
        this._client.on("peerconnection-state-change", this.onPeerconnectionStateChange.bind(this));
        this._client.on("connection-state-change", this.onConnectionStateChange.bind(this));
        this._client.on("user-joined", this.onUserJoined.bind(this));
        this._client.on("user-left", this.onUserLeft.bind(this));
        this._client.on("user-published", this.onUserPublished.bind(this));
        this._client.on("user-unpublished", this.onUserUnpublished.bind(this));
        this._client.on("user-info-updated", this.onUserInfoUpdated.bind(this));
        this._client.on("media-reconnect-start", this.onMediaReconnectStart.bind(this));
        this._client.on("media-reconnect-end", this.onMediaReconnectEnd.bind(this));
        this._client.on("stream-type-changed", this.onStreamTypeChanged.bind(this));
        this._client.on("stream-fallback", this.onStreamFallback.bind(this));
        this._client.on("channel-media-relay-state", this.onChannelMediaRelayState.bind(this));
        this._client.on("channel-media-relay-event", this.onChannelMediaRelayEvent.bind(this));
        this._client.on("volume-indicator", this.onVolumeIndicator.bind(this));
        this._client.on("crypt-error", this.onCryptError.bind(this));
        this._client.on("token-privilege-will-expire", this.onTokenPrivilegeWillExpire.bind(this));
        this._client.on("token-privilege-did-expire", this.onTokenPrivilegeDidExpire.bind(this));
        this._client.on("network-quality", this.onNetworkQuality.bind(this));
        this._client.on("live-streaming-error", this.onLiveStreamingError.bind(this));
        this._client.on("live-streaming-warning", this.onLiveStreamingWarning.bind(this));
        this._client.on("exception", this.onException.bind(this));
        this._client.on("is-using-cloud-proxy", this.onIsUsingCloudProxy.bind(this));
        this._client.on("join-fallback-to-proxy", this.onJoinFallbackToProxy.bind(this));
        this._client.on("published-user-list", this.onPublishedUserList.bind(this));
        this._client.on(
            "content-inspect-connection-state-change",
            this.onContentInspectConnectionStateChange.bind(this),
        );
        this._client.on("content-inspect-error", this.onContentInspectError.bind(this));
        this._client.on(
            "image-moderation-connection-state-change",
            this.onImageModerationConnectionStateChange.bind(this),
        );
        this._client.on("stream-message", this.onStreamMessage.bind(this));
    }

    onPeerconnectionStateChange(curState: RTCPeerConnectionState, revState: RTCPeerConnectionState) {
        //todo
    }

    onConnectionStateChange(
        curState: ConnectionState,
        revState: ConnectionState,
        reason?: ConnectionDisconnectedReason,
    ) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        const state = Web2Native.ConnectionState(curState);
        if (!reason) {
            this._rtcEngine.rtcEngineEventHandler?.onConnectionStateChanged(con, state);
        } else {
            const rea = Web2Native.ConnectionDisconnectedReason(reason);
            this._rtcEngine.rtcEngineEventHandler?.onConnectionStateChanged(con, state, rea);
        }
    }
    onUserJoined(user: IAgoraRTCRemoteUser) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };

        const uid = user.uid as number;
        this._rtcEngine.rtcEngineEventHandler?.onUserJoined(con, uid, 0);
    }

    onUserLeft(user: IAgoraRTCRemoteUser, reason: string) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };

        const uid = user.uid as number;
        const rea = Web2Native.string2USER_OFFLINE_REASON_TYPE(reason);
        this._rtcEngine.rtcEngineEventHandler?.onUserOffline(con, uid, rea);
    }

    onUserPublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "datachannel") {
        //todo
    }

    onUserUnpublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "datachannel") {
        //todo
    }

    onUserInfoUpdated(
        uid: UID,
        msg:
            | "mute-audio"
            | "mute-video"
            | "enable-local-video"
            | "unmute-audio"
            | "unmute-video"
            | "disable-local-video",
    ) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        const numberUid = uid as number;
        switch (msg) {
            case "mute-audio":
                this._rtcEngine.rtcEngineEventHandler?.onUserMuteAudio(con, numberUid, true);
                break;
            case "unmute-audio":
                this._rtcEngine.rtcEngineEventHandler?.onUserMuteAudio(con, numberUid, false);
                break;
            case "mute-video":
                this._rtcEngine.rtcEngineEventHandler?.onUserMuteVideo(con, numberUid, true);
                break;
            case "unmute-video":
                this._rtcEngine.rtcEngineEventHandler?.onUserMuteVideo(con, numberUid, false);
                break;
            case "enable-local-video":
                this._rtcEngine.rtcEngineEventHandler?.onUserEnableLocalVideo(con, numberUid, true);
                break;
            case "disable-local-video":
                this._rtcEngine.rtcEngineEventHandler?.onUserEnableLocalVideo(con, numberUid, false);
                break;
        }
    }

    onMediaReconnectStart(uid: UID) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onMediaReconnectEnd(uid: UID) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onStreamTypeChanged(uid: UID, streamType: RemoteStreamType) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onStreamFallback(uid: UID, isFallbackOrRecover: "fallback" | "recover") {
        const isFallback = isFallbackOrRecover === "fallback";
        this._rtcEngine.rtcEngineEventHandler?.onRemoteSubscribeFallbackToAudioOnly(uid as number, isFallback);
    }

    onChannelMediaRelayState(state: ChannelMediaRelayState, code: ChannelMediaRelayError) {
        const sta = Web2Native.ChannelMediaRelayState(state);
        const cod = Web2Native.ChannelMediaRelayError(code);

        this._rtcEngine.rtcEngineEventHandler?.onChannelMediaRelayStateChanged(sta, cod);
    }

    onChannelMediaRelayEvent(event: ChannelMediaRelayEvent) {
        //todo - no direct IRtcEngineEventHandler match, info is in onChannelMediaRelayState
    }

    onVolumeIndicator(result: { level: number; uid: UID }[]) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        const speakers = result.map((item) => ({
            uid: item.uid as number,
            //item.level is 0-100, but onAudioVolumeIndication need 0-255, so multiply 2.55
            volume: item.level * 2.55,
            vad: 1,
            voicePitch: 0,
        }));
        const totalVolume = result.reduce((sum, item) => sum + item.level, 0);
        this._rtcEngine.rtcEngineEventHandler?.onAudioVolumeIndication(con, speakers, speakers.length, totalVolume);
    }

    onCryptError() {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        this._rtcEngine.rtcEngineEventHandler?.onEncryptionError(
            con,
            ENCRYPTION_ERROR_TYPE.ENCRYPTION_ERROR_INTERNAL_FAILURE,
        );
    }

    onTokenPrivilegeWillExpire() {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        this._rtcEngine.rtcEngineEventHandler?.onTokenPrivilegeWillExpire(con, "");
    }

    onTokenPrivilegeDidExpire() {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        this._rtcEngine.rtcEngineEventHandler?.onRequestToken(con);
    }

    onNetworkQuality(stats: NetworkQuality) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        this._rtcEngine.rtcEngineEventHandler?.onNetworkQuality(
            con,
            0,
            stats.uplinkNetworkQuality,
            stats.downlinkNetworkQuality,
        );
    }

    onLiveStreamingError(url: string, err: IAgoraRTCError) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onLiveStreamingWarning(url: string, warning: IAgoraRTCError) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onException(event: { code: number; msg: string; uid: UID }) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onIsUsingCloudProxy(isUsingProxy: boolean) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onJoinFallbackToProxy(proxyServer: string) {
        //todo - no direct IRtcEngineEventHandler match (deprecated event)
    }

    onPublishedUserList(users: IAgoraRTCRemoteUser[]) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onContentInspectConnectionStateChange(preState: any, newState: any) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onContentInspectError(error?: IAgoraRTCError) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onImageModerationConnectionStateChange(newState: any, preState: any) {
        //todo - no direct IRtcEngineEventHandler match
    }

    onStreamMessage(uid: UID, payload: Uint8Array) {
        if (!this._client.uid || !this._client.channelName) return;

        const con: RtcConnection = {
            localUid: this._client.uid as number,
            channelId: this._client.channelName as string,
        };
        //can not get streamId and sentTs from agora-rtc-sdk-ng, so set to 0
        this._rtcEngine.rtcEngineEventHandler?.onStreamMessage(con, uid as number, 0, payload, payload.length, 0);
    }

    //channelMediaOptions
    _publishCameraTrack: boolean = undefined;
    _publishSecondaryCameraTrack: boolean = undefined;
    _publishThirdCameraTrack: boolean = undefined;
    _publishFourthCameraTrack: boolean = undefined;
    _publishMicrophoneTrack: boolean = undefined;
    _publishScreenCaptureAudio: boolean = undefined;
    _publishScreenCaptureVideo: boolean = undefined;
    _publishScreenTrack: boolean = undefined;
    _publishSecondaryScreenTrack: boolean = undefined;
    _publishThirdScreenTrack: boolean = undefined;
    _publishFourthScreenTrack: boolean = undefined;
    _publishCustomAudioTrack: boolean = undefined;
    _publishCustomAudioTrackId: number = undefined;
    _publishCustomVideoTrack: boolean = undefined;
    _publishEncodedVideoTrack: boolean = undefined;
    _publishMediaPlayerAudioTrack: boolean = undefined;
    _publishMediaPlayerVideoTrack: boolean = undefined;
    _publishTranscodedVideoTrack: boolean = undefined;
    _publishMixedAudioTrack: boolean = undefined;
    _publishLipSyncTrack: boolean = undefined;
    _autoSubscribeAudio: boolean = undefined;
    _autoSubscribeVideo: boolean = undefined;
    _enableAudioRecordingOrPlayout: boolean = undefined;
    _publishMediaPlayerId: number = undefined;
    _clientRoleType: CLIENT_ROLE_TYPE = undefined;
    _audienceLatencyLevel: AUDIENCE_LATENCY_LEVEL_TYPE = undefined;
    _defaultVideoStreamType: VIDEO_STREAM_TYPE = undefined;
    _channelProfile: CHANNEL_PROFILE_TYPE = undefined;
    _audioDelayMs: number = undefined;
    _mediaPlayerAudioDelayMs: number = undefined;
    _token: string = undefined;
    _enableBuiltInMediaEncryption: boolean = undefined;
    _publishRhythmPlayerTrack: boolean = undefined;
    _isInteractiveAudience: boolean = undefined;
    _customVideoTrackId: number = undefined;
    _isAudioFilterable: boolean = undefined;
    _parameters: string = undefined;
    _enableMultipath: boolean = undefined;
    _uplinkMultipathMode: MultipathMode = undefined;
    _downlinkMultipathMode: MultipathMode = undefined;
    _preferMultipathType: MultipathType = undefined;

    async updateChannelMediaOptions(options: ChannelMediaOptions): Promise<number> {
        if (this._client.uid === undefined || this._client.channelName === undefined) {
            return -ERROR_CODE_TYPE.ERR_NOT_IN_CHANNEL;
        }

        if (this._rtcEngine.videoEnabled) {
            if (options.publishCameraTrack !== undefined && options.publishCameraTrack !== this._publishCameraTrack) {
                this._publishCameraTrack = options.publishCameraTrack;
                if (!this._publishCameraTrack && this._trackManager.localFirstCameraTrack) {
                    this._client.unpublish(this._trackManager.localFirstCameraTrack);
                } else {
                    if (!this._trackManager.localFirstCameraTrack) {
                        await this.createLocalFirstCameraVideoTrack();
                    }
                    this._client.publish(this._trackManager.localFirstCameraTrack);
                }
            }

            if (
                options.publishSecondaryCameraTrack !== undefined &&
                options.publishSecondaryCameraTrack !== this._publishSecondaryCameraTrack
            ) {
                this._publishSecondaryCameraTrack = options.publishSecondaryCameraTrack;
                if (!this._publishSecondaryCameraTrack && this._trackManager.localSecondCameraTrack) {
                    this._client.unpublish(this._trackManager.localSecondCameraTrack);
                } else {
                    if (!this._trackManager.localSecondCameraTrack) {
                        console.warn("Secondary camera track is not created yet. call startCameraCapture first.");
                    }
                }
            }

            if (
                options.publishThirdCameraTrack !== undefined &&
                options.publishThirdCameraTrack !== this._publishThirdCameraTrack
            ) {
                this._publishThirdCameraTrack = options.publishThirdCameraTrack;
                if (!this._publishThirdCameraTrack && this._trackManager.localThirdCameraTrack) {
                    this._client.unpublish(this._trackManager.localThirdCameraTrack);
                } else {
                    if (!this._trackManager.localThirdCameraTrack) {
                        console.warn("Third camera track is not created yet. call startCameraCapture first.");
                    }
                }
            }

            if (
                options.publishFourthCameraTrack !== undefined &&
                options.publishFourthCameraTrack !== this._publishFourthCameraTrack
            ) {
                this._publishFourthCameraTrack = options.publishFourthCameraTrack;
                if (!this._publishFourthCameraTrack && this._trackManager.localFourthCameraTrack) {
                    this._client.unpublish(this._trackManager.localFourthCameraTrack);
                } else {
                    if (!this._trackManager.localFourthCameraTrack) {
                        console.warn("Fourth camera track is not created yet. call startCameraCapture first.");
                    }
                }
            }
        }

        if (this._rtcEngine.audioEnabled) {
            if (
                options.publishMicrophoneTrack !== undefined &&
                options.publishMicrophoneTrack !== this._publishMicrophoneTrack
            ) {
                this._publishMicrophoneTrack = options.publishMicrophoneTrack;
                if (this._publishMicrophoneTrack) {
                    if (!this._trackManager.localMicrophoneTrack) {
                        this.createLocalMicrophoneAudioTrack();
                    }
                    this._client.publish(this._trackManager.localMicrophoneTrack);
                } else {
                    if (this._trackManager.localMicrophoneTrack) {
                        this._client.unpublish(this._trackManager.localMicrophoneTrack);
                    }
                }
            }
        }

        //publishScreenCaptureAudio dont need impl
        if (
            options.publishScreenCaptureAudio !== undefined &&
            options.publishScreenCaptureAudio !== this._publishScreenCaptureAudio
        ) {
            this._publishScreenCaptureAudio = options.publishScreenCaptureAudio;
        }

        //publishScreenCaptureAudio dont need impl
        if (
            options.publishScreenCaptureVideo !== undefined &&
            options.publishScreenCaptureVideo !== this._publishScreenCaptureVideo
        ) {
            this._publishScreenCaptureVideo = options.publishScreenCaptureVideo;
        }

        if (this._rtcEngine.videoEnabled) {
            if (options.publishScreenTrack !== undefined && options.publishScreenTrack !== this._publishScreenTrack) {
                this._publishScreenTrack = options.publishScreenTrack;
                if (this._publishScreenTrack) {
                    this._trackManager.localFirstScreenAudioTrack &&
                        this._client.publish(this._trackManager.localFirstScreenAudioTrack);
                    this._trackManager.localFirstScreenVideoTrack &&
                        this._client.publish(this._trackManager.localFirstScreenVideoTrack);
                } else {
                    this._trackManager.localFirstScreenAudioTrack &&
                        this._client.unpublish(this._trackManager.localFirstScreenAudioTrack);
                    this._trackManager.localFirstScreenVideoTrack &&
                        this._client.unpublish(this._trackManager.localFirstScreenVideoTrack);
                }
            }

            if (
                options.publishSecondaryScreenTrack !== undefined &&
                options.publishSecondaryScreenTrack !== this._publishSecondaryScreenTrack
            ) {
                this._publishSecondaryScreenTrack = options.publishSecondaryScreenTrack;
                if (this._publishSecondaryScreenTrack) {
                    this._trackManager.localSecondScreenAudioTrack &&
                        this._client.publish(this._trackManager.localSecondScreenAudioTrack);
                    this._trackManager.localSecondScreenVideoTrack &&
                        this._client.publish(this._trackManager.localSecondScreenVideoTrack);
                } else {
                    this._trackManager.localSecondScreenAudioTrack &&
                        this._client.unpublish(this._trackManager.localSecondScreenAudioTrack);
                    this._trackManager.localSecondScreenVideoTrack &&
                        this._client.unpublish(this._trackManager.localSecondScreenVideoTrack);
                }
            }

            if (
                options.publishThirdScreenTrack !== undefined &&
                options.publishThirdScreenTrack !== this._publishThirdScreenTrack
            ) {
                this._publishThirdScreenTrack = options.publishThirdScreenTrack;
                if (this._publishThirdScreenTrack) {
                    this._trackManager.localThirdScreenAudioTrack &&
                        this._client.publish(this._trackManager.localThirdScreenAudioTrack);
                    this._trackManager.localThirdScreenVideoTrack &&
                        this._client.publish(this._trackManager.localThirdScreenVideoTrack);
                } else {
                    this._trackManager.localThirdScreenAudioTrack &&
                        this._client.unpublish(this._trackManager.localThirdScreenAudioTrack);
                    this._trackManager.localThirdScreenVideoTrack &&
                        this._client.unpublish(this._trackManager.localThirdScreenVideoTrack);
                }
            }

            if (
                options.publishFourthScreenTrack !== undefined &&
                options.publishFourthScreenTrack !== this._publishFourthScreenTrack
            ) {
                this._publishFourthScreenTrack = options.publishFourthScreenTrack;
                if (this._publishFourthScreenTrack) {
                    this._trackManager.localFourthScreenAudioTrack &&
                        this._client.publish(this._trackManager.localFourthScreenAudioTrack);
                    this._trackManager.localFourthScreenVideoTrack &&
                        this._client.publish(this._trackManager.localFourthScreenVideoTrack);
                } else {
                    this._trackManager.localFourthScreenAudioTrack &&
                        this._client.unpublish(this._trackManager.localFourthScreenAudioTrack);
                    this._trackManager.localFourthScreenVideoTrack &&
                        this._client.unpublish(this._trackManager.localFourthScreenVideoTrack);
                }
            }
        }

        if (this._rtcEngine.audioEnabled) {
            if (
                (options.publishCustomAudioTrackId !== undefined &&
                    options.publishCustomAudioTrackId !== this._publishCustomAudioTrackId) ||
                (options.publishCustomAudioTrack !== undefined &&
                    options.publishCustomAudioTrack !== this._publishCustomAudioTrack)
            ) {
                this._publishCustomAudioTrack = options.publishCustomAudioTrack;
                const customAudioTrack = this._trackManager.localCustomAudioTracks.get(
                    options.publishCustomAudioTrackId,
                );
                if (customAudioTrack) {
                    if (this._publishCustomAudioTrack) {
                        this._client.publish(customAudioTrack);
                    } else {
                        this._client.unpublish(customAudioTrack);
                    }
                }
            }
        }

        if (this._rtcEngine.videoEnabled) {
            if (
                options.publishCustomVideoTrack !== undefined &&
                options.publishCustomVideoTrack !== this._publishCustomVideoTrack
            ) {
                this._publishCustomVideoTrack = options.publishCustomVideoTrack;
                if (this._trackManager.localCustomVideoTrack) {
                    if (this._publishCustomVideoTrack) {
                        this._client.publish(this._trackManager.localCustomVideoTrack);
                    } else {
                        this._client.unpublish(this._trackManager.localCustomVideoTrack);
                    }
                }
            }
        }

        //not impl
        if (
            options.publishEncodedVideoTrack !== undefined &&
            options.publishEncodedVideoTrack !== this._publishEncodedVideoTrack
        ) {
            this._publishEncodedVideoTrack = options.publishEncodedVideoTrack;
        }

        if (this._rtcEngine.audioEnabled) {
            if (
                (options.publishMediaPlayerId !== undefined &&
                    options.publishMediaPlayerId !== this._publishMediaPlayerId) ||
                (options.publishMediaPlayerAudioTrack !== undefined &&
                    options.publishMediaPlayerAudioTrack !== this._publishMediaPlayerAudioTrack)
            ) {
                this._publishMediaPlayerAudioTrack = options.publishMediaPlayerAudioTrack;
                const mediaPlayer = this._rtcEngine.getMediaPlayerById(options.publishMediaPlayerId);
                if (mediaPlayer) {
                    mediaPlayer.publishAudio(this, this._publishMediaPlayerAudioTrack);
                }
            }
        }

        if (this._rtcEngine.videoEnabled) {
            if (
                (options.publishMediaPlayerId !== undefined &&
                    options.publishMediaPlayerId !== this._publishMediaPlayerId) ||
                (options.publishMediaPlayerVideoTrack !== undefined &&
                    options.publishMediaPlayerVideoTrack !== this._publishMediaPlayerVideoTrack)
            ) {
                this._publishMediaPlayerVideoTrack = options.publishMediaPlayerVideoTrack;
                const mediaPlayer = this._rtcEngine.getMediaPlayerById(options.publishMediaPlayerId);
                if (mediaPlayer) {
                    mediaPlayer.publishVideo(this, this._publishMediaPlayerVideoTrack);
                }
            }
        }

        //not impl
        if (
            options.publishTranscodedVideoTrack !== undefined &&
            options.publishTranscodedVideoTrack !== this._publishTranscodedVideoTrack
        ) {
            this._publishTranscodedVideoTrack = options.publishTranscodedVideoTrack;
        }

        //not impl
        if (
            options.publishTranscodedVideoTrack !== undefined &&
            options.publishTranscodedVideoTrack !== this._publishTranscodedVideoTrack
        ) {
            this._publishTranscodedVideoTrack = options.publishTranscodedVideoTrack;
        }

        //not impl
        if (
            options.publishMixedAudioTrack !== undefined &&
            options.publishMixedAudioTrack !== this._publishMixedAudioTrack
        ) {
            this._publishMixedAudioTrack = options.publishMixedAudioTrack;
        }

        //not impl
        if (options.publishLipSyncTrack !== undefined && options.publishLipSyncTrack !== this._publishLipSyncTrack) {
            this._publishLipSyncTrack = options.publishLipSyncTrack;
        }

        if (options.autoSubscribeAudio !== undefined && options.autoSubscribeAudio !== this._autoSubscribeAudio) {
            this._autoSubscribeAudio = options.autoSubscribeAudio;
            console.warn("autoSubscribeAudio is not supported in Agora Web SDK, only can set when you joinChannel.");
        }

        if (options.autoSubscribeVideo !== undefined && options.autoSubscribeVideo !== this._autoSubscribeVideo) {
            this._autoSubscribeVideo = options.autoSubscribeVideo;
            console.warn("autoSubscribeVideo is not supported in Agora Web SDK, only can set when you joinChannel.");
        }

        //not impl
        if (
            options.enableAudioRecordingOrPlayout !== undefined &&
            options.enableAudioRecordingOrPlayout !== this._enableAudioRecordingOrPlayout
        ) {
            this._enableAudioRecordingOrPlayout = options.enableAudioRecordingOrPlayout;
        }

        if (options.clientRoleType !== undefined && options.clientRoleType !== this._clientRoleType) {
            this._clientRoleType = options.clientRoleType;
            const role = this._clientRoleType === CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER ? "host" : "audience";
            await this.setClientRole(role as ClientRole);
        }

        //not impl
        if (options.audienceLatencyLevel !== undefined && options.audienceLatencyLevel !== this._audienceLatencyLevel) {
            this._audienceLatencyLevel = options.audienceLatencyLevel;
        }

        if (
            options.defaultVideoStreamType !== undefined &&
            options.defaultVideoStreamType !== this._defaultVideoStreamType
        ) {
            this._defaultVideoStreamType = options.defaultVideoStreamType;
            const streamType = this._defaultVideoStreamType === VIDEO_STREAM_TYPE.VIDEO_STREAM_LOW ? 1 : 0;
            await this.setRemoteDefaultVideoStreamType(streamType);
        }

        if (options.channelProfile !== undefined && options.channelProfile !== this._channelProfile) {
            this._channelProfile = options.channelProfile;
            console.warn(
                "channelProfile can only be set when you initialize the rtc engine, changing it in updateChannelMediaOptions will not take effect.",
            );
        }

        //not impl
        if (options.audioDelayMs !== undefined && options.audioDelayMs !== this._audioDelayMs) {
            this._audioDelayMs = options.audioDelayMs;
        }

        //not impl
        if (
            options.mediaPlayerAudioDelayMs !== undefined &&
            options.mediaPlayerAudioDelayMs !== this._mediaPlayerAudioDelayMs
        ) {
            this._mediaPlayerAudioDelayMs = options.mediaPlayerAudioDelayMs;
        }

        if (options.token !== undefined && options.token !== this._token) {
            this._token = options.token;
            await this.renewToken(this._token);
        }

        //not impl
        if (
            options.enableBuiltInMediaEncryption !== undefined &&
            options.enableBuiltInMediaEncryption !== this._enableBuiltInMediaEncryption
        ) {
            this._enableBuiltInMediaEncryption = options.enableBuiltInMediaEncryption;
        }

        //not impl
        if (
            options.publishRhythmPlayerTrack !== undefined &&
            options.publishRhythmPlayerTrack !== this._publishRhythmPlayerTrack
        ) {
            this._publishRhythmPlayerTrack = options.publishRhythmPlayerTrack;
        }

        //not impl
        if (
            options.isInteractiveAudience !== undefined &&
            options.isInteractiveAudience !== this._isInteractiveAudience
        ) {
            this._isInteractiveAudience = options.isInteractiveAudience;
        }

        //not impl
        if (options.customVideoTrackId !== undefined && options.customVideoTrackId !== this._customVideoTrackId) {
            this._customVideoTrackId = options.customVideoTrackId;
        }

        //not impl
        if (options.isAudioFilterable !== undefined && options.isAudioFilterable !== this._isAudioFilterable) {
            this._isAudioFilterable = options.isAudioFilterable;
        }

        //not impl
        if (options.parameters !== undefined) {
            this._parameters = options.parameters;
        }

        //not impl
        if (options.enableMultipath !== undefined && options.enableMultipath !== this._enableMultipath) {
            this._enableMultipath = options.enableMultipath;
        }

        //not impl
        if (options.uplinkMultipathMode !== undefined && options.uplinkMultipathMode !== this._uplinkMultipathMode) {
            this._uplinkMultipathMode = options.uplinkMultipathMode;
        }

        //not impl
        if (
            options.downlinkMultipathMode !== undefined &&
            options.downlinkMultipathMode !== this._downlinkMultipathMode
        ) {
            this._downlinkMultipathMode = options.downlinkMultipathMode;
        }

        //not impl
        if (options.preferMultipathType !== undefined && options.preferMultipathType !== this._preferMultipathType) {
            this._preferMultipathType = options.preferMultipathType;
        }

        return ERROR_CODE_TYPE.ERR_OK;
    }

    async muteLocalAudioStream(mute: boolean): Promise<number> {
        //ai todo
    }

    async muteLocalVideoStream(mute: boolean): Promise<number> {
        //ai todo
    }

    async muteAllRemoteAudioStreams(mute: boolean): Promise<number> {
        //ai todo
    }

    async muteRemoteAudioStream(uid: number, mute: boolean): Promise<number> {
        //ai todo
    }

    async muteAllRemoteVideoStreams(mute: boolean): Promise<number> {
        //ai todo
    }

    async muteRemoteVideoStream(uid: number, mute: boolean): Promise<number> {
        //ai todo
    }

    // ==================== TrackManager Proxy Methods ====================

    private _videoEncoderConfig: WebVideoEncoderConfiguration = undefined;

    async setVideoEncoderConfiguration(videoEncoderConfig: NativeVideoEncoderConfiguration): Promise<void> {
        this._videoEncoderConfig = Native2Web.VideoEncoderConfiguration(videoEncoderConfig);
        this._client.localTracks.forEach((track) => {
            if ("setEncoderConfiguration" in track) {
                (track as ICameraVideoTrack).setEncoderConfiguration(this._videoEncoderConfig);
            }
        });
    }

    async createLocalFirstCameraVideoTrack(): Promise<number> {
        return this._trackManager.createLocalFirstCameraVideoTrack(this._videoEncoderConfig);
    }

    async createLocalSecondCameraVideoTrack(): Promise<number> {
        return this._trackManager.createLocalSecondCameraVideoTrack(this._videoEncoderConfig);
    }

    async createLocalThirdCameraVideoTrack(): Promise<number> {
        return this._trackManager.createLocalThirdCameraVideoTrack(this._videoEncoderConfig);
    }

    async createLocalFourthCameraVideoTrack(): Promise<number> {
        return this._trackManager.createLocalFourthCameraVideoTrack(this._videoEncoderConfig);
    }

    async createLocalMicrophoneAudioTrack(): Promise<number> {
        return this._trackManager.createLocalMicrophoneAudioTrack();
    }

    async closeLocalMicrophoneAudioTrack(): Promise<number> {
        return this._trackManager.closeLocalMicrophoneAudioTrack();
    }

    async enableMicrophoneRecording(enabled: boolean): Promise<number> {
        return this._trackManager.enableMicrophoneRecording(enabled);
    }
}
