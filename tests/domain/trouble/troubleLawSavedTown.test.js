/**
 * troubleLawSavedTown.test.js — A SAVED PLACE KEEPS THE TROUBLE LAW IT WAS BORN UNDER, PROVED END TO
 * END ON THE LIT BUILD (lane KINDS-1, unit K2; tests only).
 *
 * ⭐ WHY. `troubleLaw.js` property 3 says NO MIGRATION, DELIBERATELY: a world born before the light
 * never changes. The reader (`resolveTroubleLawVersion`) never reads the dial, and
 * `troubleLawWiring.test.js` arm 5 executes that on hand-built bags; this file carries a REAL saved
 * place through the hops a saved place makes with the dial lit. It is the fortune lane's saved-town
 * proof (`tests/domain/fortuneLawSavedTown.test.js` on `lane/fortune-4-2026-11-20`), arm for arm,
 * for the trouble law, so the two can fold into one test over `GENERATION_LAWS` at the join.
 *
 * ⭐ TWO BUILDS IN ONE FILE, BOTH BY THE WIRING FILE'S SEAM. The trouble law's module is replaced
 * through `vi.doMock` with its real reader kept and only the dial and the mint set, and the generation
 * graph is re-imported under it: once DARK (the dial at the default) and once LIT
 * (`NEW_SETTLEMENT_TROUBLE_LAW_VERSION = WEIGHTED_TROUBLE_LAW_VERSION`, so a birth mints 2). Neither
 * half reads the product's dial, so the flip cannot make either half vacuous, and every arm opens by
 * asserting the build it runs on IS lit. Every lazy hop of the DARK graph (the store's lanes) is taken
 * BEFORE the light comes on: after it, a lazy import resolves lit.
 *
 * "KEEPS LAW 1" means, at every step: the config (and its `_config` echo) carries no
 * `_troubleLawVersion`; `resolveTroubleLawVersion` reads 1; and `history.currentTensions` (types, in
 * order) equal the dark build's same step. The place is the visitor's city `visitor-city-3` (K0's
 * pool), whose tensions the law WOULD move (arm 0 computes both lists), so "equal" can fail.
 *
 * ⚠ THE ONE STEP THAT RE-ROLLS HISTORY ITSELF is `regenSection('history')`: it mints a fresh seed
 * (`regenHistoryPipeline` with no seed; the store keeps it at the root as `_regenSeed`), so its tensions
 * cannot equal another run's. There the claim is that it re-rolls UNDER LAW 1: the same prior world,
 * config and `_regenSeed` re-rolled on the DARK build gives the same tensions. So that this can fail,
 * the step is repeated until its own seed is one the law moves (law 1 and law 2 re-roll different
 * tensions from it), a bounded control. The history regen keys its pass to the RECORD's law
 * (`troubleLaw.js :: withRecordTroubleLaw`), so law 2's re-roll is the place given a config carrying 2,
 * and THE LEGACY EDGE is cured in both shapes: a save with no `config` (with or without `_config`)
 * re-rolls under its own law, law 1, whatever the form holds (arm 5).
 *
 * ⚠ `regenSection` HAS NO POWER AND NO ECONOMY BRANCH ("any other value regenerates nothing"); both are
 * driven and pinned as the no-ops they are, beside the two live branches with a positive control.
 *
 * THE CHAIR'S RULE OF 22:01 UTC: no stored digest of a whole birth; every "equal" below is a
 * differential computed in this file; no arm pins what a NEW place is born with on the product's dial.
 *
 * @enforced-by this test
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

const LAW = '../../../src/domain/trouble/troubleLaw.js';
const KEY = '_troubleLawVersion';
const LIVING_KEY = '_livingContentLawVersion';

/** K0's visitor pool: a city whose tensions the trouble law WOULD move. */
const SIZE = 'city';
const SEED = 'visitor-city-3';
const NOW = '2026-11-20T23:00:00.000Z';
const TICK_REF = 'world_pulse.trouble-saved-town.1';
const LONG = 180_000;
/** The bound on re-rolling history until its seed is one the law moves. */
const HISTORY_TRIES = 24;

