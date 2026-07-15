/**
 * navalKernel.js — the W-NAVY kernel adapter (DESIGN_NAVY.md).
 *
 * The pure engine (spatial/navalLayer.js) owns the mechanics (naval-strength derivation,
 * the convoy record, the shared-sea-edge predicate, the shared-fate math, capacity); THIS
 * thin adapter supplies the LIVE reads and writes the outcomes back:
 *
 *   • DERIVE CONVOYS: a committed deployment whose target is a sea-reachable PORT, from a
 *     port that fields a war navy, gains a CONVOY record (the sea lift's battle exposure) —
 *     minted into the SIBLING `navalTransit` ledger (never the deployments one-army slot,
 *     never the frozen digest slot). Capacity DEFERS a full lane (visible, no mint).
 *   • SEA BATTLES: two HOSTILE navies whose paths share a SEA EDGE collide there — resolved
 *     by resolveFieldBattle VERBATIM (land parity by construction). The loser retreats to its
 *     home port (retreatRoute — it already routes over sea edges); a lost CONVOY's embarked
 *     army SHARES the convoy's fate (the heaviest bounded loss band + a forced debark at the
 *     nearest friendly port, whence survivors retreat OVERLAND via the standing recall
 *     homecoming — never annihilation).
 *   • BLOCKADE (Stage 4, added next): a navy blockading a hostile port MINTS A SIEGE through
 *     the existing machinery (the interdiction term fed from the water side), authority-routed.
 *
 * AGGREGATE, NAMED-NPC-SAFE (owner boundary): strength/size NUMBERS only — no roster read,
 * no npc mutation. DORMANT (constitutional): a no-op unless the spatial-canon marker is
 * present AND the VIRTUAL `navalEnabled` flag is set (design §6 + the brief's law 3 — no
 * DEFAULT_SIMULATION_RULES entry) ⇒ zero `navalTransit` keys, byte-identical. The ledger
 * nests under `spatialLedgers` ⇒ ZERO eager first-paint bytes; imported ONLY by the lazy
 * pulseKernel. Pure + deterministic; the caller threads the tick + the pulse rng.
 */

import {
  navalTransitLedger, navalRecordOf, planConvoy, planBlockade,
  sharesSeaEdge, seaBattleInputs, sharedFateLoss, nearestFriendlyPort,
  activeBlockadeTargets, NAVAL_TUNING,
} from '../spatial/navalLayer.js';
import { navalStrengthOf } from './navalStrength.js';
import {
  armyTransitActive, resolveFieldBattle, retreatRoute, stepArmyPosition, ARMY_ROLES,
} from '../spatial/armyTransit.js';
import { setSpatialLedger, dropSpatialLedger, isPort } from '../spatial/distanceRead.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { pendingActorMajorFor } from './actorMajorApproval.js';
import { formatCount } from '../formatNumber.js';

/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('../spatial/navalLayer.js').NavalTransitRecord} NavalTransitRecord */
/** @typedef {{ targetId?: string|number, sinceTick?: number, currentEffectiveStrength?: number,
 *   readiness?: number, recalled?: { cause?: string, tick?: number } }} DeploymentRecord */
/** @typedef {{ id?: string|number, name?: string, settlement?: { name?: string },
 *   causal?: { scores?: { economic_capacity?: number } } }} SnapItem */
/** @typedef {{ byId?: { get?: (id: string) => SnapItem | undefined } }} Snapshot */
/** @typedef {{ channels?: Array<Record<string, unknown>>, edges?: Array<Record<string, unknown>> }} Graph */
/** @typedef {{ fork?: (key: string) => { random: () => number } }} Rng */
/** A recursively-forkable seeded PRNG (createPRNG's real shape). @typedef {{ fork: (key: string) => ForkableRng, random: () => number }} ForkableRng */

