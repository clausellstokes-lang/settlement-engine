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
});
