/**
 * traditionDescriptionTable.js — TRAD-1 (the seventh chair, 2026-11-20; rulings CTR1-CTR10): THE TABLE OF WHAT FITS
 * WHAT for the description under each tradition, and its POOLS. A PURE DATA leaf (src/data): frozen tables only, zero
 * behaviour, no imports; the composer is `domain/traditions/traditionDescription.js` (the traditionCorpus/genesis split).
 *
 * THE OWNER (2026-11-20): "give appropriate descriptions per tradition that draws from coherently the history, power,
 * economy, institutions" — "Don't invent drama … Sometimes a calm place is precisely what's needed" — and, of the
 * samples: "make sure that it has appropriate pool and prose conditions".
 *
 * EVERY SLOT IS A POOL, AND EVERY LINE IS A DECLARED LINE (CTR10) drawn through the one draw (`facts/drawDeclared.js ::
 * drawDeclared`): the composer's selector (`kernel/proseHash.js :: pickVariant` on the record's stable id) runs over the
 * FULL pool; a line the record does not admit resolves to its declared TWIN (`twinOf`), else to the admitted argmax.
 * A line that presumes a thing DECLARES it (`needs` / `excludes` over the closed vocabulary, `facts/factVocabulary.js`).
 * THE CRISIS DIMENSION: the leads of a feast and of a fair, and the harvest's gloss, can clash with a town's present
 * crisis, so their pools OPT IN as crisis-scoped (silence then reads as calm): a line safe under any crisis says so
 * (`crisis: ['any']`); a line that contradicts a crisis family EXCLUDES it and has a TWIN that says only what is kept.
 *   hunger (famine, a food deficit): "a common feast", "a feast eaten in common", "gives thanks for the harvest".
 *   threat (siege, occupation, war, raiders): "a fair of stalls and trading", "a fair with traders from outside".
 *   succession and unrest: no line here contradicts them (no line says the seat is settled or the streets are quiet).
 * A line never says what became of the rite this year: that is the simulation's own record (`lastOutcome`).
 *
 * THE CAUSE LAW (CTR2). Only CAUSE_FRAMES assert a cause, reached on exactly two pairings: the founding core (genesis's
 * index 0, foundedYear 1) with the founding the record holds; a rite of the dead with the most recent siege, fire,
 * flood or plague the record holds AND grades major or catastrophic (DEAD_EVENT_TYPES, DEAD_EVENT_SEVERITIES), by its
 * name and year, never who won or what it cost. tests/lint/traditionDescriptionFrames.walker.test.js holds the set, the
 * cause words and the level words (the owner's calm rule, CTR6).
 *
 * Everything here is taste-adjacent and vetoable by the owner.
 */

/**
 * @typedef {Object} TraditionLine  a declared pool line (`tests/lint/declaredLineShape.test.js` holds the shape)
 * @property {string} text
 * @property {ReadonlyArray<string>} [needs]
 * @property {ReadonlyArray<string>} [excludes]
 * @property {ReadonlyArray<string>} [crisis]
 * @property {string} [twinOf]  a TWIN: reached only when the line it names is refused
 */
/** @typedef {'body'|'place'} TraditionHouseKind  a BODY keeps a rite; a PLACE holds it */
/** @typedef {{ ids: ReadonlyArray<string>, kind: TraditionHouseKind }} TraditionHouseRow  catalogue ids (institutionalCatalog.js :: catalogIdForName) */
/** @typedef {{ source: string, prose: string, plural: boolean }} TraditionIncomeRow */

/** @param {TraditionLine} line @returns {Readonly<TraditionLine>} */
const line = (line) => Object.freeze(line);
const ANY = Object.freeze(['any']);
const NOT_HUNGRY = Object.freeze(['crisis: hunger']);
const NOT_THREATENED = Object.freeze(['crisis: threat']);

