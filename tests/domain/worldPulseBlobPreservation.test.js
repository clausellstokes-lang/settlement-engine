/**
 * worldPulseBlobPreservation.test.js — SM-3 PRE-BUILD GATE (design §8.1).
 *
 * THE QUESTION THIS PINS
 * ----------------------
 * The Settlement Map (wave SM-3) will store cosmetic edits in a NEW top-level
 * settlement key `settlement.mapEdits`. For a CANON campaign member the world-pulse
 * REWRITES the settlement blob every tick (advanceTime → food/corruption passes →
 * applyWorldPulseOutcomes → factionState/religion projection → deep-clone). If any
 * hop in that chain reconstructed the settlement from a KNOWN-KEYS ALLOWLIST instead
 * of spreading the prior object, `mapEdits` would be SILENTLY DROPPED on the first
 * tick — the map's persisted home would evaporate the moment the world advanced.
 *
 * So before SM-3 picks `settlement.mapEdits` as the storage home, this test asserts
 * the OBSERVED behavior of the REAL rewrite chain: it runs `simulateCampaignWorldPulse`
 * (the production one-week kernel) over a canon member carrying two UNKNOWN top-level
 * keys and checks they survive BYTE-FOR-BYTE across repeated tick rewrites.
 *
 * WHAT IT EXERCISES (no mocks of the function under test)
 * ------------------------------------------------------
 *  - `mapEdits` — the real future key SM-3 will use (nested: layoutVariant + pins[]),
 *    to prove deep structure survives, not just a scalar.
 *  - a second arbitrary sentinel key `__sm3UnknownSentinel` — to prove the
 *    preservation is GENERAL (any unknown top-level key), not a mapEdits special-case.
 *  - a member with an active famine + a live stressor + a criminal/military roster, so
 *    the rewrite chain ACTUALLY MUTATES the settlement (new object references) rather
 *    than short-circuiting to an identity pass-through — the anti-vacuity guard below
 *    asserts the member really was rewritten.
 *  - saves fed back in each tick, so the keys must survive REPEATED rewrites (the exact
 *    "rewrites the blob every tick" concern), not just one pass.
 *
 * VERDICT PINNED: PRESERVES. Every hop in the traced chain is either an identity
 * pass-through, a `{ ...settlement, <changed field> }` spread, or a deepClone — there
 * is NO allowlist reconstruction. If a future change swaps any hop to an allowlist
 * rebuild, this test goes red and names SM-3's storage home as the casualty.
 *
 * @enforced-invariant world-pulse preserves unknown top-level settlement keys byte-for-byte
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// The two UNKNOWN top-level keys under test. `mapEdits` is the real SM-3 future
// key (deep, so nested survival is proven); the sentinel proves generality.
const MAP_EDITS = Object.freeze({
  layoutVariant: 2,
  pins: [
    { anchor: 'cat:tavern', dx: 3, dy: -1 },
    { anchor: 'localUid:abc123', dx: 0, dy: 4 },
  ],
  seed: 'sm3-cosmetic-seed',
});
const SENTINEL = Object.freeze({ nested: { arr: [1, 2, 3], flag: true }, tag: 'sm3-generality-probe' });

// A canon-member settlement built to force real rewrite work: a worsening famine +
// a contested legitimacy roster so advanceTime's condition/faction passes and the
// apply pass all produce fresh object references (anti-vacuity).
function memberSettlement() {
  return {
    id: 'sm3-canon-member',
    name: 'Mapton',
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 22, label: 'Crisis' },
      factions: [
        { faction: 'Iron Syndicate', category: 'criminal', power: 68 },
        { faction: 'Grain Guild', category: 'economy', power: 61 },
        { faction: 'City Watch', category: 'military', power: 44 },
      ],
      conflicts: [{ parties: ['Iron Syndicate', 'City Watch'], nature: 'open feud' }],
    },
    npcs: [
      { id: 'npc_mapton_1', name: 'Captain Mapton', importance: 'key' },
      { id: 'npc_mapton_2', name: 'Broker Mapton', importance: 'key' },
    ],
    activeConditions: [
      { archetype: 'famine', severity: 0.82, status: 'worsening' },
      { archetype: 'regional_criminal_pressure', severity: 0.74, status: 'stable' },
    ],
    // ── THE UNKNOWN TOP-LEVEL KEYS UNDER TEST ──────────────────────────────
    mapEdits: structuredClone(MAP_EDITS),
    __sm3UnknownSentinel: structuredClone(SENTINEL),
  };
}

function canonSave(id, name, settlement) {
  return {
    id,
    name,
    phase: 'canon',
    settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function makeCampaign() {
  return {
    campaign: {
      id: 'sm3-blob-preservation',
      name: 'SM3 Blob Preservation',
      settlementIds: ['sm3-canon-member', 'neighbour'],
      worldState: {
        rngSeed: 'sm3-blob-pin',
        tick: 2,
        // Stressors ON so the apply pass runs a real mutate pass over the member.
        simulationRules: { stressorsEnabled: true },
        stressors: [
          { id: 'world_stressor.famine.sm3-canon-member', type: 'famine', severity: 0.8, affectedSettlementIds: ['sm3-canon-member'], age: 3 },
          { id: 'world_stressor.crime_wave.neighbour', type: 'crime_wave', severity: 0.66, affectedSettlementIds: ['neighbour'], age: 2 },
        ],
      },
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.member.neighbour', from: 'sm3-canon-member', to: 'neighbour', relationshipType: 'rival' },
        ],
        channels: [
          { type: 'migration_pressure', from: 'sm3-canon-member', to: 'neighbour', status: 'confirmed' },
        ],
      }),
      wizardNews: { currentTick: 2, entries: [] },
    },
    saves: [
      canonSave('sm3-canon-member', 'Mapton', memberSettlement()),
      canonSave('neighbour', 'Neighbourton', {
        id: 'neighbour',
        name: 'Neighbourton',
        tier: 'town',
        population: 1200,
        config: { tradeRouteAccess: 'road' },
        institutions: [],
        powerStructure: {
          publicLegitimacy: { score: 40, label: 'Contested' },
          factions: [
            { faction: 'Harbor Guild', category: 'economy', power: 55 },
            { faction: 'Free Company', category: 'military', power: 48 },
          ],
        },
        npcs: [{ id: 'npc_n_1', name: 'Warden Neigh', importance: 'key' }],
        activeConditions: [{ archetype: 'crime_wave', severity: 0.6, status: 'stable' }],
      }),
    ],
  };
}

/**
 * Advance N real ticks, feeding settlementUpdates back each tick (so the unknown keys
 * must survive REPEATED rewrites). Returns the final member settlement + a flag for
 * whether the member's blob (minus the unknown keys) actually changed at least once.
 * @param {number} ticks
 */
