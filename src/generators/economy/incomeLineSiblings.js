/**
 * economy/incomeLineSiblings.js — THE INCOME LINES THAT NAME THE TOWN'S OWN LAND OR STORES, DECLARED
 * (COHERENCE-AGREE-3, 2026-11-12; the charter's §0.8: every new or changed line is declared from its
 * birth). `economicState.js :: generateEconomicState` prints these from inline branches gated on the
 * town's live resources (economy/localMaterials.js) and on the food record's one surplus rule
 * (`domain/foodSurplus.js :: offersFoodSurplus`). The vocabulary has no atom for a mineral deposit, so
 * a set declares the atoms it can name; the resource gate is held by the coherence receipt's
 * agreement arm (generationCoherence.js :: projectionAgreementFindings, its income members), which reads
 * every printed line against the town's resources and its food record. Keyed by the printed text.
 */

// BAR8 J-INCOME item 1: the trade's ordinary lines and their reader, in an import-free leaf the printed export may read; re-exported
// under the same names, so no importer of this module changes
import { CLOTH_SHORT_LINE, CLOTH_WORKED_LINE, LOCAL_COAL_LINE, LOCAL_ORE_LINE, IRON_IMPORTED_LINE, METAL_WORKED_LINE, METAL_SHORT_LINE, METAL_FORGE_IDLE_LINE, TIMBER_PLAIN_LINE, TIMBER_SAWN_LINE, TIMBER_SHORT_LINE, FORGE_HOUSE_WORDS, ordinaryIncomeLineOf } from '../../domain/display/incomeOrdinaryLines.js';
export { CLOTH_SHORT_LINE, CLOTH_WORKED_LINE, LOCAL_COAL_LINE, LOCAL_ORE_LINE, IRON_IMPORTED_LINE, METAL_WORKED_LINE, METAL_SHORT_LINE, METAL_FORGE_IDLE_LINE, TIMBER_PLAIN_LINE, TIMBER_SAWN_LINE, TIMBER_SHORT_LINE, FORGE_HOUSE_WORDS, ordinaryIncomeLineOf };

/** The grain line that sells a surplus, and its twin for a town whose own fields do not cover what it eats. */

export const GRAIN_SURPLUS_LINE = 'Surplus from local harvest sold to nearby settlements and passing merchants: steady income tied to the growing season.';
export const GRAIN_OWN_FIELDS_LINE = 'Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements.';

/** Its twin where the roster holds no forge house (COHERENCE-AGREE-8, REVIEW-AGREE-3 T3). UPKEEP-10 (the row banked at
 * point 49, `after-base: defence`): it names no forge, here or elsewhere; it says what its gate makes true (coal among
 * the exports, no siege: `trueIncomeDesc`). */
export const LOCAL_COAL_SOLD_LINE = 'Coal is dug here and sold on to other towns, so this income stream leans on the trade route.';

export const INCOME_LINE_SIBLINGS = Object.freeze({
  // F7 (REVIEW-AGREE): "surplus" only where the food record holds one — the site's gate is
  // offersFoodSurplus (grows more than it eats, and no famine); the twin is what is true otherwise.
  [GRAIN_SURPLUS_LINE]: Object.freeze([
    Object.freeze({ text: GRAIN_SURPLUS_LINE, needs: Object.freeze(['grain']), excludes: Object.freeze(['famine']) }),
    Object.freeze({ text: GRAIN_OWN_FIELDS_LINE, twinOf: GRAIN_SURPLUS_LINE, needs: Object.freeze(['grain']) }),
  ]),
  // F13 (REVIEW-AGREE): cure 7's coal line, declared from its birth at last. It says the iron is bought in, so
  // it needs the town's imports; the coal gate is the site's (the agreement arm reads the town's resources).
  // COHERENCE-AGREE-8 (REVIEW-AGREE-3 T3): the line says the forges burn the coal, so the site prints it only where
  // the roster holds a forge house (FORGE_HOUSE_WORDS); the twin, where none does, says the coal is sold on.
  [LOCAL_COAL_LINE]: Object.freeze([
    Object.freeze({ text: LOCAL_COAL_LINE, needs: Object.freeze(['imports']) }),
    Object.freeze({ text: LOCAL_COAL_SOLD_LINE, twinOf: LOCAL_COAL_LINE, needs: Object.freeze(['imports']) }),
  ]),
});

