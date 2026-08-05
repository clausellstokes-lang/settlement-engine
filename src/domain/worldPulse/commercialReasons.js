/**
 * domain/worldPulse/commercialReasons.js — TR-1: THE CASUS COMMERCII.
 *
 * *The Hanse's grievance rolls: every embargo of Novgorod carried a written reason.*
 *
 * War has had a typed, receipted, decay-inherent reasons layer since W-PEACE-1. Commerce
 * has had none — the three organic embargo paths in this estate change state and record
 * no cause, so a court could shut a market and the world could not say why. This module
 * is commerce's answer: a directed, per-pair ledger of typed severance grievances and
 * their partnership mirrors, RECOMPUTED EACH PULSE FROM EXISTING STATE, so decay is
 * inherent — when the producing state heals, the record drops rather than ratcheting.
 *
 * WHAT THIS MODULE IS NOT (J-TR-2, binding). It is NOT war's reasons layer with a trade
 * costume. It imports no war table, mints no casus belli, and shares no code with
 * warReasons.js — warReasonTaxonomy.js was the SHAPE template and nothing more. The war
 * coupling runs one way and through one door: tradeWar's EXISTING escalation deposit
 * reads a severance MAGNITUDE as pressure (WR-0c item 3's law — never a new front, never
 * a war casus minted here).
 *
 * CONSTITUTIONAL POSTURE
 *   - GATE: `casusCommerciiActive(rules)` — the virtual `casusCommerciiEnabled` read
 *     strict, BY NAME, fail-closed. No default joins DEFAULT_SIMULATION_RULES, so every
 *     existing golden is byte-identical and a dark world pays zero persisted bytes.
 *   - ZERO RNG. Magnitudes are reads, not rolls; receipt selection is a keyed hash over
 *     a stable per-record seed, so the same world at the same tick says the same
 *     sentence forever (THE PROMISE).
 *   - Ledger writes ride getSpatialLedger/setSpatialLedger/dropSpatialLedger under the
 *     `spatialLedgers.commercialReasons` home: drop-when-empty at EVERY level, absent ⇒
 *     byte-identical, ONE writer module (this one).
 *
 * THE SAME-EVIDENCE LAW. Every pair is two signs of ONE read, never two measurements:
 * the toll that gouges is the toll that, relieved, warms; the dependency that frightens
 * is the dependency that binds. A mirror with its own evidence could disagree with its
 * force about what happened, which is how a ledger starts lying.
 *
 * AMENDMENT B — SUPPRESSION WITH A NAMED READ (DESIGN_REALM_DIRECTIVES.md:184, §1d map).
 * A casus contradicted by a LIVE read scores ZERO and emits a receipt NAMING the read
 * that struck it out. The flagship instance: a `famine_profiteering` grievance against a
 * counterpart whose warehouses are physically empty is not a small grievance, it is a
 * false one. Suppression receipts are RETURNED, never persisted — a zero-magnitude row
 * on the ledger would be exactly the ratchet this layer refuses.
 *
 * ⚠ THE REGISTRATION SEAMS (the warReasons idiom, executed). Five of the eight pairs
 * score off producers that DO NOT EXIST in this tree yet. Each is registered here with a
 * real scorer that is passed `undefined` today ⇒ 0 ⇒ no record ⇒ byte-identical, because
 * the taxonomy is walker-enforced for totality AND bijection and a cause cannot be
 * minted by a wave that has not already authored its mirror. Registration-first is the
 * only order this taxonomy admits.
 *
 *   contract_default / contract_honored  ← the compliance stack (GRAMMAR GR-3 / TR-5)
 *   cornering        / provision         ← corner receipts + delivery tallies (TR-6)
 *   famine_profiteering (BELIEF arm)     ← believed dearness (SP-2 / TR-3); its TRUTH-side
 *                                          suppression read is LIVE here today
 *   contraband_injury / honest_gates     ← believed smuggling at the gate (INFO)
 *   route_predation  / route_wardenship  ← leg loss policed vs tolerated (the 17-module
 *                                          route estate, dark behind routeLifecycleEnabled
 *                                          — an honest permanent zero until it lights)
 *
 * Three pairs read LIVE state today: toll_extortion/toll_relief off the entrepôt ledger,
 * market_exclusion/market_opened off the no-trade relationship predicate, and
 * dependency_fear/dependency_comfort off pair trade salience signed by the relationship's
 * own trust and resentment.
 *
 * @enforced-by tests/domain/commercialReasons.test.js
 * @enforced-by tests/lint/commercialReasonTaxonomy.walker.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { NO_TRADE_RELATIONSHIPS } from '../region/tradeLinks.js';
import { ENTREPOT_TUNING } from '../spatial/entrepots.js';
import { dropSpatialLedger, getSpatialLedger, setSpatialLedger } from '../spatial/distanceRead.js';
import { commercialKindOf, commercialReceipt } from './commercialReasonsNews.js';
import {
  BELIEF_SOURCED_SEVERANCE_TYPES,
  COMMERCIAL_REASON_MIRRORS,
  SEVERANCE_REASON_TYPES,
} from './commercialReasonTaxonomy.js';
import {
  ensureRelationshipState,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  normalizeRelationshipType,
  relationshipKeyFromEdge,
} from './relationshipState.js';
import { pairTradeSalience } from './tradeSalience.js';

/** The ledger's home under the spatialLedgers namespace. ONE spelling, one writer. */
export const COMMERCIAL_REASONS_LEDGER = 'commercialReasons';

