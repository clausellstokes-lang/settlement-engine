/**
 * lineageClaim.js — WR-3's lineage casus and its peace mirror.
 *
 * A campaign-member child carries the durable `parentRef`; the regional graph
 * proves that the two living members can still reach one another.  One
 * memoized read then interprets that same evidence in both directions:
 *
 *   parent -> child  the child has fallen below its founding baseline
 *   child  -> parent the child has outgrown the elder seat
 *
 * No inversion means no claim.  The surviving founding edge is instead a
 * kinship bond.  Sustained, non-predatory parent -> child provisioning that is
 * corroborated by both the pair record and the chronicle defeats an otherwise
 * live claim exactly: score zero, with a structured suppression receipt for the
 * later reader-facing WR-3 surface.
 *
 * Pure leaf: no rng, clock, store, or mover imports.  The exact-true virtual
 * flag is checked before any graph, member, or history census so a dark world
 * keeps the old reason ledgers byte-for-byte.
 */

import { TIER_ORDER, popToTier } from '../../data/constants.js';
import { clamp01 } from '../../kernel/math.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
import { lineageReceipt } from './eventProse.js';

export const LINEAGE_CLAIM_TUNING = Object.freeze({
  /** A population-only reversal must clear this fractional gap. */
  INVERSION_THRESHOLD: 0.15,
  /** One lineage reason may colour, but never dominate, the shared aggregate. */
  CLAIM_WEIGHT_CAP: 0.8,
});

const DEAD_EDGE_STATUSES = new Set(['disabled', 'dormant', 'inactive', 'removed', 'destroyed', 'severed']);
const AID_CHRONICLE_KINDS = new Set([
  'generosity_relief',
  'generosity_refuge',
  'generosity_trade_overture',
  'relief_given',
  'refuge_granted',
  'trade_warmth',
]);
const AID_RELATIONSHIP_KINDS = new Set(['relief_given', 'relief_received', 'refuge_granted', 'trade_warmth']);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number|null} */
function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value).trim();
}

/** @param {unknown} item @returns {Record<string, unknown>} */
function settlementOf(item) {
  const row = asObject(item);
  const save = asObject(row.save);
  return asObject(row.settlement || save.settlement || item);
}

/** @param {unknown} item @param {string} fallback @returns {string} */
function settlementName(item, fallback) {
  const row = asObject(item);
  const settlement = settlementOf(item);
  return text(row.name || settlement.name) || fallback;
}

/** @param {unknown} item @returns {string} */
function governingHouseOf(item) {
  const settlement = settlementOf(item);
  const power = asObject(settlement.powerStructure);
  const named = text(power.governingName);
  if (named) return named;
  const factions = Array.isArray(power.factions) ? power.factions.map(asObject) : [];
  const governing = factions.find((faction) => faction.isGoverning === true);
  return text(governing?.faction || governing?.name || governing?.label);
}

/** @param {unknown} item @returns {number|null} */
function populationOf(item) {
  const settlement = settlementOf(item);
  const direct = finiteNumber(settlement.population);
  if (direct != null) return Math.max(0, direct);
  const config = asObject(settlement.config);
  const configured = finiteNumber(config.population);
  return configured == null ? null : Math.max(0, configured);
}

/** @param {unknown} item @returns {number} */
function tierRankOf(item) {
  const settlement = settlementOf(item);
  const config = asObject(settlement.config);
  let tier = text(settlement.tier || config.tier).toLowerCase();
  if (!TIER_ORDER.includes(tier)) {
    const population = populationOf(item);
    tier = population == null ? '' : popToTier(population);
  }
  return TIER_ORDER.indexOf(tier);
}

/** A lifecycle marker is the engine's remnant/death stamp; zero people is dead too.
 * @param {unknown} item @returns {boolean} */
