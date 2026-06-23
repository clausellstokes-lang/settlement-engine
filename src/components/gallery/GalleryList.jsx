import { Sparkles, X } from 'lucide-react';

import { t } from '../../copy/index.js';
import {
  BLUE,
  BLUE_BG,
  BODY,
  BORDER,
  CARD,
  FS,
  GREEN,
  GREEN_BG,
  MUTED,
  R,
  RED,
  RED_BG,
  SP,
  sans,
  serif_,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import { activeFilterCount, GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import GalleryCard from './GalleryCard.jsx';
import GallerySidebar from './GallerySidebar.jsx';
import GalleryTopbar from './GalleryTopbar.jsx';

// Announce the result of an action (vote/report) regardless of scroll position:
// a danger tone is role=alert (interrupts), a success/info tone is a polite
// status. A card-deep vote whose only feedback rendered far above the fold was
// a silent dead-end for SR users (P10 / P7 second channel).
function StatusMessage({ tone = 'info', children }) {
  const cfg = tone === 'success'
    ? { border: GREEN, bg: GREEN_BG, color: GREEN }
    : tone === 'danger'
      ? { border: RED, bg: RED_BG, color: RED }
      : { border: BLUE, bg: BLUE_BG, color: BLUE };
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-live={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ border: `1px solid ${cfg.border}`, borderRadius: R.md, background: cfg.bg, color: cfg.color, padding: SP.sm, marginBottom: SP.md, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}
    >
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
  // A filtered-empty result (active facets or a search term) is a recoverable
  // dead-end; a never-published gallery is not. Drives the empty-state branch.
  const isFiltered = activeFilterCount(filters) > 0 || !!search.trim();
  return (
    <div>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
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
            disabled={!!filters.mine}
          />
          {listError && (
            <div style={{ border: `1px solid ${RED}`, borderRadius: R.md, background: RED_BG, color: RED, padding: SP.md, marginBottom: SP.md, fontFamily: sans, fontSize: FS.sm, fontWeight: 850 }}>
              Could not load the gallery: {listError}
            </div>
          )}
          {/* First-paint loading: the grid region would otherwise be blank
              parchment with no feedback (empty-state is gated behind !listLoading,
              "Load more" behind hasMore). Render skeleton placeholders matching the
              card grid so the region reads as loading, not broken. (P10.) */}
          {listLoading && items.length === 0 && !listError && (
            <div
              role="status"
              aria-live="polite"
              aria-label="Loading settlements"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: SP.lg }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, minHeight: 280, boxShadow: '0 4px 14px rgba(27,20,8,0.08)' }}
                />
              ))}
            </div>
          )}
          {!listLoading && items.length === 0 && !listError && (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, padding: SP.xl, textAlign: 'center', color: BODY, display: 'grid', gap: SP.md, justifyItems: 'center' }}>
              {/* Two distinct dead-ends share one screen: a filtered query with no
                  matches needs a "clear filters" recovery; a genuinely empty gallery
                  needs the forge next-step. Branch the recovery ACTION on the filter
                  state; the body copy is owned by the voice workstream (kept generic). */}
              <p style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, fontStyle: 'italic' }}>
                {t('gallery.emptyBody')}
              </p>
              {isFiltered ? (
                <Button variant="secondary" icon={<X size={14} />} onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button variant="primary" icon={<Sparkles size={14} />} onClick={() => onNavigate?.('generate')}>
                  {t('gallery.forgeYourOwn')}
                </Button>
              )}
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
                isSignedIn={isSignedIn}
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
              <Button
                variant="secondary"
                onClick={loadMore}
                busy={listLoading}
                disabled={listLoading}
              >
                {listLoading ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
