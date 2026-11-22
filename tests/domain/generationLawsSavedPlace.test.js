/**
 * generationLawsSavedPlace.test.js — A SAVED PLACE KEEPS EVERY GENERATION LAW IT WAS BORN UNDER, END TO END, FOR
 * EVERY ROW OF `GENERATION_LAWS` AT ONCE (CLOSE-1 unit 3, brief `docs/chair/2026-11-21/eighth/close/briefs/JOIN-LAWS.md`,
 * the chair's E61; tests only).
 *
 * ⭐ WHY ONE FILE. Each lane proved its own law on its own saved town, in its own harness: SAVED-SEAT
 * (`seat/seatLawSavedTown.test.js`) and SAVED-TOWN (`fortuneLawSavedTown.test.js`), both shaped on
 * `livingContentLawWiring.test.js :: "NO MIGRATION — a law-1 world stays law-1 on every path, on the LIT build"`. No
 * test walked a place with BOTH new dials lit, and no arm said that one law's marker never rides another's mint. This
 * file holds the arms common to every law, over the register itself: A FUTURE LAW IS COVERED BY ADDING ITS ROW TO
 * `GENERATION_LAWS` (and its two entries in `LAW_READINGS` below, which the register arm demands), NEVER BY A NEW FILE.
 * Each lane's file keeps only its own law's arms (seat: the two transfers; fortune: the surveyor's unminted preview).
 *
 * ⭐ THE HARNESS: THE SAVED-TOWN FORM (`fortuneLawSavedTown.test.js :: buildUnder`), GENERALISED TO A SET OF LIT LAWS.
 * `buildUnder(lit)` re-imports the generation graph with every row whose dial is DARK ON THE TREE replaced through
 * `vi.doMock` of the row's own `module`: the real module kept (its reader above all), only the row's `dial` and its
 * `mint` set, lit when the row is in `lit` (the version: the last member of the module's one `*_LAW_VERSIONS` list)
 * and unmocked when it is not. The seat law's second dial, `seatCircumstances.js :: SEAT_CONTEST_LIT`, is lit WITH the
 * seat row (`SECOND_DIALS`), as SAVED-SEAT's `dial.lit` did. ⛔ A ROW WHOSE DIAL IS ALREADY LIT ON THE TREE (density,
 * living content, today) IS WALKED AS SUCH AND NEVER MOCKED: it is lit on every build, and a place "born dark" under it
 * is a place born before its light, a config with no marker of it. On the flipped tree every row is such a row, so the
 * arms keep their meaning with nothing to mock. Every lazy hop of the DARK graph (the store's lanes) is taken in
 * `beforeAll` BEFORE any lit build exists: after `vi.resetModules`, a lazy import resolves in the newest registry.
 *
 * "KEEPS EVERY LAW AT 1" means, at every step and for every row: neither config echo (`config`, `_config`) carries the
 * row's `configKey`, the row's own reader reads 1, and the row's reading of the world (`LAW_READINGS`: what the law
 * moves) equals the DARK build's at the same step. The place is a town (COMMON: every born test carries a town-size
 * case) that every law WOULD move, measured live in (f): so every "equals the dark build's" below can fail.
 *
 * THE ARMS (E61 (4)), each for EVERY row at once:
 *   (a) NO MIGRATION: a place born with every law dark keeps every law at 1 through save, load, section regen, the
 *       edit re-derive at the tick (`applyRosterDecreesAtTick` -> `regenerateWithLayer`, both SAVED-SEAT's arm 6 road
 *       and SAVED-TOWN's re-derive), the clone seam, three months of play and the import (the gallery body and a
 *       reconciled export), ON A BUILD WITH EVERY DIAL LIT, under a lit form config.
 *   (b) THE CONVERSE: a place born lit keeps every marker through the same steps, under a dark form config.
 *   (c) INDEPENDENCE: each law lit ALONE marks only its own key; no law's marker rides another's mint.
 *   (d) BIRTHS: "Apply Saved Configuration & Regenerate" and the full reroll mint every marker lit.
 *   (e) THE LEGACY EDGE, both shapes (no `config`; `_config` but no `config`).
 *   (f) NEGATIVE CONTROLS: each row's discriminator shown live (the place born lit, and the same re-derive on the place
 *       stamped with that row's marker alone, read apart from the dark place).
 *   (g) THE ONE PIN of `birthConfig(null)` (E61 (5), COMMON-RULES 14 (c)): from the rows' own mints, dark and lit. The
 *       three wiring files' CREATE arms keep their own law's key only and point here.
 *
 * ⭐ (a) ALSO HOLDS livingContentLawWiring's "⛔ a PERSISTED law-1 world survives load, section regen and the clone
 * seam unstamped" (the chair's E101 (1)): that arm duplicated (a) but for one check, a law-1 world acquires no
 * `customContentRoster`, which (a) now makes on every world step (red first: a roster stamped on a law-1 world by a
 * planted import scrub reds (a) with that check's own message); the duplicate arm was then cut.
 *
 * THE OLD ARMS' HOMES (E61 (4)): seatLawSavedTown 1 (save, load, regen, clone), 5 (import), 6 (the tick) -> (a)/(b);
 * 2 -> (b); 3 -> (d); 4 -> (e). fortuneLawSavedTown 0 and 1's NEGATIVE CONTROL -> (f); 1 -> (a); 2 -> (b); 4a, 4b ->
 * (d); 5 -> (e); 6 -> (a)/(b). The `birthConfig(null)` pins of livingContentLawWiring "CREATE (LIT, the product path)",
 * seatLawWiring 1 and fortuneLawWiring 1 -> (g).
 *
 * ⚠ `regenSection` HAS NO POWER AND NO ECONOMY BRANCH (`settlementRegenAction.js`): both are driven and pinned as the
 * no-ops they are (the day a branch lands, the walk's control reds and asks to be extended); npcs and history are
 * driven with a positive control.
 *
 * @enforced-by this test
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { GENERATION_LAWS as TREE_LAWS } from '../../src/domain/density/densityCreateBoundary.js';

/** The gallery's network door (`gallery.js :: fetchDossierForImport`'s RPC), answered here only while `open`. */
const door = vi.hoisted(() => ({ open: false, rows: /** @type {Record<string, any>} */ ({}) }));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve('gallery-save-1')),
    isConfigured: false,
  },
}));
vi.mock('../../src/lib/supabase.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  const rpc = vi.fn(async (_name, args) => ({ data: [door.rows[args.dossier_slug]], error: null }));
  return {
    ...actual,
    get supabase() { return door.open ? { rpc } : actual.supabase; },
    get isConfigured() { return door.open ? true : actual.isConfigured; },
  };
});

