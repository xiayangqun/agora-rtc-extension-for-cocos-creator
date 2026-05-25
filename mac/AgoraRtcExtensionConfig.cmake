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

add_library(AgoraRtcExtension STATIC
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AgoraRtcEngineBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AgoraRtcEventHandlerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual/jsb_agora_rtc_manual.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/register.cpp
)

if(EXISTS ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_auto.cpp)
    target_sources(AgoraRtcExtension PRIVATE
        ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_auto.cpp
    )
endif()

if(CMAKE_GENERATOR STREQUAL "Xcode")
    set_target_properties(AgoraRtcExtension PROPERTIES
        XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "NO"
        XCODE_ATTRIBUTE_ARCHS "$(ARCHS_STANDARD)"
    )
endif()

target_include_directories(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_EXTENSION_ROOT}/mac/include/rtc
    ${AGORA_RTC_EXTENSION_ROOT}/native
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual
    ${COCOS_X_PATH}/external/mac/include
    ${COCOS_X_PATH}/external/mac/include/v8
    ${COCOS_X_PATH}
    ${COCOS_X_PATH}/cocos
    ${COCOS_X_PATH}/cocos/bindings/jswrapper
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

file(GLOB AGORA_RTC_MAC_FRAMEWORKS
    ${AGORA_RTC_EXTENSION_ROOT}/mac/libs/*.xcframework/macos-arm64_x86_64/*.framework
)

target_link_libraries(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_MAC_FRAMEWORKS}
)

foreach(AGORA_RTC_MAC_FRAMEWORK ${AGORA_RTC_MAC_FRAMEWORKS})
    set_source_files_properties(${AGORA_RTC_MAC_FRAMEWORK} PROPERTIES
        MACOSX_PACKAGE_LOCATION Frameworks
    )
endforeach()
