/**
 * domain/display/stateProse/decreeProsePools.js — THE CHRONICLE'S AUTHORED POOLS FOR A
 * DECREE (EM-E2; design §11 "The chronicle's voice", §13, §16, §19 ruling 2; ARCH §1's
 * `decreeProse.js` row).
 *
 * WHAT THIS IS. Every sentence the chronicle can say about a decree, written out. Design
 * §11 names the four things the voice owes — "authored pools for the table's hand,
 * 'overnight, by means the town does not understand', the off-stage forms, the
 * follows-from joins" — and this leaf is those pools and nothing else. It holds no
 * logic, reads nothing, imports nothing, and is the ONLY place a reader-facing decree
 * sentence is spelled. `decreeProse.js` chooses among these; it never writes one.
 *
 * ── FINITE SEMANTICS, AT THE GRAIN THAT MATTERS ─────────────────────────────────────
 * The law (THE PROMISE's finite-semantics clause) is typed buckets in and authored
 * prose out, never free text. A decree's typed facts are its STATUS (design §20.3), its
 * PROVENANCE (`addedBy`; EM-C1 §6's three authors), its FORM (design §13's home /
 * off-stage-against-a-phantom / off-stage-against-a-real-save) and, when the table
 * proceeded past a warning, the GUARD KIND it set aside (`GUARD_KINDS`, landed in
 * `src/domain/edit/guards.js`). Each of those is a POOL KEY here, so a fact the
 * registry cannot type has no sentence to be said about it, and the absence of a
 * surface stays the absence of a sentence (R-DST-K).
 *
 * ⛔ WHY `causes` IS ITS OWN CHANNEL AND NOT A `marks` ENTRY. The kernel's own docblock
 * records that `marks` is "an untyped bag carrying three distinct semantics" — the
 * audience mark, the demoted STATE dimensions, and the causal register's family-local
 * arms — and that a reader who knows only one of them fails silently. A CAUSE is none of
 * the three: it is closed, module-wide, and selects the sentence rather than gating it
 * by audience or by a state the caller must answer. Putting a fourth semantics into that
 * bag is the exact defect the kernel warns about, so it gets a field of its own and the
 * cause walker holds every row to it.
 *
 * ⛔ AND WHY A LINE IS COMPOSED OF PARTS RATHER THAN DRAWN WHOLE. Status by provenance by
 * form is twenty-seven cells, and each also takes an override clause per guard kind and a
 * follows-from clause: drawn whole, the corpus would be several hundred sentences that
 * repeat each other's halves, and a new op form would multiply it again. Design §11
 * already names the parts separately, so the pools are the parts and the reader joins
 * them. Every part is authored; the join adds one space and not one word.
 *
 * THE VOICE. Tier 2 of the voice walker scans every string literal here: no em dash, no
 * exclamation point, no digits, no engine token. The corpus writes "the town" generically
 * about a settlement of any size and `speakTierNoun` speaks it in the settlement's own
 * noun at the reader; that is the estate's standing arrangement and this corpus follows
 * it rather than inventing a second one.
 *
 * ⛔ `vid` IS THE STABLE ID AND IT IS APPEND-ONLY. The kernel's law 6 draw is the argmax
 * of a hash over the eligible set keyed on `vid`, so appending a wording moves about a
 * quarter of a pool's reads and every one of them moves TO the new wording. Numbers are
 * unique across the WHOLE leaf, never reused, never renumbered: the next variant takes
 * the next number after the highest one here.
 *
 * PURE HEADLESS DATA LEAF: no imports, no state, no clock, no RNG, no reader.
 *
 * @enforced-by tests/lint/decreeCause.walker.test.js + tests/domain/decreeProse.test.js
 */

/**
 * One authored decree sentence. The shape is the kernel's `StateProseVariant` plus this
 * leaf's own `causes` channel, so the kernel's eligibility and draw read it unchanged.
 *
 * @typedef {object} DecreeProseVariant
 * @property {number} vid the stable id, unique across this leaf and append-only
 * @property {string} angle the standpoint tag
 * @property {ReadonlyArray<string>} causes the causes this sentence can speak for
 * @property {string} text the sentence, slots unfilled
 * @property {ReadonlyArray<string>} [slots] every `{slot}` the sentence names
 */

/** A block of this corpus: pool key to its authored variants. */
/** @typedef {Readonly<Record<string, ReadonlyArray<DecreeProseVariant>>>} DecreeProseBlock */

