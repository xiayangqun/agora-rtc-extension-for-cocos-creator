#include "agora/IRtcEngineEventHandlerBridge.h"

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"
#include "bindings/jswrapper/SeApi.h"

namespace {

se::Value makeConnectionValue(const std::string &channelId, agora::rtc::uid_t localUid) {
    se::HandleObject connection(se::Object::createPlainObject());
    connection->setProperty("channelId", se::Value(channelId));
    connection->setProperty("localUid", se::Value(static_cast<int32_t>(localUid)));
    se::Value value;
    value.setObject(connection);
    return value;
}

void callHandler(se::Object *handler, const char *method, const se::ValueArray &args) {
    if (handler == nullptr) {
        return;
    }

    se::Value callback;
    if (!handler->getProperty(method, &callback) || !callback.isObject() || !callback.toObject()->isFunction()) {
        return;
    }

    auto *scriptEngine = se::ScriptEngine::getInstance();
    if (scriptEngine == nullptr || !scriptEngine->isValid()) {
        return;
    }

    scriptEngine->clearException();
    callback.toObject()->call(args, handler);
}

bool isScriptEngineValid() {
    auto *scriptEngine = se::ScriptEngine::getInstance();
    return scriptEngine != nullptr && scriptEngine->isValid();
}

} // namespace

IRtcEngineEventHandlerBridge::IRtcEngineEventHandlerBridge(se::Object *eventHandler)
    : _eventHandler(eventHandler) {
    if (_eventHandler != nullptr) {
        _eventHandler->incRef();
        _eventHandler->root();
    }
}

IRtcEngineEventHandlerBridge::~IRtcEngineEventHandlerBridge() {
    if (_eventHandler != nullptr) {
        _eventHandler->unroot();
        _eventHandler->decRef();
        _eventHandler = nullptr;
    }
}

// ===== Priority callbacks =================================================

void IRtcEngineEventHandlerBridge::onJoinChannelSuccess(
    const char *channel, agora::rtc::uid_t uid, int elapsed) {
    std::string channelId(channel ? channel : "");
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        _channelId = channelId;
        _localUid = uid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, channelId, uid, elapsed]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        args.push_back(makeConnectionValue(channelId, uid));
        args.push_back(se::Value(elapsed));
        callHandler(self->_eventHandler, "onJoinChannelSuccess", args);
    });
}

void IRtcEngineEventHandlerBridge::onUserJoined(agora::rtc::uid_t uid, int elapsed) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onUserJoined", args);
        });
}

void IRtcEngineEventHandlerBridge::onUserOffline(
    agora::rtc::uid_t uid, agora::rtc::USER_OFFLINE_REASON_TYPE reason) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, reasonInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(reasonInt));
            callHandler(self->_eventHandler, "onUserOffline", args);
        });
}

void IRtcEngineEventHandlerBridge::onConnectionStateChanged(
    agora::rtc::CONNECTION_STATE_TYPE state,
    agora::rtc::CONNECTION_CHANGED_REASON_TYPE reason) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int stateInt = static_cast<int>(state);
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, stateInt, reasonInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(stateInt));
            args.push_back(se::Value(reasonInt));
            callHandler(self->_eventHandler, "onConnectionStateChanged", args);
        });
}

void IRtcEngineEventHandlerBridge::onError(int err, const char *msg) {
    std::string msgStr(msg ? msg : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, err, msgStr]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(err));
            args.push_back(se::Value(msgStr));
            callHandler(self->_eventHandler, "onError", args);
        });
}

