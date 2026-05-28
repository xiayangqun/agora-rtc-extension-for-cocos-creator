#!/usr/bin/env node

/**
 * generate-native-tosevalue.js
 *
 * Parses Agora RTC SDK C++ headers via tree-sitter AST and auto-generates
 * `nativevalue_to_se` converter functions for Agora SDK structs.
 *
 * Incremental: if a nativevalue_to_se implementation inside the generated
 * section has `// do not gen code cover it` immediately above it, that
 * implementation block is kept verbatim and is not regenerated.
 *
 * Usage:
 *   node scripts/generate-native-tosevalue.js
 */

const Parser = require("tree-sitter");
const Cpp = require("tree-sitter-cpp");
const fs = require("fs");
const path = require("path");

// ─── paths ───────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, "..");
const HEADERS_DIR = path.join(ROOT, "mac", "include", "rtc");
const OUTPUT_H = path.join(ROOT, "native", "agora", "RtcNativeValueToSe.h");
const OUTPUT_CPP = path.join(ROOT, "native", "agora", "RtcNativeValueToSe.cpp");

const MARKER_DECL_START = "// AUTO-GENERATED DECLARATIONS START";
const MARKER_DECL_END = "// AUTO-GENERATED DECLARATIONS END";
const MARKER_IMPL_START = "// AUTO-GENERATED IMPLEMENTATIONS START";
const MARKER_IMPL_END = "// AUTO-GENERATED IMPLEMENTATIONS END";
const DO_NOT_GEN = "// do not gen code cover it";
const USER_BLOCK_START = "// USER CODE BLOCK START";
const USER_BLOCK_END = "// USER CODE BLOCK END";

