/**
 * analyticsEvents.js — pure event registry (no transport, no side effects).
 *
 * Extracted from analytics.js so the edge ingest function can validate against
 * the SAME frozen contract (via the generated bundle, see
 * scripts/build-edge-shared.mjs). analytics.js re-exports EVENTS so all existing
 * call sites and the `funnel-event-contract` ESLint rule are untouched.
 *
 * Three things live here:
 *   - EVENTS       — frozen { CONSTANT: 'snake_case_name' } registry.
 *   - EVENT_CLASS  — parallel { CONSTANT: 'essential' | 'research' } map. Drives
 *                    consent gating: research-class events are never built or
 *                    mirrored without explicit opt-in (see consent.js).
 *   - EVENTS_REV   — bumped when the contract shape changes (stamped on rows).
 *
 * Event-name contract: ^[a-z][a-z0-9_]{2,63}$ (enforced in the edge fn + a test).
 */

import { EDIT_KINDS } from '../domain/pendingEdits.js';

export { EDIT_KINDS };

/** Contract revision — bump on a breaking shape change.
 *  rev 2: system-mutation capture — enriched world_pulse_advanced / proposal /
 *  party / simulation-rules props, world_pulse_proposal_dismissed, the activated
 *  world_stressor_transitions emit, generation config_signature, and the new
 *  pulseEffects research lane (world_pulse_effects table).
 *  rev 3: regional/NPC capture — regional_arc_emerged, activated
 *  neighbour_linked + regional_graph_snapshot, enriched regional_impact /
 *  channel-status props, NPC distributions in the structural fingerprint.
 *  rev 4: regional_propagation_applied (the cross-settlement ripple moment).
 *  rev 5: gallery_imported (a shared map / map-with-campaign cloned into a library).
 *  rev 6: the generation-id SPINE — generation_milestone (one event, five waypoints:
 *  generate/save/canonize/export/narrate, each carrying a pseudonymous generation_id
 *  + a coarse structural fingerprint) and event_edit_applied (the revealed-preference
 *  signal for which in-world event types DMs actually apply).
 *  rev 7: Phase-5.5 SPATIAL-ENGINE usage — ADDITIVE props only (no new event names):
 *  world_pulse_advanced gains a sim_config block (preset_id / info_mode / CL-0 axes /
 *  flags_on) + spatial_active + a per-mover activity block (movers_active + coarse
 *  id-free mover_counts + migration_pop_band) read from the post-tick spatialLedgers;
 *  world_canonized (spatial path) gains spatial/version/lit-feature/digest-size props.
 *  Derivation is src/lib/spatialUsage.js (lazy side-channel).
 *  rev 8: Surveyor S1b — the analyst gains ai_analyst_rider (§3f: the model's
 *  ID-FREE, category-grade self-tag, emitted SERVER-SIDE by the ai-analyst edge on
 *  BOTH managed + BYOK paths as a condition-of-service) and ai_analyst_answer gains
 *  the §3b register-purity band beside citation coverage.
 *  rev 9: (in-flight prior lanes).
 *  rev 10: SM-5 map-layer capture — town_map_layer_used, ONE feature-discriminated
 *  event carrying the town-map GENERATION profile (feature:'render') + LEGIBILITY
 *  engagement (provenance_hover/change_view/edge_labels/annotation_add/lens_switch/
 *  panorama). Counts/enums/bands only; fired client-side from the lazy pane via
 *  src/lib/mapLayerAnalytics.js. Essential class; the engine emits nothing.
 *  rev 11: W-DOC — the Welcome landing funnel joins the SM-5 pattern:
 *  landing_funnel_used, ONE feature-discriminated event (feature:'view' once per
 *  session · 'fixture_forge' with the fixture's constant seed — no user data).
 *  Fired client-side from the lazy landing chunk via
 *  src/lib/landingFunnelAnalytics.js; lands the previously dormant
 *  Funnel.welcomeView / Funnel.landingFixtureForge seams. Essential class. */
export const EVENTS_REV = 11;