void IRtcEngineEventHandlerBridge::onLeaveChannel(const agora::rtc::RtcStats &stats) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    // Copy stats data
    int duration = stats.duration;
    int txBytes = stats.txBytes;
    int rxBytes = stats.rxBytes;
    int txAudioBytes = stats.txAudioBytes;
    int txVideoBytes = stats.txVideoBytes;
    int rxAudioBytes = stats.rxAudioBytes;
    int rxVideoBytes = stats.rxVideoBytes;
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, duration, txBytes, rxBytes,
         txAudioBytes, txVideoBytes, rxAudioBytes, rxVideoBytes]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject statsObj(se::Object::createPlainObject());
            statsObj->setProperty("duration", se::Value(duration));
            statsObj->setProperty("txBytes", se::Value(txBytes));
            statsObj->setProperty("rxBytes", se::Value(rxBytes));
            statsObj->setProperty("txAudioBytes", se::Value(txAudioBytes));
            statsObj->setProperty("txVideoBytes", se::Value(txVideoBytes));
            statsObj->setProperty("rxAudioBytes", se::Value(rxAudioBytes));
            statsObj->setProperty("rxVideoBytes", se::Value(rxVideoBytes));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(statsObj));
            callHandler(self->_eventHandler, "onLeaveChannel", args);
        });
}

void IRtcEngineEventHandlerBridge::onRejoinChannelSuccess(
    const char *channel, agora::rtc::uid_t uid, int elapsed) {
    std::string channelId(channel ? channel : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, uid, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, uid));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onRejoinChannelSuccess", args);
        });
}

void IRtcEngineEventHandlerBridge::onTokenPrivilegeWillExpire(const char *token) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    std::string tokenStr(token ? token : "");
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, tokenStr]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(tokenStr));
            callHandler(self->_eventHandler, "onTokenPrivilegeWillExpire", args);
        });
}

void IRtcEngineEventHandlerBridge::onRequestToken() {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            callHandler(self->_eventHandler, "onRequestToken", args);
        });
}

// ===== Video callbacks ====================================================

void IRtcEngineEventHandlerBridge::onFirstLocalVideoFrame(
    agora::rtc::VIDEO_SOURCE_TYPE source,
    int width, int height, int elapsed) {
    auto self = shared_from_this();
    int sourceInt = static_cast<int>(source);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, sourceInt, width, height, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(sourceInt));
            args.push_back(se::Value(width));
            args.push_back(se::Value(height));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onFirstLocalVideoFrame", args);
        });
}

void IRtcEngineEventHandlerBridge::onFirstRemoteVideoDecoded(
    agora::rtc::uid_t uid, int width, int height, int elapsed) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, width, height, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(width));
            args.push_back(se::Value(height));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onFirstRemoteVideoDecoded", args);
        });
}

void IRtcEngineEventHandlerBridge::onVideoSizeChanged(
    agora::rtc::VIDEO_SOURCE_TYPE sourceType, agora::rtc::uid_t uid,
    int width, int height, int rotation) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int sourceInt = static_cast<int>(sourceType);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, sourceInt, uid, width, height, rotation]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(sourceInt));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(width));
            args.push_back(se::Value(height));
            args.push_back(se::Value(rotation));
            callHandler(self->_eventHandler, "onVideoSizeChanged", args);
        });
}

void IRtcEngineEventHandlerBridge::onRemoteVideoStateChanged(
    agora::rtc::uid_t uid, agora::rtc::REMOTE_VIDEO_STATE state,
    agora::rtc::REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int stateInt = static_cast<int>(state);
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, stateInt, reasonInt, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(stateInt));
            args.push_back(se::Value(reasonInt));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onRemoteVideoStateChanged", args);
        });
}

// ===== Audio callbacks ====================================================

