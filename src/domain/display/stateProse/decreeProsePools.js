/**
 * domain/display/stateProse/decreeProsePools.js — THE CHRONICLE'S AUTHORED POOLS FOR A
 * DECREE (EM-E2, extended by EM-E6's two blocks; design §11 "The chronicle's voice",
 * §13, §16, §19 ruling 2; ARCH §1's `decreeProse.js` row).
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
 * ⛔ THE CATALOGUE BEHIND `party` IS EM-E6'S, NOT THIS LEAF'S, AND IT STAYS SO NOW THAT
 * E6 HAS LANDED. Design §19 ruling 2 binds a party cause to `PARTY_IMPACT_KINDS` through
 * `applyPartyImpact`; nothing here reads that catalogue or mints a second one. E6 added
 * the two blocks at the foot of this file whose POOL KEYS are that catalogue's words and
 * the event catalogue's families, and it added them the way this leaf takes everything —
 * as spelled keys with no import, held to the imported rosters by the battery and the
 * cause walker. `src/domain/edit/eventCatalogue.js` is where the two catalogues are
 * actually read, and it is the only module that reads them for a decree.
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
 * WHAT WAS SET FOR A COMING TURN (EM-E6; design §16 "Events, predetermined or shaped by
 * the party", §19 ruling 2), keyed by the FAMILY of the event the decree schedules.
 *
 * ⛔ THE KEYS ARE THE EVENT CATALOGUE'S OWN FAMILIES AND NOTHING ELSE. Design §19 ruling
 * 2 is "bind to what is built; never mint a second surface": the catalogue is
 * `affordanceManifest.js`'s forty-one typed settlement events minus
 * `NON_AUTHORABLE_EVENTS`, and `VERB_FAMILIES` is its own seven-word grouping of them.
 * This leaf imports nothing, so the keys are SPELLED here and HELD to the imported
 * roster by the battery and by the cause walker, exactly as the override block's keys
 * are held to `GUARD_KINDS`. A family with no pool is a scheduled event the chronicle
 * would have to fall silent about, and that is the red.
 *
 * ⛔ AND WHY THE FAMILY RATHER THAN THE TYPE. Thirty-two authorable types would be
 * thirty-two pools, most of them saying the same thing about a neighbouring verb, and a
 * thirty-third verb would arrive mute. The family is the grain at which the herald
 * actually speaks: the reader learns what part of the town's life is already spoken for,
 * and the typed event itself stays a fact the registry carries rather than a sentence.
 * @type {DecreeProseBlock}
 */
