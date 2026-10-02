/**
 * domain/worldPulse/informationReceiptPools.js — THE FP-INFORMATION RECEIPT PROSE (IN-1c-a).
 *
 * A PURE DATA LEAF of the event-prose family, sibling to grammarReceiptPools.js and
 * sovereigntyReceiptPools.js. It holds ONLY the authored corpus the INFORMATION picker draws
 * from; `informationNews.js` owns the registry row, the eligibility declaration and the
 * picker, and `src/domain/display/neighbourMirror.js` owns the read-model that renders it.
 *
 * WHY A SEPARATE FILE FROM ITS SIBLINGS. The measured reason WW-C recorded and GR-0 copied: a
 * wave-scoped corpus gets a wave-scoped file, so a later content batch never lands its
 * neighbours in a decomposition they did not cause.
 *
 * ANNEX-VERBATIM. Every line below is byte-identical to its authored variant in the governed
 * IN-1 block of docs/content/RECEIPT_POOLS_INFORMATION.md, with only the `{slot}` tokens
 * turned into interpolations. tests/lint/informationKindPools.walker.test.js re-derives the
 * whole pool from the document on every run, so a hand edit here reds rather than silently
 * forking the corpus. ⛔ A corpus defect is a chair annex act, never an edit to this file.
 *
 * ── THE RECORD VOICE IS LAW HERE, AND IT IS A PROPERTY OF THE SENTENCES ────────────
 *
 * The annex's own IN-1 preface states it: no variant carries a perception verb. Every line
 * speaks what the RECORD shows was shown — "has been shown", "works from what we handed
 * over", "old paper" — and never what any court holds in mind. The pin that enforces it does
 * not read this file: it scans REAL RENDERED OUTPUT in tests/ui/neighbourMirrorLine.test.js,
 * because a vocabulary can only prove what it already contains.
 *
 * ⚠ TWO VARIANTS ARE UNREACHABLE AT THIS BASE, AND THEY STAY IN THE POOL. Variants 2 and 7
 * name a season; the read-model holds a tick and no calendar, and both roads to supplying one
 * cost more than this wave (a new display-to-engine edge with its own boot smoke, or a fifth
 * local copy of a derivation the estate deliberately keeps four pinned copies of). CR-IN1C-2
 * rules neither here. ⛔ The pool is NOT trimmed to match what is reachable — trimming a
 * governed corpus to fit today's wiring is how a corpus stops being the authority — and the
 * walker pins the eligible set in BOTH directions so a filter that had stopped filtering
 * cannot pass as a filter that is working.
 *
 * PURE DATA: literals and interpolation lambdas only — no Date, no Math.random, no store, no
 * I/O, no imports at all. The pool ARRAY is deliberately not individually frozen, for the
 * measured reason its siblings record rather than an oversight: wrapping it in
 * `Object.freeze` severs the contextual typing that gives every `(x) => …` its
 * `ProseVariant` parameter, and the domain strict ratchet then counts one implicit-any error
 * per lambda on a file whose only content is sentences. The outer freeze is what the registry
 * actually reads through.
 *
 * @enforced-by tests/lint/informationKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/** @type {Readonly<Record<string, readonly ProseVariant[]>>} */