function isRemnant(item) {
  const settlement = settlementOf(item);
  const config = asObject(settlement.config);
  const status = text(settlement.status || settlement.lifecycleStatus || config.lifecycleStatus).toLowerCase();
  const population = populationOf(item);
  return config._destroyed === true
    || ['destroyed', 'ruined', 'remnant'].includes(status)
    || !!text(settlement.lifecycleStatus || config.lifecycleStatus)
    || population === 0;
}

/** @param {unknown} item @returns {Record<string, unknown>|null} */
export function parentRefOf(item) {
  const row = asObject(item);
  const save = asObject(row.save);
  const settlement = settlementOf(item);
  const config = asObject(settlement.config);
  const candidate = row.parentRef || settlement.parentRef || config.parentRef || save.parentRef;
  const ref = asObject(candidate);
  if (!Object.keys(ref).length) return null;
  const status = text(ref.status).toLowerCase();
  if (ref.active === false || ref.severed === true || DEAD_EDGE_STATUSES.has(status)) return null;
  return ref;
}

/** @param {Record<string, unknown>|null} ref @returns {string} */
function parentIdOf(ref) {
  return text(ref?.parentId || ref?.parentSaveId || ref?.parentSettlementId || ref?.founderId);
}

/** @param {Record<string, unknown>} ref @returns {number|null} */
function foundingPopulationOf(ref) {
  // Graduation is the moment the campaign-member baseline becomes real. Older
  // hand-authored refs used `foundingPopulation`; keep that spelling as a
  // tolerant fallback, never as a second authority.
  const value = finiteNumber(ref.graduationPopulation
    ?? ref.foundingPopulation
    ?? ref.populationAtFounding
    ?? ref.baselinePopulation);
  return value == null ? null : Math.max(0, value);
}

/** @param {Record<string, unknown>} ref @returns {number} */
function foundingTierRankOf(ref) {
  const tier = text(ref.graduationTier || ref.foundingTier || ref.tierAtFounding || ref.baselineTier).toLowerCase();
  if (TIER_ORDER.includes(tier)) return TIER_ORDER.indexOf(tier);
  const population = foundingPopulationOf(ref);
  return population == null ? -1 : TIER_ORDER.indexOf(popToTier(population));
}

/** Any non-terminal direct regional edge is live; missing status is the legacy
 * active spelling used by many fixtures and imported graphs.
 * @param {unknown} edge @returns {boolean} */
function liveEdge(edge) {
  const row = asObject(edge);
  const from = text(row.from || row.source || row.a || row.settlementAId);
  const to = text(row.to || row.target || row.b || row.settlementBId);
  if (!from || !to || from === to) return false;
  return !DEAD_EDGE_STATUSES.has(text(row.status).toLowerCase());
}

/** @param {unknown} edge @param {string} a @param {string} b @returns {boolean} */
function joins(edge, a, b) {
  const row = asObject(edge);
  const from = text(row.from || row.source || row.a || row.settlementAId);
  const to = text(row.to || row.target || row.b || row.settlementBId);
  return liveEdge(row) && ((from === a && to === b) || (from === b && to === a));
}

/** A tier step is categorical proof of inversion. Map it into the same bounded
 * 0..1 space as population before the one threshold/cap pair is applied.
 * @param {number} gap @returns {number} */
function tierGap01(gap) {
  if (!(gap > 0)) return 0;
  const threshold = LINEAGE_CLAIM_TUNING.INVERSION_THRESHOLD;
  return clamp01(threshold + (gap / Math.max(1, TIER_ORDER.length - 1)) * (1 - threshold));
}

/** @param {number|null} smaller @param {number|null} baseline @returns {number} */
function fractionalShortfall(smaller, baseline) {
  if (smaller == null || baseline == null || baseline <= 0 || smaller >= baseline) return 0;
  return clamp01((baseline - smaller) / baseline);
}

/** @param {number|null} larger @param {number|null} baseline @returns {number} */
function fractionalOutgrowth(larger, baseline) {
  if (larger == null || baseline == null || baseline <= 0 || larger <= baseline) return 0;
  return clamp01((larger - baseline) / Math.max(larger, baseline));
}

