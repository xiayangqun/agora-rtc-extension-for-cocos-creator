> **⚠️ JSB WARNING**: Because the TS interface definitions and C++ Bridge definitions are **not** always 1:1 consistent, when writing the JSB bridge layer you **must** handle these functions specially. The parameter/return-value mapping differs from the C++ Bridge signatures — see each function's row for the exact C++-to-TS translation details.

# Bridge (C++) → TypeScript Translation: Special Functions

> **Purpose**: Documents all functions in `assets/agora-rtc/interface/` that are **not** a straightforward 1:1 translation from the C++ Bridge layer to TypeScript.
> **Audience**: AI agents and developers reading the interface code — this file explains the C++ Bridge semantics behind each special TS signature.
> **Reference Files**:
> - **Bridge C++ Header**: `native/agora/IRtcEngineExBridge.h`
> - **Bridge C++ Impl**: `native/agora/IRtcEngineExBridge.cpp`
> - **TS Interface**: `assets/agora-rtc/interface/IRtcEngine.ts`, `IRtcEngineEx.ts`
> - **C++ SDK Headers**: `mac/include/rtc/IAgoraRtcEngine.h`, `IAgoraRtcEngineEx.h`

---

## Special Pattern Overview

This plugin translates the Agora RTC Native SDK's C++ interface through a Bridge layer into TypeScript. Most functions are a direct 1:1 mapping, but **four** special patterns exist:

### Pattern A — Out-param wrapped into return value

C++ parameters passed by **reference (`&`)** or **pointer (`*`)** are wrapped into the `Promise` result object in TS.

```
C++:  virtual int func(SomeType& outParam) = 0;
                                      ^^^^^^^^
                                      out-param (reference)
TS:   func(): Promise<{ errorCode: number; outParam: SomeType }>;
```

### Pattern B — In/Out parameter (both input and output)

C++ reference/pointer parameters that serve **both as input and output**. The caller provides an initial value (buffer capacity, etc.), and the SDK updates it with the actual result. These parameters appear **both as function arguments and in the return object**.

```
C++:  virtual int func(int& inOutParam) = 0;
                              ^^^^^^^^^
                              in/out-param (reference)
TS:   func(inOutParam: number): Promise<{ errorCode: number; inOutParam: number }>;
```

### Pattern C — Callback / Observer registration

C++ functions that accept an **observer pointer (`Observer*`)** become TS functions that accept a **callback object**. The C++ SDK calls back into the JS layer through these objects.

```
C++:  virtual int registerObserver(IObserver* observer) = 0;
                                           ^^^^^^^^^^^^
                                           observer pointer
TS:   registerObserver(observer: IObserver): Promise<number>;
```

### Pattern D — Function Overloads（情况4：函数重载）

> **⚠️ CRITICAL**: The C++ SDK extensively uses **function overloading** — multiple methods with the **same name** but **different parameter lists**. Since the Bridge itself is C++ code, it should also use **native C++ overloading** (same method name, different parameter types/counts). The TS layer uses **TS-level overload signatures** (compile-time only) to route to a single runtime implementation that dispatches to the correct Bridge overload.

#### Key Rules

1. **Bridge (C++)**: Use **native C++ overloading**. Same method name, different parameter types/counts:
   ```cpp
   int leaveChannel();                                    // overload 1
   int leaveChannel(const AgoraRtcNativeLeaveChannelOptions& options); // overload 2
   ```

2. **JSB binding (C++ manual binding)**: Each Bridge overload gets its own `SE_BIND_FUNC`. If C++ overloads are distinguishable by parameter count/types at the binding level, they can map directly. If two overloads have the **same parameter count and indistinguishable types** after simplification (e.g., both become `(int, int)`), use numbered suffixes in the JSB binding function name only — **not** in the Bridge:
   ```cpp
   // Bridge: native C++ overloading
   int enableExtension(const std::string &provider, const std::string &extension, bool enable);          // overload 1
   int enableExtension(const std::string &provider, const std::string &extension, bool enable, int type); // overload 2 — distinguishable
   
   // JSB binding: if two overloads collapse to same param types, use suffix in binding function name
   SE_BIND_FUNC(js_agora_RtcEngineNative_enableExtension)     // → Bridge::enableExtension(3 params)
   SE_BIND_FUNC(js_agora_RtcEngineNative_enableExtension_2)   // → Bridge::enableExtension(4 params)
   ```

3. **TS side**: Declare all overload signatures, then implement ONE runtime method that dispatches based on arg count/types:
   ```ts
   enableExtension(provider: string, extension: string, enable: boolean): Promise<number>;
   enableExtension(provider: string, extension: string, enable: boolean, type: number): Promise<number>;
   async enableExtension(provider: string, extension: string, enable: boolean, type?: number): Promise<number> { ... }
   ```

4. **Ambiguous overloads**: If two SDK overloads simplify to the **exact same parameter types** (e.g., both become `(int, int)`), the Bridge MUST use different method names (e.g., `methodNameEx`). This is rare and documented below.

---

#### Current Bridge Overloads (`IRtcEngineExBridge.h`, 18 methods)

This is the source-of-truth overload list for the current C++ Bridge header. Keep this table in sync with `native/agora/IRtcEngineExBridge.h` whenever Bridge signatures change.

