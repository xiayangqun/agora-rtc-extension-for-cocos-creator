# Agora RTC JSB Integration Tests

## Overview

This directory contains integration tests for the Agora RTC JSB bindings. The tests run inside a real Cocos Creator engine with V8 runtime and full scheduler support.

## Architecture

- `main.js` - Test runner (entry point, compiled from TypeScript)
- `mock/` - Mock implementation of Agora RTC SDK
- `src/` - JSB test helpers and trigger functions
- `scripts/ts/` - TypeScript test sources
- `dist/` - Compiled JavaScript output
- `Classes/` - Cocos Game class that registers JSB bindings

## Build & Run

```bash
# Build (compiles TypeScript and builds the native executable)
./build.sh

# Run
./run.sh

# Run without lldb
./run.sh --no-lldb
```

## Development Workflow

### Adding New Tests

1. Edit TypeScript files in `scripts/ts/`
2. Run `./build.sh` to compile and test
3. The build process automatically:
   - Compiles integration test TypeScript together with public sources from `assets/agora-rtc/`
   - Excludes `assets/agora-rtc/impl/` and `assets/agora-rtc/interface/index.ts`
   - Bundles the output to `dist/main.bundle.js`
   - Builds the C++ executable

### Type Definitions

The integration test TypeScript imports Agora RTC types directly from `assets/agora-rtc` via the `agora-rtc/*` path mapping in `scripts/tsconfig.json`.

No `tests/native-integration/declarations/` directory is generated or consumed by the build.

### Using Types in Test Code

```typescript
import { IRtcEngineEx } from 'agora-rtc/interface/IRtcEngineEx';

const bridge: IRtcEngineEx = new (jsb as any).agora.RtcEngineExBridge();
```

## Callback Trigger Rules

When triggering callbacks from JS for testing, **do not pass parameters**. The C++ layer constructs all parameters with fixed values:

| Type | Value |
|------|-------|
| `string` | `"agora"` |
| `number` (int, uint, float, double) | `2` |
| `bool` | `true` |
| enum | First value of that enum |
| Complex structure | Recursively apply same rules |
| Array | Length 2 (unless fixed-size) |

### Example

```javascript
// JS: No parameters
jsb.agora.test.triggerOnJoinChannelSuccess();

// C++ internally constructs:
// channel = "agora"
// uid = 2
// elapsed = 2
```

## Call API Tests (Log-Based)

Call API tests use a log-based verification approach:

1. JS records `callTime = Date.now()` before calling API
2. Mock writes to `agora_test_log.jsonl`: `{"ts":毫秒,"fn":"函数名","params":{参数JSON}}`
3. JS reads log and finds entry by function name near `callTime` (100ms tolerance)
4. JS verifies parameters match

### Log File

Location: `tests/native-integration/agora_test_log.jsonl`

Format (JSON Lines):
```json
{"ts":1780218671275,"fn":"initialize","params":{"appId":"myTestApp"}}
{"ts":1780218671275,"fn":"joinChannel","params":{"token":"token","channelId":"channel","info":"info","uid":42}}
```

## Test Structure

### Call API Tests (4 tests)

- `testInitializeParams` - Verify initialize() parameters
- `testJoinChannelParams` - Verify joinChannel() parameters
- `testLeaveChannelParams` - Verify leaveChannel() parameters
- `testFullLifecycle` - Verify full API call sequence

### Callback Tests (4 tests)

- `OnErrorCallback` - Verify onError callback with error code and message
- `OnJoinChannelSuccessCallback` - Verify onJoinChannelSuccess callback
- `OnLeaveChannelCallback` - Verify onLeaveChannel callback
- `OnUserJoinedCallback` - Verify onUserJoined callback

## File Structure

```
tests/native-integration/
├── README.md
├── build.sh
├── run.sh
├── CMakeLists.txt
├── main.mm
├── Classes/
│   ├── Game.cpp
│   └── Game.h
├── mock/
│   ├── MockIRtcEngineEx.cpp
│   └── MockIRtcEngineEx.h
├── src/
│   ├── jsb_trigger_events.cpp
│   └── jsb_trigger_events.h
├── scripts/
│   ├── package.json
│   ├── tsconfig.json
│   └── ts/
│       ├── main.ts
│       ├── test-framework.ts
│       ├── call-api.ts
│       ├── callback.ts
│       ├── utils.ts
│       └── types.d.ts
├── dist/
│   └── main.bundle.js (compiled and bundled from TypeScript)
└── build/
    └── Debug/
        └── AgoraJSBIntegrationTest.app
```
