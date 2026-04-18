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
} from "agora-rtc-sdk-ng";
import { RtcEngineWeb } from "./RtcEngineWeb";
import { Native2Web, Web2Native } from "./Helper";
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
} from "../../types/AgoraBase";
import { ChannelMediaOptions } from "../../types/AgoraRtcEngine";
import { ClientRequest } from "http";

export class AgoraRTCClientProxy {
    private _client!: IAgoraRTCClient;
    private _rtcEngine!: RtcEngineWeb;

    //local camera track
    _localFirstCameraTrack: ICameraVideoTrack = null;
    _localSecondCameraTrack: ICameraVideoTrack = null;
    _localThirdCameraTrack: ICameraVideoTrack = null;
    _localFourthCameraTrack: ICameraVideoTrack = null;

    constructor(config: ClientConfig, rtcEngineWeb: RtcEngineWeb) {
        this._client = AgoraRTC.createClient(config);
        this._rtcEngine = rtcEngineWeb;
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

    get connectionState(): ConnectionState {
        return this._client.connectionState;
    }

    get channelName(): string {
        return this._client.channelName || "";
    }

    get uid(): UID {
        return this._client.uid;
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

    // ==================== Publish / Subscribe ====================

    async publish(tracks: ILocalTrack | ILocalTrack[]): Promise<void>;
    async publish(config: any): Promise<ILocalDataChannel>;
    async publish(params: ILocalTrack | ILocalTrack[] | any): Promise<void | ILocalDataChannel> {
        return (this._client as any).publish(params);
    }

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
        return this._client.setRemoteVideoStreamType(uid, streamType);
    }

    async setRemoteDefaultVideoStreamType(streamType: RemoteStreamType): Promise<void> {
        return this._client.setRemoteDefaultVideoStreamType(streamType);
    }

    async setDualStreamMode(mode: number, streamParameter?: any): Promise<void> {
        return (this._client as any).setDualStreamMode(mode, streamParameter);
    }

    async setStreamFallbackOption(uid: UID, fallbackType: any): Promise<void> {
        return (this._client as any).setStreamFallbackOption(uid, fallbackType);
    }

    // ==================== Subscription Filters ====================

    setSubscribeAudioBlocklist(uidList: UID[]): void {
        (this._client as any).setSubscribeAudioBlocklist?.(uidList);
    }

    setSubscribeAudioAllowlist(uidList: UID[]): void {
        (this._client as any).setSubscribeAudioAllowlist?.(uidList);
    }

    setSubscribeVideoBlocklist(uidList: UID[]): void {
        (this._client as any).setSubscribeVideoBlocklist?.(uidList);
    }

    setSubscribeVideoAllowlist(uidList: UID[]): void {
        (this._client as any).setSubscribeVideoAllowlist?.(uidList);
    }

    // ==================== Volume ====================

    enableAudioVolumeIndicator(): void {
        this._client.enableAudioVolumeIndicator();
    }

    // ==================== Encryption ====================

    setEncryptionConfig(encryptionMode: string, secret: string, salt?: Uint8Array, encryptDataStream?: boolean): void {
        (this._client as any).setEncryptionConfig(encryptionMode, secret, salt, encryptDataStream);
    }

    // ==================== CDN Streaming ====================

    async startLiveStreaming(url: string, transcodingEnabled?: boolean): Promise<void> {
        return this._client.startLiveStreaming(url, transcodingEnabled);
    }

    async setLiveTranscoding(config: any): Promise<void> {
        return (this._client as any).setLiveTranscoding(config);
    }

    async stopLiveStreaming(url: string): Promise<void> {
        return this._client.stopLiveStreaming(url);
    }

    // ==================== Channel Media Relay ====================

    async startChannelMediaRelay(config: any): Promise<void> {
        return (this._client as any).startChannelMediaRelay(config);
    }

    async stopChannelMediaRelay(): Promise<void> {
        return this._client.stopChannelMediaRelay();
    }

    // ==================== Proxy ====================

    startProxyServer(mode?: number): void {
        this._client.startProxyServer(mode);
    }

    // ==================== Reporting ====================

    sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): void {
        (this._client as any).sendCustomReportMessage?.(id, category, event, label, value);
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
            this._rtcEngine.rtcEngineEventHandler?.onConnectionStateChanged(con, state, reason);
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
                if (!this._publishCameraTrack && this._localFirstCameraTrack) {
                    this._client.unpublish(this._localFirstCameraTrack);
                } else {
                    if (!this._localFirstCameraTrack) {
                        this.createLocalFirstCameraVideoTrack();
                    }
                    this._client.publish(this._localFirstCameraTrack);
                }
            }

