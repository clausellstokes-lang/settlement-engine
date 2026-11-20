/**
 * fortuneLawSavedTown.test.js — A SAVED TOWN KEEPS THE FORTUNE LAW IT WAS BORN UNDER, PROVED END TO
 * END ON THE LIT BUILD (FORTUNE-4, unit U7 "SAVED-TOWN"; tests only).
 *
 * ⭐ WHY. The owner decided (2026-11-20, ~19:13 UTC) that the fortune law SHIPS LIT; the default's
 * flip is the chair's at the close. `fortuneLaw.js` property 3 says NO MIGRATION, DELIBERATELY: a
 * world born before the light never changes. The reader (`resolveFortuneLawVersion`) never reads the
 * dial, and `fortuneLawWiring.test.js` arm 5 executes that on hand-built bags; what no arm did was
 * carry a REAL saved town through the hops a saved town makes with the dial lit. This file is that
 * proof, shaped arm for arm on the who-rules lane's SAVED-SEAT unit and on its template,
 * `livingContentLawWiring.test.js :: "NO MIGRATION — a law-1 world stays law-1 on every path, on
 * the LIT build"`, so the two can fold into one test over `GENERATION_LAWS` at the join.
 *
 * ⭐ TWO BUILDS IN ONE FILE, BOTH BY THE WIRING FILE'S SEAM. The fortune law's module is replaced
 * through `vi.doMock` with its real reader kept and only the dial and the mint set, and the generation
 * graph is re-imported under it: once DARK (the dial at the default: the product today) and once LIT
 * (`NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION`, so a birth mints 2).
 * Neither half reads the product's dial, so the chair's flip cannot make either half vacuous, and
 * every arm opens by asserting the build it runs on IS lit. Every lazy hop of the DARK graph (the
 * store's lanes) is taken BEFORE the light comes on: after it, a lazy import resolves lit.
 *
 * "KEEPS LAW 1" means, at every step: the config (and its `_config` echo) carries no
 * `_fortuneLawVersion`; `resolveFortuneLawVersion` reads 1; and the standing and the fortune
 * (`powerStructure.publicLegitimacy`, `economicState.prosperity` and `prosperityStanding`) equal the
 * dark build's. The town is a metropolis whose standing the law WOULD move (75 Endorsed under law 1,
 * 65 Approved under law 2, measured below), so "equal the dark build's" can fail.
 *
 * ⚠ `regenSection` HAS NO POWER AND NO ECONOMY BRANCH (`settlementRegenAction.js`: "any other value
 * regenerates nothing"; `domain/userEdits.js`: "exactly TWO branches, npcs and history"). The brief
 * names power and economy; both are driven and pinned as the no-ops they are, and the two live
 * branches are driven beside them with a positive control. The step that re-runs power and economy
 * is the edit re-derive (`regenerateWithLayer`), driven through the real tick.
 *
 * @enforced-by this test
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

const LAW = '../../src/domain/fortune/fortuneLaw.js';
const KEY = '_fortuneLawVersion';
const LIVING_KEY = '_livingContentLawVersion';

/** A metropolis the law WOULD move (its standing band differs between the two laws). */
const METRO = Object.freeze({
  settType: 'metropolis',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});
const SEED = 'saved-town-metropolis-0';
const NOW = '2026-11-20T21:00:00.000Z';
const TICK_REF = 'world_pulse.saved-town.1';
const LONG = 180_000;

/**
 * The generation graph re-imported under a fortune dial set to `version`: the wiring file's seam
 * (`fortuneLawWiring.test.js :: boundaryWithLitFortuneLaw`), with the real reader kept.
 * @param {number} version
 */
