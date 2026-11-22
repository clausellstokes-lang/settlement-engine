/**
 * domain/worldPulse/marketReceiptPools.js — THE FP-TRADE TR-3 RECEIPT PROSE (believed markets).
 *
 * A PURE DATA LEAF of the event-prose family, sibling to commercialReceiptPools.js (TR-1) and
 * faithReceiptPools.js. It holds ONLY the authored corpus the TR-3 picker draws from;
 * `marketNews.js` owns the registry row, the eligibility declaration and the picker, and the
 * dispatch composer (spatial/dispatchDestination.js) owns the evidence the beat voices.
 *
 * ⛔⛔ ANNEX-VERBATIM. Every line below is byte-identical to its authored variant under
 * `### market.wrong_market_arrival` in the `# TR-3` block of docs/content/RECEIPT_POOLS_TRADE.md,
 * with only the `{slot}` tokens turned into interpolations and the annex's editorial exemplar
 * marker left out, exactly as the TR-1 extraction left it out.
 * tests/lint/marketKindPools.walker.test.js re-derives the whole pool from the document on every
 * run through the shared fail-closed reader, so a hand edit here reds rather than silently
 * forking the corpus. A corpus defect is an annex act, never an edit to this file.
 *
 * ⭐ THE KIND ID IS THIS WAVE'S, THE SENTENCES ARE THE ANNEX'S. The annex heads the pool
 * `market.wrong_market_arrival`; the engine spells it `market_wrong_market_arrival`, and the
 * walker carries the join between the two so neither side can drift alone.
 *
 * ⚠ THREE VARIANTS NAME A `{house}`, AND THEY STAY IN THE POOL. A caravan carries no house on
 * its record at this wave (TR-2's houses have no mount and sponsor nothing yet), so the picker
 * cannot reach variants three, four and seven. The pool is NOT trimmed to what is reachable
 * today, on the CR-IN1C-2 precedent faithReceiptPools.js adopted: trimming a governed corpus to
 * fit today's wiring is how a corpus stops being the authority. The floor is a property of the
 * authored depth (seven against the notable floor of six), and the four variants the picker can
 * reach today are pinned by the walker in both directions.
 *
 * PURE DATA: literals and interpolation lambdas only, no imports at all. The pool ARRAY is not
 * individually frozen, for the measured reason its siblings record: wrapping it severs the
 * contextual typing that gives every `(x) => …` its ProseVariant parameter.
 *
 * @enforced-by tests/lint/marketKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/** @type {Readonly<Record<string, ProseVariant[]>>} */
export const MARKET_RECEIPTS = Object.freeze({
  market_wrong_market_arrival: [
    'The caravans came for the famine and found the harvest.',
    'They unloaded into a market that had no need of them, and the stalls hardly looked up.',
    (x) => `The ${x.good} is entered at ${x.counterpart} against a band it no longer commands, and the loss is ${x.house}'s.`,
    (x) => `${x.house} will sell at ${x.band} or carry it home, and either way the season is spent.`,
    (x) => `The word was true when they left ${x.settlement}, and that is the whole of the tragedy.`,
    (x) => `The lead carter asked twice at the ${x.counterpart} gate whether they had come to the right town.`,
    (x) => `The stake was reckoned against a band that had already gone, and the reckoning is what ${x.house} will be judged on.`,
  ],
});

/**
 * Each variant's slot set, parallel to the pool and in the annex's order — the eligibility
 * declaration the picker filters on. Derived from the annex by the walker, never trusted.
 * @type {Readonly<Record<string, ReadonlyArray<readonly string[]>>>}
 */
export const MARKET_RECEIPT_SLOTS = Object.freeze({
  market_wrong_market_arrival: Object.freeze([
    Object.freeze([]),
    Object.freeze([]),
    Object.freeze(['counterpart', 'good', 'house']),
    Object.freeze(['band', 'house']),
    Object.freeze(['settlement']),
    Object.freeze(['counterpart']),
    Object.freeze(['house']),
  ]),
});
