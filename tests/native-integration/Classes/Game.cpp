/****************************************************************************
 Copyright (c) 2024 Agora.io
 
 Integration test Game class - boots real Cocos engine with Agora JSB bindings.
 ****************************************************************************/
#include "Game.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_classtype.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "agora/RtcEngineExBridge.h"
#include "bindings/auto/jsb_agora_rtc_engine_bridge_auto.h"
#include "jsb_agora_rtc_manual.h"
#include "jsb_trigger_events.h"

#include <cstdlib>
#include <iostream>

static bool integrationLog(se::State &s) {
    const auto &args = s.args();
    if (!args.empty()) {
        std::cout << args[0].toString() << std::endl;
    }
    return true;
}
SE_BIND_FUNC(integrationLog)

static bool integrationExit(se::State &s) {
    const auto &args = s.args();
    int code = args.empty() ? 0 : args[0].toInt32();
    std::cout.flush();
    std::cerr.flush();
    std::_Exit(code);
}
SE_BIND_FUNC(integrationExit)

static bool registerAgoraBindings(se::Object *global) {
    se::Value jsbVal;
    if (!global->getProperty("jsb", &jsbVal, true) || !jsbVal.isObject()) {
        se::HandleObject jsbObj(se::Object::createPlainObject());
        jsbVal.setObject(jsbObj);
        global->setProperty("jsb", jsbVal);
    }

    register_all_agora_rtc_engine_bridge(jsbVal.toObject());
    register_agora_rtc_manual(global);
    register_agora_trigger_events(global);

    global->defineFunction("__agoraIntegrationLog", _SE(integrationLog));
    global->defineFunction("__agoraIntegrationExit", _SE(integrationExit));
    return true;
}

Game::Game() = default;
Game::~Game() = default;

int Game::init() {
    _windowInfo.title = "AgoraJSBTest";
    _windowInfo.width = 800;
    _windowInfo.height = 600;
    _debuggerInfo.enabled = false;
    _xxteaKey = "";
    
    se::ScriptEngine::getInstance()->addRegisterCallback(registerAgoraBindings);
    
    return cc::BaseGame::init();
}

void Game::onPause() {
    cc::BaseGame::onPause();
}

void Game::onResume() {
    cc::BaseGame::onResume();
}

void Game::onClose() {
    cc::BaseGame::onClose();
}

CC_REGISTER_APPLICATION(Game);
