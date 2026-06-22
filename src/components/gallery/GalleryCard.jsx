import { Eye, MessageCircle, Sparkles } from 'lucide-react';

import { t } from '../../copy/index.js';
import { TIER_LABELS } from '../new/design.js';
import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GOLD_TXT,
  INK,
  R,
  SECOND,
  SP,
  sans,
  serif_,
} from '../theme.js';
import { formatDate, formatNumber, human, stabilityBand } from './galleryUtils.js';
import { sanitizeGalleryHtml } from '../../lib/sanitizeGalleryHtml.js';
import BandPill from '../primitives/BandPill.jsx';
import Button from '../primitives/Button.jsx';
import GalleryImage from './GalleryImage.jsx';
import VoteButton from './VoteButton.jsx';

export default function GalleryCard({ item, onOpen, onVote, voting, isSignedIn }) {
  // Tier is the runnable identity anchor (front-loaded, INK, bolder); population
  // and terrain follow as quieter muted facts. (P6 keyword-first / P4 two-lever.)
  const tierLabel = TIER_LABELS[item.tier] || human(item.tier);
  const secondaryMeta = [
    item.population ? `${formatNumber(item.population)} pop` : null,
    item.terrain ? human(item.terrain) : null,
  ].filter(Boolean);
  // Stability is pulled OUT of the tag soup and promoted to a BandPill (the
  // anomaly P3 says to reserve saturated color for); government/magic/resource
  // stay as the quiet grey chips below.
  const stab = stabilityBand(item.stability);
  const tags = [
    item.governmentType,
    item.magicLevel && `${human(item.magicLevel)} magic`,
    item.primaryResource,
    ...(item.tags || []),
  ].filter(Boolean).slice(0, 5);

  return (
    <article style={{
      minWidth: 0,
      overflow: 'hidden',
      border: `1px solid ${item.curated ? GOLD : BORDER}`,
      borderRadius: R.lg,
      background: CARD,
      boxShadow: item.curated ? '0 8px 22px rgba(201,162,76,0.18)' : '0 4px 14px rgba(27,20,8,0.08)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <button
        type="button"
        onClick={() => onOpen(item.slug)}
        aria-label={`Open ${item.name || t('gallery.untitled')}`}
        style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ position: 'relative' }}>
          <GalleryImage item={item} />
          {item.curated && (
            <div style={{
              position: 'absolute',
              left: SP.xs,
              top: SP.xs,
              display: 'flex',
              gap: SP.xs,
              alignItems: 'center',
            }}>
              <span title="Chosen by the editors as a worked example" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: SP.xs,
                minHeight: 24,
                padding: `${SP.xs}px ${SP.sm}px`,
                borderRadius: 999,
                background: CARD,
                color: GOLD_TXT,
                border: `1px solid ${GOLD}`,
                fontFamily: sans,
                fontSize: FS.xs,
                fontWeight: 950,
              }}>
                <Sparkles size={11} /> Curated
              </span>
            </div>
          )}
        </div>
      </button>
      <div style={{ padding: SP.md, display: 'grid', gap: SP.xs }}>
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
            fontSize: FS.xl,
            lineHeight: 1.2,
            fontWeight: 800,
            overflowWrap: 'anywhere',
          }}>
            {item.name || t('gallery.untitled')}
          </h3>
        </Button>
        {/* State-first meta line: the stability band is the loudest, front-loaded
            token (color + glyph + uppercase label), the keyword-first anchor a
            grid scan hits before the quiet identity facts. (P3 / P4 / P6) */}
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: SP.xs, fontFamily: sans, fontSize: FS.xs, textTransform: 'capitalize' }}>
          {stab && (
            <BandPill band={stab.band} label={stab.label} labelBefore="Stability: " size="sm" style={{ alignSelf: 'center' }} />
          )}
          <span style={{ color: INK, fontWeight: 900 }}>{tierLabel}</span>
          {secondaryMeta.length > 0 && (
            <span style={{ color: BODY, fontWeight: 700 }}>{secondaryMeta.join(' · ')}</span>
          )}
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
            dangerouslySetInnerHTML={{ __html: sanitizeGalleryHtml(item.description) }}
          />
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`} style={{
              display: 'inline-flex',
              padding: `2px ${SP.xs}px`,
              borderRadius: R.sm,
              background: CARD_ALT,
              color: SECOND,
              fontFamily: sans,
              fontSize: FS.xs,
              fontWeight: 800,
              textTransform: 'capitalize',
            }}>
              {human(tag)}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', marginTop: SP.sm }}>
          <VoteButton
            count={item.netVotes}
            voted={item.voted}
            disabled={voting}
            isSignedIn={isSignedIn}
            onClick={() => onVote(item)}
          />
          {/* One quiet muted ledger of read-only counts + date — a single tier
              below the interactive vote control. (P4 <=3 levels / P5 quiet the neighbors.) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP.sm, marginLeft: 'auto', color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            <span aria-label={`${formatNumber(item.viewCount)} views`} style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs }}>
              <Eye size={12} aria-hidden="true" /> {formatNumber(item.viewCount)}
            </span>
            <span aria-label={`${formatNumber(item.commentCount)} comments`} style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs }}>
              <MessageCircle size={12} aria-hidden="true" /> {formatNumber(item.commentCount)}
            </span>
            <span>{formatDate(item.updatedAt || item.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
