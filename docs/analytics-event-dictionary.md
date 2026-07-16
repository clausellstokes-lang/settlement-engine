# Analytics Event Dictionary (generated)

<!-- GENERATED FILE — DO NOT EDIT BY HAND.
     Source of truth: src/lib/analyticsEvents.js (event spine) + the enrichment
     extractors (spatialUsage / constructionUsage / pulseFingerprint / spatialCanonizeUsage,
     run on fixtures for the prop keys). Regenerate: npm run gen:analytics-dictionary.
     Drift-guarded by tests/docs/analyticsDictionaryFreshness.test.js. -->

The machine-truth companion to the design narrative in
[analytics-event-taxonomy.md](./analytics-event-taxonomy.md) (triggers, questions,
instrumentation map live there — this file is the complete, current event surface).

**Contract:** every event name satisfies `^[a-z][a-z0-9_]{2,63}$`, is a frozen constant
in `src/lib/analyticsEvents.js`, and carries a class in the parallel `EVENT_CLASS` map.
Props are coarse by construction — enums, bands, counts, booleans, hashes; never names,
prose, seeds, or free text (the inverse-sanitizer discipline + server-side clamps).

- **EVENTS_REV:** 7
- **Events:** 118 total — 114 essential, 4 research
- **Research class** requires explicit opt-in (built + mirrored only under `research` consent, re-clamped server-side).
- **Enriched props** below are the actual top-level keys the bound extractor emits (code-derived); events built inline at the call site show `—` and are documented in the taxonomy.

## Minimum 4-event funnel

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `HOMEPAGE_VIEW` | `homepage_view` | essential | — |
| `ANONYMOUS_GENERATION_COMPLETED` | `anonymous_generation_completed` | essential | — |
| `SIGNUP_AFTER_ANON` | `signup_after_anon` | essential | — |
| `PAID_AFTER_ANON` | `paid_after_anon` | essential | — |

## Full schema

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `ANONYMOUS_GENERATION_STARTED` | `anonymous_generation_started` | essential | — |
| `DOSSIER_PREVIEW_VIEWED` | `dossier_preview_viewed` | essential | — |
| `HOW_SIMULATED_OPENED` | `how_simulated_opened` | essential | — |
| `SIGNUP_GATE_SEEN` | `signup_gate_seen` | essential | — |
| `SIGNUP_STARTED` | `signup_started` | essential | — |
| `SIGNUP_COMPLETED` | `signup_completed` | essential | — |
| `SETTLEMENT_SAVED` | `settlement_saved` | essential | — |
| `PDF_EXPORT_CLICKED` | `pdf_export_clicked` | essential | — |
| `SINGLE_DOSSIER_CHECKOUT_STARTED` | `single_dossier_checkout_started` | essential | — |
| `SINGLE_DOSSIER_PURCHASED` | `single_dossier_purchased` | essential | — |
| `PREMIUM_MODAL_SEEN` | `premium_modal_seen` | essential | — |
| `PREMIUM_CHECKOUT_STARTED` | `premium_checkout_started` | essential | — |
| `PREMIUM_PURCHASED` | `premium_purchased` | essential | — |
| `AI_NARRATIVE_CLICKED` | `ai_narrative_clicked` | essential | — |
| `AI_NARRATIVE_COMPLETED` | `ai_narrative_completed` | essential | — |
| `CREDITS_EXHAUSTED` | `credits_exhausted` | essential | — |
| `NEIGHBOR_PREVIEW_CLICKED` | `neighbor_preview_clicked` | essential | — |
| `UPGRADE_AFTER_NEIGHBOR_CLICKED` | `upgrade_after_neighbor_clicked` | essential | — |

