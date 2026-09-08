/**
 * densityRoll.js — THE ROLL. §810's tier-gated political-density law, expressed
 * as ONE pure function over a keyed PRNG.
 *
 * `rollDensityPlan()` decides, for one settlement:
 *   · which powers hold a faction (R12 seat floor · R16 rival roll · R4 doubled niches)
 *   · how many named figures the settlement carries (§810.2 R10 stage one: MASS)
 *   · how that mass disperses across the factions (R10 stage two: DISPERSAL)
 *   · which rungs each roster occupies, and which stand vacant (R11)
 *   · the importance band every single figure is stamped with (§817-Q5)
 *
 * It writes nothing. The plan is a frozen description; `applyDensityLaw.js` is
 * the only writer. That split is deliberate — a pure roll can be driven ten
 * thousand times by a distribution-shape fixture without a pipeline in sight,
 * which is the only way to prove the believability envelope (§810.2b) holds
 * over the whole PATTERN SPACE rather than over the handful of shapes one
 * corpus happens to produce (the walker-census law).
 *
 * ── DETERMINISM ──────────────────────────────────────────────────────────────
 * Every stage draws from its OWN keyed fork (`rng.fork('sizing')`,
 * `fork('seats')`, `fork('dispersal')`, `fork('rungs').fork(factionKey)`), so a
 * later stage that changes its draw count can never move an earlier one, and a
 * faction added or removed from the roster cannot shift another faction's rung
 * rolls. This is `prng.js`'s fork contract and `assembleSettlement`'s
 * substream idiom, applied one level down.
 *
 * ── THE BANDS ARE NOT HERE ───────────────────────────────────────────────────
 * Not one number in this file. Every quantity is read from `densityBands.js`,
 * the tuning surface, so the owner's signature at the tuning pass is an edit to
 * that file alone (car D4). This module is band-AGNOSTIC by construction and
 * `tests/generators/densityDistributionShape.test.js` re-derives its
 * expectations from the same table rather than restating any figure.
 */

import {
  CONCENTRATION,
  PARTICULAR_TILTS,
  RIVAL_ROLL,
  VACANCY_WEIGHTS,
  bandsForTier,
  tierKey,
} from '../../domain/density/densityBands.js';
import {
  RUNG_KEYS,
  derivedRungOccupancy,
  importanceForRung,
} from '../../domain/density/densityRungs.js';
// ⚠ THE KERNEL'S CLAMP, NOT A LOCAL COPY. `clamp01` had been hand-rolled ~70 times across
// the engine with THREE divergent non-finite behaviours before `kernel/math.js` became the
// one home, and `tests/lint/clampPrimitiveBaseline.test.js` forbids a new local copy. Every
// value reaching it in this file is already finite — each of the five call sites passes
// through `num` first, or through `Math.max(1e-9, …)` — so the kernel's explicit non-finite
// policy (⇒ 0) is unreachable here and is a strictly safer floor, never a behaviour change.
import { clamp01 } from '../../kernel/math.js';

/** @typedef {{key: string, name?: string, category?: string, power?: number,
 *             isGoverning?: boolean, officeRoleKey?: string|null}} DensityPower */
/** @typedef {{prosperity01?: number, connectivity01?: number, war01?: number,
 *             corruption01?: number}} DensityParticulars */

const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/** The dyadic ladder the dispersal exponent is quantised onto: 1 << 6 = 64 steps. */
const CONCENTRATION_STEPS = 1 << CONCENTRATION.halvings;

/**
 * `base ** (steps / CONCENTRATION_STEPS)` — computed with ONLY operations the
 * ECMAScript spec pins to the bit.
 *
 * ⛔ WHY NOT `Math.pow`. `Math.pow` is implementation-APPROXIMATED: the spec permits
 * each engine its own result, so the same seed can produce a different dispersal on a
 * different engine — a same-seed fork across engines, which is exactly what THE PROMISE
 * forbids. `Math.sqrt` is required CORRECTLY ROUNDED and `*` is exactly specified, so a
 * chain of six halvings followed by exponentiation-by-squaring is bit-identical
 * everywhere. `tests/lint/transcendentalMathBaseline.test.js` enforces this repo-wide;
 * its declared-overrun ledger is monotone-down and at its ceiling, so reformulating was
 * the only path open — and it is the better one regardless.
 *
 * The cost is RESOLUTION, not shape: the exponent lands on one of 167 rungs across
 * [0, 2.6] instead of a continuum. §810.2 R10 asks that all-in-the-ruling-power,
 * spread-one-each "and everything between" stay reachable, and 167 rungs is a continuum
 * as far as a weighted deal over a settlement's named mass can tell.
 *
 * @param {number} base ≥ 1e-6 by construction at the one call site
 * @param {number} steps integer rungs on the 1/64 ladder, ≥ 0
 * @returns {number}
 */
