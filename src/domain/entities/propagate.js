/**
 * domain/entities/propagate.js — Cross-entity impairment propagation.
 *
 * The plan: institution impaired → linked faction impaired (and vice
 * versa). NPC removed from a load-bearing role → institution loses its
 * legitimacy/capacity contribution → faction with stake loses
 * influence. This module is the propagation engine.
 *
 * Three deliberate constraints:
 *   1. Damping per hop. Each propagation step reduces severity by a
 *      damping factor (default 0.6). Without this, one event cascades
 *      into ten consequences and the simulation feels brittle. With it,
 *      cascades naturally taper.
 *   2. Maximum hop distance. We never propagate further than 2 hops
 *      from the originating event. NPC death → institution → linked
 *      factions. Stop. Going further turns events into earthquakes.
 *   3. Reciprocal symmetry. Institution impairment propagates to
 *      faction. Faction impairment propagates to institution. Same rule
 *      either direction; the relationship object knows the strength.
 *
 * Pure: no React, no store. Returns patch objects the reducer applies.
 */

import { withImpairment } from './status.js';

/** @typedef {import('./status.js').Impairment} Impairment */

const DEFAULT_DAMPING = 0.6;
const MAX_HOPS = 2;

/**
 * Mapping from institution impairment type → faction impairment type.
 * Captures the causal logic: a granary losing CAPACITY hurts the
 * controlling faction's WEALTH; a temple losing LEGITIMACY hurts the
 * temple faction's PUBLIC_SUPPORT.
 */
const INSTITUTION_TO_FACTION_DIM = {
  capacity:       'wealth',
  legitimacy:     'public_support',
  influence:      'public_support',
  wealth:         'wealth',
  staffing:       'membership',
  infrastructure: 'wealth',
  access:         'access',
  corruption:     'legitimacy',
};

/** Reciprocal: faction impairment → institution dimension. */
const FACTION_TO_INSTITUTION_DIM = {
  leadership:        'staffing',
  legitimacy:        'legitimacy',
  wealth:            'wealth',
  coercive_capacity: 'capacity',
  membership:        'staffing',
  public_support:    'legitimacy',
  access:            'access',
  legal_standing:    'legitimacy',
  internal_unity:    'staffing',
};

/**
 * Compute and apply impairment cascades from an originating impairment
 * on an entity. Returns a new settlement with all propagated
 * impairments applied.
 *
 * Caller responsibility: the originating impairment must already be on
 * the source entity. This function only adds the *propagated* effects.
 *
 * @param {Object} args
 * @param {Object} args.settlement       must have .institutions[], .factions[], .npcs[]
 * @param {{ entityType:'institution'|'faction'|'npc', entityId:string, impairment:Impairment }} args.origin
 * @param {Object} [args.opts]
 * @param {number} [args.opts.damping=0.6]
 * @param {number} [args.opts.maxHops=2]
 * @returns {Object} new settlement with propagation applied
 */
