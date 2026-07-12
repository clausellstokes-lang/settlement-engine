/**
 * armyTransitKernel.js — the M5 ARMY-TRANSIT + FIELD COMBAT kernel adapter (Phase 5.5).
 *
 * The pure engine (spatial/armyTransit.js) owns the mechanics (position stepping, the
 * clamped field-battle sigmoid, collision detection, the courier umbilical, retreat
 * routing); THIS thin adapter supplies the LIVE reads and writes the outcomes back:
 *
 *   • DERIVE + ADVANCE: every committed deployment (the war layer's one-army ledger)
 *     is an army with a POSITION. A fresh campaign seeds a march record origin→target
 *     (planMarch over the frozen digest, the M1 danger re-score); an ongoing one
 *     advances its position. An army still EN ROUTE is a reinforcement/marching column
 *     (collision-eligible); once it lands it is besieging (at the walls).
 *   • COLLISIONS → FIELD BATTLES: every HOSTILE pair of in-transit armies whose
 *     remaining paths cross meets in the open (O(armies²), bounded — armies are FEW).
 *     The §5 clamped resolver decides it; BOUNDED attrition mauls the loser (never
 *     annihilates) and it RETREATS home by the danger re-score. The reduced strength
 *     writes back onto the deployment (a mauled army besieges weaker).
 *   • THE COURIER UMBILICAL: an army whose route home is CUT (its home besieged) grows
 *     belief-staleness — info-starved, it mis-assesses. INACTIVE (omniscient) ⇒ no fog.
 *
 * AGGREGATE, NAMED-NPC-SAFE (owner boundary): this moves strength/size NUMBERS only.
 * It reads no npc roster and returns no npc mutation — a commander is only ever FLAGGED
 * at-risk (a DM hook), never removed.
 *
 * DORMANT (constitutional): a no-op without the spatial-canon marker (armyTransitActive
 * false) — an aspatial world keeps the war layer's exact path (byte-identical), no
 * `armyTransit` ledger key. The ledger nests under the FP-R `spatialLedgers` namespace
 * ⇒ ZERO eager first-paint bytes. Pure + deterministic; the caller threads the tick +
 * the pulse rng (the battle fork).
 */

import {
  armyTransitActive, armyTransitLedger, armyRecordOf, stepArmyPosition, hasArrived,
  planMarch, detectCollisions, assertArmyBound, resolveFieldBattle,
  stepBeliefStaleness, ARMY_ROLES,
} from '../spatial/armyTransit.js';
import { setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { beliefsActive } from './beliefMap.js';
import { warFrontsInto } from './warFrontReads.js';
import { formatCount } from '../formatNumber.js';

/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('../spatial/armyTransit.js').ArmyTransitRecord} ArmyTransitRecord */
/** @typedef {{ targetId?: string|number, sinceTick?: number, currentEffectiveStrength?: number,
 *   readiness?: number, supplyIntegrity?: number, deployedQuality?: number }} DeploymentRecord */
/** @typedef {{ id?: string|number, name?: string, settlement?: { name?: string },
 *   causal?: { scores?: { economic_capacity?: number } } }} SnapItem */
/** @typedef {{ settlements?: SnapItem[], byId?: { get?: (id: string) => SnapItem | undefined } }} Snapshot */
/** @typedef {{ channels?: Array<{ type?: string, status?: string, from?: string|number, to?: string|number }> }} Graph */
/** @typedef {{ fork?: (key: string) => { random: () => number } }} Rng */

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }

/**
 * The 0..1 economic funding backing an army, from the origin's economic_capacity
 * score. Neutral 0.5 when unknown.
 * @param {Snapshot} snapshot @param {string} originId @returns {number}
 */
function fundingOf(snapshot, originId) {
  const item = snapshot?.byId?.get?.(String(originId));
  const score = item?.causal?.scores?.economic_capacity;
  return Number.isFinite(score) ? clamp01(Number(score) / 100) : 0.5;
}

/** The display name for an id. @param {Snapshot} snapshot @param {string} id @returns {string} */
function nameOf(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.name || item?.settlement?.name || String(id);
}

/**
 * Build the collision hostility predicate. TWO in-transit armies are hostile
 * combatants when each is marching against the OTHER's home (A.dest === B.origin OR
 * B.dest === A.origin) — the two-power border war whose columns cross. (Richer
 * factional hostility is M9.) Co-besiegers of the SAME target are ALLIES (never a
 * self-battle). @param {Record<string, ArmyTransitRecord>} records
 * @returns {(aId: string, bId: string) => boolean}
 */
