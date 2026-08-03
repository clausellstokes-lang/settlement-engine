/**
 * envoyErrand/vocabulary — WR-7a's closed envoy words and its persistence primitives.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4: the single-writer law
 * reads ONE WRITER FAMILY, never one file). `envoyErrand.js` remains the family HEAD.
 * This leaf owns only two things, and neither of them can reach world truth:
 *
 *   THE CLOSED WORDS — every band, state, kind, resolution and evidence spelling the
 *     errand lifecycle is allowed to hold, plus the derived Sets and exact-key lists the
 *     persistence DTOs match against. One spelling, one file: two spellings of a journey
 *     would let an import forge a state the writer never authored (FINITE-SEMANTICS LAW).
 *   THE PERSISTENCE PRIMITIVES — the strict readers (`text`, `strictText`, `wholeTick`)
 *     and the cycle-rejecting, key-sorting `cloneData`. These are what make a persisted
 *     row detached and replay-stable, so they belong beside the words they validate.
 *
 * K3 (NOBODY IS EVER CURRENT): this leaf has ZERO imports. A module that reaches nothing
 * cannot pass truth along, which is why the K3 pin freezes its import list as empty.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyK3BeliefSeam.test.js + tests/domain/envoyErrand.test.js
 */

export const ENVOY_ERRAND_LEDGER_KEY = 'envoyErrands';
export const MAX_CONCURRENT_ENVOYS = 2;
export const MAX_TERMINAL_ENVOY_HISTORY = 24;
export const MAX_ENVOY_RUMOR_REFS = 16;
export const MAX_ENVOY_ENCOUNTER_HISTORY = 16;
export const ENVOY_ENCOUNTER_SCHEMA_VERSION = 1;
export const ENVOY_CONTINUATION_SCHEMA_VERSION = 1;
export const ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION = 1;

export const ENVOY_REQUIRED_RULES = Object.freeze([
  'warLayerEnabled',
  'warTerminationEnabled',
  'peaceEngineEnabled',
  'envoyDiplomacyEnabled',
  'npcConsequencesEnabled',
  'routeLifecycleEnabled',
]);

export const ENVOY_ERRAND_STATES = Object.freeze([
  'travelling',
  'parlaying',
  'intercepted',
  'held',
  'returning',
  'home',
  'lost',
]);

export const ENVOY_EVIDENCE_KINDS = Object.freeze([
  'envoy_departed',
  'envoy_on_the_road',
  'envoy_returning',
  'envoy_home',
  'envoy_lost',
  'envoy_silence_inference',
  'terms_never_reached',
  'envoy_intercepted',
  'envoy_parlaying',
  'envoy_terms_agreed',
  'envoy_held',
  'terms_signed_for_a_fallen_town',
  'parlay_at_an_occupied_venue',
  'interceptor_dilemma',
  'interceptor_parlays_own_edge',
  'parlay_terms_neither_court_drafted',
]);

export const ENVOY_STORES_BANDS = Object.freeze([
  'bare',
  'thin',
  'stocked',
  'deep',
]);

export const ENVOY_STRENGTH_BANDS = Object.freeze([
  'spent',
  'strained',
  'ready',
  'strong',
  'dominant',
]);

export const ENVOY_MORALE_EXHAUSTION_BANDS = Object.freeze([
  'quiet',
  'present',
  'pressing',
  'decisive',
]);

export const ENVOY_FOUNDING_CAUSE_STATES = Object.freeze([
  'dissolved',
  'anchor_unavailable',
  'live',
]);

export const ENVOY_BELIEVED_RATIO_BANDS = Object.freeze([
  'far_behind',
  'behind',
  'matched',
  'ahead',
  'far_ahead',
]);

export const ENVOY_PICTURE_FIELDS = Object.freeze([
  'storesBand',
  'strengthBand',
  'moraleExhaustionBand',
  'foundingCauseStatus',
  'believedRatioBand',
]);

export const ENVOY_PICTURE_DIRECTIONS = Object.freeze(['rise', 'fall']);
export const ENVOY_POSITION_BANDS = Object.freeze(['departed', 'underway', 'near', 'arrived']);
export const ENVOY_JOURNEYS = Object.freeze(['outbound', 'return']);
export const ENVOY_LOSS_CAUSES = Object.freeze(['killed', 'route_lost', 'dm_removed']);
export const ENVOY_PURPOSES = Object.freeze(['sue', 'self_parlay']);
export const ENVOY_ENCOUNTER_KINDS = Object.freeze([
  'field_parlay',
  'war_continue',
  'private_goal',
]);
export const ENVOY_PRIVATE_GOALS = Object.freeze(['plant', 'imprison', 'terms_shop']);
export const ENVOY_ENCOUNTER_RESOLUTIONS = Object.freeze([
  'pending',
  'parlaying',
  'held',
  'resumed',
  'plant_resumed',
]);
export const ENVOY_ENCOUNTER_VENUE_KINDS = Object.freeze([
  'allied_hall',
  'occupied_enemy_settlement',
  'field_node',
]);
export const ENVOY_PARLAY_REFUSAL_REASONS = Object.freeze([
  'orientation_refused',
  'budget_refused',
  'family_refused',
  'asset_refused',
  'magnitude_refused',
  'duration_refused',
  'weight_refused',
  'no_sheet',
]);

