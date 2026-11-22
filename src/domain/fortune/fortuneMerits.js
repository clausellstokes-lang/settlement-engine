/**
 * fortuneMerits.js — THE MERITS OF RULE (FORTUNE-3, unit U5a; the chair's seven conditions of 2026-11-20 15:30 UTC,
 * its census rulings of 16:45 UTC, its rulings (A) to (C) of 18:38 UTC and its rulings of 19:33 and 19:38 UTC; every
 * figure a DRAFT row of the fortune law's one table, `FORTUNE_LAW_TUNING.standing`, signed by none).
 *
 * Under the fortune law (version 2) ONLY, a place the people already accept (Tolerated or better) with no trouble of
 * today about its ruler earns standing on a merit that claims an OUTCOME, read from the born record:
 *   A CATASTROPHE WEATHERED WITHIN A GENERATION — a `historicalEvents[]` entry of the law's catastrophe grade, at most
 *   `weatheredWithinYears` ago, whose kind names no tension of today, and that no legacy annotation calls unresolved
 *   (condition 4: read by the legacy generator's own list, `src/data/legacyUnresolvedWordings.js`);
 *   A PLACE THAT HAS LASTED (FORTUNE-7 U7, the chair's decision E32 of 2026-11-22 04:51 UTC) — its `history.age` at or
 *   above `lastingAgeBySize` of its own size, the size read as the record carries it (`tier`, else `config.settType`).
 * Each merit is COMPUTED from the record, never rolled: no draw is added and no draw count moves. Two merits are two
 * reasons at the Endorsed guard.
 * It adds `meritPoints`, only upward; Endorsed never stands on fewer than `endorsedMinReasons` reasons.
 *
 * ⛔ A MERIT READS ONLY WHAT EVERY SHARED READ SERVES (the chair's rulings of 19:33 and 19:38 UTC), so the score is the
 * same on the owner's page and a shared one (V-LEGIT-SUM) and its presence reveals nothing a shared page withholds.
 * Every input is a field on a card kind's identity FLOOR in the veil's registry, which no address may hide
 * (`display/galleryVeil.js :: CARD_KINDS` — event: `name`, `templateType`, `yearsAgo`, `severity`; tension: `type`;
 * `isHideable` refuses a floor field and every card address but a hideable house's), or a key no rule of
 * `display/publicSafe.js :: toPublicSafe` strips (`history.legacyAnnotations[]`: `eventName`, `yearsAgo`,
 * `annotation`; the standing's `score` and `breakdown`), or the settlement's floor (`galleryVeil.js :: SETTLEMENT_FLOOR`:
 * `tier`, `config`) and `history.age`, which every shared read serves unchanged (tests/domain/fortuneLastingVeil.test.js,
 * the widest veil included). NEVER the capture rung (DM-only: `publicVeilPass` drops it),
 * never which power governs (its name, kind or house), never a card's traits or memberships (they ride per row by the
 * veil bit), never a fact about crime. The principled-ruler merit and the seat-match were REMOVED on those rulings.
 * Held by tests/generators/fortuneLawMerits.test.js (the owner's record and its shared projection: the same merits).
 *
 * ⭐ ONE HOME FOR THE BIRTH AND THE PAGE. The birth's tail (`settleMeritsOfRule`, called as the TAIL of the
 * `assembleSettlement` step: no pipeline step of its own, ruling (A)) and the page that prints the reason (U5b) both
 * call `meritsOf`, so they cannot disagree.
 *
 * ⭐ THE BIRTH'S POWERS STAND (condition 3). The tail re-bands the score and re-runs only the census's word-writers
 * that read a band above Tolerated: W1, the capture rows' direction (`factionDynamics.js :: withCaptureRelations`),
 * and W2, the standing sentences (`power/rosterText.js :: settleStandingToLegitimacy`). No multiplier is re-run. The
 * three are HANDED IN by the step (`seams`), because a domain module never imports a generator
 * (tests/build/domainGeneratorsBoundary.test.js); the band IS `factionDynamics.js :: legitimacyBandFor`.
 *
 * ⭐ IDEMPOTENT (ruling (C)): the tail starts from `score - (breakdown.merits ?? 0)`, the birth's own score, so a
 * second run (a pinned re-derivation, or the test) returns the same record; and a record whose stored merits no longer
 * hold falls back to its base.
 *
 * Pure. No RNG, no store, no wall clock. Imports only leaves.
 */
import { FORTUNE_LAW_TUNING, isSizeRelativeFortune } from './fortuneLaw.js';
import { LEGITIMACY_CUTS } from '../../data/bandLadders.js';
import { UNRESOLVED_LEGACY_WORDINGS } from '../../data/legacyUnresolvedWordings.js';

const STANDING = FORTUNE_LAW_TUNING.standing;

