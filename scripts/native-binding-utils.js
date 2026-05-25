const fs = require("fs");
const path = require("path");

function normalizePath(value) {
    return path.normalize(value.replace(/^["']|["']$/g, ""));
}

function extractEngineRootFromCcDtsLine(line) {
    console.log(`[agora] extractEngineRootFromCcDtsLine: input=${JSON.stringify(line)}`);
    if (!line) {
        console.log(`[agora] extractEngineRootFromCcDtsLine: empty line, return ""`);
        return "";
    }

    // 先去掉行首空白缩进，再剥掉 /// 引用前缀
    const searchable = line.trimStart().replace(/^\/\/\/?\s*/, "");
    console.log(`[agora] extractEngineRootFromCcDtsLine: searchable=${JSON.stringify(searchable)}`);
    const match = searchable.match(/(?:[A-Za-z]:[\\/][^\s"'<>]+|\/[^\s"'<>]+)/);
    if (!match) {
        console.log(`[agora] extractEngineRootFromCcDtsLine: no path match found`);
        return "";
    }
    console.log(`[agora] extractEngineRootFromCcDtsLine: matchedPath=${match[0]}`);

    let found = normalizePath(match[0]);
    console.log(`[agora] extractEngineRootFromCcDtsLine: normalized=${found}`);
    const declarationsIndex = found.indexOf(`${path.sep}bin${path.sep}.declarations`);
    console.log(`[agora] extractEngineRootFromCcDtsLine: declarationsIndex=${declarationsIndex}`);
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
    const ccDtsPath = path.join(projectRoot, "temp", "declarations", "cc.d.ts");
    console.log(`[agora] readEngineRootFromCcDts: path=${ccDtsPath}`);
    if (!fs.existsSync(ccDtsPath)) {
        console.log(`[agora] readEngineRootFromCcDts: file NOT found`);
        return "";
    }

    const content = fs.readFileSync(ccDtsPath, "utf8");
    const lines = content.split(/\r?\n/);
    console.log(`[agora] readEngineRootFromCcDts: file has ${lines.length} lines`);
    console.log(`[agora] readEngineRootFromCcDts: line[0] = ${JSON.stringify(lines[0])}`);
    // 找到第一个包含 /// <reference 的行（文件可能以空行开头）
    const refLine = lines.find((l) => l.includes("/// <reference"));
    if (!refLine) {
        console.log(`[agora] readEngineRootFromCcDts: no /// <reference line found`);
        return "";
    }
    console.log(`[agora] readEngineRootFromCcDts: refLine = ${JSON.stringify(refLine)}`);
    const result = extractEngineRootFromCcDtsLine(refLine);
    console.log(`[agora] readEngineRootFromCcDts: engineRoot = ${result || "(empty)"}`);
    return result;
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
    readEngineRootFromCcDts,
    resolveCocosGenbindings,
};
