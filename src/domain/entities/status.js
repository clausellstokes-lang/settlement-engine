/**
 * domain/entities/status.js — Entity status + impairment data model.
 *
 * The plan's clarifying insight: events cannot only update SystemState.
 * If the event says "the granary burned," the granary cannot still
 * appear everywhere as fully active. This module defines the canonical
 * status vocabulary and the impairment shape that events emit and
 * subsequent renders consult.
 *
 * Three structural ideas:
 *   1. Status — coarse lifecycle of an entity (active/impaired/removed/...)
 *   2. Impairments — typed, severity-scaled annotations explaining WHY
 *      something is impaired and what dimension is affected (capacity,
 *      legitimacy, influence, wealth, etc.)
 *   3. Causes — every impairment carries the event id that produced it,
 *      so the timeline can be replayed and a single event can be undone
 *      without losing unrelated impairments.
 *
 * Pure data — no React, no Zustand, no I/O. The propagation engine
 * lives in `propagate.js`; this file is types and predicates only.
 */

/** @typedef {'active'|'impaired'|'removed'|'destroyed'|'vacant'} EntityStatus
 *
 *   active     — fully functional. Default.
 *   impaired   — reduced capacity / legitimacy / influence; has at least one impairment
 *   removed    — institution closed, NPC departed, faction dissolved (recoverable)
 *   destroyed  — physical destruction; rebuild required (rarely automatic)
 *   vacant     — institution exists but lacks leadership (an NPC slot is empty)
 */

/** @typedef {'capacity'|'legitimacy'|'influence'|'wealth'|'staffing'|'infrastructure'|'access'|'corruption'} InstitutionImpairmentType */

/** @typedef {'leadership'|'legitimacy'|'wealth'|'coercive_capacity'|'membership'|'public_support'|'access'|'legal_standing'|'internal_unity'} FactionImpairmentType */

/** @typedef {InstitutionImpairmentType | FactionImpairmentType} ImpairmentType
 *
 * Impairments cross both entity types during propagation (an
 * institution's `capacity` impairment becomes a faction's `wealth`
 * impairment one hop downstream), so the union is the working type.
 * Constraining a specific list is fine where the call site knows it's
 * only dealing with one entity kind.
 */

/** @typedef {Object} Impairment
 *  @property {ImpairmentType} type
 *  @property {number} severity        0-1; 0.0 = no effect, 1.0 = total impairment
 *                                     (negative values used for restoration patches)
 *  @property {string} causeEventId    timeline link — supports undo and replay
 *  @property {string=} description    human-readable, surfaced in UI/PDF (optional —
 *                                     auto-generated from propagation if absent)
 *  @property {string=} appliedAt      ISO timestamp
 */

/** Default status when no impairments exist. */
export const STATUS_ACTIVE    = 'active';
export const STATUS_IMPAIRED  = 'impaired';
export const STATUS_REMOVED   = 'removed';
export const STATUS_DESTROYED = 'destroyed';
export const STATUS_VACANT    = 'vacant';

/**
 * Construct a typed Impairment object. Centralizing the cast at one
 * call site means mutation handlers in events/mutate.js don't repeat
 * the JSDoc-cast incantation 12 times. Trusts the caller to pick a
 * valid type; runtime validation can be added later if the registry
 * gets schema enforcement.
 *
 * @param {ImpairmentType} type
 * @param {number}         severity      0-1 (or negative for restoration)
 * @param {string}         causeEventId
 * @param {string=}        description
 * @returns {Impairment}
 */
export function mkImpairment(type, severity, causeEventId, description) {
  return /** @type {Impairment} */ ({
    type,
    severity,
    causeEventId,
    description: description || `Impairment: ${type}`,
  });
}

/**
 * True when an entity carries impairment(s) and every one of them is covert —
 * i.e. its 'impaired' status would be entirely a hidden mark with no public
 * cause. A covert capture (institution-scope Impose Corruption) bumps status
 * but must never surface as a visible "impaired" badge or drag public derived
 * state. Centralized here so effectiveStatus / isFullyActive / withImpairment
 * and deriveSystemState all share ONE definition of "covert-only".
 *
 * @param {any} entity
 * @returns {boolean}
 */
export function isCovertOnlyImpairment(entity) {
  const imps = entity?.impairments;
  if (!Array.isArray(imps) || !imps.length) return false;
  return imps.every(imp => imp?.covert === true);
}

/**
 * True when an impairment actually degrades the entity: it has positive
 * effective severity AND is not a covert (hidden) mark. A non-positive
 * severity is a RESTORATION patch (a popular leader's legitimacy bonus is
 * stored as severity -0.4) — it must never push the entity into 'impaired'.
 *
 * @param {any} imp
 * @returns {boolean}
 */
function impairmentDegrades(imp) {
  return (imp?.severity ?? 0) > 0 && imp?.covert !== true;
}