function powBySteps(base, steps) {
  if (steps <= 0) return 1;
  let root = base;
  for (let i = 0; i < CONCENTRATION.halvings; i += 1) root = Math.sqrt(root);
  let out = 1;
  let acc = root;
  let e = steps;
  while (e > 0) {
    if (e % 2 === 1) out *= acc;
    acc *= acc;
    e = Math.floor(e / 2);
  }
  return out;
}

/**
 * A seeded roll inside a hard band, tilted by the settlement's particulars.
 *
 * ⭐ THE TILT MOVES THE CENTRE, NEVER THE EDGES. §810 R1 wants "a poor town [to]
 * roll like a village"; §810.2b makes the endpoints believability assertions
 * that variance "structurally cannot leave". Both hold here because the tilt is
 * applied to the uniform draw BEFORE it is mapped onto the band and the result
 * is clamped into it — so a tilt can never produce a value outside [min, max],
 * whatever a future retune sets it to.
 *
 * @param {{random: () => number}} rng
 * @param {{min: number, max: number}} band
 * @param {number} [tilt] signed, roughly -1..1
 * @returns {number} an integer in [band.min, band.max]
 */
export function rollInBand(rng, band, tilt = 0) {
  const min = Math.round(num(band?.min, 0));
  const max = Math.round(num(band?.max, min));
  if (max <= min) return min;
  const draw = clamp01(rng.random() + num(tilt, 0));
  return Math.min(max, Math.max(min, min + Math.round(draw * (max - min))));
}

/**
 * The signed band tilt the settlement's particulars produce. Each term's
 * magnitude lives in `PARTICULAR_TILTS` (the tuning surface); the SIGNS are the
 * owner's list read literally — prosperity and connectivity thicken politics,
 * war and corruption thin it.
 *
 * @param {DensityParticulars|null|undefined} particulars
 * @returns {number}
 */
export function particularTilt(particulars) {
  const p = particulars || {};
  const centred = v => clamp01(num(v, 0.5)) - 0.5; // 0.5 is "unremarkable"
  return (
    centred(p.prosperity01)   * PARTICULAR_TILTS.prosperity * 2
    + centred(p.connectivity01) * PARTICULAR_TILTS.connectivity * 2
    + centred(p.war01)          * PARTICULAR_TILTS.war * 2
    + centred(p.corruption01)   * PARTICULAR_TILTS.corruption * 2
  );
}

/**
 * The vacancy multiplier the particulars produce — §810.2's "a poor or
 * shrinking place runs understaffed; a prosperous one fills its benches".
 * Prosperity FILLS benches, so it lowers the vacancy weight.
 *
 * @param {DensityParticulars|null|undefined} particulars
 * @returns {number} a multiplier on the base vacancy weights
 */
export function vacancyMultiplier(particulars) {
  const p = particulars || {};
  const prosperity = clamp01(num(p.prosperity01, 0.5));
  const war = clamp01(num(p.war01, 0.5));
  const swing = (0.5 - prosperity) + (war - 0.5);
  return Math.max(0, 1 + swing * PARTICULAR_TILTS.vacancyTilt);
}

/**
 * Order powers the way every stage of the roll must see them: strongest first,
 * codepoint tiebreak. A byte-stable order is a determinism precondition — an
 * unstable sort here would make the same seed roll two different worlds on two
 * engines.
 *
 * @param {DensityPower[]} powers
 * @returns {DensityPower[]}
 */
function orderedPowers(powers) {
  return [...(powers || [])].sort(
    (a, b) => (num(b.power) - num(a.power))
      || (String(a.key) < String(b.key) ? -1 : String(a.key) > String(b.key) ? 1 : 0),
  );
}

