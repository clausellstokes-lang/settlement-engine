/**
 * e2e/landing-realm-capture.spec.js — THE LANDING'S REALM MAP IS A PHOTOGRAPH OF
 * THE PRODUCT, NOT A DRAWING OF IT.
 *
 * ── THE ORDER (ODQ §934.30 item 5, owner, 2026-09-19) ────────────────────────
 * "the realm clock map should actually be made and a screenshot of Cnocby in a
 * drawn out map made in the realm with other generated settlements … with the
 * realm clock advance time box over that."
 *
 * ── WHAT THE LANDING SHOWED BEFORE ──────────────────────────────────────────
 * `public/landing-maps/realm-preview.fallowmere.parchment.svg` — a HEADLESS
 * plate from src/domain/realmMap/realmPlateRenderer.js at seed `fallowmere`. It
 * is real generated output, but it is not the product: it is a different
 * renderer, a different seed, and a realm that has nothing to do with the town
 * the other four artifacts on that page are about. A visitor reading the
 * landing met Cnocby four times and then looked at a map of somewhere else.
 *
 * ── WHY THIS IS A SPEC AND NOT A HEADLESS SCRIPT ────────────────────────────
 * The realm's geography is FMG, which lives in an iframe under public/map/ and
 * cannot be generated outside a browser (src/lib/instantWorld/composeInstantWorld.js
 * says so, and useInstantWorldMaterialize is the downstream half that drives it).
 * The marker overlay is the PARENT document's SVG. So the only honest capture is
 * the real app, in a real engine, with the real bridge up — which is exactly what
 * Playwright already boots for every other spec in this directory.
 *
 * ── THE REGION IS THE FIXTURE'S OWN, THROUGH THE FIXTURE'S OWN MODULE ───────
 * `buildRegion` + `advanceRegion` are imported from
 * scripts/generate-landing-fixture.mjs — the SAME two functions that derive the
 * facts the landing quotes. A second spelling of "the fixture's region" here
 * would be a parallel emitter, and the first time the fixture's neighbours
 * changed the photograph would quietly be of a different realm than the text.
 *
 * ── AND IT IS SEEDED THROUGH THE APP'S OWN DOOR ─────────────────────────────
 * The campaign is handed to the app through the localStorage seam every other
 * realm spec uses (e2e/realm-herald-gate.spec.js), in the shape
 * composeInstantWorld produces: canon member saves, a v2 mapState carrying the
 * map PLAN (`seed` + `mapKind` + `pendingMapGen`) and the placements, and a
 * worldState at the fixture's week. The app then materializes the geometry from
 * that seed on open, exactly as it does for a user's own Instant World. Nothing
 * about the render is special-cased for the camera.
 *
 * ── RUN IT DELIBERATELY ─────────────────────────────────────────────────────
 * This spec WRITES INTO public/, so it is not part of the ordinary e2e sweep:
 * it is skipped unless CAPTURE_LANDING_REALM=1. Drive it with
 *   node scripts/capture-landing-realm.mjs
 * which sets the flag, runs this file, and prints the dimensions and bytes.
 */
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';
import { advanceRegion, buildRegion, committedProvenance } from '../scripts/generate-landing-fixture.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const OUT_DIR = join(ROOT, 'public', 'landing-maps');
export const OUT_PNG = join(OUT_DIR, 'realm-cnocby.png');
export const OUT_PROVENANCE = join(OUT_DIR, 'realm-cnocby.provenance.json');

/** The capture's own width floor (the owner's "≥ 1400 px", at 2× device scale). */
const CAPTURE_WIDTH = 1440;
const CAPTURE_HEIGHT = 900;

test.skip(
  () => process.env.CAPTURE_LANDING_REALM !== '1',
  'writes into public/ — run it through scripts/capture-landing-realm.mjs',
);
test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile,
  'Desktop Chromium: the Realm workspace is desktop-only');

