import type AgoraRTCType from "AgoraRTC";

const AgoraRTC = (globalThis as any).AgoraRTC as typeof AgoraRTCType;
const AgoraRTCExt = AgoraRTC as any;

export default AgoraRTC;

export type AREAS = import("AgoraRTC").AREAS;
export type AgoraRTCErrorCode = import("AgoraRTC").AgoraRTCErrorCode;
export type AudienceLatencyLevelType = import("AgoraRTC").AudienceLatencyLevelType;
export type ChannelMediaRelayError = import("AgoraRTC").ChannelMediaRelayError;
export type ChannelMediaRelayEvent = import("AgoraRTC").ChannelMediaRelayEvent;
export type ChannelMediaRelayState = import("AgoraRTC").ChannelMediaRelayState;
export type ClientConfig = import("AgoraRTC").ClientConfig;
export type ClientRole = import("AgoraRTC").ClientRole;
export type ClientRoleOptions = import("AgoraRTC").ClientRoleOptions;
export type ConnectionDisconnectedReason = import("AgoraRTC").ConnectionDisconnectedReason;
export type ConnectionState = import("AgoraRTC").ConnectionState;
export type DeviceInfo = import("AgoraRTC").DeviceInfo;
export type DeviceState = import("AgoraRTC").DeviceState;
export type EncryptionMode = import("AgoraRTC").EncryptionMode;
export type IAgoraRTCClient = import("AgoraRTC").IAgoraRTCClient;
export type IAgoraRTCError = import("AgoraRTC").IAgoraRTCError;
export type IAgoraRTCRemoteUser = import("AgoraRTC").IAgoraRTCRemoteUser;
export type ICameraVideoTrack = import("AgoraRTC").ICameraVideoTrack;
export type IChannelMediaRelayConfiguration = import("AgoraRTC").IChannelMediaRelayConfiguration;
export type ILocalAudioTrack = import("AgoraRTC").ILocalAudioTrack;
export type ILocalDataChannel = import("AgoraRTC").ILocalDataChannel;
export type ILocalTrack = import("AgoraRTC").ILocalTrack;
export type ILocalVideoTrack = import("AgoraRTC").ILocalVideoTrack;
export type IMicrophoneAudioTrack = import("AgoraRTC").IMicrophoneAudioTrack;
export type IRemoteVideoTrack = import("AgoraRTC").IRemoteVideoTrack;
export type LiveStreamingTranscodingConfig = import("AgoraRTC").LiveStreamingTranscodingConfig;
export type NetworkQuality = import("AgoraRTC").NetworkQuality;
export type RemoteStreamType = import("AgoraRTC").RemoteStreamType;
export type UID = import("AgoraRTC").UID;
export type VideoEncoderConfiguration = import("AgoraRTC").VideoEncoderConfiguration;

export const AREAS = AgoraRTCExt?.AREAS as typeof import("AgoraRTC").AREAS;
export const AgoraRTCErrorCode = AgoraRTCExt?.AgoraRTCErrorCode as typeof import("AgoraRTC").AgoraRTCErrorCode;
export const AudienceLatencyLevelType =
    AgoraRTCExt?.AudienceLatencyLevelType as typeof import("AgoraRTC").AudienceLatencyLevelType;
export const ChannelMediaRelayError =
    AgoraRTCExt?.ChannelMediaRelayError as typeof import("AgoraRTC").ChannelMediaRelayError;
export const ChannelMediaRelayEvent =
    AgoraRTCExt?.ChannelMediaRelayEvent as typeof import("AgoraRTC").ChannelMediaRelayEvent;
export const ChannelMediaRelayState =
    AgoraRTCExt?.ChannelMediaRelayState as typeof import("AgoraRTC").ChannelMediaRelayState;
export const ConnectionDisconnectedReason =
    AgoraRTCExt?.ConnectionDisconnectedReason as typeof import("AgoraRTC").ConnectionDisconnectedReason;
export const RemoteStreamType = AgoraRTCExt?.RemoteStreamType as typeof import("AgoraRTC").RemoteStreamType;
