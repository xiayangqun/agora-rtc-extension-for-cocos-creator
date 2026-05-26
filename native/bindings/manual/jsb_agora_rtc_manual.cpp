#include "jsb_agora_rtc_manual.h"

#include "agora/RtcEngineExBridge.h"
#include "bindings/auto/jsb_agora_rtc_engine_bridge_auto.h"
#include "bindings/manual/jsb_global.h"
#include "bindings/jswrapper/SeApi.h"

#include <memory>

namespace {
se::Class *__jsb_AgoraRtcEngineNative_class = nullptr;

static bool js_agora_RtcEngineNative_finalize(se::State &s);
SE_DECLARE_FINALIZE_FUNC(js_agora_RtcEngineNative_finalize)

se::Object *getOrCreateNamespace(se::Object *global, const char *name) {
    se::Value nsVal;
    if (global->getProperty(name, &nsVal, true) && nsVal.isObject()) {
        return nsVal.toObject();
    }

    auto *object = se::Object::createPlainObject();
    object->root();
    global->setProperty(name, se::Value(object));
    object->unroot();
    return object;
}

bool getStringProperty(se::Object *object, const char *name, std::string *out) {
    se::Value value;
    if (!object->getProperty(name, &value) || value.isNullOrUndefined()) {
        return false;
    }
    *out = value.toString();
    return true;
}

bool getIntProperty(se::Object *object, const char *name, int *out) {
    se::Value value;
    if (!object->getProperty(name, &value) || value.isNullOrUndefined()) {
        return false;
    }
    *out = value.toInt32();
    return true;
}

RtcEngineExBridge *getNativeBridge(se::State &s) {
    return static_cast<RtcEngineExBridge *>(s.nativeThisObject());
}

static bool js_agora_RtcEngineNative_constructor(se::State &s) {
    auto *bridge = new RtcEngineExBridge();
    s.thisObject()->setPrivateData(bridge);
    return true;
}
SE_BIND_CTOR(js_agora_RtcEngineNative_constructor, __jsb_AgoraRtcEngineNative_class, js_agora_RtcEngineNative_finalize)

static bool js_agora_RtcEngineNative_finalize(se::State &s) {
    auto *bridge = static_cast<RtcEngineExBridge *>(s.nativeThisObject());
    delete bridge;
    return true;
}
SE_BIND_FINALIZE_FUNC(js_agora_RtcEngineNative_finalize)

static bool js_agora_RtcEngineNative_initialize(se::State &s) {
    const auto &args = s.args();
    if (args.empty() || !args[0].isObject()) {
        SE_REPORT_ERROR("RtcEngineNative.initialize expects a context object");
        return false;
    }

    auto *contextObject = args[0].toObject();
    AgoraRtcNativeContext context;
    getStringProperty(contextObject, "appId", &context.appId);
    getIntProperty(contextObject, "channelProfile", &context.channelProfile);
    getIntProperty(contextObject, "audioScenario", &context.audioScenario);

    int areaCode = static_cast<int>(context.areaCode);
    if (getIntProperty(contextObject, "areaCode", &areaCode)) {
        context.areaCode = static_cast<unsigned int>(areaCode);
    }

    se::Value eventHandlerValue;
    se::Object *eventHandler = nullptr;
    if (contextObject->getProperty("eventHandler", &eventHandlerValue) && eventHandlerValue.isObject()) {
        eventHandler = eventHandlerValue.toObject();
    }

    auto *bridge = getNativeBridge(s);
    s.rval().setInt32(bridge ? bridge->initialize(context, eventHandler) : -7);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_initialize)

static bool js_agora_RtcEngineNative_joinChannel(se::State &s) {
    const auto &args = s.args();
    if (args.size() < 4) {
        SE_REPORT_ERROR("RtcEngineNative.joinChannel expects four arguments");
        return false;
    }

    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) {
        s.rval().setInt32(-7);
        return true;
    }

    std::string token = args[0].isNullOrUndefined() ? "" : args[0].toString();
    std::string channelId = args[1].toString();

    if (args[2].isString()) {
        std::string info = args[2].toString();
        auto uid = static_cast<agora::rtc::uid_t>(args[3].toInt32());
        s.rval().setInt32(bridge->joinChannel(token, channelId, info, uid));
        return true;
    }

    auto uid = static_cast<agora::rtc::uid_t>(args[2].toInt32());
    if (!args[3].isObject()) {
        SE_REPORT_ERROR("RtcEngineNative.joinChannel options must be an object");
        return false;
    }
    agora::rtc::ChannelMediaOptions options;
    if (!sevalue_to_native(args[3], &options, s.thisObject())) {
        SE_REPORT_ERROR("RtcEngineNative.joinChannel failed to convert ChannelMediaOptions");
        return false;
    }

