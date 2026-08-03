import React from 'react';

import { t } from '../../copy/index.js';
import { TIER_LABELS } from '../new/design.js';
import {
  BLUE, BLUE_BG, BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GREEN, GREEN_BG, INK, MUTED, PAGE_MAX, RED, RED_BG, SECOND, SP, sans, serif_ } from '../theme.js';
import { formatDate, formatNumber, GALLERY_RESPONSIVE_CSS, human, shareGalleryDossier } from './galleryUtils.js';
import { useStore } from '../../store/index.js';
import { sanitizeGalleryHtml } from '../../lib/sanitizeGalleryHtml.js';
import { resolveSettlementTerrain } from '../../domain/resolveTerrain.js';
import { setSharedDossierMeta } from '../../lib/seoDossier.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import AlivenessBadge from './AlivenessBadge.jsx';
import Button from '../primitives/Button.jsx';
import DesktopOnlyGate from '../primitives/DesktopOnlyGate.jsx';
import ShareToGallery from '../ShareToGallery.jsx';
import GalleryComments from './GalleryComments.jsx';
import GalleryImage from './GalleryImage.jsx';
import GalleryMoreByCreator from './GalleryMoreByCreator.jsx';
import GalleryReactionChips from './GalleryReactionChips.jsx';
import GalleryReportDialog from './GalleryReportDialog.jsx';
import VoteButton from './VoteButton.jsx';

const PublicDossierView = React.lazy(() => import('../PublicDossierView.jsx'));

function StatusMessage({ tone = 'info', children }) {
  const cfg = tone === 'success'
    ? { border: GREEN, bg: GREEN_BG, color: GREEN }
    : tone === 'danger'
      ? { border: RED, bg: RED_BG, color: RED }
      : { border: BLUE, bg: BLUE_BG, color: BLUE };
  return (
    // Announce to screen readers, matching GalleryList's StatusMessage (this
    // detail-page copy was silent): an error is assertive, success/info polite.
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-live={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ border: `1px solid ${cfg.border}`, background: cfg.bg, color: cfg.color, padding: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}
    >
      {children}
    </div>
  );
}

