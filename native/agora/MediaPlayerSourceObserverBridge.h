#pragma once

#include "IAgoraMediaPlayerSource.h"
#include "agora/ObserverBridgeBase.h"

namespace se {
class Object;
}

//todo jsb ignore class
class MediaPlayerSourceObserverBridge : public ObserverBridgeBase, public agora::rtc::IMediaPlayerSourceObserver {
public:
    explicit MediaPlayerSourceObserverBridge(se::Object *eventHandler);

    void onPlayerSourceStateChanged(agora::media::base::MEDIA_PLAYER_STATE state,
                                    agora::media::base::MEDIA_PLAYER_REASON reason) override;
    void onPositionChanged(int64_t positionMs, int64_t timestampMs) override;
    void onPlayerEvent(agora::media::base::MEDIA_PLAYER_EVENT eventCode, int64_t elapsedTime,
                       const char *message) override;
    void onMetaData(const void *data, int length) override;
    void onPlayBufferUpdated(int64_t playCachedBuffer) override;
    void onPreloadEvent(const char *src, agora::media::base::PLAYER_PRELOAD_EVENT event) override;
    void onCompleted() override;
    void onAgoraCDNTokenWillExpire() override;
    void onPlayerSrcInfoChanged(const agora::media::base::SrcInfo &from,
                                const agora::media::base::SrcInfo &to) override;
    void onPlayerInfoUpdated(const agora::media::base::PlayerUpdatedInfo &info) override;
    void onPlayerCacheStats(const agora::media::base::CacheStatistics &stats) override;
    void onPlayerPlaybackStats(const agora::media::base::PlayerPlaybackStats &stats) override;
    void onAudioVolumeIndication(int volume) override;
};