    s.rval().setInt32(bridge->joinChannel(token, channelId, uid, options));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_joinChannel)

static bool js_agora_RtcEngineNative_release(se::State &s) {
    const auto &args = s.args();
    bool sync = !args.empty() && args[0].toBoolean();
    auto *bridge = getNativeBridge(s);
    if (bridge != nullptr) {
        bridge->release(sync);
    }
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_release)

// ===== Channel management ================================================

static bool js_agora_RtcEngineNative_leaveChannel(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) {
        s.rval().setInt32(-7);
        return true;
    }

    if (!args.empty() && args[0].isObject()) {
        agora::rtc::LeaveChannelOptions options;
        if (!sevalue_to_native(args[0], &options, s.thisObject())) {
            SE_REPORT_ERROR("RtcEngineNative.leaveChannel failed to convert LeaveChannelOptions");
            return false;
        }
        s.rval().setInt32(bridge->leaveChannel(options));
        return true;
    }

    s.rval().setInt32(bridge->leaveChannel());
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_leaveChannel)

static bool js_agora_RtcEngineNative_renewToken(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    std::string token = args.size() > 0 ? args[0].toString() : "";
    s.rval().setInt32(bridge ? bridge->renewToken(token) : -7);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_renewToken)

static bool js_agora_RtcEngineNative_setChannelProfile(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    int profile = args.size() > 0 ? args[0].toInt32() : 0;
    s.rval().setInt32(bridge ? bridge->setChannelProfile(profile) : -7);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_setChannelProfile)

static bool js_agora_RtcEngineNative_setClientRole(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    int role = args.size() > 0 ? args[0].toInt32() : 0;
    if (args.size() > 1 && args[1].isObject()) {
        auto *opts = args[1].toObject();
        se::Value latencyVal;
        int latency = 0;
        if (opts->getProperty("audienceLatencyLevel", &latencyVal) && latencyVal.isNumber()) {
            latency = latencyVal.toInt32();
        }
        s.rval().setInt32(bridge->setClientRole(role, latency));
    } else {
        s.rval().setInt32(bridge->setClientRole(role));
    }
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_setClientRole)

// ===== Audio control =====================================================

