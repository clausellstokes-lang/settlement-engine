/**
 * Zero-import capability marker for canon-event command migration.
 *
 * Keep this leaf small: settlementSlice needs the gate on first paint, while
 * the preparation engine and command runtime remain lazy.
 */

export const AUTHORITATIVE_CANON_EVENT_TYPES = Object.freeze([
  'CUT_TRADE_ROUTE',
]);

const SUPPORTED = new Set(AUTHORITATIVE_CANON_EVENT_TYPES);

/**
 * @param {unknown} type
 * @returns {type is 'CUT_TRADE_ROUTE'}
 */
export function isAuthoritativeCanonEventType(type) {
  return typeof type === 'string' && SUPPORTED.has(type);
}
