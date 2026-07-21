/**
 * emergentArcSoak.test.js — THE EMERGENT-ARC CHECKPOINT SOAK (idx29; bars 4/20).
 *
 * The product's central depth claim is mover COMPOSITION: independent subsystems
 * (war, trade, faith, politics, population, crime) coupling into multi-system causal
 * ARCS (conquest → information shock → import shortage → religious pressure). Until
 * now the only everything-on driver (moverCompositionSmoke) asserted ALIVE/BOUNDED/
 * DETERMINISTIC over 24 ticks and deferred arc validation to a "checkpoint soak"
 * that did not exist. This file IS that checkpoint: a 15-year everything-on drive
 * that PROVES discoverable arcs form, measured over the RECORDED cause-edge ledger —
 * never co-occurrence.
 *
 * HOW ARCS ARE MEASURED (recorded, not inferred): the campaign lights the virtual
 * `provenanceLedgerEnabled` flag TEST-LOCALLY on top of the LITERAL
 * SIMULATION_RULE_PRESETS.full_simulation.rules (the provenanceDormancyGolden
 * idiom — no shipped default, no golden, no product output changes; the flag only
 * makes the engine RECORD the parent-edges it already mints). After the drive, the
 * ledger at `worldState.spatialLedgers.provenance` is read through the canonical
 * display reader (buildRecordedEdges, chronicleGraph.js) and mined into ARC CONES:
 * one recorded parent cause with its recorded consequences. The interesting cones:
 *   · CROSS-SYSTEM edges — child's subsystem family ≠ parent's (famine → coup class)
 *   · CROSS-TICK edges   — the consequence lands on a LATER advance than its cause
 *                          (recorded delayed propagation, the queued-impact web)
 *   · WAVE edges         — children the engine itself marks `queued.regional_wave`,
 *                          its ≥2-hop propagation receipts (cause → impact → wave)
 *   · MULTI-SYSTEM cones — one cause whose recorded consequence set spans ≥2 (some
 *                          ≥3) subsystem families across advances
 *
 * MEASURED on seed 'arc-soak-seed' @ 15y (180 one_month ticks) × 8 settlements:
 * 3144 recorded edges · 118 cross-system · 64 cross-tick · 44 wave · 36 cones with
 * ≥2 consequences · 93 multi-system cones · 4 triple-system cones · 8 families.
 * Every floor below is pinned WELL UNDER observed (the cacophony ratchet-floor
 * philosophy) so the pin is a regression floor, not a brittle exact match.
 *
 * HONEST LIMITS (measured, not assumed):
 *   1. RECORDED LINK-DEPTH ≥ 2 (a recorded child that is itself a recorded parent)
 *      measured ZERO in this soak. Structural, verified by source census: the only
 *      kernel that mints the `causedBy` outcome→outcome seam today is roads V-24d
 *      (release → capture, unit-pinned by tests/domain/roadsProvenanceThread.test.js),
 *      and roads is a virtual flag outside full_simulation; every other recorded edge
 *      is child → root (news/queued impacts name their ULTIMATE cause, and the engine
 *      flattens wave lineage onto the root while marking hop-generation in the wave
 *      receipt). The `deepChains` metric stays wired and reported in diagnostics so
 *      the number lights up as kernels adopt the seam; the DEPTH story here is
 *      carried by the wave/cross-tick cones the engine actually records.
 *   2. Only receipts landing in the durable pulseRecord (selectedOutcomes ≤24 +
 *      impactDigest ≤18 per advance) are recorded — arc counts are a FLOOR on the
 *      causal coupling present, not a census of it.
 *   3. Family classification is a whole-token keyword map over the engine's own
 *      type/id vocabulary; an unmatched endpoint maps to null and is EXCLUDED from
 *      cross-system counts (under-count, never inflate).
 *   4. The ledger's horizon governor (MAX_PROVENANCE_EDGES = 4096, lowest-tick
 *      eviction) never fired at this density (3144 < 4096); a much denser soak
 *      would measure the surviving window.
 */
