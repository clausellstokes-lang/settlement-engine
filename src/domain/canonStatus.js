/**
 * domain/canonStatus.js — Canon boundary tagging.
 *
 * Tier 5.3 of the roadmap. Every entity on a settlement comes from
 * one of four sources: the procedural generator, the user's own
 * additions, an applied event, or an AI overlay polish. The
 * canonStatus tag tells downstream consumers (AI overlay, the NPC
 * reroll's preservation tail, PDF) which entities are "real canon",
 * which are still draft, and which are optional flavor the user has
 * chosen to keep separate.
 *
 *   tagEntityCanon(entity, settlement?) -> {
 *     source: 'generated' | 'user' | 'event' | 'ai_overlay'
 *     canonStatus: 'draft' | 'canon' | 'optional' | 'superseded'
 *     locked: boolean
 *   }
 *
 * Pure read-only. Looks at explicit fields (`source`, `canonStatus`,
 * `locked`, `_source`, `_authored`) first and falls back to a
 * conservative inference.
 *
 * The set of taggable entities matches Phase 19's EXPLAINABLE_TYPES
 * — institutions, factions, npcs, hooks, chains, conditions, etc.
 */

// ── Local typedefs ───────────────────────────────────────────────────────

/** @typedef {'generated'|'user'|'event'|'ai_overlay'} CanonSource */
/** @typedef {'draft'|'canon'|'optional'|'superseded'} CanonStatus */

/**
 * The explicit + heuristic fields the tagger reads off any entity.
 * @typedef {Object} CanonTaggable
 * @property {string} [source]
 * @property {string} [_source]
 * @property {string} [canonStatus]
 * @property {boolean} [locked]
 * @property {boolean} [pinned]
 * @property {boolean} [superseded]
 * @property {boolean} [_authored]
 * @property {boolean} [userAuthored]
 * @property {string} [appliedAt]
 * @property {string} [causeEventId]
 * @property {string} [createdByEventId]
 * @property {boolean} [_aiPolished]
 * @property {boolean} [_aiOverlay]
 */

/**
 * @typedef {Object} CanonTag
 * @property {CanonSource} source
 * @property {CanonStatus} canonStatus
 * @property {boolean} locked
 */

/**
 * Settlement entity arrays canonBreakdown walks.
 * @typedef {Object} CanonSettlementSource
 * @property {Array<CanonTaggable|null>} [institutions]
 * @property {{factions?: Array<CanonTaggable|null>}} [powerStructure]
 * @property {Array<CanonTaggable|null>} [npcs]
 * @property {Array<CanonTaggable|null>} [activeConditions]
 * @property {Array<CanonTaggable|null>} [eventLog]
 */

/**
 * @typedef {Object} CanonBreakdown
 * @property {Record<CanonSource, number>} bySource
 * @property {Record<CanonStatus, number>} byStatus
 * @property {number} locked
 * @property {number} total
 */

// ── Vocabularies ─────────────────────────────────────────────────────────

export const CANON_SOURCES = Object.freeze([
  'generated', 'user', 'event', 'ai_overlay',
]);

export const CANON_STATUSES = Object.freeze([
  'draft', 'canon', 'optional', 'superseded',
]);

// ── Single-entity tagger ────────────────────────────────────────────────

/**
 * @param {CanonTaggable} entity
 * @returns {CanonSource}
 */
function inferSource(entity) {
  if (typeof entity.source === 'string' && CANON_SOURCES.includes(entity.source)) {
    // @ts-ignore -- includes() checked membership in the CanonSource vocabulary; TS does not narrow through it.
    return entity.source;
  }
  if (typeof entity._source === 'string' && CANON_SOURCES.includes(entity._source)) {
    // @ts-ignore -- includes() checked membership in the CanonSource vocabulary; TS does not narrow through it.
    return entity._source;
  }
  if (entity._authored === true || entity.userAuthored === true) return 'user';
  // createdByEventId is what ADD_NPC / ADD_INSTITUTION / ADD_FACTION actually
  // stamp (and what undo keys deletion off). Omitting it tagged an entity the
  // user invented through the event system as 'generated', so a reroll destroyed
  // it — the most explicit canon an entity can carry, unprotected.
  if (typeof entity.appliedAt === 'string' || entity.causeEventId || entity.createdByEventId) return 'event';
  if (entity._aiPolished === true || entity._aiOverlay === true) return 'ai_overlay';
  return 'generated';
}

