const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), "utf-8");
}

function assertContains(content, pattern, message) {
    assert.match(content, pattern, message);
}

const iosCmakePath = path.join(root, "ios", "AgoraRtcExtensionConfig.cmake");
const androidCmakePath = path.join(root, "android", "AgoraRtcExtensionConfig.cmake");

assert.strictEqual(fs.existsSync(iosCmakePath), true, "iOS CMake config should exist");
assert.strictEqual(fs.existsSync(androidCmakePath), true, "Android CMake config should exist");

const macCmake = read("mac/AgoraRtcExtensionConfig.cmake");
assert.doesNotMatch(macCmake, /AgoraRtcExtensionCommon/, "mac CMake should not include common CMake");
assertContains(macCmake, /add_library\(AgoraRtcExtension STATIC/, "mac CMake should define AgoraRtcExtension directly");
assertContains(macCmake, /native\/agora\/RtcEngineExBridge\.cpp/, "mac CMake should own native source list");
assertContains(macCmake, /native\/bindings\/manual\/jsb_agora_rtc_manual\.cpp/, "mac CMake should include manual binding source");
assertContains(macCmake, /macos-arm64_x86_64\/\*\.framework/, "mac CMake should continue linking framework slices");

const iosCmake = read("ios/AgoraRtcExtensionConfig.cmake");
assert.doesNotMatch(iosCmake, /AgoraRtcExtensionCommon/, "iOS CMake should not include common CMake");
assertContains(iosCmake, /add_library\(AgoraRtcExtension STATIC/, "iOS CMake should define AgoraRtcExtension directly");
assertContains(iosCmake, /native\/agora\/RtcEngineExBridge\.cpp/, "iOS CMake should own native source list");
assertContains(iosCmake, /ios\/include\/rtc/, "iOS CMake should use iOS headers");
assertContains(iosCmake, /ios\/libs\/\*\.xcframework/, "iOS CMake should link xcframework containers directly");

const androidCmake = read("android/AgoraRtcExtensionConfig.cmake");
assert.doesNotMatch(androidCmake, /AgoraRtcExtensionCommon/, "Android CMake should not include common CMake");
assertContains(androidCmake, /add_library\(AgoraRtcExtension STATIC/, "Android CMake should define AgoraRtcExtension directly");
assertContains(androidCmake, /android\/include\/rtc/, "Android CMake should use Android headers");
assertContains(androidCmake, /AGORA_RTC_ANDROID_EXTENSION_LIBRARIES/, "Android CMake should pass extension library names");

const plugin = JSON.parse(read("cc_plugin.json"));
assert.deepStrictEqual(plugin.platforms, ["mac", "ios", "android", "google-play"], "cc_plugin platforms should include mac, ios, android, and google-play");

const builder = read("src/builder.ts");
assertContains(builder, /ios:\s*\{[\s\S]*hooks:\s*"\.\/build-hooks"/, "builder should register iOS hooks");
assertContains(builder, /const agoraMediaPermissionOptions/, "builder should share camera and microphone options");
assertContains(builder, /const agoraMacPermissionOptions = \{[\s\S]*writeAgoraDefaultPermissions/, "mac builder options should keep default SDK permissions");
assertContains(builder, /const agoraIosPermissionOptions = agoraMediaPermissionOptions/, "iOS builder options should only use media permissions");
assertContains(builder, /ios:\s*\{[\s\S]*options:\s*agoraIosPermissionOptions/, "iOS builder should not use mac-only permission options");

const hooks = read("src/build-hooks.ts");
assertContains(hooks, /options\.platform !== "mac" && options\.platform !== "ios"/, "hooks should run for mac and iOS");
assertContains(hooks, /const shouldWriteEntitlements = options\.platform === "mac"/, "hooks should limit entitlements to mac");

console.log("iOS build config tests passed");
