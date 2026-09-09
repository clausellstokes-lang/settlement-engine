/**
 * EventComposerRelationshipExtras — the OPTIONAL relationship-affecting inputs
 * that hang off war / infiltration stressors and trade routes:
 *
 *   Instigating neighbour (APPLY_STRESSOR, war-type) — names the neighbour behind
 *      a siege / wartime / occupation / betrayal. On apply the home settlement's
 *      view of that neighbour sours to 'hostile' (mutateWorld.js applyStressor).
 *   Instigating neighbour (APPLY_STRESSOR, infiltrated) — names the neighbour
 *      behind an infiltration. On apply the home settlement's view sours to a
 *      LIGHTER, DM-chosen relationship (rival / cold war / hostile, default rival).
 *   Target settlement (OPENED_TRADE_ROUTE) — opens a trade route with ANY OTHER
 *      settlement in the same campaign, not only a pre-linked neighbour; the
 *      handler ADDS a neighbourNetwork link for it (mutateWorld.js:273-287).
 *
 * All are optional and settlement-local (the home settlement's view only) on the
 * relationship flip; state lives in the parent EventComposer; this is presentational.
 *
 * BATCH CAVEAT: batch.js eventConsumes hard-requires a linked 'neighbour' ref for
 * OPENED_TRADE_ROUTE, so a batched unlinked campaign-target raises the blocking
 * warning; direct Apply works (mutateWorld adds the link). Parity with THEIRS.
 */

import { Field } from './Field.jsx';
import { selectStyle, RELATIONSHIP_LABELS } from './EventComposerConstants.js';
import { buildTargetOptions } from './helpers.js';
import { INFILTRATION_TARGET_RELATIONSHIPS } from '../../../domain/worldPulse/warStressorTypes.js';

export function EventComposerRelationshipExtras({
  type, settlement, isWarStressor, isInfiltrationStressor,
  instigatorNeighbour, setInstigatorNeighbour,
  instigatorRelationship, setInstigatorRelationship,
  tradeTarget, setTradeTarget, campaignSettlementOptions,
}) {
  if (isWarStressor || isInfiltrationStressor) {
    const neighbourOpts = buildTargetOptions(settlement, 'neighbours');
    if (neighbourOpts.length === 0) return null;
    // The hint adapts to what the flip actually does: a war stressor sours to a
    // flat hostile; an infiltration sours to the chosen, lighter relationship.
    const hint = isInfiltrationStressor
      ? 'Optional. Names who is behind the infiltration; sours that neighbour by the level below'
      : 'Optional. Names who is behind the war; sours that neighbour to hostile';
    return (
      <>
        <Field label="Instigating neighbour" hint={hint}>
          <select
            value={instigatorNeighbour}
            onChange={e => setInstigatorNeighbour(e.target.value)}
            style={selectStyle}
          >
            <option value="">None</option>
            {neighbourOpts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
        {isInfiltrationStressor && instigatorNeighbour && (
          <Field
            label="Souring level"
            hint="How far the infiltration sours that neighbour"
          >
            <select
              value={instigatorRelationship}
              onChange={e => setInstigatorRelationship(e.target.value)}
              style={selectStyle}
            >
              {INFILTRATION_TARGET_RELATIONSHIPS.map(r => (
                <option key={r} value={r}>{RELATIONSHIP_LABELS[r] || r}</option>
              ))}
            </select>
          </Field>
        )}
      </>
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
