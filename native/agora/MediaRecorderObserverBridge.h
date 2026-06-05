#pragma once

#include "IAgoraMediaRecorder.h"
#include "agora/ObserverBridgeBase.h"

namespace se {
class Object;
}

//jsb ignore class
class MediaRecorderObserverBridge : public ObserverBridgeBase, public agora::media::IMediaRecorderObserver {
public:
    explicit MediaRecorderObserverBridge(se::Object *eventHandler);

    void onRecorderStateChanged(const char *channelId, agora::rtc::uid_t uid, agora::media::RecorderState state,
                                agora::media::RecorderReasonCode reason) override;
    void onRecorderInfoUpdated(const char *channelId, agora::rtc::uid_t uid,
                               const agora::media::RecorderInfo &info) override;
};
