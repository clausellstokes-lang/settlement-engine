/**
 * crisisDependence.js — WHAT EACH ROW LIVES ON, DECLARED ONCE (TAIL-SERVICES, the chair's ruling S1 of 2026-11-14).
 *
 * A service's or a house's description is written for ORDINARY TIMES. Under a siege, an outbreak or a famine a row
 * that lives on what the crisis stops still prints that description; the ruling is that no description is rewritten
 * for it, row by row: the row is MARKED, and the tab says once that its descriptions are of ordinary times. This table
 * is the one declaration of what each row lives on; `src/domain/display/crisisStoppedRow.js` is the one leaf that
 * reads it against the record's crisis.
 *
 * THE DEPENDENCES (a row may declare several; NONE is a declaration too, not an omission):
 *   travellers  people moving in or out by road, gate or water: lodging for travellers, relays, ferries, caravans,
 *               pilgrims, a priest who comes from elsewhere, burial beyond the gates
 *   goods       goods moving in or out: imports, freight, cargo, customs and tolls on traffic, trade with distant parties
 *   gatherings  people gathering in numbers: performances, spectacles, fairs, market days, the great rites
 *   food: grain | food: livestock | food: fish | food: game
 *               the food a famine can fail (the food record's `failedSource`; a failed mill is the grain's)
 *   beyond the gates
 *               (S8) work done outside the walls by the town's own people (burial in grounds beyond every gate, hunting
 *               parties over the country): a siege stops it; an outbreak does not (it curtails travel, not this)
 *   field work  (BAR3-SERVICES-3, the chair's ruling SV8 of 2026-11-15; vetoable by the owner) the town's own land worked
 *               under a siege: the fields, the herds, the hives, the woods, the pits and the pans. A siege CURTAILS it and
 *               does not stop it, by the record's own reading of the siege: the food balance keeps a third of what the
 *               land grows (`foodImportRates.js :: SIEGE_PRODUCTION_KEPT`; every siege town of the census's 720 keeps a
 *               grown share of 14 to 43 in a hundred), and the chain card of every own-ground chain prints "impaired",
 *               never stopped (`chainStateShown.js :: chainCrisisStateShown`). Its mark is the siege's partial kind,
 *               "Curtailed by the siege." (`crisisStoppedRow.js :: CURTAILED_BY`)
 *   imported input
 *               (BAR4-SERVICES, the chair's direction S1 of 2026-11-16; vetoable by the owner) DERIVED, never declared: a row
 *               that lives on its house's `input` where the record says that input comes in by trade
 *               (`resourceAnalysis.gaps[]`, `kind: 'imported'`: "Smelter runs on imported iron ore"). A siege CURTAILS it: the
 *               house works what it holds and nothing more comes in (the trade record's own reading of a siege: every
 *               dependency on trade "running on existing stockpiles only"). `crisisStoppedRow.js :: housesOnImportedInput`
 *               reads it; its mark is "Curtailed by the siege." ONE HOUSE DECLARES IT (BAR5-MARKS, 2026-11-16): the apothecary
 *               district, whose own description deals in imported medicines (one focus of three): a siege curtails it
 *   input       (the chair's ruling S5, 2026-11-15) the house's own raw input: a row that is what the house MAKES from
 *               what reaches it (the vintner's wine from grapes, the potter's pots from clay, the dairy's milk from
 *               livestock). No crisis stops it; the leaf's second cause reads it: where the page says no input reaches
 *               the row's house (`validationOnPage.js :: resourceGapLines`, "No grapes reach the vintner."), the row
 *               is marked short of it
 *   iron        (BAR5-MARKS, the chair's ruling WM1 of 2026-11-16; vetoable by the owner) the iron a house works: the smiths'
 *               forge work. A war stops it ONLY where the page itself prints the war's reach, the war's iron hook ("War
 *               has taken the iron: … the smiths have nothing to mend tools with"; `facts/warReach.js :: warTakesOf`);
 *               its mark is "Curtailed by the war." No other crisis reads it
 *   working animals
 *               (WM1, the same ruling) the working animals a row hires out or keeps for hire: horse and cart hire, the
 *               stables' and the pack-animal trade's. A war stops it ONLY where the page prints the paddocks' line ("Every
 *               sound animal of working age has a receipt"; `warTakesOf`); its mark is "Curtailed by the war."
 *
 * EVERY KEY IS DECLARED: every service name of `institutionServices.js :: INSTITUTION_SERVICES` and of the informal rows
 * `servicesGenerator.js` writes, and every catalogue id of `institutionalCatalog.js` (the walker,
 * tests/components/crisisStoppedRows.test.jsx, fails on a key missing here or a key here that names nothing).
 * A new service or house takes its line here, NONE when it lives on none of these.
 *
 * A service NAME can mean different things in different menus ("Burial" at a graveyard and at a ground beyond the
 * gates): SERVICE_DEPENDENCE_BY_DESC declares those rows by the row's own description, and every other row of the name
 * takes the name's line.
 *
 * Pure data (it reads one name from `institutionServices.js`, pure data too). VETOABLE (the owner's).
 */

import { INSTITUTION_SERVICES } from './institutionServices.js';

export const TRAVELLERS = 'travellers';
export const GOODS = 'goods';
export const GATHERINGS = 'gatherings';
export const GRAIN = 'food: grain';
export const LIVESTOCK = 'food: livestock';
export const FISH = 'food: fish';
export const GAME = 'food: game';
/**
 * THE FOOD A FAMINE FAILED, by the food record's `failedSource` (a failed mill is the grain's; a famine whose record names
 * no source failed the crops, the grain: the reader's fallback). SEAM-ECON item 1 (2026-11-17): the Exports' reading of a
 * scarce harvest (`display/tradeListDisplay.js :: harvestScarceHere`) reads it here, import-free, because the mark's own
 * leaf (`display/crisisStoppedRow.js`, whose private `FOOD_OF_FAILED_SOURCE` is the same table) sits in an import cycle
 * with the trade lists; `tests/domain/bar6SeamEcon.test.js` holds the two readings equal.
 * @type {Readonly<Record<string, string>>}
 */
export const FAMINE_FAILED_FOOD = Object.freeze({ grain: GRAIN, mill: GRAIN, livestock: LIVESTOCK, fish: FISH, game: GAME });
export const INPUT = 'input';
export const GATES = 'beyond the gates';
export const FIELD_WORK = 'field work';
export const IMPORTED_INPUT = 'imported input';
export const IRON = 'iron'; // BAR5-MARKS (WM1): the war's iron, `facts/warReach.js :: WAR_TAKES_IRON` spells the same word
export const WORKING_ANIMALS = 'working animals'; // BAR5-MARKS (WM1): the war's animals, `WAR_TAKES_ANIMALS`
/** @type {ReadonlyArray<string>} */
export const NONE = Object.freeze([]);
/** Every dependence word, in the order above. @type {ReadonlyArray<string>} */
export const DEPENDENCES = Object.freeze([TRAVELLERS, GOODS, GATHERINGS, GRAIN, LIVESTOCK, FISH, GAME, IMPORTED_INPUT, INPUT, GATES, FIELD_WORK, IRON, WORKING_ANIMALS]);

/**
 * THE GAPS THE RECORD HOLDS EVERYWHERE (the chair's ruling S7, 2026-11-15; vetoable by the owner): a house whose input the
 * record says does not reach it in 90% or more of the towns that hold it is the record's fault, not a state of the town,
 * and the leaf's second cause does not mark it. Measured on the census 720 at d7c032485 (towns holding the house · towns
 * whose page says no input reaches it); the record's measuring seat holds this class. The houses under the line, marked:
 * Dairy farmer 42 · 36, Tannery 10 · 7, Potter 269 · 172, Brickmaker 228 · 132, Fishmonger 11 · 4, Sawmill 23 · 7,
 * Salt works 94 · 25, Charcoal burner 153 · 30, Alchemist shop 17 · 2, Apothecary 19 · 2, Smelter 238 · 3, Bakers 262 · 0.
 * RE-MEASURED (BAR3-SERVICES, 2026-11-15, on the census 720 at 59185b62a): the record no longer holds either gap everywhere:
 * Vintner 184 · 11 ("No grapes reach the vintner." in 11 towns whose Table wine printed unmarked), Glassblower 13 · 1. Both
 * are under the line now, and out of the table: the page's gap line and the row's mark agree again. The table stays, empty,
 * for the next house the record gaps everywhere.
 * @type {Readonly<Record<string, string>>} house name -> its two counts
 */
export const INPUT_GAP_HELD_EVERYWHERE = Object.freeze({});

/**
 * A service whose catalogue name holds the word the style law retired (TAIL-CRISIS-7, `tests/lint/styleLaw.walker.test.js`):
 * the key is READ from the catalogue that holds the name (`institutionServices.js`, the criminal houses' menu), never spelled
 * here, so this table adds no printed word of its own. The one service of every menu whose name opens on that word and is
 * information; a catalogue that renames it leaves no key, and the walker in tests/components/crisisStoppedRows.test.jsx reds.
 */
const CRIME_INFORMATION_SERVICE = /** @type {string} */ (Object.values(INSTITUTION_SERVICES).flatMap((menu) => Object.keys(menu))
  .find((name) => /^faction\b/i.test(name) && / information$/.test(name)));

