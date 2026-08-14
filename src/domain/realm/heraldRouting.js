/**
 * domain/realm/heraldRouting.js — THE HERALD ROUTING TABLE (owner doctrine
 * 2026-07-22, THE REALM INSPECTOR = NEWSPAPER).
 *
 * THE LOAD-BEARING ARTIFACT. Every event the Herald (the rebuilt Realm Inspector)
 * renders is filed under EXACTLY ONE of its six news sections:
 *
 *     war  ·  faith  ·  trade  ·  events  ·  divination  ·  adjudication
 *
 * (Dashboard is not a section here — it is the front-page aggregate OF these six.)
 *
 * THREE LAWS (FINITE-SEMANTICS + THE NEWS ADDRESS LAW):
 *   1. TOTAL — every candidateType / impactKind / stressor type / proposal kind the
 *      engine mints is classified. No orphan; a NEW producer kind fails the totality
 *      walker (tests/lint/heraldRouting.walker.test.js) until a human files it. That
 *      is the structural-prevention guarantee: discovery is automatic (a node
 *      matchAll source scan), classification is a conscious human act.
 *   2. SINGLE-HOME — SECTION_OF is a function: one token, one section. `events` is
 *      the EXPLICIT catch-all (a known "sundry" token routes there ON PURPOSE, via an
 *      exact entry or a family prefix — never by silently falling through).
 *   3. ROUTED BY WHAT THE EVENT IS, NOT WHAT CAUSED IT — a trade-caused siege files
 *      under war; the trade cause shows in the ARTICLE (the cause walk), not the
 *      section. The routing key is the event's own nature (its impactKind /
 *      candidateType), read structurally, never a prose scan of its headline.
 *
 * WHY adjudication and divination are STRUCTURAL, not token-map outputs:
 *   - ADJUDICATION is "the record is a decision" — a pending proposal or a resolved
 *     ruling — which is a property of the RECORD, not of its inner kind. The same
 *     kind (`settlement_terminal_death`, `institution_closure`) appears both as a
 *     past war/trade event AND as a proposal payload; single-home forbids one token
 *     meaning two sections, so "it is a proposal" is decided at the record layer
 *     (heraldSectionOfRecord), and SECTION_OF files the payload by its CONTENT.
 *   - DIVINATION is "the record is a forecast" — an emerging-stage stressor or a
 *     rising-pressure signal. The pressure-CANDIDATE tokens (the six
 *     `${kind}_pressure` mints of pressureConditionCandidate + the generic
 *     `regional_pressure`) carry forecast nature in the token itself, so SECTION_OF
 *     files THOSE under divination; the structural emerging-stage routing is added by
 *     heraldSectionOfRecord.
 *
 * SEEDED FROM the precedent KIND_SECTION (chroniclersLetter.js) — the letter's
 * 5-section fallback (wars / courts / trade / traditions / mercy). This 6-section
 * table is its successor; the correspondence, and every INTENTIONAL divergence, is
 * recorded in KIND_SECTION_CORRESPONDENCE below and pinned by the walker.
 *
 * PURITY + CLOSURE. A pure leaf: no store, no React, no Date/Math.random, no locale
 * methods, and — deliberately — NO runtime imports of the producer modules whose
 * vocabularies it classifies (importing stressorsCore / npcAgency / … would drag
 * those graphs into the lazy inspector chunk and spend the ~194-byte first-paint
 * margin). The frozen producer constants are imported ONLY by the walker test, at
 * test time, where closure does not apply. This module adds zero eager bytes: it is
 * imported only by the lazy Herald panels.
 *
 * @enforced-by tests/lint/heraldRouting.walker.test.js (totality both ways +
 *   single-home + KIND_SECTION consistency + the matchAll drift scan).
 */

/**
 * The six news sections. Frozen, ordered as the paper reads. Adjudication and
 * divination are reachable via heraldSectionOfRecord (structural) and — for the
 * pressure-candidate tokens — SECTION_OF.
 * @typedef {'war'|'faith'|'trade'|'events'|'divination'|'adjudication'} HeraldSection
 * @type {ReadonlyArray<HeraldSection>}
 */
export const HERALD_SECTIONS = Object.freeze(['war', 'faith', 'trade', 'events', 'divination', 'adjudication']);

/** The explicit catch-all (the "sundry" section). A known token routes here on
 *  purpose; an unknown string lands here as the totality floor. */
export const CATCH_ALL_SECTION = /** @type {HeraldSection} */ ('events');

/**
 * THE EXACT TABLE — every concrete minted token the Herald routes, filed by the
 * event's own nature. Grouped by destination for auditability. Stressor TYPES are
 * present here too (siege / famine / …): they are both routable tokens on their own
 * and the base the `stressor_birth_*` / `stressor_escalate_*` / `stressor_spread_*` /
 * `realm_*` lifecycle prefixes delegate to (one source of truth, below).
 *
 * Every value is one of HERALD_SECTIONS \ {adjudication} — adjudication is never a
 * token output (see the module header). Divination holds only the forecast tokens.
 * @type {Readonly<Record<string, HeraldSection>>}
 */
