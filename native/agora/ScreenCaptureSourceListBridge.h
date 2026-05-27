#pragma once

#include "IAgoraRtcEngine.h"

class ScreenCaptureSourceListBridge {
public:
    ScreenCaptureSourceListBridge();
    ~ScreenCaptureSourceListBridge();

    bool hasList() const;
    void setList(agora::rtc::IScreenCaptureSourceList *list);
    void invalidate();

    unsigned int getCount();
    //todo jsb manual
    agora::rtc::ScreenCaptureSourceInfo getSourceInfo(unsigned int index);

private:
    agora::rtc::IScreenCaptureSourceList *_list{nullptr};
};
