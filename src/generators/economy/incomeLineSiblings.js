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

/** The grain line that sells a surplus, and its twin for a town whose own fields do not cover what it eats. */
export const GRAIN_SURPLUS_LINE = 'Surplus from local harvest sold to nearby settlements and passing merchants: steady income tied to the growing season.';
export const GRAIN_OWN_FIELDS_LINE = 'Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements.';

/** The metalwork line where coal stands and no iron does (COHERENCE-AGREE cure 7); it says the iron is bought in. */
export const LOCAL_COAL_LINE = 'Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.';
/** Its twin where the roster holds no forge house (COHERENCE-AGREE-8, REVIEW-AGREE-3 T3): no forge here burns the coal. */
export const LOCAL_COAL_SOLD_LINE = 'Coal is dug here and sold to the forges of other towns; no forge here burns it, so this income stream leans on the trade route.';
/** The roster's forge houses, as a name word (the census's "metal house"): the coal line's gate. */
export const FORGE_HOUSE_WORDS = Object.freeze(['smith', 'forge', 'foundr', 'smelt', 'metal', 'armor', 'armour', 'weapon']);

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
export const ALCHEMY_TRADE_LINE = 'A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.';
export const ALCHEMIST_SUPPLEMENTS_LINE = 'Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade.';
export const ALCHEMY_UNDER_SIEGE_LINE = 'Alchemical preparations and curative potions, sold only to the people inside while the siege keeps outside customers away.';
export const REMEDIES_LINE = 'Remedies and simple preparations, made and sold here: a modest trade.';
export const REMEDIES_SHORT_LINE = 'Remedies and preparations are made here, but few, while the herbs and reagents they need run short.';
export const LOCAL_ORE_LINE = 'Local ore feeds the smithy directly. Metalwork income is not trade-route dependent.';
export const IRON_IMPORTED_LINE = 'Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.';
export const METAL_WORKED_LINE = 'Metal is smelted or worked here.';
export const GRAIN_BOUGHT_LINE = 'Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes.';
export const WOOL_LOCAL_LINE = 'Local flocks provide raw wool; weavers and fullers convert it to cloth sold across the region.';
export const WOOL_LOCAL_WORKED_LINE = 'Local flocks provide raw wool, and cloth is woven or finished here.';
export const CLOTH_SHORT_LINE = 'Little cloth is made here while the cloth trade is short of what it needs.';
export const WOOL_BOUGHT_LINE = 'Wool bought from pastoral regions and processed locally: value-add trade dependent on consistent supply.';
export const CLOTH_WORKED_LINE = 'Cloth is woven or finished here.';
export const FISH_EXPORT_LINE = 'Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.';
export const FISH_LANDED_LINE = 'Catch landed here and sold fresh or preserved.';
export const FISH_SOLD_LINE = 'Fish is sold here, fresh or preserved.';
export const QUARRY_LINE = 'Local quarry provides dressed stone to regional builders: reliable income with low transport overhead.';
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
export const TIMBER_PLAIN_LINE = 'Local forest provides timber revenue.';
export const TIMBER_BOUGHT_LINE = 'Timber sourced from more distant forests and resold or processed locally: trade route dependent.';
/** The market-day line, declared on its own text (it names the market; economicState.js prints its literal, registered there). */
const MARKET_DAY_SET = Object.freeze([Object.freeze({ text: 'Market day stall fees and toll collection on goods entering the market.', needs: Object.freeze(['market']), excludes: Object.freeze(['crisis: under_siege']) })]);
export const MARKET_DAY_LINE = MARKET_DAY_SET[0].text;
/** The sources whose every line is trade coming in or going out (road tolls, gate tolls, customs, transit): none under a siege. */
export const SIEGE_CLOSED_SOURCES = Object.freeze(['Toll Revenue', 'Gate Tolls', 'Port Duties', 'Entrepôt Trade']);

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
  [LOCAL_ORE_LINE]: Object.freeze([Object.freeze({ text: LOCAL_ORE_LINE, needs: Object.freeze(['institution: smith']) })]),
  [IRON_IMPORTED_LINE]: Object.freeze([
    Object.freeze({ text: IRON_IMPORTED_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) }),
    Object.freeze({ text: METAL_WORKED_LINE, twinOf: IRON_IMPORTED_LINE }),
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
  ]),
  [QUARRY_LINE]: Object.freeze([Object.freeze({ text: QUARRY_LINE, needs: Object.freeze(['institution: quarry']), excludes: Object.freeze([SIEGE]) })]),
  [MASONS_LINE]: Object.freeze([Object.freeze({ text: MASONS_LINE, needs: Object.freeze(['imports']), excludes: Object.freeze([SIEGE]) })]),
  [TITHES_RENTS_LINE]: Object.freeze([TITHES_RENTS_SET[0], Object.freeze({ text: TITHES_RENTS_PLAIN_LINE, twinOf: TITHES_RENTS_LINE })]),
  [TIMBER_LINE]: Object.freeze([
    Object.freeze({ text: TIMBER_LINE }),
    Object.freeze({ text: TIMBER_MANAGED_LINE, twinOf: TIMBER_LINE }),
    Object.freeze({ text: TIMBER_PLAIN_LINE, twinOf: TIMBER_LINE }),
  ]),
  [TIMBER_BOUGHT_LINE]: Object.freeze([Object.freeze({ text: TIMBER_BOUGHT_LINE, excludes: Object.freeze([SIEGE]) })]),
  [MARKET_DAY_LINE]: MARKET_DAY_SET,
});