async function buildUnder(version) {
  vi.resetModules();
  vi.doMock(LAW, async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NEW_SETTLEMENT_FORTUNE_LAW_VERSION: version,
      newSettlementFortuneLaw: () => (version === actual.DEFAULT_FORTUNE_LAW_VERSION
        ? {}
        : { [actual.FORTUNE_LAW_CONFIG_KEY]: version }),
    };
  });
  const law = await import('../../src/domain/fortune/fortuneLaw.js');
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const pipeline = await import('../../src/generators/generateSettlementPipeline.js');
  const settlementSlice = await import('../../src/store/settlementSlice.js');
  const configSlice = await import('../../src/store/configSlice.js');
  const edit = await import('../../src/store/editSlice.js');
  const decreeHook = await import('../../src/domain/worldPulse/decreeHook.js');
  const pools = await import('../../src/domain/edit/pools.js');
  const clone = await import('../../src/domain/clone.js');
  const time = await import('../../src/domain/timeProgression.js');
  const migration = await import('../../src/lib/settlementConfigMigration.js');
  const scrub = await import('../../src/lib/importScrub.js');
  const vocab = await import('../../src/domain/construct/configVocabulary.js');
  const localPipeline = await import('../../src/lib/localPipeline.js');
  await boundary.loadGenerationLawPayloads();
  return {
    law, boundary, pipeline, settlementSlice, configSlice, edit, decreeHook, pools, clone, time,
    migration, scrub, vocab, localPipeline,
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

/** A library row as the product saves one: the row's `config` is the town's `_config`. */
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
    reads: G.law.resolveFortuneLawVersion(worldOrConfig),
  };
}

