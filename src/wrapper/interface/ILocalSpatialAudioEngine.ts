import type { RemoteVoicePositionInfo, SpatialAudioZone } from "../types/AgoraSpatialAudio";
import type { RtcConnection } from "../types/AgoraRtcEngineEx";

export interface ILocalSpatialAudioEngine {
    dispose(): void;

    initialize(): number;

    updateRemotePosition(uid: number, posInfo: RemoteVoicePositionInfo): number;

    updateRemotePositionEx(uid: number, posInfo: RemoteVoicePositionInfo, connection: RtcConnection): number;

    removeRemotePosition(uid: number): number;

    removeRemotePositionEx(uid: number, connection: RtcConnection): number;

    clearRemotePositionsEx(connection: RtcConnection): number;

    updateSelfPositionEx(position: number[], axisForward: number[], axisRight: number[], axisUp: number[], connection: RtcConnection): number;

    setMaxAudioRecvCount(maxCount: number): number;

    setAudioRecvRange(range: number): number;

    setDistanceUnit(unit: number): number;

    updateSelfPosition(position: number[], axisForward: number[], axisRight: number[], axisUp: number[]): number;

    updatePlayerPositionInfo(playerId: number, positionInfo: RemoteVoicePositionInfo): number;

    setParameters(params: string): number;

    muteLocalAudioStream(mute: boolean): number;

    muteAllRemoteAudioStreams(mute: boolean): number;

    muteRemoteAudioStream(uid: number, mute: boolean): number;

    setRemoteAudioAttenuation(uid: number, attenuation: number, forceSet: boolean): number;

    setZones(zones: SpatialAudioZone[], zoneCount: number): number;

    setPlayerAttenuation(playerId: number, attenuation: number, forceSet: boolean): number;

    clearRemotePositions(): number;
}
