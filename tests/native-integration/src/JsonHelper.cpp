#include "JsonHelper.h"
#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

namespace agora {
namespace rtc {
namespace json {

// ── Helper to append a string member ──────────────────────────────────────
static void addString(rapidjson::Document& d, const char* name, const char* val,
                      rapidjson::Document::AllocatorType& alloc) {
    rapidjson::Value v;
    if (val) {
        v.SetString(val, alloc);
    } else {
        v.SetString("", alloc);
    }
    d.AddMember(rapidjson::StringRef(name), v, alloc);
}

static void addString(rapidjson::Document& d, const char* name, const std::string& val,
                      rapidjson::Document::AllocatorType& alloc) {
    rapidjson::Value v;
    v.SetString(val.c_str(), alloc);
    d.AddMember(rapidjson::StringRef(name), v, alloc);
}

// ==========================================================================
// RtcConnection
// ==========================================================================
std::string toJson(const RtcConnection& conn) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    addString(d, "channelId", conn.channelId, alloc);
    d.AddMember("localUid", conn.localUid, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// RtcStats
// ==========================================================================
std::string toJson(const RtcStats& stats) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("duration", stats.duration, alloc);
    d.AddMember("txBytes", stats.txBytes, alloc);
    d.AddMember("rxBytes", stats.rxBytes, alloc);
    d.AddMember("txAudioBytes", stats.txAudioBytes, alloc);
    d.AddMember("txVideoBytes", stats.txVideoBytes, alloc);
    d.AddMember("rxAudioBytes", stats.rxAudioBytes, alloc);
    d.AddMember("rxVideoBytes", stats.rxVideoBytes, alloc);
    d.AddMember("txKBitRate", stats.txKBitRate, alloc);
    d.AddMember("rxKBitRate", stats.rxKBitRate, alloc);
    d.AddMember("rxAudioKBitRate", stats.rxAudioKBitRate, alloc);
    d.AddMember("txAudioKBitRate", stats.txAudioKBitRate, alloc);
    d.AddMember("rxVideoKBitRate", stats.rxVideoKBitRate, alloc);
    d.AddMember("txVideoKBitRate", stats.txVideoKBitRate, alloc);
    d.AddMember("lastmileDelay", stats.lastmileDelay, alloc);
    d.AddMember("userCount", stats.userCount, alloc);
    d.AddMember("cpuAppUsage", stats.cpuAppUsage, alloc);
    d.AddMember("cpuTotalUsage", stats.cpuTotalUsage, alloc);
    d.AddMember("gatewayRtt", stats.gatewayRtt, alloc);
    d.AddMember("memoryAppUsageRatio", stats.memoryAppUsageRatio, alloc);
    d.AddMember("memoryTotalUsageRatio", stats.memoryTotalUsageRatio, alloc);
    d.AddMember("memoryAppUsageInKbytes", stats.memoryAppUsageInKbytes, alloc);
    d.AddMember("connectTimeMs", stats.connectTimeMs, alloc);
    d.AddMember("firstAudioPacketDuration", stats.firstAudioPacketDuration, alloc);
    d.AddMember("firstVideoPacketDuration", stats.firstVideoPacketDuration, alloc);
    d.AddMember("firstVideoKeyFramePacketDuration", stats.firstVideoKeyFramePacketDuration, alloc);
    d.AddMember("packetsBeforeFirstKeyFramePacket", stats.packetsBeforeFirstKeyFramePacket, alloc);
    d.AddMember("firstAudioPacketDurationAfterUnmute", stats.firstAudioPacketDurationAfterUnmute, alloc);
    d.AddMember("firstVideoPacketDurationAfterUnmute", stats.firstVideoPacketDurationAfterUnmute, alloc);
    d.AddMember("firstVideoKeyFramePacketDurationAfterUnmute", stats.firstVideoKeyFramePacketDurationAfterUnmute, alloc);
    d.AddMember("firstVideoKeyFrameDecodedDurationAfterUnmute", stats.firstVideoKeyFrameDecodedDurationAfterUnmute, alloc);
    d.AddMember("firstVideoKeyFrameRenderedDurationAfterUnmute", stats.firstVideoKeyFrameRenderedDurationAfterUnmute, alloc);
    d.AddMember("txPacketLossRate", stats.txPacketLossRate, alloc);
    d.AddMember("rxPacketLossRate", stats.rxPacketLossRate, alloc);
    d.AddMember("lanAccelerateState", stats.lanAccelerateState, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ChannelMediaOptions
// ==========================================================================
std::string toJson(const ChannelMediaOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();

    if (options.publishCameraTrack.has_value())
        d.AddMember("publishCameraTrack", options.publishCameraTrack.value(), alloc);
    if (options.publishSecondaryCameraTrack.has_value())
        d.AddMember("publishSecondaryCameraTrack", options.publishSecondaryCameraTrack.value(), alloc);
    if (options.publishMicrophoneTrack.has_value())
        d.AddMember("publishMicrophoneTrack", options.publishMicrophoneTrack.value(), alloc);
    if (options.publishCustomAudioTrack.has_value())
        d.AddMember("publishCustomAudioTrack", options.publishCustomAudioTrack.value(), alloc);
    if (options.publishCustomAudioTrackId.has_value())
        d.AddMember("publishCustomAudioTrackId", options.publishCustomAudioTrackId.value(), alloc);
    if (options.publishCustomVideoTrack.has_value())
        d.AddMember("publishCustomVideoTrack", options.publishCustomVideoTrack.value(), alloc);
    if (options.publishEncodedVideoTrack.has_value())
        d.AddMember("publishEncodedVideoTrack", options.publishEncodedVideoTrack.value(), alloc);
    if (options.publishMediaPlayerAudioTrack.has_value())
        d.AddMember("publishMediaPlayerAudioTrack", options.publishMediaPlayerAudioTrack.value(), alloc);
    if (options.publishMediaPlayerVideoTrack.has_value())
        d.AddMember("publishMediaPlayerVideoTrack", options.publishMediaPlayerVideoTrack.value(), alloc);
    if (options.publishTranscodedVideoTrack.has_value())
        d.AddMember("publishTranscodedVideoTrack", options.publishTranscodedVideoTrack.value(), alloc);
    if (options.autoSubscribeAudio.has_value())
        d.AddMember("autoSubscribeAudio", options.autoSubscribeAudio.value(), alloc);
    if (options.autoSubscribeVideo.has_value())
        d.AddMember("autoSubscribeVideo", options.autoSubscribeVideo.value(), alloc);
    if (options.enableAudioRecordingOrPlayout.has_value())
        d.AddMember("enableAudioRecordingOrPlayout", options.enableAudioRecordingOrPlayout.value(), alloc);
    if (options.publishMediaPlayerId.has_value())
        d.AddMember("publishMediaPlayerId", options.publishMediaPlayerId.value(), alloc);
    if (options.clientRoleType.has_value())
        d.AddMember("clientRoleType", static_cast<int>(options.clientRoleType.value()), alloc);
    if (options.audienceLatencyLevel.has_value())
        d.AddMember("audienceLatencyLevel", static_cast<int>(options.audienceLatencyLevel.value()), alloc);
    if (options.defaultVideoStreamType.has_value())
        d.AddMember("defaultVideoStreamType", static_cast<int>(options.defaultVideoStreamType.value()), alloc);
    if (options.channelProfile.has_value())
        d.AddMember("channelProfile", static_cast<int>(options.channelProfile.value()), alloc);
    if (options.audioDelayMs.has_value())
        d.AddMember("audioDelayMs", options.audioDelayMs.value(), alloc);
    if (options.mediaPlayerAudioDelayMs.has_value())
        d.AddMember("mediaPlayerAudioDelayMs", options.mediaPlayerAudioDelayMs.value(), alloc);
    if (options.token.has_value())
        addString(d, "token", options.token.value(), alloc);
    if (options.enableBuiltInMediaEncryption.has_value())
        d.AddMember("enableBuiltInMediaEncryption", options.enableBuiltInMediaEncryption.value(), alloc);
    if (options.publishRhythmPlayerTrack.has_value())
        d.AddMember("publishRhythmPlayerTrack", options.publishRhythmPlayerTrack.value(), alloc);
    if (options.isInteractiveAudience.has_value())
        d.AddMember("isInteractiveAudience", options.isInteractiveAudience.value(), alloc);
    if (options.customVideoTrackId.has_value())
        d.AddMember("customVideoTrackId", options.customVideoTrackId.value(), alloc);
    if (options.isAudioFilterable.has_value())
        d.AddMember("isAudioFilterable", options.isAudioFilterable.value(), alloc);
    if (options.parameters.has_value())
        addString(d, "parameters", options.parameters.value(), alloc);
    if (options.enableMultipath.has_value())
        d.AddMember("enableMultipath", options.enableMultipath.value(), alloc);

    // Platform-specific fields
#if defined(__ANDROID__) || (defined(TARGET_OS_IPHONE) && TARGET_OS_IPHONE) || defined(TARGET_OS_MAC) || defined(__OHOS__)
    if (options.publishScreenCaptureAudio.has_value())
        d.AddMember("publishScreenCaptureAudio", options.publishScreenCaptureAudio.value(), alloc);
#endif
#if defined(__ANDROID__) || (defined(TARGET_OS_IPHONE) && TARGET_OS_IPHONE) || defined(__OHOS__)
    if (options.publishScreenCaptureVideo.has_value())
        d.AddMember("publishScreenCaptureVideo", options.publishScreenCaptureVideo.value(), alloc);
#else
    if (options.publishScreenTrack.has_value())
        d.AddMember("publishScreenTrack", options.publishScreenTrack.value(), alloc);
    if (options.publishSecondaryScreenTrack.has_value())
        d.AddMember("publishSecondaryScreenTrack", options.publishSecondaryScreenTrack.value(), alloc);
    if (options.publishThirdScreenTrack.has_value())
        d.AddMember("publishThirdScreenTrack", options.publishThirdScreenTrack.value(), alloc);
    if (options.publishFourthScreenTrack.has_value())
        d.AddMember("publishFourthScreenTrack", options.publishFourthScreenTrack.value(), alloc);
#endif

    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ClientRoleOptions
// ==========================================================================
std::string toJson(const ClientRoleOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("audienceLatencyLevel", static_cast<int>(options.audienceLatencyLevel), alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LastmileProbeResult
// ==========================================================================
std::string toJson(const LastmileProbeResult& result) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("state", static_cast<int>(result.state), alloc);
    d.AddMember("rtt", result.rtt, alloc);
    // uplinkReport
    rapidjson::Value uplink(rapidjson::kObjectType);
    uplink.AddMember("packetLossRate", result.uplinkReport.packetLossRate, alloc);
    uplink.AddMember("jitter", result.uplinkReport.jitter, alloc);
    uplink.AddMember("availableBandwidth", result.uplinkReport.availableBandwidth, alloc);
    d.AddMember("uplinkReport", uplink, alloc);
    // downlinkReport
    rapidjson::Value downlink(rapidjson::kObjectType);
    downlink.AddMember("packetLossRate", result.downlinkReport.packetLossRate, alloc);
    downlink.AddMember("jitter", result.downlinkReport.jitter, alloc);
    downlink.AddMember("availableBandwidth", result.downlinkReport.availableBandwidth, alloc);
    d.AddMember("downlinkReport", downlink, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// RemoteAudioStats
// ==========================================================================
std::string toJson(const RemoteAudioStats& stats) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("uid", stats.uid, alloc);
    d.AddMember("quality", stats.quality, alloc);
    d.AddMember("networkTransportDelay", stats.networkTransportDelay, alloc);
    d.AddMember("jitterBufferDelay", stats.jitterBufferDelay, alloc);
    d.AddMember("audioLossRate", stats.audioLossRate, alloc);
    d.AddMember("numChannels", stats.numChannels, alloc);
    d.AddMember("receivedSampleRate", stats.receivedSampleRate, alloc);
    d.AddMember("receivedBitrate", stats.receivedBitrate, alloc);
    d.AddMember("totalFrozenTime", stats.totalFrozenTime, alloc);
    d.AddMember("frozenRate", stats.frozenRate, alloc);
    d.AddMember("mosValue", stats.mosValue, alloc);
    d.AddMember("frozenRateByCustomPlcCount", stats.frozenRateByCustomPlcCount, alloc);
    d.AddMember("plcCount", stats.plcCount, alloc);
    d.AddMember("frozenCntByCustom", stats.frozenCntByCustom, alloc);
    d.AddMember("frozenTimeByCustom", stats.frozenTimeByCustom, alloc);
    d.AddMember("totalActiveTime", stats.totalActiveTime, alloc);
    d.AddMember("publishDuration", stats.publishDuration, alloc);
    d.AddMember("qoeQuality", stats.qoeQuality, alloc);
    d.AddMember("qualityChangedReason", stats.qualityChangedReason, alloc);
    d.AddMember("rxAudioBytes", stats.rxAudioBytes, alloc);
    d.AddMember("e2eDelay", stats.e2eDelay, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LocalAudioStats
// ==========================================================================
std::string toJson(const LocalAudioStats& stats) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("numChannels", stats.numChannels, alloc);
    d.AddMember("sentSampleRate", stats.sentSampleRate, alloc);
    d.AddMember("sentBitrate", stats.sentBitrate, alloc);
    d.AddMember("internalCodec", stats.internalCodec, alloc);
    d.AddMember("txPacketLossRate", stats.txPacketLossRate, alloc);
    d.AddMember("audioDeviceDelay", stats.audioDeviceDelay, alloc);
    d.AddMember("audioPlayoutDelay", stats.audioPlayoutDelay, alloc);
    d.AddMember("earMonitorDelay", stats.earMonitorDelay, alloc);
    d.AddMember("aecEstimatedDelay", stats.aecEstimatedDelay, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LocalVideoStats
// ==========================================================================
std::string toJson(const LocalVideoStats& stats) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("uid", stats.uid, alloc);
    d.AddMember("sentBitrate", stats.sentBitrate, alloc);
    d.AddMember("sentFrameRate", stats.sentFrameRate, alloc);
    d.AddMember("captureFrameRate", stats.captureFrameRate, alloc);
    d.AddMember("captureFrameWidth", stats.captureFrameWidth, alloc);
    d.AddMember("captureFrameHeight", stats.captureFrameHeight, alloc);
    d.AddMember("regulatedCaptureFrameRate", stats.regulatedCaptureFrameRate, alloc);
    d.AddMember("regulatedCaptureFrameWidth", stats.regulatedCaptureFrameWidth, alloc);
    d.AddMember("regulatedCaptureFrameHeight", stats.regulatedCaptureFrameHeight, alloc);
    d.AddMember("encoderOutputFrameRate", stats.encoderOutputFrameRate, alloc);
    d.AddMember("encodedFrameWidth", stats.encodedFrameWidth, alloc);
    d.AddMember("encodedFrameHeight", stats.encodedFrameHeight, alloc);
    d.AddMember("rendererOutputFrameRate", stats.rendererOutputFrameRate, alloc);
    d.AddMember("targetBitrate", stats.targetBitrate, alloc);
    d.AddMember("targetFrameRate", stats.targetFrameRate, alloc);
    d.AddMember("qualityAdaptIndication", static_cast<int>(stats.qualityAdaptIndication), alloc);
    d.AddMember("encodedBitrate", stats.encodedBitrate, alloc);
    d.AddMember("encodedFrameCount", stats.encodedFrameCount, alloc);
    d.AddMember("codecType", static_cast<int>(stats.codecType), alloc);
    d.AddMember("txPacketLossRate", stats.txPacketLossRate, alloc);
    d.AddMember("captureBrightnessLevel", static_cast<int>(stats.captureBrightnessLevel), alloc);
    d.AddMember("dualStreamEnabled", stats.dualStreamEnabled, alloc);
    d.AddMember("hwEncoderAccelerating", stats.hwEncoderAccelerating, alloc);
    d.AddMember("encodedFrameDepth", stats.encodedFrameDepth, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// RemoteVideoStats
// ==========================================================================
std::string toJson(const RemoteVideoStats& stats) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("uid", stats.uid, alloc);
    d.AddMember("delay", stats.delay, alloc);
    d.AddMember("e2eDelay", stats.e2eDelay, alloc);
    d.AddMember("width", stats.width, alloc);
    d.AddMember("height", stats.height, alloc);
    d.AddMember("receivedBitrate", stats.receivedBitrate, alloc);
    d.AddMember("decoderInputFrameRate", stats.decoderInputFrameRate, alloc);
    d.AddMember("decoderOutputFrameRate", stats.decoderOutputFrameRate, alloc);
    d.AddMember("rendererOutputFrameRate", stats.rendererOutputFrameRate, alloc);
    d.AddMember("frameLossRate", stats.frameLossRate, alloc);
    d.AddMember("packetLossRate", stats.packetLossRate, alloc);
    d.AddMember("rxStreamType", static_cast<int>(stats.rxStreamType), alloc);
    d.AddMember("totalFrozenTime", stats.totalFrozenTime, alloc);
    d.AddMember("frozenRate", stats.frozenRate, alloc);
    d.AddMember("avSyncTimeMs", stats.avSyncTimeMs, alloc);
    d.AddMember("totalActiveTime", stats.totalActiveTime, alloc);
    d.AddMember("publishDuration", stats.publishDuration, alloc);
    d.AddMember("mosValue", stats.mosValue, alloc);
    d.AddMember("rxVideoBytes", stats.rxVideoBytes, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// TranscodingVideoStream
// ==========================================================================
std::string toJson(const TranscodingVideoStream& stream) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("sourceType", static_cast<int>(stream.sourceType), alloc);
    d.AddMember("remoteUserUid", stream.remoteUserUid, alloc);
    addString(d, "imageUrl", stream.imageUrl, alloc);
    d.AddMember("mediaPlayerId", stream.mediaPlayerId, alloc);
    d.AddMember("x", stream.x, alloc);
    d.AddMember("y", stream.y, alloc);
    d.AddMember("width", stream.width, alloc);
    d.AddMember("height", stream.height, alloc);
    d.AddMember("zOrder", stream.zOrder, alloc);
    d.AddMember("alpha", stream.alpha, alloc);
    d.AddMember("mirror", stream.mirror, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ExtensionContext
// ==========================================================================
std::string toJson(const ExtensionContext& context) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("isValid", context.isValid, alloc);
    d.AddMember("uid", context.uid, alloc);
    addString(d, "providerName", context.providerName, alloc);
    addString(d, "extensionName", context.extensionName, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// UserInfo
// ==========================================================================
std::string toJson(const UserInfo& info) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("uid", info.uid, alloc);
    addString(d, "userAccount", info.userAccount, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// MultipathStats
// ==========================================================================
std::string toJson(const MultipathStats& stats) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("lanTxBytes", stats.lanTxBytes, alloc);
    d.AddMember("lanRxBytes", stats.lanRxBytes, alloc);
    d.AddMember("wifiTxBytes", stats.wifiTxBytes, alloc);
    d.AddMember("wifiRxBytes", stats.wifiRxBytes, alloc);
    d.AddMember("mobileTxBytes", stats.mobileTxBytes, alloc);
    d.AddMember("mobileRxBytes", stats.mobileRxBytes, alloc);
    d.AddMember("activePathNum", stats.activePathNum, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// VideoRenderingTracingInfo
// ==========================================================================
std::string toJson(const VideoRenderingTracingInfo& info) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("elapsedTime", info.elapsedTime, alloc);
    d.AddMember("start2JoinChannel", info.start2JoinChannel, alloc);
    d.AddMember("join2JoinSuccess", info.join2JoinSuccess, alloc);
    d.AddMember("joinSuccess2RemoteJoined", info.joinSuccess2RemoteJoined, alloc);
    d.AddMember("remoteJoined2SetView", info.remoteJoined2SetView, alloc);
    d.AddMember("remoteJoined2UnmuteVideo", info.remoteJoined2UnmuteVideo, alloc);
    d.AddMember("remoteJoined2PacketReceived", info.remoteJoined2PacketReceived, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// VideoCanvas
// ==========================================================================
std::string toJson(const VideoCanvas& canvas) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("renderMode", static_cast<int>(canvas.renderMode), alloc);
    d.AddMember("uid", canvas.uid, alloc);
    d.AddMember("sourceType", static_cast<int>(canvas.sourceType), alloc);
    d.AddMember("mirrorMode", static_cast<int>(canvas.mirrorMode), alloc);
    d.AddMember("mediaPlayerId", canvas.mediaPlayerId, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// VirtualBackgroundSource
// ==========================================================================
std::string toJson(const VirtualBackgroundSource& source) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("background_source_type", static_cast<int>(source.background_source_type), alloc);
    addString(d, "source", source.source, alloc);
    d.AddMember("color", source.color, alloc);
    d.AddMember("blur_degree", static_cast<int>(source.blur_degree), alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// SegmentationProperty
// ==========================================================================
std::string toJson(const SegmentationProperty& prop) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("modelType", static_cast<int>(prop.modelType), alloc);
    d.AddMember("greenCapacity", prop.greenCapacity, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// AudioRecordingConfiguration
// ==========================================================================
std::string toJson(const AudioRecordingConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    addString(d, "filePath", config.filePath, alloc);
    d.AddMember("encode", static_cast<int>(config.encode), alloc);
    d.AddMember("sampleRate", config.recordingChannel, alloc);
    d.AddMember("fileRecordingType", static_cast<int>(config.fileRecordingType), alloc);
    d.AddMember("quality", static_cast<int>(config.quality), alloc);
    d.AddMember("recordingChannel", config.recordingChannel, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// SpatialAudioParams
// ==========================================================================
std::string toJson(const agora::SpatialAudioParams& params) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    if (params.speaker_azimuth) d.AddMember("speaker_azimuth", params.speaker_azimuth.value(), alloc);
    if (params.speaker_elevation) d.AddMember("speaker_elevation", params.speaker_elevation.value(), alloc);
    if (params.speaker_distance) d.AddMember("speaker_distance", params.speaker_distance.value(), alloc);
    if (params.speaker_orientation) d.AddMember("speaker_orientation", params.speaker_orientation.value(), alloc);
    if (params.enable_blur) d.AddMember("enable_blur", params.enable_blur.value(), alloc);
    if (params.enable_air_absorb) d.AddMember("enable_air_absorb", params.enable_air_absorb.value(), alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LiveTranscoding
// ==========================================================================
std::string toJson(const LiveTranscoding& transcoding) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("width", transcoding.width, alloc);
    d.AddMember("height", transcoding.height, alloc);
    d.AddMember("videoBitrate", transcoding.videoBitrate, alloc);
    d.AddMember("videoFramerate", transcoding.videoFramerate, alloc);
    d.AddMember("lowLatency", transcoding.lowLatency, alloc);
    d.AddMember("videoGop", transcoding.videoGop, alloc);
    d.AddMember("videoCodecProfile", static_cast<int>(transcoding.videoCodecProfile), alloc);
    d.AddMember("backgroundColor", transcoding.backgroundColor, alloc);
    d.AddMember("userCount", transcoding.userCount, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LocalTranscoderConfiguration
// ==========================================================================
std::string toJson(const LocalTranscoderConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("streamCount", config.streamCount, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LocalAudioMixerConfiguration
// ==========================================================================
std::string toJson(const LocalAudioMixerConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("streamCount", config.streamCount, alloc);
    d.AddMember("syncWithLocalMic", config.syncWithLocalMic, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// VideoEncoderConfiguration
// ==========================================================================
std::string toJson(const VideoEncoderConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("codecType", static_cast<int>(config.codecType), alloc);
    d.AddMember("orientationMode", static_cast<int>(config.orientationMode), alloc);
    d.AddMember("degradationPreference", static_cast<int>(config.degradationPreference), alloc);
    d.AddMember("mirrorMode", static_cast<int>(config.mirrorMode), alloc);
    d.AddMember("frameRate", static_cast<int>(config.frameRate), alloc);
    d.AddMember("bitrate", config.bitrate, alloc);
    d.AddMember("minBitrate", config.minBitrate, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ContentInspectConfig
// ==========================================================================
std::string toJson(const agora::media::ContentInspectConfig& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("moduleCount", config.moduleCount, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ImageTrackOptions
// ==========================================================================
std::string toJson(const ImageTrackOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    addString(d, "imageUrl", options.imageUrl, alloc);
    d.AddMember("fps", options.fps, alloc);
    d.AddMember("mirrorMode", static_cast<int>(options.mirrorMode), alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// WatermarkOptions
// ==========================================================================
std::string toJson(const WatermarkOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("visibleInPreview", options.visibleInPreview, alloc);
    d.AddMember("posInLandscape_x", options.positionInLandscapeMode.x, alloc);
    d.AddMember("posInLandscape_y", options.positionInLandscapeMode.y, alloc);
    d.AddMember("posInLandscape_w", options.positionInLandscapeMode.width, alloc);
    d.AddMember("posInLandscape_h", options.positionInLandscapeMode.height, alloc);
    d.AddMember("posInPortrait_x", options.positionInPortraitMode.x, alloc);
    d.AddMember("posInPortrait_y", options.positionInPortraitMode.y, alloc);
    d.AddMember("posInPortrait_w", options.positionInPortraitMode.width, alloc);
    d.AddMember("posInPortrait_h", options.positionInPortraitMode.height, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ScreenCaptureParameters
// ==========================================================================
std::string toJson(const ScreenCaptureParameters& params) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("dimensionsWidth", params.dimensions.width, alloc);
    d.AddMember("dimensionsHeight", params.dimensions.height, alloc);
    d.AddMember("frameRate", params.frameRate, alloc);
    d.AddMember("bitrate", params.bitrate, alloc);
    d.AddMember("captureMouseCursor", params.captureMouseCursor, alloc);
    d.AddMember("windowFocus", params.windowFocus, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ScreenCaptureConfiguration
// ==========================================================================
std::string toJson(const ScreenCaptureConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("isCaptureWindow", config.isCaptureWindow, alloc);
    d.AddMember("displayId", config.displayId, alloc);
    rapidjson::Value params(rapidjson::kObjectType);
    params.AddMember("dimensionsWidth", config.params.dimensions.width, alloc);
    params.AddMember("dimensionsHeight", config.params.dimensions.height, alloc);
    params.AddMember("frameRate", config.params.frameRate, alloc);
    params.AddMember("bitrate", config.params.bitrate, alloc);
    d.AddMember("params", params, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// ChannelMediaRelayConfiguration
// ==========================================================================
std::string toJson(const ChannelMediaRelayConfiguration& config) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    if (config.srcInfo) {
        rapidjson::Value src(rapidjson::kObjectType);
        { rapidjson::Value v; v.SetString(config.srcInfo->channelName ? config.srcInfo->channelName : "", alloc); src.AddMember("channelName", v, alloc); }
        src.AddMember("uid", config.srcInfo->uid, alloc);
        { rapidjson::Value v; v.SetString(config.srcInfo->token ? config.srcInfo->token : "", alloc); src.AddMember("token", v, alloc); }
        d.AddMember("srcInfo", src, alloc);
    }
    if (config.destInfos) {
        rapidjson::Value dests(rapidjson::kArrayType);
        for (int i = 0; i < config.destCount; i++) {
            rapidjson::Value dest(rapidjson::kObjectType);
            { rapidjson::Value v; v.SetString(config.destInfos[i].channelName ? config.destInfos[i].channelName : "", alloc); dest.AddMember("channelName", v, alloc); }
            dest.AddMember("uid", config.destInfos[i].uid, alloc);
            { rapidjson::Value v; v.SetString(config.destInfos[i].token ? config.destInfos[i].token : "", alloc); dest.AddMember("token", v, alloc); }
            dests.PushBack(dest, alloc);
        }
        d.AddMember("destInfos", dests, alloc);
    }
    d.AddMember("destCount", config.destCount, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// LeaveChannelOptions
// ==========================================================================
std::string toJson(const LeaveChannelOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    d.AddMember("stopAudioMixing", options.stopAudioMixing, alloc);
    d.AddMember("stopAllEffect", options.stopAllEffect, alloc);
    d.AddMember("stopMicrophoneRecording", options.stopMicrophoneRecording, alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// DirectCdnStreamingMediaOptions
// ==========================================================================
std::string toJson(const DirectCdnStreamingMediaOptions& options) {
    rapidjson::Document d;
    d.SetObject();
    auto& alloc = d.GetAllocator();
    if (options.publishCameraTrack.has_value())
        d.AddMember("publishCameraTrack", options.publishCameraTrack.value(), alloc);
    if (options.publishMicrophoneTrack.has_value())
        d.AddMember("publishMicrophoneTrack", options.publishMicrophoneTrack.value(), alloc);
    if (options.publishCustomAudioTrack.has_value())
        d.AddMember("publishCustomAudioTrack", options.publishCustomAudioTrack.value(), alloc);
    if (options.publishCustomVideoTrack.has_value())
        d.AddMember("publishCustomVideoTrack", options.publishCustomVideoTrack.value(), alloc);
    if (options.publishMediaPlayerAudioTrack.has_value())
        d.AddMember("publishMediaPlayerAudioTrack", options.publishMediaPlayerAudioTrack.value(), alloc);
    if (options.customVideoTrackId.has_value())
        d.AddMember("customVideoTrackId", options.customVideoTrackId.value(), alloc);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

// ==========================================================================
// Primitive types
// ==========================================================================
std::string toJson(int value) {
    rapidjson::Document d;
    d.SetInt(value);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

std::string toJson(unsigned int value) {
    rapidjson::Document d;
    d.SetUint(value);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

std::string toJson(bool value) {
    rapidjson::Document d;
    d.SetBool(value);
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

std::string toJson(const char* value) {
    rapidjson::Document d;
    d.SetString(value ? value : "", d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

std::string toJson(const std::string& value) {
    rapidjson::Document d;
    d.SetString(value.c_str(), d.GetAllocator());
    rapidjson::StringBuffer buf;
    rapidjson::Writer<rapidjson::StringBuffer> w(buf);
    d.Accept(w);
    return buf.GetString();
}

} // namespace json
} // namespace rtc
} // namespace agora