export const INFORMATION_RECEIPTS = Object.freeze({
  // IN-3 THE COUNTER-GAME — the annex's # IN-3 `sweep_witch_hunt` block, verbatim, registered as
  // `false_accusation` (the volume's kind; the annex heading names the ending that mints it).
  // REPUTATION only: the accused is named, never removed.
  false_accusation: [
    (x) => `They found no spy at ${x.settlement}, and named one anyway. The town remembers whose name it was.`,
    (x) => `The sweep turned up nothing; ${x.npc} was named on a season's association and nothing firmer.`,
    (x) => `The seat wanted an answer more than it wanted the truth, and ${x.npc}'s name was the nearest one to hand.`,
    (x) => `${x.npc}'s custom fell away within the week; the charge was never proved and never withdrawn.`,
    (x) => `The commons hold this against the seat at ${x.settlement}; it will be remembered longer than the sweep was.`,
    'No spy. One name. The town can count.',
  ],
  // IN-2 THE LURE — the WEAKNESS bait's block of the annex's # IN-2 (the one bait whose spring
  // is built), verbatim. Variants 2 and 6 name a {route} and a {season} no producer supplies at
  // this base, so they are declared unreachable and stay in the pool (the IN-1 rule above).
  // The annex's WEALTH and DEVOTION sub-pools join with their springs (IN-2b).
  lure_sprung: [
    'They marched on a weakness that was bought for them.',
    (x) => `${x.faction}'s column is on the ${x.route} road to ${x.counterpart}, moving on a muster count that ${x.house} sold them.`,
    (x) => `The commission at ${x.settlement} is discharged in full: the mark bought the story, then bought a war with it.`,
    (x) => `Nobody at ${x.counterpart} lied to ${x.faction}. Someone else did, a season earlier, for money.`,
    'The purchased word aged into common knowledge, and common knowledge put an army on the road.',
    (x) => `A story went out of ${x.settlement} in ${x.season}; the spears crossed the border before the year turned.`,
  ],
  mirror_standing_line: [
    'Less than we fear, and the reckoning is a season stale.',
    (x) => `${x.counterpart} has been shown ${x.band}; nothing since ${x.season}.`,
    (x) => `Given ${x.band} to see, and given it late.`,
    (x) => `${x.counterpart} works from what we handed over, and we handed it long since.`,
    (x) => `Shown ${x.band}, and shown it a season since.`,
    'What they hold of us is old paper.',
    (x) => `The last thing ${x.counterpart} was handed, it was handed in ${x.season}.`,
    'They work from an accounting, not from us.',
    'Thin, dated, and ours to have written.',
  ],
  // IN-4 THE ROAD: the race kinds of the annex's # IN-4 block, verbatim (the built
  // RACE_OUTCOMES tokens `person`, `story` and `together`; `neither` has no pool, by law, J-INF-5).
  // No producer supplies a bare route name, a season or a notoriety band at this base, so the
  // variants naming `{route}`, `{season}` or `{band}` are declared unreachable and STAY in the pool
  // (the IN-1 rule above).
  race_person: [
    'He reached the gate before his story did.',
    (x) => `${x.npc} came into ${x.settlement} ahead of any word out of ${x.counterpart}, and the council heard it from a mouth and not a market.`,
    (x) => `The gate opened on the man himself; whatever ${x.settlement} decides, it decides on his own account.`,
    'No rumour was waiting for him. He got to tell it his way, which is rarer than it sounds.',
    (x) => `The ${x.route} road was kind, and the winter was kinder to riders than to talk.`,
    (x) => `The market at ${x.settlement} heard it from a man standing in it, which is not how markets usually hear anything.`,
  ],
  race_story: [
    'The tale wore the road faster than the man; the gate was answered before he knocked.',
    (x) => `${x.settlement} had the story of ${x.counterpart} a season before ${x.npc} arrived to correct it, and the gate was already set against him.`,
    (x) => `What reached ${x.settlement} first came by many mouths and no name; what came second came by one man with everything to lose.`,
    'The council had decided before he was in sight, and his account is filed as a correction.',
    'Word travels light. Men travel with baggage.',
    (x) => `By ${x.season} the story stood at ${x.band} in every tavern at ${x.settlement}; the man himself is a late witness to it.`,
  ],
  race_together: [
    (x) => `${x.npc} and the word out of ${x.counterpart} came into ${x.settlement} the same week, and each proved the other.`,
    'The tale was at the gate and the man behind it; corroboration is cheap when it arrives on time.',
    (x) => `${x.settlement}'s clerks had two accounts of one thing and no reason to choose, so they kept both.`,
    'He told them what they had just heard, which is the best a man can do.',
    'The clerks enter both accounts on the same day and note that they agree, which is worth entering.',
    (x) => `The market at ${x.settlement} heard it twice in a morning and traded on it by noon.`,
    (x) => `${x.settlement} will decide quickly, and quickly is what corroboration buys.`,
    'He passed the carters carrying it on the last stretch of road and came in beside them.',
    'The word and the man agreed. It happens, and it is never remembered.',
  ],
  // IN-3 THE SWEEP HUM — the annex's # IN-3 `sweep_launched` block, verbatim. Variants 2 and 3
  // name a {faction} and a {reason} the producer does not supply at this base, so they are
  // declared unreachable and stay in the pool (the IN-1 rule above).
  sweep_launched: [
    (x) => `The gates grow teeth; every stranger at ${x.settlement} is twice questioned.`,
    (x) => `${x.faction}'s enforcer at ${x.settlement} has the gate rolls out; carters wait a day and answer for their loads.`,
    (x) => `The seat is paying men to ask questions, and the cost stands in the town's book under ${x.reason}.`,
    (x) => `Nobody at ${x.settlement} is accused. Everybody is asked.`,
    (x) => `The seat's book at ${x.settlement} opens a line for extra watchmen, lamp oil, and a clerk to keep the gate rolls.`,
    (x) => `The carters at ${x.settlement} have learned to bring their papers and their patience.`,
    (x) => `A stranger coming into ${x.settlement} this season answers at the gate, at the inn, and again in the morning.`,
    'Nothing has been found yet. The looking is already changing who comes.',
    'The questioning began at the turn of the season, and the season is being remembered by it.',
  ],
  // THE TRUTH THAT ARRIVED TOO LATE, the wave's jewel (the annex's POOL HANDLE, registered under
  // that name). No producer supplies a typed `{reason}` at this base: variant 4 is declared
  // unreachable and stays.
  word_came_too_late: [
    (x) => `The word clearing ${x.npc} reached ${x.settlement} after the seat had already ruled on the story, and the hours between are in the record.`,
    (x) => `${x.counterpart}'s letter came in on the evening tide; the gate had been answered at noon.`,
    (x) => `Both tellings are filed together at ${x.settlement}: the false one first, and the true one under it.`,
    (x) => `The seat acted on ${x.reason} and learned better in a fortnight; the acting cannot be taken back.`,
    'Nobody lied. The road did the rest.',
    'The clearing letter is entered with its hour, and the hour is after the ruling\'s. The clerks were careful to write both.',
  ],
});
