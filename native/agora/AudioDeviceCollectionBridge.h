#pragma once

#include "AgoraBase.h"
#include "IAudioDeviceManager.h"
#include <string>

struct GetAudioCollectionDeviceInfoResult {
    int errorCode;
    std::string deviceName;
    std::string deviceId;
};

struct GetAudioCollectionDeviceInfoExResult {
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
    bool mute;
};

class AudioDeviceCollectionBridge {
public:
    AudioDeviceCollectionBridge(agora::rtc::IAudioDeviceCollection *collection);
    ~AudioDeviceCollectionBridge();

    //todo jsb ignore
    void invalidate();

    int getCount();
    int setDevice(const std::string &deviceId);
    //todo jsb manual 合并getDevice，getDeviceEx 到一个jsb 函数中
    GetAudioCollectionDeviceInfoResult getDevice(int index);
    GetAudioCollectionDeviceInfoExResult getDeviceEx(int index);

    //todo jsb manual getDefaultDevice，getDefaultDeviceEx 到一个jsb 函数中
    GetAudioCollectionDeviceInfoResult getDefaultDevice();
    GetAudioCollectionDeviceInfoExResult getDefaultDeviceEx();

    int setApplicationVolume(int volume);
    GetAudioDeviceVolumeResult getApplicationVolume();
    int setApplicationMute(bool mute);
    GetAudioDeviceMuteResult isApplicationMute();

private:
    agora::rtc::IAudioDeviceCollection *_collection{nullptr};
};
