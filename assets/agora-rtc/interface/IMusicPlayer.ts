import type { MusicPlayMode } from "../types/AgoraMusicContentCenter";
import { IMediaPlayer } from "./IMediaPlayer";

export interface IMusicPlayer extends IMediaPlayer {
    openWithSongCode(songCode: number, startPos: number): Promise<number>;

    setPlayMode(mode: MusicPlayMode): Promise<number>;
}
