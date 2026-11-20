/**
 * seatLawSavedTown.test.js — A SAVED TOWN KEEPS THE SEAT LAW IT WAS BORN UNDER, END TO END ON THE LIT BUILD
 * (SEAT-7's lane, brief `docs/chair/2026-11-20/content/seat/briefs/SAVED-SEAT.md`; tests only).
 *
 * ⭐ WHY THIS FILE. `seat/seatLaw.js :: resolveSeatLawVersion` reads the world's own config and never the dial, and its
 * property 3 is NO MIGRATION, DELIBERATELY. SEAT-6-TO-LIGHT §3 found the partial arms (bare objects, fixtures) and no
 * end-to-end one: the seat analogue of `tests/domain/livingContentLawWiring.test.js`'s describe "NO MIGRATION — a
 * law-1 world stays law-1 on every path, on the LIT build". This is that analogue, on a town the product really bore.
 *
 * ⭐ THE LIT BUILD, AND THE DARK ONE, ARE BOTH MOCKED (`build`). The seat's dial
 * (`seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION` and its mint) and the contest's dial
 * (`seatCircumstances.js :: SEAT_CONTEST_LIT`) are planted by mocking their own modules (the seam
 * `seatLawWiring.test.js :: boundaryWithLitSeatLaw` uses; the real readers kept), each read LIVE off one switch, so an
 * arm moves between the builds in ONE module registry. ⚠ THE FIRST CUT SWAPPED REGISTRIES (`vi.resetModules` per
 * build), and run beside other files it red its own guard once: a stale in-flight import refilled the fresh registry
 * with a dark module. A live switch has no registry to go stale. L1 only: every factor of `SEAT_CIRCUMSTANCE_TUNING`
 * stays 1 (never the PROPOSED figures). The dark build is mocked too, so a later flip of the product dial cannot make a
 * "born dark" town a lit one; every arm asserts the build it stands on, each time it moves (`build`).
 *
 * THE ARMS, in the brief's order:
 *   1. NO MIGRATION: a town born dark walks save/load, the store's load, section regen, the clone seam, a pulse power
 *      transfer and the roster's `government_change` on the lit build, and stays law 1 at every step; the negative
 *      control is the same transfer on the same town stamped 2, which keeps the civic form.
 *   2. THE CONVERSE: a town born lit keeps 2 through the same steps.
 *   3. THE BIRTH BY DESIGN: "Apply Saved Configuration & Regenerate" on a saved dark town's config is a BIRTH: lit.
 *   4. THE LEGACY EDGE (SEAT-6-TO-LIGHT §3, PLAUSIBLE there): a save with no `settlement.config`, regenerated while the
 *      form config holds a lit world's `_config`. MEASURED here.
 *   5. THE IMPORT: a gallery file and a reconciled export keep a carried `_seatLawVersion: 2`; a markerless one stays so.
 *
 * ⚠ THE "POWER SECTION" IS NOT A REGEN BRANCH. `store/settlementRegenAction.js :: regenSectionAction` regenerates
 * `npcs` and `history` and nothing else; `regenSection('power')` is driven below and MEASURED as a no-op on the power
 * structure, so the day a power branch lands this arm reds and asks to be extended.
 *
 * @enforced-by this test
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/** THE ONE SWITCH between the two builds, read live by the two mocked dial modules below. */
const dial = vi.hoisted(() => ({ lit: false }));

vi.mock('../../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve('gallery-save-1')),
    isConfigured: false,
  },
}));
// The seat's dial and its mint, planted (the real reader kept): lit, the seat law; dark, the default.
vi.mock('../../../src/domain/seat/seatLaw.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    get NEW_SETTLEMENT_SEAT_LAW_VERSION() {
      return dial.lit ? actual.HOLDER_SEAT_LAW_VERSION : actual.DEFAULT_SEAT_LAW_VERSION;
    },
    newSettlementSeatLaw: () => (dial.lit ? { [actual.SEAT_LAW_CONFIG_KEY]: actual.HOLDER_SEAT_LAW_VERSION } : {}),
  };
});
// The contest's dial, planted (the table kept: every factor 1, L1).
vi.mock('../../../src/domain/seat/seatCircumstances.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, get SEAT_CONTEST_LIT() { return dial.lit; } };
});