export const EVENTS = Object.freeze({
  // ── Minimum 4-event funnel ─────────────────────────────────────────────
  HOMEPAGE_VIEW:                  'homepage_view',
  ANONYMOUS_GENERATION_COMPLETED: 'anonymous_generation_completed',
  SIGNUP_AFTER_ANON:              'signup_after_anon',
  PAID_AFTER_ANON:                'paid_after_anon',

  // ── Full schema ────────────────────────────────────────────────────────
  ANONYMOUS_GENERATION_STARTED:   'anonymous_generation_started',
  DOSSIER_PREVIEW_VIEWED:         'dossier_preview_viewed',
  HOW_SIMULATED_OPENED:           'how_simulated_opened',
  SIGNUP_GATE_SEEN:               'signup_gate_seen',
  SIGNUP_STARTED:                 'signup_started',
  SIGNUP_COMPLETED:               'signup_completed',
  SETTLEMENT_SAVED:               'settlement_saved',
  PDF_EXPORT_CLICKED:             'pdf_export_clicked',
  SINGLE_DOSSIER_CHECKOUT_STARTED:'single_dossier_checkout_started',
  SINGLE_DOSSIER_PURCHASED:       'single_dossier_purchased',
  PREMIUM_MODAL_SEEN:             'premium_modal_seen',
  PREMIUM_CHECKOUT_STARTED:       'premium_checkout_started',
  PREMIUM_PURCHASED:              'premium_purchased',
  AI_NARRATIVE_CLICKED:           'ai_narrative_clicked',
  AI_NARRATIVE_COMPLETED:         'ai_narrative_completed',
  CREDITS_EXHAUSTED:              'credits_exhausted',
  NEIGHBOR_PREVIEW_CLICKED:       'neighbor_preview_clicked',
  UPGRADE_AFTER_NEIGHBOR_CLICKED: 'upgrade_after_neighbor_clicked',

  // ── Critique-implementation expansion ──────────────────────────────────
  WOW_REVEAL_SHOWN:               'wow_reveal_shown',
  WOW_REVEAL_COMPLETED:           'wow_reveal_completed',
  SAVE_BUTTON_CLICKED:            'save_button_clicked',
  SAVE_SIGNUP_INTENT_OPENED:      'save_signup_intent_opened',
  SAVE_SIGNUP_INTENT_FULFILLED:   'save_signup_intent_fulfilled',
  PRICING_MOMENT_SHOWN:           'pricing_moment_shown',
  PRICING_MOMENT_CLICKED:         'pricing_moment_clicked',
  PRICING_MOMENT_DISMISSED:       'pricing_moment_dismissed',
  WELCOME_CREDIT_GRANTED:         'welcome_credit_granted',
  WELCOME_CREDIT_SPENT:           'welcome_credit_spent',
  ANON_CAP_UNLOCK_SHOWN:          'anon_cap_unlock_shown',
  ANON_CAP_UNLOCK_CLICKED:        'anon_cap_unlock_clicked',
  LOCKED_DESTINATION_SHOWN:       'locked_destination_shown',
  DOSSIER_GROUP_TAB_CLICKED:      'dossier_group_tab_clicked',
  SIMULATION_DRAWER_OPENED:       'simulation_drawer_opened',
  EDIT_MODE_TOGGLED:              'edit_mode_toggled',
  EDIT_PENDING_QUEUED:            'edit_pending_queued',
  EDIT_CASCADE_PREVIEWED:         'edit_cascade_previewed',
  EDIT_COMMITTED:                 'edit_committed',
  EDIT_REVERTED:                  'edit_reverted',
  WORKSHOP_OPENED:                'workshop_opened',
  WORKSHOP_LOCKED_SHOWN:          'workshop_locked_shown',
  MAP_ROUTES_MODE_ENTERED:        'map_routes_mode_entered',
  MAP_DROP_PREVIEW_SHOWN:         'map_drop_preview_shown',
  RETURN_VISIT_DETECTED:          'return_visit_detected',
  WELCOME_BACK_OPEN_CLICKED:      'welcome_back_open_clicked',
  FOUNDER_TILE_SHOWN:             'founder_tile_shown',
  FOUNDER_TILE_CLICKED:           'founder_tile_clicked',
  HELP_POPOVER_OPENED:            'help_popover_opened',
  COMPENDIUM_SEARCH:              'compendium_search',

  // ── v2 taxonomy: generation ────────────────────────────────────────────
  GENERATION_STARTED:             'generation_started',
  GENERATION_COMPLETED:           'generation_completed',
  GENERATION_FAILED:              'generation_failed',
  GENERATION_STEP_TIMINGS:        'generation_step_timings',     // research
  WIZARD_STEP_VIEWED:             'wizard_step_viewed',
  WIZARD_ABANDONED:               'wizard_abandoned',
  REGENERATION_TRIGGERED:         'regeneration_triggered',
  // The generation-id spine — one event, fired at every lifecycle waypoint
  // (generate / save / canonize / export / narrate) carrying the SAME
  // pseudonymous generation_id + a coarse structural fingerprint (bands/enums/
  // coherence booleans). Lets analysis reconstruct a generation's whole journey.
  GENERATION_MILESTONE:           'generation_milestone',

  // ── v2: dossier reading ────────────────────────────────────────────────
  DOSSIER_TAB_VIEWED:             'dossier_tab_viewed',
  DOSSIER_SECTION_DWELL:          'dossier_section_dwell',
  DOSSIER_READ_SESSION_SUMMARY:   'dossier_read_session_summary',
  CAUSAL_EXPLANATION_OPENED:      'causal_explanation_opened',
  PIPELINE_RAIL_STEP_INSPECTED:   'pipeline_rail_step_inspected',
  COMPENDIUM_ENTRY_OPENED:        'compendium_entry_opened',
  NPC_PINNED:                     'npc_pinned',

  // ── v2: editing ────────────────────────────────────────────────────────
  EDIT_DROPPED:                   'edit_dropped',
  CANON_PHASE_CHANGED:            'canon_phase_changed',
  CANON_EDIT_CHOICE_MADE:         'canon_edit_choice_made',
  NARRATIVE_DRIFT_MODAL_SHOWN:    'narrative_drift_modal_shown',
  NARRATIVE_DRIFT_DECISION:       'narrative_drift_decision',
  VERSION_RESTORED:               'version_restored',
  // Revealed preference: which in-world event TYPE a DM actually applied
  // (fired at the applyEvent commit; carries the event-type enum only).
  EVENT_EDIT_APPLIED:             'event_edit_applied',

  // ── v2: ai ─────────────────────────────────────────────────────────────
  AI_GENERATION_STARTED:          'ai_generation_started',
  AI_GENERATION_COMPLETED:        'ai_generation_completed',
  AI_GENERATION_FAILED:           'ai_generation_failed',
  AI_VERIFIER_REPORT:             'ai_verifier_report',
  NARRATIVE_VIEW_TOGGLED:         'narrative_view_toggled',
  AI_NARRATIVE_STALE_DETECTED:    'ai_narrative_stale_detected',
  CREDITS_SPENT:                  'credits_spent',

  // ── v2: campaign / world pulse ─────────────────────────────────────────
  WORLD_PULSE_PREVIEWED:          'world_pulse_previewed',
  WORLD_PULSE_ADVANCED:           'world_pulse_advanced',
  WORLD_PULSE_BLOCKED:            'world_pulse_blocked',
  WORLD_CANONIZED:                'world_canonized',
  WORLD_PULSE_PROPOSAL_APPLIED:   'world_pulse_proposal_applied',
  WORLD_PULSE_PROPOSAL_DISMISSED: 'world_pulse_proposal_dismissed',
  PARTY_IMPACT_RECORDED:          'party_impact_recorded',
  WORLD_STRESSOR_TRANSITIONS:     'world_stressor_transitions',  // research
  WIZARD_NEWS_PANEL_OPENED:       'wizard_news_panel_opened',
  SIMULATION_RULES_UPDATED:       'simulation_rules_updated',
  CHRONICLE_GENERATED:            'chronicle_generated',

  // ── v2: regional graph ─────────────────────────────────────────────────
  REGIONAL_CHANNEL_STATUS_CHANGED:'regional_channel_status_changed',
  REGIONAL_IMPACT_QUEUED:         'regional_impact_queued',
  REGIONAL_IMPACT_STATUS_CHANGED: 'regional_impact_status_changed',
  REGIONAL_GRAPH_SNAPSHOT:        'regional_graph_snapshot',     // research
  REGIONAL_ARC_EMERGED:           'regional_arc_emerged',
  REGIONAL_PROPAGATION_APPLIED:   'regional_propagation_applied',
  NEIGHBOUR_GENERATED:            'neighbour_generated',
  NEIGHBOUR_LINKED:               'neighbour_linked',

  // ── v2: map ────────────────────────────────────────────────────────────
  MAP_OPENED:                     'map_opened',
  MAP_PLACEMENT_ADDED:            'map_placement_added',
  MAP_PLACEMENT_REMOVED:          'map_placement_removed',
  MAP_ROUTE_DRAWN:                'map_route_drawn',
  MAP_SAVED:                      'map_saved',

  // ── SM-5: the TOWN-MAP legibility layer. ONE feature-discriminated event (the
  //    ai_stage_answer precedent — one name, not eight) carrying BOTH the map-
  //    GENERATION profile (feature:'render' — layoutVersion/siteKind/morphology/
  //    responseMode/lynchBand/retryCount/hasFabric) and LEGIBILITY ENGAGEMENT
  //    (feature ∈ provenance_hover|change_view|edge_labels|annotation_add|
  //    lens_switch|panorama; counts/enums/bands only). The post-launch fog +
  //    interior layers INHERIT this event with new `feature` values (no new names).
  //    Lens/style RADAR for AI style-compiles is already captured server-side
  //    (ai_stage_* feature:'styleOverhaul') — this is the distinct RENDER moment.
  TOWN_MAP_LAYER_USED:            'town_map_layer_used',
  // W-DOC (rev 11): the Welcome landing funnel — ONE feature-discriminated event
  // (the town_map_layer_used precedent): feature:'view' | 'fixture_forge'.
  LANDING_FUNNEL_USED:            'landing_funnel_used',

  // ── v2: sharing / export ───────────────────────────────────────────────
  PDF_EXPORT_COMPLETED:           'pdf_export_completed',
  FOUNDRY_EXPORT_COMPLETED:       'foundry_export_completed',
  GALLERY_PUBLISHED:              'gallery_published',
  GALLERY_UNPUBLISHED:            'gallery_unpublished',
  GALLERY_DOSSIER_VIEWED:         'gallery_dossier_viewed',
  GALLERY_ENGAGEMENT:             'gallery_engagement',
  GALLERY_IMPORTED:               'gallery_imported',

  // ── v2: library / revisit ──────────────────────────────────────────────
  SETTLEMENT_REOPENED:            'settlement_reopened',
  SETTLEMENT_DELETED:             'settlement_deleted',
  LIBRARY_VIEWED:                 'library_viewed',
  SESSION_STARTED:                'session_started',

  // ── v2: research / consent ─────────────────────────────────────────────
  SETTLEMENT_FINGERPRINT_CAPTURED:'settlement_fingerprint_captured',  // research
  CONSENT_UPDATED:                'consent_updated',

  // ── Surveyor S1: the analyst (§5 eval metrics — coarse, id-free, essential) ──
  // Props (never free text): { audience, coverageBand, registerPurityBand, refused,
  // sliceCount, byok }. coverageBand + registerPurityBand are the §3b/§5 quality
  // metrics, computed server-side from the answer — never from the §3f rider.
  AI_ANALYST_ANSWER:              'ai_analyst_answer',
  // Answer acceptance signal. Props: { accepted } (thumbs up/down on the answer).
  AI_ANALYST_FEEDBACK:            'ai_analyst_feedback',
  // Surveyor S1b §3f THE ENRICHMENT RIDER — the model's self-emitted, ID-FREE,
  // category-grade traffic tag, extracted SERVER-SIDE (condition-of-service layer,
  // managed AND BYOK, non-togglable). Props (controlled vocabulary + booleans ONLY,
  // never content): { intent, themes[], refusal_reason, action_drafted, oov, audience,
  // byok, refused }. INTEREST data only — never a quality metric (conflicted-witness).
  AI_ANALYST_RIDER:               'ai_analyst_rider',

  // ── Surveyor S3: the intent compiler (interpret) §5 evals — coarse, id-free ──
  // Props (never content): { opCount, requiredCount, inferredCount, optionalCount,
  // uncertainCount, protectedCount, unsupportedCount, coverageBand, refused, byok }.
  // coverageBand = the sourced-op rate (the interpret analog of citation coverage).
  AI_INTERPRET_ANSWER:            'ai_interpret_answer',
  // The §9 CORRECTION TYPOLOGY signal (now live — the compiler ships). Props (id-free,
  // enum only): { correctionClass } ∈ the six SURVEYOR_CLASSES. One per corrected op;
  // the "correction-rate for interpret" eval. INTEREST data — never a quality gate.
  AI_INTERPRET_CORRECTION:        'ai_interpret_correction',
  // §3f THE ENRICHMENT RIDER for interpret — the model's ID-FREE, category-grade traffic
  // tag, extracted SERVER-SIDE (condition-of-service, managed AND BYOK). Same controlled
  // vocabulary + conflicted-witness rule as the analyst rider.
  AI_INTERPRET_RIDER:             'ai_interpret_rider',

  // ── Surveyor S3: THE PARLEY (parley) §5 evals — coarse, id-free ──────────────
  // Props (never content): { entityClass, groundingCoverageBand, registerPurityBand,
  // refused, byok }. groundingCoverageBand = the fraction of the persona's claims
  // grounded in its own belief slice (the epistemic-fidelity eval).
  AI_PARLEY_ANSWER:               'ai_parley_answer',
  // §3f THE ENRICHMENT RIDER for the parley (ID-FREE, condition-of-service). The rider
  // also tags entity-class + topic-class so the atlas learns what tables rehearse.
  AI_PARLEY_RIDER:                'ai_parley_rider',

  // ── Surveyor S4–S6: the WRITE stages (custom content, style overhaul, construct
  //    settlement, construct realm) §5 evals — coarse, id-free. ONE shared answer/rider
  //    pair for all four stages, discriminated by props.feature (eager-frugal: the
  //    AI-surface ~0-eager rule + the shared closure margin — two names, not eight).
  // Props (never content): { feature, stage, total, mechanicalCount, flavorCount,
  // unsupportedCount, deviationCount, coverageBand, refused, byok, earlyAccess }.
  // feature ∈ {customContent, styleOverhaul, constructSettlement, constructRealm}.
  AI_STAGE_ANSWER:                'ai_stage_answer',
  // §3f THE ENRICHMENT RIDER for the S4–S6 write stages (ID-FREE, condition-of-service,
  // managed AND BYOK). Same controlled vocabulary + conflicted-witness rule as S1/S3;
  // carries props.feature + the style-domain vocabulary (base lens, palette family,
  // motif class, oov) when feature = styleOverhaul (the §3f/§4b lens roadmap radar).
  AI_STAGE_RIDER:                 'ai_stage_rider',

  // ── VISION WAVE adoption signal — the ONE id-free verdict event shared by the
  //    new surfaces (Interview / Oracle / Corpus Factory / Interpret review),
  //    discriminated by props (eager-frugal: one name, not one per surface). The
  //    S4+ tuning-knobs decision reads acceptance metrics from here. Props (never
  //    content, never an id): { surface, verdict }.
  //    surface ∈ {interview, oracle, corpus, interpret}; verdict ∈
  //    {answered, refused, accepted, declined, revised, drawn}.
  SURVEYOR_ADOPTION:              'surveyor_adoption',
});

