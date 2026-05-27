#pragma once

#include "IAgoraMediaPlayer.h"
#include <string>

namespace se {
class Object;
}

class MediaPlayerSourceObserverBridge;

struct GetDurationResult {
    int errorCode;
    int64_t duration;
};

struct GetStreamCountResult {
    int errorCode;
    int64_t count;
};

struct GetStreamInfoResult {
    int errorCode;
    agora::media::base::PlayerStreamInfo info;
};

struct GetMuteResult {
    int errorCode;
    bool muted;
};

struct GetPlayoutVolumeResult {
    int errorCode;
    int volume;
};

struct GetPublishSignalVolumeResult {
    int errorCode;
    int volume;
};

struct GetPlayPositionResult {
    int errorCode;
    int64_t pos;
};

struct GetAudioBufferDelayResult {
    int errorCode;
    int32_t delayMs;
};

class MediaPlayerBridge {
public:
    explicit MediaPlayerBridge(agora::agora_refptr<agora::rtc::IMediaPlayer> mediaPlayer);
    ~MediaPlayerBridge();

    int getId() const;

    //jsb ignore
    bool hasMediaPlayer() const;

    //jsb ignore
    agora::agora_refptr<agora::rtc::IMediaPlayer> mediaPlayer() const;

    //jsb ignore
    virtual void invalidate();

    int open(const std::string &url, int64_t startPos);
    //not support
    // int openWithMediaSource(const agora::media::base::MediaSource &source);
    int play();
    int pause();
    int stop();
    int resume();
    int seek(int64_t newPos);
    int setAudioPitch(int pitch);
    GetDurationResult getDuration();
    GetPlayPositionResult getPlayPosition();
    GetStreamCountResult getStreamCount();
    GetStreamInfoResult getStreamInfo(int64_t index);
    int setLoopCount(int loopCount);
    int setPlaybackSpeed(int speed);
    int selectAudioTrack(int index);
    int selectMultiAudioTrack(int playoutTrackIndex, int publishTrackIndex);
    int setPlayerOption(const std::string &key, int value);
    int setPlayerOption(const std::string &key, const std::string &value);
    int takeScreenshot(const std::string &filename);
    int selectInternalSubtitle(int index);
    int setExternalSubtitle(const std::string &url);
    agora::media::base::MEDIA_PLAYER_STATE getState();
    int mute(bool muted);
    GetMuteResult getMute();
    int adjustPlayoutVolume(int volume);
    GetPlayoutVolumeResult getPlayoutVolume();
    int adjustPublishSignalVolume(int volume);
    GetPublishSignalVolumeResult getPublishSignalVolume();

    //jsb manual
    int registerPlayerSourceObserver(se::Object *observer);
    //jsb manual
    int unregisterPlayerSourceObserver();
    //not support
    // int registerAudioFrameObserver(agora::media::IAudioPcmFrameSink *observer);
    //not support
    // int registerAudioFrameObserver(agora::media::IAudioPcmFrameSink *observer,
    //    agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE mode);
    //not support
    // int unregisterAudioFrameObserver(agora::media::IAudioPcmFrameSink *observer);
    //not support
    // int registerVideoFrameObserver(agora::media::base::IVideoFrameObserver *observer);
    //not support
    // int unregisterVideoFrameObserver(agora::media::base::IVideoFrameObserver *observer);
    //not support
    // int registerMediaPlayerAudioSpectrumObserver(agora::media::IAudioSpectrumObserver *observer, int intervalInMS);
    //not support
    // int unregisterMediaPlayerAudioSpectrumObserver(agora::media::IAudioSpectrumObserver *observer);

    int setAudioDualMonoMode(agora::media::base::AUDIO_DUAL_MONO_MODE mode);
    std::string getPlayerSdkVersion();
    std::string getPlaySrc();
    int openWithAgoraCDNSrc(const std::string &src, int64_t startPos);
    int getAgoraCDNLineCount();
    int switchAgoraCDNLineByIndex(int index);
    int getCurrentAgoraCDNIndex();
    int enableAutoSwitchAgoraCDN(bool enable);
    int renewAgoraCDNSrcToken(const std::string &token, int64_t ts);
    int switchAgoraCDNSrc(const std::string &src, bool syncPts);
    int switchSrc(const std::string &src, bool syncPts);
    int preloadSrc(const std::string &src, int64_t startPos);
    int playPreloadedSrc(const std::string &src);
    int unloadSrc(const std::string &src);
    int setSpatialAudioParams(const agora::SpatialAudioParams &params);
    int setSoundPositionParams(float pan, float gain);
    GetAudioBufferDelayResult getAudioBufferDelay();

private:
    agora::agora_refptr<agora::rtc::IMediaPlayer> _mediaPlayer;
    std::shared_ptr<MediaPlayerSourceObserverBridge> _playerSourceObserver;
};