/** Service name -> what its rows live on. @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const SERVICE_DEPENDENCE = Object.freeze({
  "Abduction for hire": NONE,
  "Accommodation": Object.freeze([TRAVELLERS]),
  "Administrative orders": NONE,
  "Administrative oversight": NONE,
  "Adoption placement": NONE,
  "Advanced education": NONE,
  "Advanced scribing": NONE,
  "Aerial deterrence": NONE,
  "Aerial reconnaissance": NONE,
  "Aged wine": Object.freeze([INPUT]),
  "Airship berths": NONE,
  "Alchemical components": NONE,
  "Alchemical ingredients": NONE,
  "Alchemical products": NONE,
  "Alchemical reagents": NONE,
  "Ale (barrel)": Object.freeze([GRAIN]),
  "Ale (jug)": Object.freeze([GRAIN]),
  "Ale production": Object.freeze([GRAIN]),
  "Alloy production": Object.freeze([INPUT]),
  "Alms": NONE,
  "Animal spectacles": Object.freeze([GATHERINGS]),
  "Animal training": NONE,
  "Antitoxins": NONE,
  "Appeals": NONE,
  "Appeals court": NONE,
  "Appraisal": NONE,
  "Appraisal (unofficial)": NONE,
  "Apprenticeship": NONE,
  "Apprenticeship and training": NONE,
  "Apprenticeship placement": NONE,
  "Apprenticeship programs": NONE,
  "Approaching threat warning": NONE,
  "Arcane identification": NONE,
  "Arcane instruction": NONE,
  "Arcane research": NONE,
  "Arcane scribing": NONE,
  "Arcane services (illicit)": NONE,
  "Arcane training": NONE,
  "Archival search": NONE,
  "Archive consultation": NONE,
  "Armed escort": Object.freeze([TRAVELLERS]), // BAR4-SERVICES S1 (C19622): an escort goes out past the gates
  "Armour repair": NONE,
  "Armour warding": NONE,
  "Arrow and bolt production": NONE,
  "Arrow production": NONE,
  "Assassination": NONE,
  "Assassination contracts": NONE,
  "Assay (informal)": NONE,
  "Assay service": NONE,
  "Bail hearings": NONE,
  "Barge construction": NONE,
  "Barrel making": NONE,
  "Basic carpentry": NONE,
  "Basic food": Object.freeze([GRAIN]),
  "Basic horse care": Object.freeze([TRAVELLERS]),
  "Basic provisions": Object.freeze([TRAVELLERS]),
  "Basic repairs": NONE,
  "Basic smithing": NONE,
  "Basic wound care": NONE,
  "Batch baking": Object.freeze([GRAIN, INPUT]),
  "Bathing": NONE,
  "Beast acquisition": NONE,
  "Beeswax": NONE,
  "Beeswax candles": NONE,
  "Berth assignment": Object.freeze([GOODS]),
  "Betting": NONE,
  "Bird message": NONE,
  "Birth assistance": NONE,
  "Black market access": NONE,
  "Black market bazaar": NONE,
  "Bless": NONE,
  "Boat repair": NONE,
  "Bodyguard service": NONE,
  "Bonded storage": Object.freeze([GOODS]),
  "Book reproduction": NONE,
  "Bookmaking": NONE,
  "Boot repair": NONE,
  "Bounty hunting": NONE,
  "Bow crafting": NONE,
  "Bow maintenance": NONE,
  "Bribe a guard": NONE,
  "Broadsheet publication": NONE,
  "Broker introduction": NONE,
  "Brokerage": NONE,
  "Building construction": NONE,
  "Building repairs": NONE,
  "Bulk leather": NONE,
  "Bullion exchange": NONE,
  "Burglary": NONE,
  "Burglary services": NONE,
  "Burial": NONE,
  "Burial of the poor": NONE,
  "Butter": Object.freeze([LIVESTOCK, INPUT]),
  "Buyer introductions": NONE,
  "Bylaws and ordinances": NONE,
  "Caravan assembly": Object.freeze([TRAVELLERS, GOODS]),
  "Caravan insurance": Object.freeze([GOODS]),
  "Caravan organization": Object.freeze([TRAVELLERS, GOODS]),
  "Cargo freight": Object.freeze([GOODS]),
  "Cargo inspection": Object.freeze([GOODS]),
  "Cargo loading": Object.freeze([GOODS]),
  "Cargo loading and unloading": Object.freeze([GOODS]),
  "Cargo shipping": Object.freeze([GOODS]),
  "Cargo storage": Object.freeze([GOODS]),
  "Carriage hire": Object.freeze([WORKING_ANIMALS]), // BAR5-MARKS (WM1): the horses that draw it
  "Carved goods": NONE,
  "Cask repair": NONE,
  "Central register": NONE,
  "Certification": NONE,
  "Charcoal supply": Object.freeze([INPUT]),
  "Charitable giving": NONE,
  "Cheese": Object.freeze([LIVESTOCK, INPUT]),
  "Child care": NONE,
  "Citizen registration": NONE,
  "Citywide religious infrastructure": NONE,
  "Civic administration": NONE,
  "Civic announcements": NONE,
  "Civic law enforcement": NONE,
  "Civic licensing": NONE,
  "Civic voting": NONE,
  "Civil disputes": NONE,
  "Civil litigation": NONE,
  "Claim grading": NONE,
  "Claim weighing": NONE,
  "Clean water distribution": NONE,
  "Clean water supply": NONE,
  "Cloth production": NONE,
  "Coin appraisal": NONE,
  "Coin assessment": NONE,
  "Coin blank purchase": NONE,
  "Coin exchange": NONE,
  "Coin inspection": NONE,
  "Coin production": NONE,
  "Cold reading": NONE,
  "Cold storage": NONE,
  "Combat entertainment": Object.freeze([GATHERINGS]),
  "Combat instruction": NONE,
  "Commercial announcements": NONE,
  "Commercial loans": NONE,
  "Commission sales": NONE,
  "Commission work": NONE,
  "Commissioned maps": NONE,
  "Commissions": NONE,
  "Communal decisions": NONE,
  "Communal labour": NONE,
  "Community gathering": NONE,
  "Community mediation": NONE,
  "Companionship": NONE,
  "Component identification": NONE,
  "Component sourcing": NONE,
  "Composition commission": NONE,
  "Compound medicines": Object.freeze([INPUT]),
  "Confession": Object.freeze([TRAVELLERS]), // TAIL-SERVICES-3: a row of Access to parish church only: the walk to a neighbour's church
  "Consignment sales": NONE,
  "Construction work": NONE,
  "Consultation": NONE,
  "Contraband": NONE,
  "Contraband delivery": Object.freeze([GOODS]),
  "Contraband fencing": NONE,
  "Contraband goods": NONE,
  "Contraband licensing": Object.freeze([GOODS]), // BAR3-SERVICES (S2): goods moving through; a siege stops it
  "Contraband purchase": NONE,
  "Contraband transport": Object.freeze([GOODS]),
  "Contract board": NONE,
  "Contract killing": NONE,
  "Contract recording": NONE,
  "Contract witnessing": NONE,
  "Convoy escort": Object.freeze([GOODS]),
  "Copying": NONE,
  "Copying and reproduction": NONE,
  "Copying services": NONE,
  "Copyist services": NONE,
  "Cordage (specialty)": NONE,
  "Correspondent hire": NONE,
  "Costume and prop hire": NONE,
  "Court access": NONE,
  "Courts and adjudication": NONE,
  "Cream": Object.freeze([INPUT]),
  "Credit letters": Object.freeze([GOODS]),
  "Crime reporting": NONE,
  "Crime response": NONE,
  "Criminal arbitration": NONE,
  "Criminal proceedings": NONE,
  "Criminal protection": NONE,
  "Criminal trials": NONE,
  "Crossing fee": Object.freeze([TRAVELLERS, GOODS]),
  "Cured goods": Object.freeze([INPUT]),
  "Curfew enforcement": NONE,
  "Currency exchange": NONE,
  "Curse removal": NONE,
  "Custom boots": NONE,
  "Custom carving": NONE,
  "Custom commission": NONE,
  "Custom commissions": NONE,
  "Custom containers": NONE,
  "Custom dimensioning": Object.freeze([INPUT]),
  "Custom dyeing": NONE,
  "Custom enchanting": NONE,
  "Custom footwear": NONE,
  "Custom garments": NONE,
  "Custom glasswork": Object.freeze([INPUT]),
  "Custom orders": NONE,
  "Custom pottery": Object.freeze([INPUT]),
  "Custom printing": NONE,
  "Custom weaving": NONE,
  "Customs brokerage": Object.freeze([GOODS]),
  "Customs bypass": Object.freeze([GOODS]),
  "Cut stone": NONE,
  "Defence services": NONE,
  "Delivery contracts": Object.freeze([GOODS]),
  "Deposit accounts": NONE,
  "Dice games": NONE,
  "Dimensional storage": NONE,
  "Diplomatic functions": NONE,
  "Disappear quietly": NONE,
  "Disappearances": NONE,
  "Discreet commission": NONE,
  "Discreet information": NONE,
  "Discreet passage": NONE,
  "Discreet purchase": NONE,
  "Discreet sale": NONE,
  "Discreet services": NONE,
  "Dispensations": NONE,
  "Dispensations and annulments": NONE,
  "Dispute adjudication": NONE,
  "Dispute arbitration": NONE,
  "Dispute mediation": NONE,
  "Dispute resolution": NONE,
  "Dispute resolution (criminal)": NONE, // BAR3-SERVICES (S2): "(guild)" renamed; the town may have no guild
  "District security": NONE,
  "District trading": NONE,
  "Diverse programming": Object.freeze([GATHERINGS]),
  "Divination and scrying": NONE,
  "Document forgery": NONE,
  "Document printing": NONE,
  "Document reading": NONE,
  "Document writing": NONE,
  "Domestic staff": NONE,
  "Donation accepted": NONE,
  "Draconic consultation": NONE,
  "Drainage pipe": Object.freeze([INPUT]),
  "Dream walking": NONE,
  "Drink service": Object.freeze([GRAIN]), // BAR4-SERVICES S1: ale, the grain's
  "Driver hire": NONE,
  "Druidic consultation": NONE,
  "Dry dock": NONE,
  "Dungeon clearance": NONE,
  "Dungeon maps": NONE,
  "Duties and tariffs": Object.freeze([GOODS]),
  "Dye materials": NONE,
  "Dyed cloth": NONE,
  "Dyeing": NONE,
  "Education": NONE,
  "Education (basic)": NONE,
  "Educational network": NONE,
  "Emergency defense": NONE,
  "Emergency dispatch": Object.freeze([TRAVELLERS]),
  "Emergency extraction": NONE,
  "Emergency shelter": NONE,
  "Emergency treatment": NONE,
  "Enchanting services": NONE,
  "Enchantment services": NONE,
  "Entertainment": Object.freeze([GATHERINGS]),
  "Entertainment and spectacle": Object.freeze([GATHERINGS]),
  "Entertainment venues": Object.freeze([GATHERINGS]),
  "Entry inspection": Object.freeze([TRAVELLERS, GOODS]),
  "Equipment and supply": NONE,
  "Equipment hire": NONE,
  "Equipment purchase": NONE,
  "Escort": Object.freeze([TRAVELLERS]),
  "Escort contracts": Object.freeze([TRAVELLERS]),
  "Escort service": NONE,
  "Estate management": NONE,
  "Estate sales": NONE,
  "Evidence removal": NONE,
  "Exotic animal sales": Object.freeze([GOODS]),
  "Exotic components": NONE,
  "Exotic creatures for sale": NONE,
  "Exotic extraplanar goods": NONE,
  "Exotic goods": Object.freeze([GOODS, GATHERINGS]),
  "Exotic imports": Object.freeze([GOODS]),
  "Experimental commissions": NONE,
  "Experimental compounds": Object.freeze([INPUT]),
  "Expert consultation": NONE,
  "Extortion (structured)": NONE,
  "Extraplanar relations": NONE,
  [CRIME_INFORMATION_SERVICE]: NONE,
  "Fake prophecy": NONE,
  "False prophecy": NONE,
  "Family decisions": NONE,
  "Feather trade": NONE,
  "Fence (stolen goods)": NONE,
  "Fence services": NONE,
  "Fencing": NONE,
  "Fencing stolen goods": NONE,
  "Ferry service": Object.freeze([TRAVELLERS]),
  "Festival coordination": Object.freeze([GATHERINGS]),
  "Fever and illness": NONE,
  "Fine garments": NONE,
  "Fine metalwork": NONE,
  "Fine payment": NONE,
  "Fire suppression": NONE,
  "Fired brick": Object.freeze([INPUT]),
  "Fish oil": NONE,
  "Food and drink (all grades)": NONE,
  "Forbidden components": NONE,
  "Foreign merchants": Object.freeze([TRAVELLERS, GOODS, GATHERINGS]),
  "Forged travel papers": NONE,
  "Fortune telling": NONE,
  "Freight haulage": Object.freeze([GOODS]),
  "Freight insurance": NONE,
  "Fresh bread": Object.freeze([GRAIN, INPUT]),
  "Fresh fish": Object.freeze([FISH, INPUT]),
  "Fresh fish retail": Object.freeze([FISH]),
  "Fresh meat": Object.freeze([LIVESTOCK]),
  "Fresh milk": Object.freeze([LIVESTOCK, INPUT]),
  "Fresh produce": NONE,
  "Front company formation": NONE,
  "Full accommodation": NONE,
  "Full gambling services": NONE,
  "Full religious coverage": NONE,
  "Full spell services": NONE,
  "Fulled cloth": NONE,
  "Fulling (contract)": NONE,
  "Fulling cloth": NONE,
  "Funeral procession": NONE,
  "Fur garments": NONE,
  "Furniture making": NONE,
  "Furs and pelts": NONE,
  "Gambling": NONE,
  "Game meat": Object.freeze([GAME]),
  "Games of chance": NONE,
  "Garment repair": NONE,
  "Gate control": Object.freeze([TRAVELLERS, GOODS]),
  "Gate duty": Object.freeze([TRAVELLERS]),
  "Gated entry": NONE,
  "Gem purchase": NONE,
  "General trade": NONE,
  "Gladiator hire": NONE,
  "Gladiator training": NONE,
  "Gladiatorial combat": Object.freeze([GATHERINGS]),
  "Glass vessels": Object.freeze([INPUT]),
  "Glassware": NONE,
  "Goods movement": Object.freeze([GOODS]),
  "Goods purchase": NONE,
  "Goods storage": NONE,
  "Graded purchase": NONE,
  "Grain at harvest": Object.freeze([GRAIN]),
  "Grain grinding": Object.freeze([GRAIN]),
  "Grain loans": Object.freeze([GRAIN]),
  "Grain milling": Object.freeze([GRAIN]),
  "Grain milling (a day away)": Object.freeze([GRAIN]),
  "Grain storage": Object.freeze([GRAIN]), // BAR4-SERVICES S1: the grain reserves a grain famine draws down
  "Grave maintenance": NONE,
  "Grave marking": NONE,
  "Gray market goods": NONE,
  "Grooming": NONE,
  "Grooming and care": NONE,
  "Grudge matches": NONE,
  "Guard duty": NONE,
  "Guard hire": NONE,
  "Guard hire (caravan)": Object.freeze([TRAVELLERS]),
  "Guild arbitration": NONE,
  "Guild plot": NONE,
  "Guild protection": NONE,
  "Hallmarking": NONE,
  "Hard labour contracts": NONE,
  "Hazardous material disposal": NONE,
  "Hazardous tasks": NONE,
  "Healing": NONE,
  "Healing (nature)": NONE,
  "Healing herbs": NONE,
  "Heavy labor": NONE,
  "Heavy labour": NONE,
  "Hedge medicine": NONE,
  "Herbal medicines": NONE,
  "Herbal remedies": Object.freeze([INPUT]),
  "Herbalism and healing": NONE,
  "Hidden quarter access": NONE,
  "Hidden storage": NONE,
  "Hide processing": Object.freeze([INPUT]),
  "Hide sourcing": NONE,
  "Hideout rental": NONE,
  "High religious ceremony": Object.freeze([GATHERINGS]),
  "High-end retail": Object.freeze([GOODS]),
  "High-level nature magic": NONE,
  "High-stakes tables": NONE,
  "Higher education": NONE,
  "Higher healing": NONE,
  "Hired muscle": NONE,
  "Hired porters": NONE,
  "Hiring day": NONE,
  "Hiring hall": NONE,
  "Historical research": NONE,
  "Holding cells": NONE,
  "Honey": NONE,
  "Horse boarding": NONE,
  "Horse change": Object.freeze([TRAVELLERS]),
  "Horse hire": Object.freeze([TRAVELLERS, WORKING_ANIMALS]), // BAR5-MARKS (WM1): the war's receipts
  "Horse trading": NONE,
  "Horseshoeing": NONE,
  "Hospitality": Object.freeze([TRAVELLERS]),
  "Hue and cry": NONE,
  "Hunting guide hire": NONE,
  "Hunting trophies": NONE,
  "Illicit goods": NONE,
  "Illicit services": NONE,
  "Import permits": Object.freeze([GOODS]),
  "Import processing": Object.freeze([GOODS]),
  "Indulgences and dispensations": NONE,
  "Infiltration": NONE,
  "Information": NONE,
  "Information brokerage": NONE,
  "Information exchange": NONE,
  "Information hub": Object.freeze([TRAVELLERS]),
  "Information network": NONE,
  "Ingredient sourcing": NONE,
  "Instant messaging": NONE,
  "Insurance": NONE,
  "Intelligence": NONE,
  "Intelligence gathering": NONE,
  "Intelligence network": NONE,
  "Intelligence on officials": NONE,
  "Intelligence services": NONE,
  "Inter-guild arbitration": NONE,
  "International shipping": Object.freeze([GOODS]),
  "Intimidation only": NONE,
  "Inventory management": NONE,
  "Investment": NONE,
  "Investment brokering": NONE,
  "Investment pooling": NONE,
  "Iron refining": Object.freeze([INPUT]),
  "Item appraisal": NONE,
  "Item identification": NONE,
  "Jewellery appraisal": NONE,
  "Jewellery purchase": NONE,
  "Joint ventures": NONE,
  "Labor hire": NONE,
  "Labor placement": NONE,
  "Laborer hire": NONE,
  "Labour hire": NONE,
  "Language translation": NONE,
  "Large loans": NONE,
  "Large-scale trading": Object.freeze([TRAVELLERS, GOODS, GATHERINGS]),
  "Last refuge": NONE,
  "Last rites": Object.freeze([TRAVELLERS]),
  "Law enforcement": NONE,
  "Leather goods": NONE,
  "Leather production": NONE,
  "Legal appeals": NONE,
  "Legal documents": NONE,
  "Legal education": NONE,
  "Legal representation": NONE,
  "Legitimate cover documents": NONE,
  "Legitimate facade": NONE,
  "Letter drafting": NONE,
  "Letter writing": NONE,
  "Letters of credit": Object.freeze([GOODS]),
  "Library access": NONE,
  "Licensing and charters": NONE,
  "Life ceremonies": NONE,
  "Lifting and ossuary": NONE,
  "Livery and boarding": NONE,
  "Livery and uniforms": NONE,
  "Livestock auction": Object.freeze([GATHERINGS, LIVESTOCK]),
  "Livestock auctions": Object.freeze([GATHERINGS, LIVESTOCK]),
  "Livestock management": NONE,
  "Livestock sales": Object.freeze([LIVESTOCK]),
  "Loans": NONE,
  "Loans (secured)": NONE,
  "Local gossip": NONE,
  "Local intelligence": NONE,
  "Lodging": Object.freeze([TRAVELLERS]),
  "Lodging (all grades)": Object.freeze([TRAVELLERS]),
  "Lodging (rooms to let)": NONE,
  "Long-distance messages": NONE,
  "Long-distance teleportation": NONE,
  "Long-term incarceration": NONE,
  "Long-term recovery": NONE,
  "Lost property": NONE,
  "Low-level enforcement": NONE,
  "Lucid dream experiences": NONE,
  "Lucky charms": NONE,
  "Lumber milling": Object.freeze([INPUT]),
  "Magic item appraisal": NONE,
  "Magic item repair": NONE,
  "Magic item sales": NONE,
  "Magical consultation": NONE,
  "Magical courier": NONE,
  "Magical forgery": NONE,
  "Magical identification": NONE,
  "Magical item market": NONE,
  "Magical research access": NONE,
  "Magical training": NONE,
  "Major contracts": NONE,
  "Major religious services": Object.freeze([GATHERINGS]),
  "Malt (surplus)": Object.freeze([GRAIN]),
  "Malted barley": Object.freeze([GRAIN]),
  "Manufactured claim": NONE,
  "Manufactured goods (bulk)": NONE,
  "Map archive access": NONE,
  "Map making": NONE,
  "Map reading": NONE,
  "Market access": NONE,
  "Market charter and tolls": NONE,
  "Market intelligence": Object.freeze([GOODS]),
  "Market monopoly enforcement": NONE,
  "Marriage and inheritance": NONE,
  "Marriage ceremony": Object.freeze([TRAVELLERS]), // TAIL-SERVICES-3: a row of Access to parish church only
  "Massage": NONE,
  "Masterwork items": NONE,
  "Mead": NONE,
  "Mead (small batch)": NONE,
  "Meals": NONE,
  "Meals and drink": NONE,
  "Medical care (basic)": NONE,
  "Medical consultation": NONE,
  "Medical training": NONE,
  "Medical treatment": NONE,
  "Medicines and compounds": NONE,
  "Member discipline": NONE,
  "Member support": NONE,
  "Memorial inscription": NONE,
  "Memory access": NONE,
  "Memory extraction": NONE,
  "Mercenary hire": NONE,
  "Merchant networking": NONE,
  "Message receipt": Object.freeze([TRAVELLERS]),
  "Message relay": Object.freeze([TRAVELLERS]),
  "Metal purity testing": NONE,
  "Metalworking training": NONE,
  "Midwifery": NONE,
  "Military boots": NONE,
  "Military command": NONE,
  "Military escort": NONE,
  "Military supply": NONE,
  "Military training": NONE,
  "Military training grounds": NONE,
  "Mill power": NONE,
  "Milling service": NONE,
  "Millstone cutting": NONE,
  "Minor spells": NONE,
  "Minor spells for hire": NONE,
  "Missing persons": NONE,
  "Money changing": NONE,
  "Money laundering": NONE,
  "Monster bounties": NONE,
  "Monster components": NONE,
  "Monster exhibitions": NONE,
  "Monster handling": NONE,
  "Monster lore": NONE,
  "Monster threat assessment": NONE,
  "Muscle for hire": NONE,
  "Music and entertainment": Object.freeze([GATHERINGS]),
  "Music and song": Object.freeze([GATHERINGS]),
  "Music lessons": NONE,
  "Musical training": NONE,
  "Muster training": NONE,
  "Name check": NONE,
  "Nature arbitration": NONE,
  "Nature blessing": NONE,
  "Nature magic services": NONE,
  "Network coordination": Object.freeze([GATHERINGS]),
  "Neutral meeting space": NONE,
  "News and information": NONE,
  "Night patrol": NONE,
  "Night watch": NONE,
  "Night watch hire": NONE,
  "Night work": NONE,
  "Nightmare removal": NONE,
  "No-questions sales": NONE,
  "No-questions transport": Object.freeze([GOODS]),
  "Noble administration": NONE,
  "Noble registration": NONE,
  "Notary services": NONE,
  "Offal and by-products": NONE,
  "Official announcements": NONE,
  "Optical lenses": NONE,
  "Organised games": NONE,
  "Overnight boarding": NONE,
  "Overnight stabling": Object.freeze([TRAVELLERS]),
  "Pack animal hire": Object.freeze([WORKING_ANIMALS]), // BAR5-MARKS (WM1)
  "Pack animal sales": NONE,
  "Paid companionship": NONE,
  "Parcel forwarding": Object.freeze([TRAVELLERS, GOODS]),
  "Party matching": NONE,
  "Passenger boarding": Object.freeze([TRAVELLERS]),
  "Passenger transport": Object.freeze([TRAVELLERS]),
  "Passenger vessel": Object.freeze([TRAVELLERS]),
  "Pastries": Object.freeze([INPUT]),
  "Pasturage": Object.freeze([TRAVELLERS]),
  "Patrol service": NONE,
  "Patron sponsorship": NONE,
  "Patronage": NONE,
  "Peat fuel supply": NONE,
  "Performance": Object.freeze([GATHERINGS]),
  "Performance tickets": Object.freeze([GATHERINGS]),
  "Performances": Object.freeze([GATHERINGS]),
  "Perimeter defense": NONE,
  "Permit applications": NONE,
  "Perpetual plot": NONE,
  "Petitions": NONE,
  "Petty crime": NONE,
  "Pilgrim shelter": Object.freeze([TRAVELLERS]),
  "Pilgrimage destination": Object.freeze([TRAVELLERS, GATHERINGS]),
  "Pilgrimage services": Object.freeze([TRAVELLERS, GATHERINGS]),
  "Pilotage": Object.freeze([GOODS]),
  "Planar information": NONE,
  "Planar trade brokerage": NONE,
  "Planar transit": NONE,
  "Plot brokerage": NONE,
  "Poison antidotes": NONE,
  "Poison supply": NONE,
  "Poisons (discreet)": NONE,
  "Political influence": NONE,
  "Political lobbying": NONE,
  "Political power": NONE,
  "Poor assessment": NONE,
  "Poor relief": NONE,
  "Portal access": NONE,
  "Porterage": NONE,
  "Potion brewing": Object.freeze([INPUT]),
  "Potion production": NONE,
  "Potions and elixirs": NONE,
  "Pottery and ceramics": Object.freeze([INPUT]),
  "Precision metalwork": NONE,
  "Preserved fish": Object.freeze([FISH]),
  "Price discovery": NONE,
  "Price fixing": NONE,
  "Price reporting": NONE,
  "Price stabilisation": NONE,
  "Private box hire": NONE,
  "Private entertainment": NONE,
  "Private hire": NONE,
  "Private rooms": NONE,
  "Privateer licensing": NONE,
  "Processed textiles": NONE,
  "Prophetic consultation": NONE,
  "Prophetic dreams": NONE,
  "Protection": NONE,
  "Protection (informal)": NONE,
  "Protection racket": NONE,
  "Protection rackets": NONE,
  "Public auction": Object.freeze([GATHERINGS]),
  "Public auctions": Object.freeze([GATHERINGS]),
  "Public debate": NONE,
  "Public games": Object.freeze([GATHERINGS]),
  "Public performance": Object.freeze([GATHERINGS]),
  "Public punishment": NONE,
  "Public record access": NONE,
  "Public records": NONE,
  "Public works": NONE,
  "Publishing": NONE,
  "Purify food and water": NONE,
  "Quality bows": NONE,
  "Quality certification": NONE,
  "Quality control": NONE,
  "Quality furs": NONE,
  "Quality standards": NONE,
  "Quality weapons and armour": NONE,
  "Quarantine": NONE,
  "Quest coordination": NONE,
  "Ransom facilitation": NONE,
  "Rapid response": NONE,
  "Rare materials": NONE,
  "Rare texts": NONE,
  "Rationing": NONE,
  "Raw extraction": NONE,
  "Raw ore extraction": NONE,
  "Raw pelts (bulk)": NONE,
  "Rawhide": Object.freeze([INPUT]),
  "Record filing": NONE,
  "Record keeping": NONE,
  "Record of custom": NONE,
  "Records": NONE,
  "Recovery wards": NONE,
  "Recruitment screening": NONE,
  "Refuge in crisis": NONE,
  "Register of the dead": NONE,
  "Registry": NONE,
  "Regular performances": Object.freeze([GATHERINGS]),
  "Rehearsal space hire": NONE,
  "Relics (dubious provenance)": NONE,
  "Religious carvings": NONE,
  "Religious courts": NONE,
  "Religious hierarchy": NONE,
  "Religious network": NONE,
  "Religious services": NONE,
  "Reliquary access": Object.freeze([TRAVELLERS]),
  "Remove minor disease": NONE,
  "Repair and refit": NONE,
  "Repairs": NONE,
  "Rescue operations": NONE,
  "Research": NONE,
  "Research access": NONE,
  "Research facilities": NONE,
  "Restraint equipment": NONE,
  "Resurrection services": NONE,
  "Rite of entry": Object.freeze([TRAVELLERS]), // TAIL-SERVICES-3: a row of Access to parish church only
  "River crossing": Object.freeze([TRAVELLERS]),
  "River piloting": NONE,
  "Road intelligence": Object.freeze([GOODS]),
  "Road register": NONE,
  "Roof inspection": NONE,
  "Roof tiles": Object.freeze([INPUT]),
  "Rope": NONE,
  "Rope (standard)": NONE,
  "Rope repair": NONE,
  "Route consultation": NONE,
  "Route handoff": Object.freeze([GOODS]),
  "Route information": NONE,
  "Route intelligence": Object.freeze([GOODS]),
  "Route planning": Object.freeze([GOODS]),
  "Royal audience": NONE,
  "Royal audiences": NONE,
  "Rubble and aggregate": NONE,
  "Rumour brokering": NONE,
  "Rumour collection": NONE,
  "Rune inscription": NONE,
  "Safe deposit": NONE,
  "Safe house": NONE,
  "Safe houses": NONE,
  "Safe passage": NONE,
  "Safekeeping": NONE,
  "Salt production": Object.freeze([INPUT]),
  "Salted fish": Object.freeze([FISH, INPUT]),
  "Salting and preservation": Object.freeze([LIVESTOCK]),
  "Sanctuary": NONE,
  "Sausage and charcuterie": Object.freeze([LIVESTOCK]),
  "Sawing timber": NONE,
  "Scholarly community": NONE,
  "Scrying (limited)": NONE,
  "Sea charts": NONE,
  "Seasonal rituals": NONE,
  "Seasonal specialties": NONE,
  "Seasonal trading": Object.freeze([TRAVELLERS, GOODS, GATHERINGS]),
  "Seasonal workers": NONE,
  "Secure communications": NONE,
  "Sell stolen goods": NONE,
  "Ship chandlery": NONE,
  "Ship construction": NONE,
  "Shipyard access": NONE,
  "Shoe repair": NONE,
  "Shoes (standard)": NONE,
  "Short accommodation": NONE,
  "Signal fire": NONE,
  "Silent retreat": NONE,
  "Simple construction": NONE,
  "Skilled labor matching": NONE,
  "Slag disposal": NONE,
  "Slave auction": NONE,
  "Small cargo": Object.freeze([GOODS]),
  "Small loans": NONE,
  "Smoke and flash powder": NONE,
  "Smoked fish": Object.freeze([FISH, INPUT]),
  "Smuggling investigation": NONE,
  "Soap": NONE,
  "Social gathering": NONE,
  "Specialist care": NONE,
  "Specialist compounds": NONE,
  "Specialist equipment": NONE,
  "Specialist hire": NONE,
  "Specialist physicians": NONE,
  "Specialty markets": NONE,
  "Specialty repairs": NONE,
  "Spell consultation": NONE,
  "Spell research": NONE,
  "Spell services": NONE,
  "Spellcasting (greater)": NONE,
  "Spellcasting (minor)": NONE,
  "Spellcasting services (1st-6th)": NONE,
  "Spiritual counsel": NONE,
  "Sporting events": Object.freeze([GATHERINGS]),
  "Stabling": Object.freeze([TRAVELLERS]),
  "Staging accidents": NONE,
  "Stained glass": NONE,
  "Standard boots": NONE,
  "Standard setting": NONE,
  "Standards body": NONE,
  "Standing question": NONE,
  "Standing retainer": NONE,
  "Standing subscription": Object.freeze([TRAVELLERS]),
  "State administration": NONE,
  "State governance": NONE,
  "Stolen goods": NONE,
  "Strategic grain reserves": Object.freeze([GRAIN]), // BAR4-SERVICES S1: the same
  "Street food": Object.freeze([GRAIN, LIVESTOCK]), // BAR4-SERVICES S1 (C6632): pies and roasted meats
  "Supplier contracts": NONE,
  "Surgery": NONE,
  "Surgical procedures": NONE,
  "Surplus sale": Object.freeze([GRAIN]),
  "Survey expeditions": Object.freeze([TRAVELLERS]),
  "Table wine": Object.freeze([INPUT]),
  "Tack and equipment": NONE,
  "Tailoring (bespoke)": NONE,
  "Tallow candles": NONE,
  "Tanned leather": Object.freeze([INPUT]),
  "Tax collection": NONE,
  "Tax payment": NONE,
  "Taxation and tolls": NONE,
  "Taxidermy and trophies": NONE,
  "Technical consulting": NONE,
  "Teleportation": NONE,
  "Textile labour": NONE,
  "Thatching": NONE,
  "Theft coordination": NONE,
  "Tithe and dues": NONE,
  "Toll collection": Object.freeze([TRAVELLERS, GOODS]),
  "Tool manufacture": NONE,
  "Tool repair": NONE,
  "Tournament events": NONE,
  "Trade brokerage": Object.freeze([GOODS]),
  "Trade facilitation": NONE,
  "Trade goods for export": Object.freeze([GOODS]),
  "Trade licensing": NONE,
  "Trade monopoly access": NONE,
  "Trade regulation": NONE,
  "Trail maintenance": NONE,
  "Training": NONE,
  "Training facility": NONE,
  "Transport routes": NONE,
  "Trapping": NONE,
  "Trapping services": NONE,
  "Traveller vouching": NONE,
  "Traveller's prayer": NONE,
  "Treasure appraisal": NONE,
  "Unattributed answer": NONE,
  "Underground connections": NONE,
  "Underground contacts": NONE,
  "Unlicensed enchantment": NONE,
  "Unofficial arbitration": NONE,
  "Untaxed goods import": Object.freeze([GOODS]),
  "Untaxed storage": NONE,
  "Urban grove access": NONE,
  "Utility enchantments": NONE,
  "Vagrancy enforcement": NONE,
  "Venue hire": NONE,
  "Vessel clearance": Object.freeze([GOODS]),
  "Vessel mooring": Object.freeze([GOODS]),
  "Veteran expertise": NONE,
  "Veterinary care": NONE,
  "Visitor permits": NONE,
  "Wagon and cart work": NONE,
  "Warehousing (bonded)": Object.freeze([GOODS]),
  "Wastewater removal": NONE,
  "Watch movements": NONE,
  "Way-bill registration": Object.freeze([GOODS]),
  "Way-bill services": Object.freeze([GOODS]),
  "Wayside blessing": Object.freeze([TRAVELLERS]),
  "Weak law, bring coin": NONE,
  "Weapon creation": NONE,
  "Weapon enchantment": NONE,
  "Weapon smithing": NONE,
  "Weapons training": NONE,
  "Weather and wind consulting": NONE,
  "Weather forecasting": NONE,
  "Weather reading": NONE,
  "Weekly market": Object.freeze([GATHERINGS, GOODS]),
  "Weekly rite": Object.freeze([TRAVELLERS, GATHERINGS]), // TAIL-SERVICES-3: the thorp walks to another village's service
  "Wholesale purchasing": NONE,
  "Wholesale trade": Object.freeze([GOODS]),
  "Wild game sales": Object.freeze([GAME]),
  "Wilderness guidance": NONE,
  "Wilderness scouting": NONE,
  "Window glass": Object.freeze([INPUT]),
  "Wine appraisal": NONE,
  "Wine wholesale": Object.freeze([INPUT]),
  "Witness removal": NONE,
  "Wood management": NONE,
  "Wool shearing": NONE,
  "Working clothes": NONE,
  "Working clothes (bulk)": NONE,
  "Wound closing": NONE,
  "Wound treatment": NONE,
  "Written answer": NONE,
});

/** Service name -> { the row's description -> what that row lives on }. @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>} */
export const SERVICE_DEPENDENCE_BY_DESC = Object.freeze({
  "General trade": Object.freeze({
    // BAR6-MARKS (8c.failed): the week's produce and livestock are the food a famine fails
    "Agricultural produce, household goods, livestock. The economic heartbeat of the week.": Object.freeze([GATHERINGS, GOODS, GRAIN, LIVESTOCK]),
  }),
  // TAIL-SERVICES-3 (READ-ALL 11805, X9 06145): burial in a ground beyond the gates; a siege stops it, an outbreak does not (S8's word)
  "Burial": Object.freeze({
    "Interment outside the gates. The bearers and the cart are found by the ground.": Object.freeze([GATES]),
  }),
  // BAR4-SERVICES S1 (2026-11-16): the two rows of these names whose own words are travel past the gates; the name's other rows
  // (soldiers for hire, animals for hire) live on none of the three
  "Mercenary hire": Object.freeze({
    "Off-duty soldiers available for escort": Object.freeze([TRAVELLERS]),
  }),
  "Pack animal hire": Object.freeze({
    "Rent animals with or without handler for journeys.": Object.freeze([TRAVELLERS, WORKING_ANIMALS]), // BAR5-MARKS (WM1)
  }),
});

