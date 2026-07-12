/**
 * supplyKernel.js — the M2 CARAVANS kernel adapter (Phase 5.5 mover wave M2).
 *
 * The pure supply engine (spatial/supplyShipments.js) owns the mechanics; THIS
 * module is the thin kernel-side adapter that supplies the LIVE reads the engine
 * needs and writes its outcomes back onto the world:
 *
 *   • the PRODUCER INDEX (input good → the settlements that export it), and the
 *     per-settlement CONSUMING LINKS (each imported non-food good → its consuming
 *     institution + the pre-ranked reachable producers);
 *   • the live SEVERANCE / HOSTILITY predicates (a besieged producer's output is
 *     cut; a gate at war with the destination intercepts the caravan);
 *   • the write-back: the per-input stockpile BUFFERS on economicState (the
 *     foodStockpile generalization — iron/timber/…), the SUPPLY-STARVED impairment
 *     stamped/lifted on the consuming institution, and the AGGREGATE shipment ledger
 *     on worldState.
 *
 * FOOD is deliberately EXCLUDED (category 'food'): foodStockpile remains the
 * food-specific buffer, so food is never double-counted here (§II.3-4-g). Services
 * are excluded too (nothing to ship).
 *
 * DORMANT (constitutional): the whole pass is a no-op without the spatial-canon
 * marker (supplyActive false) OR when a world has no cross-settlement non-food
 * supply links — so an aspatial world, AND a spatial world whose only inter-
 * settlement trade is food, both stay BYTE-IDENTICAL (no ledger, no buffers, no
 * impairment). Pure + deterministic; the caller threads the tick + the pulse rng.
 */

import { canonExports, canonImports } from '../canonicalAccessors.js';
import { normalizeGood } from '../region/goodsCatalog.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { withImpairment, withoutEventImpairments } from '../entities/status.js';
import {
  advanceSupplyShipments, supplyActive, rankSupplySources, linkKey,
  SUPPLY_STARVED_IMPAIRMENT, SUPPLY_STARVED_CAUSE_PREFIX, SUPPLY_TUNING,
} from '../spatial/supplyShipments.js';

// ── Local read-shapes (0-hole discipline: no `any`) ───────────────────────────
/** @typedef {ReturnType<typeof normalizeGood>} CatalogGood */
/** @typedef {{ name?: string, status?: string, impairments?: import('../entities/status.js').Impairment[] }} SupplyInstitution */
/** @typedef {{ resource?: import('../region/goodsCatalog.js').GoodInput,
 *   dependency?: { resource?: import('../region/goodsCatalog.js').GoodInput, institution?: string },
 *   processingInstitutions?: string[] }} SupplyChain */
/** @typedef {{ name?: string, institutions?: SupplyInstitution[],
 *   economicState?: { activeChains?: SupplyChain[], inputStockpiles?: Record<string, number>,
 *     primaryExports?: unknown, primaryImports?: unknown, exports?: unknown, imports?: unknown } }} SupplySettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: SupplySettlement }} SupplySnapItem */
/** @typedef {{ settlements?: SupplySnapItem[] }} SupplySnapshot */
/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('../spatial/supplyShipments.js').SupplyLink} SupplyLink */

// Categories that never route as a shippable INPUT here: 'food' (foodStockpile owns
// it — no double-count) and 'service'/'transport' (not a physical good to ship).
const NON_SHIPPED_CATEGORIES = new Set(['food', 'service', 'transport']);
// A good at or above this catalog criticality is a CRITICAL input — the ≥2-source
// co-built brake applies (a fragile critical input is flagged, never starved).
const CRITICAL_CRITICALITY = 0.5;
// The caravan dispatcher's danger-reading fidelity (chooseRoute risk tolerance). A
// moderate value: caravans mostly avoid embattled ground but will run a cheap risky
// road when the safe detour is far dearer. (M1's war movers derive this from W0
// alignment; a merchant caravan uses this steady default.)
const SUPPLY_RISK_TOLERANCE = 0.6;

