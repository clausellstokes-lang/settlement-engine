import { test, expect } from '@playwright/test';

/**
 * e2e/realm-native-layers.spec.js: A SAVED NATIVE MAP LAYER PAINTS ON THE MAP THE
 * REALM ACTUALLY SHOWS, NOT ONLY ON THE ONE THE BRIDGE FIRST MET.
 *
 * Observed 2026-10-02 while re-cutting the landing realm photograph: a campaign
 * seeded with `mapState.layers.nativeBiomes: true` and an Instant World map plan
 * (`pendingMapGen`) opened in /realm with the Layers panel's "Biomes" switch ON
 * and no biome colour anywhere on the map; switching it off and on painted them.
 *
 * The mechanism, read in the vendored frame: WorldMap pushes each native-layer
 * flag into the FMG iframe when the bridge first connects. useInstantWorldMaterialize
 * then regenerates the world from the campaign's seed, and FMG's regenerateMap
 * runs `undraw()` (public/map/main.js), which removes every <path> in the viewbox,
 * #biomes included; its `drawLayers()` redraws biomes only when FMG's OWN
 * toggleBiomes button is on, which the bridge never turns on (it flips the <g>'s
 * display and lazy-draws biomes only when asked). So the <g> stayed visible and
 * empty, and nothing asked again.
 *
 * This arm drives the real app, the real bridge and the real FMG engine: it seeds
 * the campaign through the localStorage seam every realm spec uses
 * (e2e/realm-herald-gate.spec.js), waits until FMG holds the campaign's OWN seed
 * (so the boot map's transient biomes can never satisfy it), and then reads the
 * iframe's own DOM.
 */

test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Desktop Chromium: the Realm workspace is desktop-only');

const MAP_SEED = 'native-layers-e2e-seed-1';
const STAMP = '2026-01-01T00:00:00.000Z';

function instantWorldCampaign(layers) {
  return {
    id: 'camp-native-layers',
    name: 'Painted Reach',
    createdAt: STAMP,
    updatedAt: STAMP,
    settlementIds: [],
    collapsed: false,
    accessState: 'active',
    // The map PLAN composeInstantWorld stages, not a snapshot: the app regenerates
    // FMG geometry from this seed on open.
    mapState: {
      schemaVersion: 2,
      fmgSnapshot: null,
      seed: MAP_SEED,
      mapKind: 'volcano',
      pendingMapGen: true,
      customBackdrop: null,
      placements: {},
      labels: [], markers: [], forests: [],
      layers,
      viewport: { cx: 0, cy: 0, scale: 1, width: 0, height: 0 },
      savedAt: STAMP,
    },
  };
}

async function seedStorage(page, campaigns) {
  await page.addInitScript(({ campaigns }) => {
    try {
      if (sessionStorage.getItem('e2e-native-layers-seeded') === '1') return;
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('dnd_settlement_saves', JSON.stringify([]));
      localStorage.setItem('sf_campaigns', JSON.stringify(campaigns));
      localStorage.setItem('sf_campaigns:mock-e2e', JSON.stringify(campaigns));
      localStorage.setItem('settlement_mock_auth', JSON.stringify({
        user: { id: 'mock-e2e', email: 'dm@example.test', user_metadata: {} },
        session: { access_token: 'mock-token' },
        tier: 'premium',
        role: 'user',
        displayName: 'DM',
        isFounder: false,
        needsVerification: false,
      }));
      sessionStorage.setItem('e2e-native-layers-seeded', '1');
    } catch { /* storage unavailable: the arms below say so */ }
  }, { campaigns });
}