/**
 * Bounded, named, owner-retunable magnitudes. Every threshold a reader can reach is
 * here; nothing downstream invents a band.
 */
export const COMMERCIAL_REASON_TUNING = Object.freeze({
  /** Below this a reason does not materialize, and a materialized one drops. */
  MIN_MAGNITUDE: 0.05,
  /** The band a magnitude must cross for the Herald to carry it as a crossing. */
  CROSSING_BAND: 0.45,
  /** The "extreme" band tradeWar's escalation deposit may read as pressure. */
  EXTREME_BAND: 0.65,
  /** A toll at or below this share of TOLL_MAX reads as relief, above it as extortion. */
  FAIR_TOLL_SHARE: 0.4,
  /** Gouge/relief gain on the toll gradient, scaled by how much traffic must pass. */
  TOLL_GAIN: 1.15,
  /** A closed market only injures in proportion to the value of the tie it cut. */
  EXCLUSION_GAIN: 1.1,
  /** An open, salient market is the same read with the other sign. */
  OPENING_GAIN: 0.85,
  /** Dependency: salience is the read; trust and resentment are the two signs. */
  DEPENDENCY_GAIN: 1.2,
  /** A dependency below this salience is not a dependency worth a reason either way. */
  DEPENDENCY_FLOOR: 0.2,
});

/**
 * THE GATE. Virtual, strict, fail-closed, and read BY NAME — a flag read only through a
 * frozen-list `.every()` is invisible to the engine-gated-key walker, which is a hole
 * this estate has already been bitten by once.
 * @param {{ casusCommerciiEnabled?: boolean } | null | undefined} rules
 * @returns {boolean}
 */
export function casusCommerciiActive(rules) {
  return rules?.casusCommerciiEnabled === true;
}

/** The directed pair key: `from`'s commercial case regarding `to`.
 * @param {unknown} fromId @param {unknown} toId @returns {string} */
export function commercialPairKey(fromId, toId) {
  return `${String(fromId)}>${String(toId)}`;
}

/** @param {number} n @returns {number} */
const round4 = (n) => Math.round(n * 10000) / 10000;

/** @param {unknown} value @returns {Record<string, any>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, any>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

/**
 * ONE SCORED CANDIDATE, before the fold decides whether it materializes.
 * @typedef {{ type: string, magnitude01: number, slots: Record<string, string> }} ScoredReason
 */

/**
 * ONE SUPPRESSION — amendment B's product. Returned, never persisted.
 * @typedef {{ pairKey: string, fromId: string, toId: string, type: string,
 *   read: string, receipt: string }} CommercialSuppression
 */

