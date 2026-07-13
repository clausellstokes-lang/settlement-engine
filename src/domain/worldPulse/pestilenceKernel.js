/**
 * pestilenceKernel.js — the M11a PESTILENCE kernel adapter (Phase 5.5 mover M11a).
 *
 * The pure engine (spatial/pestilence.js) owns the TRAVEL mechanics + the care law;
 * THIS thin adapter supplies the LIVE reads the engine needs and applies its decisions:
 *
 *   • SEEDS — the settlements carrying an ACTIVE `disease_outbreak` stressor (however it
 *     arose: pressure-driven birth, DM authoring, or a prior front materialization). The
 *     front propagates FROM these; there is NO second plague — this is the ONE stressor.
 *   • LIVE READS — the institution roster (the CARE counterforce), tier/density, trade
 *     volume + inbound shipment pressure (ports run hotter), and the carrier fan-out
 *     (active trade channels via rumorNetwork.tradeNeighbours + M2 shipment arrivals).
 *   • MATERIALIZE — where the front TAKES HOLD, mint the ORDINARY `disease_outbreak`
 *     stressor (normalizeStressor → the canonical id `world_stressor.disease_outbreak.<id>`),
 *     deduped by that id (an existing active plague is never double-minted). This is the
 *     religiousContest pattern ("we drive that stressor, never a parallel one") — so the
 *     materialized plague automatically feeds BOTH the revival ("crisis calls the faithful
 *     home") and the `gods_abandonment` piety-crisis seams. A causal receipt on every mint.
 *   • WRITE — the `epidemic` sub-ledger (under spatialLedgers — ZERO eager bytes).
 *
 * RECONCILE (no double-count, M4's origin-loss rule): under the marker the aspatial
 * one-hop channel spread of `disease_outbreak` is filtered out at candidateEvents' lazy call
 * site; the spatial front REPLACES it. Aspatial worlds keep today's plague byte-identically.
 *
 * FENCED (M11a stop-and-report): the ARMY coupling MUTATION. The read primitives live in
 * spatial/pestilence.js (armyPlagueHazard / armyContraction) but wiring contraction +
 * vector-carry into armyTransitKernel touches the byte-sensitive war convergence (the 6
 * siege pins / field-battle determinism / certification envelopes) — deliberately deferred
 * to its own pass. See the report. TRADE REFUSAL (round 22.1) is a separate later wave.
 *
 * DORMANT (constitutional): a no-op without the spatial-canon marker (epidemicActive
 * false) — no `epidemic` ledger, no materializations, the aspatial plague byte-identical.
 * Pure + deterministic; the caller threads the tick + the pulse rng (the spread/onset forks).
 */

import { TIER_ORDER, popToTier } from '../../data/constants.js';
import { setSpatialLedger, dropSpatialLedger, getSpatialLedger, hopWeeks } from '../spatial/distanceRead.js';
import {
  advancePestilence, epidemicActive, careCapacity, classifyCareRoster, EPIDEMIC_TUNING,
} from '../spatial/pestilence.js';
import { tradeNeighbours } from '../spatial/rumorNetwork.js';
import { normalizeStressor } from './stressors.js';
import { effectiveStressorSeverity } from './stressorSeverity.js';

// ── Kernel-local read-shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('../spatial/pestilence.js').PestilenceNeighbour} PestilenceNeighbour */
/** @typedef {{ name?: unknown }} PestInstitution */
/** @typedef {{ population?: number, tier?: string, institutions?: PestInstitution[] }} PestSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: PestSettlement,
 *   causal?: { scores?: { trade_connectivity?: number } } }} PestSnapItem */
/** @typedef {{ settlements?: PestSnapItem[], regionalGraph?: PestGraph|null,
 *   byId?: { get?: (id: string) => PestSnapItem|undefined } }} PestSnapshot */
/** @typedef {{ channels?: unknown[] }} PestGraph */
/** @typedef {{ id?: unknown, type?: unknown, status?: unknown, lifecycleStage?: unknown,
 *   severity?: unknown, originSettlementId?: unknown, affectedSettlementIds?: unknown }} PestStressor */
