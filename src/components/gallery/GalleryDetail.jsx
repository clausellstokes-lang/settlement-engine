import React from 'react';
import { Check, ChevronLeft, Share2, Download, Sparkles } from 'lucide-react';

import { t } from '../../copy/index.js';
import { TIER_LABELS } from '../new/design.js';
import {
  BLUE,
  BLUE_BG,
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GOLD_TXT,
  GREEN,
  GREEN_BG,
  INK,
  MUTED,
  PAGE_MAX,
  PROSE_MAX,
  R,
  RED,
  RED_BG,
  SECOND,
  SP,
  sans,
  serif_,
} from '../theme.js';
import { formatDate, formatNumber, GALLERY_RESPONSIVE_CSS, human, shareGalleryDossier, stabilityBand } from './galleryUtils.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { useStore } from '../../store/index.js';
import { sanitizeGalleryHtml } from '../../lib/sanitizeGalleryHtml.js';
import BandPill from '../primitives/BandPill.jsx';
import Button from '../primitives/Button.jsx';
import DesktopOnlyGate from '../primitives/DesktopOnlyGate.jsx';
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
  onNavigate,
}) {
  // Mobile is a read + light-act surface for a gallery dossier: the public
  // view, Import, Vote, Share, and Report stay live, but the owner's
  // ShareToGallery listing-editor (a full authoring form) defers to desktop.
  const isMobile = useIsMobile();
  const [shared, setShared] = React.useState(false);
  const onShare = async () => {
    const r = await shareGalleryDossier({ slug: dossier?.slug, name: dossier?.name || dossier?.settlement?.name });
    if (r.ok) { setShared(true); setTimeout(() => setShared(false), 1600); }
  };
  // Owner controls. The viewer owns this dossier iff one of their saved
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
  // The one living-world fact in the hero: rendered as the single colored/glyphed
  // BandPill token so the header reads "identity + current state", not a static
  // stat line buried above the deep dossier body (P1 / P3).
  const heroStability = stabilityBand(dossier.stability);
  const importEligible = dossier.importable && auth?.user && !ownedSave;

  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, display: 'grid', gap: SP.lg }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <Button variant="ghost" onClick={onBack} icon={<ChevronLeft size={14} />} style={{ justifySelf: 'start' }}>
        {t('gallery.backToList')}
      </Button>
      {actionError && <StatusMessage tone="danger">{actionError}</StatusMessage>}
      {actionNotice && <StatusMessage tone="success">{actionNotice}</StatusMessage>}
      {ownedSave && (
        <div style={{ borderLeft: `3px solid ${GOLD}`, borderRadius: R.md, background: CARD_ALT, padding: SP.md, display: 'grid', gap: SP.sm }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Your gallery listing
          </div>
          <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}>
            This is your published settlement. Edit the listing details (image, description, tags, DM-private visibility) or remove it from the gallery. The public dossier always reflects your current saved settlement.
          </p>
          {/* The listing editor (image crop, description, tags, visibility) is a
              full authoring form, so on mobile it defers to desktop. The public
              dossier below stays fully readable, and Vote/Share/Report stay
              live, so a mobile owner can still read and act on their listing. */}
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
          )}
        </div>
      )}
      <article style={{ overflow: 'hidden', border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD }}>
        <div className="gallery-detail-hero" style={{ display: 'grid', gap: 0 }}>
          {/* On a phone a 310px hero pushes the title below the fold; trim it so
              the name and meta sit in the first viewport. Desktop keeps 310. */}
          <GalleryImage item={dossier} height={isMobile ? 200 : 310} />
          <div style={{ padding: SP.xl, display: 'grid', gap: SP.md, alignContent: 'center' }}>
            <h1 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['36'], lineHeight: 1.05, fontWeight: 750 }}>
              {dossier.name || dossier.settlement?.name || t('gallery.untitled')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: SP.sm, color: BODY, fontFamily: sans, fontSize: FS.sm, fontWeight: 850, textTransform: 'capitalize' }}>
              {heroStability && (
                <BandPill band={heroStability.band} label={heroStability.label} labelBefore="Stability: " size="md" />
              )}
              <span>{meta.join(' · ')}</span>
            </div>
            {dossier.description ? (
              <div
                className="sf-rich"
                style={{ margin: 0, maxWidth: PROSE_MAX, color: BODY, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.55 }}
                dangerouslySetInnerHTML={{ __html: sanitizeGalleryHtml(dossier.description) }}
              />
            ) : (
              <p style={{ margin: 0, maxWidth: PROSE_MAX, color: BODY, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.5, fontStyle: 'italic' }}>
                The creator left no description.
              </p>
            )}
            {dossier.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
                {dossier.tags.map(tag => (
                  <span key={tag} style={{ borderRadius: R.md, background: CARD_ALT, color: SECOND, padding: `2px ${SP.xs}px`, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
                    {human(tag)}
                  </span>
                ))}
              </div>
            )}
            {/* §S4 — the public-safe realm-arc digest (war/pantheon epic). A DERIVED
                scalar string, NOT the raw chronicle; rendered as plain text. */}
            {dossier.realmArcSummary ? (
              <div style={{ borderLeft: `3px solid ${GOLD}`, borderRadius: R.md, background: CARD_ALT, padding: SP.md, maxWidth: PROSE_MAX }}>
                <div style={{ color: GOLD_TXT, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  Realm Chronicle
                </div>
                <p style={{ margin: 0, color: BODY, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.55 }}>
                  {dossier.realmArcSummary}
                </p>
              </div>
            ) : null}
            {/* Action row, two tiers (P8): one high-emphasis primary leads, the
                social/utility controls follow as a subordinate ghost cluster.
                The primary is Import for an eligible importer; otherwise a
                "forge your own" next-step so the highest-intent page is never a
                dead-end (P9). Import is server-gated by the import RPC (048); the
                save-limit trigger enforces the slot cap. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              {importEligible ? (
                <Button
                  variant={imported ? 'success' : 'primary'}
                  size="md"
                  onClick={() => onImport?.(dossier)}
                  busy={importBusy}
                  disabled={imported || importBusy}
                  title={imported ? 'Imported to your library' : 'Clone the public-safe version into your library'}
                  icon={imported ? <Check size={13} /> : <Download size={13} />}
                >
                  {imported ? 'Imported' : 'Import'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate?.('generate')}
                  icon={<Sparkles size={13} />}
                  title="Forge a settlement of your own"
                >
                  {t('gallery.forgeYourOwn')}
                </Button>
              )}
              <VoteButton
                count={dossier.netVotes}
                voted={dossier.voteState?.voted}
                disabled={voteBusy}
                isSignedIn={!!auth?.user}
                onClick={() => onVote(dossier)}
              />
              <Button
                variant={shared ? 'success' : 'ghost'}
                size="sm"
                onClick={onShare}
                title="Share this dossier"
                icon={shared ? <Check size={13} /> : <Share2 size={13} />}
              >
                {shared ? 'Link copied' : 'Share'}
              </Button>
              <GalleryReportDialog
                dossier={dossier}
                auth={auth}
                disabled={reportBusy}
                onReport={onReport}
              />
              {/* Read-only ledger: quiet, trailing, one tier below the controls. */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP.md, marginLeft: 'auto', color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
                <span>
                  {formatNumber(dossier.viewCount)} views
                </span>
                <span>
                  {formatNumber(dossier.commentCount)} comments
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
      {/* Differential spacing (P5): one decisive space-7 (32) gap before the
          dossier body — not two stacked 16s — so the eye reads "identity/social
          header cluster -> deep dossier" as two chunks from rhythm alone, not a
          uniform run leaning on the hero's border to do the grouping. */}
      <div className="gallery-detail-body" style={{ display: 'grid', gap: SP.lg, marginTop: SP.xxxl, alignItems: 'start' }}>
        <section style={{ minWidth: 0, maxWidth: PROSE_MAX, display: 'grid', gap: SP.xxxl }}>
          <React.Suspense fallback={<p style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Loading dossier...</p>}>
            <PublicDossierView dossier={dossier} showHeader={false} />
          </React.Suspense>
          {/* Peak-end (P9): after the reader has consumed the full dossier, the
              scroll ends on the SAME single next-step the hero offered (import if
              eligible, else forge), not a comments box. The hero CTA has scrolled
              far above on a long dossier. */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {importEligible ? (
              <Button
                variant={imported ? 'success' : 'primary'}
                size="md"
                onClick={() => onImport?.(dossier)}
                busy={importBusy}
                disabled={imported || importBusy}
                icon={imported ? <Check size={13} /> : <Download size={13} />}
              >
                {imported ? 'Imported' : 'Import'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate?.('generate')}
                icon={<Sparkles size={13} />}
                title="Forge a settlement of your own"
              >
                {t('gallery.forgeYourOwn')}
              </Button>
            )}
          </div>
        </section>
        <aside style={{ display: 'grid', gap: SP.lg }}>
          <GalleryComments dossier={dossier} auth={auth} onCountChange={onCommentCountChange} />
          <GalleryMoreByCreator items={dossier.moreByCreator || []} onOpen={onOpen} />
        </aside>
      </div>
    </div>
  );
}
