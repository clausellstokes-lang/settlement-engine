/**
 * GalleryMaps.jsx — browse + import shared MAPS (Project 2, Phase 1).
 *
 * Self-contained (does not use the settlement-shaped useGalleryPageState):
 * fetches public maps via gallery.fetchGalleryMaps, renders anonymized tiles
 * (backdrop thumbnail for image maps), and imports a blank-canvas map into a NEW
 * premium campaign via the importGalleryMap store action. Viewing is free;
 * importing is premium (it creates a campaign).
 */
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store';
import { fetchGalleryMaps, fetchGalleryMap } from '../../lib/gallery.js';
import Button from '../primitives/Button.jsx';
import {
  GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, CARD_ALT, CARD_HDR, PARCH,
  sans, serif_, SP, R, FS, swatch,
} from '../theme.js';

export default function GalleryMaps({ onNavigate }) {
  const auth = useStore(s => s.auth);
  const importGalleryMap = useStore(s => s.importGalleryMap);
  const importGalleryMapWithCampaign = useStore(s => s.importGalleryMapWithCampaign);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const isPremium = auth?.tier === 'premium' || auth?.role === 'developer' || auth?.role === 'admin';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importingSlug, setImportingSlug] = useState(null);
  const [notice, setNotice] = useState(null);
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

  useEffect(() => {
    let ignore = false;
    setLoading(true); setError(null);
    fetchGalleryMaps({ page: 0, pageSize: 36 })
      .then((r) => { if (!ignore) setItems(Array.isArray(r?.items) ? r.items : []); })
      .catch((e) => { if (!ignore) setError(e?.message || 'Could not load shared maps'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const handleImport = useCallback(async (slug, kind) => {
    if (!isPremium) { setNotice({ kind: 'err', text: 'Importing maps is a premium feature.' }); return; }
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

  return (
    <div style={{ fontFamily: sans }}>
      {notice && (
        <div style={{
          margin: `0 0 ${SP.md}px`, padding: `${SP.sm}px ${SP.md}px`, borderRadius: R.md, fontSize: FS.sm,
          background: notice.kind === 'ok' ? (swatch.successBg || GOLD_BG) : (swatch.dangerBg || '#fbeaea'),
          color: notice.kind === 'ok' ? INK : (swatch.danger || '#9b1c1c'),
          border: `1px solid ${BORDER}`,
        }}>{notice.text}</div>
      )}

      {/* ── Read-only preview (view a map + its settlements before importing) ── */}
      {viewingSlug && (() => {
        const d = detail || {};
        const img = d.backdrop?.customBackdrop?.imageUrl || d.mapState?.customBackdrop?.imageUrl || null;
        const memberList = Array.isArray(d.members) ? d.members : [];
        return (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setViewingSlug(null)} style={{ marginBottom: SP.md }}>← Back to maps</Button>
            {detailLoading && <p style={{ color: MUTED, fontSize: FS.sm }}>Loading preview…</p>}
            {!detailLoading && !d.slug && <p style={{ color: MUTED, fontSize: FS.sm }}>This map is no longer available.</p>}
            {!detailLoading && d.slug && (
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, overflow: 'hidden' }}>
                <div style={{ background: CARD_ALT, maxHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {img ? (
                    <img src={img} alt={d.name || 'Map'} style={{ maxWidth: '100%', maxHeight: 420, display: 'block' }} />
                  ) : (
                    <div style={{ padding: SP.xl, color: MUTED, fontSize: FS.sm, background: PARCH, width: '100%', textAlign: 'center' }}>Generated terrain (renders on import)</div>
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
                  <Button variant="gold" size="md" onClick={() => handleImport(d.slug, d.kind)} busy={importingSlug === d.slug}
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

      {!viewingSlug && loading && <p style={{ color: MUTED, fontSize: FS.sm }}>Loading shared maps…</p>}
      {!viewingSlug && error && <p style={{ color: swatch.danger || '#9b1c1c', fontSize: FS.sm }}>Couldn’t load maps: {error}. (Needs migration 045 deployed.)</p>}
      {!viewingSlug && !loading && !error && items.length === 0 && (
        <p style={{ color: MUTED, fontSize: FS.sm }}>No shared maps yet. Premium DMs can share a map from the world-map toolbar.</p>
      )}

      {!viewingSlug && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: SP.md }}>
        {items.map((m) => (
          <div key={m.slug} style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 130, background: CARD_ALT, position: 'relative' }}>
              {m.backdrop_kind === 'image' && m.thumb_url ? (
                <img src={m.thumb_url} alt={m.name || 'Shared map'} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: FS.xs, background: PARCH }}>
                  Generated terrain
                </div>
              )}
              <span style={{ position: 'absolute', top: 6, right: 6, fontSize: FS.pico, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: SECOND, background: CARD_HDR, border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: '1px 5px' }}>
                {m.kind === 'map_with_campaign' ? 'Map + Campaign' : 'Blank map'}
              </span>
            </div>
            <div style={{ padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.xs, flex: 1 }}>
              <div style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK_DEEP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name || 'Untitled map'}</div>
              {m.description && <div style={{ fontSize: FS.xs, color: SECOND, lineHeight: 1.4, maxHeight: 54, overflow: 'hidden' }}>{m.description}</div>}
              {Array.isArray(m.tags) && m.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                  {m.tags.slice(0, 4).map((t) => (
                    <span key={t} style={{ fontSize: FS.pico, color: MUTED, background: PARCH, borderRadius: R.sm, padding: '1px 5px' }}>{t}</span>
                  ))}
                </div>
              )}
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.xs }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingSlug(m.slug)}
                  title="Preview this map (and its settlements) before importing"
                >View</Button>
                <Button
                  variant="gold"
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
        ))}
      </div>
      )}
    </div>
  );
}
