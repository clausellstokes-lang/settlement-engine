/**
 * domain/facts/factsOf.js — ONE FACT, ONE HOME (CENSUS-1 wave 0; `docs/DESIGN_POOL_CENSUS.md` §1).
 *
 * `factsOf(record).<fact>` is the one answer to each atomic fact a drawn line may presume. Every
 * getter reads the record AS IT IS NOW (the live roster, the current crisis container): nothing
 * is cached, so a late write is seen by the next read, which is what the birth self-check
 * (`cert:false-presumption`, wave 1) re-asserts against the FINAL record.
 *
 * Each fact's logic lives in its own module beside this one; this file only names them. A
 * competing reader elsewhere in the tree is retired TO the module (a re-export shim where the
 * old name is imported widely), never re-implemented beside it. Climate and season have no
 * record field and so no home (the chair's ruling 8).
 *
 * Pure: no randomness, no clock, no write.
 */
import { dangerComingOf } from './dangerComing.js'; // BAR4-CORPUS-DEF (D1)
import { monsterFrontierOf } from './monsterFrontier.js'; // BAR6-DEFDESK (7a)
import { growsMoreThanEatsOf } from './growsMoreThanEats.js'; // BAR6-DEFDESK (9c.nothing-over)
import { legacyRuinOf } from './legacyRuin.js'; // BAR6-CULTURE (10g-legacy)
import { crisisOf } from './crisisKind.js';
import { siegeMotionOf } from './siegeMotion.js'; // BAR4-SAFETY (F2)
import { storesMonthsOf } from './storesMonths.js';
import { courtHoldersOf, defenceOf } from './defence.js';
import { waterOf, waterOfKind } from './water.js';
import { marketOf } from './market.js';
import { famineOf } from './famine.js';
import { magicOf } from './magic.js';
import { magicSupplyOf } from './magicSupply.js'; // BAR4-CORPUS-DEF (D2)
import { relianceShownOf } from '../display/magicProvisionShown.js'; // BAR5-MAGIC (rule 1a): the reliance word the page prints
import { rulerKindOf } from './rulerKind.js';
import { legitimacyCrisisOf } from './legitimacyCrisis.js'; // BAR6-SCENES (9f)
import { rulingBodyOf } from './rulingBody.js';
import { sovereignOf } from './sovereign.js'; // BAR6-HOUSES (SV1)
import { migrationOf } from './migration.js';
import { warStateOf } from './warState.js';
import { hasInstitution, liveInstitutionNames } from './institutions.js';
import { populationBandOf } from './populationBand.js';
import { rivalPowerOf } from './rivalPower.js';
import { seatOutrankedOf } from './seatOutranked.js';
import { seatMembersOf } from './seatMembers.js';
import { ironAtHandOf } from './ironAtHand.js'; // BAR2-PLACES (VW2)
import { timberAtHandOf, timberReachesSawmillOf } from './timberAtHand.js'; // BAR4-HOUSES (H1 (ii)); BAR4-SCENES-2: one home
import { failedFoodSourceOf, enchantingOfferedOf } from './sceneSupply.js'; // BAR4-SCENES (kind A1)
import { tradeAtWorkOf } from './tradeAtWork.js'; // BAR4-SCENES-2 (HW1)
import { goodExportedOf } from './goodExported.js'; // BAR6-SCENES (6b)
import { legalHouseOf } from './legalHouse.js'; // BAR5-THINGS (LAW 4, the notary)
import { appointedPostOf } from './appointedPost.js'; // BAR5-THINGS (LAW 4, the patron)
import { leadingSourceSpentOf } from './leadingSourceSpent.js'; // BAR4-CORPUS-ECO (amendment 5b)
import { ownPlotsOf } from './ownPlots.js'; // BAR4-CORPUS-ECO (amendment 5b; the chair's FW1)
import { terrainClassOf, tradeRouteOf } from './terrain.js';
import { hasOtherNpc } from './otherNpc.js';
import { pairSharesPower } from './sharedPower.js';
import { pairSeatHeld } from './seatHeld.js'; // BAR6-PEOPLE (10d-seat)
import { paidWatchOf } from './guardPay.js'; // BAR6-PEOPLE (10e-house)
import { forceWalksByDayOf } from './forceHours.js'; // BAR8-K-WATCH (13e)
import { faithReadingOf } from '../dossier/faithReading.js';
import { guildOf } from './guild.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { resolveSettlementCulture } from '../resolveCulture.js';
import { criminalStructureKeyOf } from './criminalStructureKey.js';
import { criminalIncomeOf } from './criminalIncome.js'; // BAR4-CORPUS-DEF (C24893)
import { prosperityLabelOf } from '../prosperityRank.js';
import { keepOf } from './keep.js';