/**
 * The generation graph re-imported under a trouble dial set to `version`: the wiring file's seam
 * (`troubleLawWiring.test.js :: boundaryWithLitTroubleLaw`), with the real reader kept.
 * @param {number} version
 */
async function buildUnder(version) {
  vi.resetModules();
  vi.doMock(LAW, async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NEW_SETTLEMENT_TROUBLE_LAW_VERSION: version,
      newSettlementTroubleLaw: () => (version === actual.DEFAULT_TROUBLE_LAW_VERSION
        ? {}
        : { [actual.TROUBLE_LAW_CONFIG_KEY]: version }),
    };
  });
  const law = await import('../../../src/domain/trouble/troubleLaw.js');
  const boundary = await import('../../../src/domain/density/densityCreateBoundary.js');
  const pipeline = await import('../../../src/generators/generateSettlementPipeline.js');
  const settlementSlice = await import('../../../src/store/settlementSlice.js');
  const configSlice = await import('../../../src/store/configSlice.js');
  const edit = await import('../../../src/store/editSlice.js');
  const decreeHook = await import('../../../src/domain/worldPulse/decreeHook.js');
  const pools = await import('../../../src/domain/edit/pools.js');
  const clone = await import('../../../src/domain/clone.js');
  const time = await import('../../../src/domain/timeProgression.js');
  const migration = await import('../../../src/lib/settlementConfigMigration.js');
  const scrub = await import('../../../src/lib/importScrub.js');
  const vocab = await import('../../../src/domain/construct/configVocabulary.js');
  const localPipeline = await import('../../../src/lib/localPipeline.js');
  await boundary.loadGenerationLawPayloads();
  return {
    law, boundary, pipeline, settlementSlice, configSlice, edit, decreeHook, pools, clone, time,
    migration, scrub, vocab, localPipeline,
  };
}

/** The visitor's config (K0's `measure-kinds.mjs :: visitorJob`), from graph `G`'s own defaults. */
function visitorConfig(G) {
  return {
    ...G.configSlice.DEFAULT_CONFIG,
    settType: SIZE,
    _institutionToggles: {},
    _categoryToggles: {},
    _goodsToggles: {},
    _servicesToggles: {},
    _randomizePriorities: true,
  };
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
});

/** A store with the REAL config and settlement slices of graph `G`. */
function storeOf(G) {
  return create(immer((...a) => ({
    ...stubSlice(),
    ...G.configSlice.createConfigSlice(...a),
    ...G.settlementSlice.createSettlementSlice(...a),
  })));
}

/** A library row as the product saves one: the row's `config` is the place's `_config`. */
function rowOf(world, id) {
  return {
    id,
    name: world.name,
    tier: world.tier,
    config: world._config,
    settlement: world,
    campaignState: { phase: 'draft', eventLog: [], systemState: null, editedAt: null },
    timestamp: '2026-11-01T00:00:00.000Z',
  };
}

/** The law a world (or a bare config) carries, read by the real reader of graph `G`. */
function lawOf(G, worldOrConfig) {
  const isWorld = Object.hasOwn(worldOrConfig, 'name') || Object.hasOwn(worldOrConfig, '_config');
  const config = isWorld ? worldOrConfig.config : worldOrConfig;
  const echo = isWorld ? worldOrConfig._config : undefined;
  return {
    config: config && Object.hasOwn(config, KEY) ? config[KEY] : 'absent',
    echo: echo && Object.hasOwn(echo, KEY) ? echo[KEY] : 'absent',
    reads: G.law.resolveTroubleLawVersion(worldOrConfig),
  };
}

/** The troubles: `history.currentTensions` types, in order (the field the law moves). */
function tensionsOf(world) {
  return (world?.history?.currentTensions || []).map((tension) => tension.type);
}

/** A copy of `world` carrying the marker `version` on its config, its `_config` echo and nothing else. */
function stamped(world, version) {
  const copy = structuredClone(world);
  copy.config[KEY] = version;
  copy._config[KEY] = version;
  return copy;
}

