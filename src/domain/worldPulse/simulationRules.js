export const PROPAGATION_MODES = Object.freeze(['off', 'local', 'first_order', 'full']);
export const SIMULATION_INTENSITIES = Object.freeze(['conservative', 'normal', 'dramatic']);
export const MIGRATION_MODES = Object.freeze(['roll', 'void', 'distributed', 'concentrated']);
export const SIMULATION_RULES_SCHEMA_VERSION = 1;
export const CUSTOM_SIMULATION_PRESET_ID = 'custom';
export const DEFAULT_SIMULATION_PRESET_ID = 'realistic_regional';
// ── Simulation-profile axes (Phase 5.5 CL-0, design §11) ────────────────────
// The four §11 political-autonomy modes, all live today: dm_only /
// recommendations force EVERY candidate to a DM proposal; routine is TODAY'S
// behavior (majors propose, routine consequences auto-apply); full is the
// legacy flag-off behavior. The other profile axes (worldProgression /
// spatialMode / travelMode / infoMode) accept only today's meaningful values —
// forward values FAIL CLOSED to the safe default in the normalizer (the
// richer catalogs + the dependency-gating matrix live in the lazily-loaded
// simulationProfile.js so first paint carries none of it).
export const POLITICAL_AUTONOMY_MODES = Object.freeze(['dm_only', 'recommendations', 'routine', 'full']);
export const SIMULATION_PROFILE_VERSION = 1;
// The profile keys are VIRTUAL until touched: normalizeSimulationRules strips
// them from its output when the INPUT carries none, so a campaign that never
// touched the new controls persists byte-identically to today (the CL-0
// constitutional law). Touch ANY profile key and the whole profile
// materializes, canonical and versioned.
// The default profile — spread into DEFAULT_SIMULATION_RULES and reused by the
// normalizer's fail-closed materialize branch (spatial/travel/info accept only
// these values today; worldProgression/politicalAutonomy override on top).
const PROFILE_DEFAULTS = Object.freeze({
  worldProgression: 'dm_advanced',
  politicalAutonomy: 'routine',
  spatialMode: 'ignore',
  travelMode: 'instant',
  infoMode: 'omniscient',
  profileVersion: SIMULATION_PROFILE_VERSION,
});
export const PROFILE_KEYS = Object.freeze(Object.keys(PROFILE_DEFAULTS));

export const DEFAULT_SIMULATION_RULES = Object.freeze({
  schemaVersion: SIMULATION_RULES_SCHEMA_VERSION,
  presetId: DEFAULT_SIMULATION_PRESET_ID,
  propagationMode: 'first_order',
  intensity: 'conservative',
  stressorsEnabled: true,
  emergentEventsEnabled: true,
  relationshipDynamicsEnabled: true,
  npcAgencyEnabled: true,
  factionCompetitionEnabled: true,
  populationDynamicsEnabled: true,
  migrationFlowsEnabled: true,
  tradeFlowsEnabled: true,
  resourceDriftEnabled: true,
  tierDriftEnabled: true,
  institutionLifecycleEnabled: true,
  majorChangesRequireProposal: true,
  // Geopolitical war + trade-war layer — opt-in, DEFAULT FALSE so every existing
  // campaign is byte-identical. Flip to true for NEW campaigns once the convergence
  // + soak suites are green (see SUBSYSTEM_INTEGRATION_PLAN). Because every named
  // preset spreads DEFAULT_SIMULATION_RULES, all presets inherit it and presetId
  // stays stable (guarded by simulationRulesPreset.stability.test).
  warLayerEnabled: false,
  // The settlement strategy chooser. Opt-in, DEFAULT FALSE so
  // every existing campaign is byte-identical (no strategy candidates emitted).
  // Like warLayerEnabled, every named preset spreads DEFAULT_SIMULATION_RULES so
  // all presets inherit it and presetId stays stable (guarded by
  // simulationRulesPreset.stability.test).
  settlementStrategyEnabled: false,
  // Faith SPREAD: cross-settlement faith propagation only — carrier reach into
  // OTHER settlements, religious_authority mints, regional prevalence, neighbour
  // recognition, occupation faith-pull. Opt-in, DEFAULT FALSE. This is the ONLY
  // faith dynamic still gated by a rule flag: per-settlement LOCAL faith (contest /
  // legitimacy / patron / divine mandate) is now gated by deity presence ALONE
  // (isSubsystemActive) — the owner's standalone-faith contract. So a deity-bearing
  // campaign with spread OFF still evolves each settlement's pantheon in place; it
  // just never crosses a settlement boundary. Deity-free ⇒ byte-identical either
  // way (the activation gate short-circuits before any fork/mint). Every named
  // preset spreads DEFAULT_SIMULATION_RULES so all presets inherit it and presetId
  // stays stable (guarded by simulationRulesPreset.stability.test).
  faithSpreadEnabled: false,
  // LEGACY (Phase 4 W-F1 migration, ratification 2): `religionDynamicsEnabled`
  // pre-split gated ALL faith dynamics. It now maps to faithSpreadEnabled (the
  // SPREAD lane) via the tolerant reader in normalizeSimulationRules — the two keys
  // are kept in lockstep through the deprecation window (deleted in the Phase 6
  // lifecycle pass). Retained default-false so old saves + the not-yet-migrated
  // Living-World gate keep working. Preset-stable (inherited false everywhere).
  religionDynamicsEnabled: false,
  // Defender-side siege attrition (SPIKE). Opt-in, DEFAULT FALSE so every existing
  // campaign is byte-identical (a besieged town's home defense stays a fresh per-tick
  // computation). When true, a besieged settlement accrues an eroding defensive-losses
  // ledger that feeds the siege verdict — a game-balance change gated behind the soak's
  // convergence flags before it graduates. Inherited false by every preset (stability-guarded).
  defenderAttritionEnabled: false,
  // War-economy population drain (P1). Opt-in, DEFAULT FALSE so every existing campaign
  // is byte-identical (deploying an army moves no real population/food). When true, a
  // deployed army conscripts population from its home each tick (a conserved debit) and
  // returns the survivors when it comes home — so war costs blood, and the books balance
  // (deployed − returned === war dead). Nested under warLayerEnabled. Inherited false by
  // every preset (stability-guarded).
  warEconomyDrainEnabled: false,
  // Two-track defender resolve (P4). Opt-in, DEFAULT FALSE ⇒ byte-identical (the siege
  // verdict uses capacity alone). When true, a besieged town's WILL to resist — composed
  // from leadership/faith temperament (facets.will), legitimacy, food/supply, and hope
  // (the odds it faces) — biases the siege roll, and a fully-broken will (starving +
  // illegitimate + pacifist + hopeless) CAPITULATES deterministically (surrender, not a
  // storm). Complements defenderAttritionEnabled (capacity erosion). Preset-stable.
  defenderResolveEnabled: false,
  // War-disposition political flywheel (P2). Opt-in, DEFAULT FALSE ⇒ byte-identical (the
  // coup verdict ignores war sentiment). When true, an unpopular/exhausting war shifts the
  // ruling seat's hold-chance: a warlike regime waging a sustainable war is steadier, while
  // war-weariness (the exhaustion scar) erodes the seat and makes a coup — an internal
  // "end the war" — more likely. So an overextended aggressor can lose on its OWN home
  // front. Nested under warLayerEnabled. Preset-stable.
  warDispositionEnabled: false,
  // Ally defense (P3). Opt-in, DEFAULT FALSE ⇒ byte-identical (a besieged town defends
  // alone). When true, a target's allied / vassal / patron neighbours that are not
  // themselves under siege send relief — a fraction of their home defense — bolstering
  // the defender in the siege verdict, so alliances matter at the walls. Preset-stable.
  allyDefenseEnabled: false,
  // Sack & forage (P3). Opt-in, DEFAULT FALSE ⇒ byte-identical (a stormed town keeps its
  // people intact under occupation, ready to rebel). When true, a CONQUEST carries off a
  // fraction of the conquered population as a CONSERVED transfer with a war-dead sink —
  // some are pressed into service and marched to the victor's home (spoils), the rest are
  // killed or scattered — so a siege finally costs the conquered real blood and rewards
  // the victor — and it loots the granary (a conserved storageMonths transfer). The deltas
  // ride the conquest outcome, so a dismissed/deferred conquest withholds the sack
  // atomically (no phantom population/food). Preset-stable.
  warForageEnabled: false,
  // War levy (F2). Opt-in, DEFAULT FALSE ⇒ byte-identical (a warring settlement raises its
  // army from its own home alone). When true, a settlement fielding an army also LEVIES men
  // and grain from its non-besieged vassal / allied neighbours each tick — a CONSERVED
  // transfer (the vassal's people join the overlord's army, its granary feeds the war) at a
  // LOYALTY cost: the levied vassal accrues war-weariness, so an over-drawn client turns
  // rebellious (and, with warDispositionEnabled, more couplable — it can end the arrangement
  // by coup). Nested under warLayerEnabled. Preset-stable.
  warLevyEnabled: false,
  // Supply-gap deployed quality (W-C1 item 3). Opt-in, DEFAULT FALSE ⇒ byte-identical (a
  // supply-starved war economy fields the same army as a self-sufficient arsenal — the gap
  // this closes). When true, a settlement's deployed force strength + attrition-mitigating
  // kit scale by its war-supply completeness (supplyCompleteness over the core war kit),
  // floored so a chainless settlement still fields a degraded force. Does NOT feed readiness
  // (training vs kit). Nested under warLayerEnabled. Preset-stable.
  warSupplyQualityEnabled: false,
  // SEASONS-A: the aspatial food year (season clock, renewable cycling, granary
  // rhythm, seeded inter-annual variance, seasonal texture). Opt-in, DEFAULT
  // FALSE ⇒ byte-identical (no fields, no draws, no reads on the off path).
  // Lit by living_realm + full_simulation. Preset-stable (inherited false).
  seasonsEnabled: false,
  migrationMode: 'roll',
  // ── Simulation profile (CL-0) — the §11 control axes at today's build ──────
  // These defaults ARE today's engine: DM-advanced progression (every advance is
  // a DM action), routine political autonomy (majors propose, routine
  // consequences apply), no geography, instant travel, omniscient information.
  // VIRTUAL for untouched campaigns: the normalizer strips them from its output
  // when the input carries none (see PROFILE_KEYS above), so their presence in
  // this default object adds NO persisted bytes to a legacy save. Shared with
  // the normalizer's materialize branch via PROFILE_DEFAULTS below.
  ...PROFILE_DEFAULTS,
});

