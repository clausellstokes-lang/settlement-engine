/**
 * domain/magicLedger.js — the canonical conserved magic quantity for a settlement.
 *
 * Mirrors foodLedger / defenseLedger / governanceLedger. A settlement's magic
 * investment is a granular 0-100 dial: resolveConfig sets config.priorityMagic and DERIVES
 * config.magicLevel = getMagicLevel(priorityMagic) as a band (none/low/medium/high).
 *
 * The magic lenses string-matched the band with a STALE vocabulary (moderate/common/pervasive/
 * rare) that the generator never emits. The damage: capacityModel.deriveMagical matched 'moderate'
 * for the medium tier, so a generated 'medium'-magic settlement (priority 26-65, the WIDEST band)
 * matched nothing and contributed ZERO supply instead of its intended +10. This ledger exposes the
 * granular priorityMagic dial AND a band canonicalized to one vocabulary (folding the legacy words),
 * so every lens responds correctly across the full range.
 *
 * It is also the single home for the arcane-institution matcher, previously duplicated and
 * divergent across capacityModel.deriveMagical and magicProfile.
 *
 * Pure; defensive; neutral defaults (present:false) for an un-generated settlement.
 */
import { getMagicLevel } from '../data/constants.js';

/**
 * Canonical arcane-institution matcher — the superset of the two prior divergent regexes
 * (includes `guild.*mage`, which magicProfile's copy omitted). One source of truth.
 */
export const ARCANE_INSTITUTION_PATTERN = /(tower|sanctum|college|conclave|circle|guild.*mage|enclave|atheneum|library.*arcane)/i;

/**
 * @typedef {Object} MagicLedger
 * @property {number} priorityMagic  0..100 conserved magic-investment dial (effective: 0 in a dead-magic world)
 * @property {'none'|'low'|'medium'|'high'} magicLevel  band canonicalized from the dial / legacy vocabulary
 * @property {boolean} magicExists   false in a world where magic does not function
 * @property {boolean} present       true once a real priorityMagic dial or magicLevel band backed it
 */

/** @type {MagicLedger} */
const NEUTRAL = Object.freeze({
  priorityMagic: 0,
  magicLevel: 'none',
  magicExists: false,
  present: false,
});

// Fold the stale lens vocabulary (and any legacy saves) into getMagicLevel's canonical set.
/** @param {any} level */
function canonBand(level) {
  switch (level) {
    case 'pervasive':            return 'high';
    case 'common': case 'moderate': return 'medium';
    case 'rare':                 return 'low';
    case 'none': case 'low': case 'medium': case 'high': return level;
    default:                     return 'medium'; // unknown non-empty band -> neutral midpoint
  }
}

/** @param {any} v */
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * @param {any} settlement
 * @returns {MagicLedger}
 */
export function magicLedger(settlement) {
  const cfg = settlement?.config || null;
  const rawBand = cfg?.magicLevel ?? settlement?.magicLevel;
  const hasPriority = isNum(cfg?.priorityMagic);
  const hasBand = typeof rawBand === 'string' && rawBand.length > 0;
  if (!hasPriority && !hasBand) return NEUTRAL;
  const magicExists = cfg?.magicExists !== false;
  // Effective dial: a dead-magic world is 0 regardless of the slider.
  const priorityMagic = hasPriority ? (magicExists ? cfg.priorityMagic : 0) : (magicExists ? 50 : 0);
  // Prefer the granular dial (canonical vocabulary guaranteed); else fold a legacy band.
  const magicLevel = hasPriority ? getMagicLevel(priorityMagic) : canonBand(rawBand);
  return { priorityMagic, magicLevel, magicExists, present: true };
}