/** A store hydrated from `row` as opening a library save, with `formConfig` as the wizard's config. */
function openSave(G, row, formConfig) {
  const store = storeOf(G);
  store.setState((state) => {
    state.savedSettlements = [structuredClone(row)];
    state.config = structuredClone(formConfig);
  });
  store.getState().hydrateFromSave(structuredClone(row));
  return store;
}

/** The config `regenSection` reads (`settlementRegenAction.js`: `settlement.config || settlement._config || config`). */
function regenConfigOf(store) {
  const { settlement, config } = store.getState();
  return settlement.config || settlement._config || config;
}

/**
 * THE HISTORY RE-ROLL, through the store's real `regenSection('history')`, repeated (bounded) until
 * the seed it minted is one the law moves when `lawMoves` is given. Returns the prior world, the
 * config the step read, the re-rolled world and its seed.
 */
async function regenHistory(store, lawMoves) {
  for (let attempt = 1; attempt <= HISTORY_TRIES; attempt += 1) {
    const prior = structuredClone(store.getState().settlement);
    const cfg = structuredClone(regenConfigOf(store));
    await store.getState().regenSection('history');
    const after = store.getState().settlement;
    const seed = after._regenSeed;
    if (!lawMoves || lawMoves(prior, cfg, seed)) return { prior, cfg, after, seed, attempts: attempt };
  }
  throw new Error(`no history re-roll in ${HISTORY_TRIES} drew a seed the trouble law moves`);
}

/**
 * THE EDIT RE-DERIVE, through the real parts: an add-decree is staged, EM-E1's tick marks it applied,
 * and the store's tick half re-derives the world through `storedConfigFor` and
 * `settlementRederiveAction.js :: regenerateWithLayer` (the fortune file's route).
 */
async function rederiveByTick(G, store, name) {
  const saveId = String(store.getState().activeSaveId);
  const world = store.getState().settlement;
  const pools = Object.fromEntries(G.edit.addOpPayloadFor('npc')
    .filter((row) => typeof row.pool === 'string')
    .map((row) => [row.pool, G.pools.poolValues(row.pool, world)]));
  const staged = G.edit.stageAddDecreeIntent(store.getState, store.setState, {
    cardType: 'npc',
    values: { name, role: G.pools.poolValues('npc.role', world)[0] },
    pools,
    orderedAt: NOW,
  });
  const save = { id: saveId, settlement: { decrees: G.edit.selectDecrees(store.getState()) } };
  const applied = G.decreeHook.applyDecreesToSaves({ tick: 1 }, [save], TICK_REF, { now: NOW });
  store.setState((state) => {
    state.settlement.decrees = applied.saves[0].settlement.decrees;
  });
  const receipt = await G.edit.applyRosterDecreesAtTick(store.getState, store.setState, { saveId });
  const after = store.getState().settlement;
  return {
    staged: staged.ok === true,
    rederived: receipt.rederived === true,
    newcomer: (after.npcs || []).some((npc) => npc.id === staged.decreeId),
    world: after,
  };
}

/** Three months of play under a condition. */
function playThreeMonths(G, world) {
  let current = world;
  let tickState = null;
  for (let month = 0; month < 3; month += 1) {
    const step = G.time.advanceTime(current, {
      interval: 'one_month', activeConditions: ['plague'], previousTickState: tickState,
    });
    current = step.newSettlement;
    tickState = step.nextTickState;
  }
  return current;
}

/** The label of the one step that re-rolls history itself. */
const HISTORY_STEP = 'regenSection(history)';

/**
 * THE WALK: a saved row through every hop of arm 1 (and arm 2) on graph `G`. Returns each step's
 * world (or config) by label, in order, the history re-roll's parts, and each live step's control.
 */
