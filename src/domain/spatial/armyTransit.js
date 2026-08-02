/**
 * armyTransit.js — Phase 5.5 mover wave M5: ARMY-TRANSIT + FIELD COMBAT.
 *
 * The war convergence (design §5). Armies stop TELEPORTING to their sieges: they
 * gain a POSITION ALONG A PATH. A committed army marches its route origin→target
 * over travel weeks (hopWeeks × army speed, readiness/terrain modulating the pace);
 * a defeated one RETREATS by the M1 danger re-score; a reinforcement rides the SAME
 * transit ledger (an army-in-transit to a siege IS a reinforcement column). When two
 * HOSTILE armies on crossing paths meet BETWEEN settlements it is a FIELD BATTLE,
 * NOT a siege — resolved by the §5 BOUNDED weighted resolver:
 *
 *   win probability = a SIGMOID over the effective-strength ratio (readiness ×
 *   supplyQuality × size × funding × defender's-ground × travel-fatigue), CLAMPED so
 *   P(upset) collapses to ZERO past a threshold — the owner's "no hand of miracle":
 *   a CLAMP_RATIO-to-one force does not lose to a lucky roll. The roll forks a stable
 *   composite key `battle:${[a,b].sort().join(':')}:${tick}`.
 *
 * THE COURIER UMBILICAL (round 12). A deployed army receives a directed information
 * stream from HOME (couriers/reinforcements/stopped caravans). When its route home is
 * CUT its BELIEF goes STALE — it mis-assesses enemy strength and its own siege, and
 * blinding the enemy's couriers becomes a real tactic. This is a READ of the Wave-A
 * belief machinery, gated the SAME way (spatial marker + infoMode ≠ omniscient): an
 * OMNISCIENT world has NO umbilical staleness (the army always knows the truth).
 *
 * NAMED-CHARACTER BOUNDARY (owner, BINDING): armies are AGGREGATE units — strength /
 * size NUMBERS. NO named NPC is ever killed by a battle; a battle moves counts, never
 * a roster. A commander may be FLAGGED at-risk (a DM hook), never removed. This module
 * holds no npc ids, reads no roster, returns no npc mutation.
 *
 * BRAKES (the anti-runaway): the sigmoid CLAMP (no hand of miracle) + BOUNDED
 * attrition (a loser retreats mauled, never annihilated — rescuable, not wiped) + the
 * exhaustion homeostasis already built into the war layer (a border war ENDS by
 * exhaustion → withdrawal/peace, never forever-war).
 *
 * DORMANCY (constitutional): the transit ledger materializes ONLY under the
 * spatialCanonVersion marker AND only while an army is actually afield (sparse). Off
 * the marker every pass is a no-op and no `armyTransit` key is ever written — the
 * aspatial war layer (warDeployment.js) stays BYTE-IDENTICAL.
 *
 * PURE + LAZY: no Date, no Math.random, no mutation, no tier/auth. A spatial leaf (the
 * lazy engine chunk) — zero first-paint bytes; the ledger nests under the FP-R
 * `spatialLedgers` namespace (setSpatialLedger), so this new mover ledger costs ZERO
 * eager bytes. The seeded PRNG (battle rolls) forks a stable composite key at the call
 * site.
 */

import { candidateRoutes, hopWeeks, hasSpatialLedger, getSpatialLedger } from './distanceRead.js';
import { chooseRoute, riskToleranceFromAlignment } from './embattlement.js';

