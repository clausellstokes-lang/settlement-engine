# Metrics Registry

**Status:** ACTIVE — companion to [analytics-event-taxonomy.md](./analytics-event-taxonomy.md).
Pinned by `tests/docs/metricsRegistry.test.js`.

Every metric below is a standing question the product must be able to answer from
the analytics sink. Each declares, in a machine-checkable shape:

- **Question** — the decision it informs.
- **Source events** — the `EVENTS.*` names it reads (must all exist; the pin fails
  on a typo or a deleted event).
- **Denominator** — what the numerator is divided by (the honest base).
- **Cell grid** — the dimensions it is broken down by (the GROUP BY).
- **Suppression floor** — the minimum cell size shown; smaller cells are hidden so
  a rate can't re-identify a handful of users.
- **Stage** — the activation stage at which the metric goes live and becomes
  trustworthy: `pre-launch` (measurable now against synthetic/dogfood corpora),
  `at-launch`, or `post-launch` (per [PHASE6_DATA_LIFECYCLE.md](./PHASE6_DATA_LIFECYCLE.md) §2).
- **Min-n floor** — the per-cell sample floor below which the metric renders
  "insufficient n" (the statistical guard behind every read; §5). Distinct in
  intent from the display suppression floor above, though they coincide
  numerically today.
- **Method** — how the number is computed: `funnel-conversion` (distinct actors
  advancing between events) or `rate` (occurrences ÷ denominator within the cell).