async function walk(G, row, formConfig, lawMoves) {
  /** @type {Array<[string, any]>} */
  const steps = [];
  const saved = JSON.parse(JSON.stringify(row));
  steps.push(['save and load (JSON)', saved.settlement]);
  steps.push(['load: migrateSettlementConfig(row.config)', G.migration.migrateSettlementConfig(saved.config)]);
  const store = openSave(G, saved, formConfig);
  steps.push(['load: hydrateFromSave', store.getState().settlement]);
  const controls = {};
  for (const section of ['power', 'economy', 'npcs']) {
    const before = JSON.stringify(store.getState().settlement);
    await store.getState().regenSection(section);
    const after = store.getState().settlement;
    controls[`regenSection(${section}) changed the world`] = JSON.stringify(after) !== before;
    steps.push([`regenSection(${section})`, after]);
  }
  const history = await regenHistory(store, lawMoves);
  controls[`${HISTORY_STEP} changed the world`] = JSON.stringify(history.after) !== JSON.stringify(history.prior);
  steps.push([HISTORY_STEP, history.after]);
  const derived = await rederiveByTick(G, store, 'Wenna');
  controls['re-derive staged, re-derived and minted the newcomer'] =
    derived.staged && derived.rederived && derived.newcomer;
  steps.push(['edit re-derive (storedConfigFor -> regenerateWithLayer)', derived.world]);
  const cloned = G.clone.deepClone(derived.world);
  steps.push(['clone seam (deepClone)', cloned]);
  const played = playThreeMonths(G, cloned);
  controls['three months of play moved the world'] = JSON.stringify(played) !== JSON.stringify(cloned);
  steps.push(['advanceTime x3', played]);
  return { steps, controls, history, rederived: derived.world };
}

/** The controls every walk must show, so a green walk is a walk that ran. */
const LIVE_CONTROLS = Object.freeze({
  'regenSection(power) changed the world': false,
  'regenSection(economy) changed the world': false,
  'regenSection(npcs) changed the world': true,
  'regenSection(history) changed the world': true,
  're-derive staged, re-derived and minted the newcomer': true,
  'three months of play moved the world': true,
});

/** @type {Awaited<ReturnType<typeof buildUnder>>} */
let DARK;
/** @type {Awaited<ReturnType<typeof buildUnder>>} */
let LIT;
/** The place born on the DARK build (markerless), and its walk on the DARK build. */
let DARK_BORN;
let DARK_WALK;
/** The same place born on the LIT build (marker 2): the converse's fixture and the law-2 reference. */
let LIT_BORN;

/** A copy of `prior` with no trouble marker on its config or its `_config` echo (a place that reads law 1). */
function markerlessPlace(prior) {
  const copy = structuredClone(prior);
  for (const echo of ['config', '_config']) {
    if (copy[echo] && typeof copy[echo] === 'object') delete copy[echo][KEY];
  }
  return copy;
}

/** The history re-roll of `prior` from `seed` under law 1 (the DARK build, the place and the config markerless: the
 *  regen keys the history pass to the RECORD's law, `troubleLaw.js :: withRecordTroubleLaw`). */
function rerollLaw1(prior, cfg, seed) {
  const { [KEY]: _marker, ...markerless } = cfg;
  return tensionsOf(DARK.pipeline.regenHistoryPipeline(markerlessPlace(prior), markerless, { seed }));
}

/** The history re-roll of `prior` from `seed` under law 2 (the place given a `config` carrying 2, and the config
 *  handed stamped 2). */
function rerollLaw2(prior, cfg, seed) {
  const lit = { ...cfg, [KEY]: 2 };
  return tensionsOf(LIT.pipeline.regenHistoryPipeline({ ...structuredClone(prior), config: lit }, lit, { seed }));
}

/** Does the law move a history re-roll of `prior` from `seed`? (the walk's re-roll control) */
function lawMovesReroll(prior, cfg, seed) {
  return JSON.stringify(rerollLaw1(prior, cfg, seed)) !== JSON.stringify(rerollLaw2(prior, cfg, seed));
}

/**
 * THE LEGACY EDGE'S ONE MEASURE: a dark-born place stripped by `strip` (a legacy save's shape) is
 * opened on the LIT build while the form holds `formConfig`, and its history re-rolled through the
 * store's real `regenSection('history')` on a seed the law moves. Returns the form's law and what
 * the re-roll did: whether a config was written, the law the place reads, the marker on the config
 * the regen read, and the law the re-roll ran under (1, 2 or 'neither').
 */
