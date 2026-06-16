/**
 * Join harness — crisis triple-sync BY CONSTRUCTION (Wave 8 #4).
 *
 * One authored crisis lives as THREE representations: the settlement's
 * stress-container entry, the promoted activeCondition, and the roaming
 * campaign stressor twin. They used to be kept agreeing by hand-maintained
 * conventions at four chokepoints — the severity drift, the undo-twin gap,
 * and the never-resolving local entry were each found (and individually
 * patched) in that seam. domain/crisisLifecycle.js is the structural cure:
 * every transition (onset / escalate / resolve / withdraw) returns the
 * settlement half and the declarative twinDirective TOGETHER, and the store
 * consumes directives at one chokepoint per direction.
 *
 * This file is the construction guarantee, in two parts:
 *
 *   1. THE MATRIX — for (onset | escalate | resolve | undo) ×
 *      (canon | draft) × (generation-born | authored | pulse-born) crises,
 *      after every transition the three representations AGREE: entry present
 *      ⇔ live condition present for promotable types at the entry's severity
 *      (the documented collapse rule: one condition per archetype at the max
 *      entry severity); the twin tracks the authored state in canon and is
 *      NEVER touched by draft events; provenance stays coherent (event
 *      onsets own their conditions; resolutions append receipts). Includes
 *      the pulse-side asymmetry the D-wave deferred, now decided (SYNC IT):
 *      an ORGANIC world-pulse resolution winds down the origin settlement's
 *      local representations end-to-end through the real store pulse.
 *
 *   2. THE SOURCE SCAN — no file outside crisisLifecycle.js writes the trio
 *      directly. Today's legitimate sites are enumerated as frozen
 *      only-shrinks allowlists (the regionalChannelCreatable UNCREATABLE /
 *      neighbourRelDynamics CONSUMER_FILES idiom): a future event type that
 *      bypasses the lifecycle — or a new hand-rolled bridge — fails here.
 *
 * Store assembly mirrors settlementSlice.stressorBridge.test.js (real
 * campaignSlice + settlementSlice, mocked lib/saves + lib/campaigns).
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { canonStressors } from '../../src/domain/canonicalAccessors.js';
import { archetypeForStressor, promoteStressorsToConditions } from '../../src/domain/conditionPromotion.js';
import { pulseTypeForStressorKey } from '../../src/domain/stressorPicker.js';
import { crisisEscalate, crisisOnset } from '../../src/domain/crisisLifecycle.js';

const NOW = '2026-06-11T12:00:00.000Z';
const SAVE_ID = 'ashford';

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
    ...createSettlementSlice(...a),
  })));
}

function fixture() {
  return {
    tier: 'town',
    name: 'Ashford',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
    ],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [{ id: 'faction.council', name: 'Council' }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
    history: { historicalEvents: [] },
  };
}

/** A settlement GENERATED mid-famine: the entry + the GENERATION-promoted
 *  condition, exactly the pair assembleSettlement leaves behind. */
function generationFixture() {
  return promoteStressorsToConditions({
    ...fixture(),
    stress: [{ type: 'famine', name: 'Famine', label: 'Famine', severity: 0.5 }],
  });
}

// worldCanon defaults FALSE: the immediate authored crisis bridge fires on
// settlement-canon + membership and never required world canonization. Leaving
// the WORLD un-canonized keeps the settlement non-clock-bound, so authored
// events resolve at author time (the pre-world-canon path these triple-sync
// transitions cover). Pass worldCanon:true only where a real pulse must run —
// there the settlement is clock-bound and onsets QUEUE then drain at the tick.
function seedStore(store, phase, settlement = fixture(), { worldCanon = false } = {}) {
  const save = {
    id: SAVE_ID,
    name: 'Ashford',
    tier: 'town',
    settlement,
    seed: 'triple-sync-seed',
    campaignState: {
      phase,
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: phase === 'canon' ? '2026-01-01T00:00:00.000Z' : null,
      lastExportAt: null,
    },
  };
  store.setState(state => {
    state.savedSettlements = [save];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: [SAVE_ID],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'triple-sync-seed', tick: 0, canonizedAt: worldCanon ? '2026-01-01T00:00:00.000Z' : null },
    }];
  });
  store.getState().hydrateFromSave(save);
  return store;
}

const onset = (store, { id, type = 'famine', label = 'Famine', severity }) =>
  store.getState().applyEvent({
    id,
    type: 'APPLY_STRESSOR',
    targetId: type,
    payload: { stressorType: type, label, severity },
    cause: 'player_action',
  });

