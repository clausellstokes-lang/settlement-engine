/**
 * domain/worldPulse/resourceDynamicsKernel.js — W-DISCOVERY: the organic
 * resource-discovery + removal mover (docs/DESIGN_RESOURCE_DYNAMICS.md).
 *
 * The ground gives, and the ground gives out. Roster MEMBERSHIP — which resource
 * nodes a settlement borders — has until now changed ONLY by a DM's hand
 * (ADD/REMOVE/DEPLETE/RECOVER verbs, mutateWorld). This mover closes that gap:
 *
 *   • DISCOVERY (`resource_discovery`): prospecting strikes a NEW node drawn from
 *     the terrain's latent pool — the terrain-legal RESOURCE_DATA keys generation
 *     itself COULD have rolled here, minus the current roster, minus keys already
 *     worked out. A geography-inconsistent draw is STRUCTURALLY impossible, not
 *     rare. §H-loaded (prospecting pressure + boom presence + extraction works),
 *     E0-classed RARE via an accumulator + floor + cooldown (the moral-founding
 *     cadence idiom — a few per campaign-decade, cap-held, deferral-visible).
 *
 *   • REMOVAL (`resource_removal`): a NONRENEWABLE (resourceTaxonomy) that has
 *     DWELLED depleted ≥ REMOVAL_DWELL ticks — the owner's lifecycle verbatim:
 *     "removal should happen after extended periods of depleted state of a
 *     nonrenewable resource." Renewables NEVER organically remove (they ride the
 *     existing resource_recovery path); a worked-out vein does not return.
 *
 * Both kinds ride the EXISTING candidate lane (tierResourceDynamics' shape):
 * authority-routed, rolled through rollCandidates, applied through the ONE writer
 * `applyResourceMembershipOutcomeToSettlement` (below) which does membership +
 * resourceEdits durability + the surgical production reconcile + the typed
 * condition + resourceHistory — the calamityKernel reconcileProductionAfterStrike
 * precedent, run in BOTH directions.
 *
 * CONSTITUTION:
 *   • DORMANCY — gated on the NEW virtual flag `resourceDynamicsEnabled` (ABSENT
 *     from DEFAULT_SIMULATION_RULES). Dark ⇒ early return, zero candidates, zero
 *     new settlementTickStates keys, zero forks — byte-identical (the fenced
 *     dormancy golden proves it). NOT spatial-gated: terrain is config.terrainType
 *     (generation-side, always present), so resource dynamics runs aspatially too.
 *   • FIRST-PAINT — a lazy worldPulse leaf: consumed only by pulseKernel (candidate
 *     lane) + applyWorldPulse (the writer), never the entry closure. ZERO eager (the
 *     conditions are planted fully-specified, no eager catalog templates).
 *   • RNG — stable keyed forks (`resource_discovery:<id>:<tick>`), §H situation-
 *     loaded, order-free (keyed forks never advance the parent); no draw when dark.
 *   • THE FROZEN DIGEST IS UNTOUCHED — endowment lives in config.nearbyResources*,
 *     never the spatial digest.
 */

import { clamp01 } from '../../kernel/math.js';
import { slugify } from '../../kernel/slugify.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { RETIRED_CHAIN_ALIASES } from '../../data/supplyChainResourceIndex.js';
import { getCompatibleResources, getTerrainType } from '../../generators/terrainHelpers.js';
import { computeActiveChains } from '../../generators/computeActiveChains.js';
import { withActiveCondition } from '../activeConditions.js';
import { stablePart } from './worldState.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { classifyResource } from './resourceTaxonomy.js';
import { lifecycleStatusOf } from './settlementLifecycleFirstClass.js';

// ── The loose sim shapes this mover reads (concrete typedefs — no `any`) ────────
/** @typedef {{ get?: (id: string, kind: string) => ({ score?: number } | undefined) }} PressureIdx */
/** @typedef {{ key?: string, custom?: boolean }} ResourceEdit */
/** @typedef {{ added?: ResourceEdit[], removed?: string[], depleted?: string[], recovered?: string[] }} ResourceEdits */
/**
 * @typedef {{ terrainType?: string, tradeRouteAccess?: string, terrainOverride?: (string|null),
 *   magicExists?: boolean, priorityMagic?: number, nearbyResources?: string[],
 *   nearbyResourcesCustom?: string[], nearbyResourcesDepleted?: string[],
 *   nearbyResourcesState?: Record<string, string>, resourceEdits?: ResourceEdits }} RDConfig
 */
