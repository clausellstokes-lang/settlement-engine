/** @vitest-environment jsdom */
/**
 * crashForensicsBootTiming.test.js — R-14 SYNCHRONOUS-ARMING contract (the pin
 * that guards the first-paint thinning).
 *
 * The ratified contract is "eager-and-complete over lazy-and-unreliable-at-crash":
 * crash forensics must be ARMED SYNCHRONOUSLY at store boot, so a crash at ANY
 * moment after store init — including the very first tick, before any idle
 * callback could warm a lazy chunk — still captures the full { seed, tick,
 * flags_on } whitelist.
 *
 * WHY THIS PIN EXISTS: the first-paint reclaim split lib/flags.js into a lean
 * eager resolution core (flagRegistry.js, which crashForensics imports) and a lazy
 * description sidecar. That thinning is only sound if the arming stayed
 * synchronous. This test proves it end-to-end through the REAL store boot: it
 * imports src/store/index.js (whose module body calls setCrashForensics once) and
 * then fires reportError on the very next lines — no `await` of a warm-up, no idle
 * callback — and asserts the report carries all three coordinates. If a future
 * refactor made the arming lazy (e.g. a dynamic import of crashForensics/flags at
 * crash time), flags_on would come back empty here and this pin would fail.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = 'https://sink.test/boot-report';

/** An Error with a deterministic stack so the signature is stable. */
function errAt(message, frame = 'at boot (app.js:1:1)') {
  const e = new Error(message);
  e.stack = `Error: ${message}\n    ${frame}`;
  return e;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('R-14 — crash forensics is armed SYNCHRONOUSLY at store boot', () => {
  it('a crash immediately after store import captures the full { seed, tick, flags_on } whitelist', async () => {
    // Configure the sink + capture the beacon BEFORE the store (and its
    // transitive errorReporter) is evaluated — ENDPOINT is read at module-eval.
    vi.resetModules();
    vi.stubEnv('VITE_ERROR_REPORT_URL', ENDPOINT);
    const beacon = vi.fn(() => true);
    Object.defineProperty(globalThis.navigator, 'sendBeacon', { value: beacon, configurable: true });

    // Importing the store RUNS its boot body — including the single synchronous
    // `setCrashForensics(() => buildCrashForensics(useStore.getState()))` arming.
    const { useStore } = await import('../../src/store/index.js');
    // Same cached errorReporter instance the store just armed (no resetModules
    // between the two imports).
    const { reportError } = await import('../../src/lib/errorReporter.js');

    // Give the live world reproduction coordinates a crash would need.
    useStore.setState({
      activeCampaignId: 'boot-c1',
      campaigns: [{ id: 'boot-c1', worldState: { rngSeed: 'boot-seed-9f', tick: 12 } }],
    });

    // The "crash immediately after boot": no await of any warm-up, no idle wait.
    reportError(errAt('crash one tick after boot'));

    expect(beacon).toHaveBeenCalledTimes(1);
    const body = JSON.parse(beacon.mock.calls[0][1]);
    // All THREE coordinates were captured synchronously.
    expect(body.forensics.seed).toBe('boot-seed-9f');
    expect(body.forensics.tick).toBe(12);
    expect(Array.isArray(body.forensics.flags_on)).toBe(true);
    // flags_on is non-empty ⇒ getAllFlags resolved from the lean eager leaf at
    // crash time (this is the exact path the thinning re-routed through
    // flagRegistry.js). Empty here would mean the flag core failed to arm.
    expect(body.forensics.flags_on.length).toBeGreaterThan(0);
    expect(body.forensics.flags_on.every((n) => typeof n === 'string')).toBe(true);
    // Exactly the whitelist — no world state / PII rode along.
    expect(Object.keys(body.forensics).sort()).toEqual(['flags_on', 'seed', 'tick']);
  });
});