/** S1, WHAT IS DONE: the act's lead, a pool of at least four an act. Every lead is a singular noun phrase. */
export const ACT_LEADS = Object.freeze({
  feast: Object.freeze([
    line({ text: 'A common feast', excludes: NOT_HUNGRY }),
    line({ text: 'A feast eaten in common', excludes: NOT_HUNGRY }),
    line({ text: 'A feast at long tables', excludes: NOT_HUNGRY }),
    line({ text: 'A feast shared among neighbours', excludes: NOT_HUNGRY }),
    line({ text: 'A feast day', twinOf: 'A common feast', crisis: ANY }),
    line({ text: 'A feast day kept by custom', twinOf: 'A feast eaten in common', crisis: ANY }),
    line({ text: 'A feast kept as of old', twinOf: 'A feast at long tables', crisis: ANY }),
    line({ text: 'A feast day kept as of old', twinOf: 'A feast shared among neighbours', crisis: ANY }),
  ]),
  procession: Object.freeze([
    line({ text: 'A procession' }), line({ text: 'A walking procession' }),
    line({ text: 'A procession on foot' }), line({ text: 'A slow procession' }),
  ]),
  vigil: Object.freeze([
    line({ text: 'A vigil' }), line({ text: "A night's vigil" }),
    line({ text: 'A quiet vigil' }), line({ text: 'A vigil kept through the night' }),
  ]),
  contest: Object.freeze([
    line({ text: 'A day of contests' }), line({ text: 'A contest' }),
    line({ text: 'A day of games and contests' }), line({ text: 'A friendly contest' }),
  ]),
  fair: Object.freeze([
    line({ text: 'A fair', crisis: ANY }),
    line({ text: 'A fair of stalls and trading', excludes: NOT_THREATENED }),
    line({ text: 'A fair with traders from outside', excludes: NOT_THREATENED }),
    line({ text: 'A fair day', crisis: ANY }),
    line({ text: 'A fair kept by custom', twinOf: 'A fair of stalls and trading', crisis: ANY }),
    line({ text: 'A fair kept as of old', twinOf: 'A fair with traders from outside', crisis: ANY }),
  ]),
  offering: Object.freeze([
    line({ text: 'A day of offerings' }), line({ text: 'An offering' }),
    line({ text: 'An offering made in common' }), line({ text: 'A day of small offerings' }),
  ]),
});
/** The act pools that opted into the crisis dimension (silence reads as calm). */
export const CRISIS_SCOPED_ACTS = Object.freeze(['feast', 'fair']);

/** S1, WHAT IS DONE: the element's gloss after "that", true by the element's own meaning; a thing it presumes, declared. */
export const ELEMENT_GLOSS = Object.freeze({
  founding: Object.freeze([line({ text: 'marks the founding' })]),
  'first-landing': Object.freeze([line({ text: 'marks the first landing', needs: Object.freeze(['navigable']) })]),
  charter: Object.freeze([line({ text: 'honours the charter' })]),
  hearth: Object.freeze([line({ text: 'honours hearth and household' })]),
  harvest: Object.freeze([
    line({ text: 'gives thanks for the harvest', excludes: NOT_HUNGRY }),
    line({ text: 'is kept for the harvest', twinOf: 'gives thanks for the harvest', crisis: ANY }),
  ]),
  river: Object.freeze([line({ text: 'honours the river', needs: Object.freeze(['river']) })]),
  stone: Object.freeze([line({ text: 'honours the standing stones' })]),
  'the-dead': Object.freeze([line({ text: 'remembers the dead' })]),
  field: Object.freeze([line({ text: 'blesses the fields' })]),
  forge: Object.freeze([line({ text: 'honours the forge', needs: Object.freeze(['institution: smith']) })]),
  market: Object.freeze([line({ text: 'celebrates the market', needs: Object.freeze(['market']) })]),
  hunt: Object.freeze([line({ text: 'honours the hunt' })]),
  'long-sun': Object.freeze([line({ text: 'marks the long days of high summer' })]),
  tide: Object.freeze([line({ text: 'honours the tide', needs: Object.freeze(['coast']) })]),
  greening: Object.freeze([line({ text: "welcomes the year's new growth" })]),
  stars: Object.freeze([line({ text: 'is kept under the stars' })]),
});
/** The gloss pools that opted into the crisis dimension. */
export const CRISIS_SCOPED_ELEMENTS = Object.freeze(['harvest']);

