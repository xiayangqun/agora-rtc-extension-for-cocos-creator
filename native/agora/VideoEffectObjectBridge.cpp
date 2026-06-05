#include "agora/VideoEffectObjectBridge.h"

#include "AgoraBase.h"

VideoEffectObjectBridge::VideoEffectObjectBridge(agora::agora_refptr<agora::rtc::IVideoEffectObject> videoEffectObject)
    : _videoEffectObject(videoEffectObject) {}

VideoEffectObjectBridge::~VideoEffectObjectBridge() {
    invalidate();
}

bool VideoEffectObjectBridge::hasVideoEffectObject() const {
    return _videoEffectObject.get() != nullptr;
}

agora::agora_refptr<agora::rtc::IVideoEffectObject> VideoEffectObjectBridge::videoEffectObject() const {
    return _videoEffectObject;
}

void VideoEffectObjectBridge::invalidate() {
    _videoEffectObject = nullptr;
}

int VideoEffectObjectBridge::addOrUpdateVideoEffect(uint32_t nodeId, const std::string &templateName) {
    if (!_videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoEffectObject->addOrUpdateVideoEffect(nodeId, templateName.empty() ? nullptr : templateName.c_str());
}

int VideoEffectObjectBridge::removeVideoEffect(uint32_t nodeId) {
    if (!_videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoEffectObject->removeVideoEffect(nodeId);
}

int VideoEffectObjectBridge::performVideoEffectAction(uint32_t nodeId,
                                                      agora::rtc::IVideoEffectObject::VIDEO_EFFECT_ACTION actionId) {
    if (!_videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoEffectObject->performVideoEffectAction(nodeId, actionId);
}

int VideoEffectObjectBridge::setVideoEffectFloatParam(const std::string &option, const std::string &key, float param) {
    if (!_videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoEffectObject->setVideoEffectFloatParam(option.c_str(), key.c_str(), param);
}

int VideoEffectObjectBridge::setVideoEffectIntParam(const std::string &option, const std::string &key, int param) {
    if (!_videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoEffectObject->setVideoEffectIntParam(option.c_str(), key.c_str(), param);
}

int VideoEffectObjectBridge::setVideoEffectBoolParam(const std::string &option, const std::string &key, bool param) {
    if (!_videoEffectObject) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoEffectObject->setVideoEffectBoolParam(option.c_str(), key.c_str(), param);
}

float VideoEffectObjectBridge::getVideoEffectFloatParam(const std::string &option, const std::string &key) {
    if (!_videoEffectObject) { return 0.0f; }
    return _videoEffectObject->getVideoEffectFloatParam(option.c_str(), key.c_str());
}

int VideoEffectObjectBridge::getVideoEffectIntParam(const std::string &option, const std::string &key) {
    if (!_videoEffectObject) { return 0; }
    return _videoEffectObject->getVideoEffectIntParam(option.c_str(), key.c_str());
}

bool VideoEffectObjectBridge::getVideoEffectBoolParam(const std::string &option, const std::string &key) {
    if (!_videoEffectObject) { return false; }
    return _videoEffectObject->getVideoEffectBoolParam(option.c_str(), key.c_str());
}
