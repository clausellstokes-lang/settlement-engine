import { Check, CheckCheck, CircleSlash, FastForward, Network, RadioTower, RefreshCw, Sparkles } from 'lucide-react';

import { ensureRegionalGraph, isRegionalImpactAvailable } from '../../domain/region/index.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { BORDER, BODY, CARD, FS, GOLD, GOLD_BG, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
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
    <div style={{
      borderTop: `1px solid ${BORDER}`,
      padding: '9px 12px',
      background: CARD,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Network size={13} color={GOLD} />
        <span style={{ fontSize: FS.xs, color: INK, fontWeight: 800, fontFamily: sans }}>
          Regional graph
        </span>
        <span style={{ fontSize: FS.xxs, color: SECOND, fontFamily: sans }}>
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
          variant="gold"
          size="sm"
          icon={<RefreshCw size={11} />}
          onClick={() => onDiscover?.(campaign.id)}
          title="Discover regional channels"
          style={{ marginLeft: availableImpacts.length > 1 || delayedImpacts.length > 0 ? 0 : 'auto' }}
        >
          Discover
        </Button>
      </div>

      {topSuggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
          {topSuggestions.map(channel => (
            <div
              key={channel.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 7px',
                border: `1px solid ${BORDER}`,
                borderRadius: 5,
                background: swatch['#F8F4EE'],
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: FS.xxs, color: BODY, fontWeight: 700, fontFamily: sans }}>
                  {labelForType(channel.type)} · {goodsLabel(channel)}
                </div>
                <div style={{ fontSize: FS.micro, color: MUTED, fontFamily: sans }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
          {topImpacts.map(impact => {
            const available = isRegionalImpactAvailable(impact);
            return (
            <div
              key={impact.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 7px',
                border: `1px solid ${BORDER}`,
                borderRadius: 5,
                background: GOLD_BG,
              }}
            >
              <Sparkles size={12} color={GOLD} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: FS.xxs, color: BODY, fontWeight: 700, fontFamily: sans }}>
                  {nodeNames.get(String(impact.targetSettlementId)) || impact.targetSettlementId} · {impact.kind.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: FS.micro, color: MUTED, fontFamily: sans }}>
                  {impactGoodsLabel(impact)} · severity {Math.round((impact.severity || 0) * 100)}%
                </div>
              </div>
              <IconButton
                Icon={Check}
                label={available ? 'Apply regional impact' : 'Impact is delayed'}
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
              <RadioTower size={10} color={MUTED} />
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
