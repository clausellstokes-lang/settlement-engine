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
 * ── SCALING: READ BEFORE LIGHTING THIS REALM-WIDE ───────────────────────────
 * The default connects EVERY pair, so a lit realm's graph is COMPLETE and its
 * edge count is C(S,2) — quadratic in settlements (a 12-settlement realm goes
 * from ~11 authored edges to 66). MEASURED 2026-07-31: lighting the flag in the
 * three world-alive presets reds tests/perf/tickScanBudget.test.js ("scanOps
 * grew 3.320x (1007 -> 3343) when S doubled (> 2.6)") — the per-advance tick
 * indices stay near-linear in EDGES, but a quadratic edge population still
 * breaks the asymptotic ceiling Cycle-3 Wave 4 defends. Small campaigns (the
 * stasis case this directive targets) are unaffected; realm-wide lighting is an
 * owner-gated performance-architecture call, priced in simulationRules.js beside
 * the flag's doc block. Nothing here silently exceeds a budget: the flag is dark.
 *
 * Pure, total, deterministic: no clock (minted edges inherit the graph's own
 * `updatedAt`), no RNG, no I/O.
 */

import { edgeIdFor } from './graph.js';

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
 * Append the neutral-connected default edge to every pair of campaign members
 * that has NO edge yet. EXPLICIT ALWAYS WINS: a pair already carrying an edge —
 * in either orientation, of any relationship type, including a
 * `channel_inferred` one ensureRegionalGraph minted — is left exactly as it is.
 *
 * STRICT NO-OP CONTRACT (the dormancy guarantee): when there is nothing to add —
 * fewer than two members, or every pair already connected — the INPUT graph is
 * returned by reference, never a copy. Callers gate on `neutralNeighboursActive`
 * before calling, so a dark world never even reaches here; this second guarantee
 * means a LIT world with a fully-authored graph is also byte-identical.
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
 * @returns {G} the same graph when nothing was added, else a new graph with the defaults appended
 */
export function withNeutralNeighbourEdges(graph, memberIds) {
  const ids = Array.isArray(memberIds) ? memberIds.map(String).filter(Boolean) : [];
  if (!graph || ids.length < 2) return graph;

  const existing = Array.isArray(graph.edges) ? graph.edges : [];
  const connected = new Set(existing.map(edge => pairKey(edge?.from, edge?.to)));

  // Deterministic timestamp: the minted edges inherit the graph's own stamp, so
  // a replay never reads a wall clock (normalizeEdge would otherwise default
  // updatedAt to nowIso() and make every rebuild a different graph).
  const updatedAt = graph.updatedAt;
  const minted = [];
  const seen = new Set();
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      if (ids[i] === ids[j]) continue;
      const key = pairKey(ids[i], ids[j]);
      if (connected.has(key) || seen.has(key)) continue;   // explicit wins; de-dupe repeated ids
      seen.add(key);
      // Canonical orientation (sorted) so the edge id is stable no matter which
      // member the outer loop reached first. The label is symmetric, so
      // orientation carries no meaning here beyond identity stability.
      const [from, to] = [ids[i], ids[j]].sort();
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
  }
  if (minted.length === 0) return graph;
  minted.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { ...graph, edges: [...existing, ...minted] };
}
