/**
 * tests/store/advanceEpochForkSemantics.test.js — EP-2, THE FORK SEMANTICS.
 *
 * EP-1 minted the nonce and threaded it into the pulse root. This member decides what
 * happens at every point the advance FORKS — a pause, a reload, a preview, a forecast, an
 * undo — and the whole of it is one rule with two halves:
 *
 *   • A RESUMED advance REUSES its epoch. It is a CONSTRAINT, not an opportunity: the
 *     resume re-derives the paused tick from the cursor's pre-tick inputs and must land
 *     byte-identically on the minors the pause already committed. Minting there would
 *     silently split a single advance across two streams, mid-interval, with no crash.
 *   • A NON-COMMITTING consumer INHERITS, NEVER MINTS. The rules-dialog preview and the
 *     realm forecast exist to predict the advance the DM is about to press; one that minted
 *     its own nonce would show a future the Advance button then refuses to produce.
 *
 * ⛔ THE HIGHEST-RISK CLAIM IN THE PROGRAM IS PINNED HERE, and it is pinned WITH ITS
 * DISCRIMINATION ARM. `worldState.pausedAdvance` is PERSISTED, so "the resume carries the
 * epoch" is not provable by a run that would agree anyway — a green over a path where the
 * epoch could not have mattered is the rendered-surface-negative vacuity class. Every claim
 * below that says "the same world" is therefore paired with an executed run that says
 * "a DIFFERENT world" when the value is taken away.
 *
 * ⭐ THIS FILE ALSO DISCHARGES FENCE 5's STORE HALF, recorded as OWED BY EP-2 at EP-1's
 * J-TE30-1. EP-1 asserted the reachable half (the kernel's flag re-read against a real
 * value on the composed path) and refused to write the end-to-end store flag-flip over a
 * path that could not yet render. Materialization M2 and the `runResolveIntervalMajors`
 * re-thread land in this member, so the path renders now and the full fence is written.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The recorder. Hoisted, because vi.mock factories hoist above the imports. */
const spy = {
  /** @type {string[]} every seed handed to createPRNG, in composition order. */
  roots: [],
};
const resetSpy = () => { spy.roots = []; };

// THE SPY SITS OUTSIDE EVERY MODULE IT OBSERVES (the recorded WR-10 lesson, applied the
// right way round): the kernel IMPORTS createPRNG from src/kernel/prng.js, so mocking that
// module's exports really does intercept. STRICT pass-through — rest-args in, the
// original's result out — so instrumenting cannot perturb a byte of the runs measured here.
vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    createPRNG: (/** @type {any[]} */ ...args) => {
      spy.roots.push(String(args[0]));
      return actual.createPRNG(...args);
    },
  };
});

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = (/** @type {any} */ value) => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: (/** @type {any} */ campaign) => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn((/** @type {any} */ campaign) => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn((/** @type {string} */ name) => name === 'advanceMultiTick'),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, track: vi.fn() };
});

const { createCampaignSlice } = await import('../../src/store/campaignSlice.js');
const { createCampaignWorldPulseSlice } = await import('../../src/store/campaignWorldPulseSlice.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { previewCampaignWorldPulse, advanceCampaignWorld } =
  await import('../../src/domain/worldPulse/advanceCampaignWorld.js');
const { simulatePendingFuture } = await import('../../src/domain/worldPulse/forecastRun.js');
const { normalizeForDormancy } = await import('../helpers/dormancyOracle.js');

const FLAG = 'advanceEpochEnabled';
const NOW = '2026-01-01T00:00:00.000Z';
const SEED = 'ep-fork-seed';
const EPOCH_A = 'ep-alpha-1';
const EPOCH_B = 'ep-beta-2';
/** The interval that actually pauses: this fixture's first structural major fires at
 *  tick 5, so a 4-week month never reaches it and a 52-week year is four times the work. */
const PAUSING_INTERVAL = 'one_season';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = /** @type {any} */ ({
    getItem: (/** @type {any} */ key) => data.get(String(key)) ?? null,
    setItem: (/** @type {any} */ key, /** @type {any} */ value) => { data.set(String(key), String(value)); },
    removeItem: (/** @type {any} */ key) => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  });
}

