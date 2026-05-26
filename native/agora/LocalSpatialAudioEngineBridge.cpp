#include "agora/LocalSpatialAudioEngineBridge.h"

#include "AgoraBase.h"

LocalSpatialAudioEngineBridge::LocalSpatialAudioEngineBridge(
    agora::agora_refptr<agora::rtc::ILocalSpatialAudioEngine> spatialAudioEngine)
    : _spatialAudioEngine(spatialAudioEngine) {}

LocalSpatialAudioEngineBridge::~LocalSpatialAudioEngineBridge() {
    invalidate();
}

bool LocalSpatialAudioEngineBridge::hasSpatialAudioEngine() const {
    return _spatialAudioEngine.get() != nullptr;
}

agora::agora_refptr<agora::rtc::ILocalSpatialAudioEngine> LocalSpatialAudioEngineBridge::spatialAudioEngine() const {
    return _spatialAudioEngine;
}

void LocalSpatialAudioEngineBridge::invalidate() {
    _spatialAudioEngine.reset();
}

//todo 这个函数需要在rtcEngine get里直接调用
int LocalSpatialAudioEngineBridge::initialize(const agora::rtc::LocalSpatialAudioConfig &config) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->initialize(config);
}

int LocalSpatialAudioEngineBridge::updateRemotePosition(agora::rtc::uid_t uid,
                                                        const agora::rtc::RemoteVoicePositionInfo &posInfo) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->updateRemotePosition(uid, posInfo);
}

int LocalSpatialAudioEngineBridge::updateRemotePositionEx(agora::rtc::uid_t uid,
                                                          const agora::rtc::RemoteVoicePositionInfo &posInfo,
                                                          const agora::rtc::RtcConnection &connection) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->updateRemotePositionEx(uid, posInfo, connection);
}

int LocalSpatialAudioEngineBridge::removeRemotePosition(agora::rtc::uid_t uid) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->removeRemotePosition(uid);
}

int LocalSpatialAudioEngineBridge::removeRemotePositionEx(agora::rtc::uid_t uid,
                                                          const agora::rtc::RtcConnection &connection) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->removeRemotePositionEx(uid, connection);
}

int LocalSpatialAudioEngineBridge::clearRemotePositionsEx(const agora::rtc::RtcConnection &connection) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->clearRemotePositionsEx(connection);
}

static void copyVec3(const std::vector<float> &src, float dst[3]) {
    for (size_t i = 0; i < 3 && i < src.size(); ++i) {
        dst[i] = src[i];
    }
}

int LocalSpatialAudioEngineBridge::updateSelfPositionEx(const std::vector<float> &position,
                                                        const std::vector<float> &axisForward,
                                                        const std::vector<float> &axisRight,
                                                        const std::vector<float> &axisUp,
                                                        const agora::rtc::RtcConnection &connection) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    float pos[3] = {0};
    float fwd[3] = {0};
    float right[3] = {0};
    float up[3] = {0};
    copyVec3(position, pos);
    copyVec3(axisForward, fwd);
    copyVec3(axisRight, right);
    copyVec3(axisUp, up);
    return _spatialAudioEngine->updateSelfPositionEx(pos, fwd, right, up, connection);
}

int LocalSpatialAudioEngineBridge::setMaxAudioRecvCount(int maxCount) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setMaxAudioRecvCount(maxCount);
}

int LocalSpatialAudioEngineBridge::setAudioRecvRange(float range) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setAudioRecvRange(range);
}

int LocalSpatialAudioEngineBridge::setDistanceUnit(float unit) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setDistanceUnit(unit);
}

int LocalSpatialAudioEngineBridge::updateSelfPosition(const std::vector<float> &position,
                                                      const std::vector<float> &axisForward,
                                                      const std::vector<float> &axisRight,
                                                      const std::vector<float> &axisUp) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    float pos[3] = {0};
    float fwd[3] = {0};
    float right[3] = {0};
    float up[3] = {0};
    copyVec3(position, pos);
    copyVec3(axisForward, fwd);
    copyVec3(axisRight, right);
    copyVec3(axisUp, up);
    return _spatialAudioEngine->updateSelfPosition(pos, fwd, right, up);
}

int LocalSpatialAudioEngineBridge::updatePlayerPositionInfo(int playerId,
                                                            const agora::rtc::RemoteVoicePositionInfo &positionInfo) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->updatePlayerPositionInfo(playerId, positionInfo);
}

int LocalSpatialAudioEngineBridge::setParameters(const std::string &params) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setParameters(params.c_str());
}

int LocalSpatialAudioEngineBridge::muteLocalAudioStream(bool mute) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->muteLocalAudioStream(mute);
}

int LocalSpatialAudioEngineBridge::muteAllRemoteAudioStreams(bool mute) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->muteAllRemoteAudioStreams(mute);
}

int LocalSpatialAudioEngineBridge::muteRemoteAudioStream(agora::rtc::uid_t uid, bool mute) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->muteRemoteAudioStream(uid, mute);
}

int LocalSpatialAudioEngineBridge::setRemoteAudioAttenuation(agora::rtc::uid_t uid, double attenuation, bool forceSet) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setRemoteAudioAttenuation(uid, attenuation, forceSet);
}

int LocalSpatialAudioEngineBridge::setZones(const std::vector<agora::rtc::SpatialAudioZone> &zones) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setZones(zones.data(), static_cast<unsigned int>(zones.size()));
}

int LocalSpatialAudioEngineBridge::setPlayerAttenuation(int playerId, double attenuation, bool forceSet) {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->setPlayerAttenuation(playerId, attenuation, forceSet);
}

int LocalSpatialAudioEngineBridge::clearRemotePositions() {
    if (!_spatialAudioEngine) { return -agora::ERR_INVALID_ARGUMENT; }
    return _spatialAudioEngine->clearRemotePositions();
}
