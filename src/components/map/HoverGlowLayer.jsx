/**
 * HoverGlowLayer.jsx — DESK-2's map half of the word↔map linkage: when a WORD
 * surface (a gazetteer row, a herald group header) writes the store's
 * hoveredSettlementId, the matching map marker glows.
 *
 * A SEPARATE tiny layer, deliberately: PlacementsLayer stays UNSUBSCRIBED from
 * hover state (its own design — hover peeks render in QuickInspector), so a
 * hover change re-renders exactly one ring here and zero markers there. Self
 * gates to null when nothing is hovered or the hovered settlement is unplaced.
 * Pointer-events none — the glow is never a hit target.
 */

import { useStore } from '../../store/index.js';
import { GOLD, swatch } from '../theme.js';

export default function HoverGlowLayer() {
  const hoveredId = useStore(s => s.hoveredSettlementId);
  const placements = useStore(s => s.mapState.placements);
  const scale = useStore(s => s.mapState.viewport?.scale || 1);
  if (hoveredId == null || !placements) return null;
  const hit = Object.values(placements).find(p => p && String(p.settlementId) === String(hoveredId));
  if (!hit || typeof hit.x !== 'number' || typeof hit.y !== 'number') return null;
  const r = 12 / (scale || 1);
  return (
    <g data-testid="hover-glow" pointerEvents="none">
      <circle cx={hit.x} cy={hit.y} r={r} fill={GOLD} opacity={0.18} />
      <circle cx={hit.x} cy={hit.y} r={r} fill="none" stroke={GOLD} strokeWidth={1.6 / (scale || 1)} opacity={0.9} />
      <circle cx={hit.x} cy={hit.y} r={r * 0.55} fill="none" stroke={swatch.white} strokeWidth={0.8 / (scale || 1)} opacity={0.7} />
    </g>
  );
}