/**
 * ENGINE-GATED VIRTUAL RULE KEYS (chair ruling CR-WR10-C, 2026-08-04).
 *
 * A VIRTUAL key is one the engine strictly gates on (`rules.<key> === true`) while
 * appearing in NEITHER `DEFAULT_SIMULATION_RULES` NOR any preset override spread —
 * the deep-couplings law-1 idiom, whose whole point is that a dark layer costs a
 * campaign zero persisted bytes. The certification census
 * (`subsystemCertification.simulationRuleKeys`) reads exactly those two surfaces,
 * so a virtual key was invisible to it and its subsystem could never be certified.
 *
 * The WR-9a fork offered two cures: declare each key `false` in the
 * `full_simulation` spread (+32 serialized bytes per key on every NEW campaign, a
 * moved new-campaign state hash) or teach the census to enumerate the keys the
 * engine actually gates on (zero bytes on every path). CR-WR10-C ruled the second.
 * This list is that enumeration: it is UNIONED INTO THE CENSUS ONLY. Nothing here
 * is written into a rules object, spread into a preset, or persisted — declaring a
 * key here moves no world byte in any campaign, installed or new.
 *
 * MEMBERSHIP IS NOT A JUDGMENT CALL: a key belongs here when `src/` gates on it
 * with the strict idiom and neither surface above declares it.
 * `tests/lint/engineGatedRuleKeys.walker.test.js` source-scans the tree and proves
 * the list BOTH ways — every member is really gated, and every gated-but-undeclared
 * key is really accounted for — so this cannot drift into fiction in either
 * direction. A member also owes a certification row (or a declared pending entry);
 * the totality walker demands it the moment the census grows.
 *
 * @type {ReadonlyArray<string>}
 */
