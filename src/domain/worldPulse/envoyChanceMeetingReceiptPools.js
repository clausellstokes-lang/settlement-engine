/**
 * domain/worldPulse/envoyChanceMeetingReceiptPools.js — THE ENCOUNTERS RECEIPT PROSE (ENC-4's slice).
 *
 * A PURE DATA LEAF of the event-prose family, sibling to faithReceiptPools.js and
 * informationReceiptPools.js. It holds ONLY the authored corpus the CHANCE_MEETING picker
 * draws from; `envoyChanceMeetingNews.js` owns the registry row, the eligibility declaration, the
 * seeded picker and the Herald entry builder, and `envoyPulse.js` owns the one production
 * mint. Nothing here decides that two people met; it only voices a receipt ENC-1 already
 * resolved and ENC-3 already staged.
 *
 * WHY A SEPARATE FILE FROM ITS SIBLINGS. The measured reason WW-C recorded and GR-0, IN-1c-a
 * and WF-8a each copied in turn: a wave-scoped corpus gets a wave-scoped file, so a later
 * content batch never lands its neighbours in a decomposition they did not cause.
 *
 * ⛔⛔ ANNEX-VERBATIM, AND THE WORDS ARE THE CHAIR'S. Every line below is byte-identical to its
 * authored variant in the governed `## §A ENC-4` and `## §B ENC-4` blocks of
 * docs/content/RECEIPT_POOLS_CHANCE_MEETING.md, with only the `{slot}` tokens turned into
 * interpolations. tests/lint/chanceMeetingKindPools.walker.test.js re-derives the whole pool
 * AND the band table from the document on every run, so a hand edit here reds rather than
 * silently forking the corpus. ⛔ A corpus defect is a chair annex act, never an edit to this
 * file: the owner handed the words to the chair in so many words, and a word that cannot be
 * wired is a finding back with the slot that breaks.
 *
 * ── ⭐ THE VOICE FENCES ARE PROPERTIES OF THE SENTENCES, AND THE WALKER SCANS THEM ──
 *
 * The annex's own §A preface declares three, and this volume's register is `RECEIPT_POOLS_FAITH.md`
 * §D — plain, concrete, understated, REPORTING rather than judging:
 *
 *   1. ZERO em dashes. ⛔ This volume DIVERGES from the FAITH walker here, and the divergence is
 *      the annex's own: the FAITH volume's §B declares the em-dash in terms ("semicolons and
 *      em-dashes") and its walker therefore does NOT scan for one. This annex forbids it, so the
 *      scan is added rather than inherited.
 *   2. ZERO exclamation marks.
 *   3. The words "chance" and "meeting" NEVER ADJACENT in any order (§886), so no raw engine
 *      identifier can reach a townsperson's mouth. `chance_meeting` is already a live constant
 *      in this tree (`corruptionLeash.WILLED_MEETING_CONSPIRACY`, and the receipt id prefix), and
 *      a third meaning for it in READER PROSE is exactly the conviction ENC-3 refused to risk.
 *
 * ── ⚠ NO VARIANT IS UNREACHABLE AT THIS BASE, AND THAT IS A MEASUREMENT ────────────
 *
 * Unlike its two nearest siblings this corpus has NO slot without a supplier: the writer resolves
 * all five from the stage's own typed seed and the meeting receipt, so the eligible set is the
 * whole authored six under the production interpolation. The walker pins BOTH directions anyway —
 * six reachable with every slot supplied, and a named shortfall when one is withheld — so a filter
 * that had stopped filtering cannot pass as a filter that is working. §B's four slots are likewise
 * all supplied at its base, and its eligible set is the whole authored FIVE. §B2 declares the same
 * four and is likewise whole at five.
 *
 * ── ⭐ THREE POOLS, TWO KINDS: A POOL KEY IS NOT A KIND ────────────────────────────
 *
 * ENC-4c authors a SECOND corpus for the kind `chance_meeting_exposed` rather than a second kind,
 * because the split it carries is a fact the seed already holds — which court the approacher
 * belongs to — and the two corpora make OPPOSITE assertions about where each party is from. The
 * keys below are therefore POOL IDS: two of them happen to equal a registered kind and the third
 * deliberately does not. ⛔ The estate's nearest shape is GR-0's `contexts` axis, which filters
 * variants WITHIN one pool; it is not taken here, and the reason is measured rather than stylistic
 * — merging the ten sentences into one pool would fork the sealed §B block's own five-and-five
 * split, which is the proof that the seal's sentences are untouched.
 *
 * ⚠ AND THE ANNEX GREW A THIRD GOVERNED BLOCK, `## §B2 ENC-4c`, so the document is no longer two
 * blocks. The walker reads each block through its OWN anchors, including its own heading and its
 * own slot marker, and §B's terminator is now §B2's heading rather than §C's.
 *
 * ── THE BAND TABLE IS CORPUS, NOT TUNING ──────────────────────────────────────────
 *
 * `{outcome_phrase}` is a CLOSED MAP of three authored fills, one per visible mark band. It is
 * AUTHORED WORDS keyed by a typed outcome the leaf already returns — the finite-semantics law's
 * own shape — and not a dial: nothing here scales, compares or thresholds. It lives beside the
 * pool because the annex authors it beside the pool, and the walker joins both to the document.
 *
 * PURE DATA: literals and interpolation lambdas only — no Date, no Math.random, no store, no
 * I/O, no imports at all. The pool ARRAY is deliberately not individually frozen, for the
 * measured reason its siblings record rather than an oversight: wrapping it in `Object.freeze`
 * severs the contextual typing that gives every `(x) => …` its `ProseVariant` parameter, and the
 * domain strict ratchet then counts one implicit-any error per lambda on a file whose only
 * content is sentences. The outer freeze is what the registry actually reads through.
 *
 * @enforced-by tests/lint/chanceMeetingKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/** @type {Readonly<Record<string, readonly ProseVariant[]>>} */