export function propagateImpairment({ settlement, origin, opts = {} }) {
  if (!settlement || !origin) return settlement;
  const damping = opts.damping ?? DEFAULT_DAMPING;
  const maxHops = opts.maxHops ?? MAX_HOPS;

  // Visited set to guard against cycles. Keyed by the impairment DIMENSION an
  // edge would land — `${entityType}:${entityId}:${dimension}` — not the bare
  // entity. A single entity can be genuinely impaired along distinct cause
  // paths (a faction whose two controlled institutions both burn loses wealth
  // twice over); a bare-entity key silently dropped the second path and
  // under-counted multi-path damage. The dimension in the key still closes
  // every cycle: re-reaching a node on the SAME dimension re-walks the same
  // edge, so we stop there (and compound severity rather than restamp). The
  // origin is seeded under its own dimension so propagation never loops back
  // onto it on that channel — preserving KILL_NPC's exact-once landing.
  const visited = new Set([`${origin.entityType}:${origin.entityId}:${origin.impairment.type}`]);

  // BFS frontier: entities to expand from. Each entry carries the
  // attenuated severity its outgoing edges should use.
  /** @type {Array<{ entityType:string, entityId:string, severity:number, hops:number, dimension:string }>} */
  let frontier = [{
    entityType: origin.entityType,
    entityId:   origin.entityId,
    severity:   origin.impairment.severity ?? 0,
    hops:       0,
    dimension:  origin.impairment.type,
  }];

  let working = settlement;

  while (frontier.length) {
    const next = [];
    for (const node of frontier) {
      if (node.hops >= maxHops) continue;
      const propagatedSeverity = node.severity * damping;
      if (propagatedSeverity < 0.05) continue;  // negligible — stop early

      // Find linked entities and apply impairments.
      const links = findLinkedEntities(working, node);
      for (const link of links) {
        // The npc→faction dimension depends on the NPC's importance tier
        // (leadership for pillar/key, membership for notable/minor — see the
        // contract in findLinkedEntities). Resolve the source NPC so
        // mapDimension can honor that branch.
        const sourceNpc = node.entityType === 'npc'
          ? (working.npcs || []).find(n => npcId(n) === node.entityId)
          : null;
        const propagatedDim = mapDimension(node.entityType, link.targetType, node.dimension, sourceNpc);
        if (!propagatedDim) continue;

        // Severity also scales by relationship strength: a faction that
        // weakly funds an institution receives less impact than one that
        // staffs and controls it.
        const linkStrength = typeof link.strength === 'number' ? link.strength : 1;
        const linkSeverity = clamp01(propagatedSeverity * linkStrength);
        if (linkSeverity < 0.05) continue;

        // Cycle guard, keyed by the landing dimension. A second path that
        // reaches the same entity on the SAME dimension would re-walk an edge
        // we've already taken — so we don't expand it again (that closes the
        // cycle). But we DO compound its severity into the existing impairment:
        // two burned institutions hurt their shared controller more than one,
        // and the bare-entity key used to drop that second hit entirely.
        const visitKey = `${link.targetType}:${link.targetId}:${propagatedDim}`;
        const alreadyVisited = visited.has(visitKey);

        const priorSeverity = currentSeverity(working, link.targetType, link.targetId, propagatedDim, origin.impairment.causeEventId);
        // Compound on the house rule (1 − ∏(1 − sᵢ)): paths combine without
        // ever exceeding total impairment. First hit: priorSeverity is 0, so
        // this is the plain linkSeverity.
        const mergedSeverity = clamp01(1 - (1 - priorSeverity) * (1 - linkSeverity));

        const impairment = {
          type: propagatedDim,
          severity: mergedSeverity,
          causeEventId: origin.impairment.causeEventId,
          description: `Propagated from ${node.entityType} "${entityName(working, node.entityType, node.entityId)}" (${node.dimension} → ${propagatedDim}, hop ${node.hops + 1})`,
          // Inherit the origin's timestamp so propagation stays deterministic when
          // the caller threads `appliedAt` (required in the world-pulse, which bans
          // new Date()). Undefined when the origin had none — unchanged behavior.
          appliedAt: origin.impairment.appliedAt,
        };

        // withImpairment replaces same type+cause, so re-applying with the
        // compounded severity upgrades the existing impairment in place.
        working = applyImpairmentToEntity(working, link.targetType, link.targetId, impairment);

        if (alreadyVisited) continue;  // edge already expanded — compound only, don't re-walk
        visited.add(visitKey);

        next.push({
          entityType: link.targetType,
          entityId:   link.targetId,
          severity:   mergedSeverity,
          hops:       node.hops + 1,
          dimension:  propagatedDim,
        });
      }
    }
    frontier = next;
  }

  return working;
}

/**
 * Find entities linked to the given node. Returns a list of edges
 * with the target entity and the relationship strength.
 *
 * Link discovery rules (v1):
 *   - Institution ↔ Faction: scan settlement.factions for any whose
 *     `controlsInstitutionIds`, `fundsInstitutionIds`, or
 *     `staffsInstitutionIds` arrays include the institution. Default
 *     fallback: any faction whose `category` matches the institution's
 *     category (e.g. "religious" institution + "religious" faction).
 *   - NPC ↔ Institution: scan npc.linkedInstitutionIds (if present)
 *     and propagate to institution as a STAFFING impairment.
 *   - NPC ↔ Faction: scan npc.linkedFactionIds and propagate as
 *     LEADERSHIP or MEMBERSHIP based on importance tier.
 *
 * Relationship strength is derived from explicit fields when present
 * (e.g. faction.controlStrength) or defaulted by category match.
 */
function findLinkedEntities(settlement, node) {
  const out = [];
  // Factions live in either `settlement.factions` or
  // `settlement.powerStructure.factions` depending on which generator
  // path produced the settlement. Normalize here so propagation walks
  // both — without this, `powerStructure`-shaped fixtures see no
  // cross-entity propagation. The matching helper `factionsList` is
  // used everywhere a faction lookup happens.
  const factions = factionsList(settlement);
  if (node.entityType === 'institution') {
    for (const f of factions) {
      const strength = factionInstitutionStrength(f, node.entityId);
      if (strength > 0) out.push({ targetType: 'faction', targetId: factionId(f), strength });
    }
  } else if (node.entityType === 'faction') {
    for (const i of settlement.institutions || []) {
      const fac = factions.find((/** @type {any} */ f) => factionId(f) === node.entityId);
      const strength = fac ? factionInstitutionStrength(fac, instId(i)) : 0;
      if (strength > 0) out.push({ targetType: 'institution', targetId: instId(i), strength });
    }
  } else if (node.entityType === 'npc') {
    const npc = (settlement.npcs || []).find((/** @type {any} */ n) => npcId(n) === node.entityId);
    if (npc) {
      for (const linkedId of npc.linkedInstitutionIds || []) {
        out.push({ targetType: 'institution', targetId: linkedId, strength: importanceWeight(npc) });
      }
      for (const linkedId of npc.linkedFactionIds || []) {
        out.push({ targetType: 'faction', targetId: linkedId, strength: importanceWeight(npc) });
      }
    }
  }
  return out;
}

