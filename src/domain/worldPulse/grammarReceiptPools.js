/**
 * domain/worldPulse/grammarReceiptPools.js — THE FP-GRAMMAR RECEIPT PROSE (GR-0's slice).
 *
 * A PURE DATA LEAF of the event-prose family (ruling R-BLD-4: the single-writer law reads
 * ONE WRITER FAMILY, never one file), sibling to sovereigntyReceiptPools.js. It holds ONLY
 * the authored corpora the pact-grammar pickers draw from; `grammarNews.js` owns the
 * registry rows, the eligibility declarations and the picker, and
 * `treatyLifecycleVoice.js` owns the engine-facing reads and the beats.
 *
 * WHY A SEPARATE FILE FROM warReceiptPools.js / sovereigntyReceiptPools.js. The same
 * measured reason WW-C recorded: a wave-scoped corpus gets a wave-scoped file, so a later
 * content batch never lands its neighbours in a decomposition they did not cause. This one
 * carries the twelve governed pools wired through GR-4b-ii-W2.
 *
 * ANNEX-VERBATIM. Every line below is byte-identical to its authored variant in the
 * governed GR-0 and GR-4 blocks of docs/content/RECEIPT_POOLS_GRAMMAR.md, with only the
 * `{slot}` tokens turned into interpolations and editorial `[exemplar, …]` tags stripped.
 * The pools were EXTRACTED from the annex mechanically rather than transcribed, and
 * tests/lint/grammarLifecycleKindPools.walker.test.js re-derives them from the document on
 * every run, so a hand edit here reds rather than silently forking the corpus.
 *
 * TWO GR-0 POOLS ARE DELIBERATELY ABSENT, AND THE ABSENCE IS THE POINT (the no-orphan-
 * vocabulary law, V-4's idiom):
 *   • `hollowed_quiet` — the DM-only ending. GR-0 produces the ENDING TOKEN (it is a
 *     PACT_ENDINGS member and `pactEndingOf().trueEnding` returns it), but the public feed
 *     may never speak it: Law One says an unbelieved default is not yet a story, and a news
 *     entry has no per-key ground-truth projection to strip it behind. The PROSE lands with
 *     its ground-truth surface, which is GR-7's endings-mix instrument. Deferred BY NAME.
 *   • `treaty_priced_on_a_lie` — GR-0 × FP-INFORMATION. GR-0 lands the READ
 *     (`treatiesPricedDuring`); FP-INFORMATION's exposure path wires the consumer and mints
 *     the kind (§6 seam 5). A pool with no producer here would be vocabulary nobody drafts.
 * Both absences are PINNED, not remembered.
 *
 * PURE DATA: literals and interpolation lambdas only — no Date, no Math.random, no store,
 * no I/O, no imports at all. The pool ARRAYS are deliberately not individually frozen, for
 * a measured reason rather than an oversight: wrapping each in `Object.freeze` severs the
 * contextual typing that gives every `(x) => …` its `ProseVariant` parameter, and the
 * domain strict ratchet then counts thirty-six implicit-any errors on a file whose only
 * content is sentences. `sovereigntyReceiptPools.js` is shaped the same way for the same
 * reason; the outer freeze is what the registry actually reads through.
 *
 * @enforced-by tests/lint/grammarLifecycleKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/** @type {Readonly<Record<string, readonly ProseVariant[]>>} */
