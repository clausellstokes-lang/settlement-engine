import { CARD_ALT, FS, GOLD, PARCH, serif_ } from '../theme.js';
import { fallbackInitial } from './galleryUtils.js';

export default function GalleryImage({ item, height = 170 }) {
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
  return (
    <div style={{
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${PARCH}, ${CARD_ALT})`,
      color: GOLD,
      fontFamily: serif_,
      fontSize: FS['36'],
      fontWeight: 700,
    }}>
      {fallbackInitial(item?.name)}
    </div>
  );
}