function hostilePairFor(records) {
  return (/** @type {string} */ aId, /** @type {string} */ bId) => {
    if (aId === bId) return false;
    const a = records[aId];
    const b = records[bId];
    if (!a || !b) return false;
    return a.destId === b.originId || b.destId === a.originId;
  };
}

/**
 * The effective-strength inputs for a transit record at a field battle: fatigue rises
 * with march progress; ground advantage falls with it (an army early in its march is
 * near home ground). @param {ArmyTransitRecord} rec
 * @returns {{ armyId: string, size: number, readiness: number, supplyQuality: number, funding: number, groundAdvantage01: number, fatigue01: number }}
 */
function battleInputs(rec) {
  return {
    armyId: rec.armyId,
    size: rec.strength,
    readiness: rec.readiness,
    supplyQuality: rec.supplyQuality,
    funding: rec.funding,
    groundAdvantage01: clamp01(1 - rec.position01),
    fatigue01: rec.position01,
  };
}

/**
 * A field-battle wizard-news entry (house voice, AGGREGATE — no npc named as a
 * casualty). Deterministic id from the sorted pair + tick.
 * @param {{ winnerId: string, loserId: string, region: string }} battle
 * @param {Snapshot} snapshot @param {number} tick @param {string|null} now
 * @param {number} loserBefore @param {number} loserAfter
 * @returns {Record<string, unknown>}
 */
function fieldBattleNews(battle, snapshot, tick, now, loserBefore, loserAfter) {
  const winner = nameOf(snapshot, battle.winnerId);
  const loser = nameOf(snapshot, battle.loserId);
  const lost = Math.max(0, Math.round(loserBefore - loserAfter));
  const pair = [battle.winnerId, battle.loserId].sort();
  return {
    id: `wizard_news.${tick}.field_battle.${pair[0]}.${pair[1]}`,
    tick,
    scope: 'regional',
    significance: 'notable',
    score: 62,
    headline: `${winner}'s army breaks ${loser}'s in the field`,
    summary: `The marching hosts of ${winner} and ${loser} met between settlements. ${winner} held the field; ${loser}'s column falls back mauled${lost > 0 ? ` (${formatCount(lost)} strength lost)` : ''} to regroup.`,
    kind: 'applied',
    impactKind: 'field_battle',
    channelType: null,
    severity: 0.55,
    settlementIds: [battle.winnerId, battle.loserId],
    impactIds: [],
    channelIds: [],
    sourceEventId: `field_battle.${pair[0]}.${pair[1]}.${tick}`,
    tags: ['world_pulse', 'war', 'field_battle'],
    reasons: [`A crossing-path collision in ${nameOf(snapshot, battle.region)}'s approaches.`],
    createdAt: now,
  };
}

/**
 * Advance the army-transit layer one tick: derive/advance transit records from the
 * live deployments, resolve crossing-path field battles (bounded), advance the courier
 * umbilical, persist the ledger, and write mauled strengths back onto the deployments.
 * DORMANT (no marker) ⇒ { worldState, changed:false, newsEntries:[] } — byte-identical.
 *
 * @param {Object} args
 * @param {Snapshot} args.snapshot
 * @param {Record<string, unknown> & { spatialCanonVersion?: unknown, deployments?: Record<string, DeploymentRecord>, spatialLedgers?: unknown }} args.worldState
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {Graph|null|undefined} args.graph
 * @param {Rng|null|undefined} args.rng
 * @param {string|null} [args.season]
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, newsEntries: Array<Record<string, unknown>> }}
 */