// ─── blacklist ───────────────────────────────────────────────────────────
//
// These are interfaces, SDK helper templates, or pseudo-structs that are not
// useful as value objects on the JS side.
//
const SKIP_STRUCTS = new Set([
    "IRtcEngine",
    "IRtcEngineEventHandler",
    "IVideoDeviceCollection",
    "IVideoDeviceManager",
    "IVideoEffectObject",
    "IMetadataObserver",
    "IDirectCdnStreamingEventHandler",
    "IScreenCaptureSourceList",
    "AAudioDeviceManager",
    "AVideoDeviceManager",
    "IPacketObserver",
    "IAudioEncodedFrameObserver",
    "IEngineBase",
    "AParameter",
    "LicenseCallback",
    "IVideoFrameMetaInfo",
    "IVideoFrameObserver",
    "IAudioPcmFrameSink",
    "IAudioFrameObserverBase",
    "IAudioFrameObserver",
    "IAudioSpectrumObserver",
    "IVideoEncodedFrameObserver",
    "IFaceInfoObserver",
    "IMediaRecorderObserver",
    "IRtcEngineEventHandlerEx",
    "IRtcEngineEx",
    "ILogWriter",
    "IMediaEngine",
    "IH265TranscoderObserver",
    "IH265Transcoder",
    "IRhythmPlayer",
    "IAudioDeviceCollection",
    "IAudioDeviceManager",
    "IMediaPlayerCustomDataProvider",
    "IMediaPlayer",
    "IMediaPlayerCacheManager",
    "IMediaRecorder",
    "IAgoraParameter",
    "ILocalSpatialAudioEngine",
    "IMediaComponentFactory",
    "IMediaPlayerSource",
    "IMediaPlayerSourceObserver",
    "IMediaStreamingSource",
    "IMediaStreamingSourceObserver",
    "MusicChartCollection",
    "MusicCollection",
    "IMusicContentCenterEventHandler",
    "IMusicPlayer",
    "IMusicContentCenter",

    "Optional",
    "String",
    "in_place_t",
    "nullopt_t",
    "OptionalStorageBase",
    "OptionalStorage",
    "CopyConstructible",
    "CopyConstructible<false>",
    "MoveConstructible",
    "MoveConstructible<false>",
    "CopyAssignable",
    "CopyAssignable<false>",
    "MoveAssignable",
    "MoveAssignable<false>",
    "IsConvertibleFromOptional",
    "IsAssignableFromOptional",
    "IsSwappableImpl",
    "IsSwappable",
    "hash<agora::Optional<T> >",

    // ---- Nested types (inside other structs, not top-level) ----
    "StreamLayerConfig",      // nested in SimulcastConfig
    "Packet",                 // nested in IPacketObserver
    "PeerDownlinkInfo",       // nested in DownlinkNetworkInfo
    "Region",                 // nested in VideoCompositingLayout
    "Metadata",               // nested in IMetadataObserver
    "CollectionEvent",        // nested in ISyncClientObserver
    "AudioFrame",             // nested in IAudioFrameObserver
    "AudioParams",            // nested in IAudioFrameObserver
    "ExtensionMetaInfo",      // nested in IExtensionVideoCodecProvider
    "ExtensionVideoCodecInfo", // nested in IExtensionVideoCodecProvider

    // ---- Types that don't exist in this SDK version ----
    "ScreenVideoParameters",
    "ScreenCaptureParameters2",
    "ExtensionVersion",
    "ExtensionInterfaceVersion",
    "VideoEncoderSettings",
    "VideoDecoderSettings",
    "ImagePayloadData",
    "InputSeiData",
    "MusicCacheInfo",
    "MvProperty",
    "ClimaxSegment",
    "Music",
    "VideoCompositingLayout",
    "MusicContentCenterConfiguration",
    "DataChannelConfig",
    "TConnectionInfo",
    "RtcConnectionConfiguration",
    "RtmpConnectionConfiguration",
    "AudioEncoderConfiguration",
    "AgoraRhythmPlayerConfig",
    "AudioDeviceInfo",
    "LoopbackRecordingOption",
    "AudioSinkWants",
    "LocalAudioTrackStats",
    "RemoteAudioTrackStats",
    "AudioEncFrameRecvParams",
    "DataChannelInfo",
    "UserDataChannelInfo",
    "Capabilities",
    "LocalVideoTrackStats",
    "RemoteVideoTrackStats",
    "ANAStats",
    "AudioProcessingStats",
    "LocalAudioDetailedStats",
    "AudioVolumeInformation",
    "TConnectSettings",
    "RtmpStreamingAudioConfiguration",
    "LocalSpatialAudioConfig",
    "RtmpStreamingVideoConfiguration",
    "RtmpConnectionInfo",
    "RawPixelBuffer",
    "PaddedRawPixelBuffer",
    "TextureInfo",
    "VideoFrameData",
    "VideoFrameDataV2",
    "AlphaChannel",
    "MixerLayoutConfig",
    "StreamLayerConfigInternal",
    "SimulcastConfigInternal",
    "SimulcastStreamProfile",
    "SpatialAudioZone",
    "ScreenCaptureConfiguration",
    "CameraCapturerConfiguration",
    "DirectCdnStreamingMediaOptions",
    "ContentInspectConfig",
    "AdvancedAudioOptions",
    "ImageTrackOptions",
    "MediaRecorderConfiguration",
    "AudioSessionConfiguration",
    "ChannelMediaOptions",
    "ScreenCaptureSourceInfo",
    "SimulcastConfig",
    "AudioPcmFrame",
    "AgoraRhythmPlayerConfig",
    "MusicContentCenterConfiguration",
    "CameraCapturerConfiguration",
    "ScreenCaptureConfiguration",
    "DirectCdnStreamingMediaOptions",
    "ContentInspectConfig",
    "AdvancedAudioOptions",
    "ImageTrackOptions",
    "MediaRecorderConfiguration",
    "RemoteVoicePositionInfo",
    "SpatialAudioZone",
]);

const parser = new Parser();
parser.setLanguage(Cpp);

// ─── AST helpers ─────────────────────────────────────────────────────────

function collectStructs(node, namespaceStack, result) {
    if (node.type === "struct_specifier") {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
            const body = node.childForFieldName("body");
            result.push({
                name: nameNode.text,
                namespace: [...namespaceStack],
                fields: body ? extractFields(body) : [],
                startLine: node.startPosition.row + 1,
            });
        }
    }

    let newStack = namespaceStack;
    if (node.type === "namespace_definition") {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
            newStack = [...namespaceStack, nameNode.text];
        }
    }

    for (let i = 0; i < node.childCount; i++) {
        collectStructs(node.child(i), newStack, result);
    }
}

