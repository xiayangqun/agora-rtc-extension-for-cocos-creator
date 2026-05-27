import type { MEDIA_PLAYER_STATE, MediaSource, PlayerStreamInfo } from "../types/AgoraMediaPlayerTypes";
import type { SpatialAudioParams } from "../types/AgoraBase";
import { RENDER_MODE_TYPE, RAW_AUDIO_FRAME_OP_MODE_TYPE, AUDIO_DUAL_MONO_MODE } from "../types/AgoraMediaBase";
import { IMediaPlayerSourceObserver } from "./IMediaPlayerSourceObserver";

export interface IMediaPlayer {
    getId(): Promise<number>;

    initEventHandler(engineEventHandler: IMediaPlayerSourceObserver): Promise<number>;

    open(url: string, startPos: number): Promise<number>;

    openWithMediaSource(source: MediaSource): Promise<number>;

    play(): Promise<number>;

    pause(): Promise<number>;

    stop(): Promise<number>;

    resume(): Promise<number>;

    seek(newPos: number): Promise<number>;

    setAudioPitch(pitch: number): Promise<number>;

    getDuration(): Promise<{ duration: number; errorCode: number }>;

    getPlayPosition(): Promise<{ pos: number; errorCode: number }>;

    getStreamCount(): Promise<{ count: number; errorCode: number }>;

    getStreamInfo(index: number): Promise<{ info: PlayerStreamInfo; errorCode: number }>;

    setLoopCount(loopCount: number): Promise<number>;

    setPlaybackSpeed(speed: number): Promise<number>;

    selectAudioTrack(index: number): Promise<number>;

    selectMultiAudioTrack(playoutTrackIndex: number, publishTrackIndex: number): Promise<number>;

    setPlayerOption(key: string, value: number): Promise<number>;

    setPlayerOption(key: string, value: string): Promise<number>;

    takeScreenshot(filename: string): Promise<number>;

    selectInternalSubtitle(index: number): Promise<number>;

    setExternalSubtitle(url: string): Promise<number>;

    getState(): Promise<MEDIA_PLAYER_STATE>;

    mute(muted: boolean): Promise<number>;

    getMute(): Promise<{ muted: boolean; errorCode: number }>;

    adjustPlayoutVolume(volume: number): Promise<number>;

    getPlayoutVolume(): Promise<{ volume: number; errorCode: number }>;

    adjustPublishSignalVolume(volume: number): Promise<number>;

    getPublishSignalVolume(): Promise<{ volume: number; errorCode: number }>;

    setAudioDualMonoMode(mode: AUDIO_DUAL_MONO_MODE): Promise<number>;

    getPlayerSdkVersion(): Promise<string>;

    getPlaySrc(): Promise<string>;

    openWithAgoraCDNSrc(src: string, startPos: number): Promise<number>;

    getAgoraCDNLineCount(): Promise<number>;

    switchAgoraCDNLineByIndex(index: number): Promise<number>;

    getCurrentAgoraCDNIndex(): Promise<number>;

    enableAutoSwitchAgoraCDN(enable: boolean): Promise<number>;

    renewAgoraCDNSrcToken(token: string, ts: number): Promise<number>;

    switchAgoraCDNSrc(src: string, syncPts: boolean): Promise<number>;

    switchSrc(src: string, syncPts: boolean): Promise<number>;

    preloadSrc(src: string, startPos: number): Promise<number>;

    playPreloadedSrc(src: string): Promise<number>;

    unloadSrc(src: string): Promise<number>;

    setSpatialAudioParams(params: SpatialAudioParams): Promise<number>;

    setSoundPositionParams(pan: number, gain: number): Promise<number>;

    getAudioBufferDelay(): Promise<{ delayMs: number; errorCode: number }>;
}
