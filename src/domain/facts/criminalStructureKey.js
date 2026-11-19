/**
 * domain/facts/criminalStructureKey.js — THE CRIME FACT'S LEAF (TAIL-TIES-9, the chair's ruling (T28) of 2026-11-15,
 * vetoable by the owner): the criminal structure's KEY ('organized' | 'semi-organized' | 'diffuse' | null), its name
 * ladder and the roster readings only the key needs, moved verbatim out of `display/defenseDisplay.js ::
 * deriveCriminalStructure`, which calls it for its key and keeps the three labels, the ring note's vantages and its
 * one-argument form.
 *
 * WHY A LEAF. `factsOf(record).crime` (the vocabulary's atom) reads only the key, and it read it through the display,
 * while the display reads `factsOf`: the last import cycle `tests/architecture/layerBoundaries.test.js` held. The key
 * reads the roster, the power seats, the safety profile's operations list and the running criminal chains; it reads
 * neither the facts nor the cast, so the facts read it here and no longer import the display.
 *
 * Its imports are the crime signal's two homes (`crimeSignal.js`, `corruption.js`), neither of which reads the facts.
 * Pure: no randomness, no clock, no write.
 */
import { crimeSignalOf } from '../crimeSignal.js';
import { rivalRingsOf } from '../corruption.js';

/**
 * The record slice the key reads (structural; the display's `DefenseDisplaySettlement` narrowed to these fields).
 * @typedef {Object} CrimeKeySettlement
 * @property {Array<{ name?: string }>} [institutions]
 * @property {{ safetyProfile?: { criminalInstitutions?: unknown[] }, activeChains?: Array<{ needKey?: unknown, status?: unknown, chainId?: unknown } | null>, incomeSources?: unknown }} [economicState]
 * @property {unknown} [availableServices] BAR4-SAFETY (F3): the services menu (its covert criminal rows)
 * @property {{ factions?: Array<{ category?: unknown } | null | undefined> }} [powerStructure]
 */

/**
 * The criminal structure's key, or null where there is no criminal infrastructure the record names.
 * @param {CrimeKeySettlement | null | undefined} settlement
 * @returns {'organized' | 'semi-organized' | 'diffuse' | null}
 */
export function criminalStructureKeyOf(settlement) {
  const r = settlement || {};
  const names = (r.institutions || []).map((i) => (i?.name || '').toLowerCase());
  const hasGuild = names.some((n) => n.includes("thieves' guild") || n.includes('thieves guild'));
  const hasSyndicate = names.some((n) => n.includes('multiple criminal') || n.includes('underground city') || n.includes('front business'));
  const hasSemiOrg = names.some((n) => n.includes('smuggling') || n.includes('black market') || n.includes('gambling'));
  const hasDiffuse = names.some((n) => n.includes('fence') || n.includes('bandit') || n.includes('outlaw'));
  // ⛔ "NOTHING ORGANIZED" IS A FINDING, SO IT IS NEVER READ BESIDE A NETWORK (lane RUNG1-TRUTH unit
  // E2, 2026-11-04; docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 16, A-06; the chair's ruling 2). The
  // name ladder above knows neither "Street gang" nor "Underground network" and never reads the
  // power roster, so a town with a street gang (soak1k-759) and a place whose Thieves' Guild holds
  // power with no premises (soak1k-393) both read null, and DS-DEF-4 printed "No criminal
  // infrastructure has been identified". Where the ladder finds nothing, the roster's criminal
  // faction makes the structure ORGANIZED (a guild is a hierarchy, the pool's own reading of one),
  // and a house the estate's ONE criminal detector names (`corruption.js :: isCriminalInstitution`)
  // makes it SEMI-ORGANIZED (routes and territories, no single authority). Only the null answer
  // moves; no pool text changes.
  const ladder = hasGuild || hasSyndicate ? 'organized'
    : hasSemiOrg ? 'semi-organized'
      : hasDiffuse ? 'diffuse'
        : null;
  // (Lane RUNG1B-F4 unit 3: both facts are read from the crime signal's one home, `crimeSignal.js`.)
  const signal = crimeSignalOf({ seats: r.powerStructure?.factions, estate: r.institutions });
  // ⛔ NOR BESIDE ITS OWN LIST (lane RUNG1B-F9 unit 3, 2026-11-04; A-06 in reverse: soak1k-28
  // Innissike listed "Active criminal operations: Red Light District" and the Economics tab's
  // "Slave trade · Operational", then printed "No criminal infrastructure has been identified").
  // The block's operations list is the safety profile's `criminalInstitutions` (a label table the
  // one detector does not share), and a criminal supply chain that runs is routes and territory.
  // Either makes the null answer SEMI-ORGANIZED, the same reading a criminal house gets above.
  const listed = (r.economicState?.safetyProfile?.criminalInstitutions || []).length > 0
    || runningCriminalChains(r).length > 0;
  // ⛔ A GANG IS A GANG (W2-A-LEAVES 5b, 2026-11-12; the second wave's ruling): the crime signal's FACTIONS outrank
  // the name ladder. The ladder read a fence's house as "diffuse" and never asked the roster, so the Defense tab
  // printed "Diffuse, no gang" beside a criminal power on the Power tab (2 of the census's 720). A criminal power
  // is a hierarchy, the pool's own reading of one; the ladder answers only where no criminal power stands.
  // (The ladder is a reader of the crime fact: tests/lint/factLayers.walker.test.js counts it, family crime.)
  const key = rivalRingsHere(r) ? 'semi-organized' : signal.powerNames.length ? 'organized'
    : ladder ?? (signal.houses.length || listed ? 'semi-organized' : covertCrimeHeld(r) ? 'diffuse' : null); // BAR4-SAFETY (F3, C46446)
  return key;
}

