import { IMusicPlayer } from "../../interface/IMusicPlayer";
import { IMediaPlayerSourceObserver } from "../../interface/IMediaPlayerSourceObserver";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";
import { MEDIA_PLAYER_STATE, MediaSource, PlayerStreamInfo } from "../../types/AgoraMediaPlayerTypes";
import { AUDIO_DUAL_MONO_MODE } from "../../types/AgoraMediaBase";
import { SpatialAudioParams } from "../../types/AgoraBase";
import { MusicPlayMode } from "../../types/AgoraMusicContentCenter";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class MusicPlayerWeb implements IMusicPlayer {
    async getId(): Promise<number> {
        console.warn("getId not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async initEventHandler(engineEventHandler: IMediaPlayerSourceObserver): Promise<number> {
        console.warn("initEventHandler not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async open(url: string, startPos: number): Promise<number> {
        console.warn("open not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async openWithMediaSource(source: MediaSource): Promise<number> {
        console.warn("openWithMediaSource not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async play(): Promise<number> {
        console.warn("play not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async pause(): Promise<number> {
        console.warn("pause not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async stop(): Promise<number> {
        console.warn("stop not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async resume(): Promise<number> {
        console.warn("resume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async seek(newPos: number): Promise<number> {
        console.warn("seek not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setAudioPitch(pitch: number): Promise<number> {
        console.warn("setAudioPitch not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getDuration(): Promise<{ duration: number; errorCode: number }> {
        console.warn("getDuration not support in web");
        return { duration: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async getPlayPosition(): Promise<{ pos: number; errorCode: number }> {
        console.warn("getPlayPosition not support in web");
        return { pos: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async getStreamCount(): Promise<{ count: number; errorCode: number }> {
        console.warn("getStreamCount not support in web");
        return { count: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async getStreamInfo(index: number): Promise<{ info: PlayerStreamInfo; errorCode: number }> {
        console.warn("getStreamInfo not support in web");
        return { info: null, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async setLoopCount(loopCount: number): Promise<number> {
        console.warn("setLoopCount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setPlaybackSpeed(speed: number): Promise<number> {
        console.warn("setPlaybackSpeed not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async selectAudioTrack(index: number): Promise<number> {
        console.warn("selectAudioTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async selectMultiAudioTrack(playoutTrackIndex: number, publishTrackIndex: number): Promise<number> {
        console.warn("selectMultiAudioTrack not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setPlayerOption(key: string, value: number | string): Promise<number> {
        console.warn("setPlayerOption not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async takeScreenshot(filename: string): Promise<number> {
        console.warn("takeScreenshot not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async selectInternalSubtitle(index: number): Promise<number> {
        console.warn("selectInternalSubtitle not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setExternalSubtitle(url: string): Promise<number> {
        console.warn("setExternalSubtitle not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getState(): Promise<MEDIA_PLAYER_STATE> {
        console.warn("getState not support in web");
        return MEDIA_PLAYER_STATE.PLAYER_STATE_IDLE;
    }

    async mute(muted: boolean): Promise<number> {
        console.warn("mute not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getMute(): Promise<{ muted: boolean; errorCode: number }> {
        console.warn("getMute not support in web");
        return { muted: false, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async adjustPlayoutVolume(volume: number): Promise<number> {
        console.warn("adjustPlayoutVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getPlayoutVolume(): Promise<{ volume: number; errorCode: number }> {
        console.warn("getPlayoutVolume not support in web");
        return { volume: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async adjustPublishSignalVolume(volume: number): Promise<number> {
        console.warn("adjustPublishSignalVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getPublishSignalVolume(): Promise<{ volume: number; errorCode: number }> {
        console.warn("getPublishSignalVolume not support in web");
        return { volume: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async setAudioDualMonoMode(mode: AUDIO_DUAL_MONO_MODE): Promise<number> {
        console.warn("setAudioDualMonoMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getPlayerSdkVersion(): Promise<string> {
        console.warn("getPlayerSdkVersion not support in web");
        return "";
    }

    async getPlaySrc(): Promise<string> {
        console.warn("getPlaySrc not support in web");
        return "";
    }

    async openWithAgoraCDNSrc(src: string, startPos: number): Promise<number> {
        console.warn("openWithAgoraCDNSrc not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getAgoraCDNLineCount(): Promise<number> {
        console.warn("getAgoraCDNLineCount not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async switchAgoraCDNLineByIndex(index: number): Promise<number> {
        console.warn("switchAgoraCDNLineByIndex not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getCurrentAgoraCDNIndex(): Promise<number> {
        console.warn("getCurrentAgoraCDNIndex not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async enableAutoSwitchAgoraCDN(enable: boolean): Promise<number> {
        console.warn("enableAutoSwitchAgoraCDN not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async renewAgoraCDNSrcToken(token: string, ts: number): Promise<number> {
        console.warn("renewAgoraCDNSrcToken not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async switchAgoraCDNSrc(src: string, syncPts: boolean): Promise<number> {
        console.warn("switchAgoraCDNSrc not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async switchSrc(src: string, syncPts: boolean): Promise<number> {
        console.warn("switchSrc not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async preloadSrc(src: string, startPos: number): Promise<number> {
        console.warn("preloadSrc not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async playPreloadedSrc(src: string): Promise<number> {
        console.warn("playPreloadedSrc not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async unloadSrc(src: string): Promise<number> {
        console.warn("unloadSrc not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setSpatialAudioParams(params: SpatialAudioParams): Promise<number> {
        console.warn("setSpatialAudioParams not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setSoundPositionParams(pan: number, gain: number): Promise<number> {
        console.warn("setSoundPositionParams not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getAudioBufferDelay(): Promise<{ delayMs: number; errorCode: number }> {
        console.warn("getAudioBufferDelay not support in web");
        return { delayMs: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async openWithSongCode(songCode: number, startPos: number): Promise<number> {
        console.warn("openWithSongCode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async setPlayMode(mode: MusicPlayMode): Promise<number> {
        console.warn("setPlayMode not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
}
