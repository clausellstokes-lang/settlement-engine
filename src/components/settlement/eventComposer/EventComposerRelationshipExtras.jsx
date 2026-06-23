/**
 * EventComposerRelationshipExtras — the two OPTIONAL relationship-affecting
 * inputs that hang off war stressors and trade routes:
 *
 *   #1 Instigating neighbour (APPLY_STRESSOR, war-type only) — names the
 *      neighbour behind a siege / wartime / occupation / betrayal. On apply the
 *      home settlement's view of that neighbour sours to 'hostile'.
 *   #6 Target settlement (OPENED_TRADE_ROUTE) — opens a trade route with ANY
 *      OTHER settlement in the same campaign, not only a pre-linked neighbour.
 *      On apply a neighbourNetwork link is ADDED for it.
 *
 * Both are optional and settlement-local (the home settlement's view only);
 * full bidirectional / regional propagation is a campaign-layer follow-up.
 * State lives in the parent EventComposer; this component is presentational.
 */

import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';
import { buildTargetOptions } from './helpers.js';

export function EventComposerRelationshipExtras({
  type, settlement, isWarStressor,
  instigatorNeighbour, setInstigatorNeighbour,
  tradeTarget, setTradeTarget, campaignSettlementOptions,
}) {
  if (isWarStressor) {
    const neighbourOpts = buildTargetOptions(settlement, 'neighbours');
    if (neighbourOpts.length === 0) return null;
    return (
      <Field
        label="Instigating neighbour"
        hint="Optional. Names who is behind the war; sours that neighbour to hostile"
      >
        <select value={instigatorNeighbour} onChange={e => setInstigatorNeighbour(e.target.value)} style={selectStyle}>
          <option value="">None</option>
          {neighbourOpts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </Field>
    );
  }
  if (type === 'OPENED_TRADE_ROUTE' && campaignSettlementOptions.length > 0) {
    return (
      <Field
        label="Target settlement"
        hint="Optional. Open the route with another campaign settlement; a link is added if none exists"
      >
        <select value={tradeTarget} onChange={e => setTradeTarget(e.target.value)} style={selectStyle}>
          <option value="">None (use neighbour above)</option>
          {campaignSettlementOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
        </select>
      </Field>
    );
  }
  return null;
}
