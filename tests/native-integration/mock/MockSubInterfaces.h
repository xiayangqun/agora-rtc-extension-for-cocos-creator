#pragma once
#include "IAgoraRtcEngine.h"
#include "IAudioDeviceManager.h"

namespace agora {
namespace rtc {

class MockAudioDeviceCollection : public IAudioDeviceCollection {
public:
    int getCount() override { return 0; }
    int getDevice(int index, char deviceName[512], char deviceId[512]) override { return -1; }
    int getDevice(int index, char deviceName[512], char deviceTypeName[512], char deviceId[512]) override { return -1; }
    int setDevice(const char deviceId[512]) override { return 0; }
    int getDefaultDevice(char deviceName[512], char deviceId[512]) override { return -1; }
    int getDefaultDevice(char deviceName[512], char deviceTypeName[512], char deviceId[512]) override { return -1; }
    int setApplicationVolume(int volume) override { return 0; }
    int getApplicationVolume(int& volume) override { volume = 0; return 0; }
    int setApplicationMute(bool mute) override { return 0; }
    int isApplicationMute(bool& mute) override { mute = false; return 0; }
    void release() override {}
};

class MockAudioDeviceManager : public IAudioDeviceManager {
public:
    static MockAudioDeviceManager& instance() {
        static MockAudioDeviceManager inst;
        return inst;
    }

    IAudioDeviceCollection* enumeratePlaybackDevices() override { return nullptr; }
    IAudioDeviceCollection* enumerateRecordingDevices() override { return nullptr; }
    int setPlaybackDevice(const char deviceId[512]) override { return 0; }
    int getPlaybackDevice(char deviceId[512]) override { return 0; }
    int getPlaybackDeviceInfo(char deviceId[512], char deviceName[512]) override { return 0; }
    int getPlaybackDeviceInfo(char deviceId[512], char deviceName[512], char deviceTypeName[512]) override { return 0; }
    int setPlaybackDeviceVolume(int volume) override { return 0; }
    int getPlaybackDeviceVolume(int* volume) override { if (volume) *volume = 0; return 0; }
    int setRecordingDevice(const char deviceId[512]) override { return 0; }
    int getRecordingDevice(char deviceId[512]) override { return 0; }
    int getRecordingDeviceInfo(char deviceId[512], char deviceName[512]) override { return 0; }
    int getRecordingDeviceInfo(char deviceId[512], char deviceName[512], char deviceTypeName[512]) override { return 0; }
    int setRecordingDeviceVolume(int volume) override { return 0; }
    int getRecordingDeviceVolume(int* volume) override { if (volume) *volume = 0; return 0; }
    int setLoopbackDevice(const char deviceId[512]) override { return 0; }
    int getLoopbackDevice(char deviceId[512]) override { return 0; }
    int setPlaybackDeviceMute(bool mute) override { return 0; }
    int getPlaybackDeviceMute(bool* mute) override { if (mute) *mute = false; return 0; }
    int setRecordingDeviceMute(bool mute) override { return 0; }
    int getRecordingDeviceMute(bool* mute) override { if (mute) *mute = false; return 0; }
    int startPlaybackDeviceTest(const char* testAudioFilePath) override { return 0; }
    int stopPlaybackDeviceTest() override { return 0; }
    int startRecordingDeviceTest(int indicationInterval) override { return 0; }
    int stopRecordingDeviceTest() override { return 0; }
    int startAudioDeviceLoopbackTest(int indicationInterval) override { return 0; }
    int stopAudioDeviceLoopbackTest() override { return 0; }
    int followSystemPlaybackDevice(bool enable) override { return 0; }
    int followSystemRecordingDevice(bool enable) override { return 0; }
    int followSystemLoopbackDevice(bool enable) override { return 0; }
    void release() override {}

    void AddRef() const override {}
    RefCountReleaseStatus Release() const override { return RefCountReleaseStatus::kDroppedLastRef; }
    bool HasOneRef() const override { return true; }

private:
    MockAudioDeviceManager() = default;
};

class MockVideoDeviceCollection : public IVideoDeviceCollection {
public:
    int getCount() override { return 0; }
    int getDevice(int index, char deviceNameUTF8[512], char deviceIdUTF8[512]) override { return -1; }
    int setDevice(const char deviceIdUTF8[512]) override { return 0; }
    void release() override {}
};

class MockVideoDeviceManager : public IVideoDeviceManager {
public:
    static MockVideoDeviceManager& instance() {
        static MockVideoDeviceManager inst;
        return inst;
    }

    IVideoDeviceCollection* enumerateVideoDevices() override { return nullptr; }
    int setDevice(const char deviceIdUTF8[512]) override { return 0; }
    int getDevice(char deviceIdUTF8[512]) override { return 0; }
    int numberOfCapabilities(const char* deviceIdUTF8) override { return 0; }
    int getCapability(const char* deviceIdUTF8, const uint32_t deviceCapabilityNumber, VideoFormat& capability) override { return -1; }
    int startDeviceTest(view_t hwnd) override { return 0; }
    int stopDeviceTest() override { return 0; }
    void release() override {}

private:
    MockVideoDeviceManager() = default;
};

}  // namespace rtc
}  // namespace agora
