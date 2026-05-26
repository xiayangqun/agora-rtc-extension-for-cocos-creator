#pragma once

#include "IAgoraSpatialAudio.h"
#include <string>
#include <vector>

class LocalSpatialAudioEngineBridge {
public:
    explicit LocalSpatialAudioEngineBridge(
        agora::agora_refptr<agora::rtc::ILocalSpatialAudioEngine> spatialAudioEngine);
    ~LocalSpatialAudioEngineBridge();

    bool hasSpatialAudioEngine() const;
    agora::agora_refptr<agora::rtc::ILocalSpatialAudioEngine> spatialAudioEngine() const;
    void invalidate();

    int initialize(const agora::rtc::LocalSpatialAudioConfig &config);
    int updateRemotePosition(agora::rtc::uid_t uid, const agora::rtc::RemoteVoicePositionInfo &posInfo);
    int updateRemotePositionEx(agora::rtc::uid_t uid, const agora::rtc::RemoteVoicePositionInfo &posInfo,
                               const agora::rtc::RtcConnection &connection);
    int removeRemotePosition(agora::rtc::uid_t uid);
    int removeRemotePositionEx(agora::rtc::uid_t uid, const agora::rtc::RtcConnection &connection);
    int clearRemotePositionsEx(const agora::rtc::RtcConnection &connection);
    int updateSelfPositionEx(const std::vector<float> &position, const std::vector<float> &axisForward,
                             const std::vector<float> &axisRight, const std::vector<float> &axisUp,
                             const agora::rtc::RtcConnection &connection);
    int setMaxAudioRecvCount(int maxCount);
    int setAudioRecvRange(float range);
    int setDistanceUnit(float unit);
    int updateSelfPosition(const std::vector<float> &position, const std::vector<float> &axisForward,
                           const std::vector<float> &axisRight, const std::vector<float> &axisUp);
    int updatePlayerPositionInfo(int playerId, const agora::rtc::RemoteVoicePositionInfo &positionInfo);
    int setParameters(const std::string &params);
    int muteLocalAudioStream(bool mute);
    int muteAllRemoteAudioStreams(bool mute);
    int muteRemoteAudioStream(agora::rtc::uid_t uid, bool mute);
    int setRemoteAudioAttenuation(agora::rtc::uid_t uid, double attenuation, bool forceSet);
    int setZones(const std::vector<agora::rtc::SpatialAudioZone> &zones);
    int setPlayerAttenuation(int playerId, double attenuation, bool forceSet);
    int clearRemotePositions();

private:
    agora::agora_refptr<agora::rtc::ILocalSpatialAudioEngine> _spatialAudioEngine;
};