/**
 * BAR4-SAFETY (kind F3, REVIEW-BAR-4 C46446; vetoable by the owner): THE RECORD'S OWN CRIME, WHERE NO HOUSE NAMES IT. The
 * key read only the roster, the seats and the two operation lists, so a village whose income record carries "Black Market
 * Revenue" ("Untaxed trade, fencing and theft bring money in here", `economy/economicState.js`, `isCriminal`) and whose
 * services list a covert fence ("Fencing stolen goods", `servicesGenerator.js`, institution "(covert)") printed "No
 * criminal infrastructure" beside both. Either is crime that works through someone: at the least the diffuse rung
 * (thieves, fences and bandits each working for themselves), never a ring.
 * @param {{ economicState?: { incomeSources?: unknown }, availableServices?: unknown } | null | undefined} settlement
 * @returns {boolean}
 */
export function covertCrimeHeld(settlement) {
  const income = settlement?.economicState?.incomeSources;
  const services = /** @type {{ criminal?: unknown } | null | undefined} */ (settlement?.availableServices)?.criminal;
  return (Array.isArray(income) && income.some((/** @type {{ isCriminal?: unknown, percentage?: unknown } | null | undefined} */ row) => row?.isCriminal === true && Number(row?.percentage) > 0))
    || (Array.isArray(services) && services.some((/** @type {{ institution?: unknown } | null | undefined} */ x) => x?.institution === '(covert)'));
}

/** The supply-chain statuses that mean a chain runs (`supplyChainStatus`, less vulnerable/impaired). */
const RUNNING_CHAIN_STATUS = Object.freeze(['operational', 'running', 'entrepot']);

/**
 * The criminal supply chains that run: the Economics tab's "Criminal supply chains" chips
 * (`needKey === 'criminal_economy'`) whose status is a working one.
 * @param {CrimeKeySettlement | null | undefined} settlement
 * @returns {Array<{ needKey?: unknown, status?: unknown, chainId?: unknown } | null>}
 */
export function runningCriminalChains(settlement) {
  const chains = settlement?.economicState?.activeChains;
  return (Array.isArray(chains) ? chains : [])
    .filter((c) => c?.needKey === 'criminal_economy' && RUNNING_CHAIN_STATUS.includes(String(c?.status ?? '')));
}

