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
 *   • RNG — stable keyed forks only (`satellite:<parent>:<tick>`, and the W-E
 *     sibling `satellite:<parent>:<tick>:site`), §H situation-loaded; no fork when
 *     dark; draw order inside a fork is fixed (codepoint-ordered iteration) so the
 *     parent stream is never touched. The site fork is a DISTINCT key precisely so
 *     that adding topographic placement left the existing satellite stream's draw
 *     sequence (name, founders, starve, converge) byte-identical.
 *   • TOPOGRAPHY (W-E / J-D4) — a founding SAMPLES the frozen spatial rasters
 *     READ-ONLY (steadingTopography.js: the territory partition, the integer cost
 *     field, the gates' named terrain classes) to pick a site inside the parent's
 *     own country and to derive starting resources through the EXISTING
 *     resource-strike vocabulary. The digest is never written and satellites never
 *     join it. An ASPATIAL world (no active digest) samples nothing, so its records
 *     carry neither `site` nor `resources` and are byte-identical to pre-W-E.
 *   • CATCH-UP INTEGRITY — every dwell/cooldown is a TICK STAMP compared by
 *     integer subtraction (tick − since), never an incrementing counter, so the
 *     M10b one-interval catch-up collapse cannot lose or double-count dwell.
 */

import { clamp01 } from '../../kernel/math.js';
import { POPULATION_RANGES, TIER_ORDER, PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { NAMING_DATA } from '../../data/namingData.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, activeSpatialDigest } from '../spatial/distanceRead.js';
import { withActiveCondition, withoutActiveCondition } from '../activeConditions.js';
import { stablePart } from './stablePart.js';
import { advanceDemographics } from './demographicsKernel.js';
import { pickLine, LIFECYCLE_NEWS } from './eventProse.js';
import { chooseSteadingSite, deriveSteadingResources, landformPlaceName, resourcePhrase } from './steadingTopography.js';

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
 * @property {{ cell: number, landform: string, cost: number, source: 'gate_terrain'|'cost_band' }} [site]
 *   W-E: the sampled ground. Present ONLY when a frozen spatial digest was active
 *   at the founding; the cell is a READ key into the frozen rasters and is never
 *   written back to them (a satellite is never a digest member).
 * @property {string[]} [resources] W-E: starting resources derived from `site`
 *   through the existing RESOURCE_DATA vocabulary (closed; absent when aspatial)
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
  // THE EMPTY-SETTLEMENT FAST PATH (owner-signed 2026-07-31 — the zombie cure).
  // Population at/below ZERO_POP_FLOOR is the STRONGEST terminal signal, never a
  // disqualifier (the diagnosed soak defect: a `pop > 0` eligibility gate meant a
  // settlement at population zero could neither die nor recover — it zombied for
  // decades). A DEDICATED dwell (`zeroSince`, a tick STAMP — catch-up-safe) starts
  // at the first effectively-empty sighting and HOLDS through trickle bounces
  // below ZERO_POP_CLEAR (the observed zombie oscillated 0↔24 on migrant credits;
  // every crossing reset the terminal dwell and immunized the corpse). Once the
  // dwell is met AND the settlement is empty NOW, the death candidate emits with
  // CERTAINTY (probability 1): an empty town rolls no survival lottery. The dwell
  // is ONE SEASON — the satellite lane's STARVE_DWELL "quickly die" precedent at
  // first-class scale — not the two-year TERMINAL_DWELL.
  ZERO_POP_FLOOR: 4,                // at/below this the settlement is effectively empty (a last handful)
  ZERO_POP_CLEAR: 32,               // recovery to at/above this clears the zero dwell (4x the thorp floor; above the 24-head trickle)
  ZERO_POP_DWELL: 13,               // ticks effectively empty before certain death (~a season — the STARVE_DWELL rhythm)
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

// ── THE SHARED STEADING MINT (force ≡ organic BY CONSTRUCTION) ────────────────
/**
 * Mint one satellite-steading record + its parent debit. The ONE founding path:
 * the organic mover AND the FORCE_FOUND_STEADING verb both call this, so a
 * forced founding is structurally identical to an organic one (same record
 * shape, same headroom clamp, same conservation). Pure — the caller applies
 * the debit and folds the record.
 *
 * @param {Object} args
 * @param {LcSettlement|undefined} args.parent
 * @param {string} args.parentId
 * @param {SatelliteRecord[]} args.sats existing steadings of this parent
 * @param {number} args.tick
 * @param {() => number} args.draw  the keyed fork's sequential draw
 * @param {string|null} [args.nameOverride]   FORCE dial: freetext name (cosmetic)
 * @param {string|null} [args.resourceKey]    the struck vein (resource_strike / force dial)
 * @param {SatelliteRecord['provenance']} args.provenance
 * @param {import('./steadingTopography.js').TopoDigest|null} [args.digest] the FROZEN
 *   spatial digest, READ-ONLY (W-E). Absent/null ⇒ no ground is sampled and the
 *   record is byte-identical to a pre-W-E founding.
 * @param {(() => number)|null} [args.siteDraw] the SITE fork's sequential draw
 *   (`satellite:<parent>:<tick>:site`) — a distinct stream from `draw`
 * @returns {{ record: SatelliteRecord, debit: number } | { refusal: string }}
 */
export function mintSteading({ parent, parentId, sats, tick, draw, nameOverride = null, resourceKey = null, provenance, digest = null, siteDraw = null }) {
  const parentTier = String(parent?.tier || 'village');
  const cap = num(/** @type {Record<string, unknown>} */ (T.SATELLITE_CAPS)[parentTier], 0);
  if (!cap) return { refusal: 'only town-or-higher parents seed steadings' };
  if (sats.length >= cap) return { refusal: `the ${parentTier} cap (${cap}) is reached` };
  // Draw order is FIXED: name prefix, name suffix, founders spread.
  const name = String(nameOverride || '').trim() || drawSteadingName(parent?.culture, { random: draw });
  const founders = T.FOUNDERS_MIN + Math.floor(draw() * T.FOUNDERS_SPREAD);
  // CONSERVATION AT BIRTH: the founders debit the parent — never below the
  // parent's own tier floor (the frontier never demotes its parent).
  const parentMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES))[parentTier] || {}).min, 0);
  const parentPop = Math.max(0, Math.round(num(parent?.population, 0)));
  const debit = Math.min(founders, Math.max(0, parentPop - parentMin));
  if (debit < T.FOUNDERS_MIN) return { refusal: 'the parent has no population headroom above its tier floor' };
  const usedOrbits = new Set(sats.map((r) => num(r.orbit, 0)));
  let orbit = 0;
  while (usedOrbits.has(orbit)) orbit += 1;
  const key = String(resourceKey || '');
  // ── W-E / J-D4: SAMPLE THE GROUND (read-only; absent digest ⇒ absent site). ──
  // The site draw runs on its OWN keyed fork, so the founding's name/founders
  // draws above (and every later draw on the satellite fork this tick) are
  // unchanged by the existence of this feature.
  const site = digest && typeof siteDraw === 'function'
    ? chooseSteadingSite({
      digest, parentId, draw: siteDraw, resourceKey: key || null,
      occupied: sats.map((r) => num(r.site?.cell, -1)).filter((c) => c >= 0),
    })
    : null;
  const resources = site && typeof siteDraw === 'function'
    ? deriveSteadingResources({
      landform: site.landform, draw: siteDraw, resourceKey: key || null,
      parentResources: Array.isArray(parent?.config?.nearbyResources) ? parent.config.nearbyResources : [],
    })
    : [];
  const ground = site ? ` on ${landformPlaceName(site.landform)}` : '';
  /** @type {SatelliteRecord} */
  const record = {
    id: `steading.${stablePart(parentId)}.${tick}`,
    name, parentId, tier: 'thorp', population: debit,
    foundedTick: tick, provenance,
    ...(key ? { resourceKey: key } : {}),
    ...(site ? { site } : {}),
    ...(resources.length ? { resources } : {}),
    orbit, inflow: debit, backing01: 0,
    history: [
      provenance === 'resource_strike'
        ? `Founded on the new ${key.replace(/_/g, ' ')} workings${ground} (tick ${tick}).`
        : provenance === 'forced'
          ? `Founded by decree${ground}: ${debit} settlers out of ${String(parent?.name || parentId)} (tick ${tick}).`
          : `Founded by ${debit} settlers out of ${String(parent?.name || parentId)}${ground} (tick ${tick}).`,
    ],
  };
  return { record, debit };
}

