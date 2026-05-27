#pragma once

#include "IAgoraRtcEngine.h"

class ScreenCaptureSourceListBridge {
public:
    ScreenCaptureSourceListBridge();
    ~ScreenCaptureSourceListBridge();

    //jsb ignore
    bool hasList() const;

    //jsb ignore
    void setList(agora::rtc::IScreenCaptureSourceList *list);

    //jsb ignore
    void invalidate();

    unsigned int getCount();

    //jsb manual
    agora::rtc::ScreenCaptureSourceInfo getSourceInfo(unsigned int index);

private:
    agora::rtc::IScreenCaptureSourceList *_list{nullptr};
};
