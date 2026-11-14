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
import { drawDeclared, lineText } from './facts/drawDeclared.js';

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

/** A market named as the place's own ("markets", "market tolls"); a black market is not one. */
export const MARKET_WORDS = /(?<!black )\bmarkets?\b/i;

/**
 * Sellers a line names as the place's own ("neighborhood vendors", stalls, hawkers): a market's people, so they stand
 * only where a market does (R3-CODE-C-3, ROUND-3-CUT-INCREMENT #ww-707, rww-thorp-monster_pressure-1: "Public ovens,
 * neighborhood vendors, and shared dining customs make food distribution visibly civic." in a thorp of 28 whose
 * Overview says "No market or fair stands").
 */
const SELLER_WORDS = /\b(?:vendors?|stalls?|hawkers?)\b/i;

/** May a culture line stand in a place with (or without) a market? @param {string} line @param {boolean | undefined} market */
const marketFits = (line, market) => market !== false || !(MARKET_WORDS.test(line) || SELLER_WORDS.test(line));

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
 * ⭐ CENSUS-1d unit 2 (Appendix B row 111, kind H): the frame and each slot's phrase are drawn
 * over the FULL library exactly as before (the fnv offset; the without-replacement probe walks
 * the same library, comparing texts) and resolved through `drawDeclared`, noted in the ledger as
 * `FOODWAYS.FRAMES.<one|two|more>` / `FOODWAYS.SOURCE_PHRASES.<source>`. `input.facts` answers a
 * declared line (a birth in progress hands `birthFactsOf`; none = a declared line is refused).
 * @param {{ sources: ReadonlyArray<string>, cultureLines?: ReadonlyArray<string> | null, identity: string,
 *   facts?: object|null|(() => object|null), market?: boolean }} input the market home's answer in `market`
 * @returns {string}
 */
export function composeFoodwaysLine(input) {
  const sources = /** @type {FoodSource[]} */ ((input.sources || []).filter((s) => s in SOURCE_PHRASES));
  const cultureLines = (input.cultureLines || []).filter((line) => typeof line === 'string' && line.trim());
  const offset = fnv1a32(`foodways|${input.identity}`);
  const held = new Set(sources);
  // The culture's flavour: one of its own sentences, drawn without a draw, kept only when it
  // names no source the place lacks (a fish word only where fish is a source), and — COHERENCE-AGREE-3
  // (REVIEW-AGREE F6) — no market where the market home says there is none (`input.market === false`;
  // a caller that does not say keeps every line, as before).
  const fitting = cultureLines.filter((line) => sourcesNamedIn(line).every((s) => held.has(s)) && marketFits(line, input.market));
  const flavour = fitting.length ? fitting[offset % fitting.length] : '';
  // No source of its own: the culture's sentence only if it claims none; otherwise a plain
  // sentence that claims nothing about what the place grows.
  if (!sources.length) {
    const claimless = cultureLines.filter((line) => sourcesNamedIn(line).length === 0 && marketFits(line, input.market));
    return claimless.length ? claimless[offset % claimless.length] : 'Meals follow the season and what the household has put by.';
  }
  const frameKey = sources.length === 1 ? 'one' : sources.length === 2 ? 'two' : 'more';
  const frames = FRAMES[frameKey];
  const facts = input.facts ?? null;
  const frame = String(lineText(drawDeclared(frames, {
    draw: (p) => p[offset % p.length], facts, key: `foodways|${input.identity}`,
    poolId: `FOODWAYS.FRAMES.${frameKey}`, surface: 'economics', drawKind: 'H',
  }).line) ?? '');
  // Each slot draws a phrase from its own source's library, without replacement across slots.
  /** @type {Set<string>} */
  const used = new Set();
  const phrases = sources.slice(0, 3).map((source, slot) => {
    const drawn = drawDeclared(SOURCE_PHRASES[source], {
      draw: (library) => {
        let pick = (offset + slot) % library.length;
        for (let tries = 0; tries < library.length && used.has(String(lineText(library[pick]))); tries += 1) pick = (pick + 1) % library.length;
        return library[pick];
      },
      facts, key: `foodways|${input.identity}|${slot}`,
      poolId: `FOODWAYS.SOURCE_PHRASES.${source}`, surface: 'economics', drawKind: 'H',
    });
    const phrase = drawn.line == null ? '' : String(lineText(drawn.line));
    used.add(phrase);
    return phrase;
  });
  const own = frame.replace('{A}', phrases[0] || '').replace('{B}', phrases[1] || '').replace('{C}', phrases[2] || '');
  const line = capital(own);
  return flavour ? `${line} ${flavour}` : line;
}

/** The composer's own sentence for a place no source of its own feeds (composeFoodwaysLine, above). */
const NO_SOURCE_LINE = 'Meals follow the season and what the household has put by.';

/**
 * The sources a famine's failure stops (the food record's `failedSource`): the failed one, and grain and the mill
 * together, one type (the mill grinds the grain: foodGenerator.js's one food-source count, resourceGenerator.js ::
 * FAILED_SOURCE_CHAIN). @param {unknown} failed @returns {FoodSource[]}
 */