| # | Method | Bridge overload signatures | Notes |
|---|--------|----------------------------|-------|
| 1 | `createDataStream` | `createDataStream(bool reliable, bool ordered)`<br>`createDataStream(int config)` | SDK out-param `streamId` is wrapped into result |
| 2 | `enableDualStreamMode` | `enableDualStreamMode(bool enabled)`<br>`enableDualStreamMode(bool enabled, int streamConfig)` | `SimulcastStreamConfig` simplified to `int` |
| 3 | `enableExtension` | `enableExtension(string provider, string extension, int extensionInfo, bool enable)`<br>`enableExtension(string provider, string extension, bool enable, int type)` | Same arg count after simplification risk; binding must dispatch by arg types/order |
| 4 | `joinChannel` | `joinChannel(string token, string channelId, string info, uid_t uid)`<br>`joinChannel(string token, string channelId, uid_t uid, AgoraRtcNativeChannelMediaOptions options)` | Native C++ overloads |
| 5 | `joinChannelWithUserAccount` | `joinChannelWithUserAccount(string token, string channelId, string userAccount)`<br>`joinChannelWithUserAccount(string token, string channelId, string userAccount, AgoraRtcNativeChannelMediaOptions options)` | Native C++ overloads |
| 6 | `leaveChannel` | `leaveChannel()`<br>`leaveChannel(AgoraRtcNativeLeaveChannelOptions options)` | Mirrors SDK `LeaveChannelOptions` fields |
| 7 | `setAudioProfile` | `setAudioProfile(int profile, int scenario)`<br>`setAudioProfile(int profile)` | Native C++ overloads |
| 8 | `setClientRole` | `setClientRole(int role)`<br>`setClientRole(int role, int audienceLatencyLevel)` | `ClientRoleOptions` simplified to latency level |
| 9 | `setDualStreamMode` | `setDualStreamMode(int mode)`<br>`setDualStreamMode(int mode, int streamConfig)` | `SimulcastStreamConfig` simplified to `int` |
| 10 | `setLocalRenderMode` | `setLocalRenderMode(int renderMode, int mirrorMode)`<br>`setLocalRenderMode(int renderMode)` | Native C++ overloads |
| 11 | `setPlaybackAudioFrameBeforeMixingParameters` | `setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel)`<br>`setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel, int samplesPerCall)` | Native C++ overloads |
| 12 | `startAudioMixing` | `startAudioMixing(string filePath, bool loopback, int cycle)`<br>`startAudioMixing(string filePath, bool loopback, int cycle, int startPos)` | Native C++ overloads |
| 13 | `startAudioRecording` | `startAudioRecording(string filePath, int quality)`<br>`startAudioRecording(string filePath, int sampleRate, int quality)`<br>`startAudioRecording(int config)` | `AudioRecordingConfiguration` simplified to `int` |
| 14 | `startPreview` | `startPreview()`<br>`startPreview(int sourceType)` | Native C++ overloads |
| 15 | `startScreenCapture` | `startScreenCapture()`<br>`startScreenCapture(int sourceType)` | Bridge exposes source-type overload; full SDK config overload is stubbed/simplified |
| 16 | `stopPreview` | `stopPreview()`<br>`stopPreview(int sourceType)` | Native C++ overloads |
| 17 | `stopScreenCapture` | `stopScreenCapture()`<br>`stopScreenCapture(int sourceType)` | Native C++ overloads |
| 18 | `takeSnapshot` | `takeSnapshot(uid_t uid, string filePath)`<br>`takeSnapshot(uid_t uid, int config)` | SDK `SnapshotConfig` simplified to `int` |

#### SDK `IRtcEngine` Overloads (21 methods) — Bridge Strategy

Methods in `IAgoraRtcEngine.h` (`class IRtcEngine`) with multiple overloads, and how the Bridge handles them:

| # | Method | Overloads | Bridge Strategy | Notes |
|---|--------|-----------|-----------------|-------|
| 1 | `addVideoWatermark` | 3 | ⚠️ 3 stub methods: params collapse to `()` / `(string)` / `()` → **need different names** (1st & 3rd both `()`) | `addVideoWatermark()`, `addVideoWatermarkByUrl(string)`, `addVideoWatermarkByConfig()` |
| 2 | `createDataStream` | 2 | ✅ C++ overloading: `(bool, bool)` vs `(int)` — distinguishable | `createDataStream(bool, bool)`, `createDataStream(int)` (config as int) |
| 3 | `enableDualStreamMode` | 2 | ✅ C++ overloading: `(bool)` vs `(bool, int)` | `enableDualStreamMode(bool)`, `enableDualStreamMode(bool, int)` |
| 4 | `enableExtension` | 2 | ⚠️ After simplification: `(string, string, bool)` vs `(string, string, bool, int)` — ✅ distinguishable | C++ overloading works |
| 5 | `getExtensionProperty` | 2 | ⚠️ After simplification: 6 params vs 6 params with different types at pos 3 — ✅ distinguishable | `getExtensionProperty(string,string,int,string,string,int)` vs `getExtensionProperty(string,string,string,string,int,int)` |
| 6 | `joinChannel` | 2 | ✅ Already using C++ overloading | `joinChannel(string,string,string,uid_t)` vs `joinChannel(string,string,uid_t,options&)` |
| 7 | `joinChannelWithUserAccount` | 2 | ✅ Already using C++ overloading | Params differ by count |
| 8 | `leaveChannel` | 2 | ✅ C++ overloading: `()` vs `(LeaveChannelOptions)` | `leaveChannel()`, `leaveChannel(AgoraRtcNativeLeaveChannelOptions options)` |
| 9 | `setAudioProfile` | 2 | ✅ Already using C++ overloading | `setAudioProfile(int,int)` vs `setAudioProfile(int)` |
| 10 | `setClientRole` | 2 | ✅ Already using C++ overloading | `setClientRole(int)` vs `setClientRole(int,int)` |
| 11 | `setDualStreamMode` | 2 | ✅ C++ overloading: `(int)` vs `(int, int)` | Different param count |
| 12 | `setExtensionProperty` | 2 | ⚠️ After simplification: 5 params vs 5 params with different types at pos 3 — ✅ distinguishable | C++ overloading works |
| 13 | `setLocalRenderMode` | 2 | ✅ C++ overloading: `(int, int)` vs `(int)` | `setLocalRenderMode(int,int)`, `setLocalRenderMode(int)` |
| 14 | `setPlaybackAudioFrameBeforeMixingParameters` | 2 | ✅ C++ overloading: `(int, int)` vs `(int, int, int)` | Different param count |
| 15 | `startAudioMixing` | 2 | ✅ Already using C++ overloading | `(string,bool,int)` vs `(string,bool,int,int)` |
| 16 | `startAudioRecording` | 3 | ✅ C++ overloading: `(string,int)` vs `(string,int,int)` vs `(int)` — distinguishable | 3 overloads |
| 17 | `startPreview` | 2 | ✅ Already using C++ overloading | `()` vs `(int)` |
| 18 | `startScreenCapture` | 2 | ✅ C++ overloading: `(int)` vs `(int, int)` | `startScreenCapture(int)` vs `startScreenCapture(int, int)` |
| 19 | `stopPreview` | 2 | ✅ Already using C++ overloading | `()` vs `(int)` |
| 20 | `stopScreenCapture` | 2 | ✅ C++ overloading: `()` vs `(int)` | Different param count |
| 21 | `takeSnapshot` | 2 | ✅ C++ overloading: `(uid_t, string)` vs `(uid_t, int)` | Different 2nd param type |

#### SDK `IRtcEngineEx` Overloads (5 methods)

| # | Method | Overloads | Bridge Strategy | Notes |
|---|--------|-----------|-----------------|-------|
| 1 | `addVideoWatermarkEx` | 2 | ⚠️ need different names: both stubs with indistinguishable params | `addVideoWatermarkExByUrl(string)`, `addVideoWatermarkExByConfig(int)` |
| 2 | `createDataStreamEx` | 2 | ✅ C++ overloading: different param counts | `createDataStreamEx(bool,bool,int)`, `createDataStreamEx(int,int)` |
| 3 | `leaveChannelEx` | 2 | ✅ C++ overloading: `(int)` vs `(int, int)` | Different param count |
| 4 | `leaveChannelWithUserAccountEx` | 2 | ✅ C++ overloading: `(string,string)` vs `(string,string,int)` | Different param count |
| 5 | `takeSnapshotEx` | 2 | ✅ C++ overloading: `(int,uid_t,string)` vs `(int,uid_t,int)` | Different 3rd param type |

#### IRtcEngineEx Parallel Methods (52 "Ex" variants)

These are **NOT** C++ overloads (different method name with `Ex` suffix), but are multi-channel counterparts that append `const RtcConnection& connection`. The Bridge should expose them as separate methods:

| IRtcEngineEx method | Line | Corresponding IRtcEngine method |
|---|---|---|
| `joinChannelEx` | 1167 | `joinChannel` |
| `leaveChannelEx` | 1205 | `leaveChannel` |
| `leaveChannelWithUserAccountEx` | 1272 | N/A (pure IRtcEngineEx) |
| `updateChannelMediaOptionsEx` | 1316 | `updateChannelMediaOptions` |
| `setVideoEncoderConfigurationEx` | 1337 | `setVideoEncoderConfiguration` |
| `setupRemoteVideoEx` | 1367 | `setupRemoteVideo` |
| `muteRemoteAudioStreamEx` | 1386 | `muteRemoteAudioStream` |
| `muteRemoteVideoStreamEx` | 1405 | `muteRemoteVideoStream` |
| `setRemoteVideoStreamTypeEx` | 1445 | `setRemoteVideoStreamType` |
| `muteLocalAudioStreamEx` | 1465 | `muteLocalAudioStream` |
| `muteLocalVideoStreamEx` | 1485 | `muteLocalVideoStream` |
| `muteAllRemoteAudioStreamsEx` | 1509 | `muteAllRemoteAudioStreams` |
| `muteAllRemoteVideoStreamsEx` | 1527 | `muteAllRemoteVideoStreams` |
| `setSubscribeAudioBlocklistEx` | 1558 | `setSubscribeAudioBlocklist` |
| `setSubscribeAudioAllowlistEx` | 1587 | `setSubscribeAudioAllowlist` |
| `setSubscribeVideoBlocklistEx` | 1617 | `setSubscribeVideoBlocklist` |
| `setSubscribeVideoAllowlistEx` | 1646 | `setSubscribeVideoAllowlist` |
| `setRemoteVideoSubscriptionOptionsEx` | 1662 | `setRemoteVideoSubscriptionOptions` |
| `setRemoteVoicePositionEx` | 1690 | `setRemoteVoicePosition` |
| `setRemoteUserSpatialAudioParamsEx` | 1701 | `setRemoteUserSpatialAudioParams` |
| `enableLoopbackRecordingEx` | 1752 | `enableLoopbackRecording` |
| `adjustRecordingSignalVolumeEx` | 1768 | `adjustRecordingSignalVolume` |
| `muteRecordingSignalEx` | 1783 | `muteRecordingSignal` |
| `adjustUserPlaybackSignalVolumeEx` | 1805 | `adjustUserPlaybackSignalVolume` |
| `getConnectionStateEx` | 1818 | `getConnectionState` |
| `enableEncryptionEx` | 1843 | `enableEncryption` |
| `createDataStreamEx` | 1878 | `createDataStream` |
| `sendStreamMessageEx` | 1941 | `sendStreamMessage` |
| `sendRdtMessageEx` | 1957 | `sendRdtMessage` |
| `sendMediaControlMessageEx` | 1972 | `sendMediaControlMessage` |
| `addVideoWatermarkEx` | 2017 | `addVideoWatermark` |
| `removeVideoWatermarkEx` | 2051 | `removeVideoWatermark` |
| `clearVideoWatermarkEx` | 2062 | `clearVideoWatermarks` |
| `enableAudioVolumeIndicationEx` | 2110 | `enableAudioVolumeIndication` |
| `startRtmpStreamWithoutTranscodingEx` | 2143 | `startRtmpStreamWithoutTranscoding` |
| `startRtmpStreamWithTranscodingEx` | 2178 | `startRtmpStreamWithTranscoding` |
| `updateRtmpTranscodingEx` | 2197 | `updateRtmpTranscoding` |
| `stopRtmpStreamEx` | 2219 | `stopRtmpStream` |
| `startOrUpdateChannelMediaRelayEx` | 2257 | `startOrUpdateChannelMediaRelay` |
| `stopChannelMediaRelayEx` | 2281 | `stopChannelMediaRelay` |
| `pauseAllChannelMediaRelayEx` | 2300 | `pauseAllChannelMediaRelay` |
| `resumeAllChannelMediaRelayEx` | 2318 | `resumeAllChannelMediaRelay` |
| `getUserInfoByUserAccountEx` | 2333 | `getUserInfoByUserAccount` |
| `getUserInfoByUidEx` | 2348 | `getUserInfoByUid` |
| `takeSnapshotEx` | 2495 | `takeSnapshot` |
| `enableContentInspectEx` | 2550 | `enableContentInspect` |
| `startMediaRenderingTracingEx` | 2582 | `startMediaRenderingTracing` |
| `setParametersEx` | 2592 | `setParameters` |
| `getCallIdEx` | 2607 | `getCallId` |
| `sendAudioMetadataEx` | 2620 | `sendAudioMetadata` |
| `preloadEffectEx` | 2652 | `preloadEffect` |
| `playEffectEx` | 2701 | `playEffect` |

---

## IRtcEngine.ts

**File**: `assets/agora-rtc/interface/IRtcEngine.ts`
**C++ Header**: `windows/include/rtc/IAgoraRtcEngine.h`

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param field |
|---|---|---|
| `getVersion(): Promise<{ version: string; build: number }>` | `virtual const char* getVersion(int* build) = 0;` | `build` is out-param via `int*`. `version` is the C++ return value |
| `getAudioDeviceInfo(): Promise<{ errorCode: number; deviceInfo: DeviceInfo }>` | `virtual int getAudioDeviceInfo(DeviceInfo& deviceInfo) = 0;` | `deviceInfo` is out-param via `DeviceInfo&` reference |
| `queryHDRCapability(videoModule): Promise<{ errorCode: number; capability: HDR_CAPABILITY }>` | `virtual int queryHDRCapability(VIDEO_MODULE_TYPE, HDR_CAPABILITY&) = 0;` | `capability` is out-param via `HDR_CAPABILITY&` reference |
| `uploadLogFile(): Promise<{ requestId: string; errorCode: number }>` | `virtual int uploadLogFile(agora::util::AString& requestId) = 0;` | `requestId` is out-param via `AString&` reference |
| `getExtensionProperty(provider, extension, extensionInfo, key, buf_len): Promise<{ errorCode: number; value: string }>` | `virtual int getExtensionProperty(..., char* value, int buf_len) = 0;` | `value` is out-param via `char*` buffer |
| `getExtensionProperty(provider, extension, key, buf_len, type): Promise<{ errorCode: number; value: number }>` | `virtual int getExtensionProperty(..., char* value, int buf_len, MEDIA_SOURCE_TYPE) = 0;` | `value` is out-param via `char*` buffer |
| `createDataStream(reliable, ordered): Promise<{ streamId: number; errorCode: number }>` | `virtual int createDataStream(int* streamId, bool reliable, bool ordered) = 0;` | `streamId` is out-param via `int*` pointer |
| `createDataStream(config): Promise<{ streamId: number; errorCode: number }>` | `virtual int createDataStream(int* streamId, const DataStreamConfig& config) = 0;` | `streamId` is out-param via `int*` pointer |
| `getUserInfoByUserAccount(userAccount): Promise<{ errorCode: number; userInfo: UserInfo }>` | `virtual int getUserInfoByUserAccount(const char* userAccount, UserInfo* userInfo) = 0;` | `userInfo` is out-param via `UserInfo*` pointer |
| `getUserInfoByUid(uid): Promise<{ errorCode: number; userInfo: UserInfo }>` | `virtual int getUserInfoByUid(uid_t uid, UserInfo* userInfo) = 0;` | `userInfo` is out-param via `UserInfo*` pointer |
| `queryHDRCapability(videoModule): Promise<{ errorCode: number; capability: HDR_CAPABILITY }>` | `virtual int queryHDRCapability(VIDEO_MODULE_TYPE, HDR_CAPABILITY&) = 0;` | `capability` is out-param via `HDR_CAPABILITY&` reference |