export const ENGINE_GATED_VIRTUAL_RULE_KEYS = Object.freeze([
  'beliefAxesEnabled',
  // Joined 2026-08-05 by FP wave SP-B under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), all three in the SAME commit as their first real gate reads — the three
  // by-name strict reads inside beliefAxes.subjectAxesActive, which is the ONE door the
  // subject families pass through — and their three authored certification rows. Each is
  // a CONJUNCTION with beliefAxesEnabled (a family cannot be lit under dark axes), which
  // is why the by-name read matters: a frozen-list `.every()` would hide all three from
  // this census.
  'believedConditionsEnabled',
  'believedDevotionEnabled',
  'believedScarcityEnabled',
  // Joined 2026-08-04 by FP wave TR-1 under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate reads — commercialReasons.js's
  // own `casusCommerciiActive` and tradeWar.js's severance-magnitude seam, both read by
  // name with the strict `=== true` idiom — and its declared-pending certification entry
  // (TR architecture Q4: each TR wave lands PENDING, TR-9 converts all eight to rows, so
  // certification tracks reality instead of preceding it).
  'casusCommerciiEnabled',
  'conquestDoctrineEnabled',
  // Joined 2026-08-06 by FP wave SP-D under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate read
  // (errandMint.errandSpineActive, the ONE `=== true` by-name read of this key in the
  // tree) and its AUTHORED certification row. TWO FILES NAME THIS KEY AND ONLY ONE OF
  // THEM IS A GATE ON THIS LAYER: espionage/espionageGate.js reads `!== true` as a
  // LIGHTING-ORDER precondition — ES-0 refusing to host missions on a spine that is not
  // lit — and that negative spelling was written deliberately, at a commit where this
  // key had no manifest entry to justify a positive one. Both doors are pinned with
  // their exact polarity in tests/property/errandSpineDormancyFence.test.js, so a third
  // site or a flipped form reds.
  'errandSpineEnabled',
  // Joined 2026-08-05 by FP wave ES-0 under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate read
  // (espionage/espionageGate.espionageActive, read BY NAME with the strict === true
  // idiom) and its AUTHORED certification row — never a pending entry, because
  // manifesting is itself the act that makes a virtual key censusable and therefore the
  // act that comes due. The gate is a THREE-DOOR conjunction (beliefs live, the errand
  // spine lit, then the flag); the by-name read is what keeps all three visible to the
  // engine-gated-key census, which a frozen-list `.every()` would hide.
  'espionageEnabled',
  'infoStatecraftEnabled',
  'migrationRumorsEnabled',
  // Joined 2026-08-04 by FP wave GR-1 under CR-WR10-C item 4 (the compiled charter's
  // §3 flag law), in the SAME commit as its first real gate read
  // (oathHolder.oathHolderActive, read by name) and its certification row.
  'oathHolderEnabled',
  // Joined 2026-08-06 by FP wave GR-2 under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate read
  // (pactProposals.pactFormationActive, the ONE `pactFormationEnabled === true` in the
  // tree) and its AUTHORED certification row. THE GATE SITS AT THE LEDGER'S ONE WRITER
  // rather than in a file named for the flag, which is the errandSpineActive precedent:
  // the key governs `spatialLedgers.pactProposals`, and a gate standing at that door is a
  // gate nothing can write past. Read by NAME because a frozen-list `.every()` conjunction
  // is a computed member access that attributes to no key and would hide a fully wired flag
  // from this very census; read ONCE because two doors on one flag is how a deleted guard
  // hides behind a surviving one.
  'pactFormationEnabled',
  // Joined 2026-08-12 by FP wave IN-1a under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate read
  // (secondOrderBelief.secondOrderBeliefActive, the ONE `=== true` by-name read of this
  // key in the tree) and its AUTHORED certification row — never a pending entry. ⚠ ITS
  // DORMANCY POSTURE NARROWED WHEN IN-1b LANDED THE STANDING LINE: the mirror is no longer
  // a leaf without callers, and the world is still unmoved in both flag states because the
  // subsystem writes nothing at all. What a dark world now rests on is the gate at the
  // collector plus the identity absence rule, which together let the one consumer — the
  // render-time read-model src/domain/display/neighbourMirror.js — answer an empty list and
  // render no section without ever reading this key itself.
  'secondOrderBeliefEnabled',
  // Joined 2026-08-14 by GAP-1 under OWNER_DECISION_QUEUE §32 ruling 1, with its
  // AUTHORED certification row in the same commit. ⚠ UNLIKE EVERY KEY ABOVE IT, THIS
  // ONE DID NOT ARRIVE WITH ITS FIRST GATE READ — the read has been in the tree since
  // the layer landed, and it was INVISIBLE to the census walker because the walker's
  // detector pinned its receiver to the two literal tokens `rules` and
  // `simulationRules`. This gate is spelled through a JSDoc-cast alias local
  // (`const r = /** @type … */ (rules); r.settlementPoliticsEnabled === true` in
  // settlementPolitics.settlementPoliticsActive), which the widened three-arm detector
  // now reaches. So the atomicity law is satisfied in its spirit rather than its
  // letter: the manifest entry and the row land in the same commit as the DETECTION.
  // ⚠ The gate is a CONJUNCTION with factionCompetitionEnabled, which is
  // DEFAULT_SIMULATION_RULES-declared true and lit at full_simulation, so lighting this
  // key alone genuinely lights the layer — and the row says so.
  'settlementPoliticsEnabled',
  // Joined 2026-08-04 by lane WW-A under CR-WR10-C item 4, in the SAME commit as its
  // first real gate read (sovereigntyAssets.sovereigntyTradeActive) and its
  // certification row — certification tracking reality instead of preceding it.
  'sovereigntyTradeEnabled',
  // Joined 2026-08-06 by FP wave SP-C under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate read
  // (strategicPosture.strategicPostureActive, the ONE by-name strict read of this key in
  // the tree) and its AUTHORED certification row. The writer it governs — the appetite
  // facet on dispositionStats — sits inside the WR-2 channel writer's lit arm, so the
  // gate is a TWO-DOOR conjunction and each door is pinned separately; the by-name read
  // is what keeps this key visible to the engine-gated-key census, which a frozen-list
  // `.every()` would hide.
  'strategicPostureEnabled',
  // Joined 2026-08-04 by FP wave GR-0 under CR-WR10-C item 4 (the compiled charter's §3
  // flag law), in the SAME commit as its first real gate read
  // (treatyLifecycleVoice.treatyLifecycleVoiceActive, read by name with the strict
  // === true idiom) and its certification row.
  'treatyLifecycleVoiceEnabled',
  // Joined 2026-08-14 by GAP-1 under OWNER_DECISION_QUEUE §32 ruling 1, with its
  // AUTHORED certification row in the same commit, and on the same footing as
  // settlementPoliticsEnabled above: the gate read is not new, the DETECTION is. This
  // one is spelled as a `||`-defaulted parenthesised receiver expression —
  // `(context.simulationRules || worldState?.simulationRules || {})
  // .underwaysOrganicFoundingEnabled === true` in
  // institutionLifecycle.evaluateInstitutionLifecycle — which the canonical-receiver
  // regex could not see at all.
  // ⚠ IT IS THE REASON THIS KEY TOOK A ROW RATHER THAN AN EXEMPTION: the flag threads
  // `underwaysFoundingLit` into detectInstitutionGaps, where it opens an ADDITIONAL gap
  // candidate at village tier and above that becomes a real institution. It writes a
  // real container, so exempting it would have been the R19 shrug the exempt list's own
  // comment exists to refuse.
  'underwaysOrganicFoundingEnabled',
]);

/**
 * Compact preset constructor — every preset spreads DEFAULT_SIMULATION_RULES so
 * new flags inherit their defaults and presetId stays stable (guarded by
 * simulationRulesPreset.stability.test). NOTE the catalog carries NO summary
 * copy since CL-0: the dialog owns its fiction-level card copy (lazy chunk) and
 * nothing else consumed `summary` — this catalog rides the byte-budgeted
 * first-paint entry closure, so dead display strings were dropped.
 * @param {string} id
 * @param {string} label
 * @param {Record<string, unknown>} [overrides]
 */
function preset(id, label, overrides = {}) {
  return Object.freeze({
    id, label,
    rules: Object.freeze({ ...DEFAULT_SIMULATION_RULES, presetId: id, ...overrides }),
  });
}

// Shared override shapes (byte-budget dedupe; every key already exists in
// DEFAULT_SIMULATION_RULES, so spreads never change preset key order): QUIET =
// the low-volatility local world (quiet_local / narrative_campaign); OPEN =
// the no-approval wide world (dramatic_campaign / full_simulation).
const QUIET = Object.freeze({
  propagationMode: 'local',
  intensity: 'conservative',
  migrationFlowsEnabled: false,
  migrationMode: 'void',
});
const OPEN = Object.freeze({
  propagationMode: 'full',
  majorChangesRequireProposal: false,
  politicalAutonomy: 'full',
  migrationMode: 'distributed',
});

// ── THE NINE ENGINE-WAVE GATES (W-R2-LIGHT owner ruling, 2026-07-16) ──────────
// The post-close anti-stasis stack's virtual gate flags, lit TOGETHER in the
// three world-alive presets (dramatic_campaign / living_realm / full_simulation).
// Like disastersEnabled / commodityFlowEnabled, these keys are ABSENT from
// DEFAULT_SIMULATION_RULES — VIRTUAL, so they ride the ...overrides spread and add
// NO persisted bytes to an existing campaign (normalize({}) carries none; the
// engine gates read `=== true`, absent ⇒ dormant no-op ⇒ every dark-config golden
// byte-identical). They are NOT RULE_COMPARISON_KEYS (not in DEFAULT), so preset
// IDENTITY is unaffected: a legacy save missing them still infers its preset (the
// disastersEnabled precedent). intervention/peaceEngine/supplyWebWarfare are
// additionally AND-gated with warLayerEnabled (lit in all three); naval also needs
// a spatially-canonized realm at runtime. Shared object (the QUIET/OPEN dedupe
// idiom) so "the nine" have one source of truth. Byte-budget: the preset catalog
// rides the eager store slice (normalizeSimulationRules → presetIdForRules), so
// this adds a measured +252 B to the first-paint closure — well inside its margin.
const WAVES = Object.freeze({
  momentumEnabled: true,
  navalEnabled: true,
  interventionEnabled: true,
  settlementLifecycleEnabled: true,
  peaceEngineEnabled: true,
  supplyWebWarfareEnabled: true,
  upswingArcsEnabled: true,
  resourceDynamicsEnabled: true,
  constructiveFlowsEnabled: true,
});

