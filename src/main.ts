import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function getPluginPackageJson(): any {
    const pluginDir = dirname(__dirname);
    const pkgPath = join(pluginDir, "package.json");
    return JSON.parse(readFileSync(pkgPath, "utf-8"));
}

function getRequiredSdkVersion(): string {
    const pkg = getPluginPackageJson();
    const dep = pkg.dependencies?.["agora-rtc-sdk-ng"];
    if (!dep) return "4.24.3";
    // 去掉 ^ 或 ~ 前缀，取纯版本号
    return dep.replace(/^[\^~]/, "");
}

function getProjectPackageJsonPath(): string {
    const projectPath = (Editor as any).Project.path;
    return join(projectPath, "package.json");
}

function readProjectPackageJson(): any | null {
    const path = getProjectPackageJsonPath();
    if (!existsSync(path)) return null;
    try {
        return JSON.parse(readFileSync(path, "utf-8"));
    } catch {
        return null;
    }
}

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any[]) => any } = {
    openPanel() {
        Editor.Panel.open("agora-rtc-extension-for-cocos-creator.agora-panel");
    },

    async "check-dependency"() {
        const requiredVersion = getRequiredSdkVersion();
        const projectPkg = readProjectPackageJson();
        if (!projectPkg) {
            return { hasDependency: false, requiredVersion };
        }
        const installedVersion =
            projectPkg.dependencies?.["agora-rtc-sdk-ng"] || projectPkg.devDependencies?.["agora-rtc-sdk-ng"] || null;
        return {
            hasDependency: !!installedVersion,
            version: installedVersion ? installedVersion.replace(/^[\^~]/, "") : null,
            requiredVersion,
        };
    },

    async "install-dependency"() {
        const requiredVersion = getRequiredSdkVersion();
        const projectPath = (Editor as any).Project.path;
        try {
            const { stdout, stderr } = await execAsync(`npm install agora-rtc-sdk-ng@${requiredVersion}`, {
                cwd: projectPath,
                timeout: 120000,
            });
            return { success: true, stdout, stderr };
        } catch (err: any) {
            return { success: false, error: err.message || String(err) };
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