const resolve = (store, { id, type = 'famine', label = 'Famine' }) =>
  store.getState().applyEvent({
    id,
    type: 'RESOLVE_STRESSOR',
    targetId: type,
    payload: { stressorType: type, label },
    cause: 'player_action',
  });

/** The three representations of one crisis type, read the way their
 *  consumers read them. */
function triple(store, genType = 'famine') {
  const lower = v => String(v || '').toLowerCase();
  const s = store.getState().settlement;
  const entries = canonStressors(s).filter(st => lower(st?.type) === lower(genType));
  const archetype = archetypeForStressor({ type: genType });
  const conds = (s?.activeConditions || []).filter(c => c?.archetype === archetype);
  const roaming = pulseTypeForStressorKey(genType) || genType;
  const twins = (store.getState().campaigns[0].worldState.stressors || [])
    .filter(st => lower(st.type) === lower(roaming)
      && (String(st.originSettlementId || '') === SAVE_ID
        || (st.affectedSettlementIds || []).map(String).includes(SAVE_ID)));
  return {
    entries,
    conds,
    twins,
    activeTwins: twins.filter(st => st.status === 'active'),
    edits: s?.config?.stressorEdits ?? null,
  };
}

/** The agreement core, true after EVERY transition in every cell:
 *  one entry per type, one condition per archetype (the collapse rule), and
 *  a present entry implies a live condition at the entry's severity. */
function expectCoreAgreement(t) {
  expect(t.entries.length).toBeLessThanOrEqual(1);
  expect(t.conds.length).toBeLessThanOrEqual(1);
  expect(t.activeTwins.length).toBeLessThanOrEqual(1);
  if (t.entries.length === 1) {
    expect(t.conds).toHaveLength(1);
    expect(t.conds[0].severity).toBeCloseTo(t.entries[0].severity, 5);
    expect(t.conds[0].status).not.toBe('easing');
  }
}

beforeEach(() => {
  installLocalStorage();
  localStorage.removeItem('sf_campaigns');
});

// ── 1. The matrix ──────────────────────────────────────────────────────────

