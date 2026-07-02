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
  // The pipeline reveal can briefly cover the page after generation. Esc is
  // the supported skip affordance, then the dossier chrome gives us a stable
  // signal that generation has completed and the lazy view has mounted.
  //
  // The post-generate toolbar's restart control was renamed "New" -> "New
  // Draft" in the UX overhaul (WizardOutputToolbar.jsx). The anchored pattern
  // matches "New Draft" exactly without also catching the neighbouring
  // "Regenerate draft" button.
  await page.keyboard.press('Escape').catch(() => {});
  await expect(page.getByRole('button', { name: /^\s*New Draft\s*$/ }).first()).toBeVisible({ timeout: 30_000 });
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

function primaryHeroCta(hero) {
  return hero.getByRole('button', {
    name: /Forge a|Begin a settlement|Generate a/i,
  }).first();
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
    await page.goto('/create');
  });

  test('homepage renders the HomeHero with eyebrow / title / subtitle', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toContainText(/Forge a settlement|Most generators roll/i);
    await expect(hero.getByText(/Every street, every faction|pieces explain each other/i)).toBeVisible();
  });

  test('hero exposes the three anonymous size buttons', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    // The button labels come from the copy: 'Hamlet', 'Village', 'Town'.
    await expect(sizeButton(hero, 'Hamlet')).toBeVisible();
    await expect(sizeButton(hero, 'Village')).toBeVisible();
    await expect(sizeButton(hero, 'Town')).toBeVisible();
  });

  test('default size selection is Village (aria-pressed)', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    // The button's accessible name concatenates label + hint copy. We
    // match by leading word and rely on the hero scope to disambiguate.
    const village = sizeButton(hero, 'Village');
    await expect(village).toHaveAttribute('aria-pressed', 'true');
    await expect(sizeButton(hero, 'Hamlet')).toHaveAttribute('aria-pressed', 'false');
    await expect(sizeButton(hero, 'Town')).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking a different size button updates aria-pressed correctly', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await sizeButton(hero, 'Hamlet').click();
    await expect(sizeButton(hero, 'Hamlet')).toHaveAttribute('aria-pressed', 'true');
    await expect(sizeButton(hero, 'Village')).toHaveAttribute('aria-pressed', 'false');
  });

  test('"Begin a settlement" button is enabled before generation', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    const begin = primaryHeroCta(hero);
    await expect(begin).toBeVisible();
    await expect(begin).toBeEnabled();
  });

  test('generation produces a dossier with name + tier + population', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await sizeButton(hero, 'Hamlet').click();
    await primaryHeroCta(hero).click();

    await waitForDossier(page);

    await expect(dossierMeta(page)).toContainText(/hamlet/i);
  });

  test('anon counter is bumped in localStorage after a generation', async ({ page }) => {
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await sizeButton(hero, 'Village').click();
    await primaryHeroCta(hero).click();
    await waitForDossier(page);

    // src/lib/anonGenCounter writes to key 'sf.anon.gens'. Current shape is
    // { date, full, reroll }, with { date, count } kept as a legacy reader.
    const stored = await page.evaluate(() => localStorage.getItem('sf.anon.gens'));
    expect(stored, 'sf.anon.gens not written after generation').not.toBeNull();
    const parsed = JSON.parse(stored);
    const total = (parsed.full ?? parsed.count ?? 0) + (parsed.reroll ?? 0);
    expect(total).toBeGreaterThanOrEqual(1);
    expect(parsed.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('pipeline rail is reachable after generation (How this was simulated)', async ({ page }) => {
    await waitForHero(page);
    await primaryHeroCta(page.getByLabel('Anonymous settlement generator')).click();
    await waitForDossier(page);

    // The rail lives behind the SimulationDrawer: the wizard toolbar mounts a
    // "How this was simulated" trigger (WizardOutputToolbar.jsx →
    // SimulationDrawer.jsx). The old assertion was a page-wide loose text
    // regex (/simulated|how this was|pipeline/i) that ANY stray copy could
    // satisfy; instead, exercise the real affordance and assert the real rail.
    const trigger = page.getByRole('button', { name: /^How this was simulated$/i }).first();
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    await trigger.click();

    // The drawer is a role="dialog" aria-label="How this was simulated"
    // (SimulationDrawer.jsx) containing the lazy-loaded PipelineRail — an
    // <aside> (role complementary) with the same aria-label
    // (PipelineRail.jsx). PipelineRail renders null when pipelineHistory is
    // empty, so this also verifies the generation actually recorded steps.
    const drawer = page.getByRole('dialog', { name: 'How this was simulated' });
    await expect(drawer).toBeVisible({ timeout: 10_000 });
    await expect(
      drawer.getByRole('complementary', { name: 'How this was simulated' }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('"New Draft" button after generation returns to a fresh state', async ({ page }) => {
    await waitForHero(page);
    await primaryHeroCta(page.getByLabel('Anonymous settlement generator')).click();
    await waitForDossier(page);

    // The wizard's restart control, renamed "New" -> "New Draft" in the UX
    // overhaul (WizardOutputToolbar.jsx). The anchored pattern targets it
    // without also matching the neighbouring "Regenerate draft" button.
    // waitForDossier above already asserted this button is visible
    // post-generation, so the click is unconditional — no `if (isVisible)`
    // fallback that would let the test pass without ever exercising it.
    const newBtn = page.getByRole('button', { name: /^\s*New Draft\s*$/ }).first();
    await newBtn.click();
    // UX overhaul added an unsaved-draft guard: clicking "New" on an
    // anonymous, unsaved (randomly rolled) draft opens a "Leave this
    // settlement?" confirm so the result isn't lost silently. Discard it to
    // actually start fresh. (This branch IS legitimately conditional — whether
    // the guard fires depends on draft state — but the final post-condition
    // below is asserted unconditionally either way.)
    const discardNew = page.getByRole('button', { name: /Discard and start new/i });
    if (await discardNew.isVisible().catch(() => false)) {
      await discardNew.click();
    }
    // Fresh state: either hero re-mounts OR wizard mode picker shows.
    await expect.poll(async () => {
      const heroVisible = await page
        .getByLabel('Anonymous settlement generator')
        .isVisible()
        .catch(() => false);
      const configVisible = await page
        .getByText(/Basic Generate|Advanced Generate|General Configuration|New settlement/i)
        .first()
        .isVisible()
        .catch(() => false);
      return heroVisible || configVisible;
    }, { timeout: 10_000 }).toBe(true);
  });

  test('anonymous user does NOT see the inline Save button (auth-gated)', async ({ page }) => {
    await waitForHero(page);
    await primaryHeroCta(page.getByLabel('Anonymous settlement generator')).click();
    await waitForDossier(page);

    // The inline `Save` button (title="Save settlement") only renders
    // when canSave is true — which requires a signed-in user with save
    // capacity. An anonymous visitor should see EITHER no Save button
    // OR a Save-to-library affordance that opens auth on click.
    const inlineSave = page.locator('button[title="Save settlement"]');
    await expect(inlineSave).toHaveCount(0);
  });

  test('soft cap: after DEFAULT_DAILY_CAP generations, hero swaps to "Sign in to continue"', async ({ page }) => {
    await seedAnonCapAndRerender(page);

    const signInCta = page.getByRole('button', { name: /Sign in to continue|Create free account/i });
    await expect(signInCta).toBeVisible();
    await expect(page.getByRole('button', { name: /Forge a|Begin a settlement/i })).toHaveCount(0);
  });

  test('reload discards the in-memory anon settlement and returns to a usable hero', async ({ page }) => {
    // The store's persist() partialize DELIBERATELY does not persist the
    // generated settlement (src/store/index.js: "Never persist the massive
    // generated settlement object"). So this asserts the REAL contract: a
    // reload drops the anon draft and the app re-mounts to a fresh, usable
    // hero — not that the settlement survives (it must not).
    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await sizeButton(hero, 'Village').click();
    await primaryHeroCta(hero).click();
    await waitForDossier(page);

    // The dossier is present pre-reload.
    await expect(dossierMeta(page)).toBeVisible();

    await page.reload();

    // Unconditional post-condition: the hero re-mounts (settlement was not
    // persisted) AND the stale dossier meta is gone.
    await waitForHero(page);
    await expect(dossierMeta(page)).toHaveCount(0);
  });

  test('no console errors during the happy path', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Chromium's "Failed to load resource" text does NOT include the URL —
        // it lives in msg.location(). Append it so the noise allowlist below
        // can distinguish genuinely-optional assets from real app failures.
        const url = msg.location?.()?.url;
        errors.push(`console.error: ${msg.text()}${url ? ` (${url})` : ''}`);
      }
    });

    await waitForHero(page);
    const hero = page.getByLabel('Anonymous settlement generator');
    await sizeButton(hero, 'Village').click();
    await primaryHeroCta(hero).click();
    await waitForDossier(page);

    // Filter out known noise that the engine emits at INFO level via
    // console.warn during normal operation (these are useful in DEV but
    // not failures). Tighten this list if the engine starts producing
    // genuine errors.
    //
    // NOTE: a bare /Failed to load resource/i entry used to live here — it
    // masked EVERY failed network resource, so a 4xx/5xx on the happy path
    // could never fail this test. Only genuinely-optional assets (external
    // fonts on an offline runner, the absent favicon) are allowlisted now;
    // any app-origin resource failure is a real error.
    const noise = [
      /credit_ledger write skipped/i,
      /Download the React DevTools/i,
      /Failed to load resource.*(fonts\.googleapis\.com|fonts\.gstatic\.com|favicon)/i,
    ];
    const real = errors.filter(e => !noise.some(rx => rx.test(e)));
    expect(real, `Console errors during generation:\n${real.join('\n')}`).toEqual([]);
  });
});
