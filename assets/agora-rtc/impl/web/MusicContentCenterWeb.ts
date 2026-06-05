import { IMusicContentCenter } from "../../interface/IMusicContentCenter";
import { IMusicPlayer } from "../../interface/IMusicPlayer";
import { MusicCacheInfo, MusicContentCenterConfiguration } from "../../types/AgoraMusicContentCenter";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class MusicContentCenterWeb implements IMusicContentCenter {
    async initialize(configuration: MusicContentCenterConfiguration): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async renewToken(token: string): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async registerEventHandler(eventHandler: unknown): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async unregisterEventHandler(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async createMusicPlayer(): Promise<IMusicPlayer> {
        throw new Error("createMusicPlayer not support in web");
    }

    async destroyMusicPlayer(music_player: IMusicPlayer): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getMusicCharts(): Promise<{ requestId: string; errorCode: number }> {
        return { requestId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getMusicCollectionByMusicChartId(
        musicChartId: number,
        page: number,
        pageSize: number,
        jsonOption: string,
    ): Promise<{ requestId: string; errorCode: number }> {
        return { requestId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async searchMusic(
        keyWord: string,
        page: number,
        pageSize: number,
        jsonOption: string,
    ): Promise<{ requestId: string; errorCode: number }> {
        return { requestId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async preload(songCode: number, jsonOption: string): Promise<number>;
    async preload(songCode: number): Promise<{ requestId: string; errorCode: number }>;
    async preload(param1: unknown, param2?: unknown): Promise<number | { requestId: string; errorCode: number }> {
        return -ERR_NOT_SUPPORTED;
    }

    async removeCache(songCode: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getCaches(cacheInfoSize: number): Promise<{ errorCode: number; cacheInfo: MusicCacheInfo[] }> {
        return { errorCode: -ERR_NOT_SUPPORTED, cacheInfo: [] };
    }

    async isPreloaded(songCode: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getLyric(songCode: number, lyricType: number): Promise<{ requestId: string; errorCode: number }> {
        return { requestId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getSongSimpleInfo(songCode: number): Promise<{ requestId: string; errorCode: number }> {
        return { requestId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getInternalSongCode(
        songCode: number,
        jsonOption: string,
    ): Promise<{ errorCode: number; internalSongCode: number }> {
        return { errorCode: -ERR_NOT_SUPPORTED, internalSongCode: 0 };
    }
}