/**
 * §810.4 R16 — THE RIVAL ROLL, WEIGHTED NOT GRANTED.
 *
 * A power out-influencing the ruling power does not automatically gain a
 * faction; it gains a STRONGER ROLL, the weight scaling with the influence gap,
 * open to ANY archetype ("not bounded in blood"). The roll can always decline —
 * "sometimes the out-influenced throne stands unchallenged; that too is a
 * world" — which is why `RIVAL_ROLL.cap` sits strictly below 1.
 *
 * @param {{random: () => number}} rng
 * @param {DensityPower[]} ordered strongest-first
 * @returns {{candidateKey: string|null, gap01: number, weight: number, taken: boolean}}
 */
export function rollRival(rng, ordered) {
  const ruling = ordered.find(p => p.isGoverning) || null;
  const top = ordered[0] || null;
  if (!ruling || !top || top.key === ruling.key) {
    return Object.freeze({ candidateKey: null, gap01: 0, weight: 0, taken: false });
  }
  const rulingPower = Math.max(1e-9, num(ruling.power, 0));
  const gap01 = clamp01((num(top.power, 0) - rulingPower) / Math.max(rulingPower, 1e-9));
  const weight = Math.min(RIVAL_ROLL.cap, RIVAL_ROLL.base + gap01 * RIVAL_ROLL.perGap);
  return Object.freeze({
    candidateKey: top.key, gap01, weight, taken: rng.random() < weight,
  });
}

/**
 * Choose which powers hold a faction, and which niches are DOUBLED.
 *
 * Constraint order, and the order matters:
 *   1. the ruling power is seated ALWAYS (R12's floor; R14 makes it
 *      undissolvable later, so it can never be the one the count squeezes out)
 *   2. the rival roll's winner, when it took (R16)
 *   3. the remainder by descending power until the rolled count is met
 *   4. §810 R4's doubled niches at city+ — a second faction contesting one
 *      power's niche, reusing the pantheon niche-contest pattern
 *
 * @param {{random: () => number, fork: (l: string) => any}} rng
 * @param {DensityPower[]} ordered
 * @param {number} factionCount
 * @param {number} doubledNiches
 * @param {{rivalBonusSeat?: number, seatCeiling?: number}} [limits]
 * @returns {{seated: DensityPower[], doubled: string[], rival: ReturnType<typeof rollRival>, bonusSeatTaken: boolean}}
 */
export function chooseSeats(rng, ordered, factionCount, doubledNiches, limits = {}) {
  const rival = rollRival(rng.fork('rival'), ordered);
  const ruling = ordered.find(p => p.isGoverning) || ordered[0] || null;
  // §810 R3's CONDITIONAL SEAT: the rival's win may buy ONE seat above the
  // rolled count where the tier's row grants it (thorp's literal "+1"), but
  // never past the seat ceiling — the atomic mint (R17) means a seat the mass
  // cannot crew is a seat that must not exist.
  const bonus = rival.taken ? Math.max(0, Math.round(num(limits.rivalBonusSeat, 0))) : 0;
  const ceiling = Number.isFinite(Number(limits.seatCeiling))
    ? Math.max(1, Number(limits.seatCeiling))
    : Infinity;
  const cap = Math.max(1, Math.min(factionCount + bonus, ceiling));
  const bonusSeatTaken = bonus > 0 && cap > factionCount;

  // ⭐ A DOUBLED NICHE CONSUMES A SEAT, IT DOES NOT ADD ONE. Register VII's city
  // row reads "5–8, INCL. 1–2 doubled niches" — the second claimant is one of
  // the tier's houses, not a bonus house. Budgeting for it here is what keeps
  // the total inside the believability envelope; the first end-to-end run
  // minted 11 houses at a metropolis whose envelope tops out at 10, because the
  // mints were added AFTER the count instead of taken out of it.
  const doubledBudget = Math.max(0, Math.min(doubledNiches, cap - 1));
  const distinctSeats = Math.max(1, cap - doubledBudget);

  /** @type {DensityPower[]} */
  const seated = [];
  const taken = new Set();
  const seat = (p) => {
    if (!p || taken.has(p.key) || seated.length >= distinctSeats) return;
    taken.add(p.key);
    seated.push(p);
  };
  seat(ruling);
  if (rival.taken) seat(ordered.find(p => p.key === rival.candidateKey));
  for (const p of ordered) seat(p);

  // Doubled niches (R4). Only powers already seated can have their niche
  // contested — a doubled niche is TWO claimants on ONE seat, not a back door
  // for an unseated power. Non-governing first: a contested throne is the
  // succession machinery's story (§810.7), not the density roll's.
  const doubled = [];
  const contestable = seated.filter(p => !p.isGoverning);
  const wanted = Math.max(0, Math.min(doubledBudget, contestable.length));
  const nicheRng = rng.fork('niches');
  const pool = [...contestable];
  for (let i = 0; i < wanted && pool.length; i += 1) {
    const idx = Math.floor(nicheRng.random() * pool.length);
    doubled.push(pool.splice(Math.min(idx, pool.length - 1), 1)[0].key);
  }
  doubled.sort();
  return { seated, doubled, rival, bonusSeatTaken };
}

