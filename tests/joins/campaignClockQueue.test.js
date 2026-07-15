/**
 * campaignClockQueue.test.js — Campaign-clock Phase C1.
 *
 * The world map is the campaign clock. A settlement bound to a CANONIZED
 * campaign world surrenders its independent timeline: events authored on it do
 * not resolve immediately — they queue as pending intentions and resolve
 * simultaneously with every other member at the next world-pulse advance
 * (drainQueuedEvents). Pre-world-canon (non-clock-bound), events still apply
 * immediately (the bridge-inverse path covered in undoLastEvent.test.js).
 *
 * These tests pin: (1) the queue branch in applyEvent, (2) cancel-before-tick,
 * (3) the simultaneous drain at advanceCampaignWorld, including the crisis-twin
 * injection that relocates from author time to tick time.
 */
import { beforeAll, beforeEach, describe, test, expect, vi } from 'vitest';
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

// Multi-tick is GA (default-on in flags.js). This file pins the LEGACY single-tick
// clock-queue drain/undo semantics ("one advance = one tick"); mock the flag OFF so
// its assertions stay byte-exact.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? false : false)),
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { edgeIdFor } from '../../src/domain/region/graph.js';
import { drainQueuedEvents } from '../../src/domain/events/drainQueuedEvents.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

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
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
    ...createSettlementSlice(...a),
  })));
}

function fixture(name = 'Ashford') {
  return {
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryImports: [], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [{ faction: 'Council', category: 'governance', power: 60 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [],
  };
}

function memberSave(id, { phase = 'canon' } = {}) {
  return {
    id,
    name: id,
    tier: 'town',
    settlement: fixture(id),
    seed: `${id}-seed`,
    campaignState: {
      phase, eventLog: [], systemState: null, locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: phase === 'canon' ? '2026-01-01T00:00:00.000Z' : null,
      lastExportAt: null,
    },
  };
}

/** Seed a campaign + member saves; canonize the WORLD iff worldCanon. */
function seed(store, { ids = ['ashford'], worldCanon = true } = {}) {
  store.setState(state => {
    state.savedSettlements = ids.map(id => memberSave(id));
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: [...ids],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'clock-seed', tick: 0,
        canonizedAt: worldCanon ? '2026-01-01T00:00:00.000Z' : null,
      },
    }];
  });
  // Open the first member as the active settlement (canon).
  store.getState().hydrateFromSave(store.getState().savedSettlements[0]);
  return store;
}

const stressorEvent = (id, type = 'under_siege') => ({
  id,
  type: 'APPLY_STRESSOR',
  targetId: type,
  payload: { stressorType: type, label: 'Under Siege', severity: 0.7 },
  cause: 'player_action',
});

const worldOf = (store) => store.getState().campaigns[0].worldState;
const pendingOf = (store) => worldOf(store).pendingEvents || [];

