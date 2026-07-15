/**
 * settlementLifecycleKernel.js — W-LIFECYCLE: settlement birth & death
 * (docs/DESIGN_SETTLEMENT_LIFECYCLE.md — the ladder gains its two ends).
 *
 * TWO LANES, both V1-safe against the frozen spatial digest (design §0):
 *
 *   • THE SATELLITE LANE (§1, this stage): town+ parents seed SATELLITE THORPS —
 *     §H-loaded on boom (W-UPSWING), prosperity + population pressure, a resource
 *     strike (W-DISCOVERY's condition — the mining-camp birth), and migration
 *     inflow the parent cannot absorb. Satellites are NOT digest members: they
 *     orbit a parent (cosmetic map placement; routing via-parent), live in the
 *     `spatialLedgers.satellites` conditional ledger keyed by parent (the
 *     armyTransit pattern — drop-when-empty, dormant ⇒ absent ⇒ prior bytes),
 *     and do NOT join the per-settlement mover loops (the cap study's N is
 *     untouched). Each tick a thorp GROWS (backing + inflow adequate; thresholds
 *     promote thorp → hamlet; village scale ⇒ CHARTER-PENDING, visible and
 *     chronicle-noted — the owner's graduation-at-village ruling, executed by the
 *     parked V2 machinery), STARVES (backing fails → dwell → the death draw —
 *     "quickly die"; residents flow back to the parent), or CONVERGES (same-
 *     parent orbit-adjacent steadings fold into one hamlet — populations SUM).
 *
 *   • THE FIRST-CLASS LANE (§2, stage 2): the monotone `peakTier` stamp, the
 *     terminal-death candidate (authority-routed, campaign-altering), the remnant
 *     grades (THE SCARCITY LAW: relic_ruin iff peakTier ≥ city — a satellite
 *     NEVER mints one), and resettlement (a remnant is a privileged birth site).
 *
 * CONSTITUTION:
 *   • GEOMETRY SURVIVES DEATH — satellites never touch the digest; a first-class
 *     death is a STATUS, never a deletion (no membership change, no re-canonize).
 *   • DORMANCY — gated on the NEW virtual flag `settlementLifecycleEnabled`
 *     (ABSENT from DEFAULT_SIMULATION_RULES). Dark ⇒ every entry point is an
 *     immediate no-op: same references, zero candidates, zero forks, no
 *     satellites key, no peakTier writes — byte-identical (the fenced dormancy
 *     golden proves it, aspatial AND spatial).
 *   • CONSERVATION AT EVERY EDGE — a satellite's founding families DEBIT the
 *     parent (never minted from nothing); growth is a parent→satellite TRANSFER;
 *     convergence SUMS; satellite death returns the residual to the parent.
 *     Σ(parent + satellites) is EXACT across every satellite-lane event
 *     (property-pinned). First-class death disperses through the migration
 *     ledger (stage 2 — the calamity-exodus realized-debit path).
 *   • THE FATES BOUNDARY — satellites carry NO named NPCs (names begin where
 *     community begins — V2's graduation mints them); nothing in this module
 *     reads or writes an npc roster in the satellite lane.
 *   • FIRST-PAINT — a LAZY worldPulse leaf: imported only by pulseKernel (the
 *     mover seam) and applyWorldPulse (the stage-2 writer), never the entry
 *     closure. The satellites ledger nests under the FP-R `spatialLedgers`
 *     namespace ⇒ ZERO eager bytes for the state.
 *   • RNG — stable keyed forks only (`satellite:<parent>:<tick>`), §H
 *     situation-loaded; no fork when dark; draw order inside a fork is fixed
 *     (codepoint-ordered iteration) so the parent stream is never touched.
 *   • CATCH-UP INTEGRITY — every dwell/cooldown is a TICK STAMP compared by
 *     integer subtraction (tick − since), never an incrementing counter, so the
 *     M10b one-interval catch-up collapse cannot lose or double-count dwell.
 */

import { clamp01 } from '../../kernel/math.js';
import { POPULATION_RANGES, TIER_ORDER, PROSPERITY_TIERS, prosperityRank, popToTier } from '../../data/constants.js';
import { NAMING_DATA } from '../../data/namingData.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { withActiveCondition, withoutActiveCondition } from '../activeConditions.js';
import { formatCount } from '../formatNumber.js';
import { stablePart } from './stablePart.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { distributeMigrants } from './populationDynamics.js';

// ── Kernel-local read shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ archetype?: string, id?: string, triggeredAt?: { sourceEventTargetId?: string } }} LcCondition */
/** @typedef {{ tick?: (number|null), delta?: number, population?: number, reason?: string, outcomeId?: string }} LcPopHistoryEntry */
/** @typedef {{ tier?: string, settType?: string, peakTier?: string, lifecycleStatus?: string,
 *   lifecycleDiedAtTick?: number, customName?: string, nearbyResources?: string[],
 *   tradeRouteAccess?: string }} LcConfig
 */
/** @typedef {{ event: string, grade?: string, fromGrade?: string, formerName?: string,
 *   tick?: (number|null), outcomeId?: (string|null) }} LcLifecycleHistoryEntry */
/** @typedef {{ population?: number, tier?: string, name?: string, culture?: string,
 *   config?: LcConfig, _config?: Record<string, unknown>,
 *   lifecycleStatus?: string,
 *   lifecycleHistory?: LcLifecycleHistoryEntry[],
 *   history?: { historicalEvents?: Array<Record<string, unknown>> },
 *   institutions?: Array<Record<string, unknown>>,
 *   npcs?: Array<Record<string, unknown>>,
 *   economicState?: { prosperity?: unknown },
 *   activeConditions?: LcCondition[],
 *   populationHistory?: LcPopHistoryEntry[] }} LcSettlement
 */
/** @typedef {{ id?: (string|number), name?: string, settlement?: LcSettlement }} LcSnapItem */
/** @typedef {{ settlements?: LcSnapItem[] }} LcSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: LcSettlement }} LcUpdate */
/** @typedef {{ get?: (id: string, kind: string) => ({ score?: number } | undefined) }} LcPressureIdx */
/** @typedef {{ fork?: (k: string) => { random: () => number } }} LcRng */
/**
 * One satellite steading record (SUB-SETTLEMENT — never a digest member, never a
 * mover-loop member, no npc roster).
 * @typedef {Object} SatelliteRecord
 * @property {string} id            deterministic (`steading.<parent>.<tick>`)
 * @property {string} name          seeded from NAMING_DATA on the satellite fork
 * @property {string} parentId
 * @property {'thorp'|'hamlet'} tier the in-orbit ladder (village ⇒ CHARTER-PENDING)
 * @property {number} population    integer; every head debited from the parent
 * @property {number} foundedTick
 * @property {'growth'|'resource_strike'|'resettlement'|'forced'} provenance
 * @property {string} [resourceKey] the struck vein a mining-camp exists for
 * @property {number} orbit         cosmetic orbit slot (deterministic, unique per parent)
 * @property {number} inflow        cumulative in-migration tally (people moved in)
 * @property {number} backing01     last computed backing read (display/receipt)
 * @property {number} [starvingSince] tick stamp — the decline dwell (catch-up-safe)
 * @property {boolean} [charterPending] village scale reached; awaits the V2 charter
 * @property {number} [charterPendingSince]
 * @property {string[]} history     bounded chronicle lines (slice cap)
 */
/** @typedef {{ seedAcc?: number, lastSeedTick?: number, steadings: Record<string, SatelliteRecord> }} ParentSatellites */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint comparator (device/locale-stable ordering everywhere in this module).
 *  @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
/** @param {unknown} tier @returns {number} */
function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(/** @type {string} */ (tier));
  return idx >= 0 ? idx : TIER_ORDER.indexOf('village');
}

