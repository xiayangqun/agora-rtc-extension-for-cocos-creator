# JSB Development Guide for Agora RTC Extension

> **Purpose**: A practical guide for writing the JSB (JavaScript Binding) bridge layer for this Agora RTC Cocos Creator extension.
> **Key Insight**: SWIG auto-generates ~90% of the binding code. Only functions listed in `CXX-TS-TRANSLATION-SPECIAL.md` (Pattern A/B/C) need hand-written manual bindings.
> **References**: Cocos Creator 3.8 [JSB+SWIG docs](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/jsb-swig.html), [Native Plugin docs](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/native-plugins/brief.html), and engine source at `cocos-engine/native/cocos/bindings/`.

---

## 1. SWIG Auto-Generation (90% of binding code)

SWIG parses C++ headers via `.i` interface files and generates the `se::` binding code automatically. Only functions that don't map 1:1 need manual code.

### 1.1 The `.i` Interface File

Copy `swig-interface-template.i`, rename to `agora_rtc.i`:

```c
// agora_rtc.i
%module(target_namespace="agora") agora_rtc

%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "AgoraRtcEngine.h"       // your C++ headers
#include "AgoraMusicContentCenter.h"
%}

%{
#include "bindings/auto/jsb_agora_rtc_auto.h"
using namespace agora::rtc;
%}

// ---- IGNORE functions that need manual binding (Pattern A/B/C) ----
%ignore agora::rtc::IRtcEngine::getCallId;
%ignore agora::rtc::IRtcEngine::queryCodecCapability;
%ignore agora::rtc::IRtcEngine::queryCameraFocalLengthCapability;
// ... (all functions listed in CXX-TS-TRANSLATION-SPECIAL.md)
%ignore agora::rtc::IMusicContentCenter;

// ---- INCLUDE the C++ headers (SWIG parses these) ----
%include "IAgoraRtcEngine.h"
%include "IAgoraMusicContentCenter.h"
```

**Key directives**:

| Directive | Purpose |
|---|---|
| `%module(target_namespace="agora") agora_rtc` | The JS namespace prefix + registration function suffix |
| `%insert(header_file) %{...%}` | Code inserted at top of generated `.h` |
| `%{...%}` | Code inserted at top of generated `.cpp` |
| `%ignore ns::Class::method` | Skip this function/member (use for Pattern A/B/C functions) |
| `%ignore ns::Class` | Skip an entire class (use for skip-listed classes) |
| `%rename(NewName) ns::Class::oldName` | Rename in JS |
| `%include "header.h"` | Parse and bind everything in this header |
| `%import "header.h"` | Declare dependency without generating code |
| `%attribute(ns::Class, Type, jsProp, getter, setter)` | Bind getter/setter pair as JS property |
| `%attribute_writeonly(ns::Class, Type, jsProp, setter)` | Write-only JS property |
| `%module_macro(CC_USE_XXX) ns::Class` | Wrap generated code in a compile flag |

### 1.2 Build Configuration: `swig-config.js`

```js
// swig-config.js
'use strict';
const path = require('path');

const configList = [
    ['agora_rtc.i', 'jsb_agora_rtc_auto.cpp'],
];

const projectRoot = path.join(__dirname, '..');
const interfacesDir = path.join(projectRoot, 'swig-config');
const bindingsOutDir = path.join(projectRoot, 'native', 'bindings', 'auto');
// Extra include paths for SWIG to find headers
const includeDirs = [
    path.join(projectRoot, 'include'),   // Agora RTC SDK headers
];

module.exports = { interfacesDir, bindingsOutDir, includeDirs, configList };
```

Run generation:
```bash
node <cocos-engine>/native/tools/swig-config/genbindings.js -c swig-config.js
```

### 1.3 What SWIG Can and Cannot Do

| ✅ SWIG auto-generates | ❌ Must hand-write (manual binding) |
|---|---|
| Simple in-params → JS args | Pattern A: C++ out-params wrapped to return object |
| C++ return values → `s.rval().setInt32(...)` | Pattern B: In/out params (both arg and return) |
| Class constructors, destructors, finalizers | Pattern C: Callback objects nested in structs |
| Public member variables → JS properties | Any `%ignore`'d function in `.i` file |
| `%attribute` getter/setter → JS property | Skip-listed classes (return stubs) |
| `%rename` → JS identifier changes | Thread-safe callback dispatch (Agora sub-threads!) |

