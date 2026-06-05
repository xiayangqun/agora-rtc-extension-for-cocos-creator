import { execFileSync } from "child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import { basename, dirname, join, resolve } from "path";
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

function isAndroidLikePlatform(platform?: string): boolean {
    return platform === "android" || platform === "google-play";
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

function uniquePaths(paths: string[]): string[] {
    return Array.from(new Set(paths.filter((item) => !!item).map((item) => resolve(item))));
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

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ensureAndroidManifestPermission(manifestPath: string, permission: string, attrs: Record<string, string> = {}) {
    let content = readFileSync(manifestPath, "utf-8");
    if (!content.includes("xmlns:android=")) {
        content = content.replace("<manifest", '<manifest xmlns:android="http://schemas.android.com/apk/res/android"');
    }

    const attrText = Object.entries(attrs)
        .map(([key, value]) => ` android:${key}="${value}"`)
        .join("");
    const permissionLine = `    <uses-permission android:name="${permission}"${attrText} />\n`;
    const permissionPattern = new RegExp(
        `\\s*<uses-permission\\s+[^>]*android:name=["']${escapeRegExp(permission)}["'][^>]*/>\\s*`,
    );

    if (permissionPattern.test(content)) {
        content = content.replace(permissionPattern, `\n${permissionLine}`);
        writeFileSync(manifestPath, content);
        return;
    }

    if (content.includes("</manifest>")) {
        content = content.replace("</manifest>", `${permissionLine}</manifest>`);
    } else {
        content += `\n${permissionLine}`;
    }
    writeFileSync(manifestPath, content);
}

function ensureJavaImport(content: string, importName: string): string {
    const importLine = `import ${importName};`;
    if (content.includes(importLine)) return content;
    const packageMatch = content.match(/^package\s+[^;]+;\s*/m);
    if (packageMatch) {
        return content.replace(packageMatch[0], `${packageMatch[0]}\n${importLine}\n`);
    }
    return `${importLine}\n${content}`;
}

function ensureAndroidActivityRuntimePermissions(activityPath: string, permissions: string[]) {
    if (permissions.length === 0) return;

    let content = readFileSync(activityPath, "utf-8");
    if (!content.includes("extends CocosActivity") && !content.includes("extends Activity")) return;

    content = ensureJavaImport(content, "android.Manifest");
    content = ensureJavaImport(content, "android.content.pm.PackageManager");
    content = ensureJavaImport(content, "android.os.Build");
    content = ensureJavaImport(content, "java.util.ArrayList");

    if (!content.includes("REQUEST_AGORA_RUNTIME_PERMISSIONS")) {
        content = content.replace(
            /public\s+class\s+([A-Za-z0-9_]+)\s+extends\s+([^{]+)\{/,
            "public class $1 extends $2{\n    private static final int REQUEST_AGORA_RUNTIME_PERMISSIONS = 1001;\n",
        );
    }

    if (!content.includes("requestAgoraRuntimePermissions();")) {
        content = content.replace(
            /SDKWrapper\.shared\(\)\.init\(this\);\s*/,
            "SDKWrapper.shared().init(this);\n        requestAgoraRuntimePermissions();\n",
        );
    }

    if (!content.includes("private void requestAgoraRuntimePermissions()")) {
        const permissionChecks = permissions
            .map(
                (
                    permission,
                ) => `        if (checkSelfPermission(Manifest.permission.${permission}) != PackageManager.PERMISSION_GRANTED) {
            permissions.add(Manifest.permission.${permission});
        }`,
            )
            .join("\n");
        const method = `
    private void requestAgoraRuntimePermissions() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }

        ArrayList<String> permissions = new ArrayList<>();
${permissionChecks}

        if (!permissions.isEmpty()) {
            requestPermissions(permissions.toArray(new String[0]), REQUEST_AGORA_RUNTIME_PERMISSIONS);
        }
    }

`;
        content = content.replace(
            /\n\s*@Override\s+protected void onResume\(/,
            `${method}    @Override\n    protected void onResume(`,
        );
    }

    writeFileSync(activityPath, content);
}

function collectAndroidModuleRoots(roots: string[], pluginName: string): string[] {
    const candidates = roots.flatMap((root) => [
        root,
        join(root, "app"),
        join(root, "proj", "app"),
        join(root, "libservice"),
        join(root, "proj", "libservice"),
        join(root, "build", "android", "proj", "app"),
        join(root, "build", "android", "proj", "libservice"),
    ]);

    return uniqueExisting(
        candidates.filter((candidate) => {
            const buildGradle = join(candidate, "build.gradle");
            return (
                existsSync(buildGradle) &&
                existsSync(join(candidate, "src")) &&
                readFileSync(buildGradle, "utf-8").includes(pluginName)
            );
        }),
    );
}

function copyFileToDir(src: string, destDir: string) {
    mkdirSync(destDir, { recursive: true });
    copyFileSync(src, join(destDir, basename(src)));
}

function copyAndroidSdkLibraries(libraryModuleRoots: string[], applicationModuleRoots: string[]) {
    const pluginDir = dirname(__dirname);
    const sdkLibsDir = join(pluginDir, "android", "libs");
    if (!existsSync(sdkLibsDir)) return;

    const abiDirs = readdirSync(sdkLibsDir)
        .map((entry) => join(sdkLibsDir, entry))
        .filter((entry) => statSync(entry).isDirectory());
    const javaArchives = readdirSync(sdkLibsDir)
        .filter((entry) => entry.endsWith(".jar") || entry.endsWith(".aar"))
        .map((entry) => join(sdkLibsDir, entry));
    const jarArchives = javaArchives.filter((archive) => archive.endsWith(".jar"));
    const aarArchives = javaArchives.filter((archive) => archive.endsWith(".aar"));

    const ensureAndroidJavaArchiveDependency = (moduleRoot: string) => {
        const buildGradlePath = join(moduleRoot, "build.gradle");
        if (!existsSync(buildGradlePath)) return;

        const dependencyLine = "    implementation fileTree(dir: 'agora-libs', include: ['*.jar','*.aar'])";
        let content = readFileSync(buildGradlePath, "utf-8");
        if (content.includes("fileTree(dir: 'agora-libs'")) return;

        if (/dependencies\s*\{/.test(content)) {
            content = content.replace(/dependencies\s*\{\s*/, (match) => `${match}${dependencyLine}\n`);
        } else {
            content += `\n\ndependencies {\n${dependencyLine}\n}\n`;
        }
        writeFileSync(buildGradlePath, content);
    };

    const cleanupStaleAgoraCopies = (moduleRoot: string) => {
        const appLibsDir = join(moduleRoot, "libs");
        for (const archive of javaArchives) {
            const staleArchive = join(appLibsDir, basename(archive));
            if (existsSync(staleArchive)) {
                rmSync(staleArchive, { force: true });
            }
        }
    };

    const copyLibraries = (moduleRoot: string, archives: string[]) => {
        ensureAndroidJavaArchiveDependency(moduleRoot);
        cleanupStaleAgoraCopies(moduleRoot);

        const appLibsDir = join(moduleRoot, "libs");
        const javaLibsDir = join(moduleRoot, "agora-libs");

        for (const archive of archives) {
            copyFileToDir(archive, javaLibsDir);
        }

        for (const abiDir of abiDirs) {
            const abi = basename(abiDir);
            const destAbiDir = join(appLibsDir, abi);
            for (const file of readdirSync(abiDir)) {
                if (file.endsWith(".so")) {
                    copyFileToDir(join(abiDir, file), destAbiDir);
                }
            }
        }
    };

    for (const moduleRoot of libraryModuleRoots) {
        copyLibraries(moduleRoot, jarArchives);
    }
    for (const moduleRoot of applicationModuleRoots) {
        copyLibraries(moduleRoot, aarArchives);
    }
}

function applyAndroidPermissions(options: AgoraBuildTaskOption, result?: IBuildResult, makeRoot?: string) {
    if (!isAndroidLikePlatform(options.platform)) return;

    const pkgOptions = getPackageOptions(options);
    const roots = getBuildRoots(options, result, makeRoot);
    const manifests = uniqueExisting(
        roots.flatMap((root) => collectFiles(root, (file) => file.endsWith("AndroidManifest.xml"))),
    );

    for (const manifestPath of manifests) {
        if (pkgOptions.writeCameraPermission) {
            ensureAndroidManifestPermission(manifestPath, "android.permission.CAMERA");
        }
        if (pkgOptions.writeMicrophonePermission) {
            ensureAndroidManifestPermission(manifestPath, "android.permission.RECORD_AUDIO");
        }
        if (pkgOptions.writeAgoraDefaultPermissions) {
            ensureAndroidManifestPermission(manifestPath, "android.permission.INTERNET");
            ensureAndroidManifestPermission(manifestPath, "android.permission.ACCESS_NETWORK_STATE");
            ensureAndroidManifestPermission(manifestPath, "android.permission.ACCESS_WIFI_STATE");
            ensureAndroidManifestPermission(manifestPath, "android.permission.MODIFY_AUDIO_SETTINGS");
            ensureAndroidManifestPermission(manifestPath, "android.permission.BLUETOOTH");
            ensureAndroidManifestPermission(manifestPath, "android.permission.BLUETOOTH_CONNECT");
            ensureAndroidManifestPermission(manifestPath, "android.permission.READ_PHONE_STATE");
            ensureAndroidManifestPermission(manifestPath, "android.permission.BLUETOOTH_SCAN");
            ensureAndroidManifestPermission(manifestPath, "android.permission.READ_EXTERNAL_STORAGE", {
                maxSdkVersion: "32",
            });
            ensureAndroidManifestPermission(manifestPath, "android.permission.WRITE_EXTERNAL_STORAGE", {
                maxSdkVersion: "28",
            });
            ensureAndroidManifestPermission(manifestPath, "android.permission.READ_MEDIA_IMAGES");
            ensureAndroidManifestPermission(manifestPath, "android.permission.READ_MEDIA_VIDEO");
            ensureAndroidManifestPermission(manifestPath, "android.permission.READ_MEDIA_AUDIO");
        }
    }

    const runtimePermissions: string[] = [];
    if (pkgOptions.writeCameraPermission) runtimePermissions.push("CAMERA");
    if (pkgOptions.writeMicrophonePermission) runtimePermissions.push("RECORD_AUDIO");
    const activities = uniqueExisting(
        roots.flatMap((root) => collectFiles(root, (file) => file.endsWith("Activity.java") && file.includes("/src/"))),
    );
    for (const activityPath of activities) {
        ensureAndroidActivityRuntimePermissions(activityPath, runtimePermissions);
    }

    log(`android permissions applied. AndroidManifest.xml: ${manifests.length}, Activity.java: ${activities.length}`);
}

function applyAndroidDependencies(options: AgoraBuildTaskOption, result?: IBuildResult, makeRoot?: string) {
    if (!isAndroidLikePlatform(options.platform)) return;

    const projectPath = (Editor as any).Project?.path || "";
    const roots = uniquePaths([
        ...getBuildRoots(options, result, makeRoot),
        projectPath && join(projectPath, "build", "android"),
        projectPath && join(projectPath, "build", "android", "proj"),
    ]);
    const libraryModuleRoots = collectAndroidModuleRoots(roots, "com.android.library");
    const applicationModuleRoots = collectAndroidModuleRoots(roots, "com.android.application");
    copyAndroidSdkLibraries(libraryModuleRoots, applicationModuleRoots);

    log(
        `android sdk libraries copied. library modules: ${libraryModuleRoots.length}, application modules: ${applicationModuleRoots.length}`,
    );
}

export const onAfterBuild: BuildHook.onAfterBuild = async function (
    options: AgoraBuildTaskOption,
    result: IBuildResult,
) {
    applyApplePermissions(options, result);
    applyAndroidPermissions(options, result);
    applyAndroidDependencies(options, result);
};

export const onBeforeMake: BuildHook.onBeforeMake = async function (root: string, options: AgoraBuildTaskOption) {
    applyApplePermissions(options, undefined, root);
    applyAndroidPermissions(options, undefined, root);
    applyAndroidDependencies(options, undefined, root);
};

export const onAfterMake: BuildHook.onAfterMake = async function (root: string, options: AgoraBuildTaskOption) {
    applyApplePermissions(options, undefined, root);
    applyAndroidPermissions(options, undefined, root);
    applyAndroidDependencies(options, undefined, root);
};