/** @typedef {{ archetype?: string }} RDCondition */
/** @typedef {{ id?: unknown, name?: unknown }} RDInstitution */
/** @typedef {{ needKey?: string, chainId?: string, outputs?: unknown[], exportable?: boolean }} RDChain */
/** @typedef {{ activeChains?: RDChain[], primaryExports?: unknown[] }} RDEconomicState */
/**
 * @typedef {{ config?: RDConfig, institutions?: RDInstitution[], activeConditions?: RDCondition[],
 *   tier?: string, tradeRoute?: string, name?: string, economicState?: RDEconomicState,
 *   resourceHistory?: unknown[], _config?: Record<string, unknown> }} RDSettlement
 */
/** @typedef {{ saveId?: unknown, resource?: string, op?: string }} RDMembership */
/** @typedef {{ id?: string, severity?: number, headline?: string, summary?: string, candidateType?: string, resourceMembership?: RDMembership, metadata?: { tick?: number } }} RDOutcome */
/** @typedef {{ id?: unknown, name?: unknown, settlement?: RDSettlement }} RDSnapItem */
/** @typedef {{ settlements?: RDSnapItem[] }} RDSnapshot */
/** @typedef {{ tick?: number, settlementTickStates?: Record<string, Record<string, unknown>>, simulationRules?: Record<string, unknown> }} RDWorldState */
/** @typedef {{ discoveryAcc?: number, lastDiscoveryTick?: number, depletedSince?: Record<string, number>, lastRemovalTick?: number }} RDMeta */
/** @typedef {Record<string, unknown>} RDCandidate */
/** @typedef {{ tick?: number, simulationRules?: Record<string, unknown>, rng?: { fork?: (k: string) => { random: () => number } } }} RDContext */

/**
 * TUNING (owner-adjustable — the MORAL_PRESSURE_TUNING idiom; pins derive from
 * these live values rather than freezing them).
 */
export const RESOURCE_DYNAMICS_TUNING = Object.freeze({
  // ── DISCOVERY: the prospecting integrator ──
  // Per-tick prospecting DRIVE (0..1) is built from a small base + situational
  // load; the accumulator relaxes toward it (DECAY) and climbs (GAIN). Crossing
  // DISCOVERY_FLOOR arms a candidate (subject to the COOLDOWN) — years-scale, so
  // no discovery fires inside a golden's few-tick window even when lit.
  DISCOVERY_BASE_DRIVE: 0.08,          // a slow baseline prospecting pulse
  DISCOVERY_PRESSURE_WEIGHT: 0.55,     // need (food/trade pressure) drives prospecting
  DISCOVERY_BOOM_BONUS: 0.28,          // an active boom = investment looking for veins
  DISCOVERY_EXTRACTION_BONUS: 0.2,     // standing extraction works = prospecting capability
  DISCOVERY_DECAY: 0.86,               // integrator memory
  // GAIN/(1−DECAY)=1.0 is the steady-state multiplier on the drive: a SUSTAINED HIGH
  // drive (real prospecting pressure + a boom or standing extraction works, ~0.83)
  // reaches the 0.7 floor in ~13 ticks, while a moderate drive plateaus BELOW it and
  // never arms. So discovery needs real, sustained cause and NEVER fires inside a
  // golden's few-tick window.
  DISCOVERY_GAIN: 0.14,                // per-tick climb toward the drive (= 1−DECAY)
  DISCOVERY_CAP: 1.0,                  // cap-held (anti-runaway)
  DISCOVERY_FLOOR: 0.7,                // the arming floor
  DISCOVERY_COOLDOWN: 52,              // ticks (weeks) between discoveries at one settlement
  DISCOVERY_EMIT_P: 0.16,              // base emit probability once armed (rollCandidates rolls it)
  // ── REMOVAL: the dwell wall ──
  // A depleted nonrenewable must DWELL depleted this many ticks before its
  // workings organically give out. Integer-tick arithmetic (tick − depletedSince)
  // so the count survives the M10b one-interval catch-up collapse.
  REMOVAL_DWELL: 156,                  // ~3 game-years depleted before the vein is done
  REMOVAL_COOLDOWN: 52,                // ticks between removals at one settlement
  REMOVAL_EMIT_P: 0.12,                // base emit probability once the dwell is met
  // The bounded lifetime of the resource_strike / vein_exhausted conditions (the
  // condition-boundedness pin — a one-time event that fades, never a snowball).
  CONDITION_EXPIRES_TICKS: 10,
});

const RESOURCE_CONDITION_EXPIRES_TICKS = RESOURCE_DYNAMICS_TUNING.CONDITION_EXPIRES_TICKS;

const T = RESOURCE_DYNAMICS_TUNING;

// Extraction-institution signal (prospecting CAPABILITY §H term): a light keyword
// scan — a town that already mines/quarries/digs knows how to prospect. Id/name
// tolerant, lower-cased.
const EXTRACTION_KEYWORDS = ['mine', 'quarry', 'pit', 'prospect', 'smelt', 'forge', 'dig', 'excavat'];

