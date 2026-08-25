/**
 * teleportEdges.js — Phase 5.5 mover wave M9c: TELEPORT BLOCS (design §4e/§4f,
 * rounds 7/11; playbook PART 7 §M9 (5)).
 *
 * A teleportation circle is a ZERO-latency, GATE-BYPASSING, geography-INDEPENDENT
 * edge between two magic-capable settlements. This is the BUILDER side of the
 * reserved `teleportEdges` digest slot (the read side — the dormancy gate, the
 * teleport-augmented routing, the zero-hop HI-FI intel carrier — lives in
 * distanceRead.js / rumorNetwork.js, reading the SELF-DESCRIBING frozen slot straight
 * off the digest, exactly as M3's seasonal READ and M8's seaLanes READ do). Keeping
 * the read in distanceRead is why distanceRead never imports THIS module: teleport
 * pulls the institution catalog to enumerate the magic capability, and a distanceRead→
 * catalog edge would force the catalog into that light leaf's chunk. So the split
 * mirrors spatialCost (builder) / distanceRead (reader) and seaLanes precisely.
 *
 * THE OWNER'S RULE (§4e round 7, §4f round 11) — a teleport EDGE forms between two
 * settlements that BOTH hold a teleport-capable institution (a teleportation circle /
 * planar gate). MAGIC-gated (absent in a magic-opt-out world), PREMIUM (rare + costly),
 * AUTHORED-yet-deterministic (the institution roster is the frozen substrate, so the
 * edge set re-derives on a founding event via the receipted re-canonize — a new circle
 * changes a settlement's destiny). The network is a CLIQUE OF THE WILLING: every
 * circle-holder is potentially adjacent to every other. The WILLINGNESS (non-hostile
 * diplomacy) is a READ-TIME property — hostility is dynamic and cannot be frozen — so
 * the frozen edge set holds the POTENTIAL links (the full clique among capable
 * settlements) and the diplomatic gate composes through the existing danger/relationship
 * seams, exactly as M8 freezes the sea edges and lets blockade/piracy compose.
 *
 * WHY A FULL CLIQUE IS SAFE (contrast M8's O(P^2) sea-clique lesson): teleport circles
 * are RARE — a metropolis-tier, magic-gated, expensive institution (catalog baseChance
 * ~0.08..0.15). A realm holds a handful of circle-holders, so the clique is naturally
 * sparse (K holders ⇒ K(K-1)/2 tiny edges — a dozen holders is ~66 edges, each a
 * three-field record). The design's topology IS the clique; the rarity is the bound.
 *
 * THE EDGE ECONOMICS:
 *   • COST — TELEPORT_EDGE_COST, the cheapest possible edge: teleport COLLAPSES
 *     distance (zero-latency, gate-bypassing), so a circle-holder is routing-adjacent
 *     to its bloc — hi-fi zero-hop intel (beliefs cross at full fidelity, no telephone
 *     decay) and collapsed premium trade. Floored ≥ 1 so no zero-weight edge creates a
 *     free cycle in the routing graph (the SEA_LANE_MIN_COST discipline).
 *   • CAPACITY — TELEPORT_EDGE_CAPACITY, a LOW ceiling: teleport is PREMIUM, not a
 *     firehose (people, messages, limited high-value goods — NOT bulk grain or an army
 *     pipeline). The OTHER half of the design (bounded trade). v1 routing reads COST,
 *     not capacity (no throttle yet — the abstraction, mirroring M8's sea-lane v1);
 *     recorded on each edge for the bounded-trade + node-starvation flow work.
 *
 * NODE-STARVATION (round 11): a circle link is SIEGE-PROOF — a besieger cannot cut the
 * EDGE (it is not a land route), only STARVE the NODE. So a besieged circle-holder
 * still trades/shares with its bloc, but contributes LESS (its own land trade is cut).
 * This EMERGES from the existing supply mechanic + the teleport-aware routing (a cut
 * land route still leaves the teleport route), NO new mechanism — exactly the design's
 * "round-3 supply network run on an un-interdictable topology."
 *
 * PURE + seeded + lazy: no iframe, no tier/auth, no Date/Math.random. Imported ONLY by
 * spatialDigest.js (the lazy canonize chunk) ⇒ zero first-paint bytes. The slot rides
 * the EXISTING spatialDigest reserved slot — no new worldState ledger key, no new eager
 * literal. Dormant (no opt-in / <2 circle-holders) ⇒ slot null ⇒ byte-identical.
 */

