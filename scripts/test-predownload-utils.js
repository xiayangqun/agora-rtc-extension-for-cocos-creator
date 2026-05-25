const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { copyDirContentsSync } = require("./predownload-utils");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agora-predownload-"));
const source = path.join(tmp, "source", "Foo.xcframework");
const dest = path.join(tmp, "dest", "Foo.xcframework");

fs.mkdirSync(path.join(source, "macos-arm64_x86_64", "Foo.framework"), { recursive: true });
fs.writeFileSync(path.join(source, "Info.plist"), "plist");
fs.writeFileSync(path.join(source, "macos-arm64_x86_64", "Foo.framework", "Foo"), "binary");

copyDirContentsSync(source, dest);

assert.strictEqual(fs.existsSync(path.join(dest, "Info.plist")), true);
assert.strictEqual(fs.existsSync(path.join(dest, "macos-arm64_x86_64", "Foo.framework", "Foo")), true);
assert.strictEqual(fs.existsSync(path.join(dest, "Foo.xcframework")), false);

console.log("predownload utility tests passed");