export const DECREE_EVENT_POOLS = Object.freeze({
  Economy: Object.freeze([
    Object.freeze({ vid: 52, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on the town\'s trade and its keeping.' }),
    Object.freeze({ vid: 53, angle: 'street', causes: EITHER, text: 'The order names a change in what the town makes, holds and sells, due when the turn comes round.' }),
    Object.freeze({ vid: 54, angle: 'visitor', causes: EITHER, text: 'Something in the market\'s arrangement is already spoken for, and waits only on the day.' }),
  ]),
  Faith: Object.freeze([
    Object.freeze({ vid: 55, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on what the town keeps faith with.' }),
    Object.freeze({ vid: 56, angle: 'street', causes: EITHER, text: 'The order names a change in the town\'s observances, due when the turn comes round.' }),
    Object.freeze({ vid: 57, angle: 'visitor', causes: EITHER, text: 'What is honoured here is already spoken for, and waits only on the day.' }),
  ]),
  People: Object.freeze([
    Object.freeze({ vid: 58, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on the people who live here by name.' }),
    Object.freeze({ vid: 59, angle: 'street', causes: EITHER, text: 'The order names a change among the town\'s own folk, due when the turn comes round.' }),
    Object.freeze({ vid: 60, angle: 'visitor', causes: EITHER, text: 'A life here is already spoken for, and waits only on the day.' }),
  ]),
  Power: Object.freeze([
    Object.freeze({ vid: 61, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on who holds authority here.' }),
    Object.freeze({ vid: 62, angle: 'street', causes: EITHER, text: 'The order names a change in who answers for the town, due when the turn comes round.' }),
    Object.freeze({ vid: 63, angle: 'visitor', causes: EITHER, text: 'Who speaks for this place is already spoken for, and waits only on the day.' }),
  ]),
  Realm: Object.freeze([
    Object.freeze({ vid: 64, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on the town\'s whole standing in the wider realm.' }),
    Object.freeze({ vid: 65, angle: 'street', causes: EITHER, slots: SLOT_SETTLEMENT, text: 'The order names a change to what {settlement} itself is, due when the turn comes round.' }),
    Object.freeze({ vid: 66, angle: 'visitor', causes: EITHER, text: 'The town\'s own place in the world is already spoken for, and waits only on the day.' }),
  ]),
  Relations: Object.freeze([
    Object.freeze({ vid: 67, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on the town\'s dealings with its neighbours.' }),
    Object.freeze({ vid: 68, angle: 'street', causes: EITHER, text: 'The order names a change between the town and those it lives beside, due when the turn comes round.' }),
    Object.freeze({ vid: 69, angle: 'visitor', causes: EITHER, text: 'How the town stands with its neighbours is already spoken for, and waits only on the day.' }),
  ]),
  War: Object.freeze([
    Object.freeze({ vid: 70, angle: 'ledger', causes: EITHER, text: 'What was set down for the coming turn falls on the town as a trouble it must carry.' }),
    Object.freeze({ vid: 71, angle: 'street', causes: EITHER, text: 'The order names a hardship the town will meet, due when the turn comes round.' }),
    Object.freeze({ vid: 72, angle: 'visitor', causes: EITHER, text: 'A trouble is already spoken for, and waits only on the day.' }),
  ]),
});

/**
 * WHAT THE PARTY DID (EM-E6; design §16's second hand, §19 ruling 2), keyed by the
 * PARTY IMPACT KIND. The twelve keys are `PARTY_IMPACT_KINDS`', the one party vocabulary
 * the tree has, and they are spelled here and held to the imported catalogue by the
 * battery: design §19 ruling 2 forbids a second party vocabulary, and a thirteenth kind
 * arriving without a pool is a deed the chronicle could not name.
 *
 * ⛔ THE ONLY SINGLE-CAUSE BLOCK OF THIS CORPUS, AND THAT IS STRUCTURAL RATHER THAN AN
 * OVERSIGHT. Every other block answers "how does a decree read", which is a question the
 * table's hand and the party's hand both have an answer to. This block answers "what did
 * the party do", which under `cause: 'table'` has no referent at all: there is no impact
 * kind, so there is no deed to name, and a sentence here written for the table would be
 * the chronicle inventing an actor. The cause walker holds the block to EXACTLY the one
 * cause rather than merely excusing it from the other, so a table sentence appearing here
 * is convicted as loudly as a missing party one.
 *
 * ⛔ EVERY POOL CAN SAY THE OWNER'S OWN WORDS. Design §16's chair ruling is that a
 * party-caused line reads "by the party's hand"; the LEDGER variant of every pool carries
 * that phrase verbatim and the walker holds all twelve to it, so the ruling is enforced as
 * a property of the corpus rather than as one line that happened to draw.
 * @type {DecreeProseBlock}
 */
export const DECREE_PARTY_DEED_POOLS = Object.freeze({
  bolster_faction: Object.freeze([
    Object.freeze({ vid: 73, angle: 'ledger', causes: PARTY, text: 'A faction\'s standing here was raised by the party\'s hand.' }),
    Object.freeze({ vid: 74, angle: 'street', causes: PARTY, text: 'One of the town\'s factions walks taller since the party took its side.' }),
  ]),
  broker_relationship: Object.freeze([
    Object.freeze({ vid: 75, angle: 'ledger', causes: PARTY, text: 'The quarrel between the two places was cooled by the party\'s hand.' }),
    Object.freeze({ vid: 76, angle: 'street', causes: PARTY, text: 'The party stood between the two of them until the shouting stopped.' }),
  ]),
  clear_condition: Object.freeze([
    Object.freeze({ vid: 77, angle: 'ledger', causes: PARTY, text: 'What the town had been living under was lifted by the party\'s hand.' }),
    Object.freeze({ vid: 78, angle: 'street', causes: PARTY, text: 'The thing everyone had learned to live with is simply gone, and the party saw to it.' }),
  ]),
  ease_stressor: Object.freeze([
    Object.freeze({ vid: 79, angle: 'ledger', causes: PARTY, text: 'The trouble was blunted, though not ended, by the party\'s hand.' }),
    Object.freeze({ vid: 80, angle: 'street', causes: PARTY, text: 'The worst of it was pulled back a little; the thing itself is still here.' }),
  ]),
  empower_npc: Object.freeze([
    Object.freeze({ vid: 81, angle: 'ledger', causes: PARTY, text: 'A person\'s position in the town was advanced by the party\'s hand.' }),
    Object.freeze({ vid: 82, angle: 'street', causes: PARTY, text: 'Somebody here stands further along than they did, and the party carried them.' }),
  ]),
  impose_condition: Object.freeze([
    Object.freeze({ vid: 83, angle: 'ledger', causes: PARTY, text: 'Something new settled on the town by the party\'s hand.' }),
    Object.freeze({ vid: 84, angle: 'street', causes: PARTY, text: 'The town is living under something it was not living under before, and it arrived with the party.' }),
  ]),
  inflame_relationship: Object.freeze([
    Object.freeze({ vid: 85, angle: 'ledger', causes: PARTY, text: 'The quarrel between the two places was sharpened by the party\'s hand.' }),
    Object.freeze({ vid: 86, angle: 'street', causes: PARTY, text: 'Whatever the party did out there, the two of them stand further apart for it.' }),
  ]),
  name_attacker: Object.freeze([
    Object.freeze({ vid: 87, angle: 'ledger', causes: PARTY, text: 'The force behind the trouble was named at last, by the party\'s hand.' }),
    Object.freeze({ vid: 88, angle: 'street', causes: PARTY, text: 'Somebody finally put a name to whoever is doing this, and the name came from the party.' }),
  ]),
  remove_npc: Object.freeze([
    Object.freeze({ vid: 89, angle: 'ledger', causes: PARTY, text: 'A person was taken out of the town\'s affairs altogether by the party\'s hand.' }),
    Object.freeze({ vid: 90, angle: 'street', causes: PARTY, text: 'One of the town\'s own is not in the reckoning any more, and the party is the reason.' }),
  ]),
  resolve_stressor: Object.freeze([
    Object.freeze({ vid: 91, angle: 'ledger', causes: PARTY, text: 'The trouble that had its grip on the town was ended by the party\'s hand.' }),
    Object.freeze({ vid: 92, angle: 'street', causes: PARTY, text: 'Whatever had been gnawing at the place, the party finished it, and the town knows whom to thank.' }),
  ]),
  undermine_faction: Object.freeze([
    Object.freeze({ vid: 93, angle: 'ledger', causes: PARTY, text: 'A faction\'s standing here was cut down by the party\'s hand.' }),
    Object.freeze({ vid: 94, angle: 'street', causes: PARTY, text: 'One of the town\'s factions lost ground, and the party is why.' }),
  ]),
  worsen_stressor: Object.freeze([
    Object.freeze({ vid: 95, angle: 'ledger', causes: PARTY, text: 'The trouble was deepened by the party\'s hand, whether or not that was the intent.' }),
    Object.freeze({ vid: 96, angle: 'street', causes: PARTY, text: 'What was bad got worse after the party passed through, and the town noticed.' }),
  ]),
});

/**
 * EVERY POOL OF THIS CORPUS, addressed the way the reader draws it: block id to pool key
 * to variants. The reader and the cause walker both enumerate THIS, so a pool added
 * without an address is a pool neither of them can reach, and a pool added with one is
 * governed the day it lands.
 * @type {Readonly<Record<string, DecreeProseBlock>>}
 */
export const DECREE_PROSE_BLOCKS = Object.freeze({
  'DEC-EVENT': DECREE_EVENT_POOLS,
  'DEC-FOLLOWS': Object.freeze({ '*': DECREE_FOLLOWS_FROM_POOL }),
  'DEC-FORM': DECREE_FORM_POOLS,
  'DEC-HAND': DECREE_HAND_POOLS,
  'DEC-OVERRIDE': DECREE_OVERRIDE_POOLS,
  'DEC-PARTY': DECREE_PARTY_DEED_POOLS,
  'DEC-STANDING': DECREE_STANDING_POOLS,
});
