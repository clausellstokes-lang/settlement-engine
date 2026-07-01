/**
 * domain/display/warResolve.js — the read-side "War & Resolve" projection: per-settlement
 * morale signals (Resolve, Hope, Supply, Faith relation, war Sentiment, Leadership) for the
 * surfacing tab and the AI narrative / daily-life grounding.
 *
 * PRESENTATION ONLY. Pure — no rng, no wall clock, no mutation, no store/React. Every field
 * is derived from the SAME functions the simulation uses, so the number the DM reads is the
 * number the engine acts on:
 *   - Resolve  → composeDefenderWillScore (the exact will the P4 siege verdict biases by)
 *   - Supply   → resolveBlockadeBypassChannel + the live food ledger (a besieged town with a
 *                non-impaired teleport circle / airship is NOT granary-only — see the food model)
 *   - Sentiment→ computeWarSentiment (the exact pro/anti-war the P2 coup flywheel reads)
 *   - Capacity → deriveMilitaryCapacity (the exact facets the siege contest is built from)
 *
 * DORMANCY. A peaceful, deity-free, ledger-free settlement yields a mostly-null bundle and
 * `atWar:false` — the surface renders "at peace", never throws, and a no-war campaign shows
 * nothing extra (the byte-identical off-state the whole surfacing layer preserves).
 */

import { deriveMilitaryCapacity } from '../worldPulse/militaryStrength.js';
import {
  composeDefenderWillScore,
  WILL_CAPITULATE_FLOOR,
  ARMY_DEPLOYED_CAPACITY_PENALTY,
} from '../worldPulse/warDeployment.js';
import { computeWarSentiment } from '../worldPulse/disposition.js';
import { resolveBlockadeBypassChannel } from '../worldPulse/foodStockpile.js';
import { settlementWarStatus, settlementWarExhaustion, warExhaustionBand } from './warStatus.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);
/** @param {any} v @param {number} fallback */
const num = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
const clamp = (/** @type {number} */ v, /** @type {number} */ lo, /** @type {number} */ hi) => Math.max(lo, Math.min(hi, v));

// ── Human bands (house voice — plain, unhurried). Each is a pure function of one signal. ──

/** @param {number} willScore ∈ [-1, 1] */
function resolveBand(willScore) {
  if (willScore <= WILL_CAPITULATE_FLOOR) return 'capitulating';
  if (willScore <= -0.35) return 'breaking';
  if (willScore < 0.15) return 'wavering';
  if (willScore < 0.5) return 'steady';
  return 'resolute';
}

/** @param {number} odds ∈ [0, 1] — the defender's share of the siege capacity */
function hopeBand(odds) {
  if (odds < 0.2) return 'forlorn';
  if (odds < 0.4) return 'slim';
  if (odds < 0.6) return 'even';
  if (odds < 0.8) return 'favorable';
  return 'commanding';
}

/** @param {number} v ∈ [-1, 1] — pro-war (positive) vs anti-war (negative) */
function sentimentBand(v) {
  if (v <= -0.4) return 'clamoring for peace';
  if (v < -0.1) return 'war-weary';
  if (v < 0.1) return 'divided';
  if (v < 0.4) return 'behind the war';
  return 'hungry for war';
}

// ── Supply — bypass-aware. A siege does not automatically starve a town: a teleportation
// circle is point-to-point (blockade-proof) and an airship dock runs the blockade impaired,
// each keeping the granary partly filled. Reads the live food ledger + the SAME bypass helper
// the stockpile model uses, so the surface never claims a besieged circle-town is starving.

/**
 * @param {any} settlement
 * @param {boolean} besieged
 * @returns {{ storageMonths: number|null, deficitPct: number|null, bypassChannel: ('teleport'|'airship'|null), besieged: boolean, band: string, note: string|null }}
 */
function readSupply(settlement, besieged) {
  const fs = settlement?.economicState?.foodSecurity || {};
  const storageMonthsRaw = Number(fs.storageMonths);
  const storageMonths = Number.isFinite(storageMonthsRaw) ? Math.max(0, storageMonthsRaw) : null;
  const deficitRaw = Number(fs?.stockpile?.effectiveDeficitPct ?? fs.deficitPct);
  const deficitPct = Number.isFinite(deficitRaw) ? clamp(deficitRaw, 0, 100) : null;
  const bypassChannel = /** @type {'teleport'|'airship'|null} */ (resolveBlockadeBypassChannel(settlement));
  return {
    storageMonths,
    deficitPct,
    bypassChannel,
    besieged,
    band: supplyBand({ storageMonths, deficitPct, bypassChannel, besieged }),
    note: supplyNote({ storageMonths, bypassChannel, besieged }),
  };
}

