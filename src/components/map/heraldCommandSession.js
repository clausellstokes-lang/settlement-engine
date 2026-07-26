/**
 * heraldCommandSession.js — session-only return context for the Herald.
 *
 * A Realm entity link leaves the map route and unmounts the Inspector. Keeping
 * the reading position only in React state therefore loses the GM's place on a
 * dossier round trip. This module persists presentation state only:
 *
 *   - the open section and task lens;
 *   - search/filter choices;
 *   - the scroll and keyboard-focus return address;
 *   - an in-progress Briefing → destination return address; and
 *   - a bounded, exact settlement-portrait handoff (selection + recorded causes).
 *
 * It stores no campaign facts, permissions, or decisions. Every record is
 * campaign-scoped, versioned, bounded, and validated on read. A blocked or
 * unavailable sessionStorage silently leaves the component-local view usable.
 */

import { heraldDestinationForSceneAction } from './heraldCommandNavigation.js';

export const HERALD_COMMAND_SESSION_VERSION = 1;
export const HERALD_SCENE_CONTEXT_LIMITS = Object.freeze({
  provenanceRefs: 24,
  canonicalRelations: 24,
});

const STORAGE_PREFIX = 'sf.herald-command-session.v1';
const TIME_LENSES = new Set(['advance', 'campaign']);
const MAX_TEXT = 240;
const MAX_SCROLL_TOP = 10_000_000;
const CANONICAL_REF_TEXT_KEYS = Object.freeze([
  'catalogId',
  'localUid',
  'districtId',
  'roadId',
  'waterId',
  'archetype',
  'scarKind',
  'wallId',
  'buildingId',
  'reconstructionType',
]);
const CANONICAL_REF_LIST_KEYS = Object.freeze([
  'districtIds',
  'buildingIds',
  'wallIds',
]);

/**
 * @param {unknown} value
 * @param {number} [max]
 */
function text(value, max = MAX_TEXT) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Canonical ids in older saves may be finite numbers. Preserve that exact value
 * in the session's string-keyed vocabulary; objects and booleans remain invalid.
 *
 * @param {unknown} value
 * @param {number} [max]
 */
function identifier(value, max = MAX_TEXT) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value).slice(0, max);
  }
  return text(value, max);
}

/** @param {unknown} value */
function scrollTopOf(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(0, number), MAX_SCROLL_TOP);
}

/**
 * Preserve first-seen order while bounding a list to JSON-safe text.
 *
 * @param {unknown} value
 * @param {number} limit
 * @param {number} [maxText]
 * @returns {string[]}
 */
function textList(value, limit, maxText = MAX_TEXT) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (const candidate of value) {
    const normalized = text(candidate, maxText);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= limit) break;
  }
  return result;
}

/**
 * @param {unknown} value
 * @param {number} limit
 * @returns {string[]}
 */
function identifierList(value, limit) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (const candidate of value) {
    const normalized = identifier(candidate);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= limit) break;
  }
  return result;
}

/** @param {unknown} campaignId */
function campaignKey(campaignId) {
  const id = identifier(campaignId);
  return id ? `${STORAGE_PREFIX}:${encodeURIComponent(id)}` : null;
}

/** @returns {Storage|null} */
function storage() {
  try {
    return globalThis.window?.sessionStorage || null;
  } catch {
    return null;
  }
}

/** @param {unknown} value */
function returnOriginOf(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  const section = text(record.section);
  if (!section) return null;
  return {
    section,
    label: text(record.label, 80) || 'the previous Herald view',
    itemId: text(record.itemId) || null,
    scrollTop: scrollTopOf(record.scrollTop),
  };
}

/**
 * Keep only the renderer-neutral canonical-reference vocabulary emitted by the
 * scene compiler. `kind` and `id` are both required: a partial reference never
 * becomes an invented identity merely because it crossed a navigation seam.
 *
 * @param {unknown} value
 * @returns {Record<string, unknown>|null}
 */
function canonicalRefOf(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  const kind = text(record.kind, 80);
  const id = identifier(record.id);
  if (!kind || !id) return null;

  /** @type {Record<string, unknown>} */
  const result = { kind, id };
  for (const key of CANONICAL_REF_TEXT_KEYS) {
    const normalized = identifier(record[key]);
    if (normalized) result[key] = normalized;
  }
  for (const key of CANONICAL_REF_LIST_KEYS) {
    const normalized = identifierList(
      record[key],
      HERALD_SCENE_CONTEXT_LIMITS.canonicalRelations,
    );
    if (normalized.length > 0) result[key] = normalized;
  }
  return result;
}

/**
 * Project one cause record into the scene-manifest provenance vocabulary.
 *
 * @param {unknown} value
 * @param {Set<string>} allowedRefs
 * @returns {{
 *   id:string,
 *   effect:string|null,
 *   family:string|null,
 *   sourceRef:string|null,
 *   displayText:string|null,
 * }|null}
 */
