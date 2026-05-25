import { sys } from "cc";
import { IRtcEngineEx } from "./IRtcEngineEx";
import { RtcEngineWeb } from "../impl/web/RtcEngineWeb";
import { isRtcEngineNativeAvailable, RtcEngineNative } from "../impl/native/RtcEngineNative";

export function createRtcEngine(): IRtcEngineEx {
    if (sys.isBrowser) {
        return new RtcEngineWeb();
    }
    if (isRtcEngineNativeAvailable()) {
        return new RtcEngineNative() as unknown as IRtcEngineEx;
    }
    return null;
}
