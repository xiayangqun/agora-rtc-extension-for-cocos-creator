/**
 * Callback Tests
 *
 * Tests that callbacks are properly delivered from C++ mock to JS.
 * Uses fixed values from C++ layer (not passed from JS).
 *
 * Fixed value rules:
 *   string → "agora"
 *   number (generic) → 2
 *   bool → true
 *   enum → actual enum value
 *   struct → recursively apply same rules
 */

import { IRtcEngineEx } from "agora-rtc/interface/IRtcEngineEx";
import { TestRunner, TestCase } from "./test-framework";
import { IRtcEngineEventHandler } from "agora-rtc/interface/IRtcEngineEventHandler";
import { CHANNEL_PROFILE_TYPE } from "agora-rtc/types/AgoraBase";

export class CallbackTestSuite extends TestCase {
    private bridge!: IRtcEngineEx;
    private result: any = null;

    constructor() {
        super("CallbackTestSuite");
    }

    async run(runner: TestRunner): Promise<void> {
        // IMPORTANT: Test case order MUST match jsb_trigger_events.cpp register order for easy diff
        runner.log("\n=== Running Callback Tests ===\n");

        // Overloaded functions (Ex versions with RtcConnection)
        await this.testOnJoinChannelSuccess(runner);
        await this.testOnRejoinChannelSuccess(runner);
        await this.testOnLeaveChannel(runner);
        await this.testOnUserJoined(runner);
        await this.testOnUserOffline(runner);
        await this.testOnConnectionLost(runner);
        await this.testOnConnectionInterrupted(runner);
        await this.testOnConnectionBanned(runner);
        await this.testOnTokenPrivilegeWillExpire(runner);
        await this.testOnRequestToken(runner);
        await this.testOnLicenseValidationFailure(runner);
        await this.testOnAudioQuality(runner);
        await this.testOnRtcStats(runner);
        await this.testOnNetworkQuality(runner);
        await this.testOnIntraRequestReceived(runner);
        await this.testOnFirstLocalVideoFramePublished(runner);
        await this.testOnFirstRemoteVideoDecoded(runner);
        await this.testOnVideoSizeChanged(runner);
        await this.testOnRemoteVideoStateChanged(runner);
        await this.testOnFirstRemoteVideoFrame(runner);
        await this.testOnUserMuteAudio(runner);
        await this.testOnUserMuteVideo(runner);
        await this.testOnUserEnableVideo(runner);
        await this.testOnUserEnableLocalVideo(runner);
        await this.testOnUserStateChanged(runner);
        await this.testOnLocalAudioStats(runner);
        await this.testOnRemoteAudioStats(runner);
        await this.testOnLocalVideoStats(runner);
        await this.testOnRemoteVideoStats(runner);
        await this.testOnStreamMessage(runner);
        await this.testOnStreamMessageError(runner);
        await this.testOnRdtMessage(runner);
        await this.testOnRdtStateChanged(runner);
        await this.testOnMediaControlMessage(runner);
        await this.testOnFirstLocalAudioFramePublished(runner);
        await this.testOnFirstRemoteAudioFrame(runner);
        await this.testOnFirstRemoteAudioDecoded(runner);
        await this.testOnLocalAudioStateChanged(runner);
        await this.testOnRemoteAudioStateChanged(runner);
        await this.testOnActiveSpeaker(runner);
        await this.testOnClientRoleChanged(runner);
        await this.testOnClientRoleChangeFailed(runner);
        await this.testOnNetworkTypeChanged(runner);
        await this.testOnEncryptionError(runner);
        await this.testOnUploadLogResult(runner);
        await this.testOnUserAccountUpdated(runner);
        await this.testOnSnapshotTaken(runner);
        await this.testOnVideoRenderingTracingResult(runner);
        await this.testOnSetRtmFlagResult(runner);
        await this.testOnTranscodedStreamLayoutInfo(runner);
        await this.testOnAudioMetadataReceived(runner);
        await this.testOnMultipathStats(runner);
        await this.testOnRenewTokenResult(runner);

        // Non-overloaded functions
        await this.testOnError(runner);
        await this.testOnAudioDeviceStateChanged(runner);
        await this.testOnAudioDeviceVolumeChanged(runner);
        await this.testOnAudioEffectFinished(runner);
        await this.testOnAudioMixingPositionChanged(runner);
        await this.testOnAudioMixingFinished(runner);
        await this.testOnAudioMixingStateChanged(runner);
        await this.testOnVideoDeviceStateChanged(runner);
        await this.testOnLastmileQuality(runner);
        await this.testOnLastmileProbeResult(runner);
        await this.testOnFirstLocalVideoFrame(runner);
        await this.testOnLocalVideoEvent(runner);
        await this.testOnLocalVideoStateChanged(runner);
        await this.testOnCameraReady(runner);
        await this.testOnCameraFocusAreaChanged(runner);
        await this.testOnCameraExposureAreaChanged(runner);
        await this.testOnVideoStopped(runner);
        await this.testOnRhythmPlayerStateChanged(runner);
        await this.testOnChannelMediaRelayStateChanged(runner);
        await this.testOnAudioRoutingChanged(runner);
        await this.testOnRemoteAudioTransportStats(runner);
        await this.testOnRemoteVideoTransportStats(runner);
        await this.testOnRemoteSubscribeFallbackToAudioOnly(runner);
        await this.testOnAudioPublishStateChanged(runner);
        await this.testOnAudioSubscribeStateChanged(runner);
        await this.testOnVideoPublishStateChanged(runner);
        await this.testOnVideoSubscribeStateChanged(runner);
        await this.testOnPermissionError(runner);
        await this.testOnLocalUserRegistered(runner);
        await this.testOnUserInfoUpdated(runner);
        await this.testOnContentInspectResult(runner);
        await this.testOnProxyConnected(runner);
        await this.testOnRtmpStreamingEvent(runner);
        await this.testOnLocalVideoTranscoderError(runner);
        await this.testOnExtensionErrorWithContext(runner);
        await this.testOnExtensionEventWithContext(runner);
        await this.testOnExtensionStartedWithContext(runner);
        await this.testOnExtensionStoppedWithContext(runner);
    }

