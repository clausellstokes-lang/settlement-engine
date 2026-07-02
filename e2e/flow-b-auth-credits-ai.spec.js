/**
 * e2e/flow-b-auth-credits-ai.spec.js — Tier 3.7 Flow B.
 *
 * Auth-gated journey. Real Supabase magic-link auth and real Stripe
 * checkouts can't run in CI without secrets and external accounts, so
 * this flow exercises every step that DOESN'T require live external
 * services:
 *
 *   1. "Sign In" affordance is visible in chrome / hero for anonymous
 *      users
 *   2. Clicking it opens the AuthModal
 *   3. AuthModal renders email + password inputs, primary CTA, both
 *      signin/signup tab states
 *   4. Tab toggle switches copy / button label correctly
 *   5. Empty fields → submit produces inline validation (no network call)
 *   6. Email sign-in link is offered as an alternative below the form
 *   7. Modal closes via the close button
 *   8. Soft-cap exit → "Sign in to continue" CTA also opens AuthModal
 *   9. After a generation, the inline Save / AI affordances are
 *      auth-gated (or, if shown, route through the auth modal on click)
 *
 * Real signin / Stripe / Anthropic flows live in a separate suite
 * gated behind an environment flag — they're not part of CI's default
 * green-path.
 */

import { test, expect } from '@playwright/test';

async function waitForHero(page) {
  await page.waitForSelector('[aria-label="Anonymous settlement generator"]', { timeout: 10_000 });
}

async function waitForDossier(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await expect(dossierMeta(page)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Loading settlement view...')).toHaveCount(0, { timeout: 30_000 });
}

function sizeButton(hero, label) {
  return hero.locator(`button[data-settlement-size="${label.toLowerCase()}"]`);
}

function dossierMeta(page) {
  return page
    .locator('main')
    .getByText(/\b(thorp|hamlet|village|town|city|capital|metropolis)\b\s*·\s*pop\.?\s*\d/i)
    .first();
}

function primaryHeroCta(hero) {
  return hero.getByRole('button', {
    name: /Forge a|Begin a settlement|Generate a/i,
  }).first();
}

async function seedAnonCapAndRerender(page) {
  await page.evaluate(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const date = `${y}-${m}-${d}`;
    try {
      localStorage.setItem('sf.anon.gens', JSON.stringify({ date, full: 99, reroll: 99 }));
    } catch { /* private mode */ }
  });
  const hero = page.getByLabel('Anonymous settlement generator');
  await sizeButton(hero, 'Hamlet').click();
}

async function openAuthModal(page) {
  // The header chrome shows a "Sign In" button for anonymous users.
  // We use the role + name selector to remain robust to layout changes.
  const signInBtn = page.getByRole('button', { name: /^Sign[\s-]?In$/i }).first();
  await expect(signInBtn).toBeVisible();
  await signInBtn.click();
  // Wait for modal content to render — "Sign in to keep your work" is
  // the canonical opening line.
  await page.waitForSelector('text=/Sign in to keep your work|Create a free .* account/i', { timeout: 5_000 });
}

