/**
 * adjudicationMark.js — WHO RULED THIS, spelled exactly once.
 *
 * Realm directive 7 / J-D7 promises that "retrospective review always shows who
 * ruled". The whole mechanism is one optional key on a proposal row: a ruling the
 * ENGINE rendered under full auto-resolve carries `adjudicatedBy: 'engine_auto'`,
 * and a ruling the DM rendered by hand carries NO such key — the ABSENCE is the
 * DM's signature, and it is the pre-existing row shape, unchanged.
 *
 * WHY THIS IS ITS OWN MODULE. The mark has two kinds of reader: the WRITER side
 * (autoAdjudication.js, which stamps it while folding an advance's docket) and the
 * READ side (the Herald's resolved log, which must not call an engine ruling "applied
 * by you"). The writer statically imports applyWorldPulse.js — the whole simulation
 * apply kernel — so a UI surface that reached for the accessor through that module
 * would drag the kernel into the Herald's chunk for the sake of one string compare.
 * This leaf has ZERO imports, so both sides share ONE spelling of the key at no
 * bundle cost. autoAdjudication.js re-exports both names, so every established
 * import path keeps working.
 *
 * PURITY. No clock, no RNG, no store, no DOM. Total on garbage input.
 */

/**
 * The typed provenance value for a ruling the ENGINE rendered under full
 * auto-resolve. A frozen vocabulary of exactly one member today; a future
 * adjudicator (a scheduled ruling, a co-DM) adds a sibling here rather than
 * inventing a free-form string at a call site.
 * @type {'engine_auto'}
 */
export const ENGINE_AUTO_ADJUDICATOR = 'engine_auto';

/**
 * Is this proposal row one the ENGINE ruled on (rather than the DM)?
 * The single read-side accessor, so no surface re-spells the key.
 * @param {{ adjudicatedBy?: unknown } | null | undefined} proposal
 * @returns {boolean}
 */
export function isEngineAdjudicated(proposal) {
  return !!proposal && proposal.adjudicatedBy === ENGINE_AUTO_ADJUDICATOR;
}