export const EXACT_SECTION = Object.freeze(/** @type {Record<string, HeraldSection>} */ ({
  // ── WAR — inter-settlement armed conflict and its instruments ────────────────
  war_mobilization: 'war', war_conscription: 'war', war_levy: 'war', war_spoils: 'war',
  war_drain: 'war', war_exhaustion: 'war', war_pressure: 'war', war_front: 'war',
  army_homecoming: 'war', army_deployed: 'war', hostile_raid: 'war', conquest: 'war',
  // WR-8 amendment R. A razing is the war section's, not the events catch-all's:
  // it is a siege's terminal act by the same army under the same casus, and it
  // REPLACES the conquest rather than riding it (LAW 6 — no occupation record),
  // so the two are siblings in the same file and must be read side by side.
  razing: 'war',
  siege: 'war', siege_lifted: 'war', siege_initiation: 'war',
  blockade_declared: 'war', blockade_lifted: 'war', field_battle: 'war', sea_battle: 'war',
  intercept_ordered: 'war', convoy_ordered: 'war', reinforcement_ordered: 'war', reinforcement_cost: 'war',
  intervention_ordered: 'war', intervention: 'war', intervention_clash: 'war',
  strategy_deploy: 'war', strategy_defend: 'war', strategy_hold: 'war',
  strategy_return_home: 'war', strategy_sue_for_peace: 'war',
  occupation: 'war', occupation_lifted: 'war', occupation_vassalized: 'war',
  occupation_resistance: 'war', occupation_burden: 'war', occupation_burden_cleared: 'war',
  wartime: 'war', vassal_rebellion: 'war', rebellion_vassal: 'war',
  cold_war_supply_sanctions: 'war', ally_burden: 'war', alliance_burden: 'war', relief_burden: 'war',
  casus_declared: 'war', peace_sued: 'war', supply_raid_ordered: 'war', military_protection: 'war',
  disposition_martial_crossed: 'war', war_culture_suppressed: 'war',
  casus_lineage_claim_parent: 'war', casus_lineage_claim_child: 'war',
  lineage_claim_suppressed: 'war',
  war_trajectory_winning: 'war', war_trajectory_losing: 'war',
  winning_abroad_losing_at_home: 'war', trajectory_misread: 'war',
  war_continued_for_the_seat: 'war', war_ended_against_rival_triumph: 'war',
  refusal_cost_ally_patience: 'war', successor_repudiates_war: 'war',
  successor_escalates_war: 'war',
  coalition_entry_priced: 'war', coalition_joined: 'war', coalition_refused: 'war',
  casus_alliance_obligation: 'war', coalition_stayed: 'war',
  envoy_intercepted: 'war', interceptor_dilemma: 'war',
  // THE INDIRECT WAR + THE WAR OF WORDS. These nine route on `kind`, not `impactKind`
  // (their authors mint none), which is exactly why the automatic discovery scan above
  // never surfaced them: it reads `impactKind:` and `candidateType:` literals only. They
  // became routable on 2026-07-31, when those receipts were given the ids the news feed
  // requires; before that every one was dropped before reaching a reader. Filed under
  // `war` because all nine are acts of a war doctrine: a reversal of a committed war
  // course, the strangulation of a target's suppliers, and the deception and covert watch
  // that surround both. `intel_transfer` is the one judgment call, filed under `trade`
  // because it is intelligence BOUGHT or GIFTED through the obligation machinery, which
  // is where its siblings (the generosity_* beats) already live.
  momentum_climb_down: 'war',
  webwar_campaign_minted: 'war', webwar_raid: 'war', webwar_wrong_village: 'war',
  webwar_campaign_abandoned: 'war', webwar_campaign_complete: 'war',
  infowar_lie_exposed: 'war', infowar_spy_exposed: 'war',
  // IN-0a `plant_took` files with its own siblings for the same authored reason the nine
  // above carry: a commissioned falsehood taking hold in a rival court is an act of a war
  // doctrine, not a market report. [JUDGMENT J-IN0A-3, vetoable — IN-5 mints the KNOWLEDGE
  // desk and RE-FILES this token there with the rest of the lane; filing it under `events`
  // in the meantime would have hidden it from the desk it is being written for.]
  plant_took: 'war',
  // relationship types that are adversarial route to war (a cold_war / hostile turn
  // is a war-section beat; commercial/hierarchy relations are trade, below).
  rival: 'war', cold_war: 'war', hostile: 'war',

  // ── FAITH — deities, religion, belief, pantheon ──────────────────────────────
  faith_foothold_recruited: 'faith', faith_pact_formed: 'faith',
  pantheon: 'faith', pantheon_ascendancy: 'faith', pantheon_twilight: 'faith',
  belief_misjudgment: 'faith', religious_conversion_fracture: 'faith',
  religious_pact_betrayal: 'faith', religious_authority: 'faith', religious_pressure: 'faith',
  deity_war_pressure: 'faith', deity_peace_pressure: 'faith',
  strategy_missionize: 'faith', compound_gods_abandonment: 'faith',
  // WR-10. The war annex's FIRST faith-desk kind: the observer-axis judgment of a sale
  // is a moral reading a temple and its courts make, not a term of the bargain. Its
  // token files here so SECTION_OF and the governed registry's own desk agree; the four
  // adjudication kinds cannot do the same (adjudication is never a token output) and
  // fall to the events catch-all below, exactly as the WR-5 decision records do.
  sovereignty_sale_judged: 'faith',
  major: 'faith', minor: 'faith', cult: 'faith', // deity tiers (DEITY_TIER_KEYS)

  // ── TRADE — goods, money, roads, resources, institutions, non-war relations ───
  flow_trade_scarcity: 'trade', flow_migration: 'trade', trade_embargo_collapse: 'trade',
  disposition_mercantile_crossed: 'trade',
  home_front_roads: 'trade', home_front_markets: 'trade',
  coalition_expenditure_read: 'trade', coalition_spoils_divided: 'trade',
  coalition_debt_paid: 'trade', coalition_debt_unpaid: 'trade',
  trade_embargo: 'trade', trade_embargo_declared: 'trade', trade_realignment: 'trade',
  vassal_trade_coercion: 'trade', vassal_tribute_extraction: 'trade', vassal_extraction: 'trade',
  resource_discovery: 'trade', resource_depletion: 'trade', resource_recovery: 'trade',
  resource_removal: 'trade', resource_competition: 'trade',
  harvest: 'trade', hungry_gap: 'trade', spring_thaw: 'trade', roads: 'trade', urban_fabric: 'trade',
  boom: 'trade', bust: 'trade', flourishing: 'trade', reconstruction: 'trade',
  institution_build: 'trade', institution_closure: 'trade', institution_founding: 'trade',
  settlement_resettled: 'trade', steading_founded: 'trade',
  population_growth: 'trade', population_emigration: 'trade', population_decline: 'trade',
  migration_flight: 'trade', mass_migration: 'trade', migration_pressure: 'trade',
  market_shock: 'trade', indebtedness: 'trade', tier_change: 'trade', tier_promotion: 'trade',
  tier_demotion: 'trade', tier_up: 'trade', tier_down: 'trade',
  generosity_credit_default: 'trade', generosity_purchase: 'trade', generosity_trade_overture: 'trade',
  // Intelligence bought or gifted between courts, ledgered through the SAME obligation
  // machinery as the generosity beats above (see the war-section note for the cohort).
  intel_transfer: 'trade',
  relationship_label_change: 'trade', diplomacy_trade: 'trade', treaty_signed: 'trade', treaty_breached: 'trade',
  // Bare `diplomacy` has exactly ONE producer: the treaty signing beat (peaceTerms.js
  // signingBeat, impactKind 'diplomacy'). Routing law reads impactKind before kind, so
  // this key — not the treaty_signed row above — decides where a signed treaty files.
  // Moved from `events` on 2026-07-31 so BOTH of the beat's keys agree on `trade`
  // (terms, tribute, and trade normalization are what a treaty actually changes); the
  // letter-precedent divergence is recorded in KIND_SECTION_DIVERGENCES below.
  diplomacy: 'trade',
  strategy_embargo: 'trade', strategy_reroute: 'trade', strategy_credit: 'trade',
  compound_calling_of_debts: 'trade',
  // wizardNews IMPACT_LABELS (dynamic `impactKind: impact.kind`) — the trade-side.
  import_shortage: 'trade', export_market_loss: 'trade', route_disruption: 'trade',
  tax_revenue_disruption: 'trade', service_disruption: 'trade',
  // condition archetypes (activeConditions.js) that are economic.
  trade_route_cut: 'trade', food_anchor_lost: 'trade',
  // channel types (the WHERE a regional impact flows through) that are commercial.
  trade_dependency: 'trade', export_market: 'trade', trade_route: 'trade', trade_primacy: 'trade',
  tax_obligation: 'trade', service_dependency: 'trade',
  // relationship types that are commercial / hierarchical (non-adversarial).
  neutral: 'trade', trade_partner: 'trade', allied: 'trade', patron: 'trade', client: 'trade',
  vassal: 'trade', preferred_supplier: 'trade', critical_supplier: 'trade', military_supplier: 'trade',
  creditor: 'trade', debtor: 'trade', tribute: 'trade', embargo: 'trade', sanctioned: 'trade',
  proxy: 'trade', smuggling: 'trade', forced_tribute: 'trade', mediated_commerce: 'trade',
  ceasefire_commerce: 'trade',
  // WR-10 THE SOVEREIGNTY MARKET — the trade desk's own. A settlement changing hands
  // for a bundle is a bargain before it is anything else, so the offer, the clearing,
  // the named no-trade, the swap, the wartime discount and the rerouted streams file
  // beside the other goods-and-price beats. The market's CONSEQUENCE kinds (the
  // rewritten edge, the grievance, the surviving lineage, the sold valve) are events,
  // and the four adjudication kinds plus the faith-desk judgment are filed below.
  sovereignty_sale_offered: 'trade', sovereignty_sale_cleared: 'trade',
  sovereignty_no_trade: 'trade', sovereignty_swap: 'trade',
  wartime_firesale: 'trade', streams_rerouted: 'trade',
  // TR-1 THE CASUS COMMERCII — nineteen kinds, all one desk. A typed commercial
  // grievance or partnership IS a trade beat by its own nature (law 3: routed by what
  // the event is, not what caused it), including the severance crossing, which is a
  // market closing rather than a quarrel: the war it may later feed files under war when
  // and if the one opener judges it. The twentieth TR-1 kind, commercial_relation_line,
  // is DELIBERATELY ABSENT — it is the town dossier's relations-panel row, and a panel
  // line is not an event to file. That exclusion is asserted, not assumed, by
  // tests/lint/commercialKindPools.walker.test.js.
  commercial_contract_default: 'trade', commercial_contract_honored: 'trade',
  commercial_toll_extortion: 'trade', commercial_toll_relief: 'trade',
  commercial_market_exclusion: 'trade', commercial_market_opened: 'trade',
  commercial_cornering: 'trade', commercial_provision: 'trade',
  commercial_famine_profiteering: 'trade', commercial_famine_relief: 'trade',
  commercial_dependency_fear: 'trade', commercial_dependency_comfort: 'trade',
  commercial_contraband_injury: 'trade', commercial_honest_gates: 'trade',
  commercial_route_predation: 'trade', commercial_route_wardenship: 'trade',
  commercial_casus_suppressed: 'trade',
  commercial_severance_crossing: 'trade', commercial_partnership_crossing: 'trade',
  // GR-0 THE LIFECYCLE VOICE — the treaty cohort's own desk. A pact reaching the end of
  // its term and a court entering a shortfall in its ledger change the same things a
  // signing changes (terms, tribute, trade normalization), so they file beside
  // treaty_signed, treaty_breached and diplomacy rather than under the events catch-all.
  // Both carry their OWN impactKind rather than `diplomacy`: routing law reads impactKind
  // before kind, and the SINGLE_PRODUCER_KEYS walker pins `diplomacy` to the one signing
  // beat, so a second producer of that token would inherit this desk silently.
  treaty_lapsed: 'trade', treaty_default_detected: 'trade',
  // IN-0C — the compelled books opening is the same treaty cohort, so it takes the
  // same desk by its OWN token rather than by a registry authority.
  treaty_disclosure_opened: 'trade',
  // GR-4b — an heir's disavowal ends the same terms a signing created, so it files the
  // cohort's one desk by its OWN token, like its three siblings above.
  disavowed_by_succession: 'trade',
  // GR-4b-iii-a — an unanswered instrument remains on the treaty cohort's own desk.
  succession_question_opened: 'trade',

  // ── EVENTS — the explicit catch-all: stressors, traditions, courts, calamity ──
  // stressor types (non-war, non-faith, non-trade)
  famine: 'events', political_fracture: 'events', betrayal: 'events', infiltration: 'events',
  disease_outbreak: 'events', succession_void: 'events', monster_raider_pressure: 'events',
  insurgency: 'events', slave_revolt: 'events', rebellion: 'events', criminal_corridor: 'events',
  magical_instability: 'events', coup_detat: 'events', magic_deadzone: 'events',
  // W-G / J-D1 — the autoplacement charter. A DM act on the realm's map rather
  // than an engine beat, but it is realm news all the same ("the realm's charter
  // is drawn"), so it is filed explicitly instead of riding the silent catch-all.
  // Its sibling user-act kind `ruleset_change` (simulationProfile.js) is still
  // unfiled and lands in 'events' the quiet way; that is a pre-existing gap, noted
  // here rather than fixed inside a placement wave.
  autoplacement: 'events',
  // calamity + demographic + spatial
  calamity: 'events', plague: 'events', plague_arrival: 'events', spatial_consequence: 'events',
  custom_crisis: 'events', government_overthrown: 'events', corruption_exposed: 'events',
  dominant_npc_removed: 'events', cold_war_sanctions: 'war',
  compound_the_wasting: 'events', compound_starving_city: 'events', compound_shadow_court: 'events',
  // courts / power / persons (KIND_SECTION `courts` → events)
  coup_succeeded: 'events', coup_suppressed: 'events', faction_government_challenge: 'events',
  faction_rival_power_contest: 'events', faction_capture: 'events', faction_exhaustion: 'events',
  faction_power_shift: 'events', faction_institution_suppression: 'events',
  faction_institution_capture: 'events', faction_service_bolster: 'events',
  faction_law_preference_push: 'events', institution_suppression: 'events', institution_capture: 'events',
  government_change: 'events', hierarchy_cascade: 'events', assize_verdict: 'events',
  reconsideration_forced: 'events', criminal_network: 'events',
  commons_gathering: 'events', commons_petition: 'events', commons_riot: 'events',
  npc_action: 'events', npc_goal_culmination: 'events', npc_goal_rebranch: 'events',
  npc_growth: 'events', npc_ladder: 'events', npc_contest: 'events', npc_support: 'events',
  disposition_diplomatic_crossed: 'events', disposition_insular_crossed: 'events',
  disposition_reversal: 'events', lineage_edge_recorded: 'events', mirror_kinship_bond: 'events',
  home_front_stores: 'events', home_front_hands: 'events', home_front_institutions: 'events',
  mirror_obligation_discharged: 'events',
  // WR-5 decision records persist `section: 'adjudication'`, which the record
  // router honours below. Their token-only fallback is events: adjudication is
  // a property of the governed record, never a second meaning for the token.
  sued_for_peace_seat: 'events', sued_for_peace_realm: 'events', peace_refused: 'events',
  refusal_cost_legitimacy: 'events', ruler_books_compromised: 'events',
  war_party_overturns_peacemaker: 'events', peace_party_overturns_warmonger: 'events',
  succession_demand_inherited: 'events', war_dissolved_by_verdict: 'events',
  coalition_separate_peace: 'events', coalition_apportionment: 'events',
  // WR-10 THE SOVEREIGNTY MARKET — the events desk's own four (the conveyance's
  // consequences: the rewritten holding edge, the sold town's grievance, the founding
  // line that outlives the sale, and the overflow valve a parent sold out from under
  // itself), followed by the token-only fallbacks for the four ADJUDICATION kinds.
  // Those four persist `section: 'adjudication'` and the record router honours it via
  // the sovereignty_registry authority; events is their fallback for the same reason
  // the WR-5 rows above take it — adjudication is a property of the governed record,
  // never a second meaning for the token.
  sovereignty_edge_rewritten: 'events', sold_settlement_grievance: 'events',
  lineage_survives_the_sale: 'events', overflow_valve_sold: 'events',
  cession_for_peace: 'events', bought_seat_fragility: 'events',
  kinship_opposes_the_sale: 'events', sale_books_diverged: 'events',
  // WR-7a errand records carry governed desks below. Token-only fallbacks for
  // the court acts remain events; the moving-person beat is likewise an event.
  // Silence is a belief forecast and therefore has an explicit divination home.
  envoy_departed: 'events', envoy_on_the_road: 'events', envoy_returning: 'events',
  envoy_home: 'events', envoy_lost: 'events', terms_never_reached: 'events',
  envoy_parlaying: 'events', envoy_terms_agreed: 'events', envoy_held: 'events',
  terms_signed_for_a_fallen_town: 'events', parlay_at_an_occupied_venue: 'events',
  interceptor_parlays_own_edge: 'events', parlay_terms_neither_court_drafted: 'events',
  envoy_dispatched: 'events',
  // traditions / custom / values (KIND_SECTION `traditions` custom-half → events)
  tradition: 'events', tradition_change: 'events', moral_reckoning: 'events', cause_lifecycle: 'events',
  // mercy (KIND_SECTION `mercy` → events)
  generosity_refusal: 'events', generosity_refuge: 'events', generosity_relief: 'events',
  // settlement lifecycle deaths / steadings
  settlement_terminal_death: 'events',
  steading_orbit_dispersed: 'events', steading_charter_pending: 'events',
  steading_abandoned: 'events', steadings_converged: 'events',
  // refusal receipts + generic stressor lifecycle residue
  queue_refused: 'events', realm_verb_refused: 'events', realm_verb_order: 'events',
  stressor_residual: 'events', party_stressor_residual: 'events', stressor_aftermath: 'events',
  stressor_graduated: 'events', stressor_wind_down: 'events',
  // channels that are civic/informational/disaster (the `table_*` events file via the
  // `table_` family prefix, whose minted form underscores the hyphen: table_stressor_relief).
  political_authority: 'events', information_flow: 'events', authority_instability: 'events',
  information_shock: 'events', criminal_pressure: 'events', protection_gap: 'events', relief: 'events',
  settlement: 'events', disaster: 'events', regional_channel: 'events',
  // realm-verb candidateType literals (realmManifest.js) + realm_verb_${verb} impactKinds,
  // filed by the verb's nature.
  calamity_forced: 'events', steading_forced: 'events',
  realm_verb_declare_casus: 'war', realm_verb_sue_for_peace: 'war', realm_verb_repudiate_treaty: 'trade',
  realm_verb_order_supply_raid: 'war', realm_verb_declare_trade_embargo: 'trade',
  realm_verb_order_intervention: 'war', realm_verb_reinforce: 'war', realm_verb_intercept: 'war',
  realm_verb_order_convoy: 'war', realm_verb_declare_blockade: 'war',
  realm_verb_force_reconsideration: 'events', realm_verb_force_calamity: 'events',
  realm_verb_force_found_steading: 'events', realm_verb_force_abandon: 'events',
  realm_verb_force_resettle: 'trade',
  // WR-10 TRANSFER_SOVEREIGNTY. Both of the verb's routing keys file under TRADE, and
  // for the same reason its family is War: a conveyance is a BARGAIN whatever pushed
  // the courts into it. `sovereignty_conveyed` is the candidateType the proposal beat
  // carries; `realm_verb_transfer_sovereignty` is the applied order's impactKind. They
  // agree deliberately — the repudiate-treaty pair is the precedent for a war-family
  // verb whose beats belong beside the terms and tribute they move.
  sovereignty_conveyed: 'trade', realm_verb_transfer_sovereignty: 'trade',

  // ── DIVINATION — the forecast tokens (pressure / emergence in the token itself) ─
  regional_pressure: 'divination', food_pressure: 'divination', disease_pressure: 'divination',
  conflict_pressure: 'divination', trade_pressure: 'divination', legitimacy_pressure: 'divination',
  crime_pressure: 'divination', envoy_silence_inference: 'divination',
}));