// ── THE DORMANCY GATE — a virtual, defensively-read flag (no serialized default) ──
/**
 * Is the settlement-lifecycle layer LIT? Reads
 * simulationRules.settlementLifecycleEnabled === true, defensively — ABSENT ⇒
 * false ⇒ DORMANT ⇒ no entry point does anything (byte-identical; NO default in
 * DEFAULT_SIMULATION_RULES, so goldens do not move). Mirrors upswingArcsActive.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function settlementLifecycleActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).settlementLifecycleEnabled === true);
}

// ── Tuning (documented; owner-retunable in the checkpoint soaks) ───────────────
export const SETTLEMENT_LIFECYCLE_TUNING = Object.freeze({
  // ── SEEDING: the frontier integrator (the prospecting-integrator idiom). ──
  // Per-tick seeding DRIVE (0..1) from a small base + situational load; the
  // accumulator relaxes toward it (DECAY) and climbs (GAIN = 1−DECAY, so the
  // steady-state equals the drive). Crossing SEED_FLOOR arms a founding (subject
  // to the cooldown + the tier cap) — a sustained boom/strike reaches the floor
  // in ~13 ticks; a moderate drive plateaus BELOW it and never arms. E0-classed
  // RARE by construction: no steading is founded inside a golden's window.
  SEED_BASE_DRIVE: 0.05,
  SEED_BOOM_BONUS: 0.3,             // an active W-UPSWING boom = capital looking outward
  SEED_STRIKE_BONUS: 0.35,          // a W-DISCOVERY resource_strike = the mining-camp birth
  SEED_PROSPERITY_WEIGHT: 0.15,     // × prosperity01
  SEED_POP_PRESSURE_WEIGHT: 0.25,   // × pop/tierMax (a bursting town spills outward)
  SEED_INFLOW_BONUS: 0.2,           // recent migration arrivals the parent must absorb
  SEED_DECAY: 0.86,
  SEED_GAIN: 0.14,
  SEED_CAP: 1.0,
  SEED_FLOOR: 0.7,
  SEED_COOLDOWN: 52,                // ticks between foundings at one parent (~a year)
  // Caps by parent tier (design §1: town 1–2, city 2–4, metropolis up to 6).
  SATELLITE_CAPS: Object.freeze({ town: 2, city: 4, metropolis: 6 }),
  // Founding families: FOUNDERS_MIN + a seeded spread, always debited from the
  // parent and never below the parent's own tier floor (the parent is never
  // demoted by its own frontier).
  FOUNDERS_MIN: 16,
  FOUNDERS_SPREAD: 16,
  // The recent-arrival window (ticks) the inflow §H term scans populationHistory for.
  INFLOW_WINDOW: 4,
  // ── PRECARITY: grow / starve / converge (the owner's physics). ──
  GROW_BACKING_FLOOR: 0.45,         // backing at/above this ⇒ the steading pulls settlers
  GROWTH_BASE: 0.02,                // × population per tick
  GROWTH_BACKING: 0.05,             // × population × backing01 per tick
  STARVE_BACKING_FLOOR: 0.3,        // backing below this ⇒ the decline dwell arms
  STARVE_DWELL: 13,                 // ticks starving before the death draw arms (~a season — "quickly die")
  STARVE_DEATH_P: 0.35,             // per-tick death draw once the dwell is met (seeded fork)
  CONVERGE_MIN_AGE: 26,             // both steadings must be at least this old (ticks)
  CONVERGE_P: 0.25,                 // per-tick convergence draw once a pair qualifies
  // ── THE TRIBUTARY (bounded, receipted — design §3). ──
  // The parent's satellite modifier rides ONE lift condition whose severity is
  // capped regardless of steading count — never more than a small modifier.
  TRIBUTARY_SEVERITY_MAX: 0.3,
  TRIBUTARY_POP_SHARE_CAP: 0.15,    // the pop-share read saturates here
  // Chronicle line cap per satellite record (bounded state).
  HISTORY_CAP: 8,
  // ── THE FIRST-CLASS LANE (design §2). ──
  // TERMINAL DECLINE: a first-class settlement DEMOTED to thorp tier whose support
  // has collapsed (or whose population fell under the thorp floor) accrues the
  // terminal dwell — a tick STAMP (catch-up-safe). The dwell is EXTENDED (the
  // resource-removal ruling's rhythm: never sudden), then the death draw arms,
  // §H-loaded on the decline's DEPTH, E0-classed VERY RARE.
  DEATH_SUPPORT_FLOOR: 0.35,
  TERMINAL_DWELL: 104,              // ~2 game-years dwelling in terminal decline
  DEATH_EMIT_P: 0.05,               // base emit probability once dwelled (rollCandidates rolls it)
  DEATH_DEPTH_WEIGHT: 0.08,         // deeper decline ⇒ likelier draw
  DEATH_RETRY_COOLDOWN: 8,          // ticks between death candidates at one settlement
  // The aspatial dispersal reconciliation (populationDynamics/calamity parity):
  // 45% of the residual disperses as credited migrants; the remainder is the
  // origin-loss proxy. Spatial worlds ride the M4 realized-debit path instead.
  ASPATIAL_MIGRANT_FRACTION: 0.45,
  // RESETTLEMENT: a remnant is a PRIVILEGED birth site — §H-loaded by nearby
  // prosperity + route utility + the remnant's resources, after a fallow dwell.
  RESETTLE_MIN_FALLOW: 52,          // ticks the site lies fallow before rebirth arms
  RESETTLE_EMIT_P: 0.015,
  RESETTLE_LOAD_WEIGHT: 0.05,
  RESETTLE_SEED: 24,                // target founding population (a thorp)
  RESETTLE_SEED_MIN: 16,            // fewer willing settlers than this ⇒ no rebirth
  RESETTLE_DONORS: 3,               // settlers drawn from the most prosperous neighbours
  RESETTLE_DONOR_MIN_POP: 500,      // a donor must be at least this large
  RESETTLE_DONOR_MAX_FRACTION: 0.01, // and gives at most this fraction of itself
});

const T = SETTLEMENT_LIFECYCLE_TUNING;

// The fixed id of a parent's tributary lift condition (idempotent upsert).
export const STEADING_TRIBUTARY_ARCHETYPE = 'steading_tributary';

// ── Ledger reads ───────────────────────────────────────────────────────────────
/** The satellites ledger (`spatialLedgers.satellites`), or null when absent.
 *  @param {Record<string, unknown>|null|undefined} worldState
 *  @returns {Record<string, ParentSatellites>|null} */
export function satellitesLedgerOf(worldState) {
  const led = getSpatialLedger(/** @type {Record<string, unknown>} */ (worldState || {}), 'satellites');
  return led && typeof led === 'object' && !Array.isArray(led)
    ? /** @type {Record<string, ParentSatellites>} */ (led)
    : null;
}

/** Every satellite of one parent, codepoint-ordered by id (deterministic iteration).
 *  @param {Record<string, ParentSatellites>|null} ledger @param {string} parentId
 *  @returns {SatelliteRecord[]} */
export function satellitesOf(ledger, parentId) {
  const entry = ledger ? ledger[parentId] : null;
  const steadings = entry && entry.steadings && typeof entry.steadings === 'object' ? entry.steadings : {};
  return Object.keys(steadings).sort(codepoint).map((k) => steadings[k]).filter(Boolean);
}

/** The parent's bounded tributary read: satellite population share, saturating at
 *  TRIBUTARY_POP_SHARE_CAP (the boundedness pin derives from the live tuning).
 *  @param {SatelliteRecord[]} sats @param {number} parentPop @returns {number} */
export function satelliteTributary01(sats, parentPop) {
  const total = sats.reduce((s, r) => s + Math.max(0, num(r.population, 0)), 0);
  if (total <= 0) return 0;
  const share = total / Math.max(1, num(parentPop, 0));
  return Math.min(T.TRIBUTARY_POP_SHARE_CAP, clamp01(share));
}

// ── Small pure reads ───────────────────────────────────────────────────────────
/** @param {LcSettlement|undefined} s @returns {number} prosperity 0..1 (unknown ⇒ mid) */
function prosperity01Of(s) {
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (asObject(s?.economicState).prosperity));
  if (rank < 0) return 0.4;
  return clamp01(rank / Math.max(1, PROSPERITY_TIERS.length - 1));
}
/** @param {LcPressureIdx|null|undefined} pIndex @param {string} id @param {string} kind */
function pressure(pIndex, id, kind) {
  return num(pIndex?.get?.(id, kind)?.score, 0);
}
/** @param {LcSettlement|undefined} s @param {string} archetype @returns {LcCondition|null} */
function conditionOf(s, archetype) {
  for (const c of (Array.isArray(s?.activeConditions) ? s.activeConditions : [])) {
    if (c?.archetype === archetype) return c;
  }
  return null;
}
/** Recent in-migration the parent must absorb: a populationHistory entry inside the
 *  window that is a migration arrival (spatial release) or an aspatial dispersal
 *  credit. Structural markers, not prose guesses beyond the two known reasons.
 *  @param {LcSettlement|undefined} s @param {number} tick @returns {boolean} */
