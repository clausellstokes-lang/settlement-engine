/**
 * demographicsLadder.js — WAVE P4 (THE WORLD'S HAND), THE VIABILITY LADDER.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §7b is this file's contract.
 *
 * "Nonzero population and functioning-settlement status are DIFFERENT facts. A ruined
 * city holding one named hermit does not trade, field armies, or emit institutional
 * output." The named soul counts toward population (law 3, the owner's law) while the
 * PLACE has ceased to function, and both laws hold at once because they answer
 * different questions. This file is the grade that separates them.
 *
 * FIVE RUNGS, ONE CLOSED VOCABULARY, FIRST MATCH WINS:
 *
 *   viable            the place works
 *   failing           the ground and the granaries together can no longer support the
 *                     grade the settlement wears, but its people are still there
 *   evacuating        the same, and the head count has already fallen through the
 *                     tier's own floor: the leaving has started
 *   remnant_occupied  the terminal lane has closed the settlement and somebody remains
 *   remnant_empty     the terminal lane has closed it and nobody does
 *
 * IT IS A READ, NEVER A WRITER, AND NEVER A SECOND ONE. Wave P1a already replaced the
 * terminal lane's thorp-tier precondition with a head-count read
 * (settlementLifecycleFirstClass.js: `popToTier(pop) === 'thorp'` under the same flag);
 * this file NAMES that rung rather than opening a parallel descent. Nothing here
 * demotes a tier, closes a settlement, or moves a person: tier drift remains the ONE
 * transition writer and the terminal lane remains the ONE closer. The ladder answers
 * questions those lanes and the movers ASK.
 *
 * THE MOVER GATE (K1's precedent, one level up). K1's institution status system gates
 * BUILDINGS on `liveInstitutions`; this ladder gates the SETTLEMENT itself. The permit
 * table below is closed on both axes — five grades times six mover kinds, every cell
 * authored — so a new mover kind cannot silently default to permitted.
 *
 * WHY `failing` STILL TRADES AND STILL LEVIES. A place in trouble is not a place that
 * has stopped: a failing town that could neither trade nor field a levy could never
 * recover, and acceptance claim 9 requires that low-population settlements RECOVER,
 * demote, or die rather than all dying. The refusals begin at `evacuating`, where the
 * people are already leaving, and become total at the remnant rungs.
 *
 * FINITE SEMANTICS: the grade is a word from a closed vocabulary, the permit is a
 * boolean from a closed table, and no float crosses this module's surface.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicsWorldsHand.test.js
 */

import { POPULATION_RANGES } from '../../data/constants.js';
import { foodDeficit01Of, tierViabilityOf } from './demographicsRates.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */

/** The closed grade vocabulary, ordered best rung first. @type {ReadonlyArray<string>} */
export const VIABILITY_GRADES = Object.freeze([
  'viable',
  'failing',
  'evacuating',
  'remnant_occupied',
  'remnant_empty',
]);

/** The closed mover-kind vocabulary the permit table answers for.
 *  @type {ReadonlyArray<string>} */
export const LADDER_MOVER_KINDS = Object.freeze([
  'destination',   // may people be sent HERE (the P2 homeostat's destination menu)
  'founding',      // may this place commit to seeding a satellite (the P3 valve)
  'promotion',     // may this place climb the tier ladder
  'levy',          // may this place field an army
  'institution',   // does this place emit institutional output
  'trade',         // does this place trade
]);

/**
 * THE PERMIT TABLE (design §7b: "with movers gated on the grade"). Closed on both
 * axes; a walker-style totality pin asserts every grade answers every kind, so a new
 * mover kind cannot be silently permitted by an absent row.
 * @type {Readonly<Record<string, Readonly<Record<string, boolean>>>>}
 */
export const LADDER_MOVER_PERMITS = Object.freeze({
  viable: Object.freeze({
    destination: true, founding: true, promotion: true, levy: true, institution: true, trade: true,
  }),
  // In trouble, not stopped: it may still be sent people (that is how it recovers) and
  // it still trades and levies. It may not START anything: no founding, no ascension.
  failing: Object.freeze({
    destination: true, founding: false, promotion: false, levy: true, institution: true, trade: true,
  }),
  // The leaving has begun. Nobody is sent here, nothing is founded from here, and the
  // place can no longer put a levy in the field, but its remaining institutions still
  // speak and its market still opens while anyone is left to stand in it.
  evacuating: Object.freeze({
    destination: false, founding: false, promotion: false, levy: false, institution: true, trade: true,
  }),
  // The hermit in the ruin. §7b names these three refusals verbatim.
  remnant_occupied: Object.freeze({
    destination: false, founding: false, promotion: false, levy: false, institution: false, trade: false,
  }),
  remnant_empty: Object.freeze({
    destination: false, founding: false, promotion: false, levy: false, institution: false, trade: false,
  }),
});

