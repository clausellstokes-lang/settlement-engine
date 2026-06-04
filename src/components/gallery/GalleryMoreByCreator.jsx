import { t } from '../../copy/index.js';
import { TIER_LABELS } from '../new/design.js';
import { BORDER, CARD, FS, INK, MUTED, SP, sans, serif_ } from '../theme.js';
import { human } from './galleryUtils.js';
import GalleryImage from './GalleryImage.jsx';

export default function GalleryMoreByCreator({ items, onOpen }) {
  if (!items?.length) return null;
  return (
    <section style={{ display: 'grid', gap: SP.md }}>
      <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.xl, fontWeight: 700 }}>
        More From This Creator
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: SP.md }}>
        {items.map(item => (
          <button
            type="button"
            key={item.slug}
            onClick={() => onOpen(item.slug)}
            style={{ overflow: 'hidden', border: `1px solid ${BORDER}`, borderRadius: 8, background: CARD, padding: 0, textAlign: 'left', cursor: 'pointer' }}
          >
            <GalleryImage item={item} height={100} />
            <div style={{ padding: SP.sm, display: 'grid', gap: 4 }}>
              <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950, overflowWrap: 'anywhere' }}>
                {item.name || t('gallery.untitled')}
              </div>
              <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
                {TIER_LABELS[item.tier] || human(item.tier)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
