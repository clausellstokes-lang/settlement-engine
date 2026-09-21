/** @vitest-environment jsdom */
/**
 * errorReporter.test.js — pins the in-session dedup + sampling cap added for the
 * production error-reporting hardening. These guard the NETWORK send only: the
 * local console.error is unconditional (a dev breadcrumb), but a render-loop
 * crash must not fire hundreds of identical beacons at the sink.
 *
 * ENDPOINT is captured at module-eval from VITE_ERROR_REPORT_URL, so every test
 * stubs the env then re-imports the module fresh (vi.resetModules).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = 'https://sink.test/report';

/** Fresh module with the endpoint configured + a mock sendBeacon; returns the beacon spy. */
async function loadWithEndpoint(url = ENDPOINT) {
  vi.resetModules();
  vi.stubEnv('VITE_ERROR_REPORT_URL', url);
  const beacon = vi.fn(() => true);
  Object.defineProperty(globalThis.navigator, 'sendBeacon', { value: beacon, configurable: true });
  const mod = await import('../../src/lib/errorReporter.js');
  // Fresh module per test (vi.resetModules) → the in-memory dedup Set + counter
  // start empty; no reset export needed.
  return { beacon, reportError: mod.reportError, setCrashForensics: mod.setCrashForensics };
}

/** An Error with a deterministic stack so the signature is stable across calls. */
function errAt(message, frame = 'at foo (app.js:1:1)') {
  const e = new Error(message);
  e.stack = `Error: ${message}\n    ${frame}`;
  return e;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('errorReporter dedup + sampling cap', () => {
  it('sends a given signature at most once per session (dedup)', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    reportError(errAt('boom'));
    reportError(errAt('boom'));
    reportError(errAt('boom'));
    expect(beacon).toHaveBeenCalledTimes(1);
  });

  it('sends distinct signatures separately', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    reportError(errAt('boom-a'));
    reportError(errAt('boom-b'));
    expect(beacon).toHaveBeenCalledTimes(2);
  });

  it('caps total reports at 25 per session even with all-distinct signatures', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    for (let i = 0; i < 40; i++) reportError(errAt(`boom-${i}`));
    expect(beacon).toHaveBeenCalledTimes(25);
  });

  it('never touches the network when no endpoint is configured', async () => {
    const { beacon, reportError } = await loadWithEndpoint('');
    reportError(errAt('boom'));
    expect(beacon).not.toHaveBeenCalled();
  });

  // [security-3] The reported url must be origin+pathname only — never the query
  // string or fragment. The founder-transfer cooling email's one-click abort link is
  // /account?section=subscription&transfer_case=<id>&transfer_abort=<token>; a client
  // crash on that page must NOT persist the single-use abort token into client_error_events.
  it('strips the query string + fragment from the reported url (never leaks a token)', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    const TOKEN = 'abrt_SECRET_9f3c2a1b';
    window.history.pushState({}, '', `/account?section=subscription&transfer_abort=${TOKEN}#frag`);
    reportError(errAt('crash while aborting'));
    expect(beacon).toHaveBeenCalledTimes(1);
    const body = JSON.parse(beacon.mock.calls[0][1]);
    expect(body.url).toBe(window.location.origin + '/account');
    expect(body.url).not.toContain(TOKEN);
    expect(body.url).not.toContain('transfer_abort');
    expect(body.url).not.toContain('?');
    expect(body.url).not.toContain('#');
  });
});

