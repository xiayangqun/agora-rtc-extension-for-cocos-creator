%module(target_namespace="agora") agora_rtc_engine_bridge

#pragma SWIG nowarn=302,312,317,325,401,402,503

%include <stdint.i>

%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/RtcSeValueToNative.h"
#include "agora/RtcNativeValueToSe.h"
#include "agora/RtcEngineExBridge.h"
#include "agora/AudioDeviceCollectionBridge.h"
#include "agora/AudioDeviceManagerBridge.h"
#include "agora/H265TranscoderBridge.h"
#include "agora/LocalSpatialAudioEngineBridge.h"
#include "agora/MediaPlayerBridge.h"
#include "agora/MediaPlayerCacheManagerBridge.h"
#include "agora/MediaRecorderBridge.h"
#include "agora/MusicContentCenterBridge.h"
#include "agora/MusicPlayerBridge.h"
#include "agora/ScreenCaptureSourceListBridge.h"
#include "agora/VideoDeviceCollectionBridge.h"
#include "agora/VideoDeviceManagerBridge.h"
#include "agora/VideoEffectObjectBridge.h"
%}

%{
#include "bindings/auto/jsb_agora_rtc_engine_bridge_auto.h"
#include "bindings/manual/RtcSeValueToNative.h"
#include "agora/RtcEngineExBridge.h"
#include "agora/AudioDeviceCollectionBridge.h"
#include "agora/AudioDeviceManagerBridge.h"
#include "agora/H265TranscoderBridge.h"
#include "agora/LocalSpatialAudioEngineBridge.h"
#include "agora/MediaPlayerBridge.h"
#include "agora/MediaPlayerCacheManagerBridge.h"
#include "agora/MediaRecorderBridge.h"
#include "agora/MusicContentCenterBridge.h"
#include "agora/MusicPlayerBridge.h"
#include "agora/ScreenCaptureSourceListBridge.h"
#include "agora/VideoDeviceCollectionBridge.h"
#include "agora/VideoDeviceManagerBridge.h"
#include "agora/VideoEffectObjectBridge.h"
%}

// Result struct typemaps — extracted to agora_rtc_engine_typemap_out.i
%include "agora_rtc_engine_typemap_out.i"

// ============================================================
// Ignore constructors (bridge objects are created by the engine, not from JS)
// ============================================================
%ignore AudioDeviceCollectionBridge::AudioDeviceCollectionBridge;
%ignore AudioDeviceManagerBridge::AudioDeviceManagerBridge;
%ignore H265TranscoderBridge::H265TranscoderBridge;
%ignore LocalSpatialAudioEngineBridge::LocalSpatialAudioEngineBridge;
%ignore MediaPlayerBridge::MediaPlayerBridge;
%ignore MediaPlayerCacheManagerBridge::MediaPlayerCacheManagerBridge;
%ignore MediaRecorderBridge::MediaRecorderBridge;
%ignore MusicContentCenterBridge::MusicContentCenterBridge;
%ignore MusicPlayerBridge::MusicPlayerBridge;
%ignore ScreenCaptureSourceListBridge::ScreenCaptureSourceListBridge;
%ignore VideoDeviceCollectionBridge::VideoDeviceCollectionBridge;
%ignore VideoDeviceManagerBridge::VideoDeviceManagerBridge;
%ignore VideoEffectObjectBridge::VideoEffectObjectBridge;

// ============================================================
// Ignore classes (//todo jsb ignore class)
// ============================================================
%ignore RtcEngineEventHandlerExBridge;
%ignore ObserverBridgeBase;
%ignore MediaRecorderObserverBridge;
%ignore MediaPlayerSourceObserverBridge;
%ignore MusicContentCenterEventHandlerBridge;
%ignore H265TranscoderObserverBridge;
%ignore MediaEngineBridge;

// ============================================================
// Ignore functions (//todo jsb ignore) — internal lifecycle/raw pointer accessors
// ============================================================

// AudioDeviceCollectionBridge
%ignore AudioDeviceCollectionBridge::invalidate;

// AudioDeviceManagerBridge
%ignore AudioDeviceManagerBridge::audioDeviceManager;
%ignore AudioDeviceManagerBridge::invalidate;

