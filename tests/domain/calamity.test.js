/**
 * calamity.test.js — Phase 5.5 mover M11b: CALAMITY (natural disaster), the pure-
 * engine proof. Gates proven here:
 *   - THE GATE: calamityEnabled reads the CL flag only (=== true), tolerant/total;
 *   - FREQUENCY: annualHazard is 1/(HAZARD_YEARS × N); a 50-YEAR MULTI-SEED REALM
 *     SOAK lands the realized strike interval in the 10-20y band;
 *   - COOLDOWN-VIA-STAMP: no re-strike within COOLDOWN_YEARS of a prior stamp;
 *   - TERRAIN-KEYED type table (flood/riverside, fire/forest, quake/mountain,
 *     storm/coastal) + the named stamp;
 *   - THE STRIKE: bounded K (tier-capped 1..4), required NEVER selected (the hard
 *     bound), codepoint-sorted determinism, and SUBSUMPTION FIRST (demote / collapse
 *     / destroy);
 *   - AGGREGATE death + exodus fractions are BOUNDED, tier-scaled, and survivable
 *     (deaths + exodus < population — NO annihilation).
 */
import { describe, expect, it } from 'vitest';
import {
  CALAMITY_TUNING,
  calamityEnabled,
  annualHazard,
  rollStrike,
  withinCooldown,
  disasterTypeFor,
  stampTitle,
  isStrikeTarget,
  selectStrikeTargets,
  planInstitutionFate,
  deathFraction,
  exodusFraction,
  resolvePopulationLoss,
} from '../../src/domain/spatial/calamity.js';
import { strikeCapForTier } from '../../src/domain/worldPulse/calamityKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';

const T = CALAMITY_TUNING;
const constRng = (v) => ({ random: () => v });

describe('M11b calamity — the gate (byte-identity seam)', () => {
  it('calamityEnabled reads ONLY the flag, tolerant + total on garbage', () => {
    expect(calamityEnabled({ disastersEnabled: true })).toBe(true);
    expect(calamityEnabled({ disastersEnabled: false })).toBe(false);
    expect(calamityEnabled({})).toBe(false);          // ABSENT ⇒ dormant (default-off law)
    expect(calamityEnabled(null)).toBe(false);
    expect(calamityEnabled(undefined)).toBe(false);
    expect(calamityEnabled('yes')).toBe(false);
    expect(calamityEnabled({ disastersEnabled: 1 })).toBe(false); // only an explicit boolean true arms it
  });
});

describe('M11b calamity — frequency + cooldown', () => {
  it('annualHazard is 1/(HAZARD_YEARS × N) — realm-summed ≈ 1/HAZARD_YEARS', () => {
    expect(annualHazard(1)).toBeCloseTo(1 / T.HAZARD_YEARS, 10);
    expect(annualHazard(10)).toBeCloseTo(1 / (T.HAZARD_YEARS * 10), 10);
    // The realm-summed annual hazard is N × per-settlement = 1/HAZARD_YEARS, size-free.
    for (const n of [3, 8, 25]) expect(n * annualHazard(n)).toBeCloseTo(1 / T.HAZARD_YEARS, 10);
  });

  it('rollStrike fires iff the seeded draw is below the hazard', () => {
    expect(rollStrike({ rng: constRng(0), hazard: 0.5 })).toBe(true);
    expect(rollStrike({ rng: constRng(0.9), hazard: 0.5 })).toBe(false);
    expect(rollStrike({ rng: constRng(0.9), hazard: 0 })).toBe(false);
  });

  it('cooldown-via-stamp: no re-strike within COOLDOWN_YEARS of a prior stamp', () => {
    expect(withinCooldown(null, 20)).toBe(false);           // never struck ⇒ eligible
    expect(withinCooldown(20 - (T.COOLDOWN_YEARS - 1), 20)).toBe(true);  // inside the window ⇒ blocked
    expect(withinCooldown(20 - T.COOLDOWN_YEARS, 20)).toBe(false);       // exactly at the edge ⇒ eligible
    expect(withinCooldown(20 - (T.COOLDOWN_YEARS + 5), 20)).toBe(false); // long past ⇒ eligible
  });

  it('50-YEAR MULTI-SEED REALM SOAK — the realized strike interval lands in the 10-20y band', () => {
    const N = 8;
    const YEARS = 50;
    const SEEDS = 40;
    const hazard = annualHazard(N);
    let totalStrikes = 0;
    for (let s = 0; s < SEEDS; s++) {
      const master = createPRNG(`calamity-soak-${s}`);
      // Per-settlement last-stamp year (cooldown state, exactly as the kernel reads it).
      const lastStamp = new Array(N).fill(null);
      for (let year = 1; year <= YEARS; year++) {
        for (let i = 0; i < N; i++) {
          if (withinCooldown(lastStamp[i], year)) continue;
          const rng = master.fork(`disaster:s${i}:${year}`);
          if (rollStrike({ rng, hazard })) { totalStrikes += 1; lastStamp[i] = year; }
        }
      }
    }
    // Realized realm interval = total realm-years / total realm-strikes.
    const realmYears = YEARS * SEEDS;
    const interval = realmYears / totalStrikes;
    expect(totalStrikes).toBeGreaterThan(0);
    expect(interval).toBeGreaterThanOrEqual(10);
    expect(interval).toBeLessThanOrEqual(20);
  });
});