// ── Tuning (documented here; retuned in the M5 + checkpoint soaks) ─────────────
export const ARMY_TRANSIT_TUNING = Object.freeze({
  // ARMY SPEED. An army marches SLOWER than a courier/caravan: baggage, foraging,
  // formation. weeks = ceil(hopWeeks × ARMY_SPEED_FACTOR / speedMult(readiness)),
  // bounded ≥ 1 and ≤ MAX_MARCH_WEEKS. A drilled (high-readiness) army moves a
  // little faster/steadier; a rusty levy dawdles.
  ARMY_SPEED_FACTOR: 1.5,
  READINESS_SPEED_GAIN: 0.4,   // speedMult = 1 + READINESS_SPEED_GAIN·(readiness-0.5)·2 ∈ [1-g, 1+g]
  MAX_MARCH_WEEKS: 52,

  // FIELD-BATTLE SIGMOID. P(A wins) = logistic(FIELD_K · (ratio − 0.5)) where
  // ratio = effA/(effA+effB). FIELD_K is calibrated so the curve is already ≥ ~0.95
  // by the time the CLAMP threshold bites (a small, deliberate jump to the hard 1).
  FIELD_K: 12,
  // THE CLAMP — "no hand of miracle." Past a CLAMP_RATIO-to-one effective-strength
  // edge the weaker side's win probability is EXACTLY 0 (P(upset) → 0). A 3:1 force
  // never loses to a lucky number.
  CLAMP_RATIO: 3,

  // TRAVEL FATIGUE. An army deep in a march fights TIRED. fatigue = FATIGUE_MAX ·
  // position01 (fraction of the route covered); the effective-strength term is
  // (1 − fatigue). Bounded so even an exhausted column keeps most of its bite.
  FATIGUE_MAX: 0.3,
  // DEFENDER'S GROUND. An army fighting on/near its OWN territory (position near its
  // origin, or defending home) gets a bounded multiplier ≥ 1. In the open field
  // between two marching armies neither has it (both read 1).
  GROUND_ADVANTAGE: 0.25, // up to +25% for an army on its home ground

  // BOUNDED BATTLE ATTRITION. The LOSER bleeds up to LOSER_MAX_LOSS of its strength
  // (retreats mauled, never annihilated — a floor survives to route home); the WINNER
  // pays a smaller price. Deterministic given the roll margin. "Rescuable, not wiped."
  LOSER_MAX_LOSS: 0.45,
  LOSER_MIN_LOSS: 0.15,
  WINNER_MAX_LOSS: 0.18,
  WINNER_MIN_LOSS: 0.03,

  // COLLISION. Two hostile armies collide when they share a common region in their
  // REMAINING path and their transit windows overlap. Codepoint-sorted pairs; the
  // O(armies²) scan is bounded by MAX_ARMIES (armies are FEW — one per settlement,
  // the belief-envelope 5–30 settlements). assertArmyBound pins it.
  MAX_ARMIES: 128,

  // COURIER UMBILICAL. Staleness (ticks since the last home contact) grows by 1 per
  // tick the route home is CUT and RESETS to 0 the moment it reconnects. A read
  // drifts from truth toward the neutral/stale value as staleness climbs, saturating
  // at UMBILICAL_STALE_SATURATION ticks (full fog). Bounded — an info-starved army
  // mis-assesses, it does not hallucinate.
  UMBILICAL_STALE_SATURATION: 8,
  UMBILICAL_MAX_DRIFT: 0.6, // at saturation a read is blended 60% toward the stale/neutral value
});

// The transit ROLE — a march to a siege, a reinforcement column riding the same
// ledger, or a retreat home. Exported so a caller/test can assert the enum.
// W-NAVY (design §2/§4): CONVOY (an army carried over water) + BLOCKADE (a navy holding
// a port's sea approaches) extend the enum. They ride the SIBLING `navalTransit` ledger —
// the armyTransit kernel never writes them — so the extension is byte-identical for the
// land layer while the role-coercion fix below preserves them (extends, does not silently
// coerce a convoy to 'march').
export const ARMY_ROLES = Object.freeze({
  MARCH: 'march', REINFORCEMENT: 'reinforcement', RETREAT: 'retreat',
  CONVOY: 'convoy', BLOCKADE: 'blockade',
});

