/**
 * domain/display/decreeTracker.js — THE DECREE TRACKER (design
 * docs/DESIGN_CHRONICLE_LEGIBILITY.md §5 + §5b), the owner's second, verbatim-
 * anchored requirement: "how those recent changes were reflected, or not ... it
 * should be noted for the user because that was their choice."
 *
 * For every DM-queued change applied during the advance (surfacing as an outcome
 * with applyMode:'proposal' / a proposalPayload — the durable footprint of the
 * choice), this derives:
 *   (a) WHEN it landed — week k of N, parsed from the realm-verb outcome id's
 *       nowTick where present; else "during the {span}" (the collapse removes
 *       interior week for non-verb decrees — an honest degrade).
 *   (b) the DIRECT receipt — the decree's own outcome.
 *   (c) the CAUSAL CONE — co-advance nodes whose entity keys intersect the
 *       decree's (the INFERRED cone; §5c's receipt-id provenance DAG does not
 *       exist in durable data — a REPORTED SEAM, labelled `inferred`), each
 *       shared descendant attributed ONCE.
 *   (d) span-end STANDING — held / absorbed / contested / undone (with the
 *       breaking event linked), DERIVED (no durable standing field exists) and
 *       labelled `inferred`.
 *   (e) HONEST NULLS — an empty cone is REPORTED as a finding
 *       ("no measurable downstream effect"), never silently dropped.
 *
 * §5b ENTANGLEMENT CONSOLIDATION (owner amendment): decrees whose cones interact
 * render as ONE cluster (chained / shared / conflicting / synergistic), with
 * SELF-CONFLICT ("your embargo undid your granary order") a first-class named
 * finding. Every decree appears EXACTLY ONCE — singleton, in one cluster, or as a
 * null (the completeness pin).
 *
 * PLACEMENT (owner ruling): always present, findable, never top-forced — a
 * consistent section of every advance report. Pure, deterministic, non-persisting.
 *
 * @enforced-by tests/domain/decreeTracker.test.js (completeness = every op once
 *   incl. the null case; the two-decree conflict fixture renders as ONE cluster
 *   naming the conflict; determinism)
 */

import { nodesFromRecord, isDecreeNode } from './chronicleGraph.js';

/** @typedef {import('./chronicleGraph.js').ChronicleNode} ChronicleNode */
/** @typedef {import('./chronicleGraph.js').PulseOutcome} PulseOutcome */
/** @typedef {import('./chronicleGraph.js').AdvanceEntry} AdvanceEntry */
/** @typedef {{ prevTick: number, tick: number, spanWeeks: number }} SpanFrame */

/**
 * @typedef {Object} Decree  one applied DM decree with its derived cone/standing (§5)
 * @property {string} decreeId
 * @property {string} kind
 * @property {{ week: number|null, ofWeeks: number, label: string, inferred: boolean }} landing
 * @property {PulseOutcome} receipt
 * @property {string[]} keys
 * @property {string[]} cone
 * @property {ChronicleNode[]} coneNodes
 * @property {number} coneSize
 * @property {'held'|'absorbed'|'contested'|'undone'|'null'} standing
 * @property {boolean} standingInferred
 * @property {boolean} contested
 * @property {PulseOutcome|null} breakingEvent
 * @property {string|null} breakingReason
 * @property {boolean} honestNull
 * @property {string|null} finding
 */

/**
 * @typedef {Object} Cluster  an entangled decree cluster (§5b)
 * @property {string} clusterId
 * @property {'conflicting'|'chained'|'synergistic'|'shared'} relation
 * @property {boolean} selfConflict
 * @property {string|null} conflictText
 * @property {string} jointStory
 * @property {Array<{ decreeId: string, kind: string, landing: Decree['landing'], standing: string, standingInferred: boolean, receipt: PulseOutcome, standingWithin: string }>} decrees
 * @property {string[]} sharedDescendants
 * @property {string[]} memberIds
 */

/**
 * @typedef {Object} DecreeSection  the always-present decree section for one advance
 * @property {number} total
 * @property {Decree[]} singletons
 * @property {Cluster[]} clusters
 * @property {Decree[]} nulls
 * @property {Array<{ decreeId?: string, clusterId?: string, kind?: string, text: string|null }>} findings
 */

