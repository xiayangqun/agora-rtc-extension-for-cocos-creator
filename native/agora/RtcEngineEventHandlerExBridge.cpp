#include "agora/RtcEngineEventHandlerExBridge.h"

#include <string>
#include <vector>

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"

RtcEngineEventHandlerExBridge::RtcEngineEventHandlerExBridge(se::Object *eventHandler)
    : ObserverBridgeBase(eventHandler) {}

const char* RtcEngineEventHandlerExBridge::eventHandlerType() const { return "event_handler_ex"; }

void RtcEngineEventHandlerExBridge::onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)channel;
    (void)uid;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)channel;
    (void)uid;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onProxyConnected(const char* channel, uid_t uid, PROXY_TYPE proxyType, const char* localProxyIp, int elapsed) {
    std::string channelCopy(channel != nullptr ? channel : "");
    auto uidCopy = uid;
    auto proxyTypeCopy = proxyType;
    std::string localProxyIpCopy(localProxyIp != nullptr ? localProxyIp : "");
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelCopy, uidCopy, proxyTypeCopy, localProxyIpCopy, elapsedCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, channelCopy);
            pushArg(args, uidCopy);
            pushArg(args, proxyTypeCopy);
            pushArg(args, localProxyIpCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onProxyConnected", args);
        });
}

void RtcEngineEventHandlerExBridge::onError(int err, const char* msg) {
    auto errCopy = err;
    std::string msgCopy(msg != nullptr ? msg : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, errCopy, msgCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, errCopy);
            pushArg(args, msgCopy);
            callHandler(self, "onError", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioQuality(uid_t uid, int quality, unsigned short delay, unsigned short lost) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)quality;
    (void)delay;
    (void)lost;
}

void RtcEngineEventHandlerExBridge::onLastmileProbeResult(const LastmileProbeResult& result) {
    auto resultCopy = result;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, resultCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, resultCopy);
            callHandler(self, "onLastmileProbeResult", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioVolumeIndication(const AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)speakers;
    (void)speakerNumber;
    (void)totalVolume;
}

void RtcEngineEventHandlerExBridge::onLeaveChannel(const RtcStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onRtcStats(const RtcStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onAudioDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) {
    std::string deviceIdCopy(deviceId != nullptr ? deviceId : "");
    auto deviceTypeCopy = deviceType;
    auto deviceStateCopy = deviceState;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, deviceIdCopy, deviceTypeCopy, deviceStateCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, deviceIdCopy);
            pushArg(args, deviceTypeCopy);
            pushArg(args, deviceStateCopy);
            callHandler(self, "onAudioDeviceStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioMixingPositionChanged(int64_t position) {
    auto positionCopy = position;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, positionCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, positionCopy);
            callHandler(self, "onAudioMixingPositionChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioMixingFinished() {
    //this is marked as __deprecated
}

void RtcEngineEventHandlerExBridge::onAudioEffectFinished(int soundId) {
    auto soundIdCopy = soundId;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, soundIdCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, soundIdCopy);
            callHandler(self, "onAudioEffectFinished", args);
        });
}

void RtcEngineEventHandlerExBridge::onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) {
    std::string deviceIdCopy(deviceId != nullptr ? deviceId : "");
    auto deviceTypeCopy = deviceType;
    auto deviceStateCopy = deviceState;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, deviceIdCopy, deviceTypeCopy, deviceStateCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, deviceIdCopy);
            pushArg(args, deviceTypeCopy);
            pushArg(args, deviceStateCopy);
            callHandler(self, "onVideoDeviceStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onNetworkQuality(uid_t uid, int txQuality, int rxQuality) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)txQuality;
    (void)rxQuality;
}

void RtcEngineEventHandlerExBridge::onIntraRequestReceived() {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.

}

void RtcEngineEventHandlerExBridge::onUplinkNetworkInfoUpdated(const UplinkNetworkInfo& info) {
    auto infoCopy = info;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, infoCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, infoCopy);
            callHandler(self, "onUplinkNetworkInfoUpdated", args);
        });
}

void RtcEngineEventHandlerExBridge::onLastmileQuality(int quality) {
    auto qualityCopy = quality;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, qualityCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, qualityCopy);
            callHandler(self, "onLastmileQuality", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstLocalVideoFrame(VIDEO_SOURCE_TYPE source, int width, int height, int elapsed) {
    auto sourceCopy = source;
    auto widthCopy = width;
    auto heightCopy = height;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, sourceCopy, widthCopy, heightCopy, elapsedCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, sourceCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstLocalVideoFrame", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstLocalVideoFramePublished(VIDEO_SOURCE_TYPE source, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)source;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onFirstRemoteVideoDecoded(uid_t uid, int width, int height, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)width;
    (void)height;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onVideoSizeChanged(VIDEO_SOURCE_TYPE sourceType, uid_t uid, int width, int height, int rotation) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)sourceType;
    (void)uid;
    (void)width;
    (void)height;
    (void)rotation;
}

void RtcEngineEventHandlerExBridge::onLocalVideoEvent(VIDEO_SOURCE_TYPE source, LOCAL_VIDEO_EVENT_TYPE event) {
    auto sourceCopy = source;
    auto eventCopy = event;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, sourceCopy, eventCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, sourceCopy);
            pushArg(args, eventCopy);
            callHandler(self, "onLocalVideoEvent", args);
        });
}