/**
 * The two fields `factsOf` reads itself (every other fact is its home's own reading of the record).
 * @typedef {{
 *   tier?: unknown,
 *   economicState?: { prosperity?: unknown, foodSecurity?: { foodRecord?: { foodSources?: unknown } | null } | null } | null,
 * } | null | undefined} FactsOwnFields
 */

/**
 * @param {{} | null | undefined} record a settlement record (any value: each home reads it defensively)
 * @param {{ worldStressors?: ReadonlyArray<unknown> | null, settlementId?: unknown, worldState?: unknown, regionalGraph?: unknown, waterKind?: 'maritime'|'river'|'none' }} [options]
 *   the world, for the two facts a lone record cannot answer whole (the crisis's pulse stressors,
 *   the war state); and, for a birth IN PROGRESS whose partial record carries no terrain yet,
 *   `waterKind` — the generation world law's `portKind`, the same `waterAccessKind` rule
 *   (CENSUS-1c unit 1)
 */
export function factsOf(record, options = {}) {
  return Object.freeze({
    /** fact 1: the crisis kinds, families and the one siege reading */
    get crisis() { return crisisOf(record, options); },
    /** BAR4-SAFETY (F2): whether the besiegers move: the siege condition's own status (`siegeMotion.js`), or null with no siege */
    get siegeMotion() { return siegeMotionOf(record); },
    /** BAR4-CORPUS-DEF (D1): a danger from outside is on its way, a live external-threat tension (`dangerComing.js`) */
    get dangerComing() { return dangerComingOf(record); },
    /** BAR8-DESKS-DEF (12e): the common people press, or have risen, against those in charge, a live popular-uprising tension (`uprising.js`) */
    get uprising() { return uprisingOf(record); },
    /** BAR6-DEFDESK (7a): the page itself prints the country's beasts as a threat (`monsterFrontier.js`) */
    get monsterFrontier() { return monsterFrontierOf(record); },
    /** BAR6-CULTURE (10g-legacy): the event the record's top legacy names destroyed something (`legacyRuin.js`) */
    get legacyRuin() { return legacyRuinOf(record); },
    /** BAR6-CULTURE (6d-court): a court sits on the live roster, the Defense tab's Legal Infrastructure row (`defence.js :: courtHoldersOf`) */
    get courtSits() { return courtHoldersOf(/** @type {import('./defence.js').CourtRecord} */ (record)).length > 0; },
    /** FAULTS-DESKS (13d, FR6): a court sits on the live roster or a prison stands on it (the defence home's own two readers, `courtHoldersOf` and `defenceOf().prison`): the Legal row prints anything but "None" */
    get courtOrGaol() { return courtHoldersOf(/** @type {import('./defence.js').CourtRecord} */ (record)).length > 0 || defenceOf(record).prison; },
    /** R24-A1 (CLOSE-7): sick care at hand, a sick house by name or a resident service whose row tends the sick (`sickCare.js`) */
    get sickCare() { return sickCareOf(/** @type {import('./sickCare.js').SickCareRecord} */ (record)); },
    /** CLOSE-7 THE MIRROR (R24d): the place's own food production band, read off the capacity profile a caller hands (`foodProduction.js`) */
    get foodProduction() { return foodProductionOf; },
    /** fact 2: the months of food in store (number | null) */
    get storesMonths() { return storesMonthsOf(record); },
    /** BAR6-DEFDESK (9c.nothing-over): the town grows more than it eats (`growsMoreThanEats.js`) */
    get growsMoreThanEats() { return growsMoreThanEatsOf(record); },
    /** fact 3: walls / gate / watch / militia / garrison / hospital / healer */
    get defence() { return defenceOf(record); },
    /** the ONE composite (the vocabulary rulings §3): watch ∨ garrison ∨ militia ∨ hired company */
    get guardPresence() { const d = defenceOf(record); return d.watch || d.garrison || d.militia || d.mercenary; },
    /** the rulings §2 (CENSUS-1c, R-E): soldiers = a garrison or a hired company (`forceWordsOf`'s `soldiers`) */
    get soldiers() { const d = defenceOf(record); return d.garrison || d.mercenary; },
    /** the rulings §2 (CENSUS-1c, R-E): someone commands a garrison (`defenseFactsOf.hasCommander`) */
    get commander() { return defenceOf(record).commander; },
    /** the rulings §2 (CENSUS-1c, R-E): the ONE faith reading (`dossier/faithReading.js :: faithReadingOf`) */
    get faith() { return faithReadingOf(record); },
    /** fact 4: water a boat or a net could use */
    get water() { return options.waterKind ? waterOfKind(options.waterKind) : waterOf(record); },
    /** fact 5: a live market */
    get market() { return marketOf(record); },
    /** BAR5-THINGS (LAW 4): a house that writes, witnesses or tries the law stands, by catalogue identity (`legalHouse.js`) */
    get legalHouse() { return legalHouseOf(record); },
    /** BAR6-PEOPLE (10e-house): someone is paid to keep order: the unpaid rota is not the whole watch (`guardPay.js`) */
    get paidWatch() { return paidWatchOf(record); },
    /** BAR8-K-WATCH (13e, BR14 (c)): the town's force walks by day, by its own text (`forceHours.js`) */
    get forceWalksByDay() { const roster = /** @type {{ institutions?: unknown } | null} */ (record)?.institutions; return forceWalksByDayOf(Array.isArray(roster) ? orderForceOf({ institutions: roster }).houses : undefined); }, // BAR8-K-WATCH-2 (BR29 (2)): the one partition's houses, read off the roster alone (the force's pay and cast are not this atom's: factLayers' row)
    /** BAR5-THINGS (LAW 4): the town keeps a post someone is named to: no household head nobody named is its voice (`appointedPost.js`) */
    get appointedPost() { return appointedPostOf(record); },
    /** fact 6: the one starving rule */
    get famine() { return famineOf(record); },
    /** fact 7: magic functions; its level */
    get magic() { return magicOf(record); },
    /** BAR4-CORPUS-DEF (D2): goods the town lives on arrive by magic, an isolated route's needs met (`magicSupply.js`) */
    get magicSupply() { return magicSupplyOf(record); },
    /** BAR5-MAGIC (rule 1a): the reliance reading the page prints, one of none · present · relied-upon · integral */
    get magicRelianceShown() { return relianceShownOf(record); },
    /** fact 8: elder / lord / priest / mayor / occupier / council */
    get rulerKind() { return rulerKindOf(record); },
    /** BAR6-HOUSES (the chair's ruling SV1): the record gives a sovereign, or a war or an occupation supplies one (`sovereign.js`) */
    get sovereign() { return sovereignOf(record); },
    /** BAR6-SCENES (9f): the public legitimacy in its crisis band (`legitimacyCrisis.js`) */
    get legitimacyCrisis() { return legitimacyCrisisOf(record); },
    /** TAIL-TIES (the chair's ruling (T5)): ruled by a body of more than one (`rulingBody.js`), or undefined with no government */
    get rulingBody() { return rulingBodyOf(record); },
    /** fact 9: the mass migration's direction */
    get migration() { return migrationOf(record); },
    /** fact 10: front / aggressor / at war / peace */
    get warState() { return warStateOf(record, options); },
    /** fact 11: a live institution of a kind */
    hasInstitution: (/** @type {string} */ kind) => hasInstitution(record, kind),
    /** R-AE (CENSUS-1f): THE ONE composite sacred house — a temple-kind house (church, cathedral, shrine, chapel, abbey) ∨ a monastery-kind house (monastery, friary), as the roster names them; `temple` stays narrow */
    get sacredHouse() { return hasInstitution(record, 'temple') || hasInstitution(record, 'monastery'); },
    /** CENSUS-4b (the chair's answer 4): a live non-criminal guild on the roster ∨ a guild power (`guild.js`) */
    get guild() { return guildOf(record); },
    /** TAIL-CRISIS-2 (the chair's ruling K6): a power not the governing one stands at Significant or above (`rivalPower.js`) */
    get rivalPower() { return rivalPowerOf(record); },
    /** BAR5-POWERS (the chair's ruling SO1): a power not the governing one stands above the seat (`seatOutranked.js`) */
    get seatOutranked() { return seatOutrankedOf(record); },
    /** BAR6-POWERS (6d-members): the governing power holds more than one member, as the page counts them (`seatMembers.js`) */
    get seatMembers() { return seatMembersOf(record, () => rulingBodyOf(record)); },
    /** BAR2-PLACES (the chair's grant VW2): the smiths have iron to work, worked here or brought in past no siege (`ironAtHand.js`) */
    get ironAtHand() { return ironAtHandOf(record); },
    /** BAR4-HOUSES (H1 (ii)): the town works timber of its own, the input's kind `local` (`timberAtHand.js`, on `houseInputAtHand.js`) */
    get timberAtHand() { return timberAtHandOf(record); },
    /** BAR4-SCENES (kind A1): timber reaches the town's sawyers, local or imported (`timberAtHand.js`, on `houseInputAtHand.js`) */
    get timberReachesSawmill() { return timberReachesSawmillOf(record); },
    /** BAR4-SCENES (kind A1): some house offers enchanting or identification among the services (`sceneSupply.js`) */
    get enchanting() { return enchantingOfferedOf(record); },
    /** BAR4-SCENES-2 (HW1): a trade the scene shows is at work, some house of it not short (`tradeAtWork.js`) */
    get tradeAtWork() { return (/** @type {string} */ key) => tradeAtWorkOf(record, key); },
    /** FAULTS-ROWS (FR12 (3)): the town's fish is bought in, the swap's own fact (`fishBoughtIn.js`) */
    get fishBoughtIn() { return fishBoughtIn(record); },
    /** BAR6-SCENES (6b): a good a scene sends out is on the export list (`goodExported.js`) */
    get goodExported() { return (/** @type {string} */ key) => goodExportedOf(record, key); },
    /** fact 12: small / middling / large */
    get populationBand() { return populationBandOf(record); },
    /** fact 13: the terrain class */
    get terrain() { return terrainClassOf(record); },
    /** fact 13: the trade-route kind (the terrain home's second reader) */
    get route() { return tradeRouteOf(record); },
    /** the tier (a field; the vocabulary's `tier` band) */
    get tier() { return typeof /** @type {FactsOwnFields} */ (record)?.tier === 'string' ? /** @type {{ tier: string }} */ (record).tier : undefined; },
    /** fact 14: a second, named NPC beside this one */
    hasOtherNpc: (/** @type {number | object} */ npc) => hasOtherNpc(record, npc),
    /** R2-CODE-A-14 (the chair's ruling (s1), 2026-11-14): the two cards a pair line names share a power (`sharedPower.js`) */
    sharesPower: (/** @type {unknown} */ pair) => pairSharesPower(record, pair),
    /** BAR4-PEOPLE (the chair's TI1 and its ruling of 11:07): the pair may pass a place, read off the final record, either way round (the draw reads it in the written order: people/pairPlace.js) */
    sharesPlace: (/** @type {unknown} */ pair) => pairPlaceOf(record, pair),
    /** BAR4-PEOPLE (TI1, 11:07): the record holds no other tie between the two (the draw answers it from its drafts: people/ties.js) */
    loneTie: (/** @type {unknown} */ pair) => pairLoneOf(record, pair),
    /** BAR6-PEOPLE (10d-seat): a card of the pair outside the government's category already sits on the governing power (`seatHeld.js`) */
    seatHeld: (/** @type {unknown} */ pair) => pairSeatHeld(record, pair),
    // ── CENSUS-3b unit 1 (the chair's ruling R-E; the vocabulary rulings §2): DELEGATIONS to the
    // one canonical reader each — no field reader, no new logic. ──
    /** the food record's sources (`foodBalance.js :: deriveFoodRecord`), or undefined when it carries none */
    get foodSources() { const v = /** @type {FactsOwnFields} */ (record)?.economicState?.foodSecurity?.foodRecord?.foodSources; return Array.isArray(v) ? v : undefined; },
    /** BAR4-SCENES (kind A1): the food source the famine failed, or null (`sceneSupply.js`) */
    get failedSource() { return failedFoodSourceOf(record); },
    /** BAR4-CORPUS-ECO (BRIEF-BAR4 amendment 5b): the leading food source's grounds are all spent (`leadingSourceSpent.js`) */
    get leadingSourceSpent() { return leadingSourceSpentOf(record); },
    /** BAR4-CORPUS-ECO (the chair's FW1): a subsistence house tills for the table beside a food record with no grain (`ownPlots.js`) */
    get ownPlots() { return ownPlotsOf(record, liveInstitutionNames(/** @type {{ institutions?: unknown }} */ (record))); },
    /** the import list (`canonicalAccessors.js :: canonImports`) */
    get imports() { return canonImports(record); },
    /** BAR8-DESKS-ECO (11c): the good the critical-import lens names is brought in (`criticalImportBroughtIn.js`) */
    get criticalImportBroughtIn() { return criticalImportBroughtInOf(record); },
    /** FAULTS-NEED (FR2): the page's own need list names a need of the family (`needNotBroughtIn.js`) */
    get needNotBroughtIn() { return needNotBroughtInOf(record); },
    /** the export list (`canonicalAccessors.js :: canonExports`) */
    get exports() { return canonExports(record); },
    /** the culture key (`resolveCulture.js :: resolveSettlementCulture`) */
    get culture() { return resolveSettlementCulture(record); },
    /** the criminal structure's key (`criminalStructureKey.js :: criminalStructureKeyOf`, the key `defenseDisplay.js :: deriveCriminalStructure` prints), or 'none' */
    get crime() { return criminalStructureKeyOf(record) ?? 'none'; },
    /** BAR5-SAFETY (L2.law.collapsed): the law's band as the Foundations row prints it (`lawBand.js :: lawBandOf`), or undefined */
    get lawBand() { return lawBandOf(record); },
    /** BAR6-CRIME (9a.wave): the live tensions hold a crime wave (`lawBand.js :: crimeWaveStands`, the one reading) */
    get crimeWave() { return crimeWaveStands(record); },
    /** BAR7-DESKS (9i.crews): rival rings stand (`rivalRings.js :: rivalRingsStand`, the rings the crime key reads) */
    get rivalRings() { return rivalRingsStand(record, criminalStructureKeyOf(record)); },
    /** BAR6-CRIME (9a.watch, 6d-paid): the force that keeps order (`orderForce.js :: orderForceOf`) */
    get orderForce() { return orderForceOf(record); },
    /** BAR4-CORPUS-DEF (C24893): the income list carries a criminal revenue (`criminalIncome.js`) */
    get criminalIncome() { return criminalIncomeOf(record); },
    /** the prosperity band (`prosperityRank.js :: prosperityLabelOf`), lower-cased, or undefined */
    get prosperity() { const l = prosperityLabelOf(/** @type {FactsOwnFields} */ (record)?.economicState?.prosperity).toLowerCase(); return l || undefined; },
    /** what the place can keep up (`keep.js :: keepOf`), read off the prosperity label: `{ bought, funded }` */
    get keep() { return keepOf(/** @type {FactsOwnFields} */ (record)?.economicState?.prosperity); },
    /** PAGE-7 (CAUSES-DATA addendum 3): the houses a trouble's cause names, each group on the live roster by catalogue identity (`causeHouses.js`) */
    get causeHouses() { return causeHousesOf(record); },
    /** PAGE-7 (CAUSES-DATA addendum 4): goods pass through here on their way elsewhere, the economy's stored mark (`entrepot.js`) */
    get entrepot() { return entrepotOf(record); },
    /** DAILY-3 B3 L8 (the chair's E82): office key -> the governing row's form is one of the office's forms (`officeForms.js`, a lazy leaf) */
    get office() { return officesOf(record); },
  });
}

