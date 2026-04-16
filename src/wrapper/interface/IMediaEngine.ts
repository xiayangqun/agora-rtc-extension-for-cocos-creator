import type { AUDIO_TRACK_TYPE, AudioTrackConfig, EncodedVideoFrameInfo, SenderOptions } from "../types/AgoraBase";
import type { AudioFrame, EXTERNAL_VIDEO_SOURCE_TYPE, ExternalVideoFrame } from "../types/AgoraMediaBase";
import type { IFaceInfoObserver } from "./IFaceInfoObserver";
import type { IVideoFrameObserver } from "./IVideoFrameObserver";

export interface IMediaEngine {
    registerAudioFrameObserver(observer: unknown): number;

    registerVideoFrameObserver(observer: IVideoFrameObserver): number;

    registerVideoEncodedFrameObserver(observer: unknown): number;

    registerFaceInfoObserver(observer: IFaceInfoObserver): number;

    pushAudioFrame(frame: AudioFrame, trackId: number): number;

    pullAudioFrame(frame: AudioFrame): number;

    setExternalVideoSource(enabled: boolean, useTexture: boolean, sourceType: EXTERNAL_VIDEO_SOURCE_TYPE, encodedVideoOption: SenderOptions): number;

    setExternalRemoteEglContext(eglContext: unknown): number;

    setExternalAudioSource(enabled: boolean, sampleRate: number, channels: number, localPlayback: boolean, publish: boolean): number;

    createCustomAudioTrack(trackType: AUDIO_TRACK_TYPE, config: AudioTrackConfig): number;

    destroyCustomAudioTrack(trackId: number): number;

    setExternalAudioSink(enabled: boolean, sampleRate: number, channels: number): number;

    enableCustomAudioLocalPlayback(trackId: number, enabled: boolean): number;

    pushVideoFrame(frame: ExternalVideoFrame, videoTrackId: number): number;

    pushEncodedVideoImage(imageBuffer: Uint8Array, length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo, videoTrackId: number): number;
}