/** RESOURCE_DATA is a fixed object; index it by an arbitrary key through one
 *  `unknown` bridge (never `any`). @param {string} key
 *  @returns {{ category?: string, label?: string } | undefined} */
function resourceMeta(key) {
  return /** @type {Record<string, { category?: string, label?: string }>} */ (
    /** @type {unknown} */ (RESOURCE_DATA))[key];
}

/**
 * @param {PressureIdx} pressureIdx
 * @param {string} settlementId
 * @param {string} kind
 */
function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(settlementId, kind)?.score || 0;
}

/** The resolved trade route for a tick-time settlement (before/after reconcile use
 *  the SAME value, so the exact route never changes the delta — only universal-
 *  resource legality keys off it, terrain-specific keys off config.terrainType).
 *  @param {RDSettlement} settlement @param {RDConfig} config @returns {string} */
function routeOf(settlement, config) {
  return String(settlement?.tradeRoute || config?.tradeRouteAccess || 'road');
}

/** The settlement's terrain type — always present at generation (resolveConfig
 *  stamps config.terrainType); derived from the route as a total fallback.
 *  @param {RDConfig} config @returns {string} */
function terrainOf(config) {
  return String(config?.terrainType
    || getTerrainType(config?.tradeRouteAccess || 'road', config?.terrainOverride || null));
}

/** Slug-equivalence for roster membership (mirrors mutateWorld's slugEq intent —
 *  catalog keys are underscore slugs; we compare lower/underscore-normalized). Uses
 *  the ONE kernel slugify primitive (underscore separator — the engine-id convention).
 *  @param {unknown} value @returns {string} */
function normKey(value) {
  return slugify(value, { sep: '_' });
}

/**
 * THE LATENT POOL — terrain-legal-but-unrolled RESOURCE_DATA keys (design §1).
 * (terrain-compatible RESOURCE_DATA keys) MINUS the current roster MINUS
 * previously-removed keys. Every member is a real RESOURCE_DATA key
 * (getCompatibleResources iterates RESOURCE_DATA), so a discovery is ALWAYS one
 * generation could have rolled here — the impossible-draw pin holds structurally.
 *
 * JUDGMENT (vetoable): the design formula names TERRAIN_DATA.allowedResources ∩
 * compatible keys, but the census proved allowedResources is a display-token
 * vocabulary (English commodity names / a different snake_case dialect) that does
 * NOT map to RESOURCE_DATA keys — intersecting it is degenerate. The compatible
 * set IS generation's own rollable vocabulary (resolveResources' random mode draws
 * from exactly this), so it is the faithful "one generation could have rolled."
 *
 * @param {RDConfig} config @param {RDSettlement} settlement @returns {string[]}
 */
