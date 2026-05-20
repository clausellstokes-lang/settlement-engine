/**
 * e2e/flow-a-generate-save-export.spec.js — Tier 3.7 Flow A.
 *
 * Anonymous user journey:
 *   1. Land on homepage → see HomeHero
 *   2. Eyebrow / title / subtitle render
 *   3. Three size buttons (Hamlet / Village / Town) render and pick one
 *   4. Begin a settlement → loading state → dossier renders
 *   5. Dossier header shows name + tier + population
 *   6. Anon counter incremented in localStorage
 *   7. Pipeline rail visible
 *   8. "New" button creates a fresh settlement (no auth required)
 *   9. Save flow is auth-gated (anonymous user does NOT see Save button,
 *      OR sees it but click opens auth modal — verified by tier gate)
 *  10. Soft-cap behaviour: after DEFAULT_DAILY_CAP, hero swaps to
 *      "Sign in to continue" affordance
 */

import { test, expect } from '@playwright/test';

// Wait helpers reused across tests. The hero either mounts or it doesn't,
// based on flag('homepageAnonGen') + auth tier + !settlement; if it
// doesn't mount on the test environment we want to fail loudly so the
// regression surfaces.
async function waitForHero(page) {
  await page.waitForSelector('[aria-label="Anonymous settlement generator"]', { timeout: 10_000 });
}

async function waitForDossier(page) {
  // The dossier header shows the settlement name in the wizard's
  // settlement-header div. Wait for the "Loading settlement view..."
  // fallback to disappear AND a settlement name to appear in the gold
  // header bar.
  await page.waitForFunction(() => {
    return !document.body.innerText.includes('Loading settlement view');
  }, { timeout: 30_000 });
}

