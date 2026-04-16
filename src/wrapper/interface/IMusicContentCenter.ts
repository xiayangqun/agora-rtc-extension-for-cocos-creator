import type { MusicCacheInfo, MusicContentCenterConfiguration } from "../types/AgoraMusicContentCenter";

export interface IMusicContentCenter {
    initialize(configuration: MusicContentCenterConfiguration): number;

    renewToken(token: string): number;

    registerEventHandler(eventHandler: IMusicContentCenterEventHandler): number;

    unregisterEventHandler(): number;

    createMusicPlayer(): IMusicPlayer;

    destroyMusicPlayer(music_player: IMusicPlayer): number;

    getMusicCharts(requestId: string): number;

    getMusicCollectionByMusicChartId(requestId: string, musicChartId: number, page: number, pageSize: number, jsonOption: string = ""): number;

    searchMusic(requestId: string, keyWord: string, page: number, pageSize: number, jsonOption: string = ""): number;

    preload(songCode: number, jsonOption: string): number;

    preload(requestId: string, songCode: number): number;

    removeCache(songCode: number): number;

    getCaches(cacheInfo: MusicCacheInfo[], cacheInfoSize: number): number;

    isPreloaded(songCode: number): number;

    getLyric(requestId: string, songCode: number, lyricType: number): number;

    getSongSimpleInfo(requestId: string, songCode: number): number;

    getInternalSongCode(songCode: number, jsonOption: string, internalSongCode: number): number;
}