const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The landing week of a decree within its advance. Realm-verb outcome ids embed
 * the applying tick: `realm_verb.<verb>.<actorId>.<nowTick>.<argHash>`. When
 * present we recover "week k of N"; otherwise the collapse leaves only "during the
 * span" (honest — the interior week is not durable).
 * @param {PulseOutcome} raw   the decree's outcome
 * @param {SpanFrame} entry
 * @returns {{ week: number|null, ofWeeks: number, label: string, inferred: boolean }}
 */
export function landingWeek(raw, entry) {
  const id = String(raw?.id || '');
  const parts = id.split('.');
  let landedTick = null;
  if (parts[0] === 'realm_verb' && parts.length >= 4) {
    const t = Number(parts[3]);
    if (Number.isFinite(t)) landedTick = t;
  }
  const ofWeeks = Math.max(1, Number(entry?.spanWeeks) || 1);
  if (landedTick == null) return { week: null, ofWeeks, label: `during the span`, inferred: false };
  const k = Math.max(1, Math.min(ofWeeks, landedTick - (Number(entry?.prevTick) || 0)));
  return { week: k, ofWeeks, label: `week ${k} of ${ofWeeks}`, inferred: false };
}

/**
 * A short human name for the decree's kind (the verb, or the payload kind, or a
 * generic label). Register-safe (structural, no authored prose).
 * @param {PulseOutcome} raw
 * @returns {string}
 */
export function decreeKind(raw) {
  const id = String(raw?.id || '');
  if (id.startsWith('realm_verb.')) return id.split('.')[1] || 'order';
  const k = raw?.proposalPayload?.kind;
  if (k) return String(k).replace(/_/g, ' ');
  return 'decree';
}

/**
 * Does node B REVERSE decree/node A's effect? Conservative, mechanical signals
 * over the durable payloads (the conflict detector for §5b + the undone standing):
 *  · same relationshipKey pushed to an OPPOSITE label (alliance ⇄ hostile);
 *  · a tierChange that moves a settlement the opposite direction A moved it;
 *  · a destructive stressor (siege/occupation/famine) landing on A's target.
 * INFERRED — there is no durable "reverses" edge. Returns null when no signal.
 * @param {PulseOutcome} a  the earlier op's raw outcome
 * @param {PulseOutcome} b  the candidate later node's raw outcome
 * @returns {string|null}  a reason string when B reverses A, else null
 */
export function reversalSignal(a, b) {
  if (!a || !b || a === b) return null;
  const aKey = a.relationshipKey || a.proposalPayload?.relationshipKey;
  const bKey = b.relationshipKey || b.proposalPayload?.relationshipKey;
  if (aKey && bKey && String(aKey) === String(bKey)) {
    const aTo = String(a.proposalPayload?.toType || '');
    const bTo = String(b.proposalPayload?.toType || '');
    const hostile = (/** @type {string} */ t) => t === 'hostile';
    const friendly = (/** @type {string} */ t) => /ally|alliance|vassal|friendly/i.test(t);
    if (aTo && bTo && aTo !== bTo && (hostile(aTo) !== hostile(bTo) || friendly(aTo) !== friendly(bTo))) {
      return `the relationship was pushed back from ${aTo || 'its set state'} to ${bTo}`;
    }
  }
  // Opposite tier movement on the same settlement.
  const aTarget = String(a.targetSaveId ?? '');
  if (aTarget && String(b.targetSaveId ?? '') === aTarget) {
    const aDir = tierDir(a.tierChange);
    const bDir = tierDir(b.tierChange);
    if (aDir && bDir && aDir !== bDir) return `${aTarget} moved back the other way`;
  }
  // A destructive stressor on A's target.
  const destructive = new Set(['siege', 'occupation', 'famine', 'disease_outbreak', 'rebellion', 'insurgency']);
  if (aTarget && b.stressor && destructive.has(String(b.stressor.type)) && (b.stressor.affectedSettlementIds || []).map(String).includes(aTarget)) {
    return `a ${String(b.stressor.type).replace(/_/g, ' ')} struck ${aTarget}`;
  }
  return null;
}

/** Direction a tierChange moved (+1 up / -1 down / null).
 *  @param {{ from?: unknown, to?: unknown }|null|undefined} tc */
function tierDir(tc) {
  if (!tc || tc.from == null || tc.to == null) return null;
  const f = Number(tc.from), t = Number(tc.to);
  if (!Number.isFinite(f) || !Number.isFinite(t) || f === t) return null;
  return t > f ? 1 : -1;
}

