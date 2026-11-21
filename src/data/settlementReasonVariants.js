/**
 * settlementReasonVariants.js — WHY THE PLACE IS HERE, VARIED (PEOPLE-2 B3, 2026-11-20; the proposal
 * `docs/chair/2026-11-20/content/people/PROPOSAL-settlementReason.md`, its pools as written in `measures/m3-pools.mjs`,
 * PEOPLE-1's read and the chair's rulings of 17:13 and 17:21 UTC, quoted in the brief
 * `docs/chair/2026-11-20/content/people/briefs/P2-B3-settlementReason-BUILD.md`).
 *
 * `settlementReason[]` (`narrativeGenerator.js :: generateSettlementReason`) prints on the Overview's "Settlement
 * Origin", the Summary tab, the PDF Overview, the campaign PDF and the Foundry journal. Its size line was one fixed
 * sentence in every city with a food gap and in nearly every metropolis; the small-place line and the road, river and
 * crossroads origin lines were pools of five. This file holds the wordings that follow them, each declared on the
 * facts it presumes, and the one function the writer's closing line hands its lines to.
 *
 * ── THE PICK ────────────────────────────────────────────────────────────────
 * Today's line is the HEAD of the combined list at the pick, never a stored row: `[today's line, ...the wordings whose
 * needs hold and whose excludes do not]`, picked by `pickVariantMixed` (the chair, 17:21, item 4), through `drawDeclared`
 * (the declared door: the ledger notes the line it printed). The keys are the writer's own: `originVariantKey` for line 0
 * and `'<seed>::settlement-tier-line::<tier>'` for line 1, on the birth's `_seed` (the writer hands it, and the special
 * resources its origin key reads). A keyed hash: no draw, so no roll of
 * the birth moves. A falsy seed, a record handed no facts, or no eligible wording returns the lines AS THEY CAME, the
 * same array, byte for byte. The power-of-two law of `settlementOriginProse.js` is NOT extended to these computed lists
 * (the chair, 17:21, item 4).
 *
 * ── WHERE EACH LINE IS VARIED ───────────────────────────────────────────────
 *   line 0  the road, river and crossroads arms only (`originArmKey`); the port, ground and isolated arms are as they came.
 *   line 1  thorp and hamlet (the small-place pool); a city with a food gap; a metropolis outside a siege (under a siege
 *           its twin stands alone). A village, a town and a fed city have no line 1 to vary, or keep it.
 *
 * ── WHAT A ROW DECLARES ─────────────────────────────────────────────────────
 * `needs` and `excludes` hold vocabulary atoms only (`factVocabulary.js`), answered on `factsOf` over the record the
 * step hands (`steps/generateNarratives.js`, the roster's `record`). Three things the proposal wrote as needs are not
 * atoms, and are answered here, by the writer's own inputs:
 *   `foodImport: true`  food is brought in: the writer's own `economicViability.metrics.foodBalance.importCoverage > 0`
 *                       (its `hasFoodImport`), the proposal's FOOD_IMPORT;
 *   a slot              a row is eligible only where each of its slots fills from the facts:
 *     `{ground}`   the terrain as a place phrase (the writer's `settlementOriginProse.js :: GROUND_PHRASE`, handed, plus
 *                  `RIVERBANK`) — the proposal's `terrain`;
 *     `{export}`   the first of the vocabulary's own export goods the place sends out (`exported: flour|hides|ale|arms`,
 *                  `EXPORT_WORD`; not `cloth`, whose words take in raw wool) — the proposal's `exported`;
 *     `{routeWay}` how goods reach the place by its route (`ROUTE_WAY`) — the proposal's `route`.
 * Three atoms are declared beyond the proposal's own, each a fact the words already state, so the presumption walkers
 * read the line as declared (no place's eligibility is meant to move): `church` excluded beside `temple` ("There is no
 * temple here": the faith reading's church, the word's own atom); `route: crossroads` on the inn row ("where the roads
 * cross"; its arm is the crossroads); `imports` on the carts row ("Carts of food come in", beside the food brought in).
 * No row needs a house of a hideable kind (`cardVeil.js :: isHideableHouse`) or any fact about crime (the chair, 17:21,
 * item 5); `tests/generators/settlementReasonVariants.test.js` holds both.
 *
 * Pure apart from the presumption ledger's note: no randomness, no clock. It imports no generator (the data layer's
 * purity, `tests/domain/dataPurity.test.js`): the writer hands its own `originArmKey`, `originVariantKey` and
 * `GROUND_PHRASE`. No line of the writer's is copied here: today's line is composed at the pick, never stored.
 */