            if (
                options.publishSecondaryCameraTrack !== undefined &&
                options.publishSecondaryCameraTrack !== this._publishSecondaryCameraTrack
            ) {
                this._publishSecondaryCameraTrack = options.publishSecondaryCameraTrack;
                if (!this._publishSecondaryCameraTrack && this._localSecondCameraTrack) {
                    this._client.unpublish(this._localSecondCameraTrack);
                } else {
                    if (!this._localSecondCameraTrack) {
                        console.warn("Secondary camera track is not created yet. call startCameraCapture first.");
                    }
                }
            }

            if (
                options.publishThirdCameraTrack !== undefined &&
                options.publishThirdCameraTrack !== this._publishThirdCameraTrack
            ) {
                this._publishThirdCameraTrack = options.publishThirdCameraTrack;
                if (!this._publishThirdCameraTrack && this._localThirdCameraTrack) {
                    this._client.unpublish(this._localThirdCameraTrack);
                } else {
                    if (!this._localThirdCameraTrack) {
                        console.warn("Third camera track is not created yet. call startCameraCapture first.");
                    }
                }
            }

            if (
                options.publishFourthCameraTrack !== undefined &&
                options.publishFourthCameraTrack !== this._publishFourthCameraTrack
            ) {
                this._publishFourthCameraTrack = options.publishFourthCameraTrack;
                if (!this._publishFourthCameraTrack && this._localFourthCameraTrack) {
                    this._client.unpublish(this._localFourthCameraTrack);
                } else {
                    if (!this._localFourthCameraTrack) {
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
                // no-op
            }
        }

        if (
            options.publishScreenCaptureAudio !== undefined &&
            options.publishScreenCaptureAudio !== this._publishScreenCaptureAudio
        ) {
            // no-op
        }

        if (
            options.publishScreenCaptureVideo !== undefined &&
            options.publishScreenCaptureVideo !== this._publishScreenCaptureVideo
        ) {
            // no-op
        }

        if (options.publishScreenTrack !== undefined && options.publishScreenTrack !== this._publishScreenTrack) {
            // no-op
        }

        if (
            options.publishSecondaryScreenTrack !== undefined &&
            options.publishSecondaryScreenTrack !== this._publishSecondaryScreenTrack
        ) {
            // no-op
        }

        if (
            options.publishThirdScreenTrack !== undefined &&
            options.publishThirdScreenTrack !== this._publishThirdScreenTrack
        ) {
            // no-op
        }

        if (
            options.publishFourthScreenTrack !== undefined &&
            options.publishFourthScreenTrack !== this._publishFourthScreenTrack
        ) {
            // no-op
        }

        if (
            options.publishCustomAudioTrack !== undefined &&
            options.publishCustomAudioTrack !== this._publishCustomAudioTrack
        ) {
            // no-op
        }

        if (
            options.publishCustomAudioTrackId !== undefined &&
            options.publishCustomAudioTrackId !== this._publishCustomAudioTrackId
        ) {
            // no-op
        }

        if (
            options.publishCustomVideoTrack !== undefined &&
            options.publishCustomVideoTrack !== this._publishCustomVideoTrack
        ) {
            // no-op
        }

        if (
            options.publishEncodedVideoTrack !== undefined &&
            options.publishEncodedVideoTrack !== this._publishEncodedVideoTrack
        ) {
            // no-op
        }

        if (
            options.publishMediaPlayerAudioTrack !== undefined &&
            options.publishMediaPlayerAudioTrack !== this._publishMediaPlayerAudioTrack
        ) {
            // no-op
        }

        if (
            options.publishMediaPlayerVideoTrack !== undefined &&
            options.publishMediaPlayerVideoTrack !== this._publishMediaPlayerVideoTrack
        ) {
            // no-op
        }

        if (
            options.publishTranscodedVideoTrack !== undefined &&
            options.publishTranscodedVideoTrack !== this._publishTranscodedVideoTrack
        ) {
            // no-op
        }

        if (
            options.publishMixedAudioTrack !== undefined &&
            options.publishMixedAudioTrack !== this._publishMixedAudioTrack
        ) {
            // no-op
        }

        if (options.publishLipSyncTrack !== undefined && options.publishLipSyncTrack !== this._publishLipSyncTrack) {
            // no-op
        }

        if (options.autoSubscribeAudio !== undefined && options.autoSubscribeAudio !== this._autoSubscribeAudio) {
            // no-op
        }

        if (options.autoSubscribeVideo !== undefined && options.autoSubscribeVideo !== this._autoSubscribeVideo) {
            // no-op
        }

        if (
            options.enableAudioRecordingOrPlayout !== undefined &&
            options.enableAudioRecordingOrPlayout !== this._enableAudioRecordingOrPlayout
        ) {
            // no-op
        }

        if (options.publishMediaPlayerId !== undefined && options.publishMediaPlayerId !== this._publishMediaPlayerId) {
            // no-op
        }

        if (options.clientRoleType !== undefined && options.clientRoleType !== this._clientRoleType) {
            // no-op
        }

        if (options.audienceLatencyLevel !== undefined && options.audienceLatencyLevel !== this._audienceLatencyLevel) {
            // no-op
        }

        if (
            options.defaultVideoStreamType !== undefined &&
            options.defaultVideoStreamType !== this._defaultVideoStreamType
        ) {
            // no-op
        }

        if (options.channelProfile !== undefined && options.channelProfile !== this._channelProfile) {
            // no-op
        }

        if (options.audioDelayMs !== undefined && options.audioDelayMs !== this._audioDelayMs) {
            // no-op
        }

        if (
            options.mediaPlayerAudioDelayMs !== undefined &&
            options.mediaPlayerAudioDelayMs !== this._mediaPlayerAudioDelayMs
        ) {
            // no-op
        }

        if (options.token !== undefined && options.token !== this._token) {
            // no-op
        }

        if (
            options.enableBuiltInMediaEncryption !== undefined &&
            options.enableBuiltInMediaEncryption !== this._enableBuiltInMediaEncryption
        ) {
            // no-op
        }

        if (
            options.publishRhythmPlayerTrack !== undefined &&
            options.publishRhythmPlayerTrack !== this._publishRhythmPlayerTrack
        ) {
            // no-op
        }

        if (
            options.isInteractiveAudience !== undefined &&
            options.isInteractiveAudience !== this._isInteractiveAudience
        ) {
            // no-op
        }

        if (options.customVideoTrackId !== undefined && options.customVideoTrackId !== this._customVideoTrackId) {
            // no-op
        }

        if (options.isAudioFilterable !== undefined && options.isAudioFilterable !== this._isAudioFilterable) {
            // no-op
        }

        if (options.parameters !== undefined && options.parameters !== this._parameters) {
            // no-op
        }

        if (options.enableMultipath !== undefined && options.enableMultipath !== this._enableMultipath) {
            // no-op
        }

        if (options.uplinkMultipathMode !== undefined && options.uplinkMultipathMode !== this._uplinkMultipathMode) {
            // no-op
        }

        if (
            options.downlinkMultipathMode !== undefined &&
            options.downlinkMultipathMode !== this._downlinkMultipathMode
        ) {
            // no-op
        }

        if (options.preferMultipathType !== undefined && options.preferMultipathType !== this._preferMultipathType) {
            // no-op
        }

        return ERR_OK;
    }

    _videoEncoderConfig: WebVideoEncoderConfiguration = undefined;
    public async setEncoderConfiguration(videoEncoderConfig: NativeVideoEncoderConfiguration): Promise<void> {
        this._videoEncoderConfig = Native2Web.VideoEncoderConfiguration(videoEncoderConfig);

        this._localFirstCameraTrack?.setEncoderConfiguration(this._videoEncoderConfig);
        this._localSecondCameraTrack?.setEncoderConfiguration(this._videoEncoderConfig);
        this._localThirdCameraTrack?.setEncoderConfiguration(this._videoEncoderConfig);
        this._localFourthCameraTrack?.setEncoderConfiguration(this._videoEncoderConfig);
    }

    async createLocalFirstCameraVideoTrack(): Promise<number> {
        this._localFirstCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: this._videoEncoderConfig,
            //todo other options
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }
}
