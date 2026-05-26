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
    int64_t internalSongCode;
};

struct MCCRequestResult {
    int errorCode;
    std::string requestId;
};

class MusicContentCenterBridge {
public:
    explicit MusicContentCenterBridge(agora::agora_refptr<agora::rtc::IMusicContentCenter> musicContentCenter);
    ~MusicContentCenterBridge();

    bool hasMusicContentCenter() const;
    agora::agora_refptr<agora::rtc::IMusicContentCenter> musicContentCenter() const;
    void invalidate();

    int initialize(const agora::rtc::MusicContentCenterConfiguration &configuration);
    int renewToken(const std::string &token);
    void release();
    //todo jsb manual
    int registerEventHandler(se::Object *eventHandler);
    int unregisterEventHandler();
    //todo jsb manual
    std::shared_ptr<MusicPlayerBridge> createMusicPlayer();
    //todo jsb manual
    int destroyMusicPlayer(std::shared_ptr<MusicPlayerBridge> musicPlayer);
    std::shared_ptr<MusicPlayerBridge> *getMusicPlayer(int playerId) const;
    MCCRequestResult getMusicCharts();
    MCCRequestResult getMusicCollectionByMusicChartId(int32_t musicChartId, int32_t page, int32_t pageSize,
                                                      const std::string &jsonOption = "");
    MCCRequestResult searchMusic(const std::string &keyword, int32_t page, int32_t pageSize,
                                 const std::string &jsonOption = "");
    int preload(int64_t songCode, const std::string &jsonOption);
    MCCRequestResult preloadWithRequestId(int64_t songCode);
    int removeCache(int64_t songCode);
    GetCachesResult getCaches(int cacheInfoSize);
    int isPreloaded(int64_t songCode);
    MCCRequestResult getLyric(int64_t songCode, int32_t lyricType = 0);
    MCCRequestResult getSongSimpleInfo(int64_t songCode);
    GetInternalSongCodeResult getInternalSongCode(int64_t songCode, const std::string &jsonOption);

private:
    agora::agora_refptr<agora::rtc::IMusicContentCenter> _musicContentCenter;
    std::shared_ptr<MusicContentCenterEventHandlerBridge> _eventHandler;
    std::vector<std::shared_ptr<MusicPlayerBridge>> _musicPlayers;
};
