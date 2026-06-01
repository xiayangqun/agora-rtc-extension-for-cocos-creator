#include "MockFactory.h"
#include "MockIRtcEngineEx.h"
#include "IAgoraMediaPlayer.h"

agora::rtc::IRtcEngine* createAgoraRtcEngine() {
    return static_cast<agora::rtc::IRtcEngine*>(&agora::rtc::MockIRtcEngineEx::instance());
}

namespace agora {
namespace rtc {
void IRtcEngine::release(RtcEngineReleaseCallback /*callback*/) {}
} // namespace rtc
} // namespace agora

agora::rtc::IMediaPlayerCacheManager* getMediaPlayerCacheManager() {
    return nullptr;
}

namespace se { class Object; }
bool register_agora_test_trigger(se::Object* /*global*/) { return true; }
