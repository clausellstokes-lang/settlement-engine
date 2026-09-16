/**
 * tests/lib/sessionClientNewDevice.test.js — M-9e (§7.4): the supersession side effects.
 *
 * When a fresh sign-in's claim SUPERSEDED a different prior session, claimSession must:
 *   · fire the new-device notification through the Wave-E mail seam consumer
 *     (notifyNewDeviceSignin, template 'new_device_signin' + payload {device_label, at}),
 *   · fire the supersession analytics ENRICH (session_started + superseded_prior:true,
 *     zero new eager event names).
 * When the claim did NOT supersede (first sign-in / same session), NEITHER fires.
 * Both effects are best-effort and never block auth (a throwing seam is swallowed).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const claimCurrentSession = vi.fn();
const isCurrentSession = vi.fn().mockResolvedValue(true);
const sessionDeviceLabel = vi.fn(() => 'Chrome on macOS');
const notifyNewDeviceSignin = vi.fn();
const track = vi.fn();
const EVENTS = { SESSION_STARTED: 'session_started' };

vi.mock('../../src/lib/authSecurity.js', () => ({ claimCurrentSession, isCurrentSession, sessionDeviceLabel }));
vi.mock('../../src/lib/emailLifecycle.js', () => ({ notifyNewDeviceSignin }));
vi.mock('../../src/lib/analytics.js', () => ({ track, EVENTS }));

let claimSession;
beforeEach(async () => {
  vi.clearAllMocks();
  isCurrentSession.mockResolvedValue(true);
  ({ claimSession } = await import('../../src/lib/sessionClient.js'));
});

describe('claimSession — supersession side effects (M-9e)', () => {
  it('fires the new-device notification + analytics enrich when the claim superseded a prior session', async () => {
    claimCurrentSession.mockResolvedValue({ superseded: true, deviceLabel: 'Safari on iOS', at: '2026-07-19T00:00:00.000Z' });
    const res = await claimSession();
    // Let the fire-and-forget dynamic imports resolve.
    await new Promise((r) => setTimeout(r, 0));

    expect(res.superseded).toBe(true);
    expect(notifyNewDeviceSignin).toHaveBeenCalledTimes(1);
    expect(notifyNewDeviceSignin).toHaveBeenCalledWith({ device_label: 'Safari on iOS', at: '2026-07-19T00:00:00.000Z' });
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('session_started', { superseded_prior: true });
  });

  it('fires NEITHER effect on a non-superseding claim (first sign-in / same session)', async () => {
    claimCurrentSession.mockResolvedValue({ superseded: false, deviceLabel: 'Chrome on macOS', at: '2026-07-19T00:00:00.000Z' });
    await claimSession();
    await new Promise((r) => setTimeout(r, 0));

    expect(notifyNewDeviceSignin).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
  });

  it('never throws when the claim itself rejects (auth is never blocked)', async () => {
    claimCurrentSession.mockRejectedValue(new Error('rpc down'));
    await expect(claimSession()).resolves.toMatchObject({ superseded: false });
    expect(notifyNewDeviceSignin).not.toHaveBeenCalled();
  });
});
