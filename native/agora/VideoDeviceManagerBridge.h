#pragma once

#include "IAgoraRtcEngine.h"
#include "agora/VideoDeviceCollectionBridge.h"
#include <memory>
#include <string>

struct GetVideoDeviceResult {
    int errorCode;
    std::string deviceId;
};

struct VideoDeviceCapabilityResult {
    int errorCode;
    agora::rtc::VideoFormat capability;
};

class VideoDeviceManagerBridge {
public:
    explicit VideoDeviceManagerBridge(agora::rtc::IVideoDeviceManager *videoDeviceManager);
    ~VideoDeviceManagerBridge();

    //todo jsb ignore
    bool hasVideoDeviceManager() const;

    //todo jsb ignore
    agora::rtc::IVideoDeviceManager *videoDeviceManager() const;

    //todo jsb ignore
    void invalidate();

    std::shared_ptr<VideoDeviceCollectionBridge> enumerateVideoDevices();
    int setDevice(const std::string &deviceId);
    GetVideoDeviceResult getDevice();
    int numberOfCapabilities(const std::string &deviceId);
    VideoDeviceCapabilityResult getCapability(const std::string &deviceId, uint32_t deviceCapabilityNumber);
    int startDeviceTest(agora::view_t hwnd);
    int stopDeviceTest();

private:
    agora::rtc::IVideoDeviceManager *_videoDeviceManager{nullptr};
    std::shared_ptr<VideoDeviceCollectionBridge> _videoDeviceCollection;
};