// The KNOWN role set (the role-coercion allow-list). An unrecognized role coerces to
// MARCH; a recognized one (including the W-NAVY naval roles) passes through unchanged.
const KNOWN_ROLES = new Set(/** @type {string[]} */ (Object.values(ARMY_ROLES)));

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** The standard logistic. @param {number} x @returns {number} */
function logistic(x) {
  return 1 / (1 + Math.exp(-x));
}

// ── The activation gate (dormancy / byte-identity seam) ───────────────────────
/**
 * Army transit is LIVE iff the spatial-canon marker is present. Like
 * embattlement/supply/migration it is a PHYSICAL layer (NOT info-mode gated — an
 * omniscient spatial world still marches its armies; only the COURIER UMBILICAL
 * fog is info-mode gated, below). Absent ⇒ every pass is a no-op and no
 * `armyTransit` key is ever materialized (byte-exact).
 * @param {{ spatialCanonVersion?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function armyTransitActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const marker = worldState.spatialCanonVersion;
  return Number.isInteger(marker) && Number(marker) > 0;
}

// ── Army speed / travel weeks ─────────────────────────────────────────────────
/**
 * The march time (integer weeks) for an army covering a base courier hop-time. An
 * army is slower than a courier (ARMY_SPEED_FACTOR) and a drilled army marches a
 * little faster than a rusty levy (READINESS_SPEED_GAIN). Floored ≥ 1, capped at
 * MAX_MARCH_WEEKS. Pure.
 * @param {number} baseHopWeeks the courier/caravan hopWeeks over the route (≥ 0)
 * @param {number} [readiness01] the army's 0..1 martial readiness (0.5 neutral)
 * @returns {number} integer march weeks in [1, MAX_MARCH_WEEKS] (0 for a zero base)
 */
export function armyMarchWeeks(baseHopWeeks, readiness01 = 0.5) {
  const T = ARMY_TRANSIT_TUNING;
  const base = Math.max(0, finiteNumber(baseHopWeeks, 0));
  if (base <= 0) return 0;
  const rdy = clamp01(finiteNumber(readiness01, 0.5));
  const speedMult = 1 + T.READINESS_SPEED_GAIN * (rdy - 0.5) * 2; // ∈ [1-g, 1+g]
  const weeks = Math.ceil((base * T.ARMY_SPEED_FACTOR) / Math.max(0.1, speedMult));
  return Math.min(T.MAX_MARCH_WEEKS, Math.max(1, weeks));
}

// ── The transit record + position stepping ────────────────────────────────────
/**
 * @typedef {Object} ArmyTransitRecord
 * @property {string} armyId        the owning settlement id (one army per settlement)
 * @property {string} role          'march' | 'reinforcement' | 'retreat'
 * @property {string} originId      where the march started (home for march/reinforce)
 * @property {string} destId        the target (siege target; home for a retreat)
 * @property {string[]} path        the settlement-id route origin→…→dest
 * @property {number} departTick    the tick the column left
 * @property {number} arrivalTick   the tick it lands (departTick + armyMarchWeeks)
 * @property {number} position01    0..1 fraction of the route covered (arrival = 1)
 * @property {number} strength      current AGGREGATE effective strength (a number)
 * @property {number} readiness     0..1 martial readiness
 * @property {number} supplyQuality 0..1 kit/provisioning quality
 * @property {number} funding       0..1 economic backing of the army
 * @property {number} beliefStaleness ticks since last home contact (courier umbilical)
 * @property {number} lastTick      the tick this record last advanced
 */

