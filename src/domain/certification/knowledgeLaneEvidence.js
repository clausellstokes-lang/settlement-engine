/**
 * knowledgeLaneEvidence.js — THE TRACED ALIVENESS SOURCES FOR THE KNOWLEDGE LANE.
 *
 * WHY THIS FILE EXISTS SEPARATELY. Several certification rows (the belief engine,
 * distance-priced news, information statecraft, ally intel) have to say what
 * "knowledge moved" would even look like in a receipt. Each of them would
 * otherwise reach for `moverFamilies: ['knowledge']`, and that claim is WORSE
 * than merely corroborating: it is CONTAMINATED. One traced catalog, imported by
 * every lane that needs it, keeps the finding in one place instead of letting
 * four authors each re-derive it wrongly.
 *
 * ── THE CONTAMINATION (measured 2026-07-31, from the classifier itself) ───────
 * scripts/audit/behavioral-observation.mjs classifies a record by joining
 * ruleFamily, candidateType, ruleId, impactKind, type, kind and id into one
 * string and returning the FIRST BEHAVIORAL_MOVER_FAMILIES member whose token
 * list matches. The `knowledge` family is LAST in that order, and one of its
 * tokens is the bare word `news`. Every post-apply wizard-news receipt carries an
 * id of the form `wizard_news.<tick>.<kind>....`, whose tokenization contains
 * `news`. So any wizard-news entry that matches NO earlier family falls through
 * into `knowledge` on the strength of its own id prefix alone.
 *
 * Executed against the estate's full impactKind census, exactly ONE kind reaches
 * `knowledge` on its own vocabulary (`belief_misjudgment`); FIFTEEN more reach it
 * only through the id prefix. That is why the completed 30-year soak's
 * "knowledge: 28" is not evidence that the belief lane fired: those 28 receipts
 * could be twenty-eight diplomacy notices. A row that declared
 * `moverFamilies: ['knowledge']` would therefore grade ALIVE off other
 * subsystems' work, which is precisely the vacuity the certification contract
 * forbids.
 *
 * ── WHAT TO DECLARE INSTEAD ──────────────────────────────────────────────────
 * KNOWLEDGE_LANE_EVENT_TYPES  the one dispositive vocabulary literal.
 * KNOWLEDGE_LANE_STATE_KEYS   the four worldState containers the lane writes,
 *                             each traced to its literal-key setSpatialLedger
 *                             call. These ARE dispositive and are receipt
 *                             expressible from the v5 subsystems.stateKeys
 *                             census.
 * BELIEF_DIVERGENCE_RECEIPT_PATH  the per-year belief-versus-ground-truth metric
 *                             added to the soak receipt on 2026-07-31, which is
 *                             what finally makes the info regime measurable
 *                             rather than merely configured.
 *
 * Pure data. No store, no React, no I/O, no clock, no randomness. Imported only
 * by the certification lane files, the tests, and the audit scripts, so it stays
 * off every eager path.
 *
 * @enforced-by tests/domain/subsystemRowsEpistemics.test.js
 */

