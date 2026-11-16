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
import { drawDeclared, lineText, resolveSiblingSentences } from './facts/drawDeclared.js';
import { FOODWAYS_PRINT_SIBLINGS } from '../data/foodwaysPrintSiblings.js';
import { liveInstitutions } from './institutions/institutionRoster.js';
import { nativeSemanticName } from './content/customContentSemanticAuthority.js';
import { catchStoppedBySiege } from './facts/catchStopped.js';
import { foodBandShownKey } from './facts/foodBandShown.js';

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
  // BAR3-PLACES-2 (C36357's measure, 2026-11-15): a place's one source of its own is not "most meals" nor what "the table
  // rests on" where its own food is under half (19 and 19 of the census's 720: a besieged fishing thorp at 29%, a metropolis
  // fed 54% by magic): the frame says only that the source is the place's own food (the frame's index kept).
  one: Object.freeze(['Its own food is {A}.', 'What it puts on the table itself is {A}.']),
  // BAR4-HOUSES (the chair's ruling FW1 of 2026-11-16, REVIEW-BAR-4 C33207; vetoable by the owner): the one-source frame
  // where a house of the roster says its households till holdings for their own table and the food record names no grain
  // (`tilledOneFrame`, read where the line prints): it names both, the holdings' own table and the source (the frame's
  // index kept). Never drawn: a print-time reading of the drawn 'one' frame.
  oneTilled: Object.freeze(['Each holding grows for its own table, and beyond that its food is {A}.', 'What each holding grows goes to its own table; beyond that, what it puts on the table itself is {A}.']),
  // BAR5-FOOD (LAW 3's `L3.foodModel`; the chair's standing ruling: the food ledger's figures are not opened, the wording
  // is made true; vetoable by the owner): the one-source frame where a live farmland house of the roster sells its grain
  // and the food record names no grain (`farmedOneFrame`, read where the line prints): it names the fields' grain first
  // (the frame's index kept). Never drawn: a print-time reading of the drawn 'one' frame.
  oneFarmed: Object.freeze(['Its own fields give it grain, and beyond that its food is {A}.', 'Its own fields give it grain; beyond that, what it puts on the table itself is {A}.']),
  two: Object.freeze(['{A} and {B} anchor the table.', 'The table is {A}, with {B} beside it.']),
  more: Object.freeze(['{A} and {B} anchor the table; {C} fills the winter.', 'The table is {A} and {B}, and {C} carries it through the lean months.']),
});

/** Words that claim a source, for reading the culture's own sentence (and the dossier text). */
export const SOURCE_WORDS = Object.freeze({
  grain: /\b(?:grain|grains|breads?|barley|rye|wheat|millet|rice|porridge|pottage)\b/i,
  // "Game meat" is the hunt's, not the herds' (F3 FOOD-WORDS unit 2a): its meat names no livestock. "Herding" is the
  // herds' (R3-CODE-C-10 (a)): "Herding and mixed farming produce ..." stood in 124 of 1,722 towns no herd feeds.
  livestock: /\b(?:(?<!\bgame )meat|milk|dairy|cheese|herds?|herding|livestock|mutton|beef|pork)\b/i,
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
 * R3-CODE-C-10 (b) (the chair's ruling of 2026-11-14, vetoable by the owner): a water the record calls depleted is
 * stopped the same way (`fishedOut`, read by foodwaysLineOf below).
 * BAR5-FOOD (LAW 3's `L3.foodLineStopped`): a catch the siege stops (`facts/catchStopped.js`, the mark leaf's own verdict
 * on the fish trade) is stopped the same way.
 * @param {string} line @param {{ foodSources?: unknown, failedSource?: unknown }} record
 * @param {boolean} [fishedOut] every fish water the place has is depleted, or the siege has stopped the catch
 * @returns {string}
 */
function fedLineOf(line, record, fishedOut = false) {
  const failed = stoppedBy(record.failedSource);
  const stopped = fishedOut && !failed.includes('fish') ? [...failed, /** @type {FoodSource} */ ('fish')] : failed;
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
 * (fedLineOf, R3-CODE-C-9): a source the famine failed is not named as feeding the place. And the economy's own
 * production chains (R3-CODE-C-10 (b)): where every chain row that works one of the place's fish waters (the fishing
 * grounds, the river fishery) calls that water `depleted` (`economicState.activeChains`: the resource's condition the
 * chain carries, the Resources tab's "nothing left worth taking"), the line names no catch. r2r-metropolis-6 (216,641,
 * its river fishery depleted): "Most meals start from the day's catch." (98 of the reader's 1,722 births). The
 * economy is read because every caller hands it (the Economy tab, the PDF, the Foundry journal, the identity record at
 * assembly), so the surfaces cannot disagree; a place with no chain row on its fished-out water is read by the famine
 * alone, as before (2 of the 98: R3-CODE-C-HANDBACK, the tenth seat's FOR THE JOIN).
 * @param {unknown} settlement
 * @returns {string | null}
 */
export function foodwaysLineOf(settlement) {
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodwaysLine?: unknown, foodSources?: unknown, failedSource?: unknown } | null } | null, activeChains?: unknown } | null } | null | undefined} */ (settlement);
  const record = s?.economicState?.foodSecurity?.foodRecord;
  const line = record?.foodwaysLine;
  if (!(typeof line === 'string' && line.trim())) return null;
  const fed = farmedOneFrame(tilledOneFrame(fedLineOf(line.trim(), record || {}, fishedOut(s?.economicState?.activeChains) || catchStoppedBySiege(s)), s), s);
  // BAR4-HOUSES (H1 (iv), (v)): each culture sentence that presumes the market trading or a harvest in store is read
  // against the record it prints from (`data/foodwaysPrintSiblings.js`), its twin printed where refused.
  return resolveSiblingSentences(fed, FOODWAYS_PRINT_SIBLINGS, {
    facts: () => foodwaysFactsOf(s), poolId: 'foodwaysPrintSiblings:FOODWAYS_PRINT_SIBLINGS', surface: 'economics', drawKind: 'T',
  });
}

