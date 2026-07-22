import { Check, CheckCheck, CircleSlash, FastForward, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { ensureRegionalGraph, isRegionalImpactAvailable } from '../../domain/region/index.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { BODY, CARD, FS, GOLD_BG, INK, SECOND, SP, sans, swatch } from '../theme.js';
import RegionalCausalChainViewer from './RegionalCausalChainViewer.jsx';

function labelForType(type) {
  return String(type || 'channel').replace(/_/g, ' ');
}

function goodsLabel(channel) {
  if (!channel?.goods?.length) return 'general route';
  return channel.goods.map(g => g.label || g.id).slice(0, 3).join(', ');
}

function impactGoodsLabel(impact) {
  if (!impact?.goods?.length) return 'trade access';
  return impact.goods.map(g => g.label || g.id).slice(0, 3).join(', ');
}

export default function RegionalGraphSummary({
  campaign,
  settlementCount = 0,
  onDiscover,
  onConfirmChannel,
  onApplyImpact,
  onIgnoreImpact,
  onResolveImpact,
  onAdvanceImpacts,
  onApplyAllImpacts,
  onIgnoreAllImpacts,
}) {
  // Discover is a TRUE TOGGLE (owner order 2026-07-22): the discovered-
  // suggestions section opens on the first press and closes on the next.
  // Default-open when the persisted graph already carries suggested channels so
  // a reload never hides candidates the DM discovered in an earlier session.
  // The lazy initializer reads the graph once and tolerates a null campaign —
  // the guard below has not run yet, so this hook stays unconditional (Rules of
  // Hooks): it must sit ABOVE the early return.
  const [suggestionsOpen, setSuggestionsOpen] = useState(
    () => ensureRegionalGraph(campaign?.regionalGraph).channels.some(c => c.status === 'suggested'),
  );

  if (!campaign || settlementCount < 2) return null;

  const graph = ensureRegionalGraph(campaign.regionalGraph);
  const suggested = graph.channels.filter(c => c.status === 'suggested');
  const confirmed = graph.channels.filter(c => c.status === 'confirmed');
  const queuedImpacts = graph.queuedImpacts.filter(i => i.status === 'queued');
  const availableImpacts = queuedImpacts.filter(isRegionalImpactAvailable);
  const delayedImpacts = queuedImpacts.filter(i => (i.delayTicks || 0) > 0);
  const appliedImpacts = graph.queuedImpacts.filter(i => i.status === 'applied');
  const resolvedImpacts = graph.queuedImpacts.filter(i => i.status === 'resolved');
  const nodeNames = new Map(graph.nodes.map(node => [String(node.id), node.name]));
  const topSuggestions = suggested
    .slice()
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, 3);
  const topImpacts = queuedImpacts
    .slice()
    .sort((a, b) => (b.severity || 0) - (a.severity || 0))
    .slice(0, 3);
  const recentEvents = graph.eventLog.slice().reverse().slice(0, 3);

  return (
    // No leading borderTop false-floor (P5): the folder interior is one grouped
    // region, so a full-width hairline above the cards read as a page-end and
    // chopped the folder into stacked panels. Vertical spacing (marginTop) + the
    // cream background now mark the boundary between the strip above and this band.
    <div style={{
      marginTop: SP.sm,
      padding: '9px 12px',
      background: CARD,
    }}>
      {/* Glance sentence — one plain truth, composed from the SAME channel /
          impact counts below (legibility wave, 2026-07-22). "Regional graph" was a
          builder term with no user definition; the door is now "Between Your
          Towns" and the raw five-count stat is demoted to the secondary line. */}
      <div style={{ fontSize: FS.xs, color: INK, fontWeight: 700, fontFamily: sans, marginBottom: 4 }}>
        {confirmed.length === 0
          ? 'No trade routes link your towns yet.'
          : `${confirmed.length} trade route${confirmed.length === 1 ? '' : 's'} link your towns.`}
        {availableImpacts.length > 0 && ` ${availableImpacts.length} change${availableImpacts.length === 1 ? '' : 's'} ready to apply.`}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.xs, color: INK, fontWeight: 800, fontFamily: sans }}>
          Between Your Towns
        </span>
        <span style={{ fontSize: FS.xxs, color: BODY, fontFamily: sans }}>
          {confirmed.length} confirmed · {suggested.length} suggested · {availableImpacts.length}/{queuedImpacts.length} ready · {appliedImpacts.length} applied · {resolvedImpacts.length} resolved
        </span>
        {availableImpacts.length > 1 && (
          <>
            <IconButton
              Icon={CheckCheck}
              label="Apply all queued regional impacts"
              onClick={() => onApplyAllImpacts?.(campaign.id)}
              tone="primary"
              size="md"
              style={{ marginLeft: 'auto' }}
            />
            <IconButton
              Icon={CircleSlash}
              label="Ignore all queued regional impacts"
              onClick={() => onIgnoreAllImpacts?.(campaign.id)}
              tone="default"
              size="md"
            />
          </>
        )}
        {delayedImpacts.length > 0 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<FastForward size={11} />}
              onClick={() => onAdvanceImpacts?.(campaign.id, 1)}
              title="Advance regional impacts 1 tick"
              style={{ marginLeft: availableImpacts.length > 1 ? 0 : 'auto' }}
            >
              +1
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<FastForward size={11} />}
              onClick={() => onAdvanceImpacts?.(campaign.id, 3)}
              title="Advance regional impacts 3 ticks"
            >
              +3
            </Button>
          </>
        )}
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={11} />}
          onClick={() => {
            // True toggle: an open suggestions section closes on the next press;
            // a closed one runs discovery and opens (owner order 2026-07-22).
            if (suggestionsOpen) {
              setSuggestionsOpen(false);
            } else {
              onDiscover?.(campaign.id);
              setSuggestionsOpen(true);
            }
          }}
          aria-expanded={suggestionsOpen}
          title={suggestionsOpen ? 'Hide discovered channels' : 'Discover regional channels'}
          style={{ marginLeft: availableImpacts.length > 1 || delayedImpacts.length > 0 ? 0 : 'auto' }}
        >
          Discover
        </Button>
      </div>

      {suggestionsOpen && topSuggestions.length > 0 && (
        // Flattened to tint-only rows (no per-row border) so the folder keeps two
        // earned elevations — the folder border + the settlement-card borders —
        // not three nested ones (P5 anti-box-soup). The tint + the SP.sm column
        // gap carry the row-from-row grouping the borders used to do.
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: 8 }}>
          {topSuggestions.map(channel => (
            <div
              key={channel.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 7px',
                background: swatch['#F8F4EE'],
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: FS.xxs, color: BODY, fontWeight: 700, fontFamily: sans }}>
                  {labelForType(channel.type)} · {goodsLabel(channel)}
                </div>
                <div style={{ fontSize: FS.micro, color: BODY, fontFamily: sans }}>
                  {Math.round((channel.confidence || 0) * 100)}% confidence · strength {Math.round((channel.strength || 0) * 100)}%
                </div>
              </div>
              <IconButton
                Icon={Check}
                label="Confirm channel"
                onClick={() => onConfirmChannel?.(campaign.id, channel.id)}
                tone="primary"
                size="md"
              />
            </div>
          ))}
        </div>
      )}

      {topImpacts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: 8 }}>
          {topImpacts.map(impact => {
            const available = isRegionalImpactAvailable(impact);
            // A queued impact isn't acceptable until it matures (delayTicks ticks
            // down to 0). Show WHY the Accept is disabled and point at the advance
            // controls above — the bare disabled checkmark read as a dead button.
            const delayTicks = Math.max(0, impact.delayTicks || 0);
            return (
            <div
              key={impact.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 7px',
                background: GOLD_BG,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: FS.xxs, color: BODY, fontWeight: 700, fontFamily: sans }}>
                  {nodeNames.get(String(impact.targetSettlementId)) || impact.targetSettlementId} · {labelForType(impact.kind)}
                </div>
                <div style={{ fontSize: FS.micro, color: BODY, fontFamily: sans }}>
                  {impactGoodsLabel(impact)} · severity {Math.round((impact.severity || 0) * 100)}%
                  {!available && delayTicks > 0 && (
                    <span style={{ color: SECOND, fontWeight: 700 }}> · matures in {delayTicks} tick{delayTicks === 1 ? '' : 's'} (advance above to apply)</span>
                  )}
                </div>
              </div>
              <IconButton
                Icon={Check}
                label={available
                  ? 'Apply regional impact'
                  : delayTicks > 0
                    ? `Delayed: matures in ${delayTicks} tick${delayTicks === 1 ? '' : 's'}; advance the realm to apply`
                    : 'Impact is delayed'}
                disabled={!available}
                onClick={() => onApplyImpact?.(campaign.id, impact.id)}
                tone="primary"
                size="md"
              />
              <IconButton
                Icon={CircleSlash}
                label="Ignore regional impact"
                onClick={() => onIgnoreImpact?.(campaign.id, impact.id)}
                tone="default"
                size="md"
              />
            </div>
            );
          })}
        </div>
      )}

      <RegionalCausalChainViewer
        campaign={campaign}
        onApplyImpact={onApplyImpact}
        onIgnoreImpact={onIgnoreImpact}
        onResolveImpact={onResolveImpact}
        onAdvanceImpacts={onAdvanceImpacts}
      />

      {recentEvents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          {recentEvents.map(event => (
            <div
              key={event.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: FS.micro,
                color: SECOND,
                fontFamily: sans,
              }}
            >
              <span style={{ color: BODY, fontWeight: 700 }}>
                {nodeNames.get(String(event.sourceSettlementId)) || event.sourceSettlementName || event.sourceSettlementId}
              </span>
              <span>{event.sourceEvent?.type || 'event'} · {event.impactIds?.length || 0} impact{(event.impactIds?.length || 0) === 1 ? '' : 's'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
