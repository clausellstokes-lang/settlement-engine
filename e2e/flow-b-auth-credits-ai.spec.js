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
 *   3. AuthModal renders email input, primary CTA, both signin/signup
 *      tab states
 *   4. Tab toggle switches copy / button label correctly
 *   5. Empty email → submit produces inline validation (no network call)
 *   6. "More options" expands password path
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
    await page.goto('/');
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
    // The primary CTA also reads "Create account" in signup view.
    await expect(page.getByRole('button', { name: /^Create account$/i })).toBeVisible();
  });

  test('AuthModal primary CTA reflects current auth method (magic by default)', async ({ page }) => {
    await openAuthModal(page);
    // The default auth method is magic-link → CTA reads "Send sign-in link".
    await expect(page.getByRole('button', { name: /Send sign-in link/i })).toBeVisible();
  });

  test('"More sign-in options" disclosure reveals the password toggle', async ({ page }) => {
    await openAuthModal(page);
    // Disclosure step 1: expand the panel. Its label flips between
    // "More sign-in options" / "Hide more options", so we use the
    // collapsed-state label to click, then verify by collapsed→expanded
    // class swap (the new label appears).
    const expandBtn = page.getByRole('button', { name: /^More sign-in options$/i });
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();
    // After click: the button's text is now "Hide more options".
    await expect(page.getByRole('button', { name: /^Hide more options$/i })).toBeVisible();
    // The "Use a password instead" toggle appears inside the panel.
    const switchToPwd = page.getByRole('button', { name: /Use a password instead/i });
    await expect(switchToPwd).toBeVisible();
    // Step 2: switch to password mode.
    await switchToPwd.click();
    // Password input becomes available.
    await expect(page.getByPlaceholder(/^Password$/i)).toBeVisible();
    // Primary CTA changes to "Sign in" (not "Send sign-in link").
    await expect(page.getByRole('button', { name: /^Sign in$/i }).last()).toBeVisible();
  });

  test('password-mode signin reveals "Remember me on this device"', async ({ page }) => {
    await openAuthModal(page);
    await page.getByRole('button', { name: /^More sign-in options$/i }).click();
    await page.getByRole('button', { name: /Use a password instead/i }).click();
    await expect(page.getByText(/Remember me on this device/i)).toBeVisible();
  });

  test('submitting an empty email does NOT make a network request', async ({ page }) => {
    await openAuthModal(page);
    let supabaseCalled = false;
    page.on('request', (req) => {
      if (/supabase|auth/i.test(req.url())) supabaseCalled = true;
    });
    // Click the magic-link CTA without filling the email.
    await page.getByRole('button', { name: /Send sign-in link/i }).click();
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
      // Auth modal opens OR a sign-in nudge appears inline.
      await expect.poll(async () => {
        const authOpened = await page.getByText('Sign in to keep your work', { exact: false })
          .isVisible().catch(() => false);
        const nudgeShown = await page.getByText(/[Ss]ign in|free account/i).first()
          .isVisible().catch(() => false);
        return authOpened || nudgeShown;
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
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await openAuthModal(page);
    await page.getByRole('button', { name: /^More sign-in options$/i }).click();
    await page.getByRole('button', { name: /Use a password instead/i }).click();
    await page.getByPlaceholder(/^Password$/i).fill('test');
    await page.getByPlaceholder(/Email address/i).fill('test@example.com');

    const noise = [
      /credit_ledger write skipped/i,
      /Download the React DevTools/i,
      /Failed to load resource/i,
    ];
    const real = errors.filter(e => !noise.some(rx => rx.test(e)));
    expect(real, `Console errors during auth interaction:\n${real.join('\n')}`).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Real-credentials suite (skipped unless explicitly opted in).
//
// To run against a real Supabase test project + Stripe test mode:
//   E2E_LIVE_AUTH=1 npm run test:e2e -- flow-b-auth-credits-ai
// Set TEST_EMAIL + TEST_PASSWORD env vars in the test runner.
// ─────────────────────────────────────────────────────────────────────

const LIVE_AUTH = !!process.env.E2E_LIVE_AUTH;

test.describe('Tier 3.7 Flow B (live) — full auth + Stripe + AI integration', () => {
  test.skip(!LIVE_AUTH, 'Skipped without E2E_LIVE_AUTH=1');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // The live BROWSER journey (signin → Stripe test-card checkout → webhook →
  // AI narrative) needs a dedicated test Supabase project + Stripe test keys +
  // webhook tunnel, which only exist in the operator's CI secrets store. Until
  // those are provisioned this is an explicit, honest TODO — NOT a `test.fail()`
  // placeholder, which "passes" by failing vacuously and reads as coverage that
  // doesn't exist.
  //
  // The COMPOSED money path it would exercise (checkout grant → AI spend →
  // failure refund → re-spend → monthly allowance, idempotent at every grant)
  // already has EXECUTING coverage in CI at the RPC-composition layer:
  // tests/security/moneyPathJourney.pglite.test.js runs the real PL/pgSQL bodies
  // end-to-end. This live spec adds the browser+Stripe surface on top of that.
  test.fixme(
    'signin → Stripe test-card → webhook → AI narrative — implement once CI secrets are provisioned ' +
      '(composed RPC coverage: tests/security/moneyPathJourney.pglite.test.js)',
    async ({ page }) => {
      const email = process.env.TEST_EMAIL;
      const password = process.env.TEST_PASSWORD;
      expect(email && password, 'TEST_EMAIL + TEST_PASSWORD must be set for the live flow').toBeTruthy();

      // 1. Sign in via the proven password flow (same selectors as the anon suite above).
      await openAuthModal(page);
      await page.getByRole('button', { name: /^More sign-in options$/i }).click();
      await page.getByRole('button', { name: /Use a password instead/i }).click();
      await page.getByPlaceholder(/Email address/i).fill(email);
      await page.getByPlaceholder(/^Password$/i).fill(password);
      // 2. Generate → 3. open pricing modal / run AI → 4. Stripe test card →
      // 5. webhook grant → 6. run AI narrative → 7. assert NDJSON + decrement.
      // (Driven against the test project; left to the operator wiring the secrets.)
    },
  );
});