#define DEF_SIMPLE_INT_METHOD(name) \
    static bool js_agora_RtcEngineNative_##name(se::State &s) { \
        const auto &args = s.args(); \
        auto *bridge = getNativeBridge(s); \
        if (bridge == nullptr) { s.rval().setInt32(-7); return true; } \
        int arg0 = args.size() > 0 ? args[0].toInt32() : 0; \
        s.rval().setInt32(bridge->name(arg0)); \
        return true; \
    } \
    SE_BIND_FUNC(js_agora_RtcEngineNative_##name)

#define DEF_SIMPLE_BOOL_METHOD(name) \
    static bool js_agora_RtcEngineNative_##name(se::State &s) { \
        const auto &args = s.args(); \
        auto *bridge = getNativeBridge(s); \
        if (bridge == nullptr) { s.rval().setInt32(-7); return true; } \
        bool arg0 = args.size() > 0 && args[0].toBoolean(); \
        s.rval().setInt32(bridge->name(arg0)); \
        return true; \
    } \
    SE_BIND_FUNC(js_agora_RtcEngineNative_##name)

#define DEF_SIMPLE_VOID_METHOD(name) \
    static bool js_agora_RtcEngineNative_##name(se::State &s) { \
        auto *bridge = getNativeBridge(s); \
        s.rval().setInt32(bridge ? bridge->name() : -7); \
        return true; \
    } \
    SE_BIND_FUNC(js_agora_RtcEngineNative_##name)

// Audio
DEF_SIMPLE_VOID_METHOD(enableAudio)
DEF_SIMPLE_VOID_METHOD(disableAudio)
DEF_SIMPLE_BOOL_METHOD(enableLocalAudio)
DEF_SIMPLE_BOOL_METHOD(muteLocalAudioStream)
DEF_SIMPLE_BOOL_METHOD(muteAllRemoteAudioStreams)
DEF_SIMPLE_INT_METHOD(adjustRecordingSignalVolume)
DEF_SIMPLE_INT_METHOD(adjustPlaybackSignalVolume)

// muteRemoteAudioStream takes two args (uid: number, mute: boolean)
static bool js_agora_RtcEngineNative_muteRemoteAudioStream(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    auto uid = static_cast<agora::rtc::uid_t>(args.size() > 0 ? args[0].toInt32() : 0);
    bool mute = args.size() > 1 && args[1].toBoolean();
    s.rval().setInt32(bridge->muteRemoteAudioStream(uid, mute));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_muteRemoteAudioStream)

// enableAudioVolumeIndication(interval, smooth, reportVad)
static bool js_agora_RtcEngineNative_enableAudioVolumeIndication(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    int interval = args.size() > 0 ? args[0].toInt32() : 200;
    int smooth = args.size() > 1 ? args[1].toInt32() : 3;
    bool reportVad = args.size() > 2 && args[2].toBoolean();
    s.rval().setInt32(bridge->enableAudioVolumeIndication(interval, smooth, reportVad));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_enableAudioVolumeIndication)

// setAudioProfile(profile, scenario)
static bool js_agora_RtcEngineNative_setAudioProfile(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    int profile = args.size() > 0 ? args[0].toInt32() : 0;
    int scenario = args.size() > 1 ? args[1].toInt32() : 0;
    s.rval().setInt32(bridge->setAudioProfile(profile, scenario));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_setAudioProfile)

// ===== Video control =====================================================

DEF_SIMPLE_VOID_METHOD(enableVideo)
DEF_SIMPLE_VOID_METHOD(disableVideo)
DEF_SIMPLE_BOOL_METHOD(enableLocalVideo)
DEF_SIMPLE_BOOL_METHOD(muteLocalVideoStream)
DEF_SIMPLE_BOOL_METHOD(muteAllRemoteVideoStreams)

// muteRemoteVideoStream(uid, mute)
static bool js_agora_RtcEngineNative_muteRemoteVideoStream(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    auto uid = static_cast<agora::rtc::uid_t>(args.size() > 0 ? args[0].toInt32() : 0);
    bool mute = args.size() > 1 && args[1].toBoolean();
    s.rval().setInt32(bridge->muteRemoteVideoStream(uid, mute));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_muteRemoteVideoStream)

DEF_SIMPLE_VOID_METHOD(startPreview)
DEF_SIMPLE_VOID_METHOD(stopPreview)

// ===== Audio mixing ======================================================

static bool js_agora_RtcEngineNative_startAudioMixing(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    std::string filePath = args.size() > 0 ? args[0].toString() : "";
    bool loopback = args.size() > 1 && args[1].toBoolean();
    int cycle = args.size() > 2 ? args[2].toInt32() : -1;
    s.rval().setInt32(bridge->startAudioMixing(filePath, loopback, cycle));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_startAudioMixing)

DEF_SIMPLE_VOID_METHOD(stopAudioMixing)
DEF_SIMPLE_VOID_METHOD(pauseAudioMixing)
DEF_SIMPLE_VOID_METHOD(resumeAudioMixing)
DEF_SIMPLE_INT_METHOD(adjustAudioMixingVolume)

// ===== Effects ===========================================================

DEF_SIMPLE_VOID_METHOD(getEffectsVolume)
DEF_SIMPLE_INT_METHOD(setEffectsVolume)

static bool js_agora_RtcEngineNative_playEffect(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    int soundId = args.size() > 0 ? args[0].toInt32() : 0;
    std::string filePath = args.size() > 1 ? args[1].toString() : "";
    int loopCount = args.size() > 2 ? args[2].toInt32() : 0;
    double pitch = args.size() > 3 ? args[3].toNumber() : 1.0;
    double pan = args.size() > 4 ? args[4].toNumber() : 0.0;
    double gain = args.size() > 5 ? args[5].toNumber() : 100.0;
    bool publish = args.size() > 6 && args[6].toBoolean();
    s.rval().setInt32(bridge->playEffect(soundId, filePath, loopCount, pitch, pan, gain, publish));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_playEffect)

static bool js_agora_RtcEngineNative_stopEffect(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    int soundId = args.size() > 0 ? args[0].toInt32() : 0;
    s.rval().setInt32(bridge ? bridge->stopEffect(soundId) : -7);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_stopEffect)

DEF_SIMPLE_VOID_METHOD(stopAllEffects)

static bool js_agora_RtcEngineNative_preloadEffect(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    int soundId = args.size() > 0 ? args[0].toInt32() : 0;
    std::string filePath = args.size() > 1 ? args[1].toString() : "";
    s.rval().setInt32(bridge->preloadEffect(soundId, filePath));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_preloadEffect)

// ===== Logging ===========================================================

static bool js_agora_RtcEngineNative_setLogFile(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    std::string path = args.size() > 0 ? args[0].toString() : "";
    s.rval().setInt32(bridge ? bridge->setLogFile(path) : -7);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_setLogFile)

DEF_SIMPLE_INT_METHOD(setLogLevel)

static bool js_agora_RtcEngineNative_setLogFileSize(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    auto size = static_cast<unsigned int>(args.size() > 0 ? args[0].toInt32() : 0);
    s.rval().setInt32(bridge ? bridge->setLogFileSize(size) : -7);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_setLogFileSize)

// ===== Network / proxy ===================================================

DEF_SIMPLE_INT_METHOD(setCloudProxy)
DEF_SIMPLE_VOID_METHOD(getConnectionState)

// ===== Speaker ===========================================================

DEF_SIMPLE_BOOL_METHOD(setDefaultAudioRouteToSpeakerphone)
DEF_SIMPLE_BOOL_METHOD(setEnableSpeakerphone)

static bool js_agora_RtcEngineNative_isSpeakerphoneEnabled(se::State &s) {
    auto *bridge = getNativeBridge(s);
    s.rval().setBoolean(bridge ? bridge->isSpeakerphoneEnabled() : false);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_isSpeakerphoneEnabled)

// ===== Encryption ========================================================

static bool js_agora_RtcEngineNative_enableEncryption(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    bool enabled = args.size() > 0 && args[0].toBoolean();
    std::string key = args.size() > 1 ? args[1].toString() : "";
    int mode = args.size() > 2 ? args[2].toInt32() : 0;
    agora::rtc::EncryptionConfig config;
    config.encryptionKey = key.c_str();
    config.encryptionMode = static_cast<agora::rtc::ENCRYPTION_MODE>(mode);
    s.rval().setInt32(bridge->enableEncryption(enabled, config));
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_enableEncryption)

// ===== Miscellaneous =====================================================

static bool js_agora_RtcEngineNative_getErrorDescription(se::State &s) {
    const auto &args = s.args();
    auto *bridge = getNativeBridge(s);
    int code = args.size() > 0 ? args[0].toInt32() : 0;
    s.rval().setString(bridge ? bridge->getErrorDescription(code) : "");
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_getErrorDescription)

static bool js_agora_RtcEngineNative_getVersion(se::State &s) {
    auto *bridge = getNativeBridge(s);
    if (bridge == nullptr) { s.rval().setInt32(-7); return true; }
    int build = 0;
    bridge->getVersion(&build);
    se::HandleObject result(se::Object::createPlainObject());
    result->setProperty("build", se::Value(build));
    s.rval().setObject(result);
    return true;
}
SE_BIND_FUNC(js_agora_RtcEngineNative_getVersion)

DEF_SIMPLE_VOID_METHOD(queryDeviceScore)

// ===== Undefine macros ===================================================
#undef DEF_SIMPLE_INT_METHOD
#undef DEF_SIMPLE_BOOL_METHOD
#undef DEF_SIMPLE_VOID_METHOD
} // namespace

