/**
 * settlementSlice ⇄ campaign world-pulse — Lane 2 of [domain-events-region-1]:
 * a NON-party DM canon relationship event lands the corresponding pulse
 * relationship edge on the live campaign, and undoLastEvent reverses it.
 *
 * Contracts pinned here:
 *   1. OPENED_TRADE_ROUTE on a linked neighbour WARMS the pulse edge (relabels the
 *      regionalGraph edge + upserts worldState.relationshipStates to the chosen
 *      type with a positive affective nudge).
 *   2. OPENED_TRADE_ROUTE to a NOT-yet-linked settlement CREATES the pulse edge
 *      (relationshipStates entry only — no graph edge to relabel).
 *   3. SETTLEMENT_DISPUTE SOURS the edge (rival + resentment up).
 *   4. BROKERED_ALLIANCE sets 'allied'.
 *   5. APPLY_STRESSOR carrying an instigator sours that neighbour to 'hostile'.
 *   6. UNDO reverses the ripple: a warmed edge returns to its prior type, a
 *      CREATED edge's relationshipState is deleted.
 *   7. DORMANCY: no campaign / a party-caused event / a non-relationship event
 *      leaves the pulse untouched.
 *   8. DETERMINISM: same event on same state ⇒ same relationshipState.
 *
 * The forward ripple is an async, fire-and-forget bridge from
 * rippleEventThroughWorld (it rides the lazy world-engine chunk); the pins flush
 * it. The undo reversal is synchronous. Store assembly mirrors
 * settlementSlice.stressorBridge.test.js.
 */

import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => {
        cached.set(ownerId, clone(campaigns));
      }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

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
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
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

// The forward ripple is fire-and-forget and awaits the lazy world-engine chunk.
// Poll until a predicate holds (positive cases) or a fixed real delay (negative
// cases, once the lazy chunk is warmed so a ripple that WOULD fire has landed).
async function flushUntil(pred, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (pred()) return;
    await new Promise(r => setTimeout(r, 10));
  }
}
async function flushFixed(ms = 200) {
  await new Promise(r => setTimeout(r, ms));
}

function fixture(name, neighbours = []) {
  return {
    tier: 'town',
    name,
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }], conflicts: [] },
    npcs: [],
    activeConditions: [],
    neighbourNetwork: neighbours,
  };
}

function saveFor(id, name, neighbours) {
  return {
    id,
    name,
    tier: 'town',
    settlement: fixture(name, neighbours),
    seed: `${id}-seed`,
    campaignState: {
      phase: 'canon',
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z',
      lastExportAt: null,
    },
  };
}

// Seed a two-settlement canon campaign. `edge` optionally pre-links Ashford↔Briar
// in the regional graph so the ripple RELABELS an existing pulse edge; without it
// the ripple CREATES the edge (relationshipStates only).
function seedStore(store, { edge = null } = {}) {
  const ashford = saveFor('ashford', 'Ashford', edge ? [{ id: 'briar', name: 'Briar', relationshipType: 'neutral' }] : []);
  const briar = saveFor('briar', 'Briar', []);
  store.setState(state => {
    state.savedSettlements = [ashford, briar];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['ashford', 'briar'],
      regionalGraph: edge
        ? ensureRegionalGraph({ edges: [{ id: 'edge.ashford.briar', from: 'ashford', to: 'briar', relationshipType: 'neutral', type: 'neutral' }] })
        : ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      // Un-canonized WORLD → Ashford stays non-clock-bound and its events resolve
      // at author time (the immediate rippleEventThroughWorld path fires).
      worldState: { rngSeed: 'rel-seed', tick: 0, canonizedAt: null },
    }];
  });
  store.getState().hydrateFromSave(ashford);
  return store;
}

const EDGE_KEY = 'edge.ashford.briar';       // relationshipKeyFromEdge(existing edge) = edge.id
// The CREATE case mints the real edge under the CANONICAL derivation id
// (edgeIdFor(home, target)) — so the state entry keys identically and survives
// pulseKernel's ensureRelationshipStatesForGraph rebuild (edges-only).
const CREATE_KEY = 'edge.ashford.briar';

function relEvent(store, { id, type, targetId, payload }) {
  return store.getState().applyEvent({ id, type, targetId, payload, cause: 'player_action' });
}

