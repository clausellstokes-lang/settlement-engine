/**
 * components/new/overviewIdentity.js — THE OVERVIEW'S IDENTITY LINE (the culture scope and
 * "Governed by"), gated (STYLE-RULINGS-2 B10(a); lane SW-B7b PROJECTION, the fourth seat).
 *
 * The culture phrase reads fields the public projection strips (`culturalIdentity`, the seat), so
 * the line is composed OWNER-SIDE at the save and shipped as text (`overview:identity`); a shared
 * page prints the shipped line, never one read from the stripped record, and an unstamped record
 * prints none (`publicProse.js`, rule 1).
 *
 * Its own module, beside rather than inside `deskHostArgs.js`: that module rides every route's
 * graph, and `settlementQuickGuide.js` belongs only where the Overview already pays for it.
 *
 * @enforced-by tests/components/publicProseEquality.test.jsx (overview in COMPLETE)
 */
import { cultureScopeLine, governsLine } from '../../domain/summary/settlementQuickGuide.js';
import { publicProseOf } from '../../domain/display/publicProse.js';

/**
 * @param {any} settlement @param {{publicDossier?: boolean}} [options]
 * @returns {{scope: string, governs: string}}
 */
export function overviewIdentityOf(settlement, options = {}) {
  if (options.publicDossier) {
    const shipped = /** @type {Record<string, unknown>|null} */ (publicProseOf(settlement, 'overview:identity'));
    const text = (/** @type {unknown} */ v) => (typeof v === 'string' ? v : '');
    return { scope: text(shipped?.scope), governs: text(shipped?.governs) };
  }
  return { scope: cultureScopeLine(settlement), governs: governsLine(settlement) };
}
