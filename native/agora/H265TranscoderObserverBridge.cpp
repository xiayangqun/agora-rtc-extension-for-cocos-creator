#include "agora/H265TranscoderObserverBridge.h"

#include <string>

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"

H265TranscoderObserverBridge::H265TranscoderObserverBridge(se::Object *eventHandler)
    : ObserverBridgeBase(eventHandler) {}

void H265TranscoderObserverBridge::onEnableTranscode(agora::rtc::H265_TRANSCODE_RESULT result) {
    auto resultCopy = result;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, resultCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, resultCopy);
        callHandler(self, "onEnableTranscode", args);
    });
}

void H265TranscoderObserverBridge::onQueryChannel(agora::rtc::H265_TRANSCODE_RESULT result,
                                                   const char* originChannel, const char* transcodeChannel) {
    auto resultCopy = result;
    std::string originChannelCopy(originChannel != nullptr ? originChannel : "");
    std::string transcodeChannelCopy(transcodeChannel != nullptr ? transcodeChannel : "");
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, resultCopy, originChannelCopy, transcodeChannelCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, resultCopy);
            pushArg(args, originChannelCopy);
            pushArg(args, transcodeChannelCopy);
            callHandler(self, "onQueryChannel", args);
        });
}

void H265TranscoderObserverBridge::onTriggerTranscode(agora::rtc::H265_TRANSCODE_RESULT result) {
    auto resultCopy = result;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([self, resultCopy]() {
        if (!isScriptEngineValid()) { return; }
        se::AutoHandleScope handleScope;
        se::ValueArray args;
        pushArg(args, resultCopy);
        callHandler(self, "onTriggerTranscode", args);
    });
}
