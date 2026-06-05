const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyDirContentsSync(src, dest) {
    fs.rmSync(dest, { recursive: true, force: true });
    ensureDir(dest);

    if (process.platform === "win32") {
        fs.cpSync(src, dest, { recursive: true, dereference: false });
        return;
    }

    execFileSync("cp", ["-R", `${src}${path.sep}.`, dest]);
}

module.exports = {
    copyDirContentsSync,
    ensureDir,
};