const stubSlice = () => ({
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

function makeStore() {
  return create(immer((/** @type {any[]} */ ...a) => ({
    .../** @type {any} */ (stubSlice)(...a),
    .../** @type {any} */ (createCampaignSlice)(...a),
    .../** @type {any} */ (createCampaignWorldPulseSlice)(...a),
  })));
}

function settlement(/** @type {string} */ name) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
  };
}

/** The campaign record, built fresh each time. `rules` is spread onto worldState, so
 *  `undefined` produces the ABSENT (legacy) configuration rather than an empty object. */
function campaignRecord(/** @type {any} */ rules) {
  return {
    id: 'camp-1', name: 'Realm', settlementIds: ['a', 'b', 'c'],
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: SEED, tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
      ...(rules ? { simulationRules: rules } : {}),
    },
  };
}

function savesFixture() {
  return ['a', 'b', 'c'].map(id => ({
    id, name: id, phase: 'canon',
    settlement: settlement(id),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
}

/** A store seeded with the two-edge realm, under the given rules. */
function storeWith(/** @type {any} */ rules) {
  const store = makeStore();
  store.setState((/** @type {any} */ state) => {
    state.savedSettlements = savesFixture();
    state.campaigns = [campaignRecord(rules)];
  });
  return store;
}

const LIT = Object.freeze({ [FLAG]: true });
const clone = (/** @type {any} */ v) => JSON.parse(JSON.stringify(v));
/**
 * Serialize a world for a byte comparison, dropping every `timestamp` key. `undoLastPulse`
 * re-stamps a restored save with wall-clock now BY DESIGN (registered policy 'stamp' in
 * tests/store/lifecycleRoundTrip.test.js), so it is the one documented exclusion in the
 * undo comparison below — the same exclusion tests/store/advanceFullAutoResolve.test.js
 * takes, spelled as a recursive drop because the stamps sit inside the restored records.
 */
const bytesOf = (/** @type {any} */ v) =>
  JSON.stringify(v, (key, value) => (key === 'timestamp' ? undefined : value));
const worldOf = (/** @type {any} */ store) => store.getState().campaigns[0].worldState;
const cursorOf = (/** @type {any} */ store) => worldOf(store).pausedAdvance || null;
const epochRoots = () => spy.roots.filter(root => root.includes('::epoch:'));

/** Drain every pause to "recommended" until the interval finishes. */
async function drainToCompletion(/** @type {any} */ store, /** @type {any} */ options = { now: NOW }) {
  let guard = 0;
  /** @type {any} */
  let r;
  do {
    if (guard++ > 60) throw new Error('the resume did not converge');
    r = await store.getState().resolveIntervalMajors('camp-1', {}, options);
  } while (r && r.status === 'paused');
  return r;
}

/** Rehydrate a NEW store from a serialized campaign — the reload the cursor exists for. */
function reloadFrom(/** @type {any} */ persistedCampaign, /** @type {any} */ persistedSaves) {
  const reloaded = makeStore();
  reloaded.setState((/** @type {any} */ state) => {
    state.savedSettlements = persistedSaves;
    state.campaigns = [persistedCampaign];
  });
  return reloaded;
}

// ── SUITE 1 ────────────────────────────────────────────────────────────────────────────
describe('EP-2 · the resume re-thread — the same advance, the same epoch', () => {
  beforeEach(() => { installLocalStorage(); resetSpy(); });

  test('M2: a paused LIT advance parks its epoch on the cursor, and the key is FLAG-GATED', async () => {
    const lit = storeWith(LIT);
    const result = await lit.getState()
      .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
    expect(result.status, 'the fixture must actually pause, or every claim below is vacuous').toBe('paused');
    expect(cursorOf(lit).advanceEpoch).toBe(EPOCH_A);

    // THE DARK COLUMN, and it is the point of the key being conditional: an identical
    // advance under absent rules parks a cursor with NO advanceEpoch key at all — not the
    // key set to null, ABSENT — so a flag-dark world's persisted bytes are unchanged.
    const dark = storeWith(undefined);
    const darkResult = await dark.getState()
      .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
    expect(darkResult.status).toBe('paused');
    expect(Object.keys(cursorOf(dark))).not.toContain('advanceEpoch');
  });

  test('RELOAD mid-pause: the resumed segment composes the epoch the pause committed under', async () => {
    const lit = storeWith(LIT);
    await lit.getState()
      .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
    const persistedCampaign = clone(lit.getState().campaigns[0]);
    const persistedSaves = clone(lit.getState().savedSettlements);
    expect(persistedCampaign.worldState.pausedAdvance.advanceEpoch).toBe(EPOCH_A);

    const reloaded = reloadFrom(persistedCampaign, persistedSaves);
    resetSpy();
    await drainToCompletion(reloaded);

    // NON-VACUITY FLOOR: the resume must have composed something at all.
    expect(spy.roots.length).toBeGreaterThan(0);
    // EVERY root the resumed segment composed carries THIS advance's epoch. Not "at least
    // one" — a re-thread that leaked on any interior tick would show as a bare root here.
    expect(spy.roots.filter(root => !root.endsWith(`::epoch:${EPOCH_A}`))).toEqual([]);
  });

  test('THE HIGHEST-RISK CLAIM: the value the resume carries DECIDES the world it finishes', async () => {
    // The pause commits half an interval under epoch A. Three resumes then run from the
    // SAME persisted state. If the re-thread were decorative all three would agree, and
    // "the resume carries the epoch" would be a green over a path that could not matter.
    const lit = storeWith(LIT);
    await lit.getState()
      .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
    const persistedCampaign = clone(lit.getState().campaigns[0]);
    const persistedSaves = clone(lit.getState().savedSettlements);
    expect(persistedCampaign.worldState.pausedAdvance.advanceEpoch).toBe(EPOCH_A);

    // (1) THE CURSOR IS THE SOURCE: no option given, so the second term of the three-term
    //     fallback supplies EPOCH_A.
    const fromCursor = reloadFrom(clone(persistedCampaign), clone(persistedSaves));
    await drainToCompletion(fromCursor);
    // (2) THE OPTION WINS, and the same value reproduces the cursor-driven world exactly.
    const forcedA = reloadFrom(clone(persistedCampaign), clone(persistedSaves));
    await drainToCompletion(forcedA, { now: NOW, epoch: EPOCH_A });
    // (3) A DIFFERENT VALUE FINISHES A DIFFERENT WORLD — the discrimination arm.
    const forcedB = reloadFrom(clone(persistedCampaign), clone(persistedSaves));
    await drainToCompletion(forcedB, { now: NOW, epoch: EPOCH_B });

    expect(worldOf(fromCursor).tick).toBe(worldOf(forcedB).tick);
    expect(JSON.stringify(worldOf(fromCursor))).toBe(JSON.stringify(worldOf(forcedA)));
    expect(JSON.stringify(worldOf(fromCursor))).not.toBe(JSON.stringify(worldOf(forcedB)));
  });

  test('FENCE 5, STORE HALF: the FOUR withholding cells, and the store gate is the live one', async () => {
    // ⛔ MEASURED HERE AND REPORTED, because §2.3b's belt-and-braces argument does not
    // reach this path as written. The orchestrator re-derives the paused tick from
    // `resume.preWorldState` (advanceInterval.js: `runningCampaign = { …campaign,
    // worldState: resume.preWorldState, … }`), so THE KERNEL'S FLAG GATE READS THE RULES
    // FROZEN INTO THE CURSOR AT PAUSE TIME, not the campaign's live ones. A DM who turns
    // the rule off mid-pause therefore does NOT darken the kernel's own gate — what closes
    // the cell is the STORE withholding the value. On the resume path the belt is live and
    // the braces are stale, and the four cells below say so in the order they bite.
    const litPause = async () => {
      const store = storeWith(LIT);
      await store.getState()
        .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
      return {
        campaign: clone(store.getState().campaigns[0]),
        saves: clone(store.getState().savedSettlements),
      };
    };

    // CELL 1 — STILL LIT: the epoch flows and every composed root carries it.
    {
      const { campaign, saves } = await litPause();
      const reloaded = reloadFrom(campaign, saves);
      resetSpy();
      await drainToCompletion(reloaded);
      expect(spy.roots.length).toBeGreaterThan(0);
      expect(spy.roots.filter(root => !root.endsWith(`::epoch:${EPOCH_A}`))).toEqual([]);
    }

    // CELL 2 — THE FLIP. The cursor still carries the live epoch across it (that is the
    // hazard, asserted rather than tidied away), and the store withholds it anyway. The
    // WITHHOLDING IS OBSERVED THROUGH EP-1's OWN STRUCTURAL GUARD: the kernel receives
    // `advanceEpoch == null` while its (stale, snapshot) rules read strictly true, which is
    // exactly the state assertEpochPinnedInTest refuses in a test run. Had the store NOT
    // gated, a value would have arrived and this would resolve silently — so the rejection
    // is the proof, and cell 1 is the control that proves it is not simply always thrown.
    {
      const { campaign, saves } = await litPause();
      campaign.worldState.simulationRules = { [FLAG]: false };
      expect(campaign.worldState.pausedAdvance.advanceEpoch).toBe(EPOCH_A);
      const reloaded = reloadFrom(campaign, saves);
      await expect(drainToCompletion(reloaded)).rejects.toThrow(/no threaded `advanceEpoch`/);
    }

    // CELL 3 — THE LEGACY CURSOR: a pause parked by a build older than this program has no
    // `advanceEpoch` key at all. The resume must never MINT one, and it does not: the same
    // withheld-value state is reached, by absence rather than by the gate.
    {
      const { campaign, saves } = await litPause();
      delete campaign.worldState.pausedAdvance.advanceEpoch;
      const reloaded = reloadFrom(campaign, saves);
      await expect(drainToCompletion(reloaded)).rejects.toThrow(/no threaded `advanceEpoch`/);
    }

    // CELL 4 — A WORLD THAT NEVER RAN LIT (rules absent in BOTH homes, which is every save
    // in the wild today). L4 in full: the resumed composition is the LITERAL legacy string,
    // L3: no record it writes carries an `epoch` key, and no epoch is re-parked.
    {
      const store = storeWith(undefined);
      await store.getState()
        .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
      const reloaded = reloadFrom(clone(store.getState().campaigns[0]), clone(store.getState().savedSettlements));
      const resumeTick = reloaded.getState().campaigns[0].worldState.pausedAdvance.resumeTick;
      resetSpy();
      await drainToCompletion(reloaded);
      expect(spy.roots.length).toBeGreaterThan(0);
      expect(spy.roots[0]).toBe(`${SEED}::tick:${resumeTick + 1}::one_week`);
      expect(epochRoots()).toEqual([]);
      const written = (worldOf(reloaded).pulseHistory || []).slice(-1);
      expect(written.length).toBe(1);
      expect(Object.keys(written[0])).not.toContain('epoch');
      const reparked = cursorOf(reloaded);
      if (reparked) expect(Object.keys(reparked)).not.toContain('advanceEpoch');
    }
  });
});

// ── SUITE 2 ────────────────────────────────────────────────────────────────────────────
describe('EP-2 · the PREVIEW — inherit, never mint (chair ruling R2)', () => {
  beforeEach(() => { installLocalStorage(); resetSpy(); });

  /** The single-tick args both sides of the projection pin are handed. */
  function pulseArgs(/** @type {any} */ rules, /** @type {any} */ advanceEpoch) {
    return {
      campaign: campaignRecord(rules),
      saves: savesFixture(),
      interval: 'one_month',
      now: NOW,
      advanceEpoch,
    };
  }

  /**
   * THE PROJECTION, binding and executable: the returned world plus the pulse record,
   * normalized through the dormancy oracle the whole byte-identity estate compares
   * through, with EXACTLY the two exclusions §3c names — both of them serializations of
   * the one field that necessarily differs (`committed: commit`).
   */
  function project(/** @type {any} */ result, /** @type {string[]} */ excluded) {
    const shaped = clone({ worldState: result?.worldState, pulseRecord: result?.pulseRecord });
    for (const path of excluded) {
      if (path === 'pulseRecord.committed') delete shaped?.pulseRecord?.committed;
      if (path === 'worldState.pulseHistory[last].committed') {
        const history = shaped?.worldState?.pulseHistory;
        if (Array.isArray(history) && history.length) delete history[history.length - 1].committed;
      }
    }
    return JSON.stringify(normalizeForDormancy(shaped));
  }

  const EXCLUSIONS = Object.freeze(['pulseRecord.committed', 'worldState.pulseHistory[last].committed']);

  test('the store preview INHERITS the campaign PENDING epoch off the paused cursor', async () => {
    // The preview does NOT travel through advanceInterval's tickArgs, so this is the one
    // claim that can only be made at the store: the deferred body must source the epoch
    // from the campaign and add it to its own argument literal.
    const lit = storeWith(LIT);
    await lit.getState()
      .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
    expect(cursorOf(lit).advanceEpoch).toBe(EPOCH_A);

    resetSpy();
    const preview = await lit.getState().previewCampaignWorldPulse('camp-1', 'one_month', { now: NOW });
    expect(preview, 'the preview returned nothing — the assertions below would be vacuous').toBeTruthy();
    expect(spy.roots.length).toBeGreaterThan(0);
    expect(spy.roots.every(root => root.endsWith(`::epoch:${EPOCH_A}`))).toBe(true);

    // THE DARK COLUMN: the same campaign with the rule absent previews the bare root, even
    // though the cursor still carries a live epoch — the kernel's own gate, seen from here.
    const darkStore = storeWith(undefined);
    await darkStore.getState()
      .advanceCampaignWorld('camp-1', PAUSING_INTERVAL, { now: NOW, epoch: EPOCH_A, autoResolve: false });
    resetSpy();
    await darkStore.getState().previewCampaignWorldPulse('camp-1', 'one_month', { now: NOW });
    expect(spy.roots.length).toBeGreaterThan(0);
    expect(epochRoots()).toEqual([]);
  });

  test('preview ≡ commit over the WHOLE projection, in BOTH flag states', () => {
    for (const [label, rules, epoch] of /** @type {any[][]} */ ([
      ['dark', undefined, null],
      ['lit', LIT, EPOCH_A],
    ])) {
      const preview = previewCampaignWorldPulse(pulseArgs(rules, epoch));
      const commit = advanceCampaignWorld(pulseArgs(rules, epoch));
      expect(project(preview, [...EXCLUSIONS]), label).toBe(project(commit, [...EXCLUSIONS]));
    }
  });

  test('THE TIGHTNESS CONTROL: with the exclusion list EMPTY the comparison FAILS, on exactly those two paths', () => {
    const preview = previewCampaignWorldPulse(pulseArgs(LIT, EPOCH_A));
    const commit = advanceCampaignWorld(pulseArgs(LIT, EPOCH_A));
    // An exclusion that never fires is an exclusion hiding a difference nobody looked at.
    expect(project(preview, [])).not.toBe(project(commit, []));
    // …and the difference is EXACTLY the one label, in both of its homes.
    expect(preview.pulseRecord.committed).toBe(false);
    expect(commit.pulseRecord.committed).toBe(true);
    const previewLast = preview.worldState.pulseHistory.slice(-1)[0];
    const commitLast = commit.worldState.pulseHistory.slice(-1)[0];
    expect(previewLast.committed).toBe(false);
    expect(commitLast.committed).toBe(true);
    // Dropping ONLY those two makes the two runs identical — proof the list is complete.
    // A third differing field would mean `commit` acquired a control-flow reader, which is
    // a change to the preview contract and a STOP, never a widened exclusion list.
    expect(project(preview, [...EXCLUSIONS])).toBe(project(commit, [...EXCLUSIONS]));
  });

  test('THE MUTANT: a preview handed the WRONG epoch predicts a DIFFERENT future, and NO epoch is LOUD', () => {
    // Dropping the epoch from the preview's argument literal is precisely the bug chair
    // ruling R2 exists to prevent, and this is that mutant executed rather than described.
    // ⭐ The naive spelling — preview with `advanceEpoch: null` under a lit rule — cannot
    // be run at all, and that is EP-1's structural guard doing its job: a lit preview with
    // no epoch would silently show the pre-wave future, so it THROWS in a test run instead.
    expect(() => previewCampaignWorldPulse(pulseArgs(LIT, null))).toThrow(/no threaded `advanceEpoch`/);
    // The mutant is therefore run in the form that IS reachable: a preview threaded a
    // DIFFERENT epoch than the commit predicts a different future…
    const withA = previewCampaignWorldPulse(pulseArgs(LIT, EPOCH_A));
    const withB = previewCampaignWorldPulse(pulseArgs(LIT, EPOCH_B));
    expect(project(withA, [...EXCLUSIONS])).not.toBe(project(withB, [...EXCLUSIONS]));
    // …while the one carrying the advance's OWN epoch agrees with the commit exactly.
    const commit = advanceCampaignWorld(pulseArgs(LIT, EPOCH_A));
    expect(project(withA, [...EXCLUSIONS])).toBe(project(commit, [...EXCLUSIONS]));
    // DARK: the same two epochs produce the IDENTICAL preview, because neither reaches a
    // draw — the epoch is inert until the rule lights it.
    expect(project(previewCampaignWorldPulse(pulseArgs(undefined, EPOCH_A)), [...EXCLUSIONS]))
      .toBe(project(previewCampaignWorldPulse(pulseArgs(undefined, EPOCH_B)), [...EXCLUSIONS]));
  });
});

// ── SUITE 3 ────────────────────────────────────────────────────────────────────────────
describe('EP-2 · the FORECAST — inherit, never mint', () => {
  beforeEach(() => { resetSpy(); });

  /** A campaign carrying a PENDING epoch on its paused-advance cursor. */
  function pendingCampaign(/** @type {any} */ rules) {
    const campaign = campaignRecord(rules);
    campaign.worldState = /** @type {any} */ ({
      ...campaign.worldState,
      pausedAdvance: { advanceEpoch: EPOCH_B },
    });
    return campaign;
  }

  const forecastOnce = async (/** @type {any} */ campaign) => {
    resetSpy();
    await simulatePendingFuture({
      campaign, saves: /** @type {any} */ (savesFixture()), interval: 'one_month', now: NOW,
    });
    return [...spy.roots];
  };

  test('the forecast inherits the realm PENDING epoch, mints nothing, and is inert dark', async () => {
    const inherited = await forecastOnce(pendingCampaign(LIT));
    expect(inherited.length).toBeGreaterThan(0);
    expect(inherited.filter(root => !root.endsWith(`::epoch:${EPOCH_B}`))).toEqual([]);

    // NOT MINTED: a second run over the same inputs composes the IDENTICAL roster. A
    // forecast that minted its own nonce would draw a fresh one here and the two differ.
    expect(await forecastOnce(pendingCampaign(LIT))).toEqual(inherited);

    // …and with the rule DARK the same pending epoch reaches no draw at all, so the epoch
    // above genuinely came from the cursor through the gate rather than from anywhere ambient.
    const dark = await forecastOnce(pendingCampaign(undefined));
    expect(dark.length).toBeGreaterThan(0);
    expect(dark.filter(root => root.includes('::epoch:'))).toEqual([]);
  });
});

// ── SUITE 4 ────────────────────────────────────────────────────────────────────────────
describe('EP-2 · undo, backtrack, and the lived-past law (§3c)', () => {
  beforeEach(() => { installLocalStorage(); resetSpy(); });

  test('THE LIT-MUTANT OF THE WHOLE PROGRAM: undo → re-advance draws a DIFFERENT world lit, the SAME world dark', async () => {
    // No epoch is pinned on either advance: the mint runs for real, which is what makes
    // this the program's headline claim rather than a re-run with two hand-chosen strings.
    // ⚠ autoResolve ON deliberately: a paused advance parks a cursor carrying PRE-TICK
    // RESUME FUEL, and that fuel is not the drawn world — the first advance normalizes the
    // fixture's minimal seed world, so the snapshot the SECOND advance parks differs from
    // the first's for a reason that predates this program and has nothing to do with
    // entropy. Driving the interval to completion compares worlds, not resume fuel.
    const runTwice = async (/** @type {any} */ rules) => {
      const store = storeWith(rules);
      resetSpy();
      await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW, autoResolve: true });
      const first = { world: bytesOf(worldOf(store)), roots: [...spy.roots] };
      expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
      expect(worldOf(store).tick).toBe(0);
      resetSpy();
      await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW, autoResolve: true });
      return { first, second: { world: bytesOf(worldOf(store)), roots: [...spy.roots] } };
    };

    const lit = await runTwice(LIT);
    // NON-VACUITY: the runs really composed roots, so the comparisons below compare something.
    expect(lit.first.roots.length).toBeGreaterThan(0);
    // THE DRAW ITSELF: a re-advanced future is rooted on a fresh nonce, so not one root repeats.
    expect(lit.second.roots.filter(root => lit.first.roots.includes(root))).toEqual([]);
    expect(lit.second.world).not.toBe(lit.first.world);

    // DARK — the immutable-past guarantee every existing save already has, unchanged: the
    // identical roots, in the identical order, and the identical world.
    const dark = await runTwice(undefined);
    expect(dark.first.roots.length).toBeGreaterThan(0);
    expect(dark.second.roots).toEqual(dark.first.roots);
    expect(dark.second.world).toBe(dark.first.world);
  });

  test('THE NEGATIVES: the proposal ring, the advance sequence and the snapshot-revert door are untouched', async () => {
    const lit = storeWith(LIT);
    await lit.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW, epoch: EPOCH_A });
    const dark = storeWith(undefined);
    await dark.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW, epoch: EPOCH_A });

    // §3c row 2: EP touches neither advanceSeqByCampaign nor the proposal undo ring, so
    // both are identical across the flag — the epoch changes what is drawn, never the
    // bookkeeping that decides what can be walked back.
    expect(lit.getState().advanceSeqByCampaign).toEqual(dark.getState().advanceSeqByCampaign);
    expect(lit.getState().proposalUndoStack || []).toEqual(dark.getState().proposalUndoStack || []);
    // NON-VACUITY: the sequence really was written, so the equality above compares something.
    expect(Number(lit.getState().advanceSeqByCampaign?.['camp-1'] || 0)).toBeGreaterThan(0);

    // §3c row 5: the per-settlement version-snapshot revert is the only durable
    // per-entity walk-back in the product and it restores ONE settlement's dossier, never
    // campaign.worldState — so it cannot carry an advance epoch. Asserted as a source
    // negative so a later wave that hands it one reds here.
    const doorSrc = readFileSync(join(ROOT, 'src/store/settlementVersionHistoryActions.js'), 'utf8');
    // anchored: the door module is proven to be the real one, and non-empty, on the two lines below
    expect(doorSrc.includes('advanceEpoch')).toBe(false);
    expect(doorSrc).toContain('revertToSnapshot');
    expect(doorSrc.length).toBeGreaterThan(200);
  });
});
