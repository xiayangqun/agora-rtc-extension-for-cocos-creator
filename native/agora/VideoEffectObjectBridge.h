#pragma once

#include "IAgoraRtcEngine.h"
#include <string>

class VideoEffectObjectBridge {
public:
    explicit VideoEffectObjectBridge(agora::agora_refptr<agora::rtc::IVideoEffectObject> videoEffectObject);
    ~VideoEffectObjectBridge();

    bool hasVideoEffectObject() const;
    agora::agora_refptr<agora::rtc::IVideoEffectObject> videoEffectObject() const;
    void invalidate();

    int addOrUpdateVideoEffect(uint32_t nodeId, const std::string &templateName);
    int removeVideoEffect(uint32_t nodeId);
    int performVideoEffectAction(uint32_t nodeId, agora::rtc::IVideoEffectObject::VIDEO_EFFECT_ACTION actionId);
    int setVideoEffectFloatParam(const std::string &option, const std::string &key, float param);
    int setVideoEffectIntParam(const std::string &option, const std::string &key, int param);
    int setVideoEffectBoolParam(const std::string &option, const std::string &key, bool param);
    float getVideoEffectFloatParam(const std::string &option, const std::string &key);
    int getVideoEffectIntParam(const std::string &option, const std::string &key);
    bool getVideoEffectBoolParam(const std::string &option, const std::string &key);

private:
    agora::agora_refptr<agora::rtc::IVideoEffectObject> _videoEffectObject;
};
