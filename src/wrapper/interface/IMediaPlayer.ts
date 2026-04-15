import type { MEDIA_PLAYER_STATE, MediaSource, PlayerStreamInfo } from '../types/AgoraMediaPlayerTypes';
import type { SpatialAudioParams } from '../types/AgoraBase';
import { RENDER_MODE_TYPE, RAW_AUDIO_FRAME_OP_MODE_TYPE, AUDIO_DUAL_MONO_MODE } from '../types/AgoraMediaBase';
import { IMediaPlayerSourceObserver } from './IMediaPlayerSourceObserver';

 
export interface IMediaPlayer {
    dispose(): void;

    getId(): number;

    initEventHandler(engineEventHandler: IMediaPlayerSourceObserver): number;



    open(url:string, startPos:number): number;

    openWithMediaSource(source:MediaSource): number;

    play(): number;

    pause(): number;

    stop(): number;

    resume(): number;

    seek(newPos:number): number;

    setAudioPitch(pitch:number): number;

    getDuration(duration:number): number;

    getPlayPosition(pos:number): number;

    getStreamCount(count:number): number;

    getStreamInfo(index:number, info:PlayerStreamInfo): number;

    setLoopCount(loopCount:number): number;

    setPlaybackSpeed(speed:number): number;

    selectAudioTrack(index:number): number;

    selectMultiAudioTrack(playoutTrackIndex:number, publishTrackIndex:number): number;

    setPlayerOption(key:string, value:number): number;

    setPlayerOption(key:string, value:string): number;

    takeScreenshot(filename:string): number;

    selectInternalSubtitle(index:number): number;

    setExternalSubtitle(url:string): number;

    getState(): MEDIA_PLAYER_STATE;

    mute(muted:boolean): number;

    getMute(muted:boolean): number;

    adjustPlayoutVolume(volume:number): number;

    getPlayoutVolume(volume:number): number;

    adjustPublishSignalVolume(volume:number): number;

    getPublishSignalVolume(volume:number): number;

    setView(view:any): number;

    setRenderMode(renderMode:RENDER_MODE_TYPE): number;



    unregisterAudioFrameObserver(): number;



    unregisterMediaPlayerAudioSpectrumObserver(): number;

    setAudioDualMonoMode(mode:AUDIO_DUAL_MONO_MODE): number;

    getPlayerSdkVersion(): string;

    getPlaySrc(): string;

    openWithAgoraCDNSrc(src:string, startPos:number): number;

    getAgoraCDNLineCount(): number;

    switchAgoraCDNLineByIndex(index:number): number;

    getCurrentAgoraCDNIndex(): number;

    enableAutoSwitchAgoraCDN(enable:boolean): number;

    renewAgoraCDNSrcToken(token:string, ts:number): number;

    switchAgoraCDNSrc(src:string, syncPts:boolean): number;

    switchSrc(src:string, syncPts:boolean): number;

    preloadSrc(src:string, startPos:number): number;

    playPreloadedSrc(src:string): number;

    unloadSrc(src:string): number;

    setSpatialAudioParams(params:SpatialAudioParams): number;

    setSoundPositionParams(pan:number, gain:number): number;

    getAudioBufferDelay(delayMs:number): number;

}
