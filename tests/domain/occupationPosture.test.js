/**
 * tests/domain/occupationPosture.test.js — W-SEAT D3 (SEAT-3): the occupier's posture.
 *
 * THE AXIS, IN ONE SENTENCE: the occupation ladder conflates how much CONTROL an occupier
 * has with how it TREATS the town. `extractive` is a rung the machine climbs through, not a
 * policy anyone picked — and the owner's §735.2 directive asks for "a mixed responsibility
 * to cultivate and exploit", which is a CHOICE. This axis is that choice.
 *
 * ⚠ WHICH GREENS HERE ARE WHICH (SEAT-1's standing request, and it matters more in this car
 * than in most). The MODULATION arms are DISCOVERY-grade: they measure a live ladder input
 * moving in a direction nothing in the tree could produce before. The DORMANCY arms are
 * REGRESSION-grade by construction — their whole job is to prove nothing moved. And the
 * bit-identity sweep is neither: it is an INSTRUMENT, and it failed its own first draft
 * (see the note above it), which is the only reason it can be trusted now.
 */

import { describe, it, expect } from 'vitest';

import {
  OCCUPATION_POSTURES,
  OCCUPATION_POSTURE_DEFAULT,
  OCCUPATION_TUNING,
  occupationPostureOf,
  occupationPostureChoice,
  conveyOccupationRecord,
  createOccupationRecord,
  stabilizationSuitability,
  advanceResistance,
  resistanceTarget,
  evaluateOccupations,
  occupiedUsefulness,
} from '../../src/domain/worldPulse/occupation.js';
import { CHANGE_AUTHORITY_POLICY } from '../../src/domain/worldPulse/changeAuthorityPolicy.js';
import { isExplicitlyRouted, EXACT_SECTION, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';

// ── Fixtures ────────────────────────────────────────────────────────────────

/** A compliant-regime occupied town: an installed occupier row plus subdued locals. */
const occupiedItem = () => ({
  settlement: {
    population: 5000,
    powerStructure: {
      publicLegitimacy: { score: 50 },
      factions: [
        { faction: 'Occupation Authority', category: 'occupation', power: 90, modifiers: ['occupier'] },
        { faction: 'Town Council', power: 30, modifiers: ['occupied'] },
      ],
    },
  },
});

const LIT = { warLayerEnabled: true, foreignSeatEnabled: true };
const DARK = { warLayerEnabled: true };

// ── (1) The gate — and A1.2.11's dark clause is LITERAL, not approximate ────

describe('SEAT-3 — the posture gate', () => {
  it('the vocabulary is closed and the default is a MEMBER of it', () => {
    expect([...OCCUPATION_POSTURES]).toEqual(['exploit', 'administer', 'cultivate']);
    expect(OCCUPATION_POSTURES).toContain(OCCUPATION_POSTURE_DEFAULT);
  });

  it('⛔ DARK: a record that ALREADY CARRIES a posture still resolves to the default', () => {
    // A1.2.11's exact clause — "the dark path NEVER reads the field (present or absent — a
    // hand-built present-field-dark fixture proves it)". This IS that fixture. It matters
    // because a world can be lit, choose a posture, and be unlit again: the byte survives
    // on the record, and a read-and-ignore implementation would still have branched on it.
    for (const posture of OCCUPATION_POSTURES) {
      expect(occupationPostureOf({ posture }, DARK), posture).toBe(OCCUPATION_POSTURE_DEFAULT);
    }
    expect(occupationPostureOf({ posture: 'exploit' }, {})).toBe(OCCUPATION_POSTURE_DEFAULT);
    expect(occupationPostureOf({ posture: 'exploit' }, null)).toBe(OCCUPATION_POSTURE_DEFAULT);
  });

  it('the flag is read with the strict === true idiom, refusing every truthy non-true', () => {
    // ⛔ The positive spelling is the engine-gated-key census's only discoverable form.
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(occupationPostureOf({ posture: 'exploit' }, { foreignSeatEnabled: truthy }), String(truthy))
        .toBe(OCCUPATION_POSTURE_DEFAULT);
    }
    expect(occupationPostureOf({ posture: 'exploit' }, LIT)).toBe('exploit');
  });

  it('LIT: an absent, empty or GARBAGE posture falls to the default rather than throwing', () => {
    // A ledger row is campaign state that outlives the code that wrote it; an unknown band
    // must degrade to the identity, never to a crash and never to a silent third behaviour.
    for (const bad of [undefined, null, '', 'nonsense', 42, {}, []]) {
      expect(occupationPostureOf({ posture: bad }, LIT), JSON.stringify(bad)).toBe(OCCUPATION_POSTURE_DEFAULT);
    }
    expect(occupationPostureOf({}, LIT)).toBe(OCCUPATION_POSTURE_DEFAULT);
    expect(occupationPostureOf(null, LIT)).toBe(OCCUPATION_POSTURE_DEFAULT);
  });
});

