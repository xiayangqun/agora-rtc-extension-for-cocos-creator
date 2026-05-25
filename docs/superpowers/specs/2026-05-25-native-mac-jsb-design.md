# Native Mac JSB Support Design

## Goal

Add the first native runtime path for `agora-rtc-extension-for-cocos-creator`, starting with macOS. The first runnable slice must create a native RTC engine, initialize it with a JavaScript event handler, join a channel, and deliver `onJoinChannelSuccess` and `onUserJoined` callbacks back to TypeScript.

## Scope

The macOS implementation is the only platform that will be wired in this phase. iOS, Android, and Windows keep their existing SDK folders, but their native plugin CMake entries and runtime support are deferred until the macOS path is proven.

The first callable native API surface is intentionally small:

- `createRtcEngine()` returns a native engine implementation when Cocos runs with JSB.
- `IRtcEngine.initialize(context)` creates and configures the Agora native engine.
- `IRtcEngine.joinChannel(token, channelId, info, uid)` joins through the native SDK.
- `IRtcEngine.joinChannel(token, channelId, uid, options)` also joins through the native SDK, with unsupported option details ignored during the first slice unless a direct native mapping is needed.
- `IRtcEngine.release(sync)` releases the native engine.
- Native callbacks call the existing `IRtcEngineEventHandler` methods `onJoinChannelSuccess` and `onUserJoined`.

Other native methods return a clear unsupported value or remain unavailable through the TypeScript native wrapper until their C++ binding is added. Skipped classes follow `jsb-rules/JSB-SKIP-LIST.md`: factory methods should return stub objects instead of `null`, and skipped methods should return `-ERR_NOT_SUPPORTED`.

## Architecture

The native side has four layers:

1. TypeScript platform selector and native wrapper
2. Hand-written JSB binding for lifecycle, `initialize`, `joinChannel`, and callbacks
3. Cross-platform C++ Agora facade
4. macOS CMake/linking layer for the Agora native SDK

The call flow is:

```text
TypeScript demo code
  -> createRtcEngine()
    -> Browser: RtcEngineWeb
    -> JSB/native: RtcEngineNative
      -> native JSB manual binding
        -> AgoraRtcEngineBridge
          -> Agora native C++ SDK
            -> AgoraRtcEventHandlerBridge
              -> Cocos main thread dispatch
                -> JS eventHandler.onJoinChannelSuccess/onUserJoined
```

The C++ facade is shared across native platforms. The first platform-specific work is limited to macOS CMake and SDK linking.

## File Structure

### Plugin Descriptor

`cc_plugin.json`

Defines this package as a Cocos native plugin. The first version lists only macOS in `platforms` and exposes one module target, `AgoraRtcExtension`.

### macOS Build Package

`mac/AgoraRtcExtension-Config.cmake`

Defines the `AgoraRtcExtension` native target for macOS. It compiles the hand-written native sources, includes Cocos and Agora headers, and links the macOS Agora SDK frameworks under `mac/libs`.

### Native C++ Facade

`native/agora/AgoraRtcEngineBridge.h`

Declares the small C++ facade used by JSB. It owns the Agora `IRtcEngine` pointer and exposes `initialize`, `joinChannel`, and `release`.

`native/agora/AgoraRtcEngineBridge.cpp`

Implements the facade by calling Agora native SDK C++ APIs. It keeps the Agora SDK details out of TypeScript and out of the JSB callback parsing code.

`native/agora/AgoraRtcEventHandlerBridge.h`

Declares the event handler that inherits from the Agora native `IRtcEngineEventHandler`. It forwards only the first required callbacks: `onJoinChannelSuccess` and `onUserJoined`.

`native/agora/AgoraRtcEventHandlerBridge.cpp`

Copies callback data from Agora worker threads and forwards it to the JSB event dispatcher. It never calls `se::` APIs directly from an Agora callback thread.

### JSB Manual Binding

`native/bindings/manual/jsb_agora_rtc_manual.h`

Declares manual binding registration.

`native/bindings/manual/jsb_agora_rtc_manual.cpp`

Registers the native JavaScript class used by `RtcEngineNative.ts`. It handles constructor/finalizer, argument parsing, `initialize`, `joinChannel`, and `release`.

`native/bindings/manual/AgoraRtcEngineEventDispatcher.h`

Declares the JS event dispatcher. It stores the JavaScript `eventHandler` object and exposes C++ methods to emit the supported callbacks.

`native/bindings/manual/AgoraRtcEngineEventDispatcher.cpp`

Dispatches callback lambdas to the Cocos main thread with `performFunctionInCocosThread`, then calls JavaScript through `se::Object`. It creates the `RtcConnection` object shape expected by existing TypeScript handlers:

