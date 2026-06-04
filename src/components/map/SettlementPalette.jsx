/**
 * SettlementPalette — left sidebar showing the available settlements that
 * can be dragged onto the map. Each card is a draggable element with the
 * settlement's id/name/population encoded in its dataTransfer payload.
 *
 * Placed settlements show a "placed" badge and are visually muted.
 */

import { useMemo, useState } from 'react';
import { MapPin, Search, GripVertical } from 'lucide-react';
import { useStore } from '../../store';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, FS, SP, R, swatch } from '../theme.js';

export default function SettlementPalette({ saves = [], placements = {}, activeCampaign }) {
  const [query, setQuery] = useState('');
  const setSelectedBurgId = useStore(s => s.setSelectedBurgId);
  // P136 / M-6 — hover on a palette card sets the QuickInspector
  // target so the worldbuilder peeks what they're about to drag.
  const setHover = useStore(s => s.setHoveredSettlementId);
  const clearHover = useStore(s => s.clearHoveredSettlementId);

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
              onHover={(hovering) => {
                if (hovering) setHover?.(save.id);
                else clearHover?.();
              }}
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

// P136 / M-2 — Enriched palette. The card surfaces tier + pop + threat
// + stress so a worldbuilder choosing where to place a settlement sees
// the relevant facts without opening the dossier.
//
// Threat pill colors mirror the dossier header chip palette.
const THREAT_LABEL = {
  frontier: 'Frontier',
  embattled: 'Embattled',
  plagued: 'Plagued',
};
const THREAT_COLOR = {
  frontier: '#C9A24C',
  embattled: '#C87060',
  plagued: '#A23434',
};

function SettlementCard({ save, placed, onHover }) {
  const settlement = save.settlement || {};
  const name = save.name || settlement.name || 'Untitled';
  const tier = save.tier || settlement.tier || '—';
  const pop  = settlement.population || 0;
  const threat = settlement.config?.monsterThreat;
  // Stress can be an array (stressors[]) or a single object — both
  // shapes surface a label.
  const stressLabel = (() => {
    const stressors = settlement.stressors;
    if (Array.isArray(stressors) && stressors.length > 0) {
      return stressors[0].label || stressors[0].type || null;
    }
    const stress = settlement.stress;
    if (Array.isArray(stress) && stress.length > 0) {
      return stress[0].label || stress[0].type || null;
    }
    if (stress && typeof stress === 'object') {
      return stress.label || stress.type || null;
    }
    return null;
  })();

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
        display: 'flex', alignItems: 'flex-start', gap: SP.xs,
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
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <GripVertical size={12} color={MUTED} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <div style={{
            fontWeight: 700, fontSize: FS.sm,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            flex: 1, minWidth: 0,
          }}>
            {name}
          </div>
          {placed && (
            <MapPin size={11} color={GOLD} title="Placed on map" />
          )}
        </div>
        <div style={{ fontSize: FS.xxs, color: SECOND, marginTop: 1 }}>
          {tier} · {pop.toLocaleString()}
        </div>
        {(threat || stressLabel) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            marginTop: 3, flexWrap: 'wrap',
          }}>
            {threat && threat !== 'frontier' && (
              <span style={{
                fontSize: FS.xxs, fontWeight: 800,
                color: THREAT_COLOR[threat] || THREAT_COLOR.frontier,
                background: `${THREAT_COLOR[threat] || THREAT_COLOR.frontier}1A`,
                border: `1px solid ${THREAT_COLOR[threat] || THREAT_COLOR.frontier}55`,
                borderRadius: 3, padding: '1px 5px',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {THREAT_LABEL[threat] || threat}
              </span>
            )}
            {stressLabel && (
              <span
                title={`Active stressor: ${stressLabel}`}
                style={{
                  fontSize: FS.xxs, fontWeight: 700,
                  color: swatch['#8A5A20'],
                  background: 'rgba(196,128,60,0.10)',
                  border: '1px solid rgba(196,128,60,0.30)',
                  borderRadius: 3, padding: '1px 5px',
                  maxWidth: 110, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                ⚠ {stressLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
