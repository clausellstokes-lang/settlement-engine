/**
 * components/brand/HouseDevice — THE HOUSE MARK, the eager brand mark.
 *
 * THE MARK IS THE OWNER'S PAINTING, NOT A DRAWING (ODQ §934.17, 2026-09-19). This
 * renders public/brand/seal.png: the crimson wax seal cut out of the arrow header's
 * plaque, where it stands struck into the wordmark in place of its `o`. So the
 * footer's mark, the tab icon and the header are one object at three sizes.
 *
 * The geometric device this module used to inline — a ring broken by a settlement
 * roofline, the station triangle, one seal-point — was the owner-approved mark of
 * 2026-07-18 and is superseded HERE. It is still live in the dossier as the
 * charter's vector mark (src/pdf/primitives/HouseDeviceSeal.jsx) and as the
 * documentation goldens (scripts/gen-organic-logo.mjs); what it no longer does is
 * dress the product.
 *
 * The FILE NAME is historical. Three call sites and two instruments key on it, and
 * renaming the module would be churn bought with nothing a reader gains.
 *
 * A root-absolute public URL, never a Vite import — the painted header's own rule
 * (arrowGeometry.ARROW_STRIP_SRC): an import inlines the bytes into the eager
 * bundle, and every surface that draws this mark draws it below the fold. Hence
 * `loading="lazy"`, and explicit width/height so the box is reserved before the
 * bytes land (no layout shift).
 *
 * @param {Object} props
 * @param {number} [props.size=22]   drawn square, CSS px
 * @param {string} [props.alt='SettlementForge']  pass '' where adjacent type says it
 * @param {React.CSSProperties} [props.style]
 */

/** The shipped seal, a root-absolute public URL (never a Vite import). */
export const HOUSE_SEAL_SRC = '/brand/seal.png';

export default function HouseDevice({ size = 22, alt = 'SettlementForge', style }) {
  return (
    <img
      src={HOUSE_SEAL_SRC}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      style={{ width: size, height: size, ...style }}
    />
  );
}
