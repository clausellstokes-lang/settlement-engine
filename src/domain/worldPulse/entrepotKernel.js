/**
 * entrepotKernel.js — the M6b ENTREPÔTS/TOLLS kernel adapter (Phase 5.5 mover M6b).
 *
 * The pure engine (spatial/entrepots.js) owns the mechanics — EARNED centrality from
 * the active shipments' gate-crossings, the rent-bounded toll, the four co-built brakes.
 * THIS thin adapter supplies the live reads and writes the outcomes back onto the world:
 *
 *   • it reads the JUST-ADVANCED supply-shipment ledger (M2/M6a) off worldState and
 *     hands it to advanceEntrepots to tally crossings;
 *   • it writes the `entrepots` sub-ledger (under spatialLedgers — ZERO eager bytes);
 *   • it UNLOCKS transshipment institutions on the W-C3 founding lane: a settlement whose
 *     centrality is SUSTAINED founds the next missing transshipment institution
 *     (warehouse → customs house → carriers' guild), one per tick, applied to
 *     localSettlements in the SAME `built`-object + institutionHistory shape the
 *     institution-lifecycle lane uses (a spatially-driven founding/growth lane, §4b).
 *
 * The toll PROSPERITY lift (tollProsperityFor) and the WARTIME-TARGETING premium
 * (entrepotTargetPremium) are read DIRECTLY off the persisted `entrepots` ledger by their
 * consumers (institutionLifecycle's health fold; pulseKernel's rampThreat call) — the
 * read-last/write-next discipline conquestFeeds uses — so this adapter only advances the
 * ledger + founds institutions.
 *
 * DORMANT (constitutional): a no-op without the commodity-flow gate (entrepotActive
 * false) — no ledger, no foundings, the M1 re-score byte-identical (tollRateOf reads 0).
 * Pure + deterministic (no rng — centrality/toll/foundings are derivations of state).
 */

import { setSpatialLedger, dropSpatialLedger, getSpatialLedger } from '../spatial/distanceRead.js';
import { advanceEntrepots, entrepotActive, TRANSSHIPMENT_INSTITUTIONS } from '../spatial/entrepots.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {{ name?: string, category?: string, tags?: string[], status?: string }} InstLike */
/** @typedef {{ name?: string, institutions?: InstLike[], institutionHistory?: unknown[], tier?: string }} EntrepotSettlement */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** The next transshipment institution (in unlock order) NOT yet standing on the
 *  settlement, or null when all three are present. Codepoint-insensitive name match.
 *  @param {EntrepotSettlement} settlement @returns {{ name: string, category: string, tags: string[] }|null} */
function nextTransshipment(settlement) {
  const names = new Set((Array.isArray(settlement?.institutions) ? settlement.institutions : [])
    .map((/** @type {InstLike} */ i) => String(i?.name || '').toLowerCase()));
  for (const spec of TRANSSHIPMENT_INSTITUTIONS) {
    if (!names.has(spec.name.toLowerCase())) return { name: spec.name, category: spec.category, tags: [...spec.tags] };
  }
  return null;
}

/** Found ONE transshipment institution on a settlement (the W-C3 `built`-object +
 *  institutionHistory shape), returning the next settlement + a receipt. Pure.
 *  @param {EntrepotSettlement} settlement @param {{ name: string, category: string, tags: string[] }} spec
 *  @param {number} tick @returns {{ settlement: EntrepotSettlement, receipt: string }} */
function foundInstitution(settlement, spec, tick) {
  const outcomeId = `entrepot.founding.${stablePart(settlement?.name || '')}.${stablePart(spec.name)}.${tick}`;
  const built = {
    id: `institution.${stablePart(spec.name)}`,
    name: spec.name,
    category: spec.category,
    status: 'active',
    description: '',
    tags: [...spec.tags],
    required: false,
    _worldPulseEconomyBuilt: true,
    createdByWorldPulseOutcomeId: outcomeId,
    builtReason: 'Founded on sustained trade centrality (the pass-through trade grew an entrepôt).',
  };
  const history = [
    ...(Array.isArray(settlement?.institutionHistory) ? settlement.institutionHistory.slice(-23) : []),
    { name: spec.name, category: spec.category, fate: 'built', tier: settlement?.tier || null, outcomeId, reason: 'Founded on sustained trade centrality.' },
  ].slice(-24);
  return {
    settlement: { ...settlement, institutions: [...(settlement?.institutions || []), built], institutionHistory: history },
    receipt: `${settlement?.name || 'the crossroads'} founds a ${spec.name.toLowerCase()}: sustained pass-through trade has grown an entrepôt.`,
  };
}

/**
 * Advance the M6b entrepôt layer one tick: tally the active shipments' crossings, step
 * the `entrepots` ledger, and found the next transshipment institution on each
 * sustained-centrality settlement. DORMANT ⇒ { worldState, changed:false } untouched.
 * @param {Object} args
 * @param {Map<string, EntrepotSettlement>} args.localSettlements  the mutable settlement map (written back)
 * @param {Array<{ id?: (string|number), settlement?: EntrepotSettlement }>} args.settlements  the pre-tick roster (fallback source)
 * @param {Record<string, unknown>} args.worldState
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {number} args.tick
 * @param {string|null} [args.season]
 * @param {number} [args.riskTolerance]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, foundings: string[] }}
 */
export function advanceEntrepotLayer({ localSettlements, settlements, worldState, digest, tick, season = null, riskTolerance }) {
  if (!entrepotActive(worldState) || !digest) return { worldState, changed: false, foundings: [] };

  // The shipments to tally = the just-advanced supply-shipment ledger (M2/M6a).
  const shipmentLedger = asObject(getSpatialLedger(worldState, 'supplyShipments'));
  const shipments = Object.keys(shipmentLedger)
    .sort()
    .map((k) => /** @type {{ sourceId?: unknown, settlementId?: unknown }} */ (shipmentLedger[k]));

  const out = advanceEntrepots({ shipments, digest, worldState, tick, season, riskTolerance });

  // FOUND transshipment institutions on sustained entrepôts (codepoint-sorted so the
  // founding order is deterministic). One per settlement per tick.
  /** @type {Map<string, EntrepotSettlement>} */
  const itemById = new Map((settlements || []).map((it) => [String(it.id), /** @type {EntrepotSettlement} */ (it.settlement)]));
  /** @type {string[]} */
  const foundings = [];
  for (const sid of Object.keys(out.outcomes).sort()) {
    if (!out.outcomes[sid].sustained) continue;
    const settlement = localSettlements.get(sid) || itemById.get(sid);
    if (!settlement) continue;
    const spec = nextTransshipment(settlement);
    if (!spec) continue; // all three already stand
    const founded = foundInstitution(settlement, spec, tick);
    localSettlements.set(sid, founded.settlement);
    foundings.push(founded.receipt);
  }

  // Write the entrepôt ledger (conditional sub-ledger, drop-when-empty).
  let nextWorldState = worldState;
  if (out.changed) {
    nextWorldState = out.next
      ? setSpatialLedger(worldState, 'entrepots', out.next)
      : dropSpatialLedger(worldState, 'entrepots');
  }
  return { worldState: nextWorldState, changed: out.changed || foundings.length > 0, foundings };
}