function recentInflow(s, tick) {
  for (const e of (Array.isArray(s?.populationHistory) ? s.populationHistory : [])) {
    const t = num(e?.tick, -1);
    if (t < 0 || tick - t > T.INFLOW_WINDOW || num(e?.delta, 0) <= 0) continue;
    if (String(e?.outcomeId || '').startsWith('migration.arrival.')) return true;
    if (String(e?.reason || '').startsWith('Displaced population')) return true;
  }
  return false;
}

/** The steading's BACKING read (design §1: parent prosperity + route health) —
 *  prosperity01 blended with the inverse of the parent's trade pressure. Pure.
 *  @param {LcSettlement|undefined} parent @param {LcPressureIdx|null|undefined} pIndex
 *  @param {string} parentId @returns {number} */
export function steadingBacking01(parent, pIndex, parentId) {
  const routeHealth = 1 - clamp01(pressure(pIndex, parentId, 'trade'));
  return clamp01(0.6 * prosperity01Of(parent) + 0.4 * routeHealth);
}

/** Relax the seeding integrator toward the drive (cap-held). Exported so pins derive
 *  expectations from the live tuning. @param {number|undefined} prev @param {number} drive */
export function stepSeeding(prev, drive) {
  const acc = num(prev, 0) * T.SEED_DECAY + drive * T.SEED_GAIN;
  return Math.min(T.SEED_CAP, Math.max(0, acc));
}

/** The per-tick seeding DRIVE (the §H load on satellite founding). Pure.
 *  @param {Object} args
 *  @param {LcSettlement|undefined} args.settlement @param {number} args.tick
 *  @returns {{ drive: number, boom: boolean, strike: LcCondition|null, inflow: boolean }} */
