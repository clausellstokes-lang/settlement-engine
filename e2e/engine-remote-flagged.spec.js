/**
 * e2e/engine-remote-flagged.spec.js — THE FLAGGED BUILD, IN A BROWSER (remote-path R5, D5 of the
 * chair's flagged-path walk, 2026-11-10).
 *
 * The production artifact is the flagged client (VITE_ENGINE_REMOTE=true): the local engine is
 * resolved away (vite.config.js :: engineAbsentWhenRemote) and every generation goes to the
 * `engine-generate` edge function through src/lib/engineRemote.js. Until this spec no browser
 * test reached that path, and the transport's own suites built their payloads by hand, which is
 * how EVERY flagged generation came to be refused before any request (D1: the store's vanilla
 * content stamp).
 *
 * Here the client is the flagged dev server (playwright.config.js, :5175) and the function's
 * URL — same-origin, so no CORS — is answered by the REAL handler, `handleEngineGenerate` from
 * supabase/functions/engine-generate/index.ts, bundled into this process
 * (e2e/support/engineFunction.js). The browser carries an ordinary user agent: the function's
 * bot guard refuses "headless" (supabase/functions/_shared/requestMeta.ts).
 *
 * Pins, in Chromium:
 *   (a) a visitor's forge produces a dossier;
 *   (b) a signed-in account's metropolis does;
 *   (c) a founding-world "Visit" does;
 *   (d) a 429 from the function prints the limit's own sentence, not "Try once more".
 * Every arm asserts the function answered (status and op), so a dossier made any other way
 * cannot pass.
 */
import { test, expect } from '@playwright/test';
import { answerWithEngineFunction, loadEngineFunction } from './support/engineFunction.js';
import { en } from '../src/copy/en.js';

// The flagged dev server (playwright.config.js — FLAGGED_URL) and its engine URL.
const FLAGGED_URL = 'http://localhost:5175';
const ENGINE_URL = `${FLAGGED_URL}/functions/v1/engine-generate`;
const ORDINARY_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

test.use({ baseURL: FLAGGED_URL, userAgent: ORDINARY_UA });

const MOCK_FREE_AUTH = {
  user: { id: 'mock-flagged-e2e', email: 'flagged@example.test', user_metadata: {} },
  session: { access_token: 'mock-token' },
  tier: 'free',
  role: 'user',
  displayName: 'Flagged',
  isFounder: false,
  needsVerification: false,
  emailNotifications: true,
};

function hero(page) {
  return page.locator('section[aria-label*="generator"]').first();
}
function sizeButton(scope, label) {
  return scope.locator(`button[data-settlement-size="${label.toLowerCase()}"]`);
}
function primaryCta(scope) {
  return scope.getByRole('button', { name: /Generate a|Forge a|Begin a settlement/i }).first();
}
function dossierMeta(page, tier = '(thorp|hamlet|village|town|city|capital|metropolis)') {
  return page.locator('main').getByText(new RegExp(`\\b${tier}\\b\\s*·\\s*pop\\.?\\s*\\d`, 'i')).first();
}
async function waitForDossier(page, tier) {
  await page.keyboard.press('Escape').catch(() => {});
  await expect(dossierMeta(page, tier)).toBeVisible({ timeout: 45_000 });
  await expect(page.getByText('Loading settlement view...')).toHaveCount(0, { timeout: 30_000 });
}

/** Route the function's URL to the real handler; answer the replies it gave. */
async function serveFunction(page, opts = {}) {
  const replies = [];
  await page.route(ENGINE_URL, (route) => answerWithEngineFunction(route, { ...opts, onReply: (r) => replies.push(r) }));
  return replies;
}

/** Console lines that would mean the transport refused or the local engine ran. */
function watchConsole(page) {
  const said = [];
  page.on('console', (msg) => said.push(msg.text()));
  return said;
}

test.describe('the flagged client (VITE_ENGINE_REMOTE=true) against the real engine-generate handler', () => {
  test.beforeAll(async () => {
    // Bundle the handler once, outside any test's budget.
    await loadEngineFunction();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-safari', 'desktop journey; the phone viewport is not this pin');
    test.setTimeout(90_000);
    await page.addInitScript(() => {
      try {
        if (!sessionStorage.getItem('flagged-e2e-booted')) {
          localStorage.clear();
          sessionStorage.setItem('flagged-e2e-booted', '1');
        }
      } catch { /* private mode */ }
    });
  });

  test('(a) a visitor\'s forge produces a dossier, made by the function', async ({ page }) => {
    const replies = await serveFunction(page);
    const said = watchConsole(page);
    await page.goto('/create');
    const h = hero(page);
    await expect(h).toBeVisible({ timeout: 15_000 });
    await primaryCta(h).click();
    await waitForDossier(page, 'town');
    expect(replies.filter((r) => r.op === 'generate' && r.status === 200)).toHaveLength(1);
    expect(said.join('\n')).not.toMatch(/does not take|this generation was not made|engine_local_absent/);
  });

  test('(b) a signed-in account\'s metropolis produces a dossier, made by the function', async ({ page }) => {
    await page.addInitScript((auth) => {
      try { localStorage.setItem('settlement_mock_auth', JSON.stringify(auth)); } catch { /* private mode */ }
    }, MOCK_FREE_AUTH);
    const replies = await serveFunction(page);
    await page.goto('/create');
    const h = hero(page);
    await expect(h).toBeVisible({ timeout: 15_000 });
    await sizeButton(h, 'Metropolis').click();
    await primaryCta(h).click();
    await waitForDossier(page, 'metropolis');
    expect(replies.filter((r) => r.op === 'generate' && r.status === 200)).toHaveLength(1);
  });

  test('(c) a founding-world "Visit" produces a dossier, made by the function', async ({ page }) => {
    await page.addInitScript((auth) => {
      try { localStorage.setItem('settlement_mock_auth', JSON.stringify(auth)); } catch { /* private mode */ }
    }, MOCK_FREE_AUTH);
    const replies = await serveFunction(page);
    await page.goto('/create');
    const worlds = page.getByRole('region', { name: 'Founding worlds' });
    const visit = worlds.getByRole('button', { name: /^Visit /i }).first();
    await expect(visit).toBeVisible({ timeout: 15_000 });
    await visit.click();
    await waitForDossier(page);
    expect(replies.filter((r) => r.op === 'generate' && r.status === 200)).toHaveLength(1);
  });

  test('(d) a 429 from the function prints the limit\'s own sentence, not "Try once more"', async ({ page }) => {
    const replies = await serveFunction(page, { underRate: false });
    await page.goto('/create');
    const h = hero(page);
    await expect(h).toBeVisible({ timeout: 15_000 });
    await primaryCta(h).click();
    const alert = page.getByRole('alert').filter({ hasText: en.refusals.engineRateLimited.body });
    await expect(alert).toBeVisible({ timeout: 30_000 });
    // anchored: the alert above carries the limit's sentence; the generic stall must not show.
    await expect(page.getByText(en.errors.forgeStart)).toHaveCount(0);
    expect(replies).toEqual([{ op: 'generate', status: 429 }]);
  });
});
