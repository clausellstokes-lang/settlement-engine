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

## M8 — Town-map legibility engagement + generation profile

- **Question:** Which town-map legibility surfaces do users actually engage (provenance
  hover, change view, edge annotations, DM markers, the accessibility lens, panorama),
  and what is the distribution of the generated map profiles (layout version, site kind,
  morphology, response mode, Lynch band)? One feature-discriminated event carries both —
  `feature`=`render` is the generation profile, the other features are engagement.
- **Source events:** `town_map_layer_used`
- **Denominator:** map renders (`town_map_layer_used` with feature=`render`).
- **Cell grid:** feature × layoutVersion × morphology × responseMode (render side); feature × lens (engagement side).
- **Suppression floor:** 50 renders per cell.
- **Stage:** pre-launch — a single feature-discriminated event, measurable on synthetic/dogfood renders.
- **Min-n floor:** 50 renders per cell.
- **Method:** rate.

## M9 — World-canon → first advance activation

- **Question:** Of campaigns whose world is canonized, how many reach a first
  successful advance, and how long does that take?
- **Source events:** `world_canonized`, `world_pulse_advanced`, `world_pulse_blocked`
- **Denominator:** distinct campaign subjects with `world_canonized`.
- **Cell grid:** canonization week-cohort × settlement_count band × simulation preset.
- **Suppression floor:** 25 campaigns per cell.
- **Stage:** at-launch — requires real campaign subjects and elapsed time.
- **Min-n floor:** 25 campaigns per cell.
- **Method:** funnel-conversion. Join canonization to the first later advance on
  `subject_id`; blocked attempts describe friction but do not count as activation.

## M10 — Consecutive-week canonical-world use

- **Question:** Do campaigns become a recurring preparation habit after their first
  advance?
- **Source events:** `world_pulse_advanced`, `settlement_reopened`, `session_started`
- **Denominator:** distinct campaign subjects that completed a first
  `world_pulse_advanced`.
- **Cell grid:** first-advance week-cohort × simulation preset × settlement_count band.
- **Suppression floor:** 25 campaigns per cell.
- **Stage:** post-launch — the two-, four-, and eight-consecutive-week windows need
  real elapsed time.
- **Min-n floor:** 25 campaigns per cell.
- **Method:** rate. The primary numerator is campaign subjects advancing in each
  consecutive ISO week. Reopen/session events are supporting return context, not a
  substitute for advancement.

## M11 — Advance → attention → decision

- **Question:** After a world advances, can a DM find the current brief and decide a
  proposed consequence without abandoning the loop?
- **Source events:** `world_pulse_advanced`, `wizard_news_panel_opened`, `world_pulse_proposal_applied`, `world_pulse_proposal_dismissed`
- **Denominator:** campaign advances that produced at least one pending proposal.
- **Cell grid:** proposal_type × severity band × settlement_count band × simulation preset.
- **Suppression floor:** 25 advances per cell.
- **Stage:** at-launch — needs task-shaped campaign traffic.
- **Min-n floor:** 25 advances per cell.
- **Method:** funnel-conversion. Join on campaign `subject_id`; report time to first
  brief open, time to terminal decision, and no-decision within the observation
  window. Applied and dismissed are both completed decisions.

## M12 — Surveyor interpret adoption and correction

- **Question:** Which proposed operation classes do DMs accept, revise, or reject,
  and what kind of correction is required?
- **Source events:** `ai_interpret_answer`, `ai_interpret_correction`, `surveyor_adoption`
- **Denominator:** interpret answers that were not refused and proposed at least one
  operation.
- **Cell grid:** coverage band × BYOK/managed × adoption verdict × correction class.
- **Suppression floor:** 50 interpreted sessions per cell.
- **Stage:** at-launch — synthetic traffic can test plumbing, not acceptance.
- **Min-n floor:** 50 interpreted sessions per cell.
- **Method:** rate. `ai_interpret_answer` and correction rows remain content-free and
  aggregate; `surveyor_adoption` supplies the reviewed-session verdict. This metric
  evaluates the interface, never the enrichment rider as a quality oracle.

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
- `ai_analyst_answer`, `ai_analyst_feedback` — **awaiting-metric**: the Surveyor S1 §5 evals (citation coverage, register purity, refusal rate + quality, answer acceptance); formalize into a named metric when the analyst launches.
- `ai_analyst_rider` — **awaiting-metric**: the §3f ID-FREE enrichment rider (intent / theme / refusal-reason interest distributions, emitted server-side as a condition-of-service); a theme/intent-mix metric formalizes at launch. INTEREST data only — never a quality gate (the conflicted-witness rule).
- `ai_interpret_rider` — **research-plane**: content-free interest tags only; never
  a quality signal (the conflicted-witness rule). Interpret answer, correction, and
  adoption events now power M12.
- `ai_parley_answer`, `ai_parley_rider` — **awaiting-metric**: the Surveyor S3 parley evals (entity-class mix, grounding coverage = epistemic fidelity, register purity, the §3f rider tagging entity + topic class); formalize into a named metric when the parley launches.
- `ai_stage_answer`, `ai_stage_rider` — **awaiting-metric**: the Surveyor S4–S6 WRITE-stage evals (one shared answer/rider pair, feature-discriminated: custom-content / style-overhaul / construct-settlement / construct-realm). The answer event carries the §5 acceptance signals (mechanical-mapping rate, unsupported count, config-key/constraint counts, style-domain lens-radar tags, the token-budget anomaly flag); the rider is the §3f ID-FREE enrichment (INTEREST data only — the conflicted-witness rule). Formalize into named metrics when the stages launch.
- `npc_pinned`, `edit_dropped`, `canon_phase_changed`, `canon_edit_choice_made`
- `narrative_drift_modal_shown`, `narrative_drift_decision`, `version_restored`, `event_edit_applied`
- `ai_generation_started`, `ai_generation_completed`, `ai_generation_failed`, `ai_verifier_report`
- `narrative_view_toggled`, `ai_narrative_stale_detected`, `credits_spent`, `world_pulse_previewed`
- `world_pulse_previewed`, `party_impact_recorded`, `world_stressor_transitions`
- `simulation_rules_updated`, `chronicle_generated`, `regional_channel_status_changed`, `regional_impact_queued`
- `regional_impact_status_changed`, `regional_graph_snapshot`, `regional_arc_emerged`, `regional_propagation_applied`
- `neighbour_generated`, `neighbour_linked`, `map_opened`, `map_placement_added`
- `map_placement_removed`, `map_route_drawn`, `map_saved`, `pdf_export_completed`
- `foundry_export_completed`
- `gallery_published`, `gallery_unpublished`, `gallery_dossier_viewed`, `gallery_engagement`
- `gallery_imported`, `settlement_deleted`, `library_viewed`
- `settlement_fingerprint_captured`, `consent_updated`
- `landing_funnel_used` — **funnel-leg** (W-DOC): the Welcome landing's ONE
  feature-discriminated event (feature=`view` once per session · `fixture_forge`,
  the determinism-replay click). The landing leg of the funnel already measured
  transitively by the homepage/anon-generation metrics; promote to a named
  landing-conversion metric when the documentation wave's four pages ship.
