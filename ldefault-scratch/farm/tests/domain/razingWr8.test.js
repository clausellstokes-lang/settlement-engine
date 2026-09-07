/**
 * razingWr8.test.js — WR-8 amendments R + R2, slice 4: THE RAZING.
 *
 * WHAT THESE PINS ARE FOR. The razing is the one place in the war program where
 * alignment is a capability BOUNDARY, and the amendment says plainly which way
 * the pins must lean: "the negative case pins hardest... razing from mild enmity
 * must be UNREACHABLE, or every war ends in ash and the acquisition ladder is
 * decoration." So the file is weighted toward refusals, and two of them are
 * proved by EXHAUSTIVE WALK rather than by example — an unreachability claim
 * proved on three sampled inputs is a claim about three inputs.
 *
 * THREE OF THESE PINS READ REAL ENGINE STATE RATHER THAN FIXTURES, deliberately:
 *   - the extremity composite is walked against the REAL authored
 *     RELATIONSHIP_DEFAULTS table, because the substrate audit's whole finding
 *     was about what those numbers make reachable;
 *   - demotion-follows-truth is driven through the REAL tier chooser
 *     (evaluateTierResourceDynamics), because CR-WR8-F's entire content is that
 *     the razing must NOT be the thing that decides;
 *   - the drift pin reads hostile's own default out of relationshipState.js, so
 *     the leaf's re-declared constants cannot silently diverge from the module
 *     that owns them.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import {
  RAZED_INSTITUTION_STATUSES,
  RAZING_ALIGNMENT_BANDS,
  RAZING_INITIATION_BANDS,
  RAZING_REFUSALS,
  RAZING_ROADS,
  RAZING_TUNING,
  TIER_FALL_BANDS,
  compareSpoils,
  conservedSack,
  razedInstitutions,
  razingDeparture,
  razingEdgeFlips,
  razingGate,
  razingInitiationPermitted,
  razingSpoils,
  readRelationshipExtremity,
  tierFallDescriptor,
} from '../../src/domain/worldPulse/razing.js';
import { RELATIONSHIP_DEFAULTS } from '../../src/domain/worldPulse/relationshipState.js';
import { evaluateTierResourceDynamics } from '../../src/domain/worldPulse/tierResourceDynamics.js';
import { POPULATION_RANGES, TIER_ORDER, popToTier } from '../../src/data/constants.js';

/** An extremity read that clears all three conjuncts, for gate tests. */
const EXTREME = readRelationshipExtremity({
  edgeType: 'hostile', resentment01: 0.9, grievance01: 0.8,
  partyId: 'Karrow', counterpartId: 'Thornwall',
});
/** One that clears none. */
const MILD = readRelationshipExtremity({
  edgeType: 'rival', resentment01: 0.52, grievance01: 0.1,
  partyId: 'Karrow', counterpartId: 'Thornwall',
});

