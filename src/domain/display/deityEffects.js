/**
 * domain/display/deityEffects.js — the SINGLE SOURCE describing "what each deity
 * axis does" to the living-world substrate.
 *
 * The four deity authoring axes (good/evil · warlike/peacelike · major/minor/cult
 * · lawful/chaotic) couple into five engine systems, today scattered across:
 *   - corruption.js     DEITY_CORRUPTION_TUNING  — good/evil → corruption direction+magnitude
 *   - corruption.js     DEITY_LAW_TUNING         — lawful/chaotic → law_order + corruption-tolerance
 *   - disposition.js    DEITY_TEMPER_SIGN, AGGRESSION_TUNING.W_DEITY — warlike/peacelike → aggression
 *   - causalState.js    DEITY_RANK_AUTHORITY     — major/minor/cult → religious_authority lift
 *   - magicProfile.js   DEITY_MAGIC_LEGALITY_STEPS, deityIsRegulatory — major (+ warlike/evil) → magic legality
 *
 * This module RE-EXPORTS those engine constants (it does not re-tune them) so the
 * Compendium effect-preview and the dossier Faith-Effects surface read the SAME
 * numbers the engine applies — the determinism/coupling tests prove equality
 * (tests/domain/display/deityEffects.test.js). A re-tune in any engine file flows
 * here automatically; a hand-copied number would silently drift, which is exactly
 * what this seam prevents.
 *
 * PRESENTATION ONLY. Pure, rng-free, no mutation, no store/React. A deity-free
 * settlement (no embedded snapshot) yields an EMPTY effect list — the dormancy
 * guarantee — so a non-religion save renders nothing extra.
 *
 * The deity snapshot shape (the embedded `config.primaryDeitySnapshot`) carries
 * `alignmentAxis` (good|evil|neutral), `temperamentAxis` (warlike|peacelike|
 * neutral), `rankAxis` (major|minor|cult), and `lawAxis` (lawful|chaotic|
 * neutral). We read the `*Axis` fields — NEVER a legacy `tier`/`alignment` —
 * matching the engine couplings. A legacy 3-axis deity has no `lawAxis` ⇒ no law
 * effect (back-compat).
 */

import { DEITY_CORRUPTION_TUNING, DEITY_LAW_TUNING } from '../corruption.js';
import { DEITY_TEMPER_SIGN, AGGRESSION_TUNING } from '../worldPulse/disposition.js';
import { DEITY_RANK_AUTHORITY } from '../causalState.js';
import { DEITY_MAGIC_LEGALITY_STEPS, deityIsRegulatory } from '../magicProfile.js';

// Re-export the engine couplings verbatim — this module is the named single
// source the UI imports, while the values remain owned by the engine.
export {
  DEITY_CORRUPTION_TUNING,
  DEITY_LAW_TUNING,
  DEITY_TEMPER_SIGN,
  AGGRESSION_TUNING,
  DEITY_RANK_AUTHORITY,
  DEITY_MAGIC_LEGALITY_STEPS,
  deityIsRegulatory,
};

/**
 * The consolidated coupling map — one entry per axis value, naming the engine
 * system it drives, the signed direction / magnitude, and a human effect string.
 * The numbers are READ from the re-exported engine constants (never re-typed), so
 * this object can never disagree with the engine.
 */
export const DEITY_AXIS_EFFECTS = Object.freeze({
  alignment: Object.freeze({
    evil: Object.freeze({
      system: 'corruption',
      // sign −1 ⇒ drives the ONSET side ("corrupts the faithful").
      direction: DEITY_CORRUPTION_TUNING.axisSign.evil,
      magnitude: DEITY_CORRUPTION_TUNING.span,
      effect: "Evil, and corrupts the faithful even without organized crime",
    }),
    good: Object.freeze({
      system: 'corruption',
      // sign +1 ⇒ drives the EXPOSURE side ("purges the corrupt").
      direction: DEITY_CORRUPTION_TUNING.axisSign.good,
      magnitude: DEITY_CORRUPTION_TUNING.span,
      effect: 'Good, and purges corruption, installing incorruptible successors',
    }),
  }),
  temperament: Object.freeze({
    warlike: Object.freeze({
      system: 'aggression',
      direction: DEITY_TEMPER_SIGN.warlike,
      magnitude: AGGRESSION_TUNING.W_DEITY,
      effect: "Warlike, and raises the realm's aggression",
    }),
    peacelike: Object.freeze({
      system: 'aggression',
      direction: DEITY_TEMPER_SIGN.peacelike,
      magnitude: AGGRESSION_TUNING.W_DEITY,
      effect: "Peacelike, and tempers the realm's aggression",
    }),
  }),
  rank: Object.freeze({
    major: Object.freeze({
      system: 'religious_authority',
      authorityLift: DEITY_RANK_AUTHORITY.major,
      effect: 'Major, and anchors religious authority',
    }),
    minor: Object.freeze({
      system: 'religious_authority',
      authorityLift: DEITY_RANK_AUTHORITY.minor,
      effect: 'Minor, and lends modest religious authority',
    }),
    cult: Object.freeze({
      system: 'religious_authority',
      authorityLift: DEITY_RANK_AUTHORITY.cult,
      effect: 'Cult: a fringe following with little authority',
    }),
  }),
  // The 4th axis. Couples to law_order (a DISTINCT lever from the good/evil
  // corruption knobs): a lawful god lifts order; a chaotic god lowers it AND
  // makes corruption more tolerated. The signed lift is READ from the engine's
  // DEITY_LAW_TUNING (never re-typed), so the preview can never disagree.
  law: Object.freeze({
    lawful: Object.freeze({
      system: 'law_order',
      direction: DEITY_LAW_TUNING.axisSign.lawful,
      lawOrderLift: DEITY_LAW_TUNING.axisSign.lawful * DEITY_LAW_TUNING.lawOrderSwing,
      effect: 'Lawful, and strengthens law and order',
    }),
    chaotic: Object.freeze({
      system: 'law_order',
      direction: DEITY_LAW_TUNING.axisSign.chaotic,
      lawOrderLift: DEITY_LAW_TUNING.axisSign.chaotic * DEITY_LAW_TUNING.lawOrderSwing,
      effect: 'Chaotic, and erodes order, tolerating corruption',
    }),
  }),
});

