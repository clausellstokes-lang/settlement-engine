import React from 'react';
import { Check, ChevronLeft, Eye, MessageCircle, Share2, Download } from 'lucide-react';

import { t } from '../../copy/index.js';
import { TIER_LABELS } from '../new/design.js';
import {
  BLUE,
  BLUE_BG,
  BODY,
  BORDER,
  BORDER2,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GREEN,
  GREEN_BG,
  INK,
  MUTED,
  PAGE_MAX,
  R,
  RED,
  RED_BG,
  SECOND,
  SP,
  sans,
  serif_,
} from '../theme.js';
import { formatDate, formatNumber, GALLERY_RESPONSIVE_CSS, human, shareGalleryDossier } from './galleryUtils.js';
import { useStore } from '../../store/index.js';
import { sanitizeGalleryHtml } from '../../lib/sanitizeGalleryHtml.js';
import Button from '../primitives/Button.jsx';
import ShareToGallery from '../ShareToGallery.jsx';
import GalleryComments from './GalleryComments.jsx';
import GalleryImage from './GalleryImage.jsx';
import GalleryMoreByCreator from './GalleryMoreByCreator.jsx';
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
    <div style={{ border: `1px solid ${cfg.border}`, borderRadius: R.md, background: cfg.bg, color: cfg.color, padding: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
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
  onReport,
  onImport,
  onCommentCountChange,
  voteBusy,
  reportBusy,
  importBusy,
  imported,
  auth,
}) {
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
  if (loading) {
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.xl, color: MUTED, fontFamily: sans, fontSize: FS.sm, textAlign: 'center' }}>
        Opening settlement...
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.xl, display: 'grid', gap: SP.md }}>
        <Button variant="ghost" onClick={onBack} icon={<ChevronLeft size={14} />} style={{ justifySelf: 'start' }}>
          {t('gallery.backToList')}
        </Button>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, color: BODY, padding: SP.xl, textAlign: 'center' }}>
          {error || 'This settlement is not available.'}
        </div>
      </div>
    );
  }

  const meta = [
    TIER_LABELS[dossier.tier] || human(dossier.tier),
    dossier.settlement?.population ? `${formatNumber(dossier.settlement.population)} population` : null,
    dossier.settlement?.config?.terrain || dossier.settlement?.terrain,
    dossier.publishedAt ? `shared ${formatDate(dossier.publishedAt)}` : null,
  ].filter(Boolean);

  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, display: 'grid', gap: SP.lg }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <Button variant="ghost" onClick={onBack} icon={<ChevronLeft size={14} />} style={{ justifySelf: 'start' }}>
        {t('gallery.backToList')}
      </Button>
      {actionError && <StatusMessage tone="danger">{actionError}</StatusMessage>}
      {actionNotice && <StatusMessage tone="success">{actionNotice}</StatusMessage>}
      {ownedSave && (
        <div style={{ border: `1px solid ${GOLD}`, borderRadius: R.lg, background: CARD_ALT, padding: SP.md, display: 'grid', gap: SP.sm }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Your gallery listing
          </div>
          <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
            This is your published settlement. Edit the listing details (image, description, tags, DM-private visibility) or remove it from the gallery. The public dossier always reflects your current saved settlement.
          </p>
          <ShareToGallery
            saveId={ownedSave.id}
            isPublic={ownedSave.is_public}
            publicSlug={ownedSave.public_slug}
            campaignState={ownedSave.campaignState}
            settlement={ownedSave.settlement}
            galleryDescription={ownedSave.gallery_description}
            galleryImageUrl={ownedSave.gallery_image_url}
            galleryImageAlt={ownedSave.gallery_image_alt}
            galleryTags={ownedSave.gallery_tags}
            galleryShareNarrated={ownedSave.gallery_share_narrated}
            galleryShareDm={ownedSave.gallery_share_dm}
            galleryImportable={ownedSave.gallery_importable}
            // Re-fetch the dossier in place after a save so the public view
            // reflects the new narrated / DM-visibility choices — WITHOUT a full
            // page reload (which would land on a fresh gallery URL where saves
            // aren't hydrated, dropping this very card until you navigate away).
            onSaved={() => { if (dossier?.slug) onOpen?.(dossier.slug, { replace: true }); }}
          />
        </div>
      )}
      <article style={{ overflow: 'hidden', border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD }}>
        <div className="gallery-detail-hero" style={{ display: 'grid', gap: 0 }}>
          <GalleryImage item={dossier} height={310} />
          <div style={{ padding: SP.xl, display: 'grid', gap: SP.md, alignContent: 'center' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {dossier.tags?.map(tag => (
                <span key={tag} style={{ border: `1px solid ${BORDER2}`, borderRadius: 6, background: CARD_ALT, color: SECOND, padding: '3px 7px', fontFamily: sans, fontSize: FS.xxs, fontWeight: 850, textTransform: 'capitalize' }}>
                  {human(tag)}
                </span>
              ))}
            </div>
            <h1 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['36'], lineHeight: 1.05, fontWeight: 750 }}>
              {dossier.name || dossier.settlement?.name || t('gallery.untitled')}
            </h1>
            <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm, fontWeight: 850, textTransform: 'capitalize' }}>
              {meta.join(' / ')}
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
            {/* §S4 — the public-safe realm-arc digest (war/pantheon epic). A DERIVED
                scalar string, NOT the raw chronicle; rendered as plain text. */}
            {dossier.realmArcSummary ? (
              <div style={{ border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, borderRadius: R.md, background: CARD_ALT, padding: SP.md }}>
                <div style={{ color: GOLD, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  Realm Chronicle
                </div>
                <p style={{ margin: 0, color: BODY, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.55 }}>
                  {dossier.realmArcSummary}
                </p>
              </div>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              <VoteButton
                count={dossier.netVotes}
                voted={dossier.voteState?.voted}
                disabled={voteBusy}
                onClick={() => onVote(dossier)}
              />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
                <Eye size={13} /> {formatNumber(dossier.viewCount)} views
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
                <MessageCircle size={13} /> {formatNumber(dossier.commentCount)} comments
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                title="Share this dossier"
                icon={shared ? <Check size={13} /> : <Share2 size={13} />}
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
              {/* Import: clone the public-safe dossier into your own library.
                  Only when the owner opted in (dossier.importable), you're signed
                  in, and you don't already own this one. Server-gated by the
                  import RPC (048); the save-limit trigger enforces the slot cap. */}
              {dossier.importable && auth?.user && !ownedSave && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => onImport?.(dossier)}
                  busy={importBusy}
                  disabled={imported || importBusy}
                  title={imported ? 'Imported to your library' : 'Clone the public-safe version into your library'}
                  icon={imported ? <Check size={13} /> : <Download size={13} />}
                  style={imported ? { color: GREEN } : undefined}
                >
                  {imported ? 'Imported' : 'Import'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>
      <div className="gallery-detail-body" style={{ display: 'grid', gap: SP.lg, alignItems: 'start' }}>
        <section style={{ minWidth: 0 }}>
          <React.Suspense fallback={<p style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Loading dossier...</p>}>
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
