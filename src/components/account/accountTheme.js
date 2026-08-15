/**
 * accountTheme.js — the two translucent surface tints the Account surfaces need
 * that the shared theme.js does not (yet) export as named tokens.
 *
 * These mirror the values THEIRS carries as `SEM.tintGoldSurface` /
 * `tintVioletSurface`. They live here, in the account fence, rather than being
 * added to the shared theme so the account transplant is self-contained.
 *
 * The danger/success CALLOUT borders (#e8b0b0 / #b0d8b0) are NOT declared here:
 * the repo's no-forked-color-const lint rule forbids re-declaring a token hex as
 * a local const, and those two are inlined at their `border:` shorthand usages
 * (the sanctioned pattern, matching SettlementDetail.jsx / tabConstants.js).
 */

/** Translucent gold surface tint (pills, referral chip background). */
export const TINT_GOLD = 'rgba(201,162,76,0.12)';
/** Translucent violet surface tint (redeem block background). */
export const TINT_VIOLET = 'rgba(124,58,237,0.06)';
