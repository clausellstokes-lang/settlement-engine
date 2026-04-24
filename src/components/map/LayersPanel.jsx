/**
 * LayersPanel — right-side sidebar listing every overlay layer with a
 * checkbox toggle and, where applicable, a filter sub-list.
 *
 * Layers:
 *   - Relationships (with per-type filter: trade_partner, allied, …)
 *   - Supply chains (with per-good filter — optional)
 *   - Labels
 *   - Markers
 *   - Forests
 *   - Native state borders
 *   - Native culture regions
 */

import React from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../../store';
import { GOLD, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, FS, SP, R } from '../theme.js';

const REL_TYPES = [
  { id: 'trade_partner', label: 'Trade partner', color: '#0f766e' },
  { id: 'allied',        label: 'Allied',        color: '#2563eb' },
  { id: 'patron',        label: 'Patron',        color: '#7c3aed' },
  { id: 'client',        label: 'Client',        color: '#7c3aed' },
  { id: 'rival',         label: 'Rival',         color: '#ea580c' },
  { id: 'cold_war',      label: 'Cold war',      color: '#b91c1c' },
  { id: 'hostile',       label: 'Hostile',       color: '#991b1b' },
];

export default function LayersPanel({ onClose }) {
  const layers         = useStore(s => s.mapState.layers);
  const toggleLayer    = useStore(s => s.toggleLayer);
  const setLayerFilter = useStore(s => s.setLayerFilter);

  const relFilter = new Set(Array.isArray(layers.relationshipFilter) ? layers.relationshipFilter : []);

  function toggleRelType(type) {
    const next = new Set(relFilter);
    if (next.has(type)) next.delete(type); else next.add(type);
    setLayerFilter('relationshipFilter', Array.from(next));
  }

  return (
    <div style={{
      width: 240, minHeight: 0,
      display: 'flex', flexDirection: 'column',
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg,
      overflow: 'hidden',
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
          Layers
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: MUTED, padding: 2, display: 'flex', alignItems: 'center',
          }}
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Layer list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: SP.sm }}>
        <LayerToggle
          label="Settlements"
          checked={layers.placements !== false}
          onChange={() => toggleLayer('placements')}
        />
        <LayerToggle
          label="Relationships"
          checked={!!layers.relationships}
          onChange={() => toggleLayer('relationships')}
        />
        {layers.relationships && (
          <div style={{ marginLeft: SP.md, marginBottom: SP.sm }}>
            {REL_TYPES.map(t => (
              <FilterChip
                key={t.id}
                label={t.label}
                color={t.color}
                active={relFilter.has(t.id)}
                onClick={() => toggleRelType(t.id)}
              />
            ))}
          </div>
        )}

        <LayerToggle
          label="Supply chains"
          checked={!!layers.chains}
          onChange={() => toggleLayer('chains')}
        />
        <LayerToggle
          label="Roads"
          checked={!!layers.roads}
          onChange={() => toggleLayer('roads')}
        />
        <LayerToggle
          label="Labels"
          checked={!!layers.labels}
          onChange={() => toggleLayer('labels')}
        />
        <LayerToggle
          label="Markers"
          checked={!!layers.markers}
          onChange={() => toggleLayer('markers')}
        />
        <div style={{ height: 1, background: BORDER2, margin: `${SP.sm}px 0` }} />
        <div style={{
          fontSize: FS.xxs, fontWeight: 700, color: MUTED,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          padding: `0 ${SP.xs}px ${SP.xs}px`,
        }}>
          Map features
        </div>
        <LayerToggle
          label="State borders"
          checked={!!layers.nativeStateBorders}
          onChange={() => toggleLayer('nativeStateBorders')}
        />
        <LayerToggle
          label="Culture regions"
          checked={!!layers.nativeCultureRegions}
          onChange={() => toggleLayer('nativeCultureRegions')}
        />
      </div>
    </div>
  );
}

function LayerToggle({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: SP.xs,
      padding: `${SP.xs}px ${SP.sm}px`,
      cursor: 'pointer', userSelect: 'none',
      borderRadius: R.sm,
      fontSize: FS.sm, color: INK,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#faf6ef')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ accentColor: GOLD, cursor: 'pointer' }}
      />
      <span style={{ fontWeight: 600 }}>{label}</span>
    </label>
  );
}

function FilterChip({ label, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px',
        margin: '2px 3px 2px 0',
        background: active ? color : 'transparent',
        color: active ? '#fff' : INK,
        border: `1px solid ${color}`,
        borderRadius: 12,
        fontSize: FS.xxs, fontWeight: 700, fontFamily: sans,
        cursor: 'pointer',
      }}
    >
      {active && <Check size={9} />}
      {label}
    </button>
  );
}