/**
 * THE UNIFORM FAMILY PREFIXES — template families whose whole closed domain files
 * under ONE section, checked after exact entries and the lifecycle delegation.
 * Longest / most specific first (a startsWith scan takes the first hit). Mixed
 * families (generosity_, institution_, strategy_, realm_verb_, compound_,
 * relationship types) are NOT here — each of their members has an exact entry above.
 * @type {ReadonlyArray<readonly [string, HeraldSection]>}
 */
export const PREFIX_RULES = Object.freeze(/** @type {ReadonlyArray<readonly [string, HeraldSection]>} */ ([
  ['war_', 'war'],
  ['faith_', 'faith'],
  ['pantheon_', 'faith'],
  ['commons_', 'events'],
  ['coup_', 'events'],
  ['faction_', 'events'],
  ['npc_', 'events'],
  ['tier_', 'trade'],
  ['resource_', 'trade'],
  ['population_', 'trade'],
  ['institution_', 'trade'],
  ['mobilization_reaction_', 'war'],
  // strategy_${move}: military-posture dominant (defend/hold/deploy/return_home/
  // sue_for_peace/pre_empt); the economic/faith levers keep their exact overrides
  // above (strategy_embargo/reroute/credit → trade, strategy_missionize → faith).
  ['strategy_', 'war'],
  ['party_', 'events'],
  ['table_', 'events'],
  ['steading_', 'events'],
  // brokerage_${act}: the knowledge lane's four institutional acts (query/feed/intercept/
  // plant), minted DYNAMICALLY from a variable like strategy_${move} above, so the shared
  // literal-scanning walkers cannot see them and only a family prefix can route them.
  //
  // THIS DISCHARGES A RECORDED DEFERRAL, and the section is unchanged by it. I3/I4 measured
  // this exact one-line entry as owed and did not make it because heraldRouting.js belonged
  // to a concurrent session that wave (the note is in brokerageServicesRules.js's
  // BROKERAGE_ACT_TEMPO header and in brokerageServices.test.js's display census). All four
  // acts already LANDED on 'events' through the declared catch-all; what was missing was
  // that they landed there by DECISION rather than by fall-through, which is the difference
  // `isExplicitlyRouted` measures and the "no orphan" guarantee depends on. Executed before
  // and after (2026-08-06, IN-0b): section 'events' both ways for all four acts;
  // isExplicitlyRouted false → true for all four.
  ['brokerage_', 'events'],
]));

