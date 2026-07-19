/**
 * traditionProse.js — THE TRADITIONS wave (Engine Lift #4, slice T-5): the NEWS +
 * PLOT-HOOK prose variant pools. A PURE DATA leaf (src/data): frozen vocabulary
 * tables only, ZERO behaviour — the seeded selection lives one layer up in
 * domain/traditions/prose.js (the data-schema purity discipline: data holds fields,
 * the engine holds draws). No imports at all.
 *
 * THE LAWS (mirrors eventProse.js; enforced by tests/domain/traditionProse.test.js):
 *  1. CANONICAL-AT-ZERO. Index 0 of every pool is the EXACT pre-existing string the
 *     T-2 mover produced, so a falsy/absent seed reduces to a stable canonical string
 *     and the seeded path only VARIES the phrasing. Interpolated semantic tokens
 *     (the outcome verb `phrase`, the settlement/tradition NAMES, the owner clause)
 *     thread through unchanged — framing varies, meaning never drifts.
 *  2. NO CALAMITY SUBSTRINGS (flood/fire/quake/storm) — the eventProse bucket-
 *     neutrality law, so a later promotion into the news registry stays safe.
 *  3. PORTABLE SPECIFICITY. No canon proper nouns; the only names are the world's own
 *     (the settlement / tradition), interpolated by the caller.
 *
 * Everything here is TASTE-ADJACENT and vetoable (the outcome register, the hook
 * framing). DESIGN_TRADITIONS §10/§11.
 */

/**
 * @typedef {string | ((interp: Record<string, unknown>) => string)} TraditionProseVariant
 */

// ════════════════════════════════════════════════════════════════════════════════════
// OUTCOME NEWS — the tradition beat (traditionsKernel.traditionBeat). Index 0 of each
// pool is the exact canonical string the T-2 mover emitted.
// ════════════════════════════════════════════════════════════════════════════════════

/**
 * The outcome verb PHRASE, per held/cancelled outcome. Index 0 == the pre-existing
 * OUTCOME_PHRASE map, so a seedless caller is byte-identical. Threaded into both the
 * headline and the held summary, so one seeded pick varies both consistently.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
// Every variant is HEADLINE-SAFE: it reads cleanly in `${name} ${phrase} in ${town}`.
export const TRAD_OUTCOME_PHRASE = Object.freeze({
  triumph:   Object.freeze(['was a triumph', 'was a triumph to remember', 'went splendidly']),
  good:      Object.freeze(['was well kept', 'was kept in good faith', 'went well']),
  modest:    Object.freeze(['was modestly kept', 'was kept quietly', 'passed modestly']),
  troubled:  Object.freeze(['passed under a shadow', 'was troubled', 'went uneasily']),
  failure:   Object.freeze(['failed', 'fell flat', 'came to nothing']),
  cancelled: Object.freeze(['was set aside', 'went unheld', 'was quietly set aside']),
});

/**
 * The held-outcome SUMMARY sentence. Interp {town, name, phrase, ownerBit}. Index 0 is
 * the exact canonical string. Every variant keeps the same meaning; only framing rotates.
 * @type {ReadonlyArray<TraditionProseVariant>}
 */
export const TRAD_HELD_SUMMARY = Object.freeze([
  (x) => `In ${x.town}, ${x.name} ${x.phrase} this year. A settlement's traditions carry its identity forward; each holding — or failing — is a mark on the year.${x.ownerBit}`, // canonical
  (x) => `${x.name} ${x.phrase} this year in ${x.town}. A town's observances carry its identity forward, and every year they hold or fail leaves its mark.${x.ownerBit}`,
  (x) => `This year in ${x.town}, ${x.name} ${x.phrase}. What a people keeps — and how well — is written into the record of the year.${x.ownerBit}`,
  (x) => `In ${x.town}, ${x.name} ${x.phrase}. A settlement is known by the customs it keeps; each year's keeping, or failing, is a mark upon it.${x.ownerBit}`,
]);

/**
 * The cancelled-outcome SUMMARY sentence. Interp {town, name, ownerBit}. Index 0 canonical.
 * @type {ReadonlyArray<TraditionProseVariant>}
 */
