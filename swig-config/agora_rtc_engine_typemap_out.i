// Result structs are returned by value from the bridge. The default SWIG
// SWIGTYPE typemap wraps the stack result as a JSB native object, which leaves
// JS with a dangling private pointer.
//
// For each type:
//   %ignore  → prevents JSB class wrapper, constructor, property accessors
//   %typemap(out) → returns a plain JS object instead

// --- GetVersionResult --------------------------------------------------
%ignore GetVersionResult;
%typemap(out) GetVersionResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("version", se::Value($1.version));
    obj->setProperty("build", se::Value($1.build));
    s.rval().setObject(obj);
%}

// --- QueryCodecCapabilityResult ----------------------------------------
%ignore QueryCodecCapabilityResult;
%typemap(out) QueryCodecCapabilityResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("size", se::Value(static_cast<int>($1.codecInfo.size())));
    s.rval().setObject(obj);
%}

// --- GetEffectsVolumeResult --------------------------------------------
%ignore GetEffectsVolumeResult;
%typemap(out) GetEffectsVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetAudioTrackCountResult ------------------------------------------
%ignore GetAudioTrackCountResult;
%typemap(out) GetAudioTrackCountResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("count", se::Value($1.count));
    s.rval().setObject(obj);
%}

// --- GetAudioMixingPublishVolumeResult ---------------------------------
%ignore GetAudioMixingPublishVolumeResult;
%typemap(out) GetAudioMixingPublishVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetAudioMixingPlayoutVolumeResult ---------------------------------
%ignore GetAudioMixingPlayoutVolumeResult;
%typemap(out) GetAudioMixingPlayoutVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetAudioMixingDurationResult --------------------------------------
%ignore GetAudioMixingDurationResult;
%typemap(out) GetAudioMixingDurationResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("duration", se::Value($1.duration));
    s.rval().setObject(obj);
%}

// --- GetAudioMixingCurrentPositionResult -------------------------------
%ignore GetAudioMixingCurrentPositionResult;
%typemap(out) GetAudioMixingCurrentPositionResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("position", se::Value($1.position));
    s.rval().setObject(obj);
%}

// --- GetVolumeOfEffectResult -------------------------------------------
%ignore GetVolumeOfEffectResult;
%typemap(out) GetVolumeOfEffectResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetEffectDurationResult -------------------------------------------
%ignore GetEffectDurationResult;
%typemap(out) GetEffectDurationResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("duration", se::Value($1.duration));
    s.rval().setObject(obj);
%}

// --- GetEffectCurrentPositionResult ------------------------------------
%ignore GetEffectCurrentPositionResult;
%typemap(out) GetEffectCurrentPositionResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("position", se::Value($1.position));
    s.rval().setObject(obj);
%}

// --- GetCameraMaxZoomFactorResult --------------------------------------
%ignore GetCameraMaxZoomFactorResult;
%typemap(out) GetCameraMaxZoomFactorResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("factor", se::Value($1.factor));
    s.rval().setObject(obj);
%}

// --- GetLoopbackRecordingVolumeResult ----------------------------------
%ignore GetLoopbackRecordingVolumeResult;
%typemap(out) GetLoopbackRecordingVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetNetworkTypeResult ----------------------------------------------
%ignore GetNetworkTypeResult;
%typemap(out) GetNetworkTypeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("type", se::Value($1.type));
    s.rval().setObject(obj);
%}

// --- GetFaceShapeBeautyOptionsResult -----------------------------------
%ignore GetFaceShapeBeautyOptionsResult;
%typemap(out) GetFaceShapeBeautyOptionsResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value optionsVal;
    nativevalue_to_se($1.options, optionsVal, s.thisObject());
    obj->setProperty("options", optionsVal);
    s.rval().setObject(obj);
%}

// --- GetFaceShapeAreaOptionsResult -------------------------------------
%ignore GetFaceShapeAreaOptionsResult;
%typemap(out) GetFaceShapeAreaOptionsResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value optionsVal;
    nativevalue_to_se($1.options, optionsVal, s.thisObject());
    obj->setProperty("options", optionsVal);
    s.rval().setObject(obj);
%}

// ─── RtcEngineExBridge.h ────────────────────────────────────────────────────

// --- GetExtensionPropertyResult ----------------------------------------
%ignore GetExtensionPropertyResult;
%typemap(out) GetExtensionPropertyResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("value", se::Value($1.value));
    s.rval().setObject(obj);
%}

// --- GetAudioDeviceInfoWithDeviceInfoResult (RtcEngineExBridge) ---------
%ignore GetAudioDeviceInfoWithDeviceInfoResult;
%typemap(out) GetAudioDeviceInfoWithDeviceInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value deviceInfoVal;
    nativevalue_to_se($1.deviceInfo, deviceInfoVal, s.thisObject());
    obj->setProperty("deviceInfo", deviceInfoVal);
    s.rval().setObject(obj);
