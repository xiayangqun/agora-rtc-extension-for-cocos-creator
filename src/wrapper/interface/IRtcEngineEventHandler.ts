import {
    LastmileProbeResult,
    UplinkNetworkInfo,
    LOCAL_VIDEO_EVENT_TYPE,
    LOCAL_VIDEO_STREAM_STATE,
    LOCAL_VIDEO_STREAM_REASON,
    RTMP_STREAM_PUBLISH_STATE,
    RTMP_STREAM_PUBLISH_REASON,
    RTMP_STREAMING_EVENT,
    PERMISSION_TYPE,
    TranscodingVideoStream,
    VIDEO_TRANSCODER_ERROR,
    STREAM_SUBSCRIBE_STATE,
    STREAM_PUBLISH_STATE,
    AudioVolumeInfo,
    RtcStats,
    REMOTE_VIDEO_STATE,
    REMOTE_VIDEO_STATE_REASON,
    USER_OFFLINE_REASON_TYPE,
    LocalAudioStats,
    RdtStreamType,
    RdtState,
    LICENSE_ERROR_TYPE,
    LOCAL_AUDIO_STREAM_STATE,
    LOCAL_AUDIO_STREAM_REASON,
    REMOTE_AUDIO_STATE,
    REMOTE_AUDIO_STATE_REASON,
    CLIENT_ROLE_TYPE,
    ClientRoleOptions,
    CLIENT_ROLE_CHANGE_FAILED_REASON,
    CONNECTION_STATE_TYPE,
    CONNECTION_CHANGED_REASON_TYPE,
    NETWORK_TYPE,
    ENCRYPTION_ERROR_TYPE,
    UPLOAD_ERROR_REASON,
    MEDIA_TRACE_EVENT,
    VideoRenderingTracingInfo,
    VideoLayout,
    MultipathStats,
    RENEW_TOKEN_ERROR_CODE,
    UserInfo,
    Rectangle,
} from "../types/AgoraBase";
import { VIDEO_SOURCE_TYPE, CONTENT_INSPECT_RESULT, ExtensionContext } from "../types/AgoraMediaBase";
import { RHYTHM_PLAYER_STATE_TYPE, RHYTHM_PLAYER_REASON } from "../types/AgoraRhythmPlayer";
import {
    PROXY_TYPE,
    MEDIA_DEVICE_TYPE,
    MEDIA_DEVICE_STATE_TYPE,
    AUDIO_MIXING_STATE_TYPE,
    AUDIO_MIXING_REASON_TYPE,
    RemoteAudioStats,
    LocalVideoStats,
    RemoteVideoStats,
    DIRECT_CDN_STREAMING_STATE,
    DIRECT_CDN_STREAMING_REASON,
    DirectCdnStreamingStats,
} from "../types/AgoraRtcEngine";
import { RtcConnection } from "../types/AgoraRtcEngineEx";

export abstract class IRtcEngineEventHandler {
    onProxyConnected(channel: string, uid: number, proxyType: PROXY_TYPE, localProxyIp: string, elapsed: number): void {}

    onError(err: number, msg: string): void {}

    onLastmileProbeResult(result: LastmileProbeResult): void {}

    onAudioDeviceStateChanged(deviceId: string, deviceType: MEDIA_DEVICE_TYPE, deviceState: MEDIA_DEVICE_STATE_TYPE): void {}

    onAudioMixingPositionChanged(position: number): void {}

    onAudioMixingFinished(): void {}

    onAudioEffectFinished(soundId: number): void {}

    onVideoDeviceStateChanged(deviceId: string, deviceType: MEDIA_DEVICE_TYPE, deviceState: MEDIA_DEVICE_STATE_TYPE): void {}

    onUplinkNetworkInfoUpdated(info: UplinkNetworkInfo): void {}

    onLastmileQuality(quality: number): void {}

    onFirstLocalVideoFrame(source: VIDEO_SOURCE_TYPE, width: number, height: number, elapsed: number): void {}

    onLocalVideoEvent(source: VIDEO_SOURCE_TYPE, event: LOCAL_VIDEO_EVENT_TYPE): void {}

    onLocalVideoStateChanged(source: VIDEO_SOURCE_TYPE, state: LOCAL_VIDEO_STREAM_STATE, reason: LOCAL_VIDEO_STREAM_REASON): void {}

    onCameraReady(): void {}

    onCameraFocusAreaChanged(x: number, y: number, width: number, height: number): void {}

    onCameraExposureAreaChanged(x: number, y: number, width: number, height: number): void {}

    onFacePositionChanged(imageWidth: number, imageHeight: number, vecRectangle: Rectangle[], vecDistance: number[], numFaces: number): void {}

    onVideoStopped(): void {}