void RtcEngineEventHandlerExBridge::onLocalVideoStateChanged(VIDEO_SOURCE_TYPE source, LOCAL_VIDEO_STREAM_STATE state, LOCAL_VIDEO_STREAM_REASON reason) {
    auto sourceCopy = source;
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, sourceCopy, stateCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, sourceCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onLocalVideoStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteVideoStateChanged(uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)state;
    (void)reason;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onFirstRemoteVideoFrame(uid_t uid, int width, int height, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)width;
    (void)height;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onUserJoined(uid_t uid, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onUserOffline(uid_t uid, USER_OFFLINE_REASON_TYPE reason) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)reason;
}

void RtcEngineEventHandlerExBridge::onUserMuteAudio(uid_t uid, bool muted) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)muted;
}

void RtcEngineEventHandlerExBridge::onUserMuteVideo(uid_t uid, bool muted) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)muted;
}

void RtcEngineEventHandlerExBridge::onUserEnableVideo(uid_t uid, bool enabled) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)enabled;
}

void RtcEngineEventHandlerExBridge::onUserStateChanged(uid_t uid, REMOTE_USER_STATE state) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)state;
}

void RtcEngineEventHandlerExBridge::onUserEnableLocalVideo(uid_t uid, bool enabled) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)enabled;
}

void RtcEngineEventHandlerExBridge::onRemoteAudioStats(const RemoteAudioStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onLocalAudioStats(const LocalAudioStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onLocalVideoStats(VIDEO_SOURCE_TYPE source, const LocalVideoStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)source;
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onRemoteVideoStats(const RemoteVideoStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onCameraReady() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            callHandler(self, "onCameraReady", args);
        });
}

void RtcEngineEventHandlerExBridge::onCameraFocusAreaChanged(int x, int y, int width, int height) {
    auto xCopy = x;
    auto yCopy = y;
    auto widthCopy = width;
    auto heightCopy = height;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, xCopy, yCopy, widthCopy, heightCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, xCopy);
            pushArg(args, yCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            callHandler(self, "onCameraFocusAreaChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onCameraExposureAreaChanged(int x, int y, int width, int height) {
    auto xCopy = x;
    auto yCopy = y;
    auto widthCopy = width;
    auto heightCopy = height;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, xCopy, yCopy, widthCopy, heightCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, xCopy);
            pushArg(args, yCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            callHandler(self, "onCameraExposureAreaChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onFacePositionChanged(int imageWidth, int imageHeight, const Rectangle* vecRectangle, const int* vecDistance, int numFaces) {
    auto imageWidthCopy = imageWidth;
    auto imageHeightCopy = imageHeight;
    std::vector<Rectangle> vecRectangleCopy(vecRectangle, vecRectangle != nullptr ? vecRectangle + numFaces : vecRectangle);
    std::vector<int> vecDistanceCopy(vecDistance, vecDistance != nullptr ? vecDistance + numFaces : vecDistance);
    auto numFacesCopy = numFaces;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, imageWidthCopy, imageHeightCopy, vecRectangleCopy, vecDistanceCopy, numFacesCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, imageWidthCopy);
            pushArg(args, imageHeightCopy);
            pushArg(args, vecRectangleCopy);
            pushArg(args, vecDistanceCopy);
            pushArg(args, numFacesCopy);
            callHandler(self, "onFacePositionChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onVideoStopped() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            callHandler(self, "onVideoStopped", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioMixingStateChanged(AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_REASON_TYPE reason) {
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, stateCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onAudioMixingStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRhythmPlayerStateChanged(RHYTHM_PLAYER_STATE_TYPE state, RHYTHM_PLAYER_REASON reason) {
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, stateCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onRhythmPlayerStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onConnectionLost() {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.

}

void RtcEngineEventHandlerExBridge::onConnectionInterrupted() {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.

}

void RtcEngineEventHandlerExBridge::onConnectionBanned() {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.

}

void RtcEngineEventHandlerExBridge::onStreamMessage(uid_t uid, int streamId, const char* data, size_t length, uint64_t sentTs) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)streamId;
    (void)data;
    (void)length;
    (void)sentTs;
}

void RtcEngineEventHandlerExBridge::onStreamMessageError(uid_t uid, int streamId, int code, int missed, int cached) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)streamId;
    (void)code;
    (void)missed;
    (void)cached;
}

void RtcEngineEventHandlerExBridge::onRdtMessage(uid_t userId, RdtStreamType type, const char *data, size_t length) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)userId;
    (void)type;
    (void)data;
    (void)length;
}

void RtcEngineEventHandlerExBridge::onRdtStateChanged(uid_t userId, RdtState state) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)userId;
    (void)state;
}

void RtcEngineEventHandlerExBridge::onMediaControlMessage(uid_t userId, const char* data, size_t length) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)userId;
    (void)data;
    (void)length;
}

void RtcEngineEventHandlerExBridge::onRequestToken() {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.

}

void RtcEngineEventHandlerExBridge::onTokenPrivilegeWillExpire(const char* token) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)token;
}

