# Agora SDK 导出验证项目

## 目的

本项目用于验证 `agora-rtc-sdk-ng` npm 包的实际运行时导出，与它的 `.d.ts` 类型声明进行对比，以发现 SDK 构建流程中的导出缺失问题。

## 背景

在将 Cocos Creator 扩展的 `assets/` 代码从 `"agora-rtc-sdk-ng"` 迁移到本地模块 `.agora-rtc-sdk-ng` 时，发现以下严重问题：

- `agora-rtc-sdk-ng` 的 `.d.ts` 类型声明声称导出了 `AgoraRTCErrorCode`、`VideoState` 等 enum
- 但实际运行时（无论是 UMD 主包还是 `/esm` 子路径），这些 enum 都是 `undefined`
- 这是 SDK 构建流程的缺陷，而非配置问题

## 目录结构

| 文件/目录                        | 说明                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| `package.json`                   | 依赖 `agora-rtc-sdk-ng@4.24.3` 和测试工具                      |
| `node_modules/agora-rtc-sdk-ng/` | npm 包本体（UMD + ESM 构建 + .d.ts）                           |
| `index.html`                     | Vite 入口页面                                                  |
| `main.ts`                        | 测试脚本：分别导入主包和 `/esm`，检测所有 enum 和 API 的存在性 |
| `run-browser-test.js`            | Puppeteer 自动化脚本，在 headless 浏览器中运行测试并输出结果   |

## 运行测试

```bash
# 1. 启动 Vite 开发服务器
npx vite --port 5173

# 2. 在另一个终端运行自动化测试
node run-browser-test.js
```

## 关键发现（2026-05-16）

### 两个构建都缺失的 enum（2 个）

| enum                | 主包 UMD | ESM 构建 | 结论         |
| ------------------- | -------- | -------- | ------------ |
| `AgoraRTCErrorCode` | ❌       | ❌       | **完全缺失** |
| `VideoState`        | ❌       | ❌       | **完全缺失** |

### 两个构建都存在的 enum（8 个）

`AREAS`、`AudienceLatencyLevelType`、`ChannelMediaRelayError`、`ChannelMediaRelayEvent`、`ChannelMediaRelayState`、`ConnectionDisconnectedReason`、`RemoteStreamFallbackType`、`RemoteStreamType`

### 模块差异

- **UMD 主包**：有 `default` 导出（即 `AgoraRTC` 对象），enum 挂载在 `default` 上
- **ESM 构建**：**无 `default` 导出**，enum 作为命名导出直接暴露，且多出 `onCameraChanged`、`onMicrophoneChanged` 等 API

## 对项目的指导

由于 Cocos Creator 使用 UMD 插件脚本加载 `AgoraRTC_N-production.js`（挂载到 `globalThis.AgoraRTC`），`rtc-sdk_cn.ts` 需要从全局对象获取运行时值。

对于 UMD 上缺失的 `AgoraRTCErrorCode` 和 `VideoState`，必须在 `rtc-sdk_cn.ts` 中**手动构造整个对象**，以匹配 `.d.ts` 的类型声明。
