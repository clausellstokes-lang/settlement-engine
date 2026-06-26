/**
 * MapGalleryDetail.jsx — the detail view for a shared MAP / map+campaign, the
 * parallel of GalleryDetail for the settlement gallery.
 *
 * Renders a read-only header (cover image, a kind pill, the name, the rich
 * description, tags, and the member count), the realm-arc summary in a gold
 * "Realm Chronicle" callout (for campaign shares), then the shared living-world
 * panel (CampaignStatePanel — campaign + shared-world only) and the member list
 * (MemberSettlementsList), plus the import/share affordances. The import label
 * keys on kind: "Import map" for a blank map, "Import map and settlements" for a
 * map+campaign.
 *
 * The detail object is the get_gallery_map projection (slug, name, kind,
 * description, tags, imageUrl, imageAlt, realmArcSummary, world, members). It is
 * already public-safe; this is a presentational shell that wires the affordances
 * the parent passes (import / share / back) to the sub-panels.
 */

import { useState } from 'react';
import { Check, ChevronLeft, Download, Share2 } from 'lucide-react';

import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GOLD_TXT,
  INK,
  MUTED,
  PAGE_MAX,
  PROSE_MAX,
  R,
  SECOND,
  SP,
  sans,
  serif_,
} from '../theme.js';
import { sanitizeGalleryHtml } from '../../lib/sanitizeGalleryHtml.js';
import Button from '../primitives/Button.jsx';
import { GALLERY_RESPONSIVE_CSS, human, shareGalleryDossier } from './galleryUtils.js';
import GalleryImage from './GalleryImage.jsx';
import CampaignStatePanel from './CampaignStatePanel.jsx';
import MemberSettlementsList from './MemberSettlementsList.jsx';

/** The kind pill: gold for a map+campaign share, neutral for a blank map. */
function KindPill({ kind }) {
  const isCampaign = kind === 'map_with_campaign';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', borderRadius: R.sm,
      padding: `2px ${SP.xs}px`, fontFamily: sans, fontSize: FS.xs, fontWeight: 900,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      color: isCampaign ? GOLD_TXT : SECOND,
      background: CARD_ALT,
      border: `1px solid ${isCampaign ? GOLD : BORDER}`,
    }}>
      {isCampaign ? 'Map and campaign' : 'Map only'}
    </span>
  );
}

/**
 * @param {Object} props
 * @param {Record<string, any> | null} props.detail  the get_gallery_map projection
 *   (slug, name, kind, description, tags, imageUrl, imageAlt, realmArcSummary,
 *   world {snapshot, sections} | null, members[]).
 * @param {boolean} [props.loading]  the detail is being fetched.
 * @param {string | null} [props.error]  a fetch/availability error to show.
 * @param {() => void} props.onBack  return to the map list.
 * @param {(detail: any) => void} [props.onImport]  import this map (label keys on kind).
 * @param {boolean} [props.importBusy]  the import is in flight.
 * @param {boolean} [props.imported]  the import has completed.
 * @param {boolean} [props.importEligible]  the owner opted in AND the viewer may import.
 * @param {string | null} [props.importNotice]  a calm note shown in place of the
 *   import button when it is not eligible (e.g. view-only, or premium-gated).
 */
