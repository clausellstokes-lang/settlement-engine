import { CARD_ALT, FS, GOLD, PARCH, serif_ } from '../theme.js';
import { fallbackInitial } from './galleryUtils.js';
import { settlementCardImage, tierStockImage } from '../../domain/display/tierStockImage.js';

/**
 * ⛔ A SHARED TOWN IS NEVER A LETTER ON A GRADIENT ANY MORE (owner order ODQ
 * §934.32). Without an owner-supplied image this card showed the settlement's
 * INITIAL in serif on a parchment gradient — the same plate for every town in
 * the gallery, which made a grid of real generated settlements read as a grid of
 * empty slots. The tier's stock painting is the default now, and the owner's own
 * image still wins the moment they supply one (settlementCardImage owns that
 * precedence so this file cannot spell it backwards).
 *
 * The initial plate SURVIVES for the one case that is honest: a row with no tier
 * at all, which is a row we know nothing about. Guessing a tier there would put a
 * city's painting on a thorp.
 */
export default function GalleryImage({ item, height = 170 }) {
  const src = settlementCardImage(item?.imageUrl, item?.tier);
  if (src) {
    // The alt text must not claim the owner's picture when it is ours: a stock
    // painting is a tier's portrait, not a picture OF this settlement.
    const stock = !item?.imageUrl && src === tierStockImage(item?.tier);
    return (
      <img
        src={src}
        alt={stock
          ? `A ${String(item?.tier || 'settlement').toLowerCase()} of the kind ${item?.name || 'this settlement'} is`
          : (item.imageAlt || item.name || 'Settlement image')}
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
