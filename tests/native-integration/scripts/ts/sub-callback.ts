/**
 * Sub-Observer Callback Tests
 *
 * Tests that callbacks on sub-objects (MediaRecorderObserver, MediaPlayerSourceObserver,
 * H265TranscoderObserver, MusicContentCenterEventHandler) are properly delivered
 * from C++ mock to JS.
 *
 * Uses fixed values from C++ layer (not passed from JS).
 *
 * Fixed value rules:
 *   string -> "agora"
 *   number (generic) -> 2
 *   bool -> true
 *   enum -> actual enum value
 *   struct -> recursively apply same rules
 */

import { IRtcEngineEx } from "agora-rtc/interface/IRtcEngineEx";
import { TestRunner, TestCase } from "./test-framework";
import { IRtcEngineEventHandler } from "agora-rtc/interface/IRtcEngineEventHandler";
import { IMediaPlayer } from "agora-rtc/interface/IMediaPlayer";
import { IH265Transcoder } from "agora-rtc/interface/IH265Transcoder";
import { IMusicContentCenter } from "agora-rtc/interface/IMusicContentCenter";
import { IMediaRecorder } from "agora-rtc/interface/IMediaRecorder";
import { CHANNEL_PROFILE_TYPE } from "agora-rtc/types/AgoraBase";

class RtcEngineEventHandler extends IRtcEngineEventHandler {}

export class SubCallbackTestSuite extends TestCase {
    private bridge!: IRtcEngineEx;
    private result: any = null;

    constructor() {
        super("SubCallbackTestSuite");
    }

    async run(runner: TestRunner): Promise<void> {
        runner.log("\n=== Running Sub-Observer Callback Tests ===\n");

        // MediaRecorderObserver callbacks
        await this.testOnRecorderStateChanged(runner);
        await this.testOnRecorderInfoUpdated(runner);

        // MediaPlayerSourceObserver callbacks
        await this.testOnPlayerSourceStateChanged(runner);
        await this.testOnPositionChanged(runner);
        await this.testOnPlayerEvent(runner);
        await this.testOnMetaData(runner);
        await this.testOnPlayBufferUpdated(runner);
        await this.testOnPreloadEvent(runner);
        await this.testOnCompleted(runner);
        await this.testOnAgoraCDNTokenWillExpire(runner);
        await this.testOnPlayerSrcInfoChanged(runner);
        await this.testOnPlayerInfoUpdated(runner);
        await this.testOnPlayerCacheStats(runner);
        await this.testOnPlayerPlaybackStats(runner);
        await this.testOnAudioVolumeIndication(runner);

        // H265TranscoderObserver callbacks
        await this.testOnEnableTranscode(runner);
        await this.testOnQueryChannel(runner);
        await this.testOnTriggerTranscode(runner);

        // MusicContentCenterEventHandler callbacks
        await this.testOnMusicChartsResult(runner);
        await this.testOnMusicCollectionResult(runner);
        await this.testOnLyricResult(runner);
        await this.testOnSongSimpleInfoResult(runner);
        await this.testOnPreLoadEvent(runner);
    }

    // ──────────────────────────── Helpers ────────────────────────────

    private setup(): void {
        (jsb as any).agora.test.reset();
        this.result = null;
        this.bridge = new (jsb as any).agora.RtcEngineExBridge() as IRtcEngineEx;
        this.bridge.initialize({
            eventHandler: new RtcEngineEventHandler(),
            appId: "test",
            context: 0,
            channelProfile: CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_CLOUD_GAMING,
            license: "license",
            audioScenario: 8,
            areaCode: 0x00000001,
            logConfig: {
                filePath: "filePath",
                fileSizeInKB: 1024,
                level: 4,
            },
            useExternalEglContext: false,
            domainLimit: false,
            autoRegisterAgoraExtensions: false,
        });
    }

    private cleanup(): void {
        this.bridge.release(true);
        this.result = null;
    }

