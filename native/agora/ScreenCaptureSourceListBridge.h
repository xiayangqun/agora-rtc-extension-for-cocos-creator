#pragma once

#include "IAgoraRtcEngine.h"

class ScreenCaptureSourceListBridge {
public:
    ScreenCaptureSourceListBridge();
    ~ScreenCaptureSourceListBridge();

    //jsb ignore
    bool hasList() const;

    //jsb ignore
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    void setList(agora::rtc::IScreenCaptureSourceList *list);
#endif

    //jsb ignore
    void invalidate();

    unsigned int getCount();

    //jsb manual
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    agora::rtc::ScreenCaptureSourceInfo getSourceInfo(unsigned int index);
#endif

private:
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    agora::rtc::IScreenCaptureSourceList *_list{nullptr};
#endif
};
