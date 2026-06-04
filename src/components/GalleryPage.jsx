/**
 * GalleryPage.jsx — Community settlement gallery coordinator.
 *
 * Data and page state live in useGalleryPageState; focused gallery
 * components handle the browsing list, dossier reader, comments, and reports.
 */

import GalleryDetail from './gallery/GalleryDetail.jsx';
import GalleryList from './gallery/GalleryList.jsx';
import { useGalleryPageState } from '../hooks/useGalleryPageState.js';

export default function GalleryPage({ onNavigate, routeSlug = null }) {
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
    actionError,
    actionNotice,
    loadMore,
    openDossier,
    backToList,
    toggleArrayFilter,
    toggleBoolFilter,
    clearFilters,
    voteOn,
    reportOn,
    setDossierCommentCount,
  } = useGalleryPageState(routeSlug);

  if (activeSlug) {
    return (
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
        onCommentCountChange={setDossierCommentCount}
        voteBusy={!!voteBusyId}
        reportBusy={!!reportBusyId}
        auth={auth}
      />
    );
  }

  return (
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
    />
  );
}
