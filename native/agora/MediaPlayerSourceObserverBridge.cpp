#include "agora/MediaPlayerSourceObserverBridge.h"

#include <string>

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"

MediaPlayerSourceObserverBridge::MediaPlayerSourceObserverBridge(se::Object *eventHandler)
    : ObserverBridgeBase(eventHandler) {}

void MediaPlayerSourceObserverBridge::onPlayerSourceStateChanged(agora::media::base::MEDIA_PLAYER_STATE state,
                                                                    agora::media::base::MEDIA_PLAYER_REASON reason) {
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, stateCopy, reasonCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, stateCopy);
        pushArg(args, reasonCopy);
        callHandler(self, "onPlayerSourceStateChanged", args);
    });
}

void MediaPlayerSourceObserverBridge::onPositionChanged(int64_t positionMs, int64_t timestampMs) {
    auto positionMsCopy = positionMs;
    auto timestampMsCopy = timestampMs;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, positionMsCopy, timestampMsCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, positionMsCopy);
        pushArg(args, timestampMsCopy);
        callHandler(self, "onPositionChanged", args);
    });
}

void MediaPlayerSourceObserverBridge::onPlayerEvent(agora::media::base::MEDIA_PLAYER_EVENT eventCode,
                                                       int64_t elapsedTime, const char *message) {
    auto eventCodeCopy = eventCode;
    auto elapsedTimeCopy = elapsedTime;
    std::string messageCopy(message != nullptr ? message : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, eventCodeCopy, elapsedTimeCopy, messageCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, eventCodeCopy);
            pushArg(args, elapsedTimeCopy);
            pushArg(args, messageCopy);
            callHandler(self, "onPlayerEvent", args);
        });
}

void MediaPlayerSourceObserverBridge::onMetaData(const void *data, int length) {
    //todo 等到处理buffer的时候一起处理
    std::string dataCopy(data != nullptr ? static_cast<const char *>(data) : "",
                         data != nullptr ? static_cast<size_t>(length) : 0);
    auto lengthCopy = length;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, dataCopy, lengthCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, dataCopy);
        pushArg(args, lengthCopy);
        callHandler(self, "onMetaData", args);
    });
}

void MediaPlayerSourceObserverBridge::onPlayBufferUpdated(int64_t playCachedBuffer) {
    auto playCachedBufferCopy = playCachedBuffer;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, playCachedBufferCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, playCachedBufferCopy);
        callHandler(self, "onPlayBufferUpdated", args);
    });
}

void MediaPlayerSourceObserverBridge::onPreloadEvent(const char *src,
                                                        agora::media::base::PLAYER_PRELOAD_EVENT event) {
    std::string srcCopy(src != nullptr ? src : "");
    auto eventCopy = event;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, srcCopy, eventCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, srcCopy);
        pushArg(args, eventCopy);
        callHandler(self, "onPreloadEvent", args);
    });
}

void MediaPlayerSourceObserverBridge::onCompleted() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        callHandler(self, "onCompleted", args);
    });
}

void MediaPlayerSourceObserverBridge::onAgoraCDNTokenWillExpire() {
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        callHandler(self, "onAgoraCDNTokenWillExpire", args);
    });
}

void MediaPlayerSourceObserverBridge::onPlayerSrcInfoChanged(const agora::media::base::SrcInfo &from,
                                                                const agora::media::base::SrcInfo &to) {
    std::string fromName(from.name != nullptr ? from.name : "");
    std::string toName(to.name != nullptr ? to.name : "");
    agora::media::base::SrcInfo fromCopy = from;
    fromCopy.name = fromName.c_str();
    agora::media::base::SrcInfo toCopy = to;
    toCopy.name = toName.c_str();
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, fromName, toName, fromCopy, toCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, fromCopy);
        pushArg(args, toCopy);
        callHandler(self, "onPlayerSrcInfoChanged", args);
    });
}

void MediaPlayerSourceObserverBridge::onPlayerInfoUpdated(const agora::media::base::PlayerUpdatedInfo &info) {
    std::string uuid(info.internalPlayerUuid != nullptr ? info.internalPlayerUuid : "");
    std::string deviceId(info.deviceId != nullptr ? info.deviceId : "");
    agora::media::base::PlayerUpdatedInfo infoCopy = info;
    infoCopy.internalPlayerUuid = uuid.c_str();
    infoCopy.deviceId = deviceId.c_str();
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, uuid, deviceId, infoCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, infoCopy);
        callHandler(self, "onPlayerInfoUpdated", args);
    });
}

void MediaPlayerSourceObserverBridge::onPlayerCacheStats(const agora::media::base::CacheStatistics &stats) {
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, statsCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, statsCopy);
        callHandler(self, "onPlayerCacheStats", args);
    });
}

void MediaPlayerSourceObserverBridge::onPlayerPlaybackStats(const agora::media::base::PlayerPlaybackStats &stats) {
    auto statsCopy = stats;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, statsCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, statsCopy);
        callHandler(self, "onPlayerPlaybackStats", args);
    });
}

void MediaPlayerSourceObserverBridge::onAudioVolumeIndication(int volume) {
    auto volumeCopy = volume;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, volumeCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, volumeCopy);
        callHandler(self, "onAudioVolumeIndication", args);
    });
}