void IRtcEngineEventHandlerBridge::onAudioVolumeIndication(
    const agora::rtc::AudioVolumeInfo *speakers, unsigned int speakerNumber, int totalVolume) {
    if (speakers == nullptr || speakerNumber == 0) {
        return;
    }

    auto self = shared_from_this();
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    // Deep-copy the speakers array
    struct SpeakerInfo {
        agora::rtc::uid_t uid;
        unsigned int volume;
        unsigned int vad;
        std::string channelId;
    };
    std::vector<SpeakerInfo> speakerCopy;
    speakerCopy.reserve(speakerNumber);
    for (unsigned int i = 0; i < speakerNumber; ++i) {
        SpeakerInfo info;
        info.uid = speakers[i].uid;
        info.volume = speakers[i].volume;
        info.vad = speakers[i].vad;
        info.channelId = speakers[i].channelId ? speakers[i].channelId : "";
        speakerCopy.push_back(info);
    }

    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, speakerCopy, totalVolume]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject speakersArray(se::Object::createArrayObject(speakerCopy.size()));
            for (size_t i = 0; i < speakerCopy.size(); ++i) {
                se::HandleObject speakerObj(se::Object::createPlainObject());
                speakerObj->setProperty("uid", se::Value(static_cast<int32_t>(speakerCopy[i].uid)));
                speakerObj->setProperty("volume", se::Value(static_cast<int32_t>(speakerCopy[i].volume)));
                speakerObj->setProperty("vad", se::Value(static_cast<int32_t>(speakerCopy[i].vad)));
                speakerObj->setProperty("channelId", se::Value(speakerCopy[i].channelId));
                speakersArray->setArrayElement(static_cast<unsigned int>(i), se::Value(speakerObj));
            }

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(speakersArray));
            args.push_back(se::Value(static_cast<int32_t>(speakerCopy.size())));
            args.push_back(se::Value(totalVolume));
            callHandler(self->_eventHandler, "onAudioVolumeIndication", args);
        });
}

void IRtcEngineEventHandlerBridge::onActiveSpeaker(agora::rtc::uid_t uid) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            callHandler(self->_eventHandler, "onActiveSpeaker", args);
        });
}

void IRtcEngineEventHandlerBridge::onFirstLocalAudioFramePublished(int elapsed) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onFirstLocalAudioFramePublished", args);
        });
}

void IRtcEngineEventHandlerBridge::onFirstRemoteAudioFrame(
    agora::rtc::uid_t uid, int elapsed) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onFirstRemoteAudioFrame", args);
        });
}

void IRtcEngineEventHandlerBridge::onLocalAudioStateChanged(
    agora::rtc::LOCAL_AUDIO_STREAM_STATE state,
    agora::rtc::LOCAL_AUDIO_STREAM_REASON reason) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int stateInt = static_cast<int>(state);
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, stateInt, reasonInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(stateInt));
            args.push_back(se::Value(reasonInt));
            callHandler(self->_eventHandler, "onLocalAudioStateChanged", args);
        });
}

void IRtcEngineEventHandlerBridge::onRemoteAudioStateChanged(
    agora::rtc::uid_t uid, agora::rtc::REMOTE_AUDIO_STATE state,
    agora::rtc::REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int stateInt = static_cast<int>(state);
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, stateInt, reasonInt, elapsed]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(stateInt));
            args.push_back(se::Value(reasonInt));
            args.push_back(se::Value(elapsed));
            callHandler(self->_eventHandler, "onRemoteAudioStateChanged", args);
        });
}

// ===== User mute callbacks ================================================

void IRtcEngineEventHandlerBridge::onUserMuteAudio(agora::rtc::uid_t uid, bool muted) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, muted]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(muted));
            callHandler(self->_eventHandler, "onUserMuteAudio", args);
        });
}

void IRtcEngineEventHandlerBridge::onUserMuteVideo(agora::rtc::uid_t uid, bool muted) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, muted]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(muted));
            callHandler(self->_eventHandler, "onUserMuteVideo", args);
        });
}

// ===== Network / quality callbacks ========================================

void IRtcEngineEventHandlerBridge::onRtcStats(const agora::rtc::RtcStats &stats) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int duration = stats.duration;
    int txBytes = stats.txBytes;
    int rxBytes = stats.rxBytes;
    int txAudioBytes = stats.txAudioBytes;
    int txVideoBytes = stats.txVideoBytes;
    int rxAudioBytes = stats.rxAudioBytes;
    int rxVideoBytes = stats.rxVideoBytes;
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, duration, txBytes, rxBytes,
         txAudioBytes, txVideoBytes, rxAudioBytes, rxVideoBytes]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject statsObj(se::Object::createPlainObject());
            statsObj->setProperty("duration", se::Value(duration));
            statsObj->setProperty("txBytes", se::Value(txBytes));
            statsObj->setProperty("rxBytes", se::Value(rxBytes));
            statsObj->setProperty("txAudioBytes", se::Value(txAudioBytes));
            statsObj->setProperty("txVideoBytes", se::Value(txVideoBytes));
            statsObj->setProperty("rxAudioBytes", se::Value(rxAudioBytes));
            statsObj->setProperty("rxVideoBytes", se::Value(rxVideoBytes));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(statsObj));
            callHandler(self->_eventHandler, "onRtcStats", args);
        });
}