/** The standing and the fortune: the fields the law moves. */
function fortuneOf(world) {
  return {
    publicLegitimacy: world.powerStructure?.publicLegitimacy,
    prosperity: world.economicState?.prosperity,
    prosperityStanding: world.economicState?.prosperityStanding,
  };
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

/**
 * THE EDIT RE-DERIVE, through the real parts: an add-decree is staged, EM-E1's tick marks it applied,
 * and the store's tick half re-derives the world through `storedConfigFor` and
 * `settlementRederiveAction.js :: regenerateWithLayer` (the rosterOpsAtTick fixture's own route).
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

/** Three months of play under a condition that reaches the governing power's standing. */
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

/**
 * THE WALK: a saved row through every hop of arm 1 (and arm 2) on graph `G`. Returns each step's
 * world (or config) by label, in order, plus each live step's positive control.
 */
async function walk(G, row, formConfig) {
  /** @type {Array<[string, any]>} */
  const steps = [];
  const saved = JSON.parse(JSON.stringify(row));
  steps.push(['save and load (JSON)', saved.settlement]);
  steps.push(['load: migrateSettlementConfig(row.config)', G.migration.migrateSettlementConfig(saved.config)]);
  const store = openSave(G, saved, formConfig);
  steps.push(['load: hydrateFromSave', store.getState().settlement]);
  const controls = {};
  for (const section of ['power', 'economy', 'npcs', 'history']) {
    const before = JSON.stringify(store.getState().settlement);
    await store.getState().regenSection(section);
    const after = store.getState().settlement;
    controls[`regenSection(${section}) changed the world`] = JSON.stringify(after) !== before;
    steps.push([`regenSection(${section})`, after]);
  }
  const derived = await rederiveByTick(G, store, 'Wenna');
  controls['re-derive staged, re-derived and minted the newcomer'] =
    derived.staged && derived.rederived && derived.newcomer;
  steps.push(['edit re-derive (storedConfigFor -> regenerateWithLayer)', derived.world]);
  const cloned = G.clone.deepClone(derived.world);
  steps.push(['clone seam (deepClone)', cloned]);
  const played = playThreeMonths(G, cloned);
  controls['three months of play moved the standing'] =
    played.powerStructure.publicLegitimacy.score !== cloned.powerStructure.publicLegitimacy.score;
  steps.push(['advanceTime x3', played]);
  return { steps, controls, rederived: derived.world, cloned, played };
}

/** The controls every walk must show, so a green walk is a walk that ran. */
const LIVE_CONTROLS = Object.freeze({
  'regenSection(power) changed the world': false,
  'regenSection(economy) changed the world': false,
  'regenSection(npcs) changed the world': true,
  'regenSection(history) changed the world': true,
  're-derive staged, re-derived and minted the newcomer': true,
  'three months of play moved the standing': true,
});

/** @type {Awaited<ReturnType<typeof buildUnder>>} */
let DARK;
/** @type {Awaited<ReturnType<typeof buildUnder>>} */
let LIT;
/** The town born on the DARK build (markerless), and its walk on the DARK build. */
let DARK_BORN;
let DARK_WALK;
/** The same town born on the LIT build (marker 2): the converse's fixture and the law-2 reference. */
let LIT_BORN;

beforeAll(async () => {
  DARK = await buildUnder(1);
  DARK_BORN = DARK.pipeline.generateSettlementPipeline(
    DARK.boundary.birthConfig({ ...METRO }), null, { seed: SEED, customContent: {} },
  );
  // The dark build's own walk, taken while the dark graph's lazy lanes still resolve dark.
  DARK_WALK = await walk(DARK, rowOf(DARK_BORN, 'save-dark'), DARK_BORN._config);
  LIT = await buildUnder(2);
  LIT_BORN = LIT.pipeline.generateSettlementPipeline(
    LIT.boundary.birthConfig({ ...METRO }), null, { seed: SEED, customContent: {} },
  );
}, LONG);

afterAll(() => {
  vi.doUnmock(LAW);
  vi.resetModules();
});

/** THE GUARD at the top of every arm: the build this file calls lit IS lit, and the dark one dark. */
function expectBuildsLit() {
  expect(LIT.law.NEW_SETTLEMENT_FORTUNE_LAW_VERSION, 'the LIT build is not lit — every arm is vacuous')
    .toBe(LIT.law.SIZE_RELATIVE_FORTUNE_LAW_VERSION);
  expect(LIT.boundary.birthConfig({ ...METRO })[KEY], 'a birth on the LIT build mints no marker').toBe(2);
  expect(DARK.law.NEW_SETTLEMENT_FORTUNE_LAW_VERSION).toBe(DARK.law.DEFAULT_FORTUNE_LAW_VERSION);
  expect(Object.hasOwn(DARK.boundary.birthConfig({ ...METRO }), KEY), 'a DARK birth minted a marker').toBe(false);
}

describe('SAVED-TOWN: a saved town keeps the fortune law it was born under, on the LIT build', () => {
  it('0. the fixture: the town born dark is markerless, and law 2 WOULD move it (the negative control\'s ground)', () => {
    expectBuildsLit();
    expect(lawOf(DARK, DARK_BORN)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    expect(lawOf(LIT, LIT_BORN)).toEqual({ config: 2, echo: 2, reads: 2 });
    // The same town, the same seed: the law moves its standing (score AND band), so every "equals
    // the dark build's" below can fail.
    expect(DARK_BORN.name).toBe(LIT_BORN.name);
    expect(LIT_BORN.powerStructure.publicLegitimacy.score)
      .not.toBe(DARK_BORN.powerStructure.publicLegitimacy.score);
    expect(LIT_BORN.powerStructure.publicLegitimacy.label)
      .not.toBe(DARK_BORN.powerStructure.publicLegitimacy.label);
  });

  it('1. ⛔ NO MIGRATION: a town born DARK keeps law 1 through save, load, regenSection, the edit re-derive, the clone seam and play, on the LIT build', async () => {
    expectBuildsLit();
    // The adversarial wizard config: a LIT world's own `_config` (marker 2) sits in the form.
    const run = await walk(LIT, rowOf(DARK_BORN, 'save-dark'), LIT_BORN._config);
    expect(run.controls, 'a step of the walk did not run, so its law assertion would be vacuous')
      .toEqual(LIVE_CONTROLS);
    const darkByLabel = new Map(DARK_WALK.steps);
    const laws = run.steps.map(([label, world]) => [label, lawOf(LIT, world)]);
    // A world and a bare config alike: no marker on the config or its echo, and the reader reads 1.
    const keeps = { config: 'absent', echo: 'absent', reads: 1 };
    expect(laws).toEqual(run.steps.map(([label]) => [label, keeps]));
    // The standing and the fortune at every world step equal the DARK build's same step.
    const worlds = run.steps.filter(([, world]) => Object.hasOwn(world, 'name'));
    expect(worlds.map(([label, world]) => [label, fortuneOf(world)]))
      .toEqual(worlds.map(([label]) => [label, fortuneOf(darkByLabel.get(label))]));
    // …and the re-derive, which re-runs power and economy, re-derived the dark town's own standing.
    expect(fortuneOf(run.rederived)).toEqual(fortuneOf(DARK_BORN));
  }, LONG);

  it('1. NEGATIVE CONTROL: the same re-derive on the same town stamped _fortuneLawVersion: 2 differs', async () => {
    expectBuildsLit();
    const store = openSave(LIT, rowOf(stamped(DARK_BORN, 2), 'save-stamped'), DARK_BORN._config);
    const derived = await rederiveByTick(LIT, store, 'Wenna');
    expect(derived.rederived && derived.newcomer).toBe(true);
    expect(lawOf(LIT, derived.world)).toEqual({ config: 2, echo: 2, reads: 2 });
    expect(fortuneOf(derived.world).publicLegitimacy)
      .not.toEqual(fortuneOf(DARK_WALK.rederived).publicLegitimacy);
    expect(fortuneOf(derived.world)).toEqual(fortuneOf(LIT_BORN));
  }, LONG);

  it('2. THE CONVERSE: a town born LIT keeps law 2 through the same steps — no step strips the marker or reads it dark', async () => {
    expectBuildsLit();
    // The adversarial wizard config the other way: a DARK world's own `_config` (markerless).
    const run = await walk(LIT, rowOf(LIT_BORN, 'save-lit'), DARK_BORN._config);
    expect(run.controls).toEqual(LIVE_CONTROLS);
    const laws = run.steps.map(([label, world]) => [label, lawOf(LIT, world)]);
    expect(laws).toEqual(run.steps.map(([label, world]) => [
      label,
      Object.hasOwn(world, 'name') ? { config: 2, echo: 2, reads: 2 } : { config: 2, echo: 'absent', reads: 2 },
    ]));
    // The re-derive re-ran power and economy UNDER LAW 2: the lit town's own standing, not the dark one.
    expect(fortuneOf(run.rederived)).toEqual(fortuneOf(LIT_BORN));
    expect(fortuneOf(run.rederived).publicLegitimacy).not.toEqual(fortuneOf(DARK_BORN).publicLegitimacy);
  }, LONG);

  it('3. THE SURVEYOR\'S PREVIEW is UNMINTED, pinned as ruled: ConstructionPanel commit saves a markerless law-1 dossier on the LIT build', async () => {
    expectBuildsLit();
    // The module path the commit's dossier comes from: the config wall, then the local engine
    // seam's pipeline door with NO birthConfig (`ConstructionPanel.jsx :: generate`), then the
    // row `{ settlement: dossier, config: result.config }` (`:: commit`).
    const { config } = LIT.vocab.validateSettlementConfig({ ...METRO });
    const { generateSettlementPipeline } = await LIT.localPipeline.loadLocalPipeline();
    const dossier = generateSettlementPipeline(config, null, { seed: SEED });
    const row = { name: dossier.name, tier: dossier.tier, settlement: dossier, config };
    expect(lawOf(LIT, row.settlement)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    expect(lawOf(LIT, row.config)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    // The ground of the ruling: the same config through a BIRTH on this build is law 2.
    expect(LIT.boundary.birthConfig(config)[KEY]).toBe(2);
  }, LONG);

  it('4a. "Apply Saved Configuration & Regenerate" is a BIRTH, not a migration: a saved dark town\'s config regenerated on the LIT build is born law 2', async () => {
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

  it('4b. the full reroll of a town on screen is a BIRTH, not a migration: the dark town rerolled on the LIT build is born law 2, and an incoming marker is clamped', async () => {
    expectBuildsLit();
    const store = storeOf(LIT);
    store.getState().updateConfig({ ...LIT.migration.migrateSettlementConfig(DARK_BORN._config), [KEY]: 1 });
    store.getState().setSettlement(structuredClone(DARK_BORN));
    expect(store.getState().config[KEY], 'the incoming marker never reached the form').toBe(1);
    const born = await store.getState().generateSettlement(SEED);
    expect(lawOf(LIT, born)).toEqual({ config: 2, echo: 2, reads: 2 });
    // Same seed, same config, now born under law 2: the lit birth, the standing law 2 gives.
    expect(fortuneOf(born)).toEqual(fortuneOf(LIT_BORN));
  }, LONG);

  it('5. THE LEGACY EDGE (measured): a save with NO settlement.config regenerated while the form holds a LIT world\'s _config does not read the law lit', async () => {
    expectBuildsLit();
    const legacy = structuredClone(DARK_BORN);
    delete legacy.config;
    const store = storeOf(LIT);
    // A lit town loaded first: its `_config` is in the form (the onLoad hop).
    store.getState().updateConfig(LIT.migration.migrateSettlementConfig(LIT_BORN._config));
    store.setState((state) => {
      state.savedSettlements = [{ id: 'save-legacy', name: legacy.name, settlement: structuredClone(legacy) }];
    });
    store.getState().hydrateFromSave({ id: 'save-legacy', settlement: structuredClone(legacy) });
    expect(lawOf(LIT, store.getState().config).reads, 'the form config is not lit — the edge is not set').toBe(2);
    expect(Object.hasOwn(store.getState().settlement, 'config')).toBe(false);
    const regens = [];
    for (const section of ['npcs', 'history']) {
      const before = JSON.stringify(store.getState().settlement);
      await store.getState().regenSection(section);
      const after = store.getState().settlement;
      regens.push([section, {
        changed: JSON.stringify(after) !== before,
        hasConfig: Object.hasOwn(after, 'config'),
        law: lawOf(LIT, after),
        fortune: fortuneOf(after),
      }]);
    }
    const keeps = {
      changed: true, hasConfig: false, law: { config: 'absent', echo: 'absent', reads: 1 }, fortune: fortuneOf(DARK_BORN),
    };
    expect(regens).toEqual([['npcs', keeps], ['history', keeps]]);
    // THE LAW IN THE BORROWED CONFIG MOVES NOTHING THE REGEN WRITES: the same pass, the same seed,
    // with the form's marker and without it, writes the same bytes.
    const { [KEY]: _marker, ...unmarked } = store.getState().config;
    for (const pass of ['regenNPCsPipeline', 'regenHistoryPipeline']) {
      const lit = LIT.pipeline[pass](legacy, store.getState().config, { seed: 'legacy-edge' });
      const dark = LIT.pipeline[pass](legacy, unmarked, { seed: 'legacy-edge' });
      expect(JSON.stringify(lit), `${pass}: the form's lit marker moved the regenerated section`).toBe(JSON.stringify(dark));
    }
  }, LONG);

  it('6. THE IMPORT: a gallery file carrying _fortuneLawVersion: 2 keeps it through scrubImportedConfig and scrubGalleryImportLivingContent; a markerless file stays markerless', () => {
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
    // The scrub really ran: the living-content marker and the seed are dropped off the config.
    expect(Object.hasOwn(LIT_BORN.config, LIVING_KEY)).toBe(true);
    expect(Object.hasOwn(lit.config, LIVING_KEY)).toBe(false);
    expect(lawOf(LIT, lit)).toEqual({ config: 2, echo: 2, reads: 2 });
    expect(lawOf(LIT, dark)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
  });
});
