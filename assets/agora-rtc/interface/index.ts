import { sys } from "cc";
import { IRtcEngineEx } from "./IRtcEngineEx";
import { RtcEngineWeb } from "../impl/web/RtcEngineWeb";
import { isRtcEngineBridgeAvailable, createRtcEngineBridge } from "../impl/native/RtcEngineBridge";

export function createRtcEngine(): IRtcEngineEx {
    if (sys.isBrowser) {
        return new RtcEngineWeb();
    }
    if (isRtcEngineBridgeAvailable()) {
        return createRtcEngineBridge() as unknown as IRtcEngineEx;
    }
    return null;
}
