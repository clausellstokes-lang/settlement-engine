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
 * THE SENTENCE IS READ, AND THAT IS RULED (the chair 14:44Z, U4-CURE2 Addendum 2: `narrative on factionRelationships`
 * re-recorded with its cause). A structured read (`type`/`direction`) is refuted: a born seat's edge with its military
 * power already reads symbiotic/stable (U4-CURE2-REPORT, Step 0). So both sentences are read through ONE matcher,
 * `transferSentenceSays`, against ONE frozen list, `TRANSFER_WORDINGS`: every wording `transferRulingPower` has
 * written under the seat's law. A rewording ADDS a row and never replaces one, so a town written under the old
 * wording still reads its holder (`holderOfSeat.test.js` pins the real transfer's output into the list).
 * The taker must stand as a row of the document; for the owner a taker with no row (a power since removed) is no
 * answer, and the next rule reads; for the reader it is refused (a served document drops a hidden row and masks its
 * name, and the reader cannot tell the two apart).
 * A TRANSFER THE READ CANNOT ATTRIBUTE ANSWERS NOBODY (the chair 15:17Z, U4-CURE2 Addendum 3: fail closed inside the
 * leaf). Where no edge matches the current form, but an edge on the current seat's pair matches a frozen edge wording
 * written for ANOTHER form (the DM renamed the seat after a transfer: `factionRename.js` rewrites the pair, not the
 * sentence's lower-case form), the record holds a transfer R1 cannot attribute. R1 then answers NOBODY, for both
 * audiences (`rule` 'R1', no holder, `refused` false), and never falls through to R2 or R3: a wrong power named is
 * worse than none. NOBODY IS AN OMISSION, NEVER A STATEMENT: the seat's form stands and no taker is named.
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

/** @typedef {'edge' | 'conflict' | 'retiredEdge'} TransferSentence */
/**
 * @typedef {Object} TransferWording
 * @property {TransferSentence} sentence  `'edge'`: the seat's edge with its taker (`factionRelationships[].narrative`);
 *   `'conflict'`: the transfer's own line (`powerStructure.recentConflict`); `'retiredEdge'` (U5, the chair's cure (1) of
 *   16:43Z): a former holder's edge on the seat, retired at a transfer under the seat law. R1 never asks for a
 *   `'retiredEdge'` wording: the class exists so that wording is pinned and can never be read as an `'edge'`. In that row the
 *   free `{from}` slot holds the power that lost the seat and `{form}` the form it held
 * @property {string} wording  the sentence with its slots: `{taker}` (the taker's name, exact), `{form}` (the new form,
 *   lower case, exact), and the free slots `{from}` (the outgoing form) and `{cause}` (the cause), which match any text
 */

/**
 * THE FROZEN LIST OF WORDINGS (the chair 14:44Z, condition 2): every wording `rulingPower.js :: transferRulingPower`
 * has written under the seat's law. Today that is one edge sentence and the transfer's own line in two wordings, the
 * coup's and the lawful passage's, the latter with and without the demotion clause (two rows); and U5's two for a KEPT
 * form (the chair's condition 2: the seat changed hands without a reshaping), the coup's and the lawful passage's. A
 * change of wording ADDS a row here and never replaces one: `holderOfSeat.test.js` drives the real transfer on every
 * cause, under both laws, and reds until the new wording is in the list. The edge U5 RETIRES ("<old holder> held the
 * <form> until <taker> took it.") is ONE row of its own class, `'retiredEdge'`, and never an `'edge'` row: R1 must never
 * read a loser as a taker, nor fall to Addendum 3's "nobody" on it (`seatTransfer.test.js`, arm (10)).
 * @type {ReadonlyArray<Readonly<TransferWording>>}
 */
export const TRANSFER_WORDINGS = Object.freeze([
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('edge'), wording: '{taker} is the power behind the {form}. The seat answers to them now.' }),
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('conflict'), wording: '{taker} overthrew the {from} and reshaped the government as a {form}.' }),
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('conflict'), wording: 'Power passed to {taker} by {cause}; the government now sits as a {form}.' }),
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('conflict'), wording: 'Power passed to {taker} by {cause}; the government now sits as a {form}, and the {from} keep their place among the powers.' }),
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('conflict'), wording: '{taker} seized the {form} and left the government as it stood.' }),
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('conflict'), wording: 'Power passed to {taker} by {cause}; the {form} stands as it was.' }),
  Object.freeze({ sentence: /** @type {TransferSentence} */ ('retiredEdge'), wording: '{from} held the {form} until {taker} took it.' }),
]);