/** @param {unknown} row @returns {string} */
function recordKind(row) {
  const value = asObject(row);
  const metadata = asObject(value.metadata);
  return text(value.impactKind || value.candidateType || value.type || value.kind
    || metadata.impactKind || metadata.candidateType || metadata.type || metadata.kind).toLowerCase();
}

/** @param {unknown} row @param {string} parentId @param {string} childId @returns {boolean} */
function recordsDirectedAid(row, parentId, childId) {
  const value = asObject(row);
  const metadata = asObject(value.metadata);
  const giver = text(value.giverId || value.fromId || metadata.giverId || metadata.fromId);
  const receiver = text(value.receiverId || value.toId || metadata.receiverId || metadata.toId);
  if (giver || receiver) return giver === parentId && receiver === childId;
  const ids = Array.isArray(value.settlementIds)
    ? value.settlementIds.map(text)
    : Array.isArray(value.affectedSettlementIds) ? value.affectedSettlementIds.map(text) : [];
  // Generosity receipts preserve giver -> receiver order.  An unordered pair is
  // not enough to manufacture the direction of care.
  return ids[0] === parentId && ids[1] === childId;
}

/** @param {Record<string, unknown>} worldState @returns {Array<{ row: Record<string, unknown>, tick: number }>} */
function chronicleRows(worldState) {
  const history = Array.isArray(worldState.pulseHistory) ? worldState.pulseHistory : [];
  /** @type {Array<{ row: Record<string, unknown>, tick: number }>} */
  const rows = [];
  for (const pulseValue of history) {
    const pulse = asObject(pulseValue);
    const pulseTick = finiteNumber(pulse.tick) ?? 0;
    for (const lane of ['selectedOutcomes', 'impactDigest']) {
      const records = Array.isArray(pulse[lane]) ? pulse[lane] : [];
      for (const raw of records) {
        const row = asObject(raw);
        if (!Object.keys(row).length) continue;
        rows.push({ row, tick: finiteNumber(row.tick) ?? pulseTick });
      }
    }
  }
  return rows;
}

/** The actual pair record and chronicle must independently say the provision
 * was sustained.  Neither a lone gift nor an undirected warm relationship can
 * erase a claim by itself.
 * @param {{ worldState: Record<string, unknown>, edge: Record<string, unknown>,
 *   parentId: string, childId: string, parentRef?: Record<string, unknown>|null,
 *   parentItem?: unknown }} args
 * @returns {{ recordKind: string, recordTick: number, relationshipKey: string,
 *   chronicleKind: string, receipt: string } | null}
 */
