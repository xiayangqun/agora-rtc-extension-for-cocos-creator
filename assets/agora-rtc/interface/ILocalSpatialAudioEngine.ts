import type { RemoteVoicePositionInfo, SpatialAudioZone } from "../types/AgoraSpatialAudio";
import type { RtcConnection } from "../types/AgoraRtcEngineEx";

export interface ILocalSpatialAudioEngine {
    updateRemotePosition(uid: number, posInfo: RemoteVoicePositionInfo): Promise<number>;

    updateRemotePositionEx(uid: number, posInfo: RemoteVoicePositionInfo, connection: RtcConnection): Promise<number>;

    removeRemotePosition(uid: number): Promise<number>;

    removeRemotePositionEx(uid: number, connection: RtcConnection): Promise<number>;

    clearRemotePositionsEx(connection: RtcConnection): Promise<number>;

    updateSelfPositionEx(
        position: number[],
        axisForward: number[],
        axisRight: number[],
        axisUp: number[],
        connection: RtcConnection,
    ): Promise<number>;

    setMaxAudioRecvCount(maxCount: number): Promise<number>;

    setAudioRecvRange(range: number): Promise<number>;

    setDistanceUnit(unit: number): Promise<number>;

    updateSelfPosition(
        position: number[],
        axisForward: number[],
        axisRight: number[],
        axisUp: number[],
    ): Promise<number>;

    updatePlayerPositionInfo(playerId: number, positionInfo: RemoteVoicePositionInfo): Promise<number>;

    setParameters(params: string): Promise<number>;

    muteLocalAudioStream(mute: boolean): Promise<number>;

    muteAllRemoteAudioStreams(mute: boolean): Promise<number>;

    muteRemoteAudioStream(uid: number, mute: boolean): Promise<number>;

    setRemoteAudioAttenuation(uid: number, attenuation: number, forceSet: boolean): Promise<number>;

    setZones(zones: SpatialAudioZone[]): Promise<number>;

    setPlayerAttenuation(playerId: number, attenuation: number, forceSet: boolean): Promise<number>;

    clearRemotePositions(): Promise<number>;
}
