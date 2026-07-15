/**
 * ControlsStrip — Shared sticky controls header for Institutions, Services, and Trade Dynamics.
 * Renders: search input, action buttons (Force All / Reset / Exclude All / Expand / Collapse),
 * stats row (No overrides active | X forced · Y excluded), and filter pills (All / Forced / Excluded).
 */
import {X} from 'lucide-react';
import { GOLD_TXT, INK, MUTED, SECOND, BORDER, BORDER2, CARD_HDR, sans, FS, swatch } from './theme.js';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';

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
    ? <span style={{ color: GOLD_TXT, fontWeight: 700 }}>{forcedCount} forced</span>
    : null;
  const ExcludedPill = excludedCount > 0
    ? <span style={{ color: swatch['#C04040'] }}>{excludedCount} excluded</span>
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
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            style={{ width: '100%', padding: '5px 24px 5px 8px', border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: FS['11.5'], background: `rgba(250,248,244,0.97)`, color: INK, boxSizing: 'border-box', fontFamily: sans }}
          />
          {search && (
            <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
              <IconButton Icon={X} glyph="×" label="Clear search" tone="ghost" size="sm" onClick={() => setSearch('')} />
            </span>
          )}
        </div>
        <Button onClick={onForceAll} variant="gold" size="sm">Force All</Button>
        <Button onClick={onReset} variant="secondary" size="sm">Reset</Button>
        <Button onClick={onExcludeAll} variant="danger" size="sm">Exclude All</Button>
        {(onExpandAll || onCollapseAll) && <span style={{ width: 1, height: 18, background: swatch['#D0C0A8'], flexShrink: 0 }} />}
        {onExpandAll  && <Button onClick={onExpandAll}  variant="secondary" size="sm">Expand All</Button>}
        {onCollapseAll && <Button onClick={onCollapseAll} variant="secondary" size="sm">Collapse All</Button>}
      </div>

      {/* Stats + filter pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.xxs, color: MUTED }}>
          {forcedCount === 0 && excludedCount === 0
            ? 'No overrides active'
            : <>{ForcedPill}{forcedCount > 0 && excludedCount > 0 && ' · '}{ExcludedPill}</>
          }
        </span>
        {setFilterMode && ['all', 'forced', 'excluded'].map(m => (
          <Button
            key={m}
            onClick={() => setFilterMode(m)}
            variant={filterMode === m ? 'gold' : 'secondary'}
            size="sm"
            aria-pressed={filterMode === m}
          >
            {m === 'all' ? 'All' : m === 'forced' ? `Forced (${forcedCount})` : `Excluded (${excludedCount})`}
          </Button>
        ))}
        {extraStats}
        {tier === 'all' && (
          <span style={{ fontSize: FS.micro, fontWeight: 800, color: swatch.info, background: swatch['#E8ECFF'], borderRadius: 3, padding: '1px 6px', letterSpacing: '0.04em' }}>
            All tiers
          </span>
        )}
        {showLegend && (
          <span style={{ fontSize: FS.xxs, color: SECOND, marginLeft: 'auto' }}>
            Click: <strong>○ Allow</strong> → <strong style={{ color: GOLD_TXT }}>◆ Force</strong> → <strong style={{ color: swatch['#C04040'] }}>✕ Exclude</strong>
          </span>
        )}
      </div>
    </div>
  );
}
