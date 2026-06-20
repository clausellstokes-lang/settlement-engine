import { describe, expect, test } from 'vitest';

import {
  advancePantheon,
  applyFaithDeltas,
  applyPantheonSeats,
  collectFaithDeltas,
  countSeats,
  createPantheonEntry,
  deityIdOf,
  qualifyingTier,
  ratchetPantheonTiers,
  PANTHEON_TUNING,
} from '../../src/domain/worldPulse/pantheon.js';
import { synthesizePantheonArcs } from '../../src/domain/worldPulse/realmEvents.js';
import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from './religionDormancy.byteIdentity.test.js';

// ─────────────────────────────────────────────────────────────────────────────
// Feature D / R4 — pantheon ledger + lazy tiering. The determinism danger zone.
//
// Tests assert: (1) the pantheon is ABSENT when religion is dormant (byte-identity
// under the dormancy oracle, WITH all religion code present); (2) the ratchet
// accumulates wins/seats and is commutative; (3) lazy tiering with HYSTERESIS — a
// 1-seat swing does NOT flip a tier, a decisive lead DOES; (4) a cascade-containment
// soak — the per-tick change is bounded by the cap and the pantheon CONVERGES with
// no oscillation; (5) realm arcs fire (Ascendancy / Twilight).
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

// ── Snapshot/test helpers ────────────────────────────────────────────────────
function deitySnapshot(name, { rank = 'minor' } = {}) {
  return { _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: rank };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25,
      ...(patch.deity ? { primaryDeityRef: patch.deity._deityRef, primaryDeitySnapshot: patch.deity } : {}),
    },
    institutions: patch.institutions || [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function snapshotForSaves(saves) {
  const campaign = {
    id: 'pantheon-fixture',
    settlementIds: saves.map(s => s.id),
    worldState: { rngSeed: 'pantheon-seed', tick: 4 },
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
  };
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

// A synthetic "religion result" with conversion outcomes (mirrors the
// evaluateReligiousContest outcome shape consumed by collectFaithDeltas).
function conversionOutcome(targetSaveId, winnerDeity) {
  return { targetSaveId, deityReembed: { snapshot: winnerDeity, fromSettlementId: 'src' } };
}

// ── 1. deityIdOf + qualifyingTier ────────────────────────────────────────────
describe('pantheon — deityIdOf', () => {
  test('uses _deityRef; falls back to a stable name ref; null for non-deity', () => {
    expect(deityIdOf(deitySnapshot('Vael'))).toBe('custom:lu_vael');
    expect(deityIdOf({ name: 'Anon' })).toBe('deity:Anon');
    expect(deityIdOf(null)).toBe(null);
    expect(deityIdOf({})).toBe(null);
  });
});

describe('pantheon — qualifyingTier (hysteresis margins, current-tier-relative)', () => {
  test('cult promotes only on a decisive seat lead', () => {
    expect(qualifyingTier(1, 'cult')).toBe('cult');
    expect(qualifyingTier(2, 'cult')).toBe('minor');
    expect(qualifyingTier(4, 'cult')).toBe('major');
  });
  test('a minor is STICKY across the hysteresis band (3 seats holds minor, not major)', () => {
    expect(qualifyingTier(3, 'minor')).toBe('minor'); // below MAJOR_PROMOTE 4
    expect(qualifyingTier(4, 'minor')).toBe('major');
    expect(qualifyingTier(1, 'minor')).toBe('cult'); // at/below MINOR_DEMOTE 1
    expect(qualifyingTier(2, 'minor')).toBe('minor');
  });
  test('a major holds down to MAJOR_DEMOTE+1 seats, then falls (no skip of dwell)', () => {
    expect(qualifyingTier(3, 'major')).toBe('major'); // above MAJOR_DEMOTE 2
    expect(qualifyingTier(2, 'major')).toBe('minor');
    expect(qualifyingTier(1, 'major')).toBe('cult'); // hard collapse possible
  });
});

// ── 2. Ratchet + commutativity ───────────────────────────────────────────────
describe('pantheon — ratchet wins/losses (commutative fold)', () => {
  test('applyFaithDeltas accumulates wins + losses per deity', () => {
    const led = applyFaithDeltas({}, [
      { deityId: 'a', outcome: 'win' },
      { deityId: 'a', outcome: 'win' },
      { deityId: 'b', outcome: 'loss' },
    ]);
    expect(led.a).toMatchObject({ wins: 2, losses: 0 });
    expect(led.b).toMatchObject({ wins: 0, losses: 1 });
  });

  test('reversing the delta order yields an identical ledger (commutative)', () => {
    const deltas = [
      { deityId: 'korl', outcome: 'win' },
      { deityId: 'vael', outcome: 'loss' },
      { deityId: 'korl', outcome: 'win' },
      { deityId: 'vael', outcome: 'win' },
    ];
    const fwd = applyFaithDeltas({}, deltas);
    const rev = applyFaithDeltas({}, [...deltas].reverse());
    expect(JSON.stringify(fwd)).toBe(JSON.stringify(rev));
  });

  test('empty deltas are byte-neutral (returns the input ledger)', () => {
    const led = { a: createPantheonEntry() };
    expect(applyFaithDeltas(led, [])).toBe(led);
  });
});

describe('pantheon — collectFaithDeltas from conversion outcomes', () => {
  test('winner banks a win; the displaced PRE-TICK incumbent banks a loss', () => {
    const vael = deitySnapshot('Vael', { rank: 'major' });
    const faded = deitySnapshot('Faded', { rank: 'cult' });
    // C carried Faded before the contest; the contest re-embeds Vael onto C.
    const snapshot = snapshotForSaves([
      save('asrc', 'Asrc', { deity: vael }),
      save('cconv', 'Cconv', { deity: faded }),
    ]);
    const deltas = collectFaithDeltas({ outcomes: [conversionOutcome('cconv', vael)] }, snapshot);
    expect(deltas).toContainEqual({ deityId: 'custom:lu_vael', outcome: 'win' });
    expect(deltas).toContainEqual({ deityId: 'custom:lu_faded', outcome: 'loss' });
  });

  test('an unclaimed seat (no prior deity) yields only a win, no loss', () => {
    const vael = deitySnapshot('Vael', { rank: 'major' });
    const snapshot = snapshotForSaves([
      save('asrc', 'Asrc', { deity: vael }),
      save('cconv', 'Cconv'), // no deity
    ]);
    const deltas = collectFaithDeltas({ outcomes: [conversionOutcome('cconv', vael)] }, snapshot);
    expect(deltas).toEqual([{ deityId: 'custom:lu_vael', outcome: 'win' }]);
  });
});

// ── 3. Seats from the PRE-TICK snapshot ───────────────────────────────────────
describe('pantheon — countSeats (pre-tick aggregation)', () => {
  test('counts settlements carrying each deity, codepoint-stable', () => {
    const vael = deitySnapshot('Vael');
    const korl = deitySnapshot('Korl');
    const snapshot = snapshotForSaves([
      save('a', 'A', { deity: vael }),
      save('b', 'B', { deity: vael }),
      save('c', 'C', { deity: korl }),
      save('d', 'D'), // no deity — not a seat
    ]);
    expect(countSeats(snapshot)).toEqual({ 'custom:lu_vael': 2, 'custom:lu_korl': 1 });
  });

  test('a deity that lost its last seat is set to 0 by applyPantheonSeats', () => {
    const led = { 'custom:lu_vael': { ...createPantheonEntry(), seats: 3, tier: 'minor' } };
    const next = applyPantheonSeats(led, {}); // no seats this tick
    expect(next['custom:lu_vael'].seats).toBe(0);
  });
});

// ── 4. Lazy tiering + HYSTERESIS dwell ────────────────────────────────────────
describe('pantheon — lazy tier with hysteresis dwell', () => {
  test('a 1-seat swing across a boundary does NOT flip a tier within the dwell', () => {
    // A minor deity sits at 3 seats (inside the band) — never qualifies major.
    let led = { d: { ...createPantheonEntry(), tier: 'minor', seats: 3 } };
    for (let i = 0; i < 5; i += 1) {
      led = applyPantheonSeats(led, { d: 3 });
      ({ ledger: led } = ratchetPantheonTiers(led));
      expect(led.d.tier).toBe('minor'); // sticky — no flip on the swing
    }
    // Bump to 4 seats (the decisive lead) — still needs to HOLD past the dwell.
    led = applyPantheonSeats(led, { d: 4 });
    ({ ledger: led } = ratchetPantheonTiers(led));
    // After ONE tick at 4 seats it has not yet matured (TIER_HOLD_TICKS = 2).
    expect(led.d.tier).toBe('minor');
    expect(led.d.tierHeld).toBe(1);
  });

  test('a decisive multi-seat lead DOES promote once the dwell matures', () => {
    let led = { d: { ...createPantheonEntry(), tier: 'minor', seats: 4 } };
    // Hold 4 seats for TIER_HOLD_TICKS ticks → promotion lands.
    for (let i = 0; i < PANTHEON_TUNING.TIER_HOLD_TICKS; i += 1) {
      led = applyPantheonSeats(led, { d: 4 });
      ({ ledger: led } = ratchetPantheonTiers(led));
    }
    expect(led.d.tier).toBe('major');
    expect(led.d.tierHeld).toBe(0); // reset on change
  });

  test('a brief swing that reverts BEFORE the dwell never flips the tier (no oscillation)', () => {
    let led = { d: { ...createPantheonEntry(), tier: 'minor', seats: 3 } };
    // One tick at 4 seats (qualifies major, dwell=1), then back to 3 (resets).
    led = applyPantheonSeats(led, { d: 4 });
    ({ ledger: led } = ratchetPantheonTiers(led));
    expect(led.d.tier).toBe('minor');
    led = applyPantheonSeats(led, { d: 3 });
    ({ ledger: led } = ratchetPantheonTiers(led));
    expect(led.d.tier).toBe('minor');
    expect(led.d.tierHeld).toBe(0); // the brief swing left no residue
  });
});

// ── 5. CASCADE-CONTAINMENT cap + convergence soak ─────────────────────────────
describe('pantheon — cascade containment (bounded per-tick change, convergence)', () => {
  test('at most MAX_TIER_CHANGES_PER_TICK tiers change in any single tick', () => {
    // Five deities all simultaneously cross a tier boundary (a contrived map-wide
    // flip). The cap must bound the per-tick churn; the rest defer.
    const cap = PANTHEON_TUNING.MAX_TIER_CHANGES_PER_TICK;
    let led = {};
    for (const id of ['d1', 'd2', 'd3', 'd4', 'd5']) {
      led[id] = { ...createPantheonEntry(), tier: 'cult', seats: 4 }; // all qualify major
    }
    // Mature the dwell first (hold the decisive lead).
    for (let i = 0; i < PANTHEON_TUNING.TIER_HOLD_TICKS - 1; i += 1) {
      led = applyPantheonSeats(led, { d1: 4, d2: 4, d3: 4, d4: 4, d5: 4 });
      ({ ledger: led } = ratchetPantheonTiers(led));
    }
    // The maturing tick: only `cap` deities may flip.
    led = applyPantheonSeats(led, { d1: 4, d2: 4, d3: 4, d4: 4, d5: 4 });
    const res = ratchetPantheonTiers(led);
    led = res.ledger;
    expect(res.changes.length).toBe(cap);
    const majors = Object.values(led).filter(e => e.tier === 'major').length;
    expect(majors).toBe(cap);
  });

  test('the deferred changes CONVERGE over subsequent ticks (no infinite churn)', () => {
    let led = {};
    for (const id of ['d1', 'd2', 'd3', 'd4', 'd5']) {
      led[id] = { ...createPantheonEntry(), tier: 'cult', seats: 4 };
    }
    const seats = { d1: 4, d2: 4, d3: 4, d4: 4, d5: 4 };
    let totalChanges = 0;
    // Run many ticks; eventually ALL five reach major and the churn stops.
    for (let i = 0; i < 12; i += 1) {
      led = applyPantheonSeats(led, seats);
      const res = ratchetPantheonTiers(led);
      led = res.ledger;
      totalChanges += res.changes.length;
      // Per-tick change is ALWAYS bounded by the cap (never a map-wide flip).
      expect(res.changes.length).toBeLessThanOrEqual(PANTHEON_TUNING.MAX_TIER_CHANGES_PER_TICK);
    }
    // Converged: all five are major, and no more changes fire (steady state).
    expect(Object.values(led).every(e => e.tier === 'major')).toBe(true);
    const steady = ratchetPantheonTiers(led);
    expect(steady.changes.length).toBe(0);
    // Exactly five promotions happened in total — no oscillation re-flipping.
    expect(totalChanges).toBe(5);
  });
});

// ── 6. Realm arcs ─────────────────────────────────────────────────────────────
describe('pantheon — realm arcs (Ascendancy / Twilight)', () => {
  const snapshot = snapshotForSaves([save('a', 'A', { deity: deitySnapshot('Vael', { rank: 'major' }) })]);

  test('a deity reaching major emits an Ascendancy arc', () => {
    const entries = synthesizePantheonArcs({
      changes: [{ deityId: 'custom:lu_vael', from: 'minor', to: 'major' }],
      snapshot, tick: 5, now: NOW,
    });
    expect(entries.length).toBe(1);
    expect(entries[0].headline).toBe('The Ascendancy of Vael');
    expect(entries[0].impactKind).toBe('pantheon_ascendancy');
    expect(entries[0].scope).toBe('realm');
  });

  test('a deity falling to cult emits a Twilight arc', () => {
    const entries = synthesizePantheonArcs({
      changes: [{ deityId: 'custom:lu_vael', from: 'minor', to: 'cult' }],
      snapshot, tick: 5, now: NOW,
    });
    expect(entries.length).toBe(1);
    expect(entries[0].headline).toBe('The Twilight of Vael');
    expect(entries[0].impactKind).toBe('pantheon_twilight');
  });

  test('a minor↔minor drift emits nothing', () => {
    expect(synthesizePantheonArcs({ changes: [{ deityId: 'x', from: 'cult', to: 'minor' }], snapshot, tick: 5 })).toEqual([]);
  });
});

// ── 7. advancePantheon end-to-end (ratchet + seats + tier) ────────────────────
describe('pantheon — advancePantheon (full per-tick write)', () => {
  test('folds deltas, counts seats, derives tiers; order-independent', () => {
    const vael = deitySnapshot('Vael');
    const korl = deitySnapshot('Korl');
    const snapshot = snapshotForSaves([
      save('a', 'A', { deity: vael }),
      save('b', 'B', { deity: vael }),
      save('c', 'C', { deity: korl }),
    ]);
    const deltas = [
      { deityId: 'custom:lu_vael', outcome: 'win' },
      { deityId: 'custom:lu_korl', outcome: 'loss' },
    ];
    const fwd = advancePantheon({ pantheon: {}, snapshot, faithDeltas: deltas });
    const rev = advancePantheon({ pantheon: {}, snapshot, faithDeltas: [...deltas].reverse() });
    // Seats aggregated from the snapshot; wins/losses ratcheted.
    expect(fwd.pantheon['custom:lu_vael']).toMatchObject({ wins: 1, seats: 2 });
    expect(fwd.pantheon['custom:lu_korl']).toMatchObject({ losses: 1, seats: 1 });
    // Order-independent.
    expect(JSON.stringify(fwd.pantheon)).toBe(JSON.stringify(rev.pantheon));
  });
});

// ── 8. CONDITIONAL materialization at the worldState layer ─────────────────────
describe('pantheon — conditional materialization (ensureWorldState)', () => {
  test('an absent pantheon stays absent (no key materialized)', () => {
    const ws = ensureWorldState({ rngSeed: 's', tick: 1 });
    expect('pantheon' in ws).toBe(false);
  });

  test('an EMPTY pantheon normalizes to absent (no key carried through)', () => {
    const ws = ensureWorldState({ rngSeed: 's', tick: 1, pantheon: {} });
    expect('pantheon' in ws).toBe(false);
  });

  test('a present, non-empty pantheon is deep-cloned (no aliasing)', () => {
    const src = { 'custom:lu_vael': { wins: 2, losses: 0, seats: 2, tier: 'minor', tierHeld: 0 } };
    const ws = ensureWorldState({ rngSeed: 's', tick: 1, pantheon: src });
    expect(ws.pantheon).toEqual(src);
    expect(ws.pantheon).not.toBe(src); // a clone, not the same ref
    expect(ws.pantheon['custom:lu_vael']).not.toBe(src['custom:lu_vael']);
  });
});

// ── 9. FULL-STACK dormancy: the pantheon is absent when religion is dormant ────
describe('pantheon — full-stack dormancy byte-identity (religion code present)', () => {
  function deityFreeCampaign(worldStatePatch = {}) {
    return {
      id: 'pantheon-dormancy', name: 'Pantheon Dormancy',
      settlementIds: ['a', 'b', 'c'],
      worldState: {
        rngSeed: 'pantheon-dormancy-seed', tick: 3,
        stressors: [
          { id: 'world_stressor.famine.a', type: 'famine', severity: 0.72, affectedSettlementIds: ['a'], age: 2 },
          { id: 'world_stressor.market_shock.b', type: 'market_shock', severity: 0.5, affectedSettlementIds: ['b'], age: 1 },
        ],
        ...worldStatePatch,
      },
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        ],
        channels: [
          { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
          { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
        ],
      }),
      wizardNews: { currentTick: 3, entries: [] },
    };
  }
  const dormSaves = () => [save('a', 'Ashford'), save('b', 'Briarwatch'), save('c', 'Crownhold')];

  test('a deity-free pulse with the flag ON carries NO pantheon key (the activation gate short-circuits)', () => {
    const on = previewCampaignWorldPulse({
      campaign: deityFreeCampaign({ simulationRules: { religionDynamicsEnabled: true } }),
      saves: dormSaves(), interval: 'one_month', now: NOW,
    });
    // Anti-vacuity: the pulse did real work.
    expect(on.selected.length).toBeGreaterThan(0);
    // No pantheon key — the F2 activation gate (no embedded deity) short-circuits
    // before the pantheon ratchet can ever materialize the key.
    expect('pantheon' in on.worldState).toBe(false);
  });

  test('the pantheon addition is byte-neutral under the oracle: with the flag ON vs OFF (both deity-free)', () => {
    // Hold the simulationRules constant (the flag itself is real signal); the only
    // delta this test isolates is the R4 pantheon code path. Both pulses run with
    // the SAME rules and NO deity ⇒ the pantheon never materializes ⇒ byte-identical.
    const rules = { simulationRules: { religionDynamicsEnabled: true } };
    const a = previewCampaignWorldPulse({ campaign: deityFreeCampaign(rules), saves: dormSaves(), interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({
      // Same rules; the only difference is a synthetic empty pantheon on input,
      // which the conditional materialization must collapse to absent.
      campaign: deityFreeCampaign({ ...rules, pantheon: {} }),
      saves: dormSaves(), interval: 'one_month', now: NOW,
    });
    expect('pantheon' in a.worldState).toBe(false);
    expect('pantheon' in b.worldState).toBe(false);
    expect(normalizeForDormancy(a.worldState)).toEqual(normalizeForDormancy(b.worldState));
  });
});

// ── 10. INTEGRATION: a conversion ratchets the pantheon through the full pulse ─
describe('pantheon — full-pulse integration (ratchet + materialization)', () => {
  // Two strong major deities at A and B, both linked to a weak deity-free convert
  // C — the contest converts C and the winner banks a seat + a win in the pantheon.
  function contestSaves() {
    return [
      save('asource', 'Asource', { deity: deitySnapshot('Vael', { rank: 'major' }) }),
      save('bsource', 'Bsource', { deity: deitySnapshot('Korl', { rank: 'major' }) }),
      save('cconv', 'Cconv', { legitimacy: 30 }),
    ];
  }
  function contestCampaign() {
    return {
      id: 'pantheon-contest', name: 'Pantheon Contest',
      settlementIds: ['asource', 'bsource', 'cconv'],
      worldState: { rngSeed: 'pantheon-contest-seed', tick: 4, simulationRules: { religionDynamicsEnabled: true } },
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.asource.cconv', from: 'asource', to: 'cconv', relationshipType: 'allied' },
          { id: 'edge.bsource.cconv', from: 'bsource', to: 'cconv', relationshipType: 'trade_partner' },
        ],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }

  test('the pantheon materializes and the seat-holders are tracked when religion is active', () => {
    const pulse = previewCampaignWorldPulse({ campaign: contestCampaign(), saves: contestSaves(), interval: 'one_month', now: NOW });
    // Religion is active (deities present + flag on) ⇒ the pantheon key exists.
    expect('pantheon' in pulse.worldState).toBe(true);
    const pantheon = pulse.worldState.pantheon;
    // Vael + Korl each hold their home seat (pre-tick aggregation).
    expect(pantheon['custom:lu_vael']?.seats).toBeGreaterThanOrEqual(1);
    expect(pantheon['custom:lu_korl']?.seats).toBeGreaterThanOrEqual(1);
    // Every entry carries the full ledger shape.
    for (const entry of Object.values(pantheon)) {
      expect(entry).toHaveProperty('wins');
      expect(entry).toHaveProperty('seats');
      expect(entry).toHaveProperty('tier');
    }
  });

  test('reversing the saves order yields a byte-identical pantheon (order-independence)', () => {
    const fwd = previewCampaignWorldPulse({ campaign: contestCampaign(), saves: contestSaves(), interval: 'one_month', now: NOW });
    const rev = previewCampaignWorldPulse({ campaign: contestCampaign(), saves: [...contestSaves()].reverse(), interval: 'one_month', now: NOW });
    expect(JSON.stringify(fwd.worldState.pantheon)).toBe(JSON.stringify(rev.worldState.pantheon));
  });

  // A dominant deity (Vael) embedded on FOUR seats — at/above MAJOR_PROMOTE. With a
  // pre-seeded pantheon already at the dwell boundary, the next active pulse matures
  // the promotion and fires "The Ascendancy of Vael" into the news feed.
  test('a deity holding a decisive lead emits an Ascendancy arc through the full pulse', () => {
    const vael = deitySnapshot('Vael', { rank: 'major' });
    const saves = [
      save('s1', 'S1', { deity: vael }),
      save('s2', 'S2', { deity: vael }),
      save('s3', 'S3', { deity: vael }),
      save('s4', 'S4', { deity: vael }),
    ];
    const campaign = {
      id: 'ascendancy', name: 'Ascendancy', settlementIds: saves.map(s => s.id),
      worldState: {
        rngSeed: 'ascendancy-seed', tick: 4,
        simulationRules: { religionDynamicsEnabled: true },
        // Pre-seed Vael as a minor at the dwell boundary (tierHeld already 1, so the
        // NEXT pulse matures the major promotion: seats=4 ≥ MAJOR_PROMOTE).
        pantheon: { 'custom:lu_vael': { wins: 3, losses: 0, seats: 4, tier: 'minor', tierHeld: 1 } },
      },
      regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
      wizardNews: { currentTick: 4, entries: [] },
    };
    const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    expect(pulse.worldState.pantheon['custom:lu_vael'].tier).toBe('major');
    const arc = (pulse.wizardNews?.entries || []).find(e => e.impactKind === 'pantheon_ascendancy');
    expect(arc).toBeTruthy();
    expect(arc.headline).toBe('The Ascendancy of Vael');
  });
});
