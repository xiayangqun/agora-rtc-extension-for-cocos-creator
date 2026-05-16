import { createApp, App } from "vue";
import { readFileSync } from "fs";
import { join } from "path";

const packageName = "agora-rtc-extension-for-cocos-creator";
const panelDataMap = new WeakMap<any, App>();

const htmlPath = join(__dirname, "../../../static/template/agora-panel/index.html");
const cssPath = join(__dirname, "../../../static/style/agora-panel/index.css");

export = Editor.Panel.define({
    template: readFileSync(htmlPath, "utf-8"),
    style: readFileSync(cssPath, "utf-8"),

    $: {
        app: "#app",
    },

    ready() {
        if (!this.$.app) {
            console.warn("[Agora RTC] #app element not found in panel");
            return;
        }

        // 调试日志已移除

        const app = createApp({
            data() {
                return {
                    statusIcon: "⏳",
                    statusText: "正在检查...",
                    statusClass: "",
                    displayVersion: "--",
                    showInstallBtn: true,
                    installing: false,
                    installBtnText: "安装依赖",
                    hintText: "提示：安装完成后，请确保在项目的 package.json 中可以看到 agora-rtc-sdk-ng 依赖。",
                };
            },
            async mounted() {
                await (this as any).checkDependency();
            },
            methods: {
                async checkDependency() {
                    try {
                        const result = await Editor.Message.request(packageName, "check-dependency");
                        if (result.hasDependency) {
                            this.showInstallBtn = false;
                            this.statusIcon = "✅";
                            this.statusText = "依赖正常";
                            this.statusClass = "ok";
                            this.displayVersion = `v${result.version}`;
                            this.hintText = "依赖已安装，可以直接在项目中使用 Agora RTC API。";
                        } else {
                            this.showInstallBtn = true;
                            this.statusIcon = "❌";
                            this.statusText = "未安装";
                            this.statusClass = "missing";
                            this.displayVersion = `需要 v${result.requiredVersion}`;
                            this.installBtnText = "安装依赖";
                            this.hintText = "当前项目未安装 agora-rtc-sdk-ng，点击下方按钮安装。";
                        }
                    } catch (err: any) {
                        this.showInstallBtn = false;
                        this.statusIcon = "⚠️";
                        this.statusText = "检查失败";
                        this.statusClass = "missing";
                        this.displayVersion = "--";
                        this.hintText = `检查失败: ${err.message || err}`;
                    }
                },
                formatInstallError(error: string): string {
                    const manualSteps =
                        "手动安装步骤：\n1. 打开终端\n2. cd 到项目根目录\n3. 执行 npm install agora-rtc-sdk-ng@4.24.3";
                    return `安装失败，请手动安装：\n${manualSteps}`;
                },
                async handleInstall() {
                    if (this.installing) return;
                    this.installing = true;
                    this.installBtnText = "安装中...";
                    this.statusIcon = "⏳";
                    this.statusText = "正在安装...";
                    this.statusClass = "";

                    try {
                        const result = await Editor.Message.request(packageName, "install-dependency");
                        if (result.success) {
                            await (this as any).checkDependency();
                        } else {
                            this.statusIcon = "❌";
                            this.statusText = "安装失败";
                            this.statusClass = "missing";
                            this.hintText = this.formatInstallError(result.error || "未知错误");
                            this.installing = false;
                            this.installBtnText = "重试安装";
                        }
                    } catch (err: any) {
                        this.statusIcon = "❌";
                        this.statusText = "安装失败";
                        this.statusClass = "missing";
                        this.hintText = this.formatInstallError(err.message || String(err));
                        this.installing = false;
                        this.installBtnText = "重试安装";
                    }
                },
            },
        });

        app.config.compilerOptions.isCustomElement = (tag: string) => tag.startsWith("ui-");

        app.mount(this.$.app);

        panelDataMap.set(this, app);
    },

    close() {
        const app = panelDataMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