/**
 * The no-evidence result, shared and frozen. Declared BEFORE its readers: this estate
 * has already paid once for a chunk-cycle TDZ, and a const used above its declaration is
 * that class's shape.
 */
const ZERO_PAIR = Object.freeze({ severance: 0, partnership: 0 });

// ── The eight scorers. Pure functions of evidence; no state, no clock, no rng. ──────

/**
 * Toll extortion and its relief — ONE read of the counterpart's entrepôt record, two
 * signs. `toll` is in TOLL_MAX-normalized units and `centrality` is how much traffic
 * must actually pass the gate, so a gouging tollbooth nobody crosses scores near zero
 * and a fair gate on a vital road warms the tie.
 * @param {{ toll01?: number|undefined, dependence01?: number|undefined }} evidence
 * @returns {{ severance: number, partnership: number }}
 */
export function scoreToll({ toll01, dependence01 } = {}) {
  if (!Number.isFinite(toll01) || !Number.isFinite(dependence01)) return ZERO_PAIR;
  const T = COMMERCIAL_REASON_TUNING;
  const level = clamp01(Number(toll01));
  const traffic = clamp01(Number(dependence01));
  const over = clamp01((level - T.FAIR_TOLL_SHARE) / Math.max(1e-6, 1 - T.FAIR_TOLL_SHARE));
  const under = clamp01((T.FAIR_TOLL_SHARE - level) / Math.max(1e-6, T.FAIR_TOLL_SHARE));
  return {
    severance: clamp01(over * traffic * T.TOLL_GAIN),
    partnership: clamp01(under * traffic * T.TOLL_GAIN),
  };
}

/**
 * Market exclusion and its opening — ONE read of the no-trade access state, two signs,
 * both scaled by the value of the tie. Shutting a market nobody used is not an injury,
 * and opening one nobody wants is not a favour.
 * @param {{ marketClosed?: boolean|undefined, salience01?: number|undefined }} evidence
 * @returns {{ severance: number, partnership: number }}
 */
export function scoreMarketAccess({ marketClosed, salience01 } = {}) {
  if (typeof marketClosed !== 'boolean' || !Number.isFinite(salience01)) return ZERO_PAIR;
  const T = COMMERCIAL_REASON_TUNING;
  const value = clamp01(Number(salience01));
  return {
    severance: marketClosed ? clamp01(value * T.EXCLUSION_GAIN) : 0,
    partnership: marketClosed ? 0 : clamp01(value * T.OPENING_GAIN),
  };
}

/**
 * Dependency fear and dependency comfort — the opportunism/hopelessness idiom, applied
 * to commerce. ONE read (how much this pair's trade is worth), two signs taken from the
 * relationship's own trust and resentment. A thin tie is neither frightening nor
 * comforting, which is what the floor says.
 * @param {{ salience01?: number|undefined, trust01?: number|undefined,
 *   resentment01?: number|undefined }} evidence
 * @returns {{ severance: number, partnership: number }}
 */
export function scoreDependency({ salience01, trust01, resentment01 } = {}) {
  if (!Number.isFinite(salience01) || !Number.isFinite(trust01) || !Number.isFinite(resentment01)) {
    return ZERO_PAIR;
  }
  const T = COMMERCIAL_REASON_TUNING;
  const value = clamp01(Number(salience01));
  if (value < T.DEPENDENCY_FLOOR) return ZERO_PAIR;
  return {
    severance: clamp01(value * clamp01(Number(resentment01)) * T.DEPENDENCY_GAIN),
    partnership: clamp01(value * clamp01(Number(trust01)) * T.DEPENDENCY_GAIN),
  };
}

/**
 * THE REGISTERED SEAM SCORER. Five pairs have no producer in this tree; each is passed
 * its typed evidence or `undefined`. Absent evidence ⇒ 0 ⇒ no record ⇒ byte-identical.
 * The shape is the seam's contract, published here so the wave that feeds it cannot
 * invent a different one.
 * @param {{ severance01?: number, partnership01?: number } | null | undefined} seam
 * @returns {{ severance: number, partnership: number }}
 */