describe('campaign-clock: clock-bound settlements queue events (Phase C1)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('a clock-bound event is queued, not applied immediately', () => {
    const store = seed(makeStore(), { worldCanon: true });
    expect(store.getState().isSettlementClockBound('ashford')).toBe(true);

    const ret = store.getState().applyEvent(stressorEvent('ev-1'));

    // Returned a queue marker, not a log entry.
    expect(ret).toMatchObject({ queued: true, campaignId: 'camp-1' });
    // Queued on the campaign; nothing resolved locally or in the world yet.
    expect(pendingOf(store)).toHaveLength(1);
    expect(pendingOf(store)[0].saveId).toBe('ashford');
    expect(store.getState().eventLog).toHaveLength(0);
    expect((store.getState().settlement.stress || [])).toHaveLength(0);
    expect(worldOf(store).stressors || []).toHaveLength(0);
  });

  test('pre-world-canon (not clock-bound) still applies immediately', () => {
    const store = seed(makeStore(), { worldCanon: false });
    expect(store.getState().isSettlementClockBound('ashford')).toBe(false);

    store.getState().applyEvent(stressorEvent('ev-imm'));

    // Immediate path: logged locally + bridged into the world at author time.
    expect(store.getState().eventLog).toHaveLength(1);
    expect(pendingOf(store)).toHaveLength(0);
    expect((worldOf(store).stressors || []).length).toBeGreaterThan(0);
  });

  test('a queued intention can be cancelled before the tick', () => {
    const store = seed(makeStore(), { worldCanon: true });
    const { queueId } = store.getState().applyEvent(stressorEvent('ev-cancel'));
    expect(pendingOf(store)).toHaveLength(1);

    const removed = store.getState().cancelQueuedEvent('camp-1', queueId);
    expect(removed).toBe(true);
    expect(pendingOf(store)).toHaveLength(0);
  });

  test('the advance drains every queued intention simultaneously, then clears the queue', async () => {
    const store = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });

    // Queue one event on each member (the active one via applyEvent, the other
    // directly through the campaign action — both land on the same queue).
    store.getState().applyEvent(stressorEvent('ev-a', 'under_siege'));
    store.getState().queueSettlementEvent('brookmere', stressorEvent('ev-b', 'plague_outbreak'));
    expect(pendingOf(store)).toHaveLength(2);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // Queue drained; the tick advanced.
    expect(pendingOf(store)).toHaveLength(0);
    expect(worldOf(store).tick).toBe(1);

    // Each member logged its drained event at the tick.
    const byId = Object.fromEntries(store.getState().savedSettlements.map(s => [s.id, s]));
    expect((byId.ashford.campaignState.eventLog || []).length).toBeGreaterThanOrEqual(1);
    expect((byId.brookmere.campaignState.eventLog || []).length).toBeGreaterThanOrEqual(1);
    // The drained entries are stamped as tick-resolved.
    expect((byId.ashford.campaignState.eventLog || []).some(e => e.viaTick === 0)).toBe(true);
  });

  test('a queued crisis injects its roaming twin at drain time, not author time', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    store.getState().applyEvent(stressorEvent('ev-crisis', 'under_siege'));
    // Not in the world yet — only queued.
    expect(worldOf(store).stressors || []).toHaveLength(0);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // The twin landed during the drain and the pulse carried it forward.
    expect((worldOf(store).stressors || []).length).toBeGreaterThan(0);
    expect(pendingOf(store)).toHaveLength(0);
  });
});

describe('campaign-clock: undo last world-pulse advance (Phase C2)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('undo reverses the last advance — tick, world, and the drained queue return', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    store.getState().applyEvent(stressorEvent('ev-undo'));
    expect(pendingOf(store)).toHaveLength(1);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(worldOf(store).tick).toBe(1);
    expect(pendingOf(store)).toHaveLength(0); // drained
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);

    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(worldOf(store).tick).toBe(0);            // back to pre-pulse
    expect(pendingOf(store)).toHaveLength(1);        // the queued intention returned
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('multi-step: two advances undo one tick at a time', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(worldOf(store).tick).toBe(2);

    await store.getState().undoLastPulse('camp-1');
    expect(worldOf(store).tick).toBe(1);
    await store.getState().undoLastPulse('camp-1');
    expect(worldOf(store).tick).toBe(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('undo reverts the active settlement view to its pre-pulse timeline', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    store.getState().applyEvent(stressorEvent('ev-active', 'plague_outbreak'));
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    // The drained event logged onto the active settlement at the tick.
    expect((store.getState().eventLog || []).length).toBeGreaterThan(0);

    await store.getState().undoLastPulse('camp-1');
    // Pre-pulse the event was queued, not logged — the timeline is empty again.
    expect(store.getState().eventLog).toHaveLength(0);
  });

  test('undo is a no-op when there is no advance to reverse', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(false);
  });
});

