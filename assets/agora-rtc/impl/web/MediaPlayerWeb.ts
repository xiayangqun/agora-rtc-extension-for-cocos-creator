import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { IMediaPlayer } from "../../interface/IMediaPlayer";
import { IMediaPlayerSourceObserver } from "../../interface/IMediaPlayerSourceObserver";
import {
    MEDIA_PLAYER_STATE,
    MEDIA_PLAYER_REASON,
    MEDIA_PLAYER_EVENT,
    MediaSource,
    PlayerStreamInfo,
} from "../../types/AgoraMediaPlayerTypes";
import { SpatialAudioParams } from "../../types/AgoraBase";
import { RENDER_MODE_TYPE, AUDIO_DUAL_MONO_MODE } from "../../types/AgoraMediaBase";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";
import { AgoraRTCClientProxy } from "./AgoraRTCClientProxy";

export class MediaPlayerWeb implements IMediaPlayer {
    private _id: number;
    private _eventHandler?: IMediaPlayerSourceObserver;
    private _videoElement: HTMLVideoElement;
    private _mediaStream?: MediaStream;
    private _state: MEDIA_PLAYER_STATE = MEDIA_PLAYER_STATE.PLAYER_STATE_IDLE;
    private _url = "";
    private _loopCount = 1;
    private _currentLoop = 0;
    private _playbackSpeed = 1.0;
    private _muted = false;
    private _playoutVolume = 100;
    private _publishSignalVolume = 100;
    private _duration = 0;
    private _audioTrackIndex = 0;
    private _audioTracks: MediaStreamTrack[] = [];

    private _audioPublishedClient: AgoraRTCClientProxy = null;
    private _videoPublishedClient: AgoraRTCClientProxy = null;

    public audio: ILocalAudioTrack = null;
    public video: ILocalVideoTrack = null;

    constructor(id: number) {
        this._id = id;
        this._videoElement = document.createElement("video");
        this._videoElement.muted = true;
        this._videoElement.playsInline = true;
        this._videoElement.style.display = "none";
        this._videoElement.crossOrigin = "anonymous";
        document.body.appendChild(this._videoElement);

        this._setupVideoListeners();
    }

