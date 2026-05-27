#pragma once

#include "IAgoraMusicContentCenter.h"
#include "agora/ObserverBridgeBase.h"

#include <string>
#include <vector>

namespace se {
class Object;
}

struct MusicChartInfoData {
    std::string chartName;
    int32_t id;
};

struct ClimaxSegmentData {
    int32_t startTimeMs;
    int32_t endTimeMs;
};

struct MvPropertyData {
    std::string resolution;
    std::string bandwidth;
};

struct MusicData {
    int64_t songCode;
    std::string name;
    std::string singer;
    std::string poster;
    std::string releaseTime;
    int32_t durationS;
    int32_t type;
    int32_t pitchType;
    int32_t lyricCount;
    std::vector<int32_t> lyricList;
    int32_t climaxSegmentCount;
    std::vector<ClimaxSegmentData> climaxSegmentList;
    int32_t mvPropertyCount;
    std::vector<MvPropertyData> mvPropertyList;
};

struct MusicCollectionData {
    int count;
    int total;
    int page;
    int pageSize;
    std::vector<MusicData> musics;
};

//todo jsb ignore class
class MusicContentCenterEventHandlerBridge : public ObserverBridgeBase,
                                             public agora::rtc::IMusicContentCenterEventHandler {
public:
    explicit MusicContentCenterEventHandlerBridge(se::Object *eventHandler);

    void onMusicChartsResult(const char *requestId, agora::agora_refptr<agora::rtc::MusicChartCollection> result,
                             agora::rtc::MusicContentCenterStateReason reason) override;
    void onMusicCollectionResult(const char *requestId, agora::agora_refptr<agora::rtc::MusicCollection> result,
                                 agora::rtc::MusicContentCenterStateReason reason) override;
    void onLyricResult(const char *requestId, int64_t songCode, const char *lyricUrl,
                       agora::rtc::MusicContentCenterStateReason reason) override;
    void onSongSimpleInfoResult(const char *requestId, int64_t songCode, const char *simpleInfo,
                                agora::rtc::MusicContentCenterStateReason reason) override;
    void onPreLoadEvent(const char *requestId, int64_t songCode, int percent, const char *lyricUrl,
                        agora::rtc::PreloadState state, agora::rtc::MusicContentCenterStateReason reason) override;
};
