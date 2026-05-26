#pragma once

#include "IAudioDeviceManager.h"
#include <string>

struct GetAudioDeviceInfoResult {
    int errorCode;
    std::string deviceName;
    std::string deviceId;
};

struct GetAudioDeviceInfoExResult {
    int errorCode;
    std::string deviceName;
    std::string deviceTypeName;
    std::string deviceId;
};

struct GetAudioDeviceVolumeResult {
    int errorCode;
    int volume;
};

struct GetAudioDeviceMuteResult {
    int errorCode;
    bool muted;
};

class AudioDeviceCollectionBridge {
public:
    AudioDeviceCollectionBridge(agora::rtc::IAudioDeviceCollection *collection);
    ~AudioDeviceCollectionBridge();

    void invalidate();

    int getCount();
    int setDevice(const std::string &deviceId);
    //todo jsbing
    GetAudioDeviceInfoResult getDevice(int index);
    GetAudioDeviceInfoExResult getDeviceEx(int index);
    GetAudioDeviceInfoResult getDefaultDevice();
    GetAudioDeviceInfoExResult getDefaultDeviceEx();
    int setApplicationVolume(int volume);
    GetAudioDeviceVolumeResult getApplicationVolume();
    int setApplicationMute(bool mute);
    GetAudioDeviceMuteResult isApplicationMute();

private:
    agora::rtc::IAudioDeviceCollection *_collection{nullptr};
};