/**
 * The roster's subsistence holdings, by the names the food land reads them (`generators/foodLand.js :: hasSubsistence`,
 * the same four words, over each live house's native name: a renamed house keeps its kind).
 */
const TILLING_HOUSE = /subsistence|common field|household farm|farming community/;

/**
 * BAR4-HOUSES (the chair's ruling FW1, C33207): THE ONE-SOURCE FRAME AGAINST THE ROSTER. The food record counts grain only
 * where the land has grain fields, so a thorp whose Subsistence farming house says "Each family tills a small holding, all
 * of it for the table" was told "Its own food is game from the woods." (24 of the census's 720, 6 of the fresh 300 at
 * 8aef8e7d46). Where the line is the composer's one-source frame, its one source is not grain or the mill, and the record
 * handed holds a live tilling house, the frame names both (`FRAMES.oneTilled`, the same index; its flavour kept). A record
 * handed without its roster (`{ economicState }` alone) is read as before. Pure.
 * @param {string} line @param {unknown} handed the record handed @returns {string}
 */
function tilledOneFrame(line, handed) {
  const s = /** @type {{ institutions?: unknown } | null | undefined} */ (handed);
  if (!Array.isArray(s?.institutions)) return line;
  for (let i = 0; i < FRAMES.one.length; i += 1) {
    const [head, tail] = FRAMES.one[i].split('{A}');
    if (!line.startsWith(head)) continue;
    const source = /** @type {FoodSource[]} */ (Object.keys(SOURCE_PHRASES)).find((src) => SOURCE_PHRASES[src].some((p) => line.startsWith(`${head}${p}${tail}`)));
    if (!source || source === 'grain' || source === 'mill') return line;
    if (!liveInstitutions(s).some((inst) => TILLING_HOUSE.test(nativeSemanticName(/** @type {object} */ (inst)).toLowerCase()))) return line;
    const phrase = /** @type {string} */ (SOURCE_PHRASES[source].find((p) => line.startsWith(`${head}${p}${tail}`)));
    const rest = line.slice(`${head}${phrase}${tail}`.length);
    return `${FRAMES.oneTilled[i].replace('{A}', phrase)}${rest}`;
  }
  return line;
}

/** The roster's farmland, by the names the food land reads it (`generators/foodLand.js :: hasFarmland`, the same words). */
const FARMING_HOUSE = /farmland|grain field|managed farmland/;

/**
 * BAR5-FOOD (LAW 3's `L3.foodModel`; REVIEW-BAR-5 C39597): THE ONE-SOURCE FRAME AGAINST THE ROSTER'S FARMLAND. The food
 * record counts grain only where the land has grain fields, so a village whose Farmland sells "Grain at harvest" was
 * told "What it puts on the table itself is the hunters' game." (13 of the census's 720, 2 of the fresh 300 at
 * 600b7683a). The ledger's figures stand (the chair's standing ruling); the line is made true: where the line is the
 * composer's one-source frame, its one source is not grain or the mill, and the record handed holds a live farmland
 * house, the frame names the fields' grain first (`FRAMES.oneFarmed`, the same index; its flavour kept). Not under a
 * siege (the outlying fields are the siege's, its own food note) and not where a famine failed the grain or the mill. A
 * line the roster's holdings already answer (`FRAMES.oneTilled`) is left. The two- and three-source frames make the same
 * claim of the whole table: where they name no grain or mill, the fields' clause goes before them (`FARMED_CLAUSE`; 2 of
 * the sixty read towns). A record handed without its roster is read as before. Pure.
 * @param {string} line @param {unknown} handed the record handed @returns {string}
 */