/** @typedef {{ settlementId?: unknown, sourceId?: unknown, starving?: unknown }} ShipmentRecord */

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── Tuning (documented; retuned in the M11a soak) ─────────────────────────────
export const PESTILENCE_KERNEL_TUNING = Object.freeze({
  // Trade-volume anchor: the tradeFlow throughput (in+out) or the trade_connectivity
  // proxy at which a settlement reads "busy" (tradeVolume01→1). A tinderbox anchor.
  TRADE_VOLUME_ANCHOR: 60,
  // Import-pressure: inbound shipment COUNT at which the port premium saturates, plus
  // the tradeFlow inbound weight. Ports/hubs run hotter (the §M11a "ports run hotter").
  IMPORT_SHIPMENT_ANCHOR: 4,
  IMPORT_FLOW_ANCHOR: 30,
});

const ACTIVE_STRESSOR_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

/** Is this stressor a LIVE disease_outbreak? @param {PestStressor} s @returns {boolean} */
function isLivePlague(s) {
  return !!s && s.type === 'disease_outbreak'
    && (ACTIVE_STRESSOR_STAGES.has(String(s.status)) || ACTIVE_STRESSOR_STAGES.has(String(s.lifecycleStage)));
}

/** The tier/density scalar 0..1 (thorp 0 … metropolis 1). @param {PestSettlement|undefined} s @returns {number} */
function density01Of(s) {
  const tier = String(s?.tier || popToTier(num(s?.population, 0)));
  const idx = TIER_ORDER.indexOf(tier);
  return idx < 0 ? 0 : idx / (TIER_ORDER.length - 1);
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} PestilenceAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<{ id: string, kind: 'materialized'|'cleared', severity?: number, sourceId?: string }>} receipts
 */

/**
 * Advance the pestilence layer one tick: seed the front from the live disease_outbreak
 * stressors, propagate it over the carriers (trade channels + shipment arrivals) at
 * hopWeeks latency, resolve onset (density/tier + volume − care), MATERIALIZE the plague
 * where it takes hold, and persist the `epidemic` ledger. DORMANT (no marker) ⇒
 * { worldState, changed:false, newsEntries:[], receipts:[] } — byte-identical.
 * @param {Object} args
 * @param {PestSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState  (holds the post-apply stressors)
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {PestGraph|null|undefined} args.graph
 * @param {{ fork?: (k: string) => { random: () => number } }|null} args.rng
 * @param {string|null} args.season
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {PestilenceAdvanceResult}
 */
