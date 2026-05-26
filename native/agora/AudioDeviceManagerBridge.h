#pragma once

#include "IAudioDeviceManager.h"
#include "agora/AudioDeviceCollectionBridge.h"
#include <memory>
#include <string>

struct GetPlaybackDeviceResult {
    int errorCode;
    std::string deviceId;
};

struct GetPlaybackDeviceInfoResult {
    int errorCode;
    std::string deviceName;
};

struct GetPlaybackDeviceInfoExResult {
    int errorCode;
    std::string deviceName;
    std::string deviceTypeName;
};

struct GetPlaybackDeviceVolumeResult {
    int errorCode;
    int volume;
};

struct GetRecordingDeviceResult {
    int errorCode;
    std::string deviceId;
};

struct GetRecordingDeviceInfoResult {
    int errorCode;
    std::string deviceName;
};

struct GetRecordingDeviceInfoExResult {
    int errorCode;
    std::string deviceName;
    std::string deviceTypeName;
};

struct GetRecordingDeviceVolumeResult {
    int errorCode;
    int volume;
};

struct GetLoopbackDeviceResult {
    int errorCode;
    std::string deviceId;
};

struct GetPlaybackDeviceMuteResult {
    int errorCode;
    bool muted;
};

struct GetRecordingDeviceMuteResult {
    int errorCode;
    bool muted;
};

class AudioDeviceManagerBridge {
public:
    explicit AudioDeviceManagerBridge(agora::agora_refptr<agora::rtc::IAudioDeviceManager> audioDeviceManager);
    ~AudioDeviceManagerBridge();

    bool hasAudioDeviceManager() const;
    agora::agora_refptr<agora::rtc::IAudioDeviceManager> audioDeviceManager() const;
    void invalidate();

    std::shared_ptr<AudioDeviceCollectionBridge> enumeratePlaybackDevices();
    std::shared_ptr<AudioDeviceCollectionBridge> enumerateRecordingDevices();
    int setPlaybackDevice(const std::string &deviceId);
    GetPlaybackDeviceResult getPlaybackDevice();
    GetPlaybackDeviceInfoResult getPlaybackDeviceInfo(const std::string &deviceId);
    GetPlaybackDeviceInfoExResult getPlaybackDeviceInfoEx(const std::string &deviceId);
    int setPlaybackDeviceVolume(int volume);
    GetPlaybackDeviceVolumeResult getPlaybackDeviceVolume();
    int setRecordingDevice(const std::string &deviceId);
    GetRecordingDeviceResult getRecordingDevice();
    GetRecordingDeviceInfoResult getRecordingDeviceInfo(const std::string &deviceId);
    GetRecordingDeviceInfoExResult getRecordingDeviceInfoEx(const std::string &deviceId);
    int setRecordingDeviceVolume(int volume);
    GetRecordingDeviceVolumeResult getRecordingDeviceVolume();
    int setLoopbackDevice(const std::string &deviceId);
    GetLoopbackDeviceResult getLoopbackDevice();
    int setPlaybackDeviceMute(bool mute);
    GetPlaybackDeviceMuteResult getPlaybackDeviceMute();
    int setRecordingDeviceMute(bool mute);
    GetRecordingDeviceMuteResult getRecordingDeviceMute();
    int startPlaybackDeviceTest(const std::string &testAudioFilePath);
    int stopPlaybackDeviceTest();
    int startRecordingDeviceTest(int indicationInterval);
    int stopRecordingDeviceTest();
    int startAudioDeviceLoopbackTest(int indicationInterval);
    int stopAudioDeviceLoopbackTest();
    int followSystemPlaybackDevice(bool enable);
    int followSystemRecordingDevice(bool enable);
    int followSystemLoopbackDevice(bool enable);
    void __release();

private:
    agora::agora_refptr<agora::rtc::IAudioDeviceManager> _audioDeviceManager;
    std::shared_ptr<AudioDeviceCollectionBridge> _playbackDevices;
    std::shared_ptr<AudioDeviceCollectionBridge> _recordingDevices;
};