/** The FMG iframe's frame (the map engine is the only frame under /map/). */
async function mapFrame(page) {
  await expect.poll(() => page.frames().some((f) => /\/map\//.test(f.url())), { timeout: 30_000 }).toBe(true);
  return page.frames().find((f) => /\/map\//.test(f.url()));
}

/** Read one native layer's state out of the frame's own DOM. */
function readLayer(frame, id) {
  return frame.evaluate((gid) => {
    const g = document.getElementById(gid);
    if (!g) return { present: false, paths: 0, display: null };
    return { present: true, paths: g.querySelectorAll('path').length, display: getComputedStyle(g).display };
  }, id);
}

test.describe('a saved native map layer survives the map being regenerated under it', () => {
  test('an Instant World opened with Biomes ON paints its biomes on the materialized map', async ({ page }) => {
    test.setTimeout(120_000);
    await seedStorage(page, [instantWorldCampaign({ nativeBiomes: true })]);
    await page.goto('/realm');
    await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));

    // Auto-resume reopens the only campaign; select it explicitly if it has not.
    const select = page.locator('select').filter({ has: page.locator('option', { hasText: 'Painted Reach' }) });
    await expect(select).toBeVisible({ timeout: 20_000 });
    const value = await select.locator('option', { hasText: 'Painted Reach' }).getAttribute('value');
    if ((await select.inputValue()) !== value) await select.selectOption(value);

    const frame = await mapFrame(page);
    // THE MAP IS THE CAMPAIGN'S OWN once FMG holds the campaign's seed: the boot
    // map's transient biomes (painted before the regeneration and wiped by it) can
    // never satisfy the arms below.
    await expect.poll(
      () => frame.evaluate(() => (typeof seed === 'undefined' ? null : String(seed))),
      { timeout: 60_000, message: 'FMG never regenerated the Instant World from the campaign seed' },
    ).toBe(MAP_SEED);

    // The UI says ON...
    await page.getByRole('button', { name: /^Layers$/ }).click();
    await expect(page.getByRole('checkbox', { name: 'Biomes' })).toBeChecked();

    // ...and the map shows it: the #biomes group is visible AND holds painted regions.
    await expect.poll(() => readLayer(frame, 'biomes'), {
      timeout: 15_000,
      message: 'Biomes is ON in the Layers panel but the regenerated FMG map paints no biome',
    }).toEqual(expect.objectContaining({ present: true, display: 'inline' }));
    await expect.poll(async () => (await readLayer(frame, 'biomes')).paths, { timeout: 15_000 }).toBeGreaterThan(0);
  });

  test('a saved snapshot whose SVG never drew the biomes paints them when the campaign says Biomes ON', async ({ page, browser }) => {
    test.setTimeout(180_000);
    // ── 1. A real FMG snapshot of the campaign's world, taken with Biomes OFF, so
    // its serialized #biomes is empty and hidden. (A map saved before the switch was
    // turned on, its flags written by a later save: the snapshot and the flags differ.)
    await seedStorage(page, [instantWorldCampaign({ nativeBiomes: false })]);
    await page.goto('/realm');
    await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));
    const first = await mapFrame(page);
    await expect.poll(
      () => first.evaluate(() => (typeof seed === 'undefined' ? null : String(seed))),
      { timeout: 60_000 },
    ).toBe(MAP_SEED);
    // prepareMapData is FMG's own serializer, a global of the frame.
    const snapshot = await first.evaluate(() => prepareMapData());
    expect(typeof snapshot === 'string' && snapshot.length > 1000, 'FMG produced no snapshot').toBe(true);
    const unpainted = await first.evaluate(() => document.querySelectorAll('#biomes path').length);
    expect(unpainted, 'the snapshot was meant to be taken with no biome drawn').toBe(0);

    // ── 2. A fresh browser opens the campaign as saved: that snapshot + Biomes ON.
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const reopened = await context.newPage();
    const saved = instantWorldCampaign({ nativeBiomes: true });
    delete saved.mapState.pendingMapGen;
    saved.mapState.fmgSnapshot = snapshot;
    await seedStorage(reopened, [saved]);
    await reopened.goto('/realm');
    await reopened.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));
    const frame = await mapFrame(reopened);
    // The snapshot is IN once FMG holds its seed (the boot map has a random one).
    await expect.poll(
      () => frame.evaluate(() => (typeof seed === 'undefined' ? null : String(seed))),
      { timeout: 60_000, message: 'the saved snapshot never loaded' },
    ).toBe(MAP_SEED);

    await expect.poll(() => readLayer(frame, 'biomes'), {
      timeout: 15_000,
      message: 'Biomes is ON for this campaign but the loaded snapshot shows none',
    }).toEqual(expect.objectContaining({ present: true, display: 'inline' }));
    await expect.poll(async () => (await readLayer(frame, 'biomes')).paths, { timeout: 15_000 }).toBeGreaterThan(0);
    await context.close();
  });
});