void IRtcEngineEventHandlerBridge::onNetworkQuality(
    agora::rtc::uid_t uid, int txQuality, int rxQuality) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, txQuality, rxQuality]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(txQuality));
            args.push_back(se::Value(rxQuality));
            callHandler(self->_eventHandler, "onNetworkQuality", args);
        });
}

void IRtcEngineEventHandlerBridge::onLastmileQuality(int quality) {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, quality]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(quality));
            callHandler(self->_eventHandler, "onLastmileQuality", args);
        });
}

void IRtcEngineEventHandlerBridge::onNetworkTypeChanged(agora::rtc::NETWORK_TYPE type) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int typeInt = static_cast<int>(type);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, typeInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(typeInt));
            callHandler(self->_eventHandler, "onNetworkTypeChanged", args);
        });
}

// ===== Stream message =====================================================

void IRtcEngineEventHandlerBridge::onStreamMessage(
    agora::rtc::uid_t uid, int streamId,
    const char *data, size_t length, uint64_t sentTs) {
    if (data == nullptr || length == 0) {
        return;
    }

    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    // Deep-copy the data
    std::vector<char> dataCopy(data, data + length);

    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, streamId, dataCopy, length, sentTs]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;

            // Create ArrayBuffer from copied data
            se::HandleObject arrayBuffer(se::Object::createArrayBufferObject(
                reinterpret_cast<const uint8_t *>(dataCopy.data()), length));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(streamId));
            args.push_back(se::Value(arrayBuffer));
            args.push_back(se::Value(static_cast<int32_t>(length)));
            args.push_back(se::Value(static_cast<double>(sentTs)));
            callHandler(self->_eventHandler, "onStreamMessage", args);
        });
}

// ===== Client role ========================================================

void IRtcEngineEventHandlerBridge::onClientRoleChanged(
    agora::rtc::CLIENT_ROLE_TYPE oldRole,
    agora::rtc::CLIENT_ROLE_TYPE newRole,
    const agora::rtc::ClientRoleOptions &newRoleOptions) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int oldRoleInt = static_cast<int>(oldRole);
    int newRoleInt = static_cast<int>(newRole);
    int latencyLvl = static_cast<int>(newRoleOptions.audienceLatencyLevel);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, oldRoleInt, newRoleInt, latencyLvl]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;

            se::HandleObject optsObj(se::Object::createPlainObject());
            optsObj->setProperty("audienceLatencyLevel", se::Value(latencyLvl));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(oldRoleInt));
            args.push_back(se::Value(newRoleInt));
            args.push_back(se::Value(optsObj));
            callHandler(self->_eventHandler, "onClientRoleChanged", args);
        });
}

// ===== Local user =========================================================

void IRtcEngineEventHandlerBridge::onLocalUserRegistered(
    agora::rtc::uid_t uid, const char *userAccount) {
    auto self = shared_from_this();
    std::string account(userAccount ? userAccount : "");
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, uid, account]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(account));
            callHandler(self->_eventHandler, "onLocalUserRegistered", args);
        });
}

void IRtcEngineEventHandlerBridge::onUserInfoUpdated(
    agora::rtc::uid_t uid, const agora::rtc::UserInfo &info) {
    auto self = shared_from_this();
    std::string account(info.userAccount ? info.userAccount : "");
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, uid, account]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject infoObj(se::Object::createPlainObject());
            infoObj->setProperty("uid", se::Value(static_cast<int32_t>(uid)));
            infoObj->setProperty("userAccount", se::Value(account));
            se::ValueArray args;
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(infoObj));
            callHandler(self->_eventHandler, "onUserInfoUpdated", args);
        });
}

// ===== Camera =============================================================

void IRtcEngineEventHandlerBridge::onCameraReady() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            callHandler(self->_eventHandler, "onCameraReady", args);
        });
}

