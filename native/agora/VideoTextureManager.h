#pragma once

#include <atomic>
#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include <vector>

#include "AgoraMediaBase.h"
#include "IAgoraMediaEngine.h"
#include "IAgoraRtcEngineEx.h"
#include "base/Ptr.h"
#include "core/assets/Texture2D.h"

namespace se {
class Object;
}

struct VideoTextureCanvas {
    agora::rtc::uid_t uid{0};
    agora::rtc::VIDEO_SOURCE_TYPE sourceType{agora::rtc::VIDEO_SOURCE_CAMERA};
    int mediaPlayerId{0};
    cc::Texture2D *texture{nullptr};
    se::Object *onAspectRatioChanged{nullptr};
};

class VideoTextureManager : public agora::media::IVideoFrameObserver,
                            public std::enable_shared_from_this<VideoTextureManager> {
public:
    explicit VideoTextureManager(agora::media::IMediaEngine *mediaEngine);
    ~VideoTextureManager() override;

    int setupLocalVideo(const VideoTextureCanvas &canvas);
    int setupRemoteVideo(const VideoTextureCanvas &canvas);
    int setupRemoteVideoEx(const VideoTextureCanvas &canvas, const agora::rtc::RtcConnection &connection);

    void unbindAll();
    void release();

    bool onCaptureVideoFrame(agora::rtc::VIDEO_SOURCE_TYPE sourceType, VideoFrame &videoFrame) override;
    bool onPreEncodeVideoFrame(agora::rtc::VIDEO_SOURCE_TYPE sourceType, VideoFrame &videoFrame) override;
    bool onMediaPlayerVideoFrame(VideoFrame &videoFrame, int mediaPlayerId) override;
    bool onRenderVideoFrame(const char *channelId, agora::rtc::uid_t remoteUid, VideoFrame &videoFrame) override;
    bool onTranscodedVideoFrame(VideoFrame &videoFrame) override;

    VIDEO_FRAME_PROCESS_MODE getVideoFrameProcessMode() override;
    agora::media::base::VIDEO_PIXEL_FORMAT getVideoFormatPreference() override;
    bool getRotationApplied() override;
    bool getMirrorApplied() override;
    uint32_t getObservedFramePosition() override;

private:
    enum class BindingKind {
        Local,
        MediaPlayer,
        RemoteMain,
        RemoteEx,
    };

    struct BindingEntry {
        std::string key;
        BindingKind kind{BindingKind::Local};
        agora::rtc::uid_t uid{0};
        agora::rtc::VIDEO_SOURCE_TYPE sourceType{agora::rtc::VIDEO_SOURCE_CAMERA};
        int mediaPlayerId{0};
        std::string channelId;
        int localUid{0};
        cc::IntrusivePtr<cc::Texture2D> texture;

        std::mutex mutex;
        std::vector<uint8_t> pixels;
        int width{0};
        int height{0};
        int textureWidth{0};
        int textureHeight{0};
        int lastAspectWidth{0};
        int lastAspectHeight{0};
        se::Object *onAspectRatioChanged{nullptr};
        bool dirty{false};
        bool released{false};
    };

    static std::string localKey(const VideoTextureCanvas &canvas);
    static std::string remoteKey(agora::rtc::uid_t uid);
    static std::string remoteKey(agora::rtc::uid_t uid, const agora::rtc::RtcConnection &connection);

    int bind(const std::string &key, const VideoTextureCanvas &canvas, BindingKind kind,
             const agora::rtc::RtcConnection *connection);
    void unbind(const std::string &key);
    void handleFrame(const std::shared_ptr<BindingEntry> &entry, const VideoFrame &frame);
    void startFrameFlush();
    void stopFrameFlush();
    void flushDirtyTextures(float dt);
    void uploadEntryOnCocosThread(const std::shared_ptr<BindingEntry> &entry);
    void configureTexture(cc::Texture2D *texture);
    void retainCallback(se::Object *callback);
    void releaseCallback(se::Object *callback);
    void releaseEntryResources(const std::shared_ptr<BindingEntry> &entry);
    void callAspectRatioChanged(se::Object *callback, int width, int height);
    std::shared_ptr<BindingEntry> findLocalEntry(agora::rtc::VIDEO_SOURCE_TYPE sourceType);
    std::shared_ptr<BindingEntry> findMediaPlayerEntry(int mediaPlayerId);
    std::vector<std::shared_ptr<BindingEntry>> findRemoteEntries(const char *channelId, agora::rtc::uid_t uid);

    agora::media::IMediaEngine *_mediaEngine{nullptr};
    std::mutex _entriesMutex;
    std::unordered_map<std::string, std::shared_ptr<BindingEntry>> _entries;
    std::atomic_bool _released{false};
    bool _frameFlushScheduled{false};
};
