/**
 * domain/display/pluralPowerName.js — whether a power's name reads as plural. A pure leaf: it reads only
 * `text` and the power-name leaf (`powerSentenceName.js`).
 *
 * TAIL-TIES-7 (ruling T25 (b), 2026-11-15): moved VERBATIM out of `display/governanceAccount.js`, which re-exports it,
 * so `dossier/faithReading.js` (a reader `facts/factsOf.js` imports) reaches no governance account and through it no
 * `factsOf`: the `layerBoundaries` cycle `factsOf -> faithReading -> governanceAccount -> factsOf` is cut. No value moves.
 */
import { pluralPowerName as pluralPowerNameLeaf } from '../../data/people/powerSentenceName.js'; // NAMES-2 (item 5): the body lives in the data leaf

/**
 * Whether a power's name reads as plural ("Religious Authorities", "Noble Houses"): its head noun, the
 * last word of its prose form (powerSentenceName: "Third Bloc (Neutrals)" reads "The Neutrals"), ends in a single s ("Guild", "Gentry", "Circle" do not).
 * NAMES-2 (item 5, 2026-11-20): the body moved verbatim to `data/people/powerSentenceName.js :: pluralPowerName`, so the
 * Power tab's data-layer lines read it too; this home keeps its name and returns it. No value moves.
 * @param {string} name @returns {boolean}
 */
export function pluralPowerName(name) {
  return pluralPowerNameLeaf(name);
}
