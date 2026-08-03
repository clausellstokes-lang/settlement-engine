/**
 * GalleryCampaigns.jsx — the CAMPAIGNS gallery tab (GALLERY-2 phase 2).
 *
 * Campaign shares (share_kind = 'map_with_campaign') were previously interleaved
 * into the Maps grid as a badge variant with no campaign-level presentation.
 * This tab gives them first-class anatomy:
 *
 *   • the card — cover/thumb, name, author, WORLD AGE (the publish-time age
 *     band, migration 147/149), settlement count (the server-counted
 *     member_count), the aliveness badge, an at-war chip, tags, View / Import.
 *   • the preview — the map image + description + member-settlement chips
 *     (cross-linked to their public dossiers when published), PLUS the
 *     campaign-level share surface: CampaignStatePanel rendering the owner's
 *     opted-in world snapshot sections (worldClock / dashboard / chronicle /
 *     pantheon / warNetwork) — the previously-orphaned read-only panel, now
 *     mounted.
 *
 * Self-contained like GalleryMaps (no useGalleryPageState): the server RPC
 * list_gallery_maps already honors the kind facet, so the listing is simply
 * kind:['map_with_campaign']. Viewing is free (anon included — caps bind
 * actions, never rendering); importing creates a campaign and stays premium.
 */
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store';
import { navigate } from '../../hooks/useRoute.js';
import { t } from '../../copy/index.js';
import { fetchGalleryMaps, fetchGalleryMap } from '../../lib/gallery.js';
import AlivenessBadge from './AlivenessBadge.jsx';
import CampaignStatePanel from './CampaignStatePanel.jsx';
import Button from '../primitives/Button.jsx';
import EmptyState from '../primitives/EmptyState.jsx';
import { GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import { activeMapFilterCount, deriveTagVocabulary, emptyMapFilters, MAP_SORT_OPTIONS } from './galleryMapsFilters.js';
import GalleryMapsSidebar from './GalleryMapsSidebar.jsx';
import GalleryTopbar from './GalleryTopbar.jsx';
import {
  GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, CARD_ALT, CARD_HDR, PARCH, RED, sans, serif_, SP, FS, swatch } from '../theme.js';

// The age-band vocabulary (domain/ageBands.js), read as a world's age.
const WORLD_AGE_LABELS = Object.freeze({
  'this-week': 'a week old',
  'this-month': 'a month old',
  'this-season': 'a season old',
  'this-year': 'a year old',
  'years-past': 'years deep',
});

function WorldAgeChip({ band }) {
  const label = WORLD_AGE_LABELS[band];
  if (!label) return null;
  return (
    <span aria-label={`World age: ${label}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: FS.pico, fontWeight: 700, color: SECOND,
      background: PARCH, border: `1px solid ${BORDER}`, padding: '1px 6px',
    }}>
      World {label}
    </span>
  );
}

export default function GalleryCampaigns({ onNavigate }) {
  const auth = useStore(s => s.auth);
  const importGalleryMapWithCampaign = useStore(s => s.importGalleryMapWithCampaign);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const isPremium = auth?.tier === 'premium' || auth?.role === 'developer' || auth?.role === 'admin';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importingSlug, setImportingSlug] = useState(null);
  const [notice, setNotice] = useState(null);
  const [viewingSlug, setViewingSlug] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  // Full Settlements-tab parity: a filter rail + sort + search, all narrowing
  // server-side through the SAME list_gallery_maps RPC (migration 090), with the
  // kind facet pinned to campaign shares. The facets are the ones the RPC honors
  // for a map_with_campaign row — backdrop / has-settlements / importable / tags;
  // world-age, at-war and aliveness stay CARD anatomy, not filters, because the
  // list RPC does not narrow on those columns (offering them would be dead chips).
  const [filters, setFilters] = useState(emptyMapFilters);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // Sticky tag vocabulary: derived from the UNFILTERED, unsearched batch so a
  // narrowed result never collapses the chip set to the tags already selected.
  const [tagVocabulary, setTagVocabulary] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- debounce: empty search resets instantly
    if (search === '') { setDebouncedSearch(''); return undefined; }
    const id = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    setLoading(true); setError(null);
    // The server RPC honors every facet + sort + search (normalizeMapFilters →
    // p_filters, p_sort_key, p_search_query); kind is pinned to campaign shares
    // over whatever the sidebar narrows.
    const unfiltered = activeMapFilterCount(filters) === 0 && debouncedSearch === '';
    fetchGalleryMaps({ page: 0, pageSize: 36, sort, search: debouncedSearch, filters: { ...filters, kind: ['map_with_campaign'] } })
      .then((r) => {
        if (ignore) return;
        const list = Array.isArray(r?.items) ? r.items : [];
        setItems(list);
        if (unfiltered) setTagVocabulary(deriveTagVocabulary(list));
      })
      .catch((e) => { if (!ignore) setError(e?.message || 'Could not load shared campaigns'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [filters, sort, debouncedSearch]);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const arr = Array.isArray(prev[key]) ? prev[key] : [];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const toggleBoolFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: !!value }));
  }, []);

  const clearFilters = useCallback(() => { setFilters(emptyMapFilters()); }, []);

  const isFiltered = activeMapFilterCount(filters) > 0 || !!debouncedSearch.trim();

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

  const handleImport = useCallback(async (slug) => {
    if (!isPremium) { setNotice({ kind: 'err', text: 'Importing campaigns is a premium feature.' }); return; }
    setImportingSlug(slug); setNotice(null);
    try {
      const id = await importGalleryMapWithCampaign(slug);
      setActiveCampaign(id);
      setNotice({ kind: 'ok', text: 'Campaign imported. Map and settlements are in your library.' });
      if (typeof onNavigate === 'function') onNavigate('map');
    } catch (e) {
      setNotice({ kind: 'err', text: e?.message || 'Import failed.' });
    } finally {
      setImportingSlug(null);
    }
  }, [isPremium, importGalleryMapWithCampaign, setActiveCampaign, onNavigate]);

  // Member cross-link → the settlement's public dossier (/gallery/:slug). Uses
  // the route module's navigate (the useGalleryPageState idiom) because
  // onNavigate is the view-only setter.
  const openMemberDossier = useCallback((slug) => {
    if (slug) navigate('gallery', { params: { slug } });
  }, []);

  return (
    <div style={{ fontFamily: sans }}>
      {notice && (
        <div style={{
          margin: `0 0 ${SP.md}px`, padding: `${SP.sm}px ${SP.md}px`, fontSize: FS.sm,
          background: notice.kind === 'ok' ? (swatch.successBg || GOLD_BG) : (swatch.dangerBg || GOLD_BG),
          color: notice.kind === 'ok' ? INK : (swatch.danger || RED),
          border: `1px solid ${BORDER}`,
        }}>{notice.text}</div>
      )}

      {/* ── Campaign preview: the map + the campaign-level share surface ── */}
      {viewingSlug && (() => {
        const d = detail || {};
        const img = d.imageUrl || d.mapState?.customBackdrop?.imageUrl || null;
        const memberList = Array.isArray(d.members) ? d.members : [];
        return (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setViewingSlug(null)} style={{ marginBottom: SP.md }}>← Back to campaigns</Button>
            {detailLoading && <p style={{ color: MUTED, fontSize: FS.sm }}>Opening campaign…</p>}
            {!detailLoading && !d.slug && <p style={{ color: MUTED, fontSize: FS.sm }}>This campaign is no longer available.</p>}
            {!detailLoading && d.slug && (
              <div style={{ display: 'grid', gap: SP.md }}>
                <div style={{ border: `1px solid ${BORDER}`, background: CARD, overflow: 'hidden' }}>
                  {img && (
                    <div style={{ background: CARD_ALT, maxHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={img} alt={d.imageAlt || d.name || 'Campaign map'} style={{ maxWidth: '100%', maxHeight: 380, display: 'block' }} />
                    </div>
                  )}
                  <div style={{ padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                    <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK_DEEP }}>{d.name || 'Untitled campaign'}</div>
                    {d.realmArcSummary && (
                      <div style={{ fontSize: FS.sm, color: INK, fontStyle: 'italic', lineHeight: 1.5 }}>{d.realmArcSummary}</div>
                    )}
                    {d.description && <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>{d.description}</div>}
                    {memberList.length > 0 && (
                      <div>
                        <div style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: INK, margin: `${SP.xs}px 0` }}>Settlements ({memberList.length})</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
                          {memberList.map((mm, i) => mm.public_slug ? (
                            <Button key={mm.old_id || i} variant="ghost" size="sm"
                              aria-label={`Open the public dossier for ${mm.name || 'this settlement'}`}
                              onClick={() => openMemberDossier(mm.public_slug)}>
                              {mm.name || 'Settlement'}{mm.tier ? ` · ${mm.tier}` : ''}
                            </Button>
                          ) : (
                            <span key={mm.old_id || i} style={{ fontSize: FS.xs, color: SECOND, background: PARCH, border: `1px solid ${BORDER}`, padding: `2px ${SP.sm}px` }}>
                              {mm.name || 'Settlement'}{mm.tier ? ` · ${mm.tier}` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button variant="gold" size="md" onClick={() => handleImport(d.slug)} busy={importingSlug === d.slug}
                      style={{ alignSelf: 'flex-start', marginTop: SP.xs }}>
                      {importingSlug === d.slug ? 'Importing…' : (isPremium ? 'Import map + settlements' : 'Import (premium)')}
                    </Button>
                  </div>
                </div>
                {/* The campaign-level share surface: the owner's opted-in living-world
                    sections (stored, pre-sanitized snapshot — never a live read). */}
                {d.world?.snapshot && (
                  <CampaignStatePanel snapshot={d.world.snapshot} sections={d.world.sections} />
                )}
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
          showHasSettlements
        />
        <main style={{ minWidth: 0 }}>
          <GalleryTopbar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            sortOptions={MAP_SORT_OPTIONS}
            noun="campaign"
            countQualifier="shared"
            total={items.length}
            loading={loading}
          />
          {loading && <p style={{ color: MUTED, fontSize: FS.sm }}>Loading shared campaigns…</p>}
          {error && <p style={{ color: swatch.danger || RED, fontSize: FS.sm }}>Couldn’t load campaigns: {error}</p>}
          {!loading && !error && items.length === 0 && (
            isFiltered ? (
              <EmptyState
                align="center"
                heading="No campaigns match those filters."
                body="Loosen a facet, or clear them all to see every shared campaign."
                action={{ label: t('gallery.clearFilters'), onClick: () => { clearFilters(); setSearch(''); }, variant: 'secondary' }}
              />
            ) : (
              <EmptyState
                align="center"
                heading="No shared campaigns yet."
                body="Premium DMs can publish a map together with its living campaign, and it appears here for others to read and adopt."
              />
            )
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: SP.md }}>
          {items.map((m) => (
            <div key={m.slug} style={{ border: `1px solid ${BORDER}`, background: CARD, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 130, background: CARD_ALT, position: 'relative' }}>
                {(m.thumb_url || m.image_url) ? (
                  <img src={m.thumb_url || m.image_url} alt={m.name || 'Shared campaign'} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: FS.xs, background: PARCH }}>
                    Generated terrain
                  </div>
                )}
                {m.at_war === true && (
                  <span aria-label="This realm is at war" style={{ position: 'absolute', top: 6, right: 6, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: FS.pico, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: RED, background: CARD_HDR, border: `1px solid ${BORDER}`, padding: '1px 5px' }}>
                    At war
                  </span>
                )}
              </div>
              <div style={{ padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.xs, flex: 1 }}>
                <div style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK_DEEP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name || 'Untitled campaign'}</div>
                {m.author_name && (
                  <div style={{ fontSize: FS.pico, color: MUTED }}>by {m.author_name}</div>
                )}
                {/* The campaign anatomy row: world age · settlement count · aliveness. */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}>
                  <WorldAgeChip band={m.world_age} />
                  {Number(m.member_count) > 0 && (
                    <span aria-label={`${m.member_count} settlements`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: FS.pico, fontWeight: 700, color: SECOND, background: PARCH, border: `1px solid ${BORDER}`, padding: '1px 6px' }}>
                      {m.member_count} settlement{m.member_count === 1 ? '' : 's'}
                    </span>
                  )}
                  <AlivenessBadge score={m.aliveness} />
                </div>
                {m.description && <div style={{ fontSize: FS.xs, color: SECOND, lineHeight: 1.4, maxHeight: 54, overflow: 'hidden' }}>{m.description}</div>}
                {Array.isArray(m.tags) && m.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                    {m.tags.slice(0, 4).map((t) => (
                      <span key={t} style={{ fontSize: FS.pico, color: MUTED, background: PARCH, padding: '1px 5px' }}>{t}</span>
                    ))}
                  </div>
                )}
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.xs }}>
                  <Button variant="ghost" size="sm" onClick={() => setViewingSlug(m.slug)}
                    aria-label={`Preview the campaign ${m.name || ''}`}>View</Button>
                  <Button variant="gold" size="sm" onClick={() => handleImport(m.slug)}
                    busy={importingSlug === m.slug} style={{ flex: 1 }}
                    aria-label={isPremium ? 'Import this campaign into your library' : 'Importing campaigns is a premium feature'}>
                    {importingSlug === m.slug ? 'Importing…' : (isPremium ? 'Import' : 'Import (premium)')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </main>
      </div>
      </>
      )}
    </div>
  );
}
