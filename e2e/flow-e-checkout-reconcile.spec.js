/**
 * e2e/flow-e-checkout-reconcile.spec.js — Tier 3.7 Flow E (F37).
 *
 * POST-STRIPE ENTITLEMENT RECONCILIATION (F23). When a buyer returns from
 * Stripe with `?checkout=success&product=…&session_id=…`, App.jsx must NOT
 * declare success from the URL alone (spoofable + races the webhook). It:
 *   1. shows a persistent "Confirming your purchase…" notice,
 *   2. verifies the session server-side (verify-checkout-session edge fn),
 *   3. polls the REAL entitlement (credit balance / profile tier), and only
 *      then shows a green success toast — OR a persistent amber
 *      processing/failed notice, never a false green.
 * (src/lib/checkoutReconcile.js + src/App.jsx.)
 *
 * ── Why this runs against the CONFIGURED (:5174) server ──────────────────────
 * verify-checkout-session, the balance RPC, and fetchCreditBalance all
 * hard-guard on `isConfigured` (src/lib/stripe.js / creditLedger.js:
 * `if (!isConfigured) throw/return`). Under the default LOCAL server
 * (VITE_E2E_LOCAL_DATA=true) `isConfigured` is false and `supabase` is null, so
 * the reconciliation code never runs and there is nothing for page.route to
 * intercept. The :5174 server boots Supabase-configured with dummy creds; this
 * spec stubs EVERY outbound Supabase route (auth/user, profiles, the balance
 * RPC, the verify function) so no real network is touched. A signed-in session
 * is faked by seeding supabase-js's own storage key (sb-mock-auth-token) with a
 * far-future session, so `getUser()` resolves to our stubbed /auth/v1/user.
 *
 * ── Deliberate deviation on test 3 ───────────────────────────────────────────
 * The brief asks test 3 to be "verify ok but balance never flips → processing".
 * For a CREDIT product that is SUCCESS by design: checkoutReconcile.js line ~128
 * treats a server-verified paid session as success even if the balance read
 * lags ("the money is real"). The persistent-processing state is only reachable
 * when the tracked entitlement is the tier gate. So test 3 uses product=premium
 * (verify ok, tier never flips to premium) — which drives the exact same
 * persistent amber processing notice + session reference the brief asks to
 * assert, honestly against the current code.
 */

import { test, expect } from '@playwright/test';

// Opt this whole file into the Supabase-CONFIGURED dev server (see
// playwright.config.js — CONFIGURED_URL). Every request is stubbed below.
test.use({ baseURL: 'http://localhost:5174' });

// supabase-js derives its storage key as `sb-<subdomain>-auth-token` from the
// project URL. Our configured server uses https://mock.supabase.co → "mock".
const STORAGE_KEY = 'sb-mock-auth-token';

const USER = {
  id: '11111111-1111-4111-8111-111111111111',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'buyer@example.test',
  user_metadata: {},
  app_metadata: {},
};

function farFutureSession() {
  const nowSec = Math.floor(Date.now() / 1000);
  return {
    access_token: 'e2e-fake-access-token',
    token_type: 'bearer',
    expires_in: 31_536_000,
    expires_at: nowSec + 31_536_000, // +1yr → no refresh attempt during the test
    refresh_token: 'e2e-fake-refresh-token',
    user: USER,
  };
}

/**
 * Register the common stub surface. Routes registered later take precedence in
 * Playwright, so the broad `**\/rest/v1/**` safety net goes first and specific
 * handlers override it. Returns hooks for per-test behaviour.
 */
