/**
 * livedExperienceLoops.test.js — THE F12 LOOP PROPERTIES (W-LIVES car L4;
 * DESIGN_W_LIVES.md §9 risks 2 and 5, and §15's F11/F12).
 *
 * F12 added two loops to §9's enumeration and asked for property tests. §9 risk 2
 * asks that "no unbounded trajectory under constant pull" be asserted rather than
 * hoped (the 300-year-runaway lesson, structural), and risk 5 asks that "decay home
 * outpaces ambient pull at equilibrium for all but `defining` pressure" be a
 * property rather than a hope. F11 restates the second over the AGGREGATE.
 *
 * Every number below was MEASURED through the real funnel before it was written
 * down, and the measurement changed what this file says. The linear model F11
 * quotes — x* = pull/(1-decay) — predicts an ambient equilibrium of 4.45 BANDS for
 * today's tuning, which would fail risk 5 outright. The real store does something
 * else, and the reason is L2's floor read in the other direction:
 *
 *   ⭐⭐ A PULL OF EXACTLY ONE FLOOR QUANTUM CAN NEVER ACCUMULATE PAST ONE FLOOR
 *   QUANTUM. Decay always shrinks a stored offset, so an offset sitting exactly AT
 *   the floor always falls BELOW it — and F9's delete-under-floor then removes the
 *   cell entirely. The next quantum starts from zero. L2 measured that the floor
 *   blocks accumulation from BELOW; this is the same wall from ABOVE, and it is
 *   what makes risk 5 hold with a factor of four to spare.
 *
 *   ⚠ AND IT HOLDS BY EXACTLY 6%. The largest per-cadence quantum whose equilibrium
 *   stays under one band is ~0.2649 — the floor divided by one cadence of decay.
 *   `faint` is 0.25. The margin between "sound" and "saturated at the clamp" is one
 *   rung of the family ladder: at `firm` per cadence the equilibrium is 8.9 bands,
 *   which the clamp truncates to the whole spectrum. Risk 5 survives today ONLY
 *   because the milieu family's step of -2 clamps every milieu pull to `faint`.
 *   That is an owner-signable number sitting on a 6% margin, and it is named here
 *   so the pen sees it before signing rather than after.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`.
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';

import {
  AMBIENT_CADENCE_TICKS,
  FUNNEL_TUNING,
  foldLivedExperience,
} from '../../../src/domain/npc/livedExperienceFunnel.js';
import {
  MATERIALIZATION_EPSILON,
  MAX_AXIS_OFFSET,
  axisOffsetOf,
} from '../../../src/domain/npc/characterDrift.js';
import { durableIdForRoster } from '../../../src/domain/worldPulse/npcLedger.js';
import { HALF_LIFE_BANDS, decayTowardNeutral } from '../../../src/domain/worldPulse/bandedStock.js';
import { SOURCE_ADAPTER_OF } from '../../../src/domain/npc/livedExperienceSources.js';

const TOWN = 'save.town';
const SEED = 'seed.town';
const YEAR_TICKS = 52;

const soul = (id, name, axes = {}) => ({ id, name, role: 'Reeve', character: { axes } });
const lit = () => ({ tick: 0, simulationRules: { characterDriftEnabled: true, npcConsequencesEnabled: true } });
const idOf = (worldState, npc) =>
  durableIdForRoster(worldState, TOWN, { rosterId: npc.id, name: npc.name, role: npc.role });
const offsetOf = (worldState, npc, axisId) => {
  const id = idOf(worldState, npc);
  return id ? axisOffsetOf(worldState, id, axisId) : 0;
};

/**
 * Drive the REAL funnel for `periods` ambient cadences of unbroken dwelling, and
 * return the peak magnitude the soul ever reached. Peak, not final: an equilibrium
 * claim that only reads the last sample cannot see an excursion.
 * @param {string} band @param {number} periods @returns {number}
 */
function milieuPeak(band, periods) {
  const npc = soul('npc_1', 'Alda');
  let worldState = lit();
  let peak = 0;
  for (let period = 1; period <= periods; period += 1) {
    const tick = period * AMBIENT_CADENCE_TICKS;
    worldState = foldLivedExperience({
      worldState,
      tick,
      entries: [{
        kind: 'dwell_milieu', settlementId: TOWN, settlementSeed: SEED, npc,
        eventId: `dwell.${period}`, spanTicks: AMBIENT_CADENCE_TICKS,
        pulls: [{ axisId: 'MERCY', pole: 'vice', band }],
      }],
    }).worldState;
    peak = Math.max(peak, Math.abs(offsetOf(worldState, npc, 'MERCY')));
  }
  return peak;
}