/**
 * The knowledge lane's ONE dispositive event literal: the fog-of-war receipt the
 * belief engine composes when a SELECTED offensive move was chosen on a belief
 * that the ground truth contradicts (beliefMap.js beliefMisjudgmentNewsEntries,
 * `impactKind: 'belief_misjudgment'` at line 1414).
 *
 * It is a POST-APPLY wizard-news entry, not a selected candidate, so it lands in
 * a receipt's postApplyMoverCounts and NEVER in eventTypeCounts (which observes
 * `result.selected` only). A certification row may therefore cite it as the
 * lane's vocabulary, but must not expect it in the eventTypes channel.
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_LANE_EVENT_TYPES = Object.freeze(['belief_misjudgment']);

/**
 * The worldState containers the knowledge lane materializes, in v5 census key
 * form (`spatialLedgers.<sub>`; every one is written through the literal-key
 * setSpatialLedger idiom, so the spatialLedgerCoverage walker sees them):
 *
 *   beliefMaps    the belief advance —
 *                 pulseKernel.js `setSpatialLedger(memoryState, 'beliefMaps', beliefs.next)`
 *                 — plus generosityKernel.js:1225 and informationStatecraft.js:1308.
 *   rumorLedgers  the rumor network advance —
 *                 pulseKernel.js `setSpatialLedger(memoryState, 'rumorLedgers', rumors.next)`
 *                 — and roadsKernel.js:1123.
 *   credibility   informationStatecraft.js:347 (the source-credibility stock).
 *   disinfo       informationStatecraft.js:1316 (the lie lifecycle ledger).
 *
 * Each is a CONDITIONAL ledger: absent when its lane is dormant, and dropped
 * back to absent when it empties. Absence is therefore real evidence, but only
 * against a census that claims totality (subsystems.stateKeysComplete).
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_LANE_STATE_KEYS = Object.freeze([
  'spatialLedgers.beliefMaps',
  'spatialLedgers.credibility',
  'spatialLedgers.disinfo',
  'spatialLedgers.rumorLedgers',
]);

/**
 * The FIFTEEN impactKinds that reach the `knowledge` mover family only through
 * the `news` token in their own wizard-news id, having matched no earlier
 * family. Enumerated by executing moverFamilyOf over the estate's impactKind
 * census, not by reading the token lists, so it stays honest about what the
 * classifier actually does.
 *
 * A row must never treat a nonzero knowledge count as its own evidence while
 * this list is non-empty. Shrinking it is a real improvement (give one of these
 * kinds a family of its own, or narrow the `news` token) and this constant is
 * what makes that improvement visible.
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS = Object.freeze([
  'assize_verdict',
  'cause_lifecycle',
  'commons_gathering',
  'commons_petition',
  'commons_riot',
  'diplomacy',
  'hierarchy_cascade',
  'hungry_gap',
  'moral_reckoning',
  'plague_arrival',
  'queue_refused',
  'realm_verb_refused',
  'roads',
  'spatial_consequence',
  'spring_thaw',
]);

/**
 * The SIBLING census the impactKind list above cannot see: KIND-ONLY producers.
 * The late-lane authors (momentum, supply-web warfare, information statecraft)
 * mint their routing token AS `kind` and set no impactKind at all, so when their
 * receipts gained ids on 2026-07-31 and started reaching the observation, the
 * impactKind census silently under-counted the residual bucket. Same contract,
 * same honesty rule: each of these lands in `knowledge` ONLY through the `news`
 * token in its wizard-news id (verified by executing moverFamilyOf, not by
 * reading token lists), so a nonzero knowledge count is never one row's
 * evidence while either list is non-empty.
 *
 * Deliberately EXCLUDED, with the executed reason:
 *   - webwar_raid: `raid` is a war token, so it classifies `war` on its own
 *     vocabulary — a real (if coarse) family, not residual.
 *   - intel_transfer: `intel` is a knowledge token, so it classifies knowledge
 *     WITHOUT its id — the one late-lane beat whose knowledge filing is
 *     semantically earned (intelligence changing hands).
 *   - treaty_signed: carries impactKind `diplomacy`, already censused above.
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_FAMILY_RESIDUAL_KINDS = Object.freeze([
  'infowar_lie_exposed',
  'infowar_spy_exposed',
  'momentum_climb_down',
  'webwar_campaign_abandoned',
  'webwar_campaign_complete',
  'webwar_campaign_minted',
  'webwar_wrong_village',
]);

/**
 * Where the belief-versus-ground-truth metric lives in a soak receipt. Added to
 * the per-year observation on 2026-07-31 because the info regime (infoMode) had
 * no measurable consequence anywhere in the envelope: a run could carry
 * `infoMode: 'full'` and a fully materialized belief map while every belief in
 * it was either perfectly true or wildly wrong, and no receipt field could tell
 * the difference. The metric is additive, so every receipt already on disk keeps
 * its exact meaning and simply reports this channel as an instrument gap.
 * @type {string}
 */
export const BELIEF_DIVERGENCE_RECEIPT_PATH = 'behavioral.yearly[].beliefDivergence';

/**
 * The two halves of the belief engine's activation gate (beliefMap.js
 * beliefsActive), recorded per year alongside the metric so a reader can tell a
 * QUIET knowledge lane from a DORMANT one without re-running anything:
 * `spatialCanonized` is the marker half and `infoMode` is the regime half.
 * @type {ReadonlyArray<string>}
 */
export const BELIEF_GATE_RECEIPT_FIELDS = Object.freeze([
  'behavioral.yearly[].beliefDivergence.spatialCanonized',
  'behavioral.yearly[].beliefDivergence.infoMode',
]);
