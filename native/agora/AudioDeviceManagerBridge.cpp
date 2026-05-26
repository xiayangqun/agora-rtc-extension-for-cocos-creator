#include "agora/AudioDeviceManagerBridge.h"

#include <cstdio>

#include "AgoraBase.h"

AudioDeviceManagerBridge::AudioDeviceManagerBridge(
    agora::agora_refptr<agora::rtc::IAudioDeviceManager> audioDeviceManager)
    : _audioDeviceManager(audioDeviceManager) {}

AudioDeviceManagerBridge::~AudioDeviceManagerBridge() {
    invalidate();
}

bool AudioDeviceManagerBridge::hasAudioDeviceManager() const {
    return _audioDeviceManager.get() != nullptr;
}

agora::agora_refptr<agora::rtc::IAudioDeviceManager> AudioDeviceManagerBridge::audioDeviceManager() const {
    return _audioDeviceManager;
}

void AudioDeviceManagerBridge::invalidate() {
    if (_playbackDevices) {
        _playbackDevices->invalidate();
        _playbackDevices.reset();
    }
    if (_recordingDevices) {
        _recordingDevices->invalidate();
        _recordingDevices.reset();
    }
    if (_audioDeviceManager) {
        _audioDeviceManager->release();
        _audioDeviceManager = nullptr;
    }
}

std::shared_ptr<AudioDeviceCollectionBridge> AudioDeviceManagerBridge::enumeratePlaybackDevices() {
    if (!_audioDeviceManager) { return nullptr; }
    if (!_playbackDevices) {
        auto *collection = _audioDeviceManager->enumeratePlaybackDevices();
        if (!collection) { return nullptr; }
        _playbackDevices = std::make_shared<AudioDeviceCollectionBridge>(collection);
    }
    return _playbackDevices;
}

std::shared_ptr<AudioDeviceCollectionBridge> AudioDeviceManagerBridge::enumerateRecordingDevices() {
    if (!_audioDeviceManager) { return nullptr; }
    if (!_recordingDevices) {
        auto *collection = _audioDeviceManager->enumerateRecordingDevices();
        if (!collection) { return nullptr; }
        _recordingDevices = std::make_shared<AudioDeviceCollectionBridge>(collection);
    }
    return _recordingDevices;
}

int AudioDeviceManagerBridge::setPlaybackDevice(const std::string &deviceId) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setPlaybackDevice(deviceId.c_str());
}

GetPlaybackDeviceResult AudioDeviceManagerBridge::getPlaybackDevice() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _audioDeviceManager->getPlaybackDevice(deviceId);
    return {ret, std::string(deviceId)};
}

//todo 和 getRecordingDeviceInfo 一样的处理
GetPlaybackDeviceInfoResult AudioDeviceManagerBridge::getPlaybackDeviceInfo(const std::string &deviceId) {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    char deviceIdBuf[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    snprintf(deviceIdBuf, sizeof(deviceIdBuf), "%s", deviceId.c_str());
    int ret = _audioDeviceManager->getPlaybackDeviceInfo(deviceIdBuf, deviceName);
    return {ret, std::string(deviceName)};
}

GetPlaybackDeviceInfoExResult AudioDeviceManagerBridge::getPlaybackDeviceInfoEx(const std::string &deviceId) {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, "", ""}; }
    char deviceIdBuf[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceTypeName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    snprintf(deviceIdBuf, sizeof(deviceIdBuf), "%s", deviceId.c_str());
    int ret = _audioDeviceManager->getPlaybackDeviceInfo(deviceIdBuf, deviceName, deviceTypeName);
    return {ret, std::string(deviceName), std::string(deviceTypeName)};
}

int AudioDeviceManagerBridge::setPlaybackDeviceVolume(int volume) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setPlaybackDeviceVolume(volume);
}

GetPlaybackDeviceVolumeResult AudioDeviceManagerBridge::getPlaybackDeviceVolume() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int volume = 0;
    int ret = _audioDeviceManager->getPlaybackDeviceVolume(&volume);
    return {ret, volume};
}

int AudioDeviceManagerBridge::setRecordingDevice(const std::string &deviceId) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setRecordingDevice(deviceId.c_str());
}

GetRecordingDeviceResult AudioDeviceManagerBridge::getRecordingDevice() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _audioDeviceManager->getRecordingDevice(deviceId);
    return {ret, std::string(deviceId)};
}