/** The stressor-lifecycle prefixes that DELEGATE to their base type's routing (the
 *  base type lives in EXACT_SECTION). `realm_${type}` is a stressor crossing the
 *  realm threshold; the other three are the stressor birth/escalate/spread mints. */
const DELEGATING_PREFIXES = Object.freeze([
  'stressor_birth_', 'stressor_escalate_', 'stressor_spread_', 'realm_',
  // the regional-impact condition archetypes (regional_${impactLabel}) file exactly
  // like their bare wizardNews IMPACT_LABEL (regional_import_shortage → import_shortage
  // → trade). regional_pressure keeps its own exact (divination) — checked before this.
  'regional_',
]);

/** @param {unknown} v @returns {string} */
function tokenStr(v) { return v == null ? '' : String(v); }

/**
 * SECTION_OF — file one event-kind token under its Herald section. TOTAL (an
 * unknown string lands in the `events` catch-all) and SINGLE-HOME (a function).
 * Never returns 'adjudication' — that is a record-level decision
 * (heraldSectionOfRecord). Returns 'divination' only for the forecast (pressure)
 * tokens.
 *
 * @param {string} kind  a minted candidateType / impactKind / stressor type /
 *   proposal payload kind / channel type / relationship type.
 * @returns {HeraldSection}
 */