test.describe('Tier 3.7 Flow B — auth modal + credits gating', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.clear(); sessionStorage.clear(); } catch { /* ignore */ }
    });
    await page.goto('/create');
    await waitForHero(page);
  });

  test('"Sign In" button is visible in the header for anonymous users', async ({ page }) => {
    const signInBtn = page.getByRole('button', { name: /^Sign[\s-]?In$/i }).first();
    await expect(signInBtn).toBeVisible();
  });

  test('clicking Sign In opens the AuthModal in the signin view', async ({ page }) => {
    await openAuthModal(page);
    await expect(page.getByText('Sign in to keep your work', { exact: false })).toBeVisible();
    await expect(page.getByPlaceholder(/Email address/i)).toBeVisible();
  });

  test('AuthModal default view is signin (not signup)', async ({ page }) => {
    await openAuthModal(page);
    // Signin copy is present; signup copy isn't.
    await expect(page.getByText('Sign in to keep your work', { exact: false })).toBeVisible();
    await expect(page.getByText(/Create a free .* account/i)).toHaveCount(0);
  });

  test('AuthModal tab toggle switches to signup view + updates copy', async ({ page }) => {
    await openAuthModal(page);
    // The signup tab is labeled "Create Account". Two buttons may match
    // (the tab toggle + the CTA in signup view); .first() targets the
    // tab specifically.
    const signupTab = page.getByRole('button', { name: /^Create Account$/i }).first();
    await signupTab.click();
    await expect(page.getByText(/Create a free .* account/i)).toBeVisible();
    // The primary CTA also reads "Create account" in signup view. The tab toggle
    // ("Create Account", capital A) and this CTA ("Create account", lowercase a)
    // differ ONLY in case, so a case-insensitive regex matches both and trips
    // strict mode. `exact: true` does a case-SENSITIVE exact match, pinning this
    // to the CTA alone — keeping the assertion meaningful (the signup CTA copy)
    // rather than weakening it.
    await expect(page.getByRole('button', { name: 'Create account', exact: true })).toBeVisible();
  });

  test('AuthModal sign-in shows email + password inline with a "Sign in" CTA', async ({ page }) => {
    await openAuthModal(page);
    // Password is the primary method: both fields render inline (no disclosure),
    // and the primary CTA reads "Sign in".
    await expect(page.getByPlaceholder(/Email address/i)).toBeVisible();
    await expect(page.getByPlaceholder(/^Password$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /^Sign in$/i }).last()).toBeVisible();
  });

  test('the email sign-in link is offered as an alternative below the form', async ({ page }) => {
    await openAuthModal(page);
    // No "More options" disclosure — the email-link alternative is surfaced
    // directly as a full-width button under the primary CTA.
    await expect(page.getByRole('button', { name: /Email me a sign-in link/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /More sign-in options/i })).toHaveCount(0);
  });

  test('sign-up adds a confirm-password field', async ({ page }) => {
    await openAuthModal(page);
    await page.getByRole('button', { name: /^Create Account$/i }).first().click();
    await expect(page.getByPlaceholder(/^Password$/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Confirm password/i)).toBeVisible();
  });

  test('sign-in surfaces "Forgot password?" and "Remember me on this device"', async ({ page }) => {
    await openAuthModal(page);
    // Both are surfaced directly in sign-in mode (forgot-password is no longer
    // buried in a disclosure).
    await expect(page.getByText(/Remember me on this device/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Forgot password/i })).toBeVisible();
  });

  test('submitting empty credentials does NOT make a network request', async ({ page }) => {
    await openAuthModal(page);
    let supabaseCalled = false;
    page.on('request', (req) => {
      if (/supabase|auth/i.test(req.url())) supabaseCalled = true;
    });
    // Click the primary "Sign in" CTA without filling email or password.
    await page.getByRole('button', { name: /^Sign in$/i }).last().click();
    // Give time for any spurious request to surface.
    await page.waitForTimeout(500);
    expect(supabaseCalled).toBe(false);
  });

  test('clicking the close button dismisses the AuthModal', async ({ page }) => {
    await openAuthModal(page);
    // The modal renders a labelled close affordance (IconButton with
    // aria-label "Close" — src/components/AuthModal.jsx). Click it and
    // assert the modal is GONE. (Escape is intentionally NOT bound on the
    // modal, so this targets the real close path rather than tolerating
    // "may or may not close".)
    const modalHeading = page.getByText('Sign in to keep your work', { exact: false });
    await expect(modalHeading).toBeVisible();
    // Scope to the dialog: the modal BACKDROP is also a role="button" labelled
    // "Close" (click-to-dismiss) that wraps the dialog, so a bare .first() match
    // hits the backdrop (whose centre is the dialog card → no dismiss). Target
    // the real X close affordance INSIDE the dialog.
    await page.getByRole('dialog').getByRole('button', { name: /^Close$/i }).click();
    // Unconditional post-condition: the modal heading is removed from the DOM.
    await expect(modalHeading).toHaveCount(0);
  });

  test('soft-cap "Sign in to continue" also opens AuthModal', async ({ page }) => {
    await seedAnonCapAndRerender(page);

    const ctaBtn = page.getByRole('button', { name: /Sign in to continue|Create free account/i });
    await expect(ctaBtn).toBeVisible();
    await ctaBtn.click();
    await expect(page.getByText('Sign in to keep your work', { exact: false })).toBeVisible();
  });

  test('after generation: anonymous Save attempt routes through auth (no silent save)', async ({ page }) => {
    // Generate a settlement first.
    const hero = page.getByLabel('Anonymous settlement generator');
    await sizeButton(hero, 'Village').click();
    await primaryHeroCta(hero).click();

    await waitForDossier(page);

    // The save gate has TWO valid shapes, and we assert ONE of them holds
    // unconditionally (the old test only asserted inside `if (CTA visible)`,
    // so it passed vacuously when the CTA wasn't found):
    //   (a) a Save-to-library CTA is shown and clicking it routes to auth, OR
    //   (b) no Save CTA is shown — and crucially the auth-gated inline Save
    //       button (title="Save settlement", canSave-only) is also absent, so
    //       there is no silent-save path for an anonymous user.
    const saveToLibrary = page.getByRole('button', { name: /Save to library|Save settlement|Save\b/i }).first();
    if (await saveToLibrary.isVisible().catch(() => false)) {
      await saveToLibrary.click();
      // The AUTH MODAL specifically must open. The old fallback predicate
      // (/[Ss]ign in|free account/i anywhere on the page) matched the
      // always-visible header "Sign In" button, so this branch passed even
      // when the click did nothing. Both accepted shapes are now scoped to a
      // dialog: the canonical AuthModal heading, or a sign-in nudge rendered
      // INSIDE a dialog — never loose page text.
      await expect.poll(async () => {
        const authOpened = await page.getByText('Sign in to keep your work', { exact: false })
          .isVisible().catch(() => false);
        const dialogNudge = await page.getByRole('dialog')
          .getByText(/sign in|free account/i).first()
          .isVisible().catch(() => false);
        return authOpened || dialogNudge;
      }, { timeout: 10_000 }).toBe(true);
    } else {
      // No Save CTA at all — verify there is also no canSave-gated inline Save
      // button an anon user could use to persist silently.
      await expect(page.locator('button[title="Save settlement"]')).toHaveCount(0);
    }
  });

  test('no console errors when opening + interacting with the AuthModal', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Chromium's "Failed to load resource" text omits the URL — append it
        // from msg.location() so the allowlist below can stay narrow.
        const url = msg.location?.()?.url;
        errors.push(`console.error: ${msg.text()}${url ? ` (${url})` : ''}`);
      }
    });

    await openAuthModal(page);
    await page.getByPlaceholder(/^Password$/i).fill('test');
    await page.getByPlaceholder(/Email address/i).fill('test@example.com');

    // A bare /Failed to load resource/i entry used to mask EVERY failed
    // network resource. Only genuinely-optional assets stay allowlisted
    // (external fonts on an offline runner, the absent favicon); app-origin
    // 4xx/5xx now fail the test.
    const noise = [
      /credit_ledger write skipped/i,
      /Download the React DevTools/i,
      /Failed to load resource.*(fonts\.googleapis\.com|fonts\.gstatic\.com|favicon)/i,
    ];
    const real = errors.filter(e => !noise.some(rx => rx.test(e)));
    expect(real, `Console errors during auth interaction:\n${real.join('\n')}`).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Live money-path suite (skipped unless explicitly opted in).