const stoppedBy = (failed) => (failed === 'grain' || failed === 'mill' ? ['grain', 'mill']
  : typeof failed === 'string' && failed in SOURCE_PHRASES ? [/** @type {FoodSource} */ (failed)] : []);

/**
 * The composer's own sentence read back from a stored line: the frame's index and each slot's phrase, as
 * composeFoodwaysLine wrote them over `sources` (largest first, three slots at most), and the culture's sentence after
 * it. Null where the line is not the composer's (an old save, a hand-edited line). Pure: it tries the libraries' few
 * phrases, no draw.
 * @param {string} line @param {FoodSource[]} sources
 * @returns {{ frameIndex: number, phrases: string[], flavour: string } | null}
 */
function readOwnSentence(line, sources) {
  const slots = sources.slice(0, 3);
  if (!slots.length) return null;
  const frames = FRAMES[slots.length === 1 ? 'one' : slots.length === 2 ? 'two' : 'more'];
  /** @type {string[][]} */
  let combos = [[]];
  for (const source of slots) combos = combos.flatMap((c) => SOURCE_PHRASES[source].filter((p) => !c.includes(p)).map((p) => [...c, p]));
  for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
    for (const phrases of combos) {
      const own = capital(frames[frameIndex].replace('{A}', phrases[0] || '').replace('{B}', phrases[1] || '').replace('{C}', phrases[2] || ''));
      if (line === own) return { frameIndex, phrases, flavour: '' };
      if (line.startsWith(`${own} `)) return { frameIndex, phrases, flavour: line.slice(own.length + 1).trim() };
    }
  }
  return null;
}

/**
 * R3-CODE-C-9 (the bar's n80; the chair's ruling of 2026-11-14, vetoable by the owner): A LINE THAT NAMES WHERE THE
 * FOOD COMES FROM READS THE FOOD RECORD. A source a famine failed is not named as feeding the place: the line keeps the
 * phrases it drew for the sources that still feed it, in its own frame at the smaller count (the same frame index), and
 * the culture's sentence only where that names none of the failed sources; where no source still feeds it, the
 * composer's own no-source answer (the culture's sentence if it claims no source, else NO_SOURCE_LINE). Agiospolis
 * (bar0-city-under_siege+famine-rand-1): "The table rests on fish from the local waters." beside `failedSource: "fish"`
 * (99 of the reader's 1,722 births: every famine). A line that does not name a failed source is returned as stored.
 * @param {string} line @param {{ foodSources?: unknown, failedSource?: unknown }} record
 * @returns {string}
 */
function fedLineOf(line, record) {
  const stopped = stoppedBy(record.failedSource);
  if (!stopped.length || !sourcesNamedIn(line).some((s) => stopped.includes(s))) return line;
  const sources = /** @type {FoodSource[]} */ ((Array.isArray(record.foodSources) ? record.foodSources : []).filter((s) => s in SOURCE_PHRASES));
  const read = readOwnSentence(line, sources);
  const flavour = read && read.flavour && !sourcesNamedIn(read.flavour).some((s) => stopped.includes(s)) ? read.flavour : '';
  const kept = read ? read.phrases.filter((_, slot) => !stopped.includes(sources[slot])) : [];
  if (!kept.length) return flavour && sourcesNamedIn(flavour).length === 0 ? flavour : NO_SOURCE_LINE;
  const frames = FRAMES[kept.length === 1 ? 'one' : kept.length === 2 ? 'two' : 'more'];
  const own = capital(frames[/** @type {{ frameIndex: number }} */ (read).frameIndex % frames.length]
    .replace('{A}', kept[0] || '').replace('{B}', kept[1] || '').replace('{C}', kept[2] || ''));
  return flavour ? `${own} ${flavour}` : own;
}

/**
 * THE ONE READER of the foodways line (FOOD-4, lane food-exports, 2026-11-04). The line is
 * composed once, at generation (foodGenerator.js :: generateFoodSecurity → composeFoodwaysLine),
 * and carried on the food record; every surface that prints foodways reads it here — the
 * Economy tab, the PDF's Identity & Daily Life chapter, the Foundry journal's Identity & Daily
 * Life page — and none composes its own. A save older than the record yields null (the PDF then
 * prints the culture's authored line, lane WIRING-2's fallback). It reads the same record's famine
 * (fedLineOf, R3-CODE-C-9): a source the famine failed is not named as feeding the place.
 * @param {unknown} settlement
 * @returns {string | null}
 */
export function foodwaysLineOf(settlement) {
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodwaysLine?: unknown, foodSources?: unknown, failedSource?: unknown } | null } | null } | null } | null | undefined} */ (settlement);
  const record = s?.economicState?.foodSecurity?.foodRecord;
  const line = record?.foodwaysLine;
  return typeof line === 'string' && line.trim() ? fedLineOf(line.trim(), record || {}) : null;
}

export default composeFoodwaysLine;