/** @param {unknown} rec @returns {ArmyTransitRecord|null} */
export function armyRecordOf(rec) {
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return null;
  const r = /** @type {Record<string, unknown>} */ (rec);
  const path = Array.isArray(r.path) ? r.path.map(String) : [];
  const role = String(r.role ?? ARMY_ROLES.MARCH);
  return {
    armyId: String(r.armyId ?? ''),
    // The role-coercion fix (W-NAVY §2): a KNOWN role passes through; anything unknown
    // coerces to MARCH. Extended for CONVOY/BLOCKADE so a naval record's role survives
    // instead of silently degrading to 'march' (the recon's named trap).
    role: KNOWN_ROLES.has(role) ? role : ARMY_ROLES.MARCH,
    originId: String(r.originId ?? ''),
    destId: String(r.destId ?? ''),
    path,
    departTick: Math.max(0, Math.floor(finiteNumber(r.departTick, 0))),
    arrivalTick: Math.max(0, Math.floor(finiteNumber(r.arrivalTick, 0))),
    position01: clamp01(finiteNumber(r.position01, 0)),
    strength: Math.max(0, finiteNumber(r.strength, 0)),
    readiness: clamp01(finiteNumber(r.readiness, 0.5)),
    supplyQuality: clamp01(finiteNumber(r.supplyQuality, 1)),
    funding: clamp01(finiteNumber(r.funding, 0.5)),
    beliefStaleness: Math.max(0, Math.floor(finiteNumber(r.beliefStaleness, 0))),
    lastTick: Math.max(0, Math.floor(finiteNumber(r.lastTick, 0))),
  };
}

/**
 * Advance one transit record's POSITION to the current tick. position01 is the
 * fraction of the march time elapsed (linear in weeks). Arrived ⇒ 1. Pure.
 * @param {ArmyTransitRecord} record
 * @param {number} now the current tick
 * @returns {ArmyTransitRecord}
 */
export function stepArmyPosition(record, now) {
  const t = Math.max(0, Math.floor(finiteNumber(now, 0)));
  const depart = record.departTick;
  const arrive = record.arrivalTick;
  const span = arrive - depart;
  const position01 = span <= 0 ? 1 : clamp01((t - depart) / span);
  return { ...record, position01: round4(position01), lastTick: t };
}

/** Has the column reached its destination? @param {ArmyTransitRecord} record @param {number} now */
export function hasArrived(record, now) {
  return Math.max(0, Math.floor(finiteNumber(now, 0))) >= record.arrivalTick;
}

/** The region an in-transit army currently occupies: the node at its position along
 *  the path (rounded to the nearest hop). @param {ArmyTransitRecord} record @returns {string} */
export function currentRegion(record) {
  const path = record.path;
  if (!path.length) return record.destId || record.originId || '';
  const idx = Math.min(path.length - 1, Math.round(record.position01 * (path.length - 1)));
  return path[idx];
}

/** The set of NOT-YET-PASSED regions on a column's remaining path (from its current
 *  index to the destination), for collision detection. @param {ArmyTransitRecord} record */
export function remainingRegions(record) {
  const path = record.path;
  if (!path.length) return new Set([record.destId]);
  const idx = Math.min(path.length - 1, Math.round(record.position01 * (path.length - 1)));
  return new Set(path.slice(idx).map(String));
}

// ── FIELD-BATTLE effective strength + the clamped sigmoid ──────────────────────
/**
 * The AGGREGATE effective strength of an army in a field engagement (design §5):
 * size × readiness × supplyQuality × funding × defender's-ground × travel-fatigue.
 * All modulators are bounded multipliers; the result is ≥ 0. Pure — no npc, no roll.
 * @param {Object} args
 * @param {number} args.size         the raw strength/headcount (a number ≥ 0)
 * @param {number} [args.readiness]  0..1
 * @param {number} [args.supplyQuality] 0..1
 * @param {number} [args.funding]    0..1
 * @param {number} [args.groundAdvantage01] 0..1 (1 = fully on home ground → +GROUND_ADVANTAGE)
 * @param {number} [args.fatigue01]  0..1 travel fatigue (1 = worst) → (1 − FATIGUE_MAX·fatigue)
 * @returns {number}
 */
