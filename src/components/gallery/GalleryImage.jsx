import { CARD_ALT, FS, GOLD, PARCH, serif_ } from '../theme.js';
import { fallbackInitial } from './galleryUtils.js';

export default function GalleryImage({ item, height = 170, fallbackHeight }) {
  if (item?.imageUrl) {
    return (
      <img
        src={item.imageUrl}
        alt={item.imageAlt || item.name || 'Settlement image'}
        loading="lazy"
        style={{ width: '100%', height, objectFit: 'cover', display: 'block', background: CARD_ALT }}
      />
    );
  }
  // No uploaded image: the gradient-initial fallback carries zero runnable
  // information, so it must NOT out-weigh the settlement name in the squint test
  // (P1/P4). Render it as a slim header band (a fraction of the real-image height)
  // rather than a full focal block, and shrink the decorative initial to match.
  const h = fallbackHeight ?? Math.round(height * 0.5);
  return (
    <div style={{
      height: h,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${PARCH}, ${CARD_ALT})`,
      color: GOLD,
      fontFamily: serif_,
      fontSize: FS.xxl,
      fontWeight: 700,
    }}>
      {fallbackInitial(item?.name)}
    </div>
  );
}
