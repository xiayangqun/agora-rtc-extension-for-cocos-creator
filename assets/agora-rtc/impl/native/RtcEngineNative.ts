import { ERROR_CODE_TYPE } from "../../types/AgoraBase";
import { ChannelMediaOptions, RtcEngineContext } from "../../types/AgoraRtcEngine";

type NativeRtcEngineBinding = {
    initialize(context: RtcEngineContext): number;
    joinChannel(token: string, channelId: string, info: string, uid: number): number;
    joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): number;
    release(sync: boolean): void;
};

function createUnsupportedMethod(name: string) {
    return async () => {
        console.warn(`[Agora RTC] ${name} is not supported in native yet`);
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    };
}

function getNativeCtor(): new () => NativeRtcEngineBinding {
    return (globalThis as any).agora?.native?.RtcEngineNative;
}

export function isRtcEngineNativeAvailable(): boolean {
    return typeof getNativeCtor() === "function";
}

export class RtcEngineNative {
    private readonly _native: NativeRtcEngineBinding;

    constructor() {
        const NativeCtor = getNativeCtor();
        if (!NativeCtor) {
            throw new Error("[Agora RTC] Native RtcEngine binding is not registered.");
        }

        this._native = new NativeCtor();

        return new Proxy(this, {
            get(target, property, receiver) {
                if (property in target) {
                    return Reflect.get(target, property, receiver);
                }
                if (typeof property === "string") {
                    return createUnsupportedMethod(property);
                }
                return undefined;
            },
        });
    }

    async release(sync: boolean): Promise<void> {
        this._native.release(sync);
    }

    async initialize(context: RtcEngineContext): Promise<number> {
        return this._native.initialize(context);
    }

    async joinChannel(token: string, channelId: string, info: string, uid: number): Promise<number>;
    async joinChannel(token: string, channelId: string, uid: number, options: ChannelMediaOptions): Promise<number>;
    async joinChannel(
        token: string,
        channelId: string,
        infoOrUid: string | number,
        uidOrOptions: number | ChannelMediaOptions,
    ): Promise<number> {
        if (typeof infoOrUid === "string") {
            return this._native.joinChannel(token, channelId, infoOrUid, uidOrOptions as number);
        }
        return this._native.joinChannel(token, channelId, infoOrUid, uidOrOptions as ChannelMediaOptions);
    }
}
