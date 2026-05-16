import type {
    MusicChartInfo,
    MusicCollection,
    MusicContentCenterStateReason,
    PreloadState,
} from "../types/AgoraMusicContentCenter";

export abstract class IMusicContentCenterEventHandler {
    abstract onMusicChartsResult(
        requestId: string,
        result: MusicChartInfo[],
        reason: MusicContentCenterStateReason,
    ): void;

    abstract onMusicCollectionResult(
        requestId: string,
        result: MusicCollection,
        reason: MusicContentCenterStateReason,
    ): void;

    abstract onLyricResult(
        requestId: string,
        songCode: number,
        lyricUrl: string,
        reason: MusicContentCenterStateReason,
    ): void;

    abstract onSongSimpleInfoResult(
        requestId: string,
        songCode: number,
        simpleInfo: string,
        reason: MusicContentCenterStateReason,
    ): void;

    abstract onPreLoadEvent(
        requestId: string,
        songCode: number,
        percent: number,
        lyricUrl: string,
        state: PreloadState,
        reason: MusicContentCenterStateReason,
    ): void;
}
