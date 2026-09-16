/**
 * domain/townMap/arch/conditionGrammar.js -- K-2: THE CONDITION-MAPPING LAYER (drift rules).
 *
 * The deterministic layer that turns a settlement's STATE into building FORM. It consumes the FROZEN
 * K-4 parameter contract (params.js, PARAM_CONTRACT_VERSION 1 -- the 11-field conditionVector on the
 * 1/64 lattice) and, per FUNCTIONAL ARCHETYPE (the 8 SHAPE_FAMILIES the K-3 shapeRegistry is organized
 * by), maps it to a finite, typed selection of grammar parameters + skin/weathering + statuary. Every
 * output is a token from a finite vocabulary (FINITE-SEMANTICS: the map never invents, it selects); the
 * kernel is DORMANT (imported by nothing shipped -- closure Delta 0), so this consumes the contract but
 * NEVER widens it and NEVER wires drift into a shipped path (K-4 is the single writer into geometry).
 *
 * THE DRIFT RULES (each a pure conditionVector -> typed token function; each threshold a NAMED pinned
 * constant, owner-signable tuning per THE PROMISE):
 *   - prosperity -> ornament density + tracery family + material tier (the wealth ladder);
 *   - warScar    -> a REVEALED damage state (shored buttresses -> broken pinnacles -> patched walls);
 *   - corruptionRevealed -> decay/neglect weathering (the map dresses REVEALED corruption only);
 *   - patronAlignGood + moral -> statuary vocabulary (good: robed figures/finials; evil-drift:
 *                    grotesques/gargoyles/skulls) from the K-3 kit;
 *   - patronAlignLaw -> ornament ORDER (lawful: regular; chaotic: irregular);
 *   - legitimacy -> civic dress (austere -> grand), for the civic archetype;
 *   - terrain    -> material availability bias (adobe/timber low, stone/marble high);
 *   - patronEmblem / historyMark -> a finite emblem + relief-band motif index (never text).
 *
 * THE 2D DRIFT PARITY (a war-scarred town must read war-scarred in BOTH projections): where the 2D
 * settlement layer already carries a threshold as an EXPORTED constant, it is IMPORTED here (never
 * re-derived -- the faction-key lesson): the moral RECKONING band is imported from spatial/moralDrift.js.
 * Where the 2D concept is inline / unexported / categorical (most are -- the map-dress layer visually
 * consumes only season/severity/besieged/scarLevel), the 3D threshold is PINNED here and CITED to its
 * nearest 2D source so the two stay in step (see each PARITY: note). The 3D key light is the same NW key
 * as the 2D SHADOW_DIR (rationalTables.LIGHT_MODEL, screen-angle-matched); drift never emits light.
 *
 * SECURITY INVARIANT (fail-closed): corruptionCovert is EXACTLY 0 by contract and NEVER dresses the
 * geometry -- the map never leaks what the dossier hides. This module reads corruptionRevealed only; a
 * covert value can never reach an output token (proven by the covert-negative test).
 *
 * PURITY: {+,-,*,/} + Math.round/min/max/floor + integer hashing; 0 transcendental sites (the arch/
 * view-wall scan + the transcendental ratchet bind this file at 0). Deterministic: same conditionVector
 * -> byte-identical tokens; variant tie-breaks are a pure FNV-1a hash of (seedId, anchorKey).
 *
 * @typedef {Readonly<Record<string, number>>} ConditionVector  a validated 11-field vector (params.js)
 */

import { ORNAMENT_DENSITY, TRACERY_FAMILY_TOKENS } from './params.js';
import { WEATHERING_CLASSES } from './materials/materials.js';
import { MORAL_DRIFT_TUNING } from '../../spatial/moralDrift.js';

// ── THE FINITE DRIFT VOCABULARIES (typed tokens; FINITE-SEMANTICS) ───────────────────────────────

/** The REVEALED war-damage states, low -> high (a saturating ladder). @type {ReadonlyArray<string>} */
export const DAMAGE_STATES = Object.freeze(['sound', 'shored', 'broken', 'patched']);
/** The material tiers the wealth ladder climbs (timber -> stone -> marble). @type {ReadonlyArray<string>} */
export const MATERIAL_TIERS = Object.freeze(['timber', 'stone', 'marble']);
/** The statuary iconography modes (which end of the kit an archetype wears). @type {ReadonlyArray<string>} */
export const STATUARY_MODES = Object.freeze(['beneficent', 'neutral', 'macabre', 'none']);
/** Civic dress richness from legitimacy (austere -> grand). @type {ReadonlyArray<string>} */
export const CIVIC_DRESS = Object.freeze(['crisis', 'austere', 'settled', 'proud', 'endorsed']);
/** Ornament ORDER from the law/chaos axis. @type {ReadonlyArray<string>} */
export const ORNAMENT_ORDER = Object.freeze(['chaotic', 'measured', 'regular']);

