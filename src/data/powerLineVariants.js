/**
 * data/powerLineVariants.js — THE POWERS' LINES, VOICED (PEOPLE-2 builder B2, 2026-11-20; the chair's verdict of 17:21 UTC on
 * PEOPLE-1 seat M4's proposals, `docs/chair/2026-11-20/content/people/PROPOSAL-factions-desc.md` and
 * `PROPOSAL-factionRelationships-narrative.md`, their wordings as data in `measures/m4-pools.mjs`, the verdict applied as
 * PEOPLE-2 seat M6 measured it, `measures/m6-pools.mjs`).
 *
 * Two printed fields of the power structure repeat by the sentence across places of a size: a power's description
 * (`powerStructure.factions[].desc`: an OPENING, the line its ladder chose, then the standing CODAS
 * `power/factionStanding.js :: annotateFactionStanding` appends) and the tie between two powers
 * (`powerStructure.factionRelationships[].narrative`). Each pooled line keeps TODAY'S EXACT TEXT as the head of its list
 * (canonical-at-zero; it is not stored as a row here) and gains the wordings below, each `{ text, needs, excludes }` (the
 * house's declared-line shape, read by `factVocabulary.js :: declarationOf`): the same claim from another vantage, or a
 * house the record holds.
 *
 * THE ONE PASS (`voicePowerLines`), called once on the FINAL record (`generateSettlementPipeline.js`, after
 * `withConflictRelations`), where every writer of both fields has run (`settleClergyToFinalRoster`,
 * `settleArcaneToPractitioners`, the conflict twins) and the facts are final:
 *   - a description that OPENS with a pooled line has its opening picked; then every pooled coda in it is picked where
 *     it stands; the rest of the description is kept byte for byte;
 *   - a relation row whose narrative is a pooled branch's untouched line has its narrative picked. A conflict twin, the
 *     occupier's line and the capture rows are not pooled and are never touched;
 *   - THE PICK is `kernel/proseHash.js :: pickVariantMixed` over `[today's line, ...the eligible wordings]`, keyed
 *     `<record _seed>::powerStructure.factions.desc::<power>` (`…::<coda id>` for a coda) and
 *     `<record _seed>::powerStructure.factionRelationships.narrative::<the pair, sorted, joined by ||>`. Zero PRNG draws.
 *     A wording is eligible where the record admits its declaration (`declarationAdmits` over `factsOf(record)`), and the
 *     pick is handed to `domain/facts/drawDeclared.js :: drawDeclared`, which admits it and notes it in the presumption
 *     ledger. Where no new wording is eligible the line is returned as it came, byte for byte;
 *   - TODAY'S LINE STAYS ELIGIBLE EVERYWHERE (the owner: a calm town should be as it currently is), with the chair's
 *     exceptions, where truth outranks canonical-at-zero: the village priest's line NEEDS its priest (`todayNeeds`, 17:21);
 *     the closingGap coda's line is eligible nowhere (`today: 'never'`, 18:14 F1: the merchants stand ABOVE the nobles
 *     where it prints); the arcaneInShadow and noblesAhead codas' lines EXCLUDE a tie (`today: 'excludesLevel'`, F3), as do
 *     the rows marked `excludesLevel`. The tie is the standing branch's own computed `level`, handed to the pass by its
 *     caller (`power/factionStanding.js :: standingLevelOf`) as an eligibility flag, not a vocabulary atom;
 *   - a FALSY `_seed` picks index 0 of the eligible list: today's line where it is eligible (no byte moves), else the
 *     first eligible wording (18:14: "a seedless record takes the first eligible"). Where nothing new is eligible the line
 *     is returned as it came.
 *
 * THE VERDICT'S STRIKES, as built: no wording carries a feeling or a scheme its branch does not compute. The arcane
 * advisory wordings lose "quietly resented"; MR.dep's end "Each needs the other."; MR.tense 4 loses "and {M} resent it";
 * bodiesMinds 1 to 3 end at the fact; arcaneInShadow 2 and 3 lose "on purpose" and "by choice". LEFT OUT (the builder
 * brief's test 3 bars their words in any new wording): MR.dep 7 ("both know it"), worthBuying 1 ("worth having") and 2
 * ("know it"). STRUCK by the chair at 18:14: clergyAhead 2, the second tranche's LOCAL_MERCHANTS 6; closingGap's ruled 1
 * and 2 withdrawn for the chair's seven. Each such row is named where it would stand. THE SECOND TRANCHE (PEOPLE-2 seat
 * M6, `LINES-power-tranche2.md` §D) is built with the chair's changes of 18:14.
 *
 * THE WALKER'S DECLARATIONS (the presumption walker, `tests/lint/presumedThings.shared.mjs`, arm 1): beside the needs the
 * proposals wrote, a wording that names the clergy also NEEDS `church` (`registeredWords.js :: clergy`), and one that names
 * the streets `tier: ≥ village` (`streets`). Both only narrow where a wording may print. A wording that names the headman,
 * the reeve, the practitioners or the craft guilds (as today's line it varies does) has no atom to declare it: the
 * vocabulary's own `house: …` and `practitioner` words wait for a reader.
 *
 * THE HIDEABLE RULE (the verdict's item 5): no wording needs a house `domain/people/cardVeil.js :: isHideableHouse` marks,
 * nor a fact about crime.
 *
 * Pure apart from the one record it is handed (it writes the two fields in place); no randomness, no clock.
 * @enforced-by tests/generators/power/powerLinesVoiced.test.js
 */
import { pickVariantMixed } from '../kernel/proseHash.js';
import { drawDeclared, lineText } from '../domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../domain/facts/factVocabulary.js';
import { factsOf } from '../domain/facts/factsOf.js';
import { powerNameAfterArticle, powerNameWithArticle, powerPossessive } from './people/powerSentenceName.js';
import { pluralPowerName } from '../domain/display/pluralPowerName.js';

/** @typedef {{ id: string, text: string, needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string>, excludesLevel?: boolean }} PowerLineRow */

/**
 * THE OPENINGS: keyed by today's exact line (the line a description OPENS with), each with its pool's id and its new
 * wordings. `todayNeeds` declares today's line itself (the verdict's one exception). The ladders that write them:
 * `power/rulingStructure.js :: generatePowerStructure` (the seats, `powerSiblings.js`; the other powers' ladders),
 * `power/claimStanding.js` (`SEAT_UNDER_CRISIS`, `CLAIM_RUNGS`, `SEAT_WORDS`), `density/applyDensityLaw.js :: rivalDescOf`.
 * @type {Readonly<Record<string, { id: string, todayNeeds?: ReadonlyArray<string>, rows: ReadonlyArray<PowerLineRow> }>>}
 */
