#include "agora/VideoTextureManager.h"

#include <algorithm>
#include <cstring>

#include "AgoraBase.h"
#include "application/ApplicationManager.h"
#include "base/Scheduler.h"
#include "bindings/jswrapper/SeApi.h"
#include "engine/Engine.h"

namespace {
constexpr int BYTES_PER_RGBA_PIXEL = 4;
constexpr char VIDEO_TEXTURE_FLUSH_KEY[] = "AgoraVideoTextureManagerFlush";

void initializePlaceholderTexture(cc::Texture2D *texture) {
    if (!texture) { return; }

    // Cocos may render the Sprite before the first video frame arrives; keep its sampler valid.
    static constexpr uint8_t PLACEHOLDER_RGBA[] = {0, 0, 0, 255};
    texture->reset({1, 1, cc::Texture2D::PixelFormat::RGBA8888, 1, 0, 1000});
    texture->uploadData(PLACEHOLDER_RGBA);
    texture->checkTextureLoaded();
}

bool isCameraSource(agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    using agora::rtc::VIDEO_SOURCE_CAMERA;
    using agora::rtc::VIDEO_SOURCE_CAMERA_FOURTH;
    using agora::rtc::VIDEO_SOURCE_CAMERA_PRIMARY;
    using agora::rtc::VIDEO_SOURCE_CAMERA_SECONDARY;
    using agora::rtc::VIDEO_SOURCE_CAMERA_THIRD;

    return sourceType == VIDEO_SOURCE_CAMERA || sourceType == VIDEO_SOURCE_CAMERA_PRIMARY ||
           sourceType == VIDEO_SOURCE_CAMERA_SECONDARY || sourceType == VIDEO_SOURCE_CAMERA_THIRD ||
           sourceType == VIDEO_SOURCE_CAMERA_FOURTH;
}

bool isScreenSource(agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    using agora::rtc::VIDEO_SOURCE_SCREEN;
    using agora::rtc::VIDEO_SOURCE_SCREEN_FOURTH;
    using agora::rtc::VIDEO_SOURCE_SCREEN_PRIMARY;
    using agora::rtc::VIDEO_SOURCE_SCREEN_SECONDARY;
    using agora::rtc::VIDEO_SOURCE_SCREEN_THIRD;

    return sourceType == VIDEO_SOURCE_SCREEN || sourceType == VIDEO_SOURCE_SCREEN_PRIMARY ||
           sourceType == VIDEO_SOURCE_SCREEN_SECONDARY || sourceType == VIDEO_SOURCE_SCREEN_THIRD ||
           sourceType == VIDEO_SOURCE_SCREEN_FOURTH;
}

bool hasPrefix(const std::string &value, const char *prefix) {
    return value.rfind(prefix, 0) == 0;
}
} // namespace

VideoTextureManager::VideoTextureManager(agora::media::IMediaEngine *mediaEngine) : _mediaEngine(mediaEngine) {
    if (_mediaEngine) { _mediaEngine->addVideoFrameRenderer(this); }
    startFrameFlush();
}

VideoTextureManager::~VideoTextureManager() {
    release();
}

std::string VideoTextureManager::localKey(const VideoTextureCanvas &canvas) {
    if (canvas.sourceType == agora::rtc::VIDEO_SOURCE_MEDIA_PLAYER) {
        return "local_media_player_" + std::to_string(canvas.mediaPlayerId);
    }
    return "local_" + std::to_string(static_cast<int>(canvas.sourceType));
}

std::string VideoTextureManager::remoteKey(agora::rtc::uid_t uid) {
    return "remote_main_" + std::to_string(uid);
}

std::string VideoTextureManager::remoteKey(agora::rtc::uid_t uid, const agora::rtc::RtcConnection &connection) {
    return "remote_" + std::string(connection.channelId ? connection.channelId : "") + "_" +
           std::to_string(connection.localUid) + "_" + std::to_string(uid);
}

int VideoTextureManager::setupLocalVideo(const VideoTextureCanvas &canvas) {
    const std::string key = localKey(canvas);
    if (!canvas.texture) {
        unbind(key);
        return agora::ERR_OK;
    }
    return bind(key, canvas, nullptr);
}

int VideoTextureManager::setupRemoteVideo(const VideoTextureCanvas &canvas) {
    const std::string key = remoteKey(canvas.uid);
    if (!canvas.texture) {
        unbind(key);
        return agora::ERR_OK;
    }
    return bind(key, canvas, nullptr);
}