## Critique-implementation expansion

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `WOW_REVEAL_SHOWN` | `wow_reveal_shown` | essential | — |
| `WOW_REVEAL_COMPLETED` | `wow_reveal_completed` | essential | — |
| `SAVE_BUTTON_CLICKED` | `save_button_clicked` | essential | — |
| `SAVE_SIGNUP_INTENT_OPENED` | `save_signup_intent_opened` | essential | — |
| `SAVE_SIGNUP_INTENT_FULFILLED` | `save_signup_intent_fulfilled` | essential | — |
| `PRICING_MOMENT_SHOWN` | `pricing_moment_shown` | essential | — |
| `PRICING_MOMENT_CLICKED` | `pricing_moment_clicked` | essential | — |
| `PRICING_MOMENT_DISMISSED` | `pricing_moment_dismissed` | essential | — |
| `WELCOME_CREDIT_GRANTED` | `welcome_credit_granted` | essential | — |
| `WELCOME_CREDIT_SPENT` | `welcome_credit_spent` | essential | — |
| `ANON_CAP_UNLOCK_SHOWN` | `anon_cap_unlock_shown` | essential | — |
| `ANON_CAP_UNLOCK_CLICKED` | `anon_cap_unlock_clicked` | essential | — |
| `LOCKED_DESTINATION_SHOWN` | `locked_destination_shown` | essential | — |
| `DOSSIER_GROUP_TAB_CLICKED` | `dossier_group_tab_clicked` | essential | — |
| `SIMULATION_DRAWER_OPENED` | `simulation_drawer_opened` | essential | — |
| `EDIT_MODE_TOGGLED` | `edit_mode_toggled` | essential | — |
| `EDIT_PENDING_QUEUED` | `edit_pending_queued` | essential | — |
| `EDIT_CASCADE_PREVIEWED` | `edit_cascade_previewed` | essential | — |
| `EDIT_COMMITTED` | `edit_committed` | essential | — |
| `EDIT_REVERTED` | `edit_reverted` | essential | — |
| `WORKSHOP_OPENED` | `workshop_opened` | essential | — |
| `WORKSHOP_LOCKED_SHOWN` | `workshop_locked_shown` | essential | — |
| `MAP_ROUTES_MODE_ENTERED` | `map_routes_mode_entered` | essential | — |
| `MAP_DROP_PREVIEW_SHOWN` | `map_drop_preview_shown` | essential | — |
| `RETURN_VISIT_DETECTED` | `return_visit_detected` | essential | — |
| `WELCOME_BACK_OPEN_CLICKED` | `welcome_back_open_clicked` | essential | — |
| `FOUNDER_TILE_SHOWN` | `founder_tile_shown` | essential | — |
| `FOUNDER_TILE_CLICKED` | `founder_tile_clicked` | essential | — |
| `HELP_POPOVER_OPENED` | `help_popover_opened` | essential | — |
| `COMPENDIUM_SEARCH` | `compendium_search` | essential | — |

## v2 taxonomy: generation

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `GENERATION_STARTED` | `generation_started` | essential | — |
| `GENERATION_COMPLETED` | `generation_completed` | essential | `config_archetype` |
| `GENERATION_FAILED` | `generation_failed` | essential | — |
| `GENERATION_STEP_TIMINGS` | `generation_step_timings` | research | — |
| `WIZARD_STEP_VIEWED` | `wizard_step_viewed` | essential | — |
| `WIZARD_ABANDONED` | `wizard_abandoned` | essential | — |
| `REGENERATION_TRIGGERED` | `regeneration_triggered` | essential | — |
| `GENERATION_MILESTONE` | `generation_milestone` | essential | — |

## v2: dossier reading

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `DOSSIER_TAB_VIEWED` | `dossier_tab_viewed` | essential | — |
| `DOSSIER_SECTION_DWELL` | `dossier_section_dwell` | essential | — |
| `DOSSIER_READ_SESSION_SUMMARY` | `dossier_read_session_summary` | essential | — |
| `CAUSAL_EXPLANATION_OPENED` | `causal_explanation_opened` | essential | — |
| `PIPELINE_RAIL_STEP_INSPECTED` | `pipeline_rail_step_inspected` | essential | — |
| `COMPENDIUM_ENTRY_OPENED` | `compendium_entry_opened` | essential | — |
| `NPC_PINNED` | `npc_pinned` | essential | — |

## v2: editing

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `EDIT_DROPPED` | `edit_dropped` | essential | — |
| `CANON_PHASE_CHANGED` | `canon_phase_changed` | essential | — |
| `CANON_EDIT_CHOICE_MADE` | `canon_edit_choice_made` | essential | — |
| `NARRATIVE_DRIFT_MODAL_SHOWN` | `narrative_drift_modal_shown` | essential | — |
| `NARRATIVE_DRIFT_DECISION` | `narrative_drift_decision` | essential | — |
| `VERSION_RESTORED` | `version_restored` | essential | — |
| `EVENT_EDIT_APPLIED` | `event_edit_applied` | essential | — |

## v2: ai

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `AI_GENERATION_STARTED` | `ai_generation_started` | essential | — |
| `AI_GENERATION_COMPLETED` | `ai_generation_completed` | essential | — |
| `AI_GENERATION_FAILED` | `ai_generation_failed` | essential | — |
| `AI_VERIFIER_REPORT` | `ai_verifier_report` | essential | — |
| `NARRATIVE_VIEW_TOGGLED` | `narrative_view_toggled` | essential | — |
| `AI_NARRATIVE_STALE_DETECTED` | `ai_narrative_stale_detected` | essential | — |
| `CREDITS_SPENT` | `credits_spent` | essential | — |

