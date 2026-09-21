/**
 * Domain-facing world-fact option boundary (EM-P3).
 *
 * The governed option values live in src/data; gallery facets, dossier readers
 * and the editor's world-fact card import through this stable domain address so
 * the meaning of each world dial has one public contract.
 *
 * ⛔ NO `src/generators/**` MODULE MAY IMPORT THIS FILE. The generator takes the
 *    `src/data/worldFactOptions.js` address directly. Measured: vite.config.js's
 *    `computeEngineSharedDomain()` seeds the EAGER first-paint chunk from every
 *    `src/domain` module a `src/generators` module imports, so one path segment
 *    changed in the generator takes the eager first-paint set from 268 modules
 *    to 270 and charges three owner-ratified first-paint budgets for data that
 *    only the gallery reads. The gallery edge is safe and measured: this module
 *    is reached from `src/components/gallery/galleryUtils.js`, which is not a
 *    first-paint module.
 */
export { TERRAIN_WEIGHTS, TERRAINS, CULTURES } from '../data/worldFactOptions.js';

/**
 * CITATIONS, NOT COPIES: each value names the module that OWNS that world fact's
 * vocabulary, so a reader can find the list without a second spelling of it
 * being minted here. Terrain and culture point at the home above; the other five
 * already had exactly one home each and needed no move.
 *
 * SEVEN keys. Trade access is EM-P3b's row (the charter, 2026-09-19) and is
 * absent by ruling rather than by omission: no canonical list exists to cite
 * yet, and a placeholder key would answer an empty vocabulary to a real caller.
 * EM-P3b mints `TRADE_ACCESS` with its decision-fork and mechanism-coverage rows
 * and adds the eighth key here.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const WORLD_FACT_SOURCES = Object.freeze({
  terrain: 'src/data/worldFactOptions.js#TERRAIN_WEIGHTS',
  culture: 'src/data/worldFactOptions.js#CULTURES',
  monsterThreat: 'src/data/monsterThreat.js#MONSTER_THREAT_TIERS',
  stressors: 'src/data/stressTypes.js#STRESS_TYPE_MAP',
  resources: 'src/data/resourceData.js#RESOURCE_DATA',
  goods: 'src/data/tradeGoodsData.js#GOODS_CATEGORIES',
  services: 'src/data/institutionServices.js#INSTITUTION_SERVICES',
});
