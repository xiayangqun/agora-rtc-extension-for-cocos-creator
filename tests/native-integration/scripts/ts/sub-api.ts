/**
 * Sub-API Tests (Derived Bridge Objects)
 *
 * Tests that methods on IMediaPlayer, IAudioDeviceManager, IVideoDeviceManager,
 * IH265Transcoder, ILocalSpatialAudioEngine, IMusicContentCenter,
 * IMediaPlayerCacheManager, IVideoEffectObject, IScreenCaptureSourceList,
 * IAudioDeviceCollection, IVideoDeviceCollection are properly forwarded
 * from JS to C++ mock via log-based verification.
 */

import { TestRunner, TestCase } from "./test-framework";
import { IRtcEngineEx } from "agora-rtc/interface/IRtcEngineEx";
import { IRtcEngineEventHandler } from "agora-rtc/interface/IRtcEngineEventHandler";
import { IMediaPlayer } from "agora-rtc/interface/IMediaPlayer";
import { IAudioDeviceManager } from "agora-rtc/interface/IAudioDeviceManager";
import { IVideoDeviceManager } from "agora-rtc/interface/IVideoDeviceManager";
import { IH265Transcoder } from "agora-rtc/interface/IH265Transcoder";
import { ILocalSpatialAudioEngine } from "agora-rtc/interface/ILocalSpatialAudioEngine";
import { IMusicContentCenter } from "agora-rtc/interface/IMusicContentCenter";
import { IMediaPlayerCacheManager } from "agora-rtc/interface/IMediaPlayerCacheManager";
import { IVideoEffectObject } from "agora-rtc/interface/IVideoEffectObject";
import { IAudioDeviceCollection } from "agora-rtc/interface/IAudioDeviceCollection";
import { IVideoDeviceCollection } from "agora-rtc/interface/IVideoDeviceCollection";
import { IMediaRecorder } from "agora-rtc/interface/IMediaRecorder";
import { IMusicPlayer } from "agora-rtc/interface/IMusicPlayer";
import { IScreenCaptureSourceList } from "agora-rtc/interface/IScreenCaptureSourceList";
import { CHANNEL_PROFILE_TYPE } from "agora-rtc/types/AgoraBase";
import { VIDEO_EFFECT_ACTION } from "agora-rtc/types/AgoraRtcEngine";

interface LogEntry {
    ts: number;
    fn: string;
    params: Record<string, any>;
}

class RtcEngineEventHandler extends IRtcEngineEventHandler {}

export class SubApiTestSuite extends TestCase {
    private static readonly LOG_TIME_TOLERANCE = 100;

    constructor() {
        super("SubApiTestSuite");
    }

    async run(runner: TestRunner): Promise<void> {
        runner.log("\n=== Running Sub-API Tests ===");

        await this.testMediaPlayer(runner);
        await this.testAudioDeviceManager(runner);
        await this.testVideoDeviceManager(runner);
        await this.testH265Transcoder(runner);
        await this.testLocalSpatialAudioEngine(runner);
        await this.testMusicContentCenter(runner);
        await this.testMediaPlayerCacheManager(runner);
        await this.testVideoEffectObject(runner);
        await this.testAudioDeviceCollection(runner);
        await this.testVideoDeviceCollection(runner);
        await this.testMediaRecorder(runner);
        await this.testMusicPlayer(runner);
        await this.testScreenCaptureSourceList(runner);
    }

    // ──────────────────────────── Helpers ────────────────────────────

