// PEOPLE-2 seat M6 (2026-11-20): THE SECOND TRANCHE, as data (LINES-power-tranche2.md §D is this file, line for line).
// Nothing here is in src/. Index 0 of every pool is today's exact line, always eligible (the verdict: "TODAY'S INDEX 0 STAYS
// ELIGIBLE EVERYWHERE"), and is never listed. A coda pool here is APPENDED to the first tranche's pool of the same id as ruled
// (m6-pools.mjs), so its wordings are numbered after the ruled ones; `noblesAhead` is new. An opening pool is keyed by the
// line's exact text, as M4's DESC_POOLS are.
// Every wording: the vocabulary atoms it NEEDS (src/domain/facts/factVocabulary.js spelling; only atoms M4's pools already
// declare; `temple` is not used), what it EXCLUDES, its vantage (the style law, WIRING-RULINGS §8) and why it is true of THIS place. The verdict's
// item 1 binds each: no feeling and no scheme its branch does not compute; a coda ends at the fact. Item 5: no wording needs a
// hideable house or a fact about crime (m6-houses.mjs checks every house atom).
// Coda templates: $1 is the coda's own capture (bodiesMinds: the force word the coda already prints: garrison, watch,
// militia, hired company). A sentence's first "the" is raised by the writer's own `opening`.

/** @typedef {{ text: string, needs?: string[], excludes?: string[], vantage: string, why: string }} Variant */

const LOCAL_MERCHANTS = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
const LANDED_OUTPACED = 'Landed families increasingly outpaced by merchant capital; they compete for council seats, marriage alliances, and royal appointments to maintain relevance.';
const NOBLE_COMPETITIVE = 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.';
const GMO_SEAT = 'The richest merchant houses of the metropolis sit as its senate, so the houses that control the trade also make the law.';

