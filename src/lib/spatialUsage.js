/**
 * spatialUsage.js — coarse, id-free aggregate read of the Phase 5.5 spatial-engine
 * post-tick state, for PRODUCT USAGE telemetry: which mover layers actually get
 * exercised in real campaigns, and which presets / feature-flags real play runs under.
 *
 * ── DETERMINISM (this is a SIDE-CHANNEL, never engine state) ──────────────────
 * Every function here reads the ALREADY-FINAL worldState (post-commit) READ-ONLY.
 * It never mutates worldState, never writes a ledger, never feeds back into the
 * kernel. The derived props are NOT part of worldState, so same-seed byte-identity
 * and the generator/worldpulse/pdf goldens are untouched (telemetry is not in the
 * golden comparison). Adding a call to this must keep goldens byte-identical.
 *
 * ── FIRST-PAINT BUDGET (must stay LAZY, imported by exactly ONE lazy chunk) ───
 * Imported ONLY by the lazily-loaded advance body (campaignAdvanceSession.js). It
 * must NOT be imported by any eager store slice / boot module, or its bytes enter
 * the eager first-paint entry closure (asserted by tests/build/vendorPdfLazy.test.js).
 * ⚠️ Kept SEPARATE from spatialCanonizeUsage.js on purpose: a single module imported
 * by BOTH lazy bodies (advance + canonize) becomes a SHARED chunk, and its filename
 * leaks a ~44-byte string into the entry's modulepreload manifest (measured; the
 * FP-R "fresh module leaked a chunk-manifest entry" hazard). One importer per module
 * keeps each folded into its consumer's existing lazy chunk → zero eager bytes. Do
 * NOT merge these two files. Kept dependency-free (no spatial-domain / fingerprint
 * imports) so it can never drag a heavy graph into first paint.
 *
 * ── PROP HYGIENE ─────────────────────────────────────────────────────────────
 * Emits ONLY enums / bands / counts / booleans. NEVER a settlement or NPC id or
 * name. The mover ledgers are keyed by settlement/army id; we read leaf NUMBERS and
 * key COUNTS (Object.keys(...).length) — never the keys/ids themselves. A sparse or
 * absent ledger is a legitimate 0 (the ledgers self-prune when they drain), so
 * "missing" and "empty" both mean zero everywhere below.
 */

// ── band vocabularies ────────────────────────────────────────────────────────
// Reuses structuralFingerprint.js's population_band vocabulary verbatim (inlined
// to keep this module dependency-free / guaranteed-lazy).
function populationBand(pop) {
  const n = Number(pop) || 0;
  if (n <= 0) return 'zero';
  if (n < 100) return 'hamlet_lt100';
  if (n < 500) return 'village_100_500';
  if (n < 2000) return 'small_town_500_2k';
  if (n < 10000) return 'town_2k_10k';
  return 'city_gt_10k';
}

// ── ledger read helpers (id-free: counts + leaf numbers only) ─────────────────
const isObj = (v) => !!v && typeof v === 'object';
const recCount = (obj) => (isObj(obj) ? Object.keys(obj).length : 0);
function countWhere(obj, pred) {
  if (!isObj(obj)) return 0;
  let n = 0;
  for (const k of Object.keys(obj)) { try { if (pred(obj[k])) n += 1; } catch { /* skip bad record */ } }
  return n;
}
function sumLeaf(obj, fn) {
  if (!isObj(obj)) return 0;
  let s = 0;
  for (const k of Object.keys(obj)) { const v = Number(fn(obj[k])); if (Number.isFinite(v)) s += v; }
  return s;
}
const enumStr = (v) => (typeof v === 'string' && v.length <= 40 ? v : undefined);

// embattlement ENTER threshold (embattlement.js) — a region is "actively embattled"
// at level >= 0.55; below that it is ambient/decaying.
const EMBATTLE_ENTER = 0.55;

