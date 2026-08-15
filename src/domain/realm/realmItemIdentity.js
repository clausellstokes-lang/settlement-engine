/**
 * domain/realm/realmItemIdentity.js — stable, source-owned identity for the
 * RealmItem read model.
 *
 * RealmItems are DERIVED envelopes. Their identity therefore has to survive a
 * rerender without pretending that two merely-similar records are the same
 * event. The rule is deliberately conservative:
 *
 *   1. A source-owned ID is the origin key whenever the source provides one.
 *   2. A record without an ID receives a deterministic fallback made from its
 *      immutable source container, tick, and content fingerprint.
 *   3. Content fingerprints prove exact projection equality; they never, by
 *      themselves, authorize cross-source deduplication.
 *
 * The canonical clone serves two purposes. It makes fingerprints independent of
 * object key insertion order, and it lets the read model freeze its projection
 * without freezing (and thereby mutating the mutability contract of) the
 * authoritative campaign record supplied by the store.
 *
 * Pure leaf: no clock, RNG, persistence, store, React, or locale collation.
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Build a JSON-safe, key-sorted copy. Realm source records are expected to be
 * data, but the defensive cases keep diagnostics renderable when an imported
 * campaign contains dates, non-finite numbers, functions, or a cycle.
 *
 * @param {unknown} value
 * @param {WeakSet<object>} [ancestors]
 * @returns {unknown}
 */
export function stableRealmClone(value, ancestors = new WeakSet()) {
  if (value == null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (typeof value === 'bigint') return String(value);
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();

  if (typeof value !== 'object') return String(value);
  if (ancestors.has(value)) return '[Circular]';
  ancestors.add(value);

  let copy;
  if (Array.isArray(value)) {
    copy = value.map((entry) => stableRealmClone(entry, ancestors));
  } else {
    /** @type {Record<string, unknown>} */
    const objectCopy = {};
    for (const key of Object.keys(value).sort()) {
      objectCopy[key] = stableRealmClone(/** @type {Record<string, unknown>} */ (value)[key], ancestors);
    }
    copy = objectCopy;
  }

  ancestors.delete(value);
  return copy;
}

/**
 * FNV-1a is not a security boundary; it is a compact deterministic label for a
 * canonical source value. The source length is retained alongside the hash to
 * make accidental collisions less opaque in diagnostics.
 *
 * @param {string} text
 * @returns {string}
 */
function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * @param {unknown} record
 * @returns {string}
 */
export function realmSourceFingerprint(record) {
  const canonical = JSON.stringify(stableRealmClone(record)) ?? 'null';
  return `realm-source-v1:${canonical.length}:${fnv1a(canonical)}`;
}

/** @param {unknown} value @returns {string} */
function identityPart(value) {
  return encodeURIComponent(String(value ?? '').trim());
}

/**
 * Source-specific origin key. Array position is NEVER identity: an anonymous
 * record's source context and content fingerprint survive surrounding reordering.
 * Two byte-identical anonymous records therefore produce the same surrogate; the
 * read-model collector must retain that ambiguity as a visibly degraded collision
 * rather than smuggling an ordinal into a durable-looking reference.
 *
 * @param {{
 *   namespace: string,
 *   record: unknown,
 *   explicitId?: unknown,
 *   containerId?: unknown,
 *   tick?: unknown,
 * }} input
 * @returns {{ originKey: string, fingerprint: string, usedFallback: boolean }}
 */
export function realmSourceIdentity({
  namespace,
  record,
  explicitId,
  containerId,
  tick,
}) {
  const fingerprint = realmSourceFingerprint(record);
  const authoredId = String(explicitId ?? '').trim();
  if (authoredId) {
    return Object.freeze({
      originKey: `${identityPart(namespace)}:${identityPart(authoredId)}`,
      fingerprint,
      usedFallback: false,
    });
  }

  const fingerprintTail = fingerprint.split(':').pop() || '0';
  return Object.freeze({
    originKey: [
      identityPart(namespace),
      'fallback',
      identityPart(containerId ?? 'root'),
      identityPart(tick ?? 'unticked'),
      fingerprintTail,
    ].join(':'),
    fingerprint,
    usedFallback: true,
  });
}

/**
 * Recursively freeze a RealmItem-owned value. Callers must first clone any
 * authoritative source record; freezing a store-owned object is forbidden.
 *
 * @template T
 * @param {T} value
 * @returns {Readonly<T>}
 */
export function freezeRealmValue(value) {
  if (value == null || typeof value !== 'object' || Object.isFrozen(value)) {
    return /** @type {Readonly<T>} */ (value);
  }
  if (Array.isArray(value)) {
    for (const entry of value) freezeRealmValue(entry);
  } else if (isRecord(value)) {
    for (const entry of Object.values(value)) freezeRealmValue(entry);
  }
  return /** @type {Readonly<T>} */ (Object.freeze(value));
}
