/**
 * couplingRegistryGrammar.js — the GRAMMAR volume's coupling rows, per the CW-0w
 * per-volume leaf split (WAR and TRADE already have theirs).
 *
 * GR-2 is the first GRAMMAR wave that reads ACROSS a layer boundary, and it does so in
 * three directions at once, because a peacetime pact is by construction a thing built out
 * of other layers' evidence: what a court BELIEVES it lacks (INFORMATION), what its court
 * is DISPOSED to do and what it already owes its neighbour (INTERIOR), and who both courts
 * have reason to fear (WAR). Each direction gets ONE row naming the importer as its read
 * address, because `tests/lint/couplingInclusion.walker.test.js` licenses a cross-layer
 * import by matching `moduleOf(row.read)` against the importer — so a row that named the
 * imported leaf instead would license nothing and the ratchet would still red.
 *
 * THE PAIR ANCHORS ARE THE COUPLINGS VOLUME'S OWN NUMBERS, not new ones: CPL-19
 * (INFO×GRAMMAR), CPL-21 (GRAMMAR×INTERIOR) and CPL-5 (WAR×GRAMMAR) are §4's table
 * verbatim, and the volume already names GR-2 in two of those rows as the wave that would
 * fill them. Minting a fresh pair id would have forked the estate's own map of what
 * touches what — the couplingId shape refuses it outright, which is the guard working.
 *
 * ⚠ EVERY `receiptField` HERE IS STATE-ROOTED, AND THAT WAS NOT THE FIRST DRAFT. The rows
 * originally addressed `advancePeacetimePacts(...).receipts[]` — a RETURNED READ, which
 * `tests/domain/couplingReceiptSample.test.js` cannot sample from persisted state and
 * which its seam SC-9 ratchet counts as debt. That ratchet is shrink-only and reddened
 * immediately, exactly as designed: "a NEW row that hides behind a returned-read address
 * raises it and reds here". The addresses were re-pointed rather than the debt raised,
 * which was possible because this lane genuinely persists its story — the proposal ledger
 * carries the trigger and the transport, the relationship record carries the refusal
 * memory and the trust delta, and the instrument carries the provenance and the lineage.
 * A row that could only have been expressed as a returned read would have been a sign the
 * coupling left no trace, which is a design problem and not a registry one.
 *
 * THE COUNTERFORCE COLUMN IS REAL HERE, not a formality. Every one of these reads has a
 * force and a counterforce inside the SAME module, and in two of the three cases inside
 * the same function: the demand that raises a proposal and the dependency fear that
 * refuses it are scored from one set of numbers, which is the whole design of GR-2's
 * answer. The registry is where that is written down for a reader who has only the row.
 *
 * @enforced-by tests/domain/couplingRegistry.test.js,
 *   tests/lint/couplingInclusion.walker.test.js
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * GR-2 / INFORMATION→GRAMMAR. THE DEMAND IS A BELIEF ON BOTH ENDS. A court's believed
 * scarcity of its neighbour's goods raises a proposal; the same belief machinery supplies
 * the devotion and pull rungs the other two peacetime occasions read. The proposer's
 * OATHBREAKER CREDIBILITY rides the same direction — it is what the responder's reserve
 * charges a lineage that has disavowed before, read through the estate's one credibility
 * reader so GR-4's charge bites here the day it lands.
 *
 * THE COUNTERFORCE is the wrong-market tragedy made legal: both ends are beliefs and
 * neither is checked against the other town's real granary, so a pact CAN be signed for
 * grain the counterparty never had, and the world discovers the mismatch as the next
 * grievance rather than as a validation error.
 */
export const GR2_BELIEVED_DEMAND_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.GR-2.believed_demand',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/pactFormation.js#crossingsFor',
  receiptField: 'spatialLedgers.pactProposals[].{trigger,sheet,openedTick,answerDueTick,transport}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#reserveFor',
  flags: Object.freeze([
    'beliefAxesEnabled',
    'believedConditionsEnabled',
    'believedDevotionEnabled',
    'believedScarcityEnabled',
    'pactFormationEnabled',
  ]),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-2',
  intendedDesk: 'diplomacy',
});

/**
 * GR-2 / INTERIOR→GRAMMAR. THE ANSWER IS THE COURT'S OWN NERVE. SP-C's posture and risk
 * appetite compose the reserve a proposal must clear, and the pair's existing
 * `dependency`/`leverage` relationship axes price THE DEPENDENCY FEAR that can refuse a
 * bargain the demand alone would have signed. The refusal is written back to the same
 * relationship record as a turning point and a banded trust delta — no grievance, no
 * casus, and no ratchet in either direction.
 *
 * THE COUNTERFORCE is named in the row because it is the load-bearing half: a pact that
 * would bind a court too tightly is refused BY THE SAME NUMBERS that invited it, and the
 * band is proven live at both ends rather than merely permitted by arithmetic.
 */
export const GR2_POSTURE_RESERVE_COUPLING = couplingRow({
  couplingId: 'CPL-21.INTERIOR_TO_GRAMMAR.GR-2.posture_reserve',
  pairId: 'CPL-21',
  direction: 'INTERIOR→GRAMMAR',
  read: 'src/domain/worldPulse/pactFormation.js#reserveFor',
  receiptField: 'worldState.relationshipStates[...].{trust,turningPoints}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#answerPactProposal',
  flags: Object.freeze([
    'dispositionChannelsEnabled',
    'pactFormationEnabled',
    'strategicPostureEnabled',
  ]),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-2',
  intendedDesk: 'diplomacy',
});

/**
 * GR-2 / WAR→GRAMMAR. THE THREAT TWO COURTS SHARE. `shared_threat` is the THIRD consumer
 * of WR-6's believed alliance-web risk read, and it consumes it whole — the members, the
 * magnitude and the BAND — rebuilding no walk and re-grading no rung. The war layer also
 * supplies this lane's terminal condition: a war OPENING between courts who wrote
 * something down in peace closes their negotiated clauses with the `broken_by_war` ending
 * and stops the pair forming anything new while it lasts.
 *
 * THE COUNTERFORCE is that closure. The same layer that gives two courts a reason to sign
 * is the layer that can end what they signed, and both halves live in this module.
 */
export const GR2_SHARED_THREAT_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.GR-2.shared_threat',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/pactFormation.js#crossingsFor',
  receiptField: 'spatialLedgers.treaties[].{provenance,lineage,terms}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#advancePeacetimePacts',
  flags: Object.freeze([
    'pactFormationEnabled',
    'peaceEngineEnabled',
    'warLayerEnabled',
  ]),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-2',
  intendedDesk: 'diplomacy',
});

/** @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const GR2_PACT_FORMATION_COUPLINGS = Object.freeze([
  GR2_BELIEVED_DEMAND_COUPLING,
  GR2_POSTURE_RESERVE_COUPLING,
  GR2_SHARED_THREAT_COUPLING,
]);
