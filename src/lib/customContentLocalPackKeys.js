/**
 * Portable object keys for browser-local pack-entry maps.
 *
 * The original v1 ledger joined pack and entry ids with U+0000. JavaScript can
 * represent that key, but PostgreSQL `jsonb` cannot, so a locally valid ledger
 * could not cross the durable archive boundary. A canonical JSON tuple is
 * collision-free, reversible, and composed only of portable JSON text.
 */

/** @param {unknown} packId @param {unknown} packEntryId */
export function localPackEntryKey(packId, packEntryId) {
  return JSON.stringify([String(packId), String(packEntryId)]);
}

/**
 * Read both the portable tuple key and the historical U+0000 join. The legacy
 * branch exists only for the one-way ledger migration below.
 *
 * @param {unknown} key
 * @returns {{ packId:string, packEntryId:string, legacy:boolean } | null}
 */
export function parseLocalPackEntryKey(key) {
  if (typeof key !== 'string') return null;
  const legacySeparator = key.indexOf('\u0000');
  if (legacySeparator >= 0) {
    if (key.indexOf('\u0000', legacySeparator + 1) >= 0) return null;
    return {
      packId: key.slice(0, legacySeparator),
      packEntryId: key.slice(legacySeparator + 1),
      legacy: true,
    };
  }
  try {
    const tuple = JSON.parse(key);
    if (
      !Array.isArray(tuple)
      || tuple.length !== 2
      || tuple.some(value => typeof value !== 'string')
      || localPackEntryKey(tuple[0], tuple[1]) !== key
    ) {
      return null;
    }
    return {
      packId: tuple[0],
      packEntryId: tuple[1],
      legacy: false,
    };
  } catch {
    return null;
  }
}

function invalidPackKey(message) {
  return Object.assign(new TypeError(message), {
    code: 'custom_content_local_ledger_corrupt',
  });
}

/**
 * Rewrite historical composite keys before the ledger is hashed, cloned, or
 * exported. A collision is evidence of divergent authority and fails closed;
 * it is never resolved by object iteration order.
 *
 * @param {Record<string, any>} ledger
 */
export function migrateLegacyLocalPackEntryKeys(ledger) {
  let changed = false;
  for (const field of ['packEntryDefinitions', 'packEntryRevisions']) {
    const source = ledger[field];
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      continue;
    }
    for (const [key, value] of Object.entries(source)) {
      const parsed = parseLocalPackEntryKey(key);
      if (!parsed) {
        throw invalidPackKey(
          `Local ${field} contains an invalid pack-entry key.`,
        );
      }
      const portableKey = localPackEntryKey(
        parsed.packId,
        parsed.packEntryId,
      );
      if (portableKey === key) continue;
      if (
        Object.hasOwn(source, portableKey)
        && source[portableKey] !== value
      ) {
        throw invalidPackKey(
          `Local ${field} contains a divergent legacy key collision.`,
        );
      }
      source[portableKey] = value;
      delete source[key];
      changed = true;
    }
  }
  return changed;
}