export function advanceSettlementPestilence({ snapshot, worldState, digest, graph, rng, season, tick, now }) {
  if (!epidemicActive(worldState) && !getSpatialLedger(worldState, 'epidemic')) {
    return { worldState, changed: false, newsEntries: [], receipts: [] };
  }
  const K = PESTILENCE_KERNEL_TUNING;
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  const stressors = /** @type {PestStressor[]} */ (Array.isArray(worldState?.stressors) ? worldState.stressors : []);

  // ── Seeds + the active-plague set (stressorActiveAt) + the per-settlement severity. ──
  /** @type {Set<string>} */
  const activeSet = new Set();
  /** @type {Map<string, number>} */
  const severityAt = new Map();
  for (const s of stressors) {
    if (!isLivePlague(s)) continue;
    const affected = Array.isArray(s.affectedSettlementIds) && s.affectedSettlementIds.length
      ? s.affectedSettlementIds.map(String)
      : [String(s.originSettlementId ?? '')].filter(Boolean);
    for (const id of affected) {
      activeSet.add(id);
      const sev = clamp01(num(effectiveStressorSeverity(
        /** @type {Parameters<typeof effectiveStressorSeverity>[0]} */ (/** @type {unknown} */ (s)), id), num(s.severity, 0.45)));
      severityAt.set(id, Math.max(severityAt.get(id) ?? 0, sev));
    }
  }
  const seedIds = [...activeSet].sort();

  // ── The inbound-shipment map (import pressure) + the shipment carrier edges. ──
  const shipLedger = /** @type {Record<string, ShipmentRecord>|null} */ (getSpatialLedger(worldState, 'supplyShipments'));
  /** @type {Map<string, number>} */ const inboundShipments = new Map();
  /** @type {Map<string, Array<{ to: string }>>} */ const shipEdgesFrom = new Map();
  for (const key of Object.keys(shipLedger || {}).sort()) {
    const rec = asObject(shipLedger?.[key]);
    if (rec.starving === true) continue;
    const consumer = rec.settlementId != null ? String(rec.settlementId) : '';
    const producer = rec.sourceId != null ? String(rec.sourceId) : '';
    if (!consumer || !producer || consumer === producer) continue;
    inboundShipments.set(consumer, (inboundShipments.get(consumer) ?? 0) + 1);
    const list = shipEdgesFrom.get(producer) || [];
    if (!list.some((e) => e.to === consumer)) list.push({ to: consumer });
    shipEdgesFrom.set(producer, list);
  }

  // ── The tradeFlow throughput read (M6d; often absent → the connectivity proxy). ──
  const flowLedger = /** @type {Record<string, { in?: number, out?: number }>|null} */ (getSpatialLedger(worldState, 'tradeFlow'));

  /** @param {string} id @returns {number} tradeVolume01 */
  const tradeVolume01Of = (id) => {
    const flow = flowLedger?.[id];
    if (flow) return clamp01((num(flow.in, 0) + num(flow.out, 0)) / K.TRADE_VOLUME_ANCHOR);
    const conn = itemById.get(id)?.causal?.scores?.trade_connectivity;
    return clamp01(num(conn, 40) / 100);
  };
  /** @param {string} id @returns {number} importVolume01 (port premium) */
  const importVolume01Of = (id) => {
    const ships = clamp01((inboundShipments.get(id) ?? 0) / K.IMPORT_SHIPMENT_ANCHOR);
    const flow = flowLedger?.[id];
    const inflow = flow ? clamp01(num(flow.in, 0) / K.IMPORT_FLOW_ANCHOR) : 0;
    return clamp01(Math.max(ships, inflow));
  };
  /** @param {string} id @returns {number} care01 (the roster read) */
  const care01Of = (id) => careCapacity(classifyCareRoster(itemById.get(id)?.settlement?.institutions));

  // ── The carrier fan-out: trade channels (both ways) + shipment arrivals (hot). ──
  /** @param {string} id @returns {PestilenceNeighbour[]} */
  const neighboursOf = (id) => {
    /** @type {PestilenceNeighbour[]} */
    const out = [];
    for (const nb of tradeNeighbours(/** @type {Parameters<typeof tradeNeighbours>[0]} */ (graph), id)) {
      const weeks = digest ? hopWeeks(digest, id, nb.neighbourId, season) : null;
      out.push({ to: nb.neighbourId, edgeId: nb.edgeId, weeks: weeks == null ? 1 : weeks, hot: false });
    }
    for (const e of shipEdgesFrom.get(id) || []) {
      const weeks = digest ? hopWeeks(digest, id, e.to, season) : null;
      out.push({ to: e.to, edgeId: `ship.${id}.${e.to}`, weeks: weeks == null ? 1 : weeks, hot: true });
    }
    return out;
  };

  const result = advancePestilence({
    worldState,
    seedIds,
    seedSeverityOf: (id) => severityAt.get(String(id)) ?? 0.5,
    stressorActiveAt: (id) => activeSet.has(String(id)),
    neighboursOf,
    density01Of: (id) => density01Of(itemById.get(id)?.settlement),
    tradeVolume01Of,
    importVolume01Of,
    care01Of,
    rng: rng && typeof rng.fork === 'function' ? rng : null,
    tick,
  });

  if (!result.changed) return { worldState, changed: false, newsEntries: [], receipts: [] };

  // ── Persist the ledger. ──
  let nextWorldState = result.next
    ? setSpatialLedger(worldState, 'epidemic', result.next)
    : dropSpatialLedger(worldState, 'epidemic');

  // ── MATERIALIZE — mint the ordinary disease_outbreak stressor where it took hold. ──
  /** @type {Array<{ id: string, kind: 'materialized'|'cleared', severity?: number, sourceId?: string }>} */
  const receipts = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  if (result.materializations.length) {
    const list = /** @type {PestStressor[]} */ (Array.isArray(nextWorldState.stressors) ? nextWorldState.stressors.slice() : []);
    const byId = new Map(list.map((s) => [String(s.id), s]));
    for (const mat of [...result.materializations].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) {
      const sourceName = mat.sourceId ? String(itemById.get(mat.sourceId)?.name || mat.sourceId) : 'an unknown source';
      const minted = normalizeStressor({
        type: 'disease_outbreak',
        originSettlementId: mat.id,
        severity: mat.severity,
        affectedSettlementIds: [mat.id],
        // The causal receipt on the materialization (§M11a): where the front came from.
        originContext: {
          variant: 'spatial_arrival',
          reason: mat.sourceId
            ? `The plague travelled the trade roads from ${sourceName} and took hold here.`
            : 'The plague took hold here as the sickness spread inward.',
        },
        createdAt: now || null,
        updatedAt: now || null,
      });
      // Dedup on the SAME canonical id normalizeStressor/idFor actually mints — idFor slugs
      // the origin via stablePart ([^a-z0-9]+→_), so a raw-`mat.id` key (production ids are
      // UUIDs with hyphens) MISSES the real minted id (underscores) and DOUBLE-mints,
      // violating ONE PLAGUE TRUTH. Keying off the minted record's own id can never drift
      // from the mint transform (clean-slug fixtures were byte-identical either way).
      const canonicalId = String(minted.id);
      const existing = byId.get(canonicalId);
      if (existing && isLivePlague(existing)) { continue; } // ONE PLAGUE TRUTH: never double-mint
      byId.set(canonicalId, /** @type {PestStressor} */ (minted));
      receipts.push({ id: mat.id, kind: 'materialized', severity: mat.severity, sourceId: mat.sourceId });
      newsEntries.push(materializationNews(mat.id, sourceName, mat.severity, itemById.get(mat.id)?.name, tick, now));
    }
    nextWorldState = { ...nextWorldState, stressors: [...byId.values()] };
  }
  for (const c of [...result.clearances].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) {
    receipts.push({ id: c.id, kind: 'cleared' });
  }

  return { worldState: nextWorldState, changed: true, newsEntries, receipts };
}