void IRtcEngineEventHandlerBridge::onCameraFocusAreaChanged(
    int x, int y, int width, int height) {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, x, y, width, height]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(x));
            args.push_back(se::Value(y));
            args.push_back(se::Value(width));
            args.push_back(se::Value(height));
            callHandler(self->_eventHandler, "onCameraFocusAreaChanged", args);
        });
}

// ===== Audio routing ======================================================

void IRtcEngineEventHandlerBridge::onAudioRoutingChanged(int routing) {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, routing]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(routing));
            callHandler(self->_eventHandler, "onAudioRoutingChanged", args);
        });
}

// ===== Permission =========================================================

void IRtcEngineEventHandlerBridge::onPermissionError(
    agora::rtc::PERMISSION_TYPE permissionType) {
    auto self = shared_from_this();
    int permInt = static_cast<int>(permissionType);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, permInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(permInt));
            callHandler(self->_eventHandler, "onPermissionError", args);
        });
}

// ===== Audio device =======================================================

void IRtcEngineEventHandlerBridge::onAudioDeviceStateChanged(
    const char *deviceId, int deviceType, int deviceState) {
    auto self = shared_from_this();
    std::string devId(deviceId ? deviceId : "");
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, devId, deviceType, deviceState]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(devId));
            args.push_back(se::Value(deviceType));
            args.push_back(se::Value(deviceState));
            callHandler(self->_eventHandler, "onAudioDeviceStateChanged", args);
        });
}

// ===== Video device =======================================================

void IRtcEngineEventHandlerBridge::onVideoDeviceStateChanged(
    const char *deviceId, int deviceType, int deviceState) {
    auto self = shared_from_this();
    std::string devId(deviceId ? deviceId : "");
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, devId, deviceType, deviceState]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(devId));
            args.push_back(se::Value(deviceType));
            args.push_back(se::Value(deviceState));
            callHandler(self->_eventHandler, "onVideoDeviceStateChanged", args);
        });
}

// ===== Local video stats ==================================================

void IRtcEngineEventHandlerBridge::onLocalVideoStats(
    agora::rtc::VIDEO_SOURCE_TYPE source,
    const agora::rtc::LocalVideoStats &stats) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int sourceInt = static_cast<int>(source);
    int sentBitrate = stats.sentBitrate;
    int sentFrameRate = stats.sentFrameRate;
    int encoderOutputFrameRate = stats.encoderOutputFrameRate;
    int rendererOutputFrameRate = stats.rendererOutputFrameRate;
    int targetBitrate = stats.targetBitrate;
    int targetFrameRate = stats.targetFrameRate;
    int qualityAdaptIndication = static_cast<int>(stats.qualityAdaptIndication);
    int encodedBitrate = stats.encodedBitrate;
    int encodedFrameWidth = stats.encodedFrameWidth;
    int encodedFrameHeight = stats.encodedFrameHeight;
    int encodedFrameCount = stats.encodedFrameCount;
    int codecType = static_cast<int>(stats.codecType);
    int txPacketLossRate = stats.txPacketLossRate;
    int captureFrameRate = stats.captureFrameRate;
    int captureBrightnessLevel = static_cast<int>(stats.captureBrightnessLevel);

    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, sourceInt, sentBitrate, sentFrameRate,
         encoderOutputFrameRate, rendererOutputFrameRate, targetBitrate,
         targetFrameRate, qualityAdaptIndication, encodedBitrate,
         encodedFrameWidth, encodedFrameHeight, encodedFrameCount,
         codecType, txPacketLossRate, captureFrameRate, captureBrightnessLevel]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject statsObj(se::Object::createPlainObject());
            statsObj->setProperty("sentBitrate", se::Value(sentBitrate));
            statsObj->setProperty("sentFrameRate", se::Value(sentFrameRate));
            statsObj->setProperty("encoderOutputFrameRate", se::Value(encoderOutputFrameRate));
            statsObj->setProperty("rendererOutputFrameRate", se::Value(rendererOutputFrameRate));
            statsObj->setProperty("targetBitrate", se::Value(targetBitrate));
            statsObj->setProperty("targetFrameRate", se::Value(targetFrameRate));
            statsObj->setProperty("qualityAdaptIndication", se::Value(qualityAdaptIndication));
            statsObj->setProperty("encodedBitrate", se::Value(encodedBitrate));
            statsObj->setProperty("encodedFrameWidth", se::Value(encodedFrameWidth));
            statsObj->setProperty("encodedFrameHeight", se::Value(encodedFrameHeight));
            statsObj->setProperty("encodedFrameCount", se::Value(encodedFrameCount));
            statsObj->setProperty("codecType", se::Value(codecType));
            statsObj->setProperty("txPacketLossRate", se::Value(txPacketLossRate));
            statsObj->setProperty("captureFrameRate", se::Value(captureFrameRate));
            statsObj->setProperty("captureBrightnessLevel", se::Value(captureBrightnessLevel));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(sourceInt));
            args.push_back(se::Value(statsObj));
            callHandler(self->_eventHandler, "onLocalVideoStats", args);
        });
}

