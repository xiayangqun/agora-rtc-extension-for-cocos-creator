#pragma once

#include "IAgoraMusicContentCenter.h"
#include <memory>
#include <string>
#include <vector>

namespace se {
class Object;
}

class MusicContentCenterEventHandlerBridge;
class MusicPlayerBridge;

struct GetCachesResult {
    int errorCode;
    std::vector<agora::rtc::MusicCacheInfo> caches;
};

struct GetInternalSongCodeResult {
    int errorCode;
    // Use long instead of int64_t to prevent JavaScript BigInt conversion.
    // Cocos engine converts long → number, int64_t → BigInt.
    long internalSongCode;
};

struct MCCRequestResult {
    int errorCode;
    std::string requestId;
};

class MusicContentCenterBridge {
public:
    explicit MusicContentCenterBridge(agora::rtc::IMusicContentCenter *musicContentCenter);
    ~MusicContentCenterBridge();

    //jsb ignore
    bool hasMusicContentCenter() const;

    //jsb ignore
    agora::rtc::IMusicContentCenter *musicContentCenter() const;

    //jsb ignore
    void invalidate();
    int initialize(const agora::rtc::MusicContentCenterConfiguration &configuration);
    int renewToken(const std::string &token);
    //jsb manual
    int registerEventHandler(se::Object *eventHandler);
    int unregisterEventHandler();
    //jsb manual
    MusicPlayerBridge *createMusicPlayer();
    //jsb manual
    int destroyMusicPlayer(MusicPlayerBridge *musicPlayer);
    MCCRequestResult getMusicCharts();
    MCCRequestResult getMusicCollectionByMusicChartId(int32_t musicChartId, int32_t page, int32_t pageSize,
                                                      const std::string &jsonOption = "");
    MCCRequestResult searchMusic(const std::string &keyword, int32_t page, int32_t pageSize,
                                 const std::string &jsonOption = "");
    int preload(int64_t songCode, const std::string &jsonOption);
    MCCRequestResult preload(int64_t songCode);
    int removeCache(int64_t songCode);
    GetCachesResult getCaches(int cacheInfoSize);
    int isPreloaded(int64_t songCode);
    MCCRequestResult getLyric(int64_t songCode, int32_t lyricType = 0);
    MCCRequestResult getSongSimpleInfo(int64_t songCode);
    GetInternalSongCodeResult getInternalSongCode(int64_t songCode, const std::string &jsonOption);

private:
    agora::rtc::IMusicContentCenter *_musicContentCenter{nullptr};
    std::shared_ptr<MusicContentCenterEventHandlerBridge> _eventHandler;
    std::vector<std::shared_ptr<MusicPlayerBridge>> _musicPlayers;
};