const LONG = 180_000;
const NOW = '2026-11-22T15:00:00.000Z';
const TICK_REF = 'world_pulse.saved-place.1';
/** A town every law WOULD move (measured live in (f)). */
const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});
const SEED = 'saved-place-town-7';

/** The register's rows, in its own order (the order `birthConfig` spreads the mints). */
const ROWS = Object.freeze(Object.entries(TREE_LAWS));
const KEYS = Object.freeze(ROWS.map(([, row]) => row.configKey));
const spec = (rel) => `../../${rel}`;

/**
 * ⭐ EACH LAW'S TWO READINGS, the one thing a new row must bring besides its register row (the register arm reds
 * until it does). `reader`: the module and export of the law's own version reader (it reads the world, never the
 * dial). `moves`: what the law moves on a world, read on graph `G` (a read-time reading must be taken with the
 * build's own module), so "the lit build reads this place as the dark build does" can fail.
 */
const LAW_READINGS = Object.freeze({
  density: Object.freeze({
    reader: ['src/domain/density/densityLaw.js', 'resolveDensityLawVersion'],
    // Register VII's ladder: the people a birth names, and the factions' power the re-derive re-rolls (measured: the
    // re-derive pins the roster, and re-rolls the power).
    moves: (_G, w) => ({
      named: (w.npcs || []).length,
      factionPower: (w.powerStructure?.factions || []).map((f) => [f.faction, f.power]),
    }),
  }),
  livingContent: Object.freeze({
    reader: ['src/domain/content/livingContentLawVersion.js', 'resolveLivingContentLawVersion'],
    // Without a reviewed pack the law's one effect is its gate (the roster arms live in livingContentLawWiring).
    moves: (G, w) => ({ materializes: G.readers.livingContent.module.materializesLivingContent(configOf(w)) }),
  }),
  seat: Object.freeze({
    reader: ['src/domain/seat/seatLaw.js', 'resolveSeatLawVersion'],
    // Who contends the seat: the holder leaves the field under the law (SAVED-SEAT's reading).
    moves: (G, w) => ({ contenders: G.coup.coupContenders(w).challengers.map((c) => c.name) }),
  }),
  fortune: Object.freeze({
    reader: ['src/domain/fortune/fortuneLaw.js', 'resolveFortuneLawVersion'],
    // The standing and the fortune (SAVED-TOWN's reading).
    moves: (_G, w) => ({
      legitimacy: [w.powerStructure?.publicLegitimacy?.score, w.powerStructure?.publicLegitimacy?.label],
      prosperity: w.economicState?.prosperity,
      prosperityStanding: w.economicState?.prosperityStanding,
    }),
  }),
});

/** A law's second dial, lit WITH its row (the seat law's contest, SAVED-SEAT's `dial.lit`). */
const SECOND_DIALS = Object.freeze({
  seat: Object.freeze([Object.freeze({ module: 'src/domain/seat/seatCircumstances.js', dial: 'SEAT_CONTEST_LIT', lit: true })]),
});

/** The import scrubs drop ONE law's marker by design: a foreign living-content birth law (DEF-1; its arm is
 *  livingContentLawWiring "GALLERY INGEST drops the roster, the provenance receipt AND the foreign birth law"). Every
 *  other law's marker rides an import untouched. */
const IMPORT_SCRUBBED = Object.freeze(['livingContent']);

/** A world's config (or a bare config): what the config readers take. */
function configOf(w) {
  const isWorld = w && (Object.hasOwn(w, 'name') || Object.hasOwn(w, '_config'));
  return (isWorld ? (w.config || w._config) : w) || {};
}
const isWorld = (w) => Boolean(w) && (Object.hasOwn(w, 'name') || Object.hasOwn(w, '_config'));

// ── the tree, read before any mock ───────────────────────────────────────────────────────────────────────────────

/** Each row on the REAL tree: lit already (its real mint writes), or dark (and the version that would light it). */
async function treeOf() {
  /** @type {Record<string, {alreadyLit: boolean, litVersion: number}>} */
  const tree = {};
  for (const [name, row] of ROWS) {
    const actual = /** @type {any} */ (await vi.importActual(spec(row.module)));
    const minted = actual[row.mint]();
    const lists = Object.keys(actual).filter((k) => k.endsWith('_LAW_VERSIONS'));
    const alreadyLit = Object.keys(minted).length > 0;
    let litVersion;
    if (alreadyLit) {
      litVersion = actual[row.dial];
    } else {
      expect(lists, `${name}: a dark law's module must export exactly one *_LAW_VERSIONS list`).toHaveLength(1);
      litVersion = actual[lists[0]].at(-1);
      expect(litVersion, `${name}: the lit version is the dark dial`).not.toBe(actual[row.dial]);
    }
    tree[name] = { alreadyLit, litVersion };
  }
  return tree;
}

/** @type {Awaited<ReturnType<typeof treeOf>>} */
let TREE;
/** Every row's lit marker, in the register's order. */
let LIT_MARKERS;

/**
 * The generation graph re-imported with exactly the rows in `lit` lit, of those dark on the tree (rows lit on the tree
 * are lit on every build and never mocked). `full: false` imports the birth half only.
 * @param {Set<string>} lit
 * @param {{full?: boolean}} [opts]
 */
