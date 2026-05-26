#include "agora/AudioDeviceCollectionBridge.h"

#include "AgoraBase.h"
#include <cstdio>

AudioDeviceCollectionBridge::AudioDeviceCollectionBridge(agora::rtc::IAudioDeviceCollection *collection)
    : _collection(collection) {}

AudioDeviceCollectionBridge::~AudioDeviceCollectionBridge() {
    invalidate();
}

void AudioDeviceCollectionBridge::invalidate() {
    if (_collection) {
        _collection->release();
        _collection = nullptr;
    }
}

int AudioDeviceCollectionBridge::getCount() {
    if (!_collection) { return 0; }
    return _collection->getCount();
}

int AudioDeviceCollectionBridge::setDevice(const std::string &deviceId) {
    if (!_collection) { return -agora::ERR_INVALID_ARGUMENT; }
    char deviceIdBuf[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    snprintf(deviceIdBuf, sizeof(deviceIdBuf), "%s", deviceId.c_str());
    return _collection->setDevice(deviceIdBuf);
}

GetAudioDeviceInfoResult AudioDeviceCollectionBridge::getDevice(int index) {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, "", ""}; }
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _collection->getDevice(index, deviceName, deviceId);
    return {ret, std::string(deviceName), std::string(deviceId)};
}

GetAudioDeviceInfoExResult AudioDeviceCollectionBridge::getDeviceEx(int index) {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, "", "", ""}; }
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceTypeName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _collection->getDevice(index, deviceName, deviceTypeName, deviceId);
    return {ret, std::string(deviceName), std::string(deviceTypeName), std::string(deviceId)};
}

GetAudioDeviceInfoResult AudioDeviceCollectionBridge::getDefaultDevice() {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, "", ""}; }
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _collection->getDefaultDevice(deviceName, deviceId);
    return {ret, std::string(deviceName), std::string(deviceId)};
}

GetAudioDeviceInfoExResult AudioDeviceCollectionBridge::getDefaultDeviceEx() {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, "", "", ""}; }
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceTypeName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _collection->getDefaultDevice(deviceName, deviceTypeName, deviceId);
    return {ret, std::string(deviceName), std::string(deviceTypeName), std::string(deviceId)};
}

int AudioDeviceCollectionBridge::setApplicationVolume(int volume) {
    if (!_collection) { return -agora::ERR_INVALID_ARGUMENT; }
    return _collection->setApplicationVolume(volume);
}

GetAudioDeviceVolumeResult AudioDeviceCollectionBridge::getApplicationVolume() {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int volume = 0;
    int ret = _collection->getApplicationVolume(volume);
    return {ret, volume};
}

int AudioDeviceCollectionBridge::setApplicationMute(bool mute) {
    if (!_collection) { return -agora::ERR_INVALID_ARGUMENT; }
    return _collection->setApplicationMute(mute);
}

GetAudioDeviceMuteResult AudioDeviceCollectionBridge::isApplicationMute() {
    if (!_collection) { return {-agora::ERR_INVALID_ARGUMENT, false}; }
    bool muted = false;
    int ret = _collection->isApplicationMute(muted);
    return {ret, muted};
}