export const DESC_POOLS = deepFreeze({
  'The oldest heads of the community decide things together; people follow them out of respect and custom, not law.': { id: 'elders', rows: [
    { id: 'elders.1', text: 'Disputes here go to the oldest heads of the households, who settle them together; people abide by what they decide out of respect, not because any law says so.' },
    { id: 'elders.2', text: 'There is no written law here; the oldest heads of the community decide things together, and people go along with them out of respect and custom.', excludes: ['court sits', 'legal house'] },
    { id: 'elders.3', text: 'In a place this small, the oldest heads of the community decide things together, and everyone knows them well enough to follow them out of respect and custom.', needs: ['population: small'] },
    { id: 'elders.4', text: 'The oldest heads of the community decide things together, large and small; people follow them by custom and out of respect, not by law.' },
    { id: 'elders.5', text: 'The oldest heads of the community decide things together, from what the place sends out to how a quarrel is settled; people follow them out of respect and custom, not law.', needs: ['exports'] },
  ] },
  'The oldest heads of the community still decide things together, but fewer and fewer people accept their word.': { id: 'eldersCrisis', rows: [
    { id: 'eldersCrisis.1', text: 'The elders still meet and decide, but more and more households go their own way regardless.' },
    { id: 'eldersCrisis.2', text: 'The oldest heads of the community still speak for it, but their word no longer settles things the way it did.' },
    { id: 'eldersCrisis.3', text: 'In a place this small, everyone can see that fewer people now heed the elders, though the elders still decide things together.', needs: ['population: small'] },
    { id: 'eldersCrisis.4', text: 'Decisions are still made by the oldest heads of the community together; fewer people than before accept them.' },
  ] },
  'Settlement governed by heads of household; decisions by informal consensus among property owners.': { id: 'householdCouncil', rows: [
    { id: 'householdCouncil.1', text: 'The heads of the households decide things between them, and nothing is settled until they agree.' },
    { id: 'householdCouncil.2', text: 'Each household with property here has its head at the table, and decisions are made when they all agree.' },
    { id: 'householdCouncil.3', text: 'In a place this small the heads of the households simply talk things through until they agree; that is all the government there is.', needs: ['population: small'] },
    { id: 'householdCouncil.4', text: 'No one rules alone here: the heads of the households decide together, by agreement among those who own property.' },
  ] },
  'A headman settles disputes and speaks for the community.': { id: 'headman', rows: [
    { id: 'headman.1', text: 'Disputes are brought to the headman, and when the community must speak to outsiders, the headman speaks for it.' },
    { id: 'headman.2', text: 'People here take their quarrels to the headman, who also speaks for the community beyond it.' },
    { id: 'headman.3', text: 'The headman\'s word settles disputes here, and it is the headman who answers for the community to anyone from outside.' },
    { id: 'headman.4', text: 'In a place this small one person, the headman, settles the quarrels and speaks for everyone.', needs: ['population: small'] },
  ] },
  'The elders of the hamlet decide things together, and none of them rules alone.': { id: 'hamletElders', rows: [
    { id: 'hamletElders.1', text: 'No single elder rules here; the elders of the hamlet decide things together.' },
    { id: 'hamletElders.2', text: 'The hamlet\'s elders decide together, and none of them can settle anything alone.' },
  ] },
  'One of the peasantry, elected by the rest, manages labour and mediates disputes, and answers to the people who chose them.': { id: 'reeve', rows: [
    { id: 'reeve.1', text: 'The reeve is one of the villagers, chosen by the rest; the reeve sees the work done and settles disputes, and answers to those who chose them.' },
    { id: 'reeve.2', text: 'The villagers elect one of their own as reeve, to manage the common work and mediate quarrels; the reeve answers to them.' },
  ] },
  'The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.': { id: 'villagePriest', todayNeeds: ['priest'], rows: [
    { id: 'villagePriest.1', text: 'People here look to the church for guidance on worldly matters as well as faith; at this scale its moral authority is practical influence too.', needs: ['church'] },
    { id: 'villagePriest.2', text: 'The church is where the most learned people in the place are found, and at this scale what it says carries into everything else.', needs: ['church'] },
    { id: 'villagePriest.3', text: 'In a place this small the faith\'s moral authority and its practical influence are one and the same.', needs: ['population: small'] },
    { id: 'villagePriest.4', text: 'The faith\'s moral authority here is practical influence too; people ask its advice on far more than prayer.' },
    { id: 'villagePriest.5', text: 'A newcomer soon finds that the faith\'s word counts here in practical matters as much as in prayer.' },
    { id: 'villagePriest.6', text: 'Where there is little to go round, the faith\'s help and counsel count for a great deal, and its moral authority is practical influence too.', needs: ['prosperity: ≤ poor'] },
  ] },
  'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.': { id: 'arcaneAdvisory', rows: [
    { id: 'arcaneAdvisory.1', text: 'Those who work magic here are hired and consulted, never given office; their say comes through their fees.' },
    { id: 'arcaneAdvisory.2', text: 'No office here belongs to a mage; the practitioners are consulted when needed and paid for it.' },
    { id: 'arcaneAdvisory.3', text: 'Magical practitioners sell their services here and are asked their opinion, but hold no office; what influence they have is advisory and transactional.' },
    { id: 'arcaneAdvisory.4', text: 'People go to the practitioners for what only magic can do and pay their price, but give them no say beyond it.' },
    { id: 'arcaneAdvisory.5', text: 'Magic is bought here like any skilled work, and the practitioners\' influence goes no further than their customers allow.' },
    { id: 'arcaneAdvisory.6', text: 'The council consults the mages when it needs them but gives them no seat; their influence is advisory and paid for.', needs: ['ruling body'] },
    { id: 'arcaneAdvisory.7', text: 'In a place this large there is steady work for magical practitioners, but no office; their influence is advisory and paid for.', needs: ['population: large'] },
    { id: 'arcaneAdvisory.8', text: 'There is money enough here to keep magical practitioners in work, though not in office; their influence is advisory and transactional.', needs: ['prosperity: ≥ comfortable'] },
  ] },
  'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.': { id: 'clergyMargins', rows: [
    { id: 'clergyMargins.1', text: 'The clergy are respected in their own sphere, but in the business of governing they count for little.', needs: ['church'] },
    { id: 'clergyMargins.2', text: 'People go to the clergy for their souls and to others for everything else; their moral authority is real, but their political leverage is limited.', needs: ['church'] },
    { id: 'clergyMargins.3', text: 'The clergy keep the church and the people\'s faith, but have little say in how the place is run.', needs: ['church'] },
    { id: 'clergyMargins.4', text: 'The clergy\'s word counts for more in church than in council; their moral authority is real, but their political leverage is limited.', needs: ['church', 'ruling body'] },
    { id: 'clergyMargins.5', text: 'Clergy and monks are part of daily life here, but stand at the edge of its politics; their moral authority is real, their leverage limited.', needs: ['institution: monastery', 'church'] },
    { id: 'clergyMargins.6', text: 'In a place this large the clergy are one voice among many, respected but seldom decisive.', needs: ['population: large', 'church'] },
    { id: 'clergyMargins.7', text: 'The court, not the clergy, settles the place\'s disputes; the clergy\'s authority is moral, and their political leverage limited.', needs: ['court sits', 'church'] },
    { id: 'clergyMargins.8', text: 'The clergy have the people\'s respect but little of the hall\'s ear; their political leverage is limited.', needs: ['church'] },
    { id: 'clergyMargins.9', text: 'The clergy are heard on matters of conscience, not on matters of trade or tax; their political leverage is limited.', needs: ['church'] },
  ] },
  'The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops.': { id: 'tradesMargins', rows: [
    { id: 'tradesMargins.1', text: 'The craft masters set their own standards and take on their own apprentices, but outside the workshops few listen to them.' },
    { id: 'tradesMargins.2', text: 'Each trade here looks after its own work and its own apprentices, and little beyond it.' },
    { id: 'tradesMargins.3', text: 'The trades govern their own workshops and apprenticeships and little else; on wider matters they are seldom heard.' },
    { id: 'tradesMargins.4', text: 'The guilds of the trades keep their own rules on work and apprentices; beyond that, their say is small.', needs: ['guild'] },
    { id: 'tradesMargins.5', text: 'What the trades make is sold at the market on others\' terms; inside the workshops they set the standards, outside them they carry little weight.', needs: ['market'] },
  ] },
  'Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.': { id: 'craftSecondary', rows: [
    { id: 'craftSecondary.1', text: 'The craft guilds set the rules for their own work and apprentices, and are a steady second voice in the place\'s affairs.' },
    { id: 'craftSecondary.2', text: 'Craft masters regulate their own trades and train their own apprentices, and are reliably heard, if seldom first, in civic life.' },
    { id: 'craftSecondary.3', text: 'Anyone who wants to learn a trade here goes through the craft guilds, which also hold a steady, secondary place in civic life.' },
    { id: 'craftSecondary.4', text: 'The craft guilds control what is made for the market and who may learn to make it; in civic matters they are a reliable second voice.', needs: ['market'] },
  ] },
  'Church institutions are well-embedded in civic life; their opinion on appointments, taxation, and law is sought and usually influential.': { id: 'churchEmbedded', rows: [
    { id: 'churchEmbedded.1', text: 'Few appointments, taxes or laws are settled here without first hearing the church, and its view usually carries.', needs: ['church'] },
    { id: 'churchEmbedded.2', text: 'The church is woven into civic life here; on appointments, taxes and the law its opinion is asked for and usually heeded.', needs: ['church'] },
    { id: 'churchEmbedded.3', text: 'The council asks the church\'s view on appointments, taxes and law, and usually follows it.', needs: ['church', 'ruling body'] },
    { id: 'churchEmbedded.4', text: 'Anyone seeking an office or a change in the law here soon learns to ask the church first; its opinion is usually influential.', needs: ['church'] },
    { id: 'churchEmbedded.5', text: 'The faith\'s opinion is sought on appointments, taxes and the law here, and it is usually heeded.' },
    { id: 'churchEmbedded.6', text: 'In a place this size the church is part of civic life, and its opinion on appointments, taxes and law is sought and usually followed.', needs: ['church', 'population: middling'] },
  ] },
  'Town watch; it enforces ordinances, manages disorder, and reports to the council.': { id: 'townWatch', rows: [
    { id: 'townWatch.1', text: 'The town watch keeps the ordinances and the peace, and answers to the council.', needs: ['watch', 'ruling body'] },
    { id: 'townWatch.2', text: 'The watch keeps the streets and the walls, enforces the ordinances and answers to those who govern.', needs: ['watch', 'walls', 'tier: ≥ village'] },
    { id: 'townWatch.3', text: 'The watch makes the arrests and brings them before the court, and answers to those who govern.', needs: ['watch', 'court sits'] },
    { id: 'townWatch.4', text: 'A paid watch enforces the ordinances and handles disorder, and answers to those who govern.', needs: ['watch', 'paid watch'] },
    { id: 'townWatch.5', text: 'The watch keeps order in the streets and at the market, enforces the ordinances, and answers to those who govern.', needs: ['watch', 'market', 'tier: ≥ village'] },
    { id: 'townWatch.6', text: 'The watch enforces the ordinances and deals with disorder, and answers to those who govern.', needs: ['watch'] },
    { id: 'townWatch.7', text: 'In a place this size the watch is the law most people meet: it enforces the ordinances, handles disorder and answers to those who govern.', needs: ['watch', 'population: middling'] },
  ] },
  'City watch; it answers for keeping order and is growing more sure of its own authority.': { id: 'cityWatchGrowing', rows: [
    { id: 'cityWatchGrowing.1', text: 'The city watch keeps order and knows it is needed, and it is growing more sure of its own authority.', needs: ['watch'] },
    { id: 'cityWatchGrowing.2', text: 'The watch that keeps the streets and the walls is growing more sure of its own authority.', needs: ['watch', 'walls', 'tier: ≥ village'] },
    { id: 'cityWatchGrowing.3', text: 'The watch brings lawbreakers in and the court deals with them; the watch is growing more sure of its own authority.', needs: ['watch', 'court sits'] },
    { id: 'cityWatchGrowing.4', text: 'Keeping order in a place this large falls to the watch, and it is growing more sure of its own authority.', needs: ['watch', 'population: large'] },
    { id: 'cityWatchGrowing.5', text: 'The watch answers for order in the streets, and is more sure of its own authority than it used to be.', needs: ['watch', 'tier: ≥ village'] },
    { id: 'cityWatchGrowing.6', text: 'Order inside the walls is the watch\'s to keep and the defence is the garrison\'s; the watch is growing more sure of its own authority.', needs: ['watch', 'walls', 'garrison'] },
  ] },
  'City watch; law enforcement and external defence, stretched between multiple responsibilities.': { id: 'cityWatchStretched', rows: [
    { id: 'cityWatchStretched.1', text: 'The city watch keeps the law in the streets and helps hold the walls, and is stretched between the two.', needs: ['watch', 'walls', 'tier: ≥ village'] },
    { id: 'cityWatchStretched.2', text: 'The watch keeps the law and shares the defence with the garrison, and is stretched between the two.', needs: ['watch', 'garrison'] },
    { id: 'cityWatchStretched.3', text: 'In a place this large the watch has the streets to police and the defence to see to, and is stretched between them.', needs: ['watch', 'population: large', 'tier: ≥ village'] },
    { id: 'cityWatchStretched.4', text: 'The watch arrests for the court and stands to the defence when needed, stretched between the two.', needs: ['watch', 'court sits'] },
  ] },
  'A second armed company that wants a share of keeping order here, and of the say that goes with it.': { id: 'secondCompany', rows: [
    { id: 'secondCompany.1', text: 'A second armed company; it wants a share of the policing here, and a voice to match.' },
    { id: 'secondCompany.2', text: 'A rival armed company that contests the established force\'s hold on keeping order here, and wants the say that goes with it.' },
    { id: 'secondCompany.3', text: 'In a place this large there is room for more than one armed company, and this one wants a share of keeping order and of the say that goes with it.', needs: ['population: large'] },
  ] },
  'A mayor runs the town\'s day-to-day business.': { id: 'mayor', rows: [
    { id: 'mayor.1', text: 'The town\'s daily business is the mayor\'s to run.' },
    { id: 'mayor.2', text: 'Anything that needs doing in the town goes to the mayor, who runs its day-to-day business.' },
    { id: 'mayor.3', text: 'The mayor runs the town\'s day-to-day business, from the market to the streets.', needs: ['market', 'tier: ≥ village'] },
    { id: 'mayor.4', text: 'The mayor sees to the town\'s day-to-day business; the hard cases go to the court.', needs: ['court sits'] },
  ] },
  'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.': { id: 'electedCouncil', rows: [
    { id: 'electedCouncil.1', text: 'The place is governed by its council, and its seats are sought by merchants, guild masters and the leading families.' },
    { id: 'electedCouncil.2', text: 'Seats on the council that governs here are prized, and merchants, guildsmen and the old families all compete for them.' },
    { id: 'electedCouncil.3', text: 'The council governs, and the guilds and the leading families both work to fill its seats.', needs: ['guild'] },
  ] },
  'The guilds govern together; the richer the guild, the more say it has.': { id: 'guildsGovern', rows: [
    { id: 'guildsGovern.1', text: 'The guilds govern together, and the richest of them have the most say.' },
    { id: 'guildsGovern.2', text: 'Government here is the guilds\' together; a guild\'s say rises with its wealth.' },
    { id: 'guildsGovern.3', text: 'The guilds that trade at the market also govern the place together, and the richer guilds speak loudest.', needs: ['market'] },
  ] },
  'A full council governs the city: aldermen, guild masters and appointed officials see to its taxes, its laws and its streets.': { id: 'fullCouncil', rows: [
    { id: 'fullCouncil.1', text: 'Taxes, laws and street repairs all come from the city council, a body of aldermen, guild masters and appointed officials.' },
    { id: 'fullCouncil.2', text: 'A full council of aldermen, guild masters and appointed officials governs the city; it sets the taxes and the laws, and the courts judge by them.', needs: ['court sits'] },
    { id: 'fullCouncil.3', text: 'The city council, aldermen, guild masters and officials together, keeps the taxes, the laws, the streets and the walls.', needs: ['walls', 'tier: ≥ village'] },
    { id: 'fullCouncil.4', text: 'The council of aldermen, guild masters and officials governs the city, from the taxes and laws down to the streets and the market.', needs: ['market', 'tier: ≥ village'] },
  ] },
  'A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; the council is always split into camps, and real power shifts between blocs.': { id: 'grandCouncil', rows: [
    { id: 'grandCouncil.1', text: 'The metropolis is governed by a grand council of officials, guild masters and appointed magnates, divided into camps; power moves between them.' },
    { id: 'grandCouncil.2', text: 'Senior officials, guild masters and appointed magnates sit together on the grand council that governs; its camps rarely agree, and the balance between them keeps shifting.' },
  ] },
  'A formal consortium of the metropolis\'s most powerful guild masters holds civic authority; membership in the consortium is itself a prize.': { id: 'grandConsortium', rows: [
    { id: 'grandConsortium.1', text: 'The most powerful guild masters govern together as a formal consortium, and a place in it is much sought after.' },
    { id: 'grandConsortium.2', text: 'Civic authority belongs to a consortium of the leading guild masters; to join it is the ambition of many a lesser guild.', needs: ['guild'] },
  ] },
  'Minor landed families with limited political reach; present in civic life but rarely decisive.': { id: 'minorLanded', rows: [
    { id: 'minorLanded.1', text: 'The landed families here are part of civic life, but their reach is limited and their voice rarely decides anything.' },
    { id: 'minorLanded.2', text: 'Old landed families of limited reach; they take part in civic affairs, but are seldom the ones who settle them.' },
    { id: 'minorLanded.3', text: 'Landed families of no great weight: present in civic life, rarely decisive in it.' },
    { id: 'minorLanded.4', text: 'In a place this large the old landed families are a minor voice; they take part in civic life but rarely decide it.', needs: ['population: large'] },
  ] },
  'Established merchant community; fund civic works and expect council access in return.': { id: 'merchantsCouncil', rows: [
    { id: 'merchantsCouncil.1', text: 'The established merchants pay toward civic works and expect a hearing at the council in return.' },
    { id: 'merchantsCouncil.2', text: 'A settled merchant community that helps pay for civic works and, in return, expects the council to listen.' },
    { id: 'merchantsCouncil.3', text: 'The merchants who keep the market are well established; they fund civic works and expect the council\'s ear in return.', needs: ['market'] },
    { id: 'merchantsCouncil.4', text: 'Merchants long established in what the place sends out; they help pay for civic works and expect access to the council in return.', needs: ['exports'] },
  ] },
  'Established merchant community; fund civic works and expect access to the hall in return.': { id: 'merchantsHall', rows: [
    { id: 'merchantsHall.1', text: 'The established merchants pay toward civic works and expect a hearing in the hall in return.' },
    { id: 'merchantsHall.2', text: 'A settled merchant community that helps pay for civic works and, in return, expects the hall to listen.' },
    { id: 'merchantsHall.3', text: 'The merchants who keep the market are well established; they fund civic works and expect the hall\'s ear in return.', needs: ['market'] },
    { id: 'merchantsHall.4', text: 'Merchants long established in what the place sends out; they help pay for civic works and expect access to the hall in return.', needs: ['exports'] },
  ] },
  'A consortium of guild masters holds power; policy is shaped by trade interests and inter-guild bargaining.': { id: 'guildConsortium', rows: [
    { id: 'guildConsortium.1', text: 'Guild masters govern together here; policy follows trade, and is settled by bargaining between the guilds.' },
    { id: 'guildConsortium.2', text: 'The guild masters who govern decide policy by the needs of trade and by what the guilds can agree among themselves.' },
  ] },
  // ── the second tranche (PEOPLE-2 seat M6, LINES-power-tranche2.md §D.2, as the chair ruled it at 18:14 UTC) ──
  'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.': { id: 'localMerchants', rows: [
    { id: 'localMerchants.1', text: 'Merchants whose trade is mostly local; a steady presence in civic life, though not the leading commercial voice.' },
    { id: 'localMerchants.2', text: 'Local traders with a steady civic presence; the larger commercial voice here belongs to others.' },
    { id: 'localMerchants.3', text: 'A merchant interest of local reach, regularly heard in civic affairs, but not the one that leads the trade.' },
    { id: 'localMerchants.4', text: 'Merchants who trade mainly at the place\'s own market; present in civic life, but not the strongest merchant voice.', needs: ['market'] },
    { id: 'localMerchants.5', text: 'In a place this large these are merchants of local reach: a steady civic presence, but not the dominant commercial voice.', needs: ['population: large'] },
    // localMerchants.6 STRUCK (the chair, 18:14: local reach against the place's exports)
    { id: 'localMerchants.7', text: 'Traders with local reach and a steady place in civic life; the leading merchant voice here is another\'s.' },
  ] },
  'Landed families increasingly outpaced by merchant capital; they compete for council seats, marriage alliances, and royal appointments to maintain relevance.': { id: 'landedOutpaced', rows: [
    { id: 'landedOutpaced.1', text: 'Landed families outpaced by merchant capital; they keep their land, but money carries more weight here.' },
    { id: 'landedOutpaced.2', text: 'Landed families in a place where merchant capital counts for more than land.' },
    { id: 'landedOutpaced.3', text: 'The landed families keep their estates and their names, but merchant capital has outpaced them.' },
    { id: 'landedOutpaced.4', text: 'The landed families\' wealth is in land, and here merchant capital has outpaced it.' },
    { id: 'landedOutpaced.5', text: 'Landed families outpaced by merchant capital; the market, not the estate, is where the money is.', needs: ['market'] },
    { id: 'landedOutpaced.6', text: 'Landed families outpaced by the merchants who handle what the place sends out.', needs: ['exports'] },
    { id: 'landedOutpaced.7', text: 'In a place this large, the landed families are outpaced by merchant capital, though they keep their land.', needs: ['population: large'] },
  ] },
  'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.': { id: 'nobleCompetitive', rows: [
    { id: 'nobleCompetitive.1', text: 'Noble families holding hereditary land rights and old privileges; they take part in civic politics and hold their own against merchant capital.' },
    { id: 'nobleCompetitive.2', text: 'Families of hereditary land and traditional privilege, active in the place\'s politics and a match for merchant capital.' },
    { id: 'nobleCompetitive.3', text: 'The noble families hold their land by inheritance and keep their traditional privileges; in civic politics they compete with merchant money.' },
    { id: 'nobleCompetitive.4', text: 'Hereditary landholders with traditional privileges; active in civic politics, and competitive there with the merchants\' money.' },
    { id: 'nobleCompetitive.5', text: 'In a place this large, the noble families\' hereditary land and privileges give them a voice in civic politics alongside merchant capital.', needs: ['population: large'] },
    { id: 'nobleCompetitive.6', text: 'Noble families with hereditary rights to land and old privileges; active in politics here, and competitive with the merchants of the market.', needs: ['market'] },
    { id: 'nobleCompetitive.7', text: 'Old noble families, hereditary landholders with traditional privileges; active in civic politics, and a counterweight to merchant capital.' },
  ] },
  'The richest merchant houses of the metropolis sit as its senate, so the houses that control the trade also make the law.': { id: 'gmoSeat', rows: [
    { id: 'gmoSeat.1', text: 'The metropolis is governed by a senate of its richest merchant houses; those who control its trade also make its law.' },
    { id: 'gmoSeat.2', text: 'Here the law is made by the same merchant houses that control the trade, sitting together as the senate.' },
    { id: 'gmoSeat.3', text: 'A senate of the richest merchant houses governs the metropolis, so trade and law are in the same hands.' },
    { id: 'gmoSeat.4', text: 'The merchant houses that run the market also sit as the senate and make the metropolis\'s law.', needs: ['market'] },
    { id: 'gmoSeat.5', text: 'The houses that handle what the metropolis sends out also sit as its senate and make its law.', needs: ['exports'] },
    { id: 'gmoSeat.6', text: 'The senate of the richest merchant houses makes the law here, and the court judges by it.', needs: ['court sits'] },
    { id: 'gmoSeat.7', text: 'The merchant houses whose cargoes cross the docks also sit as the senate, and make the law.', needs: ['docks'] },
  ] },
});

