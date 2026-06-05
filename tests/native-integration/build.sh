#!/bin/bash
# Build and run the Agora JSB integration test
# This creates a real Cocos application with full engine runtime

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build"

echo "=== Building Agora JSB Integration Test ==="
echo "Source: ${SCRIPT_DIR}"

# Create build directory
mkdir -p "${BUILD_DIR}"
cd "${BUILD_DIR}"

# Configure with CMake (generates Xcode project)
cmake .. -G Xcode -DCMAKE_OSX_DEPLOYMENT_TARGET=13.0

# Build the project
echo ""
echo "=== Building with Xcode ==="
cmake --build . --config Debug

echo ""
echo "=== Build complete ==="
echo "Xcode project: ${BUILD_DIR}/AgoraJSBIntegrationTest.xcodeproj"
echo ""
echo "To run manually:"
echo "  cd ${BUILD_DIR}"
echo "  ./Debug/AgoraJSBIntegrationTest.app/Contents/MacOS/AgoraJSBIntegrationTest"