/**
 * The four research-class events (doc §8). Everything else is essential.
 * Research-class events require explicit `research` consent: they are never
 * built client-side without it, never mirrored to a third-party provider, and
 * clamped again server-side.
 */
export const RESEARCH_EVENT_KEYS = Object.freeze([
  'GENERATION_STEP_TIMINGS',
  'WORLD_STRESSOR_TRANSITIONS',
  'REGIONAL_GRAPH_SNAPSHOT',
  'SETTLEMENT_FINGERPRINT_CAPTURED',
]);

const _research = new Set(RESEARCH_EVENT_KEYS);

/** { CONSTANT: 'essential' | 'research' } — keys are 1:1 with EVENTS (test-pinned). */
export const EVENT_CLASS = Object.freeze(
  Object.fromEntries(Object.keys(EVENTS).map(k => [k, _research.has(k) ? 'research' : 'essential'])),
);

/** Resolve the class for an event NAME ('homepage_view') or CONSTANT. */
export function classForEvent(eventName) {
  for (const [k, v] of Object.entries(EVENTS)) {
    if (v === eventName) return EVENT_CLASS[k];
  }
  return EVENT_CLASS[eventName] || null; // allow passing the CONSTANT directly
}

/** Validate an event name against the wire contract. */
export const EVENT_NAME_RE = /^[a-z][a-z0-9_]{2,63}$/;