void RtcEngineEventHandlerExBridge::onLicenseValidationFailure(LICENSE_ERROR_TYPE error) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)error;
}

void RtcEngineEventHandlerExBridge::onFirstLocalAudioFramePublished(int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onFirstRemoteAudioDecoded(uid_t uid, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onFirstRemoteAudioFrame(uid_t uid, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onLocalAudioStateChanged(LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_REASON reason) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)state;
    (void)reason;
}

void RtcEngineEventHandlerExBridge::onRemoteAudioStateChanged(uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)state;
    (void)reason;
    (void)elapsed;
}

void RtcEngineEventHandlerExBridge::onActiveSpeaker(uid_t uid) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
}

void RtcEngineEventHandlerExBridge::onContentInspectResult(media::CONTENT_INSPECT_RESULT result) {
    auto resultCopy = result;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, resultCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, resultCopy);
            callHandler(self, "onContentInspectResult", args);
        });
}

void RtcEngineEventHandlerExBridge::onSnapshotTaken(uid_t uid, const char* filePath, int width, int height, int errCode) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)filePath;
    (void)width;
    (void)height;
    (void)errCode;
}

void RtcEngineEventHandlerExBridge::onClientRoleChanged(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole, const ClientRoleOptions& newRoleOptions) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)oldRole;
    (void)newRole;
    (void)newRoleOptions;
}

void RtcEngineEventHandlerExBridge::onClientRoleChangeFailed(CLIENT_ROLE_CHANGE_FAILED_REASON reason, CLIENT_ROLE_TYPE currentRole) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)reason;
    (void)currentRole;
}

void RtcEngineEventHandlerExBridge::onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted) {
    auto deviceTypeCopy = deviceType;
    auto volumeCopy = volume;
    auto mutedCopy = muted;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, deviceTypeCopy, volumeCopy, mutedCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, deviceTypeCopy);
            pushArg(args, volumeCopy);
            pushArg(args, mutedCopy);
            callHandler(self, "onAudioDeviceVolumeChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRtmpStreamingStateChanged(const char* url, RTMP_STREAM_PUBLISH_STATE state, RTMP_STREAM_PUBLISH_REASON reason) {
    std::string urlCopy(url != nullptr ? url : "");
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, urlCopy, stateCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, urlCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onRtmpStreamingStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRtmpStreamingEvent(const char* url, RTMP_STREAMING_EVENT eventCode) {
    std::string urlCopy(url != nullptr ? url : "");
    auto eventCodeCopy = eventCode;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, urlCopy, eventCodeCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, urlCopy);
            pushArg(args, eventCodeCopy);
            callHandler(self, "onRtmpStreamingEvent", args);
        });
}

void RtcEngineEventHandlerExBridge::onTranscodingUpdated() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            callHandler(self, "onTranscodingUpdated", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioRoutingChanged(int routing) {
    auto routingCopy = routing;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, routingCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, routingCopy);
            callHandler(self, "onAudioRoutingChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onChannelMediaRelayStateChanged(int state, int code) {
    auto stateCopy = state;
    auto codeCopy = code;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, stateCopy, codeCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, stateCopy);
            pushArg(args, codeCopy);
            callHandler(self, "onChannelMediaRelayStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteSubscribeFallbackToAudioOnly(uid_t uid, bool isFallbackOrRecover) {
    auto uidCopy = uid;
    auto isFallbackOrRecoverCopy = isFallbackOrRecover;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, uidCopy, isFallbackOrRecoverCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, uidCopy);
            pushArg(args, isFallbackOrRecoverCopy);
            callHandler(self, "onRemoteSubscribeFallbackToAudioOnly", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteAudioTransportStats(uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)delay;
    (void)lost;
    (void)rxKBitRate;
}

void RtcEngineEventHandlerExBridge::onRemoteVideoTransportStats(uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)delay;
    (void)lost;
    (void)rxKBitRate;
}

void RtcEngineEventHandlerExBridge::onConnectionStateChanged(CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)state;
    (void)reason;
}

void RtcEngineEventHandlerExBridge::onNetworkTypeChanged(NETWORK_TYPE type) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)type;
}

void RtcEngineEventHandlerExBridge::onEncryptionError(ENCRYPTION_ERROR_TYPE errorType) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)errorType;
}

void RtcEngineEventHandlerExBridge::onPermissionError(PERMISSION_TYPE permissionType) {
    auto permissionTypeCopy = permissionType;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, permissionTypeCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, permissionTypeCopy);
            callHandler(self, "onPermissionError", args);
        });
}

void RtcEngineEventHandlerExBridge::onPermissionGranted(agora::rtc::PERMISSION_TYPE permissionType) {
    auto permissionTypeCopy = permissionType;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, permissionTypeCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, permissionTypeCopy);
            callHandler(self, "onPermissionGranted", args);
        });
}

