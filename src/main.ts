import { existsSync, rmSync } from "fs";
import { join, dirname, resolve } from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
import nativeBindingUtils = require("../scripts/native-binding-utils");

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any[]) => any } = {
    openPanel() {
        Editor.Panel.open("agora-rtc-extension-for-cocos-creator.agora-panel");
    },

    async "query-cocos-engine-root"() {
        const projectPath = (Editor as any).Project.path;
        return {
            engineRoot: nativeBindingUtils.readEngineRootFromCcDts(projectPath),
        };
    },

    async "query-sdk-status"() {
        const pluginDir = dirname(__dirname);
        const platforms = ["mac", "ios", "android", "windows"];
        const result: Record<string, { exists: boolean }> = {};
        for (const p of platforms) {
            const libsDir = join(pluginDir, p, "libs");
            result[p] = { exists: existsSync(libsDir) };
        }
        return result;
    },

    async "download-sdk"(platform: string) {
        const pluginDir = dirname(__dirname);
        const scriptPath = resolve(pluginDir, "scripts", "predownload.js");
        try {
            const { stdout, stderr } = await execFileAsync("node", [scriptPath, "--platform", platform], {
                cwd: pluginDir,
                timeout: 300000,
                maxBuffer: 1024 * 1024 * 4,
            });
            return { success: true, stdout, stderr };
        } catch (err: any) {
            return {
                success: false,
                stdout: err.stdout || "",
                stderr: err.stderr || "",
                error: err.message || String(err),
            };
        }
    },

    async "delete-all-sdks"() {
        const pluginDir = dirname(__dirname);
        const platforms = ["mac", "ios", "android", "windows"];
        // 直接删除平台 libs/ 和 include/ 目录，不通过子进程
        for (const p of platforms) {
            const libsDir = join(pluginDir, p, "libs");
            const includeDir = join(pluginDir, p, "include");
            try {
                if (existsSync(libsDir)) rmSync(libsDir, { recursive: true, force: true });
            } catch (_) {
                /* 忽略单平台清理失败，继续清理其他 */
            }
            try {
                if (existsSync(includeDir)) rmSync(includeDir, { recursive: true, force: true });
            } catch (_) {
                /* 忽略 */
            }
        }
        return { success: true };
    },

    async "generate-native-bindings"(engineRoot: string) {
        const pluginDir = dirname(__dirname);
        const scriptPath = resolve(pluginDir, "scripts", "genbindings.js");
        try {
            const { stdout, stderr } = await execFileAsync("node", [scriptPath, engineRoot], {
                cwd: pluginDir,
                timeout: 120000,
                maxBuffer: 1024 * 1024 * 4,
            });
            return { success: true, stdout, stderr };
        } catch (err: any) {
            return {
                success: false,
                stdout: err.stdout || "",
                stderr: err.stderr || "",
                error: err.message || String(err),
            };
        }
    },
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() {}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() {}