/** @param {ReadonlyArray<string>} ids @returns {TraditionHouseRow} */
const body = (ids) => Object.freeze({ ids: Object.freeze([...ids]), kind: /** @type {const} */ ('body') });
/** @param {ReadonlyArray<string>} ids @returns {TraditionHouseRow} */
const place = (ids) => Object.freeze({ ids: Object.freeze([...ids]), kind: /** @type {const} */ ('place') });

const RELIGIOUS_HOUSES = Object.freeze([
  body(['great_cathedral', 'cathedral_10_000_only']), body(['major_monasteries_5_10', 'multiple_monasteries', 'monastery_or_friary']),
  body(['parish_church', 'parish_churches_2_5', 'parish_churches_10_30', 'parish_churches_50_100']), body(['priest_resident']),
  place(['wayside_shrine']),
]);
const MARKET_PLACES = Object.freeze([
  place(['weekly_market', 'market_square', 'multiple_market_squares', 'daily_markets', 'district_markets_5_10', 'periodic_market']),
]);

/**
 * WHO KEEPS IT: the kinds of house that fit, by element first, then by act, in preference order, keyed by catalogue id.
 * The table holds no kind the gallery veil may hide whole (people/cardVeil.js :: isHideableHouse). The founding
 * elements (and every founding core) take no house: the seat keeps them. Hearth, stone, long-sun and field have none.
 */
export const KEEPER_HOUSES = Object.freeze({
  element: Object.freeze({
    'the-dead': Object.freeze([...RELIGIOUS_HOUSES, place(['burial_ground', 'graveyard', 'parish_burial_grounds', 'burial_grounds_and_charnel_house', 'cemetery_network'])]),
    stars: RELIGIOUS_HOUSES,
    greening: Object.freeze([body(['elder_grove_council', 'druid_circle'])]),
    harvest: Object.freeze([place(['town_granary', 'city_granaries', 'state_granary_complex', 'communal_root_cellar', 'mill', 'mills_2_5'])]),
    river: Object.freeze([body(['river_ferry', 'barge_and_river_transport_company']), place(['river_boatyard'])]),
    tide: Object.freeze([body(['harbour_master_s_office', 'fishing_community']), place(['fisher_s_landing'])]),
    forge: Object.freeze([body(['blacksmiths_3_10', 'blacksmith', 'resident_smith_part_time', 'specialized_metalworkers'])]),
    market: MARKET_PLACES,
    hunt: Object.freeze([body(['hunter_s_lodge', 'wildfowler']), place(['furrier_s_district'])]),
  }),
  act: Object.freeze({
    offering: RELIGIOUS_HOUSES,
    vigil: RELIGIOUS_HOUSES,
    fair: MARKET_PLACES,
    contest: Object.freeze([place(['colosseum_arena']), body(['gladiatorial_school'])]),
  }),
});

/** S2, WHO KEEPS IT, a house: by kind, with a presiding person (the house card's own title) or a power for a place. */
export const HOUSE_FRAMES = Object.freeze({
  body: Object.freeze(['It is kept by {house}.', 'Its keeping falls to {house}.', '{House} keeps it.']),
  bodyPerson: Object.freeze([
    'It is kept by {house}, and {person}, {title}, presides.', 'Its keeping falls to {house}; {person}, {title}, presides.',
    '{House} keeps it, with {person}, {title}, presiding.',
  ]),
  place: Object.freeze(['It is held at {house}.', 'It is kept at {house}.', '{House} is where it is kept.']),
  placePerson: Object.freeze([
    'It is held at {house}, where {person}, {title}, presides.', 'It is kept at {house}, where {person}, {title}, presides.',
    '{House} is where it is kept, with {person}, {title}, presiding.',
  ]),
  placePower: Object.freeze([
    'It is held at {house}, in the keeping of {power}.', 'It is kept at {house} and falls to {power}.',
    '{House} is where it is kept; it falls to {power}.',
  ]),
});

/** S2, WHO KEEPS IT, a power: by the engine's own owner archetype (politics.js :: desiredArchetype, design §6). */
export const POWER_FRAMES = Object.freeze({
  seat: Object.freeze(['It is overseen by {power}.', 'It falls to {power}.', '{Power} oversees it.']),
  religious: Object.freeze(['It falls to {power}.', 'It is in the keeping of {power}.', '{Power} keeps it.']),
  merchantry: Object.freeze(['Its cost is met by {power}.', 'It is paid for by {power}.', '{Power} meets its cost.']),
});