export default function MapGalleryDetail({
  detail,
  loading,
  error,
  onBack,
  onImport,
  importBusy,
  imported,
  importEligible,
  importNotice,
}) {
  const [shared, setShared] = useState(false);
  const onShare = async () => {
    const r = await shareGalleryDossier({ slug: detail?.slug, name: detail?.name });
    if (r.ok) { setShared(true); setTimeout(() => setShared(false), 1600); }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.xl, color: MUTED, fontFamily: sans, fontSize: FS.sm, textAlign: 'center' }}>
        Opening map...
      </div>
    );
  }

  if (error || !detail?.slug) {
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: SP.xl, display: 'grid', gap: SP.md }}>
        <Button variant="ghost" onClick={onBack} icon={<ChevronLeft size={14} />} style={{ justifySelf: 'start' }}>
          Back to maps
        </Button>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, color: BODY, padding: SP.xl, textAlign: 'center' }}>
          {error || 'This map is no longer available.'}
        </div>
      </div>
    );
  }

  const isCampaign = detail.kind === 'map_with_campaign';
  const members = Array.isArray(detail.members) ? detail.members : [];
  // The shared living world is projected only for a campaign share whose owner
  // opted in (get_gallery_map returns world=null otherwise).
  const world = isCampaign ? detail.world : null;
  const tags = Array.isArray(detail.tags) ? detail.tags : [];
  const importLabel = isCampaign ? 'Import map and settlements' : 'Import map';

  const meta = [
    isCampaign ? 'Map and campaign' : 'Blank map',
    members.length > 0 ? `${members.length} settlement${members.length === 1 ? '' : 's'}` : null,
  ].filter(Boolean);

  return (
    <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px ${SP.lg}px`, display: 'grid', gap: SP.lg }}>
      <style>{GALLERY_RESPONSIVE_CSS}</style>
      <Button variant="ghost" onClick={onBack} icon={<ChevronLeft size={14} />} style={{ justifySelf: 'start' }}>
        Back to maps
      </Button>

      <article style={{ overflow: 'hidden', border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD }}>
        <div className="gallery-detail-hero" style={{ display: 'grid', gap: 0 }}>
          <GalleryImage item={detail} height={310} />
          <div style={{ padding: SP.xl, display: 'grid', gap: SP.md, alignContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
              <KindPill kind={detail.kind} />
            </div>
            <h1 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['36'], lineHeight: 1.05, fontWeight: 750 }}>
              {detail.name || 'Untitled map'}
            </h1>
            <div style={{ color: BODY, fontFamily: sans, fontSize: FS.sm, fontWeight: 850 }}>
              {meta.join(' · ')}
            </div>
            {detail.description ? (
              <div
                className="sf-rich"
                style={{ margin: 0, maxWidth: PROSE_MAX, color: BODY, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.55 }}
                dangerouslySetInnerHTML={{ __html: sanitizeGalleryHtml(detail.description) }}
              />
            ) : (
              <p style={{ margin: 0, maxWidth: PROSE_MAX, color: BODY, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.5, fontStyle: 'italic' }}>
                The creator left no description.
              </p>
            )}
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
                {tags.map(tag => (
                  <span key={tag} style={{ borderRadius: R.md, background: CARD_ALT, color: SECOND, padding: `2px ${SP.xs}px`, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
                    {human(tag)}
                  </span>
                ))}
              </div>
            )}
            {/* The public-safe realm-arc digest (gold callout), for a campaign share. */}
            {detail.realmArcSummary ? (
              <div style={{ borderLeft: `3px solid ${GOLD}`, borderRadius: R.md, background: CARD_ALT, padding: SP.md, maxWidth: PROSE_MAX }}>
                <div style={{ color: GOLD_TXT, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  Realm Chronicle
                </div>
                <p style={{ margin: 0, color: BODY, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.55 }}>
                  {detail.realmArcSummary}
                </p>
              </div>
            ) : null}
            {/* Import / share affordances. Import is offered only when eligible
                (owner opt-in plus a viewer who may import); otherwise a calm note
                stands in for it, never a dead-end button. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              {importEligible ? (
                <Button
                  variant={imported ? 'success' : 'primary'}
                  size="md"
                  onClick={() => onImport?.(detail)}
                  busy={importBusy}
                  disabled={imported || importBusy}
                  icon={imported ? <Check size={13} /> : <Download size={13} />}
                  title={imported ? 'Imported into your library' : 'Clone this map into a new campaign'}
                >
                  {imported ? 'Imported' : importLabel}
                </Button>
              ) : importNotice ? (
                <span style={{ color: BODY, fontFamily: sans, fontSize: FS.sm, fontWeight: 700 }}>
                  {importNotice}
                </span>
              ) : null}
              <Button
                variant={shared ? 'success' : 'ghost'}
                size="sm"
                onClick={onShare}
                title="Share this map"
                icon={shared ? <Check size={13} /> : <Share2 size={13} />}
              >
                {shared ? 'Link copied' : 'Share'}
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* The shared living world (campaign + shared-world opt-in only). Renders
          nothing when world is null. */}
      {world ? (
        <CampaignStatePanel snapshot={world.snapshot} sections={world.sections} />
      ) : null}

      {/* The realm's member settlements. Renders nothing for a blank map. */}
      <MemberSettlementsList members={members} />
    </div>
  );
}
