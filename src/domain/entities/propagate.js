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
import { factionArchetype } from '../factionArchetypes.js';
import {
  factionDisplayNameOf,
  factionRefOf,
  resolveFactionRef,
} from '../factionRefs.js';

// domain-top-3: institution catalog category → canonical faction archetype. Used
// only as the DOCUMENTED FALLBACK when a faction carries no explicit
// controls/funds/staffs/protects link to an institution — a faction whose
// archetype matches the institution's category then takes a low default
// impairment ('the granary burned → the controlling merchant faction suffers').
// Categories with no clean faction counterpart (Infrastructure/Adventuring/
// Entertainment/Exotic) are intentionally omitted so the fallback never fires
// spuriously. Explicit link lists always win.
/** @type {Record<string, string>} */
const INSTITUTION_CATEGORY_ARCHETYPE = Object.freeze({
  religious: 'religious',
  defense: 'military',
  criminal: 'criminal',
  government: 'government',
  magic: 'arcane',
  crafts: 'craft',
  economy: 'merchant',
});

/** @param {{ category?: string } | null | undefined} inst @returns {string|null} canonical archetype for an institution's category */
function institutionCategoryArchetype(inst) {
  const cat = String((inst && inst.category) || '').trim().toLowerCase();
  return INSTITUTION_CATEGORY_ARCHETYPE[cat] || null;
}

/** @typedef {import('./status.js').Impairment} Impairment */
/** @typedef {import('./status.js').ImpairmentType} ImpairmentType */

// ── Types ──────────────────────────────────────────────────────────────────
// Minimal structural shapes propagation needs. Real settlements carry far
// more fields; the generic signatures below thread the caller's full type
// through untouched, so extra properties survive the spreads.

/** @typedef {'institution'|'faction'|'npc'} PropagationEntityType */

/**
 * @typedef {Object} PropagationInstitution
 * @property {string=} id
 * @property {string=} name
 * @property {string=} status
 * @property {string=} category
 * @property {Impairment[]=} impairments
 */

/**
 * @typedef {Object} PropagationFaction
 * @property {string=} id
 * @property {string=} faction   legacy name field ({ faction, power, desc } shape)
 * @property {string=} name
 * @property {string=} status
 * @property {Impairment[]=} impairments
 * @property {string[]=} controlsInstitutionIds
 * @property {string[]=} fundsInstitutionIds
 * @property {string[]=} staffsInstitutionIds
 * @property {string[]=} protectsInstitutionIds
 */

/**
 * @typedef {Object} PropagationNpc
 * @property {string=} id
 * @property {string=} name
 * @property {string=} status
 * @property {string=} importance   canonical values: NpcImportance (entities/npcs.js)
 * @property {Impairment[]=} impairments
 * @property {string[]=} linkedInstitutionIds
 * @property {string[]=} linkedFactionIds
 */

/**
 * @typedef {Object} PropagationSettlement
 * @property {PropagationInstitution[]=} institutions
 * @property {PropagationFaction[]=} factions
 * @property {PropagationNpc[]=} npcs
 * @property {{ factions?: PropagationFaction[] }=} powerStructure
 */

/**
 * The originating impairment a cascade expands from.
 * @typedef {Object} PropagationOrigin
 * @property {PropagationEntityType} entityType
 * @property {string} entityId
 * @property {Impairment} impairment
 */

/**
 * BFS frontier entry — an entity whose outgoing edges still need expanding.
 * @typedef {Object} PropagationNode
 * @property {PropagationEntityType} entityType
 * @property {string} entityId
 * @property {number} severity    attenuated severity outgoing edges should use
 * @property {number} hops        distance from the origin (0 = origin itself)
 * @property {ImpairmentType} dimension
 */

/**
 * One discovered link: propagate to `targetId` scaled by `strength` (0-1).
 * @typedef {Object} PropagationEdge
 * @property {PropagationEntityType} targetType
 * @property {string} targetId
 * @property {number} strength
 */

const DEFAULT_DAMPING = 0.6;
const MAX_HOPS = 2;

