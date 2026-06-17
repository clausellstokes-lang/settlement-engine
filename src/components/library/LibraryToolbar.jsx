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

import { X } from 'lucide-react';
import { sans, FS, SP, R, swatch } from '../theme.js';
import { isCanonSave, savePhase } from '../../domain/campaign/canon.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

const BORDER = swatch['#E8D9B0'];
const PARCH = swatch['#FBF5E6'];
const INK = swatch['#1B1408'];
const MUTED = swatch['#9C8068'];

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
    out = out.filter(isCanonSave);
  }
  if (filters.draftOnly) {
    out = out.filter(s => !isCanonSave(s) && savePhase(s) === 'draft');
  }
  if (filters.hasNeighbours) {
    // The neighbour list lives at settlement.neighbourNetwork (mirrored to the
    // Supabase row's neighbour_links); the old top-level save.neighbourLinks
    // field never exists, so this chip always returned nothing.
    out = out.filter(s =>
      (s.settlement?.neighbourNetwork?.length > 0) ||
      (Array.isArray(s.neighbour_links) && s.neighbour_links.length > 0));
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
          aria-label="Search settlements, NPCs, and factions"
          placeholder={`Search ${totalCount} settlement${totalCount === 1 ? '' : 's'} + NPCs + factions…`}
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent', fontFamily: sans,
            fontSize: FS.xs, color: INK,
          }}
        />
        {query && (
          <IconButton
            Icon={X}
            label="Clear search"
            tone="ghost"
            size="sm"
            onClick={() => setQuery('')}
          />
        )}
      </div>

      {/* Sort */}
      <label htmlFor="library-sort" style={{
        display: 'inline-flex', alignItems: 'center', gap: SP.xs,
        padding: '4px 8px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: R.sm,
        cursor: 'pointer',
      }}>
        <span style={{ color: MUTED, fontWeight: 700 }}>Sort:</span>
        <select
          id="library-sort"
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
      <Button
        size="sm"
        variant={filters?.canonOnly ? 'success' : 'secondary'}
        aria-pressed={!!filters?.canonOnly}
        onClick={() => toggleFilter('canonOnly')}
      >
        Canon only
      </Button>
      <Button
        size="sm"
        variant={filters?.hasNeighbours ? 'gold' : 'secondary'}
        aria-pressed={!!filters?.hasNeighbours}
        onClick={() => toggleFilter('hasNeighbours')}
      >
        🔗 Linked
      </Button>

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
