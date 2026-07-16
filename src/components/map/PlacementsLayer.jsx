/**
 * PlacementsLayer — renders one TierIcon per settlement placement.
 *
 * Reads `mapState.placements` and looks up each settlement in
 * `savedSettlements` to determine tier, port, and capital flags.
 * Click selects the burg via `setSelectedBurgId`.
 *
 * Subscribes only to placements + saves + selection + viewport scale.
 * Uses pointer-events:auto on each icon group while the surrounding
 * overlay div remains pointer-events:none in view mode, so map pan
 * still works between icons.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../store';
import TierIcon, { tierFor } from './TierIcon.jsx';
import { LIFECYCLE_GLYPH_STYLE } from './lifecycleGlyphStyle.js';

/** Subscribe only to viewport.scale changes for counter-scaling. */
function useViewportScale() {
  const [scale, setScale] = useState(() => useStore.getState().mapState.viewport.scale || 1);
  useEffect(() => {
    return useStore.subscribe(
      s => s.mapState.viewport.scale,
      next => setScale(next || 1),
    );
  }, []);
  return scale;
}

export default function PlacementsLayer({ transformRef }) {
  const placements            = useStore(s => s.mapState.placements);
  const saves                 = useStore(s => s.savedSettlements);
  const selectedBurgId        = useStore(s => s.selectedBurgId);
  const selectedSettlementId  = useStore(s => s.selectedSettlementId);
  const setSelectedBurg       = useStore(s => s.setSelectedBurgId);
  const setSelectedSettlement = useStore(s => s.setSelectedSettlementId);
  const updatePlacement       = useStore(s => s.updatePlacement);
  // P136 / M-6 — hover-peek emitters. These mirror SettlementPalette's
  // list-card hover so the QuickInspector peek fires from the realm-map
  // icons themselves, not only the palette. mapSlice owns both actions.
  const setHovered            = useStore(s => s.setHoveredSettlementId);
  const clearHovered          = useStore(s => s.clearHoveredSettlementId);
  // Placement move-lock: once the active campaign's world is canonized, placed
  // settlements are frozen in place (adding is still allowed elsewhere). We
  // disable drag-to-move here; updatePlacement is the store-level backstop.
  const mapCanonized = useStore(s => {
    const camp = s.campaigns?.find(c => c.id === s.activeCampaignId);
    return !!camp?.worldState?.canonizedAt;
  });
  // W-LIFECYCLE: the active campaign's satellite-steading ledger (keyed by
  // parent settlement id). null for every world without the lifecycle layer —
  // the orbit render below is then a no-op (zero footprint).
  const satellitesLedger = useStore(s => {
    const camp = s.campaigns?.find(c => c.id === s.activeCampaignId);
    return camp?.worldState?.spatialLedgers?.satellites || null;
  });

  // Drag-to-move state for the currently-selected placement.
  // Holds { burgId, pointerId, origin:{sx,sy}, startPt:{x,y} } during drag.
  const dragRef = useRef(null);
  // Transient preview override so the icon follows the cursor without
  // spamming the Immer store on every pointermove.
  const [dragPreview, setDragPreview] = useState(null);

  // Counter-scale icons by viewport zoom. We use the persisted store
  // value (debounced ~500ms by MapOverlay) rather than reading
  // transformRef.current.scale during render — the latter is a
  // react-hooks/refs violation under React Compiler and the visual
  // benefit is sub-perceptible (icons might be the wrong size for up
  // to 500ms during a continuous zoom; same as the gap between samples).
  // transformRef is still used in event handlers (screenToMap), which
  // is the canonical legal use of a ref.
  const scale = useViewportScale() || 1;

  const saveById = useMemo(() => {
    const m = new Map();
    for (const s of saves || []) m.set(s.id, s);
    return m;
  }, [saves]);

  const items = useMemo(() => {
    const out = [];
    for (const [burgId, p] of Object.entries(placements || {})) {
      if (typeof p?.x !== 'number' || typeof p?.y !== 'number') continue;
      const settlement = saveById.get(p.settlementId) || null;
      const tier = tierFor(settlement || { population: p.population });
      // W-LIFECYCLE: a dead settlement KEEPS its cell — drawn as ruins, never
      // removed (geometry survives death). Tolerant read across save shapes.
      const lifecycleStatus = settlement?.lifecycleStatus
        || settlement?.config?.lifecycleStatus
        || settlement?.settlement?.lifecycleStatus
        || settlement?.settlement?.config?.lifecycleStatus
        || '';
      // Generation-seeded ancient (opt-in flavor): a small ruin glyph nearby.
      const ancientRuin = settlement?.history?.ancientRuin
        || settlement?.settlement?.history?.ancientRuin
        || null;
      const sid = p.settlementId != null ? String(p.settlementId) : null;
      const steadingsMap = (sid && satellitesLedger && satellitesLedger[sid]?.steadings) || null;
      const steadings = steadingsMap
        ? Object.keys(steadingsMap).sort().map(k => steadingsMap[k]).filter(Boolean)
        : [];
      out.push({
        burgId,
        settlementId: p.settlementId || null,
        x: p.x, y: p.y,
        tier,
        name: settlement?.name || p.name || '',
        port:    !!(settlement?.tradeRouteAccess === 'port' || settlement?.port),
        capital: !!(settlement?.capital || settlement?.isCapital),
        lifecycleStatus,
        ancientRuin,
        steadings,
      });
    }
    return out;
  }, [placements, saveById, satellitesLedger]);

  if (!items.length) return null;

  // Convert a screen pointer event to FMG map coordinates using the live
  // viewport transform (same math as the overlay's g transform inverse).
  function screenToMap(e) {
    const tf = transformRef?.current || { tx: 0, ty: 0, scale: 1 };
    const svgEl = e.currentTarget?.ownerSVGElement || e.target?.ownerSVGElement;
    if (!svgEl) return null;
    const rect = svgEl.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const s = tf.scale || 1;
    return { x: (sx - tf.tx) / s, y: (sy - tf.ty) / s };
  }

  function handleDragPointerDown(e, it) {
    // Frozen on a canonized map — selection still works, but no move.
    if (mapCanonized) return;
    // Only drag if this icon is already selected — avoids hijacking a fresh
    // click on a non-selected icon (which should just select it).
    const isSelected =
      String(selectedBurgId) === String(it.burgId) ||
      (it.settlementId && String(selectedSettlementId) === String(it.settlementId));
    if (!isSelected) return;
    if (e.button !== undefined && e.button !== 0) return;
    const pt = screenToMap(e);
    if (!pt) return;
    e.stopPropagation?.();
    // A drag is starting — drop any hover-peek so it can't stick mid-drag.
    // Pointer capture (below) suppresses the pointerleave that would otherwise
    // clear it, so clear explicitly here.
    clearHovered?.();
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (_) {}
    dragRef.current = {
      burgId: it.burgId,
      pointerId: e.pointerId,
      origin: { sx: e.clientX, sy: e.clientY },
      startPt: { x: it.x, y: it.y },
      moved: false,
    };
  }

  function handleDragPointerMove(e) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.origin.sx;
    const dy = e.clientY - d.origin.sy;
    // Dead-zone so a small jitter during click doesn't move the icon.
    if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    d.moved = true;
    const pt = screenToMap(e);
    if (!pt) return;
    setDragPreview({ burgId: d.burgId, x: pt.x, y: pt.y });
  }

  function handleDragPointerUp(e) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch (_) {}
    if (d.moved && dragPreview && dragPreview.burgId === d.burgId) {
      updatePlacement(d.burgId, { x: dragPreview.x, y: dragPreview.y });
    }
    dragRef.current = null;
    setDragPreview(null);
  }

  return (
    <g className="sf-placements-layer">
      {items.map(it => {
        const isSelected =
          String(selectedBurgId) === String(it.burgId) ||
          (it.settlementId && String(selectedSettlementId) === String(it.settlementId));
        const preview = (dragPreview && dragPreview.burgId === it.burgId) ? dragPreview : null;
        const x = preview ? preview.x : it.x;
        const y = preview ? preview.y : it.y;
        return (
          <g
            key={it.burgId}
            style={{ pointerEvents: 'auto' }}
            data-hover-settlement-id={it.settlementId || undefined}
            onPointerEnter={(e) => {
              // Hover-peek is a fine-pointer affordance. On touch a tap fires
              // pointerenter with no paired pointerleave, which would leave the
              // QuickInspector peek stuck — so ignore touch. Enter/leave (not
              // over/out) fire once for the whole icon, ignoring transitions
              // between a glyph's sub-shapes (town/city/metropolis have several).
              // QuickInspector's own selection gate suppresses the peek while a
              // settlement is selected, so no selection check is needed here.
              if (e.pointerType === 'touch') return;
              if (!it.settlementId) return;
              setHovered?.(it.settlementId);
            }}
            onPointerLeave={() => clearHovered?.()}
          >
            {/* W-LIFECYCLE: satellite steadings as small ORBIT markers (cosmetic
                placement around the parent — design §0: routing is via-parent;
                the dots are display only, never hit targets). */}
            {it.steadings.length > 0 && (
              <g style={{ pointerEvents: 'none' }} opacity={0.85}>
                {it.steadings.map((rec) => {
                  const angle = ((rec.orbit ?? 0) / 6) * Math.PI * 2 - Math.PI / 2;
                  const rad = 11 / scale;
                  const cx = x + Math.cos(angle) * rad;
                  const cy = y + Math.sin(angle) * rad;
                  const r = (rec.tier === 'hamlet' ? 2.4 : 1.7) / scale;
                  return (
                    <g key={rec.id}>
                      <circle cx={cx} cy={cy} r={r} fill={LIFECYCLE_GLYPH_STYLE.steading.fill} stroke={LIFECYCLE_GLYPH_STYLE.steading.stroke} strokeWidth={0.6 / scale}>
                        <title>{`${rec.name} — ${rec.tier}, ${rec.population} folk${rec.charterPending ? ' (a charter awaits)' : ''}`}</title>
                      </circle>
                      {rec.charterPending && (
                        <circle cx={cx} cy={cy} r={r + 1.4 / scale} fill="none" stroke={LIFECYCLE_GLYPH_STYLE.charterRing.stroke} strokeWidth={0.6 / scale} />
                      )}
                    </g>
                  );
                })}
              </g>
            )}
            {/* W-LIFECYCLE: a generation-seeded ancient relic ruin nearby (opt-in
                flavor) — a small broken-column glyph offset from the marker. */}
            {it.ancientRuin && (
              <g style={{ pointerEvents: 'none' }} opacity={0.7} transform={`translate(${x + 9 / scale}, ${y - 9 / scale}) scale(${1 / scale})`}>
                <title>{`The relic ruin of ${it.ancientRuin.name}`}</title>
                <path d="M -2.6 2 L -1.8 -2.4 L -0.9 2 Z M 0.2 2 L 1 -1.2 L 1.8 2 Z" fill={LIFECYCLE_GLYPH_STYLE.ruin.fill} stroke={LIFECYCLE_GLYPH_STYLE.ruin.stroke} strokeWidth={0.4} />
                <line x1={-3.4} y1={2} x2={3} y2={2} stroke={LIFECYCLE_GLYPH_STYLE.ruin.stroke} strokeWidth={0.5} />
              </g>
            )}
            {(() => {
              const icon = (
                <TierIcon
                  x={x}
                  y={y}
                  tier={it.tier}
                  port={it.port}
                  capital={it.capital}
                  selected={isSelected}
                  scale={scale}
                  label={it.lifecycleStatus
                    ? `${it.name} — ${it.lifecycleStatus === 'relic_ruin' ? 'ruins' : 'abandoned'}`
                    : it.name}
                  cursor={isSelected && !mapCanonized ? 'grab' : 'pointer'}
                  onClick={(e) => {
                    // Suppress the click that fires at pointerup after a drag.
                    if (dragRef.current && dragRef.current.moved) return;
                    e.stopPropagation?.();
                    setSelectedBurg(it.burgId);
                    setSelectedSettlement(it.settlementId);
                  }}
                  onPointerDown={(e) => handleDragPointerDown(e, it)}
                  onPointerMove={handleDragPointerMove}
                  onPointerUp={handleDragPointerUp}
                  onPointerCancel={handleDragPointerUp}
                />
              );
              // W-LIFECYCLE: a remnant draws dimmed (ruins). The wrapper is
              // CONDITIONAL so a living settlement keeps TierIcon's group as the
              // wrapper's first descendant <g> (the drag-handler contract the
              // hover-peek test pins).
              return it.lifecycleStatus ? <g opacity={0.45}>{icon}</g> : icon;
            })()}
          </g>
        );
      })}
    </g>
  );
}