export function scoreRegisteredSeam(seam) {
  if (!seam || typeof seam !== 'object') return ZERO_PAIR;
  return {
    severance: clamp01(num(seam.severance01)),
    partnership: clamp01(num(seam.partnership01)),
  };
}

/**
 * AMENDMENT B, executed. A belief-sourced severance cause is checked against the live
 * TRUTH read that would contradict it. Today exactly one such check is wired, and it is
 * the volume's flagship: `famine_profiteering` against physically empty warehouses.
 *
 * Returns the suppressed types with the NAME of the read that struck each one out. The
 * name is a stable engine address, not prose, so the DM receipt can say which read and a
 * future reader can go look at it.
 *
 * @param {{ stockUnits?: number|undefined, goodName?: string }} evidence
 * @returns {ReadonlyArray<{ type: string, read: string }>}
 */
export function amendmentBSuppressions({ stockUnits } = {}) {
  /** @type {Array<{ type: string, read: string }>} */
  const out = [];
  // A stock read that is ABSENT contradicts nothing — silence is not evidence of empty
  // warehouses, and treating it as such would suppress every casus in a world that has
  // never run the commodity layer. Only a PRESENT read of zero contradicts the claim.
  if (Number.isFinite(stockUnits) && Number(stockUnits) <= 0) {
    out.push({ type: 'famine_profiteering', read: 'spatialLedgers.commodityStocks' });
  }
  return Object.freeze(out);
}

/**
 * Assemble one directed pair's evidence from live state plus the registered seams.
 * Every live read is defensive: a world that has never run the entrepôt or commodity
 * layers simply yields `undefined`, which every scorer treats as no evidence rather than
 * as evidence of nothing.
 *
 * @param {{ snapshot?: any, worldState?: any, fromId: string, toId: string,
 *   relState?: any, relationshipType?: string, seams?: Record<string, any> }} input
 * @returns {Record<string, any>}
 */
export function commercialEvidenceFor({
  snapshot, worldState, fromId, toId, relState, relationshipType, seams = {},
}) {
  const pairKey = commercialPairKey(fromId, toId);
  const entrepots = asRecord(getSpatialLedger(worldState, 'entrepots'));
  const tollRecord = entrepots[String(toId)];
  const stocksLedger = asRecord(getSpatialLedger(worldState, 'commodityStocks'));
  const counterpartStocks = asRecord(stocksLedger[String(toId)]);

  const salienceRead = pairTradeSalience(snapshot, worldState, fromId, toId);
  const dominantGood = salienceRead?.ties?.[0]?.commodityId;
  const goodId = dominantGood ? String(dominantGood) : '';

  /** @type {Record<string, any>} */
  const evidence = {
    pairKey,
    fromId: String(fromId),
    toId: String(toId),
    salience01: clamp01(num(salienceRead?.salience)),
    marketClosed: NO_TRADE_RELATIONSHIPS.has(normalizeRelationshipType(relationshipType)),
    trust01: clamp01(num(relState?.trust)),
    resentment01: clamp01(num(relState?.resentment)),
    ...(goodId ? { goodId } : {}),
  };
  if (tollRecord) {
    evidence.toll01 = clamp01(num(tollRecord.toll) / Math.max(1e-6, ENTREPOT_TUNING.TOLL_MAX));
    evidence.dependence01 = clamp01(num(tollRecord.centrality));
  }
  // THE TRUTH-SIDE STOCK READ (amendment B). PRESENT-and-zero is the contradiction; an
  // ABSENT record stays absent, so a world that has never run the commodity layer cannot
  // have every casus struck out by silence.
  //
  // ⚠ THE GRAIN OF THE READ, corrected by its own pin. Reading only the pair's dominant
  // good made the suppression UNREACHABLE whenever no trade tie named one — which is most
  // pairs today, since the salience read needs commodity links the early tree rarely has.
  // A guard that cannot fire is not a guard. So: the named good's shelf when the tie names
  // one, and the counterpart's WHOLE stock book when it does not. Same evidence, coarser
  // grain, and the receipt names the same ledger either way.
  if (String(toId) in stocksLedger) {
    evidence.stockUnits = goodId
      ? num(counterpartStocks[goodId])
      : Object.values(counterpartStocks).reduce((sum, units) => sum + num(units), 0);
  }
  const seam = asRecord(seams[pairKey]);
  for (const type of SEVERANCE_REASON_TYPES) {
    if (seam[type]) evidence[`seam_${type}`] = seam[type];
  }
  return evidence;
}

