import { Check, CircleSlash, GitBranch, RadioTower, Undo2 } from 'lucide-react';
import { useMemo } from 'react';

import { ensureRegionalGraph, isRegionalImpactAvailable } from '../../domain/region/index.js';
import { useStore } from '../../store/index.js';
import { BORDER, BODY, CARD, FS, GOLD, GOLD_BG, INK, MUTED, SECOND, sans, swatch } from '../theme.js';

function kindLabel(kind) {
  return String(kind || 'regional impact').replace(/_/g, ' ');
}

function goodsLabel(impact) {
  if (!impact?.goods?.length) return 'trade access';
  return impact.goods.map(g => g.label || g.id).slice(0, 3).join(', ');
}

function statusColor(status) {
  if (status === 'applied') return swatch.success;
  if (status === 'resolved') return SECOND;
  if (status === 'ignored') return MUTED;
  return GOLD;
}

export default function RegionalImpactInbox({ saveId, onApplied }) {
  const campaigns = useStore(s => s.campaigns);
  const applyQueuedRegionalImpact = useStore(s => s.applyQueuedRegionalImpact);
  const ignoreQueuedRegionalImpact = useStore(s => s.ignoreQueuedRegionalImpact);
  const resolveRegionalImpact = useStore(s => s.resolveRegionalImpact);

  const context = useMemo(() => {
    if (!saveId) return null;
    const campaign = (campaigns || []).find(c =>
      (c.settlementIds || []).map(String).includes(String(saveId))
    );
    if (!campaign) return null;
    const graph = ensureRegionalGraph(campaign.regionalGraph);
    const nodeNames = new Map(graph.nodes.map(node => [String(node.id), node.name]));
    const incoming = graph.queuedImpacts
      .filter(impact => String(impact.targetSettlementId) === String(saveId))
      .filter(impact => impact.status === 'queued' || impact.status === 'applied' || impact.status === 'resolved')
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'queued' ? -1 : 1;
        return (b.severity || 0) - (a.severity || 0);
      });
    const outgoingEvents = graph.eventLog
      .filter(event => String(event.sourceSettlementId) === String(saveId))
      .slice()
      .reverse()
      .slice(0, 3);
    return { campaign, graph, nodeNames, incoming, outgoingEvents };
  }, [campaigns, saveId]);

  if (!context || (!context.incoming.length && !context.outgoingEvents.length)) return null;

  const handleApply = (impactId) => {
    const result = applyQueuedRegionalImpact(context.campaign.id, impactId);
    if (result && String(result.saveId) === String(saveId)) onApplied?.(result);
  };

  const handleIgnore = (impactId) => {
    ignoreQueuedRegionalImpact(context.campaign.id, impactId);
  };

  const handleResolve = (impactId) => {
    const result = resolveRegionalImpact(context.campaign.id, impactId);
    if (result && String(result.saveId) === String(saveId)) onApplied?.(result);
  };

  return (
    <section style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      padding: '12px 14px',
      marginTop: 12,
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
        <GitBranch size={14} color={GOLD} />
        <div style={{ fontSize: FS.xs, fontWeight: 800, color: INK, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Regional Causality
        </div>
        <span style={{ marginLeft: 'auto', fontSize: FS.xxs, color: SECOND, fontFamily: sans }}>
          {context.campaign.name}
        </span>
      </div>

      {context.incoming.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {context.incoming.slice(0, 4).map(impact => {
            const sourceName = context.nodeNames.get(String(impact.sourceSettlementId)) || impact.sourceSettlementName || impact.sourceSettlementId;
            const color = statusColor(impact.status);
            const available = isRegionalImpactAvailable(impact);
            return (
              <div
                key={impact.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 8px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  background: impact.status === 'applied' ? swatch.successBg : GOLD_BG,
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: FS.xs, color: BODY, fontWeight: 800, fontFamily: sans }}>
                    {kindLabel(impact.kind)}
                  </div>
                  <div style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans, lineHeight: 1.35 }}>
                    {sourceName} · {goodsLabel(impact)} · {Math.round((impact.severity || 0) * 100)}%
                  </div>
                </div>
                {impact.status === 'queued' && (
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => handleApply(impact.id)}
                      title={available ? 'Apply regional impact' : 'Impact is delayed'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        border: 'none',
                        borderRadius: 5,
                        background: available ? swatch.success : BORDER,
                        color: swatch.white,
                        cursor: available ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIgnore(impact.id)}
                      title="Ignore regional impact"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 5,
                        background: CARD,
                        color: MUTED,
                        cursor: 'pointer',
                      }}
                    >
                      <CircleSlash size={14} />
                    </button>
                  </div>
                )}
                {impact.status === 'applied' && (
                  <button
                    type="button"
                    onClick={() => handleResolve(impact.id)}
                    title="Resolve regional impact"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 5,
                      background: CARD,
                      color: SECOND,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Undo2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {context.outgoingEvents.length > 0 && (
        <div style={{ marginTop: context.incoming.length ? 10 : 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {context.outgoingEvents.map(event => (
            <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: FS.xxs, color: SECOND, fontFamily: sans }}>
              <RadioTower size={11} color={MUTED} />
              <span style={{ color: INK, fontWeight: 700 }}>{event.sourceEvent?.type || 'Regional event'}</span>
              <span>sent {event.impactIds?.length || 0} impact{(event.impactIds?.length || 0) === 1 ? '' : 's'}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