// ── News (house voice, AGGREGATE) ──────────────────────────────────────────────
/** @param {string} kind @param {string} parentId @param {number} tick @param {string|null} now
 *  @param {{ headline: string, summary: string, severity?: number, significance?: string, reasons?: string[] }} body */
function steadingNews(kind, parentId, tick, now, body) {
  return {
    id: `wizard_news.${tick}.${kind}.${parentId}`,
    tick, createdAt: now, scope: 'local', significance: body.significance || 'notable',
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
export function advanceSettlementLifecycle({ snapshot, worldState: hostWorldState, settlementUpdates, pIndex, rng, tick, now }) {
  // ── THE DEMOGRAPHIC STEP (WAVE P1 — docs/DESIGN_DEMOGRAPHIC_ENGINE.md §8 names
  // this module the HOST). It runs BEFORE this module's own dormancy gate, because
  // demography is gated by its OWN virtual flag (`demographicsEnabled`) and must not
  // inherit the settlement-lifecycle switch. DARK ⇒ advanceDemographics returns the
  // SAME worldState and settlementUpdates REFERENCES, so wiring it in cannot perturb
  // a byte — the fenced dormancy golden asserts object IDENTITY, not deep equality
  // (the J1 precedent). LIT, it REPLACES the raw proportional growth line: the same
  // flag stops populationDynamics emitting its organic-growth candidate, because law
  // 1 says there is no growth term that is not a birth. The decline and terminal
  // lanes below are UNCHANGED; the soak proved they work. ──
  // WAVE P2 threads the pressure index this seam ALREADY holds: the push drivers read
  // live defense, crime and hostility pressure through it, and the defense guard fails
  // closed without it (no threat evidence, no flight over a low readiness score).
  const demo = advanceDemographics({
    snapshot: /** @type {import('./demographicsKernel.js').DemoSnapshot} */ (/** @type {unknown} */ (snapshot)),
    worldState: hostWorldState,
    settlementUpdates: /** @type {import('./demographicsKernel.js').DemoUpdate[]} */ (/** @type {unknown} */ (settlementUpdates)),
    rng, tick,
    pIndex: /** @type {import('./demographicsKernel.js').DemoPressureIndex|null} */ (
      /** @type {unknown} */ (pIndex || null)),
    season: typeof asObject(asObject(hostWorldState).calendar).season === 'string'
      ? String(asObject(asObject(hostWorldState).calendar).season)
      : null,
  });
  const worldState = demo.worldState;
  const updates = /** @type {LcUpdate[]} */ (/** @type {unknown} */ (demo.settlementUpdates));
  // ── DORMANCY GATE: flag absent ⇒ an immediate no-op. No fork, no key. ──
  if (!settlementLifecycleActive(worldState)) {
    return {
      worldState,
      settlementUpdates: updates,
      changed: demo.changed,
      newsEntries: [],
      receipts: [
        .../** @type {Array<Record<string, unknown>>} */ (/** @type {unknown} */ (demo.receipts)),
        ...demo.migrationReceipts,
      ],
    };
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

  // W-E / J-D4: the FROZEN spatial rasters, READ-ONLY, resolved once per tick
  // through the ONE constitutional gate (activeSpatialDigest). Null on every
  // aspatial world ⇒ no ground is sampled anywhere below.
  const spatialDigest = /** @type {import('./steadingTopography.js').TopoDigest|null} */ (
    /** @type {unknown} */ (activeSpatialDigest(/** @type {never} */ (worldState))));

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
  const receipts = [
    .../** @type {Array<Record<string, unknown>>} */ (/** @type {unknown} */ (demo.receipts)),
    ...demo.migrationReceipts,
  ];
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
    if (parent0.lifecycleStatus || parent0.config?.lifecycleStatus) {
      // TERMINAL-DEATH ORBIT DISPOSAL (r2 economy-upswing-5): a parent that died holding live
      // steadings must not strand them frozen in the ledger outside Σ (and a later resettlement
      // must not inherit the dead town's orbit). The death is ONE event — the outlying folk left
      // with the last wagons too. No return-to-parent: the parent is a corpse; drop the records,
      // receipt it. Runs once — next tick the ledger carries no entry for this parent.
      //   CONSERVATION NOTE / JUDGMENT (vetoable): the orphaned steading population is treated as
      //   ORIGIN-LOSS (uncredited exit from Σ), NOT threaded through distributeMigrants the way
      //   the parent's own aspatial death credits 45% (buildTerminalDeathOutcome / ASPATIAL_
      //   MIGRANT_FRACTION). Reasons: (a) crediting would consume RNG (distributeMigrants mode
      //   'roll') inside this disposal branch, perturbing the same-seed stream for every LIT
      //   lifecycle world; (b) it is a cross-layer dependency this pure aspatial kernel does not
      //   otherwise carry; (c) the whole lane is dormant by default and the stranded pool is
      //   bounded-small (≤ a few thorp/hamlet records). Origin-loss is conservation-CONSISTENT
      //   with the death model (the parent's other 55% is origin-loss, "fates unresolved"); it
      //   simply forgoes the 45% neighbour credit. If full parent-parity is wanted, thread the
      //   dispersed pool through distributeMigrants here — a clean follow-up.
      const orphanSats = satellitesOf(nextLedger, parentId);
      if (orphanSats.length) {
        const dispersed = orphanSats.reduce((sum, r) => sum + Math.max(0, Math.round(num(r.population, 0))), 0);
        delete nextLedger[parentId];
        ledgerChanged = true;
        receipts.push({
          id: parentId, kind: 'satellite_orbit_dispersed', count: orphanSats.length,
          dispersedPopulation: dispersed, satIds: orphanSats.map((r) => r.id),
          reason: 'parent terminal death — the orbit dispersed with the settlement',
        });
        newsEntries.push(steadingNews('steading_orbit_dispersed', parentId, tick, now, {
          headline: pickLine(LIFECYCLE_NEWS.orbit_dispersed.headline, `${parentId}:${tick}:h`, { parent: String(parent0.name || parentId) }),
          summary: pickLine(LIFECYCLE_NEWS.orbit_dispersed.summary, `${parentId}:${tick}:s`, {
            parent: String(parent0.name || parentId), count: orphanSats.length, countS: orphanSats.length === 1 ? '' : 's', dispersed,
          }),
          severity: 0.35,
          reasons: ['A dead parent cannot hold its orbit; the frontier folk dispersed with the last wagons.'],
        }));
      }
      continue; // remnants seed nothing
    }
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
        // FOUND THE STEADING — through the ONE shared mint (the force verb uses
        // the same path: force ≡ organic by construction). The SITE fork is
        // created only here, on the founding tick, and only when a digest is
        // active: an aspatial world forks nothing new and stays byte-identical.
        const siteFork = spatialDigest && rng && typeof rng.fork === 'function'
          ? rng.fork(`satellite:${parentId}:${tick}:site`)
          : null;
        const minted = mintSteading({
          parent: parent0, parentId, sats, tick, draw,
          resourceKey: strike ? String(strike.triggeredAt?.sourceEventTargetId || '') : null,
          provenance: strike ? 'resource_strike' : 'growth',
          digest: spatialDigest,
          siteDraw: siteFork ? () => siteFork.random() : null,
        });
        if ('record' in minted) {
          const { record: rec, debit } = minted;
          shiftPopulation(
            parentId, -debit,
            `Families strike out to found the steading of ${rec.name}.`,
            `lifecycle.found.${rec.id}`,
          );
          nextLedger[parentId] = {
            ...(nextLedger[parentId] || { steadings: {} }),
            steadings: { ...(nextLedger[parentId]?.steadings || {}), [rec.id]: rec },
          };
          lastSeedTick = tick;
          seedAcc = 0; // the pressure is spent on the founding
          ledgerChanged = true;
          receipts.push({
            id: parentId, kind: 'satellite_founded', satId: rec.id, name: rec.name, founders: debit,
            provenance: rec.provenance, ...(rec.resourceKey ? { resourceKey: rec.resourceKey } : {}), orbit: rec.orbit,
            ...(rec.site ? { site: rec.site } : {}),
            ...(rec.resources ? { resources: rec.resources } : {}),
            sources: { boom, strike: !!strike, inflow },
          });
          // THE GROUND, NAMED IN-WORLD (W-E). A sampled site swaps the growth
          // summary for the site pool; a strike keeps its own voice (the workings
          // are the stronger fact) and carries the ground in its reasons.
          const place = rec.site ? landformPlaceName(rec.site.landform) : '';
          newsEntries.push(steadingNews('steading_founded', parentId, tick, now, {
            headline: pickLine(LIFECYCLE_NEWS.founded.headline, `${parentId}:${rec.id}:${tick}:h`, { parent: String(parent0.name || parentId) }),
            summary: rec.provenance === 'resource_strike'
              ? pickLine(LIFECYCLE_NEWS.founded.summary_strike, `${parentId}:${rec.id}:${tick}:s`, { debit, name: rec.name, resource: String(rec.resourceKey || '').replace(/_/g, ' ') })
              : rec.site
                ? pickLine(LIFECYCLE_NEWS.founded.summary_site, `${parentId}:${rec.id}:${tick}:s`, { debit, name: rec.name, parent: String(parent0.name || parentId), place })
                : pickLine(LIFECYCLE_NEWS.founded.summary_growth, `${parentId}:${rec.id}:${tick}:s`, { debit, name: rec.name, parent: String(parent0.name || parentId) }),
            reasons: [
              boom ? 'A boom sends capital and families looking outward.' : null,
              strike ? 'A fresh resource strike wants hands at the vein.' : null,
              inflow ? 'Newcomers the town cannot absorb become the frontier.' : null,
              rec.site ? `The settlers chose ${place}, inside the town's own country.` : null,
              rec.resources && rec.resources.length
                ? `The ground offers ${rec.resources.map(resourcePhrase).join(', ')}.`
                : null,
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
            headline: pickLine(LIFECYCLE_NEWS.charter_pending.headline, `${parentId}:${next.id}:${tick}:h`, { name: next.name }),
            summary: pickLine(LIFECYCLE_NEWS.charter_pending.summary, `${parentId}:${next.id}:${tick}:s`, { name: next.name }),
            significance: 'notable', severity: 0.35,
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
            headline: pickLine(LIFECYCLE_NEWS.abandoned.headline, `${parentId}:${next.id}:${tick}:h`, { name: next.name }),
            summary: pickLine(LIFECYCLE_NEWS.abandoned.summary, `${parentId}:${next.id}:${tick}:s`, { name: next.name, parent: String(parentLive?.name || parentId) }),
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
            headline: pickLine(LIFECYCLE_NEWS.coalesced.headline, `${parentId}:${a.name}:${b.name}:${tick}:h`, { a: a.name, b: b.name }),
            summary: pickLine(LIFECYCLE_NEWS.coalesced.summary, `${parentId}:${a.name}:${b.name}:${tick}:s`, { a: a.name, b: b.name, pop: folded.population }),
            severity: 0.3, significance: 'notable',
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
  // The demographic step's own write counts as change even when the satellite lane
  // held still, or applyPulseMover would drop its settlementUpdates on the floor.
  let changed = cloned || demo.changed;
  if (ledgerChanged) {
    nextWorldState = Object.keys(nextLedger).length
      ? setSpatialLedger(nextWorldState, 'satellites', nextLedger)
      : dropSpatialLedger(nextWorldState, 'satellites');
    changed = true;
  }

  return { worldState: nextWorldState, settlementUpdates: nextUpdates, changed, newsEntries, receipts };
}

// ════════════════════════════════════════════════════════════════════════════
// STAGE 3 — THE FORCE VERBS (registrable SHAPE; NOT manifest-registered — the
// W-COMPOSER-2 lift, the forceCalamityStrike/forceCalamityEntry precedent).
// Every verb resolves through the SAME kernel paths the organic lanes use
// (force ≡ organic, pinned): mintSteading / buildTerminalDeathOutcome /
// buildResettleOutcome and the ONE writer.
// ════════════════════════════════════════════════════════════════════════════

/**
 * FORCE_FOUND_STEADING — found a satellite steading by DM decree, through the
 * ONE shared mint (tier cap + parent-floor headroom stand — the walls hold even
 * under force; a refusal is returned, never silently swallowed). The caller (a
 * future manifest-registered handler) applies the returned parent debit and
 * folds the record into spatialLedgers.satellites[parentId].steadings.
 * @param {Object} args
 * @param {LcSettlement|undefined} args.parent @param {string} args.parentId
 * @param {SatelliteRecord[]} args.sats existing steadings of this parent
 * @param {number} args.tick
 * @param {(k: string) => { random: () => number }} args.forkFn
 * @param {string|null} [args.name]        freetext name (cosmetic dial)
 * @param {string|null} [args.resourceKey] optional resource assignment
 * @param {import('./steadingTopography.js').TopoDigest|null} [args.digest] the FROZEN
 *   rasters, READ-ONLY (W-E) — threaded so a DECREED founding samples the same
 *   ground an organic one would (force ≡ organic, extended to topography)
 * @returns {{ record: SatelliteRecord, debit: number, receipt: Record<string, unknown> } | { refusal: string }}
 */
export function forceFoundSteading({ parent, parentId, sats, tick, forkFn, name = null, resourceKey = null, digest = null }) {
  const fork = forkFn(`satellite:${parentId}:${tick}`);
  const siteFork = digest ? forkFn(`satellite:${parentId}:${tick}:site`) : null;
  const minted = mintSteading({
    parent, parentId, sats, tick, draw: () => fork.random(),
    nameOverride: name, resourceKey, provenance: 'forced',
    digest, siteDraw: siteFork ? () => siteFork.random() : null,
  });
  if ('refusal' in minted) return minted;
  return {
    ...minted,
    receipt: {
      id: parentId, kind: 'satellite_founded', forced: true,
      satId: minted.record.id, name: minted.record.name, founders: minted.debit,
      provenance: 'forced', ...(minted.record.resourceKey ? { resourceKey: minted.record.resourceKey } : {}),
      ...(minted.record.site ? { site: minted.record.site } : {}),
      ...(minted.record.resources ? { resources: minted.record.resources } : {}),
      orbit: minted.record.orbit,
    },
  };
}

// ── The affordance-manifest ENTRIES (registrable shape; NOT added to the
// AFFORDANCE_MANIFEST — that registration rides W-COMPOSER-2, with every other
// parked realm verb). Mirrors forceCalamityEntry's factory shape. Pure. ──
/** @returns {Record<string, unknown>} */
export function forceFoundSteadingEntry() {
  return Object.freeze({
    type: 'FORCE_FOUND_STEADING', family: 'Realm', scope: 'settlement', authority: 'dm_direct',
    targetsFrom: null, entityKind: 'settlement', coversVetoCodes: [],
    dials: [
      { key: 'name', kind: 'text', default: '', clampAtCommit: false, label: 'Steading name (optional)' },
      { key: 'resource', kind: 'text', default: '', clampAtCommit: false, label: 'Resource key (optional — the vein the camp exists for)' },
    ],
    // Town+ parents only; the cap + headroom walls hold under force (the verb refuses).
    predicate: () => ({ available: true, reasons: [], unlocks: [] }),
  });
}
