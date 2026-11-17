/**
 * domain/facts/supplyStory.js — THE ONE READING OF A TOWN'S GROUNDS AND OF EACH MATERIAL'S STORY (BIRTH-2, the chair's
 * rulings BR4 and BR5 of 2026-11-17: the owner's rule, "you have multiple way rng to treat these situations"; vetoable by the
 * owner). FOR EACH HOUSE AND ITS MATERIAL THE SEED PICKS ONE STORY, and every part of the page tells it:
 *   local      the land has it (a ground of it on the record, or the ground the house itself proves), and nothing is bought;
 *   bought     the ground used up (or never there) and the town buys the material in (its word on the imports list);
 *   idle       the ground used up and nothing is bought: the house stands idle, marked short;
 *   abandoned  THE OWNER'S FIFTH STORY, VERY RARE: never had it and buys nothing: a venture of an earlier time that failed,
 *              in one of two versions the seed picks ('abandoned': the works stands empty; 'failing': still open, going under).
 * The pick is the kernel's own hash of a keyed string (`<seed>::ground::<key>`, as `steps/resolveResources.js` keys its
 * refills): IT TAKES NO DRAW, and nothing of it is stored (an implied ground is on no field of the record). The odds are the
 * owner's table (`houseKinds.js :: SUPPLY_ODDS`). A record with no seed reads every implied ground as there, every material
 * as bought where the town can trade, and no failed venture.
 *
 * A pure function of the record (its stored land lists, its live houses, its route, its imports) and of the seed handed in
 * (the record's own `_seed`; the birth hands the generator's). Import-free of every module the build pins lazy (EG1).
 *
 * @enforced-by tests/domain/supplyStoryLaw.test.js
 */
import { fnv1a32 } from '../../kernel/proseHash.js';
import { availableNativeResourceKeys, resourceShortageImport } from '../resourceSemantics.js';
import { hasTradeRouteConnection } from '../tradeRouteSemantics.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { SPENT_GROUND_YIELD } from '../../data/crisisDependence.js';
import { BUYS_AND_WORKS, IMPLIED_GROUND, IMPORT_WORD, MATERIAL_OF, RUNS_ON_BOUGHT, SOURCE_GROUNDS, SUPPLY_ODDS, TAKERS } from './houseKinds.js';

/**
 * @typedef {{
 *   _seed?: unknown,
 *   config?: { nearbyResources?: unknown, nearbyResourcesDepleted?: unknown, tradeRouteAccess?: unknown,
 *     terrainOverride?: unknown, [key: string]: unknown } | null,
 *   economicState?: { primaryImports?: unknown } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
 * }} StoryRecord the saved record, or the generator's record in the making (the same fields)
 */

/** @typedef {'local' | 'bought' | 'idle' | 'abandoned'} Story */
/** @typedef {{ name: string, id: string, family: string, venture: 'abandoned' | 'failing', ground: string }} Venture */

/** The noun of a material family, as the Depleted list's grounds yield it (`SPENT_GROUND_YIELD`) and the lines name it. */
export const FAMILY_NOUN = Object.freeze(/** @type {Record<string, string>} */ ({
  timber: 'timber', ironOre: 'iron ore', livestock: 'livestock', stone: 'stone', desertSalt: 'salt', clay: 'clay',
  grain: 'grain', fish: 'fish', herbs: 'herbs', grapes: 'grapes', sand: 'glass sand', peat: 'reeds', wool: 'wool', hides: 'hides',
}));

/**
 * The families a house can be a failed venture of as a BUYER: a material no ground of the record gives by the Depleted
 * list's yields and no food record or open road answers by itself (the food goods, the goods that come by any route and the
 * luxury trade's goods are left out: their reader answers them by the food record, the road or the trade, not by a ground).
 */
const VENTURE_BUYER_FAMILIES = Object.freeze(['ironOre', 'timber', 'clay', 'hides', 'wool', 'herbs']);

