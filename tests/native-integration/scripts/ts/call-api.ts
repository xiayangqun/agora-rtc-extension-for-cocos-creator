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
import { ChannelMediaOptions, ExtensionInfo } from "agora-rtc/types/AgoraRtcEngine";
import { CHANNEL_PROFILE_TYPE, CLIENT_ROLE_TYPE } from "agora-rtc/types/AgoraBase";
import { MEDIA_SOURCE_TYPE } from "agora-rtc/types/AgoraMediaBase";

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
        await this.testGetVersion(runner);
        await this.testQueryDeviceScore(runner);
        await this.testQueryCodecCapability(runner);
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
        await this.testGetFaceShapeBeautyOptions(runner);
        await this.testSetFaceShapeAreaOptions(runner);
        await this.testGetFaceShapeAreaOptions(runner);
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
        await this.testEnableExtensionWithExtensionInfo(runner);
        await this.testSetExtensionPropertyWithExtensionInfo(runner);
        await this.testGetExtensionPropertyWithExtensionInfo(runner);
        await this.testEnableExtension(runner);
        await this.testSetExtensionProperty(runner);
        await this.testGetExtensionProperty(runner);
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
        await this.testGetAudioDeviceInfo(runner);
        await this.testQueryCameraFocalLengthCapability(runner);
        await this.testGetCallId(runner);
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
        await this.testGetUserInfoByUserAccount(runner);
        await this.testGetUserInfoByUid(runner);
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
        await this.testSendAudioMetadata(runner);
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
        await this.testCreateDataStreamEx(runner);
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
        await this.testGetUserInfoByUserAccountEx(runner);
        await this.testGetUserInfoByUidEx(runner);
        await this.testSendAudioMetadataEx(runner);
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

    private createExtensionInfo(): ExtensionInfo {
        return {
            mediaSourceType: MEDIA_SOURCE_TYPE.PRIMARY_CAMERA_SOURCE,
            remoteUid: 1234,
            channelId: "extensionChannel",
            localUid: 5678,
        };
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
        const releaseResult1 = await bridge.release(true);
        runner.assert(true, "release should complete without throwing");
        await this.delay(50);
    }

    // 2. initialize(context) - mock only logs appId
    private async testInitialize(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testInitialize ---");
        const bridge = new (jsb as any).agora.RtcEngineExBridge() as IRtcEngineEx;
        const callTime = Date.now();
        const initializeResult2 = await bridge.initialize({
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
        runner.assert(initializeResult2 === 0, "initialize should return 0, got " + initializeResult2);
        const releaseResult3 = await bridge.release(true);
        await this.delay(50);
    }

    // 3. queryDeviceScore()
    private async testQueryDeviceScore(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryDeviceScore ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const queryDeviceScoreResult4 = await bridge.queryDeviceScore();
        this.assertLogEntry(runner, "queryDeviceScore", callTime, {});
        runner.assert(
            queryDeviceScoreResult4 === 0,
            "queryDeviceScore should return 0, got " + queryDeviceScoreResult4,
        );
        const releaseResult5 = await bridge.release(true);
        await this.delay(50);
    }

    // 4. preloadChannel(token, channelId, uid)
    private async testPreloadChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadChannel ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const preloadChannelResult6 = await bridge.preloadChannel("preloadToken", "preloadChannel", 54321);
        this.assertLogEntry(runner, "preloadChannel", callTime, {
            token: "preloadToken",
            channelId: "preloadChannel",
            uid: 54321,
        });
        runner.assert(preloadChannelResult6 === 0, "preloadChannel should return 0, got " + preloadChannelResult6);
        const releaseResult7 = await bridge.release(true);
        await this.delay(50);
    }

    // 5. preloadChannelWithUserAccount(token, channelId, userAccount)
    private async testPreloadChannelWithUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadChannelWithUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const preloadChannelWithUserAccountResult8 = await bridge.preloadChannelWithUserAccount(
            "preloadToken2",
            "preloadChannel2",
            "user123",
        );
        this.assertLogEntry(runner, "preloadChannelWithUserAccount", callTime, {
            token: "preloadToken2",
            channelId: "preloadChannel2",
            userAccount: "user123",
        });
        runner.assert(
            preloadChannelWithUserAccountResult8 === 0,
            "preloadChannelWithUserAccount should return 0, got " + preloadChannelWithUserAccountResult8,
        );
        const releaseResult9 = await bridge.release(true);
        await this.delay(50);
    }

    // 6. updatePreloadChannelToken(token)
    private async testUpdatePreloadChannelToken(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdatePreloadChannelToken ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updatePreloadChannelTokenResult10 = await bridge.updatePreloadChannelToken("updatedToken");
        this.assertLogEntry(runner, "updatePreloadChannelToken", callTime, { token: "updatedToken" });
        runner.assert(
            updatePreloadChannelTokenResult10 === 0,
            "updatePreloadChannelToken should return 0, got " + updatePreloadChannelTokenResult10,
        );
        const releaseResult11 = await bridge.release(true);
        await this.delay(50);
    }

    // 7. joinChannel(token, channelId, info, uid)
    private async testJoinChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannel ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const joinChannelResult12 = await bridge.joinChannel("myToken", "myChannel", "myInfo", 12345);
        this.assertLogEntry(runner, "joinChannel", callTime, {
            token: "myToken",
            channelId: "myChannel",
            info: "myInfo",
            uid: 12345,
        });
        runner.assert(joinChannelResult12 === 0, "joinChannel should return 0, got " + joinChannelResult12);
        const releaseResult13 = await bridge.release(true);
        await this.delay(50);
    }

    // 8. joinChannel(token, channelId, uid, options)
    private async testJoinChannelWithOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannelWithOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const joinChannelResult14 = await bridge.joinChannel("optToken", "optChannel", 67890, {
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
        runner.assert(joinChannelResult14 === 0, "joinChannel should return 0, got " + joinChannelResult14);
        const releaseResult15 = await bridge.release(true);
        await this.delay(50);
    }

    // 9. updateChannelMediaOptions(options)
    private async testUpdateChannelMediaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateChannelMediaOptions ---");
        const bridge = this.createBridgeAndInit();
        let callTime = Date.now();
        const updateChannelMediaOptionsResult16 = await bridge.updateChannelMediaOptions({
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
        runner.assert(
            updateChannelMediaOptionsResult16 === 0,
            "updateChannelMediaOptions should return 0, got " + updateChannelMediaOptionsResult16,
        );

        await this.delay(50);
        let options: ChannelMediaOptions = {
            clientRoleType: CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER,
            publishCameraTrack: false,
            publishMicrophoneTrack: false,
            publishMediaPlayerAudioTrack: true,
            publishMediaPlayerVideoTrack: true,
            publishMediaPlayerId: 1,
        };
        callTime = Date.now();
        await bridge.updateChannelMediaOptions(options);
        this.assertLogEntry(runner, "updateChannelMediaOptions", callTime, {
            options,
        });

        await this.delay(50);
        options = {
            clientRoleType: CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER,
            publishCameraTrack: false,
            publishMicrophoneTrack: false,
            publishMediaPlayerAudioTrack: true,
            publishMediaPlayerVideoTrack: true,
            publishMediaPlayerId: 2,
        };
        callTime = Date.now();
        await bridge.updateChannelMediaOptions(options);
        this.assertLogEntry(runner, "updateChannelMediaOptions", callTime, {
            options,
        });

        const releaseResult17 = await bridge.release(true);
        await this.delay(50);
    }

    // 10. leaveChannel()
    private async testLeaveChannel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannel ---");
        const bridge = this.createBridgeAndInit();
        const joinChannelResult18 = await bridge.joinChannel("t", "c", "", 0);
        const callTime = Date.now();
        const leaveChannelResult19 = await bridge.leaveChannel();
        this.assertLogEntry(runner, "leaveChannel", callTime, {});
        runner.assert(leaveChannelResult19 === 0, "leaveChannel should return 0, got " + leaveChannelResult19);
        const releaseResult20 = await bridge.release(true);
        await this.delay(50);
    }

    // 11. leaveChannel(options) - mock logs empty params same as no-arg
    private async testLeaveChannelWithOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannelWithOptions ---");
        const bridge = this.createBridgeAndInit();
        const joinChannelResult21 = await bridge.joinChannel("t", "c", "", 0);
        const callTime = Date.now();
        const leaveChannelResult22 = await bridge.leaveChannel({ stopMicrophoneRecording: true } as any);
        this.assertLogEntry(runner, "leaveChannel", callTime, {});
        runner.assert(leaveChannelResult22 === 0, "leaveChannel should return 0, got " + leaveChannelResult22);
        const releaseResult23 = await bridge.release(true);
        await this.delay(50);
    }

    // 12. renewToken(token)
    private async testRenewToken(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRenewToken ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const renewTokenResult24 = await bridge.renewToken("newToken123");
        this.assertLogEntry(runner, "renewToken", callTime, { token: "newToken123" });
        runner.assert(renewTokenResult24 === 0, "renewToken should return 0, got " + renewTokenResult24);
        const releaseResult25 = await bridge.release(true);
        await this.delay(50);
    }

    // 13. setChannelProfile(profile)
    private async testSetChannelProfile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetChannelProfile ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setChannelProfileResult26 = await bridge.setChannelProfile(1);
        this.assertLogEntry(runner, "setChannelProfile", callTime, { profile: 1 });
        runner.assert(
            setChannelProfileResult26 === 0,
            "setChannelProfile should return 0, got " + setChannelProfileResult26,
        );
        const releaseResult27 = await bridge.release(true);
        await this.delay(50);
    }

    // 14. setClientRole(role)
    private async testSetClientRole(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetClientRole ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setClientRoleResult28 = await bridge.setClientRole(2);
        this.assertLogEntry(runner, "setClientRole", callTime, { role: 2 });
        runner.assert(setClientRoleResult28 === 0, "setClientRole should return 0, got " + setClientRoleResult28);
        const releaseResult29 = await bridge.release(true);
        await this.delay(50);
    }

    // 15. setClientRole(role, options)
    private async testSetClientRoleWithOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetClientRoleWithOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setClientRoleResult30 = await bridge.setClientRole(1, { audienceLatencyLevel: 2 });
        this.assertLogEntry(runner, "setClientRole", callTime, {
            role: 1,
            options: { audienceLatencyLevel: 2 },
        });
        runner.assert(setClientRoleResult30 === 0, "setClientRole should return 0, got " + setClientRoleResult30);
        const releaseResult31 = await bridge.release(true);
        await this.delay(50);
    }

    // 16. startEchoTest(config)
    private async testStartEchoTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartEchoTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startEchoTestResult32 = await bridge.startEchoTest({
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
        runner.assert(startEchoTestResult32 === 0, "startEchoTest should return 0, got " + startEchoTestResult32);
        const releaseResult33 = await bridge.release(true);
        await this.delay(50);
    }

    // 17. stopEchoTest()
    private async testStopEchoTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopEchoTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopEchoTestResult34 = await bridge.stopEchoTest();
        this.assertLogEntry(runner, "stopEchoTest", callTime, {});
        runner.assert(stopEchoTestResult34 === 0, "stopEchoTest should return 0, got " + stopEchoTestResult34);
        const releaseResult35 = await bridge.release(true);
        await this.delay(50);
    }

    // 18. enableMultiCamera(enabled, config) - SKIP: platform-conditional, only available on iOS

    // 19. enableVideo()
    private async testEnableVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVideo ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableVideoResult36 = await bridge.enableVideo();
        this.assertLogEntry(runner, "enableVideo", callTime, {});
        runner.assert(enableVideoResult36 === 0, "enableVideo should return 0, got " + enableVideoResult36);
        const releaseResult37 = await bridge.release(true);
        await this.delay(50);
    }

    // 20. disableVideo()
    private async testDisableVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testDisableVideo ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const disableVideoResult38 = await bridge.disableVideo();
        this.assertLogEntry(runner, "disableVideo", callTime, {});
        runner.assert(disableVideoResult38 === 0, "disableVideo should return 0, got " + disableVideoResult38);
        const releaseResult39 = await bridge.release(true);
        await this.delay(50);
    }

    // 21. startPreview()
    private async testStartPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartPreview ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startPreviewResult40 = await bridge.startPreview();
        this.assertLogEntry(runner, "startPreview", callTime, {});
        runner.assert(startPreviewResult40 === 0, "startPreview should return 0, got " + startPreviewResult40);
        const releaseResult41 = await bridge.release(true);
        await this.delay(50);
    }

    // 22. startPreview(sourceType)
    private async testStartPreviewWithSourceType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartPreviewWithSourceType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startPreviewResult42 = await bridge.startPreview(3);
        this.assertLogEntry(runner, "startPreview", callTime, { sourceType: 3 });
        runner.assert(startPreviewResult42 === 0, "startPreview should return 0, got " + startPreviewResult42);
        const releaseResult43 = await bridge.release(true);
        await this.delay(50);
    }

    // 23. stopPreview()
    private async testStopPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopPreview ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopPreviewResult44 = await bridge.stopPreview();
        this.assertLogEntry(runner, "stopPreview", callTime, {});
        runner.assert(stopPreviewResult44 === 0, "stopPreview should return 0, got " + stopPreviewResult44);
        const releaseResult45 = await bridge.release(true);
        await this.delay(50);
    }

    // 24. stopPreview(sourceType)
    private async testStopPreviewWithSourceType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopPreviewWithSourceType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopPreviewResult46 = await bridge.stopPreview(5);
        this.assertLogEntry(runner, "stopPreview", callTime, { sourceType: 5 });
        runner.assert(stopPreviewResult46 === 0, "stopPreview should return 0, got " + stopPreviewResult46);
        const releaseResult47 = await bridge.release(true);
        await this.delay(50);
    }

    // 25. startLastmileProbeTest(config)
    private async testStartLastmileProbeTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartLastmileProbeTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startLastmileProbeTestResult48 = await bridge.startLastmileProbeTest({
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
        runner.assert(
            startLastmileProbeTestResult48 === 0,
            "startLastmileProbeTest should return 0, got " + startLastmileProbeTestResult48,
        );
        const releaseResult49 = await bridge.release(true);
        await this.delay(50);
    }

    // 26. stopLastmileProbeTest()
    private async testStopLastmileProbeTest(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopLastmileProbeTest ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopLastmileProbeTestResult50 = await bridge.stopLastmileProbeTest();
        this.assertLogEntry(runner, "stopLastmileProbeTest", callTime, {});
        runner.assert(
            stopLastmileProbeTestResult50 === 0,
            "stopLastmileProbeTest should return 0, got " + stopLastmileProbeTestResult50,
        );
        const releaseResult51 = await bridge.release(true);
        await this.delay(50);
    }

    // 27. setVideoEncoderConfiguration(config)
    private async testSetVideoEncoderConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoEncoderConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVideoEncoderConfigurationResult52 = await bridge.setVideoEncoderConfiguration({
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
        runner.assert(
            setVideoEncoderConfigurationResult52 === 0,
            "setVideoEncoderConfiguration should return 0, got " + setVideoEncoderConfigurationResult52,
        );
        const releaseResult53 = await bridge.release(true);
        await this.delay(50);
    }

    // 28. setBeautyEffectOptions(enabled, options, type)
    private async testSetBeautyEffectOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetBeautyEffectOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setBeautyEffectOptionsResult54 = await bridge.setBeautyEffectOptions(
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
        runner.assert(
            setBeautyEffectOptionsResult54 === 0,
            "setBeautyEffectOptions should return 0, got " + setBeautyEffectOptionsResult54,
        );
        const releaseResult55 = await bridge.release(true);
        await this.delay(50);
    }

    // 29. setFaceShapeBeautyOptions(enabled, options, type)
    private async testSetFaceShapeBeautyOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetFaceShapeBeautyOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setFaceShapeBeautyOptionsResult56 = await bridge.setFaceShapeBeautyOptions(
            true,
            { styleIntensity: 75 } as any,
            0,
        );
        this.assertLogEntry(runner, "setFaceShapeBeautyOptions", callTime, {
            enabled: true,
            intensity: 75,
            type: 0,
        });
        runner.assert(
            setFaceShapeBeautyOptionsResult56 === 0,
            "setFaceShapeBeautyOptions should return 0, got " + setFaceShapeBeautyOptionsResult56,
        );
        const releaseResult57 = await bridge.release(true);
        await this.delay(50);
    }

    // 30. setFaceShapeAreaOptions(options, type)
    private async testSetFaceShapeAreaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetFaceShapeAreaOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setFaceShapeAreaOptionsResult58 = await bridge.setFaceShapeAreaOptions(
            { shapeArea: 3, shapeIntensity: 50 } as any,
            0,
        );
        this.assertLogEntry(runner, "setFaceShapeAreaOptions", callTime, {
            shapeArea: 3,
            shapeIntensity: 50,
            type: 0,
        });
        runner.assert(
            setFaceShapeAreaOptionsResult58 === 0,
            "setFaceShapeAreaOptions should return 0, got " + setFaceShapeAreaOptionsResult58,
        );
        const releaseResult59 = await bridge.release(true);
        await this.delay(50);
    }

    // 31. setFilterEffectOptions(enabled, options, type)
    private async testSetFilterEffectOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetFilterEffectOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setFilterEffectOptionsResult60 = await bridge.setFilterEffectOptions(
            true,
            { path: "/filters/vivid.png" } as any,
            0,
        );
        this.assertLogEntry(runner, "setFilterEffectOptions", callTime, {
            enabled: true,
            path: "/filters/vivid.png",
            type: 0,
        });
        runner.assert(
            setFilterEffectOptionsResult60 === 0,
            "setFilterEffectOptions should return 0, got " + setFilterEffectOptionsResult60,
        );
        const releaseResult61 = await bridge.release(true);
        await this.delay(50);
    }

    // 32. destroyVideoEffectObject(obj) - SKIP: requires IVideoEffectObject instance

    // 33. setLowlightEnhanceOptions(enabled, options, type)
    private async testSetLowlightEnhanceOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLowlightEnhanceOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLowlightEnhanceOptionsResult62 = await bridge.setLowlightEnhanceOptions(
            true,
            { mode: 2, level: 1 } as any,
            0,
        );
        this.assertLogEntry(runner, "setLowlightEnhanceOptions", callTime, {
            enabled: true,
            mode: 2,
            level: 1,
            type: 0,
        });
        runner.assert(
            setLowlightEnhanceOptionsResult62 === 0,
            "setLowlightEnhanceOptions should return 0, got " + setLowlightEnhanceOptionsResult62,
        );
        const releaseResult63 = await bridge.release(true);
        await this.delay(50);
    }

    // 34. setVideoDenoiserOptions(enabled, options, type)
    private async testSetVideoDenoiserOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoDenoiserOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVideoDenoiserOptionsResult64 = await bridge.setVideoDenoiserOptions(
            true,
            { mode: 1, level: 2 } as any,
            0,
        );
        this.assertLogEntry(runner, "setVideoDenoiserOptions", callTime, {
            enabled: true,
            mode: 1,
            level: 2,
            type: 0,
        });
        runner.assert(
            setVideoDenoiserOptionsResult64 === 0,
            "setVideoDenoiserOptions should return 0, got " + setVideoDenoiserOptionsResult64,
        );
        const releaseResult65 = await bridge.release(true);
        await this.delay(50);
    }

    // 35. setColorEnhanceOptions(enabled, options, type)
    private async testSetColorEnhanceOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetColorEnhanceOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setColorEnhanceOptionsResult66 = await bridge.setColorEnhanceOptions(
            true,
            { strengthLevel: 0.6, skinProtectLevel: 0.8 } as any,
            0,
        );
        this.assertLogEntry(runner, "setColorEnhanceOptions", callTime, {
            enabled: true,
            strengthLevel: 0.6,
            skinProtectLevel: 0.8,
            type: 0,
        });
        runner.assert(
            setColorEnhanceOptionsResult66 === 0,
            "setColorEnhanceOptions should return 0, got " + setColorEnhanceOptionsResult66,
        );
        const releaseResult67 = await bridge.release(true);
        await this.delay(50);
    }

    // 36. enableVirtualBackground(enabled, backgroundSource, segproperty, type)
    private async testEnableVirtualBackground(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVirtualBackground ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableVirtualBackgroundResult68 = await bridge.enableVirtualBackground(
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
        runner.assert(
            enableVirtualBackgroundResult68 === 0,
            "enableVirtualBackground should return 0, got " + enableVirtualBackgroundResult68,
        );
        const releaseResult69 = await bridge.release(true);
        await this.delay(50);
    }

    // 37. setupRemoteVideo(canvas) - SKIP: bridge routes through VideoTextureManager, not mock engine
    // 38. setupLocalVideo(canvas) - SKIP: bridge routes through VideoTextureManager, not mock engine

    // 39. setVideoScenario(scenarioType)
    private async testSetVideoScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoScenario ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVideoScenarioResult70 = await bridge.setVideoScenario(1);
        this.assertLogEntry(runner, "setVideoScenario", callTime, { scenarioType: 1 });
        runner.assert(
            setVideoScenarioResult70 === 0,
            "setVideoScenario should return 0, got " + setVideoScenarioResult70,
        );
        const releaseResult71 = await bridge.release(true);
        await this.delay(50);
    }

    // 40. setVideoQoEPreference(qoePreference)
    private async testSetVideoQoEPreference(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoQoEPreference ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVideoQoEPreferenceResult72 = await bridge.setVideoQoEPreference(2);
        this.assertLogEntry(runner, "setVideoQoEPreference", callTime, { qoePreference: 2 });
        runner.assert(
            setVideoQoEPreferenceResult72 === 0,
            "setVideoQoEPreference should return 0, got " + setVideoQoEPreferenceResult72,
        );
        const releaseResult73 = await bridge.release(true);
        await this.delay(50);
    }

    // 41-42. enableAudio() / disableAudio()
    private async testEnableAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableAudioResult74 = await bridge.enableAudio();
        this.assertLogEntry(runner, "enableAudio", callTime, {});
        runner.assert(enableAudioResult74 === 0, "enableAudio should return 0, got " + enableAudioResult74);
        const releaseResult75 = await bridge.release(true);
        await this.delay(50);
    }

    private async testDisableAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testDisableAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const disableAudioResult76 = await bridge.disableAudio();
        this.assertLogEntry(runner, "disableAudio", callTime, {});
        runner.assert(disableAudioResult76 === 0, "disableAudio should return 0, got " + disableAudioResult76);
        const releaseResult77 = await bridge.release(true);
        await this.delay(50);
    }

    // 43. setAudioProfile(profile)
    private async testSetAudioProfile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioProfile ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioProfileResult78 = await bridge.setAudioProfile(2);
        this.assertLogEntry(runner, "setAudioProfile", callTime, { profile: 2 });
        runner.assert(setAudioProfileResult78 === 0, "setAudioProfile should return 0, got " + setAudioProfileResult78);
        const releaseResult79 = await bridge.release(true);
        await this.delay(50);
    }

    // 44. setAudioScenario(scenario)
    private async testSetAudioScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioScenario ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioScenarioResult80 = await bridge.setAudioScenario(3);
        this.assertLogEntry(runner, "setAudioScenario", callTime, { scenario: 3 });
        runner.assert(
            setAudioScenarioResult80 === 0,
            "setAudioScenario should return 0, got " + setAudioScenarioResult80,
        );
        const releaseResult81 = await bridge.release(true);
        await this.delay(50);
    }

    // 45. enableLocalAudio(enabled)
    private async testEnableLocalAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLocalAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableLocalAudioResult82 = await bridge.enableLocalAudio(true);
        this.assertLogEntry(runner, "enableLocalAudio", callTime, { enabled: true });
        runner.assert(
            enableLocalAudioResult82 === 0,
            "enableLocalAudio should return 0, got " + enableLocalAudioResult82,
        );
        const releaseResult83 = await bridge.release(true);
        await this.delay(50);
    }

    // 46. muteLocalAudioStream(mute)
    private async testMuteLocalAudioStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalAudioStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteLocalAudioStreamResult84 = await bridge.muteLocalAudioStream(true);
        this.assertLogEntry(runner, "muteLocalAudioStream", callTime, { mute: true });
        runner.assert(
            muteLocalAudioStreamResult84 === 0,
            "muteLocalAudioStream should return 0, got " + muteLocalAudioStreamResult84,
        );
        const releaseResult85 = await bridge.release(true);
        await this.delay(50);
    }

    // 47. muteAllRemoteAudioStreams(mute)
    private async testMuteAllRemoteAudioStreams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteAudioStreams ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteAllRemoteAudioStreamsResult86 = await bridge.muteAllRemoteAudioStreams(true);
        this.assertLogEntry(runner, "muteAllRemoteAudioStreams", callTime, { mute: true });
        runner.assert(
            muteAllRemoteAudioStreamsResult86 === 0,
            "muteAllRemoteAudioStreams should return 0, got " + muteAllRemoteAudioStreamsResult86,
        );
        const releaseResult87 = await bridge.release(true);
        await this.delay(50);
    }

    // 48. muteRemoteAudioStream(uid, mute)
    private async testMuteRemoteAudioStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteAudioStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteRemoteAudioStreamResult88 = await bridge.muteRemoteAudioStream(42, true);
        this.assertLogEntry(runner, "muteRemoteAudioStream", callTime, { uid: 42, mute: true });
        runner.assert(
            muteRemoteAudioStreamResult88 === 0,
            "muteRemoteAudioStream should return 0, got " + muteRemoteAudioStreamResult88,
        );
        const releaseResult89 = await bridge.release(true);
        await this.delay(50);
    }

    // 49. muteLocalVideoStream(mute)
    private async testMuteLocalVideoStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalVideoStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteLocalVideoStreamResult90 = await bridge.muteLocalVideoStream(false);
        this.assertLogEntry(runner, "muteLocalVideoStream", callTime, { mute: false });
        runner.assert(
            muteLocalVideoStreamResult90 === 0,
            "muteLocalVideoStream should return 0, got " + muteLocalVideoStreamResult90,
        );
        const releaseResult91 = await bridge.release(true);
        await this.delay(50);
    }

    // 50. enableLocalVideo(enabled)
    private async testEnableLocalVideo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLocalVideo ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableLocalVideoResult92 = await bridge.enableLocalVideo(false);
        this.assertLogEntry(runner, "enableLocalVideo", callTime, { enabled: false });
        runner.assert(
            enableLocalVideoResult92 === 0,
            "enableLocalVideo should return 0, got " + enableLocalVideoResult92,
        );
        const releaseResult93 = await bridge.release(true);
        await this.delay(50);
    }

    // 51. muteAllRemoteVideoStreams(mute)
    private async testMuteAllRemoteVideoStreams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteVideoStreams ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteAllRemoteVideoStreamsResult94 = await bridge.muteAllRemoteVideoStreams(false);
        this.assertLogEntry(runner, "muteAllRemoteVideoStreams", callTime, { mute: false });
        runner.assert(
            muteAllRemoteVideoStreamsResult94 === 0,
            "muteAllRemoteVideoStreams should return 0, got " + muteAllRemoteVideoStreamsResult94,
        );
        const releaseResult95 = await bridge.release(true);
        await this.delay(50);
    }

    // 52. setRemoteDefaultVideoStreamType(streamType)
    private async testSetRemoteDefaultVideoStreamType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteDefaultVideoStreamType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteDefaultVideoStreamTypeResult96 = await bridge.setRemoteDefaultVideoStreamType(1);
        this.assertLogEntry(runner, "setRemoteDefaultVideoStreamType", callTime, { streamType: 1 });
        runner.assert(
            setRemoteDefaultVideoStreamTypeResult96 === 0,
            "setRemoteDefaultVideoStreamType should return 0, got " + setRemoteDefaultVideoStreamTypeResult96,
        );
        const releaseResult97 = await bridge.release(true);
        await this.delay(50);
    }

    // 53. muteRemoteVideoStream(uid, mute)
    private async testMuteRemoteVideoStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteVideoStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteRemoteVideoStreamResult98 = await bridge.muteRemoteVideoStream(100, false);
        this.assertLogEntry(runner, "muteRemoteVideoStream", callTime, { uid: 100, mute: false });
        runner.assert(
            muteRemoteVideoStreamResult98 === 0,
            "muteRemoteVideoStream should return 0, got " + muteRemoteVideoStreamResult98,
        );
        const releaseResult99 = await bridge.release(true);
        await this.delay(50);
    }

    // 54. setRemoteVideoStreamType(uid, streamType)
    private async testSetRemoteVideoStreamType(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoStreamType ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteVideoStreamTypeResult100 = await bridge.setRemoteVideoStreamType(55, 0);
        this.assertLogEntry(runner, "setRemoteVideoStreamType", callTime, { uid: 55, streamType: 0 });
        runner.assert(
            setRemoteVideoStreamTypeResult100 === 0,
            "setRemoteVideoStreamType should return 0, got " + setRemoteVideoStreamTypeResult100,
        );
        const releaseResult101 = await bridge.release(true);
        await this.delay(50);
    }

    // 55. setRemoteVideoSubscriptionOptions(uid, options)
    private async testSetRemoteVideoSubscriptionOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoSubscriptionOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteVideoSubscriptionOptionsResult102 = await bridge.setRemoteVideoSubscriptionOptions(55, {
            type: 1,
        } as any);
        this.assertLogEntry(runner, "setRemoteVideoSubscriptionOptions", callTime, { uid: 55 });
        runner.assert(
            setRemoteVideoSubscriptionOptionsResult102 === 0,
            "setRemoteVideoSubscriptionOptions should return 0, got " + setRemoteVideoSubscriptionOptionsResult102,
        );
        const releaseResult103 = await bridge.release(true);
        await this.delay(50);
    }

    // 56-59. setSubscribeBlocklist/Allowlist
    private async testSetSubscribeAudioBlocklist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioBlocklist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeAudioBlocklistResult104 = await bridge.setSubscribeAudioBlocklist([11, 22, 33]);
        this.assertLogEntry(runner, "setSubscribeAudioBlocklist", callTime, { uidList: [11, 22, 33], uidNumber: 3 });
        runner.assert(
            setSubscribeAudioBlocklistResult104 === 0,
            "setSubscribeAudioBlocklist should return 0, got " + setSubscribeAudioBlocklistResult104,
        );
        const releaseResult105 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeAudioAllowlist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioAllowlist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeAudioAllowlistResult106 = await bridge.setSubscribeAudioAllowlist([44, 55]);
        this.assertLogEntry(runner, "setSubscribeAudioAllowlist", callTime, { uidList: [44, 55], uidNumber: 2 });
        runner.assert(
            setSubscribeAudioAllowlistResult106 === 0,
            "setSubscribeAudioAllowlist should return 0, got " + setSubscribeAudioAllowlistResult106,
        );
        const releaseResult107 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoBlocklist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoBlocklist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeVideoBlocklistResult108 = await bridge.setSubscribeVideoBlocklist([66, 77, 88]);
        this.assertLogEntry(runner, "setSubscribeVideoBlocklist", callTime, { uidList: [66, 77, 88], uidNumber: 3 });
        runner.assert(
            setSubscribeVideoBlocklistResult108 === 0,
            "setSubscribeVideoBlocklist should return 0, got " + setSubscribeVideoBlocklistResult108,
        );
        const releaseResult109 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoAllowlist(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoAllowlist ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeVideoAllowlistResult110 = await bridge.setSubscribeVideoAllowlist([99]);
        this.assertLogEntry(runner, "setSubscribeVideoAllowlist", callTime, { uidList: [99], uidNumber: 1 });
        runner.assert(
            setSubscribeVideoAllowlistResult110 === 0,
            "setSubscribeVideoAllowlist should return 0, got " + setSubscribeVideoAllowlistResult110,
        );
        const releaseResult111 = await bridge.release(true);
        await this.delay(50);
    }

    // 60. enableAudioVolumeIndication(interval, smooth, reportVad)
    private async testEnableAudioVolumeIndication(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudioVolumeIndication ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableAudioVolumeIndicationResult112 = await bridge.enableAudioVolumeIndication(200, 3, true);
        this.assertLogEntry(runner, "enableAudioVolumeIndication", callTime, {
            interval: 200,
            smooth: 3,
            reportVad: true,
        });
        runner.assert(
            enableAudioVolumeIndicationResult112 === 0,
            "enableAudioVolumeIndication should return 0, got " + enableAudioVolumeIndicationResult112,
        );
        const releaseResult113 = await bridge.release(true);
        await this.delay(50);
    }

    // 61. startAudioRecording(config) - SKIP: overloaded

    // 62. stopAudioRecording()
    private async testStopAudioRecording(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAudioRecording ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopAudioRecordingResult114 = await bridge.stopAudioRecording();
        this.assertLogEntry(runner, "stopAudioRecording", callTime, {});
        runner.assert(
            stopAudioRecordingResult114 === 0,
            "stopAudioRecording should return 0, got " + stopAudioRecordingResult114,
        );
        const releaseResult115 = await bridge.release(true);
        await this.delay(50);
    }

    // 63. startAudioMixing(filePath, loopback, cycle, startPos)
    private async testStartAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startAudioMixingResult116 = await bridge.startAudioMixing("/music/song.mp3", false, 1, 5000);
        this.assertLogEntry(runner, "startAudioMixing", callTime, {
            filePath: "/music/song.mp3",
            loopback: false,
            cycle: 1,
            startPos: 5000,
        });
        runner.assert(
            startAudioMixingResult116 === 0,
            "startAudioMixing should return 0, got " + startAudioMixingResult116,
        );
        const releaseResult117 = await bridge.release(true);
        await this.delay(50);
    }

    // 64-66. stopAudioMixing/pauseAudioMixing/resumeAudioMixing
    private async testStopAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopAudioMixingResult118 = await bridge.stopAudioMixing();
        this.assertLogEntry(runner, "stopAudioMixing", callTime, {});
        runner.assert(
            stopAudioMixingResult118 === 0,
            "stopAudioMixing should return 0, got " + stopAudioMixingResult118,
        );
        const releaseResult119 = await bridge.release(true);
        await this.delay(50);
    }

    private async testPauseAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const pauseAudioMixingResult120 = await bridge.pauseAudioMixing();
        this.assertLogEntry(runner, "pauseAudioMixing", callTime, {});
        runner.assert(
            pauseAudioMixingResult120 === 0,
            "pauseAudioMixing should return 0, got " + pauseAudioMixingResult120,
        );
        const releaseResult121 = await bridge.release(true);
        await this.delay(50);
    }

    private async testResumeAudioMixing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAudioMixing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const resumeAudioMixingResult122 = await bridge.resumeAudioMixing();
        this.assertLogEntry(runner, "resumeAudioMixing", callTime, {});
        runner.assert(
            resumeAudioMixingResult122 === 0,
            "resumeAudioMixing should return 0, got " + resumeAudioMixingResult122,
        );
        const releaseResult123 = await bridge.release(true);
        await this.delay(50);
    }

    // 67. selectAudioTrack(index)
    private async testSelectAudioTrack(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSelectAudioTrack ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const selectAudioTrackResult124 = await bridge.selectAudioTrack(2);
        this.assertLogEntry(runner, "selectAudioTrack", callTime, { index: 2 });
        runner.assert(
            selectAudioTrackResult124 === 0,
            "selectAudioTrack should return 0, got " + selectAudioTrackResult124,
        );
        const releaseResult125 = await bridge.release(true);
        await this.delay(50);
    }

    // 68. getAudioTrackCount() - SKIP: returns number

    // 69. adjustAudioMixingVolume(volume)
    private async testAdjustAudioMixingVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustAudioMixingVolumeResult126 = await bridge.adjustAudioMixingVolume(75);
        this.assertLogEntry(runner, "adjustAudioMixingVolume", callTime, { volume: 75 });
        runner.assert(
            adjustAudioMixingVolumeResult126 === 0,
            "adjustAudioMixingVolume should return 0, got " + adjustAudioMixingVolumeResult126,
        );
        const releaseResult127 = await bridge.release(true);
        await this.delay(50);
    }

    // 70. adjustAudioMixingPublishVolume(volume)
    private async testAdjustAudioMixingPublishVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingPublishVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustAudioMixingPublishVolumeResult128 = await bridge.adjustAudioMixingPublishVolume(60);
        this.assertLogEntry(runner, "adjustAudioMixingPublishVolume", callTime, { volume: 60 });
        runner.assert(
            adjustAudioMixingPublishVolumeResult128 === 0,
            "adjustAudioMixingPublishVolume should return 0, got " + adjustAudioMixingPublishVolumeResult128,
        );
        const releaseResult129 = await bridge.release(true);
        await this.delay(50);
    }

    // 71. getAudioMixingPublishVolume() - SKIP: returns number

    // 72. adjustAudioMixingPlayoutVolume(volume)
    private async testAdjustAudioMixingPlayoutVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustAudioMixingPlayoutVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustAudioMixingPlayoutVolumeResult130 = await bridge.adjustAudioMixingPlayoutVolume(85);
        this.assertLogEntry(runner, "adjustAudioMixingPlayoutVolume", callTime, { volume: 85 });
        runner.assert(
            adjustAudioMixingPlayoutVolumeResult130 === 0,
            "adjustAudioMixingPlayoutVolume should return 0, got " + adjustAudioMixingPlayoutVolumeResult130,
        );
        const releaseResult131 = await bridge.release(true);
        await this.delay(50);
    }

    // 73-75. getAudioMixingPlayoutVolume/getAudioMixingDuration/getAudioMixingCurrentPosition - SKIP: returns number

    // 76. setAudioMixingPosition(pos)
    private async testSetAudioMixingPosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioMixingPositionResult132 = await bridge.setAudioMixingPosition(5000);
        this.assertLogEntry(runner, "setAudioMixingPosition", callTime, { pos: 5000 });
        runner.assert(
            setAudioMixingPositionResult132 === 0,
            "setAudioMixingPosition should return 0, got " + setAudioMixingPositionResult132,
        );
        const releaseResult133 = await bridge.release(true);
        await this.delay(50);
    }

    // 77. setAudioMixingDualMonoMode(mode)
    private async testSetAudioMixingDualMonoMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingDualMonoMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioMixingDualMonoModeResult134 = await bridge.setAudioMixingDualMonoMode(1);
        this.assertLogEntry(runner, "setAudioMixingDualMonoMode", callTime, { mode: 1 });
        runner.assert(
            setAudioMixingDualMonoModeResult134 === 0,
            "setAudioMixingDualMonoMode should return 0, got " + setAudioMixingDualMonoModeResult134,
        );
        const releaseResult135 = await bridge.release(true);
        await this.delay(50);
    }

    // 78. setAudioMixingPitch(pitch)
    private async testSetAudioMixingPitch(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPitch ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioMixingPitchResult136 = await bridge.setAudioMixingPitch(2);
        this.assertLogEntry(runner, "setAudioMixingPitch", callTime, { pitch: 2 });
        runner.assert(
            setAudioMixingPitchResult136 === 0,
            "setAudioMixingPitch should return 0, got " + setAudioMixingPitchResult136,
        );
        const releaseResult137 = await bridge.release(true);
        await this.delay(50);
    }

    // 79. setAudioMixingPlaybackSpeed(speed)
    private async testSetAudioMixingPlaybackSpeed(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioMixingPlaybackSpeed ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioMixingPlaybackSpeedResult138 = await bridge.setAudioMixingPlaybackSpeed(120);
        this.assertLogEntry(runner, "setAudioMixingPlaybackSpeed", callTime, { speed: 120 });
        runner.assert(
            setAudioMixingPlaybackSpeedResult138 === 0,
            "setAudioMixingPlaybackSpeed should return 0, got " + setAudioMixingPlaybackSpeedResult138,
        );
        const releaseResult139 = await bridge.release(true);
        await this.delay(50);
    }

    // 80. getEffectsVolume() - SKIP: returns number

    // 81. setEffectsVolume(volume)
    private async testSetEffectsVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEffectsVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setEffectsVolumeResult140 = await bridge.setEffectsVolume(60);
        this.assertLogEntry(runner, "setEffectsVolume", callTime, { volume: 60 });
        runner.assert(
            setEffectsVolumeResult140 === 0,
            "setEffectsVolume should return 0, got " + setEffectsVolumeResult140,
        );
        const releaseResult141 = await bridge.release(true);
        await this.delay(50);
    }

    // 82. preloadEffect(soundId, filePath, startPos)
    private async testPreloadEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const preloadEffectResult142 = await bridge.preloadEffect(5, "/sounds/preload.wav", 100);
        this.assertLogEntry(runner, "preloadEffect", callTime, {
            soundId: 5,
            filePath: "/sounds/preload.wav",
            startPos: 100,
        });
        runner.assert(preloadEffectResult142 === 0, "preloadEffect should return 0, got " + preloadEffectResult142);
        const releaseResult143 = await bridge.release(true);
        await this.delay(50);
    }

    // 83. playEffect(soundId, filePath, loopCount, pitch, pan, gain, publish, startPos)
    private async testPlayEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPlayEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const playEffectResult144 = await bridge.playEffect(1, "/sounds/effect.wav", 0, 1.0, 0.0, 100, false, 0);
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
        runner.assert(playEffectResult144 === 0, "playEffect should return 0, got " + playEffectResult144);
        const releaseResult145 = await bridge.release(true);
        await this.delay(50);
    }

    // 84. playAllEffects(loopCount, pitch, pan, gain, publish)
    private async testPlayAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPlayAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const playAllEffectsResult146 = await bridge.playAllEffects(2, 1.5, 0.5, 80, true);
        this.assertLogEntry(runner, "playAllEffects", callTime, {
            loopCount: 2,
            pitch: 1.5,
            pan: 0.5,
            gain: 80,
            publish: true,
        });
        runner.assert(playAllEffectsResult146 === 0, "playAllEffects should return 0, got " + playAllEffectsResult146);
        const releaseResult147 = await bridge.release(true);
        await this.delay(50);
    }

    // 85. getVolumeOfEffect(soundId) - SKIP: returns number

    // 86. setVolumeOfEffect(soundId, volume)
    private async testSetVolumeOfEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVolumeOfEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVolumeOfEffectResult148 = await bridge.setVolumeOfEffect(1, 80);
        this.assertLogEntry(runner, "setVolumeOfEffect", callTime, { soundId: 1, volume: 80 });
        runner.assert(
            setVolumeOfEffectResult148 === 0,
            "setVolumeOfEffect should return 0, got " + setVolumeOfEffectResult148,
        );
        const releaseResult149 = await bridge.release(true);
        await this.delay(50);
    }

    // 87. pauseEffect(soundId)
    private async testPauseEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const pauseEffectResult150 = await bridge.pauseEffect(1);
        this.assertLogEntry(runner, "pauseEffect", callTime, { soundId: 1 });
        runner.assert(pauseEffectResult150 === 0, "pauseEffect should return 0, got " + pauseEffectResult150);
        const releaseResult151 = await bridge.release(true);
        await this.delay(50);
    }

    // 88. pauseAllEffects()
    private async testPauseAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const pauseAllEffectsResult152 = await bridge.pauseAllEffects();
        this.assertLogEntry(runner, "pauseAllEffects", callTime, {});
        runner.assert(
            pauseAllEffectsResult152 === 0,
            "pauseAllEffects should return 0, got " + pauseAllEffectsResult152,
        );
        const releaseResult153 = await bridge.release(true);
        await this.delay(50);
    }

    // 89. resumeEffect(soundId)
    private async testResumeEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const resumeEffectResult154 = await bridge.resumeEffect(1);
        this.assertLogEntry(runner, "resumeEffect", callTime, { soundId: 1 });
        runner.assert(resumeEffectResult154 === 0, "resumeEffect should return 0, got " + resumeEffectResult154);
        const releaseResult155 = await bridge.release(true);
        await this.delay(50);
    }

    // 90. resumeAllEffects()
    private async testResumeAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const resumeAllEffectsResult156 = await bridge.resumeAllEffects();
        this.assertLogEntry(runner, "resumeAllEffects", callTime, {});
        runner.assert(
            resumeAllEffectsResult156 === 0,
            "resumeAllEffects should return 0, got " + resumeAllEffectsResult156,
        );
        const releaseResult157 = await bridge.release(true);
        await this.delay(50);
    }

    // 91. stopEffect(soundId)
    private async testStopEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopEffectResult158 = await bridge.stopEffect(1);
        this.assertLogEntry(runner, "stopEffect", callTime, { soundId: 1 });
        runner.assert(stopEffectResult158 === 0, "stopEffect should return 0, got " + stopEffectResult158);
        const releaseResult159 = await bridge.release(true);
        await this.delay(50);
    }

    // 92. stopAllEffects()
    private async testStopAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopAllEffectsResult160 = await bridge.stopAllEffects();
        this.assertLogEntry(runner, "stopAllEffects", callTime, {});
        runner.assert(stopAllEffectsResult160 === 0, "stopAllEffects should return 0, got " + stopAllEffectsResult160);
        const releaseResult161 = await bridge.release(true);
        await this.delay(50);
    }

    // 93. unloadEffect(soundId)
    private async testUnloadEffect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUnloadEffect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const unloadEffectResult162 = await bridge.unloadEffect(1);
        this.assertLogEntry(runner, "unloadEffect", callTime, { soundId: 1 });
        runner.assert(unloadEffectResult162 === 0, "unloadEffect should return 0, got " + unloadEffectResult162);
        const releaseResult163 = await bridge.release(true);
        await this.delay(50);
    }

    // 94. unloadAllEffects()
    private async testUnloadAllEffects(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUnloadAllEffects ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const unloadAllEffectsResult164 = await bridge.unloadAllEffects();
        this.assertLogEntry(runner, "unloadAllEffects", callTime, {});
        runner.assert(
            unloadAllEffectsResult164 === 0,
            "unloadAllEffects should return 0, got " + unloadAllEffectsResult164,
        );
        const releaseResult165 = await bridge.release(true);
        await this.delay(50);
    }

    // 95. getEffectDuration(filePath) - SKIP: returns number

    // 96. setEffectPosition(soundId, pos)
    private async testSetEffectPosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEffectPosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setEffectPositionResult166 = await bridge.setEffectPosition(3, 2000);
        this.assertLogEntry(runner, "setEffectPosition", callTime, { soundId: 3, pos: 2000 });
        runner.assert(
            setEffectPositionResult166 === 0,
            "setEffectPosition should return 0, got " + setEffectPositionResult166,
        );
        const releaseResult167 = await bridge.release(true);
        await this.delay(50);
    }

    // 97. getEffectCurrentPosition(soundId) - SKIP: returns number

    // 98. enableSoundPositionIndication(enabled)
    private async testEnableSoundPositionIndication(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableSoundPositionIndication ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableSoundPositionIndicationResult168 = await bridge.enableSoundPositionIndication(true);
        this.assertLogEntry(runner, "enableSoundPositionIndication", callTime, { enabled: true });
        runner.assert(
            enableSoundPositionIndicationResult168 === 0,
            "enableSoundPositionIndication should return 0, got " + enableSoundPositionIndicationResult168,
        );
        const releaseResult169 = await bridge.release(true);
        await this.delay(50);
    }

    // 99. setRemoteVoicePosition(uid, pan, gain)
    private async testSetRemoteVoicePosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVoicePosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteVoicePositionResult170 = await bridge.setRemoteVoicePosition(42, 0.5, 10.0);
        this.assertLogEntry(runner, "setRemoteVoicePosition", callTime, { uid: 42, pan: 0.5, gain: 10.0 });
        runner.assert(
            setRemoteVoicePositionResult170 === 0,
            "setRemoteVoicePosition should return 0, got " + setRemoteVoicePositionResult170,
        );
        const releaseResult171 = await bridge.release(true);
        await this.delay(50);
    }

    // 100. enableSpatialAudio(enabled)
    private async testEnableSpatialAudio(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableSpatialAudio ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableSpatialAudioResult172 = await bridge.enableSpatialAudio(false);
        this.assertLogEntry(runner, "enableSpatialAudio", callTime, { enabled: false });
        runner.assert(
            enableSpatialAudioResult172 === 0,
            "enableSpatialAudio should return 0, got " + enableSpatialAudioResult172,
        );
        const releaseResult173 = await bridge.release(true);
        await this.delay(50);
    }

    // 101. setRemoteUserSpatialAudioParams(uid, params)
    private async testSetRemoteUserSpatialAudioParams(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteUserSpatialAudioParams ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteUserSpatialAudioParamsResult174 = await bridge.setRemoteUserSpatialAudioParams(42, {
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
        runner.assert(
            setRemoteUserSpatialAudioParamsResult174 === 0,
            "setRemoteUserSpatialAudioParams should return 0, got " + setRemoteUserSpatialAudioParamsResult174,
        );
        const releaseResult175 = await bridge.release(true);
        await this.delay(50);
    }

    // 102-107. Voice/Effect presets and parameters
    private async testSetVoiceBeautifierPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceBeautifierPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVoiceBeautifierPresetResult176 = await bridge.setVoiceBeautifierPreset(0x01010100);
        this.assertLogEntry(runner, "setVoiceBeautifierPreset", callTime, { preset: 0x01010100 });
        runner.assert(
            setVoiceBeautifierPresetResult176 === 0,
            "setVoiceBeautifierPreset should return 0, got " + setVoiceBeautifierPresetResult176,
        );
        const releaseResult177 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetAudioEffectPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioEffectPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioEffectPresetResult178 = await bridge.setAudioEffectPreset(0x02010100);
        this.assertLogEntry(runner, "setAudioEffectPreset", callTime, { preset: 0x02010100 });
        runner.assert(
            setAudioEffectPresetResult178 === 0,
            "setAudioEffectPreset should return 0, got " + setAudioEffectPresetResult178,
        );
        const releaseResult179 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetVoiceConversionPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceConversionPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVoiceConversionPresetResult180 = await bridge.setVoiceConversionPreset(0x03010100);
        this.assertLogEntry(runner, "setVoiceConversionPreset", callTime, { preset: 0x03010100 });
        runner.assert(
            setVoiceConversionPresetResult180 === 0,
            "setVoiceConversionPreset should return 0, got " + setVoiceConversionPresetResult180,
        );
        const releaseResult181 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetAudioEffectParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAudioEffectParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAudioEffectParametersResult182 = await bridge.setAudioEffectParameters(0x02010100, 3, 7);
        this.assertLogEntry(runner, "setAudioEffectParameters", callTime, {
            preset: 0x02010100,
            param1: 3,
            param2: 7,
        });
        runner.assert(
            setAudioEffectParametersResult182 === 0,
            "setAudioEffectParameters should return 0, got " + setAudioEffectParametersResult182,
        );
        const releaseResult183 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetVoiceBeautifierParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceBeautifierParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVoiceBeautifierParametersResult184 = await bridge.setVoiceBeautifierParameters(0x01010100, 5, 10);
        this.assertLogEntry(runner, "setVoiceBeautifierParameters", callTime, {
            preset: 0x01010100,
            param1: 5,
            param2: 10,
        });
        runner.assert(
            setVoiceBeautifierParametersResult184 === 0,
            "setVoiceBeautifierParameters should return 0, got " + setVoiceBeautifierParametersResult184,
        );
        const releaseResult185 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetVoiceConversionParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVoiceConversionParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVoiceConversionParametersResult186 = await bridge.setVoiceConversionParameters(0x03010100, 2, 4);
        this.assertLogEntry(runner, "setVoiceConversionParameters", callTime, {
            preset: 0x03010100,
            param1: 2,
            param2: 4,
        });
        runner.assert(
            setVoiceConversionParametersResult186 === 0,
            "setVoiceConversionParameters should return 0, got " + setVoiceConversionParametersResult186,
        );
        const releaseResult187 = await bridge.release(true);
        await this.delay(50);
    }

    // 108-114. Voice settings
    private async testSetLocalVoicePitch(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoicePitch ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalVoicePitchResult188 = await bridge.setLocalVoicePitch(0.5);
        this.assertLogEntry(runner, "setLocalVoicePitch", callTime, { pitch: 0.5 });
        runner.assert(
            setLocalVoicePitchResult188 === 0,
            "setLocalVoicePitch should return 0, got " + setLocalVoicePitchResult188,
        );
        const releaseResult189 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVoiceFormant(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceFormant ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalVoiceFormantResult190 = await bridge.setLocalVoiceFormant(0.8);
        this.assertLogEntry(runner, "setLocalVoiceFormant", callTime, { formantRatio: 0.8 });
        runner.assert(
            setLocalVoiceFormantResult190 === 0,
            "setLocalVoiceFormant should return 0, got " + setLocalVoiceFormantResult190,
        );
        const releaseResult191 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVoiceEqualization(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceEqualization ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalVoiceEqualizationResult192 = await bridge.setLocalVoiceEqualization(3, 5);
        this.assertLogEntry(runner, "setLocalVoiceEqualization", callTime, { bandFrequency: 3, bandGain: 5 });
        runner.assert(
            setLocalVoiceEqualizationResult192 === 0,
            "setLocalVoiceEqualization should return 0, got " + setLocalVoiceEqualizationResult192,
        );
        const releaseResult193 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVoiceReverb(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVoiceReverb ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalVoiceReverbResult194 = await bridge.setLocalVoiceReverb(1, 40);
        this.assertLogEntry(runner, "setLocalVoiceReverb", callTime, { reverbKey: 1, value: 40 });
        runner.assert(
            setLocalVoiceReverbResult194 === 0,
            "setLocalVoiceReverb should return 0, got " + setLocalVoiceReverbResult194,
        );
        const releaseResult195 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetHeadphoneEQPreset(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHeadphoneEQPreset ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setHeadphoneEQPresetResult196 = await bridge.setHeadphoneEQPreset(1 as any);
        this.assertLogEntry(runner, "setHeadphoneEQPreset", callTime, { preset: 1 });
        runner.assert(
            setHeadphoneEQPresetResult196 === 0,
            "setHeadphoneEQPreset should return 0, got " + setHeadphoneEQPresetResult196,
        );
        const releaseResult197 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetHeadphoneEQParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHeadphoneEQParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setHeadphoneEQParametersResult198 = await bridge.setHeadphoneEQParameters(3, 7);
        this.assertLogEntry(runner, "setHeadphoneEQParameters", callTime, { lowGain: 3, highGain: 7 });
        runner.assert(
            setHeadphoneEQParametersResult198 === 0,
            "setHeadphoneEQParameters should return 0, got " + setHeadphoneEQParametersResult198,
        );
        const releaseResult199 = await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableVoiceAITuner(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVoiceAITuner ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableVoiceAITunerResult200 = await bridge.enableVoiceAITuner(true, 2);
        this.assertLogEntry(runner, "enableVoiceAITuner", callTime, { enabled: true, type: 2 });
        runner.assert(
            enableVoiceAITunerResult200 === 0,
            "enableVoiceAITuner should return 0, got " + enableVoiceAITunerResult200,
        );
        const releaseResult201 = await bridge.release(true);
        await this.delay(50);
    }

    // 115-118. Logging
    private async testSetLogFile(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFile ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLogFileResult202 = await bridge.setLogFile("/tmp/agora_sdk.log");
        this.assertLogEntry(runner, "setLogFile", callTime, { filePath: "/tmp/agora_sdk.log" });
        runner.assert(setLogFileResult202 === 0, "setLogFile should return 0, got " + setLogFileResult202);
        const releaseResult203 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLogFilter(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFilter ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLogFilterResult204 = await bridge.setLogFilter(0x80f);
        this.assertLogEntry(runner, "setLogFilter", callTime, { filter: 0x80f });
        runner.assert(setLogFilterResult204 === 0, "setLogFilter should return 0, got " + setLogFilterResult204);
        const releaseResult205 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLogLevel(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogLevel ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLogLevelResult206 = await bridge.setLogLevel(1);
        this.assertLogEntry(runner, "setLogLevel", callTime, { level: 1 });
        runner.assert(setLogLevelResult206 === 0, "setLogLevel should return 0, got " + setLogLevelResult206);
        const releaseResult207 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLogFileSize(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLogFileSize ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLogFileSizeResult208 = await bridge.setLogFileSize(2048);
        this.assertLogEntry(runner, "setLogFileSize", callTime, { fileSizeInKBytes: 2048 });
        runner.assert(setLogFileSizeResult208 === 0, "setLogFileSize should return 0, got " + setLogFileSizeResult208);
        const releaseResult209 = await bridge.release(true);
        await this.delay(50);
    }

    // SKIP: uploadLogFile - returns complex
    // SKIP: writeLog - variadic C function

    // 119-121. Render modes
    private async testSetLocalRenderMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalRenderMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalRenderModeResult210 = await bridge.setLocalRenderMode(1);
        this.assertLogEntry(runner, "setLocalRenderMode", callTime, { renderMode: 1 });
        runner.assert(
            setLocalRenderModeResult210 === 0,
            "setLocalRenderMode should return 0, got " + setLocalRenderModeResult210,
        );
        const releaseResult211 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetRemoteRenderMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteRenderMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteRenderModeResult212 = await bridge.setRemoteRenderMode(42, 2, 1);
        this.assertLogEntry(runner, "setRemoteRenderMode", callTime, {
            uid: 42,
            renderMode: 2,
            mirrorMode: 1,
        });
        runner.assert(
            setRemoteRenderModeResult212 === 0,
            "setRemoteRenderMode should return 0, got " + setRemoteRenderModeResult212,
        );
        const releaseResult213 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetLocalVideoMirrorMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalVideoMirrorMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalVideoMirrorModeResult214 = await bridge.setLocalVideoMirrorMode(2);
        this.assertLogEntry(runner, "setLocalVideoMirrorMode", callTime, { mirrorMode: 2 });
        runner.assert(
            setLocalVideoMirrorModeResult214 === 0,
            "setLocalVideoMirrorMode should return 0, got " + setLocalVideoMirrorModeResult214,
        );
        const releaseResult215 = await bridge.release(true);
        await this.delay(50);
    }

    // 122-124. Dual stream
    private async testEnableDualStreamMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableDualStreamMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableDualStreamModeResult216 = await bridge.enableDualStreamMode(true);
        this.assertLogEntry(runner, "enableDualStreamMode", callTime, { enabled: true });
        runner.assert(
            enableDualStreamModeResult216 === 0,
            "enableDualStreamMode should return 0, got " + enableDualStreamModeResult216,
        );
        const releaseResult217 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetDualStreamMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDualStreamMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setDualStreamModeResult218 = await bridge.setDualStreamMode(1);
        this.assertLogEntry(runner, "setDualStreamMode", callTime, { mode: 1 });
        runner.assert(
            setDualStreamModeResult218 === 0,
            "setDualStreamMode should return 0, got " + setDualStreamModeResult218,
        );
        const releaseResult219 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSimulcastConfig(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSimulcastConfig ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSimulcastConfigResult220 = await bridge.setSimulcastConfig({
            configs: [],
            publish_fallback_enable: true,
        });
        this.assertLogEntry(runner, "setSimulcastConfig", callTime, { enableSimulcastVideoConfigCount: true });
        runner.assert(
            setSimulcastConfigResult220 === 0,
            "setSimulcastConfig should return 0, got " + setSimulcastConfigResult220,
        );
        const releaseResult221 = await bridge.release(true);
        await this.delay(50);
    }

    // 125-127. Audio frame parameters
    private async testSetRecordingAudioFrameParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRecordingAudioFrameParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRecordingAudioFrameParametersResult222 = await bridge.setRecordingAudioFrameParameters(
            44100,
            2,
            2,
            1024,
        );
        this.assertLogEntry(runner, "setRecordingAudioFrameParameters", callTime, {
            sampleRate: 44100,
            channel: 2,
            mode: 2,
            samplesPerCall: 1024,
        });
        runner.assert(
            setRecordingAudioFrameParametersResult222 === 0,
            "setRecordingAudioFrameParameters should return 0, got " + setRecordingAudioFrameParametersResult222,
        );
        const releaseResult223 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetPlaybackAudioFrameParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetPlaybackAudioFrameParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setPlaybackAudioFrameParametersResult224 = await bridge.setPlaybackAudioFrameParameters(
            48000,
            1,
            2,
            2048,
        );
        this.assertLogEntry(runner, "setPlaybackAudioFrameParameters", callTime, {
            sampleRate: 48000,
            channel: 1,
            mode: 2,
            samplesPerCall: 2048,
        });
        runner.assert(
            setPlaybackAudioFrameParametersResult224 === 0,
            "setPlaybackAudioFrameParameters should return 0, got " + setPlaybackAudioFrameParametersResult224,
        );
        const releaseResult225 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetMixedAudioFrameParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetMixedAudioFrameParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setMixedAudioFrameParametersResult226 = await bridge.setMixedAudioFrameParameters(32000, 1, 512);
        this.assertLogEntry(runner, "setMixedAudioFrameParameters", callTime, {
            sampleRate: 32000,
            channel: 1,
            samplesPerCall: 512,
        });
        runner.assert(
            setMixedAudioFrameParametersResult226 === 0,
            "setMixedAudioFrameParameters should return 0, got " + setMixedAudioFrameParametersResult226,
        );
        const releaseResult227 = await bridge.release(true);
        await this.delay(50);
    }

    // 128-131. Recording/Playback volume
    private async testAdjustRecordingSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustRecordingSignalVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustRecordingSignalVolumeResult228 = await bridge.adjustRecordingSignalVolume(80);
        this.assertLogEntry(runner, "adjustRecordingSignalVolume", callTime, { volume: 80 });
        runner.assert(
            adjustRecordingSignalVolumeResult228 === 0,
            "adjustRecordingSignalVolume should return 0, got " + adjustRecordingSignalVolumeResult228,
        );
        const releaseResult229 = await bridge.release(true);
        await this.delay(50);
    }

    private async testMuteRecordingSignal(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRecordingSignal ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteRecordingSignalResult230 = await bridge.muteRecordingSignal(true);
        this.assertLogEntry(runner, "muteRecordingSignal", callTime, { mute: true });
        runner.assert(
            muteRecordingSignalResult230 === 0,
            "muteRecordingSignal should return 0, got " + muteRecordingSignalResult230,
        );
        const releaseResult231 = await bridge.release(true);
        await this.delay(50);
    }

    private async testAdjustPlaybackSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustPlaybackSignalVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustPlaybackSignalVolumeResult232 = await bridge.adjustPlaybackSignalVolume(90);
        this.assertLogEntry(runner, "adjustPlaybackSignalVolume", callTime, { volume: 90 });
        runner.assert(
            adjustPlaybackSignalVolumeResult232 === 0,
            "adjustPlaybackSignalVolume should return 0, got " + adjustPlaybackSignalVolumeResult232,
        );
        const releaseResult233 = await bridge.release(true);
        await this.delay(50);
    }

    private async testAdjustUserPlaybackSignalVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustUserPlaybackSignalVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustUserPlaybackSignalVolumeResult234 = await bridge.adjustUserPlaybackSignalVolume(77, 50);
        this.assertLogEntry(runner, "adjustUserPlaybackSignalVolume", callTime, { uid: 77, volume: 50 });
        runner.assert(
            adjustUserPlaybackSignalVolumeResult234 === 0,
            "adjustUserPlaybackSignalVolume should return 0, got " + adjustUserPlaybackSignalVolumeResult234,
        );
        const releaseResult235 = await bridge.release(true);
        await this.delay(50);
    }

    // 132-133. Fallback / High priority
    private async testSetRemoteSubscribeFallbackOption(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteSubscribeFallbackOption ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteSubscribeFallbackOptionResult236 = await bridge.setRemoteSubscribeFallbackOption(2);
        this.assertLogEntry(runner, "setRemoteSubscribeFallbackOption", callTime, { option: 2 });
        runner.assert(
            setRemoteSubscribeFallbackOptionResult236 === 0,
            "setRemoteSubscribeFallbackOption should return 0, got " + setRemoteSubscribeFallbackOptionResult236,
        );
        const releaseResult237 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetHighPriorityUserList(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHighPriorityUserList ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setHighPriorityUserListResult238 = await (bridge as any).setHighPriorityUserList([111, 222], 1);
        this.assertLogEntry(runner, "setHighPriorityUserList", callTime, {
            uidList: [111, 222],
            uidNum: 2,
            option: 1,
        });
        runner.assert(
            setHighPriorityUserListResult238 === 0,
            "setHighPriorityUserList should return 0, got " + setHighPriorityUserListResult238,
        );
        const releaseResult239 = await bridge.release(true);
        await this.delay(50);
    }

    // 134-136. Loopback & In-ear monitoring
    private async testEnableLoopbackRecording(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLoopbackRecording ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableLoopbackRecordingResult240 = await bridge.enableLoopbackRecording(true, "Built-in Output");
        this.assertLogEntry(runner, "enableLoopbackRecording", callTime, {
            enabled: true,
            deviceName: "Built-in Output",
        });
        runner.assert(
            enableLoopbackRecordingResult240 === 0,
            "enableLoopbackRecording should return 0, got " + enableLoopbackRecordingResult240,
        );
        const releaseResult241 = await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableInEarMonitoring(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableInEarMonitoring ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableInEarMonitoringResult242 = await bridge.enableInEarMonitoring(true, 0);
        this.assertLogEntry(runner, "enableInEarMonitoring", callTime, { enabled: true, includeAudioFilters: 0 });
        runner.assert(
            enableInEarMonitoringResult242 === 0,
            "enableInEarMonitoring should return 0, got " + enableInEarMonitoringResult242,
        );
        const releaseResult243 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetInEarMonitoringVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetInEarMonitoringVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setInEarMonitoringVolumeResult244 = await bridge.setInEarMonitoringVolume(70);
        this.assertLogEntry(runner, "setInEarMonitoringVolume", callTime, { volume: 70 });
        runner.assert(
            setInEarMonitoringVolumeResult244 === 0,
            "setInEarMonitoringVolume should return 0, got " + setInEarMonitoringVolumeResult244,
        );
        const releaseResult245 = await bridge.release(true);
        await this.delay(50);
    }

    // 137. setCameraCapturerConfiguration(config)
    private async testSetCameraCapturerConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraCapturerConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraCapturerConfigurationResult246 = await bridge.setCameraCapturerConfiguration({
            cameraDirection: 1,
            format: { width: 1280, height: 720, fps: 30 },
        } as any);
        this.assertLogEntry(runner, "setCameraCapturerConfiguration", callTime, {
            cameraDirection: 0,
            format_width: 1280,
            format_height: 720,
            format_fps: 30,
        });
        runner.assert(
            setCameraCapturerConfigurationResult246 === 0,
            "setCameraCapturerConfiguration should return 0, got " + setCameraCapturerConfigurationResult246,
        );
        const releaseResult247 = await bridge.release(true);
        await this.delay(50);
    }

    // 138. createCustomVideoTrack() - SKIP: returns number (track ID), no log

    // 139. destroyCustomVideoTrack(video_track_id) - SKIP: no JSB binding for this function
    // 140-148. Camera controls
    private async testSetCameraZoomFactor(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraZoomFactor ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraZoomFactorResult248 = await bridge.setCameraZoomFactor(2.5);
        this.assertLogEntry(runner, "setCameraZoomFactor", callTime, { factor: 2.5 });
        runner.assert(
            setCameraZoomFactorResult248 === 0,
            "setCameraZoomFactor should return 0, got " + setCameraZoomFactorResult248,
        );
        const releaseResult249 = await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableFaceDetection(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableFaceDetection ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableFaceDetectionResult250 = await bridge.enableFaceDetection(true);
        this.assertLogEntry(runner, "enableFaceDetection", callTime, { enabled: true });
        runner.assert(
            enableFaceDetectionResult250 === 0,
            "enableFaceDetection should return 0, got " + enableFaceDetectionResult250,
        );
        const releaseResult251 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraFocusPositionInPreview(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraFocusPositionInPreview ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraFocusPositionInPreviewResult252 = await bridge.setCameraFocusPositionInPreview(0.5, 0.5);
        this.assertLogEntry(runner, "setCameraFocusPositionInPreview", callTime, { positionX: 0.5, positionY: 0.5 });
        runner.assert(
            setCameraFocusPositionInPreviewResult252 === 0,
            "setCameraFocusPositionInPreview should return 0, got " + setCameraFocusPositionInPreviewResult252,
        );
        const releaseResult253 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraTorchOn(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraTorchOn ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraTorchOnResult254 = await bridge.setCameraTorchOn(true);
        this.assertLogEntry(runner, "setCameraTorchOn", callTime, { isOn: true });
        runner.assert(
            setCameraTorchOnResult254 === 0,
            "setCameraTorchOn should return 0, got " + setCameraTorchOnResult254,
        );
        const releaseResult255 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraAutoFocusFaceModeEnabled(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraAutoFocusFaceModeEnabled ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraAutoFocusFaceModeEnabledResult256 = await bridge.setCameraAutoFocusFaceModeEnabled(true);
        this.assertLogEntry(runner, "setCameraAutoFocusFaceModeEnabled", callTime, { enabled: true });
        runner.assert(
            setCameraAutoFocusFaceModeEnabledResult256 === 0,
            "setCameraAutoFocusFaceModeEnabled should return 0, got " + setCameraAutoFocusFaceModeEnabledResult256,
        );
        const releaseResult257 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraExposurePosition(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraExposurePosition ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraExposurePositionResult258 = await bridge.setCameraExposurePosition(0.3, 0.7);
        this.assertLogEntry(runner, "setCameraExposurePosition", callTime, {
            positionXinView: 0.3,
            positionYinView: 0.7,
        });
        runner.assert(
            setCameraExposurePositionResult258 === 0,
            "setCameraExposurePosition should return 0, got " + setCameraExposurePositionResult258,
        );
        const releaseResult259 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraExposureFactor(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraExposureFactor ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraExposureFactorResult260 = await bridge.setCameraExposureFactor(1.5);
        this.assertLogEntry(runner, "setCameraExposureFactor", callTime, { factor: 1.5 });
        runner.assert(
            setCameraExposureFactorResult260 === 0,
            "setCameraExposureFactor should return 0, got " + setCameraExposureFactorResult260,
        );
        const releaseResult261 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraAutoExposureFaceModeEnabled(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraAutoExposureFaceModeEnabled ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraAutoExposureFaceModeEnabledResult262 = await bridge.setCameraAutoExposureFaceModeEnabled(false);
        this.assertLogEntry(runner, "setCameraAutoExposureFaceModeEnabled", callTime, { enabled: false });
        runner.assert(
            setCameraAutoExposureFaceModeEnabledResult262 === 0,
            "setCameraAutoExposureFaceModeEnabled should return 0, got " +
                setCameraAutoExposureFaceModeEnabledResult262,
        );
        const releaseResult263 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraStabilizationMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraStabilizationMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraStabilizationModeResult264 = await bridge.setCameraStabilizationMode(1);
        this.assertLogEntry(runner, "setCameraStabilizationMode", callTime, { mode: 1 });
        runner.assert(
            setCameraStabilizationModeResult264 === 0,
            "setCameraStabilizationMode should return 0, got " + setCameraStabilizationModeResult264,
        );
        const releaseResult265 = await bridge.release(true);
        await this.delay(50);
    }

    // 149-152. Audio route & camera center stage
    private async testSetDefaultAudioRouteToSpeakerphone(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDefaultAudioRouteToSpeakerphone ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setDefaultAudioRouteToSpeakerphoneResult266 = await bridge.setDefaultAudioRouteToSpeakerphone(true);
        this.assertLogEntry(runner, "setDefaultAudioRouteToSpeakerphone", callTime, { defaultToSpeaker: true });
        runner.assert(
            setDefaultAudioRouteToSpeakerphoneResult266 === 0,
            "setDefaultAudioRouteToSpeakerphone should return 0, got " + setDefaultAudioRouteToSpeakerphoneResult266,
        );
        const releaseResult267 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetEnableSpeakerphone(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetEnableSpeakerphone ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setEnableSpeakerphoneResult268 = await bridge.setEnableSpeakerphone(true);
        this.assertLogEntry(runner, "setEnableSpeakerphone", callTime, { speakerOn: true });
        runner.assert(
            setEnableSpeakerphoneResult268 === 0,
            "setEnableSpeakerphone should return 0, got " + setEnableSpeakerphoneResult268,
        );
        const releaseResult269 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetRouteInCommunicationMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRouteInCommunicationMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRouteInCommunicationModeResult270 = await bridge.setRouteInCommunicationMode(1);
        this.assertLogEntry(runner, "setRouteInCommunicationMode", callTime, { route: 1 });
        runner.assert(
            setRouteInCommunicationModeResult270 === 0,
            "setRouteInCommunicationMode should return 0, got " + setRouteInCommunicationModeResult270,
        );
        const releaseResult271 = await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableCameraCenterStage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableCameraCenterStage ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableCameraCenterStageResult272 = await bridge.enableCameraCenterStage(true);
        this.assertLogEntry(runner, "enableCameraCenterStage", callTime, { enabled: true });
        runner.assert(
            enableCameraCenterStageResult272 === 0,
            "enableCameraCenterStage should return 0, got " + enableCameraCenterStageResult272,
        );
        const releaseResult273 = await bridge.release(true);
        await this.delay(50);
    }

    // 153-160. Screen capture
    private async testStartScreenCaptureByDisplayId(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartScreenCaptureByDisplayId ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startScreenCaptureByDisplayIdResult274 = await bridge.startScreenCaptureByDisplayId(
            12345,
            { x: 0, y: 0, width: 0, height: 0 },
            {
                dimensions: { width: 1920, height: 1080 },
                frameRate: 15,
                bitrate: 1000,
                captureMouseCursor: true,
                windowFocus: false,
            } as any,
        );
        this.assertLogEntry(runner, "startScreenCaptureByDisplayId", callTime, {
            displayId: 12345,
            regionRect_x: 0,
            regionRect_y: 0,
            regionRect_width: 0,
            regionRect_height: 0,
        });
        runner.assert(
            startScreenCaptureByDisplayIdResult274 === 0,
            "startScreenCaptureByDisplayId should return 0, got " + startScreenCaptureByDisplayIdResult274,
        );
        const releaseResult275 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStartScreenCaptureByWindowId(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartScreenCaptureByWindowId ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startScreenCaptureByWindowIdResult276 = await bridge.startScreenCaptureByWindowId(
            67890,
            { x: 10, y: 20, width: 300, height: 200 },
            {
                dimensions: { width: 1280, height: 720 },
                frameRate: 30,
                bitrate: 2000,
                captureMouseCursor: false,
                windowFocus: true,
            } as any,
        );
        this.assertLogEntry(runner, "startScreenCaptureByWindowId", callTime, {
            windowId: 67890,
            regionRect_x: 10,
            regionRect_y: 20,
            regionRect_width: 300,
            regionRect_height: 200,
        });
        runner.assert(
            startScreenCaptureByWindowIdResult276 === 0,
            "startScreenCaptureByWindowId should return 0, got " + startScreenCaptureByWindowIdResult276,
        );
        const releaseResult277 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetScreenCaptureContentHint(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureContentHint ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setScreenCaptureContentHintResult278 = await bridge.setScreenCaptureContentHint(1);
        this.assertLogEntry(runner, "setScreenCaptureContentHint", callTime, { contentHint: 1 });
        runner.assert(
            setScreenCaptureContentHintResult278 === 0,
            "setScreenCaptureContentHint should return 0, got " + setScreenCaptureContentHintResult278,
        );
        const releaseResult279 = await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateScreenCaptureRegion(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateScreenCaptureRegion ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateScreenCaptureRegionResult280 = await bridge.updateScreenCaptureRegion({
            x: 100,
            y: 200,
            width: 500,
            height: 400,
        });
        this.assertLogEntry(runner, "updateScreenCaptureRegion", callTime, {
            x: 100,
            y: 200,
            width: 500,
            height: 400,
        });
        runner.assert(
            updateScreenCaptureRegionResult280 === 0,
            "updateScreenCaptureRegion should return 0, got " + updateScreenCaptureRegionResult280,
        );
        const releaseResult281 = await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateScreenCaptureParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateScreenCaptureParameters ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateScreenCaptureParametersResult282 = await bridge.updateScreenCaptureParameters({
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
        runner.assert(
            updateScreenCaptureParametersResult282 === 0,
            "updateScreenCaptureParameters should return 0, got " + updateScreenCaptureParametersResult282,
        );
        const releaseResult283 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStartScreenCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartScreenCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startScreenCaptureResult284 = await bridge.startScreenCapture(2, {
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
        runner.assert(
            startScreenCaptureResult284 === 0,
            "startScreenCapture should return 0, got " + startScreenCaptureResult284,
        );
        const releaseResult285 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStopScreenCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopScreenCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopScreenCaptureResult286 = await bridge.stopScreenCapture();
        this.assertLogEntry(runner, "stopScreenCapture", callTime, {});
        runner.assert(
            stopScreenCaptureResult286 === 0,
            "stopScreenCapture should return 0, got " + stopScreenCaptureResult286,
        );
        const releaseResult287 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetScreenCaptureScenario(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureScenario ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setScreenCaptureScenarioResult288 = await bridge.setScreenCaptureScenario(1);
        this.assertLogEntry(runner, "setScreenCaptureScenario", callTime, { screenScenario: 1 });
        runner.assert(
            setScreenCaptureScenarioResult288 === 0,
            "setScreenCaptureScenario should return 0, got " + setScreenCaptureScenarioResult288,
        );
        const releaseResult289 = await bridge.release(true);
        await this.delay(50);
    }

    // 161-162. rate/complain
    private async testRate(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRate ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const rateResult290 = await bridge.rate("call_abc123", 5, "Excellent quality");
        this.assertLogEntry(runner, "rate", callTime, {
            callId: "call_abc123",
            rating: 5,
            description: "Excellent quality",
        });
        runner.assert(rateResult290 === 0, "rate should return 0, got " + rateResult290);
        const releaseResult291 = await bridge.release(true);
        await this.delay(50);
    }

    private async testComplain(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testComplain ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const complainResult292 = await bridge.complain("call_abc123", "Audio lag issue");
        this.assertLogEntry(runner, "complain", callTime, {
            callId: "call_abc123",
            description: "Audio lag issue",
        });
        runner.assert(complainResult292 === 0, "complain should return 0, got " + complainResult292);
        const releaseResult293 = await bridge.release(true);
        await this.delay(50);
    }

    // 163-168. RTMP/Live transcoding
    private async testStartRtmpStreamWithoutTranscoding(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithoutTranscoding ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startRtmpStreamWithoutTranscodingResult294 = await bridge.startRtmpStreamWithoutTranscoding(
            "rtmp://live.example.com/stream",
        );
        this.assertLogEntry(runner, "startRtmpStreamWithoutTranscoding", callTime, {
            url: "rtmp://live.example.com/stream",
        });
        runner.assert(
            startRtmpStreamWithoutTranscodingResult294 === 0,
            "startRtmpStreamWithoutTranscoding should return 0, got " + startRtmpStreamWithoutTranscodingResult294,
        );
        const releaseResult295 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStartRtmpStreamWithTranscoding(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithTranscoding ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startRtmpStreamWithTranscodingResult296 = await bridge.startRtmpStreamWithTranscoding(
            "rtmp://live.example.com/stream",
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
        );
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
        runner.assert(
            startRtmpStreamWithTranscodingResult296 === 0,
            "startRtmpStreamWithTranscoding should return 0, got " + startRtmpStreamWithTranscodingResult296,
        );
        const releaseResult297 = await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateRtmpTranscoding(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateRtmpTranscoding ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateRtmpTranscodingResult298 = await bridge.updateRtmpTranscoding({
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
        runner.assert(
            updateRtmpTranscodingResult298 === 0,
            "updateRtmpTranscoding should return 0, got " + updateRtmpTranscodingResult298,
        );
        const releaseResult299 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStartLocalVideoTranscoder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartLocalVideoTranscoder ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startLocalVideoTranscoderResult300 = await bridge.startLocalVideoTranscoder({
            streamCount: 2,
            VideoInputStreams: [],
            videoOutputConfiguration: {} as any,
        } as any);
        this.assertLogEntry(runner, "startLocalVideoTranscoder", callTime, { config: { streamCount: 2 } });
        runner.assert(
            startLocalVideoTranscoderResult300 === 0,
            "startLocalVideoTranscoder should return 0, got " + startLocalVideoTranscoderResult300,
        );
        const releaseResult301 = await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateLocalTranscoderConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateLocalTranscoderConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateLocalTranscoderConfigurationResult302 = await bridge.updateLocalTranscoderConfiguration({
            streamCount: 3,
            VideoInputStreams: [],
            videoOutputConfiguration: {} as any,
        } as any);
        this.assertLogEntry(runner, "updateLocalTranscoderConfiguration", callTime, { config: { streamCount: 3 } });
        runner.assert(
            updateLocalTranscoderConfigurationResult302 === 0,
            "updateLocalTranscoderConfiguration should return 0, got " + updateLocalTranscoderConfigurationResult302,
        );
        const releaseResult303 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStopRtmpStream(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopRtmpStream ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopRtmpStreamResult304 = await bridge.stopRtmpStream("rtmp://live.example.com/stream");
        this.assertLogEntry(runner, "stopRtmpStream", callTime, { url: "rtmp://live.example.com/stream" });
        runner.assert(stopRtmpStreamResult304 === 0, "stopRtmpStream should return 0, got " + stopRtmpStreamResult304);
        const releaseResult305 = await bridge.release(true);
        await this.delay(50);
    }

    // 169. stopLocalVideoTranscoder()
    private async testStopLocalVideoTranscoder(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopLocalVideoTranscoder ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopLocalVideoTranscoderResult306 = await bridge.stopLocalVideoTranscoder();
        this.assertLogEntry(runner, "stopLocalVideoTranscoder", callTime, {});
        runner.assert(
            stopLocalVideoTranscoderResult306 === 0,
            "stopLocalVideoTranscoder should return 0, got " + stopLocalVideoTranscoderResult306,
        );
        const releaseResult307 = await bridge.release(true);
        await this.delay(50);
    }

    // 170-172. Local audio mixer
    private async testStartLocalAudioMixer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartLocalAudioMixer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startLocalAudioMixerResult308 = await bridge.startLocalAudioMixer({
            streamCount: 2,
            audioInputStreams: [],
            syncWithLocalMic: true,
        } as any);
        this.assertLogEntry(runner, "startLocalAudioMixer", callTime, {
            config: { streamCount: 2, syncWithLocalMic: true },
        });
        runner.assert(
            startLocalAudioMixerResult308 === 0,
            "startLocalAudioMixer should return 0, got " + startLocalAudioMixerResult308,
        );
        const releaseResult309 = await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateLocalAudioMixerConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateLocalAudioMixerConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateLocalAudioMixerConfigurationResult310 = await bridge.updateLocalAudioMixerConfiguration({
            streamCount: 4,
            audioInputStreams: [],
            syncWithLocalMic: false,
        } as any);
        this.assertLogEntry(runner, "updateLocalAudioMixerConfiguration", callTime, {
            config: { streamCount: 4, syncWithLocalMic: false },
        });
        runner.assert(
            updateLocalAudioMixerConfigurationResult310 === 0,
            "updateLocalAudioMixerConfiguration should return 0, got " + updateLocalAudioMixerConfigurationResult310,
        );
        const releaseResult311 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStopLocalAudioMixer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopLocalAudioMixer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopLocalAudioMixerResult312 = await bridge.stopLocalAudioMixer();
        this.assertLogEntry(runner, "stopLocalAudioMixer", callTime, {});
        runner.assert(
            stopLocalAudioMixerResult312 === 0,
            "stopLocalAudioMixer should return 0, got " + stopLocalAudioMixerResult312,
        );
        const releaseResult313 = await bridge.release(true);
        await this.delay(50);
    }

    // 173-176. Camera capture & orientation
    private async testStartCameraCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartCameraCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startCameraCaptureResult314 = await bridge.startCameraCapture(2, {
            cameraDirection: 1,
            format: { width: 1280, height: 720, fps: 30 },
        } as any);
        this.assertLogEntry(runner, "startCameraCapture", callTime, { sourceType: 2, cameraDirection: 0 });
        runner.assert(
            startCameraCaptureResult314 === 0,
            "startCameraCapture should return 0, got " + startCameraCaptureResult314,
        );
        const releaseResult315 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStopCameraCapture(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopCameraCapture ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopCameraCaptureResult316 = await bridge.stopCameraCapture(2);
        this.assertLogEntry(runner, "stopCameraCapture", callTime, { sourceType: 2 });
        runner.assert(
            stopCameraCaptureResult316 === 0,
            "stopCameraCapture should return 0, got " + stopCameraCaptureResult316,
        );
        const releaseResult317 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetCameraDeviceOrientation(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCameraDeviceOrientation ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCameraDeviceOrientationResult318 = await bridge.setCameraDeviceOrientation(2, 90);
        this.assertLogEntry(runner, "setCameraDeviceOrientation", callTime, { type: 2, orientation: 90 });
        runner.assert(
            setCameraDeviceOrientationResult318 === 0,
            "setCameraDeviceOrientation should return 0, got " + setCameraDeviceOrientationResult318,
        );
        const releaseResult319 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetScreenCaptureOrientation(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetScreenCaptureOrientation ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setScreenCaptureOrientationResult320 = await bridge.setScreenCaptureOrientation(4, 90);
        this.assertLogEntry(runner, "setScreenCaptureOrientation", callTime, { type: 4, orientation: 90 });
        runner.assert(
            setScreenCaptureOrientationResult320 === 0,
            "setScreenCaptureOrientation should return 0, got " + setScreenCaptureOrientationResult320,
        );
        const releaseResult321 = await bridge.release(true);
        await this.delay(50);
    }

    // 177. setRemoteUserPriority(uid, userPriority)
    private async testSetRemoteUserPriority(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteUserPriority ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteUserPriorityResult322 = await bridge.setRemoteUserPriority(42, 50);
        this.assertLogEntry(runner, "setRemoteUserPriority", callTime, { uid: 42, userPriority: 50 });
        runner.assert(
            setRemoteUserPriorityResult322 === 0,
            "setRemoteUserPriority should return 0, got " + setRemoteUserPriorityResult322,
        );
        const releaseResult323 = await bridge.release(true);
        await this.delay(50);
    }

    // 178. enableEncryption(enabled, config)
    private async testEnableEncryption(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableEncryption ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableEncryptionResult324 = await bridge.enableEncryption(true, {
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
        runner.assert(
            enableEncryptionResult324 === 0,
            "enableEncryption should return 0, got " + enableEncryptionResult324,
        );
        const releaseResult325 = await bridge.release(true);
        await this.delay(50);
    }

    // 179. createDataStream(reliable, ordered)
    private async testCreateDataStreamReliable(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testCreateDataStreamReliable ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const createDataStreamResult326 = await (bridge as any).createDataStream(true, false);
        this.assertLogEntry(runner, "createDataStream", callTime, { reliable: true, ordered: false });
        runner.assert(
            createDataStreamResult326.errorCode === 0,
            "createDataStream.errorCode should be 0, got " + createDataStreamResult326.errorCode,
        );
        runner.assert(
            createDataStreamResult326.streamId === 0,
            "createDataStream.streamId should be 0, got " + createDataStreamResult326.streamId,
        );
        const releaseResult327 = await bridge.release(true);
        await this.delay(50);
    }

    // 180. sendStreamMessage(streamId, data)
    private async testSendStreamMessage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendStreamMessage ---");
        const bridge = this.createBridgeAndInit();
        const data = new Uint8Array([97, 103]);
        const callTime = Date.now();
        const sendStreamMessageResult328 = await (bridge as any).sendStreamMessage(1, data.buffer);
        this.assertLogEntry(runner, "sendStreamMessage", callTime, { streamId: 1, data: "ag", length: 2 });
        runner.assert(
            sendStreamMessageResult328 === 0,
            "sendStreamMessage should return 0, got " + sendStreamMessageResult328,
        );
        const releaseResult329 = await bridge.release(true);
        await this.delay(50);
    }

    // 181. sendRdtMessage(uid, type, data) - SKIP: requires RdtStreamType enum
    // 182. sendMediaControlMessage(uid, data) - SKIP: no JSB binding

    // 183. addVideoWatermark(watermarkUrl, options)
    private async testAddVideoWatermark(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAddVideoWatermark ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const addVideoWatermarkResult330 = await bridge.addVideoWatermark("https://example.com/wm.png", {
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
        runner.assert(
            addVideoWatermarkResult330 === 0,
            "addVideoWatermark should return 0, got " + addVideoWatermarkResult330,
        );
        const releaseResult331 = await bridge.release(true);
        await this.delay(50);
    }

    // 184. removeVideoWatermark(id)
    private async testRemoveVideoWatermark(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRemoveVideoWatermark ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const removeVideoWatermarkResult332 = await bridge.removeVideoWatermark("watermark_abc");
        this.assertLogEntry(runner, "removeVideoWatermark", callTime, { id: "watermark_abc" });
        runner.assert(
            removeVideoWatermarkResult332 === 0,
            "removeVideoWatermark should return 0, got " + removeVideoWatermarkResult332,
        );
        const releaseResult333 = await bridge.release(true);
        await this.delay(50);
    }

    // 185. clearVideoWatermarks()
    private async testClearVideoWatermarks(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testClearVideoWatermarks ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const clearVideoWatermarksResult334 = await bridge.clearVideoWatermarks();
        this.assertLogEntry(runner, "clearVideoWatermarks", callTime, {});
        runner.assert(
            clearVideoWatermarksResult334 === 0,
            "clearVideoWatermarks should return 0, got " + clearVideoWatermarksResult334,
        );
        const releaseResult335 = await bridge.release(true);
        await this.delay(50);
    }

    // 186. pauseAudio() - SKIP: no parameters
    // 187. resumeAudio() - SKIP: no parameters

    // 188. enableWebSdkInteroperability(enabled)
    private async testEnableWebSdkInteroperability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableWebSdkInteroperability ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableWebSdkInteroperabilityResult336 = await bridge.enableWebSdkInteroperability(true);
        this.assertLogEntry(runner, "enableWebSdkInteroperability", callTime, { enabled: true });
        runner.assert(
            enableWebSdkInteroperabilityResult336 === 0,
            "enableWebSdkInteroperability should return 0, got " + enableWebSdkInteroperabilityResult336,
        );
        const releaseResult337 = await bridge.release(true);
        await this.delay(50);
    }

    // 189. sendCustomReportMessage(id, category, event, label, value)
    private async testSendCustomReportMessage(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendCustomReportMessage ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const sendCustomReportMessageResult338 = await bridge.sendCustomReportMessage(
            "report_id",
            "category1",
            "event1",
            "label1",
            42,
        );
        this.assertLogEntry(runner, "sendCustomReportMessage", callTime, {
            id: "report_id",
            category: "category1",
            event: "event1",
            label: "label1",
            value: 42,
        });
        runner.assert(
            sendCustomReportMessageResult338 === 0,
            "sendCustomReportMessage should return 0, got " + sendCustomReportMessageResult338,
        );
        const releaseResult339 = await bridge.release(true);
        await this.delay(50);
    }

    // 190. setAINSMode(enabled, mode)
    private async testSetAINSMode(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAINSMode ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAINSModeResult340 = await bridge.setAINSMode(true, 2);
        this.assertLogEntry(runner, "setAINSMode", callTime, { enabled: true, mode: 2 });
        runner.assert(setAINSModeResult340 === 0, "setAINSMode should return 0, got " + setAINSModeResult340);
        const releaseResult341 = await bridge.release(true);
        await this.delay(50);
    }

    // 191. registerLocalUserAccount(appId, userAccount)
    private async testRegisterLocalUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRegisterLocalUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const registerLocalUserAccountResult342 = await bridge.registerLocalUserAccount("myAppId", "myUserAccount");
        this.assertLogEntry(runner, "registerLocalUserAccount", callTime, {
            appId: "myAppId",
            userAccount: "myUserAccount",
        });
        runner.assert(
            registerLocalUserAccountResult342 === 0,
            "registerLocalUserAccount should return 0, got " + registerLocalUserAccountResult342,
        );
        const releaseResult343 = await bridge.release(true);
        await this.delay(50);
    }

    // 192. joinChannelWithUserAccount(token, channelId, userAccount)
    private async testJoinChannelWithUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannelWithUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const joinChannelWithUserAccountResult344 = await bridge.joinChannelWithUserAccount(
            "ucaToken",
            "ucaChannel",
            "ucaUser",
        );
        this.assertLogEntry(runner, "joinChannelWithUserAccount", callTime, {
            token: "ucaToken",
            channelId: "ucaChannel",
            userAccount: "ucaUser",
        });
        runner.assert(
            joinChannelWithUserAccountResult344 === 0,
            "joinChannelWithUserAccount should return 0, got " + joinChannelWithUserAccountResult344,
        );
        const releaseResult345 = await bridge.release(true);
        await this.delay(50);
    }

    // 193. startOrUpdateChannelMediaRelay(configuration) - SKIP: requires ChannelMediaRelayConfiguration

    // 194-196. Channel media relay controls
    private async testStopChannelMediaRelay(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopChannelMediaRelay ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopChannelMediaRelayResult346 = await bridge.stopChannelMediaRelay();
        this.assertLogEntry(runner, "stopChannelMediaRelay", callTime, {});
        runner.assert(
            stopChannelMediaRelayResult346 === 0,
            "stopChannelMediaRelay should return 0, got " + stopChannelMediaRelayResult346,
        );
        const releaseResult347 = await bridge.release(true);
        await this.delay(50);
    }

    private async testPauseAllChannelMediaRelay(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllChannelMediaRelay ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const pauseAllChannelMediaRelayResult348 = await bridge.pauseAllChannelMediaRelay();
        this.assertLogEntry(runner, "pauseAllChannelMediaRelay", callTime, {});
        runner.assert(
            pauseAllChannelMediaRelayResult348 === 0,
            "pauseAllChannelMediaRelay should return 0, got " + pauseAllChannelMediaRelayResult348,
        );
        const releaseResult349 = await bridge.release(true);
        await this.delay(50);
    }

    private async testResumeAllChannelMediaRelay(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllChannelMediaRelay ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const resumeAllChannelMediaRelayResult350 = await bridge.resumeAllChannelMediaRelay();
        this.assertLogEntry(runner, "resumeAllChannelMediaRelay", callTime, {});
        runner.assert(
            resumeAllChannelMediaRelayResult350 === 0,
            "resumeAllChannelMediaRelay should return 0, got " + resumeAllChannelMediaRelayResult350,
        );
        const releaseResult351 = await bridge.release(true);
        await this.delay(50);
    }

    // 197-201. Direct CDN streaming
    private async testSetDirectCdnStreamingAudioConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDirectCdnStreamingAudioConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setDirectCdnStreamingAudioConfigurationResult352 =
            await bridge.setDirectCdnStreamingAudioConfiguration(5);
        this.assertLogEntry(runner, "setDirectCdnStreamingAudioConfiguration", callTime, { profile: 5 });
        runner.assert(
            setDirectCdnStreamingAudioConfigurationResult352 === 0,
            "setDirectCdnStreamingAudioConfiguration should return 0, got " +
                setDirectCdnStreamingAudioConfigurationResult352,
        );
        const releaseResult353 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetDirectCdnStreamingVideoConfiguration(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDirectCdnStreamingVideoConfiguration ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setDirectCdnStreamingVideoConfigurationResult354 = await bridge.setDirectCdnStreamingVideoConfiguration({
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
        runner.assert(
            setDirectCdnStreamingVideoConfigurationResult354 === 0,
            "setDirectCdnStreamingVideoConfiguration should return 0, got " +
                setDirectCdnStreamingVideoConfigurationResult354,
        );
        const releaseResult355 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStartDirectCdnStreaming(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartDirectCdnStreaming ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startDirectCdnStreamingResult356 = await bridge.startDirectCdnStreaming(
            "rtmp://cdn.example.com/live",
            {} as any,
        );
        this.assertLogEntry(runner, "startDirectCdnStreaming", callTime, {
            publishUrl: "rtmp://cdn.example.com/live",
        });
        runner.assert(
            startDirectCdnStreamingResult356 === 0,
            "startDirectCdnStreaming should return 0, got " + startDirectCdnStreamingResult356,
        );
        const releaseResult357 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStopDirectCdnStreaming(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopDirectCdnStreaming ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopDirectCdnStreamingResult358 = await bridge.stopDirectCdnStreaming();
        this.assertLogEntry(runner, "stopDirectCdnStreaming", callTime, {});
        runner.assert(
            stopDirectCdnStreamingResult358 === 0,
            "stopDirectCdnStreaming should return 0, got " + stopDirectCdnStreamingResult358,
        );
        const releaseResult359 = await bridge.release(true);
        await this.delay(50);
    }

    private async testUpdateDirectCdnStreamingMediaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateDirectCdnStreamingMediaOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateDirectCdnStreamingMediaOptionsResult360 = await bridge.updateDirectCdnStreamingMediaOptions(
            {} as any,
        );
        this.assertLogEntry(runner, "updateDirectCdnStreamingMediaOptions", callTime, {});
        runner.assert(
            updateDirectCdnStreamingMediaOptionsResult360 === 0,
            "updateDirectCdnStreamingMediaOptions should return 0, got " +
                updateDirectCdnStreamingMediaOptionsResult360,
        );
        const releaseResult361 = await bridge.release(true);
        await this.delay(50);
    }

    // 202-204. Rhythm player
    private async testStartRhythmPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRhythmPlayer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startRhythmPlayerResult362 = await bridge.startRhythmPlayer("/sounds/beat1.mp3", "/sounds/beat2.mp3", {
            beatsPerMeasure: 4,
            beatsPerMinute: 120,
        } as any);
        this.assertLogEntry(runner, "startRhythmPlayer", callTime, {
            sound1: "/sounds/beat1.mp3",
            sound2: "/sounds/beat2.mp3",
            beatsPerMeasure: 4,
            beatsPerMinute: 120,
        });
        runner.assert(
            startRhythmPlayerResult362 === 0,
            "startRhythmPlayer should return 0, got " + startRhythmPlayerResult362,
        );
        const releaseResult363 = await bridge.release(true);
        await this.delay(50);
    }

    private async testStopRhythmPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopRhythmPlayer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopRhythmPlayerResult364 = await bridge.stopRhythmPlayer();
        this.assertLogEntry(runner, "stopRhythmPlayer", callTime, {});
        runner.assert(
            stopRhythmPlayerResult364 === 0,
            "stopRhythmPlayer should return 0, got " + stopRhythmPlayerResult364,
        );
        const releaseResult365 = await bridge.release(true);
        await this.delay(50);
    }

    private async testConfigRhythmPlayer(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testConfigRhythmPlayer ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const configRhythmPlayerResult366 = await bridge.configRhythmPlayer({
            beatsPerMeasure: 3,
            beatsPerMinute: 90,
        } as any);
        this.assertLogEntry(runner, "configRhythmPlayer", callTime, {
            beatsPerMeasure: 3,
            beatsPerMinute: 90,
        });
        runner.assert(
            configRhythmPlayerResult366 === 0,
            "configRhythmPlayer should return 0, got " + configRhythmPlayerResult366,
        );
        const releaseResult367 = await bridge.release(true);
        await this.delay(50);
    }

    // 205. takeSnapshot(uid, filePath)
    private async testTakeSnapshot(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testTakeSnapshot ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const takeSnapshotResult368 = await bridge.takeSnapshot(42, "/tmp/snapshot.png");
        this.assertLogEntry(runner, "takeSnapshot", callTime, { uid: 42, filePath: "/tmp/snapshot.png" });
        runner.assert(takeSnapshotResult368 === 0, "takeSnapshot should return 0, got " + takeSnapshotResult368);
        const releaseResult369 = await bridge.release(true);
        await this.delay(50);
    }

    // 206. enableContentInspect(enabled, config)
    private async testEnableContentInspect(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableContentInspect ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableContentInspectResult370 = await bridge.enableContentInspect(true, {
            moduleCount: 2,
            modules: [],
        } as any);
        this.assertLogEntry(runner, "enableContentInspect", callTime, {
            enabled: true,
            config: { moduleCount: 2 },
        });
        runner.assert(
            enableContentInspectResult370 === 0,
            "enableContentInspect should return 0, got " + enableContentInspectResult370,
        );
        const releaseResult371 = await bridge.release(true);
        await this.delay(50);
    }

    // 207-208. Custom audio volume
    private async testAdjustCustomAudioPublishVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustCustomAudioPublishVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustCustomAudioPublishVolumeResult372 = await bridge.adjustCustomAudioPublishVolume(5, 70);
        this.assertLogEntry(runner, "adjustCustomAudioPublishVolume", callTime, { trackId: 5, volume: 70 });
        runner.assert(
            adjustCustomAudioPublishVolumeResult372 === 0,
            "adjustCustomAudioPublishVolume should return 0, got " + adjustCustomAudioPublishVolumeResult372,
        );
        const releaseResult373 = await bridge.release(true);
        await this.delay(50);
    }

    private async testAdjustCustomAudioPlayoutVolume(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustCustomAudioPlayoutVolume ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustCustomAudioPlayoutVolumeResult374 = await bridge.adjustCustomAudioPlayoutVolume(3, 60);
        this.assertLogEntry(runner, "adjustCustomAudioPlayoutVolume", callTime, { trackId: 3, volume: 60 });
        runner.assert(
            adjustCustomAudioPlayoutVolumeResult374 === 0,
            "adjustCustomAudioPlayoutVolume should return 0, got " + adjustCustomAudioPlayoutVolumeResult374,
        );
        const releaseResult375 = await bridge.release(true);
        await this.delay(50);
    }

    // 209. setCloudProxy(proxyType)
    private async testSetCloudProxy(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetCloudProxy ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setCloudProxyResult376 = await bridge.setCloudProxy(1);
        this.assertLogEntry(runner, "setCloudProxy", callTime, { proxyType: 1 });
        runner.assert(setCloudProxyResult376 === 0, "setCloudProxy should return 0, got " + setCloudProxyResult376);
        const releaseResult377 = await bridge.release(true);
        await this.delay(50);
    }

    // 210. setLocalAccessPoint(config)
    private async testSetLocalAccessPoint(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetLocalAccessPoint ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setLocalAccessPointResult378 = await bridge.setLocalAccessPoint({} as any);
        this.assertLogEntry(runner, "setLocalAccessPoint", callTime, {});
        runner.assert(
            setLocalAccessPointResult378 === 0,
            "setLocalAccessPoint should return 0, got " + setLocalAccessPointResult378,
        );
        const releaseResult379 = await bridge.release(true);
        await this.delay(50);
    }

    // 211. setAdvancedAudioOptions(options, sourceType)
    private async testSetAdvancedAudioOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAdvancedAudioOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAdvancedAudioOptionsResult380 = await bridge.setAdvancedAudioOptions(
            { audioProcessingChannels: 2 } as any,
            0,
        );
        this.assertLogEntry(runner, "setAdvancedAudioOptions", callTime, {
            audioProcessingChannels: 2,
            sourceType: 0,
        });
        runner.assert(
            setAdvancedAudioOptionsResult380 === 0,
            "setAdvancedAudioOptions should return 0, got " + setAdvancedAudioOptionsResult380,
        );
        const releaseResult381 = await bridge.release(true);
        await this.delay(50);
    }

    // 212. setAVSyncSource(channelId, uid)
    private async testSetAVSyncSource(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetAVSyncSource ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setAVSyncSourceResult382 = await bridge.setAVSyncSource("syncChannel", 777);
        this.assertLogEntry(runner, "setAVSyncSource", callTime, { channelId: "syncChannel", uid: 777 });
        runner.assert(
            setAVSyncSourceResult382 === 0,
            "setAVSyncSource should return 0, got " + setAVSyncSourceResult382,
        );
        const releaseResult383 = await bridge.release(true);
        await this.delay(50);
    }

    // 213. enableVideoImageSource(enable, options)
    private async testEnableVideoImageSource(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableVideoImageSource ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableVideoImageSourceResult384 = await bridge.enableVideoImageSource(true, {
            imageUrl: "https://example.com/image.png",
            fps: 15,
            mirrorMode: 0,
        });
        this.assertLogEntry(runner, "enableVideoImageSource", callTime, {
            enable: true,
            options: { imageUrl: "https://example.com/image.png", fps: 15, mirrorMode: 0 },
        });
        runner.assert(
            enableVideoImageSourceResult384 === 0,
            "enableVideoImageSource should return 0, got " + enableVideoImageSourceResult384,
        );
        const releaseResult385 = await bridge.release(true);
        await this.delay(50);
    }

    // 214. setParameters(parameters)
    private async testSetParameters(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParameters ---");
        const initTime = Date.now();
        const bridge = this.createBridgeAndInit();
        this.assertLogEntry(runner, "setParameters", initTime, {
            parameters: '{"rtc.set_app_type": 10}',
        });
        const callTime = Date.now();
        const setParametersResult386 = await bridge.setParameters('{"che.audio.enable.aec":true}');
        this.assertLogEntry(runner, "setParameters", callTime, {
            parameters: '{"che.audio.enable.aec":true}',
        });
        runner.assert(setParametersResult386 === 0, "setParameters should return 0, got " + setParametersResult386);
        const releaseResult387 = await bridge.release(true);
        await this.delay(50);
    }

    // 215. startMediaRenderingTracing()
    private async testStartMediaRenderingTracing(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartMediaRenderingTracing ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startMediaRenderingTracingResult388 = await bridge.startMediaRenderingTracing();
        this.assertLogEntry(runner, "startMediaRenderingTracing", callTime, {});
        runner.assert(
            startMediaRenderingTracingResult388 === 0,
            "startMediaRenderingTracing should return 0, got " + startMediaRenderingTracingResult388,
        );
        const releaseResult389 = await bridge.release(true);
        await this.delay(50);
    }

    // 216. enableInstantMediaRendering()
    private async testEnableInstantMediaRendering(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableInstantMediaRendering ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableInstantMediaRenderingResult390 = await bridge.enableInstantMediaRendering();
        this.assertLogEntry(runner, "enableInstantMediaRendering", callTime, {});
        runner.assert(
            enableInstantMediaRenderingResult390 === 0,
            "enableInstantMediaRendering should return 0, got " + enableInstantMediaRenderingResult390,
        );
        const releaseResult391 = await bridge.release(true);
        await this.delay(50);
    }

    // 217. sendAudioMetadata(metadata)
    private async testSendAudioMetadata(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendAudioMetadata ---");
        const bridge = this.createBridgeAndInit();
        const metadata = new Uint8Array([97, 103]);
        const callTime = Date.now();
        const sendAudioMetadataResult392 = await bridge.sendAudioMetadata(metadata.buffer);
        this.assertLogEntry(runner, "sendAudioMetadata", callTime, { metadata: "ag", length: 2 });
        runner.assert(
            sendAudioMetadataResult392 === 0,
            "sendAudioMetadata should return 0, got " + sendAudioMetadataResult392,
        );
        const releaseResult393 = await bridge.release(true);
        await this.delay(50);
    }

    // 218. queryHDRCapability(videoModule)
    private async testQueryHDRCapability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryHDRCapability ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const queryHDRCapabilityResult392 = await bridge.queryHDRCapability(1);
        this.assertLogEntry(runner, "queryHDRCapability", callTime, { videoModule: 1 });
        runner.assert(
            queryHDRCapabilityResult392.errorCode === 0,
            "queryHDRCapability.errorCode should be 0, got " + queryHDRCapabilityResult392.errorCode,
        );
        runner.assert(
            typeof queryHDRCapabilityResult392.capability === "number",
            "queryHDRCapability.capability should be a number, got " + typeof queryHDRCapabilityResult392.capability,
        );
        const releaseResult393 = await bridge.release(true);
        await this.delay(50);
    }

    // ──────────────────────────── IRtcEngineEx Tests ────────────────────────────

    // 219. setParametersEx(connection, parameters)
    private async testSetParametersEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParametersEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setParametersExResult394 = await bridge.setParametersEx(
            { channelId: "testChannel", localUid: 42 },
            '{"che.audio.enable.aec":true}',
        );
        this.assertLogEntry(runner, "setParametersEx", callTime, {
            parameters: '{"che.audio.enable.aec":true}',
            connection: { channelId: "testChannel", localUid: 42 },
        });
        runner.assert(
            setParametersExResult394 === 0,
            "setParametersEx should return 0, got " + setParametersExResult394,
        );
        const releaseResult395 = await bridge.release(true);
        await this.delay(50);
    }

    // 220. joinChannelEx(token, connection, options)
    private async testJoinChannelEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testJoinChannelEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const joinChannelExResult396 = await bridge.joinChannelEx(
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
        runner.assert(joinChannelExResult396 === 0, "joinChannelEx should return 0, got " + joinChannelExResult396);
        const releaseResult397 = await bridge.release(true);
        await this.delay(50);
    }

    // 221. leaveChannelEx(connection)
    private async testLeaveChannelEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannelEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const leaveChannelExResult398 = await bridge.leaveChannelEx({ channelId: "leaveExChannel", localUid: 500 });
        this.assertLogEntry(runner, "leaveChannelEx", callTime, {
            connection: { channelId: "leaveExChannel", localUid: 500 },
        });
        runner.assert(leaveChannelExResult398 === 0, "leaveChannelEx should return 0, got " + leaveChannelExResult398);
        const releaseResult399 = await bridge.release(true);
        await this.delay(50);
    }

    // 222. leaveChannelEx(connection, options)
    private async testLeaveChannelWithOptionsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testLeaveChannelWithOptionsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const leaveChannelExResult400 = await bridge.leaveChannelEx({ channelId: "leaveExOpt", localUid: 501 }, {
            stopMicrophoneRecording: true,
        } as any);
        this.assertLogEntry(runner, "leaveChannelEx", callTime, {
            connection: { channelId: "leaveExOpt", localUid: 501 },
        });
        runner.assert(leaveChannelExResult400 === 0, "leaveChannelEx should return 0, got " + leaveChannelExResult400);
        const releaseResult401 = await bridge.release(true);
        await this.delay(50);
    }

    // 223. updateChannelMediaOptionsEx(options, connection)
    private async testUpdateChannelMediaOptionsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateChannelMediaOptionsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateChannelMediaOptionsExResult402 = await bridge.updateChannelMediaOptionsEx(
            { autoSubscribeAudio: false, publishCameraTrack: true, clientRoleType: 2 },
            { channelId: "updExChannel", localUid: 300 },
        );
        this.assertLogEntry(runner, "updateChannelMediaOptionsEx", callTime, {
            options: { autoSubscribeAudio: false, publishCameraTrack: true, clientRoleType: 2 },
            connection: { channelId: "updExChannel", localUid: 300 },
        });
        runner.assert(
            updateChannelMediaOptionsExResult402 === 0,
            "updateChannelMediaOptionsEx should return 0, got " + updateChannelMediaOptionsExResult402,
        );
        const releaseResult403 = await bridge.release(true);
        await this.delay(50);
    }

    // 224. setVideoEncoderConfigurationEx(config, connection)
    private async testSetVideoEncoderConfigurationEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetVideoEncoderConfigurationEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setVideoEncoderConfigurationExResult404 = await bridge.setVideoEncoderConfigurationEx(
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
        runner.assert(
            setVideoEncoderConfigurationExResult404 === 0,
            "setVideoEncoderConfigurationEx should return 0, got " + setVideoEncoderConfigurationExResult404,
        );
        const releaseResult405 = await bridge.release(true);
        await this.delay(50);
    }

    // 225. muteRemoteAudioStreamEx(uid, mute, connection)
    private async testMuteRemoteAudioStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteAudioStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteRemoteAudioStreamExResult406 = await bridge.muteRemoteAudioStreamEx(42, true, {
            channelId: "muteExCh",
            localUid: 700,
        });
        this.assertLogEntry(runner, "muteRemoteAudioStreamEx", callTime, {
            uid: 42,
            mute: true,
            connection: { channelId: "muteExCh", localUid: 700 },
        });
        runner.assert(
            muteRemoteAudioStreamExResult406 === 0,
            "muteRemoteAudioStreamEx should return 0, got " + muteRemoteAudioStreamExResult406,
        );
        const releaseResult407 = await bridge.release(true);
        await this.delay(50);
    }

    // 226. muteRemoteVideoStreamEx(uid, mute, connection)
    private async testMuteRemoteVideoStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRemoteVideoStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteRemoteVideoStreamExResult408 = await bridge.muteRemoteVideoStreamEx(55, false, {
            channelId: "muteVExCh",
            localUid: 701,
        });
        this.assertLogEntry(runner, "muteRemoteVideoStreamEx", callTime, {
            uid: 55,
            mute: false,
            connection: { channelId: "muteVExCh", localUid: 701 },
        });
        runner.assert(
            muteRemoteVideoStreamExResult408 === 0,
            "muteRemoteVideoStreamEx should return 0, got " + muteRemoteVideoStreamExResult408,
        );
        const releaseResult409 = await bridge.release(true);
        await this.delay(50);
    }

    // 227. setRemoteVideoStreamTypeEx(uid, streamType, connection)
    private async testSetRemoteVideoStreamTypeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoStreamTypeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteVideoStreamTypeExResult410 = await bridge.setRemoteVideoStreamTypeEx(66, 1, {
            channelId: "streamExCh",
            localUid: 702,
        });
        this.assertLogEntry(runner, "setRemoteVideoStreamTypeEx", callTime, {
            uid: 66,
            streamType: 1,
            connection: { channelId: "streamExCh", localUid: 702 },
        });
        runner.assert(
            setRemoteVideoStreamTypeExResult410 === 0,
            "setRemoteVideoStreamTypeEx should return 0, got " + setRemoteVideoStreamTypeExResult410,
        );
        const releaseResult411 = await bridge.release(true);
        await this.delay(50);
    }

    // 228. muteLocalAudioStreamEx(mute, connection)
    private async testMuteLocalAudioStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalAudioStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteLocalAudioStreamExResult412 = await bridge.muteLocalAudioStreamEx(true, {
            channelId: "muteLExCh",
            localUid: 703,
        });
        this.assertLogEntry(runner, "muteLocalAudioStreamEx", callTime, {
            mute: true,
            connection: { channelId: "muteLExCh", localUid: 703 },
        });
        runner.assert(
            muteLocalAudioStreamExResult412 === 0,
            "muteLocalAudioStreamEx should return 0, got " + muteLocalAudioStreamExResult412,
        );
        const releaseResult413 = await bridge.release(true);
        await this.delay(50);
    }

    // 229. muteLocalVideoStreamEx(mute, connection)
    private async testMuteLocalVideoStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteLocalVideoStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteLocalVideoStreamExResult414 = await bridge.muteLocalVideoStreamEx(false, {
            channelId: "muteLVExCh",
            localUid: 704,
        });
        this.assertLogEntry(runner, "muteLocalVideoStreamEx", callTime, {
            mute: false,
            connection: { channelId: "muteLVExCh", localUid: 704 },
        });
        runner.assert(
            muteLocalVideoStreamExResult414 === 0,
            "muteLocalVideoStreamEx should return 0, got " + muteLocalVideoStreamExResult414,
        );
        const releaseResult415 = await bridge.release(true);
        await this.delay(50);
    }

    // 230. muteAllRemoteAudioStreamsEx(mute, connection)
    private async testMuteAllRemoteAudioStreamsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteAudioStreamsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteAllRemoteAudioStreamsExResult416 = await bridge.muteAllRemoteAudioStreamsEx(true, {
            channelId: "muteAllAExCh",
            localUid: 705,
        });
        this.assertLogEntry(runner, "muteAllRemoteAudioStreamsEx", callTime, {
            mute: true,
            connection: { channelId: "muteAllAExCh", localUid: 705 },
        });
        runner.assert(
            muteAllRemoteAudioStreamsExResult416 === 0,
            "muteAllRemoteAudioStreamsEx should return 0, got " + muteAllRemoteAudioStreamsExResult416,
        );
        const releaseResult417 = await bridge.release(true);
        await this.delay(50);
    }

    // 231. muteAllRemoteVideoStreamsEx(mute, connection)
    private async testMuteAllRemoteVideoStreamsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteAllRemoteVideoStreamsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteAllRemoteVideoStreamsExResult418 = await bridge.muteAllRemoteVideoStreamsEx(false, {
            channelId: "muteAllVExCh",
            localUid: 706,
        });
        this.assertLogEntry(runner, "muteAllRemoteVideoStreamsEx", callTime, {
            mute: false,
            connection: { channelId: "muteAllVExCh", localUid: 706 },
        });
        runner.assert(
            muteAllRemoteVideoStreamsExResult418 === 0,
            "muteAllRemoteVideoStreamsEx should return 0, got " + muteAllRemoteVideoStreamsExResult418,
        );
        const releaseResult419 = await bridge.release(true);
        await this.delay(50);
    }

    // 232-235. Subscribe blocklist/allowlist Ex
    private async testSetSubscribeAudioBlocklistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioBlocklistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeAudioBlocklistExResult420 = await bridge.setSubscribeAudioBlocklistEx([11, 22], {
            channelId: "blkExCh",
            localUid: 710,
        });
        this.assertLogEntry(runner, "setSubscribeAudioBlocklistEx", callTime, {
            uidList: [11, 22],
            uidNumber: 2,
            connection: { channelId: "blkExCh", localUid: 710 },
        });
        runner.assert(
            setSubscribeAudioBlocklistExResult420 === 0,
            "setSubscribeAudioBlocklistEx should return 0, got " + setSubscribeAudioBlocklistExResult420,
        );
        const releaseResult421 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeAudioAllowlistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeAudioAllowlistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeAudioAllowlistExResult422 = await bridge.setSubscribeAudioAllowlistEx([33, 44], {
            channelId: "alwExCh",
            localUid: 711,
        });
        this.assertLogEntry(runner, "setSubscribeAudioAllowlistEx", callTime, {
            uidList: [33, 44],
            uidNumber: 2,
            connection: { channelId: "alwExCh", localUid: 711 },
        });
        runner.assert(
            setSubscribeAudioAllowlistExResult422 === 0,
            "setSubscribeAudioAllowlistEx should return 0, got " + setSubscribeAudioAllowlistExResult422,
        );
        const releaseResult423 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoBlocklistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoBlocklistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeVideoBlocklistExResult424 = await bridge.setSubscribeVideoBlocklistEx([55, 66], {
            channelId: "vblkExCh",
            localUid: 712,
        });
        this.assertLogEntry(runner, "setSubscribeVideoBlocklistEx", callTime, {
            uidList: [55, 66],
            uidNumber: 2,
            connection: { channelId: "vblkExCh", localUid: 712 },
        });
        runner.assert(
            setSubscribeVideoBlocklistExResult424 === 0,
            "setSubscribeVideoBlocklistEx should return 0, got " + setSubscribeVideoBlocklistExResult424,
        );
        const releaseResult425 = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetSubscribeVideoAllowlistEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSubscribeVideoAllowlistEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSubscribeVideoAllowlistExResult426 = await bridge.setSubscribeVideoAllowlistEx([77], {
            channelId: "valwExCh",
            localUid: 713,
        });
        this.assertLogEntry(runner, "setSubscribeVideoAllowlistEx", callTime, {
            uidList: [77],
            uidNumber: 1,
            connection: { channelId: "valwExCh", localUid: 713 },
        });
        runner.assert(
            setSubscribeVideoAllowlistExResult426 === 0,
            "setSubscribeVideoAllowlistEx should return 0, got " + setSubscribeVideoAllowlistExResult426,
        );
        const releaseResult427 = await bridge.release(true);
        await this.delay(50);
    }

    // 236. setRemoteVideoSubscriptionOptionsEx(uid, options, connection)
    private async testSetRemoteVideoSubscriptionOptionsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVideoSubscriptionOptionsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteVideoSubscriptionOptionsExResult428 = await bridge.setRemoteVideoSubscriptionOptionsEx(
            88,
            { type: 1 } as any,
            {
                channelId: "subExCh",
                localUid: 714,
            },
        );
        this.assertLogEntry(runner, "setRemoteVideoSubscriptionOptionsEx", callTime, {
            uid: 88,
            connection: { channelId: "subExCh", localUid: 714 },
        });
        runner.assert(
            setRemoteVideoSubscriptionOptionsExResult428 === 0,
            "setRemoteVideoSubscriptionOptionsEx should return 0, got " + setRemoteVideoSubscriptionOptionsExResult428,
        );
        const releaseResult429 = await bridge.release(true);
        await this.delay(50);
    }

    // 237. setRemoteVoicePositionEx(uid, pan, gain, connection)
    private async testSetRemoteVoicePositionEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteVoicePositionEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteVoicePositionExResult430 = await bridge.setRemoteVoicePositionEx(42, 0.5, 10.0, {
            channelId: "posExCh",
            localUid: 715,
        });
        this.assertLogEntry(runner, "setRemoteVoicePositionEx", callTime, {
            uid: 42,
            pan: 0.5,
            gain: 10.0,
            connection: { channelId: "posExCh", localUid: 715 },
        });
        runner.assert(
            setRemoteVoicePositionExResult430 === 0,
            "setRemoteVoicePositionEx should return 0, got " + setRemoteVoicePositionExResult430,
        );
        const releaseResult431 = await bridge.release(true);
        await this.delay(50);
    }

    // 238. setRemoteUserSpatialAudioParamsEx(uid, params, connection)
    private async testSetRemoteUserSpatialAudioParamsEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteUserSpatialAudioParamsEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteUserSpatialAudioParamsExResult432 = await bridge.setRemoteUserSpatialAudioParamsEx(
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
        runner.assert(
            setRemoteUserSpatialAudioParamsExResult432 === 0,
            "setRemoteUserSpatialAudioParamsEx should return 0, got " + setRemoteUserSpatialAudioParamsExResult432,
        );
        const releaseResult433 = await bridge.release(true);
        await this.delay(50);
    }

    // 239. setRemoteRenderModeEx(uid, renderMode, mirrorMode, connection)
    private async testSetRemoteRenderModeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetRemoteRenderModeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setRemoteRenderModeExResult434 = await bridge.setRemoteRenderModeEx(42, 2, 1, {
            channelId: "rendExCh",
            localUid: 717,
        });
        this.assertLogEntry(runner, "setRemoteRenderModeEx", callTime, {
            uid: 42,
            renderMode: 2,
            mirrorMode: 1,
            connection: { channelId: "rendExCh", localUid: 717 },
        });
        runner.assert(
            setRemoteRenderModeExResult434 === 0,
            "setRemoteRenderModeEx should return 0, got " + setRemoteRenderModeExResult434,
        );
        const releaseResult435 = await bridge.release(true);
        await this.delay(50);
    }

    // 240. enableLoopbackRecordingEx(connection, enabled, deviceName)
    private async testEnableLoopbackRecordingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableLoopbackRecordingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableLoopbackRecordingExResult436 = await bridge.enableLoopbackRecordingEx(
            { channelId: "loopExCh", localUid: 718 },
            true,
            "Built-in Output",
        );
        this.assertLogEntry(runner, "enableLoopbackRecordingEx", callTime, {
            enabled: true,
            deviceName: "Built-in Output",
            connection: { channelId: "loopExCh", localUid: 718 },
        });
        runner.assert(
            enableLoopbackRecordingExResult436 === 0,
            "enableLoopbackRecordingEx should return 0, got " + enableLoopbackRecordingExResult436,
        );
        const releaseResult437 = await bridge.release(true);
        await this.delay(50);
    }

    // 241. adjustRecordingSignalVolumeEx(volume, connection)
    private async testAdjustRecordingSignalVolumeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustRecordingSignalVolumeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustRecordingSignalVolumeExResult438 = await bridge.adjustRecordingSignalVolumeEx(80, {
            channelId: "volExCh",
            localUid: 719,
        });
        this.assertLogEntry(runner, "adjustRecordingSignalVolumeEx", callTime, {
            volume: 80,
            connection: { channelId: "volExCh", localUid: 719 },
        });
        runner.assert(
            adjustRecordingSignalVolumeExResult438 === 0,
            "adjustRecordingSignalVolumeEx should return 0, got " + adjustRecordingSignalVolumeExResult438,
        );
        const releaseResult439 = await bridge.release(true);
        await this.delay(50);
    }

    // 242. muteRecordingSignalEx(mute, connection)
    private async testMuteRecordingSignalEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testMuteRecordingSignalEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const muteRecordingSignalExResult440 = await bridge.muteRecordingSignalEx(true, {
            channelId: "muteRecExCh",
            localUid: 720,
        });
        this.assertLogEntry(runner, "muteRecordingSignalEx", callTime, {
            mute: true,
            connection: { channelId: "muteRecExCh", localUid: 720 },
        });
        runner.assert(
            muteRecordingSignalExResult440 === 0,
            "muteRecordingSignalEx should return 0, got " + muteRecordingSignalExResult440,
        );
        const releaseResult441 = await bridge.release(true);
        await this.delay(50);
    }

    // 243. adjustUserPlaybackSignalVolumeEx(uid, volume, connection)
    private async testAdjustUserPlaybackSignalVolumeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAdjustUserPlaybackSignalVolumeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const adjustUserPlaybackSignalVolumeExResult442 = await bridge.adjustUserPlaybackSignalVolumeEx(77, 50, {
            channelId: "playExCh",
            localUid: 721,
        });
        this.assertLogEntry(runner, "adjustUserPlaybackSignalVolumeEx", callTime, {
            uid: 77,
            volume: 50,
            connection: { channelId: "playExCh", localUid: 721 },
        });
        runner.assert(
            adjustUserPlaybackSignalVolumeExResult442 === 0,
            "adjustUserPlaybackSignalVolumeEx should return 0, got " + adjustUserPlaybackSignalVolumeExResult442,
        );
        const releaseResult443 = await bridge.release(true);
        await this.delay(50);
    }

    // 244. enableEncryptionEx(connection, enabled, config)
    private async testEnableEncryptionEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableEncryptionEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableEncryptionExResult444 = await bridge.enableEncryptionEx(
            { channelId: "encExCh", localUid: 722 },
            true,
            {
                encryptionMode: 1,
                encryptionKey: "exSecret",
                encryptionKdfSalt: new Uint8Array(0),
                datastreamEncryptionEnabled: false,
            },
        );
        this.assertLogEntry(runner, "enableEncryptionEx", callTime, {
            enabled: true,
            encryptionMode: 1,
            encryptionKey: "exSecret",
            connection: { channelId: "encExCh", localUid: 722 },
        });
        runner.assert(
            enableEncryptionExResult444 === 0,
            "enableEncryptionEx should return 0, got " + enableEncryptionExResult444,
        );
        const releaseResult445 = await bridge.release(true);
        await this.delay(50);
    }

    // 245. createDataStreamEx(reliable, ordered, connection)
    private async testCreateDataStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testCreateDataStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const connection = { localUid: 2, channelId: "test" };
        const callTime = Date.now();
        const createDataStreamExResult446 = await (bridge as any).createDataStreamEx(true, false, connection);
        this.assertLogEntry(runner, "createDataStreamEx", callTime, {
            reliable: true,
            ordered: false,
            connection: { channelId: "test", localUid: 2 },
        });
        runner.assert(
            createDataStreamExResult446.errorCode === 0,
            "createDataStreamEx.errorCode should be 0, got " + createDataStreamExResult446.errorCode,
        );
        runner.assert(
            createDataStreamExResult446.streamId === 0,
            "createDataStreamEx.streamId should be 0, got " + createDataStreamExResult446.streamId,
        );
        const releaseResult447 = await bridge.release(true);
        await this.delay(50);
    }

    // 246. sendStreamMessageEx(streamId, data, connection)
    private async testSendStreamMessageEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendStreamMessageEx ---");
        const bridge = this.createBridgeAndInit();
        const data = new Uint8Array([97, 103]);
        const callTime = Date.now();
        const sendStreamMessageExResult448 = await (bridge as any).sendStreamMessageEx(1, data.buffer, {
            channelId: "msgExCh",
            localUid: 723,
        });
        this.assertLogEntry(runner, "sendStreamMessageEx", callTime, {
            streamId: 1,
            data: "ag",
            length: 2,
            connection: { channelId: "msgExCh", localUid: 723 },
        });
        runner.assert(
            sendStreamMessageExResult448 === 0,
            "sendStreamMessageEx should return 0, got " + sendStreamMessageExResult448,
        );
        const releaseResult449 = await bridge.release(true);
        await this.delay(50);
    }

    // 247. sendRdtMessageEx(uid, type, data, connection) - SKIP: requires RdtStreamType enum
    // 248. sendMediaControlMessageEx(uid, data, connection) - SKIP: no JSB binding

    // 249. addVideoWatermarkEx(watermarkUrl, options, connection)
    private async testAddVideoWatermarkEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testAddVideoWatermarkEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const addVideoWatermarkExResult448 = await bridge.addVideoWatermarkEx(
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
        runner.assert(
            addVideoWatermarkExResult448 === 0,
            "addVideoWatermarkEx should return 0, got " + addVideoWatermarkExResult448,
        );
        const releaseResult449 = await bridge.release(true);
        await this.delay(50);
    }

    // 250. removeVideoWatermarkEx(id, connection)
    private async testRemoveVideoWatermarkEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testRemoveVideoWatermarkEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const removeVideoWatermarkExResult450 = await bridge.removeVideoWatermarkEx("wm_id_123", {
            channelId: "rmWmExCh",
            localUid: 725,
        });
        this.assertLogEntry(runner, "removeVideoWatermarkEx", callTime, {
            id: "wm_id_123",
            connection: { channelId: "rmWmExCh", localUid: 725 },
        });
        runner.assert(
            removeVideoWatermarkExResult450 === 0,
            "removeVideoWatermarkEx should return 0, got " + removeVideoWatermarkExResult450,
        );
        const releaseResult451 = await bridge.release(true);
        await this.delay(50);
    }

    // 251. clearVideoWatermarkEx(connection)
    private async testClearVideoWatermarkEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testClearVideoWatermarkEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const clearVideoWatermarkExResult452 = await bridge.clearVideoWatermarkEx({
            channelId: "clrWmExCh",
            localUid: 726,
        });
        this.assertLogEntry(runner, "clearVideoWatermarkEx", callTime, {
            connection: { channelId: "clrWmExCh", localUid: 726 },
        });
        runner.assert(
            clearVideoWatermarkExResult452 === 0,
            "clearVideoWatermarkEx should return 0, got " + clearVideoWatermarkExResult452,
        );
        const releaseResult453 = await bridge.release(true);
        await this.delay(50);
    }

    // 252. sendCustomReportMessageEx(id, category, event, label, value, connection)
    private async testSendCustomReportMessageEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendCustomReportMessageEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const sendCustomReportMessageExResult454 = await bridge.sendCustomReportMessageEx(
            "ex_report",
            "ex_cat",
            "ex_event",
            "ex_label",
            99,
            {
                channelId: "rptExCh",
                localUid: 727,
            },
        );
        this.assertLogEntry(runner, "sendCustomReportMessageEx", callTime, {
            id: "ex_report",
            category: "ex_cat",
            event: "ex_event",
            label: "ex_label",
            value: 99,
            connection: { channelId: "rptExCh", localUid: 727 },
        });
        runner.assert(
            sendCustomReportMessageExResult454 === 0,
            "sendCustomReportMessageEx should return 0, got " + sendCustomReportMessageExResult454,
        );
        const releaseResult455 = await bridge.release(true);
        await this.delay(50);
    }

    // 253. enableAudioVolumeIndicationEx(interval, smooth, reportVad, connection)
    private async testEnableAudioVolumeIndicationEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableAudioVolumeIndicationEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableAudioVolumeIndicationExResult456 = await bridge.enableAudioVolumeIndicationEx(300, 5, true, {
            channelId: "volIndExCh",
            localUid: 728,
        });
        this.assertLogEntry(runner, "enableAudioVolumeIndicationEx", callTime, {
            interval: 300,
            smooth: 5,
            reportVad: true,
            connection: { channelId: "volIndExCh", localUid: 728 },
        });
        runner.assert(
            enableAudioVolumeIndicationExResult456 === 0,
            "enableAudioVolumeIndicationEx should return 0, got " + enableAudioVolumeIndicationExResult456,
        );
        const releaseResult457 = await bridge.release(true);
        await this.delay(50);
    }

    // 254. startRtmpStreamWithoutTranscodingEx(url, connection)
    private async testStartRtmpStreamWithoutTranscodingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithoutTranscodingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startRtmpStreamWithoutTranscodingExResult458 = await bridge.startRtmpStreamWithoutTranscodingEx(
            "rtmp://ex.example.com/stream",
            {
                channelId: "rtmpExCh",
                localUid: 729,
            },
        );
        this.assertLogEntry(runner, "startRtmpStreamWithoutTranscodingEx", callTime, {
            url: "rtmp://ex.example.com/stream",
            connection: { channelId: "rtmpExCh", localUid: 729 },
        });
        runner.assert(
            startRtmpStreamWithoutTranscodingExResult458 === 0,
            "startRtmpStreamWithoutTranscodingEx should return 0, got " + startRtmpStreamWithoutTranscodingExResult458,
        );
        const releaseResult459 = await bridge.release(true);
        await this.delay(50);
    }

    // 255. startRtmpStreamWithTranscodingEx(url, transcoding, connection)
    private async testStartRtmpStreamWithTranscodingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartRtmpStreamWithTranscodingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startRtmpStreamWithTranscodingExResult460 = await bridge.startRtmpStreamWithTranscodingEx(
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
        runner.assert(
            startRtmpStreamWithTranscodingExResult460 === 0,
            "startRtmpStreamWithTranscodingEx should return 0, got " + startRtmpStreamWithTranscodingExResult460,
        );
        const releaseResult461 = await bridge.release(true);
        await this.delay(50);
    }

    // 256. updateRtmpTranscodingEx(transcoding, connection)
    private async testUpdateRtmpTranscodingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testUpdateRtmpTranscodingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const updateRtmpTranscodingExResult462 = await bridge.updateRtmpTranscodingEx(
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
        runner.assert(
            updateRtmpTranscodingExResult462 === 0,
            "updateRtmpTranscodingEx should return 0, got " + updateRtmpTranscodingExResult462,
        );
        const releaseResult463 = await bridge.release(true);
        await this.delay(50);
    }

    // 257. stopRtmpStreamEx(url, connection)
    private async testStopRtmpStreamEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopRtmpStreamEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopRtmpStreamExResult464 = await bridge.stopRtmpStreamEx("rtmp://ex.example.com/stream", {
            channelId: "stopRtmpExCh",
            localUid: 732,
        });
        this.assertLogEntry(runner, "stopRtmpStreamEx", callTime, {
            url: "rtmp://ex.example.com/stream",
            connection: { channelId: "stopRtmpExCh", localUid: 732 },
        });
        runner.assert(
            stopRtmpStreamExResult464 === 0,
            "stopRtmpStreamEx should return 0, got " + stopRtmpStreamExResult464,
        );
        const releaseResult465 = await bridge.release(true);
        await this.delay(50);
    }

    // 258. startOrUpdateChannelMediaRelayEx(configuration, connection)
    private async testStartOrUpdateChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartOrUpdateChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startOrUpdateChannelMediaRelayExResult466 = await bridge.startOrUpdateChannelMediaRelayEx({} as any, {
            channelId: "relayExCh",
            localUid: 733,
        });
        this.assertLogEntry(runner, "startOrUpdateChannelMediaRelayEx", callTime, {
            connection: { channelId: "relayExCh", localUid: 733 },
        });
        runner.assert(
            startOrUpdateChannelMediaRelayExResult466 === 0,
            "startOrUpdateChannelMediaRelayEx should return 0, got " + startOrUpdateChannelMediaRelayExResult466,
        );
        const releaseResult467 = await bridge.release(true);
        await this.delay(50);
    }

    // 259. stopChannelMediaRelayEx(connection)
    private async testStopChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStopChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const stopChannelMediaRelayExResult468 = await bridge.stopChannelMediaRelayEx({
            channelId: "stopRelayExCh",
            localUid: 734,
        });
        this.assertLogEntry(runner, "stopChannelMediaRelayEx", callTime, {
            connection: { channelId: "stopRelayExCh", localUid: 734 },
        });
        runner.assert(
            stopChannelMediaRelayExResult468 === 0,
            "stopChannelMediaRelayEx should return 0, got " + stopChannelMediaRelayExResult468,
        );
        const releaseResult469 = await bridge.release(true);
        await this.delay(50);
    }

    // 260. pauseAllChannelMediaRelayEx(connection)
    private async testPauseAllChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPauseAllChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const pauseAllChannelMediaRelayExResult470 = await bridge.pauseAllChannelMediaRelayEx({
            channelId: "pauseRelayExCh",
            localUid: 735,
        });
        this.assertLogEntry(runner, "pauseAllChannelMediaRelayEx", callTime, {
            connection: { channelId: "pauseRelayExCh", localUid: 735 },
        });
        runner.assert(
            pauseAllChannelMediaRelayExResult470 === 0,
            "pauseAllChannelMediaRelayEx should return 0, got " + pauseAllChannelMediaRelayExResult470,
        );
        const releaseResult471 = await bridge.release(true);
        await this.delay(50);
    }

    // 261. resumeAllChannelMediaRelayEx(connection)
    private async testResumeAllChannelMediaRelayEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testResumeAllChannelMediaRelayEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const resumeAllChannelMediaRelayExResult472 = await bridge.resumeAllChannelMediaRelayEx({
            channelId: "resumeRelayExCh",
            localUid: 736,
        });
        this.assertLogEntry(runner, "resumeAllChannelMediaRelayEx", callTime, {
            connection: { channelId: "resumeRelayExCh", localUid: 736 },
        });
        runner.assert(
            resumeAllChannelMediaRelayExResult472 === 0,
            "resumeAllChannelMediaRelayEx should return 0, got " + resumeAllChannelMediaRelayExResult472,
        );
        const releaseResult473 = await bridge.release(true);
        await this.delay(50);
    }

    // 262. enableDualStreamModeEx(enabled, streamConfig, connection)
    private async testEnableDualStreamModeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableDualStreamModeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableDualStreamModeExResult474 = await bridge.enableDualStreamModeEx(
            true,
            { dimensions: { width: 320, height: 240 } } as any,
            {
                channelId: "dualExCh",
                localUid: 737,
            },
        );
        this.assertLogEntry(runner, "enableDualStreamModeEx", callTime, {
            enabled: true,
            connection: { channelId: "dualExCh", localUid: 737 },
        });
        runner.assert(
            enableDualStreamModeExResult474 === 0,
            "enableDualStreamModeEx should return 0, got " + enableDualStreamModeExResult474,
        );
        const releaseResult475 = await bridge.release(true);
        await this.delay(50);
    }

    // 263. setDualStreamModeEx(mode, streamConfig, connection)
    private async testSetDualStreamModeEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetDualStreamModeEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setDualStreamModeExResult476 = await bridge.setDualStreamModeEx(
            1,
            { dimensions: { width: 320, height: 240 } } as any,
            {
                channelId: "dualModeExCh",
                localUid: 738,
            },
        );
        this.assertLogEntry(runner, "setDualStreamModeEx", callTime, {
            mode: 1,
            connection: { channelId: "dualModeExCh", localUid: 738 },
        });
        runner.assert(
            setDualStreamModeExResult476 === 0,
            "setDualStreamModeEx should return 0, got " + setDualStreamModeExResult476,
        );
        const releaseResult477 = await bridge.release(true);
        await this.delay(50);
    }

    // 264. setSimulcastConfigEx(simulcastConfig, connection)
    private async testSetSimulcastConfigEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetSimulcastConfigEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setSimulcastConfigExResult478 = await bridge.setSimulcastConfigEx(
            { configs: [], publish_fallback_enable: true },
            { channelId: "simExCh", localUid: 739 },
        );
        this.assertLogEntry(runner, "setSimulcastConfigEx", callTime, {
            publish_fallback_enable: true,
            connection: { channelId: "simExCh", localUid: 739 },
        });
        runner.assert(
            setSimulcastConfigExResult478 === 0,
            "setSimulcastConfigEx should return 0, got " + setSimulcastConfigExResult478,
        );
        const releaseResult479 = await bridge.release(true);
        await this.delay(50);
    }

    // 265. setHighPriorityUserListEx(uidList, option, connection)
    private async testSetHighPriorityUserListEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetHighPriorityUserListEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setHighPriorityUserListExResult480 = await (bridge as any).setHighPriorityUserListEx([111, 222], 1, {
            channelId: "hiPriExCh",
            localUid: 740,
        });
        this.assertLogEntry(runner, "setHighPriorityUserListEx", callTime, {
            uidList: [111, 222],
            uidNum: 2,
            option: 1,
            connection: { channelId: "hiPriExCh", localUid: 740 },
        });
        runner.assert(
            setHighPriorityUserListExResult480 === 0,
            "setHighPriorityUserListEx should return 0, got " + setHighPriorityUserListExResult480,
        );
        const releaseResult481 = await bridge.release(true);
        await this.delay(50);
    }

    // 266. takeSnapshotEx(connection, uid, filePath)
    private async testTakeSnapshotEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testTakeSnapshotEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const takeSnapshotExResult482 = await bridge.takeSnapshotEx(
            { channelId: "snapExCh", localUid: 741 },
            42,
            "/tmp/snap_ex.png",
        );
        this.assertLogEntry(runner, "takeSnapshotEx", callTime, {
            uid: 42,
            filePath: "/tmp/snap_ex.png",
            connection: { channelId: "snapExCh", localUid: 741 },
        });
        runner.assert(takeSnapshotExResult482 === 0, "takeSnapshotEx should return 0, got " + takeSnapshotExResult482);
        const releaseResult483 = await bridge.release(true);
        await this.delay(50);
    }

    // 267. enableContentInspectEx(enabled, config, connection)
    private async testEnableContentInspectEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableContentInspectEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableContentInspectExResult484 = await bridge.enableContentInspectEx(
            true,
            { moduleCount: 2, modules: [] } as any,
            {
                channelId: "inspectExCh",
                localUid: 742,
            },
        );
        this.assertLogEntry(runner, "enableContentInspectEx", callTime, {
            enabled: true,
            connection: { channelId: "inspectExCh", localUid: 742 },
        });
        runner.assert(
            enableContentInspectExResult484 === 0,
            "enableContentInspectEx should return 0, got " + enableContentInspectExResult484,
        );
        const releaseResult485 = await bridge.release(true);
        await this.delay(50);
    }

    // 268. startMediaRenderingTracingEx(connection)
    private async testStartMediaRenderingTracingEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testStartMediaRenderingTracingEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const startMediaRenderingTracingExResult486 = await bridge.startMediaRenderingTracingEx({
            channelId: "traceExCh",
            localUid: 743,
        });
        this.assertLogEntry(runner, "startMediaRenderingTracingEx", callTime, {
            connection: { channelId: "traceExCh", localUid: 743 },
        });
        runner.assert(
            startMediaRenderingTracingExResult486 === 0,
            "startMediaRenderingTracingEx should return 0, got " + startMediaRenderingTracingExResult486,
        );
        const releaseResult487 = await bridge.release(true);
        await this.delay(50);
    }

    // 269. setParametersEx(connection, parameters) (string overload)
    private async testSetParametersExString(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetParametersExString ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setParametersExResult488 = await (bridge as any).setParametersEx(
            { channelId: "paramStrExCh", localUid: 744 },
            '{"che.video.enable.hw_encoder":true}',
        );
        this.assertLogEntry(runner, "setParametersEx", callTime, {
            parameters: '{"che.video.enable.hw_encoder":true}',
            connection: { channelId: "paramStrExCh", localUid: 744 },
        });
        const releaseResult489 = await bridge.release(true);
        await this.delay(50);
    }

    // 270. getCallIdEx(connection) - returns complex {callId, errorCode}
    private async testGetCallIdEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetCallIdEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getCallIdExResult490 = await bridge.getCallIdEx({ channelId: "callIdExCh", localUid: 747 });
        this.assertLogEntry(runner, "getCallIdEx", callTime, {
            connection: { channelId: "callIdExCh", localUid: 747 },
        });
        runner.assert(
            getCallIdExResult490.errorCode === 0,
            "getCallIdEx.errorCode should be 0, got " + getCallIdExResult490.errorCode,
        );
        runner.assert(
            typeof getCallIdExResult490.callId === "string",
            "getCallIdEx.callId should be a string, got " + typeof getCallIdExResult490.callId,
        );
        const releaseResult491 = await bridge.release(true);
        await this.delay(50);
    }

    // 271. sendAudioMetadataEx(connection, metadata)
    private async testSendAudioMetadataEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSendAudioMetadataEx ---");
        const bridge = this.createBridgeAndInit();
        const metadata = new Uint8Array([97, 103]);
        const callTime = Date.now();
        const sendAudioMetadataExResult492 = await (bridge as any).sendAudioMetadataEx(
            { localUid: 2, channelId: "test" },
            metadata.buffer,
        );
        this.assertLogEntry(runner, "sendAudioMetadataEx", callTime, {
            metadata: "ag",
            length: 2,
            connection: { channelId: "test", localUid: 2 },
        });
        runner.assert(
            sendAudioMetadataExResult492 === 0,
            "sendAudioMetadataEx should return 0, got " + sendAudioMetadataExResult492,
        );
        const releaseResult493 = await bridge.release(true);
        await this.delay(50);
    }

    // 272. preloadEffectEx(connection, soundId, filePath, startPos)
    private async testPreloadEffectEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPreloadEffectEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const preloadEffectExResult492 = await bridge.preloadEffectEx(
            { channelId: "preloadExCh", localUid: 745 },
            5,
            "/sounds/ex_preload.wav",
            200,
        );
        this.assertLogEntry(runner, "preloadEffectEx", callTime, {
            soundId: 5,
            filePath: "/sounds/ex_preload.wav",
            startPos: 200,
            connection: { channelId: "preloadExCh", localUid: 745 },
        });
        runner.assert(
            preloadEffectExResult492 === 0,
            "preloadEffectEx should return 0, got " + preloadEffectExResult492,
        );
        const releaseResult493 = await bridge.release(true);
        await this.delay(50);
    }

    // 273. playEffectEx(connection, soundId, filePath, loopCount, pitch, pan, gain, publish, startPos)
    private async testPlayEffectEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testPlayEffectEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const playEffectExResult494 = await bridge.playEffectEx(
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
        runner.assert(playEffectExResult494 === 0, "playEffectEx should return 0, got " + playEffectExResult494);
        const releaseResult495 = await bridge.release(true);
        await this.delay(50);
    }

    // ──────────────────────────── Struct-Returning Method Tests ────────────────────────────

    private async testGetVersion(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetVersion ---");
        const bridge = this.createBridgeAndInit();
        const getVersionResult = await bridge.getVersion();
        runner.assert(
            getVersionResult.version === "hello",
            "getVersion.version should be 'hello', got " + getVersionResult.version,
        );
        runner.assert(getVersionResult.build === 2, "getVersion.build should be 2, got " + getVersionResult.build);
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testQueryCodecCapability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryCodecCapability ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const queryCodecCapabilityResult = await bridge.queryCodecCapability(2);
        this.assertLogEntry(runner, "queryCodecCapability", callTime, {});
        runner.assert(
            queryCodecCapabilityResult.errorCode === 0,
            "queryCodecCapability.errorCode should be 0, got " + queryCodecCapabilityResult.errorCode,
        );
        runner.assert(
            typeof (queryCodecCapabilityResult as any).size === "number",
            "queryCodecCapability.size should be a number, got " + typeof (queryCodecCapabilityResult as any).size,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetFaceShapeBeautyOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetFaceShapeBeautyOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getFaceShapeBeautyOptionsResult = await bridge.getFaceShapeBeautyOptions(0);
        this.assertLogEntry(runner, "getFaceShapeBeautyOptions", callTime, { type: 0 });
        runner.assert(
            getFaceShapeBeautyOptionsResult.errorCode === 0,
            "getFaceShapeBeautyOptions.errorCode should be 0, got " + getFaceShapeBeautyOptionsResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetFaceShapeAreaOptions(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetFaceShapeAreaOptions ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getFaceShapeAreaOptionsResult = await bridge.getFaceShapeAreaOptions(100 as any, 0);
        this.assertLogEntry(runner, "getFaceShapeAreaOptions", callTime, { shapeArea: 100, type: 0 });
        runner.assert(
            getFaceShapeAreaOptionsResult.errorCode === 0,
            "getFaceShapeAreaOptions.errorCode should be 0, got " + getFaceShapeAreaOptionsResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableExtensionWithExtensionInfo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableExtensionWithExtensionInfo ---");
        const bridge = this.createBridgeAndInit();
        const extensionInfo = this.createExtensionInfo();
        const callTime = Date.now();
        const enableExtensionResult = await bridge.enableExtension(
            "providerInfo",
            "extensionInfo",
            extensionInfo,
            true,
        );
        this.assertLogEntry(runner, "enableExtension", callTime, {
            provider: "providerInfo",
            extension: "extensionInfo",
            mediaSourceType: MEDIA_SOURCE_TYPE.PRIMARY_CAMERA_SOURCE,
            remoteUid: 1234,
            channelId: "extensionChannel",
            enable: true,
        });
        runner.assert(enableExtensionResult === 0, "enableExtension should return 0, got " + enableExtensionResult);
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetExtensionPropertyWithExtensionInfo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetExtensionPropertyWithExtensionInfo ---");
        const bridge = this.createBridgeAndInit();
        const extensionInfo = this.createExtensionInfo();
        const callTime = Date.now();
        const setExtensionPropertyResult = await bridge.setExtensionProperty(
            "providerInfo",
            "extensionInfo",
            extensionInfo,
            "keyInfo",
            "valueInfo",
        );
        this.assertLogEntry(runner, "setExtensionProperty", callTime, {
            provider: "providerInfo",
            extension: "extensionInfo",
            mediaSourceType: MEDIA_SOURCE_TYPE.PRIMARY_CAMERA_SOURCE,
            remoteUid: 1234,
            channelId: "extensionChannel",
            key: "keyInfo",
            value: "valueInfo",
        });
        runner.assert(
            setExtensionPropertyResult === 0,
            "setExtensionProperty should return 0, got " + setExtensionPropertyResult,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetExtensionPropertyWithExtensionInfo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetExtensionPropertyWithExtensionInfo ---");
        const bridge = this.createBridgeAndInit();
        const extensionInfo = this.createExtensionInfo();
        const callTime = Date.now();
        const getExtensionPropertyResult = await bridge.getExtensionProperty(
            "providerInfo",
            "extensionInfo",
            extensionInfo,
            "keyInfo",
        );
        this.assertLogEntry(runner, "getExtensionProperty", callTime, {
            provider: "providerInfo",
            extension: "extensionInfo",
            mediaSourceType: MEDIA_SOURCE_TYPE.PRIMARY_CAMERA_SOURCE,
            remoteUid: 1234,
            channelId: "extensionChannel",
            key: "keyInfo",
        });
        runner.assert(
            getExtensionPropertyResult.errorCode === 0,
            "getExtensionProperty.errorCode should be 0, got " + getExtensionPropertyResult.errorCode,
        );
        runner.assert(
            typeof getExtensionPropertyResult.value === "string",
            "getExtensionProperty.value should be a string, got " + typeof getExtensionPropertyResult.value,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testEnableExtension(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testEnableExtension ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const enableExtensionResult = await bridge.enableExtension(
            "provider",
            "extension",
            false,
            MEDIA_SOURCE_TYPE.SECONDARY_CAMERA_SOURCE,
        );
        this.assertLogEntry(runner, "enableExtension", callTime, {
            provider: "provider",
            extension: "extension",
            enable: false,
            type: MEDIA_SOURCE_TYPE.SECONDARY_CAMERA_SOURCE,
        });
        runner.assert(enableExtensionResult === 0, "enableExtension should return 0, got " + enableExtensionResult);
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testSetExtensionProperty(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testSetExtensionProperty ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const setExtensionPropertyResult = await bridge.setExtensionProperty(
            "provider",
            "extension",
            "key",
            "value",
            MEDIA_SOURCE_TYPE.SECONDARY_CAMERA_SOURCE,
        );
        this.assertLogEntry(runner, "setExtensionProperty", callTime, {
            provider: "provider",
            extension: "extension",
            key: "key",
            value: "value",
            type: MEDIA_SOURCE_TYPE.SECONDARY_CAMERA_SOURCE,
        });
        runner.assert(
            setExtensionPropertyResult === 0,
            "setExtensionProperty should return 0, got " + setExtensionPropertyResult,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetExtensionProperty(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetExtensionProperty ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getExtensionPropertyResult = await bridge.getExtensionProperty(
            "provider",
            "extension",
            "key",
            MEDIA_SOURCE_TYPE.SECONDARY_CAMERA_SOURCE,
        );
        this.assertLogEntry(runner, "getExtensionProperty", callTime, {
            provider: "provider",
            extension: "extension",
            key: "key",
            type: MEDIA_SOURCE_TYPE.SECONDARY_CAMERA_SOURCE,
        });
        runner.assert(
            getExtensionPropertyResult.errorCode === 0,
            "getExtensionProperty.errorCode should be 0, got " + getExtensionPropertyResult.errorCode,
        );
        runner.assert(
            typeof getExtensionPropertyResult.value === "string",
            "getExtensionProperty.value should be a string, got " + typeof getExtensionPropertyResult.value,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetAudioDeviceInfo(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetAudioDeviceInfo ---");
        const bridge = this.createBridgeAndInit();
        const getAudioDeviceInfoResult = await bridge.getAudioDeviceInfo();
        runner.assert(
            getAudioDeviceInfoResult.errorCode === -4,
            "getAudioDeviceInfo.errorCode should be -4 (ERR_NOT_SUPPORTED), got " + getAudioDeviceInfoResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testQueryCameraFocalLengthCapability(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testQueryCameraFocalLengthCapability ---");
        const bridge = this.createBridgeAndInit();
        const queryCameraFocalLengthCapabilityResult = await bridge.queryCameraFocalLengthCapability(2);
        runner.assert(
            queryCameraFocalLengthCapabilityResult.errorCode === -4,
            "queryCameraFocalLengthCapability.errorCode should be -4 (ERR_NOT_SUPPORTED), got " +
                queryCameraFocalLengthCapabilityResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetCallId(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetCallId ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getCallIdResult = await bridge.getCallId();
        this.assertLogEntry(runner, "getCallId", callTime, {});
        runner.assert(
            getCallIdResult.errorCode === 0,
            "getCallId.errorCode should be 0, got " + getCallIdResult.errorCode,
        );
        runner.assert(
            typeof getCallIdResult.callId === "string",
            "getCallId.callId should be a string, got " + typeof getCallIdResult.callId,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetUserInfoByUserAccount(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetUserInfoByUserAccount ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getUserInfoByUserAccountResult = await bridge.getUserInfoByUserAccount("testUser");
        this.assertLogEntry(runner, "getUserInfoByUserAccount", callTime, { userAccount: "testUser" });
        runner.assert(
            getUserInfoByUserAccountResult.errorCode === 0,
            "getUserInfoByUserAccount.errorCode should be 0, got " + getUserInfoByUserAccountResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetUserInfoByUid(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetUserInfoByUid ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getUserInfoByUidResult = await bridge.getUserInfoByUid(12345);
        this.assertLogEntry(runner, "getUserInfoByUid", callTime, { uid: 12345 });
        runner.assert(
            getUserInfoByUidResult.errorCode === 0,
            "getUserInfoByUid.errorCode should be 0, got " + getUserInfoByUidResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetUserInfoByUserAccountEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetUserInfoByUserAccountEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getUserInfoByUserAccountExResult = await bridge.getUserInfoByUserAccountEx("testUserEx", {
            channelId: "testChannel",
            localUid: 2,
        });
        this.assertLogEntry(runner, "getUserInfoByUserAccountEx", callTime, {
            userAccount: "testUserEx",
            connection: { channelId: "testChannel", localUid: 2 },
        });
        runner.assert(
            getUserInfoByUserAccountExResult.errorCode === 0,
            "getUserInfoByUserAccountEx.errorCode should be 0, got " + getUserInfoByUserAccountExResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    private async testGetUserInfoByUidEx(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testGetUserInfoByUidEx ---");
        const bridge = this.createBridgeAndInit();
        const callTime = Date.now();
        const getUserInfoByUidExResult = await bridge.getUserInfoByUidEx(54321, {
            channelId: "testChannel2",
            localUid: 3,
        });
        this.assertLogEntry(runner, "getUserInfoByUidEx", callTime, {
            uid: 54321,
            connection: { channelId: "testChannel2", localUid: 3 },
        });
        runner.assert(
            getUserInfoByUidExResult.errorCode === 0,
            "getUserInfoByUidEx.errorCode should be 0, got " + getUserInfoByUidExResult.errorCode,
        );
        const releaseResult = await bridge.release(true);
        await this.delay(50);
    }

    // ──────────────────────────── Full Lifecycle ────────────────────────────

    private async testFullLifecycle(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: testFullLifecycle ---");
        const bridge = this.createBridgeAndInit();

        // Note: createBridgeAndInit() already calls initialize(), so we don't call it again

        const joinTime = Date.now();
        const joinChannelResult496 = await bridge.joinChannel("token", "channel", "info", 42);
        this.assertLogEntry(runner, "joinChannel", joinTime, {
            token: "token",
            channelId: "channel",
            info: "info",
            uid: 42,
        });
        runner.assert(joinChannelResult496 === 0, "joinChannel should return 0, got " + joinChannelResult496);

        const leaveTime = Date.now();
        const leaveChannelResult497 = await bridge.leaveChannel();
        this.assertLogEntry(runner, "leaveChannel", leaveTime, {});
        runner.assert(leaveChannelResult497 === 0, "leaveChannel should return 0, got " + leaveChannelResult497);

        // Verify log accumulated (should have many entries from all tests)
        const logStr: string = (jsb as any).agora.test.readLog();
        const logArray: LogEntry[] = JSON.parse(logStr);
        runner.assert(logArray.length > 80, "Expected 80+ accumulated log entries (got " + logArray.length + ")");

        const releaseResult498 = await bridge.release(true);
        await this.delay(50);
    }
}
