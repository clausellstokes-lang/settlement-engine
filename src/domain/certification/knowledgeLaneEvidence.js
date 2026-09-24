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
 * A row must never treat a nonzero knowledge count as its own evidence while
 * this list is non-empty. Shrinking it is a real improvement (give one of these
 * kinds a family of its own, or narrow the `news` token) and this constant is
 * what makes that improvement visible.
 * @type {ReadonlyArray<string>}
 */
export const KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS = Object.freeze([
  'assize_verdict', 'brokered_back', 'cause_lifecycle', 'chance_meeting_exposed',
  'chance_meeting_recorded', 'commons_gathering', 'commons_petition', 'commons_riot',
  'diplomacy', 'disposition_diplomatic_crossed', 'disposition_insular_crossed',
  'disposition_martial_crossed', 'disposition_mercantile_crossed', 'disposition_reversal',
  'hierarchy_cascade', 'hungry_gap', 'lineage_edge_recorded', 'lure_sprung', 'moral_reckoning',
  'plague_arrival', 'queue_refused', 'reaffirmed', 'realm_verb_propose_pact',
  'realm_verb_refused', 'roads', 'signed', 'spatial_consequence', 'spring_thaw',
  'treasury_band', 'treasury_shortfall', 'treaty_default_detected', 'treaty_disclosure_opened',
  'treaty_lapsed',
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
 * RE-MEASURED AT BUILD by FP IN-6 U1 (2026-09-24, the tree at 85c170e8e): seven
 * at the 2026-07-31 census, which read only the late-lane authors; the live census
 * now reads every exact Herald routing token that is not an impactKind literal
 * (tests/helpers/knowledgeResidualCensus.js), and ONE HUNDRED FORTY-FIVE of them
 * reach the family only through the id. The ratchet holds this list exactly equal
 * to the live residual, like its impactKind sibling above.
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
export const KNOWLEDGE_FAMILY_RESIDUAL_KINDS = Object.freeze([
  'alliance_burden', 'allied', 'ally_burden', 'autoplacement', 'betrayal',
  'bought_seat_fragility', 'casus_alliance_obligation', 'casus_declared',
  'casus_lineage_claim_child', 'casus_lineage_claim_parent', 'ceasefire_commerce', 'client',
  'commercial_casus_suppressed', 'commercial_contraband_injury', 'commercial_contract_default',
  'commercial_contract_honored', 'commercial_cornering', 'commercial_dependency_comfort',
  'commercial_dependency_fear', 'commercial_honest_gates', 'commercial_partnership_crossing',
  'commercial_provision', 'commercial_route_predation', 'commercial_route_wardenship',
  'commercial_severance_crossing', 'compound_calling_of_debts', 'compound_gods_abandonment',
  'compound_shadow_court', 'compound_starving_city', 'compound_the_wasting', 'convoy_ordered',
  'creditor', 'criminal_corridor', 'criminal_network', 'critical_supplier', 'custom_crisis',
  'debtor', 'envoy_departed', 'envoy_dispatched', 'envoy_held', 'envoy_home',
  'envoy_intercepted', 'envoy_lost', 'envoy_on_the_road', 'envoy_parlaying', 'envoy_returning',
  'envoy_silence_inference', 'envoy_terms_agreed', 'false_accusation', 'forced_tribute',
  'home_front_hands', 'home_front_institutions', 'home_front_markets', 'home_front_roads',
  'home_front_stores', 'indebtedness', 'infiltration', 'infowar_lie_exposed',
  'infowar_spy_exposed', 'insurgency', 'intercept_ordered', 'interceptor_dilemma',
  'interceptor_parlays_own_edge', 'kinship_opposes_the_sale', 'lineage_claim_suppressed',
  'lineage_survives_the_sale', 'magic_deadzone', 'magical_instability', 'major',
  'mediated_commerce', 'military_protection', 'military_supplier', 'minor',
  'mirror_kinship_bond', 'mirror_obligation_discharged', 'momentum_climb_down', 'neutral',
  'overflow_valve_sold', 'pact_proposed', 'parlay_at_an_occupied_venue',
  'parlay_terms_neither_court_drafted', 'patron', 'plague', 'political_fracture',
  'preferred_supplier', 'protection_gap', 'proxy', 'race_story', 'race_together', 'razing',
  'realm_verb_declare_casus', 'realm_verb_force_abandon', 'realm_verb_force_found_steading',
  'realm_verb_force_reconsideration', 'realm_verb_force_resettle', 'realm_verb_intercept',
  'realm_verb_order', 'realm_verb_order_convoy', 'realm_verb_reinforce',
  'realm_verb_repudiate_treaty', 'realm_verb_transfer_sovereignty', 'reconsideration_forced',
  'refusal_cost_ally_patience', 'regional_channel', 'relationship_label_change', 'rival',
  'route_disruption', 'ruler_books_compromised', 'sale_books_diverged', 'sanctioned',
  'service_dependency', 'service_disruption', 'slave_revolt', 'sovereignty_conveyed',
  'sovereignty_edge_rewritten', 'sovereignty_sale_cleared', 'sovereignty_sale_judged',
  'sovereignty_sale_offered', 'sovereignty_swap', 'steading_abandoned',
  'steading_charter_pending', 'steading_forced', 'steading_founded', 'steading_orbit_dispersed',
  'steadings_converged', 'strategy_hold', 'strategy_return_home', 'streams_rerouted',
  'sweep_launched', 'tax_obligation', 'tax_revenue_disruption', 'terms_never_reached',
  'terms_signed_for_a_fallen_town', 'trajectory_misread', 'treaty_breached', 'treaty_signed',
  'tribute', 'wartime', 'wartime_firesale', 'webwar_campaign_abandoned',
  'webwar_campaign_complete', 'webwar_campaign_minted', 'webwar_wrong_village',
  'winning_abroad_losing_at_home', 'word_came_too_late',
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
