/**
 * Test utility functions
 */

export function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

export function log(message: string): void {
    console.log(`[TEST] ${message}`);
}