// ===== Remote video stats =================================================

void IRtcEngineEventHandlerBridge::onRemoteVideoStats(
    const agora::rtc::RemoteVideoStats &stats) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int uid = static_cast<int32_t>(stats.uid);
    int width = stats.width;
    int height = stats.height;
    int receivedBitrate = stats.receivedBitrate;
    int decoderOutputFrameRate = stats.decoderOutputFrameRate;
    int rendererOutputFrameRate = stats.rendererOutputFrameRate;
    int packetLossRate = stats.packetLossRate;
    int rxStreamType = static_cast<int>(stats.rxStreamType);
    int totalFrozenTime = stats.totalFrozenTime;
    int frozenRate = stats.frozenRate;
    int totalDecodedFrames = stats.totalDecodedFrames;
    int avSyncTimeMs = stats.avSyncTimeMs;

    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, width, height, receivedBitrate,
         decoderOutputFrameRate, rendererOutputFrameRate, packetLossRate,
         rxStreamType, totalFrozenTime, frozenRate, totalDecodedFrames,
         avSyncTimeMs]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject statsObj(se::Object::createPlainObject());
            statsObj->setProperty("uid", se::Value(uid));
            statsObj->setProperty("width", se::Value(width));
            statsObj->setProperty("height", se::Value(height));
            statsObj->setProperty("receivedBitrate", se::Value(receivedBitrate));
            statsObj->setProperty("decoderOutputFrameRate", se::Value(decoderOutputFrameRate));
            statsObj->setProperty("rendererOutputFrameRate", se::Value(rendererOutputFrameRate));
            statsObj->setProperty("packetLossRate", se::Value(packetLossRate));
            statsObj->setProperty("rxStreamType", se::Value(rxStreamType));
            statsObj->setProperty("totalFrozenTime", se::Value(totalFrozenTime));
            statsObj->setProperty("frozenRate", se::Value(frozenRate));
            statsObj->setProperty("totalDecodedFrames", se::Value(totalDecodedFrames));
            statsObj->setProperty("avSyncTimeMs", se::Value(avSyncTimeMs));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(statsObj));
            callHandler(self->_eventHandler, "onRemoteVideoStats", args);
        });
}

// ===== Remote audio stats =================================================