void RtcEngineEventHandlerExBridge::onLocalUserRegistered(uid_t uid, const char* userAccount) {
    auto uidCopy = uid;
    std::string userAccountCopy(userAccount != nullptr ? userAccount : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, uidCopy, userAccountCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, uidCopy);
            pushArg(args, userAccountCopy);
            callHandler(self, "onLocalUserRegistered", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserInfoUpdated(uid_t uid, const agora::rtc::UserInfo& info) {
    auto uidCopy = uid;
    auto infoCopy = info;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, uidCopy, infoCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, uidCopy);
            pushArg(args, infoCopy);
            callHandler(self, "onUserInfoUpdated", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserAccountUpdated(uid_t uid, const char* userAccount) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)userAccount;
}

void RtcEngineEventHandlerExBridge::onVideoRenderingTracingResult(uid_t uid, MEDIA_TRACE_EVENT currentEvent, VideoRenderingTracingInfo tracingInfo) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)currentEvent;
    (void)tracingInfo;
}

void RtcEngineEventHandlerExBridge::onLocalVideoTranscoderError(const TranscodingVideoStream& stream, VIDEO_TRANSCODER_ERROR error) {
    std::string imageUrlCopy(stream.imageUrl != nullptr ? stream.imageUrl : "");
    auto streamCopy = stream;
    streamCopy.imageUrl = imageUrlCopy.c_str();
    auto errorCopy = error;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, imageUrlCopy, streamCopy, errorCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, streamCopy);
            pushArg(args, errorCopy);
            callHandler(self, "onLocalVideoTranscoderError", args);
        });
}

void RtcEngineEventHandlerExBridge::onUploadLogResult(const char* requestId, bool success, UPLOAD_ERROR_REASON reason) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)requestId;
    (void)success;
    (void)reason;
}

void RtcEngineEventHandlerExBridge::onAudioSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
    std::string channelCopy(channel != nullptr ? channel : "");
    auto uidCopy = uid;
    auto oldStateCopy = oldState;
    auto newStateCopy = newState;
    auto elapseSinceLastStateCopy = elapseSinceLastState;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelCopy, uidCopy, oldStateCopy, newStateCopy, elapseSinceLastStateCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, channelCopy);
            pushArg(args, uidCopy);
            pushArg(args, oldStateCopy);
            pushArg(args, newStateCopy);
            pushArg(args, elapseSinceLastStateCopy);
            callHandler(self, "onAudioSubscribeStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onVideoSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
    std::string channelCopy(channel != nullptr ? channel : "");
    auto uidCopy = uid;
    auto oldStateCopy = oldState;
    auto newStateCopy = newState;
    auto elapseSinceLastStateCopy = elapseSinceLastState;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelCopy, uidCopy, oldStateCopy, newStateCopy, elapseSinceLastStateCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, channelCopy);
            pushArg(args, uidCopy);
            pushArg(args, oldStateCopy);
            pushArg(args, newStateCopy);
            pushArg(args, elapseSinceLastStateCopy);
            callHandler(self, "onVideoSubscribeStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioPublishStateChanged(const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState) {
    std::string channelCopy(channel != nullptr ? channel : "");
    auto oldStateCopy = oldState;
    auto newStateCopy = newState;
    auto elapseSinceLastStateCopy = elapseSinceLastState;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelCopy, oldStateCopy, newStateCopy, elapseSinceLastStateCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, channelCopy);
            pushArg(args, oldStateCopy);
            pushArg(args, newStateCopy);
            pushArg(args, elapseSinceLastStateCopy);
            callHandler(self, "onAudioPublishStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onVideoPublishStateChanged(VIDEO_SOURCE_TYPE source, const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState) {
    auto sourceCopy = source;
    std::string channelCopy(channel != nullptr ? channel : "");
    auto oldStateCopy = oldState;
    auto newStateCopy = newState;
    auto elapseSinceLastStateCopy = elapseSinceLastState;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, sourceCopy, channelCopy, oldStateCopy, newStateCopy, elapseSinceLastStateCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, sourceCopy);
            pushArg(args, channelCopy);
            pushArg(args, oldStateCopy);
            pushArg(args, newStateCopy);
            pushArg(args, elapseSinceLastStateCopy);
            callHandler(self, "onVideoPublishStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onTranscodedStreamLayoutInfo(uid_t uid, int width, int height, int layoutCount,const VideoLayout* layoutlist) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)width;
    (void)height;
    (void)layoutCount;
    (void)layoutlist;
}

void RtcEngineEventHandlerExBridge::onAudioMetadataReceived(uid_t uid, const char* metadata, size_t length) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)uid;
    (void)metadata;
    (void)length;
}

void RtcEngineEventHandlerExBridge::onExtensionEventWithContext(const ExtensionContext &context, const char* key, const char* value) {
    std::string providerNameCopy(context.providerName != nullptr ? context.providerName : "");
    std::string extensionNameCopy(context.extensionName != nullptr ? context.extensionName : "");
    auto contextCopy = context;
    contextCopy.providerName = providerNameCopy.c_str();
    contextCopy.extensionName = extensionNameCopy.c_str();
    std::string keyCopy(key != nullptr ? key : "");
    std::string valueCopy(value != nullptr ? value : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, providerNameCopy, extensionNameCopy, contextCopy, keyCopy, valueCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, contextCopy);
            pushArg(args, keyCopy);
            pushArg(args, valueCopy);
            callHandler(self, "onExtensionEventWithContext", args);
        });
}