// The Phase-5.5 rule flags whose ADOPTION we measure (boolean toggles readable off
// simulationRules — the "virtual" wave flags like navalEnabled are ordinary rules
// keys too). Only the ENABLED ones are emitted (a compact `flags_on` list, not a
// 30-key mostly-false map). CURATED adoption list — extend it when a new merged wave
// adds a gating flag worth measuring (lib-infra-copy-1: it had lagged 15 waves; naval/
// upswing/resource-dynamics/infoStatecraft/momentum/corruptionWeb/intervention/
// settlementLifecycle were blind). Not walker-enforced (unlike the ledger-key manifest
// below) because many rules flags are internal sub-toggles not worth telemetry.
const TRACKED_FLAGS = [
  'seasonsEnabled', 'warLayerEnabled', 'settlementStrategyEnabled', 'faithSpreadEnabled',
  'commodityFlowEnabled', 'allyIntelSharingEnabled', 'routineMajorApproval',
  'migrationFlowsEnabled', 'tradeFlowsEnabled', 'populationDynamicsEnabled',
  // post-A1 merged-wave gating flags (lib-infra-copy-1)
  'navalEnabled', 'upswingArcsEnabled', 'resourceDynamicsEnabled', 'infoStatecraftEnabled',
  'momentumEnabled', 'corruptionWebEnabled', 'interventionEnabled', 'settlementLifecycleEnabled',
];

/** The config a tick ran under (preset + info mode + CL-0 profile axes + enabled flags). */
function simConfig(rules) {
  const r = isObj(rules) ? rules : {};
  const flagsOn = TRACKED_FLAGS.filter(k => r[k] === true)
    .map(k => k.replace(/Enabled$/, ''));   // 'seasonsEnabled' -> 'seasons'
  return {
    preset_id: enumStr(r.presetId),
    info_mode: enumStr(r.infoMode) || 'omniscient',
    world_progression: enumStr(r.worldProgression),
    political_autonomy: enumStr(r.politicalAutonomy),
    spatial_mode: enumStr(r.spatialMode),
    travel_mode: enumStr(r.travelMode),
    migration_mode: enumStr(r.migrationMode),
    intensity: enumStr(r.intensity),
    flags_on: flagsOn,
  };
}

/**
 * Coarse spatial-usage summary from a POST-TICK worldState (result.worldState).
 * Always emits the lightweight config/adoption signal; adds the per-mover activity
 * block only when the spatial engine is live or any mover fired this tick (an
 * aspatial tick stays near-empty). Returns plain enums/bands/counts/booleans only.
 * @param {any} worldState - the post-tick worldState (result.worldState)
 */
