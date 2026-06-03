#pragma once
/**
 * Mock implementations for all Agora sub-interfaces.
 * Each mock logs every method call via MockLog for test verification.
 */
#include "IAgoraMediaPlayer.h"
#include "IAgoraMediaRecorder.h"
#include "IAgoraSpatialAudio.h"
#include "IAgoraH265Transcoder.h"
#include "IAgoraMusicContentCenter.h"
#include "IAudioDeviceManager.h"
#include "IAgoraRtcEngine.h"
#include "AgoraRefPtr.h"
#include "MockLog.h"
#include <atomic>

namespace agora {
namespace rtc {

// ─── MockIString ─────────────────────────────────────────────────────────
// Simple IString implementation for AString parameters.
class MockIString : public util::IString {
public:
    explicit MockIString(const std::string& s) : str_(s) {}
    bool empty() const override { return str_.empty(); }
    const char* c_str() override { return str_.c_str(); }
    const char* data() override { return str_.data(); }
    size_t length() override { return str_.length(); }
    util::IString* clone() override { return new MockIString(str_); }
    void release() override { delete this; }
private:
    std::string str_;
};

// Helper: set an AString to a mock value
inline void setMockAString(agora::util::AString& out, const std::string& value) {
    out.reset(new MockIString(value));
}

// ─── RefCountMixin ───────────────────────────────────────────────────────
template <typename T>
class RefCountMixin : public T {
public:
    RefCountMixin() : refCount_(1) {}
    void AddRef() const override { refCount_.fetch_add(1, std::memory_order_relaxed); }
    RefCountReleaseStatus Release() const override {
        if (refCount_.fetch_sub(1, std::memory_order_acq_rel) == 1) {
            delete this;
            return RefCountReleaseStatus::kDroppedLastRef;
        }
        return RefCountReleaseStatus::kOtherRefsRemained;
    }
    bool HasOneRef() const override { return refCount_.load(std::memory_order_acquire) == 1; }
protected:
    virtual ~RefCountMixin() = default;
private:
    mutable std::atomic<int> refCount_;
};

// ─── MockIMediaPlayer ────────────────────────────────────────────────────
class MockIMediaPlayer : public RefCountMixin<IMediaPlayer> {
public:
    explicit MockIMediaPlayer(int id) : id_(id) {}
    int initialize(base::IAgoraService*) override { return 0; }
    int getMediaPlayerId() const override;
    int open(const char* url, int64_t startPos) override;
    int openWithMediaSource(const media::base::MediaSource& source) override;
    int play() override;
    int pause() override;
    int stop() override;
    int resume() override;
    int seek(int64_t newPos) override;
    int setAudioPitch(int pitch) override;
    int getDuration(int64_t& duration) override;
    int getPlayPosition(int64_t& pos) override;
    int getStreamCount(int64_t& count) override;
    int getStreamInfo(int64_t index, media::base::PlayerStreamInfo* info) override;
    int setLoopCount(int loopCount) override;
    int setPlaybackSpeed(int speed) override;
    int selectAudioTrack(int index) override;
    int selectMultiAudioTrack(int playoutTrackIndex, int publishTrackIndex) override;
    int setPlayerOption(const char* key, int value) override;
    int setPlayerOption(const char* key, const char* value) override;
    int takeScreenshot(const char* filename) override;
    int selectInternalSubtitle(int index) override;
    int setExternalSubtitle(const char* url) override;
    media::base::MEDIA_PLAYER_STATE getState() override;
    int mute(bool muted) override;
    int getMute(bool& muted) override;
    int adjustPlayoutVolume(int volume) override;
    int getPlayoutVolume(int& volume) override;
    int adjustPublishSignalVolume(int volume) override;
    int getPublishSignalVolume(int& volume) override;
    int setView(media::base::view_t) override { return 0; }
    int setRenderMode(media::base::RENDER_MODE_TYPE) override { return 0; }
    int registerPlayerSourceObserver(IMediaPlayerSourceObserver* observer) override;
    int unregisterPlayerSourceObserver(IMediaPlayerSourceObserver* observer) override;
    int registerAudioFrameObserver(media::IAudioPcmFrameSink*) override { return 0; }
    int registerAudioFrameObserver(media::IAudioPcmFrameSink*, RAW_AUDIO_FRAME_OP_MODE_TYPE) override { return 0; }
    int unregisterAudioFrameObserver(media::IAudioPcmFrameSink*) override { return 0; }
    int registerVideoFrameObserver(media::base::IVideoFrameObserver*) override { return 0; }
    int unregisterVideoFrameObserver(media::base::IVideoFrameObserver*) override { return 0; }
    int registerMediaPlayerAudioSpectrumObserver(media::IAudioSpectrumObserver*, int) override { return 0; }
    int unregisterMediaPlayerAudioSpectrumObserver(media::IAudioSpectrumObserver*) override { return 0; }
    int setAudioDualMonoMode(media::base::AUDIO_DUAL_MONO_MODE mode) override;
    const char* getPlayerSdkVersion() override;
    const char* getPlaySrc() override;
    int openWithAgoraCDNSrc(const char* src, int64_t startPos) override;
    int getAgoraCDNLineCount() override;
    int switchAgoraCDNLineByIndex(int index) override;
    int getCurrentAgoraCDNIndex() override;
    int enableAutoSwitchAgoraCDN(bool enable) override;
    int renewAgoraCDNSrcToken(const char* token, int64_t ts) override;
    int switchAgoraCDNSrc(const char* src, bool syncPts) override;
    int switchSrc(const char* src, bool syncPts) override;
    int preloadSrc(const char* src, int64_t startPos) override;
    int playPreloadedSrc(const char* src) override;
    int unloadSrc(const char* src) override;
    int setSpatialAudioParams(const SpatialAudioParams& params) override;
    int setSoundPositionParams(float pan, float gain) override;
    int getAudioBufferDelay(int32_t& delayMs) override;