/** S2, WHO KEEPS IT, in play: the record's own owner (ownerKind, ownerLabel), and nothing beside it. */
export const OWNER_FRAMES = Object.freeze(['It is kept now by {owner}.', 'Its keeping falls now to {owner}.', '{Owner} keeps it now.']);

/** S3, WHERE IT COMES FROM: the only frames that assert a cause (CTR2). */
export const CAUSE_FRAMES = Object.freeze({
  founding: Object.freeze([
    'It has been kept since {town} was founded by {foundedBy}, {age} years ago.',
    '{Town} has kept it since its founding by {foundedBy}, {age} years ago.',
    'It goes back to the founding of {town} by {foundedBy}, {age} years ago, and has been kept since.',
  ]),
  foundingBare: Object.freeze([
    'It has been kept since {town} was founded, {age} years ago.',
    '{Town} has kept it since its founding, {age} years ago.',
    'It goes back to the founding of {town}, {age} years ago, and has been kept since.',
  ]),
  dead: Object.freeze([
    'It is kept in memory of {event}, {when}.',
    '{Town} keeps it in memory of {event}, {when}.',
    'It has been kept in memory of {event} since then, {when}.',
  ]),
});

/** The history event kinds a rite of the dead may be kept in memory of (the chair's marked pairing). */
export const DEAD_EVENT_TYPES = Object.freeze(['great_fire', 'great_flood', 'plague_years', 'external_threat']);
/** …and only one the record itself grades major or catastrophic (the chair's tightening, BUILD item 3). */
export const DEAD_EVENT_SEVERITIES = Object.freeze(['major', 'catastrophic']);

/** @param {string} source @param {string} prose @param {boolean} plural @returns {TraditionIncomeRow} */
const income = (source, prose, plural) => Object.freeze({ source, prose, plural });
const LAND_INCOMES = Object.freeze([income('Harvest', 'the harvest', false), income('Grain Sales', 'grain sales', true), income('Agricultural Rents', 'farm rents', true)]);
const MARKET_INCOMES = Object.freeze([income('Market Taxes', 'market taxes', true)]);

/** S3, WHO PAYS: the economy the town lives on, by element (or act): income sources, with their prose forms. */
export const ECONOMY_FIT = Object.freeze({
  harvest: LAND_INCOMES,
  field: LAND_INCOMES,
  river: Object.freeze([income('River Tolls', 'river tolls', true)]),
  tide: Object.freeze([income('Fish & Maritime Produce', 'fish and maritime produce', false), income('Fish & Preserved Produce', 'fish and preserved produce', false), income('Port Duties', 'port duties', true)]),
  'first-landing': Object.freeze([income('Port Duties', 'port duties', true), income('River Tolls', 'river tolls', true)]),
  forge: Object.freeze([income('Iron & Metalwork', 'iron and metalwork', false), income('Coal Sales', 'coal sales', true)]),
  market: MARKET_INCOMES,
  fair: MARKET_INCOMES,
});

/**
 * S3, WHO PAYS: the rank the record holds (`incomeSources` is sorted by share), in plain words; never that the rite pays
 * for or earns it. `chief` for the first, `lesser` for the second and third, `only` for a town with one income.
 */
export const ECONOMY_FRAMES = Object.freeze({
  chief: Object.freeze([
    'Nothing brings {town} more than {income}.',
    '{Income} {brings} {town} more than anything else.',
    '{Town} takes in more from {income} than from anything else.',
  ]),
  lesser: Object.freeze([
    'A good share of what {town} takes in comes from {income}.',
    '{Income} {is} one of the mainstays of {town}.',
    '{Town} takes in a good part of its living from {income}.',
  ]),
  only: Object.freeze([
    'All that {town} takes in comes from {income}.',
    '{Town} lives by {income} alone.',
    '{Income} {is} all {town} lives by.',
  ]),
});
/** How many of the town's largest incomes the economy sentence may name (chief, then two lesser). */
export const ECONOMY_RANKS = Object.freeze(['chief', 'lesser', 'lesser']);
