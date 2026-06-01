/**
 * Call API Tests (Log-Based Verification)
 *
 * Tests that API calls are properly forwarded from JS to C++ mock.
 * Uses log-based verification: JS records callTime, mock writes to
 * agora_test_log.jsonl, JS reads log and verifies parameters.
 *
 * Log accumulates across all tests (no clearLog) for debugging.
 * assertLogEntry verifies ALL parameters for each API call.
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

export class CallApiTestSuite extends TestCase {
    private static readonly LOG_TIME_TOLERANCE = 100;

    constructor() {
        super("CallApiTestSuite");
    }

    async run(runner: TestRunner): Promise<void> {
        // IMPORTANT: Test case order MUST match RtcEngineExBridge.h function declaration order for easy diff
        runner.log("\n=== Running Call API Tests ===");

        await this.testRelease(runner);
        await this.testInitialize(runner);
        await this.testQueryDeviceScore(runner);
        await this.testJoinChannel(runner);
        await this.testLeaveChannel(runner);
        await this.testRenewToken(runner);
        await this.testSetChannelProfile(runner);
        await this.testSetClientRole(runner);
        await this.testStopEchoTest(runner);
        await this.testEnableVideo(runner);
        await this.testDisableVideo(runner);
        await this.testStartPreview(runner);
        await this.testStopPreview(runner);
        await this.testSetVideoEncoderConfiguration(runner);
        await this.testSetupRemoteVideo(runner);
        await this.testSetupLocalVideo(runner);
        await this.testSetVideoScenario(runner);
        await this.testEnableAudio(runner);
        await this.testDisableAudio(runner);
        await this.testSetAudioProfile(runner);
        await this.testSetAudioScenario(runner);
        await this.testEnableLocalAudio(runner);
        await this.testMuteLocalAudioStream(runner);
        await this.testMuteAllRemoteAudioStreams(runner);
        await this.testMuteRemoteAudioStream(runner);
        await this.testMuteLocalVideoStream(runner);
        await this.testEnableLocalVideo(runner);
        await this.testMuteAllRemoteVideoStreams(runner);
        await this.testSetRemoteDefaultVideoStreamType(runner);
        await this.testMuteRemoteVideoStream(runner);
        await this.testSetRemoteVideoStreamType(runner);
        await this.testEnableAudioVolumeIndication(runner);
        await this.testStartAudioMixing(runner);
        await this.testStopAudioMixing(runner);
        await this.testPauseAudioMixing(runner);
        await this.testResumeAudioMixing(runner);
        await this.testAdjustAudioMixingVolume(runner);
        await this.testSetAudioMixingPosition(runner);
        await this.testSetAudioMixingPitch(runner);
        await this.testSetAudioMixingPlaybackSpeed(runner);
        await this.testGetEffectsVolume(runner);
        await this.testSetEffectsVolume(runner);
        await this.testPlayEffect(runner);
        await this.testGetVolumeOfEffect(runner);
        await this.testSetVolumeOfEffect(runner);
        await this.testPauseEffect(runner);
        await this.testPauseAllEffects(runner);
        await this.testResumeEffect(runner);
        await this.testResumeAllEffects(runner);
        await this.testStopEffect(runner);
        await this.testStopAllEffects(runner);
        await this.testUnloadEffect(runner);
        await this.testUnloadAllEffects(runner);
        await this.testEnableSoundPositionIndication(runner);
        await this.testSetRemoteVoicePosition(runner);
        await this.testEnableSpatialAudio(runner);
        await this.testSetVoiceBeautifierPreset(runner);
        await this.testSetAudioEffectPreset(runner);
        await this.testSetVoiceConversionPreset(runner);
        await this.testSetLocalVoicePitch(runner);
        await this.testSetLocalVoiceFormant(runner);
        await this.testSetLocalVoiceEqualization(runner);
        await this.testSetLocalVoiceReverb(runner);
        await this.testSetHeadphoneEQPreset(runner);
        await this.testSetHeadphoneEQParameters(runner);
        await this.testEnableVoiceAITuner(runner);
        await this.testSetLogFile(runner);
        await this.testSetLogFilter(runner);
        await this.testSetLogLevel(runner);
        await this.testSetLogFileSize(runner);
        await this.testSetLocalRenderMode(runner);
        await this.testSetRemoteRenderMode(runner);
        await this.testSetLocalVideoMirrorMode(runner);
        await this.testEnableDualStreamMode(runner);
        await this.testSetDualStreamMode(runner);
        await this.testAdjustRecordingSignalVolume(runner);
        await this.testAdjustPlaybackSignalVolume(runner);
        await this.testAdjustUserPlaybackSignalVolume(runner);
        await this.testEnableInEarMonitoring(runner);
        await this.testSetInEarMonitoringVolume(runner);
        await this.testStartScreenCapture(runner);
        await this.testSetScreenCaptureScenario(runner);
        await this.testStopScreenCapture(runner);
        await this.testEnableEncryption(runner);
        await this.testEnableWebSdkInteroperability(runner);
        await this.testSetAINSMode(runner);
        await this.testSetCloudProxy(runner);
        await this.testSetParameters(runner);
        await this.testStartMediaRenderingTracing(runner);
        await this.testEnableInstantMediaRendering(runner);

        await this.testCreateDataStream(runner);
        await this.testSendStreamMessage(runner);
        await this.testSendStreamMessageEx(runner);

        // Full lifecycle (verifies accumulated log count)
        await this.testFullLifecycle(runner);
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

    /**
     * Assert that a log entry exists for `fnName` near `callTime` AND that its
     * params match `expectedParams` **exactly** (no extra keys, no missing keys,
     * all values equal).
     */
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

        // Verify every expected key
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

        // Verify no extra keys in the log entry
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
            if (entry.fn === fnName && Math.abs(entry.ts - callTime) <= CallApiTestSuite.LOG_TIME_TOLERANCE) {
                return entry;
            }
        }
        return null;
    }

    // ──────────────────────────── Lifecycle ────────────────────────────

    private async testInitialize(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testInitialize ---");
        const bridge = new (jsb as any).agora.RtcEngineExBridge() as IRtcEngineEx;
        const callTime = Date.now();

        await bridge.initialize({
            eventHandler: new RtcEngineEventHandler(),
            appId: "myTestApp",
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
        this.assertLogEntry(runner, "initialize", callTime, { appId: "myTestApp" });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testJoinChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannel ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.joinChannel("myToken", "myChannel", "myInfo", 12345);
        this.assertLogEntry(runner, "joinChannel", callTime, {
            token: "myToken",
            channelId: "myChannel",
            info: "myInfo",
            uid: 12345,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testLeaveChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannel ---");
        const bridge = this.createBridgeAndInit();

        await bridge.joinChannel("t", "c", "", 0);
        const callTime = Date.now();
        await bridge.leaveChannel();
        this.assertLogEntry(runner, "leaveChannel", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testRelease(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRelease ---");
        const bridge = this.createBridgeAndInit();

        await bridge.release(true);
        runner.assert(true, "release should complete without throwing");
        await this.delay(200);
    }

    private async testRenewToken(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRenewToken ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.renewToken("newToken123");
        this.assertLogEntry(runner, "renewToken", callTime, { token: "newToken123" });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Channel Profile & Client Role ────────────────────────────

    private async testSetChannelProfile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetChannelProfile ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setChannelProfile(1);
        this.assertLogEntry(runner, "setChannelProfile", callTime, { profile: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetClientRole(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetClientRole ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setClientRole(2);
        this.assertLogEntry(runner, "setClientRole", callTime, { role: 2 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Video ────────────────────────────

    private async testEnableVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVideo ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableVideo();
        this.assertLogEntry(runner, "enableVideo", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testDisableVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testDisableVideo ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.disableVideo();
        this.assertLogEntry(runner, "disableVideo", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableLocalVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLocalVideo ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableLocalVideo(false);
        this.assertLogEntry(runner, "enableLocalVideo", callTime, { enabled: false });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStartPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartPreview ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.startPreview();
        this.assertLogEntry(runner, "startPreview", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStopPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopPreview ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.stopPreview();
        this.assertLogEntry(runner, "stopPreview", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetVideoEncoderConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoEncoderConfiguration ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setVideoEncoderConfiguration({
            dimensions: { width: 640, height: 480 },
            codecType: 2,
            orientationMode: 0,
            degradationPreference: 1,
            mirrorMode: 0,
            frameRate: 15,
            bitrate: 800,
            minBitrate: 400,
            advanceOptions: { compressionPreference: 0, encodingPreference: 0, encodeAlpha: false },
        });
        this.assertLogEntry(runner, "setVideoEncoderConfiguration", callTime, {
            codecType: 2,
            orientationMode: 0,
            degradationPreference: 1,
            mirrorMode: 0,
            frameRate: 15,
            bitrate: 800,
            minBitrate: 400,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetupLocalVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetupLocalVideo ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setupLocalVideo({
            view: null as any,
            renderMode: 1,
            uid: 0,
            sourceType: 0,
            mirrorMode: 2,
            mediaPlayerId: 0,
        });
        this.assertLogEntry(runner, "setupLocalVideo", callTime, {
            renderMode: 1,
            uid: 0,
            sourceType: 0,
            mirrorMode: 2,
            mediaPlayerId: 0,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetupRemoteVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetupRemoteVideo ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setupRemoteVideo({
            view: null as any,
            renderMode: 2,
            uid: 999,
            sourceType: 0,
            mirrorMode: 0,
            mediaPlayerId: 0,
        });
        this.assertLogEntry(runner, "setupRemoteVideo", callTime, {
            renderMode: 2,
            uid: 999,
            sourceType: 0,
            mirrorMode: 0,
            mediaPlayerId: 0,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetVideoScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoScenario ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setVideoScenario(1);
        this.assertLogEntry(runner, "setVideoScenario", callTime, { scenarioType: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Audio Enable/Disable ────────────────────────────

    private async testEnableAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudio ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableAudio();
        this.assertLogEntry(runner, "enableAudio", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testDisableAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testDisableAudio ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.disableAudio();
        this.assertLogEntry(runner, "disableAudio", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableLocalAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLocalAudio ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableLocalAudio(true);
        this.assertLogEntry(runner, "enableLocalAudio", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAudioProfile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioProfile ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAudioProfile(2);
        this.assertLogEntry(runner, "setAudioProfile", callTime, { profile: 2 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAudioScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioScenario ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAudioScenario(3);
        this.assertLogEntry(runner, "setAudioScenario", callTime, { scenario: 3 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Mute Streams ────────────────────────────

    private async testMuteLocalAudioStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalAudioStream ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.muteLocalAudioStream(true);
        this.assertLogEntry(runner, "muteLocalAudioStream", callTime, { mute: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testMuteLocalVideoStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalVideoStream ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.muteLocalVideoStream(false);
        this.assertLogEntry(runner, "muteLocalVideoStream", callTime, { mute: false });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testMuteAllRemoteAudioStreams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteAudioStreams ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.muteAllRemoteAudioStreams(true);
        this.assertLogEntry(runner, "muteAllRemoteAudioStreams", callTime, { mute: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testMuteAllRemoteVideoStreams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteVideoStreams ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.muteAllRemoteVideoStreams(false);
        this.assertLogEntry(runner, "muteAllRemoteVideoStreams", callTime, { mute: false });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testMuteRemoteAudioStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteAudioStream ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.muteRemoteAudioStream(42, true);
        this.assertLogEntry(runner, "muteRemoteAudioStream", callTime, { uid: 42, mute: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testMuteRemoteVideoStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteVideoStream ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.muteRemoteVideoStream(100, false);
        this.assertLogEntry(runner, "muteRemoteVideoStream", callTime, { uid: 100, mute: false });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Remote Video Stream Type ────────────────────────────

    private async testSetRemoteDefaultVideoStreamType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteDefaultVideoStreamType ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setRemoteDefaultVideoStreamType(1);
        this.assertLogEntry(runner, "setRemoteDefaultVideoStreamType", callTime, { streamType: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetRemoteVideoStreamType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoStreamType ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setRemoteVideoStreamType(55, 0);
        this.assertLogEntry(runner, "setRemoteVideoStreamType", callTime, { uid: 55, streamType: 0 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Audio Volume Indication ────────────────────────────

    private async testEnableAudioVolumeIndication(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudioVolumeIndication ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableAudioVolumeIndication(200, 3, true);
        this.assertLogEntry(runner, "enableAudioVolumeIndication", callTime, {
            interval: 200,
            smooth: 3,
            reportVad: true,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testAdjustRecordingSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustRecordingSignalVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.adjustRecordingSignalVolume(80);
        this.assertLogEntry(runner, "adjustRecordingSignalVolume", callTime, { volume: 80 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testAdjustPlaybackSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustPlaybackSignalVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.adjustPlaybackSignalVolume(90);
        this.assertLogEntry(runner, "adjustPlaybackSignalVolume", callTime, { volume: 90 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testAdjustUserPlaybackSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustUserPlaybackSignalVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.adjustUserPlaybackSignalVolume(77, 50);
        this.assertLogEntry(runner, "adjustUserPlaybackSignalVolume", callTime, { uid: 77, volume: 50 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Logging ────────────────────────────

    private async testSetLogFile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFile ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLogFile("/tmp/agora_sdk.log");
        this.assertLogEntry(runner, "setLogFile", callTime, { filePath: "/tmp/agora_sdk.log" });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLogFilter(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFilter ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLogFilter(0x80f);
        this.assertLogEntry(runner, "setLogFilter", callTime, { filter: 0x80f });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLogFileSize(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFileSize ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLogFileSize(2048);
        this.assertLogEntry(runner, "setLogFileSize", callTime, { fileSizeInKBytes: 2048 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLogLevel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogLevel ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLogLevel(1);
        this.assertLogEntry(runner, "setLogLevel", callTime, { level: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Voice & Audio Effects ────────────────────────────

    private async testSetLocalVoicePitch(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoicePitch ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLocalVoicePitch(0.5);
        this.assertLogEntry(runner, "setLocalVoicePitch", callTime, { pitch: 0.5 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLocalVoiceFormant(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceFormant ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLocalVoiceFormant(0.8);
        this.assertLogEntry(runner, "setLocalVoiceFormant", callTime, { formantRatio: 0.8 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLocalVoiceEqualization(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceEqualization ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLocalVoiceEqualization(3, 5);
        this.assertLogEntry(runner, "setLocalVoiceEqualization", callTime, {
            bandFrequency: 3,
            bandGain: 5,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLocalVoiceReverb(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceReverb ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLocalVoiceReverb(1, 40);
        this.assertLogEntry(runner, "setLocalVoiceReverb", callTime, { reverbKey: 1, value: 40 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetHeadphoneEQPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHeadphoneEQPreset ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setHeadphoneEQPreset(1 as any);
        this.assertLogEntry(runner, "setHeadphoneEQPreset", callTime, { preset: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetHeadphoneEQParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHeadphoneEQParameters ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setHeadphoneEQParameters(3, 7);
        this.assertLogEntry(runner, "setHeadphoneEQParameters", callTime, { lowGain: 3, highGain: 7 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableVoiceAITuner(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVoiceAITuner ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableVoiceAITuner(true, 2);
        this.assertLogEntry(runner, "enableVoiceAITuner", callTime, { enabled: true, type: 2 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetVoiceBeautifierPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceBeautifierPreset ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setVoiceBeautifierPreset(0x01010100);
        this.assertLogEntry(runner, "setVoiceBeautifierPreset", callTime, { preset: 0x01010100 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAudioEffectPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioEffectPreset ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAudioEffectPreset(0x02010100);
        this.assertLogEntry(runner, "setAudioEffectPreset", callTime, { preset: 0x02010100 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetVoiceConversionPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceConversionPreset ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setVoiceConversionPreset(0x03010100);
        this.assertLogEntry(runner, "setVoiceConversionPreset", callTime, { preset: 0x03010100 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Spatial Audio & Sound Position ────────────────────────────

    private async testEnableSoundPositionIndication(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableSoundPositionIndication ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableSoundPositionIndication(true);
        this.assertLogEntry(runner, "enableSoundPositionIndication", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetRemoteVoicePosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVoicePosition ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setRemoteVoicePosition(42, 0.5, 10.0);
        this.assertLogEntry(runner, "setRemoteVoicePosition", callTime, {
            uid: 42,
            pan: 0.5,
            gain: 10.0,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableSpatialAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableSpatialAudio ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableSpatialAudio(false);
        this.assertLogEntry(runner, "enableSpatialAudio", callTime, { enabled: false });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Audio Mixing ────────────────────────────

    private async testStartAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartAudioMixing ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.startAudioMixing("/music/song.mp3", false, 1, 0);
        this.assertLogEntry(runner, "startAudioMixing", callTime, {
            filePath: "/music/song.mp3",
            loopback: false,
            cycle: 1,
            startPos: 0,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStopAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAudioMixing ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.stopAudioMixing();
        this.assertLogEntry(runner, "stopAudioMixing", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testPauseAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAudioMixing ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.pauseAudioMixing();
        this.assertLogEntry(runner, "pauseAudioMixing", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testResumeAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAudioMixing ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.resumeAudioMixing();
        this.assertLogEntry(runner, "resumeAudioMixing", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testAdjustAudioMixingVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.adjustAudioMixingVolume(75);
        this.assertLogEntry(runner, "adjustAudioMixingVolume", callTime, { volume: 75 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAudioMixingPosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPosition ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAudioMixingPosition(5000);
        this.assertLogEntry(runner, "setAudioMixingPosition", callTime, { pos: 5000 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAudioMixingPitch(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPitch ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAudioMixingPitch(2);
        this.assertLogEntry(runner, "setAudioMixingPitch", callTime, { pitch: 2 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAudioMixingPlaybackSpeed(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPlaybackSpeed ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAudioMixingPlaybackSpeed(120);
        this.assertLogEntry(runner, "setAudioMixingPlaybackSpeed", callTime, { speed: 120 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Sound Effects ────────────────────────────

    private async testSetEffectsVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEffectsVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setEffectsVolume(60);
        this.assertLogEntry(runner, "setEffectsVolume", callTime, { volume: 60 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testPlayEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPlayEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.playEffect(1, "/sounds/effect.wav", 0, 1.0, 0.0, 100, false, 0);
        this.assertLogEntry(runner, "playEffect", callTime, {
            soundId: 1,
            filePath: "/sounds/effect.wav",
            loopCount: 0,
            pitch: 1.0,
            pan: 0.0,
            gain: 100,
            publish: false,
            startPos: 0,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testPauseEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.pauseEffect(1);
        this.assertLogEntry(runner, "pauseEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testResumeEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.resumeEffect(1);
        this.assertLogEntry(runner, "resumeEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStopEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.stopEffect(1);
        this.assertLogEntry(runner, "stopEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testUnloadEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUnloadEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.unloadEffect(1);
        this.assertLogEntry(runner, "unloadEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetVolumeOfEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVolumeOfEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setVolumeOfEffect(1, 80);
        this.assertLogEntry(runner, "setVolumeOfEffect", callTime, { soundId: 1, volume: 80 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testGetVolumeOfEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetVolumeOfEffect ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.getVolumeOfEffect(1);
        this.assertLogEntry(runner, "getVolumeOfEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testPauseAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllEffects ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.pauseAllEffects();
        this.assertLogEntry(runner, "pauseAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testResumeAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllEffects ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.resumeAllEffects();
        this.assertLogEntry(runner, "resumeAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStopAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAllEffects ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.stopAllEffects();
        this.assertLogEntry(runner, "stopAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testUnloadAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUnloadAllEffects ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.unloadAllEffects();
        this.assertLogEntry(runner, "unloadAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testGetEffectsVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetEffectsVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.getEffectsVolume();
        this.assertLogEntry(runner, "getEffectsVolume", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Echo Test ────────────────────────────

    private async testStopEchoTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopEchoTest ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.stopEchoTest();
        this.assertLogEntry(runner, "stopEchoTest", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Screen Capture ────────────────────────────

    private async testStartScreenCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartScreenCapture ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.startScreenCapture(2, {
            isCaptureWindow: false,
            displayId: 0,
            screenRect: { x: 0, y: 0, width: 0, height: 0 },
            windowId: 0,
            params: {
                dimensions: { width: 1920, height: 1080 },
                frameRate: 15,
                bitrate: 1000,
                captureAudio: false,
                audioParams: {
                    sampleRate: 16000,
                    channels: 1,
                    captureSignalVolume: 100,
                    excludeCurrentProcessAudio: false,
                },
                captureMouseCursor: true,
                windowFocus: false,
                excludeWindowList: [],
                excludeWindowCount: 0,
                highLightWidth: 0,
                highLightColor: 0,
                enableHighLight: false,
            },
            regionRect: { x: 0, y: 0, width: 0, height: 0 },
        });
        this.assertLogEntry(runner, "startScreenCapture", callTime, {
            sourceType: 2,
            config: {
                isCaptureWindow: false,
                displayId: 0,
                captureWidth: 1920,
                captureHeight: 1080,
                frameRate: 15,
                bitrate: 1000,
            },
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStopScreenCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopScreenCapture ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.stopScreenCapture();
        this.assertLogEntry(runner, "stopScreenCapture", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetScreenCaptureScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureScenario ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setScreenCaptureScenario(1);
        this.assertLogEntry(runner, "setScreenCaptureScenario", callTime, { screenScenario: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Render Modes ────────────────────────────

    private async testSetLocalRenderMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalRenderMode ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLocalRenderMode(1);
        this.assertLogEntry(runner, "setLocalRenderMode", callTime, { renderMode: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetRemoteRenderMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteRenderMode ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setRemoteRenderMode(42, 2, 1);
        this.assertLogEntry(runner, "setRemoteRenderMode", callTime, {
            uid: 42,
            renderMode: 2,
            mirrorMode: 1,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetLocalVideoMirrorMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVideoMirrorMode ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setLocalVideoMirrorMode(2);
        this.assertLogEntry(runner, "setLocalVideoMirrorMode", callTime, { mirrorMode: 2 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Dual Stream ────────────────────────────

    private async testEnableDualStreamMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableDualStreamMode ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableDualStreamMode(true);
        this.assertLogEntry(runner, "enableDualStreamMode", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetDualStreamMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDualStreamMode ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setDualStreamMode(1);
        this.assertLogEntry(runner, "setDualStreamMode", callTime, { mode: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── In-Ear Monitoring ────────────────────────────

    private async testEnableInEarMonitoring(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableInEarMonitoring ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableInEarMonitoring(true, 0);
        this.assertLogEntry(runner, "enableInEarMonitoring", callTime, {
            enabled: true,
            includeAudioFilters: 0,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetInEarMonitoringVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetInEarMonitoringVolume ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setInEarMonitoringVolume(70);
        this.assertLogEntry(runner, "setInEarMonitoringVolume", callTime, { volume: 70 });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Misc ────────────────────────────

    private async testSetParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParameters ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setParameters('{"che.audio.enable.aec":true}');
        this.assertLogEntry(runner, "setParameters", callTime, {
            parameters: '{"che.audio.enable.aec":true}',
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetAINSMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAINSMode ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setAINSMode(true, 2);
        this.assertLogEntry(runner, "setAINSMode", callTime, { enabled: true, mode: 2 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableEncryption(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableEncryption ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableEncryption(true, {
            encryptionMode: 1,
            encryptionKey: "secret123",
            encryptionKdfSalt: new Uint8Array(0),
            datastreamEncryptionEnabled: false,
        });
        this.assertLogEntry(runner, "enableEncryption", callTime, {
            enabled: true,
            encryptionMode: 1,
            encryptionKey: "secret123",
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSetCloudProxy(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCloudProxy ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.setCloudProxy(1);
        this.assertLogEntry(runner, "setCloudProxy", callTime, { proxyType: 1 });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableWebSdkInteroperability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableWebSdkInteroperability ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableWebSdkInteroperability(true);
        this.assertLogEntry(runner, "enableWebSdkInteroperability", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testStartMediaRenderingTracing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartMediaRenderingTracing ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.startMediaRenderingTracing();
        this.assertLogEntry(runner, "startMediaRenderingTracing", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testEnableInstantMediaRendering(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableInstantMediaRendering ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.enableInstantMediaRendering();
        this.assertLogEntry(runner, "enableInstantMediaRendering", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    private async testQueryDeviceScore(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryDeviceScore ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.queryDeviceScore();
        this.assertLogEntry(runner, "queryDeviceScore", callTime, {});
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Data Stream ────────────────────────────

    private async testCreateDataStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testCreateDataStream ---");
        const bridge = this.createBridgeAndInit();

        const callTime = Date.now();
        await bridge.createDataStream({ ordered: true, syncWithAudio: false });
        this.assertLogEntry(runner, "createDataStream", callTime, {
            ordered: true,
            syncWithAudio: false,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSendStreamMessage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendStreamMessage ---");
        const bridge = this.createBridgeAndInit();

        const data = new Uint8Array([97, 103]);
        const callTime = Date.now();
        await (bridge as any).sendStreamMessage(1, data.buffer);
        this.assertLogEntry(runner, "sendStreamMessage", callTime, {
            streamId: 1,
            data: "ag",
            length: 2,
        });
        await bridge.release(true);
        await this.delay(200);
    }

    private async testSendStreamMessageEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendStreamMessageEx ---");
        const bridge = this.createBridgeAndInit();

        const data = new Uint8Array([97, 103]);
        const callTime = Date.now();
        await (bridge as any).sendStreamMessageEx(1, data.buffer, {
            channelId: "testChannel",
            localUid: 42,
        });
        this.assertLogEntry(runner, "sendStreamMessageEx", callTime, {
            streamId: 1,
            data: "ag",
            length: 2,
            connection: { channelId: "", localUid: 42 },
        });
        await bridge.release(true);
        await this.delay(200);
    }

    // ──────────────────────────── Full Lifecycle ────────────────────────────

    private async testFullLifecycle(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testFullLifecycle ---");
        const bridge = this.createBridgeAndInit();

        // Note: createBridgeAndInit() already calls initialize(), so we don't call it again

        const joinTime = Date.now();
        await bridge.joinChannel("token", "channel", "info", 42);
        this.assertLogEntry(runner, "joinChannel", joinTime, {
            token: "token",
            channelId: "channel",
            info: "info",
            uid: 42,
        });

        const leaveTime = Date.now();
        await bridge.leaveChannel();
        this.assertLogEntry(runner, "leaveChannel", leaveTime, {});

        // Verify log accumulated (should have many entries from all tests)
        const logStr: string = (jsb as any).agora.test.readLog();
        const logArray: LogEntry[] = JSON.parse(logStr);
        runner.assert(logArray.length > 80, "Expected 80+ accumulated log entries (got " + logArray.length + ")");

        await bridge.release(true);
        await this.delay(200);
    }
}
