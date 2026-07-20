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
  return { beacon, reportError: mod.reportError };
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