    private createBridgeAndInit(): IRtcEngineEx {
        let rtcEngine = new (jsb as any).agora.RtcEngineExBridge() as IRtcEngineEx;
        rtcEngine.initialize({
            eventHandler: new RtcEngineEventHandler(),
            appId: "agora",
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
        return rtcEngine;
    }

    private assertLogEntry(
        runner: TestRunner,
        fnName: string,
        callTime: number,
        expectedParams: Record<string, any>,
    ): void {
        const logStr: string = (jsb as any).agora.test.readLog();
        const logArray: LogEntry[] = JSON.parse(logStr);
        const entry = this.findLogEntry(logArray, fnName, callTime);

        runner.assert(entry !== null, "Log entry not found for " + fnName + " near " + callTime);

        if (!entry) return;

        for (const key in expectedParams) {
            if (expectedParams.hasOwnProperty(key)) {
                const actual = (entry.params as any)[key];
                const expected = expectedParams[key];
                runner.assert(
                    this.valuesEqual(actual, expected),
                    fnName + "." + key + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual),
                );
            }
        }
    }

    private valuesEqual(actual: any, expected: any): boolean {
        if (actual === expected) return true;
        if (typeof actual === "number" && typeof expected === "number") return actual === expected;
        if (actual && expected && typeof actual === "object" && typeof expected === "object") {
            return JSON.stringify(actual) === JSON.stringify(expected);
        }
        return false;
    }

    private findLogEntry(logArray: LogEntry[], fnName: string, callTime: number): LogEntry | null {
        let best: LogEntry | null = null;
        let bestDelta = Number.MAX_VALUE;
        for (const entry of logArray) {
            const delta = Math.abs(entry.ts - callTime);
            if (entry.fn === fnName && delta <= SubApiTestSuite.LOG_TIME_TOLERANCE && delta < bestDelta) {
                best = entry;
                bestDelta = delta;
            }
        }
        return best;
    }

    // ──────────────────────────── IMediaPlayer (order matches IMediaPlayer.ts) ────────────────────────────

    private async testMediaPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MediaPlayer ---");
        const bridge = this.createBridgeAndInit();

        const player: IMediaPlayer = await bridge.createMediaPlayer();
        runner.assert(player !== null, "createMediaPlayer should return non-null");

        // 1. getId
        const callTime1 = Date.now();
        const id = await player.getId();
        this.assertLogEntry(runner, "getId", callTime1, {});
        runner.assert(id === 1, "getId should return 1 (first player), got " + id);

        // 2. registerPlayerSourceObserver not need ut
        // const callTime2 = Date.now();
        // await player.registerPlayerSourceObserver({} as any);
        // this.assertLogEntry(runner, "registerPlayerSourceObserver", callTime2, {});

        // 3. open
        const callTime3 = Date.now();
        const openResult = await player.open("https://example.com/video.mp4", 0);
        this.assertLogEntry(runner, "open", callTime3, {
            url: "https://example.com/video.mp4",
            startPos: 0,
        });
        runner.assert(openResult === 0, "open should return 0, got " + openResult);

        // 4. openWithMediaSource
        const callTime4 = Date.now();
        const openWithMediaSourceResult = await player.openWithMediaSource({
            url: "https://example.com/source.mp4",
            uri: "https://example.com/source.mp4",
            startPos: 0,
            autoPlay: false,
            enableCache: false,
            enableMultiAudioTrack: false,
        });
        this.assertLogEntry(runner, "openWithMediaSource", callTime4, {
            url: "https://example.com/source.mp4",
            uri: "https://example.com/source.mp4",
            startPos: 0,
            autoPlay: false,
            enableCache: false,
            enableMultiAudioTrack: false,
        });
        runner.assert(
            openWithMediaSourceResult === 0,
            "openWithMediaSource should return 0, got " + openWithMediaSourceResult,
        );

        // 5. play
        const callTime5 = Date.now();
        const playResult = await player.play();
        this.assertLogEntry(runner, "play", callTime5, {});
        runner.assert(playResult === 0, "play should return 0, got " + playResult);

        // 6. pause
        const callTime6 = Date.now();
        const pauseResult = await player.pause();
        this.assertLogEntry(runner, "pause", callTime6, {});
        runner.assert(pauseResult === 0, "pause should return 0, got " + pauseResult);

        // 7. stop
        const callTime7 = Date.now();
        const stopResult = await player.stop();
        this.assertLogEntry(runner, "stop", callTime7, {});
        runner.assert(stopResult === 0, "stop should return 0, got " + stopResult);

        // 8. resume
        const callTime8 = Date.now();
        const resumeResult = await player.resume();
        this.assertLogEntry(runner, "resume", callTime8, {});
        runner.assert(resumeResult === 0, "resume should return 0, got " + resumeResult);

        // 9. seek
        const callTime9 = Date.now();
        const seekResult = await player.seek(5000);
        this.assertLogEntry(runner, "seek", callTime9, { newPos: 5000 });
        runner.assert(seekResult === 0, "seek should return 0, got " + seekResult);

        // 10. setAudioPitch
        const callTime10 = Date.now();
        const setAudioPitchResult = await player.setAudioPitch(2);
        this.assertLogEntry(runner, "setAudioPitch", callTime10, { pitch: 2 });
        runner.assert(setAudioPitchResult === 0, "setAudioPitch should return 0, got " + setAudioPitchResult);

        // 11. getDuration
        const callTime11 = Date.now();
        const durationResult = await player.getDuration();
        this.assertLogEntry(runner, "getDuration", callTime11, {});
        runner.assert(typeof durationResult.duration === "number", "getDuration.duration should be number, not bigint");
        runner.assert(
            durationResult.errorCode === 0,
            "getDuration.errorCode should be 0, got " + durationResult.errorCode,
        );
        runner.assert(
            durationResult.duration === 0,
            "getDuration.duration should be 0, got " + durationResult.duration,
        );

        // 12. getPlayPosition
        const callTime12 = Date.now();
        const playPosResult = await player.getPlayPosition();
        this.assertLogEntry(runner, "getPlayPosition", callTime12, {});
        runner.assert(typeof playPosResult.pos === "number", "getPlayPosition.pos should be number, not bigint");
        runner.assert(
            playPosResult.errorCode === 0,
            "getPlayPosition.errorCode should be 0, got " + playPosResult.errorCode,
        );
        runner.assert(playPosResult.pos === 0, "getPlayPosition.pos should be 0, got " + playPosResult.pos);

        // 13. getStreamCount
        const callTime13 = Date.now();
        const streamCountResult = await player.getStreamCount();
        this.assertLogEntry(runner, "getStreamCount", callTime13, {});
        runner.assert(typeof streamCountResult.count === "number", "getStreamCount.count should be number, not bigint");
        runner.assert(
            streamCountResult.errorCode === 0,
            "getStreamCount.errorCode should be 0, got " + streamCountResult.errorCode,
        );
        runner.assert(
            streamCountResult.count === 0,
            "getStreamCount.count should be 0, got " + streamCountResult.count,
        );

        // 14. getStreamInfo
        const callTime14 = Date.now();
        const getStreamInfoResult = await player.getStreamInfo(0);
        this.assertLogEntry(runner, "getStreamInfo", callTime14, { index: 0 });
        runner.assert(
            getStreamInfoResult.errorCode === 0,
            "getStreamInfo.errorCode should be 0, got " + getStreamInfoResult.errorCode,
        );

        // 15. setLoopCount
        const callTime15 = Date.now();
        const setLoopCountResult = await player.setLoopCount(3);
        this.assertLogEntry(runner, "setLoopCount", callTime15, { loopCount: 3 });
        runner.assert(setLoopCountResult === 0, "setLoopCount should return 0, got " + setLoopCountResult);

        // 16. setPlaybackSpeed
        const callTime16 = Date.now();
        const setPlaybackSpeedResult = await player.setPlaybackSpeed(120);
        this.assertLogEntry(runner, "setPlaybackSpeed", callTime16, { speed: 120 });
        runner.assert(setPlaybackSpeedResult === 0, "setPlaybackSpeed should return 0, got " + setPlaybackSpeedResult);

        // 17. selectAudioTrack
        const callTime17 = Date.now();
        const selectAudioTrackResult = await player.selectAudioTrack(1);
        this.assertLogEntry(runner, "selectAudioTrack", callTime17, { index: 1 });
        runner.assert(selectAudioTrackResult === 0, "selectAudioTrack should return 0, got " + selectAudioTrackResult);

        // 18. selectMultiAudioTrack
        const callTime18 = Date.now();
        const selectMultiAudioTrackResult = await player.selectMultiAudioTrack(0, 1);
        this.assertLogEntry(runner, "selectMultiAudioTrack", callTime18, {
            playoutTrackIndex: 0,
            publishTrackIndex: 1,
        });
        runner.assert(
            selectMultiAudioTrackResult === 0,
            "selectMultiAudioTrack should return 0, got " + selectMultiAudioTrackResult,
        );

        // 19. setPlayerOption (number)
        const callTime19 = Date.now();
        const setPlayerOptionResult = await player.setPlayerOption("key", 100);
        this.assertLogEntry(runner, "setPlayerOption", callTime19, { key: "key", value: 100 });
        runner.assert(setPlayerOptionResult === 0, "setPlayerOption should return 0, got " + setPlayerOptionResult);

        // 20. takeScreenshot
        const callTime20 = Date.now();
        const takeScreenshotResult = await player.takeScreenshot("/tmp/screenshot.png");
        this.assertLogEntry(runner, "takeScreenshot", callTime20, {
            filename: "/tmp/screenshot.png",
        });
        runner.assert(takeScreenshotResult === 0, "takeScreenshot should return 0, got " + takeScreenshotResult);

        // 21. selectInternalSubtitle
        const callTime21 = Date.now();
        const selectInternalSubtitleResult = await player.selectInternalSubtitle(2);
        this.assertLogEntry(runner, "selectInternalSubtitle", callTime21, { index: 2 });
        runner.assert(
            selectInternalSubtitleResult === 0,
            "selectInternalSubtitle should return 0, got " + selectInternalSubtitleResult,
        );

        // 22. setExternalSubtitle
        const callTime22 = Date.now();
        const setExternalSubtitleResult = await player.setExternalSubtitle("https://example.com/sub.srt");
        this.assertLogEntry(runner, "setExternalSubtitle", callTime22, {
            url: "https://example.com/sub.srt",
        });
        runner.assert(
            setExternalSubtitleResult === 0,
            "setExternalSubtitle should return 0, got " + setExternalSubtitleResult,
        );

        // 23. getState
        const callTime23 = Date.now();
        const stateResult = await player.getState();
        this.assertLogEntry(runner, "getState", callTime23, {});
        runner.assert(stateResult === 0, "getState should return PLAYER_STATE_IDLE (0), got " + stateResult);

        // 24. mute
        const callTime24 = Date.now();
        const muteResult = await player.mute(true);
        this.assertLogEntry(runner, "mute", callTime24, { muted: true });
        runner.assert(muteResult === 0, "mute should return 0, got " + muteResult);

        // 25. getMute
        const callTime25 = Date.now();
        const getMuteResult = await player.getMute();
        this.assertLogEntry(runner, "getMute", callTime25, {});
        runner.assert(getMuteResult.errorCode === 0, "getMute.errorCode should be 0, got " + getMuteResult.errorCode);
        runner.assert(getMuteResult.muted === false, "getMute.muted should be false, got " + getMuteResult.muted);

        // 26. adjustPlayoutVolume
        const callTime26 = Date.now();
        const adjustPlayoutVolumeResult = await player.adjustPlayoutVolume(80);
        this.assertLogEntry(runner, "adjustPlayoutVolume", callTime26, { volume: 80 });
        runner.assert(
            adjustPlayoutVolumeResult === 0,
            "adjustPlayoutVolume should return 0, got " + adjustPlayoutVolumeResult,
        );

        // 27. getPlayoutVolume
        const callTime27 = Date.now();
        const getPlayoutVolumeResult = await player.getPlayoutVolume();
        this.assertLogEntry(runner, "getPlayoutVolume", callTime27, {});
        runner.assert(
            getPlayoutVolumeResult.errorCode === 0,
            "getPlayoutVolume.errorCode should be 0, got " + getPlayoutVolumeResult.errorCode,
        );
        runner.assert(
            getPlayoutVolumeResult.volume === 0,
            "getPlayoutVolume.volume should be 0, got " + getPlayoutVolumeResult.volume,
        );

        // 28. adjustPublishSignalVolume
        const callTime28 = Date.now();
        const adjustPublishSignalVolumeResult = await player.adjustPublishSignalVolume(90);
        this.assertLogEntry(runner, "adjustPublishSignalVolume", callTime28, { volume: 90 });
        runner.assert(
            adjustPublishSignalVolumeResult === 0,
            "adjustPublishSignalVolume should return 0, got " + adjustPublishSignalVolumeResult,
        );

        // 29. getPublishSignalVolume
        const callTime29 = Date.now();
        const getPublishSignalVolumeResult = await player.getPublishSignalVolume();
        this.assertLogEntry(runner, "getPublishSignalVolume", callTime29, {});
        runner.assert(
            getPublishSignalVolumeResult.errorCode === 0,
            "getPublishSignalVolume.errorCode should be 0, got " + getPublishSignalVolumeResult.errorCode,
        );
        runner.assert(
            getPublishSignalVolumeResult.volume === 0,
            "getPublishSignalVolume.volume should be 0, got " + getPublishSignalVolumeResult.volume,
        );

        // 30. setAudioDualMonoMode
        const callTime30 = Date.now();
        const setAudioDualMonoModeResult = await player.setAudioDualMonoMode(0);
        this.assertLogEntry(runner, "setAudioDualMonoMode", callTime30, { mode: 0 });
        runner.assert(
            setAudioDualMonoModeResult === 0,
            "setAudioDualMonoMode should return 0, got " + setAudioDualMonoModeResult,
        );

        // 31. getPlayerSdkVersion
        const callTime31 = Date.now();
        const sdkVersionResult = await player.getPlayerSdkVersion();
        this.assertLogEntry(runner, "getPlayerSdkVersion", callTime31, {});
        runner.assert(
            sdkVersionResult === "1.0.0-mock",
            "getPlayerSdkVersion should return '1.0.0-mock', got '" + sdkVersionResult + "'",
        );

        // 32. getPlaySrc
        const callTime32 = Date.now();
        const playSrcResult = await player.getPlaySrc();
        this.assertLogEntry(runner, "getPlaySrc", callTime32, {});
        runner.assert(playSrcResult === "", "getPlaySrc should return '', got '" + playSrcResult + "'");

        // 33. openWithAgoraCDNSrc
        const callTime33 = Date.now();
        const openWithAgoraCDNSrcResult = await player.openWithAgoraCDNSrc("https://cdn.example.com/video.mp4", 0);
        this.assertLogEntry(runner, "openWithAgoraCDNSrc", callTime33, {
            src: "https://cdn.example.com/video.mp4",
            startPos: 0,
        });
        runner.assert(
            openWithAgoraCDNSrcResult === 0,
            "openWithAgoraCDNSrc should return 0, got " + openWithAgoraCDNSrcResult,
        );

        // 34. getAgoraCDNLineCount
        const callTime34 = Date.now();
        const agoraCDNLineCountResult = await player.getAgoraCDNLineCount();
        this.assertLogEntry(runner, "getAgoraCDNLineCount", callTime34, {});
        runner.assert(
            agoraCDNLineCountResult === 0,
            "getAgoraCDNLineCount should return 0, got " + agoraCDNLineCountResult,
        );

        // 35. switchAgoraCDNLineByIndex
        const callTime35 = Date.now();
        const switchAgoraCDNLineByIndexResult = await player.switchAgoraCDNLineByIndex(1);
        this.assertLogEntry(runner, "switchAgoraCDNLineByIndex", callTime35, { index: 1 });
        runner.assert(
            switchAgoraCDNLineByIndexResult === 0,
            "switchAgoraCDNLineByIndex should return 0, got " + switchAgoraCDNLineByIndexResult,
        );

        // 36. getCurrentAgoraCDNIndex
        const callTime36 = Date.now();
        const currentAgoraCDNIndexResult = await player.getCurrentAgoraCDNIndex();
        this.assertLogEntry(runner, "getCurrentAgoraCDNIndex", callTime36, {});
        runner.assert(
            currentAgoraCDNIndexResult === 0,
            "getCurrentAgoraCDNIndex should return 0, got " + currentAgoraCDNIndexResult,
        );

        // 37. enableAutoSwitchAgoraCDN
        const callTime37 = Date.now();
        const enableAutoSwitchAgoraCDNResult = await player.enableAutoSwitchAgoraCDN(true);
        this.assertLogEntry(runner, "enableAutoSwitchAgoraCDN", callTime37, { enable: true });
        runner.assert(
            enableAutoSwitchAgoraCDNResult === 0,
            "enableAutoSwitchAgoraCDN should return 0, got " + enableAutoSwitchAgoraCDNResult,
        );

        // 38. renewAgoraCDNSrcToken
        const callTime38 = Date.now();
        const renewAgoraCDNSrcTokenResult = await player.renewAgoraCDNSrcToken("newToken", 12345);
        this.assertLogEntry(runner, "renewAgoraCDNSrcToken", callTime38, {
            token: "newToken",
            ts: 12345,
        });
        runner.assert(
            renewAgoraCDNSrcTokenResult === 0,
            "renewAgoraCDNSrcToken should return 0, got " + renewAgoraCDNSrcTokenResult,
        );

        // 39. switchAgoraCDNSrc
        const callTime39 = Date.now();
        const switchAgoraCDNSrcResult = await player.switchAgoraCDNSrc("https://cdn2.example.com/video.mp4", true);
        this.assertLogEntry(runner, "switchAgoraCDNSrc", callTime39, {
            src: "https://cdn2.example.com/video.mp4",
            syncPts: true,
        });
        runner.assert(
            switchAgoraCDNSrcResult === 0,
            "switchAgoraCDNSrc should return 0, got " + switchAgoraCDNSrcResult,
        );

        // 40. switchSrc
        const callTime40 = Date.now();
        const switchSrcResult = await player.switchSrc("https://example.com/other.mp4", false);
        this.assertLogEntry(runner, "switchSrc", callTime40, {
            src: "https://example.com/other.mp4",
            syncPts: false,
        });
        runner.assert(switchSrcResult === 0, "switchSrc should return 0, got " + switchSrcResult);

        // 41. preloadSrc
        const callTime41 = Date.now();
        const preloadSrcResult = await player.preloadSrc("https://example.com/preload.mp4", 0);
        this.assertLogEntry(runner, "preloadSrc", callTime41, {
            src: "https://example.com/preload.mp4",
            startPos: 0,
        });
        runner.assert(preloadSrcResult === 0, "preloadSrc should return 0, got " + preloadSrcResult);

        // 42. playPreloadedSrc
        const callTime42 = Date.now();
        const playPreloadedSrcResult = await player.playPreloadedSrc("https://example.com/preload.mp4");
        this.assertLogEntry(runner, "playPreloadedSrc", callTime42, {
            src: "https://example.com/preload.mp4",
        });
        runner.assert(playPreloadedSrcResult === 0, "playPreloadedSrc should return 0, got " + playPreloadedSrcResult);

        // 43. unloadSrc
        const callTime43 = Date.now();
        const unloadSrcResult = await player.unloadSrc("https://example.com/preload.mp4");
        this.assertLogEntry(runner, "unloadSrc", callTime43, {
            src: "https://example.com/preload.mp4",
        });
        runner.assert(unloadSrcResult === 0, "unloadSrc should return 0, got " + unloadSrcResult);

        // 44. setSpatialAudioParams
        const callTime44 = Date.now();
        const setSpatialAudioParamsResult = await player.setSpatialAudioParams({
            speaker_azimuth: 0.5,
            speaker_elevation: 0.5,
            speaker_distance: 5.0,
        });
        this.assertLogEntry(runner, "setSpatialAudioParams", callTime44, {});
        runner.assert(
            setSpatialAudioParamsResult === 0,
            "setSpatialAudioParams should return 0, got " + setSpatialAudioParamsResult,
        );

        // 45. setSoundPositionParams
        const callTime45 = Date.now();
        const setSoundPositionParamsResult = await player.setSoundPositionParams(0.5, 10.0);
        this.assertLogEntry(runner, "setSoundPositionParams", callTime45, {
            pan: 0.5,
            gain: 10.0,
        });
        runner.assert(
            setSoundPositionParamsResult === 0,
            "setSoundPositionParams should return 0, got " + setSoundPositionParamsResult,
        );

        // 46. getAudioBufferDelay
        const callTime46 = Date.now();
        const getAudioBufferDelayResult = await player.getAudioBufferDelay();
        this.assertLogEntry(runner, "getAudioBufferDelay", callTime46, {});
        runner.assert(
            getAudioBufferDelayResult.errorCode === 0,
            "getAudioBufferDelay.errorCode should be 0, got " + getAudioBufferDelayResult.errorCode,
        );
        runner.assert(
            getAudioBufferDelayResult.delayMs === 0,
            "getAudioBufferDelay.delayMs should be 0, got " + getAudioBufferDelayResult.delayMs,
        );

        await bridge.destroyMediaPlayer(player);
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IAudioDeviceManager ────────────────────────────

    private async testAudioDeviceManager(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: AudioDeviceManager ---");
        const bridge = this.createBridgeAndInit();

        const mgr: IAudioDeviceManager = await bridge.getAudioDeviceManager();
        runner.assert(mgr !== null, "getAudioDeviceManager should return non-null");

        // enumeratePlaybackDevices
        const callTime1 = Date.now();
        const playbackDevices = await mgr.enumeratePlaybackDevices();
        this.assertLogEntry(runner, "enumeratePlaybackDevices", callTime1, {});

        // enumerateRecordingDevices
        const callTime2 = Date.now();
        const recordingDevices = await mgr.enumerateRecordingDevices();
        this.assertLogEntry(runner, "enumerateRecordingDevices", callTime2, {});

        // setPlaybackDevice
        const callTime3 = Date.now();
        const setPlaybackDeviceResult = await mgr.setPlaybackDevice("device-id-1");
        this.assertLogEntry(runner, "setPlaybackDevice", callTime3, { deviceId: "device-id-1" });
        runner.assert(
            setPlaybackDeviceResult === 0,
            "setPlaybackDevice should return 0, got " + setPlaybackDeviceResult,
        );

        // getPlaybackDevice
        const callTime4 = Date.now();
        const getPlaybackDeviceResult = await mgr.getPlaybackDevice();
        this.assertLogEntry(runner, "getPlaybackDevice", callTime4, {});
        runner.assert(
            getPlaybackDeviceResult.errorCode === 0,
            "getPlaybackDevice.errorCode should be 0, got " + getPlaybackDeviceResult.errorCode,
        );

        // setPlaybackDeviceVolume
        const callTime5 = Date.now();
        const setPlaybackDeviceVolumeResult = await mgr.setPlaybackDeviceVolume(80);
        this.assertLogEntry(runner, "setPlaybackDeviceVolume", callTime5, { volume: 80 });
        runner.assert(
            setPlaybackDeviceVolumeResult === 0,
            "setPlaybackDeviceVolume should return 0, got " + setPlaybackDeviceVolumeResult,
        );

        // getPlaybackDeviceVolume
        const callTime6 = Date.now();
        const getPlaybackDeviceVolumeResult = await (mgr as any).getPlaybackDeviceVolume();
        this.assertLogEntry(runner, "getPlaybackDeviceVolume", callTime6, {});
        runner.assert(
            getPlaybackDeviceVolumeResult.errorCode === 0,
            "getPlaybackDeviceVolume.errorCode should be 0, got " + getPlaybackDeviceVolumeResult.errorCode,
        );
        runner.assert(
            getPlaybackDeviceVolumeResult.volume === 0,
            "getPlaybackDeviceVolume.volume should be 0, got " + getPlaybackDeviceVolumeResult.volume,
        );

        // setRecordingDevice
        const callTime7 = Date.now();
        const setRecordingDeviceResult = await mgr.setRecordingDevice("device-id-2");
        this.assertLogEntry(runner, "setRecordingDevice", callTime7, { deviceId: "device-id-2" });
        runner.assert(
            setRecordingDeviceResult === 0,
            "setRecordingDevice should return 0, got " + setRecordingDeviceResult,
        );

        // getRecordingDevice
        const callTime8 = Date.now();
        const getRecordingDeviceResult = await mgr.getRecordingDevice();
        this.assertLogEntry(runner, "getRecordingDevice", callTime8, {});
        runner.assert(
            getRecordingDeviceResult.errorCode === 0,
            "getRecordingDevice.errorCode should be 0, got " + getRecordingDeviceResult.errorCode,
        );

        // setRecordingDeviceVolume
        const callTime9 = Date.now();
        const setRecordingDeviceVolumeResult = await mgr.setRecordingDeviceVolume(70);
        this.assertLogEntry(runner, "setRecordingDeviceVolume", callTime9, { volume: 70 });
        runner.assert(
            setRecordingDeviceVolumeResult === 0,
            "setRecordingDeviceVolume should return 0, got " + setRecordingDeviceVolumeResult,
        );

        // getRecordingDeviceVolume
        const callTime10 = Date.now();
        const getRecordingDeviceVolumeResult = await mgr.getRecordingDeviceVolume();
        this.assertLogEntry(runner, "getRecordingDeviceVolume", callTime10, {});
        runner.assert(
            getRecordingDeviceVolumeResult.errorCode === 0,
            "getRecordingDeviceVolume.errorCode should be 0, got " + getRecordingDeviceVolumeResult.errorCode,
        );
        runner.assert(
            getRecordingDeviceVolumeResult.volume === 0,
            "getRecordingDeviceVolume.volume should be 0, got " + getRecordingDeviceVolumeResult.volume,
        );

        // setPlaybackDeviceMute
        const callTime11 = Date.now();
        const setPlaybackDeviceMuteResult = await mgr.setPlaybackDeviceMute(true);
        this.assertLogEntry(runner, "setPlaybackDeviceMute", callTime11, { mute: true });
        runner.assert(
            setPlaybackDeviceMuteResult === 0,
            "setPlaybackDeviceMute should return 0, got " + setPlaybackDeviceMuteResult,
        );

        // getPlaybackDeviceMute
        const callTime12 = Date.now();
        const getPlaybackDeviceMuteResult = await mgr.getPlaybackDeviceMute();
        this.assertLogEntry(runner, "getPlaybackDeviceMute", callTime12, {});
        runner.assert(
            getPlaybackDeviceMuteResult.errorCode === 0,
            "getPlaybackDeviceMute.errorCode should be 0, got " + getPlaybackDeviceMuteResult.errorCode,
        );
        runner.assert(
            getPlaybackDeviceMuteResult.mute === false,
            "getPlaybackDeviceMute.mute should be false, got " + getPlaybackDeviceMuteResult.mute,
        );

        // setRecordingDeviceMute
        const callTime13 = Date.now();
        const setRecordingDeviceMuteResult = await mgr.setRecordingDeviceMute(false);
        this.assertLogEntry(runner, "setRecordingDeviceMute", callTime13, { mute: false });
        runner.assert(
            setRecordingDeviceMuteResult === 0,
            "setRecordingDeviceMute should return 0, got " + setRecordingDeviceMuteResult,
        );

        // getRecordingDeviceMute
        const callTime14 = Date.now();
        const getRecordingDeviceMuteResult = await mgr.getRecordingDeviceMute();
        this.assertLogEntry(runner, "getRecordingDeviceMute", callTime14, {});
        runner.assert(
            getRecordingDeviceMuteResult.errorCode === 0,
            "getRecordingDeviceMute.errorCode should be 0, got " + getRecordingDeviceMuteResult.errorCode,
        );
        runner.assert(
            getRecordingDeviceMuteResult.mute === false,
            "getRecordingDeviceMute.mute should be false, got " + getRecordingDeviceMuteResult.mute,
        );

        // startPlaybackDeviceTest
        const callTime15 = Date.now();
        const startPlaybackDeviceTestResult = await mgr.startPlaybackDeviceTest("/tmp/test.wav");
        this.assertLogEntry(runner, "startPlaybackDeviceTest", callTime15, {
            testAudioFilePath: "/tmp/test.wav",
        });
        runner.assert(
            startPlaybackDeviceTestResult === 0,
            "startPlaybackDeviceTest should return 0, got " + startPlaybackDeviceTestResult,
        );

        // stopPlaybackDeviceTest
        const callTime16 = Date.now();
        const stopPlaybackDeviceTestResult = await mgr.stopPlaybackDeviceTest();
        this.assertLogEntry(runner, "stopPlaybackDeviceTest", callTime16, {});
        runner.assert(
            stopPlaybackDeviceTestResult === 0,
            "stopPlaybackDeviceTest should return 0, got " + stopPlaybackDeviceTestResult,
        );

        // startRecordingDeviceTest
        const callTime17 = Date.now();
        const startRecordingDeviceTestResult = await mgr.startRecordingDeviceTest(200);
        this.assertLogEntry(runner, "startRecordingDeviceTest", callTime17, { indicationInterval: 200 });
        runner.assert(
            startRecordingDeviceTestResult === 0,
            "startRecordingDeviceTest should return 0, got " + startRecordingDeviceTestResult,
        );

        // stopRecordingDeviceTest
        const callTime18 = Date.now();
        const stopRecordingDeviceTestResult = await mgr.stopRecordingDeviceTest();
        this.assertLogEntry(runner, "stopRecordingDeviceTest", callTime18, {});
        runner.assert(
            stopRecordingDeviceTestResult === 0,
            "stopRecordingDeviceTest should return 0, got " + stopRecordingDeviceTestResult,
        );

        // followSystemPlaybackDevice
        const callTime19 = Date.now();
        const followSystemPlaybackDeviceResult = await mgr.followSystemPlaybackDevice(true);
        this.assertLogEntry(runner, "followSystemPlaybackDevice", callTime19, { enable: true });
        runner.assert(
            followSystemPlaybackDeviceResult === 0,
            "followSystemPlaybackDevice should return 0, got " + followSystemPlaybackDeviceResult,
        );

        // followSystemRecordingDevice
        const callTime20 = Date.now();
        const followSystemRecordingDeviceResult = await mgr.followSystemRecordingDevice(false);
        this.assertLogEntry(runner, "followSystemRecordingDevice", callTime20, { enable: false });
        runner.assert(
            followSystemRecordingDeviceResult === 0,
            "followSystemRecordingDevice should return 0, got " + followSystemRecordingDeviceResult,
        );

        // setLoopbackDevice
        const callTime21 = Date.now();
        const setLoopbackDeviceResult = await mgr.setLoopbackDevice("loopback-id");
        this.assertLogEntry(runner, "setLoopbackDevice", callTime21, { deviceId: "loopback-id" });
        runner.assert(
            setLoopbackDeviceResult === 0,
            "setLoopbackDevice should return 0, got " + setLoopbackDeviceResult,
        );

        // getLoopbackDevice
        const callTime22 = Date.now();
        const getLoopbackDeviceResult = await mgr.getLoopbackDevice();
        this.assertLogEntry(runner, "getLoopbackDevice", callTime22, {});
        runner.assert(
            getLoopbackDeviceResult.errorCode === 0,
            "getLoopbackDevice.errorCode should be 0, got " + getLoopbackDeviceResult.errorCode,
        );

        // followSystemLoopbackDevice
        const callTime23 = Date.now();
        const followSystemLoopbackDeviceResult = await mgr.followSystemLoopbackDevice(true);
        this.assertLogEntry(runner, "followSystemLoopbackDevice", callTime23, { enable: true });
        runner.assert(
            followSystemLoopbackDeviceResult === 0,
            "followSystemLoopbackDevice should return 0, got " + followSystemLoopbackDeviceResult,
        );

        // startAudioDeviceLoopbackTest
        const callTime24 = Date.now();
        const startAudioDeviceLoopbackTestResult = await mgr.startAudioDeviceLoopbackTest(200);
        this.assertLogEntry(runner, "startAudioDeviceLoopbackTest", callTime24, { indicationInterval: 200 });
        runner.assert(
            startAudioDeviceLoopbackTestResult === 0,
            "startAudioDeviceLoopbackTest should return 0, got " + startAudioDeviceLoopbackTestResult,
        );

        // stopAudioDeviceLoopbackTest
        const callTime25 = Date.now();
        const stopAudioDeviceLoopbackTestResult = await mgr.stopAudioDeviceLoopbackTest();
        this.assertLogEntry(runner, "stopAudioDeviceLoopbackTest", callTime25, {});
        runner.assert(
            stopAudioDeviceLoopbackTestResult === 0,
            "stopAudioDeviceLoopbackTest should return 0, got " + stopAudioDeviceLoopbackTestResult,
        );

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IVideoDeviceManager ────────────────────────────

    private async testVideoDeviceManager(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: VideoDeviceManager ---");
        const bridge = this.createBridgeAndInit();

        const mgr: IVideoDeviceManager = await bridge.getVideoDeviceManager();
        runner.assert(mgr !== null, "getVideoDeviceManager should return non-null");

        // enumerateVideoDevices
        const callTime1 = Date.now();
        const devices = await mgr.enumerateVideoDevices();
        this.assertLogEntry(runner, "enumerateVideoDevices", callTime1, {});

        // setDevice
        const callTime2 = Date.now();
        const setVideoDeviceResult = await mgr.setDevice("video-device-id");
        this.assertLogEntry(runner, "setDevice", callTime2, { deviceId: "video-device-id" });
        runner.assert(setVideoDeviceResult === 0, "setDevice should return 0, got " + setVideoDeviceResult);

        // getDevice
        const callTime3 = Date.now();
        const getVideoDeviceResult = await mgr.getDevice();
        this.assertLogEntry(runner, "getDevice", callTime3, {});
        runner.assert(
            getVideoDeviceResult.errorCode === 0,
            "getDevice.errorCode should be 0, got " + getVideoDeviceResult.errorCode,
        );

        // numberOfCapabilities
        const callTime4 = Date.now();
        const numberOfCapabilitiesResult = await mgr.numberOfCapabilities("video-device-id");
        this.assertLogEntry(runner, "numberOfCapabilities", callTime4, { deviceId: "video-device-id" });
        runner.assert(
            numberOfCapabilitiesResult === 0,
            "numberOfCapabilities should return 0, got " + numberOfCapabilitiesResult,
        );

        // getCapability
        const callTime5 = Date.now();
        const getCapabilityResult = await mgr.getCapability("video-device-id", 0);
        this.assertLogEntry(runner, "getCapability", callTime5, {
            deviceId: "video-device-id",
            deviceCapabilityNumber: 0,
        });
        runner.assert(
            getCapabilityResult.errorCode === 0,
            "getCapability.errorCode should be 0, got " + getCapabilityResult.errorCode,
        );

        // stopDeviceTest
        const callTime6 = Date.now();
        const stopDeviceTestResult = await mgr.stopDeviceTest();
        this.assertLogEntry(runner, "stopDeviceTest", callTime6, {});
        runner.assert(stopDeviceTestResult === 0, "stopDeviceTest should return 0, got " + stopDeviceTestResult);

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IH265Transcoder ────────────────────────────

    private async testH265Transcoder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: H265Transcoder ---");
        const bridge = this.createBridgeAndInit();

        const transcoder: IH265Transcoder = await bridge.getH265Transcoder();
        runner.assert(transcoder !== null, "getH265Transcoder should return non-null");

        // enableTranscode
        const callTime1 = Date.now();
        const enableTranscodeResult = await transcoder.enableTranscode("token123", "channel1", 42);
        this.assertLogEntry(runner, "enableTranscode", callTime1, {
            token: "token123",
            channel: "channel1",
            uid: 42,
        });
        runner.assert(enableTranscodeResult === 0, "enableTranscode should return 0, got " + enableTranscodeResult);

        // queryChannel
        const callTime2 = Date.now();
        const queryChannelResult = await transcoder.queryChannel("token456", "channel2", 100);
        this.assertLogEntry(runner, "queryChannel", callTime2, {
            token: "token456",
            channel: "channel2",
            uid: 100,
        });
        runner.assert(queryChannelResult === 0, "queryChannel should return 0, got " + queryChannelResult);

        // triggerTranscode
        const callTime3 = Date.now();
        const triggerTranscodeResult = await transcoder.triggerTranscode("token789", "channel3", 200);
        this.assertLogEntry(runner, "triggerTranscode", callTime3, {
            token: "token789",
            channel: "channel3",
            uid: 200,
        });
        runner.assert(triggerTranscodeResult === 0, "triggerTranscode should return 0, got " + triggerTranscodeResult);

        // registerTranscoderObserver not need ut
        // const callTime4 = Date.now();
        // await transcoder.registerTranscoderObserver({} as any);
        // this.assertLogEntry(runner, "registerTranscoderObserver", callTime4, {});

        // unregisterTranscoderObserver not need ut
        // const callTime5 = Date.now();
        // await transcoder.unregisterTranscoderObserver();
        // this.assertLogEntry(runner, "unregisterTranscoderObserver", callTime5, {});

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── ILocalSpatialAudioEngine ────────────────────────────

    private async testLocalSpatialAudioEngine(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: LocalSpatialAudioEngine ---");
        const bridge = this.createBridgeAndInit();

        const engine: ILocalSpatialAudioEngine = await bridge.getLocalSpatialAudioEngine();
        runner.assert(engine !== null, "getLocalSpatialAudioEngine should return non-null");

        // setMaxAudioRecvCount
        const callTime1 = Date.now();
        const setMaxAudioRecvCountResult = await engine.setMaxAudioRecvCount(10);
        this.assertLogEntry(runner, "setMaxAudioRecvCount", callTime1, { maxCount: 10 });
        runner.assert(
            setMaxAudioRecvCountResult === 0,
            "setMaxAudioRecvCount should return 0, got " + setMaxAudioRecvCountResult,
        );

        // setAudioRecvRange
        const callTime2 = Date.now();
        const setAudioRecvRangeResult = await engine.setAudioRecvRange(50.0);
        this.assertLogEntry(runner, "setAudioRecvRange", callTime2, { range: 50.0 });
        runner.assert(
            setAudioRecvRangeResult === 0,
            "setAudioRecvRange should return 0, got " + setAudioRecvRangeResult,
        );

        // setDistanceUnit
        const callTime3 = Date.now();
        const setDistanceUnitResult = await engine.setDistanceUnit(1.0);
        this.assertLogEntry(runner, "setDistanceUnit", callTime3, { unit: 1.0 });
        runner.assert(setDistanceUnitResult === 0, "setDistanceUnit should return 0, got " + setDistanceUnitResult);

        // updateSelfPosition
        const callTime4 = Date.now();
        const updateSelfPositionResult = await engine.updateSelfPosition([1, 2, 3], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
        this.assertLogEntry(runner, "updateSelfPosition", callTime4, {
            position: [1, 2, 3],
            axisForward: [0, 0, -1],
            axisRight: [1, 0, 0],
            axisUp: [0, 1, 0],
        });
        runner.assert(
            updateSelfPositionResult === 0,
            "updateSelfPosition should return 0, got " + updateSelfPositionResult,
        );

        // updateRemotePosition
        const callTime5 = Date.now();
        const updateRemotePositionResult = await engine.updateRemotePosition(42, {
            position: [4, 5, 6],
            forward: [0, 0, -1],
        });
        this.assertLogEntry(runner, "updateRemotePosition", callTime5, {
            uid: 42,
            posInfo: { position: [4, 5, 6], forward: [0, 0, -1] },
        });
        runner.assert(
            updateRemotePositionResult === 0,
            "updateRemotePosition should return 0, got " + updateRemotePositionResult,
        );

        // removeRemotePosition
        const callTime6 = Date.now();
        const removeRemotePositionResult = await engine.removeRemotePosition(42);
        this.assertLogEntry(runner, "removeRemotePosition", callTime6, { uid: 42 });
        runner.assert(
            removeRemotePositionResult === 0,
            "removeRemotePosition should return 0, got " + removeRemotePositionResult,
        );

        // clearRemotePositions
        const callTime7 = Date.now();
        const clearRemotePositionsResult = await engine.clearRemotePositions();
        this.assertLogEntry(runner, "clearRemotePositions", callTime7, {});
        runner.assert(
            clearRemotePositionsResult === 0,
            "clearRemotePositions should return 0, got " + clearRemotePositionsResult,
        );

        // muteLocalAudioStream
        const callTime8 = Date.now();
        const muteLocalAudioStreamResult = await engine.muteLocalAudioStream(true);
        this.assertLogEntry(runner, "muteLocalAudioStream", callTime8, { mute: true });
        runner.assert(
            muteLocalAudioStreamResult === 0,
            "muteLocalAudioStream should return 0, got " + muteLocalAudioStreamResult,
        );

        // muteAllRemoteAudioStreams
        const callTime9 = Date.now();
        const muteAllRemoteAudioStreamsResult = await engine.muteAllRemoteAudioStreams(false);
        this.assertLogEntry(runner, "muteAllRemoteAudioStreams", callTime9, { mute: false });
        runner.assert(
            muteAllRemoteAudioStreamsResult === 0,
            "muteAllRemoteAudioStreams should return 0, got " + muteAllRemoteAudioStreamsResult,
        );

        // muteRemoteAudioStream
        const callTime10 = Date.now();
        const muteRemoteAudioStreamResult = await engine.muteRemoteAudioStream(42, true);
        this.assertLogEntry(runner, "muteRemoteAudioStream", callTime10, { uid: 42, mute: true });
        runner.assert(
            muteRemoteAudioStreamResult === 0,
            "muteRemoteAudioStream should return 0, got " + muteRemoteAudioStreamResult,
        );

        // setRemoteAudioAttenuation
        const callTime11 = Date.now();
        const setRemoteAudioAttenuationResult = await engine.setRemoteAudioAttenuation(42, 0.5, true);
        this.assertLogEntry(runner, "setRemoteAudioAttenuation", callTime11, {
            uid: 42,
            attenuation: 0.5,
            forceSet: true,
        });
        runner.assert(
            setRemoteAudioAttenuationResult === 0,
            "setRemoteAudioAttenuation should return 0, got " + setRemoteAudioAttenuationResult,
        );

        // setParameters
        const callTime12 = Date.now();
        const setParametersResult = await engine.setParameters('{"key":"value"}');
        this.assertLogEntry(runner, "setParameters", callTime12, { params: '{"key":"value"}' });
        runner.assert(setParametersResult === 0, "setParameters should return 0, got " + setParametersResult);

        // updatePlayerPositionInfo
        const callTime13 = Date.now();
        const updatePlayerPositionInfoResult = await engine.updatePlayerPositionInfo(1, {
            position: [7, 8, 9],
            forward: [0, 0, -1],
        });
        this.assertLogEntry(runner, "updatePlayerPositionInfo", callTime13, {
            playerId: 1,
            positionInfo: { position: [7, 8, 9], forward: [0, 0, -1] },
        });
        runner.assert(
            updatePlayerPositionInfoResult === 0,
            "updatePlayerPositionInfo should return 0, got " + updatePlayerPositionInfoResult,
        );

        // setPlayerAttenuation
        const callTime14 = Date.now();
        const setPlayerAttenuationResult = await engine.setPlayerAttenuation(1, 0.8, false);
        this.assertLogEntry(runner, "setPlayerAttenuation", callTime14, {
            playerId: 1,
            attenuation: 0.8,
            forceSet: false,
        });
        runner.assert(
            setPlayerAttenuationResult === 0,
            "setPlayerAttenuation should return 0, got " + setPlayerAttenuationResult,
        );

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IMusicContentCenter ────────────────────────────

    private async testMusicContentCenter(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MusicContentCenter ---");
        const bridge = this.createBridgeAndInit();

        const mcc: IMusicContentCenter = await bridge.getMusicContentCenter();
        runner.assert(mcc !== null, "getMusicContentCenter should return non-null");

        // renewToken
        const callTime1 = Date.now();
        const renewTokenResult = await mcc.renewToken("newMccToken");
        this.assertLogEntry(runner, "renewToken", callTime1, { token: "newMccToken" });
        runner.assert(renewTokenResult === 0, "renewToken should return 0, got " + renewTokenResult);

        // // registerEventHandler not need ut
        // const callTime2 = Date.now();
        // await mcc.registerEventHandler({} as any);
        // this.assertLogEntry(runner, "registerEventHandler", callTime2, {});

        // unregisterEventHandler
        const callTime3 = Date.now();
        const unregisterEventHandlerResult = await mcc.unregisterEventHandler();
        this.assertLogEntry(runner, "unregisterEventHandler", callTime3, {});
        runner.assert(
            unregisterEventHandlerResult === 0,
            "unregisterEventHandler should return 0, got " + unregisterEventHandlerResult,
        );

        // getMusicCharts
        const callTime4 = Date.now();
        const getMusicChartsResult = await mcc.getMusicCharts();
        this.assertLogEntry(runner, "getMusicCharts", callTime4, {});
        runner.assert(
            getMusicChartsResult.errorCode === 0,
            "getMusicCharts.errorCode should be 0, got " + getMusicChartsResult.errorCode,
        );

        // getMusicCollectionByMusicChartId
        const callTime5 = Date.now();
        const getMusicCollectionByMusicChartIdResult = await mcc.getMusicCollectionByMusicChartId(1, 0, 10, "");
        this.assertLogEntry(runner, "getMusicCollectionByMusicChartId", callTime5, {
            musicChartId: 1,
            page: 0,
            pageSize: 10,
            jsonOption: "",
        });
        runner.assert(
            getMusicCollectionByMusicChartIdResult.errorCode === 0,
            "getMusicCollectionByMusicChartId.errorCode should be 0, got " +
                getMusicCollectionByMusicChartIdResult.errorCode,
        );

        // searchMusic
        const callTime6 = Date.now();
        const searchMusicResult = await mcc.searchMusic("love", 0, 20, "");
        this.assertLogEntry(runner, "searchMusic", callTime6, {
            keyword: "love",
            page: 0,
            pageSize: 20,
            jsonOption: "",
        });
        runner.assert(
            searchMusicResult.errorCode === 0,
            "searchMusic.errorCode should be 0, got " + searchMusicResult.errorCode,
        );

        // preload (with jsonOption)
        const callTime7 = Date.now();
        const preloadResult = await mcc.preload(12345, "{}");
        this.assertLogEntry(runner, "preload", callTime7, { songCode: 12345, jsonOption: "{}" });
        runner.assert(preloadResult === 0, "preload should return 0, got " + preloadResult);

        // removeCache
        const callTime8 = Date.now();
        const removeCacheResult = await mcc.removeCache(12345);
        this.assertLogEntry(runner, "removeCache", callTime8, { songCode: 12345 });
        runner.assert(removeCacheResult === 0, "removeCache should return 0, got " + removeCacheResult);

        // getCaches
        const callTime9 = Date.now();
        const getCachesResult = await mcc.getCaches(10);
        this.assertLogEntry(runner, "getCaches", callTime9, { cacheInfoSize: 10 });
        runner.assert(
            getCachesResult.errorCode === 0,
            "getCaches.errorCode should be 0, got " + getCachesResult.errorCode,
        );

        // isPreloaded
        const callTime10 = Date.now();
        const isPreloadedResult = await mcc.isPreloaded(12345);
        this.assertLogEntry(runner, "isPreloaded", callTime10, { songCode: 12345 });
        runner.assert(isPreloadedResult === 0, "isPreloaded should return 0, got " + isPreloadedResult);

        // getLyric
        const callTime11 = Date.now();
        const getLyricResult = await mcc.getLyric(12345, 0);
        this.assertLogEntry(runner, "getLyric", callTime11, { songCode: 12345, lyricType: 0 });
        runner.assert(
            getLyricResult.errorCode === 0,
            "getLyric.errorCode should be 0, got " + getLyricResult.errorCode,
        );

        // getSongSimpleInfo
        const callTime12 = Date.now();
        const getSongSimpleInfoResult = await mcc.getSongSimpleInfo(12345);
        this.assertLogEntry(runner, "getSongSimpleInfo", callTime12, { songCode: 12345 });
        runner.assert(
            getSongSimpleInfoResult.errorCode === 0,
            "getSongSimpleInfo.errorCode should be 0, got " + getSongSimpleInfoResult.errorCode,
        );

        // getInternalSongCode
        const callTime13 = Date.now();
        const internalSongCodeResult = await mcc.getInternalSongCode(12345, "{}");
        this.assertLogEntry(runner, "getInternalSongCode", callTime13, {
            songCode: 12345,
            jsonOption: "{}",
        });
        runner.assert(
            typeof internalSongCodeResult.internalSongCode === "number",
            "getInternalSongCode.internalSongCode should be number, not bigint",
        );
        runner.assert(
            internalSongCodeResult.errorCode === 0,
            "getInternalSongCode.errorCode should be 0, got " + internalSongCodeResult.errorCode,
        );
        runner.assert(
            internalSongCodeResult.internalSongCode === 0,
            "getInternalSongCode.internalSongCode should be 0 (mock default), got " +
                internalSongCodeResult.internalSongCode,
        );

        // createMusicPlayer / destroyMusicPlayer
        const callTime14 = Date.now();
        const player = await mcc.createMusicPlayer();
        this.assertLogEntry(runner, "createMusicPlayer", callTime14, {});

        if (player) {
            const callTime15 = Date.now();
            await mcc.destroyMusicPlayer(player);
            this.assertLogEntry(runner, "destroyMusicPlayer", callTime15, {});
        }

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IMediaPlayerCacheManager ────────────────────────────

    private async testMediaPlayerCacheManager(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MediaPlayerCacheManager ---");
        const bridge = this.createBridgeAndInit();

        const cacheMgr: IMediaPlayerCacheManager = await bridge.getMediaPlayerCacheManager();
        runner.assert(cacheMgr !== null, "getMediaPlayerCacheManager should return non-null");

        // removeAllCaches
        const callTime1 = Date.now();
        const removeAllCachesResult = await cacheMgr.removeAllCaches();
        this.assertLogEntry(runner, "removeAllCaches", callTime1, {});
        runner.assert(removeAllCachesResult === 0, "removeAllCaches should return 0, got " + removeAllCachesResult);

        // removeOldCache
        const callTime2 = Date.now();
        const removeOldCacheResult = await cacheMgr.removeOldCache();
        this.assertLogEntry(runner, "removeOldCache", callTime2, {});
        runner.assert(removeOldCacheResult === 0, "removeOldCache should return 0, got " + removeOldCacheResult);

        // removeCacheByUri
        const callTime3 = Date.now();
        const removeCacheByUriResult = await cacheMgr.removeCacheByUri("https://example.com/cached.mp4");
        this.assertLogEntry(runner, "removeCacheByUri", callTime3, {
            uri: "https://example.com/cached.mp4",
        });
        runner.assert(removeCacheByUriResult === 0, "removeCacheByUri should return 0, got " + removeCacheByUriResult);

        // setCacheDir
        const callTime4 = Date.now();
        const setCacheDirResult = await cacheMgr.setCacheDir("/tmp/agora_cache");
        this.assertLogEntry(runner, "setCacheDir", callTime4, { path: "/tmp/agora_cache" });
        runner.assert(setCacheDirResult === 0, "setCacheDir should return 0, got " + setCacheDirResult);

        // setMaxCacheFileCount
        const callTime5 = Date.now();
        const setMaxCacheFileCountResult = await cacheMgr.setMaxCacheFileCount(100);
        this.assertLogEntry(runner, "setMaxCacheFileCount", callTime5, { count: 100 });
        runner.assert(
            setMaxCacheFileCountResult === 0,
            "setMaxCacheFileCount should return 0, got " + setMaxCacheFileCountResult,
        );

        // setMaxCacheFileSize
        const callTime6 = Date.now();
        const setMaxCacheFileSizeResult = await cacheMgr.setMaxCacheFileSize(1024 * 1024 * 100);
        this.assertLogEntry(runner, "setMaxCacheFileSize", callTime6, { cacheSize: 1024 * 1024 * 100 });
        runner.assert(
            setMaxCacheFileSizeResult === 0,
            "setMaxCacheFileSize should return 0, got " + setMaxCacheFileSizeResult,
        );

        // enableAutoRemoveCache
        const callTime7 = Date.now();
        const enableAutoRemoveCacheResult = await cacheMgr.enableAutoRemoveCache(true);
        this.assertLogEntry(runner, "enableAutoRemoveCache", callTime7, { enable: true });
        runner.assert(
            enableAutoRemoveCacheResult === 0,
            "enableAutoRemoveCache should return 0, got " + enableAutoRemoveCacheResult,
        );

        // getCacheDir
        const callTime8 = Date.now();
        const getCacheDirResult = await cacheMgr.getCacheDir();
        this.assertLogEntry(runner, "getCacheDir", callTime8, {});
        runner.assert(
            getCacheDirResult.errorCode === 0,
            "getCacheDir.errorCode should be 0, got " + getCacheDirResult.errorCode,
        );

        // getMaxCacheFileCount
        const callTime9 = Date.now();
        const getMaxCacheFileCountResult = await cacheMgr.getMaxCacheFileCount();
        this.assertLogEntry(runner, "getMaxCacheFileCount", callTime9, {});
        runner.assert(
            getMaxCacheFileCountResult === 0,
            "getMaxCacheFileCount should return 0, got " + getMaxCacheFileCountResult,
        );

        // getMaxCacheFileSize
        const callTime10 = Date.now();
        const maxCacheFileSizeResult = await cacheMgr.getMaxCacheFileSize();
        this.assertLogEntry(runner, "getMaxCacheFileSize", callTime10, {});
        runner.assert(
            typeof maxCacheFileSizeResult === "number",
            "getMaxCacheFileSize should return number, not bigint",
        );
        runner.assert(
            maxCacheFileSizeResult === 0,
            "getMaxCacheFileSize should return 0, got " + maxCacheFileSizeResult,
        );

        // getCacheFileCount
        const callTime11 = Date.now();
        const getCacheFileCountResult = await cacheMgr.getCacheFileCount();
        this.assertLogEntry(runner, "getCacheFileCount", callTime11, {});
        runner.assert(
            getCacheFileCountResult === 0,
            "getCacheFileCount should return 0, got " + getCacheFileCountResult,
        );

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IVideoEffectObject ────────────────────────────

    private async testVideoEffectObject(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: VideoEffectObject ---");
        const bridge = this.createBridgeAndInit();

        const effect: IVideoEffectObject = await bridge.createVideoEffectObject("", 0);
        runner.assert(effect !== null, "createVideoEffectObject should return non-null");

        // addOrUpdateVideoEffect
        const callTime1 = Date.now();
        const addOrUpdateVideoEffectResult = await effect.addOrUpdateVideoEffect(1, "effect_template_1");
        this.assertLogEntry(runner, "addOrUpdateVideoEffect", callTime1, {
            nodeId: 1,
            templateName: "effect_template_1",
        });
        runner.assert(
            addOrUpdateVideoEffectResult === 0,
            "addOrUpdateVideoEffect should return 0, got " + addOrUpdateVideoEffectResult,
        );

        // removeVideoEffect
        const callTime2 = Date.now();
        const removeVideoEffectResult = await effect.removeVideoEffect(1);
        this.assertLogEntry(runner, "removeVideoEffect", callTime2, { nodeId: 1 });
        runner.assert(
            removeVideoEffectResult === 0,
            "removeVideoEffect should return 0, got " + removeVideoEffectResult,
        );

        // performVideoEffectAction
        const callTime3 = Date.now();
        const performVideoEffectActionResult = await effect.performVideoEffectAction(1, VIDEO_EFFECT_ACTION.SAVE);
        this.assertLogEntry(runner, "performVideoEffectAction", callTime3, {
            nodeId: 1,
            actionId: 1,
        });
        runner.assert(
            performVideoEffectActionResult === 0,
            "performVideoEffectAction should return 0, got " + performVideoEffectActionResult,
        );

        // setVideoEffectFloatParam
        const callTime4 = Date.now();
        const setVideoEffectFloatParamResult = await effect.setVideoEffectFloatParam("option1", "key1", 1.5);
        this.assertLogEntry(runner, "setVideoEffectFloatParam", callTime4, {
            option: "option1",
            key: "key1",
            param: 1.5,
        });
        runner.assert(
            setVideoEffectFloatParamResult === 0,
            "setVideoEffectFloatParam should return 0, got " + setVideoEffectFloatParamResult,
        );

        // setVideoEffectIntParam
        const callTime5 = Date.now();
        const setVideoEffectIntParamResult = await effect.setVideoEffectIntParam("option2", "key2", 42);
        this.assertLogEntry(runner, "setVideoEffectIntParam", callTime5, {
            option: "option2",
            key: "key2",
            param: 42,
        });
        runner.assert(
            setVideoEffectIntParamResult === 0,
            "setVideoEffectIntParam should return 0, got " + setVideoEffectIntParamResult,
        );

        // setVideoEffectBoolParam
        const callTime6 = Date.now();
        const setVideoEffectBoolParamResult = await effect.setVideoEffectBoolParam("option3", "key3", true);
        this.assertLogEntry(runner, "setVideoEffectBoolParam", callTime6, {
            option: "option3",
            key: "key3",
            param: true,
        });
        runner.assert(
            setVideoEffectBoolParamResult === 0,
            "setVideoEffectBoolParam should return 0, got " + setVideoEffectBoolParamResult,
        );

        // getVideoEffectFloatParam
        const callTime7 = Date.now();
        const getVideoEffectFloatParamResult = await effect.getVideoEffectFloatParam("option1", "key1");
        this.assertLogEntry(runner, "getVideoEffectFloatParam", callTime7, {
            option: "option1",
            key: "key1",
        });
        runner.assert(
            getVideoEffectFloatParamResult === 0,
            "getVideoEffectFloatParam should return 0, got " + getVideoEffectFloatParamResult,
        );

        // getVideoEffectIntParam
        const callTime8 = Date.now();
        const getVideoEffectIntParamResult = await effect.getVideoEffectIntParam("option2", "key2");
        this.assertLogEntry(runner, "getVideoEffectIntParam", callTime8, {
            option: "option2",
            key: "key2",
        });
        runner.assert(
            getVideoEffectIntParamResult === 0,
            "getVideoEffectIntParam should return 0, got " + getVideoEffectIntParamResult,
        );

        // getVideoEffectBoolParam
        const callTime9 = Date.now();
        const getVideoEffectBoolParamResult = await effect.getVideoEffectBoolParam("option3", "key3");
        this.assertLogEntry(runner, "getVideoEffectBoolParam", callTime9, {
            option: "option3",
            key: "key3",
        });
        runner.assert(
            typeof getVideoEffectBoolParamResult === "boolean",
            "getVideoEffectBoolParam should return boolean, got " + typeof getVideoEffectBoolParamResult,
        );

        await bridge.destroyVideoEffectObject(effect);
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IAudioDeviceCollection (order matches IAudioDeviceCollection.ts) ────────────────────────────

    private async testAudioDeviceCollection(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: AudioDeviceCollection ---");
        const bridge = this.createBridgeAndInit();

        const mgr: IAudioDeviceManager = await bridge.getAudioDeviceManager();
        runner.assert(mgr !== null, "getAudioDeviceManager should return non-null");

        // enumeratePlaybackDevices returns IAudioDeviceCollection
        const playbackCollection: IAudioDeviceCollection = await mgr.enumeratePlaybackDevices();
        runner.assert(playbackCollection !== null, "enumeratePlaybackDevices should return non-null");

        if (playbackCollection) {
            // 1. getCount
            const callTime1 = Date.now();
            const count = await playbackCollection.getCount();
            this.assertLogEntry(runner, "getCount", callTime1, {});
            runner.assert(count === 0, "getCount should return 0, got " + count);

            // 2. getDeviceType
            const callTime2 = Date.now();
            const getDeviceTypeResult = await playbackCollection.getDeviceType(0);
            this.assertLogEntry(runner, "getDeviceType", callTime2, { index: 0 });
            runner.assert(
                getDeviceTypeResult.errorCode === 0,
                "getDeviceType.errorCode should be 0, got " + getDeviceTypeResult.errorCode,
            );

            // 3. setDevice
            const callTime3 = Date.now();
            const setPlaybackCollectionDeviceResult = await playbackCollection.setDevice("test-device-id");
            this.assertLogEntry(runner, "setDevice", callTime3, { deviceId: "test-device-id" });
            runner.assert(
                setPlaybackCollectionDeviceResult === 0,
                "setDevice should return 0, got " + setPlaybackCollectionDeviceResult,
            );

            // 4. getDefaultDeviceType
            const callTime4 = Date.now();
            const getDefaultDeviceTypeResult = await playbackCollection.getDefaultDeviceType();
            this.assertLogEntry(runner, "getDefaultDeviceType", callTime4, {});
            runner.assert(
                getDefaultDeviceTypeResult.errorCode === 0,
                "getDefaultDeviceType.errorCode should be 0, got " + getDefaultDeviceTypeResult.errorCode,
            );

            // 5. setApplicationVolume
            const callTime5 = Date.now();
            const setApplicationVolumeResult = await playbackCollection.setApplicationVolume(80);
            this.assertLogEntry(runner, "setApplicationVolume", callTime5, { volume: 80 });
            runner.assert(
                setApplicationVolumeResult === 0,
                "setApplicationVolume should return 0, got " + setApplicationVolumeResult,
            );

            // 6. getApplicationVolume
            const callTime6 = Date.now();
            const getApplicationVolumeResult = await playbackCollection.getApplicationVolume();
            this.assertLogEntry(runner, "getApplicationVolume", callTime6, {});
            runner.assert(
                getApplicationVolumeResult.errorCode === 0,
                "getApplicationVolume.errorCode should be 0, got " + getApplicationVolumeResult.errorCode,
            );
            runner.assert(
                getApplicationVolumeResult.volume === 50,
                "getApplicationVolume.volume should be 50, got " + getApplicationVolumeResult.volume,
            );

            // 7. setApplicationMute
            const callTime7 = Date.now();
            const setApplicationMuteResult = await playbackCollection.setApplicationMute(true);
            this.assertLogEntry(runner, "setApplicationMute", callTime7, { mute: true });
            runner.assert(
                setApplicationMuteResult === 0,
                "setApplicationMute should return 0, got " + setApplicationMuteResult,
            );

            // 8. isApplicationMute
            const callTime8 = Date.now();
            const isApplicationMuteResult = await playbackCollection.isApplicationMute();
            this.assertLogEntry(runner, "isApplicationMute", callTime8, {});
            runner.assert(
                isApplicationMuteResult.errorCode === 0,
                "isApplicationMute.errorCode should be 0, got " + isApplicationMuteResult.errorCode,
            );
            runner.assert(
                isApplicationMuteResult.mute === false,
                "isApplicationMute.mute should be false, got " + isApplicationMuteResult.mute,
            );
        }

        // enumerateRecordingDevices returns IAudioDeviceCollection
        const recordingCollection: IAudioDeviceCollection = await mgr.enumerateRecordingDevices();
        runner.assert(recordingCollection !== null, "enumerateRecordingDevices should return non-null");

        if (recordingCollection) {
            // 1. getCount
            const callTime10 = Date.now();
            const recordingCount = await recordingCollection.getCount();
            this.assertLogEntry(runner, "getCount", callTime10, {});
            runner.assert(recordingCount === 0, "getCount should return 0, got " + recordingCount);

            // 2. getDeviceType
            const callTime11 = Date.now();
            const getRecordingDeviceTypeResult = await recordingCollection.getDeviceType(0);
            this.assertLogEntry(runner, "getDeviceType", callTime11, { index: 0 });
            runner.assert(
                getRecordingDeviceTypeResult.errorCode === 0,
                "getDeviceType.errorCode should be 0, got " + getRecordingDeviceTypeResult.errorCode,
            );

            // 3. setDevice
            const callTime12 = Date.now();
            const setRecordingCollectionDeviceResult = await recordingCollection.setDevice("test-recording-device-id");
            this.assertLogEntry(runner, "setDevice", callTime12, { deviceId: "test-recording-device-id" });
            runner.assert(
                setRecordingCollectionDeviceResult === 0,
                "setDevice should return 0, got " + setRecordingCollectionDeviceResult,
            );

            // 4. getDefaultDeviceType
            const callTime13 = Date.now();
            const getRecordingDefaultDeviceTypeResult = await recordingCollection.getDefaultDeviceType();
            this.assertLogEntry(runner, "getDefaultDeviceType", callTime13, {});
            runner.assert(
                getRecordingDefaultDeviceTypeResult.errorCode === 0,
                "getDefaultDeviceType.errorCode should be 0, got " + getRecordingDefaultDeviceTypeResult.errorCode,
            );

            // 5. setApplicationVolume
            const callTime14 = Date.now();
            const setRecordingApplicationVolumeResult = await recordingCollection.setApplicationVolume(50);
            this.assertLogEntry(runner, "setApplicationVolume", callTime14, { volume: 50 });
            runner.assert(
                setRecordingApplicationVolumeResult === 0,
                "setApplicationVolume should return 0, got " + setRecordingApplicationVolumeResult,
            );

            // 6. getApplicationVolume
            const callTime15 = Date.now();
            const getRecordingApplicationVolumeResult = await recordingCollection.getApplicationVolume();
            this.assertLogEntry(runner, "getApplicationVolume", callTime15, {});
            runner.assert(
                getRecordingApplicationVolumeResult.errorCode === 0,
                "getApplicationVolume.errorCode should be 0, got " + getRecordingApplicationVolumeResult.errorCode,
            );
            runner.assert(
                getRecordingApplicationVolumeResult.volume === 50,
                "getApplicationVolume.volume should be 50, got " + getRecordingApplicationVolumeResult.volume,
            );

            // 7. setApplicationMute
            const callTime16 = Date.now();
            const setRecordingApplicationMuteResult = await recordingCollection.setApplicationMute(false);
            this.assertLogEntry(runner, "setApplicationMute", callTime16, { mute: false });
            runner.assert(
                setRecordingApplicationMuteResult === 0,
                "setApplicationMute should return 0, got " + setRecordingApplicationMuteResult,
            );

            // 8. isApplicationMute
            const callTime17 = Date.now();
            const isRecordingApplicationMuteResult = await recordingCollection.isApplicationMute();
            this.assertLogEntry(runner, "isApplicationMute", callTime17, {});
            runner.assert(
                isRecordingApplicationMuteResult.errorCode === 0,
                "isApplicationMute.errorCode should be 0, got " + isRecordingApplicationMuteResult.errorCode,
            );
            runner.assert(
                isRecordingApplicationMuteResult.mute === false,
                "isApplicationMute.mute should be false, got " + isRecordingApplicationMuteResult.mute,
            );
        }

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IVideoDeviceCollection (order matches IVideoDeviceCollection.ts) ────────────────────────────

    private async testVideoDeviceCollection(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: VideoDeviceCollection ---");
        const bridge = this.createBridgeAndInit();

        const mgr: IVideoDeviceManager = await bridge.getVideoDeviceManager();
        runner.assert(mgr !== null, "getVideoDeviceManager should return non-null");

        // enumerateVideoDevices returns IVideoDeviceCollection
        const collection: IVideoDeviceCollection = await mgr.enumerateVideoDevices();
        runner.assert(collection !== null, "enumerateVideoDevices should return non-null");

        if (collection) {
            // 1. getCount
            const callTime1 = Date.now();
            const videoCount = await collection.getCount();
            this.assertLogEntry(runner, "getCount", callTime1, {});
            runner.assert(videoCount === 0, "getCount should return 0, got " + videoCount);

            // 2. setDevice
            const callTime2 = Date.now();
            const setVideoCollectionDeviceResult = await collection.setDevice("test-video-device-id");
            this.assertLogEntry(runner, "setDevice", callTime2, { deviceId: "test-video-device-id" });
            runner.assert(
                setVideoCollectionDeviceResult === 0,
                "setDevice should return 0, got " + setVideoCollectionDeviceResult,
            );

            // 3. getDevice
            const callTime3 = Date.now();
            const getVideoCollectionDeviceResult = await collection.getDevice(0);
            this.assertLogEntry(runner, "getDevice", callTime3, { index: 0 });
            runner.assert(
                getVideoCollectionDeviceResult.errorCode === 0,
                "getDevice.errorCode should be 0, got " + getVideoCollectionDeviceResult.errorCode,
            );
        }

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IMediaRecorder ────────────────────────────

    private async testMediaRecorder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MediaRecorder ---");
        const bridge = this.createBridgeAndInit();

        const recorder: IMediaRecorder = await bridge.createMediaRecorder({
            channelId: "test-channel",
            uid: 0,
            type: 0, // RECORDER_STREAM_TYPE_AUDIO
        });
        runner.assert(recorder !== null, "createMediaRecorder should return non-null");

        // setMediaRecorderObserver
        const callTime1 = Date.now();
        const setMediaRecorderObserverResult = await recorder.setMediaRecorderObserver({
            onRecorderStateChanged: () => {},
            onRecorderInfoUpdated: () => {},
        } as any);
        this.assertLogEntry(runner, "setMediaRecorderObserver", callTime1, {});
        runner.assert(
            setMediaRecorderObserverResult === 0,
            "setMediaRecorderObserver should return 0, got " + setMediaRecorderObserverResult,
        );

        // startRecording
        const callTime2 = Date.now();
        const startRecordingResult = await recorder.startRecording({
            storagePath: "/tmp/record.mp4",
            containerFormat: 1,
            streamType: 1,
            maxDurationMs: 60000,
            recorderInfoUpdateInterval: 1000,
            width: 640,
            height: 480,
            fps: 30,
            sample_rate: 44100,
            channel_num: 2,
            videoSourceType: 0,
        });
        this.assertLogEntry(runner, "startRecording", callTime2, {
            storagePath: "/tmp/record.mp4",
            containerFormat: 1,
            streamType: 1,
            maxDurationMs: 60000,
            recorderInfoUpdateInterval: 1000,
        });
        runner.assert(startRecordingResult === 0, "startRecording should return 0, got " + startRecordingResult);

        // stopRecording
        const callTime3 = Date.now();
        const stopRecordingResult = await recorder.stopRecording();
        this.assertLogEntry(runner, "stopRecording", callTime3, {});
        runner.assert(stopRecordingResult === 0, "stopRecording should return 0, got " + stopRecordingResult);

        await bridge.destroyMediaRecorder(recorder);
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IMusicPlayer (order: IMusicPlayer methods first, then inherited IMediaPlayer methods) ────────────────────────────

    private async testMusicPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MusicPlayer ---");
        const bridge = this.createBridgeAndInit();

        const mcc: IMusicContentCenter = await bridge.getMusicContentCenter();
        runner.assert(mcc !== null, "getMusicContentCenter should return non-null");

        // createMusicPlayer
        const callTime1 = Date.now();
        const player: IMusicPlayer = await mcc.createMusicPlayer();
        this.assertLogEntry(runner, "createMusicPlayer", callTime1, {});

        if (player) {
            // === IMusicPlayer specific methods ===

            // 1. openWithSongCode
            const callTime2 = Date.now();
            const openWithSongCodeResult = await player.openWithSongCode(12345, 0);
            this.assertLogEntry(runner, "openWithSongCode", callTime2, {
                songCode: 12345,
                startPos: 0,
            });
            runner.assert(
                openWithSongCodeResult === 0,
                "openWithSongCode should return 0, got " + openWithSongCodeResult,
            );

            // 2. setPlayMode
            const callTime3 = Date.now();
            const setPlayModeResult = await player.setPlayMode(1);
            this.assertLogEntry(runner, "setPlayMode", callTime3, { mode: 1 });
            runner.assert(setPlayModeResult === 0, "setPlayMode should return 0, got " + setPlayModeResult);

            // === Inherited IMediaPlayer methods (order matches IMediaPlayer.ts) ===

            // 3. getId
            const callTime4 = Date.now();
            const musicPlayerId = await player.getId();
            this.assertLogEntry(runner, "getId", callTime4, {});
            runner.assert(musicPlayerId === 2, "getId should return 2 (second player), got " + musicPlayerId);

            // // 4. registerPlayerSourceObserver not need ut
            // const callTime5 = Date.now();
            // await player.registerPlayerSourceObserver({} as any);
            // this.assertLogEntry(runner, "registerPlayerSourceObserver", callTime5, {});

            // 5. open
            const callTime6 = Date.now();
            const musicPlayerOpenResult = await player.open("https://example.com/music.mp3", 0);
            this.assertLogEntry(runner, "open", callTime6, {
                url: "https://example.com/music.mp3",
                startPos: 0,
            });
            runner.assert(musicPlayerOpenResult === 0, "open should return 0, got " + musicPlayerOpenResult);

            // 6. openWithMediaSource
            const callTime7 = Date.now();
            const musicPlayerOpenWithMediaSourceResult = await player.openWithMediaSource({
                url: "https://example.com/source.mp3",
                uri: "https://example.com/source.mp3",
                startPos: 0,
                autoPlay: false,
                enableCache: false,
                enableMultiAudioTrack: false,
            });
            this.assertLogEntry(runner, "openWithMediaSource", callTime7, {
                url: "https://example.com/source.mp3",
                uri: "https://example.com/source.mp3",
                startPos: 0,
                autoPlay: false,
                enableCache: false,
                enableMultiAudioTrack: false,
            });
            runner.assert(
                musicPlayerOpenWithMediaSourceResult === 0,
                "openWithMediaSource should return 0, got " + musicPlayerOpenWithMediaSourceResult,
            );

            // 7. play
            const callTime8 = Date.now();
            const musicPlayerPlayResult = await player.play();
            this.assertLogEntry(runner, "play", callTime8, {});
            runner.assert(musicPlayerPlayResult === 0, "play should return 0, got " + musicPlayerPlayResult);

            // 8. pause
            const callTime9 = Date.now();
            const musicPlayerPauseResult = await player.pause();
            this.assertLogEntry(runner, "pause", callTime9, {});
            runner.assert(musicPlayerPauseResult === 0, "pause should return 0, got " + musicPlayerPauseResult);

            // 9. stop
            const callTime10 = Date.now();
            const musicPlayerStopResult = await player.stop();
            this.assertLogEntry(runner, "stop", callTime10, {});
            runner.assert(musicPlayerStopResult === 0, "stop should return 0, got " + musicPlayerStopResult);

            // 10. resume
            const callTime11 = Date.now();
            const musicPlayerResumeResult = await player.resume();
            this.assertLogEntry(runner, "resume", callTime11, {});
            runner.assert(musicPlayerResumeResult === 0, "resume should return 0, got " + musicPlayerResumeResult);

            // 11. seek
            const callTime12 = Date.now();
            const musicPlayerSeekResult = await player.seek(5000);
            this.assertLogEntry(runner, "seek", callTime12, { newPos: 5000 });
            runner.assert(musicPlayerSeekResult === 0, "seek should return 0, got " + musicPlayerSeekResult);

            // 12. setAudioPitch
            const callTime13 = Date.now();
            const musicPlayerSetAudioPitchResult = await player.setAudioPitch(2);
            this.assertLogEntry(runner, "setAudioPitch", callTime13, { pitch: 2 });
            runner.assert(
                musicPlayerSetAudioPitchResult === 0,
                "setAudioPitch should return 0, got " + musicPlayerSetAudioPitchResult,
            );

            // 13. getDuration
            const callTime14 = Date.now();
            const musicPlayerDurationResult = await player.getDuration();
            this.assertLogEntry(runner, "getDuration", callTime14, {});
            runner.assert(
                musicPlayerDurationResult.errorCode === 0,
                "getDuration.errorCode should be 0, got " + musicPlayerDurationResult.errorCode,
            );
            runner.assert(
                musicPlayerDurationResult.duration === 0,
                "getDuration.duration should be 0, got " + musicPlayerDurationResult.duration,
            );

            // 14. getPlayPosition
            const callTime15 = Date.now();
            const musicPlayerPlayPosResult = await player.getPlayPosition();
            this.assertLogEntry(runner, "getPlayPosition", callTime15, {});
            runner.assert(
                musicPlayerPlayPosResult.errorCode === 0,
                "getPlayPosition.errorCode should be 0, got " + musicPlayerPlayPosResult.errorCode,
            );
            runner.assert(
                musicPlayerPlayPosResult.pos === 0,
                "getPlayPosition.pos should be 0, got " + musicPlayerPlayPosResult.pos,
            );

            // 15. getStreamCount
            const callTime16 = Date.now();
            const musicPlayerStreamCountResult = await player.getStreamCount();
            this.assertLogEntry(runner, "getStreamCount", callTime16, {});
            runner.assert(
                musicPlayerStreamCountResult.errorCode === 0,
                "getStreamCount.errorCode should be 0, got " + musicPlayerStreamCountResult.errorCode,
            );
            runner.assert(
                musicPlayerStreamCountResult.count === 0,
                "getStreamCount.count should be 0, got " + musicPlayerStreamCountResult.count,
            );

            // 16. getStreamInfo
            const callTime17 = Date.now();
            const musicPlayerStreamInfoResult = await player.getStreamInfo(0);
            this.assertLogEntry(runner, "getStreamInfo", callTime17, { index: 0 });
            runner.assert(
                musicPlayerStreamInfoResult.errorCode === 0,
                "getStreamInfo.errorCode should be 0, got " + musicPlayerStreamInfoResult.errorCode,
            );

            // 17. setLoopCount
            const callTime18 = Date.now();
            const musicPlayerSetLoopCountResult = await player.setLoopCount(3);
            this.assertLogEntry(runner, "setLoopCount", callTime18, { loopCount: 3 });
            runner.assert(
                musicPlayerSetLoopCountResult === 0,
                "setLoopCount should return 0, got " + musicPlayerSetLoopCountResult,
            );

            // 18. setPlaybackSpeed
            const callTime19 = Date.now();
            const musicPlayerSetPlaybackSpeedResult = await player.setPlaybackSpeed(120);
            this.assertLogEntry(runner, "setPlaybackSpeed", callTime19, { speed: 120 });
            runner.assert(
                musicPlayerSetPlaybackSpeedResult === 0,
                "setPlaybackSpeed should return 0, got " + musicPlayerSetPlaybackSpeedResult,
            );

            // 19. selectAudioTrack
            const callTime20 = Date.now();
            const musicPlayerSelectAudioTrackResult = await player.selectAudioTrack(1);
            this.assertLogEntry(runner, "selectAudioTrack", callTime20, { index: 1 });
            runner.assert(
                musicPlayerSelectAudioTrackResult === 0,
                "selectAudioTrack should return 0, got " + musicPlayerSelectAudioTrackResult,
            );

            // 20. selectMultiAudioTrack
            const callTime21 = Date.now();
            const musicPlayerSelectMultiAudioTrackResult = await player.selectMultiAudioTrack(0, 1);
            this.assertLogEntry(runner, "selectMultiAudioTrack", callTime21, {
                playoutTrackIndex: 0,
                publishTrackIndex: 1,
            });
            runner.assert(
                musicPlayerSelectMultiAudioTrackResult === 0,
                "selectMultiAudioTrack should return 0, got " + musicPlayerSelectMultiAudioTrackResult,
            );

            // 21. setPlayerOption
            const callTime22 = Date.now();
            const musicPlayerSetPlayerOptionResult = await player.setPlayerOption("key", 100);
            this.assertLogEntry(runner, "setPlayerOption", callTime22, { key: "key", value: 100 });
            runner.assert(
                musicPlayerSetPlayerOptionResult === 0,
                "setPlayerOption should return 0, got " + musicPlayerSetPlayerOptionResult,
            );

            // 22. takeScreenshot
            const callTime23 = Date.now();
            const musicPlayerTakeScreenshotResult = await player.takeScreenshot("/tmp/screenshot.png");
            this.assertLogEntry(runner, "takeScreenshot", callTime23, {
                filename: "/tmp/screenshot.png",
            });
            runner.assert(
                musicPlayerTakeScreenshotResult === 0,
                "takeScreenshot should return 0, got " + musicPlayerTakeScreenshotResult,
            );

            // 23. selectInternalSubtitle
            const callTime24 = Date.now();
            const musicPlayerSelectInternalSubtitleResult = await player.selectInternalSubtitle(2);
            this.assertLogEntry(runner, "selectInternalSubtitle", callTime24, { index: 2 });
            runner.assert(
                musicPlayerSelectInternalSubtitleResult === 0,
                "selectInternalSubtitle should return 0, got " + musicPlayerSelectInternalSubtitleResult,
            );

            // 24. setExternalSubtitle
            const callTime25 = Date.now();
            const musicPlayerSetExternalSubtitleResult =
                await player.setExternalSubtitle("https://example.com/sub.srt");
            this.assertLogEntry(runner, "setExternalSubtitle", callTime25, {
                url: "https://example.com/sub.srt",
            });
            runner.assert(
                musicPlayerSetExternalSubtitleResult === 0,
                "setExternalSubtitle should return 0, got " + musicPlayerSetExternalSubtitleResult,
            );

            // 25. getState
            const callTime26 = Date.now();
            const musicPlayerStateResult = await player.getState();
            this.assertLogEntry(runner, "getState", callTime26, {});
            runner.assert(
                musicPlayerStateResult === 0,
                "getState should return PLAYER_STATE_IDLE (0), got " + musicPlayerStateResult,
            );

            // 26. mute
            const callTime27 = Date.now();
            const musicPlayerMuteResult = await player.mute(true);
            this.assertLogEntry(runner, "mute", callTime27, { muted: true });
            runner.assert(musicPlayerMuteResult === 0, "mute should return 0, got " + musicPlayerMuteResult);

            // 27. getMute
            const callTime28 = Date.now();
            const musicPlayerGetMuteResult = await player.getMute();
            this.assertLogEntry(runner, "getMute", callTime28, {});
            runner.assert(
                musicPlayerGetMuteResult.errorCode === 0,
                "getMute.errorCode should be 0, got " + musicPlayerGetMuteResult.errorCode,
            );
            runner.assert(
                musicPlayerGetMuteResult.muted === false,
                "getMute.muted should be false, got " + musicPlayerGetMuteResult.muted,
            );

            // 28. adjustPlayoutVolume
            const callTime29 = Date.now();
            const musicPlayerAdjustPlayoutVolumeResult = await player.adjustPlayoutVolume(80);
            this.assertLogEntry(runner, "adjustPlayoutVolume", callTime29, { volume: 80 });
            runner.assert(
                musicPlayerAdjustPlayoutVolumeResult === 0,
                "adjustPlayoutVolume should return 0, got " + musicPlayerAdjustPlayoutVolumeResult,
            );

            // 29. getPlayoutVolume
            const callTime30 = Date.now();
            const musicPlayerGetPlayoutVolumeResult = await player.getPlayoutVolume();
            this.assertLogEntry(runner, "getPlayoutVolume", callTime30, {});
            runner.assert(
                musicPlayerGetPlayoutVolumeResult.errorCode === 0,
                "getPlayoutVolume.errorCode should be 0, got " + musicPlayerGetPlayoutVolumeResult.errorCode,
            );
            runner.assert(
                musicPlayerGetPlayoutVolumeResult.volume === 0,
                "getPlayoutVolume.volume should be 0, got " + musicPlayerGetPlayoutVolumeResult.volume,
            );

            // 30. adjustPublishSignalVolume
            const callTime31 = Date.now();
            const musicPlayerAdjustPublishSignalVolumeResult = await player.adjustPublishSignalVolume(90);
            this.assertLogEntry(runner, "adjustPublishSignalVolume", callTime31, { volume: 90 });
            runner.assert(
                musicPlayerAdjustPublishSignalVolumeResult === 0,
                "adjustPublishSignalVolume should return 0, got " + musicPlayerAdjustPublishSignalVolumeResult,
            );

            // 31. getPublishSignalVolume
            const callTime32 = Date.now();
            const musicPlayerGetPublishSignalVolumeResult = await player.getPublishSignalVolume();
            this.assertLogEntry(runner, "getPublishSignalVolume", callTime32, {});
            runner.assert(
                musicPlayerGetPublishSignalVolumeResult.errorCode === 0,
                "getPublishSignalVolume.errorCode should be 0, got " +
                    musicPlayerGetPublishSignalVolumeResult.errorCode,
            );
            runner.assert(
                musicPlayerGetPublishSignalVolumeResult.volume === 0,
                "getPublishSignalVolume.volume should be 0, got " + musicPlayerGetPublishSignalVolumeResult.volume,
            );

            // 32. setAudioDualMonoMode
            const callTime33 = Date.now();
            const musicPlayerSetAudioDualMonoModeResult = await player.setAudioDualMonoMode(0);
            this.assertLogEntry(runner, "setAudioDualMonoMode", callTime33, { mode: 0 });
            runner.assert(
                musicPlayerSetAudioDualMonoModeResult === 0,
                "setAudioDualMonoMode should return 0, got " + musicPlayerSetAudioDualMonoModeResult,
            );

            // 33. getPlayerSdkVersion
            const callTime34 = Date.now();
            const musicPlayerSdkVersionResult = await player.getPlayerSdkVersion();
            this.assertLogEntry(runner, "getPlayerSdkVersion", callTime34, {});
            runner.assert(
                musicPlayerSdkVersionResult === "1.0.0-mock",
                "getPlayerSdkVersion should return '1.0.0-mock', got '" + musicPlayerSdkVersionResult + "'",
            );

            // 34. getPlaySrc
            const callTime35 = Date.now();
            const musicPlayerPlaySrcResult = await player.getPlaySrc();
            this.assertLogEntry(runner, "getPlaySrc", callTime35, {});
            runner.assert(
                musicPlayerPlaySrcResult === "",
                "getPlaySrc should return '', got '" + musicPlayerPlaySrcResult + "'",
            );

            // 35. openWithAgoraCDNSrc
            const callTime36 = Date.now();
            const musicPlayerOpenWithAgoraCDNSrcResult = await player.openWithAgoraCDNSrc(
                "https://cdn.example.com/music.mp3",
                0,
            );
            this.assertLogEntry(runner, "openWithAgoraCDNSrc", callTime36, {
                src: "https://cdn.example.com/music.mp3",
                startPos: 0,
            });
            runner.assert(
                musicPlayerOpenWithAgoraCDNSrcResult === 0,
                "openWithAgoraCDNSrc should return 0, got " + musicPlayerOpenWithAgoraCDNSrcResult,
            );

            // 36. getAgoraCDNLineCount
            const callTime37 = Date.now();
            const musicPlayerAgoraCDNLineCountResult = await player.getAgoraCDNLineCount();
            this.assertLogEntry(runner, "getAgoraCDNLineCount", callTime37, {});
            runner.assert(
                musicPlayerAgoraCDNLineCountResult === 0,
                "getAgoraCDNLineCount should return 0, got " + musicPlayerAgoraCDNLineCountResult,
            );

            // 37. switchAgoraCDNLineByIndex
            const callTime38 = Date.now();
            const musicPlayerSwitchAgoraCDNLineByIndexResult = await player.switchAgoraCDNLineByIndex(1);
            this.assertLogEntry(runner, "switchAgoraCDNLineByIndex", callTime38, { index: 1 });
            runner.assert(
                musicPlayerSwitchAgoraCDNLineByIndexResult === 0,
                "switchAgoraCDNLineByIndex should return 0, got " + musicPlayerSwitchAgoraCDNLineByIndexResult,
            );

            // 38. getCurrentAgoraCDNIndex
            const callTime39 = Date.now();
            const musicPlayerCurrentAgoraCDNIndexResult = await player.getCurrentAgoraCDNIndex();
            this.assertLogEntry(runner, "getCurrentAgoraCDNIndex", callTime39, {});
            runner.assert(
                musicPlayerCurrentAgoraCDNIndexResult === 0,
                "getCurrentAgoraCDNIndex should return 0, got " + musicPlayerCurrentAgoraCDNIndexResult,
            );

            // 39. enableAutoSwitchAgoraCDN
            const callTime40 = Date.now();
            const musicPlayerEnableAutoSwitchAgoraCDNResult = await player.enableAutoSwitchAgoraCDN(true);
            this.assertLogEntry(runner, "enableAutoSwitchAgoraCDN", callTime40, { enable: true });
            runner.assert(
                musicPlayerEnableAutoSwitchAgoraCDNResult === 0,
                "enableAutoSwitchAgoraCDN should return 0, got " + musicPlayerEnableAutoSwitchAgoraCDNResult,
            );

            // 40. renewAgoraCDNSrcToken
            const callTime41 = Date.now();
            const musicPlayerRenewAgoraCDNSrcTokenResult = await player.renewAgoraCDNSrcToken("newToken", 12345);
            this.assertLogEntry(runner, "renewAgoraCDNSrcToken", callTime41, {
                token: "newToken",
                ts: 12345,
            });
            runner.assert(
                musicPlayerRenewAgoraCDNSrcTokenResult === 0,
                "renewAgoraCDNSrcToken should return 0, got " + musicPlayerRenewAgoraCDNSrcTokenResult,
            );

            // 41. switchAgoraCDNSrc
            const callTime42 = Date.now();
            const musicPlayerSwitchAgoraCDNSrcResult = await player.switchAgoraCDNSrc(
                "https://cdn2.example.com/music.mp3",
                true,
            );
            this.assertLogEntry(runner, "switchAgoraCDNSrc", callTime42, {
                src: "https://cdn2.example.com/music.mp3",
                syncPts: true,
            });
            runner.assert(
                musicPlayerSwitchAgoraCDNSrcResult === 0,
                "switchAgoraCDNSrc should return 0, got " + musicPlayerSwitchAgoraCDNSrcResult,
            );

            // 42. switchSrc
            const callTime43 = Date.now();
            const musicPlayerSwitchSrcResult = await player.switchSrc("https://example.com/other.mp3", false);
            this.assertLogEntry(runner, "switchSrc", callTime43, {
                src: "https://example.com/other.mp3",
                syncPts: false,
            });
            runner.assert(
                musicPlayerSwitchSrcResult === 0,
                "switchSrc should return 0, got " + musicPlayerSwitchSrcResult,
            );

            // 43. preloadSrc
            const callTime44 = Date.now();
            const musicPlayerPreloadSrcResult = await player.preloadSrc("https://example.com/preload.mp3", 0);
            this.assertLogEntry(runner, "preloadSrc", callTime44, {
                src: "https://example.com/preload.mp3",
                startPos: 0,
            });
            runner.assert(
                musicPlayerPreloadSrcResult === 0,
                "preloadSrc should return 0, got " + musicPlayerPreloadSrcResult,
            );

            // 44. playPreloadedSrc
            const callTime45 = Date.now();
            const musicPlayerPlayPreloadedSrcResult = await player.playPreloadedSrc("https://example.com/preload.mp3");
            this.assertLogEntry(runner, "playPreloadedSrc", callTime45, {
                src: "https://example.com/preload.mp3",
            });
            runner.assert(
                musicPlayerPlayPreloadedSrcResult === 0,
                "playPreloadedSrc should return 0, got " + musicPlayerPlayPreloadedSrcResult,
            );

            // 45. unloadSrc
            const callTime46 = Date.now();
            const musicPlayerUnloadSrcResult = await player.unloadSrc("https://example.com/preload.mp3");
            this.assertLogEntry(runner, "unloadSrc", callTime46, {
                src: "https://example.com/preload.mp3",
            });
            runner.assert(
                musicPlayerUnloadSrcResult === 0,
                "unloadSrc should return 0, got " + musicPlayerUnloadSrcResult,
            );

            // 46. setSpatialAudioParams
            const callTime47 = Date.now();
            const musicPlayerSetSpatialAudioParamsResult = await player.setSpatialAudioParams({
                speaker_azimuth: 0.5,
                speaker_elevation: 0.5,
                speaker_distance: 5.0,
            });
            this.assertLogEntry(runner, "setSpatialAudioParams", callTime47, {});
            runner.assert(
                musicPlayerSetSpatialAudioParamsResult === 0,
                "setSpatialAudioParams should return 0, got " + musicPlayerSetSpatialAudioParamsResult,
            );

            // 47. setSoundPositionParams
            const callTime48 = Date.now();
            const musicPlayerSetSoundPositionParamsResult = await player.setSoundPositionParams(0.5, 10.0);
            this.assertLogEntry(runner, "setSoundPositionParams", callTime48, {
                pan: 0.5,
                gain: 10.0,
            });
            runner.assert(
                musicPlayerSetSoundPositionParamsResult === 0,
                "setSoundPositionParams should return 0, got " + musicPlayerSetSoundPositionParamsResult,
            );

            // 48. getAudioBufferDelay
            const callTime49 = Date.now();
            const musicPlayerGetAudioBufferDelayResult = await player.getAudioBufferDelay();
            this.assertLogEntry(runner, "getAudioBufferDelay", callTime49, {});
            runner.assert(
                musicPlayerGetAudioBufferDelayResult.errorCode === 0,
                "getAudioBufferDelay.errorCode should be 0, got " + musicPlayerGetAudioBufferDelayResult.errorCode,
            );
            runner.assert(
                musicPlayerGetAudioBufferDelayResult.delayMs === 0,
                "getAudioBufferDelay.delayMs should be 0, got " + musicPlayerGetAudioBufferDelayResult.delayMs,
            );

            // destroyMusicPlayer
            const callTime50 = Date.now();
            const destroyMusicPlayerResult = await mcc.destroyMusicPlayer(player);
            this.assertLogEntry(runner, "destroyMusicPlayer", callTime50, {});
            runner.assert(
                destroyMusicPlayerResult === 0,
                "destroyMusicPlayer should return 0, got " + destroyMusicPlayerResult,
            );
        }

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IScreenCaptureSourceList ────────────────────────────

    private async testScreenCaptureSourceList(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: ScreenCaptureSourceList ---");
        const bridge = this.createBridgeAndInit();

        const sources: IScreenCaptureSourceList = await bridge.getScreenCaptureSources(
            { width: 16, height: 16 },
            { width: 32, height: 32 },
            true,
        );
        runner.assert(sources !== null, "getScreenCaptureSources should return non-null");

        if (sources) {
            // getCount
            const callTime1 = Date.now();
            const screenSourceCount = await sources.getCount();
            this.assertLogEntry(runner, "getCount", callTime1, {});
            runner.assert(screenSourceCount === 0, "getCount should return 0, got " + screenSourceCount);

            // getSourceInfo
            const callTime2 = Date.now();
            const sourceInfo = sources.getSourceInfo(0);
            this.assertLogEntry(runner, "getSourceInfo", callTime2, { index: 0 });
        }

        await bridge.release(true);
        await this.delay(200);
    }
}