export function effectiveFieldStrength({ size, readiness = 0.5, supplyQuality = 1, funding = 0.5, groundAdvantage01 = 0, fatigue01 = 0 }) {
  const T = ARMY_TRANSIT_TUNING;
  const s = Math.max(0, finiteNumber(size, 0));
  const rdy = clamp01(finiteNumber(readiness, 0.5));
  const sup = clamp01(finiteNumber(supplyQuality, 1));
  const fund = clamp01(finiteNumber(funding, 0.5));
  const ground = 1 + T.GROUND_ADVANTAGE * clamp01(finiteNumber(groundAdvantage01, 0));
  const fatigue = 1 - T.FATIGUE_MAX * clamp01(finiteNumber(fatigue01, 0));
  // readiness/supply/funding enter as (0.5 + 0.5·x) so a mid army is ~1× and the
  // terms scale it in [0.5×, 1×] — a degraded army fights weaker, never at zero.
  const mult = (0.5 + 0.5 * rdy) * (0.5 + 0.5 * sup) * (0.5 + 0.5 * fund) * ground * fatigue;
  return s * mult;
}

/**
 * P(A wins) for a field battle between effective strengths effA/effB — a SIGMOID over
 * the strength share, CLAMPED so P(upset) is EXACTLY 0 past a CLAMP_RATIO edge (the
 * no-hand-of-miracle law). Monotonic non-decreasing in effA. Pure; no roll.
 *   • effA ≥ CLAMP_RATIO·effB ⇒ 1   (A can't lose)
 *   • effB ≥ CLAMP_RATIO·effA ⇒ 0   (A can't win)
 *   • otherwise ⇒ logistic(FIELD_K·(share − 0.5))
 * @param {number} effA @param {number} effB @returns {number} in [0, 1]
 */
export function fieldBattleWinProbability(effA, effB) {
  const T = ARMY_TRANSIT_TUNING;
  const a = Math.max(0, finiteNumber(effA, 0));
  const b = Math.max(0, finiteNumber(effB, 0));
  if (a <= 0 && b <= 0) return 0.5;
  // The hard clamp FIRST (no miracle): a decisive edge is deterministic.
  if (a >= T.CLAMP_RATIO * b) return 1;
  if (b >= T.CLAMP_RATIO * a) return 0;
  const share = a / (a + b);
  return clamp01(logistic(T.FIELD_K * (share - 0.5)));
}

/**
 * @typedef {Object} FieldBattleResult
 * @property {string} winnerId
 * @property {string} loserId
 * @property {number} pWin       P(the recorded winner would win) at the roll
 * @property {number} roll       the seeded roll ∈ [0,1)
 * @property {number} effA @property {number} effB
 * @property {Record<string, number>} strengthDelta  armyId → NEW strength (aggregate)
 * @property {boolean} clamped   true when the edge was ≥ CLAMP_RATIO (deterministic)
 */

/**
 * Resolve a field battle between two armies (AGGREGATE counts only — NO npc). The
 * roll forks the stable composite key `battle:${[a,b].sort().join(':')}:${tick}`.
 * BOUNDED attrition: the loser bleeds up to LOSER_MAX_LOSS (retreats mauled, never
 * annihilated — a floor survives to route home); the winner pays a smaller price.
 * @param {Object} args
 * @param {{ armyId: string, size: number, readiness?: number, supplyQuality?: number, funding?: number, groundAdvantage01?: number, fatigue01?: number }} args.a
 * @param {{ armyId: string, size: number, readiness?: number, supplyQuality?: number, funding?: number, groundAdvantage01?: number, fatigue01?: number }} args.b
 * @param {{ fork?: (key: string) => { random: () => number } } | null | undefined} args.rng
 * @param {number} args.tick
 * @returns {FieldBattleResult}
 */