/**
 * THE STANDING CODAS (`power/factionStanding.js :: annotateFactionStanding`, re-settled to the final roster by
 * `power/rosterText.js :: settleStandingToRoster`): each matched by its own words where it stands after the text before it;
 * `$1`, `$2` in a wording are the names or the force word the coda already carries (its groups). A pool with no row
 * left is not voiced. `today` marks today's coda where it is not eligible everywhere: `'never'` (closingGap), or
 * `'excludesLevel'` (ineligible where the branch's own computed tie holds).
 * @type {ReadonlyArray<{ id: string, today?: 'never' | 'excludesLevel', re: RegExp, rows: ReadonlyArray<PowerLineRow> }>}
 */
export const CODA_POOLS = deepFreeze([
  { id: 'atTable', re: /They are always at the table, but cannot set their own terms\./, rows: [
    { id: 'atTable.1', text: 'They are part of every bargain, but never the ones who set its terms.' },
    { id: 'atTable.2', text: 'Nothing is settled without them in the room, and nothing on their terms alone.' },
    { id: 'atTable.3', text: 'They are always consulted, and seldom get their own way.' },
    { id: 'atTable.4', text: 'They always have a voice when the council bargains, but never the deciding one.', needs: ['ruling body'] },
    { id: 'atTable.5', text: 'They have a voice in every decision, but not the deciding one.' },
    { id: 'atTable.6', text: 'They take part in every bargain struck here, on terms that others set.' },
    { id: 'atTable.7', text: 'They are always in the room when the place\'s business is settled, but the terms are others\'.' },
    { id: 'atTable.8', text: 'They are consulted on everything that matters, and settle none of it on their own terms.' },
    { id: 'atTable.9', text: 'Third in weight here, they are always heard, but the terms are set by others.' },
    { id: 'atTable.10', text: 'At the market and in public business alike they are always heard, but others set the terms.', needs: ['market'] },
    { id: 'atTable.11', text: 'In a place this large they are one of the voices always heard, but not one that sets the terms.', needs: ['population: large'] },
    { id: 'atTable.12', text: 'Every bargain here includes them, and none is struck on their terms alone.' },
  ] },
  { id: 'bodiesMinds', re: /They and the religious authorities both keep people in line\. The ([a-z ]+?) deals with bodies and the clergy with minds, and each wishes the other would keep quieter\./, rows: [
    { id: 'bodiesMinds.1', text: 'They and the clergy both keep order, one in the streets and one in people\'s heads.', needs: ['church', 'tier: ≥ village'] },
    { id: 'bodiesMinds.2', text: 'The $1 keeps order with its hands and the clergy with their sermons.', needs: ['church'] },
    { id: 'bodiesMinds.3', text: 'Between them, the $1 and the religious authorities keep people in line, the one by force and the other by conscience.' },
    { id: 'bodiesMinds.4', text: 'The $1 keeps the peace in the streets, and the clergy keep it in people\'s consciences.', needs: ['church', 'tier: ≥ village'] },
    { id: 'bodiesMinds.5', text: 'Order here is kept two ways: by the $1 with force, and by the clergy with teaching.', needs: ['church'] },
    { id: 'bodiesMinds.6', text: 'The $1 and the clergy stand close in weight here, and both keep people in line: the one by arrest, the other from the pulpit.', needs: ['church'] },
    { id: 'bodiesMinds.7', text: 'The $1 answers for people\'s conduct in the streets, and the clergy for their conduct before the faith.', needs: ['church', 'tier: ≥ village'] },
    { id: 'bodiesMinds.8', text: 'Inside the walls the $1 keeps order by force, and the clergy keep it by conscience.', needs: ['walls', 'church'] },
    { id: 'bodiesMinds.9', text: 'The $1 brings lawbreakers to the court, and the clergy speak to people\'s consciences; both keep people in line.', needs: ['court sits', 'church'] },
    { id: 'bodiesMinds.10', text: 'In a place this large it takes both: the $1 to keep order by force, and the clergy to keep it by teaching.', needs: ['population: large', 'church'] },
    { id: 'bodiesMinds.11', text: 'People here are kept in line by the $1 in the streets and by the clergy at the church.', needs: ['church', 'tier: ≥ village'] },
    { id: 'bodiesMinds.12', text: 'The $1 keeps order at the market and in the streets, and the clergy keep it in people\'s consciences.', needs: ['market', 'church', 'tier: ≥ village'] },
  ] },
  { id: 'arcaneInShadow', today: 'excludesLevel', re: /The arcane orders are present but operate in the clergy's shadow\. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved\./, rows: [
    { id: 'arcaneInShadow.1', text: 'The arcane orders work in the clergy\'s shadow here, and no one has settled which magic the faith allows and which it does not.', needs: ['church'] },
    { id: 'arcaneInShadow.2', text: 'The clergy stand above the arcane orders here; what counts as permitted magic and what as heresy is left unsaid.', needs: ['church'], excludesLevel: true },
    { id: 'arcaneInShadow.3', text: 'The church outweighs the arcane orders here, and leaves the line between sanctioned magic and heresy undrawn.', needs: ['church'], excludesLevel: true },
    { id: 'arcaneInShadow.4', text: 'The arcane orders are here too, but carry no more weight than the clergy.', needs: ['church'] },
    { id: 'arcaneInShadow.5', text: 'The arcane orders do not outweigh the clergy here.', needs: ['church'] },
    { id: 'arcaneInShadow.6', text: 'The arcane orders have their place here, but it is not above the clergy\'s.', needs: ['church'] },
    { id: 'arcaneInShadow.7', text: 'The church carries at least as much weight here as the arcane orders do.', needs: ['church'] },
    { id: 'arcaneInShadow.8', text: 'The arcane orders are heard here, but no more than the clergy are.', needs: ['church'] },
    { id: 'arcaneInShadow.9', text: 'In a place this large there is room for both the clergy and the arcane orders, and the arcane orders do not stand above the clergy.', needs: ['population: large', 'church'] },
    { id: 'arcaneInShadow.10', text: 'The clergy hold their standing here; the arcane orders, though present, do not stand above them.', needs: ['church'] },
    { id: 'arcaneInShadow.11', text: 'With a church here and a house of monks or friars besides, the faith stands no lower than the arcane orders.', needs: ['church', 'institution: monastery'] },
    { id: 'arcaneInShadow.12', text: 'The arcane orders are part of the place, but not ahead of the clergy, and which magic the faith allows is an open question.', needs: ['church'] },
  ] },
  { id: 'clergyAhead', re: /The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly\./, rows: [
    { id: 'clergyAhead.1', text: 'With the clergy ahead of them in public affairs, the arcane orders keep out of their way and never cross them openly.', needs: ['church'] },
    // clergyAhead.2 STRUCK (the chair, 18:14, F4)
    { id: 'clergyAhead.3', text: 'Where the church speaks on public matters, the arcane orders keep silent and go their own way around it.', needs: ['church'] },
    { id: 'clergyAhead.4', text: 'The clergy have more say in public affairs than the arcane orders do.', needs: ['church'] },
    { id: 'clergyAhead.5', text: 'In public matters the clergy come before the arcane orders here.', needs: ['church'] },
    { id: 'clergyAhead.6', text: 'The arcane orders stand behind the clergy in public affairs.', needs: ['church'] },
    { id: 'clergyAhead.7', text: 'Ask whose word counts for more in public affairs, the clergy\'s or the arcane orders\', and here it is the clergy\'s.', needs: ['church'] },
    { id: 'clergyAhead.8', text: 'The church has more say in public affairs here than the arcane orders.', needs: ['church'] },
    { id: 'clergyAhead.9', text: 'In a place this large the arcane orders have their place, but the clergy have more say in public affairs.', needs: ['population: large', 'church'] },
    { id: 'clergyAhead.10', text: 'In public affairs here, the clergy\'s word carries further than the arcane orders\'.', needs: ['church'] },
    { id: 'clergyAhead.11', text: 'The clergy outweigh the arcane orders in public affairs here.', needs: ['church'] },
  ] },
  { id: 'outvoted', re: /The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal\./, rows: [
    { id: 'outvoted.1', text: 'On prices and labour the merchants outvote them every time, so the craft masters bargain for what they can, deal by deal.' },
    { id: 'outvoted.2', text: 'Outvoted on prices and on the terms of work, the craft masters fight their corner in the small print of each deal.' },
    { id: 'outvoted.3', text: 'The merchants decide the prices at the market and the terms of work; the craft masters win what they can by adding conditions to each deal.', needs: ['market'] },
  ] },
  { id: 'outpaced', re: /The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not\./, rows: [
    { id: 'outpaced.1', text: 'The craft guilds have a voice, but a smaller one: the merchants set prices, the craft masters object, and the merchants usually prevail.' },
    { id: 'outpaced.2', text: 'Merchants set the prices and the craft guilds argue; more often than not, the merchants win.' },
    { id: 'outpaced.3', text: 'At the market the merchants set the prices, the craft masters object, and the merchants win more often than not.', needs: ['market'] },
    { id: 'outpaced.4', text: 'The craft guilds are here, but outpaced: the merchants set the prices.' },
    { id: 'outpaced.5', text: 'Prices here are the merchants\' to set; the craft guilds are present, but behind.' },
    { id: 'outpaced.6', text: 'The craft guilds are present, but the merchants have the larger say, and the prices are theirs to set.' },
    { id: 'outpaced.7', text: 'What the workshops make, the merchants price; the craft guilds are present but outpaced.' },
    { id: 'outpaced.8', text: 'The market\'s prices are the merchants\' to set; the craft guilds are present, but outpaced.', needs: ['market'] },
    { id: 'outpaced.9', text: 'The guilds of the trades are present, but outpaced; the merchants set the prices.', needs: ['guild'] },
    { id: 'outpaced.10', text: 'What the place sends out is priced by the merchants; the craft guilds are present but outpaced.', needs: ['exports'] },
    { id: 'outpaced.11', text: 'In a place this large the merchants set the prices, and the craft guilds, though present, are outpaced.', needs: ['population: large'] },
  ] },
  { id: 'worthBuying', re: /Close enough to the two above that their support is worth buying; they play (.+?) and (.+?) against each other when they can\./, rows: [
    // worthBuying.1 LEFT OUT (the brief's test 3: "worth having")
    // worthBuying.2 LEFT OUT (the brief's test 3: "know it")
  ] },
  { id: 'inShadow', re: /They operate in the shadow of (.+?), close enough to matter and too far behind to lead\./, rows: [
    { id: 'inShadow.1', text: 'Second to $1, they matter, but they are too far behind to lead.' },
    { id: 'inShadow.2', text: 'They count for something here, but $1 counts for more, and the gap is too wide to close.' },
    { id: 'inShadow.3', text: 'Close enough to $1 to matter, not close enough to lead.' },
  ] },
  { id: 'narrowGap', re: /The gap between them and (.+?) is narrow\. A single shift in patronage, scandal, or armed muscle could swap their positions\./, rows: [
    { id: 'narrowGap.1', text: 'Only a little separates them from $1; one change of patron, one scandal or one show of force could reverse the order.' },
    { id: 'narrowGap.2', text: 'They stand just behind $1, near enough that a single scandal or a lost patron could put them ahead.' },
    { id: 'narrowGap.3', text: '$1 leads them, but narrowly; the order of the two could turn on one scandal or one change of allegiance.' },
  ] },
  { id: 'closingGap', today: 'never', re: /The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down\./, rows: [
    // the chair, 18:14 (F1): today's line and the ruled 1 and 2 are not eligible anywhere; these seven replace them
    { id: 'closingGap.1', text: 'The merchants stand ahead of them in influence here.' },
    { id: 'closingGap.2', text: 'In influence here the merchants come before them.' },
    { id: 'closingGap.3', text: 'They count here, but the merchants count for more.' },
    { id: 'closingGap.4', text: 'They stand behind the merchants in influence here.' },
    { id: 'closingGap.5', text: 'Trade counts here for more than birth and land.' },
    { id: 'closingGap.6', text: 'They carry less weight here than the merchants of the market.', needs: ['market'] },
    { id: 'closingGap.7', text: 'In a place this large the merchants stand ahead of them in influence.', needs: ['population: large'] },
  ] },
  { id: 'noblesAhead', today: 'excludesLevel', re: /Still ahead of merchant interests in real influence, for now\. They know the gap is narrowing and are arranging marriages accordingly\./, rows: [
    { id: 'noblesAhead.1', text: 'For all the merchants\' money, they have not been overtaken here.' },
    { id: 'noblesAhead.2', text: 'The merchants have not overtaken them in influence here.' },
    { id: 'noblesAhead.3', text: 'Land and birth count here for no less than trade.' },
    { id: 'noblesAhead.4', text: 'They are at least the merchants\' equal in influence here.' },
    { id: 'noblesAhead.5', text: 'They have no less say here than the merchants who trade at the market.', needs: ['market'] },
    { id: 'noblesAhead.6', text: 'They have no less say here than the merchants who handle what the place sends out.', needs: ['exports'] },
    { id: 'noblesAhead.7', text: 'They hold land and name here, and in influence the merchants have not passed them.' },
    { id: 'noblesAhead.8', text: 'Well off as the place is, the merchants have not overtaken them in influence.', needs: ['prosperity: ≥ comfortable'] },
  ] },
]);