/**
 * §810.2 R10 stage two — THE DISPERSAL. A seeded weighted partition of the
 * settlement's named mass across its factions.
 *
 * ⭐ EVERY FACTION RECEIVES ONE FIRST (R17's atomic mint: "a faction mints WITH
 * ≥1 NPC or does not mint at all"), and §817-Q1's office coverage folds in
 * exactly here — a faction whose archetype implies an office is guaranteed a
 * member BY THE PARTITION, so no post-roll appender is needed and the mass band
 * is never breached from outside. That is the cure for census consumer #6.
 *
 * ⭐ THE SEAT FLOOR IS CONSTRAINT-FIRST (R12): the first unit goes to the ruling
 * faction before any weighting runs, on every path, unless the floor is lifted.
 *
 * The remaining units are dealt one at a time by weight ∝ power^concentration,
 * with `concentration` itself rolled per settlement. That single rolled exponent
 * is what makes the pattern SPACE reachable: near 0 the deal is power-blind
 * (the spread-one-each end), near the ceiling it is winner-takes-most (the
 * all-in-the-ruling-power end), and every shape between is an ordinary draw.
 *
 * @param {{random: () => number}} rng
 * @param {DensityPower[]} seated
 * @param {number} mass
 * @param {number} concentration
 * @param {{min: number, max: number}} suite
 * @param {string|null} seatFloorKey the ruling faction key, or null when lifted
 * @returns {Map<string, number>}
 */
export function disperseMass(rng, seated, mass, concentration, suite, seatFloorKey) {
  /** @type {Map<string, number>} */
  const counts = new Map(seated.map(p => [p.key, 0]));
  if (!seated.length) return counts;

  // 1. The atomic mint: one each, before anything is weighted.
  for (const p of seated) counts.set(p.key, 1);
  let remaining = mass - seated.length;

  // 2. The seat floor's own unit, ahead of the weighting.
  if (seatFloorKey && counts.has(seatFloorKey) && remaining > 0) {
    counts.set(seatFloorKey, (counts.get(seatFloorKey) || 0) + 1);
    remaining -= 1;
  }

  // 3. Deal the rest by weight, honouring the suite ceiling while it can.
  // The exponent is quantised onto the dyadic ladder ONCE, outside the deal, so every
  // unit in one settlement is weighted by the same rung. See `powBySteps`: this is a
  // cross-engine replayability requirement, not a rounding convenience.
  const steps = Math.max(0, Math.round(num(concentration, 0) * CONCENTRATION_STEPS));
  const weightOf = p => powBySteps(Math.max(num(p.power, 1), 1e-6), steps);
  const cap = Math.max(1, Math.round(num(suite?.max, 3)));
  while (remaining > 0) {
    let pool = seated.filter(p => (counts.get(p.key) || 0) < cap);
    // The mass band is HARD and the suite is a preference: when every roster is
    // at its suite ceiling the ceiling yields, not the band (§810.2b — zero mass
    // outside the band). Recorded rather than silently clamped.
    if (!pool.length) pool = seated;
    const weights = pool.map(weightOf);
    const total = weights.reduce((s, w) => s + w, 0);
    let roll = rng.random() * total;
    let chosen = pool[pool.length - 1];
    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) { chosen = pool[i]; break; }
    }
    counts.set(chosen.key, (counts.get(chosen.key) || 0) + 1);
    remaining -= 1;
  }
  return counts;
}

