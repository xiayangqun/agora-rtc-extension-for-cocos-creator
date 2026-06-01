/**
 * Agora RTC JSB Chain Integration Test
 *
 * Entry point for integration tests. Runs inside a real Cocos Creator engine
 * with V8 runtime, real scheduler, and Agora JSB bindings registered.
 */

import { TestRunner } from "./test-framework";
import { CallApiTestSuite } from "./call-api";
import { CallbackTestSuite } from "./callback";
import { SubApiTestSuite } from "./sub-api";

declare const cc: any;

async function main(): Promise<void> {
    (jsb as any).agora.test.setLogPath("../agora_test_log.jsonl");
    (jsb as any).agora.test.clearLog();

    const runner = new TestRunner();

    runner.addTestSuite(new CallApiTestSuite());
    runner.addTestSuite(new CallbackTestSuite());
    runner.addTestSuite(new SubApiTestSuite());

    await runner.runAll();
}

if (typeof cc !== "undefined" && cc.game) {
    cc.game.once(cc.game.EVENT_GAME_INITED, () => {
        setTimeout(() => main(), 100);
    });
} else if (typeof setTimeout === "function") {
    setTimeout(() => main(), 100);
} else {
    main();
}