    // Stored observer for callback testing
    IMediaPlayerSourceObserver* playerSourceObserver{nullptr};

private:
    int id_;
};

// ─── MockIMediaRecorder ──────────────────────────────────────────────────
class MockIMediaRecorder : public RefCountMixin<IMediaRecorder> {
public:
    explicit MockIMediaRecorder(int id) : id_(id) {}
    int setMediaRecorderObserver(media::IMediaRecorderObserver* callback) override;
    int startRecording(const media::MediaRecorderConfiguration& config) override;
    int stopRecording() override;

    // Stored observer for callback testing
    media::IMediaRecorderObserver* recorderObserver{nullptr};

private:
    int id_;
};

// ─── MockIAudioDeviceCollection ──────────────────────────────────────────
class MockIAudioDeviceCollection : public IAudioDeviceCollection {
public:
    MockIAudioDeviceCollection() = default;
    int getCount() override;
    int getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH],
                  char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int setDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH],
                         char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int setApplicationVolume(int volume) override;
    int getApplicationVolume(int &volume) override;
    int setApplicationMute(bool mute) override;
    int isApplicationMute(bool &mute) override;
    void release() override {}
};

// ─── MockIVideoDeviceCollection ──────────────────────────────────────────
class MockIVideoDeviceCollection : public IVideoDeviceCollection {
public:
    MockIVideoDeviceCollection() = default;
    int getCount() override;
    int setDevice(const char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) override;
    int getDevice(int index, char deviceNameUTF8[MAX_DEVICE_ID_LENGTH], char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) override;
    void release() override {}
};

// ─── MockIAudioDeviceManager ─────────────────────────────────────────────
class MockIAudioDeviceManager : public RefCountMixin<IAudioDeviceManager> {
public:
    MockIAudioDeviceManager() = default;
    IAudioDeviceCollection* enumeratePlaybackDevices() override;
    IAudioDeviceCollection* enumerateRecordingDevices() override;
    int setPlaybackDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getPlaybackDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH]) override;
    int getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH]) override;
    int setPlaybackDeviceVolume(int volume) override;
    int getPlaybackDeviceVolume(int* volume) override;
    int setRecordingDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getRecordingDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getRecordingDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH]) override;
    int getRecordingDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH]) override;
    int setRecordingDeviceVolume(int volume) override;
    int getRecordingDeviceVolume(int* volume) override;
    int setLoopbackDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int getLoopbackDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) override;
    int setPlaybackDeviceMute(bool mute) override;
    int getPlaybackDeviceMute(bool* mute) override;
    int setRecordingDeviceMute(bool mute) override;
    int getRecordingDeviceMute(bool* mute) override;
    int startPlaybackDeviceTest(const char* testAudioFilePath) override;
    int stopPlaybackDeviceTest() override;
    int startRecordingDeviceTest(int indicationInterval) override;
    int stopRecordingDeviceTest() override;
    int startAudioDeviceLoopbackTest(int indicationInterval) override;
    int stopAudioDeviceLoopbackTest() override;
    int followSystemPlaybackDevice(bool enable) override;
    int followSystemRecordingDevice(bool enable) override;
    int followSystemLoopbackDevice(bool enable) override;
    void release() override {}

    // Stored mock collections
    MockIAudioDeviceCollection* playbackCollection_ = new MockIAudioDeviceCollection();
    MockIAudioDeviceCollection* recordingCollection_ = new MockIAudioDeviceCollection();
};

