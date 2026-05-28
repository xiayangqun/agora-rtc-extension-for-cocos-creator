#include "bindings/jswrapper/SeApi.h"
#include "jsb_agora_rtc_manual.h"

#if __has_include("bindings/auto/jsb_agora_rtc_engine_bridge_auto.h")
#include "bindings/auto/jsb_agora_rtc_engine_bridge_auto.h"
#define AGORA_RTC_HAS_AUTO_BINDINGS 1
#else
#define AGORA_RTC_HAS_AUTO_BINDINGS 0
#endif

#if AGORA_RTC_HAS_AUTO_BINDINGS
static bool register_auto_bindings_under_jsb(se::Object *global) {
    se::Value jsbVal;
    if (!global->getProperty("jsb", &jsbVal, true) || !jsbVal.isObject()) {
        se::HandleObject jsbObj(se::Object::createPlainObject());
        jsbVal.setObject(jsbObj);
        global->setProperty("jsb", jsbVal);
    }
    return register_all_agora_rtc_engine_bridge(jsbVal.toObject());
}
#endif

extern "C" void cc_load_plugin_AgoraRtcExtension() {
    auto *se = se::ScriptEngine::getInstance();

#if AGORA_RTC_HAS_AUTO_BINDINGS
    se->addRegisterCallback(register_auto_bindings_under_jsb);
#endif

    se->addRegisterCallback(register_agora_rtc_manual);
}
