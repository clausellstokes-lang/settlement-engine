/**
 * GalleryPage.jsx — Community settlement gallery coordinator.
 *
 * Data and page state live in useGalleryPageState; focused gallery
 * components handle the browsing list, dossier reader, comments, and reports.
 */

import { useState } from 'react';
import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import GalleryCampaigns from './gallery/GalleryCampaigns.jsx';
import GalleryDetail from './gallery/GalleryDetail.jsx';
import GalleryList from './gallery/GalleryList.jsx';
import GalleryMaps from './gallery/GalleryMaps.jsx';
import { useGalleryPageState } from '../hooks/useGalleryPageState.js';
import Button from './primitives/Button.jsx';
import { SP, PAGE_MAX } from './theme.js';

function GalleryTabs({ tab, setTab }) {
  // GALLERY-2 phase 2: campaign shares (share_kind 'map_with_campaign') get
  // their own tab; the Maps tab narrows to blank maps (kind 'map').
  const tabs = [
    { id: 'settlements', label: 'Settlements' },
    { id: 'maps', label: 'Maps' },
    { id: 'campaigns', label: 'Campaigns' },
  ];
  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.md}px ${SP.lg}px 0`, display: 'flex', gap: SP.xs }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <Button
            key={t.id}
            variant={active ? 'gold' : 'ghost'}
            size="md"
            onClick={() => setTab(t.id)}
            aria-pressed={active}
          >
            {t.label}
          </Button>
        );
      })}
    </div>
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
    reactionBusyKey,
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
    clearFilters,
    voteOn,
    reactOn,
    reportOn,
    importDossier,
    setDossierCommentCount,
  } = useGalleryPageState(routeSlug);

  if (activeSlug) {
    // Resilience: a public dossier is third-party, server-projected data — a
    // malformed gallery payload (bad chronicle, missing fields) must degrade to
    // a recoverable in-place fallback, not blank the whole app. resetKey is the
    // slug so opening a different dossier clears a stale error.
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
          onReact={reactOn}
          onReport={reportOn}
          onImport={importDossier}
          onCommentCountChange={setDossierCommentCount}
          voteBusy={!!voteBusyId}
          reactionBusyKey={reactionBusyKey}
          reportBusy={!!reportBusyId}
          importBusy={!!importBusyId}
          imported={!!(dossier?.slug && importedSlugs?.has(dossier.slug))}
          onNavigate={onNavigate}
          auth={auth}
        />
      </FeatureErrorBoundary>
    );
  }

  return (
    <>
      <GalleryTabs tab={tab} setTab={setTab} />
      {/* Resilience: the browsing list + the maps grid render server-projected
          community payloads. A throw in either degrades to a recoverable
          in-place fallback rather than a full-app white screen. resetKey is the
          active tab so toggling tabs clears a stale error. */}
      <FeatureErrorBoundary
        label="GalleryPage.list"
        kind="react.render.gallery"
        fallbackTitle="The gallery could not be displayed."
        resetKeys={[tab]}
      >
        {tab === 'maps' ? (
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.lg }}>
            <GalleryMaps onNavigate={onNavigate} />
          </div>
        ) : tab === 'campaigns' ? (
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.lg }}>
            <GalleryCampaigns onNavigate={onNavigate} />
          </div>
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
            clearFilters={clearFilters}
            voteOn={voteOn}
            onNavigate={onNavigate}
            isSignedIn={!!auth?.user}
          />
        )}
      </FeatureErrorBoundary>
    </>
  );
}
