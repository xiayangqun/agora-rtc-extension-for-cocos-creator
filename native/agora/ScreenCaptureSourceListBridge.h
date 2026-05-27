#pragma once

#include "IAgoraRtcEngine.h"

class ScreenCaptureSourceListBridge {
public:
    ScreenCaptureSourceListBridge();
    ~ScreenCaptureSourceListBridge();

    //todo jsb ignore
    bool hasList() const;

    //todo jsb ignore
    void setList(agora::rtc::IScreenCaptureSourceList *list);

    //todo jsb ignore
    void invalidate();

    unsigned int getCount();

    //todo jsb manual
    agora::rtc::ScreenCaptureSourceInfo getSourceInfo(unsigned int index);

private:
    agora::rtc::IScreenCaptureSourceList *_list{nullptr};
};
