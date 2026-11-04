/**
 * domain/foodways.js — THE FOODWAYS LINE FROM THE PLACE'S OWN TABLE (FOOD-3, food diversity; the
 * owner, 2026-11-03: "Do it"; chair ruling 4 of the FOOD-3 addendum).
 *
 * The culture's foodways sentence (src/data/cultureProfiles.js :: foodways) is authored per
 * culture and knows nothing of the place: a mountain hamlet with no water was told of its fish.
 * This composes the line from the food sources the place really has (the food record's
 * `foodSources`), and keeps one of the culture's own sentences beside it as flavour only when
 * that sentence names no source the place lacks. A place with no source of its own claims
 * nothing: the culture's line if it names no source, else a plain sentence about the season
 * and the household's stores.
 *
 * Draw-free (the GS-1 idiom): the phrasing is chosen by an FNV offset over the settlement's own
 * identity string, so no rng stream moves. Each slot draws its phrase WITHOUT REPLACEMENT from
 * its source's small library. Pure.
 */
import { fnv1a32 } from '../kernel/proseHash.js';

/** @typedef {'grain'|'livestock'|'fish'|'mill'|'game'} FoodSource */

/** Each source's plain phrases. A fish word lives only under fish. */
const SOURCE_PHRASES = Object.freeze({
  grain: Object.freeze(['bread from the home fields', 'the field grain', 'porridge and bread of the local grain']),
  livestock: Object.freeze(['meat and milk from the herds', 'cheese and smoked meat from the grazing herds', 'the herds\' milk and mutton']),
  fish: Object.freeze(['fish from the local waters', 'the day\'s catch', 'salted fish']),
  mill: Object.freeze(['flour from the mill', 'the mill\'s flour']),
  game: Object.freeze(['game from the woods', 'the hunters\' game']),
});

/** The sentence frames, by how many sources the place has. */
const FRAMES = Object.freeze({
  one: Object.freeze(['Most meals start from {A}.', 'The table rests on {A}.']),
  two: Object.freeze(['{A} and {B} anchor the table.', 'The table is {A}, with {B} beside it.']),
  more: Object.freeze(['{A} and {B} anchor the table; {C} fills the winter.', 'The table is {A} and {B}, and {C} carries it through the lean months.']),
});

/** Words that claim a source, for reading the culture's own sentence (and the dossier text). */
export const SOURCE_WORDS = Object.freeze({
  grain: /\b(?:grain|grains|breads?|barley|rye|wheat|millet|rice|porridge|pottage)\b/i,
  // "Game meat" is the hunt's, not the herds' (F3 FOOD-WORDS unit 2a): its meat names no livestock.
  livestock: /\b(?:(?<!\bgame )meat|milk|dairy|cheese|herds?|livestock|mutton|beef|pork)\b/i,
  fish: /\b(?:fish|fishing|seafood|catch|shellfish)\b/i,
  mill: /\bmill(?:'s)?\b/i,
  game: /\b(?:game|venison|hunters?(?:')?)\b/i,
});

/** @param {string} s */
const capital = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * The sources a sentence names, by the words above.
 * @param {string} sentence
 * @returns {FoodSource[]}
 */
export function sourcesNamedIn(sentence) {
  const text = String(sentence || '');
  return /** @type {FoodSource[]} */ (Object.keys(SOURCE_WORDS).filter((key) => (
    SOURCE_WORDS[/** @type {FoodSource} */ (key)].test(text)
  )));
}

/**
 * @param {{ sources: ReadonlyArray<string>, cultureLines?: ReadonlyArray<string> | null, identity: string }} input
 * @returns {string}
 */
export function composeFoodwaysLine(input) {
  const sources = /** @type {FoodSource[]} */ ((input.sources || []).filter((s) => s in SOURCE_PHRASES));
  const cultureLines = (input.cultureLines || []).filter((line) => typeof line === 'string' && line.trim());
  const offset = fnv1a32(`foodways|${input.identity}`);
  const held = new Set(sources);
  // The culture's flavour: one of its own sentences, drawn without a draw, kept only when it
  // names no source the place lacks (a fish word only where fish is a source).
  const fitting = cultureLines.filter((line) => sourcesNamedIn(line).every((s) => held.has(s)));
  const flavour = fitting.length ? fitting[offset % fitting.length] : '';
  // No source of its own: the culture's sentence only if it claims none; otherwise a plain
  // sentence that claims nothing about what the place grows.
  if (!sources.length) {
    const claimless = cultureLines.filter((line) => sourcesNamedIn(line).length === 0);
    return claimless.length ? claimless[offset % claimless.length] : 'Meals follow the season and what the household has put by.';
  }
  const frames = sources.length === 1 ? FRAMES.one : sources.length === 2 ? FRAMES.two : FRAMES.more;
  const frame = frames[offset % frames.length];
  // Each slot draws a phrase from its own source's library, without replacement across slots.
  const used = new Set();
  const phrases = sources.slice(0, 3).map((source, slot) => {
    const library = SOURCE_PHRASES[source];
    let pick = (offset + slot) % library.length;
    for (let tries = 0; tries < library.length && used.has(library[pick]); tries += 1) pick = (pick + 1) % library.length;
    used.add(library[pick]);
    return library[pick];
  });
  const own = frame.replace('{A}', phrases[0] || '').replace('{B}', phrases[1] || '').replace('{C}', phrases[2] || '');
  const line = capital(own);
  return flavour ? `${line} ${flavour}` : line;
}

/**
 * THE ONE READER of the foodways line (FOOD-4, lane food-exports, 2026-11-04). The line is
 * composed once, at generation (foodGenerator.js :: generateFoodSecurity → composeFoodwaysLine),
 * and carried on the food record; every surface that prints foodways reads it here — the
 * Economy tab, the PDF's Identity & Daily Life chapter, the Foundry journal's Identity & Daily
 * Life page — and none composes its own. A save older than the record yields null (the PDF then
 * prints the culture's authored line, lane WIRING-2's fallback).
 * @param {unknown} settlement
 * @returns {string | null}
 */
export function foodwaysLineOf(settlement) {
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodwaysLine?: unknown } | null } | null } | null } | null | undefined} */ (settlement);
  const line = s?.economicState?.foodSecurity?.foodRecord?.foodwaysLine;
  return typeof line === 'string' && line.trim() ? line.trim() : null;
}

export default composeFoodwaysLine;