/** @param {unknown} x @returns {string} */
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));
/** @param {unknown} x @returns {unknown[]} */
const arr = (x) => (Array.isArray(x) ? x : []);
/** @param {unknown} x an import or a word: its bracketed reason struck, one spacing, lower case */
const struck = (x) => str(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
/** A row a user authored (custom content). @param {{ custom?: unknown, source?: unknown, isCustom?: unknown } | null | undefined} row */
const isCustom = (row) => row?.custom === true || row?.source === 'custom' || row?.isCustom === true;
/** @param {{ name?: unknown, catalogId?: unknown } | null | undefined} inst @returns {string} the catalogue id */
export const idOfHouse = (inst) => String((typeof inst?.catalogId === 'string' && inst.catalogId) || catalogIdForName(str(inst?.name)) || '');

/**
 * THE ONE READING OF THE SEED, for the birth and for the print (the chair's ruling BR7 of 2026-11-17, condition 1): the
 * pipeline's seed as a string; an absent seed reads as the empty string in both, so a planted record with no seed is still
 * told one story (every implied ground there, every material bought where the town can trade, no failed venture).
 * @param {unknown} seed @returns {string}
 */
export const storySeed = (seed) => (seed == null ? '' : String(seed));

/**
 * THE SEED'S OWN PICK: `<seed>::<key>`, hashed, falls within `n` of the odds' `outOf`. The empty seed: null (the default).
 * @param {unknown} seed @param {string} key @param {number} n @returns {boolean | null}
 */
export function seedPicks(seed, key, n) {
  const s = storySeed(seed);
  if (s === '') return null;
  return (fnv1a32(`${s}::${key}`) % SUPPLY_ODDS.outOf) < n;
}

/** The seed of a record (its own `_seed`, which the pipeline sets to the seed it handed the birth). @param {StoryRecord | null | undefined} record */
export const seedOfRecord = (record) => storySeed(record?._seed);

/** The live native houses of the record (a ruined or closed house proves nothing; a custom row proves nothing). @param {StoryRecord | null | undefined} record */
function liveNative(record) {
  return liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record))
    .filter((i) => !!i && typeof i.name === 'string' && !!i.name && !isCustom(/** @type {{ custom?: unknown }} */ (i)));
}

/** The stored grounds: every key on the record, the live ones, the spent ones. @param {StoryRecord | null | undefined} record */
function storedGrounds(record) {
  const config = record?.config || {};
  const spent = arr(config.nearbyResourcesDepleted).map(str).filter(Boolean);
  const live = /** @type {string[]} */ (availableNativeResourceKeys(/** @type {Record<string, unknown>} */ (config)));
  const all = new Set([...arr(config.nearbyResources).map(str).filter(Boolean), ...live, ...spent]);
  return { all, live: new Set(live), spent: new Set(spent) };
}

/** One reading a record object and a seed. @type {WeakMap<object, Map<string, { states: Map<string, 'there' | 'used'>, houses: Map<string, string[]> }>>} */
const IMPLIED_OF = new WeakMap();

/**
 * (a) THE GROUNDS THE HOUSES IMPLY: for each live native source house on no ground of its own on the record (live or
 * spent), the ground it proves (`IMPLIED_GROUND`), whose state the seed picks BY THE GROUND (two houses of one ground share
 * it): there (`groundThere` of 60) or used up. The roll table's denial does not unseat it (the audit's W2).
 * @param {StoryRecord | null | undefined} record @param {unknown} [seed]
 * @returns {{ states: Map<string, 'there' | 'used'>, houses: Map<string, string[]> }} ground -> its state; ground -> the houses proving it
 */
