#!/usr/bin/env node

/**
 * generate-sevalue-to-native.js
 *
 * Parses Agora RTC SDK C++ headers via tree-sitter AST and auto-generates
 * `sevalue_to_native` converter functions for every struct/enum.
 *
 * Incremental: if a sevalue_to_native already exists and the line above it
 * contains `// do not gen code cover it`, it is preserved as-is.
 * Otherwise the function is regenerated.
 *
 * Usage:
 *   node scripts/generate-sevalue-to-native.js
 *   npm run genbindings:sevalue
 */

const Parser = require("tree-sitter");
const Cpp = require("tree-sitter-cpp");
const fs = require("fs");
const path = require("path");

// ─── paths ───────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, "..");
const HEADERS_DIR = path.join(ROOT, "mac", "include", "rtc");
const OUTPUT_H = path.join(ROOT, "native", "bindings", "manual", "jsb_agora_rtc_ext.h");
const OUTPUT_CPP = path.join(ROOT, "native", "bindings", "manual", "jsb_agora_rtc_ext.cpp");

const MARKER_DECL_START = "// AUTO-GENERATED DECLARATIONS START";
const MARKER_DECL_END = "// AUTO-GENERATED DECLARATIONS END";
const MARKER_IMPL_START = "// AUTO-GENERATED IMPLEMENTATIONS START";
const MARKER_IMPL_END = "// AUTO-GENERATED IMPLEMENTATIONS END";
const DO_NOT_GEN = "// do not gen code cover it";
const USER_BLOCK_START = "// USER CODE BLOCK START";
const USER_BLOCK_END = "// USER CODE BLOCK END";

