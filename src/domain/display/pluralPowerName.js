/**
 * domain/display/pluralPowerName.js — whether a power's name reads as plural. A pure leaf: it reads only
 * `text` and the power-name leaf (`powerSentenceName.js`).
 *
 * TAIL-TIES-7 (ruling T25 (b), 2026-11-15): moved VERBATIM out of `display/governanceAccount.js`, which re-exports it,
 * so `dossier/faithReading.js` (a reader `facts/factsOf.js` imports) reaches no governance account and through it no
 * `factsOf`: the `layerBoundaries` cycle `factsOf -> faithReading -> governanceAccount -> factsOf` is cut. No value moves.
 */
import { powerSentenceName } from './powerSentenceName.js';

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Whether a power's name reads as plural ("Religious Authorities", "Noble Houses"): its head noun, the
 * last word of its prose form (powerSentenceName: "Third Bloc (Neutrals)" reads "The Neutrals"), ends in a single s ("Guild", "Gentry", "Circle" do not).
 * @param {string} name @returns {boolean}
 */
export function pluralPowerName(name) {
  const words = (text(name) ? powerSentenceName(text(name)) : '').split(/[\s/]+/).filter(Boolean);
  const head = (words[words.length - 1] || '').replace(/[^A-Za-z']/g, '');
  return /[^s']s$/i.test(head);
}