```ts
{ channelId: string; localUid: number }
```

### JSB Registration

`native/bindings/register.cpp`

Defines the plugin load entry point and registers manual bindings. It also reserves the hook for SWIG-generated bindings when the generated auto file exists.

### SWIG Generation

`swig-config/agora_rtc.i`

Defines the SWIG module and the facade classes that future API expansion can generate. Full native SDK headers are not bound directly in the first phase; the facade remains the stable public C++ surface.

`swig-config/swig-config.js`

Tells Cocos SWIG where the `.i` file is and where generated binding files should be written.

`native/bindings/auto/.gitkeep`

Keeps the generated output directory in git while excluding generated `.h` and `.cpp` files.

Generated files are not committed:

```text
native/bindings/auto/jsb_agora_rtc_auto.h
native/bindings/auto/jsb_agora_rtc_auto.cpp
```

### Generation Script

`scripts/genbindings.js`

Accepts the Cocos engine root directory:

```bash
npm run native:genbindings -- /absolute/path/to/cocos-engine
```

The script validates that the engine root contains:

```text
native/tools/swig-config/genbindings.js
```

It deletes old generated binding files and then invokes the Cocos SWIG generator with this plugin's `swig-config/swig-config.js`.

`package.json`

Adds:

```json
{
  "scripts": {
    "native:genbindings": "node scripts/genbindings.js"
  }
}
```

`.gitignore`

Excludes:

```text
native/bindings/auto/jsb_agora_rtc_auto.*
```

### TypeScript Native Runtime

`assets/agora-rtc/impl/native/RtcEngineNative.ts`

Implements the first native `IRtcEngineEx` runtime wrapper. It calls the JSB class exposed by the manual binding and returns Promises to match the existing TypeScript interface. Unsupported methods return `-ERR_NOT_SUPPORTED` or stub objects where the JSB rules require stubs.

`assets/agora-rtc/interface/index.ts`

Updates `createRtcEngine()`:

- Browser builds return `RtcEngineWeb`.
- JSB/native builds return `RtcEngineNative`.
- Unsupported non-browser, non-JSB environments return `null` only if Cocos has no native binding available.

### Plugin Panel

`src/main.ts`

Adds two extension messages:

- `query-cocos-engine-root`
- `generate-native-bindings`

`query-cocos-engine-root` reads the current Cocos project path from `Editor.Project.path`, then tries to read:

```text
<project-root>/temp/cc.d.ts
```

If the file exists, it parses the first line and extracts the first absolute path that appears to be the Cocos engine root. If the file is missing or parsing fails, it returns an empty string.

`generate-native-bindings` receives the Cocos engine root from the panel input, calls:

```bash
node scripts/genbindings.js <engine-root>
```

and returns success, stdout, stderr, and error text to the panel.

`src/panels/agora-panel/index.ts`

Adds Vue state and methods for:

- Cocos engine root input
- loading the default engine root
- running native binding generation
- displaying generation status

`static/template/agora-panel/index.html`

Adds a native binding generation section with an input and a button.

`static/style/agora-panel/index.css`

Adds panel styling for the input, button, and status text while keeping the existing compact Cocos editor panel style.

## Callback Threading

Agora native callbacks can arrive on SDK worker threads. The implementation must not call `se::` APIs on those threads.

Every callback path follows this rule:

1. Copy callback data into owned C++ values.
2. Call `CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(...)`.
3. Inside the scheduled lambda, create `se::AutoHandleScope`, clear pending script exceptions, and call the stored JavaScript event handler.

## Error Handling

The first slice returns the Agora SDK integer result for implemented methods. Missing arguments or invalid native object state return an error through JSB rather than crashing.

Unsupported native methods return `-ERR_NOT_SUPPORTED` where they must exist for interface compatibility.

Binding generation errors are surfaced in the plugin panel. The panel should show whether generation succeeded and should include command stderr or the thrown error message when it fails.

## Testing

The first implementation should be verified with:

- `npm run build`
- `npm run native:genbindings -- <engine-root>` using a valid local Cocos engine root
- opening the plugin panel and confirming the Cocos engine root input is prefilled from `<project-root>/temp/cc.d.ts` when that file exists
- clicking the panel generation button and confirming it calls the same script
- building a macOS Cocos native project far enough to confirm the plugin target is discovered and linked
- running a macOS native scene that calls `initialize`, `joinChannel`, and receives `onJoinChannelSuccess`; with a second user, verify `onUserJoined`

## Deferred Work

The following are intentionally deferred:

- iOS, Android, and Windows CMake/linking support
- video rendering and texture binding
- media player support
- audio/video device manager support
- full SWIG coverage for the broad Agora RTC API
- Pattern A and Pattern B special out-parameter bindings outside the first runnable slice