import { pickVariantMixed } from '../kernel/proseHash.js';
import { drawDeclared } from '../domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../domain/facts/factVocabulary.js';
import { factsOf } from '../domain/facts/factsOf.js';

/**
 * `{ground}`'s one phrase the origin's own table lacks. Every other terrain's phrase is the writer's own
 * (`settlementOriginProse.js :: GROUND_PHRASE`), handed by the writer's closing line: a literal has one home.
 */
export const RIVERBANK = Object.freeze({ riverside: 'on the riverbank' });
/** `{export}`: the vocabulary's export keys, in order, and the plain word each prints. */
export const EXPORT_WORD = Object.freeze({ flour: 'grain', hides: 'hides', ale: 'ale', arms: 'weapons' });
/** `{routeWay}`: how goods reach the place by its route. */
export const ROUTE_WAY = Object.freeze({ road: 'along the roads', crossroads: 'along the roads', river: 'by the river', port: 'by water' });

/** settlementReason[0]: the wordings that follow each varied arm's own line (`settlementOriginProse.js :: ORIGIN_POOLS`). */
export const ORIGIN_VARIANTS = Object.freeze({
  road: Object.freeze([
    { id: 'road.1', text: 'It stands on the road {ground}, and the road is how people and goods reach it.', needs: [], excludes: ['crisis: under_siege'] },
    { id: 'road.2', text: 'Built beside the road {ground}; what the place sells goes out along it, and what it buys comes in.', needs: ['exports', 'imports'], excludes: ['crisis: under_siege'] },
    { id: 'road.3', text: 'A road settlement with a market of its own, where goods that come along the road are bought and sold.', needs: ['market'], excludes: ['crisis: under_siege'] },
    { id: 'road.4', text: 'It stands where the road meets the river, and goods come in by both.', needs: ['river', 'navigable'], excludes: ['crisis: under_siege', 'route: river'] },
    { id: 'road.5', text: 'The road climbs to it through the hills, and every load comes up that road.', needs: ['terrain: hills'], excludes: ['crisis: under_siege', 'navigable'] },
    { id: 'road.6', text: 'The road winds up to it through the mountains, and every load comes up that road.', needs: ['terrain: mountain'], excludes: ['crisis: under_siege', 'navigable'] },
    { id: 'road.7', text: 'It stands on the road, and its {export} goes out along it to be sold.', needs: [], excludes: ['crisis: under_siege'] },
    // the chair, 17:21, item 2: road 8 as ruled ("among its own grain fields")
    { id: 'road.8', text: 'Built on the road across the open plain, among its own grain fields.', needs: ['terrain: plains', 'grain'], excludes: ['famine'] },
  ].map((row) => Object.freeze(row))),
  river: Object.freeze([
    { id: 'river.1', text: 'It stands on the river {ground}, and the river is its way in and out.', needs: [], excludes: ['crisis: under_siege', 'terrain: riverside'] },
    { id: 'river.2', text: 'Built on the river, with landing stages where boats tie up to load and unload.', needs: ['docks'], excludes: ['crisis: under_siege'] },
    { id: 'river.3', text: 'Built on the river; its people fish it, and draw their water from it.', needs: ['fish', 'river'], excludes: [] },
    { id: 'river.4', text: 'A river settlement whose market takes in what comes by water and what comes by land.', needs: ['market'], excludes: ['crisis: under_siege'] },
    { id: 'river.5', text: 'A river settlement; its {export} goes out by the river to be sold.', needs: [], excludes: ['crisis: under_siege'] },
  ].map((row) => Object.freeze(row))),
  crossroads: Object.freeze([
    { id: 'crossroads.1', text: 'Built where the roads cross; its market draws buyers from every direction.', needs: ['market'], excludes: ['crisis: under_siege'] },
    { id: 'crossroads.2', text: 'It stands where roads cross {ground}.', needs: [], excludes: [] },
    { id: 'crossroads.3', text: 'Built at a crossroads; its {export} goes out along its roads.', needs: [], excludes: ['crisis: under_siege'] },
    { id: 'crossroads.4', text: 'Built where the roads cross; travellers from every road find an inn here.', needs: ['institution: tavern', 'tier: ≤ town', 'route: crossroads'], excludes: ['crisis: under_siege'] },
  ].map((row) => Object.freeze(row))),
});

/** settlementReason[1], thorp and hamlet: the wordings that follow `narrativeGenerator.js :: SMALL_PLACE_TIER_LINES`.
 * small.3 ("Fishing is part of how …") and small.15 ("… taken elsewhere to market.") are STRUCK (the integrator's word,
 * 2026-11-20): no atom declares what the presumption walker reads in them (a house named fishing; a market), and a
 * wording no atom declares is not built. The ids of the rest are kept.
 */