/**
 * THE CLOSED CAUSE VOCABULARY. `table` is the hook's own cause for every decree it
 * applies (ARCH: each entry is converted to the kernel's event form with `cause: 'table'`);
 * `party` is design §16's second hand, whose chronicle line the owner's own ruling spells
 * as "by the party's hand". There is no third, and a variant may name no other word.
 *
 * ⛔ THE CATALOGUE BEHIND `party` IS EM-E6'S, NOT THIS LEAF'S. Design §19 ruling 2 binds a
 * party cause to `PARTY_IMPACT_KINDS` through `applyPartyImpact`; nothing here reads that
 * catalogue or mints a second one. What lands here is the VOICE the §16 ruling already
 * fixed, so that E6 binds a catalogue rather than re-authoring every sentence in the file.
 * @type {ReadonlyArray<string>}
 */
export const DECREE_LINE_CAUSES = Object.freeze(['party', 'table']);

/** Both causes, for a sentence that does not turn on whose hand moved. */
const EITHER = Object.freeze(['party', 'table']);
/** The table's hand alone. */
const TABLE = Object.freeze(['table']);
/** The party's hand alone (design §16). */
const PARTY = Object.freeze(['party']);

/** The slot naming the settlement whose chronicle this is. */
const SLOT_SETTLEMENT = Object.freeze(['settlement']);
/** The slot naming the off-stage counterparty. */
const SLOT_COUNTERPART = Object.freeze(['counterpart']);
/** The slot naming the decree this one follows from, by its chronicle line reference. */
const SLOT_PREREQUISITE = Object.freeze(['prerequisite']);

/**
 * THE HAND (design §11's "the table's hand"), keyed by the entry's PROVENANCE — EM-C1
 * §6's `addedBy`, whose three authors are `dm`, `guard` and `surveyor`. Every pool carries
 * sentences for both causes, because any of the three hands can have staged an act the
 * party then carried out.
 * @type {DecreeProseBlock}
 */
export const DECREE_HAND_POOLS = Object.freeze({
  dm: Object.freeze([
    Object.freeze({ vid: 1, angle: 'ledger', causes: TABLE, text: 'It was set down by the table\'s hand.' }),
    Object.freeze({ vid: 2, angle: 'street', causes: TABLE, text: 'The table wrote this one into the record itself.' }),
    Object.freeze({ vid: 3, angle: 'visitor', causes: TABLE, text: 'This came from the table, plainly and on purpose.' }),
    Object.freeze({ vid: 4, angle: 'ledger', causes: PARTY, text: 'It came by the party\'s hand, and the table only wrote it down.' }),
    Object.freeze({ vid: 5, angle: 'street', causes: PARTY, text: 'The party\'s hand moved first here, and the table kept the record.' }),
  ]),
  guard: Object.freeze([
    Object.freeze({ vid: 6, angle: 'ledger', causes: TABLE, text: 'The register offered this one, and the table took the offer.' }),
    Object.freeze({ vid: 7, angle: 'street', causes: TABLE, text: 'It stands here because the register proposed it and nobody refused.' }),
    Object.freeze({ vid: 8, angle: 'visitor', causes: TABLE, text: 'The register raised it, and the table let it into the order.' }),
    Object.freeze({ vid: 9, angle: 'ledger', causes: PARTY, text: 'The register offered it, and the party\'s hand carried it through.' }),
    Object.freeze({ vid: 10, angle: 'street', causes: PARTY, text: 'It reached the order through the register, with the party acting on it.' }),
  ]),
  surveyor: Object.freeze([
    Object.freeze({ vid: 11, angle: 'ledger', causes: TABLE, text: 'The Surveyor drew this one up, and the table let it stand.' }),
    Object.freeze({ vid: 12, angle: 'street', causes: TABLE, text: 'It arrived as a Surveyor\'s proposal, with its credit already spent.' }),
    Object.freeze({ vid: 13, angle: 'visitor', causes: TABLE, text: 'The Surveyor\'s hand is on this one, and the table kept it.' }),
    Object.freeze({ vid: 14, angle: 'ledger', causes: PARTY, text: 'The Surveyor drew it up, and the party\'s hand carried it out.' }),
    Object.freeze({ vid: 15, angle: 'street', causes: PARTY, text: 'It began as a Surveyor\'s proposal and ended in the party\'s hands.' }),
  ]),
});