void RtcEngineEventHandlerExBridge::onExtensionStartedWithContext(const ExtensionContext &context) {
    std::string providerNameCopy(context.providerName != nullptr ? context.providerName : "");
    std::string extensionNameCopy(context.extensionName != nullptr ? context.extensionName : "");
    auto contextCopy = context;
    contextCopy.providerName = providerNameCopy.c_str();
    contextCopy.extensionName = extensionNameCopy.c_str();
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, providerNameCopy, extensionNameCopy, contextCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, contextCopy);
            callHandler(self, "onExtensionStartedWithContext", args);
        });
}

void RtcEngineEventHandlerExBridge::onExtensionStoppedWithContext(const ExtensionContext &context) {
    std::string providerNameCopy(context.providerName != nullptr ? context.providerName : "");
    std::string extensionNameCopy(context.extensionName != nullptr ? context.extensionName : "");
    auto contextCopy = context;
    contextCopy.providerName = providerNameCopy.c_str();
    contextCopy.extensionName = extensionNameCopy.c_str();
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, providerNameCopy, extensionNameCopy, contextCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, contextCopy);
            callHandler(self, "onExtensionStoppedWithContext", args);
        });
}

void RtcEngineEventHandlerExBridge::onExtensionErrorWithContext(const ExtensionContext &context, int error, const char* message) {
    std::string providerNameCopy(context.providerName != nullptr ? context.providerName : "");
    std::string extensionNameCopy(context.extensionName != nullptr ? context.extensionName : "");
    auto contextCopy = context;
    contextCopy.providerName = providerNameCopy.c_str();
    contextCopy.extensionName = extensionNameCopy.c_str();
    auto errorCopy = error;
    std::string messageCopy(message != nullptr ? message : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, providerNameCopy, extensionNameCopy, contextCopy, errorCopy, messageCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, contextCopy);
            pushArg(args, errorCopy);
            pushArg(args, messageCopy);
            callHandler(self, "onExtensionErrorWithContext", args);
        });
}

void RtcEngineEventHandlerExBridge::onSetRtmFlagResult(int code) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)code;
}

void RtcEngineEventHandlerExBridge::onMultipathStats(const MultipathStats& stats) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)stats;
}

void RtcEngineEventHandlerExBridge::onRenewTokenResult(const char* token, RENEW_TOKEN_ERROR_CODE code) {
    // Non-connection overload intentionally does not dispatch to TS.
    // The TS layer only receives the IRtcEngineEventHandlerEx overload with RtcConnection.
    (void)token;
    (void)code;
}

void RtcEngineEventHandlerExBridge::onJoinChannelSuccess(const RtcConnection& connection, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onJoinChannelSuccess", args);
        });
}

void RtcEngineEventHandlerExBridge::onRejoinChannelSuccess(const RtcConnection& connection, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onRejoinChannelSuccess", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioQuality(const RtcConnection& connection, uid_t remoteUid, int quality, unsigned short delay, unsigned short lost) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto qualityCopy = quality;
    auto delayCopy = delay;
    auto lostCopy = lost;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, qualityCopy, delayCopy, lostCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, qualityCopy);
            pushArg(args, delayCopy);
            pushArg(args, lostCopy);
            callHandler(self, "onAudioQuality", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioVolumeIndication(const RtcConnection& connection, const AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    std::vector<AudioVolumeInfo> speakersCopy(speakers, speakers != nullptr ? speakers + speakerNumber : speakers);
    auto speakerNumberCopy = speakerNumber;
    auto totalVolumeCopy = totalVolume;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, speakersCopy, speakerNumberCopy, totalVolumeCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, speakersCopy);
            pushArg(args, static_cast<int32_t>(speakerNumberCopy));
            pushArg(args, totalVolumeCopy);
            callHandler(self, "onAudioVolumeIndication", args);
        });
}

void RtcEngineEventHandlerExBridge::onLeaveChannel(const RtcConnection& connection, const RtcStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onLeaveChannel", args);
        });
}

void RtcEngineEventHandlerExBridge::onRtcStats(const RtcConnection& connection, const RtcStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onRtcStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onNetworkQuality(const RtcConnection& connection, uid_t remoteUid, int txQuality, int rxQuality) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto txQualityCopy = txQuality;
    auto rxQualityCopy = rxQuality;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, txQualityCopy, rxQualityCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, txQualityCopy);
            pushArg(args, rxQualityCopy);
            callHandler(self, "onNetworkQuality", args);
        });
}

void RtcEngineEventHandlerExBridge::onIntraRequestReceived(const RtcConnection& connection) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            callHandler(self, "onIntraRequestReceived", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstLocalVideoFramePublished(const RtcConnection& connection, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstLocalVideoFramePublished", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstRemoteVideoDecoded(const RtcConnection& connection, uid_t remoteUid, int width, int height, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto widthCopy = width;
    auto heightCopy = height;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, widthCopy, heightCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstRemoteVideoDecoded", args);
        });
}