### Pattern A — Out-param wrapped into return value (continued)

| TS Signature | C++ Signature | Out-param field |
|---|---|---|
| `getCallId(): Promise<{ callId: string; errorCode: number }>` | `virtual int getCallId(agora::util::AString& callId) = 0;` | `callId` is out-param via `AString&` reference |
| `getFaceShapeBeautyOptions(type: MEDIA_SOURCE_TYPE): Promise<{ errorCode: number; options: FaceShapeBeautyOptions }>` | `virtual int getFaceShapeBeautyOptions(FaceShapeBeautyOptions& options, ...) = 0;` | `options` is out-param via `FaceShapeBeautyOptions&` reference |
| `getFaceShapeAreaOptions(shapeArea: FACE_SHAPE_AREA, type: MEDIA_SOURCE_TYPE): Promise<{ errorCode: number; options: FaceShapeAreaOptions }>` | `virtual int getFaceShapeAreaOptions(..., FaceShapeAreaOptions& options, ...) = 0;` | `options` is out-param via `FaceShapeAreaOptions&` reference |

### Pattern B — In/Out parameter

| TS Signature | C++ Signature | In/Out parameter |
|---|---|---|
| `queryCodecCapability(size: number): Promise<{ errorCode: number; codecInfo: CodecCapInfo[]; size: number }>` | `virtual int queryCodecCapability(CodecCapInfo* codecInfo, int& size) = 0;` | `size` is in/out — input tells buffer capacity, output returns actual count. `codecInfo` is also in/out |
| `queryCameraFocalLengthCapability(size: number): Promise<{ errorCode: number; focalLengthInfos: FocalLengthInfo[]; size: number }>` | `virtual int queryCameraFocalLengthCapability(FocalLengthInfo*, int& size) = 0;` | `size` is in/out — input tells buffer capacity, output returns actual count. `focalLengthInfos` is a pure out-param |

### Pattern C — Struct-embedded callback registration

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `initialize(context: RtcEngineContext): Promise<number>` | `virtual int initialize(const RtcEngineContext& context) = 0;` | The `context.eventHandler` field is `IRtcEngineEventHandler*` in C++ (an observer pointer). TS receives an `IRtcEngineEventHandler` callback object nested inside the struct. The SDK calls back into JS through this object |

---

## IRtcEngineEx.ts

**File**: `assets/agora-rtc/interface/IRtcEngineEx.ts`
**C++ Header**: `windows/include/rtc/IAgoraRtcEngineEx.h`

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param field |
|---|---|---|
| `createDataStreamEx(reliable, ordered, connection): Promise<{ streamId: number; errorCode: number }>` | `virtual int createDataStream(int* streamId, ...) = 0;` (inherits from IRtcEngine) | `streamId` via pointer |
| `createDataStreamEx(config, connection): Promise<{ streamId: number; errorCode: number }>` | Same as above | Same as above |

### Pattern A — Out-param wrapped into return value (continued)

| TS Signature | C++ Signature | Out-param field |
|---|---|---|
| `getUserInfoByUserAccountEx(userAccount: string, connection: RtcConnection): Promise<{ errorCode: number; userInfo: UserInfo }>` | `virtual int getUserInfoByUserAccountEx(const char*, UserInfo*, const RtcConnection&) = 0;` | `userInfo` is out-param via `UserInfo*` pointer |
| `getUserInfoByUidEx(uid: number, connection: RtcConnection): Promise<{ errorCode: number; userInfo: UserInfo }>` | `virtual int getUserInfoByUidEx(uid_t, UserInfo*, const RtcConnection&) = 0;` | `userInfo` is out-param via `UserInfo*` pointer |
| `getCallIdEx(connection: RtcConnection): Promise<{ callId: string; errorCode: number }>` | `virtual int getCallIdEx(agora::util::AString&, const RtcConnection&) = 0;` | `callId` is out-param via `AString&` reference |

*This file has no in/out parameters — all special functions are pure out-params (Pattern A).*

---

## IAudioDeviceManager.ts

**File**: `assets/agora-rtc/interface/IAudioDeviceManager.ts`
**C++ Header**: `windows/include/rtc/IAudioDeviceManager.h`

### Pattern A — Out-param wrapped into return value

All `get*` functions wrap C++ out-params into the Promise result:

