/****************************************************************************
 JSB trigger event functions bound to jsb.agora.test namespace.
 These functions trigger mock callbacks with fixed parameters for testing.
 All parameters are constructed in C++ with fixed values:
   - string → "agora"
   - number → 2
   - bool → true
   - struct → recursively apply same rules
   - array → length 2 (unless fixed-size)
 ****************************************************************************/

#include "SeApi.h"
#include "MockIRtcEngineEx.h"

namespace {

static inline agora::rtc::MockIRtcEngineEx& mock() {
    return agora::rtc::MockIRtcEngineEx::instance();
}

static inline agora::rtc::IRtcEngineEventHandlerEx* exHandler() {
    return dynamic_cast<agora::rtc::IRtcEngineEventHandlerEx*>(mock().eventHandler);
}

static inline agora::rtc::RtcConnection makeConn() {
    agora::rtc::RtcConnection conn;
    conn.channelId = "agora";
    conn.localUid = 2;
    return conn;
}

// ============================================================================
// Overloaded functions (use Ex version with RtcConnection)
// ============================================================================

static bool js_trigger_onJoinChannelSuccess(se::State &s) {
    auto *h = exHandler();
    if (h) h->onJoinChannelSuccess(makeConn(), 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onJoinChannelSuccess)

static bool js_trigger_onRejoinChannelSuccess(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRejoinChannelSuccess(makeConn(), 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onRejoinChannelSuccess)

static bool js_trigger_onLeaveChannel(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::RtcStats stats{};
        stats.duration = 2;
        stats.txBytes = 2;
        stats.rxBytes = 2;
        stats.txAudioBytes = 2;
        stats.rxAudioBytes = 2;
        stats.txVideoBytes = 2;
        stats.rxVideoBytes = 2;
        stats.txKBitRate = 2;
        stats.rxKBitRate = 2;
        stats.rxAudioKBitRate = 2;
        stats.txAudioKBitRate = 2;
        stats.rxVideoKBitRate = 2;
        stats.txVideoKBitRate = 2;
        stats.lastmileDelay = 2;
        stats.txPacketLossRate = 2;
        stats.rxPacketLossRate = 2;
        stats.userCount = 2;
        stats.cpuAppUsage = 2.0;
        stats.cpuTotalUsage = 2.0;
        stats.gatewayRtt = 2;
        stats.memoryAppUsageRatio = 2.0;
        stats.memoryTotalUsageRatio = 2.0;
        stats.memoryAppUsageInKbytes = 2;
        h->onLeaveChannel(makeConn(), stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onLeaveChannel)

static bool js_trigger_onUserJoined(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserJoined(makeConn(), 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserJoined)

static bool js_trigger_onUserOffline(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserOffline(makeConn(), 2, agora::rtc::USER_OFFLINE_QUIT);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserOffline)

static bool js_trigger_onConnectionLost(se::State &s) {
    auto *h = exHandler();
    if (h) h->onConnectionLost(makeConn());
    return true;
}
SE_BIND_FUNC(js_trigger_onConnectionLost)

static bool js_trigger_onConnectionInterrupted(se::State &s) {
    auto *h = exHandler();
    if (h) h->onConnectionInterrupted(makeConn());
    return true;
}
SE_BIND_FUNC(js_trigger_onConnectionInterrupted)

static bool js_trigger_onConnectionBanned(se::State &s) {
    auto *h = exHandler();
    if (h) h->onConnectionBanned(makeConn());
    return true;
}
SE_BIND_FUNC(js_trigger_onConnectionBanned)

static bool js_trigger_onTokenPrivilegeWillExpire(se::State &s) {
    auto *h = exHandler();
    if (h) h->onTokenPrivilegeWillExpire(makeConn(), "agora");
    return true;
}
SE_BIND_FUNC(js_trigger_onTokenPrivilegeWillExpire)

static bool js_trigger_onRequestToken(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRequestToken(makeConn());
    return true;
}
SE_BIND_FUNC(js_trigger_onRequestToken)

static bool js_trigger_onLicenseValidationFailure(se::State &s) {
    auto *h = exHandler();
    if (h) h->onLicenseValidationFailure(makeConn(), agora::LICENSE_ERR_INVALID);
    return true;
}
SE_BIND_FUNC(js_trigger_onLicenseValidationFailure)

static bool js_trigger_onAudioQuality(se::State &s) {
    auto *h = exHandler();
    if (h) h->onAudioQuality(makeConn(), 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioQuality)

static bool js_trigger_onRtcStats(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::RtcStats stats{};
        stats.duration = 2;
        stats.txBytes = 2;
        stats.rxBytes = 2;
        stats.userCount = 2;
        h->onRtcStats(makeConn(), stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onRtcStats)

static bool js_trigger_onNetworkQuality(se::State &s) {
    auto *h = exHandler();
    if (h) h->onNetworkQuality(makeConn(), 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onNetworkQuality)

static bool js_trigger_onIntraRequestReceived(se::State &s) {
    auto *h = exHandler();
    if (h) h->onIntraRequestReceived(makeConn());
    return true;
}
SE_BIND_FUNC(js_trigger_onIntraRequestReceived)

static bool js_trigger_onFirstLocalVideoFramePublished(se::State &s) {
    auto *h = exHandler();
    if (h) h->onFirstLocalVideoFramePublished(makeConn(), 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstLocalVideoFramePublished)

static bool js_trigger_onFirstRemoteVideoDecoded(se::State &s) {
    auto *h = exHandler();
    if (h) h->onFirstRemoteVideoDecoded(makeConn(), 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstRemoteVideoDecoded)

static bool js_trigger_onVideoSizeChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onVideoSizeChanged(makeConn(), agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY, 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onVideoSizeChanged)

static bool js_trigger_onRemoteVideoStateChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRemoteVideoStateChanged(makeConn(), 2, agora::rtc::REMOTE_VIDEO_STATE_STARTING, agora::rtc::REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteVideoStateChanged)

static bool js_trigger_onFirstRemoteVideoFrame(se::State &s) {
    auto *h = exHandler();
    if (h) h->onFirstRemoteVideoFrame(makeConn(), 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstRemoteVideoFrame)

static bool js_trigger_onUserMuteAudio(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserMuteAudio(makeConn(), 2, true);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserMuteAudio)

static bool js_trigger_onUserMuteVideo(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserMuteVideo(makeConn(), 2, true);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserMuteVideo)

static bool js_trigger_onUserEnableVideo(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserEnableVideo(makeConn(), 2, true);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserEnableVideo)

static bool js_trigger_onUserEnableLocalVideo(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserEnableLocalVideo(makeConn(), 2, true);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserEnableLocalVideo)

static bool js_trigger_onUserStateChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserStateChanged(makeConn(), 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onUserStateChanged)

static bool js_trigger_onLocalAudioStats(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::LocalAudioStats stats{};
        stats.numChannels = 2;
        stats.sentSampleRate = 2;
        stats.sentBitrate = 2;
        stats.internalCodec = 2;
        stats.txPacketLossRate = 2;
        stats.audioDeviceDelay = 2;
        h->onLocalAudioStats(makeConn(), stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalAudioStats)

static bool js_trigger_onRemoteAudioStats(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::RemoteAudioStats stats{};
        stats.uid = 2;
        stats.quality = 2;
        stats.networkTransportDelay = 2;
        stats.jitterBufferDelay = 2;
        stats.audioLossRate = 2;
        stats.numChannels = 2;
        stats.receivedSampleRate = 2;
        stats.receivedBitrate = 2;
        stats.totalFrozenTime = 2;
        stats.frozenRate = 2;
        stats.totalActiveTime = 2;
        stats.publishDuration = 2;
        h->onRemoteAudioStats(makeConn(), stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteAudioStats)

static bool js_trigger_onLocalVideoStats(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::LocalVideoStats stats{};
        stats.sentBitrate = 2;
        stats.sentFrameRate = 2;
        stats.encoderOutputFrameRate = 2;
        stats.rendererOutputFrameRate = 2;
        stats.targetBitrate = 2;
        stats.targetFrameRate = 2;
        stats.qualityAdaptIndication = agora::rtc::ADAPT_NONE;
        stats.encodedBitrate = 2;
        stats.encodedFrameWidth = 2;
        stats.encodedFrameHeight = 2;
        stats.encodedFrameCount = 2;
        stats.codecType = agora::rtc::VIDEO_CODEC_H264;
        stats.txPacketLossRate = 2;
        stats.captureFrameRate = 2;
        stats.captureBrightnessLevel = agora::rtc::CAPTURE_BRIGHTNESS_LEVEL_NORMAL;
        stats.hwEncoderAccelerating = 2;
        h->onLocalVideoStats(makeConn(), agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY, stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalVideoStats)

static bool js_trigger_onRemoteVideoStats(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::RemoteVideoStats stats{};
        stats.uid = 2;
        stats.delay = 2;
        stats.width = 2;
        stats.height = 2;
        stats.receivedBitrate = 2;
        stats.decoderOutputFrameRate = 2;
        stats.rendererOutputFrameRate = 2;
        stats.packetLossRate = 2;
        stats.rxStreamType = agora::rtc::VIDEO_STREAM_HIGH;
        stats.totalFrozenTime = 2;
        stats.frozenRate = 2;
        stats.totalActiveTime = 2;
        stats.publishDuration = 2;
        stats.mosValue = 2;
        h->onRemoteVideoStats(makeConn(), stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteVideoStats)

static bool js_trigger_onStreamMessage(se::State &s) {
    auto *h = exHandler();
    if (h) h->onStreamMessage(makeConn(), 2, 2, "agora", 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onStreamMessage)

static bool js_trigger_onStreamMessageError(se::State &s) {
    auto *h = exHandler();
    if (h) h->onStreamMessageError(makeConn(), 2, 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onStreamMessageError)

static bool js_trigger_onRdtMessage(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRdtMessage(makeConn(), 2, agora::rtc::RDT_STREAM_DATA, "agora", 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onRdtMessage)

static bool js_trigger_onRdtStateChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRdtStateChanged(makeConn(), 2, agora::rtc::RDT_STATE_OPENED);
    return true;
}
SE_BIND_FUNC(js_trigger_onRdtStateChanged)

static bool js_trigger_onMediaControlMessage(se::State &s) {
    auto *h = exHandler();
    if (h) h->onMediaControlMessage(makeConn(), 2, "agora", 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onMediaControlMessage)

static bool js_trigger_onFirstLocalAudioFramePublished(se::State &s) {
    auto *h = exHandler();
    if (h) h->onFirstLocalAudioFramePublished(makeConn(), 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstLocalAudioFramePublished)

static bool js_trigger_onFirstRemoteAudioFrame(se::State &s) {
    auto *h = exHandler();
    if (h) h->onFirstRemoteAudioFrame(makeConn(), 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstRemoteAudioFrame)

static bool js_trigger_onFirstRemoteAudioDecoded(se::State &s) {
    auto *h = exHandler();
    if (h) h->onFirstRemoteAudioDecoded(makeConn(), 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstRemoteAudioDecoded)

static bool js_trigger_onLocalAudioStateChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onLocalAudioStateChanged(makeConn(), agora::rtc::LOCAL_AUDIO_STREAM_STATE_STOPPED, agora::rtc::LOCAL_AUDIO_STREAM_REASON_OK);
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalAudioStateChanged)

static bool js_trigger_onRemoteAudioStateChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRemoteAudioStateChanged(makeConn(), 2, agora::rtc::REMOTE_AUDIO_STATE_STARTING, agora::rtc::REMOTE_AUDIO_REASON_REMOTE_MUTED, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteAudioStateChanged)

static bool js_trigger_onActiveSpeaker(se::State &s) {
    auto *h = exHandler();
    if (h) h->onActiveSpeaker(makeConn(), 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onActiveSpeaker)

static bool js_trigger_onClientRoleChanged(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::ClientRoleOptions options;
        options.audienceLatencyLevel = agora::rtc::AUDIENCE_LATENCY_LEVEL_LOW_LATENCY;
        h->onClientRoleChanged(makeConn(), agora::rtc::CLIENT_ROLE_BROADCASTER, agora::rtc::CLIENT_ROLE_AUDIENCE, options);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onClientRoleChanged)

static bool js_trigger_onClientRoleChangeFailed(se::State &s) {
    auto *h = exHandler();
    if (h) h->onClientRoleChangeFailed(makeConn(), agora::rtc::CLIENT_ROLE_CHANGE_FAILED_TOO_MANY_BROADCASTERS, agora::rtc::CLIENT_ROLE_AUDIENCE);
    return true;
}
SE_BIND_FUNC(js_trigger_onClientRoleChangeFailed)

static bool js_trigger_onNetworkTypeChanged(se::State &s) {
    auto *h = exHandler();
    if (h) h->onNetworkTypeChanged(makeConn(), agora::rtc::NETWORK_TYPE_LAN);
    return true;
}
SE_BIND_FUNC(js_trigger_onNetworkTypeChanged)

static bool js_trigger_onEncryptionError(se::State &s) {
    auto *h = exHandler();
    if (h) h->onEncryptionError(makeConn(), agora::rtc::ENCRYPTION_ERROR_INTERNAL_FAILURE);
    return true;
}
SE_BIND_FUNC(js_trigger_onEncryptionError)

static bool js_trigger_onUploadLogResult(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUploadLogResult(makeConn(), "agora", true, agora::rtc::UPLOAD_SUCCESS);
    return true;
}
SE_BIND_FUNC(js_trigger_onUploadLogResult)

static bool js_trigger_onUserAccountUpdated(se::State &s) {
    auto *h = exHandler();
    if (h) h->onUserAccountUpdated(makeConn(), 2, "agora");
    return true;
}
SE_BIND_FUNC(js_trigger_onUserAccountUpdated)

static bool js_trigger_onSnapshotTaken(se::State &s) {
    auto *h = exHandler();
    if (h) h->onSnapshotTaken(makeConn(), 2, "agora", 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onSnapshotTaken)

static bool js_trigger_onVideoRenderingTracingResult(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::VideoRenderingTracingInfo info;
        info.elapsedTime = 2;
        info.start2JoinChannel = 2;
        info.join2JoinSuccess = 2;
        info.joinSuccess2RemoteJoined = 2;
        info.remoteJoined2SetView = 2;
        info.remoteJoined2UnmuteVideo = 2;
        info.remoteJoined2PacketReceived = 2;
        h->onVideoRenderingTracingResult(makeConn(), 2, agora::rtc::MEDIA_TRACE_EVENT_VIDEO_RENDERED, info);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onVideoRenderingTracingResult)

static bool js_trigger_onSetRtmFlagResult(se::State &s) {
    auto *h = exHandler();
    if (h) h->onSetRtmFlagResult(makeConn(), 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onSetRtmFlagResult)

static bool js_trigger_onTranscodedStreamLayoutInfo(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::VideoLayout layouts[2];
        layouts[0].channelId = "agora";
        layouts[0].uid = 2;
        layouts[0].width = 2;
        layouts[0].height = 2;
        layouts[1].channelId = "agora";
        layouts[1].uid = 3;
        layouts[1].width = 2;
        layouts[1].height = 2;
        h->onTranscodedStreamLayoutInfo(makeConn(), 2, 2, 2, 2, layouts);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onTranscodedStreamLayoutInfo)

static bool js_trigger_onAudioMetadataReceived(se::State &s) {
    auto *h = exHandler();
    if (h) h->onAudioMetadataReceived(makeConn(), 2, "agora", 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioMetadataReceived)

static bool js_trigger_onMultipathStats(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::MultipathStats stats{};
        h->onMultipathStats(makeConn(), stats);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onMultipathStats)

static bool js_trigger_onRenewTokenResult(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRenewTokenResult(makeConn(), "agora", agora::rtc::RENEW_TOKEN_TOKEN_EXPIRED);
    return true;
}
SE_BIND_FUNC(js_trigger_onRenewTokenResult)

// ============================================================================
// Non-overloaded functions (trigger directly)
// ============================================================================

static bool js_trigger_onError(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onError(2, "agora");
    return true;
}
SE_BIND_FUNC(js_trigger_onError)

static bool js_trigger_onAudioDeviceStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioDeviceStateChanged("agora", 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioDeviceStateChanged)

static bool js_trigger_onAudioDeviceVolumeChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioDeviceVolumeChanged(agora::rtc::AUDIO_PLAYOUT_DEVICE, 2, true);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioDeviceVolumeChanged)

static bool js_trigger_onAudioEffectFinished(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioEffectFinished(2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioEffectFinished)

static bool js_trigger_onAudioMixingPositionChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioMixingPositionChanged(2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioMixingPositionChanged)

static bool js_trigger_onAudioMixingFinished(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioMixingFinished();
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioMixingFinished)

static bool js_trigger_onAudioMixingStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioMixingStateChanged(agora::rtc::AUDIO_MIXING_STATE_PLAYING, agora::rtc::AUDIO_MIXING_REASON_STOPPED_BY_USER);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioMixingStateChanged)

static bool js_trigger_onVideoDeviceStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onVideoDeviceStateChanged("agora", 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onVideoDeviceStateChanged)

static bool js_trigger_onLastmileQuality(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onLastmileQuality(2);
    return true;
}
SE_BIND_FUNC(js_trigger_onLastmileQuality)

static bool js_trigger_onLastmileProbeResult(se::State &s) {
    if (mock().eventHandler) {
        agora::rtc::LastmileProbeResult result;
        result.state = agora::rtc::LASTMILE_PROBE_RESULT_COMPLETE;
        result.uplinkReport.packetLossRate = 2;
        result.uplinkReport.jitter = 2;
        result.uplinkReport.availableBandwidth = 2;
        result.downlinkReport.packetLossRate = 2;
        result.downlinkReport.jitter = 2;
        result.downlinkReport.availableBandwidth = 2;
        result.rtt = 2;
        mock().eventHandler->onLastmileProbeResult(result);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onLastmileProbeResult)

static bool js_trigger_onFirstLocalVideoFrame(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onFirstLocalVideoFrame(agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onFirstLocalVideoFrame)

static bool js_trigger_onLocalVideoEvent(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onLocalVideoEvent(agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY, static_cast<agora::rtc::LOCAL_VIDEO_EVENT_TYPE>(0));
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalVideoEvent)

static bool js_trigger_onLocalVideoStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onLocalVideoStateChanged(agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY, agora::rtc::LOCAL_VIDEO_STREAM_STATE_CAPTURING, agora::rtc::LOCAL_VIDEO_STREAM_REASON_OK);
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalVideoStateChanged)

static bool js_trigger_onCameraReady(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onCameraReady();
    return true;
}
SE_BIND_FUNC(js_trigger_onCameraReady)

static bool js_trigger_onCameraFocusAreaChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onCameraFocusAreaChanged(2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onCameraFocusAreaChanged)

static bool js_trigger_onCameraExposureAreaChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onCameraExposureAreaChanged(2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onCameraExposureAreaChanged)

static bool js_trigger_onVideoStopped(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onVideoStopped();
    return true;
}
SE_BIND_FUNC(js_trigger_onVideoStopped)

static bool js_trigger_onRhythmPlayerStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onRhythmPlayerStateChanged(agora::rtc::RHYTHM_PLAYER_STATE_OPENING, agora::rtc::RHYTHM_PLAYER_REASON_OK);
    return true;
}
SE_BIND_FUNC(js_trigger_onRhythmPlayerStateChanged)

static bool js_trigger_onChannelMediaRelayStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onChannelMediaRelayStateChanged(2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onChannelMediaRelayStateChanged)

static bool js_trigger_onAudioRoutingChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioRoutingChanged(2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioRoutingChanged)

static bool js_trigger_onRemoteAudioTransportStats(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRemoteAudioTransportStats(makeConn(), 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteAudioTransportStats)

static bool js_trigger_onRemoteVideoTransportStats(se::State &s) {
    auto *h = exHandler();
    if (h) h->onRemoteVideoTransportStats(makeConn(), 2, 2, 2, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteVideoTransportStats)

static bool js_trigger_onRemoteSubscribeFallbackToAudioOnly(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onRemoteSubscribeFallbackToAudioOnly(2, true);
    return true;
}
SE_BIND_FUNC(js_trigger_onRemoteSubscribeFallbackToAudioOnly)

static bool js_trigger_onAudioPublishStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioPublishStateChanged("agora", agora::rtc::PUB_STATE_IDLE, agora::rtc::PUB_STATE_PUBLISHING, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioPublishStateChanged)

static bool js_trigger_onAudioSubscribeStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onAudioSubscribeStateChanged("agora", 2, agora::rtc::SUB_STATE_IDLE, agora::rtc::SUB_STATE_SUBSCRIBED, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onAudioSubscribeStateChanged)

static bool js_trigger_onVideoPublishStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onVideoPublishStateChanged(agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY, "agora", agora::rtc::PUB_STATE_IDLE, agora::rtc::PUB_STATE_PUBLISHING, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onVideoPublishStateChanged)

static bool js_trigger_onVideoSubscribeStateChanged(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onVideoSubscribeStateChanged("agora", 2, agora::rtc::SUB_STATE_IDLE, agora::rtc::SUB_STATE_SUBSCRIBED, 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onVideoSubscribeStateChanged)

static bool js_trigger_onPermissionError(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onPermissionError(agora::rtc::RECORD_AUDIO);
    return true;
}
SE_BIND_FUNC(js_trigger_onPermissionError)

static bool js_trigger_onLocalUserRegistered(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onLocalUserRegistered(2, "agora");
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalUserRegistered)

static bool js_trigger_onUserInfoUpdated(se::State &s) {
    if (mock().eventHandler) {
        agora::rtc::UserInfo info{};
        info.uid = 2;
        mock().eventHandler->onUserInfoUpdated(2, info);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onUserInfoUpdated)

static bool js_trigger_onContentInspectResult(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onContentInspectResult(agora::media::CONTENT_INSPECT_NEUTRAL);
    return true;
}
SE_BIND_FUNC(js_trigger_onContentInspectResult)

static bool js_trigger_onProxyConnected(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onProxyConnected("agora", 2, agora::rtc::HTTPS_PROXY_TYPE, "agora", 2);
    return true;
}
SE_BIND_FUNC(js_trigger_onProxyConnected)

static bool js_trigger_onRtmpStreamingEvent(se::State &s) {
    if (mock().eventHandler) mock().eventHandler->onRtmpStreamingEvent("agora", agora::rtc::RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE);
    return true;
}
SE_BIND_FUNC(js_trigger_onRtmpStreamingEvent)

static bool js_trigger_onLocalVideoTranscoderError(se::State &s) {
    if (mock().eventHandler) {
        agora::rtc::TranscodingVideoStream stream{};
        stream.x = 2;
        stream.y = 2;
        stream.width = 2;
        stream.height = 2;
        stream.zOrder = 2;
        stream.alpha = 2.0;
        stream.mirror = true;
        mock().eventHandler->onLocalVideoTranscoderError(stream, agora::rtc::VT_ERR_VIDEO_SOURCE_NOT_READY);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onLocalVideoTranscoderError)

static bool js_trigger_onExtensionErrorWithContext(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::ExtensionContext context{};
        h->onExtensionErrorWithContext(context, 2, "agora");
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onExtensionErrorWithContext)

static bool js_trigger_onExtensionEventWithContext(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::ExtensionContext context{};
        h->onExtensionEventWithContext(context, "agora", "agora");
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onExtensionEventWithContext)

static bool js_trigger_onExtensionStartedWithContext(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::ExtensionContext context{};
        h->onExtensionStartedWithContext(context);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onExtensionStartedWithContext)

static bool js_trigger_onExtensionStoppedWithContext(se::State &s) {
    auto *h = exHandler();
    if (h) {
        agora::rtc::ExtensionContext context{};
        h->onExtensionStoppedWithContext(context);
    }
    return true;
}
SE_BIND_FUNC(js_trigger_onExtensionStoppedWithContext)

// ============================================================================
// Log and utility functions
// ============================================================================

static bool js_trigger_reset(se::State &s) {
    mock().eventHandler = nullptr;
    return true;
}
SE_BIND_FUNC(js_trigger_reset)

static bool js_trigger_setLogPath(se::State &s) {
    const auto &args = s.args();
    if (args.size() < 1 || !args[0].isString()) {
        SE_REPORT_ERROR("setLogPath expects (string path)");
        return false;
    }
    mock().setLogPath(args[0].toString());
    return true;
}
SE_BIND_FUNC(js_trigger_setLogPath)

static bool js_trigger_clearLog(se::State &s) {
    mock().clearLog();
    return true;
}
SE_BIND_FUNC(js_trigger_clearLog)

static bool js_trigger_readLog(se::State &s) {
    std::string logContent = mock().readLog();
    s.rval().setString(logContent);
    return true;
}
SE_BIND_FUNC(js_trigger_readLog)

} // namespace

bool register_agora_trigger_events(se::Object *global) {
    se::Value jsbVal;
    if (!global->getProperty("jsb", &jsbVal, true) || !jsbVal.isObject()) {
        return false;
    }
    se::Value agoraVal;
    if (!jsbVal.toObject()->getProperty("agora", &agoraVal) || !agoraVal.isObject()) {
        return false;
    }

    se::HandleObject testObj(se::Object::createPlainObject());
    
    // Overloaded functions (Ex versions with RtcConnection)
    testObj->defineFunction("triggerOnJoinChannelSuccess", _SE(js_trigger_onJoinChannelSuccess));
    testObj->defineFunction("triggerOnRejoinChannelSuccess", _SE(js_trigger_onRejoinChannelSuccess));
    testObj->defineFunction("triggerOnLeaveChannel", _SE(js_trigger_onLeaveChannel));
    testObj->defineFunction("triggerOnUserJoined", _SE(js_trigger_onUserJoined));
    testObj->defineFunction("triggerOnUserOffline", _SE(js_trigger_onUserOffline));
    testObj->defineFunction("triggerOnConnectionLost", _SE(js_trigger_onConnectionLost));
    testObj->defineFunction("triggerOnConnectionInterrupted", _SE(js_trigger_onConnectionInterrupted));
    testObj->defineFunction("triggerOnConnectionBanned", _SE(js_trigger_onConnectionBanned));
    testObj->defineFunction("triggerOnTokenPrivilegeWillExpire", _SE(js_trigger_onTokenPrivilegeWillExpire));
    testObj->defineFunction("triggerOnRequestToken", _SE(js_trigger_onRequestToken));
    testObj->defineFunction("triggerOnLicenseValidationFailure", _SE(js_trigger_onLicenseValidationFailure));
    testObj->defineFunction("triggerOnAudioQuality", _SE(js_trigger_onAudioQuality));
    testObj->defineFunction("triggerOnRtcStats", _SE(js_trigger_onRtcStats));
    testObj->defineFunction("triggerOnNetworkQuality", _SE(js_trigger_onNetworkQuality));
    testObj->defineFunction("triggerOnIntraRequestReceived", _SE(js_trigger_onIntraRequestReceived));
    testObj->defineFunction("triggerOnFirstLocalVideoFramePublished", _SE(js_trigger_onFirstLocalVideoFramePublished));
    testObj->defineFunction("triggerOnFirstRemoteVideoDecoded", _SE(js_trigger_onFirstRemoteVideoDecoded));
    testObj->defineFunction("triggerOnVideoSizeChanged", _SE(js_trigger_onVideoSizeChanged));
    testObj->defineFunction("triggerOnRemoteVideoStateChanged", _SE(js_trigger_onRemoteVideoStateChanged));
    testObj->defineFunction("triggerOnFirstRemoteVideoFrame", _SE(js_trigger_onFirstRemoteVideoFrame));
    testObj->defineFunction("triggerOnUserMuteAudio", _SE(js_trigger_onUserMuteAudio));
    testObj->defineFunction("triggerOnUserMuteVideo", _SE(js_trigger_onUserMuteVideo));
    testObj->defineFunction("triggerOnUserEnableVideo", _SE(js_trigger_onUserEnableVideo));
    testObj->defineFunction("triggerOnUserEnableLocalVideo", _SE(js_trigger_onUserEnableLocalVideo));
    testObj->defineFunction("triggerOnUserStateChanged", _SE(js_trigger_onUserStateChanged));
    testObj->defineFunction("triggerOnLocalAudioStats", _SE(js_trigger_onLocalAudioStats));
    testObj->defineFunction("triggerOnRemoteAudioStats", _SE(js_trigger_onRemoteAudioStats));
    testObj->defineFunction("triggerOnLocalVideoStats", _SE(js_trigger_onLocalVideoStats));
    testObj->defineFunction("triggerOnRemoteVideoStats", _SE(js_trigger_onRemoteVideoStats));
    testObj->defineFunction("triggerOnStreamMessage", _SE(js_trigger_onStreamMessage));
    testObj->defineFunction("triggerOnStreamMessageError", _SE(js_trigger_onStreamMessageError));
    testObj->defineFunction("triggerOnRdtMessage", _SE(js_trigger_onRdtMessage));
    testObj->defineFunction("triggerOnRdtStateChanged", _SE(js_trigger_onRdtStateChanged));
    testObj->defineFunction("triggerOnMediaControlMessage", _SE(js_trigger_onMediaControlMessage));
    testObj->defineFunction("triggerOnFirstLocalAudioFramePublished", _SE(js_trigger_onFirstLocalAudioFramePublished));
    testObj->defineFunction("triggerOnFirstRemoteAudioFrame", _SE(js_trigger_onFirstRemoteAudioFrame));
    testObj->defineFunction("triggerOnFirstRemoteAudioDecoded", _SE(js_trigger_onFirstRemoteAudioDecoded));
    testObj->defineFunction("triggerOnLocalAudioStateChanged", _SE(js_trigger_onLocalAudioStateChanged));
    testObj->defineFunction("triggerOnRemoteAudioStateChanged", _SE(js_trigger_onRemoteAudioStateChanged));
    testObj->defineFunction("triggerOnActiveSpeaker", _SE(js_trigger_onActiveSpeaker));
    testObj->defineFunction("triggerOnClientRoleChanged", _SE(js_trigger_onClientRoleChanged));
    testObj->defineFunction("triggerOnClientRoleChangeFailed", _SE(js_trigger_onClientRoleChangeFailed));
    testObj->defineFunction("triggerOnNetworkTypeChanged", _SE(js_trigger_onNetworkTypeChanged));
    testObj->defineFunction("triggerOnEncryptionError", _SE(js_trigger_onEncryptionError));
    testObj->defineFunction("triggerOnUploadLogResult", _SE(js_trigger_onUploadLogResult));
    testObj->defineFunction("triggerOnUserAccountUpdated", _SE(js_trigger_onUserAccountUpdated));
    testObj->defineFunction("triggerOnSnapshotTaken", _SE(js_trigger_onSnapshotTaken));
    testObj->defineFunction("triggerOnVideoRenderingTracingResult", _SE(js_trigger_onVideoRenderingTracingResult));
    testObj->defineFunction("triggerOnSetRtmFlagResult", _SE(js_trigger_onSetRtmFlagResult));
    testObj->defineFunction("triggerOnTranscodedStreamLayoutInfo", _SE(js_trigger_onTranscodedStreamLayoutInfo));
    testObj->defineFunction("triggerOnAudioMetadataReceived", _SE(js_trigger_onAudioMetadataReceived));
    testObj->defineFunction("triggerOnMultipathStats", _SE(js_trigger_onMultipathStats));
    testObj->defineFunction("triggerOnRenewTokenResult", _SE(js_trigger_onRenewTokenResult));
    
    // Non-overloaded functions
    testObj->defineFunction("triggerOnError", _SE(js_trigger_onError));
    testObj->defineFunction("triggerOnAudioDeviceStateChanged", _SE(js_trigger_onAudioDeviceStateChanged));
    testObj->defineFunction("triggerOnAudioDeviceVolumeChanged", _SE(js_trigger_onAudioDeviceVolumeChanged));
    testObj->defineFunction("triggerOnAudioEffectFinished", _SE(js_trigger_onAudioEffectFinished));
    testObj->defineFunction("triggerOnAudioMixingPositionChanged", _SE(js_trigger_onAudioMixingPositionChanged));
    testObj->defineFunction("triggerOnAudioMixingFinished", _SE(js_trigger_onAudioMixingFinished));
    testObj->defineFunction("triggerOnAudioMixingStateChanged", _SE(js_trigger_onAudioMixingStateChanged));
    testObj->defineFunction("triggerOnVideoDeviceStateChanged", _SE(js_trigger_onVideoDeviceStateChanged));
    testObj->defineFunction("triggerOnLastmileQuality", _SE(js_trigger_onLastmileQuality));
    testObj->defineFunction("triggerOnLastmileProbeResult", _SE(js_trigger_onLastmileProbeResult));
    testObj->defineFunction("triggerOnFirstLocalVideoFrame", _SE(js_trigger_onFirstLocalVideoFrame));
    testObj->defineFunction("triggerOnLocalVideoEvent", _SE(js_trigger_onLocalVideoEvent));
    testObj->defineFunction("triggerOnLocalVideoStateChanged", _SE(js_trigger_onLocalVideoStateChanged));
    testObj->defineFunction("triggerOnCameraReady", _SE(js_trigger_onCameraReady));
    testObj->defineFunction("triggerOnCameraFocusAreaChanged", _SE(js_trigger_onCameraFocusAreaChanged));
    testObj->defineFunction("triggerOnCameraExposureAreaChanged", _SE(js_trigger_onCameraExposureAreaChanged));
    testObj->defineFunction("triggerOnVideoStopped", _SE(js_trigger_onVideoStopped));
    testObj->defineFunction("triggerOnRhythmPlayerStateChanged", _SE(js_trigger_onRhythmPlayerStateChanged));
    testObj->defineFunction("triggerOnChannelMediaRelayStateChanged", _SE(js_trigger_onChannelMediaRelayStateChanged));
    testObj->defineFunction("triggerOnAudioRoutingChanged", _SE(js_trigger_onAudioRoutingChanged));
    testObj->defineFunction("triggerOnRemoteAudioTransportStats", _SE(js_trigger_onRemoteAudioTransportStats));
    testObj->defineFunction("triggerOnRemoteVideoTransportStats", _SE(js_trigger_onRemoteVideoTransportStats));
    testObj->defineFunction("triggerOnRemoteSubscribeFallbackToAudioOnly", _SE(js_trigger_onRemoteSubscribeFallbackToAudioOnly));
    testObj->defineFunction("triggerOnAudioPublishStateChanged", _SE(js_trigger_onAudioPublishStateChanged));
    testObj->defineFunction("triggerOnAudioSubscribeStateChanged", _SE(js_trigger_onAudioSubscribeStateChanged));
    testObj->defineFunction("triggerOnVideoPublishStateChanged", _SE(js_trigger_onVideoPublishStateChanged));
    testObj->defineFunction("triggerOnVideoSubscribeStateChanged", _SE(js_trigger_onVideoSubscribeStateChanged));
    testObj->defineFunction("triggerOnPermissionError", _SE(js_trigger_onPermissionError));
    testObj->defineFunction("triggerOnLocalUserRegistered", _SE(js_trigger_onLocalUserRegistered));
    testObj->defineFunction("triggerOnUserInfoUpdated", _SE(js_trigger_onUserInfoUpdated));
    testObj->defineFunction("triggerOnContentInspectResult", _SE(js_trigger_onContentInspectResult));
    testObj->defineFunction("triggerOnProxyConnected", _SE(js_trigger_onProxyConnected));
    testObj->defineFunction("triggerOnRtmpStreamingEvent", _SE(js_trigger_onRtmpStreamingEvent));
    testObj->defineFunction("triggerOnLocalVideoTranscoderError", _SE(js_trigger_onLocalVideoTranscoderError));
    testObj->defineFunction("triggerOnExtensionErrorWithContext", _SE(js_trigger_onExtensionErrorWithContext));
    testObj->defineFunction("triggerOnExtensionEventWithContext", _SE(js_trigger_onExtensionEventWithContext));
    testObj->defineFunction("triggerOnExtensionStartedWithContext", _SE(js_trigger_onExtensionStartedWithContext));
    testObj->defineFunction("triggerOnExtensionStoppedWithContext", _SE(js_trigger_onExtensionStoppedWithContext));
    
    // Utility functions
    testObj->defineFunction("reset", _SE(js_trigger_reset));
    testObj->defineFunction("setLogPath", _SE(js_trigger_setLogPath));
    testObj->defineFunction("clearLog", _SE(js_trigger_clearLog));
    testObj->defineFunction("readLog", _SE(js_trigger_readLog));

    agoraVal.toObject()->setProperty("test", se::Value(testObj));
    return true;
}