// ── THE ONE REGEN — EIGHT ENGINE LIFTS + THE ROADS ADJUNCT (2026-07-28) ─────
// These are the eight chartered dark engines, plus roadsEnabled (the later
// owner-ratified adjunct), lit together at the single declared golden boundary.
// They stay VIRTUAL: adding them to DEFAULT_SIMULATION_RULES would serialize new
// bytes into legacy saves and enlist them in BOOLEAN_KEYS/RULE_COMPARISON_KEYS,
// collapsing preset identity. Like WAVES, they therefore ride only the preset
// override spread and every gate reads `=== true`.
//
// memoryWeaveEnabled is deliberately NOT a member. It belongs to the separately
// commissioned deep-couplings cohort, whose One-Regen membership remains dark.
const ONE_REGEN = Object.freeze({
  distancePricedNewsEnabled: true,
  reframeEnabled: true,
  provenanceLedgerEnabled: true,
  urbanFabricEnabled: true,
  npcGrowthEnabled: true,
  spatialConsequenceEnabled: true,
  npcLadderEnabled: true,
  traditionsEnabled: true,
  roadsEnabled: true,
});

// ── THE NEUTRAL-CONNECTED DEFAULT (realm directive 2 / J-D2, 2026-07-31) ────
// `neutralNeighborsEnabled` is a VIRTUAL flag of the same class as WAVES /
// ONE_REGEN / memoryWeaveEnabled: NO entry in DEFAULT_SIMULATION_RULES, read
// `=== true` at its single seam (region/neutralNeighbourEdges.js, wired into
// buildWorldSnapshot). Lit, it gives each campaign member a neutral, channel-less
// regional edge to its K NEAREST fellows, which RAISES cross-settlement
// interaction density by design (the small-N stasis evidence).
//
// DELIBERATELY LIT IN NO PRESET (recorded, not an oversight) — and the blocker
// is ASYMPTOTIC, not merely a golden re-record. MEASURED 2026-07-31 (B1): adding
// `neutralNeighborsEnabled: true` to the ONE_REGEN spread (so the three
// world-alive presets carry it) REDS tests/perf/tickScanBudget.test.js —
// "scanOps grew 3.320x (1007 -> 3343) when S doubled (> 2.6)". The reason was
// structural: B1's default CONNECTED EVERY PAIR, so the regional graph became
// COMPLETE and its edge count C(S,2) — quadratic in settlements.
//
// B1b (2026-07-31) FIXED THE POPULATION AND RE-MEASURED. The pair selection is now
// k-NEAREST (k=3, region/neutralNeighbourEdges.js), and the edge population is
// LINEAR: the selection takes 6 / 16 / 31 pairs at S = 4 / 8 / 16 against a
// complete graph's 6 / 28 / 120, always within S·k. THE RATCHET IS STILL RED WHEN
// LIT — measured on the same fixture, 12 ticks, full_simulation rules:
//     dark            scanOps 1205 / 2521 /  5893   ratios 4→8 2.092  8→16 2.338
//     lit  k-nearest  scanOps 1007 / 3918 / 10266   ratios 4→8 3.891  8→16 2.620
//     lit  all-pairs  scanOps 1001 / 3315 / 11913   ratios 4→8 3.312  8→16 3.594
// So k-nearest genuinely beats all-pairs where the asymptote lives (8→16: 2.620 vs
// 3.594, with 46 edges instead of 128), yet no lit window clears the 2.6 ceiling.
// The 4→8 window in particular is STRUCTURALLY UNWINNABLE while J-D2 requires the
// default to be COMPLETE at S <= 4: the lit S=4 fixture is already saturated (7 → 8
// edges, +1) while lit S=8 gains +9, so lighting can only inflate that ratio, no
// matter how small k is. The ceiling itself is a 4→8 calibration against the DARK
// fixture's density, not a scale-free law — the dark ratio climbs too (2.092 →
// 2.338 at 8→16).
//
// Realm-wide lighting therefore remains a PERFORMANCE-ARCHITECTURE decision
// (OWNER-GATED): it requires re-calibrating what tickScanBudget measures — either
// a window/ceiling that admits the lit density, or the remaining unpriced shape
// (make the default edge a lighter class the hot indices skip, so a defaulted pair
// costs nothing until it evolves). Until one is chosen and measured, the flag
// stays dark and the engine keeps its ceiling. (The T5 charter flags were also lit
// only at "the single declared golden boundary" — the ONE REGEN batch — so a
// mid-wave lighting would be off-sequence regardless.)
//
// KEY ORDER IS LOAD-BEARING: presetIdForRules INFERS by first structural match,
// so the LEGACY trio (quiet_local / realistic_regional / dramatic_campaign —
// resolvable forever: old saves carry their ids, the realm toolbar chips apply
// them, but the CL-0 dialog grid surfaces only the four §11 presets) stays
// FIRST — a keyless legacy save whose rules match the defaults must keep
// inferring 'realistic_regional' (byte-identical presetId), never
// 'living_realm' (identical until SEASONS-A lit seasonsEnabled there). The
// four §11 presets follow; their still-locked forward axes (spatial / travel /
// progression) ride at the default spread's values, and the UNLOCKED infoMode
// (STEP 3.5: living_realm → perfect_delayed, full_simulation → unreliable) is
// deliberately NOT a comparison key, so preset identity survives as axes light
// up in later waves (a pre-3.5 save carrying living_realm with the old
// omniscient clamp keeps its presetId — byte-identical). dramatic_campaign
// carries an explicit politicalAutonomy:'full' so its profile view agrees with
// its flag-off rules (the normalizer's flag↔autonomy lockstep would otherwise
// see a conflict).
export const SIMULATION_RULE_PRESETS = Object.freeze({
  quiet_local: preset('quiet_local', 'Quiet Local', {
    ...QUIET,
    // The tempo governor is a presentation/backpressure layer over real state
    // changes: quiet worlds still simulate, but independent drama births arrive
    // at the quietest supported cadence.
    narrativeTempo: 'quiet_local',
    factionCompetitionEnabled: false,
    tradeFlowsEnabled: false,
  }),
  realistic_regional: preset(DEFAULT_SIMULATION_PRESET_ID, 'Realistic Regional', {
    narrativeTempo: 'realistic_regional',
  }),
  dramatic_campaign: preset('dramatic_campaign', 'Dramatic Campaign', {
    ...OPEN,
    intensity: 'dramatic',
    narrativeTempo: 'dramatic_campaign',
    // Owner ruling (golden sign-off — LIGHT EVERYTHING RECOMMENDED): dramatic_campaign
    // now carries the real drama set — a running war layer, settlement war strategy,
    // faith spread, seasons, and calamities. It stays LIGHTER than full_simulation
    // (no deep war sub-flags / religionDynamics ceiling). commodityFlowEnabled stays
    // OPT-IN (not lit here) per owner design; disastersEnabled is an opt-in key absent
    // from DEFAULT_SIMULATION_RULES, so it rides the overrides spread.
    warLayerEnabled: true,
    settlementStrategyEnabled: true,
    faithSpreadEnabled: true,
    // The normalizer keeps faithSpreadEnabled in LOCKSTEP with the legacy mirror
    // religionDynamicsEnabled (the legacy key is authoritative when explicitly set),
    // so lighting spread REQUIRES both true — otherwise the inherited default-false
    // legacy key drags faithSpreadEnabled back off and the preset no longer round-trips
    // to its own id (matches full_simulation, which sets both).
    religionDynamicsEnabled: true,
    seasonsEnabled: true,
    disastersEnabled: true,
    // W-R2-LIGHT: the nine engine-wave gates — dramatic_campaign is a world-alive
    // preset, so it runs the full anti-stasis stack (virtual flags; see WAVES).
    ...WAVES,
    // T5 THE ONE REGEN: the chartered eight engine lifts plus Roads.
    ...ONE_REGEN,
  }),
  static_campaign: preset('static_campaign', 'Static Campaign', {
    propagationMode: 'off',
    intensity: 'conservative',
    stressorsEnabled: false,
    emergentEventsEnabled: false,
    relationshipDynamicsEnabled: false,
    npcAgencyEnabled: false,
    factionCompetitionEnabled: false,
    populationDynamicsEnabled: false,
    migrationFlowsEnabled: false,
    tradeFlowsEnabled: false,
    resourceDriftEnabled: false,
    tierDriftEnabled: false,
    institutionLifecycleEnabled: false,
    migrationMode: 'void',
    politicalAutonomy: 'dm_only',
  }),
  narrative_campaign: preset('narrative_campaign', 'Narrative Campaign', {
    ...QUIET,
    narrativeTempo: 'quiet_local',
    politicalAutonomy: 'recommendations',
  }),
  living_realm: preset('living_realm', 'Living Realm', {
    // Living Realm keeps the measured regional cadence; its distinction from
    // Full Simulation is depth/autonomy, not a noisier Chronicle.
    narrativeTempo: 'realistic_regional',
    politicalAutonomy: 'routine',
    seasonsEnabled: true,
    // STEP 3.5: the §11 sleeper — true news that travels by road. Inert until
    // the realm canonizes a spatial digest (the engine gate); NOT a comparison
    // key, so pre-3.5 saves carrying this preset keep their identity.
    infoMode: 'perfect_delayed',
    // W-R2-LIGHT: a "living realm" without the living-engine waves would lie — its
    // distinction from full_simulation is APPROVAL POSTURE (routine autonomy), not
    // engine depth, so it runs the same nine engine-wave gates (owner ruling).
    // warLayerEnabled stays inherited-false, so the three warLayer-AND-gated waves
    // (intervention/peaceEngine/supplyWebWarfare) sleep here until war is lit —
    // living_realm's world moves, but does not start wars on its own.
    ...WAVES,
    ...ONE_REGEN,
  }),
  full_simulation: preset('full_simulation', 'Full Simulation', {
    ...OPEN,
    intensity: 'normal',
    // E0 graduated from opt-in-only after the behavioral observer proved that
    // the everything-on preset otherwise bypassed its own Chronicle governor.
    narrativeTempo: 'full_simulation',
    warLayerEnabled: true,
    settlementStrategyEnabled: true,
    faithSpreadEnabled: true,
    religionDynamicsEnabled: true,
    // W0-A3: Full Simulation is the CEILING (§11 "Dwarf Fortress mode") — the
    // whole war stack runs at depth, so the eight war sub-flags ship LIT here
    // and ONLY here (living_realm and the legacy trio inherit their defaults).
    defenderAttritionEnabled: true,
    warEconomyDrainEnabled: true,
    warSupplyQualityEnabled: true,
    defenderResolveEnabled: true,
    allyDefenseEnabled: true,
    warForageEnabled: true,
    warLevyEnabled: true,
    warDispositionEnabled: true,
    // WR-1: the pure termination read is structurally present but remains DARK
    // until its WR-9 receipt fold can measure the deciding-term distribution.
    // This virtual key is deliberately absent from DEFAULT_SIMULATION_RULES and
    // every other preset; declaring false here puts it under certification without
    // lighting behavior or changing preset inference.
    warTerminationEnabled: false,
    // WR-2: four learned disposition channels, DECLARED DARK. This virtual key is
    // absent from DEFAULT_SIMULATION_RULES and every other preset; false here makes
    // the slice visible to certification without migrating a single installed save.
    // Every gate reads `=== true`, and lighting belongs to the later measured batch.
    dispositionChannelsEnabled: false,
    // WR-3: campaign-member lineage claims and their kinship mirror, DECLARED
    // DARK. Like the WR-1/WR-2 keys above, this is virtual: absent from the
    // default bank and every other preset, false only on the ceiling so
    // certification can hold the slice without changing installed saves or
    // preset identity. The eventual read must gate on exact true; lighting waits
    // for the member-graduation seam and WR-9 story-mix evidence.
    lineageClaimEnabled: false,
    // WR-6: scored coalition calls, bilateral allied fronts, and derived
    // expenditure/settlement reads, DECLARED DARK. This virtual key is absent
    // from the default bank and every other preset; false only on the ceiling
    // makes the slice visible to subsystem certification without migrating an
    // installed save or changing preset identity. Every behavioral seam reads
    // exact true, and lighting waits for WR-9's eligible-call, decision-mix,
    // expenditure, payment, and governed-family observations.
    coalitionLedgerEnabled: false,
    // WR-7: H1-durable peace envoys moving over the lived route network,
    // DECLARED DARK. The key is virtual (absent from defaults and every other
    // preset) and every behavior mouth requires it, the war/peace stack, NPC
    // consequences, and route lifecycle to be exact true. Declaring false here
    // exposes the lane to certification without lighting it or changing preset
    // identity; WR-9 must measure the seven governed errand families first.
    envoyDiplomacyEnabled: false,
    seasonsEnabled: true,
    // Owner ruling (golden sign-off — LIGHT EVERYTHING RECOMMENDED): the ceiling
    // runs the calamity mover. disastersEnabled is an opt-in key ABSENT from
    // DEFAULT_SIMULATION_RULES (like commodityFlowEnabled), so it rides the
    // ...overrides spread; off in every other preset ⇒ the calamity kernel stays a
    // complete no-op there (aspatial + spatial goldens byte-identical).
    disastersEnabled: true,
    // M10a (CL-3): the full sim completes the info ladder — the 'full' ceiling
    // (factional beliefs + reconciliation, carried at the unreliable distortion).
    infoMode: 'full',
    // M10b: the ceiling carries its OWN story forward — autonomous advance-on-open
    // catch-up, with commodity continuity + ally-intel sharing LIT (the already-
    // built M6a/M9b features a preset must enable). commodityFlowEnabled/
    // allyIntelSharingEnabled are opt-in keys ABSENT from DEFAULT_SIMULATION_RULES,
    // so they ride the ...input spread and touch NO pinned fixture (byte-identical
    // off; lit only for a Full Simulation campaign).
    worldProgression: 'autonomous',
    commodityFlowEnabled: true,
    allyIntelSharingEnabled: true,
    // W-H1: THE NPC CONSEQUENCE ECONOMY, DECLARED DARK. `npcConsequencesEnabled` is a
    // VIRTUAL flag of the WAVES / ONE_REGEN class (no entry in DEFAULT_SIMULATION_RULES,
    // every gate reads `=== true`), and it is declared here at FALSE rather than lit.
    //
    // WHY DECLARE A FALSE KEY AT ALL. The subsystem-certification totality walker
    // partitions the rule keys reachable from DEFAULT_SIMULATION_RULES and the preset
    // override spreads; a key reachable from NEITHER is invisible to it, and a
    // subsystem behind an invisible key can ship completely dead without any check ever
    // asking (npcCredibilityEnabled is exactly that shape today, and carries no
    // certification row as a result). Declaring the key here is what puts W-H's lane
    // under the contract from its FIRST commit rather than retroactively.
    //
    // WHY FALSE IS NOT A HALF-MEASURE. Preset IDENTITY is unaffected: RULE_COMPARISON_KEYS
    // derives from DEFAULT_SIMULATION_RULES, which this key is absent from, so preset
    // inference is untouched (the disastersEnabled precedent). Every consumer reads
    // `=== true`, so a declared false is behaviourally identical to absent, and the
    // certification receipt grades this row DORMANT_BY_CONFIG — the honest verdict for a
    // dark slice, and one that becomes ALIVE-or-SILENT the moment it is lit.
    //
    // LIGHTING IT is deliberately NOT done here: it belongs at the single declared
    // golden boundary (the ONE REGEN batch discipline), after H2/H3/H4 land the verdict
    // table, circulation and the DM verbs. Flip this one value there.
    npcConsequencesEnabled: false,
    // W-J1: THE ORGANIC ROUTE LIFECYCLE, DECLARED DARK — the same shape, and for the
    // same reason, as the W-H1 declaration directly above. `routeLifecycleEnabled` is
    // a VIRTUAL flag (no DEFAULT_SIMULATION_RULES entry; every gate reads `=== true`,
    // so a declared false is behaviourally identical to absent and cannot perturb a
    // byte), declared here at FALSE so the subsystem-certification totality walker can
    // SEE the key and hold W-J's lane under the contract from its first commit.
    // Without this line the key is reachable from neither the defaults nor any preset
    // spread, the walker cannot census it, and a certification row naming it reads back
    // as `unknownRows` — measured against the live registry before this was written.
    // Preset identity is untouched: RULE_COMPARISON_KEYS derives from
    // DEFAULT_SIMULATION_RULES, which this key is absent from (the disastersEnabled
    // precedent). LIGHTING IT belongs at the declared golden boundary once J2's flows,
    // J3's charter/decay events and J4's consumers land; flip this one value there.
    routeLifecycleEnabled: false,
    // W-K1: THE MAGIC ECONOMY LANE, DECLARED DARK — the same shape, and for the same
    // reason, as the W-H1 and W-J1 declarations directly above. `magicEconomyEnabled`
    // is a VIRTUAL flag (no DEFAULT_SIMULATION_RULES entry; every gate reads
    // `=== true`, so a declared false is behaviourally identical to absent and cannot
    // perturb a byte), declared here at FALSE so the subsystem-certification totality
    // walker can SEE the key and hold W-K's lane under the contract from its first
    // commit rather than retroactively.
    //
    // THE KEY GATES MORE THAN MAGIC, DELIBERATELY. Slice K1 is the GENERAL institution
    // status system (operational/impaired/shell), which is magic-INDEPENDENT and ships
    // first precisely so every institution benefits before magic does
    // (docs/DESIGN_MAGIC_ECONOMY.md §13). It rides this key anyway because §3c's status
    // vocabulary is one of the magic economy's constitutional laws (law 1, NO
    // EXEMPTION: magic's infrastructure obeys the same status vocabulary as every
    // institution), so splitting the two behind separate switches would let a world
    // exist in which magic's infrastructure and everything else spoke different status
    // words. LIGHTING IT belongs at the declared golden boundary once K2's regimes,
    // K3's buffer and K4's substitution land; flip this one value there.
    magicEconomyEnabled: false,
    // W-I2: THE INFORMATION BROKERAGES, DECLARED DARK — the same shape, and for the same
    // reason, as the W-H1, W-J1 and W-K1 declarations directly above.
    // `informationBrokeragesEnabled` is a VIRTUAL flag (no DEFAULT_SIMULATION_RULES entry;
    // brokerageStamps.brokerageEffectsActive reads `=== true`, so a declared false is
    // behaviourally identical to absent and cannot perturb a byte), declared here at FALSE
    // so the subsystem-certification totality walker can SEE the key and hold W-I's lane
    // under the contract from the commit that first gives it effects.
    //
    // THE GATE IS A CONJUNCTION, DELIBERATELY (design Law 5): the brokerage effects need
    // this key AND infoStatecraftActive, which is itself beliefsActive plus
    // infoStatecraftEnabled. A settlement cannot grade information that its world does not
    // model as travelling, so lighting this key alone is a no-op by construction rather
    // than by a second check. LIGHTING IT belongs at the declared golden boundary once I3's
    // services and I4's market land; flip this one value there.
    informationBrokeragesEnabled: false,
    // WAVE P: THE DEMOGRAPHIC ENGINE, DECLARED DARK — the same shape, and for the same
    // reason, as the W-H1, W-J1, W-K1 and W-I2 declarations directly above.
    // `demographicsEnabled` is a VIRTUAL flag (no DEFAULT_SIMULATION_RULES entry; every
    // gate reads `=== true`, so a declared false is behaviourally identical to absent and
    // cannot perturb a byte), declared here at FALSE so the subsystem-certification
    // totality walker can SEE the key and hold wave P's lane under the contract from the
    // commit that first gives it effects.
    //
    // WHAT LIGHTING IT DOES, so the reader knows this is not a cosmetic switch: it hands
    // the population's GROWTH side to demographicsKernel.js (births minus deaths against
    // min(K_food, D_tier)) and simultaneously stops populationDynamics emitting its raw
    // proportional growth candidate. That pair is the cure for the 300-year soak's
    // unbounded x1.07/year compounding, and it is a deliberate, measurable behaviour
    // change — which is exactly why it does NOT ship lit here. LIGHTING IT belongs at the
    // owner-signed soak redo, after P2's overflow valves, P3's migration homeostat and
    // P4's stressor couplings land; flip this one value there.
    demographicsEnabled: false,
    // TC-1: THE TOWN CARTOGRAPHY PROGRAM, DECLARED DARK — the same shape, and for the
    // same reason, as the W-H1, W-J1, W-K1, W-I2 and wave-P declarations directly above.
    // `townCartographyEnabled` is a VIRTUAL flag (no DEFAULT_SIMULATION_RULES entry;
    // townCartographyActive reads `=== true`, so a declared false is behaviourally
    // identical to absent and cannot perturb a byte), declared here at FALSE so the
    // subsystem-certification totality walker can SEE the key and hold the cartography
    // lane under the contract from its FIRST commit rather than retroactively.
    //
    // A PRESENTATION-SIDE KEY IS UNUSUAL HERE, AND DELIBERATE. Every other key in this
    // object gates engine arithmetic; this one gates whether the town-scene compiler
    // emits four additional manifest layers (docs/DESIGN_TOWN_CARTOGRAPHY.md §8). It
    // still belongs in this object because the flag has to travel with the campaign's
    // rules to reach the scene compiler's authorization wall, and because a subsystem
    // whose key no census can see is exactly the shape that ships completely dead. Its
    // certification row states plainly that NO soak receipt can observe it, which is the
    // honest declaration rather than a channel this lane does not have.
    //
    // LIGHTING IT belongs at the promotion contract (design §8: local matrix, rendered
    // matrix, device evidence, a11y evidence, the owner's eye, field soak), after the
    // synthesis, painter and join slices land; flip this one value there.
    townCartographyEnabled: false,
    // MG-2: THE REALM'S MAGIC DEFAULT, DECLARED AT ITS INERT VALUE
    // (docs/DESIGN_REALM_MAGIC_TOGGLE §4). `realmMagicDefault` is a VIRTUAL key of
    // the same class as the flags above — absent from DEFAULT_SIMULATION_RULES,
    // absent from every other preset, and read `=== 'mundane'` at its single seam,
    // so the value declared here is behaviourally identical to absence and cannot
    // perturb a byte. Preset identity is untouched: RULE_COMPARISON_KEYS derives
    // from DEFAULT_SIMULATION_RULES' BOOLEAN surface, and this key is neither in
    // the defaults nor a boolean.
    //
    // IT IS NOT A SUBSYSTEM GATE, WHICH IS WHY IT CARRIES NO CERTIFICATION ROW.
    // The realm's magic answer is not consulted by any generator, mover, or
    // display path (MG-LAW-1) — it is stamped into each member's own config at
    // mint, and every consumer reads that. What survives at realm scope is a
    // DEFAULT-FOR-LATER whose one reader is the single-settlement wizard's
    // pre-selection. Declaring it here is documentation for the next reader of
    // this catalog, not a claim of engine behavior; the subsystem-certification
    // census is boolean-only (subsystemCertification.simulationRuleKeys), so a
    // string key is invisible to it either way.
    realmMagicDefault: 'magical',
    // W-R2-LIGHT: the ceiling is everything-on by name — it runs the full nine-wave
    // anti-stasis stack (warLayer is lit above, so intervention/peaceEngine/
    // supplyWebWarfare fire here; the composition smoke + whole-world soak drive
    // this preset verbatim, so they now cover the full stack automatically).
    ...WAVES,
    ...ONE_REGEN,
  }),
});