int VideoTextureManager::setupRemoteVideoEx(const VideoTextureCanvas &canvas,
                                            const agora::rtc::RtcConnection &connection) {
    const std::string key = remoteKey(canvas.uid, connection);
    if (!canvas.texture) {
        unbind(key);
        return agora::ERR_OK;
    }
    return bind(key, canvas, &connection);
}

int VideoTextureManager::bind(const std::string &key, const VideoTextureCanvas &canvas,
                              const agora::rtc::RtcConnection *connection) {
    if (_released.load()) { return -agora::ERR_NOT_INITIALIZED; }
    if (!canvas.texture) { return -agora::ERR_INVALID_ARGUMENT; }
    startFrameFlush();

    auto entry = std::make_shared<BindingEntry>();
    entry->key = key;
    entry->uid = canvas.uid;
    entry->sourceType = canvas.sourceType;
    entry->mediaPlayerId = canvas.mediaPlayerId;
    entry->texture.reset(canvas.texture);
    entry->onAspectRatioChanged = canvas.onAspectRatioChanged;
    retainCallback(entry->onAspectRatioChanged);
    initializePlaceholderTexture(entry->texture.get());
    configureTexture(entry->texture.get());
    entry->textureWidth = 1;
    entry->textureHeight = 1;
    if (connection) {
        entry->channelId = connection->channelId ? connection->channelId : "";
        entry->localUid = static_cast<int>(connection->localUid);
    }

    std::shared_ptr<BindingEntry> oldEntry;
    {
        std::lock_guard<std::mutex> lock(_entriesMutex);
        auto it = _entries.find(key);
        if (it != _entries.end()) { oldEntry = it->second; }
        _entries[key] = entry;
    }
    if (oldEntry) { releaseEntryResources(oldEntry); }

    return agora::ERR_OK;
}

void VideoTextureManager::unbind(const std::string &key) {
    std::shared_ptr<BindingEntry> entry;
    {
        std::lock_guard<std::mutex> lock(_entriesMutex);
        auto it = _entries.find(key);
        if (it == _entries.end()) { return; }
        entry = it->second;
        _entries.erase(it);
    }
    releaseEntryResources(entry);
}

void VideoTextureManager::unbindAll() {
    std::unordered_map<std::string, std::shared_ptr<BindingEntry>> entries;
    {
        std::lock_guard<std::mutex> lock(_entriesMutex);
        entries.swap(_entries);
    }
    for (auto &item : entries) {
        releaseEntryResources(item.second);
    }
}

void VideoTextureManager::release() {
    if (_released.exchange(true)) { return; }
    stopFrameFlush();
    if (_mediaEngine) {
        _mediaEngine->removeVideoFrameRenderer(this);
        _mediaEngine = nullptr;
    }
    unbindAll();
}

bool VideoTextureManager::onCaptureVideoFrame(agora::rtc::VIDEO_SOURCE_TYPE sourceType, VideoFrame &videoFrame) {
    (void)sourceType;
    (void)videoFrame;
    return true;
}

bool VideoTextureManager::onPreEncodeVideoFrame(agora::rtc::VIDEO_SOURCE_TYPE sourceType, VideoFrame &videoFrame) {
    auto entry = findLocalEntry(sourceType);
    if (entry) { handleFrame(entry, videoFrame); }
    return true;
}

bool VideoTextureManager::onMediaPlayerVideoFrame(VideoFrame &videoFrame, int mediaPlayerId) {
    auto entry = findMediaPlayerEntry(mediaPlayerId);
    if (entry) { handleFrame(entry, videoFrame); }
    return true;
}

bool VideoTextureManager::onRenderVideoFrame(const char *channelId, agora::rtc::uid_t remoteUid,
                                             VideoFrame &videoFrame) {
    auto entries = findRemoteEntries(channelId, remoteUid);
    for (const auto &entry : entries) {
        handleFrame(entry, videoFrame);
    }
    return true;
}

bool VideoTextureManager::onTranscodedVideoFrame(VideoFrame &videoFrame) {
    auto entry = findLocalEntry(agora::rtc::VIDEO_SOURCE_TRANSCODED);
    if (entry) { handleFrame(entry, videoFrame); }
    return true;
}

VideoTextureManager::VIDEO_FRAME_PROCESS_MODE VideoTextureManager::getVideoFrameProcessMode() {
    return PROCESS_MODE_READ_ONLY;
}

agora::media::base::VIDEO_PIXEL_FORMAT VideoTextureManager::getVideoFormatPreference() {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    if (_entries.empty()) { return agora::media::base::VIDEO_PIXEL_DEFAULT; }
    return agora::media::base::VIDEO_PIXEL_RGBA;
}