/**
 * §810.2 R11 — roll one faction's RUNG OCCUPANCY and stamp its roster's bands.
 *
 * Any rung may be vacant at birth. The VACANCY-PLUS-YEARNER pattern is
 * deliberately over-weighted (`VACANCY_WEIGHTS.yearnerGivenHeadVacant`): a
 * vacant head with someone one band below, aching for it, is the best story the
 * generator can plant, and it costs no new machinery — the vacancy IS an open
 * window in the existing ladder and the yearner IS an ordinary figure placed
 * one band down.
 *
 * §817-Q3 is enforced here and only here: an OCCUPIED head rung always carries
 * the tier's head band, which `densityRungs` floors at notable.
 *
 * @param {{random: () => number}} rng
 * @param {string} tier
 * @param {number} size roster size (≥1, guaranteed by the atomic mint)
 * @param {number} vacancyMult
 * ⚠ THE TWO ADDITIONS BELOW ARE DOCUMENTATION OF EXISTING SHAPE, NOT NEW FIELDS.
 * `guaranteeYearner` is read at the throne (the §810.3 R13 floor-lift, where a
 * yearner is guaranteed rather than rolled) and `rolledVacancies` is returned
 * beside `occupancy` — both have been live since this function was written, but
 * neither was declared, so `tsc` reddened every caller that used them. Declaring
 * them cures four of the pre-existing `typecheck:ratchet` rows without moving a
 * runtime byte. `rolledVacancies` is deliberately distinct from `occupancy`:
 * occupancy is DERIVED from the stamped bands, this is what the roll actually
 * drew — the §817-Q5 two-definitions-of-one-word hazard, kept separate on purpose.
 *
 * @param {{requireHead?: boolean, guaranteeYearner?: boolean,
 *          officeRoleKey?: string|null}} [options]
 * @returns {{occupancy: {head: boolean, middle: boolean, lowest: boolean},
 *            rolledVacancies: {head: boolean, middle: boolean, lowest: boolean},
 *            members: Array<{rung: string, importance: string, isYearner: boolean,
 *                            officeRoleKey: string|null}>}}
 */
export function rollRoster(rng, tier, size, vacancyMult, options = {}) {
  const vac = k => Math.min(VACANCY_WEIGHTS.cap, VACANCY_WEIGHTS[k] * vacancyMult);
  // ⛔ THE DRAWS ARE UNCONDITIONAL AND IN A FIXED ORDER. Every rung rolls even
  // when `requireHead` will override it, so a ruling faction and an ordinary one
  // consume identical draw counts and the stream position of everything after
  // does not depend on which faction this is.
  const headRoll = rng.random();
  const middleRoll = rng.random();
  const lowestRoll = rng.random();
  const yearnerRoll = rng.random();

  const headVacant = options.requireHead ? false : headRoll < vac('head');
  const occupancy = {
    head: !headVacant,
    middle: !(middleRoll < vac('middle')),
    lowest: !(lowestRoll < vac('lowest')),
  };
  // ⭐ AT THE THRONE THE YEARNER IS GUARANTEED, NOT ROLLED. For an ordinary
  // house a vacant head with nobody reaching for it is a fine world (an empty
  // guild chair is just an empty chair). For the RULING seat under §810.3 R13's
  // typed floor-lift it is not: the ruling is that a rulerless settlement is
  // "born INTO a succession story, not into a null", with claimants pre-loaded.
  // A 3-in-4 yearner would leave one rulerless birth in four as exactly the null
  // R13 forbids.
  const wantsYearner = headVacant
    && (options.guaranteeYearner || yearnerRoll < VACANCY_WEIGHTS.yearnerGivenHeadVacant);

  /** @type {Array<{rung: string, importance: string, isYearner: boolean, officeRoleKey: string|null}>} */
  const members = [];
  const push = (rung, isYearner = false) => members.push({
    rung,
    importance: importanceForRung(isYearner ? 'yearner' : rung, tier),
    isYearner,
    // The office the head holds — §817-Q1's coverage, carried as a ROLL OUTPUT
    // rather than appended afterwards. Only the head holds the office.
    officeRoleKey: (!isYearner && rung === 'head') ? (options.officeRoleKey || null) : null,
  });

  if (occupancy.head) push('head');
  else if (wantsYearner) push('yearner', true);
  for (const rung of RUNG_KEYS) {
    if (rung === 'head') continue;
    if (members.length >= size) break;
    if (occupancy[/** @type {'middle'|'lowest'} */ (rung)]) push(rung);
  }
  // Any remaining allotment fills the lowest band — the settlement's ordinary
  // named figures. They are `minor` at small tiers by design (see the mapping
  // table in densityRungs.js), which is what keeps a thorp's ladder one rung.
  while (members.length < size) push('lowest');
  // The allotment is authoritative: a roster may not exceed the mass the
  // dispersal dealt it, whatever the occupancy rolled.
  members.length = Math.min(members.length, Math.max(1, size));

  // ⭐ OCCUPANCY IS DERIVED, NOT REPORTED — the §817-Q5 one-resolver law applied
  // to the plan itself. There is exactly ONE definition of "is this rung
  // occupied", it lives in densityRungs.js, and it reads nothing but the
  // stamped importance bands. The rolls above decide what gets PLACED; what is
  // OCCUPIED is then a fact about the roster, computed the same way the pulse
  // computes it.
  //
  // ⚠ THIS WAS A SECOND DEFINITION AND THE FIXTURE CAUGHT IT. An earlier draft
  // reported occupancy from the placed rung NAMES, which disagreed with the
  // band derivation wherever two rungs share a band (a thorp's middle and
  // lowest are both `minor`) or a rung was skipped but a senior one was not.
  // Two definitions of one word is exactly the class §817-Q5 exists to close.
  return {
    occupancy: derivedRungOccupancy(members, tier),
    rolledVacancies: Object.freeze({
      head: headVacant, middle: !occupancy.middle, lowest: !occupancy.lowest,
    }),
    members,
  };
}

