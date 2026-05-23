import type { MusicCacheInfo, MusicContentCenterConfiguration } from "../types/AgoraMusicContentCenter";
import { IMusicPlayer } from "./IMusicPlayer";

import { IMusicContentCenterEventHandler } from "./IMusicContentCenterEventHandler";

export interface IMusicContentCenter {
    initialize(configuration: MusicContentCenterConfiguration): Promise<number>;

    renewToken(token: string): Promise<number>;

    registerEventHandler(eventHandler: IMusicContentCenterEventHandler): Promise<number>;

    unregisterEventHandler(): Promise<number>;

    createMusicPlayer(): Promise<IMusicPlayer>;

    destroyMusicPlayer(music_player: IMusicPlayer): Promise<number>;

    getMusicCharts(): Promise<{ requestId: string; errorCode: number }>;

    getMusicCollectionByMusicChartId(
        musicChartId: number,
        page: number,
        pageSize: number,
        jsonOption: string,
    ): Promise<{ requestId: string; errorCode: number }>;

    searchMusic(
        keyWord: string,
        page: number,
        pageSize: number,
        jsonOption: string,
    ): Promise<{ requestId: string; errorCode: number }>;

    preload(songCode: number, jsonOption: string): Promise<number>;

    preload(songCode: number): Promise<{ requestId: string; errorCode: number }>;

    removeCache(songCode: number): Promise<number>;

    getCaches(
        cacheInfoSize: number,
    ): Promise<{ errorCode: number; cacheInfo: MusicCacheInfo[]; cacheInfoSize: number }>;

    isPreloaded(songCode: number): Promise<number>;

    getLyric(songCode: number, lyricType: number): Promise<{ requestId: string; errorCode: number }>;

    getSongSimpleInfo(songCode: number): Promise<{ requestId: string; errorCode: number }>;

    getInternalSongCode(songCode: number, jsonOption: string): Promise<{ errorCode: number; internalSongCode: number }>;
}
