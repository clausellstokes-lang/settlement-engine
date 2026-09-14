/**
 * scripts/lib/prose-render-defense-page.mjs — THE DEFENSE TAB, RENDERED TO TEXT IN PAGE ORDER
 * WITHOUT A BROWSER (brief ADDENDUM 18 ruling 6: the refuter reads the rendered page).
 *
 * ⭐⭐ THE RENDER ITSELF MOVED TO `src/domain/prose/scribePage.js` (W0 deliverable 3) AND THIS
 * FILE NOW CALLS IT. The library renders every tab the six desk leaves mount on; this script
 * keeps the corpus-side helpers that a domain module may not have — the generator, the rate
 * grid, the packet slug — and re-exports the defense render under its old name so every caller
 * (`scripts/prose-render-page.mjs`, `scripts/prose-region-nouns.mjs`, the DEF-2 packets) keeps
 * working unchanged. ONE implementation: an instrument that rendered a different page than the
 * library would refute prose no reader ever sees.
 *
 * Shared by `scripts/prose-render-page.mjs` and `scripts/prose-region-nouns.mjs`. Not a product
 * module. Deterministic for a given settlement.
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { renderTabPage, pageText } from '../../src/domain/prose/scribePage.js';
import { rateGrid } from '../prose-rate-corpus.mjs';

export { pageText };

/** @typedef {import('../../src/domain/prose/scribePage.js').PageLine} PageLine */

/**
 * ⭐ RENDER ONE SETTLEMENT'S DEFENSE TAB — the library's `renderTabPage(s, 'defense', …)`.
 * @param {object} s a generated settlement
 * @param {{audience?: string}} [options]
 * @returns {PageLine[]}
 */
export function renderDefensePage(s, options = {}) {
  return renderTabPage(s, 'defense', { audience: options.audience || 'dm' });
}

/** The (block, pool) keys the defense desks draw on a settlement. @param {object} s */
export function defensePoolsFired(s) {
  return renderDefensePage(s).filter((l) => l.kind === 'composed')
    .map((l) => ({ block: l.block, pool: l.pool }));
}

/**
 * Generate rate-grid towns lazily until `n` on which (block, pool) fires are found.
 * @param {string} block @param {string} pool @param {number} n @param {{maxTowns?: number, onProgress?: Function}} [options]
 * @returns {Array<{spec: object, settlement: object}>}
 */
export function findTownsWhereKeyFires(block, pool, n, options = {}) {
  const grid = rateGrid();
  const max = options.maxTowns || grid.length;
  const found = [];
  let scanned = 0;
  for (const spec of grid) {
    if (found.length >= n || scanned >= max) break;
    scanned += 1;
    let s;
    try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
    if (defensePoolsFired(s).some((f) => f.block === block && f.pool === pool)) found.push({ spec, settlement: s });
    if (options.onProgress && scanned % 50 === 0) options.onProgress(scanned, found.length);
  }
  return found;
}

/** The pool's packet directory slug. @param {string} block @param {string} pool */
export const poolDir = (block, pool) => `${block}-${pool}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
