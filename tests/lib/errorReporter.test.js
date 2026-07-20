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