// ── R-14 CRASH FORENSICS BY CONSTRUCTION ──────────────────────────────────────
// Determinism makes every crash reproducible from four small values: seed + tick
// + flags_on + build hash (release). The report captures the first three from the
// registered provider — WHITELISTED to scalars — plus the build hash. The load-
// bearing property is the NO-STATE guarantee by construction: even a provider that
// returns world state / PII cannot leak it, because reportError copies only the
// three type-coerced scalar fields.
describe('R-14 crash forensics — seed + tick + flags_on, no world state', () => {
  it('captures seed + tick + flags_on from the provider, plus the build hash (release)', async () => {
    const { beacon, reportError, setCrashForensics } = await loadWithEndpoint();
    setCrashForensics(() => ({ seed: 'harrowmoor-8823', tick: 137, flags_on: ['heirsEnabled', 'assizeEnabled'] }));
    reportError(errAt('crash in a known world'));
    const body = JSON.parse(beacon.mock.calls[0][1]);
    expect(body.forensics).toEqual({ seed: 'harrowmoor-8823', tick: 137, flags_on: ['heirsEnabled', 'assizeEnabled'] });
    // The fourth reproduction value — the build hash — rides its existing field.
    expect(body).toHaveProperty('release');
  });

  it('BY CONSTRUCTION: a provider leaking world state / PII yields ONLY the three scalars', async () => {
    const { beacon, reportError, setCrashForensics } = await loadWithEndpoint();
    // A hostile/careless provider returns a whole world + PII alongside the coordinates.
    setCrashForensics(() => ({
      seed: 'seed-1',
      tick: 5,
      flags_on: ['x'],
      // Everything below MUST be dropped by the whitelist:
      worldState: { npcs: [{ name: 'Reeve of Harrowmoor', bonds: [1, 2, 3] }], tick: 5 },
      settlement: { name: "Kelder's Reach", population: 4410 },
      email: 'player@example.com',
      userId: 'auth-uuid-1234',
      npcs: [{ secret: 'covert corruption' }],
    }));
    reportError(errAt('crash with a fat provider'));
    const body = JSON.parse(beacon.mock.calls[0][1]);
    // Exactly the three whitelisted keys — nothing else survives.
    expect(Object.keys(body.forensics).sort()).toEqual(['flags_on', 'seed', 'tick']);
    // The entire serialized report carries no world/PII token anywhere.
    const wire = beacon.mock.calls[0][1];
    for (const leak of ['npcs', 'worldState', 'population', 'covert corruption', 'player@example.com', 'auth-uuid-1234', 'Kelder']) {
      expect(wire).not.toContain(leak);
    }
  });

  it('type-coerces defensively: non-scalar seed dropped, non-finite tick dropped, non-string flags filtered', async () => {
    const { beacon, reportError, setCrashForensics } = await loadWithEndpoint();
    setCrashForensics(() => ({ seed: { nested: 'obj' }, tick: NaN, flags_on: ['ok', 42, null, 'also-ok'] }));
    reportError(errAt('malformed forensics'));
    const f = JSON.parse(beacon.mock.calls[0][1]).forensics;
    expect(f.seed).toBeUndefined();          // object seed dropped
    expect(f.tick).toBeUndefined();          // NaN tick dropped
    expect(f.flags_on).toEqual(['ok', 'also-ok']); // non-strings filtered out
  });

  it('a throwing or absent provider degrades to an empty forensics object (never crashes the reporter)', async () => {
    const { beacon, reportError, setCrashForensics } = await loadWithEndpoint();
    // No provider registered yet:
    reportError(errAt('no provider'));
    expect(JSON.parse(beacon.mock.calls[0][1]).forensics).toEqual({});
    // A provider that throws:
    setCrashForensics(() => { throw new Error('provider blew up'); });
    reportError(errAt('throwing provider'));
    expect(JSON.parse(beacon.mock.calls[1][1]).forensics).toEqual({});
  });
});