describe('M11b calamity — terrain-keyed type table + the named stamp', () => {
  it('maps each named terrain to its legible disaster', () => {
    expect(disasterTypeFor('riverside')).toBe('flood');
    expect(disasterTypeFor('forest')).toBe('fire');
    expect(disasterTypeFor('mountain')).toBe('quake');
    expect(disasterTypeFor('hills')).toBe('quake');
    expect(disasterTypeFor('coastal')).toBe('storm');
    expect(disasterTypeFor('plains')).toBe('fire');
    expect(disasterTypeFor('desert')).toBe('storm');
    expect(disasterTypeFor('')).toBe('storm');       // unknown ⇒ the terrain-agnostic default
    expect(disasterTypeFor(null)).toBe('storm');
  });

  it('mints the named permanent stamp', () => {
    expect(stampTitle('fire', 'Thornwood', 12)).toBe('The Great Fire of Thornwood, year 12');
    expect(stampTitle('flood', 'Rivermouth', 7)).toBe('The Great Flood of Rivermouth, year 7');
  });
});

describe('M11b calamity — the strike (bounded, required-never, subsumption)', () => {
  it('strikeCapForTier caps K in 1..4, scaling with tier', () => {
    expect(strikeCapForTier('thorp')).toBe(1);
    expect(strikeCapForTier('village')).toBe(2);
    expect(strikeCapForTier('town')).toBe(3);
    expect(strikeCapForTier('city')).toBe(4);
    expect(strikeCapForTier('metropolis')).toBe(4);
    expect(strikeCapForTier('nonsense')).toBe(1);   // unknown tier ⇒ the smallest strike
  });

  it('isStrikeTarget excludes required + already-fallen institutions', () => {
    expect(isStrikeTarget({ name: 'Blacksmith' })).toBe(true);
    expect(isStrikeTarget({ name: 'Town hall', required: true })).toBe(false);
    expect(isStrikeTarget({ name: 'Ruin', status: 'ruined' })).toBe(false);
    expect(isStrikeTarget({ name: 'Gone', status: 'remnant' })).toBe(false);
    expect(isStrikeTarget({ name: '' })).toBe(false);
    expect(isStrikeTarget(null)).toBe(false);
  });

  it('THE HARD BOUND: a required institution is NEVER selected, over EVERY seed', () => {
    const institutions = [
      { name: 'Town hall', required: true }, { name: 'Water source', required: true },
      { name: 'Inn' }, { name: 'Blacksmith' }, { name: 'Market' }, { name: 'Tannery' },
    ];
    const requiredNames = new Set(['Town hall', 'Water source']);
    for (let s = 0; s < 500; s++) {
      const rng = createPRNG(`sel-${s}`).fork('x');
      for (const k of [1, 2, 3, 4, 99]) {
        const picked = selectStrikeTargets({ institutions, k, rng });
        for (const name of picked) expect(requiredNames.has(name)).toBe(false);
        expect(picked.length).toBeLessThanOrEqual(4); // never more than the eligible non-required pool
      }
    }
  });

  it('selection is codepoint-sorted + deterministic given the seed', () => {
    const institutions = [{ name: 'Inn' }, { name: 'Blacksmith' }, { name: 'Market' }, { name: 'Tannery' }];
    const rngA = createPRNG('det').fork('x');
    const rngB = createPRNG('det').fork('x');
    const a = selectStrikeTargets({ institutions, k: 2, rng: rngA });
    const b = selectStrikeTargets({ institutions, k: 2, rng: rngB });
    expect(a).toEqual(b);                           // same seed ⇒ same picks
    expect(a).toEqual([...a].sort());               // returned codepoint-sorted
  });

  it('k >= pool returns the whole eligible pool (never required)', () => {
    const institutions = [{ name: 'Town hall', required: true }, { name: 'Inn' }, { name: 'Blacksmith' }];
    expect(selectStrikeTargets({ institutions, k: 99, rng: constRng(0.5) })).toEqual(['Blacksmith', 'Inn']);
  });

  it('SUBSUMPTION FIRST: an upgrade-chain greater DEMOTES to its lesser', () => {
    const demotesTo = (n) => (n === "Mages' guild" ? "Wizard's tower" : null);
    const plan = planInstitutionFate({ name: "Mages' guild", demotesTo, alreadyStanding: () => false, categoryMembers: () => [] });
    expect(plan.fate).toBe('demote');
    expect(plan.demotedTo).toBe("Wizard's tower");
  });

  it('a greater whose lesser already stands does NOT demote (no free clone) — it collapses/destroys', () => {
    const demotesTo = (n) => (n === "Mages' guild" ? "Wizard's tower" : null);
    const plan = planInstitutionFate({ name: "Mages' guild", demotesTo, alreadyStanding: (n) => n === "Wizard's tower", categoryMembers: () => [] });
    expect(plan.fate).toBe('destroy'); // no siblings here ⇒ destroyed
  });

  it('a multi-instance category COLLAPSES to one survivor (codepoint-first kept)', () => {
    const plan = planInstitutionFate({
      name: 'Tavern', demotesTo: () => null, alreadyStanding: () => false,
      categoryMembers: () => ['Inn', 'Lodge'],
    });
    expect(plan.fate).toBe('collapse');
    // survivor = codepoint-first of {Inn, Lodge, Tavern} = 'Inn'; the rest razed.
    expect(plan.collapsedAway.sort()).toEqual(['Lodge', 'Tavern']);
  });

  it('a lone institution is DESTROYED (hand of god)', () => {
    const plan = planInstitutionFate({ name: 'Blacksmith', demotesTo: () => null, alreadyStanding: () => false, categoryMembers: () => [] });
    expect(plan.fate).toBe('destroy');
    expect(plan.collapsedAway).toEqual([]);
  });
});

