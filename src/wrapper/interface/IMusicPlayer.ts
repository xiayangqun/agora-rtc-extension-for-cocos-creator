import type { MusicPlayMode } from "../types/AgoraMusicContentCenter";
import { IMediaPlayer } from "./IMediaPlayer";

export interface IMusicPlayer extends IMediaPlayer {
    openWithSongCode(songCode: number, startPos: number): number;

    setPlayMode(mode: MusicPlayMode): number;
}
