export interface IVideoDeviceCollection {
    getCount(): Promise<number>;

    setDevice(deviceIdUTF8: string): Promise<number>;

    getDevice(index: number): Promise<{ deviceNameUTF8: string; deviceIdUTF8: string; errorCode: number }>;

    release(): Promise<void>;
}