// ── (2) The instrument: `administer` is the pre-posture arithmetic, swept ───

describe('SEAT-3 — `administer` is bit-identical to the pre-posture expression', () => {
  it('SWEPT, not sampled: every cell of the ladder × resistance × presence grid agrees', () => {
    // ⚠ SAMPLING A BIT-IDENTITY CLAIM IS A COIN FLIP, and this family has already shipped
    // one that nearly got through: SEAT-2a's first draft asserted a distributed-vs-summed
    // difference on two hand-picked doubles, and the pair it chose happened to agree. The
    // measured answer there was that the wrong arrangement is bit-identical in 73.5% of a
    // 39,601-cell sweep. So this sweeps.
    //
    // Both functions take the posture as an OPTIONAL trailing argument whose default is the
    // identity, which is what makes every pre-SEAT-3 caller — including the ones in
    // occupation.test.js that pass 2 and 3 arguments — provably unchanged.
    const item = occupiedItem();
    let cells = 0;
    for (let r = 0; r <= 1.0001; r += 0.005) {
      for (const state of OCCUPATION_TUNING.STATE_LADDER) {
        const rec = { resistance: r, state };
        for (const present of [true, false]) {
          expect(Object.is(
            stabilizationSuitability(rec, item, present),
            stabilizationSuitability(rec, item, present, OCCUPATION_POSTURE_DEFAULT),
          ), `suitability r=${r} ${state} present=${present}`).toBe(true);
          cells += 1;
        }
        expect(Object.is(
          advanceResistance(rec, item),
          advanceResistance(rec, item, OCCUPATION_POSTURE_DEFAULT),
        ), `resistance r=${r} ${state}`).toBe(true);
        cells += 1;
      }
    }
    expect(cells).toBe(3015);
  });

  it('GUARD-THE-GUARD: the sweep can see a difference when there is one', () => {
    // An identity sweep that would pass on a broken implementation proves nothing. The two
    // non-default postures must move BOTH functions on the same grid the sweep walks.
    const item = occupiedItem();
    const rec = { resistance: 0.3, state: 'extractive' };
    for (const posture of ['exploit', 'cultivate']) {
      expect(stabilizationSuitability(rec, item, true, posture), posture)
        .not.toBe(stabilizationSuitability(rec, item, true));
      expect(advanceResistance(rec, item, posture), posture)
        .not.toBe(advanceResistance(rec, item));
    }
  });
});

// ── (3) DISCOVERY: the axis actually bends the ladder, in the ruled direction ─