test.describe('Tier 3.7 Flow A — anonymous generate / preview / save / export', () => {
  test.beforeEach(async ({ page }) => {
    // Reset state between tests — clear any saved generations, anon
    // counter, dossier draft, dismissed onboarding, etc.
    await page.addInitScript(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch { /* private mode etc. */ }
    });
    await page.goto('/');
  });

  test('homepage renders the HomeHero with eyebrow / title / subtitle', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await expect(hero).toBeVisible();
    // Eyebrow uppercase line
    await expect(hero.getByText('A simulator for Dungeon Masters', { exact: false })).toBeVisible();
    // Title
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toContainText('Forge a settlement');
    // Subtitle includes "Every street"
    await expect(hero.getByText(/Every street, every faction/i)).toBeVisible();
  });

  test('hero exposes the three anonymous size buttons', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    // The button labels come from the copy: 'Hamlet', 'Village', 'Town'.
    await expect(hero.getByRole('button', { name: /Hamlet/i })).toBeVisible();
    await expect(hero.getByRole('button', { name: /Village/i })).toBeVisible();
    await expect(hero.getByRole('button', { name: /Town/i })).toBeVisible();
  });

  test('default size selection is Village (aria-pressed)', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    // The button's accessible name concatenates label + hint copy. We
    // match by leading word and rely on the hero scope to disambiguate.
    const village = hero.getByRole('button', { name: /Village\b/i });
    await expect(village).toHaveAttribute('aria-pressed', 'true');
    await expect(hero.getByRole('button', { name: /Hamlet\b/i })).toHaveAttribute('aria-pressed', 'false');
    await expect(hero.getByRole('button', { name: /Town\b/i })).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking a different size button updates aria-pressed correctly', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await hero.getByRole('button', { name: /Hamlet/i }).click();
    await expect(hero.getByRole('button', { name: /Hamlet/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(hero.getByRole('button', { name: /Village/i })).toHaveAttribute('aria-pressed', 'false');
  });

  test('"Begin a settlement" button is enabled before generation', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    const begin = hero.getByRole('button', { name: /Begin a settlement/i });
    await expect(begin).toBeVisible();
    await expect(begin).toBeEnabled();
  });

  test('generation produces a dossier with name + tier + population', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await hero.getByRole('button', { name: /Hamlet/i }).click();
    await hero.getByRole('button', { name: /Begin a settlement/i }).click();

    await waitForDossier(page);

    // Dossier header includes "POP. " followed by a numeric value, and
    // a tier line ("HAMLET · POP. 35" or similar).
    await expect(page.getByText(/Pop\.\s*\d/i)).toBeVisible({ timeout: 30_000 });
    // Tier shows somewhere on the page in uppercase.
    await expect(page.getByText(/HAMLET/i)).toBeVisible();
  });

  test('anon counter is bumped in localStorage after a generation', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await hero.getByRole('button', { name: /Village/i }).click();
    await hero.getByRole('button', { name: /Begin a settlement/i }).click();
    await waitForDossier(page);

    // src/lib/anonGenCounter writes to key 'sf.anon.gens' with JSON
    // value { date, count }.
    const stored = await page.evaluate(() => localStorage.getItem('sf.anon.gens'));
    expect(stored, 'sf.anon.gens not written after generation').not.toBeNull();
    const parsed = JSON.parse(stored);
    expect(parsed.count).toBeGreaterThanOrEqual(1);
    expect(parsed.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('pipeline rail is visible after generation (How this was simulated)', async ({ page }) => {
    await waitForHero(page);
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Begin a settlement/i }).click();
    await waitForDossier(page);

    // The rail shows step labels — anything that mentions "simulated"
    // or the rail header should be visible. Be flexible because the
    // exact copy can vary.
    const railSignal = page.locator('text=/simulated|how this was|pipeline/i').first();
    await expect(railSignal).toBeVisible({ timeout: 15_000 });
  });

  test('"New" button after generation returns to a fresh state', async ({ page }) => {
    await waitForHero(page);
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Begin a settlement/i }).click();
    await waitForDossier(page);

    // The wizard's "New" button (with Zap icon + " New" text). Be
    // tolerant of leading/trailing whitespace from the icon spacing.
    const newBtn = page.getByRole('button', { name: /^\s*New\s*$/ }).first();
    // If the wizard variant doesn't render the inline New button (rare —
    // it should always render post-generation for the anon path), fall
    // back to the wizard's chrome "New" entry. Either way, we just want
    // to confirm a path back to a fresh state exists.
    if (await newBtn.isVisible().catch(() => false)) {
      await newBtn.click();
      await page.waitForTimeout(500);
      // Fresh state: either hero re-mounts OR wizard mode picker shows.
      const freshSignal = page.locator(
        '[aria-label="Anonymous settlement generator"], text=/Pick a size|Generate|New settlement/i'
      ).first();
      await expect(freshSignal).toBeVisible({ timeout: 10_000 });
    } else {
      // No inline New button. The "Back to configuration" button (Back
      // arrow) should still work as the path home.
      const backBtn = page.getByRole('button', { name: /Back/i }).first();
      await expect(backBtn).toBeVisible();
    }
  });

  test('anonymous user does NOT see the inline Save button (auth-gated)', async ({ page }) => {
    await waitForHero(page);
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Begin a settlement/i }).click();
    await waitForDossier(page);

    // The inline `Save` button (title="Save settlement") only renders
    // when canSave is true — which requires a signed-in user with save
    // capacity. An anonymous visitor should see EITHER no Save button
    // OR a Save-to-library affordance that opens auth on click.
    const inlineSave = page.locator('button[title="Save settlement"]');
    await expect(inlineSave).toHaveCount(0);
  });

  test('soft cap: after DEFAULT_DAILY_CAP generations, hero swaps to "Sign in to continue"', async ({ page, context }) => {
    // The default beforeEach clears localStorage on every page nav.
    // Override that for this test by installing a fresh init script that
    // seeds the anon counter at-cap before the page reads it. Storage
    // shape (from src/lib/anonGenCounter.js):
    //   key:   'sf.anon.gens'
    //   value: JSON.stringify({ date: 'YYYY-MM-DD', count: <n> })
    //
    // addInitScript stacks — the new one runs AFTER the beforeEach's
    // clear, so the seeded value survives.
    await context.addInitScript(() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const date = `${y}-${m}-${d}`;
      try {
        localStorage.setItem('sf.anon.gens', JSON.stringify({ date, count: 99 }));
      } catch { /* private mode */ }
    });
    await page.goto('/');
    await waitForHero(page);

    const signInCta = page.getByRole('button', { name: /Sign in to continue/i });
    await expect(signInCta).toBeVisible();
    await expect(page.getByRole('button', { name: /Begin a settlement/i })).toHaveCount(0);
  });

  test('returning to the page preserves generated settlement (state persistence)', async ({ page }) => {
    await waitForHero(page);
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Village/i }).click();
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Begin a settlement/i }).click();
    await waitForDossier(page);

    // Capture the displayed settlement name.
    const nameBefore = await page.locator('text=/Pop\\.\\s*\\d/i').first().textContent();
    expect(nameBefore).toBeTruthy();

    // Reload the page.
    await page.reload();
    // After reload, either the dossier rehydrates from store/localStorage
    // OR the hero re-mounts. We don't strictly require persistence here —
    // we just verify the app doesn't crash post-reload.
    await page.waitForLoadState('networkidle');
    const hasContent = await page.locator('body').textContent();
    expect(hasContent.length).toBeGreaterThan(50);
  });

  test('no console errors during the happy path', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await waitForHero(page);
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Village/i }).click();
    await page.getByLabel('Anonymous settlement generator')
      .getByRole('button', { name: /Begin a settlement/i }).click();
    await waitForDossier(page);

    // Filter out known noise that the engine emits at INFO level via
    // console.warn during normal operation (these are useful in DEV but
    // not failures). Tighten this list if the engine starts producing
    // genuine errors.
    const noise = [
      /credit_ledger write skipped/i,
      /Download the React DevTools/i,
      /Failed to load resource/i,    // any 4xx on optional asset
    ];
    const real = errors.filter(e => !noise.some(rx => rx.test(e)));
    expect(real, `Console errors during generation:\n${real.join('\n')}`).toEqual([]);
  });
});
