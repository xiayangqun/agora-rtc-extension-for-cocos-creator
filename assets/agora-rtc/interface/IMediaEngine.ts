import type { AUDIO_TRACK_TYPE, AudioTrackConfig, EncodedVideoFrameInfo, SenderOptions } from "../types/AgoraBase";
import type { AudioFrame, EXTERNAL_VIDEO_SOURCE_TYPE, ExternalVideoFrame } from "../types/AgoraMediaBase";
import type { IFaceInfoObserver } from "./IFaceInfoObserver";

//not support yet
// export interface IMediaEngine {
//     registerAudioFrameObserver(observer: unknown): Promise<number>;

//     registerVideoFrameObserver(observer: unknown): Promise<number>;

//     registerVideoEncodedFrameObserver(observer: unknown): Promise<number>;

//     registerFaceInfoObserver(observer: IFaceInfoObserver): Promise<number>;

//     pushAudioFrame(frame: AudioFrame, trackId: number): Promise<number>;

//     pullAudioFrame(frame: AudioFrame): Promise<number>;

//     setExternalVideoSource(
//         enabled: boolean,
//         useTexture: boolean,
//         sourceType: EXTERNAL_VIDEO_SOURCE_TYPE,
//         encodedVideoOption: SenderOptions,
//     ): Promise<number>;

//     setExternalRemoteEglContext(eglContext: unknown): Promise<number>;

//     setExternalAudioSource(
//         enabled: boolean,
//         sampleRate: number,
//         channels: number,
//         localPlayback: boolean,
//         publish: boolean,
//     ): Promise<number>;

//     createCustomAudioTrack(trackType: AUDIO_TRACK_TYPE, config: AudioTrackConfig): Promise<number>;

//     destroyCustomAudioTrack(trackId: number): Promise<number>;

//     setExternalAudioSink(enabled: boolean, sampleRate: number, channels: number): Promise<number>;

//     enableCustomAudioLocalPlayback(trackId: number, enabled: boolean): Promise<number>;

//     pushVideoFrame(frame: ExternalVideoFrame, videoTrackId: number): Promise<number>;

//     pushEncodedVideoImage(
//         imageBuffer: Uint8Array,
//         length: number,
//         videoEncodedFrameInfo: EncodedVideoFrameInfo,
//         videoTrackId: number,
//     ): Promise<number>;
// }
