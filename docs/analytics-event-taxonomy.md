# Analytics Event Taxonomy v2

**Status:** PROPOSED — companion to [simulation-intelligence-layer.md](./simulation-intelligence-layer.md)
**Contract:** every event name must satisfy `^[a-z][a-z0-9_]{2,63}$`, be declared as a frozen
constant in `src/lib/analyticsEvents.js` (re-exported by `src/lib/analytics.js`), and carry a class
in the parallel frozen `EVENT_CLASS` map: `essential` | `research` (| `ai_prose` reserved, unused
in v1). The ESLint rule `funnel-event-contract` continues to forbid raw-string `track()` calls.

**Prop hygiene (applies to every table below):** props are coarse — enums, bands, counts, booleans,
hashes. Never names, never prose, never free text. Banned prop keys (enforced by the proposed
`analytics-props-hygiene` lint rule): `name, newName, text, prose, secret, description, notes,
email, body, label`.

## Banding vocabularies

| Vocabulary | Values |
|---|---|
| `duration_band` / `dwell_ms_band` | `lt_5s` · `5_15s` · `15_60s` · `1_5m` · `5_30m` · `gt_30m` |
| day-gap bands | `same_day` · `1_3d` · `4_7d` · `8_30d` · `gt_30d` |
| `population_band` | `hamlet_lt100` · `village_100_500` · `small_town_500_2k` · `town_2k_10k` · `city_gt_10k` |
| `credits_remaining_band` | `zero` · `1_5` · `6_20` · `gt_20` |
| causal bands (`CAUSAL_BANDS`, `src/domain/causalState.js:89`) | `surplus` · `adequate` · `strained` · `critical` · `collapsed` |
| `power_band` / generic 5-band | quintile banding of the underlying 0–100 / raw score |

## Existing 41 events (unchanged names)

Defined at `src/lib/analytics.js:48-106`. All keep their names and remain `essential`-class:

`homepage_view`, `anonymous_generation_completed`, `signup_after_anon`, `paid_after_anon`,
`anonymous_generation_started`, `dossier_preview_viewed`, `how_simulated_opened`,
`signup_gate_seen`, `signup_started`, `signup_completed`, `settlement_saved`,
`pdf_export_clicked`, `single_dossier_checkout_started`, `single_dossier_purchased`,
`premium_modal_seen`, `premium_checkout_started`, `premium_purchased`, `ai_narrative_clicked`,
`ai_narrative_completed`, `credits_exhausted`, `neighbor_preview_clicked`,
`upgrade_after_neighbor_clicked`, `wow_reveal_shown`, `wow_reveal_completed`,
`save_button_clicked`, `save_signup_intent_opened`, `save_signup_intent_fulfilled`,
`pricing_moment_shown`, `pricing_moment_clicked`, `pricing_moment_dismissed`,
`welcome_credit_granted`, `welcome_credit_spent`, `anon_cap_unlock_shown`,
`locked_destination_shown`, `dossier_group_tab_clicked`, `simulation_drawer_opened`,
`edit_mode_toggled`, `edit_pending_queued`, `edit_cascade_previewed`, `edit_committed`,
`edit_reverted`, `workshop_opened`, `workshop_locked_shown`, `map_routes_mode_entered`,
`map_drop_preview_shown`, `return_visit_detected`, `welcome_back_open_clicked`,
`founder_tile_shown`, `founder_tile_clicked`, `help_popover_opened`, `ai_prompt_copied`,
`compendium_search`.

Six of these gain **extended props** (non-breaking — additive only); see §3 Editing and §9 Library.

---

## 1. `generation` namespace

