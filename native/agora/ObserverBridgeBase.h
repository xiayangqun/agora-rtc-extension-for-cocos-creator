#pragma once

#include <atomic>
#include <memory>
#include <vector>

#include "agora/RtcNativeValueToSe.h"
#include "bindings/jswrapper/SeApi.h"

//jsb ignore class
class ObserverBridgeBase : public std::enable_shared_from_this<ObserverBridgeBase> {
public:
    explicit ObserverBridgeBase(se::Object *eventHandler);
    virtual ~ObserverBridgeBase();

    void invalidateCallbacks();
    bool canDispatchCallbacks() const;
    se::Object *eventHandler() const;

protected:
    static void callHandler(const std::shared_ptr<ObserverBridgeBase> &owner, const char *method,
                            const se::ValueArray &args);
    static bool isScriptEngineValid();

    static void pushArg(se::ValueArray &args, const se::Value &value);
    static void pushArg(se::ValueArray &args, long value) {
        se::Value converted;
        // Keep 64-bit callback values as JS number; Cocos JSB int64_t/uint64_t overloads produce BigInt.
        converted.setLong(value);
        args.push_back(converted);
    }
    static void pushArg(se::ValueArray &args, unsigned long value) { pushArg(args, static_cast<long>(value)); }
    static void pushArg(se::ValueArray &args, long long value) { pushArg(args, static_cast<long>(value)); }
    static void pushArg(se::ValueArray &args, unsigned long long value) { pushArg(args, static_cast<long>(value)); }

    template <typename T> static void pushArg(se::ValueArray &args, const T &value) {
        se::Value converted;
        if (!nativevalue_to_se(value, converted, nullptr)) { converted.setNull(); }
        args.push_back(converted);
    }

private:
    se::Object *_eventHandler{nullptr};
    std::atomic_bool _callbacksEnabled{true};
};