void RtcEngineEventHandlerExBridge::onVideoSizeChanged(const RtcConnection& connection, VIDEO_SOURCE_TYPE sourceType, uid_t uid, int width, int height, int rotation) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto sourceTypeCopy = sourceType;
    auto uidCopy = uid;
    auto widthCopy = width;
    auto heightCopy = height;
    auto rotationCopy = rotation;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, sourceTypeCopy, uidCopy, widthCopy, heightCopy, rotationCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, sourceTypeCopy);
            pushArg(args, uidCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            pushArg(args, rotationCopy);
            callHandler(self, "onVideoSizeChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteVideoStateChanged(const RtcConnection& connection, uid_t remoteUid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, stateCopy, reasonCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onRemoteVideoStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstRemoteVideoFrame(const RtcConnection& connection, uid_t remoteUid, int width, int height, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto widthCopy = width;
    auto heightCopy = height;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, widthCopy, heightCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstRemoteVideoFrame", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserJoined(const RtcConnection& connection, uid_t remoteUid, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onUserJoined", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserOffline(const RtcConnection& connection, uid_t remoteUid, USER_OFFLINE_REASON_TYPE reason) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, reasonCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onUserOffline", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserMuteAudio(const RtcConnection& connection, uid_t remoteUid, bool muted) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto mutedCopy = muted;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, mutedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, mutedCopy);
            callHandler(self, "onUserMuteAudio", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserMuteVideo(const RtcConnection& connection, uid_t remoteUid, bool muted) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto mutedCopy = muted;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, mutedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, mutedCopy);
            callHandler(self, "onUserMuteVideo", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserEnableVideo(const RtcConnection& connection, uid_t remoteUid, bool enabled) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto enabledCopy = enabled;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, enabledCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, enabledCopy);
            callHandler(self, "onUserEnableVideo", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserEnableLocalVideo(const RtcConnection& connection, uid_t remoteUid, bool enabled) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto enabledCopy = enabled;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, enabledCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, enabledCopy);
            callHandler(self, "onUserEnableLocalVideo", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserStateChanged(const RtcConnection& connection, uid_t remoteUid, uint32_t state) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto stateCopy = state;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, stateCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, stateCopy);
            callHandler(self, "onUserStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onLocalAudioStats(const RtcConnection& connection, const LocalAudioStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onLocalAudioStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteAudioStats(const RtcConnection& connection, const RemoteAudioStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onRemoteAudioStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onLocalVideoStats(const RtcConnection& connection, VIDEO_SOURCE_TYPE sourceType, const LocalVideoStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto sourceTypeCopy = sourceType;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, sourceTypeCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, sourceTypeCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onLocalVideoStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteVideoStats(const RtcConnection& connection, const RemoteVideoStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onRemoteVideoStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onConnectionLost(const RtcConnection& connection) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            callHandler(self, "onConnectionLost", args);
        });
}

void RtcEngineEventHandlerExBridge::onConnectionInterrupted(const RtcConnection& connection) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            callHandler(self, "onConnectionInterrupted", args);
        });
}

void RtcEngineEventHandlerExBridge::onConnectionBanned(const RtcConnection& connection) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            callHandler(self, "onConnectionBanned", args);
        });
}

void RtcEngineEventHandlerExBridge::onStreamMessage(const RtcConnection& connection, uid_t remoteUid, int streamId, const char* data, size_t length, uint64_t sentTs) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto streamIdCopy = streamId;
    std::vector<uint8_t> dataCopy(data != nullptr ? reinterpret_cast<const uint8_t*>(data) : nullptr,
                                  data != nullptr ? reinterpret_cast<const uint8_t*>(data) + length : nullptr);
    auto lengthCopy = length;
    auto sentTsCopy = sentTs;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, streamIdCopy, dataCopy, lengthCopy, sentTsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, streamIdCopy);
            se::HandleObject typedArr(se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, dataCopy.data(), dataCopy.size()));
            se::Value dataVal;
            dataVal.setObject(typedArr);
            args.push_back(dataVal);
            pushArg(args, lengthCopy);
            pushArg(args, sentTsCopy);
            callHandler(self, "onStreamMessage", args);
        });
}

void RtcEngineEventHandlerExBridge::onStreamMessageError(const RtcConnection& connection, uid_t remoteUid, int streamId, int code, int missed, int cached) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto streamIdCopy = streamId;
    auto codeCopy = code;
    auto missedCopy = missed;
    auto cachedCopy = cached;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, streamIdCopy, codeCopy, missedCopy, cachedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, streamIdCopy);
            pushArg(args, codeCopy);
            pushArg(args, missedCopy);
            pushArg(args, cachedCopy);
            callHandler(self, "onStreamMessageError", args);
        });
}

void RtcEngineEventHandlerExBridge::onRdtMessage(const RtcConnection& connection, uid_t userId, RdtStreamType type, const char *data, size_t length) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto userIdCopy = userId;
    auto typeCopy = type;
    std::string dataCopy(data != nullptr ? data : "", data != nullptr ? length : 0);
    auto lengthCopy = length;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, userIdCopy, typeCopy, dataCopy, lengthCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, userIdCopy);
            pushArg(args, typeCopy);
            pushArg(args, dataCopy);
            pushArg(args, lengthCopy);
            callHandler(self, "onRdtMessage", args);
        });
}