/** The statuary kit pieces each mode draws from (K-3 kit.js assets; abstract forms only, never a face). @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const STATUARY_VOCAB = Object.freeze({
  beneficent: Object.freeze(['robedFigure', 'finial', 'crocket']),
  neutral: Object.freeze(['finial', 'crocket', 'gargoyle']),
  macabre: Object.freeze(['grotesque', 'gargoyle', 'skull']),
  none: Object.freeze([]),
});

// ── NAMED THRESHOLD CONSTANTS (pinned tuning; each CITED to its 2D parity source) ────────────────

/**
 * PROSPERITY_CUTS -- the wealth-ladder band edges on the normalized [0,1] prosperity field. Three cuts
 * -> four ornament-density bands + four tracery families + three material tiers.
 * PARITY: causalState.causalBand cuts the 0..100 economic substrate at 75/50/30/15 (causalState.js:369,
 * EXPORTED); no exported 0..1 prosperity scalar exists, so these are pinned to MATCH those cuts on the
 * lattice (0.30 / 0.50 / 0.75). Keep in step with causalBand if it ever re-tunes.
 * @type {ReadonlyArray<number>}
 */
export const PROSPERITY_CUTS = Object.freeze([0.30, 0.50, 0.75]);

/**
 * WAR_SCAR_CUTS -- the REVEALED damage-state band edges on the saturating warScar field.
 * PARITY: warStatus.warExhaustionBand bands war-exhaustion at 0.20 / 0.60 (warStatus.js:350, EXPORTED
 * function; the 0.20 floor is warDeployment.EXHAUSTION_CONDITION_FLOOR, unexported). Pinned to match
 * those anchors with a mid split at 0.45. The 2D scar-grain also densifies at scarLevel >= 0.66
 * (groundDress.js:448, inline). A war-scarred town reads scarred in BOTH projections at the same band.
 * @type {ReadonlyArray<number>}
 */
export const WAR_SCAR_CUTS = Object.freeze([0.20, 0.45, 0.60]);

/**
 * CORRUPTION_CUTS -- the REVEALED-corruption decay band edges. corruptionRevealed only (covert is 0).
 * PARITY: 2D corruption reveal is CATEGORICAL, not numeric -- compromisedSecurityInstitutions splits on
 * `imp.covert !== true` (corruption.js:599/615), and a covert mark must never read as a public scandal
 * (the same invariant params.js fail-closes on). No 2D numeric cut exists; pinned here for the reveal
 * intensity -> weathering overlay.
 * @type {ReadonlyArray<number>}
 */
export const CORRUPTION_CUTS = Object.freeze([0.25, 0.55]);

/**
 * LEGITIMACY_CUTS -- civic-dress band edges on legitimacy.
 * PARITY: rulingPower.rebandLegitimacy bands legitimacy at 30/45/60/75 (rulingPower.js:225, INLINE and
 * REPLICATED across three writers with no shared export -- so it is pinned here to those cuts rather
 * than importing one of three duplicates; see rulingPower.js:214 warning). On the [0,1] lattice.
 * @type {ReadonlyArray<number>}
 */
export const LEGITIMACY_CUTS = Object.freeze([0.30, 0.45, 0.60, 0.75]);

/** ALIGN_GOOD_CUTS -- good(>=hi) / neutral / evil(<=lo) on the good-evil axis. PARITY: alignment is
 *  categorical in 2D (latentPantheon axis strings + corruption.js axisSign +-1); no scalar cut exists,
 *  pinned here. @type {ReadonlyArray<number>} */
export const ALIGN_GOOD_CUTS = Object.freeze([0.40, 0.60]);
/** ALIGN_LAW_CUTS -- chaotic(<=lo) / measured / regular(>=hi) on the law-chaos axis. PARITY: categorical
 *  in 2D (DEITY_LAW_TUNING.axisSign, corruption.js:197); pinned here. @type {ReadonlyArray<number>} */
export const ALIGN_LAW_CUTS = Object.freeze([0.40, 0.65]);
/** TERRAIN_CUTS -- material-availability band edges (adobe/timber low, stone/marble high). No 2D
 *  constant (terrain is not map-dressed); pinned here. @type {ReadonlyArray<number>} */
export const TERRAIN_CUTS = Object.freeze([0.35, 0.70]);