| Constant | Event | Class | Trigger | Props | Question answered |
|---|---|---|---|---|---|
| `GENERATION_STARTED` | `generation_started` | essential | `src/components/GenerateWizard.jsx` generate handler; `src/components/HomeHero.jsx` instant path | `{ mode:'basic'\|'advanced'\|'hero_instant', tier, culture, terrain_type, trade_route_access, magic_level, monster_threat, stress_count, forced_institution_count, excluded_institution_count, has_trade_overrides, custom_seed }` (all from `settlement.config` enums) | which configs users actually pick; basic-vs-advanced adoption |
| `GENERATION_COMPLETED` | `generation_completed` | essential | settlementSlice generate action, after `runPipeline` resolves (beside existing `anonymous_generation_completed`) | `{ mode, tier, duration_ms, population_band, prosperity, stressor_count, condition_count, institution_count, npc_count, faction_count, conflict_count, content_hash }` **+ reduced fingerprint** (doc 1 §7) | generation health; output-shape distribution per config |
| `GENERATION_FAILED` | `generation_failed` | essential | catch around `runPipeline` | `{ mode, step_name, error_kind:'exception'\|'timeout'\|'validation' }` | which pipeline steps break |
| `GENERATION_STEP_TIMINGS` | `generation_step_timings` | **research** | `onStep` callback (`src/generators/pipeline.js:112`), accumulated, fired once post-completion | `{ tier, total_ms, steps:[{step, ms}] }` — step ids from `src/generators/steps/index.js` (`resolveConfig`…`assembleSettlement`, 15 steps) | per-step perf budget by tier |
| `WIZARD_STEP_VIEWED` | `wizard_step_viewed` | essential | `GenerateWizard.jsx` step transition (`wizardStep` effect; step ids `config\|institutions\|services\|trade`, lines 79–94) | `{ step_id, step_index, mode, direction:'next'\|'back' }` | where the advanced wizard leaks |
| `WIZARD_ABANDONED` | `wizard_abandoned` | essential | `GenerateWizard.jsx` unmount/pagehide with no generation this wizard session | `{ last_step_id, steps_visited_count, dwell_ms_band }` | wizard drop-off |
| `REGENERATION_TRIGGERED` | `regeneration_triggered` | essential | re-roll path (settlementSlice regenerate; `src/domain/regenerationMode.js` consumers) | `{ regen_mode, config_changed, changed_config_fields:['culture',…], generation_index_this_session }` | do users tweak config or re-roll blindly |

## 2. `dossier_reading` namespace

Tab ids/groups from `TAB_GROUPS` (`src/components/OutputContainer.jsx:78-83`): groups
`summary | systems | world | notes` over 18 tab ids (`overview, summary, plot_hooks, dm_compass,
services, economics, power, defense, resources, viability, relationships, daily_life, npcs,
history, neighbours, dm_notes, ai_notes, chronicle`).

| Constant | Event | Class | Trigger | Props | Question |
|---|---|---|---|---|---|
| `DOSSIER_TAB_VIEWED` | `dossier_tab_viewed` | essential | `OutputContainer.jsx` tab selection (beside existing `dossier_group_tab_clicked`) | `{ tab_id, group, via:'group_click'\|'tab_click'\|'auto_select', narrative_mode:'raw'\|'ai' }` | section popularity |
| `DOSSIER_SECTION_DWELL` | `dossier_section_dwell` | essential | new `src/hooks/useSectionDwell.js` (IntersectionObserver ≥50% + `document.visibilityState` guard; fires only if ≥2 s) | `{ tab_id, group, dwell_ms_band, narrative_mode, canon_phase }` | true engagement vs click-through |
| `DOSSIER_READ_SESSION_SUMMARY` | `dossier_read_session_summary` | essential | pagehide / settlement switch, from dwell aggregator | `{ tabs_viewed_count, groups_viewed:[gid], deepest_dwell_tab_id, total_dwell_ms_band, edit_mode_used }` | reading depth per visit |
| `CAUSAL_EXPLANATION_OPENED` | `causal_explanation_opened` | essential | "why is X strained" surfaces (SimulationDrawer detail rows / `src/domain/explanation.js` consumers) | `{ variable (one of 14 SYSTEM_VARIABLES), band (CAUSAL_BANDS), contributor_count }` | are causal explanations used; which variables confuse |
| `PIPELINE_RAIL_STEP_INSPECTED` | `pipeline_rail_step_inspected` | essential | `src/components/PipelineRail.jsx` step click | `{ step_name }` | does "how it was simulated" land |
| `COMPENDIUM_ENTRY_OPENED` | `compendium_entry_opened` | essential | `src/components/CompendiumPanel.jsx` entry click (complements `compendium_search`) | `{ category, via:'search'\|'browse'\|'crosslink' }` | docs coverage gaps |
| `NPC_PINNED` | `npc_pinned` | essential | pin handler feeding `aiSlice.pinnedNpcs` | `{ pinned_count_after, npc_role_category }` (role category enum — never name) | which NPC roles players care about |