export function resolveFieldBattle({ a, b, rng, tick }) {
  const T = ARMY_TRANSIT_TUNING;
  const effA = effectiveFieldStrength(a);
  const effB = effectiveFieldStrength(b);
  const pA = fieldBattleWinProbability(effA, effB);
  const ida = String(a.armyId);
  const idb = String(b.armyId);
  const forkKey = `battle:${[ida, idb].sort()[0]}:${[ida, idb].sort()[1]}:${Math.max(0, Math.floor(finiteNumber(tick, 0)))}`;
  const fork = rng && typeof rng.fork === 'function' ? rng.fork(forkKey) : null;
  const roll = fork ? clamp01(fork.random()) : 1 - pA; // no rng ⇒ deterministic favourite
  const aWins = roll < pA;
  const clamped = pA === 0 || pA === 1;
  const winner = aWins ? a : b;
  const loser = aWins ? b : a;
  const pWin = aWins ? pA : 1 - pA;
  // Attrition scales with how DECISIVE the engagement was: a rout (pWin→1) costs the
  // winner little and guts the loser toward the max; a near-run thing costs both more
  // evenly. margin ∈ [0,1] (0 = coin flip, 1 = certainty).
  const margin = clamp01(Math.abs(pWin - 0.5) * 2);
  const loserLoss = T.LOSER_MIN_LOSS + (T.LOSER_MAX_LOSS - T.LOSER_MIN_LOSS) * margin;
  const winnerLoss = T.WINNER_MAX_LOSS - (T.WINNER_MAX_LOSS - T.WINNER_MIN_LOSS) * margin;
  const winnerId = String(winner.armyId);
  const loserId = String(loser.armyId);
  /** @type {Record<string, number>} */
  const strengthDelta = {
    [winnerId]: round4(Math.max(0, finiteNumber(winner.size, 0)) * (1 - clamp01(winnerLoss))),
    [loserId]: round4(Math.max(0, finiteNumber(loser.size, 0)) * (1 - clamp01(loserLoss))),
  };
  return { winnerId, loserId, pWin: round4(pWin), roll: round4(roll), effA: round4(effA), effB: round4(effB), strengthDelta, clamped };
}

// ── Collision detection (O(armies²), bounded) ─────────────────────────────────
/**
 * Assert the army count is within the O(armies²) bound (armies are FEW). Returns
 * true when count ≤ MAX_ARMIES; a test pins it. A world past the bound is a design
 * error (one army per settlement, the belief-envelope 5–30 settlements).
 * @param {number} count @returns {boolean}
 */
export function assertArmyBound(count) {
  return Math.max(0, Math.floor(finiteNumber(count, 0))) <= ARMY_TRANSIT_TUNING.MAX_ARMIES;
}

/**
 * @typedef {Object} ArmyCollision
 * @property {string} aId @property {string} bId
 * @property {string} region  the shared remaining region where they meet
 */

/**
 * Detect crossing-path collisions among in-transit armies: every HOSTILE pair whose
 * REMAINING paths share a region collides there. O(armies²) over the codepoint-sorted
 * army ids (bounded by MAX_ARMIES — armies are few). Deterministic: pairs are emitted
 * (aId < bId) codepoint-ordered; the shared region is the codepoint-first common one.
 * `hostilePair(aId, bId)` is the caller's allegiance predicate (an army never battles
 * a friendly one, nor itself).
 * @param {Record<string, ArmyTransitRecord>} records
 * @param {(aId: string, bId: string) => boolean} hostilePair
 * @returns {ArmyCollision[]}
 */
export function detectCollisions(records, hostilePair) {
  const ids = Object.keys(asObject(records)).sort();
  /** @type {ArmyCollision[]} */
  const out = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const aId = ids[i];
      const bId = ids[j];
      if (typeof hostilePair === 'function' && !hostilePair(aId, bId)) continue;
      const a = armyRecordOf(records[aId]);
      const b = armyRecordOf(records[bId]);
      if (!a || !b) continue;
      // Both must still be afield (not yet landed) to meet in the open.
      if (a.position01 >= 1 || b.position01 >= 1) continue;
      const ra = remainingRegions(a);
      const rb = remainingRegions(b);
      let shared = null;
      for (const region of [...ra].sort()) {
        if (rb.has(region)) { shared = region; break; }
      }
      if (shared != null) out.push({ aId, bId, region: shared });
    }
  }
  return out;
}