/**
 * @typedef {Partial<typeof DEFAULT_SIMULATION_RULES> & Record<string, unknown>} SimulationRulesInput
 */

// Every boolean rule flag, DERIVED from the default surface (CL-0 byte-budget
// consolidation: the previous 24-entry quoted list duplicated the keys of
// DEFAULT_SIMULATION_RULES verbatim, in the same order — the derivation is the
// exact reconstruction the preset-stability and fail-closed test oracles
// already use). A new boolean flag added to DEFAULT_SIMULATION_RULES joins the
// fail-closed coercion + preset comparison automatically, which was always the
// intent of the hand-maintained list.
const BOOLEAN_KEYS = Object.freeze(
  Object.keys(DEFAULT_SIMULATION_RULES).filter(
    key => typeof (/** @type {Record<string, unknown>} */ (DEFAULT_SIMULATION_RULES)[key]) === 'boolean',
  ),
);

const RULE_COMPARISON_KEYS = Object.freeze([
  'propagationMode',
  'intensity',
  'migrationMode',
  ...BOOLEAN_KEYS,
]);

/**
 * @param {any} value
 * @param {any} allowed
 * @param {any} fallback
 */
function enumValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

/**
 * Effective world-progression read (CL-0, total on garbage). VIRTUAL: an
 * absent/unknown value IS today's behavior — dm_advanced (every advance is a DM
 * action). 'frozen' stops advances; 'living'/'autonomous' (M10b) additionally
 * advance the world ON OPEN (capped catch-up — advancesOnOpen). Existing campaigns
 * carry neither living nor autonomous, so this is byte-identical for them; only a
 * campaign that OPTED INTO living/autonomous reads a new value here (which the
 * `=== 'frozen'` consumers ignore, and rulesMatchPreset distinguishes — the
 * accepted preset-reinference drift, same class as SEASONS-A).
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {'frozen' | 'dm_advanced' | 'living' | 'autonomous'}
 */