/** The signed alignment direction of a deity snapshot: evil −1, good +1, else 0.
 * @param {any} deity @returns {number} */
function alignmentDir(deity) {
  const sign = /** @type {Record<string, number>} */ (DEITY_CORRUPTION_TUNING.axisSign)[deity?.alignmentAxis];
  return Number.isFinite(sign) ? sign : 0;
}

/** The signed temperament direction of a deity snapshot: warlike +1, peacelike −1, else 0.
 * @param {any} deity @returns {number} */
function temperamentDir(deity) {
  const sign = /** @type {Record<string, number>} */ (DEITY_TEMPER_SIGN)[deity?.temperamentAxis];
  return Number.isFinite(sign) ? sign : 0;
}

/** The signed law direction of a deity snapshot: lawful +1, chaotic −1, else 0
 * (a legacy 3-axis deity with no lawAxis ⇒ 0). @param {any} deity @returns {number} */
function lawDir(deity) {
  const sign = /** @type {Record<string, number>} */ (DEITY_LAW_TUNING.axisSign)[deity?.lawAxis];
  return Number.isFinite(sign) ? sign : 0;
}

/**
 * Human-readable effect strings for an embedded deity snapshot — exactly the
 * couplings the engine will apply, in a stable order (alignment, temperament,
 * rank, magic). The dossier Faith-Effects block and the Compendium "this god
 * will…" preview render these.
 *
 * Returns [] for a null/absent snapshot or a fully-neutral deity (no alignment,
 * no temperament, unranked) — the dormancy guarantee.
 *
 * @param {any} deitySnapshot the embedded config.primaryDeitySnapshot (or null).
 * @returns {string[]} ordered effect strings; [] when there is nothing to say.
 */
export function describeDeityEffects(deitySnapshot) {
  if (!deitySnapshot) return [];
  /** @type {string[]} */
  const out = [];

  // 1. Alignment → corruption.
  const aDir = alignmentDir(deitySnapshot);
  if (aDir < 0) out.push(DEITY_AXIS_EFFECTS.alignment.evil.effect);
  else if (aDir > 0) out.push(DEITY_AXIS_EFFECTS.alignment.good.effect);

  // 2. Temperament → aggression.
  const tDir = temperamentDir(deitySnapshot);
  if (tDir > 0) out.push(DEITY_AXIS_EFFECTS.temperament.warlike.effect);
  else if (tDir < 0) out.push(DEITY_AXIS_EFFECTS.temperament.peacelike.effect);

  // 3. Rank → religious authority.
  const rank = deitySnapshot.rankAxis;
  if (rank && /** @type {Record<string, any>} */ (DEITY_AXIS_EFFECTS.rank)[rank]) {
    out.push(/** @type {Record<string, any>} */ (DEITY_AXIS_EFFECTS.rank)[rank].effect);
  }

  // 4. Magic legality — ONLY a MAJOR god regulates a realm's magic (a minor god
  // or cult lacks the institutional reach; matches magicProfile.dominantDeityOf).
  // A warlike/evil major orthodoxy tightens harder ("openly opposed").
  if (rank === 'major') {
    out.push(deityIsRegulatory(deitySnapshot)
      ? 'Tightens magic legality: the art is openly opposed'
      : 'Tightens magic legality');
  }

  // 5. Law/chaos → law_order. Appended last so the alignment/temperament/
  //    rank/magic order stays stable. A legacy 3-axis deity (no lawAxis ⇒ 0) and
  //    a law-neutral deity say nothing here — the dormancy/back-compat guarantee.
  const lDir = lawDir(deitySnapshot);
  if (lDir > 0) out.push(DEITY_AXIS_EFFECTS.law.lawful.effect);
  else if (lDir < 0) out.push(DEITY_AXIS_EFFECTS.law.chaotic.effect);

  return out;
}
