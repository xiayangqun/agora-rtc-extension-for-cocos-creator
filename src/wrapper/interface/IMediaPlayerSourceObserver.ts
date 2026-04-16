import type { CacheStatistics, MEDIA_PLAYER_EVENT, MEDIA_PLAYER_REASON, MEDIA_PLAYER_STATE, PLAYER_PRELOAD_EVENT, PlayerPlaybackStats, PlayerUpdatedInfo, SrcInfo } from "../types/AgoraMediaPlayerTypes";

export abstract class IMediaPlayerSourceObserver {
    onPlayerSourceStateChanged(state: MEDIA_PLAYER_STATE, reason: MEDIA_PLAYER_REASON): void {}

    onPositionChanged(positionMs: number, timestampMs: number): void {}

    onPlayerEvent(eventCode: MEDIA_PLAYER_EVENT, elapsedTime: number, message: string): void {}

    onMetaData(data: Uint8Array, length: number): void {}

    onPlayBufferUpdated(playCachedBuffer: number): void {}

    onPreloadEvent(src: string, event: PLAYER_PRELOAD_EVENT): void {}

    onCompleted(): void {}

    onAgoraCDNTokenWillExpire(): void {}

    onPlayerSrcInfoChanged(from: SrcInfo, to: SrcInfo): void {}

    onPlayerInfoUpdated(info: PlayerUpdatedInfo): void {}

    onPlayerCacheStats(stats: CacheStatistics): void {}

    onPlayerPlaybackStats(stats: PlayerPlaybackStats): void {}

    onAudioVolumeIndication(volume: number): void {}
}