function runRealPulse(ticks) {
  let { campaign, saves } = makeCampaign();
  let everRewrittenDifferently = false;
  let sawUpdate = false;

  for (let t = 0; t < ticks; t++) {
    const before = saves.find(s => s.id === 'sm3-canon-member').settlement;
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map(u => [String(u.saveId), u.settlement]));
    if (updates.has('sm3-canon-member')) {
      sawUpdate = true;
      const after = updates.get('sm3-canon-member');
      // Anti-vacuity: strip the unknown keys and compare the rest — did the pulse
      // actually rewrite the member into a materially different blob?
      const strip = (/** @type {any} */ s) => { const { mapEdits, __sm3UnknownSentinel, ...rest } = s; return rest; };
      if (JSON.stringify(strip(before)) !== JSON.stringify(strip(after))) everRewrittenDifferently = true;
    }
    saves = saves.map(s => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
  }

  return {
    member: saves.find(s => s.id === 'sm3-canon-member').settlement,
    everRewrittenDifferently,
    sawUpdate,
  };
}

describe('SM-3 pre-build gate — world-pulse preserves unknown top-level settlement keys', () => {
  test('anti-vacuity: the canon member is actually rewritten by the real pulse chain', () => {
    const { sawUpdate, everRewrittenDifferently } = runRealPulse(4);
    // The member must reach the settlementUpdates return (proves it went through the
    // rewrite chain) AND be rewritten into a materially different blob at least once
    // (proves this is not a trivial identity pass-through that would preserve keys for
    // an uninteresting reason).
    expect(sawUpdate).toBe(true);
    expect(everRewrittenDifferently).toBe(true);
  });

  test('`settlement.mapEdits` survives BYTE-FOR-BYTE across repeated tick rewrites', () => {
    const { member } = runRealPulse(4);
    // Deep-equal (structural) …
    expect(member.mapEdits).toEqual(MAP_EDITS);
    // … AND byte-for-byte under the same serializer persistence uses.
    expect(JSON.stringify(member.mapEdits)).toBe(JSON.stringify(MAP_EDITS));
  });

  test('a second arbitrary unknown top-level key survives too (preservation is GENERAL)', () => {
    const { member } = runRealPulse(4);
    expect(member.__sm3UnknownSentinel).toEqual(SENTINEL);
    expect(JSON.stringify(member.__sm3UnknownSentinel)).toBe(JSON.stringify(SENTINEL));
  });

  test('a single tick already preserves the keys (first-rewrite pin)', () => {
    const { member } = runRealPulse(1);
    expect(member.mapEdits).toEqual(MAP_EDITS);
    expect(member.__sm3UnknownSentinel).toEqual(SENTINEL);
  });
});