export default function GalleryDetail({
  dossier,
  loading,
  error,
  actionError,
  actionNotice,
  onBack,
  onOpen,
  onVote,
  onReact,
  onReport,
  onImport,
  onCommentCountChange,
  voteBusy,
  reactionBusyKey,
  reportBusy,
  importBusy,
  imported,
  auth,
  onNavigate,
}) {
  // Mobile is a read + light-act surface for a dossier: the public view, Import,
  // Vote, Share, and Report stay live, but the owner's ShareToGallery listing
  // editor (a full authoring form) defers to desktop.
  const isMobile = useIsMobile();
  const [shared, setShared] = React.useState(false);
  const onShare = async () => {
    const r = await shareGalleryDossier({ slug: dossier?.slug, name: dossier?.name || dossier?.settlement?.name });
    if (r.ok) { setShared(true); setTimeout(() => setShared(false), 1600); }
  };
  // §4 — owner controls. The viewer owns this dossier iff one of their saved
  // settlements is published under this slug (saves carry public_slug). Pure
  // client; the public dossier itself is anonymized.
  const savedSettlements = useStore(s => s.savedSettlements);
  const ownedSave = (auth?.user && dossier?.slug)
    ? (savedSettlements || []).find(sv => sv.public_slug && sv.public_slug === dossier.slug)
    : null;

  // Rich unfurl for the share loop: once the (already public, sanitized) dossier
  // is loaded, upgrade the document head to the settlement's real name + coarse
  // facts and emit its CreativeWork JSON-LD. applyDocumentHead already pointed
  // og:image at the dynamic card from the slug; this adds the named title so the
  // share reads as THIS settlement, not the generic gallery. The next route
  // change's applyDocumentHead resets everything.
  React.useEffect(() => {
    if (dossier?.slug) setSharedDossierMeta(dossier);
  }, [dossier]);

  if (loading) {
    // Skeleton the dossier open so the detail load reads as a page, not a bare
    // sentence: an aria-hidden hero placeholder (mirrors the GalleryImage hero
    // height) inside the page container, with the polite announce on the wrapper.
    return (
      <div role="status" aria-live="polite" style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, display: 'grid', gap: SP.lg }}>
        <div aria-hidden="true" style={{ border: `1px solid ${BORDER}`, background: CARD, minHeight: 310, boxShadow: '0 4px 14px rgba(27,20,8,0.08)' }} />
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm, textAlign: 'center' }}>
          Opening settlement...
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.xl, display: 'grid', gap: SP.md }}>
        <Button variant="ghost" onClick={onBack} style={{ justifySelf: 'start' }}>
          {t('gallery.backToList')}
        </Button>
        <div style={{ border: `1px solid ${BORDER}`, background: CARD, color: BODY, padding: SP.xl, textAlign: 'center' }}>
          {error || 'This settlement is not available.'}
        </div>
      </div>
    );
  }

  const meta = [
    TIER_LABELS[dossier.tier] || human(dossier.tier),
    dossier.settlement?.population ? `${formatNumber(dossier.settlement.population)} population` : null,
    // THE ONE terrain read (domain/resolveTerrain.js). R-4 lane P-6, DECLARED
    // DISPLAY SHIFT (measured, vetoable by restoring the old chain on this line):
    // the old chain led with the never-written config.terrain, so this meta line
    // showed NO terrain for any wizard-generated dossier, and showed a stale one
    // for a legacy save whose config.terrain contradicted its rolled terrainType.
    resolveSettlementTerrain(dossier.settlement),
    dossier.publishedAt ? `shared ${formatDate(dossier.publishedAt)}` : null,
  ].filter(Boolean);

  // Importing another DM's settlement is a premium feature (parity with map
  // import); sharing your own to the gallery is free. tier==='premium' covers
  // Cartographer + Founder; dev/admin pass for testing.
  const isPremium = auth?.tier === 'premium' || auth?.role === 'developer' || auth?.role === 'admin';
  // Base eligibility: an owner-opted-in importable dossier the signed-in viewer
  // doesn't already own. A non-premium viewer still sees an "Import (premium)"
  // upgrade next-step (not a dead-end) that routes to pricing.
  const importEligible = dossier.importable && auth?.user && !ownedSave;

  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, display: 'grid', gap: SP.lg }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <Button variant="ghost" onClick={onBack} style={{ justifySelf: 'start' }}>
        {t('gallery.backToList')}
      </Button>
      {actionError && <StatusMessage tone="danger">{actionError}</StatusMessage>}
      {actionNotice && <StatusMessage tone="success">{actionNotice}</StatusMessage>}
      {ownedSave && (
        <div style={{ border: `1px solid ${GOLD}`, background: CARD_ALT, padding: SP.md, display: 'grid', gap: SP.sm }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Your gallery listing
          </div>
          <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
            This is your published settlement. Edit the listing details (image, description, tags, DM-private visibility) or remove it from the gallery. The public dossier always reflects your current saved settlement.
          </p>
          {/* The listing editor (image crop, description, tags, visibility) is a
              full authoring form, so on mobile it defers to desktop. The public
              dossier below stays fully readable, and Vote/Share/Report stay live,
              so a mobile owner can still read and act on their listing. */}
          {isMobile ? (
            <DesktopOnlyGate
              title="Edit your listing on a larger screen"
              message="The listing editor (cover image, description, tags, and visibility) has room to work on desktop. Open this dossier there to change how your settlement appears in the gallery."
            />
          ) : (
            <ShareToGallery
              saveId={ownedSave.id}
              isPublic={ownedSave.is_public}
              publicSlug={ownedSave.public_slug}
              visibility={ownedSave.visibility}
              unlistedSlug={ownedSave.unlisted_slug}
              campaignState={ownedSave.campaignState}
              settlement={ownedSave.settlement}
              galleryDescription={ownedSave.gallery_description}
              galleryTitle={ownedSave.gallery_title}
              galleryImageUrl={ownedSave.gallery_image_url}
              galleryImageAlt={ownedSave.gallery_image_alt}
              galleryTags={ownedSave.gallery_tags}
              galleryShareNarrated={ownedSave.gallery_share_narrated}
              galleryShareDm={ownedSave.gallery_share_dm}
              galleryImportable={ownedSave.gallery_importable}
              galleryMemberOverrides={ownedSave.gallery_member_overrides}
              // Re-fetch the dossier in place after a save so the public view
              // reflects the new narrated / DM-visibility choices — WITHOUT a full
              // page reload (which would land on a fresh gallery URL where saves
              // aren't hydrated, dropping this very card until you navigate away).
              onSaved={() => { if (dossier?.slug) onOpen?.(dossier.slug, { replace: true }); }}
            />
          )}
        </div>
      )}
      <article style={{ overflow: 'hidden', border: `1px solid ${BORDER}`, background: CARD }}>
        <div className="gallery-detail-hero" style={{ display: 'grid', gap: 0 }}>
          <GalleryImage item={dossier} height={310} />
          <div style={{ padding: SP.xl, display: 'grid', gap: SP.md, alignContent: 'center' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {dossier.tags?.map(tag => (
                <span key={tag} style={{ border: `1px solid ${BORDER2}`, background: CARD_ALT, color: SECOND, padding: '3px 7px', fontFamily: sans, fontSize: FS.xxs, fontWeight: 850, textTransform: 'capitalize' }}>
                  {human(tag)}
                </span>
              ))}
            </div>
            <h1 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['36'], lineHeight: 1.05, fontWeight: 750 }}>
              {dossier.name || dossier.settlement?.name || t('gallery.untitled')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', color: MUTED, fontFamily: sans, fontSize: FS.sm, fontWeight: 850, textTransform: 'capitalize' }}>
              <span>{meta.join(' / ')}</span>
              {/* Aliveness (GALLERY-2 phase 2) — renders nothing when un-stamped. */}
              <AlivenessBadge score={dossier.aliveness} size="md" />
            </div>
            {dossier.description ? (
              <div
                className="sf-rich"
                style={{ margin: 0, color: BODY, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.55 }}
                dangerouslySetInnerHTML={{ __html: sanitizeGalleryHtml(dossier.description) }}
              />
            ) : (
              <p style={{ margin: 0, color: MUTED, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.5, fontStyle: 'italic' }}>
                No public creator description was added.
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              {importEligible && isPremium ? (
                <Button
                  variant={imported ? 'success' : 'primary'}
                  size="md"
                  onClick={() => onImport?.(dossier)}
                  busy={importBusy}
                  disabled={imported || importBusy}
                  title={imported ? 'Imported to your library' : 'Clone the public-safe version into your library'}
                >
                  {imported ? 'Imported' : 'Import'}
                </Button>
              ) : importEligible ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate?.('pricing')}
                  title="Importing a settlement into your library is a Cartographer feature"
                >
                  Import (premium)
                </Button>
              ) : (
                // No import path (signed out, or the dossier isn't importable):
                // the highest-intent page is never a dead-end — offer a forge
                // next-step instead of nothing (P9).
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate?.('generate')}
                  title="Forge a settlement of your own"
                >
                  {t('gallery.forgeYourOwn')}
                </Button>
              )}
              <VoteButton
                count={dossier.netVotes}
                voted={dossier.voteState?.voted}
                disabled={voteBusy}
                onClick={() => onVote(dossier)}
              />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
                {formatNumber(dossier.viewCount)} views
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
                {formatNumber(dossier.commentCount)} comments
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                title="Share this dossier"
                style={shared ? { color: GREEN } : undefined}
              >
                {shared ? 'Link copied' : 'Share'}
              </Button>
              <GalleryReportDialog
                dossier={dossier}
                auth={auth}
                disabled={reportBusy}
                onReport={onReport}
              />
            </div>
            {/* Structured reactions (GALLERY-2 phase 2) — the six fixed phrases.
                Rendered for everyone (anon included, counts visible); the press
                itself routes through the hook's sign-in guard — caps bind
                actions, never rendering. */}
            <GalleryReactionChips
              state={dossier.reactionState}
              itemId={dossier.id}
              busyKey={reactionBusyKey}
              onReact={key => onReact?.(dossier, key)}
            />
          </div>
        </div>
      </article>
      <div className="gallery-detail-body" style={{ display: 'grid', gap: SP.lg, alignItems: 'start' }}>
        <section style={{ minWidth: 0 }}>
          <React.Suspense fallback={<p style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Opening the dossier…</p>}>
            <PublicDossierView dossier={dossier} showHeader={false} />
          </React.Suspense>
        </section>
        <aside style={{ display: 'grid', gap: SP.lg }}>
          <GalleryComments dossier={dossier} auth={auth} onCountChange={onCommentCountChange} />
          <GalleryMoreByCreator items={dossier.moreByCreator || []} onOpen={onOpen} />
        </aside>
      </div>
    </div>
  );
}
