/**
 * PublicAvatar.jsx — THE ONE AVATAR RENDER (DESIGN_PROFILE_IMAGE.md §6).
 *
 * Every public surface that shows a person renders THIS, and reads its identity
 * from `publicIdentityOf` — gallery author lines, Founders' Hall plates, comment
 * rows. That is not tidiness: §1's guarantee is that a name and an image are one
 * identity under one consent, and a guarantee held by convention across N
 * surfaces is a guarantee until the (N+1)th surface. Holding it in one component
 * with one resolver is how it survives the surfaces nobody has written yet.
 *
 * THE RULES IT ENFORCES SO CONSUMERS CANNOT GET THEM WRONG:
 *   • Circular AT RENDER; the asset is square at rest. The ring is per surface.
 *   • FIXED-SIZE BOX at every rung, and the letter-circle fallback renders at
 *     IDENTICALLY the same size — so an image swapping in never shifts layout,
 *     and a missing avatar is not a hole. Zero layout shift is a property of the
 *     box, not of luck about when the image arrives.
 *   • The letter-circle is the PERMANENT fallback, not an error state. No avatar
 *     is an ordinary, finished condition of an account.
 *   • NEVER CONTENT-BEARING: alt is the display name, the decorative ring is
 *     aria-hidden, and identity is ALWAYS also text somewhere on the surface —
 *     the image is never the only carrier (the legibility law's "never the only
 *     path"). This component renders the IMAGE; the caller renders the name.
 *   • loading="lazy" + decoding="async" by default, since almost every use is
 *     below the fold in a list.
 *
 * CONSENT IS NOT THIS COMPONENT'S DECISION. It renders what the resolver gives
 * it. When consent is off the resolver yields a blank identity, and this renders
 * NOTHING AT ALL — not a letter-circle, which would still assert "a person is
 * here" on a surface the person asked to be absent from.
 */
import { AVATAR_RUNGS, avatarAlt, avatarHue, avatarLetter, avatarSources } from '../../lib/publicIdentity.js';
import { swatch, serif_ } from '../theme.js';

/** Ring treatments by register (§2: "plain ring in galleries; ceremonial gold on hall plates"). */
const RINGS = Object.freeze({
  none: null,
  plain: 'rgba(0,0,0,0.14)',
  gold: '#c8a44a',
});

/**
 * @param {Object} props
 * @param {{ displayName?: string, imageUrl?: string, optedIn?: boolean }} props.identity
 *        ALWAYS the output of publicIdentityOf — never a hand-assembled pair.
 * @param {'micro'|'standard'} [props.rung]  32px or 128px (§2's ladder)
 * @param {number} [props.size]  render box in px; defaults to the rung's own size
 * @param {'none'|'plain'|'gold'} [props.ring]
 * @param {boolean} [props.eager]  opt OUT of lazy loading (above-the-fold use)
 */
export default function PublicAvatar({
  identity, rung = 'standard', size, ring = 'plain', eager = false,
}) {
  // Consent off (or no identity at all) ⇒ render nothing. See the header.
  if (!identity?.optedIn) return null;

  const box = Number(size) || (rung === 'micro' ? AVATAR_RUNGS.micro : AVATAR_RUNGS.standard);
  const sources = avatarSources(identity.imageUrl, rung);
  const ringColor = RINGS[ring] ?? RINGS.plain;

  // ONE box style for both arms — this is what makes the swap shift-free.
  const frame = {
    width: box,
    height: box,
    flexShrink: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'block',
    position: 'relative',
    ...(ringColor ? { boxShadow: `0 0 0 1px ${ringColor}` } : null),
  };

  if (!sources) {
    // THE PERMANENT LETTER-CIRCLE (§4). Deterministic hue, so the same person
    // always wears the same circle. aria-hidden because the caller renders the
    // name as text beside it — this glyph is decoration, not information.
    const hue = avatarHue(identity);
    return (
      <span
        aria-hidden="true"
        data-testid="public-avatar-letter"
        style={{
          ...frame,
          background: `linear-gradient(135deg, hsl(${hue} 62% 52%) 0%, hsl(${hue} 58% 38%) 100%)`,
          color: swatch.white,
          fontFamily: serif_,
          fontWeight: 700,
          fontSize: Math.round(box * 0.44),
          lineHeight: `${box}px`,
          textAlign: 'center',
        }}
      >
        {avatarLetter(identity)}
      </span>
    );
  }

  return (
    <img
      src={sources.src}
      srcSet={sources.srcSet}
      sizes={sources.sizes}
      alt={avatarAlt(identity)}
      width={box}
      height={box}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      data-testid="public-avatar-image"
      style={{ ...frame, objectFit: 'cover' }}
    />
  );
}