/**
 * Score every taxonomy pair for one directed pair of settlements.
 * @param {Record<string, any>} evidence
 * @returns {{ scored: ScoredReason[], suppressions: ReadonlyArray<{type:string,read:string}> }}
 */
export function scoreCommercialReasons(evidence) {
  const suppressions = amendmentBSuppressions(evidence);
  const suppressed = new Set(suppressions.map((row) => row.type));
  /** @type {Record<string, { severance: number, partnership: number }>} */
  const byPair = {
    toll_extortion: scoreToll(evidence),
    market_exclusion: scoreMarketAccess(evidence),
    dependency_fear: scoreDependency(evidence),
    contract_default: scoreRegisteredSeam(evidence.seam_contract_default),
    cornering: scoreRegisteredSeam(evidence.seam_cornering),
    famine_profiteering: scoreRegisteredSeam(evidence.seam_famine_profiteering),
    contraband_injury: scoreRegisteredSeam(evidence.seam_contraband_injury),
    route_predation: scoreRegisteredSeam(evidence.seam_route_predation),
  };
  // The ledger receipt may name the pair's two towns and the good the tie carries. The
  // {route}, {house} and {band} slots the annex also authors stay UNSUPPLIED here — no
  // producer in this tree names them yet — so the picker simply never selects a variant
  // that needs one. That is the pair-only fallback doing its job, not a hole.
  /** @type {Record<string, string>} */
  const slots = {};
  if (evidence.goodId) slots.good = String(evidence.goodId);

  /** @type {ScoredReason[]} */
  const scored = [];
  for (const type of SEVERANCE_REASON_TYPES) {
    const pair = byPair[type] || ZERO_PAIR;
    // Amendment B bites HERE, before the fold: a contradicted casus never reaches the
    // ledger at all, so there is no zero-magnitude row for a reader to misread as live.
    if (!suppressed.has(type)) scored.push({ type, magnitude01: pair.severance, slots });
    scored.push({ type: COMMERCIAL_REASON_MIRRORS[type], magnitude01: pair.partnership, slots });
  }
  return { scored, suppressions };
}

/**
 * Fold one pair's freshly-scored reasons over its prior records. Presence is
 * state-derived — a magnitude below MIN_MAGNITUDE simply does not materialize, which IS
 * the decay — and `atTick` survives while a type persists, so the ledger can say how
 * many years a compact has been kept. Records are codepoint-ordered by type so the
 * serialized ledger is byte-stable across recomputes.
 *
 * @param {ReadonlyArray<Record<string, any>>|undefined} priorRecords
 * @param {ScoredReason[]} scored
 * @param {number} tick
 * @returns {Array<Record<string, any>> | null}
 */
export function foldPairCommercialReasons(priorRecords, scored, tick) {
  const T = COMMERCIAL_REASON_TUNING;
  /** @type {Map<string, Record<string, any>>} */
  const prior = new Map();
  for (const record of Array.isArray(priorRecords) ? priorRecords : []) {
    if (record && typeof record === 'object') prior.set(String(record.type), record);
  }
  const kept = [...scored]
    .filter((row) => Number.isFinite(row.magnitude01) && clamp01(row.magnitude01) >= T.MIN_MAGNITUDE)
    .sort((a, b) => (a.type < b.type ? -1 : a.type > b.type ? 1 : 0));
  if (kept.length === 0) return null;

  return kept.map((row) => {
    // Read the prior record ONCE: `prior.get(x)?.atTick` narrows nothing for a second
    // `prior.get(x)` call, so the two-lookup spelling is a strict-mode hole as well as a
    // wasted map read.
    const priorRecord = prior.get(row.type);
    const atTick = Number.isFinite(priorRecord?.atTick) ? Number(priorRecord?.atTick) : tick;
    const magnitude01 = round4(clamp01(row.magnitude01));
    const kind = commercialKindOf(row.type);
    // The seed is stable for the life of the record, so a standing grievance keeps
    // saying the same sentence instead of re-rolling its prose every tick.
    const picked = commercialReceipt(kind, `${row.type}:${atTick}`, { ...row.slots });
    return {
      type: row.type,
      magnitude01,
      receipt: picked ? picked.line : '',
      atTick,
    };
  });
}