import { describe, expect, test } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { buildRecordedEdges } from '../../src/domain/display/chronicleGraph.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const YEARS = 15;                 // a decade-plus, per the checkpoint charter
const TICKS = YEARS * 12;         // one_month ticks
const SEED = 'arc-soak-seed';

// The everything-on ceiling, verbatim, plus the RECORDER lit test-locally.
const RULES = Object.freeze({
  ...SIMULATION_RULE_PRESETS.full_simulation.rules,
  provenanceLedgerEnabled: true,
});

const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:as_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:as_maw', 'The Maw', 'evil', 'chaotic', 'major'),
};

function spatialDigest() {
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function st(name, patron, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
    },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 26, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 68 },
        { faction: 'Temple Wardens', category: 'religious', power: 57 },
        { faction: 'City Guard', category: 'military', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key', category: 'civic', personality: { dominant: 'stern' } },
      { id: `factor_${name}`, name: `Factor ${name}`, importance: 'key', category: 'economy', personality: { dominant: 'bold' } },
      { id: `deacon_${name}`, name: `Deacon ${name}`, importance: 'notable', category: 'religious', personality: { dominant: 'devout' } },
    ],
    activeConditions: [],
    ...patch,
  };
}
const save = (id, name, patron, opts) => ({ id, name, phase: 'canon', settlement: st(name, patron, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });

function makeSaves() {
  return IDS.map((id, i) => (i === 0
    ? save(id, 'Ashford', D.lg, { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } })
    : save(id, `S${id.toUpperCase()}`, i % 2 ? D.ce : D.lg, { imports: [GRAIN], ...(i < 3 ? { patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.78 }] } } : {}) })));
}

function makeCampaign(seed) {
  return {
    id: 'arc-soak', name: 'Emergent Arc Soak', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, calendar: { elapsedWeeks: 4 },
      simulationRules: { ...RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.74, affectedSettlementIds: ['c'], age: 1 },
      ],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        ...IDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
        { id: 'e.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'e.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
        { id: 'e.e.f', from: 'e', to: 'f', relationshipType: 'rival' },
        { id: 'e.a.h', from: 'a', to: 'h', relationshipType: 'ally' },
      ],
      channels: IDS.slice(1).map(ch),
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive TICKS one_month pulses, threading world/graph/news/saves (the smoke idiom). */
function drive(seed) {
  let campaign = makeCampaign(seed);
  let saves = makeSaves();
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
  }
  return { campaign, saves };
}

// ── Arc mining over the RECORDED DAG ─────────────────────────────────────────

/** Family keyword tokens, matched per id/type TOKEN (split on [._]) so a token like
 *  'wardens' can never substring-match 'war'. First family in this order wins —
 *  order is part of the deterministic contract, not a tunable. */
const FAMILY_TOKENS = Object.freeze([
  ['sustenance', ['famine', 'food', 'harvest', 'granary', 'relief', 'succor', 'generosity', 'gratitude']],
  ['pestilence', ['plague', 'disease', 'outbreak', 'pestilence']],
  ['calamity', ['calamity', 'fire', 'flood', 'storm', 'earthquake']],
  ['faith', ['faith', 'temple', 'religious', 'missionize', 'schism', 'deity', 'piety', 'cult']],
  ['war', ['war', 'army', 'siege', 'battle', 'occupation', 'conquest', 'mobilization', 'raid', 'spoils', 'reinforcement', 'defend', 'deploy', 'hold', 'peace', 'border', 'arms', 'protection', 'conflict', 'blockade', 'hostile']],
  ['economy', ['trade', 'economic', 'credit', 'embargo', 'reroute', 'opportunity', 'scarcity', 'shortage', 'tax', 'smuggling', 'prosperity', 'boom', 'market', 'toll', 'caravan', 'resource', 'flow']],
  ['population', ['population', 'migration', 'migrant', 'exodus', 'refugee']],
  ['politics', ['coup', 'succession', 'legitimacy', 'faction', 'vassal', 'rebellion', 'betrayal', 'authority', 'prestige', 'suppress', 'corruption', 'institution', 'government', 'law', 'challenge', 'contest', 'tier', 'detat', 'rival']],
  ['people', ['npc', 'promotion', 'reform', 'goal', 'bargain', 'ladder', 'culmination', 'rebranch', 'growth']],
  ['order', ['crime', 'banditry', 'unrest', 'riot']],
]);