| TS Signature | C++ Signature | Out-param notes |
|---|---|---|
| `getPlaybackDevice(): Promise<{ deviceId: string; errorCode: number }>` | `virtual int getPlaybackDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;` | `deviceId` is a `char[]` buffer out-param |
| `getPlaybackDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }>` | `virtual int getPlaybackDeviceInfo(char deviceId[], char deviceName[]) = 0;` | Two `char[]` buffer out-params |
| `getPlaybackDeviceInfoType(): Promise<{ deviceId: string; deviceName: string; deviceTypeName: string; errorCode: number }>` | `virtual int getPlaybackDeviceInfo(char deviceId[], char deviceName[], char deviceTypeName[]) = 0;` | Three `char[]` buffer out-params |
| `getPlaybackDeviceVolume(volume: number): Promise<{ volume: number; errorCode: number }>` | `virtual int getPlaybackDeviceVolume(int *volume) = 0;` | `volume` is an `int*` pointer out-param |
| `getPlaybackDeviceMute(): Promise<{ mute: boolean; errorCode: number }>` | `virtual int getPlaybackDeviceMute(bool *mute) = 0;` | `mute` is a `bool*` pointer out-param |
| `getRecordingDevice(): Promise<{ deviceId: string; errorCode: number }>` | `virtual int getRecordingDevice(char deviceId[]) = 0;` | `deviceId` is a `char[]` buffer out-param |
| `getRecordingDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }>` | `virtual int getRecordingDeviceInfo(char deviceId[], char deviceName[]) = 0;` | Two `char[]` buffer out-params |
| `getRecordingDeviceInfoType(): Promise<{ ... }>` | `virtual int getRecordingDeviceInfo(char[], char[], char[]) = 0;` | Three `char[]` buffer out-params |
| `getRecordingDeviceVolume(): Promise<{ volume: number; errorCode: number }>` | `virtual int getRecordingDeviceVolume(int *volume) = 0;` | `volume` is an `int*` pointer out-param |
| `getRecordingDeviceMute(): Promise<{ mute: boolean; errorCode: number }>` | `virtual int getRecordingDeviceMute(bool *mute) = 0;` | `mute` is a `bool*` pointer out-param |
| `getLoopbackDevice(): Promise<{ deviceId: string; errorCode: number }>` | `virtual int getLoopbackDevice(char deviceId[]) = 0;` | `deviceId` is a `char[]` buffer out-param |

---

## IVideoDeviceManager.ts

**File**: `assets/agora-rtc/interface/IVideoDeviceManager.ts`
**C++ Header**: `windows/include/rtc/IAgoraRtcEngine.h` (IVideoDeviceManager is defined within it)

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param notes |
|---|---|---|
| `getDevice(): Promise<{ deviceIdUTF8: string; errorCode: number }>` | `virtual int getDevice(char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) = 0;` | `deviceIdUTF8` is a `char[]` buffer out-param |
| `getCapability(deviceIdUTF8, deviceCapabilityNumber): Promise<{ capability: VideoFormat; errorCode: number }>` | `virtual int getCapability(..., VideoFormat& capability) = 0;` | `capability` is a `VideoFormat&` reference out-param |

---

## IAudioDeviceCollection.ts

**File**: `assets/agora-rtc/interface/IAudioDeviceCollection.ts`
**C++ Header**: `windows/include/rtc/IAudioDeviceManager.h`

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param notes |
|---|---|---|
| `getDevice(index): Promise<{ deviceName: string; deviceId: string; errorCode: number }>` | `virtual int getDevice(int index, char deviceName[], char deviceId[]) = 0;` | Two `char[]` buffer out-params |
| `getDeviceType(index): Promise<{ deviceName: string; deviceTypeName: string; deviceId: string; errorCode: number }>` | `virtual int getDevice(int index, char deviceName[], char deviceTypeName[], char deviceId[]) = 0;` | Three `char[]` buffer out-params |
| `getDefaultDevice(): Promise<{ deviceName: string; deviceId: string; errorCode: number }>` | `virtual int getDefaultDevice(char deviceName[], char deviceId[]) = 0;` | Two `char[]` buffer out-params |
| `getDefaultDeviceType(): Promise<{ deviceName: string; deviceTypeName: string; deviceId: string; errorCode: number }>` | `virtual int getDefaultDevice(char deviceName[], char deviceTypeName[], char deviceId[]) = 0;` | Three `char[]` buffer out-params |
| `getApplicationVolume(): Promise<{ volume: number; errorCode: number }>` | `virtual int getApplicationVolume(int &volume) = 0;` | `volume` is an `int&` reference out-param |
| `isApplicationMute(): Promise<{ mute: boolean; errorCode: number }>` | `virtual int getApplicationMute(bool &mute)` | `mute` is a `bool&` reference out-param |

---

## IVideoDeviceCollection.ts

**File**: `assets/agora-rtc/interface/IVideoDeviceCollection.ts`
**C++ Header**: `windows/include/rtc/IAgoraRtcEngine.h`

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param notes |
|---|---|---|
| `getDevice(index): Promise<{ deviceNameUTF8: string; deviceIdUTF8: string; errorCode: number }>` | `virtual int getDevice(int index, char deviceNameUTF8[], char deviceIdUTF8[]) = 0;` | Two `char[]` buffer out-params |

---

## IMediaPlayer.ts

