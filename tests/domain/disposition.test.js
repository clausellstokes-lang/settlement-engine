import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import {
  computeAggressiveness,
  computeDispositionFactorMap,
} from '../../src/domain/worldPulse/disposition.js';
import { collectDispositionDeltas } from '../../src/domain/worldPulse/dispositionDeltas.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateTradeWar } from '../../src/domain/worldPulse/tradeWar.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Feature C (C1) — disposition scoreFor + the read/write ratchet wiring.
//
// computeAggressiveness blends govBaseline (re-centered COUP_COERCION) + the
// AUTHORED-personality TRAIT_AGGRESSION term (NOT the RNG-rolled npcStates
// alignment, OQ13) + ratcheted history (readDispositionMultiplier), into a
// centered-on-1.0 multiplier: > 1.0 belligerent, < 1.0 pacific, EXACTLY 1.0 with
// no signal. The factor is read LAST-tick at candidate-build (gated behind
// warLayerEnabled); the win/loss ratchet is WRITTEN next-tick post-apply.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: patch.prosperity || 'Stable',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: patch.npcs || [],
    activeConditions: patch.activeConditions || [],
  };
}

function item(id, patch = {}) {
  return { id, settlement: settlement(id, patch) };
}

// ── 1. scoreFor sign ──────────────────────────────────────────────────────────
describe('computeAggressiveness — the signed centered-on-1.0 scalar', () => {
  test('a settlement with no signal reads EXACTLY 1.0 (the byte-identity anchor)', () => {
    // Civic government (govBaseline 0), no NPCs, empty ledger → 1.0 exactly.
    const neutral = item('neutral', {
      factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true }],
      npcs: [],
    });
    expect(computeAggressiveness(neutral, { dispositionStats: {} })).toBe(1.0);
  });

  test('an aggressive government + aggressive NPCs ⇒ factor > 1.0', () => {
    const warlike = item('warlike', {
      factions: [{ faction: 'Garrison Command', category: 'military', power: 80, isGoverning: true }],
      npcs: [
        { name: 'Warlord', importance: 'pillar', personality: { dominant: 'domineering', flaw: 'cruel', modifier: 'zealous' } },
        { name: 'Captain', importance: 'key', personality: { dominant: 'imperious', flaw: 'ruthless', modifier: 'ambitious' } },
      ],
    });
    expect(computeAggressiveness(warlike, { dispositionStats: {} })).toBeGreaterThan(1.0);
  });

  test('a pacifist government + merciful NPCs ⇒ factor < 1.0', () => {
    const pacific = item('pacific', {
      factions: [{ faction: 'Craft Guild Assembly', category: 'craft', power: 70, isGoverning: true }],
      npcs: [
        { name: 'Elder', importance: 'pillar', personality: { dominant: 'merciful', flaw: 'generous', modifier: 'cautious' } },
        { name: 'Steward', importance: 'key', personality: { dominant: 'compassionate', flaw: 'diplomatic', modifier: 'reserved' } },
      ],
    });
    expect(computeAggressiveness(pacific, { dispositionStats: {} })).toBeLessThan(1.0);
  });

  test('history alone moves the factor: a win-streak ledger boosts, a loss-streak damps', () => {
    const plain = item('s', { factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], npcs: [] });
    const wins = computeAggressiveness(plain, { dispositionStats: { s: { score: 8 } } });
    const losses = computeAggressiveness(plain, { dispositionStats: { s: { score: -8 } } });
    expect(wins).toBeGreaterThan(1.0);
    expect(losses).toBeLessThan(1.0);
  });
});

