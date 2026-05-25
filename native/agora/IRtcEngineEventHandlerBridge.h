#pragma once

#include <memory>
#include <mutex>
#include <string>

#include "IAgoraRtcEngine.h"

namespace se {
class Object;
}

class IRtcEngineEventHandlerBridge
    : public agora::rtc::IRtcEngineEventHandler,
      public std::enable_shared_from_this<IRtcEngineEventHandlerBridge> {
public:
    explicit IRtcEngineEventHandlerBridge(se::Object *eventHandler);
    ~IRtcEngineEventHandlerBridge() override;

    // Priority callbacks (Phase 3)
    void onJoinChannelSuccess(const char *channel, agora::rtc::uid_t uid, int elapsed) override;
    void onUserJoined(agora::rtc::uid_t uid, int elapsed) override;
    void onUserOffline(agora::rtc::uid_t uid, agora::rtc::USER_OFFLINE_REASON_TYPE reason) override;
    void onConnectionStateChanged(
        agora::rtc::CONNECTION_STATE_TYPE state,
        agora::rtc::CONNECTION_CHANGED_REASON_TYPE reason) override;
    void onError(int err, const char *msg) override;
    void onLeaveChannel(const agora::rtc::RtcStats &stats) override;
    void onRejoinChannelSuccess(const char *channel, agora::rtc::uid_t uid, int elapsed) override;
    void onTokenPrivilegeWillExpire(const char *token) override;
    void onRequestToken() override;

    // Video callbacks
    void onFirstLocalVideoFrame(
        agora::rtc::VIDEO_SOURCE_TYPE source,
        int width, int height, int elapsed) override;
    void onFirstRemoteVideoDecoded(
        agora::rtc::uid_t uid, int width, int height, int elapsed) override;
    void onVideoSizeChanged(
        agora::rtc::VIDEO_SOURCE_TYPE sourceType, agora::rtc::uid_t uid,
        int width, int height, int rotation) override;
    void onRemoteVideoStateChanged(
        agora::rtc::uid_t uid, agora::rtc::REMOTE_VIDEO_STATE state,
        agora::rtc::REMOTE_VIDEO_STATE_REASON reason, int elapsed) override;

    // Audio callbacks
    void onAudioVolumeIndication(
        const agora::rtc::AudioVolumeInfo *speakers, unsigned int speakerNumber,
        int totalVolume) override;
    void onActiveSpeaker(agora::rtc::uid_t uid) override;
    void onFirstLocalAudioFramePublished(int elapsed) override;
    void onFirstRemoteAudioFrame(agora::rtc::uid_t uid, int elapsed) override;
    void onLocalAudioStateChanged(
        agora::rtc::LOCAL_AUDIO_STREAM_STATE state,
        agora::rtc::LOCAL_AUDIO_STREAM_REASON reason) override;
    void onRemoteAudioStateChanged(
        agora::rtc::uid_t uid, agora::rtc::REMOTE_AUDIO_STATE state,
        agora::rtc::REMOTE_AUDIO_STATE_REASON reason, int elapsed) override;

    // User mute callbacks
    void onUserMuteAudio(agora::rtc::uid_t uid, bool muted) override;
    void onUserMuteVideo(agora::rtc::uid_t uid, bool muted) override;

    // Network / quality callbacks
    void onRtcStats(const agora::rtc::RtcStats &stats) override;
    void onNetworkQuality(
        agora::rtc::uid_t uid, int txQuality, int rxQuality) override;
    void onLastmileQuality(int quality) override;
    void onNetworkTypeChanged(agora::rtc::NETWORK_TYPE type) override;

    // Stream message
    void onStreamMessage(
        agora::rtc::uid_t uid, int streamId,
        const char *data, size_t length, uint64_t sentTs) override;

    // Client role
    void onClientRoleChanged(
        agora::rtc::CLIENT_ROLE_TYPE oldRole,
        agora::rtc::CLIENT_ROLE_TYPE newRole,
        const agora::rtc::ClientRoleOptions &newRoleOptions) override;

    // Local user
    void onLocalUserRegistered(agora::rtc::uid_t uid, const char *userAccount) override;
    void onUserInfoUpdated(agora::rtc::uid_t uid, const agora::rtc::UserInfo &info) override;

    // Camera
    void onCameraReady() override;
    void onCameraFocusAreaChanged(int x, int y, int width, int height) override;

    // Audio routing
    void onAudioRoutingChanged(int routing) override;

    // Permission
    void onPermissionError(agora::rtc::PERMISSION_TYPE permissionType) override;

    // Audio device
    void onAudioDeviceStateChanged(
        const char *deviceId, int deviceType, int deviceState) override;

    // Video device
    void onVideoDeviceStateChanged(
        const char *deviceId, int deviceType, int deviceState) override;

    // Local video stats
    void onLocalVideoStats(
        agora::rtc::VIDEO_SOURCE_TYPE source,
        const agora::rtc::LocalVideoStats &stats) override;

    // Remote video stats
    void onRemoteVideoStats(const agora::rtc::RemoteVideoStats &stats) override;

    // Remote audio stats
    void onRemoteAudioStats(const agora::rtc::RemoteAudioStats &stats) override;

    // Audio mixing
    void onAudioMixingFinished() override;
    void onAudioMixingStateChanged(
        agora::rtc::AUDIO_MIXING_STATE_TYPE state,
        agora::rtc::AUDIO_MIXING_REASON_TYPE reason) override;

    // Audio effect
    void onAudioEffectFinished(int soundId) override;

    // Uplink
    void onUplinkNetworkInfoUpdated(const agora::rtc::UplinkNetworkInfo &info) override;

    // Encryption
    void onEncryptionError(agora::rtc::ENCRYPTION_ERROR_TYPE errorType) override;

    // Upload log
    void onUploadLogResult(const char *requestId, bool success,
        agora::rtc::UPLOAD_ERROR_REASON reason) override;

    // Subscription state
    void onAudioSubscribeStateChanged(
        const char *channel, agora::rtc::uid_t uid,
        agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
        agora::rtc::STREAM_SUBSCRIBE_STATE newState,
        int elapseSinceLastState) override;
    void onVideoSubscribeStateChanged(
        const char *channel, agora::rtc::uid_t uid,
        agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
        agora::rtc::STREAM_SUBSCRIBE_STATE newState,
        int elapseSinceLastState) override;

    // Publish state
    void onAudioPublishStateChanged(
        const char *channel,
        agora::rtc::STREAM_PUBLISH_STATE oldState,
        agora::rtc::STREAM_PUBLISH_STATE newState,
        int elapseSinceLastState) override;
    void onVideoPublishStateChanged(
        agora::rtc::VIDEO_SOURCE_TYPE source, const char *channel,
        agora::rtc::STREAM_PUBLISH_STATE oldState,
        agora::rtc::STREAM_PUBLISH_STATE newState,
        int elapseSinceLastState) override;

    // Others
    void onSnapshotTaken(
        agora::rtc::uid_t uid, const char *filePath,
        int width, int height, int errCode) override;

private:
    se::Object *_eventHandler{nullptr};
    std::mutex _connectionMutex;
    std::string _channelId;
    agora::rtc::uid_t _localUid{0};
};
