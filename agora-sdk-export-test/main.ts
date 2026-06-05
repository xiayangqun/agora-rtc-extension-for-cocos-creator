// ============================================================
// Agora SDK 类型导出检测脚本
// 检测 agora-rtc-sdk-ng 主包(UMD) 和 /esm 子路径 的实际运行时导出
// 与 .d.ts 声称的导出进行对比
// ============================================================

interface CheckResult {
    name: string;
    value: unknown;
    type: string;
}

async function runTest() {
    const out = document.getElementById("output")!;
    out.textContent = "加载模块中，请稍候...\n\n";

    // ---- 1. 加载两个入口 ----
    let mainModule: Record<string, unknown> = {};
    let esmModule: Record<string, unknown> = {};
    let mainError = "";
    let esmError = "";

    try {
        mainModule = await import("agora-rtc-sdk-ng");
    } catch (e: any) {
        mainError = e.message;
    }

    try {
        esmModule = await import("agora-rtc-sdk-ng/esm");
    } catch (e: any) {
        esmError = e.message;
    }

    // ---- 2. .d.ts 声称的所有 export 标识符（从 rtc-sdk_cn.d.ts 提取） ----
    // 这些是在 .d.ts 中显式 export 的标识符
    const dtsExportedNames = [
        // default
        "default",
        // 10 个 enum
        "AgoraRTCErrorCode",
        "AREAS",
        "AudienceLatencyLevelType",
        "ChannelMediaRelayError",
        "ChannelMediaRelayEvent",
        "ChannelMediaRelayState",
        "ConnectionDisconnectedReason",
        "RemoteStreamFallbackType",
        "RemoteStreamType",
        "VideoState",
        // 15 个 type（编译时擦除，运行时不会是值）
        "AudioEncoderConfigurationPreset",
        "AudioSourceState",
        "ClientRole",
        "ConnectionState",
        "DeviceState",
        "EncryptionMode",
        "LocalAccessPointConfig",
        "ScreenEncoderConfigurationPreset",
        "ScreenSourceType",
        "SDK_AUDIO_CODEC",
        "SDK_CODEC",
        "SDK_MODE",
        "SVCConfigurationPreset",
        "UID",
        "VideoEncoderConfigurationPreset",
        // 53 个 interface（编译时擦除）
        "AgoraRTCStats",
        "AudioEncoderConfiguration",
        "AudioSourceOptions",
        "BeautyEffectOptions",
        "BufferSourceAudioTrackInitConfig",
        "CameraVideoTrackInitConfig",
        "ChannelMediaRelayInfo",
        "ClientConfig",
        "ClientRoleOptions",
        "ConstrainLong",
        "CustomAudioTrackInitConfig",
        "CustomVideoTrackInitConfig",
        "DeviceInfo",
        "ElectronDesktopCapturerSource",
        "EventCustomReportParams",
        "IAgoraRTC",
        "IAgoraRTCClient",
        "IAgoraRTCError",
        "IAgoraRTCRemoteUser",
        "IBufferSourceAudioTrack",
        "ICameraVideoTrack",
        "IChannelMediaRelayConfiguration",
        "IDataChannel",
        "IDataChannelConfig",
        "IJoinOptions",
        "ILocalAudioTrack",
        "ILocalDataChannel",
        "ILocalTrack",
        "ILocalVideoTrack",
        "ImageTypedData",
        "IMicrophoneAudioTrack",
        "InspectConfiguration",
        "IRemoteAudioTrack",
        "IRemoteDataChannel",
        "IRemoteTrack",
        "IRemoteVideoTrack",
        "ITrack",
        "LastmileProbeResult",
        "LiveStreamingTranscodingConfig",
        "LiveStreamingTranscodingImage",
        "LiveStreamingTranscodingUser",
        "LocalAudioTrackStats",
        "LocalVideoTrackStats",
        "LowStreamParameter",
        "MicrophoneAudioTrackInitConfig",
        "NetworkQuality",
        "RemoteAudioTrackStats",
        "RemoteVideoTrackStats",
        "ScreenVideoTrackInitConfig",
        "SVCConfiguration",
        "TurnServerConfig",
        "VideoEncoderConfiguration",
        "VideoPlayerConfig",
    ];

    // 重点关注：有运行时值的 enum
    const enumNames = [
        "AgoraRTCErrorCode",
        "AREAS",
        "AudienceLatencyLevelType",
        "ChannelMediaRelayError",
        "ChannelMediaRelayEvent",
        "ChannelMediaRelayState",
        "ConnectionDisconnectedReason",
        "RemoteStreamFallbackType",
        "RemoteStreamType",
        "VideoState",
    ];

    // ---- 3. 对比两个模块的所有命名导出 ----
    function analyzeModule(name: string, mod: Record<string, unknown>, error: string) {
        const lines: string[] = [];
        lines.push(`========================================`);
        lines.push(`📦 ${name}`);
        lines.push(`========================================`);

        if (error) {
            lines.push(`❌ 导入失败: ${error}\n`);
            return lines.join("\n");
        }

        const keys = Object.keys(mod);
        lines.push(`共 ${keys.length} 个命名导出:`);
        lines.push(keys.map((k) => `  • ${k}`).join("\n"));
        lines.push("");

        // 检查 enum
        lines.push("--- enum 检测结果 ---");
        for (const enumName of enumNames) {
            const val = mod[enumName];
            if (val === undefined) {
                lines.push(`❌ ${enumName}: undefined`);
            } else {
                const type = typeof val;
                const isObj = type === "object" && val !== null;
                const keys = isObj ? Object.keys(val as object).length : 0;
                lines.push(`✅ ${enumName}: ${type}${isObj ? ` (${keys} 个成员)` : ""}`);
            }
        }
        lines.push("");

        // 检查 default
        const def = mod.default;
        lines.push(`--- default 导出 ---`);
        lines.push(`类型: ${typeof def}`);
        if (def && typeof def === "object") {
            const defKeys = Object.keys(def);
            lines.push(`default 对象上的属性数: ${defKeys.length}`);
            // 检查 default 上是否有 enum
            for (const enumName of enumNames) {
                const val = (def as Record<string, unknown>)[enumName];
                if (val !== undefined) {
                    lines.push(`  ⚠️ default.${enumName} 存在 (${typeof val})`);
                }
            }
        }
        lines.push("");

        return lines.join("\n");
    }

    const mainReport = analyzeModule("agora-rtc-sdk-ng (主包 UMD)", mainModule, mainError);
    const esmReport = analyzeModule("agora-rtc-sdk-ng/esm (ESM 构建)", esmModule, esmError);

    // ---- 4. 跨模块对比 ----
    const compareLines: string[] = [];
    compareLines.push(`========================================`);
    compareLines.push(`🔍 跨模块 enum 对比`);
    compareLines.push(`========================================`);
    for (const enumName of enumNames) {
        const mainVal = mainModule[enumName];
        const esmVal = esmModule[enumName];
        const mainHas = mainVal !== undefined;
        const esmHas = esmVal !== undefined;
        if (mainHas && esmHas) {
            compareLines.push(`✅ ${enumName}: 两个模块都存在`);
        } else if (mainHas && !esmHas) {
            compareLines.push(`⚠️ ${enumName}: 仅主包存在，ESM 缺失`);
        } else if (!mainHas && esmHas) {
            compareLines.push(`⚠️ ${enumName}: 仅 ESM 存在，主包缺失`);
        } else {
            compareLines.push(`❌ ${enumName}: 两个模块都缺失`);
        }
    }

    // ---- 5. 输出结果 ----
    out.textContent = mainReport + "\n" + esmReport + "\n" + compareLines.join("\n") + "\n";
}

document.getElementById("testBtn")!.addEventListener("click", runTest);
