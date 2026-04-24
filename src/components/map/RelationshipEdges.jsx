/**
 * RelationshipEdges — draws lines between linked settlements, styled by
 * relationship type. Pulls edges from the saved settlements' neighbour
 * blocks and maps them to burg coordinates via mapState.placements.
 *
 * Colors/styles mirror the legend in WorldMap.jsx:
 *   trade_partner → solid teal
 *   allied        → solid blue
 *   patron/client → dashed purple (with direction dot at midpoint)
 *   rival         → dotted orange
 *   cold_war      → dotted red
 *   hostile       → thick solid red
 */

import React, { useMemo } from 'react';
import { useStore } from '../../store';

const STYLE = {
  trade_partner: { color: '#0f766e', width: 2,   dash: null,    priority: 2 },
  allied:        { color: '#2563eb', width: 2.2, dash: null,    priority: 3 },
  patron:        { color: '#7c3aed', width: 2,   dash: '6 3',   priority: 2, arrow: true  },
  client:        { color: '#7c3aed', width: 2,   dash: '6 3',   priority: 2, arrow: false },
  rival:         { color: '#ea580c', width: 1.8, dash: '2 3',   priority: 1 },
  cold_war:      { color: '#b91c1c', width: 1.8, dash: '1 3',   priority: 1 },
  hostile:       { color: '#991b1b', width: 3,   dash: null,    priority: 4 },
};

export default function RelationshipEdges() {
  const savedSettlements = useStore(s => s.savedSettlements);
  const placements       = useStore(s => s.mapState.placements);
  const filter           = useStore(s => s.mapState.layers.relationshipFilter);

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

        // Dedupe symmetric pairs (patron/client kept asymmetric)
        const pairKey = relType === 'patron' || relType === 'client'
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
  }, [savedSettlements, placements, filter]);

  if (!edges.length) return null;

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
    </g>
  );
}
