#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/lines/L1/probe.1b.mjs > docs/chair/2026-11-20/content/daily/lines/L1/probe.1b.out.txt 2>&1
 *   node docs/chair/2026-11-20/content/daily/lines/L1/probe.1b.mjs --pools      (prints the pools as markdown and exits; no births)
 *
 * DAILY-1 · L1b — probe.1.mjs with THE CHAIR'S RULING ON LINES-1 (18:37 UTC) applied; the probe of the drafted pools for `dawn_work`, `gathering_places`, `child_warnings`
 * (briefs: ../../briefs/LINES-COMMON.md, ../../briefs/L1-FALSEST-THREE.md). Measure only: nothing under src/ is changed.
 * Births: M1's recipe copied (150 a size, seeds hxd-<size>-0..149; PAGE-9's THIN recipe):
 *   loadGenerationLawPayloads(); generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} }).
 * (Scratch only: L1_BIRTHS_JSON=<path> reads a JSON dump of the same 900 births instead; the .out.txt is never made that way.)
 * Each slot: branch (dailyLife.js's own, or the re-cut named below) -> the branch's pool -> ELIGIBLE = the wordings whose
 * every need holds on the record -> src/kernel/proseHash.js :: pickVariantMixed(eligible, `<record.name>::dailyLife.<slot>::<branch>`).
 * A house a wording names: the first LIVE roster row of its kind (institutionRoster.js :: liveInstitutions), never a hideable
 * one (cardVeil.js :: isHideableHouse), never an access-only row (liveInstitutionNames.js :: ACCESS_ONLY), printed as
 * `the ${institutionSentenceNoun(row.name)}` (display/institutionSentenceNoun.js: the label seam, the bracket struck).
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');

// ═══════════════════════════════ THE POOLS ═══════════════════════════════
// Each wording: [id, needs, text]. `{x}` = a house slot (named in HOUSES below; its need is listed in `needs`).
// Index 0 of a branch is today's text wherever today's text is true somewhere (rule 1), with its needs declared.
const POOLS = {
  dawn_work: {
    // dailyLife.js's branches; RULING 1: `defence` = defence band critical/collapsed AND an outside threat (EXTERNAL below); else
    // else craft power >= 25; else merchant power >= 30 under a siege; else merchant power >= 30; else default.
    food: [
      ['F0', ['granary'], 'Dawn work is the search for food. Foragers leave before light, and the granary queue forms before the ovens are warm.'],
      ['F1', [], 'Dawn work is the search for food: people are out before light to see what can be found.'],
      ['F2', ['fishSource'], 'Those who fish are out before light, and what they bring back decides what is eaten that day.'],
      ['F3', ['gameSource'], 'Hunters are out before light, and the rest of the day waits on what they bring home.'],
      ['F4', ['market'], 'People are at {market} before light, waiting to see what food comes in and what it will cost.'],
      ['F5', ['livestockSource'], 'The beasts are seen to before light, and nothing they give is wasted.'],
      ['F6', ['farming', 'small'], 'Every hand that can be spared is in the fields at first light, looking for anything left to gather.'],
    ],
    defence: [
      ['W0', ['walls', 'guard'], 'The walls claim the first hours: the watch musters thin at first light, and ordinary work waits until the rounds are walked.'],
      ['W1', ['walls'], 'Before any other work, someone walks the length of the walls at first light and looks for gaps.'],
      ['W2', ['guard'], 'Those who keep guard are out at first light, and the rest wait for their word before going out to work.'],
      ['W3', ['militia'], 'Those sworn to turn out in danger meet briefly at first light before going to their own work.'],
      ['W4', ['gate'], 'The gates stay shut until it is fully light, and the day\'s work waits on them.'],
      ['W5', ['dwellings'], 'Before anyone goes out to work, each household looks to its own door and sees that all is as it was left.'],
      ['W6', ['farming'], 'The first light goes to walking the edges of the fields; the ordinary work begins once that is done.'],
      ['W7', ['water'], 'Water is fetched at first light in company, never alone, and the day\'s work starts after.'],
      ['W8', ['dwellings'], 'People go out to their work together at dawn, and no one strays far from the houses alone.'],
      ['W9', [], 'The first hour is spent seeing that nothing was disturbed in the night; only then does the ordinary work begin.'],
      ['W10', ['dwellings'], 'Everyone keeps within call of the houses in the first hours, and the farther work waits until later in the day.'],
      ['W11', ['elder'], 'The elder is asked at first light whether all is well before anyone goes out to work.'],
      ['W12', ['monster'], 'With danger about in the country, no one sets out at first light until others are ready to go too.'],
      ['W13', ['livestockSource'], 'The beasts are let out at first light and kept close to the houses through the day.'],
      ['W14', ['dwellings'], 'Doors are opened late and with care, and the day\'s work starts a little after first light.'],
    ],
    craft: [
      ['C0', ['smith', 'guild'], 'Smithy fires light before sunrise; guild-callers move from shop to shop, and apprentices haul water before the bell.'],
      ['C1', ['smith'], 'The forges are lit before sunrise, and the first hammering is heard as it grows light.'],
      ['C2', [], 'The workshops open before sunrise, and the day\'s making is well under way by first light.'],
    ],
    merchant_siege: [
      ['S0', [], 'The merchants count their stock before light, and the porters wait for loads that do not come; dawn brings the smell of woodsmoke and grain.'],
      ['S1', [], 'The merchants are up before light, counting what is left and waiting for goods that cannot reach them.'],
    ],
    merchant: [
      ['M0', ['route', 'warehouse'], 'Merchant caravans roll before light; porters and apprentices queue at the warehouses, and dawn brings the smell of woodsmoke and grain.'],
      ['M1', ['market'], 'Traders are setting out their goods at {market} before light, and the first buyers come as it grows light.'],
      ['M2', ['warehouse'], 'Before light, goods are carried out of the warehouses to where they will be sold.'],
      ['M3', ['route'], 'Loads are made ready before light for the journey out, and the merchants see them off themselves.'],
      ['M4', ['docks'], 'Boats are loaded and unloaded at {docks} from first light, and the merchants are there to watch.'],
      ['M5', ['market'], 'The merchants are at their stalls before first light, and the first bargains of the day are struck early.'],
      ['M6', [], 'The merchants are up before anyone else, and their business is under way by first light.'],
    ],
    default: [
      ['B0', ['bakery', 'smith', 'guard', 'gate'], 'Bakers light their ovens first, then the smiths; the watch changes as the gates open.'],
      ['B1', ['bakery'], 'The bakers have their ovens lit before first light, and the first bread is out as people wake.'],
      ['B2', ['smith'], 'The forge is lit early, and its hammering is the first sound of most mornings.'],
      ['B3', ['mill'], 'The first grain of the day is carried to {mill} at first light.'],
      ['B4', ['market'], 'Stalls go up at {market} at first light, and the first buyers come soon after.'],
      ['B5', ['guard'], 'Those who kept guard through the night hand over at first light and go home to sleep.'],
      ['B6', ['gate'], 'The gates are opened at first light, and the first of the day\'s comings and goings begin.'],
      ['B7', ['water', 'small'], 'Water is drawn early, and the day\'s work begins once the households have what they need.'],
      ['B8', ['fishSource'], 'Those who fish are out before first light and back with the catch by mid-morning.'],
      ['B9', ['livestockSource', 'small'], 'The beasts are seen to first, before the rest of the day begins.'],
      ['B10', ['farming', 'small'], 'Most people are in the fields by first light; the rest of the work fits around them.'],
      ['B11', ['craftGuild'], 'The workshops open their doors early, and work is under way at the benches by first light.'],
      ['B12', ['inn', 'route'], 'At {inn}, breakfast is already being served to those who mean to set out early.'],
      ['B13', ['common', 'small'], 'At first light the beasts are driven out to graze on the common.'],
      ['B14', ['docks'], 'The first boats are being unloaded at {docks} as it grows light.'],
      ['B15', ['granary', 'mill'], 'The granary doors are opened at first light, and the first grain goes out to be ground.'],
      ['B16', ['bathhouse'], 'The fires under {bathhouse} are lit before dawn, so the water is hot when the first bathers come.'],
      ['B17', ['walls', 'guard'], 'The night\'s guard comes down off the walls at first light, and the day\'s guard goes up.'],
      ['B18', ['farming', 'small'], 'The first light goes to walking the fields to see how they stand, and then the day\'s work begins.'],
      ['B19', ['elder'], 'People stop at the elder\'s door at first light, and the day\'s work is talked over there.'],
      ['B20', ['livestockSource', 'small'], 'The beasts are let out at first light, and the day\'s other work begins after.'],
      ['B21', ['dwellings', 'small'], 'The households are up at first light, and the day\'s work starts close to home.'],
      ['B22', ['dwellings', 'small'], 'Fires are lit and the households fed before anyone goes out to the day\'s work.'],
      ['B23', ['water', 'small'], 'The first water of the day is fetched at first light, before anything else is done.'],
      ['B24', ['farming', 'small'], 'The day begins with the walk out to the fields, and the work there runs on until midday.'],
      ['B25', ['timber', 'small'], 'Some go out at first light to cut and carry wood, and the rest turn to the day\'s other work.'],
      ['B26', ['landing'], 'The boats go out from the landing at first light, and the catch decides the rest of the day.'],
    ],
  },
  gathering_places: {
    // RE-CUT: `named` = the record holds a LIVE, non-hideable sacred house, market or inn/tavern; `plain` = it holds none.
    // (Today's cut read the WHOLE roster by name: a ruined row or a hideable "Black market" counted, a "Parish church" did not.)
    named: [
      ['N0', ['church', 'market', 'inn'], 'By midday people are gathered on the steps of {church}, at {market} and at {inn}: talking, trading, and watching.'],
      ['N1', ['sacred'], 'Most days people stop to talk by {sacred} on their way to and from their work.'],
      ['N2', ['sacred', 'water'], 'People meet where the water is drawn and again by {sacred}, and most news passes between them.'],
      ['N3', ['inn'], 'In the evenings people gather at {inn}, where the day\'s news is passed around.'],
      ['N4', ['market'], 'People gather at {market} as much to talk as to buy.'],
      ['N5', ['market', 'inn'], 'People meet at {market} by day and at {inn} once the work is done.'],
      ['N6', ['sacred', 'inn'], 'Between {sacred} and {inn}, most people cross paths at some point in the day.'],
      ['N7', ['square'], 'People gather in {square} at midday to talk, to trade a little, and to watch the day go by.'],
      ['N8', ['bathhouse'], 'Many go to {bathhouse} as much for the talk as for the water.'],
      ['N9', ['mill', 'sacred'], 'People meet while they wait their turn at {mill}, and again by {sacred}.'],
      ['N10', ['bridge', 'market'], 'People stop to talk on {bridge} and at {market}, where most comings and goings pass.'],
      ['N11', ['docks'], 'When the boats come in, people gather at {docks} to see what has been landed.'],
      ['N12', ['theater', 'inn'], 'In the evenings people gather at {theater}, and the talk carries on afterwards at {inn}.'],
      ['N13', ['cathedral'], 'People gather on the steps of {cathedral}, where there is always someone to talk to.'],
      ['N14', ['common', 'inn'], 'In the evenings people gather at {inn} or out on the common.'],
      ['N15', ['common', 'sacred'], 'People meet on the common and by {sacred}, where most of the talk of the place goes on.'],
      ['N16', ['church', 'water'], 'After a service people linger on the steps of {church}; on other days they meet where the water is drawn.'],
      ['N17', ['sacred', 'farming', 'small'], 'People talk in the fields while they work, and gather by {sacred} when the work is done.'],
      ['N18', ['sacred', 'dwellings'], 'Of an evening people sit out at their doors, and by day they meet by {sacred}.'],
      ['N19', ['mill', 'water'], 'People meet while they wait their turn at {mill}, and again where the water is drawn.'],
      ['N20', ['mill', 'market'], 'People meet at {mill} and at {market}, and the talk at each is of prices and of one another.'],
      ['N21', ['square', 'sacred'], 'People cross {square} on their way to {sacred}, and many stop to talk on the way.'],
      ['N22', ['inn', 'water'], 'People meet where the water is drawn by day, and at {inn} in the evening.'],
      ['N23', ['inn', 'farming', 'small'], 'After the day in the fields, people gather at {inn} to talk it over.'],
      ['N24', ['market', 'water'], 'People meet at {market} and where the water is drawn, and between them most news gets about.'],
      ['N25', ['market', 'common'], 'People meet at {market} and out on the common, where there is always someone about.'],
      ['N28', ['inn', 'dwellings'], 'Of an evening people drift from their doors to {inn} to talk the day over.'],
    ],
    plain: [
      ['P0', ['well', 'bridge', 'square'], 'People gather where they can: the well, the bridge, the open square.'],
      ['P1', ['water'], 'People meet where the water is drawn, and most of the day\'s news is passed on there.'],
      ['P2', ['water'], 'Morning and evening, people stop to talk where the water is drawn.'],
      ['P3', ['water', 'dwellings'], 'People talk where the water is drawn and over one another\'s doorsteps, morning and evening.'],
      ['P4', ['water', 'dwellings'], 'People gather at one another\'s doors in the evening, and by day where the water is drawn.'],
      ['P5', ['water', 'farming', 'small'], 'Most talk happens in the fields while the work goes on, and again where the water is drawn.'],
      ['P6', ['water'], 'Where the water is drawn is where people meet and pass on their news.'],
      ['P7', ['dwellings'], 'Of an evening people sit out by their doors and talk across to their neighbours.'],
      ['P8', ['farming', 'small'], 'People meet at the field edges at midday, when the work stops for a while.'],
      ['P9', ['water'], 'People see most of one another where the water is drawn, and the talk there is of the work and of each other.'],
      ['P10', ['landing'], 'When the boats are drawn up, people gather at the landing to sort the catch and talk.'],
      ['P11', ['common'], 'People meet on the common, where the beasts graze and there is always someone about.'],
      ['P13', ['elder'], 'Matters of any weight are talked over at the elder\'s door, where people gather of an evening.'],
      ['P14', ['rootCellar'], 'People meet at the communal root cellar, where the stores are kept and the news is passed along.'],
      ['P15', ['shepherd'], 'When the flocks are brought in, people gather to help and to talk.'],
    ],
  },
  child_warnings: {
    // RULING 2: a kind from a RATING alone is not taken (unrest needs `trouble`, economic_collapse needs `econStress`); corruption
    // and cult fall to `default` (D0). The threats by severity, each KIND said once; the first TWO kinds (today: of the first
    // three threats). Each kind's pool gives a phrase after "about"; joined "Children are warned about A, and about B.".
    // `none` (no threat) gives a whole sentence. The kind `default` replaces today's printed machine label.
    unrest: [
      ['U0', ['notSmall'], 'crowds that gather quickly'],
      ['U1', [], 'getting mixed up in the grown-ups\' quarrels'],
      ['U2', [], 'repeating what they hear said at home about those in charge'],
      ['U3', ['market'], 'hanging about {market} when tempers are short'],
      ['U4', ['inn'], 'loitering by {inn} when voices are raised'],
      ['U5', [], 'taking sides in arguments that are not theirs'],
      ['U6', [], 'carrying tales from one household to another'],
      ['U7', ['notSmall'], 'getting caught up when people gather in the streets'],
      ['U8', [], 'joining in when the grown-ups\' talk turns angry'],
      ['U9', ['dwellings'], 'wandering into other households while feelings are running high'],
      ['U10', [], 'picking quarrels of their own while their elders have quarrels enough'],
    ],
    economic_collapse: [
      ['E0', ['market', 'tradeQuarter'], 'the empty stalls in the trade quarter'],
      ['E1', [], 'asking for what the household cannot spare'],
      ['E2', [], 'wasting anything that could still be mended or used again'],
      ['E3', [], 'losing anything, however small, that the household paid for'],
      ['E4', ['market'], 'handling goods at {market} that there is no coin to buy'],
      ['E5', [], 'begging favours from neighbours who have little enough themselves'],
      ['E6', [], 'breaking or spoiling what cannot easily be replaced'],
      ['E7', [], 'giving anything away without asking first'],
      ['E8', ['poor'], 'grumbling about going without'],
    ],
    monster_pressure: [
      ['P0', ['route'], 'the road past sundown'],
      ['P1', ['dwellings', 'small'], 'straying out of sight of the houses once the light starts to go'],
      ['P2', ['timber'], 'the woods once the light goes'],
      ['P3', ['farming'], 'the far edges of the fields after dark'],
      ['P4', [], 'going anywhere alone after dark'],
      ['P5', [], 'going out to look for whatever is heard in the night'],
      ['P6', ['livestockSource'], 'following the beasts out beyond calling distance'],
      ['P7', ['water'], 'going down for water alone after dark'],
      ['P8', ['walls', 'gate'], 'being outside the walls once the gates are shut'],
      ['P9', ['notSmall'], 'wandering beyond the last streets after dark'],
    ],
    plague: [
      ['L0', ['sickHouse'], 'the sick-house and unfamiliar coughs'],
      ['L1', [], 'going near any house where someone has fallen sick'],
      ['L2', [], 'sharing cups and spoons with anyone outside the household'],
      ['L3', [], 'unfamiliar coughs, and anyone who has one'],
    ],
    siege: [
      ['S0', ['sacred'], 'staying close when the bells ring'],
      ['S1', ['walls'], 'climbing up to look out over the walls'],
      ['S2', [], 'straying far from home while there is danger outside'],
    ],
    famine: [
      ['A0', [], 'wandering off: bread is short'],
      ['A1', [], 'eating anything they find without asking first'],
      ['A2', [], 'wasting so much as a crust'],
    ],
    bandit_raids: [
      ['R0', ['gate'], 'strangers who linger at the gates'],
      ['R1', [], 'riders they do not know'],
      ['R2', ['route'], 'going out along the road alone'],
    ],
    rival_neighbor: [
      ['N0', ['neighbour'], 'anything bearing the colours of the neighbour'],
      ['N1', ['neighbour'], 'trusting anyone who comes from the neighbouring place'],
      ['N2', [], 'strangers who ask questions about the place'],
    ],
    arcane_instability: [
      ['Z0', [], 'shimmering air and unfamiliar lights'],
      ['Z1', [], 'touching anything that glows, hums or moves on its own'],
    ],
    default: [
      ['D0', [], 'straying far from home on their own'],
    ],
    none: [
      ['X0', ['well', 'route', 'timber'], 'Children are warned about the usual things: the deep well, the strangers\' road, the woods at twilight.'],
      ['X1', ['market', 'notSmall'], 'Children are warned about the usual things: getting lost among the stalls at {market}, and keeping close in a crowd.'],
      ['X2', ['smith'], 'Children are warned about the usual things: the forge and its sparks, and straying too far from home.'],
      ['X3', ['navigable'], 'Children are warned about the usual things: playing too near the water, and straying too far from home.'],
      ['X4', ['docks'], 'Children are warned to keep away from the edge of {docks}, and to be home before dark.'],
      ['X5', ['bridge'], 'Children are warned not to climb about on {bridge}, and to be home before dark.'],
      ['X6', [], 'Children are warned about the usual things: straying too far from home, and talking to strangers.'],
      ['X7', ['mill'], 'Children are warned to keep clear of the turning stones at {mill}, and to be home before dark.'],
      ['X8', ['water', 'dwellings', 'small'], 'Children are warned about the usual things: going down to the water alone, and wandering out of sight of the houses.'],
      ['X9', ['farming', 'small'], 'Children are warned about the usual things: trampling the young crops, and straying past the last of the fields.'],
      ['X10', ['livestockSource'], 'Children are warned about the usual things: getting under the feet of the beasts, and letting any of them stray.'],
      ['X11', ['timber'], 'Children are warned about the usual things: going into the woods alone, and being out after dark.'],
      ['X12', ['route'], 'Children are warned about the usual things: the road and the strangers on it, and being home before dark.'],
      ['X13', ['landing'], 'Children are warned about the usual things: the boats and the water\'s edge, and being home before dark.'],
      ['X14', ['dwellings', 'small'], 'Children are warned about the usual things: straying out of call of the houses, and playing with fire.'],
      ['X15', ['water', 'farming', 'small'], 'Children are warned about the usual things: the water\'s edge, the far fields, and being home before dark.'],
      ['X16', [], 'Children are warned about the usual things: talking to strangers, and getting under the grown-ups\' feet at work.'],
      ['X17', ['water'], 'Children are warned about the usual things: leaning over the water to look in, and straying far from home.'],
    ],
  },
};

// ═══════════════════════════════ THE NEEDS (home, or the nearest record field, named) ═══════════════════════════════
const NEED_DOC = {
  walls: 'defenceOf(r).walls', gate: 'defenceOf(r).gate', militia: 'defenceOf(r).militia', guard: 'factsOf(r).guardPresence',
  sickHouse: 'defenceOf(r).hospital || .healer', granary: "hasInstitution(r,'granary')",
  smith: "hasInstitution(r,'smith'), the row non-hideable", mill: "hasInstitution(r,'mill'), the row non-hideable",
  inn: "hasInstitution(r,'tavern'), the row non-hideable", bathhouse: "hasInstitution(r,'bathhouse'), the row non-hideable",
  docks: "hasInstitution(r,'docks') and a non-hideable row /docks|wharf|quay/",
  sacred: 'factsOf(r).sacredHouse, the row non-hideable', church: 'factsOf(r).sacredHouse by a row not a shrine (temple kind or monastery kind)',
  cathedral: "hasInstitution(r,'temple') by a row /cathedral/", market: 'marketOf(r) and a non-hideable market row /market(s)/ (not a square)',
  square: 'marketOf row /square(s)/ (M1 nearest: live row /square|plaza|green/)', guild: 'factsOf(r).guild',
  fishSource: "factsOf(r).foodSources has 'fish'", gameSource: "factsOf(r).foodSources has 'game'", livestockSource: "factsOf(r).foodSources has 'livestock'",
  route: 'tradeRouteOf(r) not ""/isolated/none (M1 nearest for a road)', navigable: 'waterOf(r).navigable', timber: 'factsOf(r).timberAtHand (M1 nearest for woods)',
  notSmall: "factsOf(r).populationBand !== 'small'", small: "factsOf(r).tier in thorp|hamlet|village (RULING 3: 'a small place (thorp to village)'; notSmall stays the population band)", elder: "rulerKindOf(r) === 'elder'",
  neighbour: 'record.neighborRelationship (M1)', appointedPost: 'factsOf(r).appointedPost', poor: "factsOf(r).prosperity in poor|struggling",
  monster: "a threat of type monster_pressure (threatProfile.js :: deriveAllThreatProfiles)",
  tradeQuarter: 'a spatialLayout.quarters name /market|trade|merchant|bazaar|commerc/ (M1)',
  bakery: 'NO HOME: live row /baker(y)|bakehouse/ (M1)', warehouse: 'NO HOME: live row /warehouse|storehouse/ (M1)',
  bridge: 'NO HOME: live non-hideable row /bridge/ (M1: row or landmark)', well: 'NO HOME: M1 T.well (live row or landmark /well|water source|aqueduct…/)',
  water: 'NO HOME: live non-hideable row /well|water source(s)|water system|water infrastructure|aqueduct/ (M1 WELL)',
  wellMark: 'NO HOME: a quarter landmark /well/ (spatialLayout.quarters[].landmarks)', theater: 'NO HOME: live non-hideable row /theater|theatre|opera house/',
  common: 'NO HOME: live row /common grazing/', farming: 'NO HOME: live row /farmland|subsistence farming/', dwellings: 'NO HOME: live row /dwellings|housing/',
  landing: "NO HOME: live row /fisher's landing|fishing community/", rootCellar: 'NO HOME: live row /root cellar/', shepherd: 'NO HOME: live row /shepherd/',
  craftGuild: 'NO HOME: live non-hideable row /craft guild/',
  trouble: 'record.conflicts non-empty (live conflicts between powers) OR a history.currentTensions[].type in CIVIL_TENSIONS (the field facts/uprising.js reads) OR an unrest threat not from the defenseProfile rating (threatProfile.js originSurface)',
  econStress: "factsOf(r).prosperity in poor|struggling OR an economic_collapse threat not from the defenseProfile rating OR a history.currentTensions[].type in ECON_TENSIONS",
};
const CIVIL_TENSIONS = ['popular_uprising', 'succession_crisis', 'legitimacy_crisis', 'leadership_vacuum', 'tyranny', 'population_friction', 'disputed_land', 'religious_tension', 'guild_conflict', 'generational_divide', 'economic_disparity', 'heresy_trial'];
const ECON_TENSIONS = ['trade_collapse', 'market_crash', 'outside_debt', 'resource_scarcity'];
// RULING 1: the outside threats, threatProfile.js's own kinds, at severityBand medium or above (threatSeverityBand: severity >= 0.25).
const EXTERNAL = ['siege', 'monster_pressure', 'bandit_raids', 'rival_neighbor'];

if (process.argv.includes('--pools')) {
  for (const [slot, branches] of Object.entries(POOLS)) {
    console.log(`\n### ${slot}`);
    for (const [br, pool] of Object.entries(branches)) {
      console.log(`\n**${br}**`);
      for (const [id, needs, text] of pool) {
        const houses = [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
        console.log(`${id}. "${text}" — needs: [${needs.join(', ')}]${houses.length ? `; names: ${houses.join(', ')}` : ''}`);
      }
    }
  }
  process.exit(0);
}

console.log(`RE-RUN: node docs/chair/2026-11-20/content/daily/lines/L1/probe.1b.mjs > docs/chair/2026-11-20/content/daily/lines/L1/probe.1b.out.txt 2>&1`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { deriveAllFactionProfiles } = await import(`${L}/src/domain/factionProfile.js`);
const { deriveAllThreatProfiles } = await import(`${L}/src/domain/threatProfile.js`);
const { deriveAllCapacities } = await import(`${L}/src/domain/capacityModel.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { hasInstitution, INSTITUTION_KIND_PATTERNS } = await import(`${L}/src/domain/facts/institutions.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { marketOf, isMarketInstitution } = await import(`${L}/src/domain/facts/market.js`);
const { waterOf } = await import(`${L}/src/domain/facts/water.js`);
const { rulerKindOf } = await import(`${L}/src/domain/facts/rulerKind.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { ACCESS_ONLY } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);
const { nativeSemanticName } = await import(`${L}/src/domain/content/customContentSemanticAuthority.js`);
const { liveInstitutions, isLiveInstitution } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
const { institutionSentenceNoun } = await import(`${L}/src/domain/display/institutionSentenceNoun.js`);

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const t0 = Date.now();
let rows;
if (process.env.L1_BIRTHS_JSON) {
  rows = JSON.parse(readFileSync(process.env.L1_BIRTHS_JSON, 'utf8'));
  console.log(`births: ${rows.length} READ FROM ${process.env.L1_BIRTHS_JSON} (scratch run)`);
} else {
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  rows = [];
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    rows.push({ seed, size, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
  console.log(`births: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

// ── the houses (first LIVE, non-hideable, non-access row of a kind, in roster order; sacred by preference) ──
const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const rowsOf = (r) => liveInstitutions(r).filter((i) => !isHideableHouse(i) && !ACCESS_ONLY.test(String(nativeSemanticName(i) || i?.name || '')));
const nm = (i) => String(nativeSemanticName(i) || i?.name || '');
const firstRow = (r, re, extra = () => true) => rowsOf(r).find((i) => re.test(nm(i)) && extra(i));
const SACRED_ORDER = [/\bcathedral/i, /\btemple|\bchurch|\babbey|\bchapel/i, /\bshrine/i, /\bmonaster|\bfriary\b/i];
const HOUSES = {
  sacred: (r) => SACRED_ORDER.map((re) => firstRow(r, re)).find(Boolean),
  church: (r) => SACRED_ORDER.filter((re) => !/shrine/.test(re.source)).map((re) => firstRow(r, re)).find(Boolean),
  cathedral: (r) => firstRow(r, /\bcathedral/i),
  market: (r) => firstRow(r, /\bmarkets?\b(?!\s*squares?)/i, isMarketInstitution),
  square: (r) => firstRow(r, /\bsquares?\b/i, isMarketInstitution),
  inn: (r) => firstRow(r, INSTITUTION_KIND_PATTERNS.tavern),
  mill: (r) => firstRow(r, INSTITUTION_KIND_PATTERNS.mill),
  bathhouse: (r) => firstRow(r, INSTITUTION_KIND_PATTERNS.bathhouse),
  bridge: (r) => firstRow(r, /\bbridges?\b/i),
  docks: (r) => firstRow(r, /\bdocks?\b|\bwharf|\bquays?\b/i),
  theater: (r) => firstRow(r, /\btheat(?:er|re)s?\b|\bopera house\b/i),
  wellMark: (r) => { const l = (r?.spatialLayout?.quarters || []).flatMap((q) => q?.landmarks || []).map(String).find((x) => /\bwells?\b/i.test(x)); return l ? { name: l } : undefined; },
};
const said = (inst) => `the ${institutionSentenceNoun(inst.name)}`;

const quarters = (r) => (Array.isArray(r?.spatialLayout?.quarters) ? r.spatialLayout.quarters : []);
const landmarks = (r) => quarters(r).flatMap((q) => (Array.isArray(q?.landmarks) ? q.landmarks.map(String) : []));
const liveNames = (r) => liveInstitutions(r).map((i) => String(i?.name || '')).filter((n) => n && !ACCESS_ONLY.test(n));
const anyLive = (r, re) => liveNames(r).some((n) => re.test(n));
const anyLiveSafe = (r, re) => rowsOf(r).some((i) => re.test(nm(i)));
const WELL = /\bwells?\b|\bwater source|\bwater sources\b|\bwater system|\bwater infrastructure|\baqueduct/i; // M1's
const foodHas = (r, k) => (safe(() => factsOf(r).foodSources, []) || []).includes(k);
const routeNone = (r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r) || '');
const NEEDS = {
  walls: (r) => defenceOf(r).walls, gate: (r) => defenceOf(r).gate, militia: (r) => defenceOf(r).militia,
  guard: (r) => !!safe(() => factsOf(r).guardPresence, false), sickHouse: (r) => defenceOf(r).hospital || defenceOf(r).healer,
  granary: (r) => hasInstitution(r, 'granary'), smith: (r) => hasInstitution(r, 'smith') && !!firstRow(r, INSTITUTION_KIND_PATTERNS.smith),
  mill: (r) => hasInstitution(r, 'mill') && !!HOUSES.mill(r), inn: (r) => hasInstitution(r, 'tavern') && !!HOUSES.inn(r),
  bathhouse: (r) => hasInstitution(r, 'bathhouse') && !!HOUSES.bathhouse(r), docks: (r) => hasInstitution(r, 'docks') && !!HOUSES.docks(r),
  sacred: (r) => !!safe(() => factsOf(r).sacredHouse, false) && !!HOUSES.sacred(r), church: (r) => !!safe(() => factsOf(r).sacredHouse, false) && !!HOUSES.church(r),
  cathedral: (r) => hasInstitution(r, 'temple') && !!HOUSES.cathedral(r), market: (r) => marketOf(r) && !!HOUSES.market(r),
  square: (r) => marketOf(r) && !!HOUSES.square(r), guild: (r) => !!safe(() => factsOf(r).guild, false),
  fishSource: (r) => foodHas(r, 'fish'), gameSource: (r) => foodHas(r, 'game'), livestockSource: (r) => foodHas(r, 'livestock'),
  route: (r) => !routeNone(r), navigable: (r) => waterOf(r).navigable, timber: (r) => !!safe(() => factsOf(r).timberAtHand, false),
  notSmall: (r) => safe(() => factsOf(r).populationBand) !== 'small', small: (r) => ['thorp', 'hamlet', 'village'].includes(safe(() => factsOf(r).tier)),
  elder: (r) => rulerKindOf(r) === 'elder', neighbour: (r) => !!r.neighborRelationship,
  appointedPost: (r) => !!safe(() => factsOf(r).appointedPost, false), poor: (r) => ['poor', 'struggling'].includes(safe(() => factsOf(r).prosperity)),
  monster: (r, x) => x.threats.some((t) => t.type === 'monster_pressure'),
  tradeQuarter: (r) => quarters(r).some((q) => /\bmarket|\btrade|\bmerchant|\bbazaar|\bcommerc/i.test(String(q?.name || ''))),
  bakery: (r) => anyLive(r, /\bbak(?:er|ers|ery|eries|ehouse)\b/i), warehouse: (r) => anyLive(r, /\bwarehouse|\bstorehouse/i),
  bridge: (r) => !!HOUSES.bridge(r),
  well: (r) => anyLive(r, WELL) || landmarks(r).some((l) => WELL.test(l)),
  water: (r) => anyLiveSafe(r, WELL), wellMark: (r) => !!HOUSES.wellMark(r), theater: (r) => !!HOUSES.theater(r),
  common: (r) => anyLiveSafe(r, /\bcommon grazing\b/i), farming: (r) => anyLiveSafe(r, /\bfarmland\b|\bsubsistence farming\b/i),
  dwellings: (r) => anyLiveSafe(r, /\bdwellings?\b|\bhousing\b/i), landing: (r) => anyLiveSafe(r, /\bfisher'?s landing\b|\bfishing community\b/i),
  rootCellar: (r) => anyLiveSafe(r, /\broot cellar\b/i), shepherd: (r) => anyLiveSafe(r, /\bshepherd/i),
  craftGuild: (r) => anyLiveSafe(r, /\bcraft guilds?\b/i),
  trouble: (r, x) => (Array.isArray(r.conflicts) && r.conflicts.length > 0) || tensionTypes(r).some((t) => CIVIL_TENSIONS.includes(t)) || x.threats.some((t) => t.type === 'unrest' && t.originSurface !== 'defenseProfile'),
  econStress: (r, x) => ['poor', 'struggling'].includes(safe(() => factsOf(r).prosperity)) || x.threats.some((t) => t.type === 'economic_collapse' && t.originSurface !== 'defenseProfile') || tensionTypes(r).some((t) => ECON_TENSIONS.includes(t)),
  external: (r, x) => x.threats.some((t) => EXTERNAL.includes(t.type) && ['medium', 'high', 'critical'].includes(t.severityBand)),
};
function tensionTypes(r) { const t = r?.history?.currentTensions; return (Array.isArray(t) ? t : t ? [t] : []).map((e) => e?.type).filter(Boolean); }
// consistency: every need is defined and documented; every {house} in a text is among its needs
let poolFaults = 0;
for (const [slot, brs] of Object.entries(POOLS)) for (const [br, pool] of Object.entries(brs)) for (const [id, needs, text] of pool) {
  for (const n of needs) if (!NEEDS[n] || !NEED_DOC[n]) { poolFaults++; console.log(`POOL FAULT ${slot}:${br}:${id} need '${n}' undefined`); }
  for (const m of text.matchAll(/\{(\w+)\}/g)) if (!needs.includes(m[1]) || !HOUSES[m[1]]) { poolFaults++; console.log(`POOL FAULT ${slot}:${br}:${id} names {${m[1]}} without the need or a house reader`); }
}
console.log(`pool consistency faults: ${poolFaults}`);

// ── apply ──
const fill = (r, text, named) => text.replace(/\{(\w+)\}/g, (_, k) => { const h = HOUSES[k](r); named.push(h); return said(h); });
const BAD = ['critical', 'collapsed'];
function apply(slot, branch, r, x, keyBranch = branch) {
  const pool = POOLS[slot][branch];
  const eligible = pool.filter(([, needs]) => needs.every((n) => NEEDS[n](r, x)));
  const key = `${r.name}::dailyLife.${slot}::${keyBranch}`;
  const pick = pickVariantMixed(eligible, key);
  return { branch, eligible: eligible.length, pick };
}
for (const x of rows) {
  const r = x.rec;
  x.threats = deriveAllThreatProfiles(r);
  const caps = deriveAllCapacities(r).capacities, profiles = deriveAllFactionProfiles(r);
  x.named = [];
  // dawn_work (dailyLife.js's cut)
  const craft = profiles.find((p) => p.archetype === 'craft')?.power || 0, merch = profiles.find((p) => p.archetype === 'merchant')?.power || 0;
  const siege = x.threats.some((t) => t.type === 'siege');
  x.defCrit = !BAD.includes(caps.food_production.band) && BAD.includes(caps.defense.band);
  const dBr = BAD.includes(caps.food_production.band) ? 'food' : BAD.includes(caps.defense.band) && NEEDS.external(r, x) ? 'defence' : craft >= 25 ? 'craft'
    : merch >= 30 && siege ? 'merchant_siege' : merch >= 30 ? 'merchant' : 'default';
  const d = apply('dawn_work', dBr, r, x);
  x.dawn = { br: [dBr], elig: { [dBr]: d.eligible }, ids: [d.pick?.[0]], text: d.pick ? fill(r, d.pick[2], x.named) : '' };
  // gathering_places (re-cut)
  const gBr = NEEDS.sacred(r) || NEEDS.market(r) || NEEDS.inn(r) ? 'named' : 'plain';
  const g = apply('gathering_places', gBr, r, x);
  x.gather = { br: [gBr], elig: { [gBr]: g.eligible }, ids: [g.pick?.[0]], text: g.pick ? fill(r, g.pick[2], x.named) : '' };
  // child_warnings
  const kindOf = (t) => (t.type === 'unrest' && !NEEDS.trouble(r, x)) || (t.type === 'economic_collapse' && !NEEDS.econStress(r, x)) ? null
    : POOLS.child_warnings[t.type] && t.type !== 'none' ? t.type : 'default';
  x.skipped = x.threats.filter((t) => (t.type === 'unrest' || t.type === 'economic_collapse') && kindOf(t) === null).map((t) => t.type);
  const kinds = [...new Set([...x.threats].sort((a, b) => b.severity - a.severity).map(kindOf).filter(Boolean))].slice(0, 2);
  if (!kinds.length) {
    const c = apply('child_warnings', 'none', r, x);
    x.child = { br: ['none'], elig: { none: c.eligible }, ids: [c.pick?.[0]], text: c.pick ? fill(r, c.pick[2], x.named) : '' };
  } else {
    const parts = kinds.map((k) => ({ k, ...apply('child_warnings', k, r, x) })).filter((p) => p.pick);
    const frags = parts.map((p) => fill(r, p.pick[2], x.named));
    x.child = { br: kinds, elig: Object.fromEntries(parts.map((p) => [p.k, p.eligible])), ids: parts.map((p) => `${p.k}:${p.pick[0]}`),
      text: frags.length ? `Children are warned about ${frags.join(', and about ')}.` : '' };
  }
}
console.log(`applied in ${((Date.now() - t0) / 1000).toFixed(0)}s since start`);

const SLOTS = [['dawn_work', 'dawn'], ['gathering_places', 'gather'], ['child_warnings', 'child']];
const bySize = (s) => rows.filter((x) => x.size === s);
const pct = (n) => Math.round((100 * n) / N);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;

console.log(`\n════ 1. THE BAR — top single text share (% of ${N}), distinct texts, by size`);
console.log(HDR);
for (const [slot, k] of SLOTS) {
  const tops = {};
  console.log(line(`${slot}: TOP %`, (s) => { const m = new Map(); for (const x of bySize(s)) m.set(x[k].text, (m.get(x[k].text) || 0) + 1); const t = [...m].sort((a, b) => b[1] - a[1])[0]; tops[s] = t; return String(pct(t[1])); }));
  console.log(line(`${slot}: DISTINCT`, (s) => String(new Set(bySize(s).map((x) => x[k].text)).size)));
  console.log(line(`${slot}: empty text`, (s) => String(bySize(s).filter((x) => !x[k].text).length)));
  for (const s of SIZES) console.log(`  top ${s} (${tops[s][1]}): "${tops[s][0]}"`);
}

console.log(`\n════ 2. BRANCHES — reach (% of ${N} taking it) / MIN eligible wordings over the places taking it / needed (ceil(reach/15%)); SHORT marks a miss`);
console.log(HDR);
let shortCount = 0;
for (const [slot, k] of SLOTS) for (const br of Object.keys(POOLS[slot])) {
  console.log(line(`${slot}:${br}`, (s) => {
    const xs = bySize(s).filter((x) => x[k].br.includes(br));
    if (!xs.length) return '0/—';
    const min = Math.min(...xs.map((x) => x[k].elig[br] ?? 0)), need = Math.ceil(pct(xs.length) / 15);
    if (min < need) shortCount++;
    return `${pct(xs.length)}/${min}/${need}${min < need ? ' SHORT' : ''}`;
  }));
}
console.log(`  SHORT cells: ${shortCount}`);

// ── RULING checks ──
console.log(`\n════ 2b. ELIGIBLE ROWS AT A THORP AND A HAMLET, every branch (min / median over ALL 150 of the size, as if the branch were taken)`);
for (const [slot] of SLOTS) for (const [br, pool] of Object.entries(POOLS[slot])) {
  const cell = (s) => { const e = bySize(s).map((x) => pool.filter(([, needs]) => needs.every((n) => NEEDS[n](x.rec, x))).length).sort((a, b) => a - b); return `${e[0]}/${e[Math.floor(e.length / 2)]}`; };
  console.log(`  ${slot}:${br}  thorp ${cell('thorp')}  hamlet ${cell('hamlet')}`);
}
console.log(`\n════ 2c. THE RULING'S TESTS, places of ${N}`);
console.log(HDR);
console.log(line('defence band critical/collapsed (food not)', (s) => String(bySize(s).filter((x) => x.defCrit).length)));
console.log(line('  ... with an outside threat (EXTERNAL, band >= medium) = the defence branch', (s) => String(bySize(s).filter((x) => x.dawn.br[0] === 'defence').length)));
console.log(line('unrest threat present', (s) => String(bySize(s).filter((x) => x.threats.some((t) => t.type === 'unrest')).length)));
console.log(line('  ... skipped (a rating alone: no trouble held)', (s) => String(bySize(s).filter((x) => x.skipped.includes('unrest')).length)));
console.log(line('economic_collapse threat present', (s) => String(bySize(s).filter((x) => x.threats.some((t) => t.type === 'economic_collapse')).length)));
console.log(line('  ... skipped (a rating alone: no econ stress)', (s) => String(bySize(s).filter((x) => x.skipped.includes('economic_collapse')).length)));
console.log(line('child_warnings takes `none`', (s) => String(bySize(s).filter((x) => x.child.br[0] === 'none').length)));
const RULE3 = ['F6', 'B7', 'B9', 'B10', 'B13', 'N17', 'N23', 'P5', 'P8'];
console.log(line('a rule-3 line (F6 B7 B9 B10 B13 N17 N23 P5 P8) printed at a place not small', (s) => String(bySize(s).filter((x) => [...x.dawn.ids, ...x.gather.ids].some((id) => RULE3.includes(id)) && !NEEDS.small(x.rec, x)).length)));
console.log(line('a cut wording (N26 N27 P12) or a wellMark house printed', (s) => String(bySize(s).filter((x) => [...x.gather.ids].some((id) => ['N26', 'N27', 'P12'].includes(id))).length)));

// ── 3. FALSE LINES: M1's every test on these three slots (clause in the printed text, record test false) ──
const T = {
  walls: NEEDS.walls, guard: NEEDS.guard, gate: NEEDS.gate, granary: NEEDS.granary, smithy: (r) => hasInstitution(r, 'smith'),
  guild: NEEDS.guild, routeNone, warehouse: NEEDS.warehouse, bakery: NEEDS.bakery, well: NEEDS.well,
  bridge: (r) => anyLive(r, /\bbridges?\b/i) || landmarks(r).some((l) => /\bbridges?\b/i.test(l)),
  square: (r) => anyLive(r, /\bsquares?\b|\bplaza\b|\bgreen\b/i) || quarters(r).some((q) => /\bsquares?\b|\bplaza\b|\bgreen\b/i.test(String(q?.name || ''))) || landmarks(r).some((l) => /\bsquares?\b|\bplaza\b|\bgreen\b/i.test(l)),
  timber: NEEDS.timber, quarters: (r) => quarters(r).length > 0, tradeQuarter: NEEDS.tradeQuarter, market: (r) => marketOf(r),
  sickHouse: NEEDS.sickHouse, sacred: (r) => !!safe(() => factsOf(r).sacredHouse, false), neighbour: NEEDS.neighbour, appointedPost: NEEDS.appointedPost,
};
const M1_TESTS = [
  ['dawn', /the granary queue/, 'no granary: hasInstitution granary', (r) => !T.granary(r)],
  ['dawn', /The walls claim/, 'no walls: defenceOf.walls', (r) => !T.walls(r)],
  ['dawn', /the watch musters/, 'no guard force: factsOf.guardPresence', (r) => !T.guard(r)],
  ['dawn', /Smithy fires/, 'no smithy', (r) => !T.smithy(r)],
  ['dawn', /guild-callers/, 'no guild: factsOf.guild', (r) => !T.guild(r)],
  ['dawn', /Merchant caravans roll/, 'no trade route', (r) => T.routeNone(r)],
  ['dawn', /queue at the warehouses/, 'no warehouse (no home)', (r) => !T.warehouse(r)],
  ['dawn', /Bakers light their ovens/, 'no bakery (no home)', (r) => !T.bakery(r)],
  ['dawn', /then the smiths/, 'no smithy', (r) => !T.smithy(r)],
  ['dawn', /the watch changes/, 'no guard force', (r) => !T.guard(r)],
  ['dawn', /as the gates open/, 'no gate: defenceOf.gate', (r) => !T.gate(r)],
  ['gather', /the well\b/, 'no well/water source (M1 nearest)', (r) => !T.well(r)],
  ['gather', /the bridge/, 'no bridge (no home)', (r) => !T.bridge(r)],
  ['gather', /the open square/, 'no square (no home)', (r) => !T.square(r)],
  ['gather', null, 'a named house not live or access-only (isLiveInstitution / ACCESS_ONLY)', (r, x) => x.named.some((i) => i && i.name && !i.name.match(/well/i) && (!isLiveInstitution(i) || ACCESS_ONLY.test(String(i.name))))],
  ['child', /the deep well/, 'no well (M1 nearest)', (r) => !T.well(r)],
  ['child', /the woods at twilight/, 'no timber (M1 nearest)', (r) => !T.timber(r)],
  ['child', /linger at the gates/, 'no gate', (r) => !T.gate(r)],
  ['child', /the trade quarter/, 'no quarters at all', (r) => !T.quarters(r)],
  ['child', /the trade quarter/, 'no trade-kind quarter', (r) => !T.tradeQuarter(r)],
  ['child', /the empty stalls/, 'no market: marketOf', (r) => !T.market(r)],
  ['child', /the sick-house/, 'no hospital or healer', (r) => !T.sickHouse(r)],
  ['child', /when the bells ring/, 'no sacred house (nearest for a bell)', (r) => !T.sacred(r)],
  ['child', /the neighbour\b/, 'no neighbour: record.neighborRelationship', (r) => !T.neighbour(r)],
  ['child', /\bofficials\b/, 'no appointed post', (r) => !T.appointedPost(r)],
];
console.log(`\n════ 3. FALSE LINES by M1's every test on these slots (places of ${N} printing the clause while the record test is false; must be 0)`);
console.log(HDR);
let falseTotal = 0;
for (const [k, re, label, f] of M1_TESTS) {
  const hits = rows.filter((x) => (re ? re.test(x[k].text) : true) && f(x.rec, x));
  falseTotal += hits.length;
  console.log(`${line(`${k} ${re ? re.source : '(named)'} — ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
}
console.log(`  M1 FALSE-LINE TOTAL: ${falseTotal}`);

// ── 4. WORD TESTS (this lane's own, wider than M1's clauses: a word printed in ANY of the three slots, its record test false) ──
const nn = (f) => (r, x) => !f(r, x);
const WORD_TESTS = [
  [/\bwalls?\b/i, 'walls', nn(NEEDS.walls)], [/\bthe watch\b/i, 'guard force', nn(NEEDS.guard)], [/\bguard\b/i, 'guard force', nn(NEEDS.guard)],
  [/\bgates?\b/i, 'gate', nn(NEEDS.gate)], [/\bforges?\b|\bsmith/i, 'smithy', nn(T.smithy)], [/\bbakers?\b/i, 'bakery (no home)', nn(NEEDS.bakery)],
  [/\bmills?\b/i, 'mill (live, not access)', nn(NEEDS.mill)], [/\bmarkets?\b|\bstalls\b/i, 'market (or the merchant branch)', (r, x) => !marketOf(r) && !x.dawn.br.some((b) => b.startsWith('merchant'))],
  [/\bbridge/i, 'bridge', nn(T.bridge)], [/\bsquares?\b/i, 'square', nn(T.square)],
  [/\binns?\b|\btaverns?\b|\balehouse|\bale house/i, 'inn/tavern', nn(NEEDS.inn)], [/\bgranar/i, 'granary', nn(NEEDS.granary)],
  [/\bwarehouse/i, 'warehouse', nn(NEEDS.warehouse)], [/\bcrowds?\b|\bstreets\b/i, 'not a small place', nn(NEEDS.notSmall)],
  [/\bfields?\b|\bcrops?\b/i, 'farmland row', nn(NEEDS.farming)], [/\bthe elder\b|\belder's\b/i, 'ruled by an elder', nn(NEEDS.elder)],
  [/\bmilk/i, 'livestock source', nn(NEEDS.livestockSource)], [/\bhunters?\b/i, 'game source', nn(NEEDS.gameSource)],
  [/\bbells?\b/i, 'sacred house', nn(T.sacred)], [/\bwoods?\b/i, 'timber', nn(NEEDS.timber)], [/\broad\b/i, 'trade route', nn(NEEDS.route)],
  [/\bwater\b/i, 'water row or navigable water', (r) => !NEEDS.water(r) && !NEEDS.navigable(r)], [/\bdocks\b/i, 'docks', nn(NEEDS.docks)],
  [/\bcatch\b|\bboats?\b|\bthose who fish\b/i, 'fish source, landing or docks', (r) => !NEEDS.fishSource(r) && !NEEDS.landing(r) && !NEEDS.docks(r)],
  [/\bcommon\b(?! well)/i, 'common grazing', nn(NEEDS.common)], [/\bsick-house\b/i, 'hospital or healer', nn(NEEDS.sickHouse)],
  [/\bofficials?\b/i, 'appointed post', nn(NEEDS.appointedPost)], [/\bthe neighbour\b/i, 'neighbour', nn(NEEDS.neighbour)],
  [/\bbathhouse\b/i, 'bathhouse', nn(NEEDS.bathhouse)], [/\btheat|\bopera\b/i, 'theater', nn(NEEDS.theater)], [/\bcathedral\b/i, 'cathedral', nn(NEEDS.cathedral)],
  [/\bflocks?\b|\bshepherd/i, 'shepherd row', nn(NEEDS.shepherd)], [/\broot cellar\b/i, 'root cellar row', nn(NEEDS.rootCellar)],
  [/\bsteps of the (?:wayside )?shrine/i, 'steps of a shrine', () => true],
  [/\btown\b/i, 'the word "town" (rule 4)', () => true], [/\(|\)/, 'a bracket (rule 4)', () => true], [/\bmultiple\b|\bmassive\b/i, 'a catalogue qualifier (rule 4)', () => true],
  [/\b(?:spring|summer|autumn|winter|rain|snow|frost|seasons?|weather)\b/i, 'season or weather (rule 7)', () => true],
  [/\b(?:two|three|four|five|six|seven|eight|nine|ten|dozens?|hundreds?|twice|thrice)\b/i, 'a count (rule 7)', () => true],
  [/at risk|referenced as|has come to a head|stability|fragility/i, 'a machine label (rule 5)', () => true],
];
console.log(`\n════ 4. WORD TESTS (this lane's own; places of ${N} printing the word in the slot while the test fails)`);
console.log(HDR);
const wordTotals = {};
for (const [slot, k] of SLOTS) for (const [re, label, f] of WORD_TESTS) {
  const hits = rows.filter((x) => re.test(x[k].text) && f(x.rec, x));
  if (!hits.length) continue;
  wordTotals[slot] = (wordTotals[slot] || 0) + hits.length;
  console.log(`${line(`${slot} /${re.source}/ — ${label}`, (s) => String(hits.filter((x) => x.size === s).length))} e.g. ${hits[0].seed}: "${hits[0][k].text.slice(0, 110)}"`);
}
console.log(`  WORD-TEST hits by slot: ${JSON.stringify(wordTotals)} (rows not printed are 0 at every size)`);

console.log(`\n════ 5. RULES 4 AND 6, AND THE WORD COUNT`);
console.log(HDR);
console.log(line('a named house is hideable (isHideableHouse)', (s) => String(bySize(s).filter((x) => x.named.some((i) => i && isHideableHouse(i))).length)));
const words = (t) => t.split(/\s+/).filter(Boolean).length;
for (const [slot, k] of SLOTS) console.log(line(`${slot}: words min-max`, (s) => { const w = bySize(s).filter((x) => x[k].text).map((x) => words(x[k].text)); return w.length ? `${Math.min(...w)}-${Math.max(...w)}` : '—'; }));
console.log(`  wordings by length (8-30 is rule 8): ${Object.entries(POOLS).flatMap(([s, b]) => Object.entries(b).flatMap(([br, p]) => p.map(([id, , t]) => [s, br, id, words(t.replace(/\{\w+\}/g, 'the house'))]))).filter(([s, , , w]) => s !== 'child_warnings' && (w < 8 || w > 30)).map(([s, br, id, w]) => `${s}:${br}:${id}=${w}`).join(', ') || 'all whole-sentence wordings 8-30'}`);

console.log(`\n════ 6. WORDING USE — places printing each wording (sum of the six sizes), and the houses named`);
for (const [slot, k] of SLOTS) {
  const c = new Map();
  for (const x of rows) for (const id of x[k].ids) if (id) c.set(id, (c.get(id) || 0) + 1);
  console.log(`  ${slot}: ${[...c].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'en', { numeric: true })).map(([id, n]) => `${id}=${n}`).join(' ')}`);
}
const houseNames = new Map();
for (const x of rows) for (const i of x.named) if (i) houseNames.set(`${i.name} -> "${said(i)}"`, (houseNames.get(`${i.name} -> "${said(i)}"`) || 0) + 1);
console.log(`  houses named (row -> as printed; places): ${[...houseNames].sort((a, b) => b[1] - a[1]).map(([h, n]) => `${h} ${n}`).join('; ')}`);

console.log(`\n════ 7. SAMPLES (first place of each size)`);
for (const s of SIZES) { const x = bySize(s)[0]; console.log(`  ${x.seed} (${x.rec.name})\n    dawn [${x.dawn.br}] ${x.dawn.text}\n    gather [${x.gather.br}] ${x.gather.text}\n    child [${x.child.br}] ${x.child.text}`); }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
