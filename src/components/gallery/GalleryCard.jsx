import { Eye, MessageCircle, Sparkles, ThumbsUp } from 'lucide-react';

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
  swatch,
} from '../theme.js';
import { formatDate, formatNumber, human } from './galleryUtils.js';
import GalleryImage from './GalleryImage.jsx';
import VoteButton from './VoteButton.jsx';

export default function GalleryCard({ item, onOpen, onVote, voting }) {
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
    <article style={{
      minWidth: 0,
      overflow: 'hidden',
      border: `1px solid ${item.curated ? GOLD : BORDER}`,
      borderRadius: 8,
      background: CARD,
      boxShadow: item.curated ? '0 8px 22px rgba(201,162,76,0.18)' : '0 4px 14px rgba(27,20,8,0.08)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <button
        type="button"
        onClick={() => onOpen(item.slug)}
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
              borderRadius: 999,
              background: GOLD,
              color: swatch.white,
              fontFamily: sans,
              fontSize: FS.xxs,
              fontWeight: 950,
            }}>
              <ThumbsUp size={11} /> {Math.max(0, item.netVotes || 0)}
            </span>
            {item.curated && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                minHeight: 24,
                padding: '3px 7px',
                borderRadius: 999,
                background: CARD,
                color: GOLD,
                border: `1px solid ${GOLD}`,
                fontFamily: sans,
                fontSize: FS.xxs,
                fontWeight: 950,
              }}>
                <Sparkles size={10} /> Curated
              </span>
            )}
          </div>
        </div>
      </button>
      <div style={{ padding: SP.md, display: 'grid', gap: 8 }}>
        <button
          type="button"
          onClick={() => onOpen(item.slug)}
          style={{
            border: 'none',
            padding: 0,
            background: 'transparent',
            textAlign: 'left',
            color: INK,
            cursor: 'pointer',
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
        </button>
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
          {meta.join(' / ')}
        </div>
        {item.description && (
          <p style={{
            margin: 0,
            color: BODY,
            fontFamily: sans,
            fontSize: FS.xs,
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.description}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`} style={{
              display: 'inline-flex',
              padding: '2px 6px',
              borderRadius: 5,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          <VoteButton count={item.netVotes} voted={item.voted} disabled={voting} onClick={() => onVote(item)} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
            <Eye size={12} /> {formatNumber(item.viewCount)}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
            <MessageCircle size={12} /> {formatNumber(item.commentCount)}
          </span>
          <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
            {formatDate(item.updatedAt || item.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
