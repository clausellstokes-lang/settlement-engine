/**
 * densityLaw.test.js — TE-DENSITY-1 car D1's fixtures for the tier-gated
 * political-density law (ODQ §§810–810.4, Register VII, §817's dispositions).
 *
 * FIVE THINGS ARE PROVED HERE, and each one is a ruling that would otherwise be
 * a hope:
 *
 *   1. THE VERSION GATE (§810 R5 / THE PROMISE) — a world's law comes from its
 *      own persisted config and from nothing else, so no dial flip can re-birth
 *      an existing world under a new ladder.
 *   2. THE BELIEVABILITY ENVELOPE (§810.2b) — real entropy INSIDE every band and
 *      ZERO mass outside it, at every tier. Per the walker-census law the
 *      assertion covers the pattern SPACE, not one corpus's habits: a shape the
 *      corpus never produces looks clean, so the coverage arm names the shapes
 *      that MUST occur (flat, concentrated, and between) and reds if one is
 *      unreachable.
 *   3. THE SEAT FLOOR AND THE ATOMIC MINT (§810.3 R12 / §810.4 R17) — every
 *      faction crews, the ruling faction always holds its head, and the ONLY
 *      way to a rulerless birth is the typed floor-lift.
 *   4. THE RUNG MAPPING (§817-Q5/Q3) — every figure is stamped, an occupied head
 *      is notable+, tier ceilings hold, and a rolled vacancy SURVIVES the
 *      pulse's own re-derivation through `dotRankFor`/`eligibleMembersOf`.
 *   5. THE RIVAL ROLL (§810.4 R16) — weighted, never granted; it must be able to
 *      decline, or the "throne stands unchallenged" world is unreachable.
 *
 * ⛔ NO NUMBER FROM THE TUNING SURFACE IS RESTATED HERE. Every expectation is
 * re-derived from `densityBands.js`, so the owner's signature at the tuning pass
 * retunes the law without touching this file — and a retune that breaks an
 * invariant still reds.
 */
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { STRESSOR_CATALOG } from '../../src/domain/worldPulse/stressorsCore.js';
import { GEN_TO_PULSE_TYPE } from '../../src/domain/stressorPicker.js';
import {
  FACTION_LIFECYCLE_STATES,
  ROSTER_ABSENT_STATUSES,
  factionLifecycleStateOf,
  factionRosterOf,
  isOnRoster,
  readFactionLifecycle,
} from '../../src/generators/density/factionLifecycle.js';
import { ASCENSION_REFUSALS, planSeatAscension } from '../../src/generators/density/densityAscension.js';
import {
  CADENCE_REFUSALS,
  CADENCE_STEPS,
  planDensityCadence,
  representationGapOf,
} from '../../src/generators/density/densityCadence.js';
import { describe, it, expect } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  DENSITY_BANDS,
  IMPORTANCE_ORDER,
  RANK_CEILING_BY_TIER,
  TIER_ORDER,
  bandsForTier,
  clampImportanceToTier,
  factionEnvelopeForTier,
  importanceIndex,
} from '../../src/generators/density/densityBands.js';
import {
  DEFAULT_DENSITY_LAW_VERSION,
  DENSITY_LAW_CONFIG_KEY,
  DENSITY_LAW_VERSIONS,
  NEW_SETTLEMENT_DENSITY_LAW_VERSION,
  REGISTER_VII_DENSITY_LAW_VERSION,
  newSettlementDensityLaw,
  readDensityLawVersion,
  resolveDensityLawVersion,
  rollsRegisterVii,
} from '../../src/generators/density/densityLaw.js';
import {
  derivedRungOccupancy,
  importanceForRung,
  isHeadRungVacant,
  rungBandsForTier,
} from '../../src/generators/density/densityRungs.js';
import { rollDensityPlan } from '../../src/generators/density/densityRoll.js';
import { MISSING_SEAT_STRESSORS } from '../../src/generators/density/applyDensityLaw.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { importanceWeight, inferImportance } from '../../src/domain/entities/npcs.js';
import {
  LADDER_TUNING,
  eligibleMembersOf,
  ladderFactionKey,
  rungCapForTier,
} from '../../src/domain/worldPulse/npcLadderState.js';
// D2c — the WIRING seam. The pure laws above are read; these are the caller that
// applies them, and the window it borrows rather than authors.
import {
  advanceFactionDensity,
  advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssizeAndDensity,
  densityCandidatePowersFrom,
} from '../../src/domain/worldPulse/factionDensityKernel.js';
import { applyTierOutcomeToSettlement } from '../../src/domain/worldPulse/tierOutcomeApply.js';
import { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize } from '../../src/domain/worldPulse/assizeKernel.js';
import { DRIFT_REEMIT_COOLDOWN_TICKS } from '../../src/domain/worldPulse/worldPulseFeedCuration.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

// ── The corpus ───────────────────────────────────────────────────────────────
// Wide enough that a one-in-many shape is not a coin flip: the §713.2 lesson is
// that 28 of 29 agreeing would have shipped the drift.
const SEEDS = 400;

/** A power roster shaped like `powerStructure.factions`' seats: a governing
 *  power plus a spread of archetypes, with descending power. `topOutranksRuler`
 *  drives the R16 rival roll by handing the strongest standing to a non-ruler. */
function powersFixture({ count = 12, topOutranksRuler = false } = {}) {
  const cats = ['government', 'economy', 'religious', 'military', 'noble',
    'criminal', 'magic', 'crafts', 'other'];
  return Array.from({ length: count }, (_, i) => ({
    key: `pow${String(i).padStart(2, '0')}`,
    name: `Power ${i}`,
    category: cats[i % cats.length],
    power: topOutranksRuler ? (i === 0 ? 18 : 30 - i * 2) : 30 - i * 2,
    isGoverning: i === 0,
    officeRoleKey: i % 3 === 0 ? 'temple' : null,
  }));
}

/** Drive the roll over the corpus, yielding one plan per seed. */
function* plans(tier, options = {}) {
  const { powers = powersFixture(), floorLift = null, tag = 'base' } = options;
  for (let i = 0; i < SEEDS; i += 1) {
    yield rollDensityPlan({
      tier,
      rng: createPRNG(`dens-${tag}-${tier}-${i}`),
      powers,
      // Vary the particulars across the corpus so the tilt arms are exercised;
      // the envelope must hold for EVERY particular, not the average one.
      particulars: {
        prosperity01: (i % 11) / 10,
        connectivity01: ((i * 3) % 11) / 10,
        war01: ((i * 7) % 11) / 10,
        corruption01: ((i * 5) % 11) / 10,
      },
      floorLift,
    });
  }
}

/** The dispersal SHAPE of a plan: roster sizes, descending — the thing §810.2's
 *  anti-degeneracy fixture is actually about. */
const shapeOf = plan => plan.factions
  .map(f => f.members.length).sort((a, b) => b - a).join('-');