/** @param {NonNullable<CatalogGood>} good @returns {boolean} */
function isShippableInput(good) {
  return good.kind === 'good' && !NON_SHIPPED_CATEGORIES.has(String(good.category));
}

/**
 * Producer index: canonical input good id → the settlement ids that EXPORT it
 * (codepoint-sorted). A pure scan of the pre-tick snapshot; producer exports are
 * stable within a tick, so reading the pre-tick roster is sound.
 * @param {SupplySnapshot} snapshot
 * @returns {Map<string, string[]>}
 */
export function buildProducerIndex(snapshot) {
  /** @type {Map<string, string[]>} */
  const producers = new Map();
  for (const item of snapshot?.settlements || []) {
    const id = String(item.id);
    for (const label of canonExports(item.settlement) || []) {
      const g = normalizeGood(/** @type {import('../region/goodsCatalog.js').GoodInput} */ (label));
      if (!g || !isShippableInput(g)) continue;
      const list = producers.get(g.id) || (producers.set(g.id, []), producers.get(g.id));
      if (list && !list.includes(id)) list.push(id);
    }
  }
  for (const list of producers.values()) list.sort();
  return producers;
}

/**
 * Resolve the real consuming INSTITUTION for an imported good — the institution the
 * SUPPLY-STARVED impairment lands on. Matches an active chain that consumes the good
 * (its `resource` / `dependency.resource`) to a real institution by name. Returns
 * the institution NAME, or null when no real institution processes it (the ledger
 * still tracks the link; there is just no institution to impair).
 * @param {SupplySettlement} settlement @param {string} goodId
 * @returns {string|null}
 */
export function resolveConsumingInstitution(settlement, goodId) {
  const chains = settlement?.economicState?.activeChains || [];
  const institutions = settlement?.institutions || [];
  for (const chain of chains) {
    const rid = normalizeGood(chain?.resource)?.id;
    const did = normalizeGood(chain?.dependency?.resource)?.id;
    if (rid !== goodId && did !== goodId) continue;
    const processor = String((chain?.processingInstitutions || [])[0] || chain?.dependency?.institution || '');
    if (!processor) continue;
    const needle = processor.toLowerCase();
    const match = institutions.find((/** @type {SupplyInstitution} */ inst) => {
      const n = String(inst?.name || '').toLowerCase();
      return n === needle || n.includes(needle) || needle.includes(n);
    });
    if (match) return String(match.name);
  }
  return null;
}

/**
 * Derive the active CONSUMING LINKS for one settlement: each imported shippable good
 * that some OTHER mapped settlement produces, with the K cheapest reachable producers
 * pre-ranked from the frozen digest (§II.4) and the per-input buffer read from
 * economicState.inputStockpiles (the foodStockpile generalization).
 * @param {SupplySettlement} settlement @param {string} settlementId
 * @param {Map<string, string[]>} producers @param {SpatialDigest} digest
 * @returns {SupplyLink[]}
 */
export function deriveConsumingLinks(settlement, settlementId, producers, digest) {
  const stock = settlement?.economicState?.inputStockpiles || {};
  /** @type {SupplyLink[]} */
  const links = [];
  const seen = new Set();
  for (const label of canonImports(settlement) || []) {
    const g = normalizeGood(/** @type {import('../region/goodsCatalog.js').GoodInput} */ (label));
    if (!g || !isShippableInput(g) || seen.has(g.id)) continue;
    seen.add(g.id);
    const producerIds = (producers.get(g.id) || []).filter((pid) => pid !== settlementId);
    if (!producerIds.length) continue; // nobody else produces it → local/self-sufficient
    const rankedSources = rankSupplySources(digest, settlementId, producerIds);
    if (!rankedSources.length) continue; // no reachable producer over the frozen geometry
    const institutionName = resolveConsumingInstitution(settlement, g.id);
    links.push({
      institutionId: institutionName || `${g.id}`,
      institutionName: institutionName || g.label || g.id,
      settlementId,
      input: g.id,
      rankedSources,
      bufferWeeks: Number.isFinite(stock[g.id]) ? stock[g.id] : SUPPLY_TUNING.BUFFER_WEEKS,
      critical: (g.criticality ?? 0) >= CRITICAL_CRITICALITY,
    });
  }
  return links;
}

