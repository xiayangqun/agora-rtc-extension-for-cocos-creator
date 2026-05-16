import { ILocalSpatialAudioEngine } from "../../interface/ILocalSpatialAudioEngine";
import { RemoteVoicePositionInfo, SpatialAudioZone } from "../../types/AgoraSpatialAudio";
import { RtcConnection } from "../../types/AgoraRtcEngineEx";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class LocalSpatialAudioEngineWeb implements ILocalSpatialAudioEngine {
    async dispose(): Promise<void> {}

    async initialize(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async updateRemotePosition(uid: number, posInfo: RemoteVoicePositionInfo): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async updateRemotePositionEx(
        uid: number,
        posInfo: RemoteVoicePositionInfo,
        connection: RtcConnection,
    ): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async removeRemotePosition(uid: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async removeRemotePositionEx(uid: number, connection: RtcConnection): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async clearRemotePositionsEx(connection: RtcConnection): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async updateSelfPositionEx(
        position: number[],
        axisForward: number[],
        axisRight: number[],
        axisUp: number[],
        connection: RtcConnection,
    ): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setMaxAudioRecvCount(maxCount: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setAudioRecvRange(range: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setDistanceUnit(unit: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async updateSelfPosition(
        position: number[],
        axisForward: number[],
        axisRight: number[],
        axisUp: number[],
    ): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async updatePlayerPositionInfo(playerId: number, positionInfo: RemoteVoicePositionInfo): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setParameters(params: string): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async muteLocalAudioStream(mute: boolean): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async muteAllRemoteAudioStreams(mute: boolean): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async muteRemoteAudioStream(uid: number, mute: boolean): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setRemoteAudioAttenuation(uid: number, attenuation: number, forceSet: boolean): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setZones(zones: SpatialAudioZone[], zoneCount: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async setPlayerAttenuation(playerId: number, attenuation: number, forceSet: boolean): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async clearRemotePositions(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }
}
