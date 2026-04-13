/**
 * ControlsStrip — Shared sticky controls header for Institutions, Services, and Trade Dynamics.
 * Renders: search input, action buttons (Force All / Reset / Exclude All / Expand / Collapse),
 * stats row (No overrides active | X forced · Y excluded), and filter pills (All / Forced / Excluded).
 */
import React from 'react';
import {Search, X} from 'lucide-react';
import {GOLD, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans} from './theme.js';

export default function ControlsStrip({
  // Search
  search, setSearch, placeholder = 'Search…',
  // Action buttons
  onForceAll, onReset, onExcludeAll,
  onExpandAll, onCollapseAll,
  // Counts for stats row
  forcedCount = 0, excludedCount = 0,
  // Filter pills
  filterMode = 'all', setFilterMode,
  // Optional extras
  tier,               // shows ALL TIERS badge if tier==='all'
  showLegend = true,  // shows "Click: Allow → Force → Exclude" legend
  extraStats = null,  // any extra JSX to render in stats row
}) {
  const ForcedPill = forcedCount > 0
    ? <span style={{ color: GOLD, fontWeight: 700 }}>{forcedCount} forced</span>
    : null;
  const ExcludedPill = excludedCount > 0
    ? <span style={{ color: '#c04040' }}>{excludedCount} excluded</span>
    : null;

  return (
    <div style={{
      padding: '8px 12px', background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
      display: 'flex', flexDirection: 'column', gap: 6,
      position: 'sticky', top: 0, zIndex: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}>
      {/* Search + action buttons */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 120px', minWidth: 100 }}>
          <Search size={12} style={{ position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)', color: MUTED, pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', padding: '5px 8px 5px 24px', border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 11.5, background: `rgba(250,248,244,0.97)`, color: INK, boxSizing: 'border-box', fontFamily: sans }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 0, lineHeight: 1 }}>
              <X size={11} />
            </button>
          )}
        </div>
        <button onClick={onForceAll} style={btnStyle(`1px solid ${GOLD}`, `${GOLD}18`, GOLD, 700)}>Force All</button>
        <button onClick={onReset} style={btnStyle(`1px solid ${BORDER}`, `rgba(250,248,244,0.97)`, SECOND, 700)}>Reset</button>
        <button onClick={onExcludeAll} style={btnStyle('1px solid #e8b0b0', '#fdf4f4', '#8b1a1a', 700)}>Exclude All</button>
        {(onExpandAll || onCollapseAll) && <span style={{ width: 1, height: 18, background: '#d0c0a8', flexShrink: 0 }} />}
        {onExpandAll  && <button onClick={onExpandAll}  style={btnStyle(`1px solid ${BORDER}`, `rgba(250,248,244,0.97)`, SECOND, 700)}>Expand All</button>}
        {onCollapseAll && <button onClick={onCollapseAll} style={btnStyle(`1px solid ${BORDER}`, `rgba(250,248,244,0.97)`, SECOND, 700)}>Collapse All</button>}
      </div>

      {/* Stats + filter pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: MUTED }}>
          {forcedCount === 0 && excludedCount === 0
            ? 'No overrides active'
            : <>{ForcedPill}{forcedCount > 0 && excludedCount > 0 && ' · '}{ExcludedPill}</>
          }
        </span>
        {setFilterMode && ['all', 'forced', 'excluded'].map(m => (
          <button key={m} onClick={() => setFilterMode(m)} style={{
            fontSize: 10, fontWeight: filterMode === m ? 700 : 500,
            padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
            border: `1px solid ${filterMode === m ? GOLD : BORDER}`,
            background: filterMode === m ? `${GOLD}20` : `rgba(250,248,244,0.97)`,
            color: filterMode === m ? GOLD : SECOND, fontFamily: sans,
          }}>
            {m === 'all' ? 'All' : m === 'forced' ? `Forced (${forcedCount})` : `Excluded (${excludedCount})`}
          </button>
        ))}
        {extraStats}
        {tier === 'all' && (
          <span style={{ fontSize: 9, fontWeight: 800, color: '#2a3a7a', background: '#e8ecff', borderRadius: 3, padding: '1px 6px', letterSpacing: '0.04em' }}>
            ALL TIERS
          </span>
        )}
        {showLegend && (
          <span style={{ fontSize: 10, color: SECOND, marginLeft: 'auto' }}>
            Click: <strong>○ Allow</strong> → <strong style={{ color: GOLD }}>◆ Force</strong> → <strong style={{ color: '#c04040' }}>✕ Exclude</strong>
          </span>
        )}
      </div>
    </div>
  );
}

function btnStyle(border, background, color, fontWeight = 500) {
  return {
    padding: '4px 9px', borderRadius: 4, border, background, color,
    fontSize: 10, fontWeight, cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
  };
}
