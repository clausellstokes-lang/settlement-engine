/**
 * e2e/flow-f-single-dossier.spec.js — Tier 3.7 Flow F (F37).
 *
 * SINGLE-DOSSIER ($2.99) RECOVERY (F21/F23). An anonymous buyer returns from
 * Stripe to /checkout/success?session_id=…&dt=<token>. SingleDossierSuccessPage
 * (src/components/SingleDossierSuccessPage.jsx):
 *   1. verifies the paid session server-side (verify-single-dossier edge fn),
 *   2. PREFERS the server-returned settlement, falling back to the local stash
 *      (keyed by the one-time checkout token — src/lib/pendingDossier.js v2),
 *   3. renders the dossier + a download affordance on success,
 *   4. distinguishes a TRANSIENT verify failure (→ Retry, stash kept) from a
 *      terminal mismatch (→ support card).
 *
 * Runs against the CONFIGURED (:5174) server for the same reason as flow-e:
 * verifySingleDossierPurchase hard-guards on `isConfigured`
 * (src/lib/stripe.js). No signed-in session is needed (single-dossier is
 * anonymous-allowed); we stub only the verify function (+ a REST safety net).
 */

import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:5174' });

const PENDING_KEY = 'sf.pendingDossier';
// pendingDossier requires token length >= 24 and a `cs_`-prefixed session id.
const TOKEN = 'e2e0dossier0token00000000000000ab'; // 33 hex-ish chars ≥ 24
const SESSION_ID = 'cs_test_dossier_flowf';

// A settlement complete enough to render + feed the client-side PDF.
function settlement(name) {
  return {
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
    activeConditions: [],
    neighbourNetwork: [],
  };
}

function stashMap(sessionId = SESSION_ID) {
  return {
    v: 2,
    entries: {
      [TOKEN]: {
        settlement: settlement('Stashed Hollow'),
        checkoutToken: TOKEN,
        sessionId, // `cs_`-prefixed → the stash counts as PAID (TTL-immune)
        stashedAt: Date.now(),
      },
    },
  };
}

async function seedStash(page) {
  await page.addInitScript(({ key, value }) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
  }, { key: PENDING_KEY, value: stashMap() });
}

// REST safety net (no real network for the configured client's incidental reads).
async function stubRestSafetyNet(page) {
  await page.route('**/rest/v1/**', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
}

test.describe('Tier 3.7 Flow F — single-dossier recovery', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-safari', 'desktop-only journey');
    await seedStash(page);
    await stubRestSafetyNet(page);
  });

  test('verify returns a server settlement → dossier renders + download affordance', async ({ page }) => {
    test.setTimeout(60_000);
    // Server-persisted settlement is PREFERRED over the local stash — return a
    // distinct name so we can prove the server copy won.
    await page.route('**/functions/v1/verify-single-dossier**', route =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ verified: true, sessionId: SESSION_ID, settlement: settlement('Ironford') }),
      }));

    await page.goto(`/checkout/success?session_id=${SESSION_ID}&dt=${TOKEN}`);

    // Verified success state. Generous timeout: the success page is a lazy
    // chunk, so a cold dev server under parallel load pays a one-time compile.
    await expect(page.getByRole('heading', { name: /Your dossier is ready/i })).toBeVisible({ timeout: 30_000 });
    // Server settlement preferred (not the stash's "Stashed Hollow").
    await expect(page.getByText('Ironford', { exact: false })).toBeVisible();
    await expect(page.getByText('Stashed Hollow')).toHaveCount(0);
    // Download affordance present (auto-download may already have flipped the
    // label to "Download again").
    await expect(page.getByRole('button', { name: /Download (PDF|again)/i })).toBeVisible();
  });

  test('verify 503 → Retry renders; retry succeeds → dossier renders, stash preserved', async ({ page }) => {
    test.setTimeout(60_000);
    let calls = 0;
    await page.route('**/functions/v1/verify-single-dossier**', route => {
      calls += 1;
      if (calls === 1) {
        // Transient (5xx) → retryable, NOT terminal. Stash is kept.
        return route.fulfill({
          status: 503, contentType: 'application/json',
          body: JSON.stringify({ error: 'temporarily unavailable' }),
        });
      }
      // Retry: verified without a server settlement → falls back to the STASH,
      // proving the stash survived the transient failure.
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ verified: true, sessionId: SESSION_ID }),
      });
    });

    await page.goto(`/checkout/success?session_id=${SESSION_ID}&dt=${TOKEN}`);

    // Transient-failure UI: "Still confirming…" + a Try-again button.
    await expect(page.getByRole('heading', { name: /Still confirming your purchase/i })).toBeVisible({ timeout: 30_000 });
    const retry = page.getByRole('button', { name: /Try again/i });
    await expect(retry).toBeVisible();

    // The stash is still present after the transient failure (not cleared).
    const stashBeforeRetry = await page.evaluate((key) => localStorage.getItem(key), PENDING_KEY);
    expect(stashBeforeRetry, 'stash was dropped on a transient failure').toContain(TOKEN);

    // Retry → success. The dossier resolves from the preserved stash.
    await retry.click();
    await expect(page.getByRole('heading', { name: /Your dossier is ready/i })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Stashed Hollow', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download (PDF|again)/i })).toBeVisible();
  });
});