## v2: campaign / world pulse

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `WORLD_PULSE_PREVIEWED` | `world_pulse_previewed` | essential | — |
| `WORLD_PULSE_ADVANCED` | `world_pulse_advanced` | essential | `auto_applied_count` · `auto_vs_proposal` · `candidate_count` · `corruption_event_count` · `effect_family_counts` · `events_applied_count` · `faction_capture_by_transition` · `faction_capture_transition_count` · `graduated_stressor_count` · `interval` · `migration_pop_band` · `mover_counts` · `movers_active` · `new_stressor_count` · `npc_corruption_by_kind` · `proposal_count` · `resolved_stressor_count` · `selected_count` · `sim_config` · `spatial_active` · `spatial_canon_version` · `tick_after` |
| `WORLD_PULSE_BLOCKED` | `world_pulse_blocked` | essential | — |
| `WORLD_CANONIZED` | `world_canonized` | essential | `cost_law_version` · `digest_bytes_band` · `geometry_version` · `has_sea_lanes` · `has_seasonal` · `has_teleport` · `is_recanonize` · `overlay_version` · `settlement_count` · `settlement_count_band` · `spatial` · `spatial_canon_version` · `tier_mix` · `topology_class` |
| `WORLD_PULSE_PROPOSAL_APPLIED` | `world_pulse_proposal_applied` | essential | `proposal_type` · `resolution` · `rule_family` · `severity_band` · `stressor_type` · `subject_kind` · `tier_direction` |
| `WORLD_PULSE_PROPOSAL_DISMISSED` | `world_pulse_proposal_dismissed` | essential | `proposal_type` · `resolution` · `rule_family` · `severity_band` · `stressor_type` · `subject_kind` · `tier_direction` |
| `PARTY_IMPACT_RECORDED` | `party_impact_recorded` | essential | `action_kind` · `magnitude_band` · `resulting_outcome_count` · `target_kind` |
| `WORLD_STRESSOR_TRANSITIONS` | `world_stressor_transitions` | research | `auto_births` · `births_by_type` · `escalations_by_type` · `interval` · `proposal_births` · `resolutions_by_type` · `spreads_by_type` · `tick` |
| `WIZARD_NEWS_PANEL_OPENED` | `wizard_news_panel_opened` | essential | — |
| `SIMULATION_RULES_UPDATED` | `simulation_rules_updated` | essential | — |
| `CHRONICLE_GENERATED` | `chronicle_generated` | essential | — |

## v2: regional graph

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `REGIONAL_CHANNEL_STATUS_CHANGED` | `regional_channel_status_changed` | essential | — |
| `REGIONAL_IMPACT_QUEUED` | `regional_impact_queued` | essential | — |
| `REGIONAL_IMPACT_STATUS_CHANGED` | `regional_impact_status_changed` | essential | — |
| `REGIONAL_GRAPH_SNAPSHOT` | `regional_graph_snapshot` | research | — |
| `REGIONAL_ARC_EMERGED` | `regional_arc_emerged` | essential | — |
| `REGIONAL_PROPAGATION_APPLIED` | `regional_propagation_applied` | essential | — |
| `NEIGHBOUR_GENERATED` | `neighbour_generated` | essential | — |
| `NEIGHBOUR_LINKED` | `neighbour_linked` | essential | — |

## v2: map

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `MAP_OPENED` | `map_opened` | essential | — |
| `MAP_PLACEMENT_ADDED` | `map_placement_added` | essential | — |
| `MAP_PLACEMENT_REMOVED` | `map_placement_removed` | essential | — |
| `MAP_ROUTE_DRAWN` | `map_route_drawn` | essential | — |
| `MAP_SAVED` | `map_saved` | essential | — |

## v2: sharing / export

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `PDF_EXPORT_COMPLETED` | `pdf_export_completed` | essential | — |
| `FOUNDRY_EXPORT_COMPLETED` | `foundry_export_completed` | essential | — |
| `GALLERY_PUBLISHED` | `gallery_published` | essential | — |
| `GALLERY_UNPUBLISHED` | `gallery_unpublished` | essential | — |
| `GALLERY_DOSSIER_VIEWED` | `gallery_dossier_viewed` | essential | — |
| `GALLERY_ENGAGEMENT` | `gallery_engagement` | essential | — |
| `GALLERY_IMPORTED` | `gallery_imported` | essential | — |

## v2: library / revisit

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `SETTLEMENT_REOPENED` | `settlement_reopened` | essential | — |
| `SETTLEMENT_DELETED` | `settlement_deleted` | essential | — |
| `LIBRARY_VIEWED` | `library_viewed` | essential | — |
| `SESSION_STARTED` | `session_started` | essential | — |

## v2: research / consent

| Constant | Event | Class | Enriched props (code-derived) |
|---|---|---|---|
| `SETTLEMENT_FINGERPRINT_CAPTURED` | `settlement_fingerprint_captured` | research | — |
| `CONSENT_UPDATED` | `consent_updated` | essential | — |

---

_Generated from the registry + enrichment extractors. If this file is stale the
freshness test fails — run `npm run gen:analytics-dictionary` to update._
