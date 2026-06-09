/**
 * domain/defenseLedger.js — the canonical conserved defense quantities for a settlement.
 *
 * P3.3b Stage 1b. Mirrors foodLedger: defenseGenerator already computes the five scored
 * defense dimensions + a numeric readiness and persists them on `settlement.defenseProfile`.
 * The drift it cures is the same parallel-model pattern food had — capacityModel.deriveDefense
 * read the military score AND separately re-counted the fortification institutions that score
 * already folds in (a double-count), and several lenses reach into `defenseProfile.scores.*`
 * directly with their own defaults.
 *
 * This is the ONE read-point for the conserved defense quantities. Every defense lens — the
 * capacity model, the causal substrate, the dossier — should read `defenseLedger(settlement)`
 * and interpret the SAME numbers.
 *
 * Pure; defensive; returns neutral defaults (with `present: false`) for an un-generated /
 * partial settlement so callers never see undefined.
 */

/**
 * @typedef {Object} DefenseLedger
 * @property {number} military       0..100 conventional force (walls + garrison weighted highest)
 * @property {number} monster        0..100 defense against the wilds
 * @property {number} internal       0..100 internal security / public order
 * @property {number} economic       0..100 siege logistics / economic resilience
 * @property {number} magical        0..100 arcane defense
 * @property {number} readinessScore 0..100 overall readiness (avg of dims +/- tier/threat)
 * @property {boolean} magicDependency  defense leans on magic that fails in a dead-magic world
 * @property {boolean} present       true once a real defenseProfile.scores backed it
 */

/** @type {DefenseLedger} */
const NEUTRAL = Object.freeze({
  military: 50,
  monster: 50,
  internal: 50,
  economic: 50,
  magical: 50,
  readinessScore: 50,
  magicDependency: false,
  present: false,
});

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v, d) => (isNum(v) ? v : d);

/**
 * @param {Object} settlement
 * @returns {DefenseLedger}
 */
export function defenseLedger(settlement) {
  const dp = settlement?.defenseProfile || null;
  const sc = dp && typeof dp === 'object' ? dp.scores : null;
  if (!sc || typeof sc !== 'object') return NEUTRAL;
  return {
    military:        num(sc.military, 50),
    monster:         num(sc.monster, 50),
    internal:        num(sc.internal, 50),
    economic:        num(sc.economic, 50),
    magical:         num(sc.magical, 50),
    readinessScore:  num(dp.readiness?.score, 50),
    magicDependency: dp.magicDependency === true,
    present: true,
  };
}
