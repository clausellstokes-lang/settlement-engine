/**
 * domain/worldPulse/dispositionDeltas.js — Feature C (C1) write-side collector.
 *
 * Gathers the id-stable win/loss attributions the A1 war layer and the A2 trade
 * war emit for the contests they RESOLVED this tick, into a single flat delta
 * list for `applyDispositionDeltas` (which folds them commutatively, sorted by id
 * — order-independent). The resolvers do the H16 attribution at the source: the
 * occupier is the strongest besieger (codepoint tie-break), the conquered is the
 * target; the trade winner/defeated come from `primarySupplierInto` + the
 * relationshipRoles vassal override — never raw edge orientation. So reversing
 * the saves/outcomes order yields the SAME deltas → the SAME next-tick ledger.
 *
 * Pure; no rng, no wall-clock, no mutation. Returns [] when both resolvers were
 * inert (layer OFF, or no contest resolved) — the byte-neutral case.
 *
 * @param {{ dispositionDeltas?: Array<any> }} [war] - evaluateWarLayer result.
 * @param {{ dispositionDeltas?: Array<any> }} [tradeWar] - evaluateTradeWar result.
 * @returns {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>}
 */
export function collectDispositionDeltas(war = {}, tradeWar = {}) {
  const warDeltas = Array.isArray(war?.dispositionDeltas) ? war.dispositionDeltas : [];
  const tradeDeltas = Array.isArray(tradeWar?.dispositionDeltas) ? tradeWar.dispositionDeltas : [];
  if (!warDeltas.length && !tradeDeltas.length) return [];
  return [...warDeltas, ...tradeDeltas].filter(
    (d) => d && d.id != null && (d.outcome === 'win' || d.outcome === 'loss'),
  );
}
