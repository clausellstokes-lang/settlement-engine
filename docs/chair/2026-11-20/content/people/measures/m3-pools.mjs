// PEOPLE-1 seat M3 (2026-11-20): THE PROPOSED POOLS, as data, for the projection (m3-origins.mjs). Nothing here is
// imported by src/. Every wording declares `needs` (vocabulary atoms, factVocabulary.js, answered on the place's facts)
// and `excludes` (atoms that refuse it); a slot is filled from the place's own facts:
//   {ground}   the terrain as a place phrase (settlementOriginProse.js :: GROUND_PHRASE, plus 'riverside'); needs `terrain`
//   {export}   the first of the vocabulary's own export goods the place holds (`exported: flour|hides|ale|arms`,
//              goodExported.js :: EXPORTED_GOODS); the word is the key's plain name. `cloth` is NOT used: its words take
//              in "Raw wool", so "cloth" would be a fact the record lacks.
//   {routeWay} how goods reach a city by its route (road/crossroads: 'along the roads'; river: 'by the river';
//              port: 'by water'); needs `route`
// No ATOM outside the vocabulary is used by any wording below.
// Selection (the cure's pattern): pickVariant([index 0 = today's line, ...the wordings whose needs hold], key); a
// keyed hash, no draw. Index 0 of every pool is today's exact string.

export const GROUND = Object.freeze({
  coastal: 'on the shore', mountain: 'on the mountainside', hills: 'in the hills', forest: 'in the forest',
  plains: 'out on the open plain', desert: 'in the desert', riverside: 'on the riverbank',
});
export const EXPORT_WORD = Object.freeze({ flour: 'grain', hides: 'hides', ale: 'ale', arms: 'weapons' });
export const ROUTE_WAY = Object.freeze({ road: 'along the roads', crossroads: 'along the roads', river: 'by the river', port: 'by water' });
const SIEGE = 'crisis: under_siege';

/** settlementReason[0]: new wordings per ARM (settlementOriginProse.js :: ORIGIN_POOLS keeps its five; these follow). */
export const ORIGIN_VARIANTS = Object.freeze({
  road: [
    { text: 'It stands on the road {ground}, and the road is how people and goods reach it.', needs: ['terrain'], excludes: [SIEGE], why: 'the place\'s own terrain on its own route; the traveller\'s vantage' },
    { text: 'Built beside the road {ground}; what the place sells goes out along it, and what it buys comes in.', needs: ['terrain', 'exports', 'imports'], excludes: [SIEGE], why: 'its terrain, and it both exports and imports; the trade\'s vantage' },
    { text: 'A road settlement with a market of its own, where goods that come along the road are bought and sold.', needs: ['market'], excludes: [SIEGE], why: 'a market stands' },
    { text: 'It stands where the road meets the river, and goods come in by both.', needs: ['river', 'navigable'], excludes: [SIEGE, 'route: river'], why: 'a road place whose water home is a river' },
    { text: 'The road climbs to it through the hills, and every load comes up that road.', needs: ['terrain: hills'], excludes: [SIEGE, 'navigable'], why: 'its terrain is hills' },
    { text: 'The road winds up to it through the mountains, and every load comes up that road.', needs: ['terrain: mountain'], excludes: [SIEGE, 'navigable'], why: 'its terrain is mountain' },
    { text: 'It stands on the road, and its {export} goes out along it to be sold.', needs: ['exported'], excludes: [SIEGE], why: 'its own export good, by the vocabulary\'s keys' },
    { text: 'Built on the road across the open plain, among the grain fields that feed it.', needs: ['terrain: plains', 'grain'], excludes: ['famine'], why: 'plains, and grain is a food source' },
  ],
  river: [
    { text: 'It stands on the river {ground}, and the river is its way in and out.', needs: ['terrain'], excludes: [SIEGE, 'terrain: riverside'], why: 'its terrain (not riverside: the river is named already)' },
    { text: 'Built on the river, with landing stages where boats tie up to load and unload.', needs: ['docks'], excludes: [SIEGE], why: 'a docks house stands' },
    { text: 'Built on the river; its people fish it, and draw their water from it.', needs: ['fish', 'river'], excludes: [], why: 'fish is a food source, and its water is the river' },
    { text: 'A river settlement whose market takes in what comes by water and what comes by land.', needs: ['market'], excludes: [SIEGE], why: 'a market stands' },
    { text: 'A river settlement; its {export} goes out by the river to be sold.', needs: ['exported'], excludes: [SIEGE], why: 'its own export good' },
  ],
  crossroads: [
    { text: 'Built where the roads cross; its market draws buyers from every direction.', needs: ['market'], excludes: [SIEGE], why: 'a market stands' },
    { text: 'It stands where roads cross {ground}.', needs: ['terrain'], excludes: [], why: 'its terrain on its own route' },
    { text: 'Built at a crossroads; its {export} goes out along its roads.', needs: ['exported'], excludes: [SIEGE], why: 'its own export good' },
    { text: 'Built where the roads cross; travellers from every road find an inn here.', needs: ['institution: tavern', 'tier: ≤ town'], excludes: [SIEGE], why: 'an inn or tavern stands; not a city or metropolis (road row 3\'s own refusal, TRAVELLER_LIVING_REFUSED_TIERS)' },
  ],
});

