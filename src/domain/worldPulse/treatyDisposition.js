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

/** Two channels learn from one material coalition verdict; the disposition
 * ledger remains the sole writer. `magnitude` is always the observed paid or
 * missing share, never the authored headline amount.
 * @param {{enabled?:boolean,id?:unknown,outcome?:unknown,magnitude?:unknown,
 *   sourceKind?:unknown,sourceEventId?:unknown}} input */
export function coalitionAftermathDispositionDeltas(input) {
  if (input?.enabled !== true || (input.outcome !== 'win' && input.outcome !== 'loss')) return [];
  const id = typeof input.id === 'string' ? input.id.trim() : '';
  const sourceEventId = typeof input.sourceEventId === 'string' ? input.sourceEventId.trim() : '';
  const sourceKind = typeof input.sourceKind === 'string' ? input.sourceKind.trim() : '';
  const magnitude = Number(input.magnitude);
  if (!id || !sourceEventId || ![
    'coalition_reimbursement_paid',
    'coalition_reimbursement_unpaid',
    'coalition_settlement_profit',
    'coalition_settlement_honored',
    'coalition_settlement_shortfall',
  ].includes(sourceKind) || !Number.isFinite(magnitude) || magnitude <= 0) return [];
  const bounded = Math.round(Math.max(0, Math.min(1, magnitude)) * 1_000_000) / 1_000_000;
  return ['mercantile', 'diplomatic'].map((channel) => ({
    id,
    channel,
    outcome: input.outcome,
    magnitude: bounded,
    sourceKind,
    sourceEventId,
  }));
}

/** Compare the actual captured return with the winner's current, evidenced war
 * spend. Exact equality is an honored-claim win: the alliance met the ledger,
 * even though it produced no surplus. Missing/zero spend remains silence.
 * @param {{enabled?:boolean,id?:unknown,got01?:unknown,spent01?:unknown,
 *   sourceEventId?:unknown}} input */
export function coalitionSettlementDispositionDeltas(input) {
  if (input?.enabled !== true) return [];
  const got01 = Number(input.got01);
  const spent01 = Number(input.spent01);
  if (!Number.isFinite(got01) || !Number.isFinite(spent01)
    || got01 < 0 || spent01 < 0 || (got01 === 0 && spent01 === 0)) return [];
  const got = Math.max(0, Math.min(1, got01));
  const spent = Math.max(0, Math.min(1, spent01));
  const difference = Math.abs(got - spent);
  const honored = difference <= 0.0001;
  const met = got + 0.0001 >= spent;
  return coalitionAftermathDispositionDeltas({
    enabled: true,
    id: input.id,
    outcome: met ? 'win' : 'loss',
    magnitude: honored ? spent : difference,
    sourceKind: honored
      ? 'coalition_settlement_honored'
      : met ? 'coalition_settlement_profit' : 'coalition_settlement_shortfall',
    sourceEventId: input.sourceEventId,
  });
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