import { institutionalCatalog, catalogIdForName } from '../../data/institutionalCatalog.js';

// The self-describing slot version. Bumping it is a DISCRETE re-canonize event
// (§V.1) — an existing frozen digest keeps its own teleportEdges forever; only an
// explicit spatial re-canonize re-derives. Never a silent drift on load.
export const TELEPORT_EDGE_VERSION = 1;

// The cheapest possible edge — teleport COLLAPSES distance (zero-latency, gate-
// bypassing). At cost 1 a circle-holder is routing-adjacent to its bloc (the hi-fi
// zero-hop intel + collapsed premium trade). Floored ≥ 1 so no zero-weight edge makes
// a free routing cycle (the SEA_LANE_MIN_COST discipline).
export const TELEPORT_EDGE_COST = 1;

// BOUNDED capacity — teleport is PREMIUM, not a firehose (a LOW ceiling vs the sea
// lane's high 10 / land's implicit 1). v1 routing reads COST, not capacity (no throttle
// yet — the abstraction); recorded for the bounded-trade + node-starvation flow work.
export const TELEPORT_EDGE_CAPACITY = 2;

// ── CAPABILITY: the teleport-access institution set, enumerated from the catalog ──
// A settlement is teleport-capable when it holds an institution the catalog names a
// teleportation circle / planar gate (the design's premium magic edge). Matched by
// NAME (the design's named institution), mirroring seaLanes' WATER_ACCESS enumeration.
// Built once (a pure derivation of the frozen catalog) and matched id-FIRST (a DM-
// renamed but catalog-stamped circle keeps its capability) with a canonical-name
// fallback (an unstamped custom institution matches by name). NB: no `tier`/`auth`/
// `premium` identifier appears here — the domain stays tier-blind (invariant test).
const TELEPORT_NAME_RE = /teleport|planar\s*gate|way\s*gate|arcane\s*portal/i;
const TELEPORT_ACCESS = (() => {
  /** @type {Set<string>} */
  const names = new Set();
  /** @type {Set<string>} */
  const ids = new Set();
  for (const group of Object.values(institutionalCatalog || {})) {
    for (const entries of Object.values(/** @type {Record<string, Record<string, unknown>>} */ (group) || {})) {
      for (const name of Object.keys(entries || {})) {
        if (!TELEPORT_NAME_RE.test(name)) continue;
        names.add(name);
        const id = catalogIdForName(name);
        if (id) ids.add(id);
      }
    }
  }
  return { names, ids };
})();

/** The set of catalog institution NAMES that grant teleport access (for tests/receipts). */
export function teleportInstitutionNames() {
  return [...TELEPORT_ACCESS.names].sort();
}

/**
 * Does an institution roster hold a teleport-capable institution? Each row may be a
 * string name or a `{ name, catalogId? }` object (the settlement roster shape). Matches
 * id-first (a catalog-stamped renamed circle keeps capability) then by canonical name.
 * @param {Array<string | { name?: unknown, catalogId?: unknown, id?: unknown }> | null | undefined} institutions
 * @returns {boolean}
 */
export function hasTeleportInstitution(institutions) {
  const rows = Array.isArray(institutions) ? institutions : [];
  for (const row of rows) {
    if (row == null) continue;
    if (typeof row === 'string') {
      if (TELEPORT_ACCESS.names.has(row) || (catalogIdForName(row) && TELEPORT_ACCESS.ids.has(/** @type {string} */ (catalogIdForName(row))))) return true;
      continue;
    }
    const stampedId = row.catalogId != null ? String(row.catalogId) : null;
    if (stampedId && TELEPORT_ACCESS.ids.has(stampedId)) return true;
    const name = row.name != null ? String(row.name) : (row.id != null ? String(row.id) : '');
    if (name && TELEPORT_ACCESS.names.has(name)) return true;
    const idByName = name ? catalogIdForName(name) : null;
    if (idByName && TELEPORT_ACCESS.ids.has(idByName)) return true;
  }
  return false;
}

