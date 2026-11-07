/**
 * src/domain/marketInstitution.js — IS THERE A REAL MARKET HERE? One fact, one home.
 *
 * MOVED HERE from src/generators/economy/viability.js at the rung-1 landing (LANDING-2,
 * 2026-11-04; the domain -> generators boundary, tests/build/domainGeneratorsBoundary.test.js):
 * the reader battery (src/domain/coherence/readerBattery.js) asks the same question the roster's
 * guild seat asks, and a domain module may not import a generator. The text is moved verbatim;
 * viability.js re-exports it, so every generator caller is unchanged.
 */
import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { nativeSemanticName } from './content/customContentSemanticAuthority.js';

/**
 * The catalogue's own tags for every institution name it knows, across all tiers (a name
 * keeps its tags at every rung it appears on). Read by `hasMarketInstitution`.
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
 * IS THERE A REAL MARKET HERE? (SIZE lane, 2026-11-03, root-cause failure 8, ruling 3.)
 *
 * A market is an institution the catalogue tags 'market' (a periodic, weekly or fish market,
 * a market square, a fair, an auction house) or a trading house it tags both 'guild' and
 * 'trade' (merchant guilds, carriers, a caravaneer's post). NEVER "any Economy-shelf
 * building": every thorp and hamlet must have "Subsistence farming", which is filed on that
 * shelf, and it is not commerce. An institution that carries its own `tags` (authored
 * content) is read by them; otherwise its native name is looked up in the catalogue.
 *
 * The roster's guild seat (`generators/power/rulingStructure.js :: generatePowerStructure`)
 * is the consumer this was written for; that call site is engine-side, not this lane's.
 *
 * @param {ReadonlyArray<unknown> | null | undefined} institutions
 * @returns {boolean}
 */
export function hasMarketInstitution(institutions) {
  return (Array.isArray(institutions) ? institutions : []).some((inst) => {
    if (!inst || typeof inst !== 'object') return false;
    const own = /** @type {{tags?: unknown}} */ (inst).tags;
    const tags = Array.isArray(own)
      ? own
      : (CATALOGUE_TAGS_BY_NAME.get(nativeSemanticName(inst).toLowerCase()) || []);
    return tags.includes('market') || (tags.includes('guild') && tags.includes('trade'));
  });
}
