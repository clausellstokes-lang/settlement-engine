/**
 * tests/store/catchUpCampaignWorld.test.js — M10b catch-up mechanism pins.
 *
 * The living/autonomous advance-on-open catch-up: computes whole weeks elapsed
 * since worldState.lastLivingAdvanceAt, caps at CATCH_UP_CAP_WEEKS, and runs that
 * many one-week ticks. The load-bearing guarantees, pinned here:
 *   • COLLAPSE (performance-scale-4, owner ruling 2026-07-14): a catch-up of N weeks
 *     runs as ONE orchestrated interval (one commit / persist / sync / undo step), not
 *     N sequential advances. Its world CONTENT is byte-identical to N manual one-week
 *     advances EXCEPT pulseHistory, which the interval collapses to ONE composed record
 *     (the intended Stage-5 persist shape); it is byte-identical to a single weeks=N
 *     orchestrated advance.
 *   • LIFECYCLE (the owner's most-bitten class — the new persisted cursor):
 *       - first open / legacy save (no cursor) SEEDS the cursor, advances nothing;
 *       - up-to-date cursor advances nothing;
 *       - past the cap advances EXACTLY the cap, and the cursor reaches `now`
 *         (calendar-advances-past-cap — no perpetual re-catch-up);
 *       - UNDO of a living advance RESTORES the prior cursor (no double-run), and a
 *         whole caught-up span is ONE undo step;
 *   • DORMANCY: a dm_advanced campaign is not_living (no catch-up) and its advance
 *     never stamps the cursor (byte-identical to pre-M10b).
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});
// F6/[test-quality-4]: the living pause-on-major tests need the MULTI-TICK advance
// path (only it PAUSES on a surfacing major; the legacy single-tick path never
// pauses). Every other test keeps that path OFF — multiTickValue defaults false and
// is reset in each beforeEach, so the existing single-tick pins are byte-unaffected.
let multiTickValue = false;
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? multiTickValue : false)),
}));
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { CATCH_UP_CAP_WEEKS } from '../../src/domain/worldPulse/simulationRules.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}
const stubSlice = () => ({
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});
function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
}
function settlement(name) {
  return {
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}
// Seed a canonized campaign. `progression` sets worldProgression; `cursor` seeds
// the M10b lastLivingAdvanceAt (undefined ⇒ absent, the first-open/legacy case).
function seedStore(store, { progression = 'autonomous', cursor } = {}) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    const worldState = {
      rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
      simulationRules: { worldProgression: progression },
    };
    if (cursor !== undefined) worldState.lastLivingAdvanceAt = cursor;
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState,
    }];
  });
}
const ws = store => store.getState().campaigns[0].worldState;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// An ISO `now` that is exactly `weeks` after 2026-01-01T00:00:00Z.
const nowAfter = weeks => new Date(Date.parse('2026-01-01T00:00:00.000Z') + weeks * WEEK_MS).toISOString();
// Poll until a predicate holds (or the tries run out) — the setActiveCampaign
// trigger fires the catch-up FIRE-AND-FORGET, so its effect settles across a few
// microtasks (the loadWorldEngine dynamic import + the advance chain).
async function waitFor(pred, { tries = 200, gapMs = 5 } = {}) {
  for (let i = 0; i < tries; i++) {
    if (pred()) return true;
    await new Promise(r => setTimeout(r, gapMs));
  }
  return pred();
}

describe('M10b catchUpCampaignWorld', () => {
  beforeEach(() => { installLocalStorage(); multiTickValue = false; });

  test('COLLAPSE (performance-scale-4): a catch-up of N weeks == ONE orchestrated interval; content matches N manual advances modulo the collapsed history', async () => {
    // performance-scale-4 COLLAPSE (owner ruling 2026-07-14 "collapse to one record"):
    // the catch-up now routes through ONE orchestrated interval of N one-week ticks
    // instead of N sequential store advances. The kernel runs the SAME N ticks in the
    // same order, so the world CONTENT is byte-identical to N manual advances — EXCEPT
    // the interval collapses pulseHistory to ONE composed record (Stage 5 policy), the
    // intended persist-shape change. This pins BOTH: content-equivalence modulo the
    // history collapse, and the collapsed-history shape itself.
    const N = 5;
    const cursor = '2026-01-01T00:00:00.000Z';
    const now = nowAfter(N); // exactly N weeks after the cursor

    // Manual: N explicit one-week advances at the same injected `now` (flag OFF ⇒ the
    // single-tick path; each appends its own pulseHistory record → N records).
    const manual = makeStore();
    seedStore(manual, { progression: 'autonomous', cursor });
    for (let i = 0; i < N; i++) {
      const r = await manual.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
      expect(r.ok !== false).toBe(true);
    }

    // Catch-up: one call that runs exactly N one-week ticks as ONE orchestrated interval.
    const caught = makeStore();
    seedStore(caught, { progression: 'autonomous', cursor });
    const res = await caught.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: N, capped: false });

    expect(ws(caught).tick).toBe(N);
    expect(ws(manual).tick).toBe(N);
    // The cursor reached `now` in both paths.
    expect(ws(caught).lastLivingAdvanceAt).toBe(now);
    expect(ws(manual).lastLivingAdvanceAt).toBe(now);

    // PIN 1 — CONTENT-EQUIVALENCE MODULO HISTORY COLLAPSE: every worldState field
    // except pulseHistory (and every member save) is byte-identical to N manual advances.
    const stripHistory = (w) => { const { pulseHistory, ...rest } = w; return rest; };
    expect(JSON.stringify(stripHistory(ws(caught)))).toBe(JSON.stringify(stripHistory(ws(manual))));
    expect(JSON.stringify(caught.getState().savedSettlements))
      .toBe(JSON.stringify(manual.getState().savedSettlements));

    // PIN 2 — THE COLLAPSED-HISTORY SHAPE: the catch-up interval writes EXACTLY ONE
    // composed pulseHistory record for the whole span; N manual advances wrote N.
    expect(ws(caught).pulseHistory.length).toBe(1);
    expect(ws(manual).pulseHistory.length).toBe(N);

    // PIN 3 — catch-up IS one orchestrated interval: byte-identical (INCLUDING the
    // collapsed history) to a single weeks=N advance through the interval orchestrator.
    const interval = makeStore();
    seedStore(interval, { progression: 'autonomous', cursor });
    await interval.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true, weeks: N });
    expect(JSON.stringify(ws(caught))).toBe(JSON.stringify(ws(interval)));
    expect(JSON.stringify(caught.getState().savedSettlements))
      .toBe(JSON.stringify(interval.getState().savedSettlements));
  });

  test('SEED: a first open (no cursor) seeds the cursor and advances nothing', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'autonomous', cursor: undefined });
    const now = nowAfter(3);
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'seeded' });
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(now);
  });

  test('UP-TO-DATE: a cursor less than a week old advances nothing', async () => {
    const store = makeStore();
    const cursor = nowAfter(2);
    seedStore(store, { progression: 'autonomous', cursor });
    // now is only 3 days after the cursor ⇒ 0 whole weeks.
    const now = new Date(Date.parse(cursor) + 3 * 24 * 60 * 60 * 1000).toISOString();
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'up_to_date' });
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(cursor); // untouched
  });

  test('CAP: 30 elapsed weeks advances EXACTLY the cap, and the calendar reaches now', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(30); // 30 > CATCH_UP_CAP_WEEKS (26)
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: CATCH_UP_CAP_WEEKS, capped: true });
    expect(ws(store).tick).toBe(CATCH_UP_CAP_WEEKS);
    // calendar-advances-past-cap: cursor reaches `now` even though the sim stopped
    // at the cap — so a returning player doesn't re-catch-up the same overflow.
    expect(ws(store).lastLivingAdvanceAt).toBe(now);
  });

  test('UNDO restores the prior catch-up cursor (no double-run)', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(4);
    // One living advance stamps the cursor forward.
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
    expect(ws(store).lastLivingAdvanceAt).toBe(now);
    expect(ws(store).tick).toBe(1);
    // Undo must restore BOTH the tick AND the cursor.
    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(cursor);
  });

  test('UNDO over a caught-up span is ONE step (performance-scale-4): a single undo restores the pre-catch-up world', async () => {
    // performance-scale-4 COLLAPSE consequence (owner understood and chose this): a
    // catch-up is now ONE orchestrated interval → ONE pre-pulse undo snapshot → ONE
    // undo step reverses the WHOLE caught-up span (pre-collapse it was N snapshots /
    // N undo steps). Pin it: after an N-week catch-up, exactly one undo restores tick,
    // cursor, world, and every member save to their pre-catch-up values.
    const N = 6;
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    // Capture the pre-catch-up world + saves for a full round-trip check. Read the
    // worldState through the ENSURING getter so it is compared apples-to-apples with the
    // post-undo state (undoLastPulse re-ensures the restored snapshot — existing
    // behavior, orthogonal to this change).
    const preWorld = JSON.stringify(store.getState().getCampaignWorldState('camp-1'));
    // Strip the per-save `timestamp` — undoLastPulse stamps a fresh restore time on the
    // saves it revives (existing behavior), so only the settlement + campaignState
    // CONTENT is the meaningful round-trip target.
    const stripTs = (saves) => JSON.stringify(saves.map(({ timestamp, ...s }) => s));
    const preSaves = stripTs(store.getState().savedSettlements);

    const now = nowAfter(N);
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: N, capped: false });
    expect(ws(store).tick).toBe(N);

    // Exactly ONE undo step exists for the whole span (one snapshot, not N).
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1').length).toBe(1);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);

    // A single undo reverses the entire catch-up back to the pre-catch-up world.
    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(cursor);
    expect(JSON.stringify(store.getState().getCampaignWorldState('camp-1'))).toBe(preWorld);
    expect(stripTs(store.getState().savedSettlements)).toBe(preSaves);
    // The one snapshot is consumed — no second step to walk back.
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('PERSIST ROUND-TRIP: a living advance persists the moved cursor — no phantom re-catch-up on reload (state-lifecycle-1)', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(3);
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
    // In-memory cursor moved (this already held pre-fix).
    expect(ws(store).lastLivingAdvanceAt).toBe(now);

    // The PERSISTED mirror (the localStorage cache written by cacheCampaignState)
    // ALSO carries the moved cursor. Pre-fix the stamp landed in a SEPARATE post-
    // advance set() AFTER cacheCampaignState ran, so the mirror kept the PRE-advance
    // cursor — the ghost this pin guards.
    const cached = campaignService.loadCached('anon');
    const persistedWs = cached.find(c => c.id === 'camp-1')?.worldState;
    expect(persistedWs?.lastLivingAdvanceAt).toBe(now);

    // Reload from the persisted mirror into a fresh store ⇒ a catch-up at the SAME
    // `now` is a no-op. Pre-fix, the stale persisted cursor re-advanced the week the
    // world already lived (a phantom week per reload).
    const reloaded = makeStore();
    reloaded.setState(state => { state.campaigns = JSON.parse(JSON.stringify(cached)); });
    const res = await reloaded.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 0 });
    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(ws(store).tick);
  });

  test('DIGEST: a multi-week catch-up stashes the "while you were away" payload (components-dossier-4)', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(3);
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 3, capped: false });
    // The transient digest field the banner reads is populated for the caught-up
    // campaign; majors is always an array (empty on a quiet advance). error null.
    const digest = store.getState().livingCatchUp;
    expect(digest).toMatchObject({ campaignId: 'camp-1', weeksCaughtUp: 3, capped: false, error: null });
    expect(Array.isArray(digest.majors)).toBe(true);
    // The digest lives at the STORE ROOT, never inside worldState — so it can never
    // reach a persisted surface (partialize omits it; goldens test worldState only).
    expect('livingCatchUp' in ws(store)).toBe(false);
  });

  test('DIGEST: a seeded / up-to-date open stashes NO digest (nothing happened)', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'autonomous', cursor: undefined });
    const now = nowAfter(3);
    await store.getState().catchUpCampaignWorld('camp-1', { now }); // seeds, advances nothing
    expect(store.getState().livingCatchUp).toBeNull();
  });

  test('DORMANCY: a dm_advanced world is not_living and its advance never stamps a cursor', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'dm_advanced', cursor: undefined });
    const now = nowAfter(10);
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: false, reason: 'not_living', weeksCaughtUp: 0 });
    expect(ws(store).tick).toBe(0);
    // A normal advance on a dm_advanced world must NOT introduce the M10b cursor.
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
    expect(ws(store).tick).toBe(1);
    expect(ws(store).lastLivingAdvanceAt).toBeUndefined();
  });
});

// experience-product-fit-1 / test-quality-5 — the PRODUCTION call site. The catch-up
// trigger moved off the WorldPulsePanel mount onto campaign activation
// (setActiveCampaign), so the world advances on every open path. The prod call site
// previously had no test; these pin it.
describe('setActiveCampaign catch-up trigger', () => {
  beforeEach(() => { installLocalStorage(); multiTickValue = false; });

  test('fires the M10b catch-up for an advancesOnOpen campaign on activation', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'autonomous', cursor: undefined });
    expect(ws(store).lastLivingAdvanceAt).toBeUndefined();
    // Activation fires the catch-up fire-and-forget; for a first open (no cursor) it
    // SEEDS the cursor — the observable proof that the living world was activated.
    store.getState().setActiveCampaign('camp-1');
    expect(store.getState().activeCampaignId).toBe('camp-1');
    await waitFor(() => ws(store).lastLivingAdvanceAt != null);
    expect(ws(store).lastLivingAdvanceAt).toBeTruthy();
  });

  test('does NOT fire for a dm_advanced (legacy) campaign — the common activation path', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'dm_advanced', cursor: undefined });
    store.getState().setActiveCampaign('camp-1');
    expect(store.getState().activeCampaignId).toBe('camp-1');
    // not_living ⇒ the sync guard returns before the sim loads; the M10b cursor never
    // appears and nothing advances. Give the fire-and-forget room to (not) run.
    await new Promise(r => setTimeout(r, 40));
    expect(ws(store).lastLivingAdvanceAt).toBeUndefined();
    expect(ws(store).tick).toBe(0);
    expect(store.getState().livingCatchUp).toBeNull();
  });
});

// test-quality-4 — the M10b LIVING half. Every test above drives 'autonomous' or
// 'dm_advanced'; this block pins the untested 'living' contract (§0.6.1 decision 2):
// during catch-up, LIVING advances routine weeks but a surfacing MAJOR PAUSES the
// catch-up for the DM (it does NOT auto-resolve, the way autonomous does), and after
// the DM resolves, a later open resumes without double-running the weeks already
// lived. The rival/hostile two-edge fixture + seed 'pause-store-seed' surfaces the
// live faction_government_challenge major (mirrors advancePauseResume); the pause
// path is the MULTI-TICK orchestrator, so these tests flip multiTickValue on.
function seedLivingPauseFixture(store, { progression = 'living' } = {}) {
  const settlementRHF = (name) => ({
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
  });
  store.setState(state => {
    state.savedSettlements = ['a', 'b', 'c'].map(id => ({
      id, name: id, phase: 'canon', settlement: settlementRHF(id),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['a', 'b', 'c'],
      // Thread a PINNED `now` into the seed (the documented ensureRegionalGraph
      // determinism-input discipline: graph.js:182 stamps edge.updatedAt with
      // `edge.updatedAt || now || nowIso()`, so an un-pinned seed mints wall-clock
      // edge stamps). Without this, two stores seeded milliseconds apart get
      // DIFFERENT edge.updatedAt values that survive verbatim into the live graph
      // AND worldState.pausedAdvance.preSnapshot.regionalGraph — flaking the
      // byte-identity determinism assertion below under gate load.
      regionalGraph: ensureRegionalGraph({ edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ] }, { now: '2026-01-01T00:00:00.000Z' }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'pause-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
        simulationRules: { worldProgression: progression },
        lastLivingAdvanceAt: '2026-01-01T00:00:00.000Z',
      },
    }];
  });
}

describe('M10b LIVING pause-on-major during catch-up', () => {
  beforeEach(() => {
    installLocalStorage();
    multiTickValue = true;
    // Determinism harden (GATE-FIX): time is a DECLARED input of the byte-identity
    // determinism claim below. Freeze ONLY `Date` (toFake:['Date'] leaves
    // setTimeout/microtasks REAL, so the awaited multi-tick advance chain is
    // unaffected) so no incidental wall-clock stamp can differ between two runs
    // milliseconds apart under gate load. The seed already pins its graph `now`;
    // this belt-and-suspenders guarantees NO other stray `new Date()` can flake it.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });
  afterEach(() => { vi.useRealTimers(); });

  test('LIVING catch-up PAUSES on a surfacing major — partial catch-up, proposals queued NOT resolved', async () => {
    const store = makeStore();
    seedLivingPauseFixture(store, { progression: 'living' });
    const ELAPSED = 12;
    const now = nowAfter(ELAPSED); // 12 < CATCH_UP_CAP_WEEKS, so no cap involved

    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res.ok).toBe(true);
    expect(res.capped).toBe(false);
    // PARTIAL: the catch-up ran SOME weeks then stopped at the first major — strictly
    // fewer than the elapsed window (the pause, not a full auto-resolved catch-up).
    expect(res.weeksCaughtUp).toBeGreaterThan(0);
    expect(res.weeksCaughtUp).toBeLessThan(ELAPSED);

    const w = ws(store);
    // The pause is PARKED for the DM: majors are queued, NOT auto-resolved (the whole
    // point of 'living'). pausedAdvance carries the pending majors + the resume cursor.
    expect(w.pausedAdvance, 'living must PAUSE (park a cursor), not auto-resolve the major').toBeTruthy();
    expect(w.pausedAdvance.pendingMajors.length).toBeGreaterThan(0);
    expect(w.tick).toBe(res.weeksCaughtUp); // world clock at the pause tick
    // calendar-advances-past-the-pause: the cursor reaches `now`, so a returning
    // player does NOT re-catch-up the paused overflow (the double-count the review names).
    expect(w.lastLivingAdvanceAt).toBe(now);

    // The "while you were away" digest reflects the partial run (banner copy).
    const digest = store.getState().livingCatchUp;
    expect(digest).toMatchObject({ campaignId: 'camp-1', weeksCaughtUp: res.weeksCaughtUp, capped: false, error: null });
    expect(Array.isArray(digest.majors)).toBe(true);
  });

  test('LIVING is DETERMINISTIC: two identical living catch-ups pause at the same week', async () => {
    const a = makeStore(); seedLivingPauseFixture(a, { progression: 'living' });
    const b = makeStore(); seedLivingPauseFixture(b, { progression: 'living' });
    const now = nowAfter(12);
    const ra = await a.getState().catchUpCampaignWorld('camp-1', { now });
    const rb = await b.getState().catchUpCampaignWorld('camp-1', { now });
    expect(ra.weeksCaughtUp).toBe(rb.weeksCaughtUp);
    expect(JSON.stringify(ws(a))).toBe(JSON.stringify(ws(b)));
  });

  test('LIVING resume CONTINUES the caught-up interval to completion (performance-scale-4), never double-running', async () => {
    // performance-scale-4 COLLAPSE behavior change: the catch-up is now ONE orchestrated
    // interval of the full elapsed span. A living pause parks the WHOLE-interval cursor
    // (ticksTotal = span), so the DM's resolveIntervalMajors RESUMES the remaining weeks
    // of that SAME interval — the catch-up finishes on resolve, rather than (pre-collapse)
    // completing only the paused week and deferring the rest to the next open. This is
    // the DM-Advance-button semantics, now shared by the catch-up. The load-bearing
    // guarantee that survives verbatim: NO WEEK IS EVER DOUBLE-RUN.
    const ELAPSED = 12;
    const store = makeStore();
    seedLivingPauseFixture(store, { progression: 'living' });
    const now = nowAfter(ELAPSED);
    const first = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(store.getState().campaigns[0].worldState.pausedAdvance).toBeTruthy();
    expect(first.weeksCaughtUp).toBeGreaterThan(0);
    expect(first.weeksCaughtUp).toBeLessThan(ELAPSED); // partial — paused mid-span

    // The DM resolves every parked major (recommended) until the interval finishes.
    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await store.getState().resolveIntervalMajors('camp-1', {}, { now });
    } while (r && r.status === 'paused');
    // The FULL elapsed span has now run: the interval completed at tick ELAPSED (not the
    // partial pause tick), and the cursor is cleared. Every week ran exactly once.
    expect('pausedAdvance' in ws(store)).toBe(false);
    expect(ws(store).tick).toBe(ELAPSED);

    // Re-open at the SAME `now`: the cursor already reached it (stamped at the pause), so
    // this is a no-op — no week is re-simulated (the double-count the review names).
    const again = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(again).toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'up_to_date' });
    expect(ws(store).tick).toBe(ELAPSED);

    // Re-open LATER (real time advanced +2 weeks): the world advances ONLY the new time,
    // never re-simulating the weeks already lived. It may pause again on a fresh major,
    // so assert the no-double-count invariant (tick = ELAPSED + weeks committed) rather
    // than a fixed count.
    const later = nowAfter(ELAPSED + 2);
    const resume = await store.getState().catchUpCampaignWorld('camp-1', { now: later });
    expect(resume.ok).toBe(true);
    expect(resume.weeksCaughtUp).toBeGreaterThan(0);
    expect(resume.weeksCaughtUp).toBeLessThanOrEqual(2);
    expect(ws(store).tick).toBe(ELAPSED + resume.weeksCaughtUp);
  });

  test('CONTRAST — AUTONOMOUS auto-resolves the SAME majors: full catch-up, no pause', async () => {
    // Same fixture, same seed, same elapsed window — only the progression axis differs.
    // Proves the pause above is the LIVING semantics, not fixture noise.
    const store = makeStore();
    seedLivingPauseFixture(store, { progression: 'autonomous' });
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now: nowAfter(12) });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 12, capped: false });
    expect('pausedAdvance' in ws(store)).toBe(false);
    expect(ws(store).tick).toBe(12);
  });
});