%}

// --- GetCallIdResult ---------------------------------------------------
%ignore GetCallIdResult;
%typemap(out) GetCallIdResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("callId", se::Value($1.callId));
    s.rval().setObject(obj);
%}

// --- GetUserInfoResult -------------------------------------------------
%ignore GetUserInfoResult;
%typemap(out) GetUserInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value userInfoVal;
    nativevalue_to_se($1.userInfo, userInfoVal, s.thisObject());
    obj->setProperty("userInfo", userInfoVal);
    s.rval().setObject(obj);
%}

// --- QueryCameraFocalLengthCapabilityResult ----------------------------
%ignore QueryCameraFocalLengthCapabilityResult;
%typemap(out) QueryCameraFocalLengthCapabilityResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("size", se::Value(static_cast<int>($1.focalLengthInfos.size())));
    se::Value tmp;
    ok &= nativevalue_to_se($1.focalLengthInfos, tmp, s.thisObject());
    obj->setProperty("focalLengthInfos", tmp);
    s.rval().setObject(obj);
%}

// --- QueryHDRCapabilityResult ------------------------------------------
%ignore QueryHDRCapabilityResult;
%typemap(out) QueryHDRCapabilityResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("capability", se::Value($1.capability));
    s.rval().setObject(obj);
%}

// --- CreateDataStreamResult --------------------------------------------
%ignore CreateDataStreamResult;
%typemap(out) CreateDataStreamResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("streamId", se::Value($1.streamId));
    s.rval().setObject(obj);
%}

// ─── AudioDeviceManagerBridge.h ──────────────────────────────────────────────

// --- GetPlaybackDeviceResult -------------------------------------------
%ignore GetPlaybackDeviceResult;
%typemap(out) GetPlaybackDeviceResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}

// --- GetPlaybackDeviceInfoResult ---------------------------------------
%ignore GetPlaybackDeviceInfoResult;
%typemap(out) GetPlaybackDeviceInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    s.rval().setObject(obj);
%}

// --- GetPlaybackDeviceInfoExResult -------------------------------------
%ignore GetPlaybackDeviceInfoExResult;
%typemap(out) GetPlaybackDeviceInfoExResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    obj->setProperty("deviceTypeName", se::Value($1.deviceTypeName));
    s.rval().setObject(obj);
%}

// --- GetPlaybackDeviceVolumeResult -------------------------------------
%ignore GetPlaybackDeviceVolumeResult;
%typemap(out) GetPlaybackDeviceVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetRecordingDeviceResult ------------------------------------------
%ignore GetRecordingDeviceResult;
%typemap(out) GetRecordingDeviceResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}

// --- GetRecordingDeviceInfoResult --------------------------------------
%ignore GetRecordingDeviceInfoResult;
%typemap(out) GetRecordingDeviceInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    s.rval().setObject(obj);
%}

// --- GetRecordingDeviceInfoExResult ------------------------------------
%ignore GetRecordingDeviceInfoExResult;
%typemap(out) GetRecordingDeviceInfoExResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    obj->setProperty("deviceTypeName", se::Value($1.deviceTypeName));
    s.rval().setObject(obj);
%}

// --- GetRecordingDeviceVolumeResult ------------------------------------
%ignore GetRecordingDeviceVolumeResult;
%typemap(out) GetRecordingDeviceVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetLoopbackDeviceResult -------------------------------------------
%ignore GetLoopbackDeviceResult;
%typemap(out) GetLoopbackDeviceResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}

// --- GetPlaybackDeviceMuteResult ---------------------------------------
%ignore GetPlaybackDeviceMuteResult;
%typemap(out) GetPlaybackDeviceMuteResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("mute", se::Value($1.mute));
    s.rval().setObject(obj);
%}

// --- GetRecordingDeviceMuteResult --------------------------------------
%ignore GetRecordingDeviceMuteResult;
%typemap(out) GetRecordingDeviceMuteResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("mute", se::Value($1.mute));
    s.rval().setObject(obj);
%}

// ─── AudioDeviceCollectionBridge.h ───────────────────────────────────────────

// --- GetAudioDeviceInfoResult (AudioDeviceCollectionBridge) ------------
%ignore GetAudioDeviceInfoResult;
%typemap(out) GetAudioDeviceInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}

// --- GetAudioDeviceInfoExResult ----------------------------------------
%ignore GetAudioDeviceInfoExResult;
%typemap(out) GetAudioDeviceInfoExResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    obj->setProperty("deviceTypeName", se::Value($1.deviceTypeName));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}

// --- GetAudioDeviceVolumeResult ----------------------------------------
%ignore GetAudioDeviceVolumeResult;
%typemap(out) GetAudioDeviceVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetAudioDeviceMuteResult ------------------------------------------
%ignore GetAudioDeviceMuteResult;
%typemap(out) GetAudioDeviceMuteResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("mute", se::Value($1.mute));
    s.rval().setObject(obj);