describe('campaign-clock: Phase C review-fix regressions', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('per-campaign undo cap — churn in one campaign cannot evict another campaign\'s undo point', async () => {
    const store = makeStore();
    store.setState(state => {
      state.savedSettlements = [memberSave('a'), memberSave('b')];
      state.campaigns = [
        { id: 'camp-A', name: 'A', settlementIds: ['a'], regionalGraph: ensureRegionalGraph(),
          wizardNews: { currentTick: 0, entries: [] },
          worldState: { rngSeed: 'A', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' } },
        { id: 'camp-B', name: 'B', settlementIds: ['b'], regionalGraph: ensureRegionalGraph(),
          wizardNews: { currentTick: 0, entries: [] },
          worldState: { rngSeed: 'B', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' } },
      ];
    });
    // camp-A advances once (its sole undo point), then camp-B churns past the cap.
    await store.getState().advanceCampaignWorld('camp-A', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    for (let i = 0; i < 11; i++) {
      await store.getState().advanceCampaignWorld('camp-B', 'one_month', { now: `2026-03-${String(i + 1).padStart(2, '0')}T00:00:00.000Z` });
    }
    // Global FIFO would have evicted camp-A's oldest snapshot; per-campaign cap keeps it.
    expect(store.getState().canUndoLastPulse('camp-A')).toBe(true);
    expect(store.getState().canUndoLastPulse('camp-B')).toBe(true);
  });

  test('undo reverts the live view for the currently-open member even after switching members', async () => {
    const store = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });
    // ashford is active from seed; advance, then open brookmere and undo.
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    store.getState().hydrateFromSave(store.getState().savedSettlements.find(s => s.id === 'brookmere'));
    await store.getState().undoLastPulse('camp-1');
    // The live view (brookmere) must agree with brookmere's restored saved record.
    const savedBrook = store.getState().savedSettlements.find(s => s.id === 'brookmere');
    expect(JSON.stringify(store.getState().settlement)).toBe(JSON.stringify(savedBrook.settlement));
  });

  test('removing a settlement from its campaign drops its queued intentions', () => {
    const store = seed(makeStore(), { worldCanon: true });
    store.getState().applyEvent(stressorEvent('ev-rm'));
    expect(pendingOf(store)).toHaveLength(1);
    store.getState().removeFromCampaign('camp-1', 'ashford');
    expect((store.getState().campaigns[0].worldState.pendingEvents || [])).toHaveLength(0);
  });

  test('drainQueuedEvents surfaces party-impact actions for party-caused events', () => {
    const saves = [{ id: 'ashford', settlement: fixture('ashford'), campaignState: { eventLog: [], systemState: null } }];
    const queue = [{
      queueId: 'q1', saveId: 'ashford',
      event: { id: 'e1', type: 'KILL_NPC', targetId: 'reeve', partyCaused: true, description: 'slain in the coup' },
    }];
    const out = drainQueuedEvents({ queue, saves, now: '2026-02-01T00:00:00.000Z', tick: 0 });
    expect(out.partyImpacts).toHaveLength(1);
    expect(out.partyImpacts[0].originSettlementId).toBe('ashford');
    expect(out.partyImpacts[0].action.kind).toBe('remove_npc');
    // Non-party events surface nothing.
    const out2 = drainQueuedEvents({
      queue: [{ queueId: 'q2', saveId: 'ashford', event: { id: 'e2', type: 'KILL_NPC', targetId: 'reeve' } }],
      saves, now: '2026-02-01T00:00:00.000Z', tick: 0,
    });
    expect(out2.partyImpacts).toHaveLength(0);
  });

  test('a queued RESOLVE_STRESSOR emits its residual-aftermath proposal at drain', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    // Queue an onset then a resolve of the same crisis; both drain at the tick.
    store.getState().applyEvent(stressorEvent('ev-on', 'famine'));
    store.getState().applyEvent({
      id: 'ev-off', type: 'RESOLVE_STRESSOR', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine' }, cause: 'player_action',
    });
    expect(pendingOf(store)).toHaveLength(2);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // The resolution queued its residual aftermath as a pending proposal —
    // matching the immediate resolveCampaignStressor path.
    const proposals = (worldOf(store).proposals || []).filter(p => p.status === 'pending');
    expect(proposals.length).toBeGreaterThan(0);
  });

  test('#4: a queued authored-delta event re-layers its deltas onto the post-pulse systemState', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    // APPLY_STRESSOR (under_siege) carries authored deltas (externalThreat +11)
    // that deriveSystemState alone cannot reproduce.
    store.getState().applyEvent(stressorEvent('ev-cut', 'under_siege'));
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    const active = store.getState().savedSettlements.find(s => s.id === 'ashford');
    expect((active.campaignState.eventLog || []).length).toBeGreaterThan(0); // drained + logged
    // The authored externalThreat delta survives in the dossier systemState — it
    // is NOT the bare structural derive (which discards authored deltas: #4 bug).
    const bare = deriveSystemState(active.settlement);
    expect(active.campaignState.systemState.externalThreat.value)
      .toBeGreaterThan(bare.externalThreat.value);
  });

  test('#4: re-layered deltas decay on the next advance — no over-persistence, no double-count', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    store.getState().applyEvent(stressorEvent('ev-x', 'under_siege'));
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    // Second advance with an empty queue: no event to re-layer, so the authored
    // delta is not re-applied — externalThreat returns to the bare derive (this
    // mirrors the immediate path losing authored deltas at its next pulse, and
    // proves the re-layer is once-only, not a persistent double-count).
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    const active = store.getState().savedSettlements.find(s => s.id === 'ashford');
    const bare = deriveSystemState(active.settlement);
    expect(active.campaignState.systemState.externalThreat.value).toBe(bare.externalThreat.value);
  });
});

