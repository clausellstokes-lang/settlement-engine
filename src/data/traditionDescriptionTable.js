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
 * drawDeclared`): the composer's selector (`kernel/proseHash.js :: pickVariantMixed` on the record's stable id) runs
 * over the FULL pool; a line the record does not admit resolves to its declared TWIN (`twinOf`), else to the admitted
 * argmax. A line that presumes a thing DECLARES it (`needs` / `excludes` over the closed vocabulary,
 * `facts/factVocabulary.js`); a line that presumes nothing beyond what its slot's own choice guarantees (the house the
 * leaf found, the power, the owner, the founding, the event, the income's rank) says so with the house's colour mark
 * (`colour: true`, R-AO: "read; presumes nothing"), so no line of this table is silent (TRAD-4 unit 5;
 * tests/lint/traditionDescriptionFrames.walker).
 * THE CRISIS DIMENSION: the leads of a feast and of a fair, and the harvest's gloss, can clash with a town's present
 * crisis, so their pools OPT IN as crisis-scoped (silence then reads as calm): a line safe under any crisis says so
 * (`crisis: ['any']`); a line that contradicts a crisis family EXCLUDES it and has a TWIN that says only what is kept.
 * Every excluded line declares its family (`excludes: crisis: F`) and no crisis value, so in its crisis-scoped pool it is
 * refused under ANY active crisis (silence reads calm: factVocabulary.js :: crisisAdmits) and under F by name; it
 * resolves to its twin. The families are the vocabulary's own (factVocabulary.js :: CRISIS_FAMILY_KINDS):
 *   hunger (famine, a siege; any crisis with a food deficit): the four feast leads, the harvest glosses that give thanks.
 *   threat (a siege, an occupation, the beasts at the door): "a fair of stalls and trading", "a fair with traders from outside".
 * (TRAD-4's ruling, vetoable by the owner: kept as at the base, the calmest; no `crisis: any` beside an exclusion.)
 * A line never says what became of the rite this year: that is the simulation's own record (`lastOutcome`), which the
 * composer does not read.
 *
 * THE CAUSE LAW (CTR2). Only CAUSE_FRAMES assert a cause, reached on exactly two pairings: the founding core (genesis's
 * index 0, foundedYear 1) with the founding the record holds; a rite of the dead with the most recent siege, fire,
 * flood or plague the record holds AND grades major or catastrophic (DEAD_EVENT_TYPES, DEAD_EVENT_SEVERITIES), by its
 * name and year for the owner, by its KIND and year for a reader (DEAD_EVENT_PHRASES), never who won or what it cost.
 * tests/lint/traditionDescriptionFrames.walker.test.js holds the set, the cause words and the level words (the owner's
 * calm rule, CTR6).
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
 * @property {true} [colour]  the line presumes nothing beyond its slot (R-AO); a colour line declares nothing else
 */
/** @typedef {'body'|'place'} TraditionHouseKind  a BODY keeps a rite; a PLACE holds it */
/** @typedef {{ ids: ReadonlyArray<string>, kind: TraditionHouseKind }} TraditionHouseRow  catalogue ids (institutionalCatalog.js :: catalogIdForName) */
/** @typedef {{ source: string, prose: string, plural: boolean }} TraditionIncomeRow */

/** @param {TraditionLine} line @returns {Readonly<TraditionLine>} */
const line = (line) => Object.freeze(line);
const ANY = Object.freeze(['any']);
const NOT_HUNGRY = Object.freeze(['crisis: hunger']);
const NOT_THREATENED = Object.freeze(['crisis: threat']);
/** A line that presumes nothing beyond what its slot's own choice guarantees (the house's colour mark, R-AO). @param {string} text */
const plain = (text) => line({ text, colour: true });

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
    plain('A procession'), plain('A walking procession'),
    plain('A procession on foot'), plain('A slow procession'),
  ]),
  vigil: Object.freeze([
    plain('A vigil'), plain("A night's vigil"),
    plain('A quiet vigil'), plain('A vigil kept through the night'),
  ]),
  contest: Object.freeze([
    plain('A day of contests'), plain('A contest'),
    plain('A day of games and contests'), plain('A friendly contest'),
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
    plain('A day of offerings'), plain('An offering'),
    plain('An offering made in common'), plain('A day of small offerings'),
  ]),
});
/** The act pools that opted into the crisis dimension (silence reads as calm). */
export const CRISIS_SCOPED_ACTS = Object.freeze(['feast', 'fair']);

/**
 * S1, WHAT IS DONE: the element's gloss after "that", true by the element's own meaning, a pool of at least three a
 * kind (TRAD-4 unit 5: each a plain statement of what the rite marks). A thing a line presumes is the element's own
 * (genesis gives a water-keyed element only with water, a forge only with a smith, a market only with a market:
 * traditionCorpus.js :: TRADITION_ELEMENTS `needs`), declared on every line of its pool alike, and written on the line
 * itself (tests/lint/presumedThings.walker.test.js reads a declaration where the line stands); a line that gives thanks
 * EXCLUDES hunger and has its twin (harvest's pattern).
 */
export const ELEMENT_GLOSS = Object.freeze({
  founding: Object.freeze([plain('marks the founding'), plain('honours the founding'), plain('remembers the founding days')]),
  'first-landing': Object.freeze([
    line({ text: 'marks the first landing', needs: Object.freeze(['navigable']) }), line({ text: 'remembers the first landing', needs: Object.freeze(['navigable']) }),
    line({ text: 'honours the first boats to come ashore', needs: Object.freeze(['navigable']) }),
  ]),
  charter: Object.freeze([plain('honours the charter'), plain('marks the granting of the charter'), plain('remembers the charter')]),
  hearth: Object.freeze([plain('honours hearth and household'), plain('blesses hearth and home'), plain('honours home and family')]),
  harvest: Object.freeze([
    line({ text: 'gives thanks for the harvest', excludes: NOT_HUNGRY }),
    line({ text: 'is held for the harvest', twinOf: 'gives thanks for the harvest', crisis: ANY }),
    line({ text: 'marks the gathering of the harvest', crisis: ANY }),
    line({ text: 'gives thanks for what the fields have given', excludes: NOT_HUNGRY }),
    line({ text: 'is held for what the fields give', twinOf: 'gives thanks for what the fields have given', crisis: ANY }),
  ]),
  river: Object.freeze([
    line({ text: 'honours the river', needs: Object.freeze(['river']) }), line({ text: 'blesses the river', needs: Object.freeze(['river']) }),
    line({ text: 'honours the river and its waters', needs: Object.freeze(['river']) }),
  ]),
  stone: Object.freeze([plain('honours the standing stones'), plain('honours the old standing stones'), plain('stays true to the standing stones')]),
  'the-dead': Object.freeze([plain('remembers the dead'), plain('honours the dead'), plain('remembers those who came before')]),
  field: Object.freeze([plain('blesses the fields'), plain('honours the fields'), plain('blesses the furrows')]),
  forge: Object.freeze([
    line({ text: 'honours the forge', needs: Object.freeze(['institution: smith']) }), line({ text: 'blesses the forge', needs: Object.freeze(['institution: smith']) }),
    line({ text: "honours the smith's craft", needs: Object.freeze(['institution: smith']) }),
  ]),
  market: Object.freeze([
    line({ text: 'celebrates the market', needs: Object.freeze(['market']) }), line({ text: 'honours the market', needs: Object.freeze(['market']) }),
    line({ text: 'blesses the market and its trade', needs: Object.freeze(['market']) }),
  ]),
  hunt: Object.freeze([plain('honours the hunt'), plain('blesses the hunt'), plain('marks the hunting season')]),
  'long-sun': Object.freeze([plain('marks the long days of high summer'), plain('marks midsummer'), plain('honours the long summer sun')]),
  tide: Object.freeze([
    line({ text: 'honours the tide', needs: Object.freeze(['coast']) }), line({ text: 'blesses the tide', needs: Object.freeze(['coast']) }),
    line({ text: 'honours the sea and its tides', needs: Object.freeze(['coast']) }),
  ]),
  greening: Object.freeze([plain("welcomes the year's new growth"), plain('marks the coming of spring'), plain('honours the first green of the year')]),
  stars: Object.freeze([plain('is held under the stars'), plain('honours the stars'), plain('marks the courses of the stars')]),
});
/** The gloss pools that opted into the crisis dimension. */
export const CRISIS_SCOPED_ELEMENTS = Object.freeze(['harvest']);

/**
 * S1, A HELD ELEMENT'S GLOSS (TRAD-5 unit 13; the chair's ruling (B) of 20:56 UTC, the sixteen lines approved as written at
 * 21:03 UTC, vetoable by the owner): for each element, ONE line, read by a rite whose element an earlier rite of the
 * audience's own shown set already holds (traditionDescription.js :: compose), so a place that honours one thing twice says
 * so ("A procession on foot that also honours the first boats to come ashore."). NEVER A PICK: held apart from
 * ELEMENT_GLOSS (the KEEPER_FRAMES_TOO pattern), so no rite described alone, and no rite first of its element in the set,
 * reads one. Each is one of its element's present lines with "also" before it, declaring what that line declares (it
 * presumes nothing its element's lines do not); harvest's is its crisis-safe line, `crisis: any`, and needs no twin.
 */
export const ELEMENT_GLOSS_ALSO = Object.freeze({
  founding: Object.freeze([plain('also marks the founding')]),
  'first-landing': Object.freeze([line({ text: 'also honours the first boats to come ashore', needs: Object.freeze(['navigable']) })]),
  charter: Object.freeze([plain('also honours the charter')]),
  hearth: Object.freeze([plain('also honours hearth and household')]),
  harvest: Object.freeze([line({ text: 'also marks the gathering of the harvest', crisis: ANY })]),
  river: Object.freeze([line({ text: 'also honours the river', needs: Object.freeze(['river']) })]),
  stone: Object.freeze([plain('also honours the standing stones')]),
  'the-dead': Object.freeze([plain('also remembers the dead')]),
  field: Object.freeze([plain('also blesses the fields')]),
  forge: Object.freeze([line({ text: 'also honours the forge', needs: Object.freeze(['institution: smith']) })]),
  market: Object.freeze([line({ text: 'also honours the market', needs: Object.freeze(['market']) })]),
  hunt: Object.freeze([plain('also honours the hunt')]),
  'long-sun': Object.freeze([plain('also marks midsummer')]),
  tide: Object.freeze([line({ text: 'also honours the tide', needs: Object.freeze(['coast']) })]),
  greening: Object.freeze([plain('also marks the coming of spring')]),
  stars: Object.freeze([plain('also honours the stars')]),
});

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

/**
 * S2, WHO KEEPS IT, a house: by kind, with a presiding person (the house card's own title) or a power for a place.
 * NO FRAME MAKES THE HOUSE THE SUBJECT OF A VERB: a house's prose form may be plural ("the market squares", "the
 * blacksmiths") and no house rule says which, so every frame reads alike for one house or many (the same for an owner).
 */
export const HOUSE_FRAMES = Object.freeze({
  body: Object.freeze([plain('It is kept by {house}.'), plain('Its keeping falls to {house}.'), plain('It is in the keeping of {house}.')]),
  bodyPerson: Object.freeze([
    plain('It is kept by {house}, and {person}, {title}, presides.'), plain('Its keeping falls to {house}; {person}, {title}, presides.'),
    plain('It is in the keeping of {house}, with {person}, {title}, presiding.'),
  ]),
  place: Object.freeze([plain('It is held at {house}.'), plain('It is kept at {house}.'), plain('It takes place at {house}.')]),
  placePerson: Object.freeze([
    plain('It is held at {house}, where {person}, {title}, presides.'), plain('It is kept at {house}, where {person}, {title}, presides.'),
    plain('It takes place at {house}, with {person}, {title}, presiding.'),
  ]),
  placePower: Object.freeze([
    plain('It is held at {house}, in the keeping of {power}.'), plain('It is kept at {house} and falls to {power}.'),
    plain('It takes place at {house}; it falls to {power}.'),
  ]),
});

/**
 * S2, WHO KEEPS IT, a power: by the engine's own owner archetype (politics.js :: desiredArchetype, design §6). A frame
 * whose subject is the power hands its verb as a SLOT (POWER_FRAME_VERBS), and the power's own number chooses the form
 * through the line's one reader (data/people/powerSentenceName.js :: powerVerb): "the Elder Council oversees it", "the
 * Merchant Guilds oversee it".
 */
export const POWER_FRAMES = Object.freeze({
  seat: Object.freeze([plain('It is overseen by {power}.'), plain('It falls to {power}.'), plain('{Power} {oversees} it.')]),
  religious: Object.freeze([plain('It falls to {power}.'), plain('It is in the keeping of {power}.'), plain('{Power} {keeps} it.')]),
  merchantry: Object.freeze([plain('Its cost is met by {power}.'), plain('It is paid for by {power}.'), plain('{Power} {meets} its cost.')]),
});
/** A power's verb slot in POWER_FRAMES: its singular form, then its plural (powerVerb's `one`, `many`). */
export const POWER_FRAME_VERBS = Object.freeze({
  oversees: Object.freeze(['oversees', 'oversee']),
  keeps: Object.freeze(['keeps', 'keep']),
  meets: Object.freeze(['meets', 'meet']),
});

/** S2, WHO KEEPS IT, in play: the record's own owner (ownerKind, ownerLabel), and nothing beside it; never the subject
 *  of a verb (a house or a power may be plural: HOUSE_FRAMES). */
export const OWNER_FRAMES = Object.freeze([plain('It is kept now by {owner}.'), plain('Its keeping falls now to {owner}.'), plain('It is in the keeping of {owner} now.')]);

/**
 * S2, WHO KEEPS IT, AGAIN (TRAD-4 unit 10; the chair's ruling of 17:55 UTC, vetoable by the owner): for each keeper frame
 * kind, a fourth and a fifth wording, for a later rite of the SAME keeper in one town once the kind's three frames are
 * taken (traditionDescription.js :: drawTurn's rotation). NEVER A PICK: held apart from HOUSE_FRAMES, POWER_FRAMES and
 * OWNER_FRAMES, so no rite described alone, and no rite first to name its keeper, reads one. Each names the keeper (a
 * place power: the place and the power) and drops the presider's clause (an earlier rite said it); no house is the
 * subject of a verb; a power as subject takes its verb through a POWER_FRAME_VERBS slot. Beyond the fifth, the keeper
 * sentence is left out.
 */
export const KEEPER_FRAMES_TOO = Object.freeze({
  body: Object.freeze([plain('It too is in the keeping of {house}.'), plain('This one, too, is kept by {house}.')]),
  bodyPerson: Object.freeze([plain('Its keeping, too, falls to {house}.'), plain('It, too, is kept by {house}.')]),
  place: Object.freeze([plain('It too is held at {house}.'), plain('This one, too, is kept at {house}.')]),
  placePerson: Object.freeze([plain('It too takes place at {house}.'), plain('This one, too, is held at {house}.')]),
  placePower: Object.freeze([
    plain('It too is held at {house}, in the keeping of {power}.'), plain('This one, too, is kept at {house} and falls to {power}.'),
  ]),
  seat: Object.freeze([plain('It too falls to {power}.'), plain('{Power} {oversees} this one as well.')]),
  religious: Object.freeze([plain('It too is in the keeping of {power}.'), plain('{Power} {keeps} this one as well.')]),
  merchantry: Object.freeze([plain('Its cost too is met by {power}.'), plain('{Power} {meets} the cost of this one as well.')]),
  owner: Object.freeze([plain('It too is kept now by {owner}.'), plain('This one, too, falls now to {owner}.')]),
});

/** S3, WHERE IT COMES FROM: the only frames that assert a cause (CTR2). */
export const CAUSE_FRAMES = Object.freeze({
  founding: Object.freeze([
    plain('It has been kept since {town} was founded, {age} years ago, by {foundedBy}.'),
    plain('{Town} has kept it since its founding {age} years ago by {foundedBy}.'),
    plain('It goes back {age} years, to the founding of {town} by {foundedBy}.'),
  ]),
  foundingBare: Object.freeze([
    plain('It has been kept since {town} was founded, {age} years ago.'),
    plain('{Town} has kept it since its founding, {age} years ago.'),
    plain('It goes back to the founding of {town}, {age} years ago, and has been kept since.'),
  ]),
  dead: Object.freeze([
    plain('It is kept in memory of {event}, {when}.'),
    plain('{Town} keeps it in memory of {event}, {when}.'),
    plain('It has been kept in memory of {event} since then, {when}.'),
  ]),
});

/** The history event kinds a rite of the dead may be kept in memory of (the chair's marked pairing). */
export const DEAD_EVENT_TYPES = Object.freeze(['great_fire', 'great_flood', 'plague_years', 'external_threat']);
/** …and only one the record itself grades major or catastrophic (the chair's tightening, BUILD item 3). */
export const DEAD_EVENT_SEVERITIES = Object.freeze(['major', 'catastrophic']);
/**
 * THE READER'S EVENT, BY ITS KIND (TRAD-3 unit 4, the chair's item 3, 2026-11-20): a reader's rite of the dead names the
 * event by an authored phrase of its template type, never by the record's `event.name` (a field veil-22's name sweep can
 * withhold whole). Each is the born event's own name in plain words ("The Great Fire" → "the great fire"), with its
 * article; the frames walker holds them to the level law and to DEAD_EVENT_TYPES.
 */
export const DEAD_EVENT_PHRASES = Object.freeze({
  great_fire: 'the great fire',
  great_flood: 'the flood',
  // not "the plague years": the vocabulary's `plague` names a plague IN FORCE (registeredWords.js), and this is a past one
  plague_years: 'the years of sickness',
  external_threat: 'the siege',
});

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
    plain('Nothing brings {town} more than {income}.'),
    plain('{Income} {brings} {town} more than anything else.'),
    plain('{Town} takes in more from {income} than from anything else.'),
  ]),
  lesser: Object.freeze([
    plain('A good share of what {town} takes in comes from {income}.'),
    plain('{Income} {is} one of the mainstays of {town}.'),
    plain('{Town} takes in a good part of its living from {income}.'),
  ]),
  only: Object.freeze([
    plain('All that {town} takes in comes from {income}.'),
    plain('{Town} lives by {income} alone.'),
    plain('{Income} {is} all {town} lives by.'),
  ]),
});
/** How many of the town's largest incomes the economy sentence may name (chief, then two lesser). */
export const ECONOMY_RANKS = Object.freeze(['chief', 'lesser', 'lesser']);
