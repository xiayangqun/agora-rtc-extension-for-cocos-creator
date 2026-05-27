#pragma once

#include "IAgoraMediaEngine.h"
#include <string>

//todo jsb ignore class
class MediaEngineBridge {
public:
    explicit MediaEngineBridge(agora::media::IMediaEngine *mediaEngine);
    ~MediaEngineBridge();

    bool hasMediaEngine() const;
    agora::media::IMediaEngine *mediaEngine() const;
    void invalidate();
    void release();

    //not support
    // int registerAudioFrameObserver(agora::media::IAudioFrameObserver *observer);
    // int registerVideoFrameObserver(agora::media::IVideoFrameObserver *observer);
    // int registerVideoEncodedFrameObserver(agora::media::IVideoEncodedFrameObserver *observer);
    // int registerFaceInfoObserver(agora::media::IFaceInfoObserver *observer);
    // int pushAudioFrame(agora::media::IAudioFrameObserverBase::AudioFrame *frame, agora::rtc::track_id_t trackId = 0);
    // int pullAudioFrame(agora::media::IAudioFrameObserverBase::AudioFrame *frame);

    //not support
    // int setExternalVideoSource(bool enabled, bool useTexture,
    //                            agora::media::EXTERNAL_VIDEO_SOURCE_TYPE sourceType = agora::media::VIDEO_FRAME,
    //                            agora::rtc::SenderOptions encodedVideoOption = agora::rtc::SenderOptions());
    // int setExternalAudioSource(bool enabled, int sampleRate, int channels, bool localPlayback = false,
    //                            bool publish = true);
    // agora::rtc::track_id_t createCustomAudioTrack(agora::rtc::AUDIO_TRACK_TYPE trackType,
    //                                               const agora::rtc::AudioTrackConfig &config);
    // int destroyCustomAudioTrack(agora::rtc::track_id_t trackId);
    // int setExternalAudioSink(bool enabled, int sampleRate, int channels);
    // int enableCustomAudioLocalPlayback(agora::rtc::track_id_t trackId, bool enabled);
    // int pushVideoFrame(agora::media::base::ExternalVideoFrame *frame, unsigned int videoTrackId = 0);
    // int pushEncodedVideoImage(const unsigned char *imageBuffer, size_t length,
    //                           const agora::rtc::EncodedVideoFrameInfo &videoEncodedFrameInfo,
    //                           unsigned int videoTrackId = 0);

    //todo jsb ignore 2个
    int addVideoFrameRenderer(agora::media::IVideoFrameObserver *renderer);
    int removeVideoFrameRenderer(agora::media::IVideoFrameObserver *renderer);

private:
    agora::media::IMediaEngine *_mediaEngine{nullptr};
};
