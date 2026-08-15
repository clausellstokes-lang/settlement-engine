/**
 * domain/worldPulse/warArmyRecord.js — THE ARMY RECORD, AND WHAT A STORMED TOWN LOSES.
 *
 * THE DECOMPOSITION WAVE (war tranche, ruling R-BLD-4). The lifecycle of ONE stateful
 * deployment record at its two creation points — `seedDeploymentState` when an army
 * first marches, `ensureStatefulRecord` when a legacy/hand-seeded LIGHT record meets
 * the engine and must be enriched forward — plus `computeSackTransfer`, the conserved
 * arithmetic core of a sack.
 *
 * WHY THE SACK LIVES HERE. It is the other side of the same ledger: the record is what
 * an army IS, and the sack is what it TAKES. Both are pure arithmetic over a settlement
 * and a capacity envelope; neither mints an outcome, and neither can — this module
 * builds records and returns numbers. `captured <= sacked` ALWAYS, so the transfer can
 * never mint people; the shortfall is the war dead.
 *
 * DETERMINISM. The only draw is the W-C1 deployment-SIZING fork, and it is conditional:
 * rust 0 (a seasoned realm, or any world with no martial record) forks NO rng at all, so
 * every pre-W-C1 world seeds byte-identically.
 */

import { clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { fidelityFactor } from './fidelityNoise.js';
import { effectiveStatMult } from './martialReadiness.js';

/**
 * @typedef {import('./pulseShapes.js').DeploymentRecord} DeploymentRecord
 * @typedef {import('./pulseShapes.js').CapacityEnvelope} CapacityEnvelope
 */

// ── STATEFUL ARMY tunables. A deployment now carries an effective strength
// that the siege verdict reads (so a DEPLETED army can FAIL against a weaker
// target). The siege contest uses the army's `currentEffectiveStrength` in PLACE of
// the freshly-recomputed coalition capacity once the army is stateful, scaled back
// onto the 0..100 capacity axis. A fresh deploy seeds the record at the model's
// current capacity (full token); thereafter attrition/reinforcement move it.

// ── SACK & FORAGE (P3, flag warForageEnabled). A stormed town is pillaged: a fraction of
// its population is carried off — some pressed into service and marched to the victor's
// home (spoils), the rest killed or scattered. CONSERVED as a two-delta transfer with a
// SINK: the conquered loses SACK_POP_FRACTION of its people; FORAGE_CAPTURE_FRACTION of
// THAT reaches the victor's home, and the remainder is the war dead (never minted). The
// floor spares a skeleton population so a sack never annihilates a settlement outright.
const SACK_POP_FRACTION = 0.08;      // ~8% of the conquered population is carried off
const FORAGE_CAPTURE_FRACTION = 0.5; // half of the sacked reach the victor; half are the dead
const SACK_POP_FLOOR = 150;          // never sack a town below this skeleton population

/**
 * The pure conserved-arithmetic core of a sack: how many of a conquered town's people are
 * carried off, and how many of those reach the victor's home. Returns null when the town is
 * at/under the skeleton floor (nothing to take). `captured ≤ sacked` always ⇒ the transfer
 * never mints (the shortfall is the war dead).
 * @param {any} targetPop
 * @returns {{ sacked: number, captured: number } | null}
 */
export function computeSackTransfer(targetPop) {
  const pop = Math.max(0, Math.round(Number(targetPop) || 0));
  const room = Math.max(0, pop - SACK_POP_FLOOR);
  const sacked = Math.min(Math.round(pop * SACK_POP_FRACTION), room);
  if (sacked <= 0) return null;
  const captured = Math.round(sacked * FORAGE_CAPTURE_FRACTION);
  return { sacked, captured };
}

/**
 * SEED a STATEFUL deployment record from the origin's military-capacity model at
 * deploy time. The army marches out at the origin's current OFFENSIVE capacity (its
 * `maxStartStrength` and `currentEffectiveStrength`), with supporting facets derived
 * from the model facets (supply/morale/equipment/magic) normalized to 0..1. The
 * record is what attrition degrades and reinforcement replenishes; the siege verdict
 * reads `currentEffectiveStrength` (so a depleted army can fail). `logisticsBurden`
 * (distance/route-security to the target) damps reinforcement.
 *
 * @param {Object} args
 * @param {string} args.targetId
 * @param {CapacityEnvelope} args.cap   the origin capacity envelope.
 * @param {number} args.tick
 * @param {number} args.logisticsBurden  0..1 distance/route burden to the target.
 * @param {string} [args.role]
 * @param {number} [args.readiness]  0..1 martial readiness (W-F8) — lifts effective strength + stamps the record; 0 ⇒ byte-identical.
 * @param {{ rng: { fork?: (key: string) => { random: () => number } }|null, cid: string, rust: number }|null} [args.sizing]  W-C1 item 1a: the per-decision SIZING rust fork (over/under-commit). null / rust 0 ⇒ factor 1 (no rng) ⇒ byte-identical.
 * @param {number} [args.qualityMult]  W-C1 item 3: FLOORED deployed-quality (supply-gap) multiplier; 1 ⇒ byte-identical.
 * @returns {DeploymentRecord} the enriched deployment record.
 */
export function seedDeploymentState({ targetId, cap, tick, logisticsBurden, role = 'siege', readiness = 0, sizing = null, qualityMult = 1 }) {
  const facets = cap.facets || {};
  const norm = (/** @type {any} */ v, /** @type {number} */ fallback) =>
    Number.isFinite(v) ? clamp01(v / 100) : fallback;
  // W-F8: readiness lifts effective strength (drilled levies, maintained arms, supply that
  // reaches the front) — efficiency via the existing capacity math; 1× at readiness 0.
  const rdy = clamp01(readiness);
  // W-C1 item 1a — DEPLOYMENT SIZING RUST: a rusty realm mis-sizes the force it commits
  // (over/under-commit). The error is a SEEDED per-decision fork scaled by rustMagnitude
  // (chaosPull 0 here — sizing is the rust axis) so it caps at RUST_MAX_ERROR geometry.
  // rust 0 (seasoned / no martial record) ⇒ factor 1, NO rng forked ⇒ byte-identical.
  const sizingFactor = sizing && sizing.rng && sizing.rust > 0
    ? fidelityFactor({ rng: sizing.rng, site: 'deployment_sizing', tick, cid: String(sizing.cid), decisionKey: `commit:${stablePart(targetId)}`, chaosPull: 0, rust: sizing.rust })
    : 1;
  // W-C1 item 3 — SUPPLY-GAP QUALITY: a supply-starved war economy fields a degraded force.
  // Scales the committed strength AND (below) the equipment/supply facets that mitigate
  // attrition. 1 (flag off / full self-supply) ⇒ byte-identical.
  const qMult = Number.isFinite(qualityMult) && qualityMult > 0 ? qualityMult : 1;
  const start = Math.max(0, Number(cap.offensive) || 0) * (rdy > 0 ? effectiveStatMult(rdy) : 1) * sizingFactor * qMult;
  return {
    targetId,
    sinceTick: tick,
    role,
    // ── stateful strength ─────────────────────────────────────────────────────
    maxStartStrength: start,
    currentEffectiveStrength: start,
    accumulatedAttrition: 0,
    // W-F8 readiness stamp (the attrition kernel reads it for slower decay). Conditional
    // — a home with no martial record stamps nothing ⇒ byte-identical deployment ledger.
    ...(rdy > 0 ? { readiness: rdy } : {}),
    // W-C1 receipts: stamp the sizing bias / deployed quality ONLY when non-trivial so a
    // no-rust / flag-off / full-supply deployment carries neither (byte-identical ledger).
    ...(sizingFactor !== 1 ? { sizingBias: sizingFactor } : {}),
    ...(qMult !== 1 ? { deployedQuality: qMult } : {}),
    reinforcementFlow: 0,
    deploymentAge: 0,
    // ── supporting facets (0..1) — seeded from the model, eroded by attrition,
    // lifted by reinforcement. manpower/institutions feed morale; logistics feeds
    // supply + food; materiel feeds equipment; will/materiel feed magic support. ─
    manpower: norm(facets.manpower, 0.5),
    // W-C1 item 3: poor war-supply degrades the kit that mitigates attrition — a badly
    // equipped/provisioned force bleeds faster. qMult 1 ⇒ the pre-W-C1 facets, byte-identical.
    supplyIntegrity: clamp01(norm(facets.logistics, 0.5) * qMult),
    morale: clamp01((norm(facets.will, 0.5) + norm(facets.manpower, 0.5)) / 2),
    equipmentCondition: clamp01(norm(facets.materiel, 0.5) * qMult),
    magicSupport: norm(facets.materiel, 0.5),
    commandQuality: norm(facets.institutions, 0.5),
    foodReserve: norm(facets.logistics, 0.5),
    // ── logistics / objective / return ────────────────────────────────────────
    logisticsBurden: clamp01(logisticsBurden),
    objective: role === 'siege' ? 'conquest' : role,
    returnCondition: 'pending',
  };
}

/**
 * MIGRATE a LIGHT deployment record forward to a STATEFUL one. A legacy campaign
 * (or a hand-seeded fixture) carries only `{ targetId, sinceTick, role }`
 * with no strength fields. On first contact this enriches it in place from the live
 * capacity model so attrition has something to deplete. Deterministic; never mutates
 * input.
 *
 * @param {DeploymentRecord} record
 * @param {CapacityEnvelope} cap   the origin capacity envelope.
 * @param {number} tick
 * @param {number} logisticsBurden
 * @returns {DeploymentRecord}
 */
export function ensureStatefulRecord(record, cap, tick, logisticsBurden, readiness = 0, qualityMult = 1) {
  const r = record || {};
  const rdy = clamp01(readiness);
  if (Number.isFinite(r.maxStartStrength) && Number.isFinite(r.currentEffectiveStrength)) {
    // Already stateful — keep the live strength, only backfill an absent burden/age.
    // W-F8: refresh the readiness stamp so an ongoing siege tracks the home's evolving
    // militarization. Conditional — 0 keeps whatever the record already carried (or
    // nothing), so a pre-W-F8 / deity-free record stays byte-identical.
    return {
      ...r,
      logisticsBurden: Number.isFinite(r.logisticsBurden) ? r.logisticsBurden : clamp01(logisticsBurden),
      deploymentAge: Number.isFinite(r.deploymentAge) ? r.deploymentAge : Math.max(0, tick - (Number(r.sinceTick) || tick)),
      ...(rdy > 0 ? { readiness: rdy } : (Number.isFinite(r.readiness) ? { readiness: r.readiness } : {})),
    };
  }
  const seeded = seedDeploymentState({
    targetId: String(r.targetId),
    cap,
    tick,
    logisticsBurden,
    role: r.role || 'siege',
    readiness: rdy,
    // W-C1 item 3: quality applies to a light-record MIGRATION too (the army's kit is read
    // on first materialization). NO sizing rust here — the sizing DECISION is at the
    // new-deploy site, not a migration. qualityMult 1 (flag off) ⇒ byte-identical.
    qualityMult,
  });
  // Preserve the original sinceTick so deploymentAge reflects the true campaign length.
  const sinceTick = Number.isFinite(r.sinceTick) ? r.sinceTick : tick;
  return { ...r, ...seeded, sinceTick, deploymentAge: Math.max(0, tick - sinceTick) };
}
