/**
 * lawBandModulation.js — THE LAW-BAND CURVE TABLE'S SHAPE, AND NOT ONE OF ITS VALUES
 * (WC-0C).
 *
 * `DESIGN_FP_ARCH_WC.md` §8.1 row 2 rules ONE frozen leaf holding the law-band curve table:
 * *"Each consumer may carry its own CURVE ROW in the one table; none may carry a private
 * table."* This is that leaf. It declares the closed key set, the axis those curves are
 * keyed on, and the registration entry point through which each consuming wave supplies its
 * own row.
 *
 * ⛔⛔ IT CARRIES NO CURVE VALUES, AND THAT IS THE WHOLE REASON THE SHAPE LANDS SEPARATELY
 * FROM ITS CONTENT. The volume corrected itself here in writing: an earlier drafting landed
 * four curves in the wave whose closing line reads "TUNING: none", which is exactly the
 * unsigned-constant drift THE PROMISE's versioned-tuning carve-out exists to stop — curves
 * are constants and constants are owner-signature surface. Each curve lands with its MOVER:
 * WC-3's relay row, WC-8's cohesion row, WC-9's drift row, HABIT's learning row.
 *
 * ⭐ THERE IS NO NUMERIC LITERAL ANYWHERE IN THIS FILE, and the acceptance file asserts that
 * by scanning the module's own comment-stripped source. "TUNING: none" is therefore a
 * MEASUREMENT rather than a claim, and the mutant that lands a single curve value reds.
 *
 * ⭐ THE TOTALITY PIN IS STATED IN THE DIRECTION THAT SURVIVES A PARTLY-FILLED TABLE
 * (§8.1 row 2): every REGISTERED key has a curve and every curve names a registered key —
 * never that the table is full at this landing. A table asserted full would red on the day
 * it lands and every day until the last consumer arrives.
 *
 * ⚠ ITS ONE IMPORT IS `LAW_WORDS`, AND THE NARROWING IS RECORDED RATHER THAN SILENT.
 * §8.1 row 2 says "zero-import leaf". The alternative to importing the estate's law ladder
 * is re-spelling its three words here, which mints a SECOND law-word list — the precise
 * defect `lawWord.js` was created to end. `lawWord.js` is itself an ARGUED_UNLAYERED
 * substrate module whose edges are deleted from the pair scan, so this import mints no
 * cross-layer pair and no registry row. A narrowing made by SILENCE is what the estate
 * refuses; a narrowing RECORDED is fine (CR-WC-8(iii)).
 *
 * ⚠ DARK-COMPLETE BY ABSENCE OF REGISTRANTS. Nothing under `src/` calls
 * `registerLawBandCurve` at this member. The table is empty, and the fence beside it asserts
 * an emptiness that is legal today and tightens to exactly-one the day the WC mint has a
 * registrant.
 *
 * PURE: no rng, no clock, no store, no world read.
 */

import { LAW_WORDS } from './lawWord.js';

/**
 * The closed key set — one key per consuming family's curve, codepoint-sorted and order-free.
 * `cohesion` is block cohesion (WC-8), `drift` is drift expression (WC-9), `learning` is
 * HABIT's rate decay, `relay` is relay efficiency (WC-3).
 * @type {ReadonlyArray<string>}
 */
export const LAW_BAND_KEYS = Object.freeze(['cohesion', 'drift', 'learning', 'relay']);

/**
 * The axis every curve is keyed on: the estate's law words, and NO FOURTH WORD EVER
 * (§8.1 row 2 — `lawWordFor`'s three words are the only vocabulary this table may key on).
 * Borrowed rather than re-spelled; see the header.
 * @type {ReadonlyArray<string>}
 */
export const LAW_BAND_AXIS = Object.freeze([...LAW_WORDS]);

/** @type {Map<string, Readonly<Record<string, unknown>>>} */
const CURVES = new Map();

/** @param {string} message @returns {never} */
const refuse = (message) => {
  throw new TypeError(`lawBandModulation: ${message}`);
};

/**
 * Register one consuming wave's curve row. THE ENTRY POINT §8.1 row 2 requires, so that a
 * consumer supplies a ROW in the one table instead of carrying a private table of its own.
 *
 * @param {unknown} key one of `LAW_BAND_KEYS`.
 * @param {unknown} curve an object carrying exactly the `LAW_BAND_AXIS` words.
 * @throws {TypeError} on an unknown key, a curve whose word set is not the axis, or a
 *   second registration of a key already registered — a silent overwrite would let a later
 *   wave retune an earlier one's signed constants without the diff saying so.
 */
export function registerLawBandCurve(key, curve) {
  const name = String(key);
  if (!LAW_BAND_KEYS.includes(name)) {
    refuse(`unknown curve key ${JSON.stringify(key)} — the key set is closed at ${LAW_BAND_KEYS.join('|')}`);
  }
  if (CURVES.has(name)) refuse(`${name} is already registered; a curve is registered once, by its own mover`);
  if (!curve || typeof curve !== 'object') refuse(`${name} curve must be an object keyed by law word`);
  const words = Object.keys(/** @type {Record<string, unknown>} */ (curve)).sort();
  const axis = [...LAW_BAND_AXIS].sort();
  const sameAxis = words.length === axis.length && words.every((word, i) => axis[i] === word);
  if (!sameAxis) {
    refuse(`${name} curve is keyed on ${JSON.stringify(words)}, not on the law-word axis ${JSON.stringify(axis)}`);
  }
  CURVES.set(name, Object.freeze({ .../** @type {Record<string, unknown>} */ (curve) }));
  return CURVES.get(name);
}

/**
 * The curve registered for a key, or `null` when no mover has supplied one yet.
 * @param {unknown} key one of `LAW_BAND_KEYS`.
 * @throws {TypeError} on a key outside the closed set — an unknown key is a defect even
 *   when the table is empty, which is what keeps the emptiness from swallowing typos.
 */
export function lawBandCurve(key) {
  const name = String(key);
  if (!LAW_BAND_KEYS.includes(name)) {
    refuse(`unknown curve key ${JSON.stringify(key)} — the key set is closed at ${LAW_BAND_KEYS.join('|')}`);
  }
  return CURVES.has(name) ? CURVES.get(name) : null;
}

/**
 * The keys a mover has actually registered, codepoint-sorted. THE SURVIVABLE DIRECTION of
 * the totality pin reads off this: every member is a `LAW_BAND_KEYS` member and carries a
 * curve, and the table is NOT required to be full.
 * @returns {ReadonlyArray<string>}
 */
export function registeredLawBandKeys() {
  return Object.freeze([...CURVES.keys()].sort());
}
