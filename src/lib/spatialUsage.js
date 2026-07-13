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

// The Phase-5.5 rule flags whose ADOPTION we measure (boolean toggles). Only the
// ENABLED ones are emitted (a compact `flags_on` list, not a 20-key mostly-false map).
const TRACKED_FLAGS = [
  'seasonsEnabled', 'warLayerEnabled', 'settlementStrategyEnabled', 'faithSpreadEnabled',
  'commodityFlowEnabled', 'allyIntelSharingEnabled', 'routineMajorApproval',
  'migrationFlowsEnabled', 'tradeFlowsEnabled', 'populationDynamicsEnabled',
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