// ─── MockIVideoDeviceManager ─────────────────────────────────────────────
class MockIVideoDeviceManager : public IVideoDeviceManager {
public:
    MockIVideoDeviceManager() = default;
    IVideoDeviceCollection* enumerateVideoDevices() override;
    int setDevice(const char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) override;
    int getDevice(char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) override;
    int numberOfCapabilities(const char* deviceIdUTF8) override;
    int getCapability(const char* deviceIdUTF8, const uint32_t deviceCapabilityNumber, VideoFormat& capability) override;
    int startDeviceTest(view_t hwnd) override { return 0; }
    int stopDeviceTest() override;
    void release() override {}

    // Stored mock collection
    MockIVideoDeviceCollection* videoCollection_ = new MockIVideoDeviceCollection();
};

// ─── MockIH265Transcoder ────────────────────────────────────────────────
class MockIH265Transcoder : public RefCountMixin<IH265Transcoder> {
public:
    MockIH265Transcoder() = default;
    int enableTranscode(const char* token, const char* channel, uid_t uid) override;
    int queryChannel(const char* token, const char* channel, uid_t uid) override;
    int triggerTranscode(const char* token, const char* channel, uid_t uid) override;
    int registerTranscoderObserver(IH265TranscoderObserver* observer) override;
    int unregisterTranscoderObserver(IH265TranscoderObserver* observer) override;

    // Stored observer for callback testing
    IH265TranscoderObserver* transcoderObserver{nullptr};
};

// ─── MockILocalSpatialAudioEngine ────────────────────────────────────────
class MockILocalSpatialAudioEngine : public RefCountMixin<ILocalSpatialAudioEngine> {
public:
    MockILocalSpatialAudioEngine() = default;
    void release() override {}
    int initialize(const LocalSpatialAudioConfig&) override { return 0; }
    int setMaxAudioRecvCount(int maxCount) override;
    int setAudioRecvRange(float range) override;
    int setDistanceUnit(float unit) override;
    int updateSelfPosition(const float position[3], const float axisForward[3], const float axisRight[3], const float axisUp[3]) override;
    int updateSelfPositionEx(const float position[3], const float axisForward[3], const float axisRight[3], const float axisUp[3], const RtcConnection& connection) override;
    int updatePlayerPositionInfo(int playerId, const RemoteVoicePositionInfo& positionInfo) override;
    int updateRemotePosition(uid_t uid, const RemoteVoicePositionInfo& posInfo) override;
    int updateRemotePositionEx(uid_t uid, const RemoteVoicePositionInfo& posInfo, const RtcConnection& connection) override;
    int removeRemotePosition(uid_t uid) override;
    int removeRemotePositionEx(uid_t uid, const RtcConnection& connection) override;
    int clearRemotePositions() override;
    int clearRemotePositionsEx(const RtcConnection& connection) override;
    int setParameters(const char* params) override;
    int muteLocalAudioStream(bool mute) override;
    int muteAllRemoteAudioStreams(bool mute) override;
    int muteRemoteAudioStream(uid_t uid, bool mute) override;
    int setRemoteAudioAttenuation(uid_t uid, double attenuation, bool forceSet) override;
    int setZones(const SpatialAudioZone* zones, unsigned int zoneCount) override;
    int setPlayerAttenuation(int playerId, double attenuation, bool forceSet) override;
};

