/**
 * Stub declarations for Cocos Creator "cc" module
 * Used only for generating .d.ts files from assets/agora-rtc
 */

declare namespace jsb {
    namespace agora {
        //only a empty class, do not write any method into it
        class RtcEngineExBridge {}

        namespace test {
            function reset(): void;
            function readLog(): string;
            function clearLog(): void;
            function triggerOnJoinChannelSuccess(): void;
            function triggerOnRejoinChannelSuccess(): void;
            function triggerOnLeaveChannel(): void;
            function triggerOnUserJoined(): void;
            function triggerOnUserOffline(): void;
            function triggerOnConnectionLost(): void;
            function triggerOnConnectionInterrupted(): void;
            function triggerOnConnectionBanned(): void;
            function triggerOnTokenPrivilegeWillExpire(): void;
            function triggerOnRequestToken(): void;
            function triggerOnLicenseValidationFailure(): void;
            function triggerOnAudioQuality(): void;
            function triggerOnRtcStats(): void;
            function triggerOnNetworkQuality(): void;
            function triggerOnIntraRequestReceived(): void;
            function triggerOnFirstLocalVideoFramePublished(): void;
            function triggerOnFirstRemoteVideoDecoded(): void;
            function triggerOnVideoSizeChanged(): void;
            function triggerOnRemoteVideoStateChanged(): void;
            function triggerOnFirstRemoteVideoFrame(): void;
            function triggerOnUserMuteAudio(): void;
            function triggerOnUserMuteVideo(): void;
            function triggerOnUserEnableVideo(): void;
            function triggerOnUserEnableLocalVideo(): void;
            function triggerOnUserStateChanged(): void;
            function triggerOnLocalAudioStats(): void;
            function triggerOnRemoteAudioStats(): void;
            function triggerOnLocalVideoStats(): void;
            function triggerOnRemoteVideoStats(): void;
            function triggerOnStreamMessage(): void;
            function triggerOnStreamMessageError(): void;
            function triggerOnRdtMessage(): void;
            function triggerOnRdtStateChanged(): void;
            function triggerOnMediaControlMessage(): void;
            function triggerOnFirstLocalAudioFramePublished(): void;
            function triggerOnFirstRemoteAudioFrame(): void;
            function triggerOnFirstRemoteAudioDecoded(): void;
            function triggerOnLocalAudioStateChanged(): void;
            function triggerOnRemoteAudioStateChanged(): void;
            function triggerOnActiveSpeaker(): void;
            function triggerOnClientRoleChanged(): void;
            function triggerOnClientRoleChangeFailed(): void;
            function triggerOnNetworkTypeChanged(): void;
            function triggerOnEncryptionError(): void;
            function triggerOnUploadLogResult(): void;
            function triggerOnUserAccountUpdated(): void;
            function triggerOnSnapshotTaken(): void;
            function triggerOnVideoRenderingTracingResult(): void;
            function triggerOnSetRtmFlagResult(): void;
            function triggerOnTranscodedStreamLayoutInfo(): void;
            function triggerOnAudioMetadataReceived(): void;
            function triggerOnMultipathStats(): void;
            function triggerOnRenewTokenResult(): void;
            function triggerOnError(): void;
            function triggerOnAudioDeviceStateChanged(): void;
            function triggerOnAudioDeviceVolumeChanged(): void;
            function triggerOnAudioEffectFinished(): void;
            function triggerOnAudioMixingPositionChanged(): void;
            function triggerOnAudioMixingFinished(): void;
            function triggerOnAudioMixingStateChanged(): void;
            function triggerOnVideoDeviceStateChanged(): void;
            function triggerOnLastmileQuality(): void;
            function triggerOnLastmileProbeResult(): void;
            function triggerOnFirstLocalVideoFrame(): void;
            function triggerOnLocalVideoEvent(): void;
            function triggerOnLocalVideoStateChanged(): void;
            function triggerOnCameraReady(): void;
            function triggerOnCameraFocusAreaChanged(): void;
            function triggerOnCameraExposureAreaChanged(): void;
            function triggerOnVideoStopped(): void;
            function triggerOnRhythmPlayerStateChanged(): void;
            function triggerOnChannelMediaRelayStateChanged(): void;
            function triggerOnAudioRoutingChanged(): void;
            function triggerOnRemoteAudioTransportStats(): void;
            function triggerOnRemoteVideoTransportStats(): void;
            function triggerOnRemoteSubscribeFallbackToAudioOnly(): void;
            function triggerOnAudioPublishStateChanged(): void;
            function triggerOnAudioSubscribeStateChanged(): void;
            function triggerOnVideoPublishStateChanged(): void;
            function triggerOnVideoSubscribeStateChanged(): void;
            function triggerOnPermissionError(): void;
            function triggerOnLocalUserRegistered(): void;
            function triggerOnUserInfoUpdated(): void;
            function triggerOnContentInspectResult(): void;
            function triggerOnProxyConnected(): void;
            function triggerOnRtmpStreamingEvent(): void;
            function triggerOnLocalVideoTranscoderError(): void;
            function triggerOnExtensionErrorWithContext(): void;
            function triggerOnExtensionEventWithContext(): void;
            function triggerOnExtensionStartedWithContext(): void;
            function triggerOnExtensionStoppedWithContext(): void;
        }
    }
}

declare module "cc" {
    export class Texture2D {
        width: number;
        height: number;
    }

    export const sys: {
        isBrowser: boolean;
        isNative: boolean;
        isMobile: boolean;
        platform: string;
    };

    export const _decorator: {
        ccclass: (name?: string) => ClassDecorator;
        property: (typeOrOptions?: any) => PropertyDecorator;
    };
}
