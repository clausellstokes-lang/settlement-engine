import { useMemo } from 'react';

import { useStore } from '../../store';
import { buildRegionalMapOverlay } from '../../lib/regionalMapOverlay.js';

function labelForType(type) {
  return String(type || 'channel').replace(/_/g, ' ');
}

function labelForKind(kind) {
  return String(kind || 'impact').replace(/_/g, ' ');
}

export default function RegionalCausalityLayer() {
  const campaigns = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const placements = useStore(s => s.mapState.placements);
  const layers = useStore(s => s.mapState.layers);

  const campaign = useMemo(() => {
    if (!activeCampaignId) return null;
    return campaigns.find(c => String(c.id) === String(activeCampaignId)) || null;
  }, [campaigns, activeCampaignId]);

  const overlay = useMemo(() => buildRegionalMapOverlay({
    campaign,
    placements,
    includeGm: layers.regionalShowGm !== false,
    includeHidden: false,
    channelTypes: layers.regionalChannelFilter,
    impactStatuses: layers.regionalImpactStatusFilter,
    minSeverity: layers.regionalMinSeverity,
  }), [
    campaign,
    placements,
    layers.regionalShowGm,
    layers.regionalChannelFilter,
    layers.regionalImpactStatusFilter,
    layers.regionalMinSeverity,
  ]);

  if (!campaign || (!overlay.channels.length && !overlay.impacts.length)) return null;

  return (
    <g className="sf-regional-causality" pointerEvents="none">
      {layers.regionalChannels && overlay.channels.map(channel => {
        const width = 1.4 + (channel.strength || 0.5) * 2.2;
        return (
          <g key={channel.id}>
            <line
              x1={channel.fromPoint.x}
              y1={channel.fromPoint.y}
              x2={channel.toPoint.x}
              y2={channel.toPoint.y}
              stroke={channel.color}
              strokeWidth={width + 4}
              strokeOpacity={0.12}
              strokeLinecap="round"
            />
            <line
              x1={channel.fromPoint.x}
              y1={channel.fromPoint.y}
              x2={channel.toPoint.x}
              y2={channel.toPoint.y}
              stroke={channel.color}
              strokeWidth={width}
              strokeOpacity={channel.visibility === 'gm' ? 0.62 : 0.78}
              strokeDasharray={channel.visibility === 'gm' ? '5 3' : 'none'}
              strokeLinecap="round"
            >
              <title>{`${channel.fromName} -> ${channel.toName}: ${labelForType(channel.type)}`}</title>
            </line>
          </g>
        );
      })}

      {layers.regionalImpacts && overlay.impacts.map(impact => {
        const radius = 5 + Math.round((impact.severity || 0) * 5);
        const isQueued = impact.status === 'queued';
        return (
          <g key={impact.id} transform={`translate(${impact.point.x} ${impact.point.y})`}>
            <circle
              r={radius + (isQueued ? 5 : 3)}
              fill={impact.color}
              fillOpacity={isQueued ? 0.12 : 0.08}
              stroke={impact.color}
              strokeOpacity={isQueued ? 0.3 : 0.18}
              strokeWidth={1}
            />
            <circle
              r={radius}
              fill={impact.color}
              fillOpacity={impact.status === 'applied' ? 0.72 : 0.86}
              stroke="#fffbf5"
              strokeWidth={1.4}
            >
              <title>{`${impact.targetName}: ${labelForKind(impact.kind)} from ${impact.sourceName}`}</title>
            </circle>
            {impact.delayTicks > 0 && (
              <text
                x="0"
                y="2.5"
                fontFamily="Georgia, serif"
                fontSize="6"
                fontWeight="800"
                textAnchor="middle"
                fill="#fffbf5"
              >
                {impact.delayTicks}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
