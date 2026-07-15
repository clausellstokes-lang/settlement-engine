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
 *     lane) + applyWorldPulse (the writer), never the entry closure. The two eager
 *     costs are the condition catalog templates (activeConditions.js) and the
 *     resource_strike LIFT registration (archetypeCatalog.js) — the :714 hazard
 *     requires a catalog entry or a promoted condition is IMMORTAL.
 *   • RNG — stable keyed forks (`resource_discovery:<id>:<tick>`), §H situation-
 *     loaded, order-free (keyed forks never advance the parent); no draw when dark.
 *   • THE FROZEN DIGEST IS UNTOUCHED — endowment lives in config.nearbyResources*,
 *     never the spatial digest.
 */

import { clamp01 } from '../../kernel/math.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { getCompatibleResources, getTerrainType } from '../../generators/terrainHelpers.js';
import { stablePart } from './worldState.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { classifyResource } from './resourceTaxonomy.js';

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
});

const T = RESOURCE_DYNAMICS_TUNING;

// Extraction-institution signal (prospecting CAPABILITY §H term): a light keyword
// scan — a town that already mines/quarries/digs knows how to prospect. Id/name
// tolerant, lower-cased.
const EXTRACTION_KEYWORDS = ['mine', 'quarry', 'pit', 'prospect', 'smelt', 'forge', 'dig', 'excavat'];

/**
 * @param {any} pressureIdx
 * @param {any} settlementId
 * @param {string} kind
 */
function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(settlementId, kind)?.score || 0;
}

/** The resolved trade route for a tick-time settlement (before/after reconcile use
 *  the SAME value, so the exact route never changes the delta — only universal-
 *  resource legality keys off it, terrain-specific keys off config.terrainType).
 *  @param {any} settlement @param {any} config @returns {string} */
function routeOf(settlement, config) {
  return String(settlement?.tradeRoute || config?.tradeRouteAccess || 'road');
}

/** The settlement's terrain type — always present at generation (resolveConfig
 *  stamps config.terrainType); derived from the route as a total fallback.
 *  @param {any} config @returns {string} */
function terrainOf(config) {
  return String(config?.terrainType
    || getTerrainType(config?.tradeRouteAccess || 'road', config?.terrainOverride || null));
}

/** Slug-equivalence for roster membership (mirrors mutateWorld's slugEq intent —
 *  catalog keys are underscore slugs; we compare lower/underscore-normalized).
 *  @param {any} value @returns {string} */
function normKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
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
 * @param {any} config @param {any} settlement @returns {string[]}
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
  const pool = [];
  for (const entry of getCompatibleResources(route, /** @type {any} */ (terrain))) {
    if (!entry.compatible) continue;
    const key = entry.key;
    if (!(/** @type {any} */ (RESOURCE_DATA)[key])) continue;     // known keys only (census hazard)
    if (noMagic && (/** @type {any} */ (RESOURCE_DATA)[key])?.category === 'special'
      && /magic|arcane|ley|planar/.test(key)) continue;          // suppress magical nodes in no-magic worlds
    const nk = normKey(key);
    if (held.has(nk) || removed.has(nk)) continue;
    pool.push(key);
  }
  // CODEPOINT order (device/locale-stable) — this list feeds a seeded index draw.
  return pool.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Is this resource organically REMOVABLE — a nonrenewable/strategic exhaustible
 *  (recoveryMode 'manual')? Renewables (natural) and magicals (requires_high_magic)
 *  never organically remove. @param {any} resource @returns {boolean} */
export function isOrganicallyRemovable(resource) {
  return classifyResource(resource).recoveryMode === 'manual';
}

/** The live depletion state of a roster key (mirrors tierResourceDynamics.resourceState).
 *  @param {any} config @param {any} resource @returns {boolean} */