export function latentResourcePool(config, settlement) {
  const terrain = terrainOf(config);
  const route = routeOf(settlement, config);
  const noMagic = config?.magicExists === false;
  // Current roster + custom nodes (never re-mint a node we already hold).
  const held = new Set([
    ...(Array.isArray(config?.nearbyResources) ? config.nearbyResources : []),
    ...(Array.isArray(config?.nearbyResourcesCustom) ? config.nearbyResourcesCustom : []),
  ].map(normKey));
  // Previously-removed keys — a worked-out vein does not return (JUDGMENT, vetoable).
  const removed = new Set(
    (config?.resourceEdits?.removed && Array.isArray(config.resourceEdits.removed) ? config.resourceEdits.removed : [])
      .map(normKey),
  );
  /** @type {string[]} */
  const pool = [];
  for (const entry of getCompatibleResources(route, terrain)) {
    if (!entry.compatible) continue;
    const key = entry.key;
    const meta = resourceMeta(key);
    if (!meta) continue;                                            // known keys only (census hazard)
    if (noMagic && meta.category === 'special' && /magic|arcane|ley|planar/.test(key)) continue; // suppress magical nodes in no-magic worlds
    const nk = normKey(key);
    if (held.has(nk) || removed.has(nk)) continue;
    pool.push(key);
  }
  // CODEPOINT order (device/locale-stable) — this list feeds a seeded index draw.
  return pool.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Is this resource organically REMOVABLE — a nonrenewable/strategic exhaustible
 *  (recoveryMode 'manual')? Renewables (natural) and magicals (requires_high_magic)
 *  never organically remove. @param {string} resource @returns {boolean} */
export function isOrganicallyRemovable(resource) {
  return classifyResource(resource).recoveryMode === 'manual';
}

/** The live depletion state of a roster key (mirrors tierResourceDynamics.resourceState).
 *  @param {RDConfig} config @param {string} resource @returns {boolean} */
function isDepleted(config, resource) {
  const explicit = config?.nearbyResourcesState?.[resource];
  if (explicit) return explicit === 'depleted';
  const set = new Set(Array.isArray(config?.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : []);
  return set.has(resource);
}

/** The prospecting DRIVE (0..1) — the §H load on discovery. @param {RDSettlement} settlement
 *  @param {RDConfig} config @param {PressureIdx} pressureIdx @param {string} cid @returns {number} */
function prospectDrive(settlement, config, pressureIdx, cid) {
  const need = clamp01(pressure(pressureIdx, cid, 'food') * 0.5 + pressure(pressureIdx, cid, 'trade') * 0.5);
  const conds = Array.isArray(settlement?.activeConditions) ? settlement.activeConditions : [];
  const boom = conds.some((c) => c?.archetype === 'boom') ? T.DISCOVERY_BOOM_BONUS : 0;
  const insts = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const hasExtraction = insts.some((i) => {
    const hay = `${i?.id || ''} ${i?.name || ''}`.toLowerCase();
    return EXTRACTION_KEYWORDS.some(kw => hay.includes(kw));
  });
  const extraction = hasExtraction ? T.DISCOVERY_EXTRACTION_BONUS : 0;
  return clamp01(T.DISCOVERY_BASE_DRIVE + need * T.DISCOVERY_PRESSURE_WEIGHT + boom + extraction);
}

/** Relax the discovery integrator toward the drive (cap-held). Exported so pins
 *  derive expectations from the live tuning. @param {number|undefined} prev
 *  @param {number} drive @returns {number} */
export function stepDiscovery(prev, drive) {
  const acc = (Number.isFinite(prev) ? Number(prev) : 0) * T.DISCOVERY_DECAY + drive * T.DISCOVERY_GAIN;
  return Math.min(T.DISCOVERY_CAP, Math.max(0, acc));
}

/**
 * THE ORGANIC MOVER (design §1). Rides the tierResourceDynamics candidate lane:
 * pure over (worldState, snapshot, pressureIdx, forked rng); returns the threaded
 * worldState (accumulator/dwell nested under settlementTickStates[cid].resourceDynamics,
 * byte-neutral when empty — the moral-founding precedent) + the candidates.
 *
 * DORMANCY: `resourceDynamicsEnabled` absent ⇒ early return, worldState UNCHANGED
 * (same reference), zero candidates, zero forks.
 *
 * @param {RDWorldState} worldState
 * @param {RDSnapshot} snapshot
 * @param {PressureIdx} pressureIdx
 * @param {RDContext} [context]
 * @returns {{ worldState: RDWorldState, candidates: RDCandidate[] }}
 */
export function evaluateResourceDynamics(worldState, snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  // THE DORMANCY GATE — virtual flag, absent from DEFAULT_SIMULATION_RULES.
  if (rules.resourceDynamicsEnabled !== true) return { worldState, candidates: [] };

  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  const rng = context.rng && typeof context.rng.fork === 'function' ? context.rng : null;
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  /** @type {RDCandidate[]} */
  const candidates = [];

  for (const item of snapshot?.settlements || []) {
    const settlement = item.settlement || {};
    if (lifecycleStatusOf(settlement)) continue; // MOVERS SKIP REMNANTS (r2 economy-upswing-1): no discovery/depletion on a corpse
    const config = settlement.config || {};
    const cid = String(item.id ?? '');
    const name = String(item.name || settlement.name || cid);
    const prev = /** @type {RDMeta | null} */ (settlementTickStates[cid]?.resourceDynamics || null);

    // ── DISCOVERY integrator ──────────────────────────────────────────────────
    const pool = latentResourcePool(config, settlement);
    const drive = pool.length ? prospectDrive(settlement, config, pressureIdx, cid) : 0;
    const nextAcc = pool.length ? stepDiscovery(prev?.discoveryAcc, drive) : 0;
    const lastDiscoveryTick = Number.isFinite(prev?.lastDiscoveryTick) ? Number(prev?.lastDiscoveryTick) : null;
    let nextLastDiscoveryTick = lastDiscoveryTick;
    const discoveryCooled = lastDiscoveryTick == null || (tick - lastDiscoveryTick) >= T.DISCOVERY_COOLDOWN;
    if (pool.length && nextAcc >= T.DISCOVERY_FLOOR && discoveryCooled) {
      // Pick the struck node from a STABLE keyed fork — §H situation-loaded, order-free.
      const forked = rng?.fork?.(`resource_discovery:${cid}:${tick}`);
      const r = typeof forked?.random === 'function' ? forked.random() : 0;
      const resource = pool[Math.min(pool.length - 1, Math.floor(r * pool.length))];
      const taxonomy = classifyResource(resource);
      const label = String(resourceMeta(resource)?.label || resource.replace(/_/g, ' '));
      nextLastDiscoveryTick = tick;
      candidates.push({
        id: `candidate.resource.discover.${stablePart(cid)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_discovery',
        ruleId: 'resource_discovery',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity: clamp01(0.3 + nextAcc * 0.35),
        probability: clamp01(T.DISCOVERY_EMIT_P + nextAcc * 0.22),
        applyMode: authorityFor(rules, 'resource_discovery', 'auto'),
        headline: `${label} discovered near ${name}`,
        summary: `Prospecting near ${name} has struck ${label.toLowerCase()} — a new resource for the local economy.`,
        reasons: [
          `Sustained prospecting pressure has built to ${Math.round(nextAcc * 100)}% (an arc, not a decree).`,
          `${label} is terrain-legal here — the ground could always have held it.`,
          `Resource class: ${taxonomy.kind}.`,
        ],
        resourceMembership: { saveId: item.id, resource, op: 'add' },
        metadata: { resource, op: 'add', resourceTaxonomy: taxonomy },
        conflictTags: [`resource:${cid}:${resource}`],
      });
    }

    // ── REMOVAL dwell (nonrenewable, depleted ≥ REMOVAL_DWELL ticks) ───────────
    const roster = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
    const prevDepletedSince = (prev && prev.depletedSince && typeof prev.depletedSince === 'object')
      ? prev.depletedSince : {};
    /** @type {Record<string, number>} */
    const nextDepletedSince = {};
    const lastRemovalTick = Number.isFinite(prev?.lastRemovalTick) ? Number(prev?.lastRemovalTick) : null;
    let nextLastRemovalTick = lastRemovalTick;
    const removalCooled = lastRemovalTick == null || (tick - lastRemovalTick) >= T.REMOVAL_COOLDOWN;
    /** @type {{ resource: string, dwell: number }|null} */
    let removalTarget = null;
    for (const resource of roster) {
      if (!isOrganicallyRemovable(resource)) continue;      // renewables/magicals never organically remove
      if (!isDepleted(config, resource)) continue;          // must be currently depleted
      // Stamp the tick this nonrenewable entered its depleted dwell (integer-tick
      // arithmetic; survives the catch-up collapse — the stamp is set once, the
      // subtraction reads the current tick).
      const since = Number.isFinite(prevDepletedSince[resource]) ? Number(prevDepletedSince[resource]) : tick;
      nextDepletedSince[resource] = since;
      const dwell = tick - since;
      if (dwell >= T.REMOVAL_DWELL && (!removalTarget || dwell > removalTarget.dwell)) {
        removalTarget = { resource, dwell };
      }
    }
    if (removalTarget && removalCooled) {
      const { resource, dwell } = removalTarget;
      const taxonomy = classifyResource(resource);
      const label = String(resourceMeta(resource)?.label || resource.replace(/_/g, ' '));
      // §H: longer dwell ⇒ heavier (a vein depleted for a decade is truly done).
      const severity = clamp01(0.45 + Math.min(1, (dwell - T.REMOVAL_DWELL) / (T.REMOVAL_DWELL * 2)) * 0.4);
      nextLastRemovalTick = tick;
      candidates.push({
        id: `candidate.resource.remove.${stablePart(cid)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_removal',
        ruleId: 'resource_removal',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
        probability: clamp01(T.REMOVAL_EMIT_P + severity * 0.28),
        applyMode: authorityFor(rules, 'resource_removal', 'auto'),
        headline: `${label}'s workings near ${name} have given out`,
        summary: `The ${label.toLowerCase()} near ${name} has been worked out — after long depletion the vein is done.`,
        reasons: [
          `${label} has dwelled depleted for ${dwell} ticks (≥ ${T.REMOVAL_DWELL}).`,
          `A nonrenewable resource (${taxonomy.kind}) does not recover once truly exhausted.`,
        ],
        resourceMembership: { saveId: item.id, resource, op: 'remove' },
        metadata: { resource, op: 'remove', dwell, resourceTaxonomy: taxonomy },
        conflictTags: [`resource:${cid}:${resource}`],
      });
    }

    // ── CONDITIONAL materialization (byte-neutral when nothing is tracked) ─────
    // Only write resourceDynamics when the integrator is climbing, a dwell is
    // being tracked, or a cooldown is live — else drop the sub-key (the
    // moral-founding precedent). Keeps a quiescent world's settlementTickStates
    // free of a resourceDynamics key.
    const hasState = nextAcc > 0.001
      || Object.keys(nextDepletedSince).length > 0
      || nextLastDiscoveryTick != null
      || nextLastRemovalTick != null;
    if (hasState) {
      /** @type {RDMeta} */
      const meta = {};
      if (nextAcc > 0.001) meta.discoveryAcc = nextAcc;
      if (nextLastDiscoveryTick != null) meta.lastDiscoveryTick = nextLastDiscoveryTick;
      if (Object.keys(nextDepletedSince).length > 0) meta.depletedSince = nextDepletedSince;
      if (nextLastRemovalTick != null) meta.lastRemovalTick = nextLastRemovalTick;
      settlementTickStates[cid] = { ...(settlementTickStates[cid] || {}), resourceDynamics: meta };
    } else if (prev && settlementTickStates[cid]) {
      const rest = { ...settlementTickStates[cid] };
      delete rest.resourceDynamics;
      settlementTickStates[cid] = rest;
    }
  }

  return { worldState: { ...worldState, settlementTickStates }, candidates };
}

// ════════════════════════════════════════════════════════════════════════════
// THE APPLICATION WRITE (design §2) — one writer, every lifecycle path.
// ════════════════════════════════════════════════════════════════════════════

/** Normalized resourceEdits view (mirrors mutateWorld.resourceEditsOf).
 *  @param {RDConfig} config
 *  @returns {{ added: ResourceEdit[], removed: string[], depleted: string[], recovered: string[] }} */
function editsOf(config) {
  const re = config?.resourceEdits || {};
  return {
    added: Array.isArray(re.added) ? re.added : [],
    removed: Array.isArray(re.removed) ? re.removed : [],
    depleted: Array.isArray(re.depleted) ? re.depleted : [],
    recovered: Array.isArray(re.recovered) ? re.recovered : [],
  };
}

/**
 * THE SURGICAL RECONCILE (design §2c) — the calamityKernel reconcileProductionAfterStrike
 * precedent, run in BOTH directions. Recompute the active-chain SET over the old vs
 * the new roster (identical institutions/tier/route/magic — only the resource roster
 * differs, so the DELTA isolates exactly the resource change; reuses the canonical
 * activation logic, no fork/drift), then surgically MERGE the delta into the stamped
 * economicState.activeChains + primaryExports so commodity-flow production sees the
 * change NEXT TICK. Discovery ⇒ a chain activates + its exportable outputs join
 * primaryExports; removal ⇒ the chain deactivates + its now-unproduced outputs are
 * pruned (the calamity export-prune logic). Pure over economicState.
 *
 * @param {RDEconomicState | null | undefined} economicState
 * @param {{ settlement: RDSettlement, oldResources: string[], newResources: string[], oldDepleted: string[], newDepleted: string[] }} ctx
 * @returns {RDEconomicState}
 */
export function reconcileProductionAfterResourceChange(economicState, ctx) {
  if (!economicState || typeof economicState !== 'object') return economicState || {};
  const { settlement, oldResources, newResources, oldDepleted, newDepleted } = ctx;
  const config = settlement?.config || {};
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const tier = String(settlement?.tier || 'village');
  const route = routeOf(settlement, config);
  const magic = config.magicExists === false ? 0 : (Number.isFinite(config.priorityMagic) ? Number(config.priorityMagic) : 50);
  // tradeDependencies=[] — it only ENRICHES chain status, never which chains are
  // active, so the active-chain SET (and thus the delta) is independent of it.
  const before = /** @type {RDChain[]} */ (/** @type {unknown} */ (computeActiveChains(institutions, oldResources, tier, route, [], oldDepleted, magic)));
  const after = /** @type {RDChain[]} */ (/** @type {unknown} */ (computeActiveChains(institutions, newResources, tier, route, [], newDepleted, magic)));
  /** @param {RDChain} c */
  const cidOf = (c) => `${c.needKey}.${c.chainId}`;
  const beforeIds = new Set(before.map(cidOf));
  const afterIds = new Set(after.map(cidOf));
  const addedChains = after.filter((c) => !beforeIds.has(cidOf(c)));
  const removedIds = new Set(before.filter((c) => !afterIds.has(cidOf(c))).map(cidOf));
  if (!addedChains.length && !removedIds.size) return economicState;

  // Merge the DELTA into the STAMPED chains (surgical, never a wholesale replace).
  const stamped = Array.isArray(economicState.activeChains) ? economicState.activeChains : [];
  const survivingChains = stamped.filter((c) => !removedIds.has(`${c.needKey}.${c.chainId}`));
  const survivingIds = new Set(survivingChains.map((c) => `${c.needKey}.${c.chainId}`));
  let mergedChains = [...survivingChains, ...addedChains.filter((c) => !survivingIds.has(cidOf(c)))];

  // [data-tables-3] Prune retired-alias chains a pre-fix save stamped (e.g. the thin
  // 'food_security.fish' beside its 'food_security.fishing' successor). The catalog
  // no longer produces the retired id, so it appears in neither before/after and the
  // surgical filter above can't reach it. Drop it when its canonical successor is
  // present (dedup the duplicate industry) OR was just removed (co-remove the orphan
  // so a fishing_grounds removal doesn't leave 'fish' still exporting Preserved
  // foods) — but keep a lone legacy chain whose successor is genuinely absent, so no
  // live industry is silently lost. No-op for saves with no retired-alias chain.
  {
    const mergedIds = new Set(mergedChains.map((c) => `${c.needKey}.${c.chainId}`));
    mergedChains = mergedChains.filter((c) => {
      const canonical = RETIRED_CHAIN_ALIASES[`${c.needKey}.${c.chainId}`];
      if (!canonical) return true;
      return !(mergedIds.has(canonical) || removedIds.has(canonical));
    });
  }

  // Exports: prune the outputs a removed chain no longer produces (the calamity
  // precedent), then add the exportable outputs of newly-active chains.
  /** @type {Set<string>} */
  const brokenOutputs = new Set();
  for (const c of before) if (removedIds.has(cidOf(c))) for (const o of (Array.isArray(c.outputs) ? c.outputs : [])) brokenOutputs.add(String(o).toLowerCase());
  /** @type {Set<string>} */
  const stillProduced = new Set();
  for (const c of mergedChains) for (const o of (Array.isArray(c.outputs) ? c.outputs : [])) stillProduced.add(String(o).toLowerCase());
  const exports = Array.isArray(economicState.primaryExports) ? economicState.primaryExports : [];
  const nextExports = exports.filter((exp) => {
    const e = String(exp).toLowerCase();
    const lost = [...brokenOutputs].some((o) => e.includes(o) || o.includes(e));
    const kept = [...stillProduced].some((o) => e.includes(o) || o.includes(e));
    return !(lost && !kept);
  });
  for (const c of addedChains) {
    if (!c.exportable) continue;
    for (const o of (Array.isArray(c.outputs) ? c.outputs : [])) {
      const label = String(o);
      const lower = label.toLowerCase();
      if (!nextExports.some((e) => String(e).toLowerCase().includes(lower) || lower.includes(String(e).toLowerCase()))) {
        nextExports.push(label);
      }
    }
  }
  return { ...economicState, activeChains: mergedChains, primaryExports: nextExports };
}

/**
 * THE ONE WRITER (design §2) — applies a resource_discovery / resource_removal
 * outcome atomically: (a) membership on config.nearbyResources* ; (b) durability
 * via the config.resourceEdits delta, DUAL-WRITTEN config + _config (the mutateWorld
 * withResourceEdits precedent — so an organic change survives full regeneration
 * exactly as a DM ADD/REMOVE does); (c) the surgical production reconcile; (d)
 * resourceHistory; (e) the typed condition (resource_strike / vein_exhausted). News
 * rides the candidate's own headline/summary through the standard apply path.
 * FORCE ≡ ORGANIC: a DM ADD/REMOVE verb leaves membership + resourceEdits + reconcile;
 * this adds the condition + resourceHistory on the SAME downstream shape.
 *
 * @param {RDSettlement} settlement @param {RDOutcome} outcome @returns {RDSettlement}
 */
export function applyResourceMembershipOutcomeToSettlement(settlement, outcome) {
  const mem = outcome?.resourceMembership;
  if (!settlement || !mem || !mem.resource) return settlement;
  const resource = String(mem.resource);
  const op = mem.op === 'remove' ? 'remove' : 'add';
  const nk = normKey(resource);
  const config = settlement.config || {};

  // ── (a) MEMBERSHIP ──
  const oldResources = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
  const oldDepleted = Array.isArray(config.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : [];
  const oldCustom = Array.isArray(config.nearbyResourcesCustom) ? config.nearbyResourcesCustom : [];
  const stateMap = { ...(config.nearbyResourcesState || {}) };
  /** @type {string[]} */ let newResources;
  /** @type {string[]} */ let newDepleted;
  /** @type {string[]} */ let newCustom;
  if (op === 'add') {
    newResources = oldResources.some((k) => normKey(k) === nk) ? oldResources : [...oldResources, resource];
    stateMap[resource] = 'abundant';                                   // a fresh strike is abundant
    newDepleted = oldDepleted.filter((k) => normKey(k) !== nk);
    newCustom = oldCustom;                                             // organic draws are catalog keys, never custom
  } else {
    newResources = oldResources.filter((k) => normKey(k) !== nk);
    for (const k of Object.keys(stateMap)) if (normKey(k) === nk) delete stateMap[k];
    newDepleted = oldDepleted.filter((k) => normKey(k) !== nk);
    newCustom = oldCustom.filter((k) => normKey(k) !== nk);
  }

  // ── (b) DURABILITY — the resourceEdits delta (regen-surviving), dual-written ──
  const edits = editsOf(config);
  const nextEdits = op === 'add'
    ? {
        ...edits,
        // { key, custom:false } — the mutateWorld addResource shape (organic ≡ forced;
        // an organic draw is always a catalog key, never a custom mint).
        added: edits.added.some((e) => normKey(e?.key) === nk) ? edits.added : [...edits.added, { key: resource, custom: false }],
        removed: edits.removed.filter((k) => normKey(k) !== nk),
        depleted: edits.depleted.filter((k) => normKey(k) !== nk),
      }
    : {
        ...edits,
        removed: edits.removed.some((k) => normKey(k) === nk) ? edits.removed : [...edits.removed, resource],
        added: edits.added.filter((e) => normKey(e?.key) !== nk),
        depleted: edits.depleted.filter((k) => normKey(k) !== nk),
        recovered: edits.recovered.filter((k) => normKey(k) !== nk),
      };

  const nextConfig = {
    ...config,
    nearbyResources: newResources,
    nearbyResourcesState: stateMap,
    nearbyResourcesDepleted: newDepleted,
    nearbyResourcesCustom: newCustom,
    resourceEdits: nextEdits,
  };

  // ── (c) SURGICAL RECONCILE (both directions) ──
  const nextEconomicState = reconcileProductionAfterResourceChange(settlement.economicState, {
    settlement: { ...settlement, config: nextConfig },
    oldResources, newResources, oldDepleted, newDepleted,
  });

  /** @type {RDSettlement} */
  let next = { ...settlement, config: nextConfig, economicState: nextEconomicState };
  // Dual-write the delta into the raw _config (withResourceEdits precedent —
  // applyChange regenerates from _config first).
  if (settlement._config && typeof settlement._config === 'object') {
    next._config = { ...settlement._config, resourceEdits: nextEdits };
  }

  // ── (d) resourceHistory (capped, like applyResourceOutcomeToSettlement) ──
  next.resourceHistory = [
    ...(Array.isArray(settlement.resourceHistory) ? settlement.resourceHistory.slice(-11) : []),
    { resource, state: op === 'add' ? 'discovered' : 'removed', outcomeId: outcome.id, reason: outcome.headline || outcome.candidateType },
  ];

  // ── (e) THE TYPED CONDITION (the W-UPSWING B2 + economic_capacity seam) ──
  // Planted FULLY SPECIFIED (no catalog template — zero eager bytes; see the
  // activeConditions.js note): explicit BOUNDED duration closes the :714 immortal
  // hazard at the plant site (guard-pinned), explicit affectedSystems set the causal
  // polarity. resource_strike is a bounded positive MARKER (affectedSystems [] — its
  // upside flows through the boom seam + reconcile, not a free condition bonus);
  // vein_exhausted DRAINS economic_capacity (a worked-out vein hurts the economy).
  const condTick = Number.isFinite(outcome?.metadata?.tick) ? Number(outcome?.metadata?.tick) : undefined;
  next = op === 'add'
    ? withActiveCondition(next, {
        id: `condition.resource_strike.${nk}`,
        archetype: 'resource_strike',
        label: 'Resource strike',
        description: 'Prospecting has struck a new resource.',
        severity: clamp01(0.3 + (Number(outcome.severity) || 0) * 0.3),
        status: 'easing',
        affectedSystems: [],
        duration: { elapsedTicks: 0, expiresAtTicks: RESOURCE_CONDITION_EXPIRES_TICKS },
        triggeredAt: { tick: condTick, sourceEventType: 'RESOURCE_DISCOVERY', sourceEventTargetId: resource },
        causes: [{ source: 'world_pulse', detail: outcome.summary || 'A new resource has been struck.' }],
      })
    : withActiveCondition(next, {
        id: `condition.vein_exhausted.${nk}`,
        archetype: 'vein_exhausted',
        label: 'Vein exhausted',
        description: 'A resource has been worked out — the vein is done.',
        severity: clamp01(0.35 + (Number(outcome.severity) || 0) * 0.3),
        status: 'easing',
        affectedSystems: ['economic_capacity', 'trade_connectivity'],
        duration: { elapsedTicks: 0, expiresAtTicks: RESOURCE_CONDITION_EXPIRES_TICKS },
        triggeredAt: { tick: condTick, sourceEventType: 'RESOURCE_REMOVAL', sourceEventTargetId: resource },
        causes: [{ source: 'world_pulse', detail: outcome.summary || 'A resource has been worked out.' }],
      });

  return next;
}