export function seedingDrive({ settlement, tick }) {
  const tier = String(settlement?.tier || 'village');
  const range = /** @type {{ min?: number, max?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES))[tier] || {});
  const pop = Math.max(0, num(settlement?.population, 0));
  const popPressure = clamp01(pop / Math.max(1, num(range.max, pop || 1)));
  const boom = !!conditionOf(settlement, 'boom');
  const strike = conditionOf(settlement, 'resource_strike');
  const inflow = recentInflow(settlement, tick);
  const drive = clamp01(
    T.SEED_BASE_DRIVE
    + (boom ? T.SEED_BOOM_BONUS : 0)
    + (strike ? T.SEED_STRIKE_BONUS : 0)
    + T.SEED_PROSPERITY_WEIGHT * prosperity01Of(settlement)
    + T.SEED_POP_PRESSURE_WEIGHT * popPressure
    + (inflow ? T.SEED_INFLOW_BONUS : 0),
  );
  return { drive, boom, strike, inflow };
}

// ── Deterministic seeded naming (the existing NAMING_DATA vocabulary) ──────────
// NEVER generateSettlementName: that draws the GLOBAL generation rng (a draw-order
// hazard). We index the same prefix/suffix pools with the satellite fork.
/** @param {string|undefined} culture @returns {{ settlementPrefixes: string[], settlementSuffixes: string[] }} */
function namePools(culture) {
  const data = /** @type {Record<string, { settlementPrefixes?: string[], settlementSuffixes?: string[] }>} */ (
    /** @type {unknown} */ (NAMING_DATA));
  const entry = data[String(culture || '')];
  const pool = entry && Array.isArray(entry.settlementPrefixes) && Array.isArray(entry.settlementSuffixes)
    ? entry
    : data.germanic;
  return {
    settlementPrefixes: /** @type {string[]} */ (pool?.settlementPrefixes || ['Stead']),
    settlementSuffixes: /** @type {string[]} */ (pool?.settlementSuffixes || ['ing']),
  };
}
/** Draw a settlement-shaped name from the parent's culture pools with the given
 *  seeded fork (two draws: prefix, suffix). Exported for the force verb (stage 3).
 *  @param {string|undefined} culture @param {{ random: () => number }} draw @returns {string} */
export function drawSteadingName(culture, draw) {
  const pools = namePools(culture);
  const p = pools.settlementPrefixes[Math.min(pools.settlementPrefixes.length - 1, Math.floor(draw.random() * pools.settlementPrefixes.length))];
  const s = pools.settlementSuffixes[Math.min(pools.settlementSuffixes.length - 1, Math.floor(draw.random() * pools.settlementSuffixes.length))];
  return `${p}${s}`;
}

// ── News (house voice, AGGREGATE) ──────────────────────────────────────────────
/** @param {string} kind @param {string} parentId @param {number} tick @param {string|null} now
 *  @param {{ headline: string, summary: string, severity?: number, significance?: string, reasons?: string[] }} body */
function steadingNews(kind, parentId, tick, now, body) {
  return {
    id: `wizard_news.${tick}.${kind}.${parentId}`,
    tick, createdAt: now, scope: 'local', significance: body.significance || 'minor',
    severity: num(body.severity, 0.25), score: 40,
    headline: body.headline,
    summary: body.summary,
    kind: 'applied', impactKind: kind, channelType: 'trade_route',
    settlementIds: [parentId], impactIds: [], channelIds: [],
    sourceEventId: `${kind}.${parentId}.${tick}`,
    tags: ['world_pulse', 'lifecycle', kind],
    reasons: body.reasons || [],
  };
}

// ── The advance (the post-apply mover — the upswing/calamity seam) ─────────────
/**
 * @typedef {Object} LifecycleAdvanceResult
 * @property {LcUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<Record<string, unknown>>} receipts
 */

/**
 * Advance the settlement-lifecycle layer one tick (the SATELLITE LANE + the
 * stage-2 peakTier stamp). DORMANT (flag absent) ⇒ a complete no-op: the SAME
 * worldState and settlementUpdates references, zero forks, zero keys.
 *
 * Runs AFTER advanceUpswing (it reads THIS tick's freshest boom conditions) and
 * reads the W-DISCOVERY resource_strike condition planted by the apply pass.
 * Deterministic: codepoint-sorted parents, codepoint-sorted steadings, one keyed
 * fork per parent per tick (`satellite:<parent>:<tick>`) whose draws are consumed
 * in a fixed order. AGGREGATE-only — no npc roster read or written.
 *
 * @param {Object} args
 * @param {LcSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState  memoryState (post-apply)
 * @param {LcUpdate[]} args.settlementUpdates
 * @param {LcPressureIdx|null} [args.pIndex]
 * @param {LcRng|null} [args.rng]
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {LifecycleAdvanceResult}
 */
export function advanceSettlementLifecycle({ snapshot, worldState, settlementUpdates, pIndex, rng, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: flag absent ⇒ an immediate no-op. No fork, no key. ──
  if (!settlementLifecycleActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [], receipts: [] };
  }

  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  let nextUpdates = updates;
  let cloned = false;
  const ensureCloned = () => { if (!cloned) { nextUpdates = updates.slice(); cloned = true; } };
  /** @param {string} id @returns {LcSettlement|undefined} freshest (update ▸ snapshot) */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return nextUpdates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const priorLedger = satellitesLedgerOf(worldState);
  /** @type {Record<string, ParentSatellites>} the working copy (folded at the end) */
  const nextLedger = {};
  for (const pid of Object.keys(priorLedger || {})) {
    const entry = /** @type {ParentSatellites} */ ((priorLedger || {})[pid]);
    nextLedger[pid] = { ...entry, steadings: { ...(entry?.steadings || {}) } };
  }

  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  let ledgerChanged = false;

  // ── Settlement-record surgery helpers (population transfers, conserved). ──
  /** Debit/credit a settlement's population with a receipted history entry.
   *  Clamps at 0 defensively but callers pre-bound every transfer (exactness pin).
   *  @param {string} id @param {number} delta @param {string} reason @param {string} outcomeId */
  const shiftPopulation = (id, delta, reason, outcomeId) => {
    const ui = updateIndex.get(String(id));
    if (ui === undefined || !delta) return 0;
    ensureCloned();
    const s = /** @type {LcSettlement} */ (nextUpdates[ui].settlement || {});
    const current = Math.max(0, Math.round(num(s.population, 0)));
    const nextPop = Math.max(0, current + Math.round(delta));
    const applied = nextPop - current;
    nextUpdates[ui] = {
      ...nextUpdates[ui],
      settlement: {
        ...s,
        population: nextPop,
        populationHistory: [
          ...(Array.isArray(s.populationHistory) ? s.populationHistory.slice(-11) : []),
          { tick, delta: applied, population: nextPop, reason, outcomeId },
        ],
      },
    };
    return applied;
  };

  // ── PHASE A (stage 2 substrate): the monotone peakTier stamp. Write-once-upward
  // at tick time — catches EVERY promotion path (organic tier candidates, the DM
  // SHIFT_TIER verb, generation) without touching the eager tier applier.
  // Absent-tolerated: first materialization = the CURRENT tier (veterans are never
  // newborns); thereafter only ever raised. Dual-written config + _config (the
  // resourceEdits precedent) so the stamp survives a full regeneration. ──
  for (const item of items) {
    const id = String(item.id);
    const ui = updateIndex.get(id);
    if (ui === undefined) continue;
    const s = /** @type {LcSettlement} */ (nextUpdates[ui].settlement || {});
    if (s.lifecycleStatus || s.config?.lifecycleStatus) continue; // a remnant's peak is frozen history
    const currentTier = String(s.tier || s.config?.tier || 'village');
    const stored = s.config?.peakTier;
    if (stored && tierRank(currentTier) <= tierRank(stored)) continue;
    ensureCloned();
    const fresh = /** @type {LcSettlement} */ (nextUpdates[ui].settlement || {});
    const nextConfig = { ...(fresh.config || {}), peakTier: currentTier };
    /** @type {LcSettlement} */
    const next = { ...fresh, config: nextConfig };
    if (fresh._config && typeof fresh._config === 'object') {
      next._config = { ...fresh._config, peakTier: currentTier };
    }
    nextUpdates[ui] = { ...nextUpdates[ui], settlement: next };
    if (stored) receipts.push({ id, kind: 'peak_tier_raised', from: stored, to: currentTier });
  }

  // ── PHASE B: THE SATELLITE LANE — per town+ parent, codepoint-sorted. ──
  const parentIds = items.map((it) => String(it.id)).sort(codepoint);
  for (const parentId of parentIds) {
    const parent0 = freshSettlement(parentId);
    if (!parent0) continue;
    if (parent0.lifecycleStatus || parent0.config?.lifecycleStatus) continue; // remnants seed nothing
    const parentTier = String(parent0.tier || 'village');
    const cap = num(/** @type {Record<string, unknown>} */ (T.SATELLITE_CAPS)[parentTier], 0);
    const prior = nextLedger[parentId] || null;
    const hasLedgerEntry = !!prior;
    let sats = satellitesOf(nextLedger, parentId);
    if (!cap && !sats.length && !hasLedgerEntry) continue; // sub-town parent with no history — sparse skip

    // The one keyed fork per parent per tick; draws consumed in FIXED order below.
    const fork = rng && typeof rng.fork === 'function' ? rng.fork(`satellite:${parentId}:${tick}`) : null;
    const draw = () => (fork && typeof fork.random === 'function' ? fork.random() : 0);

    // ── B1. SEEDING integrator (town+ only). ──
    let seedAcc = num(prior?.seedAcc, 0);
    let lastSeedTick = Number.isFinite(prior?.lastSeedTick) ? num(prior?.lastSeedTick, 0) : null;
    if (cap > 0) {
      const { drive, boom, strike, inflow } = seedingDrive({ settlement: parent0, tick });
      seedAcc = stepSeeding(seedAcc, drive);
      const cooled = lastSeedTick == null || (tick - lastSeedTick) >= T.SEED_COOLDOWN;
      const armed = seedAcc >= T.SEED_FLOOR && cooled;
      if (armed && sats.length >= cap) {
        // Deferral-visible (the caps + cadence pin): armed but cap-held.
        receipts.push({ id: parentId, kind: 'satellite_deferred', reason: 'cap', cap, count: sats.length });
      } else if (armed) {
        // FOUND THE STEADING. Draw order: name prefix, name suffix, founders spread.
        const name = drawSteadingName(parent0.culture, { random: draw });
        const founders = T.FOUNDERS_MIN + Math.floor(draw() * T.FOUNDERS_SPREAD);
        // CONSERVATION AT BIRTH: the founders debit the parent — and never below the
        // parent's own tier floor (the frontier never demotes its parent).
        const parentMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES))[parentTier] || {}).min, 0);
        const parentPop = Math.max(0, Math.round(num(parent0.population, 0)));
        const headroom = Math.max(0, parentPop - parentMin);
        const debit = Math.min(founders, headroom);
        if (debit >= T.FOUNDERS_MIN) {
          const satId = `steading.${stablePart(parentId)}.${tick}`;
          const provenance = strike ? 'resource_strike' : 'growth';
          const resourceKey = strike ? String(strike.triggeredAt?.sourceEventTargetId || '') : '';
          const usedOrbits = new Set(sats.map((r) => num(r.orbit, 0)));
          let orbit = 0;
          while (usedOrbits.has(orbit)) orbit += 1;
          const applied = shiftPopulation(
            parentId, -debit,
            `Families strike out to found the steading of ${name}.`,
            `lifecycle.found.${satId}`,
          );
          /** @type {SatelliteRecord} */
          const rec = {
            id: satId, name, parentId, tier: 'thorp', population: Math.abs(applied),
            foundedTick: tick, provenance,
            ...(resourceKey ? { resourceKey } : {}),
            orbit, inflow: Math.abs(applied), backing01: 0,
            history: [
              provenance === 'resource_strike'
                ? `Founded on the new ${resourceKey.replace(/_/g, ' ')} workings (tick ${tick}).`
                : `Founded by ${Math.abs(applied)} settlers out of ${String(parent0.name || parentId)} (tick ${tick}).`,
            ],
          };
          nextLedger[parentId] = {
            ...(nextLedger[parentId] || { steadings: {} }),
            steadings: { ...(nextLedger[parentId]?.steadings || {}), [satId]: rec },
          };
          lastSeedTick = tick;
          seedAcc = 0; // the pressure is spent on the founding
          ledgerChanged = true;
          receipts.push({
            id: parentId, kind: 'satellite_founded', satId, name, founders: Math.abs(applied),
            provenance, ...(resourceKey ? { resourceKey } : {}), orbit,
            sources: { boom, strike: !!strike, inflow },
          });
          newsEntries.push(steadingNews('steading_founded', parentId, tick, now, {
            headline: `A new steading rises near ${String(parent0.name || parentId)}`,
            summary: provenance === 'resource_strike'
              ? `${Math.abs(applied)} settlers have raised the steading of ${name} on the new ${resourceKey.replace(/_/g, ' ')} workings.`
              : `${Math.abs(applied)} settlers have struck out from ${String(parent0.name || parentId)} to found the steading of ${name}.`,
            reasons: [
              boom ? 'A boom sends capital and families looking outward.' : null,
              strike ? 'A fresh resource strike wants hands at the vein.' : null,
              inflow ? 'Newcomers the town cannot absorb become the frontier.' : null,
            ].filter((r) => r != null).map(String),
          }));
        }
      }
    }

    // ── B2. PER-STEADING LIFECYCLE (codepoint-ordered; draws in this order). ──
    const parentNow = () => freshSettlement(parentId);
    for (const rec of satellitesOf(nextLedger, parentId)) {
      const parentLive = parentNow();
      const backing01 = steadingBacking01(parentLive, pIndex, parentId);
      /** @type {SatelliteRecord} */
      let next = { ...rec, backing01: Math.round(backing01 * 10000) / 10000 };

      if (backing01 >= T.GROW_BACKING_FLOOR && !next.charterPending) {
        // GROW — a parent→steading transfer (conserved; headroom-capped).
        next.starvingSince = undefined;
        const want = Math.max(1, Math.round(next.population * (T.GROWTH_BASE + T.GROWTH_BACKING * backing01)));
        const parentMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES))[String(parentLive?.tier || 'village')] || {}).min, 0);
        const parentPop = Math.max(0, Math.round(num(parentLive?.population, 0)));
        const transfer = Math.min(want, Math.max(0, parentPop - parentMin));
        if (transfer > 0) {
          const applied = shiftPopulation(
            parentId, -transfer,
            `Settlers move out to the steading of ${next.name}.`,
            `lifecycle.grow.${next.id}.${tick}`,
          );
          next.population += Math.abs(applied);
          next.inflow += Math.abs(applied);
        }
        // PROMOTE up the in-orbit ladder (the popToTier idiom at the record scale).
        const hamletMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES)).hamlet || {}).min, 61);
        const villageMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES)).village || {}).min, 401);
        if (next.tier === 'thorp' && next.population >= hamletMin) {
          next.tier = 'hamlet';
          next.history = [...next.history.slice(-(T.HISTORY_CAP - 1)), `Grew into a hamlet (tick ${tick}).`];
          receipts.push({ id: parentId, kind: 'satellite_promoted', satId: next.id, name: next.name, tier: 'hamlet', population: next.population });
        }
        if (!next.charterPending && next.population >= villageMin) {
          // CHARTER-PENDING (the owner's graduation-at-village ruling) — VISIBLE,
          // chronicle-noted, deferral-visible; NEVER a silent cap. The V2 machinery
          // executes pending charters (parked, its own commission).
          next.charterPending = true;
          next.charterPendingSince = tick;
          next.history = [...next.history.slice(-(T.HISTORY_CAP - 1)), 'The steading has outgrown its parent\'s shadow; a charter awaits.'];
          receipts.push({ id: parentId, kind: 'satellite_charter_pending', satId: next.id, name: next.name, population: next.population, deferredTo: 'V2 graduation (owner-parked)' });
          newsEntries.push(steadingNews('steading_charter_pending', parentId, tick, now, {
            headline: `${next.name} has outgrown its parent's shadow`,
            summary: `The steading of ${next.name} has reached village scale — a charter awaits.`,
            significance: 'moderate', severity: 0.35,
            reasons: ['Graduation to a chartered settlement is owner-ruled to fire at village scale (V2 executes pending charters).'],
          }));
        }
      } else if (!next.charterPending && backing01 < T.STARVE_BACKING_FLOOR) {
        // STARVE — the decline dwell (a tick STAMP; catch-up-safe), then the death draw.
        const since = Number.isFinite(next.starvingSince) ? num(next.starvingSince, tick) : tick;
        next.starvingSince = since;
        const dwell = tick - since;
        if (dwell >= T.STARVE_DWELL && draw() < T.STARVE_DEATH_P) {
          // THE STEADING DIES — quickly, forever (design §1). Residents flow back;
          // an abandoned-steading note lands in the parent's history; NEVER a ruin
          // (THE SCARCITY LAW — a satellite never earned one).
          const residual = Math.max(0, Math.round(next.population));
          if (residual > 0) {
            shiftPopulation(
              parentId, residual,
              `The steading of ${next.name} failed; its folk came back to ${String(parentLive?.name || parentId)}.`,
              `lifecycle.abandon.${next.id}.${tick}`,
            );
          }
          const steadings = { ...(nextLedger[parentId]?.steadings || {}) };
          delete steadings[next.id];
          nextLedger[parentId] = { ...(nextLedger[parentId] || {}), steadings };
          ledgerChanged = true;
          receipts.push({
            id: parentId, kind: 'satellite_abandoned', satId: next.id, name: next.name,
            residualReturned: residual, dwell, remnant: 'none — a satellite never mints a ruin (the scarcity law)',
          });
          newsEntries.push(steadingNews('steading_abandoned', parentId, tick, now, {
            headline: `The steading of ${next.name} is abandoned`,
            summary: `Without backing or newcomers, ${next.name} failed; its last folk walked back to ${String(parentLive?.name || parentId)}.`,
            severity: 0.3,
            reasons: [`Backing fell to ${Math.round(backing01 * 100)}% and stayed there for ${dwell} ticks.`],
          }));
          continue; // record removed — no write-back below
        }
      } else {
        // Adequate-but-not-growing band (or charter-pending): hold steady, clear the dwell.
        next.starvingSince = undefined;
      }

      // Write the (possibly unchanged content) record back only on a REAL change.
      const beforeJson = JSON.stringify(rec);
      /** @type {Record<string, unknown>} */
      const compact = {};
      for (const [k, v] of Object.entries(next)) if (v !== undefined) compact[k] = v;
      if (JSON.stringify(compact) !== beforeJson) {
        nextLedger[parentId] = {
          ...(nextLedger[parentId] || { steadings: {} }),
          steadings: { ...(nextLedger[parentId]?.steadings || {}), [next.id]: /** @type {SatelliteRecord} */ (compact) },
        };
        ledgerChanged = true;
      }
    }

    // ── B3. CONVERGENCE — one deterministic pair scan per parent per tick:
    // codepoint-ordered ids, first ORBIT-ADJACENT pair old enough whose combined
    // population reaches hamlet scale; a seeded draw gates the merge. ──
    sats = satellitesOf(nextLedger, parentId);
    if (sats.length >= 2) {
      const hamletMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES)).hamlet || {}).min, 61);
      let merged = false;
      for (let i = 0; i < sats.length && !merged; i += 1) {
        for (let j = i + 1; j < sats.length && !merged; j += 1) {
          const a = sats[i];
          const b = sats[j];
          if (Math.abs(num(a.orbit, 0) - num(b.orbit, 0)) > 1) continue; // close orbit-proximity only
          if (tick - num(a.foundedTick, tick) < T.CONVERGE_MIN_AGE) continue;
          if (tick - num(b.foundedTick, tick) < T.CONVERGE_MIN_AGE) continue;
          if (a.population + b.population < hamletMin) continue;
          if (draw() >= T.CONVERGE_P) continue;
          // MERGE b into a (codepoint-lower id survives): populations SUM (conservation),
          // histories concatenate, the receipt names both steadings.
          /** @type {SatelliteRecord} */
          const folded = {
            ...a,
            tier: 'hamlet',
            population: a.population + b.population,
            inflow: a.inflow + b.inflow,
            history: [
              ...a.history, ...b.history,
              `${a.name} and ${b.name} folded into one palisade (tick ${tick}).`,
            ].slice(-T.HISTORY_CAP),
          };
          const steadings = { ...(nextLedger[parentId]?.steadings || {}) };
          delete steadings[b.id];
          steadings[a.id] = folded;
          nextLedger[parentId] = { ...(nextLedger[parentId] || {}), steadings };
          ledgerChanged = true;
          merged = true;
          receipts.push({
            id: parentId, kind: 'satellites_converged', satId: a.id, absorbedId: b.id,
            names: [a.name, b.name], population: folded.population, tier: 'hamlet',
          });
          newsEntries.push(steadingNews('steadings_converged', parentId, tick, now, {
            headline: `${a.name} and ${b.name} fold into one palisade`,
            summary: `The neighbouring steadings of ${a.name} and ${b.name} have grown together into a single hamlet of ${folded.population}.`,
            severity: 0.3, significance: 'moderate',
            reasons: ['A second, distinct hamlet-birth path: coalescence of a frontier, not promotion of a steading.'],
          }));
        }
      }
    }

    // ── B4. THE TRIBUTARY — one bounded, receipted lift condition on the parent
    // (idempotent same-id upsert; removed when the last steading is gone). ──
    sats = satellitesOf(nextLedger, parentId);
    const ui = updateIndex.get(parentId);
    if (ui !== undefined) {
      const parentLive = /** @type {LcSettlement} */ (nextUpdates[ui].settlement || {});
      const condId = `condition.${STEADING_TRIBUTARY_ARCHETYPE}.${stablePart(parentId)}`;
      const share = satelliteTributary01(sats, num(parentLive.population, 0));
      const severity = Math.min(T.TRIBUTARY_SEVERITY_MAX, Math.round(share * 2 * 100) / 100);
      const existing = (Array.isArray(parentLive.activeConditions) ? parentLive.activeConditions : [])
        .find((c) => c?.id === condId);
      if (sats.length && severity >= 0.02) {
        if (!existing || num(/** @type {{ severity?: number }} */ (existing).severity, -1) !== severity) {
          ensureCloned();
          const s2 = /** @type {LcSettlement} */ (nextUpdates[ui].settlement || {});
          nextUpdates[ui] = {
            ...nextUpdates[ui],
            settlement: /** @type {LcSettlement} */ (withActiveCondition(
              /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (s2)),
              {
                id: condId,
                archetype: STEADING_TRIBUTARY_ARCHETYPE,
                label: 'Steading tributary',
                description: `Fed by ${sats.length} outlying steading${sats.length === 1 ? '' : 's'} — grain, timber, and ore flow in from the orbit.`,
                severity,
                status: 'stable',
                // Both systems scan in SIGNED mode (causalState.applyConditions), so the
                // LIFT registration makes this RAISE them. economic_capacity is
                // deliberately NOT listed — its scan is drain-mode (a lift there would
                // invert into a cost, the polarity bug class).
                affectedSystems: ['food_security', 'trade_connectivity'],
                causes: [{ source: 'world_pulse', detail: 'Satellite steadings tithe their surplus to the parent town.' }],
              },
            )),
          };
          receipts.push({ id: parentId, kind: 'tributary', steadings: sats.length, severity, capped: share >= T.TRIBUTARY_POP_SHARE_CAP });
        }
      } else if (existing) {
        ensureCloned();
        const s2 = /** @type {LcSettlement} */ (nextUpdates[ui].settlement || {});
        nextUpdates[ui] = {
          ...nextUpdates[ui],
          settlement: /** @type {LcSettlement} */ (withoutActiveCondition(
            /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (s2)), condId)),
        };
      }
    }

    // ── B5. Fold the parent's ledger entry (conditional materialization). ──
    const entry = nextLedger[parentId];
    const steadingCount = entry ? Object.keys(entry.steadings || {}).length : 0;
    const cooldownLive = lastSeedTick != null && (tick - lastSeedTick) < T.SEED_COOLDOWN;
    if (steadingCount || cooldownLive || seedAcc > 0.001) {
      /** @type {ParentSatellites} */
      const compactEntry = { steadings: entry ? entry.steadings : {} };
      if (seedAcc > 0.001) compactEntry.seedAcc = Math.round(seedAcc * 10000) / 10000;
      if (lastSeedTick != null && cooldownLive) compactEntry.lastSeedTick = lastSeedTick;
      const beforeJson = JSON.stringify(priorLedger ? priorLedger[parentId] ?? null : null);
      if (JSON.stringify(compactEntry) !== beforeJson) ledgerChanged = true;
      nextLedger[parentId] = compactEntry;
    } else if (nextLedger[parentId]) {
      delete nextLedger[parentId]; // drop-when-empty (dormant ⇒ absent ⇒ prior bytes)
      if (priorLedger && priorLedger[parentId]) ledgerChanged = true;
    }
  }

  // ── PERSIST (drop-when-empty at the namespace key too). ──
  let nextWorldState = worldState;
  let changed = cloned;
  if (ledgerChanged) {
    nextWorldState = Object.keys(nextLedger).length
      ? setSpatialLedger(nextWorldState, 'satellites', nextLedger)
      : dropSpatialLedger(nextWorldState, 'satellites');
    changed = true;
  }

  return { worldState: nextWorldState, settlementUpdates: nextUpdates, changed, newsEntries, receipts };
}

