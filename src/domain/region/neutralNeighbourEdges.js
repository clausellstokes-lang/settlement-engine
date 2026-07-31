/**
 * neutralNeighbourEdges.js — THE NEUTRAL-CONNECTED DEFAULT for the regional
 * interaction graph (realm directive 2, judgment J-D2, 2026-07-31).
 *
 * Owner intent: "campaign members start as neutral but connected neighbors
 * unless explicitly told otherwise."
 *
 * J-D2 fixes what the default edge IS: diplomatic KNOWN + minimal route
 * awareness. NOT a trade route, NO resource flow. In this layer's vocabulary
 * that is exactly one thing — a `neutral` EDGE between the two members, with
 * ZERO channels. Edges are how the pulse knows two settlements exist to each
 * other (every kernel walks `snapshot.regionalGraph.edges`); CHANNELS are what
 * carry goods, tax, protection and obligation. Minting the edge and refusing
 * the channel IS "known, not trading".
 *
 * WHY IT EXISTS: a small campaign whose members carry no authored links has an
 * EDGELESS graph, so `evaluateRelationshipRules` (which flatMaps over edges)
 * emits nothing at all and the world sits in stasis — the small-N stasis
 * evidence from the 2026-07-31 soak. The neutral default gives the relationship
 * layer a substrate to evolve, which is the whole point of the directive:
 * lighting it must RAISE cross-settlement interaction density.
 *
 * ── SIBLING, NOT FORK ────────────────────────────────────────────────────────
 * `relationships/effectiveNeighbours.js` implements the SAME owner default for
 * a DIFFERENT artifact and a different consumer: it mints read-time implicit
 * `neighbourNetwork` LINKS for the settlement-dossier cascade (lib/
 * relationshipGraph). That module is deliberately scoped OUT of the regional
 * causal graph ("intentionally separate"), which is why this second, explicitly
 * flagged surface exists. The two never share an artifact:
 *   • effectiveNeighbours mints LINKS, read-time only, never persisted, marked
 *     with IMPLICIT_NEUTRAL_FLAG (guarded by implicitNeutralSingleSource.test).
 *   • this module mints EDGES, into the regional graph the pulse reads, marked
 *     by an evidence row (see NEUTRAL_DEFAULT_EDGE_SOURCE).
 * Nothing here writes a neighbourNetwork link, so the sibling's single-writer
 * guard is untouched.
 *
 * ── PROVENANCE LIVES IN EVIDENCE, BY NECESSITY ──────────────────────────────
 * `normalizeEdge` (graph.js) is a WHITELIST: it rebuilds an edge from a fixed
 * key set and silently drops anything else, so a bespoke marker property cannot
 * survive a single `ensureRegionalGraph` pass. `evidence` IS preserved, and the
 * war layer already uses an evidence `source` prefix as its provenance mark
 * (hasWarLayerEvidence). So the neutral default marks itself the same way — one
 * evidence row whose source is NEUTRAL_DEFAULT_EDGE_SOURCE. That mark survives
 * normalization, a JSON round-trip, and persistence, so retrospective review can
 * always tell a defaulted tie from a DM-authored one.
 *
 * ── DORMANCY ────────────────────────────────────────────────────────────────
 * `neutralNeighborsEnabled` is VIRTUAL: absent from DEFAULT_SIMULATION_RULES,
 * read `=== true` (the memoryWeaveActive idiom). With the flag absent — which is
 * every world that exists today — `withNeutralNeighbourEdges` returns the input
 * graph BY REFERENCE. Not an equal graph: the same object. So wiring this into
 * buildWorldSnapshot cannot perturb any dark world by construction, and the
 * estate's byte-identity goldens are the proof.
 *
 * ── THE PAIR SELECTION: K-NEAREST, NOT ALL-PAIRS (J-D2 AMENDED 2026-07-31) ──
 * B1 built this seam with an ALL-PAIRS selection, which makes a lit realm's graph
 * COMPLETE — C(S,2) edges, quadratic in settlements. MEASURED at that shape:
 * lighting the flag in the three world-alive presets red tests/perf/
 * tickScanBudget.test.js ("scanOps grew 3.320x (1007 -> 3343) when S doubled
 * (> 2.6)"). The per-advance tick indices stay near-linear in EDGES, so they were
 * honest; a quadratic edge POPULATION is what broke the ceiling Cycle-3 Wave 4
 * defends. The blocker was asymptotic, so the cure is asymptotic: J-D2 was amended
 * to make the default edge set the K-NEAREST SPATIAL NEIGHBOURS of each member,
 * k = NEUTRAL_DEFAULT_K (3), unioned over the membership.
 *
 * The two properties that matter, both pinned:
 *   • AT S <= k+1 (i.e. S <= 4) THE k-NN GRAPH **IS** THE COMPLETE GRAPH. Every
 *     member has at most 3 other members, so its 3 nearest are all of them. That
 *     is exactly the small-N band where the stasis medicine binds (the 2026-07-31
 *     soak evidence), so the directive loses NOTHING where it was prescribed.
 *   • AT SCALE the minted edge population is bounded by S·k — LINEAR — because
 *     each member contributes at most k unordered pairs to the union.
 *
 * WHAT THE SWAP DID AND DID NOT BUY (measured 2026-07-31, B1b — read this before
 * lighting anything): the selection takes 6 / 16 / 31 pairs at S = 4 / 8 / 16 where
 * the complete graph takes 6 / 28 / 120, so the POPULATION claim is confirmed. The
 * tick-scan RATCHET is still red when lit — 3.891x at its 4→8 window (all-pairs was
 * 3.312x) and 2.620x at 8→16 (all-pairs 3.594x) against a 2.6 ceiling. k-nearest is
 * strictly the better shape and wins where the asymptote lives, but no lit window
 * clears the ceiling, and the 4→8 window cannot be cleared by ANY k while J-D2
 * mandates completeness at S <= 4: the lit S=4 fixture is already saturated, so the
 * ratio's denominator cannot grow. Lighting stays OWNER-GATED; the full numbers and
 * the two remaining options live beside the flag in simulationRules.js.
 *
 * COST, STATED HONESTLY: the SELECTION ranks each member's S-1 candidates, so it
 * is O(S² log S) integer comparisons over the ALREADY-FROZEN O(S²) distance
 * matrix, once per snapshot build. That is not the cost class the tick-scan
 * budget defends — that gate measures the per-advance GRAPH population every
 * kernel re-scans, and THAT is now O(S·k). Neither is it new asymptotic weight:
 * the digest the ranking reads is itself an O(S²) frozen artifact, and the
 * expensive part of a distance read (route solving for port/teleport pairs) is
 * already memoized per digest inside distanceRead.
 *
 * ── ONE ORDERING LAW (deterministic, total) ─────────────────────────────────
 * Candidates are ranked by, in order:
 *   1. RESOLVED FIRST — a pair with a real spatial cost outranks one without.
 *   2. SEPARATION — the frozen travel cost (pathCost over the canonized digest)
 *      when resolved; otherwise the CODEPOINT-RANK separation |rank(a) - rank(b)|
 *      over the codepoint-sorted membership.
 *   3. CODEPOINT ID — the tiebreak J-D2 names.
 * An ASPATIAL world (no canonized digest — every world that has not paid for
 * spatial canon) therefore has no spatial term at all and its selection collapses
 * to rule 2's fallback: each member's nearest neighbours in codepoint order. That
 * is deliberate, not a degradation dodge — with no geometry there is no "near",
 * and the codepoint line is the only total order the engine has. It keeps the
 * default graph CONNECTED (a chain, never islands), keeps it bounded at S·k, and
 * is complete at S <= 4 exactly like the spatial path. Leaving aspatial worlds on
 * all-pairs would have left the quadratic habitat alive for every realm that never
 * canonizes, which is most of them.
 *
 * Pure, total, deterministic: no clock (minted edges inherit the graph's own
 * `updatedAt`), no RNG, no I/O.
 */

