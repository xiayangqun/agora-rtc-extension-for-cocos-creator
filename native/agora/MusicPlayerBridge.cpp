#include "agora/MusicPlayerBridge.h"

#include "AgoraBase.h"

MusicPlayerBridge::MusicPlayerBridge(agora::agora_refptr<agora::rtc::IMusicPlayer> musicPlayer)
    : MediaPlayerBridge(musicPlayer), _musicPlayer(musicPlayer) {}

agora::agora_refptr<agora::rtc::IMusicPlayer> MusicPlayerBridge::musicPlayer() const {
    return _musicPlayer;
}

void MusicPlayerBridge::invalidate() {
    MediaPlayerBridge::invalidate();
    if (_musicPlayer) { _musicPlayer.reset(); }
}

int MusicPlayerBridge::openWithSongCode(int64_t songCode, int64_t startPos) {
    if (!_musicPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicPlayer->open(songCode, startPos);
}

int MusicPlayerBridge::setPlayMode(agora::rtc::MusicPlayMode mode) {
    if (!_musicPlayer) { return -agora::ERR_INVALID_ARGUMENT; }
    return _musicPlayer->setPlayMode(mode);
}
