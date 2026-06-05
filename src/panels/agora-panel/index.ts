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
                const platformDefs = [
                    { name: "mac", label: "macOS" },
                    { name: "ios", label: "iOS" },
                    { name: "android", label: "Android" },
                    { name: "windows", label: "Windows" },
                ];
                return {
                    engineRoot: "",
                    generatingNativeBindings: false,
                    generateBtnText: "生成 Native Binding",
                    generateHintText:
                        "从当前项目 temp/declarations/cc.d.ts 自动读取 Cocos engine 根目录；也可以手动修改后生成。",
                    generateStatusClass: "",
                    platforms: platformDefs.map((p) => ({
                        ...p,
                        statusIcon: "⏳",
                        statusText: "检测中...",
                        statusClass: "",
                        downloading: false,
                        btnText: "下载 SDK",
                    })),
                    deletingAll: false,
                };
            },
            async mounted() {
                await (this as any).loadCocosEngineRoot();
                await (this as any).checkSdkStatus();
            },
            methods: {
                async loadCocosEngineRoot() {
                    try {
                        const result = await Editor.Message.request(packageName, "query-cocos-engine-root");
                        this.engineRoot = result.engineRoot || "";
                        if (!this.engineRoot) {
                            this.generateHintText =
                                "未找到 temp/declarations/cc.d.ts 或无法解析 Cocos engine 根目录，请手动填写后生成。";
                            this.generateStatusClass = "missing";
                        }
                    } catch (err: any) {
                        this.generateHintText = `读取 Cocos engine 根目录失败: ${err.message || err}`;
                        this.generateStatusClass = "missing";
                    }
                },
                async checkSdkStatus() {
                    try {
                        const result = await Editor.Message.request(packageName, "query-sdk-status");
                        for (const p of this.platforms) {
                            const info = result[p.name];
                            if (info && info.exists) {
                                p.statusIcon = "✅";
                                p.statusText = "已下载";
                                p.statusClass = "ok";
                                p.btnText = "重新下载";
                            } else {
                                p.statusIcon = "❌";
                                p.statusText = "未下载";
                                p.statusClass = "missing";
                                p.btnText = "下载 SDK";
                            }
                        }
                    } catch (err: any) {
                        for (const p of this.platforms) {
                            p.statusIcon = "⚠️";
                            p.statusText = "检测失败";
                            p.statusClass = "missing";
                        }
                    }
                },
                async handleDownload(platformName: string) {
                    const p = this.platforms.find((x: any) => x.name === platformName);
                    if (!p || p.downloading) return;
                    p.downloading = true;
                    p.statusIcon = "⏳";
                    p.statusText = "下载中...";
                    p.statusClass = "";
                    p.btnText = "下载中...";

                    try {
                        const result = await Editor.Message.request(packageName, "download-sdk", platformName);
                        if (result.success) {
                            await (this as any).checkSdkStatus();
                        } else {
                            p.statusIcon = "❌";
                            p.statusText = "下载失败";
                            p.statusClass = "missing";
                            p.btnText = "重试";
                        }
                    } catch (err: any) {
                        p.statusIcon = "❌";
                        p.statusText = "下载失败";
                        p.statusClass = "missing";
                        p.btnText = "重试";
                    } finally {
                        p.downloading = false;
                    }
                },
                async handleDeleteAllSdks() {
                    if (this.deletingAll) return;
                    this.deletingAll = true;
                    try {
                        const result = await Editor.Message.request(packageName, "delete-all-sdks");
                        if (result.success) {
                            await (this as any).checkSdkStatus();
                        }
                    } catch (err: any) {
                        // 删除失败静默处理，刷新状态即可
                        await (this as any).checkSdkStatus();
                    } finally {
                        this.deletingAll = false;
                    }
                },
                async handleGenerateNativeBindings() {
                    if (this.generatingNativeBindings) return;
                    if (!this.engineRoot.trim()) {
                        this.generateHintText = "请先填写 Cocos engine 根目录。";
                        this.generateStatusClass = "missing";
                        return;
                    }

                    this.generatingNativeBindings = true;
                    this.generateBtnText = "生成中...";
                    this.generateHintText = "正在调用 Cocos SWIG 生成工具...";
                    this.generateStatusClass = "";

                    try {
                        const result = await Editor.Message.request(
                            packageName,
                            "generate-native-bindings",
                            this.engineRoot.trim(),
                        );
                        if (result.success) {
                            this.generateHintText = "Native binding 生成完成。";
                            this.generateStatusClass = "ok";
                        } else {
                            this.generateHintText =
                                result.stderr ||
                                result.error ||
                                "Native binding 生成失败，请检查 Cocos engine 根目录。";
                            this.generateStatusClass = "missing";
                        }
                    } catch (err: any) {
                        this.generateHintText = `Native binding 生成失败: ${err.message || String(err)}`;
                        this.generateStatusClass = "missing";
                    } finally {
                        this.generatingNativeBindings = false;
                        this.generateBtnText = "生成 Native Binding";
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
