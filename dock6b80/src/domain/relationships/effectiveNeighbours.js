/**
 * effectiveNeighbours.js — THE derivation chokepoint for the neutral-neighbour default.
 *
 * Owner order (2026-07-22): "Every settlement automatically becomes a neutral
 * neighbor by default. That does not mean that they automatically have a route
 * to each other. Those routes are established in the realm deterministically."
 *
 * The default is expressed as a DEFAULT READING, never as materialized
 * neighbour_links rows: every OTHER settlement in the same campaign is treated
 * as an implicit Neutral neighbour at read time, while every EXPLICIT link wins
 * exactly as recorded. `effectiveNeighboursOf` is the SINGLE place implicit
 * neutrals are minted (enforced by tests/lint/implicitNeutralSingleSource.test.js).
 *
 * Deliberately scoped: the relationship-cascade modifier engine
 * (lib/relationshipGraph.js) reads through this chokepoint so cross-settlement
 * Network Effects activate coherently at a Neutral baseline for co-campaign
 * pairs. Explicit-only surfaces do NOT read through it and keep reading raw
 * `neighbourNetwork`: map relationship edges + the road network (routes stay the
 * realm's deterministic infrastructure — an implicit neutral never becomes a
 * route), the regional causal-channel graph (deriveRegionalGraphFromSaves —
 * "intentionally separate"), persistence, every write/delink path, and
 * existence-gated filters/telemetry/fingerprints.
 *
 * NOTHING here is persisted. Implicit entries carry the IMPLICIT_NEUTRAL_FLAG
 * marker and are read-time only — which is exactly why lifecycle correctness is
 * automatic: place / remove / re-place / import / campaign-move all flow from
 * live campaign membership, so removing a settlement needs NO delink for its
 * implicit neutrals (only explicit rows are cleaned up, unchanged).
 */

/**
 * Marker stamped on every implicit-neutral entry so consumers/guards can tell an
 * implicit read-time neighbour from a persisted explicit link. Read-time only;
 * never written to `neighbourNetwork`, never persisted.
 * @type {string}
 */
export const IMPLICIT_NEUTRAL_FLAG = '__implicitNeutral';

/**
 * The fields this module reads off a saved-settlement envelope. `settlement`
 * carries the inline neighbourNetwork (the read source of truth on load).
 * @typedef {Object} SettlementSaveLike
 * @property {string|number=} id
 * @property {string=} name
 * @property {{ id?: string|number, name?: string, neighbourNetwork?: Array<Record<string, unknown>> }=} settlement
 */

/**
 * Deterministic synthetic linkId for the implicit neutral edge self→other.
 * @param {string} selfId
 * @param {string} otherId
 * @returns {string}
 */
function implicitLinkId(selfId, otherId) {
  return `implicit_neutral__${selfId}__${otherId}`;
}

/**
 * @param {SettlementSaveLike | null | undefined} save
 * @returns {string}
 */
function idOf(save) {
  return String(save?.id ?? save?.settlement?.id ?? '');
}

/**
 * @param {SettlementSaveLike | null | undefined} save
 * @returns {string | null}
 */
function nameOf(save) {
  return save?.name ?? save?.settlement?.name ?? null;
}

/**
 * The EFFECTIVE neighbour-link list for `save`: every explicit link exactly as
 * recorded, plus an implicit Neutral link to every OTHER co-campaign settlement
 * that carries no explicit link. Explicit links always win — a co-campaign
 * partner already present in `neighbourNetwork` (matched by id OR by name, the
 * same two keys buildGraph resolves edges on) is never given an implicit entry.
 *
 * @param {SettlementSaveLike | null | undefined} save — a saved-settlement envelope (reads save.settlement.neighbourNetwork).
 * @param {Array<SettlementSaveLike>} coCampaignSaves — the OTHER saves in the same campaign
 *   (may include `save` itself; self is skipped). Empty/absent ⇒ STRICT NO-OP:
 *   the result is the explicit list unchanged (identical object identity), so a
 *   consumer that supplies no campaign context behaves byte-for-byte as before.
 * @returns {Array<object>} explicit links first, implicit neutrals appended.
 *
 * KNOWN LATENT EDGE (deliberately deferred — documented, not a bug to re-find):
 * explicit-wins dedup matches a co-campaign partner by `link.id` OR name, the two
 * keys buildGraph's edge resolution can use directly. It does NOT match on a
 * shared `linkId` alone. Every real link written today (neighbourBackLink /
 * saves / mutateWorld) carries `id` = the partner save id, so this is unreachable
 * — but a hypothetical explicit link resolvable ONLY via a shared linkId (no
 * id/name match) would get a redundant implicit neutral minted alongside it.
 */
