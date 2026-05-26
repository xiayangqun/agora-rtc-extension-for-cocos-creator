#pragma once

#include <atomic>
#include <memory>

#include "IAgoraRtcEngineEx.h"

namespace se {
class Object;
}

namespace media = agora::media;
using agora::LICENSE_ERROR_TYPE;
using agora::VideoLayout;
using namespace agora::rtc;

class RtcEngineEventHandlerExBridge
    : public IRtcEngineEventHandlerEx,
      public std::enable_shared_from_this<RtcEngineEventHandlerExBridge> {
public:
    explicit RtcEngineEventHandlerExBridge(se::Object *eventHandler);
    ~RtcEngineEventHandlerExBridge() override;

    void invalidateCallbacks();
    bool canDispatchCallbacks() const;
    se::Object *eventHandler() const;

    // IRtcEngineEventHandler callbacks. These non-connection overloads are intentionally
    // kept as no-ops; TS dispatch only happens from the IRtcEngineEventHandlerEx overloads.
    const char* eventHandlerType() const override;
    void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override;
    void onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override;
    void onProxyConnected(const char* channel, uid_t uid, PROXY_TYPE proxyType, const char* localProxyIp, int elapsed) override;
    void onError(int err, const char* msg) override;
    void onAudioQuality(uid_t uid, int quality, unsigned short delay, unsigned short lost) override;
    void onLastmileProbeResult(const LastmileProbeResult& result) override;
    void onAudioVolumeIndication(const AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume) override;
    void onLeaveChannel(const RtcStats& stats) override;
    void onRtcStats(const RtcStats& stats) override;
    void onAudioDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) override;
    void onAudioMixingPositionChanged(int64_t position) override;
    void onAudioMixingFinished() override;
    void onAudioEffectFinished(int soundId) override;
    void onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) override;
    void onNetworkQuality(uid_t uid, int txQuality, int rxQuality) override;
    void onIntraRequestReceived() override;
    void onUplinkNetworkInfoUpdated(const UplinkNetworkInfo& info) override;
    void onLastmileQuality(int quality) override;
    void onFirstLocalVideoFrame(VIDEO_SOURCE_TYPE source, int width, int height, int elapsed) override;
    void onFirstLocalVideoFramePublished(VIDEO_SOURCE_TYPE source, int elapsed) override;
    void onFirstRemoteVideoDecoded(uid_t uid, int width, int height, int elapsed) override;
    void onVideoSizeChanged(VIDEO_SOURCE_TYPE sourceType, uid_t uid, int width, int height, int rotation) override;
    void onLocalVideoEvent(VIDEO_SOURCE_TYPE source, LOCAL_VIDEO_EVENT_TYPE event) override;
    void onLocalVideoStateChanged(VIDEO_SOURCE_TYPE source, LOCAL_VIDEO_STREAM_STATE state, LOCAL_VIDEO_STREAM_REASON reason) override;
    void onRemoteVideoStateChanged(uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) override;
    void onFirstRemoteVideoFrame(uid_t uid, int width, int height, int elapsed) override;
    void onUserJoined(uid_t uid, int elapsed) override;
    void onUserOffline(uid_t uid, USER_OFFLINE_REASON_TYPE reason) override;
    void onUserMuteAudio(uid_t uid, bool muted) override;
    void onUserMuteVideo(uid_t uid, bool muted) override;
    void onUserEnableVideo(uid_t uid, bool enabled) override;
    void onUserStateChanged(uid_t uid, REMOTE_USER_STATE state) override;
    void onUserEnableLocalVideo(uid_t uid, bool enabled) override;
    void onRemoteAudioStats(const RemoteAudioStats& stats) override;
    void onLocalAudioStats(const LocalAudioStats& stats) override;
    void onLocalVideoStats(VIDEO_SOURCE_TYPE source, const LocalVideoStats& stats) override;
    void onRemoteVideoStats(const RemoteVideoStats& stats) override;
    void onCameraReady() override;
    void onCameraFocusAreaChanged(int x, int y, int width, int height) override;
    void onCameraExposureAreaChanged(int x, int y, int width, int height) override;
    void onFacePositionChanged(int imageWidth, int imageHeight, const Rectangle* vecRectangle, const int* vecDistance, int numFaces);
    void onVideoStopped() override;
    void onAudioMixingStateChanged(AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_REASON_TYPE reason) override;
    void onRhythmPlayerStateChanged(RHYTHM_PLAYER_STATE_TYPE state, RHYTHM_PLAYER_REASON reason) override;
    void onConnectionLost() override;
    void onConnectionInterrupted() override;
    void onConnectionBanned() override;
    void onStreamMessage(uid_t uid, int streamId, const char* data, size_t length, uint64_t sentTs) override;
    void onStreamMessageError(uid_t uid, int streamId, int code, int missed, int cached) override;
    void onRdtMessage(uid_t userId, RdtStreamType type, const char *data, size_t length) override;
    void onRdtStateChanged(uid_t userId, RdtState state) override;
    void onMediaControlMessage(uid_t userId, const char* data, size_t length) override;
    void onRequestToken() override;
    void onTokenPrivilegeWillExpire(const char* token) override;
    void onLicenseValidationFailure(LICENSE_ERROR_TYPE error) override;
    void onFirstLocalAudioFramePublished(int elapsed) override;
    void onFirstRemoteAudioDecoded(uid_t uid, int elapsed) override;
    void onFirstRemoteAudioFrame(uid_t uid, int elapsed) override;
    void onLocalAudioStateChanged(LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_REASON reason) override;
    void onRemoteAudioStateChanged(uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) override;
    void onActiveSpeaker(uid_t uid) override;
    void onContentInspectResult(media::CONTENT_INSPECT_RESULT result) override;
    void onSnapshotTaken(uid_t uid, const char* filePath, int width, int height, int errCode) override;
    void onClientRoleChanged(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole, const ClientRoleOptions& newRoleOptions) override;
    void onClientRoleChangeFailed(CLIENT_ROLE_CHANGE_FAILED_REASON reason, CLIENT_ROLE_TYPE currentRole) override;
    void onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted) override;
    void onRtmpStreamingStateChanged(const char* url, RTMP_STREAM_PUBLISH_STATE state, RTMP_STREAM_PUBLISH_REASON reason) override;
    void onRtmpStreamingEvent(const char* url, RTMP_STREAMING_EVENT eventCode) override;
    void onTranscodingUpdated() override;
    void onAudioRoutingChanged(int routing) override;
    void onChannelMediaRelayStateChanged(int state, int code) override;
    void onRemoteSubscribeFallbackToAudioOnly(uid_t uid, bool isFallbackOrRecover) override;
    void onRemoteAudioTransportStats(uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) override;
    void onRemoteVideoTransportStats(uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) override;
    void onConnectionStateChanged(CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) override;
    void onNetworkTypeChanged(NETWORK_TYPE type) override;
    void onEncryptionError(ENCRYPTION_ERROR_TYPE errorType) override;
    void onPermissionError(PERMISSION_TYPE permissionType) override;
    void onPermissionGranted(agora::rtc::PERMISSION_TYPE permissionType);
    void onLocalUserRegistered(uid_t uid, const char* userAccount) override;
    void onUserInfoUpdated(uid_t uid, const agora::rtc::UserInfo& info) override;
    void onUserAccountUpdated(uid_t uid, const char* userAccount) override;
    void onVideoRenderingTracingResult(uid_t uid, MEDIA_TRACE_EVENT currentEvent, VideoRenderingTracingInfo tracingInfo) override;
    void onLocalVideoTranscoderError(const TranscodingVideoStream& stream, VIDEO_TRANSCODER_ERROR error) override;
    void onUploadLogResult(const char* requestId, bool success, UPLOAD_ERROR_REASON reason) override;
    void onAudioSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) override;
    void onVideoSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) override;
    void onAudioPublishStateChanged(const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState) override;
    void onVideoPublishStateChanged(VIDEO_SOURCE_TYPE source, const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState) override;
    void onTranscodedStreamLayoutInfo(uid_t uid, int width, int height, int layoutCount,const VideoLayout* layoutlist) override;
    void onAudioMetadataReceived(uid_t uid, const char* metadata, size_t length) override;
    void onExtensionEventWithContext(const ExtensionContext &context, const char* key, const char* value) override;
    void onExtensionStartedWithContext(const ExtensionContext &context) override;
    void onExtensionStoppedWithContext(const ExtensionContext &context) override;
    void onExtensionErrorWithContext(const ExtensionContext &context, int error, const char* message) override;
    void onSetRtmFlagResult(int code) override;
    void onMultipathStats(const MultipathStats& stats) override;
    void onRenewTokenResult(const char* token, RENEW_TOKEN_ERROR_CODE code) override;

    // IRtcEngineEventHandlerEx callbacks, in the same order as the Agora C++ SDK header.
    void onJoinChannelSuccess(const RtcConnection& connection, int elapsed) override;
    void onRejoinChannelSuccess(const RtcConnection& connection, int elapsed) override;
    void onAudioQuality(const RtcConnection& connection, uid_t remoteUid, int quality, unsigned short delay, unsigned short lost) override;
    void onAudioVolumeIndication(const RtcConnection& connection, const AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume) override;
    void onLeaveChannel(const RtcConnection& connection, const RtcStats& stats) override;
    void onRtcStats(const RtcConnection& connection, const RtcStats& stats) override;
    void onNetworkQuality(const RtcConnection& connection, uid_t remoteUid, int txQuality, int rxQuality) override;
    void onIntraRequestReceived(const RtcConnection& connection) override;
    void onFirstLocalVideoFramePublished(const RtcConnection& connection, int elapsed) override;
    void onFirstRemoteVideoDecoded(const RtcConnection& connection, uid_t remoteUid, int width, int height, int elapsed) override;
    void onVideoSizeChanged(const RtcConnection& connection, VIDEO_SOURCE_TYPE sourceType, uid_t uid, int width, int height, int rotation) override;
    void onRemoteVideoStateChanged(const RtcConnection& connection, uid_t remoteUid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) override;
    void onFirstRemoteVideoFrame(const RtcConnection& connection, uid_t remoteUid, int width, int height, int elapsed) override;
    void onUserJoined(const RtcConnection& connection, uid_t remoteUid, int elapsed) override;
    void onUserOffline(const RtcConnection& connection, uid_t remoteUid, USER_OFFLINE_REASON_TYPE reason) override;
    void onUserMuteAudio(const RtcConnection& connection, uid_t remoteUid, bool muted) override;
    void onUserMuteVideo(const RtcConnection& connection, uid_t remoteUid, bool muted) override;
    void onUserEnableVideo(const RtcConnection& connection, uid_t remoteUid, bool enabled) override;
    void onUserEnableLocalVideo(const RtcConnection& connection, uid_t remoteUid, bool enabled) override;
    void onUserStateChanged(const RtcConnection& connection, uid_t remoteUid, uint32_t state) override;
    void onLocalAudioStats(const RtcConnection& connection, const LocalAudioStats& stats) override;
    void onRemoteAudioStats(const RtcConnection& connection, const RemoteAudioStats& stats) override;
    void onLocalVideoStats(const RtcConnection& connection, VIDEO_SOURCE_TYPE sourceType, const LocalVideoStats& stats) override;
    void onRemoteVideoStats(const RtcConnection& connection, const RemoteVideoStats& stats) override;
    void onConnectionLost(const RtcConnection& connection) override;
    void onConnectionInterrupted(const RtcConnection& connection) override;
    void onConnectionBanned(const RtcConnection& connection) override;
    void onStreamMessage(const RtcConnection& connection, uid_t remoteUid, int streamId, const char* data, size_t length, uint64_t sentTs) override;
    void onStreamMessageError(const RtcConnection& connection, uid_t remoteUid, int streamId, int code, int missed, int cached) override;
    void onRdtMessage(const RtcConnection& connection, uid_t userId, RdtStreamType type, const char *data, size_t length) override;
    void onRdtStateChanged(const RtcConnection& connection, uid_t userId, RdtState state) override;
    void onMediaControlMessage(const RtcConnection& connection, uid_t userId, const char* data, size_t length) override;
    void onRequestToken(const RtcConnection& connection) override;
    void onLicenseValidationFailure(const RtcConnection& connection, LICENSE_ERROR_TYPE reason) override;
    void onTokenPrivilegeWillExpire(const RtcConnection& connection, const char* token) override;
    void onFirstLocalAudioFramePublished(const RtcConnection& connection, int elapsed) override;
    void onFirstRemoteAudioFrame(const RtcConnection& connection, uid_t userId, int elapsed) override;
    void onFirstRemoteAudioDecoded(const RtcConnection& connection, uid_t uid, int elapsed) override;
    void onLocalAudioStateChanged(const RtcConnection& connection, LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_REASON reason) override;
    void onRemoteAudioStateChanged(const RtcConnection& connection, uid_t remoteUid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) override;
    void onActiveSpeaker(const RtcConnection& connection, uid_t uid) override;
    void onClientRoleChanged(const RtcConnection& connection, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole, const ClientRoleOptions& newRoleOptions) override;
    void onClientRoleChangeFailed(const RtcConnection& connection, CLIENT_ROLE_CHANGE_FAILED_REASON reason, CLIENT_ROLE_TYPE currentRole) override;
    void onRemoteAudioTransportStats(const RtcConnection& connection, uid_t remoteUid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) override;
    void onRemoteVideoTransportStats(const RtcConnection& connection, uid_t remoteUid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) override;
    void onConnectionStateChanged(const RtcConnection& connection, CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) override;
    void onNetworkTypeChanged(const RtcConnection& connection, NETWORK_TYPE type) override;
    void onEncryptionError(const RtcConnection& connection, ENCRYPTION_ERROR_TYPE errorType) override;
    void onUploadLogResult(const RtcConnection& connection, const char* requestId, bool success, UPLOAD_ERROR_REASON reason) override;
    void onUserAccountUpdated(const RtcConnection& connection, uid_t remoteUid, const char* remoteUserAccount) override;
    void onSnapshotTaken(const RtcConnection& connection, uid_t uid, const char* filePath, int width, int height, int errCode) override;
    void onVideoRenderingTracingResult(const RtcConnection& connection, uid_t uid, MEDIA_TRACE_EVENT currentEvent, VideoRenderingTracingInfo tracingInfo) override;
    void onSetRtmFlagResult(const RtcConnection& connection, int code) override;
    void onTranscodedStreamLayoutInfo(const RtcConnection& connection, uid_t uid, int width, int height, int layoutCount,const VideoLayout* layoutlist) override;
    void onAudioMetadataReceived(const RtcConnection& connection, uid_t uid, const char* metadata, size_t length) override;
    void onMultipathStats(const RtcConnection& connection, const MultipathStats& stats) override;
    void onRenewTokenResult(const RtcConnection& connection, const char* token, RENEW_TOKEN_ERROR_CODE code) override;

private:
    se::Object *_eventHandler{nullptr};
    // Queued Cocos-thread callbacks capture shared_ptr<this>; release() must still
    // be able to stop those old tasks from calling the TS event handler.
    std::atomic_bool _callbacksEnabled{true};
};
