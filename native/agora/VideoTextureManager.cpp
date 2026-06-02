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
constexpr int MAX_VIDEO_TEXTURE_DEBUG_LOGS = 8;
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

bool sourceMatches(agora::rtc::VIDEO_SOURCE_TYPE expected, agora::rtc::VIDEO_SOURCE_TYPE actual) {
    if (expected == actual) { return true; }
    return isCameraSource(expected) && actual == agora::rtc::VIDEO_SOURCE_CAMERA;
}
} // namespace

VideoTextureManager::VideoTextureManager(agora::media::IMediaEngine *mediaEngine) : _mediaEngine(mediaEngine) {
    if (_mediaEngine) {
        auto ret = _mediaEngine->addVideoFrameRenderer(this);
        fprintf(stderr, "VideoTextureManager: addVideoFrameRenderer returned %d\n", ret);
    }
    startFrameFlush();
}

VideoTextureManager::~VideoTextureManager() {
    release();
}

const char *VideoTextureManager::bindingKindName(BindingKind kind) {
    switch (kind) {
        case BindingKind::Local:
            return "Local";
        case BindingKind::MediaPlayer:
            return "MediaPlayer";
        case BindingKind::RemoteMain:
            return "RemoteMain";
        case BindingKind::RemoteEx:
            return "RemoteEx";
    }
    return "Unknown";
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
    return bind(key, canvas,
                canvas.sourceType == agora::rtc::VIDEO_SOURCE_MEDIA_PLAYER ? BindingKind::MediaPlayer
                                                                           : BindingKind::Local,
                nullptr);
}

int VideoTextureManager::setupRemoteVideo(const VideoTextureCanvas &canvas) {
    const std::string key = remoteKey(canvas.uid);
    if (!canvas.texture) {
        unbind(key);
        return agora::ERR_OK;
    }
    return bind(key, canvas, BindingKind::RemoteMain, nullptr);
}

int VideoTextureManager::setupRemoteVideoEx(const VideoTextureCanvas &canvas,
                                            const agora::rtc::RtcConnection &connection) {
    const std::string key = remoteKey(canvas.uid, connection);
    if (!canvas.texture) {
        unbind(key);
        return agora::ERR_OK;
    }
    return bind(key, canvas, BindingKind::RemoteEx, &connection);
}

int VideoTextureManager::bind(const std::string &key, const VideoTextureCanvas &canvas, BindingKind kind,
                              const agora::rtc::RtcConnection *connection) {
    if (_released.load()) { return -agora::ERR_NOT_INITIALIZED; }
    if (!canvas.texture) { return -agora::ERR_INVALID_ARGUMENT; }
    startFrameFlush();

    auto entry = std::make_shared<BindingEntry>();
    entry->key = key;
    entry->kind = kind;
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

    fprintf(stderr,
            "VideoTextureManager: bind key=%s kind=%s uid=%u sourceType=%d mediaPlayerId=%d texture=%p callback=%p "
            "channel=%s localUid=%d\n",
            key.c_str(), bindingKindName(kind), static_cast<unsigned>(canvas.uid), static_cast<int>(canvas.sourceType),
            canvas.mediaPlayerId, static_cast<void *>(canvas.texture), static_cast<void *>(canvas.onAspectRatioChanged),
            connection && connection->channelId ? connection->channelId : "", connection ? static_cast<int>(connection->localUid) : 0);

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
    auto entry = findLocalEntry(sourceType);
    if (entry) {
        handleFrame(entry, videoFrame);
    } else {
        static std::atomic<int> noEntryLogCount{0};
        const int logIndex = noEntryLogCount.fetch_add(1);
        if (logIndex < MAX_VIDEO_TEXTURE_DEBUG_LOGS) {
            fprintf(stderr,
                    "VideoTextureManager: onCapture no local entry sourceType=%d frameType=%d size=%dx%d stride=%d "
                    "buffer=%p\n",
                    static_cast<int>(sourceType), static_cast<int>(videoFrame.type), videoFrame.width, videoFrame.height,
                    videoFrame.yStride, static_cast<void *>(videoFrame.yBuffer));
        }
    }
    return true;
}

bool VideoTextureManager::onPreEncodeVideoFrame(agora::rtc::VIDEO_SOURCE_TYPE sourceType, VideoFrame &videoFrame) {
    (void)sourceType;
    (void)videoFrame;
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
    return agora::media::base::VIDEO_PIXEL_RGBA;
}

bool VideoTextureManager::getRotationApplied() {
    return true;
}