### 1.4 Manual Binding Registration

After SWIG generates `jsb_agora_rtc_auto.cpp`, register both auto + manual modules:

```cpp
#include "bindings/auto/jsb_agora_rtc_auto.h"
#include "bindings/manual/jsb_agora_rtc_manual.h"  // your hand-written code

bool jsb_register_all_modules() {
    se::ScriptEngine* se = se::ScriptEngine::getInstance();
    se->addRegisterCallback(register_all_agora_rtc);  // SWIG-generated
    se->addRegisterCallback(register_agora_rtc_manual); // Hand-written
    return true;
}
```

---

## 2. 100% Self-Contained Plugin Architecture

The Cocos Creator native plugin system (since 3.6.3) is designed so that **everything** — SWIG generation, CMake compilation, and binding registration — lives inside the plugin directory. The built native project (`native/engine/common/`) is **never modified**.

### 2.1 How the Engine Discovers Plugins

```
Build time (CMake):
  cc_gen_plugin_cmake_hook()
    → scans /extensions/ for cc_plugin.json
    → plugins_parser.js reads modules → target names
    → generates Pre-AutoLoadPlulgins.cmake with find_package() calls
    → cc_plugin_entry() generates plugin_registry_autogen.cpp

Runtime (C++):
  cc_load_all_plugins()
    → calls cc_load_plugin_<name>() for each registered plugin
    → plugin's code registers JSB bindings via ScriptEngine
```

### 2.2 Plugin File Structure

```
agora-rtc-extension/                  ← This repo root
├── cc_plugin.json                    ← THE descriptor (engine scans for this)
│
├── ios/
│   └── AgoraRtcExtension-Config.cmake   ← CMake module (platform-specific)
├── mac/
│   └── AgoraRtcExtension-Config.cmake
├── android/
│   ├── arm64-v8a/
│   │   └── AgoraRtcExtension-Config.cmake
│   └── armeabi-v7a/
│       └── AgoraRtcExtension-Config.cmake
├── windows/
│   └── AgoraRtcExtension-Config.cmake
│
├── native/                            ← C++ source code (CMake compiles this)
│   ├── CMakeLists.txt                ← (or compiled directly by xxx-Config.cmake)
│   ├── bindings/
│   │   ├── auto/                     ← SWIG-generated files
│   │   │   ├── jsb_agora_rtc_auto.h
│   │   │   └── jsb_agora_rtc_auto.cpp
│   │   ├── manual/                   ← Hand-written for Pattern A/B/C
│   │   │   └── jsb_agora_rtc_manual.cpp
│   │   └── register.cpp             ← cc_load_plugin entry point
│   └── impl/                         ← Your C++ ↔ Agora SDK glue
│
├── swig-config/
│   ├── agora_rtc.i                   ← SWIG interface definition
│   └── swig-config.js               ← SWIG generation config
│
└── include/                          ← Agora RTC SDK headers (pre-downloaded)
```

### 2.3 `cc_plugin.json` — The Descriptor

```json
{
    "name": "agora-rtc-extension",
    "version": "1.0.0",
    "author": "Agora",
    "description": "Agora RTC native binding for Cocos Creator",
    "engine-version": ">=3.8.0",
    "modules": [
        {
            "target": "AgoraRtcExtension",
            "depends": [
                "agora-rtc-sdk"
            ]
        }
    ],
    "platforms": ["android", "ios", "mac", "windows"]
}
```

**Key**: `modules[].target` = `"AgoraRtcExtension"` → engine searches for `AgoraRtcExtension-Config.cmake`.

### 2.4 Per-Platform CMake Config (e.g. `ios/AgoraRtcExtension-Config.cmake`)

This is the file `find_package()` locates. It defines the library target:

```cmake
# ios/AgoraRtcExtension-Config.cmake

# ---- Define the library target ----
add_library(AgoraRtcExtension STATIC
    ${CMAKE_CURRENT_LIST_DIR}/../native/bindings/auto/jsb_agora_rtc_auto.cpp
    ${CMAKE_CURRENT_LIST_DIR}/../native/bindings/manual/jsb_agora_rtc_manual.cpp
    ${CMAKE_CURRENT_LIST_DIR}/../native/bindings/register.cpp
    ${CMAKE_CURRENT_LIST_DIR}/../native/impl/agora_rtc_engine.cpp
    # ... all your C++ source files
)

# ---- Include paths ----
target_include_directories(AgoraRtcExtension PUBLIC
    ${CMAKE_CURRENT_LIST_DIR}/../include            # Agora SDK headers
    ${COCOS_NATIVE_ROOT}/cocos/bindings/jswrapper   # se:: APIs
    ${COCOS_NATIVE_ROOT}/cocos/bindings/manual
    ${CMAKE_CURRENT_LIST_DIR}/../native/bindings/auto
    ${CMAKE_CURRENT_LIST_DIR}/../native/bindings/manual
)

# ---- Link against Agora SDK + Cocos engine ----
target_link_libraries(AgoraRtcExtension PUBLIC
    agora-rtc-sdk      # Pre-downloaded Agora SDK library
    ${ENGINE_NAME}      # Cocos engine target (always available)
)

# ---- Enable C++17 ----
target_compile_features(AgoraRtcExtension PUBLIC cxx_std_17)
```

### 2.5 Registration Entry Point (`native/bindings/register.cpp`)

The function `cc_load_plugin_<name>()` is auto-called by the engine at startup. Put ALL binding registration here:

```cpp
// native/bindings/register.cpp
#include "bindings/jswrapper/SeApi.h"
#include "bindings/auto/jsb_agora_rtc_auto.h"      // SWIG-generated
#include "bindings/manual/jsb_agora_rtc_manual.h"  // Hand-written

// !! MUST be extern "C", and the name MUST match cc_plugin.json's name !!
extern "C" void cc_load_plugin_agora_rtc_extension() {
    auto* se = se::ScriptEngine::getInstance();

    // Register auto-generated bindings
    se->addRegisterCallback(register_all_agora_rtc);

    // Register hand-written bindings (Pattern A/B/C)
    se->addRegisterCallback(register_agora_rtc_manual);
}
```

### 2.6 Workflow Summary

```
1. Write .i files in swig-config/
2. Run: node <engine>/native/tools/swig-config/genbindings.js -c swig-config.js
   → SWIG generates auto/ directory with se:: binding code
3. Write manual/ .cpp files for %ignore'd functions (Pattern A/B/C)
4. Write register.cpp with cc_load_plugin_xxx()
5. Write per-platform xxx-Config.cmake files
6. Write cc_plugin.json
7. Build native project in Cocos Creator — engine auto-discovers & links everything
```

**You never touch**:
- ❌ `Game.cpp` / `Game.h`
- ❌ `native/engine/common/CMakeLists.txt`
- ❌ `jsb_module_register.cpp`
- ❌ The built project's tsconfig or CMake files

---

## 3. JSB Abstraction Layer (SE API) — For Hand-Written Bindings

Cocos Creator's JSB layer is engine-agnostic — it provides a unified C++ API called **SE** (ScriptEngine) that abstracts V8, JavaScriptCore, SpiderMonkey, and NAPI. The core headers live in:

```
cocos-engine/native/cocos/bindings/jswrapper/
├── SeApi.h          ← Top-level include (auto-selects V8/SM/JSC/NAPI)
├── config.h         ← Script engine type selection
├── Value.h          ← se::Value — C++ ↔ JS value bridge
├── Object.h         ← se::Object — weak-reference to JS object
├── State.h          ← se::State — callback context (args, return, this)
├── HandleObject.h   ← se::HandleObject — RAII for manual object lifetime
└── napi/
    ├── SeApi.h      ← NAPI-specific includes
    ├── HelperMacros.h  ← SE_BIND_* macros
    ├── Class.h      ← se::Class — expose C++ class to JS
    ├── Object.h     ← se::Object implementation
    └── ScriptEngine.h  ← se::ScriptEngine singleton
```

### Core Types

| Type | Purpose |
|---|---|
| `se::ScriptEngine` | Singleton JS engine manager. Init/destroy/GC/module registration. |
| `se::Value` | Represents any JS value (number, string, boolean, object, null, undefined). Union storage — copies primitives; weak-references objects. |
| `se::Object` | Wraps a JS object. Provides `setProperty`, `getProperty`, `defineFunction`, `defineProperty`, `call`, `root`/`unroot`. Ref-counted. |
| `se::Class` | Registers a C++ class into JS (`new Foo()`). Defines member/static functions and properties. |
| `se::State` | The callback context. Gives access to: `args()` (JS arguments), `rval()` (return value), `thisObject()` (se::Object), `nativeThisObject()` (C++ `this` pointer). |
| `se::HandleObject` | RAII wrapper for manually-created se::Object. Auto-roots/unroots/decRefs. Must be stack-allocated. |
| `se::AutoHandleScope` | **Required** before any JS operation (V8 requirement). Declare on the stack before calling JS APIs. |