function extractFields(bodyNode) {
    const fields = [];
    if (!bodyNode) return fields;

    for (let i = 0; i < bodyNode.childCount; i++) {
        const child = bodyNode.child(i);
        if (child.type === "field_declaration") {
            const field = extractField(child);
            if (field) fields.push(field);
        }
        if (child.type === "preproc_if" || child.type === "preproc_ifdef") {
            for (let j = 0; j < child.childCount; j++) {
                const inner = child.child(j);
                if (inner.type === "field_declaration") {
                    const field = extractField(inner);
                    if (field) fields.push(field);
                }
            }
        }
    }

    return fields;
}

function extractField(fieldDecl) {
    const identNode = findFieldIdentifier(fieldDecl);
    const typeNode = fieldDecl.childForFieldName("type");
    if (!identNode || !typeNode) return null;
    // Skip fields with empty names (parsing errors)
    if (!identNode.text || identNode.text.trim() === '') return null;

    const arrayNode = findDescendant(fieldDecl, "array_declarator");
    const pointerNode = findDescendant(fieldDecl, "pointer_declarator");
    const referenceNode = findDescendant(fieldDecl, "reference_declarator");
    const bitfieldNode = findDescendant(fieldDecl, "bitfield_clause");

    const typeStr = extractTypeString(typeNode);
    // Skip const pointer fields (can't assign to them from JS)
    const hasConst = fieldDecl.text.includes("const ");
    if (pointerNode && hasConst) return null;

    return {
        name: identNode.text,
        type: typeStr,
        arraySize: arrayNode ? extractArraySize(arrayNode) : "",
        isPointer: Boolean(pointerNode),
        isReference: Boolean(referenceNode),
        isBitfield: Boolean(bitfieldNode),
        source: fieldDecl.text.replace(/\s+/g, " ").trim(),
    };
}

function findFieldIdentifier(node) {
    if (!node) return null;
    if (node.type === "field_identifier") return node;
    for (let i = 0; i < node.childCount; i++) {
        const r = findFieldIdentifier(node.child(i));
        if (r) return r;
    }
    return null;
}

function findDescendant(node, type) {
    if (!node) return null;
    if (node.type === type) return node;
    for (let i = 0; i < node.childCount; i++) {
        const r = findDescendant(node.child(i), type);
        if (r) return r;
    }
    return null;
}

function extractTypeString(typeNode) {
    if (!typeNode) return "";
    return typeNode.text.replace(/\s+/g, " ").trim();
}

function extractArraySize(arrayNode) {
    const bracketMatch = arrayNode.text.match(/\[(.+)\]/);
    if (bracketMatch) return bracketMatch[1].trim();

    for (let i = 0; i < arrayNode.childCount; i++) {
        const c = arrayNode.child(i);
        if (
            c.type === "number_literal" ||
            c.type === "identifier" ||
            c.type === "qualified_identifier"
        ) {
            return c.text.trim();
        }
    }
    return "";
}

// ─── code generation ─────────────────────────────────────────────────────

function fullNameOf(s) {
    return s.namespace.length > 0 ? `${s.namespace.join("::")}::${s.name}` : s.name;
}