## 3. `editing` namespace

Edit kinds are the verbatim `EDIT_KINDS` (`src/domain/pendingEdits.js:42-48`):
`rename-npc, rename-faction, rename-settlement, add-institution, remove-institution,
add-resource, remove-resource, add-stressor, remove-stressor, edit-prose`.
`target_category` per kind: institutions → `institutions[].category`; stressors → archetype id;
resources → resource category id; `rename-npc` → npc role category; `rename-faction` →
`powerStructure.factions[].category`; `edit-prose` → section/tab id. **Never names or text.**

**Extended props on existing events (additive):**

| Event (existing) | Fire site | Extended props |
|---|---|---|
| `edit_pending_queued` | `settlementSlice.js:250` (`queueEdit`, :241) | `{ kind, target_category, canon_phase:'draft'\|'preplay'\|'canon', queue_depth_after, tier }` |
| `edit_cascade_previewed` | `PendingChangesBar.jsx` | `{ count, narrative_impact:'none'\|'regenerate-needed'\|'progression-suggested', downstream_npcs, downstream_hooks, downstream_factions, downstream_linked_saves, warning_count, structural_count }` (from `previewCascade()`) |
| `edit_committed` | `PendingChangesBar.jsx` / `commitPendingEdits` (`settlementSlice.js:273`) | `{ count, kinds:[unique EDIT_KINDS], structural_count, rename_count, prose_count, canon_phase, narrative_stale (fingerprint ≠ aiSourceFingerprint), content_hash }` |
| `edit_reverted` | `PendingChangesBar.jsx` | `{ count, scope:'single'\|'all' }` |

**New events:**

| Constant | Event | Class | Trigger | Props | Question |
|---|---|---|---|---|---|
| `EDIT_DROPPED` | `edit_dropped` | essential | `dropEdit` call sites (PendingChangesBar row delete) | `{ kind, queue_depth_after }` | which edits users back out of pre-commit |
| `CANON_PHASE_CHANGED` | `canon_phase_changed` | essential | `campaignState.phase` mutation (canonize action; persisted via `saves.update`) | `{ from_phase, to_phase, committed_edit_count_total, days_since_created_band, has_ai_narrative }` | when drafts become canon; edit volume before canonization |
| `CANON_EDIT_CHOICE_MADE` | `canon_edit_choice_made` | essential | canon-phase modal (correction vs event) confirm | `{ choice:'correction'\|'event', edit_kind, target_category }` | retcon vs in-world-event preference |
| `NARRATIVE_DRIFT_MODAL_SHOWN` | `narrative_drift_modal_shown` | essential | `src/components/NarrativeDriftModal.jsx` mount | `{ change_class:'cosmetic'\|'structural'\|'seismic' (classifyChange), edits_since_narrative_count }` | how often edits invalidate AI prose |
| `NARRATIVE_DRIFT_DECISION` | `narrative_drift_decision` | essential | modal buttons | `{ choice:'regenerate'\|'revert'\|'dismiss', change_class }` | regenerate-vs-revert economics |
| `VERSION_RESTORED` | `version_restored` | essential | versionHistory restore handler (migration 016) | `{ versions_back, snapshot_kind, canon_phase }` | is version history a safety net or unused |

**Plus** (research plane, not via `track()`): on commit, for `research`-consented users, each
committed edit also emits a typed `edit_events` row through `researchCapture.js` —
`{ kind, target_kind, payload_redacted (per-kind allowlist), cascade, edit_seq, reverted }`.
The full edit *sequence* with ordering is the core research artifact.

