/**
 * treatyOrientation.js — WHO GIVES AND WHO RECEIVES (chair ruling CR-WR10-G).
 *
 * Every treaty this engine has ever minted was the end of a war, so every consumer
 * learned to read one pair of fields — `victorId` and `loserId` — and to spell the two
 * roles it needs out of them: the party that HANDS SOMETHING OVER, and the party that
 * RECEIVES it. WR-10's sovereignty market mints a treaty with no war in it at all. A
 * sale has a SELLER and a BUYER, and it has them for good reasons: naming the buyer a
 * "victor" would be a lie the ledger then carries forever, and leaving the war fields
 * absent turns every `String(treaty.victorId)` in the tree into the four-character
 * string `"undefined"` — which compiles, renders, and PERSISTS (peaceTerms' PASS 2
 * writes `defaultedBy` from exactly such a read, and a defaulted sale would have
 * accused a court literally named `undefined` of oathbreaking).
 *
 * So the orientation is READ ONCE, HERE, and every consumer asks this module instead of
 * spelling the fields itself. ONE reader, many consumers — the same discipline
 * `treatyEnforcement.js` was extracted for, and for the same reason: two spellings of
 * "who owes whom" would eventually disagree, and a treaty whose enforcement bound one
 * party while its receipts named the other is a peace nobody can reason about.
 *
 * ── THE TWO AXES, AND WHY THEY ARE NOT THE SAME AXIS ────────────────────────────
 *
 * THE CONVEYANCE AXIS — who hands the holding over:
 *   wartime   the LOSER gives, the VICTOR receives.
 *   sale      the SELLER gives, the BUYER receives.
 *
 * THE OBLIGATION AXIS — who bears the terms' burden:
 *   wartime   the LOSER pays; the tribute, the readiness cap and the ceded garrison
 *             all bind the defeated party.
 *   sale      the BUYER pays. The consideration flows to the seller — that is what
 *             makes it a sale rather than a confiscation — so on this axis the two
 *             roles are the MIRROR of the conveyance axis.
 *
 * Collapsing the two would have been the easy mistake and a silent one: a sale's stream
 * terms would have drawn grain out of the party that was owed it. The axes are
 * therefore separate fields with separate names, and the direction is pinned.
 *
 * `unknown` IS A REAL VERDICT. A treaty carrying neither pair resolves to empty strings
 * and `resolved: false` — never to a placeholder, never to `"undefined"`, and never to
 * one party silently standing in for the other. A caller that treats an unresolved
 * orientation as "this term binds nobody" is correct.
 *
 * `negotiated` IS THE FOURTH KIND, AND IT HAS NO DIRECTION (TREATY-VOICE U1; FPQ-36, the
 * owner's decision of 2026-09-24, which re-opened GR-3B-ORIENT for a fourth kind when no
 * path without one existed). A pact two courts signed in peace names its two courts and
 * nothing more at the treaty level: its clauses are asked for one at a time and point
 * their own ways (`termObligationOf` below), so a treaty-level giver, receiver, obligor
 * or obligee would be a direction read off the party list, which GR-3B-ORIENT §8 forbids.
 * The answer therefore keeps `resolved: false` and every role slot EMPTY, exactly as the
 * unresolved answer does, and adds the two courts in their stored order as `parties` and
 * `partyNames`. Every consumer that asks WHO OWES reads what it read before; only a
 * consumer that asks WHO SIGNED (the lifecycle voice) can hear the difference.
 *
 * PURE + ZERO IMPORTS. It is reached by `treatyEnforcement.js` — itself extracted to be
 * importable from anywhere in the war layer without closing a cycle — so it must be
 * able to close none of its own.
 */

/** The closed orientation vocabulary. `unknown` is a verdict, not a fallback. The order
 *  is the instruments' arrival order (war, then WR-10's sale, then GR-2's pact), the same
 *  order TERM_OBLIGATION_KINDS below has always carried. */
export const TREATY_ORIENTATION_KINDS = Object.freeze(['unknown', 'wartime', 'sale', 'negotiated']);

/** The role words a party can hold in a treaty, per orientation kind. Closed, and
 *  exported so a display never invents a fifth. */
export const TREATY_ROLE_WORDS = Object.freeze({
  wartime: Object.freeze({ giver: 'the bound party', receiver: 'victor' }),
  sale: Object.freeze({ giver: 'the seller', receiver: 'the buyer' }),
  unknown: Object.freeze({ giver: 'a party', receiver: 'a party' }),
  // A negotiated instrument has no treaty-level giver or receiver (its role slots are
  // empty by contract), so its two words are the stranger's, and `treatyRoleWord` answers
  // exactly what it answered before the kind existed.
  negotiated: Object.freeze({ giver: 'a party', receiver: 'a party' }),
});