import * as seatLaw from '../../../src/domain/seat/seatLaw.js';
import * as circ from '../../../src/domain/seat/seatCircumstances.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import * as pipeline from '../../../src/generators/generateSettlementPipeline.js';
import { coupContenders } from '../../../src/domain/rulingPowerCoup.js';
import { holderOf } from '../../../src/domain/seat/holderOfSeat.js';
import { applyWorldPulseOutcomes } from '../../../src/domain/worldPulse/applyWorldPulse.js';
import { deepClone } from '../../../src/domain/clone.js';
import { createSettlementSlice } from '../../../src/store/settlementSlice.js';
import { createConfigSlice } from '../../../src/store/configSlice.js';
import { migrateSettlementConfig } from '../../../src/lib/settlementConfigMigration.js';
import { admitExistingCampaignImport, ingestSettlementForgeExport } from '../../../src/lib/importReconciliation.js';
import { ACCOUNT_EXPORT_VERSION } from '../../../src/lib/accountData.js';
import { expectPresentThenAbsent } from '../../helpers/anchoredNegatives.js';

// The create boundary's async edge, awaited as production awaits it on every module that can reach the pipeline.
await loadGenerationLawPayloads();

const KEY = '_seatLawVersion';
const LIVING_KEY = '_livingContentLawVersion';
const OWNER = { audience: 'owner' };
const NOW = '2026-11-20T00:00:00.000Z';

/** A town-size birth (COMMON: every born test carries a town-size case). */
const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});
/** Measured: this seed bears a Town Council whose Merchant Guilds hold the seat by R2 (the law's read), with a Craft
 *  Guilds the dark kind read calls merchant and the lit one craft: the lit contest reads it apart from the dark one. */
const SEED = 'saved-seat-12';
const FORM = 'Town Council';
const TAKER = 'Merchant Guilds';

// ── the two builds ─────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Put the graph on a build and prove it is that build (THE GUARD AT THE TOP OF EVERY ARM: a later flip of the product
 * dials cannot make an arm vacuous). Lit: the seat law minted at birth and the contest lit at L1. Dark: both defaults.
 * One module registry, no `vi.resetModules`: the mocked dials are read live, so no stale module can hold a build.
 * @param {boolean} lit
 */
function build(lit) {
  dial.lit = lit;
  expect(seatLaw.NEW_SETTLEMENT_SEAT_LAW_VERSION, `the ${lit ? 'LIT' : 'DARK'} build's seat dial`)
    .toBe(lit ? seatLaw.HOLDER_SEAT_LAW_VERSION : seatLaw.DEFAULT_SEAT_LAW_VERSION);
  expect(birthConfig({ ...CONFIG })[KEY], 'a birth on this build mints its dial').toBe(lit ? 2 : undefined);
  expect(circ.SEAT_CONTEST_LIT, 'the contest dial').toBe(lit);
  // L1, never LP: every factor of the table at 1.
  const factors = Object.values(circ.SEAT_CIRCUMSTANCE_TUNING.factors).flatMap((row) => Object.values(row));
  expect(factors.length).toBeGreaterThan(0);
  expect(factors.every((f) => f === 1), 'a factor of SEAT_CIRCUMSTANCE_TUNING is not 1 (that is LP, not L1)').toBe(true);
  // …and the real reader still reads the world, never the dial.
  expect(seatLaw.resolveSeatLawVersion({ ...CONFIG })).toBe(1);
}

/** Read `fn` on the DARK build, then return to the build the arm stands on (the dark build's reading). */
function onDark(fn) {
  const was = dial.lit;
  dial.lit = false;
  try { return fn(); } finally { dial.lit = was; }
}

afterEach(() => { dial.lit = false; });

/** The town as the current build bears it. */
const bear = (seed = SEED) => pipeline.generateSettlementPipeline(birthConfig({ ...CONFIG }), null, { seed });

/** The same world under another law: both config echoes stamped (or stripped, `v` null). */
function withLaw(s, v) {
  const bag = (b) => {
    if (!b || typeof b !== 'object') return b;
    const { [KEY]: _drop, ...rest } = b;
    return v == null ? rest : { ...rest, [KEY]: v };
  };
  return { ...s, config: bag(s.config), ...(s._config ? { _config: bag(s._config) } : {}) };
}