void IRtcEngineEventHandlerBridge::onRemoteAudioStats(
    const agora::rtc::RemoteAudioStats &stats) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int uid = static_cast<int32_t>(stats.uid);
    int quality = stats.quality;
    int networkTransportDelay = stats.networkTransportDelay;
    int jitterBufferDelay = stats.jitterBufferDelay;
    int audioLossRate = stats.audioLossRate;
    int numChannels = stats.numChannels;
    int receivedSampleRate = stats.receivedSampleRate;
    int receivedBitrate = stats.receivedBitrate;
    int totalFrozenTime = stats.totalFrozenTime;
    int frozenRate = stats.frozenRate;
    int mosValue = stats.mosValue;
    int frozenRateByCustomPlayoutCount = stats.frozenRateByCustomPlayoutCount;
    int e2eDelay = stats.e2eDelay;

    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, quality, networkTransportDelay,
         jitterBufferDelay, audioLossRate, numChannels, receivedSampleRate,
         receivedBitrate, totalFrozenTime, frozenRate, mosValue,
         frozenRateByCustomPlayoutCount, e2eDelay]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject statsObj(se::Object::createPlainObject());
            statsObj->setProperty("uid", se::Value(uid));
            statsObj->setProperty("quality", se::Value(quality));
            statsObj->setProperty("networkTransportDelay", se::Value(networkTransportDelay));
            statsObj->setProperty("jitterBufferDelay", se::Value(jitterBufferDelay));
            statsObj->setProperty("audioLossRate", se::Value(audioLossRate));
            statsObj->setProperty("numChannels", se::Value(numChannels));
            statsObj->setProperty("receivedSampleRate", se::Value(receivedSampleRate));
            statsObj->setProperty("receivedBitrate", se::Value(receivedBitrate));
            statsObj->setProperty("totalFrozenTime", se::Value(totalFrozenTime));
            statsObj->setProperty("frozenRate", se::Value(frozenRate));
            statsObj->setProperty("mosValue", se::Value(mosValue));
            statsObj->setProperty("frozenRateByCustomPlayoutCount",
                se::Value(frozenRateByCustomPlayoutCount));
            statsObj->setProperty("e2eDelay", se::Value(e2eDelay));

            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(statsObj));
            callHandler(self->_eventHandler, "onRemoteAudioStats", args);
        });
}

// ===== Audio mixing =======================================================

void IRtcEngineEventHandlerBridge::onAudioMixingFinished() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            callHandler(self->_eventHandler, "onAudioMixingFinished", args);
        });
}

void IRtcEngineEventHandlerBridge::onAudioMixingStateChanged(
    agora::rtc::AUDIO_MIXING_STATE_TYPE state,
    agora::rtc::AUDIO_MIXING_REASON_TYPE reason) {
    auto self = shared_from_this();
    int stateInt = static_cast<int>(state);
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, stateInt, reasonInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(stateInt));
            args.push_back(se::Value(reasonInt));
            callHandler(self->_eventHandler, "onAudioMixingStateChanged", args);
        });
}

// ===== Audio effect =======================================================

void IRtcEngineEventHandlerBridge::onAudioEffectFinished(int soundId) {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, soundId]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(soundId));
            callHandler(self->_eventHandler, "onAudioEffectFinished", args);
        });
}

// ===== Uplink =============================================================

void IRtcEngineEventHandlerBridge::onUplinkNetworkInfoUpdated(
    const agora::rtc::UplinkNetworkInfo &info) {
    auto self = shared_from_this();
    int videoEncodecMode = static_cast<int>(info.video_encoder_info.encodec_mode);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, videoEncodecMode]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::HandleObject infoObj(se::Object::createPlainObject());
            se::HandleObject encInfo(se::Object::createPlainObject());
            encInfo->setProperty("encodecMode", se::Value(videoEncodecMode));
            infoObj->setProperty("videoEncoderInfo", se::Value(encInfo));
            se::ValueArray args;
            args.push_back(se::Value(infoObj));
            callHandler(self->_eventHandler, "onUplinkNetworkInfoUpdated", args);
        });
}

// ===== Encryption =========================================================

void IRtcEngineEventHandlerBridge::onEncryptionError(
    agora::rtc::ENCRYPTION_ERROR_TYPE errorType) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    int errorInt = static_cast<int>(errorType);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, errorInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(errorInt));
            callHandler(self->_eventHandler, "onEncryptionError", args);
        });
}

// ===== Upload log =========================================================

void IRtcEngineEventHandlerBridge::onUploadLogResult(
    const char *requestId, bool success,
    agora::rtc::UPLOAD_ERROR_REASON reason) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    std::string reqId(requestId ? requestId : "");
    int reasonInt = static_cast<int>(reason);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, reqId, success, reasonInt]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(reqId));
            args.push_back(se::Value(success));
            args.push_back(se::Value(reasonInt));
            callHandler(self->_eventHandler, "onUploadLogResult", args);
        });
}

// ===== Subscription state =================================================

