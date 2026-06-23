/**
 * GalleryMaps.jsx — browse + import shared MAPS.
 *
 * Self-contained (does not use the settlement-shaped useGalleryPageState):
 * fetches public maps via gallery.fetchGalleryMaps, renders anonymized tiles
 * (backdrop thumbnail for image maps), and imports a blank-canvas map into a NEW
 * premium campaign via the importGalleryMap store action. Viewing is free;
 * importing is premium (it creates a campaign).
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '../../store';
import { fetchGalleryMaps, fetchGalleryMap, shareMap, unshareMap } from '../../lib/gallery.js';
import Button from '../primitives/Button.jsx';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import {
  INK, INK_DEEP, BODY, SECOND, BORDER, CARD, CARD_ALT, CARD_HDR, PARCH, PROSE_MAX,
  GREEN, GREEN_BG, RED, RED_BG,
  sans, serif_, SP, R, FS,
} from '../theme.js';
import { GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import { activeMapFilterCount, deriveTagVocabulary, emptyMapFilters, MAP_SORT_OPTIONS, ownedCampaignBySlug } from './galleryMapsUtils.js';
import GalleryMapsSidebar from './GalleryMapsSidebar.jsx';

// Mirror the settlements tab's StatusMessage so the two sibling tabs render the
// same tones/tokens (P10 parity) instead of inline hex fallbacks.
function MapsNotice({ tone = 'info', children }) {
  const cfg = tone === 'ok'
    ? { border: GREEN, bg: GREEN_BG, color: GREEN }
    : { border: RED, bg: RED_BG, color: RED };
  return (
    <div
      role={tone === 'ok' ? 'status' : 'alert'}
      aria-live={tone === 'ok' ? 'polite' : 'assertive'}
      style={{ margin: `0 0 ${SP.md}px`, padding: `${SP.sm}px ${SP.md}px`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, fontWeight: 850, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {children}
    </div>
  );
}

// Skeleton tile grid matching the real maps grid, so first-paint reads as
// loading (not broken) — parity with the settlements tab (P10).
function MapsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading shared maps"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: SP.md }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} aria-hidden="true" style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, minHeight: 220, boxShadow: '0 4px 14px rgba(27,20,8,0.08)' }} />
      ))}
    </div>
  );
}

export default function GalleryMaps({ onNavigate }) {
  const auth = useStore(s => s.auth);
  const campaigns = useStore(s => s.campaigns);
  const renameCampaign = useStore(s => s.renameCampaign);
  const importGalleryMap = useStore(s => s.importGalleryMap);
  const importGalleryMapWithCampaign = useStore(s => s.importGalleryMapWithCampaign);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const isPremium = auth?.tier === 'premium' || auth?.role === 'developer' || auth?.role === 'admin';

  // Owner gate: the gallery tiles are anonymized, so ownership is proven
  // entirely from the user's own loaded campaigns — a tile is editable only when
  // one of them is currently public under that tile's slug. Anonymous users have
  // no matching campaigns, so Edit never shows.
  const ownedBySlug = useMemo(() => ownedCampaignBySlug(campaigns), [campaigns]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importingSlug, setImportingSlug] = useState(null);
  const [notice, setNotice] = useState(null);

  // Owner edit state. editingSlug opens the inline editor for one owned tile;
  // the draft mirrors the owned campaign's authoritative local copy so the form
  // is correct before any refetch. confirmUnpublishSlug gates unpublish.
  const [editingSlug, setEditingSlug] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: '', description: '', tags: '', importable: false });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [confirmUnpublishSlug, setConfirmUnpublishSlug] = useState(null);

  // Filter/search/sort state. Narrowing runs SERVER-SIDE now (list_gallery_maps,
  // migration 065): a change refetches with the active facets. Search is debounced
  // so each keystroke doesn't hit the RPC.
  const [filters, setFilters] = useState(emptyMapFilters);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);
  const toggleBoolFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: !!value }));
  }, []);
  const clearFilters = useCallback(() => {
    setFilters(emptyMapFilters());
    setSearch('');
  }, []);

  const tagVocabulary = useMemo(() => deriveTagVocabulary(items), [items]);
  // Whether any facet or search is active — distinguishes "no shared maps yet"
  // from "no match for the current narrowing" now that the server returns the
  // already-filtered set.
  const hasActiveFacets = activeMapFilterCount(filters) > 0 || !!debouncedSearch.trim();
  // Read-only preview: view a map (and its settlements, if any) before importing.
  const [viewingSlug, setViewingSlug] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!viewingSlug) { setDetail(null); return; }
    let ignore = false;
    setDetailLoading(true); setDetail(null);
    fetchGalleryMap(viewingSlug)
      .then((d) => { if (!ignore) setDetail(d || null); })
      .catch(() => { if (!ignore) setDetail(null); })
      .finally(() => { if (!ignore) setDetailLoading(false); });
    return () => { ignore = true; };
  }, [viewingSlug]);

  // Debounce the search box so each keystroke doesn't refetch (~300ms).
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Refetch with the active facets/search/sort. list_gallery_maps now narrows
  // server-side (migration 065) and caps at 60. Reused as a post-edit refetch so
  // owner edits show under the current facets without an optimistic merge.
  const refreshMaps = useCallback(async () => {
    const r = await fetchGalleryMaps({ page: 0, pageSize: 60, sort, search: debouncedSearch, filters });
    setItems(Array.isArray(r?.items) ? r.items : []);
  }, [sort, debouncedSearch, filters]);

  // Server-side narrowing: refetch whenever the facets, debounced search, or sort
  // change. The empty-vs-no-results distinction reads from whether any facet/search
  // is active, since the server already returned the narrowed set.
  useEffect(() => {
    let ignore = false;
    setLoading(true); setError(null);
    fetchGalleryMaps({ page: 0, pageSize: 60, sort, search: debouncedSearch, filters })
      .then((r) => { if (!ignore) setItems(Array.isArray(r?.items) ? r.items : []); })
      .catch((e) => { if (!ignore) setError(e?.message || 'Could not load shared maps'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [filters, debouncedSearch, sort]);

  const handleImport = useCallback(async (slug, kind) => {
    // P9: a tier cap is a preview, not a dead-end. Reframe the denial as an
    // upgrade next-step with a route to pricing rather than a terminal toast.
    if (!isPremium) { setNotice({ kind: 'upgrade', text: 'Importing maps is a premium feature.' }); return; }
    setImportingSlug(slug); setNotice(null);
    try {
      const id = kind === 'map_with_campaign'
        ? await importGalleryMapWithCampaign(slug)
        : await importGalleryMap(slug);
      setActiveCampaign(id);
      setNotice({ kind: 'ok', text: kind === 'map_with_campaign' ? 'Map + settlements imported into a new campaign.' : 'Map imported into a new campaign.' });
      if (typeof onNavigate === 'function') onNavigate('map');
    } catch (e) {
      setNotice({ kind: 'err', text: e?.message || 'Import failed.' });
    } finally {
      setImportingSlug(null);
    }
  }, [isPremium, importGalleryMap, importGalleryMapWithCampaign, setActiveCampaign, onNavigate]);

  // Open the inline editor for an owned tile, seeding the draft from the owned
  // campaign's authoritative local copy (correct before any server refetch). The
  // import opt-in isn't on the local campaign, so it seeds from the tile's
  // server-projected `importable` (list_gallery_maps, migration 072).
  const openEditor = useCallback((slug, seedImportable = false) => {
    const owned = ownedBySlug.get(slug);
    if (!owned) return;
    setEditError(null);
    setEditDraft({
      name: owned.name || '',
      description: owned.galleryDescription || '',
      tags: Array.isArray(owned.galleryTags) ? owned.galleryTags.join(', ') : '',
      importable: seedImportable === true,
    });
    setEditingSlug(slug);
  }, [ownedBySlug]);

  const closeEditor = useCallback(() => {
    setEditingSlug(null);
    setEditError(null);
  }, []);

  // Save description + tags via publish_map, plus an optional rename when the
  // name changed. All keyed on the owned campaign id (the saved_maps row id),
  // never the slug. Rename writes saved_maps.name through the campaign persist;
  // both rows of truth reflect after the post-action maps refetch.
  const handleSaveEdit = useCallback(async (slug) => {
    const owned = ownedBySlug.get(slug);
    if (!owned) return;
    setEditSaving(true); setEditError(null);
    try {
      const nextName = String(editDraft.name || '').trim();
      if (nextName && nextName !== owned.name) renameCampaign(owned.id, nextName);
      await shareMap(owned.id, {
        kind: owned.shareKind || 'map',
        description: editDraft.description,
        tags: String(editDraft.tags || '').split(',').map(t => t.trim()).filter(Boolean),
        importable: editDraft.importable === true,
      });
      await refreshMaps();
      setEditingSlug(null);
      setNotice({ kind: 'ok', text: 'Map details saved.' });
    } catch (e) {
      setEditError(e?.message || 'Could not save the map details.');
    } finally {
      setEditSaving(false);
    }
  }, [ownedBySlug, editDraft, renameCampaign, refreshMaps]);

  // Unpublish via unpublish_map (owner-gated server-side), then refetch so the
  // tile leaves the gallery.
  const handleUnpublish = useCallback(async (slug) => {
    const owned = ownedBySlug.get(slug);
    setConfirmUnpublishSlug(null);
    if (!owned) return;
    setEditSaving(true); setEditError(null);
    try {
      await unshareMap(owned.id);
      await refreshMaps();
      setEditingSlug(null);
      setNotice({ kind: 'ok', text: 'Map removed from the gallery.' });
    } catch (e) {
      setEditError(e?.message || 'Could not remove the map from the gallery.');
    } finally {
      setEditSaving(false);
    }
  }, [ownedBySlug, refreshMaps]);

  return (
    <div style={{ fontFamily: sans }}>
      <ConfirmDialog
        open={!!confirmUnpublishSlug}
        title="Remove from gallery?"
        body="This unpublishes the map from the public gallery. Your campaign stays in your account, and you can publish it again later."
        confirmLabel="Unpublish"
        cancelLabel="Keep published"
        tone="danger"
        onConfirm={() => handleUnpublish(confirmUnpublishSlug)}
        onCancel={() => setConfirmUnpublishSlug(null)}
      />
      {notice && (
        notice.kind === 'upgrade' ? (
          <MapsNotice tone="err">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
              {notice.text}
              <Button variant="primary" size="sm" onClick={() => onNavigate?.('pricing')}>
                See plans
              </Button>
            </span>
          </MapsNotice>
        ) : (
          <MapsNotice tone={notice.kind === 'ok' ? 'ok' : 'err'}>{notice.text}</MapsNotice>
        )
      )}

      {/* ── Read-only preview (view a map + its settlements before importing) ── */}
      {viewingSlug && (() => {
        const d = detail || {};
        const img = d.backdrop?.customBackdrop?.imageUrl || d.mapState?.customBackdrop?.imageUrl || null;
        const memberList = Array.isArray(d.members) ? d.members : [];
        return (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setViewingSlug(null)} icon={<ChevronLeft size={14} />} style={{ marginBottom: SP.md }}>Back to maps</Button>
            {detailLoading && <p style={{ color: BODY, fontSize: FS.sm }}>Loading preview…</p>}
            {!detailLoading && !d.slug && <p style={{ color: BODY, fontSize: FS.sm }}>This map is no longer available.</p>}
            {!detailLoading && d.slug && (
              <div style={{ maxWidth: PROSE_MAX, border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, overflow: 'hidden' }}>
                <div style={{ background: CARD_ALT, maxHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {img ? (
                    <img src={img} alt={d.name || 'Map'} style={{ maxWidth: '100%', maxHeight: 420, display: 'block' }} />
                  ) : (
                    <div style={{ padding: SP.xl, color: BODY, fontSize: FS.sm, background: PARCH, width: '100%', textAlign: 'center' }}>Generated terrain (renders on import)</div>
                  )}
                </div>
                <div style={{ padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                  <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK_DEEP }}>{d.name || 'Untitled map'}</div>
                  {d.description && <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>{d.description}</div>}
                  {memberList.length > 0 && (
                    <div>
                      <div style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: INK, margin: `${SP.xs}px 0` }}>Settlements ({memberList.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
                        {memberList.map((mm, i) => (
                          <span key={mm.old_id || i} style={{ fontSize: FS.xs, color: SECOND, background: PARCH, border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `2px ${SP.sm}px` }}>
                            {mm.name || 'Settlement'}{mm.tier ? ` · ${mm.tier}` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button variant="primary" size="md" onClick={() => handleImport(d.slug, d.kind)} busy={importingSlug === d.slug}
                    title={isPremium ? 'Import into a new campaign' : 'Importing is a premium feature'}
                    style={{ alignSelf: 'flex-start', marginTop: SP.xs }}>
                    {importingSlug === d.slug ? 'Importing…' : (isPremium ? (d.kind === 'map_with_campaign' ? 'Import map + settlements' : 'Import map') : 'Import (premium)')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {!viewingSlug && (
      <>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <div className="gallery-main-layout" style={{ display: 'grid', gap: SP.lg, alignItems: 'start' }}>
        <GalleryMapsSidebar
          filters={filters}
          tagVocabulary={tagVocabulary}
          onToggleArray={toggleArrayFilter}
          onToggleBool={toggleBoolFilter}
          onClear={clearFilters}
        />
        <main style={{ minWidth: 0 }}>
          {/* Search + sort, mirroring GalleryTopbar tokens (text/glyph only). */}
          <div className="gallery-topbar" style={{ display: 'grid', gap: SP.sm, alignItems: 'center', marginBottom: SP.md }}>
            <label htmlFor="gallery-maps-search" style={{ position: 'relative', minWidth: 0 }}>
              <input
                id="gallery-maps-search"
                type="search"
                aria-label="Search maps"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search maps"
                style={{
                  width: '100%', minHeight: 44, boxSizing: 'border-box', padding: '8px 10px',
                  border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD, color: INK,
                  fontFamily: sans, fontSize: FS.sm, fontWeight: 800, cursor: 'text',
                }}
              />
            </label>
            <select
              value={sort}
              onChange={event => setSort(event.target.value)}
              aria-label="Sort maps"
              style={{
                minHeight: 44, border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD,
                color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 850, padding: '8px 10px', cursor: 'pointer',
              }}
            >
              {MAP_SORT_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <div style={{ gridColumn: '1 / -1', color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, justifySelf: 'start' }}>
              {loading ? 'Loading maps...' : `${items.length} map${items.length === 1 ? '' : 's'}`}
            </div>
          </div>

          {loading && <MapsSkeleton />}
          {error && (
            <MapsNotice tone="err">Could not load maps: {error}</MapsNotice>
          )}
          {!loading && !error && items.length === 0 && !hasActiveFacets && (
            <p style={{ color: BODY, fontSize: FS.sm }}>No shared maps yet. Premium DMs can share a map from the world-map toolbar.</p>
          )}
          {!loading && !error && items.length === 0 && hasActiveFacets && (
            <p style={{ color: BODY, fontSize: FS.sm }}>No maps match these filters. Clear a facet to widen the search.</p>
          )}

          {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: SP.md }}>
        {items.map((m) => {
          // Strict owner gate: editable only when a loaded owned campaign is
          // public under this tile's slug. null for anonymous / non-owners.
          const owned = ownedBySlug.get(m.slug) || null;
          const canEdit = !!owned;
          const isEditing = editingSlug === m.slug;
          return (
          <div key={m.slug} style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 130, background: CARD_ALT, position: 'relative' }}>
              {m.backdrop_kind === 'image' && m.thumb_url ? (
                <img src={m.thumb_url} alt={m.name || 'Shared map'} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BODY, fontSize: FS.xs, background: PARCH }}>
                  Generated terrain
                </div>
              )}
              <span style={{ position: 'absolute', top: 6, right: 6, fontSize: FS.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: SECOND, background: CARD_HDR, border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: '2px 6px' }}>
                {m.kind === 'map_with_campaign' ? 'Map and campaign' : 'Blank map'}
              </span>
            </div>
            <div style={{ padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.xs, flex: 1 }}>
              <div title={m.name || 'Untitled map'} style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK_DEEP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name || 'Untitled map'}</div>
              {m.description && <div style={{ fontSize: FS.xs, color: SECOND, lineHeight: 1.4, maxHeight: 54, overflow: 'hidden' }}>{m.description}</div>}
              {Array.isArray(m.tags) && m.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs, marginTop: 2 }}>
                  {m.tags.slice(0, 4).map((t) => (
                    <span key={t} style={{ fontSize: FS.xs, color: SECOND, background: PARCH, borderRadius: R.sm, padding: '2px 6px' }}>{t}</span>
                  ))}
                </div>
              )}
              {/* Real member count (migration 065). Calm-archivist line, text only;
                  the kind badge above still signals blank vs campaign. */}
              {Number(m.member_count) > 0 && (
                <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 700, marginTop: 2 }}>
                  {m.member_count} settlement{Number(m.member_count) === 1 ? '' : 's'}
                </div>
              )}
              <div style={{ flex: 1 }} />

              {/* Owner inline editor — description, tags, and an optional rename.
                  Mirrors the tile tokens; keyed entirely on the owned campaign. */}
              {isEditing && owned && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, padding: SP.sm, marginTop: SP.xs, border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD_ALT }}>
                  {editError && (
                    <div role="alert" style={{ fontSize: FS.xs, color: RED, fontFamily: sans, fontWeight: 850 }}>{editError}</div>
                  )}
                  <label htmlFor={`gallery-edit-name-${m.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: FS.xs, fontWeight: 850, color: INK, fontFamily: sans }}>Name</span>
                    <input
                      id={`gallery-edit-name-${m.slug}`}
                      type="text"
                      aria-label="Map name"
                      value={editDraft.name}
                      onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                      style={{ minHeight: 36, boxSizing: 'border-box', padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm, background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}
                    />
                  </label>
                  <label htmlFor={`gallery-edit-desc-${m.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: FS.xs, fontWeight: 850, color: INK, fontFamily: sans }}>Description</span>
                    <textarea
                      id={`gallery-edit-desc-${m.slug}`}
                      aria-label="Map description"
                      rows={3}
                      value={editDraft.description}
                      onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))}
                      style={{ boxSizing: 'border-box', padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm, background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 600, resize: 'vertical' }}
                    />
                  </label>
                  <label htmlFor={`gallery-edit-tags-${m.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: FS.xs, fontWeight: 850, color: INK, fontFamily: sans }}>Tags</span>
                    <input
                      id={`gallery-edit-tags-${m.slug}`}
                      type="text"
                      aria-label="Map tags"
                      value={editDraft.tags}
                      onChange={e => setEditDraft(d => ({ ...d, tags: e.target.value }))}
                      placeholder="coastal, trade"
                      style={{ minHeight: 36, boxSizing: 'border-box', padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm, background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}
                    />
                    <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>Separate tags with commas.</span>
                  </label>
                  {/* Owner opt-in: let other DMs import (clone) this map. Off by
                      default (saved_maps.gallery_importable, migration 072). */}
                  <label htmlFor={`gallery-edit-importable-${m.slug}`} style={{ display: 'flex', alignItems: 'flex-start', gap: SP.sm, cursor: 'pointer' }}>
                    <input
                      id={`gallery-edit-importable-${m.slug}`}
                      type="checkbox"
                      aria-label="Allow others to import this map"
                      checked={editDraft.importable === true}
                      onChange={e => setEditDraft(d => ({ ...d, importable: e.target.checked }))}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 700, lineHeight: 1.4 }}>
                      <strong style={{ color: INK }}>Allow others to import this map</strong>. Other DMs can clone it{owned.shareKind === 'map_with_campaign' ? ' and its public-safe settlements' : ''} into their own library. Off by default.
                    </span>
                  </label>
                  <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
                    <Button variant="primary" size="sm" busy={editSaving} onClick={() => handleSaveEdit(m.slug)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={closeEditor}>Cancel</Button>
                    <div style={{ flex: 1 }} />
                    <Button variant="danger" size="sm" onClick={() => setConfirmUnpublishSlug(m.slug)}>Unpublish</Button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.xs }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingSlug(m.slug)}
                  title="Preview this map (and its settlements) before importing"
                >View</Button>
                {canEdit && !isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditor(m.slug, m.importable === true)}
                    title="Edit this map's gallery details"
                  >Edit</Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleImport(m.slug, m.kind)}
                  busy={importingSlug === m.slug}
                  title={isPremium ? 'Import this map into a new campaign' : 'Importing maps is a premium feature'}
                  style={{ flex: 1 }}
                >
                  {importingSlug === m.slug ? 'Importing…' : (isPremium ? 'Import' : 'Import (premium)')}
                </Button>
              </div>
            </div>
          </div>
          );
        })}
          </div>
          )}
        </main>
      </div>
      </>
      )}
    </div>
  );
}
