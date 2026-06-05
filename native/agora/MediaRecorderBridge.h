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

    //jsb ignore
    bool hasMediaRecorder() const;

    //jsb ignore
    agora::agora_refptr<agora::rtc::IMediaRecorder> mediaRecorder() const;

    //jsb ignore
    void invalidate();

    //jsb manual
    int setMediaRecorderObserver(se::Object *observer);
    int startRecording(const agora::media::MediaRecorderConfiguration &config);
    int stopRecording();

private:
    agora::agora_refptr<agora::rtc::IMediaRecorder> _mediaRecorder;
    std::shared_ptr<MediaRecorderObserverBridge> _recorderObserver;
};
