/**
 * tierBackdrop.js — the default card backdrop for a settlement, keyed to its
 * tier. Used as a FALLBACK only: a user-uploaded gallery image always wins;
 * this fills in when a settlement (library) or share (gallery) has no custom
 * image, so empty cards read as the kind of place they are at a glance.
 *
 * The art is the same engraved-parchment set as the "Settlement Progression"
 * infographic. Images live in public/backgrounds/tiers/<tier>.jpg and are
 * displayed with object-fit: cover, so their source aspect does not need to
 * match the card.
 */

/** The six engine tiers → their default backdrop (served from /public). */
const TIER_BACKDROPS = Object.freeze({
  thorp: '/backgrounds/tiers/thorp.jpg',
  hamlet: '/backgrounds/tiers/hamlet.jpg',
  village: '/backgrounds/tiers/village.jpg',
  town: '/backgrounds/tiers/town.jpg',
  city: '/backgrounds/tiers/city.jpg',
  metropolis: '/backgrounds/tiers/metropolis.jpg',
});

/**
 * Resolve the default backdrop URL for a settlement tier.
 * @param {string|null|undefined} tier One of thorp/hamlet/village/town/city/metropolis.
 * @returns {string|null} The public image path, or null for an unknown/missing tier
 *   (callers fall through to their own last-resort placeholder).
 */
export function tierBackdrop(tier) {
  if (!tier) return null;
  return TIER_BACKDROPS[String(tier).toLowerCase()] || null;
}

export { TIER_BACKDROPS };
