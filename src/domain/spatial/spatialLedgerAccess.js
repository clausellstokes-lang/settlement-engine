/**
 * spatialLedgerAccess.js — THE SPATIAL LEDGER NAMESPACE accessors (Phase 5.5 FP-R),
 * as a ZERO-IMPORT FIRST-PAINT LEAF.
 *
 * THE DEFECT THIS EXISTS TO PREVENT (measured 2026-08-07). These four accessors
 * used to live inside `distanceRead.js`. That module is itself import-free, so the
 * old home looked harmless — but it is the 1,080-line / ~53 kB frozen-digest reader
 * whose own docblock states it "never reaches first paint", and importing ANY symbol
 * from it pulls the whole module into the importer's chunk. `warCoalitionLedger.js`
 * needed exactly ONE of them (`getSpatialLedger`) and is reached statically from the
 * store, so the geography rode the browser's critical path to serve a property read:
 *
 *   main.jsx -> store/index.js -> store/campaignSlice.js
 *     -> domain/worldPulse/worldState.js -> domain/worldPulse/warCoalitionLedger.js
 *     -> domain/spatial/distanceRead.js
 *
 * THE CURE is the house leaf extraction (deityConstants / stablePart /
 * userRouteIdentity): MOVE THE FUNCTIONS, not the chunk pin. This leaf carries them
 * with ZERO imports, `distanceRead.js` re-exports all four VERBATIM so no existing
 * consumer changed its import site, and the first-paint-reachable readers import the
 * leaf. Adding an import to THIS file re-parents whatever it reaches straight back
 * into first paint — that is the whole defect, and the reason this file must stay
 * import-free.
 *
 * WHAT THE NAMESPACE IS. `worldState.spatialLedgers` is the ONE conditional container
 * for every Phase 5.5 spatial mover ledger — spatialArrivals (arrival queue),
 * rumorLedgers (STEP 3.5), beliefMaps (WAVE A), embattlement (M1), supplyShipments
 * (M2), warReasons, and every FUTURE mover's ledger. Nesting the family under a
 * single key means ensureWorldState's eager CONDITIONAL_LEDGER_KEYS array carries ONE
 * name for all of them, so a new mover ledger costs ZERO first-paint bytes (it just
 * nests here).
 *
 * DORMANCY: the namespace is materialized ONLY when >=1 sub-ledger is present
 * (ensureWorldState's deepCloneConditionalLedger drops an empty object;
 * dropSpatialLedger drops the whole namespace when its last sub-ledger drains) => an
 * aspatial/legacy campaign carries no `spatialLedgers` key and serializes
 * byte-identically.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/build/userRouteIdentityLeaf.test.js (first-paint graph)
 */

/**
 * The live namespace object, or null when absent/garbage. Central guard so every
 * accessor treats a missing / non-object `spatialLedgers` identically.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {Record<string, unknown> | null}
 */
function spatialLedgerNamespace(worldState) {
  if (!worldState || typeof worldState !== 'object') return null;
  const ns = /** @type {Record<string, unknown>} */ (worldState).spatialLedgers;
  return ns && typeof ns === 'object' && !Array.isArray(ns)
    ? /** @type {Record<string, unknown>} */ (ns)
    : null;
}

/**
 * Is a named spatial ledger present? The faithful replacement for the old
 * `'<key>' in worldState` guard — it preserves the present-but-empty vs ABSENT
 * distinction the mover change-detectors rely on (prior = ledger vs prior = null).
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} key
 * @returns {boolean}
 */
export function hasSpatialLedger(worldState, key) {
  const ns = spatialLedgerNamespace(worldState);
  return !!ns && key in ns;
}

/**
 * Read a named spatial ledger, or undefined when absent. The replacement for the
 * old top-level `worldState.<key>` read.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} key
 * @returns {unknown}
 */
export function getSpatialLedger(worldState, key) {
  const ns = spatialLedgerNamespace(worldState);
  return ns ? ns[key] : undefined;
}

/**
 * Fold a named spatial ledger onto worldState, creating the namespace if absent.
 * Returns a NEW worldState (never mutates). Replacement for
 * `{ ...worldState, <key>: value }`.
 * @param {Record<string, unknown>} worldState
 * @param {string} key
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function setSpatialLedger(worldState, key, value) {
  const ns = spatialLedgerNamespace(worldState);
  return { ...worldState, spatialLedgers: { ...(ns || {}), [key]: value } };
}

/**
 * Drop a named spatial ledger. When it was the LAST sub-ledger, drop the whole
 * `spatialLedgers` namespace so an emptied world stays byte-identical to a dormant
 * one. A no-op (returns the same reference) when the key is already absent —
 * matching the old `else if ('<key>' in worldState)` guard.
 * @param {Record<string, unknown>} worldState
 * @param {string} key
 * @returns {Record<string, unknown>}
 */
export function dropSpatialLedger(worldState, key) {
  const ns = spatialLedgerNamespace(worldState);
  if (!ns || !(key in ns)) return worldState;
  const { [key]: _drop, ...rest } = ns;
  if (Object.keys(rest).length === 0) {
    const { spatialLedgers: _dropNs, ...worldRest } = worldState;
    return worldRest;
  }
  return { ...worldState, spatialLedgers: rest };
}
