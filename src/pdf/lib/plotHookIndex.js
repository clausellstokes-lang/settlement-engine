/**
 * plotHookIndex — where a hook prints in the Plot Hooks chapter (04), so another chapter can
 * point to it instead of printing it again.
 *
 * ⛔ THE KEEP-ON RULE FOR HOOKS (STYLE-0 §3, approved STYLE-RULINGS §1(c) 2026-11-07, applied by
 * STYLE-RULINGS-2 B4 2026-11-09): Plot Hooks keeps the full list; the Tonight chapter prints a
 * hook's TITLE and its number in chapter 04. The grouping and the numbering here ARE the
 * chapter's (PlotHooks.jsx renders `plotHookPrintGroups`), so the number Tonight prints is the
 * number the reader finds. A hook this index cannot place keeps its full text where it is.
 */
import { groupPlotHooksBySourcePage } from '../../domain/dossier/plotHooks.js';
import { hookText } from './format.js';

/** @param {unknown} text @returns {string} */
function key(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').toLowerCase();
}

/**
 * The Plot Hooks chapter's groups as it prints them: one per source page, each list holding
 * only the hooks with text, in the collector's order.
 * @template {{ hook?: unknown, category?: unknown, sourceName?: unknown }} R
 * @param {ReadonlyArray<R>} all  the view model's `hooks.all`
 * @returns {Array<{ page: { id: string, label: string }, list: R[] }>}
 */
export function plotHookPrintGroups(all) {
  return groupPlotHooksBySourcePage((all || []).map((row) => ({ row, category: row.category, source: row.sourceName })))
    .map(({ page, hooks }) => ({ page, list: hooks.map((m) => m.row).filter((h) => hookText(h?.hook).trim().length > 0) }))
    .filter((g) => g.list.length > 0);
}

/**
 * Where a hook's text prints in chapter 04: its group's label and its two-digit number there.
 * @param {ReadonlyArray<{ hook?: unknown, category?: unknown, sourceName?: unknown }>} all
 * @param {unknown} text
 * @returns {{ label: string, number: string } | null}
 */
export function plotHookPlace(all, text) {
  const k = key(text);
  if (!k) return null;
  for (const { page, list } of plotHookPrintGroups(all)) {
    const i = list.findIndex((h) => key(hookText(h.hook)) === k);
    if (i >= 0) return { label: page.label, number: String(i + 1).padStart(2, '0') };
  }
  return null;
}