// ── BENIGN BROWSER NOTICES ───────────────────────────────────────────────────
// "ResizeObserver loop completed with undelivered notifications." is posted to
// window.onerror by the engine itself when an observer callback changes layout;
// the deferred notifications are delivered on the next frame, so nothing is lost
// and there is nothing to act on. A desktop Realm mount reported it TWICE, which
// both buried real console errors and spent two of the 25 per-session beacons on
// a non-event. It must leave by BOTH doors — the local console.error and the
// network send — while every other error keeps both.
//
// It is DROPPED, NOT ERASED. A silent suppression is how a genuine runaway
// observer loop becomes invisible, so the first match per page load leaves one
// console.debug naming the class; later matches are silent (a real loop fires
// every frame, and a per-match breadcrumb would be the flood the filter exists to
// stop). Nothing about the beacon path changes: a notice is never reported.
describe('benign browser notices are not application errors', () => {
  const NOTICES = [
    'ResizeObserver loop completed with undelivered notifications.', // current spelling
    'ResizeObserver loop limit exceeded',                            // older spelling
  ];

  /** Silence + spy BOTH console levels the filter touches. */
  function spyConsole() {
    return {
      logged: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debugged: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  }

  // One parameterless test looping over NOTICES in its body, with a per-notice
  // assertion label — NOT `it.each`. A registration callback that declares a row
  // parameter parks the whole file in the lighting census's each-family debt
  // (tests/lint/sovereigntyLightingContract.walker.test.js), whose ceiling only
  // ever shrinks. Every notice and every assertion is kept.
  it('drops each known notice from the error log AND the network', async () => {
    const { logged, debugged } = spyConsole();
    for (const notice of NOTICES) {
      // Per-notice isolation: a fresh module (so the once-per-page-load debug
      // breadcrumb re-arms) and counters cleared, since vi.spyOn hands back the
      // SAME spy on a second call and its calls would otherwise accumulate.
      logged.mockClear();
      debugged.mockClear();
      const { beacon, reportError } = await loadWithEndpoint();
      // The window 'error' listener forwards `e.error || e.message`; this notice
      // carries no Error object, so a bare string is what actually arrives.
      reportError(notice, { kind: 'window.error' });
      expect(beacon, notice).not.toHaveBeenCalled();
      expect(logged, notice).not.toHaveBeenCalled();
      // …but the suppression itself is discoverable, once, at debug level.
      expect(debugged, notice).toHaveBeenCalledTimes(1);
      expect(String(debugged.mock.calls[0][0]), notice).toContain('ResizeObserver loop');
      expect(debugged.mock.calls[0][1], notice).toBe(notice);
    }
  });

  it('announces the dropped class ONCE per page load, however many notices arrive', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    const { logged, debugged } = spyConsole();
    // A real runaway loop fires this on every frame: the breadcrumb must not flood.
    for (let i = 0; i < 50; i++) {
      reportError('ResizeObserver loop completed with undelivered notifications.', { kind: 'window.error' });
    }
    expect(debugged).toHaveBeenCalledTimes(1);
    expect(logged).not.toHaveBeenCalled();
    expect(beacon).not.toHaveBeenCalled();
  });

  it('tolerates the browser envelope (an Uncaught prefix, a missing/extra full stop)', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    const { logged, debugged } = spyConsole();
    reportError('Uncaught ResizeObserver loop completed with undelivered notifications', { kind: 'window.error' });
    reportError('ResizeObserver loop limit exceeded.', { kind: 'window.error' });
    reportError(new Error('ResizeObserver loop completed with undelivered notifications.'));
    expect(beacon).not.toHaveBeenCalled();
    expect(logged).not.toHaveBeenCalled();
    expect(debugged).toHaveBeenCalledTimes(1); // all three matched; one breadcrumb
  });

  it('still reports a REAL error that merely mentions ResizeObserver', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    const { logged, debugged } = spyConsole();
    reportError(errAt('ResizeObserver callback threw: cannot read properties of null'));
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(logged).toHaveBeenCalledTimes(1);
    expect(debugged).not.toHaveBeenCalled(); // not a suppression — nothing to announce
    expect(JSON.parse(beacon.mock.calls[0][1]).message)
      .toBe('ResizeObserver callback threw: cannot read properties of null');
  });

  it('leaves every unrelated error on both paths, and adds no debug noise', async () => {
    const { beacon, reportError } = await loadWithEndpoint();
    const { logged, debugged } = spyConsole();
    reportError(errAt('the forge stalled'));
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(logged).toHaveBeenCalledTimes(1);
    expect(debugged).not.toHaveBeenCalled();
  });
});
