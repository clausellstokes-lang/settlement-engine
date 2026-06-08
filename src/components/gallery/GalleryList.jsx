import { Image as ImageIcon, Sparkles } from 'lucide-react';

import { t } from '../../copy/index.js';
import {
  BLUE,
  BLUE_BG,
  BODY,
  BORDER,
  CARD,
  FS,
  GOLD,
  GREEN,
  GREEN_BG,
  INK,
  MUTED,
  PAGE_MAX,
  PARCH,
  R,
  RED,
  RED_BG,
  SP,
  sans,
  serif_,
  swatch,
} from '../theme.js';
import { GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import GalleryCard from './GalleryCard.jsx';
import GallerySidebar from './GallerySidebar.jsx';
import GalleryTopbar from './GalleryTopbar.jsx';

function StatusMessage({ tone = 'info', children }) {
  const cfg = tone === 'success'
    ? { border: GREEN, bg: GREEN_BG, color: GREEN }
    : tone === 'danger'
      ? { border: RED, bg: RED_BG, color: RED }
      : { border: BLUE, bg: BLUE_BG, color: BLUE };
  return (
    <div style={{ border: `1px solid ${cfg.border}`, borderRadius: R.md, background: cfg.bg, color: cfg.color, padding: SP.sm, marginBottom: SP.md, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
      {children}
    </div>
  );
}

export default function GalleryList({
  items,
  total,
  hasMore,
  listLoading,
  listError,
  actionError,
  actionNotice,
  sort,
  setSort,
  search,
  setSearch,
  filters,
  voteBusyId,
  loadMore,
  openDossier,
  toggleArrayFilter,
  toggleBoolFilter,
  clearFilters,
  voteOn,
  onNavigate,
  isSignedIn,
}) {
  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, fontFamily: sans, color: INK }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <header className="sf-readable-surface" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: SP.md,
        alignItems: 'end',
        marginBottom: SP.lg,
        padding: SP.lg,
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['36'], lineHeight: 1.05, fontWeight: 750 }}>
            {t('gallery.pageTitle')}
          </h1>
          <p style={{ margin: `${SP.xs}px 0 0`, maxWidth: 680, color: BODY, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.5, fontStyle: 'italic' }}>
            {t('gallery.pageSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('generate')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            minHeight: 38,
            padding: '8px 12px',
            border: `1px solid ${GOLD}`,
            borderRadius: R.md,
            background: GOLD,
            color: swatch.white,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 900,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Sparkles size={14} /> {t('gallery.forgeYourOwn')}
        </button>
      </header>

      {actionError && <StatusMessage tone="danger">{actionError}</StatusMessage>}
      {actionNotice && <StatusMessage tone="success">{actionNotice}</StatusMessage>}

      <div className="gallery-main-layout" style={{ display: 'grid', gap: SP.lg, alignItems: 'start' }}>
        <GallerySidebar
          filters={filters}
          onToggleArray={toggleArrayFilter}
          onToggleBool={toggleBoolFilter}
          onClear={clearFilters}
          isSignedIn={isSignedIn}
        />
        <main style={{ minWidth: 0 }}>
          <GalleryTopbar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            total={total}
            loading={listLoading}
          />
          {listError && (
            <div style={{ border: `1px solid ${RED}`, borderRadius: R.md, background: RED_BG, color: RED, padding: SP.md, marginBottom: SP.md, fontFamily: sans, fontSize: FS.sm, fontWeight: 850 }}>
              Could not load the gallery: {listError}
            </div>
          )}
          {!listLoading && items.length === 0 && !listError && (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: PARCH, padding: SP.xl, textAlign: 'center', color: BODY, display: 'grid', gap: SP.sm }}>
              <ImageIcon size={26} color={GOLD} style={{ justifySelf: 'center' }} />
              <p style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, fontStyle: 'italic' }}>
                {t('gallery.emptyBody')}
              </p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: SP.lg }}>
            {items.map(item => (
              <GalleryCard
                key={item.slug}
                item={item}
                onOpen={openDossier}
                onVote={voteOn}
                voting={voteBusyId === item.id}
              />
            ))}
          </div>
          {listLoading && items.length > 0 && (
            <p style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm, fontStyle: 'italic', textAlign: 'center', margin: SP.lg }}>
              Loading more settlements...
            </p>
          )}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: SP.xl }}>
              <button
                type="button"
                onClick={loadMore}
                disabled={listLoading}
                style={{
                  minHeight: 38,
                  padding: '8px 16px',
                  border: `1px solid ${GOLD}`,
                  borderRadius: R.md,
                  background: CARD,
                  color: GOLD,
                  fontFamily: sans,
                  fontSize: FS.sm,
                  fontWeight: 900,
                  cursor: listLoading ? 'wait' : 'pointer',
                }}
              >
                {listLoading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