async function buildUnder(lit, { full = true } = {}) {
  vi.resetModules();
  for (const [name, row] of ROWS) {
    if (TREE[name].alreadyLit) continue;
    const version = TREE[name].litVersion;
    if (lit.has(name)) {
      vi.doMock(spec(row.module), async (importOriginal) => {
        const actual = /** @type {any} */ (await importOriginal());
        return { ...actual, [row.dial]: version, [row.mint]: () => ({ [row.configKey]: version }) };
      });
    } else {
      vi.doUnmock(spec(row.module));
    }
    for (const second of SECOND_DIALS[name] || []) {
      const real = /** @type {any} */ (await vi.importActual(spec(second.module)))[second.dial];
      if (lit.has(name) && real !== second.lit) {
        vi.doMock(spec(second.module), async (importOriginal) => ({
          .../** @type {any} */ (await importOriginal()), [second.dial]: second.lit,
        }));
      } else {
        vi.doUnmock(spec(second.module));
      }
    }
  }
  const G = /** @type {any} */ ({ lit });
  G.laws = {};
  for (const [name, row] of ROWS) G.laws[name] = await import(/* @vite-ignore */ spec(row.module));
  G.readers = {};
  for (const [name] of ROWS) {
    const [module, exported] = LAW_READINGS[name]?.reader || [];
    const mod = module ? await import(/* @vite-ignore */ spec(module)) : null;
    G.readers[name] = { module: mod, read: mod?.[exported] };
  }
  G.seconds = {};
  for (const [name] of ROWS) {
    G.seconds[name] = [];
    for (const second of SECOND_DIALS[name] || []) {
      G.seconds[name].push((await import(/* @vite-ignore */ spec(second.module)))[second.dial]);
    }
  }
  G.boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  G.pipeline = await import('../../src/generators/generateSettlementPipeline.js');
  G.coup = await import('../../src/domain/rulingPowerCoup.js');
  if (full) {
    G.settlementSlice = await import('../../src/store/settlementSlice.js');
    G.configSlice = await import('../../src/store/configSlice.js');
    G.edit = await import('../../src/store/editSlice.js');
    G.decreeHook = await import('../../src/domain/worldPulse/decreeHook.js');
    G.pools = await import('../../src/domain/edit/pools.js');
    G.clone = await import('../../src/domain/clone.js');
    G.time = await import('../../src/domain/timeProgression.js');
    G.migration = await import('../../src/lib/settlementConfigMigration.js');
    G.gallery = await import('../../src/store/galleryImportSettlement.js');
    G.recon = await import('../../src/lib/importReconciliation.js');
    G.accountData = await import('../../src/lib/accountData.js');
    G.band = await import('../../src/generators/npc/powerBand.js');
  }
  await G.boundary.loadGenerationLawPayloads();
  return G;
}

// ── reading a world ──────────────────────────────────────────────────────────────────────────────────────────────

/** Every row's marker on both config echoes, and its own reader, on graph `G`. */
function lawsOf(G, w) {
  const echo = (bag, key) => (bag && typeof bag === 'object' && Object.hasOwn(bag, key) ? bag[key] : 'absent');
  const world = isWorld(w);
  return Object.fromEntries(ROWS.map(([name, row]) => [name, {
    config: echo(world ? w.config : w, row.configKey),
    echo: world ? echo(w._config, row.configKey) : 'absent',
    reads: G.readers[name].read(configOf(w)),
  }]));
}

/** Every row's `moves` reading of a world on graph `G`. */
const movesOf = (G, w) => Object.fromEntries(ROWS.map(([name]) => [name, LAW_READINGS[name].moves(G, w)]));

/** A copy of `w` with `markers` set on both config echoes (a value of `null` strips the key). */
function stamped(w, markers) {
  const copy = structuredClone(w);
  for (const echo of ['config', '_config']) {
    if (!copy[echo] || typeof copy[echo] !== 'object') continue;
    for (const [key, value] of Object.entries(markers)) {
      if (value == null) delete copy[echo][key];
      else copy[echo][key] = value;
    }
  }
  return copy;
}
const withoutKeys = (bag, keys) => Object.fromEntries(Object.entries(bag).filter(([key]) => !keys.includes(key)));
const markersOf = (bag) => Object.fromEntries(KEYS.filter((key) => Object.hasOwn(bag || {}, key)).map((key) => [key, bag[key]]));

// ── the store ────────────────────────────────────────────────────────────────────────────────────────────────────

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

/** `SettlementsPanel.jsx :: onLoad`'s two store hops, in order: the form config from the saved
 *  `settlement._config || config` through `migrateConfig`, then the settlement itself. */
function libraryLoad(G, store, data) {
  const raw = data.settlement?._config || data.config;
  if (raw) store.getState().updateConfig(G.migration.migrateSettlementConfig(raw));
  if (data.settlement) store.getState().setSettlement(data.settlement);
}

/**
 * THE EDIT RE-DERIVE AT THE TICK, through the real parts (SAVED-SEAT's arm 6 road, SAVED-TOWN's re-derive): an
 * add-decree is staged, EM-E1's tick marks it applied, and `applyRosterDecreesAtTick` re-derives the world through
 * `storedConfigFor` and `settlementRederiveAction.js :: regenerateWithLayer`.
 */
