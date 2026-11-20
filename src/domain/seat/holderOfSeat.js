/**
 * seat/holderOfSeat.js — WHO HOLDS THIS SEAT (CS2, CS11; SEAT-1 train 1, unit U3). One pure leaf that READS the
 * holder from the record and never stores it, with the rule that answered and an explicit audience.
 *
 * The owner's model of 2026-11-20 reads three things apart: the FORM (`powerStructure.government`), the HOLDER (the
 * power that holds the seat) and the PERSON in it. This leaf answers the second and names the third.
 *
 * THE ORDER (the chair's CS2, built exactly):
 *   R1  the taker of the last transfer of power, where the record holds one (`transferTakerOf`, below);
 *   R2  the power whose first member (membership rank 1) is the seat-holder: the person is
 *       `dossier/seatHolder.js :: seatCandidatesOf`'s first, less anyone `ousted` (the CURE: the filter
 *       `powerStrata.js :: liveSeatCandidatesOf` adds, read here so this leaf never imports `powerStrata.js`, which
 *       imports `rulingPowerCoup.js`, which U4 makes import this leaf);
 *   R3  for a seat of a kind (its form read through `seatTable.js :: formKindOf`, else the governing row's own kind),
 *       the leading OPEN power of that kind (`seatTable.js :: contestKindOf`; open = `seatTable.js :: isVeiledRow`,
 *       `cardVeil.js :: isVeiledPower`'s test, false), by power, then name in codepoint order. A civic seat (`government`), an unplaced one (`other`) and a
 *       criminal one are not seats of a kind: the office holds itself there, as the proposal measured (section (1));
 *   R4  nobody outside: the office holds itself; or
 *   R5  for a government in `APPOINTED_SEAT_FORMS` (`representatives.js :: APPOINTED_GOVERNMENTS`), the one who
 *       appoints, named only as the record names it. The record names no appointer, so R5 names nobody.
 *
 * THE AUDIENCE (REQUIRED; a missing or unknown one is the reader's: fail closed). For `'reader'` the leaf derives from
 * the document it is handed (the caller hands the served document) and never answers a criminal power, a hidden
 * power, a veiled power, or a power the document does not hold as a row. Where the owner's order would answer one of
 * those, the reader's answer is the office and the person with NO holder: `rule` names the rule that was refused and
 * `refused` is true, so the page can say nothing rather than something false (it never falls through to a later
 * rule). Nor is a veiled face (`cardPowers.js :: cardInstitutionVeilOf` 'veiled') ever the reader's person.
 *
 * R1, WHAT IT READS. `rulingPower.js :: transferRulingPower` writes, on every transfer, ONE edge between the seat and
 * its taker: `pair` [<the new form>, <taker>] and the narrative "<taker> is the power behind the <form, lower case>.
 * The seat answers to them now." (a new edge appended, or the taker's existing edge with the old seat rewritten in
 * place). R1 reads the edges whose pair holds the CURRENT form (the governing row's name) and whose narrative is that
 * sentence for that form exactly; an older transfer's edge is re-keyed onto the new form but its narrative names the
 * form it was written under, so it never matches. TWO TAKERS MATCH in one shape only: a later transfer returns the
 * seat to a form it held before (the outgoing name is never reused, so it takes at least three transfers), and the
 * earlier taker's re-keyed edge reads true again. Then the transfer's own `powerStructure.recentConflict` sentence
 * decides (it names the last taker, as the transfer wrote it); where a later writer has replaced that sentence, the
 * last matching edge in the list does. U5 makes the read unambiguous by retiring the old holder's edge at a transfer.
 * The taker must stand as a row of the document; for the owner a taker with no row (a power since removed) is no
 * answer, and the next rule reads; for the reader it is refused (a served document drops a hidden row and masks its
 * name, and the reader cannot tell the two apart).
 *
 * THE PERSON (CS22 (c), the chair 10:28Z on the owner's word "a king does not wear a dual hat"). Where the holder is
 * the R1 taker of a CROWNED form (`isCrownedForm`), the keeper of that power's heaviest house (its rank-1 member) is
 * never answered as the seat's person: the seat's own card is (the next seat candidate), or nobody. `personRule` says
 * which reading answered: `'seat'` (the seat's first candidate) or `'crown'` (the crowned seat's, its taker's keeper
 * refused). Until the cast change after a transfer is built (CS8's neighbour), that is the only person this leaf names.
 *
 * NOT HERE: the seat law (the leaf is a read; its callers gate); RULINGS (c)'s sovereign reading (Royal Authority on a
 * royal-seat house read as the sovereign's own seat, out of R5 for that reading only): U12 measures and wires it.
 *
 * THE VEIL READ (U4-CURE, the chair 13:50Z): a power's veil is read with `seatTable.js :: isVeiledRow`, the row twin of
 * `cardVeil.js :: isVeiledPower` (`tests/domain/seat/seatTable.test.js` pins the two equal), never by importing
 * `cardVeil.js`: that module imports `spatial/cohesionWeave.js`, and `rulingPowerCoup.js` imports this leaf, so the import
 * would carry `cohesionWeave.js` into the campaign PDF's and the world book's closures (`writerReach.walker`'s frozen
 * reach of "fear on candidates"). This leaf's closure must not reach it (`holderOfSeat.test.js`, arm (9)).
 *
 * Pure: no RNG, no store, no wall clock, no write. Lazy: pinned in `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`.
 *
 * @guarded-by tests/domain/seat/holderOfSeat.test.js
 */