export const CHANCE_MEETING_RECEIPTS = Object.freeze({
  chance_meeting_recorded: [
    (x) => `${x.npc} of ${x.home}, passing through ${x.settlement}, ${x.outcome_phrase} in ${x.counterpart}.`,
    (x) => `Word from ${x.settlement}: ${x.npc} and ${x.counterpart} ${x.outcome_phrase}, and neither court sent them to.`,
    (x) => `On the road to ${x.settlement}, ${x.npc} of ${x.home} fell in with ${x.counterpart} and ${x.outcome_phrase} before either reached the gate.`,
    (x) => `${x.counterpart} spent a market day in ${x.settlement} with ${x.npc} of ${x.home} and ${x.outcome_phrase}; the two courts have a thread between them now that neither one spun.`,
    (x) => `Neither ${x.home} nor ${x.settlement} arranged it. ${x.npc} and ${x.counterpart} met, ${x.outcome_phrase}, and the tie will keep as long as ties keep.`,
    (x) => `The register at ${x.settlement} lists ${x.npc} of ${x.home} among the season's guests; what it does not list is that ${x.counterpart} ${x.outcome_phrase} that week.`,
  ],
  // ── §B — THE REFUSAL THAT TRAVELLED ────────────────────────────────────────────
  // ⛔⛔ `{npc}` IS THE APPROACHER AND `{counterpart}` IS THE ONE WHO REFUSED, in every one of
  // the five. That is the ROLE the words assign, and ENC-4 reported the kind unwireable because
  // the stage's seed carried no direction to assign it from. ENC-4b's car 1 put the direction on
  // the seed — DERIVED FROM THE RECEIPT'S OWN EXPOSURE GRIEVANCE, never from party order — so
  // the roles are now read rather than guessed.
  //
  // ⚠ VARIANT 1 SAYS `{counterpart} of {settlement}`, AND THAT CLAUSE IS THE WRITER'S GATE.
  // It asserts the refuser is OF THE HOST TOWN, which is true only when the approacher is the
  // one passing through. The engine lets either party lead (measured), so the writer withholds
  // the whole line when the host's own notable made the offer, rather than shipping a sentence
  // that is fluent and false about where a man is from. Silence, never a hole: the estate's
  // posture, and the reason no word here needed changing.
  chance_meeting_exposed: [
    (x) => `${x.counterpart} of ${x.settlement} refused what ${x.npc} of ${x.home} offered, and the refusal was spoken of.`,
    (x) => `In ${x.settlement}, ${x.counterpart} said no to ${x.npc} of ${x.home}, and said it where it could be heard.`,
    (x) => `${x.npc} of ${x.home} made an approach at ${x.settlement}; ${x.counterpart} declined it, and the declining did not stay between the two of them.`,
    (x) => `${x.settlement} knows that ${x.counterpart} turned ${x.npc} of ${x.home} away. It does not know what was offered, and it has not stopped guessing.`,
    (x) => `Neither court announced it, and ${x.settlement} has it anyway: ${x.counterpart} refused ${x.npc} of ${x.home}.`,
  ],
  // ── §B2 — THE OTHER HALF OF §B: THE HOST COURT'S OWN NOTABLE OFFERED ───────────
  // ⛔⛔ THIS KEY IS A POOL ID, NOT A KIND, AND NOTHING REGISTERS IT AS ONE. It is a SECOND
  // authored corpus of the SAME registered kind `chance_meeting_exposed`, chosen by which court
  // the approacher belongs to. `envoyChanceMeetingNews.js` hangs it off that ONE registry row's
  // `cases` axis, so no row, no routed token, no desk and no reader phrase is minted for it —
  // measured, and the six pantheon A5 freezes are asserted unmoved in the same landing.
  //
  // THE ROLES ARE §B's, UNCHANGED: `{npc}` is the APPROACHER and `{counterpart}` refused. What
  // differs is where each is from. Here `{npc}` is of `{settlement}` (the host town) and
  // `{counterpart}` is of `{home}` (the guest's own court), which is the exact assertion §B's
  // variant 1 makes the other way round and the reason the writer used to withhold this half.
  //
  // ⚠ SO `{home}` MEANS THE SAME THING IN BOTH POOLS AND IS NOT THE APPROACHER'S COURT. In both
  // cases it is the court of the party who is NOT of the host town. The writer derives it that
  // way rather than from the approach direction; deriving it from the approacher would have made
  // this pool call the guest a man of the host town, fluently and falsely.
  chance_meeting_exposed_host_offered: [
    (x) => `${x.npc} of ${x.settlement} made an offer to ${x.counterpart} of ${x.home}, a guest that season, and the guest's refusal was spoken of.`,
    (x) => `In ${x.settlement}, ${x.counterpart} of ${x.home} said no to ${x.npc}, one of the town's own, and said it where it could be heard.`,
    (x) => `${x.npc} of ${x.settlement} made an approach while ${x.counterpart} of ${x.home} was within the walls; ${x.counterpart} declined it, and the declining did not stay between the two of them.`,
    (x) => `${x.settlement} knows that ${x.counterpart} of ${x.home}, passing through, turned ${x.npc} away. It does not know what was offered, and it has not stopped guessing.`,
    (x) => `Neither court announced it, and ${x.settlement} has it anyway: ${x.counterpart} of ${x.home} refused ${x.npc}, the town's own.`,
  ],
});

/**
 * THE `{outcome_phrase}` BAND FILLS, annex-verbatim and CLOSED at three.
 *
 * Keyed by the visible mark bands `envoyChanceMeeting.js` already returns as its typed outcome.
 * ⛔ The three OTHER outcomes the leaf can name — `nothing`, `compromised` and `rejected` — are
 * absent by construction and not by omission: ENC-3's seam mints no seed for them at all ("a
 * compromise is a secret, a refusal nobody spoke of is not news, and the equilibrium band is not
 * an event"), so a fill for any of them would be a word no producer could reach.
 *
 * `exposed` is likewise absent HERE: it is the annex's §B kind, wired by ENC-4b with its own pool
 * and its own significance above, and it does not take this pool's `{outcome_phrase}` slot at all.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const CHANCE_MEETING_OUTCOME_PHRASES = Object.freeze({
  bond: 'found a friend',
  respect: 'found a worthy stranger',
  rivalry: 'found a rival',
});