function normalizeType(type) {
    return type
        .replace(/\bconst\b/g, "")
        .replace(/\bvolatile\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function isCharType(type) {
    return normalizeType(type) === "char";
}

function isStringLike(type) {
    const normalized = normalizeType(type);
    return normalized === "char" || normalized === "std::string" || normalized === "ccstd::string";
}

function isSupportedPointerField(field) {
    return field.isPointer && isCharType(field.type);
}

function qualifyArraySize(arraySize, fullName) {
    if (!arraySize || /^\d+$/.test(arraySize) || arraySize.includes("::")) return arraySize;
    if (arraySize.startsWith("MAX_")) return arraySize;
    if (arraySize === "STREAM_LAYER_COUNT_MAX") {
        return fullName === "agora::rtc::SimulcastConfig"
            ? `${fullName}::${arraySize}`
            : `agora::rtc::${arraySize}`;
    }
    if (/^k[A-Z]/.test(arraySize)) return `${fullName}::${arraySize}`;
    return arraySize;
}

function generateFieldConversion(field, fullName) {
    const lines = [];
    const prop = field.name;
    const access = `from.${prop}`;

    if (field.arraySize) {
        const arraySize = qualifyArraySize(field.arraySize, fullName);
        if (isCharType(field.type)) {
            lines.push(`    obj->setProperty("${prop}", se::Value(${access}));`);
            return lines;
        }

        lines.push(`    {`);
        lines.push(`        se::HandleObject array(se::Object::createArrayObject(${arraySize}));`);
        lines.push(`        for (uint32_t i = 0; i < static_cast<uint32_t>(${arraySize}); ++i) {`);
        lines.push(`            se::Value item;`);
        lines.push(`            ok &= nativevalue_to_se(${access}[i], item, ctx);`);
        lines.push(`            if (ok) { array->setArrayElement(i, item); }`);
        lines.push(`        }`);
        lines.push(`        obj->setProperty("${prop}", se::Value(array));`);
        lines.push(`    }`);
        return lines;
    }

    if (field.isPointer && !isSupportedPointerField(field)) {
        lines.push(`    // ${field.source}`);
        lines.push(`    // Pointer fields are intentionally left for a protected hand-written converter.`);
        return lines;
    }

    if (isSupportedPointerField(field) || isStringLike(field.type)) {
        lines.push(`    ok &= nativevalue_to_se(${access}, field, ctx);`);
        lines.push(`    if (ok) { obj->setProperty("${prop}", field); }`);
        return lines;
    }

    if (field.isBitfield) {
        lines.push(`    ok &= nativevalue_to_se(static_cast<int32_t>(${access}), field, ctx);`);
        lines.push(`    if (ok) { obj->setProperty("${prop}", field); }`);
        return lines;
    }

    if (field.isReference) {
        lines.push(`    ok &= nativevalue_to_se(${access}, field, ctx);`);
        lines.push(`    if (ok) { obj->setProperty("${prop}", field); }`);
        return lines;
    }

    lines.push(`    ok &= nativevalue_to_se(${access}, field, ctx);`);
    lines.push(`    if (ok) { obj->setProperty("${prop}", field); }`);
    return lines;
}

function generateFunction(fullName, fields) {
    const lines = [];
    lines.push(`bool nativevalue_to_se(const ${fullName} &from, se::Value &to, se::Object *ctx)`);
    lines.push(`{`);
    lines.push(`    se::HandleObject obj(se::Object::createPlainObject());`);
    lines.push(`    se::Value field;`);
    lines.push(`    bool ok = true;`);
    lines.push(``);

    for (const field of fields) {
        lines.push(...generateFieldConversion(field, fullName));
        lines.push(``);
    }

    lines.push(`    to.setObject(obj);`);
    lines.push(`    return ok;`);
    lines.push(`}`);
    return lines.join("\n");
}

function generateDeclaration(fullName) {
    return `bool nativevalue_to_se(const ${fullName} &from, se::Value &to, se::Object *ctx);`;
}

function createInitialHeader() {
    return `#pragma once

#include <type_traits>

#include "AgoraBase.h"
#include "AgoraExtensionVersion.h"
#include "AgoraExtensions.h"
#include "AgoraMediaBase.h"
#include "AgoraMediaPlayerTypes.h"
#include "IAgoraFileUploader.h"
#include "IAgoraLog.h"
#include "IAgoraMediaStreamingSource.h"
#include "IAgoraMusicContentCenter.h"
#include "IAgoraRhythmPlayer.h"
#include "IAgoraRtcEngine.h"
#include "IAgoraRtcEngineEx.h"
#include "IAgoraService.h"
#include "IAgoraSpatialAudio.h"
#include "NGIAgoraAudioDeviceManager.h"
#include "NGIAgoraAudioTrack.h"
#include "NGIAgoraDataChannel.h"
#include "NGIAgoraExtensionControl.h"
#include "NGIAgoraExtensionProvider.h"
#include "NGIAgoraLocalUser.h"
#include "NGIAgoraMediaNode.h"
#include "NGIAgoraRtcConnection.h"
#include "NGIAgoraRtmpConnection.h"
#include "NGIAgoraSyncClient.h"
#include "NGIAgoraVideoFrame.h"
#include "NGIAgoraVideoMixerSource.h"
#include "NGIAgoraVideoTrack.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions_spec.h"

// Forward declarations for Agora SDK struct -> se::Value converters.
// Generated by scripts/generate-native-tosevalue.js.

template<typename T, typename std::enable_if<std::is_enum<T>::value, int>::type = 0>
bool nativevalue_to_se(T from, se::Value &to, se::Object *ctx) {
    return nativevalue_to_se(static_cast<int32_t>(from), to, ctx);
}

template<typename T>
bool nativevalue_to_se(const agora::Optional<T> &from, se::Value &to, se::Object *ctx) {
    if (!from.has_value()) {
        to.setNull();
        return true;
    }
    return nativevalue_to_se(from.value(), to, ctx);
}

inline bool nativevalue_to_se(const agora::util::AString &from, se::Value &to, se::Object *ctx) {
    return nativevalue_to_se(from ? from->c_str() : "", to, ctx);
}

// ─────────────────────────────────────────────────────────────────────────────
// This file is AUTO-GENERATED by scripts/generate-native-tosevalue.js.
//
// To prevent a specific function from being overwritten on regeneration, add
// the line below immediately above it:
//
//   // do not gen code cover it
//   bool nativevalue_to_se(const YourStruct &from, se::Value &to, se::Object *ctx) { ... }
//
// To add custom code that survives regeneration, write it inside the block:
//
//   ${USER_BLOCK_START}
//   // your custom declarations here
//   ${USER_BLOCK_END}
// ─────────────────────────────────────────────────────────────────────────────

${MARKER_DECL_START}
${USER_BLOCK_START}
${USER_BLOCK_END}
${MARKER_DECL_END}
`;
}

function createInitialCpp() {
    return `#include "RtcNativeValueToSe.h"

// ─────────────────────────────────────────────────────────────────────────────
// This file is AUTO-GENERATED. See RtcNativeValueToSe.h for instructions on
// protecting custom code with "// do not gen code cover it".
//
// Custom code between ${USER_BLOCK_START} and ${USER_BLOCK_END} is preserved.
// ─────────────────────────────────────────────────────────────────────────────

${MARKER_IMPL_START}
${USER_BLOCK_START}
${USER_BLOCK_END}
${MARKER_IMPL_END}
`;
}

// ─── incremental merge ───────────────────────────────────────────────────

function ensureOutputFiles() {
    fs.mkdirSync(path.dirname(OUTPUT_H), { recursive: true });
    if (!fs.existsSync(OUTPUT_H)) fs.writeFileSync(OUTPUT_H, createInitialHeader(), "utf8");
    if (!fs.existsSync(OUTPUT_CPP)) fs.writeFileSync(OUTPUT_CPP, createInitialCpp(), "utf8");
}

function splitAtMarkers(content, startMarker, endMarker) {
    const beforeIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (beforeIdx === -1 || endIdx === -1) {
        throw new Error(`Markers not found: ${startMarker} / ${endMarker}`);
    }
    const afterStartIdx = content.indexOf("\n", beforeIdx) + 1;
    return {
        before: content.slice(0, afterStartIdx),
        middle: content.slice(afterStartIdx, endIdx),
        after: content.slice(endIdx),
    };
}

function parseProtectedImpls(middleContent) {
    const lines = middleContent.split("\n");
    const protectedStructs = new Set();
    const protectedBlocks = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== DO_NOT_GEN) continue;

        const signatureLine = lines[i + 1] || "";
        const m = signatureLine.match(/^bool nativevalue_to_se\(const\s+(.+?)\s+&from,\s*se::Value\s+&to,/);
        if (!m) continue;

        const fullName = m[1].trim();
        let j = i + 1;
        while (j < lines.length && !lines[j].includes("{")) j++;
        if (j >= lines.length) continue;

        let depth = 0;
        let end = j;
        for (; end < lines.length; end++) {
            for (const ch of lines[end]) {
                if (ch === "{") depth++;
                if (ch === "}") depth--;
            }
            if (depth === 0) break;
        }

        const block = lines.slice(i, end + 1).join("\n").trimEnd();
        protectedStructs.add(fullName);
        protectedBlocks.push({ fullName, block });
        i = end;
    }

    return { protectedStructs, protectedBlocks };
}

function extractUserBlock(content) {
    // Use lastIndexOf to skip occurrences inside comments
    const startIdx = content.lastIndexOf(USER_BLOCK_START);
    const endIdx = content.lastIndexOf(USER_BLOCK_END);
    if (startIdx === -1 || endIdx === -1) return "";
    const afterStartIdx = content.indexOf("\n", startIdx) + 1;
    if (afterStartIdx >= endIdx) return "";
    return content.slice(afterStartIdx, endIdx);
}

// ─── parsing fallbacks ───────────────────────────────────────────────────

function stripToDefinitions(source) {
    let s = source.replace(/\/\*[\s\S]*?\*\//g, "");
    s = s.replace(/\/\/.*$/gm, "");
    s = s.replace(/\n\s*\n/g, "\n");
    return s;
}

function buildNamespaceMap(source) {
    const lines = source.split("\n");
    const map = [];
    const stack = [];
    const nsDepth = [];
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nsMatch = line.match(/^\s*namespace\s+(\w+)\s*\{/);
        if (nsMatch) {
            stack.push(nsMatch[1]);
            nsDepth.push(braceDepth);
        }

        for (const ch of line) {
            if (ch === "{") braceDepth++;
            if (ch === "}") {
                braceDepth--;
                while (nsDepth.length > 0 && nsDepth[nsDepth.length - 1] >= braceDepth) {
                    stack.pop();
                    nsDepth.pop();
                }
            }
        }
        map[i] = [...stack];
    }

    return map;
}

function extractStructBlocks(source) {
    const lines = source.split("\n");
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
        const m = lines[i].match(
            /^\s*(?:struct|class)\s+(?:alignas\([^)]*\)\s+)?(?:\w+::)*(\w+)\s*(?:\s*:\s*[^{]*)?\s*\{/,
        );
        if (!m) {
            i++;
            continue;
        }

        const startLine = i;
        let depth = 1;
        let j = i + 1;
        while (j < lines.length && depth > 0) {
            for (const ch of lines[j]) {
                if (ch === "{") depth++;
                if (ch === "}") depth--;
            }
            j++;
        }
        if (depth === 0) {
            blocks.push({
                name: m[1],
                block: lines.slice(startLine, j).join("\n"),
                startLine: startLine + 1,
                endLine: j,
            });
        }
        i = j;
    }

    return blocks;
}

// ─── main ────────────────────────────────────────────────────────────────

function main() {
    console.log("[gen-native-tosevalue] Parsing Agora SDK headers...");

    const headerFiles = fs
        .readdirSync(HEADERS_DIR)
        .filter((f) => f.endsWith(".h"))
        .map((f) => path.join(HEADERS_DIR, f));

    const allStructs = [];
    const failedFiles = [];

    for (const filePath of headerFiles) {
        const raw = fs.readFileSync(filePath, "utf8");
        const source = stripToDefinitions(raw);
        try {
            const tree = parser.parse(source);
            const fileStructs = [];
            collectStructs(tree.rootNode, [], fileStructs);
            for (const s of fileStructs) allStructs.push({ ...s, file: path.basename(filePath) });
        } catch (e) {
            failedFiles.push(path.basename(filePath));
            try {
                const tree = parser.parse(raw);
                const fileStructs = [];
                collectStructs(tree.rootNode, [], fileStructs);
                for (const s of fileStructs) allStructs.push({ ...s, file: path.basename(filePath) });
                failedFiles.pop();
            } catch (_) {
                const nsMap = buildNamespaceMap(raw);
                const blocks = extractStructBlocks(raw);
                let fallbackOk = 0;
                for (const block of blocks) {
                    try {
                        const blockTree = parser.parse(block.block);
                        const blockStructs = [];
                        collectStructs(blockTree.rootNode, [], blockStructs);
                        const ns = nsMap[block.startLine - 1] || [];
                        for (const s of blockStructs) {
                            s.namespace = ns;
                            allStructs.push({ ...s, file: path.basename(filePath) });
                        }
                        fallbackOk++;
                    } catch (_b) {
                        // skip this block
                    }
                }
                if (fallbackOk > 0) failedFiles.pop();
            }
        }
    }

    if (failedFiles.length > 0) {
        console.warn(`[gen-native-tosevalue] WARNING: ${failedFiles.length} file(s) failed to parse:`);
        for (const f of failedFiles) console.warn(`  - ${f}`);
    }

    console.log(`[gen-native-tosevalue] Found ${allStructs.length} struct(s) total`);

    const candidates = allStructs.filter((s) => {
        if (SKIP_STRUCTS.has(s.name)) return false;
        // Skip template specializations (contain '<' in the name)
        if (s.name.includes('<')) return false;
        if (s.fields.length === 0) return false;
        return s.namespace[0] === "agora" || s.namespace.length === 0;
    });

    console.log(`[gen-native-tosevalue] ${candidates.length} struct(s) after filtering`);

    const deduped = new Map();
    for (const s of candidates) {
        const fullName = fullNameOf(s);
        const existing = deduped.get(fullName);
        if (!existing || s.fields.length > existing.fields.length) deduped.set(fullName, s);
    }
    const unique = [...deduped.values()].sort((a, b) => fullNameOf(a).localeCompare(fullNameOf(b)));

    const dupCount = candidates.length - unique.length;
    if (dupCount > 0) {
        console.log(`[gen-native-tosevalue] ${dupCount} duplicate(s) removed`);
    }

    ensureOutputFiles();

    const existingH = fs.readFileSync(OUTPUT_H, "utf8");
    const existingCpp = fs.readFileSync(OUTPUT_CPP, "utf8");
    const hParts = splitAtMarkers(existingH, MARKER_DECL_START, MARKER_DECL_END);
    const cppParts = splitAtMarkers(existingCpp, MARKER_IMPL_START, MARKER_IMPL_END);
    const { protectedStructs, protectedBlocks } = parseProtectedImpls(cppParts.middle);
    const userBlockH = extractUserBlock(hParts.middle);
    const userBlockCpp = extractUserBlock(cppParts.middle);

    const newDecls = [];
    const newImpls = [];
    let skipped = 0;
    let overwritten = 0;
    let added = 0;

    for (const { block } of protectedBlocks) {
        newImpls.push(block);
        newImpls.push("");
    }

    for (const s of unique) {
        const fullName = fullNameOf(s);
        newDecls.push(generateDeclaration(fullName));

        if (protectedStructs.has(fullName)) {
            skipped++;
            continue;
        }

        if (cppParts.middle.includes(`bool nativevalue_to_se(const ${fullName} &from`)) {
            overwritten++;
        } else {
            added++;
        }

        newImpls.push(generateFunction(fullName, s.fields));
        newImpls.push("");
    }

    const newH =
        `${hParts.before}\n${newDecls.join("\n")}\n${USER_BLOCK_START}\n${userBlockH}${USER_BLOCK_END}\n${hParts.after}`;
    const newCpp =
        `${cppParts.before}\n${newImpls.join("\n")}${USER_BLOCK_START}\n${userBlockCpp}${USER_BLOCK_END}\n${cppParts.after}`;

    fs.writeFileSync(OUTPUT_H, newH, "utf8");
    fs.writeFileSync(OUTPUT_CPP, newCpp, "utf8");

    console.log(
        `[gen-native-tosevalue] Done: ${added} added, ${overwritten} overwritten, ${skipped} skipped (protected)`,
    );
    console.log(`[gen-native-tosevalue] Output: ${OUTPUT_H}`);
    console.log(`[gen-native-tosevalue] Output: ${OUTPUT_CPP}`);
}

main();
