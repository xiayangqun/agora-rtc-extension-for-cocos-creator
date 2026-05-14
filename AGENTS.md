# 项目上下文

## 沟通规范
- **所有对话请使用中文进行。**

## 项目概述
这是一个 **Cocos Creator 原生插件**项目：`agora-rtc-extension-for-cocos-creator`。
插件为 Cocos Creator（>= 3.8.0）提供 Agora RTC（音频/视频通信）能力。

## 关键信息
- **语言**：TypeScript
- **平台**：Cocos Creator Editor Extension（package_version 2）
- **入口**：`dist/main.js`（由 TypeScript 编译生成）
- **构建**：`npm run build`（即 `tsc -b`）/ 开发时用 `tsc -w` 监听模式

## 项目结构
- `src/` - TypeScript 源码
- `dist/` - 编译输出（main.js 为入口文件）
- `@types/` - 类型定义
- `i18n/` - 国际化文件
- `package.json` - 插件清单

## 重要参考文档

### 1. JSB + SWIG 绑定
- **文档**：https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/jsb-swig.html
- **核心要点**：
  - **JSB（JavaScript Binding）**：生成"胶水代码"，使 JavaScript 能与 Cocos 引擎 C++ 底层交互。
  - **SWIG**：从 Cocos Creator 3.7.0 起替代旧的 `bindings-generator`，通过解析 C++ 接口定义语言（IDL）生成绑定代码。
  - `.i` 文件是 SWIG 的接口定义文件，描述需要绑定的 C++ 模块接口。
  - 开发者项目需手动配置：创建绑定代码目录 → 编写 `swig-config.js` 配置文件 → 通过 `genbindings.js` 脚本生成代码。
  - 参考引擎目录下的模板 `swig-interface-template.i` 和示例（如 `scene.i`）。

### 2. 原生插件开发
- **文档**：https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/native-plugins/brief.html
- **核心要点**：
  - 原生插件通过脚本绑定接口（如 sebind）扩展 JS 调用 C++ 的能力。
  - 插件根目录必须包含 `cc_plugin.json` 描述文件。
  - 每个支持的原生平台（android/ios/mac/windows）对应一个子目录，至少包含一个 CMake 配置文件（`<PackageName>-Config.cmake`）。
  - `cc_plugin.json` 关键字段：`name`、`version`、`engine-version`（引擎版本区间）、`modules`（库及依赖）、`platforms`（支持的平台）。
  - **环境依赖**：Node.js 8.0+、CMake 3.12+（Android 建议 3.18.1+）。
  - **版本要求**：Cocos Creator 3.6.3 及以上。