describe('⭐⭐ F12 LOOP 1 — the settlement↔citizen milieu echo', () => {
  test('SEVENTY-FIVE YEARS of unbroken dwelling leaves a QUARTER of one band', () => {
    // 300 cadences is 300 seasons is 75 years — a whole life, and then some, spent
    // inside one city's character. §800.4's "gentle man in a cruel city" is the
    // sentence this measures.
    expect(milieuPeak('faint', 300)).toBe(MATERIALIZATION_EPSILON);
    expect(MATERIALIZATION_EPSILON).toBeLessThan(1);
  });

  test('and the HOST\'S DEPTH does not change it — the family ladder clamps all three', () => {
    // A `defining`-cruel city and a `a_touch`-cruel one teach the same amount,
    // because the milieu family's step of -2 collapses heavy, firm and faint onto
    // the floor. The host's depth is carried honestly by the adapter's band word
    // and then erased by the tuning. That is a real expressive loss and an owner
    // row, not a bug — and it is the same clamp that makes risk 5 hold.
    expect(FUNNEL_TUNING.familyStep.milieu).toBe(-2);
    for (const band of ['faint', 'firm', 'heavy']) {
      expect(milieuPeak(band, 60), band).toBe(MATERIALIZATION_EPSILON);
    }
  });

  test('⭐⭐ WHY: a quantum that IS the floor can never survive its own decay', () => {
    // The wall, stated as arithmetic. A stored offset must exceed floor/r to
    // survive one cadence of decay; `faint` IS the floor, and r < 1 always, so
    // floor/r > floor and the cell is deleted every single time.
    for (const band of HALF_LIFE_BANDS) {
      const survived = decayTowardNeutral(MATERIALIZATION_EPSILON, 0, AMBIENT_CADENCE_TICKS, band);
      expect(Math.abs(survived), band).toBeLessThan(MATERIALIZATION_EPSILON);
    }
    // Which means the ceiling is independent of the half-life the owner signs —
    // the strongest form of this property, and the one worth relying on.
    expect(FUNNEL_TUNING.decayBand).toBe('a_few_years');
  });

  test('⚠ AND THE MARGIN IS 6% — one rung of the family ladder from saturation', () => {
    const r = decayTowardNeutral(1, 0, AMBIENT_CADENCE_TICKS, FUNNEL_TUNING.decayBand);
    const largestSafe = MATERIALIZATION_EPSILON / r;
    expect(largestSafe).toBeGreaterThan(FUNNEL_TUNING.magnitudes.faint);
    expect(largestSafe / FUNNEL_TUNING.magnitudes.faint).toBeLessThan(1.07);
    // At `firm` per cadence the linear equilibrium is nearly nine bands, which the
    // clamp truncates to the entire spectrum: every citizen of every town would
    // reach `defining` on every axis their host pulls. The pen must see this
    // number before it signs a family ladder, not after.
    const firmEquilibrium = FUNNEL_TUNING.magnitudes.firm / (1 - r);
    expect(firmEquilibrium).toBeGreaterThan(MAX_AXIS_OFFSET);
  });

  test('the echo closes: what the citizen learns cannot outrun what the town is', () => {
    // The loop F12 names runs citizen -> acts -> town channels -> citizen. Its
    // brake is that the citizen half is bounded by a quarter band regardless of how
    // hard the town half pushes — proved above across all three host depths — so no
    // amount of feedback through the settlement can carry the person further.
    const npc = soul('npc_1', 'Alda', { MERCY: { pole: 'virtue', level: 'defining' } });
    let worldState = lit();
    for (let period = 1; period <= 120; period += 1) {
      worldState = foldLivedExperience({
        worldState, tick: period * AMBIENT_CADENCE_TICKS,
        entries: [{
          kind: 'dwell_milieu', settlementId: TOWN, settlementSeed: SEED, npc,
          eventId: `dwell.${period}`, spanTicks: AMBIENT_CADENCE_TICKS,
          pulls: [{ axisId: 'MERCY', pole: 'vice', band: 'heavy' }],
        }],
      }).worldState;
    }
    // Thirty years of a cruel city, and a `defining` merciful man is still
    // `defining` merciful. Identity erosion is structurally impossible here today.
    expect(Math.abs(offsetOf(worldState, npc, 'MERCY'))).toBe(MATERIALIZATION_EPSILON);
  });
});