/**
 * Build the raw per-decree record: cone (co-advance entity-linked nodes, attributed
 * once), landing, standing, honest-null. `keyOwners` maps each entity key to the
 * node ids that carry it. Pure.
 * @param {ChronicleNode} decreeNode
 * @param {ChronicleNode[]} allNodes
 * @param {SpanFrame} entry
 * @returns {Decree}
 */
function buildDecree(decreeNode, allNodes, entry) {
  const decKeys = new Set(decreeNode.keys);
  /** @type {ChronicleNode[]} */
  const cone = [];
  /** @type {{ node: ChronicleNode, reason: string }|null} */
  let breaking = null;
  let contested = false;
  for (const n of allNodes) {
    if (n.nodeId === decreeNode.nodeId) continue;
    const shares = n.keys.some((/** @type {string} */ k) => decKeys.has(k));
    if (!shares) continue;
    cone.push(n);
    const rev = reversalSignal(decreeNode.raw, n.raw);
    if (rev) { contested = true; if (!breaking) breaking = { node: n, reason: rev }; }
  }
  cone.sort((a, b) => byStr(a.nodeId, b.nodeId));
  const honestNull = cone.length === 0;
  const standing = honestNull ? 'null'
    : breaking ? (cone.length > 1 ? 'contested' : 'undone')
    : cone.some(n => n.decree) ? 'absorbed'
    : 'held';
  return {
    decreeId: decreeNode.nodeId,
    kind: decreeKind(decreeNode.raw),
    landing: landingWeek(decreeNode.raw, entry),
    receipt: decreeNode.raw,
    keys: [...decKeys].sort(byStr),
    cone: cone.map(n => n.nodeId),
    coneNodes: cone,
    coneSize: cone.length,
    standing,
    standingInferred: true,
    contested,
    breakingEvent: breaking ? breaking.node.raw : null,
    breakingReason: breaking ? breaking.reason : null,
    honestNull,
    // The honest-null finding text (never dropped) — surfaced as a finding.
    finding: honestNull ? 'This decree produced no measurable downstream effect this span.' : null,
  };
}

/**
 * Cluster entangled decrees (§5b). Two decrees entangle when their cones (or the
 * decrees themselves) share ANY node — detected over the inferred entity graph.
 * The relation is classified by the strongest signal:
 *   CONFLICTING (a descendant of one reverses a descendant/decree of the other —
 *     SELF-CONFLICT) > CHAINED (one decree sits in the other's cone) >
 *     SYNERGISTIC/SHARED (a common descendant). Union-find groups the components.
 * @param {Decree[]} decrees  buildDecree outputs
 * @returns {Cluster[]}  clusters (>=2 decrees); singletons are returned separately by caller
 */
function clusterDecrees(decrees) {
  const parent = decrees.map((_, i) => i);
  const find = (/** @type {number} */ x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (/** @type {number} */ a, /** @type {number} */ b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb); };
  // Node id → which decree indices reference it (as decree, or in cone).
  /** @type {Map<string, Set<number>>} */
  const refBy = new Map();
  decrees.forEach((d, i) => {
    const ref = (/** @type {string} */ id) => { if (!refBy.has(id)) refBy.set(id, new Set()); (refBy.get(id) || new Set()).add(i); };
    ref(d.decreeId);
    for (const c of d.cone) ref(c);
  });
  for (const set of refBy.values()) {
    const arr = [...set].sort((a, b) => a - b);
    for (let i = 1; i < arr.length; i++) union(arr[0], arr[i]);
  }
  /** @type {Map<number, number[]>} */
  const groups = new Map();
  decrees.forEach((_, i) => { const r = find(i); if (!groups.has(r)) groups.set(r, []); (groups.get(r) || []).push(i); });
  /** @type {Cluster[]} */
  const clusters = [];
  for (const idxs of [...groups.values()].filter(g => g.length >= 2)) {
    const members = idxs.map(i => decrees[i]);
    clusters.push(describeCluster(members));
  }
  clusters.sort((a, b) => byStr(a.clusterId, b.clusterId));
  return clusters;
}

/**
 * Classify + describe one entangled cluster: relation, self-conflict flag, joint
 * story, per-decree contributions, and the shared descendants attributed ONCE.
 * @param {Decree[]} members  buildDecree outputs sharing a component
 * @returns {Cluster}
 */