/**
 * @param {CanonTaggable} entity
 * @param {CanonSource} source
 * @returns {CanonStatus}
 */
function inferCanonStatus(entity, source) {
  if (typeof entity.canonStatus === 'string' && CANON_STATUSES.includes(entity.canonStatus)) {
    // @ts-ignore -- includes() checked membership in the CanonStatus vocabulary; TS does not narrow through it.
    return entity.canonStatus;
  }
  if (entity.superseded === true) return 'superseded';
  // User-added entities are canon by default (the user explicitly authored them).
  if (source === 'user') return 'canon';
  // Generated entities are draft unless the user has locked them.
  if (source === 'generated') {
    return entity.locked === true || entity.pinned === true ? 'canon' : 'draft';
  }
  // Event-applied entities are canon by virtue of having been committed.
  if (source === 'event') return 'canon';
  // AI overlay output is optional flavor by default.
  if (source === 'ai_overlay') return 'optional';
  return 'draft';
}

/**
 * @param {CanonTaggable} entity
 * @param {CanonSource} source
 * @param {CanonStatus} canonStatus
 * @returns {boolean}
 */
function inferLocked(entity, source, canonStatus) {
  if (entity.locked === true || entity.pinned === true) return true;
  // User-canon entities default to locked; the user has staked them.
  if (source === 'user' && canonStatus === 'canon') return true;
  // Event-canon entities are locked (committing an event makes it part of the timeline).
  if (source === 'event' && canonStatus === 'canon') return true;
  return false;
}

/**
 * Compute the canon tag for a single entity.
 *
 * @param {CanonTaggable | null | undefined} entity
 * @returns {CanonTag}
 */
export function tagEntityCanon(entity /* , settlement */) {
  if (!entity || typeof entity !== 'object') {
    return { source: 'generated', canonStatus: 'draft', locked: false };
  }
  const source = inferSource(entity);
  const canonStatus = inferCanonStatus(entity, source);
  const locked = inferLocked(entity, source, canonStatus);
  return { source, canonStatus, locked };
}

// ── Collection-level helpers ────────────────────────────────────────────

/**
 * Tag every entity in a flat array. Returns an array of
 * `{ entity, ...tag }` records so consumers can render lists with
 * the tag attached without modifying the entity itself.
 * @param {Array<CanonTaggable|null> | null | undefined} entities
 * @param {object} [settlement]
 * @returns {Array<CanonTag & {entity: CanonTaggable|null}>}
 */
// eslint-disable-next-line no-unused-vars
export function tagEntityList(entities, settlement) {
  if (!Array.isArray(entities)) return [];
  return entities.map(e => ({ entity: e, ...tagEntityCanon(e) }));
}

/**
 * Count entities by source + canon status across the major
 * settlement entity arrays.
 * @param {CanonSettlementSource | null | undefined} settlement
 * @returns {CanonBreakdown}
 */
export function canonBreakdown(settlement) {
  /** @type {CanonBreakdown} */
  const out = {
    bySource: { generated: 0, user: 0, event: 0, ai_overlay: 0 },
    byStatus: { draft: 0, canon: 0, optional: 0, superseded: 0 },
    locked: 0,
    total: 0,
  };
  if (!settlement) return out;

  /** @param {Array<CanonTaggable|null> | undefined} arr */
  const collect = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const e of arr) {
      if (!e) continue;
      const tag = tagEntityCanon(e);
      out.bySource[tag.source] = (out.bySource[tag.source] || 0) + 1;
      out.byStatus[tag.canonStatus] = (out.byStatus[tag.canonStatus] || 0) + 1;
      if (tag.locked) out.locked += 1;
      out.total += 1;
    }
  };

  collect(settlement.institutions);
  collect(settlement.powerStructure?.factions);
  collect(settlement.npcs);
  collect(settlement.activeConditions);
  collect(settlement.eventLog);

  return out;
}

// ── Catalog accessors ───────────────────────────────────────────────────

/** @returns {string[]} */
export function supportedCanonSources() {
  return [...CANON_SOURCES];
}
/** @returns {string[]} */
export function supportedCanonStatuses() {
  return [...CANON_STATUSES];
}
