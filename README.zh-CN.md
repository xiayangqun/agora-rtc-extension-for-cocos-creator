# 项目简介

一份空白的扩展。

## 开发环境

Node.js

## 安装

```bash
# 安装依赖模块
npm install
# 构建
npm run build
```

## 预下载 Agora SDK

脚本会从 `package.json` 的 `agora` 字段读取四个平台（mac/ios/android/windows）的 SDK 下载链接，下载到 `temp/` 目录并解压，然后将动态库和头文件拷贝到各平台对应的目录下。

```bash
# 下载并解压 SDK（已存在的 zip 会跳过下载）
npm run predownload

# 清空 temp 目录下所有 Agora SDK 相关文件，然后重新下载
npm run predownload --clear
```

各平台文件会被拷贝到以下位置：

| 平台 | 动态库 | 头文件 |
|------|--------|--------|
| Android | `android/libs/<abi>/` (.so) | `android/include/` |
| iOS | `ios/libs/` (.xcframework) | `ios/include/` |
| Mac | `mac/libs/` (.xcframework) | `mac/include/` |
| Windows | `windows/libs/<arch>/` (.dll) | `windows/include/` |