    private async runCallbackTest(
        runner: TestRunner,
        testName: string,
        callbackName: string,
        triggerName: string,
        paramNames: string[],
        expectedValues?: Record<string, any>,
        hasConnection: boolean = false,
    ): Promise<void> {
        runner.log("\n--- Test: " + testName + " ---");

        this.setup();
        const capturedParams = paramNames;
        const eventHandler = new (class extends IRtcEngineEventHandler {})();
        (eventHandler as any)[callbackName] = (...args: any[]) => {
            this.result = {};
            capturedParams.forEach((name: string, i: number) => {
                this.result[name] = args[i];
            });
        };

        this.bridge.initialize({
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
            eventHandler,
        });

        (jsb as any).agora.test[triggerName]();
        await this.delay(0);

        runner.assert(this.result !== null, callbackName + " callback should have been called");
        if (this.result === null) {
            this.cleanup();
            return;
        }
        if (hasConnection) {
            runner.assert(this.result.connection !== null, "connection should not be null");
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
                } else {
                    runner.assert(
                        this.valuesEqual(this.result[key], expected),
                        "Expected " + key + " " + expected + ", got " + this.result[key],
                    );
                }
            }
        }

        this.cleanup();
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
        return false;
    }

    // =========================================================================
    // Connection lifecycle (Ex)
    // =========================================================================

    private testOnJoinChannelSuccess(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnJoinChannelSuccessCallback",
            "onJoinChannelSuccess",
            "triggerOnJoinChannelSuccess",
            ["connection", "elapsed"],
            { elapsed: 2 },
            true,
        );
    }

    private testOnRejoinChannelSuccess(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRejoinChannelSuccessCallback",
            "onRejoinChannelSuccess",
            "triggerOnRejoinChannelSuccess",
            ["connection", "elapsed"],
            { elapsed: 2 },
            true,
        );
    }

    private testOnLeaveChannel(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLeaveChannelCallback",
            "onLeaveChannel",
            "triggerOnLeaveChannel",
            ["connection", "stats"],
            { stats: "object" },
            true,
        );
    }

    private testOnUserJoined(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserJoinedCallback",
            "onUserJoined",
            "triggerOnUserJoined",
            ["connection", "remoteUid", "elapsed"],
            { remoteUid: 2, elapsed: 2 },
            true,
        );
    }

    private testOnUserOffline(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserOfflineCallback",
            "onUserOffline",
            "triggerOnUserOffline",
            ["connection", "remoteUid", "reason"],
            { remoteUid: 2, reason: 0 },
            true,
        );
    }

    private testOnConnectionLost(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnConnectionLostCallback",
            "onConnectionLost",
            "triggerOnConnectionLost",
            ["connection"],
            {},
            true,
        );
    }

    private testOnConnectionInterrupted(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnConnectionInterruptedCallback",
            "onConnectionInterrupted",
            "triggerOnConnectionInterrupted",
            ["connection"],
            {},
            true,
        );
    }

    private testOnConnectionBanned(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnConnectionBannedCallback",
            "onConnectionBanned",
            "triggerOnConnectionBanned",
            ["connection"],
            {},
            true,
        );
    }

    private testOnRequestToken(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRequestTokenCallback",
            "onRequestToken",
            "triggerOnRequestToken",
            ["connection"],
            {},
            true,
        );
    }

    private testOnTokenPrivilegeWillExpire(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnTokenPrivilegeWillExpireCallback",
            "onTokenPrivilegeWillExpire",
            "triggerOnTokenPrivilegeWillExpire",
            ["connection", "token"],
            { token: "agora" },
            true,
        );
    }

    private testOnLicenseValidationFailure(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLicenseValidationFailureCallback",
            "onLicenseValidationFailure",
            "triggerOnLicenseValidationFailure",
            ["connection", "reason"],
            { reason: 1 },
            true,
        );
    }

    // =========================================================================
    // Audio events (Ex)
    // =========================================================================

    private testOnAudioQuality(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioQualityCallback",
            "onAudioQuality",
            "triggerOnAudioQuality",
            ["connection", "uid", "quality", "delay", "lost"],
            { uid: 2, quality: 2, delay: 2, lost: 2 },
            true,
        );
    }

    private testOnActiveSpeaker(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnActiveSpeakerCallback",
            "onActiveSpeaker",
            "triggerOnActiveSpeaker",
            ["connection", "uid"],
            { uid: 2 },
            true,
        );
    }

    private testOnFirstLocalAudioFramePublished(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstLocalAudioFramePublishedCallback",
            "onFirstLocalAudioFramePublished",
            "triggerOnFirstLocalAudioFramePublished",
            ["connection", "elapsed"],
            { elapsed: 2 },
            true,
        );
    }

    private testOnFirstRemoteAudioFrame(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstRemoteAudioFrameCallback",
            "onFirstRemoteAudioFrame",
            "triggerOnFirstRemoteAudioFrame",
            ["connection", "uid", "elapsed"],
            { uid: 2, elapsed: 2 },
            true,
        );
    }

    private testOnFirstRemoteAudioDecoded(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstRemoteAudioDecodedCallback",
            "onFirstRemoteAudioDecoded",
            "triggerOnFirstRemoteAudioDecoded",
            ["connection", "uid", "elapsed"],
            { uid: 2, elapsed: 2 },
            true,
        );
    }

    private testOnLocalAudioStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalAudioStateChangedCallback",
            "onLocalAudioStateChanged",
            "triggerOnLocalAudioStateChanged",
            ["connection", "state", "reason"],
            { state: 0, reason: 0 },
            true,
        );
    }

    private testOnRemoteAudioStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteAudioStateChangedCallback",
            "onRemoteAudioStateChanged",
            "triggerOnRemoteAudioStateChanged",
            ["connection", "uid", "state", "reason", "elapsed"],
            { uid: 2, state: 1, reason: 5, elapsed: 2 },
            true,
        );
    }

    // =========================================================================
    // Video events (Ex)
    // =========================================================================

    private testOnFirstLocalVideoFramePublished(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstLocalVideoFramePublishedCallback",
            "onFirstLocalVideoFramePublished",
            "triggerOnFirstLocalVideoFramePublished",
            ["connection", "elapsed"],
            { elapsed: 2 },
            true,
        );
    }

    private testOnFirstRemoteVideoDecoded(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstRemoteVideoDecodedCallback",
            "onFirstRemoteVideoDecoded",
            "triggerOnFirstRemoteVideoDecoded",
            ["connection", "uid", "width", "height", "elapsed"],
            { uid: 2, width: 2, height: 2, elapsed: 2 },
            true,
        );
    }

    private testOnVideoSizeChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnVideoSizeChangedCallback",
            "onVideoSizeChanged",
            "triggerOnVideoSizeChanged",
            ["connection", "sourceType", "width", "height", "rotation", "elapsed"],
            { sourceType: 0, width: 2, height: 2, rotation: 2, elapsed: 2 },
            true,
        );
    }

    private testOnRemoteVideoStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteVideoStateChangedCallback",
            "onRemoteVideoStateChanged",
            "triggerOnRemoteVideoStateChanged",
            ["connection", "uid", "state", "reason", "elapsed"],
            { uid: 2, state: 1, reason: 5, elapsed: 2 },
            true,
        );
    }

    private testOnFirstRemoteVideoFrame(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstRemoteVideoFrameCallback",
            "onFirstRemoteVideoFrame",
            "triggerOnFirstRemoteVideoFrame",
            ["connection", "uid", "width", "height", "elapsed"],
            { uid: 2, width: 2, height: 2, elapsed: 2 },
            true,
        );
    }

    // =========================================================================
    // User events (Ex)
    // =========================================================================

    private testOnUserMuteAudio(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserMuteAudioCallback",
            "onUserMuteAudio",
            "triggerOnUserMuteAudio",
            ["connection", "uid", "muted"],
            { uid: 2, muted: true },
            true,
        );
    }

    private testOnUserMuteVideo(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserMuteVideoCallback",
            "onUserMuteVideo",
            "triggerOnUserMuteVideo",
            ["connection", "uid", "muted"],
            { uid: 2, muted: true },
            true,
        );
    }

    private testOnUserEnableVideo(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserEnableVideoCallback",
            "onUserEnableVideo",
            "triggerOnUserEnableVideo",
            ["connection", "uid", "enabled"],
            { uid: 2, enabled: true },
            true,
        );
    }

    private testOnUserEnableLocalVideo(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserEnableLocalVideoCallback",
            "onUserEnableLocalVideo",
            "triggerOnUserEnableLocalVideo",
            ["connection", "uid", "enabled"],
            { uid: 2, enabled: true },
            true,
        );
    }

    private testOnUserStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserStateChangedCallback",
            "onUserStateChanged",
            "triggerOnUserStateChanged",
            ["connection", "uid", "state"],
            { uid: 2, state: 2 },
            true,
        );
    }

    private testOnUserAccountUpdated(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserAccountUpdatedCallback",
            "onUserAccountUpdated",
            "triggerOnUserAccountUpdated",
            ["connection", "uid", "userAccount"],
            { uid: 2, userAccount: "agora" },
            true,
        );
    }

    // =========================================================================
    // Statistics (Ex)
    // =========================================================================

    private testOnRtcStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRtcStatsCallback",
            "onRtcStats",
            "triggerOnRtcStats",
            ["connection", "stats"],
            { stats: "object" },
            true,
        );
    }

    private testOnNetworkQuality(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnNetworkQualityCallback",
            "onNetworkQuality",
            "triggerOnNetworkQuality",
            ["connection", "uid", "txQuality", "rxQuality"],
            { uid: 2, txQuality: 2, rxQuality: 2 },
            true,
        );
    }

    private testOnLocalAudioStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalAudioStatsCallback",
            "onLocalAudioStats",
            "triggerOnLocalAudioStats",
            ["connection", "stats"],
            { stats: "object" },
            true,
        );
    }

    private testOnRemoteAudioStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteAudioStatsCallback",
            "onRemoteAudioStats",
            "triggerOnRemoteAudioStats",
            ["connection", "stats"],
            { stats: "object" },
            true,
        );
    }

    private testOnLocalVideoStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalVideoStatsCallback",
            "onLocalVideoStats",
            "triggerOnLocalVideoStats",
            ["connection", "source", "stats"],
            { source: 0, stats: "object" },
            true,
        );
    }

    private testOnRemoteVideoStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteVideoStatsCallback",
            "onRemoteVideoStats",
            "triggerOnRemoteVideoStats",
            ["connection", "stats"],
            { stats: "object" },
            true,
        );
    }

    // =========================================================================
    // Data channel (Ex)
    // =========================================================================

    private testOnStreamMessage(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnStreamMessageCallback",
            "onStreamMessage",
            "triggerOnStreamMessage",
            ["connection", "uid", "streamId", "data", "length", "sentTs"],
            { uid: 2, streamId: 2, data: new Uint8Array([97, 103]), length: 2, sentTs: 2 },
            true,
        );
    }

    private testOnStreamMessageError(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnStreamMessageErrorCallback",
            "onStreamMessageError",
            "triggerOnStreamMessageError",
            ["connection", "uid", "streamId", "code", "missed", "cached"],
            { uid: 2, streamId: 2, code: 2, missed: 2, cached: 2 },
            true,
        );
    }

    private testOnRdtMessage(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRdtMessageCallback",
            "onRdtMessage",
            "triggerOnRdtMessage",
            ["connection", "uid", "type", "data", "length"],
            { uid: 2, type: 1, data: "ag", length: 2 },
            true,
        );
    }

    private testOnRdtStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRdtStateChangedCallback",
            "onRdtStateChanged",
            "triggerOnRdtStateChanged",
            ["connection", "uid", "state"],
            { uid: 2, state: 1 },
            true,
        );
    }

    private testOnMediaControlMessage(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnMediaControlMessageCallback",
            "onMediaControlMessage",
            "triggerOnMediaControlMessage",
            ["connection", "uid", "data", "length"],
            { uid: 2, data: "ag", length: 2 },
            true,
        );
    }

    // =========================================================================
    // Client role (Ex)
    // =========================================================================

    private testOnClientRoleChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnClientRoleChangedCallback",
            "onClientRoleChanged",
            "triggerOnClientRoleChanged",
            ["connection", "oldRole", "newRole", "options"],
            { oldRole: 1, newRole: 2, options: "object" },
            true,
        );
    }

    private testOnClientRoleChangeFailed(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnClientRoleChangeFailedCallback",
            "onClientRoleChangeFailed",
            "triggerOnClientRoleChangeFailed",
            ["connection", "reason", "currentRole"],
            { reason: 1, currentRole: 2 },
            true,
        );
    }

    // =========================================================================
    // Network & security (Ex)
    // =========================================================================

    private testOnNetworkTypeChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnNetworkTypeChangedCallback",
            "onNetworkTypeChanged",
            "triggerOnNetworkTypeChanged",
            ["connection", "type"],
            { type: 1 },
            true,
        );
    }

    private testOnIntraRequestReceived(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnIntraRequestReceivedCallback",
            "onIntraRequestReceived",
            "triggerOnIntraRequestReceived",
            ["connection"],
            {},
            true,
        );
    }

    private testOnEncryptionError(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnEncryptionErrorCallback",
            "onEncryptionError",
            "triggerOnEncryptionError",
            ["connection", "errorType"],
            { errorType: 0 },
            true,
        );
    }

    private testOnSetRtmFlagResult(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnSetRtmFlagResultCallback",
            "onSetRtmFlagResult",
            "triggerOnSetRtmFlagResult",
            ["connection", "code"],
            { code: 2 },
            true,
        );
    }

    // =========================================================================
    // Misc (Ex)
    // =========================================================================

    private testOnUploadLogResult(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUploadLogResultCallback",
            "onUploadLogResult",
            "triggerOnUploadLogResult",
            ["connection", "requestId", "success", "reason"],
            { requestId: "agora", success: true, reason: 0 },
            true,
        );
    }

    private testOnSnapshotTaken(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnSnapshotTakenCallback",
            "onSnapshotTaken",
            "triggerOnSnapshotTaken",
            ["connection", "uid", "path", "width", "height", "errCode"],
            { uid: 2, path: "agora", width: 2, height: 2, errCode: 2 },
            true,
        );
    }

    private testOnVideoRenderingTracingResult(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnVideoRenderingTracingResultCallback",
            "onVideoRenderingTracingResult",
            "triggerOnVideoRenderingTracingResult",
            ["connection", "uid", "currentEvent", "tracingInfo"],
            { uid: 2, currentEvent: 0, tracingInfo: "object" },
            true,
        );
    }

    private testOnTranscodedStreamLayoutInfo(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnTranscodedStreamLayoutInfoCallback",
            "onTranscodedStreamLayoutInfo",
            "triggerOnTranscodedStreamLayoutInfo",
            ["connection", "uid", "width", "height", "layoutCount", "layoutInfo"],
            { uid: 2, width: 2, height: 2, layoutCount: 2 },
            true,
        );
    }

    private testOnAudioMetadataReceived(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioMetadataReceivedCallback",
            "onAudioMetadataReceived",
            "triggerOnAudioMetadataReceived",
            ["connection", "uid", "metadata", "length"],
            { uid: 2, metadata: new Uint8Array([97, 103]), length: 2 },
            true,
        );
    }

    private testOnMultipathStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnMultipathStatsCallback",
            "onMultipathStats",
            "triggerOnMultipathStats",
            ["connection", "stats"],
            { stats: "object" },
            true,
        );
    }

    private testOnRenewTokenResult(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRenewTokenResultCallback",
            "onRenewTokenResult",
            "triggerOnRenewTokenResult",
            ["connection", "token", "reason"],
            { token: "agora", reason: 2 },
            true,
        );
    }

    // =========================================================================
    // Non-overloaded: general events
    // =========================================================================

    private testOnError(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(runner, "OnErrorCallback", "onError", "triggerOnError", ["err", "msg"], {
            err: 2,
            msg: "agora",
        });
    }

    private testOnAudioDeviceStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioDeviceStateChangedCallback",
            "onAudioDeviceStateChanged",
            "triggerOnAudioDeviceStateChanged",
            ["deviceId", "deviceType", "deviceState"],
            { deviceId: "agora", deviceType: 2, deviceState: 2 },
        );
    }

    private testOnAudioDeviceVolumeChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioDeviceVolumeChangedCallback",
            "onAudioDeviceVolumeChanged",
            "triggerOnAudioDeviceVolumeChanged",
            ["deviceType", "volume", "muted"],
            { deviceType: 0, volume: 2, muted: true },
        );
    }

    private testOnAudioEffectFinished(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioEffectFinishedCallback",
            "onAudioEffectFinished",
            "triggerOnAudioEffectFinished",
            ["soundId"],
            { soundId: 2 },
        );
    }

    private testOnAudioMixingPositionChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioMixingPositionChangedCallback",
            "onAudioMixingPositionChanged",
            "triggerOnAudioMixingPositionChanged",
            ["position"],
            { position: 2 },
        );
    }

    private testOnAudioMixingFinished(runner: TestRunner): Promise<void> {
        runner.log("\n--- Test: OnAudioMixingFinishedCallback ---");
        this.setup();
        (jsb as any).agora.test.triggerOnAudioMixingFinished();
        runner.assert(true, "deprecated onAudioMixingFinished trigger should not crash");
        this.cleanup();
        return Promise.resolve();
    }

    private testOnAudioMixingStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioMixingStateChangedCallback",
            "onAudioMixingStateChanged",
            "triggerOnAudioMixingStateChanged",
            ["state", "reason"],
            { state: 710, reason: 724 },
        );
    }

    private testOnVideoDeviceStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnVideoDeviceStateChangedCallback",
            "onVideoDeviceStateChanged",
            "triggerOnVideoDeviceStateChanged",
            ["deviceId", "deviceType", "deviceState"],
            { deviceId: "agora", deviceType: 2, deviceState: 2 },
        );
    }

    private testOnLastmileQuality(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLastmileQualityCallback",
            "onLastmileQuality",
            "triggerOnLastmileQuality",
            ["quality"],
            { quality: 2 },
        );
    }

    private testOnLastmileProbeResult(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLastmileProbeResultCallback",
            "onLastmileProbeResult",
            "triggerOnLastmileProbeResult",
            ["result"],
            { result: "object" },
        );
    }

    private testOnFirstLocalVideoFrame(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnFirstLocalVideoFrameCallback",
            "onFirstLocalVideoFrame",
            "triggerOnFirstLocalVideoFrame",
            ["source", "width", "height", "elapsed"],
            { source: 0, width: 2, height: 2, elapsed: 2 },
        );
    }

    private testOnLocalVideoEvent(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalVideoEventCallback",
            "onLocalVideoEvent",
            "triggerOnLocalVideoEvent",
            ["source", "event"],
            { source: 0, event: 0 },
        );
    }

    private testOnLocalVideoStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalVideoStateChangedCallback",
            "onLocalVideoStateChanged",
            "triggerOnLocalVideoStateChanged",
            ["source", "state", "reason"],
            { source: 0, state: 1, reason: 0 },
        );
    }

    private testOnCameraReady(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(runner, "OnCameraReadyCallback", "onCameraReady", "triggerOnCameraReady", [], {});
    }

    private testOnCameraFocusAreaChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnCameraFocusAreaChangedCallback",
            "onCameraFocusAreaChanged",
            "triggerOnCameraFocusAreaChanged",
            ["x", "y", "width", "height"],
            { x: 2, y: 2, width: 2, height: 2 },
        );
    }

    private testOnCameraExposureAreaChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnCameraExposureAreaChangedCallback",
            "onCameraExposureAreaChanged",
            "triggerOnCameraExposureAreaChanged",
            ["x", "y", "width", "height"],
            { x: 2, y: 2, width: 2, height: 2 },
        );
    }

    private testOnVideoStopped(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnVideoStoppedCallback",
            "onVideoStopped",
            "triggerOnVideoStopped",
            [],
            {},
        );
    }

    private testOnRhythmPlayerStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRhythmPlayerStateChangedCallback",
            "onRhythmPlayerStateChanged",
            "triggerOnRhythmPlayerStateChanged",
            ["state", "reason"],
            { state: 811, reason: 0 },
        );
    }

    private testOnChannelMediaRelayStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnChannelMediaRelayStateChangedCallback",
            "onChannelMediaRelayStateChanged",
            "triggerOnChannelMediaRelayStateChanged",
            ["state", "code"],
            { state: 2, code: 2 },
        );
    }

    private testOnAudioRoutingChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioRoutingChangedCallback",
            "onAudioRoutingChanged",
            "triggerOnAudioRoutingChanged",
            ["routing"],
            { routing: 2 },
        );
    }

    private testOnRemoteAudioTransportStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteAudioTransportStatsCallback",
            "onRemoteAudioTransportStats",
            "triggerOnRemoteAudioTransportStats",
            ["connection", "remoteUid", "delay", "lost", "rxKBitRate"],
            { remoteUid: 2, delay: 2, lost: 2, rxKBitRate: 2 },
            true,
        );
    }

    private testOnRemoteVideoTransportStats(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteVideoTransportStatsCallback",
            "onRemoteVideoTransportStats",
            "triggerOnRemoteVideoTransportStats",
            ["connection", "remoteUid", "delay", "lost", "rxKBitRate"],
            { remoteUid: 2, delay: 2, lost: 2, rxKBitRate: 2 },
            true,
        );
    }

    private testOnRemoteSubscribeFallbackToAudioOnly(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRemoteSubscribeFallbackToAudioOnlyCallback",
            "onRemoteSubscribeFallbackToAudioOnly",
            "triggerOnRemoteSubscribeFallbackToAudioOnly",
            ["uid", "isFallbackOrRecover"],
            { uid: 2, isFallbackOrRecover: true },
        );
    }

    private testOnAudioPublishStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioPublishStateChangedCallback",
            "onAudioPublishStateChanged",
            "triggerOnAudioPublishStateChanged",
            ["channel", "oldState", "newState", "elapsed"],
            { channel: "agora", oldState: 0, newState: 2, elapsed: 2 },
        );
    }

    private testOnAudioSubscribeStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnAudioSubscribeStateChangedCallback",
            "onAudioSubscribeStateChanged",
            "triggerOnAudioSubscribeStateChanged",
            ["channel", "uid", "oldState", "newState", "elapsed"],
            { channel: "agora", uid: 2, oldState: 0, newState: 3, elapsed: 2 },
        );
    }

    private testOnVideoPublishStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnVideoPublishStateChangedCallback",
            "onVideoPublishStateChanged",
            "triggerOnVideoPublishStateChanged",
            ["source", "channel", "oldState", "newState", "elapsed"],
            { source: 0, channel: "agora", oldState: 0, newState: 2, elapsed: 2 },
        );
    }

    private testOnVideoSubscribeStateChanged(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnVideoSubscribeStateChangedCallback",
            "onVideoSubscribeStateChanged",
            "triggerOnVideoSubscribeStateChanged",
            ["channel", "uid", "oldState", "newState", "elapsed"],
            { channel: "agora", uid: 2, oldState: 0, newState: 3, elapsed: 2 },
        );
    }

    private testOnPermissionError(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnPermissionErrorCallback",
            "onPermissionError",
            "triggerOnPermissionError",
            ["permissionType"],
            { permissionType: 0 },
        );
    }

    private testOnLocalUserRegistered(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalUserRegisteredCallback",
            "onLocalUserRegistered",
            "triggerOnLocalUserRegistered",
            ["uid", "userAccount"],
            { uid: 2, userAccount: "agora" },
        );
    }

    private testOnUserInfoUpdated(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnUserInfoUpdatedCallback",
            "onUserInfoUpdated",
            "triggerOnUserInfoUpdated",
            ["uid", "info"],
            { uid: 2, info: "object" },
        );
    }

    private testOnContentInspectResult(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnContentInspectResultCallback",
            "onContentInspectResult",
            "triggerOnContentInspectResult",
            ["result"],
            { result: 1 },
        );
    }

    private testOnProxyConnected(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnProxyConnectedCallback",
            "onProxyConnected",
            "triggerOnProxyConnected",
            ["channel", "uid", "proxyType", "localProxyIp", "elapsed"],
            { channel: "agora", uid: 2, proxyType: 6, localProxyIp: "agora", elapsed: 2 },
        );
    }

    private testOnRtmpStreamingEvent(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnRtmpStreamingEventCallback",
            "onRtmpStreamingEvent",
            "triggerOnRtmpStreamingEvent",
            ["url", "eventCode"],
            { url: "agora", eventCode: 1 },
        );
    }

    private testOnLocalVideoTranscoderError(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnLocalVideoTranscoderErrorCallback",
            "onLocalVideoTranscoderError",
            "triggerOnLocalVideoTranscoderError",
            ["stream", "errorCode"],
            { stream: "object", errorCode: 1 },
        );
    }

    private testOnExtensionErrorWithContext(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnExtensionErrorWithContextCallback",
            "onExtensionErrorWithContext",
            "triggerOnExtensionErrorWithContext",
            ["context", "code", "msg"],
            { context: "object", code: 2, msg: "agora" },
        );
    }

    private testOnExtensionEventWithContext(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnExtensionEventWithContextCallback",
            "onExtensionEventWithContext",
            "triggerOnExtensionEventWithContext",
            ["context", "key", "value"],
            { context: "object", key: "agora", value: "agora" },
        );
    }

    private testOnExtensionStartedWithContext(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnExtensionStartedWithContextCallback",
            "onExtensionStartedWithContext",
            "triggerOnExtensionStartedWithContext",
            ["context"],
            { context: "object" },
        );
    }

    private testOnExtensionStoppedWithContext(runner: TestRunner): Promise<void> {
        return this.runCallbackTest(
            runner,
            "OnExtensionStoppedWithContextCallback",
            "onExtensionStoppedWithContext",
            "triggerOnExtensionStoppedWithContext",
            ["context"],
            { context: "object" },
        );
    }

    // =========================================================================
    // Setup / teardown
    // =========================================================================

    private setup(): void {
        (jsb as any).agora.test.reset();
        this.result = null;
        this.bridge = new (jsb as any).agora.RtcEngineExBridge() as IRtcEngineEx;
    }

    private cleanup(): void {
        this.bridge.release(true);
        this.result = null;
    }
}