/**
 * THE ROLL. One settlement's whole political density, decided.
 *
 * @param {{
 *   tier: string,
 *   rng: {random: () => number, fork: (l: string) => any},
 *   powers: DensityPower[],
 *   particulars?: DensityParticulars|null,
 *   floorLift?: {lifted?: boolean, stressor?: string|null}|null,
 *   seatAll?: boolean,
 *   massOverride?: number|null,
 * }} input
 *
 * ⭐ `seatAll` + `massOverride` are the RE-DERIVATION mode, and they exist for a
 * lifecycle reason. The law is rolled twice on every world: once at the
 * population seam, where it sizes the power roster and the named mass, and once
 * at the coherence seam (`enrichNpcCoherence`), where it disperses the roster
 * that actually exists — and that second seam is shared by full assembly AND by
 * NPC section-regen, so it must be IDEMPOTENT. Re-rolling the seat count there
 * would let a re-derivation want a different roster than the one in front of it
 * and strand a faction's members. In re-derivation mode the roster and the mass
 * are FACTS, not rolls: only the dispersal and the rungs are drawn, from the
 * same keyed streams, so a regen reproduces the same world.
 */
export function rollDensityPlan(input) {
  const tier = tierKey(input?.tier);
  const rng = input.rng;
  const bands = bandsForTier(tier);
  const particulars = input.particulars || null;
  const ordered = orderedPowers(input.powers);
  const lift = input.floorLift || null;
  const floorLifted = Boolean(lift?.lifted);

  // ── Stage 1: sizing ────────────────────────────────────────────────────────
  // ⛔ THE DRAWS ARE UNCONDITIONAL. Re-derivation mode overrides the RESULTS of
  // the sizing rolls, never their existence — so the sizing stream advances
  // identically on both passes and everything downstream of it stays aligned.
  const sizing = rng.fork('sizing');
  const tilt = particularTilt(particulars);
  const rolledFactionCount = rollInBand(sizing, bands.factions, tilt);
  const rolledMass = rollInBand(sizing, bands.mass, tilt);
  const concentration = CONCENTRATION.min
    + sizing.random() * Math.max(0, CONCENTRATION.max - CONCENTRATION.min);
  const doubledNiches = rollInBand(sizing, bands.doubledNiches, 0);

  const seatAll = Boolean(input.seatAll);
  // ⚠ `input.massOverride == null` is checked BEFORE the numeric test on
  // purpose: `Number(null)` is 0 and `Number.isFinite(0)` is true, so a bare
  // finite-check silently reads an ABSENT override as a mass of ZERO — which
  // collapses the faction ceiling to 1 and trims every settlement to a single
  // house. Measured that exact failure in the first end-to-end run.
  const massOverride = input.massOverride == null
    ? null
    : (Number.isFinite(Number(input.massOverride))
      ? Math.max(0, Math.round(Number(input.massOverride)))
      : null);
  let factionCount = seatAll ? Math.max(1, ordered.length) : rolledFactionCount;
  const namedMass = massOverride ?? rolledMass;

  // ⚠ FEASIBILITY, RESOLVED IN THE BAND'S FAVOUR. R17 forbids an NPC-less
  // faction and §810.2b forbids mass outside the band, so when a retune makes
  // the two bands incompatible the FACTION COUNT yields — never the mass. The
  // candidate ladder is feasible at every tier (thorp 1/1–3 … metropolis
  // 7–10/18–30); this guard exists so a future retune degrades honestly instead
  // of minting empty houses.
  const factionCeiling = Math.max(1, Math.min(namedMass, ordered.length || 1));
  const factionsSqueezed = factionCount > factionCeiling;
  factionCount = Math.min(factionCount, factionCeiling);

  // ── Stage 2: seats ─────────────────────────────────────────────────────────
  const { seated, doubled, rival, bonusSeatTaken } = chooseSeats(
    // ⛔ NO NICHE BUDGET IN RE-DERIVATION MODE. A doubled niche costs a seat
    // (see chooseSeats), and in re-derivation the roster is already final — its
    // doubled claimants are records in front of us. Budgeting for them again
    // would hold back seats the roster actually holds, and the houses that fell
    // outside the reduced budget would be left UNCREWED, which is precisely the
    // NPC-less faction R17 declares unrepresentable. Measured: it emptied
    // Religious Authorities at a city and two houses at a metropolis.
    rng.fork('seats'), ordered, factionCount, seatAll ? 0 : doubledNiches,
    {
      // In re-derivation mode the roster is a fact: no bonus seat may appear
      // that the roster in front of us does not already hold.
      rivalBonusSeat: seatAll ? 0 : (bands.rivalBonusSeat || 0),
      seatCeiling: factionCeiling,
    },
  );
  const rulingKey = (seated.find(p => p.isGoverning) || seated[0] || null)?.key || null;

  // ── Stage 3: dispersal ─────────────────────────────────────────────────────
  const counts = disperseMass(
    rng.fork('dispersal'), seated, namedMass, concentration, bands.suite,
    floorLifted ? null : rulingKey,
  );

  // ── Stage 4: rungs ─────────────────────────────────────────────────────────
  const rungRng = rng.fork('rungs');
  const vacancyMult = vacancyMultiplier(particulars);
  const factions = seated.map((p) => {
    const size = counts.get(p.key) || 1;
    // ⭐ §810.3 R12/R13: the ruling faction's head is OCCUPIED unless the floor
    // is lifted — "someone has to run something". Under the typed missing-seat
    // stressor the head stands vacant and the yearner roll seeds claimants at
    // the throne itself, which is R13's succession-story-not-a-null.
    const isRuling = p.key === rulingKey;
    const requireHead = !floorLifted && isRuling;
    const rolled = rollRoster(
      rungRng.fork(p.key), tier, size, vacancyMult,
      {
        requireHead,
        guaranteeYearner: floorLifted && isRuling,
        officeRoleKey: p.officeRoleKey || null,
      },
    );
    return Object.freeze({
      key: p.key,
      name: p.name ?? p.key,
      category: p.category ?? 'other',
      power: num(p.power, 0),
      isGoverning: Boolean(p.isGoverning),
      isDoubledNiche: doubled.includes(p.key),
      occupancy: rolled.occupancy,
      rolledVacancies: rolled.rolledVacancies,
      members: Object.freeze(rolled.members.map(m => Object.freeze({ ...m }))),
    });
  });

  const placedMass = factions.reduce((s, f) => s + f.members.length, 0);
  return Object.freeze({
    lawVersion: 2,
    tier,
    bands,
    // The number of HOUSES the settlement will hold: the distinct powers seated
    // plus each doubled niche's second claimant. This — not the seated-power
    // count — is what the faction envelope governs.
    factionCount: factions.length + doubled.length,
    seatedPowers: factions.length,
    factionsSqueezed,
    bonusSeatTaken,
    namedMass,
    placedMass,
    concentration,
    doubledNiches: Object.freeze([...doubled]),
    rival: Object.freeze({ ...rival }),
    seatFloor: Object.freeze({
      factionKey: floorLifted ? null : rulingKey,
      lifted: floorLifted,
      stressor: floorLifted ? (lift?.stressor || null) : null,
    }),
    factions: Object.freeze(factions),
  });
}