// ════════════════════════════════════════════════════════════════════════════
// THE FIRST-CLASS LANE (design §2) — terminal death + resettlement.
// ════════════════════════════════════════════════════════════════════════════

/** The remnant grade for a dying settlement — THE SCARCITY LAW (owner verbatim:
 *  "cities or higher that have declined to the point where they are a thorpe and
 *  perished are the only things eligible to become relic ruins"). Read from the
 *  LIVE peakTier at APPLY time (monotone, so a proposal applied late never
 *  under-grades); absent-tolerated backfill = the current tier.
 *  @param {LcSettlement} settlement @returns {'relic_ruin'|'abandoned_site'} */
export function remnantGradeOf(settlement) {
  const current = String(settlement?.tier || settlement?.config?.tier || popToTier(num(settlement?.population, 0)));
  const peak = String(settlement?.config?.peakTier || current);
  return tierRank(peak) >= tierRank('city') ? 'relic_ruin' : 'abandoned_site';
}

/** Is this settlement a remnant (dead — a status, never a deletion)?
 *  @param {LcSettlement|undefined} s @returns {string} the grade, or '' when alive */
export function lifecycleStatusOf(s) {
  return String(s?.lifecycleStatus || s?.config?.lifecycleStatus || '');
}

/** The support read the terminal-decline dwell keys on (mirrors the tier lane's
 *  supportScore weights). @param {LcPressureIdx|null|undefined} pIndex @param {string} id */
