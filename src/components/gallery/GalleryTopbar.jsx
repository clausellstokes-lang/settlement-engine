import { GALLERY_SORT_OPTIONS } from '../../lib/gallery.js';
import {
  BORDER, CARD, BODY, FS, INK, SP, sans } from '../theme.js';

/**
 * The search + sort + result-count strip shared by all three gallery tabs
 * (Settlements / Maps / Campaigns). The Settlements tab keeps the defaults; the
 * Maps and Campaigns tabs pass their own noun + the server-honored sort catalog
 * (MAP_SORT_OPTIONS) so the SAME single aria-live count region and control
 * layout serve every tab. `noun` is the singular ('settlement' | 'map' |
 * 'campaign'); `countQualifier` is the count adjective ('public' for the
 * community feed, 'shared' for the maps/campaigns feeds).
 */
export default function GalleryTopbar({
  search, setSearch, sort, setSort, total, loading, disabled = false,
  sortOptions = GALLERY_SORT_OPTIONS,
  noun = 'settlement',
  countQualifier = 'public',
}) {
  const nounPlural = `${noun}s`;
  return (
    <div className="gallery-topbar" style={{
      display: 'grid',
      gap: SP.sm,
      alignItems: 'center',
      marginBottom: SP.md,
    }}>
      <label htmlFor="gallery-search" style={{ position: 'relative', minWidth: 0 }}>
        <input
          id="gallery-search"
          type="search"
          aria-label={`Search ${nounPlural}`}
          aria-describedby={disabled ? 'gallery-search-off' : undefined}
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder={`Search ${nounPlural}`}
          disabled={disabled}
          style={{
            width: '100%',
            minHeight: 44,
            boxSizing: 'border-box',
            padding: '8px 10px',
            border: `1px solid ${BORDER}`,
            background: CARD,
            color: INK,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
          }}
        />
      </label>
      <select
        value={sort}
        onChange={event => setSort(event.target.value)}
        aria-label={`Sort ${nounPlural}`}
        style={{
          minHeight: 44,
          border: `1px solid ${BORDER}`,
          background: CARD,
          color: INK,
          fontFamily: sans,
          fontSize: FS.sm,
          fontWeight: 850,
          padding: '8px 10px',
        }}
      >
        {sortOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      {/* The single polite live region for list-load status: always mounted, its
          text transitions 'Loading <nouns>...' → 'N <qualifier> <noun(s)>'
          across first load, query change, and load-more. The list/detail
          skeletons stay aria-hidden so the load is announced exactly once. */}
      <div className="sf-readable-strip" role="status" aria-live="polite" style={{
        gridColumn: '1 / -1',
        color: BODY,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 850,
        justifySelf: 'start',
      }}>
        {loading ? `Loading ${nounPlural}...` : `${total ?? 0} ${countQualifier} ${noun}${total === 1 ? '' : 's'}`}
      </div>
      {/* "My Settlements" mode swaps to the owner-scoped feed, which the search
          field cannot filter — disable it and surface the cause next to the
          control so the disabled state reads as intentional, not broken. */}
      {disabled && (
        <div id="gallery-search-off" style={{
          gridColumn: '1 / -1',
          color: BODY,
          fontFamily: sans,
          fontSize: FS.xs,
          fontWeight: 750,
          justifySelf: 'start',
        }}>
          Search is off in your {nounPlural}
        </div>
      )}
    </div>
  );
}