The pin also enforces COVERAGE: every event in `EVENTS` is either a **Source
event** of some metric here or listed under **Exempt events** with a rationale.
Adding an event forces a choice — wire a metric, or mark it exempt. No event may
silently exist without a stated analytical purpose. This is the enforcement-claims
philosophy (a claim you can't drift from) applied to the metrics layer.

---

## M1 — Cap-hit → sign-in conversion

- **Question:** When an anonymous user hits the generation cap, do they sign in?
- **Source events:** `anon_cap_unlock_shown`, `anon_cap_unlock_clicked`, `signup_started`, `signup_completed`
- **Denominator:** distinct anonymous actors who saw `anon_cap_unlock_shown`.
- **Cell grid:** day-cohort × entry_route_kind × `is_return`.
- **Suppression floor:** 25 actors per cell.
- **Stage:** at-launch — needs real anonymous traffic; rehearsable pre-launch on synthetic/dogfood.
- **Min-n floor:** 25 actors per cell.
- **Method:** funnel-conversion.

## M2 — Sign-in → first-save activation

- **Question:** Of users who sign in, how many save their first settlement — and
  how fast?
- **Source events:** `signup_completed`, `settlement_saved`, `generation_milestone`
- **Denominator:** actors with a `signup_completed`.
- **Cell grid:** day-cohort × tier-of-first-save × day-gap band (signin→first save).
  The `generation_milestone` (milestone=`save`) fingerprint cells first-save shape.
- **Suppression floor:** 25 actors per cell.
- **Stage:** at-launch — needs real signed-in cohorts; rehearsable pre-launch on synthetic/dogfood.
- **Min-n floor:** 25 actors per cell.
- **Method:** funnel-conversion.

## M3 — First-narrate → pack purchase

- **Question:** Does narrating for the first time lead to a credit-pack / premium
  purchase?
- **Source events:** `ai_narrative_completed`, `premium_purchased`, `single_dossier_purchased`
- **Denominator:** actors with a first `ai_narrative_completed`.
- **Cell grid:** day-cohort × credits_remaining_band-at-first-narrate × tier.
- **Suppression floor:** 25 actors per cell.
- **Stage:** at-launch — depends on real purchase behaviour after a first narrate.
- **Min-n floor:** 25 actors per cell.
- **Method:** funnel-conversion.

## M4 — Locked-destination → checkout

- **Question:** When a locked destination is surfaced, does it drive a checkout?
- **Source events:** `locked_destination_shown`, `premium_checkout_started`, `single_dossier_checkout_started`
- **Denominator:** actors who saw `locked_destination_shown`.
- **Cell grid:** destination_kind × tier × day-cohort.
- **Suppression floor:** 25 actors per cell.
- **Stage:** at-launch — the checkout leg needs real paying traffic.
- **Min-n floor:** 25 actors per cell.
- **Method:** funnel-conversion.

## M5 — Reroll rate by fingerprint cell

- **Question:** Which structural fingerprints get rerolled most (a
  dissatisfaction signal by generated shape)?
- **Source events:** `regeneration_triggered`, `generation_completed`, `generation_milestone`
- **Denominator:** generations in the cell (`generation_completed`, or
  `generation_milestone` milestone=`generate`).
- **Cell grid:** tier × terrain_class × prosperity band × hook_count_band
  (the coarse `generation_milestone` fingerprint), reroll counted from
  `regeneration_triggered`.
- **Suppression floor:** 50 generations per cell (structural cells are coarser).
- **Stage:** pre-launch — structural reroll needs only generation traffic (synthetic/dogfood suffices).
- **Min-n floor:** 50 generations per cell.
- **Method:** rate.

## M6 — Abandonment by config

- **Question:** Which configurations get generated but abandoned (never saved)?
  Derived server-side by joining milestones on `generation_id` — a `generate`
  with no later `save` within the window is an abandonment. No beacon required.
- **Source events:** `generation_milestone`, `wizard_abandoned`
- **Denominator:** generations (`generation_milestone` milestone=`generate`).
- **Cell grid:** tier × terrain_class × stress_types × coherence flags.
- **Suppression floor:** 50 generations per cell.
- **Stage:** pre-launch — abandonment is a generation-side join, measurable on synthetic/dogfood.
- **Min-n floor:** 50 generations per cell.
- **Method:** rate.

## M7 — Pricing-moment effectiveness

- **Question:** Which pricing moments earn clicks vs. dismissals?
- **Source events:** `pricing_moment_shown`, `pricing_moment_clicked`, `pricing_moment_dismissed`
- **Denominator:** `pricing_moment_shown` for the moment kind.
- **Cell grid:** moment_reason × tier × day-cohort.
- **Suppression floor:** 25 actors per cell.
- **Stage:** at-launch — pricing-moment engagement needs live pricing surfaces in front of real users.
- **Min-n floor:** 25 actors per cell.
- **Method:** rate.

---

## Exempt events

Events that exist in `EVENTS` but do not yet power a named metric above. They are
still captured (funnel continuity, research plane, or awaiting a metric), and are
listed here so the coverage pin stays honest — a new event cannot hide. Promote
one into a metric by moving it to a **Source events** line; the pin follows.

Rationale categories: **funnel-leg** (a step already covered transitively by a
funnel metric), **research-plane** (feeds the research sink / fingerprint chains,
not a product funnel), **diagnostic** (health/latency/failure taxonomy), and
**awaiting-metric** (instrumented, metric not yet authored).

- `homepage_view`, `anonymous_generation_completed`, `signup_after_anon`, `paid_after_anon`
- `anonymous_generation_started`, `dossier_preview_viewed`, `how_simulated_opened`, `signup_gate_seen`
- `pdf_export_clicked`, `premium_modal_seen`, `ai_narrative_clicked`, `credits_exhausted`
- `neighbor_preview_clicked`, `upgrade_after_neighbor_clicked`, `wow_reveal_shown`, `wow_reveal_completed`
- `save_button_clicked`, `save_signup_intent_opened`, `save_signup_intent_fulfilled`, `welcome_credit_granted`
- `welcome_credit_spent`, `dossier_group_tab_clicked`, `simulation_drawer_opened`, `edit_mode_toggled`
- `edit_pending_queued`, `edit_cascade_previewed`, `edit_committed`, `edit_reverted`
- `workshop_opened`, `workshop_locked_shown`, `map_routes_mode_entered`, `map_drop_preview_shown`
- `return_visit_detected`, `welcome_back_open_clicked`, `founder_tile_shown`, `founder_tile_clicked`
- `help_popover_opened`, `compendium_search`, `generation_started`, `generation_failed`
- `generation_step_timings`, `wizard_step_viewed`, `dossier_tab_viewed`, `dossier_section_dwell`
- `dossier_read_session_summary`, `causal_explanation_opened`, `pipeline_rail_step_inspected`, `compendium_entry_opened`
- `npc_pinned`, `edit_dropped`, `canon_phase_changed`, `canon_edit_choice_made`
- `narrative_drift_modal_shown`, `narrative_drift_decision`, `version_restored`, `event_edit_applied`
- `ai_generation_started`, `ai_generation_completed`, `ai_generation_failed`, `ai_verifier_report`
- `narrative_view_toggled`, `ai_narrative_stale_detected`, `credits_spent`, `world_pulse_previewed`
- `world_pulse_advanced`, `world_pulse_blocked`, `world_canonized`, `world_pulse_proposal_applied`
- `world_pulse_proposal_dismissed`, `party_impact_recorded`, `world_stressor_transitions`, `wizard_news_panel_opened`
- `simulation_rules_updated`, `chronicle_generated`, `regional_channel_status_changed`, `regional_impact_queued`
- `regional_impact_status_changed`, `regional_graph_snapshot`, `regional_arc_emerged`, `regional_propagation_applied`
- `neighbour_generated`, `neighbour_linked`, `map_opened`, `map_placement_added`
- `map_placement_removed`, `map_route_drawn`, `map_saved`, `pdf_export_completed`
- `foundry_export_completed`
- `gallery_published`, `gallery_unpublished`, `gallery_dossier_viewed`, `gallery_engagement`
- `gallery_imported`, `settlement_reopened`, `settlement_deleted`, `library_viewed`
- `session_started`, `settlement_fingerprint_captured`, `consent_updated`
