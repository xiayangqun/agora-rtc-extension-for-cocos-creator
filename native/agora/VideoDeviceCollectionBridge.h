#pragma once

#include "IAgoraRtcEngine.h"
#include <string>

struct GetVideoDeviceInfoResult {
    int errorCode;
    std::string deviceNameUTF8;
    std::string deviceIdUTF8;
};

class VideoDeviceCollectionBridge {
public:
    VideoDeviceCollectionBridge(agora::rtc::IVideoDeviceCollection *collection);
    ~VideoDeviceCollectionBridge();

    //jsb ignore
    void invalidate();

    int getCount();
    int setDevice(const std::string &deviceId);
    GetVideoDeviceInfoResult getDevice(int index);

private:
    agora::rtc::IVideoDeviceCollection *_collection{nullptr};
};
