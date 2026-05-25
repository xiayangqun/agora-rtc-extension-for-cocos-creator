// JS → C++ typemap(in) for Agora SDK structs passed to IRtcEngineExBridge.
//
// For each type:
//   %ignore  → prevents JSB class wrapper, constructor, property accessors
//   %typemap(in) → converts se::Value (JS object) to C++ struct directly,
//                   reusing sevalue_to_native for nested fields

// --- ChannelMediaOptions -----------------------------------------------
// %ignore agora::rtc::ChannelMediaOptions;
%typemap(in) agora::rtc::ChannelMediaOptions {
    se::Object *json = $input.toObject();
    bool ok = true;
    se::Value field;

    json->getProperty("publishCameraTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishCameraTrack), s.thisObject());

    json->getProperty("publishSecondaryCameraTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishSecondaryCameraTrack), s.thisObject());

    json->getProperty("publishThirdCameraTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishThirdCameraTrack), s.thisObject());

    json->getProperty("publishFourthCameraTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishFourthCameraTrack), s.thisObject());

    json->getProperty("publishMicrophoneTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishMicrophoneTrack), s.thisObject());

    json->getProperty("publishScreenTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishScreenTrack), s.thisObject());

    json->getProperty("publishSecondaryScreenTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishSecondaryScreenTrack), s.thisObject());

    json->getProperty("publishThirdScreenTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishThirdScreenTrack), s.thisObject());

    json->getProperty("publishFourthScreenTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishFourthScreenTrack), s.thisObject());

    json->getProperty("publishCustomAudioTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishCustomAudioTrack), s.thisObject());

    json->getProperty("publishCustomAudioTrackId", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishCustomAudioTrackId), s.thisObject());

    json->getProperty("publishCustomVideoTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishCustomVideoTrack), s.thisObject());

    json->getProperty("publishEncodedVideoTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishEncodedVideoTrack), s.thisObject());

    json->getProperty("publishMediaPlayerAudioTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishMediaPlayerAudioTrack), s.thisObject());

    json->getProperty("publishMediaPlayerVideoTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishMediaPlayerVideoTrack), s.thisObject());

    json->getProperty("publishTranscodedVideoTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishTranscodedVideoTrack), s.thisObject());

    json->getProperty("publishMixedAudioTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishMixedAudioTrack), s.thisObject());

    json->getProperty("publishLipSyncTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishLipSyncTrack), s.thisObject());

    json->getProperty("autoSubscribeAudio", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.autoSubscribeAudio), s.thisObject());

    json->getProperty("autoSubscribeVideo", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.autoSubscribeVideo), s.thisObject());

    json->getProperty("enableAudioRecordingOrPlayout", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.enableAudioRecordingOrPlayout), s.thisObject());

    json->getProperty("publishMediaPlayerId", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishMediaPlayerId), s.thisObject());

    json->getProperty("clientRoleType", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.clientRoleType), s.thisObject());

    json->getProperty("audienceLatencyLevel", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.audienceLatencyLevel), s.thisObject());

    json->getProperty("defaultVideoStreamType", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.defaultVideoStreamType), s.thisObject());

    json->getProperty("channelProfile", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.channelProfile), s.thisObject());

    json->getProperty("audioDelayMs", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.audioDelayMs), s.thisObject());

    json->getProperty("mediaPlayerAudioDelayMs", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.mediaPlayerAudioDelayMs), s.thisObject());

    json->getProperty("token", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.token), s.thisObject());

    json->getProperty("enableBuiltInMediaEncryption", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.enableBuiltInMediaEncryption), s.thisObject());

    json->getProperty("publishRhythmPlayerTrack", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.publishRhythmPlayerTrack), s.thisObject());

    json->getProperty("isInteractiveAudience", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.isInteractiveAudience), s.thisObject());

    json->getProperty("customVideoTrackId", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.customVideoTrackId), s.thisObject());

    json->getProperty("isAudioFilterable", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.isAudioFilterable), s.thisObject());

    json->getProperty("parameters", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.parameters), s.thisObject());

    json->getProperty("enableMultipath", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.enableMultipath), s.thisObject());

    json->getProperty("uplinkMultipathMode", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.uplinkMultipathMode), s.thisObject());

    json->getProperty("downlinkMultipathMode", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.downlinkMultipathMode), s.thisObject());

    json->getProperty("preferMultipathType", &field, true);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &($1.preferMultipathType), s.thisObject());

    if (!ok) {
        SE_REPORT_ERROR("Failed to convert ChannelMediaOptions");
    }
%}
