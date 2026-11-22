/** @vitest-environment jsdom */
/**
 * singleDossierSuccessVerifyGate.test.jsx — the M11 token-or-deadline gate on the
 * post-checkout verify (SingleDossierSuccessPage).
 *
 * The defect this pins: with Turnstile active the widget mints its token
 * ASYNCHRONOUSLY, but the mount effect used to fire the verify immediately — so
 * the first verify always went out tokenless and could fall to botGuard. The
 * gate holds the INITIAL verify for the token OR the ~4s deadline, whichever
 * comes first:
 *   - token first    → verify fires immediately, WITH the token;
 *   - deadline first → verify fires without one (the pre-gate fallback — the
 *                      server never blocks a paid buyer on a missing token);
 *   - flag off       → verify fires synchronously on mount, no timer (the
 *                      pre-gate path, unchanged).
 * Retry stays imperative and ungated (retryVerify calls doVerify directly; not
 * re-pinned here).
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';

const harness = vi.hoisted(() => ({ captchaFlagOn: false, capturedOnToken: null }));

// Flag registry: only perimeterCaptcha varies; every other flag reads off.
vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => name === 'perimeterCaptcha' && harness.captchaFlagOn,
}));

// The widget mount point: capture onToken so tests can mint a token on cue.
// (The real CaptchaGate lazy-loads the Cloudflare script — never in tests.)
vi.mock('../../src/components/perimeter/CaptchaGate.jsx', () => ({
  default: ({ onToken }) => { harness.capturedOnToken = onToken; return null; },
}));

// The verify call under observation. Never resolves — these tests pin WHEN and
// WITH WHAT the call fires, not the post-verify render states.
vi.mock('../../src/lib/stripe.js', () => ({
  verifySingleDossierPurchase: vi.fn(() => new Promise(() => {})),
}));

vi.mock('../../src/lib/pendingDossier.js', () => ({
  readPendingDossier: () => null,
  readPendingDossierByToken: () => ({ settlement: { name: 'Testholm', tier: 'village' } }),
  clearPendingDossier: vi.fn(),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: { SINGLE_DOSSIER_PURCHASED: 'single_dossier_purchased' },
  Funnel: { paidAction: vi.fn() },
}));

import SingleDossierSuccessPage from '../../src/components/SingleDossierSuccessPage.jsx';
import { verifySingleDossierPurchase } from '../../src/lib/stripe.js';

// Mirrors CAPTCHA_TOKEN_DEADLINE_MS in the component — a drift fails the
// deadline test below, which is the point of the pin.
const DEADLINE_MS = 4000;

const SESSION_ID = 'cs_test_m11gate';
const DT_TOKEN = 'dt_m11_0123456789abcdef01234567';

beforeEach(() => {
  vi.useFakeTimers();
  harness.capturedOnToken = null;
  verifySingleDossierPurchase.mockClear();
  window.history.replaceState(
    null, '',
    `/?checkout=success&product=single_dossier&session_id=${SESSION_ID}&dt=${DT_TOKEN}`,
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('SingleDossierSuccessPage — M11 initial-verify gate', () => {
  test('captcha flag off: the initial verify fires synchronously on mount, tokenless, no timer', () => {
    harness.captchaFlagOn = false;
    render(<SingleDossierSuccessPage />);
    // Fired during mount — zero added delay on the flag-off (default) path.
    expect(verifySingleDossierPurchase).toHaveBeenCalledTimes(1);
    expect(verifySingleDossierPurchase).toHaveBeenCalledWith(SESSION_ID, DT_TOKEN, undefined);
    // And exactly once: no deferred second fire hiding behind a timer.
    act(() => { vi.advanceTimersByTime(DEADLINE_MS * 3); });
    expect(verifySingleDossierPurchase).toHaveBeenCalledTimes(1);
  });

  test('captcha flag on, token first: verify holds, then fires immediately WITH the token', () => {
    harness.captchaFlagOn = true;
    render(<SingleDossierSuccessPage />);
    // Gated: nothing fires at mount.
    expect(verifySingleDossierPurchase).not.toHaveBeenCalled();
    // Mid-wait the widget mints its token — the gate releases at once.
    act(() => { vi.advanceTimersByTime(1000); });
    expect(verifySingleDossierPurchase).not.toHaveBeenCalled();
    act(() => { harness.capturedOnToken('tok_turnstile_abc'); });
    expect(verifySingleDossierPurchase).toHaveBeenCalledTimes(1);
    expect(verifySingleDossierPurchase).toHaveBeenCalledWith(SESSION_ID, DT_TOKEN, 'tok_turnstile_abc');
    // The deadline timer was disarmed — no second fire when it would have lapsed.
    act(() => { vi.advanceTimersByTime(DEADLINE_MS * 3); });
    expect(verifySingleDossierPurchase).toHaveBeenCalledTimes(1);
  });

  test('captcha flag on, deadline first: verify fires tokenless at the deadline (pre-gate fallback)', () => {
    harness.captchaFlagOn = true;
    render(<SingleDossierSuccessPage />);
    expect(verifySingleDossierPurchase).not.toHaveBeenCalled();
    // One tick shy of the deadline: still holding.
    act(() => { vi.advanceTimersByTime(DEADLINE_MS - 1); });
    expect(verifySingleDossierPurchase).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(verifySingleDossierPurchase).toHaveBeenCalledTimes(1);
    expect(verifySingleDossierPurchase).toHaveBeenCalledWith(SESSION_ID, DT_TOKEN, undefined);
    // A token landing late must not double-fire the initial verify — it stays
    // stashed in the ref for an imperative Retry to carry.
    act(() => { harness.capturedOnToken('tok_turnstile_late'); });
    expect(verifySingleDossierPurchase).toHaveBeenCalledTimes(1);
  });
});