---

## 4. CMake — Engine Headers You Can Include

When building a native plugin, the Cocos engine exposes its headers via CMake's include path. The key directories are:

### Directly available (engine include root)

```
native/cocos/                       ← #include "cocos/..."
├── base/
│   ├── Scheduler.h                 ← performFunctionInCocosThread()
│   ├── ThreadPool.h                ← LegacyThreadPool (legacy)
│   └── threading/ThreadPool.h      ← New ThreadPool
├── bindings/
│   ├── jswrapper/SeApi.h          ← All se:: types
│   ├── manual/jsb_global.h        ← Global JSB helpers
│   └── manual/jsb_conversions.h   ← se::Value ↔ C++ type conversions
├── application/
│   └── ApplicationManager.h       ← CC_CURRENT_ENGINE(), CC_CURRENT_APPLICATION()
├── engine/
│   ├── Engine.h                   ← getScheduler(), getScriptEngine()
│   └── BaseEngine.h
└── platform/
    └── ...                         ← Platform-specific interfaces
```

### Extension-specific headers

```
native/extensions/
├── ExtensionExport.h               ← CC_EX_DLL macro (DLL export)
└── ExtensionMacros.h               ← NS_CC_EXT_BEGIN / NS_CC_EXT_END
```

### Key engine accessor macros

```cpp
#include "application/ApplicationManager.h"

// Get the engine singleton
CC_CURRENT_ENGINE()              → cc::Engine*

// Get the scheduler (for thread dispatching)
CC_CURRENT_ENGINE()->getScheduler()  → std::shared_ptr<Scheduler>

// Get the script engine
se::ScriptEngine::getInstance()  → se::ScriptEngine*
```

### Typical CMake include paths

The engine root (`native/cocos/`) and its parent are usually in the include path, so you write:

```cpp
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/base/Scheduler.h"
```

---

## 5. Writing a JSB Function Binding

### 5.1 Basic pattern

Every JSB-bound function follows this shape:

```cpp
// ----- your_jsb_binding.cpp -----

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"

// 1. Write the actual callback
static bool YourFunction(se::State& s) {
    // Get JS arguments
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc < 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=1", argc);
        return false;
    }

    // Extract C++ values from se::Value
    int32_t someInt = args[0].toInt32();
    std::string someStr = args[1].toString();

    // Do work...
    int result = doSomething(someInt, someStr);

    // Set return value
    s.rval().setInt32(result);
    return true;
}
// 2. Wrap with macro
SE_BIND_FUNC(YourFunction)
```

### 5.2 Registering a C++ class in JS

```cpp
static se::Class* __jsb_MyClass_class = nullptr;
static se::Object* __jsb_MyClass_proto = nullptr;

// Constructor
static bool js_MyClass_constructor(se::State& s) {
    auto* cobj = new MyClass();
    s.thisObject()->setPrivateData(cobj);  // Links C++ object to se::Object
    return true;
}
SE_BIND_CTOR(js_MyClass_constructor, __jsb_MyClass_class, js_MyClass_finalize)

// Finalizer (called when JS object is GC'd)
static bool js_MyClass_finalize(se::State& s) {
    auto* cobj = (MyClass*)s.nativeThisObject();
    delete cobj;               // "JS controls C++ object" pattern
    return true;
}
SE_BIND_FINALIZE_FUNC(js_MyClass_finalize)

// Member function
static bool js_MyClass_foo(se::State& s) {
    auto* cobj = (MyClass*)s.nativeThisObject();
    cobj->foo();
    return true;
}
SE_BIND_FUNC(js_MyClass_foo)

// Registration
bool register_MyClass(se::Object* global) {
    auto cls = se::Class::create("MyClass", global, nullptr,
        _SE(js_MyClass_constructor));
    cls->defineFunction("foo", _SE(js_MyClass_foo));
    cls->defineFinalizeFunction(_SE(js_MyClass_finalize));
    cls->install();
    __jsb_MyClass_class = cls;
    __jsb_MyClass_proto = cls->getProto();
    return true;
}
```