bool VideoTextureManager::getRotationApplied() {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    if (_entries.empty()) { return IVideoFrameObserver::getRotationApplied(); }
    return true;
}

bool VideoTextureManager::getMirrorApplied() {
    return false;
}

uint32_t VideoTextureManager::getObservedFramePosition() {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    if (_entries.empty()) {
        return agora::media::base::POSITION_PRE_ENCODER | agora::media::base::POSITION_PRE_RENDERER;
    }
    return agora::media::base::POSITION_PRE_ENCODER | agora::media::base::POSITION_PRE_RENDERER;
}

std::shared_ptr<VideoTextureManager::BindingEntry> VideoTextureManager::findLocalEntry(
    agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    for (const auto &item : _entries) {
        const auto &entry = item.second;
        if (hasPrefix(entry->key, "local_") && entry->sourceType != agora::rtc::VIDEO_SOURCE_MEDIA_PLAYER &&
            entry->sourceType == sourceType) {
            return entry;
        }
    }
    return nullptr;
}

std::shared_ptr<VideoTextureManager::BindingEntry> VideoTextureManager::findMediaPlayerEntry(int mediaPlayerId) {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    for (const auto &item : _entries) {
        const auto &entry = item.second;
        if (entry->sourceType == agora::rtc::VIDEO_SOURCE_MEDIA_PLAYER && entry->mediaPlayerId == mediaPlayerId) {
            return entry;
        }
    }
    return nullptr;
}

std::vector<std::shared_ptr<VideoTextureManager::BindingEntry>> VideoTextureManager::findRemoteEntries(
    const char *channelId, agora::rtc::uid_t uid) {
    std::vector<std::shared_ptr<BindingEntry>> matches;
    const std::string channel = channelId ? channelId : "";

    std::lock_guard<std::mutex> lock(_entriesMutex);
    for (const auto &item : _entries) {
        const auto &entry = item.second;
        if (entry->uid != uid) { continue; }
        if (entry->key == remoteKey(uid)) {
            matches.push_back(entry);
        } else if (hasPrefix(entry->key, "remote_") && entry->channelId == channel) {
            matches.push_back(entry);
        }
    }
    return matches;
}

void VideoTextureManager::handleFrame(const std::shared_ptr<BindingEntry> &entry, const VideoFrame &frame) {
    if (_released.load() || !entry || frame.type != agora::media::base::VIDEO_PIXEL_RGBA || !frame.yBuffer ||
        frame.width <= 0 || frame.height <= 0) {
        return;
    }

    const size_t rowBytes = static_cast<size_t>(frame.width) * BYTES_PER_RGBA_PIXEL;
    const size_t frameBytes = rowBytes * static_cast<size_t>(frame.height);
    const size_t reportedStride = frame.yStride > 0 ? static_cast<size_t>(frame.yStride) : 0;
    size_t sourceRowBytes = rowBytes;

    // Agora documents yStride as the total RGBA buffer length, while some frame sources expose
    // it like a row stride. Normalize both cases before copying into tightly packed RGBA pixels.
    if (reportedStride > 0) {
        if (reportedStride >= frameBytes) {
            const size_t rowCandidate = reportedStride / static_cast<size_t>(frame.height);
            if (reportedStride % static_cast<size_t>(frame.height) == 0 && rowCandidate >= rowBytes) {
                sourceRowBytes = rowCandidate;
            }
        } else if (reportedStride >= rowBytes) {
            sourceRowBytes = reportedStride;
        } else {
            return;
        }
    }

    {
        std::lock_guard<std::mutex> lock(entry->mutex);
        if (entry->released || !entry->texture) { return; }
        entry->pixels.resize(frameBytes);
        if (sourceRowBytes != rowBytes) {
            for (int y = 0; y < frame.height; ++y) {
                std::memcpy(entry->pixels.data() + rowBytes * static_cast<size_t>(y),
                            frame.yBuffer + sourceRowBytes * static_cast<size_t>(y), rowBytes);
            }
        } else {
            std::memcpy(entry->pixels.data(), frame.yBuffer, frameBytes);
        }
        entry->width = frame.width;
        entry->height = frame.height;
        entry->dirty = true;
    }
}

void VideoTextureManager::startFrameFlush() {
    if (_frameFlushScheduled) { return; }
    auto engine = CC_CURRENT_ENGINE();
    auto scheduler = engine ? engine->getScheduler() : nullptr;
    if (!scheduler) { return; }

    scheduler->schedule([this](float dt) { flushDirtyTextures(dt); }, this, 0.0F, false, VIDEO_TEXTURE_FLUSH_KEY);
    _frameFlushScheduled = true;
}