// ── TELEPORT ELIGIBILITY = a teleport-capable institution (the pure derivation) ─────
/**
 * @typedef {Object} TeleportEligibility
 * @property {string} id
 * @property {number} cellId
 * @property {boolean} teleport   capability: a teleport-capable institution present
 */

/**
 * Derive per-seed teleport eligibility. Purely institutional (magic bypasses
 * geography — a mountain fastness with a circle is as connected as a port city).
 * Pure + deterministic (a function of the roster); codepoint-sorted by id.
 * @param {Array<{ id:string, cellId:number }>} seeds  the resolved digest seeds
 * @param {Record<string, Array<string | { name?: unknown, catalogId?: unknown }>>} institutionsById
 * @returns {TeleportEligibility[]}
 */
export function deriveTeleportEligibility(seeds, institutionsById) {
  const roster = institutionsById && typeof institutionsById === 'object' ? institutionsById : {};
  const rows = (Array.isArray(seeds) ? seeds : []).map((s) => ({
    id: String(s.id),
    cellId: Number(s.cellId),
    teleport: hasTeleportInstitution(roster[String(s.id)]),
  }));
  return rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * The frozen teleportEdges slot, or NULL with <2 circle-holders (the dormancy floor).
 * The edge set is the CLIQUE OF THE WILLING — every capable settlement is potentially
 * adjacent to every other (rarity is the bound; see the module header). Each edge is
 * the cheapest possible (collapsed distance) with a bounded capacity. Deterministic:
 * ids codepoint-sorted, edges keyed a<b in nested-loop order (already codepoint-sorted).
 * @param {TeleportEligibility[]} eligibility
 * @returns {{ version:number, nodes:string[], edges:Array<{ between:[string,string], cost:number, capacity:number }>, edgeCost:number, edgeCapacity:number }|null}
 */
export function buildTeleportEdgeSet(eligibility) {
  const holders = (Array.isArray(eligibility) ? eligibility : []).filter((e) => e && e.teleport);
  // derive already returns id-sorted; an order-preserving filter + de-dup keeps it.
  const nodes = [...new Set(holders.map((h) => h.id))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if (nodes.length < 2) return null;
  /** @type {Array<{ between:[string,string], cost:number, capacity:number }>} */
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // nodes[i] < nodes[j] by the sort, so `between` is already codepoint-ordered.
      edges.push({ between: [nodes[i], nodes[j]], cost: TELEPORT_EDGE_COST, capacity: TELEPORT_EDGE_CAPACITY });
    }
  }
  return {
    version: TELEPORT_EDGE_VERSION,
    nodes,
    edges,
    edgeCost: TELEPORT_EDGE_COST,
    edgeCapacity: TELEPORT_EDGE_CAPACITY,
  };
}

/**
 * The ONE builder entry point spatialDigest calls when `teleport:true` is opted in.
 * Derives teleport eligibility (a teleport-capable institution) then builds the clique
 * edge set, or NULL when <2 circle-holders (dormant). Pure + deterministic; NO pack
 * needed (magic bypasses geography, unlike sea lanes).
 * @param {Array<{ id:string, cellId:number }>} seeds
 * @param {Record<string, Array<string | { name?: unknown, catalogId?: unknown }>>} institutionsById
 * @returns {{ version:number, nodes:string[], edges:Array<{ between:[string,string], cost:number, capacity:number }>, edgeCost:number, edgeCapacity:number }|null}
 */
export function buildTeleportEdges(seeds, institutionsById) {
  const eligibility = deriveTeleportEligibility(seeds, institutionsById);
  return buildTeleportEdgeSet(eligibility);
}
