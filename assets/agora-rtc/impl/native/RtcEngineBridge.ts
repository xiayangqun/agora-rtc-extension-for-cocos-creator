export function isRtcEngineBridgeAvailable(): boolean {
    return typeof (globalThis as any).jsb?.agora?.RtcEngineExBridge === "function";
}

export function createRtcEngineBridge(): any {
    return new (globalThis as any).jsb.agora.RtcEngineExBridge();
}
