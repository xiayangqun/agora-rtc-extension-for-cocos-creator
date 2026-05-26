#include "agora/VideoDeviceCollectionBridge.h"

#include "AgoraBase.h"
#include <cstdio>

VideoDeviceCollectionBridge::VideoDeviceCollectionBridge(agora::rtc::IVideoDeviceCollection *collection)
    : _collection(collection) {}

VideoDeviceCollectionBridge::~VideoDeviceCollectionBridge() {
    invalidate();
}

void VideoDeviceCollectionBridge::invalidate() {
    if (_collection) {
        _collection->release();
        _collection = nullptr;
    }
}

int VideoDeviceCollectionBridge::getCount() {
    if (!_collection) { return 0; }
    return _collection->getCount();
}

int VideoDeviceCollectionBridge::setDevice(const std::string &deviceId) {
    if (!_collection) { return -agora::ERR_INVALID_ARGUMENT; }
    char deviceIdBuf[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    snprintf(deviceIdBuf, sizeof(deviceIdBuf), "%s", deviceId.c_str());
    return _collection->setDevice(deviceIdBuf);
}

GetVideoDeviceInfoResult VideoDeviceCollectionBridge::getDevice(int index) {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, "", ""}; }
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _collection->getDevice(index, deviceName, deviceId);
    return {ret, std::string(deviceName), std::string(deviceId)};
}
