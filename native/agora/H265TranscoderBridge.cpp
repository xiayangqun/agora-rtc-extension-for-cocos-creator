#include "agora/H265TranscoderBridge.h"
#include "agora/H265TranscoderObserverBridge.h"

#include "AgoraBase.h"
#include "bindings/jswrapper/SeApi.h"

H265TranscoderBridge::H265TranscoderBridge(agora::agora_refptr<agora::rtc::IH265Transcoder> h265Transcoder)
    : _h265Transcoder(h265Transcoder) {}

H265TranscoderBridge::~H265TranscoderBridge() {
    invalidate();
}

bool H265TranscoderBridge::hasH265Transcoder() const {
    return _h265Transcoder != nullptr;
}

agora::agora_refptr<agora::rtc::IH265Transcoder> H265TranscoderBridge::h265Transcoder() const {
    return _h265Transcoder;
}

void H265TranscoderBridge::invalidate() {
    if (_transcoderObserver != nullptr) {
        _h265Transcoder->unregisterTranscoderObserver(_transcoderObserver.get());
        _transcoderObserver->invalidateCallbacks();
        _transcoderObserver.reset();
    }
    _h265Transcoder = nullptr;
}

int H265TranscoderBridge::enableTranscode(const std::string &token, const std::string &channel, agora::rtc::uid_t uid) {
    if (!_h265Transcoder) { return -agora::ERR_INVALID_ARGUMENT; }
    return _h265Transcoder->enableTranscode(token.c_str(), channel.c_str(), uid);
}

int H265TranscoderBridge::queryChannel(const std::string &token, const std::string &channel, agora::rtc::uid_t uid) {
    if (!_h265Transcoder) { return -agora::ERR_INVALID_ARGUMENT; }
    return _h265Transcoder->queryChannel(token.c_str(), channel.c_str(), uid);
}

int H265TranscoderBridge::triggerTranscode(const std::string &token, const std::string &channel,
                                           agora::rtc::uid_t uid) {
    if (!_h265Transcoder) { return -agora::ERR_INVALID_ARGUMENT; }
    return _h265Transcoder->triggerTranscode(token.c_str(), channel.c_str(), uid);
}

int H265TranscoderBridge::registerTranscoderObserver(se::Object *observer) {
    if (!_h265Transcoder) { return -agora::ERR_INVALID_ARGUMENT; }
    if (observer == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    _transcoderObserver = std::make_shared<H265TranscoderObserverBridge>(observer);
    int ret = _h265Transcoder->registerTranscoderObserver(_transcoderObserver.get());
    if (ret != 0) {
        _transcoderObserver->invalidateCallbacks();
        _transcoderObserver.reset();
    }
    return ret;
}

int H265TranscoderBridge::unregisterTranscoderObserver() {
    if (!_h265Transcoder) { return -agora::ERR_INVALID_ARGUMENT; }
    if (_transcoderObserver == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    int ret = _h265Transcoder->unregisterTranscoderObserver(_transcoderObserver.get());
    _transcoderObserver->invalidateCallbacks();
    _transcoderObserver.reset();
    return ret;
}