/**
 * THE RELATION ROWS, by the branch of `factionDynamics.js :: computeFactionRelationships` that wrote today's line
 * (`RELATION_BRANCHES`). Templates: `{G}` `{Mil}` `{M}` `{R}` `{C}` `{N}` name a power of the pair as the writer names it
 * (its article form; a sentence's first "the" raised), `{G's}` its possessive, `{L}` the landholders the line already
 * names, `{M|works|work}` the verb by the power's number (the writer's own `verb`).
 * @type {Readonly<Record<string, ReadonlyArray<PowerLineRow>>>}
 */
export const RELATION_POOLS = deepFreeze({
  'MR.dep': [
    { id: 'MR.dep.1', text: '{R} could not keep up the faith\'s charity without the gifts of {M}, and {M} would have more trouble from the poor without it. Each needs the other.' },
    { id: 'MR.dep.2', text: '{R} {R|feeds|feed} the poor here, and {M} {M|pays|pay} for it; the poor stay quiet. Each needs the other.' },
    { id: 'MR.dep.3', text: '{M} {M|gives|give} to the church, {R} {R|gives|give} to the poor, and the poor stay quiet. Each needs the other.', needs: ['church'] },
    { id: 'MR.dep.4', text: '{M} {M|gives|give} to the hospital and to the alms of {R}; the sick and the poor are looked after, and the streets stay quiet. Each needs the other.', needs: ['hospital', 'tier: ≥ village'] },
    { id: 'MR.dep.5', text: 'What {M} {M|earns|earn} at the market pays for the charity of {R}, and the charity keeps the poor off the merchants\' doorsteps. Each needs the other.', needs: ['market'] },
    { id: 'MR.dep.6', text: '{M} {M|makes|make} {M|its|their} money on what the place sends out and brings in, and part of it goes to {R} for the poor. Each needs the other.', needs: ['exports', 'imports'] },
    // MR.dep.7 LEFT OUT (the brief's test 3: "know it")
    { id: 'MR.dep.8', text: 'In a place this well off, {M} can spare coin for the charity of {R}, and {M|does|do}, because the charity keeps the poor quiet. Each needs the other.', needs: ['prosperity: ≥ comfortable'] },
    { id: 'MR.dep.9', text: 'There is little coin to spare here, and what {R} {R|gives|give} the poor comes mostly from {M}. Each needs the other.', needs: ['prosperity: ≤ moderate'] },
    { id: 'MR.dep.10', text: '{M} {M|pays|pay}, {R} {R|gives|give}, and the poor take what is given and keep the peace. Each needs the other.' },
    { id: 'MR.dep.11', text: 'In a place this large the faith\'s charity costs more than the faith has, and {M} {M|makes|make} up the rest; the poor stay quiet. Each needs the other.', needs: ['population: large'] },
  ],
  'GE.sub': [
    { id: 'GE.sub.1', text: '{M} {M|makes|make} the money, but {G} {G|makes|make} the rules, and a hearing in the hall costs {M} something every time.' },
    { id: 'GE.sub.2', text: '{M} {M|trades|trade} on the terms {G} {G|sets|set}, and when {M|it wants|they want} them changed, {M|it|they} must pay to be heard in the hall.' },
    { id: 'GE.sub.3', text: 'What {M} {M|sends|send} out of the place goes out under the rules {G} {G|sets|set}; {M} can ask for better terms, not set {M|its|their} own.', needs: ['exports'] },
    { id: 'GE.sub.4', text: 'When merchants quarrel over a contract here, the court settles it, not {M}; {M} {M|works|work} under the rules {G} {G|sets|set}.', needs: ['court sits'] },
    { id: 'GE.sub.5', text: '{M} {M|does|do} well here, but on the hall\'s terms: {G} {G|sets|set} the rules, and {M} {M|pays|pay} to be heard.', needs: ['prosperity: ≥ comfortable'] },
    { id: 'GE.sub.6', text: 'Every cargo that comes over the docks is landed under the rules {G} {G|sets|set}; {M} {M|pays|pay} for a hearing when {M|it wants|they want} them changed.', needs: ['docks'] },
    { id: 'GE.sub.7', text: 'Loans and debts here are written under the law {G} {G|sets|set}, and {M} {M|pays|pay} for a hearing in the hall when {M|it wants|they want} that law changed.', needs: ['institution: bank'] },
  ],
  'GM.sub+soldiers': [
    { id: 'GM.sub+soldiers.1', text: '{Mil} answers to {G} for what it does; the soldiers enforce what the hall decides, and do not decide it.', needs: ['soldiers'] },
    { id: 'GM.sub+soldiers.2', text: 'Ask who gives the orders here and the answer is {G}; {Mil} carries them out, and the soldiers do not make the law.', needs: ['soldiers'] },
    { id: 'GM.sub+soldiers.3', text: '{G} {G|decides|decide}, and {Mil} carries it out; the garrison\'s officers take their orders from the hall, not the other way round.', needs: ['garrison'] },
    { id: 'GM.sub+soldiers.4', text: '{Mil} keeps the walls on {G\'s} orders and has no say in what those orders are; the soldiers enforce the law, they do not make it.', needs: ['walls', 'soldiers'] },
    { id: 'GM.sub+soldiers.5', text: '{Mil} makes the arrests, and the court and {G} decide what comes of them; the soldiers enforce the law, they do not make it.', needs: ['court sits', 'soldiers'] },
    { id: 'GM.sub+soldiers.6', text: 'In a place this size {Mil} has many streets to keep, and keeps them on {G\'s} orders, not its own; the soldiers enforce the law, they do not make it.', needs: ['population: large', 'soldiers', 'tier: ≥ village'] },
  ],
  'GM.sub': [
    { id: 'GM.sub.1', text: '{Mil} answers to {G} for what it does; it enforces what the hall decides, and does not decide it.' },
    { id: 'GM.sub.2', text: 'Ask who gives the orders here and the answer is {G}; {Mil} carries them out.' },
    { id: 'GM.sub.3', text: '{Mil} keeps the walls on {G\'s} orders and has no say in what those orders are.', needs: ['walls'] },
  ],
  'GM.sym': [
    { id: 'GM.sym.1', text: '{G} cannot keep order without {Mil}, and {Mil} has its standing from {G}; each needs the other to stay strong.' },
    { id: 'GM.sym.2', text: 'Orders come from {G}, and {Mil} is who people see carrying them out; each needs the other to stay strong.' },
    { id: 'GM.sym.3', text: '{Mil} keeps the walls and {G} keeps {Mil}; each needs the other to stay strong.', needs: ['walls'] },
    { id: 'GM.sym.4', text: '{G} makes the law, the court judges by it, and {Mil} sees it kept; each needs the other to stay strong.', needs: ['court sits'] },
    { id: 'GM.sym.5', text: 'A place this size needs both: {G} to give the orders and {Mil} to carry them out across it; each needs the other to stay strong.', needs: ['population: large'] },
    { id: 'GM.sym.6', text: 'The garrison takes its orders from {G}, and {G} leans on the garrison; each needs the other to stay strong.', needs: ['garrison'] },
    { id: 'GM.sym.7', text: '{G} calls out {Mil} when it is needed, and {Mil} answers; each needs the other to stay strong.', needs: ['militia'], excludes: ['paid watch'] },
  ],
  'GM.tense': [
    { id: 'GM.tense.1', text: '{G} no longer simply gives {Mil} orders: the two are about as strong as each other, and little is decided without {Mil\'s} agreement.' },
    { id: 'GM.tense.2', text: 'Neither {G} nor {Mil} is clearly the stronger now, so {G} asks where it once ordered, and less and less is decided without {Mil}.' },
    { id: 'GM.tense.3', text: '{G} and {Mil} now stand about level, and {G} asks {Mil\'s} agreement before it decides anything of weight.' },
    { id: 'GM.tense.4', text: '{Mil} has grown about as strong as {G}; the elders now ask where they once told, and little is settled without {Mil}.', needs: ['ruler: elder'] },
  ],
  'GR.dep': [
    { id: 'GR.dep.1', text: 'People pay their taxes to {G} and hear from {R} that they should. Each props up the other.' },
    { id: 'GR.dep.2', text: '{G} holds the seat and the purse; {R} {R|holds|hold} people\'s faith, and {R|uses|use} it to say the seat is rightly held. Each props up the other.' },
    { id: 'GR.dep.3', text: '{G} makes the law, and {R} {R|tells|tell} people it is right to keep it. Each props up the other.' },
    { id: 'GR.dep.4', text: 'A newcomer soon learns two things: {G} collects the taxes, and {R} will tell them it has the right to. Each props up the other.' },
    { id: 'GR.dep.5', text: '{G} governs, and {R} {R|tells|tell} the faithful at the church that its rule is rightful. Each props up the other.', needs: ['church'] },
    { id: 'GR.dep.6', text: 'In a place this small, the priest\'s word that {G} {G|rules|rule} rightly counts for as much as the taxes {G} {G|collects|collect}. Each props up the other.', needs: ['priest', 'population: small'] },
  ],
  'GR.tense': [
    { id: 'GR.tense.1', text: '{R} {R|settles|settle} more of people\'s affairs here than {G} {G|does|do}: marriages, inheritances, hard times. The two do not agree on who decides what.' },
    { id: 'GR.tense.2', text: 'Ask about a marriage or an inheritance and you are sent to {R}, not to {G}; the two do not agree on who decides what.' },
    { id: 'GR.tense.3', text: 'Weddings, wills and help in hard times are all sought at the church, not from {G}, and the two do not agree on who decides what.', needs: ['church'] },
    { id: 'GR.tense.4', text: 'The priest, not {G}, is who people go to over a marriage, an inheritance or hard times, and the two do not agree on who decides what.', needs: ['priest'] },
    { id: 'GR.tense.5', text: '{G} meets and decides, but people bring their marriages, inheritances and troubles to {R}; the two do not agree on who decides what.', needs: ['ruling body'] },
    { id: 'GR.tense.6', text: 'In a place this small everyone knows to see {R}, not {G}, about a marriage or a will, and the two do not agree on who decides what.', needs: ['population: small'] },
    { id: 'GR.tense.7', text: 'When times are hard, people here go to {R} for help, not to {G}; the two do not agree on who decides what.', needs: ['prosperity: ≤ poor'] },
  ],
  'GE.dep': [
    { id: 'GE.dep.1', text: 'Without the taxes and loans of {M}, {G} could not pay its way, and without {G}, {M} would have no one to make debtors pay. Neither can afford to ruin the other.' },
    { id: 'GE.dep.2', text: 'A merchant here pays {G} its taxes and expects {G\'s} law to stand behind every bargain. Neither {G} nor {M} can afford to ruin the other.' },
    { id: 'GE.dep.3', text: '{M} {M|pays|pay} taxes to {G} and {M|lends|lend} it money, and the court holds {M\'s} debtors to their contracts. Neither can afford to ruin the other.', needs: ['court sits'] },
    { id: 'GE.dep.4', text: '{G} lives on what the market pays in dues, and {M} {M|lives|live} on the market {G} keeps in order. Neither can afford to ruin the other.', needs: ['market'] },
    { id: 'GE.dep.5', text: 'What the place sends out pays {M} and, through the taxes, {G}; neither can afford to ruin the other.', needs: ['exports'] },
    { id: 'GE.dep.6', text: 'Coin is not plentiful here: {G} borrows from {M}, and {M} {M|needs|need} {G} to see that debts are paid. Neither can afford to ruin the other.', needs: ['prosperity: ≤ moderate'] },
    { id: 'GE.dep.7', text: 'The place does well, and {G} and {M} both take their share: {G} the taxes, {M} the profits the law protects. Neither can afford to ruin the other.', needs: ['prosperity: ≥ comfortable'] },
  ],
  'MR.tense': [
    { id: 'MR.tense.1', text: '{M} and {R} pull at the same purses: the church for its tithes, the merchants for their debts. The church\'s rules on lending are a standing grievance with the merchants.', needs: ['church'] },
    { id: 'MR.tense.2', text: 'A household here owes tithes to {R} and debts to {M}, and each side would rather be paid first. Church land exemptions and the church\'s rules on lending are a standing grievance with the merchants.', needs: ['church'] },
    { id: 'MR.tense.3', text: 'The church asks the households for tithes and {M} {M|asks|ask} them for what they owe, and both want to be paid first. The church\'s rules on lending are a standing grievance with the merchants.', needs: ['church'] },
    { id: 'MR.tense.4', text: 'Money that goes to {R} as tithe does not come back to the market; the church\'s rules on lending are a standing grievance with the merchants.', needs: ['church', 'market'] },
  ],
  'MC.vote': [
    { id: 'MC.vote.1', text: 'On trade, {M} and {C} vote together; on who keeps the profit, they fight.' },
    { id: 'MC.vote.2', text: '{M} and {C} vote together on anything that touches the market, then fight over who keeps the profit.', needs: ['market'] },
    { id: 'MC.vote.3', text: '{M} and {C} vote together on what the place sends out, then fight over who keeps the profit of it.', needs: ['exports'] },
    { id: 'MC.vote.4', text: 'In council, {M} and {C} vote together whenever trade is at stake; outside it, they fight over who keeps the profit.', needs: ['ruling body'] },
    { id: 'MC.vote.5', text: 'There is money enough in trade here for {M} and {C} to vote together whenever it is at stake, and to fight over who keeps the profit.', needs: ['prosperity: ≥ comfortable'] },
  ],
  'MC.vote-against': [
    { id: 'MC.vote-against.1', text: 'Against {L}, {M} and {C} vote as one; once the vote is cast, they fight over who keeps the profit.' },
    { id: 'MC.vote-against.2', text: '{M} and {C} vote together against {L} whenever trade is at stake, then fight over who keeps the profit.' },
    { id: 'MC.vote-against.3', text: '{M} and {C} side together against {L} on anything touching the market, then fight over who keeps the profit.', needs: ['market'] },
    { id: 'MC.vote-against.4', text: '{M} and {C} vote together against {L} on what the place sends out, then fight over who keeps the profit of it.', needs: ['exports'] },
    { id: 'MC.vote-against.5', text: 'In council, {M} and {C} vote together against {L}; outside it, they fight over who keeps the profit.', needs: ['ruling body'] },
    { id: 'MC.vote-against.6', text: '{M} and {C} stand together against {L} whenever the guilds\' business is at stake, then fight over who keeps the profit.', needs: ['guild'] },
  ],
  'NG.sub+merchant': [
    { id: 'NG.sub+merchant.1', text: '{N} {N|keeps|keep} {N|its|their} titles and {N|its|their} precedence, but the say {N|it|they} once had now sits with {G} and with merchant money.' },
    { id: 'NG.sub+merchant.2', text: 'People still give {N} {N|its|their} titles, but they take their business to {G}, and the money is with the merchants.' },
    { id: 'NG.sub+merchant.3', text: '{G} fills the offices that once went to {N} by right, and merchant money does the rest.' },
    { id: 'NG.sub+merchant.4', text: 'In a place this large, titles count for less than offices and money; {N} {N|has|have} the titles, {G} the offices, the merchants the money.', needs: ['population: large'] },
    { id: 'NG.sub+merchant.5', text: 'The market is the merchants\' and the offices are {G\'s}; {N} {N|keeps|keep} {N|its|their} titles and little else.', needs: ['market'] },
  ],
  'NG.sub': [
    { id: 'NG.sub.1', text: '{N} {N|keeps|keep} {N|its|their} titles and {N|its|their} precedence, but the say {N|it|they} once had now sits with {G}.' },
    { id: 'NG.sub.2', text: 'People still give {N} {N|its|their} titles, but they take their business to {G}.' },
    { id: 'NG.sub.3', text: '{G} fills the offices that once went to {N} by right.' },
  ],
  'NG.dep': [
    { id: 'NG.dep.1', text: '{G} rules, but it must bargain with {N} over land and levies rather than simply give orders.' },
    { id: 'NG.dep.2', text: '{N} {N|answers|answer} to {G}, but {N|its|their} land and levies give {N|it|them} something to bargain with, and {N|it does|they do}.' },
    { id: 'NG.dep.3', text: '{N} {N|holds|hold} land, courts and levies of {N|its|their} own under {G}, enough to bargain rather than simply obey.', needs: ['court sits'] },
    { id: 'NG.dep.4', text: 'In a place this large, {N} still {N|keeps|keep} enough land and levies of {N|its|their} own to bargain with {G}, not simply obey it.', needs: ['population: large'] },
  ],
});