// ── the store ──────────────────────────────────────────────────────────────────────────────────────────────────

const stub = () => ({
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
});

/** The real config and settlement slices over a stub. */
const storeOf = () => create(immer((...a) => ({
  ...createConfigSlice(...a),
  ...stub(),
  ...createSettlementSlice(...a),
})));

/** `SettlementsPanel.jsx :: onLoad`'s two store hops, verbatim in order: the form config from the saved
 *  `settlement._config || config` through `migrateConfig`, then the settlement itself. */
function libraryLoad(store, data) {
  const raw = data.settlement?._config || data.config;
  if (raw) store.getState().updateConfig(migrateSettlementConfig(raw));
  if (data.settlement) store.getState().setSettlement(data.settlement);
}

// ── the world pulse ────────────────────────────────────────────────────────────────────────────────────────────

/** The world pulse's apply pass over ONE outcome on ONE settlement (`seatTransfer.test.js`'s harness). */
const pulse = (settlement, outcome) => applyWorldPulseOutcomes({
  snapshot: { regionalGraph: { edges: [], channels: [] }, settlements: [{ id: 's1', name: settlement.name, settlement }], campaign: {} },
  worldState: { stressors: [], npcStates: {}, proposals: [] },
  regionalGraph: { edges: [], channels: [] },
  settlementMap: new Map([['s1', { saveId: 's1', save: { name: settlement.name }, settlement }]]),
  outcomes: [outcome], tick: 4, now: NOW, advanceNewsTick: false, advanceRegionalImpacts: false,
});
const settledOf = (r) => r.settlementUpdates.find((e) => e.saveId === 's1').settlement;

/** (i) the power-transfer outcome (`applyWorldPulse.js`, the shape `worldPulse/coup.js` writes), a coup. */
const POWER_TRANSFER = Object.freeze({
  id: 'coup.saved', type: 'power_transfer', candidateType: 'coup_succeeded', applyMode: 'auto', targetSaveId: 's1', severity: 0.6,
  headline: `${TAKER} seizes power`, summary: 'The seat fell.', reasons: [],
  powerTransfer: { toPowerName: TAKER, cause: 'coup', tick: 4, losers: [] },
});
/** (ii) the roster's `government_change` (`applyWorldPulseFactionRoster.js :: applyFactionPayloadEffect`). */
const GOVERNMENT_CHANGE = Object.freeze({
  id: 'faction.gov', type: 'faction', candidateType: 'faction_government_change', applyMode: 'auto', targetSaveId: 's1', severity: 0.6,
  headline: `${TAKER} take the seat`, summary: 'SAVED-SEAT fixture: government_change.', reasons: [],
  proposalPayload: { kind: 'government_change', settlementId: 's1', factionId: 's1:merchant_guilds' },
  metadata: { factionName: TAKER },
});

const names = (c) => c.challengers.map((x) => x.name);

// ── the walk both law arms take ────────────────────────────────────────────────────────────────────────────────

/**
 * Walk a born town through every hop a saved town makes on the current build: a save and a load (JSON), the store's
 * load (`hydrateFromSave`) under an adversarial form config, `regenSection` of npcs, history and 'power', the clone
 * seam, then the two transfers off the clone. Returns every world met, labelled, with the two transfer results.
 */