export function SECTION_OF(kind) {
  const k = tokenStr(kind);
  if (!k) return CATCH_ALL_SECTION;
  // 1. exact
  const exact = EXACT_SECTION[k];
  if (exact) return exact;
  // 2. stressor-lifecycle delegation: strip the lifecycle prefix, route the base type.
  for (const p of DELEGATING_PREFIXES) {
    if (k.startsWith(p) && k.length > p.length) {
      const base = EXACT_SECTION[k.slice(p.length)];
      if (base) return base;
    }
  }
  // 3. uniform family prefixes
  for (const [prefix, section] of PREFIX_RULES) {
    if (k.startsWith(prefix)) return section;
  }
  // 4. the explicit catch-all
  return CATCH_ALL_SECTION;
}

/**
 * Whether a token routes EXPLICITLY (via an exact entry, a lifecycle delegation, or
 * a uniform family prefix) rather than silently falling through to the catch-all.
 * The totality walker asserts this is true for EVERY producer vocabulary member —
 * that is the "no orphan" guarantee. Note: a token intentionally filed under
 * `events` via an exact entry is explicit; only an UNCLASSIFIED string is not.
 *
 * @param {string} kind
 * @returns {boolean}
 */
export function isExplicitlyRouted(kind) {
  const k = tokenStr(kind);
  if (!k) return false;
  if (EXACT_SECTION[k]) return true;
  for (const p of DELEGATING_PREFIXES) {
    if (k.startsWith(p) && k.length > p.length && EXACT_SECTION[k.slice(p.length)]) return true;
  }
  for (const [prefix] of PREFIX_RULES) {
    if (k.startsWith(prefix)) return true;
  }
  return false;
}