/** A wording's slots, and one literal run escaped for a pattern. */
const WORDING_SLOT = /(\{taker\}|\{form\}|\{from\}|\{cause\})/;
/** @param {string} text @returns {string} */
const literal = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * THE ONE MATCHER (the chair 14:44Z, condition 1): does `line` say, in one of the transfer's own wordings of that
 * `sentence`, that `taker` took the seat as `form`? The whole line is matched; `{taker}` and `{form}` (lower case) are
 * exact, `{from}` and `{cause}` match any text. R1's edge read and its `recentConflict` tie-break both ask here. A
 * `form` of `null` asks whether the line is that wording for ANY form (Addendum 3's unattributed transfer).
 * @param {unknown} line @param {TransferSentence} sentence @param {string} taker @param {string | null} form
 * @param {ReadonlyArray<Readonly<TransferWording>>} [wordings] the list to read (the frozen list, unless a test hands one)
 * @returns {boolean}
 */
export function transferSentenceSays(line, sentence, taker, form, wordings = TRANSFER_WORDINGS) {
  if (typeof line !== 'string' || !taker || (form !== null && typeof form !== 'string')) return false;
  const anyText = '[\\s\\S]*?';
  /** @type {Record<string, string>} */
  const slot = { '{taker}': literal(taker), '{form}': form === null ? anyText : literal(form.toLowerCase()), '{from}': anyText, '{cause}': anyText };
  return wordings.some((w) => w.sentence === sentence
    && new RegExp(`^${w.wording.split(WORDING_SLOT).map((part, i) => (i % 2 ? slot[part] : literal(part))).join('')}$`).test(line));
}

/**
 * R1's read: the name of the last transfer's taker, or null where the record holds no transfer onto the current form.
 * @param {SeatSettlement} settlement @param {string} form the governing row's name
 * @param {ReadonlyArray<Readonly<TransferWording>>} [wordings] the list to read (the frozen list, unless a test hands one)
 * @returns {string | null}
 */
export function transferTakerOf(settlement, form, wordings = TRANSFER_WORDINGS) {
  const edges = settlement.powerStructure?.factionRelationships;
  /** @type {string[]} */
  const takers = [];
  for (const rel of Array.isArray(edges) ? edges : []) {
    if (!rel || !Array.isArray(rel.pair) || !rel.pair.includes(form)) continue;
    const taker = rel.pair.find((n) => n !== form);
    if (typeof taker !== 'string' || !taker || !transferSentenceSays(rel.narrative, 'edge', taker, form, wordings)) continue;
    if (!takers.includes(taker)) takers.push(taker);
  }
  if (takers.length < 2) return takers[0] ?? null;
  const said = takers.filter((t) => transferSentenceSays(settlement.powerStructure?.recentConflict, 'conflict', t, form, wordings));
  return said.length === 1 ? said[0] : takers[takers.length - 1];
}

/**
 * Does the record hold a transfer onto this seat that R1 cannot attribute (Addendum 3)? An edge on the current seat's
 * pair whose narrative is a frozen edge wording for its other power and SOME form. Asked only where `transferTakerOf`
 * found no edge for the current form, so the wording it matches was written for another form.
 * @param {SeatSettlement} settlement @param {string} form the governing row's name @returns {boolean}
 */
function unattributedTransferOn(settlement, form) {
  const edges = settlement.powerStructure?.factionRelationships;
  return (Array.isArray(edges) ? edges : []).some((rel) => !!rel && Array.isArray(rel.pair) && rel.pair.includes(form)
    && rel.pair.some((n) => typeof n === 'string' && !!n && n !== form && transferSentenceSays(rel.narrative, 'edge', n, null)));
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

  // R1, unattributed (Addendum 3): a transfer the read cannot attribute answers NOBODY, for both audiences; no R2, no R3.
  if (takerName === null && unattributedTransferOn(settlement, form)) {
    return { rule: 'R1', holder: null, holderName: null, person, kind: officeKind, refused: false, personRule };
  }

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