export function extractSpatialUsage(worldState) {
  const ws = isObj(worldState) ? worldState : {};
  const L = isObj(ws.spatialLedgers) ? ws.spatialLedgers : {};
  const spatialActive = Number.isInteger(ws.spatialCanonVersion) && ws.spatialCanonVersion > 0;

  const counts = {
    embattled: countWhere(L.embattlement, r => Number(r?.level) >= EMBATTLE_ENTER),
    caravans: recCount(L.supplyShipments),
    caravans_starving: countWhere(L.supplyShipments, r => r?.starving === true),
    smuggle: countWhere(L.supplyShipments, r => r?.smuggle === true),
    migration_columns: recCount(L.migration),
    armies_afield: recCount(L.armyTransit),
    armies_cut_off: countWhere(L.armyTransit, r => Number(r?.beliefStaleness) > 0),
    entrepots: recCount(L.entrepots),
    trade_flow_nodes: recCount(L.tradeFlow),
    rumor_holders: recCount(L.rumorLedgers),
    belief_observers: recCount(L.beliefMaps),
    moral_drift: recCount(L.moralDrift),
    dispatch_refusing: recCount(L.dispatchWillingness),
    arrivals_in_transit: recCount(L.spatialArrivals),
    approvals_pending: (Array.isArray(ws.proposals) ? ws.proposals : [])
      .filter(p => p?.status === 'pending').length,
    // ── post-A1 merged-wave movers (lib-infra-copy-1) ───────────────────────
    naval: recCount(L.navalTransit),                 // W-NAVY sea movement
    epidemic_sites: recCount(L.epidemic),            // W-pestilence spread
    disinfo_active: recCount(L.disinfo),             // W-DOCTRINE-2 disinformation
    credibility_tracked: recCount(L.credibility),    // W-DOCTRINE-2 credibility stock
    upswing_arcs: recCount(L.upswing),               // W-UPSWING reconstruction/boom arcs
    momentum_committed: recCount(L.commitments),     // momentum commitment ledger
    interventions: recCount(L.interventions),        // W-CONVERGENCE foreign intervention
    corruption_exposed: recCount(L.exposedCorruption), // W-DOCTRINE-3 revealed corruption
    satellites: recCount(L.satellites),              // settlement-lifecycle satellites
    war_campaigns: recCount(L.campaignPlans),        // W-DOCTRINE-1 supply-web campaigns
    // W-J THE ORGANIC ROUTE LIFECYCLE. The ledger nests two containers, so the
    // adoption signal is the EDGE count, never the container's own key count
    // (Object.keys of the ledger itself would read a constant 2 and mean nothing).
    route_edges: recCount(isObj(L.routeNetwork) ? L.routeNetwork.edges : null),
  };
  const migrationPop = sumLeaf(L.migration, r => r?.arrivals);

  // which mover layers were exercised at all (id-free presence flags)
  const MOVER_PRESENCE = [
    ['embattlement', recCount(L.embattlement)],
    ['caravans', counts.caravans],
    ['smuggle', counts.smuggle],
    ['migration', counts.migration_columns],
    ['field_combat', counts.armies_afield],
    ['entrepots', counts.entrepots],
    ['trade_flow', counts.trade_flow_nodes],
    ['rumor', counts.rumor_holders],
    ['belief', counts.belief_observers],
    ['moral_drift', counts.moral_drift],
    ['dispatch_refusal', counts.dispatch_refusing],
    ['propagation', counts.arrivals_in_transit],
    ['approval_queue', counts.approvals_pending],
    // ── post-A1 merged-wave movers (lib-infra-copy-1) ───────────────────────
    ['naval', counts.naval],
    ['epidemic', counts.epidemic_sites],
    ['disinfo', counts.disinfo_active],
    ['credibility', counts.credibility_tracked],
    ['upswing', counts.upswing_arcs],
    ['momentum', counts.momentum_committed],
    ['intervention', counts.interventions],
    ['corruption_exposed', counts.corruption_exposed],
    ['satellites', counts.satellites],
    ['war_campaign', counts.war_campaigns],
    ['route_network', counts.route_edges],           // W-J lived route network
  ];
  const moversActive = MOVER_PRESENCE.filter(([, n]) => n > 0).map(([name]) => name);

  const out = {
    sim_config: simConfig(ws.simulationRules),
    spatial_active: spatialActive,
    spatial_canon_version: spatialActive ? ws.spatialCanonVersion : 0,
  };
  // Only carry the heavy per-mover block when there is something to report — an
  // aspatial / dormant tick stays light (absence = zero, the taxonomy convention).
  if (spatialActive || moversActive.length) {
    out.movers_active = moversActive;
    out.mover_counts = counts;
    out.migration_pop_band = populationBand(migrationPop);
  }
  return out;
}

// ── The spatialLedgers coverage MANIFEST (lib-infra-copy-1) ───────────────────
// The registration convention that keeps this telemetry from lagging the engine
// again: EVERY spatialLedgers key a domain kernel writes (via setSpatialLedger) must
// be classified here — either TRACKED (extractSpatialUsage reads it into mover_counts/
// movers_active) or EXEMPT (deliberately not an adoption "mover"). The walker
// tests/lib/spatialLedgerCoverage.walker.test.js source-scans the setSpatialLedger
// call sites and asserts the written-key set EQUALS TRACKED ∪ EXEMPT — so a new wave's
// ledger key reds the gate until someone consciously tracks or exempts it.

