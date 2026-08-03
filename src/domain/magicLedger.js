/**
 * domain/magicLedger.js — the canonical conserved magic quantity for a settlement.
 *
 * P3.3b Stage 3. Mirrors foodLedger / defenseLedger / governanceLedger. A settlement's magic
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
 * @property {{ token:string, assumed:string, reason:string }} [unknownBand]  MG-3g: present ONLY when a
 *   band token was not recognised and had to be guessed — the receipt that ends the silent fold.
 */

/** @type {MagicLedger} */
const NEUTRAL = Object.freeze({
  priorityMagic: 0,
  magicLevel: 'none',
  magicExists: false,
  present: false,
});

/**
 * THE CLOSED BAND VOCABULARY (finite-semantics law) — every token this ledger knows how
 * to fold, canonical and legacy alike. Exported so a consumer or a walker can census it
 * rather than re-deriving the list from the switch below and drifting.
 */
export const KNOWN_MAGIC_BAND_TOKENS = Object.freeze([
  'none', 'low', 'medium', 'high',            // the canonical set getMagicLevel emits
  'rare', 'moderate', 'common', 'pervasive',  // the legacy lens vocabulary, folded
]);

/** The value an unrecognised token folds to. Named because MG-3g made it observable. */
export const UNKNOWN_BAND_FALLBACK = /** @type {'medium'} */ ('medium');

// Fold the stale lens vocabulary (and any legacy saves) into getMagicLevel's canonical set.
/**
 * MG-3g (leak L9): the default arm swallowed ANY unrecognised token into 'medium' —
 * SILENTLY. That silence has already cost this project once: the medium/moderate
 * zero-supply incident this module's own header documents, where a whole band matched
 * nothing and contributed zero for as long as nobody thought to look. A misspelling, a
 * new authored vocabulary, or an import from another tool lands in the WIDEST band with
 * nothing anywhere saying so, and 'medium' is the worst possible guess when the token
 * actually meant 'none' — a dead-magic world reading as moderately magical.
 *
 * The fold itself is UNCHANGED (altering the fallback would be a live-behaviour change
 * with an unmeasured blast radius, and is not this slice's business). What changes is
 * that the guess is now RECEIPTED: the caller learns the token was not recognised and
 * what was assumed, and can surface or certify it. Silence was the defect, not the value.
 *
 * @param {string | undefined} level  raw band word from config/legacy save (callers guard non-empty; undefined folds to the default)
 * @returns {{ band:'none'|'low'|'medium'|'high', unknownToken: string|null }}
 */
function canonBand(level) {
  switch (level) {
    case 'pervasive':            return { band: 'high', unknownToken: null };
    case 'common': case 'moderate': return { band: 'medium', unknownToken: null };
    case 'rare':                 return { band: 'low', unknownToken: null };
    case 'none': case 'low': case 'medium': case 'high': return { band: level, unknownToken: null };
    default:                     return { band: UNKNOWN_BAND_FALLBACK, unknownToken: String(level) };
  }
}

/** @type {(v: unknown) => v is number} */
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * Structural view of the settlement fields this ledger reads.
 * @typedef {Object} MagicLedgerSource
 * @property {{ magicLevel?: string, priorityMagic?: number, magicExists?: boolean } | null} [config]
 * @property {string} [magicLevel]  legacy top-level band (pre-config saves)
 */

/**
 * @param {MagicLedgerSource | null | undefined} settlement
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
  /** @type {number} */
  // `hasPriority` (isNum predicate over cfg?.priorityMagic) guarantees a finite number here; TS cannot track the aliased optional-chain predicate.
  const priorityMagic = hasPriority ? (magicExists ? /** @type {any} */ (cfg).priorityMagic : 0) : (magicExists ? 50 : 0);
  // Prefer the granular dial (canonical vocabulary guaranteed); else fold a legacy band.
  /** @type {{ band: 'none'|'low'|'medium'|'high', unknownToken: string|null }} */
  const folded = hasPriority ? { band: getMagicLevel(priorityMagic), unknownToken: null } : canonBand(rawBand);
  // MG-3g (leak L9): the unrecognised-token receipt rides as a CONDITIONAL key — present
  // only when a fold actually guessed. Every well-formed settlement in the estate returns
  // the exact same four-key object it always did, so no golden, snapshot or deep-equal
  // moves; only a save carrying a band nobody taught this ledger gains the fifth key.
  return folded.unknownToken === null
    ? { priorityMagic, magicLevel: folded.band, magicExists, present: true }
    : {
      priorityMagic,
      magicLevel: folded.band,
      magicExists,
      present: true,
      unknownBand: { token: folded.unknownToken, assumed: folded.band, reason: 'unrecognised magic band token folded to the neutral midpoint' },
    };
}
