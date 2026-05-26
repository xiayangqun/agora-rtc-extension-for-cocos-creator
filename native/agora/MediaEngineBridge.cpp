#include "agora/MediaEngineBridge.h"

#include "AgoraBase.h"

MediaEngineBridge::MediaEngineBridge(agora::agora_refptr<agora::media::IMediaEngine> mediaEngine)
    : _mediaEngine(mediaEngine) {}

MediaEngineBridge::~MediaEngineBridge() {
    invalidate();
}

bool MediaEngineBridge::hasMediaEngine() const {
    return _mediaEngine.get() != nullptr;
}

agora::agora_refptr<agora::media::IMediaEngine> MediaEngineBridge::mediaEngine() const {
    return _mediaEngine;
}

void MediaEngineBridge::invalidate() {
    _mediaEngine = nullptr;
}

// int MediaEngineBridge::registerAudioFrameObserver(agora::media::IAudioFrameObserver *observer) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->registerAudioFrameObserver(observer);
// }

// int MediaEngineBridge::registerVideoFrameObserver(agora::media::IVideoFrameObserver *observer) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->registerVideoFrameObserver(observer);
// }

// int MediaEngineBridge::registerVideoEncodedFrameObserver(agora::media::IVideoEncodedFrameObserver *observer) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->registerVideoEncodedFrameObserver(observer);
// }

// int MediaEngineBridge::registerFaceInfoObserver(agora::media::IFaceInfoObserver *observer) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->registerFaceInfoObserver(observer);
// }

// int MediaEngineBridge::pushAudioFrame(agora::media::IAudioFrameObserverBase::AudioFrame *frame,
//                                       agora::rtc::track_id_t trackId) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->pushAudioFrame(frame, trackId);
// }

// int MediaEngineBridge::pullAudioFrame(agora::media::IAudioFrameObserverBase::AudioFrame *frame) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->pullAudioFrame(frame);
// }

// int MediaEngineBridge::setExternalVideoSource(bool enabled, bool useTexture,
//                                               agora::rtc::EXTERNAL_VIDEO_SOURCE_TYPE sourceType,
//                                               agora::rtc::SenderOptions encodedVideoOption) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->setExternalVideoSource(enabled, useTexture, sourceType, encodedVideoOption);
// }

// int MediaEngineBridge::setExternalAudioSource(bool enabled, int sampleRate, int channels, bool localPlayback,
//                                               bool publish) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->setExternalAudioSource(enabled, sampleRate, channels, localPlayback, publish);
// }

// agora::rtc::track_id_t MediaEngineBridge::createCustomAudioTrack(agora::rtc::AUDIO_TRACK_TYPE trackType,
//                                                                  const agora::rtc::AudioTrackConfig &config) {
//     if (!_mediaEngine) { return -1; }
//     return _mediaEngine->createCustomAudioTrack(trackType, config);
// }

// int MediaEngineBridge::destroyCustomAudioTrack(agora::rtc::track_id_t trackId) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->destroyCustomAudioTrack(trackId);
// }

// int MediaEngineBridge::setExternalAudioSink(bool enabled, int sampleRate, int channels) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->setExternalAudioSink(enabled, sampleRate, channels);
// }

// int MediaEngineBridge::enableCustomAudioLocalPlayback(agora::rtc::track_id_t trackId, bool enabled) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->enableCustomAudioLocalPlayback(trackId, enabled);
// }

// int MediaEngineBridge::pushVideoFrame(agora::media::base::ExternalVideoFrame *frame, unsigned int videoTrackId) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->pushVideoFrame(frame, videoTrackId);
// }

// int MediaEngineBridge::pushEncodedVideoImage(const unsigned char *imageBuffer, size_t length,
//                                              const agora::rtc::EncodedVideoFrameInfo &videoEncodedFrameInfo,
//                                              unsigned int videoTrackId) {
//     if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
//     return _mediaEngine->pushEncodedVideoImage(imageBuffer, length, videoEncodedFrameInfo, videoTrackId);
// }

int MediaEngineBridge::addVideoFrameRenderer(agora::media::IVideoFrameObserver *renderer) {
    if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaEngine->addVideoFrameRenderer(renderer);
}

int MediaEngineBridge::removeVideoFrameRenderer(agora::media::IVideoFrameObserver *renderer) {
    if (!_mediaEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _mediaEngine->removeVideoFrameRenderer(renderer);
}

void MediaEngineBridge::release() {
    _mediaEngine.reset();
}
