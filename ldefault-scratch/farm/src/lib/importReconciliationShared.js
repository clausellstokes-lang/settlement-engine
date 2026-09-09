/**
 * Shared primitives for the import-reconciliation boundary.
 *
 * These helpers are deliberately local to reconciliation. They enforce the
 * JSON-only, deterministic values required by a resumable import session
 * without pretending to be a universal serialization framework.
 */

export const IMPORT_RECONCILIATION_SCHEMA_VERSION = 1;
export const IMPORT_RECONCILIATION_PARSER_VERSION = 'settlementforge-export-v1';

export const IMPORT_RECONCILIATION_STAGES = Object.freeze([
  'ingested',
  'reconciling',
  'previewed',
  'applying',
  'applied',
  'failed_reconcilable',
]);

export const IMPORT_DECISION_ACTIONS = Object.freeze([
  'create',
  'match',
  'skip',
  'defer',
]);

export const RECONCILIATION_STAGE_SET = new Set(IMPORT_RECONCILIATION_STAGES);
export const RECONCILIATION_DECISION_SET = new Set(IMPORT_DECISION_ACTIONS);
export const SUCCESSFUL_COMMAND_STATUSES = new Set(['applied', 'queued']);

const MAX_JSON_DEPTH = 48;
const BLOCKED_JSON_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
export function isRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** @param {unknown} value */
export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value */
export function sourceIdOf(value) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

/** @param {unknown} value */
export function normalizedName(value) {
  return cleanText(value).replace(/\s+/g, ' ').toLocaleLowerCase();
}

/** UTF-8 size without introducing Blob/browser state into the pure boundary. */
export function utf8Size(value) {
  try {
    return new TextEncoder().encode(value).byteLength;
  } catch {
    return String(value).length;
  }
}

/**
 * Stable, non-cryptographic content checksum.
 *
 * This checksum is identity/dedup evidence, not a security signature. Two
 * independent 32-bit accumulators plus byte length keep it deterministic in
 * every supported browser, including environments where SubtleCrypto is absent.
 *
 * @param {string} text
 */
export function reconciliationSourceChecksum(text) {
  const source = typeof text === 'string' ? text : String(text ?? '');
  let fnv = 0x811c9dc5;
  let djb = 0x1505;
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    fnv ^= code;
    fnv = Math.imul(fnv, 0x01000193) >>> 0;
    djb = (Math.imul(djb, 33) ^ code) >>> 0;
  }
  return [
    'sf-import-v1',
    utf8Size(source).toString(36),
    fnv.toString(36),
    djb.toString(36),
  ].join(':');
}

/**
 * Detach an ordinary JSON value while rejecting cycles, executable values, and
 * prototype-bearing records. Undefined object fields are omitted exactly as
 * JSON serialization would omit them; undefined array positions become null.
 *
 * @param {unknown} value
 * @param {string} [path]
 * @param {Set<object>} [seen]
 * @param {number} [depth]
 * @returns {unknown}
 */
export function detachJson(value, path = '$', seen = new Set(), depth = 0) {
  if (depth > MAX_JSON_DEPTH) {
    throw new TypeError(`${path} exceeds the reconciliation JSON depth limit`);
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${path} must contain finite numbers`);
    return value;
  }
  if (typeof value !== 'object') {
    throw new TypeError(`${path} must contain JSON values only`);
  }
  if (seen.has(value)) throw new TypeError(`${path} must not contain a cycle`);

  seen.add(value);
  let detached;
  if (Array.isArray(value)) {
    detached = value.map((entry, index) => (
      entry === undefined
        ? null
        : detachJson(entry, `${path}[${index}]`, seen, depth + 1)
    ));
  } else {
    if (!isRecord(value)) throw new TypeError(`${path} must be a plain object`);
    detached = {};
    for (const key of Object.keys(value)) {
      if (BLOCKED_JSON_KEYS.has(key)) throw new TypeError(`${path}.${key} is not allowed`);
      const entry = value[key];
      if (entry === undefined) continue;
      detached[key] = detachJson(entry, `${path}.${key}`, seen, depth + 1);
    }
  }
  seen.delete(value);
  return detached;
}

/**
 * @template {Record<string, unknown>} T
 * @param {T} value
 * @returns {T}
 */
export function detachedRecord(value) {
  const detached = detachJson(value);
  if (!isRecord(detached)) throw new TypeError('value must be a plain object');
  return /** @type {T} */ (detached);
}

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return /** @type {T} */ (Object.freeze(value));
}

export function reconciliationDiagnostic(status, code, message) {
  return Object.freeze({ status, code, message });
}

export function reconciliationStableToken(value) {
  return reconciliationSourceChecksum(String(value ?? '')).split(':').slice(2).join('-');
}

export function reconciliationProposalId(checksum, sourceIndex) {
  return `irp:${reconciliationStableToken(checksum)}:settlement:${sourceIndex}`;
}

export function reconciliationIssueId(proposalId, kind, index = 0) {
  return `iri:${reconciliationStableToken(`${proposalId}:${kind}:${index}`)}`;
}