export function impliedGroundsOf(record, seed = seedOfRecord(record)) {
  const empty = { states: new Map(), houses: new Map() };
  if (!record || typeof record !== 'object') return empty;
  let bySeed = IMPLIED_OF.get(record);
  const k = storySeed(seed);
  const cached = bySeed?.get(k);
  if (cached) return cached;
  const { all } = storedGrounds(record);
  /** @type {Map<string, string[]>} */
  const houses = new Map();
  for (const inst of liveNative(record)) {
    const id = idOfHouse(inst);
    if (!Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id)) continue;
    if (SOURCE_GROUNDS[id].some((g) => all.has(g))) continue; // a ground of its own is on the record: the record speaks
    const ground = IMPLIED_GROUND[id];
    if (!houses.has(ground)) houses.set(ground, []);
    /** @type {string[]} */ (houses.get(ground)).push(/** @type {string} */ (inst.name));
  }
  /** @type {Map<string, 'there' | 'used'>} */
  const states = new Map();
  for (const ground of [...houses.keys()].sort()) states.set(ground, seedPicks(seed, `ground::${ground}`, SUPPLY_ODDS.groundThere) === false ? 'used' : 'there');
  const out = { states, houses };
  if (!bySeed) { bySeed = new Map(); IMPLIED_OF.set(record, bySeed); }
  bySeed.set(k, out);
  return out;
}

/** The word the imports list holds for a family's material ("Timber", "Salt"); '' where the list has none. @param {string} family */
export const familyWord = (family) => (family === 'desertSalt' ? RUNS_ON_BOUGHT.salt_works : (Object.prototype.hasOwnProperty.call(IMPORT_WORD, family) ? IMPORT_WORD[family] : ''));

/** Whether a ground gives a family's material (by the yield the Depleted list reads). @param {string} ground @param {string} family */
const groundGives = (ground, family) => !!FAMILY_NOUN[family] && Object.prototype.hasOwnProperty.call(SPENT_GROUND_YIELD, ground) && SPENT_GROUND_YIELD[ground] === FAMILY_NOUN[family];

/**
 * A ground of the family's material that is USED UP (stored spent with no live ground of that material, or implied and
 * picked used up), or ''. @param {StoryRecord | null | undefined} record @param {string} family @param {unknown} [seed]
 */
export function usedGroundOf(record, family, seed = seedOfRecord(record)) {
  const { live, spent } = storedGrounds(record);
  if ([...live].some((g) => groundGives(g, family))) return '';
  const implied = impliedGroundsOf(record, seed);
  if ([...implied.states].some(([g, st]) => st === 'there' && groundGives(g, family))) return '';
  const used = [...spent].filter((g) => groundGives(g, family)).sort();
  if (used.length) return used[0];
  return [...implied.states].filter(([g, st]) => st === 'used' && groundGives(g, family)).map(([g]) => g).sort()[0] || '';
}

/** Whether the record's imports already bring a word's good (the word, its bracketed reason struck). @param {StoryRecord | null | undefined} record @param {string} word */
export const importsHold = (record, word) => !!word && arr(record?.economicState?.primaryImports).some((x) => struck(x) === struck(word));

/**
 * (b) WHETHER A MATERIAL IS BOUGHT IN, by its import word (every house of that material shares the answer): yes where the
 * record's imports already bring it (a fact of the record is never unsaid); else on a route connected in ordinary times (a
 * siege changes nothing here): a used-up ground: the seed's pick (`<seed>::bought::<the word>`, `boughtIn` of 60); never
 * there: yes; on an isolated route: no.
 * @param {StoryRecord | null | undefined} record @param {string} word @param {boolean} usedUp @param {unknown} [seed]
 */
export function boughtIn(record, word, usedUp, seed = seedOfRecord(record)) {
  if (importsHold(record, word)) return true;
  if (!word || !hasTradeRouteConnection(str(record?.config?.tradeRouteAccess))) return false;
  if (!usedUp) return true;
  return seedPicks(seed, `bought::${word}`, SUPPLY_ODDS.boughtIn) !== false;
}

/** On a coast the sea is the salt works' brine (BIRTH-1's R5). @param {StoryRecord | null | undefined} record */
const onCoast = (record) => str(record?.config?.tradeRouteAccess) === 'port' || str(record?.config?.terrainOverride) === 'coastal';