/**
 * True when at least one impairment in the set visibly degrades the entity —
 * the gate for reporting 'impaired'. An entity carrying only restoration
 * patches (negative severity) and/or covert marks is NOT visibly impaired.
 *
 * @param {any} entity
 * @returns {boolean}
 */
function hasVisibleImpairment(entity) {
  const imps = entity?.impairments;
  if (!Array.isArray(imps) || !imps.length) return false;
  return imps.some(impairmentDegrades);
}

/**
 * Determine the effective status of an entity given its impairments.
 * Status field on the entity wins if it's a removal/destruction state;
 * otherwise impairments determine impaired vs active.
 *
 * Only impairments that visibly degrade (positive severity, non-covert)
 * count: a clean institution carrying a restoration patch (a popular
 * leader's legitimacy bonus, stored as negative severity) or a covert-only
 * capture reads ACTIVE, not impaired.
 *
 * @param {any} entity   institution/faction/npc with optional `status` and `impairments`
 * @returns {EntityStatus}
 */
export function effectiveStatus(entity) {
  if (!entity) return STATUS_ACTIVE;
  if (entity.status === STATUS_REMOVED || entity.status === STATUS_DESTROYED) return entity.status;
  if (entity.status === STATUS_VACANT)   return STATUS_VACANT;
  if (hasVisibleImpairment(entity)) return STATUS_IMPAIRED;
  return STATUS_ACTIVE;
}

/**
 * Append a new impairment to an entity, replacing any prior impairment
 * of the same type from the same cause (idempotent re-apply). If a new
 * impairment of the same type comes from a *different* cause, it stacks.
 *
 * Returns a new entity object — never mutates the input. The pipeline
 * uses this to compose patches; the store reducer applies them.
 *
 * @param {any} entity
 * @param {Impairment} impairment
 * @returns {Object} new entity
 */
export function withImpairment(entity, impairment) {
  if (!entity) return entity;
  const prev = entity.impairments || [];
  // Idempotency: replace if same type + same cause
  const filtered = prev.filter((/** @type {any} */ i) => !(i.type === impairment.type && i.causeEventId === impairment.causeEventId));
  const nextImpairments = [...filtered, { ...impairment, appliedAt: impairment.appliedAt ?? null }];
  return {
    ...entity,
    // Do NOT default appliedAt to wall-clock: this runs inside the pure, seeded
    // event pipeline and a Date.now() here embedded nondeterministic timestamps
    // into settlement state. Callers with a deterministic clock pass appliedAt
    // explicitly (e.g. world-pulse `now`); the rest carry causeEventId for
    // provenance and the event log records the authoritative timestamp.
    impairments: nextImpairments,
    // Auto-bump status to impaired ONLY when the resulting set carries a
    // visibly-degrading impairment, and never override a removed/destroyed/
    // vacant set. A pure RESTORATION patch (negative severity — e.g. a popular
    // leader's legitimacy bonus) or a covert-only mark must NOT drive a clean
    // institution to 'impaired'; leave its prior status untouched.
    status: (entity.status === STATUS_REMOVED ||
             entity.status === STATUS_DESTROYED ||
             entity.status === STATUS_VACANT)
      ? entity.status
      : (hasVisibleImpairment({ impairments: nextImpairments })
          ? STATUS_IMPAIRED
          : entity.status || STATUS_ACTIVE),
  };
}

/**
 * Remove all impairments produced by a given event id — the inverse of
 * withImpairment. Used by undoLastEvent to restore prior state.
 * @param {any} entity @param {any} causeEventId
 */
export function withoutEventImpairments(entity, causeEventId) {
  if (!entity) return entity;
  const prev = entity.impairments || [];
  const filtered = prev.filter((/** @type {any} */ i) => i.causeEventId !== causeEventId);
  const status = filtered.length === 0 && entity.status === STATUS_IMPAIRED
    ? STATUS_ACTIVE
    : entity.status;
  return { ...entity, impairments: filtered, status };
}

/**
 * Compute the aggregate severity for a given impairment dimension —
 * useful for UI display and propagation rules ("how much capacity has
 * this institution lost?"). Multiple impairments of the same type
 * compound but cap at 1.0.
 *
 * Compounding rule: combined = 1 - prod(1 - s_i). Two 0.5 impairments
 * yield 0.75, not 1.0 — preserves "still has some capacity."
 * @param {any} entity @param {any} type
 */
export function severityFor(entity, type) {
  const impairments = (entity?.impairments || []).filter((/** @type {any} */ i) => i.type === type);
  if (!impairments.length) return 0;
  let surviving = 1;
  for (const i of impairments) surviving *= (1 - clamp01(i.severity ?? 0));
  return Number((1 - surviving).toFixed(3));
}

/** @param {any} v */
function clamp01(v) {
  if (!Number.isFinite(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

/**
 * True if the entity is at full capacity with no impairments.
 * Convenient predicate for UI rendering ("show damaged badge?").
 * @param {any} entity
 */
export function isFullyActive(entity) {
  return effectiveStatus(entity) === STATUS_ACTIVE;
}
