/**
 * treatyDisposition.js — WR-2's treaty-outcome adapter.
 *
 * Treaty enforcement owns the verdict; dispositionLedger owns the memory. This
 * leaf translates only two observed transitions into the writer's typed input:
 * an agreement reaching its horizon intact, or an oathbreaker first entering
 * default. It never infers a winner from somebody else's broken promise.
 */

/** @typedef {{id:string, channel:'diplomatic', outcome:'win'|'loss', magnitude?:number,
 *   sourceKind:'treaty_held'|'treaty_default'|'mediation_landed'}} TreatyDispositionDelta */

/**
 * @param {{ enabled?:boolean, outcome:'held'|'defaulted'|'mediated', treaty?:Record<string, unknown>,
 *   previousCompliance?:string, victorId?:string, loserId?:string, mediatorId?:string,
 *   severity01?:number }} input
 * @returns {TreatyDispositionDelta[]}
 */
export function treatyDispositionDeltas(input) {
  if (input?.enabled !== true || input.previousCompliance === 'defaulted') return [];
  if (input.outcome === 'mediated') {
    const id = String(input.mediatorId || '');
    return id ? [{ id, channel: 'diplomatic', outcome: 'win', sourceKind: 'mediation_landed' }] : [];
  }
  if (input.outcome === 'defaulted') {
    const id = String(input.loserId || '');
    if (!id) return [];
    const severity = Number.isFinite(input.severity01) ? Number(input.severity01) : 0;
    return [{
      id,
      channel: 'diplomatic',
      outcome: 'loss',
      magnitude: Math.max(0.25, severity),
      sourceKind: 'treaty_default',
    }];
  }
  if (input.outcome !== 'held' || String(input.treaty?.breachType || '') === 'repudiation') return [];
  const parties = [...new Set((Array.isArray(input.treaty?.parties)
    ? input.treaty.parties
    : [input.victorId, input.loserId]).map(String).filter(Boolean))].sort();
  return parties.map((id) => ({
    id,
    channel: 'diplomatic',
    outcome: 'win',
    sourceKind: 'treaty_held',
  }));
}

/** @param {Record<string, unknown>} worldState */
export function dispositionTreatyLearningActive(worldState) {
  const rules = /** @type {{dispositionChannelsEnabled?:unknown}} */ (worldState?.simulationRules || {});
  return rules.dispositionChannelsEnabled === true;
}

/** Preserve the treaty mover's legacy return shape while the WR-2 flag is dark.
 * @template T @param {T} result @param {boolean} enabled @param {TreatyDispositionDelta[]} dispositionDeltas
 * @returns {T & {dispositionDeltas?:TreatyDispositionDelta[]}} */
export function withTreatyDispositionDeltas(result, enabled, dispositionDeltas) {
  return enabled === true ? { ...result, dispositionDeltas } : result;
}