import { governingFactionOf, nameOf, num } from '../rulingPower.js';
import { FACTION_ARCHETYPES as A } from '../factionArchetypes.js';
import { seatCandidatesOf } from '../dossier/seatHolder.js';
import { rankIn } from '../people/membership.js';
import { cardInstitutionVeilOf } from '../people/cardPowers.js';
import { contestKindOf, formKindOf, isVeiledRow, ownKindOf } from './seatTable.js';
import { officeFamilyOfForm, officeTitleOf, officeWordInfo } from '../../data/cultureOfficeTitles.js';

/** @typedef {import('../rulingPower.js').RulingFaction} RulingFaction */
/** @typedef {import('../dossier/seatHolder.js').SeatNpc} SeatNpc */
/** @typedef {import('../dossier/seatHolder.js').SeatSettlement} SeatSettlement */
/** @typedef {'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'none'} HolderRule */
/** @typedef {'seat' | 'crown'} PersonRule */
/**
 * @typedef {Object} SeatHolding
 * @property {HolderRule} rule        the rule that answered (for a refused reader answer: the rule that was refused)
 * @property {RulingFaction | null} holder  the holding power's row in the document handed, or null
 * @property {string | null} holderName
 * @property {SeatNpc | null} person  the seat's person (a card of the document), or null
 * @property {string | null} kind     the holder's own kind (`seatTable.js :: ownKindOf`); with no holder, the office's
 * @property {boolean} refused        the reader was refused the owner's answer (`rule` names it)
 * @property {PersonRule} personRule  which reading answered the person
 */

/**
 * THE GOVERNMENTS THAT SEND THEIR OWN MAN: `representatives.js :: APPOINTED_GOVERNMENTS`, restated member for member
 * (that module is a generator whose import closure is the cast's; this leaf rides a lazy domain chunk). A test pins
 * the two equal, and equal to `cultureOfficeTitles.js :: GOVERNMENT_FAMILY`'s appointed family.
 * @type {ReadonlyArray<string>}
 */
export const APPOINTED_SEAT_FORMS = Object.freeze([
  'Feudal Stewardship', 'Feudal Appointee', 'Noble Governorship', 'Ducal Governorship', 'Royal Authority',
  'Noble Regency', 'Foreign Stewardship', 'Foreign Administration', 'Occupation Authority', 'Martial Administration',
]);

/** The one form RULINGS (c) reads as the sovereign's own seat, and so the one form a crown sits on today. */
const CROWN_SEAT_FORM = 'Royal Authority';

/** The kinds that make no seat "of a kind" (R3 reads none of them). @type {ReadonlyArray<string>} */
const NO_SEAT_KIND = Object.freeze([A.GOVERNMENT, A.OTHER, A.CRIMINAL]);

/** A form's own name, without the transfer's " Ascendant" collision suffix. @param {unknown} form @returns {string} */
const bareForm = (form) => String(form ?? '').trim().replace(/ Ascendant$/, '');

/**
 * IS THIS FORM CROWNED at this size (CS22): a form the title table files under `sovereign`
 * (`cultureOfficeTitles.js :: officeFamilyOfForm`; none today), or the sovereign's own seat (Royal Authority) where
 * the sovereign row's word at that size is a crown word (`officeWordInfo(word).crown`, read on the base ladder: a
 * culture changes the WORD, never the hat, CS22 (e)). A size the ladder does not hold reads crowned (fail closed: the
 * keeper is then refused, never named).
 * @param {unknown} form @param {unknown} tier @returns {boolean}
 */
export function isCrownedForm(form, tier) {
  const bare = bareForm(form);
  if (officeFamilyOfForm(bare) === 'sovereign') return true;
  if (bare !== CROWN_SEAT_FORM) return false;
  const word = officeTitleOf({ family: 'sovereign', tier: String(tier ?? '').toLowerCase() });
  return word === null || officeWordInfo(word)?.crown === true;
}

/** The sentence `transferRulingPower` writes on the seat's edge with its taker. @param {string} taker @param {string} form */
const takerLine = (taker, form) => `${taker} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`;

/**
 * Does `recentConflict` say, in the transfer's own words, that `taker` took the seat as `form`? (The coup's
 * "<taker> overthrew the <old> and reshaped the government as a <form>." or a lawful passage's "Power passed to
 * <taker> by <cause>; the government now sits as a <form>…".)
 * @param {unknown} line @param {string} taker @param {string} form @returns {boolean}
 */
