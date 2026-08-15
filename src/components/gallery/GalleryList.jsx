import { useState } from 'react';

import { t } from '../../copy/index.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../../lib/guidance.js';
import {
  BLUE,
  BODY,
  BORDER,
  CARD,
  FS,
  GREEN,
  INK,
  MUTED,
  PAGE_MAX,
  PARCH,
  RED,
  SP,
  sans,
  serif_,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import { activeFilterCount, GALLERY_RESPONSIVE_CSS } from './galleryUtils.js';
import GalleryCard from './GalleryCard.jsx';
import GallerySidebar from './GallerySidebar.jsx';
import GalleryTopbar from './GalleryTopbar.jsx';

function StatusMessage({ tone = 'info', children }) {
  // The tinted status callout becomes a rubric-ruled note: a single drawn left
  // rule in the tone's ink (no wash, no radius). Alert/status semantics kept.
  const color = tone === 'success' ? GREEN : tone === 'danger' ? RED : BLUE;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-live={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ borderLeft: `2px solid ${color}`, paddingLeft: SP.md, color, marginBottom: SP.md, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, lineHeight: 1.5 }}
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
  // content-immersion-r2-3: the registered gallery_empty_invitation whisper —
  // the empty-gallery community-voice sentence is dismissible through the unified
  // sf:guidance store (the forge CTA below always stays).
  const [invited, setInvited] = useState(() => !isGuidanceDismissed('gallery_empty_invitation'));
  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, fontFamily: sans, color: INK }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      {/* The page title / subtitle / forge CTA identity is the SHARED page
          header owned by GalleryPage (so the Maps and Campaigns tabs carry it
          too), not a per-panel header here — otherwise the Settlements tab
          renders "Gallery" twice. The empty-state forge invitation below stays. */}
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
            <div style={{ borderLeft: `2px solid ${RED}`, paddingLeft: SP.md, color: RED, marginBottom: SP.md, fontFamily: sans, fontSize: FS.sm, fontWeight: 850, lineHeight: 1.5 }}>
              Could not load the gallery: {listError}
            </div>
          )}
          {/* First-paint loading: the empty state is gated behind !listLoading and
              "Load more" behind hasMore, so the grid region would otherwise be
              blank on first load. Render a static placeholder grid matching the
              card template so the region reads as loading, not broken. The single
              polite live region is the always-mounted topbar strip, so this wrapper
              is aria-hidden — no double announcement, no announce-on-mount. */}
          {listLoading && items.length === 0 && !listError && (
            <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: SP.lg }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{ border: `1px solid ${BORDER}`, background: CARD, minHeight: 280 }}
                />
              ))}
            </div>
          )}
          {!listLoading && items.length === 0 && !listError && (
            <div style={{ border: `1px solid ${BORDER}`, background: PARCH, padding: SP.xl, textAlign: 'center', color: BODY, display: 'grid', gap: SP.sm }}>
              {/* Two dead-ends share this panel: a filtered query with no matches
                  offers a "clear filters" recovery; a genuinely empty gallery
                  offers the forge next-step. Branch both copy and action on the
                  filter state. */}
              {(isFiltered || invited) && (
                <p style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: 6, justifyContent: 'center' }}>
                  <span>{isFiltered ? t('gallery.emptyFilteredBody') : t('gallery.emptyBody')}</span>
                  {!isFiltered && (
                    <Button
                      variant="ghost" size="sm"
                      aria-label="Dismiss the gallery invitation"
                      onClick={() => { markGuidanceDismissed('gallery_empty_invitation'); setInvited(false); }}
                    />
                  )}
                </p>
              )}
              {isFiltered ? (
                <Button
                  variant="secondary"
                  onClick={() => { clearFilters(); setSearch(''); }}
                  style={{ justifySelf: 'center' }}
                >
                  {t('gallery.clearFilters')}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => onNavigate?.('generate')}
                  style={{ justifySelf: 'center' }}
                >
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
              />
            ))}
          </div>
          {listLoading && items.length > 0 && (
            <p role="status" aria-live="polite" style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm, fontStyle: 'italic', textAlign: 'center', margin: SP.lg }}>
              Loading more settlements...
            </p>
          )}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: SP.xl }}>
              <Button
                variant="gold"
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
