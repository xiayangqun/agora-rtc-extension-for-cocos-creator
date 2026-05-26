%module(target_namespace="agora") agora_rtc_engine_bridge

#pragma SWIG nowarn=302,312,317,325,401,402,503

%include <std_string.i>
%include <stdint.i>

%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "agora/RtcMediaPlayerBridge.h"
#include "agora/RtcEngineExBridge.h"
%}

%{
#include "bindings/auto/jsb_agora_rtc_engine_bridge_auto.h"
#include "agora/RtcMediaPlayerBridge.h"
#include "agora/RtcEngineExBridge.h"
%}

// Result struct typemaps — extracted to agora_rtc_engine_typemap_out.i
%include "agora_rtc_engine_typemap_out.i"

// se::Object is passed only during manual initialization callback wiring.
// Keep it out of the SWIG surface for this auto-binding experiment.
%ignore RtcEngineExBridge::initialize;

// SWIG's Cocos dispatcher only gates overloads by argc, and Cocos primitive
// converters are permissive (for example number -> string). Keep same-argc
// overloads out of the auto binding until they get manual dispatch or renamed
// JS entry points.
%ignore RtcEngineExBridge::enableExtension;
%ignore RtcEngineExBridge::joinChannel;
%ignore RtcEngineExBridge::takeSnapshot;

// JS → C++ typemaps for Agora struct parameters
%include "agora_rtc_engine_typemap_in.i"

// Media player instances are created by RtcEngineExBridge and returned to JS.
// Do not expose the native constructor or internal SDK ref helpers.
%rename(MediaPlayerNative) RtcMediaPlayerBridge;
%ignore RtcMediaPlayerBridge::RtcMediaPlayerBridge;
%ignore RtcMediaPlayerBridge::hasMediaPlayer;
%ignore RtcMediaPlayerBridge::mediaPlayer;
%ignore RtcMediaPlayerBridge::invalidate;
%include "agora/RtcMediaPlayerBridge.h"

%include "agora/RtcEngineExBridge.h"
