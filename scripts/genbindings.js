#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { resolveCocosGenbindings } = require("./native-binding-utils");

const root = path.resolve(__dirname, "..");
const engineRoot = process.argv[2] ? path.resolve(process.argv[2]) : "";

function removeIfExists(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
        console.log(`removed ${path.relative(root, filePath)}`);
    }
}

if (!engineRoot) {
    console.error("Usage: node scripts/genbindings.js /absolute/path/to/cocos-engine");
    process.exit(1);
}

let genbindingsPath;
try {
    genbindingsPath = resolveCocosGenbindings(engineRoot);
} catch (error) {
    console.error(error.message || String(error));
    process.exit(1);
}

const autoDir = path.join(root, "native", "bindings", "auto");
fs.mkdirSync(autoDir, { recursive: true });
removeIfExists(path.join(autoDir, "jsb_agora_rtc_auto.h"));
removeIfExists(path.join(autoDir, "jsb_agora_rtc_auto.cpp"));

const configPath = path.join(root, "swig-config", "swig-config.js");
const result = spawnSync(process.execPath, [genbindingsPath, "-c", configPath], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status || 0);