describe('M11b calamity — aggregate population loss (bounded, survivable)', () => {
  it('death + exodus fractions stay inside their frozen bounds over EVERY seed', () => {
    for (let s = 0; s < 500; s++) {
      const rng = createPRNG(`loss-${s}`).fork('x');
      for (const d of [0, 0.5, 1]) {
        const df = deathFraction({ density01: d, rng });
        const ef = exodusFraction({ density01: d, rng });
        expect(df).toBeGreaterThanOrEqual(T.DEATH_FLOOR);
        expect(df).toBeLessThanOrEqual(T.DEATH_MAX);
        expect(ef).toBeGreaterThanOrEqual(T.EXODUS_FLOOR);
        expect(ef).toBeLessThanOrEqual(T.EXODUS_MAX);
      }
    }
  });

  it('the death toll is SIGNIFICANT but survivable — the exodus is the real depopulator', () => {
    expect(T.DEATH_MAX).toBeLessThan(T.EXODUS_MAX); // exodus > death
    expect(T.DEATH_MAX + T.EXODUS_MAX).toBeLessThan(1); // NO annihilation, even at both caps
  });

  it('resolvePopulationLoss conserves at the origin: deaths + exodus <= population, exact integers', () => {
    for (let s = 0; s < 300; s++) {
      const rng = createPRNG(`rpl-${s}`).fork('x');
      const population = 200 + s * 37;
      const { deaths, exodus } = resolvePopulationLoss({ population, density01: 1, rng });
      expect(Number.isInteger(deaths)).toBe(true);
      expect(Number.isInteger(exodus)).toBe(true);
      expect(deaths).toBeGreaterThanOrEqual(0);
      expect(exodus).toBeGreaterThanOrEqual(0);
      expect(deaths + exodus).toBeLessThan(population); // survivors remain — never annihilated
    }
  });

  it('exodus is a fraction of the SURVIVORS (applied after deaths)', () => {
    const { deaths, exodus, exodusFrac } = resolvePopulationLoss({ population: 10000, density01: 1, rng: constRng(0.5) });
    const survivors = 10000 - deaths;
    expect(exodus).toBe(Math.floor(survivors * exodusFrac));
  });
});
