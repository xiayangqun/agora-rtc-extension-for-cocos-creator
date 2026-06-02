#include "agora/VideoDeviceManagerBridge.h"

#include "AgoraBase.h"

VideoDeviceManagerBridge::VideoDeviceManagerBridge(agora::rtc::IVideoDeviceManager *videoDeviceManager)
    : _videoDeviceManager(videoDeviceManager) {}

VideoDeviceManagerBridge::~VideoDeviceManagerBridge() {
    invalidate();
}

bool VideoDeviceManagerBridge::hasVideoDeviceManager() const {
    return _videoDeviceManager != nullptr;
}

agora::rtc::IVideoDeviceManager *VideoDeviceManagerBridge::videoDeviceManager() const {
    return _videoDeviceManager;
}

void VideoDeviceManagerBridge::invalidate() {
    if (_videoDeviceCollection) {
        _videoDeviceCollection->invalidate();
        _videoDeviceCollection.reset();
    }
    if (_videoDeviceManager) {
        _videoDeviceManager->release();
        _videoDeviceManager = nullptr;
    }
}

std::shared_ptr<VideoDeviceCollectionBridge> VideoDeviceManagerBridge::enumerateVideoDevices() {
    if (!_videoDeviceManager) { return nullptr; }
    if (!_videoDeviceCollection) {
        auto *collection = _videoDeviceManager->enumerateVideoDevices();
        if (!collection) { return nullptr; }
        _videoDeviceCollection = std::make_shared<VideoDeviceCollectionBridge>(collection);
    }
    return _videoDeviceCollection;
}

int VideoDeviceManagerBridge::setDevice(const std::string &deviceId) {
    if (!_videoDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoDeviceManager->setDevice(deviceId.c_str());
}

GetVideoDeviceResult VideoDeviceManagerBridge::getDevice() {
    if (!_videoDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    char deviceIdUTF8[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _videoDeviceManager->getDevice(deviceIdUTF8);
    return {ret, std::string(deviceIdUTF8)};
}

int VideoDeviceManagerBridge::numberOfCapabilities(const std::string &deviceId) {
    if (!_videoDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoDeviceManager->numberOfCapabilities(deviceId.c_str());
}

VideoDeviceCapabilityResult VideoDeviceManagerBridge::getCapability(const std::string &deviceId,
                                                                    uint32_t deviceCapabilityNumber) {
    if (!_videoDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, {}}; }
    agora::rtc::VideoFormat capability;
    int ret = _videoDeviceManager->getCapability(deviceId.c_str(), deviceCapabilityNumber, capability);
    return {ret, capability};
}

int VideoDeviceManagerBridge::startDeviceTest(agora::view_t hwnd) {
    if (!_videoDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoDeviceManager->startDeviceTest(hwnd);
}

int VideoDeviceManagerBridge::stopDeviceTest() {
    if (!_videoDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _videoDeviceManager->stopDeviceTest();
}
