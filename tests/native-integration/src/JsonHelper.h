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

// Serialize VideoCanvas to JSON
std::string toJson(const VideoCanvas& canvas);

// Serialize VirtualBackgroundSource to JSON
std::string toJson(const VirtualBackgroundSource& source);

// Serialize SegmentationProperty to JSON
std::string toJson(const SegmentationProperty& prop);

// Serialize AudioRecordingConfiguration to JSON
std::string toJson(const AudioRecordingConfiguration& config);

// Serialize SpatialAudioParams to JSON
std::string toJson(const agora::SpatialAudioParams& params);

// Serialize LiveTranscoding to JSON
std::string toJson(const LiveTranscoding& transcoding);

// Serialize LocalTranscoderConfiguration to JSON
std::string toJson(const LocalTranscoderConfiguration& config);

// Serialize LocalAudioMixerConfiguration to JSON
std::string toJson(const LocalAudioMixerConfiguration& config);

// Serialize VideoEncoderConfiguration to JSON
std::string toJson(const VideoEncoderConfiguration& config);

// Serialize ContentInspectConfig to JSON
std::string toJson(const agora::media::ContentInspectConfig& config);

// Serialize ImageTrackOptions to JSON
std::string toJson(const ImageTrackOptions& options);

// Serialize WatermarkOptions to JSON
std::string toJson(const WatermarkOptions& options);

// Serialize ScreenCaptureParameters to JSON
std::string toJson(const ScreenCaptureParameters& params);

// Serialize ScreenCaptureConfiguration to JSON
std::string toJson(const ScreenCaptureConfiguration& config);

// Serialize ChannelMediaRelayConfiguration to JSON
std::string toJson(const ChannelMediaRelayConfiguration& config);

// Serialize LeaveChannelOptions to JSON
std::string toJson(const LeaveChannelOptions& options);

// Serialize DirectCdnStreamingMediaOptions to JSON
std::string toJson(const DirectCdnStreamingMediaOptions& options);

// Primitive type serializers
std::string toJson(int value);
std::string toJson(unsigned int value);
std::string toJson(bool value);
std::string toJson(const char* value);
std::string toJson(const std::string& value);

} // namespace json
} // namespace rtc
} // namespace agora