/** @param {{ storageMonths: number|null, deficitPct: number|null, bypassChannel: string|null, besieged: boolean }} args */
function supplyBand({ storageMonths, deficitPct, bypassChannel, besieged }) {
  // A blockade-proof circle holds the line regardless of the siege.
  if (besieged && bypassChannel === 'teleport') return 'supplied';
  if (besieged && bypassChannel === 'airship') return 'running the blockade';
  if (deficitPct != null && deficitPct >= 55) return 'starving';
  if (storageMonths != null && storageMonths < 1) return besieged ? 'starving' : 'strained';
  if (storageMonths != null && storageMonths < 3) return 'strained';
  if (deficitPct != null && deficitPct >= 25) return 'strained';
  return 'provisioned';
}

/** @param {{ storageMonths: number|null, bypassChannel: string|null, besieged: boolean }} args */
function supplyNote({ storageMonths, bypassChannel, besieged }) {
  const months = storageMonths == null ? null : Math.round(storageMonths);
  if (besieged) {
    if (bypassChannel === 'teleport') return 'A teleportation circle runs beneath the siege lines — supplies arrive, and the blockade cannot touch them.';
    if (bypassChannel === 'airship') return 'Airships run the blockade at reduced throughput; the granary drains slowly rather than sharply.';
    if (months != null) return `The granary stands alone against the blockade — roughly ${months} month${months === 1 ? '' : 's'} before famine.`;
    return 'The granary stands alone against the blockade, and the roads are closed.';
  }
  if (bypassChannel === 'teleport') return 'A teleportation circle keeps trade flowing beyond the granary.';
  if (bypassChannel === 'airship') return 'An airship dock keeps trade flowing beyond the granary.';
  return null;
}

// ── Faith relation — the patron deity's temperament / alignment, and (when besieged) whether
// the besiegers' faith stands opposed. A peaceful, good faith set against an evil, warbound
// aggressor is a holy last stand; a shared temperament is a war of like against like.

/**
 * @param {any} settlement
 * @param {string[]} besiegedBy
 * @param {(id:any)=>any} [settlementOf]
 */
function readFaith(settlement, besiegedBy, settlementOf) {
  const deity = settlement?.config?.primaryDeitySnapshot;
  if (!deity) return null;
  const patron = {
    name: deity.name || null,
    alignment: deity.alignmentAxis || null,   // good | evil | neutral
    temper: deity.temperamentAxis || null,     // warlike | peacelike | neutral
  };
  /** @type {Array<{ besieger: string, deity: string|null, opposedOn: string[] }>} */
  const opposed = [];
  for (const bid of besiegedBy || []) {
    const bd = settlementOf?.(bid)?.config?.primaryDeitySnapshot;
    if (!bd) continue;
    const opposedOn = [];
    if (isOpposite(patron.alignment, bd.alignmentAxis, 'good', 'evil')) opposedOn.push('alignment');
    if (isOpposite(patron.temper, bd.temperamentAxis, 'warlike', 'peacelike')) opposedOn.push('temperament');
    if (opposedOn.length) opposed.push({ besieger: String(bid), deity: bd.name || null, opposedOn });
  }
  return { patron, opposed };
}

/** Are two axis values diametrically opposed (a↔b, either order)? */
function isOpposite(/** @type {any} */ x, /** @type {any} */ y, /** @type {string} */ a, /** @type {string} */ b) {
  return (x === a && y === b) || (x === b && y === a);
}

// ── Leadership — who holds the seat, and the figures whose temperament colours the resolve.

/** @param {any} settlement */
function readLeadership(settlement) {
  const ps = settlement?.powerStructure || {};
  const government = settlement?.config?.government || ps.government || null;
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const gov = factions.find((/** @type {any} */ f) => f?.isGoverning) || null;
  const figures = (Array.isArray(settlement?.npcs) ? settlement.npcs : [])
    .filter((/** @type {any} */ n) => n?.importance === 'key' || n?.importance === 'notable')
    .slice(0, 3)
    .map((/** @type {any} */ n) => ({ name: n?.name || null, role: n?.role || n?.title || null, temperament: n?.temperament || null }));
  return {
    government: government || null,
    governingFaction: gov ? { name: gov.faction || gov.name || null, power: num(gov.power, 0) } : null,
    figures,
  };
}

/**
 * The full War & Resolve signal for ONE settlement. Pure + tolerant of missing ledgers.
 *
 * @param {Object} args
 * @param {any} args.settlement                 the settlement object (config/powerStructure/npcs/economicState).
 * @param {any} args.saveId                     its save id (falls back to settlement.id).
 * @param {any} args.worldState                 live worldState (deployments / warExhaustion).
 * @param {any} [args.regionalGraph]            live regional graph (war_front coalitions).
 * @param {(id:any)=>any} [args.capacityOf]     id → military-capacity model (built once by the realm reader).
 * @param {(id:any)=>any} [args.settlementOf]   id → settlement (for besieger faith); optional.
 * @returns {any} the signal bundle (never null; a peaceful settlement carries atWar:false).
 */
