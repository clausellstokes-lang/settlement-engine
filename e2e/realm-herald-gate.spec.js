import { test, expect } from '@playwright/test';

/**
 * e2e/realm-herald-gate.spec.js: THE HERALD WAITS FOR THE FIRST ADVANCE.
 *
 * Owner order (2026-09-17): "The herald should only appear after the first advanced
 * time on the map." The chair's ruling: the Herald (the desktop Realm Inspector panel
 * and its toolbar toggle) is not shown on a campaign whose realm clock has never been
 * advanced; it appears once the first advance has happened and stays available from
 * then on, including after a reload. The gate is derived from the persisted world
 * clock (worldState.tick), so these arms seed campaigns through the same localStorage
 * seam the app hydrates from and drive the real app in a real browser:
 *   1. a fresh realm: Advance Realm is there, the Herald and its toggle are not;
 *   2. a realm that has advanced before: the toggle opens the Herald, and a reload
 *      brings the remembered Herald back;
 *   3. the real first advance: the Advance dialog carries the living-world controls
 *      (their pre-advance home), the advance commits, and the Herald appears;
 *   4. anon on /realm: no Herald opens on entry.
 *
 * Pages load their view lazily after the shell, so every arm waits for
 * [data-sf-route-loading] to be gone before it measures anything (settleRoute in
 * e2e/pinned-footer.spec.js).
 */

test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Desktop Chromium: the Realm workspace is desktop-only');

const TOGGLE = /^Toggle the Realm Inspector/;

/**
 * A campaign that already carries its content binding (the vanilla environment, no
 * custom definitions), exactly as makeCampaignContentBinding writes it. Seeding it
 * keeps pinLegacyCampaignContentBindings from pinning a legacy binding on load, whose
 * environment currently lands as a revoked Immer draft and fails the first advance
 * with "Cannot perform 'getPrototypeOf' on a proxy that has been revoked" (measured on
 * the untouched base a62dcbb90; reported, not fixed here).
 */
const VANILLA_BINDING = Object.freeze({
  schemaVersion: 1,
  source: 'legacy-inferred',
  environment: {
    schemaVersion: 1,
    environmentId: 'system:vanilla',
    environmentRevisionId: 'system:vanilla:v1',
    revisionNumber: 1,
    source: 'vanilla',
    packVersions: [],
    directDefinitions: [],
    tunables: {},
    visualSelection: {},
    environmentHash: 'aeb02a6f73cd182b45498535f24b7d7cc509799add744ce436d87a65f6c73bb3',
    createdAt: null
  },
  resolvedDefinitions: [],
  bindingHash: '9b58eb4b79284c5e56c8afddd99c656bd6ffb95b3357ab3ff0807a7283fd1a69'
});

function canonSave(id, name) {
  return {
    id,
    name,
    tier: 'village',
    timestamp: '2026-01-01T00:00:00.000Z',
    settlement: {
      id,
      name,
      tier: 'village',
      population: 400,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
      economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
      activeConditions: [],
      neighbourNetwork: [],
    },
    campaignState: {
      phase: 'canon',
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z',
      lastExportAt: null,
      narrativeDrift: null,
      exportState: null,
    },
  };
}

function campaign(worldState) {
  return {
    id: 'camp-herald',
    name: 'Tidewater Reach',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    settlementIds: ['herald-a', 'herald-b'],
    collapsed: false,
    mapState: null,
    contentBinding: VANILLA_BINDING,
    contentBindingHistory: [],
    contentBindingStatus: 'pinned',
    ...(worldState ? { worldState } : {}),
  };
}

/** Seed once per test, so a reload keeps the session record the app wrote. */
async function seed(page, { campaigns = [], saves = [], premium = true } = {}) {
  await page.addInitScript(({ campaigns, saves, premium }) => {
    try {
      if (sessionStorage.getItem('e2e-herald-seeded') === '1') return;
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('dnd_settlement_saves', JSON.stringify(saves));
      localStorage.setItem('sf_campaigns', JSON.stringify(campaigns));
      localStorage.setItem('sf_campaigns:mock-e2e', JSON.stringify(campaigns));
      if (premium) {
        localStorage.setItem('settlement_mock_auth', JSON.stringify({
          user: { id: 'mock-e2e', email: 'dm@example.test', user_metadata: {} },
          session: { access_token: 'mock-token' },
          tier: 'premium',
          role: 'user',
          displayName: 'DM',
          isFounder: false,
          needsVerification: false,
        }));
      }
      sessionStorage.setItem('e2e-herald-seeded', '1');
    } catch { /* storage unavailable */ }
  }, { campaigns, saves, premium });
}

