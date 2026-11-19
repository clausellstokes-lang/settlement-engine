/**
 * domain/facts/foodBandShown.js — THE FOOD BAND THE PAGE PRINTS, ONE HOME (BAR5-FOOD, BRIEF-BAR5 fact (c); the chair's ruling
 * FD1 of 2026-11-16, vetoable by the owner; AUDIT-A rule 1b).
 *
 * Two readings disagreed. The page's food word (`display/foodWordShown.js` → `summary/tonightSheet.js :: foodBandOf`) lowers
 * the ledger's band where the record makes its word false: a "secure" or "surplus" band with a share of the need unmet
 * (`gapPct` > 0) prints "Pressured"; an "importDependent" band with no food brought in (`normalImportPct` 0) prints
 * "Deficit". The vocabulary's `food` dimension (`factVocabulary.js`, through `famine.js :: famineOf`) read the ledger's raw
 * band, so a line declaring `food: ≥ secure` ("can take a bad season in one source without going hungry") printed beside
 * "Food Security · Pressured" (bar0-village-calm-rand-25; 146 towns of the census's 720 print Pressured over a stored
 * "Secure"). Both now read this key: the page's word (`foodBandOf`), and the `food` dimension (`famineOf`'s `shownBand`).
 * The ledger's raw band keeps its own name (`famineOf(...).band`) for what must read the ledger.
 *
 *   foodBandShownKey(foodRecord)   the band key the page prints, or null for a record with no band string.
 *
 * Imports nothing (the eager engine core reads it through `foodways.js`). Pure: no randomness, no clock, no write.
 */

/**
 * @param {{ band?: unknown, gapPct?: unknown, normalImportPct?: unknown } | null | undefined} foodRecord
 * @returns {string | null}
 */
export function foodBandShownKey(foodRecord) {
  const band = typeof foodRecord?.band === 'string' ? foodRecord.band.trim() : '';
  if (!band) return null;
  const gap = Number(foodRecord?.gapPct);
  if ((band === 'secure' || band === 'surplus') && Number.isFinite(gap) && gap > 0) return 'pressured';
  if (band === 'importDependent' && foodRecord?.normalImportPct === 0) return 'deficit';
  return band;
}