function describeCluster(members) {
  const ids = members.map(m => m.decreeId).sort(byStr);
  const clusterId = `cluster_${ids[0]}`;
  const decreeIdSet = new Set(members.map(m => m.decreeId));
  // Shared descendants: node ids appearing in >=2 members' cones — attributed once.
  /** @type {Map<string, number>} */
  const seen = new Map();
  for (const m of members) for (const c of m.cone) seen.set(c, (seen.get(c) || 0) + 1);
  const sharedDescendants = [...seen.entries()].filter(([, n]) => n >= 2).map(([id]) => id).sort(byStr);
  // Conflict detection: does any member's cone reverse another member's decree or
  // a shared descendant? Reuse each member's own breaking signal, plus a direct
  // decree-vs-decree check.
  let conflicting = false;
  let conflictText = null;
  for (const a of members) {
    for (const b of members) {
      if (a === b) continue;
      const rev = reversalSignal(a.receipt, b.receipt);
      if (rev) { conflicting = true; conflictText = `your ${a.kind} was undone by your ${b.kind} — ${rev}`; break; }
    }
    if (conflicting) break;
  }
  // Chained: one member's decree id sits in another member's cone.
  const chained = members.some(a => members.some(b => a !== b && b.cone.includes(a.decreeId)));
  const relation = conflicting ? 'conflicting' : chained ? 'chained' : sharedDescendants.length ? 'synergistic' : 'shared';
  const kinds = members.map(m => m.kind);
  const jointStory = conflicting
    ? (conflictText || 'two of your decrees worked against each other')
    : relation === 'chained'
      ? `your ${kinds.join(' then ')} built on one another`
      : `your ${kinds.join(' and ')} met in the same events`;
  return {
    clusterId,
    relation,
    selfConflict: conflicting,
    conflictText,
    jointStory,
    decrees: members.map(m => ({
      decreeId: m.decreeId, kind: m.kind, landing: m.landing, standing: m.standing,
      standingInferred: m.standingInferred, receipt: m.receipt,
      // Within a cluster, an absorbed-by-own-decree standing is distinct (§5b).
      standingWithin: decreeIdSet.size > 1 && m.standing === 'absorbed' ? 'absorbed-by-your-own-decree' : m.standing,
    })),
    sharedDescendants,
    memberIds: ids,
  };
}

/**
 * THE DECREE SECTION for one advance entry: singleton decrees, entangled clusters,
 * and honest nulls — every applied decree present EXACTLY ONCE. Always returned
 * (an object with empty arrays when the DM issued no orders — the section renders
 * "no decrees this advance", never absent).
 * @param {AdvanceEntry} entry
 * @returns {DecreeSection}
 */
export function decreesForAdvance(entry) {
  /** @type {DecreeSection} */
  const empty = { total: 0, singletons: [], clusters: [], nulls: [], findings: [] };
  if (!entry || !entry.record) return empty;
  const nodes = nodesFromRecord(entry.record);
  const decreeNodes = nodes.filter(n => isDecreeNode(n.raw)).sort((a, b) => byStr(a.nodeId, b.nodeId));
  if (decreeNodes.length === 0) return empty;
  const decrees = decreeNodes.map(d => buildDecree(d, nodes, entry));
  const clusters = clusterDecrees(decrees);
  const clusteredIds = new Set(clusters.flatMap(c => c.memberIds));
  // Partition: every decree appears exactly once — in a cluster, else as a null,
  // else as a singleton. (The completeness invariant, pinned.)
  /** @type {Decree[]} */
  const singletons = [];
  /** @type {Decree[]} */
  const nulls = [];
  for (const d of decrees) {
    if (clusteredIds.has(d.decreeId)) continue;
    if (d.honestNull) nulls.push(d); else singletons.push(d);
  }
  singletons.sort((a, b) => byStr(a.decreeId, b.decreeId));
  nulls.sort((a, b) => byStr(a.decreeId, b.decreeId));
  const findings = [
    ...nulls.map(d => ({ decreeId: d.decreeId, kind: d.kind, text: d.finding })),
    ...clusters.filter(c => c.selfConflict).map(c => ({ clusterId: c.clusterId, text: c.conflictText })),
  ];
  return { total: decrees.length, singletons, clusters, nulls, findings };
}

/**
 * The whole-history decree ledger (newest-advance first) — the scrollback's decree
 * lane. Bounded by pulseHistory's cap (a §6 finding).
 * @param {AdvanceEntry[]} entries
 * @returns {Array<{ tick: number, spanLabel: string, decrees: DecreeSection }>}
 */
export function decreeHistory(entries) {
  return (Array.isArray(entries) ? entries : []).map(e => ({ tick: e.tick, spanLabel: e.spanLabel, decrees: decreesForAdvance(e) }));
}