/** Is `gateId` at war with `destId`? (a live front either direction ⇒ the gate
 *  intercepts caravans bound for the destination). @param {unknown} graph
 *  @param {string} gateId @param {string} destId @returns {boolean} */
function atWar(graph, gateId, destId) {
  const g = String(gateId);
  const d = String(destId);
  if (warFrontsInto(graph, d).includes(g)) return true;
  if (warFrontsFrom(graph, d).includes(g)) return true;
  return false;
}

/**
 * Advance the settlement-supply layer one tick: derive links, advance the shipment
 * ledger, and write the buffers + SUPPLY-STARVED impairments back onto the settlements
 * (via `localSettlements`) and the ledger onto worldState. DORMANT ⇒ { worldState,
 * changed:false } with nothing touched.
 * @param {Object} args
 * @param {SupplySnapshot} args.snapshot
 * @param {Map<string, SupplySettlement>} args.localSettlements   the mutable settlement map (written back)
 * @param {Record<string, unknown>} args.worldState
 * @param {unknown} args.graph                          the regional graph (war fronts)
 * @param {SpatialDigest|null|undefined} args.digest    the frozen spatial digest
 * @param {number} args.tick
 * @param {number} [args.tickWeeks]
 * @param {string|null} [args.season]  SEASONS-B (M3): the current road season
 *   (winter lengthens caravan arrivals + reshapes route choice). Null / no
 *   overlay ⇒ geometric routing, byte-identical.
 * @param {{ fork?: (k: string) => { random: () => number } }|null} [args.rng]
 * @param {string|null} [args.now]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, starvations: string[], arrivals: string[] }}
 */