/**
 * (c) THE STORY OF A SOURCE HOUSE AND ITS MATERIAL (`SOURCE_GROUNDS`), the failed venture aside (`ventureOf`), or null
 * where this reading says nothing (a kind of the second ring on no ground of its own: as before).
 * @param {StoryRecord | null | undefined} record @param {{ name?: unknown, catalogId?: unknown } | null | undefined} inst
 * @param {unknown} [seed]
 * @returns {{ story: Story, ground: string, word: string } | null} ground: the used-up ground an idle or bought house stands on; word: the word bought
 */
export function sourceStoryOf(record, inst, seed = seedOfRecord(record)) {
  const id = idOfHouse(inst);
  if (!Object.prototype.hasOwnProperty.call(SOURCE_GROUNDS, id)) return null;
  const { all, live, spent } = storedGrounds(record);
  const own = SOURCE_GROUNDS[id];
  const runs = Object.prototype.hasOwnProperty.call(RUNS_ON_BOUGHT, id);
  /** @param {string} ground the used-up ground @returns {{ story: Story, ground: string, word: string }} */
  const usedUp = (ground) => {
    if (TAKERS.has(id) || !runs) return { story: 'idle', ground, word: '' };
    const word = str(resourceShortageImport(ground)) || RUNS_ON_BOUGHT[id];
    // the plain word on the list answers too ("Timber" bought for the cooper is the burner's cordwood)
    return boughtIn(record, word, true, seed) || importsHold(record, RUNS_ON_BOUGHT[id]) ? { story: 'bought', ground, word } : { story: 'idle', ground, word: '' };
  };
  if (own.some((g) => live.has(g))) return { story: 'local', ground: '', word: '' };
  const spentOwn = own.filter((g) => spent.has(g)).sort();
  if (id === 'salt_works' && onCoast(record) && !spentOwn.length) return { story: 'local', ground: '', word: '' };
  if (own.some((g) => all.has(g))) return spentOwn.length ? usedUp(spentOwn[0]) : null;
  if (Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id)) {
    const ground = IMPLIED_GROUND[id];
    return impliedGroundsOf(record, seed).states.get(ground) === 'used' ? usedUp(ground) : { story: 'local', ground: '', word: '' };
  }
  if (id === 'salt_works') { // off the coast, on no salt ground: never there, bought in where the town can trade
    const word = RUNS_ON_BOUGHT.salt_works;
    return boughtIn(record, word, false, seed) ? { story: 'bought', ground: '', word } : { story: 'idle', ground: '', word: '' };
  }
  return null;
}

/** One failed venture a record object and a seed. @type {WeakMap<object, Map<string, Venture | null>>} */
const VENTURE_OF = new WeakMap();

/**
 * (d) THE FAILED VENTURE, THE OWNER'S FIFTH STORY: "never had it and buys nothing" as a CHOSEN story of ONE house. The seed
 * may pick it (`<seed>::abandoned::<catalogue id>`, `abandoned` of 60) only for
 *   (i)  a house that is THE ONLY LIVE HOUSE OF ITS TOWN OF A MATERIAL THE TOWN NEVER HAD (no ground of it on the record or
 *        implied, none of it on the imports), in place of buying it in (so only where the town can trade): a buyer the one
 *        reader leaves without its input (`inputMissing`, the reader's own answer before this story), or the salt works off
 *        the coast;
 *   (ii) a source house on no ground of its own that alone proves its ground and alone works its material, in place of that
 *        ground.
 * Never two in one town (the first by catalogue id keeps it); never a house whose material another live house uses (a whole
 * trade is not abandoned). Which of the two versions is the seed's pick too (`<seed>::venture::<catalogue id>`, half and half).
 * @param {StoryRecord | null | undefined} record
 * @param {(inst: Record<string, unknown>, family: string) => boolean} inputMissing the one reader's answer for a buyer
 * @param {unknown} [seed]
 * @returns {Venture | null}
 */
