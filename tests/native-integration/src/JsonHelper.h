#pragma once

#include <string>
#include "IAgoraRtcEngineEx.h"

namespace agora {
namespace rtc {
namespace json {

// Serialize RtcConnection to JSON
std::string toJson(const RtcConnection& conn);

// Serialize RtcStats to JSON
std::string toJson(const RtcStats& stats);

// Serialize ChannelMediaOptions to JSON
std::string toJson(const ChannelMediaOptions& options);

// Serialize ClientRoleOptions to JSON
std::string toJson(const ClientRoleOptions& options);

// Serialize LastmileProbeResult to JSON
std::string toJson(const LastmileProbeResult& result);

// Serialize RemoteAudioStats to JSON
std::string toJson(const RemoteAudioStats& stats);

// Serialize LocalAudioStats to JSON
std::string toJson(const LocalAudioStats& stats);

// Serialize LocalVideoStats to JSON
std::string toJson(const LocalVideoStats& stats);

// Serialize RemoteVideoStats to JSON
std::string toJson(const RemoteVideoStats& stats);

// Serialize TranscodingVideoStream to JSON
std::string toJson(const TranscodingVideoStream& stream);

// Serialize ExtensionContext to JSON
std::string toJson(const ExtensionContext& context);

// Serialize UserInfo to JSON
std::string toJson(const UserInfo& info);

// Serialize MultipathStats to JSON
std::string toJson(const MultipathStats& stats);

// Serialize VideoRenderingTracingInfo to JSON
std::string toJson(const VideoRenderingTracingInfo& info);

// Primitive type serializers
std::string toJson(int value);
std::string toJson(unsigned int value);
std::string toJson(bool value);
std::string toJson(const char* value);
std::string toJson(const std::string& value);

} // namespace json
} // namespace rtc
} // namespace agora
