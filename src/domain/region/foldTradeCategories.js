/**
 * foldTradeCategories — §14 collapse custom-good trade labels into the trade
 * CATEGORY each good declares via `satisfies`, so the Economics tab shows one
 * bucket ("Weapons & armour", incl. the good) instead of a pill per custom good.
 *
 * Pure + deterministic — no rng, no store. A good with no `satisfies` stays under
 * its own name; built-in trade labels (never in the satisfiesIndex) pass through
 * untouched. The fold is order-preserving and dedupes by display label so two
 * military goods share one "Weapons & armour" line.
 */
import { tradeCategoryLabelOf } from '../customContentSchema.js';

/**
 * @param {string[]} labels - export or import labels (custom good names + built-in labels)
 * @param {Map<string,string>} satisfiesIndex - lowercased good name → satisfies value (category key or free-text)
 * @param {Set<string>} [priorCustom] - lowercased labels already flagged custom (so a custom good with no satisfies keeps its gold tint)
 * @returns {{ labels: string[], members: Record<string, string[]>, custom: string[] }}
 *   labels  - folded, deduped, order-preserving label list
 *   members - category display label → original good names folded into it (for "incl. …")
 *   custom  - display labels that should keep the custom (gold ✦) treatment
 */
export function foldTradeCategories(labels, satisfiesIndex, priorCustom = new Set()) {
  const out = [];
  const seen = new Set();
  /** @type {Record<string, string[]>} */
  const members = {};
  const custom = new Set();
  const idx = satisfiesIndex instanceof Map ? satisfiesIndex : new Map();
  for (const label of labels || []) {
    const sat = idx.get(String(label).toLowerCase());
    // known category key → its label; free-text "Other" → the typed value itself
    const catLabel = sat ? (tradeCategoryLabelOf(sat) || sat) : null;
    const display = catLabel || label;
    const k = String(display).toLowerCase();
    if (catLabel) {
      (members[catLabel] = members[catLabel] || []).push(label);
      custom.add(display);
    } else if (priorCustom.has(String(label).toLowerCase())) {
      custom.add(display);
    }
    if (!seen.has(k)) { seen.add(k); out.push(display); }
  }
  return { labels: out, members, custom: [...custom] };
}