### 5.3 Available SE_BIND macros

| Macro | Purpose |
|---|---|
| `SE_BIND_FUNC(func)` | Wraps a JS function (global, member, or static) |
| `SE_BIND_CTOR(func, cls, finalizer)` | Wraps a JS constructor |
| `SE_BIND_PROP_GET(func)` | Wraps a JS property getter |
| `SE_BIND_PROP_SET(func)` | Wraps a JS property setter |
| `SE_BIND_FINALIZE_FUNC(func)` | Wraps a JS object GC finalizer |
| `_SE(name)` | Escapes a function name for the JS engine registry (`name##Registry`) |
| `SE_DECLARE_FUNC(func)` | Forward-declares a function registry entry (use in `.h`) |

---

## 6. Calling JS from C++ (Triggering Callbacks to TS)

### 6.1 Storing a JS callback

```cpp
// On the C++ object, store the JS function + target
class MyClass {
    se::Value _jsCallback;
    se::Value _jsTarget;
public:
    void setCallback(const se::Value& cb, const se::Value& target) {
        _jsCallback = cb;
        _jsTarget = target;
    }
};
```

### 6.2 Invoking the JS callback from C++

```cpp
void MyClass::fireCallback(const std::string& data) {
    if (!_jsCallback.isObject() || !_jsCallback.toObject()->isFunction()) {
        return;  // No callback registered
    }

    // MANDATORY: Clear exception + create handle scope before ANY JS operation
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    // Build argument list
    se::ValueArray args;
    args.push_back(se::Value(data));

    // Get the target (JS "this")
    se::Object* target = _jsTarget.isObject() ? _jsTarget.toObject() : nullptr;

    // Call!
    _jsCallback.toObject()->call(args, target);
}
```

### 6.3 Lifecycle: attachObject vs root

**For classes that can be instantiated multiple times** (e.g. IRtcEngine):
```cpp
// Use attachObject — the JS callback lives as long as the C++ object
s.thisObject()->attachObject(jsFunc.toObject());
s.thisObject()->attachObject(jsTarget.toObject());
```

**For singleton classes** (only one instance ever):
```cpp
// Use root — otherwise attachObject prevents GC forever
jsFunc.toObject()->root();
jsTarget.toObject()->root();

// Later, when destroying:
jsFunc.toObject()->unroot();
jsFunc.toObject()->decRef();
```

---

## 7. Thread Safety — CRITICAL for Agora RTC

### 7.1 ⚠️ Agora RTC callbacks come from SUB-THREADS

Most Agora RTC SDK callbacks (e.g. `onJoinChannelSuccess`, `onRemoteVideoStateChanged`, etc.) are fired from **Agora's internal worker threads** — NOT the Cocos main thread. You CANNOT directly call `se::` APIs from those threads.

### 7.2 The solution: `performFunctionInCocosThread`

The engine's Scheduler provides a thread-safe dispatch mechanism:

```cpp
#include "cocos/application/ApplicationManager.h"
#include "cocos/base/Scheduler.h"

// Called on Agora's sub-thread
void MyAgoraObserver::onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
    // Capture values by value (NEVER capture references/pointers that may dangle)
    std::string channelStr(channel ? channel : "");
    uid_t uidCopy = uid;
    int elapsedCopy = elapsed;

    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(
        [=]() {
            // ✅ This runs on the Cocos MAIN thread — safe to call se:: APIs
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(channelStr));
            args.push_back(se::Value((int32_t)uidCopy));
            args.push_back(se::Value(elapsedCopy));

            // Call the JS callback...
            _jsCallback.toObject()->call(args, _jsTarget.toObject());
        }
    );
}
```

### 7.3 Rules summary

```
╔═══════════════════════════════════════════════════════════════╗
║  RULE: EVERY Agora callback MUST dispatch to main thread     ║
║        before touching se:: APIs                             ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ DO:                                                      ║
║     se::ScriptEngine::getInstance()->clearException();       ║
║     se::AutoHandleScope hs;                                  ║
║     (only on main thread)                                    ║
╠═══════════════════════════════════════════════════════════════╣
║  ❌ DON'T:                                                   ║
║     Call se:: APIs directly on Agora sub-threads             ║
║     Call se:: APIs during GC (check isGarbageCollecting())   ║
║     Hold se::Object references without incRef/root           ║
╚═══════════════════════════════════════════════════════════════╝
```

