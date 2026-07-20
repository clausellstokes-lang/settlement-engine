/**
 * GalleryHubPage.jsx — a programmatic FACET HUB landing (GALLERY-2 phase 2).
 *
 * One component serves all 15 hubs (src/lib/galleryHubs.js): a crawlable
 * landing page listing the public dossiers matching one high-value facet —
 * terrain kinds, tiers, at-war, most-alive. The listing is the ordinary
 * list_gallery_dossiers query with the hub's filters/sort LOCKED (curated
 * dossiers included — a hub is a browse surface, not the community feed).
 *
 * ANON-FIRST (the phase-1 finding carried forward): everything here renders
 * for a signed-out crawler/visitor — the caps bind ACTIONS (voting routes to a
 * sign-in notice), never rendering. The head is upgraded client-side
 * (setGalleryHubMeta); the canonical was already stamped by applyDocumentHead
 * via viewToPath's hub branch. The body remains client-rendered — the standing
 * open crawlability item (phase-1), unchanged by this wave.
 *
 * The footer cross-links every sibling hub — the crawl mesh that lets an
 * indexer walk the whole hub set from any entry point.
 */
import { useEffect, useState, useCallback } from 'react';
import { GALLERY_HUBS, resolveHub } from '../../lib/galleryHubs.js';
import { fetchPublicGallery, toggleGalleryVote } from '../../lib/gallery.js';
import { setGalleryHubMeta } from '../../lib/seoDossier.js';
import { navigate } from '../../hooks/useRoute.js';
import { useStore } from '../../store/index.js';
import GalleryCard from './GalleryCard.jsx';
import Button from '../primitives/Button.jsx';
import { GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import { BORDER, CARD, FS, INK, INK_DEEP, MUTED, PAGE_MAX, SECOND, SP, sans, serif_ } from '../theme.js';

const PAGE_SIZE = 24;

export default function GalleryHubPage({ routeHub }) {
  const auth = useStore(s => s.auth);
  const hub = resolveHub(routeHub);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteBusyId, setVoteBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (hub) setGalleryHubMeta(hub);
  }, [hub]);

  useEffect(() => {
    if (!hub) return undefined;
    let ignore = false;
    setLoading(true); setError(null);
    fetchPublicGallery({
      page,
      pageSize: PAGE_SIZE,
      // Hubs list EVERY matching public dossier, curated included.
      excludeCurated: false,
      sort: hub.query.sort || 'relevant',
      filters: hub.query.filters || {},
    })
      .then((r) => {
        if (ignore) return;
        setItems(current => page === 0 ? (r.items || []) : [...current, ...(r.items || [])]);
        setTotal(Number(r.total) || 0);
        setHasMore(!!r.hasMore);
      })
      .catch((e) => { if (!ignore) setError(e?.message || 'The gallery could not be loaded.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [hub, page]);

  const openDossier = useCallback((slug) => {
    if (slug) navigate('gallery', { params: { slug } });
  }, []);

  const voteOn = useCallback(async (item) => {
    if (!auth?.user) { setNotice('Sign in to vote on public settlements.'); return; }
    if (!item?.id || voteBusyId) return;
    setVoteBusyId(item.id); setNotice(null);
    try {
      const result = await toggleGalleryVote(item.id);
      setItems(current => current.map(row => row.id === item.id ? { ...row, netVotes: result.netVotes, voted: result.voted } : row));
    } catch (err) {
      setNotice(err?.message || 'Vote could not be saved.');
    } finally {
      setVoteBusyId(null);
    }
  }, [auth?.user, voteBusyId]);

  if (!hub) {
    // Unknown hub value (a mistyped URL): a recoverable in-place state.
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.lg, fontFamily: sans }}>
        <p style={{ color: MUTED, fontSize: FS.sm }}>That gallery collection does not exist.</p>
        <Button variant="gold" size="sm" onClick={() => navigate('gallery')}>Browse the full gallery</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.lg, fontFamily: sans }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <header style={{ display: 'grid', gap: SP.xs, marginBottom: SP.lg }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('gallery')} style={{ justifySelf: 'start' }}>
          ← Full gallery
        </Button>
        <h1 style={{ margin: 0, color: INK_DEEP, fontFamily: serif_, fontSize: FS['28'] || FS.xl, fontWeight: 750 }}>
          {hub.title}
        </h1>
        <p style={{ margin: 0, color: SECOND, fontSize: FS.sm, lineHeight: 1.5, maxWidth: 640 }}>
          {hub.blurb}
        </p>
        {total > 0 && (
          <span style={{ color: MUTED, fontSize: FS.xs, fontWeight: 700 }}>
            {total} settlement{total === 1 ? '' : 's'}
          </span>
        )}
      </header>

      {notice && (
        <div role="status" aria-live="polite" style={{ marginBottom: SP.md, padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, background: CARD, color: INK, fontSize: FS.sm }}>
          {notice}
        </div>
      )}
      {loading && items.length === 0 && <p style={{ color: MUTED, fontSize: FS.sm }}>Loading settlements…</p>}
      {error && <p role="alert" style={{ color: INK, fontSize: FS.sm }}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p style={{ color: MUTED, fontSize: FS.sm }}>No public settlements here yet — share one to found this collection.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: SP.md }}>
        {items.map(item => (
          <GalleryCard
            key={item.id}
            item={item}
            onOpen={openDossier}
            onVote={voteOn}
            voting={voteBusyId === item.id}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: SP.lg }}>
          <Button variant="secondary" size="md" onClick={() => setPage(p => p + 1)} busy={loading}>
            {loading ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}

      {/* The crawl mesh: every sibling hub, so an indexer (or reader) can walk
          the whole hub set from any entry point. */}
      <nav aria-label="More gallery collections" style={{ marginTop: SP.xl, paddingTop: SP.md, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ color: SECOND, fontSize: FS.xs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
          More collections
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
          {GALLERY_HUBS.filter(h => h.id !== hub.id).map(h => (
            <a
              key={h.id}
              href={h.path}
              onClick={(event) => {
                // Real hrefs for crawlers; SPA navigation for readers.
                event.preventDefault();
                const [, facet, value] = h.path.split('/').slice(1); // ['gallery', facet, value?]
                navigate('gallery', { params: { hub: { facet, ...(value ? { value } : {}) } } });
              }}
              style={{ color: INK, fontSize: FS.xs, fontWeight: 700, textDecoration: 'underline', padding: '4px 6px' }}
            >
              {h.title}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