// ── Retreat routing (per-mover embattlement, the §6 danger re-score) ──────────
/**
 * A retreating/defeated army routes HOME by the M1 danger re-score (design §5/§6):
 * a longer SAFER road may beat a cheaper DANGEROUS one, weighted by the army's own
 * risk tolerance (the W0 alignment read). Delegates to embattlement.chooseRoute over
 * the frozen digest (never re-pathfound). Returns null when home is unreachable.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string|number} fromId @param {string|number} homeId
 * @param {{ lawfulness01?: number } | null | undefined} alignment
 * @param {string|null} [season]
 * @returns {import('./embattlement.js').ScoredRoute | null}
 */
export function retreatRoute(digest, worldState, fromId, homeId, alignment, season = null) {
  const riskTolerance = riskToleranceFromAlignment(alignment);
  return chooseRoute(digest, worldState, fromId, homeId, riskTolerance, season);
}

// ── The courier umbilical (round 12 — belief-staleness fog) ───────────────────
/**
 * Step an army's courier-umbilical staleness. Grows by 1 each tick the route home is
 * CUT; RESETS to 0 the moment it reconnects. When the umbilical is INACTIVE (an
 * omniscient world, or the marker absent) staleness is pinned to 0 — an omniscient
 * army always knows the truth (no fog). Pure.
 * @param {number} priorStaleness ticks since last contact
 * @param {boolean} routeCut is the route home severed this tick?
 * @param {boolean} umbilicalActive marker present AND infoMode ≠ omniscient
 * @returns {number}
 */
export function stepBeliefStaleness(priorStaleness, routeCut, umbilicalActive) {
  if (!umbilicalActive) return 0;
  const prior = Math.max(0, Math.floor(finiteNumber(priorStaleness, 0)));
  return routeCut ? prior + 1 : 0;
}

/**
 * The 0..1 FOG a given staleness produces: 0 (fresh) → UMBILICAL_MAX_DRIFT (saturated).
 * An info-starved army's reads drift this far toward the stale/neutral value. Bounded.
 * @param {number} staleness ticks since last contact
 * @returns {number}
 */
export function umbilicalFog(staleness) {
  const T = ARMY_TRANSIT_TUNING;
  const n = Math.max(0, Math.floor(finiteNumber(staleness, 0)));
  const frac = clamp01(n / Math.max(1, T.UMBILICAL_STALE_SATURATION));
  return round4(T.UMBILICAL_MAX_DRIFT * frac);
}

/**
 * Blend a TRUE reading toward a STALE/NEUTRAL one by the umbilical fog: an
 * info-starved army mis-assesses (its strength/siege reads degrade toward the stale
 * value it last heard, or the neutral mid when it has nothing). fog 0 ⇒ the truth
 * verbatim (an omniscient / connected army reads true, byte-exact). Pure.
 * @param {number} truthValue @param {number} staleValue @param {number} staleness
 * @returns {number}
 */
export function staleAssessment(truthValue, staleValue, staleness) {
  const truth = finiteNumber(truthValue, 0);
  const stale = finiteNumber(staleValue, truth);
  const fog = umbilicalFog(staleness);
  if (fog <= 0) return truth;
  return round4(truth * (1 - fog) + stale * fog);
}

// ── The ledger read (dormant-safe) ────────────────────────────────────────────
/**
 * The live army-transit ledger, or null when absent/dormant. The one read consumers
 * use. @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {Record<string, ArmyTransitRecord> | null}
 */
