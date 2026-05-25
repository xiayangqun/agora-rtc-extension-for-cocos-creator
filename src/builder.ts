import { BuildPlugin } from "../@types";

export const PACKAGE_NAME = "agora-rtc-extension-for-cocos-creator";

export const load: BuildPlugin.load = function () {
    console.debug(`[${PACKAGE_NAME}] builder load`);
};

export const unload: BuildPlugin.Unload = function () {
    console.debug(`[${PACKAGE_NAME}] builder unload`);
};

export const configs: BuildPlugin.Configs = {
    mac: {
        hooks: "./build-hooks",
        options: {
            writeCameraPermission: {
                label: "i18n:agora-rtc-extension-for-cocos-creator.build_option_camera_label",
                description: "i18n:agora-rtc-extension-for-cocos-creator.build_option_camera_desc",
                default: true,
                render: {
                    ui: "ui-checkbox",
                },
            },
            writeMicrophonePermission: {
                label: "i18n:agora-rtc-extension-for-cocos-creator.build_option_mic_label",
                description: "i18n:agora-rtc-extension-for-cocos-creator.build_option_mic_desc",
                default: true,
                render: {
                    ui: "ui-checkbox",
                },
            },
            writeAgoraDefaultPermissions: {
                label: "i18n:agora-rtc-extension-for-cocos-creator.build_option_network_label",
                description: "i18n:agora-rtc-extension-for-cocos-creator.build_option_network_desc",
                default: true,
                render: {
                    ui: "ui-checkbox",
                },
            },
        },
    },
};
