// PEOPLE-1 seat M2 (2026-11-20): THE PROPOSED QUARTER WORDINGS, as the measure applies them. This file is the script-side
// mirror of the proposed data file `src/data/quarterDescPools.js` (NOT written: a measuring seat changes nothing under src/).
// Each wording: { id, needs (the atoms it would declare; `ATOM?` marks a house no vocabulary atom answers yet), when(h), text(h, some) }.
// Selection (the proposal): eligible = the branch's wordings whose `when` holds; chosen = pickVariant(eligible, `${seed}|quarters.${name}.desc`);
// `some(items, k, tag)` names k of the standing houses, chosen by keyed hash (`${key}|${tag}`), printed in the table's order. No draw.
// Index 0 of every branch is today's exact string, declared with what it truly needs (so it prints only where its words are true).

/** a, b and c */
export const series = (xs) => (xs.length <= 1 ? (xs[0] || '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const any = (names, re) => names.some((n) => re.test(n));
const first = (names, re) => names.find((n) => re.test(n)) || null;

/** The facts a wording reads, from the birth's record (fact homes where one exists; the roster's own rows where none does). */
export function housesOf(p) {
  const L = p.live.filter((n) => !/^access to\b/i.test(n));
  const tier = p.tier;
  const tierNoun = tier === 'metropolis' ? 'city' : tier;
  const kinds = new Set(p.crisis.kinds);
  const burialRow = first(L, /burial|grave|charnel|cemet/i);
  const burial = !burialRow ? null
    : /charnel/i.test(burialRow) ? 'burial grounds and the charnel house'
    : /cemetery network/i.test(burialRow) ? 'cemeteries'
    : /graveyard/i.test(burialRow) ? 'graveyard'
    : /grounds/i.test(burialRow) ? 'burial grounds' : 'burial ground';
  const churchWords = p.faith.churchWords || '';
  const plural = !/^a /.test(churchWords) || / and /.test(churchWords);
  return {
    p, L, tier, tierNoun,
    // faith (`dossier/faithReading.js :: faithReadingOf`, the faith home factsOf names)
    church: p.faith.hasChurch, access: p.faith.accessOnly, shrine: p.faith.shrine, churchWords, Cw: cap(churchWords), plural,
    them: plural ? 'them' : 'it', their: plural ? 'their' : 'its',
    roadOpen: !kinds.has('under_siege') && !kinds.has('plague_onset'), // faithReading's roadBarred / quarantined
    calm: !['insurgency', 'slave_revolt', 'wartime'].some((k) => kinds.has(k)), // the crisis family `unrest` (today's R0 exclude, applied to the new quiet lines)
    monastery: p.kinds.monastery, hospital: p.kinds.hospital, cathedral: /cathedral/.test(churchWords),
    burial, // ATOM? burial ground (no atom; the roster's row)
    // water (`facts/water.js`)
    coast: !!p.water?.coast, river: !!p.water?.river,
    // market, guild, court, magic, crime (their homes)
    market: p.market, guild: p.guild, courtSits: p.court.length > 0, magic: p.magic.level !== 'none', crime: p.crime,
    bathhouse: p.kinds.bathhouse, bank: p.kinds.bank, tavern: p.kinds.tavern,
    // houses no atom answers (ATOM? lines in the proposal's §6): read off the roster's own rows here
    tanners: any(L, /\btann/i), tannerySingle: any(L, /^tannery$|^tanner \(/i) && !any(L, /^tanners$/i),
    butchers: any(L, /\bbutcher/i), slaughter: any(L, /slaughter/i), dyers: any(L, /\bdyer/i), fullers: any(L, /\bfuller/i),
    warehouses: any(L, /warehouse/i), fishMarket: any(L, /fish market/i), customs: any(L, /customs house/i),
    harbourMaster: any(L, /harbou?r master/i), chandler: any(L, /chandler/i), ropemaker: any(L, /ropemaker/i),
    shipyard: any(L, /shipyard/i), boatyard: any(L, /boatyard/i), saltWorks: any(L, /salt works/i), ferry: any(L, /ferry/i),
    weekly: any(L, /weekly market/i), fair: any(L, /\bfairs?\b/i), merchantGuild: any(L, /merchant guild/i), moneyChangers: any(L, /money changer/i),
    hall: any(L, /^city hall$/i) ? 'the city hall' : any(L, /^town hall$/i) ? 'the town hall' : null,
    palace: any(L, /palace/i), courtWord: any(L, /multiple court/i) ? 'the court buildings' : 'the courthouse',
    mint: any(L, /\bmint\b/i),
    tower: any(L, /wizard'?s tower/i), magesGuild: any(L, /mages' guild/i), alchemists: any(L, /alchemist/i), enchanter: any(L, /enchanter/i),
    sages: any(L, /sage'?s quarter/i), academy: any(L, /academy of magic|arcane academy/i), library: any(L, /great library/i), scribe: any(L, /scroll scribe/i),
    blackMarket: any(L, /black market/i), gambling: any(L, /gambling/i), brothel: any(L, /brothel/i), smuggling: any(L, /smuggl/i),
    thieves: any(L, /thieves' guild/i), assassins: any(L, /assassins' guild/i), underground: any(L, /underground city/i), factions: any(L, /criminal factions/i), fronts: any(L, /front business/i),
    smiths: any(L, /blacksmith/i), carpenters: any(L, /carpenter/i), cooper: any(L, /\bcooper/i), potter: any(L, /\bpotter/i),
    weavers: any(L, /weaver/i), glass: any(L, /glass/i), bowyers: any(L, /bowyer/i), cobblers: any(L, /cobbler/i), tailors: any(L, /tailor/i),
    sawmill: any(L, /sawmill/i), charcoal: any(L, /charcoal/i), woodcarver: any(L, /woodcarver/i),
    alehouse: any(L, /\bale ?house/i), inn: any(L, /wayside inn/i), grazing: any(L, /common grazing/i),
    theatres: any(L, /theat/i), merchants: any(L, /merchant guild/i),
    bakers: any(L, /baker/i), water: any(L, /aqueduct|water system|water infrastructure/i), dailyMarkets: any(L, /daily markets|district markets/i),
  };
}

/** the standing items of a list table: [{ when, word }] → the words that stand */
const standing = (h, rows) => rows.filter((r) => r.when(h)).map((r) => r.word);

// ── the item tables (each word names a house that stands) ──
const NOXIOUS = [
  { when: (h) => h.tanners, word: (h) => (h.tannerySingle ? 'a tannery' : 'tanneries') },
  { when: (h) => h.butchers, word: () => "butchers' yards" },
  { when: (h) => h.slaughter, word: () => 'the slaughterhouse' },
  { when: (h) => h.dyers, word: () => "the dyers' vats" },
  { when: (h) => h.fullers, word: () => "the fullers' troughs" },
];
const WATERSIDE = [
  { when: (h) => h.warehouses, word: () => 'warehouses' },
  { when: (h) => h.customs, word: () => 'the customs house' },
  { when: (h) => h.harbourMaster, word: () => "the harbour master's office" },
  { when: (h) => h.fishMarket, word: () => 'the fish market' },
  { when: (h) => h.chandler, word: () => "a chandler's" },
  { when: (h) => h.ropemaker, word: () => 'the ropewalk' },
  { when: (h) => h.shipyard, word: () => 'the shipyard' },
  { when: (h) => h.boatyard, word: () => 'the boatyard' },
  { when: (h) => h.saltWorks, word: () => 'the salt works' },
  { when: (h) => h.ferry, word: () => 'the ferry landing' },
];
const GOVERNMENT = [
  { when: (h) => h.palace, word: () => 'the palace' },
  { when: (h) => !!h.hall, word: (h) => h.hall },
  { when: (h) => h.courtSits, word: (h) => h.courtWord },
  { when: (h) => h.customs, word: () => 'the customs house' },
  { when: (h) => h.mint, word: () => 'the mint' },
];
const ARCANE = [
  { when: (h) => h.tower, word: () => "a wizard's tower" },
  { when: (h) => h.magesGuild, word: () => "the mages' guild" },
  { when: (h) => h.academy, word: () => 'the academy of magic' },
  { when: (h) => h.library, word: () => 'the great library' },
  { when: (h) => h.alchemists, word: () => "the alchemists' workshops" },
  { when: (h) => h.enchanter, word: () => "the enchanter's shop" },
  { when: (h) => h.sages, word: () => "the sages' houses" },
  { when: (h) => h.scribe, word: () => 'the scroll scribes' },
];
const SHADOW = [
  { when: (h) => h.blackMarket, word: () => 'the black market' },
  { when: (h) => h.gambling, word: () => 'gambling halls' },
  { when: (h) => h.brothel, word: () => 'brothels' },
  { when: (h) => h.smuggling, word: () => "the smugglers' stores" },
  { when: (h) => h.thieves, word: () => "the thieves' guild's haunts" },
  { when: (h) => h.underground, word: () => 'the stairs down to the underground city' },
  { when: (h) => h.fronts, word: () => 'shops that serve as fronts' },
  { when: (h) => h.factions, word: () => "the rival gangs' haunts" },
];
const CRAFTS = [
  { when: (h) => h.smiths, word: () => "smiths' forges" },
  { when: (h) => h.carpenters, word: () => "carpenters' shops" },
  { when: (h) => h.cooper, word: () => "a cooper's yard" },
  { when: (h) => h.potter, word: () => "a potter's kiln" },
  { when: (h) => h.weavers, word: () => "weavers' looms" },
  { when: (h) => h.glass, word: () => 'glassblowers' },
  { when: (h) => h.bowyers, word: () => 'bowyers and fletchers' },
  { when: (h) => h.cobblers, word: () => 'cobblers' },
  { when: (h) => h.tailors, word: () => 'tailors' },
];
const MARKET_ALSO = [
  { when: (h) => h.fishMarket, word: () => 'the fish market at one end' },
  { when: (h) => h.warehouses, word: () => "the merchants' warehouses close by" },
  { when: (h) => h.merchantGuild, word: () => "the merchant guilds' halls" },
  { when: (h) => h.fair, word: () => 'the ground where the annual fair is held' },
  { when: (h) => h.moneyChangers, word: () => "the money changers' tables" },
];
const WEALTH_ALSO = [
  { when: (h) => h.theatres, word: () => 'the theatre' },
  { when: (h) => h.bathhouse, word: () => 'the public baths' },
  { when: (h) => h.bank, word: () => 'the banking houses' },
  { when: (h) => h.merchants, word: () => "the merchant guilds' halls" },
];
const COMMON_ALSO = [
  { when: (h) => h.bakers, word: () => "bakers' ovens at the corners" },
  { when: (h) => h.water, word: () => 'public fountains on the water system' },
  { when: (h) => h.bathhouse, word: () => 'the public baths' },
  { when: (h) => h.dailyMarkets, word: () => 'a market most days' },
  { when: (h) => h.fishMarket, word: () => 'the fish market' },
];

const items = (h, table) => table.filter((r) => r.when(h)).map((r) => r.word(h));

/** THE POOLS: quarter name → branch → wordings. A branch is chosen exactly as today's code chooses its text. */
export const POOLS = {
  'Religious Quarter': {
    // today: `has('church') || has('Cathedral') || has('monastery')`; the branch splits on the faith home's hasChurch / accessOnly
    branchOf: (h) => (h.church ? 'church' : 'access'),
    church: [
      { id: 'R0', needs: ['church', 'institution: monastery', '(pilgrims: no home)'], when: (h) => h.church && h.monastery, text: () => 'Houses of worship, cloisters, quiet streets with priests and pilgrims' },
      { id: 'R1', needs: ['church', 'excludes crisis: unrest'], when: (h) => h.church && h.calm, text: (h) => `${h.Cw}, and quiet streets around ${h.them}` },
      { id: 'R2', needs: ['church', 'clergy'], when: (h) => h.church, text: (h) => (h.plural ? `${h.Cw}, and the houses of their clergy` : `${h.Cw}, and the priest's house beside it`) },
      { id: 'R3', needs: ['church', 'ATOM? burial ground'], when: (h) => h.church && h.burial, text: (h) => `${h.Cw}, with the ${h.burial} beside ${h.them}` },
      { id: 'R4', needs: ['church', 'excludes crisis: unrest'], when: (h) => h.church && h.calm, text: (h) => `Quiet streets about ${h.churchWords}, where the ${h.tierNoun} comes to worship` },
      { id: 'R5', needs: ['church', 'ATOM? burial ground', 'excludes crisis: unrest'], when: (h) => h.church && h.burial && h.calm, text: (h) => `${h.Cw}, the ${h.burial}, and the quiet lanes between` },
      { id: 'R6', needs: ['church', 'institution: monastery'], when: (h) => h.church && h.monastery, text: (h) => (h.plural ? `${h.Cw}, and the cloisters behind the monastery walls` : `${h.Cw}, and the cloister behind the monastery walls`) },
      { id: 'R7', needs: ['church', 'institution: hospital'], when: (h) => h.church && h.hospital, text: (h) => `${h.Cw}, with the hospital close by` },
      { id: 'R8', needs: ['church'], when: (h) => h.church, text: (h) => `Where the ${h.tierNoun} worships: ${h.churchWords}, and the streets around ${h.them}` },
      { id: 'R9', needs: ['church', 'ATOM? burial ground'], when: (h) => h.church && h.burial, text: (h) => `${h.Cw}, and the ${h.burial} where the ${h.tierNoun} buries its dead` },
      { id: 'R10', needs: ['church', 'clergy'], when: (h) => h.church, text: (h) => (h.plural ? `${h.Cw}, the clergy's houses, and the lanes around them` : `${h.Cw}, the priest's house, and the lanes around it`) },
      { id: 'R11', needs: ['church', 'excludes crisis: unrest'], when: (h) => h.church && h.calm, text: (h) => `${h.Cw}, ${h.their} yard${h.plural ? 's' : ''} the quietest ground in the ${h.tierNoun}` },
      { id: 'R12', needs: ['church (more than one house)', 'excludes crisis: unrest'], when: (h) => h.church && h.plural && h.calm, text: (h) => `Houses of worship: ${h.churchWords}, and the quiet streets between` },
      { id: 'R13', needs: ['church', 'institution: monastery'], when: (h) => h.church && h.monastery, text: (h) => (/monasteries/.test(h.churchWords) ? `${h.Cw}, the monasteries set a little apart` : `${h.Cw}, the monastery set a little apart`) },
      { id: 'R14', needs: ['church', 'clergy'], when: (h) => h.church, text: (h) => (h.plural ? `${h.Cw}, and the clergy going between them` : `${h.Cw}, and the priest going about the parish`) },
      { id: 'R15', needs: ['church'], when: (h) => h.church, text: (h) => `The ${h.tierNoun}'s worship centres here: ${h.churchWords}` },
      { id: 'R16', needs: ['church', 'ATOM? burial ground'], when: (h) => h.church && h.burial, text: (h) => `${h.Cw}, and the ${h.burial} behind a low wall` },
    ],
    access: [
      // today's line names a church, cloisters and priests the place lacks: it is not eligible here (its needs fail): a RULING
      { id: 'R0', needs: ['church', 'institution: monastery'], when: (h) => h.church && h.monastery, text: () => 'Houses of worship, cloisters, quiet streets with priests and pilgrims' },
      { id: 'A1', needs: ['church access', 'no church', 'road open (not under_siege, not plague_onset)'], when: (h) => h.access && h.roadOpen, text: () => "No church of its own; the people walk to a neighbour's parish church" },
      { id: 'A2', needs: ['church access', 'institution: temple (with no church: the shrine)', 'road open'], when: (h) => h.access && h.shrine && h.roadOpen, text: () => "A wayside shrine, and the path to a neighbour's parish church" },
      { id: 'A3', needs: ['church access', 'institution: temple (with no church: the shrine)'], when: (h) => h.access && h.shrine, text: () => "A wayside shrine; the nearest church is a neighbour's" },
      { id: 'A4', needs: ['church access', 'ATOM? burial ground', 'road open'], when: (h) => h.access && h.burial && h.roadOpen, text: (h) => `The ${h.burial}; for a church, the people go to a neighbour's parish` },
      { id: 'A5', needs: ['church access', 'no church', 'no clergy'], when: (h) => h.access, text: (h) => `No church and no priest here; a neighbour's parish church serves the ${h.tierNoun}` },
      { id: 'A6', needs: ['church access', 'road open'], when: (h) => h.access && h.roadOpen, text: (h) => `The ${h.tierNoun} keeps no church; its people go to the next parish to worship` },
      { id: 'A7', needs: ['church access', 'ATOM? burial ground'], when: (h) => h.access && h.burial, text: (h) => `A neighbour's parish church serves the ${h.tierNoun}; the ${h.burial} is its own` },
      { id: 'A8', needs: ['church access', 'road open'], when: (h) => h.access && h.roadOpen, text: () => "Worship means a walk to a neighbour's parish church" },
      { id: 'A9', needs: ['church access', 'ATOM? burial ground', 'road open'], when: (h) => h.access && h.burial && h.roadOpen, text: (h) => `The ${h.tierNoun}'s dead lie in its own ${h.burial}; the living walk to a neighbour's church` },
      { id: 'A10', needs: ['church access', 'road open'], when: (h) => h.access && h.roadOpen, text: () => "Holy days mean the walk to a neighbour's parish church" },
      { id: 'A11', needs: ['church access', 'no church'], when: (h) => h.access, text: () => "No house of worship stands here; the parish church is a neighbour's" },
      { id: 'A13', needs: ['church access', 'no church'], when: (h) => h.access, text: (h) => `The ${h.tierNoun} has no church; its parish church stands in a neighbouring place` },
      { id: 'A14', needs: ['church access', 'ATOM? burial ground'], when: (h) => h.access && h.burial, text: (h) => `Only the ${h.burial}; the ${h.tierNoun}'s church is a neighbour's` },
      { id: 'A15', needs: ['church access', 'no clergy', 'road open'], when: (h) => h.access && h.roadOpen, text: (h) => `No priest lives in the ${h.tierNoun}; its people go to a neighbour's parish church` },
      { id: 'A12', needs: ['church access', 'institution: temple (with no church: the shrine)'], when: (h) => h.access && h.shrine, text: (h) => `The shrine at the ${h.tierNoun}'s edge is its only holy place; the parish church is a neighbour's` },
    ],
  },
  'Market Quarter': {
    branchOf: () => 'market',
    market: [
      { id: 'M0', needs: ['market', 'excludes crisis: threat, plague_onset (today\'s, kept)'], when: (h) => h.market, text: () => 'Bustling center with merchant stalls, hawkers, and crowds' },
      { id: 'M1', needs: ['market', 'ATOM? weekly market'], when: (h) => h.market && h.weekly, text: () => 'The market square and its stalls, busiest on market day' },
      { id: 'M2', needs: ['market', 'ATOM? weekly market'], when: (h) => h.market && h.weekly, text: () => 'The market square, where the weekly market sets up its stalls' },
      { id: 'M3', needs: ['market', 'ATOM? the also-house'], when: (h) => h.market && items(h, MARKET_ALSO).length > 0, text: (h, some) => `Stalls and carts on the market square, ${series(some(items(h, MARKET_ALSO), 1, 'also'))}` },
      { id: 'M4', needs: ['market', 'ATOM? the also-houses'], when: (h) => h.market && items(h, MARKET_ALSO).length > 1, text: (h, some) => `The market square, ${series(some(items(h, MARKET_ALSO), 2, 'also'))}` },
      { id: 'M5', needs: ['market'], when: (h) => h.market, text: (h, some) => (items(h, MARKET_ALSO).length ? `Stalls, carts and buyers on the square, and ${series(some(items(h, MARKET_ALSO), 1, 'also5'))}` : `Stalls, carts and buyers: the ${h.tierNoun}'s market square`) },
      { id: 'M6', needs: ['market', 'ATOM? the also-house'], when: (h) => h.market && items(h, MARKET_ALSO).length > 0, text: (h, some) => `Merchant stalls round the square, and ${series(some(items(h, MARKET_ALSO), 1, 'also6'))}` },
      { id: 'M7', needs: ['market', 'guild'], when: (h) => h.market && h.guild, text: () => "The market square, the guild halls, and the traders' stalls between" },
      { id: 'M9', needs: ['market', 'ATOM? the also-house'], when: (h) => h.market && items(h, MARKET_ALSO).length > 0, text: (h, some) => `Carts unloading at the market square, and ${series(some(items(h, MARKET_ALSO), 1, 'also9'))}` },
      { id: 'M10', needs: ['market', 'ATOM? the also-houses'], when: (h) => h.market && items(h, MARKET_ALSO).length > 1, text: (h, some) => `Traders' stalls, ${series(some(items(h, MARKET_ALSO), 2, 'also10'))}` },
      { id: 'M8', needs: ['market'], when: (h) => h.market, text: (h, some) => (items(h, MARKET_ALSO).length ? `Where the ${h.tierNoun} buys and sells: the square, its stalls, and ${series(some(items(h, MARKET_ALSO), 1, 'also8'))}` : `Where the ${h.tierNoun} buys and sells: the square, its stalls and the shops around it`) },
    ],
  },
  'Noxious Trades Quarter': {
    branchOf: () => 'trades',
    trades: [
      { id: 'N0', needs: ['ATOM? tannery', 'ATOM? butcher', 'ATOM? dyer'], when: (h) => h.tanners && h.butchers && h.dyers, text: () => 'Smelly, dirty area with tanneries, butchers, and dyers' },
      { id: 'N1', needs: ['ATOM? the trades named'], when: (h) => items(h, NOXIOUS).length > 0, text: (h, some) => `${cap(series(some(items(h, NOXIOUS), 3, 't')))}, kept downwind of the houses` },
      { id: 'N2', needs: ['ATOM? the trades named'], when: (h) => items(h, NOXIOUS).length > 0, text: (h, some) => `The stink of ${series(some(items(h, NOXIOUS), 3, 't'))}, downwind of everything else` },
      { id: 'N3', needs: ['ATOM? the trades named'], when: (h) => items(h, NOXIOUS).length > 0, text: (h, some) => `${cap(series(some(items(h, NOXIOUS), 3, 't')))}, and the smell that comes with them` },
      { id: 'N4', needs: ['ATOM? the trades named', 'river'], when: (h) => h.river && items(h, NOXIOUS).length > 0, text: (h, some) => `${cap(series(some(items(h, NOXIOUS), 3, 't')))}, downstream of the drinking water` },
      { id: 'N5', needs: ['ATOM? the trades named'], when: (h) => items(h, NOXIOUS).length > 0, text: (h, some) => `Smelly, dirty work: ${series(some(items(h, NOXIOUS), 3, 't'))}` },
      { id: 'N6', needs: ['ATOM? the trades named'], when: (h) => items(h, NOXIOUS).length > 0, text: (h, some) => `${cap(series(some(items(h, NOXIOUS), 3, 't')))}, at the edge where no one else wants to live` },
      { id: 'N7', needs: ['ATOM? tannery (and no other noxious trade)'], when: (h) => h.tanners && items(h, NOXIOUS).length === 1, text: (h) => `Tanning pits and hides drying on frames, downwind of the ${h.tierNoun}` },
    ],
  },
  'Waterfront District': {
    // today: maritime ? the coast line : the river line (worldLaw.supportsMaritime)
    branchOf: (h, q) => (/sailors/.test(q.desc) ? 'maritime' : 'river'),
    maritime: [
      { id: 'W0', needs: ['coast', 'docks', 'ATOM? warehouse', '(salt: ATOM? salt works)'], when: (h) => h.warehouses && h.saltWorks, text: () => 'Warehouses, docks, sailors, longshoremen, salt, and fish' },
      { id: 'Wm1', needs: ['coast', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `The docks, ${series(some(items(h, WATERSIDE), 2, 'w'))}, and sailors ashore between voyages` },
      { id: 'Wm2', needs: ['coast', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `Quays and docks, with ${series(some(items(h, WATERSIDE), 2, 'w'))}` },
      { id: 'Wm3', needs: ['coast', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `${cap(series(some(items(h, WATERSIDE), 2, 'w')))} along the harbour, and ships at the docks` },
      { id: 'Wm4', needs: ['coast', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `The harbour front: docks, ${series(some(items(h, WATERSIDE), 3, 'w'))}` },
      { id: 'Wm5', needs: ['coast', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `Docks, with ${series(some(items(h, WATERSIDE), 2, 'w'))}, busy when the ships are in` },
    ],
    river: [
      { id: 'W0', needs: ['river', 'docks', 'ATOM? warehouse'], when: (h) => h.warehouses, text: () => 'Warehouses, wharves, barges, dockworkers, and river traffic' },
      { id: 'Wr1', needs: ['river', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `Wharves along the river, with ${series(some(items(h, WATERSIDE), 2, 'w'))}` },
      { id: 'Wr2', needs: ['river', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `The river wharves, ${series(some(items(h, WATERSIDE), 2, 'w'))}, and barges tied up along the bank` },
      { id: 'Wr3', needs: ['river', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `Barges at the wharves, and ${series(some(items(h, WATERSIDE), 2, 'w'))} along the bank` },
      { id: 'Wr4', needs: ['river', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `The riverside: wharves, ${series(some(items(h, WATERSIDE), 3, 'w'))}` },
      { id: 'Wr5', needs: ['river', 'docks', 'ATOM? the houses named'], when: (h) => items(h, WATERSIDE).length > 0, text: (h, some) => `Wharves along the bank, with ${series(some(items(h, WATERSIDE), 2, 'w'))}, busy when the barges come in` },
    ],
  },
  'Government Quarter': {
    branchOf: () => 'seat',
    seat: [
      { id: 'G0', needs: ['court sits'], when: (h) => h.courtSits, text: () => 'Official buildings, courts, administrative offices' },
      { id: 'G1', needs: ['the houses named (hall: ATOM? town hall)'], when: (h) => items(h, GOVERNMENT).length > 1, text: (h, some) => `${cap(series(some(items(h, GOVERNMENT), 2, 'g')))}, and the offices around them` },
      { id: 'G2', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 0, text: (h, some) => `Where the ${h.tierNoun} is governed: ${series(some(items(h, GOVERNMENT), 3, 'g'))}` },
      { id: 'G3', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 0, text: (h, some) => `Official buildings: ${series(some(items(h, GOVERNMENT), 3, 'g'))}` },
      { id: 'G4', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 0, text: (h, some) => `The seat of the ${h.tierNoun}'s government: ${series(some(items(h, GOVERNMENT), 2, 'g'))}` },
      { id: 'G5', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 1, text: (h, some) => `${cap(series(some(items(h, GOVERNMENT), 2, 'g')))}, with clerks and petitioners coming and going` },
      { id: 'G6', needs: ['court sits'], when: (h) => h.courtSits, text: (h) => `${cap(h.courtWord)} and the offices that keep the ${h.tierNoun}'s business` },
      { id: 'G8', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 1, text: (h, some) => `${cap(series(some(items(h, GOVERNMENT), 2, 'g8')))}, and the clerks' offices between` },
      { id: 'G9', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 1, text: (h, some) => `The ${h.tierNoun}'s business is done here: ${series(some(items(h, GOVERNMENT), 2, 'g9'))}` },
      { id: 'G10', needs: ['court sits'], when: (h) => h.courtSits, text: (h) => `${cap(h.courtWord)}, busy on court days, and the offices beside ${h.courtWord === 'the courthouse' ? 'it' : 'them'}` },
      { id: 'G11', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 1, text: (h, some) => `${cap(series(some(items(h, GOVERNMENT), 3, 'g11')))}, with petitioners waiting at the doors` },
      { id: 'G7', needs: ['the houses named'], when: (h) => items(h, GOVERNMENT).length > 1, text: (h, some) => `Halls and offices: ${series(some(items(h, GOVERNMENT), 3, 'g'))}` },
    ],
  },
  "Mages' Quarter": {
    branchOf: () => 'arcane',
    arcane: [
      { id: 'X0', needs: ['magic', "ATOM? wizard's tower", 'enchanting (arcane shops)'], when: (h) => h.magic && h.tower && h.enchanter, text: () => 'Towers, arcane shops, strange lights and sounds at night' },
      { id: 'X1', needs: ['magic', 'ATOM? the houses named'], when: (h) => h.magic && items(h, ARCANE).length > 0, text: (h, some) => `${cap(series(some(items(h, ARCANE), 2, 'x')))}, kept apart from the rest of the ${h.tierNoun}` },
      { id: 'X2', needs: ['magic', 'ATOM? the houses named'], when: (h) => h.magic && items(h, ARCANE).length > 0, text: (h, some) => `Arcane work set apart: ${series(some(items(h, ARCANE), 3, 'x'))}` },
      { id: 'X3', needs: ['magic', 'ATOM? the houses named'], when: (h) => h.magic && items(h, ARCANE).length > 0, text: (h, some) => `${cap(series(some(items(h, ARCANE), 2, 'x')))}, at a careful distance from the houses` },
      { id: 'X4', needs: ['magic', 'ATOM? the houses named'], when: (h) => h.magic && items(h, ARCANE).length > 0, text: (h, some) => `Spellwork and study: ${series(some(items(h, ARCANE), 3, 'x'))}` },
      { id: 'X5', needs: ['magic', 'ATOM? the houses named'], when: (h) => h.magic && items(h, ARCANE).length > 0, text: (h, some) => `${cap(series(some(items(h, ARCANE), 3, 'x')))}, and the shops that supply them` },
    ],
  },
  'Shadows District': {
    branchOf: () => 'shadow',
    shadow: [
      { id: 'S0', needs: ['ATOM? black market', 'organised crime'], when: (h) => h.blackMarket && h.crime !== 'none', text: () => 'Narrow alleys, hidden markets, criminal activity' },
      { id: 'S1', needs: ['organised crime', 'ATOM? the houses named'], when: (h) => items(h, SHADOW).length > 0, text: (h, some) => `Narrow alleys around ${series(some(items(h, SHADOW), 2, 's'))}` },
      { id: 'S2', needs: ['organised crime', 'ATOM? the houses named'], when: (h) => items(h, SHADOW).length > 0, text: (h, some) => `Narrow alleys and crooked lanes: ${series(some(items(h, SHADOW), 3, 's'))}` },
      { id: 'S3', needs: ['organised crime', 'ATOM? the houses named'], when: (h) => items(h, SHADOW).length > 0, text: (h, some) => `${cap(series(some(items(h, SHADOW), 2, 's')))}, and the narrow alleys between them` },
      { id: 'S4', needs: ['organised crime', 'ATOM? the houses named'], when: (h) => h.crime !== 'none' && items(h, SHADOW).length > 0, text: (h, some) => `Where the ${h.tierNoun}'s crime does its business: ${series(some(items(h, SHADOW), 2, 's'))}` },
      { id: 'S5', needs: ['organised crime', 'ATOM? the houses named'], when: (h) => items(h, SHADOW).length > 0, text: (h, some) => `${cap(series(some(items(h, SHADOW), 2, 's')))}, out of sight of the better streets` },
    ],
  },
  'Artisan Quarter': {
    branchOf: () => 'crafts',
    crafts: [
      { id: 'Z0', needs: ['guild'], when: (h) => h.guild, text: () => 'Workshops, guild halls, apprentices learning trades' },
      { id: 'Z1', needs: ['ATOM? the crafts named'], when: (h) => items(h, CRAFTS).length > 0, text: (h, some) => `Workshops: ${series(some(items(h, CRAFTS), 3, 'z'))}` },
      { id: 'Z2', needs: ['guild', 'ATOM? the crafts named'], when: (h) => h.guild && items(h, CRAFTS).length > 0, text: (h, some) => `${cap(series(some(items(h, CRAFTS), 2, 'z')))}, and the guild halls` },
      { id: 'Z3', needs: ['ATOM? the crafts named'], when: (h) => items(h, CRAFTS).length > 0, text: (h, some) => `${cap(series(some(items(h, CRAFTS), 3, 'z')))}, with apprentices at the benches` },
      { id: 'Z6', needs: ['ATOM? the crafts named'], when: (h) => items(h, CRAFTS).length > 0, text: (h, some) => `The sound of work from ${series(some(items(h, CRAFTS), 2, 'z6'))}` },
      { id: 'Z7', needs: ['ATOM? the crafts named'], when: (h) => items(h, CRAFTS).length > 1, text: (h, some) => `${cap(series(some(items(h, CRAFTS), 2, 'z7')))}, their shops open to the street` },
      { id: 'Z8', needs: ['guild', 'ATOM? the crafts named'], when: (h) => h.guild && items(h, CRAFTS).length > 0, text: (h, some) => `Workshops run by guild masters: ${series(some(items(h, CRAFTS), 3, 'z8'))}` },
      { id: 'Z4', needs: ['guild', 'ATOM? the crafts named'], when: (h) => h.guild && items(h, CRAFTS).length > 0, text: (h, some) => `Workshops and guild halls: ${series(some(items(h, CRAFTS), 2, 'z'))}` },
    ],
  },
  "Woodcutters' Ground": {
    branchOf: () => 'wood',
    wood: [
      { id: 'D0', needs: ['ATOM? woodcutter'], when: () => true, text: () => 'Stacked timber, sawdust paths, and sheds for tools and sleds' },
      { id: 'D1', needs: ['ATOM? woodcutter'], when: () => true, text: () => "Stacked timber and the woodcutters' sheds" },
      { id: 'D2', needs: ['ATOM? woodcutter'], when: () => true, text: () => "Timber stacked to season, and the woodcutters' tools under cover" },
      { id: 'D3', needs: ['ATOM? sawmill'], when: (h) => h.sawmill, text: () => 'The sawmill, and timber stacked beside it' },
      { id: 'D4', needs: ['ATOM? charcoal burner'], when: (h) => h.charcoal, text: () => "Stacked logs and the charcoal burner's clamps" },
      { id: 'D5', needs: ['ATOM? woodcutter'], when: () => true, text: () => "Log piles, chip-strewn paths and the woodcutters' sheds" },
      { id: 'D6', needs: ['ATOM? woodcutter'], when: () => true, text: () => 'Timber stacks at the forest edge, and the sheds where the axes are kept' },
      { id: 'D8', needs: ['ATOM? woodcutter'], when: () => true, text: () => 'Felled trunks waiting to be cut, and a shed for the saws and sleds' },
      { id: 'D9', needs: ['ATOM? sawmill'], when: (h) => h.sawmill, text: () => 'Logs dragged down to the sawmill, and planks stacked to dry' },
      { id: 'D10', needs: ['ATOM? woodcutter'], when: () => true, text: () => 'Cut timber in stacks, and the sheds where the tools and sleds are kept' },
      { id: 'D7', needs: ['ATOM? carpenter'], when: (h) => h.carpenters, text: () => "Felled timber, and the carpenter's workshop beside it" },
    ],
  },
  'Fishing Landing': {
    branchOf: (h) => (h.coast ? 'coast' : 'inland'),
    coast: [
      { id: 'F0', needs: ['coast'], when: (h) => h.coast, text: () => 'Nets, drying racks, upturned boats, and the perpetual smell of salt and fish' },
      { id: 'F1', needs: ['coast'], when: (h) => h.coast, text: () => 'Boats drawn up on the shore, nets hung to dry' },
      { id: 'F2', needs: ['coast'], when: (h) => h.coast, text: () => 'Nets drying on racks above the tideline, and the boats beside them' },
      { id: 'F3', needs: ['coast'], when: (h) => h.coast, text: () => 'Upturned boats and drying racks, and the smell of fish and salt' },
      { id: 'F4', needs: ['coast'], when: (h) => h.coast, text: () => 'The landing where the boats come in, and fish drying on racks in the wind' },
      { id: 'F6', needs: ['coast'], when: (h) => h.coast, text: () => 'Boats on the beach, nets hung on poles, and fish laid out to dry' },
      { id: 'F5', needs: ['coast'], when: (h) => h.coast, text: () => 'A landing on the shore, boats hauled up, nets spread to mend' },
    ],
    inland: [
      { id: 'F0', needs: ['coast'], when: (h) => h.coast, text: () => 'Nets, drying racks, upturned boats, and the perpetual smell of salt and fish' },
      { id: 'Fi1', needs: ['river'], when: (h) => h.river, text: () => 'Boats pulled up on the riverbank, nets hung to dry' },
      { id: 'Fi2', needs: ['river'], when: (h) => h.river, text: () => 'Drying racks and upturned boats along the riverbank' },
      { id: 'Fi3', needs: ['river'], when: (h) => h.river, text: () => 'The landing where the river boats come in, nets spread to dry' },
      { id: 'Fi4', needs: ['river'], when: (h) => h.river, text: () => 'Nets, drying racks and the smell of fish by the river' },
      { id: 'Fi5', needs: ['river'], when: (h) => h.river, text: () => "Fish traps and nets at the river's edge, the boats drawn up beside them" },
      { id: 'Fi7', needs: ['river'], when: (h) => h.river, text: () => 'A muddy landing on the river, boats tied up and nets on poles' },
      { id: 'Fi8', needs: ['river'], when: (h) => h.river, text: () => 'Boats and nets on the riverbank, and fish split and drying on racks' },
      { id: 'Fi9', needs: ['river'], when: (h) => h.river, text: () => 'Small boats on the bank, and nets drying beside them' },
      { id: 'Fi6', needs: [], when: (h) => !h.coast && !h.river, text: () => "Nets, drying racks and boats drawn up at the water's edge" },
    ],
  },
  'Alehouse & Common': {
    branchOf: (h) => (h.alehouse ? 'alehouse' : 'inn'),
    alehouse: [
      { id: 'H0', needs: ['institution: tavern (an alehouse)'], when: (h) => h.alehouse, text: () => 'The alehouse and a scrap of common ground: the social heart of the settlement' },
      { id: 'H1', needs: ['institution: tavern'], when: (h) => h.alehouse, text: (h) => `The alehouse and the common beside it, where the ${h.tierNoun} meets` },
      { id: 'H2', needs: ['institution: tavern', 'ATOM? common grazing'], when: (h) => h.alehouse && h.grazing, text: () => 'The alehouse, the common, and the grazing beyond' },
      { id: 'H3', needs: ['institution: tavern'], when: (h) => h.alehouse, text: (h) => `A patch of common ground, and the alehouse where the ${h.tierNoun} gathers of an evening` },
      { id: 'H4', needs: ['institution: tavern', 'ATOM? common grazing'], when: (h) => h.alehouse && h.grazing, text: () => 'The alehouse at the centre, and the common where the animals graze' },
      { id: 'H6', needs: ['institution: tavern'], when: (h) => h.alehouse, text: () => 'The alehouse, and the trodden common in front of it' },
      { id: 'H7', needs: ['institution: tavern', 'ATOM? common grazing'], when: (h) => h.alehouse && h.grazing, text: (h) => `The common grazing and the alehouse beside it, the ${h.tierNoun}'s one meeting place` },
      { id: 'H5', needs: ['institution: tavern'], when: (h) => h.alehouse, text: (h) => `Where the ${h.tierNoun} meets: the alehouse and the common` },
    ],
    inn: [
      { id: 'H0', needs: ['institution: tavern (an alehouse)'], when: (h) => h.alehouse, text: () => 'The alehouse and a scrap of common ground: the social heart of the settlement' },
      { id: 'I1', needs: ['institution: tavern (the wayside inn)'], when: (h) => h.inn, text: (h) => `The wayside inn and a scrap of common ground, where the ${h.tierNoun} meets travellers` },
      { id: 'I2', needs: ['institution: tavern'], when: (h) => h.inn, text: () => 'The wayside inn on the road, and the common beside it' },
      { id: 'I3', needs: ['institution: tavern'], when: (h) => h.inn, text: (h) => `The common, and the wayside inn where the ${h.tierNoun} hears the news from the road` },
      { id: 'I4', needs: ['institution: tavern', 'ATOM? common grazing'], when: (h) => h.inn && h.grazing, text: () => 'The wayside inn, and the common grazing behind it' },
    ],
  },
  'Roadside Shrine': {
    branchOf: () => 'shrine',
    shrine: [
      { id: 'P0', needs: ['institution: temple (a shrine)'], when: () => true, text: () => 'A simple marker or cairn where travellers leave offerings' },
      { id: 'P1', needs: ['institution: temple'], when: () => true, text: (h) => `A wayside shrine at the edge of the ${h.tierNoun}, where passers-by stop` },
      { id: 'P2', needs: ['institution: temple'], when: () => true, text: () => 'A simple shrine by the path, small offerings left at its foot' },
      { id: 'P3', needs: ['institution: temple'], when: () => true, text: () => 'A cairn and a shrine, kept clean by the households nearby' },
    ],
  },
  'Wealthy Residential': {
    branchOf: () => 'wealth',
    wealth: [
      { id: 'L0', needs: [], when: () => true, text: () => 'Stone townhouses, private gardens, clean streets' },
      { id: 'L1', needs: ['ATOM? the house named'], when: (h) => items(h, WEALTH_ALSO).length > 0, text: (h, some) => `Stone townhouses and walled gardens near ${series(some(items(h, WEALTH_ALSO), 1, 'l'))}` },
      { id: 'L2', needs: ['ATOM? merchant guild', 'ATOM? the house named'], when: (h) => h.merchants && items(h, WEALTH_ALSO).length > 1, text: (h, some) => `The merchant families' townhouses, with ${series(some(items(h, WEALTH_ALSO), 1, 'l2'))} close by` },
      { id: 'L3', needs: ['ATOM? the house named'], when: (h) => items(h, WEALTH_ALSO).length > 0, text: (h, some) => `Stone houses behind garden walls, and ${series(some(items(h, WEALTH_ALSO), 1, 'l3'))}` },
      { id: 'L4', needs: ['ATOM? the houses named'], when: (h) => items(h, WEALTH_ALSO).length > 1, text: (h, some) => `Townhouses of stone, ${series(some(items(h, WEALTH_ALSO), 2, 'l'))} a short walk away` },
      { id: 'L5', needs: ['ATOM? the house named'], when: (h) => items(h, WEALTH_ALSO).length > 0, text: (h, some) => `Stone townhouses on the high ground, with ${series(some(items(h, WEALTH_ALSO), 1, 'l5'))} close by` },
      { id: 'L7', needs: ['ATOM? the houses named'], when: (h) => items(h, WEALTH_ALSO).length > 1, text: (h, some) => `Large stone houses with gardens behind them, close to ${series(some(items(h, WEALTH_ALSO), 2, 'l7'))}` },
      { id: 'L8', needs: ['ATOM? the house named'], when: (h) => items(h, WEALTH_ALSO).length > 0, text: (h, some) => `Clean streets of stone townhouses, and ${series(some(items(h, WEALTH_ALSO), 1, 'l8'))}` },
      { id: 'L9', needs: ['ATOM? the house named'], when: (h) => items(h, WEALTH_ALSO).length > 0, text: (h, some) => `Walled gardens and stone townhouses, a short way from ${series(some(items(h, WEALTH_ALSO), 1, 'l9'))}` },
      { id: 'L10', needs: ['ATOM? the houses named'], when: (h) => items(h, WEALTH_ALSO).length > 1, text: (h, some) => `The ${h.tierNoun}'s larger houses, in stone, near ${series(some(items(h, WEALTH_ALSO), 2, 'l10'))}` },
      { id: 'L6', needs: ['ATOM? the house named'], when: (h) => items(h, WEALTH_ALSO).length > 0, text: (h, some) => `The ${h.tierNoun}'s finest houses, and ${series(some(items(h, WEALTH_ALSO), 1, 'l6'))}` },
    ],
  },
  'Common Residential': {
    branchOf: () => 'common',
    common: [
      { id: 'C0', needs: [], when: () => true, text: () => 'Dense timber tenements, narrow streets, crowded' },
      { id: 'C1', needs: ['ATOM? the house named'], when: (h) => items(h, COMMON_ALSO).length > 0, text: (h, some) => `Crowded timber tenements and narrow streets, with ${series(some(items(h, COMMON_ALSO), 1, 'c'))}` },
      { id: 'C2', needs: ['ATOM? the houses named'], when: (h) => items(h, COMMON_ALSO).length > 1, text: (h, some) => `Tenements packed close along narrow streets; ${series(some(items(h, COMMON_ALSO), 2, 'c'))}` },
      { id: 'C3', needs: ['ATOM? the house named'], when: (h) => items(h, COMMON_ALSO).length > 0, text: (h, some) => `Where most of the ${h.tierNoun} lives: timber tenements, narrow streets, ${series(some(items(h, COMMON_ALSO), 1, 'c3'))}` },
      { id: 'C4', needs: ['ATOM? the house named'], when: (h) => items(h, COMMON_ALSO).length > 0, text: (h, some) => `Timber tenements, crowded yards, narrow streets, and ${series(some(items(h, COMMON_ALSO), 1, 'c4'))}` },
      { id: 'C6', needs: ['ATOM? the houses named'], when: (h) => items(h, COMMON_ALSO).length > 1, text: (h, some) => `Crowded timber tenements, with ${series(some(items(h, COMMON_ALSO), 2, 'c6'))}` },
      { id: 'C7', needs: ['ATOM? the house named'], when: (h) => items(h, COMMON_ALSO).length > 0, text: (h, some) => `Narrow streets, timber houses packed close, and ${series(some(items(h, COMMON_ALSO), 1, 'c7'))}` },
      { id: 'C8', needs: ['ATOM? the houses named'], when: (h) => items(h, COMMON_ALSO).length > 1, text: (h, some) => `Tenements of timber, crowded and close; ${series(some(items(h, COMMON_ALSO), 2, 'c8'))}` },
      { id: 'C5', needs: ['ATOM? the house named'], when: (h) => items(h, COMMON_ALSO).length > 0, text: (h, some) => `Narrow streets of crowded tenements, and ${series(some(items(h, COMMON_ALSO), 1, 'c5'))}` },
    ],
  },
};
