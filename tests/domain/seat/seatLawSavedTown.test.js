/**
 * seatLawSavedTown.test.js — A SAVED TOWN KEEPS THE SEAT LAW IT WAS BORN UNDER, END TO END ON THE LIT BUILD
 * (SEAT-7's lane, brief `docs/chair/2026-11-20/content/seat/briefs/SAVED-SEAT.md`; tests only).
 *
 * ⭐ WHAT THIS FILE HOLDS SINCE THE JOIN (CLOSE-1 unit 3, the chair's E61 (4)): THE SEAT LAW'S OWN ARMS, AND ONLY
 * THOSE. The arms every generation law shares moved to `tests/domain/generationLawsSavedPlace.test.js`, which walks
 * every row of `GENERATION_LAWS` at once with every dial lit: NO MIGRATION through save, load, section regen, the clone
 * seam, the tick re-derive and the import (this file's old arms 1, 5 and 6) is its (a); THE CONVERSE (old 2) its (b);
 * "Apply Saved Configuration & Regenerate" is a BIRTH (old 3) its (d); THE LEGACY EDGE (old 4) its (e). What stays is
 * what only the seat law has: THE TWO TRANSFERS (a pulse power transfer and the roster's `government_change`) on a
 * saved town, under law 1 and under law 2.
 *
 * ⭐ WHY. `seat/seatLaw.js :: resolveSeatLawVersion` reads the world's own config and never the dial, and its property 3
 * is NO MIGRATION, DELIBERATELY; a transfer is where the two laws part on the record (law 1 renames the civic form, the
 * law keeps it and seats the taker), so a saved town's transfer must take the path of the law it was born under.
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
 * THE ARMS (the seat law's own):
 *   1. THE TRANSFERS UNDER LAW 1: a town born dark, walked through save/load, the store's load, section regen and the
 *      clone seam on the lit build, takes today's path at both transfers (byte for byte the dark build's, the civic
 *      form renamed); the negative control is the same transfers on the same town stamped 2, which keep the civic form.
 *   2. THE TRANSFERS UNDER LAW 2: a town born lit, walked the same way, takes the law's path at both: the civic form
 *      kept, the taker holding the seat.
 *
 * ⚠ THE "POWER SECTION" IS NOT A REGEN BRANCH. `store/settlementRegenAction.js :: regenSectionAction` regenerates
 * `npcs` and `history` and nothing else; `regenSection('power')` is driven below and MEASURED as a no-op on the power
 * structure, so the day a power branch lands this walk reds and asks to be extended.
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
import { expectPresentThenAbsent } from '../../helpers/anchoredNegatives.js';

// The create boundary's async edge, awaited as production awaits it on every module that can reach the pipeline.
await loadGenerationLawPayloads();

const KEY = '_seatLawVersion';
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

describe('SAVED-SEAT — the seat law\'s own arms on a saved town: the two transfers, on the LIT build', () => {
  // ── 1. THE TRANSFERS UNDER LAW 1 ────────────────────────────────────────────────────────────────────────────

  it('1. THE SEAT LAW\'S OWN — the transfers under law 1: on a saved town born DARK, both transfers on the LIT build take today\'s path and rename the civic form; stamped 2, they keep it', async () => {
    build(false);
    const born = bear();
    expect(Object.hasOwn(born.config, KEY), 'the dark birth minted the seat law').toBe(false);
    expect(born._config && Object.hasOwn(born._config, KEY), 'the dark birth\'s _config carries the seat law').toBeFalsy();
    expect(born.powerStructure.government, 'the fixture is no longer a Town Council (re-measure the seed)').toBe(FORM);

    build(true);
    // The holder the LAW would read (R2: the engine's own read), and the field it would leave: the anchor that makes
    // the negative control below a live claim, and the proof the lit build reads a law-2 town apart from the dark one.
    expect(holderOf(withLaw(born, 2), OWNER).holderName).toBe(TAKER);
    // Under the law the holder leaves the field it stands in on the dark build (anchored: present before, gone after).
    expectPresentThenAbsent(names(onDark(() => coupContenders(born))), names(coupContenders(withLaw(born, 2))), TAKER, 'the law-2 field');

    // Adversarial: the form config IS lit, so a read of the form config or the dial would stamp the town.
    const { cloned, transferred, changed } = await walk(born, { ...CONFIG, [KEY]: 2 });
    expect(seatLaw.resolveSeatLawVersion(cloned), 'the walked town is not law 1 (generationLawsSavedPlace (a) says why)').toBe(1);

    // THE TRANSFER TAKES TODAY'S PATH: byte for byte the dark build's, the civic form renamed.
    for (const outcome of [POWER_TRANSFER, GOVERNMENT_CHANGE]) {
      expect(JSON.stringify(pulse(cloned, outcome)), outcome.id).toBe(JSON.stringify(onDark(() => pulse(cloned, outcome))));
    }
    for (const [label, world] of [['pulse transfer', transferred], ['government_change', changed]]) {
      expect(Object.hasOwn(world.config, KEY), `${label}: the transfer stamped the seat law`).toBe(false);
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

  // ── 2. THE TRANSFERS UNDER LAW 2 ────────────────────────────────────────────────────────────────────────────

  it('2. THE SEAT LAW\'S OWN — the transfers under law 2: on a saved town born LIT, both transfers take the law\'s path: the civic form kept, the taker holding the seat', async () => {
    build(true);
    const born = bear();
    expect(born.config[KEY], 'the lit birth did not mint the seat law').toBe(2);
    expect(born.powerStructure.government).toBe(FORM);

    // Adversarial the other way: the form config is DARK.
    const { cloned, transferred, changed } = await walk(born, { ...CONFIG });
    expect(cloned.config[KEY], 'the walked town lost the seat law (generationLawsSavedPlace (b) says why)').toBe(2);
    for (const [label, world] of [['pulse transfer', transferred], ['government_change', changed]]) {
      expect(world.config[KEY], `${label}: the transfer stripped the seat law`).toBe(2);
      expect(world.powerStructure.government, `${label}: the law keeps the civic form`).toBe(FORM);
      expect(holderOf(world, OWNER).holderName, label).toBe(TAKER);
    }
  });
});
