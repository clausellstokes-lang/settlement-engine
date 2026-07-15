/**
 * computeNetworkEcho — derive the single strongest network-effect signal for a
 * settlement, used to render SettlementDetail's one quiet "Network …" echo line
 * in the read-only View.
 *
 * Extracted from SettlementDetail (behavior-preserving) to keep that surface
 * under the component-size ratchet. It reuses the SAME modifier selector and
 * effect taxonomy the edit-only NetworkEffectsPanel uses, so the View's one-line
 * echo can never disagree with the full panel's headline fact, and it mirrors
 * that panel's own hasDominant gate.
 *
 * Returns null whenever there is nothing worth surfacing — no save id, no saves
 * to scan, no modifier sources, or the dominant effect sits below the noise
 * floor — which the caller treats as "render nothing".
 */

import { getSettlementModifiers, EFFECT_CATEGORIES, fmtMod } from '../../lib/relationshipGraph.js';

export function computeNetworkEcho(settlementId, saves) {
  if (!settlementId || !Array.isArray(saves) || !saves.length) return null;

  let modifiers;
  try {
    modifiers = getSettlementModifiers(settlementId, saves);
  } catch {
    return null;
  }
  if (!modifiers?.sources?.length) return null;

  // Pick the effect category whose total has the largest magnitude (positive or
  // negative) — the loudest causal signal the link cascade produced.
  const dominantCategory = EFFECT_CATEGORIES.reduce((best, category) => {
    const isLouder =
      Math.abs(modifiers.totals[category.key]) > Math.abs(modifiers.totals[best.key]);
    return isLouder ? category : best;
  }, EFFECT_CATEGORIES[0]);

  const dominantValue = modifiers.totals[dominantCategory.key];
  // Noise floor: don't surface a shift small enough to read as zero.
  if (Math.abs(dominantValue) < 0.005) return null;

  const topSource = modifiers.sources[0];
  return {
    label: dominantCategory.label,
    val: dominantValue,
    delta: fmtMod(dominantValue),
    isPos: dominantValue >= 0,
    via: topSource?.settlementName || null,
    count: modifiers.sources.length,
  };
}