/** The merits, in the fixed order `meritsOf` names them. @type {readonly ['weathered', 'lasting']} */
export const MERIT_NAMES = Object.freeze(/** @type {const} */ (['weathered', 'lasting']));

/** @typedef {typeof MERIT_NAMES[number]} MeritName */

/** @typedef {Record<string, unknown>} Bag */
/**
 * A standing as the birth stores it (`factionDynamics.js :: computePublicLegitimacy`), its terms by name.
 * @typedef {{ score: number, label?: unknown, breakdown?: Record<string, number> } & Bag} Legitimacy
 */
/**
 * The band tuple of a score (`factionDynamics.js :: legitimacyBandFor`).
 * @typedef {{ label: string, color: string, bg: string, govMultiplier: number, crimMultiplier: number,
 *   isEndorsed: boolean, isApproved: boolean, isTolerated: boolean, isContested: boolean, isLegitimacyCrisis: boolean,
 *   governanceFractured: boolean }} Band
 */
/**
 * The record as the merits read it: its law (`config`), its size, its history and its standing.
 * @typedef {{ config?: unknown, _config?: unknown, institutions?: unknown, tier?: unknown,
 *   history?: { historicalEvents?: unknown, currentTensions?: unknown, legacyAnnotations?: unknown, age?: unknown } | null,
 *   powerStructure?: ({ publicLegitimacy?: unknown, criminalCaptureState?: unknown } & Bag) | null }} MeritRecord
 */
/**
 * The three writers the step hands in (a domain module never imports a generator).
 * @typedef {{ bandFor: (score: number) => Band, recapture: (ps: Bag, state: unknown) => Bag,
 *   restand: (ps: Bag, previous: Legitimacy, record: MeritRecord) => Bag }} MeritSeams
 */

/** @param {unknown} value @returns {Bag[]} the value's object entries, or none */
const bagsOf = (value) => (Array.isArray(value) ? value.filter((v) => v !== null && typeof v === 'object') : []);

/** @param {unknown} value @returns {value is Legitimacy} */
const isLegitimacy = (value) => value !== null && typeof value === 'object' && typeof (/** @type {Bag} */ (value)).score === 'number';

/**
 * Is there trouble of today about the ruler? A tension of the ruler's kinds, by its TYPE (a floor field of the veil's
 * tension card, served on every shared read). ⛔ NEVER the capture rung (DM-only) and NEVER which power governs: the
 * seat-match ("a tension that names the governing power") was removed on the chair's ruling of 19:38 UTC.
 * @param {MeritRecord|null|undefined} settlement @returns {boolean}
 */
export function rulerTroubled(settlement) {
  return bagsOf(settlement?.history?.currentTensions).some((t) => STANDING.rulerTroubleKinds.includes(String(t.type)));
}

/**
 * THE LEGACY MATCHER (condition 4): is this legacy annotation the legacy generator's unresolved line about this
 * event? Matched to the event by its `eventName` and `yearsAgo`, and read by the generator's own list only.
 * @param {Bag|null|undefined} note @param {Bag|null|undefined} event @returns {boolean}
 */
export function isUnresolvedLegacyNote(note, event) {
  if (!note || !event || note.eventName !== event.name || note.yearsAgo !== event.yearsAgo) return false;
  const text = String(note.annotation ?? '');
  return UNRESOLVED_LEGACY_WORDINGS.some((wording) => text.includes(wording));
}

/**
 * The catastrophe weathered within a generation, or null: the first of the history's events of the law's grade,
 * within the window, whose kind names no tension of today, and that no legacy annotation calls unresolved.
 * @param {MeritRecord|null|undefined} settlement @returns {Bag|null}
 */
export function weatheredCatastrophe(settlement) {
  const history = settlement?.history || {};
  const tensions = bagsOf(history.currentTensions);
  const notes = bagsOf(history.legacyAnnotations);
  return bagsOf(history.historicalEvents).find((ev) => ev.severity === STANDING.weatheredSeverity
    && typeof ev.yearsAgo === 'number' && ev.yearsAgo <= STANDING.weatheredWithinYears
    && !tensions.some((t) => t.type === ev.templateType)
    && !notes.some((note) => isUnresolvedLegacyNote(note, ev))) || null;
}

/**
 * The size the record carries, as the lasting merit reads it: `tier`, else its own `config.settType` (the reading of
 * BANDS.md's state D). Both are on every shared read (`galleryVeil.js :: SETTLEMENT_FLOOR`). Null when neither is a string.
 * @param {MeritRecord|null|undefined} settlement @returns {string|null}
 */
export function lastingSizeOf(settlement) {
  const config = settlement?.config;
  const size = settlement?.tier ?? (config !== null && typeof config === 'object' ? (/** @type {Bag} */ (config)).settType : undefined);
  return typeof size === 'string' ? size : null;
}

/**
 * Has the place lasted? Its `history.age` at or above the law's lasting age for its own size. A size the table does not
 * name, or an age that is not a number, has not.
 * @param {MeritRecord|null|undefined} settlement @returns {boolean}
 */
