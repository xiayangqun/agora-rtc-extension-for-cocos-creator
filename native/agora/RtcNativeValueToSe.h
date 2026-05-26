#pragma once

#include <cstdint>
#include <string>
#include <type_traits>
#include <vector>

#include "IAgoraRtcEngineEx.h"
#include "bindings/jswrapper/SeApi.h"

bool nativevalue_to_se(const std::string &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const char *from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(bool from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(float from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(double from, se::Value &to, se::Object *ctx);

template<typename T, typename std::enable_if<std::is_enum<T>::value, int>::type = 0>
bool nativevalue_to_se(T from, se::Value &to, se::Object *ctx) {
    return nativevalue_to_se(static_cast<int32_t>(from), to, ctx);
}

template<typename T, typename std::enable_if<std::is_integral<T>::value && !std::is_same<T, bool>::value, int>::type = 0>
bool nativevalue_to_se(T from, se::Value &to, se::Object *ctx) {
    (void)ctx;
    if constexpr (std::is_unsigned<T>::value || sizeof(T) > sizeof(int32_t)) {
        to.setDouble(static_cast<double>(from));
    } else {
        to.setInt32(static_cast<int32_t>(from));
    }
    return true;
}

bool nativevalue_to_se(const agora::rtc::RtcConnection &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::RtcStats &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::AudioVolumeInfo &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::LocalAudioStats &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::RemoteAudioStats &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::LocalVideoStats &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::RemoteVideoStats &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::ClientRoleOptions &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::VideoRenderingTracingInfo &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::rtc::MultipathStats &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const agora::VideoLayout &from, se::Value &to, se::Object *ctx);

template<typename T>
bool nativevalue_to_se(const std::vector<T> &from, se::Value &to, se::Object *ctx) {
    se::HandleObject array(se::Object::createArrayObject(from.size()));
    bool ok = true;
    for (size_t i = 0; i < from.size(); ++i) {
        se::Value item;
        ok &= nativevalue_to_se(from[i], item, ctx);
        if (ok) { array->setArrayElement(static_cast<uint32_t>(i), item); }
    }
    to.setObject(array);
    return ok;
}
