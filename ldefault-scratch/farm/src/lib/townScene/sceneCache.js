/**
 * A small, byte-bounded LRU for compiled town-scene geometry.
 *
 * Geometry bundles contain transferable typed arrays and are expensive enough
 * to merit reuse when a reader switches Plan -> Portrait -> Plan. The cache is
 * deliberately session-local: settlement truth remains in the canonical map
 * model, while these values are disposable render products.
 */

const DEFAULT_MAX_ENTRIES = 6;
const DEFAULT_MAX_BYTES = 48 * 1024 * 1024;

/**
 * Build an audience- and version-scoped geometry key.
 *
 * Audience is intentionally part of the key even when two projections happen
 * to share a digest. That makes it impossible for a DM bundle to satisfy a
 * player request through an accidental cache collision.
 *
 * @param {any} manifest
 * @param {{lodBias?:number,massingOnly?:boolean,manifestDigest?:string}} [options]
 * @returns {string}
 */
export function townSceneCacheKey(manifest, options = {}) {
  const source = manifest?.source || {};
  const compiler = manifest?.compiler || {};
  const audience = source.audience || manifest?.audience || 'owner';
  const digest = options.manifestDigest
    || source.manifestDigest
    || source.digest
    || manifest?.manifestDigest
    || [
      source.mapModelDigest,
      source.structureDigest,
      source.dressDigest,
      source.settlementDigest,
      source.mapDigest,
      source.worldDigest,
    ].filter(Boolean).join(':')
    || 'undigested';
  const schema = manifest?.schemaVersion ?? 'unknown';
  const compilerVersion = compiler.compilerVersion || compiler.version || compiler.geometryVersion || 'unknown';
  const lodBias = Number.isFinite(options.lodBias) ? Math.max(0, Math.trunc(options.lodBias)) : 0;
  const massing = options.massingOnly ? 1 : 0;
  return [
    'town-scene',
    encodeURIComponent(String(audience)),
    encodeURIComponent(String(schema)),
    encodeURIComponent(String(compilerVersion)),
    encodeURIComponent(String(digest)),
    `lod${lodBias}`,
    `m${massing}`,
  ].join(':');
}

/**
 * Estimate retained bytes without walking into prototype or cyclic state.
 * Geometry bundles are JSON records plus typed arrays, so this conservative
 * structural walk is sufficient and deterministic.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function estimateTownSceneBytes(value) {
  const seen = new Set();
  /** @param {unknown} current @returns {number} */
  const visit = (current) => {
    if (current == null) return 0;
    if (ArrayBuffer.isView(current)) return current.byteLength;
    if (current instanceof ArrayBuffer) return current.byteLength;
    if (typeof current === 'string') return current.length * 2;
    if (typeof current === 'number') return 8;
    if (typeof current === 'boolean') return 4;
    if (typeof current !== 'object' || seen.has(current)) return 0;
    seen.add(current);
    if (Array.isArray(current)) return current.reduce((sum, item) => sum + visit(item), 0);
    return Object.entries(current).reduce(
      (sum, [key, item]) => sum + key.length * 2 + visit(item),
      0,
    );
  };
  return visit(value);
}

/**
 * @param {{maxEntries?:number,maxBytes?:number}} [limits]
 */
export function createTownSceneCache(limits = {}) {
  const maxEntries = Math.max(1, Math.trunc(limits.maxEntries || DEFAULT_MAX_ENTRIES));
  const maxBytes = Math.max(1024 * 1024, Math.trunc(limits.maxBytes || DEFAULT_MAX_BYTES));
  /** @type {Map<string, {value:any,bytes:number}>} */
  const entries = new Map();
  let retainedBytes = 0;

  const evict = () => {
    while (entries.size > maxEntries || retainedBytes > maxBytes) {
      const oldestKey = entries.keys().next().value;
      if (oldestKey == null) break;
      const oldest = entries.get(oldestKey);
      retainedBytes -= oldest?.bytes || 0;
      entries.delete(oldestKey);
    }
  };

  return {
    /** @param {string} key */
    has(key) {
      return entries.has(key);
    },
    /** @param {string} key */
    get(key) {
      const hit = entries.get(key);
      if (!hit) return undefined;
      // Map insertion order is the LRU clock.
      entries.delete(key);
      entries.set(key, hit);
      return hit.value;
    },
    /** @param {string} key @param {any} value */
    set(key, value) {
      const prior = entries.get(key);
      if (prior) {
        retainedBytes -= prior.bytes;
        entries.delete(key);
      }
      const bytes = estimateTownSceneBytes(value);
      // A single over-limit bundle is useful to the current renderer but not a
      // responsible cache resident.
      if (bytes <= maxBytes) {
        entries.set(key, { value, bytes });
        retainedBytes += bytes;
        evict();
      }
      return value;
    },
    /** @param {string} key */
    delete(key) {
      const prior = entries.get(key);
      if (!prior) return false;
      retainedBytes -= prior.bytes;
      return entries.delete(key);
    },
    clear() {
      entries.clear();
      retainedBytes = 0;
    },
    stats() {
      return Object.freeze({
        entries: entries.size,
        retainedBytes,
        maxEntries,
        maxBytes,
      });
    },
  };
}

/** One viewer-session cache. It never crosses accounts, reloads, or workers. */
export const townSceneCache = createTownSceneCache();