**File**: `assets/agora-rtc/interface/IMediaPlayer.ts`
**C++ Header**: `windows/include/rtc/IAgoraMediaPlayer.h`

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param notes |
|---|---|---|
| `getDuration(): Promise<{ duration: number; errorCode: number }>` | `virtual int getDuration(int64_t& duration) = 0;` | `duration` is an `int64_t&` reference out-param |
| `getPlayPosition(): Promise<{ pos: number; errorCode: number }>` | `virtual int getPlayPosition(int64_t& pos) = 0;` | `pos` is an `int64_t&` reference out-param |
| `getStreamCount(): Promise<{ count: number; errorCode: number }>` | `virtual int getStreamCount(int64_t& count) = 0;` | `count` is an `int64_t&` reference out-param |
| `getStreamInfo(index): Promise<{ info: PlayerStreamInfo; errorCode: number }>` | `virtual int getStreamInfo(int64_t index, PlayerStreamInfo* info) = 0;` | `info` is a `PlayerStreamInfo*` pointer out-param |
| `getMute(): Promise<{ muted: boolean; errorCode: number }>` | `virtual int getMute(bool& muted) = 0;` | `muted` is a `bool&` reference out-param |
| `getPlayoutVolume(): Promise<{ volume: number; errorCode: number }>` | `virtual int getPlayoutVolume(int& volume) = 0;` | `volume` is an `int&` reference out-param |
| `getPublishSignalVolume(): Promise<{ volume: number; errorCode: number }>` | `virtual int getPublishSignalVolume(int& volume) = 0;` | `volume` is an `int&` reference out-param |
| `getAudioBufferDelay(): Promise<{ delayMs: number; errorCode: number }>` | `virtual int getAudioBufferDelay(int32_t& delayMs) = 0;` | `delayMs` is an `int32_t&` reference out-param |

### Pattern C — Callback / Observer registration

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `initEventHandler(engineEventHandler: IMediaPlayerSourceObserver): Promise<number>` | `virtual int registerPlayerSourceObserver(IMediaPlayerSourceObserver* observer) = 0;` | C++ accepts `IMediaPlayerSourceObserver*` pointer. TS accepts a concrete subclass instance of the abstract class `IMediaPlayerSourceObserver` |

---

## IMediaPlayerCacheManager.ts

**File**: `assets/agora-rtc/interface/IMediaPlayerCacheManager.ts`
**C++ Header**: `windows/include/rtc/IAgoraMediaPlayer.h`

### Pattern B — Out-param as a mutable argument

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `getCacheDir(path: string, length: number): Promise<number>` | `virtual int getCacheDir(char* path, int length) = 0;` | `path` is a `char*` buffer out-param |

---

## IMediaEngine.ts

**File**: `assets/agora-rtc/interface/IMediaEngine.ts`
**C++ Header**: `windows/include/rtc/IAgoraMediaEngine.h`

*No Pattern B functions in this file — `pullAudioFrame` uses a standard in-param, not an out-param.*

### Pattern C — Callback / Observer registration

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `registerAudioFrameObserver(observer: unknown): Promise<number>` | `virtual int registerAudioFrameObserver(IAudioFrameObserver* observer) = 0;` | C++ accepts `IAudioFrameObserver*` pointer |
| `registerVideoFrameObserver(observer: IVideoFrameObserver): Promise<number>` | `virtual int registerVideoFrameObserver(IVideoFrameObserver* observer) = 0;` | C++ accepts `IVideoFrameObserver*` pointer |
| `registerVideoEncodedFrameObserver(observer: unknown): Promise<number>` | Corresponding C++ `registerVideoEncodedFrameObserver` | C++ accepts observer pointer |
| `registerFaceInfoObserver(observer: IFaceInfoObserver): Promise<number>` | `virtual int registerFaceInfoObserver(IFaceInfoObserver* observer) = 0;` | C++ accepts `IFaceInfoObserver*` pointer |

---

## IMediaRecorder.ts

**File**: `assets/agora-rtc/interface/IMediaRecorder.ts`
**C++ Header**: `windows/include/rtc/IAgoraMediaRecorder.h`

### Pattern C — Callback / Observer registration

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `setMediaRecorderObserver(callback: IMediaRecorderObserver): Promise<number>` | `virtual int setMediaRecorderObserver(IMediaRecorderObserver* callback) = 0;` | C++ accepts `IMediaRecorderObserver*` pointer |

---

## IH265Transcoder.ts

**File**: `assets/agora-rtc/interface/IH265Transcoder.ts`
**C++ Header**: `windows/include/rtc/IAgoraH265Transcoder.h`

### Pattern C — Callback / Observer registration

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `registerTranscoderObserver(observer: IH265TranscoderObserver): Promise<number>` | `virtual int registerTranscoderObserver(IH265TranscoderObserver *observer) = 0;` | C++ accepts `IH265TranscoderObserver*` pointer |

---

## IMusicContentCenter.ts

**File**: `assets/agora-rtc/interface/IMusicContentCenter.ts`
**C++ Header**: `windows/include/rtc/IAgoraMusicContentCenter.h`

### Pattern A — Out-param wrapped into return value

| TS Signature | C++ Signature | Out-param field |
|---|---|---|
| `getMusicCharts(): Promise<{ requestId: string; errorCode: number }>` | `virtual int getMusicCharts(agora::util::AString& requestId) = 0;` | `requestId` is out-param via `AString&` reference |
| `getMusicCollectionByMusicChartId(musicChartId, page, pageSize, jsonOption): Promise<{ requestId: string; errorCode: number }>` | `virtual int getMusicCollectionByMusicChartId(AString& requestId, ...) = 0;` | `requestId` is out-param via `AString&` reference |
| `searchMusic(keyWord, page, pageSize, jsonOption): Promise<{ requestId: string; errorCode: number }>` | Same pattern | `requestId` is out-param |
| `preload(songCode: number): Promise<{ requestId: string; errorCode: number }>` (2nd overload) | Same pattern | `requestId` is out-param |
| `getLyric(songCode, lyricType): Promise<{ requestId: string; errorCode: number }>` | `virtual int getLyric(AString& requestId, ...) = 0;` | `requestId` is out-param via `AString&` reference |
| `getSongSimpleInfo(songCode): Promise<{ requestId: string; errorCode: number }>` | `virtual int getSongSimpleInfo(AString& requestId, ...) = 0;` | `requestId` is out-param via `AString&` reference |
| `getInternalSongCode(songCode, jsonOption): Promise<{ errorCode: number; internalSongCode: number }>` | `virtual int getInternalSongCode(..., int64_t& internalSongCode) = 0;` | `internalSongCode` is out-param via `int64_t&` reference |

