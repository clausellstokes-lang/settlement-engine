// HeraldStrip.jsx — THE PERSISTENT FILTER / FOCUS STRIP (the scaling layer, from the
// search/filter design wf_e940f170). Rides the shell chrome, survives door switches,
// scopes EVERY report door together:
//
//   [ search ]  [ Focused: <name> ✕ ]  [ Needs attention ]  [ Filters (N) ]
//
// FOCUS is the store-global mapSlice.selectedSettlementId (the local edition) — no new
// selection state; a map click or a strip clear round-trips with the map. Search is
// structured (heraldFilter.matchesQuery — over resolved names + the recorded headline,
// never a blind deep-field grep). The facet sheet is an INLINE panel (no floating
// popover, so no Z_LAYERS entry). All facets are typed/frozen (FINITE-SEMANTICS).

import { Search, X, AlertTriangle, SlidersHorizontal } from 'lucide-react';

import { BORDER2, CARD, FS, GOLD, INK, MUTED, SECOND, SP, sans, swatch } from '../theme.js';
import { IconButton } from './IconButton.jsx';

/** The typed severity facet (frozen — never free text). */
const SEVERITY_FACETS = Object.freeze([
  { id: 'critical', label: 'Critical' },
  { id: 'strained', label: 'Strained' },
  { id: 'routine', label: 'Routine' },
]);

/**
 * @param {object} props
 * @param {string} props.query
 * @param {(q: string) => void} props.onQuery
 * @param {string|number|null} props.focusId
 * @param {string} [props.focusName]
 * @param {() => void} props.onClearFocus
 * @param {boolean} props.attentionOn
 * @param {() => void} props.onToggleAttention
 * @param {string|null} props.band
 * @param {(b: string|null) => void} props.onBand
 * @param {boolean} props.showFilters
 * @param {() => void} props.onToggleFilters
 */
export default function HeraldStrip({ query, onQuery, focusId, focusName, onClearFocus, attentionOn, onToggleAttention, band, onBand, showFilters, onToggleFilters }) {
  const activeFilterCount = (band ? 1 : 0);
  return (
    <div role="search" aria-label="Search and filter the realm" style={{ display: 'grid', gap: SP.xs }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 120, border: `1px solid ${BORDER2}`, background: CARD, padding: '2px 6px' }}>
          <Search size={13} color={MUTED} />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search the realm…"
            aria-label="Search the realm"
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', outline: 'none', color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, minHeight: 24 }}
          />
          {query && (
            <IconButton onClick={() => onQuery('')} aria-label="Clear search" size="sm"><X size={12} /></IconButton>
          )}
        </div>
        <IconButton onClick={onToggleAttention} aria-pressed={attentionOn} aria-label="Only what needs a decision now" active={attentionOn} size="sm">
          <AlertTriangle size={12} /> Attention
        </IconButton>
        <IconButton onClick={onToggleFilters} aria-pressed={showFilters} aria-label="Facet filters" active={showFilters} size="sm">
          <SlidersHorizontal size={12} /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
        </IconButton>
      </div>

      {focusId != null && (
        <div data-testid="herald-focus-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', border: `1px solid ${GOLD}`, background: CARD, padding: '2px 6px' }}>
          <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Focused</span>
          <span style={{ color: swatch['#A0762A'], fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>{focusName || String(focusId)}</span>
          <IconButton onClick={onClearFocus} aria-label="Clear focus" size="sm"><X size={12} /></IconButton>
        </div>
      )}

      {showFilters && (
        <div data-testid="herald-facet-sheet" style={{ display: 'grid', gap: 6, border: `1px solid ${BORDER2}`, background: CARD, padding: SP.sm }}>
          <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SEVERITY_FACETS.map(f => (
              <IconButton key={f.id} onClick={() => onBand(band === f.id ? null : f.id)} aria-pressed={band === f.id} active={band === f.id} size="sm">
                {f.label}
              </IconButton>
            ))}
            {band && (
              <IconButton onClick={() => onBand(null)} aria-label="Clear filters" size="sm"><X size={12} /> Clear</IconButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