export const STATE_SET = new Set(ENVOY_ERRAND_STATES);
// Every state a parlay can already have happened in. `travelling` is the only
// one excluded: nothing has been drafted there, so a refusal witness on it is a
// forged import.
export const REFUSAL_BEARING_STATES = new Set(
  ENVOY_ERRAND_STATES.filter((state) => state !== 'travelling'),
);
export const EVIDENCE_KIND_SET = new Set(ENVOY_EVIDENCE_KINDS);
export const JOURNEY_SET = new Set(ENVOY_JOURNEYS);
export const POSITION_BAND_SET = new Set(ENVOY_POSITION_BANDS);
export const LOSS_CAUSE_SET = new Set(ENVOY_LOSS_CAUSES);
export const PURPOSE_SET = new Set(ENVOY_PURPOSES);
export const ENCOUNTER_KIND_SET = new Set(ENVOY_ENCOUNTER_KINDS);
export const PRIVATE_GOAL_SET = new Set(ENVOY_PRIVATE_GOALS);
export const ENCOUNTER_RESOLUTION_SET = new Set(ENVOY_ENCOUNTER_RESOLUTIONS);
export const ENCOUNTER_VENUE_KIND_SET = new Set(ENVOY_ENCOUNTER_VENUE_KINDS);
export const PARLAY_REFUSAL_REASON_SET = new Set(ENVOY_PARLAY_REFUSAL_REASONS);
export const TERMINAL_STATES = new Set(['home', 'lost']);
export const ACTIVE_STATES = new Set(['travelling', 'parlaying', 'intercepted', 'held', 'returning']);

export const ENCOUNTER_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'kind',
  'interceptorId',
  'armyId',
  'venueId',
  'venueRef',
  'routeId',
  'encounteredTick',
  'resolvedTick',
  'priorState',
  'priorJourney',
  'priorPosition',
  'destinationId',
  'continuation',
  'privateGoal',
  'resolution',
  'interceptorPictureId',
  'interceptorPicture',
  'termSheetId',
]);

export const PARLAY_REFUSAL_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'parlayId',
  'attemptedTick',
  'proposerPictureId',
  'responderPictureId',
  'reason',
]);

export const CONTINUATION_KEYS = Object.freeze([
  'schemaVersion',
  'resumeState',
  'journey',
  'destinationId',
  'resumedTick',
  'scheduledArrivalTick',
]);

export const PICTURE_BANDS = Object.freeze({
  storesBand: ENVOY_STORES_BANDS,
  strengthBand: ENVOY_STRENGTH_BANDS,
  moraleExhaustionBand: ENVOY_MORALE_EXHAUSTION_BANDS,
  foundingCauseStatus: ENVOY_FOUNDING_CAUSE_STATES,
  believedRatioBand: ENVOY_BELIEVED_RATIO_BANDS,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
export function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** Strict string read. IDs are never manufactured from numbers or indexes. */
export function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number|null} */
export function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** Repository-independent codepoint order. */
export function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Clone JSON-like data while rejecting cycles, non-finite numbers, functions,
 * symbols, and class instances.  Object keys are sorted so an injected term
 * sheet cannot make replay serialization depend on authoring order.
 *
 * @param {unknown} value
 * @param {number} [depth]
 * @param {WeakSet<object>} [ancestors]
 * @returns {unknown}
 */
export function cloneData(value, depth = 0, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (!value || typeof value !== 'object' || depth > 12) return undefined;
  if (ancestors.has(/** @type {object} */ (value))) return undefined;
  ancestors.add(/** @type {object} */ (value));
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      const cloned = cloneData(item, depth + 1, ancestors);
      if (cloned !== undefined) out.push(cloned);
    }
    ancestors.delete(/** @type {object} */ (value));
    return out;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    ancestors.delete(/** @type {object} */ (value));
    return undefined;
  }
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of Object.keys(/** @type {Record<string, unknown>} */ (value)).sort(compareCodepoint)) {
    const cloned = cloneData(/** @type {Record<string, unknown>} */ (value)[key], depth + 1, ancestors);
    if (cloned !== undefined) out[key] = cloned;
  }
  ancestors.delete(/** @type {object} */ (value));
  return out;
}

/** A detached, non-empty JSON-safe record, or null. */
export function jsonRecord(value) {
  const cloned = cloneData(value);
  const row = asObject(cloned);
  return Object.keys(row).length ? row : null;
}

/** @param {Record<string, unknown>} row @param {ReadonlyArray<string>} keys */
export function hasExactKeys(row, keys) {
  const actual = Object.keys(row).sort(compareCodepoint);
  const expected = [...keys].sort(compareCodepoint);
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

/** Authored WR-7b identities are not trimmed or coerced at persistence seams. */
export function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value === value.trim()
    && ![...value].some((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127;
    })
    ? value
    : '';
}

/** Collision-free identity text for persisted witnesses. */
export function stableIdentity(parts) {
  return parts.map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}