// The whole fixture derivation (5 generations + 12 world pulses) happens in this
// file's Node side before the page is touched.
test.use({
  viewport: { width: CAPTURE_WIDTH, height: CAPTURE_HEIGHT },
  deviceScaleFactor: 2,
});

/** A member save in the shape the app hydrates (e2e/realm-herald-gate.spec.js). */
function canonSave(entry, stamp) {
  return {
    id: entry.id,
    name: entry.name,
    tier: entry.settlement?.tier,
    timestamp: stamp,
    settlement: entry.settlement,
    campaignState: {
      phase: 'canon', eventLog: [], systemState: null, locks: {},
      generatedAt: stamp, editedAt: stamp, canonizedAt: stamp,
      lastExportAt: null, narrativeDrift: null, exportState: null,
    },
  };
}

/**
 * ⛔ THE SETTLEMENTS ARE PLACED BY THE PRODUCT, NOT BY THIS FILE, and the first
 * run is why. The spec used to inject `mapState.placements` at hand-picked FMG
 * coordinates; the app did not consider them placed at all — it opened with all
 * five still in the palette under "Drag a card onto the map to place it", and
 * the overlay carried no names. Rather than reverse-engineer what makes a
 * placement count, the capture now presses the realm's OWN "Autoplace all"
 * button, which is the door a user uses. The photograph is better for it: the
 * layout is the product's judgment about where these five belong, not a ring I
 * invented, and it exercises the real placement path end to end.
 */
const MEMBER_COUNT = 5;