export function warResolveSignal({ settlement, saveId, worldState, regionalGraph, capacityOf, settlementOf } = /** @type {any} */ ({})) {
  const id = String(saveId ?? settlement?.id ?? '');
  const cap = capacityOf ? capacityOf(id) : deriveMilitaryCapacity(settlement);
  const facets = cap?.facets || {};

  const status = settlementWarStatus({ settlementId: id, worldState, regionalGraph });
  const besiegedBy = status?.besiegedBy || [];
  const besieging = status?.besiegingTargets || [];
  const besieged = besiegedBy.length > 0;

  // Strengths mirror the siege's buildCapacityLookup: home defense loses the deployed
  // penalty when THIS settlement is itself fielding an army abroad.
  const offensive = Math.max(0, num(cap?.currentCapacity, 0));
  const homeDefense = Math.max(0, offensive - (besieging.length ? ARMY_DEPLOYED_CAPACITY_PENALTY : 0));
  const coalitionOffensive = besiegedBy.reduce((/** @type {number} */ sum, /** @type {any} */ bid) => {
    const bc = capacityOf ? capacityOf(bid) : null;
    return sum + Math.max(0, num(bc?.currentCapacity, 0));
  }, 0);

  // HOPE — the defender's share of the contested capacity; only meaningful under siege.
  const denom = coalitionOffensive + homeDefense;
  const hopeOdds = besieged ? (denom > 0 ? homeDefense / denom : 0.5) : null;

  // RESOLVE — the SAME will the P4 siege verdict biases by (exact under siege; a latent read
  // otherwise, where the odds term is neutral because there is no coalition pressing).
  const willScore = composeDefenderWillScore({
    willFacet: facets.will,
    legitimacyScore: settlement?.powerStructure?.publicLegitimacy?.score,
    logisticsFacet: facets.logistics,
    defenderCurrent: homeDefense,
    coalitionCurrent: coalitionOffensive,
  });

  const scar = settlementWarExhaustion({ settlementId: id, worldState });
  const sentiment = computeWarSentiment(settlement, scar);

  return {
    id,
    name: settlement?.name || id,
    atWar: !!status,
    besieged,
    besieging,
    besiegedBy,
    resolve: { willScore, band: resolveBand(willScore), capitulating: willScore <= WILL_CAPITULATE_FLOOR },
    hope: hopeOdds == null ? null : { odds: hopeOdds, band: hopeBand(hopeOdds) },
    supply: readSupply(settlement, besieged),
    faith: readFaith(settlement, besiegedBy, settlementOf),
    sentiment: { value: sentiment, band: sentimentBand(sentiment) },
    warExhaustion: { scar, band: warExhaustionBand(scar) },
    leadership: readLeadership(settlement),
    capacity: { offensive, homeDefense, coalitionOffensive },
  };
}

/**
 * The War & Resolve signals for a whole realm, codepoint-sorted by id. Builds ONE cached
 * capacity lookup across the roster (so a besieged town can read its besiegers' strength)
 * and a settlement lookup (for besieger faith). Pure; tolerant of an empty roster.
 *
 * @param {Object} args
 * @param {Array<{ id?: any, settlement?: any }>} [args.saves]  the settlement saves/snapshot items.
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]
 * @returns {any[]} one signal bundle per settlement, codepoint-sorted.
 */
export function realmResolveSignals({ saves, worldState, regionalGraph } = /** @type {any} */ ({})) {
  const items = Array.isArray(saves) ? saves : [];
  /** @type {Map<string, any>} */
  const byId = new Map();
  for (const item of items) {
    const id = item?.id != null ? String(item.id) : (item?.settlement?.id != null ? String(item.settlement.id) : null);
    if (id) byId.set(id, item?.settlement || item);
  }
  /** @type {Map<string, any>} */
  const capCache = new Map();
  const capacityOf = (/** @type {any} */ rawId) => {
    const key = String(rawId);
    if (capCache.has(key)) return capCache.get(key);
    const st = byId.get(key);
    const model = st ? deriveMilitaryCapacity(st) : { currentCapacity: 0, facets: {} };
    capCache.set(key, model);
    return model;
  };
  const settlementOf = (/** @type {any} */ rawId) => byId.get(String(rawId)) || null;

  return [...byId.keys()].sort(codepoint).map(id =>
    warResolveSignal({ settlement: byId.get(id), saveId: id, worldState, regionalGraph, capacityOf, settlementOf }),
  );
}