/** settlementReason[1], thorp and hamlet (narrativeGenerator.js :: SMALL_PLACE_TIER_LINES keeps its five; these follow). */
export const SMALL_PLACE_VARIANTS = Object.freeze([
  { text: 'A few households {ground}, each with its own work and little to spare.', needs: ['terrain'], excludes: [], why: 'its terrain; the local\'s vantage' },
  { text: 'A handful of homes {ground}, where any newcomer is noticed at once.', needs: ['terrain'], excludes: [], why: 'its terrain; the traveller\'s vantage' },
  { text: 'Fishing is part of how the households here feed themselves.', needs: ['fish'], excludes: [], why: 'fish is a food source' },
  { text: 'Grain from their own fields feeds the households here.', needs: ['grain'], excludes: [], why: 'grain is a food source' },
  { text: 'Herds are part of how the households here feed themselves.', needs: ['livestock'], excludes: [], why: 'livestock is a food source' },
  { text: 'Hunting is part of how the households here feed themselves.', needs: ['game'], excludes: [], why: 'game is a food source' },
  { text: 'There is no market here; what a household cannot make, it must get elsewhere or do without.', needs: [], excludes: ['market'], why: 'no market stands' },
  { text: 'In most years there is just enough here, and little put by.', needs: ['prosperity: ≤ poor'], excludes: ['famine'], why: 'poor or below' },
  { text: 'The place is small, but its households want for little.', needs: ['prosperity: ≥ comfortable'], excludes: [], why: 'comfortable or better' },
  { text: 'There is no temple here; for the rites, people go to the nearest place that has one.', needs: ['church access'], excludes: ['temple'], why: 'the faith is reached elsewhere (faith.accessOnly)' },
  { text: 'The place sends out its {export} to be sold.', needs: ['exported'], excludes: [], why: 'its own export good' },
  { text: 'What little needs deciding here is decided by the elders together.', needs: ['ruling body', 'ruler: elder'], excludes: [], why: 'a ruling body of elders' },
  { text: 'A palisade rings the few houses here.', needs: ['palisade'], excludes: [], why: 'a palisade stands' },
  { text: 'The fields here grow more than the households eat.', needs: ['food surplus'], excludes: [], why: 'the place grows more than it eats (growsMoreThanEats)' },
  { text: 'What the place has to sell is taken elsewhere to market.', needs: ['exports'], excludes: ['market'], why: 'it exports, and no market stands' },
]);

