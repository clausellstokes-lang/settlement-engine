/**
 * Canonical staleness identity for a realm forecast.
 *
 * Forecasts depend on more than the world clock: queue contents, proposals,
 * stressor values, regional state, and member settlement edits can all change a
 * clone-run while its panel remains open. Hash the complete JSON-shaped inputs
 * rather than maintaining a lossy hand-written revision tuple in two modules.
 *
 * FNV-1a is a compact change detector, not a security primitive. The canonical
 * byte length travels with it to make accidental collisions less opaque.
 */

/** @param {unknown} value @param {WeakSet<object>} ancestors @returns {unknown} */
function canonicalClone(value, ancestors) {
  if (value == null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (typeof value === 'bigint') return String(value);
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol') {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  }
  if (typeof value !== 'object') return String(value);
  if (ancestors.has(value)) return '[Circular]';
  ancestors.add(value);

  let clone;
  if (Array.isArray(value)) {
    clone = value.map(entry => canonicalClone(entry, ancestors));
  } else {
    /** @type {Record<string, unknown>} */
    const objectClone = {};
    const record = /** @type {Record<string, unknown>} */ (value);
    for (const key of Object.keys(value).sort()) {
      objectClone[key] = canonicalClone(record[key], ancestors);
    }
    clone = objectClone;
  }
  ancestors.delete(value);
  return clone;
}

/** @param {string} value @returns {string} */
function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * @param {Record<string, unknown>|null|undefined} campaign
 * @param {string} interval
 * @param {ReadonlyArray<Record<string, unknown>>} [saves]
 * @returns {string}
 */
export function forecastFingerprint(campaign, interval, saves = []) {
  const memberIds = new Set(
    (Array.isArray(campaign?.settlementIds) ? campaign.settlementIds : [])
      .map(id => String(id)),
  );
  const members = (Array.isArray(saves) ? saves : [])
    .filter(save => memberIds.size === 0 || memberIds.has(String(save?.id)))
    .map(save => ({
      id: save?.id ?? null,
      settlement: save?.settlement ?? save ?? null,
      campaignState: save?.campaignState ?? null,
    }))
    .sort((a, b) => {
      const aId = String(a.id ?? '');
      const bId = String(b.id ?? '');
      return aId < bId ? -1 : aId > bId ? 1 : 0;
    });
  const canonical = JSON.stringify(canonicalClone({
    interval,
    campaign: {
      id: campaign?.id ?? null,
      settlementIds: campaign?.settlementIds ?? [],
      regionalGraph: campaign?.regionalGraph ?? null,
      worldState: campaign?.worldState ?? null,
    },
    members,
  }, new WeakSet())) ?? 'null';
  return `realm-forecast-v2:${canonical.length}:${fnv1a(canonical)}`;
}
