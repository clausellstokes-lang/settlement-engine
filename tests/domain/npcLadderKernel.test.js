/**
 * npcLadderKernel.test.js — THE LADDER mechanism pins (DESIGN_THE_LADDER.md).
 *
 * The behavioural pins for the ladder kernel + its pure state layer, built up
 * mechanism-by-mechanism alongside the commits: derivation + conservation (this file's
 * first block), then goals / windows / challenge / three-body / stigma / standing-loop.
 * The dormancy byte-identity + lit anti-vacuity live in
 * tests/property/npcLadderDormancyGolden.test.js.
 */
import { describe, it, expect } from 'vitest';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import {
  eligibleMembersOf, ladderFactionKey, rungCapForTier, seedStandingForRung,
  decayStandingTowardBaseline, LADDER_TUNING,
} from '../../src/domain/worldPulse/npcLadderState.js';

// ── A tiny harness: drive advanceNpcLadder over one settlement, one advance. ──
const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
function npc(id, name, importance, dots, rank) {
  return { id, name, role: name, importance, dots, structuralRank: rank, factionAffiliation: "Merchants' Guild", personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } };
}
function courtSettlement(npcs, extra = {}) {
  return {
    name: 'Ashford', tier: 'city', population: 9000,
    powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
    npcs, institutions: [], activeConditions: [], ...extra,
  };
}
/** Drive one lit advance; return { worldState, settlement (post-mirror), rec }. When
 *  `causal` is supplied, the snapshot carries a byId Map with that causal state so goals
 *  can mint/evaluate (the real-pulse postTimeSnapshot condition). */
function advance(settlement, { weeks = 260, tick = 260, priorLedger = null, causal = null } = {}) {
  const worldState = {
    simulationRules: { npcLadderEnabled: true },
    calendar: { elapsedWeeks: weeks },
    ...(priorLedger ? { spatialLedgers: { npcLadder: priorLedger } } : {}),
  };
  const item = { id: 'a', name: 'Ashford', settlement, ...(causal ? { causal } : {}) };
  const snapshot = { settlements: [item], ...(causal ? { byId: new Map([['a', item]]) } : {}) };
  const settlementUpdates = [{ saveId: 'a', settlement }];
  const r = advanceNpcLadder({ snapshot, worldState, settlementUpdates, tick, now: null });
  const outSettlement = r.settlementUpdates[0]?.settlement;
  const rec = r.worldState?.spatialLedgers?.npcLadder?.a || null;
  return { result: r, settlement: outSettlement, rec };
}

describe('ladder derivation — structural ordering + conservation (commit 2)', () => {
  it('derives the ladder top-rung-first by importance, then dots, then structural rank, then codepoint', () => {
    const npcs = [
      npc('n_clerk', 'Clerk Bevin', 'notable', 1, 'minor'),
      npc('n_master', 'Guildmaster Aldric', 'pillar', 3, 'dominant'),
      npc('n_factor', 'Factor Maera', 'key', 2, 'subordinate'),
    ];
    const { rec } = advance(courtSettlement(npcs));
    const fkey = ladderFactionKey(guild);
    expect(rec.factions[fkey].rungs).toEqual(['a:n_master', 'a:n_factor', 'a:n_clerk']);
  });

  it('excludes below-floor extras (a nameless minor never holds a rung)', () => {
    const npcs = [
      npc('n_master', 'Guildmaster Aldric', 'pillar', 3, 'dominant'),
      npc('n_extra', 'Porter', 'minor', 0, 'minor'),
    ];
    const members = eligibleMembersOf('a', courtSettlement(npcs), guild, ladderFactionKey(guild));
    expect(members.map((m) => m.npcId)).toEqual(['a:n_master']);
  });

  it('CONSERVATION: rung count == eligible member count (capped by tier); no invented rungs', () => {
    const npcs = [
      npc('n1', 'One', 'pillar', 3, 'dominant'), npc('n2', 'Two', 'key', 2, 'subordinate'),
      npc('n3', 'Three', 'notable', 1, 'minor'), npc('n4', 'Four', 'key', 2, 'subordinate'),
      npc('n5', 'Five', 'notable', 1, 'minor'),
    ];
    // city cap = 4 ⇒ five eligible members yield exactly four rungs, no more.
    const { rec } = advance(courtSettlement(npcs));
    const fkey = ladderFactionKey(guild);
    expect(rec.factions[fkey].rungs.length).toBe(rungCapForTier('city'));
    expect(rec.factions[fkey].rungs.length).toBe(4);
  });

  it('a thorp faction is a single seat (rung cap 1)', () => {
    const npcs = [npc('n1', 'One', 'pillar', 3, 'dominant'), npc('n2', 'Two', 'key', 2, 'subordinate')];
    const { rec } = advance(courtSettlement(npcs, { tier: 'thorp' }));
    const fkey = ladderFactionKey(guild);
    expect(rec.factions[fkey].rungs).toEqual(['a:n1']);
  });
});

