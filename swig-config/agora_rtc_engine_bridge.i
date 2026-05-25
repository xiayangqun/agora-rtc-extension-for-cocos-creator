%module(target_namespace="agora") agora_rtc_engine_bridge

#pragma SWIG nowarn=302,312,317,325,401,402,503

%include <std_string.i>
%include <stdint.i>

%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "agora/IRtcEngineExBridge.h"
%}

%{
#include "bindings/auto/jsb_agora_rtc_engine_bridge_auto.h"
#include "agora/IRtcEngineExBridge.h"
%}

// Result struct typemaps — extracted to agora_rtc_engine_typemap_out.i
%include "agora_rtc_engine_typemap_out.i"

// se::Object is passed only during manual initialization callback wiring.
// Keep it out of the SWIG surface for this auto-binding experiment.
%ignore IRtcEngineExBridge::initialize;

// SWIG's Cocos dispatcher only gates overloads by argc, and Cocos primitive
// converters are permissive (for example number -> string). Keep same-argc
// overloads out of the auto binding until they get manual dispatch or renamed
// JS entry points.
%ignore IRtcEngineExBridge::enableExtension;
%ignore IRtcEngineExBridge::joinChannel;
%ignore IRtcEngineExBridge::takeSnapshot;

// JS → C++ typemaps for Agora struct parameters
%include "agora_rtc_engine_typemap_in.i"

%include "agora/IRtcEngineExBridge.h"