/** Subsystem family of a recorded type string OR a structural receipt id. Tokenizes
 *  on [._] and matches whole tokens; an unmatched string honestly maps to null —
 *  null endpoints are EXCLUDED from cross-system counts (under-count, never inflate).
 *  @param {unknown} value @returns {string|null} */
export function systemFamilyOf(value) {
  const tokens = new Set(String(value || '').toLowerCase().split(/[._]/).filter(Boolean));
  for (const [family, words] of FAMILY_TOKENS) {
    for (const w of words) if (tokens.has(w)) return family;
  }
  return null;
}

/** Trailing integer of a structural id (the tick most receipt ids embed), or null.
 *  @param {string} id @returns {number|null} */
function embeddedTickOf(id) {
  const m = /(?:^|[._])(\d+)$/.exec(String(id));
  return m ? Number(m[1]) : null;
}

/** @typedef {{ child: string, parent: string, childFamily: string|null, parentFamily: string|null, crossTick: boolean }} MinedEdge */

/**
 * Mine the recorded cause-graph: every ledger entry contributes (child → parent)
 * edges; cones group recorded consequences under one recorded cause. `deepChains`
 * counts entries whose recorded parent is ITSELF a recorded child (link-depth ≥ 2)
 * — the seam only roads V-24d mints today (see the header's honest limits).
 * @param {Record<string, { parents?: ReadonlyArray<string>, type?: string, tick?: number }>|null|undefined} provenance
 */
