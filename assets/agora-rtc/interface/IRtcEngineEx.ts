import type { RtcConnection } from "../types/AgoraRtcEngineEx";
import type { ChannelMediaOptions, LeaveChannelOptions, STREAM_FALLBACK_OPTIONS } from "../types/AgoraRtcEngine";
import type {
    ChannelMediaRelayConfiguration,
    CONNECTION_STATE_TYPE,
    DataStreamConfig,
    EncryptionConfig,
    LiveTranscoding,
    RdtStreamType,
    SIMULCAST_STREAM_MODE,
    SimulcastConfig,
    SimulcastStreamConfig,
    SpatialAudioParams,
    UserInfo,
    VIDEO_MIRROR_MODE_TYPE,
    VIDEO_STREAM_TYPE,
    VideoCanvas,
    VideoEncoderConfiguration,
    VideoSubscriptionOptions,
    WatermarkConfig,
    WatermarkOptions,
} from "../types/AgoraBase";
import type { ContentInspectConfig, RENDER_MODE_TYPE, SnapshotConfig } from "../types/AgoraMediaBase";
import { IRtcEngine } from "./IRtcEngine";

export interface IRtcEngineEx extends IRtcEngine {
    setParametersEx(connection: RtcConnection, parameters: object): Promise<number>;

    joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): Promise<number>;

    leaveChannelEx(connection: RtcConnection): Promise<number>;

    leaveChannelEx(connection: RtcConnection, options: LeaveChannelOptions): Promise<number>;

    leaveChannelWithUserAccountEx(channelId: string, userAccount: string): Promise<number>;

    leaveChannelWithUserAccountEx(
        channelId: string,
        userAccount: string,
        options: LeaveChannelOptions,
    ): Promise<number>;

    updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): Promise<number>;

    setVideoEncoderConfigurationEx(config: VideoEncoderConfiguration, connection: RtcConnection): Promise<number>;

    setupRemoteVideoEx(
        canvas: VideoCanvas,
        connection: RtcConnection,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<number>;

    muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number>;

    muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): Promise<number>;

    setRemoteVideoStreamTypeEx(uid: number, streamType: VIDEO_STREAM_TYPE, connection: RtcConnection): Promise<number>;

    muteLocalAudioStreamEx(mute: boolean, connection: RtcConnection): Promise<number>;

    muteLocalVideoStreamEx(mute: boolean, connection: RtcConnection): Promise<number>;

    muteAllRemoteAudioStreamsEx(mute: boolean, connection: RtcConnection): Promise<number>;

    muteAllRemoteVideoStreamsEx(mute: boolean, connection: RtcConnection): Promise<number>;

    setSubscribeAudioBlocklistEx(uidList: number[], connection: RtcConnection): Promise<number>;

    setSubscribeAudioAllowlistEx(uidList: number[], connection: RtcConnection): Promise<number>;

    setSubscribeVideoBlocklistEx(uidList: number[], connection: RtcConnection): Promise<number>;

    setSubscribeVideoAllowlistEx(uidList: number[], connection: RtcConnection): Promise<number>;

    setRemoteVideoSubscriptionOptionsEx(
        uid: number,
        options: VideoSubscriptionOptions,
        connection: RtcConnection,
    ): Promise<number>;

    setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): Promise<number>;

    setRemoteUserSpatialAudioParamsEx(
        uid: number,
        params: SpatialAudioParams,
        connection: RtcConnection,
    ): Promise<number>;

    setRemoteRenderModeEx(
        uid: number,
        renderMode: RENDER_MODE_TYPE,
        mirrorMode: VIDEO_MIRROR_MODE_TYPE,
        connection: RtcConnection,
    ): Promise<number>;

    enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName: string): Promise<number>;

    adjustRecordingSignalVolumeEx(volume: number, connection: RtcConnection): Promise<number>;

    muteRecordingSignalEx(mute: boolean, connection: RtcConnection): Promise<number>;

    adjustUserPlaybackSignalVolumeEx(uid: number, volume: number, connection: RtcConnection): Promise<number>;

    getConnectionStateEx(connection: RtcConnection): Promise<CONNECTION_STATE_TYPE>;

    enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): Promise<number>;

    createDataStreamEx(
        reliable: boolean,
        ordered: boolean,
        connection: RtcConnection,
    ): Promise<{ streamId: number; errorCode: number }>;

    createDataStreamEx(
        config: DataStreamConfig,
        connection: RtcConnection,
    ): Promise<{ streamId: number; errorCode: number }>;

    sendStreamMessageEx(streamId: number, data: ArrayBuffer, connection: RtcConnection): Promise<number>;

    sendRdtMessageEx(uid: number, type: RdtStreamType, data: ArrayBuffer, connection: RtcConnection): Promise<number>;

    sendMediaControlMessageEx(uid: number, data: ArrayBuffer, connection: RtcConnection): Promise<number>;

    addVideoWatermarkEx(watermarkUrl: string, options: WatermarkOptions, connection: RtcConnection): Promise<number>;

    addVideoWatermarkEx(config: WatermarkConfig, connection: RtcConnection): Promise<number>;

    removeVideoWatermarkEx(id: string, connection: RtcConnection): Promise<number>;

    clearVideoWatermarkEx(connection: RtcConnection): Promise<number>;

    sendCustomReportMessageEx(
        id: string,
        category: string,
        event: string,
        label: string,
        value: number,
        connection: RtcConnection,
    ): Promise<number>;

    enableAudioVolumeIndicationEx(
        interval: number,
        smooth: number,
        reportVad: boolean,
        connection: RtcConnection,
    ): Promise<number>;

    startRtmpStreamWithoutTranscodingEx(url: string, connection: RtcConnection): Promise<number>;

    startRtmpStreamWithTranscodingEx(
        url: string,
        transcoding: LiveTranscoding,
        connection: RtcConnection,
    ): Promise<number>;

    updateRtmpTranscodingEx(transcoding: LiveTranscoding, connection: RtcConnection): Promise<number>;

    stopRtmpStreamEx(url: string, connection: RtcConnection): Promise<number>;

    startOrUpdateChannelMediaRelayEx(
        configuration: ChannelMediaRelayConfiguration,
        connection: RtcConnection,
    ): Promise<number>;

    stopChannelMediaRelayEx(connection: RtcConnection): Promise<number>;

    pauseAllChannelMediaRelayEx(connection: RtcConnection): Promise<number>;

    resumeAllChannelMediaRelayEx(connection: RtcConnection): Promise<number>;

    getUserInfoByUserAccountEx(
        userAccount: string,
        connection: RtcConnection,
    ): Promise<{ errorCode: number; userInfo: UserInfo }>;

    getUserInfoByUidEx(uid: number, connection: RtcConnection): Promise<{ errorCode: number; userInfo: UserInfo }>;

    enableDualStreamModeEx(
        enabled: boolean,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number>;

    setDualStreamModeEx(
        mode: SIMULCAST_STREAM_MODE,
        streamConfig: SimulcastStreamConfig,
        connection: RtcConnection,
    ): Promise<number>;

    setSimulcastConfigEx(simulcastConfig: SimulcastConfig, connection: RtcConnection): Promise<number>;

    setHighPriorityUserListEx(
        uidList: number[],
        uidNum: number,
        option: STREAM_FALLBACK_OPTIONS,
        connection: RtcConnection,
    ): Promise<number>;

    takeSnapshotEx(connection: RtcConnection, uid: number, filePath: string): Promise<number>;

    takeSnapshotEx(connection: RtcConnection, uid: number, config: SnapshotConfig): Promise<number>;

    enableContentInspectEx(enabled: boolean, config: ContentInspectConfig, connection: RtcConnection): Promise<number>;

    startMediaRenderingTracingEx(connection: RtcConnection): Promise<number>;

    setParametersEx(connection: RtcConnection, parameters: string): Promise<number>;

    getCallIdEx(connection: RtcConnection): Promise<{ callId: string; errorCode: number }>;

    sendAudioMetadataEx(connection: RtcConnection, metadata: ArrayBuffer): Promise<number>;

    preloadEffectEx(connection: RtcConnection, soundId: number, filePath: string, startPos: number): Promise<number>;

    playEffectEx(
        connection: RtcConnection,
        soundId: number,
        filePath: string,
        loopCount: number,
        pitch: number,
        pan: number,
        gain: number,
        publish: boolean,
        startPos: number,
    ): Promise<number>;
}
