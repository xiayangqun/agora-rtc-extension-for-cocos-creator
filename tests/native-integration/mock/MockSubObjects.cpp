#include "MockSubObjects.h"
#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

using namespace agora::rtc::mock;

namespace agora {
namespace rtc {

// ═══════════════════════════════════════════════════════════════════════════
// MockIMediaPlayer
// ═══════════════════════════════════════════════════════════════════════════

int MockIMediaPlayer::getMediaPlayerId() const {
    MockLog::instance().appendLog("getId", "{}");
    return id_;
}

int MockIMediaPlayer::open(const char* url, int64_t startPos) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(url ? url : "", a); d.AddMember("url", v, a); }
    d.AddMember("startPos", static_cast<int64_t>(startPos), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("open", buf.GetString());
    return 0;
}

int MockIMediaPlayer::openWithMediaSource(const media::base::MediaSource& source) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(source.url ? source.url : "", a); d.AddMember("url", v, a); }
    { rapidjson::Value v; v.SetString(source.uri ? source.uri : "", a); d.AddMember("uri", v, a); }
    d.AddMember("startPos", static_cast<int64_t>(source.startPos), a);
    d.AddMember("autoPlay", source.autoPlay, a);
    d.AddMember("enableCache", source.enableCache, a);
    d.AddMember("enableMultiAudioTrack", source.enableMultiAudioTrack, a);
    if (source.isAgoraSource.has_value()) {
        d.AddMember("isAgoraSource", source.isAgoraSource.value(), a);
    }
    if (source.isLiveSource.has_value()) {
        d.AddMember("isLiveSource", source.isLiveSource.value(), a);
    }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("openWithMediaSource", buf.GetString());
    return 0;
}

int MockIMediaPlayer::play() { MockLog::instance().appendLog("play", "{}"); return 0; }
int MockIMediaPlayer::pause() { MockLog::instance().appendLog("pause", "{}"); return 0; }
int MockIMediaPlayer::stop() { MockLog::instance().appendLog("stop", "{}"); return 0; }
int MockIMediaPlayer::resume() { MockLog::instance().appendLog("resume", "{}"); return 0; }

