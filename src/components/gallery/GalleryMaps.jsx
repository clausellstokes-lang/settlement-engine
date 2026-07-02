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
import useIsMobile from '../../hooks/useIsMobile.js';
import { useStore } from '../../store';
import { isCanonSave } from '../../domain/campaign/canon.js';
import { fetchGalleryMaps, fetchGalleryMap } from '../../lib/gallery.js';
import Button from '../primitives/Button.jsx';
import {
  INK, INK_DEEP, BODY, SECOND, BORDER, CARD, CARD_ALT, CARD_HDR, PARCH,
  GREEN, GREEN_BG, RED, RED_BG,
  sans, serif_, SP, R, FS,
} from '../theme.js';
import { GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import { activeMapFilterCount, deriveTagVocabulary, emptyMapFilters, MAP_SORT_OPTIONS, ownedCampaignBySlug } from './galleryMapsUtils.js';
import GalleryMapsSidebar from './GalleryMapsSidebar.jsx';
import MapShareEditor from './MapShareEditor.jsx';
import MapGalleryDetail from './MapGalleryDetail.jsx';

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
  // Mobile is a read + import surface for maps: the dense owner inline-editor
  // (name/description/tags/importable/unpublish) is gated to desktop. View and
  // Import stay live on mobile.
  const isMobile = useIsMobile();
  const auth = useStore(s => s.auth);
  const campaigns = useStore(s => s.campaigns);
  const saves = useStore(s => s.savedSettlements);
  const importGalleryMap = useStore(s => s.importGalleryMap);
  const importGalleryMapWithCampaign = useStore(s => s.importGalleryMapWithCampaign);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const isPremium = auth?.tier === 'premium' || auth?.role === 'developer' || auth?.role === 'admin';

  // Owner gate: the gallery tiles are anonymized, so ownership is proven
  // entirely from the user's own loaded campaigns — a tile is editable only when
  // one of them is currently public under that tile's slug. Anonymous users have
  // no matching campaigns, so Edit never shows.
  const ownedBySlug = useMemo(() => ownedCampaignBySlug(campaigns), [campaigns]);

  // The member view MapShareEditor reads for an owned tile: the campaign's member
  // settlements shaped as { name, tier, settlement }, canon-only so the list
  // matches the deployed map. A save row already carries name/tier and the
  // settlement payload, so the shape is a straight projection. Empty when the
  // user's saves haven't loaded on this surface (the editor still publishes a
  // map-only share; the campaign option just stays disabled).
  const membersForCampaign = useCallback((owned) => {
    if (!owned) return [];
    const ids = new Set(owned.settlementIds || []);
    return (saves || [])
      .filter(s => ids.has(s.id) && isCanonSave(s))
      .map(s => ({ name: s.name, tier: s.tier, settlement: s.settlement }));
  }, [saves]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importingSlug, setImportingSlug] = useState(null);
  const [notice, setNotice] = useState(null);

  // Owner edit state. editingSlug opens the MapShareEditor for one owned tile;
  // the editor owns its own publish / details / unshare draft and truth, so no
  // local draft or unpublish-confirm state lives here anymore.
  const [editingSlug, setEditingSlug] = useState(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data-load: reset/spinner on slug change
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data-load: spinner/reset on query change
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

  // Open / close the MapShareEditor for an owned tile. The editor reads the owned
  // campaign's authoritative local copy directly (description, tags, kind) and
  // owns its own draft, publish, and unshare flow, so opening is just a slug
  // toggle — no draft seeding here. A successful edit calls onSaved=refreshMaps
  // so the tile reflects the change under the current facets.
  const openEditor = useCallback((slug) => {
    if (!ownedBySlug.get(slug)) return;
    setEditingSlug(slug);
  }, [ownedBySlug]);

  const closeEditor = useCallback(() => {
    setEditingSlug(null);
  }, []);

  return (
    <div style={{ fontFamily: sans }}>
      {/* Unshare lives inside MapShareEditor now (its own Unshare control with a
          confirm), so GalleryMaps no longer raises a standalone unpublish dialog. */}
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

      {/* ── Read-only preview (view a map + its settlements before importing) ──
          Now the shared MapGalleryDetail viewer. get_gallery_map (the preview
          RPC) doesn't project the import opt-in, so eligibility is read from the
          tile that opened this preview (list_gallery_maps does carry it). The
          premium gate stays inside handleImport: a non-premium import click
          reframes as an upgrade next-step rather than a dead-end. */}
      {viewingSlug && (() => {
        const viewingImportable = (items.find(x => x.slug === viewingSlug) || {}).importable === true;
        // Eligibility is the owner opt-in AND a premium viewer (importing creates
        // a campaign, a premium action). A non-premium viewer sees the calm
        // "Import (premium)" upgrade framing rather than a dead-end enabled button,
        // mirroring the settlement gallery. View-only takes precedence in the note.
        const importNotice = !viewingImportable
          ? "The owner shared this map as view-only, so importing isn't available."
          : (!isPremium ? 'Importing maps is a premium feature.' : null);
        return (
          <MapGalleryDetail
            detail={detail}
            loading={detailLoading}
            error={null}
            onBack={() => setViewingSlug(null)}
            onImport={(d) => handleImport(d.slug, d.kind)}
            importBusy={importingSlug === detail?.slug}
            imported={false}
            importEligible={viewingImportable && isPremium}
            importNotice={importNotice}
            onUpgrade={!viewingImportable || isPremium ? undefined : () => onNavigate?.('pricing')}
          />
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
              {/* Show a real picture whenever the row carries one — the auto thumb
                  (image-backdrop OR the captured terrain galleryThumb, via 083/088's
                  thumb_url) OR the owner cover (image_url, the terrain snapshot the
                  share editor auto-seeds). The prior gate required backdrop_kind===
                  'image', which hid EVERY generated-terrain map on the placeholder
                  even when a snapshot existed. */}
              {(m.thumb_url || m.image_url) ? (
                <img src={m.thumb_url || m.image_url} alt={m.name || 'Shared map'} loading="lazy"
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

              {/* Owner editor — the shared MapShareEditor, which owns the full
                  publish / kind-pick / cover / details / unshare flow internally
                  (keyed on the owned campaign id, the saved_maps row id). The FMG
                  bridge is not mounted on the gallery surface, so bridge is null
                  and the cover falls back to file-pick. Desktop only: it is a full
                  authoring form that does not belong in a ~220px tile on a phone,
                  so mobile shows a "manage on desktop" note in its place (below). */}
              {!isMobile && isEditing && owned && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, padding: SP.sm, marginTop: SP.xs, border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD_ALT }}>
                  <MapShareEditor
                    campaign={owned}
                    worldState={owned.worldState}
                    regionalGraph={owned.regionalGraph}
                    members={membersForCampaign(owned)}
                    bridge={null}
                    ownerId={auth?.user?.id}
                    galleryImageUrl={owned.galleryImageUrl}
                    galleryImageAlt={owned.galleryImageAlt}
                    galleryImportable={m.importable === true}
                    galleryWorldSections={owned.galleryWorldSections}
                    onSaved={refreshMaps}
                  />
                  <Button variant="ghost" size="sm" onClick={closeEditor} style={{ alignSelf: 'flex-start' }}>Close editor</Button>
                </div>
              )}

              {/* On mobile the buttons floor at 44px, so let the row wrap rather
                  than crowd View + Import + the desktop note onto one tight line.
                  Desktop keeps its single nowrap row (byte-identical). */}
              <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.xs, ...(isMobile ? { flexWrap: 'wrap', alignItems: 'center' } : null) }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingSlug(m.slug)}
                  title="Preview this map (and its settlements) before importing"
                >View</Button>
                {canEdit && !isMobile && !isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditor(m.slug)}
                    title="Edit this map's gallery details"
                  >Edit</Button>
                )}
                {/* Mobile owners keep View + Import; managing the listing
                    (rename/description/tags/importable/unpublish) is a desktop
                    task. A calm inline note stands in for the Edit button. */}
                {canEdit && isMobile && (
                  <span
                    title="Edit this map's gallery listing on a larger screen."
                    style={{ alignSelf: 'center', fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 700 }}
                  >
                    Manage on desktop
                  </span>
                )}
                {/* Import is offered only when the owner opted in (migration 072);
                    otherwise the map is view-only. No dead-end button (P9) — the
                    slot shows the status, and the View button still previews it. */}
                {m.importable ? (
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
                ) : (
                  <span
                    title="The owner shared this map as view-only — importing isn't available."
                    style={{ flex: 1, alignSelf: 'center', textAlign: 'center', fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 700 }}
                  >
                    View-only
                  </span>
                )}
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
