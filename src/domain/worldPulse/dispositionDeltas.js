/**
 * domain/worldPulse/dispositionDeltas.js — the disposition write-side collector.
 *
 * Gathers the id-stable win/loss attributions the war layer and the trade
 * war emit for the contests they RESOLVED this tick, into a single flat delta
 * list for `applyDispositionDeltas` (which folds them commutatively, sorted by id
 * — order-independent). The resolvers do the state-first attribution at the source: the
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

/**
 * WR-2's typed collector. The legacy collector above stays byte-exact for every
 * dark caller; the lit pulse opts into this sibling so the same resolved outcomes
 * teach the channel they actually exercised:
 *
 *   - field war and occupation resistance -> martial
 *   - supplier contests -> mercantile
 *
 * Treaty compliance is collected at its later mover seam because those verdicts
 * do not exist yet when this function runs. Pure, order-preserving, and tolerant
 * of malformed resolver rows in the same way as collectDispositionDeltas.
 *
 * @param {{ dispositionDeltas?: Array<any> }} [war]
 * @param {{ dispositionDeltas?: Array<any> }} [tradeWar]
 * @param {{ dispositionDeltas?: Array<any> }} [occupation]
 * @returns {Array<{id:string, channel:'martial'|'mercantile', outcome:'win'|'loss',
 *   magnitude?:number,sourceKind:'war_resolution'|'trade_contest'|'occupation_outcome',
 *   sourceEventId?:string,sourceEventIds?:string[]}>}
 */
export function collectDispositionChannelDeltas(war = {}, tradeWar = {}, occupation = {}) {
  const typed = (source, channel, sourceKind) => (Array.isArray(source?.dispositionDeltas)
    ? source.dispositionDeltas
      .filter((d) => d && d.id != null && (d.outcome === 'win' || d.outcome === 'loss'))
      .map((d) => ({
        ...d,
        channel,
        sourceKind,
        ...(d.sourceEventId || d.sourceConquestId
          ? { sourceEventId: String(d.sourceEventId || d.sourceConquestId) }
          : {}),
        ...(Array.isArray(d.sourceEventIds)
          ? { sourceEventIds: [...new Set(d.sourceEventIds.map(String).filter(Boolean))].sort() }
          : {}),
      }))
    : []);
  return [
    ...typed(war, 'martial', 'war_resolution'),
    ...typed(tradeWar, 'mercantile', 'trade_contest'),
    ...typed(occupation, 'martial', 'occupation_outcome'),
  ];
}