## 4. `ai` namespace

Costs and types from the `generate-narrative` edge function: `narrative` 3cr / `daily_life` 4cr /
`progression` 5cr / `chronicle` 2cr (fast variants −1). Verifier counters verbatim from
`src/store/aiSlice.js:60-61`.

| Constant | Event | Class | Trigger | Props | Question |
|---|---|---|---|---|---|
| `AI_GENERATION_STARTED` | `ai_generation_started` | essential | `aiSlice.js` before each `generateNarrative(type,…)` call + chronicle path | `{ type:'narrative'\|'daily_life'\|'progression'\|'chronicle', fast_variant, credits_cost, credits_remaining_band, is_regeneration, edits_since_last_ai_count, minutes_since_generation_band, canon_phase, content_hash }` | **when users AI-polish relative to editing** (the timing dataset) |
| `AI_GENERATION_COMPLETED` | `ai_generation_completed` | essential | aiSlice success path (richer than existing `ai_narrative_completed`, which stays for funnel continuity) | `{ type, duration_band, partial_failure, failed_field_count }` | AI reliability/latency |
| `AI_GENERATION_FAILED` | `ai_generation_failed` | essential | aiSlice catch / `setAiError` | `{ type, error_kind:'credits'\|'network'\|'server'\|'aborted'\|'verifier_hard' }` | failure taxonomy |
| `AI_VERIFIER_REPORT` | `ai_verifier_report` | essential | `setAiSettlement` → verifier site (`aiSlice.js` ~:188) | `{ type, ok, invented, removed, renamed, contradicted, canon_changed, history_dropped, hard_violation_count }` | is the AI overlay drifting from canon |
| `NARRATIVE_VIEW_TOGGLED` | `narrative_view_toggled` | essential | `showNarrative` toggle in aiSlice | `{ to_mode:'raw'\|'ai', has_daily_life }` | do users read AI output after paying |
| `AI_NARRATIVE_STALE_DETECTED` | `ai_narrative_stale_detected` | essential | stale banner render (fingerprint mismatch vs `aiSourceFingerprint`), session-deduped via `useFunnelEvent` | `{ edits_since_count, change_class }` | drift pressure on the regenerate loop |
| `CREDITS_SPENT` | `credits_spent` | essential | `creditsSlice.spendCredits` chokepoint | `{ action_type, cost, remaining_band, lifetime_narrate_count_band }` | credit-burn shape (complements `credits_exhausted`) |

## 5. `campaign` / `world_pulse` namespace

All triggers in `src/store/campaignSlice.js` (line refs verified): `queueCampaignRegionalImpacts`
:600, `setRegionalImpactStatus` :615, `ignoreQueuedRegionalImpact` :630,
`previewCampaignWorldPulse` :655, `canonizeCampaignWorld` :674, `updateCampaignSimulationRules`
:690, `advanceCampaignWorld` :713, `applyWorldPulseProposal` :744, `recordPartyImpact` :774.
Intervals: `one_week | one_month | one_season | one_year`. Stressor statuses:
`active | resolved | residual | dormant_residual` (+ graduation), from `src/domain/worldPulse/stressors.js`.

