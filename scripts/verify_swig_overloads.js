"use strict";

const fs = require("fs");
const path = require("path");

const generated = path.resolve(__dirname, "..", "native", "bindings", "auto", "jsb_agora_rtc_engine_bridge_auto.cpp");
const source = fs.readFileSync(generated, "utf8");

const expectedAutoOverloads = {
  createDataStream: [1, 2],
  enableDualStreamMode: [1, 2],
  joinChannelWithUserAccount: [3, 4],
  leaveChannel: [0, 1],
  setAudioProfile: [1, 2],
  setClientRole: [1, 2],
  setDualStreamMode: [1, 2],
  setLocalRenderMode: [1, 2],
  setPlaybackAudioFrameBeforeMixingParameters: [2, 3],
  startAudioMixing: [3, 4],
  startAudioRecording: [1, 2, 3],
  startPreview: [0, 1],
  // startScreenCapture: [1, 2], // 1-param version is Android/iOS/OHOS only (#if guarded)
  stopPreview: [0, 1],
  stopScreenCapture: [0, 1],
};

const intentionallyManual = ["enableExtension", "joinChannel", "takeSnapshot"];
const failures = [];

for (const [method, argCounts] of Object.entries(expectedAutoOverloads)) {
  const dispatcherStart = source.indexOf(`static bool js_RtcEngineExBridge_${method}(se::State& s)`);
  if (dispatcherStart === -1) {
    failures.push(`${method}: dispatcher not generated`);
    continue;
  }

  const bindMarker = `SE_BIND_FUNC(js_RtcEngineExBridge_${method})`;
  const dispatcherEnd = source.indexOf(bindMarker, dispatcherStart);
  if (dispatcherEnd === -1) {
    failures.push(`${method}: bind marker not found`);
    continue;
  }

  const dispatcher = source.slice(dispatcherStart, dispatcherEnd);
  const overloadWrappers = source.match(new RegExp(`js_RtcEngineExBridge_${method}__SWIG_\\d+`, "g")) || [];
  const distinctWrappers = [...new Set(overloadWrappers)];
  if (distinctWrappers.length !== argCounts.length) {
    failures.push(`${method}: expected ${argCounts.length} overload wrappers, found ${distinctWrappers.length}`);
  }

  for (const argCount of argCounts) {
    if (!dispatcher.includes(`if (argc == ${argCount})`)) {
      failures.push(`${method}: missing argc dispatch for ${argCount}`);
    }
  }
}

for (const method of intentionallyManual) {
  if (source.includes(`static bool js_RtcEngineExBridge_${method}__SWIG_`)) {
    failures.push(`${method}: same-argc overload should not be auto-generated`);
  }
  if (source.includes(`SE_BIND_FUNC(js_RtcEngineExBridge_${method})`)) {
    failures.push(`${method}: same-argc overload dispatcher should not be auto-generated`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${Object.keys(expectedAutoOverloads).length} SWIG overload dispatchers; ${intentionallyManual.length} same-argc overloads remain manual.`);