/** settlementReason[1], city with a meaningful food gap (today: one line, 100 of 100 cities). Every wording keeps the gap. */
export const CITY_DEFICIT_VARIANTS = Object.freeze([
  { text: 'The city eats more than its own fields can grow; the rest comes in {routeWay}.', needs: ['route', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'the gap, food is brought in (importCoverage > 0), by its own route' },
  { text: 'Its own fields cannot fill the city\'s grain stores.', needs: ['institution: granary'], excludes: [], why: 'a granary stands' },
  { text: 'Part of what the city eats is bought at its market, not grown by its own people.', needs: ['market', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'a market stands and food is brought in' },
  { text: 'The city lands fish of its own, but still eats more than its fields and its catch provide.', needs: ['fish'], excludes: ['fish bought in'], why: 'fish is a food source, landed here' },
  { text: 'Even its fish is bought in now; the city grows and catches less than it eats.', needs: ['fish bought in'], excludes: [], why: 'its fish grounds are spent and fish is bought in' },
  { text: 'Barges bring food in by the river to a city its own fields cannot feed.', needs: ['river', 'docks', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'river water, a docks house, food brought in' },
  { text: 'Boats bring in food by water; its own fields cannot feed a city this size.', needs: ['coast', 'docks', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'coast, a docks house, food brought in' },
  { text: 'Its herds and its fields cannot feed the whole city; the rest must come from outside.', needs: ['livestock', 'grain', 'FOOD_IMPORT'], excludes: [], why: 'livestock and grain are food sources, food brought in' },
  { text: 'The city can afford to buy what its own fields cannot grow, and it has to.', needs: ['prosperity: ≥ comfortable', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'comfortable or better, food brought in' },
  { text: 'A city this size {ground} eats more than its own fields can grow.', needs: ['terrain'], excludes: [], why: 'its terrain' },
  { text: 'Grain from outside is ground here alongside its own; the city\'s fields cannot feed it.', needs: ['institution: mill', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'a mill stands, food brought in' },
  { text: 'Carts of food come in at its gates; its own fields cannot feed it.', needs: ['gate', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'a gate stands, food brought in' },
  { text: 'A city of this many people eats more than its own fields can grow.', needs: ['population: large'], excludes: [], why: 'a large population' },
  { text: 'Some of what is eaten here comes in {routeWay}; the city\'s own fields cannot grow enough.', needs: ['route', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'food brought in, by its own route; the local\'s vantage' },
  { text: 'The fields around the city {ground} cannot feed it; the rest is bought in.', needs: ['terrain', 'FOOD_IMPORT'], excludes: [SIEGE], why: 'its terrain, food brought in; the traveller\'s vantage' },
]);

/** settlementReason[1], metropolis (today: one line, or its siege twin). */
export const METROPOLIS_VARIANTS = Object.freeze([
  { text: 'Buyers and sellers from across the region come here to trade.', needs: ['market'], excludes: [SIEGE], why: 'markets stand; the trade\'s vantage' },
  { text: 'Disputes from across the region are brought to court here.', needs: ['court'], excludes: [SIEGE], why: 'a court stands; the official\'s vantage' },
  { text: 'Its council decides matters for the whole region, not only for the city.', needs: ['ruler: council'], excludes: [], why: 'a council rules' },
  { text: 'Its lord\'s decisions reach well beyond the walls.', needs: ['ruler: lord', 'walls'], excludes: [], why: 'a lord rules, walls stand' },
  { text: 'Coin for the region\'s trade is lent, changed and kept here.', needs: ['institution: bank'], excludes: [], why: 'a bank stands' },
  { text: 'Barges from up and down the river unload here.', needs: ['river', 'docks'], excludes: [SIEGE], why: 'river water, a docks house' },
  { text: 'Ships from along the coast unload here.', needs: ['coast', 'docks'], excludes: [SIEGE], why: 'coast, a docks house' },
  { text: 'Its {export} is sold across the region.', needs: ['exported'], excludes: [SIEGE], why: 'its own export good' },
  { text: 'The region\'s roads meet here, and its trade with them.', needs: ['route: crossroads'], excludes: [SIEGE], why: 'its route is a crossroads' },
  { text: 'The region\'s trade and its business come to this city {ground}.', needs: ['terrain'], excludes: [SIEGE], why: 'its terrain' },
  { text: 'Students from across the region come here to study.', needs: ['institution: school'], excludes: [SIEGE], why: 'a school stands' },
  { text: 'Prices across the region follow what is paid here.', needs: ['market'], excludes: [SIEGE], why: 'markets stand; the local\'s vantage' },
  { text: 'The rules the region\'s trades work by are set here.', needs: ['guild'], excludes: [], why: 'guilds stand' },
  { text: 'Contracts for the region\'s trade are drawn up and sealed here.', needs: ['legal house'], excludes: [], why: 'a legal house stands' },
  { text: 'People from across the region come here to be treated.', needs: ['hospital'], excludes: [SIEGE], why: 'a hospital stands' },
]);

/**
 * history.founding.foundedBy: wordings per CANONICAL row (narrativeGenerator.js :: FOUNDERS_BY_TIER as written). Each
 * keeps its row's kind, number and purpose (founder.js :: FOUNDER_KIND; foundingRowAdmits.js :: FOUNDER_PURPOSE,
 * FOUNDER_AGREES): every table that reads the founder reads it through its canonical row. Needs are read at the
 * founding draw's own state (birthFactsOf: roster, config, tier, world law): terrain, route, water and houses only.
 */
const T = (row, variants) => [row, variants];
export const FOUNDER_VARIANTS = Object.freeze(Object.fromEntries([
  // thorp
  T('a discharged soldier who liked the view and had nowhere better to be', [
    { text: 'a discharged soldier who came {ground} with nowhere better to be, and stayed', needs: ['terrain'] },
    { text: 'a discharged soldier who took the road home, stopped here, and never went on', needs: ['route: road'] },
    { text: 'a discharged soldier who stopped where the roads cross and never chose one', needs: ['route: crossroads'] },
    { text: 'a discharged soldier who built the first house by the river and stayed', needs: ['river'] },
    { text: 'a discharged soldier who built the first house within sight of the shore and stayed', needs: ['coast'] },
    { text: 'a discharged soldier who wanted to be far from any road, and found the place for it', needs: ['route: isolated'] },
    { text: 'a discharged soldier who raised the first palisade here and stayed behind it', needs: ['palisade'] },
  ]),
  T('a single extended family who came and never left', [
    { text: 'a single extended family who settled {ground} and never left', needs: ['terrain'] },
    { text: 'a single extended family who came along the road and never left', needs: ['route: road'] },
    { text: 'a single extended family who came by the river and never left', needs: ['route: river'] },
    { text: 'a single extended family who built where the roads cross and never left', needs: ['route: crossroads'] },
    { text: 'a single extended family who came by boat and never left', needs: ['route: port'] },
    { text: 'a single extended family who came far from the trade roads and never left', needs: ['route: isolated'] },
    { text: 'a single extended family who raised a palisade around their first houses and never left', needs: ['palisade'] },
  ]),
  T('a pair of siblings who disagreed about which direction to keep walking', [
    { text: 'a pair of siblings who stopped {ground} because they could not agree which way to go on', needs: ['terrain'] },
    { text: 'a pair of siblings who stopped where the roads cross, unable to agree which road to take', needs: ['route: crossroads'] },
    { text: 'a pair of siblings who reached the river and could not agree whether to cross it', needs: ['river'] },
    { text: 'a pair of siblings who reached the shore and would go no further', needs: ['coast'] },
    { text: 'a pair of siblings who walked the road this far and could not agree which way to go on', needs: ['route: road'] },
  ]),
  T('a healer who stopped to treat a traveller and found the location too useful to leave', [
    { text: 'a healer who stopped {ground} to treat a traveller and found the place too useful to leave', needs: ['terrain'] },
    { text: 'a healer who stopped at the crossroads to treat a traveller and stayed, since every road brought more', needs: ['route: crossroads'] },
    { text: 'a healer who treated a traveller on the road here and found the spot too useful to leave', needs: ['route: road'] },
    { text: 'a healer who treated a boatman on the river here and found the spot too useful to leave', needs: ['route: river'] },
    { text: 'a healer who stopped to treat a traveller here and stayed on to tend the sick', needs: ['healer'] },
  ]),
  // hamlet
  T('three or four families who agreed to try wintering together and never stopped', [
    { text: 'three or four families who agreed to try wintering together {ground} and never stopped', needs: ['terrain'] },
    { text: 'three or four families who wintered together beside the river and never moved on', needs: ['river'] },
    { text: 'three or four families who wintered together by the road and never moved on', needs: ['route: road'] },
    { text: 'three or four families who wintered together on the shore and never moved on', needs: ['coast'] },
    { text: 'three or four families who wintered together where the roads cross and never moved on', needs: ['route: crossroads'] },
    { text: 'three or four families who wintered together far from the trade roads and never moved on', needs: ['route: isolated'] },
    { text: 'three or four families who raised a palisade together for their first winter and never moved on', needs: ['palisade'] },
    { text: 'three or four families who wintered together at the edge of the wild country and never moved on', needs: ['monster frontier'] },
  ]),
  T('a retired tradesperson whose skills attracted dependents', [
    { text: 'a retired tradesperson who settled {ground}, whose skills drew others after', needs: ['terrain'] },
    { text: 'a retired tradesperson who set up by the road, whose skills drew others to settle near', needs: ['route: road'] },
    { text: 'a retired smith whose skills drew others to settle around the forge', needs: ['institution: smith'] },
    { text: 'a retired mason whose skills drew others to work the quarry', needs: ['institution: quarry'] },
    { text: 'a retired tradesperson who set up where the roads cross, whose skills drew others to settle near', needs: ['route: crossroads'] },
  ]),
  T('a household that settled first and found others following it in', [
    { text: 'a household that settled {ground} first and found others following it in', needs: ['terrain'] },
    { text: 'a household that settled first beside the river and found others following it in', needs: ['river'] },
    { text: 'a household that settled first beside the road and found others following it in', needs: ['route: road'] },
    { text: 'a household that settled first on the shore and found others following it in', needs: ['coast'] },
  ]),
  T('a small religious community whose members drifted into secular life over two generations', [
    { text: 'a small religious community that settled {ground}, whose members drifted into secular life over two generations', needs: ['terrain'] },
    { text: 'a small religious community that built the first temple here, whose members drifted into secular life over two generations', needs: ['institution: temple'] },
  ]),
  // village
  T('a group of settlers seeking new opportunities', [
    { text: 'a group of settlers who came {ground} looking for land of their own', needs: ['terrain'] },
    { text: 'a group of settlers who came by the river looking for land of their own', needs: ['route: river'] },
    { text: 'a group of settlers who followed the road looking for land of their own', needs: ['route: road'] },
    { text: 'a group of settlers who came to the crossroads looking for work and land', needs: ['route: crossroads'] },
    { text: 'a group of settlers who came by boat looking for land of their own', needs: ['route: port'] },
  ]),
  T('refugees fleeing war or persecution who found the location defensible', [
    { text: 'refugees fleeing war or persecution who found the hills easy to defend', needs: ['terrain: hills'] },
    { text: 'refugees fleeing war or persecution who found the mountainside easy to defend', needs: ['terrain: mountain'] },
    { text: 'refugees fleeing war or persecution who found cover in the forest', needs: ['terrain: forest'] },
    { text: 'refugees fleeing war or persecution who raised a palisade here and stayed behind it', needs: ['palisade'] },
    { text: 'refugees fleeing war or persecution who found the place defensible, far from the trade roads', needs: ['route: isolated'] },
  ]),
  T('a noble granted lands by the crown and obligated to populate them', [
    { text: 'a noble granted lands {ground} by the crown and obligated to populate them', needs: ['terrain'] },
    { text: 'a noble granted the river lands by the crown and obligated to populate them', needs: ['river'] },
    { text: 'a noble granted lands along the road by the crown and obligated to populate them', needs: ['route: road'] },
  ]),
  T('escaped serfs seeking a place beyond the reach of their former masters', [
    { text: 'escaped serfs who fled {ground}, beyond the reach of their former masters', needs: ['terrain'] },
    { text: 'escaped serfs who settled off the trade roads, beyond the reach of their former masters', needs: ['route: isolated'] },
    { text: 'escaped serfs who followed the river out of their former masters\' reach', needs: ['route: river'] },
  ]),
  T('a community of tradespeople who left a larger settlement under contested circumstances', [
    { text: 'a community of tradespeople who left a larger place after a quarrel and set up {ground}', needs: ['terrain'] },
    { text: 'a community of tradespeople who left a larger place under contested circumstances and set up their own market here', needs: ['market'] },
    { text: 'a community of tradespeople who left a larger place under contested circumstances and set up along the road', needs: ['route: road'] },
  ]),
  // town
  T('merchants recognising economic potential before anyone else did', [
    { text: 'merchants who saw what the road could bring before anyone else did', needs: ['route: road'] },
    { text: 'merchants who saw what the river could carry before anyone else did', needs: ['route: river'] },
    { text: 'merchants who saw what the crossroads could bring before anyone else did', needs: ['route: crossroads'] },
    { text: 'merchants who saw what a harbour here could bring before anyone else did', needs: ['route: port', 'docks'] },
    { text: 'merchants who saw what the land {ground} could yield before anyone else did', needs: ['terrain'] },
  ]),
  T('a noble granted lands by the crown with the resources to develop them', [
    { text: 'a noble granted lands {ground} by the crown, with the resources to develop them', needs: ['terrain'] },
    { text: 'a noble granted lands by the crown, with the resources to build the first mill and market', needs: ['institution: mill', 'market'] },
    { text: 'a noble granted the river lands by the crown, with the resources to develop them', needs: ['river'] },
  ]),
  T('military veterans given land grants who brought their skills with them', [
    { text: 'military veterans given land grants {ground}, who brought their skills with them', needs: ['terrain'] },
    { text: 'military veterans given land grants, who built the first walls with the skills they brought', needs: ['walls'] },
    { text: 'military veterans given land grants along the road, who brought their skills with them', needs: ['route: road'] },
  ]),
  T('a merchant consortium that needed a waypoint and decided to own it', [
    { text: 'a merchant consortium that needed a waypoint on the road and decided to own it', needs: ['route: road'] },
    { text: 'a merchant consortium that needed a landing on the river and decided to own it', needs: ['route: river'] },
    { text: 'a merchant consortium that needed a waypoint where the roads cross and decided to own it', needs: ['route: crossroads'] },
    { text: 'a merchant consortium that needed a harbour of its own and built one', needs: ['route: port', 'docks'] },
    { text: 'a merchant consortium that wanted a market of its own {ground} and built one', needs: ['terrain', 'market'] },
  ]),
  T('religious authorities who wanted a centre for their regional operations', [
    { text: 'religious authorities who wanted a centre for their work {ground}', needs: ['terrain'] },
    { text: 'religious authorities who built a monastery here as a centre for their work in the region', needs: ['institution: monastery'] },
  ]),
  // city
  T('a powerful noble house that needed a commercial base independent of rivals', [
    { text: 'a powerful noble house that needed a commercial base on the river, independent of rivals', needs: ['river'] },
    { text: 'a powerful noble house that needed a commercial base on the road, independent of rivals', needs: ['route: road'] },
    { text: 'a powerful noble house that needed a market of its own {ground}, independent of rivals', needs: ['terrain'] },
    { text: 'a powerful noble house that needed a harbour of its own, independent of rivals', needs: ['coast', 'docks'] },
  ]),
  T('a merchant coalition that grew too large for the town they started in', [
    { text: 'a merchant coalition that outgrew the place it started in and moved its business {ground}', needs: ['terrain'] },
    { text: 'a merchant coalition that outgrew the place it started in and moved its business to the river', needs: ['route: river'] },
    { text: 'a merchant coalition that outgrew the place it started in and moved to a harbour of its own', needs: ['coast', 'docks'] },
    { text: 'a merchant coalition that outgrew the place it started in and moved to where the roads cross', needs: ['route: crossroads'] },
  ]),
  T('a military command that built fortifications and found civilians followed', [
    { text: 'a military command that fortified a post {ground} and found civilians followed', needs: ['terrain'] },
    { text: 'a military command that fortified the river crossing and found civilians followed', needs: ['river'] },
    { text: 'a military command that fortified the crossroads and found civilians followed', needs: ['route: crossroads'] },
    { text: 'a military command that fortified the road and found civilians followed', needs: ['route: road'] },
  ]),
  T('royal decree and a century of forced investment', [
    { text: 'royal decree, and a century of forced investment in its walls and markets', needs: ['walls', 'market'] },
    { text: 'royal decree to build a city {ground}, and a century of forced investment', needs: ['terrain'] },
    { text: 'royal decree to hold the river, and a century of forced investment', needs: ['river'] },
    { text: 'royal decree to hold the crossing of the roads, and a century of forced investment', needs: ['route: crossroads'] },
  ]),
  // metropolis
  T('imperial decree and the systematic forced relocation of skilled populations', [
    { text: 'imperial decree, and skilled people moved by force to settle {ground}', needs: ['terrain'] },
    { text: 'imperial decree to hold the river, and the forced relocation of skilled populations', needs: ['river'] },
    { text: 'imperial decree to hold the road, and the forced relocation of skilled populations', needs: ['route: road'] },
  ]),
  T('a dynastic decision that this crossroads would anchor the realm', []),
  T('the slow accretion of three smaller settlements that eventually merged under a single administration', [
    { text: 'the slow accretion of three smaller settlements {ground} that eventually merged under a single administration', needs: ['terrain'] },
    { text: 'the slow accretion of three smaller settlements along the river that eventually merged under a single administration', needs: ['river'] },
    { text: 'the slow accretion of three smaller settlements along the road that eventually merged under a single administration', needs: ['route: road'] },
    { text: 'the slow accretion of three smaller settlements around a shared market, eventually merged under a single administration', needs: ['market'] },
  ]),
  T('a great trade house that outgrew every other settlement in the region', [
    { text: 'a great trade house whose river trade outgrew every other settlement in the region', needs: ['route: river'] },
    { text: 'a great trade house whose road trade outgrew every other settlement in the region', needs: ['route: road'] },
    { text: 'a great trade house {ground} that outgrew every other settlement in the region', needs: ['terrain'] },
    { text: 'a great trade house whose banking outgrew every other settlement in the region', needs: ['institution: bank'] },
    { text: 'a great trade house whose quays outgrew every other settlement in the region', needs: ['docks'] },
  ]),
]));

/**
 * history.founding.overcoming: the challenge's KIND (the record's own `history.founding.initialChallenge`, drawn
 * just before it: narrativeGenerator.js :: CHALLENGES_BY_ROUTE) and the prosperity TABLE the drawn row came from
 * (OVERCOMING_BY_PROSPERITY; Comfortable, Struggling and Modest fall back to Moderate today, unchanged here).
 * Each wording answers the challenge the page prints beside it ("Early trial:" / "How survived:") and keeps its
 * table's weight. Each is an adverbial phrase: it reads after "How survived:" and in historyBeats.js ::
 * deriveFirstProsperitySource ("Prosperity came slowly, <overcoming lowercased>.").
 */
export const CHALLENGE_KIND = Object.freeze({
  'piracy and coastal raids': 'threat', 'river bandits': 'threat', 'bandit activity on all four roads': 'threat',
  'hostile local inhabitants': 'threat', 'dangerous wildlife in the surrounding terrain': 'threat',
  'disputes over docking rights': 'rival', 'disputes over water rights': 'rival', 'rival claimants to the toll rights': 'rival',
  'rival claimants to the land': 'rival', 'competition from nearby markets': 'rival',
  'harassment by a nearby lord': 'lords', 'political pressure from surrounding lords': 'lords',
  'storms that destroyed the first harbour': 'water', 'seasonal flooding that destroyed early buildings': 'water',
  'navigation hazards upriver': 'water', 'harsh environmental conditions': 'land', 'poor early harvests': 'land',
  'lack of outside resources': 'land',
  'disease from sailors': 'sickness', 'disease and hardship in the early winters': 'sickness',
});
export const OVERCOMING_TABLES = Object.freeze({
  Wealthy: ['through ruthless commercial efficiency', 'by securing an exclusive charter before competitors could react', 'by outlasting every rival'],
  Prosperous: ['through sustained effort and reliable governance', 'by attracting the right people at the right time', 'through good fortune and good decisions in roughly equal measure'],
  Moderate: ['through determination and cooperation', 'by making enough right decisions to survive the wrong ones', 'with help from external allies at a critical moment'],
  Poor: ['at significant cost', 'though the founding was harder than anyone admitted at the time', 'by giving up more than the founders intended'],
});
export const OVERCOMING_VARIANTS = Object.freeze({
  Moderate: {
    threat: [
      { text: 'by keeping watch together until the attacks stopped', needs: [] },
      { text: 'by banding together whenever trouble came, until it came less often', needs: [] },
      { text: 'behind a palisade the first settlers raised together', needs: ['palisade'] },
    ],
    rival: [
      { text: 'by holding to their claim until the other side gave it up', needs: [] },
      { text: 'by striking a bargain with the other side that both could live with', needs: [] },
    ],
    lords: [
      { text: 'by paying the lords what they had to and no more', needs: [] },
      { text: 'by sending gifts and envoys until the pressure eased', needs: [] },
    ],
    water: [
      { text: 'by rebuilding after every loss until the place held', needs: [] },
      { text: 'by learning, year by year, when and where the water could be trusted', needs: [] },
    ],
    land: [
      { text: 'by sharing out what little there was until the place could stand on its own', needs: [] },
      { text: 'by working out, year by year, what the land here would allow', needs: [] },
    ],
    sickness: [
      { text: 'by caring for the sick until the worst had passed', needs: [] },
      { text: 'with the help of a healer who came to stay', needs: ['healer'] },
    ],
  },
  Poor: {
    threat: [
      { text: 'only after losing much of the first harvest to the attacks', needs: [] },
      { text: 'by holding on through the attacks, though not every household did', needs: [] },
    ],
    rival: [
      { text: 'by giving up part of what they claimed to settle the dispute', needs: [] },
      { text: 'by settling the dispute on worse terms than they wanted', needs: [] },
    ],
    lords: [
      { text: 'by paying the lords more than the place could spare', needs: [] },
      { text: 'by bowing to the lords\' demands for longer than anyone liked', needs: [] },
    ],
    water: [
      { text: 'by rebuilding twice over, with less each time', needs: [] },
      { text: 'only after losing much of what was first built to the water', needs: [] },
    ],
    land: [
      { text: 'by going short through the first hard years', needs: [] },
      { text: 'by making do with less than they needed, year after year', needs: [] },
    ],
    sickness: [
      { text: 'with fewer hands than they started with', needs: [] },
      { text: 'by nursing the sick through the worst of it, at a cost the place felt for years', needs: [] },
    ],
  },
  Prosperous: {
    threat: [
      { text: 'by paying for guards early, before the attacks could take hold', needs: [] },
      { text: 'behind walls built early and built well', needs: ['walls'] },
    ],
    rival: [
      { text: 'by settling the dispute early and on good terms', needs: [] },
      { text: 'by buying out the other claim as soon as they could afford to', needs: [] },
    ],
    lords: [
      { text: 'by keeping on good terms with the lords around them', needs: [] },
      { text: 'by making the place worth more to the lords as a friend than as a prize', needs: [] },
    ],
    water: [
      { text: 'by building sturdily from the start, so each loss was smaller than the last', needs: [] },
      { text: 'by rebuilding higher and stronger after the first losses', needs: [] },
    ],
    land: [
      { text: 'by laying in stores against the bad seasons from the first year', needs: [] },
      { text: 'by building sturdily from the start, so each hard year cost less than the last', needs: [] },
    ],
    sickness: [
      { text: 'by bringing in a physician early and following their advice', needs: [] },
    ],
  },
});