%}

// ─── MediaPlayerCacheManagerBridge.h ─────────────────────────────────────────

// --- GetCacheDirResult -------------------------------------------------
%ignore GetCacheDirResult;
%typemap(out) GetCacheDirResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("path", se::Value($1.path));
    s.rval().setObject(obj);
%}

// --- GetMaxCacheFileCountResult ----------------------------------------
%ignore GetMaxCacheFileCountResult;
%typemap(out) GetMaxCacheFileCountResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("count", se::Value($1.count));
    s.rval().setObject(obj);
%}

// --- GetMaxCacheFileSizeResult -----------------------------------------
%ignore GetMaxCacheFileSizeResult;
%typemap(out) GetMaxCacheFileSizeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("cacheSize", se::Value($1.cacheSize));
    s.rval().setObject(obj);
%}

// --- GetCacheFileCountResult -------------------------------------------
%ignore GetCacheFileCountResult;
%typemap(out) GetCacheFileCountResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("count", se::Value($1.count));
    s.rval().setObject(obj);
%}

// ─── MediaPlayerBridge.h ─────────────────────────────────────────────────────

// --- GetDurationResult -------------------------------------------------
%ignore GetDurationResult;
%typemap(out) GetDurationResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("duration", se::Value($1.duration));
    s.rval().setObject(obj);
%}

// --- GetStreamCountResult ----------------------------------------------
%ignore GetStreamCountResult;
%typemap(out) GetStreamCountResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("count", se::Value($1.count));
    s.rval().setObject(obj);
%}

// --- GetStreamInfoResult -----------------------------------------------
%ignore GetStreamInfoResult;
%typemap(out) GetStreamInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value infoVal;
    nativevalue_to_se($1.info, infoVal, s.thisObject());
    obj->setProperty("info", infoVal);
    s.rval().setObject(obj);
%}

// --- GetMuteResult -----------------------------------------------------
%ignore GetMuteResult;
%typemap(out) GetMuteResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("muted", se::Value($1.muted));
    s.rval().setObject(obj);
%}

// --- GetPlayoutVolumeResult --------------------------------------------
%ignore GetPlayoutVolumeResult;
%typemap(out) GetPlayoutVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetPublishSignalVolumeResult --------------------------------------
%ignore GetPublishSignalVolumeResult;
%typemap(out) GetPublishSignalVolumeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("volume", se::Value($1.volume));
    s.rval().setObject(obj);
%}

// --- GetPlayPositionResult ---------------------------------------------
%ignore GetPlayPositionResult;
%typemap(out) GetPlayPositionResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("pos", se::Value($1.pos));
    s.rval().setObject(obj);
%}

// --- GetAudioBufferDelayResult -----------------------------------------
%ignore GetAudioBufferDelayResult;
%typemap(out) GetAudioBufferDelayResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("delayMs", se::Value($1.delayMs));
    s.rval().setObject(obj);
%}

// ─── MusicContentCenterBridge.h ──────────────────────────────────────────────

// --- GetCachesResult ---------------------------------------------------
%ignore GetCachesResult;
%typemap(out) GetCachesResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value tmp;
    nativevalue_to_se($1.caches, tmp, s.thisObject());
    obj->setProperty("caches", tmp);
    s.rval().setObject(obj);
%}

// --- GetInternalSongCodeResult -----------------------------------------
%ignore GetInternalSongCodeResult;
%typemap(out) GetInternalSongCodeResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("internalSongCode", se::Value($1.internalSongCode));
    s.rval().setObject(obj);
%}

// --- MCCRequestResult --------------------------------------------------
%ignore MCCRequestResult;
%typemap(out) MCCRequestResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("requestId", se::Value($1.requestId));
    s.rval().setObject(obj);
%}

// ─── VideoDeviceManagerBridge.h ──────────────────────────────────────────────

// --- GetVideoDeviceResult ----------------------------------------------
%ignore GetVideoDeviceResult;
%typemap(out) GetVideoDeviceResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}

// --- VideoDeviceCapabilityResult ---------------------------------------
%ignore VideoDeviceCapabilityResult;
%typemap(out) VideoDeviceCapabilityResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    se::Value capabilityVal;
    nativevalue_to_se($1.capability, capabilityVal, s.thisObject());
    obj->setProperty("capability", capabilityVal);
    s.rval().setObject(obj);
%}

// ─── VideoDeviceCollectionBridge.h ───────────────────────────────────────────

// --- GetVideoDeviceInfoResult ------------------------------------------
%ignore GetVideoDeviceInfoResult;
%typemap(out) GetVideoDeviceInfoResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("deviceName", se::Value($1.deviceName));
    obj->setProperty("deviceId", se::Value($1.deviceId));
    s.rval().setObject(obj);
%}
