# JSB Skip List

> **Purpose**: Records all interfaces that should be **skipped** during JSB binding implementation — no native binding code should be generated for these. The decision to skip is made per-class, and all dependent interfaces are also excluded.
>
> **Why**: These interfaces involve complex media processing, spatial audio, or music services that are either platform-specific, not yet stable, or not required for the current binding scope.

---

## ⚠️ Implementation Rules

### Rule 1 — Factory methods return stub objects, not null

When a factory method creates a skipped object (e.g. `IRtcEngine.getH265Transcoder()`), the JSB bridge **must not return null**. Instead, it should construct and return a **stub/empty implementation** class that conforms to the interface. This prevents null-pointer crashes on the JS side when the caller chains method calls or stores the reference.

```
JS:  const transcoder = await engine.getH265Transcoder();  // ✅ returns stub, not null
JS:  transcoder.enableTranscode(...);                       // ✅ stub method, no crash
```

### Rule 2 — All skipped methods return `-ERR_NOT_SUPPORTED` immediately

Every method on a skipped class (and methods on the skipped observer/event-handler classes) **must not execute any native code**. The JSB binding should short-circuit and return `errorCode: -ERR_NOT_SUPPORTED` (error code value `-4`). This keeps the JS API surface intact while clearly signaling that the feature is unavailable.

```
C++ stub (JSB binding pseudo-code):
  int enableTranscode(...) {
      return -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;  // -4, never reaches native SDK
  }
```

---

## Skip Classes

| #   | Class                      | Reason                                                              | File                                    |
| --- | -------------------------- | ------------------------------------------------------------------- | --------------------------------------- |
| 1   | `IH265Transcoder`          | H.265 transcoding — complex codec pipeline                          | `interface/IH265Transcoder.ts`          |
| 2   | `ILocalSpatialAudioEngine` | Spatial audio — heavy 3D audio processing                           | `interface/ILocalSpatialAudioEngine.ts` |
| 3   | `IMediaEngine`             | Raw media frame pipeline (push/pull/custom tracks)                  | `interface/IMediaEngine.ts`             |
| 4   | `IMusicContentCenter`      | Music content service (charts, search, lyrics, preload, caches)     | `interface/IMusicContentCenter.ts`      |
| 5   | `IMusicPlayer`             | Music player (extends IMediaPlayer, created by IMusicContentCenter) | `interface/IMusicPlayer.ts`             |

---

## Dependents (also skipped)

These are **only used by the skipped classes**. Without the parent class, they have no standalone purpose — skip them too.

### Observer / Event Handler classes

| Class                             | Used by               | File                                           |
| --------------------------------- | --------------------- | ---------------------------------------------- |
| `IH265TranscoderObserver`         | `IH265Transcoder`     | `interface/IH265TranscoderObserver.ts`         |
| `IMusicContentCenterEventHandler` | `IMusicContentCenter` | `interface/IMusicContentCenterEventHandler.ts` |
| `IVideoFrameObserver`             | `IMediaEngine`        | `interface/IVideoFrameObserver.ts`             |
| `IFaceInfoObserver`               | `IMediaEngine`        | `interface/IFaceInfoObserver.ts`               |

---

## IRtcEngine Factory Methods (also skipped)

These methods on `IRtcEngine` create the skipped objects — skip their JSB bindings too:

| Method                         | Returns                    | Skipped because         |
| ------------------------------ | -------------------------- | ----------------------- |
| `getMusicContentCenter()`      | `IMusicContentCenter`      | Target class is skipped |
| `getLocalSpatialAudioEngine()` | `ILocalSpatialAudioEngine` | Target class is skipped |
| `getH265Transcoder()`          | `IH265Transcoder`          | Target class is skipped |

---

## IMusicContentCenter Methods (all skipped)

Since the class is skipped, its create/destroy methods are moot — but listed for completeness:

| Method                             | Effect                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `createMusicPlayer()`              | Returns `IMusicPlayer` — skipped (stub)                                 |
| `destroyMusicPlayer(IMusicPlayer)` | Destroys `IMusicPlayer` — skipped (no-op, returns `-ERR_NOT_SUPPORTED`) |

---

## Summary: File Map

```
Skip these entire files during JSB codegen:

interface/IH265Transcoder.ts
interface/IH265TranscoderObserver.ts
interface/ILocalSpatialAudioEngine.ts
interface/IMediaEngine.ts
interface/IVideoFrameObserver.ts
interface/IFaceInfoObserver.ts
interface/IMusicContentCenter.ts
interface/IMusicContentCenterEventHandler.ts
interface/IMusicPlayer.ts
```

```
On IRtcEngine (partial skip — only these 3 methods):

getMusicContentCenter()
getLocalSpatialAudioEngine()
getH265Transcoder()
```

---

> **Note**: `IMediaPlayer` is **NOT** skipped. `IMusicPlayer` extends `IMediaPlayer` but adds music-specific methods (`openWithSongCode`, `setPlayMode`). Since `IMusicPlayer` can only be created via `IMusicContentCenter.createMusicPlayer()`, it has no independent existence — hence it is skipped along with its parent.
