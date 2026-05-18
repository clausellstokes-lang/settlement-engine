/**
 * GalleryPage.jsx — Public dossier gallery (the SEO surface).
 *
 * Lists the most-recently-published public dossiers as a grid of tiles.
 * Tapping a tile opens the public dossier view (renders the settlement
 * read-only, with no owner identifying info). Anonymous visitors can
 * browse the entire gallery without an account.
 *
 * State machine:
 *   - listing  — show grid of tiles (default landing for /gallery)
 *   - loading  — fetching a specific slug after a tile click
 *   - dossier  — render the public dossier
 *
 * Flag: `gallery` (default on). When off, the route renders a polite
 * "coming soon" so we can kill the surface instantly if needed.
 */

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Eye, Sparkles } from 'lucide-react';
import { useFlag } from '../lib/flags.js';
import { fetchPublicGallery, fetchPublicDossier } from '../lib/gallery.js';
import { TIER_LABELS } from './new/design.js';
import {
  GOLD, INK, INK_DEEP, BORDER, CARD, PARCH, sans, serif_, SP, R, FS,
} from './theme.js';

const MUTED  = '#6b5340';
const BODY   = '#4A3B22';

// Lazy import — the public dossier view pulls OutputContainer's tabs,
// which is the big chunk. We only need it when the user clicks a tile.
const PublicDossierView = React.lazy(() => import('./PublicDossierView.jsx'));

function GalleryTile({ tile, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(tile.slug)}
      style={{
        textAlign: 'left',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: R.xl,
        padding: `${SP.lg}px ${SP.lg}px`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: SP.sm,
        fontFamily: sans,
        boxShadow: '0 2px 10px rgba(27,20,8,0.06)',
        transition: 'transform 0.1s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(27,20,8,0.12)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(27,20,8,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <h3 style={{
        margin: 0, fontFamily: serif_,
        fontSize: FS.xl, fontWeight: 600, color: INK,
        lineHeight: 1.2,
      }}>
        {tile.name || 'Untitled settlement'}
      </h3>
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        fontSize: FS.xs, color: MUTED,
        textTransform: 'capitalize', letterSpacing: '0.04em',
      }}>
        <span>{TIER_LABELS[tile.tier] || tile.tier}</span>
        <span aria-hidden="true">·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <Eye size={11} /> {tile.viewCount}
        </span>
      </div>
    </button>
  );
}