describe('ladder persistence — the contested ordering persists; entrants join at the floor', () => {
  it('a prior ladder ordering PERSISTS (not re-derived); a new eligible member appends at the FLOOR', () => {
    const npcs0 = [npc('n_master', 'Master', 'pillar', 3, 'dominant'), npc('n_factor', 'Factor', 'key', 2, 'subordinate')];
    const first = advance(courtSettlement(npcs0));
    const fkey = ladderFactionKey(guild);
    // Hand-swap the persisted ordering (as a challenge would) — factor now on top.
    const swapped = JSON.parse(JSON.stringify(first.rec));
    swapped.factions[fkey].rungs = ['a:n_factor', 'a:n_master'];
    // A new senior member arrives; the persisted swap must SURVIVE, newcomer at floor.
    const npcs1 = [...npcs0, npc('n_new', 'Newcomer', 'pillar', 3, 'dominant')];
    const second = advance(courtSettlement(npcs1), { weeks: 264, tick: 264, priorLedger: { a: swapped } });
    expect(second.rec.factions[fkey].rungs).toEqual(['a:n_factor', 'a:n_master', 'a:n_new']);
  });

  it('a member who leaves the faction drops off the ladder (state-never-fate: they remain, the rung does not)', () => {
    const npcs0 = [npc('n_master', 'Master', 'pillar', 3, 'dominant'), npc('n_factor', 'Factor', 'key', 2, 'subordinate')];
    const first = advance(courtSettlement(npcs0));
    const fkey = ladderFactionKey(guild);
    // The factor departs (removed from the roster next tick).
    const npcs1 = [npc('n_master', 'Master', 'pillar', 3, 'dominant')];
    const second = advance(courtSettlement(npcs1), { weeks: 264, tick: 264, priorLedger: { a: first.rec } });
    expect(second.rec.factions[fkey].rungs).toEqual(['a:n_master']);
  });
});

describe('ladder standing — the integrator (fabric idiom) + interval invariance', () => {
  it('seeds the top rung above the floor rung (defender\'s-advantage head start)', () => {
    expect(seedStandingForRung(0, 3)).toBeGreaterThan(seedStandingForRung(2, 3));
    expect(seedStandingForRung(2, 3)).toBeCloseTo(LADDER_TUNING.STAND_BASELINE, 6);
    expect(seedStandingForRung(0, 1)).toBeCloseTo(LADDER_TUNING.STAND_BASELINE + LADDER_TUNING.SEED_SPREAD, 6);
  });

  it('decays standing toward BASELINE over elapsed weeks (glory fades), interval-invariant', () => {
    const start = LADDER_TUNING.STAND_BASELINE + LADDER_TUNING.SEED_SPREAD; // seeded high
    const oneStep = decayStandingTowardBaseline(start, 156); // one half-life
    expect(oneStep).toBeCloseTo(LADDER_TUNING.STAND_BASELINE + LADDER_TUNING.SEED_SPREAD / 2, 6);
    // Interval invariance: 156 weeks in one step == two 78-week steps (same total weeks).
    const twoSteps = decayStandingTowardBaseline(decayStandingTowardBaseline(start, 78), 78);
    expect(twoSteps).toBeCloseTo(oneStep, 6);
    // Decays toward baseline, never past it.
    expect(decayStandingTowardBaseline(start, 100000)).toBeCloseTo(LADDER_TUNING.STAND_BASELINE, 4);
  });

  it('the same-week advance is idempotent (zero elapsed + mirror in place ⇒ byte-stable no-op)', () => {
    const npcs = [npc('n_master', 'Master', 'pillar', 3, 'dominant'), npc('n_factor', 'Factor', 'key', 2, 'subordinate')];
    const first = advance(courtSettlement(npcs));
    // Re-drive with the FIRST advance's output settlement (mirror already landed) + its
    // ledger, at the SAME week — the real-pulse steady state. Nothing must change.
    const again = advance(first.settlement, { weeks: 260, tick: 260, priorLedger: { a: first.rec } });
    expect(again.rec).toEqual(first.rec);
    expect(again.result.changed).toBe(false);
  });
});

describe('ladder goals — standing deposits through the mover (§9 weighted deeds, §11.3)', () => {
  const npcs = [npc('n_master', 'Master', 'pillar', 3, 'dominant')];
  it('a goal that visibly ADVANCES deposits into standing; a REVERSAL withdraws (magnitude-mirrored)', () => {
    // Mint the goal at a low domain score (economic_capacity 30 → threshold), banking progress 0.
    const t0 = advance(courtSettlement(npcs), { weeks: 260, tick: 260, causal: { scores: { economic_capacity: 30 }, bands: {} } });
    const s0 = t0.rec.npcs['a:n_master'].stock;
    expect(t0.rec.npcs['a:n_master'].goal, 'the rung-holder minted a goal').toBeTruthy();
    // Next advance: the domain signal ROSE — visible progress deposits, standing rises.
    const t1 = advance(t0.settlement, { weeks: 264, tick: 264, priorLedger: { a: t0.rec }, causal: { scores: { economic_capacity: 55 }, bands: {} } });
    const s1 = t1.rec.npcs['a:n_master'].stock;
    expect(s1, 'visible progress deposits into standing').toBeGreaterThan(s0);
    // Next advance: the signal FELL back — the reversal withdraws (standing drops from s1).
    const t2 = advance(t1.settlement, { weeks: 268, tick: 268, priorLedger: { a: t1.rec }, causal: { scores: { economic_capacity: 30 }, bands: {} } });
    const s2 = t2.rec.npcs['a:n_master'].stock;
    expect(s2, 'a reversal withdraws standing, magnitude-mirrored').toBeLessThan(s1);
  });

  it('determinism: same seed/state ⇒ byte-identical goal + standing across two runs', () => {
    const causal = { scores: { economic_capacity: 30 }, bands: {} };
    const a = advance(courtSettlement(npcs), { weeks: 260, tick: 260, causal });
    const b = advance(courtSettlement(npcs), { weeks: 260, tick: 260, causal });
    expect(JSON.stringify(a.rec)).toBe(JSON.stringify(b.rec));
  });
});