function supportOf(pIndex, id) {
  return clamp01(1 - (
    pressure(pIndex, id, 'food') * 0.22
    + pressure(pIndex, id, 'conflict') * 0.24
    + pressure(pIndex, id, 'trade') * 0.2
    + pressure(pIndex, id, 'legitimacy') * 0.2
    + pressure(pIndex, id, 'disease') * 0.14
  ));
}

/** @typedef {{ declineSince?: number, lastDeathCandidateTick?: number }} LcTickMeta */
/** @typedef {Record<string, unknown>} LcCandidate */

/**
 * THE CANDIDATE EVALUATOR (the tierResourceDynamics lane) — terminal death for a
 * first-class settlement that demoted to thorp and DWELLED in terminal decline,
 * and resettlement of a remnant. Pure over (worldState, snapshot, pIndex, rng);
 * threads worldState (the decline dwell nests under
 * settlementTickStates[cid].settlementLifecycle, byte-neutral when empty).
 *
 * DORMANCY: `settlementLifecycleEnabled` absent ⇒ early return, worldState
 * UNCHANGED (same reference), zero candidates, zero forks.
 *
 * AUTHORITY: settlement_terminal_death is CAMPAIGN-ALTERING (decisionTier major,
 * the blockade_declared registration pattern) and proposal-gated on
 * majorChangesRequireProposal through authorityFor; settlement_resettled is
 * proposal-gated the same way (a structural roster change is premise-grade).
 *
 * @param {Record<string, unknown>} worldState
 * @param {LcSnapshot} snapshot
 * @param {LcPressureIdx|null} pIndex
 * @param {{ tick?: number, simulationRules?: Record<string, unknown>, spatialActive?: boolean, rng?: LcRng|null }} [context]
 * @returns {{ worldState: Record<string, unknown>, candidates: LcCandidate[] }}
 */
