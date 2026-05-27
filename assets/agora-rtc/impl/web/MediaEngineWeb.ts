import { IMediaEngine } from "../../interface/IMediaEngine";
import {
    ERROR_CODE_TYPE,
    AUDIO_TRACK_TYPE,
    AudioTrackConfig,
    EncodedVideoFrameInfo,
    SenderOptions,
} from "../../types/AgoraBase";
import { AudioFrame, EXTERNAL_VIDEO_SOURCE_TYPE, ExternalVideoFrame } from "../../types/AgoraMediaBase";
import { IFaceInfoObserver } from "../../interface/IFaceInfoObserver";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class MediaEngineWeb implements IMediaEngine {
    async registerAudioFrameObserver(observer: unknown): Promise<number> {
        console.warn("registerAudioFrameObserver not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async registerVideoFrameObserver(observer: unknown): Promise<number> {
        console.warn("registerVideoFrameObserver not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async registerVideoEncodedFrameObserver(observer: unknown): Promise<number> {
        console.warn("registerVideoEncodedFrameObserver not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async registerFaceInfoObserver(observer: IFaceInfoObserver): Promise<number> {
        console.warn("registerFaceInfoObserver not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pushAudioFrame(frame: AudioFrame, trackId: number): Promise<number> {
        console.warn("pushAudioFrame not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pullAudioFrame(frame: AudioFrame): Promise<number> {
        console.warn("pullAudioFrame not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setExternalVideoSource(
        enabled: boolean,
        useTexture: boolean,
        sourceType: EXTERNAL_VIDEO_SOURCE_TYPE,
        encodedVideoOption: SenderOptions,
    ): Promise<number> {
        console.warn("setExternalVideoSource not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setExternalRemoteEglContext(eglContext: unknown): Promise<number> {
        console.warn("setExternalRemoteEglContext not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setExternalAudioSource(
        enabled: boolean,
        sampleRate: number,
        channels: number,
        localPlayback: boolean,
        publish: boolean,
    ): Promise<number> {
        console.warn("setExternalAudioSource not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async createCustomAudioTrack(trackType: AUDIO_TRACK_TYPE, config: AudioTrackConfig): Promise<number> {
        console.warn("createCustomAudioTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async destroyCustomAudioTrack(trackId: number): Promise<number> {
        console.warn("destroyCustomAudioTrack not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setExternalAudioSink(enabled: boolean, sampleRate: number, channels: number): Promise<number> {
        console.warn("setExternalAudioSink not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async enableCustomAudioLocalPlayback(trackId: number, enabled: boolean): Promise<number> {
        console.warn("enableCustomAudioLocalPlayback not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pushVideoFrame(frame: ExternalVideoFrame, videoTrackId: number): Promise<number> {
        console.warn("pushVideoFrame not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async pushEncodedVideoImage(
        imageBuffer: Uint8Array,
        length: number,
        videoEncodedFrameInfo: EncodedVideoFrameInfo,
        videoTrackId: number,
    ): Promise<number> {
        console.warn("pushEncodedVideoImage not support in web");
        return -ERR_NOT_SUPPORTED;
    }
}
