import { swatch } from '../theme.js';

/**
 * components/brand/HouseDevice — THE HOUSE DEVICE, the eager brand mark
 * (owner-approved final, 2026-07-18).
 *
 * A ring broken by a settlement roofline, the station triangle, one seal-point at
 * the triangle's centroid. The mark NEVER carries text — the name is always
 * adjacent type (the header wordmark, the og image's caption).
 *
 * This is a deliberately TINY standalone module: the canonical builders live in
 * src/design/organic/logo.js (lazy), but the header/loading/error mark must ride
 * the eager shell, so the hand-inked paths are inlined here and
 * tests/design/organicLogo.test.js pins them BYTE-EQUAL to the canonical source —
 * the two can never drift. Colors route through the swatch (token system).
 *
 * @param {Object} props
 * @param {number} [props.size=22]
 * @param {'light'|'dark'} [props.mode='dark']  dark = pale ink for the ink-band header/footer
 * @param {'standard'|'heavy'} [props.weight='heavy']  heavy = the small-size redraw (crisp <32px)
 * @param {React.CSSProperties} [props.style]
 */
export default function HouseDevice({ size = 22, mode = 'dark', weight = 'heavy', style }) {
  const ink = mode === 'light' ? swatch['#1B1408'] : swatch['#ECE0C6'];
  const dot = mode === 'light' ? swatch['#8B2E2E'] : swatch['#E8A860'];
  const heavy = weight === 'heavy';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false" style={style}>
      <path d="M 7 44 A 27.15 26.85 0 1 1 57 44" fill="none" stroke={ink} strokeWidth={heavy ? 6.1 : 3.05} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7 44.1 Q 13.5 43.75 20 43.95 L 25.1 36.9 L 29.9 44.05 Q 32 43.9 34 44 L 40.1 34.85 L 45.9 44.1 Q 51.5 43.8 57 44" fill="none" stroke={ink} strokeWidth={heavy ? 5.85 : 2.9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 31.9 15.2 L 41.05 30.9 Q 32 31.35 23.05 31.1 Z" fill="none" stroke={ink} strokeWidth={heavy ? 4.95 : 2.55} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="25.7" r={heavy ? 4.2 : 2.6} fill={dot} />
    </svg>
  );
}