bool register_agora_rtc_manual(se::Object *global) {
    auto *agora = getOrCreateNamespace(global, "agora");
    auto *native = getOrCreateNamespace(agora, "native");

    auto *cls = se::Class::create(
        "RtcEngineNative",
        native,
        nullptr,
        _SE(js_agora_RtcEngineNative_constructor));
    // Lifecycle
    cls->defineFunction("initialize", _SE(js_agora_RtcEngineNative_initialize));
    cls->defineFunction("joinChannel", _SE(js_agora_RtcEngineNative_joinChannel));
    cls->defineFunction("release", _SE(js_agora_RtcEngineNative_release));
    // Channel management
    cls->defineFunction("leaveChannel", _SE(js_agora_RtcEngineNative_leaveChannel));
    cls->defineFunction("renewToken", _SE(js_agora_RtcEngineNative_renewToken));
    cls->defineFunction("setChannelProfile", _SE(js_agora_RtcEngineNative_setChannelProfile));
    cls->defineFunction("setClientRole", _SE(js_agora_RtcEngineNative_setClientRole));
    // Audio
    cls->defineFunction("enableAudio", _SE(js_agora_RtcEngineNative_enableAudio));
    cls->defineFunction("disableAudio", _SE(js_agora_RtcEngineNative_disableAudio));
    cls->defineFunction("enableLocalAudio", _SE(js_agora_RtcEngineNative_enableLocalAudio));
    cls->defineFunction("muteLocalAudioStream", _SE(js_agora_RtcEngineNative_muteLocalAudioStream));
    cls->defineFunction("muteAllRemoteAudioStreams", _SE(js_agora_RtcEngineNative_muteAllRemoteAudioStreams));
    cls->defineFunction("muteRemoteAudioStream", _SE(js_agora_RtcEngineNative_muteRemoteAudioStream));
    cls->defineFunction("adjustRecordingSignalVolume", _SE(js_agora_RtcEngineNative_adjustRecordingSignalVolume));
    cls->defineFunction("adjustPlaybackSignalVolume", _SE(js_agora_RtcEngineNative_adjustPlaybackSignalVolume));
    cls->defineFunction("enableAudioVolumeIndication", _SE(js_agora_RtcEngineNative_enableAudioVolumeIndication));
    cls->defineFunction("setAudioProfile", _SE(js_agora_RtcEngineNative_setAudioProfile));
    // Video
    cls->defineFunction("enableVideo", _SE(js_agora_RtcEngineNative_enableVideo));
    cls->defineFunction("disableVideo", _SE(js_agora_RtcEngineNative_disableVideo));
    cls->defineFunction("enableLocalVideo", _SE(js_agora_RtcEngineNative_enableLocalVideo));
    cls->defineFunction("muteLocalVideoStream", _SE(js_agora_RtcEngineNative_muteLocalVideoStream));
    cls->defineFunction("muteAllRemoteVideoStreams", _SE(js_agora_RtcEngineNative_muteAllRemoteVideoStreams));
    cls->defineFunction("muteRemoteVideoStream", _SE(js_agora_RtcEngineNative_muteRemoteVideoStream));
    cls->defineFunction("startPreview", _SE(js_agora_RtcEngineNative_startPreview));
    cls->defineFunction("stopPreview", _SE(js_agora_RtcEngineNative_stopPreview));
    // Audio mixing
    cls->defineFunction("startAudioMixing", _SE(js_agora_RtcEngineNative_startAudioMixing));
    cls->defineFunction("stopAudioMixing", _SE(js_agora_RtcEngineNative_stopAudioMixing));
    cls->defineFunction("pauseAudioMixing", _SE(js_agora_RtcEngineNative_pauseAudioMixing));
    cls->defineFunction("resumeAudioMixing", _SE(js_agora_RtcEngineNative_resumeAudioMixing));
    cls->defineFunction("adjustAudioMixingVolume", _SE(js_agora_RtcEngineNative_adjustAudioMixingVolume));
    // Effects
    cls->defineFunction("getEffectsVolume", _SE(js_agora_RtcEngineNative_getEffectsVolume));
    cls->defineFunction("setEffectsVolume", _SE(js_agora_RtcEngineNative_setEffectsVolume));
    cls->defineFunction("playEffect", _SE(js_agora_RtcEngineNative_playEffect));
    cls->defineFunction("stopEffect", _SE(js_agora_RtcEngineNative_stopEffect));
    cls->defineFunction("stopAllEffects", _SE(js_agora_RtcEngineNative_stopAllEffects));
    cls->defineFunction("preloadEffect", _SE(js_agora_RtcEngineNative_preloadEffect));
    // Logging
    cls->defineFunction("setLogFile", _SE(js_agora_RtcEngineNative_setLogFile));
    cls->defineFunction("setLogLevel", _SE(js_agora_RtcEngineNative_setLogLevel));
    cls->defineFunction("setLogFileSize", _SE(js_agora_RtcEngineNative_setLogFileSize));
    // Network
    cls->defineFunction("setCloudProxy", _SE(js_agora_RtcEngineNative_setCloudProxy));
    cls->defineFunction("getConnectionState", _SE(js_agora_RtcEngineNative_getConnectionState));
    // Speaker
    cls->defineFunction("setDefaultAudioRouteToSpeakerphone", _SE(js_agora_RtcEngineNative_setDefaultAudioRouteToSpeakerphone));
    cls->defineFunction("setEnableSpeakerphone", _SE(js_agora_RtcEngineNative_setEnableSpeakerphone));
    cls->defineFunction("isSpeakerphoneEnabled", _SE(js_agora_RtcEngineNative_isSpeakerphoneEnabled));
    // Encryption
    cls->defineFunction("enableEncryption", _SE(js_agora_RtcEngineNative_enableEncryption));
    // Misc
    cls->defineFunction("getErrorDescription", _SE(js_agora_RtcEngineNative_getErrorDescription));
    cls->defineFunction("getVersion", _SE(js_agora_RtcEngineNative_getVersion));
    cls->defineFunction("queryDeviceScore", _SE(js_agora_RtcEngineNative_queryDeviceScore));
    cls->defineFinalizeFunction(_SE(js_agora_RtcEngineNative_finalize));
    cls->install();

    __jsb_AgoraRtcEngineNative_class = cls;
    return true;
}
