#include "agora/MusicContentCenterEventHandlerBridge.h"

#include <string>

#include "application/ApplicationManager.h"
#include "base/Scheduler.h"

namespace {

std::vector<MusicChartInfoData> convertToMusicChartInfoDataVector(
    const agora::agora_refptr<agora::rtc::MusicChartCollection> &collection) {
    std::vector<MusicChartInfoData> result;
    int count = collection->getCount();
    result.reserve(count);
    for (int i = 0; i < count; ++i) {
        auto *info = collection->get(i);
        result.push_back({info->chartName ? info->chartName : "", info->id});
    }
    return result;
}

MusicData convertToMusicData(const agora::rtc::Music *music) {
    MusicData data;
    data.songCode = music->songCode;
    data.name = music->name ? music->name : "";
    data.singer = music->singer ? music->singer : "";
    data.poster = music->poster ? music->poster : "";
    data.releaseTime = music->releaseTime ? music->releaseTime : "";
    data.durationS = music->durationS;
    data.type = music->type;
    data.pitchType = music->pitchType;
    data.lyricCount = music->lyricCount;

    if (music->lyricList && music->lyricCount > 0) {
        data.lyricList.assign(music->lyricList, music->lyricList + music->lyricCount);
    }

    data.climaxSegmentCount = music->climaxSegmentCount;
    if (music->climaxSegmentList && music->climaxSegmentCount > 0) {
        for (int32_t i = 0; i < music->climaxSegmentCount; ++i) {
            data.climaxSegmentList.push_back(
                {music->climaxSegmentList[i].startTimeMs, music->climaxSegmentList[i].endTimeMs});
        }
    }

    data.mvPropertyCount = music->mvPropertyCount;
    if (music->mvPropertyList && music->mvPropertyCount > 0) {
        for (int32_t i = 0; i < music->mvPropertyCount; ++i) {
            data.mvPropertyList.push_back(
                {music->mvPropertyList[i].resolution ? music->mvPropertyList[i].resolution : "",
                 music->mvPropertyList[i].bandwidth ? music->mvPropertyList[i].bandwidth : ""});
        }
    }

    return data;
}

MusicCollectionData convertToMusicCollectionData(const agora::agora_refptr<agora::rtc::MusicCollection> &collection) {
    MusicCollectionData data;
    data.count = collection->getCount();
    data.total = collection->getTotal();
    data.page = collection->getPage();
    data.pageSize = collection->getPageSize();
    int musicCount = collection->getCount();
    data.musics.reserve(musicCount);
    for (int i = 0; i < musicCount; ++i) {
        data.musics.push_back(convertToMusicData(collection->getMusic(i)));
    }
    return data;
}

} // namespace

MusicContentCenterEventHandlerBridge::MusicContentCenterEventHandlerBridge(se::Object *eventHandler)
    : ObserverBridgeBase(eventHandler) {}

void MusicContentCenterEventHandlerBridge::onMusicChartsResult(
    const char *requestId, agora::agora_refptr<agora::rtc::MusicChartCollection> result,
    agora::rtc::MusicContentCenterStateReason reason) {
    std::string requestIdCopy(requestId != nullptr ? requestId : "");
    auto chartsData = convertToMusicChartInfoDataVector(result);
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, requestIdCopy, chartsData = std::move(chartsData), reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, requestIdCopy);
            pushArg(args, chartsData);
            pushArg(args, reasonCopy);
            callHandler(self, "onMusicChartsResult", args);
        });
}

void MusicContentCenterEventHandlerBridge::onMusicCollectionResult(
    const char *requestId, agora::agora_refptr<agora::rtc::MusicCollection> result,
    agora::rtc::MusicContentCenterStateReason reason) {
    std::string requestIdCopy(requestId != nullptr ? requestId : "");
    auto collectionData = convertToMusicCollectionData(result);
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, requestIdCopy, collectionData = std::move(collectionData), reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, requestIdCopy);
            pushArg(args, collectionData);
            pushArg(args, reasonCopy);
            callHandler(self, "onMusicCollectionResult", args);
        });
}

void MusicContentCenterEventHandlerBridge::onLyricResult(const char *requestId, int64_t songCode, const char *lyricUrl,
                                                         agora::rtc::MusicContentCenterStateReason reason) {
    std::string requestIdCopy(requestId != nullptr ? requestId : "");
    auto songCodeCopy = songCode;
    std::string lyricUrlCopy(lyricUrl != nullptr ? lyricUrl : "");
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, requestIdCopy, songCodeCopy, lyricUrlCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, requestIdCopy);
            pushArg(args, songCodeCopy);
            pushArg(args, lyricUrlCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onLyricResult", args);
        });
}

void MusicContentCenterEventHandlerBridge::onSongSimpleInfoResult(const char *requestId, int64_t songCode,
                                                                  const char *simpleInfo,
                                                                  agora::rtc::MusicContentCenterStateReason reason) {
    std::string requestIdCopy(requestId != nullptr ? requestId : "");
    auto songCodeCopy = songCode;
    std::string simpleInfoCopy(simpleInfo != nullptr ? simpleInfo : "");
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, requestIdCopy, songCodeCopy, simpleInfoCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, requestIdCopy);
            pushArg(args, songCodeCopy);
            pushArg(args, simpleInfoCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onSongSimpleInfoResult", args);
        });
}

void MusicContentCenterEventHandlerBridge::onPreLoadEvent(const char *requestId, int64_t songCode, int percent,
                                                          const char *lyricUrl, agora::rtc::PreloadState state,
                                                          agora::rtc::MusicContentCenterStateReason reason) {
    std::string requestIdCopy(requestId != nullptr ? requestId : "");
    auto songCodeCopy = songCode;
    auto percentCopy = percent;
    std::string lyricUrlCopy(lyricUrl != nullptr ? lyricUrl : "");
    auto stateCopy = state;
    auto reasonCopy = reason;
    auto self = shared_from_this();
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [self, requestIdCopy, songCodeCopy, percentCopy, lyricUrlCopy, stateCopy, reasonCopy]() {
            if (!isScriptEngineValid()) { return; }
            se::AutoHandleScope handleScope;
            se::ValueArray args;
            pushArg(args, requestIdCopy);
            pushArg(args, songCodeCopy);
            pushArg(args, percentCopy);
            pushArg(args, lyricUrlCopy);
            pushArg(args, stateCopy);
            pushArg(args, reasonCopy);
            callHandler(self, "onPreLoadEvent", args);
        });
}