async function legacyRegen(strip, formConfig) {
  const legacy = structuredClone(DARK_BORN);
  strip(legacy);
  const store = storeOf(LIT);
  store.getState().updateConfig(LIT.migration.migrateSettlementConfig(formConfig));
  store.setState((state) => {
    state.savedSettlements = [{ id: 'save-legacy', name: legacy.name, settlement: structuredClone(legacy) }];
  });
  store.getState().hydrateFromSave({ id: 'save-legacy', settlement: structuredClone(legacy) });
  const formReads = lawOf(LIT, store.getState().config).reads;
  expect(Object.hasOwn(store.getState().settlement, 'config')).toBe(false);
  const { prior, cfg, after, seed } = await regenHistory(store, lawMovesReroll);
  const rerolled = JSON.stringify(tensionsOf(after));
  let rerolledUnder = 'neither';
  if (rerolled === JSON.stringify(rerollLaw1(prior, cfg, seed))) rerolledUnder = 1;
  else if (rerolled === JSON.stringify(rerollLaw2(prior, cfg, seed))) rerolledUnder = 2;
  return {
    formReads,
    parts: { prior, cfg, after, seed },
    measured: {
      hasConfig: Object.hasOwn(after, 'config'),
      reads: LIT.law.resolveTroubleLawVersion(after),
      readConfigCarries: Object.hasOwn(cfg, KEY) ? cfg[KEY] : 'absent',
      rerolledUnder,
    },
  };
}

beforeAll(async () => {
  DARK = await buildUnder(1);
  DARK_BORN = DARK.pipeline.generateSettlementPipeline(
    DARK.boundary.birthConfig(visitorConfig(DARK)), null, { seed: SEED, customContent: {} },
  );
  // The dark build's own walk, taken while the dark graph's lazy lanes still resolve dark.
  DARK_WALK = await walk(DARK, rowOf(DARK_BORN, 'save-dark'), DARK_BORN._config, null);
  LIT = await buildUnder(2);
  LIT_BORN = LIT.pipeline.generateSettlementPipeline(
    LIT.boundary.birthConfig(visitorConfig(LIT)), null, { seed: SEED, customContent: {} },
  );
}, LONG);

afterAll(() => {
  vi.doUnmock(LAW);
  vi.resetModules();
});

/** THE GUARD at the top of every arm: the build this file calls lit IS lit, and the dark one dark. */
function expectBuildsLit() {
  expect(LIT.law.NEW_SETTLEMENT_TROUBLE_LAW_VERSION, 'the LIT build is not lit — every arm is vacuous')
    .toBe(LIT.law.WEIGHTED_TROUBLE_LAW_VERSION);
  expect(LIT.boundary.birthConfig(visitorConfig(LIT))[KEY], 'a birth on the LIT build mints no marker').toBe(2);
  expect(DARK.law.NEW_SETTLEMENT_TROUBLE_LAW_VERSION).toBe(DARK.law.DEFAULT_TROUBLE_LAW_VERSION);
  expect(Object.hasOwn(DARK.boundary.birthConfig(visitorConfig(DARK)), KEY), 'a DARK birth minted a marker').toBe(false);
}

/** The steps of a walk that do not re-roll history themselves. */
const notHistory = (steps) => steps.filter(([label]) => label !== HISTORY_STEP);