| Constant | Event | Class | Trigger | Props | Question |
|---|---|---|---|---|---|
| `WORLD_PULSE_PREVIEWED` | `world_pulse_previewed` | essential | `previewCampaignWorldPulse` | `{ interval, settlement_count, proposal_count }` | preview→commit conversion |
| `WORLD_PULSE_ADVANCED` | `world_pulse_advanced` | essential | `advanceCampaignWorld` success | `{ interval, tick_after, settlement_count, events_applied_count, new_stressor_count, resolved_stressor_count, residual_count, graduated_count, volatility_band }` | pulse cadence; world churn per interval |
| `WORLD_PULSE_BLOCKED` | `world_pulse_blocked` | essential | `world_not_canonized` branch | `{ reason:'world_not_canonized' }` | friction before first pulse |
| `WORLD_CANONIZED` | `world_canonized` | essential | `canonizeCampaignWorld` | `{ settlement_count, confirmed_channel_count, days_since_campaign_created_band }` | time-to-world-canon |
| `WORLD_PULSE_PROPOSAL_APPLIED` | `world_pulse_proposal_applied` | essential | `applyWorldPulseProposal` | `{ proposal_type, party_sourced }` | which proposed consequences DMs accept |
| `PARTY_IMPACT_RECORDED` | `party_impact_recorded` | essential | `recordPartyImpact` | `{ action_type, target_kind }` | party-as-actor adoption |
| `WORLD_STRESSOR_TRANSITIONS` | `world_stressor_transitions` | **research** | inside pulse-result application, diff stressor statuses before/after | `{ interval, transitions:[{type, from_status, to_status, severity, memory_strength_band}] }` (cap 20) | stressor-lifecycle dataset (echo ladder, counterforces in practice) |
| `WIZARD_NEWS_PANEL_OPENED` | `wizard_news_panel_opened` | essential | `src/components/map/WizardNewsPanel.jsx` open | `{ unread_count, current_tick }` | is the news feed read |
| `SIMULATION_RULES_UPDATED` | `simulation_rules_updated` | essential | `updateCampaignSimulationRules` | `{ changed_keys:[rule key names only] }` | which sim knobs DMs touch |
| `CHRONICLE_GENERATED` | `chronicle_generated` | essential | chronicle generation success (`generate-chronicle` path) | `{ entry_count_after, tick }` | chronicle adoption |

## 6. `regional_graph` namespace

Channel types verbatim (`src/domain/region/graph.js:15-32`, 13 values): `trade_dependency,
export_market, trade_route, political_authority, tax_obligation, military_protection, war_front,
service_dependency, religious_authority, criminal_corridor, migration_pressure, information_flow,
resource_competition`. Channel statuses: `suggested | confirmed | dormant | disabled`. Impact
statuses: `queued | applied | ignored | expired | resolved`.

| Constant | Event | Class | Trigger | Props | Question |
|---|---|---|---|---|---|
| `REGIONAL_CHANNEL_STATUS_CHANGED` | `regional_channel_status_changed` | essential | campaignSlice channel-status action (wraps `setChannelStatus`, graph.js:446) | `{ channel_type, from_status, to_status, strength_band, visibility:'public'\|'gm'\|'hidden' }` | which suggested channels get confirmed vs disabled |
| `REGIONAL_IMPACT_QUEUED` | `regional_impact_queued` | essential | `queueCampaignRegionalImpacts` (:600) | `{ count, channel_types:[…], max_wave_depth, max_delay_ticks }` | cascade depth in practice |
| `REGIONAL_IMPACT_STATUS_CHANGED` | `regional_impact_status_changed` | essential | `setRegionalImpactStatus` (:615) / `ignoreQueuedRegionalImpact` (:630) | `{ to_status, channel_type, wave_depth }` | do DMs accept propagated consequences |
| `REGIONAL_GRAPH_SNAPSHOT` | `regional_graph_snapshot` | **research** | on `world_pulse_advanced` + `world_canonized` | `{ node_count, channels_by_type:{…}, channels_by_status:{suggested,confirmed,dormant,disabled}, confirmed_ratio, queued_impact_count, max_wave_depth }` | **graph-topology dataset** |
| `NEIGHBOUR_GENERATED` | `neighbour_generated` | essential | neighbour generation action (`src/generators/neighbourGenerator.js` consumers) | `{ relationship_type:'neutral'\|'allied'\|'trade_partner'\|'patron'\|'client'\|'rival'\|'cold_war'\|'hostile', neighbour_tier, parent_tier }` | relationship-type distribution |
| `NEIGHBOUR_LINKED` | `neighbour_linked` | essential | neighbour promoted to saved/linked settlement | `{ relationship_type, total_linked_count }` | single-settlement → constellation conversion |

## 7. `map` namespace

(Existing `map_routes_mode_entered`, `map_drop_preview_shown` unchanged.)