export function mineCones(provenance) {
  const ledger = provenance && typeof provenance === 'object' ? provenance : {};
  const recorded = buildRecordedEdges(ledger);
  /** @type {MinedEdge[]} */
  const edges2 = [];
  /** @type {Map<string, string[]>} */
  const childrenByParent = new Map();
  let crossSystemEdges = 0;
  let crossTickEdges = 0;
  let deepChains = 0;
  let waveEdges = 0;
  const keys = Object.keys(ledger).sort();
  const keySet = new Set(keys);
  for (const child of keys) {
    const entry = ledger[child];
    const childFamily = systemFamilyOf(entry?.type);
    const childTick = Number.isFinite(entry?.tick) ? Number(entry.tick) : null;
    for (const parent of (Array.isArray(entry?.parents) ? [...entry.parents].map(String).sort() : [])) {
      const parentFamily = systemFamilyOf(parent);
      const parentTick = embeddedTickOf(parent);
      const crossTick = parentTick != null && childTick != null && childTick > parentTick;
      if (crossTick) crossTickEdges += 1;
      if (childFamily && parentFamily && childFamily !== parentFamily) crossSystemEdges += 1;
      if (keySet.has(parent)) deepChains += 1;
      if (child.includes('.queued.regional_wave.')) waveEdges += 1;
      edges2.push({ child, parent, childFamily, parentFamily, crossTick });
      if (!childrenByParent.has(parent)) childrenByParent.set(parent, []);
      (childrenByParent.get(parent) || []).push(child);
    }
  }
  // Cones: one recorded cause with its recorded consequence set.
  let cones2 = 0;
  let multiSystemCones = 0;
  let tripleSystemCones = 0;
  /** @type {string[]} */
  const sampleMultiCone = [];
  for (const [parent, children] of [...childrenByParent.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (children.length >= 2) cones2 += 1;
    /** @type {Set<string>} */
    const families = new Set();
    const pf = systemFamilyOf(parent);
    if (pf) families.add(pf);
    for (const c of children) { const f = systemFamilyOf(ledger[c]?.type); if (f) families.add(f); }
    if (families.size >= 2) {
      multiSystemCones += 1;
      if (sampleMultiCone.length < 6) sampleMultiCone.push(`${parent} => ${children.length} consequences, families=[${[...families].sort().join(',')}]`);
    }
    if (families.size >= 3) tripleSystemCones += 1;
  }
  /** @type {Set<string>} */
  const familySet = new Set();
  for (const e of edges2) { if (e.childFamily) familySet.add(e.childFamily); if (e.parentFamily) familySet.add(e.parentFamily); }
  return {
    totalEdges: recorded.size, edges2, crossSystemEdges, crossTickEdges, deepChains, waveEdges,
    cones2, multiSystemCones, tripleSystemCones, familyCount: familySet.size,
    sampleMultiCone,
  };
}

/** A stable projection of the mined result (for the determinism hash).
 *  @param {Record<string, { parents?: ReadonlyArray<string>, type?: string, tick?: number }>} provenance */
function arcProjection(provenance) {
  const m = mineCones(provenance);
  return {
    totalEdges: m.totalEdges,
    crossSystemEdges: m.crossSystemEdges,
    crossTickEdges: m.crossTickEdges,
    waveEdges: m.waveEdges,
    deepChains: m.deepChains,
    cones2: m.cones2,
    multiSystemCones: m.multiSystemCones,
    edges: m.edges2.map((e) => `${e.child}<-${e.parent}`),
  };
}
/** @param {unknown} value @returns {string} */
const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// ── The soak (one drive, shared by the assertions; a second for determinism) ──
const run = drive(SEED);
const provenance = run.campaign.worldState?.spatialLedgers?.provenance || {};
const mined = mineCones(provenance);

describe(`THE EMERGENT-ARC SOAK — ${YEARS}y everything-on, arcs measured over RECORDED cause-edges`, () => {
  test('diagnostics (printed so the architect can re-check the measured band)', () => {
    console.log('[arc-soak] %dy × %d settlements: entries=%d edges=%d crossSystem=%d crossTick=%d wave=%d cones2=%d multiSystemCones=%d tripleSystemCones=%d deepChains=%d families=%d',
      YEARS, IDS.length, Object.keys(provenance).length, mined.totalEdges, mined.crossSystemEdges,
      mined.crossTickEdges, mined.waveEdges, mined.cones2, mined.multiSystemCones,
      mined.tripleSystemCones, mined.deepChains, mined.familyCount);
    for (const s of mined.sampleMultiCone) console.log('[arc-soak] cone: %s', s);
    expect(true).toBe(true);
  }, 240_000);

  test('anti-vacuity: the lit recorder produced a rich DAG at scale (measured 3144 edges; floor 1200)', () => {
    expect(Object.keys(provenance).length).toBeGreaterThanOrEqual(1200);
    expect(mined.totalEdges).toBeGreaterThanOrEqual(1200);
    // The classifier is not degenerate: most of the subsystem families are live
    // in the recorded graph (measured 8 of 10; floor 6).
    expect(mined.familyCount).toBeGreaterThanOrEqual(6);
  }, 240_000);

  test('ARCS CROSS SYSTEMS: recorded cause-edges couple different subsystems (measured 118; floor 40)', () => {
    expect(mined.crossSystemEdges).toBeGreaterThanOrEqual(40);
  }, 240_000);

  test('ARCS CROSS TIME: recorded consequences land on later advances than their cause (measured 64; floor 20)', () => {
    expect(mined.crossTickEdges).toBeGreaterThanOrEqual(20);
  }, 240_000);

  test('ARCS PROPAGATE ≥2 HOPS: the engine records second-generation wave receipts (measured 44; floor 12)', () => {
    expect(mined.waveEdges).toBeGreaterThanOrEqual(12);
  }, 240_000);

  test('MULTI-SYSTEM CONES: one recorded cause fans consequences across ≥2 families (measured 93; floor 30), some ≥3 (measured 4; floor 1)', () => {
    expect(mined.cones2).toBeGreaterThanOrEqual(12);
    expect(mined.multiSystemCones).toBeGreaterThanOrEqual(30);
    expect(mined.tripleSystemCones).toBeGreaterThanOrEqual(1);
  }, 240_000);

  test('DETERMINISM: an identical everything-on soak records the identical DAG and arcs', () => {
    const again = drive(SEED);
    const provAgain = again.campaign.worldState?.spatialLedgers?.provenance || {};
    expect(hashOf(arcProjection(provAgain))).toBe(hashOf(arcProjection(provenance)));
  }, 240_000);
});
