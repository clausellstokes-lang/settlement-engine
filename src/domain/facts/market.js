/**
 * domain/facts/market.js — THE MARKET HOME (CENSUS-1 wave 0, fact 5; the design's §1 row "market",
 * Appendix A competing reading 8).
 *
 * IS THERE A REAL MARKET HERE? (the SIZE lane's rule, 2026-11-03, root-cause failure 8, ruling 3,
 * moved here whole from `generators/economy/viability.js`, which re-exports it.) A market is an
 * institution the catalogue tags 'market' (a periodic, weekly or fish market, a market square, a
 * fair, an auction house) or a trading house it tags both 'guild' and 'trade' (merchant guilds,
 * carriers, a caravaneer's post). NEVER "any Economy-shelf building", and never a name that
 * merely contains the word: a black market and a stock exchange are not markets. An institution
 * that carries its own `tags` (authored content) is read by them; otherwise its native name is
 * looked up in the catalogue.
 *
 * THE LIVE ROSTER. A ruined, removed or closed row (`institutions/institutionRoster.js ::
 * isLiveInstitution`) holds no market.
 *
 * Pure: no randomness, no clock.
 */
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';

/**
 * The catalogue's own tags for every institution name it knows, across all tiers (a name keeps
 * its tags at every rung it appears on).
 * @type {ReadonlyMap<string, ReadonlyArray<string>>}
 */
const CATALOGUE_TAGS_BY_NAME = (() => {
  /** @type {Map<string, string[]>} */
  const byName = new Map();
  const tiers = /** @type {Record<string, Record<string, Record<string, {tags?: unknown}>>>} */ (
    /** @type {unknown} */ (institutionalCatalog));
  for (const shelves of Object.values(tiers)) {
    for (const rows of Object.values(shelves || {})) {
      for (const [name, row] of Object.entries(rows || {})) {
        const tags = Array.isArray(row?.tags) ? row.tags.filter((t) => typeof t === 'string') : [];
        const key = name.toLowerCase();
        byName.set(key, [...new Set([...(byName.get(key) || []), ...tags])]);
      }
    }
  }
  return byName;
})();

/**
 * Is this one institution a market?
 * @param {unknown} inst
 * @returns {boolean}
 */
export function isMarketInstitution(inst) {
  if (!inst || typeof inst !== 'object') return false;
  const own = /** @type {{tags?: unknown}} */ (inst).tags;
  const tags = Array.isArray(own)
    ? own
    : (CATALOGUE_TAGS_BY_NAME.get(nativeSemanticName(/** @type {object} */ (inst)).toLowerCase()) || []);
  return tags.includes('market') || (tags.includes('guild') && tags.includes('trade'));
}

/**
 * Does this roster hold a live market? (The SIZE lane's name, kept for its callers.)
 * @param {ReadonlyArray<unknown> | null | undefined} institutions
 * @returns {boolean}
 */
export function hasMarketInstitution(institutions) {
  return (Array.isArray(institutions) ? institutions : [])
    .some((inst) => isMarketInstitution(inst) && isLiveInstitution(/** @type {Parameters<typeof isLiveInstitution>[0]} */ (inst)));
}

/**
 * THE ONE READER on a record.
 * @param {{ institutions?: unknown } | null | undefined} record
 * @returns {boolean}
 */
export function marketOf(record) {
  return hasMarketInstitution(/** @type {ReadonlyArray<unknown>} */ (record?.institutions));
}
