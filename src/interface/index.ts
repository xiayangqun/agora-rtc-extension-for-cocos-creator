import { RtcEngineWeb } from "../impl/web/RtcEngineWeb";
import { IRtcEngineEx } from "./IRtcEngineEx";
import { sys } from "cc";

export function createRtcEngine(): IRtcEngineEx {
    if (sys.isBrowser) {
        return new RtcEngineWeb();
    }
}
