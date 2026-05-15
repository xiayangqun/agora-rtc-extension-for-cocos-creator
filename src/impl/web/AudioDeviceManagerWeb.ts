import { IAudioDeviceManager } from "../../interface/IAudioDeviceManager";
import AgoraRTC from "agora-rtc-sdk-ng";
import { DeviceInfo, ERROR_CODE_TYPE } from "../../types/AgoraBase";
import { IAudioDeviceCollection } from "../../interface/IAudioDeviceCollection";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class AudioDeviceManagerWeb implements IAudioDeviceManager {
    enumeratePlaybackDevices(): Promise<IAudioDeviceCollection> {
        throw new Error("Method not implemented.");
    }
    enumerateRecordingDevices(): Promise<IAudioDeviceCollection> {
        throw new Error("Method not implemented.");
    }
    setPlaybackDevice(deviceId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getPlaybackDevice(): Promise<{ deviceId: string; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    getPlaybackDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    getPlaybackDeviceInfoType(): Promise<{
        deviceId: string;
        deviceName: string;
        deviceTypeName: string;
        errorCode: number;
    }> {
        throw new Error("Method not implemented.");
    }
    setPlaybackDeviceVolume(volume: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getPlaybackDeviceVolume(volume: number): Promise<{ volume: number; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    setRecordingDevice(deviceId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getRecordingDevice(): Promise<{ deviceId: string; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    getRecordingDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    getRecordingDeviceInfoType(): Promise<{
        deviceId: string;
        deviceName: string;
        deviceTypeName: string;
        errorCode: number;
    }> {
        throw new Error("Method not implemented.");
    }
    setRecordingDeviceVolume(volume: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getRecordingDeviceVolume(): Promise<{ volume: number; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    setLoopbackDevice(deviceId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getLoopbackDevice(): Promise<{ deviceId: string; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    setPlaybackDeviceMute(mute: boolean): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getPlaybackDeviceMute(): Promise<{ mute: boolean; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    setRecordingDeviceMute(mute: boolean): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getRecordingDeviceMute(): Promise<{ mute: boolean; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    startPlaybackDeviceTest(testAudioFilePath: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    stopPlaybackDeviceTest(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    startRecordingDeviceTest(indicationInterval: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    stopRecordingDeviceTest(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    startAudioDeviceLoopbackTest(indicationInterval: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    stopAudioDeviceLoopbackTest(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    followSystemPlaybackDevice(enable: boolean): Promise<number> {
        throw new Error("Method not implemented.");
    }
    followSystemRecordingDevice(enable: boolean): Promise<number> {
        throw new Error("Method not implemented.");
    }
    followSystemLoopbackDevice(enable: boolean): Promise<number> {
        throw new Error("Method not implemented.");
    }
}
