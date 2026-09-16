/**
 * Zero-import capability marker for canon-event command migration.
 *
 * Keep this leaf small: settlementSlice needs the gate on first paint, while
 * the preparation engine and command runtime remain lazy.
 */

export const AUTHORITATIVE_CANON_EVENT_TYPES = Object.freeze([
  'CUT_TRADE_ROUTE',
  'CREATE_ROUTE',
]);

/**
 * The authoritative types that write TWO settlement rows. They ride the same
 * journal and the same command identity as their unilateral siblings, but their
 * transaction takes a partner save and both base projections. Membership here is
 * what routes a command to migration 193 instead of 183.
 */
export const BILATERAL_CANON_EVENT_TYPES = Object.freeze([
  'CREATE_ROUTE',
]);

const SUPPORTED = new Set(AUTHORITATIVE_CANON_EVENT_TYPES);
const BILATERAL = new Set(BILATERAL_CANON_EVENT_TYPES);

/**
 * @param {unknown} type
 * @returns {type is 'CUT_TRADE_ROUTE'|'CREATE_ROUTE'}
 */
export function isAuthoritativeCanonEventType(type) {
  return typeof type === 'string' && SUPPORTED.has(type);
}

/**
 * @param {unknown} type
 * @returns {type is 'CREATE_ROUTE'}
 */
export function isBilateralCanonEventType(type) {
  return typeof type === 'string' && BILATERAL.has(type);
}