/**
 * HOW IT STANDS, keyed by the entry's STATUS — design §20.3's three, which are also
 * EM-C1 §6's `DECREE_STATUSES`. A withdrawn decree keeps its words and did not happen;
 * saying so is design §20.3's whole point, and the chronicle says it in the herald's
 * voice rather than in the registry's.
 * @type {DecreeProseBlock}
 */
export const DECREE_STANDING_POOLS = Object.freeze({
  applied: Object.freeze([
    Object.freeze({ vid: 16, angle: 'ledger', causes: EITHER, text: 'It has happened, and the town has lived it.' }),
    Object.freeze({ vid: 17, angle: 'street', causes: EITHER, text: 'The advance carried it out, and what followed followed from it.' }),
    Object.freeze({ vid: 18, angle: 'visitor', causes: EITHER, text: 'It is done, and the record keeps it where the doing put it.' }),
  ]),
  pending: Object.freeze([
    Object.freeze({ vid: 19, angle: 'ledger', causes: EITHER, text: 'It waits for the next advance, and nothing of it has happened yet.' }),
    Object.freeze({ vid: 20, angle: 'street', causes: EITHER, text: 'Nothing has come of it yet; it sits in the order, waiting its turn.' }),
    Object.freeze({ vid: 21, angle: 'visitor', causes: EITHER, text: 'The order holds it, unspent, until the town moves again.' }),
  ]),
  withdrawn: Object.freeze([
    Object.freeze({ vid: 22, angle: 'ledger', causes: EITHER, text: 'It was set aside before it could happen, and its words were kept.' }),
    Object.freeze({ vid: 23, angle: 'street', causes: EITHER, text: 'Nothing came of it; the order let it go and kept what it said.' }),
    Object.freeze({ vid: 24, angle: 'visitor', causes: EITHER, text: 'It was withdrawn, and the register still carries the sentence it would have been.' }),
  ]),
});

/**
 * THE OFF-STAGE FORMS (design §11 and §13), keyed by where the act lands. `home` is the
 * town's own ground; the two off-stage keys are §13's PHANTOM and REAL badges, which the
 * design rules are SHOWN rather than hidden. The phantom pool carries §13's law in the
 * herald's voice and nothing more: what leaves comes back by the estate's own procedures,
 * what is declared is recorded, and nothing from outside comes home.
 * @type {DecreeProseBlock}
 */
export const DECREE_FORM_POOLS = Object.freeze({
  home: Object.freeze([
    Object.freeze({ vid: 25, angle: 'ledger', causes: EITHER, text: 'The act falls on the town\'s own ground.' }),
    Object.freeze({ vid: 26, angle: 'street', causes: EITHER, slots: SLOT_SETTLEMENT, text: 'Everything it touches is here, in {settlement}, where anyone can see it.' }),
    Object.freeze({ vid: 27, angle: 'visitor', causes: EITHER, text: 'It is the town\'s own business, and the town\'s own cost.' }),
  ]),
  'off-stage-phantom': Object.freeze([
    Object.freeze({ vid: 28, angle: 'ledger', causes: EITHER, text: 'It reaches past the town\'s roads, overnight, by means the town does not understand.' }),
    Object.freeze({ vid: 29, angle: 'street', causes: EITHER, text: 'Whatever answers out there answers off the record; what returns is the town\'s own, and nothing else comes home.' }),
    Object.freeze({ vid: 30, angle: 'visitor', causes: EITHER, slots: SLOT_COUNTERPART, text: 'Against {counterpart} the town can only send and receive, and the rest is a story told here.' }),
  ]),
  'off-stage-real': Object.freeze([
    Object.freeze({ vid: 31, angle: 'ledger', causes: EITHER, text: 'It crosses to a neighbour that answers for itself, and the answer will be its own.' }),
    Object.freeze({ vid: 32, angle: 'street', causes: EITHER, text: 'The far side of this is a place with its own record, and it will keep one.' }),
    Object.freeze({ vid: 33, angle: 'visitor', causes: EITHER, slots: SLOT_COUNTERPART, text: '{counterpart} stands on the far side of it, and will act as it sees fit.' }),
  ]),
});

/**
 * THE OVERRIDE LINE, keyed by the GUARD KIND the table proceeded past. The five keys are
 * `GUARD_KINDS` (`src/domain/edit/guards.js`), and every sentence NAMES its own kind, so a
 * reader learns which warning was set aside rather than that one was. Guards are
 * suggestive and never refuse (design §2.7), so these sentences record a choice and never
 * a fault.
 * @type {DecreeProseBlock}
 */