/** @type {Record<string, Variant[]>} */
export const DESC_POOLS_2 = {
  // claimStanding.js :: LOCAL_MERCHANTS, through merchantRung: a merchant claim its Minor label denies, where a merchant power
  // governs or another merchant power stands at or above this one (so another leads the trade)
  [LOCAL_MERCHANTS]: [
    { text: 'Merchants whose trade is mostly local; a steady presence in civic life, though not the leading commercial voice.', vantage: 'the official', why: 'the line\'s own claim (local reach; not the leading merchant power: merchantRung\'s condition)' },
    { text: 'Local traders with a steady civic presence; the larger commercial voice here belongs to others.', vantage: 'the local', why: 'the line\'s own claim; merchantRung prints it only where a merchant seat or a stronger merchant power stands' },
    { text: 'A merchant interest of local reach, regularly heard in civic affairs, but not the one that leads the trade.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'Merchants who trade mainly at the place\'s own market; present in civic life, but not the strongest merchant voice.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market (market.js): their local reach named by it' },
    { text: 'In a place this large these are merchants of local reach: a steady civic presence, but not the dominant commercial voice.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place (populationBand.js)' },
    { text: 'Merchants of local reach in what the place sends out and brings in; present in civic life, while others lead the trade.', needs: ['exports', 'imports'], vantage: 'the trade', why: 'the place has an export and an import list (canonExports, canonImports); the goods unnamed' },
    { text: 'Traders with local reach and a steady place in civic life; the leading merchant voice here is another\'s.', vantage: 'the newcomer', why: 'the line\'s own claim' },
  ],
  // rulingStructure.js :: generatePowerStructure, nobleDesc: the merchant-aligned seat (Merchant oligarchy, Democratic assembly,
  // Guild Council, Merchant Guild Council), the economy not very high, the nobles not governing with a noble house
  [LANDED_OUTPACED]: [
    { text: 'Landed families outpaced by merchant capital; they keep their land and titles, but money carries more weight here.', vantage: 'the official', why: 'the line\'s own claim (outpaced by merchant capital), its schemes struck' },
    { text: 'Old landed families in a place where merchant capital counts for more than land.', vantage: 'the newcomer', why: 'the line\'s own claim' },
    { text: 'The landed families keep their estates and their names, but merchant capital has outpaced them.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'The landed families\' wealth is in land, and here merchant capital has outpaced it.', vantage: 'the trade', why: 'the line\'s own claim' },
    { text: 'Landed families outpaced by merchant capital; the market, not the estate, is where the money is.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'Landed families outpaced by the merchants who handle what the place sends out.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list; the goods unnamed' },
    { text: 'In a place this large, the old landed families are outpaced by merchant capital, though they keep their titles.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
  ],
  // rulingStructure.js :: generatePowerStructure, nobleDesc at a city, noble power 11-20 (no merchant-aligned seat, no royal
  // seat, military not very high); and claimStanding.js :: nobleMinorRung, a noble claim at Minor above a town where a merchant
  // power stands beside
  [NOBLE_COMPETITIVE]: [
    { text: 'Noble families holding hereditary land rights and old privileges; they take part in civic politics and hold their own against merchant capital.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'Families of hereditary land and traditional privilege, active in the place\'s politics and a match for merchant capital.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'The noble families hold their land by inheritance and keep their traditional privileges; in civic politics they compete on even terms with merchant money.', vantage: 'the official', why: 'the line\'s own claim (competitive with merchant capital)' },
    { text: 'Hereditary landholders with traditional privileges; active in civic politics, and competitive there with the merchants\' money.', vantage: 'the newcomer', why: 'the line\'s own claim' },
    { text: 'In a place this large, the noble families\' hereditary land and privileges give them a voice in civic politics alongside merchant capital.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
    { text: 'Noble families with hereditary rights to land and old privileges; active in politics here, and competitive with the merchants of the market.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'Old noble families, hereditary landholders with traditional privileges; active in civic politics, and a counterweight to merchant capital.', vantage: 'the official', why: 'the line\'s own claim' },
  ],
  // rulingStructure.js :: generatePowerStructure, govDescByLabel['Grand Merchant Oligarchy'] (the metropolis's merchant oligarchy;
  // the seat's one office: the senate makes the law)
  [GMO_SEAT]: [
    { text: 'The metropolis is governed by a senate of its richest merchant houses; those who control its trade also make its law.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: 'Here the law is made by the same merchant houses that control the trade, sitting together as the senate.', vantage: 'the local', why: 'the seat\'s own claim' },
    { text: 'A senate of the richest merchant houses governs the metropolis, so trade and law are in the same hands.', vantage: 'the newcomer', why: 'the seat\'s own claim' },
    { text: 'The merchant houses that run the market also sit as the senate and make the metropolis\'s law.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'The houses that handle what the metropolis sends out also sit as its senate and make its law.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list; the goods unnamed' },
    { text: 'The senate of the richest merchant houses makes the law here, and the court judges by it.', needs: ['court sits'], vantage: 'the official', why: 'a court sits (courtHoldersOf): the judging is the court\'s, the law the senate\'s (one office each)' },
    { text: 'The merchant houses whose cargoes cross the docks also sit as the senate, and make the law.', needs: ['docks'], vantage: 'the traveller', why: 'docks stand (institutions.js docks): the houses\' trade read from them' },
  ],
};

/** @type {Record<string, Variant[]>} */
export const CODA_POOLS_2 = {
  // factionStanding.js :: annotateFactionStanding, the faith's card: an arcane power on the roster at or below the faith
  // (26 of 204 sample cards stand LEVEL, so no wording says "less")
  arcaneInShadow: [
    { text: 'The arcane orders are here too, but carry no more weight than the clergy.', vantage: 'the official', why: 'the coda\'s computed fact: the arcane power at or below the faith' },
    { text: 'The arcane orders do not outweigh the clergy here.', vantage: 'the local', why: 'the coda\'s computed fact' },
    { text: 'The arcane orders have their place here, but it is not above the clergy\'s.', vantage: 'the newcomer', why: 'the coda\'s computed fact' },
    { text: 'The church carries at least as much weight here as the arcane orders do.', needs: ['church'], vantage: 'the local', why: 'a church stands (faithReading hasChurch); the computed fact' },
    { text: 'The arcane orders are heard here, but no more than the clergy are.', vantage: 'the local', why: 'the coda\'s computed fact' },
    { text: 'In a place this large there is room for both the clergy and the arcane orders, and the arcane orders do not stand above the clergy.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place; the computed fact' },
    { text: 'The clergy hold their standing here; the arcane orders, though present, do not stand above them.', vantage: 'the official', why: 'the coda\'s computed fact' },
    { text: 'With a church and a monastery here, the faith stands no lower than the arcane orders.', needs: ['church', 'institution: monastery'], vantage: 'the traveller', why: 'a church and a monastery or friary stand; the computed fact' },
    { text: 'The arcane orders are part of the place, but not ahead of the clergy, and which magic the faith allows is an open question.', vantage: 'the official', why: 'the computed fact, and today\'s own open question (the chair kept it in wording 1), with no "deliberately"' },
  ],
  // the force's card (a guard or military power): the faith within 10 of it ($1: the force word the coda prints)
  bodiesMinds: [
    { text: 'The $1 keeps the peace in the streets, and the clergy keep it in people\'s consciences.', vantage: 'the local', why: 'the coda\'s own fact: who keeps order, and how' },
    { text: 'Order here is kept two ways: by the $1 with force, and by the clergy with teaching.', vantage: 'the official', why: 'the coda\'s own fact' },
    { text: 'The $1 and the clergy stand close in weight here, and both keep people in line: the one by arrest, the other from the pulpit.', vantage: 'the official', why: 'the computed fact (within 10 of each other) and the coda\'s own' },
    { text: 'The $1 answers for people\'s conduct in the streets, and the clergy for their conduct before the faith.', vantage: 'the watch', why: 'the coda\'s own fact' },
    { text: 'Inside the walls the $1 keeps order by force, and the clergy keep it by conscience.', needs: ['walls'], vantage: 'the watch', why: 'the place has walls (defence.js)' },
    { text: 'The $1 brings lawbreakers to the court, and the clergy speak to people\'s consciences; both keep people in line.', needs: ['court sits'], vantage: 'the official', why: 'a court sits (courtHoldersOf)' },
    { text: 'In a place this large it takes both: the $1 to keep order by force, and the clergy to keep it by teaching.', needs: ['population: large'], vantage: 'the local', why: 'a large place' },
    { text: 'People here are kept in line by the $1 in the streets and by the clergy at the church.', needs: ['church'], vantage: 'the local', why: 'a church stands' },
    { text: 'The $1 keeps order at the market and in the streets, and the clergy keep it in people\'s consciences.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ],
  // the nobles' card: the first merchant power at or below them (12 of 61 sample cards LEVEL, so no wording says "ahead")
  noblesAhead: [
    { text: 'For all the merchants\' money, the noble families have not been overtaken here.', vantage: 'the local', why: 'the coda\'s computed fact: the merchants at or below the nobles' },
    { text: 'The merchants have not overtaken the noble families in influence here.', vantage: 'the official', why: 'the computed fact' },
    { text: 'Land and title count here for no less than trade: the noble families stand level with the merchants or ahead of them.', vantage: 'the official', why: 'the computed fact, said whole' },
    { text: 'The noble families are at least the merchants\' equal in influence here.', vantage: 'the newcomer', why: 'the computed fact' },
    { text: 'The merchants trade at the market, but the noble families have no less say than they do.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'The merchants handle what the place sends out, but the noble families have no less say than they do.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list; the goods unnamed' },
    { text: 'The noble families hold land and title here, and in influence the merchants have not passed them.', vantage: 'the local', why: 'the computed fact' },
    { text: 'Well off as the place is, the merchants have not overtaken the noble families in influence.', needs: ['prosperity: ≥ comfortable'], vantage: 'the trade', why: 'Comfortable or better (prosperityRank.js)' },
  ],
  // the third power (rank 2): within 5 of the powers above and below it (not three level), or more than 10 below the second
  atTable: [
    { text: 'They have a voice in every decision, but not the deciding one.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'They take part in every bargain struck here, on terms that others set.', vantage: 'the trade', why: 'the coda\'s own claim' },
    { text: 'They are always in the room when the place\'s business is settled, but the terms are others\'.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'They are consulted on everything that matters, and settle none of it on their own terms.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'Third in weight here, they are always heard, but the terms are set by others.', vantage: 'the newcomer', why: 'the coda\'s own claim; rank 2 is the third place' },
    { text: 'At the market and in public business alike they are always heard, but others set the terms.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'In a place this large they are one of the voices always heard, but not one that sets the terms.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
    { text: 'Every bargain here includes them, and none is struck on their terms alone.', vantage: 'the local', why: 'the coda\'s own claim' },
  ],
  // the arcane power's card: the faith above it
  clergyAhead: [
    { text: 'The clergy have more say in public affairs than the arcane orders do.', vantage: 'the official', why: 'the coda\'s computed fact: the faith above the arcane power' },
    { text: 'In public matters the clergy come first here, and the arcane orders second.', vantage: 'the local', why: 'the computed fact, of the two' },
    { text: 'The arcane orders stand behind the clergy in public affairs.', vantage: 'the official', why: 'the computed fact' },
    { text: 'Ask whose word counts for more in public affairs, the clergy\'s or the arcane orders\', and here it is the clergy\'s.', vantage: 'the traveller', why: 'the computed fact' },
    { text: 'The church has more say in public affairs here than the arcane orders.', needs: ['church'], vantage: 'the local', why: 'a church stands' },
    { text: 'In a place this large the arcane orders have their place, but the clergy have more say in public affairs.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
    { text: 'In public affairs here, the clergy\'s word carries further than the arcane orders\'.', vantage: 'the official', why: 'the computed fact' },
    { text: 'The clergy outweigh the arcane orders in public affairs here.', vantage: 'the official', why: 'the computed fact' },
  ],
  // the merchants' card: the craft guild 8 or more below them, or a weak (Minor or Suppressed) guild at or below them
  outpaced: [
    { text: 'The craft guilds are here, but outpaced: the merchants set the prices.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'Prices here are the merchants\' to set; the craft guilds are present, but behind.', vantage: 'the trade', why: 'the coda\'s own claim' },
    { text: 'The craft guilds have a say, but the merchants have the larger one, and the prices are theirs to set.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'What the workshops make, the merchants price; the craft guilds are present but outpaced.', vantage: 'the trade', why: 'the coda\'s own claim' },
    { text: 'The market\'s prices are the merchants\' to set; the craft guilds are present, but outpaced.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'The guilds of the trades are present, but outpaced; the merchants set the prices.', needs: ['guild'], vantage: 'the official', why: 'a guild stands (guild.js)' },
    { text: 'What the place sends out is priced by the merchants; the craft guilds are present but outpaced.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list; the goods unnamed' },
    { text: 'In a place this large the merchants set the prices, and the craft guilds, though present, are outpaced.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
  ],
};
