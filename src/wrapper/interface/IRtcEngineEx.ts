import type { RtcConnection } from '../types/AgoraRtcEngineEx';
import type { ChannelMediaOptions, LeaveChannelOptions, STREAM_FALLBACK_OPTIONS } from '../types/AgoraRtcEngine';
import type { ChannelMediaRelayConfiguration, CONNECTION_STATE_TYPE, DataStreamConfig, EncryptionConfig, LiveTranscoding, RdtStreamType, SIMULCAST_STREAM_MODE, SimulcastConfig, SimulcastStreamConfig, SpatialAudioParams, UserInfo, VIDEO_MIRROR_MODE_TYPE, VIDEO_STREAM_TYPE, VideoCanvas, VideoEncoderConfiguration, VideoSubscriptionOptions, WatermarkConfig, WatermarkOptions } from '../types/AgoraBase';
import type { ContentInspectConfig, RENDER_MODE_TYPE, SnapshotConfig } from '../types/AgoraMediaBase';
import { IRtcEngine } from './IRtcEngine';


export interface IRtcEngineEx extends IRtcEngine {
    setParametersEx(connection: RtcConnection, key: string, value: object): number;

    joinChannelEx(token: string, connection: RtcConnection, options: ChannelMediaOptions): number;

    leaveChannelEx(connection: RtcConnection): number;

    leaveChannelEx(connection: RtcConnection, options: LeaveChannelOptions): number;

    leaveChannelWithUserAccountEx(channelId: string, userAccount: string): number;

    leaveChannelWithUserAccountEx(channelId: string, userAccount: string, options: LeaveChannelOptions): number;

    updateChannelMediaOptionsEx(options: ChannelMediaOptions, connection: RtcConnection): number;

    setVideoEncoderConfigurationEx(config: VideoEncoderConfiguration, connection: RtcConnection): number;

    setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): number;

    muteRemoteAudioStreamEx(uid: number, mute: boolean, connection: RtcConnection): number;

    muteRemoteVideoStreamEx(uid: number, mute: boolean, connection: RtcConnection): number;

    setRemoteVideoStreamTypeEx(uid: number, streamType: VIDEO_STREAM_TYPE, connection: RtcConnection): number;

    muteLocalAudioStreamEx(mute: boolean, connection: RtcConnection): number;

    muteLocalVideoStreamEx(mute: boolean, connection: RtcConnection): number;

    muteAllRemoteAudioStreamsEx(mute: boolean, connection: RtcConnection): number;

    muteAllRemoteVideoStreamsEx(mute: boolean, connection: RtcConnection): number;

    setSubscribeAudioBlocklistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number;

    setSubscribeAudioAllowlistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number;

    setSubscribeVideoBlocklistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number;

    setSubscribeVideoAllowlistEx(uidList: number[], uidNumber: number, connection: RtcConnection): number;

    setRemoteVideoSubscriptionOptionsEx(uid: number, options: VideoSubscriptionOptions, connection: RtcConnection): number;

    setRemoteVoicePositionEx(uid: number, pan: number, gain: number, connection: RtcConnection): number;

    setRemoteUserSpatialAudioParamsEx(uid: number, @params: SpatialAudioParams, connection: RtcConnection): number;

    setRemoteRenderModeEx(uid: number, renderMode: RENDER_MODE_TYPE, mirrorMode: VIDEO_MIRROR_MODE_TYPE, connection: RtcConnection): number;

    enableLoopbackRecordingEx(connection: RtcConnection, enabled: boolean, deviceName: string): number;

    adjustRecordingSignalVolumeEx(volume: number, connection: RtcConnection): number;

    muteRecordingSignalEx(mute: boolean, connection: RtcConnection): number;

    adjustUserPlaybackSignalVolumeEx(uid: number, volume: number, connection: RtcConnection): number;

    getConnectionStateEx(connection: RtcConnection): CONNECTION_STATE_TYPE;

    enableEncryptionEx(connection: RtcConnection, enabled: boolean, config: EncryptionConfig): number;

    createDataStreamEx(streamId: number, reliable: boolean, ordered: boolean, connection: RtcConnection): number;

    createDataStreamEx(streamId: number, config: DataStreamConfig, connection: RtcConnection): number;

    sendStreamMessageEx(streamId: number, data: Uint8Array, length: number, connection: RtcConnection): number;

    sendRdtMessageEx(uid: number, type: RdtStreamType, data: string, length: number, connection: RtcConnection): number;

    sendMediaControlMessageEx(uid: number, data: string, length: number, connection: RtcConnection): number;

    addVideoWatermarkEx(watermarkUrl: string, options: WatermarkOptions, connection: RtcConnection): number;

    addVideoWatermarkEx(config: WatermarkConfig, connection: RtcConnection): number;

    removeVideoWatermarkEx(id: string, connection: RtcConnection): number;

    clearVideoWatermarkEx(connection: RtcConnection): number;

    sendCustomReportMessageEx(id: string, category: string, @event: string, label: string, value: number, connection: RtcConnection): number;

    enableAudioVolumeIndicationEx(interval: number, smooth: number, reportVad: boolean, connection: RtcConnection): number;

    startRtmpStreamWithoutTranscodingEx(url: string, connection: RtcConnection): number;

    startRtmpStreamWithTranscodingEx(url: string, transcoding: LiveTranscoding, connection: RtcConnection): number;

    updateRtmpTranscodingEx(transcoding: LiveTranscoding, connection: RtcConnection): number;

    stopRtmpStreamEx(url: string, connection: RtcConnection): number;

    startOrUpdateChannelMediaRelayEx(configuration: ChannelMediaRelayConfiguration, connection: RtcConnection): number;

    stopChannelMediaRelayEx(connection: RtcConnection): number;

    pauseAllChannelMediaRelayEx(connection: RtcConnection): number;

    resumeAllChannelMediaRelayEx(connection: RtcConnection): number;

    getUserInfoByUserAccountEx(userAccount: string, userInfo: UserInfo, connection: RtcConnection): number;

    getUserInfoByUidEx(uid: number, userInfo: UserInfo, connection: RtcConnection): number;

    enableDualStreamModeEx(enabled: boolean, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number;

    setDualStreamModeEx(mode: SIMULCAST_STREAM_MODE, streamConfig: SimulcastStreamConfig, connection: RtcConnection): number;

    setSimulcastConfigEx(simulcastConfig: SimulcastConfig, connection: RtcConnection): number;

    setHighPriorityUserListEx(uidList: number[], uidNum: number, option: STREAM_FALLBACK_OPTIONS, connection: RtcConnection): number;

    takeSnapshotEx(connection: RtcConnection, uid: number, filePath: string): number;

    takeSnapshotEx(connection: RtcConnection, uid: number, config: SnapshotConfig): number;

    enableContentInspectEx(enabled: boolean, config: ContentInspectConfig, connection: RtcConnection): number;

    startMediaRenderingTracingEx(connection: RtcConnection): number;

    setParametersEx(connection: RtcConnection, parameters: string): number;

    getCallIdEx(callId: string, connection: RtcConnection): number;

    sendAudioMetadataEx(connection: RtcConnection, metadata: Uint8Array, length: number): number;

    preloadEffectEx(connection: RtcConnection, soundId: number, filePath: string, startPos: number): number;

    playEffectEx(connection: RtcConnection, soundId: number, filePath: string, loopCount: number, pitch: number, pan: number, gain: number, publish: boolean, startPos: number): number;

}