// ─────────────────────────────────────────────────────────────────────────────
// THE EXTREMITY COMPOSITE (CR-WR8-B) — the negative case, BOTH DIRECTIONS.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R — extremity is a three-part conjunction, and every part is load-bearing', () => {
  test('all three conjuncts together reach the extreme, and each one alone does not', () => {
    expect(EXTREME.extreme).toBe(true);
    expect(EXTREME.missing).toEqual([]);

    // THE WALK. Eight combinations of (type met, resentment met, grievance met);
    // exactly ONE of them is extreme. This is the negative case written in both
    // directions at once: seven refusals and one permission, from one table.
    const met = { edgeType: 'hostile', resentment01: 0.8, grievance01: 0.7 };
    const unmet = { edgeType: 'rival', resentment01: 0.5, grievance01: 0.2 };
    let extremeCount = 0;
    for (const t of [true, false]) {
      for (const r of [true, false]) {
        for (const g of [true, false]) {
          const read = readRelationshipExtremity({
            edgeType: t ? met.edgeType : unmet.edgeType,
            resentment01: r ? met.resentment01 : unmet.resentment01,
            grievance01: g ? met.grievance01 : unmet.grievance01,
          });
          expect(read.extreme).toBe(t && r && g);
          if (read.extreme) extremeCount += 1;
          // The refusal must NAME the failing conjuncts, not merely refuse.
          expect(read.missing.length).toBe([t, r, g].filter((x) => !x).length);
        }
      }
    }
    expect(extremeCount).toBe(1);
  });

  test('THE UBIQUITY BRAKE: no authored relationship type reaches the extreme on its own defaults', () => {
    // The substrate audit's fact (3): "no type baseline exceeds hostile's
    // resentment 0.78, so 'the axes at their authored extreme' resolves to
    // either nearly-unreachable or ubiquitous unless the band is named." This
    // walks the REAL authored table. Every type — hostile included — fails,
    // because a relationship sitting at its own baseline carries no LIVE
    // grievance, and that conjunct is exactly what breaks ubiquity.
    const types = Object.keys(RELATIONSHIP_DEFAULTS);
    expect(types.length).toBeGreaterThan(5);
    for (const type of types) {
      const read = readRelationshipExtremity({
        edgeType: type,
        resentment01: RELATIONSHIP_DEFAULTS[type].resentment,
        grievance01: 0,
      });
      expect(read.extreme, `${type} at its own defaults must not be extreme`).toBe(false);
      expect(read.missing).toContain('live_grievance');
    }
  });

  test('THE REACHABILITY ARM: a hostile edge at its own baseline plus a live grievance IS extreme', () => {
    // The other half of the same finding. If the composite were unreachable the
    // whole razing would be decoration, so this arm is as necessary as the one
    // above — and it is written against the AUTHORED hostile baseline rather
    // than a number typed here, so it proves reachability on the real table.
    const read = readRelationshipExtremity({
      edgeType: 'hostile',
      resentment01: RELATIONSHIP_DEFAULTS.hostile.resentment,
      grievance01: RAZING_TUNING.LICENSE_ADEQUACY_01,
    });
    expect(read.extreme).toBe(true);
  });

  test('the leaf has not drifted from the module that owns the relationship vocabulary', () => {
    // J-WR-10: no new relationship vocabulary is minted. Both re-declared
    // constants must still be the owning module's own.
    expect(RAZING_TUNING.HOSTILE_RESENTMENT_BASELINE)
      .toBe(RELATIONSHIP_DEFAULTS.hostile.resentment);
    expect(Object.keys(RELATIONSHIP_DEFAULTS)).toContain(RAZING_TUNING.EXTREME_EDGE_TYPE);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE INITIATION GATE (R2) — proved by EXHAUSTIVE WALK.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 — only the wicked burn first, and the walk proves it', () => {
  test('the initiation road is structurally unreachable for every non-evil band', () => {
    // "No pressure, no deception, no dice sequence opens it." An unreachability
    // claim is only worth what its coverage is worth, so this walks the WHOLE
    // closed alignment vocabulary against BOTH siege states, BOTH extremity
    // states and BOTH license states — 32 rows — and asserts that `initiation`
    // appears for exactly one band.
    /** @type {Record<string, number>} */
    const initiationsByBand = {};
    let rows = 0;
    for (const alignmentBand of RAZING_ALIGNMENT_BANDS) {
      initiationsByBand[alignmentBand] = 0;
      for (const siegeWon of [true, false]) {
        for (const extremity of [EXTREME, MILD]) {
          for (const licenseHeld of [true, false]) {
            rows += 1;
            const v = razingGate({
              siegeWon, extremity, alignmentBand, licenseHeld,
              actorId: 'Karrow', victimId: 'Thornwall',
            });
            expect(RAZING_ROADS.includes(String(v.road)) || v.road === null).toBe(true);
            if (v.road === 'initiation') initiationsByBand[alignmentBand] += 1;
          }
        }
      }
    }
    expect(rows).toBe(RAZING_ALIGNMENT_BANDS.length * 8);
    for (const band of RAZING_ALIGNMENT_BANDS) {
      if (RAZING_INITIATION_BANDS.includes(band)) {
        expect(initiationsByBand[band], `${band} must be able to initiate`).toBeGreaterThan(0);
      } else {
        expect(initiationsByBand[band], `${band} must NEVER reach initiation`).toBe(0);
      }
    }
    // And the permission predicate itself, walked: exactly one member.
    const permitted = RAZING_ALIGNMENT_BANDS.filter((b) => razingInitiationPermitted(b));
    expect(permitted).toEqual([...RAZING_INITIATION_BANDS]);
  });

  test('an unread alignment is not an evil one', () => {
    // The strict direction on silence, the conquestExecution `unknown` idiom.
    expect(razingInitiationPermitted('unknown')).toBe(false);
    expect(razingInitiationPermitted(undefined)).toBe(false);
    expect(razingInitiationPermitted('')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE DOUBLE GATE, AND R2's COUPLING.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R — the double gate, with the negative case leaning hardest', () => {
  test('victorious-but-not-extreme cannot raze, and the refusal names the relationship', () => {
    const v = razingGate({
      siegeWon: true, extremity: MILD, alignmentBand: 'malicious', licenseHeld: false,
      actorId: 'Karrow', victimId: 'Thornwall',
    });
    expect(v.permitted).toBe(false);
    expect(v.refusal).toBe('not_extreme');
    // An evil court that won its siege and is merely angry holds the walls.
    expect(v.receipt).toMatch(/holds the walls or names its terms/);
  });

  test('extreme-but-no-siege cannot raze, and the siege is checked first', () => {
    const v = razingGate({
      siegeWon: false, extremity: EXTREME, alignmentBand: 'malicious', licenseHeld: true,
    });
    expect(v.permitted).toBe(false);
    // The ORDER matters: a court that never won a siege must not be told its
    // license was the problem.
    expect(v.refusal).toBe('no_siege');
  });

  test('THE COUPLING: a license without own-extremity opens nothing', () => {
    // R2: "the license is necessary, never sufficient... you do not burn a city
    // you are merely angry at, even licensed."
    const v = razingGate({
      siegeWon: true, extremity: MILD, alignmentBand: 'benevolent', licenseHeld: true,
    });
    expect(v.permitted).toBe(false);
    expect(v.refusal).toBe('not_extreme');
  });

  test('the full vengeance gate opens for a GOOD court that holds a license and its own extreme', () => {
    // "unlocked for the license-holder REGARDLESS of alignment" — the arm that
    // makes the license machinery an economy rather than a decoration.
    const v = razingGate({
      siegeWon: true, extremity: EXTREME, alignmentBand: 'benevolent', licenseHeld: true,
      actorId: 'Thornwall', victimId: 'Karrow',
    });
    expect(v.permitted).toBe(true);
    expect(v.road).toBe('vengeance');
  });

  test('an EVIL court holding a license still takes the initiation road, not the vengeance one', () => {
    // The two are counted separately by the endings envelope and their ratio is
    // a health metric, so an evil realm must not be able to launder an ordinary
    // atrocity as somebody else's answer.
    const v = razingGate({
      siegeWon: true, extremity: EXTREME, alignmentBand: 'malicious', licenseHeld: true,
    });
    expect(v.road).toBe('initiation');
  });

  test('every refusal this gate can emit is in the closed vocabulary', () => {
    const seen = new Set();
    for (const alignmentBand of RAZING_ALIGNMENT_BANDS) {
      for (const siegeWon of [true, false]) {
        for (const extremity of [EXTREME, MILD]) {
          for (const licenseHeld of [true, false]) {
            const v = razingGate({ siegeWon, extremity, alignmentBand, licenseHeld });
            if (v.refusal) seen.add(v.refusal);
          }
        }
      }
    }
    for (const r of seen) expect(RAZING_REFUSALS).toContain(r);
    expect(seen.size).toBeGreaterThan(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DEATHS, NOT DEPARTURES — CONSERVED TO THE PERSON.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R — the sack is conserved to the person', () => {
  test('deaths + escapees + roaming + survivors EQUALS the population, over a wide sweep', () => {
    // An identity, not a tolerance, over 6 populations x 11 severities x 4
    // named-cast sizes. Conservation laws fail at the third decimal place when
    // buckets are rounded independently, so the sweep is what proves the
    // single-rounding shape actually holds.
    let rows = 0;
    for (const population of [41, 120, 900, 1200, 5400, 26000]) {
      for (let s = 0; s <= 10; s += 1) {
        for (const namedCastCount of [0, 1, 7, 40]) {
          rows += 1;
          const a = conservedSack({ population, severity01: s / 10, namedCastCount });
          expect(a.known).toBe(true);
          expect(a.deaths + a.escapees + a.namedRoaming + a.survivors).toBe(population);
          // Whole people, every bucket.
          for (const n of [a.deaths, a.escapees, a.namedRoaming, a.survivors, a.losses]) {
            expect(Number.isInteger(n)).toBe(true);
            expect(n).toBeGreaterThanOrEqual(0);
          }
        }
      }
    }
    expect(rows).toBe(6 * 11 * 4);
  });

  test('THE SHAPE, not just the outcome: the last bucket is a SUBTRACTION and never a second rounding', () => {
    // ⚠️ WHY THIS PIN EXISTS, MEASURED RATHER THAN ASSUMED. The sweep above was
    // run against a mutant that computed `deaths = round(remainder * (1 -
    // ESCAPE_SHARE))` instead of `remainder - escapees` — two independent
    // roundings of the same split — and the sweep PASSED. It passed because at
    // the shipped ESCAPE_SHARE of 0.12 the two roundings can never disagree:
    // divergence needs frac(0.12 * R) === 0.5, which needs 6R odd, which is
    // impossible. So the identity currently holds by an arithmetic coincidence
    // of one constant, and NOT by the shape of the code.
    //
    // It is not a harmless coincidence. Enumerated over remainders 0..20000,
    // independent rounding diverges 10000 times at share 0.5, 5000 at 0.25,
    // 2500 at 0.125 and 2000 at 0.10 — so the first person to tune this band
    // would break conservation, and the sweep would only notice if its sampled
    // populations happened to land on a divergent remainder.
    //
    // The subtraction shape is what makes conservation hold for ANY share, so
    // the shape is what gets guarded. This is a source pin on ONE named
    // expression, in a file this suite already reads for its purity pin.
    const src = readFileSync('src/domain/worldPulse/razing.js', 'utf8');
    expect(src).toMatch(/const deaths = remainder - escapees;/);
    expect(src).not.toMatch(/const deaths = Math\.round/);
    // Negative control for the pin itself: the anchor it reads must be present
    // in a file that actually defines the function under test, so a rename or
    // relocation reds here instead of quietly guarding nothing.
    expect(src).toMatch(/export function conservedSack/);
  });

  test('THE NAMED CAST IS NEVER ENGINE-KILLED: they disperse, and they come out of the losses first', () => {
    // "the law holds at the fire's edge". The named are taken out of the loss
    // pool BEFORE the dead are counted, so a court with more named cast than the
    // sack can consume loses no named person to the engine at all.
    const heavy = conservedSack({ population: 200, severity01: 1, namedCastCount: 5 });
    expect(heavy.namedRoaming).toBe(5);
    expect(heavy.deaths).toBeGreaterThan(0);

    // A pathological case: the named cast alone exceeds the losses. Every loss
    // is a dispersal and NOBODY dies — which is the law being absolute rather
    // than merely weighted.
    const tiny = conservedSack({ population: 100, severity01: 0, namedCastCount: 999 });
    expect(tiny.deaths).toBe(0);
    expect(tiny.escapees).toBe(0);
    expect(tiny.namedRoaming).toBe(tiny.losses);
    expect(tiny.namedRoaming + tiny.survivors).toBe(100);
  });

  test('DEATHS-DOMINANT: the escape share is small, and it is survivors of the loss and not of the town', () => {
    const a = conservedSack({ population: 5000, severity01: 0.8, namedCastCount: 0 });
    expect(a.deaths).toBeGreaterThan(a.escapees * 5);
    // But the broadcast still has its survivors: someone carries the story.
    expect(a.escapees).toBeGreaterThan(0);
  });

  test('an unreadable population refuses rather than reading as a ruin', () => {
    // Number(null) is 0 and 0 is a ruin: an unread count must not flatter the
    // razer by looking like a place with nothing left to lose.
    for (const population of [null, undefined, 'many', NaN, -5]) {
      const a = conservedSack({ population, severity01: 1, namedCastCount: 0 });
      expect(a.known).toBe(false);
      expect(a.losses).toBe(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE MATERIAL SELF-LIMITS (LAW 7) — two of them, and they are NOT the same KIND.
// W8-D F2: the earlier version of this block claimed both were structural and proved
// the first with ONE hand-picked (rate, horizon) pair. That is an over-claim: burning
// is dearer than holding only ABOVE A CROSSOVER, and below it burning is the RICHER
// road. The grid below WALKS the comparison instead of sampling it, so the crossover
// is a pinned, visible design fact rather than an accident of two chosen numbers.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R — what self-limits it, with no pacifism term anywhere', () => {
  test('THE STREAM IS A HARD ZERO: a razing yields once and never again', () => {
    const spoils = razingSpoils({ movableWealth: 1000, population: 5000 });
    expect(spoils.plunder).toBeGreaterThan(0);
    // Zero, not a small number. The departure took the stream with it.
    expect(spoils.tributePerYear).toBe(0);
  });

  test('ASH PAYS NO TRIBUTE IS A CROSSOVER, NOT AN ABSOLUTE — walked, both sides', () => {
    const spoils = razingSpoils({ movableWealth: 1000, population: 5000 });
    const WEALTH = 1000;
    const RATES = [0.01, 0.02, 0.05, 0.10, 0.15, 0.25, 0.40];
    const YEARS = [1, 2, 3, 5, 8, 12, 20, 30];
    const poorerAt = (rate, years) => compareSpoils({
      plunderOnce: spoils.plunder, tributePerYear: WEALTH * rate, years,
    }).razingIsPoorer;

    // BOTH SIDES EXIST. If either of these ever emptied, this test would be
    // asserting a one-sided fact while reading like a comparison.
    const grid = RATES.flatMap((rate) => YEARS.map((years) => ({ rate, years, poorer: poorerAt(rate, years) })));
    expect(grid.filter((c) => c.poorer).length, 'holding never out-earns burning anywhere on the grid').toBeGreaterThan(0);
    expect(grid.filter((c) => !c.poorer).length, 'burning never out-earns holding anywhere on the grid').toBeGreaterThan(0);

    // MONOTONE IN BOTH AXES: a richer tributary and a longer hold can only ever
    // make holding MORE attractive, never less. This is the property that makes
    // "crossover" the right word — a single frontier, not scattered islands.
    for (const rate of RATES) {
      let seenPoorer = false;
      for (const years of YEARS) {
        const poorer = poorerAt(rate, years);
        if (poorer) seenPoorer = true;
        expect(!(seenPoorer && !poorer), `rate ${rate} flipped back to richer at ${years}y`).toBe(true);
      }
    }
    for (const years of YEARS) {
      let seenPoorer = false;
      for (const rate of RATES) {
        const poorer = poorerAt(rate, years);
        if (poorer) seenPoorer = true;
        expect(!(seenPoorer && !poorer), `${years}y flipped back to richer at rate ${rate}`).toBe(true);
      }
    }

    // THE FRONTIER, PINNED AT THE SHIPPED PLUNDER_SHARE. These are the design
    // facts the prose now states, and a tuning change that moves them reds here.
    expect(RAZING_TUNING.PLUNDER_SHARE).toBe(0.6);
    // A tributary paying 15% a year: burning wins under four years, holding wins
    // from five. That is the realm that expects the peace to hold vs the one that does not.
    expect(poorerAt(0.15, 3)).toBe(false);
    expect(poorerAt(0.15, 5)).toBe(true);
    // And against a near-worthless tributary (1% a year) burning is richer across
    // a full thirty years — this law is NOT a rule against burning, and there is
    // no pacifism term anywhere in the module that would make it one.
    expect(poorerAt(0.01, 30)).toBe(false);
  });

  test('RAZING THE SAME REMNANT TWICE YIELDS NOTHING, structurally', () => {
    // Not a rule that says "no second razing" — the second razing is simply
    // computed against the room above the skeleton floor, and there is none.
    const first = conservedSack({ population: 4000, severity01: 1, namedCastCount: 0 });
    expect(first.losses).toBeGreaterThan(0);

    const remnant = RAZING_TUNING.SKELETON_FLOOR;
    const second = conservedSack({ population: remnant, severity01: 1, namedCastCount: 0 });
    expect(second.losses).toBe(0);
    expect(second.deaths).toBe(0);
    expect(second.nothingLeft).toBe(true);

    const secondSpoils = razingSpoils({ movableWealth: 1000, population: remnant });
    expect(secondSpoils.plunder).toBe(0);
    expect(secondSpoils.nothingLeft).toBe(true);
  });

  test('the skeleton floor holds: a razing is not an annihilation', () => {
    // `annihilation` is a SEPARATE ending in the endings mix and the two must
    // stay separable in the soak.
    for (const population of [45, 200, 1200, 26000]) {
      const a = conservedSack({ population, severity01: 1, namedCastCount: 0 });
      expect(a.survivors).toBeGreaterThanOrEqual(RAZING_TUNING.SKELETON_FLOOR);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DEMOTION FOLLOWS TRUTH (CR-WR8-F) — BOTH ARMS, THROUGH THE REAL CHOOSER.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Drive the REAL tier chooser over one settlement with a QUIET pressure index.
 * With no pressures recorded, `supportScore` reads 1.0, which switches OFF the
 * structural-failure and strained-below-floor arms — so the ONLY law that can
 * demote here is the population one, `pop < currentMin * 0.82`. That isolation
 * is what makes this a pin about CR-WR8-F rather than about tier drift in
 * general.
 * @param {number} population
 */
function realTierDriftFor(population) {
  const item = {
    id: 'thornwall',
    settlement: {
      id: 'thornwall', name: 'Thornwall', tier: 'town', population,
      institutions: [], economicState: {},
    },
  };
  const rules = { tierDriftEnabled: true };
  const out = evaluateTierResourceDynamics(
    { tick: 5, simulationRules: rules, settlementTickStates: {} },
    { settlements: [item] },
    {},
    { simulationRules: rules, tick: 5 },
  );
  return out.driftBySettlement?.thornwall || null;
}

describe('WR-8 R / CR-WR8-F — the razing forces no tier; the tier reads the new truth', () => {
  test('the isolation this pin depends on is real: a healthy town drifts nowhere', () => {
    // The negative control for the harness itself. Without this, "no demotion"
    // in arm B would be indistinguishable from a chooser that never fires.
    expect(realTierDriftFor(POPULATION_RANGES.town.min + 100)).toBeNull();
  });

  test('ARM A — the tier FALLS when the truth falls: a heavy sack demotes through the real chooser', () => {
    const before = 1200;
    const sack = conservedSack({ population: before, severity01: 1, namedCastCount: 3 });
    expect(sack.survivors).toBeLessThan(POPULATION_RANGES.town.min * 0.82);

    const drift = realTierDriftFor(sack.survivors);
    expect(drift).not.toBeNull();
    expect(drift.direction).toBe('demotion');
    expect(drift.toTier).toBe('village');

    // And the DESCRIPTOR says what fell — after the fact, from tiers alone.
    const d = tierFallDescriptor({
      tierBefore: 'town', tierAfter: drift.toTier, tierOrder: TIER_ORDER,
      settlementName: 'Thornwall',
    });
    expect(d.rungsFallen).toBe(1);
    expect(d.band).toBe('one');
    expect(TIER_FALL_BANDS).toContain(d.band);
  });

  test('ARM B — the tier STANDS when the truth does not fall: a light sack demotes nothing', () => {
    // The arm CR-WR8-F names explicitly: "a sack above threshold leaves the tier
    // standing... If a light sack demotes nothing, that is the world being
    // honest." This is the pin that would have failed under the retired
    // severity-picks-the-target-rung model, which guaranteed a fall.
    const before = 1200;
    const sack = conservedSack({ population: before, severity01: 0, namedCastCount: 3 });
    expect(sack.losses).toBeGreaterThan(0);            // a real sack happened
    expect(sack.deaths).toBeGreaterThan(0);            // with real dead
    expect(sack.survivors).toBeGreaterThanOrEqual(POPULATION_RANGES.town.min * 0.82);

    expect(realTierDriftFor(sack.survivors)).toBeNull();
    expect(popToTier(sack.survivors)).toBe('town');

    const d = tierFallDescriptor({
      tierBefore: 'town', tierAfter: 'town', tierOrder: TIER_ORDER, settlementName: 'Thornwall',
    });
    expect(d.rungsFallen).toBe(0);
    expect(d.band).toBe('none');
    expect(d.receipt).toMatch(/took its people and not its standing/);
  });

  test('THE DESCRIPTOR CANNOT BE THE DERIVATION: severity is invisible to it', () => {
    // CR-WR8-F's structural half. The descriptor reads tiers and nothing else,
    // so identical tiers give an identical answer no matter what severity
    // produced them — which is what "receipt descriptor, never an input" means
    // when it is a fact about a signature rather than a comment.
    const a = tierFallDescriptor({ tierBefore: 'city', tierAfter: 'village', tierOrder: TIER_ORDER });
    const b = tierFallDescriptor({ tierBefore: 'city', tierAfter: 'village', tierOrder: TIER_ORDER });
    expect(a).toEqual(b);
    expect(a.rungsFallen).toBe(2);
    expect(a.band).toBe('two');
    // And it cannot invent a fall it did not see.
    expect(tierFallDescriptor({ tierBefore: 'town', tierAfter: 'nowhere', tierOrder: TIER_ORDER }).known)
      .toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE EDGE FLIP (CR-WR8-A), WHAT STOOD, AND THE DEPARTURE.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 / CR-WR8-A — the razing re-types existing edges and mints none', () => {
  test('only victim-adequate EXISTING edges flip, and already-hostile ones are reported unchanged', () => {
    const { flipped, unchanged } = razingEdgeFlips([
      { holderId: 'ally-of-victim', edgeType: 'trade_partner', adequacyToVictim01: 0.9 },
      { holderId: 'indifferent-neighbour', edgeType: 'neutral', adequacyToVictim01: 0.1 },
      { holderId: 'old-enemy', edgeType: 'hostile', adequacyToVictim01: 0.8 },
    ]);
    expect(flipped).toEqual([
      { holderId: 'ally-of-victim', fromType: 'trade_partner', toType: 'hostile' },
    ]);
    expect(unchanged).toEqual([
      { holderId: 'indifferent-neighbour', type: 'neutral', why: 'not_victim_adequate' },
      { holderId: 'old-enemy', type: 'hostile', why: 'already_hostile' },
    ]);
  });

  test('A RAZING MINTS NO EDGE TO STRANGERS: what is not handed in cannot come out', () => {
    // The ruling's fact (1): a license holder who is not the razer's neighbour
    // has no relationship object at all. The structural proof is that the
    // function's output is a SUBSET of its input, so a stranger who appears in
    // no edge row appears in no result row either — for every input.
    const { flipped, unchanged } = razingEdgeFlips([]);
    expect(flipped).toEqual([]);
    expect(unchanged).toEqual([]);

    const edges = [{ holderId: 'a', edgeType: 'allied', adequacyToVictim01: 1 }];
    const out = razingEdgeFlips(edges);
    const emitted = [...out.flipped, ...out.unchanged].map((r) => r.holderId);
    expect(new Set(emitted)).toEqual(new Set(edges.map((e) => e.holderId)));
  });
});

describe('WR-8 R — what stands, stands dark; and they leave', () => {
  test('institutions take K1 impairment or shell by severity, and protection survives as intact', () => {
    const light = razedInstitutions([{ id: 'granary' }, { id: 'shrine', protectedFromSack: true }], 0.2);
    expect(light).toEqual([
      { id: 'granary', status: 'impaired' },
      { id: 'shrine', status: 'intact' },
    ]);
    const heavy = razedInstitutions([{ id: 'granary' }], 0.9);
    expect(heavy).toEqual([{ id: 'granary', status: 'shell' }]);
    for (const row of [...light, ...heavy]) {
      expect(RAZED_INSTITUTION_STATUSES).toContain(row.status);
    }
    // A TOTAL census: nothing is dropped, so an omission can never read as an absence.
    expect(razedInstitutions([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 1)).toHaveLength(3);
  });

  test('THE DEPARTURE IS THE SIGNATURE: no occupation, no garrison, no terms', () => {
    const d = razingDeparture({ razerName: 'Karrow', victimName: 'Thornwall' });
    // Returned as explicit nulls rather than absent keys — a consumer that has
    // to infer "no occupation" from a missing key will one day infer it from a bug.
    expect(d.occupation).toBeNull();
    expect(d.garrison).toBeNull();
    expect(d.terms).toBeNull();
    expect(d.receipt).toContain('They burned Thornwall and rode home.');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PURITY + DORMANCY.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R — the leaf is a law and reaches nothing', () => {
  test('zero imports, no rng, no wall-clock, no mutation', () => {
    const src = readFileSync('src/domain/worldPulse/razing.js', 'utf8');
    // K3's structural discipline, applied to the razing's law exactly as it is
    // to the belief composite: a law that can reach can be leaned on.
    expect(src).not.toMatch(/^\s*import\s/m);
    expect(src).not.toMatch(/Math\.random/);
    expect(src).not.toMatch(/new Date|Date\.now/);
  });

  test('it does not mutate its inputs', () => {
    const edges = [{ holderId: 'a', edgeType: 'allied', adequacyToVictim01: 1 }];
    const institutions = [{ id: 'granary' }];
    const before = JSON.stringify({ edges, institutions });
    razingEdgeFlips(edges);
    razedInstitutions(institutions, 0.9);
    conservedSack({ population: 1000, severity01: 0.5, namedCastCount: 2 });
    expect(JSON.stringify({ edges, institutions })).toBe(before);
  });

  test('it is deterministic over its arguments', () => {
    const args = { population: 3333, severity01: 0.37, namedCastCount: 11 };
    expect(JSON.stringify(conservedSack(args))).toBe(JSON.stringify(conservedSack(args)));
  });
});