/** A string, or the empty string — NEVER `String(undefined)`. This one coercion is the
 *  whole needs-guard: every id and name below passes through it, so no consumer of this
 *  module can render or persist the literal `"undefined"`.
 *  @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * @typedef {Object} TreatyOrientation
 * @property {string} kind        a TREATY_ORIENTATION_KINDS member
 * @property {boolean} resolved   false ⇒ every id below is the empty string
 * @property {string} giverId     hands the holding over (wartime loser · sale seller)
 * @property {string} receiverId  acquires it (wartime victor · sale buyer)
 * @property {string} obligorId   bears the terms' burden (wartime loser · sale BUYER)
 * @property {string} obligeeId   is owed them (wartime victor · sale SELLER)
 * @property {string} giverName   the id when no name was recorded — never `undefined`
 * @property {string} receiverName
 * @property {string} obligorName
 * @property {string} obligeeName
 * @property {string[]} [parties]     `negotiated` only: the two courts, in the record's
 *   stored order (an ORDER, never a direction). Absent on every other kind.
 * @property {string[]} [partyNames]  `negotiated` only: their reader names, aligned.
 */

/** The unresolved orientation. Every field a caller might branch on is present and
 *  empty, so a `!orientation.resolved` guard and a `!orientation.obligorId` guard are
 *  the same guard. @returns {TreatyOrientation} */
function unresolvedOrientation() {
  return {
    kind: 'unknown',
    resolved: false,
    giverId: '',
    receiverId: '',
    obligorId: '',
    obligeeId: '',
    giverName: '',
    receiverName: '',
    obligorName: '',
    obligeeName: '',
  };
}

/**
 * THE NEGOTIATED ANSWER, or null (TREATY-VOICE U1). The record must carry
 * exactly two distinct parties AND the saved `partyNames` key naming both with a real
 * name, never the id echoed back. That key is written by the pact mint only
 * (`pactFormation.js :: signPactProposal`), so a war or sale record never reaches here
 * with it, and a two-party record that names nobody stays `unknown`: a pact that cannot
 * say who signed it cannot be voiced, and failing closed is what the address law asks.
 * ⚠ IT BUILDS THE WHOLE ANSWER RATHER THAN HANDING BACK A `{ ids, names }` PAIR, and that is
 * measured, not taste: this module sits inside the Foundry export's closure, and the
 * writer-reach walker matches property reads BY KEY NAME, so a `.names` read here moved the
 * unrelated identity `names on inst` onto the Foundry surface (writerReach, 2026-09-24).
 * @param {Record<string, unknown>} row
 * @returns {TreatyOrientation | null}
 */
function negotiatedOrientationOf(row) {
  const parties = Array.isArray(row.parties) ? row.parties.map(text) : [];
  if (parties.length !== 2) return null;
  const [first, second] = parties;
  if (!first || !second || first === second) return null;
  const names = recordOf(row.partyNames);
  const firstName = text(names[first]);
  const secondName = text(names[second]);
  if (!firstName || !secondName || firstName === first || secondName === second) return null;
  return { ...unresolvedOrientation(), kind: 'negotiated', parties: [first, second], partyNames: [firstName, secondName] };
}

/**
 * READ ONE TREATY'S ORIENTATION.
 *
 * THE SALE FIELDS WIN WHEN THEY ARE BOTH PRESENT, and the order matters: a sale treaty
 * carries `sellerId`/`buyerId` and NOT the war pair (they are drop-when-absent under the
 * T4 byte-neutrality law — an absent key costs nothing, and a key set to null is still a
 * key and still a byte), so checking the sale pair first is what makes the war pair's
 * absence mean "this was never a war" rather than "this treaty is malformed". A record
 * carrying BOTH is read as a sale and its war pair ignored: the market is the newer
 * instrument, and a document that names a buyer has told you what it is.
 *
 * @param {Record<string, unknown> | null | undefined} treaty
 * @returns {TreatyOrientation}
 */
