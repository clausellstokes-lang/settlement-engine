/**
 * tests/build/landingFixtureForgeRoad.test.js — THE HOME PAGE'S SAMPLE TOWN IS THE TOWN THE
 * BUTTON FORGES, COMPARED WHOLE (BRIEF CLOSE-FIXTURE, the chair's ruling E55; written
 * 2026-11-22 08:24 UTC, read from `date -u`).
 *
 * ── THE FAULT THIS CLOSES ──────────────────────────────────────────────────────
 * `scripts/generate-landing-fixture.mjs` births the landing's town with
 * `generateSettlementPipeline(forgeConfigFor(st), …)`. The landing's "Forge this exact town"
 * button replays the fixture's recorded `{ seed, config }` through the store's generation lane
 * (`src/store/settlementGenerateAction.js :: generateSettlementAction`), which births THROUGH
 * `birthConfig`. A script that skipped the create boundary drew the same town while every law
 * sat dark, and a DIFFERENT town as soon as a law that moves a village was lit (measured by
 * CLOSE-1, `close/measures/LANDING-FIXTURE-PROBE.md`). `landingFixtureFreshness.test.js` cannot
 * see that: it re-runs the same script, so the script agrees with itself.
 *
 * ⛔ SO THIS FILE ASKS THE ONE QUESTION THE PROMISE MAKES. For the committed fixture's own seed
 * and size, the town the SCRIPT's birth produces (`buildRegion(...).town`, its one spelling)
 * EQUALS, compared WHOLE (`toEqual` on the whole settlement, config included), the town the
 * STORE forges from the inputs the landing replays (the committed module's `forge`). Two arms:
 *   (a) under this tree's own dials;
 *   (b) LIT: every row of `GENERATION_LAWS` lit by `vi.doMock` of its `module`, the row's `mint`
 *       returning `{ [row.configKey]: <its lit version> }`, and the graph re-imported after the
 *       mock (the SAVED-TOWN form, `fortuneLawSavedTown.test.js :: buildUnder`).
 * A NEW LAW forces the lit table below to grow: arm (b) asserts every row has an entry.
 *
 * ⚠ ONE KEY IS SET ASIDE, BY NAME, AND PINNED. The lane's transport stamps `engineVersion` (the
 * committed engine bundle's hash) onto the record it returns, OUTSIDE the pipeline and by design
 * never inside it (`src/lib/generationClient.js :: stampEngineVersion`). It is not the town; it
 * is asserted equal to the bundle meta's value, the script's town is asserted NOT to carry it,
 * and everything else is compared whole.
 *
 * ⚠ RUNNABLE FROM ANY TREE. Every path is relative to this file, the laws are read off the
 * tree's own register, and the lit table carries the seat, fortune and trouble keys a lit tree
 * registers.
 *
 * @enforced-by this test
 */
import { afterAll, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

const BOUNDARY = '../../src/domain/density/densityCreateBoundary.js';
const BUNDLE_META = new URL('../../supabase/functions/_shared/engineBundle.meta.json', import.meta.url);
const LONG = 180_000;

/**
 * THE LIT VERSION OF EVERY GENERATION LAW, keyed by its config key. A row of `GENERATION_LAWS`
 * with no entry here reds arm (b) by name, so a new law cannot ride this test unlit.
 */
const LIT_VERSION_OF = Object.freeze({
  _densityLawVersion: 2,
  _livingContentLawVersion: 2,
  _seatLawVersion: 2,
  _fortuneLawVersion: 2,
  _troubleLawVersion: 2,
});

/** The tree's own law register, read from a fresh graph. */
async function lawRows() {
  vi.resetModules();
  const { GENERATION_LAWS } = await import(BOUNDARY);
  return Object.values(GENERATION_LAWS);
}

/**
 * The graph (script, store slices, boundary) re-imported fresh; with `rows`, every one of those
 * laws lit by its module's mint first.
 * @param {ReadonlyArray<{mint: string, module: string, configKey: string}>} [rows]
 */
async function graphUnder(rows = []) {
  vi.resetModules();
  for (const row of rows) {
    vi.doMock(`../../${row.module}`, async (importOriginal) => {
      const actual = await importOriginal();
      return { ...actual, [row.mint]: () => ({ [row.configKey]: LIT_VERSION_OF[row.configKey] }) };
    });
  }
  const script = await import('../../scripts/generate-landing-fixture.mjs');
  const { fixture } = await import('../../src/components/home/landingFixture.js');
  const configSlice = await import('../../src/store/configSlice.js');
  const settlementSlice = await import('../../src/store/settlementSlice.js');
  const boundary = await import(BOUNDARY);
  await boundary.loadGenerationLawPayloads();
  return { script, fixture, configSlice, settlementSlice };
}

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canCustomizePreGeneration: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  setActivePricingMoment: () => {},
  clearNeighbour: () => {},
});