async function walk(born, formConfig) {
  /** @type {Array<[string, any]>} */
  const met = [['born', born]];
  const saved = JSON.parse(JSON.stringify(born));
  met.push(['saved and loaded (JSON)', saved]);

  const store = storeOf();
  store.setState({ config: { ...formConfig } });
  store.getState().hydrateFromSave({ id: 'save-1', settlement: saved, campaignState: { phase: 'draft', eventLog: [] } });
  const loaded = store.getState().settlement;
  expect(loaded, 'hydrateFromSave installed nothing').toBeTruthy();
  met.push(['the store\'s load (hydrateFromSave)', loaded]);

  const npcsBefore = JSON.stringify(loaded.npcs);
  await store.getState().regenSection('npcs');
  const afterNpcs = store.getState().settlement;
  // THE POSITIVE CONTROL: the regen really ran, so an absence after it is an absence after a live operation.
  expect(JSON.stringify(afterNpcs.npcs), 'regenSection("npcs") changed nothing').not.toBe(npcsBefore);
  met.push(['regenSection("npcs")', afterNpcs]);

  const historyBefore = JSON.stringify(afterNpcs.history);
  await store.getState().regenSection('history');
  const afterHistory = store.getState().settlement;
  expect(JSON.stringify(afterHistory.history), 'regenSection("history") changed nothing').not.toBe(historyBefore);
  met.push(['regenSection("history")', afterHistory]);

  // MEASURED: no 'power' branch exists, so the power structure is untouched byte for byte.
  const powerBefore = JSON.stringify(afterHistory.powerStructure);
  await store.getState().regenSection('power');
  const afterPower = store.getState().settlement;
  expect(
    JSON.stringify(afterPower.powerStructure),
    'regenSection("power") moved the power structure: a power branch landed, so extend this walk to it',
  ).toBe(powerBefore);
  met.push(['regenSection("power")', afterPower]);

  const cloned = deepClone(afterPower);
  expect(cloned).toEqual(afterPower);
  met.push(['the clone seam (deepClone)', cloned]);

  const transferred = settledOf(pulse(cloned, POWER_TRANSFER));
  met.push(['the pulse power transfer', transferred]);
  const changed = settledOf(pulse(cloned, GOVERNMENT_CHANGE));
  met.push(['the roster\'s government_change', changed]);
  return { met, cloned, transferred, changed };
}

