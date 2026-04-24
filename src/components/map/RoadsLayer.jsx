/**
 * RoadsLayer — SVG layer rendering the derived road network.
 *
 * Pipeline:
 *   1. roadNetwork.computeRoadEdges(saves, placements)  → edge list (React-side)
 *   2. bridge.call('settlementEngine:computeRoadNetwork') → A* polylines (iframe-side)
 *   3. Batched <path> per tier (highway/trade/lane/sea) for perf
 *
 * The geometry comes back in FMG map coordinates, so the layer sits inside
 * the overlay's transformed <g> and follows pan/zoom automatically.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../store';
import { computeRoadEdges } from '../../lib/roadNetwork.js';

const STYLE = {
  highway: { color: '#5a4530', width: 3.2, dash: null,    op: 0.92, shadow: 2.2 },
  trade:   { color: '#7a5f38', width: 2.1, dash: null,    op: 0.85, shadow: 1.6 },
  lane:    { color: '#8a7654', width: 1.1, dash: '4 3',   op: 0.75, shadow: 1.0 },
  sea:     { color: '#3a5a88', width: 1.5, dash: '5 4',   op: 0.80, shadow: 1.2 },
};

const RENDER_ORDER = ['lane', 'trade', 'highway', 'sea'];

function pointsToD(pts) {
  if (!Array.isArray(pts) || pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

export default function RoadsLayer({ bridge }) {
  const saves      = useStore(s => s.savedSettlements);
  const placements = useStore(s => s.mapState.placements);
  const seed       = useStore(s => s.mapState.seed);

  const [paths, setPaths] = useState({});
  const reqIdRef = useRef(0);

  const edges = useMemo(
    () => computeRoadEdges(saves, placements),
    [saves, placements],
  );

  useEffect(() => {
    if (!bridge || !bridge.isReady) { setPaths({}); return; }
    if (!edges.length) { setPaths({}); return; }

    const myReqId = ++reqIdRef.current;
    const payload = edges.map(e => ({
      id: e.id,
      fromX: e.fromX, fromY: e.fromY,
      toX:   e.toX,   toY:   e.toY,
      preferSea: !!e.preferSea,
    }));

    let cancelled = false;
    bridge.call('settlementEngine:computeRoadNetwork', { edges: payload }, { timeout: 20000 })
      .then(reply => {
        if (cancelled || myReqId !== reqIdRef.current) return;
        setPaths(reply?.paths || {});
      })
      .catch(err => {
        if (cancelled || myReqId !== reqIdRef.current) return;
        console.warn('[RoadsLayer] computeRoadNetwork failed', err?.message || err);
        setPaths({});
      });

    return () => { cancelled = true; };
  }, [edges, bridge, seed]);

  if (!edges.length || !Object.keys(paths).length) return null;

  // Group edges by render style (tier, or "sea" if iframe routed via water).
  const byStyle = { highway: [], trade: [], lane: [], sea: [] };
  for (const e of edges) {
    const p = paths[e.id];
    if (!p?.points?.length || p.points.length < 2) continue;
    const key = p.mode === 'sea' ? 'sea' : e.tier;
    if (!byStyle[key]) continue;
    byStyle[key].push(p.points);
  }

  return (
    <g className="sf-roads-layer" pointerEvents="none">
      {RENDER_ORDER.map(key => {
        const polylines = byStyle[key];
        if (!polylines.length) return null;
        const st = STYLE[key];
        const d = polylines.map(pointsToD).filter(Boolean).join(' ');
        if (!d) return null;
        return (
          <g key={key}>
            {/* Soft shadow to give the road some visual depth over terrain */}
            <path
              d={d}
              fill="none"
              stroke={st.color}
              strokeWidth={st.width + st.shadow}
              strokeOpacity={0.22}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main stroke */}
            <path
              d={d}
              fill="none"
              stroke={st.color}
              strokeWidth={st.width}
              strokeOpacity={st.op}
              strokeDasharray={st.dash || undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </g>
  );
}
