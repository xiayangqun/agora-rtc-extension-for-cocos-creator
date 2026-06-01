/**
 * Test Framework for Agora RTC JSB Integration Tests
 *
 * Provides test infrastructure: assert, test runner, logging, results tracking.
 */

export interface TestResults {
    total: number;
    passed: number;
    failed: number;
    errors: string[];
}

export class TestRunner {
    private results: TestResults = {
        total: 0,
        passed: 0,
        failed: 0,
        errors: [],
    };

    private testSuites: TestCase[] = [];

    log(message: string, isError: boolean = false): void {
        if (isError) {
            console.error(message);
        } else {
            console.log(message);
        }
        if (typeof (globalThis as any).__agoraIntegrationLog === "function") {
            (globalThis as any).__agoraIntegrationLog(message);
        }
    }

    assert(condition: boolean, message: string): void {
        this.results.total++;
        if (condition) {
            this.results.passed++;
            this.log("[PASS] " + message);
        } else {
            this.results.failed++;
            this.results.errors.push(message);
            this.log("[FAIL] " + message, true);
        }
    }

    addTestSuite(suite: TestCase): void {
        this.testSuites.push(suite);
    }

    async runAll(): Promise<void> {
        this.log("Starting test execution...");

        for (const suite of this.testSuites) {
            await suite.run(this);
        }

        this.printSummary();
        this.finish();
    }

    private printSummary(): void {
        this.log("\n========================================");
        this.log("Test Results: " + this.results.passed + "/" + this.results.total + " passed");
        if (this.results.failed > 0) {
            this.log("FAILED tests:");
            this.results.errors.forEach((err: string) => {
                this.log("  - " + err);
            });
        } else {
            this.log("ALL TESTS PASSED!");
        }
        this.log("========================================\n");
    }

    private finish(): void {
        this.log("All tests complete, exiting...");
        if (typeof (globalThis as any).__agoraIntegrationExit === "function") {
            (globalThis as any).__agoraIntegrationExit(this.results.failed > 0 ? 1 : 0);
        }
    }
}

export abstract class TestCase {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract run(runner: TestRunner): Promise<void>;

    protected async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
