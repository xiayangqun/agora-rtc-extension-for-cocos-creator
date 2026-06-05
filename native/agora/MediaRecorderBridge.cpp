#include "agora/MediaRecorderBridge.h"
#include "agora/MediaRecorderObserverBridge.h"

#include "AgoraBase.h"
#include "bindings/jswrapper/SeApi.h"

MediaRecorderBridge::MediaRecorderBridge(agora::agora_refptr<agora::rtc::IMediaRecorder> mediaRecorder)
    : _mediaRecorder(mediaRecorder) {}

MediaRecorderBridge::~MediaRecorderBridge() {
    invalidate();
}

bool MediaRecorderBridge::hasMediaRecorder() const {
    return _mediaRecorder.get() != nullptr;
}

agora::agora_refptr<agora::rtc::IMediaRecorder> MediaRecorderBridge::mediaRecorder() const {
    return _mediaRecorder;
}

void MediaRecorderBridge::invalidate() {
    if (_recorderObserver != nullptr) {
        _recorderObserver->invalidateCallbacks();
        _recorderObserver.reset();
    }
    _mediaRecorder = nullptr;
}

int MediaRecorderBridge::setMediaRecorderObserver(se::Object *observer) {
    if (!_mediaRecorder) { return -agora::ERR_INVALID_ARGUMENT; }
    if (observer == nullptr) { return -agora::ERR_INVALID_ARGUMENT; }
    _recorderObserver = std::make_shared<MediaRecorderObserverBridge>(observer);
    int ret = _mediaRecorder->setMediaRecorderObserver(_recorderObserver.get());
    if (ret != 0) {
        _recorderObserver->invalidateCallbacks();
        _recorderObserver.reset();
    }
    return ret;
}

int MediaRecorderBridge::startRecording(const agora::media::MediaRecorderConfiguration &config) {
    if (!_mediaRecorder) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaRecorder->startRecording(config);
}

int MediaRecorderBridge::stopRecording() {
    if (!_mediaRecorder) { return -agora::ERR_INVALID_ARGUMENT; }
    auto ret = _mediaRecorder->stopRecording();
    if (ret == 0 && _recorderObserver != nullptr) {
        _recorderObserver->invalidateCallbacks();
        _recorderObserver.reset();
    }
    return ret;
}
