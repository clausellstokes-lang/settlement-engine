/**
 * inlandDescriptions.js — a description for an institution row whose whole authored pool speaks
 * of water (ships, the day's catch), used ONLY where the record's water fact
 * (`domain/tradeRouteSemantics.js :: waterAccessKind`) is 'none' (soak 1000 row 7, A-11).
 * Keyed by the variant table's own `${tier}|${category}|${name}` path. Authored 2026-11-04 under
 * the owner's delegation ("i leave everything ot your judgemetn"), each in the pool's register:
 * the Auction house's text is its own canonical variant with "ships" removed; the village Fish
 * market's sells the salted and smoked fish the catalogue's inland Fishmonger describes.
 */
const AUCTION =
  'A formal house for the sale of costly goods: estates, livestock, art, and now and then a whole household\'s goods. It takes a premium from buyer and seller both.'; // W2-FIX-DATA-3 item 5: the canonical variant's cure (915bf42db), the ships still out

/** @type {Readonly<Record<string, string>>} */
export const INLAND_DESCRIPTIONS = Object.freeze({
  'village|Economy|Fish market':
    'An open stall or small roofed shed selling salted and smoked fish. Packed in barrels, it keeps for months.', // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind b): true under a siege too; was "... brought in by cart. The barrels keep, so the price holds." (the cart and the steady price a siege makes false; the sibling column that could twin it is institutionDescVariants.js's and its facts carry no crisis)
  'town|Economy|Auction house': AUCTION,
  'city|Economy|Auction house': AUCTION,
  'metropolis|Economy|Auction house': AUCTION,
});
