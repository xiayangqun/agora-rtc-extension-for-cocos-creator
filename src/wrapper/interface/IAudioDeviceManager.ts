import { DeviceInfo } from "../types/AgoraBase";

export interface IAudioDeviceManager {
    enumeratePlaybackDevices(): Promise<DeviceInfo[]>;

    enumerateRecordingDevices(): Promise<DeviceInfo[]>;

    getPlaybackDefaultDevice(deviceId: string, deviceName: string): Promise<number>;

    getPlaybackDefaultDevice(deviceId: string, deviceTypeName: string, deviceName: string): Promise<number>;

    getRecordingDefaultDevice(deviceId: string, deviceName: string): Promise<number>;

    getRecordingDefaultDevice(deviceId: string, deviceTypeName: string, deviceName: string): Promise<number>;

    setPlaybackDevice(deviceId: string): Promise<number>;

    getPlaybackDevice(deviceId: string): Promise<number>;

    getPlaybackDeviceInfo(deviceId: string, deviceName: string): Promise<number>;

    getPlaybackDeviceInfo(deviceId: string, deviceName: string, deviceTypeName: string): Promise<number>;

    setPlaybackDeviceVolume(volume: number): Promise<number>;

    getPlaybackDeviceVolume(volume: number): Promise<number>;

    setRecordingDevice(deviceId: string): Promise<number>;

    getRecordingDevice(deviceId: string): Promise<number>;

    getRecordingDeviceInfo(deviceId: string, deviceName: string): Promise<number>;

    getRecordingDeviceInfo(deviceId: string, deviceName: string, deviceTypeName: string): Promise<number>;

    setRecordingDeviceVolume(volume: number): Promise<number>;

    getRecordingDeviceVolume(volume: number): Promise<number>;

    setLoopbackDevice(deviceId: string): Promise<number>;

    getLoopbackDevice(deviceId: string): Promise<number>;

    setPlaybackDeviceMute(mute: boolean): Promise<number>;

    getPlaybackDeviceMute(mute: boolean): Promise<number>;

    setRecordingDeviceMute(mute: boolean): Promise<number>;

    getRecordingDeviceMute(mute: boolean): Promise<number>;

    startPlaybackDeviceTest(testAudioFilePath: string): Promise<number>;

    stopPlaybackDeviceTest(): Promise<number>;

    startRecordingDeviceTest(indicationInterval: number): Promise<number>;

    stopRecordingDeviceTest(): Promise<number>;

    startAudioDeviceLoopbackTest(indicationInterval: number): Promise<number>;

    stopAudioDeviceLoopbackTest(): Promise<number>;

    followSystemPlaybackDevice(enable: boolean): Promise<number>;

    followSystemRecordingDevice(enable: boolean): Promise<number>;

    followSystemLoopbackDevice(enable: boolean): Promise<number>;
}