    private valuesEqual(actual: any, expected: any): boolean {
        if (actual === expected) return true;
        if (typeof expected === "number") return Number(actual) === expected;
        if (actual instanceof Uint8Array && expected instanceof Uint8Array) {
            if (actual.length !== expected.length) return false;
            for (let i = 0; i < actual.length; i++) {
                if (actual[i] !== expected[i]) return false;
            }
            return true;
        }
        if (Array.isArray(expected)) {
            if (!Array.isArray(actual)) return false;
            if (actual.length !== expected.length) return false;
            for (let i = 0; i < expected.length; i++) {
                if (!this.valuesEqual(actual[i], expected[i])) return false;
            }
            return true;
        }
        if (expected !== null && typeof expected === "object") {
            if (actual === null || typeof actual !== "object") return false;
            const keys = Object.keys(expected);
            for (let i = 0; i < keys.length; i++) {
                if (!this.valuesEqual(actual[keys[i]], expected[keys[i]])) return false;
            }
            return true;
        }
        return false;
    }

    private async runObserverCallbackTest(
        runner: TestRunner,
        testName: string,
        setupObserver: (observer: any) => Promise<void>,
        triggerName: string,
        captureCallback: string,
        paramNames: string[],
        expectedValues?: Record<string, any>,
        teardownObserver?: () => Promise<void>,
    ): Promise<void> {
        runner.log("\n--- Test: " + testName + " ---");

        this.setup();
        const capturedParams = paramNames;

        // Create observer object with the callback to capture
        const observer: any = {};
        observer[captureCallback] = (...args: any[]) => {
            this.result = {};
            capturedParams.forEach((name: string, i: number) => {
                this.result[name] = args[i];
            });
        };

        // Setup the observer on the appropriate object
        await setupObserver(observer);

        // Trigger the callback from C++
        (jsb as any).agora.test[triggerName]();
        await this.delay(0);

        runner.assert(this.result !== null, captureCallback + " callback should have been called");
        if (this.result === null) {
            if (teardownObserver) {
                await teardownObserver();
            }
            this.cleanup();
            return;
        }

        if (expectedValues) {
            const keys = Object.keys(expectedValues);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const expected = expectedValues[key];
                if (expected === "object") {
                    runner.assert(
                        this.result[key] !== null && typeof this.result[key] === "object",
                        key + " should be a non-null object",
                    );
                } else if (expected === "array") {
                    runner.assert(Array.isArray(this.result[key]), key + " should be an array");
                } else {
                    runner.assert(
                        this.valuesEqual(this.result[key], expected),
                        "Expected " + key + " " + expected + ", got " + this.result[key],
                    );
                }
            }
        }