// ── 2. Authored personality, NOT RNG alignment (OQ13 — the two-alignment trap) ──
describe('computeAggressiveness — reads AUTHORED personality, never npcStates.alignment', () => {
  test('changing the AUTHORED npc.personality moves the factor', () => {
    const base = item('s', {
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      npcs: [{ name: 'Mayor', importance: 'pillar', personality: { dominant: 'merciful', flaw: 'generous', modifier: 'patient' } }],
    });
    const cruel = item('s', {
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      npcs: [{ name: 'Mayor', importance: 'pillar', personality: { dominant: 'domineering', flaw: 'cruel', modifier: 'zealous' } }],
    });
    const ws = { dispositionStats: {} };
    expect(computeAggressiveness(base, ws)).toBeLessThan(1.0);   // merciful → pacific
    expect(computeAggressiveness(cruel, ws)).toBeGreaterThan(1.0); // cruel → belligerent
    expect(computeAggressiveness(base, ws)).not.toBe(computeAggressiveness(cruel, ws));
  });

  test('changing the RNG-rolled npcStates.alignment does NOT move the factor', () => {
    // Same authored personality; only a (write-only) npcStates alignment differs.
    // computeAggressiveness reads neither npcStates nor npc.alignment, so the
    // factor is invariant — proving the authored-string source.
    const npc = { name: 'Mayor', importance: 'pillar', personality: { dominant: 'cruel', flaw: 'ruthless', modifier: 'zealous' } };
    const s = item('s', { factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], npcs: [npc] });

    const peaceful = { dispositionStats: {}, npcStates: { 'npc.s.0': { npcId: 'npc.s.0', settlementId: 's', alignment: 'principled_idealist' } } };
    const corrupted = { dispositionStats: {}, npcStates: { 'npc.s.0': { npcId: 'npc.s.0', settlementId: 's', alignment: 'corrupted_cruel_tyrant' } } };
    expect(computeAggressiveness(s, peaceful)).toBe(computeAggressiveness(s, corrupted));

    // And an npc.alignment field (a different write-only RNG slot) is ignored too.
    const withAlignment = item('s', {
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      npcs: [{ ...npc, alignment: 'lawful_good' }],
    });
    expect(computeAggressiveness(withAlignment, { dispositionStats: {} })).toBe(computeAggressiveness(s, { dispositionStats: {} }));
  });
});

// ── 3. computeDispositionFactorMap — omits 1.0 entries (`{}`-equivalent) ────────
describe('computeDispositionFactorMap — live factor map', () => {
  test('a no-signal settlement is OMITTED so candidateBase reads exactly 1.0', () => {
    const snapshot = {
      settlements: [
        item('neutral', { factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], npcs: [] }),
        item('warlike', {
          factions: [{ faction: 'Garrison', category: 'military', power: 80, isGoverning: true }],
          npcs: [{ name: 'Warlord', importance: 'pillar', personality: { dominant: 'cruel', flaw: 'ruthless', modifier: 'zealous' } }],
        }),
      ],
    };
    const map = computeDispositionFactorMap(snapshot, { dispositionStats: {} });
    expect(map.neutral).toBeUndefined();          // omitted ⇒ 1.0 at the chokepoint
    expect(map.warlike).toBeGreaterThan(1.0);     // present ⇒ a real boost
  });

  test('order-independent: reversing the settlements array yields the same map', () => {
    const a = item('a', { factions: [{ faction: 'Garrison', category: 'military', power: 80, isGoverning: true }], npcs: [{ importance: 'pillar', personality: { dominant: 'cruel' } }] });
    const b = item('b', { factions: [{ faction: 'Guild', category: 'craft', power: 70, isGoverning: true }], npcs: [{ importance: 'pillar', personality: { dominant: 'merciful' } }] });
    const fwd = computeDispositionFactorMap({ settlements: [a, b] }, { dispositionStats: {} });
    const rev = computeDispositionFactorMap({ settlements: [b, a] }, { dispositionStats: {} });
    expect(fwd).toEqual(rev);
  });
});