// The graph relationship labels that make two navies HOSTILE combatants at sea (design §3 —
// graph hostile labels, NOT the mutual-homeland test; navies blockade + escort in peacetime).
const HOSTILE_REL = new Set(['hostile', 'cold_war', 'rival', 'criminal_network']);

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

// ── The activation gate (dormancy / byte-identity seam) ────────────────────────
/**
 * The naval layer is LIVE iff the spatial-canon marker is present (aspatial worlds have no
 * sea — the armyTransit precedent) AND the VIRTUAL `navalEnabled` flag is set. NO entry in
 * DEFAULT_SIMULATION_RULES ⇒ every existing golden is byte-identical; absent ⇒ an immediate
 * no-op. @param {{ spatialCanonVersion?: unknown, simulationRules?: unknown } | null | undefined} worldState @returns {boolean}
 */
export function navalActive(worldState) {
  if (!armyTransitActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  if (!rules || typeof rules !== 'object') return false;
  return /** @type {Record<string, unknown>} */ (rules).navalEnabled === true;
}

/** The display name for an id. @param {Snapshot} snapshot @param {string} id @returns {string} */
function nameOf(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.name || item?.settlement?.name || String(id);
}

/** The relationship type between two settlements on the graph edge list (codepoint-agnostic).
 *  @param {Graph} graph @param {string} a @param {string} b @returns {string} */
function relTypeBetween(graph, a, b) {
  const edges = graph && Array.isArray(graph.edges) ? graph.edges : [];
  for (const e of edges) {
    const from = String(e?.from ?? '');
    const to = String(e?.to ?? '');
    if ((from === a && to === b) || (from === b && to === a)) {
      return String(e?.relationshipType ?? e?.relType ?? '');
    }
  }
  return '';
}

/**
 * Are two navy OWNERS hostile combatants (design §3): a live war_front either direction, OR a
 * hostile relationship label. NOT the mutual-homeland test. @param {Graph} graph @param {string} a @param {string} b @returns {boolean}
 */
function hostileOwners(graph, a, b) {
  if (a === b) return false;
  if (warFrontsInto(graph || {}, a).includes(b) || warFrontsFrom(graph || {}, a).includes(b)) return true;
  return HOSTILE_REL.has(relTypeBetween(graph || {}, a, b));
}

/** Ports NOT hostile to `ownerId` — the friendly-debark candidates (design §3). Every port the
 *  digest connects, minus those the graph marks hostile to the owner. @param {SpatialDigest} digest
 *  @param {Graph} graph @param {string} ownerId @returns {string[]} */
function friendlyPortsFor(digest, graph, ownerId) {
  return navalPortsOf(digest).filter((p) => p !== ownerId && !hostileOwners(graph, ownerId, p));
}

/** Every port the frozen sea-lane set connects (codepoint-sorted). @param {SpatialDigest} digest @returns {string[]} */
function navalPortsOf(digest) {
  const lanes = /** @type {{ reserved?: { seaLanes?: { ports?: string[] } } }} */ (digest)?.reserved?.seaLanes;
  return lanes && Array.isArray(lanes.ports) ? [...lanes.ports.map(String)].sort() : [];
}

/** The hostile PORT a navy would blockade: the codepoint-first hostile, sea-reachable enemy
 *  port among the sea-lane ports (bounded — ports are few). @param {SpatialDigest} digest
 *  @param {Graph} graph @param {string} navyId @param {string[]} ports @returns {string|null} */
function pickBlockadeTarget(digest, graph, navyId, ports) {
  for (const p of ports) {
    if (p === navyId) continue;
    if (!hostileOwners(graph, navyId, p)) continue;
    // sea-reachable: a convoy/blockade route exists (planBlockade enforces the sea leg).
    const plan = planBlockade(digest, null, { ownerId: navyId, targetId: p, ownerStrength: 1, departTick: 0 });
    if (plan && 'record' in plan) return p;
  }
  return null;
}

/** A blockade-declared wizard-news entry (AGGREGATE). @param {{ ownerId: string, targetId: string }} b
 *  @param {Snapshot} snapshot @param {number} tick @param {string|null} now @returns {Record<string, unknown>} */
function blockadeNews(b, snapshot, tick, now) {
  const navy = nameOf(snapshot, b.ownerId);
  const port = nameOf(snapshot, b.targetId);
  return {
    id: `wizard_news.${tick}.blockade.${b.ownerId}.${b.targetId}`,
    tick,
    scope: 'regional',
    significance: 'notable',
    score: 64,
    headline: `${navy}'s fleet blockades ${port}`,
    summary: `${navy} threw a blockade across ${port}'s sea approaches — a siege from the water. Its harbor trade is strangled; combined with a land siege, ${port} will starve.`,
    kind: 'applied',
    impactKind: 'blockade_declared',
    channelType: null,
    severity: 0.55,
    settlementIds: [b.ownerId, b.targetId],
    impactIds: [],
    channelIds: [],
    sourceEventId: `blockade_declared.${b.ownerId}.${b.targetId}.${tick}`,
    tags: ['world_pulse', 'war', 'blockade'],
    reasons: [`${navy} holds the sea approaches to ${port}.`],
    createdAt: now,
  };
}

/**
 * A sea-battle wizard-news entry (house voice, AGGREGATE — no npc named). Deterministic id
 * from the sorted pair + tick. @param {{ winnerId: string, loserId: string, region: string, lostConvoy: boolean, debarkPort: string|null, drowned: number }} b
 * @param {Snapshot} snapshot @param {number} tick @param {string|null} now @returns {Record<string, unknown>}
 */
function seaBattleNews(b, snapshot, tick, now) {
  const winner = nameOf(snapshot, b.winnerId);
  const loser = nameOf(snapshot, b.loserId);
  const pair = [b.winnerId, b.loserId].sort();
  const summaryTail = b.lostConvoy && b.debarkPort
    ? ` The convoy scattered — the embarked host lost ${formatCount(Math.max(0, Math.round(b.drowned)))} to the deep and debarked at ${nameOf(snapshot, b.debarkPort)} to march home overland.`
    : ' The beaten fleet fell back to home waters.';
  return {
    id: `wizard_news.${tick}.sea_battle.${pair[0]}.${pair[1]}`,
    tick,
    scope: 'regional',
    significance: 'notable',
    score: 63,
    headline: `${winner}'s fleet breaks ${loser}'s at sea`,
    summary: `The war fleets of ${winner} and ${loser} met on the sea lanes off ${nameOf(snapshot, b.region)}. ${winner} held the water.${summaryTail}`,
    kind: 'applied',
    impactKind: 'sea_battle',
    channelType: null,
    severity: 0.55,
    settlementIds: [b.winnerId, b.loserId],
    impactIds: [],
    channelIds: [],
    sourceEventId: `sea_battle.${pair[0]}.${pair[1]}.${tick}`,
    tags: ['world_pulse', 'war', 'sea_battle'],
    reasons: [`A shared-sea-edge collision on the approaches to ${nameOf(snapshot, b.region)}.`],
    createdAt: now,
  };
}

/**
 * Advance the naval layer one tick: derive convoys, resolve shared-sea-edge sea battles
 * (resolveFieldBattle verbatim), apply the shared fate (heaviest band + debark), retreat the
 * losers home, persist the navalTransit ledger, and write shared-fate strength back onto the
 * embarked armies. DORMANT (gate absent) ⇒ { changed:false } — byte-identical.
 * @param {Object} args
 * @param {Snapshot} args.snapshot
 * @param {Record<string, unknown> & { spatialCanonVersion?: unknown, deployments?: Record<string, DeploymentRecord>, spatialLedgers?: unknown }} args.worldState
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {Graph|null|undefined} args.graph
 * @param {Rng|null|undefined} args.rng
 * @param {string|null} [args.season]
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, newsEntries: Array<Record<string, unknown>>, deferrals: Array<Record<string, unknown>> }}
 */
export function advanceNaval({ snapshot, worldState, digest, graph, rng, season = null, tick, now = null }) {
  if (!navalActive(worldState) || !digest) {
    return { worldState, changed: false, newsEntries: [], deferrals: [] };
  }
  const nowTick = Math.max(0, Math.floor(num(tick, 0)));
  const deployments = /** @type {Record<string, DeploymentRecord>} */ (worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const prior = navalTransitLedger(worldState) || {};

  /** @type {Record<string, NavalTransitRecord>} */
  const records = {};
  /** @type {Array<Record<string, unknown>>} */
  const deferrals = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  // ── ADVANCE existing naval records (position step; naval fields survive the spread). ──
  for (const key of Object.keys(prior).sort()) {
    const rec = navalRecordOf(prior[key]);
    if (!rec) continue;
    records[key] = /** @type {NavalTransitRecord} */ (stepArmyPosition(rec, nowTick));
  }

  // ── DERIVE CONVOYS: a deployment whose target is a sea-reachable PORT, from a port that
  // fields a war navy, gains a convoy escort (deduped per navy, capacity-deferred). ────────
  for (const armyId of Object.keys(deployments).sort()) {
    if (records[armyId]) continue; // this navy already has a live operation
    const dep = deployments[armyId];
    const targetId = dep && dep.targetId != null ? String(dep.targetId) : '';
    if (!targetId || dep.recalled) continue;
    if (!isPort(digest, armyId) || !isPort(digest, targetId)) continue;
    const navStrength = navalStrengthOf(digest, snapshot?.byId?.get?.(String(armyId)), armyId);
    if (navStrength <= 0) continue; // no war navy to escort the crossing
    const plan = planConvoy(digest, worldState, {
      ownerId: armyId, cargoId: armyId, destId: targetId,
      ownerStrength: navStrength, cargoStrength: Math.max(0, num(dep.currentEffectiveStrength, 0)),
      readiness01: clamp01(num(dep.readiness, 0.5)), departTick: nowTick, season, activeRecords: records,
    });
    if (plan && 'record' in plan) records[armyId] = plan.record;
    else if (plan && 'deferred' in plan) deferrals.push({ ownerId: armyId, targetId, reason: 'capacity', edge: plan.fullEdge });
  }

  // ── DERIVE BLOCKADES (design §4 — "a blockade is the same as a siege"; authority-routed,
  // loaded dice: convoys routine, blockades DRAMA). A navy at war with a hostile PORT it can
  // reach by sea throws a blockade across its approaches — the interdiction is fed from the
  // water side via the supply seam (blockadeInterceptsSupply), so combined with a land siege
  // the port starves (the both-cut law). Under a DM-driven authority mode the mint DEFERS
  // (deferral-visible; the full proposal-queue re-mint is a documented W-COMPOSER-2 seam). ──
  const rules = /** @type {Record<string, unknown>} */ (asObject(worldState.simulationRules));
  const blockadeMode = authorityFor(rules, 'blockade_declared', 'auto');
  const blockadeDeferred = blockadeMode !== 'auto';
  const blockadeRng = rng && typeof rng.fork === 'function' ? /** @type {ForkableRng} */ (rng.fork('blockade')) : null;
  const priorBlockades = activeBlockadeTargets(worldState);
  const ports = navalPortsOf(digest);
  for (const navyId of ports) {
    if (records[navyId]) continue; // this navy already has a live operation
    const navStrength = navalStrengthOf(digest, snapshot?.byId?.get?.(navyId), navyId);
    if (navStrength <= 0) continue; // no war navy to blockade with
    const target = pickBlockadeTarget(digest, graph || {}, navyId, ports);
    if (!target) continue;
    if (priorBlockades.get(target)?.has(navyId)) continue; // already blockading it
    if (blockadeDeferred) {
      if (!pendingActorMajorFor(worldState, 'blockade_declared', navyId)) {
        deferrals.push({ ownerId: navyId, targetId: target, reason: 'dm_approval' });
      }
      continue;
    }
    // THE LOADED DICE (§H): p = INITIATE_BASE × pull², where pull rises with the navy's
    // dominance over the target's own war navy (a stronger fleet is likelier to commit).
    const targetNavy = navalStrengthOf(digest, snapshot?.byId?.get?.(target), target);
    const pull = clamp01(navStrength / (navStrength + targetNavy + 1));
    const p = NAVAL_TUNING.BLOCKADE_INITIATE_BASE * pull * pull;
    const fork = blockadeRng ? blockadeRng.fork(`blockade:${navyId}:${target}:${nowTick}`) : null;
    const u = fork && typeof fork.random === 'function' ? clamp01(fork.random()) : 1;
    if (u >= p) { deferrals.push({ ownerId: navyId, targetId: target, reason: 'loaded_dice' }); continue; }
    const plan = planBlockade(digest, worldState, { ownerId: navyId, targetId: target, ownerStrength: navStrength, departTick: nowTick, season });
    if (plan && 'record' in plan) {
      records[navyId] = plan.record;
      newsEntries.push(blockadeNews({ ownerId: navyId, targetId: target }, snapshot, nowTick, now));
    }
  }

  // ── SEA BATTLES: hostile navies sharing a sea edge collide (resolveFieldBattle verbatim). ─
  /** @type {Record<string, number>} */
  const sharedFateWriteback = {};   // cargoArmyId → new strength (shared fate)
  /** @type {Set<string>} */
  const debarkRecall = new Set();    // cargoArmyId → stamp recalled (overland homecoming)
  const battleRng = rng && typeof rng.fork === 'function' ? /** @type {ForkableRng} */ (rng.fork('seabattle')) : rng;
  const keys = Object.keys(records).sort();
  /** @type {Set<string>} records removed this tick (beaten — disengaged home). */
  const removed = new Set();
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const ka = keys[i];
      const kb = keys[j];
      if (removed.has(ka) || removed.has(kb)) continue;
      const a = records[ka];
      const b = records[kb];
      if (!a || !b) continue;
      if (a.position01 >= 1 || b.position01 >= 1) continue;      // both must still be afield
      if (!hostileOwners(graph || {}, a.ownerId, b.ownerId)) continue;
      const edge = sharesSeaEdge(digest, a.path, b.path);
      if (!edge) continue;
      const result = resolveFieldBattle({
        a: seaBattleInputs(a), b: seaBattleInputs(b),
        // The seabattle-forked stream is itself a recursively-forkable PRNG at runtime
        // (resolveFieldBattle forks `battle:<a>:<b>:<tick>` off it — a distinct stream from
        // the land layer's, so a sea and a land battle between the same pair never collide).
        rng: /** @type {{ fork?: (key: string) => { random: () => number } } | null | undefined} */ (battleRng),
        tick: nowTick,
      });
      const winnerKey = result.winnerId === a.ownerId ? ka : kb;
      const loserKey = winnerKey === ka ? kb : ka;
      const loser = records[loserKey];
      const winner = records[winnerKey];
      // Winner's fleet takes the (bounded) attrition resolveFieldBattle assigned.
      const winnerNew = result.strengthDelta[winner.ownerId];
      if (Number.isFinite(winnerNew)) records[winnerKey] = { ...winner, strength: winnerNew };
      // The battle's decisiveness ⇒ the shared-fate band.
      const margin = clamp01(Math.abs(num(result.pWin, 0.5) - 0.5) * 2);
      // SHARED FATE: a lost CONVOY drowns/debarks its embarked army (never annihilation).
      let lostConvoy = false;
      let debarkPort = null;
      let drowned = 0;
      if (loser.role === ARMY_ROLES.CONVOY) {
        lostConvoy = true;
        const region = edge.split('|')[0];
        const fate = sharedFateLoss(loser.cargoStrength, margin);
        drowned = fate.drowned;
        debarkPort = nearestFriendlyPort(digest, region, friendlyPortsFor(digest, graph || {}, loser.ownerId), season);
        const cargoArmy = loser.cargoId || loser.ownerId;
        if (deployments[cargoArmy]) { sharedFateWriteback[cargoArmy] = fate.survived; debarkRecall.add(cargoArmy); }
      }
      // The loser's fleet RETREATS to its home port (retreatRoute — it already routes over
      // sea edges); its naval record is dropped (the operation is broken, the navy sails home).
      retreatRoute(digest, worldState, edge.split('|')[0], loser.ownerId, null, season);
      removed.add(loserKey);
      delete records[loserKey];
      newsEntries.push(seaBattleNews(
        { winnerId: winner.ownerId, loserId: loser.ownerId, region: edge.split('|')[0], lostConvoy, debarkPort, drowned },
        snapshot, nowTick, now,
      ));
    }
  }

  // ── PERSIST. Drop the whole ledger when no navy is afield (sparse → byte-safe). ─
  const nextOrNull = Object.keys(records).length ? records : null;
  const changedLedger = JSON.stringify(prior && Object.keys(prior).length ? prior : null) !== JSON.stringify(nextOrNull);
  let nextWorldState = worldState;
  if (changedLedger) {
    nextWorldState = nextOrNull
      ? setSpatialLedger(worldState, 'navalTransit', nextOrNull)
      : dropSpatialLedger(worldState, 'navalTransit');
  }
  // Write shared-fate strengths back onto the embarked armies + stamp the debark recall (the
  // survivors retreat OVERLAND via the standing withdrawal→homecoming — the retreat reuse).
  if (Object.keys(sharedFateWriteback).length || debarkRecall.size) {
    /** @type {Record<string, DeploymentRecord>} */
    const nextDeployments = { ...deployments };
    for (const id of Object.keys(sharedFateWriteback)) {
      if (nextDeployments[id]) nextDeployments[id] = { ...nextDeployments[id], currentEffectiveStrength: sharedFateWriteback[id] };
    }
    for (const id of debarkRecall) {
      if (nextDeployments[id]) nextDeployments[id] = { ...nextDeployments[id], recalled: { cause: 'convoy_lost_debark', tick: nowTick } };
    }
    nextWorldState = { ...nextWorldState, deployments: nextDeployments };
  }
  const changed = changedLedger || Object.keys(sharedFateWriteback).length > 0 || debarkRecall.size > 0;
  return { worldState: nextWorldState, changed, newsEntries, deferrals };
}

// ── VERBS (registrable shape — NOT manifest-registered; the W-COMPOSER-2 lift) ─────────
// Ship as standalone frozen factories (registered:false) exactly like the convergence verbs.
/** @returns {{ verb: string, scope: string, candidateType: string, dials: Record<string, unknown>, registered: boolean, note: string }} */
export function orderConvoyVerbFactory() {
  return Object.freeze({
    verb: 'ORDER_CONVOY',
    scope: 'realm',
    candidateType: 'convoy_ordered',
    dials: Object.freeze({ cargo: 'settlementId', destination: 'settlementId' }),
    registered: false,
    note: 'Registrable shape; realm-manifest registration is W-COMPOSER-2.',
  });
}

/** @returns {{ verb: string, scope: string, candidateType: string, dials: Record<string, unknown>, registered: boolean, note: string }} */
export function declareBlockadeVerbFactory() {
  return Object.freeze({
    verb: 'DECLARE_BLOCKADE',
    scope: 'realm',
    candidateType: 'blockade_declared',
    dials: Object.freeze({ target: 'settlementId' }),
    registered: false,
    note: 'Registrable shape; realm-manifest registration is W-COMPOSER-2.',
  });
}