describe('canon: every transition keeps the triple agreeing', () => {
  test('AUTHORED-born: onset → escalate → resolve → undo', () => {
    const store = seedStore(makeStore(), 'canon');

    // ONSET — all three representations appear together.
    onset(store, { id: 'ev-on', severity: 0.9 });
    let t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0]).toMatchObject({ type: 'famine', severity: 0.9, source: 'event', addedByEventId: 'ev-on' });
    expect(t.conds[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    expect(t.conds[0].causes[0]).toMatchObject({ source: 'event', eventId: 'ev-on' });
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0]).toMatchObject({ id: 'world_stressor.famine.ashford', severity: 0.9 });
    expect(t.edits).toMatchObject({ resolved: [] });
    expect(t.edits.added.map(e => e.type)).toEqual(['famine']);

    // ESCALATE — a re-authored severity moves ALL THREE, never stacks.
    onset(store, { id: 'ev-esc', severity: 0.4 });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0].severity).toBe(0.4);
    expect(t.conds[0].severity).toBeCloseTo(0.4, 5);
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].severity).toBe(0.4);
    expect(t.edits.added).toHaveLength(1);
    expect(t.edits.added[0].severity).toBe(0.4);
    const preResolveStatus = t.conds[0].status;

    // RESOLVE — entry gone, condition easing with the receipt, suppression
    // recorded, twin resolved into an echo with its aftermath queued.
    resolve(store, { id: 'ev-end' });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds).toHaveLength(1);
    expect(t.conds[0].status).toBe('easing');
    expect(t.conds[0].duration.expiresAtTicks)
      .toBeLessThanOrEqual((Number(t.conds[0].duration.elapsedTicks) || 0) + 2);
    expect(t.conds[0].causes.at(-1)).toMatchObject({ source: 'event', eventId: 'ev-end' });
    expect(t.edits).toEqual({ added: [], resolved: ['famine'] });
    expect(t.activeTwins).toEqual([]);
    expect(t.twins.find(st => st.id === 'world_stressor.famine.ashford')?.status).toBe('residual');
    const pending = (store.getState().campaigns[0].worldState.proposals || [])
      .filter(p => p.status === 'pending' && p.outcome?.condition?.archetype === 'stressor_residual');
    expect(pending).toHaveLength(1);

    // UNDO — the resolution is taken back across all three: the condition
    // un-eases, the stressorEdits record returns (which is what restores the
    // live entry on the next regeneration — the documented limitation: the
    // live entry itself is not resurrected), and the twin is ACTIVE again
    // from the logEntry.undo snapshot.
    store.getState().undoLastEvent();
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds[0].status).toBe(preResolveStatus);
    expect(t.conds[0].causes.some(c => c?.eventId === 'ev-end')).toBe(false);
    expect(t.edits.resolved).toEqual([]);
    expect(t.edits.added.map(e => e.type)).toEqual(['famine']);
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].severity).toBe(0.4);
  });

  test('GENERATION-born: the authored onset takes ownership, then resolve → undo', () => {
    const store = seedStore(makeStore(), 'canon', generationFixture());

    // Baseline: generation owns the pair; no twin exists (generation never
    // registers roaming stressors — only authored events do).
    let t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0]).toMatchObject({ type: 'famine', severity: 0.5 });
    expect(t.entries[0].addedByEventId).toBeUndefined();
    expect(t.conds[0].triggeredAt.sourceEventType).toBe('GENERATION');
    expect(t.twins).toEqual([]);

    // ONSET over the generated twin — authored beats generation: ONE entry,
    // ONE condition (the GENERATION-stamped twin replaced, not doubled), and
    // the roaming twin appears at the authored severity.
    onset(store, { id: 'ev-own', severity: 0.8 });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0]).toMatchObject({ severity: 0.8, addedByEventId: 'ev-own' });
    expect(t.conds[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    expect(t.conds[0].causes[0].eventId).toBe('ev-own');
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].severity).toBe(0.8);
    const preResolveStatus = t.conds[0].status;

    // RESOLVE — the whole triple ends together.
    resolve(store, { id: 'ev-done' });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds[0].status).toBe('easing');
    expect(t.edits).toEqual({ added: [], resolved: ['famine'] });
    expect(t.activeTwins).toEqual([]);

    // UNDO — back to the post-onset agreement.
    store.getState().undoLastEvent();
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.conds[0].status).toBe(preResolveStatus);
    expect(t.edits.resolved).toEqual([]);
    expect(t.edits.added.map(e => e.type)).toEqual(['famine']);
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].severity).toBe(0.8);
  });

  // The pulse-side asymmetry the D-wave deferred as an owner decision — now
  // decided: SYNC IT. The roaming twin resolving ORGANICALLY (decay under the
  // 0.08 auto-resolve floor — roll-independent) must wind down the origin
  // settlement's local representations through the same lifecycle the
  // RESOLVE_STRESSOR event uses, applied via the pulse's settlementUpdates
  // mechanism. Before this, the dossier kept showing a crisis the world had
  // already ended.
  test('PULSE-born: organic resolution reaches the origin settlement end-to-end', async () => {
    // Real pulse → the WORLD is canonized, so this settlement is clock-bound:
    // the DM's onset QUEUES and the first advance drains it into the local pair.
    const store = seedStore(makeStore(), 'canon', fixture(), { worldCanon: true });
    const NOW2 = '2026-07-11T12:00:00.000Z';

    // Organic birth proxy: the pulse registered a roaming famine at Ashford.
    store.getState().injectCampaignStressor('camp-1', {
      type: 'famine',
      label: 'Famine',
      originSettlementId: SAVE_ID,
      affectedSettlementIds: [SAVE_ID],
      severity: 0.6,
    });
    let t = triple(store);
    expectCoreAgreement(t);
    // Campaign-owned and not yet projected locally — the documented state.
    expect(t.entries).toEqual([]);
    expect(t.conds).toEqual([]);
    expect(t.activeTwins).toHaveLength(1);

    // The DM escalates it locally. Clock-bound → the onset queues; the first
    // advance DRAINS it, upserting the SAME stable twin (no stacking) at the
    // authored severity and projecting the local pair. Severity kept LOW so
    // the local entry's pressure cannot organically re-birth a fresh famine.
    onset(store, { id: 'ev-esc', severity: 0.2 });
    expect((store.getState().campaigns[0].worldState.pendingEvents || [])).toHaveLength(1);
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    t = triple(store);
    // The drain landed the local pair + the stable twin. The pulse legitimately
    // nudges a freshly-applied severity by a tick, so exact agreement is only
    // asserted post-resolution below (the test's real subject).
    expect(t.entries).toHaveLength(1);
    expect(t.entries[0].type).toBe('famine');
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].id).toBe('world_stressor.famine.ashford');

    // Force the twin resolution-ripe, then run a SECOND store pulse — organic
    // resolution winds the local pair down through settlementUpdates.
    store.setState(s => {
      const twin = s.campaigns[0].worldState.stressors.find(st => st.type === 'famine');
      twin.severity = 0.05;
      twin.age = 8;
    });
    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW2 });
    expect((result.resolvedStressors || []).some(st => st.type === 'famine')).toBe(true);

    // The origin settlement followed the world: entry gone, condition easing
    // with the world_pulse receipt, suppression recorded, no active twin.
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds).toHaveLength(1);
    expect(t.conds[0].status).toBe('easing');
    expect(t.conds[0].causes.some(c => c?.source === 'world_pulse')).toBe(true);
    expect(t.edits.added).toEqual([]);
    expect(t.edits.resolved).toEqual(['famine']);
    expect(t.activeTwins).toEqual([]);

    // …and the persisted save + the next derivation agree with the live view.
    const persisted = store.getState().savedSettlements[0].settlement;
    expect(canonStressors(persisted).some(st => st?.type === 'famine')).toBe(false);
    expect((persisted.activeConditions || []).find(c => c.archetype === 'famine')?.status).toBe('easing');
    expect(persisted.config.stressorEdits.resolved).toEqual(['famine']);
    expect(store.getState().systemState).toBeTruthy();
  });
});

