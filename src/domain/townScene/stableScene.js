/**
 * domain/townScene/stableScene.js — canonical serialization and digesting for
 * the settlement-scene projection.
 *
 * A TownSceneManifest is cacheable only if semantically identical inputs produce
 * identical bytes. JSON.stringify alone preserves insertion order, which makes a
 * digest depend on the code path that assembled an object. This serializer sorts
 * every object key by raw codepoint order while preserving array order (arrays in
 * the manifest are already canonically sorted by their stable ids).
 *
 * The digest is a deterministic 128-bit cache fingerprint built from four
 * independently salted FNV-1a streams. It is not presented as cryptography and is
 * never used as an authorization decision; it is an inexpensive, browser-safe
 * identity for deterministic cache artifacts.
 */

const DIGEST_PREFIX = 'scene-v1';
const FNV_PRIME = 16777619;
const FNV_OFFSETS = Object.freeze([
  0x811c9dc5,
  0x9e3779b9,
  0x85ebca6b,
  0xc2b2ae35,
]);

/** @param {string} a @param {string} b */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Serialize a JSON-safe value with canonical object-key ordering. Unsupported
 * values fail closed instead of silently disappearing from a cache key.
 * @param {unknown} value
 * @returns {string}
 */
export function stableSceneStringify(value) {
  /** @type {Set<object>} */
  const ancestors = new Set();

  /** @param {unknown} node @param {string} path @returns {string} */
  function encode(node, path) {
    if (node === null) return 'null';
    if (typeof node === 'string') return JSON.stringify(node);
    if (typeof node === 'boolean') return node ? 'true' : 'false';
    if (typeof node === 'number') {
      if (!Number.isFinite(node)) throw new TypeError(`stableSceneStringify: non-finite number at ${path}`);
      return Object.is(node, -0) ? '0' : String(node);
    }
    if (typeof node === 'undefined' || typeof node === 'function' || typeof node === 'symbol' || typeof node === 'bigint') {
      throw new TypeError(`stableSceneStringify: unsupported ${typeof node} at ${path}`);
    }
    if (typeof node !== 'object') throw new TypeError(`stableSceneStringify: unsupported value at ${path}`);
    if (ancestors.has(node)) throw new TypeError(`stableSceneStringify: cyclic value at ${path}`);

    ancestors.add(node);
    let encoded;
    if (Array.isArray(node)) {
      const parts = node.map((entry, index) => encode(entry, `${path}[${index}]`));
      encoded = `[${parts.join(',')}]`;
    } else {
      const proto = Object.getPrototypeOf(node);
      if (proto !== Object.prototype && proto !== null) {
        ancestors.delete(node);
        throw new TypeError(`stableSceneStringify: non-plain object at ${path}`);
      }
      const record = /** @type {Record<string, unknown>} */ (node);
      const keys = Object.keys(record).sort(compareCodepoint);
      const parts = keys.map((key) => `${JSON.stringify(key)}:${encode(record[key], `${path}.${key}`)}`);
      encoded = `{${parts.join(',')}}`;
    }
    ancestors.delete(node);
    return encoded;
  }

  return encode(value, '$');
}

/** @param {string} input @param {number} offset @returns {number} */
function fnv1a(input, offset) {
  let hash = offset >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash >>> 0;
}

/** @param {number} value @returns {string} */
function hex32(value) {
  return (value >>> 0).toString(16).padStart(8, '0');
}

/**
 * Compute a stable cache fingerprint for any JSON-safe scene value.
 * @param {unknown} value
 * @returns {string}
 */
export function sceneDigest(value) {
  const bytes = stableSceneStringify(value);
  const words = FNV_OFFSETS.map((offset, index) => fnv1a(`${index}:${bytes}`, offset));
  return `${DIGEST_PREFIX}-${words.map(hex32).join('')}`;
}

/** Explicitly named alias for callers that read better with the adjective. */
export const stableSceneDigest = sceneDigest;

/**
 * Return the three digest axes a scene cache normally needs. Structure and
 * dress are stamped by the compiler; the full digest also covers semantics,
 * provenance, camera presets, and budgets.
 * @param {unknown} manifest
 * @returns {{ manifestDigest: string, structureDigest: string|null, dressDigest: string|null }}
 */
export function stableSceneDigests(manifest) {
  const record = manifest && typeof manifest === 'object' && !Array.isArray(manifest)
    ? /** @type {Record<string, unknown>} */ (manifest)
    : {};
  const source = record.source && typeof record.source === 'object' && !Array.isArray(record.source)
    ? /** @type {Record<string, unknown>} */ (record.source)
    : {};
  return {
    manifestDigest: sceneDigest(manifest),
    structureDigest: typeof source.structureDigest === 'string' ? source.structureDigest : null,
    dressDigest: typeof source.dressDigest === 'string' ? source.dressDigest : null,
  };
}