// ── 4. collectDispositionDeltas — the write-side gather ─────────────────────────
describe('collectDispositionDeltas', () => {
  test('merges war + trade deltas; inert inputs ⇒ [] (byte-neutral)', () => {
    expect(collectDispositionDeltas({}, {})).toEqual([]);
    expect(collectDispositionDeltas({ dispositionDeltas: [] }, { dispositionDeltas: [] })).toEqual([]);
    const merged = collectDispositionDeltas(
      { dispositionDeltas: [{ id: 'occ', outcome: 'win' }, { id: 'fallen', outcome: 'loss' }] },
      { dispositionDeltas: [{ id: 'newPrimary', outcome: 'win' }] },
    );
    expect(merged).toHaveLength(3);
    expect(merged.map(d => d.id)).toContain('newPrimary');
  });

  test('drops malformed deltas (no id / bad outcome)', () => {
    const out = collectDispositionDeltas(
      { dispositionDeltas: [{ id: 'ok', outcome: 'win' }, { outcome: 'win' }, { id: 'x', outcome: 'draw' }] },
      {},
    );
    expect(out).toEqual([{ id: 'ok', outcome: 'win' }]);
  });
});

// ── 5. The resolvers emit deltas only when the layer is ON ──────────────────────
function tradeChannel(from, to, strength) {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: 'grain', label: 'Grain' }] };
}

function grainContestSnapshot() {
  const saves = [
    { id: 'buyer', name: 'Ctown', phase: 'canon', settlement: settlement('Ctown', { imports: ['Grain'] }), campaignState: { phase: 'canon' } },
    { id: 'inc', name: 'Aville', phase: 'canon', settlement: settlement('Aville', { exports: ['Grain'], tier: 'village', population: 300, legitimacy: 30 }), campaignState: { phase: 'canon' } },
    { id: 'chal', name: 'Bburg', phase: 'canon', settlement: settlement('Bburg', { exports: ['Grain'], tier: 'city', population: 60000, legitimacy: 80 }), campaignState: { phase: 'canon' } },
  ];
  const campaign = {
    id: 'c', settlementIds: ['buyer', 'inc', 'chal'],
    worldState: { rngSeed: 'seed', tick: 4, simulationRules: { warLayerEnabled: true } },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.inc.buyer', from: 'inc', to: 'buyer', relationshipType: 'trade_partner' },
        { id: 'edge.chal.buyer', from: 'chal', to: 'buyer', relationshipType: 'trade_partner' },
      ],
      channels: [tradeChannel('inc', 'buyer', 0.6), tradeChannel('chal', 'buyer', 0.5)],
    }),
  };
  return { saves, campaign };
}

describe('resolvers emit dispositionDeltas only when the layer is ON', () => {
  test('OFF: war + trade resolvers emit NO deltas', () => {
    const { saves, campaign } = grainContestSnapshot();
    const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const off = { warLayerEnabled: false };
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('w'), tick: 5, now: NOW, rules: off });
    const trade = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('t'), tick: 5, now: NOW, rules: off });
    expect(war.dispositionDeltas).toEqual([]);
    expect(trade.dispositionDeltas).toEqual([]);
  });

  test('ON: a trade flip emits a win for the new primary + a loss for the displaced incumbent', () => {
    const { saves, campaign } = grainContestSnapshot();
    const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const trade = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('t'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });
    // The strong challenger displaces the weak incumbent: a win + a loss.
    expect(trade.dispositionDeltas.some(d => d.id === 'chal' && d.outcome === 'win')).toBe(true);
    expect(trade.dispositionDeltas.some(d => d.id === 'inc' && d.outcome === 'loss')).toBe(true);
  });
});

// ── 6. OFF byte-identity at the pulse level (focused flag-off test) ─────────────
function pulseSettlement(name, patch = {}) {
  return settlement(name, {
    factions: [
      { faction: 'Garrison Command', category: 'military', power: 80, isGoverning: true },
      { faction: 'Merchant League', category: 'economy', power: 60 },
    ],
    npcs: [{ name: `Warlord ${name}`, importance: 'pillar', personality: { dominant: 'domineering', flaw: 'cruel', modifier: 'zealous' } }],
    activeConditions: patch.activeConditions || [],
    ...patch,
  });
}