export function treatyOrientationOf(treaty) {
  const row = recordOf(treaty);
  const sellerId = text(row.sellerId);
  const buyerId = text(row.buyerId);
  if (sellerId && buyerId && sellerId !== buyerId) {
    const giverName = text(row.sellerName) || sellerId;
    const receiverName = text(row.buyerName) || buyerId;
    return {
      kind: 'sale',
      resolved: true,
      giverId: sellerId,
      receiverId: buyerId,
      // THE MIRROR (see the header's two-axes note): on a sale the BUYER pays.
      obligorId: buyerId,
      obligeeId: sellerId,
      giverName,
      receiverName,
      obligorName: receiverName,
      obligeeName: giverName,
    };
  }

  const loserId = text(row.loserId);
  const victorId = text(row.victorId);
  if (loserId && victorId && loserId !== victorId) {
    const giverName = text(row.loserName) || loserId;
    const receiverName = text(row.victorName) || victorId;
    return {
      kind: 'wartime',
      resolved: true,
      giverId: loserId,
      receiverId: victorId,
      obligorId: loserId,
      obligeeId: victorId,
      giverName,
      receiverName,
      obligorName: giverName,
      obligeeName: receiverName,
    };
  }

  // THE FOURTH KIND, checked LAST so a war or sale pair always wins (see the header). The
  // role slots stay empty and `resolved` stays false: only the two courts are added.
  const negotiated = negotiatedOrientationOf(row);
  if (negotiated) return negotiated;

  return unresolvedOrientation();
}

/** The two sides of a RESOLVED treaty DOCUMENT, in this module's own role words rather
 *  than history's. Returned by `documentSideOf`; `null` is the third answer. */
export const TREATY_DOCUMENT_SIDES = Object.freeze(['receiver', 'giver']);

/**
 * WHICH SIDE OF A RESOLVED DOCUMENT A PARTY STANDS ON.
 *
 * `peaceTermsDocument.treatyDocument` publishes its two parties in the HISTORIC slots
 * `victorId` / `loserId`, and it fills them FROM THIS MODULE: `victorId` is
 * `treatyOrientationOf(treaty).receiverId` and `loserId` is `.giverId`, on a WR-10 sale
 * exactly as on a war settlement, which is why that read-model's own typedef says the two
 * fields carry "the buyer and the seller on a WR-10 sale". A display holding such a
 * document therefore has NO orientation left to resolve. It has a lookup.
 *
 * ⛔ AND THE LOOKUP MAY NOT LIVE IN THE DISPLAY LEAF. Spelling `doc.victorId` there is
 * indistinguishable — to a reader and to CR-WR10-G's consumer census alike — from
 * resolving a ledger row's parties by hand, which is the whole defect this ruling exists
 * to forbid. `src/domain/display/stateProse/warFaithStateProse.js` was convicted by that
 * census for exactly this: it holds `TreatyDocument`s, never the ledger, and the census's
 * `\.treaties\b` probe cannot tell a document array apart from a ledger read. So the
 * lookup lives here, with the vocabulary it belongs to — ONE reader, many consumers.
 *
 * ⚠ IT IS NOT `treatyOrientationOf` APPLIED TO A DOCUMENT, and that distinction is
 * load-bearing. A document carries no `sellerId`/`buyerId` pair, so passing one to that
 * reader would fall through to the war arm and report `kind: 'wartime'` for a purchase —
 * re-introducing the lie, one layer up. This reads the slots for what they are: already
 * resolved.
 *
 * NEVER A GUESS. A document missing the slot, or carrying a non-string in it, matches
 * nothing: `text()` refuses, so no party is ever compared against the four-character
 * string `"undefined"`.
 *
 * @param {Record<string, unknown> | null | undefined} doc a peaceTermsDocument TreatyDocument
 * @param {unknown} partyId
 * @returns {'receiver' | 'giver' | null}
 */
export function documentSideOf(doc, partyId) {
  const row = recordOf(doc);
  const id = text(partyId);
  if (!id) return null;
  if (id === text(row.victorId)) return 'receiver';
  if (id === text(row.loserId)) return 'giver';
  return null;
}

/** THE PER-TERM OBLIGATION VOCABULARY (chair ruling CR-GR3B-3-R1). The same four members
 *  as TREATY_ORIENTATION_KINDS since TREATY-VOICE U1 widened that list by `negotiated`
 *  (FPQ-36). Before it, this list was a superset by exactly that member; the instrument
 *  kind now names the pact too, but it still carries NO treaty-level direction, because
 *  §3.2's multi-round record makes one ill-defined (one record, two clauses, opposite
 *  ways). A beneficiary-bearing clause resolves its own direction in the first arm below;
 *  a clause with none delegates, and on a negotiated instrument that answer is kind
 *  `negotiated` with the empty pair and `resolved: false`, which binds nobody exactly as
 *  the unresolved answer does. Both lists are pinned by
 *  tests/domain/treatyOrientationWr10g.test.js. */
