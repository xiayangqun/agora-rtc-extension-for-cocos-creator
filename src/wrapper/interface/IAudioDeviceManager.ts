import { DeviceInfo } from "../types/AgoraBase";

export interface IAudioDeviceManager {
    enumeratePlaybackDevices(): DeviceInfo[];

    enumerateRecordingDevices(): DeviceInfo[];

    getPlaybackDefaultDevice(deviceId: string, deviceName: string): number;

    getPlaybackDefaultDevice(deviceId: string, deviceTypeName: string, deviceName: string): number;

    getRecordingDefaultDevice(deviceId: string, deviceName: string): number;

    getRecordingDefaultDevice(deviceId: string, deviceTypeName: string, deviceName: string): number;

    setPlaybackDevice(deviceId: string): number;

    getPlaybackDevice(deviceId: string): number;

    getPlaybackDeviceInfo(deviceId: string, deviceName: string): number;

    getPlaybackDeviceInfo(deviceId: string, deviceName: string, deviceTypeName: string): number;

    setPlaybackDeviceVolume(volume: number): number;

    getPlaybackDeviceVolume(volume: number): number;

    setRecordingDevice(deviceId: string): number;

    getRecordingDevice(deviceId: string): number;

    getRecordingDeviceInfo(deviceId: string, deviceName: string): number;

    getRecordingDeviceInfo(deviceId: string, deviceName: string, deviceTypeName: string): number;

    setRecordingDeviceVolume(volume: number): number;

    getRecordingDeviceVolume(volume: number): number;

    setLoopbackDevice(deviceId: string): number;

    getLoopbackDevice(deviceId: string): number;

    setPlaybackDeviceMute(mute: boolean): number;

    getPlaybackDeviceMute(mute: boolean): number;

    setRecordingDeviceMute(mute: boolean): number;

    getRecordingDeviceMute(mute: boolean): number;

    startPlaybackDeviceTest(testAudioFilePath: string): number;

    stopPlaybackDeviceTest(): number;

    startRecordingDeviceTest(indicationInterval: number): number;

    stopRecordingDeviceTest(): number;

    startAudioDeviceLoopbackTest(indicationInterval: number): number;

    stopAudioDeviceLoopbackTest(): number;

    followSystemPlaybackDevice(enable: boolean): number;

    followSystemRecordingDevice(enable: boolean): number;

    followSystemLoopbackDevice(enable: boolean): number;
}