export function advanceArmyTransit({ snapshot, worldState, digest, graph, rng, season = null, tick, now = null }) {
  if (!armyTransitActive(worldState) || !digest) {
    return { worldState, changed: false, newsEntries: [] };
  }
  const nowTick = Math.max(0, Math.floor(num(tick, 0)));
  const deployments = /** @type {Record<string, DeploymentRecord>} */ (worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const prior = armyTransitLedger(worldState) || {};
  const umbilicalActive = beliefsActive(worldState);

  // ── DERIVE + ADVANCE: one transit record per committed deployment (army). ──────
  /** @type {Record<string, ArmyTransitRecord>} */
  const records = {};
  for (const armyId of Object.keys(deployments).sort()) {
    const dep = deployments[armyId];
    const targetId = dep && dep.targetId != null ? String(dep.targetId) : '';
    if (!targetId) continue;
    const priorRec = prior[armyId] || null;
    const readiness = clamp01(num(dep.readiness, 0.5));
    const strength = Math.max(0, num(dep.currentEffectiveStrength, 0));
    const supplyQuality = clamp01(num(dep.supplyIntegrity, num(dep.deployedQuality, 1)));
    const funding = fundingOf(snapshot, armyId);
    // A NEW campaign (no prior record, or the prior aimed elsewhere) seeds a march.
    if (!priorRec || priorRec.destId !== targetId || priorRec.originId !== String(armyId)) {
      const plan = planMarch(digest, worldState, armyId, targetId, readiness, null, num(dep.sinceTick, nowTick), season);
      if (!plan) continue; // unreachable/unmapped — no transit (the aspatial war layer still runs)
      const seeded = armyRecordOf({
        armyId, role: ARMY_ROLES.MARCH, originId: String(armyId), destId: targetId,
        path: plan.path, departTick: plan.departTick, arrivalTick: plan.arrivalTick,
        position01: 0, strength, readiness, supplyQuality, funding,
        beliefStaleness: 0, lastTick: nowTick,
      });
      if (seeded) records[armyId] = stepArmyPosition(seeded, nowTick);
      continue;
    }
    // ONGOING: advance the position, refresh the live strength/quality/funding, and
    // re-role a still-marching column as a reinforcement (it rides the SAME ledger).
    const advanced = stepArmyPosition({ ...priorRec, strength, readiness, supplyQuality, funding }, nowTick);
    const arrived = hasArrived(advanced, nowTick);
    records[armyId] = { ...advanced, role: arrived ? ARMY_ROLES.MARCH : ARMY_ROLES.REINFORCEMENT };
  }

  // ── COURIER UMBILICAL: staleness grows while the route home is cut (home besieged).
  for (const armyId of Object.keys(records)) {
    const rec = records[armyId];
    const routeCut = warFrontsInto(graph || {}, rec.originId).length > 0;
    records[armyId] = { ...rec, beliefStaleness: stepBeliefStaleness(rec.beliefStaleness, routeCut, umbilicalActive) };
  }

  // ── COLLISIONS → FIELD BATTLES (O(armies²), bounded). Armies are FEW (one per
  // settlement, the belief-envelope 5–30); past the design bound (assertArmyBound) the
  // O(n²) scan is SKIPPED rather than run (the ledger still persists, positions
  // advanced) — a graceful degrade, never a blow-up. ────────────────────────────────
  const armyCount = Object.keys(records).length;
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  const collisions = assertArmyBound(armyCount) ? detectCollisions(records, hostilePairFor(records)) : [];
  /** @type {Record<string, number>} */
  const mauled = {}; // armyId → new strength (write-back to deployments)
  for (const col of collisions) {
    const a = records[col.aId];
    const b = records[col.bId];
    if (!a || !b) continue;
    // The umbilical fog degrades each army's READ of the OTHER's strength (an
    // info-starved army mis-assesses), but the TRUE strengths resolve the battle —
    // the mis-assessment is the DM-legible cause, the physics are real.
    const result = resolveFieldBattle({ a: battleInputs(a), b: battleInputs(b), rng, tick: nowTick });
    const loserBefore = result.loserId === a.armyId ? a.strength : b.strength;
    const loserAfter = result.strengthDelta[result.loserId];
    // Persist the mauled strengths onto the transit records AND queue the write-back.
    for (const id of [result.winnerId, result.loserId]) {
      const ns = result.strengthDelta[id];
      if (records[id] && Number.isFinite(ns)) {
        records[id] = { ...records[id], strength: ns };
        mauled[id] = ns;
      }
    }
    newsEntries.push(fieldBattleNews({ winnerId: result.winnerId, loserId: result.loserId, region: col.region }, snapshot, nowTick, now, loserBefore, loserAfter));
  }

  // ── PERSIST. Drop the whole ledger when no army is afield (sparse → byte-safe). ─
  const nextOrNull = Object.keys(records).length ? records : null;
  const changedLedger = JSON.stringify(prior && Object.keys(prior).length ? prior : null) !== JSON.stringify(nextOrNull);
  let nextWorldState = worldState;
  if (changedLedger) {
    nextWorldState = nextOrNull
      ? setSpatialLedger(worldState, 'armyTransit', nextOrNull)
      : dropSpatialLedger(worldState, 'armyTransit');
  }
  // Write mauled strengths back onto the deployments (a battered army besieges weaker).
  if (Object.keys(mauled).length) {
    /** @type {Record<string, DeploymentRecord>} */
    const nextDeployments = { ...deployments };
    for (const id of Object.keys(mauled)) {
      if (nextDeployments[id]) nextDeployments[id] = { ...nextDeployments[id], currentEffectiveStrength: mauled[id] };
    }
    nextWorldState = { ...nextWorldState, deployments: nextDeployments };
  }
  const changed = changedLedger || Object.keys(mauled).length > 0;
  return { worldState: nextWorldState, changed, newsEntries };
}