/** House catalogue id (`catalogIdForName`) -> what the house lives on. @type {Readonly<Record<string, ReadonlyArray<string>>>} */
/*
 * THE CHAIR'S RULING S8 (2026-11-15; vetoable by the owner): houses TAIL-HOUSES-2 found printing a crisis-false row with no
 * declaration, each verified against its row and the mark it would take ("Stopped by the siege." of the whole house).
 * ADDED (marked "// S8"): fish_market goods (salt and dried fish carted in), cemetery_network beyond the gates (grounds
 * beyond every gate), chroniclers_exchange travellers (reports by road), hunter_s_lodge beyond the gates (parties out
 * over the country), cartographer_s_workshop travellers (the travellers who stop there), carriers_guild travellers (carriers on the
 * road; an outbreak curtails it), periodic_market and daily_markets gatherings (an outbreak; a market inside the walls
 * still trades under a siege), stone_quarry goods (the quarry beyond the walls, its stone sent out: field work and trade
 * stop under a siege).
 * NOT ADDED, the house's work goes on inside the walls and "stopped" of it would be false (its one clause of outside trade
 * is a text matter for the HOUSES seat): apothecary_district (imported medicines are one focus of three), brewery
 * (brews for the town's own taverns; the regional clause), bowyers_fletchers_guild (the watch and the garrison buy more
 * under a siege, not less), great_cathedral (the cathedral is not stopped; its pilgrims are), burial_ground ("the burial
 * does not" wait: only the passing priest is cut off), shipyard (builds from timber in its yard), maltster (malts stored
 * grain); and, by the record, multiple_market_squares and city_granaries (markets and stores within the walls).
 */