describe('SEAT-3 — the wasting asset and the honest road', () => {
  const item = occupiedItem();
  const rec = { resistance: 0.3, state: 'extractive' };

  it('exploit lowers suitability and cultivate raises it, straddling administer', () => {
    // §3-D3's own words: exploit → suitability DOWN (the wasting asset); cultivate →
    // suitability UP (the honest road to `vassalized`).
    const exploit = stabilizationSuitability(rec, item, true, 'exploit');
    const administer = stabilizationSuitability(rec, item, true, 'administer');
    const cultivate = stabilizationSuitability(rec, item, true, 'cultivate');
    expect(exploit).toBeLessThan(administer);
    expect(administer).toBeLessThan(cultivate);
  });

  it('exploit raises next-tick resistance and cultivate lowers it', () => {
    // §736's exact words for the occupied arm: "extractive raises it, cultivate dampens".
    const exploit = advanceResistance(rec, item, 'exploit');
    const administer = advanceResistance(rec, item, 'administer');
    const cultivate = advanceResistance(rec, item, 'cultivate');
    expect(exploit).toBeGreaterThan(administer);
    expect(administer).toBeGreaterThan(cultivate);
  });

  it('⛔ the posture BIASES the ladder and cannot OVERRIDE it — the adj is under the band', () => {
    // The hysteresis band is ADVANCE 0.58 − REGRESS 0.34 = 0.24 wide. If a posture's addend
    // could span it, choosing a posture would decide the rung outright and the dwell would
    // stop meaning anything — a second state machine wearing the first one's clothes, which
    // is exactly what §3-D3 forbids. Measured against the band rather than asserted as a
    // literal, so a tuning pass that widens the addend reds HERE and not in a soak.
    const item2 = occupiedItem();
    const band = OCCUPATION_TUNING.ADVANCE_THRESHOLD - OCCUPATION_TUNING.REGRESS_THRESHOLD;
    let widest = 0;
    for (let r = 0; r <= 1.0001; r += 0.01) {
      const rr = { resistance: r, state: 'extractive' };
      const lo = stabilizationSuitability(rr, item2, true, 'exploit');
      const hi = stabilizationSuitability(rr, item2, true, 'cultivate');
      widest = Math.max(widest, hi - lo);
    }
    expect(widest).toBeGreaterThan(0);
    expect(widest).toBeLessThan(band);
  });

  it('⛔ exploit may approach the resistance target FASTER but can never OVERSHOOT it', () => {
    // The `Math.min(…, target − prev)` ceiling stays OUTSIDE the posture multiplier. Scaling
    // after the clamp would let a posture push resistance past the town's own
    // intactness-driven target — inventing grievance the settlement's inputs do not support
    // and quietly making the target stop being a target.
    const item2 = occupiedItem();
    const target = resistanceTarget(item2);
    for (let prev = 0; prev < target; prev += 0.01) {
      // `contested` maximizes stateSuppress (benefit scale 0), so grow is at its strongest.
      const next = advanceResistance({ resistance: prev, state: 'contested' }, item2, 'exploit');
      expect(next, `prev=${prev.toFixed(3)}`).toBeLessThanOrEqual(target);
    }
  });

  it('THE DECISION RULE: a fighting town is cultivated, a rich quiet one is stripped', () => {
    // The court reads the OCCUPATION's own measured state — the town's worth and how hard
    // it is fighting — never a score that drifts for unrelated reasons. A1.2.11 bans a
    // derived DEFAULT; a decision a court actually takes is allowed to be reasoned, which
    // is what every autonomous decision in this engine is.
    expect(occupationPostureChoice(0.9, 0.8)).toBe('cultivate'); // restive beats rich
    expect(occupationPostureChoice(0.2, 0.8)).toBe('cultivate');
    expect(occupationPostureChoice(0.9, 0.1)).toBe('exploit');   // rich and quiet
    expect(occupationPostureChoice(0.2, 0.1)).toBe(OCCUPATION_POSTURE_DEFAULT);
    // Every answer is a member of the closed vocabulary, over the whole input square.
    for (let u = 0; u <= 1.0001; u += 0.05) {
      for (let r = 0; r <= 1.0001; r += 0.05) {
        expect(OCCUPATION_POSTURES, `u=${u} r=${r}`).toContain(occupationPostureChoice(u, r));
      }
    }
    // Garbage in yields the default, never a crash and never a fourth answer.
    for (const bad of [NaN, undefined, null, 'x']) {
      expect(OCCUPATION_POSTURES).toContain(occupationPostureChoice(bad, bad));
    }
  });

  it('⛔ a SOLD holding does NOT inherit the seller\'s posture', () => {
    // A deliberate divergence from the "unrelated fields ride across untouched" precedent
    // (`sovereigntyTransferWr10w.test.js` asserts exactly that for `benefitYield`). Posture
    // is not an unrelated field — it is the ONE field on this record that encodes a
    // DECISION, and a buyer inheriting the seller's policy is precisely the fabricated
    // un-chosen policy A1.2.11 forbids, arriving through a door the amendment did not think
    // to close. `conveyOccupationRecord`'s own docstring already says a sale changes "the
    // clock and the consent" — and a posture IS consent.
    const sold = { ...createOccupationRecord('seller', 3), state: 'vassalized', benefitYield: 0.3, posture: 'exploit' };
    const bought = conveyOccupationRecord(sold, 'buyer', 9, 0.4);
    expect('posture' in bought, 'the posture key rode across a sale').toBe(false);
    expect(occupationPostureOf(bought, LIT)).toBe(OCCUPATION_POSTURE_DEFAULT);
    // ...and the fields that ARE unrelated still ride across, so this is a narrow ruling
    // rather than a change to what a conveyance means.
    expect(bought.benefitYield).toBe(0.3);
    expect(bought.state).toBe('vassalized');
    expect(bought.occupierId).toBe('buyer');
  });

  it('a FRESH conquest carries no posture key at all — absent means administer', () => {
    const fresh = createOccupationRecord('ironhold', 5);
    expect('posture' in fresh).toBe(false);
    expect(occupationPostureOf(fresh, LIT)).toBe(OCCUPATION_POSTURE_DEFAULT);
  });

  it('the new candidate type is ROUTED and AUTHORITY-CLASSED, not an orphan', () => {
    // 🔴 `tests/lint/heraldRouting.walker.test.js` scans `src/domain` for every
    // `candidateType:` literal and reds on any that `isExplicitlyRouted` does not know.
    // Asserted here too so the reason is legible at the car rather than only at the walker.
    expect(isExplicitlyRouted('occupation_posture')).toBe(true);
    // ⛔⛔ THE ANTI-TIDY PIN (the pantheon A5 shape, verbatim in intent). This beat is routed
    // by the `occupation_` FAMILY PREFIX and must NOT acquire an EXACT_SECTION row: a routed-
    // but-unregistered exact row grows LEGACY_UNVOICED_TOKENS, a ceiling asserted shrink-only
    // with no lawful growth cure. It shipped as an exact row and red four assertions across
    // kindPoolFloors and pantheon A5 before the landing moved it to the prefix. The two
    // sibling positives make the absence a fact about THIS KIND rather than about the map.
    expect('occupation_vassalized' in EXACT_SECTION).toBe(true);
    expect('occupation_lifted' in EXACT_SECTION).toBe(true);
    expect('occupation_posture' in EXACT_SECTION).toBe(false);
    // ...and it still reaches the war desk, so the prefix bought the census nothing at the
    // reader's expense — the routing outcome is identical to the exact row it replaced.
    expect(SECTION_OF('occupation_posture')).toBe('war');
    // NOT campaign-altering, and that is the load-bearing half: vassalization moves
    // SOVEREIGNTY and pays a five-way residue-strip sync for it; a posture is a policy the
    // same holder sets over a holding it already has, banks no residue, and would have
    // bought that whole apparatus for nothing.
    expect(CHANGE_AUTHORITY_POLICY.occupation_posture).toMatchObject({
      authority: 'auto', module: 'occupation.js', consultsProposalFlag: false,
    });
    expect(CHANGE_AUTHORITY_POLICY.occupation_posture.campaignAltering).toBeUndefined();
    expect(CHANGE_AUTHORITY_POLICY.occupation_posture.rationale.length).toBeGreaterThan(80);
  });

  it('every posture keeps both outputs inside [0,1] across the whole grid', () => {
    const item2 = occupiedItem();
    for (const posture of OCCUPATION_POSTURES) {
      for (let r = 0; r <= 1.0001; r += 0.02) {
        for (const state of OCCUPATION_TUNING.STATE_LADDER) {
          const rec2 = { resistance: r, state };
          const s = stabilizationSuitability(rec2, item2, true, posture);
          const n = advanceResistance(rec2, item2, posture);
          expect(s, `${posture} suit r=${r}`).toBeGreaterThanOrEqual(0);
          expect(s).toBeLessThanOrEqual(1);
          expect(n, `${posture} resist r=${r}`).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

// ── (4) THE DRIVEN WITNESS: the decision is occasioned, taken, and persisted ─

describe('SEAT-3 — the mover, driven: a court is asked and its answer sticks', () => {
  const OCCUPIED = 'ford';
  const OCCUPIER = 'crown';

  const settlementOf = (name, factions, population, tier) => ({
    name, tier, population,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Wealthy', primaryExports: ['iron'], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 50 }, factions, conflicts: [] },
    npcs: [], activeConditions: [],
  });

  // A COMPLIANT regime (an installed occupier row over subdued locals) is what makes the
  // ladder actually climb — `hasCompliantRegime` lifts suitability by 0.22 and accelerates
  // the resistance decay. Without it the occupation grinds and no rung is ever reached,
  // which is precisely why the witness could not live in SEAT-1's dormancy fixture.
  const compliantFactions = [
    { faction: 'Occupation Authority', category: 'occupation', power: 90, modifiers: ['occupier'] },
    { faction: 'Town Council', category: 'civic', power: 20, modifiers: ['occupied', 'disarmed'] },
  ];

  function snapshotFor(population, tier) {
    const byId = new Map([
      [OCCUPIED, { id: OCCUPIED, name: 'Ferrywater', settlement: settlementOf('Ferrywater', compliantFactions, population, tier) }],
      [OCCUPIER, { id: OCCUPIER, name: 'Crownhold', settlement: settlementOf('Crownhold', [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], 50000, 'city') }],
    ]);
    return { byId, settlements: [...byId.values()], regionalGraph: { edges: [], channels: [] } };
  }

  /** Drive the real occupation layer N ticks from `unstable`, collecting every posture mint. */
  function drive(rules, { ticks = 8, population = 200000, tier = 'metropolis', startState = 'unstable' } = {}) {
    const snapshot = snapshotFor(population, tier);
    let occupations = {
      [OCCUPIED]: {
        occupierId: OCCUPIER, state: startState, sinceTick: 0,
        stateHeld: 0, resistance: 0.05, benefitYield: 0, lastTick: 0,
      },
    };
    const mints = [];
    const rungs = [];
    for (let t = 1; t <= ticks; t += 1) {
      const out = evaluateOccupations({
        snapshot, worldState: { occupations }, graph: snapshot.regionalGraph,
        deployments: {}, warOutcomes: [], returnOutcomes: [], tick: t, rules,
      });
      occupations = out.occupations;
      rungs.push(occupations[OCCUPIED]?.state);
      for (const o of out.outcomes) if (o.candidateType === 'occupation_posture') mints.push({ t, outcome: o });
    }
    return { mints, rungs, record: occupations[OCCUPIED], snapshot };
  }

  it('DISCOVERY: the lit ladder occasions ONE decision, and the chosen band persists', () => {
    const lit = drive({ warLayerEnabled: true, foreignSeatEnabled: true });
    // The ladder must actually move, or this arm measures nothing (the failure mode that
    // sent this witness out of the dormancy file in the first place).
    expect(new Set(lit.rungs).size, 'the ladder never climbed — this arm measured nothing')
      .toBeGreaterThan(1);
    expect(lit.mints.length, 'no posture decision was ever occasioned').toBe(1);
    const { outcome } = lit.mints[0];
    // A rich, quiet town is what an occupier came for.
    expect(outcome.metadata).toMatchObject({ fromPosture: OCCUPATION_POSTURE_DEFAULT, toPosture: 'exploit' });
    // ⚠ THE ACTOR IS THE OCCUPIER; THE LEDGER ROW IS KEYED BY THE OCCUPIED. Both ids ride
    // the outcome explicitly, because a consumer that reverse-engineered the affected row
    // from `targetSaveId` would find the occupier's row, which is usually absent.
    expect(outcome.targetSaveId).toBe(OCCUPIER);
    expect(outcome.occupiedSaveId).toBe(OCCUPIED);
    expect(outcome.applyMode).toBe('auto');
    // ...and it STUCK: the record carries the band the court chose.
    expect(lit.record.posture).toBe('exploit');
    expect(occupationPostureOf(lit.record, LIT)).toBe('exploit');
  });

  it('⛔ DARK: the same world, same ticks, mints nothing and carries no key at all', () => {
    const dark = drive({ warLayerEnabled: true });
    expect(dark.mints).toEqual([]);
    expect('posture' in dark.record, 'a dark world acquired a posture key').toBe(false);
    // ANTI-VACUITY: the dark run is not silent because nothing happened — its ladder climbs
    // exactly as far as the lit one. Only the decision is absent.
    expect(new Set(dark.rungs).size).toBeGreaterThan(1);
    const lit = drive({ warLayerEnabled: true, foreignSeatEnabled: true });
    expect(dark.rungs).toEqual(lit.rungs);
  });

  it('the court is asked at most once per rung CLIMB, never on a quiet tick', () => {
    // A1.2.11's oscillation worry, closed structurally: the mint is occasioned by the
    // ladder ARRIVING somewhere, so a long-held occupation is never re-asked. Over 8 ticks
    // this world climbs three rungs and is asked exactly once — the two later climbs
    // re-affirm the band it already chose, and a re-affirmation receipts nothing.
    const lit = drive({ warLayerEnabled: true, foreignSeatEnabled: true, }, { ticks: 20 });
    expect(lit.mints.length).toBeLessThanOrEqual(3);
    const tickCounts = new Map();
    for (const m of lit.mints) tickCounts.set(m.t, (tickCounts.get(m.t) || 0) + 1);
    for (const [, n] of tickCounts) expect(n).toBe(1);
  });

  it('⛔ the decision is NEVER occasioned below `extractive` — there is no yield to have a policy about', () => {
    // The benefit scale is 0 at `contested` and 0.12 at `unstable`; an occupier still
    // fighting for control has nothing to decide about yet. The climb contested→unstable is
    // a real rung change, so this proves the SECOND half of the guard (rank ≥ extractive)
    // and not merely the first.
    const early = drive({ warLayerEnabled: true, foreignSeatEnabled: true }, { ticks: 3, startState: 'contested' });
    expect(early.rungs[early.rungs.length - 1]).toBe('unstable');
    expect(early.mints, 'a court was asked before the town yielded anything').toEqual([]);
  });

  it('a town too poor to be worth stripping is administered, not exploited', () => {
    // The other side of the measured threshold: `occupiedUsefulness` over the whole tier ×
    // prosperity grid spans 0.3177–0.6060, so a hamlet sits far below the p75 line and its
    // court has no reason to strip it. A `cultivate`/`exploit` answer here would mean the
    // threshold had drifted below the corpus's own floor.
    const poor = drive({ warLayerEnabled: true, foreignSeatEnabled: true }, { population: 300, tier: 'hamlet' });
    expect(occupiedUsefulness(poor.snapshot.byId.get(OCCUPIED))).toBeLessThan(0.51);
    expect(poor.mints, 'a hamlet was judged worth stripping').toEqual([]);
    expect('posture' in poor.record).toBe(false);
  });
});
