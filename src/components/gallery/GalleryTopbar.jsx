import { Search } from 'lucide-react';

import { GALLERY_SORT_OPTIONS } from '../../lib/gallery.js';
import {
  BORDER,
  CARD,
  BODY,
  FS,
  INK,
  MUTED,
  R,
  SP,
  sans,
} from '../theme.js';

export default function GalleryTopbar({ search, setSearch, sort, setSort, total, loading, disabled = false }) {
  return (
    <div className="gallery-topbar" style={{
      display: 'grid',
      gap: SP.sm,
      alignItems: 'center',
      marginBottom: SP.md,
    }}>
      <label htmlFor="gallery-search" style={{ position: 'relative', minWidth: 0 }}>
        <Search size={15} color={MUTED} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          id="gallery-search"
          type="search"
          aria-label="Search settlements"
          aria-describedby={disabled ? 'gallery-search-off' : undefined}
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder={disabled ? 'Search is off in your settlements' : 'Search settlements'}
          disabled={disabled}
          style={{
            width: '100%',
            minHeight: 44,
            boxSizing: 'border-box',
            padding: '8px 10px 8px 32px',
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
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
        aria-label="Sort settlements"
        disabled={disabled}
        style={{
          minHeight: 44,
          border: `1px solid ${BORDER}`,
          borderRadius: R.md,
          background: CARD,
          color: INK,
          fontFamily: sans,
          fontSize: FS.sm,
          fontWeight: 850,
          padding: '8px 10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {GALLERY_SORT_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      <div className="sf-readable-strip" style={{
        gridColumn: '1 / -1',
        color: BODY,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 850,
        justifySelf: 'start',
      }}>
        {loading ? 'Loading settlements...' : `${total ?? 0} public settlement${total === 1 ? '' : 's'}`}
      </div>
      {/* When mine-mode disables search/sort, surface the cause next to the
          controls so the disabled state reads as intentional, not broken — the
          cause (sidebar toggle) is otherwise spatially separated (P2). */}
      {disabled && (
        <div id="gallery-search-off" style={{
          gridColumn: '1 / -1',
          color: BODY,
          fontFamily: sans,
          fontSize: FS.xs,
          fontWeight: 750,
          justifySelf: 'start',
        }}>
          Search and sort are paused while you view your settlements.
        </div>
      )}
    </div>
  );
}
