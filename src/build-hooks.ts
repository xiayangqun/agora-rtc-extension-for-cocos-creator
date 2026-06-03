import { execFileSync } from "child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, join, resolve } from "path";
import { BuildHook, IBuildResult, IBuildTaskOption } from "../@types";

const PACKAGE_NAME = "agora-rtc-extension-for-cocos-creator";

type AgoraBuildOptions = {
    writeCameraPermission?: boolean | string;
    writeMicrophonePermission?: boolean | string;
    writeAgoraDefaultPermissions?: boolean | string;
};

type AgoraBuildTaskOption = IBuildTaskOption & {
    packages?: Record<string, AgoraBuildOptions>;
};

export const throwError: BuildHook.throwError = true;
export const title: BuildHook.title = "i18n:agora-rtc-extension-for-cocos-creator.build_hook_title";

function log(...args: any[]) {
    console.log(`[${PACKAGE_NAME}]`, ...args);
}

function readBool(value: boolean | string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    if (typeof value === "boolean") return value;
    return value !== "false";
}

function getPackageOptions(options: AgoraBuildTaskOption): Required<AgoraBuildOptions> {
    const raw = options.packages?.[PACKAGE_NAME] || {};
    return {
        writeCameraPermission: readBool(raw.writeCameraPermission, true),
        writeMicrophonePermission: readBool(raw.writeMicrophonePermission, true),
        writeAgoraDefaultPermissions: readBool(raw.writeAgoraDefaultPermissions, true),
    };
}

function setPlistValue(plistPath: string, key: string, type: "string" | "bool", value: string) {
    try {
        execFileSync("/usr/libexec/PlistBuddy", ["-c", `Set :${key} ${value}`, plistPath], { stdio: "ignore" });
    } catch {
        execFileSync("/usr/libexec/PlistBuddy", ["-c", `Add :${key} ${type} ${value}`, plistPath], {
            stdio: "ignore",
        });
    }
}

function collectFiles(root: string, predicate: (path: string) => boolean): string[] {
    if (!root || !existsSync(root)) return [];
    const result: string[] = [];
    const stack = [root];
    while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;
        const stat = statSync(current);
        if (stat.isDirectory()) {
            for (const entry of readdirSync(current)) {
                stack.push(join(current, entry));
            }
            continue;
        }
        if (stat.isFile() && predicate(current)) {
            result.push(current);
        }
    }
    return result;
}

function uniqueExisting(paths: string[]): string[] {
    return Array.from(new Set(paths.filter((item) => item && existsSync(item)).map((item) => resolve(item))));
}

function getBuildRoots(options: AgoraBuildTaskOption, result?: IBuildResult, makeRoot?: string): string[] {
    const projectPath = (Editor as any).Project?.path || "";
    return uniqueExisting([
        makeRoot || "",
        result?.dest || "",
        result?.paths?.dir || "",
        projectPath && options.platform ? join(projectPath, "native", "engine", options.platform) : "",
        projectPath && options.outputName ? join(projectPath, "build", options.outputName) : "",
        projectPath && options.platform ? join(projectPath, "build", options.platform) : "",
    ]);
}

function collectCodeSignEntitlements(roots: string[]): string[] {
    const pbxprojPaths = roots.flatMap((root) => collectFiles(root, (file) => file.endsWith("project.pbxproj")));
    const result: string[] = [];
    for (const pbxprojPath of pbxprojPaths) {
        const content = readFileSync(pbxprojPath, "utf-8");
        const matches = content.matchAll(/CODE_SIGN_ENTITLEMENTS = "?([^";]+)"?;/g);
        for (const match of matches) {
            result.push(match[1]);
        }
    }
    return uniqueExisting(result);
}

function applyApplePermissions(options: AgoraBuildTaskOption, result?: IBuildResult, makeRoot?: string) {
    if (options.platform !== "mac" && options.platform !== "ios") return;

    const pkgOptions = getPackageOptions(options);
    const shouldWriteEntitlements = options.platform === "mac";
    const roots = getBuildRoots(options, result, makeRoot);
    const infoPlists = uniqueExisting(
        roots.flatMap((root) => collectFiles(root, (file) => file.endsWith("Info.plist"))),
    );
    const entitlementPlists = shouldWriteEntitlements
        ? uniqueExisting([
              ...collectCodeSignEntitlements(roots),
              ...roots.flatMap((root) =>
                  collectFiles(root, (file) => {
                      const fileName = basename(file).toLowerCase();
                      return (
                          file.endsWith(".entitlements") ||
                          fileName === "entitlements.plist" ||
                          (file.endsWith("Entitlements.plist") && !file.includes("/CompilerId"))
                      );
                  }),
              ),
          ])
        : [];

    for (const plistPath of infoPlists) {
        if (pkgOptions.writeCameraPermission) {
            setPlistValue(
                plistPath,
                "NSCameraUsageDescription",
                "string",
                "Agora RTC needs camera access for video calls.",
            );
        }
        if (pkgOptions.writeMicrophonePermission) {
            setPlistValue(
                plistPath,
                "NSMicrophoneUsageDescription",
                "string",
                "Agora RTC needs microphone access for audio calls.",
            );
        }
    }

    if (shouldWriteEntitlements) {
        for (const plistPath of entitlementPlists) {
            if (pkgOptions.writeCameraPermission) {
                setPlistValue(plistPath, "com.apple.security.device.camera", "bool", "true");
            }
            if (pkgOptions.writeMicrophonePermission) {
                setPlistValue(plistPath, "com.apple.security.device.audio-input", "bool", "true");
            }
            if (pkgOptions.writeAgoraDefaultPermissions) {
                setPlistValue(plistPath, "com.apple.security.network.client", "bool", "true");
            }
        }
    }

    log(
        `${options.platform} permissions applied. Info.plist: ${infoPlists.length}, entitlements: ${entitlementPlists.length}`,
    );
}

export const onAfterBuild: BuildHook.onAfterBuild = async function (
    options: AgoraBuildTaskOption,
    result: IBuildResult,
) {
    applyApplePermissions(options, result);
};

export const onBeforeMake: BuildHook.onBeforeMake = async function (root: string, options: AgoraBuildTaskOption) {
    applyApplePermissions(options, undefined, root);
};

export const onAfterMake: BuildHook.onAfterMake = async function (root: string, options: AgoraBuildTaskOption) {
    applyApplePermissions(options, undefined, root);
};