/** spatialLedgers keys extractSpatialUsage reads into the coarse mover signal. */
export const TRACKED_LEDGER_KEYS = Object.freeze([
  'embattlement', 'supplyShipments', 'migration', 'armyTransit', 'entrepots',
  'tradeFlow', 'rumorLedgers', 'beliefMaps', 'moralDrift', 'dispatchWillingness',
  'spatialArrivals', 'navalTransit', 'epidemic', 'disinfo', 'credibility', 'upswing',
  'commitments', 'interventions', 'exposedCorruption', 'satellites', 'campaignPlans',
  // W-J. TRACKED rather than EXEMPT, deliberately: the exemption list is for
  // ledgers whose adoption is ALREADY visible through a tracked mover or a tracked
  // flag, and the route network's is visible through neither — routeLifecycleEnabled
  // is a virtual flag lit in no preset, so it is absent from TRACKED_FLAGS too. A
  // reading of zero while the layer is dark is the truth, not a blind spot.
  'routeNetwork',
]);

/**
 * spatialLedgers keys deliberately NOT surfaced as adoption movers, with the reason.
 * These are substrate / reason-annotation / shared-bookkeeping ledgers whose owning
 * layer's adoption is already visible through a tracked mover or a tracked flag; a
 * separate presence signal would be redundant noise, not new information.
 */