function sceneCauseOf(value, allowedRefs) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  const id = text(record.id);
  if (!id || !allowedRefs.has(id)) return null;
  return {
    id,
    effect: text(record.effect, 80) || null,
    family: text(record.family, 48) || null,
    sourceRef: text(record.sourceRef, 180) || null,
    displayText: text(record.displayText) || null,
  };
}

/**
 * Validate the exact context carried from a settlement portrait.
 *
 * Provenance entries must be named by the selected semantic record's own
 * `provenanceRefs`; unrelated supplied objects are dropped. The session does not
 * convert a scene id, canonical id, or provenance id into a Herald story id.
 *
 * @param {unknown} value
 * @returns {null|{
 *   action:'inspect-scene-provenance',
 *   settlementId:string|null,
 *   sceneId:string,
 *   entityKind:string|null,
 *   label:string|null,
 *   canonicalRef:Record<string, unknown>|null,
 *   provenanceRefs:string[],
 *   provenance:Array<{
 *     id:string,
 *     effect:string|null,
 *     family:string|null,
 *     sourceRef:string|null,
 *     displayText:string|null,
 *   }>,
 * }}
 */
function sceneContextOf(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  const destination = heraldDestinationForSceneAction(record.action);
  const sceneId = text(record.sceneId);
  if (!destination.action || !sceneId) return null;

  const provenanceRefs = textList(
    record.provenanceRefs,
    HERALD_SCENE_CONTEXT_LIMITS.provenanceRefs,
  );
  const allowedRefs = new Set(provenanceRefs);
  const causeById = new Map();
  const rawCauses = Array.isArray(record.provenance) ? record.provenance : [];
  for (const value of rawCauses) {
    const cause = sceneCauseOf(value, allowedRefs);
    if (cause && !causeById.has(cause.id)) causeById.set(cause.id, cause);
  }

  return {
    action: destination.action,
    settlementId: identifier(record.settlementId) || null,
    sceneId,
    entityKind: text(record.entityKind, 80) || null,
    label: text(record.label, 120) || null,
    canonicalRef: canonicalRefOf(record.canonicalRef),
    provenanceRefs,
    provenance: provenanceRefs
      .map((ref) => causeById.get(ref))
      .filter(Boolean),
  };
}

/**
 * Normalize one stored or newly patched value. Unknown keys never round-trip,
 * which keeps old experiments from becoming accidental API.
 *
 * @param {unknown} campaignId
 * @param {unknown} value
 */
function normalize(campaignId, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  const id = identifier(campaignId);
  if (!id) return null;
  const storedId = identifier(record.campaignId);
  if (storedId && storedId !== id) return null;
  const timeLens = text(record.timeLens);

  return {
    version: HERALD_COMMAND_SESSION_VERSION,
    campaignId: id,
    open: record.open === true,
    section: text(record.section) || 'dashboard',
    timeLens: TIME_LENSES.has(timeLens) ? timeLens : 'advance',
    query: text(record.query),
    attentionOn: record.attentionOn === true,
    filterBand: text(record.filterBand, 80) || null,
    showFilters: record.showFilters === true,
    scrollTop: scrollTopOf(record.scrollTop),
    focusKey: text(record.focusKey) || null,
    commandReturn: returnOriginOf(record.commandReturn),
    sceneContext: sceneContextOf(record.sceneContext),
  };
}

/**
 * @param {unknown} campaignId
 * @returns {ReturnType<typeof normalize>}
 */
export function readHeraldCommandSession(campaignId) {
  const key = campaignKey(campaignId);
  const target = storage();
  if (!key || !target) return null;
  try {
    const parsed = JSON.parse(target.getItem(key) || 'null');
    if (parsed?.version !== HERALD_COMMAND_SESSION_VERSION) return null;
    return normalize(campaignId, parsed);
  } catch {
    return null;
  }
}

/**
 * Merge a bounded presentation-state patch into this campaign's session record.
 *
 * @param {unknown} campaignId
 * @param {Record<string, unknown>} patch
 * @returns {ReturnType<typeof normalize>}
 */
export function writeHeraldCommandSession(campaignId, patch = {}) {
  const key = campaignKey(campaignId);
  const target = storage();
  if (!key || !target) return null;
  const previous = readHeraldCommandSession(campaignId) || {};
  const next = normalize(campaignId, { ...previous, ...patch });
  if (!next) return null;
  try {
    target.setItem(key, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

/** Remove only one campaign's return context. */
/** @param {unknown} campaignId */
export function clearHeraldCommandSession(campaignId) {
  const key = campaignKey(campaignId);
  const target = storage();
  if (!key || !target) return;
  try {
    target.removeItem(key);
  } catch {
    // Storage is an optional presentation convenience.
  }
}
