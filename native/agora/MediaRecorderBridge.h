#pragma once

#include "IAgoraMediaRecorder.h"
#include <memory>

namespace se {
class Object;
}

class MediaRecorderObserverBridge;

class MediaRecorderBridge {
public:
    explicit MediaRecorderBridge(agora::agora_refptr<agora::rtc::IMediaRecorder> mediaRecorder);
    ~MediaRecorderBridge();

    //todo jsb ignore
    bool hasMediaRecorder() const;

    //todo jsb ignore
    agora::agora_refptr<agora::rtc::IMediaRecorder> mediaRecorder() const;

    //todo jsb ignore
    void invalidate();

    //todo jsb manual
    int setMediaRecorderObserver(se::Object *observer);
    int startRecording(const agora::media::MediaRecorderConfiguration &config);
    int stopRecording();

private:
    agora::agora_refptr<agora::rtc::IMediaRecorder> _mediaRecorder;
    std::shared_ptr<MediaRecorderObserverBridge> _recorderObserver;
};