export const GRAMMAR_RECEIPTS = Object.freeze({
  treaty_lapsed: [
    (x) => `The peace of ${x.settlement} and ${x.counterpart} has run its course — ${x.band} years, and no hand that signed it still holds a seat.`,
    (x) => `The ${x.term} ${x.settlement} and ${x.counterpart} kept between them came to its last day and was filed as closed; neither court sent word, and the clerks who closed it were the only ones who marked it.`,
    (x) => `In ${x.settlement} the market kept its hours as always; the pact with ${x.counterpart} ended that week, and the carters heard of it after the clerks.`,
    (x) => `${x.settlement} and ${x.counterpart} are bound by nothing now — the ${x.term} ran out, and neither court asked for another.`,
    (x) => `It was written for ${x.band} years and it kept every one of them; both courts let it go without a word.`,
    (x) => `A carter out of ${x.counterpart} asked the gate clerks for the ${x.term} and learned there was nothing left to ask for.`,
    'It ended at the turn of the year, in a season when neither court had anyone watching the parchment.',
  ],
  'treaty_lapsed.road_open': [
    (x) => `The ${x.route} between ${x.settlement} and ${x.counterpart} is open again, to anything.`,
    "Nothing written stands between the two courts now; what comes next is nobody's to forbid.",
    (x) => `The captains in ${x.settlement} marked the week the pact lapsed and said nothing further.`,
    (x) => `No oath forbids a march between ${x.settlement} and ${x.counterpart} — not since the spring.`,
    'Where a treaty stood there is now distance and habit.',
    (x) => `The first caravan down the ${x.route} this spring travelled without a writ, and nobody at either gate asked for one.`,
    (x) => `Merchants in ${x.settlement} have begun hiring their own guards for the ${x.counterpart} road.`,
  ],
  treaty_default_detected: [
    'The tribute came light, and this time the court noticed.',
    (x) => `${x.settlement}'s clerks weighed what arrived from ${x.counterpart} against what was promised, and the ledger would not close.`,
    (x) => `The wagons from ${x.counterpart} have been coming short; the carters on the quays were saying so before the court would.`,
    (x) => `What ${x.counterpart} owes under the ${x.term} has run thin for ${x.band} seasons, and ${x.settlement} has begun to keep the count.`,
    (x) => `Nothing was refused and nothing was delivered; the court of ${x.settlement} has entered it as default.`,
    (x) => `A factor down from ${x.counterpart} was asked at the ${x.settlement} table why the wagons ran light, and had no answer ready.`,
    (x) => `Each season the shortfall was small enough to overlook; taken together, ${x.band} of them would not be.`,
  ],
  treaty_disclosure_opened: [
    (x) => `The article is plain: what ${x.counterpart} learns, ${x.settlement} is told, for as long as the ${x.term} stands.`,
    (x) => `${x.settlement}'s clerks sit in ${x.counterpart}'s muster hall by treaty right, and the doors were not ${x.counterpart}'s to shut.`,
    'They signed away the closed door along with the border, and the second cost more.',
    (x) => `At ${x.counterpart} they call it the open article, and they do not say it kindly.`,
    (x) => `For ${x.band} years nothing ${x.counterpart} learns will be its own for long.`,
    (x) => `Down the ${x.route} the sealed copies travel to ${x.settlement}, and ${x.counterpart}'s clerks make no error the article can catch.`,
    'The gate keeps its hours; what passes through it in writing is no longer anyone\'s secret.',
  ],
  treaty_age_line: [
    (x) => `${x.band} years this peace has held.`,
    'Signed before most of the traders in the market were born, and still in force.',
    (x) => `It has outlasted many a lean harvest in ${x.settlement} and in ${x.counterpart}, and not a word of it has changed.`,
    'The parchment is soft at the folds; the terms are kept.',
    'Young yet, as treaties go — the ink is barely set, and neither court has been tested.',
    'The clerks recopy it when the ink fades, and nothing in the wording has ever changed in the recopying.',
    'Old enough that the roads it opened are simply the roads now.',
    (x) => `Sworn in a year the elders in ${x.counterpart} still name for its winter, and kept every year since.`,
  ],
  treaty_true_state_chip: [
    (x) => `On parchment the ${x.term} is honored; in fact ${x.settlement} has sent less than it swore for ${x.band} seasons, and nobody across the border has weighed it.`,
    (x) => `Kept in name. ${x.settlement} throttles it quietly, and ${x.counterpart}'s watchers sit too far off to tell.`,
    (x) => `The court of ${x.counterpart} holds this term sound. It is not.`,
    'The shortfall is real and unseen — a quiet default, running since the turn of the year.',
    'Honored on every surface a free eye can reach. The truth of it is short wagons.',
    (x) => `The breach began small and has widened every season; nothing in ${x.counterpart}'s reach can measure it.`,
    (x) => `${x.settlement} knows exactly what it is withholding. The figure is kept by one clerk and shown to nobody.`,
    (x) => `If ${x.counterpart} ever sends a weigher to the border, the ${x.term} fails that week.`,
  ],
  ran_its_term: [
    'It ran its term and ended on the day it said it would.',
    (x) => `The ${x.term} expired at its own date; nothing was broken to end it.`,
    (x) => `In ${x.settlement} the pact's last season passed without remark, and then the term was simply over.`,
    (x) => `Ended by the calendar and not by anger; ${x.settlement} and ${x.counterpart} are quit of it, and of each other's ledgers.`,
    'It kept its word to the last week and then stopped being law.',
    (x) => `The clerks in ${x.settlement} closed the entry, dated it, and shelved the parchment with the others that ran out.`,
    (x) => `The last delivery under the ${x.term} went out in autumn, and after that there was simply nothing owed.`,
    (x) => `Neither court marked the day; in ${x.counterpart} the season's work went on exactly as before.`,
  ],
  // GR-4b-α — THE SUCCESSION DISAVOWAL, the one `# GR-4` ending whose producer is landed,
  // persisted AND reachable from a mount this wave owns. GR-4b-iii-a now wires the one honest
  // question-opening pool immediately below; GR-4b-ii-W2 wires `reaffirmed`, the HONOR terminal
  // reached by an ANSWER, at the foot of this object, while `honored_by_silence` (the terminal
  // reached by SILENCE, whose expiry road has no transition site to mount on) and
  // `credibility_charge` remain deferred. ⛔ `repudiated` is authored here too and deliberately
  // NOT wired — CR-GR4B-8: the open road already speaks
  // a fully-addressed `treaty_breached` beat, so a second desk kind would double-voice it.
  //
  // ⭐ `{npc}` BINDS TO THE FALLEN HOLDER — the hand that swore, named on the parchment's own
  // oath stamp. The heir's name is on no surface this stage can read, which is why the ANNEX
  // was corrected rather than the slot filled (CR-GR4B-3).
  disavowed_by_succession: [
    (x) => `The oath ${x.npc} swore has been torn up by the seat that followed him, and the world understands — and does not forgive.`,
    (x) => `${x.settlement}'s new seat has cast off the oath; every term under it is broken from this week, and the parchment is kept only as evidence.`,
    (x) => `In ${x.counterpart} they had expected it, and it landed hard regardless.`,
    'The seat that swore is gone, and the word went out of the door with it.',
    'It was cheap to do, and it will be dear to have done.',
  ],
  // GR-4b-iii-a — THE QUESTION OPENS. `{npc}` is the FALLEN holder recorded on this
  // instrument, never the successor. Each family speaks one unanswered treaty only.
  succession_question_opened: [
    'The old seat swore it; the new seat must choose.',
    (x) => `${x.npc} left an oath standing at ${x.settlement}; the new seat has taken the chair while the parchment remains unanswered.`,
    (x) => `The court of ${x.counterpart} is waiting on one word from ${x.settlement}, and the market is trading on which word it will be.`,
    (x) => `The oath ${x.npc} swore is a question this week, and the clerks have set its parchment before the new seat.`,
    'Nothing has been broken. Nothing has been confirmed either.',
    (x) => `The clerks in ${x.settlement} have laid the unanswered oath on the council table, with room beneath it for one word.`,
    (x) => `Whatever the new seat decides, the oath ${x.npc} swore will be remembered longer than its terms.`,
  ],
  // GR-4b-iii-b — THE OPEN-QUESTION DOSSIER LINE. The same instrument the beat above
  // announces, read later on the parchment itself: one line per validated pending question
  // standing against one treaty. It claims no answer, no successor name, no breach and no
  // per-treaty uniqueness — two questions may lawfully point at one treaty, and each renders
  // its own line. ⭐ `{npc}` is the FALLEN holder on the ACTING court's oath stamp, and
  // `{settlement}` is the acting court for EVERY viewer (CR-GR4B-15): variant 3 is authored
  // from the counterpart's vantage in its own words, so re-binding per viewer would invert
  // that family's meaning. Corrected wholesale at A-22 / CR-GR4B-12.
  succession_question_open: [
    'The new seat has not yet said whether the old oath holds.',
    (x) => `The oath ${x.npc} swore for ${x.settlement} remains before the new seat, with no answer entered.`,
    (x) => `From ${x.counterpart}, the treaty still reads as standing while ${x.settlement}'s answer remains pending.`,
    (x) => `The parchment still joins ${x.settlement} to ${x.counterpart}; the pending question has not broken it.`,
    'One docket entry holds the whole choice: honor the old oath or disavow it.',
    (x) => `Until ${x.settlement} answers, the treaty with ${x.counterpart} remains live under the terms already written.`,
    (x) => `Since ${x.npc} left the seat, ${x.settlement}'s treaty question has remained open and the treaty itself in force.`,
    'If the seat gives no answer, the oath stands.',
  ],
  // GR-4b-ii-W2 — THE HONOR TERMINAL, ANSWERED ALOUD. The same instrument the two pools
  // above open and refuse, reaching the terminal a DM's dismissal types as HONOR. ⭐ `{npc}`
  // is the FALLEN holder on the acting court's oath stamp; the seat that ANSWERS is never
  // named, because no honor terminal records who spoke. Corrected wholesale at A-23 /
  // CR-GR4B-16: no line names a duration, a season, a due date or a wait, because no honor
  // terminal stamps a world tick, and none claims a successor, a muster, a market or the
  // words used. What separates it from `honored_by_silence` is the one distinction the
  // record does carry — an answer entered, rather than a lapse.
  reaffirmed: [
    (x) => `The new seat will keep the word ${x.npc} gave.`,
    (x) => `The new court of ${x.settlement} has said aloud what it might have left unsaid: the oath stands.`,
    (x) => `Between ${x.settlement} and ${x.counterpart} nothing on the parchment moved; the movement was in the answering.`,
    'Silence would have kept the oath just as well; the seat answered anyway.',
    'The oath changed hands and did not change.',
    'The question is closed by an answer and not by a lapse, and the record keeps the difference.',
    (x) => `The oath is still ${x.npc}'s, and the chair that owns it now never swore it.`,
  ],
  hollowed_detected: [
    (x) => `Hollowed and found out: the ${x.term} was kept on parchment and nowhere else.`,
    (x) => `${x.counterpart} let it fail by inches until ${x.settlement} weighed the difference and named it default.`,
    'The court called it default; the carters had been calling it that a season earlier.',
    'Nothing was repudiated. It was simply not done, and then it was seen.',
    'It died of short wagons, and the ledger says so.',
    (x) => `What arrived under the ${x.term} had been shrinking for seasons, and ${x.settlement} has finally weighed a year against a year.`,
    (x) => `No herald in ${x.counterpart} announced a breach; the granaries in ${x.settlement} announced it.`,
  ],
});