/** Cross-type dimension mapping. */
function mapDimension(fromType, toType, dim, sourceNpc) {
  if (fromType === 'institution' && toType === 'faction') return INSTITUTION_TO_FACTION_DIM[dim] || null;
  if (fromType === 'faction'     && toType === 'institution') return FACTION_TO_INSTITUTION_DIM[dim] || null;
  if (fromType === 'npc' && toType === 'institution') return 'staffing';
  if (fromType === 'npc' && toType === 'faction') {
    // Per the contract: leadership or membership by importance tier — and the
    // boundary MUST match killNpc's own direct-impairment choice, or a single
    // death lands TWO faction dimensions (a direct one + a propagated twin on a
    // different dimension) and conjures a spurious crisis. killNpc stamps
    // LEADERSHIP only for a PILLAR (npc.importance === 'pillar'); a key figure is
    // MEMBERSHIP there. Gate on the pillar weight (1.0), not the key weight (0.7),
    // so the two agree: pillar → leadership, key/notable → membership.
    return importanceWeight(sourceNpc) >= 1.0 ? 'leadership' : 'membership';
  }
  return null;
}

/**
 * Estimate the strength of a faction's link to an institution. Returns
 * 0 if no link, 0.0–1.0 otherwise. Prefers explicit fields; falls back
 * to category match.
 */
function factionInstitutionStrength(faction, instId) {
  if (!faction || !instId) return 0;
  /** @type {Array<{key: string, weight: number}>} */
  const lists = [
    { key: 'controlsInstitutionIds', weight: 1.0 },
    { key: 'fundsInstitutionIds',    weight: 0.6 },
    { key: 'staffsInstitutionIds',   weight: 0.5 },
    { key: 'protectsInstitutionIds', weight: 0.4 },
  ];
  for (const { key, weight } of lists) {
    if (Array.isArray(faction[key]) && faction[key].includes(instId)) return weight;
  }
  return 0;
}

/** @param {any} npc */
function importanceWeight(npc) {
  switch (npc?.importance) {
    case 'pillar': return 1.0;
    case 'key':    return 0.7;
    case 'notable':return 0.4;
    case 'minor':  return 0.0;  // minor NPCs don't propagate
    default:       return 0.4;
  }
}

function applyImpairmentToEntity(settlement, type, id, impairment) {
  if (type === 'institution') {
    const next = (settlement.institutions || []).map(i =>
      instId(i) === id ? withImpairment(i, impairment) : i,
    );
    return { ...settlement, institutions: next };
  }
  if (type === 'faction') {
    // Write back to whichever shape this settlement uses. powerStructure
    // is the canonical home for generator output; settlement.factions
    // exists in legacy paths. Pick the populated one.
    if (settlement.powerStructure?.factions) {
      const next = settlement.powerStructure.factions.map(f =>
        factionId(f) === id ? withImpairment(f, impairment) : f,
      );
      return { ...settlement, powerStructure: { ...settlement.powerStructure, factions: next } };
    }
    const next = (settlement.factions || []).map(f =>
      factionId(f) === id ? withImpairment(f, impairment) : f,
    );
    return { ...settlement, factions: next };
  }
  if (type === 'npc') {
    const next = (settlement.npcs || []).map(n =>
      npcId(n) === id ? withImpairment(n, impairment) : n,
    );
    return { ...settlement, npcs: next };
  }
  return settlement;
}

// ── Lookup helpers — entities lack consistent ID fields, so we
//    normalize via name fallback. Long-term, structured IDs replace this.
const instId    = (i) => i?.id || i?.name || '';
const factionId = (f) => f?.id || f?.faction || f?.name || '';
const npcId     = (n) => n?.id || n?.name || '';
/** Normalize the two faction-storage shapes the codebase ships with. */
const factionsList = (s) => s?.powerStructure?.factions || s?.factions || [];
function entityName(s, type, id) {
  const list = type === 'institution' ? s.institutions : type === 'faction' ? factionsList(s) : s.npcs;
  const e = (list || []).find(x => (type === 'institution' ? instId(x) : type === 'faction' ? factionId(x) : npcId(x)) === id);
  return e?.name || id;
}
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/**
 * Read the severity of an existing propagated impairment on a target so a
 * second cause path can compound onto it. Matches both type and cause so we
 * only ever fold paths from the SAME originating event together (distinct
 * events stack independently via withImpairment, as before).
 * @param {any} settlement
 * @param {string} type
 * @param {string} id
 * @param {string} dimension
 * @param {string} causeEventId
 * @returns {number}
 */
function currentSeverity(settlement, type, id, dimension, causeEventId) {
  const list = type === 'institution' ? settlement.institutions
    : type === 'faction' ? factionsList(settlement)
    : settlement.npcs;
  const entity = (list || []).find((/** @type {any} */ x) =>
    (type === 'institution' ? instId(x) : type === 'faction' ? factionId(x) : npcId(x)) === id);
  const match = (entity?.impairments || []).find((/** @type {any} */ i) => i.type === dimension && i.causeEventId === causeEventId);
  return match?.severity ?? 0;
}