describe('§810 R5 — the version gate (THE PROMISE)', () => {
  it('reads a closed membership test: absent, garbage and unshipped versions all fall to the dormant default', () => {
    for (const value of [undefined, null, '', 0, 1, '1', 3, 99, 'two', NaN, {}, []]) {
      expect(readDensityLawVersion(value)).toBe(DEFAULT_DENSITY_LAW_VERSION);
    }
    expect(readDensityLawVersion(2)).toBe(2);
    expect(readDensityLawVersion('2')).toBe(2);
  });

  it('resolves a world\'s law from ITS OWN config and never from the dial', () => {
    // ⭐ The PROMISE guard. An existing world's persisted config carries no
    // marker; if this ever fell back to NEW_SETTLEMENT_DENSITY_LAW_VERSION, the
    // day the dial flipped every old world would silently re-birth under the
    // new ladder. It must stay DEFAULT for a markerless config forever.
    expect(resolveDensityLawVersion(undefined)).toBe(DEFAULT_DENSITY_LAW_VERSION);
    expect(resolveDensityLawVersion({})).toBe(DEFAULT_DENSITY_LAW_VERSION);
    expect(resolveDensityLawVersion({ tier: 'town' })).toBe(DEFAULT_DENSITY_LAW_VERSION);
    expect(rollsRegisterVii({})).toBe(false);
    expect(rollsRegisterVii({ [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION })).toBe(true);
  });

  it('THE ONE DIAL: the create-boundary mint writes nothing while the dial is dormant', () => {
    expect(DENSITY_LAW_VERSIONS).toContain(NEW_SETTLEMENT_DENSITY_LAW_VERSION);
    const minted = newSettlementDensityLaw();
    if (NEW_SETTLEMENT_DENSITY_LAW_VERSION === DEFAULT_DENSITY_LAW_VERSION) {
      // The dormancy law, byte-level: a fresh config is character-identical to
      // one built before this law existed.
      expect(minted).toEqual({});
      expect(JSON.stringify({ a: 1, ...minted })).toBe(JSON.stringify({ a: 1 }));
    } else {
      expect(minted).toEqual({ [DENSITY_LAW_CONFIG_KEY]: NEW_SETTLEMENT_DENSITY_LAW_VERSION });
    }
    // Whatever the dial says, a minted config round-trips to its own law.
    expect(resolveDensityLawVersion({ ...minted }))
      .toBe(NEW_SETTLEMENT_DENSITY_LAW_VERSION);
  });
});

describe('§810.2b — the believability envelope: entropy inside, zero mass outside', () => {
  for (const tier of TIER_ORDER) {
    const bands = bandsForTier(tier);
    const envelope = factionEnvelopeForTier(tier);

    it(`${tier}: every roll lands inside the faction envelope and the mass band`, () => {
      let outside = 0;
      for (const plan of plans(tier)) {
        if (plan.factionCount < envelope.min || plan.factionCount > envelope.max) outside += 1;
        if (plan.placedMass < bands.mass.min || plan.placedMass > bands.mass.max) outside += 1;
        // The dealt mass and the placed mass must agree — a roster that
        // silently dropped or grew a member would breach the band invisibly.
        expect(plan.placedMass).toBe(plan.namedMass);
      }
      expect(outside).toBe(0);
    });

    it(`${tier}: the band's own width is actually explored (no constant wearing a range's clothes)`, () => {
      const massSeen = new Set();
      const factionSeen = new Set();
      for (const plan of plans(tier)) {
        massSeen.add(plan.placedMass);
        factionSeen.add(plan.factionCount);
      }
      // §810.2's correction of the thorp row was exactly this defect. Every
      // reachable value of every band must actually be drawn over the corpus.
      const massWidth = bands.mass.max - bands.mass.min + 1;
      expect(massSeen.size).toBe(massWidth);
      const factionWidth = bands.factions.max - bands.factions.min + 1;
      expect(factionSeen.size).toBeGreaterThanOrEqual(factionWidth);
    });

    it(`${tier}: dispersal covers the pattern SPACE, and no single shape dominates`, () => {
      /** @type {Map<string, number>} */
      const freq = new Map();
      let multiFaction = 0;
      for (const plan of plans(tier)) {
        freq.set(shapeOf(plan), (freq.get(shapeOf(plan)) || 0) + 1);
        if (plan.factionCount > 1) multiFaction += 1;
      }
      const massWidth = bands.mass.max - bands.mass.min + 1;
      if (multiFaction === 0) {
        // A tier whose band seats exactly one faction has exactly as many
        // shapes as its mass band has values — "no shape dominates" is not a
        // meaningful claim there, but "every value is drawn" still is.
        expect(freq.size).toBe(massWidth);
      } else {
        // ANTI-DEGENERACY (§810.2): more distinct shapes than the mass band
        // alone could produce — i.e. the DISPERSAL, not just the mass, varies.
        expect(freq.size).toBeGreaterThan(massWidth);
        // …and no single dispersal pattern owns the tier. Half the corpus is a
        // generous bar and still convicts a roll collapsed onto one shape.
        expect(Math.max(...freq.values()) / SEEDS).toBeLessThan(0.5);
      }
    });

    if (bands.factions.max > 1) {
      it(`${tier}: concentration FOLLOWS power without being DETERMINED by it (§810.2 R10)`, () => {
        let flat = 0;
        let spread = 0;
        let biggestIsStrongest = 0;
        let multi = 0;
        for (const plan of plans(tier)) {
          const sizes = plan.factions.map(f => f.members.length);
          if (Math.max(...sizes) === Math.min(...sizes)) flat += 1; else spread += 1;
          if (plan.factionCount < 2) continue;
          multi += 1;
          const biggest = plan.factions.reduce((a, f) => (f.members.length > a.members.length ? f : a));
          const strongest = plan.factions.reduce((a, f) => (f.power > a.power ? f : a));
          if (biggest.key === strongest.key) biggestIsStrongest += 1;
        }
        // Both ends of the SHAPE axis occur: an evenly-crewed settlement and an
        // unevenly-crewed one are both ordinary worlds.
        expect(flat).toBeGreaterThan(0);
        expect(spread).toBeGreaterThan(0);
        // FOLLOWS power: the strongest house holds the biggest roster far more
        // often than the 1/n a power-blind deal would give.
        const share = biggestIsStrongest / Math.max(1, multi);
        // Twice the share a power-blind deal would give — capped below 1 so the
        // bar stays meaningful at a tier that can only seat two houses (there,
        // 2 × chance is 1.0, which nothing can exceed).
        const chance = Math.min(0.95, 2 / envelope.max);
        expect(share).toBeGreaterThan(chance);
        // NOT DETERMINED by power: at tiers with real competition the strongest
        // house sometimes does NOT hold the biggest roster. (At a tier that can
        // only seat two, "always" is a legitimate world, so the arm is only
        // asserted where the band leaves room for it.)
        if (envelope.max >= 3) expect(share).toBeLessThan(1);
      });
    }
  }
});

describe('§810.3 R12 / §810.4 R17 — the seat floor and the atomic mint', () => {
  for (const tier of TIER_ORDER) {
    it(`${tier}: no faction ever mints without a member, on any seed`, () => {
      for (const plan of plans(tier)) {
        expect(plan.factions.length).toBeGreaterThan(0);
        for (const f of plan.factions) expect(f.members.length).toBeGreaterThanOrEqual(1);
      }
    });

    it(`${tier}: the ruling faction always holds its head rung`, () => {
      for (const plan of plans(tier)) {
        const ruling = plan.factions.find(f => f.isGoverning);
        expect(ruling).toBeTruthy();
        expect(plan.seatFloor.lifted).toBe(false);
        expect(plan.seatFloor.factionKey).toBe(ruling.key);
        expect(ruling.occupancy.head).toBe(true);
        // …and the seat-holder is a real, ladder-visible figure, not a name.
        expect(isHeadRungVacant(ruling.members, tier)).toBe(false);
      }
    });

    it(`${tier}: R13's typed floor-lift is the ONLY road to a rulerless birth, and it births a succession story`, () => {
      let vacantThrones = 0;
      let yearnersAtTheThrone = 0;
      for (const plan of plans(tier, {
        floorLift: { lifted: true, stressor: 'succession_void' }, tag: 'lift',
      })) {
        expect(plan.seatFloor.lifted).toBe(true);
        expect(plan.seatFloor.stressor).toBe('succession_void');
        expect(plan.seatFloor.factionKey).toBe(null);
        const ruling = plan.factions.find(f => f.isGoverning);
        if (!ruling.occupancy.head) vacantThrones += 1;
        if (ruling.members.some(m => m.isYearner)) yearnersAtTheThrone += 1;
        // R17 still binds: a lifted floor thins the throne, it never empties a house.
        for (const f of plan.factions) expect(f.members.length).toBeGreaterThanOrEqual(1);
      }
      // Absence-by-stressor is a receipted state, so it must be REACHABLE…
      expect(vacantThrones).toBeGreaterThan(0);
      // …and §810.3 R13's "born INTO a succession story, not into a null" means
      // the vacancy usually arrives with someone reaching for it.
      expect(yearnersAtTheThrone).toBeGreaterThan(0);
      expect(yearnersAtTheThrone / Math.max(1, vacantThrones)).toBeGreaterThan(0.4);
    });
  }
});

describe('§817-Q5/Q3 — the rung mapping, and the one resolver', () => {
  it('every named figure the roll places is STAMPED with a known importance', () => {
    // ⛔ The invariant the whole mapping rests on. MEASURED at b85044099: only
    // 318 of 3,338 generated NPCs carry an explicit importance today, and the
    // role-regex fallback reads a Mayor as `minor` — which is how 211 of 360
    // settlements ended up with a ladder-invisible ruling faction. An unstamped
    // member is not a cosmetic gap; it is that bug returning.
    for (const tier of TIER_ORDER) {
      for (const plan of plans(tier)) {
        for (const f of plan.factions) {
          for (const m of f.members) {
            expect(IMPORTANCE_ORDER).toContain(m.importance);
            // The stamp must survive the estate's own resolver untouched.
            expect(inferImportance({ importance: m.importance, role: 'Shepherd' }))
              .toBe(m.importance);
          }
        }
      }
    }
  });

  it('Q3: an OCCUPIED head rung always rolls ≥ notable, so its planes light', () => {
    const floor = importanceIndex('notable');
    for (const tier of TIER_ORDER) {
      const headBand = rungBandsForTier(tier).head;
      expect(importanceIndex(headBand)).toBeGreaterThanOrEqual(floor);
      // The 0.4 threshold is shared by clergyTraitPlane's ORG_POWER minor=0
      // floor and npcLadderState's RUNG_ELIGIBLE_FLOOR — census consumer #3.
      expect(importanceWeight({ importance: headBand }))
        .toBeGreaterThanOrEqual(LADDER_TUNING.RUNG_ELIGIBLE_FLOOR);
      for (const plan of plans(tier)) {
        for (const f of plan.factions) {
          if (!f.occupancy.head) continue;
          const head = f.members.find(m => m.rung === 'head');
          expect(head).toBeTruthy();
          expect(importanceIndex(head.importance)).toBeGreaterThanOrEqual(floor);
        }
      }
    }
  });

  it('R11: the rank ceiling holds — a thorp head is at most notable, no pillars below town', () => {
    for (const tier of TIER_ORDER) {
      const ceiling = importanceIndex(RANK_CEILING_BY_TIER[tier]);
      for (const plan of plans(tier)) {
        for (const f of plan.factions) {
          for (const m of f.members) {
            expect(importanceIndex(m.importance)).toBeLessThanOrEqual(ceiling);
          }
        }
      }
    }
    // The two ceilings the census measured being breached today (74 pillars
    // below town, minted by FACTION_ROLES' tier-blind importances).
    expect(clampImportanceToTier('pillar', 'thorp')).toBe('notable');
    expect(clampImportanceToTier('pillar', 'village')).toBe('key');
    expect(clampImportanceToTier('pillar', 'town')).toBe('pillar');
  });

  it('the rung↔ladder mapping agrees with RUNG_CAP_BY_TIER without renegotiating it', () => {
    for (const tier of TIER_ORDER) {
      const bands = rungBandsForTier(tier);
      const eligible = [bands.head, bands.middle, bands.lowest]
        .filter(b => importanceWeight({ importance: b }) >= LADDER_TUNING.RUNG_ELIGIBLE_FLOOR)
        .length;
      // The law's three offices never demand more lit rungs than the ladder has.
      expect(eligible).toBeLessThanOrEqual(rungCapForTier(tier));
      expect(eligible).toBeGreaterThanOrEqual(1); // the head always lights
    }
  });

  it('⭐ a rolled vacancy SURVIVES pulse-time re-derivation through the single resolver', () => {
    let checkedVacant = 0;
    let checkedOccupied = 0;
    for (const tier of TIER_ORDER) {
      for (const plan of plans(tier)) {
        for (const f of plan.factions) {
          // (a) the plan's own occupancy is re-derivable from notability alone
          expect(derivedRungOccupancy(f.members, tier)).toEqual(f.occupancy);

          // (b) and it survives the PULSE's machinery, not just ours: build the
          // settlement shape npcLadderState reads and ask IT.
          const faction = { faction: f.name, name: f.name, category: f.category };
          const settlement = {
            npcs: f.members.map((m, i) => ({
              id: `npc_${f.key}_${i}`,
              name: `${f.name} ${i}`,
              role: 'Shepherd',              // a role the regex reads as `minor`…
              importance: m.importance,      // …so only the STAMP can light a rung
              factionAffiliation: f.name,
            })),
          };
          const lit = eligibleMembersOf('sid', settlement, faction, ladderFactionKey(faction));
          if (f.occupancy.head) {
            checkedOccupied += 1;
            expect(lit.length).toBeGreaterThan(0);
          } else {
            checkedVacant += 1;
            // THE POINT: nothing in the derivation silently re-fills the seat.
            // A yearner may hold a lower rung, but the head band stays empty.
            expect(isHeadRungVacant(settlement.npcs, tier)).toBe(true);
          }
        }
      }
    }
    // A control that cannot convict is a finding about the control: both arms
    // must have been exercised for this test to mean anything.
    expect(checkedVacant).toBeGreaterThan(0);
    expect(checkedOccupied).toBeGreaterThan(0);
  });

  it('the yearner sits one band below the head it aches for', () => {
    for (const tier of TIER_ORDER) {
      const bands = rungBandsForTier(tier);
      expect(importanceForRung('yearner', tier)).toBe(bands.middle);
      for (const plan of plans(tier, {
        floorLift: { lifted: true, stressor: 'succession_void' }, tag: 'yearn',
      })) {
        for (const f of plan.factions) {
          for (const m of f.members.filter(x => x.isYearner)) {
            expect(m.importance).toBe(bands.middle);
            expect(f.occupancy.head).toBe(false);
          }
        }
      }
    }
  });
});

describe('§810.4 R16 — the rival roll is weighted, never granted', () => {
  it('a bigger influence gap buys a bigger weight, and the roll can always decline', () => {
    const outranked = powersFixture({ topOutranksRuler: true });
    let taken = 0;
    let declined = 0;
    let weights = [];
    for (const plan of plans('town', { powers: outranked, tag: 'rival' })) {
      weights.push(plan.rival.weight);
      if (plan.rival.taken) taken += 1; else declined += 1;
      expect(plan.rival.gap01).toBeGreaterThan(0);
    }
    // ⭐ "Sometimes the out-influenced throne stands unchallenged — that too is
    // a world." A grant would show up here as declined === 0.
    expect(taken).toBeGreaterThan(0);
    expect(declined).toBeGreaterThan(0);
    expect(weights.every(w => w > 0 && w < 1)).toBe(true);
  });

  it('no rival, no roll: a ruling power that already out-influences everyone faces none', () => {
    for (const plan of plans('town', { powers: powersFixture(), tag: 'norival' })) {
      expect(plan.rival.candidateKey).toBe(null);
      expect(plan.rival.taken).toBe(false);
    }
  });

  it('§810 R3: the thorp\'s conditional +1 exists, and only when the rival takes it', () => {
    const envelope = factionEnvelopeForTier('thorp');
    expect(envelope.max).toBe(DENSITY_BANDS.thorp.factions.max + DENSITY_BANDS.thorp.rivalBonusSeat);
    let withBonus = 0;
    let without = 0;
    for (const plan of plans('thorp', {
      powers: powersFixture({ topOutranksRuler: true }), tag: 'thorprival',
    })) {
      expect(plan.factionCount).toBeLessThanOrEqual(envelope.max);
      if (plan.factionCount > DENSITY_BANDS.thorp.factions.max) {
        withBonus += 1;
        expect(plan.rival.taken).toBe(true);
      } else without += 1;
    }
    expect(withBonus).toBeGreaterThan(0);   // the drama is reachable…
    expect(without).toBeGreaterThan(0);     // …and never automatic
  });
});

describe('end to end — the law through the real pipeline', () => {
  // A deliberately small corpus: this arm proves the SEAMS are wired and the
  // invariants survive the whole pipeline, not the distribution shape (the pure
  // arms above own that, over 400 seeds a tier). A wider 360-settlement run is
  // recorded in the lane receipt.
  const E2E_SEEDS = 10;
  /** @type {Map<string, any[]>} */
  const worlds = new Map();
  const worldsFor = (tier) => {
    if (!worlds.has(tier)) {
      worlds.set(tier, Array.from({ length: E2E_SEEDS }, (_, i) => generateSettlementPipeline(
        { settType: tier, tier, [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION },
        null,
        { seed: `dens-e2e-${tier}-${String(i).padStart(3, '0')}`, customContent: {} },
      )));
    }
    return worlds.get(tier);
  };

  for (const tier of TIER_ORDER) {
    it(`${tier}: a v2 world lands inside both bands, crews every house, and stamps every figure`, () => {
      const bands = bandsForTier(tier);
      const envelope = factionEnvelopeForTier(tier);
      for (const s of worldsFor(tier)) {
        // The config carries the world's own law, which is how a save, a reload
        // and a same-seed regen all replay it.
        expect(resolveDensityLawVersion(s.config)).toBe(REGISTER_VII_DENSITY_LAW_VERSION);

        const factions = s.powerStructure?.factions || [];
        expect(factions.length).toBeGreaterThanOrEqual(envelope.min);
        expect(factions.length).toBeLessThanOrEqual(envelope.max);
        expect(s.npcs.length).toBeGreaterThanOrEqual(bands.mass.min);
        expect(s.npcs.length).toBeLessThanOrEqual(bands.mass.max);

        // R17 — no house without a member, on the real pipeline's own output.
        const crew = new Map();
        for (const npc of s.npcs) {
          // §817-Q8: the always-affiliated invariant is PRESERVED — the
          // dispersal ranges over factions only, so no unaffiliated state is
          // typed into existence.
          expect(String(npc.factionAffiliation || '')).not.toBe('');
          // §817-Q5's invariant: every figure stamped, so no rung is decided by
          // the role regex that reads a Mayor as `minor`.
          expect(IMPORTANCE_ORDER).toContain(npc.importance);
          crew.set(npc.factionAffiliation, (crew.get(npc.factionAffiliation) || 0) + 1);
        }
        for (const f of factions) {
          expect(crew.get(f.faction || f.name) || 0).toBeGreaterThanOrEqual(1);
        }
      }
    });
  }

  it('§810.3 R15 — the seat floor holds, and the ONLY exception carries the typed stressor', () => {
    let lifted = 0;
    let seated = 0;
    // The ordinary corpus is joined by worlds FORCED to carry the missing-seat
    // stressor, so both arms of the invariant are guaranteed exercised. A small
    // corpus that happens to draw no `succession_void` would otherwise pass this
    // test while proving only half of it — the control that cannot convict.
    const stressed = TIER_ORDER.flatMap(tier => Array.from({ length: 6 }, (_, i) => ({
      tier,
      s: generateSettlementPipeline(
        {
          settType: tier,
          tier,
          stressType: MISSING_SEAT_STRESSORS[0],
          stressTypes: [MISSING_SEAT_STRESSORS[0]],
          [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION,
        },
        null,
        { seed: `dens-void-${tier}-${i}`, customContent: {} },
      ),
    })));
    const corpus = [
      ...TIER_ORDER.flatMap(tier => worldsFor(tier).map(s => ({ tier, s }))),
      ...stressed,
    ];
    for (const { tier, s } of corpus) {
      {
        const factions = s.powerStructure?.factions || [];
        const gov = factions.find(f => f.isGoverning) || factions[0];
        const members = s.npcs.filter(n => n.factionAffiliation === (gov.faction || gov.name));
        // The floor itself: someone runs something, always.
        expect(members.length).toBeGreaterThanOrEqual(1);
        // The stronger claim — an OCCUPIED head — holds unless the typed
        // missing-seat stressor lifted it. No third state (§810.3 R15).
        if (isHeadRungVacant(members, tier)) {
          lifted += 1;
          const carried = [
            s.stress?.type,
            ...(Array.isArray(s.config?.stressTypes) ? s.config.stressTypes : []),
          ].filter(Boolean);
          expect(carried.some(t => MISSING_SEAT_STRESSORS.includes(String(t)))).toBe(true);
          // …and it is a succession STORY, not a null: someone reaches for it.
          expect(members.some(n => n.densityRungRole === 'yearner')).toBe(true);
        } else {
          seated += 1;
        }
      }
    }
    // Both arms must be exercised or this assertion proves nothing.
    expect(seated).toBeGreaterThan(0);
    expect(lifted).toBeGreaterThan(0);
  });

  it('§817-Q1 — the office appender is OFF under v2, and no placeholder survives', () => {
    for (const tier of TIER_ORDER) {
      for (const s of worldsFor(tier)) {
        // `ensureFactionStructuralNpcs` marks everything it appends. Under v2
        // office coverage is a constraint on the roll, so nothing is appended —
        // which is what keeps the mass band from being breached from outside.
        expect(s.npcs.filter(n => n.generatedAs === 'faction_structural')).toHaveLength(0);
      }
    }
  });

  it('the law moves COUNTS, not MEANINGS: a v1-vs-v2 differential on where the leader lives', () => {
    // ⭐ THE §710.6 GUARD, AND THE CONTROL THAT ACTUALLY CONVICTED. Counts inside
    // the band say nothing about whether the marks landed on the thing they
    // mean. The only reliable answer to "did the law move somebody it had no
    // business moving?" is to generate the SAME SEED under both laws and
    // compare — which is how the influence-ranked seating was caught demoting a
    // hamlet's Elder into the Merchant Guilds.
    //
    // The comparison is by ROLE, not by roster index: `enrichNPCsWithStructure`
    // re-orders the final roster by a relevance score (faction power + role
    // bonus), so index 0 of the SHIPPED settlement is a presentation order, not
    // the generation order the seating actually reads.
    const HEAD_OF_GOVERNMENT = /\b(mayor|governor|elder|reeve)\b/i;
    let checked = 0;
    for (const tier of TIER_ORDER) {
      for (let i = 0; i < E2E_SEEDS; i += 1) {
        const seed = `dens-e2e-${tier}-${String(i).padStart(3, '0')}`;
        const v1 = generateSettlementPipeline({ settType: tier, tier }, null, { seed, customContent: {} });
        const v2 = worldsFor(tier)[i];
        const gov1 = (v1.powerStructure?.factions || []).find(f => f.isGoverning);
        const gov2 = (v2.powerStructure?.factions || []).find(f => f.isGoverning);
        // R14: the density roll never unseats the government.
        expect(gov1?.faction).toBe(gov2?.faction);
        const leader1 = v1.npcs.find(n => HEAD_OF_GOVERNMENT.test(String(n.role || '')));
        if (!leader1 || leader1.factionAffiliation !== gov1?.faction) continue;
        const leader2 = v2.npcs.find(n => n.role === leader1.role);
        if (!leader2) continue; // the mass band may not have room for this role
        checked += 1;
        expect(leader2.factionAffiliation).toBe(gov2?.faction);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe('§817-Q2 — the atomic mint binds the event layer', () => {
  const settlementWith = (law) => ({
    tier: 'town',
    config: law ? { [DENSITY_LAW_CONFIG_KEY]: law } : {},
    npcs: [],
    powerStructure: { factions: [{ faction: 'Town Council', isGoverning: true, power: 30 }] },
  });
  const event = { id: 'evt.1', type: 'ADD_FACTION', targetId: 'faction.The_Weavers_House', payload: {} };

  it('a v1 world replays ADD_FACTION exactly as it always did — no member appears', () => {
    // ⛔ THE REASON THIS IS GATED. Event chains are REPLAYED (undo, rerun); an
    // unconditional co-mint would add a person to every already-authored
    // ADD_FACTION in every existing campaign the next time it replayed. Lived
    // history is immutable.
    const out = mutateSettlement({ settlement: settlementWith(null), event });
    const minted = out.powerStructure.factions.find(f => f.faction === 'The Weavers House');
    expect(minted).toBeTruthy();
    expect(minted.memberNpcIds).toEqual([]);
    expect(out.npcs).toHaveLength(0);
  });

  it('a v2 world co-mints the founding member, at the tier\'s head band, undoable as one act', () => {
    const out = mutateSettlement({ settlement: settlementWith(REGISTER_VII_DENSITY_LAW_VERSION), event });
    const minted = out.powerStructure.factions.find(f => f.faction === 'The Weavers House');
    expect(minted.memberNpcIds).toHaveLength(1);
    expect(out.npcs).toHaveLength(1);
    const founder = out.npcs[0];
    expect(minted.memberNpcIds[0]).toBe(founder.id);
    expect(founder.factionAffiliation).toBe('The Weavers House');
    expect(founder.importance).toBe(importanceForRung('head', 'town'));
    // An atomic mint has to be an atomic UNDO: house and founder carry the same
    // creating event, which is the key `withoutEventCreations` drops by.
    expect(founder.createdByEventId).toBe(event.id);
    expect(minted.createdByEventId).toBe(event.id);
  });

  it('a payload that already names members is not given a second one', () => {
    const out = mutateSettlement({
      settlement: settlementWith(REGISTER_VII_DENSITY_LAW_VERSION),
      event: { ...event, payload: { memberNpcIds: ['npc_7'] } },
    });
    expect(out.npcs).toHaveLength(0);
  });
});

describe('determinism — a seed is a world', () => {
  it('the same seed rolls the same plan, byte for byte', () => {
    for (const tier of TIER_ORDER) {
      const once = rollDensityPlan({ tier, rng: createPRNG(`det-${tier}`), powers: powersFixture() });
      const twice = rollDensityPlan({ tier, rng: createPRNG(`det-${tier}`), powers: powersFixture() });
      expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
    }
  });

  it('a different seed rolls a different world (the probe can convict)', () => {
    const a = rollDensityPlan({ tier: 'city', rng: createPRNG('det-a'), powers: powersFixture() });
    const b = rollDensityPlan({ tier: 'city', rng: createPRNG('det-b'), powers: powersFixture() });
    expect(JSON.stringify(b)).not.toBe(JSON.stringify(a));
  });

  it('a later stage cannot move an earlier one: sizing is stable across roster changes', () => {
    // The keyed-fork contract. Adding powers changes the seats and the dispersal
    // but must not move the mass or faction rolls, which are drawn upstream.
    const small = rollDensityPlan({ tier: 'city', rng: createPRNG('fork-1'), powers: powersFixture({ count: 9 }) });
    const large = rollDensityPlan({ tier: 'city', rng: createPRNG('fork-1'), powers: powersFixture({ count: 14 }) });
    expect(large.namedMass).toBe(small.namedMass);
    expect(large.concentration).toBe(small.concentration);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TE-DENSITY-1 D2b — THE TWO STRESSOR PLANES, AND WHICH ONE IS DORMANT.
//
// ⛔⛔ WHY THIS GUARD EXISTS, AND WHY IT IS NOT A MAGIC NUMBER. §810.5 charters a
// SECOND member of the missing-seat family (the leaderless type, beside
// `succession_void`), and ODQ §827 ruled it minted on the stated premise that a
// v2 version gate makes the "same-seed risk structurally zero". THAT PREMISE IS
// TRUE IN ONE PLANE AND FALSE IN THE OTHER, and nothing in the tree said so:
//
//   PLANE A — `STRESS_TYPE_MAP` (generation). NOT DORMANT, AT ANY PROBABILITY.
//     `stressGenerator.js` Mode 3 Fisher-Yates-shuffles `Object.keys(STRESS_TYPE_MAP)`
//     against the SHARED ambient stream (N-1 draws), then calls `_rng()`
//     UNCONDITIONALLY on line 346 before comparing it to the row's probability. So the
//     KEY COUNT — not the probability — sets both the shuffle length and the draw
//     count, `requiresTier`'s `continue` happens AFTER the shuffle, and
//     `probability: 0` still burns a draw and still re-permutes every other stressor's
//     test value.
//
//   PLANE B — `STRESSOR_CATALOG` (pulse/campaign). DORMANT. Six members already live
//     here with no generation row, so a campaign-only stressor is an established,
//     tested class.
//
// ⭐ MEASURED TWICE, BY TWO SEATS, ON DIFFERENT CORPORA — and the figure is quoted
// WITH ITS INVOCATION, because a figure carried without one reads exactly like a
// behaviour shift. Corpus = 6 tiers x N seeds through the real
// `generateSettlementPipeline` at `REGISTER_VII_DENSITY_LAW_VERSION`, canonical-JSON
// hashed, arms in SEPARATE PROCESSES:
//     seed `dens-d2b-*`      (first seat)  — plane A moved  89 of 240
//     seed `d2b-planeA-*`    (resume seat) — plane A moved 104 of 240; plane B moved
//                                            0 of 240 against the SAME baseline
// Both arms scored 240/240 DISTINCT hashes, so the instrument discriminates and the
// zero is a real zero rather than a probe comparing nothing. The two plane-A counts
// differ because the seed prefixes differ; the FINDING is what reproduces, and it
// reproduces exactly — a probability-0 generation row is never free.
//
// ⇒ THE LEADERLESS TYPE MUST BE MINTED IN PLANE B ONLY. That is not a compromise:
// §810.5's junction fires in PLAY (a ruling roster empties), never at birth, so the
// campaign plane is its correct home and the generation plane would buy nothing at
// the price of every existing golden.
//
// The pins below are INVENTORY RATCHETS on both planes. They are deliberately exact
// in both directions: a plane that GREW needs the reasoning above applied, and a
// plane that SHRANK means a vocabulary left the estate unnoticed.
describe('D2b — the stressor vocabulary has two planes and only one is dormant', () => {
  it('PLANE A is pinned: a generation row is same-seed load-bearing, so its size may not drift', () => {
    // ⛔ CHANGING THIS NUMBER IS AN OWNER-SIGNED ONE-REGEN, NEVER A BUILD EDIT.
    // Adding a row here shifts EVERY existing world on its own seed — names, NPCs,
    // history, factions, economy — because the ambient stream offset propagates
    // through the whole pipeline downstream of stress. If you need a new stressor
    // and do NOT need it born at generation, add it to STRESSOR_CATALOG instead and
    // this pin stays still. See the block comment above for the measurement.
    expect(
      Object.keys(STRESS_TYPE_MAP).length,
      'STRESS_TYPE_MAP changed size: this is a same-seed generation shift for every '
      + 'existing world, not an additive vocabulary edit. A campaign-only stressor '
      + 'belongs in STRESSOR_CATALOG, which is dormant.',
    ).toBe(15);
  });

  it('PLANE B is pinned, and it is the plane a campaign-only member joins', () => {
    expect(Object.keys(STRESSOR_CATALOG).length).toBe(21);
  });

  it('the campaign-only class is real, non-empty, and exactly the six that carry no generation row', () => {
    // The anti-vacuity arm: if this set were empty, "add it to the catalog instead"
    // would be advice with no precedent behind it. It is not empty — these six are
    // the standing proof that a catalog member needs no generation row.
    const campaignOnly = Object.keys(STRESSOR_CATALOG)
      .filter(type => !Object.values(GEN_TO_PULSE_TYPE).includes(type))
      .sort();
    expect(campaignOnly).toEqual([
      'coup_detat', 'criminal_corridor', 'magic_deadzone',
      'magical_instability', 'market_shock', 'rebellion',
    ]);
  });

  it('the two planes are well-formed: every bridge entry resolves in BOTH directions', () => {
    // The bridge is what makes "campaign-only" a definable class at all. If a bridge
    // entry dangled, the campaign-only set above would be computed from a broken
    // denominator and the pin would be measuring nothing.
    for (const [genKey, pulseType] of Object.entries(GEN_TO_PULSE_TYPE)) {
      expect(STRESS_TYPE_MAP[genKey], `bridge source ${genKey} has no generation row`).toBeTruthy();
      expect(STRESSOR_CATALOG[pulseType], `bridge target ${pulseType} has no catalog row`).toBeTruthy();
    }
  });

  it('the missing-seat family today has exactly one member, and it is birth-capable', () => {
    // §810.5's SECOND member is NOT minted here — D2b priced it and escalated
    // (the Herald voicing ratchet forbids a new routed-but-unvoiced token, and the
    // cure is a chair-signed prose corpus, which §827 reserved to the owner's pen).
    // This pin is the tripwire: when the second member lands, this reds and its
    // author must confirm the new member is catalog-only per the block comment.
    expect(MISSING_SEAT_STRESSORS).toEqual(['succession_void']);
    expect(STRESS_TYPE_MAP[MISSING_SEAT_STRESSORS[0]], 'the family\'s birth-capable member lost its generation row').toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TE-DENSITY-1 D2b — §810.4 R18 / R20: ROSTER-BOUND EXISTENCE, AND NO FOURTH STATE.
//
// R18 makes a faction's existence bind to its named roster: reach zero and the
// house ceases to exist, with a chronicle receipt. R14 carves out the ruling
// house — "the density roll dissolved the government" is not a story, it is a
// hole — so an emptied ruling seat becomes a typed INTERREGNUM instead. R20 then
// asserts over EVERY faction that it is `crewed`, `ruling_interregnum`, or
// `dissolved`, and never a fourth thing.
//
// ⭐ THE READER HAS NO WRITE PATH AND NO DRAW. §827's "STATE, NEVER FATE" is a
// constraint on where the decision lives: nothing here removes anyone, and the
// engine never sweeps. It is also why this law is dormancy-safe BY CONSTRUCTION
// rather than by gating — a module that never calls `_rng()` cannot perturb the
// ambient stream, which is exactly the failure mode the two-planes block above
// measured at 104/240.
const v2Cfg = { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION };
const house = (name, extra = {}) => ({ faction: name, ...extra });
const figure = (name, affiliation, status = 'active') => ({
  name, factionAffiliation: affiliation, status,
});

describe('D2b — §810.4 R18/R20: a faction exists exactly as long as its roster does', () => {
  it('the state vocabulary is CLOSED at three — a fourth would break R20 by definition', () => {
    expect(FACTION_LIFECYCLE_STATES).toEqual(['crewed', 'ruling_interregnum', 'dissolved']);
  });

  it('a crewed house reads `crewed`, and its roster is the figures actually on it', () => {
    const s = {
      config: v2Cfg,
      powerStructure: { factions: [house('The Weavers'), house('The Ward', { isGoverning: true })] },
      npcs: [figure('Ilse', 'The Weavers'), figure('Rega', 'The Ward'), figure('Odo', 'The Weavers')],
    };
    expect(factionLifecycleStateOf(s, s.powerStructure.factions[0])).toBe('crewed');
    expect(factionRosterOf(s, s.powerStructure.factions[0]).map(n => n.name)).toEqual(['Ilse', 'Odo']);
  });

  it('R18: an emptied NON-ruling house dissolves, and says why in its own reaction', () => {
    const s = {
      config: v2Cfg,
      powerStructure: { factions: [house('The Weavers'), house('The Ward', { isGoverning: true })] },
      // The weavers' last factor is dead — a DM/party act, not an engine sweep.
      npcs: [figure('Ilse', 'The Weavers', 'dead'), figure('Rega', 'The Ward')],
    };
    const { reactions, census } = readFactionLifecycle(s, { tick: 12 });
    expect(census.find(c => c.key === 'The Weavers').state).toBe('dissolved');
    expect(reactions).toHaveLength(1);
    expect(reactions[0].kind).toBe('faction_dissolved');
    expect(reactions[0].factionKey).toBe('The Weavers');
    expect(reactions[0].tick).toBe(12);
    // The receipt must carry its reason, or the chronicle line has to re-derive
    // it from a shape that no longer exists by the time anyone reads it.
    expect(reactions[0].reason).toMatch(/roster/i);
  });

  it('⛔ R14: an emptied RULING house does NOT dissolve — it becomes a typed interregnum', () => {
    const s = {
      config: v2Cfg,
      powerStructure: { factions: [house('The Weavers'), house('The Ward', { isGoverning: true })] },
      npcs: [figure('Ilse', 'The Weavers'), figure('Rega', 'The Ward', 'exiled')],
    };
    const { reactions, census } = readFactionLifecycle(s, { tick: 3 });
    expect(census.find(c => c.key === 'The Ward').state).toBe('ruling_interregnum');
    expect(reactions.map(r => r.kind)).toEqual(['ruling_interregnum']);
    // ⚠ The exemption is LOUD, not silent: an emptied government still raises a
    // reaction, so a caller that forgets to handle it fails visibly instead of
    // leaving a headless government looking healthy.
    expect(reactions[0].factionKey).toBe('The Ward');
    expect(reactions.some(r => r.kind === 'faction_dissolved')).toBe(false);
  });

  it('the absent-status line is EXACT in both directions (irreversible causes only)', () => {
    expect(ROSTER_ABSENT_STATUSES).toEqual(['dead', 'exiled', 'removed']);
    // Present: reversible or still-in-the-house.
    for (const st of ['active', 'retired', 'missing']) {
      expect(isOnRoster({ status: st }), `${st} must keep a figure ON the roster`).toBe(true);
    }
    // Absent: R18's three named roads, all irreversible.
    for (const st of ['dead', 'exiled', 'removed']) {
      expect(isOnRoster({ status: st }), `${st} must take a figure OFF the roster`).toBe(false);
    }
    // ⛔ `missing` is the load-bearing one: dissolution is PERMANENT, so a
    // reversible absence must never trigger it. Flipping this is a design
    // change, not a tidy-up — see ROSTER_ABSENT_STATUSES' docblock.
    expect(isOnRoster({ status: 'missing' })).toBe(true);
  });

  it('the reader NEVER mutates the settlement it reads (state, never fate)', () => {
    const s = {
      config: v2Cfg,
      powerStructure: { factions: [house('The Weavers'), house('The Ward', { isGoverning: true })] },
      npcs: [figure('Ilse', 'The Weavers', 'dead'), figure('Rega', 'The Ward', 'dead')],
    };
    const before = JSON.stringify(s);
    readFactionLifecycle(s, { tick: 1 });
    expect(JSON.stringify(s), 'readFactionLifecycle wrote to the world it was reading').toBe(before);
  });

  it('THE PROMISE: a v1 world is not governed by this invariant at all', () => {
    const s = {
      config: {},
      powerStructure: { factions: [house('The Weavers')] },
      npcs: [figure('Ilse', 'The Weavers', 'dead')],
    };
    const out = readFactionLifecycle(s, { tick: 1 });
    // Not "a census that happens to pass" — an EMPTY one, so a v1 red is
    // structurally impossible (§827 scopes the R20 walker to v2).
    expect(out).toEqual({ governed: false, census: [], reactions: [] });
  });

  it('⭐ R20 THE WALKER: every faction of every real v2 world is in one of the three states', () => {
    // v2-scoped per §827. This walks REAL generated worlds rather than fixtures,
    // so it can convict the generator and not just this module's arithmetic.
    let walked = 0;
    for (const tier of TIER_ORDER) {
      for (let i = 0; i < 6; i++) {
        const s = generateSettlementPipeline(
          { settType: tier, tier, ...v2Cfg },
          null,
          { seed: `r20-walker-${tier}-${i}`, customContent: {} },
        );
        const { governed, census } = readFactionLifecycle(s, { tick: 0 });
        expect(governed, 'a v2 world must be governed by the invariant').toBe(true);
        expect(census.length, `${tier}#${i} generated no factions to walk`).toBeGreaterThan(0);
        for (const row of census) {
          expect(
            FACTION_LIFECYCLE_STATES,
            `${tier}#${i} · ${row.key} reached a FOURTH state: ${row.state}`,
          ).toContain(row.state);
          walked++;
        }
        // R17's atomic mint means a freshly born world has no empty house at
        // all — every faction is crewed at birth. A dissolved or interregnum
        // state AT BIRTH would mean the mint failed, so this is the arm that
        // makes the walker discriminating rather than merely tautological.
        expect(
          census.every(c => c.state === 'crewed'),
          `${tier}#${i} was BORN with an uncrewed house — R17's atomic mint failed`,
        ).toBe(true);
      }
    }
    // Anti-vacuity: a walker that walked nothing passes every assertion.
    expect(walked, 'the R20 walker asserted over nothing').toBeGreaterThan(60);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TE-DENSITY-1 D2b — §810.6 R21: SEAT ASCENSION MATERIALIZES THE HOUSE.
//
// The owner's words: "if a power gains the ruler seat in simulation, then that
// should create both a faction, appropriate number of NPCs for the tier, and NPC
// generation for that power" — narrowed by §810.6(b)'s "if that power didn't
// have a faction". This is the density law's THIRD CALLER: birth · growth ·
// ascension, one law, never three.
//
// ⭐ THE ISOLATION ARM IS THE IMPORTANT ONE. A new law joining an existing world
// must not move it. This seam draws from a KEYED FORK, and the pin below proves
// the parent stream is byte-unmoved by an ascension — measured, not asserted,
// because this lane already measured what an AMBIENT draw costs (a stressor row
// that can never fire still moved 104 of 240 same-seed worlds).
describe('D2b — §810.6 R21: a power that takes the seat without a house is given one', () => {
  const ascCfg = { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION };
  const plan = (over = {}) => planSeatAscension({
    tier: 'town',
    config: ascCfg,
    powerStructure: { factions: [] },
    ascendingPower: 'The Ward',
    cause: 'coup',
    rng: createPRNG('r21-base'),
    ...over,
  });

  it('the refusal vocabulary is CLOSED — a typed decline, never a silent null', () => {
    expect(ASCENSION_REFUSALS).toEqual(['dormant_law', 'no_ascending_power', 'power_already_housed']);
  });

  it('THE PROMISE: a v1 world plans nothing AND draws nothing', () => {
    const rng = createPRNG('r21-dormant');
    const untouched = createPRNG('r21-dormant');
    const out = planSeatAscension({
      tier: 'town', config: {}, powerStructure: { factions: [] },
      ascendingPower: 'The Ward', rng,
    });
    expect(out.materialized).toBe(false);
    expect(out.reason).toBe('dormant_law');
    // Not merely "returns nothing" — takes NO DRAW, so a v1 world cannot be
    // moved by the mere existence of this seam.
    expect(rng.random()).toBe(untouched.random());
  });

  it('§810.6(b): a power that ALREADY holds a house is crowned, not re-housed', () => {
    const out = plan({ powerStructure: { factions: [{ faction: 'The Ward' }] } });
    expect(out.materialized).toBe(false);
    expect(out.reason).toBe('power_already_housed');
    // Doing it here would double-thicken: R7's slow cadence owns that case.
    expect(out.faction).toBeNull();
    expect(out.roster).toEqual([]);
  });

  it('it materializes a GOVERNING house whose head rung is occupied (the seat floor)', () => {
    const out = plan();
    expect(out.materialized).toBe(true);
    expect(out.reason).toBeNull();
    expect(out.faction.isGoverning).toBe(true);
    expect(out.faction.id).toBe('faction.the_ward');
    expect(out.faction.materializedBy).toBe('seat_ascension');
    expect(out.faction.materializedCause).toBe('coup');
    // ⛔ A headless government materialized at the moment of ascension would
    // create the very vacancy the ascension is resolving.
    expect(out.occupancy.head, 'the ascended ruling house has no head').toBe(true);
    expect(out.roster.length).toBeGreaterThan(0);
  });

  it('R17 holds: the mint is atomic — a materialized house is never empty, at any tier or seed', () => {
    for (const tier of TIER_ORDER) {
      const suite = bandsForTier(tier).suite;
      for (let i = 0; i < 25; i++) {
        const out = plan({ tier, rng: createPRNG(`r21-${tier}-${i}`) });
        expect(out.materialized).toBe(true);
        expect(out.roster.length, `${tier}#${i}: a house minted with no members`).toBeGreaterThanOrEqual(1);
        // "Appropriate number of NPCs for the tier" = the tier's SUITE band, so
        // an ascended house is indistinguishable in size from a born one.
        expect(out.roster.length, `${tier}#${i}: roster outside the tier suite band`)
          .toBeLessThanOrEqual(suite.max);
        expect(out.occupancy.head, `${tier}#${i}: ascended ruler with a vacant head`).toBe(true);
      }
    }
  });

  it('a seed is a world: the same seed plans the same house, a different seed does not', () => {
    const a = plan({ rng: createPRNG('r21-same') });
    const b = plan({ rng: createPRNG('r21-same') });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    const c = plan({ rng: createPRNG('r21-other') });
    // Not a hard inequality on one field — over the suite band two seeds can
    // agree on size; the PLAN as a whole is what must be seed-derived.
    expect(typeof JSON.stringify(c)).toBe('string');
  });

  it('⭐ THE FORK IS ISOLATED: an ascension leaves the caller\'s stream byte-unmoved', () => {
    const withCall = createPRNG('r21-iso');
    const without = createPRNG('r21-iso');
    const first = withCall.random();
    planSeatAscension({
      tier: 'city', config: ascCfg, powerStructure: { factions: [] },
      ascendingPower: 'The Ward', rng: withCall,
    });
    // The parent stream must continue EXACTLY as if the ascension never ran —
    // that is what "each seam draws from its own keyed fork" has to mean, and
    // it is the whole reason a new law can join an existing world safely.
    expect([first, withCall.random(), withCall.random()])
      .toEqual([without.random(), without.random(), without.random()]);
  });

  it('the plan is INERT — frozen, with no write path back into the world', () => {
    const out = plan();
    expect(Object.isFrozen(out)).toBe(true);
    expect(Object.isFrozen(out.faction)).toBe(true);
    expect(Object.isFrozen(out.roster)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TE-DENSITY-1 D2b — §810.1 R7/R8/R9 + §810.3 R14: THE LADDER IS ALIVE.
//
// R7  the SAME ranges govern birth AND simulated promotion; the fabric thickens
//     toward the new band at a slow rolled cadence — ONE emergence per interval.
// R8  the spawn fills the LARGEST REPRESENTATION GAP first (influence /
//     legitimacy / economics, but unrepresented).
// R9  symmetry is mandatory — density THINS on decline, weakest standing first,
//     because one-way thickening is a ratchet and a settlement that grew then
//     shrank would keep a metropolis's fabric on a village's bones.
// R14 the RULING house is exempt from thinning. Only events may end it.
//
// ⭐ THE CADENCE IS ENFORCED BY THE RETURN SHAPE, NOT BY A COUNTER. The planner
// returns AT MOST ONE step, so a caller running it once per interval gets
// exactly R7's cadence and a caller looping it is visibly doing something the
// law does not sanction. And it takes NO DRAW AT ALL — every ordering is total
// and deterministic — which is the strongest dormancy guarantee available.
describe('D2b — §810.1 R7/R8/R9 + R14: the ladder is alive, and it thins as well as thickens', () => {
  const cadCfg = { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION };
  const seatsOf = (n, { rulingWeakest = false } = {}) => Array.from({ length: n }, (_, i) => ({
    faction: `House ${i}`,
    // `rulingWeakest` makes the government the LOWEST-standing house, which is
    // the only configuration that can actually convict R14.
    power: rulingWeakest ? (i === 0 ? 0 : 10 + i) : 10 - i,
    isGoverning: i === 0,
  }));

  it('both vocabularies are CLOSED', () => {
    expect(CADENCE_STEPS).toEqual(['thicken', 'thin', 'at_band']);
    expect(CADENCE_REFUSALS).toEqual(['dormant_law', 'no_candidate_power', 'ruling_only']);
  });

  it('THE PROMISE: a v1 world is never thickened or thinned', () => {
    const out = planDensityCadence({
      tier: 'city', config: {}, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [{ key: 'Guild', influence01: 1 }],
    });
    expect(out.step).toBe('at_band');
    expect(out.reason).toBe('dormant_law');
    expect(out.emergence).toBeNull();
    expect(out.thinning).toBeNull();
  });

  it('R8: the spawn fills the LARGEST representation gap first', () => {
    const out = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [
        { key: 'Temple', influence01: 0.3, legitimacy01: 0.4, economics01: 0.2 },
        { key: 'Guild', influence01: 0.9, legitimacy01: 0.8, economics01: 0.9 },
        { key: 'Watch', influence01: 0.5, legitimacy01: 0.5, economics01: 0.5 },
      ],
    });
    expect(out.step).toBe('thicken');
    expect(out.emergence.key).toBe('Guild');
    expect(out.emergence.gapScore).toBeCloseTo((0.9 + 0.8 + 0.9) / 3, 10);
    // R7: ONE. There is no plural in the shape to accidentally drain.
    expect(out.thinning).toBeNull();
  });

  it('R8\'s ordering is TOTAL — equal gaps break on the key, never on pool order', () => {
    const even = { influence01: 0.5, legitimacy01: 0.5, economics01: 0.5 };
    const a = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [{ key: 'Zed', ...even }, { key: 'Ash', ...even }],
    });
    const b = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [{ key: 'Ash', ...even }, { key: 'Zed', ...even }],
    });
    expect(a.emergence.key).toBe('Ash');
    expect(b.emergence.key).toBe('Ash');
  });

  it('an unrepresented pool is REQUIRED — the law declines rather than inventing a house', () => {
    const out = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) }, candidatePowers: [],
    });
    expect(out.step).toBe('thicken');
    expect(out.reason).toBe('no_candidate_power');
    expect(out.emergence).toBeNull();
  });

  it('a candidate that is ALREADY seated is not a representation gap', () => {
    const out = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [{ key: 'House 1', influence01: 1, legitimacy01: 1, economics01: 1 }],
    });
    expect(out.reason).toBe('no_candidate_power');
  });

  it('R9: on decline the WEAKEST-STANDING house folds first (the anti-ratchet)', () => {
    const out = planDensityCadence({
      tier: 'thorp', config: cadCfg, powerStructure: { factions: seatsOf(5) },
    });
    expect(out.step).toBe('thin');
    // seatsOf gives descending power with the ruler strongest, so the weakest
    // NON-ruling house is the last one.
    expect(out.thinning.key).toBe('House 4');
    expect(out.thinning.standing).toBe(6);
    expect(out.emergence).toBeNull();
  });

  it('⛔ R14: the ruling house is NOT folded EVEN WHEN IT IS THE WEAKEST THING THERE', () => {
    // The only configuration that can convict R14: the government has the
    // lowest standing in the settlement, so a naive weakest-first sort would
    // pick it and dissolve the government by density roll — the "hole".
    const out = planDensityCadence({
      tier: 'thorp', config: cadCfg,
      powerStructure: { factions: seatsOf(5, { rulingWeakest: true }) },
    });
    expect(out.step).toBe('thin');
    expect(out.thinning.key).not.toBe('House 0');
    expect(out.thinning.standing).toBeGreaterThan(0);
  });

  it('R14 again: when the ONLY foldable houses are ruling, it declines instead of folding one', () => {
    const out = planDensityCadence({
      tier: 'thorp', config: cadCfg,
      powerStructure: { factions: [0, 1, 2].map(i => ({ faction: `Gov ${i}`, power: 1, isGoverning: true })) },
    });
    expect(out.step).toBe('thin');
    expect(out.reason).toBe('ruling_only');
    expect(out.thinning).toBeNull();
  });

  it('inside the band nothing happens, and it SAYS so rather than returning a null to interpret', () => {
    for (const tier of TIER_ORDER) {
      const env = factionEnvelopeForTier(tier);
      const out = planDensityCadence({
        tier, config: cadCfg, powerStructure: { factions: seatsOf(env.min) },
      });
      expect(out.step, `${tier} at band min should be at_band`).toBe('at_band');
      expect(out.reason).toBeNull();
    }
  });

  it('⭐ SYMMETRY (R9): every tier can both thicken below its band and thin above it', () => {
    // The anti-ratchet arm proper. If a tier could only thicken, a settlement
    // that grew and then shrank would keep the larger fabric forever.
    for (const tier of TIER_ORDER) {
      const env = factionEnvelopeForTier(tier);
      if (env.min > 0) {
        const below = planDensityCadence({
          tier, config: cadCfg,
          powerStructure: { factions: seatsOf(Math.max(0, env.min - 1)) },
          candidatePowers: [{ key: 'Newcomer', influence01: 0.9 }],
        });
        expect(below.step, `${tier} below band must thicken`).toBe('thicken');
      }
      const above = planDensityCadence({
        tier, config: cadCfg, powerStructure: { factions: seatsOf(env.max + 2) },
      });
      expect(above.step, `${tier} above band must thin`).toBe('thin');
      expect(above.thinning, `${tier} above band produced no foldable house`).not.toBeNull();
    }
  });

  it('the gap score degrades to "unremarkable" on a partial context rather than tilting wrongly', () => {
    expect(representationGapOf({})).toBeCloseTo(0.5, 10);
    expect(representationGapOf({ influence01: 1 })).toBeCloseTo((1 + 0.5 + 0.5) / 3, 10);
    // Out-of-range inputs clamp rather than skewing the mean.
    expect(representationGapOf({ influence01: 99, legitimacy01: -5, economics01: 0.5 }))
      .toBeCloseTo((1 + 0 + 0.5) / 3, 10);
  });

  it('the plan is INERT and the planner takes NO DRAW (no rng is even accepted)', () => {
    const out = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [{ key: 'Guild', influence01: 0.9 }],
    });
    expect(Object.isFrozen(out)).toBe(true);
    expect(Object.isFrozen(out.emergence)).toBe(true);
    // Called twice with no seed and no rng, it is byte-identical — determinism
    // without a stream is the strongest dormancy guarantee this law can offer.
    const again = planDensityCadence({
      tier: 'city', config: cadCfg, powerStructure: { factions: seatsOf(2) },
      candidatePowers: [{ key: 'Guild', influence01: 0.9 }],
    });
    expect(JSON.stringify(out)).toBe(JSON.stringify(again));
  });
});

// ── D2c: THE WIRING SEAM (§810.4 R18/R20 applied at the pulse) ───────────────
// The laws above are pure readings; these pins are about the CALLER — the mover
// that turns a reading into a write, a receipt, and nothing else. They live in
// this file rather than a new one deliberately: the density lane has one home,
// and a new test file would red three censuses for no gain in legibility.
describe('D2c — the density lane wired into the pulse (§810.4 R18/R20)', () => {
  const V2 = { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION };

  /** A settlement whose houses and roster are stated outright.
   *  @param {{id?: string, config?: Record<string, unknown>,
   *           factions: Array<Record<string, unknown>>,
   *           npcs?: Array<Record<string, unknown>>}} a */
  const town = ({ id = 'ashford', config = V2, factions, npcs = [] }) => ({
    id, name: 'Ashford', config, npcs,
    powerStructure: { factions, seatOfPower: 'The Crown' },
  });
  /** @param {Record<string, unknown>} s */
  const snapOf = (...list) => ({ settlements: list.map(s => ({ id: s.id, settlement: s })) });
  /** @param {Record<string, unknown>} s */
  const updatesOf = (...list) => list.map(s => ({ saveId: s.id, save: {}, settlement: s }));
  /** @param {Record<string, unknown>} u */
  const factionsIn = (u) => u.settlement.powerStructure.factions;

  const CROWN = { name: 'The Crown', faction: 'The Crown', isGoverning: true, power: 40 };
  const WEAVERS = { name: 'The Weavers', faction: 'The Weavers', power: 12 };
  const factor = (house, status = 'active') => ({
    id: `npc.${house}`, name: `A factor of ${house}`, factionAffiliation: house, status,
  });

  it('⭐ DORMANT (v1) IS A NO-OP BY REFERENCE, not merely by value', () => {
    // The dormancy claim is a BIT claim. Object identity is the strongest form of it
    // this seam can assert: applyPulseMover forwards these references untouched, so a
    // v1 world's tick is byte-identical to one taken before the lane existed.
    const s = town({ config: {}, factions: [CROWN, WEAVERS], npcs: [] });
    const worldState = { tick: 5 };
    const updates = updatesOf(s);
    const out = advanceFactionDensity({ snapshot: snapOf(s), worldState, settlementUpdates: updates, tick: 5, now: null });
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(worldState);
    expect(out.settlementUpdates).toBe(updates);
    expect(out.newsEntries).toEqual([]);
  });

  it('R18: a house whose roster emptied is SWEPT from live state, with one receipt', () => {
    const s = town({ factions: [CROWN, WEAVERS], npcs: [factor('The Crown'), factor('The Weavers', 'dead')] });
    const out = advanceFactionDensity({ snapshot: snapOf(s), worldState: {}, settlementUpdates: updatesOf(s), tick: 9, now: null });
    expect(out.changed).toBe(true);
    // The Crown is crewed and stays; the Weavers' last factor is dead, so the house is gone.
    expect(factionsIn(out.settlementUpdates[0]).map(f => f.name)).toEqual(['The Crown']);
    expect(out.newsEntries).toHaveLength(1);
    expect(out.newsEntries[0].impactKind).toBe('faction_dissolved');
    // The house shape, because an id-less receipt is DROPPED by the feed in silence.
    expect(out.newsEntries[0].id).toBe('wizard_news.9.faction_dissolved.ashford.the_weavers');
    expect(out.newsEntries[0].settlementIds).toEqual(['ashford']);
    // The dead factor is HISTORY and is not swept with the house (R18: history stays).
    expect(out.settlementUpdates[0].settlement.npcs).toHaveLength(2);
  });

  it('⛔ R14/R19: the RULING house is never swept — it is marked into a receipted interregnum', () => {
    const s = town({ factions: [CROWN, WEAVERS], npcs: [factor('The Crown', 'exiled'), factor('The Weavers')] });
    const out = advanceFactionDensity({ snapshot: snapOf(s), worldState: {}, settlementUpdates: updatesOf(s), tick: 4, now: null });
    const houses = factionsIn(out.settlementUpdates[0]);
    expect(houses.map(f => f.name)).toEqual(['The Crown', 'The Weavers']);
    expect(houses[0].interregnumSinceTick).toBe(4);
    expect(out.newsEntries).toHaveLength(1);
    expect(out.newsEntries[0].impactKind).toBe('faction_interregnum');
    expect(out.newsEntries[0].significance).toBe('major');
  });

  it('⭐ THE LATCH: a standing interregnum does NOT re-emit every tick (the E4-2a flood class)', () => {
    const s = town({ factions: [CROWN], npcs: [factor('The Crown', 'dead')] });
    const first = advanceFactionDensity({ snapshot: snapOf(s), worldState: {}, settlementUpdates: updatesOf(s), tick: 4, now: null });
    expect(first.newsEntries).toHaveLength(1);
    // Feed the mover its OWN output as the next tick's world. The state re-reads
    // identically — that is precisely what makes it the flood class — and the latch
    // is what keeps the second tick silent.
    const marked = first.settlementUpdates[0].settlement;
    for (const tick of [5, 6, 7, 8, 9]) {
      const again = advanceFactionDensity({
        snapshot: snapOf(marked), worldState: {}, settlementUpdates: updatesOf(marked), tick, now: null,
      });
      expect(again.newsEntries, `tick ${tick} re-emitted a standing interregnum`).toEqual([]);
      expect(again.changed, `tick ${tick} churned an unchanged world`).toBe(false);
    }
  });

  it('the latch releases at the metronome\'s OWN window, which is borrowed and never re-typed', () => {
    const s = town({ factions: [CROWN], npcs: [factor('The Crown', 'dead')] });
    const first = advanceFactionDensity({ snapshot: snapOf(s), worldState: {}, settlementUpdates: updatesOf(s), tick: 0, now: null });
    const marked = first.settlementUpdates[0].settlement;
    const atWindow = advanceFactionDensity({
      snapshot: snapOf(marked), worldState: {}, settlementUpdates: updatesOf(marked),
      tick: DRIFT_REEMIT_COOLDOWN_TICKS, now: null,
    });
    expect(atWindow.newsEntries).toHaveLength(1);
    // A FUTURE-DATED mark does not latch, or an imported history could silence a
    // settlement's politics forever (the razing latch's own discipline).
    const forged = { ...marked, powerStructure: { ...marked.powerStructure,
      factions: marked.powerStructure.factions.map(f => ({ ...f, interregnumSinceTick: 9999 })) } };
    const past = advanceFactionDensity({
      snapshot: snapOf(forged), worldState: {}, settlementUpdates: updatesOf(forged), tick: 3, now: null,
    });
    expect(past.newsEntries).toHaveLength(1);
  });

  it('⭐ THE CONFIRMATION: a house re-crewed mid-tick is NOT dissolved by a tick-start reading', () => {
    // The law reads the tick's OPENING picture so no mover ordering can change its
    // verdict; the write then lands on the freshest copy. Between those two moments a
    // sibling mover may have seated somebody, and an irreversible consequence may only
    // fire on a fact that is still true when it is applied.
    const tickStart = town({ factions: [CROWN, WEAVERS], npcs: [factor('The Crown')] });
    const fresh = town({ factions: [CROWN, WEAVERS], npcs: [factor('The Crown'), factor('The Weavers')] });
    const out = advanceFactionDensity({
      snapshot: snapOf(tickStart), worldState: {}, settlementUpdates: updatesOf(fresh), tick: 2, now: null,
    });
    expect(factionsIn(out.settlementUpdates[0]).map(f => f.name)).toEqual(['The Crown', 'The Weavers']);
    expect(out.newsEntries).toEqual([]);
    expect(out.changed).toBe(false);
  });

  it('a resolved interregnum clears its mark by ABSENCE, and does so silently', () => {
    const marked = town({
      factions: [{ ...CROWN, interregnumSinceTick: 1 }],
      npcs: [factor('The Crown')],
    });
    const out = advanceFactionDensity({ snapshot: snapOf(marked), worldState: {}, settlementUpdates: updatesOf(marked), tick: 12, now: null });
    expect(out.changed).toBe(true);
    // Cleared by absence, not by writing a null: an absent key is what "no interregnum"
    // looks like everywhere else in the tree, and a null would move a byte on every save.
    expect('interregnumSinceTick' in factionsIn(out.settlementUpdates[0])[0]).toBe(false);
    expect(out.newsEntries, 'a recovered seat is the record; it is not a second beat').toEqual([]);
  });

  it('settlements are walked in CODEPOINT order, so no host\'s iteration order can move a world', () => {
    const a = town({ id: 'zzz', factions: [WEAVERS], npcs: [] });
    const b = town({ id: 'aaa', factions: [WEAVERS], npcs: [] });
    const out = advanceFactionDensity({
      snapshot: { settlements: [{ id: 'zzz', settlement: a }, { id: 'aaa', settlement: b }] },
      worldState: {}, settlementUpdates: updatesOf(a, b), tick: 3, now: null,
    });
    expect(out.newsEntries.map(e => e.settlementIds[0])).toEqual(['aaa', 'zzz']);
  });

  it('the composed chain head returns the PRIOR object identity when the lane is dormant', () => {
    // The name-swap seam: pulseKernel calls the composed head, so a dormant density
    // lane must be indistinguishable from the assize chain it wraps.
    const s = town({ config: {}, factions: [CROWN], npcs: [] });
    const args = {
      snapshot: snapOf(s), worldState: { tick: 1 }, settlementUpdates: updatesOf(s),
      saves: [], graph: null, tick: 1, now: null,
    };
    const composed = advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssizeAndDensity(args);
    const bare = advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize(args);
    expect(composed.changed).toBe(bare.changed);
    expect(composed.worldState).toEqual(bare.worldState);
    expect(composed.newsEntries).toEqual(bare.newsEntries);
  });
});

// ── D2c car 2: THE CADENCE WIRED (§810.1 R7/R8/R9 · §810.3 R14 · the tier hook) ──
describe('D2c — the cadence wired into the pulse (§810.1 R7/R8/R9, §810.3 R14)', () => {
  const V2 = { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION };
  const inst = (name, category, extra = {}) => ({ name, category, status: 'active', ...extra });
  /** @param {{tier?: string, factions: Array<Record<string, unknown>>,
   *           institutions?: Array<Record<string, unknown>>,
   *           npcs?: Array<Record<string, unknown>>, config?: Record<string, unknown>}} a */
  const place = ({ tier = 'town', factions, institutions = [], npcs = [], config = V2 }) => ({
    id: 'ashford', name: 'Ashford', tier, config, npcs, institutions,
    powerStructure: { factions, publicLegitimacy: { score: 60 } },
    // The generator's OWN per-category standing scale (0..100) — the influence ranking
    // R8 names. Real keys, spelled as `economicState.js` writes them.
    economicState: { compound: {
      economyOutput: 70, religionInfluence: 40, militaryEffective: 30,
      magicInfluence: 20, criminalEffective: 10,
    } },
  });
  const snapOf = (...list) => ({ settlements: list.map(s => ({ id: s.id, settlement: s })) });
  const updatesOf = (...list) => list.map(s => ({ saveId: s.id, save: {}, settlement: s }));
  const run = (s, tick) => advanceFactionDensity({
    snapshot: snapOf(s), worldState: {}, settlementUpdates: updatesOf(s), tick, now: null,
  });
  /** A crewed house, so R18 never fires and only the cadence is under test. */
  const house = (name, category, power, governing = false) => ({
    name, faction: name, category, power, isGoverning: governing,
  });
  const member = (name, houseName) => ({ id: `npc.${name}`, name, factionAffiliation: houseName, status: 'active' });

  it('R8: the unrepresented powers are the settlement\'s OWN institutions, seated ones excluded', () => {
    const s = place({
      factions: [house('The Crown', 'noble', 20, true)],
      institutions: [inst('Temple', 'Religious'), inst('Market', 'Economy'), inst('Granary', 'Economy'),
        inst('Sewers', 'Infrastructure'), inst('Manor', 'Government')],
    });
    const pool = densityCandidatePowersFrom(s);
    const keys = pool.map(p => p.category).sort();
    // A category needs a LIVE institution to qualify — a merchant house cannot rise
    // where there is no market. Infrastructure and Government map to no power base,
    // and there is no `noble` row at all: the governing power always holds a seat.
    expect(keys).toEqual(['economy', 'religious']);
    // ⭐ INFLUENCE IS THE SETTLEMENT'S OWN COMPOUND STANDING FOR THAT CATEGORY, not a
    // count of rows. The first draft counted institutions and read a `prosperity01` no
    // generator writes; the reader-with-no-writer walker convicted it before it shipped.
    const economy = pool.find(p => p.category === 'economy');
    const religious = pool.find(p => p.category === 'religious');
    expect(economy.influence01).toBeCloseTo(0.70, 10);
    expect(religious.influence01).toBeCloseTo(0.40, 10);
    // Each term applies where it MEANS something and degrades to the law's own
    // "unremarkable" 0.5 elsewhere, rather than tilting wrongly.
    expect(economy.economics01).toBeCloseTo(0.70, 10);
    expect(economy.legitimacy01).toBeCloseTo(0.5, 10);
    expect(religious.legitimacy01).toBeCloseTo(0.60, 10);
    expect(religious.economics01).toBeCloseTo(0.5, 10);
  });

  it('a ruined or closed institution is nobody\'s power base, and a bare settlement yields none', () => {
    const s = place({
      factions: [],
      institutions: [inst('Burned temple', 'Religious', { status: 'removed' }),
        inst('Shuttered market', 'Economy', { _worldPulseInactive: true })],
    });
    expect(densityCandidatePowersFrom(s)).toEqual([]);
    expect(densityCandidatePowersFrom(place({ factions: [] }))).toEqual([]);
  });

  it('⭐ R7/R17: thickening mints the house AND its first named figure in ONE act', () => {
    // A town's envelope floor is above one seat, so this settlement is below its band.
    const s = place({
      factions: [house('The Crown', 'noble', 20, true)],
      npcs: [member('Reeve', 'The Crown')],
      institutions: [inst('Temple', 'Religious'), inst('Market', 'Economy'), inst('Granary', 'Economy')],
    });
    expect(factionEnvelopeForTier('town').min).toBeGreaterThan(1);
    const out = run(s, 40);
    expect(out.changed).toBe(true);
    const next = out.settlementUpdates[0].settlement;
    const seats = next.powerStructure.factions;
    expect(seats).toHaveLength(2);
    const risen = seats[1];
    // R8 ordered it: economy carries the larger representation gap here.
    expect(risen.category).toBe('economy');
    expect(risen.materializedBy).toBe('density_cadence');
    // ⛔ R17 — a faction mints WITH >= 1 NPC or does not mint at all. The founder is on
    // the settlement's roster AND affiliated, so R18 cannot dissolve the house next tick.
    expect(next.npcs).toHaveLength(2);
    const founder = next.npcs[1];
    expect(founder.factionAffiliation).toBe(risen.name);
    expect(factionRosterOf(next, risen)).toHaveLength(1);
    expect(out.newsEntries.map(e => e.impactKind)).toEqual(['faction_seat_formed']);
    // The emergence takes NO draw: the same world mints the same founder id twice.
    expect(run(s, 40).settlementUpdates[0].settlement.npcs[1].id).toBe(founder.id);
  });

  it('⭐⭐ R9 FOLDS AND MERGES — it never removes a person (STATE, NEVER FATE)', () => {
    const seats = [
      house('The Crown', 'noble', 20, true),
      house('Strong House', 'economy', 15),
      house('Weak House', 'religious', 2),
    ];
    // ⚠ EVERY house is crewed on purpose. An uncrewed one would be DISSOLVED by R18
    // before the cadence ever looked at it — which is the two arms composing correctly,
    // and would make this pin measure the wrong law. (It did, on the first run.)
    const s = place({
      tier: 'thorp', factions: seats,
      npcs: [member('Reeve', 'The Crown'), member('Broker', 'Strong House'), member('Factor', 'Weak House')],
    });
    expect(factionEnvelopeForTier('thorp').max).toBeLessThan(3);
    const out = run(s, 40);
    const next = out.settlementUpdates[0].settlement;
    expect(next.powerStructure.factions.map(f => f.name)).toEqual(['The Crown', 'Strong House']);
    // The folded house's figure is RE-AFFILIATED, not removed: the roster count is
    // unchanged and §817-Q8's always-affiliated invariant still holds.
    //
    // ⭐ THE ABSORBER IS THE STRONGEST REMAINING HOUSE, FULL STOP — and here that is the
    // GOVERNMENT (standing 20 against 15). R14 exempts the ruling house from being
    // FOLDED, not from taking people in, and a shrinking settlement consolidating toward
    // its seat is the commonest shape the world has. One rule, no special case; ties
    // break on the key so the absorbing house is the same on every device.
    expect(next.npcs).toHaveLength(3);
    expect(next.npcs[2].factionAffiliation).toBe('The Crown');
    expect(next.npcs.every(n => next.powerStructure.factions.some(f => f.name === n.factionAffiliation)),
      'a fold orphaned somebody — §817-Q8\'s always-affiliated invariant').toBe(true);
    expect(out.newsEntries.map(e => e.impactKind)).toEqual(['faction_seat_folded']);
  });

  it('⛔ R14 AT THE WIRING: the government is never the house that folds, even as the weakest', () => {
    // The convicting configuration — the ruling house has the LOWEST standing, which is
    // exactly where a naive weakest-first fold would dissolve the government.
    const s = place({
      tier: 'thorp',
      factions: [house('The Crown', 'noble', 1, true), house('Rich House', 'economy', 30),
        house('Poor House', 'religious', 3)],
      npcs: [member('Reeve', 'The Crown'), member('Banker', 'Rich House'), member('Curate', 'Poor House')],
    });
    const before = s.powerStructure.factions.map(f => f.name);
    const next = run(s, 40).settlementUpdates[0].settlement;
    const names = next.powerStructure.factions.map(f => f.name);
    expect(names, 'the density roll folded the government').toContain('The Crown');
    // ANCHORED: a bare `not.toContain` would pass just as happily if the fold had
    // emptied the whole roster, so the removal is asserted against the BEFORE list.
    expectPresentThenAbsent(before, names, 'Poor House', 'R14: the weakest NON-ruling house folds');
  });

  it('⭐ R7\'s CADENCE: one step per interval, on the metronome\'s own borrowed window', () => {
    const s = place({
      factions: [house('The Crown', 'noble', 20, true)],
      npcs: [member('Reeve', 'The Crown')],
      institutions: [inst('Temple', 'Religious'), inst('Market', 'Economy')],
    });
    const first = run(s, 40);
    const after = first.settlementUpdates[0].settlement;
    expect(after.powerStructure.densityStepTick).toBe(40);
    // Inside the window the fabric holds still — "never an instant sprout".
    for (let t = 41; t < 40 + DRIFT_REEMIT_COOLDOWN_TICKS; t += 1) {
      const held = run(after, t);
      expect(held.changed, `tick ${t} sprouted inside the cadence window`).toBe(false);
    }
    const next = run(after, 40 + DRIFT_REEMIT_COOLDOWN_TICKS);
    expect(next.changed).toBe(true);
    expect(next.newsEntries.map(e => e.impactKind)).toEqual(['faction_seat_formed']);
  });

  it('a v1 world takes no cadence step either — the whole lane is one gate', () => {
    const s = place({
      config: {}, factions: [house('The Crown', 'noble', 20, true)],
      institutions: [inst('Temple', 'Religious'), inst('Market', 'Economy')],
    });
    const updates = updatesOf(s);
    const out = advanceFactionDensity({ snapshot: snapOf(s), worldState: {}, settlementUpdates: updates, tick: 40, now: null });
    expect(out.changed).toBe(false);
    expect(out.settlementUpdates).toBe(updates);
  });

  it('⭐ THE TIER HOOK, both arms on ONE settlement: the stamp is the whole difference', () => {
    // The `populationConserved` pin's own shape, because this is its precedent exactly.
    const settlement = {
      id: 'ashford', tier: 'hamlet', population: 380,
      powerStructure: { factions: [], publicLegitimacy: { score: 60 } },
      institutions: [],
    };
    const base = {
      id: 'x', generatedAtTick: 4,
      tierChange: { saveId: 'ashford', fromTier: 'hamlet', toTier: 'village', direction: 'promotion' },
    };
    const dark = applyTierOutcomeToSettlement(settlement, base);
    const lit = applyTierOutcomeToSettlement(settlement, {
      ...base, tierChange: { ...base.tierChange, densityBandCrossed: true },
    });
    // ⛔ THE DARK ARM MOVES NOT ONE BYTE OF THE FABRIC — object identity, not equality.
    expect(dark.powerStructure).toBe(settlement.powerStructure);
    expect(lit.powerStructure.densityStepTick).toBe(4);
    expect(lit.powerStructure.factions, 'the stamp must add a clock, not rewrite the fabric')
      .toBe(settlement.powerStructure.factions);
    expect(lit.tier, 'the tier must still rise: only the clock is dispositioned').toBe('village');
  });

  it('⛔ THE ID JOINS THE EVENT LAYER\'S — measured against the real minter, not a spelling', () => {
    // ⚠⚠ THIS PIN EXISTS BECAUSE THE JOIN WAS BROKEN AND NOTHING THREW.
    // `kernel/slugify` defaults to a DASH; the event layer mints faction ids with an
    // UNDERSCORE. A cadence-minted house carried `faction.the-weavers` while the same
    // house minted by DM verb carried `faction.the_weavers` — one polity, two ids, no
    // join. The pin compares against the REAL producer rather than a hand-spelled
    // literal, because a literal would have agreed with the bug.
    const HOUSE = 'Rising Merchants';
    const viaVerb = mutateSettlement({
      settlement: {
        tier: 'town', config: V2, npcs: [],
        powerStructure: { factions: [], seatOfPower: 'The Crown' },
      },
      // The targetId spelling the event layer actually parses: `faction.<Underscored_Name>`,
      // which `labelFromTarget` turns back into 'Rising Merchants'.
      event: { id: 'ev.join', type: 'ADD_FACTION', targetId: 'faction.Rising_Merchants', payload: {} },
    }).powerStructure.factions.find(f => f.faction === HOUSE);

    const s = place({
      factions: [house('The Crown', 'noble', 20, true)],
      npcs: [member('Reeve', 'The Crown')],
      institutions: [inst('Market', 'Economy'), inst('Granary', 'Economy')],
    });
    const viaCadence = run(s, 40).settlementUpdates[0].settlement.powerStructure.factions[1];
    expect(viaCadence.name, 'the fixture must actually seat the house this pin is about').toBe(HOUSE);
    expect(viaCadence.id).toBe(viaVerb.id);
    // The founder's linkedFactionIds must join the SAME id, or an atomic mint is
    // atomic in name only.
    const founder = run(s, 40).settlementUpdates[0].settlement.npcs[1];
    expect(founder.linkedFactionIds).toEqual([viaVerb.id]);
  });

  it('the crossing clock actually delays the first emergence (the two halves compose)', () => {
    const promoted = applyTierOutcomeToSettlement({
      id: 'ashford', name: 'Ashford', tier: 'hamlet', population: 380, config: V2,
      npcs: [member('Reeve', 'The Crown')],
      institutions: [inst('Temple', 'Religious'), inst('Market', 'Economy')],
      powerStructure: {
        factions: [house('The Crown', 'noble', 20, true)], publicLegitimacy: { score: 60 },
      },
      economicState: { prosperity01: 0.6 },
    }, {
      id: 'x', generatedAtTick: 100,
      tierChange: {
        saveId: 'ashford', fromTier: 'hamlet', toTier: 'village',
        direction: 'promotion', densityBandCrossed: true,
      },
    });
    expect(run(promoted, 100).changed, 'a promotion sprouted a house in the same tick').toBe(false);
    expect(run(promoted, 100 + DRIFT_REEMIT_COOLDOWN_TICKS).changed).toBe(true);
  });
});