export const SMALL_PLACE_VARIANTS = Object.freeze([
  // the chair, 17:21, item 2: small places 1 as ruled ("each with its own work.")
  { id: 'small.1', text: 'A few households {ground}, each with its own work.', needs: [], excludes: [] },
  { id: 'small.2', text: 'A handful of homes {ground}, where any newcomer is noticed at once.', needs: [], excludes: [] },
  // the chair, 17:21, item 2: small places 4 also excludes `famine`
  { id: 'small.4', text: 'Grain from their own fields feeds the households here.', needs: ['grain'], excludes: ['famine'] },
  { id: 'small.5', text: 'Herds are part of how the households here feed themselves.', needs: ['livestock'], excludes: [] },
  { id: 'small.6', text: 'Hunting is part of how the households here feed themselves.', needs: ['game'], excludes: [] },
  { id: 'small.7', text: 'There is no market here; what a household cannot make, it must get elsewhere or do without.', needs: [], excludes: ['market'] },
  { id: 'small.8', text: 'In most years there is just enough here, and little put by.', needs: ['prosperity: ≤ poor'], excludes: ['famine'] },
  { id: 'small.9', text: 'The place is small, but its households want for little.', needs: ['prosperity: ≥ comfortable'], excludes: [] },
  { id: 'small.10', text: 'There is no temple here; for the rites, people go to the nearest place that has one.', needs: ['church access'], excludes: ['temple', 'church'] },
  { id: 'small.11', text: 'The place sends out its {export} to be sold.', needs: [], excludes: [] },
  { id: 'small.12', text: 'What little needs deciding here is decided by the elders together.', needs: ['ruling body', 'ruler: elder'], excludes: [] },
  { id: 'small.13', text: 'A palisade rings the few houses here.', needs: ['palisade'], excludes: [] },
  { id: 'small.14', text: 'The fields here grow more than the households eat.', needs: ['food surplus'], excludes: [] },
].map((row) => Object.freeze(row)));

