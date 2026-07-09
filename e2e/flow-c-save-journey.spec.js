/**
 * e2e/flow-c-save-journey.spec.js — Tier 3.7 Flow C (F37).
 *
 * POSITIVE save path — the money-adjacent journey that Flow A only asserted
 * negatively (anon sees no Save button). Here a SIGNED-IN free-tier user:
 *   1. Lands on /create → the "Welcome back" instant-generator hero.
 *   2. Generates a real settlement by driving the wizard UI (size + Generate).
 *   3. Clicks "Save to Library" → savesService.save persists it.
 *   4. Opens /settlements and sees the saved settlement by name.
 *   5. Reloads and still sees it (persistence).
 *   6. Deep-links to /settlements/:id and the detail view renders the dossier.
 *
 * Mode: the e2e dev server boots with VITE_E2E_LOCAL_DATA=true, so
 * `isConfigured` is false — auth resolves from the `settlement_mock_auth`
 * localStorage key (auth.js mockGetSession) and saves round-trip through
 * localStorage `dnd_settlement_saves` (saves.js localList/localSaveEntry).
 * This is the same seam regional-causality.spec.js relies on. We seed ONLY
 * the mock-auth key (no localStorage.clear) so the runtime save survives the
 * in-test reload; the Playwright context is fresh per test, so start-state is
 * already clean.
 */

import { test, expect } from '@playwright/test';

// A signed-in free-tier session. tier:'free' → canSave() true (maxSaves 3),
// so the wizard renders the real "Save to Library" action (not the anon
// "Save this town. Free account" signup door).
const MOCK_FREE_AUTH = {
  user: { id: 'mock-free-e2e', email: 'wanderer@example.test', user_metadata: {} },
  session: { access_token: 'mock-token' },
  tier: 'free',
  role: 'user',
  displayName: 'Wanderer',
  isFounder: false,
  needsVerification: false,
  emailNotifications: true,
};

const SAVES_KEY = 'dnd_settlement_saves';

function hero(page) {
  // Anon label is "Anonymous settlement generator"; the signed-in "Welcome
  // back" hero is "Welcome back. Instant generator". Both contain "generator".
  return page.locator('section[aria-label*="generator"]').first();
}

function sizeButton(scope, label) {
  return scope.locator(`button[data-settlement-size="${label.toLowerCase()}"]`);
}

function primaryCta(scope) {
  // Signed-in CTA reads "Generate a {size}"; anon reads "Forge a…"/"Begin…".
  return scope.getByRole('button', { name: /Generate a|Forge a|Begin a settlement/i }).first();
}

function dossierMeta(page) {
  return page
    .locator('main')
    .getByText(/\b(thorp|hamlet|village|town|city|capital|metropolis)\b\s*·\s*pop\.?\s*\d/i)
    .first();
}

async function waitForDossier(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await expect(dossierMeta(page)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Loading settlement view...')).toHaveCount(0, { timeout: 30_000 });
}

test.describe('Tier 3.7 Flow C — signed-in save journey', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Timing + client-side generation are desktop-shaped; skip the mobile
    // project (which exists for the pointer-target spec) to keep CI lean.
    test.skip(testInfo.project.name === 'mobile-safari', 'desktop-only journey');

    // Seed ONLY the mock-auth key. Deliberately no localStorage.clear(): the
    // save we write at runtime must survive the reload assertion, and the
    // init script re-runs on every navigation/reload.
    await page.addInitScript((auth) => {
      try { localStorage.setItem('settlement_mock_auth', JSON.stringify(auth)); } catch { /* private mode */ }
    }, MOCK_FREE_AUTH);
  });

  test('generate → Save to Library → appears in Settlements, survives reload, reopens', async ({ page }) => {
    await page.goto('/create');

    // 1. Drive the real hero UI to generate a settlement.
    const h = hero(page);
    await expect(h).toBeVisible({ timeout: 10_000 });
    await sizeButton(h, 'Village').click();
    await primaryCta(h).click();
    await waitForDossier(page);

    // 2. The signed-in free user sees the real save action (canSave true).
    const saveBtn = page.getByRole('button', { name: /^Save to Library$/ });
    await expect(saveBtn).toBeVisible({ timeout: 15_000 });
    await saveBtn.click();

    // 3. Save confirmed in-UI (button flips to the "✓ Saved" state).
    await expect(page.getByRole('button', { name: /Saved to Library/ })).toBeVisible({ timeout: 10_000 });

    // 4. The save landed in localStorage (the local savesService backend).
    const saved = await page.evaluate((key) => {
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      return arr[0] ? { id: String(arr[0].id), name: arr[0].name } : null;
    }, SAVES_KEY);
    expect(saved, 'settlement was not persisted to dnd_settlement_saves').not.toBeNull();
    expect(saved.name, 'saved settlement has no name').toBeTruthy();

    // 5. It appears by name in the Settlements panel.
    await page.goto('/settlements');
    await expect(page.getByText(saved.name, { exact: false }).first()).toBeVisible({ timeout: 15_000 });

    // 6. A full reload still shows it (persistence — the save is not wiped).
    await page.reload();
    await expect(page.getByText(saved.name, { exact: false }).first()).toBeVisible({ timeout: 15_000 });

    // 7. The saved settlement can be reopened: deep-link to its detail view,
    //    which renders the dossier chrome (name heading + Export action).
    await page.goto(`/settlements/${encodeURIComponent(saved.id)}`);
    await expect(page.getByText(saved.name, { exact: false }).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: /Export Dossier|Building PDF/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: /Back to list/i })).toBeVisible();
  });
});