export function sustainedProvisioningFor({ worldState, edge, parentId, childId, parentRef = null, parentItem = null }) {
  // The graduation seam freezes the ids of parent population-history rows that
  // actually provisioned this satellite. The immutable pair record and the
  // parent's live population chronicle must agree on at least two transfers;
  // neither side alone is permitted to erase a casus.
  const provisioningRecord = asObject(asObject(parentRef).provisioningRecord);
  const recordedIds = Array.isArray(provisioningRecord.evidenceIds)
    ? [...new Set(provisioningRecord.evidenceIds.map(text).filter(Boolean))]
    : [];
  const parentHistory = Array.isArray(settlementOf(parentItem).populationHistory)
    ? settlementOf(parentItem).populationHistory.map(asObject)
    : [];
  const historyById = new Map(parentHistory
    .map((row) => [text(row.outcomeId || row.id), row])
    .filter(([id]) => !!id));
  const matchedProvisioning = recordedIds
    .map((id) => historyById.get(id))
    .filter(Boolean);
  if (text(provisioningRecord.kind) === 'founding_support'
    && text(provisioningRecord.fromId) === parentId
    && matchedProvisioning.length >= 2) {
    const recordTick = Math.max(...matchedProvisioning.map((row) => finiteNumber(row?.tick) ?? 0));
    return {
      recordKind: 'founding_support',
      recordTick,
      relationshipKey: relationshipKeyFromEdge(edge),
      chronicleKind: 'population_history',
      receipt: `The founding-support record and the population chronicle both show ${parentId} provisioning ${childId}. The family record contradicts a sack, and the claim is stayed.`,
    };
  }

  const ledgers = asObject(worldState.spatialLedgers);
  const overtures = asObject(ledgers.tradeOverture);
  const overture = asObject(overtures[`${parentId}:${childId}`]);
  const overtureSustained = overture.initiated === true;

  const obligations = asObject(ledgers.obligations);
  let obligation = null;
  let predatoryObligation = false;
  for (const raw of Object.values(obligations)) {
    const row = asObject(raw);
    if (text(row.kind) !== 'grain_relief') continue;
    // Gift obligations name receiver/debtor first and giver/creditor second.
    if (text(row.from) !== childId || text(row.to) !== parentId) continue;
    const minted = finiteNumber(row.mintTick);
    const last = finiteNumber(row.lastTick);
    if (minted != null && last != null && last > minted) {
      if (row.predatory === true) predatoryObligation = true;
      else obligation = row;
    }
  }

  const relationshipKey = relationshipKeyFromEdge(edge);
  const relationshipState = asObject(asObject(worldState.relationshipStates)[relationshipKey]);
  const relationshipRows = [
    ...(Array.isArray(relationshipState.recentIncidents) ? relationshipState.recentIncidents : []),
    ...(Array.isArray(relationshipState.history) ? relationshipState.history : []),
  ].map(asObject).filter((row) => AID_RELATIONSHIP_KINDS.has(text(row.type || row.kind).toLowerCase()));
  const relationshipTicks = new Set(relationshipRows
    .map((row) => finiteNumber(row.tick))
    .filter((value) => value != null));
  const warmIncident = relationshipRows.find((row) => text(row.type || row.kind).toLowerCase() === 'trade_warmth');
  const relationshipSustained = overtureSustained || !!obligation || !!warmIncident
    || (!predatoryObligation && relationshipTicks.size >= 2);
  if (!relationshipSustained) return null;

  const directedChronicle = chronicleRows(worldState)
    .filter(({ row }) => AID_CHRONICLE_KINDS.has(recordKind(row)) && recordsDirectedAid(row, parentId, childId));
  const overtureChronicle = directedChronicle.find(({ row }) => recordKind(row) === 'generosity_trade_overture');
  const chronicleTicks = new Set(directedChronicle.map(({ tick }) => tick));
  if (!overtureChronicle && chronicleTicks.size < 2) return null;

  const actualRecordKind = overtureSustained
    ? 'trade_overture'
    : obligation ? 'grain_relief_obligation' : warmIncident ? 'trade_warmth' : 'relief_history';
  const recordTick = Math.max(
    finiteNumber(overture.lastTick) ?? 0,
    obligation ? finiteNumber(obligation.lastTick) ?? 0 : 0,
    ...relationshipRows.map((row) => finiteNumber(row.tick) ?? 0),
    ...directedChronicle.map(({ tick }) => tick),
  );
  const chronicleKind = overtureChronicle ? 'generosity_trade_overture' : recordKind(directedChronicle[0]?.row);
  const recordWords = actualRecordKind === 'trade_overture'
    ? 'the sustained trade-overture record'
    : actualRecordKind === 'grain_relief_obligation'
      ? 'the repeatedly renewed relief ledger'
      : actualRecordKind === 'trade_warmth'
        ? 'the relationship record of a warmed grain road'
        : 'the relationship history of repeated relief';
  return {
    recordKind: actualRecordKind,
    recordTick,
    relationshipKey,
    chronicleKind,
    receipt: `${recordWords} and the chronicle both show ${settlementName({ id: parentId }, parentId)} provisioning ${settlementName({ id: childId }, childId)}. The family record contradicts a sack, and the claim is stayed.`,
  };
}