describe('draft: local transitions agree locally and NEVER touch the world', () => {
  test('AUTHORED-born: onset → escalate → resolve; undo is a full no-op', () => {
    const store = seedStore(makeStore(), 'draft');

    onset(store, { id: 'ev-d-on', severity: 0.9 });
    let t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0].severity).toBe(0.9);
    expect(t.twins).toEqual([]);

    onset(store, { id: 'ev-d-esc', severity: 0.4 });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0].severity).toBe(0.4);
    expect(t.twins).toEqual([]);

    resolve(store, { id: 'ev-d-end' });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds[0].status).toBe('easing');
    expect(t.edits).toEqual({ added: [], resolved: ['famine'] });
    expect(t.twins).toEqual([]);
    expect(store.getState().campaigns[0].worldState.proposals || []).toEqual([]);

    // Draft never logs, so undo has nothing to pop.
    const before = store.getState().settlement;
    store.getState().undoLastEvent();
    expect(store.getState().settlement).toBe(before);
  });

  test('GENERATION-born: the authored upsert + resolve stay local', () => {
    const store = seedStore(makeStore(), 'draft', generationFixture());

    onset(store, { id: 'ev-dg-on', severity: 0.8 });
    let t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries[0].severity).toBe(0.8);
    expect(t.conds[0].causes[0].eventId).toBe('ev-dg-on');
    expect(t.twins).toEqual([]);

    resolve(store, { id: 'ev-dg-end' });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds[0].status).toBe('easing');
    expect(t.twins).toEqual([]);
  });

  test('PULSE-born: a draft event never escalates or resolves the campaign twin', () => {
    const store = seedStore(makeStore(), 'draft');
    store.getState().injectCampaignStressor('camp-1', {
      type: 'famine',
      label: 'Famine',
      originSettlementId: SAVE_ID,
      affectedSettlementIds: [SAVE_ID],
      severity: 0.6,
    });

    onset(store, { id: 'ev-dp-on', severity: 0.9 });
    let t = triple(store);
    expectCoreAgreement(t);
    // Local representations agree with each other…
    expect(t.entries[0].severity).toBe(0.9);
    expect(t.conds[0].severity).toBeCloseTo(0.9, 5);
    // …but the twin is campaign state — a draft event must not move it.
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].severity).toBe(0.6);

    resolve(store, { id: 'ev-dp-end' });
    t = triple(store);
    expectCoreAgreement(t);
    expect(t.entries).toEqual([]);
    expect(t.conds[0].status).toBe('easing');
    expect(t.activeTwins).toHaveLength(1);
    expect(t.activeTwins[0].severity).toBe(0.6);
  });
});

describe('vocabulary: escalation IS an onset upsert', () => {
  test('crisisEscalate and crisisOnset are one implementation — the two transitions cannot drift', () => {
    // Identity by reference would over-pin the implementation; identity by
    // OUTPUT is the contract: same input, byte-identical settlement +
    // directive.
    const args = () => ({
      settlement: generationFixture(),
      event: {
        id: 'ev-same', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.8 },
        cause: 'player_action',
      },
    });
    expect(crisisEscalate(args())).toEqual(crisisOnset(args()));
  });
});

