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
    explicit VideoDeviceManagerBridge(agora::agora_refptr<agora::rtc::IVideoDeviceManager> videoDeviceManager);
    ~VideoDeviceManagerBridge();

    bool hasVideoDeviceManager() const;
    agora::agora_refptr<agora::rtc::IVideoDeviceManager> videoDeviceManager() const;
    void invalidate();

    std::shared_ptr<VideoDeviceCollectionBridge> enumerateVideoDevices();
    int setDevice(const std::string &deviceId);
    GetVideoDeviceResult getDevice();
    int numberOfCapabilities(const std::string &deviceId);
    VideoDeviceCapabilityResult getCapability(const std::string &deviceId, uint32_t deviceCapabilityNumber);
    int startDeviceTest(agora::view_t hwnd);
    int stopDeviceTest();
    void release();

private:
    agora::agora_refptr<agora::rtc::IVideoDeviceManager> _videoDeviceManager;
    std::shared_ptr<VideoDeviceCollectionBridge> _videoDeviceCollection;
};