describe('⭐ F12 LOOP 2 — the bench↔offers echo (GAP C group character)', () => {
  /**
   * The loop, modelled at the SUBSTRATE grain: a bench's character is the
   * org-power-weighted projection of its seated members (GAP C), that character
   * shapes what the court offers, and the offers select who serves. The production
   * seam is car L5's; what this car owes is that the substrate underneath ANY such
   * consumer cannot run away, so the projection is a local closure and the
   * assertion is about the drift store, not about a court.
   * @param {Record<string, unknown>} worldState
   * @param {ReadonlyArray<{npc: object, power: number}>} seats @returns {number}
   */
  function benchCharacter(worldState, seats) {
    let sum = 0;
    let weight = 0;
    for (const seat of seats) {
      const authored = seat.npc.character.axes.JUSTICE;
      const core = authored ? (authored.pole === 'virtue' ? 1 : -1) * (['a_touch', 'marked', 'defining'].indexOf(authored.level) + 1) : 0;
      sum += (core + offsetOf(worldState, seat.npc, 'JUSTICE')) * seat.power;
      weight += seat.power;
    }
    return weight === 0 ? 0 : sum / weight;
  }

  const SEATS = [
    { npc: soul('npc_1', 'Ana', { JUSTICE: { pole: 'virtue', level: 'defining' } }), power: 3 },
    { npc: soul('npc_2', 'Bero', { JUSTICE: { pole: 'vice', level: 'marked' } }), power: 2 },
    { npc: soul('npc_3', 'Cund'), power: 1 },
  ];

  test('the loop CONVERGES and every member stays a quarter band from their core', () => {
    let worldState = lit();
    const trace = [];
    for (let period = 1; period <= 200; period += 1) {
      // The offers half: the bench's own character decides which way it pulls the
      // people who serve on it. This is the feedback edge F12 names.
      const pole = benchCharacter(worldState, SEATS) < 0 ? 'vice' : 'virtue';
      worldState = foldLivedExperience({
        worldState, tick: period * AMBIENT_CADENCE_TICKS,
        entries: SEATS.map((seat) => ({
          kind: 'dwell_milieu', settlementId: TOWN, settlementSeed: SEED, npc: seat.npc,
          eventId: `bench.${period}.${seat.npc.id}`, spanTicks: AMBIENT_CADENCE_TICKS,
          pulls: [{ axisId: 'JUSTICE', pole, band: 'heavy' }],
        })),
      }).worldState;
      trace.push(benchCharacter(worldState, SEATS));
    }
    // CONVERGED: the last hundred readings are identical, so the loop has a fixed
    // point rather than a slow drift nobody sampled long enough to see.
    expect(new Set(trace.slice(100).map((v) => v.toFixed(10))).size).toBe(1);
    for (const seat of SEATS) {
      expect(Math.abs(offsetOf(worldState, seat.npc, 'JUSTICE')), seat.npc.name)
        .toBeLessThanOrEqual(MATERIALIZATION_EPSILON);
    }
  });

  test('the bench never crosses its own midpoint on the strength of the echo alone', () => {
    // The failure this guards is a court that talks itself into its own opposite: a
    // marginally-just bench pulling its members toward justice, whose new character
    // pulls harder, and so on. The quarter-band ceiling makes it unreachable.
    let worldState = lit();
    const start = benchCharacter(worldState, SEATS);
    for (let period = 1; period <= 200; period += 1) {
      const pole = benchCharacter(worldState, SEATS) < 0 ? 'vice' : 'virtue';
      worldState = foldLivedExperience({
        worldState, tick: period * AMBIENT_CADENCE_TICKS,
        entries: SEATS.map((seat) => ({
          kind: 'dwell_milieu', settlementId: TOWN, settlementSeed: SEED, npc: seat.npc,
          eventId: `bench.${period}.${seat.npc.id}`, spanTicks: AMBIENT_CADENCE_TICKS,
          pulls: [{ axisId: 'JUSTICE', pole, band: 'heavy' }],
        })),
      }).worldState;
    }
    const end = benchCharacter(worldState, SEATS);
    expect(Math.sign(end)).toBe(Math.sign(start));
    expect(Math.abs(end - start)).toBeLessThanOrEqual(MATERIALIZATION_EPSILON);
  });
});