// ── Lane-2 drain-path parity (domain-events-region-1 twin) ───────────────────
// The immediate path (settlementSlice.rippleEventThroughWorld) ripples a NON-party
// DM relationship verb onto the campaign's pulse edge the instant it applies. A
// clock-bound member's identical verb QUEUES and must ripple at the tick, through
// the SAME applier — same canonical edge minting (edgeIdFor), same lastCanonEventId
// supersession stamp, same orientation. These pin the drained twin.
describe('campaign-clock: drain-path parity for canon relationship verbs (Lane-2 twin)', () => {
  // The forward ripple awaits the lazy world-engine chunk; warm it once so the
  // immediate-path comparison's fire-and-forget lands fast + deterministically.
  beforeAll(async () => {
    installLocalStorage();
    const warm = makeStore();
    await warm.getState().recordCanonRelationshipRipple('no-such-campaign', {
      event: { id: 'warm', type: 'OPENED_TRADE_ROUTE', targetId: 'x' }, homeId: 'y',
    });
  });
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  const brokeredAlliance = (id, targetId) => ({ id, type: 'BROKERED_ALLIANCE', targetId, payload: {}, cause: 'player_action' });
  const ALLY_KEY = edgeIdFor('ashford', 'brookmere'); // the canonical derivation id

  async function flushUntil(pred, timeoutMs = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (pred()) return;
      await new Promise(r => setTimeout(r, 10));
    }
  }

  test('a queued BROKERED_ALLIANCE drains into the canonical pulse edge, stamped for supersession', async () => {
    const store = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });
    store.getState().applyEvent(brokeredAlliance('ev-ally', 'brookmere'));
    // Queued — the ripple has NOT fired yet (the immediate path would have by now).
    expect(pendingOf(store)).toHaveLength(1);
    expect(worldOf(store).relationshipStates || {}).toEqual({});

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    const rel = worldOf(store).relationshipStates?.[ALLY_KEY];
    expect(rel).toBeTruthy();
    expect(rel.relationshipType).toBe('allied');
    expect(rel.lastCanonEventId).toBe('ev-ally'); // the supersession stamp landed
    // The canonical graph edge was minted (survives the tick, keyed by edgeIdFor).
    expect((store.getState().campaigns[0].regionalGraph.edges || []).some(e => e.id === ALLY_KEY)).toBe(true);
  });

  test('PARITY: a drained verb yields the same relationship content as the immediate path', async () => {
    const stripVolatile = (rel) => {
      // The WHEN fields legitimately differ (immediate fires at author-time/tick 0,
      // the drain at the tick) — compare the WHAT (type + affect + supersession).
      const { updatedAt, lastTransitionTick, recentIncidents, ...stable } = rel;
      return stable;
    };

    // IMMEDIATE: world NOT canonized ⇒ ashford non-clock-bound ⇒ ripples at author
    // time (fire-and-forget — flush it).
    const immediate = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: false });
    immediate.getState().applyEvent(brokeredAlliance('ev-par', 'brookmere'));
    await flushUntil(() => immediate.getState().campaigns[0].worldState.relationshipStates?.[ALLY_KEY]);
    const immRel = immediate.getState().campaigns[0].worldState.relationshipStates[ALLY_KEY];

    // DRAIN: world canonized ⇒ ashford clock-bound ⇒ queues, ripples at the tick
    // through the SAME applier (awaited inside advanceCampaignWorld).
    const drain = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });
    drain.getState().applyEvent(brokeredAlliance('ev-par', 'brookmere'));
    await drain.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    const drainRel = drain.getState().campaigns[0].worldState.relationshipStates[ALLY_KEY];

    expect(drainRel).toBeTruthy();
    expect(immRel).toBeTruthy();
    expect(stripVolatile(drainRel)).toEqual(stripVolatile(immRel));
    expect(drainRel.lastCanonEventId).toBe('ev-par');
    expect(immRel.lastCanonEventId).toBe('ev-par');
  });

  test('DETERMINISM (pinNow seam): two drains with the same pinned now are byte-identical, updatedAt included', async () => {
    const runOnce = async () => {
      const store = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });
      store.getState().applyEvent(brokeredAlliance('ev-det', 'brookmere'));
      await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
      return store.getState().campaigns[0].worldState.relationshipStates?.[ALLY_KEY];
    };
    const a = await runOnce();
    const b = await runOnce();
    expect(a).toBeTruthy();
    // The advance's pinned `now` threaded through the seam IS the edge's updatedAt —
    // NOT a wall-clock read. Absent the seam this would be a per-run wall stamp.
    expect(a.updatedAt).toBe('2026-02-01T00:00:00.000Z');
    // Byte-identical INCLUDING updatedAt (the pinNow collapse makes the drained
    // ripple fully deterministic — no field needs stripping).
    expect(a).toEqual(b);
  });

  test('NEGATIVE CONTROL: a drained non-relationship event mints no pulse relationship edge', async () => {
    const store = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });
    // DEPLETE_RESOURCE carries no relationship semantics ⇒ the gate surfaces nothing.
    store.getState().applyEvent({ id: 'ev-neg', type: 'DEPLETE_RESOURCE', targetId: 'iron ore', payload: {}, cause: 'player_action' });
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(worldOf(store).relationshipStates || {}).toEqual({});
  });

  test('NEGATIVE CONTROL: a party-caused relationship verb does NOT drain through the non-party path', async () => {
    const store = seed(makeStore(), { ids: ['ashford', 'brookmere'], worldCanon: true });
    // partyCaused ⇒ excluded from the non-party canon gate (it is Lane-1's territory).
    store.getState().queueSettlementEvent('ashford', { id: 'ev-party', type: 'BROKERED_ALLIANCE', targetId: 'brookmere', payload: {}, partyCaused: true, cause: 'player_action' });
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(worldOf(store).relationshipStates?.[ALLY_KEY]).toBeUndefined();
  });
});

