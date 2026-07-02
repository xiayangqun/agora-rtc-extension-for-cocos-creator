#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('请提供版本号，例如: npm run make 1.0.1');
    process.exit(1);
}

const version = args[0];
const packageName = 'agora-rtc-extension-for-cocos-creator';
const rootDir = path.resolve(__dirname, '..');
const parentDir = path.dirname(rootDir);
const targetDirName = `${packageName}_v${version}`;
const targetDir = path.join(parentDir, targetDirName);
const zipFile = path.join(parentDir, `${targetDirName}.zip`);

console.log(`开始打包 ${packageName} v${version}`);

// 1. 执行 npm run build 生成 dist 文件夹
console.log('1. 执行 npm run build...');
try {
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    console.log('   构建完成');
} catch (error) {
    console.error('构建失败:', error.message);
    process.exit(1);
}

// 2. 读取并更新 package.json
console.log('2. 更新 package.json...');
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 更新版本
packageJson.version = version;

// 写入更新后的 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
console.log(`   version: -> ${version}`);

// 3. 读取 .gitignore 规则
console.log('3. 读取 .gitignore 规则...');
const gitignorePath = path.join(rootDir, '.gitignore');
const gitignoreRules = fs.readFileSync(gitignorePath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

// 4. 复制目录（排除 .gitignore 中的文件和 .git 目录，但保留 dist）
console.log('4. 复制项目文件...');
if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
}

// 使用 rsync 复制，排除 .git 和 .gitignore 中的规则（但保留 dist）
const excludePatterns = [
    '.git',
    ...gitignoreRules
        .filter(rule => rule !== 'dist') // 保留 dist 文件夹
        .map(rule => {
            // 处理简单的 .gitignore 规则
            if (rule.startsWith('**/')) {
                return rule.slice(3);
            }
            if (rule.endsWith('/')) {
                return rule.slice(0, -1);
            }
            return rule;
        })
];

// 构建 rsync 排除参数
const excludeArgs = excludePatterns.map(pattern => `--exclude='${pattern}'`).join(' ');
const rsyncCmd = `rsync -a ${excludeArgs} "${rootDir}/" "${targetDir}/"`;

try {
    execSync(rsyncCmd, { stdio: 'pipe' });
    console.log(`   已复制到: ${targetDir}`);
} catch (error) {
    console.error('复制文件失败:', error.message);
    process.exit(1);
}

// 5. 创建 zip 包
console.log('5. 创建 zip 包...');
try {
    // 删除已存在的 zip 文件
    if (fs.existsSync(zipFile)) {
        fs.unlinkSync(zipFile);
    }
    
    // 使用 zip 命令创建压缩包
    const zipCmd = `cd "${parentDir}" && zip -r "${zipFile}" "${targetDirName}"`;
    execSync(zipCmd, { stdio: 'pipe' });
    
    const stats = fs.statSync(zipFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   已创建: ${zipFile} (${fileSizeInMB} MB)`);
} catch (error) {
    console.error('创建 zip 包失败:', error.message);
    // 清理复制的目录
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    process.exit(1);
}

console.log('\n打包完成！');
console.log(`输出文件: ${zipFile}`);
console.log(`目录大小: ${(fs.statSync(targetDir).size / (1024 * 1024)).toFixed(2)} MB`);