describe('⭐ §9 RISK 2 — no unbounded trajectory, at the hardest pull any source can emit', () => {
  test('THREE HUNDRED YEARS of a full-band lesson EVERY TICK stays inside the clamp', () => {
    // `turned_by_crime` rides the `fall` family at step 0, so its HEAVY JUSTICE pull
    // is one whole band — the strongest thing this vocabulary can say. Emitted every
    // tick for three centuries, which is the horizon the estate's own population
    // runaway was found at.
    const npc = soul('npc_1', 'Alda');
    let worldState = lit();
    let peak = 0;
    for (let tick = 1; tick <= YEAR_TICKS * 300; tick += 1) {
      worldState = foldLivedExperience({
        worldState, tick,
        entries: [{ kind: 'turned_by_crime', settlementId: TOWN, settlementSeed: SEED, npc, eventId: `c.${tick}` }],
      }).worldState;
      peak = Math.max(peak, Math.abs(offsetOf(worldState, npc, 'JUSTICE')));
    }
    expect(peak).toBe(MAX_AXIS_OFFSET);
    // Bounded AT the clamp — F11's explicit band-bounded window doing exactly the
    // job it was minted for. Unbounded would be any value above it.
    expect(peak).toBeLessThanOrEqual(MAX_AXIS_OFFSET);
  }, 20000);

  test('at ANNUAL cadence the same lesson saturates BELOW the clamp, of its own accord', () => {
    const npc = soul('npc_1', 'Alda');
    let worldState = lit();
    for (let year = 1; year <= 300; year += 1) {
      worldState = foldLivedExperience({
        worldState, tick: year * YEAR_TICKS,
        entries: [{ kind: 'turned_by_crime', settlementId: TOWN, settlementSeed: SEED, npc, eventId: `c.${year}` }],
      }).worldState;
    }
    const settled = Math.abs(offsetOf(worldState, npc, 'JUSTICE'));
    // The decay genuinely carries the weight here — the equilibrium is the
    // arithmetic's, not the clamp's, which is what makes the anti-ratchet brake a
    // real mechanism rather than a backstop that never runs.
    expect(settled).toBeLessThan(MAX_AXIS_OFFSET);
    expect(settled).toBeGreaterThan(4);
  }, 20000);

  test('⭐ THE SEPARATION IS 24x — the ambient family is the smallest in the table', () => {
    // §9 risk 5 asks for exactly this ordering, and it is now a measured ratio
    // rather than an intention: the hardest commitment lesson reaches the whole
    // spectrum; the ambient one reaches a quarter of one band, forever.
    expect(MAX_AXIS_OFFSET / MATERIALIZATION_EPSILON).toBe(24);
    expect(FUNNEL_TUNING.familyStep.milieu).toBeLessThan(FUNNEL_TUNING.familyStep.fall);
  });
});

describe('THE ADAPTER CANNOT DRIVE THE LOOP FASTER THAN THE CADENCE', () => {
  test('a soul held for ten years yields ONE emission per collection, not ten', () => {
    // The loops above assume one milieu emission per cadence. That assumption is
    // the ADAPTER's to keep, so it is pinned here beside the properties that rest
    // on it rather than only in the sources suite: a ten-year captivity read at one
    // moment is a single entry whose span carries the years.
    const held = soul('npc_1', 'Alda');
    held.whereabouts = { state: 'hostage', placeId: 'save.captor', sinceTick: 0, missionId: 'm1' };
    const out = SOURCE_ADAPTER_OF.dwell_milieu.read({
      tick: 40 * AMBIENT_CADENCE_TICKS,
      worldState: {},
      homes: [{ placeId: TOWN, placeSeed: SEED, cast: [held] }],
      milieuVectorOf: () => [{ axisId: 'MERCY', pole: 'vice', band: 'faint' }],
    });
    expect(out.length).toBe(1);
    expect(out[0].spanTicks).toBe(40 * AMBIENT_CADENCE_TICKS);
  });
});
