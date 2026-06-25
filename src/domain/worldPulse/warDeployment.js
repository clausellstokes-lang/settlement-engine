/**
 * domain/worldPulse/warDeployment.js — the war & deployment core.
 *
 * A settlement fields EXACTLY ONE army (`worldState.deployments[saveId]`). It may
 * deploy that army to besiege a target it is hostile toward IF it is confident in
 * its military. Multiple besiegers converging on one target form a COALITION siege
 * (one big siege, many `war_front` channels). Sustaining a siege drains the home
 * economy (the `war_drain` condition → `economic_capacity`, the homeostasis SOURCE)
 * and thins the home garrison (`army_deployed` → `defense_readiness`). A besieged
 * target can FALL — a conquest power-transfer (cause:'conquest'). When a siege
 * resolves the besiegers' armies return home → contextual outcomes (deploymentReturn).
 *
 * DETERMINISM CONTRACT (sacred):
 *   - No Date.now / Math.random / argless new Date. The pulse threads `now` and an
 *     injected `rng`; every roll forks on a STABLE key (`rng.fork('siege:'+T+':'+tick)`,
 *     `rng.fork('deploy:'+S+':'+tick)`), never a list-order stream.
 *   - Every iteration that feeds output is over a CODEPOINT-SORTED key list — never a
 *     Map/Set/Object insertion order.
 *   - All cross-settlement reads come from the SINGLE pre-tick snapshot. `war_drain`
 *     severity is derived from the PRE-TICK channel count (NOT this-tick's fresh mints)
 *     to avoid intra-tick read-after-write — a fresh deploy raises drain only NEXT tick.
 *
 * GATED + byte-identical when OFF: when `rules.warLayerEnabled` is false this is a
 * pure no-op returning the world's existing deployments untouched.
 */

import {
  settlementStrength,
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
} from './relationshipEvolution.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { mintDirectedChannel, hasWarLayerEvidence } from '../region/graph.js';
import { logistic, clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { deriveMilitaryCapacity } from './militaryStrength.js';
import { classifyFeasibility, verdictPermitsSiege, verdictAllowsHarassment } from './feasibilityGate.js';
import { isWarReady } from './mobilization.js';
import { applyAttritionToRecord, fortificationStrength } from './attrition.js';
import { computeReinforcement, applyReinforcementToRecord } from './reinforcement.js';

// ── Tunables (calibration is load-bearing — see GEOPOLITICAL_WAR_LAYER §2.4/§6) ──
// HOSTILE_CONFIDENCE gates whether a settlement is strong enough to open a war at
// all (the relationship-confidence input). CONQUEST_MARGIN keeps a deploy from
// firing on a coin-flip strength edge. The capacity-scale siege math
// (SIEGE_CAPACITY_K / SIEGE_CAPACITY_HOLD_BIAS, defined below) sits behind the hard
// feasibility gate — the old strength-scale SIEGE_K/HOLD_BIAS are
// retired (the siege verdict now reads the 0..100 military-capacity model, not the
// 0..1 settlementStrength).
const HOSTILE_CONFIDENCE = 0.42;
const CONQUEST_MARGIN = 0.12;
const WAR_DRAIN_PER_FRONT = 0.34; // severity per active war_front from the home (capped 1)
const ARMY_DEPLOYED_SEVERITY = 0.5;

// ── War-exhaustion SCAR tunables (the homeostasis closer) ────────────────────────
// The scar is a worldState ledger (warExhaustion[homeId] → 0..1) ratcheted up while a
// deployment is sustained and decayed only SLOWLY when the war ends — so a long war
// leaves a lasting economic wound that keeps pushing the realm toward suing for peace,
// UNLIKE a relationship (which mean-reverts ~12%/tick). The scar is surfaced as a
// war_exhaustion condition (economic_capacity sink + a direct settlementStrength
// penalty), which is what flips a stubborn aggressor's confidence below the gate.
const EXHAUSTION_ACCRUE_PER_TICK = 0.16; // ratchet up per tick of sustained deployment
const EXHAUSTION_DECAY_PER_TICK = 0.03;  // decay when the army is HOME — ~5× slower (non-reverting)
// Above one tick of accrual (0.16) on purpose: the scar is about SUSTAINED war, so a
// single deploy tick stamps only war_drain/army_deployed; the war_exhaustion condition
// first registers on the SECOND tick of an unbroken campaign and deepens from there.
const EXHAUSTION_CONDITION_FLOOR = 0.20;

// ── War-specific MILITARY CAPACITY tunables. The deploy/siege math reads the
// structured `deriveMilitaryCapacity` model as the WAR strength source, NOT the
// coarse settlementStrength (which stays the relationship-dynamics confidence input).
// `theoreticalCapacity` is latent; `currentCapacity` is the live fighting strength —
// theoretical MINUS war_exhaustion/war_drain (the model already subtracts those)
// MINUS the army-deployed-away penalty (subtracted HERE: a settlement with its army
// committed abroad fights home battles at reduced strength). The siege contest uses
// CURRENT capacity. Capacities are 0..100; the logistic slope is calibrated for that
// scale.
const ARMY_DEPLOYED_CAPACITY_PENALTY = 14; // home-defense points lost while the army is abroad
// Siege verdict on the 0..100 capacity scale. K is the log-odds slope per capacity
// point; HOLD_BIAS is the home-ground defender advantage. Calibrated so a MUTUAL /
// near-even siege HOLDS most ticks (pFall ≈ 0.3 — wars take a few ticks, the scar
// accrues, the homeostasis arc runs) while a clear-favourite (a ~18-point offensive
// edge) resolves quickly (pFall ≈ 0.5+). The feasibility gate has ALREADY filtered
// out the implausible matchups, so this slope only ever governs a genuine contest.
const SIEGE_CAPACITY_K = 0.16;
const SIEGE_CAPACITY_HOLD_BIAS = 3;

// Harassment (a feasibility verdict below the siege band): a weak attacker that
// cannot storm the town still RAIDS — a low-severity war_pressure on the target, NOT
// a siege. This is what the hard-gate's `harassment` / solo-`require_coalition`
// verdicts resolve to instead of going to RNG.
const HARASSMENT_SEVERITY = 0.22;

const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

// ── STATEFUL ARMY tunables. A deployment now carries an effective strength
// that the siege verdict reads (so a DEPLETED army can FAIL against a weaker
// target). The siege contest uses the army's `currentEffectiveStrength` in PLACE of
// the freshly-recomputed coalition capacity once the army is stateful, scaled back
// onto the 0..100 capacity axis. A fresh deploy seeds the record at the model's
// current capacity (full token); thereafter attrition/reinforcement move it.
//
// reinforcement_cost SEVERITY rides the computed origin-drain (reinforcement.js).
const REINFORCEMENT_COST_FLOOR = 0.0; // the module already floors; this is a documentation anchor.
// The deploymentAge-scaled war_drain bump: a long deployment deepens the home bleed
// even on top of the front-count drain (the proposal's "even a winning war keeps
// draining the origin", and "the longer deployed, the more it strains the origin").
const AGE_DRAIN_PER_TICK = 0.02;
const AGE_DRAIN_CAP = 0.35;

// ── HARD SIEGE-DURATION CEILING (the absolute homeostasis backstop). ──────────────
// The exhaustion/withdrawal arc normally ends a war: a stalled siege drops out of the
// plausible band (capacity collapses under the scar) and the besieger withdraws. But a
// `plausible` siege whose roll never lands a fall and whose attacker exhaustion has
// already SATURATED at 1.0 (so the scar can ratchet no further) has no remaining force
// pushing it out of the plausible band — it can grind INDEFINITELY. This ceiling is the
// deterministic floor under that: once a single siege has run SIEGE_MAX_AGE ticks
// (deploymentAge, incremented once per tick), it auto-resolves. The direction is a PURE
// function of the contested capacities (NO rng, seed/identity-stable): if the besieging
// coalition still holds a current-capacity edge the town finally FALLS; otherwise the
// exhausted besiegers LIFT the siege and withdraw. Either way the siege cannot outlive
// the ceiling, so a saturated stalemate terminates instead of running forever.
export const SIEGE_MAX_AGE = 60;

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * True if a war_front's provenance is a RELATIONSHIP-LABEL bundle (a 'relationship_label'
 * evidence source, minted by graph.js relationshipChannelBundle §hostile) and it carries
 * NO war-layer ownership tag. channelIdFor keys only (type, from, to), so a hostile
 * relationship and a war-layer siege collide on the SAME war_front id; war-layer evidence
 * is the STICKY ownership tag (addRegionalChannels carries it forward across label
 * collisions, syncRelationshipChannelBundle de-aliases on it). A front that is
 * relationship-tagged WITHOUT a war-layer tag is therefore a pure hostility front, not a
 * mobilized siege. (A war-layer front that has ALSO accreted a relationship_label row
 * still reads as war-layer-owned via hasWarLayerEvidence, so it is NOT a phantom.)
 * @param {any} channel
 * @returns {boolean}
 */