### 7.4 GC safety during cleanup

When a C++ object is destroyed on a sub-thread, do NOT immediately call se:: APIs. Instead, defer cleanup:

```cpp
void cleanupOnMainThread(se::Object* seObj) {
    auto* se = se::ScriptEngine::getInstance();
    if (!se->isValid() || se->isInCleanup()) return;

    if (se->isGarbageCollecting()) {
        // Defer to end of frame
        CleanupTask::pushTaskToAutoReleasePool([seObj]() {
            seObj->clearPrivateData(false);
            seObj->unroot();
            seObj->decRef();
        });
    } else {
        seObj->clearPrivateData(false);
        seObj->unroot();
        seObj->decRef();
    }
}
```

---

## 8. se::Value ↔ C++ Type Conversions

The engine provides conversion helpers in `cocos/bindings/manual/jsb_conversions.h`:

```cpp
#include "cocos/bindings/manual/jsb_conversions.h"

// se::Value → C++
bool seval_to_int32(const se::Value& v, int32_t* ret);
bool seval_to_float(const se::Value& v, float* ret);
bool seval_to_boolean(const se::Value& v, bool* ret);
bool seval_to_std_string(const se::Value& v, std::string* ret);

// Quick path (use on args[] directly):
int32_t val = args[0].toInt32();
std::string str = args[1].toString();
bool b = args[2].toBoolean();
float f = args[3].toFloat();

// C++ → se::Value
se::Value v;
v.setInt32(42);
v.setString("hello");
v.setBoolean(true);
v.setFloat(3.14f);
v.setObject(seObj);        // For se::Object*
v.setNull();
v.setUndefined();

// Return value:
s.rval().setInt32(0);      // s is se::State&
```

---

## 9. Returning to TS — Pattern Mapping

This project has defined TS↔C++ translation rules in `CXX-TS-TRANSLATION-SPECIAL.md`. When implementing JSB:

| TS Pattern | C++ JSB Implementation |
|---|---|
| **Normal**: `func(x: number): Promise<number>` | Standard: extract args → call C++ → `s.rval().setInt32(result)` |
| **Pattern A (out-param)**: `func(): Promise<{ errorCode, data }>` | Create `se::Object`, set `errorCode` and `data` properties, return as `s.rval().setObject(obj)` |
| **Pattern B (in/out)**: `func(size: number): Promise<{ errorCode, data, size }>` | Extract `size` as in-param, after C++ call, return both `data` and updated `size` in result object |
| **Pattern C (callback)**: `initialize(context: RtcEngineContext)` | Unwrap `context.eventHandler` from JS, create C++ bridge that calls back to TS via `se::Object::call()` |

### Example: Pattern A return value construction

```cpp
static bool js_func_with_outparam(se::State& s) {
    // Call C++ native function
    SomeData data;
    int errorCode = nativeFunc(&data);

    // Build return object { errorCode, data }
    se::HandleObject result(se::Object::createPlainObject());
    result->setProperty("errorCode", se::Value(errorCode));

    // Convert C++ struct → JS object
    se::HandleObject dataObj(se::Object::createPlainObject());
    dataObj->setProperty("field1", se::Value(data.field1));
    dataObj->setProperty("field2", se::Value(data.field2));
    result->setProperty("data", se::Value(dataObj));

    s.rval().setObject(result);
    return true;
}
SE_BIND_FUNC(js_func_with_outparam)
```

---

## 10. Quick Reference

### TS-side type for native object

```ts
// From cocos-engine/@types/jsb.d.ts and cocos/native-binding/index.ts
import { native } from 'cc';  // Access native bridge APIs
```

### Key JS functions available on native

- `native.reflection.callStaticMethod(className, methodName, ...args)` — call Java/ObjC methods
- `native.garbageCollect()` — trigger ScriptEngine GC
- `native.fileUtils` — file system operations

### Error codes

Use `ERROR_CODE_TYPE::ERR_NOT_SUPPORTED` (-4) for stub/unimplemented functions (see `JSB-SKIP-LIST.md`).

### Further reading

- Engine JSB docs: `cocos-engine/native/cocos/bindings/docs/JSB2.0-learning-zh.md`
- Extension examples: `cocos-engine/native/extensions/`
- SWIG auto-generation: `cocos-engine/native/tools/swig-config/`