int MockIMediaPlayer::seek(int64_t newPos) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("newPos", static_cast<int64_t>(newPos), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("seek", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setAudioPitch(int pitch) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("pitch", pitch, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setAudioPitch", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getDuration(int64_t& duration) { duration = 0; MockLog::instance().appendLog("getDuration", "{}"); return 0; }
int MockIMediaPlayer::getPlayPosition(int64_t& pos) { pos = 0; MockLog::instance().appendLog("getPlayPosition", "{}"); return 0; }
int MockIMediaPlayer::getStreamCount(int64_t& count) { count = 0; MockLog::instance().appendLog("getStreamCount", "{}"); return 0; }
int MockIMediaPlayer::getStreamInfo(int64_t index, media::base::PlayerStreamInfo* info) { MockLog::instance().appendLog("getStreamInfo", "{}"); return 0; }

int MockIMediaPlayer::setLoopCount(int loopCount) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("loopCount", loopCount, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setLoopCount", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setPlaybackSpeed(int speed) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("speed", speed, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlaybackSpeed", buf.GetString());
    return 0;
}

int MockIMediaPlayer::selectAudioTrack(int index) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("selectAudioTrack", buf.GetString());
    return 0;
}

int MockIMediaPlayer::selectMultiAudioTrack(int playoutTrackIndex, int publishTrackIndex) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("playoutTrackIndex", playoutTrackIndex, a);
    d.AddMember("publishTrackIndex", publishTrackIndex, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("selectMultiAudioTrack", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setPlayerOption(const char* key, int value) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    d.AddMember("value", value, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlayerOption", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setPlayerOption(const char* key, const char* value) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    { rapidjson::Value v; v.SetString(value ? value : "", a); d.AddMember("value", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlayerOption", buf.GetString());
    return 0;
}

int MockIMediaPlayer::takeScreenshot(const char* filename) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(filename ? filename : "", a); d.AddMember("filename", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("takeScreenshot", buf.GetString());
    return 0;
}

int MockIMediaPlayer::selectInternalSubtitle(int index) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("selectInternalSubtitle", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setExternalSubtitle(const char* url) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(url ? url : "", a); d.AddMember("url", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setExternalSubtitle", buf.GetString());
    return 0;
}

media::base::MEDIA_PLAYER_STATE MockIMediaPlayer::getState() {
    MockLog::instance().appendLog("getState", "{}");
    return media::base::PLAYER_STATE_IDLE;
}

int MockIMediaPlayer::mute(bool muted) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("muted", muted, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("mute", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getMute(bool& muted) { muted = false; MockLog::instance().appendLog("getMute", "{}"); return 0; }

int MockIMediaPlayer::adjustPlayoutVolume(int volume) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("adjustPlayoutVolume", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getPlayoutVolume(int& volume) { volume = 0; MockLog::instance().appendLog("getPlayoutVolume", "{}"); return 0; }

int MockIMediaPlayer::adjustPublishSignalVolume(int volume) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("adjustPublishSignalVolume", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getPublishSignalVolume(int& volume) { volume = 0; MockLog::instance().appendLog("getPublishSignalVolume", "{}"); return 0; }

int MockIMediaPlayer::registerPlayerSourceObserver(IMediaPlayerSourceObserver* observer) {
    playerSourceObserver = observer;
    MockLog::instance().appendLog("registerPlayerSourceObserver", "{}");
    return 0;
}
int MockIMediaPlayer::unregisterPlayerSourceObserver(IMediaPlayerSourceObserver* observer) {
    playerSourceObserver = nullptr;
    MockLog::instance().appendLog("unregisterPlayerSourceObserver", "{}");
    return 0;
}

int MockIMediaPlayer::setAudioDualMonoMode(media::base::AUDIO_DUAL_MONO_MODE mode) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("mode", static_cast<int>(mode), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setAudioDualMonoMode", buf.GetString());
    return 0;
}

const char* MockIMediaPlayer::getPlayerSdkVersion() { MockLog::instance().appendLog("getPlayerSdkVersion", "{}"); return "1.0.0-mock"; }
const char* MockIMediaPlayer::getPlaySrc() { MockLog::instance().appendLog("getPlaySrc", "{}"); return ""; }

int MockIMediaPlayer::openWithAgoraCDNSrc(const char* src, int64_t startPos) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(src ? src : "", a); d.AddMember("src", v, a); }
    d.AddMember("startPos", static_cast<int64_t>(startPos), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("openWithAgoraCDNSrc", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getAgoraCDNLineCount() { MockLog::instance().appendLog("getAgoraCDNLineCount", "{}"); return 0; }

int MockIMediaPlayer::switchAgoraCDNLineByIndex(int index) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("switchAgoraCDNLineByIndex", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getCurrentAgoraCDNIndex() { MockLog::instance().appendLog("getCurrentAgoraCDNIndex", "{}"); return 0; }

int MockIMediaPlayer::enableAutoSwitchAgoraCDN(bool enable) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("enable", enable, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("enableAutoSwitchAgoraCDN", buf.GetString());
    return 0;
}

int MockIMediaPlayer::renewAgoraCDNSrcToken(const char* token, int64_t ts) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    d.AddMember("ts", static_cast<int64_t>(ts), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("renewAgoraCDNSrcToken", buf.GetString());
    return 0;
}

int MockIMediaPlayer::switchAgoraCDNSrc(const char* src, bool syncPts) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(src ? src : "", a); d.AddMember("src", v, a); }
    d.AddMember("syncPts", syncPts, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("switchAgoraCDNSrc", buf.GetString());
    return 0;
}

int MockIMediaPlayer::switchSrc(const char* src, bool syncPts) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(src ? src : "", a); d.AddMember("src", v, a); }
    d.AddMember("syncPts", syncPts, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("switchSrc", buf.GetString());
    return 0;
}

int MockIMediaPlayer::preloadSrc(const char* src, int64_t startPos) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(src ? src : "", a); d.AddMember("src", v, a); }
    d.AddMember("startPos", static_cast<int64_t>(startPos), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("preloadSrc", buf.GetString());
    return 0;
}

int MockIMediaPlayer::playPreloadedSrc(const char* src) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(src ? src : "", a); d.AddMember("src", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("playPreloadedSrc", buf.GetString());
    return 0;
}

int MockIMediaPlayer::unloadSrc(const char* src) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(src ? src : "", a); d.AddMember("src", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("unloadSrc", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setSpatialAudioParams(const SpatialAudioParams& params) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    if (params.speaker_azimuth) d.AddMember("speaker_azimuth", params.speaker_azimuth.value(), a);
    if (params.speaker_elevation) d.AddMember("speaker_elevation", params.speaker_elevation.value(), a);
    if (params.speaker_distance) d.AddMember("speaker_distance", params.speaker_distance.value(), a);
    if (params.speaker_orientation) d.AddMember("speaker_orientation", params.speaker_orientation.value(), a);
    if (params.enable_blur) d.AddMember("enable_blur", params.enable_blur.value(), a);
    if (params.enable_air_absorb) d.AddMember("enable_air_absorb", params.enable_air_absorb.value(), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setSpatialAudioParams", buf.GetString());
    return 0;
}

int MockIMediaPlayer::setSoundPositionParams(float pan, float gain) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("pan", static_cast<double>(pan), a);
    d.AddMember("gain", static_cast<double>(gain), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setSoundPositionParams", buf.GetString());
    return 0;
}

int MockIMediaPlayer::getAudioBufferDelay(int32_t& delayMs) { delayMs = 0; MockLog::instance().appendLog("getAudioBufferDelay", "{}"); return 0; }

// ═══════════════════════════════════════════════════════════════════════════
// MockIMediaRecorder
// ═══════════════════════════════════════════════════════════════════════════

int MockIMediaRecorder::setMediaRecorderObserver(media::IMediaRecorderObserver* callback) {
    recorderObserver = callback;
    MockLog::instance().appendLog("setMediaRecorderObserver", "{}");
    return 0;
}

int MockIMediaRecorder::startRecording(const media::MediaRecorderConfiguration& config) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(config.storagePath ? config.storagePath : "", a); d.AddMember("storagePath", v, a); }
    d.AddMember("containerFormat", static_cast<int>(config.containerFormat), a);
    d.AddMember("streamType", static_cast<int>(config.streamType), a);
    d.AddMember("maxDurationMs", config.maxDurationMs, a);
    d.AddMember("recorderInfoUpdateInterval", config.recorderInfoUpdateInterval, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("startRecording", buf.GetString());
    return 0;
}

int MockIMediaRecorder::stopRecording() { MockLog::instance().appendLog("stopRecording", "{}"); return 0; }

// ═══════════════════════════════════════════════════════════════════════════
// MockIAudioDeviceCollection
// ═══════════════════════════════════════════════════════════════════════════

int MockIAudioDeviceCollection::getCount() {
    MockLog::instance().appendLog("getCount", "{}");
    return 0;
}

int MockIAudioDeviceCollection::getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getDevice", buf.GetString());
    if (deviceName) strcpy(deviceName, "mock-audio-device");
    if (deviceId) strcpy(deviceId, "mock-audio-device-id");
    return 0;
}

int MockIAudioDeviceCollection::getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH],
                                          char deviceId[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getDeviceEx", buf.GetString());
    if (deviceName) strcpy(deviceName, "mock-audio-device");
    if (deviceTypeName) strcpy(deviceTypeName, "mock-audio-device-type");
    if (deviceId) strcpy(deviceId, "mock-audio-device-id");
    return 0;
}

int MockIAudioDeviceCollection::setDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceId ? deviceId : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setDevice", buf.GetString());
    return 0;
}

int MockIAudioDeviceCollection::getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) {
    MockLog::instance().appendLog("getDefaultDevice", "{}");
    if (deviceName) strcpy(deviceName, "mock-default-audio-device");
    if (deviceId) strcpy(deviceId, "mock-default-audio-device-id");
    return 0;
}

int MockIAudioDeviceCollection::getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH],
                                                  char deviceId[MAX_DEVICE_ID_LENGTH]) {
    MockLog::instance().appendLog("getDefaultDeviceEx", "{}");
    if (deviceName) strcpy(deviceName, "mock-default-audio-device");
    if (deviceTypeName) strcpy(deviceTypeName, "mock-default-audio-device-type");
    if (deviceId) strcpy(deviceId, "mock-default-audio-device-id");
    return 0;
}

int MockIAudioDeviceCollection::setApplicationVolume(int volume) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setApplicationVolume", buf.GetString());
    return 0;
}

