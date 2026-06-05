#pragma once

#include "IAgoraH265Transcoder.h"
#include <memory>
#include <string>

namespace se {
class Object;
}

class H265TranscoderObserverBridge;

class H265TranscoderBridge {
public:
    explicit H265TranscoderBridge(agora::agora_refptr<agora::rtc::IH265Transcoder> h265Transcoder);
    ~H265TranscoderBridge();

    bool hasH265Transcoder() const;
    agora::agora_refptr<agora::rtc::IH265Transcoder> h265Transcoder() const;
    //jsb ignore
    void invalidate();

    int enableTranscode(const std::string &token, const std::string &channel, agora::rtc::uid_t uid);
    int queryChannel(const std::string &token, const std::string &channel, agora::rtc::uid_t uid);
    int triggerTranscode(const std::string &token, const std::string &channel, agora::rtc::uid_t uid);

    //jsb manual
    int registerTranscoderObserver(se::Object *observer);
    //jsb manual
    int unregisterTranscoderObserver();

private:
    agora::agora_refptr<agora::rtc::IH265Transcoder> _h265Transcoder;
    std::shared_ptr<H265TranscoderObserverBridge> _transcoderObserver;
};