/** Replace id fallbacks in the suppression sentence with live names without
 * changing which evidence won. @param {Record<string, unknown>} suppression
 * @param {string} parentName @param {string} childName */
function namedSuppression(suppression, parentName, childName) {
  const recordWords = suppression.recordKind === 'founding_support'
    ? 'The founding-support record and the population chronicle both show'
    : suppression.recordKind === 'trade_overture'
    ? 'The sustained trade-overture record'
    : suppression.recordKind === 'grain_relief_obligation'
      ? 'The repeatedly renewed relief ledger'
      : suppression.recordKind === 'trade_warmth'
        ? 'The relationship record of a warmed grain road'
        : 'The relationship history of repeated relief';
  const receipt = suppression.recordKind === 'founding_support'
    ? `${recordWords} ${parentName} provisioning ${childName}. The family record contradicts a sack, and the claim is stayed.`
    : `${recordWords} and the chronicle both show ${parentName} provisioning ${childName}. The family record contradicts a sack, and the claim is stayed.`;
  return {
    ...suppression,
    receipt,
  };
}

/** @typedef {{ eligible: true, direction: 'parent_to_child'|'child_to_parent',
 * parentId: string, childId: string, parentName: string, childName: string,
 * childHouseName: string,
 * inversion01: number, claimScore01: number, bondScore01: number,
 * suppression: ReturnType<typeof sustainedProvisioningFor> }} LineageStanding */

/**
 * Score the casus from a precomputed standing. Exported separately for the
 * taxonomy's reachability witness and focused unit pins.
 * @param {{ standing?: LineageStanding|null }} args
 * @returns {{ score: number, receipt: string, evidence?: Record<string, number>,
 *   suppressed?: boolean, suppression?: NonNullable<LineageStanding['suppression']> }}
 */
export function scoreLineageClaim({ standing } = {}) {
  if (!standing?.eligible) return { score: 0, receipt: '' };
  const evidence = {
    lineageEdge: 1,
    inversion01: clamp01(standing.inversion01),
    parentDirection: standing.direction === 'parent_to_child' ? 1 : 0,
  };
  if (standing.suppression) {
    return {
      score: 0,
      receipt: standing.suppression.receipt,
      evidence: { ...evidence, provisioningContradiction: 1 },
      suppressed: true,
      suppression: standing.suppression,
    };
  }
  if (standing.claimScore01 <= 0) return { score: 0, receipt: '' };
  const parentDirection = standing.direction === 'parent_to_child';
  const kind = parentDirection ? 'casus_lineage_claim_parent' : 'casus_lineage_claim_child';
  const voice = lineageReceipt(kind, `reason:${standing.parentId}:${standing.childId}:${standing.direction}`, {
    settlement: parentDirection ? standing.parentName : standing.childName,
    counterpart: parentDirection ? standing.childName : standing.parentName,
    band: 'well',
    house: standing.childHouseName,
  });
  if (!voice) throw new Error(`${kind} receipt vocabulary is incomplete`);
  return { score: clamp01(standing.claimScore01), receipt: voice.line, evidence };
}

/** The mirror off the same standing. A healthy edge is a full bond; inversion
 * erodes it, and corroborated care restores it strongly enough to win.
 * @param {{ standing?: LineageStanding|null }} args
 * @returns {{ score: number, receipt: string, evidence?: Record<string, number> }}
 */
export function scoreKinshipBond({ standing } = {}) {
  if (!standing?.eligible || standing.bondScore01 <= 0) return { score: 0, receipt: '' };
  const provisioned = standing.suppression ? 1 : 0;
  const voice = lineageReceipt(
    'mirror_kinship_bond',
    `reason:${standing.parentId}:${standing.childId}:bond`,
    { settlement: standing.parentName, counterpart: standing.childName },
  );
  if (!voice) throw new Error('mirror_kinship_bond receipt vocabulary is incomplete');
  return {
    score: clamp01(standing.bondScore01),
    receipt: voice.line,
    evidence: {
      lineageEdge: 1,
      inversion01: clamp01(standing.inversion01),
      provisioningContradiction: provisioned,
    },
  };
}