describe('campaign-clock: THE MUTABLE DOCKET (W-COMPOSER-2 §10)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('EDIT round-trip: updateQueuedEvent replaces IN PLACE — same queueId, same drain position, id preserved', () => {
    const store = seed(makeStore(), { worldCanon: true });
    store.getState().applyEvent(stressorEvent('ev-first', 'under_siege'));
    const { queueId } = store.getState().applyEvent(stressorEvent('ev-edit-me', 'plague_outbreak'));
    store.getState().applyEvent(stressorEvent('ev-last', 'famine'));
    expect(pendingOf(store)).toHaveLength(3);
    expect(pendingOf(store)[1].queueId).toBe(queueId);

    // The edit: same event id (identity persists across edits), new dials.
    const edited = { ...stressorEvent('ev-edit-me', 'plague_outbreak'), payload: { stressorType: 'plague_outbreak', label: 'Under Plague', severity: 0.35 } };
    const ok = store.getState().updateQueuedEvent('camp-1', queueId, edited);
    expect(ok).toBe(true);

    const queue = pendingOf(store);
    expect(queue).toHaveLength(3);
    // POSITION preserved (drain order is part of the docket's meaning).
    expect(queue[1].queueId).toBe(queueId);
    expect(queue[1].event.id).toBe('ev-edit-me');
    expect(queue[1].event.payload.severity).toBe(0.35);
    // Neighbours untouched.
    expect(queue[0].event.id).toBe('ev-first');
    expect(queue[2].event.id).toBe('ev-last');
  });

  test('CANCEL is byte-identical to never-queued (worldState round-trip)', () => {
    const store = seed(makeStore(), { worldCanon: true });
    // Warm-up queue+cancel so the baseline is the ENSURED worldState shape
    // (queueSettlementEvent normalizes via ensureWorldState on first touch).
    const warm = store.getState().applyEvent(stressorEvent('ev-warm'));
    store.getState().cancelQueuedEvent('camp-1', warm.queueId);
    const before = JSON.parse(JSON.stringify(worldOf(store)));
    const { queueId } = store.getState().applyEvent(stressorEvent('ev-gone'));
    expect(pendingOf(store)).toHaveLength(1);
    expect(store.getState().cancelQueuedEvent('camp-1', queueId)).toBe(true);
    expect(JSON.parse(JSON.stringify(worldOf(store)))).toEqual(before);
    expect(store.getState().eventLog).toHaveLength(0);
  });

  test('unknown queueId edits refuse; docket mutations refuse while an advance is in flight', () => {
    const store = seed(makeStore(), { worldCanon: true });
    expect(store.getState().updateQueuedEvent('camp-1', 'pe_missing', stressorEvent('x'))).toBe(false);
    const { queueId } = store.getState().applyEvent(stressorEvent('ev-guard'));
    // Simulate an in-flight advance (the sync-prefix guard's read).
    store.setState(state => { state.advanceInFlight = ['camp-1']; });
    expect(store.getState().updateQueuedEvent('camp-1', queueId, stressorEvent('ev-guard'))).toBe(false);
    expect(store.getState().cancelQueuedEvent('camp-1', queueId)).toBe(false);
    store.setState(state => { state.advanceInFlight = []; });
    expect(store.getState().cancelQueuedEvent('camp-1', queueId)).toBe(true);
  });

  test('a LAPSED entry that reaches the drain is REFUSED VISIBLY in the advance digest — never phantom-committed, never silent', async () => {
    const store = seed(makeStore(), { worldCanon: true });
    // A doomed intention: removing a trade good the settlement never had —
    // the handler's own gate (trade_good_not_found) refuses at the tick.
    store.getState().queueSettlementEvent('ashford', {
      id: 'ev-doomed', type: 'REMOVE_TRADE_GOOD', targetId: 'moon-sugar', payload: {}, cause: 'player_action',
    });
    expect(pendingOf(store)).toHaveLength(1);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // Consumed (never re-refuses forever), NOT applied, and VISIBLY refused.
    expect(pendingOf(store)).toHaveLength(0);
    const byId = Object.fromEntries(store.getState().savedSettlements.map(s => [s.id, s]));
    expect((byId.ashford.campaignState.eventLog || []).some(e => e.event?.id === 'ev-doomed')).toBe(false);
    const feed = store.getState().campaigns[0].wizardNews;
    const refusal = (feed.entries || []).find(n => n.impactKind === 'queue_refused');
    expect(refusal).toBeTruthy();
    expect(refusal.summary).toMatch(/trade_good_not_found/);
    expect(refusal.headline).toMatch(/ashford/i);
  });
});
