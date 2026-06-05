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

file(GLOB AGORA_RTC_IOS_XCFRAMEWORKS
    ${AGORA_RTC_EXTENSION_ROOT}/ios/libs/*.xcframework
)

set(AGORA_RTC_IOS_FRAMEWORKS)
set(AGORA_RTC_IOS_XCFRAMEWORK_PATHS)
set(AGORA_RTC_IOS_DEVICE_FRAMEWORK_SEARCH_PATHS)
set(AGORA_RTC_IOS_SIMULATOR_FRAMEWORK_SEARCH_PATHS)

foreach(AGORA_RTC_IOS_XCFRAMEWORK ${AGORA_RTC_IOS_XCFRAMEWORKS})
    get_filename_component(AGORA_RTC_IOS_FRAMEWORK_NAME ${AGORA_RTC_IOS_XCFRAMEWORK} NAME_WE)

    list(APPEND AGORA_RTC_IOS_FRAMEWORKS
        "-framework ${AGORA_RTC_IOS_FRAMEWORK_NAME}"
    )
    list(APPEND AGORA_RTC_IOS_XCFRAMEWORK_PATHS
        "${AGORA_RTC_IOS_XCFRAMEWORK}"
    )

    if(EXISTS "${AGORA_RTC_IOS_XCFRAMEWORK}/ios-arm64")
        list(APPEND AGORA_RTC_IOS_DEVICE_FRAMEWORK_SEARCH_PATHS
            "${AGORA_RTC_IOS_XCFRAMEWORK}/ios-arm64"
        )
    endif()

    if(EXISTS "${AGORA_RTC_IOS_XCFRAMEWORK}/ios-arm64_x86_64-simulator")
        list(APPEND AGORA_RTC_IOS_SIMULATOR_FRAMEWORK_SEARCH_PATHS
            "${AGORA_RTC_IOS_XCFRAMEWORK}/ios-arm64_x86_64-simulator"
        )
    endif()
endforeach()

list(JOIN AGORA_RTC_IOS_DEVICE_FRAMEWORK_SEARCH_PATHS " " AGORA_RTC_IOS_DEVICE_FRAMEWORK_SEARCH_PATHS_STRING)
list(JOIN AGORA_RTC_IOS_SIMULATOR_FRAMEWORK_SEARCH_PATHS " " AGORA_RTC_IOS_SIMULATOR_FRAMEWORK_SEARCH_PATHS_STRING)

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
    ${AGORA_RTC_EXTENSION_ROOT}/ios/include/rtc
    ${AGORA_RTC_EXTENSION_ROOT}/ios/libs/aosl.xcframework/ios-arm64/aosl.framework/Headers
    ${AGORA_RTC_EXTENSION_ROOT}/native
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual
    ${COCOS_X_PATH}
    ${COCOS_X_PATH}/external/ios/include
    ${COCOS_X_PATH}/external/ios/include/v8
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
    ${AGORA_RTC_IOS_FRAMEWORKS}
)

if(CMAKE_GENERATOR STREQUAL "Xcode")
    set(CMAKE_XCODE_ATTRIBUTE_FRAMEWORK_SEARCH_PATHS[sdk=iphoneos*]
        "$(inherited) ${AGORA_RTC_IOS_DEVICE_FRAMEWORK_SEARCH_PATHS_STRING}"
    )
    set(CMAKE_XCODE_ATTRIBUTE_FRAMEWORK_SEARCH_PATHS[sdk=iphonesimulator*]
        "$(inherited) ${AGORA_RTC_IOS_SIMULATOR_FRAMEWORK_SEARCH_PATHS_STRING}"
    )

    set_target_properties(AgoraRtcExtension PROPERTIES
        XCODE_ATTRIBUTE_FRAMEWORK_SEARCH_PATHS[sdk=iphoneos*]
            "$(inherited) ${AGORA_RTC_IOS_DEVICE_FRAMEWORK_SEARCH_PATHS_STRING}"
        XCODE_ATTRIBUTE_FRAMEWORK_SEARCH_PATHS[sdk=iphonesimulator*]
            "$(inherited) ${AGORA_RTC_IOS_SIMULATOR_FRAMEWORK_SEARCH_PATHS_STRING}"
    )
endif()

function(agora_rtc_extension_embed_ios_frameworks TARGET_NAME)
    if(NOT CMAKE_GENERATOR STREQUAL "Xcode")
        return()
    endif()

    if(NOT TARGET ${TARGET_NAME})
        return()
    endif()

    set_target_properties(${TARGET_NAME} PROPERTIES
        XCODE_EMBED_FRAMEWORKS "${AGORA_RTC_IOS_XCFRAMEWORK_PATHS}"
        XCODE_EMBED_FRAMEWORKS_CODE_SIGN_ON_COPY YES
        XCODE_EMBED_FRAMEWORKS_REMOVE_HEADERS_ON_COPY YES
        XCODE_ATTRIBUTE_LD_RUNPATH_SEARCH_PATHS "$(inherited) @executable_path/Frameworks"
    )
endfunction()

if(CMAKE_GENERATOR STREQUAL "Xcode")
    if(DEFINED CC_EXECUTABLE_NAME)
        set(AGORA_RTC_IOS_APP_TARGET ${CC_EXECUTABLE_NAME})
    elseif(DEFINED APP_NAME)
        set(AGORA_RTC_IOS_APP_TARGET "${APP_NAME}-mobile")
    endif()

    if(AGORA_RTC_IOS_APP_TARGET)
        cmake_language(DEFER
            DIRECTORY ${CMAKE_SOURCE_DIR}
            CALL agora_rtc_extension_embed_ios_frameworks ${AGORA_RTC_IOS_APP_TARGET}
        )
    endif()
endif()