import { edgeIdFor } from './graph.js';
import { activeSpatialDigest, pathCost } from '../spatial/distanceRead.js';

/**
 * The evidence `source` stamped on every edge this module mints. THE provenance
 * mark for the neutral-connected default — chosen because evidence is the only
 * edge field that survives normalizeEdge's whitelist (see the header).
 * @type {string}
 */
export const NEUTRAL_DEFAULT_EDGE_SOURCE = 'neutral_default';

/**
 * The relationship label the default carries. Deliberately `neutral`: the
 * relationship layer's own dispatch (RULE_EVALUATORS) has a `neutral` evaluator,
 * so a defaulted pair evolves through the ordinary rules — it is a starting
 * position, never a special case.
 * @type {string}
 */
export const NEUTRAL_DEFAULT_RELATIONSHIP = 'neutral';

const NEUTRAL_DEFAULT_REASON = 'Campaign members are neutral, connected neighbours by default.';

/**
 * How many nearest neighbours each campaign member is connected to by default
 * (J-D2 as amended 2026-07-31). THREE is the whole asymptotic argument:
 *   • k = 3 ⇒ at S <= 4 members the k-NN graph IS the complete graph, so the
 *     small-N stasis medicine is undiluted where it was prescribed;
 *   • at scale the union is bounded by S·k edges — linear, under the tick-scan
 *     budget with margin, with no ratchet raised.
 * Raising it is a performance-architecture decision, not a tuning knob: the edge
 * population (and therefore every kernel's per-advance scan) scales with it.
 * @type {number}
 */