export function evaluateSettlementLifecycle(worldState, snapshot, pIndex, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules
    || /** @type {Record<string, unknown> | undefined} */ (worldState?.simulationRules));
  // THE DORMANCY GATE — virtual flag, absent from DEFAULT_SIMULATION_RULES.
  if (/** @type {Record<string, unknown>} */ (rules).settlementLifecycleEnabled !== true) {
    return { worldState, candidates: [] };
  }

  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  const spatialActive = context.spatialActive === true;
  const forkFn = context.rng && typeof context.rng.fork === 'function' ? context.rng.fork.bind(context.rng) : null;
  const settlementTickStates = { ...(/** @type {Record<string, Record<string, unknown>>} */ (worldState?.settlementTickStates) || {}) };
  /** @type {LcCandidate[]} */
  const candidates = [];

  // One pending lifecycle proposal per settlement (the pendingTierProposals guard —
  // candidate ids are tick-suffixed, so an unresolved proposal would gain a
  // duplicate every eligible tick).
  const pendingLifecycle = new Set((/** @type {{ proposals?: Array<{ status?: string, outcome?: { lifecyclePatch?: { saveId?: unknown } } }> }} */ (worldState)?.proposals || [])
    .filter((p) => p?.status === 'pending' && p?.outcome?.lifecyclePatch?.saveId != null)
    .map((p) => String(p.outcome?.lifecyclePatch?.saveId)));

  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  // Live (non-remnant) settlements ranked as resettlement DONORS: most prosperous
  // first (prosperity, then population, then codepoint id — deterministic).
  const donorPool = items
    .filter((it) => it.settlement && !lifecycleStatusOf(it.settlement)
      && Math.round(num(it.settlement.population, 0)) >= T.RESETTLE_DONOR_MIN_POP)
    .sort((a, b) => (prosperity01Of(b.settlement) - prosperity01Of(a.settlement))
      || (num(b.settlement?.population, 0) - num(a.settlement?.population, 0))
      || codepoint(String(a.id), String(b.id)));

  for (const item of items) {
    const s = item.settlement || {};
    const cid = String(item.id ?? '');
    const name = String(item.name || s.name || cid);
    const grade = lifecycleStatusOf(s);

    if (grade) {
      // ── RESETTLEMENT (design §2): a remnant is a privileged birth site. ──
      if (pendingLifecycle.has(cid)) continue;
      const diedAt = num(/** @type {{ lifecycleDiedAtTick?: number }} */ (s.config || {}).lifecycleDiedAtTick, NaN);
      // Generation-seeded ancients carry no death tick — always long fallow.
      const fallow = Number.isFinite(diedAt) ? tick - diedAt : T.RESETTLE_MIN_FALLOW;
      if (fallow < T.RESETTLE_MIN_FALLOW) continue;

      // Willing settlers from the most prosperous neighbours (conserved: every
      // credit to the old cell is a receipted debit somewhere real).
      /** @type {Array<{ saveId: string, delta: number, reason: string }>} */
      const donorDebits = [];
      let seed = 0;
      for (const donor of donorPool) {
        if (donorDebits.length >= T.RESETTLE_DONORS || seed >= T.RESETTLE_SEED) break;
        const did = String(donor.id);
        if (did === cid) continue;
        const give = Math.min(
          T.RESETTLE_SEED - seed,
          Math.floor(num(donor.settlement?.population, 0) * T.RESETTLE_DONOR_MAX_FRACTION),
        );
        if (give <= 0) continue;
        seed += give;
        donorDebits.push({ saveId: did, delta: -give, reason: `Families leave to raise a new settlement on the old ${name} site.` });
      }
      if (seed < T.RESETTLE_SEED_MIN) continue; // nobody nearby can spare settlers

      // §H load: nearby prosperity + route utility + the remnant's resources.
      const nearbyProsperity = donorPool.length
        ? donorPool.slice(0, T.RESETTLE_DONORS).reduce((sum, d) => sum + prosperity01Of(d.settlement), 0) / Math.min(donorPool.length, T.RESETTLE_DONORS)
        : 0;
      const route = String(s.config?.tradeRouteAccess || 'road');
      const routeUtility = ['crossroads', 'river', 'coastal', 'port'].includes(route) ? 1 : 0.4;
      const resources01 = clamp01((Array.isArray(s.config?.nearbyResources) ? s.config.nearbyResources.length : 0) / 3);
      const load = clamp01(nearbyProsperity * 0.5 + routeUtility * 0.25 + resources01 * 0.25);

      // The rebirth name: a relic ruin's name HALF-RETURNS ("New Thornwall,
      // raised on the old stones"); an abandoned site takes a fresh name from
      // the keyed fork (the old steading's name is forgotten).
      const newName = grade === 'relic_ruin'
        ? `New ${name.replace(/^New /, '')}`
        : (forkFn ? drawSteadingName(s.culture, forkFn(`resettle:${cid}:${tick}`)) : `New ${name}`);

      candidates.push({
        id: `candidate.lifecycle.resettle.${stablePart(cid)}.${tick}`,
        type: 'lifecycle',
        candidateType: 'settlement_resettled',
        ruleId: 'settlement_resettled',
        ruleFamily: 'lifecycle',
        targetSaveId: item.id,
        severity: clamp01(0.4 + load * 0.3),
        probability: clamp01(T.RESETTLE_EMIT_P + load * T.RESETTLE_LOAD_WEIGHT),
        applyMode: authorityFor(rules, 'settlement_resettled', /** @type {{ majorChangesRequireProposal?: boolean }} */ (rules).majorChangesRequireProposal ? 'proposal' : 'auto'),
        headline: `Settlers eye the old ${name} site`,
        summary: grade === 'relic_ruin'
          ? `${formatCount(seed)} settlers would raise ${newName} on the old stones — the ruin's glory is not inherited, it is aspired to.`
          : `${formatCount(seed)} settlers would found ${newName} where ${name} once stood.`,
        reasons: [
          `The site has lain fallow ${Number.isFinite(diedAt) ? fallow : 'since a former age'} — a privileged birth site (${grade.replace(/_/g, ' ')}).`,
          `Nearby prosperity ${Math.round(nearbyProsperity * 100)}%, route utility ${Math.round(routeUtility * 100)}%, remnant resources ${Math.round(resources01 * 100)}%.`,
        ],
        populationDeltas: [
          { saveId: cid, delta: seed, reason: 'Settlers raise a new steading on the old stones.' },
          ...donorDebits,
        ],
        lifecyclePatch: { kind: 'resettle', saveId: item.id, name: newName },
        proposalPayload: { kind: 'settlement_resettled', saveId: item.id, name: newName, fromGrade: grade },
        generatedAtTick: tick,
        metadata: { tick, fallow: Number.isFinite(diedAt) ? fallow : null, donors: donorDebits.length, seed },
        conflictTags: [`population:${cid}`, `tier:${cid}`, `lifecycle:${cid}`],
      });
      continue;
    }

    // ── TERMINAL DEATH (design §2): thorp-tier + extended decline dwell. ──
    const tier = String(s.tier || popToTier(num(s.population, 0)));
    const prior = /** @type {LcTickMeta|null} */ (settlementTickStates[cid]?.settlementLifecycle || null);
    if (tier !== 'thorp') {
      // Recovered above the bottom rung: the dwell clears (drop the sub-key).
      if (prior && settlementTickStates[cid]) {
        const rest = { ...settlementTickStates[cid] };
        delete rest.settlementLifecycle;
        settlementTickStates[cid] = rest;
      }
      continue;
    }
    const pop = Math.max(0, Math.round(num(s.population, 0)));
    const support = supportOf(pIndex, cid);
    const thorpMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES)).thorp || {}).min, 8);
    const declining = support <= T.DEATH_SUPPORT_FLOOR || pop < thorpMin;

    /** @type {LcTickMeta} */
    const meta = {};
    if (Number.isFinite(prior?.lastDeathCandidateTick)) meta.lastDeathCandidateTick = num(prior?.lastDeathCandidateTick, 0);
    if (declining) {
      // The decline dwell is a tick STAMP (integer arithmetic — survives the
      // M10b one-interval catch-up collapse).
      const since = Number.isFinite(prior?.declineSince) ? num(prior?.declineSince, tick) : tick;
      meta.declineSince = since;
      const dwell = tick - since;
      const cooled = meta.lastDeathCandidateTick == null
        || (tick - num(meta.lastDeathCandidateTick, 0)) >= T.DEATH_RETRY_COOLDOWN;
      if (dwell >= T.TERMINAL_DWELL && cooled && !pendingLifecycle.has(cid) && pop > 0) {
        const depth = clamp01(1 - support);
        /** @type {Array<{ saveId: string, delta: number, reason: string }>} */
        const populationDeltas = [{
          saveId: cid, delta: -pop,
          reason: 'The last residents leave with the wagons — the settlement dies.',
        }];
        /** @type {Record<string, unknown>} */
        const metadata = { tick, dwell, lifecycle: { residual: pop } };
        if (spatialActive) {
          // M4 realized-debit dispatch: the shed pool the migrationKernel reads
          // POST-APPLY (conservation asserted in dispatchMigrations).
          metadata.spatialEmigration = { loss: pop };
        } else if (pop > 0) {
          // Aspatial reconciliation (the calamity-exodus parity): 45% disperse as
          // credited migrants; the remainder is the origin-loss proxy.
          const migrants = Math.max(0, Math.round(pop * T.ASPATIAL_MIGRANT_FRACTION));
          const transfer = distributeMigrants({ sourceId: cid, migrants, snapshot, pressureIdx: pIndex, mode: 'roll', tick });
          for (const d of transfer.deltas) populationDeltas.push({ saveId: String(d.saveId), delta: num(d.delta, 0), reason: String(d.reason || '') });
          metadata.transferMode = transfer.mode;
          metadata.migrants = migrants;
        }
        meta.lastDeathCandidateTick = tick;
        candidates.push({
          id: `candidate.lifecycle.death.${stablePart(cid)}.${tick}`,
          type: 'lifecycle',
          candidateType: 'settlement_terminal_death',
          ruleId: 'settlement_terminal_death',
          ruleFamily: 'lifecycle',
          targetSaveId: item.id,
          severity: clamp01(0.7 + depth * 0.25),
          probability: clamp01(T.DEATH_EMIT_P + depth * T.DEATH_DEPTH_WEIGHT),
          // CAMPAIGN-ALTERING + proposal-gated: honors majorChangesRequireProposal
          // (the tier_change precedent), forced to proposal under
          // dm_only/recommendations by authorityFor.
          applyMode: authorityFor(rules, 'settlement_terminal_death', /** @type {{ majorChangesRequireProposal?: boolean }} */ (rules).majorChangesRequireProposal ? 'proposal' : 'auto'),
          headline: `${name} is dying`,
          summary: `${name} has dwelled in terminal decline for ${dwell} ticks; its last ${formatCount(pop)} residents may scatter for good.`,
          reasons: [
            `Demoted to the ladder's bottom rung and unsupported (support ${support.toFixed(2)}).`,
            `Terminal dwell ${dwell} ≥ ${T.TERMINAL_DWELL} — extended, never sudden.`,
            'The last residents disperse with fates UNRESOLVED — the engine kills no named character, ever.',
          ],
          populationDeltas,
          lifecyclePatch: { kind: 'terminal_death', saveId: item.id },
          proposalPayload: { kind: 'settlement_terminal_death', saveId: item.id },
          generatedAtTick: tick,
          metadata,
          conflictTags: [`population:${cid}`, `tier:${cid}`, `lifecycle:${cid}`],
        });
      }
    }

    // Conditional materialization (byte-neutral when nothing is tracked).
    if (Object.keys(meta).length) {
      settlementTickStates[cid] = { ...(settlementTickStates[cid] || {}), settlementLifecycle: meta };
    } else if (prior && settlementTickStates[cid]) {
      const rest = { ...settlementTickStates[cid] };
      delete rest.settlementLifecycle;
      settlementTickStates[cid] = rest;
    }
  }

  return { worldState: { ...worldState, settlementTickStates }, candidates };
}