// H265TranscoderBridge
%ignore H265TranscoderBridge::h265Transcoder;

// LocalSpatialAudioEngineBridge
%ignore LocalSpatialAudioEngineBridge::spatialAudioEngine;
%ignore LocalSpatialAudioEngineBridge::invalidate;
%ignore LocalSpatialAudioEngineBridge::setZones;

// MediaEngineBridge
%ignore MediaEngineBridge::addVideoFrameRenderer;

// MediaPlayerBridge
%ignore MediaPlayerBridge::hasMediaPlayer;
%ignore MediaPlayerBridge::mediaPlayer;
%ignore MediaPlayerBridge::invalidate;
%ignore MediaPlayerBridge::getState;

// MediaPlayerCacheManagerBridge
%ignore MediaPlayerCacheManagerBridge::hasCacheManager;
%ignore MediaPlayerCacheManagerBridge::cacheManager;
%ignore MediaPlayerCacheManagerBridge::invalidate;

// MediaRecorderBridge
%ignore MediaRecorderBridge::hasMediaRecorder;
%ignore MediaRecorderBridge::mediaRecorder;
%ignore MediaRecorderBridge::invalidate;

// MusicContentCenterBridge
%ignore MusicContentCenterBridge::hasMusicContentCenter;
%ignore MusicContentCenterBridge::musicContentCenter;
%ignore MusicContentCenterBridge::invalidate;
%ignore MusicContentCenterBridge::getMusicPlayer;

// MusicPlayerBridge
%ignore MusicPlayerBridge::musicPlayer;

// ScreenCaptureSourceListBridge (3 internal functions)
%ignore ScreenCaptureSourceListBridge::hasList;
%ignore ScreenCaptureSourceListBridge::setList;
%ignore ScreenCaptureSourceListBridge::invalidate;

// VideoDeviceCollectionBridge
%ignore VideoDeviceCollectionBridge::invalidate;

// VideoDeviceManagerBridge
%ignore VideoDeviceManagerBridge::hasVideoDeviceManager;
%ignore VideoDeviceManagerBridge::videoDeviceManager;
%ignore VideoDeviceManagerBridge::invalidate;

// VideoEffectObjectBridge
%ignore VideoEffectObjectBridge::hasVideoEffectObject;
%ignore VideoEffectObjectBridge::videoEffectObject;
%ignore VideoEffectObjectBridge::invalidate;

// ============================================================
// Ignore manual-binding functions (//todo jsb manual) — hand-written in jsb_agora_rtc_manual.cpp
// ============================================================

// RtcEngineExBridge — manual bindings
%ignore RtcEngineExBridge::release;
%ignore RtcEngineExBridge::initialize;
%ignore RtcEngineExBridge::getH265Transcoder;
%ignore RtcEngineExBridge::getAudioDeviceManager;
%ignore RtcEngineExBridge::getVideoDeviceManager;
%ignore RtcEngineExBridge::getMusicContentCenter;
%ignore RtcEngineExBridge::getMediaPlayerCacheManager;
%ignore RtcEngineExBridge::getLocalSpatialAudioEngine;
%ignore RtcEngineExBridge::createVideoEffectObject;
%ignore RtcEngineExBridge::destroyVideoEffectObject;
%ignore RtcEngineExBridge::createMediaPlayer;
%ignore RtcEngineExBridge::destroyMediaPlayer;
%ignore RtcEngineExBridge::createMediaRecorder;
%ignore RtcEngineExBridge::destroyMediaRecorder;
%ignore RtcEngineExBridge::getScreenCaptureSources;
%ignore RtcEngineExBridge::sendStreamMessage;
%ignore RtcEngineExBridge::sendStreamMessageEx;
%ignore RtcEngineExBridge::sendRdtMessage;
%ignore RtcEngineExBridge::sendRdtMessageEx;
%ignore RtcEngineExBridge::sendMediaControlMessage;
%ignore RtcEngineExBridge::sendMediaControlMessageEx;
%ignore RtcEngineExBridge::sendAudioMetadata;
%ignore RtcEngineExBridge::sendAudioMetadataEx;
%ignore RtcEngineExBridge::setupRemoteVideo;
%ignore RtcEngineExBridge::setupLocalVideo;
%ignore RtcEngineExBridge::setupRemoteVideoEx;

