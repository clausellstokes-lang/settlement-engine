/**
 * RoutesToolbar — contextual toolbar for MAP_MODES.ROUTES.
 *
 * P110 / M-4 + P132 / M-4 promote. When Routes mode is the active map
 * mode, this strip surfaces beneath the mode pills and gives the user:
 *
 *   • A relationship-type filter (Trade / Allied / Patron / Rival /
 *     Hostile) — clicking a chip toggles that edge type on the
 *     relationships layer.
 *   • A supply-chain emphasis toggle — flips the chain layer between
 *     "all chains" and "stressed chains only" (the latter uses the
 *     existing chainFilter slot).
 *   • A "Show roads" toggle for completeness.
 *   • A network-stress hint when supplyChainState reports cascading
 *     failures — this is the "your routes are at risk" red-flag
 *     surface the critique called out.
 *
 * Pure presentational layer over the existing mapSlice. No new
 * persistence; settings round-trip through layers state that already
 * survives reload.
 *
 * Self-mounted by WorldMap.jsx (mapMode === MAP_MODES.ROUTES guard);
 * lazy-loaded so terrain/annotate users never download it.
 */

import { useStore } from '../../store';
import { GOLD, INK, SECOND, BORDER, BORDER2, CARD, MUTED, sans, FS, SP, R, swatch } from '../theme.js';
import { Link as LinkIcon, AlertTriangle, ChevronRight, Eye, EyeOff } from 'lucide-react';

const REL_TYPES = [
  { id: 'trade_partner', label: 'Trade',   color: '#4A7A3A' },
  { id: 'allied',        label: 'Allied',  color: '#2C7DCE' },
  { id: 'patron',        label: 'Patron',  color: '#7B4FCF' },
  { id: 'client',        label: 'Client',  color: '#C9A24C' },
  { id: 'vassal',        label: 'Vassal',  color: '#6D28D9' },
  { id: 'rival',         label: 'Rival',   color: '#D08020' },
  { id: 'cold_war',      label: 'Cold',    color: '#9C8068' },
  { id: 'hostile',       label: 'Hostile', color: '#A23434' },
];

export default function RoutesToolbar() {
  const layers       = useStore(s => s.mapState?.layers);
  const setLayerFilter = useStore(s => s.setLayerFilter);
  const toggleLayer  = useStore(s => s.toggleLayer);
  // Network-stress hint pulls from the active settlement's
  // supplyChainState. There may be zero or more settlements on the
  // map; we surface the WORST one as a single "your network is
  // strained" callout rather than enumerating every burg.
  const activeSettlement = useStore(s => s.settlement);

  const activeFilter = Array.isArray(layers?.relationshipFilter)
    ? layers.relationshipFilter
    : [];

  const toggleRelType = (id) => {
    const next = activeFilter.includes(id)
      ? activeFilter.filter(t => t !== id)
      : [...activeFilter, id];
    setLayerFilter('relationshipFilter', next);
  };

  const showAllRels = () => {
    setLayerFilter('relationshipFilter', REL_TYPES.map(t => t.id));
  };

  const hideAllRels = () => {
    setLayerFilter('relationshipFilter', []);
  };

  // Pull the highest-leverage stress hint without iterating the full
  // map state. A failing supply chain is the canonical "your routes
  // are at risk" beat.
  const failures = activeSettlement?.supplyChainState?.failures || [];
  const topFailure = failures[0];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      padding: `${SP.sm}px ${SP.md}px`,
      background: CARD, borderRadius: R.lg, border: `1px solid ${BORDER}`,
    }}>
      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <LinkIcon size={13} color={GOLD} />
        <span style={{
          fontSize: FS.xs, fontWeight: 800,
          color: GOLD, letterSpacing: '0.08em',
          textTransform: 'uppercase', fontFamily: sans,
        }}>
          Routes
        </span>
      </div>

      <div style={{ width: 1, height: 18, background: BORDER }} />

      {/* Relationship filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {REL_TYPES.map(rt => {
          const active = activeFilter.includes(rt.id);
          return (
            <button
              key={rt.id}
              type="button"
              onClick={() => toggleRelType(rt.id)}
              title={`Toggle ${rt.label} edges`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 8px',
                background: active ? `${rt.color}1A` : 'transparent',
                border: `1px solid ${active ? rt.color : BORDER2}`,
                borderRadius: R.sm,
                color: active ? INK : SECOND,
                fontSize: FS.xs, fontWeight: active ? 700 : 500,
                cursor: 'pointer', fontFamily: sans,
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: 4,
                background: rt.color,
                opacity: active ? 1 : 0.45,
              }} />
              {rt.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={activeFilter.length === REL_TYPES.length ? hideAllRels : showAllRels}
          style={{
            background: 'transparent', border: 'none',
            color: MUTED, fontSize: FS.xs, fontWeight: 500,
            cursor: 'pointer', fontFamily: sans, padding: '3px 6px',
          }}
        >
          {activeFilter.length === REL_TYPES.length ? 'None' : 'All'}
        </button>
      </div>

      <div style={{ width: 1, height: 18, background: BORDER }} />

      {/* Roads toggle */}
      <button
        type="button"
        onClick={() => toggleLayer('roads')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'transparent', border: 'none',
          color: layers?.roads ? INK : MUTED,
          fontSize: FS.xs, fontWeight: 600,
          cursor: 'pointer', fontFamily: sans, padding: '3px 6px',
        }}
        title="Toggle the roads layer"
      >
        {layers?.roads ? <Eye size={11} /> : <EyeOff size={11} />}
        Roads
      </button>

      {/* Chains toggle */}
      <button
        type="button"
        onClick={() => toggleLayer('chains')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'transparent', border: 'none',
          color: layers?.chains ? INK : MUTED,
          fontSize: FS.xs, fontWeight: 600,
          cursor: 'pointer', fontFamily: sans, padding: '3px 6px',
        }}
        title="Toggle the supply-chain layer"
      >
        {layers?.chains ? <Eye size={11} /> : <EyeOff size={11} />}
        Chains
      </button>

      {/* Network-stress callout — pulled to the right so it reads as a
          red flag, not a setting */}
      {topFailure && (
        <div style={{
          marginLeft: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px',
          background: 'rgba(162,52,52,0.08)',
          border: '1px solid rgba(162,52,52,0.35)',
          borderLeft: '3px solid #A23434',
          borderRadius: R.sm,
          fontSize: FS.xs, fontFamily: sans,
        }}>
          <AlertTriangle size={11} color="#A23434" />
          <span style={{ color: swatch['#8A3434'], fontWeight: 700 }}>
            Network stress
          </span>
          <span style={{ color: SECOND }}>
            {topFailure.good ? `${topFailure.good} stalled` : 'a supply line is failing'}
          </span>
          <ChevronRight size={11} color={MUTED} />
        </div>
      )}
    </div>
  );
}