export function worldProgressionOf(rules) {
  const v = rules && typeof rules === 'object' ? rules.worldProgression : null;
  return (v === 'frozen' || v === 'living' || v === 'autonomous') ? v : 'dm_advanced';
}

/**
 * MG-2: is this realm's DEFAULT for a newly generated settlement a mundane one?
 * (docs/DESIGN_REALM_MAGIC_TOGGLE §4.)
 *
 * THE ONE READER of `realmMagicDefault`, so the two surfaces that consume it —
 * the single-settlement wizard's pre-selection and the campaign's read-only
 * stance line — can never drift on what the key means. Exact-match on 'mundane'
 * and total on garbage: the key is VIRTUAL (it rides `...input` unnormalized),
 * so absent, misspelled, or corrupt all mean the same thing they meant before
 * this key existed — a world of magic.
 *
 * IT IS NOT AN ENGINE GATE (MG-LAW-1). No generator, mover, or display path may
 * call this: a settlement's magic is its own config's `magicExists`, which the
 * composer stamped at mint. This answers only "what should the NEXT settlement's
 * config start as", which is a UI default, not a world fact.
 *
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {boolean}
 */
export function realmMagicIsMundane(rules) {
  return !!rules && typeof rules === 'object' && rules.realmMagicDefault === 'mundane';
}