describe('Lane 2 — non-party canon relationship ripple → pulse edge', () => {
  beforeAll(async () => {
    installLocalStorage();
    // Warm the memoized lazy world-engine chunk once (a no-op call on a
    // nonexistent campaign) so the fire-and-forget ripples in the tests below
    // land fast + deterministically — the FIRST dynamic import is ~600ms.
    const warm = makeStore();
    await warm.getState().recordCanonRelationshipRipple('no-such-campaign', {
      event: { id: 'warm', type: 'OPENED_TRADE_ROUTE', targetId: 'x' }, homeId: 'y',
    });
  });
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('OPENED_TRADE_ROUTE warms an existing pulse edge (relabel + nudge)', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-tr-1', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'trade_partners' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);

    const ws = store.getState().campaigns[0].worldState;
    const rel = ws.relationshipStates[EDGE_KEY];
    expect(rel).toBeTruthy();
    expect(rel.relationshipType).toBe('trade_partner');      // plural canonicalized
    // Warmer than a bare neutral edge: trade_partner defaults + the positive nudge.
    expect(rel.trust).toBeGreaterThan(0.45);
    expect(rel.trajectory).toBe('thawing');

    // The regional graph edge relabelled to match.
    const graphEdge = store.getState().campaigns[0].regionalGraph.edges.find(e => e.id === EDGE_KEY);
    expect(graphEdge.relationshipType).toBe('trade_partner');
  });

  test('OPENED_TRADE_ROUTE to an unlinked settlement CREATES the pulse edge', async () => {
    const store = seedStore(makeStore(), { edge: false });
    relEvent(store, { id: 'ev-tr-2', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'trade_partner' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[CREATE_KEY]);

    const ws = store.getState().campaigns[0].worldState;
    const rel = ws.relationshipStates[CREATE_KEY];
    expect(rel).toBeTruthy();
    expect(rel.relationshipType).toBe('trade_partner');
    expect(rel.trust).toBeGreaterThan(0.45);
    // The ripple CREATED the real graph edge under the canonical derivation id,
    // and minted its relationship channel bundle (trade_route + information_flow).
    const graph = store.getState().campaigns[0].regionalGraph;
    const created = (graph.edges || []).find(e => e.id === CREATE_KEY);
    expect(created).toBeTruthy();
    expect(created.relationshipType).toBe('trade_partner');
    const bundleChannels = (graph.channels || []).filter(ch => ch.relationshipKey === CREATE_KEY);
    expect(bundleChannels.length).toBeGreaterThan(0);
  });

  test('a CREATED pulse edge survives one world advance (kernel rebuild keeps it)', async () => {
    const store = seedStore(makeStore(), { edge: false });
    relEvent(store, { id: 'ev-adv-1', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'trade_partner' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[CREATE_KEY]);

    // NEGATIVE CONTROL: an EDGELESS relationshipState entry (the pre-fix shape —
    // a bespoke key with no backing graph edge) must be DROPPED by the same
    // kernel rebuild, proving the survival assertion below is non-vacuous.
    store.setState(state => {
      state.campaigns[0].worldState.relationshipStates['rel.ghost.key'] = { relationshipType: 'allied', trust: 0.9 };
    });

    // Canonize AFTER the immediate apply (canonizing first would clock-bind the
    // settlement and queue the event), then run one real pulse tick. The kernel's
    // ensureRelationshipStatesForGraph rebuilds relationshipStates from
    // graph.edges — the created edge is what keeps the entry alive.
    await store.getState().canonizeCampaignWorld('camp-1');
    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: '2026-02-01T00:00:00.000Z' });
    expect(result).toBeTruthy();

    const ws = store.getState().campaigns[0].worldState;
    expect(ws.tick).toBeGreaterThan(0);
    // The rebuild fired (the edgeless ghost is gone) AND the created edge's
    // entry survived it — exactly the transient-no-op class the fix closes.
    expect(ws.relationshipStates['rel.ghost.key']).toBeUndefined();
    const rel = ws.relationshipStates[CREATE_KEY];
    expect(rel).toBeTruthy();
    expect(rel.relationshipType).toBe('trade_partner');
    expect((store.getState().campaigns[0].regionalGraph.edges || []).some(e => e.id === CREATE_KEY)).toBe(true);
  });

  test("a 'client'-shaped type normalizes: state and edge agree on 'patron', stamps carry direction", async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-cl-1', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'client' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);

    const rel = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    // normalizeRelationshipEdge's rule, viewer-relative: home picked 'client' ⇒
    // home IS the client, the target is the patron — stored canonically.
    expect(rel.relationshipType).toBe('patron');
    expect(rel.patronSaveId).toBe('briar');
    expect(rel.clientSaveId).toBe('ashford');
    // The graph edge label agrees with the state (never the raw 'client').
    const graphEdge = store.getState().campaigns[0].regionalGraph.edges.find(e => e.id === EDGE_KEY);
    expect(graphEdge.relationshipType).toBe('patron');
    // The channel bundle is patron-oriented: political_authority flows FROM the
    // patron (briar) toward the client (ashford).
    const authority = (store.getState().campaigns[0].regionalGraph.channels || [])
      .find(ch => ch.relationshipKey === EDGE_KEY && ch.type === 'political_authority');
    expect(authority?.from).toBe('briar');
    expect(authority?.to).toBe('ashford');
  });

  test('SETTLEMENT_DISPUTE sours the edge', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-sd-1', type: 'SETTLEMENT_DISPUTE', targetId: 'briar', payload: { relationshipType: 'rival' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);

    const rel = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    expect(rel.relationshipType).toBe('rival');
    expect(rel.resentment).toBeGreaterThan(0.45);
    expect(rel.trajectory).toBe('deteriorating');
  });

  test('BROKERED_ALLIANCE sets allied', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-ba-1', type: 'BROKERED_ALLIANCE', targetId: 'briar', payload: {} });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);

    const rel = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    expect(rel.relationshipType).toBe('allied');
    expect(rel.trust).toBeGreaterThan(0.45);
  });

  test('APPLY_STRESSOR with an instigator sours that neighbour to hostile', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, {
      id: 'ev-as-1', type: 'APPLY_STRESSOR', targetId: 'siege',
      payload: { stressorType: 'siege', instigatorNeighbour: 'briar', label: 'Under Siege', severity: 0.8 },
    });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);

    const rel = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    expect(rel.relationshipType).toBe('hostile');
    expect(rel.resentment).toBeGreaterThan(0.45);
  });

  test('UNDO reverses a warmed edge back to its prior type', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-undo-1', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'trade_partner' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);
    expect(store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY].relationshipType).toBe('trade_partner');

    store.getState().undoLastEvent();
    // The reverse is async (rides the lazy chunk) — flush it.
    await flushUntil(() => !store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);

    // The pre-ripple edge had no relationshipState entry, so undo DELETES it,
    // and the graph edge label returns to 'neutral'.
    expect(store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY]).toBeUndefined();
    const graphEdge = store.getState().campaigns[0].regionalGraph.edges.find(e => e.id === EDGE_KEY);
    expect(graphEdge.relationshipType).toBe('neutral');
  });

  test('UNDO deletes a CREATED pulse edge — state, graph edge, and channel bundle', async () => {
    const store = seedStore(makeStore(), { edge: false });
    relEvent(store, { id: 'ev-undo-2', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'trade_partner' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[CREATE_KEY]);
    expect((store.getState().campaigns[0].regionalGraph.edges || []).some(e => e.id === CREATE_KEY)).toBe(true);

    store.getState().undoLastEvent();
    await flushUntil(() => !store.getState().campaigns[0].worldState.relationshipStates?.[CREATE_KEY]);
    expect(store.getState().campaigns[0].worldState.relationshipStates[CREATE_KEY]).toBeUndefined();
    // The created edge and every channel its bundle minted are gone — the pair
    // returns to unlinked, byte-consistent with never having seen the event.
    const graph = store.getState().campaigns[0].regionalGraph;
    expect((graph.edges || []).some(e => e.id === CREATE_KEY)).toBe(false);
    expect((graph.channels || []).some(ch => ch.relationshipKey === CREATE_KEY)).toBe(false);
  });

  test('SUPERSESSION GUARD: a stale undo snapshot cannot clobber a later writer', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-sup-1', type: 'SETTLEMENT_DISPUTE', targetId: 'briar', payload: { relationshipType: 'rival' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]?.relationshipType === 'rival');

    // A stale snapshot claiming a DIFFERENT event wrote the key (e.g. an undo
    // whose forward was superseded by ev-sup-1) must no-op, not restore.
    const result = await store.getState().reverseCanonRelationshipRipple('camp-1', {
      key: EDGE_KEY, from: 'ashford', to: 'briar',
      eventId: 'ev-somebody-else', edgeCreated: false,
      priorRelState: null, priorEdgeType: 'neutral',
    });
    expect(result).toBeNull();
    const rel = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    expect(rel.relationshipType).toBe('rival');       // the later writer's value survives
    const graphEdge = store.getState().campaigns[0].regionalGraph.edges.find(e => e.id === EDGE_KEY);
    expect(graphEdge.relationshipType).toBe('rival');
  });

  test('UNDO restores a PRIOR relationshipState the second event overwrote', async () => {
    const store = seedStore(makeStore(), { edge: true });
    // First: broker an alliance (creates the pulse edge as 'allied').
    relEvent(store, { id: 'ev-ov-1', type: 'BROKERED_ALLIANCE', targetId: 'briar', payload: {} });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);
    const allied = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    expect(allied.relationshipType).toBe('allied');
    // Second: a dispute overwrites it to 'rival'.
    relEvent(store, { id: 'ev-ov-2', type: 'SETTLEMENT_DISPUTE', targetId: 'briar', payload: { relationshipType: 'rival' } });
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]?.relationshipType === 'rival');

    // Undo the dispute → the 'allied' state the dispute overwrote returns verbatim.
    store.getState().undoLastEvent();
    await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]?.relationshipType === 'allied');
    const restored = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
    expect(restored.relationshipType).toBe('allied');
    expect(restored.trust).toBe(allied.trust);
    // Undo the alliance too → the created edge is gone.
    store.getState().undoLastEvent();
    await flushUntil(() => !store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);
    expect(store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY]).toBeUndefined();
  });

  test('ORPHAN GUARD: undo BEFORE the async ripple lands leaves the pulse clean', async () => {
    const store = seedStore(makeStore(), { edge: true });
    relEvent(store, { id: 'ev-orph-1', type: 'OPENED_TRADE_ROUTE', targetId: 'briar', payload: { relationshipType: 'trade_partner' } });
    // Undo SYNCHRONOUSLY, before flushing the fire-and-forget ripple: the event
    // is popped, so the ripple's orphan guard must skip when it finally runs.
    store.getState().undoLastEvent();
    await flushFixed(300);
    expect(store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]).toBeUndefined();
    const graphEdge = store.getState().campaigns[0].regionalGraph.edges.find(e => e.id === EDGE_KEY);
    expect(graphEdge.relationshipType).toBe('neutral');
  });

  test('DORMANCY: a non-relationship event leaves the pulse untouched and stamps no undo snapshot', async () => {
    const store = seedStore(makeStore(), { edge: true });
    const result = relEvent(store, { id: 'ev-dorm-1', type: 'DEPLETE_RESOURCE', targetId: 'iron ore', payload: {} });
    await flushFixed();

    expect(store.getState().campaigns[0].worldState.relationshipStates || {}).toEqual({});
    // No relationshipRipple undo snapshot on the logged entry.
    const entry = store.getState().eventLog.find(e => e?.event?.id === 'ev-dorm-1');
    expect(entry?.undo?.relationshipRipple).toBeUndefined();
    expect(result).toBeTruthy();
  });

  test('DORMANCY: a party-caused relationship event does not fire the non-party ripple', async () => {
    const store = seedStore(makeStore(), { edge: true });
    store.getState().applyEvent({
      id: 'ev-party-1', type: 'OPENED_TRADE_ROUTE', targetId: 'briar',
      payload: { relationshipType: 'trade_partner' }, partyCaused: true, cause: 'player_action',
    });
    await flushFixed();
    // The non-party ripple is gated off; the party path (Lane 1) is not wired on
    // this branch, so the pulse edge stays untouched.
    expect(store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]).toBeUndefined();
  });

  test('DETERMINISM: the same event on the same state yields the same relationshipState', async () => {
    const runOnce = async () => {
      const store = seedStore(makeStore(), { edge: true });
      relEvent(store, { id: 'ev-det', type: 'SETTLEMENT_DISPUTE', targetId: 'briar', payload: { relationshipType: 'cold_war' } });
      await flushUntil(() => store.getState().campaigns[0].worldState.relationshipStates?.[EDGE_KEY]);
      const rel = store.getState().campaigns[0].worldState.relationshipStates[EDGE_KEY];
      // updatedAt is a wall-clock stamp — exclude it from the determinism compare.
      const { updatedAt, ...stable } = rel;
      return stable;
    };
    const a = await runOnce();
    const b = await runOnce();
    expect(a).toEqual(b);
  });
});