describe('K2: a saved place keeps the trouble law it was born under, on the LIT build', () => {
  it('0. the fixture: the place born dark is markerless, and law 2 WOULD move its troubles (the negative control\'s ground)', () => {
    expectBuildsLit();
    expect(lawOf(DARK, DARK_BORN)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    expect(lawOf(LIT, LIT_BORN)).toEqual({ config: 2, echo: 2, reads: 2 });
    // The same place, the same seed: the law moves its troubles, so every "equals the dark build's"
    // below can fail.
    expect(DARK_BORN.name).toBe(LIT_BORN.name);
    expect(tensionsOf(DARK_BORN).length).toBeGreaterThan(0);
    expect(tensionsOf(LIT_BORN)).not.toEqual(tensionsOf(DARK_BORN));
    // …and the law-2 birth is exactly the dark birth stamped 2 (the lit build differs by the mint alone).
    const forced = DARK.pipeline.generateSettlementPipeline(
      { ...DARK.boundary.birthConfig(visitorConfig(DARK)), [KEY]: 2 }, null, { seed: SEED, customContent: {} },
    );
    expect(tensionsOf(forced)).toEqual(tensionsOf(LIT_BORN));
  });

  it('1. ⛔ NO MIGRATION: a place born DARK keeps law 1 through save, load, regenSection, the edit re-derive, the clone seam and play, on the LIT build', async () => {
    expectBuildsLit();
    // The adversarial wizard config: a LIT world's own `_config` (marker 2) sits in the form.
    const run = await walk(LIT, rowOf(DARK_BORN, 'save-dark'), LIT_BORN._config, lawMovesReroll);
    expect(run.controls, 'a step of the walk did not run, so its law assertion would be vacuous')
      .toEqual(LIVE_CONTROLS);
    const laws = run.steps.map(([label, world]) => [label, lawOf(LIT, world)]);
    // A world and a bare config alike: no marker on the config or its echo, and the reader reads 1.
    const keeps = { config: 'absent', echo: 'absent', reads: 1 };
    expect(laws).toEqual(run.steps.map(([label]) => [label, keeps]));
    // The troubles at every world step that does not re-roll history equal the DARK build's same step.
    const darkByLabel = new Map(DARK_WALK.steps);
    const worlds = notHistory(run.steps).filter(([, world]) => Object.hasOwn(world, 'name'));
    expect(worlds.map(([label, world]) => [label, tensionsOf(world)]))
      .toEqual(worlds.map(([label]) => [label, tensionsOf(darkByLabel.get(label))]));
    // …and the re-derive, which re-runs history from the place's own seed, re-derived the dark troubles.
    expect(tensionsOf(run.rederived)).toEqual(tensionsOf(DARK_BORN));
    // THE HISTORY RE-ROLL re-rolled UNDER LAW 1: the read config is the place's own (markerless), and
    // the same prior world, config and seed re-rolled on the DARK build gives the same troubles, on a
    // seed the law moves (so a law-2 re-roll would have differed).
    const { prior, cfg, after, seed } = run.history;
    expect(Object.hasOwn(cfg, KEY), 'the history re-roll read a config carrying a trouble marker').toBe(false);
    expect(lawMovesReroll(prior, cfg, seed)).toBe(true);
    expect(tensionsOf(after)).toEqual(rerollLaw1(prior, cfg, seed));
    expect(tensionsOf(after)).not.toEqual(rerollLaw2(prior, cfg, seed));
  }, LONG);

  it('1b. NEGATIVE CONTROL: the same re-derive on the same place stamped _troubleLawVersion: 2 differs', async () => {
    expectBuildsLit();
    const store = openSave(LIT, rowOf(stamped(DARK_BORN, 2), 'save-stamped'), DARK_BORN._config);
    const derived = await rederiveByTick(LIT, store, 'Wenna');
    expect(derived.rederived && derived.newcomer).toBe(true);
    expect(lawOf(LIT, derived.world)).toEqual({ config: 2, echo: 2, reads: 2 });
    expect(tensionsOf(derived.world)).not.toEqual(tensionsOf(DARK_WALK.rederived));
    expect(tensionsOf(derived.world)).toEqual(tensionsOf(LIT_BORN));
  }, LONG);

  it('2. THE CONVERSE: a place born LIT keeps law 2 through the same steps — no step strips the marker or reads it dark', async () => {
    expectBuildsLit();
    // The adversarial wizard config the other way: a DARK world's own `_config` (markerless).
    const run = await walk(LIT, rowOf(LIT_BORN, 'save-lit'), DARK_BORN._config, lawMovesReroll);
    expect(run.controls).toEqual(LIVE_CONTROLS);
    const laws = run.steps.map(([label, world]) => [label, lawOf(LIT, world)]);
    expect(laws).toEqual(run.steps.map(([label, world]) => [
      label,
      Object.hasOwn(world, 'name') ? { config: 2, echo: 2, reads: 2 } : { config: 2, echo: 'absent', reads: 2 },
    ]));
    // The troubles at every world step that does not re-roll history are the lit place's own.
    const worlds = notHistory(run.steps).filter(([, world]) => Object.hasOwn(world, 'name'));
    expect(worlds.map(([label, world]) => [label, tensionsOf(world)]))
      .toEqual(worlds.map(([label]) => [label, tensionsOf(LIT_BORN)]));
    // The re-derive re-ran history UNDER LAW 2: the lit place's own troubles, not the dark one's.
    expect(tensionsOf(run.rederived)).toEqual(tensionsOf(LIT_BORN));
    expect(tensionsOf(run.rederived)).not.toEqual(tensionsOf(DARK_BORN));
    // The history re-roll re-rolled UNDER LAW 2, on a seed the law moves.
    const { prior, cfg, after, seed } = run.history;
    expect(cfg[KEY]).toBe(2);
    expect(tensionsOf(after)).toEqual(rerollLaw2(prior, cfg, seed));
    expect(tensionsOf(after)).not.toEqual(rerollLaw1(prior, cfg, seed));
  }, LONG);

  it('3. THE SURVEYOR\'S PREVIEW is UNMINTED, pinned as ruled: ConstructionPanel commit saves a markerless law-1 dossier on the LIT build', async () => {
    expectBuildsLit();
    // The module path the commit's dossier comes from: the config wall, then the local engine
    // seam's pipeline door with NO birthConfig (`ConstructionPanel.jsx :: generate`), then the
    // row `{ settlement: dossier, config: result.config }` (`:: commit`).
    const { config } = LIT.vocab.validateSettlementConfig(visitorConfig(LIT));
    const { generateSettlementPipeline } = await LIT.localPipeline.loadLocalPipeline();
    const dossier = generateSettlementPipeline(config, null, { seed: SEED });
    const row = { name: dossier.name, tier: dossier.tier, settlement: dossier, config };
    expect(lawOf(LIT, row.settlement)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    expect(lawOf(LIT, row.config)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    // The ground of the ruling: the same config through a BIRTH on this build is law 2.
    expect(LIT.boundary.birthConfig(config)[KEY]).toBe(2);
  }, LONG);

  it('4a. "Apply Saved Configuration & Regenerate" is a BIRTH, not a migration: a saved dark place\'s config regenerated on the LIT build is born law 2', async () => {
    expectBuildsLit();
    const saved = rowOf(DARK_BORN, 'save-dark');
    const store = storeOf(LIT);
    // `SettlementsPanel.jsx :: onLoad`, hop for hop.
    const rawConfig = saved.settlement._config || saved.config;
    store.getState().updateConfig(LIT.migration.migrateSettlementConfig(rawConfig));
    store.getState().setSettlement(structuredClone(saved.settlement));
    expect(lawOf(LIT, store.getState().config).reads, 'the hydrated form config is not dark').toBe(1);
    const born = await store.getState().generateSettlement();
    expect(born, 'the Generate after the Library load produced no world').toBeTruthy();
    expect(lawOf(LIT, born)).toEqual({ config: 2, echo: 2, reads: 2 });
    // A NEW world (a fresh seed), never the saved one re-stamped.
    expect(store.getState().lastSeed).not.toBe(DARK_BORN._seed);
  }, LONG);

  it('4b. the full reroll of a place on screen is a BIRTH, not a migration: the dark place rerolled on the LIT build is born law 2, and an incoming marker is clamped', async () => {
    expectBuildsLit();
    const store = storeOf(LIT);
    store.getState().updateConfig({ ...LIT.migration.migrateSettlementConfig(DARK_BORN._config), [KEY]: 1 });
    store.getState().setSettlement(structuredClone(DARK_BORN));
    expect(store.getState().config[KEY], 'the incoming marker never reached the form').toBe(1);
    const born = await store.getState().generateSettlement(SEED);
    expect(lawOf(LIT, born)).toEqual({ config: 2, echo: 2, reads: 2 });
    // Same seed, same config, now born under law 2: the lit birth's troubles, not the dark one's.
    expect(tensionsOf(born)).toEqual(tensionsOf(LIT_BORN));
    expect(tensionsOf(born)).not.toEqual(tensionsOf(DARK_BORN));
  }, LONG);

  it('5. THE LEGACY EDGE, shape 1 (CURED): a save with _config but no settlement.config, regenerated while the form holds a LIT world\'s _config, keeps no marker and re-rolls its history under law 1 (its own _config, not the form\'s)', async () => {
    expectBuildsLit();
    const run = await legacyRegen((world) => { delete world.config; }, LIT_BORN._config);
    expect(run.formReads, 'the form config is not lit — the edge is not set').toBe(2);
    // The regen read the place's OWN stored config (its `_config` echo, markerless), not the form's.
    expect(run.measured).toEqual({ hasConfig: false, reads: 1, readConfigCarries: 'absent', rerolledUnder: 1 });
  }, LONG);

  it('5. THE LEGACY EDGE, shape 2 (CURED): a save with neither config nor _config reads law 1, with and without the form\'s marker — its history re-rolled while the form holds a LIT world\'s config re-rolls under law 1', async () => {
    expectBuildsLit();
    const strip = (world) => { delete world.config; delete world._config; };
    // The ordinary case: the form carries no marker (a dark world's config), so the re-roll is law 1.
    const ordinary = await legacyRegen(strip, DARK_BORN._config);
    expect(ordinary.formReads).toBe(1);
    expect(ordinary.measured).toEqual({ hasConfig: false, reads: 1, readConfigCarries: 'absent', rerolledUnder: 1 });
    // THE LIT-FORM CASE, CURED (the chair's ruling of 18:26 UTC, superseding KINDS-1's ruling 9): the config the regen
    // reads is the form's (it carries 2), but the history pass is re-keyed to the RECORD's law
    // (`troubleLaw.js :: withRecordTroubleLaw`), and a place with no marker is law 1. It stamps nothing.
    const litForm = await legacyRegen(strip, LIT_BORN._config);
    expect(litForm.formReads).toBe(2);
    expect(litForm.measured).toEqual({ hasConfig: false, reads: 1, readConfigCarries: 2, rerolledUnder: 1 });
    // Its troubles are the same pass's with the form's marker removed, from the same `_regenSeed`…
    const { prior, cfg, after, seed } = litForm.parts;
    expect(seed).toBe(after._regenSeed);
    const { [KEY]: _formMarker, ...unmarked } = cfg;
    const withoutFormMarker = LIT.pipeline.regenHistoryPipeline(structuredClone(prior), unmarked, { seed });
    expect(tensionsOf(after)).toEqual(tensionsOf(withoutFormMarker));
    // …and THE LIVE NEGATIVE CONTROL: the same pass on the place given a `config` carrying 2 differs.
    const given2 = { ...structuredClone(prior), config: { ...cfg, [KEY]: 2 } };
    const underTwo = LIT.pipeline.regenHistoryPipeline(given2, cfg, { seed });
    expect(tensionsOf(underTwo), 'the law does not move this re-roll: the arm is vacuous').not.toEqual(tensionsOf(after));
  }, LONG);

  it('6. THE IMPORT: a gallery file carrying _troubleLawVersion: 2 keeps it through scrubImportedConfig and scrubGalleryImportLivingContent; a markerless file stays markerless', () => {
    expectBuildsLit();
    const importOf = (world) => {
      const file = JSON.parse(JSON.stringify(world));
      const scrubbed = LIT.scrub.scrubGalleryImportLivingContent(file);
      return {
        ...scrubbed,
        config: LIT.scrub.scrubImportedConfig(scrubbed.config),
        _config: LIT.scrub.scrubImportedConfig(scrubbed._config),
      };
    };
    const lit = importOf(LIT_BORN);
    const dark = importOf(DARK_BORN);
    // The scrub really ran: the living-content marker is dropped off the config.
    expect(Object.hasOwn(LIT_BORN.config, LIVING_KEY)).toBe(true);
    expect(Object.hasOwn(lit.config, LIVING_KEY)).toBe(false);
    expect(lawOf(LIT, lit)).toEqual({ config: 2, echo: 2, reads: 2 });
    expect(lawOf(LIT, dark)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
  });
});
