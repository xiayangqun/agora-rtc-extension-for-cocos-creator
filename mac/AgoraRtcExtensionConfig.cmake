set(AGORA_RTC_EXTENSION_ROOT ${CMAKE_CURRENT_LIST_DIR}/..)
set(AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE _LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION)

# Cocos Creator 3.8.0 bundles Boost headers that still reference
# std::unary_function. Newer Apple libc++ hides it in C++17 unless this
# compatibility define is enabled. Apply it globally because the error can
# surface while compiling the engine or app target, not just this plugin.
add_definitions(-D${AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE})

if(DEFINED ENGINE_NAME AND TARGET ${ENGINE_NAME})
    target_compile_definitions(${ENGINE_NAME} PUBLIC
        ${AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE}
    )
endif()

if(CMAKE_GENERATOR STREQUAL "Xcode")
    set(CMAKE_XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "NO")
    set(CMAKE_XCODE_ATTRIBUTE_ARCHS "$(ARCHS_STANDARD)")
endif()

file(GLOB AGORA_RTC_MAC_FRAMEWORKS
    ${AGORA_RTC_EXTENSION_ROOT}/mac/libs/*.xcframework/macos-arm64_x86_64/*.framework
)

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

if(CMAKE_GENERATOR STREQUAL "Xcode")
    set_target_properties(AgoraRtcExtension PROPERTIES
        XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "NO"
        XCODE_ATTRIBUTE_ARCHS "$(ARCHS_STANDARD)"
        XCODE_ATTRIBUTE_DEBUG_INFORMATION_FORMAT[variant=Debug] "dwarf"
        XCODE_ATTRIBUTE_GCC_OPTIMIZATION_LEVEL[variant=Debug] "0"
        XCODE_ATTRIBUTE_DEBUG_INFORMATION_FORMAT[variant=RelWithDebInfo] "dwarf-with-dsym"
        XCODE_ATTRIBUTE_GCC_OPTIMIZATION_LEVEL[variant=RelWithDebInfo] "Os"
    )
endif()

target_include_directories(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_EXTENSION_ROOT}/mac/include/rtc
    ${AGORA_RTC_EXTENSION_ROOT}/mac/libs/aosl.xcframework/macos-arm64_x86_64/aosl.framework/Headers
    ${AGORA_RTC_EXTENSION_ROOT}/native
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual
    ${COCOS_X_PATH}
    ${COCOS_X_PATH}/external/mac/include
    ${COCOS_X_PATH}/external/mac/include/v8
    ${COCOS_X_PATH}/cocos
    ${COCOS_X_PATH}/cocos/bindings/jswrapper
    ${COCOS_X_PATH}/cocos/renderer
)

target_compile_features(AgoraRtcExtension PUBLIC cxx_std_17)

target_compile_options(AgoraRtcExtension PUBLIC
    -Wno-missing-template-arg-list-after-template-kw
)

target_compile_definitions(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE}
    CC_USE_PLUGINS=1
    USE_V8_DEBUGGER=0
    V8_COMPRESS_POINTERS
)

target_link_libraries(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_MAC_FRAMEWORKS}
)

foreach(AGORA_RTC_MAC_FRAMEWORK ${AGORA_RTC_MAC_FRAMEWORKS})
    set_source_files_properties(${AGORA_RTC_MAC_FRAMEWORK} PROPERTIES
        MACOSX_PACKAGE_LOCATION Frameworks
    )
endforeach()