//
// This is the one place the REAL money path (checkout → webhook grant →
// AI spend → failure refund) executes through the browser. The default
// e2e run boots Vite in `--mode e2e` (VITE_E2E_LOCAL_DATA=true →
// supabase=null, mock auth), which CANNOT exercise it — so this suite is
// gated on operator-provisioned live-test env, and skips with an explicit
// reason otherwise. The composed RPC layer (grant → spend → refund →
// re-spend, idempotent) already has executing CI coverage in
// tests/security/moneyPathJourney.pglite.test.js; this adds the
// browser+Stripe surface on top.
//
// Operator setup (all TEST-mode, never live keys):
//   1. Start the app against the TEST Supabase project WITHOUT the e2e
//      local-data mock — e.g. `npm run dev` with .env pointing at the
//      test project — and export E2E_BASE_URL to that server. (The dev
//      server is required: the suite reads exact balances through the
//      DEV-only `window.__store` seam, main.jsx.)
//   2. Forward Stripe test-mode webhooks to the test project's
//      stripe-webhook edge function (`stripe listen --forward-to ...`)
//      so checkout.session.completed actually grants credits.
//   3. Seed a confirmed, NON-elevated user and export
//      E2E_TEST_EMAIL + E2E_TEST_PASSWORD (legacy TEST_EMAIL /
//      TEST_PASSWORD also honoured).
//   4. Run: E2E_LIVE=1 npm run test:e2e -- flow-b-auth-credits-ai
//      (legacy E2E_LIVE_AUTH=1 also honoured)
//
// The refund leg needs a server-side AI failure, which cannot be forced
// from the browser (client-side request interception never reaches the
// spend chokepoint). Point the test project's AI provider key at an
// invalid value and additionally set E2E_LIVE_AI_FAIL=1 to run it.
// ─────────────────────────────────────────────────────────────────────

const LIVE = !!(process.env.E2E_LIVE || process.env.E2E_LIVE_AUTH);
const LIVE_EMAIL = process.env.E2E_TEST_EMAIL || process.env.TEST_EMAIL;
const LIVE_PASSWORD = process.env.E2E_TEST_PASSWORD || process.env.TEST_PASSWORD;
const LIVE_AI_FAIL = !!process.env.E2E_LIVE_AI_FAIL;

