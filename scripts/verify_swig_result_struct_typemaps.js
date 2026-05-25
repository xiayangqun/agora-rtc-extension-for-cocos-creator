"use strict";

const fs = require("fs");
const path = require("path");

const generated = path.resolve(__dirname, "..", "native", "bindings", "auto", "jsb_agora_rtc_engine_bridge_auto.cpp");
const source = fs.readFileSync(generated, "utf8");

const expected = {
  getVersion: ["errorCode", "build"],
  queryCodecCapability: ["errorCode", "size"],
  getFaceShapeBeautyOptions: ["errorCode", "options"],
  getFaceShapeAreaOptions: ["errorCode", "options"],
  getAudioTrackCount: ["errorCode", "count"],
  getAudioMixingPublishVolume: ["errorCode", "volume"],
  getAudioMixingPlayoutVolume: ["errorCode", "volume"],
  getAudioMixingDuration: ["errorCode", "duration"],
  getAudioMixingCurrentPosition: ["errorCode", "position"],
  getEffectsVolume: ["errorCode", "volume"],
  getVolumeOfEffect: ["errorCode", "volume"],
  getEffectDuration: ["errorCode", "duration"],
  getEffectCurrentPosition: ["errorCode", "position"],
  getLoopbackRecordingVolume: ["errorCode", "volume"],
  getCameraMaxZoomFactor: ["errorCode", "factor"],
  getNetworkType: ["errorCode", "type"],
};

const failures = [];

for (const [method, fields] of Object.entries(expected)) {
  const start = source.indexOf(`static bool js_IRtcEngineExBridge_${method}(se::State& s)`);
  if (start === -1) {
    failures.push(`${method}: wrapper function not found`);
    continue;
  }

  const end = source.indexOf(`SE_BIND_FUNC(js_IRtcEngineExBridge_${method})`, start);
  if (end === -1) {
    failures.push(`${method}: SE_BIND_FUNC marker not found`);
    continue;
  }

  const body = source.slice(start, end);
  if (body.includes("nativevalue_to_se(result, s.rval()")) {
    failures.push(`${method}: still wraps the stack result with nativevalue_to_se`);
  }
  if (body.includes("SE_HOLD_RETURN_VALUE(result")) {
    failures.push(`${method}: still holds the stack result object`);
  }
  if (!body.includes("se::Object::createPlainObject()")) {
    failures.push(`${method}: does not create a plain JS object`);
  }
  for (const field of fields) {
    const copiedByValue = body.includes(`setProperty("${field}", se::Value(result.${field}))`);
    const copiedBySwigPointer = body.includes(`setProperty("${field}", se::Value((&result)->${field}))`);
    if (!copiedByValue && !copiedBySwigPointer) {
      failures.push(`${method}: missing copied field ${field}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${Object.keys(expected).length} result struct typemaps.`);