export const NEUTRAL_DEFAULT_K = 3;

/**
 * Is THE NEUTRAL-CONNECTED DEFAULT lit for this world? Reads
 * `simulationRules.neutralNeighborsEnabled === true`, defensively — ABSENT ⇒
 * false ⇒ DORMANT. The key has NO entry in DEFAULT_SIMULATION_RULES (a VIRTUAL
 * flag, the WAVES / ONE_REGEN / memoryWeaveEnabled convention), so it adds no
 * persisted bytes to a legacy save and does not join RULE_COMPARISON_KEYS —
 * preset identity is unaffected. Pure, total.
 *
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function neutralNeighboursActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).neutralNeighborsEnabled === true);
}

/**
 * True iff `edge` was minted by the neutral-connected default (it carries the
 * provenance evidence row). Survives normalizeEdge + a JSON round-trip, so this
 * answers correctly for a persisted, rehydrated graph too.
 *
 * @param {{ evidence?: Array<{source?: unknown}>|null }|null|undefined} edge
 * @returns {boolean}
 */
export function isNeutralDefaultEdge(edge) {
  return Array.isArray(edge?.evidence)
    && edge.evidence.some(row => row?.source === NEUTRAL_DEFAULT_EDGE_SOURCE);
}

/**
 * The unordered pair key for two settlement ids — orientation-free, so an
 * authored edge recorded as (b → a) still counts as "this pair is explicit".
 * @param {unknown} a @param {unknown} b @returns {string}
 */
function pairKey(a, b) {
  return [String(a), String(b)].sort().join('::');
}

/**
 * The separation between two members under THE ONE ORDERING LAW (see the header):
 * the frozen spatial travel cost when the canonized digest resolves the pair, else
 * the codepoint-RANK separation over the sorted membership. `resolved` is the
 * PRIMARY sort key, so a mapped, reachable pair always outranks an unmapped one and
 * the two scales are never compared against each other.
 *
 * @param {import('../spatial/distanceRead.js').SpatialDigest|null} digest
 * @param {Map<string, number>} rankOf codepoint rank of every member
 * @param {string} from @param {string} to
 * @returns {{ resolved: 0|1, separation: number }}
 */