/** Read live store state through the DEV-only window.__store seam. */
async function storeState(page, selector) {
  return page.evaluate(
    (sel) => {
      const s = window.__store?.getState?.();
      if (!s) return { __noStore: true };
      // Test-only dynamic selector: evaluated in the PAGE context against
      // the dev-exposed store, never against application inputs.
      return { value: new Function('s', `return (${sel});`)(s) };
    },
    selector,
  );
}

async function readBalance(page) {
  const r = await storeState(page, 's.creditBalance');
  expect(r.__noStore, 'window.__store missing — the live suite must run against a DEV server (main.jsx exposes the store only in DEV)').toBeFalsy();
  return r.value;
}

/** Sign in through the real AuthModal password flow and wait for a session. */
async function liveSignIn(page) {
  await page.goto('/create');
  await openAuthModal(page);
  await page.getByPlaceholder(/Email address/i).fill(LIVE_EMAIL);
  await page.getByPlaceholder(/^Password$/i).fill(LIVE_PASSWORD);
  await page.getByRole('button', { name: /^Sign in$/i }).last().click();
  await expect.poll(
    async () => (await storeState(page, '!!s.auth?.user')).value,
    {
      message:
        'Sign-in never produced a session. Check E2E_TEST_EMAIL/PASSWORD, and that ' +
        'E2E_BASE_URL points at a server booted WITHOUT VITE_E2E_LOCAL_DATA (supabase=null in mock mode).',
      timeout: 30_000,
    },
  ).toBe(true);
}

/**
 * The balance is fetched server-side after auth; a fresh page starts at the
 * default 0. Reload /account and wait until two consecutive reads agree so
 * later delta assertions never race the initial load.
 */
async function settledBalance(page) {
  await page.goto('/account');
  let prev = null;
  let stable = null;
  await expect.poll(async () => {
    const cur = await readBalance(page);
    if (prev !== null && cur === prev) { stable = cur; return true; }
    prev = cur;
    return false;
  }, { timeout: 30_000, intervals: [1_500] }).toBe(true);
  return stable;
}

/** Generate a settlement via the instant hero (signed-in variant). */
async function liveGenerate(page) {
  await page.goto('/create');
  // Signed-in users get the same instant hero under a different label
  // (HomeHero.jsx: 'Welcome back. Instant generator').
  const hero = page.locator(
    '[aria-label="Welcome back. Instant generator"], [aria-label="Anonymous settlement generator"]',
  ).first();
  await expect(hero).toBeVisible({ timeout: 15_000 });
  await hero.locator('button[data-settlement-size="hamlet"]').click();
  await hero.getByRole('button', { name: /Forge a|Begin a settlement|Generate a/i }).first().click();
  await waitForDossier(page);
}