// ── THE WRITER (applyWorldPulse.applyOutcomeToSettlement branch) ───────────────
const MAX_CAMPAIGN_HISTORY_EVENTS = 20; // mirrors stressorAftermath's campaign-era cap

/** Append a campaign-era historicalEvents entry (dedup by campaignEventId; the
 *  oldest campaign-era entry is pruned past the cap — generation history never).
 *  @param {LcSettlement} settlement
 *  @param {{ id: string, name: string, type: string, description: string, severity: string }} event
 *  @param {number|null} tick @returns {LcSettlement} */
function withLifecycleHistoryEvent(settlement, event, tick) {
  const history = /** @type {{ historicalEvents?: Array<Record<string, unknown>> }} */ (settlement.history || {});
  const events = Array.isArray(history.historicalEvents) ? history.historicalEvents : [];
  const eventId = `campaign.${event.id}.${tick ?? 0}`;
  if (events.some((e) => e?.campaignEventId === eventId)) return settlement;
  const entry = {
    campaignEventId: eventId, campaignEra: true, tick: tick ?? null, yearsAgo: 0,
    name: event.name, type: event.type, description: event.description,
    severity: event.severity, lastingEffects: [], plotHooks: [], anchored: true,
  };
  const campaignEvents = events.filter((e) => e?.campaignEra);
  let nextEvents = [...events, entry];
  if (campaignEvents.length + 1 > MAX_CAMPAIGN_HISTORY_EVENTS) {
    const oldest = campaignEvents.slice().sort((a, b) => (num(a.tick, 0)) - (num(b.tick, 0)))[0];
    nextEvents = nextEvents.filter((e) => e !== oldest);
  }
  return { ...settlement, history: { ...history, historicalEvents: nextEvents } };
}

/**
 * THE ONE WRITER for first-class lifecycle outcomes (imported by applyWorldPulse —
 * the resourceDynamicsKernel precedent). FORCE ≡ ORGANIC: the stage-3 verbs
 * resolve through THIS same path.
 *
 * TERMINAL DEATH: the entity KEEPS its digest cell — death is a STATUS, never a
 * deletion. Population zeroes (the outcome's populationDeltas carried the
 * receipted debit; this is the exactness backstop), institutions deactivate,
 * live conditions clear, and the status becomes the remnant grade — THE SCARCITY
 * LAW at the writer, from the LIVE peakTier. THE FATES PIN: named NPCs are
 * NEVER removed and NEVER resolved — each record gains only a `dispersed` stamp
 * ("she left with the last wagons"); the roster count is invariant.
 *
 * RESETTLEMENT: a first-class REBIRTH on the old cell (the cell never left):
 * status clears, tier restarts at thorp, peakTier RESTARTS (the ruin's glory is
 * not inherited), the new name dual-writes config.customName + _config (regen-
 * surviving), and the chronicle remembers ("raised on the old stones").
 *
 * Self-contained re-verify (the applyTierOutcomeToSettlement contract):
 * proposals re-apply from the stored outcome, possibly many ticks later — a
 * stale death (the settlement recovered above thorp, or is already a remnant)
 * and a stale rebirth (the site is no longer a remnant) safely no-op.
 *
 * @param {LcSettlement} settlement
 * @param {{ id?: string, lifecyclePatch?: { kind?: string, name?: string }, metadata?: { tick?: number } }} outcome
 * @returns {LcSettlement}
 */
export function applySettlementLifecycleOutcomeToSettlement(settlement, outcome) {
  const patch = outcome?.lifecyclePatch;
  if (!settlement || !patch || !patch.kind) return settlement;
  const tick = Number.isFinite(outcome?.metadata?.tick) ? Number(outcome?.metadata?.tick) : null;
  const name = String(settlement.name || '');

  if (patch.kind === 'terminal_death') {
    if (lifecycleStatusOf(settlement)) return settlement; // already a remnant
    const tier = String(settlement.tier || popToTier(num(settlement.population, 0)));
    if (tier !== 'thorp') return settlement;              // stale — the settlement recovered
    const grade = remnantGradeOf(settlement);             // THE SCARCITY PIN (live peakTier)

    // Institutions clear — deactivated as archaeology, never erased from the record.
    const institutions = (Array.isArray(settlement.institutions) ? settlement.institutions : [])
      .map((inst) => (inst && inst.status !== 'removed'
        ? { ...inst, status: 'removed', _worldPulseInactive: true, worldPulseFate: 'abandoned_with_the_settlement', removedByWorldPulseOutcomeId: outcome.id || null, removedReason: 'The settlement died; its last residents dispersed.' }
        : inst));

    // THE FATES PIN: dispersal stamps only — no record removed, no fate resolved.
    const npcs = (Array.isArray(settlement.npcs) ? settlement.npcs : [])
      .map((npc) => (npc && !npc.dispersed
        ? { ...npc, dispersed: true, dispersedAtTick: tick, dispersalNote: 'Left with the last wagons — fate unresolved.' }
        : npc));

    const residual = Math.max(0, Math.round(num(settlement.population, 0)));
    const config = {
      ...(settlement.config || {}),
      lifecycleStatus: grade,
      ...(tick != null ? { lifecycleDiedAtTick: tick } : {}),
    };
    /** @type {LcSettlement} */
    let next = {
      ...settlement,
      population: 0,
      lifecycleStatus: grade,
      config,
      institutions,
      npcs,
      activeConditions: [],
      ...(residual > 0 ? {
        populationHistory: [
          ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
          { tick, delta: -residual, population: 0, reason: 'The last residents left with the wagons.', outcomeId: outcome.id },
        ],
      } : {}),
      lifecycleHistory: [
        ...(Array.isArray(settlement.lifecycleHistory) ? settlement.lifecycleHistory.slice(-7) : []),
        { event: 'terminal_death', grade, tick, outcomeId: outcome.id || null },
      ],
    };
    if (settlement._config && typeof settlement._config === 'object') {
      next._config = { ...settlement._config, lifecycleStatus: grade, ...(tick != null ? { lifecycleDiedAtTick: tick } : {}) };
    }
    next = withLifecycleHistoryEvent(next, {
      id: `lifecycle_death.${stablePart(name || 'settlement')}`,
      name: grade === 'relic_ruin' ? `The Fall of ${name}` : `The Abandonment of ${name}`,
      type: 'decline',
      description: grade === 'relic_ruin'
        ? `${name} — once a great city — dwindled to a final thorp and died; its stones stand as a relic ruin. The last residents left with the wagons, their fates unresolved.`
        : `${name} dwindled and was abandoned; a quiet site marks where it stood. The last residents left with the wagons, their fates unresolved.`,
      severity: 'major',
    }, tick);
    return next;
  }

  if (patch.kind === 'resettle') {
    const fromGrade = lifecycleStatusOf(settlement);
    if (!fromGrade) return settlement;                    // stale — no remnant here anymore
    const newName = String(patch.name || `New ${name}`);
    const config = { ...(settlement.config || {}) };
    delete config.lifecycleStatus;
    delete config.lifecycleDiedAtTick;
    config.tier = 'thorp';
    config.settType = 'thorp';
    config.peakTier = 'thorp';                            // the glory is aspired to, not inherited
    config.customName = newName;                          // regen-surviving (assembleSettlement reads it)
    /** @type {LcSettlement} */
    let next = { ...settlement, config };
    delete next.lifecycleStatus;
    next.name = newName;
    next.tier = 'thorp';
    next.lifecycleHistory = [
      ...(Array.isArray(settlement.lifecycleHistory) ? settlement.lifecycleHistory.slice(-7) : []),
      { event: 'resettled', fromGrade, formerName: name, tick, outcomeId: outcome.id || null },
    ];
    if (settlement._config && typeof settlement._config === 'object') {
      /** @type {Record<string, unknown>} */
      const raw = { ...settlement._config, peakTier: 'thorp', customName: newName, tier: 'thorp' };
      delete raw.lifecycleStatus;
      delete raw.lifecycleDiedAtTick;
      next._config = raw;
    }
    next = withLifecycleHistoryEvent(next, {
      id: `lifecycle_resettle.${stablePart(newName)}`,
      name: `${newName}, Raised on the Old Stones`,
      type: 'founding',
      description: fromGrade === 'relic_ruin'
        ? `${newName} was founded on the ruin of ${name} — the old stones remember, and the new thorp aspires.`
        : `${newName} was founded where ${name} once stood; the old site lives again.`,
      severity: 'moderate',
    }, tick);
    return next;
  }

  return settlement;
}
