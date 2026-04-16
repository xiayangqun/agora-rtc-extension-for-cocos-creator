import type { VIDEO_SOURCE_TYPE, VideoFrame } from "../types/AgoraMediaBase";

export abstract class IVideoFrameObserver {
    abstract onCaptureVideoFrame(sourceType: VIDEO_SOURCE_TYPE, videoFrame: VideoFrame): boolean;

    abstract onPreEncodeVideoFrame(sourceType: VIDEO_SOURCE_TYPE, videoFrame: VideoFrame): boolean;

    abstract onMediaPlayerVideoFrame(videoFrame: VideoFrame, mediaPlayerId: number): boolean;

    abstract onRenderVideoFrame(channelId: string, remoteUid: number, videoFrame: VideoFrame): boolean;

    abstract onTranscodedVideoFrame(videoFrame: VideoFrame): boolean;
}