describe('SAVED-SEAT — a saved town keeps the seat law it was born under, on the LIT build', () => {
  // ── 1. NO MIGRATION ─────────────────────────────────────────────────────────────────────────────────────────

  it('1. ⛔ NO MIGRATION: a town born DARK stays law 1 through save, load, regen, clone and both transfers on the LIT build', async () => {
    build(false);
    const born = bear();
    expect(Object.hasOwn(born.config, KEY), 'the dark birth minted the seat law').toBe(false);
    expect(born._config && Object.hasOwn(born._config, KEY), 'the dark birth\'s _config carries the seat law').toBeFalsy();
    expect(born.powerStructure.government, 'the fixture is no longer a Town Council (re-measure the seed)').toBe(FORM);

    build(true);
    // The holder the LAW would read (R2: the engine's own read), and the field it would leave: the anchor that makes
    // "the holder still contends" a live claim, and the proof the lit build reads a law-2 town apart from the dark one.
    expect(holderOf(withLaw(born, 2), OWNER).holderName).toBe(TAKER);
    // Under the law the holder leaves the field it stands in on the dark build (anchored: present before, gone after).
    expectPresentThenAbsent(names(onDark(() => coupContenders(born))), names(coupContenders(withLaw(born, 2))), TAKER, 'the law-2 field');
    expect(coupContenders(withLaw(born, 2)), 'the lit law reads this town as the dark build does: no control')
      .not.toEqual(onDark(() => coupContenders(born)));

    // Adversarial: the form config IS lit, so a read of the form config or the dial would stamp the town.
    const { met, cloned, transferred, changed } = await walk(born, { ...CONFIG, [KEY]: 2 });
    for (const [label, world] of met) {
      for (const echo of ['config', '_config']) {
        expect(
          world[echo] && Object.hasOwn(world[echo], KEY),
          `${label}: ${echo} acquired _seatLawVersion on the lit build. There is NO MIGRATION, deliberately.`,
        ).toBeFalsy();
      }
      expect(seatLaw.resolveSeatLawVersion(world), `${label}: resolveSeatLawVersion`).toBe(1);
      expect(seatLaw.seatsByHolder(world), `${label}: seatsByHolder`).toBe(false);
      expect(coupContenders(world), `${label}: coupContenders on the lit build is not the dark build's reading`)
        .toEqual(onDark(() => coupContenders(world)));
    }
    // The holder still contends, today's kind read, on every world before a transfer.
    for (const [label, world] of met.slice(0, -2)) {
      expect(names(coupContenders(world)), `${label}: the holder left the field`).toContain(TAKER);
    }

    // THE TRANSFER TAKES TODAY'S PATH: byte for byte the dark build's, the civic form renamed.
    for (const outcome of [POWER_TRANSFER, GOVERNMENT_CHANGE]) {
      expect(JSON.stringify(pulse(cloned, outcome)), outcome.id).toBe(JSON.stringify(onDark(() => pulse(cloned, outcome))));
    }
    for (const [label, world] of [['pulse transfer', transferred], ['government_change', changed]]) {
      expect(world.powerStructure.government, `${label}: the old law renames`).not.toBe(FORM);
      expect(world.powerStructure.previousGovernments?.at(-1)?.label, label).toBe(FORM);
    }

    // ⛔ THE NEGATIVE CONTROL: the same transfers on the same town stamped 2 KEEP the civic form.
    const stamped = withLaw(cloned, 2);
    for (const [label, outcome] of [['pulse transfer', POWER_TRANSFER], ['government_change', GOVERNMENT_CHANGE]]) {
      const kept = settledOf(pulse(stamped, outcome));
      expect(kept.powerStructure.government, `${label}: the law keeps the civic form`).toBe(FORM);
      expect(holderOf(kept, OWNER).holderName, label).toBe(TAKER);
    }
  });

  // ── 2. THE CONVERSE ─────────────────────────────────────────────────────────────────────────────────────────

  it('2. THE CONVERSE: a town born LIT keeps _seatLawVersion 2 through the same steps; no step strips it or reads it dark', async () => {
    build(true);
    const born = bear();
    expect(born.config[KEY], 'the lit birth did not mint the seat law').toBe(2);
    expect(born._config?.[KEY], 'the lit birth\'s _config echo').toBe(2);
    expect(born.powerStructure.government).toBe(FORM);

    // Adversarial the other way: the form config is DARK.
    const { met, cloned, transferred, changed } = await walk(born, { ...CONFIG });
    for (const [label, world] of met) {
      expect(world.config?.[KEY], `${label}: config lost _seatLawVersion`).toBe(2);
      if (world._config) expect(world._config[KEY], `${label}: _config lost _seatLawVersion`).toBe(2);
      expect(seatLaw.resolveSeatLawVersion(world), `${label}: resolveSeatLawVersion`).toBe(2);
      expect(seatLaw.seatsByHolder(world), `${label}: seatsByHolder`).toBe(true);
      // It reads LIT: the lit contest of this world is not the dark build's reading of the same world unmarked.
      expect(coupContenders(world), `${label}: the town reads dark`)
        .not.toEqual(onDark(() => coupContenders(withLaw(world, null))));
    }
    for (const [label, world] of met.slice(0, -2)) {
      // The holder is in the dark build's field of the unmarked world and leaves the lit field of the marked one.
      expectPresentThenAbsent(names(onDark(() => coupContenders(withLaw(world, null)))), names(coupContenders(world)), TAKER, `${label}: the holder contends its own seat`);
    }
    // Both transfers take the law's path: the civic form kept, the taker holding it.
    for (const [label, world] of [['pulse transfer', transferred], ['government_change', changed]]) {
      expect(world.powerStructure.government, `${label}: the law keeps the civic form`).toBe(FORM);
      expect(holderOf(world, OWNER).holderName, label).toBe(TAKER);
    }
    expect(cloned.config[KEY]).toBe(2);
  });

  // ── 3. THE BIRTH BY DESIGN ──────────────────────────────────────────────────────────────────────────────────

  it('3. "Apply Saved Configuration & Regenerate" on a saved DARK town is a BIRTH, not a migration: born lit on the LIT build', async () => {
    build(false);
    const savedDark = JSON.parse(JSON.stringify(bear()));
    expect(Object.hasOwn(savedDark.config, KEY)).toBe(false);
    expect(Object.hasOwn(savedDark._config, KEY)).toBe(false);
    const untouched = JSON.stringify(savedDark);

    build(true);
    for (const [label, incoming] of [['markerless', undefined], ['an incoming 1', 1], ['an incoming unshipped 3', 3]]) {
      const data = {
        settlement: incoming === undefined ? JSON.parse(untouched) : withLaw(JSON.parse(untouched), incoming),
        config: savedDark.config,
      };
      const store = storeOf();
      libraryLoad(store, data);
      // The hop really carried the saved config's marker (or its absence) into the form.
      expect(store.getState().config[KEY], `${label}: the form config after the Library load`).toBe(incoming);
      expect(store.getState().settlement, `${label}: setSettlement`).toBe(data.settlement);

      const reborn = await store.getState().generateSettlement(SEED);
      expect(reborn, `${label}: the regenerate produced no world`).toBeTruthy();
      expect(reborn.config[KEY], `${label}: a BIRTH on the lit build is born under the seat law`).toBe(2);
      expect(reborn._config?.[KEY], `${label}: the birth's _config echo`).toBe(2);
      expect(seatLaw.seatsByHolder(reborn)).toBe(true);
      // The birth wrote its law on the NEW world only: the form config keeps what the load put there.
      expect(store.getState().config[KEY], `${label}: the birth wrote back to the form`).toBe(incoming);
    }
    // …and the saved town itself is not migrated: its bytes are what they were.
    expect(JSON.stringify(savedDark)).toBe(untouched);
  });

  // ── 4. THE LEGACY EDGE ──────────────────────────────────────────────────────────────────────────────────────

  it('4. THE LEGACY EDGE (measured): a save with no settlement.config regenerated under a lit world\'s form config stays law 1', async () => {
    build(false);
    const dark = JSON.parse(JSON.stringify(bear()));
    build(true);
    const litWorld = JSON.parse(JSON.stringify(bear('saved-seat-lit-first')));
    expect(litWorld._config[KEY]).toBe(2);

    const { config: _resolved, ...noConfig } = dark;
    const { _config: _authoring, ...neither } = noConfig;
    for (const [label, legacy] of [['no config, no _config', neither], ['no config, a markerless _config', noConfig]]) {
      expect(Object.hasOwn(legacy, 'config'), label).toBe(false);
      expect(seatLaw.resolveSeatLawVersion(legacy), `${label}: before`).toBe(1);

      const store = storeOf();
      // A lit town loaded FIRST, through the Library (its `_config` becomes the form config)…
      libraryLoad(store, { settlement: litWorld, config: litWorld.config });
      // …then the legacy save opened over it, and regenerated.
      store.getState().hydrateFromSave({ id: 'legacy-1', settlement: JSON.parse(JSON.stringify(legacy)), campaignState: { phase: 'draft', eventLog: [] } });
      const formAtRegen = store.getState().config;
      const npcsBefore = JSON.stringify(store.getState().settlement.npcs);
      await store.getState().regenSection('npcs');
      await store.getState().regenSection('history');
      const after = store.getState().settlement;
      expect(JSON.stringify(after.npcs), `${label}: the regen did not run`).not.toBe(npcsBefore);

      // THE PRECONDITION SEAT-6 named, measured: the regen's fallback config (`settlement.config || config`) IS lit.
      expect(formAtRegen[KEY], `${label}: the form config is not lit; the edge is not reached`).toBe(2);
      // THE MEASURE: the town did not acquire the law, and reads 1.
      expect(Object.hasOwn(after, 'config'), `${label}: the regen wrote a config onto the legacy town`).toBe(false);
      if (after._config) expect(Object.hasOwn(after._config, KEY), `${label}: _config`).toBe(false);
      expect(seatLaw.resolveSeatLawVersion(after), `${label}: the legacy town reads the seat law LIT — a FINDING`).toBe(1);
      expect(coupContenders(after), `${label}: coupContenders`).toEqual(onDark(() => coupContenders(after)));

      // …and the marker in the fallback config moves not one regenerated byte. The store's regen rolls a fresh seed
      // per call, so the comparison drives the same two passes it calls (`regenNPCsPipeline`, `regenHistoryPipeline`)
      // on one fixed seed, with the fallback config as the store held it and with the seat marker stripped from it.
      const unmarked = withLaw({ config: formAtRegen }, null).config;
      expect(Object.hasOwn(unmarked, KEY)).toBe(false);
      for (const pass of ['regenNPCsPipeline', 'regenHistoryPipeline']) {
        const read = (cfg) => JSON.stringify(pipeline[pass](JSON.parse(JSON.stringify(legacy)), cfg, { seed: 'saved-seat-legacy' }));
        expect(read(formAtRegen), `${label}: the seat marker in the fallback config moved ${pass}`).toBe(read(unmarked));
      }
    }
  });

  // ── 5. THE IMPORT ───────────────────────────────────────────────────────────────────────────────────────────

  it('5. THE IMPORT: a gallery file and a reconciled export carrying _seatLawVersion 2 keep it; a markerless one stays markerless', async () => {
    build(false);
    const darkTown = JSON.parse(JSON.stringify(bear()));
    build(true);
    const litTown = JSON.parse(JSON.stringify(bear()));
    expect(litTown.config[KEY]).toBe(2);
    expect(litTown.config[LIVING_KEY], 'the living-content marker the scrubs DO drop rides the file').toBe(2);
    expect(Object.hasOwn(darkTown.config, KEY)).toBe(false);

    // ── the gallery path, the real body (`galleryImportSettlement.js :: importGallerySettlementImpl`), its network door
    // (`gallery.js :: fetchDossierForImport`'s RPC) answered here; the client strip and the veil run for real ──
    const rows = {
      'lit-town': { id: 'd-lit', name: 'Lit Town', tier: 'town', data: litTown },
      'dark-town': { id: 'd-dark', name: 'Dark Town', tier: 'town', data: darkTown },
    };
    vi.doMock('../../../src/lib/supabase.js', () => ({
      supabase: { rpc: vi.fn(async (_name, args) => ({ data: [rows[args.dossier_slug]], error: null })) },
      isConfigured: true,
      setSessionPersistence: () => {},
      hasActiveRecoveryFlow: () => false,
      consumeRecoveryFlow: () => null,
    }));
    vi.resetModules();
    try {
      const { importGallerySettlementImpl } = await import('../../../src/store/galleryImportSettlement.js');
      const state = { auth: { user: { id: 'u-1' }, tier: 'premium' }, maxSaves: () => 50, savedSettlements: [] };
      const get = () => state;
      const set = (recipe) => { recipe(state); };
      await importGallerySettlementImpl(get, set, 'lit-town');
      await importGallerySettlementImpl(get, set, 'dark-town');
      const [litImported, darkImported] = state.savedSettlements.map((e) => e.settlement);
      // ANCHOR: the scrub really ran on this path: the living-content marker is gone off the same config.
      expect(Object.hasOwn(litImported.config, LIVING_KEY), 'the gallery scrub did not run').toBe(false);
      expect(litImported.config[KEY], 'the gallery import dropped a carried _seatLawVersion 2').toBe(2);
      expect(seatLaw.seatsByHolder(litImported)).toBe(true);
      expect(Object.hasOwn(darkImported.config, KEY), 'the gallery import stamped a markerless town').toBe(false);
      expect(seatLaw.resolveSeatLawVersion(darkImported)).toBe(1);
    } finally {
      vi.doUnmock('../../../src/lib/supabase.js');
      vi.resetModules();
    }

    // ── the reconciliation admission (`importReconciliationAdmission.js :: admitExistingCampaignImport`) ──
    const text = JSON.stringify({
      version: ACCOUNT_EXPORT_VERSION,
      campaigns: [],
      settlements: [
        { id: 's-lit', name: 'Lit Town', tier: 'town', settlement: litTown },
        { id: 's-dark', name: 'Dark Town', tier: 'town', settlement: darkTown },
      ],
    });
    const ingest = ingestSettlementForgeExport(text, {
      label: 'saved-seat.sf.json', ingestedAt: NOW, storageRef: 'local-file:saved-seat.sf.json',
    });
    expect(ingest.ok).toBe(true);
    const admitted = await admitExistingCampaignImport(ingest.value, {
      targetCampaign: { id: 'target-campaign', name: 'Current campaign', settlementIds: [] },
      existingSettlements: [],
      existingCampaigns: [],
    });
    expect(admitted.ok).toBe(true);
    const [litAdmitted, darkAdmitted] = admitted.value.proposals.map((p) => p.normalizedInput.settlement);
    for (const echo of ['config', '_config']) {
      expect(Object.hasOwn(litAdmitted[echo], LIVING_KEY), `admission ${echo}: the strip did not run`).toBe(false);
      expect(litAdmitted[echo][KEY], `admission ${echo}: a carried _seatLawVersion 2 was dropped`).toBe(2);
      expect(Object.hasOwn(darkAdmitted[echo], KEY), `admission ${echo}: a markerless town was stamped`).toBe(false);
    }
    expect(seatLaw.seatsByHolder(litAdmitted)).toBe(true);
    expect(seatLaw.resolveSeatLawVersion(darkAdmitted)).toBe(1);
  });
});