export const DECREE_OVERRIDE_POOLS = Object.freeze({
  connection: Object.freeze([
    Object.freeze({ vid: 34, angle: 'ledger', causes: EITHER, text: 'The register had asked for a connection to be made first, and the table went on without it.' }),
    Object.freeze({ vid: 35, angle: 'street', causes: EITHER, text: 'A connection the register wanted was never made, and the table proceeded anyway.' }),
    Object.freeze({ vid: 36, angle: 'visitor', causes: EITHER, text: 'The register named a missing connection; the table heard it and moved on.' }),
  ]),
  contention: Object.freeze([
    Object.freeze({ vid: 37, angle: 'ledger', causes: EITHER, text: 'The register called it a contention with an earlier decree, and the table let this one stand.' }),
    Object.freeze({ vid: 38, angle: 'street', causes: EITHER, text: 'Two decrees were in contention over the same fact, and the table chose this one.' }),
    Object.freeze({ vid: 39, angle: 'visitor', causes: EITHER, text: 'The register raised the contention, and the table answered by proceeding.' }),
  ]),
  contradiction: Object.freeze([
    Object.freeze({ vid: 40, angle: 'ledger', causes: EITHER, text: 'The register named the contradiction, and the table set the warning aside.' }),
    Object.freeze({ vid: 41, angle: 'street', causes: EITHER, text: 'A contradiction was on the page, and the table wrote past it.' }),
    Object.freeze({ vid: 42, angle: 'visitor', causes: EITHER, text: 'The register saw a contradiction here, and the table proceeded regardless.' }),
  ]),
  prerequisite: Object.freeze([
    Object.freeze({ vid: 43, angle: 'ledger', causes: EITHER, text: 'The register named a prerequisite still wanting, and the table did not wait for it.' }),
    Object.freeze({ vid: 44, angle: 'street', causes: EITHER, text: 'A prerequisite was missing, and the table proceeded without it.' }),
    Object.freeze({ vid: 45, angle: 'visitor', causes: EITHER, text: 'The register asked for a prerequisite first, and the table went ahead.' }),
  ]),
  totality: Object.freeze([
    Object.freeze({ vid: 46, angle: 'ledger', causes: EITHER, text: 'The register warned that the totality would not balance, and the table let it ride.' }),
    Object.freeze({ vid: 47, angle: 'street', causes: EITHER, text: 'A totality the register keeps was left short, and the table proceeded.' }),
    Object.freeze({ vid: 48, angle: 'visitor', causes: EITHER, text: 'The register raised the totality, and the table accepted the imbalance.' }),
  ]),
});

/**
 * THE FOLLOWS-FROM JOIN (design §11). EVERY variant names `{prerequisite}` on purpose:
 * the clause exists to carry the pointer, so a join with no line reference to carry must
 * render NOTHING rather than a sentence that gestures at a decree it cannot name. The
 * kernel's anchored liveness is what enforces that, and it is why this pool has no
 * slotless member.
 * @type {ReadonlyArray<DecreeProseVariant>}
 */
export const DECREE_FOLLOWS_FROM_POOL = Object.freeze([
  Object.freeze({ vid: 49, angle: 'ledger', causes: EITHER, slots: SLOT_PREREQUISITE, text: 'It follows from the decree recorded as {prerequisite}.' }),
  Object.freeze({ vid: 50, angle: 'street', causes: EITHER, slots: SLOT_PREREQUISITE, text: 'Read it beside {prerequisite}, which came first and made room for it.' }),
  Object.freeze({ vid: 51, angle: 'visitor', causes: EITHER, slots: SLOT_PREREQUISITE, text: 'It stands on {prerequisite}, and would not have stood alone.' }),
]);

/**
 * EVERY POOL OF THIS CORPUS, addressed the way the reader draws it: block id to pool key
 * to variants. The reader and the cause walker both enumerate THIS, so a pool added
 * without an address is a pool neither of them can reach, and a pool added with one is
 * governed the day it lands.
 * @type {Readonly<Record<string, DecreeProseBlock>>}
 */
export const DECREE_PROSE_BLOCKS = Object.freeze({
  'DEC-FOLLOWS': Object.freeze({ '*': DECREE_FOLLOWS_FROM_POOL }),
  'DEC-FORM': DECREE_FORM_POOLS,
  'DEC-HAND': DECREE_HAND_POOLS,
  'DEC-OVERRIDE': DECREE_OVERRIDE_POOLS,
  'DEC-STANDING': DECREE_STANDING_POOLS,
});