function isDepleted(config, resource) {
  const explicit = config?.nearbyResourcesState?.[resource];
  if (explicit) return explicit === 'depleted';
  const set = new Set(Array.isArray(config?.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : []);
  return set.has(resource);
}

/** The prospecting DRIVE (0..1) — the §H load on discovery. @param {any} settlement
 *  @param {any} config @param {any} pressureIdx @param {string} cid @returns {number} */
function prospectDrive(settlement, config, pressureIdx, cid) {
  const need = clamp01(pressure(pressureIdx, cid, 'food') * 0.5 + pressure(pressureIdx, cid, 'trade') * 0.5);
  const conds = Array.isArray(settlement?.activeConditions) ? settlement.activeConditions : [];
  const boom = conds.some((/** @type {any} */ c) => c?.archetype === 'boom') ? T.DISCOVERY_BOOM_BONUS : 0;
  const insts = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const hasExtraction = insts.some((/** @type {any} */ i) => {
    const hay = `${i?.id || ''} ${i?.name || ''}`.toLowerCase();
    return EXTRACTION_KEYWORDS.some(kw => hay.includes(kw));
  });
  const extraction = hasExtraction ? T.DISCOVERY_EXTRACTION_BONUS : 0;
  return clamp01(T.DISCOVERY_BASE_DRIVE + need * T.DISCOVERY_PRESSURE_WEIGHT + boom + extraction);
}

/** Relax the discovery integrator toward the drive (cap-held). Exported so pins
 *  derive expectations from the live tuning. @param {number} prev
 *  @param {number} drive @returns {number} */
export function stepDiscovery(prev, drive) {
  const acc = (Number.isFinite(prev) ? prev : 0) * T.DISCOVERY_DECAY + drive * T.DISCOVERY_GAIN;
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
 * @param {any} worldState
 * @param {any} snapshot
 * @param {any} pressureIdx
 * @param {{ tick?: number, simulationRules?: any, rng?: { fork?: (k: string) => { random: () => number } } }} [context]
 * @returns {{ worldState: any, candidates: any[] }}
 */
export function evaluateResourceDynamics(worldState, snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  // THE DORMANCY GATE — virtual flag, absent from DEFAULT_SIMULATION_RULES.
  if (rules.resourceDynamicsEnabled !== true) return { worldState, candidates: [] };

  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  const rng = context.rng && typeof context.rng.fork === 'function' ? context.rng : null;
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  /** @type {any[]} */
  const candidates = [];

  for (const item of snapshot?.settlements || []) {
    const settlement = item.settlement || {};
    const config = settlement.config || {};
    const cid = String(item.id ?? '');
    const name = String(item.name || settlement.name || cid);
    const prev = settlementTickStates[cid]?.resourceDynamics || null;

    // ── DISCOVERY integrator ──────────────────────────────────────────────────
    const pool = latentResourcePool(config, settlement);
    const drive = pool.length ? prospectDrive(settlement, config, pressureIdx, cid) : 0;
    const nextAcc = pool.length ? stepDiscovery(prev?.discoveryAcc, drive) : 0;
    const lastDiscoveryTick = Number.isFinite(prev?.lastDiscoveryTick) ? Number(prev.lastDiscoveryTick) : null;
    let nextLastDiscoveryTick = lastDiscoveryTick;
    const discoveryCooled = lastDiscoveryTick == null || (tick - lastDiscoveryTick) >= T.DISCOVERY_COOLDOWN;
    if (pool.length && nextAcc >= T.DISCOVERY_FLOOR && discoveryCooled) {
      // Pick the struck node from a STABLE keyed fork — §H situation-loaded, order-free.
      const forked = rng?.fork?.(`resource_discovery:${cid}:${tick}`);
      const r = typeof forked?.random === 'function' ? forked.random() : 0;
      const resource = pool[Math.min(pool.length - 1, Math.floor(r * pool.length))];
      const taxonomy = classifyResource(resource);
      const severity = clamp01(0.3 + nextAcc * 0.35);
      const label = String(RESOURCE_DATA[/** @type {keyof typeof RESOURCE_DATA} */ (resource)]?.label
        || resource.replace(/_/g, ' '));
      nextLastDiscoveryTick = tick;
      candidates.push({
        id: `candidate.resource.discover.${stablePart(cid)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_discovery',
        ruleId: 'resource_discovery',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
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
    const lastRemovalTick = Number.isFinite(prev?.lastRemovalTick) ? Number(prev.lastRemovalTick) : null;
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
      const label = String(RESOURCE_DATA[/** @type {keyof typeof RESOURCE_DATA} */ (resource)]?.label
        || resource.replace(/_/g, ' '));
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
      /** @type {any} */
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
