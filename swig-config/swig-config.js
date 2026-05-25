"use strict";

const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

module.exports = {
    interfacesDir: __dirname,
    bindingsOutDir: path.join(projectRoot, "native", "bindings", "auto"),
    includeDirs: [
        projectRoot,
        path.join(projectRoot, "native"),
        path.join(projectRoot, "mac", "include"),
        path.join(projectRoot, "mac", "include", "rtc"),
    ],
    configList: [
        ["agora_rtc_engine_bridge.i", "jsb_agora_rtc_engine_bridge_auto.cpp"],
    ],
};
