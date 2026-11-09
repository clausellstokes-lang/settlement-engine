/**
 * PartyLinkView.jsx — the players' page: what a party link (an unlisted slug,
 * `/gallery/<unlisted_slug>` or `/gallery?slug=<unlisted_slug>`) renders.
 *
 * THE OWNER'S WORD (2026-11-09, SW-B7 row (b)): "the private view/link for players
 * doesn't have any of the vote and comment stuff that shows on the gallery since
 * it's not for showing publicly and for voting." So this page carries NO social
 * chrome — no votes, comments, reactions, view count, share-to-social, Import or
 * "more by this creator". It keeps the title, the author's name, the dossier in
 * the player view (PublicDossierView: player view unless the DM revealed DM
 * content, the veil applied upstream in sanitizeDossier) and a quiet Report link
 * (moderation covers unlisted rows, migration 171).
 *
 * GalleryDetail routes here when `dossier.unlisted` is set; the gallery's own
 * detail page is untouched for listed dossiers.
 */
import React from 'react';

import { t } from '../copy/index.js';
import { BORDER, FS, INK, MUTED, PAGE_MAX, SP, sans, serif_ } from './theme.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize } from '../design/proseScale.js';
import GalleryReportDialog from './gallery/GalleryReportDialog.jsx';

const PublicDossierView = React.lazy(() => import('./PublicDossierView.jsx'));

export default function PartyLinkView({ dossier, auth, onReport, reportBusy, statusLine = null }) {
  const mobile = useIsMobile();
  const title = dossier?.name || dossier?.settlement?.name || t('gallery.untitled');
  const author = typeof dossier?.authorName === 'string' && dossier.authorName.trim() ? dossier.authorName.trim() : null;
  return (
    <div data-testid="party-link-view" style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, display: 'grid', gap: SP.lg }}>
      {statusLine}
      <header style={{ display: 'grid', gap: SP.xs, borderBottom: `1px solid ${BORDER}`, paddingBottom: SP.md }}>
        <h1 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['36'], lineHeight: 1.05, fontWeight: 750 }}>
          {title}
        </h1>
        <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700 }}>
          {author ? `Shared with the players by ${author}. ` : 'Shared with the players. '}
          This link is private; the town is not listed in the gallery through it.
        </p>
      </header>
      <section style={{ minWidth: 0 }}>
        <React.Suspense fallback={<p style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Opening the dossier…</p>}>
          <PublicDossierView dossier={dossier} showHeader={false} />
        </React.Suspense>
      </section>
      <footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <GalleryReportDialog dossier={dossier} auth={auth} disabled={reportBusy} onReport={onReport} />
      </footer>
    </div>
  );
}
