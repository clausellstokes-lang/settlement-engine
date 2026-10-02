/**
 * Domain-facing institutional-catalogue boundary (EM-P4).
 *
 * The catalogue's tier readers live in src/data; the editor's institution card and
 * any other domain reader import through this stable domain address, so the tier
 * gate has ONE public contract outside the generator. EM-P3's landed idiom
 * (src/domain/worldFactOptions.js over src/data/worldFactOptions.js), repeated.
 *
 * ⛔ NO `src/generators/**` MODULE MAY IMPORT THIS FILE. The generator takes the
 *    `src/data/institutionLookups.js` address directly. Measured: vite.config.js's
 *    `computeEngineSharedDomain()` seeds the EAGER first-paint chunk from every
 *    `src/domain` module a `src/generators` module imports — the trap EM-P3 priced
 *    at two extra modules and three owner-ratified first-paint budgets.
 *
 * ⛔ THREE re-exports, not four: the all-tier browse with its `nativeTier` labels is
 *    the compendium grid's, and it keeps the address it always read. An unread
 *    re-export here would be a claim nobody checks.
 *
 * ⭐ BARE re-exports: the SAME function objects the src/data home exposes, so the
 *    two addresses can never answer differently.
 */
export {
  institutionAvailableAtTier,
  getInstitutionalCatalog,
  getInstitutionsForTier,
} from '../data/institutionLookups.js';