int MockIAudioDeviceCollection::getApplicationVolume(int &volume) {
    MockLog::instance().appendLog("getApplicationVolume", "{}");
    volume = 50;
    return 0;
}

int MockIAudioDeviceCollection::setApplicationMute(bool mute) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setApplicationMute", buf.GetString());
    return 0;
}

int MockIAudioDeviceCollection::isApplicationMute(bool &mute) {
    MockLog::instance().appendLog("isApplicationMute", "{}");
    mute = false;
    return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockIVideoDeviceCollection
// ═══════════════════════════════════════════════════════════════════════════

int MockIVideoDeviceCollection::getCount() {
    MockLog::instance().appendLog("getCount", "{}");
    return 0;
}

int MockIVideoDeviceCollection::setDevice(const char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceIdUTF8 ? deviceIdUTF8 : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setDevice", buf.GetString());
    return 0;
}

int MockIVideoDeviceCollection::getDevice(int index, char deviceNameUTF8[MAX_DEVICE_ID_LENGTH], char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getDevice", buf.GetString());
    if (deviceNameUTF8) strcpy(deviceNameUTF8, "mock-video-device");
    if (deviceIdUTF8) strcpy(deviceIdUTF8, "mock-video-device-id");
    return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockIAudioDeviceManager
// ═══════════════════════════════════════════════════════════════════════════

IAudioDeviceCollection* MockIAudioDeviceManager::enumeratePlaybackDevices() { MockLog::instance().appendLog("enumeratePlaybackDevices", "{}"); return playbackCollection_; }
IAudioDeviceCollection* MockIAudioDeviceManager::enumerateRecordingDevices() { MockLog::instance().appendLog("enumerateRecordingDevices", "{}"); return recordingCollection_; }

int MockIAudioDeviceManager::setPlaybackDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceId ? deviceId : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlaybackDevice", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getPlaybackDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getPlaybackDevice", "{}"); return 0; }
int MockIAudioDeviceManager::getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getPlaybackDeviceInfo", "{}"); return 0; }
int MockIAudioDeviceManager::getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getPlaybackDeviceInfo", "{}"); return 0; }
int MockIAudioDeviceManager::setPlaybackDeviceVolume(int volume) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlaybackDeviceVolume", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getPlaybackDeviceVolume(int* volume) { if (volume) *volume = 0; MockLog::instance().appendLog("getPlaybackDeviceVolume", "{}"); return 0; }
int MockIAudioDeviceManager::setRecordingDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceId ? deviceId : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setRecordingDevice", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getRecordingDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getRecordingDevice", "{}"); return 0; }
int MockIAudioDeviceManager::getRecordingDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getRecordingDeviceInfo", "{}"); return 0; }
int MockIAudioDeviceManager::getRecordingDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getRecordingDeviceInfo", "{}"); return 0; }
int MockIAudioDeviceManager::setRecordingDeviceVolume(int volume) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("volume", volume, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setRecordingDeviceVolume", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getRecordingDeviceVolume(int* volume) { if (volume) *volume = 0; MockLog::instance().appendLog("getRecordingDeviceVolume", "{}"); return 0; }
int MockIAudioDeviceManager::setLoopbackDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceId ? deviceId : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setLoopbackDevice", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getLoopbackDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getLoopbackDevice", "{}"); return 0; }
int MockIAudioDeviceManager::setPlaybackDeviceMute(bool mute) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlaybackDeviceMute", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getPlaybackDeviceMute(bool* mute) { if (mute) *mute = false; MockLog::instance().appendLog("getPlaybackDeviceMute", "{}"); return 0; }
int MockIAudioDeviceManager::setRecordingDeviceMute(bool mute) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setRecordingDeviceMute", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::getRecordingDeviceMute(bool* mute) { if (mute) *mute = false; MockLog::instance().appendLog("getRecordingDeviceMute", "{}"); return 0; }
int MockIAudioDeviceManager::startPlaybackDeviceTest(const char* testAudioFilePath) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(testAudioFilePath ? testAudioFilePath : "", a); d.AddMember("testAudioFilePath", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("startPlaybackDeviceTest", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::stopPlaybackDeviceTest() { MockLog::instance().appendLog("stopPlaybackDeviceTest", "{}"); return 0; }
int MockIAudioDeviceManager::startRecordingDeviceTest(int indicationInterval) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("indicationInterval", indicationInterval, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("startRecordingDeviceTest", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::stopRecordingDeviceTest() { MockLog::instance().appendLog("stopRecordingDeviceTest", "{}"); return 0; }
int MockIAudioDeviceManager::startAudioDeviceLoopbackTest(int indicationInterval) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("indicationInterval", indicationInterval, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("startAudioDeviceLoopbackTest", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::stopAudioDeviceLoopbackTest() { MockLog::instance().appendLog("stopAudioDeviceLoopbackTest", "{}"); return 0; }
int MockIAudioDeviceManager::followSystemPlaybackDevice(bool enable) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("enable", enable, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("followSystemPlaybackDevice", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::followSystemRecordingDevice(bool enable) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("enable", enable, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("followSystemRecordingDevice", buf.GetString());
    return 0;
}
int MockIAudioDeviceManager::followSystemLoopbackDevice(bool enable) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("enable", enable, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("followSystemLoopbackDevice", buf.GetString());
    return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockIVideoDeviceManager
// ═══════════════════════════════════════════════════════════════════════════

IVideoDeviceCollection* MockIVideoDeviceManager::enumerateVideoDevices() { MockLog::instance().appendLog("enumerateVideoDevices", "{}"); return videoCollection_; }
int MockIVideoDeviceManager::setDevice(const char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceIdUTF8 ? deviceIdUTF8 : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setDevice", buf.GetString());
    return 0;
}
int MockIVideoDeviceManager::getDevice(char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) { MockLog::instance().appendLog("getDevice", "{}"); return 0; }
int MockIVideoDeviceManager::numberOfCapabilities(const char* deviceIdUTF8) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceIdUTF8 ? deviceIdUTF8 : "", a); d.AddMember("deviceId", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("numberOfCapabilities", buf.GetString());
    return 0;
}
int MockIVideoDeviceManager::getCapability(const char* deviceIdUTF8, const uint32_t deviceCapabilityNumber, VideoFormat&) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(deviceIdUTF8 ? deviceIdUTF8 : "", a); d.AddMember("deviceId", v, a); }
    d.AddMember("deviceCapabilityNumber", deviceCapabilityNumber, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getCapability", buf.GetString());
    return 0;
}
int MockIVideoDeviceManager::stopDeviceTest() { MockLog::instance().appendLog("stopDeviceTest", "{}"); return 0; }

// ═══════════════════════════════════════════════════════════════════════════
// MockIH265Transcoder
// ═══════════════════════════════════════════════════════════════════════════

int MockIH265Transcoder::enableTranscode(const char* token, const char* channel, uid_t uid) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; v.SetString(channel ? channel : "", a); d.AddMember("channel", v, a); }
    d.AddMember("uid", static_cast<int>(uid), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("enableTranscode", buf.GetString());
    return 0;
}
int MockIH265Transcoder::queryChannel(const char* token, const char* channel, uid_t uid) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; v.SetString(channel ? channel : "", a); d.AddMember("channel", v, a); }
    d.AddMember("uid", static_cast<int>(uid), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("queryChannel", buf.GetString());
    return 0;
}
int MockIH265Transcoder::triggerTranscode(const char* token, const char* channel, uid_t uid) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    { rapidjson::Value v; v.SetString(channel ? channel : "", a); d.AddMember("channel", v, a); }
    d.AddMember("uid", static_cast<int>(uid), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("triggerTranscode", buf.GetString());
    return 0;
}
int MockIH265Transcoder::registerTranscoderObserver(IH265TranscoderObserver* observer) {
    transcoderObserver = observer;
    MockLog::instance().appendLog("registerTranscoderObserver", "{}");
    return 0;
}
int MockIH265Transcoder::unregisterTranscoderObserver(IH265TranscoderObserver* observer) {
    transcoderObserver = nullptr;
    MockLog::instance().appendLog("unregisterTranscoderObserver", "{}");
    return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockILocalSpatialAudioEngine
// ═══════════════════════════════════════════════════════════════════════════

int MockILocalSpatialAudioEngine::setMaxAudioRecvCount(int maxCount) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("maxCount", maxCount, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setMaxAudioRecvCount", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::setAudioRecvRange(float range) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("range", static_cast<double>(range), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setAudioRecvRange", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::setDistanceUnit(float unit) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("unit", static_cast<double>(unit), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setDistanceUnit", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::updateSelfPosition(const float position[3], const float axisForward[3], const float axisRight[3], const float axisUp[3]) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    rapidjson::Value pos(rapidjson::kArrayType);
    for (int i = 0; i < 3; i++) pos.PushBack(static_cast<double>(position[i]), a);
    d.AddMember("position", pos, a);
    rapidjson::Value fwd(rapidjson::kArrayType);
    for (int i = 0; i < 3; i++) fwd.PushBack(static_cast<double>(axisForward[i]), a);
    d.AddMember("axisForward", fwd, a);
    rapidjson::Value right(rapidjson::kArrayType);
    for (int i = 0; i < 3; i++) right.PushBack(static_cast<double>(axisRight[i]), a);
    d.AddMember("axisRight", right, a);
    rapidjson::Value up(rapidjson::kArrayType);
    for (int i = 0; i < 3; i++) up.PushBack(static_cast<double>(axisUp[i]), a);
    d.AddMember("axisUp", up, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("updateSelfPosition", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::updateSelfPositionEx(const float[3], const float[3], const float[3], const float[3], const RtcConnection&) { MockLog::instance().appendLog("updateSelfPositionEx", "{}"); return 0; }
int MockILocalSpatialAudioEngine::updatePlayerPositionInfo(int playerId, const RemoteVoicePositionInfo& positionInfo) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("playerId", playerId, a);
    rapidjson::Value infoObj(rapidjson::kObjectType);
    { rapidjson::Value pos(rapidjson::kArrayType); for (int i = 0; i < 3; i++) pos.PushBack(static_cast<double>(positionInfo.position[i]), a); infoObj.AddMember("position", pos, a); }
    { rapidjson::Value fwd(rapidjson::kArrayType); for (int i = 0; i < 3; i++) fwd.PushBack(static_cast<double>(positionInfo.forward[i]), a); infoObj.AddMember("forward", fwd, a); }
    d.AddMember("positionInfo", infoObj, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("updatePlayerPositionInfo", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::updateRemotePosition(uid_t uid, const RemoteVoicePositionInfo& posInfo) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    rapidjson::Value infoObj(rapidjson::kObjectType);
    { rapidjson::Value pos(rapidjson::kArrayType); for (int i = 0; i < 3; i++) pos.PushBack(static_cast<double>(posInfo.position[i]), a); infoObj.AddMember("position", pos, a); }
    { rapidjson::Value fwd(rapidjson::kArrayType); for (int i = 0; i < 3; i++) fwd.PushBack(static_cast<double>(posInfo.forward[i]), a); infoObj.AddMember("forward", fwd, a); }
    d.AddMember("posInfo", infoObj, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("updateRemotePosition", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::updateRemotePositionEx(uid_t, const RemoteVoicePositionInfo&, const RtcConnection&) { MockLog::instance().appendLog("updateRemotePositionEx", "{}"); return 0; }
int MockILocalSpatialAudioEngine::removeRemotePosition(uid_t uid) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("uid", static_cast<int>(uid), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("removeRemotePosition", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::removeRemotePositionEx(uid_t, const RtcConnection&) { MockLog::instance().appendLog("removeRemotePositionEx", "{}"); return 0; }
int MockILocalSpatialAudioEngine::clearRemotePositions() { MockLog::instance().appendLog("clearRemotePositions", "{}"); return 0; }
int MockILocalSpatialAudioEngine::clearRemotePositionsEx(const RtcConnection&) { MockLog::instance().appendLog("clearRemotePositionsEx", "{}"); return 0; }
int MockILocalSpatialAudioEngine::setParameters(const char* params) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(params ? params : "", a); d.AddMember("params", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setParameters", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::muteLocalAudioStream(bool mute) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("muteLocalAudioStream", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::muteAllRemoteAudioStreams(bool mute) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("mute", mute, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("muteAllRemoteAudioStreams", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::muteRemoteAudioStream(uid_t uid, bool mute) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("mute", mute, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("muteRemoteAudioStream", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::setRemoteAudioAttenuation(uid_t uid, double attenuation, bool forceSet) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("uid", static_cast<int>(uid), a);
    d.AddMember("attenuation", attenuation, a);
    d.AddMember("forceSet", forceSet, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setRemoteAudioAttenuation", buf.GetString());
    return 0;
}
int MockILocalSpatialAudioEngine::setZones(const SpatialAudioZone*, unsigned int) { MockLog::instance().appendLog("setZones", "{}"); return 0; }
int MockILocalSpatialAudioEngine::setPlayerAttenuation(int playerId, double attenuation, bool forceSet) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("playerId", playerId, a);
    d.AddMember("attenuation", attenuation, a);
    d.AddMember("forceSet", forceSet, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setPlayerAttenuation", buf.GetString());
    return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockIMusicContentCenter
// ═══════════════════════════════════════════════════════════════════════════

int MockIMusicContentCenter::initialize(const MusicContentCenterConfiguration&) { MockLog::instance().appendLog("initialize", "{}"); return 0; }
int MockIMusicContentCenter::renewToken(const char* token) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(token ? token : "", a); d.AddMember("token", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("renewToken", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::registerEventHandler(IMusicContentCenterEventHandler* eventHandler) {
    musicContentCenterEventHandler = eventHandler;
    MockLog::instance().appendLog("registerEventHandler", "{}");
    return 0;
}
int MockIMusicContentCenter::unregisterEventHandler() {
    musicContentCenterEventHandler = nullptr;
    MockLog::instance().appendLog("unregisterEventHandler", "{}");
    return 0;
}
agora_refptr<IMusicPlayer> MockIMusicContentCenter::createMusicPlayer() { MockLog::instance().appendLog("createMusicPlayer", "{}"); return nullptr; }
int MockIMusicContentCenter::destroyMusicPlayer(agora_refptr<IMusicPlayer>) { MockLog::instance().appendLog("destroyMusicPlayer", "{}"); return 0; }
int MockIMusicContentCenter::getMusicCharts(agora::util::AString& requestId) { setMockAString(requestId, "mock-request-id"); MockLog::instance().appendLog("getMusicCharts", "{}"); return 0; }
int MockIMusicContentCenter::getMusicCollectionByMusicChartId(agora::util::AString& requestId, int32_t musicChartId, int32_t page, int32_t pageSize, const char* jsonOption) {
    setMockAString(requestId, "mock-request-id");
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("musicChartId", musicChartId, a);
    d.AddMember("page", page, a);
    d.AddMember("pageSize", pageSize, a);
    { rapidjson::Value v; v.SetString(jsonOption ? jsonOption : "", a); d.AddMember("jsonOption", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getMusicCollectionByMusicChartId", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::searchMusic(agora::util::AString& requestId, const char* keyWord, int32_t page, int32_t pageSize, const char* jsonOption) {
    setMockAString(requestId, "mock-request-id");
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(keyWord ? keyWord : "", a); d.AddMember("keyword", v, a); }
    d.AddMember("page", page, a);
    d.AddMember("pageSize", pageSize, a);
    { rapidjson::Value v; v.SetString(jsonOption ? jsonOption : "", a); d.AddMember("jsonOption", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("searchMusic", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::preload(int64_t songCode, const char* jsonOption) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("songCode", static_cast<int64_t>(songCode), a);
    { rapidjson::Value v; v.SetString(jsonOption ? jsonOption : "", a); d.AddMember("jsonOption", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("preload", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::preload(agora::util::AString& requestId, int64_t songCode) {
    setMockAString(requestId, "mock-request-id");
    rapidjson::Document d; d.SetObject();
    d.AddMember("songCode", static_cast<int64_t>(songCode), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("preload", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::removeCache(int64_t songCode) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("songCode", static_cast<int64_t>(songCode), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("removeCache", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::getCaches(MusicCacheInfo*, int32_t* cacheInfoSize) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("cacheInfoSize", cacheInfoSize ? *cacheInfoSize : 0, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getCaches", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::isPreloaded(int64_t songCode) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("songCode", static_cast<int64_t>(songCode), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("isPreloaded", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::getLyric(agora::util::AString& requestId, int64_t songCode, int32_t lyricType) {
    setMockAString(requestId, "mock-request-id");
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("songCode", static_cast<int64_t>(songCode), a);
    d.AddMember("lyricType", lyricType, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getLyric", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::getSongSimpleInfo(agora::util::AString& requestId, int64_t songCode) {
    setMockAString(requestId, "mock-request-id");
    rapidjson::Document d; d.SetObject();
    d.AddMember("songCode", static_cast<int64_t>(songCode), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getSongSimpleInfo", buf.GetString());
    return 0;
}
int MockIMusicContentCenter::getInternalSongCode(int64_t songCode, const char* jsonOption, int64_t& internalSongCode) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("songCode", static_cast<int64_t>(songCode), a);
    { rapidjson::Value v; v.SetString(jsonOption ? jsonOption : "", a); d.AddMember("jsonOption", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getInternalSongCode", buf.GetString());
    internalSongCode = 0;
    return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockIMediaPlayerCacheManager
// ═══════════════════════════════════════════════════════════════════════════

int MockIMediaPlayerCacheManager::removeAllCaches() { MockLog::instance().appendLog("removeAllCaches", "{}"); return 0; }
int MockIMediaPlayerCacheManager::removeOldCache() { MockLog::instance().appendLog("removeOldCache", "{}"); return 0; }
int MockIMediaPlayerCacheManager::removeCacheByUri(const char* uri) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(uri ? uri : "", a); d.AddMember("uri", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("removeCacheByUri", buf.GetString());
    return 0;
}
int MockIMediaPlayerCacheManager::setCacheDir(const char* path) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(path ? path : "", a); d.AddMember("path", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setCacheDir", buf.GetString());
    return 0;
}
int MockIMediaPlayerCacheManager::setMaxCacheFileCount(int count) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("count", count, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setMaxCacheFileCount", buf.GetString());
    return 0;
}
int MockIMediaPlayerCacheManager::setMaxCacheFileSize(int64_t cacheSize) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("cacheSize", static_cast<int64_t>(cacheSize), d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setMaxCacheFileSize", buf.GetString());
    return 0;
}
int MockIMediaPlayerCacheManager::enableAutoRemoveCache(bool enable) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("enable", enable, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("enableAutoRemoveCache", buf.GetString());
    return 0;
}
int MockIMediaPlayerCacheManager::getCacheDir(char*, int) { MockLog::instance().appendLog("getCacheDir", "{}"); return 0; }
int MockIMediaPlayerCacheManager::getMaxCacheFileCount() { MockLog::instance().appendLog("getMaxCacheFileCount", "{}"); return 0; }
int64_t MockIMediaPlayerCacheManager::getMaxCacheFileSize() { MockLog::instance().appendLog("getMaxCacheFileSize", "{}"); return 0; }
int MockIMediaPlayerCacheManager::getCacheFileCount() { MockLog::instance().appendLog("getCacheFileCount", "{}"); return 0; }

// ═══════════════════════════════════════════════════════════════════════════
// MockIVideoEffectObject
// ═══════════════════════════════════════════════════════════════════════════

int MockIVideoEffectObject::addOrUpdateVideoEffect(uint32_t nodeId, const char* templateName) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("nodeId", nodeId, a);
    { rapidjson::Value v; v.SetString(templateName ? templateName : "", a); d.AddMember("templateName", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("addOrUpdateVideoEffect", buf.GetString());
    return 0;
}
int MockIVideoEffectObject::removeVideoEffect(uint32_t nodeId) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("nodeId", nodeId, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("removeVideoEffect", buf.GetString());
    return 0;
}
int MockIVideoEffectObject::performVideoEffectAction(uint32_t nodeId, VIDEO_EFFECT_ACTION actionId) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    d.AddMember("nodeId", nodeId, a);
    d.AddMember("actionId", static_cast<int>(actionId), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("performVideoEffectAction", buf.GetString());
    return 0;
}
int MockIVideoEffectObject::setVideoEffectFloatParam(const char* option, const char* key, float param) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(option ? option : "", a); d.AddMember("option", v, a); }
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    d.AddMember("param", static_cast<double>(param), a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setVideoEffectFloatParam", buf.GetString());
    return 0;
}
int MockIVideoEffectObject::setVideoEffectIntParam(const char* option, const char* key, int param) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(option ? option : "", a); d.AddMember("option", v, a); }
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    d.AddMember("param", param, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setVideoEffectIntParam", buf.GetString());
    return 0;
}
int MockIVideoEffectObject::setVideoEffectBoolParam(const char* option, const char* key, bool param) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(option ? option : "", a); d.AddMember("option", v, a); }
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    d.AddMember("param", param, a);
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("setVideoEffectBoolParam", buf.GetString());
    return 0;
}
float MockIVideoEffectObject::getVideoEffectFloatParam(const char* option, const char* key) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(option ? option : "", a); d.AddMember("option", v, a); }
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getVideoEffectFloatParam", buf.GetString());
    return 0.0f;
}
int MockIVideoEffectObject::getVideoEffectIntParam(const char* option, const char* key) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(option ? option : "", a); d.AddMember("option", v, a); }
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getVideoEffectIntParam", buf.GetString());
    return 0;
}
bool MockIVideoEffectObject::getVideoEffectBoolParam(const char* option, const char* key) {
    rapidjson::Document d; d.SetObject(); auto& a = d.GetAllocator();
    { rapidjson::Value v; v.SetString(option ? option : "", a); d.AddMember("option", v, a); }
    { rapidjson::Value v; v.SetString(key ? key : "", a); d.AddMember("key", v, a); }
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getVideoEffectBoolParam", buf.GetString());
    return false;
}

// ═══════════════════════════════════════════════════════════════════════════
// MockIScreenCaptureSourceList
// ═══════════════════════════════════════════════════════════════════════════

unsigned int MockIScreenCaptureSourceList::getCount() { MockLog::instance().appendLog("getCount", "{}"); return 0; }
ScreenCaptureSourceInfo MockIScreenCaptureSourceList::getSourceInfo(unsigned int index) {
    rapidjson::Document d; d.SetObject();
    d.AddMember("index", index, d.GetAllocator());
    rapidjson::StringBuffer buf; rapidjson::Writer<rapidjson::StringBuffer> w(buf); d.Accept(w);
    MockLog::instance().appendLog("getSourceInfo", buf.GetString());
    return {};
}

} // namespace rtc
} // namespace agora