// ── 2. The source scan — the trio is written only through the lifecycle ────

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../src');

function walk(dir) {
  return fs.readdirSync(dir).flatMap(entry => {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) return walk(p);
    return /\.(js|jsx)$/.test(entry) ? [p] : [];
  });
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

const relOf = p => path.relative(SRC, p).split(path.sep).join('/');

// FROZEN allowlists — only-shrinks. Every entry names its ROLE; the equality
// assertions below fail in BOTH directions: a new file touching the trio
// must route through crisisLifecycle.js instead (or, for a genuinely new
// legitimate seam, be added here with the rationale recorded), and a file
// that stops touching it must be removed so the list stays truthful.

// (a) The local stress-container ENTRY writer: addedByEventId is the stamp
// every authored entry carries, so its writer set IS the entry-writer set.
const ENTRY_WRITERS = Object.freeze([
  'domain/crisisLifecycle.js',
]);

// (b) The regen-survival record (config.stressorEdits) vocabulary:
const STRESSOR_EDITS_FILES = Object.freeze([
  'domain/crisisLifecycle.js',             // the ONLY writer (onset record / resolve suppression)
  'domain/events/undoEvent.js',            // pre-event snapshot restore (logEntry.undo)
  'generators/steps/resolveStress.js',     // the regeneration overlay (consumer)
  'generators/steps/stressConfirmPass.js', // forced-set guard (consumer)
  'store/settlementSlice.js',              // the addStressor what-if clears the suppression
]);

// (c) The roaming-twin store actions:
const TWIN_ACTION_FILES = Object.freeze([
  'store/campaignSlice.js',   // the action definitions
  'store/settlementSlice.js', // the ONE directive consumer (+ undo withdraw)
]);

describe('source scan — the trio is written only through the lifecycle', () => {
  const sources = walk(SRC).map(p => ({ rel: relOf(p), code: stripComments(fs.readFileSync(p, 'utf8')) }));
  const filesMatching = (re) => sources.filter(f => re.test(f.code)).map(f => f.rel).sort();
  const codeOf = (rel) => sources.find(f => f.rel === rel)?.code || '';

  test('authored stress entries (addedByEventId writes) are minted only by crisisLifecycle', () => {
    // Property writes both ways: object-literal (`addedByEventId:`) AND
    // assignment (`.addedByEventId =`). `=(?!=)` keeps comparisons out of the
    // writer set — undoEvent.js legitimately READS the stamp with ===/!==.
    expect(filesMatching(/\baddedByEventId\s*(?::|=(?!=))/)).toEqual([...ENTRY_WRITERS].sort());
  });

  test('the stressorEdits record vocabulary is closed over the frozen file set', () => {
    expect(filesMatching(/\bstressorEdits\b/)).toEqual([...STRESSOR_EDITS_FILES].sort());
  });

  test('the twin actions are referenced only by their definitions and the directive consumer', () => {
    expect(filesMatching(/\b(?:injectCampaignStressor|resolveCampaignStressor|undoCampaignStressorBridge)\b/))
      .toEqual([...TWIN_ACTION_FILES].sort());
  });

  test('the wiring is live, not vacuously empty', () => {
    // mutate.js routes the crisis events through the lifecycle…
    expect(codeOf('domain/events/mutate.js')).toMatch(/\bcrisisOnset\(/);
    expect(codeOf('domain/events/mutate.js')).toMatch(/\bcrisisResolve\(/);
    // …the store consumes the directives (forward + undo + snapshot)…
    expect(codeOf('store/settlementSlice.js')).toMatch(/\btwinDirectiveForEvent\(/);
    expect(codeOf('store/settlementSlice.js')).toMatch(/\bcrisisWithdraw\(/);
    expect(codeOf('store/settlementSlice.js')).toMatch(/\bcrisisTwinFor\(/);
    // …and the pulse's organic resolutions reach the origin settlement
    // (applyWorldPulseResultToState was extracted to campaignPulseHelpers in WS4).
    expect(codeOf('store/campaignPulseHelpers.js')).toMatch(/\bwithOrganicStressorResolution\(/);
    expect(codeOf('domain/worldPulse/stressorAftermath.js')).toMatch(/\bresolveCrisisLocally\(/);
  });
});
