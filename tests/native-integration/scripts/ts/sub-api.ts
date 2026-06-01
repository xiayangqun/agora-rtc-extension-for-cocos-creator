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
import { CHANNEL_PROFILE_TYPE } from "agora-rtc/types/AgoraBase";

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

    // ──────────────────────────── IMediaPlayer ────────────────────────────

    private async testMediaPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MediaPlayer ---");
        const bridge = this.createBridgeAndInit();

        const player = await bridge.createMediaPlayer();
        runner.assert(player !== null, "createMediaPlayer should return non-null");

        const p = player as any;

        // getId
        const callTime1 = Date.now();
        const id = p.getId();
        this.assertLogEntry(runner, "getId", callTime1, {});

        // open
        const callTime2 = Date.now();
        await p.open("https://example.com/video.mp4", 0);
        this.assertLogEntry(runner, "open", callTime2, {
            url: "https://example.com/video.mp4",
            startPos: 0,
        });

        // play
        const callTime3 = Date.now();
        await p.play();
        this.assertLogEntry(runner, "play", callTime3, {});

        // pause
        const callTime4 = Date.now();
        await p.pause();
        this.assertLogEntry(runner, "pause", callTime4, {});

        // stop
        const callTime5 = Date.now();
        await p.stop();
        this.assertLogEntry(runner, "stop", callTime5, {});

        // resume
        const callTime6 = Date.now();
        await p.resume();
        this.assertLogEntry(runner, "resume", callTime6, {});

        // seek
        const callTime7 = Date.now();
        await p.seek(5000);
        this.assertLogEntry(runner, "seek", callTime7, { newPos: 5000 });

        // setAudioPitch
        const callTime8 = Date.now();
        await p.setAudioPitch(2);
        this.assertLogEntry(runner, "setAudioPitch", callTime8, { pitch: 2 });

        // setLoopCount
        const callTime9 = Date.now();
        await p.setLoopCount(3);
        this.assertLogEntry(runner, "setLoopCount", callTime9, { loopCount: 3 });

        // setPlaybackSpeed
        const callTime10 = Date.now();
        await p.setPlaybackSpeed(120);
        this.assertLogEntry(runner, "setPlaybackSpeed", callTime10, { speed: 120 });

        // selectAudioTrack
        const callTime11 = Date.now();
        await p.selectAudioTrack(1);
        this.assertLogEntry(runner, "selectAudioTrack", callTime11, { index: 1 });

        // mute
        const callTime12 = Date.now();
        await p.mute(true);
        this.assertLogEntry(runner, "mute", callTime12, { muted: true });

        // adjustPlayoutVolume
        const callTime13 = Date.now();
        await p.adjustPlayoutVolume(80);
        this.assertLogEntry(runner, "adjustPlayoutVolume", callTime13, { volume: 80 });

        // adjustPublishSignalVolume
        const callTime14 = Date.now();
        await p.adjustPublishSignalVolume(90);
        this.assertLogEntry(runner, "adjustPublishSignalVolume", callTime14, { volume: 90 });

        // setAudioDualMonoMode
        const callTime15 = Date.now();
        await p.setAudioDualMonoMode(0);
        this.assertLogEntry(runner, "setAudioDualMonoMode", callTime15, { mode: 0 });

        // openWithAgoraCDNSrc
        const callTime16 = Date.now();
        await p.openWithAgoraCDNSrc("https://cdn.example.com/video.mp4", 0);
        this.assertLogEntry(runner, "openWithAgoraCDNSrc", callTime16, {
            src: "https://cdn.example.com/video.mp4",
            startPos: 0,
        });

        // switchAgoraCDNLineByIndex
        const callTime17 = Date.now();
        await p.switchAgoraCDNLineByIndex(1);
        this.assertLogEntry(runner, "switchAgoraCDNLineByIndex", callTime17, { index: 1 });

        // enableAutoSwitchAgoraCDN
        const callTime18 = Date.now();
        await p.enableAutoSwitchAgoraCDN(true);
        this.assertLogEntry(runner, "enableAutoSwitchAgoraCDN", callTime18, { enable: true });

        // renewAgoraCDNSrcToken
        const callTime19 = Date.now();
        await p.renewAgoraCDNSrcToken("newToken", 12345);
        this.assertLogEntry(runner, "renewAgoraCDNSrcToken", callTime19, {
            token: "newToken",
            ts: 12345,
        });

        // switchAgoraCDNSrc
        const callTime20 = Date.now();
        await p.switchAgoraCDNSrc("https://cdn2.example.com/video.mp4", true);
        this.assertLogEntry(runner, "switchAgoraCDNSrc", callTime20, {
            src: "https://cdn2.example.com/video.mp4",
            syncPts: true,
        });

        // switchSrc
        const callTime21 = Date.now();
        await p.switchSrc("https://example.com/other.mp4", false);
        this.assertLogEntry(runner, "switchSrc", callTime21, {
            src: "https://example.com/other.mp4",
            syncPts: false,
        });

        // preloadSrc
        const callTime22 = Date.now();
        await p.preloadSrc("https://example.com/preload.mp4", 0);
        this.assertLogEntry(runner, "preloadSrc", callTime22, {
            src: "https://example.com/preload.mp4",
            startPos: 0,
        });

        // playPreloadedSrc
        const callTime23 = Date.now();
        await p.playPreloadedSrc("https://example.com/preload.mp4");
        this.assertLogEntry(runner, "playPreloadedSrc", callTime23, {
            src: "https://example.com/preload.mp4",
        });

        // unloadSrc
        const callTime24 = Date.now();
        await p.unloadSrc("https://example.com/preload.mp4");
        this.assertLogEntry(runner, "unloadSrc", callTime24, {
            src: "https://example.com/preload.mp4",
        });

        // setSoundPositionParams
        const callTime25 = Date.now();
        await p.setSoundPositionParams(0.5, 10.0);
        this.assertLogEntry(runner, "setSoundPositionParams", callTime25, {
            pan: 0.5,
            gain: 10.0,
        });

        // selectMultiAudioTrack
        const callTime26 = Date.now();
        await p.selectMultiAudioTrack(0, 1);
        this.assertLogEntry(runner, "selectMultiAudioTrack", callTime26, {
            playoutTrackIndex: 0,
            publishTrackIndex: 1,
        });

        // selectInternalSubtitle
        const callTime27 = Date.now();
        await p.selectInternalSubtitle(2);
        this.assertLogEntry(runner, "selectInternalSubtitle", callTime27, { index: 2 });

        // setExternalSubtitle
        const callTime28 = Date.now();
        await p.setExternalSubtitle("https://example.com/sub.srt");
        this.assertLogEntry(runner, "setExternalSubtitle", callTime28, {
            url: "https://example.com/sub.srt",
        });

        // takeScreenshot
        const callTime29 = Date.now();
        await p.takeScreenshot("/tmp/screenshot.png");
        this.assertLogEntry(runner, "takeScreenshot", callTime29, {
            filename: "/tmp/screenshot.png",
        });

        await bridge.destroyMediaPlayer(player);
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IAudioDeviceManager ────────────────────────────

    private async testAudioDeviceManager(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: AudioDeviceManager ---");
        const bridge = this.createBridgeAndInit();

        const mgr = bridge.getAudioDeviceManager();
        runner.assert(mgr !== null, "getAudioDeviceManager should return non-null");

        const m = mgr as any;

        // enumeratePlaybackDevices
        const callTime1 = Date.now();
        const playbackDevices = m.enumeratePlaybackDevices();
        this.assertLogEntry(runner, "enumeratePlaybackDevices", callTime1, {});

        // enumerateRecordingDevices
        const callTime2 = Date.now();
        const recordingDevices = m.enumerateRecordingDevices();
        this.assertLogEntry(runner, "enumerateRecordingDevices", callTime2, {});

        // setPlaybackDevice
        const callTime3 = Date.now();
        await m.setPlaybackDevice("device-id-1");
        this.assertLogEntry(runner, "setPlaybackDevice", callTime3, { deviceId: "device-id-1" });

        // getPlaybackDevice
        const callTime4 = Date.now();
        m.getPlaybackDevice();
        this.assertLogEntry(runner, "getPlaybackDevice", callTime4, {});

        // setPlaybackDeviceVolume
        const callTime5 = Date.now();
        await m.setPlaybackDeviceVolume(80);
        this.assertLogEntry(runner, "setPlaybackDeviceVolume", callTime5, { volume: 80 });

        // getPlaybackDeviceVolume
        const callTime6 = Date.now();
        m.getPlaybackDeviceVolume();
        this.assertLogEntry(runner, "getPlaybackDeviceVolume", callTime6, {});

        // setRecordingDevice
        const callTime7 = Date.now();
        await m.setRecordingDevice("device-id-2");
        this.assertLogEntry(runner, "setRecordingDevice", callTime7, { deviceId: "device-id-2" });

        // getRecordingDevice
        const callTime8 = Date.now();
        m.getRecordingDevice();
        this.assertLogEntry(runner, "getRecordingDevice", callTime8, {});

        // setRecordingDeviceVolume
        const callTime9 = Date.now();
        await m.setRecordingDeviceVolume(70);
        this.assertLogEntry(runner, "setRecordingDeviceVolume", callTime9, { volume: 70 });

        // getRecordingDeviceVolume
        const callTime10 = Date.now();
        m.getRecordingDeviceVolume();
        this.assertLogEntry(runner, "getRecordingDeviceVolume", callTime10, {});

        // setPlaybackDeviceMute
        const callTime11 = Date.now();
        await m.setPlaybackDeviceMute(true);
        this.assertLogEntry(runner, "setPlaybackDeviceMute", callTime11, { mute: true });

        // getPlaybackDeviceMute
        const callTime12 = Date.now();
        m.getPlaybackDeviceMute();
        this.assertLogEntry(runner, "getPlaybackDeviceMute", callTime12, {});

        // setRecordingDeviceMute
        const callTime13 = Date.now();
        await m.setRecordingDeviceMute(false);
        this.assertLogEntry(runner, "setRecordingDeviceMute", callTime13, { mute: false });

        // getRecordingDeviceMute
        const callTime14 = Date.now();
        m.getRecordingDeviceMute();
        this.assertLogEntry(runner, "getRecordingDeviceMute", callTime14, {});

        // startPlaybackDeviceTest
        const callTime15 = Date.now();
        await m.startPlaybackDeviceTest("/tmp/test.wav");
        this.assertLogEntry(runner, "startPlaybackDeviceTest", callTime15, {
            testAudioFilePath: "/tmp/test.wav",
        });

        // stopPlaybackDeviceTest
        const callTime16 = Date.now();
        await m.stopPlaybackDeviceTest();
        this.assertLogEntry(runner, "stopPlaybackDeviceTest", callTime16, {});

        // startRecordingDeviceTest
        const callTime17 = Date.now();
        await m.startRecordingDeviceTest(200);
        this.assertLogEntry(runner, "startRecordingDeviceTest", callTime17, { indicationInterval: 200 });

        // stopRecordingDeviceTest
        const callTime18 = Date.now();
        await m.stopRecordingDeviceTest();
        this.assertLogEntry(runner, "stopRecordingDeviceTest", callTime18, {});

        // followSystemPlaybackDevice
        const callTime19 = Date.now();
        await m.followSystemPlaybackDevice(true);
        this.assertLogEntry(runner, "followSystemPlaybackDevice", callTime19, { enable: true });

        // followSystemRecordingDevice
        const callTime20 = Date.now();
        await m.followSystemRecordingDevice(false);
        this.assertLogEntry(runner, "followSystemRecordingDevice", callTime20, { enable: false });

        // setLoopbackDevice
        const callTime21 = Date.now();
        await m.setLoopbackDevice("loopback-id");
        this.assertLogEntry(runner, "setLoopbackDevice", callTime21, { deviceId: "loopback-id" });

        // getLoopbackDevice
        const callTime22 = Date.now();
        m.getLoopbackDevice();
        this.assertLogEntry(runner, "getLoopbackDevice", callTime22, {});

        // followSystemLoopbackDevice
        const callTime23 = Date.now();
        await m.followSystemLoopbackDevice(true);
        this.assertLogEntry(runner, "followSystemLoopbackDevice", callTime23, { enable: true });

        // startAudioDeviceLoopbackTest
        const callTime24 = Date.now();
        await m.startAudioDeviceLoopbackTest(200);
        this.assertLogEntry(runner, "startAudioDeviceLoopbackTest", callTime24, { indicationInterval: 200 });

        // stopAudioDeviceLoopbackTest
        const callTime25 = Date.now();
        await m.stopAudioDeviceLoopbackTest();
        this.assertLogEntry(runner, "stopAudioDeviceLoopbackTest", callTime25, {});

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IVideoDeviceManager ────────────────────────────

    private async testVideoDeviceManager(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: VideoDeviceManager ---");
        const bridge = this.createBridgeAndInit();

        const mgr = bridge.getVideoDeviceManager();
        runner.assert(mgr !== null, "getVideoDeviceManager should return non-null");

        const m = mgr as any;

        // enumerateVideoDevices
        const callTime1 = Date.now();
        const devices = m.enumerateVideoDevices();
        this.assertLogEntry(runner, "enumerateVideoDevices", callTime1, {});

        // setDevice
        const callTime2 = Date.now();
        await m.setDevice("video-device-id");
        this.assertLogEntry(runner, "setDevice", callTime2, { deviceId: "video-device-id" });

        // getDevice
        const callTime3 = Date.now();
        m.getDevice();
        this.assertLogEntry(runner, "getDevice", callTime3, {});

        // numberOfCapabilities
        const callTime4 = Date.now();
        m.numberOfCapabilities("video-device-id");
        this.assertLogEntry(runner, "numberOfCapabilities", callTime4, { deviceId: "video-device-id" });

        // getCapability
        const callTime5 = Date.now();
        m.getCapability("video-device-id", 0);
        this.assertLogEntry(runner, "getCapability", callTime5, {
            deviceId: "video-device-id",
            deviceCapabilityNumber: 0,
        });

        // stopDeviceTest
        const callTime6 = Date.now();
        await m.stopDeviceTest();
        this.assertLogEntry(runner, "stopDeviceTest", callTime6, {});

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IH265Transcoder ────────────────────────────

    private async testH265Transcoder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: H265Transcoder ---");
        const bridge = this.createBridgeAndInit();

        const transcoder = bridge.getH265Transcoder();
        runner.assert(transcoder !== null, "getH265Transcoder should return non-null");

        const t = transcoder as any;

        // enableTranscode
        const callTime1 = Date.now();
        await t.enableTranscode("token123", "channel1", 42);
        this.assertLogEntry(runner, "enableTranscode", callTime1, {
            token: "token123",
            channel: "channel1",
            uid: 42,
        });

        // queryChannel
        const callTime2 = Date.now();
        await t.queryChannel("token456", "channel2", 100);
        this.assertLogEntry(runner, "queryChannel", callTime2, {
            token: "token456",
            channel: "channel2",
            uid: 100,
        });

        // triggerTranscode
        const callTime3 = Date.now();
        await t.triggerTranscode("token789", "channel3", 200);
        this.assertLogEntry(runner, "triggerTranscode", callTime3, {
            token: "token789",
            channel: "channel3",
            uid: 200,
        });

        // registerTranscoderObserver
        const callTime4 = Date.now();
        t.registerTranscoderObserver({});
        this.assertLogEntry(runner, "registerTranscoderObserver", callTime4, {});

        // unregisterTranscoderObserver
        const callTime5 = Date.now();
        t.unregisterTranscoderObserver();
        this.assertLogEntry(runner, "unregisterTranscoderObserver", callTime5, {});

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── ILocalSpatialAudioEngine ────────────────────────────

    private async testLocalSpatialAudioEngine(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: LocalSpatialAudioEngine ---");
        const bridge = this.createBridgeAndInit();

        const engine = bridge.getLocalSpatialAudioEngine();
        runner.assert(engine !== null, "getLocalSpatialAudioEngine should return non-null");

        const e = engine as any;

        // setMaxAudioRecvCount
        const callTime1 = Date.now();
        await e.setMaxAudioRecvCount(10);
        this.assertLogEntry(runner, "setMaxAudioRecvCount", callTime1, { maxCount: 10 });

        // setAudioRecvRange
        const callTime2 = Date.now();
        await e.setAudioRecvRange(50.0);
        this.assertLogEntry(runner, "setAudioRecvRange", callTime2, { range: 50.0 });

        // setDistanceUnit
        const callTime3 = Date.now();
        await e.setDistanceUnit(1.0);
        this.assertLogEntry(runner, "setDistanceUnit", callTime3, { unit: 1.0 });

        // updateSelfPosition
        const callTime4 = Date.now();
        await e.updateSelfPosition([1, 2, 3], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
        this.assertLogEntry(runner, "updateSelfPosition", callTime4, {
            position: [1, 2, 3],
            axisForward: [0, 0, -1],
            axisRight: [1, 0, 0],
            axisUp: [0, 1, 0],
        });

        // updateRemotePosition
        const callTime5 = Date.now();
        await e.updateRemotePosition(42, {
            position: [4, 5, 6],
            forward: [0, 0, -1],
        });
        this.assertLogEntry(runner, "updateRemotePosition", callTime5, {
            uid: 42,
            posInfo: { position: [4, 5, 6], forward: [0, 0, -1] },
        });

        // removeRemotePosition
        const callTime6 = Date.now();
        await e.removeRemotePosition(42);
        this.assertLogEntry(runner, "removeRemotePosition", callTime6, { uid: 42 });

        // clearRemotePositions
        const callTime7 = Date.now();
        await e.clearRemotePositions();
        this.assertLogEntry(runner, "clearRemotePositions", callTime7, {});

        // muteLocalAudioStream
        const callTime8 = Date.now();
        await e.muteLocalAudioStream(true);
        this.assertLogEntry(runner, "muteLocalAudioStream", callTime8, { mute: true });

        // muteAllRemoteAudioStreams
        const callTime9 = Date.now();
        await e.muteAllRemoteAudioStreams(false);
        this.assertLogEntry(runner, "muteAllRemoteAudioStreams", callTime9, { mute: false });

        // muteRemoteAudioStream
        const callTime10 = Date.now();
        await e.muteRemoteAudioStream(42, true);
        this.assertLogEntry(runner, "muteRemoteAudioStream", callTime10, { uid: 42, mute: true });

        // setRemoteAudioAttenuation
        const callTime11 = Date.now();
        await e.setRemoteAudioAttenuation(42, 0.5, true);
        this.assertLogEntry(runner, "setRemoteAudioAttenuation", callTime11, {
            uid: 42,
            attenuation: 0.5,
            forceSet: true,
        });

        // setParameters
        const callTime12 = Date.now();
        await e.setParameters('{"key":"value"}');
        this.assertLogEntry(runner, "setParameters", callTime12, { params: '{"key":"value"}' });

        // updatePlayerPositionInfo
        const callTime13 = Date.now();
        await e.updatePlayerPositionInfo(1, {
            position: [7, 8, 9],
            forward: [0, 0, -1],
        });
        this.assertLogEntry(runner, "updatePlayerPositionInfo", callTime13, {
            playerId: 1,
            positionInfo: { position: [7, 8, 9], forward: [0, 0, -1] },
        });

        // setPlayerAttenuation
        const callTime14 = Date.now();
        await e.setPlayerAttenuation(1, 0.8, false);
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

        const mcc = bridge.getMusicContentCenter();
        runner.assert(mcc !== null, "getMusicContentCenter should return non-null");

        const m = mcc as any;

        // renewToken
        const callTime1 = Date.now();
        await m.renewToken("newMccToken");
        this.assertLogEntry(runner, "renewToken", callTime1, { token: "newMccToken" });

        // registerEventHandler
        const callTime2 = Date.now();
        m.registerEventHandler({});
        this.assertLogEntry(runner, "registerEventHandler", callTime2, {});

        // unregisterEventHandler
        const callTime3 = Date.now();
        m.unregisterEventHandler();
        this.assertLogEntry(runner, "unregisterEventHandler", callTime3, {});

        // getMusicCharts
        const callTime4 = Date.now();
        m.getMusicCharts();
        this.assertLogEntry(runner, "getMusicCharts", callTime4, {});

        // getMusicCollectionByMusicChartId
        const callTime5 = Date.now();
        m.getMusicCollectionByMusicChartId(1, 0, 10, "");
        this.assertLogEntry(runner, "getMusicCollectionByMusicChartId", callTime5, {
            musicChartId: 1,
            page: 0,
            pageSize: 10,
            jsonOption: "",
        });

        // searchMusic
        const callTime6 = Date.now();
        m.searchMusic("love", 0, 20, "");
        this.assertLogEntry(runner, "searchMusic", callTime6, {
            keyword: "love",
            page: 0,
            pageSize: 20,
            jsonOption: "",
        });

        // preload (with jsonOption)
        const callTime7 = Date.now();
        m.preload(12345, "{}");
        this.assertLogEntry(runner, "preload", callTime7, { songCode: 12345, jsonOption: "{}" });

        // removeCache
        const callTime8 = Date.now();
        m.removeCache(12345);
        this.assertLogEntry(runner, "removeCache", callTime8, { songCode: 12345 });

        // getCaches
        const callTime9 = Date.now();
        m.getCaches(10);
        this.assertLogEntry(runner, "getCaches", callTime9, { cacheInfoSize: 10 });

        // isPreloaded
        const callTime10 = Date.now();
        m.isPreloaded(12345);
        this.assertLogEntry(runner, "isPreloaded", callTime10, { songCode: 12345 });

        // getLyric
        const callTime11 = Date.now();
        m.getLyric(12345, 0);
        this.assertLogEntry(runner, "getLyric", callTime11, { songCode: 12345, lyricType: 0 });

        // getSongSimpleInfo
        const callTime12 = Date.now();
        m.getSongSimpleInfo(12345);
        this.assertLogEntry(runner, "getSongSimpleInfo", callTime12, { songCode: 12345 });

        // getInternalSongCode
        const callTime13 = Date.now();
        m.getInternalSongCode(12345, "{}");
        this.assertLogEntry(runner, "getInternalSongCode", callTime13, {
            songCode: 12345,
            jsonOption: "{}",
        });

        // createMusicPlayer / destroyMusicPlayer
        const callTime14 = Date.now();
        const player = m.createMusicPlayer();
        this.assertLogEntry(runner, "createMusicPlayer", callTime14, {});

        if (player) {
            const callTime15 = Date.now();
            m.destroyMusicPlayer(player);
            this.assertLogEntry(runner, "destroyMusicPlayer", callTime15, {});
        }

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IMediaPlayerCacheManager ────────────────────────────

    private async testMediaPlayerCacheManager(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: MediaPlayerCacheManager ---");
        const bridge = this.createBridgeAndInit();

        const cacheMgr = bridge.getMediaPlayerCacheManager();
        runner.assert(cacheMgr !== null, "getMediaPlayerCacheManager should return non-null");

        const c = cacheMgr as any;

        // removeAllCaches
        const callTime1 = Date.now();
        c.removeAllCaches();
        this.assertLogEntry(runner, "removeAllCaches", callTime1, {});

        // removeOldCache
        const callTime2 = Date.now();
        c.removeOldCache();
        this.assertLogEntry(runner, "removeOldCache", callTime2, {});

        // removeCacheByUri
        const callTime3 = Date.now();
        c.removeCacheByUri("https://example.com/cached.mp4");
        this.assertLogEntry(runner, "removeCacheByUri", callTime3, {
            uri: "https://example.com/cached.mp4",
        });

        // setCacheDir
        const callTime4 = Date.now();
        c.setCacheDir("/tmp/agora_cache");
        this.assertLogEntry(runner, "setCacheDir", callTime4, { path: "/tmp/agora_cache" });

        // setMaxCacheFileCount
        const callTime5 = Date.now();
        c.setMaxCacheFileCount(100);
        this.assertLogEntry(runner, "setMaxCacheFileCount", callTime5, { count: 100 });

        // setMaxCacheFileSize
        const callTime6 = Date.now();
        c.setMaxCacheFileSize(1024 * 1024 * 100);
        this.assertLogEntry(runner, "setMaxCacheFileSize", callTime6, { cacheSize: 1024 * 1024 * 100 });

        // enableAutoRemoveCache
        const callTime7 = Date.now();
        c.enableAutoRemoveCache(true);
        this.assertLogEntry(runner, "enableAutoRemoveCache", callTime7, { enable: true });

        // getCacheDir
        const callTime8 = Date.now();
        c.getCacheDir();
        this.assertLogEntry(runner, "getCacheDir", callTime8, {});

        // getMaxCacheFileCount
        const callTime9 = Date.now();
        c.getMaxCacheFileCount();
        this.assertLogEntry(runner, "getMaxCacheFileCount", callTime9, {});

        // getMaxCacheFileSize
        const callTime10 = Date.now();
        c.getMaxCacheFileSize();
        this.assertLogEntry(runner, "getMaxCacheFileSize", callTime10, {});

        // getCacheFileCount
        const callTime11 = Date.now();
        c.getCacheFileCount();
        this.assertLogEntry(runner, "getCacheFileCount", callTime11, {});

        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── IVideoEffectObject ────────────────────────────

    private async testVideoEffectObject(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: VideoEffectObject ---");
        const bridge = this.createBridgeAndInit();

        const effect = await bridge.createVideoEffectObject("", 0);
        runner.assert(effect !== null, "createVideoEffectObject should return non-null");

        const e = effect as any;

        // addOrUpdateVideoEffect
        const callTime1 = Date.now();
        await e.addOrUpdateVideoEffect(1, "effect_template_1");
        this.assertLogEntry(runner, "addOrUpdateVideoEffect", callTime1, {
            nodeId: 1,
            templateName: "effect_template_1",
        });

        // removeVideoEffect
        const callTime2 = Date.now();
        await e.removeVideoEffect(1);
        this.assertLogEntry(runner, "removeVideoEffect", callTime2, { nodeId: 1 });

        // performVideoEffectAction
        const callTime3 = Date.now();
        await e.performVideoEffectAction(1, 0);
        this.assertLogEntry(runner, "performVideoEffectAction", callTime3, {
            nodeId: 1,
            actionId: 0,
        });

        // setVideoEffectFloatParam
        const callTime4 = Date.now();
        await e.setVideoEffectFloatParam("option1", "key1", 1.5);
        this.assertLogEntry(runner, "setVideoEffectFloatParam", callTime4, {
            option: "option1",
            key: "key1",
            param: 1.5,
        });

        // setVideoEffectIntParam
        const callTime5 = Date.now();
        await e.setVideoEffectIntParam("option2", "key2", 42);
        this.assertLogEntry(runner, "setVideoEffectIntParam", callTime5, {
            option: "option2",
            key: "key2",
            param: 42,
        });

        // setVideoEffectBoolParam
        const callTime6 = Date.now();
        await e.setVideoEffectBoolParam("option3", "key3", true);
        this.assertLogEntry(runner, "setVideoEffectBoolParam", callTime6, {
            option: "option3",
            key: "key3",
            param: true,
        });

        // getVideoEffectFloatParam
        const callTime7 = Date.now();
        e.getVideoEffectFloatParam("option1", "key1");
        this.assertLogEntry(runner, "getVideoEffectFloatParam", callTime7, {
            option: "option1",
            key: "key1",
        });

        // getVideoEffectIntParam
        const callTime8 = Date.now();
        e.getVideoEffectIntParam("option2", "key2");
        this.assertLogEntry(runner, "getVideoEffectIntParam", callTime8, {
            option: "option2",
            key: "key2",
        });

        // getVideoEffectBoolParam
        const callTime9 = Date.now();
        e.getVideoEffectBoolParam("option3", "key3");
        this.assertLogEntry(runner, "getVideoEffectBoolParam", callTime9, {
            option: "option3",
            key: "key3",
        });

        await bridge.destroyVideoEffectObject(effect);
        await bridge.release(true);
        await this.delay(200);
    }
}
