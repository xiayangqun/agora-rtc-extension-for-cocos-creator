#include "RtcNativeValueToSe.h"

// ─────────────────────────────────────────────────────────────────────────────
// This file is AUTO-GENERATED. See RtcNativeValueToSe.h for instructions on
// protecting custom code with "// do not gen code cover it".
//
// Custom code between // USER CODE BLOCK START and // USER CODE BLOCK END is preserved.
// ─────────────────────────────────────────────────────────────────────────────

// AUTO-GENERATED IMPLEMENTATIONS START

bool nativevalue_to_se(const agora::base::AgoraServiceConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.enableAudioProcessor, field, ctx);
    if (ok) { obj->setProperty("enableAudioProcessor", field); }

    ok &= nativevalue_to_se(from.enableAudioDevice, field, ctx);
    if (ok) { obj->setProperty("enableAudioDevice", field); }

    ok &= nativevalue_to_se(from.enableVideo, field, ctx);
    if (ok) { obj->setProperty("enableVideo", field); }

    // void* context;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.appId, field, ctx);
    if (ok) { obj->setProperty("appId", field); }

    ok &= nativevalue_to_se(from.areaCode, field, ctx);
    if (ok) { obj->setProperty("areaCode", field); }

    ok &= nativevalue_to_se(from.channelProfile, field, ctx);
    if (ok) { obj->setProperty("channelProfile", field); }

    ok &= nativevalue_to_se(from.license, field, ctx);
    if (ok) { obj->setProperty("license", field); }

    ok &= nativevalue_to_se(from.audioScenario, field, ctx);
    if (ok) { obj->setProperty("audioScenario", field); }

    ok &= nativevalue_to_se(from.logConfig, field, ctx);
    if (ok) { obj->setProperty("logConfig", field); }

    ok &= nativevalue_to_se(from.useStringUid, field, ctx);
    if (ok) { obj->setProperty("useStringUid", field); }

    // IServiceObserver* serviceObserver;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.threadPriority, field, ctx);
    if (ok) { obj->setProperty("threadPriority", field); }

    ok &= nativevalue_to_se(from.useExternalEglContext, field, ctx);
    if (ok) { obj->setProperty("useExternalEglContext", field); }

    ok &= nativevalue_to_se(from.domainLimit, field, ctx);
    if (ok) { obj->setProperty("domainLimit", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::base::SyncConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.appId, field, ctx);
    if (ok) { obj->setProperty("appId", field); }

    ok &= nativevalue_to_se(from.shakehand_interval, field, ctx);
    if (ok) { obj->setProperty("shakehand_interval", field); }

    ok &= nativevalue_to_se(from.connection_timeout, field, ctx);
    if (ok) { obj->setProperty("connection_timeout", field); }

    ok &= nativevalue_to_se(from.compact_interval, field, ctx);
    if (ok) { obj->setProperty("compact_interval", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::commons::LogConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.filePath, field, ctx);
    if (ok) { obj->setProperty("filePath", field); }

    ok &= nativevalue_to_se(from.fileSizeInKB, field, ctx);
    if (ok) { obj->setProperty("fileSizeInKB", field); }

    ok &= nativevalue_to_se(from.level, field, ctx);
    if (ok) { obj->setProperty("level", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::DataChannelConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.syncWithMedia, field, ctx);
    if (ok) { obj->setProperty("syncWithMedia", field); }

    ok &= nativevalue_to_se(from.ordered, field, ctx);
    if (ok) { obj->setProperty("ordered", field); }

    ok &= nativevalue_to_se(from.compressionLength, field, ctx);
    if (ok) { obj->setProperty("compressionLength", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.priority, field, ctx);
    if (ok) { obj->setProperty("priority", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::DataChannelInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.dataChannelId, field, ctx);
    if (ok) { obj->setProperty("dataChannelId", field); }

    ok &= nativevalue_to_se(from.metadata, field, ctx);
    if (ok) { obj->setProperty("metadata", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::AudioSpectrumData &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    // const float* audioSpectrumData;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.dataLength, field, ctx);
    if (ok) { obj->setProperty("dataLength", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::AudioEncodedFrameInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.sendTs, field, ctx);
    if (ok) { obj->setProperty("sendTs", field); }

    ok &= nativevalue_to_se(from.codec, field, ctx);
    if (ok) { obj->setProperty("codec", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::CacheStatistics &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.fileSize, field, ctx);
    if (ok) { obj->setProperty("fileSize", field); }

    ok &= nativevalue_to_se(from.cacheSize, field, ctx);
    if (ok) { obj->setProperty("cacheSize", field); }

    ok &= nativevalue_to_se(from.downloadSize, field, ctx);
    if (ok) { obj->setProperty("downloadSize", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::ColorSpace &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.primaries, field, ctx);
    if (ok) { obj->setProperty("primaries", field); }

    ok &= nativevalue_to_se(from.transfer, field, ctx);
    if (ok) { obj->setProperty("transfer", field); }

    ok &= nativevalue_to_se(from.matrix, field, ctx);
    if (ok) { obj->setProperty("matrix", field); }

    ok &= nativevalue_to_se(from.range, field, ctx);
    if (ok) { obj->setProperty("range", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::ExternalVideoFrame &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.format, field, ctx);
    if (ok) { obj->setProperty("format", field); }

    // void* buffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.stride, field, ctx);
    if (ok) { obj->setProperty("stride", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.cropLeft, field, ctx);
    if (ok) { obj->setProperty("cropLeft", field); }

    ok &= nativevalue_to_se(from.cropTop, field, ctx);
    if (ok) { obj->setProperty("cropTop", field); }

    ok &= nativevalue_to_se(from.cropRight, field, ctx);
    if (ok) { obj->setProperty("cropRight", field); }

    ok &= nativevalue_to_se(from.cropBottom, field, ctx);
    if (ok) { obj->setProperty("cropBottom", field); }

    ok &= nativevalue_to_se(from.rotation, field, ctx);
    if (ok) { obj->setProperty("rotation", field); }

    ok &= nativevalue_to_se(from.timestamp, field, ctx);
    if (ok) { obj->setProperty("timestamp", field); }

    // void* eglContext;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.eglType, field, ctx);
    if (ok) { obj->setProperty("eglType", field); }

    ok &= nativevalue_to_se(from.textureId, field, ctx);
    if (ok) { obj->setProperty("textureId", field); }

    ok &= nativevalue_to_se(from.fenceObject, field, ctx);
    if (ok) { obj->setProperty("fenceObject", field); }

    {
        se::HandleObject array(se::Object::createArrayObject(16));
        for (uint32_t i = 0; i < static_cast<uint32_t>(16); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.matrix[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("matrix", se::Value(array));
    }

    // uint8_t* metadataBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.metadataSize, field, ctx);
    if (ok) { obj->setProperty("metadataSize", field); }

    // uint8_t* alphaBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.fillAlphaBuffer, field, ctx);
    if (ok) { obj->setProperty("fillAlphaBuffer", field); }

    ok &= nativevalue_to_se(from.alphaStitchMode, field, ctx);
    if (ok) { obj->setProperty("alphaStitchMode", field); }

    // void *d3d11Texture2d;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.textureSliceIndex, field, ctx);
    if (ok) { obj->setProperty("textureSliceIndex", field); }

    ok &= nativevalue_to_se(from.hdr10MetadataInfo, field, ctx);
    if (ok) { obj->setProperty("hdr10MetadataInfo", field); }

    ok &= nativevalue_to_se(from.colorSpace, field, ctx);
    if (ok) { obj->setProperty("colorSpace", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::Hdr10MetadataInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.redPrimaryX, field, ctx);
    if (ok) { obj->setProperty("redPrimaryX", field); }

    ok &= nativevalue_to_se(from.redPrimaryY, field, ctx);
    if (ok) { obj->setProperty("redPrimaryY", field); }

    ok &= nativevalue_to_se(from.greenPrimaryX, field, ctx);
    if (ok) { obj->setProperty("greenPrimaryX", field); }

    ok &= nativevalue_to_se(from.greenPrimaryY, field, ctx);
    if (ok) { obj->setProperty("greenPrimaryY", field); }

    ok &= nativevalue_to_se(from.bluePrimaryX, field, ctx);
    if (ok) { obj->setProperty("bluePrimaryX", field); }

    ok &= nativevalue_to_se(from.bluePrimaryY, field, ctx);
    if (ok) { obj->setProperty("bluePrimaryY", field); }

    ok &= nativevalue_to_se(from.whitePointX, field, ctx);
    if (ok) { obj->setProperty("whitePointX", field); }

    ok &= nativevalue_to_se(from.whitePointY, field, ctx);
    if (ok) { obj->setProperty("whitePointY", field); }

    ok &= nativevalue_to_se(from.maxMasteringLuminance, field, ctx);
    if (ok) { obj->setProperty("maxMasteringLuminance", field); }

    ok &= nativevalue_to_se(from.minMasteringLuminance, field, ctx);
    if (ok) { obj->setProperty("minMasteringLuminance", field); }

    ok &= nativevalue_to_se(from.maxContentLightLevel, field, ctx);
    if (ok) { obj->setProperty("maxContentLightLevel", field); }

    ok &= nativevalue_to_se(from.maxFrameAverageLightLevel, field, ctx);
    if (ok) { obj->setProperty("maxFrameAverageLightLevel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::MediaSource &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.url, field, ctx);
    if (ok) { obj->setProperty("url", field); }

    ok &= nativevalue_to_se(from.uri, field, ctx);
    if (ok) { obj->setProperty("uri", field); }

    ok &= nativevalue_to_se(from.startPos, field, ctx);
    if (ok) { obj->setProperty("startPos", field); }

    ok &= nativevalue_to_se(from.autoPlay, field, ctx);
    if (ok) { obj->setProperty("autoPlay", field); }

    ok &= nativevalue_to_se(from.enableCache, field, ctx);
    if (ok) { obj->setProperty("enableCache", field); }

    ok &= nativevalue_to_se(from.enableMultiAudioTrack, field, ctx);
    if (ok) { obj->setProperty("enableMultiAudioTrack", field); }

    ok &= nativevalue_to_se(from.isAgoraSource, field, ctx);
    if (ok) { obj->setProperty("isAgoraSource", field); }

    ok &= nativevalue_to_se(from.isLiveSource, field, ctx);
    if (ok) { obj->setProperty("isLiveSource", field); }

    // IMediaPlayerCustomDataProvider* provider;
    // Pointer fields are intentionally left for a protected hand-written converter.

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::PacketOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.timestamp, field, ctx);
    if (ok) { obj->setProperty("timestamp", field); }

    ok &= nativevalue_to_se(from.audioLevelIndication, field, ctx);
    if (ok) { obj->setProperty("audioLevelIndication", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::PlayerPlaybackStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.videoFps, field, ctx);
    if (ok) { obj->setProperty("videoFps", field); }

    ok &= nativevalue_to_se(from.videoBitrateInKbps, field, ctx);
    if (ok) { obj->setProperty("videoBitrateInKbps", field); }

    ok &= nativevalue_to_se(from.audioBitrateInKbps, field, ctx);
    if (ok) { obj->setProperty("audioBitrateInKbps", field); }

    ok &= nativevalue_to_se(from.totalBitrateInKbps, field, ctx);
    if (ok) { obj->setProperty("totalBitrateInKbps", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::PlayerStreamInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.streamIndex, field, ctx);
    if (ok) { obj->setProperty("streamIndex", field); }

    ok &= nativevalue_to_se(from.streamType, field, ctx);
    if (ok) { obj->setProperty("streamType", field); }

    obj->setProperty("codecName", se::Value(from.codecName));

    obj->setProperty("language", se::Value(from.language));

    ok &= nativevalue_to_se(from.videoFrameRate, field, ctx);
    if (ok) { obj->setProperty("videoFrameRate", field); }

    ok &= nativevalue_to_se(from.videoBitRate, field, ctx);
    if (ok) { obj->setProperty("videoBitRate", field); }

    ok &= nativevalue_to_se(from.videoWidth, field, ctx);
    if (ok) { obj->setProperty("videoWidth", field); }

    ok &= nativevalue_to_se(from.videoHeight, field, ctx);
    if (ok) { obj->setProperty("videoHeight", field); }

    ok &= nativevalue_to_se(from.videoRotation, field, ctx);
    if (ok) { obj->setProperty("videoRotation", field); }

    ok &= nativevalue_to_se(from.audioSampleRate, field, ctx);
    if (ok) { obj->setProperty("audioSampleRate", field); }

    ok &= nativevalue_to_se(from.audioChannels, field, ctx);
    if (ok) { obj->setProperty("audioChannels", field); }

    ok &= nativevalue_to_se(from.audioBitsPerSample, field, ctx);
    if (ok) { obj->setProperty("audioBitsPerSample", field); }

    ok &= nativevalue_to_se(from.duration, field, ctx);
    if (ok) { obj->setProperty("duration", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::PlayerUpdatedInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.internalPlayerUuid, field, ctx);
    if (ok) { obj->setProperty("internalPlayerUuid", field); }

    ok &= nativevalue_to_se(from.deviceId, field, ctx);
    if (ok) { obj->setProperty("deviceId", field); }

    ok &= nativevalue_to_se(from.videoHeight, field, ctx);
    if (ok) { obj->setProperty("videoHeight", field); }

    ok &= nativevalue_to_se(from.videoWidth, field, ctx);
    if (ok) { obj->setProperty("videoWidth", field); }

    ok &= nativevalue_to_se(from.audioSampleRate, field, ctx);
    if (ok) { obj->setProperty("audioSampleRate", field); }

    ok &= nativevalue_to_se(from.audioChannels, field, ctx);
    if (ok) { obj->setProperty("audioChannels", field); }

    ok &= nativevalue_to_se(from.audioBitsPerSample, field, ctx);
    if (ok) { obj->setProperty("audioBitsPerSample", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::SrcInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.bitrateInKbps, field, ctx);
    if (ok) { obj->setProperty("bitrateInKbps", field); }

    ok &= nativevalue_to_se(from.name, field, ctx);
    if (ok) { obj->setProperty("name", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::base::VideoFrame &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.yStride, field, ctx);
    if (ok) { obj->setProperty("yStride", field); }

    ok &= nativevalue_to_se(from.uStride, field, ctx);
    if (ok) { obj->setProperty("uStride", field); }

    ok &= nativevalue_to_se(from.vStride, field, ctx);
    if (ok) { obj->setProperty("vStride", field); }

    // uint8_t* yBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    // uint8_t* uBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    // uint8_t* vBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.rotation, field, ctx);
    if (ok) { obj->setProperty("rotation", field); }

    ok &= nativevalue_to_se(from.renderTimeMs, field, ctx);
    if (ok) { obj->setProperty("renderTimeMs", field); }

    ok &= nativevalue_to_se(from.avsync_type, field, ctx);
    if (ok) { obj->setProperty("avsync_type", field); }

    // uint8_t* metadata_buffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.metadata_size, field, ctx);
    if (ok) { obj->setProperty("metadata_size", field); }

    // void* sharedContext;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.textureId, field, ctx);
    if (ok) { obj->setProperty("textureId", field); }

    // void* d3d11Texture2d;
    // Pointer fields are intentionally left for a protected hand-written converter.

    {
        se::HandleObject array(se::Object::createArrayObject(16));
        for (uint32_t i = 0; i < static_cast<uint32_t>(16); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.matrix[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("matrix", se::Value(array));
    }

    // uint8_t* alphaBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.alphaStitchMode, field, ctx);
    if (ok) { obj->setProperty("alphaStitchMode", field); }

    // void* pixelBuffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    // IVideoFrameMetaInfo* metaInfo;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.hdr10MetadataInfo, field, ctx);
    if (ok) { obj->setProperty("hdr10MetadataInfo", field); }

    ok &= nativevalue_to_se(from.colorSpace, field, ctx);
    if (ok) { obj->setProperty("colorSpace", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::ContentInspectConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.extraInfo, field, ctx);
    if (ok) { obj->setProperty("extraInfo", field); }

    ok &= nativevalue_to_se(from.serverConfig, field, ctx);
    if (ok) { obj->setProperty("serverConfig", field); }

    {
        se::HandleObject array(se::Object::createArrayObject(MAX_CONTENT_INSPECT_MODULE_COUNT));
        for (uint32_t i = 0; i < static_cast<uint32_t>(MAX_CONTENT_INSPECT_MODULE_COUNT); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.modules[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("modules", se::Value(array));
    }

    ok &= nativevalue_to_se(from.moduleCount, field, ctx);
    if (ok) { obj->setProperty("moduleCount", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::ContentInspectModule &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.interval, field, ctx);
    if (ok) { obj->setProperty("interval", field); }

    ok &= nativevalue_to_se(from.position, field, ctx);
    if (ok) { obj->setProperty("position", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::MediaRecorderConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.storagePath, field, ctx);
    if (ok) { obj->setProperty("storagePath", field); }

    ok &= nativevalue_to_se(from.containerFormat, field, ctx);
    if (ok) { obj->setProperty("containerFormat", field); }

    ok &= nativevalue_to_se(from.streamType, field, ctx);
    if (ok) { obj->setProperty("streamType", field); }

    ok &= nativevalue_to_se(from.maxDurationMs, field, ctx);
    if (ok) { obj->setProperty("maxDurationMs", field); }

    ok &= nativevalue_to_se(from.recorderInfoUpdateInterval, field, ctx);
    if (ok) { obj->setProperty("recorderInfoUpdateInterval", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.fps, field, ctx);
    if (ok) { obj->setProperty("fps", field); }

    ok &= nativevalue_to_se(from.sample_rate, field, ctx);
    if (ok) { obj->setProperty("sample_rate", field); }

    ok &= nativevalue_to_se(from.channel_num, field, ctx);
    if (ok) { obj->setProperty("channel_num", field); }

    ok &= nativevalue_to_se(from.videoSourceType, field, ctx);
    if (ok) { obj->setProperty("videoSourceType", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::RecorderInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.fileName, field, ctx);
    if (ok) { obj->setProperty("fileName", field); }

    ok &= nativevalue_to_se(from.durationMs, field, ctx);
    if (ok) { obj->setProperty("durationMs", field); }

    ok &= nativevalue_to_se(from.fileSize, field, ctx);
    if (ok) { obj->setProperty("fileSize", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::SnapshotConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.filePath, field, ctx);
    if (ok) { obj->setProperty("filePath", field); }

    ok &= nativevalue_to_se(from.position, field, ctx);
    if (ok) { obj->setProperty("position", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::media::UserAudioSpectrumInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.spectrumData, field, ctx);
    if (ok) { obj->setProperty("spectrumData", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AdvancedAudioOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.audioProcessingChannels, field, ctx);
    if (ok) { obj->setProperty("audioProcessingChannels", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AdvancedConfigInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.logUploadServer, field, ctx);
    if (ok) { obj->setProperty("logUploadServer", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AdvanceOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.encodingPreference, field, ctx);
    if (ok) { obj->setProperty("encodingPreference", field); }

    ok &= nativevalue_to_se(from.compressionPreference, field, ctx);
    if (ok) { obj->setProperty("compressionPreference", field); }

    ok &= nativevalue_to_se(from.encodeAlpha, field, ctx);
    if (ok) { obj->setProperty("encodeAlpha", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AgoraRhythmPlayerConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.beatsPerMeasure, field, ctx);
    if (ok) { obj->setProperty("beatsPerMeasure", field); }

    ok &= nativevalue_to_se(from.beatsPerMinute, field, ctx);
    if (ok) { obj->setProperty("beatsPerMinute", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AlphaChannel &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    // uint8_t* data;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.size, field, ctx);
    if (ok) { obj->setProperty("size", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioDeviceInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    obj->setProperty("deviceName", se::Value(from.deviceName));

    obj->setProperty("deviceTypeName", se::Value(from.deviceTypeName));

    obj->setProperty("deviceId", se::Value(from.deviceId));

    ok &= nativevalue_to_se(from.isCurrentSelected, field, ctx);
    if (ok) { obj->setProperty("isCurrentSelected", field); }

    ok &= nativevalue_to_se(from.isPlayoutDevice, field, ctx);
    if (ok) { obj->setProperty("isPlayoutDevice", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioEncFrameRecvParams &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.receive_mode, field, ctx);
    if (ok) { obj->setProperty("receive_mode", field); }

    ok &= nativevalue_to_se(from.target_codec, field, ctx);
    if (ok) { obj->setProperty("target_codec", field); }

    ok &= nativevalue_to_se(from.target_sample_rate, field, ctx);
    if (ok) { obj->setProperty("target_sample_rate", field); }

    ok &= nativevalue_to_se(from.target_num_channels, field, ctx);
    if (ok) { obj->setProperty("target_num_channels", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioEncodedFrameObserverConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.postionType, field, ctx);
    if (ok) { obj->setProperty("postionType", field); }

    ok &= nativevalue_to_se(from.encodingType, field, ctx);
    if (ok) { obj->setProperty("encodingType", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioEncoderConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.audioProfile, field, ctx);
    if (ok) { obj->setProperty("audioProfile", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioRecordingConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.filePath, field, ctx);
    if (ok) { obj->setProperty("filePath", field); }

    ok &= nativevalue_to_se(from.encode, field, ctx);
    if (ok) { obj->setProperty("encode", field); }

    ok &= nativevalue_to_se(from.sampleRate, field, ctx);
    if (ok) { obj->setProperty("sampleRate", field); }

    ok &= nativevalue_to_se(from.fileRecordingType, field, ctx);
    if (ok) { obj->setProperty("fileRecordingType", field); }

    ok &= nativevalue_to_se(from.quality, field, ctx);
    if (ok) { obj->setProperty("quality", field); }

    ok &= nativevalue_to_se(from.recordingChannel, field, ctx);
    if (ok) { obj->setProperty("recordingChannel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::AudioTrackConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.enableLocalPlayback, field, ctx);
    if (ok) { obj->setProperty("enableLocalPlayback", field); }

    ok &= nativevalue_to_se(from.enableAudioProcessing, field, ctx);
    if (ok) { obj->setProperty("enableAudioProcessing", field); }

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

bool nativevalue_to_se(const agora::rtc::AudioVolumeInformation &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.userId, field, ctx);
    if (ok) { obj->setProperty("userId", field); }

    ok &= nativevalue_to_se(from.volume, field, ctx);
    if (ok) { obj->setProperty("volume", field); }

    ok &= nativevalue_to_se(from.vad, field, ctx);
    if (ok) { obj->setProperty("vad", field); }

    ok &= nativevalue_to_se(from.voicePitch, field, ctx);
    if (ok) { obj->setProperty("voicePitch", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::BeautyOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.lighteningContrastLevel, field, ctx);
    if (ok) { obj->setProperty("lighteningContrastLevel", field); }

    ok &= nativevalue_to_se(from.lighteningLevel, field, ctx);
    if (ok) { obj->setProperty("lighteningLevel", field); }

    ok &= nativevalue_to_se(from.smoothnessLevel, field, ctx);
    if (ok) { obj->setProperty("smoothnessLevel", field); }

    ok &= nativevalue_to_se(from.rednessLevel, field, ctx);
    if (ok) { obj->setProperty("rednessLevel", field); }

    ok &= nativevalue_to_se(from.sharpnessLevel, field, ctx);
    if (ok) { obj->setProperty("sharpnessLevel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ChannelMediaInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.channelName, field, ctx);
    if (ok) { obj->setProperty("channelName", field); }

    ok &= nativevalue_to_se(from.token, field, ctx);
    if (ok) { obj->setProperty("token", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ChannelMediaRelayConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    // ChannelMediaInfo* srcInfo;
    // Pointer fields are intentionally left for a protected hand-written converter.

    // ChannelMediaInfo* destInfos;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.destCount, field, ctx);
    if (ok) { obj->setProperty("destCount", field); }

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

bool nativevalue_to_se(const agora::rtc::ClimaxSegment &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.startTimeMs, field, ctx);
    if (ok) { obj->setProperty("startTimeMs", field); }

    ok &= nativevalue_to_se(from.endTimeMs, field, ctx);
    if (ok) { obj->setProperty("endTimeMs", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::CodecCapInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.codecType, field, ctx);
    if (ok) { obj->setProperty("codecType", field); }

    ok &= nativevalue_to_se(from.codecCapMask, field, ctx);
    if (ok) { obj->setProperty("codecCapMask", field); }

    ok &= nativevalue_to_se(from.codecLevels, field, ctx);
    if (ok) { obj->setProperty("codecLevels", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::CodecCapLevels &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.hwDecodingLevel, field, ctx);
    if (ok) { obj->setProperty("hwDecodingLevel", field); }

    ok &= nativevalue_to_se(from.swDecodingLevel, field, ctx);
    if (ok) { obj->setProperty("swDecodingLevel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ColorEnhanceOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.strengthLevel, field, ctx);
    if (ok) { obj->setProperty("strengthLevel", field); }

    ok &= nativevalue_to_se(from.skinProtectLevel, field, ctx);
    if (ok) { obj->setProperty("skinProtectLevel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::DataStreamConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.syncWithAudio, field, ctx);
    if (ok) { obj->setProperty("syncWithAudio", field); }

    ok &= nativevalue_to_se(from.ordered, field, ctx);
    if (ok) { obj->setProperty("ordered", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::DeviceInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.isLowLatencyAudioSupported, field, ctx);
    if (ok) { obj->setProperty("isLowLatencyAudioSupported", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::DirectCdnStreamingMediaOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.publishCameraTrack, field, ctx);
    if (ok) { obj->setProperty("publishCameraTrack", field); }

    ok &= nativevalue_to_se(from.publishMicrophoneTrack, field, ctx);
    if (ok) { obj->setProperty("publishMicrophoneTrack", field); }

    ok &= nativevalue_to_se(from.publishCustomAudioTrack, field, ctx);
    if (ok) { obj->setProperty("publishCustomAudioTrack", field); }

    ok &= nativevalue_to_se(from.publishCustomVideoTrack, field, ctx);
    if (ok) { obj->setProperty("publishCustomVideoTrack", field); }

    ok &= nativevalue_to_se(from.publishMediaPlayerAudioTrack, field, ctx);
    if (ok) { obj->setProperty("publishMediaPlayerAudioTrack", field); }

    ok &= nativevalue_to_se(from.publishMediaPlayerId, field, ctx);
    if (ok) { obj->setProperty("publishMediaPlayerId", field); }

    ok &= nativevalue_to_se(from.customVideoTrackId, field, ctx);
    if (ok) { obj->setProperty("customVideoTrackId", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::DirectCdnStreamingStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.videoWidth, field, ctx);
    if (ok) { obj->setProperty("videoWidth", field); }

    ok &= nativevalue_to_se(from.videoHeight, field, ctx);
    if (ok) { obj->setProperty("videoHeight", field); }

    ok &= nativevalue_to_se(from.fps, field, ctx);
    if (ok) { obj->setProperty("fps", field); }

    ok &= nativevalue_to_se(from.videoBitrate, field, ctx);
    if (ok) { obj->setProperty("videoBitrate", field); }

    ok &= nativevalue_to_se(from.audioBitrate, field, ctx);
    if (ok) { obj->setProperty("audioBitrate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::DownlinkNetworkInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    // struct PeerDownlinkInfo { /** * The ID of the user who owns the remote video stream. */ const char* userId; /** * The remote video stream type: #VIDEO_STREAM_TYPE. */ VIDEO_STREAM_TYPE stream_type; /** * The remote video downscale type: #REMOTE_VIDEO_DOWNSCALE_LEVEL. */ REMOTE_VIDEO_DOWNSCALE_LEVEL current_downscale_level; /** * The expected bitrate in bps. */ int expected_bitrate_bps; PeerDownlinkInfo() : userId(OPTIONAL_NULLPTR), stream_type(VIDEO_STREAM_HIGH), current_downscale_level(REMOTE_VIDEO_DOWNSCALE_LEVEL_NONE), expected_bitrate_bps(-1) {} PeerDownlinkInfo(const PeerDownlinkInfo& rhs) : stream_type(rhs.stream_type), current_downscale_level(rhs.current_downscale_level), expected_bitrate_bps(rhs.expected_bitrate_bps) { if (rhs.userId != OPTIONAL_NULLPTR) { const size_t len = std::strlen(rhs.userId); char* buf = new char[len + 1]; std::memcpy(buf, rhs.userId, len); buf[len] = '\0'; userId = buf; } } PeerDownlinkInfo& operator=(const PeerDownlinkInfo& rhs) { if (this == &rhs) return *this; userId = OPTIONAL_NULLPTR; stream_type = rhs.stream_type; current_downscale_level = rhs.current_downscale_level; expected_bitrate_bps = rhs.expected_bitrate_bps; if (rhs.userId != OPTIONAL_NULLPTR) { const size_t len = std::strlen(rhs.userId); char* buf = new char[len + 1]; std::memcpy(buf, rhs.userId, len); buf[len] = '\0'; userId = buf; } return *this; } ~PeerDownlinkInfo() { delete[] userId; } };
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.lastmile_buffer_delay_time_ms, field, ctx);
    if (ok) { obj->setProperty("lastmile_buffer_delay_time_ms", field); }

    ok &= nativevalue_to_se(from.bandwidth_estimation_bps, field, ctx);
    if (ok) { obj->setProperty("bandwidth_estimation_bps", field); }

    ok &= nativevalue_to_se(from.total_downscale_level_count, field, ctx);
    if (ok) { obj->setProperty("total_downscale_level_count", field); }

    // PeerDownlinkInfo* peer_downlink_info;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.total_received_video_count, field, ctx);
    if (ok) { obj->setProperty("total_received_video_count", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::EchoTestConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.view, field, ctx);
    if (ok) { obj->setProperty("view", field); }

    ok &= nativevalue_to_se(from.enableAudio, field, ctx);
    if (ok) { obj->setProperty("enableAudio", field); }

    ok &= nativevalue_to_se(from.enableVideo, field, ctx);
    if (ok) { obj->setProperty("enableVideo", field); }

    ok &= nativevalue_to_se(from.token, field, ctx);
    if (ok) { obj->setProperty("token", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.intervalInSeconds, field, ctx);
    if (ok) { obj->setProperty("intervalInSeconds", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::EncodedAudioFrameAdvancedSettings &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.speech, field, ctx);
    if (ok) { obj->setProperty("speech", field); }

    ok &= nativevalue_to_se(from.sendEvenIfEmpty, field, ctx);
    if (ok) { obj->setProperty("sendEvenIfEmpty", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::EncodedAudioFrameInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.codec, field, ctx);
    if (ok) { obj->setProperty("codec", field); }

    ok &= nativevalue_to_se(from.sampleRateHz, field, ctx);
    if (ok) { obj->setProperty("sampleRateHz", field); }

    ok &= nativevalue_to_se(from.samplesPerChannel, field, ctx);
    if (ok) { obj->setProperty("samplesPerChannel", field); }

    ok &= nativevalue_to_se(from.numberOfChannels, field, ctx);
    if (ok) { obj->setProperty("numberOfChannels", field); }

    ok &= nativevalue_to_se(from.advancedSettings, field, ctx);
    if (ok) { obj->setProperty("advancedSettings", field); }

    ok &= nativevalue_to_se(from.captureTimeMs, field, ctx);
    if (ok) { obj->setProperty("captureTimeMs", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::EncodedVideoFrameInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.codecType, field, ctx);
    if (ok) { obj->setProperty("codecType", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.framesPerSecond, field, ctx);
    if (ok) { obj->setProperty("framesPerSecond", field); }

    ok &= nativevalue_to_se(from.frameType, field, ctx);
    if (ok) { obj->setProperty("frameType", field); }

    ok &= nativevalue_to_se(from.rotation, field, ctx);
    if (ok) { obj->setProperty("rotation", field); }

    ok &= nativevalue_to_se(from.trackId, field, ctx);
    if (ok) { obj->setProperty("trackId", field); }

    ok &= nativevalue_to_se(from.captureTimeMs, field, ctx);
    if (ok) { obj->setProperty("captureTimeMs", field); }

    ok &= nativevalue_to_se(from.decodeTimeMs, field, ctx);
    if (ok) { obj->setProperty("decodeTimeMs", field); }

    ok &= nativevalue_to_se(from.streamType, field, ctx);
    if (ok) { obj->setProperty("streamType", field); }

    ok &= nativevalue_to_se(from.presentationMs, field, ctx);
    if (ok) { obj->setProperty("presentationMs", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::EncryptionConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.encryptionMode, field, ctx);
    if (ok) { obj->setProperty("encryptionMode", field); }

    ok &= nativevalue_to_se(from.encryptionKey, field, ctx);
    if (ok) { obj->setProperty("encryptionKey", field); }

    {
        se::HandleObject array(se::Object::createArrayObject(32));
        for (uint32_t i = 0; i < static_cast<uint32_t>(32); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.encryptionKdfSalt[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("encryptionKdfSalt", se::Value(array));
    }

    ok &= nativevalue_to_se(from.datastreamEncryptionEnabled, field, ctx);
    if (ok) { obj->setProperty("datastreamEncryptionEnabled", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ExtensionContext &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.isValid, field, ctx);
    if (ok) { obj->setProperty("isValid", field); }

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.providerName, field, ctx);
    if (ok) { obj->setProperty("providerName", field); }

    ok &= nativevalue_to_se(from.extensionName, field, ctx);
    if (ok) { obj->setProperty("extensionName", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ExtensionInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.mediaSourceType, field, ctx);
    if (ok) { obj->setProperty("mediaSourceType", field); }

    ok &= nativevalue_to_se(from.remoteUid, field, ctx);
    if (ok) { obj->setProperty("remoteUid", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.localUid, field, ctx);
    if (ok) { obj->setProperty("localUid", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ExtensionVersion &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.major_v, field, ctx);
    if (ok) { obj->setProperty("major_v", field); }

    ok &= nativevalue_to_se(from.minor_v, field, ctx);
    if (ok) { obj->setProperty("minor_v", field); }

    ok &= nativevalue_to_se(from.micro_v, field, ctx);
    if (ok) { obj->setProperty("micro_v", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::FaceShapeAreaOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.shapeArea, field, ctx);
    if (ok) { obj->setProperty("shapeArea", field); }

    ok &= nativevalue_to_se(from.shapeIntensity, field, ctx);
    if (ok) { obj->setProperty("shapeIntensity", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::FaceShapeBeautyOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.shapeStyle, field, ctx);
    if (ok) { obj->setProperty("shapeStyle", field); }

    ok &= nativevalue_to_se(from.styleIntensity, field, ctx);
    if (ok) { obj->setProperty("styleIntensity", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::FilterEffectOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.path, field, ctx);
    if (ok) { obj->setProperty("path", field); }

    ok &= nativevalue_to_se(from.strength, field, ctx);
    if (ok) { obj->setProperty("strength", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::FocalLengthInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.cameraDirection, field, ctx);
    if (ok) { obj->setProperty("cameraDirection", field); }

    ok &= nativevalue_to_se(from.focalLengthType, field, ctx);
    if (ok) { obj->setProperty("focalLengthType", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ImagePayloadData &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.seqid, field, ctx);
    if (ok) { obj->setProperty("seqid", field); }

    ok &= nativevalue_to_se(from.size, field, ctx);
    if (ok) { obj->setProperty("size", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.timestamp, field, ctx);
    if (ok) { obj->setProperty("timestamp", field); }

    // uint8_t* buffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    // void* privdata;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.privsize, field, ctx);
    if (ok) { obj->setProperty("privsize", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ImageTrackOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.imageUrl, field, ctx);
    if (ok) { obj->setProperty("imageUrl", field); }

    ok &= nativevalue_to_se(from.fps, field, ctx);
    if (ok) { obj->setProperty("fps", field); }

    ok &= nativevalue_to_se(from.mirrorMode, field, ctx);
    if (ok) { obj->setProperty("mirrorMode", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::InjectStreamConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.videoGop, field, ctx);
    if (ok) { obj->setProperty("videoGop", field); }

    ok &= nativevalue_to_se(from.videoFramerate, field, ctx);
    if (ok) { obj->setProperty("videoFramerate", field); }

    ok &= nativevalue_to_se(from.videoBitrate, field, ctx);
    if (ok) { obj->setProperty("videoBitrate", field); }

    ok &= nativevalue_to_se(from.audioSampleRate, field, ctx);
    if (ok) { obj->setProperty("audioSampleRate", field); }

    ok &= nativevalue_to_se(from.audioBitrate, field, ctx);
    if (ok) { obj->setProperty("audioBitrate", field); }

    ok &= nativevalue_to_se(from.audioChannels, field, ctx);
    if (ok) { obj->setProperty("audioChannels", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::InputSeiData &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.timestamp, field, ctx);
    if (ok) { obj->setProperty("timestamp", field); }

    ok &= nativevalue_to_se(from.frame_index, field, ctx);
    if (ok) { obj->setProperty("frame_index", field); }

    // uint8_t* private_data;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.data_size, field, ctx);
    if (ok) { obj->setProperty("data_size", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LastmileProbeConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.probeUplink, field, ctx);
    if (ok) { obj->setProperty("probeUplink", field); }

    ok &= nativevalue_to_se(from.probeDownlink, field, ctx);
    if (ok) { obj->setProperty("probeDownlink", field); }

    ok &= nativevalue_to_se(from.expectedUplinkBitrate, field, ctx);
    if (ok) { obj->setProperty("expectedUplinkBitrate", field); }

    ok &= nativevalue_to_se(from.expectedDownlinkBitrate, field, ctx);
    if (ok) { obj->setProperty("expectedDownlinkBitrate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LastmileProbeOneWayResult &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.packetLossRate, field, ctx);
    if (ok) { obj->setProperty("packetLossRate", field); }

    ok &= nativevalue_to_se(from.jitter, field, ctx);
    if (ok) { obj->setProperty("jitter", field); }

    ok &= nativevalue_to_se(from.availableBandwidth, field, ctx);
    if (ok) { obj->setProperty("availableBandwidth", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LastmileProbeResult &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.state, field, ctx);
    if (ok) { obj->setProperty("state", field); }

    ok &= nativevalue_to_se(from.uplinkReport, field, ctx);
    if (ok) { obj->setProperty("uplinkReport", field); }

    ok &= nativevalue_to_se(from.downlinkReport, field, ctx);
    if (ok) { obj->setProperty("downlinkReport", field); }

    ok &= nativevalue_to_se(from.rtt, field, ctx);
    if (ok) { obj->setProperty("rtt", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LeaveChannelOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.stopAudioMixing, field, ctx);
    if (ok) { obj->setProperty("stopAudioMixing", field); }

    ok &= nativevalue_to_se(from.stopAllEffect, field, ctx);
    if (ok) { obj->setProperty("stopAllEffect", field); }

    ok &= nativevalue_to_se(from.stopMicrophoneRecording, field, ctx);
    if (ok) { obj->setProperty("stopMicrophoneRecording", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LiveStreamAdvancedFeature &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.featureName, field, ctx);
    if (ok) { obj->setProperty("featureName", field); }

    ok &= nativevalue_to_se(from.opened, field, ctx);
    if (ok) { obj->setProperty("opened", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LiveTranscoding &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.videoBitrate, field, ctx);
    if (ok) { obj->setProperty("videoBitrate", field); }

    ok &= nativevalue_to_se(from.videoFramerate, field, ctx);
    if (ok) { obj->setProperty("videoFramerate", field); }

    ok &= nativevalue_to_se(from.lowLatency, field, ctx);
    if (ok) { obj->setProperty("lowLatency", field); }

    ok &= nativevalue_to_se(from.videoGop, field, ctx);
    if (ok) { obj->setProperty("videoGop", field); }

    ok &= nativevalue_to_se(from.videoCodecProfile, field, ctx);
    if (ok) { obj->setProperty("videoCodecProfile", field); }

    ok &= nativevalue_to_se(from.backgroundColor, field, ctx);
    if (ok) { obj->setProperty("backgroundColor", field); }

    ok &= nativevalue_to_se(from.videoCodecType, field, ctx);
    if (ok) { obj->setProperty("videoCodecType", field); }

    ok &= nativevalue_to_se(from.userCount, field, ctx);
    if (ok) { obj->setProperty("userCount", field); }

    // TranscodingUser* transcodingUsers;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.transcodingExtraInfo, field, ctx);
    if (ok) { obj->setProperty("transcodingExtraInfo", field); }

    ok &= nativevalue_to_se(from.metadata, field, ctx);
    if (ok) { obj->setProperty("metadata", field); }

    // RtcImage* watermark;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.watermarkCount, field, ctx);
    if (ok) { obj->setProperty("watermarkCount", field); }

    // RtcImage* backgroundImage;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.backgroundImageCount, field, ctx);
    if (ok) { obj->setProperty("backgroundImageCount", field); }

    ok &= nativevalue_to_se(from.audioSampleRate, field, ctx);
    if (ok) { obj->setProperty("audioSampleRate", field); }

    ok &= nativevalue_to_se(from.audioBitrate, field, ctx);
    if (ok) { obj->setProperty("audioBitrate", field); }

    ok &= nativevalue_to_se(from.audioChannels, field, ctx);
    if (ok) { obj->setProperty("audioChannels", field); }

    ok &= nativevalue_to_se(from.audioCodecProfile, field, ctx);
    if (ok) { obj->setProperty("audioCodecProfile", field); }

    // LiveStreamAdvancedFeature* advancedFeatures;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.advancedFeatureCount, field, ctx);
    if (ok) { obj->setProperty("advancedFeatureCount", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LocalAccessPointConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.ipList, field, ctx);
    if (ok) { obj->setProperty("ipList", field); }

    ok &= nativevalue_to_se(from.ipListSize, field, ctx);
    if (ok) { obj->setProperty("ipListSize", field); }

    ok &= nativevalue_to_se(from.domainList, field, ctx);
    if (ok) { obj->setProperty("domainList", field); }

    ok &= nativevalue_to_se(from.domainListSize, field, ctx);
    if (ok) { obj->setProperty("domainListSize", field); }

    ok &= nativevalue_to_se(from.verifyDomainName, field, ctx);
    if (ok) { obj->setProperty("verifyDomainName", field); }

    ok &= nativevalue_to_se(from.mode, field, ctx);
    if (ok) { obj->setProperty("mode", field); }

    ok &= nativevalue_to_se(from.advancedConfig, field, ctx);
    if (ok) { obj->setProperty("advancedConfig", field); }

    ok &= nativevalue_to_se(from.disableAut, field, ctx);
    if (ok) { obj->setProperty("disableAut", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LocalAudioMixerConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.streamCount, field, ctx);
    if (ok) { obj->setProperty("streamCount", field); }

    // MixedAudioStream* audioInputStreams;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.syncWithLocalMic, field, ctx);
    if (ok) { obj->setProperty("syncWithLocalMic", field); }

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

bool nativevalue_to_se(const agora::rtc::LocalSpatialAudioConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    // agora::rtc::IRtcEngine* rtcEngine;
    // Pointer fields are intentionally left for a protected hand-written converter.

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LocalTranscoderConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.streamCount, field, ctx);
    if (ok) { obj->setProperty("streamCount", field); }

    // TranscodingVideoStream* videoInputStreams;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.videoOutputConfiguration, field, ctx);
    if (ok) { obj->setProperty("videoOutputConfiguration", field); }

    ok &= nativevalue_to_se(from.syncWithPrimaryCamera, field, ctx);
    if (ok) { obj->setProperty("syncWithPrimaryCamera", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LocalVideoTrackStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.number_of_streams, field, ctx);
    if (ok) { obj->setProperty("number_of_streams", field); }

    ok &= nativevalue_to_se(from.bytes_major_stream, field, ctx);
    if (ok) { obj->setProperty("bytes_major_stream", field); }

    ok &= nativevalue_to_se(from.bytes_minor_stream, field, ctx);
    if (ok) { obj->setProperty("bytes_minor_stream", field); }

    ok &= nativevalue_to_se(from.frames_encoded, field, ctx);
    if (ok) { obj->setProperty("frames_encoded", field); }

    ok &= nativevalue_to_se(from.ssrc_major_stream, field, ctx);
    if (ok) { obj->setProperty("ssrc_major_stream", field); }

    ok &= nativevalue_to_se(from.ssrc_minor_stream, field, ctx);
    if (ok) { obj->setProperty("ssrc_minor_stream", field); }

    ok &= nativevalue_to_se(from.capture_frame_rate, field, ctx);
    if (ok) { obj->setProperty("capture_frame_rate", field); }

    ok &= nativevalue_to_se(from.regulated_capture_frame_rate, field, ctx);
    if (ok) { obj->setProperty("regulated_capture_frame_rate", field); }

    ok &= nativevalue_to_se(from.input_frame_rate, field, ctx);
    if (ok) { obj->setProperty("input_frame_rate", field); }

    ok &= nativevalue_to_se(from.encode_frame_rate, field, ctx);
    if (ok) { obj->setProperty("encode_frame_rate", field); }

    ok &= nativevalue_to_se(from.render_frame_rate, field, ctx);
    if (ok) { obj->setProperty("render_frame_rate", field); }

    ok &= nativevalue_to_se(from.target_media_bitrate_bps, field, ctx);
    if (ok) { obj->setProperty("target_media_bitrate_bps", field); }

    ok &= nativevalue_to_se(from.media_bitrate_bps, field, ctx);
    if (ok) { obj->setProperty("media_bitrate_bps", field); }

    ok &= nativevalue_to_se(from.total_bitrate_bps, field, ctx);
    if (ok) { obj->setProperty("total_bitrate_bps", field); }

    ok &= nativevalue_to_se(from.capture_width, field, ctx);
    if (ok) { obj->setProperty("capture_width", field); }

    ok &= nativevalue_to_se(from.capture_height, field, ctx);
    if (ok) { obj->setProperty("capture_height", field); }

    ok &= nativevalue_to_se(from.regulated_capture_width, field, ctx);
    if (ok) { obj->setProperty("regulated_capture_width", field); }

    ok &= nativevalue_to_se(from.regulated_capture_height, field, ctx);
    if (ok) { obj->setProperty("regulated_capture_height", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.encoder_type, field, ctx);
    if (ok) { obj->setProperty("encoder_type", field); }

    ok &= nativevalue_to_se(from.hw_encoder_accelerating, field, ctx);
    if (ok) { obj->setProperty("hw_encoder_accelerating", field); }

    ok &= nativevalue_to_se(from.encoder_frame_depth, field, ctx);
    if (ok) { obj->setProperty("encoder_frame_depth", field); }

    ok &= nativevalue_to_se(from.encoder_vender_id, field, ctx);
    if (ok) { obj->setProperty("encoder_vender_id", field); }

    ok &= nativevalue_to_se(from.uplink_cost_time_ms, field, ctx);
    if (ok) { obj->setProperty("uplink_cost_time_ms", field); }

    ok &= nativevalue_to_se(from.quality_adapt_indication, field, ctx);
    if (ok) { obj->setProperty("quality_adapt_indication", field); }

    ok &= nativevalue_to_se(from.txPacketLossRate, field, ctx);
    if (ok) { obj->setProperty("txPacketLossRate", field); }

    ok &= nativevalue_to_se(from.capture_brightness_level, field, ctx);
    if (ok) { obj->setProperty("capture_brightness_level", field); }

    {
        se::HandleObject array(se::Object::createArrayObject(agora::rtc::STREAM_LAYER_COUNT_MAX));
        for (uint32_t i = 0; i < static_cast<uint32_t>(agora::rtc::STREAM_LAYER_COUNT_MAX); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.simulcast_stream_profile[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("simulcast_stream_profile", se::Value(array));
    }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LogUploadServerInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.serverDomain, field, ctx);
    if (ok) { obj->setProperty("serverDomain", field); }

    ok &= nativevalue_to_se(from.serverPath, field, ctx);
    if (ok) { obj->setProperty("serverPath", field); }

    ok &= nativevalue_to_se(from.serverPort, field, ctx);
    if (ok) { obj->setProperty("serverPort", field); }

    ok &= nativevalue_to_se(from.serverHttps, field, ctx);
    if (ok) { obj->setProperty("serverHttps", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LoopbackRecordingOption &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.deviceName, field, ctx);
    if (ok) { obj->setProperty("deviceName", field); }

    ok &= nativevalue_to_se(from.allowDeviceChange, field, ctx);
    if (ok) { obj->setProperty("allowDeviceChange", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::LowlightEnhanceOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.mode, field, ctx);
    if (ok) { obj->setProperty("mode", field); }

    ok &= nativevalue_to_se(from.level, field, ctx);
    if (ok) { obj->setProperty("level", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::MixedAudioStream &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.sourceType, field, ctx);
    if (ok) { obj->setProperty("sourceType", field); }

    ok &= nativevalue_to_se(from.remoteUserUid, field, ctx);
    if (ok) { obj->setProperty("remoteUserUid", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.trackId, field, ctx);
    if (ok) { obj->setProperty("trackId", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::MixerLayoutConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.x, field, ctx);
    if (ok) { obj->setProperty("x", field); }

    ok &= nativevalue_to_se(from.y, field, ctx);
    if (ok) { obj->setProperty("y", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.zOrder, field, ctx);
    if (ok) { obj->setProperty("zOrder", field); }

    ok &= nativevalue_to_se(from.alpha, field, ctx);
    if (ok) { obj->setProperty("alpha", field); }

    ok &= nativevalue_to_se(from.mirror, field, ctx);
    if (ok) { obj->setProperty("mirror", field); }

    ok &= nativevalue_to_se(from.image_path, field, ctx);
    if (ok) { obj->setProperty("image_path", field); }

    ok &= nativevalue_to_se(from.rotation, field, ctx);
    if (ok) { obj->setProperty("rotation", field); }

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

bool nativevalue_to_se(const agora::rtc::Music &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.songCode, field, ctx);
    if (ok) { obj->setProperty("songCode", field); }

    ok &= nativevalue_to_se(from.name, field, ctx);
    if (ok) { obj->setProperty("name", field); }

    ok &= nativevalue_to_se(from.singer, field, ctx);
    if (ok) { obj->setProperty("singer", field); }

    ok &= nativevalue_to_se(from.poster, field, ctx);
    if (ok) { obj->setProperty("poster", field); }

    ok &= nativevalue_to_se(from.releaseTime, field, ctx);
    if (ok) { obj->setProperty("releaseTime", field); }

    ok &= nativevalue_to_se(from.durationS, field, ctx);
    if (ok) { obj->setProperty("durationS", field); }

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.pitchType, field, ctx);
    if (ok) { obj->setProperty("pitchType", field); }

    ok &= nativevalue_to_se(from.lyricCount, field, ctx);
    if (ok) { obj->setProperty("lyricCount", field); }

    // int32_t* lyricList;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.climaxSegmentCount, field, ctx);
    if (ok) { obj->setProperty("climaxSegmentCount", field); }

    // ClimaxSegment* climaxSegmentList;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.mvPropertyCount, field, ctx);
    if (ok) { obj->setProperty("mvPropertyCount", field); }

    // MvProperty* mvPropertyList;
    // Pointer fields are intentionally left for a protected hand-written converter.

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::MusicCacheInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.songCode, field, ctx);
    if (ok) { obj->setProperty("songCode", field); }

    ok &= nativevalue_to_se(from.status, field, ctx);
    if (ok) { obj->setProperty("status", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::MusicContentCenterConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.appId, field, ctx);
    if (ok) { obj->setProperty("appId", field); }

    ok &= nativevalue_to_se(from.token, field, ctx);
    if (ok) { obj->setProperty("token", field); }

    ok &= nativevalue_to_se(from.mccUid, field, ctx);
    if (ok) { obj->setProperty("mccUid", field); }

    ok &= nativevalue_to_se(from.maxCacheSize, field, ctx);
    if (ok) { obj->setProperty("maxCacheSize", field); }

    ok &= nativevalue_to_se(from.mccDomain, field, ctx);
    if (ok) { obj->setProperty("mccDomain", field); }

    // IMusicContentCenterEventHandler* eventHandler;
    // Pointer fields are intentionally left for a protected hand-written converter.

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::MvProperty &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.resolution, field, ctx);
    if (ok) { obj->setProperty("resolution", field); }

    ok &= nativevalue_to_se(from.bandwidth, field, ctx);
    if (ok) { obj->setProperty("bandwidth", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::PaddedRawPixelBuffer &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.format, field, ctx);
    if (ok) { obj->setProperty("format", field); }

    // uint8_t* data_y;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.stride_y, field, ctx);
    if (ok) { obj->setProperty("stride_y", field); }

    // uint8_t* data_u;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.stride_u, field, ctx);
    if (ok) { obj->setProperty("stride_u", field); }

    // uint8_t* data_v;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.stride_v, field, ctx);
    if (ok) { obj->setProperty("stride_v", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::PathStats &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.txKBitRate, field, ctx);
    if (ok) { obj->setProperty("txKBitRate", field); }

    ok &= nativevalue_to_se(from.rxKBitRate, field, ctx);
    if (ok) { obj->setProperty("rxKBitRate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::PublisherConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.framerate, field, ctx);
    if (ok) { obj->setProperty("framerate", field); }

    ok &= nativevalue_to_se(from.bitrate, field, ctx);
    if (ok) { obj->setProperty("bitrate", field); }

    ok &= nativevalue_to_se(from.defaultLayout, field, ctx);
    if (ok) { obj->setProperty("defaultLayout", field); }

    ok &= nativevalue_to_se(from.lifecycle, field, ctx);
    if (ok) { obj->setProperty("lifecycle", field); }

    ok &= nativevalue_to_se(from.owner, field, ctx);
    if (ok) { obj->setProperty("owner", field); }

    ok &= nativevalue_to_se(from.injectStreamWidth, field, ctx);
    if (ok) { obj->setProperty("injectStreamWidth", field); }

    ok &= nativevalue_to_se(from.injectStreamHeight, field, ctx);
    if (ok) { obj->setProperty("injectStreamHeight", field); }

    ok &= nativevalue_to_se(from.injectStreamUrl, field, ctx);
    if (ok) { obj->setProperty("injectStreamUrl", field); }

    ok &= nativevalue_to_se(from.publishUrl, field, ctx);
    if (ok) { obj->setProperty("publishUrl", field); }

    ok &= nativevalue_to_se(from.rawStreamUrl, field, ctx);
    if (ok) { obj->setProperty("rawStreamUrl", field); }

    ok &= nativevalue_to_se(from.extraInfo, field, ctx);
    if (ok) { obj->setProperty("extraInfo", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RecorderStreamInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::Rectangle &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.x, field, ctx);
    if (ok) { obj->setProperty("x", field); }

    ok &= nativevalue_to_se(from.y, field, ctx);
    if (ok) { obj->setProperty("y", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

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

bool nativevalue_to_se(const agora::rtc::RemoteVideoTrackStats &from, se::Value &to, se::Object *ctx)
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

    ok &= nativevalue_to_se(from.received_bytes, field, ctx);
    if (ok) { obj->setProperty("received_bytes", field); }

    ok &= nativevalue_to_se(from.totalDecodedFrames, field, ctx);
    if (ok) { obj->setProperty("totalDecodedFrames", field); }

    ok &= nativevalue_to_se(from.avSyncTimeMs, field, ctx);
    if (ok) { obj->setProperty("avSyncTimeMs", field); }

    ok &= nativevalue_to_se(from.downlink_process_time_ms, field, ctx);
    if (ok) { obj->setProperty("downlink_process_time_ms", field); }

    ok &= nativevalue_to_se(from.frame_render_delay_ms, field, ctx);
    if (ok) { obj->setProperty("frame_render_delay_ms", field); }

    ok &= nativevalue_to_se(from.totalActiveTime, field, ctx);
    if (ok) { obj->setProperty("totalActiveTime", field); }

    ok &= nativevalue_to_se(from.publishDuration, field, ctx);
    if (ok) { obj->setProperty("publishDuration", field); }

    ok &= nativevalue_to_se(from.vqa_mos, field, ctx);
    if (ok) { obj->setProperty("vqa_mos", field); }

    ok &= nativevalue_to_se(from.vqa_avg_cost_ms, field, ctx);
    if (ok) { obj->setProperty("vqa_avg_cost_ms", field); }

    ok &= nativevalue_to_se(from.decoder_vender_id, field, ctx);
    if (ok) { obj->setProperty("decoder_vender_id", field); }

    ok &= nativevalue_to_se(from.decoder_type, field, ctx);
    if (ok) { obj->setProperty("decoder_type", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RemoteVoicePositionInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    {
        se::HandleObject array(se::Object::createArrayObject(3));
        for (uint32_t i = 0; i < static_cast<uint32_t>(3); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.position[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("position", se::Value(array));
    }

    {
        se::HandleObject array(se::Object::createArrayObject(3));
        for (uint32_t i = 0; i < static_cast<uint32_t>(3); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.forward[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("forward", se::Value(array));
    }

    to.setObject(obj);
    return ok;
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

bool nativevalue_to_se(const agora::rtc::RtcConnectionConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.autoSubscribeAudio, field, ctx);
    if (ok) { obj->setProperty("autoSubscribeAudio", field); }

    ok &= nativevalue_to_se(from.autoSubscribeVideo, field, ctx);
    if (ok) { obj->setProperty("autoSubscribeVideo", field); }

    ok &= nativevalue_to_se(from.enableAudioRecordingOrPlayout, field, ctx);
    if (ok) { obj->setProperty("enableAudioRecordingOrPlayout", field); }

    ok &= nativevalue_to_se(from.maxSendBitrate, field, ctx);
    if (ok) { obj->setProperty("maxSendBitrate", field); }

    ok &= nativevalue_to_se(from.minPort, field, ctx);
    if (ok) { obj->setProperty("minPort", field); }

    ok &= nativevalue_to_se(from.maxPort, field, ctx);
    if (ok) { obj->setProperty("maxPort", field); }

    ok &= nativevalue_to_se(from.clientRoleType, field, ctx);
    if (ok) { obj->setProperty("clientRoleType", field); }

    ok &= nativevalue_to_se(from.channelProfile, field, ctx);
    if (ok) { obj->setProperty("channelProfile", field); }

    ok &= nativevalue_to_se(from.audioRecvEncodedFrame, field, ctx);
    if (ok) { obj->setProperty("audioRecvEncodedFrame", field); }

    ok &= nativevalue_to_se(from.audioRecvMediaPacket, field, ctx);
    if (ok) { obj->setProperty("audioRecvMediaPacket", field); }

    ok &= nativevalue_to_se(from.videoRecvMediaPacket, field, ctx);
    if (ok) { obj->setProperty("videoRecvMediaPacket", field); }

    ok &= nativevalue_to_se(from.isInteractiveAudience, field, ctx);
    if (ok) { obj->setProperty("isInteractiveAudience", field); }

    ok &= nativevalue_to_se(from.isDataChannelOnly, field, ctx);
    if (ok) { obj->setProperty("isDataChannelOnly", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RtcEngineContext &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    // IRtcEngineEventHandler* eventHandler;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.appId, field, ctx);
    if (ok) { obj->setProperty("appId", field); }

    // void* context;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.channelProfile, field, ctx);
    if (ok) { obj->setProperty("channelProfile", field); }

    ok &= nativevalue_to_se(from.license, field, ctx);
    if (ok) { obj->setProperty("license", field); }

    ok &= nativevalue_to_se(from.audioScenario, field, ctx);
    if (ok) { obj->setProperty("audioScenario", field); }

    ok &= nativevalue_to_se(from.areaCode, field, ctx);
    if (ok) { obj->setProperty("areaCode", field); }

    ok &= nativevalue_to_se(from.logConfig, field, ctx);
    if (ok) { obj->setProperty("logConfig", field); }

    ok &= nativevalue_to_se(from.threadPriority, field, ctx);
    if (ok) { obj->setProperty("threadPriority", field); }

    ok &= nativevalue_to_se(from.useExternalEglContext, field, ctx);
    if (ok) { obj->setProperty("useExternalEglContext", field); }

    ok &= nativevalue_to_se(from.domainLimit, field, ctx);
    if (ok) { obj->setProperty("domainLimit", field); }

    ok &= nativevalue_to_se(from.autoRegisterAgoraExtensions, field, ctx);
    if (ok) { obj->setProperty("autoRegisterAgoraExtensions", field); }

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

bool nativevalue_to_se(const agora::rtc::RtmpConnectionConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.audioConfig, field, ctx);
    if (ok) { obj->setProperty("audioConfig", field); }

    ok &= nativevalue_to_se(from.videoConfig, field, ctx);
    if (ok) { obj->setProperty("videoConfig", field); }

    ok &= nativevalue_to_se(from.audioOnly, field, ctx);
    if (ok) { obj->setProperty("audioOnly", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RtmpConnectionInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.state, field, ctx);
    if (ok) { obj->setProperty("state", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RtmpStreamingAudioConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.sampleRateHz, field, ctx);
    if (ok) { obj->setProperty("sampleRateHz", field); }

    ok &= nativevalue_to_se(from.bytesPerSample, field, ctx);
    if (ok) { obj->setProperty("bytesPerSample", field); }

    ok &= nativevalue_to_se(from.numberOfChannels, field, ctx);
    if (ok) { obj->setProperty("numberOfChannels", field); }

    ok &= nativevalue_to_se(from.bitrate, field, ctx);
    if (ok) { obj->setProperty("bitrate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::RtmpStreamingVideoConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.framerate, field, ctx);
    if (ok) { obj->setProperty("framerate", field); }

    ok &= nativevalue_to_se(from.bitrate, field, ctx);
    if (ok) { obj->setProperty("bitrate", field); }

    ok &= nativevalue_to_se(from.maxBitrate, field, ctx);
    if (ok) { obj->setProperty("maxBitrate", field); }

    ok &= nativevalue_to_se(from.minBitrate, field, ctx);
    if (ok) { obj->setProperty("minBitrate", field); }

    ok &= nativevalue_to_se(from.gopInMs, field, ctx);
    if (ok) { obj->setProperty("gopInMs", field); }

    ok &= nativevalue_to_se(from.encoderHwSwMode, field, ctx);
    if (ok) { obj->setProperty("encoderHwSwMode", field); }

    ok &= nativevalue_to_se(from.encoderBitrateControlMode, field, ctx);
    if (ok) { obj->setProperty("encoderBitrateControlMode", field); }

    ok &= nativevalue_to_se(from.orientationMode, field, ctx);
    if (ok) { obj->setProperty("orientationMode", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ScreenAudioParameters &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.sampleRate, field, ctx);
    if (ok) { obj->setProperty("sampleRate", field); }

    ok &= nativevalue_to_se(from.channels, field, ctx);
    if (ok) { obj->setProperty("channels", field); }

    ok &= nativevalue_to_se(from.captureSignalVolume, field, ctx);
    if (ok) { obj->setProperty("captureSignalVolume", field); }

    ok &= nativevalue_to_se(from.excludeCurrentProcessAudio, field, ctx);
    if (ok) { obj->setProperty("excludeCurrentProcessAudio", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ScreenCaptureConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.isCaptureWindow, field, ctx);
    if (ok) { obj->setProperty("isCaptureWindow", field); }

    ok &= nativevalue_to_se(from.displayId, field, ctx);
    if (ok) { obj->setProperty("displayId", field); }

    ok &= nativevalue_to_se(from.screenRect, field, ctx);
    if (ok) { obj->setProperty("screenRect", field); }

    ok &= nativevalue_to_se(from.windowId, field, ctx);
    if (ok) { obj->setProperty("windowId", field); }

    ok &= nativevalue_to_se(from.params, field, ctx);
    if (ok) { obj->setProperty("params", field); }

    ok &= nativevalue_to_se(from.regionRect, field, ctx);
    if (ok) { obj->setProperty("regionRect", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ScreenCaptureParameters &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.captureAudio, field, ctx);
    if (ok) { obj->setProperty("captureAudio", field); }

    ok &= nativevalue_to_se(from.audioParams, field, ctx);
    if (ok) { obj->setProperty("audioParams", field); }

    ok &= nativevalue_to_se(from.dimensions, field, ctx);
    if (ok) { obj->setProperty("dimensions", field); }

    ok &= nativevalue_to_se(from.frameRate, field, ctx);
    if (ok) { obj->setProperty("frameRate", field); }

    ok &= nativevalue_to_se(from.bitrate, field, ctx);
    if (ok) { obj->setProperty("bitrate", field); }

    ok &= nativevalue_to_se(from.captureMouseCursor, field, ctx);
    if (ok) { obj->setProperty("captureMouseCursor", field); }

    ok &= nativevalue_to_se(from.windowFocus, field, ctx);
    if (ok) { obj->setProperty("windowFocus", field); }

    // view_t* excludeWindowList;
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.excludeWindowCount, field, ctx);
    if (ok) { obj->setProperty("excludeWindowCount", field); }

    ok &= nativevalue_to_se(from.highLightWidth, field, ctx);
    if (ok) { obj->setProperty("highLightWidth", field); }

    ok &= nativevalue_to_se(from.highLightColor, field, ctx);
    if (ok) { obj->setProperty("highLightColor", field); }

    ok &= nativevalue_to_se(from.enableHighLight, field, ctx);
    if (ok) { obj->setProperty("enableHighLight", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SegmentationProperty &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.modelType, field, ctx);
    if (ok) { obj->setProperty("modelType", field); }

    ok &= nativevalue_to_se(from.greenCapacity, field, ctx);
    if (ok) { obj->setProperty("greenCapacity", field); }

    ok &= nativevalue_to_se(from.screenColorType, field, ctx);
    if (ok) { obj->setProperty("screenColorType", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SenderOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.ccMode, field, ctx);
    if (ok) { obj->setProperty("ccMode", field); }

    ok &= nativevalue_to_se(from.codecType, field, ctx);
    if (ok) { obj->setProperty("codecType", field); }

    ok &= nativevalue_to_se(from.targetBitrate, field, ctx);
    if (ok) { obj->setProperty("targetBitrate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SimulcastConfigInternal &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    {
        se::HandleObject array(se::Object::createArrayObject(agora::rtc::STREAM_LAYER_COUNT_MAX));
        for (uint32_t i = 0; i < static_cast<uint32_t>(agora::rtc::STREAM_LAYER_COUNT_MAX); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.simulcastlayerConfigs[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("simulcastlayerConfigs", se::Value(array));
    }

    ok &= nativevalue_to_se(from.publish_fallback_enable, field, ctx);
    if (ok) { obj->setProperty("publish_fallback_enable", field); }

    ok &= nativevalue_to_se(from.publish_on_demand, field, ctx);
    if (ok) { obj->setProperty("publish_on_demand", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SimulcastStreamConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.dimensions, field, ctx);
    if (ok) { obj->setProperty("dimensions", field); }

    ok &= nativevalue_to_se(from.kBitrate, field, ctx);
    if (ok) { obj->setProperty("kBitrate", field); }

    ok &= nativevalue_to_se(from.framerate, field, ctx);
    if (ok) { obj->setProperty("framerate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SimulcastStreamProfile &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.framerate, field, ctx);
    if (ok) { obj->setProperty("framerate", field); }

    ok &= nativevalue_to_se(from.bitrate, field, ctx);
    if (ok) { obj->setProperty("bitrate", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SIZE &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::SpatialAudioZone &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.zoneSetId, field, ctx);
    if (ok) { obj->setProperty("zoneSetId", field); }

    {
        se::HandleObject array(se::Object::createArrayObject(3));
        for (uint32_t i = 0; i < static_cast<uint32_t>(3); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.position[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("position", se::Value(array));
    }

    {
        se::HandleObject array(se::Object::createArrayObject(3));
        for (uint32_t i = 0; i < static_cast<uint32_t>(3); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.forward[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("forward", se::Value(array));
    }

    {
        se::HandleObject array(se::Object::createArrayObject(3));
        for (uint32_t i = 0; i < static_cast<uint32_t>(3); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.right[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("right", se::Value(array));
    }

    {
        se::HandleObject array(se::Object::createArrayObject(3));
        for (uint32_t i = 0; i < static_cast<uint32_t>(3); ++i) {
            se::Value item;
            ok &= nativevalue_to_se(from.up[i], item, ctx);
            if (ok) { array->setArrayElement(i, item); }
        }
        obj->setProperty("up", se::Value(array));
    }

    ok &= nativevalue_to_se(from.forwardLength, field, ctx);
    if (ok) { obj->setProperty("forwardLength", field); }

    ok &= nativevalue_to_se(from.rightLength, field, ctx);
    if (ok) { obj->setProperty("rightLength", field); }

    ok &= nativevalue_to_se(from.upLength, field, ctx);
    if (ok) { obj->setProperty("upLength", field); }

    ok &= nativevalue_to_se(from.audioAttenuation, field, ctx);
    if (ok) { obj->setProperty("audioAttenuation", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::StreamLayerConfigInternal &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.dimensions, field, ctx);
    if (ok) { obj->setProperty("dimensions", field); }

    ok &= nativevalue_to_se(from.framerate, field, ctx);
    if (ok) { obj->setProperty("framerate", field); }

    ok &= nativevalue_to_se(from.bitrate_kbps, field, ctx);
    if (ok) { obj->setProperty("bitrate_kbps", field); }

    ok &= nativevalue_to_se(from.enable, field, ctx);
    if (ok) { obj->setProperty("enable", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::TConnectionInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.id, field, ctx);
    if (ok) { obj->setProperty("id", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.state, field, ctx);
    if (ok) { obj->setProperty("state", field); }

    ok &= nativevalue_to_se(from.localUserId, field, ctx);
    if (ok) { obj->setProperty("localUserId", field); }

    ok &= nativevalue_to_se(from.internalUid, field, ctx);
    if (ok) { obj->setProperty("internalUid", field); }

    ok &= nativevalue_to_se(from.proxyType, field, ctx);
    if (ok) { obj->setProperty("proxyType", field); }

    ok &= nativevalue_to_se(from.connectionIp, field, ctx);
    if (ok) { obj->setProperty("connectionIp", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::TConnectSettings &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.token, field, ctx);
    if (ok) { obj->setProperty("token", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.userId, field, ctx);
    if (ok) { obj->setProperty("userId", field); }

    ok &= nativevalue_to_se(from.info, field, ctx);
    if (ok) { obj->setProperty("info", field); }

    ok &= nativevalue_to_se(from.appDefinedStartTimeMs, field, ctx);
    if (ok) { obj->setProperty("appDefinedStartTimeMs", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::ThumbImageBuffer &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.buffer, field, ctx);
    if (ok) { obj->setProperty("buffer", field); }

    ok &= nativevalue_to_se(from.length, field, ctx);
    if (ok) { obj->setProperty("length", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::TranscodingUser &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.x, field, ctx);
    if (ok) { obj->setProperty("x", field); }

    ok &= nativevalue_to_se(from.y, field, ctx);
    if (ok) { obj->setProperty("y", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.zOrder, field, ctx);
    if (ok) { obj->setProperty("zOrder", field); }

    ok &= nativevalue_to_se(from.alpha, field, ctx);
    if (ok) { obj->setProperty("alpha", field); }

    ok &= nativevalue_to_se(from.audioChannel, field, ctx);
    if (ok) { obj->setProperty("audioChannel", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::TranscodingVideoStream &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.sourceType, field, ctx);
    if (ok) { obj->setProperty("sourceType", field); }

    ok &= nativevalue_to_se(from.remoteUserUid, field, ctx);
    if (ok) { obj->setProperty("remoteUserUid", field); }

    ok &= nativevalue_to_se(from.imageUrl, field, ctx);
    if (ok) { obj->setProperty("imageUrl", field); }

    ok &= nativevalue_to_se(from.mediaPlayerId, field, ctx);
    if (ok) { obj->setProperty("mediaPlayerId", field); }

    ok &= nativevalue_to_se(from.x, field, ctx);
    if (ok) { obj->setProperty("x", field); }

    ok &= nativevalue_to_se(from.y, field, ctx);
    if (ok) { obj->setProperty("y", field); }

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.zOrder, field, ctx);
    if (ok) { obj->setProperty("zOrder", field); }

    ok &= nativevalue_to_se(from.alpha, field, ctx);
    if (ok) { obj->setProperty("alpha", field); }

    ok &= nativevalue_to_se(from.mirror, field, ctx);
    if (ok) { obj->setProperty("mirror", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::UplinkNetworkInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.video_encoder_target_bitrate_bps, field, ctx);
    if (ok) { obj->setProperty("video_encoder_target_bitrate_bps", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::UserInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    obj->setProperty("userAccount", se::Value(from.userAccount));

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoCanvas &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.uid, field, ctx);
    if (ok) { obj->setProperty("uid", field); }

    ok &= nativevalue_to_se(from.subviewUid, field, ctx);
    if (ok) { obj->setProperty("subviewUid", field); }

    ok &= nativevalue_to_se(from.view, field, ctx);
    if (ok) { obj->setProperty("view", field); }

    ok &= nativevalue_to_se(from.backgroundColor, field, ctx);
    if (ok) { obj->setProperty("backgroundColor", field); }

    ok &= nativevalue_to_se(from.renderMode, field, ctx);
    if (ok) { obj->setProperty("renderMode", field); }

    ok &= nativevalue_to_se(from.mirrorMode, field, ctx);
    if (ok) { obj->setProperty("mirrorMode", field); }

    ok &= nativevalue_to_se(from.setupMode, field, ctx);
    if (ok) { obj->setProperty("setupMode", field); }

    ok &= nativevalue_to_se(from.sourceType, field, ctx);
    if (ok) { obj->setProperty("sourceType", field); }

    ok &= nativevalue_to_se(from.mediaPlayerId, field, ctx);
    if (ok) { obj->setProperty("mediaPlayerId", field); }

    ok &= nativevalue_to_se(from.cropArea, field, ctx);
    if (ok) { obj->setProperty("cropArea", field); }

    ok &= nativevalue_to_se(from.enableAlphaMask, field, ctx);
    if (ok) { obj->setProperty("enableAlphaMask", field); }

    ok &= nativevalue_to_se(from.position, field, ctx);
    if (ok) { obj->setProperty("position", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoDenoiserOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.mode, field, ctx);
    if (ok) { obj->setProperty("mode", field); }

    ok &= nativevalue_to_se(from.level, field, ctx);
    if (ok) { obj->setProperty("level", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoDimensions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoEncoderConfiguration &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.codecType, field, ctx);
    if (ok) { obj->setProperty("codecType", field); }

    ok &= nativevalue_to_se(from.dimensions, field, ctx);
    if (ok) { obj->setProperty("dimensions", field); }

    ok &= nativevalue_to_se(from.frameRate, field, ctx);
    if (ok) { obj->setProperty("frameRate", field); }

    ok &= nativevalue_to_se(from.bitrate, field, ctx);
    if (ok) { obj->setProperty("bitrate", field); }

    ok &= nativevalue_to_se(from.minBitrate, field, ctx);
    if (ok) { obj->setProperty("minBitrate", field); }

    ok &= nativevalue_to_se(from.orientationMode, field, ctx);
    if (ok) { obj->setProperty("orientationMode", field); }

    ok &= nativevalue_to_se(from.degradationPreference, field, ctx);
    if (ok) { obj->setProperty("degradationPreference", field); }

    ok &= nativevalue_to_se(from.mirrorMode, field, ctx);
    if (ok) { obj->setProperty("mirrorMode", field); }

    ok &= nativevalue_to_se(from.advanceOptions, field, ctx);
    if (ok) { obj->setProperty("advanceOptions", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoFrameDataV2 &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.padded_pixels, field, ctx);
    if (ok) { obj->setProperty("padded_pixels", field); }

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

bool nativevalue_to_se(const agora::rtc::VideoSubscriptionOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    ok &= nativevalue_to_se(from.encodedFrameOnly, field, ctx);
    if (ok) { obj->setProperty("encodedFrameOnly", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VideoTrackInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.isLocal, field, ctx);
    if (ok) { obj->setProperty("isLocal", field); }

    ok &= nativevalue_to_se(from.ownerUid, field, ctx);
    if (ok) { obj->setProperty("ownerUid", field); }

    ok &= nativevalue_to_se(from.trackId, field, ctx);
    if (ok) { obj->setProperty("trackId", field); }

    ok &= nativevalue_to_se(from.channelId, field, ctx);
    if (ok) { obj->setProperty("channelId", field); }

    ok &= nativevalue_to_se(from.codecType, field, ctx);
    if (ok) { obj->setProperty("codecType", field); }

    ok &= nativevalue_to_se(from.encodedFrameOnly, field, ctx);
    if (ok) { obj->setProperty("encodedFrameOnly", field); }

    ok &= nativevalue_to_se(from.sourceType, field, ctx);
    if (ok) { obj->setProperty("sourceType", field); }

    ok &= nativevalue_to_se(from.observationPosition, field, ctx);
    if (ok) { obj->setProperty("observationPosition", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::VirtualBackgroundSource &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.background_source_type, field, ctx);
    if (ok) { obj->setProperty("background_source_type", field); }

    ok &= nativevalue_to_se(from.color, field, ctx);
    if (ok) { obj->setProperty("color", field); }

    ok &= nativevalue_to_se(from.source, field, ctx);
    if (ok) { obj->setProperty("source", field); }

    ok &= nativevalue_to_se(from.blur_degree, field, ctx);
    if (ok) { obj->setProperty("blur_degree", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::WatermarkBuffer &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.width, field, ctx);
    if (ok) { obj->setProperty("width", field); }

    ok &= nativevalue_to_se(from.height, field, ctx);
    if (ok) { obj->setProperty("height", field); }

    ok &= nativevalue_to_se(from.length, field, ctx);
    if (ok) { obj->setProperty("length", field); }

    ok &= nativevalue_to_se(from.format, field, ctx);
    if (ok) { obj->setProperty("format", field); }

    // const uint8_t* buffer;
    // Pointer fields are intentionally left for a protected hand-written converter.

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::WatermarkConfig &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.id, field, ctx);
    if (ok) { obj->setProperty("id", field); }

    ok &= nativevalue_to_se(from.type, field, ctx);
    if (ok) { obj->setProperty("type", field); }

    // union { /** * Buffer of the watermark. See `WatermarkBuffer`. */ WatermarkBuffer buffer; /** * The watermark timestamp. See WatermarkTimestamp. * * @note This is only supported in linux platform. */ WatermarkTimestamp timestamp; /** * The watermark literal. See WatermarkLiteral. * * @note This is only supported in linux platform. */ WatermarkLiteral literal; /** * URL of the watermark image file. Default value is NULL. */ const char* imageUrl; };
    // Pointer fields are intentionally left for a protected hand-written converter.

    ok &= nativevalue_to_se(from.options, field, ctx);
    if (ok) { obj->setProperty("options", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::WatermarkLiteral &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.fontSize, field, ctx);
    if (ok) { obj->setProperty("fontSize", field); }

    ok &= nativevalue_to_se(from.strokeWidth, field, ctx);
    if (ok) { obj->setProperty("strokeWidth", field); }

    ok &= nativevalue_to_se(from.wmLiteral, field, ctx);
    if (ok) { obj->setProperty("wmLiteral", field); }

    ok &= nativevalue_to_se(from.fontFilePath, field, ctx);
    if (ok) { obj->setProperty("fontFilePath", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::WatermarkOptions &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.visibleInPreview, field, ctx);
    if (ok) { obj->setProperty("visibleInPreview", field); }

    ok &= nativevalue_to_se(from.positionInLandscapeMode, field, ctx);
    if (ok) { obj->setProperty("positionInLandscapeMode", field); }

    ok &= nativevalue_to_se(from.positionInPortraitMode, field, ctx);
    if (ok) { obj->setProperty("positionInPortraitMode", field); }

    ok &= nativevalue_to_se(from.watermarkRatio, field, ctx);
    if (ok) { obj->setProperty("watermarkRatio", field); }

    ok &= nativevalue_to_se(from.mode, field, ctx);
    if (ok) { obj->setProperty("mode", field); }

    ok &= nativevalue_to_se(from.zOrder, field, ctx);
    if (ok) { obj->setProperty("zOrder", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::WatermarkRatio &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.xRatio, field, ctx);
    if (ok) { obj->setProperty("xRatio", field); }

    ok &= nativevalue_to_se(from.yRatio, field, ctx);
    if (ok) { obj->setProperty("yRatio", field); }

    ok &= nativevalue_to_se(from.widthRatio, field, ctx);
    if (ok) { obj->setProperty("widthRatio", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::rtc::WatermarkTimestamp &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.fontSize, field, ctx);
    if (ok) { obj->setProperty("fontSize", field); }

    ok &= nativevalue_to_se(from.fontFilePath, field, ctx);
    if (ok) { obj->setProperty("fontFilePath", field); }

    ok &= nativevalue_to_se(from.strokeWidth, field, ctx);
    if (ok) { obj->setProperty("strokeWidth", field); }

    ok &= nativevalue_to_se(from.format, field, ctx);
    if (ok) { obj->setProperty("format", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::SpatialAudioParams &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.speaker_azimuth, field, ctx);
    if (ok) { obj->setProperty("speaker_azimuth", field); }

    ok &= nativevalue_to_se(from.speaker_elevation, field, ctx);
    if (ok) { obj->setProperty("speaker_elevation", field); }

    ok &= nativevalue_to_se(from.speaker_distance, field, ctx);
    if (ok) { obj->setProperty("speaker_distance", field); }

    ok &= nativevalue_to_se(from.speaker_orientation, field, ctx);
    if (ok) { obj->setProperty("speaker_orientation", field); }

    ok &= nativevalue_to_se(from.enable_blur, field, ctx);
    if (ok) { obj->setProperty("enable_blur", field); }

    ok &= nativevalue_to_se(from.enable_air_absorb, field, ctx);
    if (ok) { obj->setProperty("enable_air_absorb", field); }

    ok &= nativevalue_to_se(from.speaker_attenuation, field, ctx);
    if (ok) { obj->setProperty("speaker_attenuation", field); }

    ok &= nativevalue_to_se(from.enable_doppler, field, ctx);
    if (ok) { obj->setProperty("enable_doppler", field); }

    to.setObject(obj);
    return ok;
}

bool nativevalue_to_se(const agora::UserInfo &from, se::Value &to, se::Object *ctx)
{
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value field;
    bool ok = true;

    ok &= nativevalue_to_se(from.userId, field, ctx);
    if (ok) { obj->setProperty("userId", field); }

    ok &= nativevalue_to_se(from.hasAudio, field, ctx);
    if (ok) { obj->setProperty("hasAudio", field); }

    ok &= nativevalue_to_se(from.hasVideo, field, ctx);
    if (ok) { obj->setProperty("hasVideo", field); }

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
// USER CODE BLOCK START
// USER CODE BLOCK END
// AUTO-GENERATED IMPLEMENTATIONS END