    private _setupVideoListeners(): void {
        this._videoElement.addEventListener("canplay", () => {
            this._duration = this._videoElement.duration * 1000;
            this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_OPEN_COMPLETED, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
            this._eventHandler?.onPlayerEvent(MEDIA_PLAYER_EVENT.PLAYER_EVENT_TRY_OPEN_SUCCEED, 0, "");
        });

        this._videoElement.addEventListener("play", () => {
            this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYING, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
        });

        this._videoElement.addEventListener("pause", () => {
            if (this._state === MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYING) {
                this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_PAUSED, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
            }
        });

        this._videoElement.addEventListener("ended", () => {
            this._currentLoop++;
            if (this._currentLoop < this._loopCount || this._loopCount === -1) {
                this._videoElement.currentTime = 0;
                this._videoElement.play().catch(() => {});
            } else {
                this._changeState(
                    MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYBACK_COMPLETED,
                    MEDIA_PLAYER_REASON.PLAYER_REASON_NONE,
                );
                this._eventHandler?.onCompleted();
            }
        });

        this._videoElement.addEventListener("error", () => {
            const error = this._videoElement.error;
            let reason = MEDIA_PLAYER_REASON.PLAYER_REASON_INTERNAL;
            if (error) {
                if (error.code === MediaError.MEDIA_ERR_NETWORK) {
                    reason = MEDIA_PLAYER_REASON.PLAYER_REASON_INVALID_CONNECTION_STATE;
                } else if (error.code === MediaError.MEDIA_ERR_DECODE) {
                    reason = MEDIA_PLAYER_REASON.PLAYER_REASON_CODEC_NOT_SUPPORTED;
                } else if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    reason = MEDIA_PLAYER_REASON.PLAYER_REASON_INVALID_MEDIA_SOURCE;
                }
            }
            this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_FAILED, reason);
            this._eventHandler?.onPlayerEvent(MEDIA_PLAYER_EVENT.PLAYER_EVENT_TRY_OPEN_FAILED, 0, "");
        });

        this._videoElement.addEventListener("seeking", () => {
            this._eventHandler?.onPlayerEvent(MEDIA_PLAYER_EVENT.PLAYER_EVENT_SEEK_BEGIN, 0, "");
        });

        this._videoElement.addEventListener("seeked", () => {
            this._eventHandler?.onPlayerEvent(MEDIA_PLAYER_EVENT.PLAYER_EVENT_SEEK_COMPLETE, 0, "");
        });

        this._videoElement.addEventListener("timeupdate", () => {
            const positionMs = Math.floor(this._videoElement.currentTime * 1000);
            const timestampMs = Date.now();
            this._eventHandler?.onPositionChanged(positionMs, timestampMs);
        });
    }

    private _changeState(newState: MEDIA_PLAYER_STATE, reason: MEDIA_PLAYER_REASON): void {
        const oldState = this._state;
        this._state = newState;
        if (oldState !== newState) {
            this._eventHandler?.onPlayerSourceStateChanged(newState, reason);
        }
    }

    private async _captureStream(): Promise<void> {
        if (!(this._videoElement as any).captureStream) {
            console.warn("captureStream is not supported in this browser");
            return;
        }

        this._mediaStream = (this._videoElement as any).captureStream();

        // 保存所有 audio tracks
        this._audioTracks = this._mediaStream.getAudioTracks();

        const videoStreamTrack = this._mediaStream.getVideoTracks()[0];

        if (videoStreamTrack) {
            this.video = AgoraRTC.createCustomVideoTrack({
                mediaStreamTrack: videoStreamTrack,
            });
        }

        // 根据当前选中的 index 创建 audio track
        await this._updateAudioTrack();
    }

    private async _updateAudioTrack(): Promise<void> {
        if (!this._audioTracks || this._audioTracks.length === 0) {
            this.audio = null;
            return;
        }

        const trackIndex = Math.min(this._audioTrackIndex, this._audioTracks.length - 1);
        const audioStreamTrack = this._audioTracks[trackIndex];

        if (audioStreamTrack) {
            this.audio = AgoraRTC.createCustomAudioTrack({
                mediaStreamTrack: audioStreamTrack,
            });
        }
    }

    /**
     * 发布/取消发布 MediaPlayer 的音频轨道到指定 client
     * @param client 目标 AgoraRTCClientProxy
     * @param publish true 表示发布，false 表示取消发布
     */
    async publishAudio(client: AgoraRTCClientProxy, publish: boolean = true): Promise<number> {
        if (publish && !client) {
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }

        // 如果之前发布到了其他 client，先取消发布
        if (publish && this._audioPublishedClient && this._audioPublishedClient !== client) {
            if (this.audio) {
                await this._audioPublishedClient.unpublish(this.audio);
            }
        }

        if (publish) {
            this._audioPublishedClient = client;
        }

        if (publish && this.audio) {
            if (!this._audioPublishedClient) {
                await client.publish(this.audio);
                this._audioPublishedClient = client;
            }
        } else if (!publish && this.audio && this._audioPublishedClient) {
            await this._audioPublishedClient.unpublish(this.audio);
            this._audioPublishedClient = null;
        }

        return ERROR_CODE_TYPE.ERR_OK;
    }

    /**
     * 发布/取消发布 MediaPlayer 的视频轨道到指定 client
     * @param client 目标 AgoraRTCClientProxy
     * @param publish true 表示发布，false 表示取消发布
     */
    async publishVideo(client: AgoraRTCClientProxy, publish: boolean = true): Promise<number> {
        if (publish && !client) {
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }

        // 如果之前发布到了其他 client，先取消发布
        if (publish && this._videoPublishedClient && this._videoPublishedClient !== client) {
            if (this.video) {
                await this._videoPublishedClient.unpublish(this.video);
            }
        }

        if (publish) {
            this._videoPublishedClient = client;
        }

        if (publish && this.video) {
            if (!this._videoPublishedClient) {
                await client.publish(this.video);
                this._videoPublishedClient = client;
            }
        } else if (!publish && this.video && this._videoPublishedClient) {
            await this._videoPublishedClient.unpublish(this.video);
            this._videoPublishedClient = null;
        }

        return ERROR_CODE_TYPE.ERR_OK;
    }

    private async _replaceAudioTrack(): Promise<void> {
        const clientProxy = this._audioPublishedClient;
        const isPublished = !!clientProxy;

        // 如果已发布，先 unpublish
        if (isPublished && clientProxy && this.audio) {
            await clientProxy.unpublish(this.audio);
        }

        // 关闭旧的 track
        this.audio?.close();

        // 尝试重新获取 audio tracks
        // 先尝试从现有 MediaStream 获取
        let audioTracks = this._mediaStream.getAudioTracks();

        // 如果 track 数量不对，重新 capture stream
        if (audioTracks.length === 0 || this._audioTrackIndex >= audioTracks.length) {
            this._mediaStream = (this._videoElement as any).captureStream();
            audioTracks = this._mediaStream.getAudioTracks();
        }

        this._audioTracks = audioTracks;

        // 创建新的 audio track
        await this._updateAudioTrack();

        // 如果之前在发布，重新 publish
        if (isPublished && clientProxy && this.audio) {
            await clientProxy.publish(this.audio);
        }
    }

    async dispose(): Promise<void> {
        this._videoElement.pause();
        this._videoElement.src = "";
        this._videoElement.load();

        // 从已发布的 client 取消发布 audio
        if (this._audioPublishedClient) {
            if (this.audio) {
                await this._audioPublishedClient.unpublish(this.audio);
            }
            this._audioPublishedClient = null;
        }

        // 从已发布的 client 取消发布 video
        if (this._videoPublishedClient) {
            if (this.video) {
                await this._videoPublishedClient.unpublish(this.video);
            }
            this._videoPublishedClient = null;
        }

        this.audio?.close();
        this.video?.close();
        this.audio = null;
        this.video = null;

        this._mediaStream?.getTracks().forEach((track) => track.stop());
        this._mediaStream = undefined;

        if (this._videoElement.parentNode) {
            this._videoElement.parentNode.removeChild(this._videoElement);
        }

        this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_IDLE, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
    }

    async getId(): Promise<number> {
        return this._id;
    }

    async initEventHandler(engineEventHandler: IMediaPlayerSourceObserver): Promise<number> {
        this._eventHandler = engineEventHandler;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async open(url: string, startPos: number): Promise<number> {
        this._url = url;
        this._currentLoop = 0;
        this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_OPENING, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
        this._eventHandler?.onPlayerEvent(MEDIA_PLAYER_EVENT.PLAYER_EVENT_TRY_OPEN_START, 0, "");

        this._videoElement.src = url;
        this._videoElement.currentTime = startPos / 1000;
        this._videoElement.load();

        return ERROR_CODE_TYPE.ERR_OK;
    }

    async openWithMediaSource(source: MediaSource): Promise<number> {
        if (source.url) {
            return this.open(source.url, source.startPos || 0);
        }
        return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
    }

    async play(): Promise<number> {
        if (
            this._state !== MEDIA_PLAYER_STATE.PLAYER_STATE_OPEN_COMPLETED &&
            this._state !== MEDIA_PLAYER_STATE.PLAYER_STATE_PAUSED &&
            this._state !== MEDIA_PLAYER_STATE.PLAYER_STATE_STOPPED
        ) {
            return -ERROR_CODE_TYPE.ERR_NOT_READY;
        }

        try {
            await this._videoElement.play();
            await this._captureStream();
            this._videoElement.playbackRate = this._playbackSpeed;
            return ERROR_CODE_TYPE.ERR_OK;
        } catch (error) {
            this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_FAILED, MEDIA_PLAYER_REASON.PLAYER_REASON_INTERNAL);
            return -ERROR_CODE_TYPE.ERR_FAILED;
        }
    }

    async pause(): Promise<number> {
        if (this._state !== MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYING) {
            return -ERROR_CODE_TYPE.ERR_NOT_READY;
        }

        this._videoElement.pause();
        this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_PAUSED, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async stop(): Promise<number> {
        this._videoElement.pause();
        this._videoElement.currentTime = 0;
        this._currentLoop = 0;

        // 从已发布的 client 取消发布 audio
        if (this._audioPublishedClient) {
            if (this.audio) {
                await this._audioPublishedClient.unpublish(this.audio);
            }
            this._audioPublishedClient = null;
        }

        // 从已发布的 client 取消发布 video
        if (this._videoPublishedClient) {
            if (this.video) {
                await this._videoPublishedClient.unpublish(this.video);
            }
            this._videoPublishedClient = null;
        }

        this.audio?.close();
        this.video?.close();
        this.audio = null;
        this.video = null;

        this._mediaStream?.getTracks().forEach((track) => track.stop());
        this._mediaStream = undefined;

        this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_STOPPED, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async resume(): Promise<number> {
        if (this._state !== MEDIA_PLAYER_STATE.PLAYER_STATE_PAUSED) {
            return -ERROR_CODE_TYPE.ERR_NOT_READY;
        }

        try {
            await this._videoElement.play();
            this._changeState(MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYING, MEDIA_PLAYER_REASON.PLAYER_REASON_NONE);
            return ERROR_CODE_TYPE.ERR_OK;
        } catch (error) {
            return -ERROR_CODE_TYPE.ERR_FAILED;
        }
    }

    async seek(newPos: number): Promise<number> {
        try {
            this._videoElement.currentTime = newPos / 1000;
            return ERROR_CODE_TYPE.ERR_OK;
        } catch (error) {
            this._eventHandler?.onPlayerEvent(MEDIA_PLAYER_EVENT.PLAYER_EVENT_SEEK_ERROR, 0, "");
            return -ERROR_CODE_TYPE.ERR_FAILED;
        }
    }

    async setAudioPitch(pitch: number): Promise<number> {
        // Not supported in web
        console.warn("setAudioPitch not supported in web");
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async getDuration(): Promise<{ duration: number; errorCode: number }> {
        return { duration: this._duration, errorCode: ERROR_CODE_TYPE.ERR_OK };
    }

    async getPlayPosition(): Promise<{ pos: number; errorCode: number }> {
        return { pos: Math.floor(this._videoElement.currentTime * 1000), errorCode: ERROR_CODE_TYPE.ERR_OK };
    }

    async getStreamCount(): Promise<{ count: number; errorCode: number }> {
        // 视频算作1个stream，加上音频轨道数量
        const htmlAudioTracks = (this._videoElement as any).audioTracks;
        if (htmlAudioTracks && htmlAudioTracks.length > 0) {
            // 1个视频 + n个音频
            return { count: 1 + htmlAudioTracks.length, errorCode: ERROR_CODE_TYPE.ERR_OK };
        }

        // 回退到 media stream tracks
        const audioTrackCount = this._audioTracks?.length || 0;
        return { count: 1 + audioTrackCount, errorCode: ERROR_CODE_TYPE.ERR_OK };
    }

    async getStreamInfo(index: number): Promise<{ info: PlayerStreamInfo; errorCode: number }> {
        return { info: null, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async setLoopCount(loopCount: number): Promise<number> {
        this._loopCount = loopCount;
        this._videoElement.loop = loopCount === -1;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async setPlaybackSpeed(speed: number): Promise<number> {
        this._playbackSpeed = speed;
        this._videoElement.playbackRate = speed;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async selectAudioTrack(index: number): Promise<number> {
        // 方法1: 使用 HTML5 video.audioTracks API（Chrome/Edge/Safari支持）
        const htmlAudioTracks = (this._videoElement as any).audioTracks;

        if (htmlAudioTracks && htmlAudioTracks.length > 0) {
            if (index < 0 || index >= htmlAudioTracks.length) {
                return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
            }

            if (this._audioTrackIndex === index) {
                return ERROR_CODE_TYPE.ERR_OK;
            }

            // 切换 enabled 状态：只启用选中的track
            for (let i = 0; i < htmlAudioTracks.length; i++) {
                htmlAudioTracks[i].enabled = i === index;
            }

            this._audioTrackIndex = index;

            // 如果正在播放，替换 Agora audio track
            if (this._state === MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYING && this._mediaStream) {
                await this._replaceAudioTrack();
            }

            return ERROR_CODE_TYPE.ERR_OK;
        }

        // 方法2: 回退到 MediaStream tracks（Firefox等不支持audioTracks的浏览器）
        if (!this._audioTracks || this._audioTracks.length === 0) {
            console.warn("No audio tracks available");
            return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }

        if (index < 0 || index >= this._audioTracks.length) {
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }

        if (this._audioTrackIndex === index) {
            return ERROR_CODE_TYPE.ERR_OK;
        }

        this._audioTrackIndex = index;

        // 如果正在播放，替换 Agora audio track
        if (this._state === MEDIA_PLAYER_STATE.PLAYER_STATE_PLAYING && this._mediaStream) {
            await this._replaceAudioTrack();
        }

        return ERROR_CODE_TYPE.ERR_OK;
    }

    async selectMultiAudioTrack(playoutTrackIndex: number, publishTrackIndex: number): Promise<number> {
        console.warn("selectMultiAudioTrack not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setPlayerOption(key: string, value: number): Promise<number>;
    async setPlayerOption(key: string, value: string): Promise<number>;
    async setPlayerOption(key: string, value: number | string): Promise<number> {
        console.warn("setPlayerOption not supported in web");
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async takeScreenshot(filename: string): Promise<number> {
        console.warn("takeScreenshot not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async selectInternalSubtitle(index: number): Promise<number> {
        console.warn("selectInternalSubtitle not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setExternalSubtitle(url: string): Promise<number> {
        console.warn("setExternalSubtitle not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getState(): Promise<MEDIA_PLAYER_STATE> {
        return this._state;
    }

    async mute(muted: boolean): Promise<number> {
        this._muted = muted;
        this._videoElement.muted = muted;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async getMute(): Promise<{ muted: boolean; errorCode: number }> {
        return { muted: this._muted, errorCode: ERROR_CODE_TYPE.ERR_OK };
    }

    async adjustPlayoutVolume(volume: number): Promise<number> {
        this._playoutVolume = volume;
        this._videoElement.volume = volume / 100;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async getPlayoutVolume(): Promise<{ volume: number; errorCode: number }> {
        return { volume: this._playoutVolume, errorCode: ERROR_CODE_TYPE.ERR_OK };
    }

    async adjustPublishSignalVolume(volume: number): Promise<number> {
        this._publishSignalVolume = volume;
        if (this.audio) {
            this.audio.setVolume(volume);
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async getPublishSignalVolume(): Promise<{ volume: number; errorCode: number }> {
        return { volume: this._publishSignalVolume, errorCode: ERROR_CODE_TYPE.ERR_OK };
    }

    async setView(view: any): Promise<number> {
        console.warn("setView not supported in web, use HTMLVideoElement directly");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setRenderMode(renderMode: RENDER_MODE_TYPE): Promise<number> {
        console.warn("setRenderMode not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async unregisterAudioFrameObserver(): Promise<number> {
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async unregisterMediaPlayerAudioSpectrumObserver(): Promise<number> {
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async setAudioDualMonoMode(mode: AUDIO_DUAL_MONO_MODE): Promise<number> {
        console.warn("setAudioDualMonoMode not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getPlayerSdkVersion(): Promise<string> {
        return "1.0.0-web";
    }

    async getPlaySrc(): Promise<string> {
        return this._url;
    }

    async openWithAgoraCDNSrc(src: string, startPos: number): Promise<number> {
        return this.open(src, startPos);
    }

    async getAgoraCDNLineCount(): Promise<number> {
        return 1;
    }

    async switchAgoraCDNLineByIndex(index: number): Promise<number> {
        console.warn("switchAgoraCDNLineByIndex not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getCurrentAgoraCDNIndex(): Promise<number> {
        return 0;
    }

    async enableAutoSwitchAgoraCDN(enable: boolean): Promise<number> {
        console.warn("enableAutoSwitchAgoraCDN not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async renewAgoraCDNSrcToken(token: string, ts: number): Promise<number> {
        console.warn("renewAgoraCDNSrcToken not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async switchAgoraCDNSrc(src: string, syncPts: boolean): Promise<number> {
        return this.open(src, 0);
    }

    async switchSrc(src: string, syncPts: boolean): Promise<number> {
        return this.open(src, 0);
    }

    async preloadSrc(src: string, startPos: number): Promise<number> {
        console.warn("preloadSrc not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async playPreloadedSrc(src: string): Promise<number> {
        console.warn("playPreloadedSrc not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async unloadSrc(src: string): Promise<number> {
        if (this._url === src) {
            return this.stop();
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async setSpatialAudioParams(params: SpatialAudioParams): Promise<number> {
        console.warn("setSpatialAudioParams not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setSoundPositionParams(pan: number, gain: number): Promise<number> {
        console.warn("setSoundPositionParams not supported in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getAudioBufferDelay(): Promise<{ delayMs: number; errorCode: number }> {
        return { delayMs: 0, errorCode: ERROR_CODE_TYPE.ERR_OK };
    }
}