test('the landing realm map is captured from the running Realm view', async ({ page }) => {
  const provenance = committedProvenance();
  expect(provenance, 'the landing fixture carries no readable provenance').toBeTruthy();
  const { seed, weeks, settType } = provenance;

  // THE FIXTURE'S OWN REGION, through the fixture's own module.
  const { town, saves, edges } = buildRegion(seed, { settType });
  const { campaign: advanced, saves: after } = advanceRegion(seed, saves, edges, { weeks });
  expect(after, 'the region did not advance').toHaveLength(5);
  expect(town.name, 'the fixture town lost its name').toBeTruthy();

  const stamp = '2026-01-01T00:00:00.000Z';
  const memberSaves = after.map((entry) => canonSave(entry, stamp));

  const campaign = {
    id: 'camp-landing-realm',
    name: `${town.name} and its neighbours`,
    createdAt: stamp,
    updatedAt: stamp,
    settlementIds: memberSaves.map((s) => s.id),
    collapsed: false,
    accessState: 'active',
    lastReadTick: 0,
    regionalGraph: advanced.regionalGraph,
    wizardNews: advanced.wizardNews,
    worldState: advanced.worldState,
    // The map PLAN, not a snapshot: the app materializes FMG geometry from this
    // seed on open (useInstantWorldMaterialize), which is the user's own path.
    mapState: {
      schemaVersion: 2,
      fmgSnapshot: null,
      seed: `landing-${seed}`,
      mapKind: 'highIsland',
      pendingMapGen: true,
      customBackdrop: null,
      placements: {},
      labels: [], markers: [], forests: [], layers: {},
      viewport: { cx: 0, cy: 0, scale: 1, width: 0, height: 0 },
      savedAt: stamp,
    },
  };

  await page.addInitScript(({ campaigns, saves: seeded }) => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('dnd_settlement_saves', JSON.stringify(seeded));
      localStorage.setItem('sf_campaigns', JSON.stringify(campaigns));
      localStorage.setItem('sf_campaigns:mock-e2e', JSON.stringify(campaigns));
      localStorage.setItem('settlement_mock_auth', JSON.stringify({
        user: { id: 'mock-e2e', email: 'dm@example.test', user_metadata: {} },
        session: { access_token: 'mock-token' },
        tier: 'premium',
      }));
    } catch { /* a blocked storage leaves the realm empty and the arms below say so */ }
  }, { campaigns: [campaign], saves: memberSaves });

  await page.goto('/realm');
  await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));

  // ⛔ THE DOCKET OPENS OVER THE MAP, AND IT IS NOT A BUG. Twelve weeks of pulses
  // leave real matters awaiting judgment, so the Realm greets this campaign with
  // "The realm awaits your judgment" across the whole stage — the first run
  // photographed that modal instead of the realm. It is dismissed the way a
  // player dismisses it ("Set the rest aside"), which leaves every matter ON the
  // docket: nothing is ruled, nothing is decided, and the world is exactly as
  // the advance left it.
  //
  // ⚠ AND IT MUST BE WAITED FOR, NOT POLLED ONCE. The second run checked
  // `count()` the instant the route settled, found nothing, skipped the dismissal
  // — and then could not find "Autoplace all" AT ALL, because the docket had
  // mounted a moment later and a modal makes the rest of the page inert, which
  // takes the sidebar out of the accessibility tree entirely. The absence of a
  // control and a control behind a modal look identical to `getByRole`.
  const setAside = page.getByRole('button', { name: /Set the rest aside/i });
  await setAside.first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
  if (await setAside.count()) {
    await setAside.first().click();
    await expect(setAside.first()).toBeHidden({ timeout: 15_000 });
  }

  // THE SETTLEMENTS GO ONTO THE MAP THROUGH THE PRODUCT'S OWN CONTROL.
  //
  // ⚠ MATCHED ON THE ACCESSIBLE NAME, WHICH IS NOT THE VISIBLE TEXT. The control
  // reads "Autoplace all" on screen but carries an aria-label that OVERRIDES it
  // ("Autoplace: survey the realm and propose the best ground for every
  // settlement…"), so a `/Autoplace all/i` role query finds nothing while the
  // button sits in plain sight. The third run failed exactly there.
  const autoplace = page.getByRole('button', { name: /^Autoplace/i });
  await expect(autoplace.first()).toBeVisible({ timeout: 30_000 });
  await autoplace.first().click();

  // ⛔ AUTOPLACE PROPOSES; IT DOES NOT PLACE. "Nothing is placed until you
  // confirm" is the control's own promise (AutoplacementConsent.jsx), so the
  // capture confirms the proposal the way a user does. The button counts what it
  // will place, so the label is matched on the shape rather than a fixed number.
  const confirm = page.getByRole('button', { name: /^Place \d+ settlements?$/ });
  await expect(confirm.first()).toBeEnabled({ timeout: 30_000 });
  await confirm.first().click();
  await expect(confirm.first()).toBeHidden({ timeout: 30_000 });

  // THE MAP IS UP when the FMG iframe has painted and the parent's marker overlay
  // carries every member. Both are asserted rather than waited on blindly: a
  // screenshot of a blank stage is the failure this whole file exists to avoid,
  // and it is the one failure a screenshot test will happily ship.
  const frame = page.locator('iframe');
  await expect(frame.first()).toBeVisible({ timeout: 60_000 });
  await page.waitForSelector('[data-map-overlay-svg]', { timeout: 60_000 });
  // The overlay carries a NAME per member once they are placed. Waiting on the
  // names rather than on a shape count is deliberate: a count of <circle> and
  // <path> nodes is satisfied by decoration, and the first run proved it — the
  // count wait passed on a map with nothing placed on it at all.
  await page.waitForFunction(
    (names) => {
      const svg = document.querySelector('[data-map-overlay-svg]');
      const text = svg ? svg.textContent || '' : '';
      return names.every((name) => text.includes(name));
    },
    after.map((s) => s.name),
    { timeout: 60_000 },
  );
  // ⛔ AND THE REALM IS FRAMED BEFORE IT IS PHOTOGRAPHED. The fourth run PASSED
  // and produced a picture that was three-quarters BLACK: the FMG canvas had
  // painted one corner, the markers sat outside the painted region, and the name
  // check was satisfied by the overlay's textContent — text nodes exist whether
  // or not a single pixel of them was rendered. "Fit" is the toolbar's own
  // "frames the whole realm in view", which is what a person would press.
  const fit = page.getByRole('button', { name: /^Fit$/i });
  if (await fit.count()) {
    await fit.first().click();
  }
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  // The FMG canvas repaints asynchronously after a viewport change; give it real
  // frames rather than a bare rAF pair, which the black capture proved is not
  // enough for an iframe-hosted canvas.
  await page.waitForTimeout(3_000);

  // Every member's NAME is on the overlay — the owner asked for Cnocby "with
  // other generated settlements", and a map of five unlabelled dots is not that.
  const overlayText = await page.evaluate(() => document.querySelector('[data-map-overlay-svg]')?.textContent || '');
  const missing = after.map((s) => s.name).filter((name) => !overlayText.includes(name));
  expect(missing, `these settlements are not drawn on the realm map: ${missing.join(', ')}`).toEqual([]);

  const stage = page.locator('[data-map-overlay-svg]').first().locator('xpath=ancestor::*[self::div][1]');
  mkdirSync(OUT_DIR, { recursive: true });
  const box = await stage.boundingBox();
  expect(box, 'the map stage has no box to photograph').toBeTruthy();
  expect(box.width, `the capture is narrower than the owner's 1400px floor: ${box.width}`).toBeGreaterThanOrEqual(1000);
  expect(after, 'the region lost a member between derivation and capture').toHaveLength(MEMBER_COUNT);
  await stage.screenshot({ path: OUT_PNG, animations: 'disabled', caret: 'hide' });

  expect(existsSync(OUT_PNG), 'no PNG was written').toBe(true);
  // ⛔ THE SPEC PHOTOGRAPHS; IT DOES NOT ENCODE. Quantization, the WebP twin and
  // the pixel guard all moved into scripts/capture-landing-realm.mjs (ODQ
  // §934.32 addendum) so that every sharp pipeline this act uses lives under
  // scripts/, where tests/build/aiMediaProvenance.test.js's roster can see it and
  // demand its `.keepMetadata()`. A sharp call in e2e/ is outside that roster —
  // undeclared by accident rather than by decision, which is the shape the roster
  // exists to prevent. The script is the door, and its exit code is the receipt.
  const bytes = statSync(OUT_PNG).size;


  // THE SIDECAR (the owner's law, not the provenance walker's — public/landing-maps
  // is outside MEDIA_ROOTS). It records what would be needed to cut this again.
  let tip = '';
  try { tip = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { tip = 'unknown'; }
  writeFileSync(OUT_PROVENANCE, `${JSON.stringify({
    file: 'public/landing-maps/realm-cnocby.png',
    what: `The Realm view of ${town.name} and its four neighbours, photographed in Chromium from the running app.`,
    script: 'scripts/capture-landing-realm.mjs → e2e/landing-realm-capture.spec.js',
    seed,
    mapSeed: `landing-${seed}`,
    mapKind: 'highIsland',
    weeks,
    settlements: after.map((s) => ({ id: s.id, name: s.name, tier: s.settlement?.tier })),
    placedBy: 'the realm\'s own "Autoplace all" control',
    captureWidth: CAPTURE_WIDTH,
    deviceScaleFactor: 2,
    pixelWidth: Math.round(box.width * 2),
    pixelHeight: Math.round(box.height * 2),
    bytes,
    tip,
    capturedAt: new Date().toISOString().slice(0, 10),
    note: 'Not AI art and not a drawing: a screenshot of the product rendering its own realm. Re-cut with `node scripts/capture-landing-realm.mjs`.',
  }, null, 2)}\n`);

  // Reported rather than asserted at a hard ceiling: the target is 400 kB and the
  // honest answer to a heavier one is the estate's sharp pipeline, not a worse
  // photograph. The number is printed so the decision is made on a measurement.
  console.log(`[capture-landing-realm] ${OUT_PNG} · ${Math.round(box.width * 2)}x${Math.round(box.height * 2)} · ${bytes} bytes`);
  expect(bytes, 'the capture is empty').toBeGreaterThan(10_000);
});