function separationOf(digest, rankOf, from, to) {
  const cost = digest ? pathCost(digest, from, to) : null;
  if (cost != null && Number.isFinite(cost) && cost > 0) {
    return { resolved: 0, separation: cost };
  }
  return {
    resolved: 1,
    separation: Math.abs(/** @type {number} */ (rankOf.get(from)) - /** @type {number} */ (rankOf.get(to))),
  };
}

/**
 * THE K-NEAREST SELECTION. Returns the unordered member pairs the default connects:
 * for each member, its NEUTRAL_DEFAULT_K nearest fellows under the ordering law,
 * UNIONED (not intersected) across the membership.
 *
 * UNION, NOT MUTUAL: k-nearest is asymmetric (A may be among B's three nearest
 * while B is not among A's). Taking the union guarantees every member ends up with
 * at least its own k ties, so nobody is stranded edgeless — which is the entire
 * point of the directive. Intersecting would silently re-create the stasis case for
 * a peripheral settlement. The union's size is still bounded by S·k.
 *
 * The result is keyed by the canonical (sorted) pair key and iterates in codepoint
 * order, so the selection — and therefore the minted edge list — is a pure function
 * of the member SET, never of the order the members arrived in.
 *
 * @param {ReadonlyArray<string>} sorted the codepoint-sorted, de-duplicated membership
 * @param {import('../spatial/distanceRead.js').SpatialDigest|null} digest
 * @returns {Map<string, [string, string]>} pairKey → canonical [from, to]
 */