export const TRAD_CANCELLED_SUMMARY = Object.freeze([
  (x) => `In ${x.town}, ${x.name} was set aside this year — hardship left no room for the observance, and a people that keeps its restraint is remembered for it too.${x.ownerBit}`, // canonical
  (x) => `${x.name} was set aside in ${x.town} this year; hardship left no room for it, and a people that shows restraint in a hard season is remembered for that too.${x.ownerBit}`,
  (x) => `In ${x.town} this year, ${x.name} went unheld — the season left no room for it, and there is a quiet credit in a town that knows when to keep its restraint.${x.ownerBit}`,
]);

// ════════════════════════════════════════════════════════════════════════════════════
// PLOT HOOKS — outcome- and relation-conditioned seeds for the dossier hook corpus
// (collectPlotHooks). Interp {name, town, owner}. Index 0 is the plainest canonical
// hook; the seeded pick rotates the framing per tradition. No calamity substrings.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {Readonly<Record<string, ReadonlyArray<TraditionProseVariant>>>} */
export const TRAD_HOOKS = Object.freeze({
  // lastOutcome === 'failure' — a botched festival breeds blame + discontent.
  failure: Object.freeze([
    (x) => `${x.name} failed badly this year, and the townsfolk are looking for someone to blame — a rich seam of grievance for a party to work.`, // canonical
    (x) => `The failure of ${x.name} has soured the mood in ${x.town}; muttered blame is hardening into factions, and a clever party could tip it either way.`,
    (x) => `${x.name} came apart this year. Someone profited from the disgrace, or arranged it — and the party may be the ones to find out who.`,
  ]),
  // lastOutcome === 'cancelled' — a rite set aside reads as an omen to the anxious.
  cancelled: Object.freeze([
    (x) => `${x.town} set aside ${x.name} this year, and the older folk call it an ill omen — a rumour a party could confirm, dispel, or exploit.`, // canonical
    (x) => `For the first time in memory, ${x.name} went unheld in ${x.town}; the quiet has left people uneasy, and uneasy towns hire adventurers.`,
    (x) => `The setting-aside of ${x.name} has emboldened those who always resented it — and alarmed those who need it kept. The party is caught between them.`,
  ]),
  // lastOutcome === 'triumph' — a great festival draws envy, crowds, and opportunists.
  triumph: Object.freeze([
    (x) => `${x.name} was a triumph this year, and ${x.town} is thick with visitors, coin, and the cut-purses who follow both — the party arrives at the height of it.`, // canonical
    (x) => `The triumph of ${x.name} has made ${x.town} the envy of its neighbours; someone means to spoil it, and the party may be the only ones who notice in time.`,
    (x) => `On the strength of ${x.name}'s triumph, a bold claim is being made in ${x.town} — and a rival is already moving to answer it.`,
  ]),
  // suppressedBy — a rite traded away under an overlord smoulders as resistance.
  suppressed: Object.freeze([
    (x) => `${x.name} was traded away under the overlord and now survives only in secret; the party may be asked to help keep it — or to stamp it out.`, // canonical
    (x) => `The banned rite of ${x.name} is still kept behind closed doors in ${x.town}, and word of it has reached the wrong ears. The party arrives as the net tightens.`,
    (x) => `Since ${x.name} was forced under, a quiet resistance has gathered around its memory in ${x.town} — and the overlord wants names.`,
  ]),
  // a recent 'restoration' mutationLog entry — a liberated rite returns, and reckonings with it.
  restored: Object.freeze([
    (x) => `With the occupation ended, ${x.town} keeps ${x.name} openly again for the first time in years — and old scores are being settled under cover of the celebration.`, // canonical
    (x) => `${x.name} has returned to ${x.town} now the overlord is gone, but the first free keeping stirs up who collaborated and who resisted — and the party is in the middle of it.`,
    (x) => `The restored rite of ${x.name} draws home exiles and grudges alike; ${x.town} has not decided whether it is a reconciliation or a reckoning.`,
  ]),
  // adoptedFrom — a transplanted rite frays against the older custom.
  adopted: Object.freeze([
    (x) => `${x.name}, brought by newcomers, has taken root in ${x.town} — and it chafes against the older custom; the party may be asked to broker, or to take a side.`, // canonical
    (x) => `The settlers' rite of ${x.name} has grown too large for the old families of ${x.town} to ignore, and the friction is turning into something a party could be hired over.`,
    (x) => `${x.name} arrived with the newcomers and now rivals the town's own observances; someone in ${x.town} means to see it gone, and someone else to see it crowned.`,
  ]),
});
