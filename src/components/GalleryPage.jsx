/**
 * GalleryPage.jsx — Community settlement gallery coordinator.
 *
 * Data and page state live in useGalleryPageState; focused gallery
 * components handle the browsing list, dossier reader, comments, and reports.
 */

import { useState } from 'react';
import GalleryDetail from './gallery/GalleryDetail.jsx';
import GalleryList from './gallery/GalleryList.jsx';
import GalleryMaps from './gallery/GalleryMaps.jsx';
import { useGalleryPageState } from '../hooks/useGalleryPageState.js';
import { GOLD, GOLD_BG, INK, SECOND, BORDER, sans, SP, R, FS, PAGE_MAX } from './theme.js';

function GalleryTabs({ tab, setTab }) {
  const tabs = [{ id: 'settlements', label: 'Settlements' }, { id: 'maps', label: 'Maps' }];
  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.md}px ${SP.lg}px 0`, display: 'flex', gap: SP.xs }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
            padding: `${SP.xs}px ${SP.md}px`, borderRadius: R.md, cursor: 'pointer', fontFamily: sans,
            fontSize: FS.sm, fontWeight: active ? 700 : 500,
            border: `1px solid ${active ? GOLD : BORDER}`, background: active ? GOLD_BG : 'transparent',
            color: active ? INK : SECOND,
          }}>{t.label}</button>
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
    <>
      <GalleryTabs tab={tab} setTab={setTab} />
      {tab === 'maps' ? (
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.lg }}>
          <GalleryMaps onNavigate={onNavigate} />
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
    </>
  );
}