void IRtcEngineEventHandlerBridge::onAudioSubscribeStateChanged(
    const char *channel, agora::rtc::uid_t uid,
    agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
    agora::rtc::STREAM_SUBSCRIBE_STATE newState,
    int elapseSinceLastState) {
    auto self = shared_from_this();
    std::string ch(channel ? channel : "");
    int oldStateInt = static_cast<int>(oldState);
    int newStateInt = static_cast<int>(newState);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, ch, uid, oldStateInt, newStateInt, elapseSinceLastState]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(ch));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(oldStateInt));
            args.push_back(se::Value(newStateInt));
            args.push_back(se::Value(elapseSinceLastState));
            callHandler(self->_eventHandler, "onAudioSubscribeStateChanged", args);
        });
}

void IRtcEngineEventHandlerBridge::onVideoSubscribeStateChanged(
    const char *channel, agora::rtc::uid_t uid,
    agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
    agora::rtc::STREAM_SUBSCRIBE_STATE newState,
    int elapseSinceLastState) {
    auto self = shared_from_this();
    std::string ch(channel ? channel : "");
    int oldStateInt = static_cast<int>(oldState);
    int newStateInt = static_cast<int>(newState);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, ch, uid, oldStateInt, newStateInt, elapseSinceLastState]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(ch));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(oldStateInt));
            args.push_back(se::Value(newStateInt));
            args.push_back(se::Value(elapseSinceLastState));
            callHandler(self->_eventHandler, "onVideoSubscribeStateChanged", args);
        });
}

// ===== Publish state ======================================================

void IRtcEngineEventHandlerBridge::onAudioPublishStateChanged(
    const char *channel,
    agora::rtc::STREAM_PUBLISH_STATE oldState,
    agora::rtc::STREAM_PUBLISH_STATE newState,
    int elapseSinceLastState) {
    auto self = shared_from_this();
    std::string ch(channel ? channel : "");
    int oldStateInt = static_cast<int>(oldState);
    int newStateInt = static_cast<int>(newState);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, ch, oldStateInt, newStateInt, elapseSinceLastState]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(ch));
            args.push_back(se::Value(oldStateInt));
            args.push_back(se::Value(newStateInt));
            args.push_back(se::Value(elapseSinceLastState));
            callHandler(self->_eventHandler, "onAudioPublishStateChanged", args);
        });
}

void IRtcEngineEventHandlerBridge::onVideoPublishStateChanged(
    agora::rtc::VIDEO_SOURCE_TYPE source, const char *channel,
    agora::rtc::STREAM_PUBLISH_STATE oldState,
    agora::rtc::STREAM_PUBLISH_STATE newState,
    int elapseSinceLastState) {
    auto self = shared_from_this();
    int sourceInt = static_cast<int>(source);
    std::string ch(channel ? channel : "");
    int oldStateInt = static_cast<int>(oldState);
    int newStateInt = static_cast<int>(newState);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, sourceInt, ch, oldStateInt, newStateInt, elapseSinceLastState]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(se::Value(sourceInt));
            args.push_back(se::Value(ch));
            args.push_back(se::Value(oldStateInt));
            args.push_back(se::Value(newStateInt));
            args.push_back(se::Value(elapseSinceLastState));
            callHandler(self->_eventHandler, "onVideoPublishStateChanged", args);
        });
}

// ===== Others =============================================================

void IRtcEngineEventHandlerBridge::onSnapshotTaken(
    agora::rtc::uid_t uid, const char *filePath,
    int width, int height, int errCode) {
    std::string channelId;
    agora::rtc::uid_t localUid = 0;
    {
        std::lock_guard<std::mutex> lock(_connectionMutex);
        channelId = _channelId;
        localUid = _localUid;
    }

    auto self = shared_from_this();
    std::string path(filePath ? filePath : "");
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, channelId, localUid, uid, path, width, height, errCode]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            args.push_back(makeConnectionValue(channelId, localUid));
            args.push_back(se::Value(static_cast<int32_t>(uid)));
            args.push_back(se::Value(path));
            args.push_back(se::Value(width));
            args.push_back(se::Value(height));
            args.push_back(se::Value(errCode));
            callHandler(self->_eventHandler, "onSnapshotTaken", args);
        });
}