function farmedOneFrame(line, handed) {
  const s = /** @type {{ institutions?: unknown, economicState?: { foodSecurity?: { hasSiege?: unknown, foodRecord?: { failedSource?: unknown } | null } | null } | null } | null | undefined} */ (handed);
  if (!Array.isArray(s?.institutions)) return line;
  const fs = s?.economicState?.foodSecurity;
  if (fs?.hasSiege === true || stoppedBy(fs?.foodRecord?.failedSource).includes('grain')) return line;
  for (let i = 0; i < FRAMES.one.length; i += 1) {
    const [head, tail] = FRAMES.one[i].split('{A}');
    if (!line.startsWith(head)) continue;
    const source = /** @type {FoodSource[]} */ (Object.keys(SOURCE_PHRASES)).find((src) => SOURCE_PHRASES[src].some((p) => line.startsWith(`${head}${p}${tail}`)));
    if (!source || source === 'grain' || source === 'mill') return line;
    if (!liveInstitutions(s).some((inst) => FARMING_HOUSE.test(nativeSemanticName(/** @type {object} */ (inst)).toLowerCase()))) return line;
    const phrase = /** @type {string} */ (SOURCE_PHRASES[source].find((p) => line.startsWith(`${head}${p}${tail}`)));
    const rest = line.slice(`${head}${phrase}${tail}`.length);
    return `${FRAMES.oneFarmed[i].replace('{A}', phrase)}${rest}`;
  }
  // the two- and three-source frames ("{A} and {B} anchor the table", "The table is {A}, with {B} beside it"): the same
  // claim of the whole table, named without the fields' grain; the line keeps its words after the fields' clause.
  if (!/ anchor the table\b|^The table is /.test(line) || sourcesNamedIn(line).some((src) => stoppedBy('grain').includes(src))) return line;
  if (!liveInstitutions(s).some((inst) => FARMING_HOUSE.test(nativeSemanticName(/** @type {object} */ (inst)).toLowerCase()))) return line;
  return `${FARMED_CLAUSE}${line.charAt(0).toLowerCase()}${line.slice(1)}`;
}

/** The fields' clause before a two- or three-source frame (BAR5-FOOD, `farmedOneFrame`). VETOABLE wording. */
const FARMED_CLAUSE = 'Its own fields give it grain; beyond that, ';

/**
 * THE FACTS the foodways sentences are read against: the food record's own readings of the state it was made under, the
 * two the sibling table declares (`data/foodwaysPrintSiblings.js`): the crises (`foodSecurity.hasSiege`,
 * `hasFamine`, written by the food generator from the configuration's crises) and the food band (`foodRecord.band`, the
 * famine home's own field). Every caller hands the economy (the Economics tab, the PDF, the Foundry journal, the identity
 * record at assembly), so all of them read one answer. Spelled here, not read through `facts/factsOf.js`: this module rides
 * the eager engine core and the fact homes are pinned lazy (`tests/architecture/engineCoreLazyEdge.test.js`). Pure.
 * @param {unknown} handed the record handed @returns {object} a facts-like object (`factVocabulary.js :: FactsLike`'s `crisis`, `famine`)
 */
function foodwaysFactsOf(handed) {
  const s = /** @type {{ economicState?: { foodSecurity?: { hasSiege?: unknown, hasFamine?: unknown, foodRecord?: { band?: unknown } | null } | null } | null } | null | undefined} */ (handed);
  const fs = s?.economicState?.foodSecurity;
  const kinds = [...(fs?.hasSiege === true ? ['under_siege'] : []), ...(fs?.hasFamine === true ? ['famine'] : [])];
  const band = fs?.foodRecord?.band;
  return Object.freeze({
    crisis: Object.freeze({ active: kinds.length > 0, has: (/** @type {string} */ kind) => kinds.includes(kind) }),
    // BAR5-FOOD (FD1): the band the page prints beside the ledger's (`facts/foodBandShown.js`), as `famine.js` gives both
    famine: Object.freeze({ band: typeof band === 'string' ? band : null, shownBand: foodBandShownKey(fs?.foodRecord) }),
  });
}

/** The fish waters a place can have (the resource keys foodLand.js :: foodLandOf reads as fishing). */
const FISH_WATERS = Object.freeze(['fishing_grounds', 'river_fish']);

/**
 * Is every fish water the economy's chains work fished out? Each chain row names its resource and its input with
 * their conditions; false where no row works a fish water (a coast fished from a landing names no water the record
 * calls depleted), or where any row finds one standing.
 * @param {unknown} chains the economy's production chains @returns {boolean}
 */
function fishedOut(chains) {
  /** @type {unknown[]} */
  const conditions = [];
  for (const row of Array.isArray(chains) ? chains : []) {
    if (FISH_WATERS.includes(String(row?.resourceKey))) conditions.push(row?.resourceCondition);
    if (FISH_WATERS.includes(String(row?.resourceInputKey))) conditions.push(row?.resourceInputCondition);
  }
  return conditions.length > 0 && conditions.every((condition) => condition === 'depleted');
}

export default composeFoodwaysLine;
