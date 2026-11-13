/**
 * data/magicTraditionHouses.js — WHICH HOUSES CARRY A MAGIC TRADITION (W2-A-LEAVES, 2026-11-12; lifted verbatim
 * from `generators/computeActiveChains.js`'s tradition detection, so the step that lets a tradition hold up a
 * chain and the leaf that names where that magic comes from (`domain/facts/magicSource.js`) read one table).
 *
 * Each entry is a list of institution keywords, matched id-first (`institutionMatchesKeyword`). Divine provision
 * needs a house of `divine` AND a house of `divinePriest` (the generator's own two tests).
 */
export const MAGIC_TRADITION_HOUSES = Object.freeze({
  druid: Object.freeze(['druid circle', 'grove shrine', 'elder grove', 'sacred grove']), // J33: Warden's Lodge is defence, not druid (the owner, 2026-10-01)
  divine: Object.freeze(['cathedral', 'monastery', 'great cathedral', 'parish church', 'friary']),
  divinePriest: Object.freeze(['priest', 'cathedral', 'monastery', 'friary', 'great cathedral']),
  arcane: Object.freeze(['wizard', 'mages', 'arcane', 'enchant', 'spellcasting', 'academy of magic']),
  alchemy: Object.freeze(['alchemist', 'apothecary district', 'alchemist quarter']),
});
