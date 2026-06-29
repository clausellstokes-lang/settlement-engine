/**
 * LibraryToolbar.jsx — campaign-aware library toolbar.
 *
 * Drops above the saves list in SettlementsPanel. The DEFAULT face stays
 * uncluttered for a new DM: `Search · Sort · Filters▾ · Select`. All filter chips
 * — including the now-wired orphaned `draftOnly`/`hasPendingEdits` and the new
 * living-world filters (At war / Has deity / In crisis / campaign selector) — live
 * behind the `Filters▾` disclosure.
 *
 * Pure controlled component — owns no state EXCEPT the local Filters▾ open/closed
 * toggle. The parent (SettlementsPanel) holds {query, sort, filters} and passes
 * setters in. Output is consumed by `applyLibraryFilters(saves, state, context)`
 * (exported below for shared use + tested in isolation). The living-world filters
 * (atWar / inCrisis) need a per-save `context` the parent supplies (the resolved
 * worldState + a needsAttention predicate) so the toolbar never recomputes the
 * geopolitical/health state a divergent way.
 *
 * Rendered by the parent (SettlementsPanel) above the saves list
 * whenever the user has at least one save.
 */

import { useState } from 'react';
import { X, SlidersHorizontal, CheckSquare } from 'lucide-react';
import { sans, FS, SP, R, swatch, BORDER, PARCH, INK, MUTED, BODY } from '../theme.js';
import { isCanonSave, savePhase } from '../../domain/campaign/canon.js';
import { settlementSignals, needsAttention, healthPip } from '../settlements/livingWorldSignals.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Segmented from '../primitives/Segmented.jsx';
import BottomSheet from '../primitives/BottomSheet.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';

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
  // "Needs attention" — float strained/critical settlements up. The
  // severity is the worst 4-dim health band (deriveSystemState via healthPip);
  // higher severity = needs more attention = sorts first. Ties fall back to
  // recency so the order stays stable.
  attention: { label: 'Needs attention', compare: (a, b) =>
    (attentionSeverity(b) - attentionSeverity(a)) ||
    (Number(b.savedAt || b.campaignState?.editedAt || 0) - Number(a.savedAt || a.campaignState?.editedAt || 0)) },
});

/** Worst-band severity (0..3) for the "Needs attention" sort, off the settlement's
 *  own derived health. 0 (Stable) when absent — a healthy/sparse save sinks. */
function attentionSeverity(save) {
  const sett = save?.settlement;
  if (!sett) return 0;
  return healthPip(sett)?.severity || 0;
}

/**
 * Pure pipeline: query → filter → sort → result list.
 * Exported so SettlementsPanel can reuse it and tests can pin behavior.
 *
 * @param {Array<any>} saves
 * @param {{ query?: string, sort?: string, filters?: Record<string, any> }} [state]
 * @param {{
 *   liveWorldFor?: (save: any) => ({ worldState: any, regionalGraph: any } | null),
 *   campaignIdFor?: (save: any) => (string | null),
 * }} [context]  Per-save resolvers the living-world filters need (atWar / campaign).
 *   When absent, atWar matches nothing and the campaign filter matches nothing —
 *   so a caller without campaign context degrades to the static filters only.
 */