async function settleRoute(page) {
  await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));
}

/** Select the seeded campaign in the toolbar (auto-resume may already have). */
async function selectCampaign(page) {
  const select = page.locator('select').filter({ has: page.locator('option', { hasText: 'Tidewater Reach' }) });
  await expect(select).toBeVisible({ timeout: 20_000 });
  const value = await select.locator('option', { hasText: 'Tidewater Reach' }).getAttribute('value');
  await select.selectOption(value);
  await expect(page.getByRole('button', { name: /Advance Realm/ })).toBeVisible();
}

test.describe('the Herald waits for the first advance (owner order 2026-09-17)', () => {
  test('a fresh realm shows Advance Realm but neither the Herald nor its toggle', async ({ page }) => {
    await seed(page, { campaigns: [campaign(null)], saves: [canonSave('herald-a', 'Saltmere'), canonSave('herald-b', 'Oxbridge')] });
    await page.goto('/realm');
    await settleRoute(page);
    await selectCampaign(page);

    await expect(page.getByRole('button', { name: TOGGLE })).toHaveCount(0);
    await expect(page.getByTestId('realm-inspector')).toHaveCount(0);
  });

  test('a realm that has advanced before opens the Herald from its toggle, and a reload brings it back', async ({ page }) => {
    await seed(page, {
      campaigns: [campaign({ tick: 3, calendar: { elapsedWeeks: 3 } })],
      saves: [canonSave('herald-a', 'Saltmere'), canonSave('herald-b', 'Oxbridge')],
    });
    await page.goto('/realm');
    await settleRoute(page);
    await selectCampaign(page);

    const toggle = page.getByRole('button', { name: TOGGLE });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByTestId('realm-inspector')).toBeVisible({ timeout: 15_000 });

    await page.reload();
    await settleRoute(page);
    await selectCampaign(page);
    await expect(page.getByRole('button', { name: TOGGLE })).toBeVisible();
    await expect(page.getByTestId('realm-inspector')).toBeVisible({ timeout: 15_000 });
  });

  test('the first real advance: the dialog carries the clock and the living-world controls, then the Herald appears', async ({ page }) => {
    test.setTimeout(120_000);
    await seed(page, {
      campaigns: [campaign(null)],
      saves: [canonSave('herald-a', 'Saltmere'), canonSave('herald-b', 'Oxbridge')],
    });
    const advanceFailures = [];
    page.on('console', (message) => {
      if (/advance realm (failed|reason)/.test(message.text())) advanceFailures.push(message.text().slice(0, 300));
    });
    await page.goto('/realm');
    await settleRoute(page);
    await selectCampaign(page);
    await expect(page.getByRole('button', { name: TOGGLE })).toHaveCount(0);

    await page.getByRole('button', { name: /Advance Realm/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByTestId('advance-living-world')).toBeVisible();
    await expect(dialog.getByTestId('living-world-gates')).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Map geography/ })).toBeVisible();

    // A fresh world: start its clock from the dialog, then advance.
    await dialog.getByRole('button', { name: /Start the World Clock/i }).click();
    await expect(dialog.getByRole('button', { name: /Start the World Clock/i })).toHaveCount(0, { timeout: 20_000 });
    await expect(page.getByRole('button', { name: TOGGLE })).toHaveCount(0);
    await dialog.getByRole('button', { name: 'Advance Realm', exact: true }).click();

    await expect(page.getByTestId('realm-inspector')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole('button', { name: TOGGLE })).toBeVisible();
    expect(advanceFailures).toEqual([]);
  });

  test('anon: the Realm opens with no Herald', async ({ page }) => {
    await seed(page, { premium: false });
    await page.goto('/realm');
    await settleRoute(page);
    await expect(page.getByRole('button', { name: /^Layers$/ })).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(1500);
    await expect(page.getByTestId('realm-inspector')).toHaveCount(0);
    await expect(page.getByRole('button', { name: TOGGLE })).toHaveCount(0);
  });
});