/** @typedef {{ id?: unknown, institution?: { kind?: unknown, family?: unknown, title?: unknown } | null, memberships?: Array<{ power?: unknown, rank?: unknown } | null> }} PairCard */
/** @typedef {{ npcs?: unknown, relationships?: unknown } | null | undefined} PairRecord the record slice the pair readers read */
/** The pair's two cards, as the record's roster holds them. @param {PairRecord} record @param {unknown} pair @returns {[PairCard, PairCard] | null} */
function pairCardsOf(record, pair) {
  if (!Array.isArray(pair) || pair.length !== 2) return null;
  const roster = /** @type {ReadonlyArray<PairCard | null | undefined>} */ (Array.isArray(record?.npcs) ? record.npcs : []);
  const held = (/** @type {unknown} */ x) => {
    if (!x || typeof x !== 'object') return null;
    const c = /** @type {PairCard} */ (x);
    return roster.find((n) => n && c.id != null && String(n.id) === String(c.id)) || c;
  };
  const a = held(pair[0]), b = held(pair[1]);
  return a && b ? [a, b] : null;
}
/** BAR4-PEOPLE (11:07): one house's family or face, or either heads a power the other sits in. @param {PairRecord} record @param {unknown} pair @returns {boolean | undefined} */
function pairPlaceOf(record, pair) {
  const cards = pairCardsOf(record, pair);
  if (!cards || !cards[0].institution || !cards[1].institution) return undefined;
  const [a, b] = cards, ia = a.institution, ib = b.institution;
  if (ia?.kind === 'house' && ib?.kind === 'house' && ia.family && ia.family === ib.family) return true;
  if (typeof ia?.title === 'string' && ia.title === ib?.title) return true;
  const heads = (/** @type {PairCard} */ x, /** @type {PairCard} */ y) => (x.memberships || []).some((m) => m?.rank === 1 && m.power && (y.memberships || []).some((n) => n?.power === m.power));
  return heads(a, b) || heads(b, a);
}
/** BAR4-PEOPLE (11:07): at most one tie between the two in the record's relationships. @param {PairRecord} record @param {unknown} pair @returns {boolean | undefined} */
function pairLoneOf(record, pair) {
  const cards = pairCardsOf(record, pair);
  const ties = /** @type {ReadonlyArray<{ from?: unknown, to?: unknown } | null | undefined> | null} */ (Array.isArray(record?.relationships) ? record.relationships : null);
  if (!cards || !ties) return undefined;
  const [a, b] = cards.map((c) => String(c.id ?? ''));
  return ties.filter((t) => t && ((String(t.from) === a && String(t.to) === b) || (String(t.from) === b && String(t.to) === a))).length <= 1;
}

