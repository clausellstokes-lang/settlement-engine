/**
 * SettlementPalette — left sidebar showing the available settlements that
 * can be dragged onto the map. Each card is a draggable element with the
 * settlement's id/name/population encoded in its dataTransfer payload.
 *
 * Placed settlements show a "placed" badge and are visually muted.
 */

import React, { useMemo, useState } from 'react';
import { MapPin, Search, GripVertical } from 'lucide-react';
import { useStore } from '../../store';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, FS, SP, R } from '../theme.js';

export default function SettlementPalette({ saves = [], placements = {}, activeCampaign }) {
  const [query, setQuery] = useState('');
  const setSelectedBurgId = useStore(s => s.setSelectedBurgId);

  // Map settlementId → placed-at burgId so we can mark cards
  const placedSettlements = useMemo(() => {
    const set = new Set();
    for (const p of Object.values(placements || {})) {
      if (p?.settlementId) set.add(String(p.settlementId));
    }
    return set;
  }, [placements]);

  const filtered = useMemo(() => {
    if (!query.trim()) return saves;
    const q = query.trim().toLowerCase();
    return saves.filter(s => {
      const name = (s.name || s.settlement?.name || '').toLowerCase();
      return name.includes(q);
    });
  }, [saves, query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
      }}>
        <div style={{
          fontSize: FS.xs, fontWeight: 800, color: SECOND,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
        }}>
          {activeCampaign ? activeCampaign.name : 'All Settlements'}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={12} color={MUTED}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            style={{
              width: '100%',
              padding: '6px 8px 6px 26px',
              border: `1px solid ${BORDER}`,
              borderRadius: R.sm,
              fontSize: FS.xs, fontFamily: sans,
              background: CARD,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: SP.sm }}>
        {!filtered.length ? (
          <div style={{
            padding: SP.md, textAlign: 'center',
            fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
          }}>
            {saves.length === 0
              ? 'No settlements yet. Generate one on the Create tab.'
              : 'No matches.'}
          </div>
        ) : (
          filtered.map(save => (
            <SettlementCard
              key={save.id}
              save={save}
              placed={placedSettlements.has(String(save.id))}
              onClick={() => setSelectedBurgId(null)}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: `${SP.xs}px ${SP.md}px`,
        borderTop: `1px solid ${BORDER2}`,
        fontSize: FS.xxs, color: MUTED, fontStyle: 'italic',
        textAlign: 'center',
      }}>
        Drag a card onto the map to place it.
      </div>
    </div>
  );
}

function SettlementCard({ save, placed }) {
  const name = save.name || save.settlement?.name || 'Untitled';
  const tier = save.tier || save.settlement?.tier || '—';
  const pop  = save.settlement?.population || 0;

  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/settlementforge', JSON.stringify({
      id: save.id,
      name,
      population: pop,
      tier,
    }));
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        display: 'flex', alignItems: 'center', gap: SP.xs,
        padding: `${SP.xs}px ${SP.sm}px`,
        marginBottom: 4,
        background: placed ? GOLD_BG : CARD,
        border: `1px solid ${placed ? GOLD : BORDER}`,
        borderRadius: R.sm,
        cursor: 'grab',
        opacity: placed ? 0.75 : 1,
        fontSize: FS.sm, fontFamily: sans, color: INK,
        transition: 'background 0.12s, transform 0.08s',
      }}
      onMouseDown={e => (e.currentTarget.style.cursor = 'grabbing')}
      onMouseUp={e => (e.currentTarget.style.cursor = 'grab')}
    >
      <GripVertical size={12} color={MUTED} />
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          fontWeight: 700, fontSize: FS.sm,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {name}
        </div>
        <div style={{ fontSize: FS.xxs, color: SECOND }}>
          {tier} · {pop.toLocaleString()}
        </div>
      </div>
      {placed && (
        <MapPin size={12} color={GOLD} title="Placed on map" />
      )}
    </div>
  );
}