        // Teardown observer (unregister)
        if (teardownObserver) {
            await teardownObserver();
        }
        this.cleanup();
    }

    // =========================================================================
    // MediaRecorderObserver callbacks
    // =========================================================================

    private async testOnRecorderStateChanged(runner: TestRunner): Promise<void> {
        let recorder: IMediaRecorder | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnRecorderStateChanged",
            async (observer) => {
                recorder = await this.bridge.createMediaRecorder({
                    channelId: "test-channel",
                    uid: 0,
                    type: 0,
                });
                if (recorder) {
                    await recorder.setMediaRecorderObserver(observer);
                }
            },
            "triggerOnRecorderStateChanged",
            "onRecorderStateChanged",
            ["channelId", "uid", "state", "reason"],
            { channelId: "agora", uid: 2, state: 2, reason: 0 },
            async () => {
                if (recorder) {
                    await this.bridge.destroyMediaRecorder(recorder);
                    recorder = null;
                }
            },
        );
    }

    private async testOnRecorderInfoUpdated(runner: TestRunner): Promise<void> {
        let recorder: IMediaRecorder | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnRecorderInfoUpdated",
            async (observer) => {
                recorder = await this.bridge.createMediaRecorder({
                    channelId: "test-channel",
                    uid: 0,
                    type: 0,
                });
                if (recorder) {
                    await recorder.setMediaRecorderObserver(observer);
                }
            },
            "triggerOnRecorderInfoUpdated",
            "onRecorderInfoUpdated",
            ["channelId", "uid", "info"],
            { channelId: "agora", uid: 2, info: "object" },
            async () => {
                if (recorder) {
                    await this.bridge.destroyMediaRecorder(recorder);
                    recorder = null;
                }
            },
        );
    }

    // =========================================================================
    // MediaPlayerSourceObserver callbacks
    // =========================================================================

    private async testOnPlayerSourceStateChanged(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayerSourceStateChanged",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayerSourceStateChanged",
            "onPlayerSourceStateChanged",
            ["state", "reason"],
            { state: 0, reason: 0 },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPositionChanged(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPositionChanged",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPositionChanged",
            "onPositionChanged",
            ["positionMs", "timestampMs"],
            { positionMs: 2, timestampMs: 2 },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPlayerEvent(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayerEvent",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayerEvent",
            "onPlayerEvent",
            ["eventCode", "elapsedTime", "message"],
            { eventCode: 0, elapsedTime: 2, message: "agora" },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnMetaData(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnMetaData",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnMetaData",
            "onMetaData",
            ["data", "length"],
            { data: "object", length: 2 },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPlayBufferUpdated(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayBufferUpdated",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayBufferUpdated",
            "onPlayBufferUpdated",
            ["playCachedBuffer"],
            { playCachedBuffer: 2 },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPreloadEvent(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPreloadEvent",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPreloadEvent",
            "onPreloadEvent",
            ["src", "event"],
            { src: "agora", event: 0 },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnCompleted(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnCompleted",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnCompleted",
            "onCompleted",
            [],
            {},
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnAgoraCDNTokenWillExpire(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnAgoraCDNTokenWillExpire",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnAgoraCDNTokenWillExpire",
            "onAgoraCDNTokenWillExpire",
            [],
            {},
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPlayerSrcInfoChanged(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayerSrcInfoChanged",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayerSrcInfoChanged",
            "onPlayerSrcInfoChanged",
            ["from", "to"],
            { from: "object", to: "object" },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPlayerInfoUpdated(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayerInfoUpdated",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayerInfoUpdated",
            "onPlayerInfoUpdated",
            ["info"],
            { info: "object" },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPlayerCacheStats(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayerCacheStats",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayerCacheStats",
            "onPlayerCacheStats",
            ["stats"],
            { stats: "object" },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnPlayerPlaybackStats(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPlayerPlaybackStats",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnPlayerPlaybackStats",
            "onPlayerPlaybackStats",
            ["stats"],
            { stats: "object" },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    private async testOnAudioVolumeIndication(runner: TestRunner): Promise<void> {
        let player: IMediaPlayer | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnAudioVolumeIndication",
            async (observer) => {
                player = await this.bridge.createMediaPlayer();
                if (player) {
                    await player.registerPlayerSourceObserver(observer);
                }
            },
            "triggerOnAudioVolumeIndication",
            "onAudioVolumeIndication",
            ["volume"],
            { volume: 2 },
            async () => {
                if (player) {
                    await this.bridge.destroyMediaPlayer(player);
                    player = null;
                }
            },
        );
    }

    // =========================================================================
    // H265TranscoderObserver callbacks
    // =========================================================================

    private async testOnEnableTranscode(runner: TestRunner): Promise<void> {
        let transcoder: IH265Transcoder | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnEnableTranscode",
            async (observer) => {
                transcoder = await this.bridge.getH265Transcoder();
                if (transcoder) {
                    await transcoder.registerTranscoderObserver(observer);
                }
            },
            "triggerOnEnableTranscode",
            "onEnableTranscode",
            ["result"],
            { result: 0 },
            async () => {
                if (transcoder) {
                    await transcoder.unregisterTranscoderObserver();
                    transcoder = null;
                }
            },
        );
    }

    private async testOnQueryChannel(runner: TestRunner): Promise<void> {
        let transcoder: IH265Transcoder | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnQueryChannel",
            async (observer) => {
                transcoder = await this.bridge.getH265Transcoder();
                if (transcoder) {
                    await transcoder.registerTranscoderObserver(observer);
                }
            },
            "triggerOnQueryChannel",
            "onQueryChannel",
            ["result", "originChannel", "transcodeChannel"],
            { result: 0, originChannel: "agora", transcodeChannel: "agora" },
            async () => {
                if (transcoder) {
                    await transcoder.unregisterTranscoderObserver();
                    transcoder = null;
                }
            },
        );
    }

    private async testOnTriggerTranscode(runner: TestRunner): Promise<void> {
        let transcoder: IH265Transcoder | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnTriggerTranscode",
            async (observer) => {
                transcoder = await this.bridge.getH265Transcoder();
                if (transcoder) {
                    await transcoder.registerTranscoderObserver(observer);
                }
            },
            "triggerOnTriggerTranscode",
            "onTriggerTranscode",
            ["result"],
            { result: 0 },
            async () => {
                if (transcoder) {
                    await transcoder.unregisterTranscoderObserver();
                    transcoder = null;
                }
            },
        );
    }

    // =========================================================================
    // MusicContentCenterEventHandler callbacks
    // =========================================================================

    private async testOnMusicChartsResult(runner: TestRunner): Promise<void> {
        let mcc: IMusicContentCenter | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnMusicChartsResult",
            async (observer) => {
                mcc = await this.bridge.getMusicContentCenter();
                if (mcc) {
                    await mcc.registerEventHandler(observer);
                }
            },
            "triggerOnMusicChartsResult",
            "onMusicChartsResult",
            ["requestId", "result", "reason"],
            { requestId: "agora", result: [{ chartName: "test-chart", id: 2 }], reason: 0 },
            async () => {
                if (mcc) {
                    await mcc.unregisterEventHandler();
                    mcc = null;
                }
            },
        );
    }

    private async testOnMusicCollectionResult(runner: TestRunner): Promise<void> {
        let mcc: IMusicContentCenter | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnMusicCollectionResult",
            async (observer) => {
                mcc = await this.bridge.getMusicContentCenter();
                if (mcc) {
                    await mcc.registerEventHandler(observer);
                }
            },
            "triggerOnMusicCollectionResult",
            "onMusicCollectionResult",
            ["requestId", "result", "reason"],
            {
                requestId: "agora",
                result: {
                    count: 1,
                    total: 2,
                    page: 2,
                    pageSize: 2,
                    musics: [
                        {
                            songCode: 2,
                            name: "test-song",
                            singer: "test-singer",
                            poster: "test-poster",
                            releaseTime: "test-releaseTime",
                            durationS: 2,
                            type: 2,
                            pitchType: 2,
                        },
                    ],
                },
                reason: 0,
            },
            async () => {
                if (mcc) {
                    await mcc.unregisterEventHandler();
                    mcc = null;
                }
            },
        );
    }

    private async testOnLyricResult(runner: TestRunner): Promise<void> {
        let mcc: IMusicContentCenter | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnLyricResult",
            async (observer) => {
                mcc = await this.bridge.getMusicContentCenter();
                if (mcc) {
                    await mcc.registerEventHandler(observer);
                }
            },
            "triggerOnLyricResult",
            "onLyricResult",
            ["requestId", "songCode", "lyricUrl", "reason"],
            { requestId: "agora", songCode: 2, lyricUrl: "agora", reason: 0 },
            async () => {
                if (mcc) {
                    await mcc.unregisterEventHandler();
                    mcc = null;
                }
            },
        );
    }

    private async testOnSongSimpleInfoResult(runner: TestRunner): Promise<void> {
        let mcc: IMusicContentCenter | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnSongSimpleInfoResult",
            async (observer) => {
                mcc = await this.bridge.getMusicContentCenter();
                if (mcc) {
                    await mcc.registerEventHandler(observer);
                }
            },
            "triggerOnSongSimpleInfoResult",
            "onSongSimpleInfoResult",
            ["requestId", "songCode", "simpleInfo", "reason"],
            { requestId: "agora", songCode: 2, simpleInfo: "agora", reason: 0 },
            async () => {
                if (mcc) {
                    await mcc.unregisterEventHandler();
                    mcc = null;
                }
            },
        );
    }

    private async testOnPreLoadEvent(runner: TestRunner): Promise<void> {
        let mcc: IMusicContentCenter | null = null;
        await this.runObserverCallbackTest(
            runner,
            "OnPreLoadEvent",
            async (observer) => {
                mcc = await this.bridge.getMusicContentCenter();
                if (mcc) {
                    await mcc.registerEventHandler(observer);
                }
            },
            "triggerOnPreLoadEvent",
            "onPreLoadEvent",
            ["requestId", "songCode", "percent", "lyricUrl", "state", "reason"],
            { requestId: "agora", songCode: 2, percent: 2, lyricUrl: "agora", state: 0, reason: 0 },
            async () => {
                if (mcc) {
                    await mcc.unregisterEventHandler();
                    mcc = null;
                }
            },
        );
    }
}