// ── UPKEEP-8 (2026-11-13; the round-three cut's income lines, #439 #1248 #145 #277 #438 #621 #910 #437 #501 #1301
// #ww-414, and round two's #257). THE CHAIR'S RULING: an income line says only what the record holds; it names a
// trade only where the roster holds a house of that trade (an apothecary is not an alchemist); under a siege nothing
// is bought in or sold out by road; an impaired chain is not described as working. Each original below prints from
// its branch in economicState.js by its constant; `trueIncomeDesc` reads the finished record (the roster, the
// siege, the final trade lists, the chains' states) and gives the declared twin where the original is false, or ''
// where no true line is held (the row prints its source and share alone: silence is not a false sentence).
// BAR4-CORPUS-ECO (REVIEW-BAR-4 C38176, WEAK: one word): "thriving" said of the smallest income share in every one of the 70
// towns of the census's 720 that print the line (8aef8e7d4): the degree word goes, the trade and its customers stay.
export const ALCHEMY_TRADE_LINE = 'An alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.';
export const ALCHEMIST_SUPPLEMENTS_LINE = 'Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade.';
export const ALCHEMY_UNDER_SIEGE_LINE = 'Alchemical preparations and curative potions, sold only to the people inside while the siege keeps outside customers away.';
export const REMEDIES_LINE = 'Remedies and simple preparations, made and sold here: a modest trade.';
export const REMEDIES_SHORT_LINE = 'Remedies and preparations are made here, but few, while the herbs and reagents they need run short.';
export const GRAIN_BOUGHT_LINE = 'Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes.';
export const WOOL_LOCAL_LINE = 'Local flocks provide raw wool; weavers and fullers convert it to cloth sold across the region.';
export const WOOL_LOCAL_WORKED_LINE = 'Local flocks provide raw wool, and cloth is woven or finished here.';
export const WOOL_BOUGHT_LINE = 'Wool bought from pastoral regions and processed locally: value-add trade dependent on consistent supply.';
export const FISH_EXPORT_LINE = 'Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.';
export const FISH_LANDED_LINE = 'Catch landed here and sold fresh or preserved.';
export const FISH_SOLD_LINE = 'Fish is sold here, fresh or preserved.';
/** The fish lines' twin where every fishery near the place is fished out and salted fish is bought in (D5; #77). */
export const FISH_BOUGHT_LINE = 'The fishery here is fished out; the fish sold now is salted and bought in.';
/** BAR4-CORPUS-ECO (the chair's FS1 and CORPUS-DEF's measure, 2026-11-16: 13 of the 19 towns of the 720 that print the bought line at
 * 8aef8e7d4 work a fishing chain the rites hold up, `magicRecovery` > 0, still running): the grounds are spent and the catch still comes. */
export const FISH_RITES_LINE = 'The waters here are worked thin; rites keep the catch coming, and it is landed and sold here.';
/** The entrepôt row's line (tradeGoods.js prints it) and its twin where no warehouse, toll, customs or caravan house
 * stands (TAIL-DEFECON-3, #07231, X9 29522): goods still pass through the crossroads; no house collects a duty on them. */
