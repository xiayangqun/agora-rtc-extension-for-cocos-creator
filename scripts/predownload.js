const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TEMP_DIR = path.join(ROOT, 'temp');
const PKG = require(path.join(ROOT, 'package.json'));

// ─── 工具函数 ───────────────────────────────────────────────

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyFileSync(src, dest) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
    ensureDir(dest);
    // 使用 cp -R 以正确处理符号链接（macOS .framework 内含 symlink）
    execSync(`cp -R "${src}" "${dest}"`);
}

function findFilesRecursive(dir, ext) {
    if (!fs.existsSync(dir)) return [];
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findFilesRecursive(fullPath, ext));
        } else if (!ext || entry.name.endsWith(ext)) {
            results.push(fullPath);
        }
    }
    return results;
}

function getFileNameFromUrl(url) {
    return path.basename(new URL(url).pathname);
}

function getExtractedDirName(zipFileName) {
    // Shengwang_Native_SDK_for_Mac_v4.6.2_FULL.zip → Shengwang_Native_SDK_for_Mac_FULL
    return zipFileName.replace(/_v[\d.]+/, '').replace(/\.zip$/, '');
}

// ─── 下载 ───────────────────────────────────────────────────

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            // 处理重定向
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                file.close();
                fs.unlinkSync(dest);
                return downloadFile(response.headers.location, dest).then(resolve, reject);
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return reject(new Error(`下载失败: ${url}, 状态码: ${response.statusCode}`));
            }
            const total = parseInt(response.headers['content-length'], 10) || 0;
            let downloaded = 0;
            response.on('data', (chunk) => {
                downloaded += chunk.length;
                if (total > 0) {
                    const percent = ((downloaded / total) * 100).toFixed(1);
                    process.stdout.write(`\r  进度: ${percent}% (${(downloaded / 1024 / 1024).toFixed(1)}MB / ${(total / 1024 / 1024).toFixed(1)}MB)`);
                }
            });
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('');
                resolve();
            });
        }).on('error', (err) => {
            file.close();
            fs.unlinkSync(dest);
            reject(err);
        });
    });
}

// ─── 解压 ───────────────────────────────────────────────────

function extractZip(zipPath, destDir) {
    console.log(`  解压中: ${path.basename(zipPath)}`);
    execSync(`unzip -o "${zipPath}" -d "${destDir}"`, { stdio: 'pipe' });
}

// ─── 清理模式 ───────────────────────────────────────────────

function clearTemp() {
    console.log('清理 temp 目录...');
    if (!fs.existsSync(TEMP_DIR)) {
        console.log('  temp 目录不存在，跳过');
        return;
    }
    const entries = fs.readdirSync(TEMP_DIR);
    let removed = 0;
    for (const entry of entries) {
        const fullPath = path.join(TEMP_DIR, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(fullPath);
        }
        removed++;
    }
    console.log(`  已清理 ${removed} 个项目`);
}

// ─── 清理目标目录 ─────────────────────────────────────────

function cleanDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    ensureDir(dir);
}

// ─── 各平台拷贝逻辑 ─────────────────────────────────────────

function copyMac(extractedDir) {
    console.log('  拷贝 Mac 平台文件...');
    const libsDir = path.join(extractedDir, 'libs');
    const macLibsDest = path.join(ROOT, 'mac', 'libs');
    const macIncludeDest = path.join(ROOT, 'mac', 'include', 'rtc');

    // 清空目标目录
    cleanDir(macLibsDest);
    cleanDir(macIncludeDest);

    // 拷贝所有 xcframework
    const xcframeworks = fs.readdirSync(libsDir).filter(f => f.endsWith('.xcframework'));
    for (const fw of xcframeworks) {
        copyDirSync(path.join(libsDir, fw), path.join(macLibsDest, fw));
    }

    // 从 AgoraRtcKit.xcframework 中提取头文件
    const rtcKitPath = path.join(libsDir, 'AgoraRtcKit.xcframework');
    if (fs.existsSync(rtcKitPath)) {
        const hFiles = findFilesRecursive(rtcKitPath, '.h');
        for (const hFile of hFiles) {
            copyFileSync(hFile, path.join(macIncludeDest, path.basename(hFile)));
        }
        console.log(`    拷贝 ${hFiles.length} 个头文件`);
    }
}

function copyiOS(extractedDir) {
    console.log('  拷贝 iOS 平台文件...');
    const libsDir = path.join(extractedDir, 'libs');
    const iosLibsDest = path.join(ROOT, 'ios', 'libs');
    const iosIncludeDest = path.join(ROOT, 'ios', 'include', 'rtc');

    // 清空目标目录
    cleanDir(iosLibsDest);
    cleanDir(iosIncludeDest);

    // 拷贝所有 xcframework
    const xcframeworks = fs.readdirSync(libsDir).filter(f => f.endsWith('.xcframework'));
    for (const fw of xcframeworks) {
        copyDirSync(path.join(libsDir, fw), path.join(iosLibsDest, fw));
    }

    // 从 AgoraRtcKit.xcframework 中提取头文件
    const rtcKitPath = path.join(libsDir, 'AgoraRtcKit.xcframework');
    if (fs.existsSync(rtcKitPath)) {
        const hFiles = findFilesRecursive(rtcKitPath, '.h');
        for (const hFile of hFiles) {
            copyFileSync(hFile, path.join(iosIncludeDest, path.basename(hFile)));
        }
        console.log(`    拷贝 ${hFiles.length} 个头文件`);
    }
}