//todo jsbing里设置名字为getRecordingDeviceInfo，然后先尝试调用getRecordingDeviceInfoEx，再尝试调用 getRecordingDeviceInfo
GetRecordingDeviceInfoResult AudioDeviceManagerBridge::getRecordingDeviceInfo(const std::string &deviceId) {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    char deviceIdBuf[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    snprintf(deviceIdBuf, sizeof(deviceIdBuf), "%s", deviceId.c_str());
    int ret = _audioDeviceManager->getRecordingDeviceInfo(deviceIdBuf, deviceName);
    return {ret, std::string(deviceName)};
}

GetRecordingDeviceInfoExResult AudioDeviceManagerBridge::getRecordingDeviceInfoEx(const std::string &deviceId) {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, "", ""}; }
    char deviceIdBuf[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    char deviceTypeName[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    snprintf(deviceIdBuf, sizeof(deviceIdBuf), "%s", deviceId.c_str());
    int ret = _audioDeviceManager->getRecordingDeviceInfo(deviceIdBuf, deviceName, deviceTypeName);
    return {ret, std::string(deviceName), std::string(deviceTypeName)};
}

int AudioDeviceManagerBridge::setRecordingDeviceVolume(int volume) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setRecordingDeviceVolume(volume);
}

GetRecordingDeviceVolumeResult AudioDeviceManagerBridge::getRecordingDeviceVolume() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, 0}; }
    int volume = 0;
    int ret = _audioDeviceManager->getRecordingDeviceVolume(&volume);
    return {ret, volume};
}

int AudioDeviceManagerBridge::setLoopbackDevice(const std::string &deviceId) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setLoopbackDevice(deviceId.c_str());
}

GetLoopbackDeviceResult AudioDeviceManagerBridge::getLoopbackDevice() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, ""}; }
    char deviceId[agora::rtc::MAX_DEVICE_ID_LENGTH] = {0};
    int ret = _audioDeviceManager->getLoopbackDevice(deviceId);
    return {ret, std::string(deviceId)};
}

int AudioDeviceManagerBridge::setPlaybackDeviceMute(bool mute) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setPlaybackDeviceMute(mute);
}

GetPlaybackDeviceMuteResult AudioDeviceManagerBridge::getPlaybackDeviceMute() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, false}; }
    bool mute = false;
    int ret = _audioDeviceManager->getPlaybackDeviceMute(&mute);
    return {ret, mute};
}

int AudioDeviceManagerBridge::setRecordingDeviceMute(bool mute) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->setRecordingDeviceMute(mute);
}

GetRecordingDeviceMuteResult AudioDeviceManagerBridge::getRecordingDeviceMute() {
    if (!_audioDeviceManager) { return {-agora::ERR_INVALID_ARGUMENT, false}; }
    bool mute = false;
    int ret = _audioDeviceManager->getRecordingDeviceMute(&mute);
    return {ret, mute};
}

int AudioDeviceManagerBridge::startPlaybackDeviceTest(const std::string &testAudioFilePath) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->startPlaybackDeviceTest(testAudioFilePath.c_str());
}

int AudioDeviceManagerBridge::stopPlaybackDeviceTest() {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->stopPlaybackDeviceTest();
}

int AudioDeviceManagerBridge::startRecordingDeviceTest(int indicationInterval) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->startRecordingDeviceTest(indicationInterval);
}

int AudioDeviceManagerBridge::stopRecordingDeviceTest() {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->stopRecordingDeviceTest();
}

int AudioDeviceManagerBridge::startAudioDeviceLoopbackTest(int indicationInterval) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->startAudioDeviceLoopbackTest(indicationInterval);
}

int AudioDeviceManagerBridge::stopAudioDeviceLoopbackTest() {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->stopAudioDeviceLoopbackTest();
}

int AudioDeviceManagerBridge::followSystemPlaybackDevice(bool enable) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->followSystemPlaybackDevice(enable);
}

int AudioDeviceManagerBridge::followSystemRecordingDevice(bool enable) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->followSystemRecordingDevice(enable);
}

int AudioDeviceManagerBridge::followSystemLoopbackDevice(bool enable) {
    if (!_audioDeviceManager) { return -agora::ERR_INVALID_ARGUMENT; }
    return _audioDeviceManager->followSystemLoopbackDevice(enable);
}

void AudioDeviceManagerBridge::__release() {}