// MediaPlayerBridge — manual bindings
%ignore MediaPlayerBridge::registerPlayerSourceObserver;

// H265TranscoderBridge — manual bindings
%ignore H265TranscoderBridge::registerTranscoderObserver;

// MediaRecorderBridge — manual bindings
%ignore MediaRecorderBridge::setMediaRecorderObserver;

// MusicContentCenterBridge — manual bindings
%ignore MusicContentCenterBridge::unregisterEventHandler;
%ignore MusicContentCenterBridge::createMusicPlayer;
%ignore MusicContentCenterBridge::destroyMusicPlayer;

// AudioDeviceCollectionBridge — manual bindings (merged overloads)
%ignore AudioDeviceCollectionBridge::getDevice;
%ignore AudioDeviceCollectionBridge::getDeviceEx;
%ignore AudioDeviceCollectionBridge::getDefaultDevice;
%ignore AudioDeviceCollectionBridge::getDefaultDeviceEx;

// AudioDeviceManagerBridge — manual bindings
%ignore AudioDeviceManagerBridge::enumeratePlaybackDevices;
%ignore AudioDeviceManagerBridge::enumerateRecordingDevices;
%ignore AudioDeviceManagerBridge::getPlaybackDevice;
%ignore AudioDeviceManagerBridge::getPlaybackDeviceInfo;
%ignore AudioDeviceManagerBridge::getPlaybackDeviceInfoEx;
%ignore AudioDeviceManagerBridge::getRecordingDevice;
%ignore AudioDeviceManagerBridge::getRecordingDeviceInfo;
%ignore AudioDeviceManagerBridge::getRecordingDeviceInfoEx;

// ScreenCaptureSourceListBridge — manual binding
%ignore ScreenCaptureSourceListBridge::getSourceInfo;

// ============================================================
// Ignore same-argc overloaded functions (hand-written disambiguation)
// ============================================================

// MediaPlayerBridge::setPlayerOption — (string,int) vs (string,string)
%ignore MediaPlayerBridge::setPlayerOption;

// RtcEngineEventHandlerExBridge::onFirstLocalVideoFramePublished — already ignored via class ignore

// RtcEngineExBridge::addVideoWatermark — (RtcImage) vs (WatermarkConfig)
%ignore RtcEngineExBridge::addVideoWatermark;

// RtcEngineExBridge::enableExtension — same-argc overload
%ignore RtcEngineExBridge::enableExtension;

// RtcEngineExBridge::getExtensionProperty — same-argc overload
%ignore RtcEngineExBridge::getExtensionProperty;

// RtcEngineExBridge::joinChannel — same-argc overload
%ignore RtcEngineExBridge::joinChannel;

// RtcEngineExBridge::setExtensionProperty — same-argc overload
%ignore RtcEngineExBridge::setExtensionProperty;

// RtcEngineExBridge::takeSnapshot — same-argc overload
%ignore RtcEngineExBridge::takeSnapshot;

// RtcEngineExBridge::takeSnapshotEx — same-argc overload
%ignore RtcEngineExBridge::takeSnapshotEx;

// ============================================================
// Include headers for SWIG auto-generation
// ============================================================
%include "agora/RtcEngineExBridge.h"
%include "agora/AudioDeviceCollectionBridge.h"
%include "agora/AudioDeviceManagerBridge.h"
%include "agora/H265TranscoderBridge.h"
%include "agora/LocalSpatialAudioEngineBridge.h"
%include "agora/MediaPlayerBridge.h"
%include "agora/MediaPlayerCacheManagerBridge.h"
%include "agora/MediaRecorderBridge.h"
%include "agora/MusicContentCenterBridge.h"
%include "agora/MusicPlayerBridge.h"
%include "agora/ScreenCaptureSourceListBridge.h"
%include "agora/VideoDeviceCollectionBridge.h"
%include "agora/VideoDeviceManagerBridge.h"
%include "agora/VideoEffectObjectBridge.h"
