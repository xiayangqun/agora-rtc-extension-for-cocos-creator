const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
    extractEngineRootFromCcDtsLine,
    readEngineRootFromCcDts,
    resolveCocosGenbindings,
} = require("./native-binding-utils");

assert.strictEqual(extractEngineRootFromCcDtsLine("// /Users/me/cocos-engine/cocos"), "/Users/me/cocos-engine");
assert.strictEqual(
    extractEngineRootFromCcDtsLine(
        '/// <reference path="/Users/me/CocosCreator/3.8.6/resources/resources/3d/engine/bin/.declarations/cc.d.ts" />',
    ),
    "/Users/me/CocosCreator/3.8.6/resources/resources/3d/engine",
);
assert.strictEqual(extractEngineRootFromCcDtsLine("// no absolute path"), "");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agora-native-bindings-"));
const projectRoot = path.join(tmp, "project");
const missingProject = path.join(tmp, "missing-project");
const engineRoot = path.join(tmp, "engine");
fs.mkdirSync(path.join(projectRoot, "temp"), { recursive: true });
fs.mkdirSync(missingProject, { recursive: true });
fs.mkdirSync(path.join(engineRoot, "native/tools/swig-config"), { recursive: true });
fs.writeFileSync(path.join(projectRoot, "temp/cc.d.ts"), `// ${engineRoot}/bin/.declarations/cc.d.ts\n`);
fs.writeFileSync(path.join(engineRoot, "native/tools/swig-config/genbindings.js"), "");

assert.strictEqual(readEngineRootFromCcDts(projectRoot), engineRoot);
assert.strictEqual(readEngineRootFromCcDts(missingProject), "");
assert.strictEqual(
    resolveCocosGenbindings(engineRoot),
    path.join(engineRoot, "native/tools/swig-config/genbindings.js"),
);

console.log("native binding utility tests passed");