test.describe('Tier 3.7 Flow B (live) — signin → checkout → webhook grant → AI spend', () => {
  // Serial: the refund leg reuses the credits granted by the checkout leg.
  test.describe.configure({ mode: 'serial' });

  test.skip(
    !LIVE,
    'Live money-path suite: set E2E_LIVE=1 (plus E2E_BASE_URL, E2E_TEST_EMAIL, ' +
      'E2E_TEST_PASSWORD, and a Stripe test-mode webhook tunnel) to run. ' +
      'RPC-layer coverage runs in CI: tests/security/moneyPathJourney.pglite.test.js.',
  );

  test.beforeEach(() => {
    // Opted in but missing credentials is a misconfiguration — fail loudly
    // rather than silently skipping what the operator asked for.
    expect(
      LIVE_EMAIL && LIVE_PASSWORD,
      'E2E_LIVE=1 is set but E2E_TEST_EMAIL / E2E_TEST_PASSWORD are missing',
    ).toBeTruthy();
  });

  test('checkout → webhook grant → AI narrative spend decrements the real balance', async ({ page }) => {
    // Stripe hosted checkout + webhook delivery + AI streaming are slow.
    test.setTimeout(420_000);

    // ── 1. Sign in (real Supabase password auth) ─────────────────────────
    await liveSignIn(page);
    const elevated = (await storeState(page, "s.isElevated ? s.isElevated() : false")).value;
    expect(elevated, 'The live test user must be NON-elevated (elevated roles bypass credit spend)').toBe(false);
    const startBalance = await settledBalance(page);

    // ── 2. Checkout: buy the smallest credit pack in Stripe test mode ────
    // The account page renders one Button per active pack with
    // aria-label "<credits> credits for <price>" (AccountSubscriptionSection).
    const packBtn = page.getByRole('button', { name: /^\d+ credits for / }).first();
    await expect(packBtn).toBeVisible({ timeout: 15_000 });
    const packLabel = await packBtn.getAttribute('aria-label');
    const packCredits = Number(/^(\d+) credits/.exec(packLabel)?.[1]);
    expect(packCredits, `Could not parse pack size from "${packLabel}"`).toBeGreaterThan(0);
    await packBtn.click();

    // create-checkout returns a hosted-checkout URL and the app redirects.
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60_000 });

    // Stripe test card 4242… on the hosted page (top-level fields, no iframe).
    const emailField = page.locator('#email');
    if (await emailField.isVisible().catch(() => false)) {
      if (!(await emailField.inputValue().catch(() => ''))) await emailField.fill(LIVE_EMAIL);
    }
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#cardExpiry', '12 / 34');
    await page.fill('#cardCvc', '123');
    await page.fill('#billingName', 'E2E Live Test');
    const postal = page.locator('#billingPostalCode');
    if (await postal.isVisible().catch(() => false)) await postal.fill('94103');
    await page.locator('button[type="submit"], .SubmitButton').first().click();

    // Back to the app (success URL).
    await page.waitForURL((u) => !/checkout\.stripe\.com/.test(u.href), { timeout: 120_000 });

    // ── 3. Webhook grant: poll the ledger-backed balance ─────────────────
    // checkout.session.completed is delivered out-of-band (stripe listen
    // tunnel) → grant_credits ledger insert. Reload /account each poll tick
    // so the client refetches get_credit_balance.
    await expect.poll(async () => {
      await page.goto('/account');
      await page.waitForTimeout(2_000); // let the balance fetch land
      return readBalance(page);
    }, {
      message:
        'Balance never reflected the checkout grant — is the Stripe webhook ' +
        'tunnel (`stripe listen --forward-to <test-project>/stripe-webhook`) running?',
      timeout: 120_000,
      intervals: [5_000],
    }).toBeGreaterThanOrEqual(startBalance + packCredits);
    const grantedBalance = await settledBalance(page);

    // ── 4. AI spend: generate, run the Narrative Layer, assert decrement ─
    await liveGenerate(page);
    const cost = (await storeState(page, "s.getCost('narrative')")).value;
    expect(cost, 'narrative cost must be a positive number').toBeGreaterThan(0);

    await page.getByRole('button', { name: /Generate Narrative/i }).first().click();
    // Wait for the NDJSON stream to finish: aiLoading drops and either prose
    // landed or an error surfaced (asserted next).
    await expect.poll(
      async () => (await storeState(page, '!s.aiLoading')).value,
      { timeout: 180_000, intervals: [2_000] },
    ).toBe(true);
    const aiError = (await storeState(page, 's.aiError')).value;
    expect(aiError, `AI narrative failed: ${aiError}`).toBeFalsy();
    expect((await storeState(page, '!!(s.aiSettlement || s.aiDailyLife)')).value).toBe(true);

    // The success path writes the server's creditsRemaining straight into the
    // store (aiSlice) — the decrement is the SERVER's ledger math, not local.
    const afterSpend = await readBalance(page);
    expect(afterSpend).toBe(grantedBalance - cost);
  });

  test('AI failure refunds the reserved credits (server-side fault injection)', async ({ page }) => {
    test.skip(
      !LIVE_AI_FAIL,
      'Refund leg needs a server-side AI failure: point the TEST project\'s AI provider ' +
        'key at an invalid value, then set E2E_LIVE_AI_FAIL=1. (A client-side network ' +
        'intercept never reaches the spend chokepoint, so it cannot exercise the refund.) ' +
        'RPC-layer refund coverage runs in CI: tests/security/moneyPathJourney.pglite.test.js.',
    );
    test.setTimeout(300_000);

    await liveSignIn(page);
    const before = await settledBalance(page);
    expect(before, 'Refund leg needs a positive starting balance (run the checkout leg first)').toBeGreaterThan(0);

    await liveGenerate(page);
    await page.getByRole('button', { name: /Generate Narrative/i }).first().click();

    // The spend reserves credits up-front; the provider failure must surface
    // as an aiError rather than prose.
    await expect.poll(
      async () => (await storeState(page, '!!s.aiError')).value,
      { timeout: 180_000, intervals: [2_000] },
    ).toBe(true);

    // The server-side refund restores the reservation. Poll the ledger-backed
    // balance until it returns to the pre-spend value.
    await expect.poll(async () => {
      await page.goto('/account');
      await page.waitForTimeout(2_000);
      return readBalance(page);
    }, {
      message: 'Balance never returned to its pre-spend value — refund did not land',
      timeout: 90_000,
      intervals: [5_000],
    }).toBe(before);
  });
});