/**
 * M10b: does this world advance ON OPEN (the capped catch-up)? True for the two
 * forward progression modes; false for frozen/dm_advanced (and everything legacy,
 * where worldProgression is absent) — so the catch-up is strictly opt-in and
 * dormant for every existing campaign.
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {boolean}
 */
export function advancesOnOpen(rules) {
  const v = worldProgressionOf(rules);
  return v === 'living' || v === 'autonomous';
}

/**
 * M10b OWNER-DECISION DEFAULT (2026-07-13, ruled by the owner; retunable — the
 * ACTOR_MAJOR_HOLD_WEEKS pattern). A living/autonomous world simulates AT MOST this
 * many weeks of catch-up when reopened, so a long absence never locks the UI on
 * load with an unbounded advance. Past the cap the calendar advances to "now" but
 * the simulation stops here (owner ruling: calendar-advances-past-cap). 26 = half a
 * game-year, and the value the design's catch-up soak exercises byte-identically.
 */
export const CATCH_UP_CAP_WEEKS = 26;

/**
 * Effective info-mode read (Phase 5.5 STEP 3.5 — the §11 information axis,
 * UNLOCKED). Two live modes beyond the omniscient default: 'perfect_delayed'
 * (true news, arrives by travel time — no distortion) and 'unreliable' (the
 * fidelity vector + organic degradation). 'delayed' is the pre-3.5 catalog
 * rung name, honoured as an input alias. M10a (CL-3) UNLOCKS the ceiling rung
 * 'full': the complete factional-belief experience — the M9a per-faction belief
 * maps + reconciliation, carried at the 'unreliable' distortion (rumorNetwork
 * treats 'full' as an 'unreliable' SUPERSET). Garbage still FAILS CLOSED to
 * 'omniscient'. Total on garbage; virtual-profile reads resolve to the
 * omniscient legacy default.
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {'omniscient' | 'perfect_delayed' | 'unreliable' | 'full'}
 */
export function infoModeOf(rules) {
  const v = rules && typeof rules === 'object' ? rules.infoMode : null;
  if (v === 'perfect_delayed' || v === 'unreliable' || v === 'full') return v;
  if (v === 'delayed') return 'perfect_delayed';
  return 'omniscient';
}

/**
 * Effective political-autonomy read (CL-0, total on garbage). An explicit
 * valid mode wins; otherwise the legacy majorChangesRequireProposal flag maps
 * in — true (or absent/garbage, the fail-closed default) → 'routine' (today's
 * conservative behavior), explicit false → 'full' (the legacy flag-off
 * behavior, e.g. dramatic_campaign). This mapping is what keeps an untouched
 * campaign byte-identical per flag.
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {'dm_only' | 'recommendations' | 'routine' | 'full'}
 */
export function politicalAutonomyOf(rules) {
  const r = rules && typeof rules === 'object' ? rules : {};
  const mode = /** @type {string} */ (r.politicalAutonomy);
  return POLITICAL_AUTONOMY_MODES.includes(mode)
    ? /** @type {'dm_only' | 'recommendations' | 'routine' | 'full'} */ (mode)
    : (r.majorChangesRequireProposal === false ? 'full' : 'routine');
}

/**
 * @param {Record<string, any>} rules
 * @param {any} preset
 */