export const HOUSE_DEPENDENCE = Object.freeze({
  "academy_of_magic": NONE,
  "access_to_external_mill": Object.freeze([TRAVELLERS]),
  "access_to_parish_church": Object.freeze([TRAVELLERS]),
  "advanced_water_infrastructure": NONE,
  "adventurers_charter_hall": NONE,
  "airship_docking_high_magic": NONE,
  "alchemist_quarter": NONE,
  "alchemist_shop": Object.freeze([INPUT]),
  "ale_house": NONE,
  "alehouse": NONE,
  "almshouse": NONE,
  "annual_fair": Object.freeze([TRAVELLERS, GOODS, GATHERINGS]),
  "apothecary": Object.freeze([INPUT]),
  "apothecary_district": Object.freeze([INPUT, IMPORTED_INPUT]), // BAR5-MARKS: it works medicinal herbs (`INPUT_IMPORTED_AS`), and its own description deals in imported medicines
  "apothecary_established": Object.freeze([INPUT]), // BAR5-MARKS (L2.siege.cutgood): the same
  "aqueduct_or_water_system": NONE,
  "assassins_guild": NONE,
  "assay_office": NONE,
  "auction_house": NONE,
  "bakers_5_15": Object.freeze([GRAIN, INPUT]),
  "bandit_affiliate": NONE,
  "banking_district": NONE,
  "banking_houses": NONE,
  "bardic_college": NONE,
  "barge_and_river_transport_company": Object.freeze([TRAVELLERS, GOODS]),
  "barracks": NONE,
  "beast_trainers": NONE,
  "beekeeper": Object.freeze([FIELD_WORK]), // SV8: its hives on the land the siege curtails
  "black_market": NONE,
  "black_market_bazaar": NONE,
  "blacksmith": Object.freeze([IRON, INPUT]), // BAR5-MARKS (WM1): the forge works iron; BAR6-MARKS (8a.input): its iron (`HOUSE_TRADE_INPUT`)
  "blacksmiths_3_10": Object.freeze([IRON, INPUT]), // BAR5-MARKS (WM1): the forge works iron; BAR6-MARKS (8a.input): its iron (`HOUSE_TRADE_INPUT`)
  "bowyer_fletcher": NONE,
  "bowyers_fletchers_guild": NONE,
  "brewer": Object.freeze([GRAIN, INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "brewery": Object.freeze([GRAIN, INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "brickmaker": Object.freeze([INPUT]),
  "brothel": NONE,
  "brothel_red_light_district": NONE,
  "burial_ground": NONE,
  "burial_grounds_and_charnel_house": NONE,
  "butchers_3_8": Object.freeze([LIVESTOCK, INPUT]), // LEFT-MARKS item 3 (L25, 2026-11-17): its stock is its input (`HOUSE_TRADE_INPUT`): short where the page says no livestock is had
  "caravan_masters_exchange": Object.freeze([TRAVELLERS, GOODS]),
  "caravaneer_s_post": Object.freeze([TRAVELLERS, GOODS]),
  "caravanserai": Object.freeze([TRAVELLERS, GOODS, INPUT]), // BAR2-SERVICES SV1: its camels; "No camels reach the caravanserai." marks it, and its caravans with it
  "carpenter": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "carpenter_part_time": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "carpenters_5_15": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "carriers_guild": Object.freeze([TRAVELLERS, GOODS]), // S8
  "carriers_hiring_hall": NONE,
  "cartographer_s_guild": NONE,
  "cartographer_s_workshop": Object.freeze([TRAVELLERS]), // S8
  "cathedral_10_000_only": NONE,
  "cemetery_network": Object.freeze([GATES]), // S8
  "chandler": NONE,
  "charcoal_burner": Object.freeze([INPUT, FIELD_WORK]), // SV8: its kilns in the woods the siege curtails
  "charlatan_fortune_tellers": NONE,
  "chroniclers_exchange": Object.freeze([TRAVELLERS]), // S8
  "citadel": NONE,
  "citizen_militia": NONE,
  "city_administration": NONE,
  "city_granaries": NONE,
  "city_hall": NONE,
  "city_state_government": NONE,
  "city_walls_and_gates": NONE,
  "coaching_inn": Object.freeze([TRAVELLERS]),
  "cobbler": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "cobbler_s_guild": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "colosseum_arena": Object.freeze([GATHERINGS]),
  "common_grazing_land": NONE,
  "communal_root_cellar": NONE,
  "contract_killer": NONE,
  "cooper": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "courthouse": NONE,
  "craft_guilds_100_150": NONE,
  "craft_guilds_30_80": NONE,
  "craft_guilds_5_15": NONE,
  "customs_house": Object.freeze([GOODS]),
  "daily_markets": Object.freeze([GATHERINGS]), // S8
  "dairy_farmer": Object.freeze([LIVESTOCK, INPUT, FIELD_WORK]), // SV8: its herd on the grazing the siege curtails
  "democratic_assembly": NONE,
  "district_markets_5_10": NONE,
  "docks_port_facilities": Object.freeze([GOODS]),
  "dragon_resident": NONE,
  "dream_parlors_high_magic": NONE,
  "druid_circle": NONE,
  "dungeon_delving_supply_district": NONE,
  "dwellings_15_100": NONE,
  "dwellings_1_8": NONE,
  "dwellings_5_25": NONE,
  "dyer": NONE,
  "elder_grove_council": NONE,
  "enchanter_s_shop": NONE,
  "farmland": Object.freeze([GRAIN, FIELD_WORK]), // SV8: its fields, a third of their yield kept under a siege
  "fence_word_of_mouth": NONE,
  "fighting_pits": NONE,
  "fish_market": Object.freeze([GOODS, FISH, INPUT]), // S8; SV6: its catch
  "fisher_s_landing": Object.freeze([FISH, INPUT, GATES]), // SV6: its catch; BAR3-SERVICES (S3): its boats on the water beyond the walls
  "fishing_community": Object.freeze([FISH, INPUT, GATES]), // SV6: its catch; BAR3-SERVICES (S3): its boats on the water beyond the walls
  "fishmonger": Object.freeze([FISH, INPUT]),
  "foundling_home": NONE,
  "free_company_hall": NONE,
  "front_businesses": NONE,
  "fuller": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "furrier_s_district": NONE,
  "gambling_den": NONE,
  "gambling_district": NONE,
  "gambling_halls": NONE,
  "garrison": NONE,
  "gates_if_walled": NONE,
  "gladiatorial_school": NONE,
  "glassblower": Object.freeze([INPUT]),
  "glassmakers": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "golem_workforce": NONE,
  "graveyard": NONE,
  "great_cathedral": NONE,
  "great_library": NONE,
  "guild_consortium": NONE,
  "guild_governance": NONE,
  "harbour_master_s_office": Object.freeze([GOODS]),
  "head_of_household_consensus": NONE,
  "healer_divine_1st_level": NONE,
  "hedge_wizard": NONE,
  "hired_blades": NONE,
  "hireling_hall": NONE,
  "hospital_network": NONE,
  "household_elder": NONE,
  "household_levy": NONE,
  "housing_3500_households": NONE,
  "housing_500_4000_households": NONE,
  "housing_75_650_households": NONE,
  "human_trafficking_network": NONE,
  "hunter_s_lodge": Object.freeze([GATES, GAME, INPUT]), // S8; SV6: its game
  "informal_elder_consensus": NONE,
  "inn_multiple": Object.freeze([TRAVELLERS]),
  "inns_and_taverns_district": Object.freeze([TRAVELLERS]),
  "international_trade_center": Object.freeze([GOODS]),
  "jeweller": NONE,
  "kidnapping_ring": NONE,
  "large_prison": NONE,
  "listening_post": Object.freeze([TRAVELLERS]),
  "local_fence": NONE,
  "lord_s_appointee": NONE,
  "lord_s_reeve": NONE,
  "lord_s_steward": NONE,
  "luxury_goods_quarter": Object.freeze([GOODS, INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "mages_district": NONE,
  "mages_guild": NONE,
  "major_annual_fairs": Object.freeze([TRAVELLERS, GOODS, GATHERINGS]),
  "major_hospital": NONE,
  "major_monasteries_5_10": NONE,
  "maltster": Object.freeze([GRAIN, INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "market_square": Object.freeze([GATHERINGS]),
  "massive_prison": NONE,
  "massive_walls_and_fortifications": NONE,
  "mayor_and_council": NONE,
  "mercenary_quarter": NONE,
  "merchant_guilds_15_40": NONE,
  "merchant_guilds_3_8": NONE,
  "merchant_guilds_50_100": NONE,
  "merchant_oligarchy": NONE,
  "merchant_warehouses": NONE,
  "message_network_high_magic": NONE,
  "midwife": NONE,
  "mill": Object.freeze([GRAIN, INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "mills_2_5": Object.freeze([GRAIN, INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "mine": Object.freeze([INPUT, FIELD_WORK]), // SV6: its ore; SV8: its pits, the chain impaired under a siege
  "mine_open_cast": Object.freeze([INPUT, FIELD_WORK]), // BAR6-MARKS (8b.extract): the open pit works its ground as the mine does
  "mint": NONE,
  "mint_official": NONE,
  "monastery_or_friary": NONE,
  "money_changers": NONE,
  "multiple_adventurers_guilds": NONE,
  "multiple_court_buildings": NONE,
  "multiple_courthouses": NONE,
  "multiple_criminal_factions": NONE,
  "multiple_garrisons": NONE,
  "multiple_market_squares": NONE,
  "multiple_monasteries": NONE,
  "multiple_theaters": Object.freeze([GATHERINGS]),
  "multiple_water_sources": NONE,
  "noble_governor": NONE,
  "opera_house": NONE,
  "outlaw_shelter": NONE,
  "pack_animal_trader": Object.freeze([TRAVELLERS, WORKING_ANIMALS]), // BAR5-MARKS: its trade is the working animals (WM1), hired to travellers by its own description
  "palace_government_complex": NONE,
  "palisade": NONE,
  "palisade_or_earthworks": NONE,
  "parish_burial_grounds": NONE,
  "parish_church": NONE,
  "parish_churches_10_30": NONE,
  "parish_churches_2_5": NONE,
  "parish_churches_50_100": NONE,
  "pawnbroker": NONE,
  "peat_cutter": NONE,
  "periodic_market": Object.freeze([GATHERINGS, TRAVELLERS]), // S8; BAR3-SERVICES (S1): its trading day is the country coming in, which a siege stops
  "planar_embassy": NONE,
  "planar_traders": NONE,
  "post_relay_station": Object.freeze([TRAVELLERS]),
  "potter": Object.freeze([INPUT]),
  "priest_resident": NONE,
  "printing_house": NONE,
  "professional_city_watch": NONE,
  "public_bathhouse": NONE,
  "red_light_district": NONE,
  "resident_smith_part_time": Object.freeze([IRON, INPUT]), // BAR5-MARKS (WM1): the forge works iron; BAR6-MARKS (8a.input): its iron (`HOUSE_TRADE_INPUT`)
  "river_boatyard": NONE,
  "river_ferry": Object.freeze([TRAVELLERS]),
  "rookery": NONE,
  "ropemaker": NONE,
  "royal_seat": NONE,
  "sage_s_quarter": NONE,
  "salt_works": Object.freeze([INPUT, FIELD_WORK]), // SV8: its pans, the chain impaired under a siege
  "sawmill": Object.freeze([INPUT]),
  "sawmill_commercial": Object.freeze([INPUT]), // HR1 (BAR4-CLOSE-SWEEP, the chair's ruling, 2026-11-16): the rung runs the timber chain (BAR4-RECORD R1), so its house is short where its services are
  "scroll_scribe": NONE,
  "sewage_system": NONE,
  "shepherd": Object.freeze([FIELD_WORK, LIVESTOCK]), // BAR5-MARKS (LAW 5): its mutton is the herds a famine can fail; // SV8: its flocks on the grazing the siege curtails
  "shepherd_collective": Object.freeze([FIELD_WORK, LIVESTOCK]), // BAR5-MARKS (LAW 5): its mutton is the herds a famine can fail; // SV8: the same flocks, held in common
  "shipyard": Object.freeze([INPUT, FIELD_WORK]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`); BAR8 MARKS-2 item 2 (K's 12a, C0476): its ship timber is felled on the stand beyond the walls (its own chain's card: "Impaired · Normally yields Ocean-going vessels" under the siege) or bought in, so a siege curtails the yard (SV8), "Curtailed by the siege."
  "slave_market": NONE,
  "slave_market_district": NONE,
  "small_hospital": NONE,
  "small_prison_stocks": NONE,
  "smelter": Object.freeze([INPUT, IRON]), // BAR6-MARKS (8a.input, WM1 widened): the smelter works the metal the war takes
  "smuggling_network": Object.freeze([GOODS]),
  "smuggling_operation": Object.freeze([GOODS]),
  "smuggling_waypoint": Object.freeze([GOODS]),
  "specialized_metalworkers": Object.freeze([IRON, INPUT]), // BAR6-MARKS (8a.input, WM1 widened): the metalworkers work iron as the forge does
  "stable_district": Object.freeze([TRAVELLERS, WORKING_ANIMALS]), // BAR5-MARKS: its trade is the working animals (WM1), for merchants and travellers by its own description
  "stable_master": NONE,
  "stable_yard": Object.freeze([TRAVELLERS]),
  "state_granary_complex": NONE,
  "stone_quarry": Object.freeze([GOODS, INPUT]), // S8; SV6: its stone
  "street_gang": NONE,
  "subsistence_farming": Object.freeze([GRAIN, FIELD_WORK]), // SV8: its plots, a third of their yield kept under a siege
  "tailor": NONE,
  "tailor_s_guild": NONE,
  "tanner_established": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "tanners": Object.freeze([INPUT]), // HR1: measured, every service short wherever its input is missing (11 towns of the 720, 1 of a fresh 300)
  "tannery": Object.freeze([INPUT]),
  "taverns_5_20": NONE,
  "teleportation_circle": NONE,
  "thatcher": NONE,
  "theaters": Object.freeze([GATHERINGS]),
  "thieves_guild_chapter": NONE,
  "thieves_guild_powerful": NONE,
  "toll_bridge": Object.freeze([TRAVELLERS, GOODS]),
  "town_council": NONE,
  "town_crier": NONE,
  "town_granary": NONE,
  "town_hall": NONE,
  "town_walls": NONE,
  "town_watch": NONE,
  "travelers_inn": Object.freeze([TRAVELLERS]),
  "traveling_hedge_wizard": NONE,
  "traveling_performers": Object.freeze([TRAVELLERS, GATHERINGS]),
  "undead_labor": NONE,
  "underground_city": NONE,
  "underground_network": NONE,
  "veteran_s_lodge": NONE,
  "village_elder": NONE,
  "village_headman": NONE,
  "village_musician": NONE,
  "village_reeve": NONE,
  "village_scribe": NONE,
  "village_watch": NONE,
  "vintner": Object.freeze([INPUT]),
  "warden_s_lodge": NONE,
  "warehouse_district": NONE,
  "water_source": NONE,
  "wayside_inn": Object.freeze([TRAVELLERS]),
  "wayside_shrine": NONE,
  "waystation": Object.freeze([TRAVELLERS, GOODS]),
  "weavers_textile_workers": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "weekly_market": Object.freeze([GATHERINGS, GOODS]),
  "whisper_market": NONE,
  "wildfowler": NONE,
  "wizard_s_tower": NONE,
  "woodcarver": Object.freeze([INPUT]), // BAR6-MARKS (8a.input): the trade works this good (`HOUSE_TRADE_INPUT`)
  "woodcutter_s_camp": Object.freeze([FIELD_WORK]), // SV8: its cutting in the woods the siege curtails
  "workhouse": NONE,
});

/**
 * A HOUSE ON A SPENT GROUND IS SHORT OF IT (BAR2-SERVICES, the chair's ruling SV6 of 2026-11-15; vetoable by the owner).
 * The leaf's second cause reads, beside the page's gap line, the page's own Depleted list (the Resources tab prints
 * `config.nearbyResourcesDepleted`): a house that makes from what reaches it (`input` above) and whose every own ground
 * (the record's chains it works, `economicState.activeChains[].resourceKey`) is on that list, with no chain kept by magic
 * and no shortage import the trade record shows (`resourceSemantics.js :: resourceShortageImport`), is marked short of its
 * ground's yield, named here. A ground not named here is "its materials". VETOABLE wording (the owner's).
 * @type {Readonly<Record<string, string>>} resource key -> what the house is short of
 */
export const SPENT_GROUND_YIELD = Object.freeze({
  fishing_grounds: 'fish', river_fish: 'fish', iron_deposits: 'iron ore', salt_flats: 'salt', stone_quarry: 'stone',
  hunting_grounds: 'game', grazing_land: 'livestock', alpine_pasture: 'livestock', river_clay: 'clay', coal_deposits: 'coal',
  managed_forest: 'timber', mountain_timber: 'timber', coastal_timber: 'timber', foraging_areas: 'herbs', glass_sand: 'glass sand',
  grain_fields: 'grain', fertile_floodplain: 'grain', marshlands: 'reeds', vineyards: 'grapes',
});

/**
 * THE HOUSES THAT WORK THE GROUND ITSELF (SV6, measured): an import feeds the houses that buy what the ground yields (the
 * smith's iron, the baker's grain), never the work on the ground: the mine's crews cut no ore from an exhausted seam,
 * the quarry no stone, the boats no morning catch, however much is bought in. For these the trade record's shortage
 * import does not lift the mark. Catalogue ids. VETOABLE (the owner's). BAR6-MARKS (LAW 8's 8b.extract, 2026-11-16): the
 * open-cast mine is a mine (bar0-hamlet-under_siege-rand-34: its every chain "From Iron ore deposits (depleted)", its
 * id `mine_open_cast` missed here, so the town's iron import lifted its mark).
 * @type {ReadonlyArray<string>}
 */
export const SPENT_GROUND_WORKERS = Object.freeze(['mine', 'mine_open_cast', 'stone_quarry', 'salt_works', 'fisher_s_landing', 'fishing_community', 'fish_market', 'hunter_s_lodge']);

/**
 * THE GROUNDS A FISHING HOUSE WORKS WHERE NO CHAIN NAMES IT (BAR3-SERVICES, the chair's direction S3 of 2026-11-15;
 * vetoable by the owner). SV6 reads a house's grounds off the record's chains, and a fish market or a fishing community
 * the chains do not name was read as on no ground: its "Fish sold daily from the morning catch." printed unmarked where the
 * page's Depleted list holds every fishery the town has and the trade record brings salted fish in (16 towns of the 720
 * at 59185b62a). For these houses alone, where no chain names the house, its grounds are the record's chains on the
 * town's fisheries of the kinds named here, read by SV6's own reading (every one on the Depleted list, none kept by magic):
 * the same mark ("Short of fish."). RULING FS1 (the chair's, 2026-11-16; vetoable by the owner): a town whose fisheries run no
 * chain is read by its grounds themselves, the town's own fisheries of these kinds on the record (`config.nearbyResources`):
 * every one on the Depleted list, the house is short of fish whatever the food ledger counts (r2s-plague_onset-thorp-2,
 * C22221). Catalogue ids -> resource keys.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const GROUNDS_WORKED_OFF_CHAIN = Object.freeze({
  fish_market: Object.freeze(['fishing_grounds', 'river_fish']),
  fishing_community: Object.freeze(['fishing_grounds', 'river_fish']),
  fisher_s_landing: Object.freeze(['fishing_grounds', 'river_fish']),
});

/**
 * THE WORK BEYOND THE GATES THE RECORD HOLDS GOING ON UNDER A SIEGE (BAR3-SERVICES-3, the chair's ruling SV8b of
 * 2026-11-15; vetoable by the owner). A house declared `beyond the gates` is stopped by a siege, UNLESS the town's own
 * record reads that work as going on under this siege, by the fact named here for the house:
 *   foodSource   the food record counts this source in the share the town still grows under the siege
 *                (`foodSecurity.foodRecord.foodSources`): the hunter's lodge, where it counts game;
 *   waterGrounds a supply chain the house works on one of these grounds (`economicState.activeChains`, the house among
 *                its `processingInstitutions`) is on the record: its card's own state under the siege
 *                (`chainStateShown.js :: chainCrisisStateShown`) bears it: a working state (a port's open sea,
 *                `seaOpenTo`) leaves the house unmarked; any other ("impaired", "vulnerable") curtails it.
 * Where the record holds it so, the house reads "Curtailed by the siege." (its work is `field work`, SV8) or unmarked;
 * where the record cannot tell (no such source, no such chain), "Stopped by the siege." stands. Keyed by catalogue id.
 * @type {Readonly<Record<string, Readonly<{ foodSource?: string, waterGrounds?: ReadonlyArray<string> }>>>}
 */
export const GATES_WORK_HELD_BY_RECORD = Object.freeze({
  hunter_s_lodge: Object.freeze({ foodSource: 'game' }),
  fishing_community: Object.freeze({ waterGrounds: Object.freeze(['fishing_grounds', 'river_fish']) }),
  fisher_s_landing: Object.freeze({ waterGrounds: Object.freeze(['fishing_grounds', 'river_fish']) }),
});

/**
 * A SIEGE TWIN THAT SAYS THE HOUSE GOES ON, THINLY, IS A ROW STILL ON OFFER (BAR3-SERVICES-3, the chair's ruling SV7b of
 * 2026-11-15; vetoable by the owner). A service row whose description is the siege's own twin
 * (`institutionServices.js :: SERVICE_DESC_SIBLINGS`) says in its own words what the siege did to it. Where those words
 * say the service has stopped ("none go out", "the wagons stand idle", "none can reach it", "ground by hand at home"),
 * the twin is no row on offer, and a house of such rows alone is "Stopped by the siege." (SV7). Where they say the
 * service goes on, thinly, the twin IS a row on offer, and its house reads "Curtailed by the siege." by SV7's own rule.
 * These are the siege twins that go on, by their own text (read against every siege twin of the table: the test
 * `tests/components/bar3ServicesRows.test.jsx` fails on a text here that is no siege twin). VETOABLE (the owner's).
 * @type {ReadonlyArray<string>}
 */
export const SIEGE_TWINS_ON_OFFER = Object.freeze([
  // the coaching inn's "Lodging": the beds are let, to the few still within
  'Beds, meals, and stabling, though with the roads held the rooms stand mostly empty.',
  // the daily market's "Fresh produce": what the gardens within the walls still give
  'Whatever the kitchen gardens still give, sold early and gone by mid-morning.',
]);

/**
 * A SERVICE ROW CARRIES THE MARK ITS HOUSE CARRIES (BAR2-SERVICES, the chair's ruling SV1 of 2026-11-15; vetoable by the
 * owner). Where a house's row is stopped, curtailed or short of its input, every service row of that house that lives on
 * the same thing prints the same mark: the leaf (`crisisStoppedRow.js :: serviceRowDependence`) reads a service row as
 * living on its own line above AND on its house's line. This table is the one exception: the rows of a house that do NOT
 * live on what the house lives on, each with the dependences of its house it is free of (its own line still holds). Read
 * row by row against the 97 pairs of a house's menu that the house's line reaches and the row's own does not (the
 * quarry's "Cut stone" lives on the quarry beyond the walls; the listening post weighs a rumour against the register it already
 * holds). Keyed by the house's catalogue id, then the service's name. VETOABLE (the owner's).
 * @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>}
 */
export const SERVICE_FREE_OF_HOUSE = Object.freeze({
  // the mill's other wheels: cloth and timber, not grain
  "mill": Object.freeze({ "Fulling cloth": Object.freeze([GRAIN, INPUT]), "Sawing timber": Object.freeze([GRAIN, INPUT]) }), // BAR6-MARKS: nor its grain (INPUT)
  "mills_2_5": Object.freeze({ "Fulling cloth": Object.freeze([GRAIN, INPUT]), "Sawing timber": Object.freeze([GRAIN, INPUT]) }), // BAR6-MARKS: nor its grain (INPUT)
  // honey wine
  "brewer": Object.freeze({ "Mead": Object.freeze([GRAIN]) }),
  // judged of what is brought to the house, not made from its own input
  "vintner": Object.freeze({ "Wine appraisal": Object.freeze([INPUT]) }),
  "alchemist_shop": Object.freeze({ "Component identification": Object.freeze([INPUT]), "Ingredient sourcing": Object.freeze([INPUT]) }),
  "apothecary": Object.freeze({ "Consultation": Object.freeze([INPUT]) }),
  // the caravanserai's planners choose roads; the camels are its caravans'
  "caravanserai": Object.freeze({ "Route planning": Object.freeze([INPUT]) }),
  // an inquiry within the walls
  "customs_house": Object.freeze({ "Smuggling investigation": Object.freeze([GOODS]) }),
  // carrying and storing within the town
  "carriers_guild": Object.freeze({ "Porterage": Object.freeze([TRAVELLERS, GOODS]), "Cargo storage": Object.freeze([TRAVELLERS]) }),
  // the workshop's maps are drawn and copied at the bench, from the data it holds
  "cartographer_s_workshop": Object.freeze({ "Map making": Object.freeze([TRAVELLERS]), "Copying and reproduction": Object.freeze([TRAVELLERS]), "Route consultation": Object.freeze([TRAVELLERS]) }),
  // the town's own table and its own music
  "inn_multiple": Object.freeze({ "Meals and drink": Object.freeze([TRAVELLERS]) }),
  "inns_and_taverns_district": Object.freeze({ "Entertainment": Object.freeze([TRAVELLERS]) }),
  "travelers_inn": Object.freeze({ "Meals": Object.freeze([TRAVELLERS]) }),
  "stable_yard": Object.freeze({ "Overnight boarding": Object.freeze([TRAVELLERS]) }),
  // BAR5-MARKS (2026-11-16): the town's own horses boarded, and the carriages within the walls; the animals sold in town
  "stable_district": Object.freeze({ "Livery and boarding": Object.freeze([TRAVELLERS]), "Carriage hire": Object.freeze([TRAVELLERS]) }),
  "pack_animal_trader": Object.freeze({ "Pack animal sales": Object.freeze([TRAVELLERS]), "Tack and equipment": Object.freeze([TRAVELLERS]) }),
  // made and valued by the quarter's own hands
  "luxury_goods_quarter": Object.freeze({ "Custom commissions": Object.freeze([GOODS]), "Appraisal": Object.freeze([GOODS]) }),
  // proclaimed whether or not a crowd gathers
  "market_square": Object.freeze({ "Civic announcements": Object.freeze([GATHERINGS]) }),
  // the house's rooms and wardrobe, hired by the few
  "theaters": Object.freeze({ "Rehearsal space hire": Object.freeze([GATHERINGS]), "Costume and prop hire": Object.freeze([GATHERINGS]) }),
  // the tracker knows the country whatever it holds (SV6)
  "hunter_s_lodge": Object.freeze({ "Hunting guide hire": Object.freeze([INPUT]) }),
  // the market's stores and its buyers are fed by what is brought in; its morning catch is not (SV6)
  "fish_market": Object.freeze({ "Wholesale trade": Object.freeze([INPUT]), "Preserved fish": Object.freeze([INPUT]) }),
  // concealment within the walls
  "smuggling_operation": Object.freeze({ "Hidden storage": Object.freeze([GOODS]) }),
  "smuggling_waypoint": Object.freeze({ "Safe house": Object.freeze([GOODS]) }),
  // the rolls and the ground's trade are kept in the office
  "cemetery_network": Object.freeze({ "Central register": Object.freeze([GATES]), "Plot brokerage": Object.freeze([GATES]) }),
  // the troupe in the town plays where it stands
  "traveling_performers": Object.freeze({ "Public performance": Object.freeze([TRAVELLERS]), "Private entertainment": Object.freeze([TRAVELLERS, GATHERINGS]), "Festival coordination": Object.freeze([TRAVELLERS]) }),
  // weighed against what the register already holds
  "listening_post": Object.freeze({ "Claim weighing": Object.freeze([TRAVELLERS]), "Traveller vouching": Object.freeze([TRAVELLERS]) }),
  // BAR3-SERVICES (S3, 2026-11-15): the chroniclers' exchange is out of this table: its every row is the roads' reports
  // weighed against each other, and where the siege stops the house ("Stopped by the siege.") its rows print the same mark
  // (7 towns of the 720 at 59185b62a printed the house stopped and its archive, grading and answers on offer).
});

/*
 * THE CHAINS AND THE INCOME SHARES (the chair's ruling S6 of 2026-11-15; vetoable by the owner). The same declaration
 * for the two other rows the economy prints under a crisis: a supply chain's row ("Strategic Crossroads » Toll bridge +
 * Coaching inn + Customs house » Transit trade profit") and an income source's share ("Toll Revenue: 22%").
 *   CHAIN_DEPENDENCE   keyed by the chain's id: `data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS[*].chains[*].id`, which
 *                      the record carries as `economicState.activeChains[].chainId`.
 *   INCOME_DEPENDENCE  keyed by the income source's title: the record's `economicState.incomeSources[].source`, every
 *                      title the economy writes (`economy/economicState.js`, `economy/tradeGoods.js`,
 *                      `economy/incomeLineSiblings.js :: GOOD_SOLD_TITLES, HOUSE_OF_WORK_LABEL`, the five criminal
 *                      labels of `worldPulse/treasury.js :: CRIMINAL_INCOME_LABELS`). A custom good's row
 *                      ("<good> Trade", from the caller's own toggles) is not a title of the economy's: it takes NONE.
 * A chain or a source lives on the same words as a row above. The work of the land and of the town's own houses (the
 * forge, the quarry, the forest, rents, tithes, fees, the court) lives on none of them: a siege does not stop it here.
 * The food chains and food sales live on their food (a famine fails it); the road, the gate, the river and the sea's
 * trade live on travellers and goods (a siege stops them); a show, a game, a market's crowd lives on gatherings.
 */

/** Chain id -> what the chain lives on. @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const CHAIN_DEPENDENCE = Object.freeze({
  // food_security
  "grain": Object.freeze([GRAIN]),
  "livestock": Object.freeze([LIVESTOCK]),
  "salt": NONE,
  "forage": NONE,
  "fishing": Object.freeze([FISH]),
  "river_fishing": Object.freeze([FISH]),
  "hunting": Object.freeze([GAME]),
  "brewing": Object.freeze([GRAIN]),
  "animal_husbandry": Object.freeze([LIVESTOCK]),
  // raw_extraction
  "timber": NONE,
  "iron": NONE,
  "stone": NONE,
  "fuel": NONE,
  "clay": NONE,
  "smelting": NONE,
  "reed_marsh": NONE,
  "shipbuilding": NONE,
  "precious_metals_mining": NONE,
  "petty_mining": NONE,
  "harbour_trade": Object.freeze([TRAVELLERS, GOODS]),
  "coastal_shipbuilding": NONE,
  "river_milling": Object.freeze([GRAIN]),
  "floodplain_agriculture": Object.freeze([GRAIN]),
  "mountain_timber_harvest": NONE,
  "alpine_wool": Object.freeze([LIVESTOCK]),
  "oasis_agriculture": NONE,
  "date_palm_harvest": NONE,
  "desert_glasswork": NONE,
  // manufacturing
  "textiles": NONE,
  "leather": NONE,
  "food_processing": Object.freeze([GRAIN]),
  "weapons_armor": NONE,
  "luxury_goods": NONE,
  "glass_print": NONE,
  "bowyer_fletcher": NONE,
  "textile_finishing": NONE,
  "leather_goods": NONE,
  "ceramics_brick": NONE,
  "beekeeping_wax": NONE,
  // trade_entrepot
  "spices_dyes": Object.freeze([GOODS]),
  "silk_luxury_textiles": Object.freeze([GOODS]),
  "transit_finance": NONE,
  "warehouse_logistics": Object.freeze([GOODS]),
  "furs_north": Object.freeze([GOODS]),
  "wine_spirits": Object.freeze([GOODS]),
  "caravan_trade": Object.freeze([TRAVELLERS, GOODS]),
  "crossroads_trade": Object.freeze([TRAVELLERS, GOODS]),
  "camel_caravan": Object.freeze([TRAVELLERS, GOODS]),
  "mountain_pass_trade": Object.freeze([TRAVELLERS, GOODS]),
  // defense_security
  "garrison": NONE,
  "fortification": NONE,
  "mercenary": NONE,
  "adventuring_escort": NONE,
  // healing_medicine
  "herbalism": NONE,
  "hospital": NONE,
  "divine_healing": NONE,
  // knowledge_information
  "cartography": NONE,
  "scholarship": NONE,
  "intelligence": NONE,
  "news_information": NONE,
  // arcane_magical
  "alchemy": NONE,
  "spellcasting": NONE,
  "magical_goods": NONE,
  "planar": NONE,
  // religion_civic
  "parish": NONE,
  "law_governance": NONE,
  "pilgrimage": Object.freeze([TRAVELLERS]),
  // entertainment_culture
  "tavern_social": NONE,
  "performance": Object.freeze([GATHERINGS]),
  "gambling_arena": Object.freeze([GATHERINGS]),
  // criminal_economy
  "smuggling": Object.freeze([GOODS]),
  "black_market": NONE,
  "guild_crime": NONE,
  "slave_trade": NONE,
});

/** The fish trade's houses (the two fish shares'). @type {ReadonlyArray<string>} */
const FISH_TRADE_HOUSES = Object.freeze(['fish_market', 'fisher_s_landing', 'fishing_community', 'fishmonger']);

/**
 * A HOUSE'S INPUT BROUGHT IN BY ITS OWN NAME (BAR5-MARKS, LAW 2's `L2.siege.cutgood`, 2026-11-16; vetoable by the owner):
 * the herb houses work medicinal herbs, and where the record's imports bring them by that name (`canonicalAccessors.js ::
 * canonImports`: "Medicinal herbs") the page says the town's healing depends on herbs from outside
 * (`chainNeedShown.js :: chainNeedLine`, "… depend on medicinal herbs from outside, which the siege has cut off"). Under a
 * siege such a house is on an imported input as a house the resource analysis gaps `imported` is
 * (`crisisStoppedRow.js :: housesOnImportedInput`): it works what it holds and nothing more comes in, "Curtailed by the
 * siege." Keyed by catalogue id; the value is the import's name as the record spells it, matched whole-word, any case.
 * @type {Readonly<Record<string, string>>}
 */
export const INPUT_IMPORTED_AS = Object.freeze({
  "apothecary": 'medicinal herbs',
  "apothecary_district": 'medicinal herbs',
  "apothecary_established": 'medicinal herbs',
  // BAR8 MARKS-2 items 1 and 2 (J's 11e.siegeBought, K's 12a; the sixth chair's BRIEF-BAR8, 2026-11-17; vetoable by the owner):
  // under a siege the dyer's wool, the furrier's pelts and hides, the river boatyard's timber and the mint's bullion, where the
  // imports bring them by name ("Wool", "Raw hides and animal products", "Timber", "Precious metals (local gold and silver veins
  // exhausted)"), are cut as the smelter's ore is: "Curtailed by the siege." (the furrier's district is its furs chain's one
  // house, the chain "Stopped by the siege."). These four houses stay `NONE` in `HOUSE_DEPENDENCE`: the siege's reading of the
  // import is their one dependence (`crisisStoppedRow.js :: houseDependenceIn`), and no short mark reads them (a dyer is no
  // house of a ground). A value of several words is any one of them ("a|b"). The tailors sew cloth, and wool is not their
  // input: not read.
  "dyer": 'wool',
  "furrier_s_district": 'hides|furs|pelts',
  "river_boatyard": 'timber|lumber',
  "mint": 'precious metals|bullion',
  "mint_official": 'precious metals|bullion',
});

/**
 * THE GOOD A HOUSE'S TRADE CANNOT GO ON WITHOUT (BAR6-MARKS, LAW 8's 8a.input, BRIEF-BAR6 fact (a), 2026-11-16; vetoable by
 * the owner). The mark's short cause read a house's input only where the record's gap writer spoke of that house
 * (`resourceAnalysis.gaps[]`, written for the houses a chain names) or its ground was spent: the cooper, the woodcarver and
 * the carpenters work timber, the smiths iron, the fuller wool, the cobbler hides, the brewery grain, and no chain names
 * them, so where the page said "Needed, and not brought in: timber", or that the siege cut the wool off, their rows printed
 * bare (105 houses in the census's 720 at afa46d644). These houses' input is read by the one reader of an input
 * (`facts/houseInputAtHand.js :: houseInputAtHand`, by the chain key named here) wherever no gap of their own speaks:
 * `missing` marks them short, `imported` under a siege curtails them (S1 (i)). `luxury` is the luxury trade's own goods,
 * which no chain carries: had only as the town's production or its imports name them. Catalogue ids -> a chain key of
 * `CHAIN_INPUTS` (or `luxury`). VETOABLE (the owner's).
 * @type {Readonly<Record<string, string>>}
 */
export const HOUSE_TRADE_INPUT = Object.freeze({
  blacksmith: 'ironOre', blacksmiths_3_10: 'ironOre', resident_smith_part_time: 'ironOre', specialized_metalworkers: 'ironOre',
  brewer: 'grain', brewery: 'grain', maltster: 'grain', mill: 'grain', mills_2_5: 'grain', bakers_5_15: 'grain',
  carpenter: 'timber', carpenter_part_time: 'timber', carpenters_5_15: 'timber', cooper: 'timber', woodcarver: 'timber', shipyard: 'timber',
  sawmill: 'timber', sawmill_commercial: 'timber',
  cobbler: 'hides', cobbler_s_guild: 'hides', tanner_established: 'hides', tanners: 'hides', tannery: 'hides',
  fuller: 'wool', weavers_textile_workers: 'wool',
  glassmakers: 'sand',
  smelter: 'ironOre',
  luxury_goods_quarter: 'luxury',
});

/**
 * LEFT-MARKS item 3 (L25, SEAM-ECON's four houses; the sixth chair's BRIEF-LEFT, 2026-11-17; vetoable by the owner): A HOUSE
 * WHOSE TRADE TAKES A GOOD NO CHAIN NAMES IT FOR, READ ONLY WHERE THE PAGE ITSELF SAYS THE GOOD IS NOT HAD (the record's own
 * need list names it, "Needed, and not brought in: Livestock for meat and draft", and the one reader finds it nowhere): the
 * butchers' stock and the established apothecary's herbs, printed bare beside that line (r2r-town-54,
 * r2s-religious_conversion-town-2). A reading at print: apart from `HOUSE_TRADE_INPUT`, which the birth also reads
 * (`resourceGenerator.js :: importsBroughtAtBirth` brings a buyer's word), so no stored record moves; measured to mark
 * those houses and no other over the census's 720. Catalogue id -> the chain key of its good.
 * @type {Readonly<Record<string, string>>}
 */
// BAR8 MARKS-2 item 3 (J's 11a.atWork; the sixth chair's BRIEF-BAR8, 2026-11-17; vetoable by the owner): the alchemist's shop
// works herbs as the established apothecary does (`houseKinds.js :: MATERIAL_OF`): printed bare beside "Needed, and not brought
// in: … medicinal herbs." (r2s-religious_conversion-town-2), read the same way.
export const HOUSE_NEED_INPUT = Object.freeze({ butchers_3_8: 'livestock', apothecary_established: 'herbs', alchemist_shop: 'herbs' });

/**
 * LEFT-MARKS item 4 (L16, rule 8i.surplus; the sixth chair's BRIEF-LEFT, 2026-11-17, the auditor's cure; vetoable by the
 * owner): A HOUSE THAT WORKS ONLY A SURPLUS ("Converts barley into malt for brewing. … Requires grain surplus.", "… one that
 * only runs when grain is in surplus") is short where the page's food line is short, in a crisis or not
 * (`crisisStoppedRow.js :: housesShortOfInput`): catalogue id -> the good as its mark names it.
 * @type {Readonly<Record<string, string>>}
 */
export const SURPLUS_HOUSES = Object.freeze({ maltster: 'grain' });

/**
 * THE REMEDIES' SHARES AND THEIR HOUSES (BAR5-MARKS, the same rule): an income share of the remedies trade (the economy's
 * titles) reads its herb houses as `INCOME_TRADE_HOUSES` reads a resource trade's (`crisisStoppedRow.js ::
 * incomeHouseKind`): where every live house of the trade carries a mark, the share takes the mildest of them. Apart from
 * `INCOME_TRADE_HOUSES`, which is the resource trades' own declaration (`economy/incomeLineSiblings.js ::
 * RESOURCE_ROW_TRADES`, held by tests/domain/bar4MarkPromise.test.js (e)).
 */
const REMEDY_TRADE_HOUSES = Object.freeze(['alchemist_shop', 'apothecary', 'apothecary_district', 'apothecary_established']);
/** @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const INCOME_REMEDY_HOUSES = Object.freeze({
  "Apothecary & Alchemy": REMEDY_TRADE_HOUSES,
  "Herbalist & Apothecary": REMEDY_TRADE_HOUSES,
});

/**
 * THE CLOTH TRADE'S SHARE AND ITS HOUSES (BAR7-ECON item 1, LAW 8's 8f.short; the chair's BRIEF-BAR7, 2026-11-17; vetoable by
 * the owner). "Wool & Textile Trade" printed "Cloth is woven or finished here." bare beside its weavers and its fuller, each
 * marked "Short of wool." (C8021, C40674): the share was no row of the houses' tables, so it read no house's mark. It reads
 * them as the remedies' shares do (`crisisStoppedRow.js :: incomeTradeHousesOf`), the houses that make the cloth by the seam's
 * own rule (`tradeListDisplay.js :: MADE_OF_INPUT_BY`: the weaving and fulling houses; a dyer, a tailor or a draper finishes or
 * sells cloth and makes none). Apart from `INCOME_TRADE_HOUSES`, which is the resource trades' own declaration, pinned equal
 * to `RESOURCE_ROW_TRADES` by tests/domain/bar4MarkPromise.test.js (e): the brief's "joins INCOME_TRADE_HOUSES" would make that
 * pin untrue, so the share sits beside the remedies', read by the same function.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const INCOME_CLOTH_HOUSES = Object.freeze({
  "Wool & Textile Trade": Object.freeze(['weavers_textile_workers', 'fuller']),
});

/**
 * AN INCOME SHARE OF A HOUSE'S TRADE AND ITS HOUSES (BAR4-SERVICES S1 (ii), the chair's direction of 2026-11-16; vetoable by
 * the owner): the shares titled by a resource trade (`economy/incomeLineSiblings.js :: RESOURCE_ROW_TRADES`, the maritime fish
 * share the fish trade's) and the catalogue ids of the houses of that trade (the trade's own house words over the catalogue's
 * names: `tests/domain/bar4MarkPromise.test.js` pins the two equal). Where every live house of the trade carries a crisis mark,
 * the share takes the mildest of them (`crisisStoppedRow.js :: incomeHouseKind`). Declared here so that the display leaf
 * reads no generator module (the domain -> generators boundary).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const INCOME_TRADE_HOUSES = Object.freeze({
  "Iron & Metalwork": Object.freeze(['blacksmith', 'blacksmiths_3_10', 'mine', 'mine_open_cast', 'resident_smith_part_time', 'smelter', 'specialized_metalworkers']),
  "Stone Quarrying": Object.freeze(['stone_quarry']),
  "Timber Trade": Object.freeze(['sawmill', 'sawmill_commercial', 'woodcutter_s_camp']),
  "Fish & Preserved Produce": FISH_TRADE_HOUSES,
  "Fish & Maritime Produce": FISH_TRADE_HOUSES,
});

/** Income source title -> what the share lives on. @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const INCOME_DEPENDENCE = Object.freeze({
  "Agricultural Rents": NONE,
  "Apothecary & Alchemy": NONE,
  "Arcane Economy": NONE,
  "Arcane Industry": NONE,
  "Banking Fees": NONE,
  "Black Market Revenue": NONE,
  "Building Stone Sales": NONE,
  "Church Tithes": NONE,
  "Church Tithes & Rents": NONE,
  "Clay Sales": NONE,
  "Coal Sales": NONE,
  "Court Fees & Fines": NONE,
  "Criminal Syndicate Revenue": NONE,
  "Enchanted Goods Premium": NONE,
  "Entrepôt Trade": Object.freeze([GOODS]),
  "Financial Services": NONE,
  "Fish & Maritime Produce": Object.freeze([FISH]),
  "Fish & Preserved Produce": Object.freeze([FISH]),
  "Gate Tolls": Object.freeze([TRAVELLERS, GOODS]),
  "Grain Sales": Object.freeze([GRAIN]),
  "Guild Fees": NONE,
  "Guild Licensing": NONE,
  // TAIL-CRISIS-7: TAIL-DEFECON-2's D10 (df2fa5ca) re-titled the small places' rents row "Harvest" where no lord's man
  // stands ("What the households grow and raise on their holdings"): it lives on the crops and the herds, the food a
  // famine fails (grain, or a famine naming no source; livestock). The land's own work: a siege or an outbreak stops neither.
  "Harvest": Object.freeze([GRAIN, LIVESTOCK]),
  "Herbalist & Apothecary": NONE,
  "International Commerce": Object.freeze([GOODS]),
  "Iron & Metalwork": NONE,
  "Iron Ore Sales": NONE,
  "Local Trades": NONE,
  "Magical Trade Revenue": Object.freeze([GOODS]),
  "Market Taxes": Object.freeze([GATHERINGS]),
  "Military Extraction": NONE,
  "Military Levy": NONE,
  "Pilgrim Trade": Object.freeze([TRAVELLERS]),
  "Port Duties": Object.freeze([TRAVELLERS, GOODS]),
  "Precious Metal Sales": NONE,
  "Property Rents": NONE,
  "River Tolls": Object.freeze([TRAVELLERS, GOODS]),
  "Salt Sales": NONE,
  "Security Contracts": NONE,
  "Shadow Economy (untaxed)": NONE,
  "Smuggling Network Revenue": Object.freeze([GOODS]),
  "Spellcasting Services": NONE,
  "Stone Quarrying": NONE,
  "Subsistence Production": Object.freeze([GRAIN]),
  "Thieves' Guild Revenue": NONE,
  "Timber Trade": NONE,
  "Toll Revenue": Object.freeze([TRAVELLERS, GOODS]),
  "Wool & Textile Trade": NONE,
});

/**
 * What a house lives on, by its catalogue id (the record's `catalogId`, else its name's). Moved VERBATIM from
 * `domain/display/crisisStoppedRow.js` (BAR7-ECON item 5, 2026-11-17), which re-exports it.
 * @param {{ catalogId?: unknown, name?: unknown }} inst
 * @returns {ReadonlyArray<string>}
 */
export function houseDependenceOf(inst) {
  const id = typeof inst?.catalogId === 'string' && inst.catalogId ? inst.catalogId : catalogIdForName(typeof inst?.name === 'string' ? inst.name : null);
  return id && Object.prototype.hasOwnProperty.call(HOUSE_DEPENDENCE, id) ? HOUSE_DEPENDENCE[id] : NONE;
}
import { catalogIdForName } from './institutionalCatalog.js';
