import { useMemo, useState } from 'react';

import { t } from '../../copy/index.js';
import { TIER_LABELS } from '../new/design.js';
import {
  BODY,
  BORDER,
  BORDER2,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  INK,
  MUTED,
  SECOND,
  SP,
  sans,
  serif_,
} from '../theme.js';
import { formatDate, formatNumber, human, shareGalleryDossier } from './galleryUtils.js';
import { sanitizeGalleryHtml } from '../../lib/sanitizeGalleryHtml.js';
import AlivenessBadge from './AlivenessBadge.jsx';
import Button from '../primitives/Button.jsx';
import GalleryImage from './GalleryImage.jsx';
import { GalleryReactionSummary } from './GalleryReactionChips.jsx';
import VoteButton from './VoteButton.jsx';

export default function GalleryCard({ item, onOpen, onVote, voting }) {
  const [shared, setShared] = useState(false);
  // DOMPurify isn't cheap and a gallery is a long list where each card
  // re-renders on vote/scroll; sanitize only when the description string changes.
  const descriptionHtml = useMemo(
    () => (item.description ? sanitizeGalleryHtml(item.description) : ''),
    [item.description],
  );
  const onShare = async () => {
    const r = await shareGalleryDossier({ slug: item.slug, name: item.name });
    if (r.ok) { setShared(true); setTimeout(() => setShared(false), 1600); }
  };
  const meta = [
    TIER_LABELS[item.tier] || human(item.tier),
    item.population ? `${formatNumber(item.population)} pop` : null,
    item.terrain ? human(item.terrain) : null,
  ].filter(Boolean);
  const tags = [
    item.governmentType,
    item.magicLevel && `${human(item.magicLevel)} magic`,
    item.stability,
    item.primaryResource,
    ...(item.tags || []),
  ].filter(Boolean).slice(0, 5);

  return (
    <article
      className={`oc-m-inkdarken sf-gallery-card${item.curated ? ' sf-gallery-card--curated' : ''}`}
      style={{
        minWidth: 0,
        overflow: 'hidden',
        // The specimen plate: a hairline frame (law §3, "plates in hairline
        // frames"), curated in gold — no rounded corner, no drop-shadow lift.
        // Depth is ink, never elevation; the frame inks darker on hover.
        border: `1px solid ${item.curated ? GOLD : BORDER}`,
        background: CARD,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(item.slug)}
        aria-label={`Open ${item.name || t('gallery.untitled')}`}
        style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ position: 'relative' }}>
          <GalleryImage item={item} />
          <div style={{
            position: 'absolute',
            left: 8,
            top: 8,
            display: 'flex',
            gap: 6,
            alignItems: 'center',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              minHeight: 24,
              padding: '3px 7px',
              background: GOLD,
              // Ink-on-gold, the house AA badge pairing (7.6:1) — the
              // white-on-gold this carried was the retired 2.4:1 failure.
              color: INK,
              fontFamily: sans,
              fontSize: FS.xxs,
              fontWeight: 950,
            }}>
              {Math.max(0, item.netVotes || 0)} votes
            </span>
            {item.curated && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                minHeight: 24,
                padding: '3px 7px',
                background: CARD,
                color: GOLD,
                border: `1px solid ${GOLD}`,
                fontFamily: sans,
                fontSize: FS.xxs,
                fontWeight: 950,
              }}>
                Curated
              </span>
            )}
            {item.unlisted && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                minHeight: 24,
                padding: '3px 7px',
                background: CARD,
                color: SECOND,
                border: `1px solid ${BORDER2}`,
                fontFamily: sans,
                fontSize: FS.xxs,
                fontWeight: 950,
              }}>
                Unlisted
              </span>
            )}
          </div>
        </div>
      </button>
      <div style={{ padding: SP.md, display: 'grid', gap: 8 }}>
        <Button
          variant="ghost"
          onClick={() => onOpen(item.slug)}
          style={{
            display: 'block',
            border: 'none',
            padding: 0,
            minHeight: 0,
            background: 'transparent',
            textAlign: 'left',
            color: INK,
            whiteSpace: 'normal',
          }}
        >
          <h3 style={{
            margin: 0,
            color: INK,
            fontFamily: serif_,
            fontSize: FS.lg,
            lineHeight: 1.2,
            fontWeight: 700,
            overflowWrap: 'anywhere',
          }}>
            {item.name || t('gallery.untitled')}
          </h3>
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
          <span>{meta.join(' / ')}</span>
          {/* Aliveness (GALLERY-2 phase 2) — renders nothing when un-stamped. */}
          <AlivenessBadge score={item.aliveness} />
        </div>
        {item.description && (
          <div
            className="sf-rich"
            style={{
              margin: 0,
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`} style={{
              display: 'inline-flex',
              padding: '2px 6px',
              border: `1px solid ${BORDER2}`,
              background: CARD_ALT,
              color: SECOND,
              fontFamily: sans,
              fontSize: FS.xxs,
              fontWeight: 800,
              textTransform: 'capitalize',
            }}>
              {human(tag)}
            </span>
          ))}
        </div>
        {/* Reader reactions (GALLERY-2 phase 2) — read-only digest of the top
            structured reactions; the interactive row lives on the dossier. */}
        <GalleryReactionSummary counts={item.reactions} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          <VoteButton count={item.netVotes} voted={item.voted} disabled={voting} onClick={() => onVote(item)} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
            {formatNumber(item.viewCount)} views
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
            {formatNumber(item.commentCount)} comments
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            title="Share this dossier"
          >
            {shared ? 'Copied' : 'Share'}
          </Button>
          <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
            {formatDate(item.updatedAt || item.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
