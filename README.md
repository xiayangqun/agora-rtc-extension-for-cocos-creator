# Agora RTC Extension for Cocos Creator

A Cocos Creator editor extension that integrates the [Agora RTC SDK](https://www.agora.io/) for real-time communication. Build video calling, interactive live streaming, screen sharing, and media playback features into your Cocos Creator games and applications.

## Features

- **Video/Voice Calls** — Real-time 1-on-1 and group video/audio calls
- **Screen Sharing** — Share screen content during calls (native platforms)
- **Media Player** — Play local and remote media files with full playback controls
- **Media Recording** — Record audio/video streams to local files
- **Interactive Live Streaming** — CDN push streams with transcoding support
- **Spatial Audio** — 3D positional audio for immersive experiences
- **Beauty & Video Effects** — Face beautification, filters, virtual background, video denoiser
- **Music Content Center** — Music playback and mixing capabilities
- **H.265 Transcoding** — H.265 video codec transcoding support
- **Data Channels** — Send custom data messages between users
- **Content Inspection** — AI-powered content moderation
- **Encryption** — End-to-end encryption for secure communication

## Platform Capability Matrix

| Capability | iOS | Android | macOS | Windows | Browser (Chrome) |
|---|:---:|:---:|:---:|:---:|:---:|
| Join/Leave Channel | ✅ | ✅ | ✅ | ✅ | ✅ |
| Video Call | ✅ | ✅ | ✅ | ✅ | ✅ |
| Audio Call | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mute Local Audio/Video | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mute Remote Audio/Video | ✅ | ✅ | ✅ | ✅ | ✅ |
| Client Role (Broadcaster/Audience) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Channel Profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Screen Sharing | ✅ | ✅ | ✅ | ✅ | ❌ |
| Screen Capture Sources | ❌ | ❌ | ✅ | ✅ | ❌ |
| Media Player | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Media Recorder | ✅ | ✅ | ✅ | ✅ | ❌ |
| Audio Mixing | ✅ | ✅ | ✅ | ✅ | ✅ |
| Beauty Effect | ✅ | ✅ | ✅ | ✅ | ❌ |
| Filter Effect | ✅ | ✅ | ✅ | ✅ | ❌ |
| Virtual Background | ✅ | ✅ | ✅ | ✅ | ❌ |
| Video Denoiser | ✅ | ✅ | ✅ | ✅ | ❌ |
| Color Enhance | ✅ | ✅ | ✅ | ✅ | ❌ |
| Lowlight Enhance | ✅ | ✅ | ✅ | ✅ | ❌ |
| Spatial Audio | ✅ | ✅ | ✅ | ✅ | ❌ |
| H.265 Transcoder | ✅ | ❌ | ✅ | ❌ | ❌ |
| Data Stream | ✅ | ✅ | ✅ | ✅ | ✅ |
| CDN Push Streaming | ✅ | ✅ | ✅ | ✅ | ❌ |
| Take Snapshot | ✅ | ✅ | ✅ | ✅ | ❌ |
| Content Inspection | ✅ | ✅ | ✅ | ✅ | ❌ |
| Encryption | ✅ | ✅ | ✅ | ✅ | ✅ |
| Audio Volume Indication | ✅ | ✅ | ✅ | ✅ | ✅ |
| Device Manager | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Extension System | ✅ | ✅ | ✅ | ✅ | ❌ |
| Face Info Observer | ✅ | ✅ | ❌ | ❌ | ❌ |

> ✅ Supported &nbsp; ❌ Not supported &nbsp; ⚠️ Limited functionality

## Architecture

The extension follows a layered architecture with clean separation between platform-agnostic interfaces and platform-specific implementations.

```mermaid
block-beta
  columns 2

  block:ts:2
    columns 2
    tsTitle["TypeScript Interface Layer"]
    tsDesc["IRtcEngine · IRtcEngineEx · IRtcEventHandler\nIMediaPlayer · IAudioDeviceManager · ..."]
  end

  block:left
    columns 1
    jsbTitle["JSB Bindings (Native C++)"]
    jsbDesc["SWIG auto-gen + Manual"]
  end

  block:right
    columns 1
    twTitle["TS Wrapper (Web SDK)"]
    twDesc["agora-rtc-sdk-ng adapter"]
  end

  block:left2:1
    native["Agora Native SDK\niOS / Android / macOS / Win"]
  end

  block:right2:1
    web["agora-rtc-sdk-ng\n(Web SDK)"]
  end

  ts --> left & right
  left --> left2
  right --> right2

  style ts fill:#4a90d9,color:#fff
  style left fill:#67b168,color:#fff
  style right fill:#67b168,color:#fff
  style left2 fill:#e8a838,color:#fff
  style right2 fill:#e8a838,color:#fff
```

### Layer Descriptions

**TypeScript Interface Layer** — Platform-agnostic interfaces (`IRtcEngine`, `IMediaPlayer`, `IAudioDeviceManager`, etc.) that define the complete API contract. Both native and web implementations conform to these interfaces.

**JSB Bindings (Native C++)** — `RtcEngineNative.ts` uses ES6 `Proxy` to dynamically forward method calls to the C++ bridge layer via JSB. Bridge classes (`*Bridge.h/.cpp`) wrap the Agora native SDK. SWIG auto-generates most bindings from `.i` interface files. Complex cases (callback registration, same-argc overloads, bridge object lifecycle) are hand-written in `jsb_agora_rtc_manual.cpp`.

**TS Wrapper (Web SDK)** — Full web SDK adapter layer (`RtcEngineWeb.ts`, `AgoraRTCClientProxy.ts`, `TrackManager.ts`) that wraps `agora-rtc-sdk-ng` capabilities to match the TypeScript interface layer. `VideoTextureManager.ts` bridges Agora video tracks to Cocos Creator's rendering pipeline. `Helper.ts` provides bidirectional enum conversion between native and web SDK value spaces.

**Agora Native SDK** — Platform-specific SDK libraries (`.xcframework` for iOS/macOS, `.aar` for Android, `.dll`/`.lib` for Windows) downloaded via `scripts/predownload.js`.

**agora-rtc-sdk-ng** — Agora's official Web SDK for browser-based real-time communication.

## Project Structure

```
├── assets/agora-rtc/
│   ├── interface/          # TypeScript interfaces (IRtcEngine, IMediaPlayer, ...)
│   └── impl/
│       ├── native/         # Native JSB implementation (Proxy pattern)
│       └── web/            # Web SDK implementation (full adapter layer)
├── native/agora/           # C++ bridge classes wrapping Agora SDK
├── native/bindings/
│   ├── auto/               # SWIG-generated bindings (DO NOT EDIT)
│   └── manual/             # Hand-written JSB bindings
├── swig-config/            # SWIG interface files (.i)
├── scripts/                # Build tools (SWIG gen, SDK download, converters)
├── mac/                    # macOS SDK libs + CMake config
├── src/                    # Editor extension source
│   ├── main.ts             # Extension entry point
│   ├── builder.ts          # Build pipeline integration
│   ├── build-hooks.ts      # macOS permission injection
│   └── panels/             # Vue 3 editor panel
├── i18n/                   # Internationalization (en/zh)
└── jsb-rules/              # JSB development rules and patterns
```

## Quick Start

1. Download or clone this project into the `extensions` directory of your Cocos project

2. Navigate to the plugin root directory and run:

```bash
npm install
npm run build
```

3. In the Cocos Creator editor, open **Extensions → Agora RTC → Open AgoraRTC Plugin**

   ![Agora RTC Panel](README/panel.png)

4. Select the platform SDKs you want to support, then click Download

   ![Build Panel - SDK Version Selection](README/predownload.png)

5. `agora-rtc-sdk-ng` is included in the SDK by default — no extra download needed. Set it as a plugin as shown below:

   ![Set as Plugin](README/set_as_plugin.png)

6. Add the plugin script search path to your Cocos project's `tsconfig.json` so code completion works correctly:

```json
{
  "extends": "./temp/tsconfig.cocos.json",
  "compilerOptions": {
    "strict": false,
    "baseUrl": ".",
    "paths": {
      "db://agora-rtc-extension-for-cocos-creator/*": [
        "./extensions/agora-rtc-extension-for-cocos-creator/assets/*"
      ]
    }
  }
}
```

7. Create an `RtcEngine` using the following code:

```typescript
import {
    IRtcEngineEx,
    createRtcEngine,
} from "db://agora-rtc-extension-for-cocos-creator/agora-rtc";

this.rtcEngine = createRtcEngine();
```

8. We provide a rich example project for reference: [Agora-Rtc-Extension-Demo](https://github.com/xiayangqun/Agora-Rtc-Extension-Demo)

## Requirements

- Cocos Creator >= 3.8.8
- Node.js >= 16
- Xcode (for macOS/iOS builds)
- Android Studio (for Android builds)
- Visual Studio (for Windows builds)
