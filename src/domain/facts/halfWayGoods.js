/**
 * domain/facts/halfWayGoods.js — THE GOODS A HALF-WAY CHAIN DOES NOT MAKE (BAR5-CHAINS, LAW 3's L3.halfway, the chair's
 * direction (a) of BRIEF-BAR5: "what is left of the half-way rule after (a) is real: a chain that prints finished goods
 * its gap denies"; vetoable by the owner).
 *
 * The record's gap (`resourceAnalysis.gaps[]`, `impact` "Cannot produce final goods, limited to intermediate products",
 * written by `resourceGenerator.js :: evaluateInstitutionChain`) says a raw material is worked here only part-way, for want
 * of the houses it names (`missing`); the Resources tab prints it ("Partial · Wool … worked only to semi-finished goods";
 * "Work on the animal hides here stops half-way: no leatherworkers' guild finishes it."). The Economics tab's chain card on
 * that material printed the missing house's finished goods all the same ("Boots and shoes · Saddles and harness · Leather
 * armour" over a lone Tanner). After the gap read its finisher by trade (`houseInputAtHand.js :: tradeFinisherIn`), 51
 * such rows stood on the instance towns of the census's 720, the fresh 300 and the sixty read towns.
 *
 *   halfWayGoodsDenied(record, chain)   THE ONE READER: the outputs of a supply-chain card (`economicState.activeChains[]`)
 *                                       that the record's half-way gaps deny: a card that works the gap's material
 *                                       (`HALF_WAY_CARDS`, by the card's `chainId`) does not print a good only a missing
 *                                       house finishes (`FINISHED_BY_HOUSE`, the cards' own output words). An entrepôt card
 *                                       carries goods made elsewhere and works no material here: it is never asked.
 *
 * Two closed tables, each row with its cause; the words are the supply chains' own (`data/supplyChainData.js`) and the
 * houses the chains' own (`data/resourceChains.js :: RESOURCE_CHAINS[].processingInstitutions`). Neither table is imported
 * here: both ride the lazy goods surface (`data/goods/chains.js`'s rule) and this fact is read by the card's eager leaf.
 * The record is not touched. Layer 2 (over the resource analysis). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar5ChainsLaw3.test.js
 */

/** The supply-chain cards that work each gap's raw material (`gaps[].chain`, `RESOURCE_CHAINS[].rawResource`). */
export const HALF_WAY_CARDS = Object.freeze({
  wool: Object.freeze(['textiles', 'textile_finishing']), // the wool's cloth and its clothing (the census's 720: 37 + 32 towns)
  'alpine wool': Object.freeze(['textiles', 'textile_finishing']),
  'iron ore': Object.freeze(['iron', 'weapons_armor']), // the ore's metalwork and its arms
  // BAR6-RECORD (b) (6c-halfway: "stops half-way: no leatherworkers' guild finishes it" beside a Livestock & Dairy card's
  // "Leather goods", bar0-metropolis-calm-rand-40): every card that prints the hides' leatherwork, not the leather chain's alone
  'animal hides': Object.freeze(['leather_goods', 'livestock', 'leather', 'hunting']), // the hides' leatherwork
  // BAR6-RECORD (b) (6c-halfway: "no carpenters' guild or charcoal burner finishes it" beside a Mountain Timber card's
  // "Charcoal", bar0-village-calm-rand-38): the timber's sawn goods and its charcoal
  timber: Object.freeze(['timber', 'mountain_timber_harvest']),
  'mountain timber': Object.freeze(['timber', 'mountain_timber_harvest']),
  'medicinal herbs': Object.freeze(['herbalism']), // the herbs' remedies
});

/** The card outputs only the named house finishes (the chain house's own work, as its card spells its goods). */
export const FINISHED_BY_HOUSE = Object.freeze({
  // cloth: a weave not fulled, dyed or woven here is not finished cloth (the second check's C37887 form: "Processed
  // textiles · Dyed cloth" beside "Partial · Wool")
  "Weavers' guild": Object.freeze(['Processed textiles', 'Dyed cloth', 'Fine textiles', 'Finished clothing', 'Tailored garments', 'Livery and uniforms']),
  'Fulling mill': Object.freeze(['Processed textiles', 'Dyed cloth', 'Fine textiles', 'Finished clothing', 'Tailored garments', 'Livery and uniforms']),
  "Dyers' guild": Object.freeze(['Dyed cloth', 'Fine textiles', 'Finished clothing', 'Tailored garments', 'Livery and uniforms']),
  // metal: ore not smelted here is no tool or blade made of it (C39608)
  Smelter: Object.freeze(['Quality tools and weapons', 'Advanced weapons and armor', 'Master-crafted weapons']),
  "Blacksmiths' guild": Object.freeze(['Quality tools and weapons', 'Advanced weapons and armor', 'Master-crafted weapons']),
  // leather: a tanner's leather is not yet boots, harness or armour (C37887)
  "Leatherworkers' guild": Object.freeze(['Boots and shoes', 'Saddles and harness', 'Leather armour', 'Leather goods', 'Belts and straps']),
  Tannery: Object.freeze(['Boots and shoes', 'Saddles and harness', 'Leather armour', 'Leather goods', 'Belts and straps']),
  // timber (BAR6-RECORD (b)): the sawmill's sawn goods, the burner's charcoal (the cards' own words, `supplyChainData.js`)
  Sawmill: Object.freeze(['Milled lumber', 'Structural timber']),
  'Charcoal burner': Object.freeze(['Charcoal']),
  // herbs: the apothecary's remedies, the alchemist's potions
  Apothecary: Object.freeze(['Herbal remedies']),
  'Alchemist shop': Object.freeze(['Potions and elixirs']),
});

/** @param {unknown} x @returns {unknown[]} */
const arr = (x) => (Array.isArray(x) ? x : []);
/** @param {unknown} x @returns {string} */
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));

/**
 * The outputs a chain card does not print: the finished goods of a house the record's half-way gap on the card's own
 * material names missing. Empty where no gap is half-way, the card works no such material, or it is an entrepôt.
 * @param {unknown} record the settlement record
 * @param {unknown} chain one of `economicState.activeChains`
 * @returns {ReadonlySet<string>}
 */
export function halfWayGoodsDenied(record, chain) {
  const c = chain && typeof chain === 'object'
    ? /** @type {{ chainId?: unknown, entrepot?: unknown, needKey?: unknown }} */ (chain) : {};
  /** @type {Set<string>} */
  const out = new Set();
  if (c.entrepot === true || c.needKey === 'trade_entrepot') return out;
  const id = str(c.chainId);
  const gaps = arr(/** @type {{ resourceAnalysis?: { gaps?: unknown } | null } | null | undefined} */ (record)?.resourceAnalysis?.gaps);
  for (const x of gaps) {
    const g = /** @type {{ chain?: unknown, missing?: unknown, impact?: unknown, institution?: unknown } | null} */ (x);
    if (!g || typeof g !== 'object' || g.institution || !/final goods/i.test(str(g.impact))) continue;
    const cards = /** @type {Record<string, ReadonlyArray<string>>} */ (HALF_WAY_CARDS)[str(g.chain).replace(/_/g, ' ').toLowerCase()];
    if (!cards || !cards.includes(id)) continue;
    for (const house of arr(g.missing).map(str)) for (const good of /** @type {Record<string, ReadonlyArray<string>>} */ (FINISHED_BY_HOUSE)[house] || []) out.add(good);
  }
  return out;
}
