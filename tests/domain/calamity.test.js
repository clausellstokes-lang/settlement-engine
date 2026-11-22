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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CALAMITY_TUNING,
  calamityEnabled,
  annualHazard,
  rollStrike,
  withinCooldown,
  disasterTypeFor,
  disasterFlavorLabel,
  stampTitle,
  isStrikeTarget,
  selectStrikeTargets,
  planInstitutionFate,
  deathFraction,
  exodusFraction,
  resolvePopulationLoss,
  exposureMultiplier,
  normalizeExposure,
  EXPOSURE_TUNING,
  severityScaleFor,
  severityKFactorFor,
  CALAMITY_SEVERITY_BANDS,
} from '../../src/domain/spatial/calamity.js';
import { strikeCapForTier } from '../../src/domain/worldPulse/calamityKernel.js';
import {
  REQUIRED_CONTRACT_FLAG_KEYS,
  hasOwnRequiredContract,
} from '../../src/domain/generationOwnership.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';

const T = CALAMITY_TUNING;
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));
const constRng = (v) => ({ random: () => v });

// ── The PARITY RATCHET's generated shape product ─────────────────────────────
// The full cartesian product of the law's OWN exported flag keys against a value
// domain that covers every way a persisted record can carry (or fail to carry) a
// flag: absent, the two booleans, a truthy non-boolean, a falsy non-boolean.
// Each flag shape is then crossed with the cascade `source` label — the one the
// law deliberately IGNORES — so the product also proves the mirror does not
// quietly start reading it. 5^2 x 2 = 50 shapes today; a new clause in the law
// (and its key) multiplies this by 5 with no edit here.
const ABSENT = Symbol('absent');
const FLAG_VALUE_DOMAIN = [ABSENT, true, false, 'yes', 0];
const SOURCE_VARIANTS = [{}, { source: 'cascade' }];

function flagShapeProduct(keys) {
  let shapes = [{}];
  for (const key of keys) {
    shapes = shapes.flatMap((shape) => FLAG_VALUE_DOMAIN.map(
      (value) => (value === ABSENT ? { ...shape } : { ...shape, [key]: value }),
    ));
  }
  return shapes;
}

const PARITY_SHAPES = flagShapeProduct(REQUIRED_CONTRACT_FLAG_KEYS)
  .flatMap((flags) => SOURCE_VARIANTS.map((source) => ({ ...flags, ...source })));

/** Failure label that survives absent keys (JSON.stringify drops nothing here). */
const describeShape = (shape) => JSON.stringify(shape);

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
    let eligibleRolls = 0;
    for (let s = 0; s < SEEDS; s++) {
      const master = createPRNG(`calamity-soak-${s}`);
      // Per-settlement last-stamp year (cooldown state, exactly as the kernel reads it).
      const lastStamp = new Array(N).fill(null);
      for (let year = 1; year <= YEARS; year++) {
        for (let i = 0; i < N; i++) {
          if (withinCooldown(lastStamp[i], year)) continue;
          eligibleRolls += 1;
          const rng = master.fork(`disaster:s${i}:${year}`);
          if (rollStrike({ rng, hazard })) { totalStrikes += 1; lastStamp[i] = year; }
        }
      }
    }
    // Realized realm interval = total realm-years / total realm-strikes.
    const realmYears = YEARS * SEEDS;
    const interval = realmYears / totalStrikes;
    const strikeFloor = readEnvelope(ENVELOPES, 'calamity.strikeCount.floor');
    const strikeCeiling = readEnvelope(ENVELOPES, 'calamity.strikeCount.ceiling');
    expect(eligibleRolls).toBe(strikeFloor.n);
    expect(strikeCeiling.n).toBe(eligibleRolls);
    expect(totalStrikes).toBeGreaterThan(0);
    expect(totalStrikes).toBeGreaterThanOrEqual(strikeFloor.bound);
    expect(totalStrikes).toBeLessThanOrEqual(strikeCeiling.bound);
    expect(interval).toBeGreaterThanOrEqual(10);
    expect(interval).toBeLessThanOrEqual(20);
  });
});

