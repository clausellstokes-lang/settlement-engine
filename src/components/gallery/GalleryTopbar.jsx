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

export default function GalleryTopbar({ search, setSearch, sort, setSort, total, loading }) {
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
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search settlements"
          style={{
            width: '100%',
            minHeight: 38,
            boxSizing: 'border-box',
            padding: '8px 10px 8px 32px',
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
            background: CARD,
            color: INK,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
          }}
        />
      </label>
      <select
        value={sort}
        onChange={event => setSort(event.target.value)}
        style={{
          minHeight: 38,
          border: `1px solid ${BORDER}`,
          borderRadius: R.md,
          background: CARD,
          color: INK,
          fontFamily: sans,
          fontSize: FS.sm,
          fontWeight: 850,
          padding: '8px 10px',
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
    </div>
  );
}