function pulseCampaign(warLayerEnabled) {
  return {
    id: 'off-pin',
    settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: 'off-seed', tick: 4,
      dispositionStats: {},
      simulationRules: { warLayerEnabled },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
      ],
      channels: [],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

const pulseSaves = () => [
  { id: 'a', name: 'Ashford', phase: 'canon', settlement: pulseSettlement('Ashford', { activeConditions: [{ archetype: 'regional_conflict_pressure', severity: 0.7 }] }), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
  { id: 'b', name: 'Briarwatch', phase: 'canon', settlement: pulseSettlement('Briarwatch'), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
  { id: 'c', name: 'Crownhold', phase: 'canon', settlement: pulseSettlement('Crownhold'), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
];

const candidateSeverities = (result) => {
  const m = new Map();
  for (const c of result.candidates || []) if (c?.id != null && Number.isFinite(c.severity)) m.set(c.id, c.severity);
  return m;
};

describe('disposition — OFF byte-identity (the gating rule)', () => {
  test('warLayerEnabled:false ⇒ dispositionStats stays empty AND aggressive NPCs do NOT move candidate severities', () => {
    const off = previewCampaignWorldPulse({ campaign: pulseCampaign(false), saves: pulseSaves(), interval: 'one_month', now: NOW });
    // Even though every settlement is military-ruled with cruel pillars, the OFF
    // path computes NO baseline factor — the F4 history-only empty-ledger path.
    expect(off.worldState.dispositionStats).toEqual({});

    // Anchor: the same candidate severities as a fixture with NO disposition data
    // at all (an empty/absent ledger is the F4 1.0-everywhere path).
    const bare = previewCampaignWorldPulse({
      campaign: (() => { const c = pulseCampaign(false); delete c.worldState.dispositionStats; return c; })(),
      saves: pulseSaves(), interval: 'one_month', now: NOW,
    });
    expect([...candidateSeverities(off).entries()].sort()).toEqual([...candidateSeverities(bare).entries()].sort());
  });

  test('ON vs OFF differ (anti-vacuity — the baseline is live when the layer is on)', () => {
    const off = candidateSeverities(previewCampaignWorldPulse({ campaign: pulseCampaign(false), saves: pulseSaves(), interval: 'one_month', now: NOW }));
    const on = candidateSeverities(previewCampaignWorldPulse({ campaign: pulseCampaign(true), saves: pulseSaves(), interval: 'one_month', now: NOW }));
    expect(off.size).toBeGreaterThan(0);
    let changed = 0;
    for (const [id, sev] of on) if (off.has(id) && off.get(id) !== sev) changed += 1;
    // The aggressive govBaseline + NPC personality boosted at least one escalation candidate.
    expect(changed).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// H14 / CR-S6-4 — THE SIBLING NOTABILITY LADDERS ARE PINNED EQUAL.
//
// `disposition.importanceWeight` and `worldPulse/npcAgency.notability` are
// DELIBERATE MIRRORS: importanceWeight's own header says it "mirrors
// npcAgency.notability so the agency layer and the disposition read the same
// authored-importance ladder", and the 2026-08-11 three-rung deletion was applied
// to BOTH for one reason, recorded in both comments. Nothing enforced that. A
// later edit to one rung would have drifted the two silently — the agency layer
// ranking an NPC one way while the disposition weighted it another, with no test
// anywhere able to see it.
//
// ⚠ BOTH FUNCTIONS ARE MODULE-PRIVATE and neither module is willing to export
// them (each is an internal of a leaf under a size ceiling). So the ladders are
// lifted OFF DISK, the way townCartographyPaint.test.js lifts the contract's own
// colour regex when the const it needs is `const`-not-`export`. The extractor is
// proven live against a spliced control below, so an extraction that silently
// stopped matching cannot pass this file as agreement.
// ─────────────────────────────────────────────────────────────────────────────
const LADDER_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NPC_AGENCY_SRC = 'src/domain/worldPulse/npcAgency.js';
const DISPOSITION_SRC = 'src/domain/worldPulse/disposition.js';

/**
 * The ordered importance ladder of one module-private function, read from source:
 * every `if (npc.importance === '<rung>') return <n>;` in order, plus the trailing
 * unranked floor. Returns null when the function is not found at all.
 */
function ladderFromSource(source, fnName) {
  const body = new RegExp(`function ${fnName}\\(npc = \\{\\}\\) \\{([\\s\\S]*?)\\n\\}`).exec(source);
  if (!body) return null;
  const rungs = [...body[1].matchAll(/if \(npc\.importance === '([a-z]+)'\) return ([\d.]+);/g)]
    .map((match) => [match[1], Number(match[2])]);
  const floor = /return ([\d.]+);\s*$/.exec(body[1].trimEnd());
  return { rungs, floor: floor ? Number(floor[1]) : null };
}

const ladderOf = (rel, fnName) =>
  ladderFromSource(readFileSync(join(LADDER_ROOT, rel), 'utf8'), fnName);

describe('H14 — the notability ladder is IDENTICAL in npcAgency and disposition', () => {
  test('THE LIVENESS ANCHOR — the extractor finds a real ladder in both leaves', () => {
    // Without this, "the two agree" would hold just as well of two nulls, of two
    // empty rung lists, or of a rename that quietly stopped matching either file.
    const agency = ladderOf(NPC_AGENCY_SRC, 'notability');
    const dispo = ladderOf(DISPOSITION_SRC, 'importanceWeight');
    expect(agency, `${NPC_AGENCY_SRC} notability()`).not.toBeNull();
    expect(dispo, `${DISPOSITION_SRC} importanceWeight()`).not.toBeNull();
    expect(agency.rungs.length).toBeGreaterThan(2);
    expect(dispo.rungs.length).toBeGreaterThan(2);
    expect(Number.isFinite(agency.floor)).toBe(true);
    expect(Number.isFinite(dispo.floor)).toBe(true);
    // The rungs are DESCENDING and the floor sits under the last one, so the values
    // extracted are a ladder rather than an arbitrary bag of numbers that happens to
    // be equal on both sides.
    const values = agency.rungs.map(([, weight]) => weight);
    expect(values.every((weight, at) => at === 0 || values[at - 1] > weight)).toBe(true);
    expect(agency.floor).toBeLessThan(values[values.length - 1]);
  });

  test('THE SPLICED CONTROL — the extractor DOES report a drifted rung', () => {
    // The whole pin rests on the extractor being able to see a difference. Splice one
    // rung of the real agency source and confirm the reading moves; a matcher that had
    // decayed into returning the same thing for every input would fail here first.
    const real = readFileSync(join(LADDER_ROOT, NPC_AGENCY_SRC), 'utf8');
    const drifted = real.replace(
      "if (npc.importance === 'key') return 0.82;",
      "if (npc.importance === 'key') return 0.5;",
    );
    expect(drifted).not.toBe(real); // the splice actually applied
    const before = ladderFromSource(real, 'notability');
    const after = ladderFromSource(drifted, 'notability');
    expect(after).not.toEqual(before);
    expect(Object.fromEntries(after.rungs).key).toBe(0.5);
    expect(Object.fromEntries(before.rungs).key).toBe(0.82);
  });

  test('the two ladders are EQUAL rung for rung, in order, floor included', () => {
    const agency = ladderOf(NPC_AGENCY_SRC, 'notability');
    const dispo = ladderOf(DISPOSITION_SRC, 'importanceWeight');
    // Order matters as much as membership: these are short-circuiting `if` chains, so
    // two ladders with the same pairs in a different order are two different functions.
    expect(dispo.rungs).toEqual(agency.rungs);
    expect(dispo.floor).toBe(agency.floor);
  });

  test('the mirroring is DECLARED in both leaves, so the coupling is discoverable', () => {
    // A future editor reaching either function must be told the other exists. The pin
    // above catches a drift after the fact; this one keeps the reason at the site.
    const agency = readFileSync(join(LADDER_ROOT, NPC_AGENCY_SRC), 'utf8');
    const dispo = readFileSync(join(LADDER_ROOT, DISPOSITION_SRC), 'utf8');
    expect(agency).toMatch(/DELIBERATE MIRRORS/);
    expect(dispo).toMatch(/mirrors npcAgency\.notability/);
  });
});