function selectNeighbourPairs(sorted, digest) {
  const rankOf = new Map(sorted.map((id, index) => [id, index]));
  /** @type {Map<string, [string, string]>} */
  const pairs = new Map();
  for (const from of sorted) {
    const ranked = sorted
      .filter(to => to !== from)
      .map(to => ({ to, ...separationOf(digest, rankOf, from, to) }))
      .sort((a, b) => (a.resolved - b.resolved)
        || (a.separation - b.separation)
        || (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
    const take = Math.min(NEUTRAL_DEFAULT_K, ranked.length);
    for (let i = 0; i < take; i += 1) {
      const to = ranked[i].to;
      const [lo, hi] = from < to ? [from, to] : [to, from];
      const key = pairKey(lo, hi);
      if (!pairs.has(key)) pairs.set(key, [lo, hi]);
    }
  }
  return new Map([...pairs.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)));
}

/**
 * Append the neutral-connected default edge to every SELECTED pair of campaign
 * members that has NO edge yet — selected = each member's k nearest fellows,
 * unioned (see selectNeighbourPairs). EXPLICIT ALWAYS WINS: a pair already
 * carrying an edge — in either orientation, of any relationship type, including a
 * `channel_inferred` one ensureRegionalGraph minted — is left exactly as it is.
 *
 * An authored edge between two members who are NOT k-nearest is likewise
 * untouched: the selection governs only what the default MINTS, never what the
 * graph may already carry, so the amendment can never delete a DM's tie.
 *
 * LIFECYCLE, ADDITIVE ONLY: this mints, it never retires. If the membership grows
 * or the realm is re-canonized into a new geometry, the next build selects the NEW
 * neighbourhoods and mints whatever they add, while yesterday's defaults stay —
 * they are now ordinary edges the relationship layer has been evolving, and
 * deleting a tie the world has already lived through would rewrite history. So the
 * S·k bound governs each SELECTION, not a realm's whole history of them; a realm
 * re-canonized many times accumulates. That is the same direction B1 chose (a
 * default is never un-minted) and the safe one, but it is a real difference from
 * "the graph is always exactly the k-NN graph".
 *
 * STRICT NO-OP CONTRACT (the dormancy guarantee): when there is nothing to add —
 * fewer than two members, or every selected pair already connected — the INPUT
 * graph is returned by reference, never a copy. Callers gate on
 * `neutralNeighboursActive` before calling, so a dark world never even reaches
 * here; this second guarantee means a LIT world whose neighbourhoods are already
 * authored is also byte-identical.
 *
 * Minted edges are emitted in canonical (sorted-pair) order with a canonical
 * orientation, so the result does not depend on the order `memberIds` arrives
 * in — a graph rebuilt from re-ordered saves is byte-identical.
 *
 * Minted edges carry `channelIds: []` and NO channel is created anywhere: J-D2's
 * "diplomatic known + minimal route awareness, NOT a trade route, no resource
 * flow" is precisely an edge without channels.
 *
 * @template {{ edges?: Array<Record<string, any>>, updatedAt?: string }} G
 * @param {G} graph an ensureRegionalGraph output (edges already normalized)
 * @param {ReadonlyArray<string|number>} memberIds the campaign members participating this tick
 * @param {{ spatialCanonVersion?: number, spatialDigest?: import('../spatial/distanceRead.js').SpatialDigest }|null} [worldState] the
 *   world whose FROZEN spatial canon supplies "nearest"; absent/aspatial ⇒ the
 *   codepoint-rank fallback (see the header's ordering law).
 * @returns {G} the same graph when nothing was added, else a new graph with the defaults appended
 */
export function withNeutralNeighbourEdges(graph, memberIds, worldState = null) {
  const ids = Array.isArray(memberIds) ? memberIds.map(String).filter(Boolean) : [];
  const sorted = [...new Set(ids)].sort();
  if (!graph || sorted.length < 2) return graph;

  const existing = Array.isArray(graph.edges) ? graph.edges : [];
  const connected = new Set(existing.map(edge => pairKey(edge?.from, edge?.to)));

  // Deterministic timestamp: the minted edges inherit the graph's own stamp, so
  // a replay never reads a wall clock (normalizeEdge would otherwise default
  // updatedAt to nowIso() and make every rebuild a different graph).
  const updatedAt = graph.updatedAt;
  const minted = [];
  for (const [key, [from, to]] of selectNeighbourPairs(sorted, activeSpatialDigest(worldState))) {
    if (connected.has(key)) continue;   // explicit wins
    // Canonical orientation (sorted) so the edge id is stable no matter which
    // member the selection reached first. The label is symmetric, so orientation
    // carries no meaning here beyond identity stability.
    minted.push({
      id: edgeIdFor(from, to),
      from,
      to,
      relationshipType: NEUTRAL_DEFAULT_RELATIONSHIP,
      status: 'active',
      // No channels: known, not trading (J-D2).
      channelIds: [],
      evidence: [{ source: NEUTRAL_DEFAULT_EDGE_SOURCE, reason: NEUTRAL_DEFAULT_REASON }],
      updatedAt,
    });
  }
  if (minted.length === 0) return graph;
  minted.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { ...graph, edges: [...existing, ...minted] };
}

/**
 * The pairs the default WOULD connect for a membership — the selection itself,
 * exposed for pins and for retrospective review ("why is Ashford not tied to
 * Dunmoor?"). Returns canonical `[from, to]` tuples in codepoint order. Pure.
 *
 * @param {ReadonlyArray<string|number>} memberIds
 * @param {{ spatialCanonVersion?: number, spatialDigest?: import('../spatial/distanceRead.js').SpatialDigest }|null} [worldState]
 * @returns {Array<[string, string]>}
 */
export function neutralNeighbourPairs(memberIds, worldState = null) {
  const ids = Array.isArray(memberIds) ? memberIds.map(String).filter(Boolean) : [];
  const sorted = [...new Set(ids)].sort();
  if (sorted.length < 2) return [];
  return [...selectNeighbourPairs(sorted, activeSpatialDigest(worldState)).values()];
}