export const ENTREPOT_LINE = 'Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads.';
export const ENTREPOT_PLAIN_LINE = 'Goods passing through the crossroads, and what their traders spend while they stop.';
export const QUARRY_LINE = 'Local quarry provides dressed stone to regional builders: reliable income with low transport overhead.';
/** The quarry line's twin where the place sells no stone (TAIL-DEFECON-3, #18655): the quarry stands, its stone stays. */
export const QUARRY_OWN_LINE = 'Stone is quarried here for the place\'s own building.';
export const MASONS_LINE = 'Stone masons work imported material; the quarrying income notation reflects processing margin only.';
/** The tithes line declared on its own text (it names the faith's house), then its constant. */
const TITHES_RENTS_SET = Object.freeze([
  Object.freeze({ text: 'Mandatory tithes plus rent income from church-owned land dominating the local economy.', needs: Object.freeze(['sacredHouse']) }),
]);
export const TITHES_RENTS_LINE = TITHES_RENTS_SET[0].text;
export const TITHES_RENTS_PLAIN_LINE = 'Mandatory tithes, and rents from land the faith owns.';
// The census's lines in this family (CENSUS-2, the chair's message of 2026-11-13): sawmilling where no sawmill stands;
// trade by road, by sea or in transit under a siege.
export const TIMBER_LINE = 'Local forest provides sustainable timber revenue; managed felling and sawmilling keep production consistent.';
export const TIMBER_MANAGED_LINE = 'Local forest provides sustainable timber revenue; managed felling keeps production consistent.';
export const TIMBER_BOUGHT_LINE = 'Timber sourced from more distant forests and resold or processed locally: trade route dependent.';
/** The market-day line, declared on its own text (it names the market; economicState.js prints its literal, registered there). */
const MARKET_DAY_SET = Object.freeze([Object.freeze({ text: 'Market day stall fees and toll collection on goods entering the market.', needs: Object.freeze(['market']), excludes: Object.freeze(['crisis: under_siege']) })]);
export const MARKET_DAY_LINE = MARKET_DAY_SET[0].text;
// TAIL-DEFECON-2 (D10, the chair's ruling of 2026-11-15): a small place that stands no lord's steward or reeve pays no
// rent to anyone: its row is its own harvest (the name and the line claim no rent and no tenant).
export const OWN_HARVEST_LINE = 'What the households grow and raise on their holdings; the main living at this scale.';
// TAIL-DEFECON-2 (D14, the chair's ruling of 2026-11-15): pilgrims come to a house of pilgrimage: a shrine, a cathedral,
// a monastery or an abbey, not to a parish church alone. Pilgrim Trade stands only where one does.
export const PILGRIM_HOUSE_WORDS = Object.freeze(['shrine', 'cathedral', 'monaster', 'abbey', 'relic']);
/** The sources whose every line is trade coming in or going out (road tolls, gate tolls, customs, transit): none under a siege. */
// TAIL-DEFECON-2: under a siege no river traffic, no pilgrim, no outside customer and no trade comes in: those rows print
// their label and share alone.
export const SIEGE_CLOSED_SOURCES = Object.freeze(['Toll Revenue', 'Gate Tolls', 'Port Duties', 'Entrepôt Trade', 'River Tolls', 'Pilgrim Trade', 'Security Contracts', 'Spellcasting Services', 'International Commerce']);

