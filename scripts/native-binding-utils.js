const fs = require("fs");
const path = require("path");

function normalizePath(value) {
    return path.normalize(value.replace(/^["']|["']$/g, ""));
}

function extractEngineRootFromCcDtsLine(line) {
    if (!line) {
        return "";
    }

    const searchable = line.trimStart().replace(/^\/\/\/?\s*/, "");
    const match = searchable.match(/(?:[A-Za-z]:[\\/][^\s"'<>]+|\/[^\s"'<>]+)/);
    if (!match) {
        return "";
    }

    let found = normalizePath(match[0]);
    const declarationsIndex = found.indexOf(`${path.sep}bin${path.sep}.declarations`);
    if (declarationsIndex >= 0) {
        return found.slice(0, declarationsIndex);
    }

    if (found.endsWith(`${path.sep}cocos`)) {
        return path.dirname(found);
    }

    if (found.endsWith(`${path.sep}cc.d.ts`)) {
        return path.dirname(found);
    }

    return found;
}

function readEngineRootFromCcDts(projectRoot) {
    const candidates = [
        path.join(projectRoot, "temp", "declarations", "cc.d.ts"),
        path.join(projectRoot, "temp", "cc.d.ts"),
    ];
    const ccDtsPath = candidates.find((candidate) => fs.existsSync(candidate));
    if (!ccDtsPath) {
        return "";
    }

    const content = fs.readFileSync(ccDtsPath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
        const engineRoot = extractEngineRootFromCcDtsLine(line);
        if (engineRoot) {
            return engineRoot;
        }
    }
    return "";
}

function readEngineRootFromPathFile(projectRoot) {
    const pathFile = path.join(projectRoot, "cocos-engine-path.txt");
    if (!fs.existsSync(pathFile)) {
        return "";
    }

    const content = fs.readFileSync(pathFile, "utf8");
    const line = content
        .split(/\r?\n/)
        .map((value) => value.trim())
        .find((value) => value && !value.startsWith("#"));

    return line ? path.resolve(projectRoot, normalizePath(line)) : "";
}

function resolveCocosGenbindings(engineRoot) {
    const genbindingsPath = path.join(engineRoot, "native", "tools", "swig-config", "genbindings.js");
    if (!fs.existsSync(genbindingsPath)) {
        throw new Error(`Cocos genbindings.js not found: ${genbindingsPath}`);
    }
    return genbindingsPath;
}

module.exports = {
    extractEngineRootFromCcDtsLine,
    readEngineRootFromPathFile,
    readEngineRootFromCcDts,
    resolveCocosGenbindings,
};