/**
 * Enumerate the directed pairs that have a relationship edge, both ways, codepoint
 * stable. A pair with no edge has no commercial relation to have a reason about.
 * @param {any} snapshot
 * @returns {Array<{ fromId: string, toId: string, relState: any, relationshipType: string }>}
 */
export function commercialPairsOf(snapshot) {
  const states = asRecord(snapshot?.worldState?.relationshipStates);
  /** @type {Array<{ fromId: string, toId: string, relState: any, relationshipType: string }>} */
  const out = [];
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const { from, to } = getRelationshipSettlements(edge);
    if (!from || !to) continue;
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    const relationshipType = normalizeRelationshipType(relState?.relationshipType || edge?.relationshipType);
    out.push({ fromId: String(from), toId: String(to), relState, relationshipType });
    out.push({ fromId: String(to), toId: String(from), relState, relationshipType });
  }
  return out.sort((a, b) => {
    const left = commercialPairKey(a.fromId, a.toId);
    const right = commercialPairKey(b.fromId, b.toId);
    return left < right ? -1 : left > right ? 1 : 0;
  });
}

/**
 * THE ONE WRITER. Recompute every directed pair's commercial reasons from live state and
 * fold them onto `spatialLedgers.commercialReasons`.
 *
 * Dark ⇒ an immediate no-op returning the world's own reference: zero forks, zero keys,
 * byte-identical. Lit but empty ⇒ the ledger is DROPPED, so a world whose grievances all
 * healed is byte-identical to one that never had any.
 *
 * @param {{ snapshot?: any, worldState?: any, tick?: number,
 *   rules?: { casusCommerciiEnabled?: boolean }, seams?: Record<string, any> }} input
 * @returns {{ worldState: any, ledger: Record<string, any>|null,
 *   suppressions: CommercialSuppression[], crossings: Array<Record<string, any>> }}
 */