export function armyTransitLedger(worldState) {
  if (!hasSpatialLedger(worldState, 'armyTransit')) return null;
  const raw = asObject(getSpatialLedger(worldState, 'armyTransit'));
  /** @type {Record<string, ArmyTransitRecord>} */
  const out = {};
  for (const id of Object.keys(raw)) {
    const rec = armyRecordOf(raw[id]);
    if (rec) out[id] = rec;
  }
  return Object.keys(out).length ? out : null;
}

// ── THE SIEGE ARRIVAL GATE (the war-layer join) ───────────────────────────────
/**
 * Is an army AT THE WALLS of the target it was committed against? The aspatial war
 * layer (warDeployment.js) reads THIS — never a second position model — so a column
 * still ON THE ROAD does not besiege. An army in transit is marching, not investing a
 * town; gating the siege on arrival is what turns the march time this module already
 * computes into a real cost of DISTANCE.
 *
 * Returns a PREDICATE (armyId, targetId) => boolean, built ONCE per war-layer pass
 * over the live ledger. It is DELIBERATELY PERMISSIVE wherever the transit layer is
 * silent, which is what keeps the dark path byte-identical:
 *   - NO ledger (no spatial canon, no digest, or every pair unreachable so planMarch
 *     returned null) => ALWAYS true => the war layer besieges exactly as it does
 *     today, and no `armyTransit` key is ever consulted;
 *   - a record aimed ELSEWHERE (destId is not this target - e.g. a stale war_front
 *     left by a former besieger) => true, so the stale-front retirement path in the
 *     siege loop is untouched;
 *   - a record aimed HERE => true only once `hasArrived` at the current tick.
 *
 * TERMINATION (load-bearing): a march is bounded by MAX_MARCH_WEEKS and departTick /
 * arrivalTick are frozen when the record is seeded, so arrival is guaranteed within
 * that many ticks. MAX_MARCH_WEEKS is strictly BELOW the war layer's SIEGE_MAX_AGE
 * ceiling (a cross-module invariant the war tests pin), so a long march can never
 * starve the siege of the ticks it needs to hit that ceiling. Pure.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {number} now the current tick
 * @returns {(armyId: string|number, targetId: string|number) => boolean}
 */
export function siegeArrivalGate(worldState, now) {
  const ledger = armyTransitLedger(worldState);
  if (!ledger) return () => true;
  const t = Math.max(0, Math.floor(finiteNumber(now, 0)));
  return (armyId, targetId) => {
    const rec = ledger[String(armyId)];
    if (!rec || rec.destId !== String(targetId)) return true;
    return hasArrived(rec, t);
  };
}

// ── The march-route builder (frozen-digest candidate; never re-pathfound) ─────
/**
 * The route + march time an army takes from origin to dest. Uses the M1 danger
 * re-score (chooseRoute) so a marching army also prefers the safe road; falls back
 * to the shortest cached candidate. Returns null when unreachable/unmapped.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string|number} originId @param {string|number} destId
 * @param {number} readiness01
 * @param {{ lawfulness01?: number } | null | undefined} alignment
 * @param {number} departTick
 * @param {string|null} [season]
 * @returns {{ path: string[], departTick: number, arrivalTick: number, marchWeeks: number } | null}
 */
export function planMarch(digest, worldState, originId, destId, readiness01, alignment, departTick, season = null) {
  const scored = chooseRoute(digest, worldState, originId, destId, riskToleranceFromAlignment(alignment), season);
  let path;
  if (scored && Array.isArray(scored.path) && scored.path.length) {
    path = scored.path.map(String);
  } else {
    const cands = candidateRoutes(digest, originId, destId, 1);
    if (!cands.length) return null;
    path = cands[0].path.map(String);
  }
  const base = hopWeeks(digest, originId, destId, season);
  if (base == null) return null;
  const marchWeeks = armyMarchWeeks(base, readiness01);
  const depart = Math.max(0, Math.floor(finiteNumber(departTick, 0)));
  return { path, departTick: depart, arrivalTick: depart + marchWeeks, marchWeeks };
}