function transferSays(line, taker, form) {
  if (typeof line !== 'string') return false;
  const f = form.toLowerCase();
  return (line.startsWith(`${taker} overthrew the `) && line.endsWith(` and reshaped the government as a ${f}.`))
    || (line.startsWith(`Power passed to ${taker} by `) && line.includes(`; the government now sits as a ${f}`));
}

/**
 * R1's read: the name of the last transfer's taker, or null where the record holds no transfer onto the current form.
 * @param {SeatSettlement} settlement @param {string} form the governing row's name @returns {string | null}
 */
function transferTakerOf(settlement, form) {
  const edges = settlement.powerStructure?.factionRelationships;
  /** @type {string[]} */
  const takers = [];
  for (const rel of Array.isArray(edges) ? edges : []) {
    if (!rel || !Array.isArray(rel.pair) || !rel.pair.includes(form)) continue;
    const taker = rel.pair.find((n) => n !== form);
    if (typeof taker !== 'string' || !taker || rel.narrative !== takerLine(taker, form)) continue;
    if (!takers.includes(taker)) takers.push(taker);
  }
  if (takers.length < 2) return takers[0] ?? null;
  const said = takers.filter((t) => transferSays(settlement.powerStructure?.recentConflict, t, form));
  return said.length === 1 ? said[0] : takers[takers.length - 1];
}

/**
 * May the reader be told this power holds the seat? Not a hidden or criminal power (`isVeiledRow`), and not one
 * whose kind reads criminal by its name (`contestKindOf`).
 * @param {RulingFaction} row @returns {boolean}
 */
const servable = (row) => !isVeiledRow(row) && contestKindOf(row) !== A.CRIMINAL;

/**
 * WHO HOLDS THIS SEAT.
 * @param {SeatSettlement | null | undefined} settlement the record (the owner's), or the served document (the reader's)
 * @param {{ audience?: unknown }} [options] `audience`: `'owner'` or `'reader'`; anything else reads as `'reader'`
 * @returns {SeatHolding}
 */
export function holderOf(settlement, options) {
  const reader = options?.audience !== 'owner';
  const governing = settlement ? governingFactionOf(settlement) : null;
  if (!settlement || !governing) {
    return { rule: 'none', holder: null, holderName: null, person: null, kind: null, refused: false, personRule: 'seat' };
  }
  const factions = Array.isArray(settlement.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const form = nameOf(governing);
  const officeKind = formKindOf(form) ?? contestKindOf(governing);
  /** @param {string} name @returns {RulingFaction | null} */
  const rowOf = (name) => factions.find((f) => !!f && f !== governing && nameOf(f) === name) || null;

  // R1's taker, read first: the person reads it too (CS22 (c)).
  const takerName = transferTakerOf(settlement, form);
  const taker = takerName ? rowOf(takerName) : null;

  // THE PERSON: the seat's candidates, less the ousted, less (for the reader) a veiled face; on a crowned seat, never
  // its taker's keeper.
  const crown = takerName !== null && isCrownedForm(form, settlement.tier);
  const person = seatCandidatesOf(settlement).find((npc) => !(/** @type {{ ousted?: unknown }} */ (npc)).ousted
    && !(reader && cardInstitutionVeilOf(npc) === 'veiled')
    && !(crown && takerName !== null && rankIn(npc, takerName) === 1)) || null;
  /** @type {PersonRule} */
  const personRule = crown ? 'crown' : 'seat';

  /** @param {HolderRule} rule @param {RulingFaction | null} row @returns {SeatHolding} */
  const answer = (rule, row) => {
    if (row && (!reader || servable(row))) {
      return { rule, holder: row, holderName: nameOf(row), person, kind: ownKindOf(row), refused: false, personRule };
    }
    return { rule, holder: null, holderName: null, person, kind: officeKind, refused: row !== null || rule === 'R1', personRule };
  };

  // R1: the taker of the last transfer. A taker with no row is refused to the reader; the owner reads on.
  if (takerName !== null && (taker || reader)) return answer('R1', taker);

  // R2: the power whose first member is the seat-holder (the dual hat).
  const head = person ? factions.find((f) => !!f && f !== governing && nameOf(f) !== form && rankIn(person, nameOf(f)) === 1) : undefined;
  if (head) return answer('R2', head);

  // R3: a seat of a kind: the leading open power of that kind.
  if (!NO_SEAT_KIND.includes(officeKind)) {
    const same = factions
      .filter((f) => !!f && f !== governing && !isVeiledRow(f) && contestKindOf(f) === officeKind)
      .sort((a, b) => (num(b.power) - num(a.power)) || (nameOf(a) < nameOf(b) ? -1 : nameOf(a) > nameOf(b) ? 1 : 0));
    if (same.length) return answer('R3', same[0]);
  }

  // R4 / R5: nobody outside.
  return answer(APPOINTED_SEAT_FORMS.includes(bareForm(form)) ? 'R5' : 'R4', null);
}