function copyWindows(extractedDir) {
    console.log('  拷贝 Windows 平台文件...');
    const sdkDir = path.join(extractedDir, 'sdk');
    const winLibsDest = path.join(ROOT, 'windows', 'libs');
    const winIncludeDest = path.join(ROOT, 'windows', 'include', 'rtc');

    // 清空目标目录
    cleanDir(winLibsDest);
    cleanDir(winIncludeDest);

    // 拷贝 x86 和 x86_64 目录下的 .dll 文件
    for (const arch of ['x86', 'x86_64']) {
        const archDir = path.join(sdkDir, arch);
        if (!fs.existsSync(archDir)) continue;
        const dllFiles = fs.readdirSync(archDir).filter(f => f.endsWith('.dll'));
        for (const dll of dllFiles) {
            copyFileSync(path.join(archDir, dll), path.join(winLibsDest, arch, dll));
        }
        console.log(`    拷贝 ${dllFiles.length} 个 .dll 文件到 ${arch}/`);
    }

    // 拷贝头文件
    const includeDir = path.join(sdkDir, 'high_level_api', 'include');
    if (fs.existsSync(includeDir)) {
        const hFiles = findFilesRecursive(includeDir, '.h');
        for (const hFile of hFiles) {
            const relPath = path.relative(includeDir, hFile);
            copyFileSync(hFile, path.join(winIncludeDest, relPath));
        }
        console.log(`    拷贝 ${hFiles.length} 个头文件`);
    }
}

function copyAndroid(extractedDir) {
    console.log('  拷贝 Android 平台文件...');
    const sdkDir = path.join(extractedDir, 'rtc', 'sdk');
    const androidLibsDest = path.join(ROOT, 'android', 'libs');
    const androidIncludeDest = path.join(ROOT, 'android', 'include', 'rtc');

    // 清空目标目录
    cleanDir(androidLibsDest);
    cleanDir(androidIncludeDest);

    // 拷贝 sdk 根目录下的 .jar 和 .a ar 文件（排除 javadoc）
    const jarFiles = fs.readdirSync(sdkDir).filter(f =>
        (f.endsWith('.jar') && !f.includes('javadoc')) || f.endsWith('.aar')
    );
    for (const jar of jarFiles) {
        copyFileSync(path.join(sdkDir, jar), path.join(androidLibsDest, jar));
    }
    if (jarFiles.length > 0) {
        console.log(`    拷贝 ${jarFiles.length} 个 jar/aar 文件`);
    }

    // 拷贝各架构目录下的 .so 文件
    const archDirs = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'];
    for (const arch of archDirs) {
        const archDir = path.join(sdkDir, arch);
        if (!fs.existsSync(archDir)) continue;
        const soFiles = fs.readdirSync(archDir).filter(f => f.endsWith('.so'));
        for (const so of soFiles) {
            copyFileSync(path.join(archDir, so), path.join(androidLibsDest, arch, so));
        }
        console.log(`    拷贝 ${soFiles.length} 个 .so 文件到 ${arch}/`);
    }

    // 拷贝头文件
    const includeDir = path.join(sdkDir, 'high_level_api', 'include');
    if (fs.existsSync(includeDir)) {
        const hFiles = findFilesRecursive(includeDir, '.h');
        for (const hFile of hFiles) {
            const relPath = path.relative(includeDir, hFile);
            copyFileSync(hFile, path.join(androidIncludeDest, relPath));
        }
        console.log(`    拷贝 ${hFiles.length} 个头文件`);
    }
}

// ─── 主流程 ─────────────────────────────────────────────────

async function main() {
    const isClear = process.argv.includes('--clear');

    if (isClear) {
        clearTemp();
        return;
    }

    const agora = PKG.agora;
    if (!agora) {
        console.error('错误: package.json 中未找到 "agora" 配置');
        process.exit(1);
    }

    ensureDir(TEMP_DIR);

    const platforms = ['mac', 'ios', 'android', 'windows'];
    const copyFns = { mac: copyMac, ios: copyiOS, android: copyAndroid, windows: copyWindows };

    for (const platform of platforms) {
        const url = agora[platform];
        if (!url) {
            console.log(`跳过 ${platform}: 未配置下载链接`);
            continue;
        }

        const zipFileName = getFileNameFromUrl(url);
        const zipPath = path.join(TEMP_DIR, zipFileName);
        const extractedDirName = getExtractedDirName(zipFileName);
        const extractedDir = path.join(TEMP_DIR, extractedDirName);

        console.log(`\n[${platform.toUpperCase()}] ${zipFileName}`);

        // 下载（跳过已存在的）
        if (fs.existsSync(zipPath)) {
            console.log(`  已存在 ${zipFileName}，跳过下载`);
        } else {
            console.log(`  下载中: ${url}`);
            await downloadFile(url, zipPath);
        }

        // 解压（跳过已存在的）
        if (fs.existsSync(extractedDir)) {
            console.log(`  已存在解压目录，跳过解压`);
        } else {
            extractZip(zipPath, TEMP_DIR);
        }

        // 拷贝到目标目录
        if (copyFns[platform]) {
            copyFns[platform](extractedDir);
        }
    }

    console.log('\n完成!');
}

main().catch(err => {
    console.error('错误:', err.message);
    process.exit(1);
});