/**
 * WHETHER MORE THAN ONE CRIMINAL RING STANDS HERE (the cold list REVIEW-R2-STAGES #1172 and #1202, HIGH, #716, #750 and
 * #813: "One criminal ring decides what crime is allowed here" beside a Thieves' Guild and The Black Circle on the Power
 * tab, and the roster's "Multiple criminal factions", which the Institutions tab prints as rival gangs disputing their
 * turf). The power roster is the home of who stands (`crimeSignal.js :: crimeSignalOf`'s seats): a criminal power that
 * GOVERNS (`isGoverning`: a council bought outright) is the captured hall, not a rival ring. Two rings or more, or the
 * roster's own "Multiple criminal factions", is no single controlling authority: the structure table's own
 * "semi-organized" row ("lacks a single controlling authority. Several gangs may be competing."), never "one ring".
 * @param {CrimeKeySettlement} settlement
 * @returns {boolean}
 */
function rivalRingsHere(settlement) {
  return rivalRingsOf(settlement?.powerStructure?.factions, settlement?.institutions) && !oneOrganisationRules(settlement);
}

/**
 * ONE ORGANISATION RULES THE TRADE (W2-C-LEAVES-11, the chair's ruling (1) of 2026-11-14 on REVIEW-W2-C-LEAVES's HIGH [1]:
 * "Semi-organized networks … lacks a single controlling authority. Several gangs may be competing" and the crime prose drawn
 * with that key, "Rival crews at {N} are fighting over who runs the streets", were false in 36 of the 289 towns of the
 * reader's 1,824 where they printed). Rival rings are said only where none of them governs or dominates and no guild is
 * named as running the trade: a criminal seat that GOVERNS (`isGoverning`) or is Dominant (`powerLabel`, the band the
 * section's own "Underworld: Shadow Senate · Dominant" prints) is the single authority (18 of the 36), and so is a thieves'
 * guild house on the roster (the operations list's "Thieves' Guild Chapter" / "Thieves' Guild (Powerful)", 18 of the 36).
 * The key is then the one organisation's, read from the same roster. Read as stored; no fact is added.
 * @param {CrimeKeySettlement} settlement
 * @returns {boolean}
 */
function oneOrganisationRules(settlement) {
  const seats = /** @type {ReadonlyArray<{ category?: unknown, isGoverning?: unknown, powerLabel?: unknown } | null | undefined>} */ (
    settlement?.powerStructure?.factions || []);
  return seats.some((f) => f?.category === 'criminal' && (f?.isGoverning === true || f?.powerLabel === 'Dominant'))
    || (settlement?.institutions || []).some((i) => THIEVES_GUILD_HOUSE.test(String(i?.name ?? '')));
}
/** A thieves' guild house by its roster name ("Thieves' guild chapter", "Thieves' guild (powerful)"). */
export const THIEVES_GUILD_HOUSE = /thieves'? guild/i;

/**
 * THE RING'S HOUSES ON THE ROSTER (TAIL-CLOSE-SRC-5, the chair's ruling SR5 (a) of 2026-11-15, vetoable by the owner):
 * `display/defenseDisplay.js :: ringWithoutSeat`'s lookup of a house by name, moved verbatim to the crime fact's leaf.
 * It is the name ladder's own question (a thieves' guild, a "Front businesses" or an "Underground city" house is what
 * makes `criminalStructureKeyOf` ORGANIZED), so it reads the roster the key reads: whether a ruined criminal house
 * should key the structure (and so name the ring's houses) is the one behaviour question named for the owner on this
 * leaf, never answered twice. Read as stored; no fact is added.
 * @param {CrimeKeySettlement | null | undefined} settlement
 * @returns {Readonly<{ guild: boolean, front: boolean, under: boolean }>}
 */
export function ringHousesOf(settlement) {
  const houses = (settlement?.institutions || []).map((i) => String(i?.name ?? ''));
  return Object.freeze({
    guild: houses.some((n) => THIEVES_GUILD_HOUSE.test(n)),
    front: houses.some((n) => /front business/i.test(n)),
    under: houses.some((n) => /underground city/i.test(n)),
  });
}
