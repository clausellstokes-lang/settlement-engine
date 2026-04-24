/**
 * PlacementDetailCard — floating card that appears over the map when a
 * settlement placement is selected. Shows key stats and exposes actions:
 *   - Open full settlement detail (navigate to Settlements tab)
 *   - Remove placement from map (keeps the underlying save)
 *   - Deselect (close card)
 *
 * Positioned in the top-right corner of the map viewport so it never overlaps
 * the palette sidebar or layers panel. Click on the map background clears the
 * selection (wired in WorldMap).
 */

import React, { useMemo } from 'react';
import { X, ExternalLink, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import {
  GOLD, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR,
  FS, SP, R,
} from '../theme.js';

export default function PlacementDetailCard({ onOpenDetail }) {
  const selectedSettlementId = useStore(s => s.selectedSettlementId);
  const selectedBurgId       = useStore(s => s.selectedBurgId);
  const placements           = useStore(s => s.mapState.placements);
  const saves                = useStore(s => s.savedSettlements);

  const clearSettlement      = useStore(s => s.clearSelectedSettlementId);
  const clearBurg            = useStore(s => s.clearSelectedBurgId);
  const removePlacement      = useStore(s => s.removePlacementLocal);

  // Resolve the placement + save entry for the current selection
  const { settlement, placementBurgId } = useMemo(() => {
    if (!selectedSettlementId) return { settlement: null, placementBurgId: null };
    const save = (saves || []).find(s => s.id === selectedSettlementId) || null;
    // Also locate which burgId corresponds to this settlement for removal
    let burgId = null;
    for (const [bid, p] of Object.entries(placements || {})) {
      if (p?.settlementId && String(p.settlementId) === String(selectedSettlementId)) {
        burgId = bid;
        break;
      }
    }
    return { settlement: save, placementBurgId: burgId };
  }, [selectedSettlementId, saves, placements]);

  if (!selectedSettlementId || !settlement) return null;

  const s = settlement.settlement || settlement;
  const name  = s.name || settlement.name || 'Untitled';
  const tier  = s.tier || settlement.tier || '—';
  const pop   = s.population || 0;
  const culture = s.culture || s.cultureName || '';
  const terrain = s.terrain || '';

  function handleClose() {
    clearSettlement();
    clearBurg();
  }

  function handleRemove() {
    if (placementBurgId) removePlacement(placementBurgId);
    handleClose();
  }

  function handleOpen() {
    if (typeof onOpenDetail === 'function') onOpenDetail(selectedSettlementId);
  }

  return (
    <div style={{
      position: 'absolute',
      top: SP.md,
      right: SP.md,
      width: 260,
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: R.lg,
      boxShadow: '0 6px 24px rgba(28, 20, 9, 0.18)',
      overflow: 'hidden',
      zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
      }}>
        <div style={{
          fontSize: FS.xs, fontWeight: 800, color: SECOND,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Settlement
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: MUTED, padding: 2, display: 'flex', alignItems: 'center',
          }}
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: `${SP.sm}px ${SP.md}px` }}>
        <div style={{ fontSize: FS.md, fontWeight: 800, color: INK, marginBottom: 2 }}>
          {name}
        </div>
        <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: SP.sm }}>
          {tier}{pop ? ` · ${pop.toLocaleString()} pop` : ''}
        </div>

        {(culture || terrain) && (
          <div style={{ fontSize: FS.xs, color: INK, marginBottom: SP.sm, lineHeight: 1.4 }}>
            {culture && <div><span style={{ color: MUTED }}>Culture:</span> {culture}</div>}
            {terrain && <div><span style={{ color: MUTED }}>Terrain:</span> {terrain}</div>}
          </div>
        )}

        <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
          <button
            onClick={handleOpen}
            style={{
              flex: 1,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: `${SP.xs}px ${SP.sm}px`,
              background: GOLD, color: '#fff',
              border: 'none', borderRadius: R.sm,
              fontSize: FS.xs, fontWeight: 700, cursor: 'pointer',
            }}
            title="Open full detail"
          >
            <ExternalLink size={11} />
            Open
          </button>
          <button
            onClick={handleRemove}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: `${SP.xs}px ${SP.sm}px`,
              background: 'transparent', color: '#991b1b',
              border: `1px solid #f0c8cc`, borderRadius: R.sm,
              fontSize: FS.xs, fontWeight: 700, cursor: 'pointer',
            }}
            title="Remove from map"
          >
            <Trash2 size={11} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