export const TERM_OBLIGATION_KINDS = Object.freeze(['unknown', 'wartime', 'sale', 'negotiated']);

/**
 * @typedef {Object} TermObligation
 * @property {string} kind       a TERM_OBLIGATION_KINDS member
 * @property {boolean} resolved  false ⇒ both ids below are the empty string
 * @property {boolean} mutual    true ⇒ both parties hold it; there is NO transfer direction
 * @property {string} obligorId  bears this clause's burden — pays, is watched, is named on default
 * @property {string} obligeeId  is owed it
 */

/** The unresolved obligation. `unknown` is a verdict here exactly as it is above: a
 *  caller treating it as "this clause binds nobody" is correct. @returns {TermObligation} */
function unresolvedObligation() {
  return { kind: 'unknown', resolved: false, mutual: false, obligorId: '', obligeeId: '' };
}

/**
 * READ ONE CLAUSE'S OBLIGATION — who owes THIS term, on THIS instrument.
 *
 * A war settlement and a sale carry one direction for the whole document, and every one
 * of their clauses inherits it. A negotiated pact does not: its clauses are asked for one
 * at a time, by either court, and a reciprocal bargain is two opposed promises on a single
 * record. So the axis is the datum the record already carries — the term's `beneficiary`,
 * written by `draftPactSheet` and read by `grantTermFor` since GR-3. The party a clause
 * runs TO is owed it; the OTHER party promised it, and therefore pays it, is watched on
 * it, and is the one named when it defaults. That is what the clause's own receipt has
 * always said in words: `<the non-beneficiary> promises … to <the beneficiary>`.
 *
 * THE ORDER OF THE THREE ARMS IS THE CONTRACT. A term carrying a beneficiary is
 * negotiated provenance and never consults the instrument; a term carrying none delegates,
 * and that arm is TOTAL over every war-door, carried-sheet and sale term in the tree,
 * because no such term literal writes the key. Anything else fails closed — no guess, no
 * placeholder, and never one party standing in for the other.
 *
 * @param {Record<string, unknown> | null | undefined} treaty
 * @param {Record<string, unknown> | null | undefined} term
 * @returns {TermObligation}
 */
export function termObligationOf(treaty, term) {
  const beneficiary = text(recordOf(term).beneficiary);
  if (beneficiary === 'both') {
    // A REAL VERDICT, NOT AN UNRESOLVED ONE: both courts hold this clause and nobody hands
    // anything over. `mutual` is its own field precisely so no caller has to infer that
    // from the empty ids and get "unknown" instead.
    return { kind: 'negotiated', resolved: true, mutual: true, obligorId: '', obligeeId: '' };
  }
  if (beneficiary) {
    const rawParties = recordOf(treaty).parties;
    const parties = Array.isArray(rawParties) ? rawParties.map(text) : [];
    const [first, second] = parties;
    if (parties.length !== 2 || !first || !second || first === second) return unresolvedObligation();
    if (first !== beneficiary && second !== beneficiary) return unresolvedObligation();
    return {
      kind: 'negotiated',
      resolved: true,
      mutual: false,
      obligorId: first === beneficiary ? second : first,
      obligeeId: beneficiary,
    };
  }
  const instrument = treatyOrientationOf(treaty);
  return {
    kind: instrument.kind,
    resolved: instrument.resolved,
    mutual: false,
    obligorId: instrument.obligorId,
    obligeeId: instrument.obligeeId,
  };
}

/**
 * The word for one party's role in one treaty — 'victor' / 'the bound party' on a war
 * settlement, 'the buyer' / 'the seller' on a sale, 'a party' for anyone else. Exported
 * so the panels and the dossier speak the SAME four words the ledger's orientation
 * knows, instead of each deciding that a non-victor must be a loser.
 * @param {TreatyOrientation} orientation @param {unknown} partyId @returns {string}
 */
export function treatyRoleWord(orientation, partyId) {
  const id = text(partyId);
  const table = /** @type {Record<string, { giver: string, receiver: string }>} */ (TREATY_ROLE_WORDS);
  const words = table[String(orientation?.kind || '')] || TREATY_ROLE_WORDS.unknown;
  if (id && id === orientation?.receiverId) return words.receiver;
  if (id && id === orientation?.giverId) return words.giver;
  return TREATY_ROLE_WORDS.unknown.giver;
}
