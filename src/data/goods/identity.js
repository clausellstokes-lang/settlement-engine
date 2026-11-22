/**
 * data/goods/identity.js — the EAGER half of the goods namespace: what a native
 * resource IS and what terrain it needs.
 *
 * ONE OF TWO physical index surfaces (WEAVE ST-2, per DESIGN_FMG_WEAVE A1.1.4).
 * The namespace's typed record vocabulary is `src/domain/goods.schema.js`; the
 * other surface is `./chains.js`. Read the vocabulary module first — it carries
 * the surface law, the nine-module accounting, and the migration roster.
 *
 * WHAT RIDES HERE, AND WHY ONLY THIS
 * ─────────────────────────────────────────────────────────────────────────────
 * `resourceData.js` is in the eager first-paint `data` chunk (three first-paint
 * modules reach it: events/mutateWorld.js, resourceSemantics.js and
 * resourceTerrainCompatibility.js). This surface re-exports THAT table and
 * nothing else, so it is safe for an eager consumer to import: every edge it
 * adds points at bytes first paint already carries.
 *
 * ⛔ NEVER re-export a chains-half table from this file. `data/resourceChains.js`
 * states the law verbatim at its head — "DO NOT re-export these from
 * resourceData.js — an eager re-export would re-drag them into first paint" —
 * and an index is a re-export. vite.config.js's `isEagerData` classifier is
 * DERIVED from the import graph, so one such line silently moves ~390 kB of
 * chain/demand/tier tables from `data-lazy` into the first-paint closure and
 * blows the 1,040,000-byte budget.
 * @enforced-by tests/build/vendorPdfLazy.test.js (the surface-law arms) +
 *              tests/joins/goods.test.js (re-export identity + the roster).
 *
 * SYMBOLS
 *   RESOURCE_DATA      Record<ResourceKey, ResourceRecord>
 *   SPECIAL_RESOURCES  Record<string, SpecialResourceRecord>
 *
 * @see src/domain/goods.schema.js
 * @see src/data/goods/chains.js
 */

export { RESOURCE_DATA, SPECIAL_RESOURCES } from '../resourceData.js';