export function advanceCommercialReasons({
  snapshot, worldState, tick = 0, rules, seams = {},
} = {}) {
  if (!casusCommerciiActive(rules)) {
    return { worldState, ledger: null, suppressions: [], crossings: [] };
  }
  const T = COMMERCIAL_REASON_TUNING;
  const prior = asRecord(getSpatialLedger(worldState, COMMERCIAL_REASONS_LEDGER));
  const nameOf = (/** @type {string} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return String(item?.name || item?.settlement?.name || '');
  };

  /** @type {Record<string, any>} */
  const next = {};
  /** @type {CommercialSuppression[]} */
  const suppressions = [];
  /** @type {Array<Record<string, any>>} */
  const crossings = [];

  for (const pair of commercialPairsOf(snapshot)) {
    const { fromId, toId } = pair;
    const pairKey = commercialPairKey(fromId, toId);
    const settlement = nameOf(fromId);
    const counterpart = nameOf(toId);
    const evidence = commercialEvidenceFor({ snapshot, worldState, ...pair, seams });
    const { scored, suppressions: struck } = scoreCommercialReasons(evidence);
    for (const row of scored) {
      row.slots = { ...row.slots, ...(settlement ? { settlement } : {}), ...(counterpart ? { counterpart } : {}) };
    }
    const records = foldPairCommercialReasons(prior[pairKey], scored, tick);
    if (records) next[pairKey] = records;

    for (const strike of struck) {
      const receipt = commercialReceipt('commercial_casus_suppressed', `${pairKey}:${strike.type}`, {
        ...(settlement ? { settlement } : {}),
        ...(counterpart ? { counterpart } : {}),
        reason: strike.type.replace(/_/g, ' '),
        ...(evidence.goodId ? { good: String(evidence.goodId) } : {}),
      });
      suppressions.push({
        pairKey,
        fromId,
        toId,
        type: strike.type,
        read: strike.read,
        receipt: receipt ? receipt.line : '',
      });
    }

    // A CROSSING is a band the pair did not stand on last tick and stands on now. The
    // prior ledger is the only memory this needs, so no second state key is minted.
    const priorBy = new Map((Array.isArray(prior[pairKey]) ? prior[pairKey] : [])
      .map((record) => [String(record?.type), num(record?.magnitude01)]));
    for (const record of records || []) {
      const was = priorBy.get(String(record.type)) || 0;
      if (was >= T.CROSSING_BAND || record.magnitude01 < T.CROSSING_BAND) continue;
      const severance = SEVERANCE_REASON_TYPES.includes(record.type);
      crossings.push({
        kind: severance ? 'commercial_severance_crossing' : 'commercial_partnership_crossing',
        fromId,
        toId,
        fromName: settlement,
        toName: counterpart,
        tick,
        casusType: record.type,
        casusReceipt: record.receipt,
        reason: record.type.replace(/_/g, ' '),
        ...(evidence.goodId ? { good: String(evidence.goodId) } : {}),
      });
    }
  }

  const keys = Object.keys(next).sort();
  if (keys.length === 0) {
    return { worldState: dropSpatialLedger(worldState, COMMERCIAL_REASONS_LEDGER), ledger: null, suppressions, crossings };
  }
  /** @type {Record<string, any>} */
  const ledger = {};
  for (const key of keys) ledger[key] = next[key];
  return {
    worldState: setSpatialLedger(worldState, COMMERCIAL_REASONS_LEDGER, ledger),
    ledger,
    suppressions,
    crossings,
  };
}

/**
 * THE CROSS-LAYER READ (CPL-1 TRADE→WAR, registered in couplingRegistryTrade.js).
 *
 * One evidence factory, two signs — the WR-3 idiom. `severancePressureOf` is the
 * aggrieved party's standing commercial case against a counterpart; `partnershipRestraintOf`
 * is the SAME ledger read the other way, the value of the tie that argues against
 * breaking it. tradeWar's escalation deposit consumes the difference, so a court with a
 * real grievance escalates a little sooner and a court with a real partnership a little
 * later, and both are receipted from the same rows.
 *
 * Absent ledger ⇒ both are 0 ⇒ the caller is byte-identical. No mutation, no clock.
 *
 * @param {any} worldState
 * @returns {{ severancePressureOf: (from: any, to: any) => { magnitude01: number, type: string|null, receipt: string },
 *   partnershipRestraintOf: (from: any, to: any) => { magnitude01: number, type: string|null, receipt: string } }}
 */
export function makeCommercialPressureRead(worldState) {
  const ledger = asRecord(getSpatialLedger(worldState, COMMERCIAL_REASONS_LEDGER));
  const severanceSet = new Set(SEVERANCE_REASON_TYPES);
  /** @param {any} from @param {any} to @param {boolean} wantSeverance */
  const strongest = (from, to, wantSeverance) => {
    const records = ledger[commercialPairKey(from, to)];
    let best = { magnitude01: 0, type: /** @type {string|null} */ (null), receipt: '' };
    for (const record of Array.isArray(records) ? records : []) {
      const type = String(record?.type);
      if (severanceSet.has(type) !== wantSeverance) continue;
      const magnitude01 = clamp01(num(record?.magnitude01));
      if (magnitude01 <= best.magnitude01) continue;
      best = { magnitude01, type, receipt: String(record?.receipt || '') };
    }
    return best;
  };
  return {
    severancePressureOf: (from, to) => strongest(from, to, true),
    partnershipRestraintOf: (from, to) => strongest(from, to, false),
  };
}

/** The belief-sourced causes, re-exported so consumers name them through the taxonomy. */
export { BELIEF_SOURCED_SEVERANCE_TYPES };