export function hasLasted(settlement) {
  const age = settlement?.history?.age;
  const size = lastingSizeOf(settlement);
  const byAge = /** @type {Readonly<Record<string, number>>} */ (STANDING.lastingAgeBySize);
  return typeof age === 'number' && size !== null && Object.hasOwn(byAge, size) && age >= byAge[size];
}

/**
 * The birth's own score under a stored legitimacy: the score less the merits it carries.
 * @param {Legitimacy} legitimacy @returns {number}
 */
const baseScoreOf = (legitimacy) => legitimacy.score - (legitimacy.breakdown?.merits ?? 0);

/**
 * The merits this record counts, by name, in the fixed order: none outside the fortune law, none below the Tolerated
 * cut (on the birth's own score), none with trouble of today about the ruler.
 * @param {MeritRecord|null|undefined} settlement @returns {MeritName[]}
 */
export function meritsOf(settlement) {
  if (!settlement || !isSizeRelativeFortune(settlement)) return [];
  const legitimacy = settlement.powerStructure?.publicLegitimacy;
  if (!isLegitimacy(legitimacy)) return [];
  if (baseScoreOf(legitimacy) < LEGITIMACY_CUTS.tolerated || rulerTroubled(settlement)) return [];
  /** @type {MeritName[]} */
  const names = [];
  if (weatheredCatastrophe(settlement)) names.push(MERIT_NAMES[0]);
  if (hasLasted(settlement)) names.push(MERIT_NAMES[1]);
  return names;
}

/**
 * The legitimacy a stored one becomes with these merits counted, from its birth's own score: the points added (only
 * upward, clamped 0..100), the two-reason guard, the band re-stamped through `bandFor` (the whole tuple), the terms
 * kept in their order and `merits` added last (absent when 0). Key order unchanged. Returns the SAME object where
 * nothing moves.
 * @param {Legitimacy} legitimacy @param {ReadonlyArray<string>} names
 * @param {(score: number) => Band} bandFor `factionDynamics.js :: legitimacyBandFor`
 * @returns {Legitimacy}
 */
export function meritedLegitimacy(legitimacy, names, bandFor) {
  const base = baseScoreOf(legitimacy);
  const { merits: _stored, ...terms } = legitimacy.breakdown || {};
  let score = Math.max(0, Math.min(100, base + STANDING.meritPoints * names.length));
  const reasons = names.length + Object.values(terms).filter((v) => typeof v === 'number' && v > 0).length;
  if (score >= LEGITIMACY_CUTS.endorsed && reasons < STANDING.endorsedMinReasons) score = Math.max(base, LEGITIMACY_CUTS.endorsed - 1);
  const added = score - base;
  if (score === legitimacy.score && (added > 0) === ('merits' in (legitimacy.breakdown || {}))) return legitimacy;
  const band = bandFor(score);
  return {
    score,
    label: band.label,
    color: band.color,
    bg: band.bg,
    breakdown: added > 0 ? { ...terms, merits: added } : terms,
    govMultiplier: band.govMultiplier,
    crimMultiplier: band.crimMultiplier,
    isEndorsed: band.isEndorsed,
    isApproved: band.isApproved,
    isTolerated: band.isTolerated,
    isContested: band.isContested,
    isLegitimacyCrisis: band.isLegitimacyCrisis,
    governanceFractured: band.governanceFractured,
  };
}

/**
 * THE BIRTH'S TAIL (ruling (A): the tail of the `assembleSettlement` step, before `resolveCrisisCast`). Under law 1
 * the record is returned untouched, before any other key is read (FS5). Under law 2 the merits are counted from the
 * birth's own score; where the score moves, the power structure takes the merited legitimacy and, where the BAND
 * moves, the census's two word-writers are re-run on it (W1 the capture rows, W2 the standing sentences), each pure
 * and idempotent. Returns the record (its power structure replaced, never mutated in place).
 * @template {MeritRecord} S
 * @param {S} settlement @param {MeritSeams} seams
 * @returns {S}
 */
export function settleMeritsOfRule(settlement, seams) {
  if (!settlement || !isSizeRelativeFortune(settlement)) return settlement;
  const ps = settlement.powerStructure;
  const legitimacy = ps?.publicLegitimacy;
  if (!ps || !isLegitimacy(legitimacy)) return settlement;
  const next = meritedLegitimacy(legitimacy, meritsOf(settlement), seams.bandFor);
  if (next === legitimacy) return settlement;
  /** @type {Bag} */
  let moved = { ...ps, publicLegitimacy: next };
  if (next.label !== legitimacy.label) {
    moved = seams.recapture(moved, moved.criminalCaptureState);
    moved = seams.restand(moved, legitimacy, settlement);
  }
  settlement.powerStructure = moved;
  return settlement;
}
