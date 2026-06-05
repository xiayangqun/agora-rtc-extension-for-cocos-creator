# External References

## JSB + SWIG Binding
- **Docs**: https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/jsb-swig.html
- **Key points**:
  - **JSB (JavaScript Binding)**: Generates glue code that enables JavaScript to interact with the Cocos engine's C++ layer.
  - **SWIG**: Replaced the old `bindings-generator` starting from Cocos Creator 3.7.0. Generates binding code by parsing C++ Interface Definition Language (IDL).
  - `.i` files are SWIG interface definition files that describe which C++ module interfaces to bind.
  - Developer projects need manual configuration: create a binding code directory → write a `swig-config.js` config file → generate code via the `genbindings.js` script.
  - Reference the engine's template `swig-interface-template.i` and examples (e.g. `scene.i`).

## Native Plugin Development
- **Docs**: https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/native-plugins/brief.html
- **Key points**:
  - Native plugins extend JS-to-C++ calling ability through script binding interfaces (e.g. sebind).
  - The plugin root directory must contain a `cc_plugin.json` descriptor file.
  - Each supported native platform (android/ios/mac/windows) has a corresponding subdirectory containing at least one CMake config file (`<PackageName>-Config.cmake`).
  - `cc_plugin.json` key fields: `name`, `version`, `engine-version` (engine version range), `modules` (libraries and dependencies), `platforms` (supported platforms).
  - **Environment requirements**: Node.js 8.0+, CMake 3.12+ (Android recommends 3.18.1+).
  - **Version requirement**: Cocos Creator 3.6.3 or above.

## Cocos Engine Source

> ❓ **Where is your Cocos Engine source?**

The JSB guides reference headers, CMake templates, and SWIG tooling from the `cocos-engine` repository. The engine source is **not** included in this plugin — it must be available alongside or separately on your machine.

**If you already have it cloned**, provide the absolute path (e.g. `/Users/me/cocos-engine` or `D:\cocos-engine`).

**If you don't have it yet**, the AI can clone it for you:
- **Repo**: `https://github.com/cocos/cocos-engine`
- **Tag to checkout**: `v3.8.0` (default — matches the plugin's `"editor": ">=3.8.0"` in `package.json`)

> ⚠️ **Which tag/version should be used?** Please confirm the exact Cocos Creator version you are targeting (e.g. `v3.8.0`, `v3.8.3`, `v3.8.6`). The AI will check out the corresponding engine tag to ensure binding headers match your runtime.

Paths below are **relative to the engine root**:

- **JSB binding layer**: `native/cocos/bindings/`
- **JSB documentation**: `native/cocos/bindings/docs/JSB2.0-learning-zh.md`
- **SWIG config templates**: `native/tools/swig-config/`
- **SWIG tutorial**: `native/tools/swig-config/tutorial/index.md`
- **CMake templates**: `templates/cmake/`
- **`@types/jsb.d.ts`** (TS-side JSB types): `@types/jsb.d.ts`
- **Native binding TS module**: `cocos/native-binding/index.ts`
