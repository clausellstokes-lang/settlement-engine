/**
 * ChainEdges — draws supply chain paths between settlements.
 *
 * Chains are DERIVED from savedSettlements + placements at render time (via
 * computeMapChains). No `supplyChains` store slice is needed — the source of
 * truth is the saves themselves, and pairwise edges are cheap to recompute
 * when placements change.
 *
 * Filter: only chains whose `good` is in mapState.layers.chainFilter show.
 */

import React, { useMemo } from 'react';
import { useStore } from '../../store';
import { computeMapChains } from '../../lib/computeMapChains.js';

const GOLD = '#a0762a';

export default function ChainEdges() {
  // Subscribe to minimal primitives; compute derived data in useMemo so the
  // selector returns reference-stable values between renders (avoid #185).
  const saves      = useStore(s => s.savedSettlements);
  const placements = useStore(s => s.mapState.placements);
  const filter     = useStore(s => s.mapState.layers.chainFilter);

  const supplyChains = useMemo(
    () => computeMapChains(saves, placements),
    [saves, placements],
  );

  const paths = useMemo(() => {
    if (!supplyChains.length || !placements) return [];

    const settlementToXY = new Map();
    for (const [burgIdStr, p] of Object.entries(placements)) {
      if (p?.settlementId && typeof p?.x === 'number' && typeof p?.y === 'number') {
        settlementToXY.set(String(p.settlementId), { x: p.x, y: p.y });
      }
    }

    const allow = Array.isArray(filter) && filter.length ? new Set(filter) : null;

    const out = [];
    for (const chain of supplyChains) {
      const good = chain?.good || chain?.resource || 'goods';
      if (allow && !allow.has(good)) continue;
      const path = Array.isArray(chain?.path) ? chain.path : [];
      if (path.length < 2) continue;
      const pts = path
        .map(id => settlementToXY.get(String(id)))
        .filter(Boolean);
      if (pts.length < 2) continue;
      out.push({
        id: chain.id || `chain-${good}-${path[0]}-${path[path.length - 1]}`,
        good,
        pts,
        color: chain.color || GOLD,
      });
    }
    return out;
  }, [supplyChains, placements, filter]);

  if (!paths.length) return null;

  return (
    <g className="sf-chain-edges" pointerEvents="none">
      {paths.map(chain => {
        const d = chain.pts
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
          .join(' ');
        return (
          <g key={chain.id}>
            {/* Shadow halo */}
            <path
              d={d}
              fill="none"
              stroke={chain.color}
              strokeWidth={5}
              strokeOpacity={0.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main path */}
            <path
              d={d}
              fill="none"
              stroke={chain.color}
              strokeWidth={2.5}
              strokeOpacity={0.85}
              strokeDasharray="6 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Good label at midpoint of first segment */}
            {chain.pts.length >= 2 && (
              <text
                x={(chain.pts[0].x + chain.pts[1].x) / 2}
                y={(chain.pts[0].y + chain.pts[1].y) / 2 - 4}
                fontFamily="Georgia, serif"
                fontSize="6"
                fontWeight="700"
                fill={chain.color}
                textAnchor="middle"
                pointerEvents="none"
              >
                {chain.good}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
