#include "MockIRtcEngineEx.h"
#include "JsonHelper.h"
#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include <sstream>
#include <iomanip>

// Helper: parse a JSON string into a rapidjson::Value for nesting in a Document
static void parseJsonInto(const std::string& jsonStr, rapidjson::Value& out, rapidjson::Document::AllocatorType& alloc) {
    rapidjson::Document tmp;
    tmp.Parse(jsonStr.c_str());
    if (!tmp.HasParseError()) {
        out.CopyFrom(tmp, alloc);
    } else {
        out.SetObject();
    }
}

namespace agora {
namespace rtc {

void MockIRtcEngineEx::setLogPath(const std::string& path) {
    mock::MockLog::instance().setLogPath(path);
}

void MockIRtcEngineEx::clearLog() {
    mock::MockLog::instance().clearLog();
}

std::string MockIRtcEngineEx::readLog() {
    return mock::MockLog::instance().readLog();
}

void MockIRtcEngineEx::appendLog(const std::string& functionName, const std::string& paramsJson) {
    mock::MockLog::instance().appendLog(functionName, paramsJson);
}

void MockIRtcEngineEx::release() {
    appendLog("release", "{}");
}

int MockIRtcEngineEx::initialize(const RtcEngineContext& context) {
    storedContext = context;
    eventHandler = context.eventHandler;

    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    rapidjson::Value appIdVal;
    appIdVal.SetString(context.appId ? context.appId : "", alloc);
    d.AddMember("appId", appIdVal, alloc);
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    d.Accept(writer);
    appendLog("initialize", buffer.GetString());

    return 0;
}

int MockIRtcEngineEx::queryInterface(INTERFACE_ID_TYPE iid, void** inter) {
    if (!inter) return -1;
    switch (iid) {
        case AGORA_IID_AUDIO_DEVICE_MANAGER:
            *inter = static_cast<IAudioDeviceManager*>(mockAudioDeviceMgr_);
            return 0;
        case AGORA_IID_VIDEO_DEVICE_MANAGER:
            *inter = static_cast<IVideoDeviceManager*>(mockVideoDeviceMgr_);
            return 0;
        case AGORA_IID_H265_TRANSCODER:
            *inter = static_cast<IH265Transcoder*>(mockH265Transcoder_);
            return 0;
        case AGORA_IID_LOCAL_SPATIAL_AUDIO:
            *inter = static_cast<ILocalSpatialAudioEngine*>(mockSpatialAudioEngine_);
            return 0;
        case AGORA_IID_MUSIC_CONTENT_CENTER:
            *inter = static_cast<IMusicContentCenter*>(mockMusicContentCenter_);
            return 0;
        default:
            *inter = nullptr;
            return -1;
    }
}

const char* MockIRtcEngineEx::getVersion(int* build) {
    return nullptr;
}

const char* MockIRtcEngineEx::getErrorDescription(int code) {
    return nullptr;
}

int MockIRtcEngineEx::queryCodecCapability(CodecCapInfo* codecInfo, int& size) {
    appendLog("queryCodecCapability", "{}");
    return 0;
}

int MockIRtcEngineEx::queryDeviceScore() {
    appendLog("queryDeviceScore", "{}");
    return 0;
}

int MockIRtcEngineEx::preloadChannel(const char* token, const char* channelId, uid_t uid) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(token ? token : "", a); d.AddMember("token", v, a);
    v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a);
    d.AddMember("uid", uid, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("preloadChannel", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::preloadChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(token ? token : "", a); d.AddMember("token", v, a);
    v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a);
    v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("preloadChannelWithUserAccount", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updatePreloadChannelToken(const char* token) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(token ? token : "", d.GetAllocator());
    d.AddMember("token", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updatePreloadChannelToken", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::joinChannel(const char* token, const char* channelId, const char* info, uid_t uid) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    rapidjson::Value tokenVal;
    tokenVal.SetString(token ? token : "", alloc);
    d.AddMember("token", tokenVal, alloc);
    rapidjson::Value channelIdVal;
    channelIdVal.SetString(channelId ? channelId : "", alloc);
    d.AddMember("channelId", channelIdVal, alloc);
    rapidjson::Value infoVal;
    infoVal.SetString(info ? info : "", alloc);
    d.AddMember("info", infoVal, alloc);
    d.AddMember("uid", uid, alloc);
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    d.Accept(writer);
    appendLog("joinChannel", buffer.GetString());

    return 0;
}

int MockIRtcEngineEx::joinChannel(const char* token, const char* channelId, uid_t uid, const ChannelMediaOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a); }
    { d.AddMember("uid", uid, a); }
    {
        std::string optJson = json::toJson(options);
        rapidjson::Document optDoc;
        optDoc.Parse(optJson.c_str());
        if (!optDoc.HasParseError()) {
            d.AddMember("options", optDoc.Move(), a);
        }
    }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("joinChannel", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateChannelMediaOptions(const ChannelMediaOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateChannelMediaOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::leaveChannel() {
    appendLog("leaveChannel", "{}");
    return 0;
}

int MockIRtcEngineEx::leaveChannel(const LeaveChannelOptions& options) {
    appendLog("leaveChannel", "{}");
    return 0;
}

int MockIRtcEngineEx::renewToken(const char* token) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(token ? token : "", d.GetAllocator());
    d.AddMember("token", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("renewToken", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setChannelProfile(CHANNEL_PROFILE_TYPE profile) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("profile", profile, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setChannelProfile", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setClientRole(CLIENT_ROLE_TYPE role) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("role", role, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setClientRole", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setClientRole(CLIENT_ROLE_TYPE role, const ClientRoleOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("role", static_cast<int>(role), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setClientRole", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startEchoTest(const EchoTestConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enableAudio", config.enableAudio, a);
    d.AddMember("enableVideo", config.enableVideo, a);
    rapidjson::Value v;
    v.SetString(config.token ? config.token : "", a); d.AddMember("token", v, a);
    v.SetString(config.channelId ? config.channelId : "", a); d.AddMember("channelId", v, a);
    d.AddMember("intervalInSeconds", config.intervalInSeconds, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startEchoTest", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopEchoTest() {
    appendLog("stopEchoTest", "{}");
    return 0;
}

#if defined(__APPLE__) && TARGET_OS_IOS
int MockIRtcEngineEx::enableMultiCamera(bool enabled, const CameraCapturerConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("cameraDirection", 0 /*cameraDirection*/, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableMultiCamera", buf.GetString());
    return 0;
}
#endif

int MockIRtcEngineEx::enableVideo() {
    appendLog("enableVideo", "{}");
    return 0;
}

int MockIRtcEngineEx::disableVideo() {
    appendLog("disableVideo", "{}");
    return 0;
}

int MockIRtcEngineEx::startPreview() {
    appendLog("startPreview", "{}");
    return 0;
}

int MockIRtcEngineEx::startPreview(VIDEO_SOURCE_TYPE sourceType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("sourceType", sourceType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startPreview", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopPreview() {
    appendLog("stopPreview", "{}");
    return 0;
}

int MockIRtcEngineEx::stopPreview(VIDEO_SOURCE_TYPE sourceType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("sourceType", sourceType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopPreview", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startLastmileProbeTest(const LastmileProbeConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("probeUplink", config.probeUplink, a);
    d.AddMember("probeDownlink", config.probeDownlink, a);
    d.AddMember("expectedUplinkBitrate", config.expectedUplinkBitrate, a);
    d.AddMember("expectedDownlinkBitrate", config.expectedDownlinkBitrate, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startLastmileProbeTest", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopLastmileProbeTest() {
    appendLog("stopLastmileProbeTest", "{}");
    return 0;
}

int MockIRtcEngineEx::setVideoEncoderConfiguration(const VideoEncoderConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("codecType", config.codecType, a);
    d.AddMember("orientationMode", config.orientationMode, a);
    d.AddMember("degradationPreference", config.degradationPreference, a);
    d.AddMember("mirrorMode", config.mirrorMode, a);
    d.AddMember("frameRate", config.frameRate, a);
    d.AddMember("bitrate", config.bitrate, a);
    d.AddMember("minBitrate", config.minBitrate, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVideoEncoderConfiguration", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setBeautyEffectOptions(bool enabled, const BeautyOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("lighteningContrastLevel", options.lighteningContrastLevel, a);
    d.AddMember("lighteningLevel", options.lighteningLevel, a);
    d.AddMember("smoothnessLevel", options.smoothnessLevel, a);
    d.AddMember("rednessLevel", options.rednessLevel, a);
    d.AddMember("sharpnessLevel", options.sharpnessLevel, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setBeautyEffectOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setFaceShapeBeautyOptions(bool enabled, const FaceShapeBeautyOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("intensity", options.styleIntensity, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setFaceShapeBeautyOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setFaceShapeAreaOptions(const FaceShapeAreaOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("shapeArea", options.shapeArea, a);
    d.AddMember("shapeIntensity", options.shapeIntensity, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setFaceShapeAreaOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getFaceShapeBeautyOptions(FaceShapeBeautyOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("type", type, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getFaceShapeBeautyOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getFaceShapeAreaOptions(agora::rtc::FaceShapeAreaOptions::FACE_SHAPE_AREA shapeArea, FaceShapeAreaOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("shapeArea", shapeArea, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getFaceShapeAreaOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setFilterEffectOptions(bool enabled, const FilterEffectOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    rapidjson::Value v;
    v.SetString(options.path ? options.path : "", a); d.AddMember("path", v, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setFilterEffectOptions", buf.GetString());
    return 0;
}

agora_refptr<IVideoEffectObject> MockIRtcEngineEx::createVideoEffectObject(const char* bundlePath, agora::media::MEDIA_SOURCE_TYPE type) {
    int id = ++nextVideoEffectId_;
    auto* mock = new MockIVideoEffectObject(id);
    appendLog("createVideoEffectObject", "{}");
    return agora_refptr<IVideoEffectObject>(mock);
}

int MockIRtcEngineEx::destroyVideoEffectObject(agora_refptr<IVideoEffectObject> videoEffectObject) {
    appendLog("destroyVideoEffectObject", "{}");
    return 0;
}

int MockIRtcEngineEx::setLowlightEnhanceOptions(bool enabled, const LowlightEnhanceOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("mode", options.mode, a);
    d.AddMember("level", options.level, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLowlightEnhanceOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVideoDenoiserOptions(bool enabled, const VideoDenoiserOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("mode", options.mode, a);
    d.AddMember("level", options.level, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVideoDenoiserOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setColorEnhanceOptions(bool enabled, const ColorEnhanceOptions& options, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("strengthLevel", options.strengthLevel, a);
    d.AddMember("skinProtectLevel", options.skinProtectLevel, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setColorEnhanceOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableVirtualBackground(bool enabled, VirtualBackgroundSource backgroundSource, SegmentationProperty segproperty, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(backgroundSource), v, a); d.AddMember("backgroundSource", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(segproperty), v, a); d.AddMember("segproperty", v, a); }
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableVirtualBackground", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setupRemoteVideo(const VideoCanvas& canvas) {
    std::string jsonStr = json::toJson(canvas);
    appendLog("setupRemoteVideo", jsonStr.c_str());
    return 0;
}

int MockIRtcEngineEx::setupLocalVideo(const VideoCanvas& canvas) {
    std::string jsonStr = json::toJson(canvas);
    appendLog("setupLocalVideo", jsonStr.c_str());
    return 0;
}

int MockIRtcEngineEx::setVideoScenario(VIDEO_APPLICATION_SCENARIO_TYPE scenarioType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("scenarioType", scenarioType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVideoScenario", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVideoQoEPreference(VIDEO_QOE_PREFERENCE_TYPE qoePreference) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("qoePreference", qoePreference, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVideoQoEPreference", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableAudio() {
    appendLog("enableAudio", "{}");
    return 0;
}

int MockIRtcEngineEx::disableAudio() {
    appendLog("disableAudio", "{}");
    return 0;
}

int MockIRtcEngineEx::setAudioProfile(AUDIO_PROFILE_TYPE profile) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("profile", profile, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioProfile", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioProfile(AUDIO_PROFILE_TYPE profile, AUDIO_SCENARIO_TYPE scenario) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("profile", profile, a);
    d.AddMember("scenario", scenario, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioProfile", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioScenario(AUDIO_SCENARIO_TYPE scenario) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("scenario", scenario, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioScenario", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableLocalAudio(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableLocalAudio", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteLocalAudioStream(bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteLocalAudioStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteAllRemoteAudioStreams(bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteAllRemoteAudioStreams", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteRemoteAudioStream(uid_t uid, bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("uid", uid, d.GetAllocator());
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteRemoteAudioStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteLocalVideoStream(bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteLocalVideoStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableLocalVideo(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableLocalVideo", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteAllRemoteVideoStreams(bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteAllRemoteVideoStreams", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteDefaultVideoStreamType(VIDEO_STREAM_TYPE streamType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("streamType", streamType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteDefaultVideoStreamType", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteRemoteVideoStream(uid_t uid, bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("uid", uid, d.GetAllocator());
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteRemoteVideoStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteVideoStreamType(uid_t uid, VIDEO_STREAM_TYPE streamType) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    d.AddMember("streamType", streamType, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteVideoStreamType", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteVideoSubscriptionOptions(uid_t uid, const VideoSubscriptionOptions &options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    /* options.type is Optional, skipped */
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteVideoSubscriptionOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeAudioBlocklist(uid_t* uidList, int uidNumber) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeAudioBlocklist", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeAudioAllowlist(uid_t* uidList, int uidNumber) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeAudioAllowlist", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeVideoBlocklist(uid_t* uidList, int uidNumber) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeVideoBlocklist", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeVideoAllowlist(uid_t* uidList, int uidNumber) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeVideoAllowlist", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableAudioVolumeIndication(int interval, int smooth, bool reportVad) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("interval", interval, a);
    d.AddMember("smooth", smooth, a);
    d.AddMember("reportVad", reportVad, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableAudioVolumeIndication", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startAudioRecording(const AudioRecordingConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startAudioRecording", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startAudioRecording(const char* filePath, AUDIO_RECORDING_QUALITY_TYPE quality) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    d.AddMember("quality", quality, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startAudioRecording", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startAudioRecording(const char* filePath, int sampleRate, AUDIO_RECORDING_QUALITY_TYPE quality) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("quality", quality, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startAudioRecording", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::registerAudioEncodedFrameObserver(const AudioEncodedFrameObserverConfig& config,  IAudioEncodedFrameObserver *observer) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("postionType", config.postionType, a);
    d.AddMember("encodingType", config.encodingType, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("registerAudioEncodedFrameObserver", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopAudioRecording() {
    appendLog("stopAudioRecording", "{}");
    return 0;
}

agora_refptr<IMediaPlayer> MockIRtcEngineEx::createMediaPlayer() {
    int id = ++nextMediaPlayerId_;
    auto* mock = new MockIMediaPlayer(id);
    mockMediaPlayer_ = agora_refptr<IMediaPlayer>(mock);
    appendLog("createMediaPlayer", "{}");
    return mockMediaPlayer_;
}

int MockIRtcEngineEx::destroyMediaPlayer(agora_refptr<IMediaPlayer> media_player) {
    mockMediaPlayer_ = nullptr;
    appendLog("destroyMediaPlayer", "{}");
    return 0;
}

agora_refptr<IMediaRecorder> MockIRtcEngineEx::createMediaRecorder(const RecorderStreamInfo& info) {
    int id = ++nextMediaRecorderId_;
    auto* mock = new MockIMediaRecorder(id);
    mockMediaRecorder_ = agora_refptr<IMediaRecorder>(mock);
    appendLog("createMediaRecorder", "{}");
    return mockMediaRecorder_;
}

int MockIRtcEngineEx::destroyMediaRecorder(agora_refptr<IMediaRecorder> mediaRecorder) {
    mockMediaRecorder_ = nullptr;
    appendLog("destroyMediaRecorder", "{}");
    return 0;
}

int MockIRtcEngineEx::startAudioMixing(const char* filePath, bool loopback, int cycle, int startPos) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    d.AddMember("loopback", loopback, a);
    d.AddMember("cycle", cycle, a);
    d.AddMember("startPos", startPos, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startAudioMixing", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startAudioMixing(const char* filePath, bool loopback, int cycle) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    d.AddMember("loopback", loopback, a);
    d.AddMember("cycle", cycle, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startAudioMixing", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopAudioMixing() {
    appendLog("stopAudioMixing", "{}");
    return 0;
}

int MockIRtcEngineEx::pauseAudioMixing() {
    appendLog("pauseAudioMixing", "{}");
    return 0;
}

int MockIRtcEngineEx::resumeAudioMixing() {
    appendLog("resumeAudioMixing", "{}");
    return 0;
}

int MockIRtcEngineEx::selectAudioTrack(int index) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("selectAudioTrack", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getAudioTrackCount() {
    appendLog("getAudioTrackCount", "{}");
    return 0;
}

int MockIRtcEngineEx::adjustAudioMixingVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustAudioMixingVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustAudioMixingPublishVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustAudioMixingPublishVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getAudioMixingPublishVolume() {
    appendLog("getAudioMixingPublishVolume", "{}");
    return 0;
}

int MockIRtcEngineEx::adjustAudioMixingPlayoutVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustAudioMixingPlayoutVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getAudioMixingPlayoutVolume() {
    appendLog("getAudioMixingPlayoutVolume", "{}");
    return 0;
}

int MockIRtcEngineEx::getAudioMixingDuration() {
    appendLog("getAudioMixingDuration", "{}");
    return 0;
}

int MockIRtcEngineEx::getAudioMixingCurrentPosition() {
    appendLog("getAudioMixingCurrentPosition", "{}");
    return 0;
}

int MockIRtcEngineEx::setAudioMixingPosition(int pos /*in ms*/) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("pos", pos, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioMixingPosition", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioMixingDualMonoMode(media::AUDIO_MIXING_DUAL_MONO_MODE mode) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mode", mode, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioMixingDualMonoMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioMixingPitch(int pitch) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("pitch", pitch, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioMixingPitch", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioMixingPlaybackSpeed(int speed) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("speed", speed, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioMixingPlaybackSpeed", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getEffectsVolume() {
    appendLog("getEffectsVolume", "{}");
    return 0;
}

int MockIRtcEngineEx::setEffectsVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setEffectsVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::preloadEffect(int soundId, const char* filePath, int startPos) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    d.AddMember("soundId", soundId, a);
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    d.AddMember("startPos", startPos, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("preloadEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::playEffect(int soundId, const char* filePath, int loopCount, double pitch, double pan, int gain, bool publish, int startPos) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    d.AddMember("soundId", soundId, a);
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    d.AddMember("loopCount", loopCount, a);
    d.AddMember("pitch", pitch, a);
    d.AddMember("pan", pan, a);
    d.AddMember("gain", gain, a);
    d.AddMember("publish", publish, a);
    d.AddMember("startPos", startPos, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("playEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::playAllEffects(int loopCount, double pitch, double pan, int gain, bool publish) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("loopCount", loopCount, a);
    d.AddMember("pitch", pitch, a);
    d.AddMember("pan", pan, a);
    d.AddMember("gain", gain, a);
    d.AddMember("publish", publish, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("playAllEffects", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getVolumeOfEffect(int soundId) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getVolumeOfEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVolumeOfEffect(int soundId, int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVolumeOfEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::pauseEffect(int soundId) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("pauseEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::pauseAllEffects() {
    appendLog("pauseAllEffects", "{}");
    return 0;
}

int MockIRtcEngineEx::resumeEffect(int soundId) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("resumeEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::resumeAllEffects() {
    appendLog("resumeAllEffects", "{}");
    return 0;
}

int MockIRtcEngineEx::stopEffect(int soundId) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopAllEffects() {
    appendLog("stopAllEffects", "{}");
    return 0;
}

int MockIRtcEngineEx::unloadEffect(int soundId) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("unloadEffect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::unloadAllEffects() {
    appendLog("unloadAllEffects", "{}");
    return 0;
}

int MockIRtcEngineEx::getEffectDuration(const char* filePath) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", d.GetAllocator());
    d.AddMember("filePath", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getEffectDuration", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setEffectPosition(int soundId, int pos) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    d.AddMember("pos", pos, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setEffectPosition", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getEffectCurrentPosition(int soundId) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("soundId", soundId, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getEffectCurrentPosition", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableSoundPositionIndication(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableSoundPositionIndication", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteVoicePosition(uid_t uid, double pan, double gain) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    d.AddMember("pan", pan, a);
    d.AddMember("gain", gain, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteVoicePosition", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableSpatialAudio(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableSpatialAudio", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteUserSpatialAudioParams(uid_t uid, const agora::SpatialAudioParams& params) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(params), v, a); d.AddMember("params", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteUserSpatialAudioParams", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVoiceBeautifierPreset(VOICE_BEAUTIFIER_PRESET preset) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("preset", preset, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVoiceBeautifierPreset", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioEffectPreset(AUDIO_EFFECT_PRESET preset) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("preset", preset, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioEffectPreset", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVoiceConversionPreset(VOICE_CONVERSION_PRESET preset) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("preset", preset, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVoiceConversionPreset", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAudioEffectParameters(AUDIO_EFFECT_PRESET preset, int param1, int param2) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("preset", preset, a);
    d.AddMember("param1", param1, a);
    d.AddMember("param2", param2, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioEffectParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVoiceBeautifierParameters(VOICE_BEAUTIFIER_PRESET preset, int param1, int param2) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("preset", preset, a);
    d.AddMember("param1", param1, a);
    d.AddMember("param2", param2, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVoiceBeautifierParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVoiceConversionParameters(VOICE_CONVERSION_PRESET preset, int param1, int param2) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("preset", preset, a);
    d.AddMember("param1", param1, a);
    d.AddMember("param2", param2, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVoiceConversionParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalVoicePitch(double pitch) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("pitch", pitch, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalVoicePitch", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalVoiceFormant(double formantRatio) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("formantRatio", formantRatio, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalVoiceFormant", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalVoiceEqualization(AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency, int bandGain) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("bandFrequency", bandFrequency, a);
    d.AddMember("bandGain", bandGain, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalVoiceEqualization", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalVoiceReverb(AUDIO_REVERB_TYPE reverbKey, int value) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("reverbKey", reverbKey, a);
    d.AddMember("value", value, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalVoiceReverb", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setHeadphoneEQPreset(HEADPHONE_EQUALIZER_PRESET preset) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("preset", preset, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setHeadphoneEQPreset", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setHeadphoneEQParameters(int lowGain, int highGain) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("lowGain", lowGain, a);
    d.AddMember("highGain", highGain, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setHeadphoneEQParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableVoiceAITuner(bool enabled, VOICE_AI_TUNER_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableVoiceAITuner", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLogFile(const char* filePath) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", d.GetAllocator());
    d.AddMember("filePath", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLogFile", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLogFilter(unsigned int filter) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("filter", filter, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLogFilter", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLogLevel(commons::LOG_LEVEL level) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("level", static_cast<int>(level), d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLogLevel", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLogFileSize(unsigned int fileSizeInKBytes) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("fileSizeInKBytes", fileSizeInKBytes, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLogFileSize", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::uploadLogFile(agora::util::AString& requestId) {
    appendLog("uploadLogFile", "{}");
    return 0;
}

int MockIRtcEngineEx::writeLog(commons::LOG_LEVEL level, const char* fmt, ...) {
    appendLog("writeLog", "{}");
    return 0;
}

int MockIRtcEngineEx::setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("renderMode", renderMode, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalRenderMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteRenderMode(uid_t uid, media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    d.AddMember("renderMode", renderMode, a);
    d.AddMember("mirrorMode", mirrorMode, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteRenderMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalRenderTargetFps(VIDEO_SOURCE_TYPE sourceType, int targetFps) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sourceType", sourceType, a);
    d.AddMember("targetFps", targetFps, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalRenderTargetFps", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteRenderTargetFps(int targetFps) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("targetFps", targetFps, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteRenderTargetFps", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("renderMode", renderMode, a);
    d.AddMember("mirrorMode", mirrorMode, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalRenderMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalVideoMirrorMode(VIDEO_MIRROR_MODE_TYPE mirrorMode) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mirrorMode", mirrorMode, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setLocalVideoMirrorMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableDualStreamMode(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableDualStreamMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableDualStreamMode(bool enabled, const SimulcastStreamConfig& streamConfig) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("isSimulcastStreamEnabled", streamConfig.dimensions.width, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableDualStreamMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setDualStreamMode(SIMULCAST_STREAM_MODE mode, const SimulcastStreamConfig& streamConfig) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mode", mode, a);
    d.AddMember("isSimulcastStreamEnabled", streamConfig.dimensions.width, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setDualStreamMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSimulcastConfig(const SimulcastConfig& simulcastConfig) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enableSimulcastVideoConfigCount", simulcastConfig.publish_fallback_enable, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSimulcastConfig", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setDualStreamMode(SIMULCAST_STREAM_MODE mode) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mode", mode, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setDualStreamMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableCustomAudioLocalPlayback(track_id_t trackId, bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("trackId", trackId, a);
    d.AddMember("enabled", enabled, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableCustomAudioLocalPlayback", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRecordingAudioFrameParameters(int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode, int samplesPerCall) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("channel", channel, a);
    d.AddMember("mode", mode, a);
    d.AddMember("samplesPerCall", samplesPerCall, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRecordingAudioFrameParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setPlaybackAudioFrameParameters(int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode, int samplesPerCall) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("channel", channel, a);
    d.AddMember("mode", mode, a);
    d.AddMember("samplesPerCall", samplesPerCall, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setPlaybackAudioFrameParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setMixedAudioFrameParameters(int sampleRate, int channel, int samplesPerCall) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("channel", channel, a);
    d.AddMember("samplesPerCall", samplesPerCall, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setMixedAudioFrameParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setEarMonitoringAudioFrameParameters(int sampleRate, int channel, RAW_AUDIO_FRAME_OP_MODE_TYPE mode, int samplesPerCall) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("channel", channel, a);
    d.AddMember("mode", mode, a);
    d.AddMember("samplesPerCall", samplesPerCall, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setEarMonitoringAudioFrameParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel, int samplesPerCall) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("channel", channel, a);
    d.AddMember("samplesPerCall", samplesPerCall, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setPlaybackAudioFrameBeforeMixingParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sampleRate", sampleRate, a);
    d.AddMember("channel", channel, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setPlaybackAudioFrameBeforeMixingParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableAudioSpectrumMonitor(int intervalInMS) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("intervalInMS", intervalInMS, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableAudioSpectrumMonitor", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::disableAudioSpectrumMonitor() {
    appendLog("disableAudioSpectrumMonitor", "{}");
    return 0;
}

int MockIRtcEngineEx::registerAudioSpectrumObserver(agora::media::IAudioSpectrumObserver * observer) {
    appendLog("registerAudioSpectrumObserver", "{}");
    return 0;
}

int MockIRtcEngineEx::unregisterAudioSpectrumObserver(agora::media::IAudioSpectrumObserver * observer) {
    appendLog("unregisterAudioSpectrumObserver", "{}");
    return 0;
}

int MockIRtcEngineEx::adjustRecordingSignalVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustRecordingSignalVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteRecordingSignal(bool mute) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteRecordingSignal", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustPlaybackSignalVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustPlaybackSignalVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustUserPlaybackSignalVolume(uid_t uid, int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("uid", uid, d.GetAllocator());
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustUserPlaybackSignalVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteSubscribeFallbackOption(STREAM_FALLBACK_OPTIONS option) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("option", option, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteSubscribeFallbackOption", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setHighPriorityUserList(uid_t* uidList, int uidNum, STREAM_FALLBACK_OPTIONS option) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNum; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNum", uidNum, a);
    d.AddMember("option", option, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setHighPriorityUserList", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableExtension(const char* provider, const char* extension, bool enable, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    d.AddMember("enable", enable, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableExtension", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setExtensionProperty(const char* provider, const char* extension, const char* key, const char* value, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    v.SetString(key ? key : "", a); d.AddMember("key", v, a);
    v.SetString(value ? value : "", a); d.AddMember("value", v, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setExtensionProperty", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getExtensionProperty(const char* provider, const char* extension, const char* key, char* value, int buf_len, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    v.SetString(key ? key : "", a); d.AddMember("key", v, a);
    d.AddMember("buf_len", buf_len, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getExtensionProperty", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableLoopbackRecording(bool enabled, const char* deviceName) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    d.AddMember("enabled", enabled, a);
    v.SetString(deviceName ? deviceName : "", a); d.AddMember("deviceName", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableLoopbackRecording", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustLoopbackSignalVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustLoopbackSignalVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getLoopbackRecordingVolume() {
    appendLog("getLoopbackRecordingVolume", "{}");
    return 0;
}

int MockIRtcEngineEx::enableInEarMonitoring(bool enabled, int includeAudioFilters) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("includeAudioFilters", includeAudioFilters, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableInEarMonitoring", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setInEarMonitoringVolume(int volume) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setInEarMonitoringVolume", buf.GetString());
    return 0;
}

#if defined(_WIN32) || defined(__ANDROID__) || (defined(__linux__) && !defined(__OHOS__))
int MockIRtcEngineEx::loadExtensionProvider(const char* path, bool unload_after_use) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(path ? path : "", a); d.AddMember("path", v, a);
    d.AddMember("unload_after_use", unload_after_use, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("loadExtensionProvider", buf.GetString());
    return 0;
}
#endif

int MockIRtcEngineEx::setExtensionProviderProperty(const char* provider, const char* key, const char* value) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(key ? key : "", a); d.AddMember("key", v, a);
    v.SetString(value ? value : "", a); d.AddMember("value", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setExtensionProviderProperty", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::registerExtension(const char* provider, const char* extension, agora::media::MEDIA_SOURCE_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    d.AddMember("type", type, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("registerExtension", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableExtension(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, bool enable) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    d.AddMember("mediaSourceType", extensionInfo.mediaSourceType, a);
    d.AddMember("remoteUid", extensionInfo.remoteUid, a);
    v.SetString(extensionInfo.channelId ? extensionInfo.channelId : "", a); d.AddMember("channelId", v, a);
    d.AddMember("enable", enable, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableExtension", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setExtensionProperty(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, const char* key, const char* value) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    d.AddMember("mediaSourceType", extensionInfo.mediaSourceType, a);
    d.AddMember("remoteUid", extensionInfo.remoteUid, a);
    v.SetString(extensionInfo.channelId ? extensionInfo.channelId : "", a); d.AddMember("channelId", v, a);
    v.SetString(key ? key : "", a); d.AddMember("key", v, a);
    v.SetString(value ? value : "", a); d.AddMember("value", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setExtensionProperty", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getExtensionProperty(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, const char* key, char* value, int buf_len) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(provider ? provider : "", a); d.AddMember("provider", v, a);
    v.SetString(extension ? extension : "", a); d.AddMember("extension", v, a);
    d.AddMember("mediaSourceType", extensionInfo.mediaSourceType, a);
    d.AddMember("remoteUid", extensionInfo.remoteUid, a);
    v.SetString(extensionInfo.channelId ? extensionInfo.channelId : "", a); d.AddMember("channelId", v, a);
    v.SetString(key ? key : "", a); d.AddMember("key", v, a);
    d.AddMember("buf_len", buf_len, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getExtensionProperty", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setCameraCapturerConfiguration(const CameraCapturerConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("cameraDirection", 0 /*cameraDirection*/, a);
    d.AddMember("format_width", config.format.width, a);
    d.AddMember("format_height", config.format.height, a);
    d.AddMember("format_fps", config.format.fps, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraCapturerConfiguration", buf.GetString());
    return 0;
}

video_track_id_t MockIRtcEngineEx::createCustomVideoTrack() {
    return 0;
}

video_track_id_t MockIRtcEngineEx::createCustomEncodedVideoTrack(const SenderOptions& sender_option) {
    return 0;
}

int MockIRtcEngineEx::destroyCustomVideoTrack(video_track_id_t video_track_id) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("video_track_id", video_track_id, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("destroyCustomVideoTrack", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::destroyCustomEncodedVideoTrack(video_track_id_t video_track_id) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("video_track_id", video_track_id, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("destroyCustomEncodedVideoTrack", buf.GetString());
    return 0;
}

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::switchCamera() {
    appendLog("switchCamera", "{}");
    return 0;
}

bool MockIRtcEngineEx::isCameraZoomSupported() {
    return false;
}

bool MockIRtcEngineEx::isCameraFaceDetectSupported() {
    return false;
}

bool MockIRtcEngineEx::isCameraTorchSupported() {
    return false;
}

bool MockIRtcEngineEx::isCameraFocusSupported() {
    return false;
}

bool MockIRtcEngineEx::isCameraAutoFocusFaceModeSupported() {
    return false;
}

int MockIRtcEngineEx::setCameraZoomFactor(float factor) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("factor", static_cast<double>(factor), d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraZoomFactor", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableFaceDetection(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableFaceDetection", buf.GetString());
    return 0;
}

float MockIRtcEngineEx::getCameraMaxZoomFactor() {
    return 0.0f;
}

int MockIRtcEngineEx::setCameraFocusPositionInPreview(float positionX, float positionY) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("positionX", static_cast<double>(positionX), a);
    d.AddMember("positionY", static_cast<double>(positionY), a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraFocusPositionInPreview", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setCameraTorchOn(bool isOn) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("isOn", isOn, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraTorchOn", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setCameraAutoFocusFaceModeEnabled(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraAutoFocusFaceModeEnabled", buf.GetString());
    return 0;
}

bool MockIRtcEngineEx::isCameraExposurePositionSupported() {
    return false;
}

int MockIRtcEngineEx::setCameraExposurePosition(float positionXinView, float positionYinView) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("positionXinView", static_cast<double>(positionXinView), a);
    d.AddMember("positionYinView", static_cast<double>(positionYinView), a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraExposurePosition", buf.GetString());
    return 0;
}

bool MockIRtcEngineEx::isCameraExposureSupported() {
    return false;
}

int MockIRtcEngineEx::setCameraExposureFactor(float factor) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("factor", static_cast<double>(factor), d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraExposureFactor", buf.GetString());
    return 0;
}

bool MockIRtcEngineEx::isCameraAutoExposureFaceModeSupported() {
    return false;
}

int MockIRtcEngineEx::setCameraAutoExposureFaceModeEnabled(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraAutoExposureFaceModeEnabled", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setCameraStabilizationMode(CAMERA_STABILIZATION_MODE mode) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("mode", mode, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraStabilizationMode", buf.GetString());
    return 0;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("defaultToSpeaker", defaultToSpeaker, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setDefaultAudioRouteToSpeakerphone", buf.GetString());
    return 0;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::setEnableSpeakerphone(bool speakerOn) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("speakerOn", speakerOn, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setEnableSpeakerphone", buf.GetString());
    return 0;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
bool MockIRtcEngineEx::isSpeakerphoneEnabled() {
    return false;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::setRouteInCommunicationMode(int route) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("route", route, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRouteInCommunicationMode", buf.GetString());
    return 0;
}
#endif

#if defined(__APPLE__)
bool MockIRtcEngineEx::isCameraCenterStageSupported() {
    return false;
}

int MockIRtcEngineEx::enableCameraCenterStage(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableCameraCenterStage", buf.GetString());
    return 0;
}
#endif

#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
IScreenCaptureSourceList* MockIRtcEngineEx::getScreenCaptureSources(const SIZE& thumbSize, const SIZE& iconSize, const bool includeScreen) {
    appendLog("getScreenCaptureSources", "{}");
    return &mockScreenCaptureSourceList_;
}
#endif

#if (defined(__APPLE__) && TARGET_OS_IOS)
int MockIRtcEngineEx::setAudioSessionOperationRestriction(AUDIO_SESSION_OPERATION_RESTRICTION restriction) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("restriction", restriction, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAudioSessionOperationRestriction", buf.GetString());
    return 0;
}
#endif

#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
int MockIRtcEngineEx::startScreenCaptureByDisplayId(int64_t displayId, const Rectangle& regionRect, const ScreenCaptureParameters& captureParams) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("displayId", displayId, a);
    d.AddMember("regionRect_x", regionRect.x, a);
    d.AddMember("regionRect_y", regionRect.y, a);
    d.AddMember("regionRect_width", regionRect.width, a);
    d.AddMember("regionRect_height", regionRect.height, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(captureParams), v, a); d.AddMember("captureParams", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startScreenCaptureByDisplayId", buf.GetString());
    return 0;
}

#if defined(_WIN32)
int MockIRtcEngineEx::startScreenCaptureByScreenRect(const Rectangle& screenRect, const Rectangle& regionRect, const ScreenCaptureParameters& captureParams) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("screenRect_x", screenRect.x, a);
    d.AddMember("screenRect_y", screenRect.y, a);
    d.AddMember("screenRect_width", screenRect.width, a);
    d.AddMember("screenRect_height", screenRect.height, a);
    d.AddMember("regionRect_x", regionRect.x, a);
    d.AddMember("regionRect_y", regionRect.y, a);
    d.AddMember("regionRect_width", regionRect.width, a);
    d.AddMember("regionRect_height", regionRect.height, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(captureParams), v, a); d.AddMember("captureParams", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startScreenCaptureByScreenRect", buf.GetString());
    return 0;
}
#endif
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::getAudioDeviceInfo(DeviceInfo& deviceInfo) {
    appendLog("getAudioDeviceInfo", "{}");
    return 0;
}
#endif

#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
int MockIRtcEngineEx::startScreenCaptureByWindowId(int64_t windowId, const Rectangle& regionRect, const ScreenCaptureParameters& captureParams) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("windowId", windowId, a);
    d.AddMember("regionRect_x", regionRect.x, a);
    d.AddMember("regionRect_y", regionRect.y, a);
    d.AddMember("regionRect_width", regionRect.width, a);
    d.AddMember("regionRect_height", regionRect.height, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(captureParams), v, a); d.AddMember("captureParams", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startScreenCaptureByWindowId", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setScreenCaptureContentHint(VIDEO_CONTENT_HINT contentHint) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("contentHint", contentHint, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setScreenCaptureContentHint", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateScreenCaptureRegion(const Rectangle& regionRect) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("x", regionRect.x, a);
    d.AddMember("y", regionRect.y, a);
    d.AddMember("width", regionRect.width, a);
    d.AddMember("height", regionRect.height, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateScreenCaptureRegion", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateScreenCaptureParameters(const ScreenCaptureParameters& captureParams) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("width", captureParams.dimensions.width, a);
    d.AddMember("height", captureParams.dimensions.height, a);
    d.AddMember("frameRate", captureParams.frameRate, a);
    d.AddMember("bitrate", captureParams.bitrate, a);
    d.AddMember("captureMouseCursor", captureParams.captureMouseCursor, a);
    d.AddMember("windowFocus", captureParams.windowFocus, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateScreenCaptureParameters", buf.GetString());
    return 0;
}
#endif

int MockIRtcEngineEx::startScreenCapture(VIDEO_SOURCE_TYPE sourceType, const ScreenCaptureConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sourceType", sourceType, a);
    rapidjson::Value configJson;
    configJson.SetObject();
    configJson.AddMember("isCaptureWindow", config.isCaptureWindow, a);
    configJson.AddMember("displayId", config.displayId, a);
    configJson.AddMember("captureWidth", config.params.dimensions.width, a);
    configJson.AddMember("captureHeight", config.params.dimensions.height, a);
    configJson.AddMember("frameRate", config.params.frameRate, a);
    configJson.AddMember("bitrate", config.params.bitrate, a);
    d.AddMember("config", configJson, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startScreenCapture", buf.GetString());
    return 0;
}

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::updateScreenCapture(const ScreenCaptureParameters2& captureParams) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("videoWidth", captureParams.videoWidth, a);
    d.AddMember("videoHeight", captureParams.videoHeight, a);
    d.AddMember("videoFramerate", captureParams.videoFramerate, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateScreenCapture", buf.GetString());
    return 0;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::queryScreenCaptureCapability() {
    appendLog("queryScreenCaptureCapability", "{}");
    return 0;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::queryCameraFocalLengthCapability(agora::rtc::FocalLengthInfo* focalLengthInfos, int& size) {
    appendLog("queryCameraFocalLengthCapability", "{}");
    return 0;
}
#endif

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::setExternalMediaProjection(void* mediaProjection) {
    appendLog("setExternalMediaProjection", "{}");
    return 0;
}
#endif

int MockIRtcEngineEx::setScreenCaptureScenario(SCREEN_SCENARIO_TYPE screenScenario) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("screenScenario", screenScenario, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setScreenCaptureScenario", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopScreenCapture() {
    appendLog("stopScreenCapture", "{}");
    return 0;
}

int MockIRtcEngineEx::getCallId(agora::util::AString& callId) {
    appendLog("getCallId", "{}");
    return 0;
}

int MockIRtcEngineEx::rate(const char* callId, int rating, const char* description) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(callId ? callId : "", a); d.AddMember("callId", v, a);
    d.AddMember("rating", rating, a);
    v.SetString(description ? description : "", a); d.AddMember("description", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("rate", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::complain(const char* callId, const char* description) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(callId ? callId : "", a); d.AddMember("callId", v, a);
    v.SetString(description ? description : "", a); d.AddMember("description", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("complain", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startRtmpStreamWithoutTranscoding(const char* url) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(url ? url : "", d.GetAllocator());
    d.AddMember("url", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startRtmpStreamWithoutTranscoding", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startRtmpStreamWithTranscoding(const char* url, const LiveTranscoding& transcoding) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(url ? url : "", a); d.AddMember("url", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(transcoding), v, a); d.AddMember("transcoding", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startRtmpStreamWithTranscoding", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateRtmpTranscoding(const LiveTranscoding& transcoding) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(transcoding), v, a); d.AddMember("transcoding", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateRtmpTranscoding", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startLocalVideoTranscoder(const LocalTranscoderConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startLocalVideoTranscoder", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateLocalTranscoderConfiguration(const LocalTranscoderConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateLocalTranscoderConfiguration", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopRtmpStream(const char* url) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(url ? url : "", d.GetAllocator());
    d.AddMember("url", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopRtmpStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopLocalVideoTranscoder() {
    appendLog("stopLocalVideoTranscoder", "{}");
    return 0;
}

int MockIRtcEngineEx::startLocalAudioMixer(const LocalAudioMixerConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startLocalAudioMixer", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateLocalAudioMixerConfiguration(const LocalAudioMixerConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateLocalAudioMixerConfiguration", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopLocalAudioMixer() {
    appendLog("stopLocalAudioMixer", "{}");
    return 0;
}

int MockIRtcEngineEx::startCameraCapture(VIDEO_SOURCE_TYPE sourceType, const CameraCapturerConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("sourceType", sourceType, a);
    d.AddMember("cameraDirection", 0 /*cameraDirection*/, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startCameraCapture", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopCameraCapture(VIDEO_SOURCE_TYPE sourceType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("sourceType", sourceType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopCameraCapture", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setCameraDeviceOrientation(VIDEO_SOURCE_TYPE type, VIDEO_ORIENTATION orientation) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("type", type, a);
    d.AddMember("orientation", orientation, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCameraDeviceOrientation", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setScreenCaptureOrientation(VIDEO_SOURCE_TYPE type, VIDEO_ORIENTATION orientation) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("type", type, a);
    d.AddMember("orientation", orientation, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setScreenCaptureOrientation", buf.GetString());
    return 0;
}

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS) || defined(__OHOS__)
int MockIRtcEngineEx::startScreenCapture(const ScreenCaptureParameters2& captureParams) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("videoWidth", captureParams.videoWidth, a);
    d.AddMember("videoHeight", captureParams.videoHeight, a);
    d.AddMember("videoFramerate", captureParams.videoFramerate, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startScreenCapture", buf.GetString());
    return 0;
}
#endif

int MockIRtcEngineEx::stopScreenCapture(VIDEO_SOURCE_TYPE sourceType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("sourceType", sourceType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopScreenCapture", buf.GetString());
    return 0;
}

CONNECTION_STATE_TYPE MockIRtcEngineEx::getConnectionState() {
    return {};
}

bool MockIRtcEngineEx::registerEventHandler(IRtcEngineEventHandler* eventHandler) {
    return false;
}

bool MockIRtcEngineEx::unregisterEventHandler(IRtcEngineEventHandler* eventHandler) {
    return false;
}

int MockIRtcEngineEx::setRemoteUserPriority(uid_t uid, PRIORITY_TYPE userPriority) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    d.AddMember("userPriority", userPriority, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteUserPriority", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::registerPacketObserver(IPacketObserver* observer) {
    appendLog("registerPacketObserver", "{}");
    return 0;
}

int MockIRtcEngineEx::enableEncryption(bool enabled, const EncryptionConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("encryptionMode", config.encryptionMode, a);
    rapidjson::Value v;
    v.SetString(config.encryptionKey ? config.encryptionKey : "", a); d.AddMember("encryptionKey", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableEncryption", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::createDataStream(int* streamId, const DataStreamConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("syncWithAudio", config.syncWithAudio, a);
    d.AddMember("ordered", config.ordered, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("createDataStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::createDataStream(int* streamId, bool reliable, bool ordered) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("reliable", reliable, a);
    d.AddMember("ordered", ordered, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("createDataStream", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendStreamMessage(int streamId, const char* data, size_t length) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("streamId", streamId, a);
    rapidjson::Value v;
    v.SetString(data ? std::string(data, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("data", v, a);
    d.AddMember("length", static_cast<int>(length), a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendStreamMessage", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendRdtMessage(uid_t uid, RdtStreamType type, const char *data, size_t length) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    d.AddMember("type", type, a);
    rapidjson::Value v;
    v.SetString(data ? std::string(data, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("data", v, a);
    d.AddMember("length", static_cast<int>(length), a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendRdtMessage", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendMediaControlMessage(uid_t uid, const char* data, size_t length) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    rapidjson::Value v;
    v.SetString(data ? std::string(data, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("data", v, a);
    d.AddMember("length", static_cast<int>(length), a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendMediaControlMessage", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::addVideoWatermark(const WatermarkConfig& configs) {
    appendLog("addVideoWatermark", "{}");
    return 0;
}

int MockIRtcEngineEx::addVideoWatermark(const RtcImage& watermark) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(watermark.url ? watermark.url : "", a); d.AddMember("url", v, a);
    d.AddMember("x", watermark.x, a);
    d.AddMember("y", watermark.y, a);
    d.AddMember("width", watermark.width, a);
    d.AddMember("height", watermark.height, a);
    d.AddMember("zOrder", watermark.zOrder, a);
    d.AddMember("alpha", watermark.alpha, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("addVideoWatermark", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(watermarkUrl ? watermarkUrl : "", a); d.AddMember("watermarkUrl", v, a);
    d.AddMember("visibleInPreview", options.visibleInPreview, a);
    d.AddMember("posInLandscape_x", options.positionInLandscapeMode.x, a);
    d.AddMember("posInLandscape_y", options.positionInLandscapeMode.y, a);
    d.AddMember("posInLandscape_w", options.positionInLandscapeMode.width, a);
    d.AddMember("posInLandscape_h", options.positionInLandscapeMode.height, a);
    d.AddMember("posInPortrait_x", options.positionInPortraitMode.x, a);
    d.AddMember("posInPortrait_y", options.positionInPortraitMode.y, a);
    d.AddMember("posInPortrait_w", options.positionInPortraitMode.width, a);
    d.AddMember("posInPortrait_h", options.positionInPortraitMode.height, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("addVideoWatermark", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::removeVideoWatermark(const char* id) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(id ? id : "", d.GetAllocator());
    d.AddMember("id", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("removeVideoWatermark", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::clearVideoWatermarks() {
    appendLog("clearVideoWatermarks", "{}");
    return 0;
}

int MockIRtcEngineEx::pauseAudio() {
    appendLog("pauseAudio", "{}");
    return 0;
}

int MockIRtcEngineEx::resumeAudio() {
    appendLog("resumeAudio", "{}");
    return 0;
}

int MockIRtcEngineEx::enableWebSdkInteroperability(bool enabled) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("enabled", enabled, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableWebSdkInteroperability", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendCustomReportMessage(const char* id, const char* category, const char* event, const char* label, int value) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(id ? id : "", a); d.AddMember("id", v, a);
    v.SetString(category ? category : "", a); d.AddMember("category", v, a);
    v.SetString(event ? event : "", a); d.AddMember("event", v, a);
    v.SetString(label ? label : "", a); d.AddMember("label", v, a);
    d.AddMember("value", value, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendCustomReportMessage", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::registerMediaMetadataObserver(IMetadataObserver *observer, IMetadataObserver::METADATA_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("type", type, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("registerMediaMetadataObserver", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::unregisterMediaMetadataObserver(IMetadataObserver* observer, IMetadataObserver::METADATA_TYPE type) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("type", type, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("unregisterMediaMetadataObserver", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startAudioFrameDump(const char* channel_id, uid_t uid, const char* location, const char* uuid, const char* passwd, long duration_ms, bool auto_upload) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(channel_id ? channel_id : "", a); d.AddMember("channel_id", v, a);
    d.AddMember("uid", uid, a);
    v.SetString(location ? location : "", a); d.AddMember("location", v, a);
    v.SetString(uuid ? uuid : "", a); d.AddMember("uuid", v, a);
    v.SetString(passwd ? passwd : "", a); d.AddMember("passwd", v, a);
    d.AddMember("duration_ms", static_cast<int64_t>(duration_ms), a);
    d.AddMember("auto_upload", auto_upload, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startAudioFrameDump", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopAudioFrameDump(const char* channel_id, uid_t uid, const char* location) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(channel_id ? channel_id : "", a); d.AddMember("channel_id", v, a);
    d.AddMember("uid", uid, a);
    v.SetString(location ? location : "", a); d.AddMember("location", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopAudioFrameDump", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAINSMode(bool enabled,  AUDIO_AINS_MODE mode) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("mode", mode, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAINSMode", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::registerLocalUserAccount(const char* appId, const char* userAccount) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(appId ? appId : "", a); d.AddMember("appId", v, a);
    v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("registerLocalUserAccount", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::joinChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount, const ChannelMediaOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a); }
    { rapidjson::Value v; v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("joinChannelWithUserAccount", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::joinChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(token ? token : "", a); d.AddMember("token", v, a);
    v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a);
    v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("joinChannelWithUserAccount", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::joinChannelWithUserAccountEx(const char* token, const char* channelId, const char* userAccount, const ChannelMediaOptions& options, IRtcEngineEventHandler* eventHandler) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a); }
    { rapidjson::Value v; v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("joinChannelWithUserAccountEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getUserInfoByUserAccount(const char* userAccount, rtc::UserInfo* userInfo) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getUserInfoByUserAccount", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getUserInfoByUid(uid_t uid, rtc::UserInfo* userInfo) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("uid", uid, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getUserInfoByUid", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startOrUpdateChannelMediaRelay(const ChannelMediaRelayConfiguration &configuration) {
    appendLog("startOrUpdateChannelMediaRelay", "{}");
    return 0;
}

int MockIRtcEngineEx::stopChannelMediaRelay() {
    appendLog("stopChannelMediaRelay", "{}");
    return 0;
}

int MockIRtcEngineEx::pauseAllChannelMediaRelay() {
    appendLog("pauseAllChannelMediaRelay", "{}");
    return 0;
}

int MockIRtcEngineEx::resumeAllChannelMediaRelay() {
    appendLog("resumeAllChannelMediaRelay", "{}");
    return 0;
}

int MockIRtcEngineEx::setDirectCdnStreamingAudioConfiguration(AUDIO_PROFILE_TYPE profile) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("profile", profile, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setDirectCdnStreamingAudioConfiguration", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setDirectCdnStreamingVideoConfiguration(const VideoEncoderConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setDirectCdnStreamingVideoConfiguration", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startDirectCdnStreaming(IDirectCdnStreamingEventHandler* eventHandler, const char* publishUrl, const DirectCdnStreamingMediaOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(publishUrl ? publishUrl : "", a); d.AddMember("publishUrl", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startDirectCdnStreaming", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopDirectCdnStreaming() {
    appendLog("stopDirectCdnStreaming", "{}");
    return 0;
}

int MockIRtcEngineEx::updateDirectCdnStreamingMediaOptions(const DirectCdnStreamingMediaOptions& options) {
    appendLog("updateDirectCdnStreamingMediaOptions", "{}");
    return 0;
}

int MockIRtcEngineEx::startRhythmPlayer(const char* sound1, const char* sound2, const AgoraRhythmPlayerConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(sound1 ? sound1 : "", a); d.AddMember("sound1", v, a);
    v.SetString(sound2 ? sound2 : "", a); d.AddMember("sound2", v, a);
    d.AddMember("beatsPerMeasure", config.beatsPerMeasure, a);
    d.AddMember("beatsPerMinute", config.beatsPerMinute, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startRhythmPlayer", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopRhythmPlayer() {
    appendLog("stopRhythmPlayer", "{}");
    return 0;
}

int MockIRtcEngineEx::configRhythmPlayer(const AgoraRhythmPlayerConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("beatsPerMeasure", config.beatsPerMeasure, a);
    d.AddMember("beatsPerMinute", config.beatsPerMinute, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("configRhythmPlayer", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::takeSnapshot(uid_t uid, const media::SnapshotConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    rapidjson::Value v;
    v.SetString(config.filePath ? config.filePath : "", a); d.AddMember("filePath", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("takeSnapshot", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::takeSnapshot(uid_t uid, const char* filePath) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", uid, a);
    rapidjson::Value v;
    v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("takeSnapshot", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableContentInspect(bool enabled, const media::ContentInspectConfig &config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableContentInspect", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustCustomAudioPublishVolume(track_id_t trackId, int volume) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("trackId", trackId, a);
    d.AddMember("volume", volume, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustCustomAudioPublishVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustCustomAudioPlayoutVolume(track_id_t trackId, int volume) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("trackId", trackId, a);
    d.AddMember("volume", volume, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustCustomAudioPlayoutVolume", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setCloudProxy(CLOUD_PROXY_TYPE proxyType) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("proxyType", proxyType, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setCloudProxy", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setLocalAccessPoint(const LocalAccessPointConfiguration& config) {
    appendLog("setLocalAccessPoint", "{}");
    return 0;
}

int MockIRtcEngineEx::setAdvancedAudioOptions(AdvancedAudioOptions& options, int sourceType) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    if (options.audioProcessingChannels) d.AddMember("audioProcessingChannels", options.audioProcessingChannels.value(), a);
    d.AddMember("sourceType", sourceType, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAdvancedAudioOptions", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setAVSyncSource(const char* channelId, uid_t uid) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a);
    d.AddMember("uid", uid, a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setAVSyncSource", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableVideoImageSource(bool enable, const ImageTrackOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enable", enable, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableVideoImageSource", buf.GetString());
    return 0;
}

int64_t MockIRtcEngineEx::getCurrentMonotonicTimeInMs() {
    return 0;
}

int MockIRtcEngineEx::getNetworkType() {
    appendLog("getNetworkType", "{}");
    return 0;
}

int MockIRtcEngineEx::setParameters(const char* parameters) {
    rapidjson::Document d;
    d.SetObject();
    rapidjson::Value v;
    v.SetString(parameters ? parameters : "", d.GetAllocator());
    d.AddMember("parameters", v, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setParameters", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startMediaRenderingTracing() {
    appendLog("startMediaRenderingTracing", "{}");
    return 0;
}

int MockIRtcEngineEx::enableInstantMediaRendering() {
    appendLog("enableInstantMediaRendering", "{}");
    return 0;
}

uint64_t MockIRtcEngineEx::getNtpWallTimeInMs() {
    return 0;
}

bool MockIRtcEngineEx::isFeatureAvailableOnDevice(FeatureType type) {
    return false;
}

int MockIRtcEngineEx::sendAudioMetadata(const char* metadata, size_t length) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value v;
    v.SetString(metadata ? std::string(metadata, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("metadata", v, a);
    d.AddMember("length", static_cast<int>(length), a);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendAudioMetadata", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::queryHDRCapability(VIDEO_MODULE_TYPE videoModule, HDR_CAPABILITY& capability) {
    rapidjson::Document d;
    d.SetObject();
    d.AddMember("videoModule", videoModule, d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("queryHDRCapability", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::joinChannelEx(const char* token, const RtcConnection& connection, const ChannelMediaOptions& options, IRtcEngineEventHandler* eventHandler) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("joinChannelEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::leaveChannelEx(const RtcConnection& connection, const LeaveChannelOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("leaveChannelEx", buf.GetString());
    return 0;
}



int MockIRtcEngineEx::leaveChannelEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("leaveChannelEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::leaveChannelWithUserAccountEx(const char* channelId, const char* userAccount) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a); }
    { rapidjson::Value v; v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("leaveChannelWithUserAccountEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::leaveChannelWithUserAccountEx(const char* channelId, const char* userAccount, const LeaveChannelOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(channelId ? channelId : "", a); d.AddMember("channelId", v, a); }
    { rapidjson::Value v; v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("leaveChannelWithUserAccountEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateChannelMediaOptionsEx(const ChannelMediaOptions& options, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateChannelMediaOptionsEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setVideoEncoderConfigurationEx(const VideoEncoderConfiguration& config, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setVideoEncoderConfigurationEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setupRemoteVideoEx(const VideoCanvas& canvas, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(canvas), v, a); d.AddMember("canvas", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setupRemoteVideoEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteRemoteAudioStreamEx(uid_t uid, bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteRemoteAudioStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteRemoteVideoStreamEx(uid_t uid, bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteRemoteVideoStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteVideoStreamTypeEx(uid_t uid, VIDEO_STREAM_TYPE streamType, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("streamType", streamType, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteVideoStreamTypeEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteLocalAudioStreamEx(bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteLocalAudioStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteLocalVideoStreamEx(bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteLocalVideoStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteAllRemoteAudioStreamsEx(bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteAllRemoteAudioStreamsEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteAllRemoteVideoStreamsEx(bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteAllRemoteVideoStreamsEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeAudioBlocklistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeAudioBlocklistEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeAudioAllowlistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeAudioAllowlistEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeVideoBlocklistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeVideoBlocklistEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSubscribeVideoAllowlistEx(uid_t* uidList, int uidNumber, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNumber; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNumber", uidNumber, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSubscribeVideoAllowlistEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteVideoSubscriptionOptionsEx(uid_t uid, const VideoSubscriptionOptions& options, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteVideoSubscriptionOptionsEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteVoicePositionEx(uid_t uid, double pan, double gain, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("pan", static_cast<double>(pan), a);
    d.AddMember("gain", static_cast<double>(gain), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteVoicePositionEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteUserSpatialAudioParamsEx(uid_t uid, const agora::SpatialAudioParams& params, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(params), v, a); d.AddMember("params", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteUserSpatialAudioParamsEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setRemoteRenderModeEx(uid_t uid, media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("renderMode", renderMode, a);
    d.AddMember("mirrorMode", mirrorMode, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setRemoteRenderModeEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableLoopbackRecordingEx(const RtcConnection& connection, bool enabled, const char* deviceName) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    { rapidjson::Value v; v.SetString(deviceName ? deviceName : "", a); d.AddMember("deviceName", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableLoopbackRecordingEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustRecordingSignalVolumeEx(int volume, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("volume", static_cast<int>(volume), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustRecordingSignalVolumeEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::muteRecordingSignalEx(bool mute, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mute", mute, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("muteRecordingSignalEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::adjustUserPlaybackSignalVolumeEx(uid_t uid, int volume, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("volume", static_cast<int>(volume), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("adjustUserPlaybackSignalVolumeEx", buf.GetString());
    return 0;
}

CONNECTION_STATE_TYPE MockIRtcEngineEx::getConnectionStateEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getConnectionStateEx", buf.GetString());
    return {};
}

int MockIRtcEngineEx::enableEncryptionEx(const RtcConnection& connection, bool enabled, const EncryptionConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("encryptionMode", config.encryptionMode, a);
    { rapidjson::Value v; v.SetString(config.encryptionKey ? config.encryptionKey : "", a); d.AddMember("encryptionKey", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableEncryptionEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::createDataStreamEx(int* streamId, bool reliable, bool ordered, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("reliable", reliable, a);
    d.AddMember("ordered", ordered, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("createDataStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::createDataStreamEx(int* streamId, const DataStreamConfig& config, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("syncWithAudio", config.syncWithAudio, a);
    d.AddMember("ordered", config.ordered, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("createDataStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendStreamMessageEx(int streamId, const char* data, size_t length, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("streamId", static_cast<int>(streamId), a);
    { rapidjson::Value v; v.SetString(data ? std::string(data, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("data", v, a); }
    d.AddMember("length", static_cast<int>(length), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendStreamMessageEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendRdtMessageEx(uid_t uid, RdtStreamType type, const char *data, size_t length, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("type", type, a);
    { rapidjson::Value v; v.SetString(data ? std::string(data, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("data", v, a); }
    d.AddMember("length", static_cast<int>(length), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendRdtMessageEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendMediaControlMessageEx(uid_t uid, const char *data, size_t length, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    { rapidjson::Value v; v.SetString(data ? std::string(data, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("data", v, a); }
    d.AddMember("length", static_cast<int>(length), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendMediaControlMessageEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::addVideoWatermarkEx(const char* watermarkUrl, const WatermarkOptions& options, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(watermarkUrl ? watermarkUrl : "", a); d.AddMember("watermarkUrl", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(options), v, a); d.AddMember("options", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("addVideoWatermarkEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::addVideoWatermarkEx(const WatermarkConfig& config, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("addVideoWatermarkEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::removeVideoWatermarkEx(const char* id, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(id ? id : "", a); d.AddMember("id", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("removeVideoWatermarkEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::clearVideoWatermarkEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("clearVideoWatermarkEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendCustomReportMessageEx(const char* id, const char* category, const char* event, const char* label, int value, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(id ? id : "", a); d.AddMember("id", v, a); }
    { rapidjson::Value v; v.SetString(category ? category : "", a); d.AddMember("category", v, a); }
    { rapidjson::Value v; v.SetString(event ? event : "", a); d.AddMember("event", v, a); }
    { rapidjson::Value v; v.SetString(label ? label : "", a); d.AddMember("label", v, a); }
    d.AddMember("value", static_cast<int>(value), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendCustomReportMessageEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableAudioVolumeIndicationEx(int interval, int smooth, bool reportVad, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("interval", static_cast<int>(interval), a);
    d.AddMember("smooth", static_cast<int>(smooth), a);
    d.AddMember("reportVad", reportVad, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableAudioVolumeIndicationEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startRtmpStreamWithoutTranscodingEx(const char* url, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(url ? url : "", a); d.AddMember("url", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startRtmpStreamWithoutTranscodingEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startRtmpStreamWithTranscodingEx(const char* url, const LiveTranscoding& transcoding, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(url ? url : "", a); d.AddMember("url", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(transcoding), v, a); d.AddMember("transcoding", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startRtmpStreamWithTranscodingEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::updateRtmpTranscodingEx(const LiveTranscoding& transcoding, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(transcoding), v, a); d.AddMember("transcoding", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("updateRtmpTranscodingEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopRtmpStreamEx(const char* url, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(url ? url : "", a); d.AddMember("url", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopRtmpStreamEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startOrUpdateChannelMediaRelayEx(const ChannelMediaRelayConfiguration& configuration, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(configuration), v, a); d.AddMember("configuration", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startOrUpdateChannelMediaRelayEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::stopChannelMediaRelayEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("stopChannelMediaRelayEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::pauseAllChannelMediaRelayEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("pauseAllChannelMediaRelayEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::resumeAllChannelMediaRelayEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("resumeAllChannelMediaRelayEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getUserInfoByUserAccountEx(const char* userAccount, rtc::UserInfo* userInfo, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(userAccount ? userAccount : "", a); d.AddMember("userAccount", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getUserInfoByUserAccountEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getUserInfoByUidEx(uid_t uid, rtc::UserInfo* userInfo, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getUserInfoByUidEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableDualStreamModeEx(bool enabled, const SimulcastStreamConfig& streamConfig, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    d.AddMember("isSimulcastStreamEnabled", streamConfig.dimensions.width, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableDualStreamModeEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setDualStreamModeEx(SIMULCAST_STREAM_MODE mode, const SimulcastStreamConfig& streamConfig, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("mode", mode, a);
    d.AddMember("isSimulcastStreamEnabled", streamConfig.dimensions.width, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setDualStreamModeEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setSimulcastConfigEx(const SimulcastConfig& simulcastConfig, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("publish_fallback_enable", simulcastConfig.publish_fallback_enable, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setSimulcastConfigEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setHighPriorityUserListEx(uid_t* uidList, int uidNum, STREAM_FALLBACK_OPTIONS option, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    rapidjson::Value arr(rapidjson::kArrayType);
    if (uidList) { for (int i = 0; i < uidNum; i++) { arr.PushBack(uidList[i], a); } }
    d.AddMember("uidList", arr, a);
    d.AddMember("uidNum", uidNum, a);
    d.AddMember("option", option, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setHighPriorityUserListEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::takeSnapshotEx(const RtcConnection& connection, uid_t uid, const char* filePath) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    { rapidjson::Value v; v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("takeSnapshotEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::takeSnapshotEx(const RtcConnection& connection, uid_t uid, const media::SnapshotConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    { rapidjson::Value v; v.SetString(config.filePath ? config.filePath : "", a); d.AddMember("filePath", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("takeSnapshotEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::enableContentInspectEx(bool enabled, const media::ContentInspectConfig &config, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("enabled", enabled, a);
    { rapidjson::Value v; parseJsonInto(json::toJson(config), v, a); d.AddMember("config", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("enableContentInspectEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::startMediaRenderingTracingEx(const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("startMediaRenderingTracingEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::setParametersEx(const RtcConnection& connection, const char* parameters) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(parameters ? parameters : "", a); d.AddMember("parameters", v, a); }
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("setParametersEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::getCallIdEx(agora::util::AString& callId, const RtcConnection& connection) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("getCallIdEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::sendAudioMetadataEx(const RtcConnection& connection, const char* metadata, size_t length) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(metadata ? std::string(metadata, std::min(length, (size_t)1024)).c_str() : "", a); d.AddMember("metadata", v, a); }
    d.AddMember("length", static_cast<int>(length), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("sendAudioMetadataEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::preloadEffectEx(const RtcConnection& connection, int soundId, const char* filePath, int startPos) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("soundId", static_cast<int>(soundId), a);
    { rapidjson::Value v; v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a); }
    d.AddMember("startPos", static_cast<int>(startPos), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("preloadEffectEx", buf.GetString());
    return 0;
}

int MockIRtcEngineEx::playEffectEx(const RtcConnection& connection, int soundId, const char* filePath, int loopCount, double pitch, double pan, int gain, bool publish, int startPos) {
    rapidjson::Document d;
    d.SetObject();
    auto& a = d.GetAllocator();
    d.AddMember("soundId", static_cast<int>(soundId), a);
    { rapidjson::Value v; v.SetString(filePath ? filePath : "", a); d.AddMember("filePath", v, a); }
    d.AddMember("loopCount", static_cast<int>(loopCount), a);
    d.AddMember("pitch", static_cast<double>(pitch), a);
    d.AddMember("pan", static_cast<double>(pan), a);
    d.AddMember("gain", static_cast<int>(gain), a);
    d.AddMember("publish", publish, a);
    d.AddMember("startPos", static_cast<int>(startPos), a);
    { rapidjson::Value v; parseJsonInto(json::toJson(connection), v, a); d.AddMember("connection", v, a); }
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    appendLog("playEffectEx", buf.GetString());
    return 0;
}

}  // namespace rtc
}  // namespace agora