#include "agora/RtcNativeValueToSe.h"

bool nativevalue_to_se(const std::string &from, se::Value &to, se::Object *ctx) {
    (void)ctx;
    to.setString(from);
    return true;
}

bool nativevalue_to_se(const char *from, se::Value &to, se::Object *ctx) {
    (void)ctx;
    to.setString(from != nullptr ? from : "");
    return true;
}

bool nativevalue_to_se(bool from, se::Value &to, se::Object *ctx) {
    (void)ctx;
    to.setBoolean(from);
    return true;
}

bool nativevalue_to_se(float from, se::Value &to, se::Object *ctx) {
    (void)ctx;
    to.setFloat(from);
    return true;
}

bool nativevalue_to_se(double from, se::Value &to, se::Object *ctx) {
    (void)ctx;
    to.setDouble(from);
    return true;
}

bool nativevalue_to_se(const agora::rtc::RtcConnection &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.localUid, field, ctx);
    if (ok) { obj->setProperty("localUid", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RtcStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.duration, field, ctx);
    if (ok) { obj->setProperty("duration", field); }

    ok &= nativevalue_to_se(from.txBytes, field, ctx);
    if (ok) { obj->setProperty("txBytes", field); }

    ok &= nativevalue_to_se(from.rxBytes, field, ctx);
    if (ok) { obj->setProperty("rxBytes", field); }

    ok &= nativevalue_to_se(from.txAudioBytes, field, ctx);
    if (ok) { obj->setProperty("txAudioBytes", field); }

    ok &= nativevalue_to_se(from.txVideoBytes, field, ctx);
    if (ok) { obj->setProperty("txVideoBytes", field); }

    ok &= nativevalue_to_se(from.rxAudioBytes, field, ctx);
    if (ok) { obj->setProperty("rxAudioBytes", field); }

    ok &= nativevalue_to_se(from.rxVideoBytes, field, ctx);
    if (ok) { obj->setProperty("rxVideoBytes", field); }

    ok &= nativevalue_to_se(from.txKBitRate, field, ctx);
    if (ok) { obj->setProperty("txKBitRate", field); }

    ok &= nativevalue_to_se(from.rxKBitRate, field, ctx);
    if (ok) { obj->setProperty("rxKBitRate", field); }

    ok &= nativevalue_to_se(from.rxAudioKBitRate, field, ctx);
    if (ok) { obj->setProperty("rxAudioKBitRate", field); }

    ok &= nativevalue_to_se(from.txAudioKBitRate, field, ctx);
    if (ok) { obj->setProperty("txAudioKBitRate", field); }

    ok &= nativevalue_to_se(from.rxVideoKBitRate, field, ctx);
    if (ok) { obj->setProperty("rxVideoKBitRate", field); }

    ok &= nativevalue_to_se(from.txVideoKBitRate, field, ctx);
    if (ok) { obj->setProperty("txVideoKBitRate", field); }

    ok &= nativevalue_to_se(from.lastmileDelay, field, ctx);
    if (ok) { obj->setProperty("lastmileDelay", field); }

    ok &= nativevalue_to_se(from.userCount, field, ctx);
    if (ok) { obj->setProperty("userCount", field); }

    ok &= nativevalue_to_se(from.cpuAppUsage, field, ctx);
    if (ok) { obj->setProperty("cpuAppUsage", field); }

    ok &= nativevalue_to_se(from.cpuTotalUsage, field, ctx);
    if (ok) { obj->setProperty("cpuTotalUsage", field); }

    ok &= nativevalue_to_se(from.gatewayRtt, field, ctx);
    if (ok) { obj->setProperty("gatewayRtt", field); }

    ok &= nativevalue_to_se(from.memoryAppUsageRatio, field, ctx);
    if (ok) { obj->setProperty("memoryAppUsageRatio", field); }

    ok &= nativevalue_to_se(from.memoryTotalUsageRatio, field, ctx);
    if (ok) { obj->setProperty("memoryTotalUsageRatio", field); }

    ok &= nativevalue_to_se(from.memoryAppUsageInKbytes, field, ctx);
    if (ok) { obj->setProperty("memoryAppUsageInKbytes", field); }

    ok &= nativevalue_to_se(from.connectTimeMs, field, ctx);
    if (ok) { obj->setProperty("connectTimeMs", field); }

    ok &= nativevalue_to_se(from.firstAudioPacketDuration, field, ctx);
    if (ok) { obj->setProperty("firstAudioPacketDuration", field); }

    ok &= nativevalue_to_se(from.firstVideoPacketDuration, field, ctx);
    if (ok) { obj->setProperty("firstVideoPacketDuration", field); }

    ok &= nativevalue_to_se(from.firstVideoKeyFramePacketDuration, field, ctx);
    if (ok) { obj->setProperty("firstVideoKeyFramePacketDuration", field); }

    ok &= nativevalue_to_se(from.packetsBeforeFirstKeyFramePacket, field, ctx);
    if (ok) { obj->setProperty("packetsBeforeFirstKeyFramePacket", field); }

    ok &= nativevalue_to_se(from.firstAudioPacketDurationAfterUnmute, field, ctx);
    if (ok) { obj->setProperty("firstAudioPacketDurationAfterUnmute", field); }

    ok &= nativevalue_to_se(from.firstVideoPacketDurationAfterUnmute, field, ctx);
    if (ok) { obj->setProperty("firstVideoPacketDurationAfterUnmute", field); }

    ok &= nativevalue_to_se(from.firstVideoKeyFramePacketDurationAfterUnmute, field, ctx);
    if (ok) { obj->setProperty("firstVideoKeyFramePacketDurationAfterUnmute", field); }

    ok &= nativevalue_to_se(from.firstVideoKeyFrameDecodedDurationAfterUnmute, field, ctx);
    if (ok) { obj->setProperty("firstVideoKeyFrameDecodedDurationAfterUnmute", field); }

    ok &= nativevalue_to_se(from.firstVideoKeyFrameRenderedDurationAfterUnmute, field, ctx);
    if (ok) { obj->setProperty("firstVideoKeyFrameRenderedDurationAfterUnmute", field); }

    ok &= nativevalue_to_se(from.txPacketLossRate, field, ctx);
    if (ok) { obj->setProperty("txPacketLossRate", field); }

    ok &= nativevalue_to_se(from.rxPacketLossRate, field, ctx);
    if (ok) { obj->setProperty("rxPacketLossRate", field); }

    ok &= nativevalue_to_se(from.lanAccelerateState, field, ctx);
    if (ok) { obj->setProperty("lanAccelerateState", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioVolumeInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.volume, field, ctx);
    if (ok) { obj->setProperty("volume", field); }

    ok &= nativevalue_to_se(from.vad, field, ctx);
    if (ok) { obj->setProperty("vad", field); }

    ok &= nativevalue_to_se(from.voicePitch, field, ctx);
    if (ok) { obj->setProperty("voicePitch", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LocalAudioStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.numChannels, field, ctx);
    if (ok) { obj->setProperty("numChannels", field); }

    ok &= nativevalue_to_se(from.sentSampleRate, field, ctx);
    if (ok) { obj->setProperty("sentSampleRate", field); }

    ok &= nativevalue_to_se(from.sentBitrate, field, ctx);
    if (ok) { obj->setProperty("sentBitrate", field); }

    ok &= nativevalue_to_se(from.internalCodec, field, ctx);
    if (ok) { obj->setProperty("internalCodec", field); }

    ok &= nativevalue_to_se(from.txPacketLossRate, field, ctx);
    if (ok) { obj->setProperty("txPacketLossRate", field); }

    ok &= nativevalue_to_se(from.audioDeviceDelay, field, ctx);
    if (ok) { obj->setProperty("audioDeviceDelay", field); }

    ok &= nativevalue_to_se(from.audioPlayoutDelay, field, ctx);
    if (ok) { obj->setProperty("audioPlayoutDelay", field); }

    ok &= nativevalue_to_se(from.earMonitorDelay, field, ctx);
    if (ok) { obj->setProperty("earMonitorDelay", field); }

    ok &= nativevalue_to_se(from.aecEstimatedDelay, field, ctx);
    if (ok) { obj->setProperty("aecEstimatedDelay", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RemoteAudioStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;
#define SET_FIELD(name) ok &= nativevalue_to_se(from.name, field, ctx); if (ok) { obj->setProperty(#name, field); }
    SET_FIELD(uid)
    SET_FIELD(quality)
    SET_FIELD(networkTransportDelay)
    SET_FIELD(jitterBufferDelay)
    SET_FIELD(audioLossRate)
    SET_FIELD(numChannels)
    SET_FIELD(receivedSampleRate)
    SET_FIELD(receivedBitrate)
    SET_FIELD(totalFrozenTime)
    SET_FIELD(frozenRate)
    SET_FIELD(mosValue)
    SET_FIELD(frozenRateByCustomPlcCount)
    SET_FIELD(plcCount)
    SET_FIELD(frozenCntByCustom)
    SET_FIELD(frozenTimeByCustom)
    SET_FIELD(totalActiveTime)
    SET_FIELD(publishDuration)
    SET_FIELD(qoeQuality)
    SET_FIELD(qualityChangedReason)
    SET_FIELD(rxAudioBytes)
    SET_FIELD(e2eDelay)
#undef SET_FIELD
    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LocalVideoStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;
#define SET_FIELD(name) ok &= nativevalue_to_se(from.name, field, ctx); if (ok) { obj->setProperty(#name, field); }
    SET_FIELD(uid)
    SET_FIELD(sentBitrate)
    SET_FIELD(sentFrameRate)
    SET_FIELD(captureFrameRate)
    SET_FIELD(captureFrameWidth)
    SET_FIELD(captureFrameHeight)
    SET_FIELD(regulatedCaptureFrameRate)
    SET_FIELD(regulatedCaptureFrameWidth)
    SET_FIELD(regulatedCaptureFrameHeight)
    SET_FIELD(encoderOutputFrameRate)
    SET_FIELD(encodedFrameWidth)
    SET_FIELD(encodedFrameHeight)
    SET_FIELD(rendererOutputFrameRate)
    SET_FIELD(targetBitrate)
    SET_FIELD(targetFrameRate)
    SET_FIELD(qualityAdaptIndication)
    SET_FIELD(encodedBitrate)
    SET_FIELD(encodedFrameCount)
    SET_FIELD(codecType)
    SET_FIELD(txPacketLossRate)
    SET_FIELD(captureBrightnessLevel)
    SET_FIELD(dualStreamEnabled)
    SET_FIELD(hwEncoderAccelerating)
    {
        se::HandleObject array(se::Object::createArrayObject(agora::rtc::SimulcastConfig::STREAM_LAYER_COUNT_MAX));
        for (size_t i = 0; i < agora::rtc::SimulcastConfig::STREAM_LAYER_COUNT_MAX; ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.simulcastDimensions[i], item, ctx);
            if (ok) { array->setArrayElement(static_cast<uint32_t>(i), item); }
        }
        field.setObject(array);
        if (ok) { obj->setProperty("simulcastDimensions", field); }
    }
    SET_FIELD(encodedFrameDepth)
#undef SET_FIELD
    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RemoteVideoStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.delay, field, ctx);
    if (ok) { obj->setProperty("delay", field); }

    ok &= nativevalue_to_se(from.e2eDelay, field, ctx);
    if (ok) { obj->setProperty("e2eDelay", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.receivedBitrate, field, ctx);
    if (ok) { obj->setProperty("receivedBitrate", field); }

    ok &= nativevalue_to_se(from.decoderInputFrameRate, field, ctx);
    if (ok) { obj->setProperty("decoderInputFrameRate", field); }

    ok &= nativevalue_to_se(from.decoderOutputFrameRate, field, ctx);
    if (ok) { obj->setProperty("decoderOutputFrameRate", field); }

    ok &= nativevalue_to_se(from.rendererOutputFrameRate, field, ctx);
    if (ok) { obj->setProperty("rendererOutputFrameRate", field); }

    ok &= nativevalue_to_se(from.frameLossRate, field, ctx);
    if (ok) { obj->setProperty("frameLossRate", field); }

    ok &= nativevalue_to_se(from.packetLossRate, field, ctx);
    if (ok) { obj->setProperty("packetLossRate", field); }

    ok &= nativevalue_to_se(from.rxStreamType, field, ctx);
    if (ok) { obj->setProperty("rxStreamType", field); }

    ok &= nativevalue_to_se(from.totalFrozenTime, field, ctx);
    if (ok) { obj->setProperty("totalFrozenTime", field); }

    ok &= nativevalue_to_se(from.frozenRate, field, ctx);
    if (ok) { obj->setProperty("frozenRate", field); }

    ok &= nativevalue_to_se(from.avSyncTimeMs, field, ctx);
    if (ok) { obj->setProperty("avSyncTimeMs", field); }

    ok &= nativevalue_to_se(from.totalActiveTime, field, ctx);
    if (ok) { obj->setProperty("totalActiveTime", field); }

    ok &= nativevalue_to_se(from.publishDuration, field, ctx);
    if (ok) { obj->setProperty("publishDuration", field); }

    ok &= nativevalue_to_se(from.mosValue, field, ctx);
    if (ok) { obj->setProperty("mosValue", field); }

    ok &= nativevalue_to_se(from.rxVideoBytes, field, ctx);
    if (ok) { obj->setProperty("rxVideoBytes", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ClientRoleOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.audienceLatencyLevel, field, ctx);
    if (ok) { obj->setProperty("audienceLatencyLevel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoRenderingTracingInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.elapsedTime, field, ctx);
    if (ok) { obj->setProperty("elapsedTime", field); }

    ok &= nativevalue_to_se(from.start2JoinChannel, field, ctx);
    if (ok) { obj->setProperty("start2JoinChannel", field); }

    ok &= nativevalue_to_se(from.join2JoinSuccess, field, ctx);
    if (ok) { obj->setProperty("join2JoinSuccess", field); }

    ok &= nativevalue_to_se(from.joinSuccess2RemoteJoined, field, ctx);
    if (ok) { obj->setProperty("joinSuccess2RemoteJoined", field); }

    ok &= nativevalue_to_se(from.remoteJoined2SetView, field, ctx);
    if (ok) { obj->setProperty("remoteJoined2SetView", field); }

    ok &= nativevalue_to_se(from.remoteJoined2UnmuteVideo, field, ctx);
    if (ok) { obj->setProperty("remoteJoined2UnmuteVideo", field); }

    ok &= nativevalue_to_se(from.remoteJoined2PacketReceived, field, ctx);
    if (ok) { obj->setProperty("remoteJoined2PacketReceived", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::MultipathStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.lanTxBytes, field, ctx);
    if (ok) { obj->setProperty("lanTxBytes", field); }

    ok &= nativevalue_to_se(from.lanRxBytes, field, ctx);
    if (ok) { obj->setProperty("lanRxBytes", field); }

    ok &= nativevalue_to_se(from.wifiTxBytes, field, ctx);
    if (ok) { obj->setProperty("wifiTxBytes", field); }

    ok &= nativevalue_to_se(from.wifiRxBytes, field, ctx);
    if (ok) { obj->setProperty("wifiRxBytes", field); }

    ok &= nativevalue_to_se(from.mobileTxBytes, field, ctx);
    if (ok) { obj->setProperty("mobileTxBytes", field); }

    ok &= nativevalue_to_se(from.mobileRxBytes, field, ctx);
    if (ok) { obj->setProperty("mobileRxBytes", field); }

    ok &= nativevalue_to_se(from.activePathNum, field, ctx);
    if (ok) { obj->setProperty("activePathNum", field); }

    // const PathStats* pathStats;
    // Pointer fields are intentionally left for a protected hand-written converter.

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::VideoLayout &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.strUid, field, ctx);
    if (ok) { obj->setProperty("strUid", field); }

    ok &= nativevalue_to_se(from.x, field, ctx);
    if (ok) { obj->setProperty("x", field); }

    ok &= nativevalue_to_se(from.y, field, ctx);
    if (ok) { obj->setProperty("y", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.videoState, field, ctx);
    if (ok) { obj->setProperty("videoState", field); }

    to.setObject(obj);
    return ok;
}