export function advanceSettlementSupply({ snapshot, localSettlements, worldState, graph, digest, tick, tickWeeks, season = null, rng = null, now = null }) {
  if (!supplyActive(worldState) || !digest) return { worldState, changed: false, starvations: [], arrivals: [] };

  const producers = buildProducerIndex(snapshot);
  /** @type {SupplyLink[]} */
  const links = [];
  /** @type {Map<string, { settlementId: string, input: string, institutionName: string|null }>} */
  const meta = new Map();
  /** @type {Map<string, SupplySnapItem>} */
  const itemById = new Map((snapshot?.settlements || []).map((it) => [String(it.id), it]));
  for (const item of snapshot?.settlements || []) {
    const destId = String(item.id);
    const settlement = localSettlements.get(destId) || item.settlement;
    if (!settlement) continue;
    for (const link of deriveConsumingLinks(settlement, destId, producers, digest)) {
      links.push(link);
      // Only a name that resolved to a REAL institution (see resolveConsumingInstitution)
      // is impairable; a synthetic input-id fallback is not.
      const real = resolveConsumingInstitution(settlement, link.input);
      meta.set(linkKey(destId, link.institutionId, link.input), { settlementId: destId, input: link.input, institutionName: real });
    }
  }
  if (!links.length) return { worldState, changed: false, starvations: [], arrivals: [] };

  // Live predicates: a besieged producer's output is cut; a gate at war with the
  // destination intercepts the caravan; the caravan runs at the steady dispatcher risk
  // tolerance; the severing cause names the besieging settlement.
  const sourceSeveredFor = (/** @type {string} */ _destId, /** @type {string} */ sourceId) => warFrontsInto(graph, sourceId).length > 0;
  const hostileToDestinationFor = (/** @type {string} */ destId, /** @type {string} */ gateId) => atWar(graph, gateId, destId);
  const riskToleranceFor = () => SUPPLY_RISK_TOLERANCE;
  const severingCauseFor = (/** @type {SupplyLink} */ link) => {
    for (const src of link.rankedSources || []) {
      const besiegers = warFrontsInto(graph, String(src.sourceId));
      if (besiegers.length) return `the siege of ${itemById.get(besiegers[0])?.name || besiegers[0]}`;
    }
    return undefined;
  };

  const out = advanceSupplyShipments({
    links, worldState, digest, tick, tickWeeks, season, rng,
    sourceSeveredFor, hostileToDestinationFor, riskToleranceFor, severingCauseFor,
  });

  // ── Write-back: buffers + impairments, grouped per settlement (one immutable
  //    rewrite per touched settlement). ─────────────────────────────────────────
  /** @type {Map<string, { buffers: Record<string, number>, starve: Array<{ inst: string, receipt: string|null }>, feed: string[] }>} */
  const perSettlement = new Map();
  const starvations = [];
  const arrivals = [];
  for (const key of Object.keys(out.outcomes)) {
    const outcome = out.outcomes[key];
    const m = meta.get(key);
    if (!m) continue;
    const bucket = perSettlement.get(m.settlementId) || { buffers: {}, starve: [], feed: [] };
    bucket.buffers[m.input] = outcome.bufferWeeks;
    if (outcome.arrived) arrivals.push(key);
    if (m.institutionName) {
      if (outcome.starving) bucket.starve.push({ inst: m.institutionName, receipt: outcome.receipt });
      else bucket.feed.push(m.institutionName);
    }
    if (outcome.receipt) starvations.push(outcome.receipt);
    perSettlement.set(m.settlementId, bucket);
  }
  for (const [sid, bucket] of perSettlement) {
    let settlement = localSettlements.get(sid) || itemById.get(sid)?.settlement;
    if (!settlement) continue;
    // Per-input stockpile buffers on economicState (the foodStockpile generalization).
    const inputStockpiles = { ...(settlement.economicState?.inputStockpiles || {}), ...bucket.buffers };
    settlement = { ...settlement, economicState: { ...(settlement.economicState || {}), inputStockpiles } };
    // SUPPLY-STARVED impairment: stamp on a starving consuming institution, lift when fed.
    if (bucket.starve.length || bucket.feed.length) {
      const feedSet = new Set(bucket.feed.map((n) => n.toLowerCase()));
      const starveMap = new Map(bucket.starve.map((s) => [s.inst.toLowerCase(), s]));
      const institutions = (settlement.institutions || []).map((inst) => {
        const name = String(inst?.name || '').toLowerCase();
        const starve = starveMap.get(name);
        if (starve) {
          return withImpairment(inst, {
            type: SUPPLY_STARVED_IMPAIRMENT, severity: 0.6,
            causeEventId: `${SUPPLY_STARVED_CAUSE_PREFIX}${sid}`,
            description: starve.receipt || 'Supply-starved: an input road is cut.',
            appliedAt: now,
          });
        }
        if (feedSet.has(name)) {
          // Lift only THIS module's supply-starvation mark (disjoint from blockade's).
          const stale = (inst.impairments || []).filter((im) => String(im?.causeEventId || '').startsWith(SUPPLY_STARVED_CAUSE_PREFIX));
          let cleared = inst;
          for (const im of stale) cleared = withoutEventImpairments(cleared, im.causeEventId);
          return cleared;
        }
        return inst;
      });
      settlement = { ...settlement, institutions };
    }
    localSettlements.set(sid, settlement);
  }

  // Write the AGGREGATE ledger onto worldState (conditional key, drop-when-empty).
  let nextWorldState = worldState;
  if (out.changed) {
    if (out.next) nextWorldState = { ...worldState, supplyShipments: out.next };
    else if (worldState && 'supplyShipments' in worldState) {
      const { supplyShipments: _drop, ...rest } = worldState;
      nextWorldState = rest;
    }
  }
  return { worldState: nextWorldState, changed: out.changed || perSettlement.size > 0, starvations, arrivals };
}