function isRelationshipMintedFront(channel) {
  const evidence = channel?.evidence;
  return Array.isArray(evidence)
    && evidence.some(item => item?.source === 'relationship_label')
    && !hasWarLayerEvidence(evidence);
}

/**
 * The READ-SIDE SIEGE GATE: a CONFIRMED war_front is a live siege UNLESS its provenance
 * is a pure hostile-RELATIONSHIP bundle (isRelationshipMintedFront). channelIdFor keys
 * only (type, from, to), so a hostile relationship (relationshipChannelBundle §hostile)
 * mints the SAME confirmed war_front shape as a mobilized siege — but it represents
 * mutual hostility, NOT an army at the walls. Reading it as a siege would emit phantom
 * war_pressure (harassment) / count toward war_drain with NO army, BYPASSING the
 * mobilization + feasibility gates the war layer enforces on a real deploy. So every
 * siege-DETECTION read filters relationship-minted fronts out; a war-layer front
 * (hasWarLayerEvidence) and a bare/light/legacy front are still read as sieges (the
 * latter is always backed by a deployment in the union below). (The retirement read
 * `warFrontChannelIds` is deliberately NOT gated: a resolving war-layer siege must drop
 * whatever channel exists at its from→to, relationship-aliased or not.)
 * @param {any} channel
 * @returns {boolean}
 */
function isLiveWarFront(channel) {
  return channel?.type === 'war_front'
    && channel.status === 'confirmed'
    && !isRelationshipMintedFront(channel);
}

/**
 * Active CONFIRMED WAR-LAYER war_front channels FROM a settlement, read from a graph
 * snapshot. Codepoint-sorted by `to` for deterministic iteration. Hostile-relationship
 * fronts (no war-layer provenance) are NOT counted — they are not sieges (isLiveWarFront).
 * @param {any} graph
 * @param {any} fromId
 * @returns {string[]}
 */
function warFrontsFrom(graph, fromId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (!isLiveWarFront(channel)) continue;
    if (String(channel.from) !== String(fromId)) continue;
    out.push(String(channel.to));
  }
  return out.sort(codepoint);
}

/**
 * Active CONFIRMED WAR-LAYER war_front channels INTO a settlement (besiegers),
 * codepoint-sorted. Hostile-relationship fronts (no war-layer provenance) are NOT read
 * as besiegers — they are not sieges (isLiveWarFront).
 * @param {any} graph
 * @param {any} toId
 * @returns {string[]}
 */
function warFrontsInto(graph, toId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (!isLiveWarFront(channel)) continue;
    if (String(channel.to) !== String(toId)) continue;
    out.push(String(channel.from));
  }
  return out.sort(codepoint);
}

/**
 * The channel IDs of CONFIRMED war_front channels FROM `fromId` TO `toId`, read straight
 * off the pre-tick graph (so the id matches whatever the graph actually carries — robust
 * against any id-format drift). Used to RETIRE a front when its siege resolves (conquest
 * or withdrawal): a resolved siege must drop its war_front channel(s) to 'dormant' so the
 * next tick does not re-discover the same besieger→target front and re-fire the conquest.
 * Codepoint-sorted for determinism.
 * @param {any} graph
 * @param {any} fromId
 * @param {any} toId
 * @returns {string[]}
 */
function warFrontChannelIds(graph, fromId, toId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (String(channel.from) !== String(fromId)) continue;
    if (String(channel.to) !== String(toId)) continue;
    if (channel.id != null) out.push(String(channel.id));
  }
  return out.sort(codepoint);
}

/**
 * Build a per-settlement strength lookup from the SINGLE pre-tick snapshot. The
 * pressure vector is the SAME one the relationship contests read (buildPressureSummary
 * over the derived pressure index), so a deploy-confidence gate and the subjugation
 * gate can never diverge. Returns `(id) => number` 0..1, defaulting to 0 for unknown.
 * @param {any} snapshot
 * @returns {(id: any) => number}
 */
function buildStrengthLookup(snapshot) {
  const pIndex = pressureIndex(deriveSettlementPressures(snapshot));
  const cache = new Map();
  return (/** @type {any} */ id) => {
    const key = String(id);
    if (cache.has(key)) return cache.get(key);
    const item = snapshot?.byId?.get?.(key);
    if (!item) {
      cache.set(key, 0);
      return 0;
    }
    const strength = settlementStrength(item, buildPressureSummary(pIndex, key));
    cache.set(key, strength);
    return strength;
  };
}

/**
 * Build a per-settlement MILITARY-CAPACITY lookup from the single pre-tick snapshot.
 * Returns `(id) => { theoretical, offensive, homeDefense, facets }`:
 *   - `theoretical`  — latent strength (the model's full capacity).
 *   - `offensive`    — the fighting strength a settlement PROJECTS (theoretical minus
 *                      war_exhaustion/war_drain — the model subtracts those). The army
 *                      committed to a siege IS the offensive force, so the army-away
 *                      penalty is NOT applied here.
 *   - `homeDefense`  — the strength defending HOME: `offensive` MINUS the army-away
 *                      penalty (an army abroad cannot man the home walls). This is the
 *                      DEFENDER side of a siege contest.
 * The siege contest reads the besieger's `offensive` (force at the walls) vs the
 * defender's `homeDefense` (force on the walls). Cached per id; zero envelope for an
 * unknown id.
 * @param {any} snapshot
 * @param {Record<string, any>} deployments  the live one-army ledger (army-away read).
 * @returns {(id: any) => { theoretical: number, offensive: number, homeDefense: number, facets: any }}
 */
