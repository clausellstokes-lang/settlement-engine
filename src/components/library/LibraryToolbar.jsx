/**
 * LibraryToolbar.jsx — P108 / E-6 campaign-aware library toolbar.
 *
 * Drops above the saves list in SettlementsPanel. Renders:
 *   - Search input (filters by name, tier, settlement.config.tradeRouteAccess)
 *   - Sort dropdown (recent / name / tier)
 *   - Filter chips (phase: canon / draft, has-neighbours, has-pending-edits)
 *
 * Pure controlled component — owns no state. The parent (SettlementsPanel)
 * holds {query, sort, filters} and passes setters in. Output is consumed
 * by `applyLibraryFilters(saves, state)` (exported below for shared use
 * + tested in isolation).
 *
 * Rendered by the parent (SettlementsPanel) above the saves list
 * whenever the user has at least one save.
 */

import { sans, FS, SP, R, swatch } from '../theme.js';

const BORDER = '#E8D9B0';
const PARCH = '#FBF5E6';
const INK = '#1B1408';
const MUTED = '#9C8068';
const GOLD = '#C9A24C';
const GOLD_BG = 'rgba(201,162,76,0.10)';

/** Sort options. Stable keys; renames break callers. */
export const SORT_OPTIONS = Object.freeze({
  recent: { label: 'Recent', compare: (a, b) =>
    Number(b.savedAt || b.campaignState?.editedAt || 0) -
    Number(a.savedAt || a.campaignState?.editedAt || 0) },
  name:   { label: 'Name',   compare: (a, b) =>
    String(a.name || '').localeCompare(String(b.name || '')) },
  tier:   { label: 'Tier',   compare: (a, b) => {
    const order = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 6 };
    return (order[a.tier] ?? 99) - (order[b.tier] ?? 99);
  } },
});

/**
 * Pure pipeline: query → sort → filter → result list.
 * Exported so SettlementsPanel can reuse it and tests can pin behavior.
 */
export function applyLibraryFilters(saves, { query = '', sort = 'recent', filters = {} } = {}) {
  if (!Array.isArray(saves)) return [];
  let out = saves;

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    out = out.filter(s => {
      const fields = [
        s.name,
        s.tier,
        s.settlement?.name,
        s.settlement?.config?.tradeRouteAccess,
        // NPC names — searchable per the critique ("search across saves + NPCs + factions")
        ...(Array.isArray(s.settlement?.npcs)
          ? s.settlement.npcs.map(n => n.name).slice(0, 50)
          : []),
        // Faction names
        ...(Array.isArray(s.settlement?.factions)
          ? s.settlement.factions.map(f => f.faction || f.name).slice(0, 20)
          : []),
      ];
      return fields.some(f => typeof f === 'string' && f.toLowerCase().includes(q));
    });
  }

  if (filters.canonOnly) {
    out = out.filter(s => (s.settlement?.phase || s.campaignState?.phase) === 'canon');
  }
  if (filters.draftOnly) {
    out = out.filter(s => (s.settlement?.phase || s.campaignState?.phase || 'draft') === 'draft');
  }
  if (filters.hasNeighbours) {
    out = out.filter(s => Array.isArray(s.neighbourLinks) && s.neighbourLinks.length > 0);
  }
  if (filters.hasPendingEdits) {
    out = out.filter(s => s.campaignState?.editedAt && s.campaignState?.editedAt !== s.campaignState?.canonizedAt);
  }

  const sortFn = SORT_OPTIONS[sort]?.compare || SORT_OPTIONS.recent.compare;
  out = [...out].sort(sortFn);

  return out;
}

export default function LibraryToolbar({
  query, setQuery,
  sort, setSort,
  filters, setFilters,
  totalCount,
  visibleCount,
}) {
  const toggleFilter = (key) => setFilters({ ...filters, [key]: !filters[key] });
  const activeFilterCount = Object.values(filters || {}).filter(Boolean).length;

  return (
    <div style={{
      padding: SP.sm,
      background: PARCH,
      border: `1px solid ${BORDER}`,
      borderRadius: R.sm,
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      fontFamily: sans, fontSize: FS.xs, color: INK,
    }}>
      {/* Search */}
      <div style={{
        flex: 1, minWidth: 180,
        display: 'flex', alignItems: 'center', gap: SP.xs,
        padding: '4px 8px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: R.sm,
      }}>
        <span style={{ fontSize: FS.xs, color: MUTED }}>🔍</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${totalCount} settlement${totalCount === 1 ? '' : 's'} + NPCs + factions…`}
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent', fontFamily: sans,
            fontSize: FS.xs, color: INK,
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{
              background: 'transparent', border: 'none',
              color: MUTED, cursor: 'pointer', padding: 0,
              fontSize: FS.md, lineHeight: 1,
            }}
          >×</button>
        )}
      </div>

      {/* Sort */}
      <label style={{
        display: 'inline-flex', alignItems: 'center', gap: SP.xs,
        padding: '4px 8px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: R.sm,
        cursor: 'pointer',
      }}>
        <span style={{ color: MUTED, fontWeight: 700 }}>Sort:</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: sans, fontSize: FS.xs, color: INK, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
            <option key={key} value={key}>{opt.label}</option>
          ))}
        </select>
      </label>

      {/* Phase chips */}
      <button
        type="button"
        onClick={() => toggleFilter('canonOnly')}
        style={{
          padding: '4px 9px',
          background: filters?.canonOnly ? 'rgba(74,122,58,0.10)' : '#fff',
          border: `1px solid ${filters?.canonOnly ? '#4A7A3A' : BORDER}`,
          borderRadius: R.sm,
          fontSize: FS.xs, fontWeight: 700,
          color: filters?.canonOnly ? '#4A7A3A' : MUTED,
          cursor: 'pointer', fontFamily: sans,
        }}
      >
        Canon only
      </button>
      <button
        type="button"
        onClick={() => toggleFilter('hasNeighbours')}
        style={{
          padding: '4px 9px',
          background: filters?.hasNeighbours ? GOLD_BG : '#fff',
          border: `1px solid ${filters?.hasNeighbours ? GOLD : BORDER}`,
          borderRadius: R.sm,
          fontSize: FS.xs, fontWeight: 700,
          color: filters?.hasNeighbours ? '#8C6F32' : MUTED,
          cursor: 'pointer', fontFamily: sans,
        }}
      >
        🔗 Linked
      </button>

      {/* Result count */}
      <span style={{
        marginLeft: 'auto',
        fontSize: FS.xs, color: MUTED,
      }}>
        {visibleCount === totalCount
          ? `${totalCount} settlement${totalCount === 1 ? '' : 's'}`
          : `${visibleCount} of ${totalCount}`}
        {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'}`}
      </span>
    </div>
  );
}