export function ventureOf(record, inputMissing, seed = seedOfRecord(record)) {
  const k = storySeed(seed);
  if (!record || typeof record !== 'object' || k === '') return null;
  let bySeed = VENTURE_OF.get(record);
  if (bySeed?.has(k)) return /** @type {Venture | null} */ (bySeed.get(k));
  const houses = liveNative(record);
  /** @type {Map<string, number>} */
  const users = new Map();
  for (const h of houses) { const f = MATERIAL_OF[idOfHouse(h)]; if (f) users.set(f, (users.get(f) || 0) + 1); }
  const { all } = storedGrounds(record);
  const implied = impliedGroundsOf(record, seed);
  const connected = hasTradeRouteConnection(str(record?.config?.tradeRouteAccess));
  /** @type {Array<{ inst: Record<string, unknown>, id: string, family: string, ground: string }>} */
  const candidates = [];
  for (const inst of houses) {
    const id = idOfHouse(inst);
    const family = MATERIAL_OF[id] || '';
    if (!family || users.get(family) !== 1) continue;
    const never = ![...all].some((g) => groundGives(g, family)) && ![...implied.states.keys()].some((g) => groundGives(g, family));
    if (BUYS_AND_WORKS.has(id) && VENTURE_BUYER_FAMILIES.includes(family)) {
      if (connected && never && !importsHold(record, familyWord(family)) && inputMissing(inst, family)) candidates.push({ inst, id, family, ground: '' });
    } else if (id === 'salt_works') {
      if (connected && !onCoast(record) && !SOURCE_GROUNDS.salt_works.some((g) => all.has(g)) && !importsHold(record, familyWord(family))) candidates.push({ inst, id, family, ground: '' });
    } else if (Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id)) {
      const ground = IMPLIED_GROUND[id];
      if (arr(implied.houses.get(ground)).length === 1 && arr(implied.houses.get(ground))[0] === inst.name) candidates.push({ inst, id, family, ground });
    }
  }
  candidates.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const hit = candidates.find((c) => seedPicks(seed, `abandoned::${c.id}`, SUPPLY_ODDS.abandoned) === true);
  /** @type {Venture | null} */
  const out = hit ? { name: str(hit.inst.name), id: hit.id, family: hit.family, ground: hit.ground,
    venture: fnv1a32(`${k}::venture::${hit.id}`) % 2 === 0 ? 'abandoned' : 'failing' } : null;
  if (!bySeed) { bySeed = new Map(); VENTURE_OF.set(record, bySeed); }
  bySeed.set(k, out);
  return out;
}

/**
 * THE GROUNDS OF THE TOWN AS THE PAGE READS THEM: the implied grounds (there, or used up), the failed venture's ground left
 * out (it proves nothing: it failed). @param {StoryRecord | null | undefined} record @param {Venture | null} venture
 * @param {unknown} [seed] @returns {{ there: string[], used: string[] }}
 */
export function impliedGroundsShown(record, venture, seed = seedOfRecord(record)) {
  const { states, houses } = impliedGroundsOf(record, seed);
  const shown = [...states].filter(([g]) => !(venture && venture.ground === g && arr(houses.get(g)).length === 1));
  return { there: shown.filter(([, st]) => st === 'there').map(([g]) => g), used: shown.filter(([, st]) => st === 'used').map(([g]) => g) };
}

/** THE FAILED VENTURE'S MARK (the owner: "Say abandoned or failing: a failed venture."). VETOABLE wording. @param {Venture | null | undefined} v */
export const ventureMarkText = (v) => (!v ? null : v.venture === 'failing' ? 'Failing: a failed venture.' : 'Abandoned: a failed venture.');

/**
 * THE FAILED VENTURE'S ONE LINE, after the gap line (the gap line keeps its words). VETOABLE wording.
 * @param {Venture | null | undefined} v @param {string} house the house as the sentence names it ("the potter")
 */
export function ventureLineText(v, house) {
  if (!v) return null;
  const material = FAMILY_NOUN[v.family] || 'material';
  const head = house.charAt(0).toUpperCase() + house.slice(1);
  return v.venture === 'failing'
    ? `${head} is failing: no ${material} lies near and none is brought in.`
    : `${head} stands abandoned, a venture of an earlier time: no ${material} lies near and none is brought in.`;
}