bool VideoTextureManager::getMirrorApplied() {
    return false;
}

uint32_t VideoTextureManager::getObservedFramePosition() {
    return agora::media::base::POSITION_POST_CAPTURER | agora::media::base::POSITION_PRE_RENDERER;
}

std::shared_ptr<VideoTextureManager::BindingEntry> VideoTextureManager::findLocalEntry(
    agora::rtc::VIDEO_SOURCE_TYPE sourceType) {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    for (const auto &item : _entries) {
        const auto &entry = item.second;
        if (entry->kind == BindingKind::Local && sourceMatches(entry->sourceType, sourceType)) { return entry; }
    }
    return nullptr;
}

std::shared_ptr<VideoTextureManager::BindingEntry> VideoTextureManager::findMediaPlayerEntry(int mediaPlayerId) {
    std::lock_guard<std::mutex> lock(_entriesMutex);
    for (const auto &item : _entries) {
        const auto &entry = item.second;
        if (entry->kind == BindingKind::MediaPlayer && entry->mediaPlayerId == mediaPlayerId) { return entry; }
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
        if (entry->kind == BindingKind::RemoteEx && entry->channelId == channel) {
            matches.push_back(entry);
        } else if (entry->kind == BindingKind::RemoteMain) {
            matches.push_back(entry);
        }
    }
    return matches;
}

void VideoTextureManager::handleFrame(const std::shared_ptr<BindingEntry> &entry, const VideoFrame &frame) {
    if (_released.load() || !entry || frame.type != agora::media::base::VIDEO_PIXEL_RGBA || !frame.yBuffer ||
        frame.width <= 0 || frame.height <= 0) {
        if (entry) {
            std::lock_guard<std::mutex> lock(entry->mutex);
            if (entry->rejectedFrameLogCount < MAX_VIDEO_TEXTURE_DEBUG_LOGS) {
                ++entry->rejectedFrameLogCount;
                fprintf(stderr,
                        "VideoTextureManager: reject frame key=%s kind=%s released=%d texture=%p frameType=%d size=%dx%d "
                        "stride=%d buffer=%p managerReleased=%d\n",
                        entry->key.c_str(), bindingKindName(entry->kind), entry->released ? 1 : 0,
                        static_cast<void *>(entry->texture.get()), static_cast<int>(frame.type), frame.width, frame.height,
                        frame.yStride, static_cast<void *>(frame.yBuffer), _released.load() ? 1 : 0);
            }
        }
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
            std::lock_guard<std::mutex> lock(entry->mutex);
            if (entry->rejectedFrameLogCount < MAX_VIDEO_TEXTURE_DEBUG_LOGS) {
                ++entry->rejectedFrameLogCount;
                fprintf(stderr,
                        "VideoTextureManager: reject stride key=%s kind=%s frameType=%d size=%dx%d stride=%d rowBytes=%zu "
                        "frameBytes=%zu buffer=%p\n",
                        entry->key.c_str(), bindingKindName(entry->kind), static_cast<int>(frame.type), frame.width,
                        frame.height, frame.yStride, rowBytes, frameBytes, static_cast<void *>(frame.yBuffer));
            }
            return;
        }
    }

    {
        std::lock_guard<std::mutex> lock(entry->mutex);
        if (entry->released || !entry->texture) { return; }
        if (entry->acceptedFrameLogCount < MAX_VIDEO_TEXTURE_DEBUG_LOGS) {
            ++entry->acceptedFrameLogCount;
            fprintf(stderr,
                    "VideoTextureManager: accept frame key=%s kind=%s sourceType=%d uid=%u frameType=%d size=%dx%d "
                    "stride=%d rowBytes=%zu sourceRowBytes=%zu texture=%p\n",
                    entry->key.c_str(), bindingKindName(entry->kind), static_cast<int>(entry->sourceType),
                    static_cast<unsigned>(entry->uid), static_cast<int>(frame.type), frame.width, frame.height,
                    frame.yStride, rowBytes, sourceRowBytes, static_cast<void *>(entry->texture.get()));
        }
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
        if (entry->uploadLogCount < MAX_VIDEO_TEXTURE_DEBUG_LOGS) {
            ++entry->uploadLogCount;
            fprintf(stderr,
                    "VideoTextureManager: upload dirty key=%s kind=%s size=%dx%d bytes=%zu texture=%p textureSize=%dx%d\n",
                    entry->key.c_str(), bindingKindName(entry->kind), width, height, pixels.size(),
                    static_cast<void *>(texture.get()), entry->textureWidth, entry->textureHeight);
        }
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