/**
 * Extract the routing token from an inspector record (a pulse outcome, impact-digest
 * entry, proposal, stressor, or news item). Reads the STRUCTURED nature fields in
 * priority order — never a prose scan of the headline. Returns '' when the record
 * names no routable nature (then heraldSectionOfRecord falls to the catch-all).
 *
 * @param {Record<string, unknown>} [record]
 * @returns {string}
 */
export function routingKeyOf(record = {}) {
  const r = record || {};
  const outcome = /** @type {Record<string, unknown>} */ (r.outcome && typeof r.outcome === 'object' ? r.outcome : r);
  const stressor = /** @type {Record<string, unknown>} */ (r.stressor && typeof r.stressor === 'object' ? r.stressor
    : outcome.stressor && typeof outcome.stressor === 'object' ? outcome.stressor : {});
  const payload = /** @type {Record<string, unknown>} */ (outcome.proposalPayload && typeof outcome.proposalPayload === 'object'
    ? outcome.proposalPayload : (r.proposalPayload && typeof r.proposalPayload === 'object' ? r.proposalPayload : {}));
  return tokenStr(
    r.impactKind || outcome.impactKind
    || r.candidateType || outcome.candidateType
    || stressor.type
    || payload.kind
    || r.type || outcome.type
    || r.kind || outcome.kind,
  );
}