| Constant | Event | Class | Trigger | Props |
|---|---|---|---|---|
| `MAP_OPENED` | `map_opened` | essential | WorldMap mount | `{ placement_count, route_count, has_campaign }` |
| `MAP_PLACEMENT_ADDED` | `map_placement_added` | essential | `mapSlice.addPlacement` (:221) | `{ placement_count_after, tier, via:'drop'\|'picker' }` — **never coordinates** |
| `MAP_PLACEMENT_REMOVED` | `map_placement_removed` | essential | `mapSlice.removePlacementLocal` (:230) | `{ placement_count_after }` |
| `MAP_ROUTE_DRAWN` | `map_route_drawn` | essential | routes-mode commit (`src/components/WorldMap.jsx` route handlers / `src/lib/roadNetwork.js`) | `{ route_count_after, links_two_placed_settlements }` |
| `MAP_SAVED` | `map_saved` | essential | map save path (`saved_maps`) | `{ placement_count, route_count, is_update }` |

## 8. `sharing` / `export` namespace

| Constant | Event | Class | Trigger | Props |
|---|---|---|---|---|
| `PDF_EXPORT_COMPLETED` | `pdf_export_completed` | essential | `generateSettlementPDF()` / `generateCampaignPDF()` resolve (`src/utils/`) — existing `pdf_export_clicked` = intent, this = success | `{ scope:'settlement'\|'campaign', narrative_mode, canon_phase, duration_band, content_hash }` |
| `GALLERY_PUBLISHED` | `gallery_published` | essential | `publishSettlement()` (`src/lib/gallery.js:41`) | `{ tier, canon_phase, share_narrated (gallery_share_narrated), has_image, tag_count, content_hash }` |
| `GALLERY_UNPUBLISHED` | `gallery_unpublished` | essential | `unpublishSettlement()` (`gallery.js:52`) | `{ days_published_band }` |
| `GALLERY_DOSSIER_VIEWED` | `gallery_dossier_viewed` | essential | public dossier view mount | `{ via:'gallery'\|'direct_link', is_owner, narrated_view }` |
| `GALLERY_ENGAGEMENT` | `gallery_engagement` | essential | vote/comment/report handlers in `gallery.js` | `{ action:'vote'\|'comment'\|'report' }` |

## 9. `library` / `revisit` namespace

| Constant | Event | Class | Trigger | Props |
|---|---|---|---|---|
| `settlement_saved` (existing, ext props) | — | essential | save path (`src/lib/saves.js` save/update) | `{ tier, canon_phase, is_first_save, committed_edit_count_total, has_ai_narrative, content_hash }` |
| `SETTLEMENT_REOPENED` | `settlement_reopened` | essential | library open handler (SettlementsPanel / store load) | `{ days_since_edited_band (now − campaignState.editedAt ?? savedAt), canon_phase, has_ai_data, save_count_band, via:'library'\|'welcome_back'\|'deep_link' }` — **the revisit-gap event** |
| `SETTLEMENT_DELETED` | `settlement_deleted` | essential | `saves` delete call site | `{ canon_phase, age_days_band, had_ai_data, was_published }` |
| `LIBRARY_VIEWED` | `library_viewed` | essential | SettlementsPanel mount (session-deduped via `useFunnelEvent`) | `{ save_count_band, campaign_count }` |
| `SESSION_STARTED` | `session_started` | essential | session id mint (`src/lib/session.js`) | `{ is_return, days_since_last_visit_band (useReturnVisit stamp), auth_state:'anon'\|'free'\|'premium', entry_route_kind:'home'\|'dossier'\|'gallery'\|'pricing'\|'other' }` |

## 10. `research` / `consent`

| Constant | Event | Class | Trigger | Props |
|---|---|---|---|---|
| `SETTLEMENT_FINGERPRINT_CAPTURED` | `settlement_fingerprint_captured` | **research** | `captureFingerprint(moment)` in `src/lib/researchCapture.js` at: `generated`, `saved`, `canonized`, `exported`, `ai_polished`, `pulse_advanced`, `published` | `{ moment, fingerprint:{…doc 1 §7}, fingerprint_hash, prev_fingerprint_hash, content_hash }` — `prev_fingerprint_hash` makes evolution chains reconstructable |
| `CONSENT_UPDATED` | `consent_updated` | essential | `setConsent()` in `src/lib/consent.js` | `{ research:'granted'\|'denied'\|'unset', ai_prose:'granted'\|'denied'\|'unset', surface:'account'\|'opt_in_card'\|'banner' }` |