void RtcEngineEventHandlerExBridge::onRdtStateChanged(const RtcConnection& connection, uid_t userId, RdtState state) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto userIdCopy = userId;
    auto stateCopy = state;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, userIdCopy, stateCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, userIdCopy);
            pushArg(args, stateCopy);
            callHandler(self, "onRdtStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onMediaControlMessage(const RtcConnection& connection, uid_t userId, const char* data, size_t length) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto userIdCopy = userId;
    std::string dataCopy(data != nullptr ? data : "", data != nullptr ? length : 0);
    auto lengthCopy = length;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, userIdCopy, dataCopy, lengthCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, userIdCopy);
            pushArg(args, dataCopy);
            pushArg(args, lengthCopy);
            callHandler(self, "onMediaControlMessage", args);
        });
}

void RtcEngineEventHandlerExBridge::onRequestToken(const RtcConnection& connection) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            callHandler(self, "onRequestToken", args);
        });
}

void RtcEngineEventHandlerExBridge::onLicenseValidationFailure(const RtcConnection& connection, LICENSE_ERROR_TYPE reason) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, reasonCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onLicenseValidationFailure", args);
        });
}

void RtcEngineEventHandlerExBridge::onTokenPrivilegeWillExpire(const RtcConnection& connection, const char* token) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    std::string tokenCopy(token != nullptr ? token : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, tokenCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, tokenCopy);
            callHandler(self, "onTokenPrivilegeWillExpire", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstLocalAudioFramePublished(const RtcConnection& connection, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstLocalAudioFramePublished", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstRemoteAudioFrame(const RtcConnection& connection, uid_t userId, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto userIdCopy = userId;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, userIdCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, userIdCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstRemoteAudioFrame", args);
        });
}

void RtcEngineEventHandlerExBridge::onFirstRemoteAudioDecoded(const RtcConnection& connection, uid_t uid, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto uidCopy = uid;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, uidCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, uidCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onFirstRemoteAudioDecoded", args);
        });
}

void RtcEngineEventHandlerExBridge::onLocalAudioStateChanged(const RtcConnection& connection, LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_REASON reason) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, stateCopy, reasonCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onLocalAudioStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteAudioStateChanged(const RtcConnection& connection, uid_t remoteUid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto elapsedCopy = elapsed;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, stateCopy, reasonCopy, elapsedCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            pushArg(args, elapsedCopy);
            callHandler(self, "onRemoteAudioStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onActiveSpeaker(const RtcConnection& connection, uid_t uid) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto uidCopy = uid;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, uidCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, uidCopy);
            callHandler(self, "onActiveSpeaker", args);
        });
}

void RtcEngineEventHandlerExBridge::onClientRoleChanged(const RtcConnection& connection, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole, const ClientRoleOptions& newRoleOptions) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto oldRoleCopy = oldRole;
    auto newRoleCopy = newRole;
    auto newRoleOptionsCopy = newRoleOptions;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, oldRoleCopy, newRoleCopy, newRoleOptionsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, oldRoleCopy);
            pushArg(args, newRoleCopy);
            pushArg(args, newRoleOptionsCopy);
            callHandler(self, "onClientRoleChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onClientRoleChangeFailed(const RtcConnection& connection, CLIENT_ROLE_CHANGE_FAILED_REASON reason, CLIENT_ROLE_TYPE currentRole) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto reasonCopy = reason;
    auto currentRoleCopy = currentRole;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, reasonCopy, currentRoleCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, reasonCopy);
            pushArg(args, currentRoleCopy);
            callHandler(self, "onClientRoleChangeFailed", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteAudioTransportStats(const RtcConnection& connection, uid_t remoteUid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto delayCopy = delay;
    auto lostCopy = lost;
    auto rxKBitRateCopy = rxKBitRate;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, delayCopy, lostCopy, rxKBitRateCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, delayCopy);
            pushArg(args, lostCopy);
            pushArg(args, rxKBitRateCopy);
            callHandler(self, "onRemoteAudioTransportStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onRemoteVideoTransportStats(const RtcConnection& connection, uid_t remoteUid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    auto delayCopy = delay;
    auto lostCopy = lost;
    auto rxKBitRateCopy = rxKBitRate;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, delayCopy, lostCopy, rxKBitRateCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, delayCopy);
            pushArg(args, lostCopy);
            pushArg(args, rxKBitRateCopy);
            callHandler(self, "onRemoteVideoTransportStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onConnectionStateChanged(const RtcConnection& connection, CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, stateCopy, reasonCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onConnectionStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onNetworkTypeChanged(const RtcConnection& connection, NETWORK_TYPE type) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto typeCopy = type;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, typeCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, typeCopy);
            callHandler(self, "onNetworkTypeChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onEncryptionError(const RtcConnection& connection, ENCRYPTION_ERROR_TYPE errorType) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto errorTypeCopy = errorType;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, errorTypeCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, errorTypeCopy);
            callHandler(self, "onEncryptionError", args);
        });
}

void RtcEngineEventHandlerExBridge::onUploadLogResult(const RtcConnection& connection, const char* requestId, bool success, UPLOAD_ERROR_REASON reason) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    std::string requestIdCopy(requestId != nullptr ? requestId : "");
    auto successCopy = success;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, requestIdCopy, successCopy, reasonCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, requestIdCopy);
            pushArg(args, successCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onUploadLogResult", args);
        });
}

