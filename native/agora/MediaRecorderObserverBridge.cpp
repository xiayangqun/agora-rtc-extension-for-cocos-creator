#include "agora/MediaRecorderObserverBridge.h"

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"

MediaRecorderObserverBridge::MediaRecorderObserverBridge(se::Object *eventHandler)
    : ObserverBridgeBase(eventHandler) {}

void MediaRecorderObserverBridge::onRecorderStateChanged(agora::media::RecorderState state,
                                                          agora::media::RecorderReason reason) {
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, stateCopy, reasonCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, stateCopy);
        pushArg(args, reasonCopy);
        callHandler(self, "onRecorderStateChanged", args);
    });
}

void MediaRecorderObserverBridge::onRecorderInfoUpdated(const agora::media::RecorderInfo &info) {
    auto infoCopy = info;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, infoCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, infoCopy);
        callHandler(self, "onRecorderInfoUpdated", args);
    });
}
