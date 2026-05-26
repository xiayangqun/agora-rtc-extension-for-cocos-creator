#pragma once

#include "IAgoraMediaRecorder.h"
#include "agora/ObserverBridgeBase.h"

namespace se {
class Object;
}

class MediaRecorderObserverBridge
    : public ObserverBridgeBase,
      public agora::media::IMediaRecorderObserver {
public:
    explicit MediaRecorderObserverBridge(se::Object *eventHandler);

    void onRecorderStateChanged(agora::media::RecorderState state,
                                agora::media::RecorderReason reason) override;
    void onRecorderInfoUpdated(const agora::media::RecorderInfo &info) override;
};
