/**
 * warTerminationCauseTables.js — the three CLOSED cause tables the termination
 * read projects, plus the executable totality assertions that guard them.
 *
 * WHY THIS LEAF EXISTS, stated plainly rather than left as a mystery import.
 * `warTermination.js` sits at 880 effective lines against an 800 layer ceiling and
 * is FROZEN there by `scripts/.size-baseline.json` — zero headroom. The taxonomy it
 * serves is walker-enforced for TOTALITY, so a sixteenth casus (WR-8 / CR-WR8-C's
 * `atrocity_answer` ↔ `atrocity_atoned`) cannot land without three new rows in that
 * file, and three new rows in a zero-headroom file is a red ratchet. Rather than
 * raise a frozen number — which the baseline's own instructions forbid — the tables
 * move DOWN into a leaf that has nothing but them, and the ceiling banks the
 * reduction. The bodies below are byte-identical to their pre-split declarations
 * apart from the atrocity rows this move exists to admit.
 *
 * THE ASSERTIONS MOVED WITH THE TABLES, and that is the point of the split rather
 * than an incidental consequence: a table and the proof that it is total belong in
 * the same module, so a future edit cannot separate them by touching only one file.
 * They throw at MODULE LOAD, so adding a taxonomy member without a dissolution mode
 * is an import-time failure, never a silent perpetual war.
 *
 * PURE / DORMANCY-NEUTRAL: three frozen literals and three equality checks. No rng,
 * no clock, no state, no writes, no flag.
 */

import { PEACE_REASON_TYPES, WAR_REASON_TYPES } from './warReasonTaxonomy.js';

/** Repository-wide deterministic order without locale-dependent collation. @param {string} a @param {string} b @returns {number} */
function codepointCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Every shipped cause has an explicit dissolution read.  Most are state-derived:
 * their absence from the current directed reason fold is their death condition.
 * The two exceptions add the amendments' stronger, named tests.
 *
 * `atrocity_answer` takes the state-derived arm deliberately (WR-8, amendment R2):
 * the casus is minted from a BELIEVED razing and decays with the belief, so its
 * death condition is exactly its absence from the live fold — "decay-inherent on
 * its band", which is the discipline every other belief-sourced casus already
 * holds. It gets no named stronger test because there is no durable edge to
 * re-read: the razing is a fact about the past, and what fades is the court's
 * outrage, not the fire.
 */
export const WAR_CAUSE_DISSOLUTION = Object.freeze({
  grievance: 'live_reason_absent',
  revanchism: 'live_reason_absent',
  resource_pressure: 'live_reason_absent',
  treaty_default: 'live_reason_absent',
  encirclement: 'live_reason_absent',
  legitimacy_hunger: 'live_reason_absent',
  corruption_exposed: 'live_reason_absent',
  foreign_clash: 'live_reason_absent',
  fear_of_dominance: 'live_reason_absent',
  ingratitude_debt: 'live_reason_absent',
  dependency_by_design: 'live_reason_absent',
  opportunism: 'weakness_or_patron_changed',
  sacred_claim: 'patron_anchor_changed',
  lineage_claim: 'lineage_edge_or_living_child_changed',
  alliance_obligation: 'alliance_or_origin_episode_changed',
  atrocity_answer: 'live_reason_absent',
});

/** Closed reader-language clauses for a casus that no longer survives its live read. @type {Readonly<Record<string, string>>} */
export const DISSOLVED_CAUSE_PROSE = Object.freeze({
  grievance: 'the court no longer recognizes the grievance that raised its banners',
  revanchism: 'the lost-land claim no longer commands the court',
  resource_pressure: 'the quarrel over scarce stores no longer commands the court',
  treaty_default: 'the broken-pact charge no longer commands the court',
  encirclement: 'the fear of encirclement no longer commands the court',
  legitimacy_hunger: 'the throne no longer needs a foreign enemy to steady its seat',
  corruption_exposed: 'the demanded reckoning for a rotten court has lost its force',
  foreign_clash: 'the proxy quarrel no longer commands the court',
  fear_of_dominance: 'the feared rival no longer threatens the balance',
  ingratitude_debt: 'the remembered debt of aid no longer binds the court',
  dependency_by_design: 'the market leash that raised the banners has broken',
  opportunism: 'the court no longer sees an undefended prize',
  sacred_claim: 'a god named when the banners rose is no longer worshipped from the same throne',
  lineage_claim: 'the living family edge that raised the banners no longer supports the claim',
  alliance_obligation: 'the sworn call or the original quarrel that raised these banners has ended',
  atrocity_answer: 'the burning that turned these courts against a neighbour is no longer spoken of as a cause',
});

/** Closed, number-free peace clauses for the WR-1 reader surface. */
export const TERMINATION_PEACE_PROSE = Object.freeze({
  exhaustion: 'War-weariness is drawing the court toward a settlement.',
  belief_convergence: 'The rival courts are beginning to read the conflict through the same account.',
  economic_strangulation: 'The war is choking the roads and stores that sustain it.',
  coalition_fracture: 'The coalition is thinning as allies leave the field.',
  mediation: 'A neighbouring court is carrying terms both sides may hear.',
  harvest_pressure: 'The needs of the coming harvest are drawing soldiers back toward their fields.',
  realignment: 'A common danger is turning former enemies toward the same horizon.',
  spheres_understanding: 'The rival sponsors are finding room to step back from the same quarrel.',
  balance_restored: 'The feared imbalance has eased, taking urgency out of the war.',
  debt_forgiven: 'An old debt of aid is being remembered as a gift again.',
  bonds_of_commerce: 'Shared markets bind both courts to a peace neither can cheaply break.',
  hopelessness: 'The court no longer believes victory lies down this road.',
  common_rite: 'A shared rite offers both courts ground on which to stand.',
  kinship_bond: 'The surviving family bond gives both courts a reason to step back.',
  obligation_discharged: 'The alliance call has been discharged, leaving no sworn cause to continue the war.',
  atrocity_atoned: 'The atrocity that raised these banners has been answered, and the courts can stand down.',
});

// The comparison separator. A plain codepoint that no reason type can contain,
// chosen DELIBERATELY over the '\u0000' the pre-split code used: an escape that
// survives a hand edit is one thing, but this repository has been bitten four
// times by an agent authoring a RAW NUL into a source file, where grep and diff
// then go silently empty and only the controlBytes ratchet can see it. The
// separator's only job is to be absent from every member of a closed [a-z_]
// vocabulary, and a pipe does that job with no byte anyone can lose.
const SEP = '|';

// Executable totality assertion: adding a taxonomy member without a dissolution
// mode is a module-load failure, not a silent perpetual war.
if (Object.keys(WAR_CAUSE_DISSOLUTION).sort(codepointCompare).join(SEP)
  !== [...WAR_REASON_TYPES].sort(codepointCompare).join(SEP)) {
  throw new Error('WAR_CAUSE_DISSOLUTION must cover every war reason exactly once.');
}
if (Object.keys(DISSOLVED_CAUSE_PROSE).sort(codepointCompare).join(SEP)
  !== [...WAR_REASON_TYPES].sort(codepointCompare).join(SEP)) {
  throw new Error('DISSOLVED_CAUSE_PROSE must cover every war reason exactly once.');
}
if (Object.keys(TERMINATION_PEACE_PROSE).sort(codepointCompare).join(SEP)
  !== [...PEACE_REASON_TYPES].sort(codepointCompare).join(SEP)) {
  throw new Error('TERMINATION_PEACE_PROSE must cover every peace reason exactly once.');
}
