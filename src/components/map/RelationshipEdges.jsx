/**
 * RelationshipEdges — draws lines between linked settlements, styled by
 * relationship type. Pulls edges from the saved settlements' neighbour
 * blocks and maps them to burg coordinates via mapState.placements.
 *
 * Colors/styles mirror the legend in WorldMap.jsx:
 *   trade_partner → solid teal
 *   allied        → solid blue
 *   patron/client/vassal → dashed purple (with direction dot at midpoint)
 *   rival         → dotted orange
 *   cold_war      → dotted red
 *   hostile       → thick solid red
 */

import { useMemo } from 'react';
import { useStore } from '../../store';
// Single source of truth shared with LayersPanel / MapLegend / RoutesToolbar so
// the drawn line, the legend, and the filter chips never disagree. WAR_FAITH_STYLE
// is the SAME export the legend reads, so the siege/faith front the map draws and
// the key that explains it can never use different colors (P11).
import { REL_EDGE_STYLE as STYLE, WAR_FAITH_STYLE } from './relationshipEdgeStyle.js';

export default function RelationshipEdges() {
  const savedSettlements = useStore(s => s.savedSettlements);
  const placements       = useStore(s => s.mapState.placements);
  const filter           = useStore(s => s.mapState.layers.relationshipFilter);
  // §S3 — the active campaign carries the live regional graph whose war_front /
  // religious_authority channels are the pulse-minted war/faith fronts. A
  // non-DM view (regionalShowGm off) must NOT draw a gm/hidden channel.
  const campaigns        = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const showGm           = useStore(s => s.mapState.layers.regionalShowGm !== false);
  // Subscribed only so a fresh world (loadSnapshot / regenerate) re-runs
  // the memo even when settlement data and placement keys are unchanged.
  const geometryVersion  = useStore(s => s.geometryVersion);

  const activeCampaign = useMemo(
    () => (activeCampaignId ? (campaigns || []).find(c => String(c.id) === String(activeCampaignId)) : null) || null,
    [campaigns, activeCampaignId],
  );

  // War/faith directed channels from the live regional graph, honoring each
  // channel's `visibility` exactly as the regional causality overlay does: a
  // `hidden` channel is never drawn; a `gm` channel only when GM view is on
  // (war_front defaults public, religious_authority defaults gm). Inert (returns
  // []) when no campaign / no such channels exist — a no-war map is unchanged.
  const warFaithEdges = useMemo(() => {
    const graph = activeCampaign?.regionalGraph || activeCampaign?.worldState?.regionalGraph;
    const channels = Array.isArray(graph?.channels) ? graph.channels : [];
    if (!channels.length || !placements) return [];

    const burgXY = new Map();
    const settlementToBurg = new Map();
    for (const [burgIdStr, p] of Object.entries(placements)) {
      if (p?.settlementId) settlementToBurg.set(String(p.settlementId), String(burgIdStr));
      if (typeof p?.x === 'number' && typeof p?.y === 'number') burgXY.set(String(burgIdStr), { x: p.x, y: p.y });
    }
    const xyFor = (id) => burgXY.get(settlementToBurg.get(String(id)));

    const out = [];
    for (const channel of channels) {
      const style = WAR_FAITH_STYLE[channel?.type];
      if (!style) continue;
      if (channel.status !== 'confirmed') continue;
      const visibility = channel.visibility || 'public';
      // Honor visibility: never draw hidden; draw gm only when GM view is on.
      if (visibility === 'hidden') continue;
      if (visibility === 'gm' && !showGm) continue;
      const fromXY = xyFor(channel.from);
      const toXY = xyFor(channel.to);
      if (!fromXY || !toXY) continue;
      out.push({
        id: `wf-${channel.id || `${channel.type}-${channel.from}-${channel.to}`}`,
        x1: fromXY.x, y1: fromXY.y, x2: toXY.x, y2: toXY.y,
        style, type: channel.type,
      });
    }
    out.sort((a, b) => (a.style.priority || 0) - (b.style.priority || 0));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaign, placements, showGm, geometryVersion]);

  const edges = useMemo(() => {
    if (!Array.isArray(savedSettlements) || !placements) return [];

    // Build settlementId → burgId lookup. Burg ids are now synthetic strings
    // (e.g. "sf_lq8x7k4p_ab3c"), so keep keys as strings — coercing to Number
    // yields NaN and collapses every placement onto one key.
    const settlementToBurg = new Map();
    for (const [burgIdStr, p] of Object.entries(placements)) {
      if (p?.settlementId) settlementToBurg.set(String(p.settlementId), String(burgIdStr));
    }
    const burgXY = new Map();
    for (const [burgIdStr, p] of Object.entries(placements)) {
      if (typeof p?.x === 'number' && typeof p?.y === 'number') {
        burgXY.set(String(burgIdStr), { x: p.x, y: p.y });
      }
    }

    const out = [];
    const seen = new Set();  // dedupe A↔B reverse pairs
    const allow = Array.isArray(filter) ? new Set(filter) : null;

    for (const save of savedSettlements) {
      const fromId = save?.id || save?.settlement?.id;
      if (!fromId) continue;
      const fromBurg = settlementToBurg.get(String(fromId));
      if (fromBurg == null) continue;
      const fromXY = burgXY.get(fromBurg);
      if (!fromXY) continue;

      // Neighbour data lives on the settlement object as `neighbourNetwork`.
      // Each entry is { id: <partnerSaveId>, name, relationshipType, ... }
      // (SettlementsPanel.jsx writes these on link / on generate).
      const neighbours = save?.settlement?.neighbourNetwork
        || save?.neighbourNetwork
        || save?.neighbourLinks
        || save?.settlement?.neighbourLinks
        || [];
      for (const link of neighbours) {
        const toId = link?.id || link?.targetId;
        const relType = link?.relationshipType || link?.type;
        if (!toId || !relType) continue;
        if (allow && !allow.has(relType)) continue;
        const toBurg = settlementToBurg.get(String(toId));
        if (toBurg == null) continue;
        const toXY = burgXY.get(toBurg);
        if (!toXY) continue;

        // Dedupe symmetric pairs (hierarchical relationships stay asymmetric)
        const pairKey = relType === 'patron' || relType === 'client' || relType === 'vassal'
          ? `${relType}:${fromId}:${toId}`
          : [String(fromId), String(toId)].sort().join('|') + ':' + relType;
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);

        const style = STYLE[relType] || { color: '#888', width: 1.5 };
        out.push({
          id: `${fromId}-${toId}-${relType}`,
          x1: fromXY.x,  y1: fromXY.y,
          x2: toXY.x,    y2: toXY.y,
          relType, style,
        });
      }
    }

    // Stable order: higher priority renders on top (so hostile lines win)
    out.sort((a, b) => (a.style.priority || 0) - (b.style.priority || 0));
    return out;
    // geometryVersion is a deliberate trigger dep — see ChainEdges for the
    // same pattern. We want this memo to recompute when geometry rolls
    // even though the body doesn't reference geometryVersion directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSettlements, placements, filter, geometryVersion]);

  if (!edges.length && !warFaithEdges.length) return null;

  return (
    <g className="sf-relationship-edges" pointerEvents="none">
      {edges.map(e => (
        <g key={e.id}>
          <line
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.style.color}
            strokeWidth={e.style.width}
            strokeOpacity={0.72}
            strokeLinecap="round"
            strokeDasharray={e.style.dash || undefined}
          />
          {e.style.arrow && (
            <circle
              cx={(e.x1 + e.x2) / 2}
              cy={(e.y1 + e.y2) / 2}
              r={2.5}
              fill={e.style.color}
              fillOpacity={0.9}
            />
          )}
        </g>
      ))}
      {/* §S3 — pulse-minted war_front / religious_authority fronts (visibility-honored). */}
      {warFaithEdges.map(e => (
        <g key={e.id} className={`sf-war-faith-edge sf-${e.type}`}>
          <line
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.style.color}
            strokeWidth={e.style.width}
            strokeOpacity={0.8}
            strokeLinecap="round"
            strokeDasharray={e.style.dash || undefined}
          />
          {e.style.arrow && (
            <circle
              cx={(e.x1 + e.x2) / 2}
              cy={(e.y1 + e.y2) / 2}
              r={3}
              fill={e.style.color}
              fillOpacity={0.95}
            />
          )}
        </g>
      ))}
    </g>
  );
}