### Pattern B — In/Out parameter

| TS Signature | C++ Signature | In/Out parameter |
|---|---|---|
| `getCaches(cacheInfoSize: number): Promise<{ errorCode: number; cacheInfo: MusicCacheInfo[]; cacheInfoSize: number }>` | `virtual int getCaches(MusicCacheInfo *cacheInfo, int32_t* cacheInfoSize) = 0;` | `cacheInfoSize` is in/out — input tells buffer capacity (number of `MusicCacheInfo` entries), output returns actual count. `cacheInfo` is a pure out-param |

### Pattern C — Callback / Observer registration

| TS Signature | C++ Signature | Notes |
|---|---|---|
| `registerEventHandler(eventHandler: IMusicContentCenterEventHandler): Promise<number>` | `virtual int registerEventHandler(IMusicContentCenterEventHandler* eventHandler) = 0;` | C++ accepts `IMusicContentCenterEventHandler*` pointer |

---

## Summary Index

### Pattern A — Out-param wrapped into return value

| File | Functions |
|---|---|
| `IRtcEngine.ts` | `getVersion`, `getAudioDeviceInfo`, `uploadLogFile`, `getExtensionProperty` (x2), `createDataStream` (x2), `getUserInfoByUserAccount`, `getUserInfoByUid`, `queryHDRCapability`, `getCallId`, `getFaceShapeBeautyOptions`, `getFaceShapeAreaOptions` |
| `IRtcEngineEx.ts` | `createDataStreamEx` (x2), `getUserInfoByUserAccountEx`, `getUserInfoByUidEx`, `getCallIdEx` |
| `IAudioDeviceManager.ts` | `getPlaybackDevice`, `getPlaybackDeviceInfo`, `getPlaybackDeviceInfoType`, `getPlaybackDeviceVolume`, `getPlaybackDeviceMute`, `getRecordingDevice`, `getRecordingDeviceInfo`, `getRecordingDeviceInfoType`, `getRecordingDeviceVolume`, `getRecordingDeviceMute`, `getLoopbackDevice` |
| `IVideoDeviceManager.ts` | `getDevice`, `getCapability` |
| `IAudioDeviceCollection.ts` | `getDevice`, `getDeviceType`, `getDefaultDevice`, `getDefaultDeviceType`, `getApplicationVolume`, `isApplicationMute` |
| `IVideoDeviceCollection.ts` | `getDevice` |
| `IMediaPlayer.ts` | `getDuration`, `getPlayPosition`, `getStreamCount`, `getStreamInfo`, `getMute`, `getPlayoutVolume`, `getPublishSignalVolume`, `getAudioBufferDelay` |
| `IMusicContentCenter.ts` | `getMusicCharts`, `getMusicCollectionByMusicChartId`, `searchMusic`, `preload` (2nd overload), `getLyric`, `getSongSimpleInfo`, `getInternalSongCode` |

### Pattern B — In/Out parameter (both input and output)

| File | Functions | In/Out parameter |
|---|---|---|
| `IRtcEngine.ts` | `queryCodecCapability` | `size` — input: buffer capacity, output: actual count |
| `IRtcEngine.ts` | `queryCameraFocalLengthCapability` | `size` — input: buffer capacity, output: actual count |
| `IMusicContentCenter.ts` | `getCaches` | `cacheInfoSize` — input: buffer capacity, output: actual count |

### Pattern C — Callback / Observer registration

| File | Function | Callback Type |
|---|---|---|
| `IRtcEngine.ts` | `initialize` | `RtcEngineContext.eventHandler` (struct-embedded `IRtcEngineEventHandler`) |
| `IMediaPlayer.ts` | `initEventHandler` | `IMediaPlayerSourceObserver` |
| `IMediaEngine.ts` | `registerAudioFrameObserver` | `unknown` (IAudioFrameObserver) |
| `IMediaEngine.ts` | `registerVideoFrameObserver` | `IVideoFrameObserver` |
| `IMediaEngine.ts` | `registerVideoEncodedFrameObserver` | `unknown` |
| `IMediaEngine.ts` | `registerFaceInfoObserver` | `IFaceInfoObserver` |
| `IMediaRecorder.ts` | `setMediaRecorderObserver` | `IMediaRecorderObserver` |
| `IH265Transcoder.ts` | `registerTranscoderObserver` | `IH265TranscoderObserver` |
| `IMusicContentCenter.ts` | `registerEventHandler` | `IMusicContentCenterEventHandler` |

---

> **Note**: This document only lists functions that are **not** a straightforward 1:1 translation. All unlisted functions follow the standard mapping: C++ parameters map directly to TS parameters, and the C++ `int` return value becomes the `number` in `Promise<number>`.
>
> **Pattern classification**: Pattern A = pure out-params (appear only in the return object). Pattern B = in/out params (appear both as function arguments and in the return object). Pattern C = callback/observer registration.