export default function GalleryPage({ onNavigate }) {
  const enabled = useFlag('gallery');

  // Listing state
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  // Dossier state (one of: null | { loading: true } | { dossier })
  const [activeSlug, setActiveSlug] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  // Initial listing fetch.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setListLoading(true);
    fetchPublicGallery({ page: 0 })
      .then(res => {
        if (cancelled) return;
        setItems(res.items);
        setHasMore(res.hasMore);
        setListError(null);
      })
      .catch(e => { if (!cancelled) setListError(e.message); })
      .finally(() => { if (!cancelled) setListLoading(false); });
    return () => { cancelled = true; };
  }, [enabled]);

  // Deep-link to a specific dossier via ?slug=. Reads once on mount
  // so a shared /?view=gallery&slug=abc URL opens the dossier instead
  // of the listing. Doesn't clear the URL — the user can copy/share it.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const deepSlug = params.get('slug');
    if (deepSlug) openDossier(deepSlug);
     
  }, [enabled]);

  // Load more (pagination).
  async function loadMore() {
    const next = page + 1;
    setListLoading(true);
    try {
      const res = await fetchPublicGallery({ page: next });
      setItems(prev => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setPage(next);
    } catch (e) {
      setListError(e.message);
    } finally {
      setListLoading(false);
    }
  }

  // Open a specific dossier.
  async function openDossier(slug) {
    setActiveSlug(slug);
    setDossierLoading(true);
    try {
      const d = await fetchPublicDossier(slug);
      setDossier(d);
    } finally {
      setDossierLoading(false);
    }
  }

  function back() {
    setActiveSlug(null);
    setDossier(null);
  }

  // ── Render ──────────────────────────────────────────────────────────────
  if (!enabled) {
    return (
      <div style={{
        maxWidth: 600, margin: '0 auto', padding: `${SP.xxl}px ${SP.lg}px`,
        textAlign: 'center', color: BODY, fontFamily: sans,
      }}>
        <h1 style={{ fontFamily: serif_, color: INK }}>Gallery</h1>
        <p>The public gallery is coming soon.</p>
      </div>
    );
  }

  // Dossier view (single dossier).
  if (activeSlug) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px` }}>
        <button
          type="button"
          onClick={back}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'transparent', border: 'none', padding: 0,
            color: GOLD, fontFamily: sans, fontSize: FS.sm, cursor: 'pointer',
            marginBottom: SP.lg,
          }}
        >
          <ChevronLeft size={14} /> Back to gallery
        </button>
        {dossierLoading && (
          <p style={{ color: MUTED, fontStyle: 'italic', textAlign: 'center' }}>
            Opening dossier…
          </p>
        )}
        {!dossierLoading && !dossier && (
          <div style={{
            padding: SP.xl, background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: R.xl, textAlign: 'center', color: BODY,
          }}>
            <p style={{ margin: 0 }}>
              This dossier isn’t available — it may have been taken private by its author.
            </p>
          </div>
        )}
        {!dossierLoading && dossier && (
          <React.Suspense fallback={
            <p style={{ color: MUTED, fontStyle: 'italic', textAlign: 'center' }}>Loading…</p>
          }>
            <PublicDossierView dossier={dossier} />
          </React.Suspense>
        )}
      </div>
    );
  }

  // Listing.
  return (
    <div style={{
      maxWidth: 1100, margin: '0 auto', padding: `${SP.xxl}px ${SP.lg}px`,
      fontFamily: sans, color: INK,
    }}>
      <header style={{ textAlign: 'center', marginBottom: SP.xxl }}>
        <h1 style={{
          margin: 0, fontFamily: serif_, fontSize: 36, fontWeight: 600,
          color: INK,
        }}>
          Gallery
        </h1>
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 540,
          fontSize: FS.lg, color: BODY,
          fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.5,
        }}>
          Settlements other DMs have shared. Browse for inspiration; click a tile to read the full dossier.
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.('generate')}
          style={{
            marginTop: SP.lg,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: `${SP.sm}px ${SP.lg}px`,
            background: 'transparent', color: GOLD,
            border: `1.5px solid ${GOLD}`,
            borderRadius: R.button,
            fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Sparkles size={14} /> Forge your own
        </button>
      </header>

      {listError && (
        <div style={{
          padding: SP.md, marginBottom: SP.lg,
          background: '#F4DEDE', border: '1px solid #A23434', borderRadius: R.md,
          fontSize: FS.sm, color: '#A23434',
        }}>
          Could not load the gallery: {listError}
        </div>
      )}

      {listLoading && items.length === 0 && (
        <p style={{ color: MUTED, fontStyle: 'italic', textAlign: 'center' }}>
          Loading public dossiers…
        </p>
      )}

      {!listLoading && items.length === 0 && !listError && (
        <div style={{
          maxWidth: 480, margin: '0 auto',
          padding: SP.xl, background: PARCH, border: `1px solid ${BORDER}`,
          borderRadius: R.xl, textAlign: 'center', color: BODY,
        }}>
          <p style={{ margin: 0 }}>
            No one has shared a settlement yet. Be the first — generate a dossier and use
            “Share to gallery” on the output toolbar.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: SP.lg,
        }}>
          {items.map(tile => (
            <GalleryTile key={tile.slug} tile={tile} onOpen={openDossier} />
          ))}
        </div>
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: SP.xxl }}>
          <button
            type="button"
            onClick={loadMore}
            disabled={listLoading}
            style={{
              padding: `${SP.sm + 2}px ${SP.xl}px`,
              background: 'transparent', color: GOLD,
              border: `1.5px solid ${GOLD}`, borderRadius: R.button,
              fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {listLoading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {/* Footer line to set expectations */}
      <p style={{
        marginTop: SP.xxl, textAlign: 'center',
        fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
      }}>
        Dossiers in the gallery are shared by their authors. Names of authors are kept private.
      </p>
    </div>
  );
}
