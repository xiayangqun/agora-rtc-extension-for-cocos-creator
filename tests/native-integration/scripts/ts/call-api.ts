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
    private static readonly LOG_TIME_TOLERANCE = 20;

    constructor() {
        super("CallApiTestSuite");
    }

    async run(runner: TestRunner): Promise<void> {
        // IMPORTANT: Test case order MUST match IRtcEngine/IRtcEngineEx declaration order
        runner.log("\n=== Running Call API Tests ===");

        // ── IRtcEngine methods ──
        await this.testRelease(runner);
        await this.testInitialize(runner);
        await this.testQueryDeviceScore(runner);
        await this.testPreloadChannel(runner);
        await this.testPreloadChannelWithUserAccount(runner);
        await this.testUpdatePreloadChannelToken(runner);
        await this.testJoinChannel(runner);
        await this.testJoinChannelWithOptions(runner);
        await this.testUpdateChannelMediaOptions(runner);
        await this.testLeaveChannel(runner);
        await this.testLeaveChannelWithOptions(runner);
        await this.testRenewToken(runner);
        await this.testSetChannelProfile(runner);
        await this.testSetClientRole(runner);
        await this.testSetClientRoleWithOptions(runner);
        await this.testStartEchoTest(runner);
        await this.testStopEchoTest(runner);
        // testEnableMultiCamera: #if defined(__APPLE__) && TARGET_OS_IOS only
        await this.testEnableVideo(runner);
        await this.testDisableVideo(runner);
        await this.testStartPreview(runner);
        await this.testStartPreviewWithSourceType(runner);
        await this.testStopPreview(runner);
        await this.testStopPreviewWithSourceType(runner);
        await this.testStartLastmileProbeTest(runner);
        await this.testStopLastmileProbeTest(runner);
        await this.testSetVideoEncoderConfiguration(runner);
        await this.testSetBeautyEffectOptions(runner);
        await this.testSetFaceShapeBeautyOptions(runner);
        await this.testSetFaceShapeAreaOptions(runner);
        await this.testSetFilterEffectOptions(runner);
        // testDestroyVideoEffectObject: requires IVideoEffectObject instance
        await this.testSetLowlightEnhanceOptions(runner);
        await this.testSetVideoDenoiserOptions(runner);
        await this.testSetColorEnhanceOptions(runner);
        await this.testEnableVirtualBackground(runner);
        // testSetupRemoteVideo: SKIP - bridge routes through VideoTextureManager
        // testSetupLocalVideo: SKIP - bridge routes through VideoTextureManager
        await this.testSetVideoScenario(runner);
        await this.testSetVideoQoEPreference(runner);
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
        await this.testSetRemoteVideoSubscriptionOptions(runner);
        await this.testSetSubscribeAudioBlocklist(runner);
        await this.testSetSubscribeAudioAllowlist(runner);
        await this.testSetSubscribeVideoBlocklist(runner);
        await this.testSetSubscribeVideoAllowlist(runner);
        await this.testEnableAudioVolumeIndication(runner);
        await this.testStopAudioRecording(runner);
        await this.testStartAudioMixing(runner);
        await this.testStopAudioMixing(runner);
        await this.testPauseAudioMixing(runner);
        await this.testResumeAudioMixing(runner);
        await this.testSelectAudioTrack(runner);
        await this.testAdjustAudioMixingVolume(runner);
        await this.testAdjustAudioMixingPublishVolume(runner);
        await this.testAdjustAudioMixingPlayoutVolume(runner);
        await this.testSetAudioMixingPosition(runner);
        await this.testSetAudioMixingDualMonoMode(runner);
        await this.testSetAudioMixingPitch(runner);
        await this.testSetAudioMixingPlaybackSpeed(runner);
        await this.testSetEffectsVolume(runner);
        await this.testPreloadEffect(runner);
        await this.testPlayEffect(runner);
        await this.testPlayAllEffects(runner);
        await this.testSetVolumeOfEffect(runner);
        await this.testPauseEffect(runner);
        await this.testPauseAllEffects(runner);
        await this.testResumeEffect(runner);
        await this.testResumeAllEffects(runner);
        await this.testStopEffect(runner);
        await this.testStopAllEffects(runner);
        await this.testUnloadEffect(runner);
        await this.testUnloadAllEffects(runner);
        await this.testSetEffectPosition(runner);
        await this.testEnableSoundPositionIndication(runner);
        await this.testSetRemoteVoicePosition(runner);
        await this.testEnableSpatialAudio(runner);
        await this.testSetRemoteUserSpatialAudioParams(runner);
        await this.testSetVoiceBeautifierPreset(runner);
        await this.testSetAudioEffectPreset(runner);
        await this.testSetVoiceConversionPreset(runner);
        await this.testSetAudioEffectParameters(runner);
        await this.testSetVoiceBeautifierParameters(runner);
        await this.testSetVoiceConversionParameters(runner);
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
        await this.testSetSimulcastConfig(runner);
        await this.testSetRecordingAudioFrameParameters(runner);
        await this.testSetPlaybackAudioFrameParameters(runner);
        await this.testSetMixedAudioFrameParameters(runner);
        await this.testAdjustRecordingSignalVolume(runner);
        await this.testMuteRecordingSignal(runner);
        await this.testAdjustPlaybackSignalVolume(runner);
        await this.testAdjustUserPlaybackSignalVolume(runner);
        await this.testSetRemoteSubscribeFallbackOption(runner);
        await this.testSetHighPriorityUserList(runner);
        await this.testEnableLoopbackRecording(runner);
        await this.testEnableInEarMonitoring(runner);
        await this.testSetInEarMonitoringVolume(runner);
        await this.testSetCameraCapturerConfiguration(runner);
        // testCreateCustomVideoTrack: returns number (track ID), no log
        // testDestroyCustomVideoTrack: SKIP - no JSB binding
        // Camera controls and audio route APIs are Android/iOS/OHOS-only in the native SDK.
        // The mac integration target cannot forward them to IRtcEngineEx, so skip log-forwarding tests here.
        // testSetCameraZoomFactor
        // testEnableFaceDetection
        // testSetCameraFocusPositionInPreview
        // testSetCameraTorchOn
        // testSetCameraAutoFocusFaceModeEnabled
        // testSetCameraExposurePosition
        // testSetCameraExposureFactor
        // testSetCameraAutoExposureFaceModeEnabled
        // testSetCameraStabilizationMode
        // testSetDefaultAudioRouteToSpeakerphone
        // testSetEnableSpeakerphone
        // testSetRouteInCommunicationMode
        await this.testEnableCameraCenterStage(runner);
        await this.testStartScreenCaptureByDisplayId(runner);
        await this.testStartScreenCaptureByWindowId(runner);
        await this.testSetScreenCaptureContentHint(runner);
        await this.testUpdateScreenCaptureRegion(runner);
        await this.testUpdateScreenCaptureParameters(runner);
        await this.testStartScreenCapture(runner);
        await this.testStopScreenCapture(runner);
        await this.testSetScreenCaptureScenario(runner);
        await this.testRate(runner);
        await this.testComplain(runner);
        await this.testStartRtmpStreamWithoutTranscoding(runner);
        await this.testStartRtmpStreamWithTranscoding(runner);
        await this.testUpdateRtmpTranscoding(runner);
        await this.testStartLocalVideoTranscoder(runner);
        await this.testUpdateLocalTranscoderConfiguration(runner);
        await this.testStopRtmpStream(runner);
        await this.testStopLocalVideoTranscoder(runner);
        await this.testStartLocalAudioMixer(runner);
        await this.testUpdateLocalAudioMixerConfiguration(runner);
        await this.testStopLocalAudioMixer(runner);
        await this.testStartCameraCapture(runner);
        await this.testStopCameraCapture(runner);
        await this.testSetCameraDeviceOrientation(runner);
        await this.testSetScreenCaptureOrientation(runner);
        await this.testSetRemoteUserPriority(runner);
        await this.testEnableEncryption(runner);
        await this.testCreateDataStreamReliable(runner);
        await this.testSendStreamMessage(runner);
        await this.testAddVideoWatermark(runner);
        await this.testRemoveVideoWatermark(runner);
        await this.testClearVideoWatermarks(runner);
        await this.testEnableWebSdkInteroperability(runner);
        await this.testSendCustomReportMessage(runner);
        await this.testSetAINSMode(runner);
        await this.testRegisterLocalUserAccount(runner);
        await this.testJoinChannelWithUserAccount(runner);
        await this.testStopChannelMediaRelay(runner);
        await this.testPauseAllChannelMediaRelay(runner);
        await this.testResumeAllChannelMediaRelay(runner);
        await this.testSetDirectCdnStreamingAudioConfiguration(runner);
        await this.testSetDirectCdnStreamingVideoConfiguration(runner);
        await this.testStartDirectCdnStreaming(runner);
        await this.testStopDirectCdnStreaming(runner);
        await this.testUpdateDirectCdnStreamingMediaOptions(runner);
        await this.testStartRhythmPlayer(runner);
        await this.testStopRhythmPlayer(runner);
        await this.testConfigRhythmPlayer(runner);
        await this.testTakeSnapshot(runner);
        await this.testEnableContentInspect(runner);
        await this.testAdjustCustomAudioPublishVolume(runner);
        await this.testAdjustCustomAudioPlayoutVolume(runner);
        await this.testSetCloudProxy(runner);
        await this.testSetLocalAccessPoint(runner);
        await this.testSetAdvancedAudioOptions(runner);
        await this.testSetAVSyncSource(runner);
        await this.testEnableVideoImageSource(runner);
        await this.testSetParameters(runner);
        await this.testStartMediaRenderingTracing(runner);
        await this.testEnableInstantMediaRendering(runner);
        // testSendAudioMetadata: requires ArrayBuffer
        await this.testQueryHDRCapability(runner);

        // ── IRtcEngineEx methods ──
        await this.testSetParametersEx(runner);
        await this.testJoinChannelEx(runner);
        await this.testLeaveChannelEx(runner);
        await this.testLeaveChannelWithOptionsEx(runner);
        await this.testUpdateChannelMediaOptionsEx(runner);
        await this.testSetVideoEncoderConfigurationEx(runner);
        await this.testMuteRemoteAudioStreamEx(runner);
        await this.testMuteRemoteVideoStreamEx(runner);
        await this.testSetRemoteVideoStreamTypeEx(runner);
        await this.testMuteLocalAudioStreamEx(runner);
        await this.testMuteLocalVideoStreamEx(runner);
        await this.testMuteAllRemoteAudioStreamsEx(runner);
        await this.testMuteAllRemoteVideoStreamsEx(runner);
        await this.testSetSubscribeAudioBlocklistEx(runner);
        await this.testSetSubscribeAudioAllowlistEx(runner);
        await this.testSetSubscribeVideoBlocklistEx(runner);
        await this.testSetSubscribeVideoAllowlistEx(runner);
        await this.testSetRemoteVideoSubscriptionOptionsEx(runner);
        await this.testSetRemoteVoicePositionEx(runner);
        await this.testSetRemoteUserSpatialAudioParamsEx(runner);
        await this.testSetRemoteRenderModeEx(runner);
        await this.testEnableLoopbackRecordingEx(runner);
        await this.testAdjustRecordingSignalVolumeEx(runner);
        await this.testMuteRecordingSignalEx(runner);
        await this.testAdjustUserPlaybackSignalVolumeEx(runner);
        await this.testEnableEncryptionEx(runner);
        // testCreateDataStreamEx: returns complex {streamId, errorCode}
        await this.testSendStreamMessageEx(runner);
        await this.testAddVideoWatermarkEx(runner);
        await this.testRemoveVideoWatermarkEx(runner);
        await this.testClearVideoWatermarkEx(runner);
        await this.testSendCustomReportMessageEx(runner);
        await this.testEnableAudioVolumeIndicationEx(runner);
        await this.testStartRtmpStreamWithoutTranscodingEx(runner);
        await this.testStartRtmpStreamWithTranscodingEx(runner);
        await this.testUpdateRtmpTranscodingEx(runner);
        await this.testStopRtmpStreamEx(runner);
        await this.testStartOrUpdateChannelMediaRelayEx(runner);
        await this.testStopChannelMediaRelayEx(runner);
        await this.testPauseAllChannelMediaRelayEx(runner);
        await this.testResumeAllChannelMediaRelayEx(runner);
        await this.testEnableDualStreamModeEx(runner);
        await this.testSetDualStreamModeEx(runner);
        await this.testSetSimulcastConfigEx(runner);
        await this.testSetHighPriorityUserListEx(runner);
        await this.testTakeSnapshotEx(runner);
        await this.testEnableContentInspectEx(runner);
        await this.testStartMediaRenderingTracingEx(runner);
        await this.testSetParametersExString(runner);
        await this.testGetCallIdEx(runner);
        // testSendAudioMetadataEx: requires ArrayBuffer
        await this.testPreloadEffectEx(runner);
        await this.testPlayEffectEx(runner);

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
     * Assert that a log entry exists for `fnName` near `callTime` and contains
     * all expected params. Mock logs may include additional fields for richer
     * diagnostics, so tests verify the required subset.
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
    }

    private valuesEqual(actual: any, expected: any): boolean {
        if (actual === expected) return true;
        if (typeof actual === "number" && typeof expected === "number") {
            if (Number.isInteger(actual) && Number.isInteger(expected)) return actual === expected;
            return Math.abs(actual - expected) < 1e-6;
        }
        if (actual && expected && typeof actual === "object" && typeof expected === "object") {
            if (Array.isArray(actual) !== Array.isArray(expected)) return false;
            const actualKeys = Object.keys(actual);
            const expectedKeys = Object.keys(expected);
            if (actualKeys.length !== expectedKeys.length) return false;
            for (const key of expectedKeys) {
                if (!this.valuesEqual(actual[key], expected[key])) return false;
            }
            return true;
        }
        return false;
    }

    private findLogEntry(logArray: LogEntry[], fnName: string, callTime: number): LogEntry | null {
        let best: LogEntry | null = null;
        let bestDelta = Number.MAX_VALUE;
        for (const entry of logArray) {
            const delta = Math.abs(entry.ts - callTime);
            if (entry.fn === fnName && delta <= CallApiTestSuite.LOG_TIME_TOLERANCE && delta < bestDelta) {
                best = entry;
                bestDelta = delta;
            }
        }
        return best;
    }

    // ──────────────────────────── IRtcEngine Tests ────────────────────────────

    // 1. release(sync)
    private async testRelease(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRelease ---");
        const bridge = this.createBridgeAndInit();
        await bridge.release(true);
        runner.assert(true, "release should complete without throwing");
        await this.delay(50);
    }

    // 2. initialize(context) - mock only logs appId
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
            logConfig: { filePath: "filePath", fileSizeInKB: 1024, level: 4 },
            useExternalEglContext: false,
            domainLimit: false,
            autoRegisterAgoraExtensions: false,
        });
        // Mock only serializes appId from context
        this.assertLogEntry(runner, "initialize", callTime, { appId: "myTestApp" });
        await bridge.release(true);
        await this.delay(50);
    }

    // 3. queryDeviceScore()
    private async testQueryDeviceScore(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryDeviceScore ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.queryDeviceScore();
        this.assertLogEntry(runner, "queryDeviceScore", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 4. preloadChannel(token, channelId, uid)
    private async testPreloadChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadChannel ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.preloadChannel("preloadToken", "preloadChannel", 54321);
        this.assertLogEntry(runner, "preloadChannel", callTime, {
            token: "preloadToken",
            channelId: "preloadChannel",
            uid: 54321,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 5. preloadChannelWithUserAccount(token, channelId, userAccount)
    private async testPreloadChannelWithUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadChannelWithUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.preloadChannelWithUserAccount("preloadToken2", "preloadChannel2", "user123");
        this.assertLogEntry(runner, "preloadChannelWithUserAccount", callTime, {
            token: "preloadToken2",
            channelId: "preloadChannel2",
            userAccount: "user123",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 6. updatePreloadChannelToken(token)
    private async testUpdatePreloadChannelToken(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdatePreloadChannelToken ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updatePreloadChannelToken("updatedToken");
        this.assertLogEntry(runner, "updatePreloadChannelToken", callTime, { token: "updatedToken" });
        await bridge.release(true);
        await this.delay(50);
    }

    // 7. joinChannel(token, channelId, info, uid)
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
        await this.delay(50);
    }

    // 8. joinChannel(token, channelId, uid, options)
    private async testJoinChannelWithOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannelWithOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.joinChannel("optToken", "optChannel", 67890, {
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
            publishCameraTrack: true,
            publishSecondaryCameraTrack: false,
            clientRoleType: 1,
            channelProfile: 1,
        });
        this.assertLogEntry(runner, "joinChannel", callTime, {
            token: "optToken",
            channelId: "optChannel",
            uid: 67890,
            options: {
                autoSubscribeAudio: true,
                autoSubscribeVideo: true,
                publishCameraTrack: true,
                publishSecondaryCameraTrack: false,
                clientRoleType: 1,
                channelProfile: 1,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 9. updateChannelMediaOptions(options)
    private async testUpdateChannelMediaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateChannelMediaOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateChannelMediaOptions({
            autoSubscribeAudio: false,
            autoSubscribeVideo: false,
            publishCameraTrack: true,
            publishCustomAudioTrack: false,
            clientRoleType: 2,
        });
        this.assertLogEntry(runner, "updateChannelMediaOptions", callTime, {
            options: {
                autoSubscribeAudio: false,
                autoSubscribeVideo: false,
                publishCameraTrack: true,
                publishCustomAudioTrack: false,
                clientRoleType: 2,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 10. leaveChannel()
    private async testLeaveChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannel ---");
        const bridge = this.createBridgeAndInit();
        await bridge.joinChannel("t", "c", "", 0);
        const callTime = Date.now();
        await bridge.leaveChannel();
        this.assertLogEntry(runner, "leaveChannel", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 11. leaveChannel(options) - mock logs empty params same as no-arg
    private async testLeaveChannelWithOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannelWithOptions ---");
        const bridge = this.createBridgeAndInit();
        await bridge.joinChannel("t", "c", "", 0);
        const callTime = Date.now();
        await bridge.leaveChannel({ stopMicrophoneRecording: true } as any);
        this.assertLogEntry(runner, "leaveChannel", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 12. renewToken(token)
    private async testRenewToken(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRenewToken ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.renewToken("newToken123");
        this.assertLogEntry(runner, "renewToken", callTime, { token: "newToken123" });
        await bridge.release(true);
        await this.delay(50);
    }

    // 13. setChannelProfile(profile)
    private async testSetChannelProfile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetChannelProfile ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setChannelProfile(1);
        this.assertLogEntry(runner, "setChannelProfile", callTime, { profile: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 14. setClientRole(role)
    private async testSetClientRole(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetClientRole ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setClientRole(2);
        this.assertLogEntry(runner, "setClientRole", callTime, { role: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 15. setClientRole(role, options)
    private async testSetClientRoleWithOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetClientRoleWithOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setClientRole(1, { audienceLatencyLevel: 2 });
        this.assertLogEntry(runner, "setClientRole", callTime, {
            role: 1,
            options: { audienceLatencyLevel: 2 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 16. startEchoTest(config)
    private async testStartEchoTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartEchoTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startEchoTest({
            enableAudio: true,
            enableVideo: false,
            token: "echoToken",
            channelId: "echoChannel",
            intervalInSeconds: 10,
            view: null as any,
        });
        this.assertLogEntry(runner, "startEchoTest", callTime, {
            enableAudio: true,
            enableVideo: false,
            token: "echoToken",
            channelId: "echoChannel",
            intervalInSeconds: 10,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 17. stopEchoTest()
    private async testStopEchoTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopEchoTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopEchoTest();
        this.assertLogEntry(runner, "stopEchoTest", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 18. enableMultiCamera(enabled, config) - SKIP: platform-conditional, only available on iOS

    // 19. enableVideo()
    private async testEnableVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVideo ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableVideo();
        this.assertLogEntry(runner, "enableVideo", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 20. disableVideo()
    private async testDisableVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testDisableVideo ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.disableVideo();
        this.assertLogEntry(runner, "disableVideo", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 21. startPreview()
    private async testStartPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartPreview ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startPreview();
        this.assertLogEntry(runner, "startPreview", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 22. startPreview(sourceType)
    private async testStartPreviewWithSourceType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartPreviewWithSourceType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startPreview(3);
        this.assertLogEntry(runner, "startPreview", callTime, { sourceType: 3 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 23. stopPreview()
    private async testStopPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopPreview ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopPreview();
        this.assertLogEntry(runner, "stopPreview", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 24. stopPreview(sourceType)
    private async testStopPreviewWithSourceType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopPreviewWithSourceType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopPreview(5);
        this.assertLogEntry(runner, "stopPreview", callTime, { sourceType: 5 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 25. startLastmileProbeTest(config)
    private async testStartLastmileProbeTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartLastmileProbeTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startLastmileProbeTest({
            probeUplink: true,
            probeDownlink: true,
            expectedUplinkBitrate: 5000,
            expectedDownlinkBitrate: 10000,
        });
        this.assertLogEntry(runner, "startLastmileProbeTest", callTime, {
            probeUplink: true,
            probeDownlink: true,
            expectedUplinkBitrate: 5000,
            expectedDownlinkBitrate: 10000,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 26. stopLastmileProbeTest()
    private async testStopLastmileProbeTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopLastmileProbeTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopLastmileProbeTest();
        this.assertLogEntry(runner, "stopLastmileProbeTest", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 27. setVideoEncoderConfiguration(config)
    private async testSetVideoEncoderConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoEncoderConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVideoEncoderConfiguration({
            dimensions: { width: 1280, height: 720 },
            codecType: 3,
            orientationMode: 1,
            degradationPreference: 2,
            mirrorMode: 1,
            frameRate: 30,
            bitrate: 2000,
            minBitrate: 800,
            advanceOptions: { compressionPreference: 0, encodingPreference: 0, encodeAlpha: false },
        });
        this.assertLogEntry(runner, "setVideoEncoderConfiguration", callTime, {
            codecType: 3,
            orientationMode: 1,
            degradationPreference: 2,
            mirrorMode: 1,
            frameRate: 30,
            bitrate: 2000,
            minBitrate: 800,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 28. setBeautyEffectOptions(enabled, options, type)
    private async testSetBeautyEffectOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetBeautyEffectOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setBeautyEffectOptions(
            true,
            {
                lighteningContrastLevel: 2,
                lighteningLevel: 0.5,
                smoothnessLevel: 0.8,
                rednessLevel: 0.3,
                sharpnessLevel: 0.4,
            } as any,
            0,
        );
        this.assertLogEntry(runner, "setBeautyEffectOptions", callTime, {
            enabled: true,
            lighteningContrastLevel: 2,
            lighteningLevel: 0.5,
            smoothnessLevel: 0.8,
            rednessLevel: 0.3,
            sharpnessLevel: 0.4,
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 29. setFaceShapeBeautyOptions(enabled, options, type)
    private async testSetFaceShapeBeautyOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetFaceShapeBeautyOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setFaceShapeBeautyOptions(true, { styleIntensity: 75 } as any, 0);
        this.assertLogEntry(runner, "setFaceShapeBeautyOptions", callTime, {
            enabled: true,
            intensity: 75,
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 30. setFaceShapeAreaOptions(options, type)
    private async testSetFaceShapeAreaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetFaceShapeAreaOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setFaceShapeAreaOptions({ shapeArea: 3, shapeIntensity: 50 } as any, 0);
        this.assertLogEntry(runner, "setFaceShapeAreaOptions", callTime, {
            shapeArea: 3,
            shapeIntensity: 50,
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 31. setFilterEffectOptions(enabled, options, type)
    private async testSetFilterEffectOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetFilterEffectOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setFilterEffectOptions(true, { path: "/filters/vivid.png" } as any, 0);
        this.assertLogEntry(runner, "setFilterEffectOptions", callTime, {
            enabled: true,
            path: "/filters/vivid.png",
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 32. destroyVideoEffectObject(obj) - SKIP: requires IVideoEffectObject instance

    // 33. setLowlightEnhanceOptions(enabled, options, type)
    private async testSetLowlightEnhanceOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLowlightEnhanceOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLowlightEnhanceOptions(true, { mode: 2, level: 1 } as any, 0);
        this.assertLogEntry(runner, "setLowlightEnhanceOptions", callTime, {
            enabled: true,
            mode: 2,
            level: 1,
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 34. setVideoDenoiserOptions(enabled, options, type)
    private async testSetVideoDenoiserOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoDenoiserOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVideoDenoiserOptions(true, { mode: 1, level: 2 } as any, 0);
        this.assertLogEntry(runner, "setVideoDenoiserOptions", callTime, {
            enabled: true,
            mode: 1,
            level: 2,
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 35. setColorEnhanceOptions(enabled, options, type)
    private async testSetColorEnhanceOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetColorEnhanceOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setColorEnhanceOptions(true, { strengthLevel: 0.6, skinProtectLevel: 0.8 } as any, 0);
        this.assertLogEntry(runner, "setColorEnhanceOptions", callTime, {
            enabled: true,
            strengthLevel: 0.6,
            skinProtectLevel: 0.8,
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 36. enableVirtualBackground(enabled, backgroundSource, segproperty, type)
    private async testEnableVirtualBackground(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVirtualBackground ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableVirtualBackground(
            true,
            {
                background_source_type: 1,
                source: "https://example.com/bg.png",
                color: 0xff0000,
                blur_degree: 2,
            },
            { modelType: 1, greenCapacity: 0.5, screenColorType: 0 },
            0,
        );
        this.assertLogEntry(runner, "enableVirtualBackground", callTime, {
            enabled: true,
            backgroundSource: {
                background_source_type: 1,
                source: "https://example.com/bg.png",
                color: 0xff0000,
                blur_degree: 2,
            },
            segproperty: { modelType: 1, greenCapacity: 0.5 },
            type: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 37. setupRemoteVideo(canvas) - SKIP: bridge routes through VideoTextureManager, not mock engine
    // 38. setupLocalVideo(canvas) - SKIP: bridge routes through VideoTextureManager, not mock engine

    // 39. setVideoScenario(scenarioType)
    private async testSetVideoScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoScenario ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVideoScenario(1);
        this.assertLogEntry(runner, "setVideoScenario", callTime, { scenarioType: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 40. setVideoQoEPreference(qoePreference)
    private async testSetVideoQoEPreference(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoQoEPreference ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVideoQoEPreference(2);
        this.assertLogEntry(runner, "setVideoQoEPreference", callTime, { qoePreference: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 41-42. enableAudio() / disableAudio()
    private async testEnableAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableAudio();
        this.assertLogEntry(runner, "enableAudio", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testDisableAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testDisableAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.disableAudio();
        this.assertLogEntry(runner, "disableAudio", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 43. setAudioProfile(profile)
    private async testSetAudioProfile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioProfile ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioProfile(2);
        this.assertLogEntry(runner, "setAudioProfile", callTime, { profile: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 44. setAudioScenario(scenario)
    private async testSetAudioScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioScenario ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioScenario(3);
        this.assertLogEntry(runner, "setAudioScenario", callTime, { scenario: 3 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 45. enableLocalAudio(enabled)
    private async testEnableLocalAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLocalAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableLocalAudio(true);
        this.assertLogEntry(runner, "enableLocalAudio", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 46. muteLocalAudioStream(mute)
    private async testMuteLocalAudioStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalAudioStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteLocalAudioStream(true);
        this.assertLogEntry(runner, "muteLocalAudioStream", callTime, { mute: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 47. muteAllRemoteAudioStreams(mute)
    private async testMuteAllRemoteAudioStreams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteAudioStreams ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteAllRemoteAudioStreams(true);
        this.assertLogEntry(runner, "muteAllRemoteAudioStreams", callTime, { mute: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 48. muteRemoteAudioStream(uid, mute)
    private async testMuteRemoteAudioStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteAudioStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteRemoteAudioStream(42, true);
        this.assertLogEntry(runner, "muteRemoteAudioStream", callTime, { uid: 42, mute: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 49. muteLocalVideoStream(mute)
    private async testMuteLocalVideoStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalVideoStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteLocalVideoStream(false);
        this.assertLogEntry(runner, "muteLocalVideoStream", callTime, { mute: false });
        await bridge.release(true);
        await this.delay(50);
    }

    // 50. enableLocalVideo(enabled)
    private async testEnableLocalVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLocalVideo ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableLocalVideo(false);
        this.assertLogEntry(runner, "enableLocalVideo", callTime, { enabled: false });
        await bridge.release(true);
        await this.delay(50);
    }

    // 51. muteAllRemoteVideoStreams(mute)
    private async testMuteAllRemoteVideoStreams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteVideoStreams ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteAllRemoteVideoStreams(false);
        this.assertLogEntry(runner, "muteAllRemoteVideoStreams", callTime, { mute: false });
        await bridge.release(true);
        await this.delay(50);
    }

    // 52. setRemoteDefaultVideoStreamType(streamType)
    private async testSetRemoteDefaultVideoStreamType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteDefaultVideoStreamType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteDefaultVideoStreamType(1);
        this.assertLogEntry(runner, "setRemoteDefaultVideoStreamType", callTime, { streamType: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 53. muteRemoteVideoStream(uid, mute)
    private async testMuteRemoteVideoStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteVideoStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteRemoteVideoStream(100, false);
        this.assertLogEntry(runner, "muteRemoteVideoStream", callTime, { uid: 100, mute: false });
        await bridge.release(true);
        await this.delay(50);
    }

    // 54. setRemoteVideoStreamType(uid, streamType)
    private async testSetRemoteVideoStreamType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoStreamType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteVideoStreamType(55, 0);
        this.assertLogEntry(runner, "setRemoteVideoStreamType", callTime, { uid: 55, streamType: 0 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 55. setRemoteVideoSubscriptionOptions(uid, options)
    private async testSetRemoteVideoSubscriptionOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoSubscriptionOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteVideoSubscriptionOptions(55, { type: 1 } as any);
        this.assertLogEntry(runner, "setRemoteVideoSubscriptionOptions", callTime, { uid: 55 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 56-59. setSubscribeBlocklist/Allowlist
    private async testSetSubscribeAudioBlocklist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioBlocklist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeAudioBlocklist([11, 22, 33]);
        this.assertLogEntry(runner, "setSubscribeAudioBlocklist", callTime, { uidList: [11, 22, 33], uidNumber: 3 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeAudioAllowlist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioAllowlist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeAudioAllowlist([44, 55]);
        this.assertLogEntry(runner, "setSubscribeAudioAllowlist", callTime, { uidList: [44, 55], uidNumber: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoBlocklist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoBlocklist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeVideoBlocklist([66, 77, 88]);
        this.assertLogEntry(runner, "setSubscribeVideoBlocklist", callTime, { uidList: [66, 77, 88], uidNumber: 3 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoAllowlist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoAllowlist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeVideoAllowlist([99]);
        this.assertLogEntry(runner, "setSubscribeVideoAllowlist", callTime, { uidList: [99], uidNumber: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 60. enableAudioVolumeIndication(interval, smooth, reportVad)
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
        await this.delay(50);
    }

    // 61. startAudioRecording(config) - SKIP: overloaded

    // 62. stopAudioRecording()
    private async testStopAudioRecording(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAudioRecording ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopAudioRecording();
        this.assertLogEntry(runner, "stopAudioRecording", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 63. startAudioMixing(filePath, loopback, cycle, startPos)
    private async testStartAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startAudioMixing("/music/song.mp3", false, 1, 5000);
        this.assertLogEntry(runner, "startAudioMixing", callTime, {
            filePath: "/music/song.mp3",
            loopback: false,
            cycle: 1,
            startPos: 5000,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 64-66. stopAudioMixing/pauseAudioMixing/resumeAudioMixing
    private async testStopAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopAudioMixing();
        this.assertLogEntry(runner, "stopAudioMixing", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testPauseAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.pauseAudioMixing();
        this.assertLogEntry(runner, "pauseAudioMixing", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testResumeAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.resumeAudioMixing();
        this.assertLogEntry(runner, "resumeAudioMixing", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 67. selectAudioTrack(index)
    private async testSelectAudioTrack(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSelectAudioTrack ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.selectAudioTrack(2);
        this.assertLogEntry(runner, "selectAudioTrack", callTime, { index: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 68. getAudioTrackCount() - SKIP: returns number

    // 69. adjustAudioMixingVolume(volume)
    private async testAdjustAudioMixingVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustAudioMixingVolume(75);
        this.assertLogEntry(runner, "adjustAudioMixingVolume", callTime, { volume: 75 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 70. adjustAudioMixingPublishVolume(volume)
    private async testAdjustAudioMixingPublishVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingPublishVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustAudioMixingPublishVolume(60);
        this.assertLogEntry(runner, "adjustAudioMixingPublishVolume", callTime, { volume: 60 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 71. getAudioMixingPublishVolume() - SKIP: returns number

    // 72. adjustAudioMixingPlayoutVolume(volume)
    private async testAdjustAudioMixingPlayoutVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingPlayoutVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustAudioMixingPlayoutVolume(85);
        this.assertLogEntry(runner, "adjustAudioMixingPlayoutVolume", callTime, { volume: 85 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 73-75. getAudioMixingPlayoutVolume/getAudioMixingDuration/getAudioMixingCurrentPosition - SKIP: returns number

    // 76. setAudioMixingPosition(pos)
    private async testSetAudioMixingPosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioMixingPosition(5000);
        this.assertLogEntry(runner, "setAudioMixingPosition", callTime, { pos: 5000 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 77. setAudioMixingDualMonoMode(mode)
    private async testSetAudioMixingDualMonoMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingDualMonoMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioMixingDualMonoMode(1);
        this.assertLogEntry(runner, "setAudioMixingDualMonoMode", callTime, { mode: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 78. setAudioMixingPitch(pitch)
    private async testSetAudioMixingPitch(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPitch ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioMixingPitch(2);
        this.assertLogEntry(runner, "setAudioMixingPitch", callTime, { pitch: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 79. setAudioMixingPlaybackSpeed(speed)
    private async testSetAudioMixingPlaybackSpeed(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPlaybackSpeed ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioMixingPlaybackSpeed(120);
        this.assertLogEntry(runner, "setAudioMixingPlaybackSpeed", callTime, { speed: 120 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 80. getEffectsVolume() - SKIP: returns number

    // 81. setEffectsVolume(volume)
    private async testSetEffectsVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEffectsVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setEffectsVolume(60);
        this.assertLogEntry(runner, "setEffectsVolume", callTime, { volume: 60 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 82. preloadEffect(soundId, filePath, startPos)
    private async testPreloadEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.preloadEffect(5, "/sounds/preload.wav", 100);
        this.assertLogEntry(runner, "preloadEffect", callTime, {
            soundId: 5,
            filePath: "/sounds/preload.wav",
            startPos: 100,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 83. playEffect(soundId, filePath, loopCount, pitch, pan, gain, publish, startPos)
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
        await this.delay(50);
    }

    // 84. playAllEffects(loopCount, pitch, pan, gain, publish)
    private async testPlayAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPlayAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.playAllEffects(2, 1.5, 0.5, 80, true);
        this.assertLogEntry(runner, "playAllEffects", callTime, {
            loopCount: 2,
            pitch: 1.5,
            pan: 0.5,
            gain: 80,
            publish: true,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 85. getVolumeOfEffect(soundId) - SKIP: returns number

    // 86. setVolumeOfEffect(soundId, volume)
    private async testSetVolumeOfEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVolumeOfEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVolumeOfEffect(1, 80);
        this.assertLogEntry(runner, "setVolumeOfEffect", callTime, { soundId: 1, volume: 80 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 87. pauseEffect(soundId)
    private async testPauseEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.pauseEffect(1);
        this.assertLogEntry(runner, "pauseEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 88. pauseAllEffects()
    private async testPauseAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.pauseAllEffects();
        this.assertLogEntry(runner, "pauseAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 89. resumeEffect(soundId)
    private async testResumeEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.resumeEffect(1);
        this.assertLogEntry(runner, "resumeEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 90. resumeAllEffects()
    private async testResumeAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.resumeAllEffects();
        this.assertLogEntry(runner, "resumeAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 91. stopEffect(soundId)
    private async testStopEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopEffect(1);
        this.assertLogEntry(runner, "stopEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 92. stopAllEffects()
    private async testStopAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopAllEffects();
        this.assertLogEntry(runner, "stopAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 93. unloadEffect(soundId)
    private async testUnloadEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUnloadEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.unloadEffect(1);
        this.assertLogEntry(runner, "unloadEffect", callTime, { soundId: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 94. unloadAllEffects()
    private async testUnloadAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUnloadAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.unloadAllEffects();
        this.assertLogEntry(runner, "unloadAllEffects", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 95. getEffectDuration(filePath) - SKIP: returns number

    // 96. setEffectPosition(soundId, pos)
    private async testSetEffectPosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEffectPosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setEffectPosition(3, 2000);
        this.assertLogEntry(runner, "setEffectPosition", callTime, { soundId: 3, pos: 2000 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 97. getEffectCurrentPosition(soundId) - SKIP: returns number

    // 98. enableSoundPositionIndication(enabled)
    private async testEnableSoundPositionIndication(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableSoundPositionIndication ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableSoundPositionIndication(true);
        this.assertLogEntry(runner, "enableSoundPositionIndication", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 99. setRemoteVoicePosition(uid, pan, gain)
    private async testSetRemoteVoicePosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVoicePosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteVoicePosition(42, 0.5, 10.0);
        this.assertLogEntry(runner, "setRemoteVoicePosition", callTime, { uid: 42, pan: 0.5, gain: 10.0 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 100. enableSpatialAudio(enabled)
    private async testEnableSpatialAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableSpatialAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableSpatialAudio(false);
        this.assertLogEntry(runner, "enableSpatialAudio", callTime, { enabled: false });
        await bridge.release(true);
        await this.delay(50);
    }

    // 101. setRemoteUserSpatialAudioParams(uid, params)
    private async testSetRemoteUserSpatialAudioParams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteUserSpatialAudioParams ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteUserSpatialAudioParams(42, {
            speaker_azimuth: 90.0,
            speaker_elevation: 45.0,
            speaker_distance: 5.0,
            speaker_orientation: 0.0,
            enable_blur: true,
            enable_air_absorb: false,
        });
        this.assertLogEntry(runner, "setRemoteUserSpatialAudioParams", callTime, {
            uid: 42,
            params: {
                speaker_azimuth: 90.0,
                speaker_elevation: 45.0,
                speaker_distance: 5.0,
                speaker_orientation: 0.0,
                enable_blur: true,
                enable_air_absorb: false,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 102-107. Voice/Effect presets and parameters
    private async testSetVoiceBeautifierPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceBeautifierPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVoiceBeautifierPreset(0x01010100);
        this.assertLogEntry(runner, "setVoiceBeautifierPreset", callTime, { preset: 0x01010100 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetAudioEffectPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioEffectPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioEffectPreset(0x02010100);
        this.assertLogEntry(runner, "setAudioEffectPreset", callTime, { preset: 0x02010100 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetVoiceConversionPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceConversionPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVoiceConversionPreset(0x03010100);
        this.assertLogEntry(runner, "setVoiceConversionPreset", callTime, { preset: 0x03010100 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetAudioEffectParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioEffectParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAudioEffectParameters(0x02010100, 3, 7);
        this.assertLogEntry(runner, "setAudioEffectParameters", callTime, {
            preset: 0x02010100,
            param1: 3,
            param2: 7,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetVoiceBeautifierParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceBeautifierParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVoiceBeautifierParameters(0x01010100, 5, 10);
        this.assertLogEntry(runner, "setVoiceBeautifierParameters", callTime, {
            preset: 0x01010100,
            param1: 5,
            param2: 10,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetVoiceConversionParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceConversionParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVoiceConversionParameters(0x03010100, 2, 4);
        this.assertLogEntry(runner, "setVoiceConversionParameters", callTime, {
            preset: 0x03010100,
            param1: 2,
            param2: 4,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 108-114. Voice settings
    private async testSetLocalVoicePitch(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoicePitch ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalVoicePitch(0.5);
        this.assertLogEntry(runner, "setLocalVoicePitch", callTime, { pitch: 0.5 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVoiceFormant(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceFormant ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalVoiceFormant(0.8);
        this.assertLogEntry(runner, "setLocalVoiceFormant", callTime, { formantRatio: 0.8 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVoiceEqualization(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceEqualization ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalVoiceEqualization(3, 5);
        this.assertLogEntry(runner, "setLocalVoiceEqualization", callTime, { bandFrequency: 3, bandGain: 5 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVoiceReverb(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceReverb ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalVoiceReverb(1, 40);
        this.assertLogEntry(runner, "setLocalVoiceReverb", callTime, { reverbKey: 1, value: 40 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetHeadphoneEQPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHeadphoneEQPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setHeadphoneEQPreset(1 as any);
        this.assertLogEntry(runner, "setHeadphoneEQPreset", callTime, { preset: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetHeadphoneEQParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHeadphoneEQParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setHeadphoneEQParameters(3, 7);
        this.assertLogEntry(runner, "setHeadphoneEQParameters", callTime, { lowGain: 3, highGain: 7 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableVoiceAITuner(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVoiceAITuner ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableVoiceAITuner(true, 2);
        this.assertLogEntry(runner, "enableVoiceAITuner", callTime, { enabled: true, type: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 115-118. Logging
    private async testSetLogFile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFile ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLogFile("/tmp/agora_sdk.log");
        this.assertLogEntry(runner, "setLogFile", callTime, { filePath: "/tmp/agora_sdk.log" });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLogFilter(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFilter ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLogFilter(0x80f);
        this.assertLogEntry(runner, "setLogFilter", callTime, { filter: 0x80f });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLogLevel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogLevel ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLogLevel(1);
        this.assertLogEntry(runner, "setLogLevel", callTime, { level: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLogFileSize(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFileSize ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLogFileSize(2048);
        this.assertLogEntry(runner, "setLogFileSize", callTime, { fileSizeInKBytes: 2048 });
        await bridge.release(true);
        await this.delay(50);
    }

    // SKIP: uploadLogFile - returns complex
    // SKIP: writeLog - variadic C function

    // 119-121. Render modes
    private async testSetLocalRenderMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalRenderMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalRenderMode(1);
        this.assertLogEntry(runner, "setLocalRenderMode", callTime, { renderMode: 1 });
        await bridge.release(true);
        await this.delay(50);
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
        await this.delay(50);
    }

    private async testSetLocalVideoMirrorMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVideoMirrorMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalVideoMirrorMode(2);
        this.assertLogEntry(runner, "setLocalVideoMirrorMode", callTime, { mirrorMode: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 122-124. Dual stream
    private async testEnableDualStreamMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableDualStreamMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableDualStreamMode(true);
        this.assertLogEntry(runner, "enableDualStreamMode", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetDualStreamMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDualStreamMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setDualStreamMode(1);
        this.assertLogEntry(runner, "setDualStreamMode", callTime, { mode: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSimulcastConfig(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSimulcastConfig ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSimulcastConfig({ configs: [], publish_fallback_enable: true });
        this.assertLogEntry(runner, "setSimulcastConfig", callTime, { enableSimulcastVideoConfigCount: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 125-127. Audio frame parameters
    private async testSetRecordingAudioFrameParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRecordingAudioFrameParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRecordingAudioFrameParameters(44100, 2, 2, 1024);
        this.assertLogEntry(runner, "setRecordingAudioFrameParameters", callTime, {
            sampleRate: 44100,
            channel: 2,
            mode: 2,
            samplesPerCall: 1024,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetPlaybackAudioFrameParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetPlaybackAudioFrameParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setPlaybackAudioFrameParameters(48000, 1, 2, 2048);
        this.assertLogEntry(runner, "setPlaybackAudioFrameParameters", callTime, {
            sampleRate: 48000,
            channel: 1,
            mode: 2,
            samplesPerCall: 2048,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetMixedAudioFrameParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetMixedAudioFrameParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setMixedAudioFrameParameters(32000, 1, 512);
        this.assertLogEntry(runner, "setMixedAudioFrameParameters", callTime, {
            sampleRate: 32000,
            channel: 1,
            samplesPerCall: 512,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 128-131. Recording/Playback volume
    private async testAdjustRecordingSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustRecordingSignalVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustRecordingSignalVolume(80);
        this.assertLogEntry(runner, "adjustRecordingSignalVolume", callTime, { volume: 80 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testMuteRecordingSignal(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRecordingSignal ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteRecordingSignal(true);
        this.assertLogEntry(runner, "muteRecordingSignal", callTime, { mute: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testAdjustPlaybackSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustPlaybackSignalVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustPlaybackSignalVolume(90);
        this.assertLogEntry(runner, "adjustPlaybackSignalVolume", callTime, { volume: 90 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testAdjustUserPlaybackSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustUserPlaybackSignalVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustUserPlaybackSignalVolume(77, 50);
        this.assertLogEntry(runner, "adjustUserPlaybackSignalVolume", callTime, { uid: 77, volume: 50 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 132-133. Fallback / High priority
    private async testSetRemoteSubscribeFallbackOption(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteSubscribeFallbackOption ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteSubscribeFallbackOption(2);
        this.assertLogEntry(runner, "setRemoteSubscribeFallbackOption", callTime, { option: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetHighPriorityUserList(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHighPriorityUserList ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await (bridge as any).setHighPriorityUserList([111, 222], 1);
        this.assertLogEntry(runner, "setHighPriorityUserList", callTime, {
            uidList: [111, 222],
            uidNum: 2,
            option: 1,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 134-136. Loopback & In-ear monitoring
    private async testEnableLoopbackRecording(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLoopbackRecording ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableLoopbackRecording(true, "Built-in Output");
        this.assertLogEntry(runner, "enableLoopbackRecording", callTime, {
            enabled: true,
            deviceName: "Built-in Output",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableInEarMonitoring(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableInEarMonitoring ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableInEarMonitoring(true, 0);
        this.assertLogEntry(runner, "enableInEarMonitoring", callTime, { enabled: true, includeAudioFilters: 0 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetInEarMonitoringVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetInEarMonitoringVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setInEarMonitoringVolume(70);
        this.assertLogEntry(runner, "setInEarMonitoringVolume", callTime, { volume: 70 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 137. setCameraCapturerConfiguration(config)
    private async testSetCameraCapturerConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraCapturerConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraCapturerConfiguration({
            cameraDirection: 1,
            format: { width: 1280, height: 720, fps: 30 },
        } as any);
        this.assertLogEntry(runner, "setCameraCapturerConfiguration", callTime, {
            cameraDirection: 0,
            format_width: 1280,
            format_height: 720,
            format_fps: 30,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 138. createCustomVideoTrack() - SKIP: returns number (track ID), no log

    // 139. destroyCustomVideoTrack(video_track_id) - SKIP: no JSB binding for this function
    // 140-148. Camera controls
    private async testSetCameraZoomFactor(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraZoomFactor ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraZoomFactor(2.5);
        this.assertLogEntry(runner, "setCameraZoomFactor", callTime, { factor: 2.5 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableFaceDetection(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableFaceDetection ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableFaceDetection(true);
        this.assertLogEntry(runner, "enableFaceDetection", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraFocusPositionInPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraFocusPositionInPreview ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraFocusPositionInPreview(0.5, 0.5);
        this.assertLogEntry(runner, "setCameraFocusPositionInPreview", callTime, { positionX: 0.5, positionY: 0.5 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraTorchOn(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraTorchOn ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraTorchOn(true);
        this.assertLogEntry(runner, "setCameraTorchOn", callTime, { isOn: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraAutoFocusFaceModeEnabled(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraAutoFocusFaceModeEnabled ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraAutoFocusFaceModeEnabled(true);
        this.assertLogEntry(runner, "setCameraAutoFocusFaceModeEnabled", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraExposurePosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraExposurePosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraExposurePosition(0.3, 0.7);
        this.assertLogEntry(runner, "setCameraExposurePosition", callTime, {
            positionXinView: 0.3,
            positionYinView: 0.7,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraExposureFactor(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraExposureFactor ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraExposureFactor(1.5);
        this.assertLogEntry(runner, "setCameraExposureFactor", callTime, { factor: 1.5 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraAutoExposureFaceModeEnabled(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraAutoExposureFaceModeEnabled ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraAutoExposureFaceModeEnabled(false);
        this.assertLogEntry(runner, "setCameraAutoExposureFaceModeEnabled", callTime, { enabled: false });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraStabilizationMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraStabilizationMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraStabilizationMode(1);
        this.assertLogEntry(runner, "setCameraStabilizationMode", callTime, { mode: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 149-152. Audio route & camera center stage
    private async testSetDefaultAudioRouteToSpeakerphone(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDefaultAudioRouteToSpeakerphone ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setDefaultAudioRouteToSpeakerphone(true);
        this.assertLogEntry(runner, "setDefaultAudioRouteToSpeakerphone", callTime, { defaultToSpeaker: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetEnableSpeakerphone(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEnableSpeakerphone ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setEnableSpeakerphone(true);
        this.assertLogEntry(runner, "setEnableSpeakerphone", callTime, { speakerOn: true });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetRouteInCommunicationMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRouteInCommunicationMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRouteInCommunicationMode(1);
        this.assertLogEntry(runner, "setRouteInCommunicationMode", callTime, { route: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableCameraCenterStage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableCameraCenterStage ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableCameraCenterStage(true);
        this.assertLogEntry(runner, "enableCameraCenterStage", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 153-160. Screen capture
    private async testStartScreenCaptureByDisplayId(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartScreenCaptureByDisplayId ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startScreenCaptureByDisplayId(12345, { x: 0, y: 0, width: 0, height: 0 }, {
            dimensions: { width: 1920, height: 1080 },
            frameRate: 15,
            bitrate: 1000,
            captureMouseCursor: true,
            windowFocus: false,
        } as any);
        this.assertLogEntry(runner, "startScreenCaptureByDisplayId", callTime, {
            displayId: 12345,
            regionRect_x: 0,
            regionRect_y: 0,
            regionRect_width: 0,
            regionRect_height: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStartScreenCaptureByWindowId(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartScreenCaptureByWindowId ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startScreenCaptureByWindowId(67890, { x: 10, y: 20, width: 300, height: 200 }, {
            dimensions: { width: 1280, height: 720 },
            frameRate: 30,
            bitrate: 2000,
            captureMouseCursor: false,
            windowFocus: true,
        } as any);
        this.assertLogEntry(runner, "startScreenCaptureByWindowId", callTime, {
            windowId: 67890,
            regionRect_x: 10,
            regionRect_y: 20,
            regionRect_width: 300,
            regionRect_height: 200,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetScreenCaptureContentHint(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureContentHint ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setScreenCaptureContentHint(1);
        this.assertLogEntry(runner, "setScreenCaptureContentHint", callTime, { contentHint: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateScreenCaptureRegion(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateScreenCaptureRegion ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateScreenCaptureRegion({ x: 100, y: 200, width: 500, height: 400 });
        this.assertLogEntry(runner, "updateScreenCaptureRegion", callTime, {
            x: 100,
            y: 200,
            width: 500,
            height: 400,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateScreenCaptureParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateScreenCaptureParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateScreenCaptureParameters({
            dimensions: { width: 1920, height: 1080 },
            frameRate: 30,
            bitrate: 2000,
            captureMouseCursor: true,
            windowFocus: false,
        } as any);
        this.assertLogEntry(runner, "updateScreenCaptureParameters", callTime, {
            width: 1920,
            height: 1080,
            frameRate: 30,
            bitrate: 2000,
            captureMouseCursor: true,
            windowFocus: false,
        });
        await bridge.release(true);
        await this.delay(50);
    }

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
                captureMouseCursor: true,
                windowFocus: false,
            },
            regionRect: { x: 0, y: 0, width: 0, height: 0 },
        } as any);
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
        await this.delay(50);
    }

    private async testStopScreenCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopScreenCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopScreenCapture();
        this.assertLogEntry(runner, "stopScreenCapture", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetScreenCaptureScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureScenario ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setScreenCaptureScenario(1);
        this.assertLogEntry(runner, "setScreenCaptureScenario", callTime, { screenScenario: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 161-162. rate/complain
    private async testRate(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRate ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.rate("call_abc123", 5, "Excellent quality");
        this.assertLogEntry(runner, "rate", callTime, {
            callId: "call_abc123",
            rating: 5,
            description: "Excellent quality",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testComplain(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testComplain ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.complain("call_abc123", "Audio lag issue");
        this.assertLogEntry(runner, "complain", callTime, {
            callId: "call_abc123",
            description: "Audio lag issue",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 163-168. RTMP/Live transcoding
    private async testStartRtmpStreamWithoutTranscoding(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithoutTranscoding ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startRtmpStreamWithoutTranscoding("rtmp://live.example.com/stream");
        this.assertLogEntry(runner, "startRtmpStreamWithoutTranscoding", callTime, {
            url: "rtmp://live.example.com/stream",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStartRtmpStreamWithTranscoding(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithTranscoding ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startRtmpStreamWithTranscoding("rtmp://live.example.com/stream", {
            width: 640,
            height: 480,
            videoBitrate: 800,
            videoFramerate: 15,
            lowLatency: false,
            videoGop: 30,
            videoCodecProfile: 2,
            backgroundColor: 0x000000,
            userCount: 0,
            transcodingUsers: [],
        } as any);
        this.assertLogEntry(runner, "startRtmpStreamWithTranscoding", callTime, {
            url: "rtmp://live.example.com/stream",
            transcoding: {
                width: 640,
                height: 480,
                videoBitrate: 800,
                videoFramerate: 15,
                lowLatency: false,
                videoGop: 30,
                videoCodecProfile: 2,
                backgroundColor: 0x000000,
                userCount: 0,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateRtmpTranscoding(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateRtmpTranscoding ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateRtmpTranscoding({
            width: 1280,
            height: 720,
            videoBitrate: 1500,
            videoFramerate: 30,
            lowLatency: true,
            videoGop: 60,
            videoCodecProfile: 1,
            backgroundColor: 0xffffff,
            userCount: 2,
            transcodingUsers: [],
        } as any);
        this.assertLogEntry(runner, "updateRtmpTranscoding", callTime, {
            transcoding: {
                width: 1280,
                height: 720,
                videoBitrate: 1500,
                videoFramerate: 30,
                lowLatency: true,
                videoGop: 60,
                videoCodecProfile: 1,
                backgroundColor: 0xffffff,
                userCount: 2,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStartLocalVideoTranscoder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartLocalVideoTranscoder ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startLocalVideoTranscoder({
            streamCount: 2,
            VideoInputStreams: [],
            videoOutputConfiguration: {} as any,
        } as any);
        this.assertLogEntry(runner, "startLocalVideoTranscoder", callTime, { config: { streamCount: 2 } });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateLocalTranscoderConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateLocalTranscoderConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateLocalTranscoderConfiguration({
            streamCount: 3,
            VideoInputStreams: [],
            videoOutputConfiguration: {} as any,
        } as any);
        this.assertLogEntry(runner, "updateLocalTranscoderConfiguration", callTime, { config: { streamCount: 3 } });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStopRtmpStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopRtmpStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopRtmpStream("rtmp://live.example.com/stream");
        this.assertLogEntry(runner, "stopRtmpStream", callTime, { url: "rtmp://live.example.com/stream" });
        await bridge.release(true);
        await this.delay(50);
    }

    // 169. stopLocalVideoTranscoder()
    private async testStopLocalVideoTranscoder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopLocalVideoTranscoder ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopLocalVideoTranscoder();
        this.assertLogEntry(runner, "stopLocalVideoTranscoder", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 170-172. Local audio mixer
    private async testStartLocalAudioMixer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartLocalAudioMixer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startLocalAudioMixer({
            streamCount: 2,
            audioInputStreams: [],
            syncWithLocalMic: true,
        } as any);
        this.assertLogEntry(runner, "startLocalAudioMixer", callTime, {
            config: { streamCount: 2, syncWithLocalMic: true },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateLocalAudioMixerConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateLocalAudioMixerConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateLocalAudioMixerConfiguration({
            streamCount: 4,
            audioInputStreams: [],
            syncWithLocalMic: false,
        } as any);
        this.assertLogEntry(runner, "updateLocalAudioMixerConfiguration", callTime, {
            config: { streamCount: 4, syncWithLocalMic: false },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStopLocalAudioMixer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopLocalAudioMixer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopLocalAudioMixer();
        this.assertLogEntry(runner, "stopLocalAudioMixer", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 173-176. Camera capture & orientation
    private async testStartCameraCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartCameraCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startCameraCapture(2, {
            cameraDirection: 1,
            format: { width: 1280, height: 720, fps: 30 },
        } as any);
        this.assertLogEntry(runner, "startCameraCapture", callTime, { sourceType: 2, cameraDirection: 0 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStopCameraCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopCameraCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopCameraCapture(2);
        this.assertLogEntry(runner, "stopCameraCapture", callTime, { sourceType: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraDeviceOrientation(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraDeviceOrientation ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCameraDeviceOrientation(2, 90);
        this.assertLogEntry(runner, "setCameraDeviceOrientation", callTime, { type: 2, orientation: 90 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetScreenCaptureOrientation(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureOrientation ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setScreenCaptureOrientation(4, 90);
        this.assertLogEntry(runner, "setScreenCaptureOrientation", callTime, { type: 4, orientation: 90 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 177. setRemoteUserPriority(uid, userPriority)
    private async testSetRemoteUserPriority(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteUserPriority ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteUserPriority(42, 50);
        this.assertLogEntry(runner, "setRemoteUserPriority", callTime, { uid: 42, userPriority: 50 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 178. enableEncryption(enabled, config)
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
        await this.delay(50);
    }

    // 179. createDataStream(reliable, ordered)
    private async testCreateDataStreamReliable(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testCreateDataStreamReliable ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await (bridge as any).createDataStream(true, false);
        this.assertLogEntry(runner, "createDataStream", callTime, { reliable: true, ordered: false });
        await bridge.release(true);
        await this.delay(50);
    }

    // 180. sendStreamMessage(streamId, data)
    private async testSendStreamMessage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendStreamMessage ---");
        const bridge = this.createBridgeAndInit();
        const data = new Uint8Array([97, 103]);
        const callTime = Date.now();
        await (bridge as any).sendStreamMessage(1, data.buffer);
        this.assertLogEntry(runner, "sendStreamMessage", callTime, { streamId: 1, data: "ag", length: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 181. sendRdtMessage(uid, type, data) - SKIP: requires RdtStreamType enum
    // 182. sendMediaControlMessage(uid, data) - SKIP: no JSB binding

    // 183. addVideoWatermark(watermarkUrl, options)
    private async testAddVideoWatermark(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAddVideoWatermark ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.addVideoWatermark("https://example.com/wm.png", {
            visibleInPreview: true,
            positionInLandscapeMode: { x: 1, y: 2, width: 100, height: 50 },
            positionInPortraitMode: { x: 3, y: 4, width: 80, height: 120 },
        } as any);
        this.assertLogEntry(runner, "addVideoWatermark", callTime, {
            watermarkUrl: "https://example.com/wm.png",
            visibleInPreview: true,
            posInLandscape_x: 1,
            posInLandscape_y: 2,
            posInLandscape_w: 100,
            posInLandscape_h: 50,
            posInPortrait_x: 3,
            posInPortrait_y: 4,
            posInPortrait_w: 80,
            posInPortrait_h: 120,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 184. removeVideoWatermark(id)
    private async testRemoveVideoWatermark(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRemoveVideoWatermark ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.removeVideoWatermark("watermark_abc");
        this.assertLogEntry(runner, "removeVideoWatermark", callTime, { id: "watermark_abc" });
        await bridge.release(true);
        await this.delay(50);
    }

    // 185. clearVideoWatermarks()
    private async testClearVideoWatermarks(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testClearVideoWatermarks ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.clearVideoWatermarks();
        this.assertLogEntry(runner, "clearVideoWatermarks", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 186. pauseAudio() - SKIP: no parameters
    // 187. resumeAudio() - SKIP: no parameters

    // 188. enableWebSdkInteroperability(enabled)
    private async testEnableWebSdkInteroperability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableWebSdkInteroperability ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableWebSdkInteroperability(true);
        this.assertLogEntry(runner, "enableWebSdkInteroperability", callTime, { enabled: true });
        await bridge.release(true);
        await this.delay(50);
    }

    // 189. sendCustomReportMessage(id, category, event, label, value)
    private async testSendCustomReportMessage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendCustomReportMessage ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.sendCustomReportMessage("report_id", "category1", "event1", "label1", 42);
        this.assertLogEntry(runner, "sendCustomReportMessage", callTime, {
            id: "report_id",
            category: "category1",
            event: "event1",
            label: "label1",
            value: 42,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 190. setAINSMode(enabled, mode)
    private async testSetAINSMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAINSMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAINSMode(true, 2);
        this.assertLogEntry(runner, "setAINSMode", callTime, { enabled: true, mode: 2 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 191. registerLocalUserAccount(appId, userAccount)
    private async testRegisterLocalUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRegisterLocalUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.registerLocalUserAccount("myAppId", "myUserAccount");
        this.assertLogEntry(runner, "registerLocalUserAccount", callTime, {
            appId: "myAppId",
            userAccount: "myUserAccount",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 192. joinChannelWithUserAccount(token, channelId, userAccount)
    private async testJoinChannelWithUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannelWithUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.joinChannelWithUserAccount("ucaToken", "ucaChannel", "ucaUser");
        this.assertLogEntry(runner, "joinChannelWithUserAccount", callTime, {
            token: "ucaToken",
            channelId: "ucaChannel",
            userAccount: "ucaUser",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 193. startOrUpdateChannelMediaRelay(configuration) - SKIP: requires ChannelMediaRelayConfiguration

    // 194-196. Channel media relay controls
    private async testStopChannelMediaRelay(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopChannelMediaRelay ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopChannelMediaRelay();
        this.assertLogEntry(runner, "stopChannelMediaRelay", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testPauseAllChannelMediaRelay(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllChannelMediaRelay ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.pauseAllChannelMediaRelay();
        this.assertLogEntry(runner, "pauseAllChannelMediaRelay", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testResumeAllChannelMediaRelay(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllChannelMediaRelay ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.resumeAllChannelMediaRelay();
        this.assertLogEntry(runner, "resumeAllChannelMediaRelay", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 197-201. Direct CDN streaming
    private async testSetDirectCdnStreamingAudioConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDirectCdnStreamingAudioConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setDirectCdnStreamingAudioConfiguration(5);
        this.assertLogEntry(runner, "setDirectCdnStreamingAudioConfiguration", callTime, { profile: 5 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetDirectCdnStreamingVideoConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDirectCdnStreamingVideoConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setDirectCdnStreamingVideoConfiguration({
            dimensions: { width: 1280, height: 720 },
            codecType: 2,
            orientationMode: 0,
            degradationPreference: 1,
            mirrorMode: 0,
            frameRate: 24,
            bitrate: 1500,
            minBitrate: 600,
            advanceOptions: { compressionPreference: 0, encodingPreference: 0, encodeAlpha: false },
        });
        this.assertLogEntry(runner, "setDirectCdnStreamingVideoConfiguration", callTime, {
            config: {
                codecType: 2,
                orientationMode: 0,
                degradationPreference: 1,
                mirrorMode: 0,
                frameRate: 24,
                bitrate: 1500,
                minBitrate: 600,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStartDirectCdnStreaming(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartDirectCdnStreaming ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startDirectCdnStreaming("rtmp://cdn.example.com/live", {} as any);
        this.assertLogEntry(runner, "startDirectCdnStreaming", callTime, {
            publishUrl: "rtmp://cdn.example.com/live",
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStopDirectCdnStreaming(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopDirectCdnStreaming ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopDirectCdnStreaming();
        this.assertLogEntry(runner, "stopDirectCdnStreaming", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateDirectCdnStreamingMediaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateDirectCdnStreamingMediaOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateDirectCdnStreamingMediaOptions({} as any);
        this.assertLogEntry(runner, "updateDirectCdnStreamingMediaOptions", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 202-204. Rhythm player
    private async testStartRhythmPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRhythmPlayer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startRhythmPlayer("/sounds/beat1.mp3", "/sounds/beat2.mp3", {
            beatsPerMeasure: 4,
            beatsPerMinute: 120,
        } as any);
        this.assertLogEntry(runner, "startRhythmPlayer", callTime, {
            sound1: "/sounds/beat1.mp3",
            sound2: "/sounds/beat2.mp3",
            beatsPerMeasure: 4,
            beatsPerMinute: 120,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testStopRhythmPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopRhythmPlayer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopRhythmPlayer();
        this.assertLogEntry(runner, "stopRhythmPlayer", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    private async testConfigRhythmPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testConfigRhythmPlayer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.configRhythmPlayer({ beatsPerMeasure: 3, beatsPerMinute: 90 } as any);
        this.assertLogEntry(runner, "configRhythmPlayer", callTime, {
            beatsPerMeasure: 3,
            beatsPerMinute: 90,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 205. takeSnapshot(uid, filePath)
    private async testTakeSnapshot(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testTakeSnapshot ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.takeSnapshot(42, "/tmp/snapshot.png");
        this.assertLogEntry(runner, "takeSnapshot", callTime, { uid: 42, filePath: "/tmp/snapshot.png" });
        await bridge.release(true);
        await this.delay(50);
    }

    // 206. enableContentInspect(enabled, config)
    private async testEnableContentInspect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableContentInspect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableContentInspect(true, { moduleCount: 2, modules: [] } as any);
        this.assertLogEntry(runner, "enableContentInspect", callTime, {
            enabled: true,
            config: { moduleCount: 2 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 207-208. Custom audio volume
    private async testAdjustCustomAudioPublishVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustCustomAudioPublishVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustCustomAudioPublishVolume(5, 70);
        this.assertLogEntry(runner, "adjustCustomAudioPublishVolume", callTime, { trackId: 5, volume: 70 });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testAdjustCustomAudioPlayoutVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustCustomAudioPlayoutVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustCustomAudioPlayoutVolume(3, 60);
        this.assertLogEntry(runner, "adjustCustomAudioPlayoutVolume", callTime, { trackId: 3, volume: 60 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 209. setCloudProxy(proxyType)
    private async testSetCloudProxy(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCloudProxy ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setCloudProxy(1);
        this.assertLogEntry(runner, "setCloudProxy", callTime, { proxyType: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 210. setLocalAccessPoint(config)
    private async testSetLocalAccessPoint(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalAccessPoint ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setLocalAccessPoint({} as any);
        this.assertLogEntry(runner, "setLocalAccessPoint", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 211. setAdvancedAudioOptions(options, sourceType)
    private async testSetAdvancedAudioOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAdvancedAudioOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAdvancedAudioOptions({ audioProcessingChannels: 2 } as any, 0);
        this.assertLogEntry(runner, "setAdvancedAudioOptions", callTime, {
            audioProcessingChannels: 2,
            sourceType: 0,
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 212. setAVSyncSource(channelId, uid)
    private async testSetAVSyncSource(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAVSyncSource ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setAVSyncSource("syncChannel", 777);
        this.assertLogEntry(runner, "setAVSyncSource", callTime, { channelId: "syncChannel", uid: 777 });
        await bridge.release(true);
        await this.delay(50);
    }

    // 213. enableVideoImageSource(enable, options)
    private async testEnableVideoImageSource(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVideoImageSource ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableVideoImageSource(true, {
            imageUrl: "https://example.com/image.png",
            fps: 15,
            mirrorMode: 0,
        });
        this.assertLogEntry(runner, "enableVideoImageSource", callTime, {
            enable: true,
            options: { imageUrl: "https://example.com/image.png", fps: 15, mirrorMode: 0 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 214. setParameters(parameters)
    private async testSetParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setParameters('{"che.audio.enable.aec":true}');
        this.assertLogEntry(runner, "setParameters", callTime, {
            parameters: '{"che.audio.enable.aec":true}',
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 215. startMediaRenderingTracing()
    private async testStartMediaRenderingTracing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartMediaRenderingTracing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startMediaRenderingTracing();
        this.assertLogEntry(runner, "startMediaRenderingTracing", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 216. enableInstantMediaRendering()
    private async testEnableInstantMediaRendering(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableInstantMediaRendering ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableInstantMediaRendering();
        this.assertLogEntry(runner, "enableInstantMediaRendering", callTime, {});
        await bridge.release(true);
        await this.delay(50);
    }

    // 217. sendAudioMetadata(metadata) - SKIP: requires ArrayBuffer

    // 218. queryHDRCapability(videoModule)
    private async testQueryHDRCapability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryHDRCapability ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.queryHDRCapability(1);
        this.assertLogEntry(runner, "queryHDRCapability", callTime, { videoModule: 1 });
        await bridge.release(true);
        await this.delay(50);
    }

    // ──────────────────────────── IRtcEngineEx Tests ────────────────────────────

    // 219. setParametersEx(connection, parameters)
    private async testSetParametersEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParametersEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setParametersEx({ channelId: "testChannel", localUid: 42 }, '{"che.audio.enable.aec":true}');
        this.assertLogEntry(runner, "setParametersEx", callTime, {
            parameters: '{"che.audio.enable.aec":true}',
            connection: { channelId: "testChannel", localUid: 42 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 220. joinChannelEx(token, connection, options)
    private async testJoinChannelEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannelEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.joinChannelEx(
            "exToken",
            { channelId: "exChannel", localUid: 999 },
            {
                autoSubscribeAudio: true,
                autoSubscribeVideo: true,
                publishCameraTrack: true,
                clientRoleType: 1,
            },
        );
        this.assertLogEntry(runner, "joinChannelEx", callTime, {
            token: "exToken",
            connection: { channelId: "exChannel", localUid: 999 },
            options: {
                autoSubscribeAudio: true,
                autoSubscribeVideo: true,
                publishCameraTrack: true,
                clientRoleType: 1,
            },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 221. leaveChannelEx(connection)
    private async testLeaveChannelEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannelEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.leaveChannelEx({ channelId: "leaveExChannel", localUid: 500 });
        this.assertLogEntry(runner, "leaveChannelEx", callTime, {
            connection: { channelId: "leaveExChannel", localUid: 500 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 222. leaveChannelEx(connection, options)
    private async testLeaveChannelWithOptionsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannelWithOptionsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.leaveChannelEx({ channelId: "leaveExOpt", localUid: 501 }, {
            stopMicrophoneRecording: true,
        } as any);
        this.assertLogEntry(runner, "leaveChannelEx", callTime, {
            connection: { channelId: "leaveExOpt", localUid: 501 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 223. updateChannelMediaOptionsEx(options, connection)
    private async testUpdateChannelMediaOptionsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateChannelMediaOptionsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateChannelMediaOptionsEx(
            { autoSubscribeAudio: false, publishCameraTrack: true, clientRoleType: 2 },
            { channelId: "updExChannel", localUid: 300 },
        );
        this.assertLogEntry(runner, "updateChannelMediaOptionsEx", callTime, {
            options: { autoSubscribeAudio: false, publishCameraTrack: true, clientRoleType: 2 },
            connection: { channelId: "updExChannel", localUid: 300 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 224. setVideoEncoderConfigurationEx(config, connection)
    private async testSetVideoEncoderConfigurationEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoEncoderConfigurationEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setVideoEncoderConfigurationEx(
            {
                dimensions: { width: 1920, height: 1080 },
                codecType: 2,
                orientationMode: 0,
                degradationPreference: 1,
                mirrorMode: 0,
                frameRate: 30,
                bitrate: 3000,
                minBitrate: 1000,
                advanceOptions: { compressionPreference: 0, encodingPreference: 0, encodeAlpha: false },
            },
            { channelId: "encExChannel", localUid: 600 },
        );
        this.assertLogEntry(runner, "setVideoEncoderConfigurationEx", callTime, {
            config: {
                codecType: 2,
                orientationMode: 0,
                degradationPreference: 1,
                mirrorMode: 0,
                frameRate: 30,
                bitrate: 3000,
                minBitrate: 1000,
            },
            connection: { channelId: "encExChannel", localUid: 600 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 225. muteRemoteAudioStreamEx(uid, mute, connection)
    private async testMuteRemoteAudioStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteAudioStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteRemoteAudioStreamEx(42, true, { channelId: "muteExCh", localUid: 700 });
        this.assertLogEntry(runner, "muteRemoteAudioStreamEx", callTime, {
            uid: 42,
            mute: true,
            connection: { channelId: "muteExCh", localUid: 700 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 226. muteRemoteVideoStreamEx(uid, mute, connection)
    private async testMuteRemoteVideoStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteVideoStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteRemoteVideoStreamEx(55, false, { channelId: "muteVExCh", localUid: 701 });
        this.assertLogEntry(runner, "muteRemoteVideoStreamEx", callTime, {
            uid: 55,
            mute: false,
            connection: { channelId: "muteVExCh", localUid: 701 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 227. setRemoteVideoStreamTypeEx(uid, streamType, connection)
    private async testSetRemoteVideoStreamTypeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoStreamTypeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteVideoStreamTypeEx(66, 1, { channelId: "streamExCh", localUid: 702 });
        this.assertLogEntry(runner, "setRemoteVideoStreamTypeEx", callTime, {
            uid: 66,
            streamType: 1,
            connection: { channelId: "streamExCh", localUid: 702 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 228. muteLocalAudioStreamEx(mute, connection)
    private async testMuteLocalAudioStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalAudioStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteLocalAudioStreamEx(true, { channelId: "muteLExCh", localUid: 703 });
        this.assertLogEntry(runner, "muteLocalAudioStreamEx", callTime, {
            mute: true,
            connection: { channelId: "muteLExCh", localUid: 703 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 229. muteLocalVideoStreamEx(mute, connection)
    private async testMuteLocalVideoStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalVideoStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteLocalVideoStreamEx(false, { channelId: "muteLVExCh", localUid: 704 });
        this.assertLogEntry(runner, "muteLocalVideoStreamEx", callTime, {
            mute: false,
            connection: { channelId: "muteLVExCh", localUid: 704 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 230. muteAllRemoteAudioStreamsEx(mute, connection)
    private async testMuteAllRemoteAudioStreamsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteAudioStreamsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteAllRemoteAudioStreamsEx(true, { channelId: "muteAllAExCh", localUid: 705 });
        this.assertLogEntry(runner, "muteAllRemoteAudioStreamsEx", callTime, {
            mute: true,
            connection: { channelId: "muteAllAExCh", localUid: 705 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 231. muteAllRemoteVideoStreamsEx(mute, connection)
    private async testMuteAllRemoteVideoStreamsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteVideoStreamsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteAllRemoteVideoStreamsEx(false, { channelId: "muteAllVExCh", localUid: 706 });
        this.assertLogEntry(runner, "muteAllRemoteVideoStreamsEx", callTime, {
            mute: false,
            connection: { channelId: "muteAllVExCh", localUid: 706 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 232-235. Subscribe blocklist/allowlist Ex
    private async testSetSubscribeAudioBlocklistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioBlocklistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeAudioBlocklistEx([11, 22], { channelId: "blkExCh", localUid: 710 });
        this.assertLogEntry(runner, "setSubscribeAudioBlocklistEx", callTime, {
            uidList: [11, 22],
            uidNumber: 2,
            connection: { channelId: "blkExCh", localUid: 710 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeAudioAllowlistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioAllowlistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeAudioAllowlistEx([33, 44], { channelId: "alwExCh", localUid: 711 });
        this.assertLogEntry(runner, "setSubscribeAudioAllowlistEx", callTime, {
            uidList: [33, 44],
            uidNumber: 2,
            connection: { channelId: "alwExCh", localUid: 711 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoBlocklistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoBlocklistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeVideoBlocklistEx([55, 66], { channelId: "vblkExCh", localUid: 712 });
        this.assertLogEntry(runner, "setSubscribeVideoBlocklistEx", callTime, {
            uidList: [55, 66],
            uidNumber: 2,
            connection: { channelId: "vblkExCh", localUid: 712 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoAllowlistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoAllowlistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSubscribeVideoAllowlistEx([77], { channelId: "valwExCh", localUid: 713 });
        this.assertLogEntry(runner, "setSubscribeVideoAllowlistEx", callTime, {
            uidList: [77],
            uidNumber: 1,
            connection: { channelId: "valwExCh", localUid: 713 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 236. setRemoteVideoSubscriptionOptionsEx(uid, options, connection)
    private async testSetRemoteVideoSubscriptionOptionsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoSubscriptionOptionsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteVideoSubscriptionOptionsEx(88, { type: 1 } as any, {
            channelId: "subExCh",
            localUid: 714,
        });
        this.assertLogEntry(runner, "setRemoteVideoSubscriptionOptionsEx", callTime, {
            uid: 88,
            connection: { channelId: "subExCh", localUid: 714 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 237. setRemoteVoicePositionEx(uid, pan, gain, connection)
    private async testSetRemoteVoicePositionEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVoicePositionEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteVoicePositionEx(42, 0.5, 10.0, { channelId: "posExCh", localUid: 715 });
        this.assertLogEntry(runner, "setRemoteVoicePositionEx", callTime, {
            uid: 42,
            pan: 0.5,
            gain: 10.0,
            connection: { channelId: "posExCh", localUid: 715 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 238. setRemoteUserSpatialAudioParamsEx(uid, params, connection)
    private async testSetRemoteUserSpatialAudioParamsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteUserSpatialAudioParamsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteUserSpatialAudioParamsEx(
            42,
            {
                speaker_azimuth: 45.0,
                speaker_elevation: 30.0,
                speaker_distance: 3.0,
                speaker_orientation: 0.0,
                enable_blur: false,
                enable_air_absorb: true,
            },
            { channelId: "spatExCh", localUid: 716 },
        );
        this.assertLogEntry(runner, "setRemoteUserSpatialAudioParamsEx", callTime, {
            uid: 42,
            params: {
                speaker_azimuth: 45.0,
                speaker_elevation: 30.0,
                speaker_distance: 3.0,
                speaker_orientation: 0.0,
                enable_blur: false,
                enable_air_absorb: true,
            },
            connection: { channelId: "spatExCh", localUid: 716 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 239. setRemoteRenderModeEx(uid, renderMode, mirrorMode, connection)
    private async testSetRemoteRenderModeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteRenderModeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setRemoteRenderModeEx(42, 2, 1, { channelId: "rendExCh", localUid: 717 });
        this.assertLogEntry(runner, "setRemoteRenderModeEx", callTime, {
            uid: 42,
            renderMode: 2,
            mirrorMode: 1,
            connection: { channelId: "rendExCh", localUid: 717 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 240. enableLoopbackRecordingEx(connection, enabled, deviceName)
    private async testEnableLoopbackRecordingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLoopbackRecordingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableLoopbackRecordingEx({ channelId: "loopExCh", localUid: 718 }, true, "Built-in Output");
        this.assertLogEntry(runner, "enableLoopbackRecordingEx", callTime, {
            enabled: true,
            deviceName: "Built-in Output",
            connection: { channelId: "loopExCh", localUid: 718 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 241. adjustRecordingSignalVolumeEx(volume, connection)
    private async testAdjustRecordingSignalVolumeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustRecordingSignalVolumeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustRecordingSignalVolumeEx(80, { channelId: "volExCh", localUid: 719 });
        this.assertLogEntry(runner, "adjustRecordingSignalVolumeEx", callTime, {
            volume: 80,
            connection: { channelId: "volExCh", localUid: 719 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 242. muteRecordingSignalEx(mute, connection)
    private async testMuteRecordingSignalEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRecordingSignalEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.muteRecordingSignalEx(true, { channelId: "muteRecExCh", localUid: 720 });
        this.assertLogEntry(runner, "muteRecordingSignalEx", callTime, {
            mute: true,
            connection: { channelId: "muteRecExCh", localUid: 720 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 243. adjustUserPlaybackSignalVolumeEx(uid, volume, connection)
    private async testAdjustUserPlaybackSignalVolumeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustUserPlaybackSignalVolumeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.adjustUserPlaybackSignalVolumeEx(77, 50, { channelId: "playExCh", localUid: 721 });
        this.assertLogEntry(runner, "adjustUserPlaybackSignalVolumeEx", callTime, {
            uid: 77,
            volume: 50,
            connection: { channelId: "playExCh", localUid: 721 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 244. enableEncryptionEx(connection, enabled, config)
    private async testEnableEncryptionEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableEncryptionEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableEncryptionEx({ channelId: "encExCh", localUid: 722 }, true, {
            encryptionMode: 1,
            encryptionKey: "exSecret",
            encryptionKdfSalt: new Uint8Array(0),
            datastreamEncryptionEnabled: false,
        });
        this.assertLogEntry(runner, "enableEncryptionEx", callTime, {
            enabled: true,
            encryptionMode: 1,
            encryptionKey: "exSecret",
            connection: { channelId: "encExCh", localUid: 722 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 245. createDataStreamEx(reliable, ordered, connection) - SKIP: returns complex

    // 246. sendStreamMessageEx(streamId, data, connection)
    private async testSendStreamMessageEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendStreamMessageEx ---");
        const bridge = this.createBridgeAndInit();
        const data = new Uint8Array([97, 103]);
        const callTime = Date.now();
        await (bridge as any).sendStreamMessageEx(1, data.buffer, {
            channelId: "msgExCh",
            localUid: 723,
        });
        this.assertLogEntry(runner, "sendStreamMessageEx", callTime, {
            streamId: 1,
            data: "ag",
            length: 2,
            connection: { channelId: "msgExCh", localUid: 723 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 247. sendRdtMessageEx(uid, type, data, connection) - SKIP: requires RdtStreamType enum
    // 248. sendMediaControlMessageEx(uid, data, connection) - SKIP: no JSB binding

    // 249. addVideoWatermarkEx(watermarkUrl, options, connection)
    private async testAddVideoWatermarkEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAddVideoWatermarkEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.addVideoWatermarkEx(
            "https://example.com/wm_ex.png",
            {
                visibleInPreview: false,
                positionInLandscapeMode: { x: 0, y: 0, width: 200, height: 100 },
                positionInPortraitMode: { x: 0, y: 0, width: 200, height: 100 },
            } as any,
            { channelId: "wmExCh", localUid: 724 },
        );
        this.assertLogEntry(runner, "addVideoWatermarkEx", callTime, {
            watermarkUrl: "https://example.com/wm_ex.png",
            connection: { channelId: "wmExCh", localUid: 724 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 250. removeVideoWatermarkEx(id, connection)
    private async testRemoveVideoWatermarkEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRemoveVideoWatermarkEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.removeVideoWatermarkEx("wm_id_123", { channelId: "rmWmExCh", localUid: 725 });
        this.assertLogEntry(runner, "removeVideoWatermarkEx", callTime, {
            id: "wm_id_123",
            connection: { channelId: "rmWmExCh", localUid: 725 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 251. clearVideoWatermarkEx(connection)
    private async testClearVideoWatermarkEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testClearVideoWatermarkEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.clearVideoWatermarkEx({ channelId: "clrWmExCh", localUid: 726 });
        this.assertLogEntry(runner, "clearVideoWatermarkEx", callTime, {
            connection: { channelId: "clrWmExCh", localUid: 726 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 252. sendCustomReportMessageEx(id, category, event, label, value, connection)
    private async testSendCustomReportMessageEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendCustomReportMessageEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.sendCustomReportMessageEx("ex_report", "ex_cat", "ex_event", "ex_label", 99, {
            channelId: "rptExCh",
            localUid: 727,
        });
        this.assertLogEntry(runner, "sendCustomReportMessageEx", callTime, {
            id: "ex_report",
            category: "ex_cat",
            event: "ex_event",
            label: "ex_label",
            value: 99,
            connection: { channelId: "rptExCh", localUid: 727 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 253. enableAudioVolumeIndicationEx(interval, smooth, reportVad, connection)
    private async testEnableAudioVolumeIndicationEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudioVolumeIndicationEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableAudioVolumeIndicationEx(300, 5, true, { channelId: "volIndExCh", localUid: 728 });
        this.assertLogEntry(runner, "enableAudioVolumeIndicationEx", callTime, {
            interval: 300,
            smooth: 5,
            reportVad: true,
            connection: { channelId: "volIndExCh", localUid: 728 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 254. startRtmpStreamWithoutTranscodingEx(url, connection)
    private async testStartRtmpStreamWithoutTranscodingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithoutTranscodingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startRtmpStreamWithoutTranscodingEx("rtmp://ex.example.com/stream", {
            channelId: "rtmpExCh",
            localUid: 729,
        });
        this.assertLogEntry(runner, "startRtmpStreamWithoutTranscodingEx", callTime, {
            url: "rtmp://ex.example.com/stream",
            connection: { channelId: "rtmpExCh", localUid: 729 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 255. startRtmpStreamWithTranscodingEx(url, transcoding, connection)
    private async testStartRtmpStreamWithTranscodingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithTranscodingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startRtmpStreamWithTranscodingEx(
            "rtmp://ex.example.com/stream2",
            {
                width: 640,
                height: 480,
                videoBitrate: 800,
                videoFramerate: 15,
                lowLatency: false,
                videoGop: 30,
                videoCodecProfile: 2,
                backgroundColor: 0x000000,
                userCount: 0,
                transcodingUsers: [],
            } as any,
            { channelId: "rtmpTcExCh", localUid: 730 },
        );
        this.assertLogEntry(runner, "startRtmpStreamWithTranscodingEx", callTime, {
            url: "rtmp://ex.example.com/stream2",
            connection: { channelId: "rtmpTcExCh", localUid: 730 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 256. updateRtmpTranscodingEx(transcoding, connection)
    private async testUpdateRtmpTranscodingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateRtmpTranscodingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.updateRtmpTranscodingEx(
            {
                width: 1280,
                height: 720,
                videoBitrate: 1500,
                videoFramerate: 30,
                lowLatency: true,
                videoGop: 60,
                videoCodecProfile: 1,
                backgroundColor: 0xffffff,
                userCount: 2,
                transcodingUsers: [],
            } as any,
            { channelId: "updTcExCh", localUid: 731 },
        );
        this.assertLogEntry(runner, "updateRtmpTranscodingEx", callTime, {
            connection: { channelId: "updTcExCh", localUid: 731 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 257. stopRtmpStreamEx(url, connection)
    private async testStopRtmpStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopRtmpStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopRtmpStreamEx("rtmp://ex.example.com/stream", { channelId: "stopRtmpExCh", localUid: 732 });
        this.assertLogEntry(runner, "stopRtmpStreamEx", callTime, {
            url: "rtmp://ex.example.com/stream",
            connection: { channelId: "stopRtmpExCh", localUid: 732 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 258. startOrUpdateChannelMediaRelayEx(configuration, connection)
    private async testStartOrUpdateChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartOrUpdateChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startOrUpdateChannelMediaRelayEx({} as any, { channelId: "relayExCh", localUid: 733 });
        this.assertLogEntry(runner, "startOrUpdateChannelMediaRelayEx", callTime, {
            connection: { channelId: "relayExCh", localUid: 733 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 259. stopChannelMediaRelayEx(connection)
    private async testStopChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.stopChannelMediaRelayEx({ channelId: "stopRelayExCh", localUid: 734 });
        this.assertLogEntry(runner, "stopChannelMediaRelayEx", callTime, {
            connection: { channelId: "stopRelayExCh", localUid: 734 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 260. pauseAllChannelMediaRelayEx(connection)
    private async testPauseAllChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.pauseAllChannelMediaRelayEx({ channelId: "pauseRelayExCh", localUid: 735 });
        this.assertLogEntry(runner, "pauseAllChannelMediaRelayEx", callTime, {
            connection: { channelId: "pauseRelayExCh", localUid: 735 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 261. resumeAllChannelMediaRelayEx(connection)
    private async testResumeAllChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.resumeAllChannelMediaRelayEx({ channelId: "resumeRelayExCh", localUid: 736 });
        this.assertLogEntry(runner, "resumeAllChannelMediaRelayEx", callTime, {
            connection: { channelId: "resumeRelayExCh", localUid: 736 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 262. enableDualStreamModeEx(enabled, streamConfig, connection)
    private async testEnableDualStreamModeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableDualStreamModeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableDualStreamModeEx(true, { dimensions: { width: 320, height: 240 } } as any, {
            channelId: "dualExCh",
            localUid: 737,
        });
        this.assertLogEntry(runner, "enableDualStreamModeEx", callTime, {
            enabled: true,
            connection: { channelId: "dualExCh", localUid: 737 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 263. setDualStreamModeEx(mode, streamConfig, connection)
    private async testSetDualStreamModeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDualStreamModeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setDualStreamModeEx(1, { dimensions: { width: 320, height: 240 } } as any, {
            channelId: "dualModeExCh",
            localUid: 738,
        });
        this.assertLogEntry(runner, "setDualStreamModeEx", callTime, {
            mode: 1,
            connection: { channelId: "dualModeExCh", localUid: 738 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 264. setSimulcastConfigEx(simulcastConfig, connection)
    private async testSetSimulcastConfigEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSimulcastConfigEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.setSimulcastConfigEx(
            { configs: [], publish_fallback_enable: true },
            { channelId: "simExCh", localUid: 739 },
        );
        this.assertLogEntry(runner, "setSimulcastConfigEx", callTime, {
            publish_fallback_enable: true,
            connection: { channelId: "simExCh", localUid: 739 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 265. setHighPriorityUserListEx(uidList, option, connection)
    private async testSetHighPriorityUserListEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHighPriorityUserListEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await (bridge as any).setHighPriorityUserListEx([111, 222], 1, { channelId: "hiPriExCh", localUid: 740 });
        this.assertLogEntry(runner, "setHighPriorityUserListEx", callTime, {
            uidList: [111, 222],
            uidNum: 2,
            option: 1,
            connection: { channelId: "hiPriExCh", localUid: 740 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 266. takeSnapshotEx(connection, uid, filePath)
    private async testTakeSnapshotEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testTakeSnapshotEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.takeSnapshotEx({ channelId: "snapExCh", localUid: 741 }, 42, "/tmp/snap_ex.png");
        this.assertLogEntry(runner, "takeSnapshotEx", callTime, {
            uid: 42,
            filePath: "/tmp/snap_ex.png",
            connection: { channelId: "snapExCh", localUid: 741 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 267. enableContentInspectEx(enabled, config, connection)
    private async testEnableContentInspectEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableContentInspectEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.enableContentInspectEx(true, { moduleCount: 2, modules: [] } as any, {
            channelId: "inspectExCh",
            localUid: 742,
        });
        this.assertLogEntry(runner, "enableContentInspectEx", callTime, {
            enabled: true,
            connection: { channelId: "inspectExCh", localUid: 742 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 268. startMediaRenderingTracingEx(connection)
    private async testStartMediaRenderingTracingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartMediaRenderingTracingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.startMediaRenderingTracingEx({ channelId: "traceExCh", localUid: 743 });
        this.assertLogEntry(runner, "startMediaRenderingTracingEx", callTime, {
            connection: { channelId: "traceExCh", localUid: 743 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 269. setParametersEx(connection, parameters) (string overload)
    private async testSetParametersExString(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParametersExString ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await (bridge as any).setParametersEx(
            { channelId: "paramStrExCh", localUid: 744 },
            '{"che.video.enable.hw_encoder":true}',
        );
        this.assertLogEntry(runner, "setParametersEx", callTime, {
            parameters: '{"che.video.enable.hw_encoder":true}',
            connection: { channelId: "paramStrExCh", localUid: 744 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 270. getCallIdEx(connection) - returns complex {callId, errorCode}
    private async testGetCallIdEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetCallIdEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.getCallIdEx({ channelId: "callIdExCh", localUid: 747 });
        this.assertLogEntry(runner, "getCallIdEx", callTime, {
            connection: { channelId: "callIdExCh", localUid: 747 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 271. preloadEffectEx(connection, soundId, filePath, startPos)
    private async testPreloadEffectEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadEffectEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.preloadEffectEx({ channelId: "preloadExCh", localUid: 745 }, 5, "/sounds/ex_preload.wav", 200);
        this.assertLogEntry(runner, "preloadEffectEx", callTime, {
            soundId: 5,
            filePath: "/sounds/ex_preload.wav",
            startPos: 200,
            connection: { channelId: "preloadExCh", localUid: 745 },
        });
        await bridge.release(true);
        await this.delay(50);
    }

    // 272. playEffectEx(connection, soundId, filePath, loopCount, pitch, pan, gain, publish, startPos)
    private async testPlayEffectEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPlayEffectEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        await bridge.playEffectEx(
            { channelId: "playExCh", localUid: 746 },
            1,
            "/sounds/ex_effect.wav",
            2,
            1.2,
            0.3,
            90,
            true,
            100,
        );
        this.assertLogEntry(runner, "playEffectEx", callTime, {
            soundId: 1,
            filePath: "/sounds/ex_effect.wav",
            loopCount: 2,
            pitch: 1.2,
            pan: 0.3,
            gain: 90,
            publish: true,
            startPos: 100,
            connection: { channelId: "playExCh", localUid: 746 },
        });
        await bridge.release(true);
        await this.delay(50);
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
        await this.delay(50);
    }
}