/**
 * MORAL_DARK_THRESHOLD -- below this the town's moral drift reads as darkened (nudges statuary toward
 * the macabre even under a nominally-good patron). IMPORTED from the 2D moral layer (the one clean
 * parity import): spatial/moralDrift.js MORAL_DRIFT_TUNING.RECKONING_THRESHOLD -- the band a rising
 * malice drift crosses to fire the reckoning receipt (moralDrift.js:79 = 0.3, MAX_DRIFT 1). The 3D
 * surface reads the SAME threshold so a town in moral freefall darkens in both projections. Note the
 * conditionVector `moral` is good(1)..dark(0), the inverse of drift accumulation, so the test is moral
 * < threshold.
 * @type {number}
 */
export const MORAL_DARK_THRESHOLD = MORAL_DRIFT_TUNING.RECKONING_THRESHOLD;

/**
 * ARCHETYPE_PROFILES -- per functional archetype (the 8 SHAPE_FAMILIES), how state dresses it. Every
 * building family is classified EXPLICITLY so the totality walker reds if a family is unmapped. Fields:
 *   statuary       -- the mode ceiling this archetype wears ('macabre'|'neutral'|'beneficent'|'none');
 *   ornamentGain   -- how strongly prosperity climbs its ornament ladder (0 = never ornate);
 *   materialFloor  -- the lowest material tier index this archetype ever drops to (terrain/prosperity
 *                     can only raise from here);
 *   legitimacyDress-- whether legitimacy drives its civic dress (civic only);
 *   damageGain     -- how visibly warScar marks it (martial reads scars most, domestic least);
 *   baseWeathering -- its pristine-state weathering (industrial soots, agrarian mosses).
 * @type {Readonly<Record<string, { statuary: string, ornamentGain: number, materialFloor: number, legitimacyDress: boolean, damageGain: number, baseWeathering: string }>>}
 */
export const ARCHETYPE_PROFILES = Object.freeze({
  sacred:     prof('macabre', 1.0, 1, false, 0.8, 'pristine'),
  civic:      prof('beneficent', 0.8, 1, true, 0.7, 'pristine'),
  martial:    prof('neutral', 0.3, 1, false, 1.0, 'soot'),
  industrial: prof('none', 0.2, 0, false, 0.6, 'soot'),
  mercantile: prof('neutral', 0.6, 0, false, 0.6, 'stain'),
  domestic:   prof('none', 0.3, 0, false, 0.4, 'pristine'),
  agrarian:   prof('none', 0.1, 0, false, 0.5, 'moss'),
  exotic:     prof('macabre', 0.9, 2, false, 0.7, 'salt'),
});

/** ARCHETYPE profile constructor (fails closed on an unknown weathering). @param {string} statuary @param {number} ornamentGain @param {number} materialFloor @param {boolean} legitimacyDress @param {number} damageGain @param {string} baseWeathering */
function prof(statuary, ornamentGain, materialFloor, legitimacyDress, damageGain, baseWeathering) {
  if (!STATUARY_MODES.includes(statuary)) throw new Error(`arch/conditionGrammar: profile statuary "${statuary}" invalid`);
  if (!WEATHERING_CLASSES.includes(baseWeathering)) throw new Error(`arch/conditionGrammar: profile weathering "${baseWeathering}" invalid`);
  return Object.freeze({ statuary, ornamentGain, materialFloor, legitimacyDress, damageGain, baseWeathering });
}

// ── PURE HELPERS ─────────────────────────────────────────────────────────────────────────────────

/** the band index of x among ascending cuts (0..cuts.length). @param {number} x @param {ReadonlyArray<number>} cuts @returns {number} */
function band(x, cuts) {
  let i = 0;
  while (i < cuts.length && x >= cuts[i]) i++;
  return i;
}

/** clamp an index into [0, n-1]. @param {number} i @param {number} n @returns {number} */
function clampIdx(i, n) { return i < 0 ? 0 : i >= n ? n - 1 : i; }

// ── THE PER-FIELD DRIFT RULES (pure conditionVector -> typed token) ──────────────────────────────

/** ornament density from prosperity, scaled by the archetype's ornamentGain. @param {ConditionVector} cv @param {number} ornamentGain @returns {string} */
export function driftOrnamentDensity(cv, ornamentGain) {
  const b = band(cv.prosperity, PROSPERITY_CUTS);          // 0..3
  const scaled = Math.round(b * (ornamentGain <= 0 ? 0 : ornamentGain <= 1 ? ornamentGain : 1));
  return ORNAMENT_DENSITY[clampIdx(scaled, ORNAMENT_DENSITY.length)];
}

