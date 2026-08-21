/**
 * userRouteIdentity.js — the deterministic edge identity of a user route, and
 * NOTHING else. A zero-import leaf, deliberately.
 *
 * WHY THIS FILE EXISTS AT ALL (the first-paint law). The CREATE_ROUTE mutation
 * handler lives in the EAGER event-mutation vocabulary: `domain/events/mutate.js`
 * is reached statically from the store, so every module it imports rides first
 * paint. The handler needs exactly one thing from the route derivation — the edge
 * id, to re-prove the payload's identity before it writes. When it imported that
 * id from `roads/userRoutes.js`, it dragged the whole derivation with it, and the
 * derivation imports `spatial/distanceRead.js` (the 53 kB frozen-digest reader
 * whose own docblock states it "never reaches first paint"). One three-line
 * function pulled ~18 kB of minified geography into the browser's critical path
 * and broke the constitutional first-paint closure ratchet.
 *
 * THE CURE IS THE HOUSE IDIOM: move the FUNCTION, not the chunk pin (the
 * deityConstants / stablePart / exportPosture precedent). The identity lives here
 * with zero imports; `roads/userRoutes.js` re-exports it verbatim so every
 * existing consumer and test keeps its import site; and the eager handler imports
 * THIS leaf, so the derivation and the digest reader stay lazy.
 *
 * KEEP IT IMPORT-FREE. An import added here would re-parent whatever it reaches
 * straight back into first paint, which is the exact defect this file cures.
 * @enforced-by tests/build/userRouteIdentityLeaf.test.js (zero-imports contract,
 *              the eager-graph exclusion, and the dist absence/presence pair) +
 *              tests/build/vendorPdfLazy.test.js (the byte ratchet itself).
 *
 * SHARED LAW, NOT LOCAL TASTE: migration 193 recomputes this same id server-side
 * and refuses any command that disagrees, so both halves of a bilateral charter
 * are keyed identically no matter which endpoint the DM started from.
 */

/**
 * The two endpoints in codepoint order. Codepoint order (not locale order) is
 * what makes the edge id identical whichever settlement the DM started from, and
 * it is the same convention the sea-lane edge ids already use.
 * @param {string} aId
 * @param {string} bId
 * @returns {[string, string]}
 */
export function orderedRouteEndpoints(aId, bId) {
  const a = String(aId);
  const b = String(bId);
  return a <= b ? [a, b] : [b, a];
}

/**
 * The deterministic edge identity: `route.<a>.<b>.<mode>`, endpoints codepoint
 * ordered (DESIGN_ROUTE_LIFECYCLE section 3). Migration 193 recomputes this
 * server-side and refuses any command that disagrees, so this function is the
 * client's copy of a shared law rather than the authority on it.
 * @param {string} aId
 * @param {string} bId
 * @param {string} mode
 * @returns {string}
 */
export function userRouteEdgeId(aId, bId, mode) {
  const [low, high] = orderedRouteEndpoints(aId, bId);
  return `route.${low}.${high}.${mode}`;
}
