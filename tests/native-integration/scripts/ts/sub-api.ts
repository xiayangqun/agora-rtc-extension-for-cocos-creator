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

        const expectedKeys = Object.keys(expectedParams);
        const actualKeys = Object.keys(entry.params);
        for (const key of actualKeys) {
            runner.assert(
                expectedKeys.indexOf(key) !== -1,
                fnName +
                    ": unexpected param '" +
                    key +
                    "' in log (value=" +
                    JSON.stringify((entry.params as any)[key]) +
                    ")",
            );
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
        for (const entry of logArray) {
            if (entry.fn === fnName && Math.abs(entry.ts - callTime) <= SubApiTestSuite.LOG_TIME_TOLERANCE) {
                return entry;
            }
        }
        return null;
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

        // 2. initEventHandler not need ut
        // const callTime2 = Date.now();
        // await player.initEventHandler({} as any);
        // this.assertLogEntry(runner, "initEventHandler", callTime2, {});

        // 3. open
        const callTime3 = Date.now();
        await player.open("https://example.com/video.mp4", 0);
        this.assertLogEntry(runner, "open", callTime3, {
            url: "https://example.com/video.mp4",
            startPos: 0,
        });

        // 4. openWithMediaSource
        const callTime4 = Date.now();
        await player.openWithMediaSource({
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

        // 5. play
        const callTime5 = Date.now();
        await player.play();
        this.assertLogEntry(runner, "play", callTime5, {});

        // 6. pause
        const callTime6 = Date.now();
        await player.pause();
        this.assertLogEntry(runner, "pause", callTime6, {});

        // 7. stop
        const callTime7 = Date.now();
        await player.stop();
        this.assertLogEntry(runner, "stop", callTime7, {});

        // 8. resume
        const callTime8 = Date.now();
        await player.resume();
        this.assertLogEntry(runner, "resume", callTime8, {});

        // 9. seek
        const callTime9 = Date.now();
        await player.seek(5000);
        this.assertLogEntry(runner, "seek", callTime9, { newPos: 5000 });

        // 10. setAudioPitch
        const callTime10 = Date.now();
        await player.setAudioPitch(2);
        this.assertLogEntry(runner, "setAudioPitch", callTime10, { pitch: 2 });

        // 11. getDuration
        const callTime11 = Date.now();
        await player.getDuration();
        this.assertLogEntry(runner, "getDuration", callTime11, {});

        // 12. getPlayPosition
        const callTime12 = Date.now();
        await player.getPlayPosition();
        this.assertLogEntry(runner, "getPlayPosition", callTime12, {});

        // 13. getStreamCount
        const callTime13 = Date.now();
        await player.getStreamCount();
        this.assertLogEntry(runner, "getStreamCount", callTime13, {});

        // 14. getStreamInfo
        const callTime14 = Date.now();
        await player.getStreamInfo(0);
        this.assertLogEntry(runner, "getStreamInfo", callTime14, { index: 0 });

        // 15. setLoopCount
        const callTime15 = Date.now();
        await player.setLoopCount(3);
        this.assertLogEntry(runner, "setLoopCount", callTime15, { loopCount: 3 });

        // 16. setPlaybackSpeed
        const callTime16 = Date.now();
        await player.setPlaybackSpeed(120);
        this.assertLogEntry(runner, "setPlaybackSpeed", callTime16, { speed: 120 });

        // 17. selectAudioTrack
        const callTime17 = Date.now();
        await player.selectAudioTrack(1);
        this.assertLogEntry(runner, "selectAudioTrack", callTime17, { index: 1 });

        // 18. selectMultiAudioTrack
        const callTime18 = Date.now();
        await player.selectMultiAudioTrack(0, 1);
        this.assertLogEntry(runner, "selectMultiAudioTrack", callTime18, {
            playoutTrackIndex: 0,
            publishTrackIndex: 1,
        });

        // 19. setPlayerOption (number)
        const callTime19 = Date.now();
        await player.setPlayerOption("key", 100);
        this.assertLogEntry(runner, "setPlayerOption", callTime19, { key: "key", value: 100 });

        // 20. takeScreenshot
        const callTime20 = Date.now();
        await player.takeScreenshot("/tmp/screenshot.png");
        this.assertLogEntry(runner, "takeScreenshot", callTime20, {
            filename: "/tmp/screenshot.png",
        });

        // 21. selectInternalSubtitle
        const callTime21 = Date.now();
        await player.selectInternalSubtitle(2);
        this.assertLogEntry(runner, "selectInternalSubtitle", callTime21, { index: 2 });

        // 22. setExternalSubtitle
        const callTime22 = Date.now();
        await player.setExternalSubtitle("https://example.com/sub.srt");
        this.assertLogEntry(runner, "setExternalSubtitle", callTime22, {
            url: "https://example.com/sub.srt",
        });

        // 23. getState
        const callTime23 = Date.now();
        await player.getState();
        this.assertLogEntry(runner, "getState", callTime23, {});

        // 24. mute
        const callTime24 = Date.now();
        await player.mute(true);
        this.assertLogEntry(runner, "mute", callTime24, { muted: true });

        // 25. getMute
        const callTime25 = Date.now();
        await player.getMute();
        this.assertLogEntry(runner, "getMute", callTime25, {});

        // 26. adjustPlayoutVolume
        const callTime26 = Date.now();
        await player.adjustPlayoutVolume(80);
        this.assertLogEntry(runner, "adjustPlayoutVolume", callTime26, { volume: 80 });

        // 27. getPlayoutVolume
        const callTime27 = Date.now();
        await player.getPlayoutVolume();
        this.assertLogEntry(runner, "getPlayoutVolume", callTime27, {});

        // 28. adjustPublishSignalVolume
        const callTime28 = Date.now();
        await player.adjustPublishSignalVolume(90);
        this.assertLogEntry(runner, "adjustPublishSignalVolume", callTime28, { volume: 90 });

        // 29. getPublishSignalVolume
        const callTime29 = Date.now();
        await player.getPublishSignalVolume();
        this.assertLogEntry(runner, "getPublishSignalVolume", callTime29, {});

        // 30. setAudioDualMonoMode
        const callTime30 = Date.now();
        await player.setAudioDualMonoMode(0);
        this.assertLogEntry(runner, "setAudioDualMonoMode", callTime30, { mode: 0 });

        // 31. getPlayerSdkVersion
        const callTime31 = Date.now();
        await player.getPlayerSdkVersion();
        this.assertLogEntry(runner, "getPlayerSdkVersion", callTime31, {});

        // 32. getPlaySrc
        const callTime32 = Date.now();
        await player.getPlaySrc();
        this.assertLogEntry(runner, "getPlaySrc", callTime32, {});

        // 33. openWithAgoraCDNSrc
        const callTime33 = Date.now();
        await player.openWithAgoraCDNSrc("https://cdn.example.com/video.mp4", 0);
        this.assertLogEntry(runner, "openWithAgoraCDNSrc", callTime33, {
            src: "https://cdn.example.com/video.mp4",
            startPos: 0,
        });

        // 34. getAgoraCDNLineCount
        const callTime34 = Date.now();
        await player.getAgoraCDNLineCount();
        this.assertLogEntry(runner, "getAgoraCDNLineCount", callTime34, {});

        // 35. switchAgoraCDNLineByIndex
        const callTime35 = Date.now();
        await player.switchAgoraCDNLineByIndex(1);
        this.assertLogEntry(runner, "switchAgoraCDNLineByIndex", callTime35, { index: 1 });

        // 36. getCurrentAgoraCDNIndex
        const callTime36 = Date.now();
        await player.getCurrentAgoraCDNIndex();
        this.assertLogEntry(runner, "getCurrentAgoraCDNIndex", callTime36, {});

        // 37. enableAutoSwitchAgoraCDN
        const callTime37 = Date.now();
        await player.enableAutoSwitchAgoraCDN(true);
        this.assertLogEntry(runner, "enableAutoSwitchAgoraCDN", callTime37, { enable: true });

        // 38. renewAgoraCDNSrcToken
        const callTime38 = Date.now();
        await player.renewAgoraCDNSrcToken("newToken", 12345);
        this.assertLogEntry(runner, "renewAgoraCDNSrcToken", callTime38, {
            token: "newToken",
            ts: 12345,
        });

        // 39. switchAgoraCDNSrc
        const callTime39 = Date.now();
        await player.switchAgoraCDNSrc("https://cdn2.example.com/video.mp4", true);
        this.assertLogEntry(runner, "switchAgoraCDNSrc", callTime39, {
            src: "https://cdn2.example.com/video.mp4",
            syncPts: true,
        });

        // 40. switchSrc
        const callTime40 = Date.now();
        await player.switchSrc("https://example.com/other.mp4", false);
        this.assertLogEntry(runner, "switchSrc", callTime40, {
            src: "https://example.com/other.mp4",
            syncPts: false,
        });

        // 41. preloadSrc
        const callTime41 = Date.now();
        await player.preloadSrc("https://example.com/preload.mp4", 0);
        this.assertLogEntry(runner, "preloadSrc", callTime41, {
            src: "https://example.com/preload.mp4",
            startPos: 0,
        });

        // 42. playPreloadedSrc
        const callTime42 = Date.now();
        await player.playPreloadedSrc("https://example.com/preload.mp4");
        this.assertLogEntry(runner, "playPreloadedSrc", callTime42, {
            src: "https://example.com/preload.mp4",
        });

        // 43. unloadSrc
        const callTime43 = Date.now();
        await player.unloadSrc("https://example.com/preload.mp4");
        this.assertLogEntry(runner, "unloadSrc", callTime43, {
            src: "https://example.com/preload.mp4",
        });

        // 44. setSpatialAudioParams
        const callTime44 = Date.now();
        await player.setSpatialAudioParams({
            speaker_azimuth: 0.5,
            speaker_elevation: 0.5,
            speaker_distance: 5.0,
        });
        this.assertLogEntry(runner, "setSpatialAudioParams", callTime44, {});

        // 45. setSoundPositionParams
        const callTime45 = Date.now();
        await player.setSoundPositionParams(0.5, 10.0);
        this.assertLogEntry(runner, "setSoundPositionParams", callTime45, {
            pan: 0.5,
            gain: 10.0,
        });

        // 46. getAudioBufferDelay
        const callTime46 = Date.now();
        await player.getAudioBufferDelay();
        this.assertLogEntry(runner, "getAudioBufferDelay", callTime46, {});

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
        await mgr.setPlaybackDevice("device-id-1");
        this.assertLogEntry(runner, "setPlaybackDevice", callTime3, { deviceId: "device-id-1" });

        // getPlaybackDevice
        const callTime4 = Date.now();
        await mgr.getPlaybackDevice();
        this.assertLogEntry(runner, "getPlaybackDevice", callTime4, {});

        // setPlaybackDeviceVolume
        const callTime5 = Date.now();
        await mgr.setPlaybackDeviceVolume(80);
        this.assertLogEntry(runner, "setPlaybackDeviceVolume", callTime5, { volume: 80 });

        // getPlaybackDeviceVolume
        const callTime6 = Date.now();
        await mgr.getPlaybackDeviceVolume(0);
        this.assertLogEntry(runner, "getPlaybackDeviceVolume", callTime6, {});

        // setRecordingDevice
        const callTime7 = Date.now();
        await mgr.setRecordingDevice("device-id-2");
        this.assertLogEntry(runner, "setRecordingDevice", callTime7, { deviceId: "device-id-2" });

        // getRecordingDevice
        const callTime8 = Date.now();
        await mgr.getRecordingDevice();
        this.assertLogEntry(runner, "getRecordingDevice", callTime8, {});

        // setRecordingDeviceVolume
        const callTime9 = Date.now();
        await mgr.setRecordingDeviceVolume(70);
        this.assertLogEntry(runner, "setRecordingDeviceVolume", callTime9, { volume: 70 });

        // getRecordingDeviceVolume
        const callTime10 = Date.now();
        await mgr.getRecordingDeviceVolume();
        this.assertLogEntry(runner, "getRecordingDeviceVolume", callTime10, {});

        // setPlaybackDeviceMute
        const callTime11 = Date.now();
        await mgr.setPlaybackDeviceMute(true);
        this.assertLogEntry(runner, "setPlaybackDeviceMute", callTime11, { mute: true });

        // getPlaybackDeviceMute
        const callTime12 = Date.now();
        await mgr.getPlaybackDeviceMute();
        this.assertLogEntry(runner, "getPlaybackDeviceMute", callTime12, {});

        // setRecordingDeviceMute
        const callTime13 = Date.now();
        await mgr.setRecordingDeviceMute(false);
        this.assertLogEntry(runner, "setRecordingDeviceMute", callTime13, { mute: false });

        // getRecordingDeviceMute
        const callTime14 = Date.now();
        await mgr.getRecordingDeviceMute();
        this.assertLogEntry(runner, "getRecordingDeviceMute", callTime14, {});

        // startPlaybackDeviceTest
        const callTime15 = Date.now();
        await mgr.startPlaybackDeviceTest("/tmp/test.wav");
        this.assertLogEntry(runner, "startPlaybackDeviceTest", callTime15, {
            testAudioFilePath: "/tmp/test.wav",
        });

        // stopPlaybackDeviceTest
        const callTime16 = Date.now();
        await mgr.stopPlaybackDeviceTest();
        this.assertLogEntry(runner, "stopPlaybackDeviceTest", callTime16, {});

        // startRecordingDeviceTest
        const callTime17 = Date.now();
        await mgr.startRecordingDeviceTest(200);
        this.assertLogEntry(runner, "startRecordingDeviceTest", callTime17, { indicationInterval: 200 });

        // stopRecordingDeviceTest
        const callTime18 = Date.now();
        await mgr.stopRecordingDeviceTest();
        this.assertLogEntry(runner, "stopRecordingDeviceTest", callTime18, {});

        // followSystemPlaybackDevice
        const callTime19 = Date.now();
        await mgr.followSystemPlaybackDevice(true);
        this.assertLogEntry(runner, "followSystemPlaybackDevice", callTime19, { enable: true });

        // followSystemRecordingDevice
        const callTime20 = Date.now();
        await mgr.followSystemRecordingDevice(false);
        this.assertLogEntry(runner, "followSystemRecordingDevice", callTime20, { enable: false });

        // setLoopbackDevice
        const callTime21 = Date.now();
        await mgr.setLoopbackDevice("loopback-id");
        this.assertLogEntry(runner, "setLoopbackDevice", callTime21, { deviceId: "loopback-id" });

        // getLoopbackDevice
        const callTime22 = Date.now();
        await mgr.getLoopbackDevice();
        this.assertLogEntry(runner, "getLoopbackDevice", callTime22, {});

        // followSystemLoopbackDevice
        const callTime23 = Date.now();
        await mgr.followSystemLoopbackDevice(true);
        this.assertLogEntry(runner, "followSystemLoopbackDevice", callTime23, { enable: true });

        // startAudioDeviceLoopbackTest
        const callTime24 = Date.now();
        await mgr.startAudioDeviceLoopbackTest(200);
        this.assertLogEntry(runner, "startAudioDeviceLoopbackTest", callTime24, { indicationInterval: 200 });

        // stopAudioDeviceLoopbackTest
        const callTime25 = Date.now();
        await mgr.stopAudioDeviceLoopbackTest();
        this.assertLogEntry(runner, "stopAudioDeviceLoopbackTest", callTime25, {});

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
        await mgr.setDevice("video-device-id");
        this.assertLogEntry(runner, "setDevice", callTime2, { deviceId: "video-device-id" });

        // getDevice
        const callTime3 = Date.now();
        await mgr.getDevice();
        this.assertLogEntry(runner, "getDevice", callTime3, {});

        // numberOfCapabilities
        const callTime4 = Date.now();
        await mgr.numberOfCapabilities("video-device-id");
        this.assertLogEntry(runner, "numberOfCapabilities", callTime4, { deviceId: "video-device-id" });

        // getCapability
        const callTime5 = Date.now();
        await mgr.getCapability("video-device-id", 0);
        this.assertLogEntry(runner, "getCapability", callTime5, {
            deviceId: "video-device-id",
            deviceCapabilityNumber: 0,
        });

        // stopDeviceTest
        const callTime6 = Date.now();
        await mgr.stopDeviceTest();
        this.assertLogEntry(runner, "stopDeviceTest", callTime6, {});

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
        await transcoder.enableTranscode("token123", "channel1", 42);
        this.assertLogEntry(runner, "enableTranscode", callTime1, {
            token: "token123",
            channel: "channel1",
            uid: 42,
        });

        // queryChannel
        const callTime2 = Date.now();
        await transcoder.queryChannel("token456", "channel2", 100);
        this.assertLogEntry(runner, "queryChannel", callTime2, {
            token: "token456",
            channel: "channel2",
            uid: 100,
        });

        // triggerTranscode
        const callTime3 = Date.now();
        await transcoder.triggerTranscode("token789", "channel3", 200);
        this.assertLogEntry(runner, "triggerTranscode", callTime3, {
            token: "token789",
            channel: "channel3",
            uid: 200,
        });

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
        await engine.setMaxAudioRecvCount(10);
        this.assertLogEntry(runner, "setMaxAudioRecvCount", callTime1, { maxCount: 10 });

        // setAudioRecvRange
        const callTime2 = Date.now();
        await engine.setAudioRecvRange(50.0);
        this.assertLogEntry(runner, "setAudioRecvRange", callTime2, { range: 50.0 });

        // setDistanceUnit
        const callTime3 = Date.now();
        await engine.setDistanceUnit(1.0);
        this.assertLogEntry(runner, "setDistanceUnit", callTime3, { unit: 1.0 });

        // updateSelfPosition
        const callTime4 = Date.now();
        await engine.updateSelfPosition([1, 2, 3], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
        this.assertLogEntry(runner, "updateSelfPosition", callTime4, {
            position: [1, 2, 3],
            axisForward: [0, 0, -1],
            axisRight: [1, 0, 0],
            axisUp: [0, 1, 0],
        });

        // updateRemotePosition
        const callTime5 = Date.now();
        await engine.updateRemotePosition(42, {
            position: [4, 5, 6],
            forward: [0, 0, -1],
        });
        this.assertLogEntry(runner, "updateRemotePosition", callTime5, {
            uid: 42,
            posInfo: { position: [4, 5, 6], forward: [0, 0, -1] },
        });

        // removeRemotePosition
        const callTime6 = Date.now();
        await engine.removeRemotePosition(42);
        this.assertLogEntry(runner, "removeRemotePosition", callTime6, { uid: 42 });

        // clearRemotePositions
        const callTime7 = Date.now();
        await engine.clearRemotePositions();
        this.assertLogEntry(runner, "clearRemotePositions", callTime7, {});

        // muteLocalAudioStream
        const callTime8 = Date.now();
        await engine.muteLocalAudioStream(true);
        this.assertLogEntry(runner, "muteLocalAudioStream", callTime8, { mute: true });

        // muteAllRemoteAudioStreams
        const callTime9 = Date.now();
        await engine.muteAllRemoteAudioStreams(false);
        this.assertLogEntry(runner, "muteAllRemoteAudioStreams", callTime9, { mute: false });

        // muteRemoteAudioStream
        const callTime10 = Date.now();
        await engine.muteRemoteAudioStream(42, true);
        this.assertLogEntry(runner, "muteRemoteAudioStream", callTime10, { uid: 42, mute: true });

        // setRemoteAudioAttenuation
        const callTime11 = Date.now();
        await engine.setRemoteAudioAttenuation(42, 0.5, true);
        this.assertLogEntry(runner, "setRemoteAudioAttenuation", callTime11, {
            uid: 42,
            attenuation: 0.5,
            forceSet: true,
        });

        // setParameters
        const callTime12 = Date.now();
        await engine.setParameters('{"key":"value"}');
        this.assertLogEntry(runner, "setParameters", callTime12, { params: '{"key":"value"}' });

        // updatePlayerPositionInfo
        const callTime13 = Date.now();
        await engine.updatePlayerPositionInfo(1, {
            position: [7, 8, 9],
            forward: [0, 0, -1],
        });
        this.assertLogEntry(runner, "updatePlayerPositionInfo", callTime13, {
            playerId: 1,
            positionInfo: { position: [7, 8, 9], forward: [0, 0, -1] },
        });

        // setPlayerAttenuation
        const callTime14 = Date.now();
        await engine.setPlayerAttenuation(1, 0.8, false);
        this.assertLogEntry(runner, "setPlayerAttenuation", callTime14, {
            playerId: 1,
            attenuation: 0.8,
            forceSet: false,
        });

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
        await mcc.renewToken("newMccToken");
        this.assertLogEntry(runner, "renewToken", callTime1, { token: "newMccToken" });

        // // registerEventHandler not need ut
        // const callTime2 = Date.now();
        // await mcc.registerEventHandler({} as any);
        // this.assertLogEntry(runner, "registerEventHandler", callTime2, {});

        // unregisterEventHandler
        const callTime3 = Date.now();
        await mcc.unregisterEventHandler();
        this.assertLogEntry(runner, "unregisterEventHandler", callTime3, {});

        // getMusicCharts
        const callTime4 = Date.now();
        await mcc.getMusicCharts();
        this.assertLogEntry(runner, "getMusicCharts", callTime4, {});

        // getMusicCollectionByMusicChartId
        const callTime5 = Date.now();
        await mcc.getMusicCollectionByMusicChartId(1, 0, 10, "");
        this.assertLogEntry(runner, "getMusicCollectionByMusicChartId", callTime5, {
            musicChartId: 1,
            page: 0,
            pageSize: 10,
            jsonOption: "",
        });

        // searchMusic
        const callTime6 = Date.now();
        await mcc.searchMusic("love", 0, 20, "");
        this.assertLogEntry(runner, "searchMusic", callTime6, {
            keyword: "love",
            page: 0,
            pageSize: 20,
            jsonOption: "",
        });

        // preload (with jsonOption)
        const callTime7 = Date.now();
        await mcc.preload(12345, "{}");
        this.assertLogEntry(runner, "preload", callTime7, { songCode: 12345, jsonOption: "{}" });

        // removeCache
        const callTime8 = Date.now();
        await mcc.removeCache(12345);
        this.assertLogEntry(runner, "removeCache", callTime8, { songCode: 12345 });

        // getCaches
        const callTime9 = Date.now();
        await mcc.getCaches(10);
        this.assertLogEntry(runner, "getCaches", callTime9, { cacheInfoSize: 10 });

        // isPreloaded
        const callTime10 = Date.now();
        await mcc.isPreloaded(12345);
        this.assertLogEntry(runner, "isPreloaded", callTime10, { songCode: 12345 });

        // getLyric
        const callTime11 = Date.now();
        await mcc.getLyric(12345, 0);
        this.assertLogEntry(runner, "getLyric", callTime11, { songCode: 12345, lyricType: 0 });

        // getSongSimpleInfo
        const callTime12 = Date.now();
        await mcc.getSongSimpleInfo(12345);
        this.assertLogEntry(runner, "getSongSimpleInfo", callTime12, { songCode: 12345 });

        // getInternalSongCode
        const callTime13 = Date.now();
        await mcc.getInternalSongCode(12345, "{}");
        this.assertLogEntry(runner, "getInternalSongCode", callTime13, {
            songCode: 12345,
            jsonOption: "{}",
        });

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
        await cacheMgr.removeAllCaches();
        this.assertLogEntry(runner, "removeAllCaches", callTime1, {});

        // removeOldCache
        const callTime2 = Date.now();
        await cacheMgr.removeOldCache();
        this.assertLogEntry(runner, "removeOldCache", callTime2, {});

        // removeCacheByUri
        const callTime3 = Date.now();
        await cacheMgr.removeCacheByUri("https://example.com/cached.mp4");
        this.assertLogEntry(runner, "removeCacheByUri", callTime3, {
            uri: "https://example.com/cached.mp4",
        });

        // setCacheDir
        const callTime4 = Date.now();
        await cacheMgr.setCacheDir("/tmp/agora_cache");
        this.assertLogEntry(runner, "setCacheDir", callTime4, { path: "/tmp/agora_cache" });

        // setMaxCacheFileCount
        const callTime5 = Date.now();
        await cacheMgr.setMaxCacheFileCount(100);
        this.assertLogEntry(runner, "setMaxCacheFileCount", callTime5, { count: 100 });

        // setMaxCacheFileSize
        const callTime6 = Date.now();
        await cacheMgr.setMaxCacheFileSize(1024 * 1024 * 100);
        this.assertLogEntry(runner, "setMaxCacheFileSize", callTime6, { cacheSize: 1024 * 1024 * 100 });

        // enableAutoRemoveCache
        const callTime7 = Date.now();
        await cacheMgr.enableAutoRemoveCache(true);
        this.assertLogEntry(runner, "enableAutoRemoveCache", callTime7, { enable: true });

        // getCacheDir
        const callTime8 = Date.now();
        await cacheMgr.getCacheDir();
        this.assertLogEntry(runner, "getCacheDir", callTime8, {});

        // getMaxCacheFileCount
        const callTime9 = Date.now();
        await cacheMgr.getMaxCacheFileCount();
        this.assertLogEntry(runner, "getMaxCacheFileCount", callTime9, {});

        // getMaxCacheFileSize
        const callTime10 = Date.now();
        await cacheMgr.getMaxCacheFileSize();
        this.assertLogEntry(runner, "getMaxCacheFileSize", callTime10, {});

        // getCacheFileCount
        const callTime11 = Date.now();
        await cacheMgr.getCacheFileCount();
        this.assertLogEntry(runner, "getCacheFileCount", callTime11, {});

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
        await effect.addOrUpdateVideoEffect(1, "effect_template_1");
        this.assertLogEntry(runner, "addOrUpdateVideoEffect", callTime1, {
            nodeId: 1,
            templateName: "effect_template_1",
        });

        // removeVideoEffect
        const callTime2 = Date.now();
        await effect.removeVideoEffect(1);
        this.assertLogEntry(runner, "removeVideoEffect", callTime2, { nodeId: 1 });

        // performVideoEffectAction
        const callTime3 = Date.now();
        await effect.performVideoEffectAction(1, VIDEO_EFFECT_ACTION.SAVE);
        this.assertLogEntry(runner, "performVideoEffectAction", callTime3, {
            nodeId: 1,
            actionId: 1,
        });

        // setVideoEffectFloatParam
        const callTime4 = Date.now();
        await effect.setVideoEffectFloatParam("option1", "key1", 1.5);
        this.assertLogEntry(runner, "setVideoEffectFloatParam", callTime4, {
            option: "option1",
            key: "key1",
            param: 1.5,
        });

        // setVideoEffectIntParam
        const callTime5 = Date.now();
        await effect.setVideoEffectIntParam("option2", "key2", 42);
        this.assertLogEntry(runner, "setVideoEffectIntParam", callTime5, {
            option: "option2",
            key: "key2",
            param: 42,
        });

        // setVideoEffectBoolParam
        const callTime6 = Date.now();
        await effect.setVideoEffectBoolParam("option3", "key3", true);
        this.assertLogEntry(runner, "setVideoEffectBoolParam", callTime6, {
            option: "option3",
            key: "key3",
            param: true,
        });

        // getVideoEffectFloatParam
        const callTime7 = Date.now();
        await effect.getVideoEffectFloatParam("option1", "key1");
        this.assertLogEntry(runner, "getVideoEffectFloatParam", callTime7, {
            option: "option1",
            key: "key1",
        });

        // getVideoEffectIntParam
        const callTime8 = Date.now();
        await effect.getVideoEffectIntParam("option2", "key2");
        this.assertLogEntry(runner, "getVideoEffectIntParam", callTime8, {
            option: "option2",
            key: "key2",
        });

        // getVideoEffectBoolParam
        const callTime9 = Date.now();
        await effect.getVideoEffectBoolParam("option3", "key3");
        this.assertLogEntry(runner, "getVideoEffectBoolParam", callTime9, {
            option: "option3",
            key: "key3",
        });

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

            // 2. getDeviceType
            const callTime2 = Date.now();
            await playbackCollection.getDeviceType(0);
            this.assertLogEntry(runner, "getDeviceType", callTime2, { index: 0 });

            // 3. setDevice
            const callTime3 = Date.now();
            await playbackCollection.setDevice("test-device-id");
            this.assertLogEntry(runner, "setDevice", callTime3, { deviceId: "test-device-id" });

            // 4. getDefaultDeviceType
            const callTime4 = Date.now();
            await playbackCollection.getDefaultDeviceType();
            this.assertLogEntry(runner, "getDefaultDeviceType", callTime4, {});

            // 5. setApplicationVolume
            const callTime5 = Date.now();
            await playbackCollection.setApplicationVolume(80);
            this.assertLogEntry(runner, "setApplicationVolume", callTime5, { volume: 80 });

            // 6. getApplicationVolume
            const callTime6 = Date.now();
            await playbackCollection.getApplicationVolume();
            this.assertLogEntry(runner, "getApplicationVolume", callTime6, {});

            // 7. setApplicationMute
            const callTime7 = Date.now();
            await playbackCollection.setApplicationMute(true);
            this.assertLogEntry(runner, "setApplicationMute", callTime7, { mute: true });

            // 8. isApplicationMute
            const callTime8 = Date.now();
            await playbackCollection.isApplicationMute();
            this.assertLogEntry(runner, "isApplicationMute", callTime8, {});
        }

        // enumerateRecordingDevices returns IAudioDeviceCollection
        const recordingCollection: IAudioDeviceCollection = await mgr.enumerateRecordingDevices();
        runner.assert(recordingCollection !== null, "enumerateRecordingDevices should return non-null");

        if (recordingCollection) {
            // 1. getCount
            const callTime10 = Date.now();
            await recordingCollection.getCount();
            this.assertLogEntry(runner, "getCount", callTime10, {});

            // 2. getDeviceType
            const callTime11 = Date.now();
            await recordingCollection.getDeviceType(0);
            this.assertLogEntry(runner, "getDeviceType", callTime11, { index: 0 });

            // 3. setDevice
            const callTime12 = Date.now();
            await recordingCollection.setDevice("test-recording-device-id");
            this.assertLogEntry(runner, "setDevice", callTime12, { deviceId: "test-recording-device-id" });

            // 4. getDefaultDeviceType
            const callTime13 = Date.now();
            await recordingCollection.getDefaultDeviceType();
            this.assertLogEntry(runner, "getDefaultDeviceType", callTime13, {});

            // 5. setApplicationVolume
            const callTime14 = Date.now();
            await recordingCollection.setApplicationVolume(50);
            this.assertLogEntry(runner, "setApplicationVolume", callTime14, { volume: 50 });

            // 6. getApplicationVolume
            const callTime15 = Date.now();
            await recordingCollection.getApplicationVolume();
            this.assertLogEntry(runner, "getApplicationVolume", callTime15, {});

            // 7. setApplicationMute
            const callTime16 = Date.now();
            await recordingCollection.setApplicationMute(false);
            this.assertLogEntry(runner, "setApplicationMute", callTime16, { mute: false });

            // 8. isApplicationMute
            const callTime17 = Date.now();
            await recordingCollection.isApplicationMute();
            this.assertLogEntry(runner, "isApplicationMute", callTime17, {});
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
            const count = await collection.getCount();
            this.assertLogEntry(runner, "getCount", callTime1, {});

            // 2. setDevice
            const callTime2 = Date.now();
            await collection.setDevice("test-video-device-id");
            this.assertLogEntry(runner, "setDevice", callTime2, { deviceId: "test-video-device-id" });

            // 3. getDevice
            const callTime3 = Date.now();
            await collection.getDevice(0);
            this.assertLogEntry(runner, "getDevice", callTime3, { index: 0 });
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
        await recorder.setMediaRecorderObserver({
            onRecorderStateChanged: () => {},
            onRecorderInfoUpdated: () => {},
        } as any);
        this.assertLogEntry(runner, "setMediaRecorderObserver", callTime1, {});

        // startRecording
        const callTime2 = Date.now();
        await recorder.startRecording({
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

        // stopRecording
        const callTime3 = Date.now();
        await recorder.stopRecording();
        this.assertLogEntry(runner, "stopRecording", callTime3, {});

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
            await player.openWithSongCode(12345, 0);
            this.assertLogEntry(runner, "openWithSongCode", callTime2, {
                songCode: 12345,
                startPos: 0,
            });

            // 2. setPlayMode
            const callTime3 = Date.now();
            await player.setPlayMode(1);
            this.assertLogEntry(runner, "setPlayMode", callTime3, { mode: 1 });

            // === Inherited IMediaPlayer methods (order matches IMediaPlayer.ts) ===

            // 3. getId
            const callTime4 = Date.now();
            await player.getId();
            this.assertLogEntry(runner, "getId", callTime4, {});

            // // 4. initEventHandler not need ut
            // const callTime5 = Date.now();
            // await player.initEventHandler({} as any);
            // this.assertLogEntry(runner, "initEventHandler", callTime5, {});

            // 5. open
            const callTime6 = Date.now();
            await player.open("https://example.com/music.mp3", 0);
            this.assertLogEntry(runner, "open", callTime6, {
                url: "https://example.com/music.mp3",
                startPos: 0,
            });

            // 6. openWithMediaSource
            const callTime7 = Date.now();
            await player.openWithMediaSource({
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

            // 7. play
            const callTime8 = Date.now();
            await player.play();
            this.assertLogEntry(runner, "play", callTime8, {});

            // 8. pause
            const callTime9 = Date.now();
            await player.pause();
            this.assertLogEntry(runner, "pause", callTime9, {});

            // 9. stop
            const callTime10 = Date.now();
            await player.stop();
            this.assertLogEntry(runner, "stop", callTime10, {});

            // 10. resume
            const callTime11 = Date.now();
            await player.resume();
            this.assertLogEntry(runner, "resume", callTime11, {});

            // 11. seek
            const callTime12 = Date.now();
            await player.seek(5000);
            this.assertLogEntry(runner, "seek", callTime12, { newPos: 5000 });

            // 12. setAudioPitch
            const callTime13 = Date.now();
            await player.setAudioPitch(2);
            this.assertLogEntry(runner, "setAudioPitch", callTime13, { pitch: 2 });

            // 13. getDuration
            const callTime14 = Date.now();
            await player.getDuration();
            this.assertLogEntry(runner, "getDuration", callTime14, {});

            // 14. getPlayPosition
            const callTime15 = Date.now();
            await player.getPlayPosition();
            this.assertLogEntry(runner, "getPlayPosition", callTime15, {});

            // 15. getStreamCount
            const callTime16 = Date.now();
            await player.getStreamCount();
            this.assertLogEntry(runner, "getStreamCount", callTime16, {});

            // 16. getStreamInfo
            const callTime17 = Date.now();
            await player.getStreamInfo(0);
            this.assertLogEntry(runner, "getStreamInfo", callTime17, { index: 0 });

            // 17. setLoopCount
            const callTime18 = Date.now();
            await player.setLoopCount(3);
            this.assertLogEntry(runner, "setLoopCount", callTime18, { loopCount: 3 });

            // 18. setPlaybackSpeed
            const callTime19 = Date.now();
            await player.setPlaybackSpeed(120);
            this.assertLogEntry(runner, "setPlaybackSpeed", callTime19, { speed: 120 });

            // 19. selectAudioTrack
            const callTime20 = Date.now();
            await player.selectAudioTrack(1);
            this.assertLogEntry(runner, "selectAudioTrack", callTime20, { index: 1 });

            // 20. selectMultiAudioTrack
            const callTime21 = Date.now();
            await player.selectMultiAudioTrack(0, 1);
            this.assertLogEntry(runner, "selectMultiAudioTrack", callTime21, {
                playoutTrackIndex: 0,
                publishTrackIndex: 1,
            });

            // 21. setPlayerOption
            const callTime22 = Date.now();
            await player.setPlayerOption("key", 100);
            this.assertLogEntry(runner, "setPlayerOption", callTime22, { key: "key", value: 100 });

            // 22. takeScreenshot
            const callTime23 = Date.now();
            await player.takeScreenshot("/tmp/screenshot.png");
            this.assertLogEntry(runner, "takeScreenshot", callTime23, {
                filename: "/tmp/screenshot.png",
            });

            // 23. selectInternalSubtitle
            const callTime24 = Date.now();
            await player.selectInternalSubtitle(2);
            this.assertLogEntry(runner, "selectInternalSubtitle", callTime24, { index: 2 });

            // 24. setExternalSubtitle
            const callTime25 = Date.now();
            await player.setExternalSubtitle("https://example.com/sub.srt");
            this.assertLogEntry(runner, "setExternalSubtitle", callTime25, {
                url: "https://example.com/sub.srt",
            });

            // 25. getState
            const callTime26 = Date.now();
            await player.getState();
            this.assertLogEntry(runner, "getState", callTime26, {});

            // 26. mute
            const callTime27 = Date.now();
            await player.mute(true);
            this.assertLogEntry(runner, "mute", callTime27, { muted: true });

            // 27. getMute
            const callTime28 = Date.now();
            await player.getMute();
            this.assertLogEntry(runner, "getMute", callTime28, {});

            // 28. adjustPlayoutVolume
            const callTime29 = Date.now();
            await player.adjustPlayoutVolume(80);
            this.assertLogEntry(runner, "adjustPlayoutVolume", callTime29, { volume: 80 });

            // 29. getPlayoutVolume
            const callTime30 = Date.now();
            await player.getPlayoutVolume();
            this.assertLogEntry(runner, "getPlayoutVolume", callTime30, {});

            // 30. adjustPublishSignalVolume
            const callTime31 = Date.now();
            await player.adjustPublishSignalVolume(90);
            this.assertLogEntry(runner, "adjustPublishSignalVolume", callTime31, { volume: 90 });

            // 31. getPublishSignalVolume
            const callTime32 = Date.now();
            await player.getPublishSignalVolume();
            this.assertLogEntry(runner, "getPublishSignalVolume", callTime32, {});

            // 32. setAudioDualMonoMode
            const callTime33 = Date.now();
            await player.setAudioDualMonoMode(0);
            this.assertLogEntry(runner, "setAudioDualMonoMode", callTime33, { mode: 0 });

            // 33. getPlayerSdkVersion
            const callTime34 = Date.now();
            await player.getPlayerSdkVersion();
            this.assertLogEntry(runner, "getPlayerSdkVersion", callTime34, {});

            // 34. getPlaySrc
            const callTime35 = Date.now();
            await player.getPlaySrc();
            this.assertLogEntry(runner, "getPlaySrc", callTime35, {});

            // 35. openWithAgoraCDNSrc
            const callTime36 = Date.now();
            await player.openWithAgoraCDNSrc("https://cdn.example.com/music.mp3", 0);
            this.assertLogEntry(runner, "openWithAgoraCDNSrc", callTime36, {
                src: "https://cdn.example.com/music.mp3",
                startPos: 0,
            });

            // 36. getAgoraCDNLineCount
            const callTime37 = Date.now();
            await player.getAgoraCDNLineCount();
            this.assertLogEntry(runner, "getAgoraCDNLineCount", callTime37, {});

            // 37. switchAgoraCDNLineByIndex
            const callTime38 = Date.now();
            await player.switchAgoraCDNLineByIndex(1);
            this.assertLogEntry(runner, "switchAgoraCDNLineByIndex", callTime38, { index: 1 });

            // 38. getCurrentAgoraCDNIndex
            const callTime39 = Date.now();
            await player.getCurrentAgoraCDNIndex();
            this.assertLogEntry(runner, "getCurrentAgoraCDNIndex", callTime39, {});

            // 39. enableAutoSwitchAgoraCDN
            const callTime40 = Date.now();
            await player.enableAutoSwitchAgoraCDN(true);
            this.assertLogEntry(runner, "enableAutoSwitchAgoraCDN", callTime40, { enable: true });

            // 40. renewAgoraCDNSrcToken
            const callTime41 = Date.now();
            await player.renewAgoraCDNSrcToken("newToken", 12345);
            this.assertLogEntry(runner, "renewAgoraCDNSrcToken", callTime41, {
                token: "newToken",
                ts: 12345,
            });

            // 41. switchAgoraCDNSrc
            const callTime42 = Date.now();
            await player.switchAgoraCDNSrc("https://cdn2.example.com/music.mp3", true);
            this.assertLogEntry(runner, "switchAgoraCDNSrc", callTime42, {
                src: "https://cdn2.example.com/music.mp3",
                syncPts: true,
            });

            // 42. switchSrc
            const callTime43 = Date.now();
            await player.switchSrc("https://example.com/other.mp3", false);
            this.assertLogEntry(runner, "switchSrc", callTime43, {
                src: "https://example.com/other.mp3",
                syncPts: false,
            });

            // 43. preloadSrc
            const callTime44 = Date.now();
            await player.preloadSrc("https://example.com/preload.mp3", 0);
            this.assertLogEntry(runner, "preloadSrc", callTime44, {
                src: "https://example.com/preload.mp3",
                startPos: 0,
            });

            // 44. playPreloadedSrc
            const callTime45 = Date.now();
            await player.playPreloadedSrc("https://example.com/preload.mp3");
            this.assertLogEntry(runner, "playPreloadedSrc", callTime45, {
                src: "https://example.com/preload.mp3",
            });

            // 45. unloadSrc
            const callTime46 = Date.now();
            await player.unloadSrc("https://example.com/preload.mp3");
            this.assertLogEntry(runner, "unloadSrc", callTime46, {
                src: "https://example.com/preload.mp3",
            });

            // 46. setSpatialAudioParams
            const callTime47 = Date.now();
            await player.setSpatialAudioParams({
                speaker_azimuth: 0.5,
                speaker_elevation: 0.5,
                speaker_distance: 5.0,
            });
            this.assertLogEntry(runner, "setSpatialAudioParams", callTime47, {});

            // 47. setSoundPositionParams
            const callTime48 = Date.now();
            await player.setSoundPositionParams(0.5, 10.0);
            this.assertLogEntry(runner, "setSoundPositionParams", callTime48, {
                pan: 0.5,
                gain: 10.0,
            });

            // 48. getAudioBufferDelay
            const callTime49 = Date.now();
            await player.getAudioBufferDelay();
            this.assertLogEntry(runner, "getAudioBufferDelay", callTime49, {});

            // destroyMusicPlayer
            const callTime50 = Date.now();
            await mcc.destroyMusicPlayer(player);
            this.assertLogEntry(runner, "destroyMusicPlayer", callTime50, {});
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
            const count = sources.getCount();
            this.assertLogEntry(runner, "getCount", callTime1, {});

            // getSourceInfo
            const callTime2 = Date.now();
            const info = sources.getSourceInfo(0);
            this.assertLogEntry(runner, "getSourceInfo", callTime2, { index: 0 });
        }

        await bridge.release(true);
        await this.delay(200);
    }
}
