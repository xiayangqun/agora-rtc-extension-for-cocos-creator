import type { MusicCacheInfo, MusicContentCenterConfiguration } from "../types/AgoraMusicContentCenter";
import { IMusicPlayer } from "./IMusicPlayer";

export interface IMusicContentCenter {
    initialize(configuration: MusicContentCenterConfiguration): Promise<number>;

    renewToken(token: string): Promise<number>;

    registerEventHandler(eventHandler: IMusicContentCenterEventHandler): Promise<number>;

    unregisterEventHandler(): Promise<number>;

    createMusicPlayer(): Promise<IMusicPlayer>;

    destroyMusicPlayer(music_player: IMusicPlayer): Promise<number>;

    getMusicCharts(requestId: string): Promise<number>;

    getMusicCollectionByMusicChartId(
        requestId: string,
        musicChartId: number,
        page: number,
        pageSize: number,
        jsonOption: string,
    ): Promise<number>;

    searchMusic(
        requestId: string,
        keyWord: string,
        page: number,
        pageSize: number,
        jsonOption: string,
    ): Promise<number>;

    preload(songCode: number, jsonOption: string): Promise<number>;

    preload(requestId: string, songCode: number): Promise<number>;

    removeCache(songCode: number): Promise<number>;

    getCaches(cacheInfo: MusicCacheInfo[], cacheInfoSize: number): Promise<number>;

    isPreloaded(songCode: number): Promise<number>;

    getLyric(requestId: string, songCode: number, lyricType: number): Promise<number>;

    getSongSimpleInfo(requestId: string, songCode: number): Promise<number>;

    getInternalSongCode(songCode: number, jsonOption: string, internalSongCode: number): Promise<number>;
}