/**
 * ⚠ THE `__adjudicationPending` / `__resolution` / `__forecast` MARKER ARMS WERE
 * DELETED, NOT DISABLED (2026-08-11). Same finding shape as heraldFeed's `decreed`
 * arm, and the same verdict for a stronger reason.
 *
 * All three had ZERO writers between them — not production, not test, not fixture,
 * and `git log -S` finds none on any branch: they were born as reads. But unwritten
 * alone would not settle it, because a `__`-prefixed marker is precisely the kind of
 * key a caller attaches to a WRAPPER object at the call site, with nothing persisted
 * and no shape widened. The decisive evidence is that the caller which would have
 * used them exists, was written, and chose the structural path instead:
 * heraldFeed.js `buildHeraldFeed` builds exactly such wrapper records for stressors
 * (`{ ...stressor, stressor, headline }`) and files emerging ones to divination —
 * through `lifecycleStage`, never through `__forecast`. The capability these markers
 * offered is therefore not missing; it ships through the structural `status` /
 * `lifecycleStage` fields, and a second redundant spelling of it was dead weight
 * inviting two sources of truth for one routing decision.
 *
 * `isPendingDecision` lost its whole second disjunct rather than one conjunct: every
 * term in it was gated behind `__adjudicationPending === true`, so the surviving
 * `proposalPayload` / non-terminal-status guard was unreachable and keeping a guard
 * that can never run would misrepresent it as live. A pending proposal still routes
 * to adjudication through `status === 'pending'`, which is what every producer writes.
 *
 * @enforced-by tests/domain/deadReaderRepairs.test.js (a negative control feeds ONLY
 *   the dead marker spelling, so re-adding any of these as an extra OR-arm reds).
 */

/** @param {Record<string, unknown>} r @returns {boolean} a pending decision awaiting the DM. */
function isPendingDecision(r) {
  return tokenStr(r.status) === 'pending';
}

/** @param {Record<string, unknown>} r @returns {boolean} a resolved ruling (manual or autoresolve) for the decisions log. */
function isResolution(r) {
  const s = tokenStr(r.status);
  return s === 'resolved' || s === 'applied_by_dm';
}

/** @param {Record<string, unknown>} r @returns {boolean} an emerging-stage stressor / rising-pressure signal. */
function isEmergingForecast(r) {
  const stressor = /** @type {Record<string, unknown>} */ (r.stressor && typeof r.stressor === 'object' ? r.stressor : r);
  return tokenStr(stressor.lifecycleStage) === 'emerging';
}

/**
 * heraldSectionOfRecord — file a whole inspector record, applying the STRUCTURAL
 * precedence the token map cannot express:
 *   1. a pending decision (a proposal awaiting the DM) → adjudication.
 *   2. a resolved ruling (manual or autoresolve) → adjudication (its log).
 *   3. an emerging-stage stressor / rising-pressure signal → divination (forecast).
 *   4. an authored Wizard News receipt with a valid governed `section` keeps it.
 *   5. otherwise → SECTION_OF(routingKeyOf(record)) — filed by content.
 *
 * The status / lifecycleStage fields decide steps 1-3 on their own. A caller that
 * already knows a record's role does NOT tag it with a marker key — the three
 * `__`-prefixed marker arms that once offered that were deleted as writerless (see
 * the note above isPendingDecision); heraldFeed pins a section by passing
 * `toHeraldItem`'s `forced` argument, which never touches the record's own shape.
 *
 * @param {Record<string, unknown>} [record]
 * @returns {HeraldSection}
 */