async function rederiveByTick(G, store, name) {
  const saveId = String(store.getState().activeSaveId);
  const world = store.getState().settlement;
  const pools = Object.fromEntries(G.edit.addOpPayloadFor('npc')
    .filter((r) => typeof r.pool === 'string')
    .map((r) => [r.pool, G.pools.poolValues(r.pool, world)]));
  const staged = G.edit.stageAddDecreeIntent(store.getState, store.setState, {
    cardType: 'npc',
    values: { name, role: G.pools.poolValues('npc.role', world)[0] },
    pools,
    orderedAt: NOW,
  });
  const save = { id: saveId, settlement: { decrees: G.edit.selectDecrees(store.getState()) } };
  const applied = G.decreeHook.applyDecreesToSaves({ tick: 1 }, [save], TICK_REF, { now: NOW });
  store.setState((state) => { state.settlement.decrees = applied.saves[0].settlement.decrees; });
  const receipt = await G.edit.applyRosterDecreesAtTick(store.getState, store.setState, { saveId });
  const after = store.getState().settlement;
  const row = store.getState().savedSettlements.find((r) => String(r.id) === saveId)?.settlement;
  return {
    ran: staged.ok === true && applied.causes.length === 1 && receipt.rederived === true
      && (after.npcs || []).some((npc) => npc.id === staged.decreeId) && after !== world,
    world: after,
    row,
    newcomer: staged.decreeId,
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

/** THE IMPORT: the gallery body (its network door answered, the client strip, the veil and the scrubs real) and a
 *  reconciled export (`admitExistingCampaignImport`), of the same saved place. */
async function importsOf(G, world, slug) {
  door.rows[slug] = { id: `d-${slug}`, name: world.name, tier: world.tier, data: JSON.parse(JSON.stringify(world)) };
  const state = { auth: { user: { id: 'u-1' }, tier: 'premium' }, maxSaves: () => 50, savedSettlements: [] };
  door.open = true;
  try {
    await G.gallery.importGallerySettlementImpl(() => state, (recipe) => { recipe(state); }, slug);
  } finally {
    door.open = false;
  }
  const text = JSON.stringify({
    version: G.accountData.ACCOUNT_EXPORT_VERSION,
    campaigns: [],
    settlements: [{ id: `s-${slug}`, name: world.name, tier: world.tier, settlement: JSON.parse(JSON.stringify(world)) }],
  });
  const ingest = G.recon.ingestSettlementForgeExport(text, {
    label: `${slug}.sf.json`, ingestedAt: NOW, storageRef: `local-file:${slug}.sf.json`,
  });
  expect(ingest.ok, 'the export did not ingest').toBe(true);
  const admitted = await G.recon.admitExistingCampaignImport(ingest.value, {
    targetCampaign: { id: 'target-campaign', name: 'Current campaign', settlementIds: [] },
    existingSettlements: [],
    existingCampaigns: [],
  });
  expect(admitted.ok, 'the reconciled export was not admitted').toBe(true);
  return { gallery: state.savedSettlements[0].settlement, reconciled: admitted.value.proposals[0].normalizedInput.settlement };
}

/**
 * THE WALK: a saved row through every hop a saved place makes, on graph `G` under `formConfig`. Returns each step's
 * world (or bare config) by label, in order, and each live step's positive control.
 */
async function walk(G, row, formConfig, slug) {
  /** @type {Array<[string, any]>} */
  const steps = [];
  const saved = JSON.parse(JSON.stringify(row));
  steps.push(['save and load (JSON)', saved.settlement]);
  steps.push(['load: migrateSettlementConfig(row.config)', G.migration.migrateSettlementConfig(saved.config)]);
  const store = openSave(G, saved, formConfig);
  steps.push(['load: hydrateFromSave', store.getState().settlement]);
  /** @type {Record<string, boolean>} */
  const controls = {};
  for (const section of ['power', 'economy', 'npcs', 'history']) {
    const before = JSON.stringify(store.getState().settlement);
    await store.getState().regenSection(section);
    const after = store.getState().settlement;
    controls[`regenSection(${section}) changed the world`] = JSON.stringify(after) !== before;
    steps.push([`regenSection(${section})`, after]);
  }
  const derived = await rederiveByTick(G, store, 'Wenna');
  controls['the tick staged, applied and re-derived the decree'] = derived.ran;
  steps.push(['the edit re-derive at the tick (applyRosterDecreesAtTick -> regenerateWithLayer)', derived.world]);
  steps.push(['the re-derive\'s library row', derived.row]);
  const cloned = G.clone.deepClone(derived.world);
  controls['the clone seam is a deep copy'] = cloned !== derived.world && JSON.stringify(cloned) === JSON.stringify(derived.world);
  steps.push(['the clone seam (deepClone)', cloned]);
  const played = playThreeMonths(G, cloned);
  controls['three months of play moved the standing'] =
    played.powerStructure.publicLegitimacy.score !== cloned.powerStructure.publicLegitimacy.score;
  steps.push(['advanceTime x3', played]);
  const imported = await importsOf(G, saved.settlement, slug);
  steps.push(['the gallery import (importGallerySettlementImpl)', imported.gallery]);
  steps.push(['the reconciled export (admitExistingCampaignImport)', imported.reconciled]);
  return { steps, controls, rederived: derived.world, newcomer: derived.newcomer };
}

/** The controls every walk must show, so a green walk is a walk that ran. */
const LIVE_CONTROLS = Object.freeze({
  'regenSection(power) changed the world': false,
  'regenSection(economy) changed the world': false,
  'regenSection(npcs) changed the world': true,
  'regenSection(history) changed the world': true,
  'the tick staged, applied and re-derived the decree': true,
  'the clone seam is a deep copy': true,
  'three months of play moved the standing': true,
});
const IMPORT_STEPS = Object.freeze([
  'the gallery import (importGallerySettlementImpl)',
  'the reconciled export (admitExistingCampaignImport)',
]);

// ── the builds and the two places ────────────────────────────────────────────────────────────────────────────────

/** @type {any} */ let DARK;
/** @type {any} */ let LIT;
/** Each row lit ALONE (of those dark on the tree), by row name: the birth half only. */
/** @type {Record<string, any>} */ const ALONE = {};
/** The DARK build's birth from a config carrying every law's lit marker (the clamps' ground). */
let DARK_BIRTH_CONFIG;
/** The place born with every law dark, and its walk on the DARK build. */
let DARK_BORN;
let DARK_WALK;
/** The same place born on the LIT build (every marker lit). */
let LIT_BORN;

beforeAll(async () => {
  TREE = await treeOf();
  LIT_MARKERS = Object.fromEntries(ROWS.map(([name, row]) => [row.configKey, TREE[name].litVersion]));
  DARK = await buildUnder(new Set());
  // Adversarial: the incoming config carries every law's lit marker, as a Library load of a lit world's config does.
  DARK_BIRTH_CONFIG = DARK.boundary.birthConfig({ ...CONFIG, ...LIT_MARKERS });
  // A law lit on the tree has no dark birth on any build: its dark place is a place born before its light.
  const beforeEveryLight = withoutKeys(DARK_BIRTH_CONFIG, ROWS.filter(([name]) => TREE[name].alreadyLit).map(([, r]) => r.configKey));
  DARK_BORN = DARK.pipeline.generateSettlementPipeline(beforeEveryLight, null, { seed: SEED, customContent: {} });
  // The dark build's own walk, taken while the dark graph's lazy lanes still resolve dark.
  DARK_WALK = await walk(DARK, rowOf(DARK_BORN, 'save-dark'), DARK_BORN._config, 'dark-on-dark');
  for (const [name] of ROWS) {
    if (!TREE[name].alreadyLit) ALONE[name] = await buildUnder(new Set([name]), { full: false });
  }
  LIT = await buildUnder(new Set(ROWS.map(([name]) => name)));
  LIT_BORN = LIT.pipeline.generateSettlementPipeline(LIT.boundary.birthConfig({ ...CONFIG }), null, { seed: SEED, customContent: {} });
}, LONG);

afterAll(() => {
  for (const [, row] of ROWS) vi.doUnmock(spec(row.module));
  for (const seconds of Object.values(SECOND_DIALS)) for (const s of seconds) vi.doUnmock(spec(s.module));
  vi.resetModules();
});

/** Every row read 1 with no marker on either echo: a place (or a bare config) keeping every law at 1. */
const everyLawAtOne = () => Object.fromEntries(ROWS.map(([name]) => [name, { config: 'absent', echo: 'absent', reads: 1 }]));
/** Every row at its lit version on both echoes, read so: a place born under every law. */
const everyLawLit = () => Object.fromEntries(ROWS.map(([name]) => {
  const v = TREE[name].litVersion;
  return [name, { config: v, echo: v, reads: v }];
}));

/** THE GUARD at the top of every arm: the LIT build lights every row (and its second dials), the DARK build none of
 *  those dark on the tree. */
function expectBuilds() {
  const litBirth = LIT.boundary.birthConfig({ ...CONFIG });
  for (const [name, row] of ROWS) {
    expect(LIT.laws[name][row.dial], `${name}: the LIT build is not lit — every arm is vacuous`).toBe(TREE[name].litVersion);
    expect(litBirth[row.configKey], `${name}: a birth on the LIT build mints no marker`).toBe(TREE[name].litVersion);
    for (const [i, second] of (SECOND_DIALS[name] || []).entries()) {
      expect(LIT.seconds[name][i], `${name}: the LIT build's ${second.dial}`).toBe(second.lit);
    }
    if (TREE[name].alreadyLit) continue;
    expect(Object.hasOwn(DARK.boundary.birthConfig({ ...CONFIG }), row.configKey), `${name}: a DARK birth minted a marker`).toBe(false);
    for (const [i, second] of (SECOND_DIALS[name] || []).entries()) {
      expect(DARK.seconds[name][i], `${name}: the DARK build's ${second.dial}`).not.toBe(second.lit);
    }
  }
}

describe('SAVED-PLACE: a saved place keeps every generation law it was born under, for every row of GENERATION_LAWS', () => {
  it('the register: every row names a dial, a module, a mint and a config key, and brings its readings', () => {
    expect(ROWS.length, 'GENERATION_LAWS has fewer than the four laws this file was written over').toBeGreaterThanOrEqual(4);
    for (const [name, row] of ROWS) {
      for (const field of ['dial', 'module', 'mint', 'configKey']) {
        expect(typeof row[field], `${name}.${field}`).toBe('string');
      }
      expect(row.wiring, `${name}: an UNWIRED law is not minted by a birth, so this file cannot walk it`).toBe('WIRED');
      expect(LAW_READINGS[name], `${name}: a new law row must bring its reader and its reading here`).toBeTruthy();
      expect(typeof DARK.readers[name].read, `${name}: its reader`).toBe('function');
    }
    expect(Object.keys(LAW_READINGS).sort(), 'LAW_READINGS names a law the register does not').toEqual(ROWS.map(([n]) => n).sort());
    expect(new Set(KEYS).size, 'two rows share a config key').toBe(KEYS.length);
    expectBuilds();
  });

  // ── (g) THE ONE PIN ────────────────────────────────────────────────────────────────────────────────────────────

  it('(g) ⭐ THE ONE PIN: birthConfig(null) is, byte for byte, the rows\' own mints spread in the register\'s order, dark and lit', () => {
    expectBuilds();
    for (const [label, G] of [['the tree (DARK)', DARK], ['every dial LIT', LIT]]) {
      const pinned = Object.assign({}, ...ROWS.map(([name, row]) => G.laws[name][row.mint]()));
      // Each mint writes its own key or nothing, at its own dial's value.
      for (const [name, row] of ROWS) {
        const minted = G.laws[name][row.mint]();
        const lit = TREE[name].alreadyLit || G.lit.has(name);
        expect(minted, `${label}: ${name}'s mint`).toEqual(lit ? { [row.configKey]: TREE[name].litVersion } : {});
      }
      expect(G.boundary.birthConfig(null), `${label}: birthConfig(null)`).toEqual(pinned);
      expect(JSON.stringify(G.boundary.birthConfig(null)), `${label}: birthConfig(null) bytes`).toBe(JSON.stringify(pinned));
      expect(JSON.stringify(G.boundary.birthConfig(undefined)), `${label}: birthConfig(undefined) bytes`).toBe(JSON.stringify(pinned));
      // …and a real config is carried byte for byte, the laws adding exactly their mints.
      expect(JSON.stringify(G.boundary.birthConfig({ ...CONFIG })), `${label}: a real config`)
        .toBe(JSON.stringify({ ...CONFIG, ...pinned }));
    }
    // The tree's own value, the one every born pin moves with: exactly the laws lit on the tree.
    expect(Object.keys(DARK.boundary.birthConfig(null)))
      .toEqual(ROWS.filter(([name]) => TREE[name].alreadyLit).map(([, row]) => row.configKey));
    expect(Object.keys(LIT.boundary.birthConfig(null))).toEqual(KEYS);
  });

  // ── (c) INDEPENDENCE ───────────────────────────────────────────────────────────────────────────────────────────

  it('(c) INDEPENDENCE: each law lit ALONE marks only its own key — no law\'s marker rides another\'s mint', () => {
    expectBuilds();
    const alone = [['the tree (every law lit on it, none other)', DARK, null],
      ...Object.entries(ALONE).map(([name, G]) => [`${name} lit alone`, G, name])];
    expect(alone.length, 'no law is dark on the tree and none lit alone: (c) reads the real mints only').toBeGreaterThan(0);
    for (const [label, G, litName] of alone) {
      const birth = G.boundary.birthConfig({ ...CONFIG });
      const born = G.pipeline.generateSettlementPipeline(birth, null, { seed: SEED, customContent: {} });
      for (const [name, row] of ROWS) {
        const marks = TREE[name].alreadyLit || name === litName;
        const want = marks ? TREE[name].litVersion : 'absent';
        expect(Object.hasOwn(birth, row.configKey) ? birth[row.configKey] : 'absent', `${label}: birthConfig's ${row.configKey}`).toBe(want);
        for (const echo of ['config', '_config']) {
          expect(Object.hasOwn(born[echo], row.configKey) ? born[echo][row.configKey] : 'absent', `${label}: the born ${echo}'s ${row.configKey}`).toBe(want);
        }
        // The second dials ride their own row and no other.
        for (const [i, second] of (SECOND_DIALS[name] || []).entries()) {
          if (TREE[name].alreadyLit) continue;
          expect(G.seconds[name][i] === second.lit, `${label}: ${name}'s ${second.dial}`).toBe(name === litName);
        }
      }
      // Every marker on the birth is a register row's: no mint writes a key the register does not name.
      expect(Object.keys(withoutKeys(birth, Object.keys(CONFIG))).every((key) => KEYS.includes(key)), `${label}: an unregistered key`).toBe(true);
    }
    // …and each REAL mint, on the tree, writes its own key or nothing.
    for (const [name, row] of ROWS) {
      const minted = DARK.laws[name][row.mint]();
      expect(Object.keys(minted).every((key) => key === row.configKey), `${name}'s real mint writes another law's key`).toBe(true);
    }
  });

  // ── (a) NO MIGRATION ───────────────────────────────────────────────────────────────────────────────────────────

  it('(a) ⛔ NO MIGRATION: a place born with every law dark keeps every law at 1 through save, load, regenSection, the tick re-derive, the clone seam, play and the import, on a build with EVERY dial lit', async () => {
    expectBuilds();
    // THE BIRTH IS DARK: the dark build's birth carried none of the dark laws' incoming markers (the clamps), and the
    // place carries no marker at all.
    for (const [name, row] of ROWS) {
      expect(Object.hasOwn(DARK_BIRTH_CONFIG, row.configKey) ? DARK_BIRTH_CONFIG[row.configKey] : 'absent', `${name}: the dark birth's marker (its clamp)`)
        .toBe(TREE[name].alreadyLit ? TREE[name].litVersion : 'absent');
    }
    expect(lawsOf(DARK, DARK_BORN), 'the place is not born with every law dark').toEqual(everyLawAtOne());

    // Adversarial: the wizard's form config is a LIT place's own `_config` (every marker lit).
    const run = await walk(LIT, rowOf(DARK_BORN, 'save-dark'), LIT_BORN._config, 'dark-on-lit');
    expect(run.controls, 'a step of the walk did not run, so its law assertion would be vacuous').toEqual(LIVE_CONTROLS);
    expect(run.steps.map(([label]) => label)).toEqual(DARK_WALK.steps.map(([label]) => label));
    expect(run.steps.map(([label, w]) => [label, lawsOf(LIT, w)]), 'a step stamped a law on a dark place: there is NO MIGRATION')
      .toEqual(run.steps.map(([label]) => [label, everyLawAtOne()]));
    // What each law moves, at every world step, is the DARK build's at the same step: the lit build reads and
    // re-derives a dark place as the dark build does.
    const darkByLabel = new Map(DARK_WALK.steps);
    const worlds = run.steps.filter(([, w]) => isWorld(w));
    expect(worlds.map(([label, w]) => [label, movesOf(LIT, w)]))
      .toEqual(worlds.map(([label]) => [label, movesOf(DARK, darkByLabel.get(label))]));
    expect(movesOf(LIT, run.rederived), 'the tick re-derive did not re-derive the dark place\'s own world')
      .toEqual(movesOf(DARK, DARK_WALK.rederived));
    // The living-content law's own record (carried from livingContentLawWiring's PERSISTED arm, E101 (1)): a law-1
    // place acquires no roster on any step.
    expect(worlds.filter(([, w]) => Object.hasOwn(w, 'customContentRoster')).map(([label]) => label),
      'livingContent: a law-1 place acquired a customContentRoster').toEqual([]);

    // THE TICK RE-DERIVE'S CONTROL (SAVED-SEAT's arm 6 (b)): the same re-derivation with no marker in any config in
    // play gives the same people, the same power levels and bands, and the same readings. One tree, two runs.
    const people = (w) => w.npcs.map((npc) => [npc.id, npc.role, npc.powerLevel, LIT.band.powerBandOfRole(npc.role, w)]);
    const litForm = await rederiveByTick(LIT, openSave(LIT, rowOf(DARK_BORN, 'save-dark'), LIT_BORN._config), 'Wendel');
    const markerless = await rederiveByTick(LIT, openSave(LIT, rowOf(DARK_BORN, 'save-dark'), withoutKeys(LIT_BORN._config, KEYS)), 'Wendel');
    expect(litForm.ran && markerless.ran, 'a control re-derivation did not run').toBe(true);
    expect(people(litForm.world).length).toBeGreaterThan(1);
    expect(people(litForm.world), 'the lit form config moved a re-derived person').toEqual(people(markerless.world));
    expect(movesOf(LIT, litForm.world)).toEqual(movesOf(LIT, markerless.world));
  }, LONG);

  // ── (b) THE CONVERSE ───────────────────────────────────────────────────────────────────────────────────────────

  it('(b) THE CONVERSE: a place born lit keeps every marker through the same steps — no step strips one or reads it dark', async () => {
    expectBuilds();
    expect(lawsOf(LIT, LIT_BORN)).toEqual(everyLawLit());
    // Adversarial the other way: the form config is the DARK place's own `_config` (markerless).
    const run = await walk(LIT, rowOf(LIT_BORN, 'save-lit'), DARK_BORN._config, 'lit-on-lit');
    expect(run.controls).toEqual(LIVE_CONTROLS);
    for (const [label, w] of run.steps) {
      const laws = lawsOf(LIT, w);
      for (const [name, row] of ROWS) {
        if (IMPORT_STEPS.includes(label) && IMPORT_SCRUBBED.includes(name)) {
          // ANCHOR: the scrub really ran on this path, so the kept markers beside it rode a live scrub.
          expect(laws[name].config, `${label}: the ${name} scrub did not run`).toBe('absent');
          continue;
        }
        const v = TREE[name].litVersion;
        // A bare config has no echo, and the gallery body drops the whole `_config` echo (measured), never a marker.
        expect(laws[name], `${label}: ${row.configKey} was stripped or reads dark`)
          .toEqual({ config: v, echo: isWorld(w) && w._config ? v : 'absent', reads: v });
      }
    }
    // The only world step with no `_config` echo is the gallery import's (the relaxation above bites nowhere else).
    expect(run.steps.filter(([, w]) => isWorld(w) && !w._config).map(([label]) => label))
      .toEqual(['the gallery import (importGallerySettlementImpl)']);
    // What each law moves reads LIT at every world step: never the dark place's reading at the same step.
    const darkByLabel = new Map(DARK_WALK.steps);
    for (const [label, w] of run.steps.filter(([, x]) => isWorld(x))) {
      const lit = movesOf(LIT, w);
      const dark = movesOf(DARK, darkByLabel.get(label));
      for (const [name] of ROWS) {
        if (IMPORT_STEPS.includes(label) && IMPORT_SCRUBBED.includes(name)) continue;
        expect(lit[name], `${label}: ${name} reads the lit place as the dark one`).not.toEqual(dark[name]);
      }
    }
    // The re-derive re-ran the place UNDER ITS OWN LAWS: the lit birth's own readings, but for the one newcomer.
    const withoutNewcomer = { ...run.rederived, npcs: run.rederived.npcs.filter((npc) => npc.id !== run.newcomer) };
    expect(withoutNewcomer.npcs.length, 'the newcomer is not on the re-derived record').toBe(run.rederived.npcs.length - 1);
    expect(movesOf(LIT, withoutNewcomer)).toEqual(movesOf(LIT, LIT_BORN));
  }, LONG);

  // ── (d) BIRTHS ─────────────────────────────────────────────────────────────────────────────────────────────────

  it('(d) "Apply Saved Configuration & Regenerate" on a saved dark place is a BIRTH, not a migration: every marker minted lit', async () => {
    expectBuilds();
    const savedDark = JSON.parse(JSON.stringify(DARK_BORN));
    const untouched = JSON.stringify(savedDark);
    const every = (v) => Object.fromEntries(KEYS.map((key) => [key, v]));
    /** @type {Array<[string, any]>} */
    const reborn = [];
    for (const [label, incoming] of [['markerless', null], ['every law an incoming 1', 1], ['every law an incoming unshipped 3', 3]]) {
      const settlement = incoming == null ? JSON.parse(untouched) : stamped(JSON.parse(untouched), every(incoming));
      const store = storeOf(LIT);
      libraryLoad(LIT, store, { settlement, config: settlement.config });
      // The hop really carried the saved config's markers (or their absence) into the form.
      expect(markersOf(store.getState().config), `${label}: the form config after the Library load`)
        .toEqual(incoming == null ? {} : every(incoming));
      expect(store.getState().settlement, `${label}: setSettlement`).toBe(settlement);
      const born = await store.getState().generateSettlement(SEED);
      expect(born, `${label}: the regenerate produced no world`).toBeTruthy();
      expect(lawsOf(LIT, born), `${label}: a BIRTH on the lit build is born under every law`).toEqual(everyLawLit());
      // The birth wrote its laws on the NEW world only: the form config keeps what the load put there.
      expect(markersOf(store.getState().config), `${label}: the birth wrote back to the form`)
        .toEqual(incoming == null ? {} : every(incoming));
      reborn.push([label, movesOf(LIT, born)]);
    }
    // The incoming markers decided nothing: the same seed reborn under each is the same lit place, law for law.
    expect(reborn).toEqual(reborn.map(([label]) => [label, reborn[0][1]]));
    // …and the saved place itself is not migrated: its bytes are what they were.
    expect(JSON.stringify(savedDark)).toBe(untouched);
    // …and, with no seed asked, a NEW world (a fresh seed), never the saved one re-stamped (SAVED-TOWN 4a).
    const store = storeOf(LIT);
    libraryLoad(LIT, store, { settlement: JSON.parse(untouched), config: savedDark.config });
    const fresh = await store.getState().generateSettlement();
    expect(lawsOf(LIT, fresh)).toEqual(everyLawLit());
    expect(store.getState().lastSeed).not.toBe(DARK_BORN._seed);
  }, LONG);

  it('(d) the full reroll of a place on screen is a BIRTH, not a migration: born lit, and every incoming marker is clamped', async () => {
    expectBuilds();
    const reroll = async (incoming) => {
      const store = storeOf(LIT);
      store.getState().updateConfig({ ...LIT.migration.migrateSettlementConfig(DARK_BORN._config), ...incoming });
      store.getState().setSettlement(structuredClone(DARK_BORN));
      expect(markersOf(store.getState().config), 'the incoming markers never reached the form').toEqual(incoming);
      const born = await store.getState().generateSettlement(SEED);
      expect(born, 'the reroll produced no world').toBeTruthy();
      return born;
    };
    const ones = await reroll(Object.fromEntries(KEYS.map((k) => [k, 1])));
    expect(lawsOf(LIT, ones), 'the reroll is not born under every law').toEqual(everyLawLit());
    // THE CLAMP'S CONTROL: the same reroll with no incoming marker is the same lit place, law for law.
    expect(movesOf(LIT, ones)).toEqual(movesOf(LIT, await reroll({})));
  }, LONG);

  // ── (e) THE LEGACY EDGE ────────────────────────────────────────────────────────────────────────────────────────

  it('(e) THE LEGACY EDGE (measured), both shapes: a save with no settlement.config regenerated under a lit place\'s form config keeps every law at 1', async () => {
    expectBuilds();
    const { config: _resolved, ...noConfig } = JSON.parse(JSON.stringify(DARK_BORN));
    const { _config: _authoring, ...neither } = noConfig;
    for (const [label, legacy] of [['no config, no _config', neither], ['no config, a markerless _config', noConfig]]) {
      expect(Object.hasOwn(legacy, 'config'), label).toBe(false);
      expect(lawsOf(LIT, legacy), `${label}: before`).toEqual(everyLawAtOne());
      const store = storeOf(LIT);
      // A lit place loaded FIRST, through the Library (its `_config` becomes the form config)…
      libraryLoad(LIT, store, { settlement: structuredClone(LIT_BORN), config: LIT_BORN.config });
      // …then the legacy save opened over it, and regenerated.
      store.setState((state) => {
        state.savedSettlements = [{ id: 'save-legacy', name: legacy.name, settlement: structuredClone(legacy) }];
      });
      store.getState().hydrateFromSave({ id: 'save-legacy', settlement: structuredClone(legacy), campaignState: { phase: 'draft', eventLog: [] } });
      const formAtRegen = store.getState().config;
      // THE PRECONDITION: the regen's fallback config (`settlement.config || config`) IS lit, every law.
      expect(markersOf(formAtRegen), `${label}: the form config is not lit; the edge is not reached`).toEqual(LIT_MARKERS);
      for (const section of ['npcs', 'history']) {
        const before = JSON.stringify(store.getState().settlement);
        await store.getState().regenSection(section);
        const after = store.getState().settlement;
        expect(JSON.stringify(after), `${label}: regenSection(${section}) did not run`).not.toBe(before);
        expect(Object.hasOwn(after, 'config'), `${label}: the regen wrote a config onto the legacy place`).toBe(false);
        expect(lawsOf(LIT, after), `${label}: regenSection(${section}) read a law LIT — a FINDING`).toEqual(everyLawAtOne());
        expect(movesOf(LIT, after), `${label}: regenSection(${section})`).toEqual(movesOf(DARK, after));
      }
      // THE LAWS IN THE BORROWED CONFIG MOVE NOTHING THE REGEN WRITES: the same pass, the same seed, with the form's
      // markers and without them, writes the same bytes.
      const unmarked = withoutKeys(formAtRegen, KEYS);
      for (const pass of ['regenNPCsPipeline', 'regenHistoryPipeline']) {
        const read = (cfg) => JSON.stringify(LIT.pipeline[pass](JSON.parse(JSON.stringify(legacy)), cfg, { seed: 'saved-place-legacy' }));
        expect(read(formAtRegen), `${label}: the form's lit markers moved ${pass}`).toBe(read(unmarked));
      }
    }
  }, LONG);

  // ── (f) NEGATIVE CONTROLS ──────────────────────────────────────────────────────────────────────────────────────

  it('(f) NEGATIVE CONTROLS: every law WOULD move the place, and the same re-derive on the place stamped with that law alone reads apart', async () => {
    expectBuilds();
    // The fixture's ground: the same place, the same seed, born lit, reads apart under every law.
    expect(LIT_BORN.name).toBe(DARK_BORN.name);
    const born = { lit: movesOf(LIT, LIT_BORN), dark: movesOf(DARK, DARK_BORN) };
    for (const [name] of ROWS) {
      expect(born.lit[name], `${name}: the lit birth reads as the dark one, so (a) could not fail for it`).not.toEqual(born.dark[name]);
    }
    // The re-derive of the dark place, unstamped, on the LIT build: the reading each stamp must move.
    const plain = await rederiveByTick(LIT, openSave(LIT, rowOf(DARK_BORN, 'save-dark'), DARK_BORN._config), 'Wenna');
    expect(plain.ran).toBe(true);
    const base = movesOf(LIT, plain.world);
    for (const [name, row] of ROWS) {
      const v = TREE[name].litVersion;
      const store = openSave(LIT, rowOf(stamped(DARK_BORN, { [row.configKey]: v }), `save-stamped-${name}`), DARK_BORN._config);
      const derived = await rederiveByTick(LIT, store, 'Wenna');
      expect(derived.ran, `${name}: the stamped re-derive did not run`).toBe(true);
      // The stamp is kept, and it is the only marker.
      const laws = lawsOf(LIT, derived.world);
      for (const [other] of ROWS) {
        expect(laws[other].config, `${name} stamped: ${other}'s marker`).toBe(other === name ? v : 'absent');
      }
      expect(laws[name].reads).toBe(v);
      // ⛔ THE DISCRIMINATOR, LIVE: the same step on the place stamped with this law alone reads apart (SAVED-TOWN's
      // "the same re-derive on the same town stamped 2 differs", for every law).
      expect(movesOf(LIT, derived.world)[name], `${name}: the stamped re-derive reads as the unstamped one`).not.toEqual(base[name]);
    }
  }, LONG);
});