// ─── MockIMusicContentCenter ─────────────────────────────────────────────
class MockIMusicContentCenter : public IMusicContentCenter {
public:
    MockIMusicContentCenter() = default;
    int initialize(const MusicContentCenterConfiguration& configuration) override;
    int renewToken(const char* token) override;
    void release() override {}
    int registerEventHandler(IMusicContentCenterEventHandler* eventHandler) override;
    int unregisterEventHandler() override;
    agora_refptr<IMusicPlayer> createMusicPlayer() override;
    int destroyMusicPlayer(agora_refptr<IMusicPlayer> music_player) override;
    int getMusicCharts(agora::util::AString& requestId) override;
    int getMusicCollectionByMusicChartId(agora::util::AString& requestId, int32_t musicChartId, int32_t page, int32_t pageSize, const char* jsonOption = nullptr) override;
    int searchMusic(agora::util::AString& requestId, const char* keyWord, int32_t page, int32_t pageSize, const char* jsonOption = nullptr) override;
    int preload(int64_t songCode, const char* jsonOption) override;
    int preload(agora::util::AString& requestId, int64_t songCode) override;
    int removeCache(int64_t songCode) override;
    int getCaches(MusicCacheInfo* cacheInfo, int32_t* cacheInfoSize) override;
    int isPreloaded(int64_t songCode) override;
    int getLyric(agora::util::AString& requestId, int64_t songCode, int32_t lyricType = 0) override;
    int getSongSimpleInfo(agora::util::AString& requestId, int64_t songCode) override;
    int getInternalSongCode(int64_t songCode, const char* jsonOption, int64_t& internalSongCode) override;

    // Stored event handler for callback testing
    IMusicContentCenterEventHandler* musicContentCenterEventHandler{nullptr};
};

// ─── MockMusicChartCollection ─────────────────────────────────────────────
class MockMusicChartCollection : public RefCountMixin<MusicChartCollection> {
public:
    MockMusicChartCollection() = default;
    int getCount() override { return 1; }
    MusicChartInfo* get(int index) override {
        if (index == 0) return &info_;
        return nullptr;
    }
private:
    MusicChartInfo info_{"test-chart", 2};
};

// ─── MockMusicCollection ─────────────────────────────────────────────────
class MockMusicCollection : public RefCountMixin<MusicCollection> {
public:
    MockMusicCollection() {
        music_.songCode = 2;
        music_.name = "test-song";
        music_.singer = "test-singer";
        music_.poster = "test-poster";
        music_.releaseTime = "test-releaseTime";
        music_.durationS = 2;
        music_.type = 2;
        music_.pitchType = 2;
        music_.lyricCount = 0;
        music_.lyricList = nullptr;
        music_.climaxSegmentCount = 0;
        music_.climaxSegmentList = nullptr;
        music_.mvPropertyCount = 0;
        music_.mvPropertyList = nullptr;
    }
    int getCount() override { return 1; }
    int getTotal() override { return 2; }
    int getPage() override { return 2; }
    int getPageSize() override { return 2; }
    Music* getMusic(int32_t index) override {
        if (index == 0) return &music_;
        return nullptr;
    }
private:
    Music music_{};
};

// ─── MockIMediaPlayerCacheManager ────────────────────────────────────────
class MockIMediaPlayerCacheManager : public IMediaPlayerCacheManager {
public:
    MockIMediaPlayerCacheManager() = default;
    int removeAllCaches() override;
    int removeOldCache() override;
    int removeCacheByUri(const char* uri) override;
    int setCacheDir(const char* path) override;
    int setMaxCacheFileCount(int count) override;
    int setMaxCacheFileSize(int64_t cacheSize) override;
    int enableAutoRemoveCache(bool enable) override;
    int getCacheDir(char* path, int length) override;
    int getMaxCacheFileCount() override;
    int64_t getMaxCacheFileSize() override;
    int getCacheFileCount() override;
};

// ─── MockIVideoEffectObject ──────────────────────────────────────────────
class MockIVideoEffectObject : public RefCountMixin<IVideoEffectObject> {
public:
    explicit MockIVideoEffectObject(int id) : id_(id) {}
    int addOrUpdateVideoEffect(uint32_t nodeId, const char* templateName) override;
    int removeVideoEffect(uint32_t nodeId) override;
    int performVideoEffectAction(uint32_t nodeId, VIDEO_EFFECT_ACTION actionId) override;
    int setVideoEffectFloatParam(const char* option, const char* key, float param) override;
    int setVideoEffectIntParam(const char* option, const char* key, int param) override;
    int setVideoEffectBoolParam(const char* option, const char* key, bool param) override;
    float getVideoEffectFloatParam(const char* option, const char* key) override;
    int getVideoEffectIntParam(const char* option, const char* key) override;
    bool getVideoEffectBoolParam(const char* option, const char* key) override;
private:
    int id_;
};

// ─── MockIScreenCaptureSourceList ────────────────────────────────────────
class MockIScreenCaptureSourceList : public IScreenCaptureSourceList {
public:
    MockIScreenCaptureSourceList() = default;
    unsigned int getCount() override;
    ScreenCaptureSourceInfo getSourceInfo(unsigned int index) override;
    void release() override {}
};

} // namespace rtc
} // namespace agora