export function heraldSectionOfRecord(record = {}) {
  const r = record || {};
  if (isPendingDecision(r) || isResolution(r)) return 'adjudication';
  if (isEmergingForecast(r)) return 'divination';
  const supplied = tokenStr(r.section);
  if ((r.sectionAuthority === 'war_rulings_registry'
      || r.sectionAuthority === 'war_coalition_registry'
      || r.sectionAuthority === 'envoy_registry'
      // WR-10. Five of the sovereignty market's fifteen kinds cannot be filed by their
      // token: SECTION_OF structurally never returns `adjudication`, so the cession, the
      // bought seat, the kinship refusal and the books divergence would all land in the
      // events catch-all, and the faith-desk judgment would only agree by coincidence.
      // Without this token those five file wrong while compiling and passing.
      || r.sectionAuthority === 'sovereignty_registry')
    && HERALD_SECTIONS.includes(/** @type {HeraldSection} */ (supplied))) {
    return /** @type {HeraldSection} */ (supplied);
  }
  return SECTION_OF(routingKeyOf(r));
}

/**
 * THE KIND_SECTION CORRESPONDENCE (seed + divergence record). Maps each of the
 * precedent letter sections (chroniclersLetter.js KIND_SECTION) to its Herald
 * successor, and records every INTENTIONAL per-kind divergence so the walker can pin
 * both tables consistent. Documentation + a walker anchor; not read at runtime.
 * @type {Readonly<Record<string, HeraldSection | 'split'>>}
 */
export const KIND_SECTION_CORRESPONDENCE = Object.freeze(/** @type {Record<string, HeraldSection | 'split'>} */ ({
  wars: 'war',        // wars → war (1:1)
  courts: 'events',   // courts (power / judgment / persons) → events (no politics door)
  trade: 'trade',     // trade → trade (1:1)
  traditions: 'split', // traditions → SPLIT: deity/pantheon beats → faith; custom/tradition beats → events
  mercy: 'events',    // mercy (relief given / refused) → events
}));

/**
 * The per-kind divergences from KIND_SECTION, each a recorded JUDGMENT (vetoable).
 * The walker asserts these are the ONLY kinds where SECTION_OF disagrees with the
 * KIND_SECTION-successor mapping — a new silent divergence fails it.
 * @type {Readonly<Record<string, HeraldSection>>}
 */
export const KIND_SECTION_DIVERGENCES = Object.freeze(/** @type {Record<string, HeraldSection>} */ ({
  // KIND_SECTION filed this under `wars`; the Herald reads a settlement's end by its
  // own nature — a calamitous event, not always war (JUDGMENT, vetoable).
  settlement_terminal_death: 'events',
  // KIND_SECTION filed this under `courts`; a tribute extraction is an economic
  // relation, so the Herald files it under trade (JUDGMENT, vetoable).
  vassal_tribute_extraction: 'trade',
  // KIND_SECTION filed this under `courts`; the Herald reads a signed treaty by what
  // it changes — terms, tribute, trade normalization — and its ONLY producer is the
  // treaty signing beat, whose kind-row (treaty_signed) already files trade. Both of
  // the beat's routing keys now agree (JUDGMENT 2026-07-31, vetoable; queued for
  // Fable re-examination in docs/FABLE_VALIDATION_QUEUE.md).
  diplomacy: 'trade',
  // KIND_SECTION files an oathbreaking under `courts`; the Herald files the
  // repudiated treaty beside the terms and tribute it extinguishes (JUDGMENT,
  // vetoable), matching treaty_signed and diplomacy.
  treaty_breached: 'trade',
  // KIND_SECTION files both GR-0 lifecycle beats under `courts`, beside the oathbreaking
  // they sit next to in the letter; the Herald files them beside the terms and tribute
  // they retire and the shortfall they name (JUDGMENT, vetoable), matching treaty_signed,
  // diplomacy and treaty_breached. The whole treaty cohort keeps one desk.
  treaty_lapsed: 'trade',
  treaty_default_detected: 'trade',
  // IN-0C, and the divergence has the same reason the two above do: the letter files a
  // compelled disclosure under `courts` with the oathbreaking, while the Herald files it
  // beside the terms it was signed with (JUDGMENT, vetoable — the cohort keeps one desk).
  treaty_disclosure_opened: 'trade',
  // GR-4b, and the same divergence for the same reason: the letter files a torn-up oath
  // under `courts` beside the oathbreaking it plainly is, while the Herald files it beside
  // the terms and tribute it extinguishes (JUDGMENT, vetoable — one desk for the cohort).
  disavowed_by_succession: 'trade',
  // GR-4b-iii-a: the letter files the court's question under `courts`; the Herald files
  // the still-live instrument with the treaty cohort (JUDGMENT, vetoable).
  succession_question_opened: 'trade',
  // NB: cause_lifecycle and moral_reckoning are `traditions` keys, and `traditions`
  // is a documented SPLIT (faith | events) — routing them to events is a split
  // outcome, not a divergence, so they are deliberately NOT listed here.
}));