function rulesMatchPreset(rules, preset) {
  // The legacy comparison keys compare raw; the profile axes compare through
  // their EFFECTIVE reads so a virtual (untouched) profile still matches a
  // preset that carries the same world explicitly. spatialMode/travelMode
  // clamp to single values today (vacuous compares); infoMode is UNLOCKED but
  // deliberately excluded — comparing it would collapse every pre-3.5 save of
  // a live-info preset (stored omniscient under the old clamp) to 'custom'.
  return RULE_COMPARISON_KEYS.every(key => rules[key] === preset?.rules?.[key])
    && worldProgressionOf(rules) === worldProgressionOf(preset?.rules)
    && politicalAutonomyOf(rules) === politicalAutonomyOf(preset?.rules);
}

/**
 * @param {Record<string, any>} input
 * @param {Record<string, any>} rules
 */
function presetIdForRules(input, rules) {
  const explicit = typeof input.presetId === 'string' && /** @type {Record<string, any>} */ (SIMULATION_RULE_PRESETS)[input.presetId]
    ? input.presetId
    : null;
  if (explicit && rulesMatchPreset(rules, /** @type {Record<string, any>} */ (SIMULATION_RULE_PRESETS)[explicit])) return explicit;
  const inferred = Object.keys(SIMULATION_RULE_PRESETS)
    .find(id => rulesMatchPreset(rules, /** @type {Record<string, any>} */ (SIMULATION_RULE_PRESETS)[id]));
  return inferred || CUSTOM_SIMULATION_PRESET_ID;
}

export function normalizeSimulationRules(raw = {}) {
  const input = /** @type {SimulationRulesInput} */ (raw && typeof raw === 'object' ? raw : {});
  /** @type {Record<string, any>} */
  const next = {
    ...DEFAULT_SIMULATION_RULES,
    ...input,
    schemaVersion: SIMULATION_RULES_SCHEMA_VERSION,
    propagationMode: enumValue(input.propagationMode, PROPAGATION_MODES, DEFAULT_SIMULATION_RULES.propagationMode),
    intensity: enumValue(input.intensity, SIMULATION_INTENSITIES, DEFAULT_SIMULATION_RULES.intensity),
    migrationMode: enumValue(input.migrationMode, MIGRATION_MODES, DEFAULT_SIMULATION_RULES.migrationMode),
  };
  for (const key of BOOLEAN_KEYS) {
    // Fail CLOSED on malformed values: only an explicit boolean is honored;
    // anything else (undefined, null, 0, '', 'false', …) falls back to the
    // key's default. The old `!== false` coercion turned null/0/''/'false'
    // into TRUE — silently activating opt-in default-off war flags from a
    // corrupted saved rules blob. For default-true keys the outcome is
    // unchanged (garbage → default true, explicit false still disables).
    const value = input[key];
    next[key] = typeof value === 'boolean' ? value : /** @type {Record<string, any>} */ (DEFAULT_SIMULATION_RULES)[key];
  }
  // ── Faith-spread migration (Phase 4 W-F1 / ratification 2) ────────────────────
  // The cross-settlement SPREAD lane is the only faith dynamic still gated by a
  // rule flag: `faithSpreadEnabled`. It supersedes the pre-split
  // `religionDynamicsEnabled` (which gated ALL faith dynamics). Through the
  // deprecation window the two keys are kept in lockstep so every read surface
  // agrees — the engine reads faithSpreadEnabled, the not-yet-migrated Living-World
  // gate reads/writes religionDynamicsEnabled. The LEGACY key, when explicitly set,
  // is authoritative (it is what that gate writes — its intent must win over a
  // stale mirror carried in from a prior normalize); else the new key stands; else
  // default false. Deleted in the Phase 6 lifecycle pass.
  const legacySpread = typeof input.religionDynamicsEnabled === 'boolean' ? input.religionDynamicsEnabled : null;
  const newSpread = typeof input.faithSpreadEnabled === 'boolean' ? input.faithSpreadEnabled : null;
  const spread = legacySpread ?? newSpread ?? DEFAULT_SIMULATION_RULES.faithSpreadEnabled;
  next.faithSpreadEnabled = spread;
  next.religionDynamicsEnabled = spread;
  // ── Simulation profile (Phase 5.5 CL-0) — VIRTUAL until touched ────────────
  // THE CONSTITUTIONAL LAW: absent profile = legacy behavior, byte-exact,
  // virtual. If the input carries NO profile key, the output carries none
  // (delete the defaults the spread pulled in) — an untouched campaign persists
  // byte-identically to today and reads its effective profile through the
  // worldProgressionOf/politicalAutonomyOf accessors. Touch ANY profile key and
  // the whole profile materializes, fail-closed:
  //   • worldProgression: only 'frozen' is meaningful; 'living'/'autonomous'
  //     are ACCEPTED but coerce to 'dm_advanced' until built.
  //   • politicalAutonomy: all four modes live; garbage derives from the legacy
  //     flag (true→routine, false→full), and the flag then MIRRORS the mode
  //     (full→false, else true) so every legacy flag reader stays consistent.
  //   • spatialMode/travelMode: single meaningful value today — any other
  //     value coerces to it (ignore/instant).
  //   • infoMode (STEP 3.5, unlocked): omniscient / perfect_delayed /
  //     unreliable are live; 'delayed' aliases in; 'full' + garbage fail
  //     closed to omniscient (infoModeOf).
  // validateSimulationProfile (simulationProfile.js, lazy) reports these
  // coercions as data; this normalizer IS its canonicalization step.
  if (PROFILE_KEYS.some(key => key in input)) {
    Object.assign(next, PROFILE_DEFAULTS, {
      worldProgression: worldProgressionOf(input),
      politicalAutonomy: politicalAutonomyOf(input),
      infoMode: infoModeOf(input),
    });
    next.majorChangesRequireProposal = next.politicalAutonomy !== 'full';
  } else {
    for (const key of PROFILE_KEYS) delete next[key];
  }
  next.presetId = presetIdForRules(input, next);
  return next;
}

/**
 * Tolerant read of the faith-SPREAD gate — the cross-settlement propagation lane
 * (carrier reach, religious_authority mints, prevalence, neighbour recognition,
 * occupation faith-pull). Honors the canonical `faithSpreadEnabled`; falls back to
 * the pre-split `religionDynamicsEnabled` when the new key is absent (migration
 * back-compat, ratification 2), so a raw/legacy rules object — an un-normalized
 * fixture, an old save — still gates spread correctly. LOCAL per-settlement faith
 * is NOT gated here: that is deity presence (isSubsystemActive) alone.
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {boolean}
 */
export function isFaithSpreadEnabled(rules) {
  if (!rules || typeof rules !== 'object') return false;
  if (typeof rules.religionDynamicsEnabled === 'boolean') return rules.religionDynamicsEnabled;
  if (typeof rules.faithSpreadEnabled === 'boolean') return rules.faithSpreadEnabled;
  return false;
}

export function propagationDepthForRules(raw = {}) {
  const rules = normalizeSimulationRules(raw);
  // `off` and `local` both stop regional channel propagation. `local` still
  // permits local World Pulse drift, while `off` is intended for disabling
  // regional effects entirely at the rule-selection layer.
  if (rules.propagationMode === 'off' || rules.propagationMode === 'local') return 0;
  if (rules.propagationMode === 'first_order') return 1;
  return 2;
}

export function intensityMultiplier(raw = {}) {
  const rules = normalizeSimulationRules(raw);
  if (rules.intensity === 'conservative') return 0.65;
  if (rules.intensity === 'dramatic') return 1.45;
  return 1;
}