---

## Instrumentation map (file → hook → events)

| File | Hook point | Events |
|---|---|---|
| `src/components/GenerateWizard.jsx` | generate handler; `wizardStep` transitions; unmount | `generation_started`, `wizard_step_viewed`, `wizard_abandoned`, `regeneration_triggered`. Config enums → event props; priority sliders / forced lists → fingerprint only (high cardinality, low funnel value) |
| settlementSlice generate path (caller of `generateSettlementPipeline`) | pass `onStep` accumulator (`pipeline.js:112`); resolve/catch | `generation_step_timings` (research), `generation_completed` (+ reduced fingerprint), `generation_failed`, `captureFingerprint('generated')` |
| `src/components/OutputContainer.jsx` | group/tab selection; tab content wrapper | `dossier_tab_viewed`, `dossier_section_dwell` (via new `src/hooks/useSectionDwell.js`), `dossier_read_session_summary` |
| `src/store/settlementSlice.js` | `queueEdit` (:241), `commitPendingEdits` (:273) | extended `edit_pending_queued`, extended `edit_committed`. Fingerprint NOT captured per-commit (too chatty) — only on save |
| `src/components/dossier/PendingChangesBar.jsx` | commit/revert/preview handlers | extended `edit_committed` / `edit_reverted` / `edit_cascade_previewed`; `edit_dropped`; research `edit_events` rows via `researchCapture` |
| `src/components/NarrativeDriftModal.jsx` | mount + buttons | `narrative_drift_modal_shown`, `narrative_drift_decision` |
| `src/store/aiSlice.js` | around `generateNarrative` calls; `setAiSettlement`; `showNarrative` toggle | `ai_generation_started/completed/failed`, `ai_verifier_report`, `narrative_view_toggled`, `ai_narrative_stale_detected`, `captureFingerprint('ai_polished')` |
| `src/store/creditsSlice.js` | `spendCredits` | `credits_spent` |
| `src/store/campaignSlice.js` | :600/:615/:630/:655/:674/:690/:713/:744/:774 | all `world_pulse` + `regional_graph` events; `world_stressor_transitions`; `regional_graph_snapshot`; `captureFingerprint('pulse_advanced')` per affected save (cap 5/pulse) |
| neighbour generation/link actions | generate + link | `neighbour_generated`, `neighbour_linked` |
| `src/store/mapSlice.js` / `src/components/WorldMap.jsx` | `addPlacement` (:221), `removePlacementLocal` (:230), route commit, map save | `map_*` events |
| save path (callers of `src/lib/saves.js`) | post-success; phase transition | extended `settlement_saved`, `canon_phase_changed`, `captureFingerprint('saved'\|'canonized')` |
| SettlementsPanel / load action | open/delete/mount | `settlement_reopened`, `settlement_deleted`, `library_viewed` |
| `src/utils/generateSettlementPDF.js` / `generateCampaignPDF.js` call sites | resolve | `pdf_export_completed`, `captureFingerprint('exported')` |
| `src/lib/gallery.js` call sites | :41/:52 + vote/comment/report | `gallery_*`, `captureFingerprint('published')` |
| `src/lib/session.js` | session mint | `session_started` |
| `src/lib/consent.js` | `setConsent` | `consent_updated` |

## Totals

- **58 new events** (+ 6 existing with extended props, + typed `edit_events` rows on the research plane).
- Research-class events: exactly 4 — `generation_step_timings`, `world_stressor_transitions`,
  `regional_graph_snapshot`, `settlement_fingerprint_captured`. Each is gated client-side by
  `EVENT_CLASS` + consent, never mirrored to PostHog, and double-checked server-side by the
  consent clamp.