    onAudioMixingStateChanged(state: AUDIO_MIXING_STATE_TYPE, reason: AUDIO_MIXING_REASON_TYPE): void {}

    onRhythmPlayerStateChanged(state: RHYTHM_PLAYER_STATE_TYPE, reason: RHYTHM_PLAYER_REASON): void {}

    onContentInspectResult(result: CONTENT_INSPECT_RESULT): void {}

    onAudioDeviceVolumeChanged(deviceType: MEDIA_DEVICE_TYPE, volume: number, muted: boolean): void {}

    onRtmpStreamingStateChanged(url: string, state: RTMP_STREAM_PUBLISH_STATE, reason: RTMP_STREAM_PUBLISH_REASON): void {}

    onRtmpStreamingEvent(url: string, eventCode: RTMP_STREAMING_EVENT): void {}

    onTranscodingUpdated(): void {}

    onAudioRoutingChanged(routing: number): void {}

    onChannelMediaRelayStateChanged(state: number, code: number): void {}

    onRemoteSubscribeFallbackToAudioOnly(uid: number, isFallbackOrRecover: boolean): void {}

    onPermissionError(permissionType: PERMISSION_TYPE): void {}

    onPermissionGranted(permissionType: PERMISSION_TYPE): void {}

    onLocalUserRegistered(uid: number, userAccount: string): void {}

    onUserInfoUpdated(uid: number, info: UserInfo): void {}

    onLocalVideoTranscoderError(stream: TranscodingVideoStream, error: VIDEO_TRANSCODER_ERROR): void {}

    onAudioSubscribeStateChanged(channel: string, uid: number, oldState: STREAM_SUBSCRIBE_STATE, newState: STREAM_SUBSCRIBE_STATE, elapseSinceLastState: number): void {}

    onVideoSubscribeStateChanged(channel: string, uid: number, oldState: STREAM_SUBSCRIBE_STATE, newState: STREAM_SUBSCRIBE_STATE, elapseSinceLastState: number): void {}

    onAudioPublishStateChanged(channel: string, oldState: STREAM_PUBLISH_STATE, newState: STREAM_PUBLISH_STATE, elapseSinceLastState: number): void {}

    onVideoPublishStateChanged(source: VIDEO_SOURCE_TYPE, channel: string, oldState: STREAM_PUBLISH_STATE, newState: STREAM_PUBLISH_STATE, elapseSinceLastState: number): void {}

    onExtensionEventWithContext(context: ExtensionContext, key: string, value: string): void {}

    onExtensionStartedWithContext(context: ExtensionContext): void {}

    onExtensionStoppedWithContext(context: ExtensionContext): void {}

    onExtensionErrorWithContext(context: ExtensionContext, error: number, message: string): void {}

    onJoinChannelSuccess(connection: RtcConnection, elapsed: number): void {}

    onRejoinChannelSuccess(connection: RtcConnection, elapsed: number): void {}

    onAudioQuality(connection: RtcConnection, remoteUid: number, quality: number, delay: number, lost: number): void {}

    onAudioVolumeIndication(connection: RtcConnection, speakers: AudioVolumeInfo[], speakerNumber: number, totalVolume: number): void {}

    onLeaveChannel(connection: RtcConnection, stats: RtcStats): void {}

    onRtcStats(connection: RtcConnection, stats: RtcStats): void {}

    onNetworkQuality(connection: RtcConnection, remoteUid: number, txQuality: number, rxQuality: number): void {}

    onIntraRequestReceived(connection: RtcConnection): void {}

    onFirstLocalVideoFramePublished(connection: RtcConnection, elapsed: number): void {}

    onFirstRemoteVideoDecoded(connection: RtcConnection, remoteUid: number, width: number, height: number, elapsed: number): void {}

    onVideoSizeChanged(connection: RtcConnection, sourceType: VIDEO_SOURCE_TYPE, uid: number, width: number, height: number, rotation: number): void {}

    onRemoteVideoStateChanged(connection: RtcConnection, remoteUid: number, state: REMOTE_VIDEO_STATE, reason: REMOTE_VIDEO_STATE_REASON, elapsed: number): void {}

    onFirstRemoteVideoFrame(connection: RtcConnection, remoteUid: number, width: number, height: number, elapsed: number): void {}

    onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number): void {}

    onUserOffline(connection: RtcConnection, remoteUid: number, reason: USER_OFFLINE_REASON_TYPE): void {}

    onUserMuteAudio(connection: RtcConnection, remoteUid: number, muted: boolean): void {}

    onUserMuteVideo(connection: RtcConnection, remoteUid: number, muted: boolean): void {}

    onUserEnableVideo(connection: RtcConnection, remoteUid: number, enabled: boolean): void {}

    onUserEnableLocalVideo(connection: RtcConnection, remoteUid: number, enabled: boolean): void {}

    onUserStateChanged(connection: RtcConnection, remoteUid: number, state: number): void {}

    onLocalAudioStats(connection: RtcConnection, stats: LocalAudioStats): void {}

    onRemoteAudioStats(connection: RtcConnection, stats: RemoteAudioStats): void {}

    onLocalVideoStats(connection: RtcConnection, sourceType: VIDEO_SOURCE_TYPE, stats: LocalVideoStats): void {}

    onRemoteVideoStats(connection: RtcConnection, stats: RemoteVideoStats): void {}

    onConnectionLost(connection: RtcConnection): void {}

    onConnectionInterrupted(connection: RtcConnection): void {}

    onConnectionBanned(connection: RtcConnection): void {}

    onStreamMessage(connection: RtcConnection, remoteUid: number, streamId: number, data: Uint8Array, length: number, sentTs: number): void {}

    onStreamMessageError(connection: RtcConnection, remoteUid: number, streamId: number, code: number, missed: number, cached: number): void {}

    onRdtMessage(connection: RtcConnection, userId: number, type: RdtStreamType, data: string, length: number): void {}

    onRdtStateChanged(connection: RtcConnection, userId: number, state: RdtState): void {}

    onMediaControlMessage(connection: RtcConnection, userId: number, data: string, length: number): void {}

    onRequestToken(connection: RtcConnection): void {}

    onLicenseValidationFailure(connection: RtcConnection, reason: LICENSE_ERROR_TYPE): void {}

    onTokenPrivilegeWillExpire(connection: RtcConnection, token: string): void {}

    onFirstLocalAudioFramePublished(connection: RtcConnection, elapsed: number): void {}

    onFirstRemoteAudioFrame(connection: RtcConnection, userId: number, elapsed: number): void {}

    onFirstRemoteAudioDecoded(connection: RtcConnection, uid: number, elapsed: number): void {}

    onLocalAudioStateChanged(connection: RtcConnection, state: LOCAL_AUDIO_STREAM_STATE, reason: LOCAL_AUDIO_STREAM_REASON): void {}

    onRemoteAudioStateChanged(connection: RtcConnection, remoteUid: number, state: REMOTE_AUDIO_STATE, reason: REMOTE_AUDIO_STATE_REASON, elapsed: number): void {}

    onActiveSpeaker(connection: RtcConnection, uid: number): void {}

    onClientRoleChanged(connection: RtcConnection, oldRole: CLIENT_ROLE_TYPE, newRole: CLIENT_ROLE_TYPE, newRoleOptions: ClientRoleOptions): void {}

    onClientRoleChangeFailed(connection: RtcConnection, reason: CLIENT_ROLE_CHANGE_FAILED_REASON, currentRole: CLIENT_ROLE_TYPE): void {}

    onRemoteAudioTransportStats(connection: RtcConnection, remoteUid: number, delay: number, lost: number, rxKBitRate: number): void {}

    onRemoteVideoTransportStats(connection: RtcConnection, remoteUid: number, delay: number, lost: number, rxKBitRate: number): void {}

    onConnectionStateChanged(connection: RtcConnection, state: CONNECTION_STATE_TYPE, reason: CONNECTION_CHANGED_REASON_TYPE): void {}

    onNetworkTypeChanged(connection: RtcConnection, type: NETWORK_TYPE): void {}

    onEncryptionError(connection: RtcConnection, errorType: ENCRYPTION_ERROR_TYPE): void {}

    onUploadLogResult(connection: RtcConnection, requestId: string, success: boolean, reason: UPLOAD_ERROR_REASON): void {}

    onUserAccountUpdated(connection: RtcConnection, remoteUid: number, remoteUserAccount: string): void {}

    onSnapshotTaken(connection: RtcConnection, uid: number, filePath: string, width: number, height: number, errCode: number): void {}

    onVideoRenderingTracingResult(connection: RtcConnection, uid: number, currentEvent: MEDIA_TRACE_EVENT, tracingInfo: VideoRenderingTracingInfo): void {}

    onSetRtmFlagResult(connection: RtcConnection, code: number): void {}

    onTranscodedStreamLayoutInfo(connection: RtcConnection, uid: number, width: number, height: number, layoutCount: number, layoutlist: VideoLayout[]): void {}

    onAudioMetadataReceived(connection: RtcConnection, uid: number, metadata: Uint8Array, length: number): void {}

    onMultipathStats(connection: RtcConnection, stats: MultipathStats): void {}

    onRenewTokenResult(connection: RtcConnection, token: string, code: RENEW_TOKEN_ERROR_CODE): void {}

    onDirectCdnStreamingStateChanged(state: DIRECT_CDN_STREAMING_STATE, reason: DIRECT_CDN_STREAMING_REASON, message: string): void {}

    onDirectCdnStreamingStats(stats: DirectCdnStreamingStats): void {}
}