export function effectiveNeighboursOf(save, coCampaignSaves) {
  const explicit = save?.settlement?.neighbourNetwork || [];
  if (!Array.isArray(coCampaignSaves) || coCampaignSaves.length === 0) {
    // Strict no-op: return the exact explicit array (same identity) so absence
    // of campaign context can never perturb a downstream comparison.
    return explicit;
  }

  const selfId = idOf(save);

  // Partners that already carry an explicit link, keyed by BOTH id and name —
  // the two keys buildGraph uses to resolve a link to a target — so an explicit
  // relationship always wins over the implicit neutral default.
  const linkedIds = new Set();
  const linkedNames = new Set();
  for (const link of explicit) {
    if (link?.id != null) linkedIds.add(String(link.id));
    const nm = link?.neighbourName ?? link?.name;
    if (nm != null) linkedNames.add(String(nm));
  }

  const result = explicit.slice();
  for (const other of coCampaignSaves) {
    // RAW id (whatever type the save carries) — buildGraph keys its graph and
    // saveIndex by the raw `save.id`, so the implicit edge's targetId must be the
    // SAME raw value. Stringifying here would make a numeric-id node get keyed as
    // a number in the graph but String("3") on this edge — two distinct Map/Set
    // keys — which double-visits an already-explicitly-linked partner and drops
    // tier-ratio enrichment + onward propagation. `otherId` (String) is only for
    // self/dedup comparison and the synthetic linkId.
    const rawOtherId = other?.id ?? other?.settlement?.id;
    const otherId = idOf(other);
    if (!otherId || otherId === selfId) continue;        // skip self
    if (linkedIds.has(otherId)) continue;                // explicit wins (by id)
    const otherName = nameOf(other);
    if (otherName != null && linkedNames.has(String(otherName))) continue; // explicit wins (by name)

    result.push({
      [IMPLICIT_NEUTRAL_FLAG]: true,
      // A direct-target hint buildGraph resolves in one step (no shared linkId,
      // no fragile name match). linkId/id/name kept for shape-parity with real
      // links so display/label helpers degrade gracefully if one ever reads it.
      targetId: rawOtherId,
      linkId: implicitLinkId(selfId, otherId),
      id: rawOtherId,
      neighbourName: otherName ?? otherId,
      name: otherName ?? otherId,
      relationshipType: 'neutral',
      localRelationshipRole: 'neutral',
      displayRelationshipType: 'neutral',
      bidirectional: true,
    });
  }
  return result;
}

/**
 * Build a Map<settlementIdString, campaignId> from campaign objects (each with
 * `{ id, settlementIds }`). Pure — the caller passes the ACTIVE campaigns (an
 * archived/deleted campaign must not make its members implicit neighbours). A
 * settlement in no campaign is simply absent from the map, so it gets no
 * implicit neutrals. Ids are String-normalized to match the acknowledged
 * number/string id mix (Owner Ruling #5), same as campaignSettlements().
 *
 * @param {Array<{id: string|number, settlementIds?: Array<string|number>}>} campaigns
 * @returns {Map<string, string|number>}
 */
export function campaignMembershipIndex(campaigns) {
  const index = new Map();
  for (const c of Array.isArray(campaigns) ? campaigns : []) {
    const cid = c?.id;
    if (cid == null) continue;
    for (const sid of c?.settlementIds || []) {
      index.set(String(sid), cid);
    }
  }
  return index;
}
