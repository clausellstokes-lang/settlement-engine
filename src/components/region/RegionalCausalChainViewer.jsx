import { Check, ChevronDown, ChevronRight, CircleSlash, SlidersHorizontal, Undo2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { conditionFromRegionalImpact, ensureRegionalGraph, isRegionalImpactAvailable } from '../../domain/region/index.js';
import IconButton from '../primitives/IconButton.jsx';
import { BORDER, BODY, CARD, FS, GOLD, GOLD_BG, INK, MUTED, SECOND, sans, swatch } from '../theme.js';

function human(value) {
  return String(value || 'unknown').replace(/_/g, ' ');
}

function optionLabel(value) {
  return value === 'all' ? 'All' : human(value);
}

function statusWeight(status) {
  if (status === 'queued') return 0;
  if (status === 'applied') return 1;
  if (status === 'resolved') return 2;
  if (status === 'ignored') return 3;
  return 4;
}

export default function RegionalCausalChainViewer({
  campaign,
  onApplyImpact,
  onIgnoreImpact,
  onResolveImpact,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [minSeverity, setMinSeverity] = useState(0);
  const [expandedImpactId, setExpandedImpactId] = useState(null);

  const model = useMemo(() => {
    const graph = ensureRegionalGraph(campaign?.regionalGraph);
    const nodeNames = new Map(graph.nodes.map(node => [String(node.id), node.name]));
    const channelsById = new Map(graph.channels.map(channel => [channel.id, channel]));
    const eventsByImpactId = new Map();
    for (const event of graph.eventLog || []) {
      for (const impactId of event.impactIds || []) {
        eventsByImpactId.set(String(impactId), event);
      }
    }
    const rows = graph.queuedImpacts
      .map(impact => {
        const channel = channelsById.get(impact.channelId);
        return {
          impact,
          channel,
          sourceId: String(impact.sourceSettlementId || channel?.from || ''),
          targetId: String(impact.targetSettlementId || channel?.to || ''),
          sourceName: nodeNames.get(String(impact.sourceSettlementId || channel?.from)) || impact.sourceSettlementName || impact.sourceSettlementId || channel?.from,
          targetName: nodeNames.get(String(impact.targetSettlementId || channel?.to)) || impact.targetSettlementId || channel?.to,
          channelType: impact.channelType || channel?.type || 'regional_channel',
          event: eventsByImpactId.get(String(impact.id)) || null,
          condition: conditionFromRegionalImpact(impact),
        };
      })
      .sort((a, b) => {
        const status = statusWeight(a.impact.status) - statusWeight(b.impact.status);
        if (status) return status;
        return (b.impact.severity || 0) - (a.impact.severity || 0);
      });
    const types = [...new Set(rows.map(row => row.channelType))].sort();
    const sources = [...new Map(rows.map(row => [row.sourceId, row.sourceName])).entries()]
      .filter(([id]) => id)
      .sort((a, b) => String(a[1]).localeCompare(String(b[1])));
    return { rows, types, sources };
  }, [campaign]);

  const filteredRows = model.rows.filter(row => {
    if (statusFilter !== 'all' && row.impact.status !== statusFilter) return false;
    if (typeFilter !== 'all' && row.channelType !== typeFilter) return false;
    if (sourceFilter !== 'all' && row.sourceId !== sourceFilter) return false;
    return (row.impact.severity || 0) >= minSeverity;
  });

  if (!model.rows.length) return null;

  return (
    <div style={{ marginTop: 9, border: `1px solid ${BORDER}`, borderRadius: 6, background: CARD, overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 8px',
        borderBottom: `1px solid ${BORDER}`,
        flexWrap: 'wrap',
      }}>
        <SlidersHorizontal size={12} color={GOLD} />
        <span style={{ fontSize: FS.xxs, color: INK, fontWeight: 800, fontFamily: sans }}>
          Causal chains
        </span>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          {['all', 'queued', 'applied', 'resolved', 'ignored', 'expired'].map(value => (
            <option key={value} value={value}>{optionLabel(value)}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="all">All channels</option>
          {model.types.map(type => <option key={type} value={type}>{human(type)}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={selectStyle}>
          <option value="all">All sources</option>
          {model.sources.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <label htmlFor="regional-causal-chain-severity" style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto', fontSize: FS.micro, color: MUTED, fontFamily: sans }}>
          Severity
          <input
            id="regional-causal-chain-severity"
            type="range"
            aria-label="Minimum severity"
            min="0"
            max="0.8"
            step="0.1"
            value={minSeverity}
            onChange={e => setMinSeverity(Number(e.target.value))}
            style={{ width: 86, accentColor: GOLD }}
          />
          {Math.round(minSeverity * 100)}%
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredRows.slice(0, 8).map(row => {
          const available = isRegionalImpactAvailable(row.impact);
          return (
            <div
              key={row.impact.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: 8,
                padding: '7px 8px',
                borderTop: `1px solid ${swatch['#E8DCC8'] || BORDER}`,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: FS.xxs, color: BODY, fontWeight: 800, fontFamily: sans, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {row.sourceName}{' -> '}{row.targetName}
                </div>
                <div style={{ fontSize: FS.micro, color: SECOND, fontFamily: sans, lineHeight: 1.35 }}>
                  {human(row.channelType)} · {human(row.impact.kind)} · {Math.round((row.impact.severity || 0) * 100)}% · {row.impact.status}
                  {row.impact.delayTicks > 0 ? ` · ready in ${row.impact.delayTicks}` : ''}
                  {row.impact.waveDepth > 0 ? ` · wave ${row.impact.waveDepth}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {row.impact.status === 'queued' && (
                  <>
                    <IconButton
                      Icon={Check}
                      label={available ? 'Apply regional impact' : 'Impact is delayed'}
                      tone="primary"
                      size="sm"
                      disabled={!available}
                      onClick={() => onApplyImpact?.(campaign.id, row.impact.id)}
                    />
                    <IconButton
                      Icon={CircleSlash}
                      label="Ignore regional impact"
                      size="sm"
                      onClick={() => onIgnoreImpact?.(campaign.id, row.impact.id)}
                    />
                  </>
                )}
                {row.impact.status === 'applied' && (
                  <IconButton
                    Icon={Undo2}
                    label="Resolve applied regional impact"
                    size="sm"
                    onClick={() => onResolveImpact?.(campaign.id, row.impact.id)}
                  />
                )}
                <IconButton
                  Icon={expandedImpactId === row.impact.id ? ChevronDown : ChevronRight}
                  label={expandedImpactId === row.impact.id ? 'Hide causal details' : 'Show causal details'}
                  size="sm"
                  pressed={expandedImpactId === row.impact.id}
                  onClick={() => setExpandedImpactId(expandedImpactId === row.impact.id ? null : row.impact.id)}
                />
              </div>
              {expandedImpactId === row.impact.id && (
                <div style={{
                  gridColumn: '1 / -1',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 7,
                  padding: '7px 8px',
                  borderTop: `1px solid ${BORDER}`,
                  borderRadius: 5,
                  background: GOLD_BG,
                }}>
                  <DetailBlock
                    label="Source event"
                    value={row.event?.sourceEvent?.type || row.impact.sourceChange?.kind || row.impact.kind}
                    meta={row.event?.sourceEvent?.id || row.event?.id || row.impact.sourceChange?.source || null}
                  />
                  <DetailBlock
                    label="Channel"
                    value={human(row.channelType)}
                    meta={row.channel ? `${Math.round((row.channel.strength || 0) * 100)}% strength · ${Math.round((row.channel.confidence || 0) * 100)}% confidence · ${row.channel.visibility}` : row.impact.channelId}
                  />
                  <DetailBlock
                    label="Target condition"
                    value={human(row.condition.archetype)}
                    meta={row.condition.id}
                  />
                  <DetailBlock
                    label="Path"
                    value={(row.impact.pathSettlementIds || [row.impact.sourceSettlementId, row.impact.targetSettlementId]).filter(Boolean).join(' -> ')}
                    meta={row.impact.sourceImpactId ? `from ${row.impact.sourceImpactId}` : row.impact.waveDepth > 0 ? `wave ${row.impact.waveDepth}` : 'direct'}
                  />
                  {row.impact.explanation && (
                    <div style={{
                      gridColumn: '1 / -1',
                      fontSize: FS.micro,
                      color: BODY,
                      fontFamily: sans,
                      lineHeight: 1.4,
                    }}>
                      {row.impact.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filteredRows.length > 8 && (
          <div style={{ padding: '6px 8px', fontSize: FS.micro, color: MUTED, fontFamily: sans }}>
            +{filteredRows.length - 8} more matching chains
          </div>
        )}
        {!filteredRows.length && (
          <div style={{ padding: '8px', fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>
            No regional chains match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle = {
  border: `1px solid ${BORDER}`,
  borderRadius: 5,
  background: CARD,
  color: SECOND,
  fontFamily: sans,
  fontSize: FS.micro,
  fontWeight: 700,
  padding: '3px 5px',
};

function DetailBlock({ label, value, meta }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: FS.micro,
        color: MUTED,
        fontFamily: sans,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {label}
      </div>
      <div style={{ fontSize: FS.xxs, color: INK, fontFamily: sans, fontWeight: 800, overflowWrap: 'anywhere' }}>
        {value || 'unknown'}
      </div>
      {meta && (
        <div style={{ fontSize: FS.micro, color: SECOND, fontFamily: sans, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
          {meta}
        </div>
      )}
    </div>
  );
}