async function stubSupabase(page, { verify, balanceSequence, profileTier = 'free' }) {
  // Safety net: any unhandled Supabase REST call resolves to empty JSON so a
  // stray request never hangs or spams the console.
  await page.route('**/rest/v1/**', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

  // Auth: getUser() → GET /auth/v1/user with our access token.
  await page.route('**/auth/v1/user**', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }));

  // Profile row (fetchProfileAuth + fetchProfileTier use `.single()` → object).
  await page.route('**/rest/v1/profiles**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: USER.id, tier: profileTier, role: 'user',
        display_name: 'Buyer', is_founder: false, email: USER.email,
        avatar_url: null, email_notifications: true, model_preference: null,
      }),
    }));

  // Credit balance RPC — returns a scalar. `balanceSequence(callIndex)` decides
  // the value per call so a test can hold OLD for the priming read + first polls
  // then flip to NEW.
  let balanceCalls = 0;
  await page.route('**/rest/v1/rpc/get_credit_balance**', route => {
    const value = balanceSequence(balanceCalls++);
    route.fulfill({ status: 200, contentType: 'application/json', body: String(value) });
  });

  // The verify-checkout-session edge function.
  await page.route('**/functions/v1/verify-checkout-session**', route => verify(route));
}

async function seedSession(page) {
  await page.addInitScript(({ key, session }) => {
    try {
      localStorage.setItem(key, JSON.stringify(session));
    } catch { /* private mode */ }
  }, { key: STORAGE_KEY, session: farFutureSession() });
}

test.describe('Tier 3.7 Flow E — post-checkout entitlement reconciliation', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-safari', 'desktop-only journey');
    await seedSession(page);
  });

  test('credits: confirming notice first, green success ONLY after the balance flips', async ({ page }) => {
    test.setTimeout(60_000);
    const OLD = 5;
    const NEW = 15;
    await stubSupabase(page, {
      // Server confirms the paid session.
      verify: route => route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ verified: true, product: 'credits_10', status: 'complete' }),
      }),
      // Priming read (call 0) + first two polls (1,2) return OLD == baseline;
      // the third poll (call 3) returns NEW > baseline → SUCCESS.
      balanceSequence: (i) => (i <= 2 ? OLD : NEW),
    });

    await page.goto('/create?checkout=success&product=credits_10&session_id=cs_test_success1');

    // The honest "confirming" state shows first — it must not jump to success.
    await expect(page.getByText(/Confirming your purchase/i)).toBeVisible({ timeout: 20_000 });
    // No false green success while the balance still reads OLD.
    await expect(page.getByText('Credits added!')).toHaveCount(0);

    // Success only after the polled balance exceeds the baseline (~5.4s).
    await expect(page.getByText('Credits added!')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Confirming your purchase/i)).toHaveCount(0);
  });

  test('verified:false → terminal notice, no success toast', async ({ page }) => {
    test.setTimeout(45_000);
    await stubSupabase(page, {
      // A definitive "not your paid session" — non-transient → FAILED.
      verify: route => route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ verified: false }),
      }),
      balanceSequence: () => 0,
    });

    await page.goto('/create?checkout=success&product=credits_10&session_id=cs_test_fail1');

    // Persistent terminal notice; never a green success. (Curly apostrophe in
    // the copy → match the apostrophe loosely.)
    await expect(page.getByText(/We couldn.t confirm this purchase/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Credits added!')).toHaveCount(0);
    // It's dismissible (persistent amber banner carries a Dismiss control).
    await expect(page.getByRole('button', { name: /Dismiss/i })).toBeVisible();
  });

  test('premium verified but tier never lands → persistent processing notice with session ref', async ({ page }) => {
    // The poll runs the full attempt budget (~13.5s) before reporting PROCESSING.
    test.setTimeout(60_000);
    await stubSupabase(page, {
      verify: route => route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ verified: true, product: 'premium', status: 'active' }),
      }),
      balanceSequence: () => 0,
      profileTier: 'free', // fetchProfileTier never returns 'premium' → never lands
    });

    await page.goto('/create?checkout=success&product=premium&session_id=cs_test_premium99');

    await expect(page.getByText(/Confirming your purchase/i)).toBeVisible({ timeout: 20_000 });

    // Persistent amber processing notice, carrying the session reference
    // (sessionId.slice(0,12) === 'cs_test_prem'). Never a false green success.
    const processing = page.getByText(/your purchase is still processing/i);
    await expect(processing).toBeVisible({ timeout: 30_000 });
    await expect(processing).toContainText('cs_test_prem');
    await expect(page.getByText('Cartographer activated!')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Dismiss/i })).toBeVisible();
  });
});