void VideoTextureManager::stopFrameFlush() {
    if (!_frameFlushScheduled) { return; }
    auto engine = CC_CURRENT_ENGINE();
    auto scheduler = engine ? engine->getScheduler() : nullptr;
    if (scheduler) { scheduler->unschedule(VIDEO_TEXTURE_FLUSH_KEY, this); }
    _frameFlushScheduled = false;
}

void VideoTextureManager::flushDirtyTextures(float dt) {
    (void)dt;
    if (_released.load()) { return; }

    std::vector<std::shared_ptr<BindingEntry>> entries;
    {
        std::lock_guard<std::mutex> lock(_entriesMutex);
        entries.reserve(_entries.size());
        for (const auto &item : _entries) {
            entries.push_back(item.second);
        }
    }

    for (const auto &entry : entries) {
        uploadEntryOnCocosThread(entry);
    }
}

void VideoTextureManager::uploadEntryOnCocosThread(const std::shared_ptr<BindingEntry> &entry) {
    if (!entry) { return; }

    cc::IntrusivePtr<cc::Texture2D> texture;
    se::Object *aspectCallback = nullptr;
    std::vector<uint8_t> pixels;
    int width = 0;
    int height = 0;
    bool aspectChanged = false;
    {
        std::lock_guard<std::mutex> lock(entry->mutex);
        if (entry->released || !entry->texture) { return; }
        if (!entry->dirty) { return; }
        texture = entry->texture;
        pixels = entry->pixels;
        width = entry->width;
        height = entry->height;
        entry->dirty = false;
    }

    if (texture && !pixels.empty() && width > 0 && height > 0) {
        if (entry->textureWidth != width || entry->textureHeight != height) {
            texture->reset({static_cast<uint32_t>(width), static_cast<uint32_t>(height),
                            cc::Texture2D::PixelFormat::RGBA8888, 1, 0, 1000});
            configureTexture(texture.get());
            entry->textureWidth = width;
            entry->textureHeight = height;
        }
        texture->uploadData(pixels.data());
        texture->checkTextureLoaded();

        {
            std::lock_guard<std::mutex> lock(entry->mutex);
            if (!entry->released && (entry->lastAspectWidth != width || entry->lastAspectHeight != height)) {
                entry->lastAspectWidth = width;
                entry->lastAspectHeight = height;
                aspectCallback = entry->onAspectRatioChanged;
                aspectChanged = aspectCallback != nullptr;
            }
        }
    }

    if (aspectChanged) {
        callAspectRatioChanged(aspectCallback, width, height);
        fprintf(stderr, "VideoTextureManager: aspect changed sourceType %d, %d x %d\n", (int)entry->sourceType, width,
                height);
    }
}

void VideoTextureManager::configureTexture(cc::Texture2D *texture) {
    if (!texture) { return; }
    texture->setFilters(cc::Texture2D::Filter::LINEAR, cc::Texture2D::Filter::LINEAR);
    texture->setMipFilter(cc::Texture2D::Filter::NONE);
    texture->setWrapMode(cc::Texture2D::WrapMode::CLAMP_TO_EDGE, cc::Texture2D::WrapMode::CLAMP_TO_EDGE,
                         cc::Texture2D::WrapMode::CLAMP_TO_EDGE);
}

void VideoTextureManager::retainCallback(se::Object *callback) {
    if (!callback) { return; }
    callback->incRef();
    callback->root();
}

void VideoTextureManager::releaseCallback(se::Object *callback) {
    if (!callback) { return; }
    callback->unroot();
    callback->decRef();
}

void VideoTextureManager::releaseEntryResources(const std::shared_ptr<BindingEntry> &entry) {
    if (!entry) { return; }

    se::Object *callback = nullptr;
    {
        std::lock_guard<std::mutex> lock(entry->mutex);
        entry->released = true;
        entry->dirty = false;
        entry->pixels.clear();
        entry->texture.reset();
        callback = entry->onAspectRatioChanged;
        entry->onAspectRatioChanged = nullptr;
    }
    releaseCallback(callback);
}

void VideoTextureManager::callAspectRatioChanged(se::Object *callback, int width, int height) {
    if (!callback) { return; }
    auto *scriptEngine = se::ScriptEngine::getInstance();
    if (!scriptEngine || !scriptEngine->isValid()) { return; }

    se::AutoHandleScope handleScope;
    if (!callback->isFunction()) { return; }

    se::ValueArray args;
    args.emplace_back(width);
    args.emplace_back(height);
    scriptEngine->clearException();
    callback->call(args, nullptr);
}