function buildCapacityLookup(snapshot, deployments) {
  /** @type {Map<string, { theoretical: number, offensive: number, homeDefense: number, facets: any }>} */
  const cache = new Map();
  return (/** @type {any} */ id) => {
    const key = String(id);
    const hit = cache.get(key);
    if (hit) return hit;
    const item = snapshot?.byId?.get?.(key);
    if (!item) {
      const zero = { theoretical: 0, offensive: 0, homeDefense: 0, facets: {} };
      cache.set(key, zero);
      return zero;
    }
    const economicCapacityScore = item?.causal?.scores?.economic_capacity;
    const model = deriveMilitaryCapacity(item, {
      economicCapacityScore: Number.isFinite(economicCapacityScore) ? economicCapacityScore : undefined,
    });
    const offensive = Math.max(0, model.currentCapacity);
    // The home-defense reading subtracts the army-away penalty: a settlement whose
    // army is committed abroad defends its OWN walls at reduced strength.
    const armyAway = deployments && deployments[key]?.targetId ? ARMY_DEPLOYED_CAPACITY_PENALTY : 0;
    const homeDefense = Math.max(0, offensive - armyAway);
    const out = { theoretical: model.theoreticalCapacity, offensive, homeDefense, facets: model.facets };
    cache.set(key, out);
    return out;
  };
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
 * @param {{ offensive: number, facets: any }} args.cap   the origin capacity envelope.
 * @param {number} args.tick
 * @param {number} args.logisticsBurden  0..1 distance/route burden to the target.
 * @param {string} [args.role]
 * @returns {any} the enriched deployment record.
 */
function seedDeploymentState({ targetId, cap, tick, logisticsBurden, role = 'siege' }) {
  const facets = cap.facets || {};
  const norm = (/** @type {any} */ v, /** @type {number} */ fallback) =>
    Number.isFinite(v) ? clamp01(v / 100) : fallback;
  const start = Math.max(0, Number(cap.offensive) || 0);
  return {
    targetId,
    sinceTick: tick,
    role,
    // ── stateful strength ─────────────────────────────────────────────────────
    maxStartStrength: start,
    currentEffectiveStrength: start,
    accumulatedAttrition: 0,
    reinforcementFlow: 0,
    deploymentAge: 0,
    // ── supporting facets (0..1) — seeded from the model, eroded by attrition,
    // lifted by reinforcement. manpower/institutions feed morale; logistics feeds
    // supply + food; materiel feeds equipment; will/materiel feed magic support. ─
    manpower: norm(facets.manpower, 0.5),
    supplyIntegrity: norm(facets.logistics, 0.5),
    morale: clamp01((norm(facets.will, 0.5) + norm(facets.manpower, 0.5)) / 2),
    equipmentCondition: norm(facets.materiel, 0.5),
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
 * @param {any} record
 * @param {{ offensive: number, facets: any }} cap   the origin capacity envelope.
 * @param {number} tick
 * @param {number} logisticsBurden
 * @returns {any}
 */
function ensureStatefulRecord(record, cap, tick, logisticsBurden) {
  const r = record || {};
  if (Number.isFinite(r.maxStartStrength) && Number.isFinite(r.currentEffectiveStrength)) {
    // Already stateful — keep the live strength, only backfill an absent burden/age.
    return {
      ...r,
      logisticsBurden: Number.isFinite(r.logisticsBurden) ? r.logisticsBurden : clamp01(logisticsBurden),
      deploymentAge: Number.isFinite(r.deploymentAge) ? r.deploymentAge : Math.max(0, tick - (Number(r.sinceTick) || tick)),
    };
  }
  const seeded = seedDeploymentState({
    targetId: String(r.targetId),
    cap,
    tick,
    logisticsBurden,
    role: r.role || 'siege',
  });
  // Preserve the original sinceTick so deploymentAge reflects the true campaign length.
  const sinceTick = Number.isFinite(r.sinceTick) ? r.sinceTick : tick;
  return { ...seeded, sinceTick, deploymentAge: Math.max(0, tick - sinceTick) };
}

/**
 * The 0..1 ORIGIN ENVELOPE the reinforcement model reads: the home's economy /
 * manpower / materiel / food / trade / legitimacy, plus its war-exhaustion scar and
 * whether it is itself threatened (besieged/occupied ⇒ it cannot reinforce abroad).
 * Pure read of the pre-tick snapshot + the capacity facets.
 *
 * @param {any} snapshot
 * @param {any} graph
 * @param {(id:any)=>{ facets:any }} capacityFor
 * @param {Record<string, number>} warExhaustion
 * @param {string} id
 * @returns {{ economy:number, manpower:number, materiel:number, food:number, trade:number, legitimacy:number, warExhaustion:number, threatened:boolean }}
 */
function buildOriginEnvelope(snapshot, graph, capacityFor, warExhaustion, id) {
  const key = String(id);
  const item = snapshot?.byId?.get?.(key);
  const facets = capacityFor(key).facets || {};
  const n = (/** @type {any} */ v) => clamp01((Number(v) || 0) / 100);
  const legitScore = item?.settlement?.powerStructure?.publicLegitimacy?.score;
  const tradeScore = item?.causal?.scores?.trade_connectivity;
  return {
    economy: n(facets.economy),
    manpower: n(facets.manpower),
    materiel: n(facets.materiel),
    food: n(facets.logistics),
    trade: Number.isFinite(tradeScore) ? clamp01(tradeScore / 100) : 0.5,
    legitimacy: Number.isFinite(legitScore) ? clamp01(legitScore / 100) : 0.5,
    warExhaustion: clamp01(warExhaustion[key] || 0),
    threatened: isBesieged(graph, key),
  };
}

/**
 * Distance/route LOGISTICS BURDEN (0..1) between an origin and a target,
 * derived from the regional-graph edge (if any). A missing edge reads as a neutral
 * mid burden. Pure; deterministic. Today distance/route data is coarse, so this is a
 * conservative read of edge `distance`/`weight` with a neutral default — the
 * reinforcement model damps the flow ∝ this.
 *
 * @param {any} graph
 * @param {string} fromId
 * @param {string} targetId
 * @returns {number} 0 (short/secure) .. 1 (long/unsafe)
 */
function logisticsBurdenFor(graph, fromId, targetId) {
  for (const edge of graph?.edges || []) {
    const a = String(edge.from);
    const b = String(edge.to);
    if ((a === String(fromId) && b === String(targetId)) || (a === String(targetId) && b === String(fromId))) {
      const dist = Number(edge.distance);
      if (Number.isFinite(dist)) return clamp01(dist / 100);
      const weight = Number(edge.weight);
      // A high-weight (close/strong) edge → low burden; invert.
      if (Number.isFinite(weight)) return clamp01(1 - weight);
    }
  }
  return 0.4; // neutral default — a moderate supply line.
}

/**
 * A settlement is "besieged/occupied" if any CONFIRMED war_front points AT it. A
 * besieged settlement cannot itself open a new siege (its army defends home).
 * @param {any} graph
 * @param {any} id
 * @returns {boolean}
 */
function isBesieged(graph, id) {
  return warFrontsInto(graph, id).length > 0;
}

/**
 * Hostile targets of a settlement, read from the pre-tick relationshipStates +
 * edges. Returns codepoint-sorted target ids the settlement could besiege.
 * @param {any} snapshot
 * @param {any} fromId
 * @returns {string[]}
 */
function hostileTargetsOf(snapshot, fromId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const out = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    // The hostile axis is symmetric/adversarial only (hostile/cold_war/rival); a
    // vassal/patron hierarchy edge is never a besiege candidate.
    if (!HOSTILE_TYPES.has(relState.relationshipType)) continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a === String(fromId) && snapshot?.byId?.has?.(b)) out.add(b);
    else if (b === String(fromId) && snapshot?.byId?.has?.(a)) out.add(a);
  }
  return [...out].sort(codepoint);
}

/**
 * A condition outcome (the coup-verdict shape). Flows through
 * applyWorldPulseOutcomes UNCHANGED — it already applies `condition` via
 * withActiveCondition.
 * @param {{ id: any, archetype: any, targetSaveId: any, severity: any, headline: any, summary: any, reasons: any, tick: any, sourceEventTargetId: any, causes: any }} args
 */
function conditionOutcome({ id, archetype, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, causes }) {
  return {
    id,
    type: 'condition',
    candidateType: archetype,
    ruleId: `war_layer_${archetype}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity,
    headline,
    summary,
    reasons,
    condition: {
      archetype,
      severity,
      triggeredAt: { tick, sourceEventType: 'WAR_LAYER', sourceEventTargetId },
      causes,
    },
  };
}

/**
 * The siege verdict for a single target. FIRST a DETERMINISTIC FEASIBILITY GATE
 * classifies the coalition-vs-defender CURRENT-capacity matchup; only a `plausible`
 * (or a satisfied internal-collapse / war-magic override) matchup goes to RNG.
 * Everything else resolves DETERMINISTICALLY (auto_fail / harassment / require_coalition)
 * with NO roll — so a thorpe can never storm a fortified city on a lucky number, and
 * "RNG only resolves plausible conflicts" is itself reproducible.
 *
 * The stochastic roll (when reached) is log-odds over the CURRENT-capacity delta
 * (NEVER a raw product), forked on `siege:<T>:<tick>`.
 *
 * The coalition strength is the army's STATEFUL `currentEffectiveStrength` once
 * the deployment is stateful (the freshly-recomputed `cap.offensive` is the fallback
 * for a light record). THIS is the keystone: a worn-down army contests at
 * its DEPLETED strength, so it can FAIL against a target it once out-classed. The
 * stochastic roll also produces an OUTCOME BAND (narrow/decisive/costly) the caller
 * feeds into attrition.
 *
 * @param {{ targetId: any, besiegers: any[], capacityFor: (id: any) => { offensive: number, homeDefense: number, facets: any }, effectiveStrengthFor: (id:any)=>(number|null), defenderItem: any, rng: any, tick: any, siegeAge?: number }} args
 * @returns {{ falls: boolean, harass: boolean, forcedLift: boolean, verdict: string, ratio: number, pFall: number, roll: number, coalitionCurrent: number, defenderCurrent: number, band: string, reasons: string[] }}
 */
function resolveSiegeVerdict({ targetId, besiegers, capacityFor, effectiveStrengthFor, defenderItem, rng, tick, siegeAge = 0 }) {
  // Coalition strength sums member EFFECTIVE strengths (codepoint-sorted membership)
  // → order-independent: the army at the walls IS the offensive force, depleted by
  // attrition. Each besieger contributes its STATEFUL currentEffectiveStrength when it
  // has a record (the keystone — a worn army contests weaker), else its freshly-
  // recomputed offensive capacity (a light record). The attacker facets feed
  // the war-magic override; the STRONGEST besieger's facets (codepoint tie-break baked
  // into the besiegers order) are the coalition's materiel signal.
  let coalitionCurrent = 0;
  let bestFacets = {};
  let bestStrength = -Infinity;
  for (const id of besiegers) {
    const cap = capacityFor(id);
    const stateful = effectiveStrengthFor(id);
    const eff = Number.isFinite(stateful) ? /** @type {number} */ (stateful) : cap.offensive;
    coalitionCurrent += eff;
    if (eff > bestStrength) { bestStrength = eff; bestFacets = cap.facets; }
  }
  const defenderCap = capacityFor(targetId);
  // The defender contests with its HOME-DEFENSE capacity. A mutual-
  // siege defender's OWN expeditionary army is committed ABROAD — its attrition
  // degrades that field army (read on the OTHER target's verdict), NOT its home walls.
  // So a worn-down besieger does not also defend its own home weaker: the home garrison
  // and the field army are separate forces. The defender's field-army attrition is
  // applied below (it is the attacker on its own front).
  const defenderCurrent = defenderCap.homeDefense;

  // ── HARD FEASIBILITY GATE (deterministic, NO rng). ───────────────────────────────
  const { verdict, ratio, reasons } = classifyFeasibility({
    attackerCurrent: coalitionCurrent,
    defenderCurrent,
    coalitionSize: besiegers.length,
    defenderItem,
    attackerFacets: bestFacets,
    defenderFacets: defenderCap.facets,
  });

  if (!verdictPermitsSiege(verdict)) {
    // No roll. The siege either auto-fails outright or downgrades to harassment. The
    // attrition band: a harassment tick is a `hold` grind; an auto_fail is a
    // decisive repulse off the walls (the attacker bled trying the impossible).
    const band = verdictAllowsHarassment(verdict) ? 'hold' : 'decisive_fail';
    return {
      falls: false,
      harass: verdictAllowsHarassment(verdict),
      forcedLift: false,
      verdict,
      ratio,
      pFall: 0,
      roll: 0,
      coalitionCurrent,
      defenderCurrent,
      band,
      reasons,
    };
  }

  // ── HARD SIEGE-DURATION CEILING (deterministic, NO rng). A siege-permitting matchup
  // that has ground on for SIEGE_MAX_AGE ticks auto-resolves rather than grinding
  // forever — the backstop for a `plausible` siege whose roll never falls and whose
  // attacker exhaustion has saturated (so nothing else pushes it out of the band). The
  // direction is a pure function of the contested capacities: a coalition still holding
  // a current-capacity edge finally STORMS the walls; an exhausted one that no longer
  // out-classes the defender LIFTS the siege (forcedLift → the caller withdraws it). ──
  if (siegeAge >= SIEGE_MAX_AGE) {
    const falls = coalitionCurrent > defenderCurrent;
    return {
      falls,
      harass: false,
      forcedLift: !falls,
      verdict,
      ratio,
      pFall: falls ? 1 : 0,
      roll: 0,
      coalitionCurrent,
      defenderCurrent,
      band: falls ? 'costly_success' : 'withdrawal',
      reasons: [
        ...reasons,
        `Siege ran the hard ${SIEGE_MAX_AGE}-tick ceiling; auto-resolved ${falls ? 'as a storm' : 'as a withdrawal'} (capacity ${coalitionCurrent.toFixed(1)} vs ${defenderCurrent.toFixed(1)}).`,
      ],
    };
  }

  // ── PLAUSIBLE band (or a satisfied override) → the stochastic siege roll. ─────────
  const logOdds = SIEGE_CAPACITY_K * (coalitionCurrent - defenderCurrent) - SIEGE_CAPACITY_HOLD_BIAS;
  const pFall = clamp01(logistic(logOdds));
  const roll = rng.fork(`siege:${stablePart(targetId)}:${tick}`).random();
  const falls = roll < pFall;
  // ── OUTCOME BAND: how the engagement went, scaled by how DECISIVE the roll was
  // relative to its threshold. A fall that cleared the bar by a wide margin is a
  // narrow_success (clean storm); a squeaker is costly_success (pyrrhic). A hold that
  // came close to falling is a narrow_fail for the attacker (it nearly broke through);
  // a comfortable hold is a decisive_fail (thrown back). Deterministic — derived from
  // the same (pFall, roll) pair, so byte-stable + order-independent.
  let band;
  if (falls) {
    band = (pFall - roll) > 0.18 ? 'narrow_success' : 'costly_success';
  } else {
    band = (roll - pFall) < 0.18 ? 'narrow_fail' : 'decisive_fail';
  }
  return {
    falls,
    harass: false,
    forcedLift: false,
    verdict,
    ratio,
    pFall,
    roll,
    coalitionCurrent,
    defenderCurrent,
    band,
    reasons,
  };
}

/**
 * Pick the conquering settlement: the strongest besieger by EFFECTIVE strength
 * (the stateful currentEffectiveStrength when present, else offensive capacity),
 * codepoint tie-break. The strongest SURVIVING army holds the walls.
 * @param {any[]} besiegers
 * @param {(id: any) => { offensive: number }} capacityFor
 * @param {(id: any) => (number|null)} effectiveStrengthFor
 */
function pickOccupier(besiegers, capacityFor, effectiveStrengthFor) {
  let best = null;
  let bestStrength = -Infinity;
  for (const id of besiegers) {
    const stateful = effectiveStrengthFor(id);
    const s = Number.isFinite(stateful) ? /** @type {number} */ (stateful) : capacityFor(id).offensive;
    if (s > bestStrength || (s === bestStrength && (best == null || id < best))) {
      best = id;
      bestStrength = s;
    }
  }
  return best;
}

/**
 * Evaluate the war layer for one tick.
 *
 * @param {Object} args
 * @param {any} args.snapshot       the SINGLE pre-tick world snapshot (byId carries
 *                                  settlement + causal + save; regionalGraph is pre-tick)
 * @param {any} args.worldState
 * @param {{ random: () => number, fork: (label:string) => any }} args.rng
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @param {{ warLayerEnabled?: boolean }} args.rules
 * @returns {{ outcomes: any[], deployments: Record<string, any>, graphChannels: any[], retiredChannels: string[], resolvedDeployments: any[], dispositionDeltas: Array<{id:string, outcome:'win'|'loss', magnitude?:number}>, warExhaustion: Record<string, number> }}
 *   - outcomes: probability-1 condition / power_transfer outcomes for applyWorldPulseOutcomes
 *   - deployments: the UPDATED one-army ledger to persist onto worldState
 *   - graphChannels: war_front directed channels to upsert into the regional graph
 *   - retiredChannels: war_front channel IDs whose siege RESOLVED this tick (conquest or
 *     withdrawal) — the caller drops each to 'dormant' (setRegionalChannelStatus) so a
 *     resolved siege is not re-discovered and re-fired next tick.
 *   - resolvedDeployments: armies that returned home this tick (for deploymentReturn)
 *   - dispositionDeltas: id-stable win/loss attributions from sieges resolved this tick
 *   - warExhaustion: the UPDATED non-reverting war-exhaustion scar ledger to persist
 */
export function evaluateWarLayer({ snapshot, worldState, rng, tick = 0, now = null, rules = {} }) {
  const existing = worldState?.deployments || {};
  // ── Gate: byte-identical no-op when the war layer is OFF. ────────────────────
  if (!rules?.warLayerEnabled) {
    return { outcomes: [], deployments: existing, graphChannels: [], retiredChannels: [], resolvedDeployments: [], dispositionDeltas: [], warExhaustion: worldState?.warExhaustion || {} };
  }

  const graph = snapshot?.regionalGraph || {};
  // settlementStrength stays the RELATIONSHIP-dynamics confidence input (unchanged).
  const strengthFor = buildStrengthLookup(snapshot);
  // The war-specific MILITARY CAPACITY model (theoretical/current). The
  // deploy/siege math reads CURRENT capacity (theoretical minus exhaustion/drain
  // minus army-away); the feasibility gate classifies the capacity ratio.
  const capacityFor = buildCapacityLookup(snapshot, existing);
  // The pre-tick mobilization posture ledger: a settlement may only OPEN a new
  // siege from a war-ready posture (mobilized / deployed). Read-only here.
  const warPosture = worldState?.warPosture && typeof worldState.warPosture === 'object' ? worldState.warPosture : {};
  const outcomes = [];
  const graphChannels = [];
  // war_front channel IDs whose siege RESOLVED this tick (conquest or withdrawal). The
  // caller drops each to 'dormant' so the SAME front is not re-discovered next tick and
  // the (idempotent) conquest does not re-fire forever. Deduped + codepoint-sorted below.
  /** @type {string[]} */
  const retiredChannels = [];
  const resolvedDeployments = [];
  // Disposition write-side: id-stable win/loss attributions from the contests
  // resolved THIS tick. The occupier/conquered ids are already state-decided
  // (occupier = strongest besieger, codepoint tie-break; conquered = the target),
  // so a reversed-authored save credits the SAME winner. Folded into the next-tick
  // dispositionStats ledger post-apply by the caller. Empty when nothing resolves.
  /** @type {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} */
  const dispositionDeltas = [];
  // Copy the ledger; never mutate worldState's record in place.
  const deployments = { ...existing };
  // Copy the NON-REVERTING war-exhaustion scar ledger (read-last/write-next).
  /** @type {Record<string, number>} */
  const warExhaustion = { ...(worldState?.warExhaustion || {}) };

  const settlementNameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };

  // ── Step 0: AGE + ENRICH the stateful army ledger (read-last/write-next). For
  // every committed deployment, migrate a light record forward to a stateful
  // one (seeded from the live capacity model) and increment its `deploymentAge`. This
  // is a SINGLE pre-tick pass over the COPY — the siege verdict (below) then reads the
  // enriched `currentEffectiveStrength`, attrition degrades it, reinforcement
  // replenishes it. Codepoint-sorted for determinism. ──────────────────────────────
  for (const fromId of Object.keys(deployments).sort(codepoint)) {
    const rec = deployments[fromId];
    if (!rec?.targetId) continue;
    const burden = logisticsBurdenFor(graph, fromId, rec.targetId);
    const cap = capacityFor(fromId);
    const stateful = ensureStatefulRecord(rec, cap, tick, burden);
    // ── HOMEOSTASIS RE-COUPLING: the home's live war-exhaustion / war-drain
    // erodes the offensive capacity (cap.offensive subtracts those). A war-weary home
    // FIELDS A WEAKER ARMY, so cap the army's effective strength at the live offensive
    // ceiling — the stateful army cannot stay stronger than the worn home can sustain.
    // This keeps the strength model coupled to the exhaustion-scar arc: a protracted war
    // drags the field army down too, so the loop still closes (war trends to
    // resolution / withdrawal). The cap only ever LOWERS strength (attrition + the home
    // ceiling both bite); reinforcement lifts within it. ────────────────────────────
    const ceiling = Math.max(0, cap.offensive);
    const cappedStrength = Math.min(Number(stateful.currentEffectiveStrength) || 0, ceiling);
    deployments[fromId] = {
      ...stateful,
      currentEffectiveStrength: cappedStrength,
      deploymentAge: (Number(stateful.deploymentAge) || 0) + 1,
    };
  }

  // The STRENGTH RESOLVER: an id's STATEFUL effective strength (the depleted army
  // at the walls), or null when it has no committed deployment record. The siege
  // verdict reads this in place of the freshly-recomputed offensive capacity, so a
  // worn-down army contests — and can FAIL — at its DEPLETED strength.
  const effectiveStrengthFor = (/** @type {any} */ id) => {
    const rec = deployments[String(id)];
    return rec?.targetId && Number.isFinite(rec.currentEffectiveStrength) ? rec.currentEffectiveStrength : null;
  };

  // ── Step 3: resolve sieges. Iterate every target that has at least one besieger
  // (the union of war_front recipients and deployment targets), codepoint-sorted. ─
  const targetSet = new Set();
  for (const channel of graph?.channels || []) {
    // Only a WAR-LAYER war_front (provenance-gated) is a live siege; a hostile-
    // relationship war_front bundle shares the shape but is not a mobilized siege.
    if (isLiveWarFront(channel)) {
      targetSet.add(String(channel.to));
    }
  }
  for (const attackerId of Object.keys(deployments)) {
    const dep = deployments[attackerId];
    if (dep?.targetId) targetSet.add(String(dep.targetId));
  }
  const targets = [...targetSet].sort(codepoint);

  // Collect the attacker ids whose deployment cleared this tick (their armies return).
  const clearedAttackers = new Set();

  for (const targetId of targets) {
    if (!snapshot?.byId?.has?.(targetId)) continue;
    // Besiegers = war_front sources INTO T ∪ deployment.targetId === T (dedup, sorted).
    const besiegerSet = new Set(warFrontsInto(graph, targetId));
    for (const attackerId of Object.keys(deployments)) {
      if (String(deployments[attackerId]?.targetId) === targetId) besiegerSet.add(String(attackerId));
    }
    const besiegers = [...besiegerSet].filter(id => snapshot?.byId?.has?.(id)).sort(codepoint);
    if (!besiegers.length) continue;

    const defenderItem = snapshot?.byId?.get?.(targetId);
    // The siege's age is the LONGEST-committed besieger's deploymentAge (the
    // committed armies were aged in step 0). This feeds the hard siege-duration
    // ceiling so a saturated stalemate auto-resolves deterministically.
    let siegeAge = 0;
    for (const id of besiegers) {
      const rec = deployments[id];
      // String-coerce like the besieger-collection compare at L798: targetId is a
      // string but a deployment record's targetId is any-typed, so a strict ===
      // would skip a numeric-id record and under-read the siege age (defeating the
      // ceiling). Only deployment-based besiegers of THIS target carry a deploymentAge.
      if (rec?.targetId != null && String(rec.targetId) === targetId) {
        siegeAge = Math.max(siegeAge, Number(rec.deploymentAge) || 0);
      }
    }
    const verdict = resolveSiegeVerdict({ targetId, besiegers, capacityFor, effectiveStrengthFor, defenderItem, rng, tick, siegeAge });

    // ── ATTRITION: degrade every committed BESIEGER's field army after the
    // engagement. Each army is attrited ONLY when it is the attacker on its OWN front
    // (a mutual-siege army is the besieger on one front and the DEFENDER on the other —
    // it is attrited once, on its own front, never double-counted). The loss is a
    // deterministic, bounded fraction of effective strength scaled by the outcome band,
    // relative strength, siege length, fortification, and its own supply/morale/magic/
    // food. Codepoint-sorted; applied to the COPY (next-tick ledger). The depleted
    // strength feeds the NEXT tick's verdict — so a long/failed campaign degrades the
    // army until it can no longer take even a weaker target (the keystone property). The
    // defender ALSO takes losses defending — modelled as a `defensive` band on the
    // defender's OWN field army (it spent men on the walls), applied below when THAT
    // army is the besieger on its front; here we only touch the besiegers of T. ──────
    const defFort = fortificationStrength(capacityFor(targetId).facets, defenderItem);
    for (const attackerId of besiegers) {
      const rec = deployments[attackerId];
      if (!rec?.targetId || String(rec.targetId) !== String(targetId)) continue;
      const { record: degraded } = applyAttritionToRecord(rec, {
        isAttacker: true,
        band: /** @type {any} */ (verdict.band),
        attackerCurrent: verdict.coalitionCurrent,
        defenderCurrent: verdict.defenderCurrent,
        fortification: defFort,
      });
      deployments[attackerId] = degraded;
    }

    if (!verdict.falls) {
      // ── WITHDRAWAL (the homeostasis closer): a COMMITTED siege whose matchup has
      // fallen OUT of the plausible band — the besieger's current capacity collapsed
      // under war_exhaustion/war_drain (or it never plausibly out-classed the
      // defender) — does NOT freeze forever. The besieger gives up: every committed
      // attacker on this target withdraws its army home (a resolved deployment →
      // deploymentReturn). This is what makes a stalled war END instead of locking the
      // realm into a perpetual siege. Fires when the verdict forbids a siege roll
      // (auto_fail / harassment / require_coalition) OR when the hard siege-duration
      // ceiling forced a lift (verdict.forcedLift — a saturated stalemate that ran the
      // ceiling without out-classing the defender); a `plausible` siege that merely
      // HELD this tick keeps grinding (drain accrues, step 5). ──────────────────────
      if (verdict.forcedLift || !verdictPermitsSiege(/** @type {any} */ (verdict.verdict))) {
        const withdrawn = besiegers.filter(id => deployments[id]?.targetId === targetId);
        if (withdrawn.length) {
          for (const attackerId of withdrawn) {
            const withdrawnRec = deployments[attackerId];
            resolvedDeployments.push({ attackerId, deployment: withdrawnRec, targetId, outcome: 'withdrawal' });
            delete deployments[attackerId];
            clearedAttackers.add(attackerId);
            // Retire this besieger's war_front channel: the siege is broken off, so the
            // front must not persist as 'confirmed' (which would leave the former target
            // permanently 'under siege' and re-seed a phantom siege next tick).
            for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
            // WAR OUTCOME → FUTURE RISK (reuse the disposition path): a
            // settlement that abandoned a siege banked a war LOSS, and a BADLY-DAMAGED
            // returning army banks a HEAVIER loss. This lowers its disposition
            // multiplier (computeAggressiveness reads dispositionStats) — so it is
            // slower to re-mobilize AND rivals reading the lowered confidence detect a
            // weakened settlement (a low-strength returnee is more vulnerable). The
            // magnitude scales with how gutted the army came home.
            const ratio = (() => {
              const m = Number(withdrawnRec?.maxStartStrength);
              const c = Number(withdrawnRec?.currentEffectiveStrength);
              return Number.isFinite(m) && m > 0 && Number.isFinite(c) ? Math.max(0, Math.min(1, c / m)) : 1;
            })();
            dispositionDeltas.push({ id: String(attackerId), outcome: 'loss', magnitude: clamp01(0.5 + (1 - ratio) * 0.5) });
            const name = settlementNameFor(attackerId);
            const targetName = settlementNameFor(targetId);
            outcomes.push(conditionOutcome({
              id: `world_outcome.siege_abandoned.${stablePart(attackerId)}.${stablePart(targetId)}.${tick}`,
              archetype: 'war_exhaustion',
              targetSaveId: attackerId,
              severity: clamp01(0.3 + (warExhaustion[attackerId] || 0) * 0.4),
              headline: `${name} breaks off the siege of ${targetName}`,
              summary: `${name}'s army can no longer plausibly take ${targetName}. It withdraws, the campaign abandoned.`,
              reasons: verdict.reasons,
              tick,
              sourceEventTargetId: targetId,
              causes: [{ source: attackerId, effect: 'war_exhaustion', reason: `${name} abandoned the siege of ${targetName} (no longer feasible).` }],
            }));
          }
          continue; // the siege is broken off — no harassment on top.
        }
        // No live deployment to withdraw, but a STALE confirmed war_front channel may
        // still point at the target from a former besieger (its army already returned a
        // prior tick, but the front was never retired). The matchup is no longer
        // siege-feasible, so retire those stale fronts too — otherwise the target stays
        // permanently 'under siege' for pressure/strategy and the former besieger can
        // never mount a new campaign (finding 4). A still-feasible front would have rolled
        // above and is left untouched.
        for (const attackerId of besiegers) {
          if (deployments[attackerId]?.targetId === targetId) continue; // (none here — withdrawn.length was 0)
          for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
        }
      }
      // ── HARASSMENT: a feasibility-gated weak attacker that cannot storm the town
      // still RAIDS — a low-severity war_pressure on the target (NOT a siege fall, NOT
      // a power transfer). Emitted once per harassed target. A plausible siege that
      // merely held this tick (drain keeps accruing in step 5) emits nothing here. ──
      if (verdict.harass) {
        const targetName = settlementNameFor(targetId);
        const raiderName = settlementNameFor(besiegers[0]);
        outcomes.push(conditionOutcome({
          id: `world_outcome.harassment.${stablePart(targetId)}.${tick}`,
          archetype: 'war_pressure',
          targetSaveId: targetId,
          severity: HARASSMENT_SEVERITY,
          headline: `${targetName} is harried`,
          summary: `${raiderName}'s force is too weak to storm ${targetName}, but it raids the approaches and pressures the defenders.`,
          reasons: verdict.reasons,
          tick,
          sourceEventTargetId: besiegers[0],
          causes: [{ source: besiegers[0], effect: 'war_pressure', reason: `${raiderName} harasses ${targetName} (siege implausible).` }],
        }));
      }
      continue; // siege holds / auto-fails / harasses — no conquest this tick.
    }

    // ── CONQUEST: the strongest besieger (codepoint tie-break) occupies T. ──────
    const occupierId = pickOccupier(besiegers, capacityFor, effectiveStrengthFor);
    const occupierName = settlementNameFor(occupierId);
    const targetName = settlementNameFor(targetId);
    const losers = besiegers.filter(id => id !== occupierId).map(id => settlementNameFor(id));
    const coalitionStrength01 = clamp01(verdict.coalitionCurrent / 100);

    outcomes.push({
      id: `world_outcome.conquest.${stablePart(targetId)}.${tick}`,
      type: 'power_transfer',
      candidateType: 'conquest',
      ruleId: 'war_layer_conquest',
      ruleFamily: 'stressor',
      applyMode: 'auto',
      probability: 1,
      targetSaveId: targetId,
      severity: clamp01(0.6 + coalitionStrength01 * 0.2),
      headline: `${occupierName} storms ${targetName}`,
      summary: `The siege of ${targetName} broke. ${occupierName}'s army holds the walls; an occupation authority now rules in the conqueror's name.`,
      reasons: [
        `Coalition current capacity ${verdict.coalitionCurrent.toFixed(1)} vs defender ${verdict.defenderCurrent.toFixed(1)} (feasibility: ${verdict.verdict}, ratio ${verdict.ratio.toFixed(2)}).`,
        `Fall chance ${verdict.pFall.toFixed(2)}, roll ${verdict.roll.toFixed(2)}.`,
      ],
      powerTransfer: {
        toPowerName: `${occupierName} occupation authority`,
        cause: 'conquest',
        tick,
        losers,
        sourceStressorId: `war_front.${stablePart(occupierId)}.${stablePart(targetId)}`,
      },
      condition: {
        archetype: 'war_pressure',
        severity: clamp01(0.55 + coalitionStrength01 * 0.2),
        triggeredAt: { tick, sourceEventType: 'WAR_LAYER_CONQUEST', sourceEventTargetId: targetId },
        causes: [{
          source: occupierId,
          effect: 'war_pressure',
          reason: `${occupierName} conquered ${targetName}.`,
        }],
      },
    });

    // Disposition ratchet: the conqueror banked a war WIN; the conquered settlement a LOSS.
    dispositionDeltas.push({ id: String(occupierId), outcome: 'win', magnitude: 1 });
    dispositionDeltas.push({ id: String(targetId), outcome: 'loss', magnitude: 1 });

    // ALL besiegers' armies return home — the siege is over (won). Clear their
    // deployments; deploymentReturn turns each return into a contextual outcome.
    for (const attackerId of besiegers) {
      if (deployments[attackerId]) {
        resolvedDeployments.push({ attackerId, deployment: deployments[attackerId], targetId, outcome: 'conquest' });
        delete deployments[attackerId];
        clearedAttackers.add(attackerId);
      }
      // RETIRE every besieger's war_front channel — the siege RESOLVED (the target fell).
      // Without this the front stays 'confirmed', so next tick the (idempotent) conquest
      // re-fires every tick forever: a fresh conquest realm-event + chronicle entry, a
      // re-seeded 'contested' occupation, and disposition deltas, for a siege that already
      // ended (finding 1). Drop EVERY besieger's channel (coalition members included),
      // whether or not it still has a live deployment.
      for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
    }
  }

  // ── Step 4: new deployments. Iterate every candidate settlement codepoint-sorted. ─
  const candidateIds = (snapshot?.settlements || [])
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);

  for (const fromId of candidateIds) {
    if (deployments[fromId]) continue;                 // one-army constraint
    if (clearedAttackers.has(fromId)) continue;        // army just returned this tick
    if (isBesieged(graph, fromId)) continue;           // can't march while besieged/occupied
    // MOBILIZATION POSTURE GATE (the keystone): a settlement cannot launch a
    // serious siege from peace. It must have RAMPED to a war-ready posture
    // (mobilized / deployed) over prior ticks. A `peace`/`alert`/`war_preparation`
    // settlement is BLOCKED here — no fresh front, no matter how strong. (Pre-seeded
    // sieges already in the graph are resolved above regardless of posture; this gate
    // only governs OPENING a NEW one.)
    if (!isWarReady(warPosture[fromId]?.state)) continue;

    const fromStrength = strengthFor(fromId);
    if (fromStrength < HOSTILE_CONFIDENCE) continue;   // not confident enough to wage war (relationship gate)
    const fromCap = capacityFor(fromId);

    // Pick the first hostile target (codepoint-sorted) this settlement can PLAUSIBLY
    // besiege ALONE — the hard feasibility gate runs on the CURRENT-capacity matchup
    // BEFORE any front is minted, so a thorpe cannot open a solo siege on a strong
    // town even at a war-ready posture. Only a `plausible` (or satisfied override)
    // solo verdict mints a front; require_coalition / harassment / auto_fail do not.
    let chosenTarget = null;
    for (const targetId of hostileTargetsOf(snapshot, fromId)) {
      if (isBesieged(graph, targetId)
          && warFrontsInto(graph, targetId).includes(fromId)) {
        // already besieging it (shouldn't happen without a deployment, but guard)
        continue;
      }
      if (fromStrength <= strengthFor(targetId) + CONQUEST_MARGIN) continue; // relationship-confidence gate
      const defenderCap = capacityFor(targetId);
      const { verdict } = classifyFeasibility({
        attackerCurrent: fromCap.offensive,
        defenderCurrent: defenderCap.homeDefense,
        coalitionSize: 1,
        defenderItem: snapshot?.byId?.get?.(targetId),
        attackerFacets: fromCap.facets,
        defenderFacets: defenderCap.facets,
      });
      if (verdictPermitsSiege(verdict)) { chosenTarget = targetId; break; }
    }
    if (!chosenTarget) continue;

    // SEED the STATEFUL army record from the origin's capacity model at deploy
    // time (full-strength token: maxStartStrength = currentEffectiveStrength = the
    // origin's offensive capacity). Attrition degrades it, reinforcement replenishes
    // it, the siege verdict reads its currentEffectiveStrength.
    deployments[fromId] = seedDeploymentState({
      targetId: chosenTarget,
      cap: fromCap,
      tick,
      logisticsBurden: logisticsBurdenFor(graph, fromId, chosenTarget),
      role: 'siege',
    });
    graphChannels.push(mintDirectedChannel({
      type: 'war_front',
      from: fromId,
      to: chosenTarget,
      strength: clamp01(0.5 + fromStrength * 0.3),
      confidence: 0.8,
      explanation: `${settlementNameFor(fromId)} marches on ${settlementNameFor(chosenTarget)}.`,
      relationshipKey: `war_front.${stablePart(fromId)}.${stablePart(chosenTarget)}`,
      source: 'war_layer_deploy',
      now,
    }));
  }

  // ── Step 5: re-upsert the home conditions each tick for every active deployer.
  // war_drain severity ∝ the count of active war_fronts FROM S in the PRE-TICK graph
  // (NOT this-tick's fresh mints) — avoids intra-tick read-after-write, so a fresh
  // deploy raises the drain only NEXT tick. army_deployed is a flat garrison debuff. ─
  const activeDeployers = new Set(Object.keys(deployments).map(String));
  for (const fromId of Object.keys(deployments).sort(codepoint)) {
    const preTickFrontCount = warFrontsFrom(graph, fromId).length;
    // A just-deployed settlement has 0 pre-tick fronts → minimum-severity drain this
    // tick (the army IS away), scaling up next tick once the mint lands in the graph.
    const frontCount = Math.max(preTickFrontCount, 1);
    const rec = deployments[fromId];
    const name = settlementNameFor(fromId);
    const targetName = settlementNameFor(rec.targetId);
    const deploymentAge = Number(rec.deploymentAge) || 0;

    // ── REINFORCEMENT: the home sends a PARTIAL, EXPENSIVE replenishment to its
    // army in the field. The flow ∝ the origin's economy/manpower/materiel/food/trade/
    // legitimacy, damped by route burden + its own war-exhaustion, ZEROED if the home
    // is itself besieged. It NEVER fully restores (capped well below the deficit) and
    // it DRAINS the origin — the reinforcement_cost condition below carries the bleed.
    // Only an army that is actually DEPLETED draws a flow (a full-strength army receives
    // nothing → no extra drain → byte-light). ───────────────────────────────────────
    const origin = buildOriginEnvelope(snapshot, graph, capacityFor, warExhaustion, fromId);
    const flow = computeReinforcement({ record: rec, origin });
    deployments[fromId] = applyReinforcementToRecord(rec, flow);

    // The age-scaled war_drain bump: the LONGER deployed, the deeper the home bleed —
    // even a winning war keeps draining the origin. Stacks on the front-count drain.
    const ageDrain = Math.min(AGE_DRAIN_CAP, deploymentAge * AGE_DRAIN_PER_TICK);
    const drainSeverity = clamp01(frontCount * WAR_DRAIN_PER_FRONT + ageDrain);

    // RATCHET the non-reverting exhaustion scar UP for every sustained
    // deployment (read-last/write-next: read the pre-tick ledger value, accrue, write
    // the next-tick value). Capped at 1. The condition emitted below carries the
    // ratcheted value, so it lands on the home and bites settlementStrength NEXT tick.
    const prevScar = clamp01(warExhaustion[fromId] || 0);
    const nextScar = clamp01(prevScar + EXHAUSTION_ACCRUE_PER_TICK);
    warExhaustion[fromId] = nextScar;

    outcomes.push(conditionOutcome({
      id: `world_outcome.war_drain.${stablePart(fromId)}.${tick}`,
      archetype: 'war_drain',
      targetSaveId: fromId,
      severity: drainSeverity,
      headline: `${name}'s war chest bleeds`,
      summary: `Sustaining the campaign against ${targetName} drains the home economy.`,
      reasons: [`${frontCount} active war front${frontCount === 1 ? '' : 's'} from ${name}${ageDrain > 0 ? `, ${deploymentAge} ticks deployed` : ''}.`],
      tick,
      sourceEventTargetId: rec.targetId,
      causes: [{ source: fromId, effect: 'war_drain', reason: `${name} is besieging ${targetName}.` }],
    }));

    outcomes.push(conditionOutcome({
      id: `world_outcome.army_deployed.${stablePart(fromId)}.${tick}`,
      archetype: 'army_deployed',
      targetSaveId: fromId,
      severity: ARMY_DEPLOYED_SEVERITY,
      headline: `${name}'s garrison marches abroad`,
      summary: `${name}'s standing army is committed against ${targetName}, thinning the home garrison.`,
      reasons: [`Army deployed to besiege ${targetName}.`],
      tick,
      sourceEventTargetId: rec.targetId,
      causes: [{ source: fromId, effect: 'army_deployed', reason: `${name}'s army is away besieging ${targetName}.` }],
    }));

    // ── REINFORCEMENT COST: the home pays for keeping the army in the field. Only
    // emitted when a flow actually went out (a depleted army being topped up); a full-
    // strength army imposes no cost (byte-light). Severity ∝ the flow + deploymentAge,
    // bites economic_capacity / public_legitimacy / defense_readiness. ───────────────
    if (flow.drainSeverity > REINFORCEMENT_COST_FLOOR && flow.flowPoints > 0) {
      outcomes.push(conditionOutcome({
        id: `world_outcome.reinforcement_cost.${stablePart(fromId)}.${tick}`,
        archetype: 'reinforcement_cost',
        targetSaveId: fromId,
        severity: flow.drainSeverity,
        headline: `${name} bleeds to keep its army fed`,
        summary: `${name} keeps sending men, coin, and grain to the front against ${targetName}, and the home pays for every levy.`,
        reasons: flow.reasons,
        tick,
        sourceEventTargetId: rec.targetId,
        causes: [{ source: fromId, effect: 'reinforcement_cost', reason: `${name} is reinforcing its army besieging ${targetName} (${deploymentAge} ticks deployed).` }],
      }));
    }

    // Surface the scar as a war_exhaustion condition once it clears the floor.
    // This is THE homeostasis closer: it feeds economic_capacity (the sink) AND a
    // direct settlementStrength penalty, so a protracted siege eventually drops the
    // aggressor's confidence below HOSTILE_CONFIDENCE/CONQUEST_MARGIN — the realm can
    // no longer sustain or escalate the war and the loop converges toward peace.
    if (nextScar >= EXHAUSTION_CONDITION_FLOOR) {
      outcomes.push(conditionOutcome({
        id: `world_outcome.war_exhaustion.${stablePart(fromId)}.${tick}`,
        archetype: 'war_exhaustion',
        targetSaveId: fromId,
        severity: nextScar,
        headline: `${name} grows war-weary`,
        summary: `The long campaign against ${targetName} has left ${name} a lasting wound. The treasury thins and the public tires of war.`,
        reasons: [`Sustained war-exhaustion scar at ${nextScar.toFixed(2)} (non-reverting).`],
        tick,
        sourceEventTargetId: rec.targetId,
        causes: [{ source: fromId, effect: 'war_exhaustion', reason: `${name} has campaigned too long against ${targetName}.` }],
      }));
    }
  }

  // ── Step 5b: DECAY the scar for homes whose army is no longer deployed. The decay
  // is ~5× slower than the accrual (EXHAUSTION_DECAY_PER_TICK ≪ ACCRUE), so a long
  // war leaves a wound that lingers for many ticks after the peace — non-reverting by
  // construction, the opposite of a mean-reverting relationship. Codepoint-sorted;
  // entries that reach 0 are dropped so the ledger never accumulates dead keys. A
  // still-significant scar keeps stamping its war_exhaustion condition (the realm is
  // recovering but not yet whole — peace holds because the wound persists).
  for (const homeId of Object.keys(warExhaustion).sort(codepoint)) {
    if (activeDeployers.has(homeId)) continue;
    const decayed = clamp01((warExhaustion[homeId] || 0) - EXHAUSTION_DECAY_PER_TICK);
    if (decayed <= 0) {
      delete warExhaustion[homeId];
      continue;
    }
    warExhaustion[homeId] = decayed;
    if (decayed >= EXHAUSTION_CONDITION_FLOOR && snapshot?.byId?.has?.(homeId)) {
      const name = settlementNameFor(homeId);
      outcomes.push(conditionOutcome({
        id: `world_outcome.war_exhaustion.${stablePart(homeId)}.${tick}`,
        archetype: 'war_exhaustion',
        targetSaveId: homeId,
        severity: decayed,
        headline: `${name} nurses its war wounds`,
        summary: `${name}'s army is home, but the cost of the war it waged still weighs on the economy and the public.`,
        reasons: [`War-exhaustion scar slowly fading at ${decayed.toFixed(2)}.`],
        tick,
        sourceEventTargetId: homeId,
        causes: [{ source: homeId, effect: 'war_exhaustion', reason: `${name} is recovering from a costly war.` }],
      }));
    }
  }

  // Dedup + codepoint-sort the retired channel ids (a coalition can list the same
  // target front once per besieger; the caller's setRegionalChannelStatus is idempotent,
  // but a stable, deduped list keeps the output order-independent).
  const retiredChannelsOut = [...new Set(retiredChannels)].sort(codepoint);

  return { outcomes, deployments, graphChannels, retiredChannels: retiredChannelsOut, resolvedDeployments, dispositionDeltas, warExhaustion };
}
