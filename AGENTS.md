# Project Context

## Project Overview

This is a **Cocos Creator Native Plugin** project: `agora-rtc-extension-for-cocos-creator`.
The plugin provides **Agora RTC** (audio/video communication) capabilities for Cocos Creator (>= 3.8.0).

## Key Info

- **Language**: TypeScript
- **Platform**: Cocos Creator Editor Extension (package_version 2)
- **Entry**: `dist/main.js` (compiled from TypeScript)
- **Build**: `npm run build` (i.e. `tsc -b`) / `tsc -w` for watch mode during development

## Project Structure

- `src/` - TypeScript source
- `dist/` - Compiled output (main.js is the entry)
- `@types/` - Type definitions
- `i18n/` - Internationalization files
- `package.json` - Plugin manifest

## JSB Rules

**⚠️ When doing any JSB binding work, you MUST first read ALL files in the `jsb-rules/` directory.**
