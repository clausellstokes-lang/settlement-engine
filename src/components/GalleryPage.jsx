/**
 * GalleryPage.jsx — Community settlement gallery coordinator.
 *
 * Data and page state live in useGalleryPageState; focused gallery
 * components handle the browsing list, dossier reader, comments, and reports.
 */

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { t as tr } from '../copy/index.js';
import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import GalleryDetail from './gallery/GalleryDetail.jsx';
import GalleryList from './gallery/GalleryList.jsx';
import GalleryMaps from './gallery/GalleryMaps.jsx';
import { useGalleryPageState } from '../hooks/useGalleryPageState.js';
import Button from './primitives/Button.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import Page from './primitives/Page.jsx';
import Segmented from './primitives/Segmented.jsx';
import { SP } from './theme.js';

/**
 * One shared page frame + identity header for BOTH tabs. The title/subtitle
 * and the cross-sell "Forge your own" CTA used to live inside GalleryList, so
 * the Maps tab had no header and the two tabs ran at different widths. Lifting
 * them here gives both tabs a single width/identity frame (P12) and a single
 * page-level header (P6). The forge CTA is SECONDARY here: the gallery's primary
 * job is browse/open a dossier, not divert to the generator (P8). The generator
 * owns the loud primary on its own surface.
 */
function GalleryHeader({ onNavigate }) {
  return (
    <PageHeader
      eyebrow={tr('gallery.eyebrow')}
      title={tr('gallery.pageTitle')}
      subtitle={tr('gallery.pageSubtitle')}
      actions={
        <Button
          variant="secondary"
          icon={<Sparkles size={14} />}
          onClick={() => onNavigate?.('generate')}
        >
          {tr('gallery.forgeYourOwn')}
        </Button>
      }
    />
  );
}

export default function GalleryPage({ onNavigate, routeSlug = null }) {
  const [tab, setTab] = useState('settlements');
  const {
    auth,
    items,
    total,
    hasMore,
    listLoading,
    listError,
    sort,
    setSort,
    search,
    setSearch,
    filters,
    activeSlug,
    dossier,
    dossierLoading,
    dossierError,
    voteBusyId,
    reportBusyId,
    importBusyId,
    importedSlugs,
    actionError,
    actionNotice,
    loadMore,
    openDossier,
    backToList,
    toggleArrayFilter,
    toggleBoolFilter,
    setPopulationBand,
    clearFilters,
    voteOn,
    reportOn,
    importDossier,
    setDossierCommentCount,
  } = useGalleryPageState(routeSlug);

  if (activeSlug) {
    // Resilience: a public dossier is third-party, server-projected data — a
    // malformed gallery payload (bad chronicle, missing fields) must degrade to
    // a recoverable fallback, not blank the app. resetKey is the slug so opening
    // a different dossier clears a stale error.
    return (
      <FeatureErrorBoundary
        label="GalleryPage.detail"
        kind="react.render.gallery"
        fallbackTitle="This gallery dossier could not be displayed."
        resetKeys={[activeSlug]}
      >
        <GalleryDetail
          dossier={dossier}
          loading={dossierLoading}
          error={dossierError}
          actionError={actionError}
          actionNotice={actionNotice}
          onBack={backToList}
          onOpen={openDossier}
          onVote={voteOn}
          onReport={reportOn}
          onImport={importDossier}
          importBusy={!!importBusyId}
          imported={!!(dossier?.slug && importedSlugs?.has(dossier.slug))}
          onCommentCountChange={setDossierCommentCount}
          voteBusy={!!voteBusyId}
          reportBusy={!!reportBusyId}
          auth={auth}
          onNavigate={onNavigate}
        />
      </FeatureErrorBoundary>
    );
  }

  return (
    <Page>
      <GalleryHeader onNavigate={onNavigate} />
      {/* The two tabs are a view switch (Settlements / Maps), not a header
          action, so they sit below the page header. Segmented reads the
          selected state in two channels (fill + weight) per a11y (P7). */}
      <div style={{ marginBottom: SP.lg }}>
        <Segmented
          options={[{ id: 'settlements', label: 'Settlements' }, { id: 'maps', label: 'Maps' }]}
          value={tab}
          onChange={setTab}
          ariaLabel="Gallery view"
        />
      </div>
      {/* Resilience: the browsing list + the maps grid render server-projected
          community payloads. A throw in either degrades to a recoverable
          fallback in place of the panel, not a full-app white screen. resetKey
          is the active tab so toggling tabs clears a stale error. */}
      <FeatureErrorBoundary
        label="GalleryPage.list"
        kind="react.render.gallery"
        fallbackTitle="The gallery could not be displayed."
        resetKeys={[tab]}
      >
      {tab === 'maps' ? (
        <GalleryMaps onNavigate={onNavigate} />
      ) : (
        <GalleryList
          items={items}
          total={total}
          hasMore={hasMore}
          listLoading={listLoading}
          listError={listError}
          actionError={actionError}
          actionNotice={actionNotice}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
          filters={filters}
          voteBusyId={voteBusyId}
          loadMore={loadMore}
          openDossier={openDossier}
          toggleArrayFilter={toggleArrayFilter}
          toggleBoolFilter={toggleBoolFilter}
          setPopulationBand={setPopulationBand}
          clearFilters={clearFilters}
          voteOn={voteOn}
          onNavigate={onNavigate}
          isSignedIn={!!auth?.user}
        />
      )}
      </FeatureErrorBoundary>
    </Page>
  );
}