export const EXEMPT_LEDGER_KEYS = Object.freeze({
  commodityStocks: 'supply-web closed-inventory SUBSTRATE (commodityFlow); the trade_flow/caravans movers already signal the trade layer',
  merchantAppetite: 'supply-web economic pressure STOCK, not a distinct exercised mover',
  tradeOverture: 'E1d generosity per-pair warmth STOCK (the merchantAppetite idiom, drop-when-cold) feeding the existing trade-partner evolution rule — not a distinct mover',
  lendAppetite: 'E1b generosity lender-appetite STOCK (the merchantAppetite idiom) hardening/softening the credit motive — not a distinct mover',
  refugePostures: 'E1c generosity host-refuge POSTURE sub-ledger, read as the refugePosture01 axis by migrationKernel — the migration mover already signals that layer',
  bufferDiscipline: 'E1 generosity reserve-discipline STOCK (give-side motive substrate), not a distinct exercised mover',
  generosityWillingness: 'E1 generosity give-side WILLINGNESS STOCK (motive substrate feeding the generosity verbs), not a distinct exercised mover',
  obligations: 'cross-wave debt ledger shared by upswing + convergence — those movers already signal their layers',
  secrecyPostures: 'infoStatecraft HIDE posture sub-state (the disinfo/credibility movers represent the info wave)',
  sightPostures: 'infoStatecraft SEE posture sub-state (ditto)',
  peaceReasons: 'W-PEACE-1 typed peace-reason ANNOTATIONS (metadata on the war/peace layer, not a mover)',
  warReasons: 'W-PEACE-1 typed war-reason ANNOTATIONS (metadata on the war/peace layer, not a mover)',
  treaties: 'peace-OUTCOME state record (the diplomatic result of the war/peace layer, not a distinct mover)',
  npcLadder: 'THE LADDER intra-faction standings SIDECAR (recorded rank/standing stocks + challenge state; annotation/state ledger like reframes/warReasons — the faction movers already signal that layer, not a distinct mover)',
  reframes: 'D7 per-pair motive-INTERPRETATION annotations (belief-side reframe readings — metadata on the war/peace/corruption layer, like warReasons/peaceReasons, not a distinct mover)',
  provenance: 'THE PROVENANCE LEDGER causal-edge ANNOTATIONS (receipt→parent cause-edges recorded at commit for the chronicle; structural metadata over every layer, like warReasons/reframes, not a distinct exercised mover — adoption is the provenanceLedgerEnabled flag)',
  urbanFabric: 'THE URBAN FABRIC LAYER district prominence/scars/drift STOCKS (the map\'s memory, projected onto settlement.urbanFabric for the town-map layout engine; a read-model over every layer\'s durable outcomes, not a distinct exercised mover — adoption is the urbanFabricEnabled flag)',
  traditions: 'THE TRADITIONS per-settlement observance SIDECAR (founding set + occurrence outcomes + ownership, projected onto settlement.traditions for the dossier tab; a flag-gated per-settlement culture state record like npcLadder/urbanFabric — adoption is the traditionsEnabled flag, and the tradition news beats already surface activity, not a distinct spatial-adoption mover)',
  commonsVoice: 'V-22/V-23 (Vision lane V-K) THE COMMONS\' VOICE per-settlement crowd-action rung STATE (petition/gathering/riot-band + grievance kind + escalation clock, deterministic from legitimacy/corruption/unrest reads; a flag-gated per-settlement collective-action state record like traditions/npcLadder — adoption is the commonsVoiceEnabled flag, and the commons news beats already surface activity, and the assize reads it for the petition→judgment coupling — not a distinct spatial-adoption mover)',
  roads: 'THE ROADS named-NPC travel/captivity SIDECAR (missions/ransoms/cadence, projected onto npc.whereabouts; a flag-gated per-mission state record like traditions/npcLadder — adoption is the roadsEnabled flag, and the roads news beats already surface activity, not a distinct spatial-adoption mover)',
  roadsReturnedCaptives: 'THE ROADS §10 returned-captive CHANNEL deposit (captor→home conduit pins the corruption web consumes at its own creation pass — a hand-off/annotation ledger like provenance/reframes, gated by roadsEnabled + corruptionWebActive, not a distinct exercised mover)',
  roadsRansomSettlements: 'DEEP COUPLINGS D-5 §9 third-party ransom DEBT deposit (home→payer ransom_relief conduit the generosity mover consumes into an obligation on its next pass — a one-tick hand-off ledger like roadsReturnedCaptives, gated by thirdPartyRansomEnabled + roadsEnabled + constructiveFlowsEnabled, not a distinct exercised mover)',
  roadsBondEvents: 'DEEP COUPLINGS D-5 §9 third-party ransom GRATITUDE deposit (captive→friend-payer bond-formation events the ladder kernel consumes into person bonds via mintBond on its next pass — a one-tick hand-off ledger like roadsReturnedCaptives, gated by thirdPartyRansomEnabled + roadsEnabled + memoryWeaveEnabled, not a distinct exercised mover)',
  gratitudeBondEvents: 'DEEP COUPLINGS D-7e (ii) generosity GRATITUDE deposit (a completed mercy act — grain gift / warning gifted — deposits a court-to-court bond-formation event the ladder kernel consumes into the receiving ruling-seat NPC\'s bonds via mintBond LATER THE SAME TICK — a one-tick hand-off ledger like roadsBondEvents, generosity-written only, gated by memoryWeaveEnabled, not a distinct exercised mover)',
  npcCredibility: 'DEEP COUPLINGS D-2 per-NPC credibility STOCK sidecar (spokesperson bluff exposure + lie stigma, the boy-who-cried-wolf discount; a flag-gated personal-reputation state record like npcLadder — adoption is the npcCredibilityEnabled flag, and the settlement-level credibility/disinfo movers already signal the info layer, not a distinct exercised mover)',
  bluffExposures: 'DEEP COUPLINGS D-4→D-2 contradicted-bluff exposure DEPOSIT (the ladder deposits a contest-bluffer-who-lost record; informationStatecraft consumes it one tick later into a personal credibility charge — a hand-off/annotation ledger like roadsReturnedCaptives/provenance, gated by contestedGoalsEnabled ∧ npcCredibilityEnabled, not a distinct exercised mover — adoption is those flags + the npcCredibility stock)',
  intelTransfers: 'DEEP COUPLINGS D-3 intel-transfer RECORD ledger (INTEL_TRANSFERS_LEDGER — generosity OWNS + prunes it, statecraft reads; a single-writer cross-wave transfer record like obligations, and the disinfo/credibility movers already signal the info layer, not a distinct exercised mover — adoption is intelTradeEnabled ∧ infoStatecraftEnabled)',
  intelCooldown: 'DEEP COUPLINGS D-3 intel-transfer per-pair COOLDOWN stock (INTEL_COOLDOWN_LEDGER — rate-limit bookkeeping for the intel-transfer layer, the merchantAppetite STOCK idiom; substrate, not a distinct exercised mover)',
  roadsEmbassies: 'THE ROADS embassy SIDECAR (EMBASSY_LEDGER_KEY — per-pair diplomatic embassy state on the roads layer; a flag-gated per-mission/annotation state record like roads/traditions — adoption is roadsEnabled, and the roads news beats already surface activity, not a distinct spatial-adoption mover)',
  npcGrowth: 'NPC GROWTH per-NPC advancement STOCK (npcGrowthKernel recorded skill/standing growth projected onto the NPC card; a flag-gated personal state record like npcLadder/npcCredibility — adoption is the npc-growth flag, and the faction/ladder movers already signal that layer, not a distinct exercised mover)',
  npcLedger: 'W-H1 THE WORLD NPC LEDGER — durable cross-settlement identities (roamers / placed / exclusions) minted at the first cross-settlement consequence; a flag-gated per-person state record like npcLadder/npcGrowth/npcCredibility, so it is classified the same way. TWO REASONS IT IS EXEMPT RATHER THAN TRACKED, and they are different reasons. (1) Adoption is already legible from the npcConsequencesEnabled flag itself, exactly as it is for the sibling personal-state ledgers. (2) MORE IMPORTANTLY, the records are PEOPLE: this module\'s prop-hygiene law forbids emitting an NPC id or name, and the ledger\'s per-record payload is identity plus DM truth (a compromise source is covert intelligence under law 7), so the only telemetry-legal reading would be a bare key count. A count that is structurally zero until the flag is lit, and that duplicates what the flag already says, is redundant noise rather than new information. If a future wave wants circulation ADOPTION telemetry, the honest signal is a banded pool-size / transition-rate derived inside this module from counts alone, never a projection of the records.',
  institutionStatus: 'W-K1 THE GENERAL INSTITUTION STATUS SYSTEM (docs/DESIGN_MAGIC_ECONOMY.md §3c) — the cause-bound impairment annotations and the shell\'s warm-start memory, keyed settlement to institution; a flag-gated per-settlement entity-state record like traditions/commonsVoice/npcLadder, so it is classified the same way. EXEMPT RATHER THAN TRACKED for the reason those siblings are: adoption is already legible from the magicEconomyEnabled flag, and the ledger stores no mover at all. It stores only the DURABLE half of a status (when an impairment began, the DM\'s severity override, the capacity a shell remembers) because cause PRESENCE is re-derived from live state every advance rather than persisted, which is how the no-orphan law is made structural. A key count would therefore measure how many institutions currently remember something, not how much the layer moved, and the impairment and shell transitions are surfaced as events instead.',
  // NOTE: DOOR 1's `spatialSubstrate` sidecar is deliberately NOT listed here. The
  // walker governs ONLY spatialLedgers keys WRITTEN via setSpatialLedger inside
  // src/domain (engine movers). The substrate is derived + written at CANONIZE, from
  // the store (campaignWorldPulseSlice), because the projection law forbids the engine
  // reading the layout — so it is outside the domain-mover walker's scope by design.
});