/** The bands the grade reads. Owner-retunable at the soak redo (design §10). */
export const LADDER_TUNING = Object.freeze({
  // A food deficit this deep, in a settlement already past its own bound, is failing
  // even when the tier floor has not yet been crossed: the granaries are the wall and
  // the wall has been breached.
  FAILING_DEFICIT: 0.25,
  // At or below the tier's authored population minimum, a nonviable settlement is not
  // merely in trouble; the census has already followed the granaries down.
  EVACUATING_AT_TIER_FLOOR: true,
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/**
 * Is this settlement record one the terminal lane has already closed? Read on BOTH
 * the live record and its config the way every other consumer in the tree does, because
 * a regeneration re-derives the live field from the config half.
 * @param {DemoSettlement|null|undefined} settlement @returns {boolean}
 */
export function isRemnant(settlement) {
  const raw = asObject(settlement);
  return Boolean(raw.lifecycleStatus || asObject(raw.config).lifecycleStatus);
}

/**
 * @typedef {Object} ViabilityGrade
 * @property {string} grade      a member of VIABILITY_GRADES
 * @property {string} reason     the in-world clause naming why (never a number)
 * @property {number} population the head count the grade was read at
 * @property {number} bound      min(K_food, D_tier) at the time of reading
 * @property {number} tierFloor  the authored population minimum of the worn tier
 * @property {boolean} nonviable the bound sits below that floor
 */

/**
 * THE GRADE PREDICATE, AND THE ONLY COPY OF IT. Every caller either passes a settlement
 * to `viabilityGradeOf` (which reads the physics and then calls this) or, when it is
 * already holding the same readings, calls this directly rather than re-reading the
 * granaries. One definition, two entry points, no chance of the plan lane and the
 * terminal lane disagreeing about what `failing` means.
 *
 * @param {{ population: number, bound: number, tierFloor: number, foodKnown: boolean,
 *   deficit01?: number, remnant?: boolean }} reading
 * @returns {ViabilityGrade}
 */
export function gradeFromReading(reading) {
  const r = asObject(reading);
  const population = Math.max(0, Math.round(num(r.population, 0)));
  const bound = Math.max(0, Math.round(num(r.bound, 0)));
  const tierFloor = Math.max(0, Math.round(num(r.tierFloor, 0)));
  // UNKNOWN FOOD IS NEVER NONVIABLE (the tierViabilityOf refusal, kept identical): an
  // absent reading must never be evidence of failure.
  const nonviable = r.foodKnown === true && tierFloor > 0 && bound < tierFloor;
  const base = { population, bound, tierFloor, nonviable };

  if (r.remnant === true) {
    return population > 0
      ? { ...base, grade: 'remnant_occupied', reason: 'a few souls still keep the ruin' }
      : { ...base, grade: 'remnant_empty', reason: 'the stones stand and nobody does' };
  }
  if (nonviable && population <= tierFloor) {
    return { ...base, grade: 'evacuating', reason: 'the place can no longer hold the town it was, and the leaving has started' };
  }
  if (nonviable) {
    return { ...base, grade: 'failing', reason: 'the fields and the ground together no longer support a settlement of this grade' };
  }
  if (num(r.deficit01, 0) >= LADDER_TUNING.FAILING_DEFICIT && population > bound) {
    return { ...base, grade: 'failing', reason: 'there are more mouths here than the harvest answers' };
  }
  return { ...base, grade: 'viable', reason: 'the place works' };
}

/**
 * THE GRADE (design §7b), read from a settlement record. Total: an ungenerated
 * settlement with no food physics reads `viable`.
 *
 * @param {DemoSettlement|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {ViabilityGrade}
 */
export function viabilityGradeOf(settlement, worldState, settlementId) {
  const viability = tierViabilityOf(settlement, worldState, String(settlementId));
  return gradeFromReading({
    population: Math.max(0, Math.round(num(asObject(settlement).population, 0))),
    bound: viability.bound,
    tierFloor: viability.tierFloor,
    foodKnown: viability.known === true,
    deficit01: foodDeficit01Of(settlement),
    remnant: isRemnant(settlement),
  });
}

/**
 * MAY A MOVER OF THIS KIND ACT ON A SETTLEMENT AT THIS GRADE? Total and CLOSED: an
 * unknown grade or an unknown kind reads FALSE rather than defaulting open, so a
 * typo can only ever make the engine quieter, never louder.
 * @param {string} grade @param {string} kind @returns {boolean}
 */
export function moverPermitted(grade, kind) {
  const row = /** @type {Record<string, Record<string, boolean>>} */ (LADDER_MOVER_PERMITS)[String(grade)];
  if (!row) return false;
  return row[String(kind)] === true;
}

/**
 * The census the realm observation reports: how many settlements stand at each rung.
 * Every grade is present in the result with a zero, so a reader can never mistake an
 * absent key for a rung that does not exist.
 * @param {ReadonlyArray<{ id?: string|number, settlement?: DemoSettlement|null }>} members
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @returns {Record<string, number>}
 */
export function ladderCensus(members, worldState) {
  /** @type {Record<string, number>} */
  const census = {};
  for (const grade of VIABILITY_GRADES) census[grade] = 0;
  for (const member of Array.isArray(members) ? members : []) {
    const id = asObject(member).id != null ? String(asObject(member).id) : '';
    if (!id) continue;
    const settlement = /** @type {DemoSettlement|null} */ (asObject(member).settlement || null);
    census[viabilityGradeOf(settlement, worldState, id).grade] += 1;
  }
  return census;
}

/** The authored population minimum of a tier, exported so the pins read the same
 *  table the grade does rather than restating it.
 *  @param {string} tier @returns {number} */
export function tierFloorOf(tier) {
  return num(/** @type {Record<string, { min?: number }>} */ (POPULATION_RANGES)[String(tier)]?.min, 0);
}
