set(AGORA_RTC_EXTENSION_ROOT ${CMAKE_CURRENT_LIST_DIR}/..)

set(AGORA_RTC_WINDOWS_ARCH x86)
if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    set(AGORA_RTC_WINDOWS_ARCH x86_64)
endif()

set(AGORA_RTC_WINDOWS_LIB_DIR ${AGORA_RTC_EXTENSION_ROOT}/windows/libs/${AGORA_RTC_WINDOWS_ARCH})
if(NOT EXISTS "${AGORA_RTC_WINDOWS_LIB_DIR}" AND AGORA_RTC_WINDOWS_ARCH STREQUAL "x86_64")
    set(AGORA_RTC_WINDOWS_LIB_DIR ${AGORA_RTC_EXTENSION_ROOT}/windows/libs/x64)
endif()

if(NOT EXISTS "${AGORA_RTC_WINDOWS_LIB_DIR}")
    message(FATAL_ERROR "AgoraRtcExtension Windows SDK libs not found for ${AGORA_RTC_WINDOWS_ARCH}: ${AGORA_RTC_WINDOWS_LIB_DIR}. Run npm run predownload -- --platform windows first.")
endif()

file(GLOB AGORA_RTC_WINDOWS_IMPORT_LIBS
    ${AGORA_RTC_WINDOWS_LIB_DIR}/*.lib
)

file(GLOB AGORA_RTC_WINDOWS_DLLS
    ${AGORA_RTC_WINDOWS_LIB_DIR}/*.dll
)

if(NOT AGORA_RTC_WINDOWS_IMPORT_LIBS)
    message(FATAL_ERROR "AgoraRtcExtension Windows import libraries (*.lib) not found in ${AGORA_RTC_WINDOWS_LIB_DIR}")
endif()

add_library(AgoraRtcExtension STATIC
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AgoraRtcAndroidLoader.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/ObserverBridgeBase.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcEngineExBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoTextureManager.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcEngineEventHandlerExBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerSourceObserverBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcNativeValueToSe.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AudioDeviceManagerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoDeviceManagerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoEffectObjectBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/ScreenCaptureSourceListBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoDeviceCollectionBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AudioDeviceCollectionBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/H265TranscoderBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/H265TranscoderObserverBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/LocalSpatialAudioEngineBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaEngineBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerCacheManagerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaRecorderBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaRecorderObserverBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MusicContentCenterBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MusicContentCenterEventHandlerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MusicPlayerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual/jsb_agora_rtc_manual.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual/RtcSeValueToNative.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/register.cpp
)

if(EXISTS ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_engine_bridge_auto.cpp)
    target_sources(AgoraRtcExtension PRIVATE
        ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_engine_bridge_auto.cpp
    )
endif()

target_include_directories(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_EXTENSION_ROOT}/windows/include/rtc
    ${AGORA_RTC_EXTENSION_ROOT}/native
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual
    ${COCOS_X_PATH}
    ${COCOS_X_PATH}/external/win64/include
    ${COCOS_X_PATH}/external/win64/include/v8
    ${COCOS_X_PATH}/external/windows/include
    ${COCOS_X_PATH}/external/windows/include/v8
    ${COCOS_X_PATH}/external/win32/include
    ${COCOS_X_PATH}/external/win32/include/v8
    ${COCOS_X_PATH}/cocos
    ${COCOS_X_PATH}/cocos/bindings/jswrapper
    ${COCOS_X_PATH}/cocos/renderer
)

target_compile_features(AgoraRtcExtension PUBLIC cxx_std_17)

set(AGORA_RTC_WINDOWS_COMPILE_DEFINITIONS
    CC_USE_PLUGINS=1
    USE_V8_DEBUGGER=0
    NOMINMAX
    WIN32_LEAN_AND_MEAN
)
if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    list(APPEND AGORA_RTC_WINDOWS_COMPILE_DEFINITIONS V8_COMPRESS_POINTERS)
endif()

target_compile_definitions(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_WINDOWS_COMPILE_DEFINITIONS}
)

target_compile_options(AgoraRtcExtension PUBLIC
    /FI"${AGORA_RTC_EXTENSION_ROOT}/native/agora/AgoraRtcWindowsCompat.h"
)

if(MSVC)
    target_compile_options(AgoraRtcExtension PUBLIC
        /bigobj
        /Zc:__cplusplus
        /wd4251
        /wd4267
        /wd4819
    )
endif()

target_link_libraries(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_WINDOWS_IMPORT_LIBS}
)

function(agora_rtc_extension_copy_windows_dlls TARGET_NAME)
    if(NOT TARGET ${TARGET_NAME})
        return()
    endif()

    foreach(AGORA_RTC_WINDOWS_DLL ${AGORA_RTC_WINDOWS_DLLS})
        add_custom_command(TARGET ${TARGET_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
                "${AGORA_RTC_WINDOWS_DLL}"
                "$<TARGET_FILE_DIR:${TARGET_NAME}>"
            VERBATIM
        )
    endforeach()
endfunction()

agora_rtc_extension_copy_windows_dlls(AgoraRtcExtension)

if(DEFINED CC_EXECUTABLE_NAME)
    set(AGORA_RTC_WINDOWS_APP_TARGET ${CC_EXECUTABLE_NAME})
elseif(DEFINED APP_NAME)
    set(AGORA_RTC_WINDOWS_APP_TARGET "${APP_NAME}")
endif()

if(AGORA_RTC_WINDOWS_APP_TARGET)
    cmake_language(DEFER
        DIRECTORY ${CMAKE_SOURCE_DIR}
        CALL agora_rtc_extension_copy_windows_dlls ${AGORA_RTC_WINDOWS_APP_TARGET}
    )
endif()