/** settlementReason[1], a city with a meaningful food gap. Every wording keeps the gap. */
export const CITY_DEFICIT_VARIANTS = Object.freeze([
  { id: 'city.1', text: 'The city eats more than its own fields can grow; the rest comes in {routeWay}.', needs: [], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.2', text: 'Its own fields cannot fill the city\'s grain stores.', needs: ['institution: granary'], excludes: [] },
  { id: 'city.3', text: 'Part of what the city eats is bought at its market, not grown by its own people.', needs: ['market'], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.4', text: 'The city lands fish of its own, but still eats more than its fields and its catch provide.', needs: ['fish'], excludes: ['fish bought in'] },
  { id: 'city.5', text: 'Even its fish is bought in now; the city grows and catches less than it eats.', needs: ['fish bought in'], excludes: [] },
  { id: 'city.6', text: 'Barges bring food in by the river to a city its own fields cannot feed.', needs: ['river', 'docks'], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.7', text: 'Boats bring in food by water; its own fields cannot feed a city this size.', needs: ['coast', 'docks'], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.8', text: 'Its herds and its fields cannot feed the whole city; the rest must come from outside.', needs: ['livestock', 'grain'], excludes: [], foodImport: true },
  { id: 'city.9', text: 'The city can afford to buy what its own fields cannot grow, and it has to.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.10', text: 'A city this size {ground} eats more than its own fields can grow.', needs: [], excludes: [] },
  // PEOPLE-1's fix, kept (the chair, 17:21): "alongside its own" also needs the place's own grain
  { id: 'city.11', text: 'Grain from outside is ground here alongside its own; the city\'s fields cannot feed it.', needs: ['institution: mill', 'grain'], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.12', text: 'Carts of food come in at its gates; its own fields cannot feed it.', needs: ['gate', 'imports'], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.13', text: 'A city of this many people eats more than its own fields can grow.', needs: ['population: large'], excludes: [] },
  { id: 'city.14', text: 'Some of what is eaten here comes in {routeWay}; the city\'s own fields cannot grow enough.', needs: [], excludes: ['crisis: under_siege'], foodImport: true },
  { id: 'city.15', text: 'The fields around the city {ground} cannot feed it; the rest is bought in.', needs: [], excludes: ['crisis: under_siege'], foodImport: true },
].map((row) => Object.freeze(row)));

/** settlementReason[1], a metropolis outside a siege. */
export const METROPOLIS_VARIANTS = Object.freeze([
  { id: 'metropolis.1', text: 'Buyers and sellers from across the region come here to trade.', needs: ['market'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.2', text: 'Disputes from across the region are brought to court here.', needs: ['court'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.3', text: 'Its council decides matters for the whole region, not only for the city.', needs: ['ruler: council'], excludes: [] },
  { id: 'metropolis.4', text: 'Its lord\'s decisions reach well beyond the walls.', needs: ['ruler: lord', 'walls'], excludes: [] },
  { id: 'metropolis.5', text: 'Coin for the region\'s trade is lent, changed and kept here.', needs: ['institution: bank'], excludes: [] },
  { id: 'metropolis.6', text: 'Barges from up and down the river unload here.', needs: ['river', 'docks'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.7', text: 'Ships from along the coast unload here.', needs: ['coast', 'docks'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.8', text: 'Its {export} is sold across the region.', needs: [], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.9', text: 'The region\'s roads meet here, and its trade with them.', needs: ['route: crossroads'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.10', text: 'The region\'s trade and its business come to this city {ground}.', needs: [], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.11', text: 'Students from across the region come here to study.', needs: ['institution: school'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.12', text: 'Prices across the region follow what is paid here.', needs: ['market'], excludes: ['crisis: under_siege'] },
  { id: 'metropolis.13', text: 'The rules the region\'s trades work by are set here.', needs: ['guild'], excludes: [] },
  { id: 'metropolis.14', text: 'Contracts for the region\'s trade are drawn up and sealed here.', needs: ['legal house'], excludes: [] },
  { id: 'metropolis.15', text: 'People from across the region come here to be treated.', needs: ['hospital'], excludes: ['crisis: under_siege'] },
].map((row) => Object.freeze(row)));

/** The slot tokens a wording may carry. */
const SLOT = /\{(ground|export|routeWay)\}/g;

/**
 * The slot values a record's facts give: `{ground}`, `{export}`, `{routeWay}`; a slot the facts do not fill is absent.
 * @param {any} facts `factsOf(record)`
 * @param {Readonly<Record<string, string>> | null | undefined} groundPhrase the writer's `GROUND_PHRASE`
 * @returns {Readonly<{ ground?: string, export?: string, routeWay?: string }>}
 */
export function slotsOf(facts, groundPhrase) {
  /** @type {{ ground?: string, export?: string, routeWay?: string }} */ const out = {};
  /** @type {Readonly<Record<string, string>>} */ const ground = { ...(groundPhrase || {}), ...RIVERBANK };
  const terrain = facts?.terrain;
  if (typeof terrain === 'string' && Object.hasOwn(ground, terrain)) out.ground = ground[terrain];
  const exported = typeof facts?.goodExported === 'function' ? Object.keys(EXPORT_WORD).find((k) => facts.goodExported(k) === true) : undefined;
  if (exported) out.export = EXPORT_WORD[/** @type {keyof typeof EXPORT_WORD} */ (exported)];
  const route = facts?.route;
  if (typeof route === 'string' && Object.hasOwn(ROUTE_WAY, route)) out.routeWay = ROUTE_WAY[/** @type {keyof typeof ROUTE_WAY} */ (route)];
  return Object.freeze(out);
}

/**
 * A wording with its slots filled, or null where a slot it carries is not filled.
 * @param {string} text @param {Readonly<Record<string, string|undefined>>} slots @returns {string|null}
 */
export function fillWording(text, slots) {
  let missing = false;
  const filled = text.replace(SLOT, (_m, name) => {
    const v = slots[name];
    if (typeof v === 'string') return v;
    missing = true;
    return '';
  });
  return missing ? null : filled;
}

/**
 * @typedef {{ id: string, text: string, needs: ReadonlyArray<string>, excludes: ReadonlyArray<string>, foodImport?: boolean }} ReasonRow
 * @typedef {{ facts: () => any, slots: () => Readonly<Record<string, string|undefined>>, foodImport: boolean }} PlaceView
 */

/**
 * One line, varied: today's line at the head, the eligible wordings after it, picked by `pickVariantMixed` through
 * `drawDeclared`. Today's line comes back as it came where nothing is eligible.
 * @param {string} today the line the writer wrote
 * @param {ReadonlyArray<ReasonRow>} rows the pool
 * @param {string} seedKey the writer's own key for the line (it leads with the birth's seed)
 * @param {string} poolId the pool's name in the presumption ledger
 * @param {PlaceView} place
 * @returns {string}
 */
function variedLine(today, rows, seedKey, poolId, place) {
  const facts = place.facts();
  const admits = (/** @type {ReasonRow} */ row) => (row.foodImport !== true || place.foodImport)
    && fillWording(row.text, place.slots()) !== null
    && declarationAdmits(declarationOf(row), facts).admitted;
  if (!rows.some(admits)) return today;
  const head = { id: today, text: today };
  // The door is handed today's line and the pool as they stand; the draw composes `[today's line, ...eligible]` itself
  // and picks over it, so the drawn line is always admitted (resolvedBy 'drawn'). Handing the door the filtered list
  // instead would carry the facts' whole reader graph into the presumption walker's drawn ranges.
  const { line } = drawDeclared([head, ...rows], {
    draw: (pool) => pickVariantMixed(pool.filter((row) => row === head || admits(/** @type {ReasonRow} */ (row))), seedKey),
    facts, key: seedKey, poolId, surface: 'overview', drawKind: 'H',
  });
  if (!line || line === head) return today;
  return fillWording(/** @type {ReasonRow} */ (line).text, place.slots()) ?? today;
}

/**
 * THE ONE ENTRY (the writer's closing line, `narrativeGenerator.js :: generateSettlementReason`). Returns `lines` itself
 * where nothing is varied: no seed, no record handed, no eligible wording.
 * @param {string[]} lines the writer's lines (line 0, the origin; line 1, the size line where the size has one)
 * @param {{ tier: string, route?: string, config?: Record<string, any> | null, foodBalance?: Record<string, any> | null,
 *   roster?: { hasDocks?: boolean, record?: object | null } | null, seed?: string | null, specialResources?: readonly string[] | null, siege?: boolean, hasFoodDeficit?: boolean,
 *   originArmKey: (state: object) => string, originVariantKey: (state: object) => string | null,
 *   groundPhrase?: Readonly<Record<string, string>> | null }} ctx
 * @returns {string[]}
 */
export function variedReasonLines(lines, ctx) {
  const config = ctx?.config || {};
  const seed = typeof ctx?.seed === 'string' ? ctx.seed.trim() : '';
  const record = ctx?.roster?.record;
  if (!seed || !Array.isArray(lines) || !record || typeof record !== 'object') return lines;
  const special = ctx.specialResources;
  /** @type {any} */ let facts = null;
  /** @type {Readonly<Record<string, string|undefined>> | null} */ let slots = null;
  /** @type {PlaceView} */
  const place = {
    facts: () => (facts ??= factsOf(record)),
    slots: () => (slots ??= slotsOf(place.facts(), ctx.groundPhrase)),
    foodImport: ctx.foodBalance ? Number(ctx.foodBalance.importCoverage) > 0 : false,
  };
  const hasFoodDeficit = ctx.hasFoodDeficit === true;
  const siege = ctx.siege === true;
  /** @type {string[] | null} */ let out = null;
  const put = (/** @type {number} */ i, /** @type {string} */ text) => {
    if (text === lines[i]) return;
    out ??= [...lines];
    out[i] = text;
  };

  // line 0: the road, river and crossroads arms
  const terrainType = config.terrainType ?? null;
  const arm = ctx.originArmKey({ route: ctx.route, terrainType, hasFoodDeficit, hasDocks: ctx.roster?.hasDocks, hasFoodImport: ctx.foodBalance ? place.foodImport : undefined, siege });
  const originRows = Object.hasOwn(ORIGIN_VARIANTS, arm) ? ORIGIN_VARIANTS[/** @type {keyof typeof ORIGIN_VARIANTS} */ (arm)] : null;
  const originKey = ctx.originVariantKey({ seed, arm, terrainType, hasFoodDeficit, specialResources: Array.isArray(special) ? special : null });
  if (originRows && originKey && typeof lines[0] === 'string') put(0, variedLine(lines[0], originRows, originKey, `settlementReasonVariants:ORIGIN_VARIANTS.${arm}`, place));

  // line 1: the size line
  const tier = String(ctx.tier || '');
  const sizeRows = tier === 'thorp' || tier === 'hamlet' ? SMALL_PLACE_VARIANTS
    : tier === 'city' && hasFoodDeficit ? CITY_DEFICIT_VARIANTS
      : tier === 'metropolis' && !siege ? METROPOLIS_VARIANTS
        : null;
  const sizePool = sizeRows === SMALL_PLACE_VARIANTS ? 'SMALL_PLACE_VARIANTS' : sizeRows === CITY_DEFICIT_VARIANTS ? 'CITY_DEFICIT_VARIANTS' : 'METROPOLIS_VARIANTS';
  if (sizeRows && typeof lines[1] === 'string') put(1, variedLine(lines[1], sizeRows, `${seed}::settlement-tier-line::${tier}`, `settlementReasonVariants:${sizePool}`, place));

  return out ?? lines;
}