describe('M11b calamity — terrain FLAVOR-HINT table + the BUCKET-NEUTRAL stamp (stage 0)', () => {
  it('maps each named terrain to its cosmetic flavor hint (a suggestion, not a mechanic)', () => {
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

  it('the ENGINE stamp title speaks the BUCKET, never a disaster kind (ONE-TIME SHIFT, owner-ruled)', () => {
    expect(stampTitle('Thornwood', 12)).toBe('The Great Calamity of Thornwood, year 12');
    expect(stampTitle('Rivermouth', 7)).toBe('The Great Calamity of Rivermouth, year 7');
  });

  it('the flavor label is a DM SUGGESTION only — offered separately from the engine title', () => {
    expect(disasterFlavorLabel('fire')).toBe('Great Fire');
    expect(disasterFlavorLabel('flood')).toBe('Great Flood');
    expect(disasterFlavorLabel('quake')).toBe('Great Quake');
    expect(disasterFlavorLabel('storm')).toBe('Great Storm');
    expect(disasterFlavorLabel('nonsense')).toBe('Great Calamity'); // unknown ⇒ bucket
    expect(disasterFlavorLabel(null)).toBe('Great Calamity');
  });
});

describe('M11b calamity — EXPOSURE LOADING (stage 0: redistributes risk, never the total)', () => {
  it('the raw exposure multiplier is bounded [MULT_MIN, MULT_MAX] over every terrain + dwell', () => {
    const terrains = ['riverside', 'coastal', 'desert', 'mountain', 'forest', 'hills', 'plains', 'unknown', ''];
    for (const terrain of terrains) {
      for (const priorStrikes of [0, 1, 3, 8, 50]) {
        const m = exposureMultiplier({ terrain, priorStrikes });
        expect(m).toBeGreaterThanOrEqual(EXPOSURE_TUNING.MULT_MIN);
        expect(m).toBeLessThanOrEqual(EXPOSURE_TUNING.MULT_MAX);
      }
    }
  });

  it('hazard-prone terrain (riverside) is more exposed than sheltered plains', () => {
    expect(exposureMultiplier({ terrain: 'riverside', priorStrikes: 0 }))
      .toBeGreaterThan(exposureMultiplier({ terrain: 'plains', priorStrikes: 0 }));
  });

  it('prior calamities nudge exposure up (recurring-hazard ground) — bounded by the dwell cap', () => {
    const a = exposureMultiplier({ terrain: 'plains', priorStrikes: 0 });
    const b = exposureMultiplier({ terrain: 'plains', priorStrikes: 5 });
    expect(b).toBeGreaterThan(a);
    // The dwell term is capped: 100 priors is no worse than the cap allows.
    const capped = exposureMultiplier({ terrain: 'plains', priorStrikes: 100 });
    expect(capped).toBeLessThanOrEqual(EXPOSURE_TUNING.MULT_MAX);
  });

  it('THE NORMALIZATION PIN: the realm-MEAN exposure-loaded hazard equals annualHazard exactly', () => {
    // A realm of mixed terrains + dwell histories.
    const realm = [
      { terrain: 'riverside', priorStrikes: 2 }, { terrain: 'plains', priorStrikes: 0 },
      { terrain: 'coastal', priorStrikes: 1 }, { terrain: 'mountain', priorStrikes: 0 },
      { terrain: 'forest', priorStrikes: 3 }, { terrain: 'desert', priorStrikes: 0 },
      { terrain: 'hills', priorStrikes: 0 }, { terrain: 'plains', priorStrikes: 5 },
    ];
    const N = realm.length;
    const base = annualHazard(N);
    const factors = normalizeExposure(realm.map(exposureMultiplier));
    const hazards = factors.map((f) => base * f);
    const meanHazard = hazards.reduce((a, b) => a + b, 0) / N;
    // The realm-MEAN hazard is EXACTLY the uniform base (exposure only redistributes).
    expect(meanHazard).toBeCloseTo(base, 12);
    // And the realm-summed hazard is still ≈ 1/HAZARD_YEARS, size-free.
    expect(hazards.reduce((a, b) => a + b, 0)).toBeCloseTo(1 / T.HAZARD_YEARS, 12);
    // Redistribution is REAL: the riverside seat carries more risk than the sheltered one.
    expect(hazards[0]).toBeGreaterThan(hazards[1]);
  });

  it('normalizeExposure is total on empties + all-equal sets (uniform fallback)', () => {
    expect(normalizeExposure([])).toEqual([]);
    expect(normalizeExposure([1, 1, 1])).toEqual([1, 1, 1]);
    expect(normalizeExposure([0, 0])).toEqual([1, 1]); // degenerate ⇒ uniform
    // A single-terrain realm normalizes every factor to 1 (mean == itself).
    const one = normalizeExposure([1.2, 1.2, 1.2]);
    for (const f of one) expect(f).toBeCloseTo(1, 12);
  });
});

describe('M11b calamity — FORCE severity banding (stage 0: force ≡ organic at the natural band)', () => {
  it('the natural "moderate" band is EXACTLY scale 1.0 + K-factor 1.0 (force ≡ organic)', () => {
    expect(severityScaleFor('moderate')).toBe(1);
    expect(severityKFactorFor('moderate')).toBe(1);
    // An absent/unknown band also resolves to the natural 1.0 (the organic path).
    expect(severityScaleFor(null)).toBe(1);
    expect(severityKFactorFor(undefined)).toBe(1);
    expect(severityScaleFor('nonsense')).toBe(1);
  });

  it('the bands scale death/exodus WITHIN the frozen walls over every seed', () => {
    for (const band of Object.keys(CALAMITY_SEVERITY_BANDS)) {
      const scale = severityScaleFor(band);
      for (let s = 0; s < 200; s++) {
        const rng = createPRNG(`sev-${band}-${s}`).fork('x');
        const df = deathFraction({ density01: 1, rng, severityScale: scale });
        const ef = exodusFraction({ density01: 1, rng, severityScale: scale });
        expect(df).toBeGreaterThanOrEqual(T.DEATH_FLOOR);
        expect(df).toBeLessThanOrEqual(T.DEATH_MAX);
        expect(ef).toBeGreaterThanOrEqual(T.EXODUS_FLOOR);
        expect(ef).toBeLessThanOrEqual(T.EXODUS_MAX);
      }
    }
  });

  it('a NO-severity (organic) draw is byte-identical to the moderate-band draw for the same seed', () => {
    for (let s = 0; s < 100; s++) {
      const seedKey = `org-eq-${s}`;
      const organic = deathFraction({ density01: 0.7, rng: createPRNG(seedKey).fork('x') });
      const moderate = deathFraction({ density01: 0.7, rng: createPRNG(seedKey).fork('x'), severityScale: severityScaleFor('moderate') });
      expect(organic).toBe(moderate);
    }
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

  it('a PERSISTED pre-fix cascade seat is strikeable — the borrowed flag buys no immunity', () => {
    // `required` is scoped to the tier whose catalog declares it. The cascade
    // seats a BORROWED lower-tier def at a higher tier; before the 2026-07-26
    // producer fix it carried the source tier's flag forward, and every
    // settlement saved back then still has that on disk. Reader-side scoping
    // retires the lie in place — no migration touches the saved record.
    const persistedPreFix = {
      name: 'Town watch', category: 'Defense', status: 'active',
      source: 'cascade', cascadeAdded: true, required: true,
    };
    expect(isStrikeTarget(persistedPreFix)).toBe(true);
    // Post-fix seats write the truth; still strikeable, for the ordinary reason.
    expect(isStrikeTarget({ ...persistedPreFix, required: false })).toBe(true);
    // The hard bound survives where the contract is genuinely this record's own.
    expect(isStrikeTarget({ name: 'Town watch', category: 'Defense', required: true })).toBe(false);
    // …and the selection boundary agrees, not just the predicate.
    expect(selectStrikeTargets({
      institutions: [persistedPreFix, { name: 'Town hall', required: true }, { name: 'Inn' }],
      k: 99,
      rng: constRng(0.5),
    })).toEqual(['Inn', 'Town watch']);
  });

  it('PARITY RATCHET: the import-free mirror agrees with the law over the GENERATED shape product', () => {
    // calamity.js is an IMPORT-FREE PURE LEAF (display/realmManifest reach it from
    // outside the pulse chunk), so it MIRRORS hasOwnRequiredContract inline rather
    // than importing it. This ratchet is what keeps the mirror honest: if the law
    // gains a clause the mirror does not, the two disagree here and this reds.
    //
    // The matrix is GENERATED, not curated. A hand-written shape list rots — the
    // law grows a clause, nobody remembers to add the rows that would expose it,
    // and the ratchet passes over a real drift. Instead the product is driven by
    // the law's OWN exported key list (REQUIRED_CONTRACT_FLAG_KEYS): every key it
    // publishes is crossed against the full value domain, so adding a clause to
    // the law and its key together AUTOMATICALLY widens this proof.
    expect(PARITY_SHAPES.length).toBeGreaterThanOrEqual(50);
    let protectedShapes = 0;
    let eligibleShapes = 0;
    for (const shape of PARITY_SHAPES) {
      const inst = { name: 'Probe', status: 'active', ...shape };
      const ownContract = hasOwnRequiredContract(inst);
      // isStrikeTarget rejects EXACTLY when the law says the contract is its own
      // (every probe here is a live, named institution, so nothing else can reject it).
      expect(isStrikeTarget(inst), describeShape(shape)).toBe(!ownContract);
      if (ownContract) protectedShapes += 1;
      else eligibleShapes += 1;
    }
    // ANTI-VACUITY: a product that landed on one side of the law would agree with
    // any mirror at all. Both verdicts must actually occur.
    expect(protectedShapes).toBeGreaterThan(0);
    expect(eligibleShapes).toBeGreaterThan(0);
  });

  it('GUARD THE GUARD: the law publishes the exact keys the product enumerates', () => {
    // The generated matrix is only as wide as the law's key list. If that list is
    // emptied or trimmed, the ratchet above would silently shrink to nothing while
    // still passing — so pin the list itself.
    expect(REQUIRED_CONTRACT_FLAG_KEYS.length).toBeGreaterThanOrEqual(2);
    expect(REQUIRED_CONTRACT_FLAG_KEYS).toContain('required');
    expect(REQUIRED_CONTRACT_FLAG_KEYS).toContain('cascadeAdded');
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