/**
 * Both births of the committed fixture's town in graph `G`: the script's, and the store's from
 * the inputs the landing button replays (LandingArtifacts.jsx :: forgeExact).
 * @param {any} G
 */
async function bothBirths(G) {
  const provenance = G.script.committedProvenance();
  expect(provenance, 'the committed fixture carries no readable provenance').toBeTruthy();
  const { seed, settType } = provenance;
  const scriptTown = G.script.buildRegion(seed, { settType }).town;

  const store = create(immer((...a) => ({
    ...stubSlice(),
    ...G.configSlice.createConfigSlice(...a),
    ...G.settlementSlice.createSettlementSlice(...a),
  })));
  const { forge } = G.fixture;
  store.getState().setWizardMode(forge.mode);
  store.getState().setRandomSliderMode(forge.randomSliderMode);
  store.getState().clearNeighbour();
  store.getState().updateConfig({ ...forge.config });
  const forged = await store.getState().generateSettlement(G.fixture.seed);
  expect(forged, 'the store refused or failed to forge the fixture town').toBeTruthy();
  // The transport's record stamp, set aside by name and pinned (see the header).
  const { engineVersion, ...forgedTown } = forged;
  expect(engineVersion).toBe(JSON.parse(readFileSync(BUNDLE_META, 'utf8')).engineVersion);
  expect(Object.hasOwn(scriptTown, 'engineVersion'), 'the script stamped a transport key').toBe(false);
  return { scriptTown, forged: forgedTown };
}

afterAll(() => {
  vi.resetModules();
});

describe('the landing fixture town is born on the button\'s road', () => {
  it('(a) under the tree\'s own dials, the script\'s birth EQUALS the store\'s forge of the replayed { seed, config }, whole', async () => {
    const G = await graphUnder();
    const { scriptTown, forged } = await bothBirths(G);
    expect(scriptTown).toEqual(forged);
  }, LONG);

  it('(b) LIT: every GENERATION_LAWS row lit by its mint, the script\'s birth EQUALS the store\'s forge, whole', async () => {
    const rows = await lawRows();
    expect(rows.length, 'the law register is empty').toBeGreaterThan(0);
    for (const row of rows) {
      expect(Object.hasOwn(LIT_VERSION_OF, row.configKey),
        `GENERATION_LAWS row ${row.configKey} has no lit version in LIT_VERSION_OF: add it`).toBe(true);
    }
    const G = await graphUnder(rows);
    const { scriptTown, forged } = await bothBirths(G);
    // Anti-vacuity: the button's road really is lit on every law.
    for (const row of rows) {
      expect(forged.config?.[row.configKey], `${row.configKey} not lit on the button's road`)
        .toBe(LIT_VERSION_OF[row.configKey]);
    }
    expect(scriptTown).toEqual(forged);
    for (const row of rows) vi.doUnmock(`../../${row.module}`);
  }, LONG);
});