/** tracery family from prosperity (plate -> geometric -> flamboyant -> perpendicular). @param {ConditionVector} cv @returns {string} */
export function driftTraceryFamily(cv) {
  return TRACERY_FAMILY_TOKENS[clampIdx(band(cv.prosperity, PROSPERITY_CUTS), TRACERY_FAMILY_TOKENS.length)];
}

/** material tier from prosperity + terrain bias, never below the archetype floor. @param {ConditionVector} cv @param {number} materialFloor @returns {string} */
export function driftMaterialTier(cv, materialFloor) {
  // prosperity climbs timber(0)->stone(1)->marble(2) at the two lower cuts; terrain biases +-1
  const p = band(cv.prosperity, PROSPERITY_CUTS);                 // 0..3
  const pTier = p <= 0 ? 0 : p <= 2 ? 1 : 2;
  const tBias = band(cv.terrain, TERRAIN_CUTS) - 1;              // -1 (scarce) .. +1 (rich stone)
  const tier = Math.max(materialFloor, pTier + tBias);
  return MATERIAL_TIERS[clampIdx(tier, MATERIAL_TIERS.length)];
}

/** REVEALED war-damage state from warScar, scaled by the archetype's damageGain. @param {ConditionVector} cv @param {number} damageGain @returns {string} */
export function driftDamageState(cv, damageGain) {
  const b = band(cv.warScar, WAR_SCAR_CUTS);                     // 0..3
  const scaled = Math.round(b * (damageGain <= 0 ? 0 : damageGain <= 1 ? damageGain : 1));
  return DAMAGE_STATES[clampIdx(scaled, DAMAGE_STATES.length)];
}

/**
 * The decay weathering overlay from REVEALED corruption, layered over the archetype's base weathering.
 * corruptionRevealed only -- covert (EXACTLY 0) can NEVER reach this. Higher reveal -> more neglect.
 * @param {ConditionVector} cv @param {string} baseWeathering @returns {string}
 */
export function driftWeathering(cv, baseWeathering) {
  const c = band(cv.corruptionRevealed, CORRUPTION_CUTS);       // 0 clean .. 2 decayed
  const w = band(cv.warScar, WAR_SCAR_CUTS);                    // war adds ruin at the top band
  if (w >= 3 || c >= 2) return 'ruin';
  if (c >= 1) return 'stain';
  return baseWeathering;
}

/**
 * The statuary MODE from the good-evil axis + moral drift, capped by the archetype's ceiling. A
 * nominally-good patron whose town has fallen below the imported MORAL_DARK_THRESHOLD drifts toward the
 * macabre (the moral-parity tie-in). An archetype that wears no statuary ('none') always returns 'none'.
 * @param {ConditionVector} cv @param {string} archetypeStatuary @returns {string}
 */
export function driftStatuaryMode(cv, archetypeStatuary) {
  if (archetypeStatuary === 'none') return 'none';
  const good = cv.patronAlignGood, moral = cv.moral;
  let mode;
  if (good <= ALIGN_GOOD_CUTS[0] || moral < MORAL_DARK_THRESHOLD) mode = 'macabre';
  else if (good >= ALIGN_GOOD_CUTS[1]) mode = 'beneficent';
  else mode = 'neutral';
  // cap by the archetype ceiling: a martial keep never wears the macabre kit even under an evil patron
  if (archetypeStatuary === 'neutral' && mode === 'beneficent') return 'beneficent';
  if (archetypeStatuary === 'neutral' && mode === 'macabre') return 'neutral';
  if (archetypeStatuary === 'beneficent' && mode === 'macabre') return 'neutral';
  return mode;
}

/** ornament ORDER from the law-chaos axis (lawful reads regular, chaotic irregular). @param {ConditionVector} cv @returns {string} */
export function driftOrnamentOrder(cv) {
  return ORNAMENT_ORDER[clampIdx(band(cv.patronAlignLaw, ALIGN_LAW_CUTS), ORNAMENT_ORDER.length)];
}

/** civic dress richness from legitimacy (only meaningful for the civic archetype). @param {ConditionVector} cv @returns {string} */
export function driftCivicDress(cv) {
  return CIVIC_DRESS[clampIdx(band(cv.legitimacy, LEGITIMACY_CUTS), CIVIC_DRESS.length)];
}

/**
 * The relief-band motif index from the recorded historyMark, blended with the patronEmblem (both finite
 * indices, NEVER text -- the recorded siege becomes a relief band, never fading below the record). A
 * pure combination into a stable finite motif id. @param {ConditionVector} cv @returns {number}
 */
export function driftReliefMotif(cv) {
  // historyMark (0..15) is the primary; patronEmblem (0..47) selects a variant within it. 16 motifs.
  return (Math.round(cv.historyMark) + Math.round(cv.patronEmblem)) % 16;
}