/**
 * A plague-materialization wizard-news entry (house voice, AGGREGATE — no npc named).
 * @param {string} id @param {string} sourceName @param {number} severity
 * @param {string|undefined} name @param {number} tick @param {string|null} now
 * @returns {Record<string, unknown>}
 */
function materializationNews(id, sourceName, severity, name, tick, now) {
  const where = String(name || id);
  return {
    id: `wizard_news.${tick}.plague_arrival.${id}`,
    tick,
    scope: 'regional',
    significance: severity >= 0.55 ? 'notable' : 'minor',
    score: Math.round(40 + severity * 30),
    headline: `Plague reaches ${where}`,
    summary: `Sickness carried along the trade roads from ${sourceName} has taken hold in ${where}. The healers and temples brace for what comes.`,
    kind: 'applied',
    impactKind: 'plague_arrival',
    channelType: 'trade_route',
    severity: Math.round(severity * 100) / 100,
    settlementIds: [id],
    impactIds: [],
    channelIds: [],
    sourceEventId: `plague_arrival.${id}.${tick}`,
    tags: ['world_pulse', 'plague', 'spatial'],
    reasons: [`The pestilence travelled from ${sourceName} at the roads' pace.`],
    createdAt: now,
  };
}

export { EPIDEMIC_TUNING };