/**
 * THE FACTS OF A BIRTH IN PROGRESS (CENSUS-1c unit 2): a draw site inside the pipeline holds a
 * partial record — the roster, the config, the tier — and the world law. The crisis home reads
 * `stress` entries (`canonStressors`), so the config's `stressTypes` are handed in that shape; the
 * water home takes the world law's `portKind` (the same `waterAccessKind` rule). The self-check
 * (`cert:false-presumption`) re-asserts every declared atom against the FINAL record, so a fact a
 * later step changes is caught by name.
 * `powerStructure` (CENSUS-4d, R-V): a site drawn after the power step hands ONLY the parts
 * measured as settled at its draw — the NPC goal site hands `{ government }`, so the ruler kind
 * reads (0 of 585 births differ between `generatePopulation` and birth, CENSUS-4c); the factions
 * are not settled there (the density law can empty a guild faction later), so they are not
 * handed. Absent, the record carries none, as before.
 * @param {{ institutions?: unknown, config?: { stressTypes?: unknown, tier?: unknown } | null, tier?: unknown, stress?: unknown, powerStructure?: unknown }} [partial]
 * @param {{ portKind?: 'maritime'|'river'|'none' } | null} [worldLaw]
 */
export function birthFactsOf(partial = {}, worldLaw = null) {
  const config = partial.config || {};
  const stress = partial.stress ?? (Array.isArray(config.stressTypes) ? config.stressTypes.map((/** @type {unknown} */ type) => ({ type })) : []);
  return factsOf({ institutions: partial.institutions, config, tier: partial.tier ?? config.tier, stress, powerStructure: partial.powerStructure }, worldLaw?.portKind ? { waterKind: worldLaw.portKind } : {});
}
import { orderForceOf } from './orderForce.js'; // BAR6-CRIME: the force that keeps order
import { rivalRingsStand } from './rivalRings.js'; // BAR7-DESKS (9i.crews): at the END, no line above moves
import { crimeWaveStands, lawBandOf } from './lawBand.js'; // BAR5-SAFETY (L2.law.collapsed): at the END, no line above moves; BAR6-CRIME: the crime wave
import { criticalImportBroughtInOf } from './criticalImportBroughtIn.js'; // BAR8-DESKS-ECO (11c): at the END, no line above moves
import { uprisingOf } from './uprising.js'; // BAR8-DESKS-DEF (12e): at the END, no line above moves
import { needNotBroughtInOf } from './needNotBroughtIn.js'; // FAULTS-NEED (FR2): at the END, no line above moves
import { fishBoughtIn } from './fishBoughtIn.js'; // FAULTS-ROWS (FR12 (3)): at the END, no line above moves
import { causeHousesOf } from './causeHouses.js'; // PAGE-7 (CAUSES-DATA addendum 3): at the END, no line above moves
import { entrepotOf } from './entrepot.js'; // PAGE-7 (CAUSES-DATA addendum 4): at the END, no line above moves
import { officesOf } from './officeForms.js'; // DAILY-3 B3 L8 (the chair's E82): at the END, no line above moves
import { sickCareOf } from './sickCare.js'; // R24-A1 (CLOSE-7): at the END, no line above moves
import { foodProductionOf } from './foodProduction.js'; // CLOSE-7 THE MIRROR (R24d): at the END, no line above moves
