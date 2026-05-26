#pragma once

#include "IAgoraH265Transcoder.h"
#include "agora/ObserverBridgeBase.h"

namespace se {
class Object;
}

class H265TranscoderObserverBridge
    : public ObserverBridgeBase,
      public agora::rtc::IH265TranscoderObserver {
public:
    explicit H265TranscoderObserverBridge(se::Object *eventHandler);

    void onEnableTranscode(agora::rtc::H265_TRANSCODE_RESULT result) override;
    void onQueryChannel(agora::rtc::H265_TRANSCODE_RESULT result, const char* originChannel,
                        const char* transcodeChannel) override;
    void onTriggerTranscode(agora::rtc::H265_TRANSCODE_RESULT result) override;
};