/** Exact-true virtual gate. @param {unknown} worldState @returns {boolean} */
export function lineageClaimActive(worldState) {
  return asObject(asObject(worldState).simulationRules).lineageClaimEnabled === true;
}

/**
 * Build the one per-pass lineage context shared by the war and peace movers.
 * @param {{ snapshot?: { byId?: Map<string, unknown>, settlements?: unknown[], regionalGraph?: { edges?: unknown[] } } | null,
 *   worldState: Record<string, unknown>, graph?: { edges?: unknown[] } | null }} args
 */
export function makeLineageClaimRead({ snapshot, worldState, graph }) {
  const lit = lineageClaimActive(worldState);
  if (!lit) {
    const zero = () => ({ score: 0, receipt: '' });
    return { lit: false, lineageStandingOf: () => null, lineageClaimOf: zero, kinshipBondOf: zero };
  }

  const snapshotRow = asObject(snapshot);
  const settlements = Array.isArray(snapshotRow.settlements) ? snapshotRow.settlements : [];
  /** @type {Map<string, unknown>} */
  const byId = snapshotRow.byId instanceof Map
    ? /** @type {Map<string, unknown>} */ (snapshotRow.byId)
    : new Map(settlements.map((item) => [text(asObject(item).id), item]));
  const graphRow = asObject(graph);
  const snapshotGraph = asObject(snapshotRow.regionalGraph);
  const edges = Array.isArray(graphRow.edges)
    ? graphRow.edges
    : Array.isArray(snapshotGraph.edges) ? snapshotGraph.edges : [];

  /** @type {Map<string, Record<string, unknown>>} */
  const liveEdges = new Map();
  /** @type {Map<string, Record<string, unknown>>} */
  const liveEdgesById = new Map();
  for (const raw of edges) {
    const edge = asObject(raw);
    if (!liveEdge(edge)) continue;
    const from = text(edge.from || edge.source || edge.a || edge.settlementAId);
    const to = text(edge.to || edge.target || edge.b || edge.settlementBId);
    const key = [from, to].sort().join('\u0000');
    if (!liveEdges.has(key)) liveEdges.set(key, edge);
    const edgeId = text(edge.id);
    if (edgeId && !liveEdgesById.has(edgeId)) liveEdgesById.set(edgeId, edge);
  }

  /** @type {Map<string, LineageStanding|null>} */
  const cache = new Map();
  /** @param {string} fromId @param {string} toId @returns {LineageStanding|null} */
  const standingFor = (fromId, toId) => {
    const from = text(fromId);
    const to = text(toId);
    const cacheKey = `${from}>${to}`;
    if (cache.has(cacheKey)) return /** @type {LineageStanding|null} */ (cache.get(cacheKey));
    const fromItem = byId.get(from);
    const toItem = byId.get(to);
    if (!fromItem || !toItem || isRemnant(fromItem) || isRemnant(toItem)) {
      cache.set(cacheKey, null);
      return null;
    }
    const toRef = parentRefOf(toItem);
    const fromRef = parentRefOf(fromItem);
    /** @type {'parent_to_child'|'child_to_parent'|null} */
    let direction = null;
    let parentId = '';
    let childId = '';
    let parentItem = null;
    let childItem = null;
    let parentRef = null;
    if (parentIdOf(toRef) === from) {
      direction = 'parent_to_child';
      parentId = from; childId = to; parentItem = fromItem; childItem = toItem; parentRef = toRef;
    } else if (parentIdOf(fromRef) === to) {
      direction = 'child_to_parent';
      parentId = to; childId = from; parentItem = toItem; childItem = fromItem; parentRef = fromRef;
    }
    if (!direction || !parentRef) {
      cache.set(cacheKey, null);
      return null;
    }
    const liveEdgeId = text(parentRef.liveEdgeId);
    const edge = liveEdgeId
      ? liveEdgesById.get(liveEdgeId)
      : liveEdges.get([from, to].sort().join('\u0000'));
    if (!edge || !joins(edge, from, to)) {
      cache.set(cacheKey, null);
      return null;
    }

    const parentRank = tierRankOf(parentItem);
    const childRank = tierRankOf(childItem);
    const parentPopulation = populationOf(parentItem);
    const childPopulation = populationOf(childItem);
    // DECLARED WITHOUT AN INITIALIZER ON PURPOSE. `direction` is proven non-null by
    // the guard above, so the if/else below is EXHAUSTIVE and both arms assign before
    // the first read at `clears`. A `= 0` seed here is dead on every path — that is
    // what `no-useless-assignment` reported — and worse, it would silently supply a
    // neutral value if a future third direction were ever added, hiding the hole
    // instead of throwing. Leave it unassigned so an unhandled arm is a TDZ error.
    /** @type {number} */
    let inversion01;
    if (direction === 'parent_to_child') {
      const foundingRank = foundingTierRankOf(parentRef);
      const tierInversion = foundingRank >= 0 && childRank >= 0 ? tierGap01(foundingRank - childRank) : 0;
      const populationInversion = fractionalShortfall(childPopulation, foundingPopulationOf(parentRef));
      inversion01 = Math.max(tierInversion, populationInversion);
    } else {
      const tierInversion = parentRank >= 0 && childRank >= 0 ? tierGap01(childRank - parentRank) : 0;
      const populationInversion = fractionalOutgrowth(childPopulation, parentPopulation);
      inversion01 = Math.max(tierInversion, populationInversion);
    }

    const clears = inversion01 > LINEAGE_CLAIM_TUNING.INVERSION_THRESHOLD;
    const claimScore01 = clears ? Math.min(LINEAGE_CLAIM_TUNING.CLAIM_WEIGHT_CAP, inversion01) : 0;
    const ordinaryBond = clears
      ? 0
      : LINEAGE_CLAIM_TUNING.CLAIM_WEIGHT_CAP
        * clamp01(1 - inversion01 / LINEAGE_CLAIM_TUNING.INVERSION_THRESHOLD);
    const parentName = settlementName(parentItem, parentId);
    const childName = settlementName(childItem, childId);
    const rawSuppression = claimScore01 > 0
      ? sustainedProvisioningFor({ worldState, edge, parentId, childId, parentRef, parentItem })
      : null;
    const suppression = rawSuppression ? namedSuppression(rawSuppression, parentName, childName) : null;
    const standing = /** @type {LineageStanding} */ ({
      eligible: true,
      direction,
      parentId,
      childId,
      parentName,
      childName,
      childHouseName: governingHouseOf(childItem),
      inversion01: clamp01(inversion01),
      // Keep the would-be claim magnitude in the shared standing.  The war
      // projection returns exact zero when `suppression` is present, while the
      // counterforce projection can still prove what it defeated.
      claimScore01: clamp01(claimScore01),
      bondScore01: suppression ? LINEAGE_CLAIM_TUNING.CLAIM_WEIGHT_CAP : clamp01(ordinaryBond),
      suppression,
    });
    cache.set(cacheKey, standing);
    return standing;
  };

  return {
    lit: true,
    lineageStandingOf(fromId, toId) { return standingFor(String(fromId), String(toId)); },
    lineageClaimOf(fromId, toId) { return scoreLineageClaim({ standing: standingFor(String(fromId), String(toId)) }); },
    kinshipBondOf(partyId, foeId) { return scoreKinshipBond({ standing: standingFor(String(partyId), String(foeId)) }); },
  };
}
