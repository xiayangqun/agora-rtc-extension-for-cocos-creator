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
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("build", se::Value($1.build));
    s.rval().setObject(obj);
%}

// --- QueryCodecCapabilityResult ----------------------------------------
%ignore QueryCodecCapabilityResult;
%typemap(out) QueryCodecCapabilityResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("size", se::Value($1.size));
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
    obj->setProperty("options", se::Value($1.options));
    s.rval().setObject(obj);
%}

// --- GetFaceShapeAreaOptionsResult -------------------------------------
%ignore GetFaceShapeAreaOptionsResult;
%typemap(out) GetFaceShapeAreaOptionsResult %{
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("errorCode", se::Value($1.errorCode));
    obj->setProperty("options", se::Value($1.options));
    s.rval().setObject(obj);
%}
