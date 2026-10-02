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
 * ⭐ CURED 2026-09-24 BY FP IN-6. U1 re-measured the residual at build (thirty-three
 * impactKinds and one hundred forty-five routed kinds by then); U2 removed the bare
 * `news` token and registered the information beats' own vocabulary, so the family
 * is EARNED and both residual lists below are empty. A knowledge count is still
 * SHARED by every belief-lane beat, so it corroborates and never proves one row.
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
 * The impactKinds that reach the `knowledge` mover family only through the
 * `news` token in their own wizard-news id, having matched no earlier family.
 * Enumerated by executing moverFamilyOf over the estate's impactKind census, not
 * by reading the token lists, so it stays honest about what the classifier
 * actually does. RE-MEASURED AT BUILD by FP IN-6 U1 (2026-09-24, the tree at
 * 85c170e8e): fifteen at the 2026-07-31 census, THIRTY-THREE now. The census and
 * the classifier run are tests/helpers/knowledgeResidualCensus.js, and the
 * decontamination ratchet in tests/domain/subsystemRowsEpistemics.test.js holds
 * this list EXACTLY equal to the live residual in both directions.
 *
 * EMPTY SINCE FP IN-6 U2, THE CURE: the bare `news` token left the knowledge
 * family's token list, so no kind reaches the family through its id any more, and
 * the ratchet banks the cure at zero. A kind that lands here again is a regression
 * the earned-classification walker (tests/lint/earnedClassification.walker.test.js)
 * reds first.
 *
 * A row must never treat a nonzero knowledge count as its own evidence while
 * this list is non-empty. Shrinking it is a real improvement (give one of these
 * kinds a family of its own, or narrow the `news` token) and this constant is
 * what makes that improvement visible.
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS = Object.freeze([]);

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
 * RE-MEASURED AT BUILD by FP IN-6 U1 (2026-09-24, the tree at 85c170e8e): seven
 * at the 2026-07-31 census, which read only the late-lane authors; the live census
 * now reads every exact Herald routing token that is not an impactKind literal
 * (tests/helpers/knowledgeResidualCensus.js), and ONE HUNDRED FORTY-FIVE of them
 * reach the family only through the id. The ratchet holds this list exactly equal
 * to the live residual, like its impactKind sibling above. EMPTY SINCE FP IN-6 U2,
 * for the reason stated on the impactKind list.
 *
 * Deliberately EXCLUDED, with the executed reason:
 *   - webwar_raid: `raid` is a war token, so it classifies `war` on its own
 *     vocabulary — a real (if coarse) family, not residual.
 *   - intel_transfer: `intel` is a knowledge token, so it classifies knowledge
 *     WITHOUT its id — the one late-lane beat whose knowledge filing is
 *     semantically earned (intelligence changing hands).
 *   - treaty_signed: WAS excluded at the 2026-07-31 census because its record
 *     carries impactKind `diplomacy`. The IN-6 U1 census classifies every routed
 *     token ON ITS OWN, because a producer can mint it as a bare kind, so it is
 *     listed below with the rest.
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_FAMILY_RESIDUAL_KINDS = Object.freeze([]);

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

/**
 * THE INFORMATION FLAGS' DISPOSITIVE LITERALS (FP IN-6 U6; the compiled block #22: "Certification
 * rows for all four IN flags name their dispositive literals"; DESIGN_FP_INFORMATION.md §5 IN-6:
 * "each naming its dispositive literals (contamination law) and its differential evidence path").
 *
 * Per key, the news kinds ONLY that key's beats mint: every one a row of the INFORMATION kind
 * registry, disjoint across keys, and EARNED knowledge on its own vocabulary since U2 removed the
 * bare `news` token. Like KNOWLEDGE_LANE_EVENT_TYPES above they are POST-APPLY news entries: they
 * land in a receipt's postApplyMoverCounts and never in eventTypeCounts, which is why the four
 * rows keep their eventTypes channel empty and cite these by name instead. A shared knowledge
 * count still corroborates every beat at once, so no row may claim the family.
 *
 * The mirror has NONE, by design: it writes nothing, and its one registered kind
 * (mirror_standing_line) is a section-null dossier row no receipt carries.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const INFO_FLAG_DISPOSITIVE_LITERALS = Object.freeze({
  // QUOTED KEYS, ON PURPOSE: each flag's gate-polarity census counts every bare code spelling of
  // its key in src as a read, and a catalog that names the key is not one (codeOnly blanks a
  // quoted literal, exactly as it blanks a row's `rule:` string).
  'counterIntelEnabled': Object.freeze(['false_accusation', 'sweep_launched']),
  'infoLureEnabled': Object.freeze(['lure_sprung']),
  'reputationRaceEnabled': Object.freeze(['race_person', 'race_story', 'race_together', 'word_came_too_late']),
  'secondOrderBeliefEnabled': Object.freeze([]),
});

/**
 * The differential evidence path every IN row cites (FP IN-6 U4): one seed, the key lit and
 * dark, the receipts that differ by kind and the arm that holds a key dark, written to a file.
 * @type {string}
 */
export const INFO_FLAG_DIFFERENTIAL_PATH = 'scripts/audit/info-lit-dark-differential.mjs';
