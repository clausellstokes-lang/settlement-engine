/**
 * domain/worldPulse/faithReceiptPools.js — THE FP-FAITH RECEIPT PROSE (WF-8a's slice).
 *
 * A PURE DATA LEAF of the event-prose family, sibling to informationReceiptPools.js and
 * grammarReceiptPools.js. It holds ONLY the authored corpus the FAITH picker draws from;
 * `faithNews.js` owns the registry row, the eligibility declaration and the picker, and the
 * settlement fold in `religiousContest.js` owns the one production mint.
 *
 * WHY A SEPARATE FILE FROM ITS SIBLINGS. The measured reason WW-C recorded and GR-0 and
 * IN-1c-a both copied: a wave-scoped corpus gets a wave-scoped file, so a later content batch
 * never lands its neighbours in a decomposition they did not cause.
 *
 * ⛔⛔ ANNEX-VERBATIM, AND THE ANNEX PREDATES THIS WAVE BY THREE WEEKS. Every line below is
 * byte-identical to its authored variant in the governed `## §D WF-1` block of
 * docs/content/RECEIPT_POOLS_FAITH.md (authored 2026-08-02 under SP-6, verifier-passed
 * 2026-08-03), with only the `{slot}` tokens turned into interpolations.
 * tests/lint/faithKindPools.walker.test.js re-derives the whole pool from the document on
 * every run through the shared fail-closed reader, so a hand edit here reds rather than
 * silently forking the corpus. ⛔ A corpus defect is a chair annex act, never an edit to this
 * file.
 *
 * ── ⭐ THE KIND ID IS THIS WAVE'S, THE SENTENCES ARE THE ANNEX'S ───────────────────
 *
 * The annex heads this pool `faith.extinction.last_altar` and says in its own preface that
 * "kind ids below are DESCRIPTIVE placeholders for the census — the canonical spelling of
 * every id is minted by the wave that mints the kind, and registered in WHAT_PHRASES +
 * heraldRouting there". `faith_last_altar_dark` is that canonical spelling, and the walker
 * carries the join between the two so neither side can drift alone.
 *
 * ── ⚠ ONE VARIANT IS UNREACHABLE AT THIS BASE, AND IT STAYS IN THE POOL ────────────
 *
 * Variant two names a `{temple}`, and the deletion seam carries no temple: the fold reads the
 * creed name and the settlement name off state that is about to be deleted, and nothing in
 * that scope knows which house held the rite. ⛔ The pool is NOT trimmed to match what is
 * reachable — trimming a governed corpus to fit today's wiring is how a corpus stops being the
 * authority (the CR-IN1C-2 precedent, adopted verbatim) — and the walker pins the eligible set
 * in BOTH directions so a filter that had stopped filtering cannot pass as a filter that is
 * working. The remaining FOUR are exactly the derived `major` floor, so the obituary is a full
 * authored pool rather than a reachable remainder.
 *
 * ⭐ THE DEITY DOCTRINE IS AUDIBLE IN EVERY LINE, AND THAT IS THE ANNEX'S DOING. The subject
 * is always the altar, the roster, the parish, the undercroft — what the PEOPLE stopped
 * keeping. No line says a god died, departed, abandoned or failed.
 *
 * PURE DATA: literals and interpolation lambdas only — no Date, no Math.random, no store, no
 * I/O, no imports at all. The pool ARRAY is deliberately not individually frozen, for the
 * measured reason its siblings record rather than an oversight: wrapping it in `Object.freeze`
 * severs the contextual typing that gives every `(x) => …` its `ProseVariant` parameter, and
 * the domain strict ratchet then counts one implicit-any error per lambda on a file whose only
 * content is sentences. The outer freeze is what the registry actually reads through.
 *
 * @enforced-by tests/lint/faithKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/** @type {Readonly<Record<string, readonly ProseVariant[]>>} */
export const FAITH_RECEIPTS = Object.freeze({
  faith_last_altar_dark: [
    (x) => `The last altar of ${x.creed} in ${x.settlement} went dark; none there now keep the rite.`,
    (x) => `The undercroft at ${x.temple} was cleared for grain, and the word is that nobody objected.`,
    (x) => `${x.settlement}'s roster carries ${x.creed} no longer — not suppressed, not sleeping; gone from the parish entirely.`,
    (x) => `Whatever ${x.creed} was owed in ${x.settlement}, it is owed by nobody now.`,
    (x) => `${x.creed} kept ${x.settlement} for generations and lost it in a season nobody thought to write down.`,
  ],
});
