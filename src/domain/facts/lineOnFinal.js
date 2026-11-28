/**
 * domain/facts/lineOnFinal.js — A STORED LINE RE-ANSWERED ON THE FINAL RECORD (SURVEY S-A "THE FINAL RECORD"; the
 * eleventh chair's ruling S-A-1 of 2026-11-28; `docs/chair/2026-11-27/eleventh/survey/final/MEASURE.md`).
 *
 * Some declared lines are drawn AT BIRTH, while the record is still being made, and STORED as text; the record then
 * moves (a house a later pass adds, a terrain written after the draw, a siege the draw did not read, a guild power renamed
 * at the close), and the page printed the stored line beside the final fact it contradicts. Where such a line PRINTS, the
 * print site hands it here with its HOME (the pool or the sibling table it was drawn from) and THE SITE's OWN READER on
 * the final record, and prints what comes back. NO BIRTH MOVES: the stored record is untouched, so a saved town is cured
 * too.
 *
 * THE DOOR's OWN RULE (`drawDeclared.js`), on the final facts:
 *   - the stored line is found in its home BY TEXT (as the home speaks it: the tier noun the draw spoke it in);
 *   - admitted: it prints as stored;
 *   - refused: a sibling set resolves from its ORIGINAL (the original if admitted, else its twin, else the set's first
 *     admitted member: `resolveDeclared`), so a stored twin whose original the final record admits gives the original
 *     back; a pool takes the refused line's twin (`twinOf`), else the next admitted line by the door's hash argmax
 *     (`hashKey(key::lineId)`), less the lines the caller already prints (`held`); else NOTHING, or, where the home
 *     keeps its slot (`keep`, a house description: the slot is never emptied), the stored text;
 *   - NOT FOUND (a DM's own words, a line no table knows): the stored text, as it is, and counted (`found: false`).
 *
 * Pure: no randomness, no clock, no write. It reads only what the caller hands it.
 *
 * @enforced-by tests/domain/facts/lineOnFinal.test.js
 */
import { declarationAdmits, declarationOf } from './factVocabulary.js';
import { lineText, resolveDeclared } from './drawDeclared.js';
import { hashKey } from '../display/stateProse/stateProseKernel.js';

/**
 * @typedef {object} LineHome
 * @property {Readonly<Record<string, ReadonlyArray<unknown>>>} [siblings] a sibling table keyed by its originals' text
 * @property {ReadonlyArray<unknown>} [pool] a pool of lines (bare strings, declared rows, twins among them)
 * @property {string} [key] the door's hash key for the next admitted line of a pool
 * @property {ReadonlySet<string>} [held] the texts the caller already prints (never chosen as the next line)
 * @property {boolean} [keep] the slot is never emptied: nothing admitted prints the stored text
 * @property {(text: string) => string} [speak] the voice the home's text was stored in (default: as written)
 */

/**
 * @typedef {object} LineOnFinal
 * @property {string | null} text what prints (null: nothing)
 * @property {boolean} found the stored line was found in its home
 * @property {boolean} moved what prints is not the stored text
 */

/** @param {unknown} facts @returns {object | null} */
const factsNow = (facts) => /** @type {object | null} */ (typeof facts === 'function' ? facts() : facts ?? null);

/** @param {unknown} line @returns {string | null} */
const textOf = (line) => { const t = lineText(line); return typeof t === 'string' ? t : null; };

/** @param {unknown} line @returns {boolean} */
const isTwin = (line) => !!line && typeof line === 'object' && typeof (/** @type {{ twinOf?: unknown }} */ (line)).twinOf === 'string';

/**
 * @param {unknown} stored the stored text
 * @param {LineHome} home
 * @param {object | (() => object) | null} facts the site's own reader on the FINAL record (`factsOf(record)`, a thunk)
 * @returns {LineOnFinal}
 */
export function lineOnFinalOf(stored, home, facts) {
  if (typeof stored !== 'string' || stored.trim() === '') return { text: typeof stored === 'string' ? stored : null, found: false, moved: false };
  const speak = typeof home.speak === 'function' ? home.speak : (/** @type {string} */ t) => t;
  const same = (/** @type {string | null} */ t) => t !== null && speak(t).trim() === stored.trim();
  const out = (/** @type {string | null} */ t) => {
    const text = t === null ? (home.keep ? stored : null) : speak(t);
    return { text, found: true, moved: text !== stored };
  };
  if (home.siblings) {
    for (const set of Object.values(home.siblings)) {
      if (!Array.isArray(set) || !set.some((l) => same(textOf(l)))) continue;
      const f = factsNow(facts);
      if (!f) return { text: stored, found: true, moved: false };
      const r = resolveDeclared(/** @type {ReadonlyArray<unknown>} */ (set), { facts: f, poolId: 'lineOnFinal', drawKind: 'T' });
      return out(r.line == null ? null : textOf(r.line));
    }
  }
  if (Array.isArray(home.pool)) {
    const pool = home.pool;
    const at = pool.findIndex((l) => !isTwin(l) && same(textOf(l)));
    if (at < 0) return { text: stored, found: false, moved: false };
    const f = factsNow(facts);
    if (!f) return { text: stored, found: true, moved: false };
    const admits = (/** @type {unknown} */ l) => declarationAdmits(declarationOf(l), /** @type {any} */ (f)).admitted;
    const own = pool[at];
    if (admits(own)) return { text: stored, found: true, moved: false };
    const twin = pool.find((l) => isTwin(l) && /** @type {{ twinOf: string }} */ (l).twinOf === textOf(own));
    if (twin && admits(twin)) return out(textOf(twin));
    const held = home.held || new Set();
    let best = null; let bestKey = -1;
    pool.forEach((l, i) => {
      const t = textOf(l);
      if (i === at || isTwin(l) || t === null || held.has(t) || held.has(speak(t)) || !admits(l)) return;
      const id = l && typeof l === 'object' && (typeof (/** @type {{ id?: unknown }} */ (l)).id === 'string' || typeof (/** @type {{ id?: unknown }} */ (l)).id === 'number') ? /** @type {{ id: string | number }} */ (l).id : i;
      const k = hashKey(`${home.key || ''}::${id}`);
      if (k > bestKey) { best = t; bestKey = k; }
    });
    return out(best);
  }
  return { text: stored, found: false, moved: false };
}

/**
 * The text to print (the stored text where the home does not know it).
 * @param {unknown} stored @param {LineHome} home @param {object | (() => object) | null} facts
 * @returns {string | null}
 */
export function lineOnFinal(stored, home, facts) {
  const { text } = lineOnFinalOf(stored, home, facts); // the stored TEXT re-answered, not a pool unwrapped (presumedThings ARM 3 reads `f(x).text` as one)
  return text;
}