/**
 * The income line the finished record makes true: the original, its declared twin, or ''.
 * @param {string} desc the line the branch printed
 * @param {{ roster: ReadonlyArray<string>, besieged: boolean, imports: ReadonlyArray<unknown>, exports: ReadonlyArray<unknown>,
 *   chains: ReadonlyArray<{ chainId?: unknown, status?: unknown }>, top: boolean, source?: string, managedForest?: boolean }} f the
 *   roster's names lower-cased; the siege; the final trade lists; the chains with their states; whether the row is the
 *   largest source; its source label; whether a managed or shipbuilding forest stands
 * @returns {string}
 */
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
    case LOCAL_ORE_LINE: return has(/smith/) ? desc : forge ? METAL_WORKED_LINE : '';
    case IRON_IMPORTED_LINE: case LOCAL_COAL_LINE:
      if (!forge) return '';
      return f.besieged || !bought(/\biron\b/i) ? METAL_WORKED_LINE : desc;
    case LOCAL_COAL_SOLD_LINE: return f.besieged || !sold(/^coal\b/i) ? '' : desc;
    case GRAIN_BOUGHT_LINE: return f.besieged || !bought(/\bgrain\b/i) ? '' : desc;
    case WOOL_LOCAL_LINE:
      if (impaired(['textiles'])) return CLOTH_SHORT_LINE;
      if (has(/weav/) && has(/fuller/) && !f.besieged) return desc;
      return has(/weav|fuller/) ? WOOL_LOCAL_WORKED_LINE : '';
    case WOOL_BOUGHT_LINE:
      if (impaired(['textiles'])) return CLOTH_SHORT_LINE;
      if (!f.besieged && bought(/\bwool\b/i)) return desc;
      return has(/weav|fuller/) ? CLOTH_WORKED_LINE : '';
    case FISH_EXPORT_LINE:
      if (f.besieged) return '';
      if (has(/fisher|fishing/)) return sold(/\bsalt(?:ed)? fish\b/i) ? desc : FISH_LANDED_LINE;
      return has(/\bfish/) ? FISH_SOLD_LINE : '';
    case QUARRY_LINE: return has(/quarr/) && !f.besieged ? desc : '';
    case MASONS_LINE: return has(/mason|stonecut/) && !f.besieged && bought(/stone|masonry|marble/i) ? desc : '';
    case TITHES_RENTS_LINE: return f.top ? desc : TITHES_RENTS_PLAIN_LINE;
    case TIMBER_LINE: return has(/sawmill|lumber/) ? desc : f.managedForest ? TIMBER_MANAGED_LINE : TIMBER_PLAIN_LINE;
    case TIMBER_BOUGHT_LINE: case MARKET_DAY_LINE: return f.besieged ? '' : desc;
    default: return desc;
  }
}