export function applyLibraryFilters(saves, { query = '', sort = 'recent', filters = {} } = {}, context = {}) {
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
        // NPC names — search spans saves + NPCs + factions, so include them here
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

  // ── Phase / structure filters (existing + the now-WIRED orphaned ones) ──────
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

  // ── Living-world filters ────────────────────────────────────────────────────
  // Has deity is settlement-local (the embedded snapshot), so it needs no context.
  if (filters.hasDeity) {
    out = out.filter(s => !!s.settlement?.config?.primaryDeitySnapshot?.name);
  }
  // In crisis floats off the SAME health derivation as the "Needs attention" sort
  // (deriveSystemState) — a strained/critical band. Pure function of the save.
  if (filters.inCrisis) {
    out = out.filter(s => needsAttention(s.settlement));
  }
  // At war reads the LIVE campaign worldState the parent resolves per save. With
  // no context (e.g. an isolated test without campaign wiring) it matches nothing.
  if (filters.atWar) {
    const liveWorldFor = typeof context.liveWorldFor === 'function' ? context.liveWorldFor : null;
    out = liveWorldFor
      ? out.filter(s => {
          const live = liveWorldFor(s);
          if (!live?.worldState) return false;
          const model = settlementSignals({
            settlement: s.settlement,
            settlementId: s.id,
            worldState: live.worldState,
            regionalGraph: live.regionalGraph,
          });
          return !!model.war;
        })
      : [];
  }
  // Campaign selector — restrict to one campaign's members via the parent resolver.
  if (filters.campaignId) {
    const campaignIdFor = typeof context.campaignIdFor === 'function' ? context.campaignIdFor : null;
    out = campaignIdFor
      ? out.filter(s => String(campaignIdFor(s)) === String(filters.campaignId))
      : [];
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
  campaigns = [],
  selectMode = false,
  onToggleSelectMode,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useIsMobile();
  const toggleFilter = (key) => setFilters({ ...filters, [key]: !filters[key] });

  // Phase segment — a front-line lens over the same canonOnly/draftOnly filter
  // keys the Filters disclosure used to own. 'all' clears both; 'drafts' sets
  // draftOnly (clears canonOnly); 'canon' sets canonOnly (clears draftOnly).
  const phaseValue = filters?.canonOnly ? 'canon' : filters?.draftOnly ? 'drafts' : 'all';
  const setPhase = (id) => setFilters({
    ...filters,
    canonOnly: id === 'canon' || undefined,
    draftOnly: id === 'drafts' || undefined,
  });
  // The campaign selector is a value, not a boolean — count it once if set.
  // canonOnly/draftOnly are surfaced on the front-line All|Drafts|Canon segment,
  // so they no longer count toward the disclosure's hidden-filter badge.
  const activeFilterCount = Object.entries(filters || {})
    .filter(([k, v]) => k !== 'canonOnly' && k !== 'draftOnly' && !!v).length;

  // The phase All|Drafts|Canon lens — a front-line control on desktop, folded
  // into the mobile Filters sheet (so the collapsed mobile toolbar stays Search
  // + Sort + Filters only).
  const phaseSegment = (
    <Segmented
      size="sm"
      ariaLabel="Filter settlements by phase"
      options={[
        { id: 'all', label: 'All' },
        { id: 'drafts', label: 'Drafts' },
        { id: 'canon', label: 'Canon' },
      ]}
      value={phaseValue}
      onChange={setPhase}
    />
  );

  // The secondary filter chips + campaign select + clear-all. Shared verbatim
  // between the desktop inline disclosure and the mobile BottomSheet body, so a
  // chip can never drift between the two surfaces.
  const secondaryFilters = (
    <>
      <Button size="sm" variant={filters?.hasPendingEdits ? 'gold' : 'secondary'} aria-pressed={!!filters?.hasPendingEdits} onClick={() => toggleFilter('hasPendingEdits')} title="Show settlements edited since they were canonized.">Pending edits</Button>
      {/* Structure */}
      <Button size="sm" variant={filters?.hasNeighbours ? 'gold' : 'secondary'} aria-pressed={!!filters?.hasNeighbours} onClick={() => toggleFilter('hasNeighbours')} title="Show settlements linked to a neighbour.">Linked</Button>
      {/* Living world */}
      <Button size="sm" variant={filters?.atWar ? 'danger' : 'secondary'} aria-pressed={!!filters?.atWar} onClick={() => toggleFilter('atWar')} title="Show settlements under siege or besieging a neighbour.">At war</Button>
      <Button size="sm" variant={filters?.hasDeity ? 'gold' : 'secondary'} aria-pressed={!!filters?.hasDeity} onClick={() => toggleFilter('hasDeity')} title="Show settlements with a patron deity.">Has deity</Button>
      <Button size="sm" variant={filters?.inCrisis ? 'danger' : 'secondary'} aria-pressed={!!filters?.inCrisis} onClick={() => toggleFilter('inCrisis')} title="Show settlements in a vulnerable or critical health band.">In crisis</Button>

      {/* Campaign selector */}
      {campaigns.length > 0 && (
        <label htmlFor="library-campaign-filter" style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, minHeight: 44, boxSizing: 'border-box', padding: '8px', background: swatch.white, border: `1px solid ${BORDER}`, borderRadius: R.sm, cursor: 'pointer' }}>
          <span style={{ color: MUTED, fontWeight: 700 }}>Campaign:</span>
          <select
            id="library-campaign-filter"
            value={filters?.campaignId || ''}
            onChange={(e) => setFilters({ ...filters, campaignId: e.target.value || undefined })}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: sans, fontSize: FS.xs, color: INK, fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="">All</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      )}

      {activeFilterCount > 0 && (
        <Button size="sm" variant="ghost" icon={<X size={12} />} onClick={() => setFilters({})}>Clear filters</Button>
      )}
    </>
  );

  // ── Mobile branch ─────────────────────────────────────────────────────────
  // The desktop toolbar packs Search · Sort · phase segment · Filters · Select ·
  // count into one flexWrap row that collapses into a tall ragged stack on a
  // phone, and the inline Filters disclosure wall-wraps. On mobile we keep only
  // Search + Sort + a Filters trigger on the collapsed face, move the phase lens
  // + every secondary filter into a BottomSheet, and stack the Select toggle +
  // count below. Desktop rendering is untouched (it falls through to the
  // original return below).
  if (isMobile) {
    return (
      <div style={{
        padding: SP.sm,
        background: PARCH,
        borderRadius: R.sm,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
        fontFamily: sans, fontSize: FS.xs, color: INK,
      }}>
        {/* Search — full width on its own line so the input isn't squeezed. */}
        <div style={{
          minHeight: 44, boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', gap: SP.xs,
          padding: '8px',
          background: swatch.white,
          border: `1px solid ${BORDER}`,
          borderRadius: R.sm,
        }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search settlements, NPCs, and factions"
            placeholder={`Search ${totalCount} settlement${totalCount === 1 ? '' : 's'}…`}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: sans, fontSize: FS.sm, color: INK }}
          />
          {query && (
            <IconButton Icon={X} label="Clear search" tone="ghost" size="sm" onClick={() => setQuery('')} />
          )}
        </div>

        {/* Sort + Filters trigger — one tidy row that wraps gracefully. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
          <label htmlFor="library-sort-mobile" style={{
            flex: 1, minWidth: 140,
            display: 'inline-flex', alignItems: 'center', gap: SP.xs,
            minHeight: 44, boxSizing: 'border-box',
            padding: '8px',
            background: swatch.white,
            border: `1px solid ${BORDER}`,
            borderRadius: R.sm,
            cursor: 'pointer',
          }}>
            <span style={{ color: MUTED, fontWeight: 700 }}>Sort:</span>
            <select
              id="library-sort-mobile"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: sans, fontSize: FS.sm, color: INK, fontWeight: 600, cursor: 'pointer' }}
            >
              {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                <option key={key} value={key}>{opt.label}</option>
              ))}
            </select>
          </label>

          {/* Filters sheet — the phase lens + every secondary filter live here so
              the collapsed toolbar stays calm. The count badge surfaces active
              secondary filters; the phase lens is shown but not counted (matches
              the desktop badge rule). */}
          <BottomSheet
            title="Filter settlements"
            triggerLabel="Filters"
            count={activeFilterCount}
            triggerVariant={activeFilterCount > 0 ? 'gold' : 'secondary'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, fontFamily: sans, fontSize: FS.sm, color: INK }}>
              <div>
                <div style={{ fontSize: FS.xs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>Phase</div>
                {phaseSegment}
              </div>
              <div
                id="library-filter-panel"
                data-testid="library-filter-panel"
                style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}
              >
                {secondaryFilters}
              </div>
            </div>
          </BottomSheet>
        </div>

        {/* Select toggle + result count — the count is a scan fact (BODY, AA). */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
          {onToggleSelectMode && (
            <Button
              size="sm"
              variant={selectMode ? 'gold' : 'secondary'}
              aria-pressed={selectMode}
              onClick={() => onToggleSelectMode()}
              icon={<CheckSquare size={12} />}
            >
              Select
            </Button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: FS.xs, color: BODY }}>
            {visibleCount === totalCount
              ? `${totalCount} settlement${totalCount === 1 ? '' : 's'}`
              : `${visibleCount} of ${totalCount}`}
            {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      // Tint-only strip (no perimeter border) — matches the demoted, borderless
      // SaveQuotaMeter so the framing band recedes under blur and the town cards
      // below survive as the focal layer. The inner inputs carry their own borders.
      padding: SP.sm,
      background: PARCH,
      borderRadius: R.sm,
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      fontFamily: sans, fontSize: FS.xs, color: INK,
    }}>
      {/* Search */}
      <div style={{
        flex: 1, minWidth: 180, minHeight: 44, boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: SP.xs,
        padding: '8px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: R.sm,
      }}>
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
        minHeight: 44, boxSizing: 'border-box',
        padding: '8px',
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

      {/* Phase segment — front-line All | Drafts | Canon lens. Mutually exclusive,
          so a Segmented pill group reads the three views at a glance where the old
          Canon/Draft chips were buried behind Filters▾. Wired to the same
          canonOnly/draftOnly filter keys; the secondary filters stay in the
          disclosure below. */}
      <Segmented
        size="sm"
        ariaLabel="Filter settlements by phase"
        options={[
          { id: 'all', label: 'All' },
          { id: 'drafts', label: 'Drafts' },
          { id: 'canon', label: 'Canon' },
        ]}
        value={phaseValue}
        onChange={setPhase}
      />

      {/* Filters▾ disclosure — keeps the default toolbar uncluttered for a new DM.
          All chips (incl. the now-wired draftOnly / hasPendingEdits + the new
          living-world filters) live behind this. */}
      <Button
        size="sm"
        variant={filtersOpen || activeFilterCount > 0 ? 'gold' : 'secondary'}
        aria-expanded={filtersOpen}
        aria-controls="library-filter-panel"
        onClick={() => setFiltersOpen(o => !o)}
        icon={<SlidersHorizontal size={12} />}
      >
        Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''} {filtersOpen ? '▴' : '▾'}
      </Button>

      {/* Select (bulk multi-select) toggle */}
      {onToggleSelectMode && (
        <Button
          size="sm"
          variant={selectMode ? 'gold' : 'secondary'}
          aria-pressed={selectMode}
          onClick={() => onToggleSelectMode()}
          icon={<CheckSquare size={12} />}
        >
          Select
        </Button>
      )}

      {/* Result count — BODY (ink-600, 9.95:1), not MUTED (3.57:1, fails AA):
          the visible/total count is a scan fact the GM reads, not chrome (P7). */}
      <span style={{
        marginLeft: 'auto',
        fontSize: FS.xs, color: BODY,
      }}>
        {visibleCount === totalCount
          ? `${totalCount} settlement${totalCount === 1 ? '' : 's'}`
          : `${visibleCount} of ${totalCount}`}
        {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'}`}
      </span>

      {/* ── Filter panel (collapsible) ────────────────────────────────────── */}
      {filtersOpen && (
        <div
          id="library-filter-panel"
          data-testid="library-filter-panel"
          style={{
            flexBasis: '100%', display: 'flex', alignItems: 'center', gap: SP.xs,
            flexWrap: 'wrap', paddingTop: SP.xs, borderTop: `1px solid ${BORDER}`, marginTop: 2,
          }}
        >
          {/* Phase — All | Drafts | Canon now lives on the front-line Segmented
              control above; the disclosure keeps the secondary filters only. */}
          <Button size="sm" variant={filters?.hasPendingEdits ? 'gold' : 'secondary'} aria-pressed={!!filters?.hasPendingEdits} onClick={() => toggleFilter('hasPendingEdits')} title="Show settlements edited since they were canonized.">Pending edits</Button>
          {/* Structure */}
          <Button size="sm" variant={filters?.hasNeighbours ? 'gold' : 'secondary'} aria-pressed={!!filters?.hasNeighbours} onClick={() => toggleFilter('hasNeighbours')} title="Show settlements linked to a neighbour.">Linked</Button>
          {/* Living world */}
          <Button size="sm" variant={filters?.atWar ? 'danger' : 'secondary'} aria-pressed={!!filters?.atWar} onClick={() => toggleFilter('atWar')} title="Show settlements under siege or besieging a neighbour.">At war</Button>
          <Button size="sm" variant={filters?.hasDeity ? 'gold' : 'secondary'} aria-pressed={!!filters?.hasDeity} onClick={() => toggleFilter('hasDeity')} title="Show settlements with a patron deity.">Has deity</Button>
          <Button size="sm" variant={filters?.inCrisis ? 'danger' : 'secondary'} aria-pressed={!!filters?.inCrisis} onClick={() => toggleFilter('inCrisis')} title="Show settlements in a vulnerable or critical health band.">In crisis</Button>

          {/* Campaign selector */}
          {campaigns.length > 0 && (
            <label htmlFor="library-campaign-filter" style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, minHeight: 44, boxSizing: 'border-box', padding: '8px', background: swatch.white, border: `1px solid ${BORDER}`, borderRadius: R.sm, cursor: 'pointer' }}>
              <span style={{ color: MUTED, fontWeight: 700 }}>Campaign:</span>
              <select
                id="library-campaign-filter"
                value={filters?.campaignId || ''}
                onChange={(e) => setFilters({ ...filters, campaignId: e.target.value || undefined })}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: sans, fontSize: FS.xs, color: INK, fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="">All</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          )}

          {activeFilterCount > 0 && (
            <Button size="sm" variant="ghost" icon={<X size={12} />} onClick={() => setFilters({})}>Clear filters</Button>
          )}
        </div>
      )}
    </div>
  );
}