// ─── blacklist ───────────────────────────────────────────────────────────
//
// These structs / classes are skipped (not generated).
// Add new entries when you need to hand-write or typemap a particular type.
//
const SKIP_STRUCTS = new Set([
    // ---- Agora SDK interfaces (pure-virtual classes) ----
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

    // ---- Result structs (handled by typemap out) ----
    "GetVersionResult",
    "GetEffectsVolumeResult",
    "QueryCodecCapabilityResult",
    "GetAudioMixingDurationResult",
    "GetAudioMixingCurrentPositionResult",
    "GetAudioMixingPublishVolumeResult",
    "GetAudioMixingPlayoutVolumeResult",
    "GetAudioTrackCountResult",
    "GetVolumeOfEffectResult",
    "GetEffectDurationResult",
    "GetEffectCurrentPositionResult",
    "GetCameraMaxZoomFactorResult",
    "GetLoopbackRecordingVolumeResult",
    "GetNetworkTypeResult",
    "GetFaceShapeBeautyOptionsResult",
    "GetFaceShapeAreaOptionsResult",

    // ---- Internal / bridge types ----
    "AgoraRtcNativeContext",

    // ---- Agora SDK utility templates (not real structs) ----
    "Optional",
    "String",

    // ---- AgoraOptional.h internals (no sevalue_to_native needed) ----
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

// ─── AST helpers ─────────────────────────────────────────────────────────

const parser = new Parser();
parser.setLanguage(Cpp);

/**
 * Recursively walk the AST tree and collect all struct_specifier nodes.
 */
function collectStructs(node, namespaceStack, result) {
    if (node.type === "struct_specifier") {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
            const structName = nameNode.text;
            const body = node.childForFieldName("body");
            const fields = body ? extractFields(body) : [];
            result.push({
                name: structName,
                namespace: [...namespaceStack],
                fields: fields,
                startLine: node.startPosition.row + 1,
            });
        }
    }

    // Track namespace scopes
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

/**
 * Extract field name and type string from a field_declaration_list node.
 */
function extractFields(bodyNode) {
    const fields = [];
    if (!bodyNode) return fields;

    for (let i = 0; i < bodyNode.childCount; i++) {
        const child = bodyNode.child(i);
        if (child.type === "field_declaration") {
            const identNode = findFieldIdentifier(child);
            const typeStr = extractTypeString(child.childForFieldName("type"));
            // Skip pointer fields (need hand-written converter)
            const hasPointer = findDescendant(child, "pointer_declarator") !== null;
            if (identNode && typeStr && identNode.text && identNode.text.trim() !== '' && !hasPointer) {
                fields.push({ name: identNode.text, type: typeStr });
            }
        }
        // recurse into ifdef blocks
        if (child.type === "preproc_if" || child.type === "preproc_ifdef") {
            for (let j = 0; j < child.childCount; j++) {
                const inner = child.child(j);
                if (inner.type === "field_declaration") {
                    const identNode = findFieldIdentifier(inner);
                    const typeStr = extractTypeString(inner.childForFieldName("type"));
                    const hasPointer = findDescendant(inner, "pointer_declarator") !== null;
                    if (identNode && typeStr && identNode.text && identNode.text.trim() !== '' && !hasPointer) {
                        fields.push({ name: identNode.text, type: typeStr });
                    }
                }
            }
        }
    }
    return fields;
}

/**
 * Find the field_identifier inside a field_declaration.
 */
function findFieldIdentifier(fieldDecl) {
    for (let i = 0; i < fieldDecl.childCount; i++) {
        const c = fieldDecl.child(i);
        if (c.type === "field_identifier") return c;
        // may be inside pointer_declarator, array_declarator, etc.
        const inner = findDescendant(c, "field_identifier");
        if (inner) return inner;
    }
    return null;
}

function findDescendant(node, type) {
    if (node.type === type) return node;
    for (let i = 0; i < node.childCount; i++) {
        const r = findDescendant(node.child(i), type);
        if (r) return r;
    }
    return null;
}

/**
 * Extract a human-readable type string from a type node.
 */
function extractTypeString(typeNode) {
    if (!typeNode) return "";
    // Build the text, collapsing whitespace
    return typeNode.text.replace(/\s+/g, " ").trim();
}

// ─── code generation ─────────────────────────────────────────────────────

/**
 * Generate the sevalue_to_native function body for one struct.
 */
function generateFunction(structName, fullName, fields) {
    const lines = [];
    lines.push(`bool sevalue_to_native(const se::Value &from, ${fullName} *to, se::Object *ctx)`);
    lines.push(`{`);
    lines.push(`    assert(from.isObject());`);
    lines.push(`    se::Object *json = from.toObject();`);
    lines.push(`    se::Value field;`);
    lines.push(`    bool ok = true;`);
    lines.push(``);

    for (const f of fields) {
        const propName = f.name;
        lines.push(`    json->getProperty("${propName}", &field, true);`);
        lines.push(`    if (!field.isNullOrUndefined()) {`);
        const accessor = `&(to->${propName})`;
        lines.push(`        ok &= sevalue_to_native(field, ${accessor}, ctx);`);
        lines.push(`    }`);
        lines.push(``);
    }

    lines.push(`    return ok;`);
    lines.push(`}`);
    return lines.join("\n");
}

function generateDeclaration(fullName) {
    return `bool sevalue_to_native(const se::Value &from, ${fullName} *to, se::Object *ctx);`;
}

// ─── incremental merge ───────────────────────────────────────────────────

/**
 * Read existing file and split into three parts:
 *   before marker, content between markers, after marker.
 */
function splitAtMarkers(content, startMarker, endMarker) {
    const beforeIdx = content.indexOf(startMarker);
    const afterStartIdx = content.indexOf("\n", beforeIdx) + 1;
    const endIdx = content.indexOf(endMarker);
    if (beforeIdx === -1 || endIdx === -1) {
        throw new Error(`Markers not found: ${startMarker} / ${endMarker}`);
    }
    return {
        before: content.slice(0, afterStartIdx),
        middle: content.slice(afterStartIdx, endIdx),
        after: content.slice(endIdx),
    };
}

/**
 * Parse existing implementations and extract:
 *  - function names that have `// do not gen code cover it` protection
 *  - all existing function declarations (for the header)
 */
function parseExistingImpls(middleContent) {
    const lines = middleContent.split("\n");
    const protectedStructs = new Set();

    for (let i = 1; i < lines.length; i++) {
        const prev = lines[i - 1].trim();
        const curr = lines[i];
        if (prev === DO_NOT_GEN) {
            const m = curr.match(/^bool sevalue_to_native\(.*?,\s*(\S+)\s*\*/);
            if (m) {
                protectedStructs.add(m[1]);
            }
        }
    }
    return { protectedStructs };
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

// ─── main ────────────────────────────────────────────────────────────────

/**
 * Pre-process a C++ source: keep only struct/class/enum/namespace
 * definitions.  Drops function bodies, comments, and other noise that
 * can trip tree-sitter-cpp on very large headers.
 */
function stripToDefinitions(source) {
    // Remove C-style comments
    let s = source.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove line comments
    s = s.replace(/\/\/.*$/gm, "");
    // Collapse blank lines
    s = s.replace(/\n\s*\n/g, "\n");
    return s;
}

/**
 * Build a namespace stack lookup: given a line number, return the
 * namespace (array of segments) that line is inside.
 * Uses brace-depth tracking to correctly pop namespaces.
 */
function buildNamespaceMap(source) {
    const lines = source.split("\n");
    const map = []; // map[lineIndex] = ["agora", "rtc"]
    const stack = [];
    let braceDepth = 0;
    // Records: at what brace depth was each namespace pushed
    const nsDepth = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check for namespace opening
        const nsMatch = line.match(/^\s*namespace\s+(\w+)\s*\{/);
        if (nsMatch) {
            stack.push(nsMatch[1]);
            nsDepth.push(braceDepth);
        }
        // Track brace depth for this line
        for (const ch of line) {
            if (ch === "{") braceDepth++;
            else if (ch === "}") {
                braceDepth--;
                // Pop namespaces that were pushed at the depth we just closed
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

/**
 * For files that tree-sitter can't parse whole, extract candidate
 * struct/class blocks using brace matching on lines that start with
 * `struct Foo` or `class Foo`.  Each block is then parsed individually
 * with tree-sitter.
 */
function extractStructBlocks(source) {
    const lines = source.split("\n");
    const blocks = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        // Match: struct Foo ... {   or   class Foo ... {
        const m = line.match(
            /^\s*(?:struct|class)\s+(?:alignas\([^)]*\)\s+)?(?:\w+::)*(\w+)\s*(?:\s*:\s*[^{]*)?\s*\{/,
        );
        if (m) {
            const name = m[1];
            const startLine = i;
            let depth = 1;
            let j = i + 1;
            // Find the matching closing brace
            while (j < lines.length && depth > 0) {
                const l = lines[j].trim();
                // Count brace depth
                for (const ch of l) {
                    if (ch === "{") depth++;
                    else if (ch === "}") depth--;
                }
                j++;
            }
            if (depth === 0) {
                const block = lines.slice(startLine, j).join("\n");
                blocks.push({ name, block, startLine: startLine + 1, endLine: j });
            }
            i = j;
        } else {
            i++;
        }
    }
    return blocks;
}

function main() {
    console.log("[gen-sevalue] Parsing Agora SDK headers...");

    // Collect all .h files
    const headerFiles = fs
        .readdirSync(HEADERS_DIR)
        .filter((f) => f.endsWith(".h"))
        .map((f) => path.join(HEADERS_DIR, f));

    // Parse each header and collect structs
    const allStructs = [];
    const failedFiles = [];
    for (const filePath of headerFiles) {
        const raw = fs.readFileSync(filePath, "utf8");
        const source = stripToDefinitions(raw);
        try {
            const tree = parser.parse(source);
            const fileStructs = [];
            collectStructs(tree.rootNode, [], fileStructs);
            for (const s of fileStructs) {
                allStructs.push({ ...s, file: path.basename(filePath) });
            }
        } catch (e) {
            failedFiles.push(path.basename(filePath));
            // Retry with raw source (no stripping)
            try {
                const tree = parser.parse(raw);
                const fileStructs = [];
                collectStructs(tree.rootNode, [], fileStructs);
                for (const s of fileStructs) {
                    allStructs.push({ ...s, file: path.basename(filePath) });
                }
                failedFiles.pop(); // retry succeeded
            } catch (_) {
                // both full-file parses failed; try block extraction
                const nsMap = buildNamespaceMap(raw);
                const blocks = extractStructBlocks(raw);
                let fallbackOk = 0;
                for (const block of blocks) {
                    try {
                        const blockTree = parser.parse(block.block);
                        const blockStructs = [];
                        collectStructs(blockTree.rootNode, [], blockStructs);
                        // Apply namespace context from the original file
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
                if (fallbackOk > 0) {
                    failedFiles.pop(); // fallback recovered some structs
                }
            }
        }
    }

    if (failedFiles.length > 0) {
        console.warn(`[gen-sevalue] WARNING: ${failedFiles.length} file(s) failed to parse:`);
        for (const f of failedFiles) {
            console.warn(`  - ${f}`);
        }
    }

    console.log(`[gen-sevalue] Found ${allStructs.length} struct(s) total`);

    // Filter: skip blacklisted, skip non-agora namespaces, skip template specializations
    const candidates = allStructs.filter((s) => {
        if (SKIP_STRUCTS.has(s.name)) return false;
        // Skip template specializations (contain '<' in the name)
        if (s.name.includes('<')) return false;
        // Must be in agora::rtc namespace (or global for bridge types)
        const ns = s.namespace.join("::");
        if (ns !== "agora::rtc" && ns !== "agora" && ns !== "") return false;
        return true;
    });

    console.log(`[gen-sevalue] ${candidates.length} struct(s) after filtering`);

    // Deduplicate: keep the entry with the most fields (forward decl has 0 fields)
    const deduped = new Map();
    for (const s of candidates) {
        const fullName = s.namespace.join("::") + "::" + s.name;
        const existing = deduped.get(fullName);
        if (!existing || s.fields.length > existing.fields.length) {
            deduped.set(fullName, s);
        }
    }
    const unique = [...deduped.values()];
    const dupCount = candidates.length - unique.length;
    if (dupCount > 0) {
        console.log(`[gen-sevalue] ${dupCount} duplicate(s) removed (forward decl vs definition)`);
    }

    // Read existing files
    const existingH = fs.readFileSync(OUTPUT_H, "utf8");
    const existingCpp = fs.readFileSync(OUTPUT_CPP, "utf8");

    const hParts = splitAtMarkers(existingH, MARKER_DECL_START, MARKER_DECL_END);
    const cppParts = splitAtMarkers(existingCpp, MARKER_IMPL_START, MARKER_IMPL_END);

    const { protectedStructs } = parseExistingImpls(cppParts.middle);
    const userBlockH = extractUserBlock(hParts.middle);
    const userBlockCpp = extractUserBlock(cppParts.middle);

    // Generate
    const newDecls = [];
    const newImpls = [];
    let skipped = 0;
    let overwritten = 0;
    let added = 0;

    for (const s of unique) {
        const fullName = s.namespace.length > 0
            ? s.namespace.join("::") + "::" + s.name
            : s.name;

        if (protectedStructs.has(fullName)) {
            skipped++;
            continue;
        }

        // Check if already exists (will be overwritten)
        const declLine = generateDeclaration(fullName);
        const existingDeclIdx = hParts.middle.indexOf(declLine);
        const existingImplIdx = cppParts.middle.indexOf(`bool sevalue_to_native(const se::Value &from, ${fullName} *to`);

        if (existingImplIdx !== -1) {
            overwritten++;
        } else {
            added++;
        }

        newDecls.push(declLine);
        newImpls.push(generateFunction(s.name, fullName, s.fields));
        newImpls.push("");
    }

    const exampleComment = [
        `// ─────────────────────────────────────────────────────────────────────────────`,
        `// This file is AUTO-GENERATED by scripts/generate-sevalue-to-native.js.`,
        `//`,
        `// To prevent a specific function from being overwritten on regeneration, add`,
        `// the line below immediately above it:`,
        `//`,
        `//   // do not gen code cover it`,
        `//   bool sevalue_to_native(const se::Value &from, YourStruct *to, se::Object *ctx) { ... }`,
        `//`,
        `// Custom code between ${USER_BLOCK_START} and ${USER_BLOCK_END} is preserved.`,
        `// ─────────────────────────────────────────────────────────────────────────────`,
        ``,
    ].join("\n");

    // Write .h
    const newH =
        hParts.before + "\n" + exampleComment + newDecls.join("\n") + "\n" + USER_BLOCK_START + "\n" + userBlockH +
        USER_BLOCK_END + "\n" + hParts.after;
    fs.writeFileSync(OUTPUT_H, newH, "utf8");

    // Write .cpp
    const newCpp =
        cppParts.before + "\n" + exampleComment + newImpls.join("\n") + USER_BLOCK_START + "\n" + userBlockCpp +
        USER_BLOCK_END + "\n" + cppParts.after;
    fs.writeFileSync(OUTPUT_CPP, newCpp, "utf8");

    // Format generated files
    const { spawnSync } = require("child_process");
    for (const f of [OUTPUT_H, OUTPUT_CPP]) {
        try { spawnSync("clang-format", ["-i", f], { stdio: "ignore" }); } catch (_) {}
    }

    console.log(`[gen-sevalue] Done: ${added} added, ${overwritten} overwritten, ${skipped} skipped (protected)`);
    console.log(`[gen-sevalue] Output: ${OUTPUT_H}`);
    console.log(`[gen-sevalue] Output: ${OUTPUT_CPP}`);
}

main();
