import { sys } from "cc";
import { IRtcEngineEx } from "./IRtcEngineEx";
import { RtcEngineWeb } from "../impl/web/RtcEngineWeb";

// // #if CC_EDITOR || CC_JSB
// export function createRtcEngine(): null {
//     console.warn("[Agora RTC] createRtcEngine is only supported in Web browser build.");
//     return null;
// }
// // #else
// import { RtcEngineWeb } from "../impl/web/RtcEngineWeb";

export function createRtcEngine(): IRtcEngineEx {
    if (sys.isBrowser) {
        return new RtcEngineWeb();
    } else {
        return null;
    }
}
// #end