void RtcEngineEventHandlerExBridge::onUserAccountUpdated(const RtcConnection& connection, uid_t remoteUid, const char* remoteUserAccount) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto remoteUidCopy = remoteUid;
    std::string remoteUserAccountCopy(remoteUserAccount != nullptr ? remoteUserAccount : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, remoteUidCopy, remoteUserAccountCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, remoteUidCopy);
            pushArg(args, remoteUserAccountCopy);
            callHandler(self, "onUserAccountUpdated", args);
        });
}

void RtcEngineEventHandlerExBridge::onSnapshotTaken(const RtcConnection& connection, uid_t uid, const char* filePath, int width, int height, int errCode) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto uidCopy = uid;
    std::string filePathCopy(filePath != nullptr ? filePath : "");
    auto widthCopy = width;
    auto heightCopy = height;
    auto errCodeCopy = errCode;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, uidCopy, filePathCopy, widthCopy, heightCopy, errCodeCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, uidCopy);
            pushArg(args, filePathCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            pushArg(args, errCodeCopy);
            callHandler(self, "onSnapshotTaken", args);
        });
}

void RtcEngineEventHandlerExBridge::onVideoRenderingTracingResult(const RtcConnection& connection, uid_t uid, MEDIA_TRACE_EVENT currentEvent, VideoRenderingTracingInfo tracingInfo) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto uidCopy = uid;
    auto currentEventCopy = currentEvent;
    auto tracingInfoCopy = tracingInfo;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, uidCopy, currentEventCopy, tracingInfoCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, uidCopy);
            pushArg(args, currentEventCopy);
            pushArg(args, tracingInfoCopy);
            callHandler(self, "onVideoRenderingTracingResult", args);
        });
}

void RtcEngineEventHandlerExBridge::onSetRtmFlagResult(const RtcConnection& connection, int code) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto codeCopy = code;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, codeCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, codeCopy);
            callHandler(self, "onSetRtmFlagResult", args);
        });
}

void RtcEngineEventHandlerExBridge::onTranscodedStreamLayoutInfo(const RtcConnection& connection, uid_t uid, int width, int height, int layoutCount,const VideoLayout* layoutlist) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto uidCopy = uid;
    auto widthCopy = width;
    auto heightCopy = height;
    auto layoutCountCopy = layoutCount;
    std::vector<VideoLayout> layoutlistCopy(layoutlist, layoutlist != nullptr ? layoutlist + layoutCount : layoutlist);
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, uidCopy, widthCopy, heightCopy, layoutCountCopy, layoutlistCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, uidCopy);
            pushArg(args, widthCopy);
            pushArg(args, heightCopy);
            pushArg(args, static_cast<int32_t>(layoutCountCopy));
            pushArg(args, layoutlistCopy);
            callHandler(self, "onTranscodedStreamLayoutInfo", args);
        });
}

void RtcEngineEventHandlerExBridge::onAudioMetadataReceived(const RtcConnection& connection, uid_t uid, const char* metadata, size_t length) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto uidCopy = uid;
    std::vector<uint8_t> metadataCopy(metadata != nullptr ? reinterpret_cast<const uint8_t*>(metadata) : nullptr,
                                      metadata != nullptr ? reinterpret_cast<const uint8_t*>(metadata) + length : nullptr);
    auto lengthCopy = length;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, uidCopy, metadataCopy, lengthCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, uidCopy);
            se::HandleObject typedArr(se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, metadataCopy.data(), metadataCopy.size()));
            se::Value metadataVal;
            metadataVal.setObject(typedArr);
            args.push_back(metadataVal);
            pushArg(args, lengthCopy);
            callHandler(self, "onAudioMetadataReceived", args);
        });
}

void RtcEngineEventHandlerExBridge::onMultipathStats(const RtcConnection& connection, const MultipathStats& stats) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, statsCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, statsCopy);
            callHandler(self, "onMultipathStats", args);
        });
}

void RtcEngineEventHandlerExBridge::onRenewTokenResult(const RtcConnection& connection, const char* token, RENEW_TOKEN_ERROR_CODE code) {
    std::string channelIdCopy(connection.channelId != nullptr ? connection.channelId : "");
    agora::rtc::RtcConnection connCopy = connection;
    std::string tokenCopy(token != nullptr ? token : "");
    auto codeCopy = code;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelIdCopy, connCopy, tokenCopy, codeCopy]() mutable {
            connCopy.channelId = channelIdCopy.c_str();
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, connCopy);
            pushArg(args, tokenCopy);
            pushArg(args, codeCopy);
            callHandler(self, "onRenewTokenResult", args);
        });
}

void RtcEngineEventHandlerExBridge::onDirectCdnStreamingStateChanged(
    DIRECT_CDN_STREAMING_STATE state,
    DIRECT_CDN_STREAMING_REASON reason,
    const char *message) {
    auto stateCopy = state;
    auto reasonCopy = reason;
    std::string messageCopy(message != nullptr ? message : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, stateCopy, reasonCopy, messageCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            pushArg(args, messageCopy);
            callHandler(self, "onDirectCdnStreamingStateChanged", args);
        });
}

void RtcEngineEventHandlerExBridge::onDirectCdnStreamingStats(const DirectCdnStreamingStats &stats) {
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, statsCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, statsCopy);
            callHandler(self, "onDirectCdnStreamingStats", args);
        });
}
