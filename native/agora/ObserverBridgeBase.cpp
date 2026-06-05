#include "agora/ObserverBridgeBase.h"

#include "bindings/jswrapper/SeApi.h"

ObserverBridgeBase::ObserverBridgeBase(se::Object *eventHandler)
    : _eventHandler(eventHandler) {
    if (_eventHandler != nullptr) {
        _eventHandler->incRef();
        _eventHandler->root();
    }
}

ObserverBridgeBase::~ObserverBridgeBase() {
    if (_eventHandler != nullptr) {
        _eventHandler->unroot();
        _eventHandler->decRef();
        _eventHandler = nullptr;
    }
}

void ObserverBridgeBase::invalidateCallbacks() {
    _callbacksEnabled.store(false, std::memory_order_release);
}

bool ObserverBridgeBase::canDispatchCallbacks() const {
    return _callbacksEnabled.load(std::memory_order_acquire);
}

se::Object *ObserverBridgeBase::eventHandler() const {
    return _eventHandler;
}

bool ObserverBridgeBase::isScriptEngineValid() {
    auto *scriptEngine = se::ScriptEngine::getInstance();
    return scriptEngine != nullptr && scriptEngine->isValid();
}

void ObserverBridgeBase::pushArg(se::ValueArray &args, const se::Value &value) {
    args.push_back(value);
}

void ObserverBridgeBase::callHandler(const std::shared_ptr<ObserverBridgeBase> &owner,
                                      const char *method, const se::ValueArray &args) {
    if (owner == nullptr || !owner->canDispatchCallbacks()) {
        return;
    }

    se::Object *handler = owner->eventHandler();
    if (handler == nullptr) {
        return;
    }

    se::Value callback;
    if (!handler->getProperty(method, &callback) || !callback.isObject() || !callback.toObject()->isFunction()) {
        return;
    }

    auto *scriptEngine = se::ScriptEngine::getInstance();
    if (scriptEngine == nullptr || !scriptEngine->isValid() || !owner->canDispatchCallbacks()) {
        return;
    }

    scriptEngine->clearException();
    callback.toObject()->call(args, handler);
}