/**
 * Mapping from institution impairment type → faction impairment type.
 * Captures the causal logic: a granary losing CAPACITY hurts the
 * controlling faction's WEALTH; a temple losing LEGITIMACY hurts the
 * temple faction's PUBLIC_SUPPORT.
 *
 * @type {Partial<Record<ImpairmentType, import('./status.js').FactionImpairmentType>>}
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

/** Reciprocal: faction impairment → institution dimension.
 * @type {Partial<Record<ImpairmentType, import('./status.js').InstitutionImpairmentType>>}
 */
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
 * @template {PropagationSettlement} S
 * @param {Object} args
 * @param {S} args.settlement            must have .institutions[], .factions[], .npcs[]
 * @param {PropagationOrigin} args.origin
 * @param {Object} [args.opts]
 * @param {number} [args.opts.damping=0.6]
 * @param {number} [args.opts.maxHops=2]
 * @returns {S} new settlement with propagation applied
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
  /** @type {PropagationNode[]} */
  let frontier = [{
    entityType: origin.entityType,
    entityId:   origin.entityId,
    severity:   origin.impairment.severity ?? 0,
    hops:       0,
    dimension:  origin.impairment.type,
  }];

  let working = settlement;

  while (frontier.length) {
    /** @type {PropagationNode[]} */
    const next = [];
    for (const node of frontier) {
      if (node.hops >= maxHops) continue;
      const propagatedSeverity = node.severity * damping;
      if (propagatedSeverity < 0.05) continue;  // negligible — stop early

      // Find linked entities and apply impairments.
      const links = findLinkedEntities(working, node);
      for (const link of links) {
        // The npc→faction dimension depends on the NPC's importance tier
        // (leadership for a pillar, membership otherwise — see the contract in
        // findLinkedEntities / mapDimension). Resolve the source NPC so
        // mapDimension can honor that branch and agree with killNpc's own
        // direct-impairment choice.
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
 *
 * @param {PropagationSettlement} settlement
 * @param {PropagationNode} node
 * @returns {PropagationEdge[]}
 */
function findLinkedEntities(settlement, node) {
  /** @type {PropagationEdge[]} */
  const out = [];
  // Factions live in either `settlement.factions` or
  // `settlement.powerStructure.factions` depending on which generator
  // path produced the settlement. Normalize here so propagation walks
  // both — without this, `powerStructure`-shaped fixtures see no
  // cross-entity propagation. The matching helper `factionsList` is
  // used everywhere a faction lookup happens.
  const factions = factionsList(settlement);
  if (node.entityType === 'institution') {
    // Look up the institution so the archetype-match fallback (domain-top-3) can
    // compare the faction's archetype against this institution's category.
    const inst = (settlement.institutions || []).find(i => instId(i) === node.entityId);
    const instArchetype = institutionCategoryArchetype(inst);
    for (const f of factions) {
      const strength = factionInstitutionStrength(f, node.entityId, instArchetype);
      const targetId = factionRefOf(f);
      if (strength > 0 && targetId) out.push({ targetType: 'faction', targetId, strength });
    }
  } else if (node.entityType === 'faction') {
    const fac = resolveFactionRef(factions, node.entityId);
    for (const i of settlement.institutions || []) {
      const strength = fac ? factionInstitutionStrength(fac, instId(i), institutionCategoryArchetype(i)) : 0;
      if (strength > 0) out.push({ targetType: 'institution', targetId: instId(i), strength });
    }
  } else if (node.entityType === 'npc') {
    const npc = (settlement.npcs || []).find(n => npcId(n) === node.entityId);
    if (npc) {
      for (const linkedId of npc.linkedInstitutionIds || []) {
        out.push({ targetType: 'institution', targetId: linkedId, strength: importanceWeight(npc) });
      }
      const emittedFactionRefs = new Set();
      for (const linkedId of npc.linkedFactionIds || []) {
        const faction = resolveFactionRef(factions, linkedId);
        const targetId = factionRefOf(faction);
        if (!targetId || emittedFactionRefs.has(targetId)) continue;
        emittedFactionRefs.add(targetId);
        out.push({ targetType: 'faction', targetId, strength: importanceWeight(npc) });
      }
    }
  }
  return out;
}

/** Cross-type dimension mapping.
 * @param {PropagationEntityType} fromType
 * @param {PropagationEntityType} toType
 * @param {ImpairmentType} dim
 * @param {PropagationNpc | null | undefined} [sourceNpc]
 * @returns {ImpairmentType | null}
 */
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
 *
 * @param {PropagationFaction | null | undefined} faction
 * @param {string} instId
 * @param {string | null} [instArchetype] institution's canonical archetype for the fallback
 * @returns {number}
 */
function factionInstitutionStrength(faction, instId, instArchetype = null) {
  if (!faction || !instId) return 0;
  /** @type {Array<{key: 'controlsInstitutionIds'|'fundsInstitutionIds'|'staffsInstitutionIds'|'protectsInstitutionIds', weight: number}>} */
  const lists = [
    { key: 'controlsInstitutionIds', weight: 1.0 },
    { key: 'fundsInstitutionIds',    weight: 0.6 },
    { key: 'staffsInstitutionIds',   weight: 0.5 },
    { key: 'protectsInstitutionIds', weight: 0.4 },
  ];
  for (const { key, weight } of lists) {
    if (Array.isArray(faction[key]) && faction[key].includes(instId)) return weight;
  }
  // domain-top-3 fallback: no explicit link list matched. A faction whose canonical
  // archetype matches the institution's category takes a low default strength (~0.4)
  // so institution→faction impairment propagation actually fires on generated
  // settlements (which never write the explicit link lists). Explicit links above
  // always win — this only runs when none matched.
  if (instArchetype && factionArchetype(faction) === instArchetype) return 0.4;
  return 0;
}

/**
 * @param {PropagationNpc | null | undefined} npc
 * @returns {number}
 */
function importanceWeight(npc) {
  switch (npc?.importance) {
    case 'pillar': return 1.0;
    case 'key':    return 0.7;
    case 'notable':return 0.4;
    case 'minor':  return 0.0;  // minor NPCs don't propagate
    default:       return 0.4;
  }
}

/**
 * Apply one propagated impairment to the entity of the given type/id,
 * returning a new settlement (input never mutated).
 *
 * @template {PropagationSettlement} S
 * @param {S} settlement
 * @param {PropagationEntityType} type
 * @param {string} id
 * @param {Impairment} impairment
 * @returns {S}
 */
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
      const target = resolveFactionRef(settlement.powerStructure.factions, id);
      const next = settlement.powerStructure.factions.map(f =>
        f === target ? withImpairment(f, impairment) : f,
      );
      return { ...settlement, powerStructure: { ...settlement.powerStructure, factions: next } };
    }
    const target = resolveFactionRef(settlement.factions || [], id);
    const next = (settlement.factions || []).map(f =>
      f === target ? withImpairment(f, impairment) : f,
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
/** @type {(i: PropagationInstitution | null | undefined) => string} */
const instId    = (i) => i?.id || i?.name || '';
/** @type {(n: PropagationNpc | null | undefined) => string} */
const npcId     = (n) => n?.id || n?.name || '';
/** Normalize the two faction-storage shapes the codebase ships with.
 * @type {(s: PropagationSettlement | null | undefined) => PropagationFaction[]} */
const factionsList = (s) => s?.powerStructure?.factions || s?.factions || [];
/**
 * @param {PropagationSettlement} s
 * @param {PropagationEntityType} type
 * @param {string} id
 * @returns {string}
 */
function entityName(s, type, id) {
  const list = type === 'institution' ? s.institutions : type === 'faction' ? factionsList(s) : s.npcs;
  const e = type === 'faction'
    ? resolveFactionRef(/** @type {PropagationFaction[]} */ (list || []), id)
    : (list || []).find(x => (type === 'institution' ? instId(x) : npcId(x)) === id);
  return (type === 'faction' ? factionDisplayNameOf(e) : e?.name) || id;
}
/** @param {number} v @returns {number} */
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/**
 * Read the severity of an existing propagated impairment on a target so a
 * second cause path can compound onto it. Matches both type and cause so we
 * only ever fold paths from the SAME originating event together (distinct
 * events stack independently via withImpairment, as before).
 *
 * @param {PropagationSettlement} settlement
 * @param {PropagationEntityType} type
 * @param {string} id
 * @param {ImpairmentType} dimension
 * @param {string=} causeEventId
 * @returns {number}
 */
function currentSeverity(settlement, type, id, dimension, causeEventId) {
  const list = type === 'institution' ? settlement.institutions
    : type === 'faction' ? factionsList(settlement)
    : settlement.npcs;
  const entity = type === 'faction'
    ? resolveFactionRef(/** @type {PropagationFaction[]} */ (list || []), id)
    : (list || []).find(x => (type === 'institution' ? instId(x) : npcId(x)) === id);
  const match = (entity?.impairments || []).find(i => i.type === dimension && i.causeEventId === causeEventId);
  return match?.severity ?? 0;
}
