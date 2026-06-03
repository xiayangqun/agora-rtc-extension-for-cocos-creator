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

const commonCmakePath = path.join(root, "cmake", "AgoraRtcExtensionCommon.cmake");
const iosCmakePath = path.join(root, "ios", "AgoraRtcExtensionConfig.cmake");

assert.strictEqual(fs.existsSync(commonCmakePath), true, "common CMake include should exist");
assert.strictEqual(fs.existsSync(iosCmakePath), true, "iOS CMake config should exist");

const commonCmake = read("cmake/AgoraRtcExtensionCommon.cmake");
assertContains(commonCmake, /function\(agora_rtc_extension_add_library/, "common CMake should expose add-library function");
assertContains(commonCmake, /native\/agora\/RtcEngineExBridge\.cpp/, "common CMake should own native source list");
assertContains(commonCmake, /native\/bindings\/manual\/jsb_agora_rtc_manual\.cpp/, "common CMake should include manual binding source");

const macCmake = read("mac/AgoraRtcExtensionConfig.cmake");
assertContains(macCmake, /include\("\$\{CMAKE_CURRENT_LIST_DIR\}\/\.\.\/cmake\/AgoraRtcExtensionCommon\.cmake"\)/, "mac CMake should include common CMake");
assertContains(macCmake, /macos-arm64_x86_64\/\*\.framework/, "mac CMake should continue linking framework slices");

const iosCmake = read("ios/AgoraRtcExtensionConfig.cmake");
assertContains(iosCmake, /include\("\$\{CMAKE_CURRENT_LIST_DIR\}\/\.\.\/cmake\/AgoraRtcExtensionCommon\.cmake"\)/, "iOS CMake should include common CMake");
assertContains(iosCmake, /ios\/include\/rtc/, "iOS CMake should use iOS headers");
assertContains(iosCmake, /ios\/libs\/\*\.xcframework/, "iOS CMake should link xcframework containers directly");

const plugin = JSON.parse(read("cc_plugin.json"));
assert.deepStrictEqual(plugin.platforms, ["mac", "ios"], "cc_plugin platforms should include mac and ios");

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