const SIEGE = 'crisis: under_siege';
/** The originals and their twins, keyed by the original's text (the GRAIN pattern above). '' twins are not texts. */
export const INCOME_STATE_SIBLINGS = Object.freeze({
  [ALCHEMY_TRADE_LINE]: Object.freeze([
    Object.freeze({ text: ALCHEMY_TRADE_LINE, excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: ALCHEMY_UNDER_SIEGE_LINE, twinOf: ALCHEMY_TRADE_LINE, needs: Object.freeze([SIEGE]) }),
    Object.freeze({ text: REMEDIES_LINE, twinOf: ALCHEMY_TRADE_LINE }),
    Object.freeze({ text: REMEDIES_SHORT_LINE, twinOf: ALCHEMY_TRADE_LINE }),
  ]),
  [ALCHEMIST_SUPPLEMENTS_LINE]: Object.freeze([Object.freeze({ text: ALCHEMIST_SUPPLEMENTS_LINE })]),
  [LOCAL_ORE_LINE]: Object.freeze([
    Object.freeze({ text: LOCAL_ORE_LINE, needs: Object.freeze(['institution: smith']) }),
    Object.freeze({ text: METAL_SHORT_LINE, twinOf: LOCAL_ORE_LINE }), // BAR7-ECON: the metal chain impaired
    Object.freeze({ text: METAL_FORGE_IDLE_LINE, twinOf: LOCAL_ORE_LINE, needs: Object.freeze(['institution: mine']), excludes: Object.freeze(['trade at work: ironwork']) }), // LEFT-CHAIN L7
  ]),
  [IRON_IMPORTED_LINE]: Object.freeze([
    Object.freeze({ text: IRON_IMPORTED_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: METAL_WORKED_LINE, twinOf: IRON_IMPORTED_LINE }),
    Object.freeze({ text: METAL_SHORT_LINE, twinOf: IRON_IMPORTED_LINE }), // BAR7-ECON: the metal chain impaired
    Object.freeze({ text: METAL_FORGE_IDLE_LINE, twinOf: IRON_IMPORTED_LINE, needs: Object.freeze(['institution: mine']), excludes: Object.freeze(['trade at work: ironwork']) }), // LEFT-CHAIN L7
  ]),
  [GRAIN_BOUGHT_LINE]: Object.freeze([Object.freeze({ text: GRAIN_BOUGHT_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) })]),
  [WOOL_LOCAL_LINE]: Object.freeze([
    Object.freeze({ text: WOOL_LOCAL_LINE, excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: WOOL_LOCAL_WORKED_LINE, twinOf: WOOL_LOCAL_LINE }),
    Object.freeze({ text: CLOTH_SHORT_LINE, twinOf: WOOL_LOCAL_LINE }),
  ]),
  [WOOL_BOUGHT_LINE]: Object.freeze([
    Object.freeze({ text: WOOL_BOUGHT_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: CLOTH_WORKED_LINE, twinOf: WOOL_BOUGHT_LINE }),
  ]),
  [FISH_EXPORT_LINE]: Object.freeze([
    Object.freeze({ text: FISH_EXPORT_LINE, needs: Object.freeze(['exports']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: FISH_LANDED_LINE, twinOf: FISH_EXPORT_LINE, excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: FISH_SOLD_LINE, twinOf: FISH_EXPORT_LINE, excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: FISH_BOUGHT_LINE, twinOf: FISH_EXPORT_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: FISH_RITES_LINE, twinOf: FISH_EXPORT_LINE, excludes: Object.freeze([SIEGE]) }),
  ]),
  [ENTREPOT_LINE]: Object.freeze([
    Object.freeze({ text: ENTREPOT_LINE, needs: Object.freeze(['institution: warehouse']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: ENTREPOT_PLAIN_LINE, twinOf: ENTREPOT_LINE, excludes: Object.freeze([SIEGE]) }),
  ]),
  [QUARRY_LINE]: Object.freeze([
    Object.freeze({ text: QUARRY_LINE, needs: Object.freeze(['institution: quarry', 'exports']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: QUARRY_OWN_LINE, twinOf: QUARRY_LINE, needs: Object.freeze(['institution: quarry']), excludes: Object.freeze([SIEGE]) }),
  ]),
  [MASONS_LINE]: Object.freeze([Object.freeze({ text: MASONS_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) })]),
  [TITHES_RENTS_LINE]: Object.freeze([TITHES_RENTS_SET[0], Object.freeze({ text: TITHES_RENTS_PLAIN_LINE, twinOf: TITHES_RENTS_LINE })]),
  [TIMBER_LINE]: Object.freeze([
    Object.freeze({ text: TIMBER_LINE }),
    Object.freeze({ text: TIMBER_MANAGED_LINE, twinOf: TIMBER_LINE }),
    Object.freeze({ text: TIMBER_PLAIN_LINE, twinOf: TIMBER_LINE }),
    Object.freeze({ text: TIMBER_SAWN_LINE, twinOf: TIMBER_LINE }),
    Object.freeze({ text: TIMBER_SHORT_LINE, twinOf: TIMBER_LINE }), // BAR7-ECON: the timber chain impaired
  ]),
  [TIMBER_BOUGHT_LINE]: Object.freeze([Object.freeze({ text: TIMBER_BOUGHT_LINE, excludes: Object.freeze([SIEGE]) })]),
  [MARKET_DAY_LINE]: MARKET_DAY_SET,
});

/**
 * The income line the finished record makes true: the original, its declared twin, or ''.
 * @param {string} desc the line the branch printed
 * @param {{ roster: ReadonlyArray<string>, besieged: boolean, imports: ReadonlyArray<unknown>, exports: ReadonlyArray<unknown>,
 *   chains: ReadonlyArray<{ chainId?: unknown, status?: unknown }>, top: boolean, source?: string, managedForest?: boolean,
 *   grainFailed?: boolean, fishFailed?: boolean, fisheryExhausted?: boolean }} f the roster's names lower-cased; the siege; the final trade lists; the chains with their
 *   states; whether the row is the largest source; its source label; whether the felling is managed (a managed forest,
 *   or a shipbuilding stand a woodcutter works: UPKEEP-16, the chair's ruling (b));
 *   whether the food record names grain as the source a famine failed; the same of fish; whether every fishery near
 *   the place is depleted
 * @returns {string}
 */
/** The chains of the metal trade and of the timber trade, by id (BAR7-ECON item 1). */
const METAL_CHAINS = Object.freeze(['iron', 'smelting']);
const TIMBER_CHAINS = Object.freeze(['timber', 'mountain_timber_harvest']);
export function trueIncomeDesc(desc, f) {
  const has = (/** @type {RegExp} */ re) => f.roster.some((n) => re.test(n));
  const forge = FORGE_HOUSE_WORDS.some((w) => f.roster.some((n) => n.includes(w)));
  // the first ten only: the economy's reconcile pass caps the import list at ten after this (steps/economyReconcilePass.js)
  const bought = (/** @type {RegExp} */ re) => f.imports.slice(0, 10).some((x) => re.test(String(x)));
  const sold = (/** @type {RegExp} */ re) => f.exports.some((x) => re.test(String(x)));
  const impaired = (/** @type {ReadonlyArray<string>} */ ids) => f.chains.some((c) => ids.includes(String(c?.chainId ?? '')) && c?.status === 'impaired'); // by the chain's id, not its printed name
  if (f.besieged && SIEGE_CLOSED_SOURCES.includes(String(f.source ?? ''))) return '';
  switch (desc) {
    case ALCHEMY_TRADE_LINE: case ALCHEMIST_SUPPLEMENTS_LINE:
      if (impaired(['alchemy', 'herbalism'])) return REMEDIES_SHORT_LINE;
      if (!has(/alchemist/)) return REMEDIES_LINE; // an apothecary, a herbalist or a hedge wizard is not an alchemist
      return desc === ALCHEMY_TRADE_LINE && f.besieged ? ALCHEMY_UNDER_SIEGE_LINE : desc;
    // BAR7-ECON item 1 (8f): an impaired metal chain is not described as working (the cloth line's arm, for metal)
    case LOCAL_ORE_LINE: return !(has(/smith/) || forge) ? '' : impaired(METAL_CHAINS) ? METAL_SHORT_LINE : has(/smith/) ? desc : METAL_WORKED_LINE;
    case IRON_IMPORTED_LINE: case LOCAL_COAL_LINE:
      if (!forge) return '';
      if (impaired(METAL_CHAINS)) return METAL_SHORT_LINE;
      return f.besieged || !bought(/\biron\b/i) ? METAL_WORKED_LINE : desc;
    case LOCAL_COAL_SOLD_LINE: return f.besieged || !sold(/^coal\b/i) ? '' : desc;
    case GRAIN_BOUGHT_LINE: return f.besieged || !bought(/\bgrain\b/i) ? '' : desc;
    // UPKEEP-10 (the eighth seat's LEFT 1 (a); #ww-339, #ww-1357): "none is left to sell to other settlements" is false
    // where grain or flour is sold out, and the own fields' grain is not sold where its harvest failed: no sentence.
    case GRAIN_OWN_FIELDS_LINE: return f.grainFailed || sold(/\b(?:grain|flour)\b/i) ? '' : desc;
    case WOOL_LOCAL_LINE:
      if (impaired(['textiles'])) return CLOTH_SHORT_LINE;
      if (has(/weav/) && has(/fuller/) && !f.besieged) return desc;
      return has(/weav|fuller/) ? WOOL_LOCAL_WORKED_LINE : '';
    case WOOL_BOUGHT_LINE:
      if (impaired(['textiles'])) return CLOTH_SHORT_LINE;
      if (!f.besieged && bought(/\bwool\b/i)) return desc;
      return has(/weav|fuller/) ? CLOTH_WORKED_LINE : '';
    case FISH_EXPORT_LINE:
      // TAIL-DEFECON-3: under a famine whose failed source is fish no line offers fish; where every fishery near the
      // place is fished out, the catch is not landed: the salted fish bought in, or no sentence (D5, #77).
      if (f.besieged || f.fishFailed) return '';
      // BAR8 J-INCOME item 2 (11b, the sixth chair's BRIEF-BAR8, 2026-11-17): THE FISH STORY IS ASKED FIRST, and no longer the
      // rites (BAR4-CORPUS-ECO's FS1 arm, `chainRites.js :: ritesHoldAChain`, retired here). Under the owner's supply rule a chain kept by
      // magic feeds no house (`supplyStory.js :: sourceStoryOf`): where every fishery is fished out the story is bought where the
      // import brings the salted fish in (the bought line), else idle (no sentence); "rites keep the catch coming, and it is landed
      // and sold here" is true of neither (the Magic tab prints no fishing). Below a town the birth writes the salted fish later
      // (`resourceGenerator.js :: importsBroughtAtBirth`): the share then prints its label and share alone, never the rites line.
      if (f.fisheryExhausted) return bought(/\bsalt(?:ed)? fish\b/i) ? FISH_BOUGHT_LINE : '';
      if (has(/fisher|fishing/)) return sold(/\bsalt(?:ed)? fish\b/i) ? desc : FISH_LANDED_LINE;
      return has(/\bfish/) ? FISH_SOLD_LINE : '';
    case ENTREPOT_LINE: return has(/warehouse|toll|customs|caravan|depot/) ? desc : ENTREPOT_PLAIN_LINE;
    // TAIL-DEFECON-3 (#18655, X9 15745): "to regional builders" only where the place sells stone; else its own building.
    case QUARRY_LINE: return !has(/quarr/) || f.besieged ? '' : sold(/stone|marble|granite|slate/i) ? desc : QUARRY_OWN_LINE;
    case MASONS_LINE: return has(/mason|stonecut/) && !f.besieged && bought(/stone|masonry|marble/i) ? desc : '';
    case TITHES_RENTS_LINE: return f.top ? desc : TITHES_RENTS_PLAIN_LINE;
    // BAR2-LABELS LB6 (C16557): "managed felling" only where the managed woodland stands (the sibling's form); a sawmill
    // without it saws the timber and claims no sustained yield.
    // BAR7-ECON item 1 (8f.chain): an impaired timber chain is not described as working
    case TIMBER_LINE: return impaired(TIMBER_CHAINS) ? TIMBER_SHORT_LINE : has(/sawmill|lumber/) ? (f.managedForest ? desc : TIMBER_SAWN_LINE) : f.managedForest ? TIMBER_MANAGED_LINE : TIMBER_PLAIN_LINE;
    case TIMBER_BOUGHT_LINE: case MARKET_DAY_LINE: return f.besieged ? '' : desc;
    default: return desc;
  }
}

// THE TRADE'S ORDINARY LINE IN PLACE OF A STORED SHORT TWIN (BAR7-ECON; LEFT-CHAIN L7): `ordinaryIncomeLineOf` and the lines
// it reads live in the import-free leaf `domain/display/incomeOrdinaryLines.js` (BAR8 J-INCOME item 1), imported and re-exported above.

// ── #93 (UPKEEP-8; the chair's ruling of 2026-11-13, 23:48, a DECLARED MOVE of the income family) ──────────────────
// Where Agricultural Rents is a small place's ONLY income line and a house of work stands on the roster, one line is
// added at the branches' own weight for that house's WORK, worded from the trade (never the house's stored name, which a
// user can rename or hide). It claims no ground, no catch for export and no trade route the record lacks; under a siege
// nothing is said to be sold (the row prints its label and share alone).
export const HOUSE_OF_WORK_LABEL = 'Local Trades';
/** The houses of work and each trade's own sentence; the first such house on the roster speaks. */
export const HOUSE_OF_WORK_LINES = Object.freeze([
  Object.freeze({ re: /\bfisher|\bfishing\b/, text: 'What the fishers land is sold here.' }),
  Object.freeze({ re: /\bwoodcutter/, text: 'The wood the woodcutters cut is sold here.' }),
  Object.freeze({ re: /\bhunter/, text: 'The game and hides the hunters bring in are sold here.' }),
  Object.freeze({ re: /\bmine\b/, text: 'What the miners dig is sold here.' }),
  Object.freeze({ re: /\bquarr/, text: 'The stone the quarrymen cut is sold here.' }),
]);

/**
 * The house of work's income line, or null.
 * @param {string} tier @param {ReadonlyArray<{ source?: unknown }>} incomeBuild the lines built so far
 * @param {ReadonlyArray<string>} roster the roster's names, lower-cased @param {boolean} besieged
 * @returns {{ source: string, percentage: number, desc: string } | null}
 */
export function houseOfWorkLine(tier, incomeBuild, roster, besieged) {
  if (!['thorp', 'hamlet', 'village'].includes(tier) || incomeBuild.length !== 1 || !['Agricultural Rents', 'Harvest'].includes(String(incomeBuild[0]?.source))) return null; // D10: the harvest twin too
  const house = roster.find((n) => HOUSE_OF_WORK_LINES.some((h) => h.re.test(n))); // the first such house on the roster
  const work = house && HOUSE_OF_WORK_LINES.find((h) => h.re.test(house));
  return work ? { source: HOUSE_OF_WORK_LABEL, percentage: 10, desc: besieged ? '' : work.text } : null;
}

// ── UPKEEP-16 (the chair's ruling (o) RE-RULED, 2026-11-14, 13:08: candidate D of INCOME-MEASURE-1) ──────────────────
// AN INCOME ROW IS BORNE OUT BY THE PAGE: a resource row (the four trades below) stands where a house of its trade stands
// on the roster, OR where the raw good is on the town's own final export list from ground it holds (not depleted). A row
// the page does not bear out is taken off and the rows that remain are re-shared from their stored weights; a row kept
// with no house of its trade is TITLED BY THE GOOD IT SELLS ("Coal Sales" for coal sold under "Iron & Metalwork"), its
// line silent. Measured on the capacity reader's 972 at f4e9cd37b (docs/chair/2026-11-14/INCOME-ROWS-MEASURE.md on
// lane/income-measure-2026-11-14): 476 false rows in 402 towns -> 0, on the record and on every rendered surface.

/**
 * @typedef {{ keys: ReadonlyArray<string>, source: string | null, sold: RegExp }} GoodSold a good a row may sell: the ground
 *   it comes from (resource-key prefixes), the title a kept row with no house takes (null: the row keeps its own), how the
 *   export list names it
 * @typedef {{ house: RegExp, goods: ReadonlyArray<GoodSold> }} ResourceTrade
 */
/** Each resource trade: the roster's houses of the trade, and the goods its row may sell from the town's own ground.
 *  A good's `source` is the row's title where it is kept with no house (`source:` so the treasury's totality scan reads it).
 * @type {Readonly<Record<string, ResourceTrade>>} */
export const RESOURCE_ROW_TRADES = Object.freeze({
  'Iron & Metalwork': Object.freeze({ house: /\bmines?\b|mining|smith|smelt|forge|foundr|metal|armou?r|weapon/, goods: Object.freeze([
    Object.freeze({ keys: Object.freeze(['iron_deposit']), source: 'Iron Ore Sales', sold: /\biron\b|\bore\b/i }),
    Object.freeze({ keys: Object.freeze(['coal_deposit']), source: 'Coal Sales', sold: /^coal\b/i }),
    Object.freeze({ keys: Object.freeze(['precious_metal']), source: 'Precious Metal Sales', sold: /silver|gold|precious/i })]) }),
  'Stone Quarrying': Object.freeze({ house: /quarr|mason|stonecut/, goods: Object.freeze([
    Object.freeze({ keys: Object.freeze(['stone_quarry']), source: 'Building Stone Sales', sold: /stone|marble|granite/i }),
    Object.freeze({ keys: Object.freeze(['river_clay', 'clay']), source: 'Clay Sales', sold: /\bclay\b|potter/i })]) }),
  'Timber Trade': Object.freeze({ house: /woodcut|lumber|sawmill|logging|forester/, goods: Object.freeze([
    Object.freeze({ keys: Object.freeze(['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber']), source: 'Timber Trade', sold: /timber|lumber|plank/i })]) }),
  'Fish & Preserved Produce': Object.freeze({ house: /fish/, goods: Object.freeze([
    Object.freeze({ keys: Object.freeze(['river_fish', 'fishing_grounds']), source: null, sold: /fish|herring|seafood/i }),
    Object.freeze({ keys: Object.freeze(['salt_flat', 'desert_salt']), source: 'Salt Sales', sold: /salt/i })]) }),
});
/** The maritime fish row is the same trade under the sea's title. @type {Readonly<Record<string, ResourceTrade>>} */
const ROW_TRADES = Object.freeze({ ...RESOURCE_ROW_TRADES, 'Fish & Maritime Produce': RESOURCE_ROW_TRADES['Fish & Preserved Produce'] });
/** Every title a kept row may be given (`treasury.js :: INCOME_SOURCE_FORMS` maps each; the census of titles). */
export const GOOD_SOLD_TITLES = Object.freeze([...new Set(Object.values(RESOURCE_ROW_TRADES).flatMap((t) => t.goods.map((g) => g.source)).filter((t) => t !== null))]);

/**
 * ONE SHADOW FIGURE (TAIL-DEFECON-5, ruling R2; RECORD-MEASURE-3 row 2b, c2a). The income rows' shares, written in place
 * from their weights. A criminal row is pushed with the Shadow Economy section's capture as its weight ("so normalized %
 * matches"); normalised with the rest, twice (here and in `keepRowsThePageBearsOut`), it matched in 8 towns of 236 ("33%
 * capture" above a criminal row of 19%). So a criminal row is HELD at `held` (the capture) and the lawful rows share what
 * is left in their own proportions; the residue of rounding goes to the largest lawful row. With no criminal row (or no
 * lawful weight beside it) every row's share is its weight's, and the residue goes to the largest row.
 * @param {Array<{ weight: number, percentage: number, isCriminal?: boolean }>} rows @param {number} held
 * @returns {void}
 */
export function shareIncomeRows(rows, held) {
  const lawful = rows.filter((e) => !e.isCriminal);
  const lawfulWeight = lawful.reduce((sum, e) => sum + e.weight, 0);
  const holds = lawful.length < rows.length && lawfulWeight > 0;
  const total = rows.reduce((sum, e) => sum + e.weight, 0) || 1;
  for (const e of rows) {
    e.percentage = !holds ? Math.round((e.weight / total) * 100) : e.isCriminal ? held : Math.round((e.weight / lawfulWeight) * (100 - held));
  }
  const sum = rows.reduce((s, e) => s + e.percentage, 0);
  const pool = holds ? lawful : rows;
  if (pool.length && sum !== 100) { let bi = 0; pool.forEach((e, i) => { if (e.percentage > pool[bi].percentage) bi = i; }); pool[bi].percentage += 100 - sum; }
}

/**
 * The income rows the page bears out, re-shared, IN PLACE (the economy's normalised list; before its sort). Pure; no draw.
 * @param {Array<{ source: string, percentage: number, weight: number, desc?: string, isCriminal?: boolean }>} rows the normalised income rows
 * @param {{ roster: ReadonlyArray<string>, ground: ReadonlyArray<string>, exports: ReadonlyArray<unknown> }} f the roster's
 *   names lower-cased; the town's live (not depleted) resources; the final export list
 * @returns {void}
 */
export function keepRowsThePageBearsOut(rows, f) {
  const rosterHas = (/** @type {RegExp} */ re) => f.roster.some((n) => re.test(n));
  const ground = (/** @type {ReadonlyArray<string>} */ keys) => f.ground.some((r) => keys.some((k) => r.startsWith(k)));
  const sold = (/** @type {RegExp} */ re) => f.exports.some((x) => re.test(String(x)));
  /** The good the town sells from its own ground under this row, or null. @param {{ source: string }} e */
  const goodSold = (e) => ROW_TRADES[e.source]?.goods.find((x) => ground(x.keys) && sold(x.sold)) ?? null;
  const unhoused = (/** @type {{ source: string }} */ e) => { const t = ROW_TRADES[e.source]; return !!t && !rosterHas(t.house); };
  const kept = rows.filter((e) => !unhoused(e) || goodSold(e) !== null);
  if (kept.length !== rows.length) {
    shareIncomeRows(kept, kept.find((e) => e.isCriminal)?.percentage ?? 0); // R2: the criminal row keeps the capture
    rows.length = 0; rows.push(...kept);
  }
  for (const e of rows) {
    if (!unhoused(e)) continue;
    const g = goodSold(e);
    if (g && g.source && g.source !== e.source) { e.source = g.source; e.desc = ''; }
  }
}
