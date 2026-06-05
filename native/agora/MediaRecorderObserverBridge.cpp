#include "agora/MediaRecorderObserverBridge.h"

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"

MediaRecorderObserverBridge::MediaRecorderObserverBridge(se::Object *eventHandler)
    : ObserverBridgeBase(eventHandler) {}

void MediaRecorderObserverBridge::onRecorderStateChanged(const char *channelId, agora::rtc::uid_t uid,
                                                          agora::media::RecorderState state,
                                                          agora::media::RecorderReasonCode reason) {
    std::string channelIdCopy = channelId != nullptr ? channelId : "";
    auto uidCopy = uid;
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, channelIdCopy, uidCopy, stateCopy, reasonCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, channelIdCopy);
        pushArg(args, uidCopy);
        pushArg(args, stateCopy);
        pushArg(args, reasonCopy);
        callHandler(self, "onRecorderStateChanged", args);
    });
}

void MediaRecorderObserverBridge::onRecorderInfoUpdated(const char *channelId, agora::rtc::uid_t uid,
                                                        const agora::media::RecorderInfo &info) {
    std::string channelIdCopy = channelId != nullptr ? channelId : "";
    auto uidCopy = uid;
    auto infoCopy = info;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, channelIdCopy, uidCopy, infoCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, channelIdCopy);
        pushArg(args, uidCopy);
        pushArg(args, infoCopy);
        callHandler(self, "onRecorderInfoUpdated", args);
    });
}