/**
 * TODAY'S LINE OF EACH POOLED BRANCH, by its own sentence shape (the writer's, `factionDynamics.js ::
 * computeFactionRelationships`) and the row's kind. `roles` names the pair's two powers in the writer's order. A row no
 * branch reads, a conflict twin (it carries the quarrel), the occupier's row (`tense` or `competitive`, never
 * `subordinate`) and a capture row (`captureState`) are not pooled.
 * @type {ReadonlyArray<{ id: string, type: string, roles: readonly [string, string], re: RegExp }>}
 */
export const RELATION_BRANCHES = deepFreeze([
  { id: 'GM.sub+soldiers', type: 'subordinate', roles: ['G', 'Mil'], re: /^.+ carries out what .+ decides\. The soldiers enforce the law; they do not make it\.$/ },
  { id: 'GM.sub', type: 'subordinate', roles: ['G', 'Mil'], re: /^.+ carries out what .+ decides\.$/ },
  { id: 'GM.sym', type: 'symbiotic', roles: ['G', 'Mil'], re: /^.+ gives the orders and .+ carries them out; each needs the other to stay strong\.$/ },
  { id: 'GM.tense', type: 'tense', roles: ['G', 'Mil'], re: /^.+ is now about as strong as .+\. The hall asks for .+ agreement instead of giving orders, and less and less is decided without it\.$/ },
  { id: 'GE.dep', type: 'dependent', roles: ['G', 'M'], re: /^.+ needs the taxes and loans of .+, and .+ (?:needs|need) .+ to enforce (?:its|their) contracts and keep the law\. Neither can afford to ruin the other\.$/ },
  { id: 'GE.sub', type: 'subordinate', roles: ['G', 'M'], re: /^.+ (?:works|work) under the rules .+ sets, and (?:pays|pay) for a hearing in the hall when it wants something\.$/ },
  { id: 'GR.tense', type: 'tense', roles: ['G', 'R'], re: /^People take their marriages, inheritances and hard times to .+, not to .+, and the two do not agree on who decides what\.$/ },
  { id: 'GR.dep', type: 'dependent', roles: ['G', 'R'], re: /^.+ holds the seat and collects the taxes; .+ (?:tells|tell) people that .+ rule is right and ordained\. Each props up the other\.$/ },
  { id: 'MC.vote-against', type: 'tense', roles: ['M', 'C'], re: /^.+ and .+ vote together against (.+), then fight over who keeps the profit\.$/ },
  { id: 'MC.vote', type: 'tense', roles: ['M', 'C'], re: /^.+ and .+ vote together whenever trade is at stake, then fight over who keeps the profit\.$/ },
  { id: 'MR.tense', type: 'tense', roles: ['M', 'R'], re: /^.+ and .+ want the same households' money: tithes on one side, debts and contracts on the other\. Church land exemptions and the church's rules on lending are a standing grievance with the merchants\.$/ },
  { id: 'MR.dep', type: 'dependent', roles: ['M', 'R'], re: /^The money of .+ pays for the charity of .+, and the charity keeps the poor quiet\. Each needs the other, and neither likes it\.$/ },
  { id: 'NG.sub+merchant', type: 'subordinate', roles: ['N', 'G'], re: /^.+ still (?:has|have) (?:its|their) titles, but merchant money and the hall's offices have taken most of (?:its|their) power\.$/ },
  { id: 'NG.sub', type: 'subordinate', roles: ['N', 'G'], re: /^.+ still (?:has|have) (?:its|their) titles, but the hall's offices have taken most of (?:its|their) power\.$/ },
  { id: 'NG.dep', type: 'dependent', roles: ['N', 'G'], re: /^.+ (?:lives|live) under the rule of .+ but (?:keeps|keep) enough rights of (?:its|their) own \((?:land, courts, levies|land, levies)\) to bargain, not simply obey\.$/ },
]);

const DESC_FIELD = 'powerStructure.factions.desc';
const RELATION_FIELD = 'powerStructure.factionRelationships.narrative';

/** the writer's own name forms (`factionDynamics.js :: say`, `sayOf`, `verb`, `opening`) @param {string} name */
const say = (name) => powerNameWithArticle(name);
/** @param {string} name */
const sayOf = (name) => `the ${powerPossessive(powerNameAfterArticle(name))}`;
/** @param {string} t */
const opening = (t) => t.replace(/(^|[.!?]\s+)the /g, '$1The ');

/**
 * A relation wording rendered for its pair (the writer's own forms).
 * @param {string} text @param {Record<string, string>} roles
 * @returns {string}
 */
export function renderRelation(text, roles) {
  return opening(text.replace(/\{(\w+)('s)?(?:\|([^|}]*)\|([^}]*))?\}/g, (_m, role, poss, one, many) => {
    const name = roles[role];
    if (name == null) return _m;
    if (role === 'L') return name;
    if (one !== undefined) return pluralPowerName(say(name)) ? many : one;
    return poss ? sayOf(name) : say(name);
  }));
}

/**
 * A coda wording filled with the groups its coda carries (`$1`, `$2`).
 * @param {string} text @param {ReadonlyArray<string>} groups @returns {string}
 */
export function renderCoda(text, groups) {
  return opening(text.replace(/\$(\d)/g, (_m, d) => groups[Number(d) - 1] ?? _m));
}

/**
 * The pooled branch today's line of a relation row was written by, with the pair's roles; null where the row is not
 * pooled.
 * @param {any} row @returns {{ id: string, roles: Record<string, string> } | null}
 */
export function relationBranchOf(row) {
  if (!row || typeof row !== 'object' || row.captureState !== undefined || !Array.isArray(row.pair) || row.pair.length !== 2) return null;
  const narrative = typeof row.narrative === 'string' ? row.narrative : '';
  for (const b of RELATION_BRANCHES) {
    if (b.type !== row.type) continue;
    const m = b.re.exec(narrative);
    if (!m) continue;
    /** @type {Record<string, string>} */ const roles = { [b.roles[0]]: String(row.pair[0]), [b.roles[1]]: String(row.pair[1]) };
    const low = narrative.toLowerCase();
    if (!low.includes(say(roles[b.roles[0]]).toLowerCase()) && !low.includes(say(roles[b.roles[1]]).toLowerCase())) return null; // the line names its pair (NG.sub names the old families alone: "the hall's offices")
    if (m[1] !== undefined) roles.L = m[1];
    return { id: b.id, roles };
  }
  return null;
}

/**
 * The pooled opening a description starts with, or null.
 * @param {unknown} desc @returns {string | null}
 */
export function openingOf(desc) {
  if (typeof desc !== 'string') return null;
  for (const open of Object.keys(DESC_POOLS)) if (desc === open || desc.startsWith(`${open} `)) return open;
  return null;
}

/**
 * ONE PICK: today's line at the head of the pool's rows; the pick, over the eligible ones, admitted and noted by the declared
 * draw. A line is eligible where the record admits its declaration and, on a tie (`level`), it does not exclude one;
 * today's line also where its pool does not mark it ineligible (`todayNeeds`, `today`). Returns today's line where nothing
 * new is eligible.
 * @param {string} today
 * @param {{ needs?: ReadonlyArray<string>, today?: string }} pool the pool's marks on today's line
 * @param {ReadonlyArray<PowerLineRow>} rows @param {string} key the pick's key ('' for a seedless record)
 * @param {string} poolId @param {() => object} facts @param {boolean} level the branch's own computed tie
 * @returns {PowerLineRow | string}
 */
function pickLine(today, pool, rows, key, poolId, facts, level) {
  const never = pool.today === 'never';
  const tieRefused = pool.today === 'excludesLevel' && level;
  const head = pool.needs?.length ? { id: `${poolId}.0`, text: today, needs: pool.needs } : today;
  const list = [head, ...rows];
  const eligible = (/** @type {any} */ line) => {
    if (line === head && (never || tieRefused)) return false;
    if (level && line && typeof line === 'object' && line.excludesLevel === true) return false;
    return declarationAdmits(declarationOf(line), /** @type {any} */ (facts())).admitted;
  };
  const r = drawDeclared(list, {
    draw: (p) => {
      const open = p.filter(eligible);
      return open.length && open.some((l) => l !== head) ? pickVariantMixed(open, key) : p[0];
    },
    facts,
    key,
    poolId,
    surface: 'power',
    drawKind: 'H',
    keepRefused: true, // the line is never emptied: a refused today's line with nothing eligible is returned as it came
  });
  return r.line == null || r.line === head ? today : r.line;
}

/**
 * THE ONE PASS: voice a record's power descriptions and relation rows (see the header). Writes the two fields in place
 * where a line moves; returns the record.
 * @template T
 * @param {T} record
 * @param {((factions: any[], faction: any, codaId: string) => boolean) | null} [levelOf] the standing branch's own
 *   computed tie (`power/factionStanding.js :: standingLevelOf`); absent, no tie is read
 * @returns {T}
 */
export function voicePowerLines(record, levelOf = null) {
  const rec = /** @type {any} */ (record);
  const ps = rec?.powerStructure;
  if (!ps || typeof ps !== 'object') return record;
  const seed = rec._seed || '';
  /** @type {object | undefined} */ let held;
  const facts = () => (held ??= factsOf(rec));
  const keyOf = (/** @type {string} */ tail) => (seed ? `${seed}::${tail}` : '');
  const factions = Array.isArray(ps.factions) ? ps.factions : [];

  for (const f of factions) {
    if (!f || typeof f.desc !== 'string') continue;
    const power = String(f.faction ?? f.name ?? '');
    let desc = f.desc;
    const open = openingOf(desc);
    if (open) {
      const pool = DESC_POOLS[open];
      if (pool.rows.length) {
        const line = pickLine(open, { needs: pool.todayNeeds }, pool.rows, keyOf(`${DESC_FIELD}::${power}`), `powerLineVariants:DESC_POOLS.${pool.id}`, facts, false);
        if (typeof line !== 'string') desc = `${lineText(line)}${desc.slice(open.length)}`;
      }
    }
    for (const coda of CODA_POOLS) {
      if (!coda.rows.length) continue;
      const m = coda.re.exec(desc);
      if (!m || (m.index > 0 && !/\s$/.test(desc.slice(0, m.index)))) continue; // where it stands: after the text before it (an opening that lost its full stop keeps its coda a coda)
      const level = typeof levelOf === 'function' && levelOf(factions, f, coda.id) === true;
      const line = pickLine(m[0], { today: coda.today }, coda.rows, keyOf(`${DESC_FIELD}::${power}::${coda.id}`), `powerLineVariants:CODA_POOLS.${coda.id}`, facts, level);
      if (typeof line !== 'string') desc = `${desc.slice(0, m.index)}${renderCoda(lineText(line), m.slice(1))}${desc.slice(m.index + m[0].length)}`;
    }
    if (desc !== f.desc) f.desc = desc;
  }

  for (const row of Array.isArray(ps.factionRelationships) ? ps.factionRelationships : []) {
    const branch = relationBranchOf(row);
    if (!branch) continue;
    const rows = RELATION_POOLS[branch.id] ?? [];
    if (!rows.length) continue;
    const key = keyOf(`${RELATION_FIELD}::${[...row.pair].map(String).sort().join('||')}`);
    const line = pickLine(row.narrative, {}, rows, key, `powerLineVariants:RELATION_POOLS.${branch.id}`, facts, false);
    if (typeof line !== 'string') row.narrative = renderRelation(lineText(line), branch.roles);
  }
  return record;
}

/** @template T @param {T} x @returns {T} */
function deepFreeze(x) {
  if (x && typeof x === 'object' && !(x instanceof RegExp) && !Object.isFrozen(x)) {
    for (const v of Object.values(x)) deepFreeze(v);
    Object.freeze(x);
  }
  return x;
}
