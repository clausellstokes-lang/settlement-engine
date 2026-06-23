/**
 * primitives/IconButton — Required-aria-label icon button.
 *
 * Why this primitive: the audit found we strip focus outlines and use
 * many small icon-only buttons without accessible labels. WCAG 2.2's
 * minimum target size and accessible name requirements both bite here.
 * IconButton enforces:
 *   1. an aria-label is always provided (development-time error if not)
 *   2. minimum 24×24 px target
 *   3. a visible focus ring via the global :focus-visible rule
 *   4. native <button> semantics — never a div with onClick
 *
 * Tones map to the existing palette but are bounded so callers can't
 * style themselves out of accessibility (no "ghost on ghost" combos).
 */

import { useIconsOn } from './IconsContext.js';
import useIsMobile from '../../hooks/useIsMobile.js';

const TONES = {
  default:  { bg: '#fff',                       fg: '#1c1409', border: '#d2bd96', hover: '#fffbf5' },
  primary:  { bg: '#a0762a',                    fg: '#ffffff', border: '#a0762a', hover: '#8c651e' },
  ghost:    { bg: 'transparent',                fg: '#6b5340', border: 'transparent', hover: 'rgba(160,118,42,0.08)' },
  active:   { bg: 'rgba(160,118,42,0.12)',      fg: '#1c1409', border: '#a0762a', hover: 'rgba(160,118,42,0.18)' },
  danger:   { bg: '#fff',                       fg: '#8b1a1a', border: '#c89a9a', hover: '#fff5f5' },
};

const SIZES = {
  sm: { box: 24, icon: 11, pad: 4 },
  md: { box: 28, icon: 13, pad: 6 },
  lg: { box: 36, icon: 16, pad: 8 },
  // xl — the ~44px usability target (Fitts's Law) for consequential controls
  // like "remove a saved neighbour link" that sit above the 24px WCAG floor.
  xl: { box: 44, icon: 18, pad: 10 },
};

/**
 * @param {Object} props
 * @param {React.ComponentType<{size?:number}>} props.Icon  lucide-react icon component
 * @param {string} props.label                aria-label / tooltip — REQUIRED
 * @param {() => void} [props.onClick]
 * @param {keyof typeof TONES} [props.tone='default']
 * @param {keyof typeof SIZES} [props.size='md']
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.pressed]           for toggle buttons — sets aria-pressed
 * @param {string} [props.type='button']
 */
export default function IconButton({
  Icon, label, onClick, glyph = null,
  tone = 'default', size = 'md',
  disabled, pressed, type = 'button',
  ...rest
}) {
  // Icons-off (everywhere but the Realm map): an icon-only control still needs a
  // visible mark, so off-map it renders a unicode `glyph` text fallback when one
  // is given (close = x, scroll = chevrons), else keeps the icon so nothing goes
  // invisible. Inside the map's IconsContext.Provider the lucide icon renders.
  const iconsOn = useIconsOn();
  if (!label) {
    // Throw in development so missing labels surface immediately. In
    // production we still render but with a fallback to keep the app up.
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('IconButton: `label` (aria-label) is required.');
    }
  }
  const t = TONES[tone] || TONES.default;
  const s = SIZES[size] || SIZES.md;
  // Mobile-only 44px tap floor. Icon-only controls need BOTH dimensions at the
  // floor, so on mobile we relax the fixed box into min-width/min-height >=44
  // (the glyph stays centred via inline-flex). Desktop keeps the exact fixed
  // box from SIZES (sm 24 / md 28 / lg 36 / xl 44) so density is unchanged.
  // Reads the ONE shared reactive flag (updates on resize + rotate).
  const isMobile = useIsMobile();
  const mobileFloor = isMobile ? Math.max(s.box, 44) : null;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label || 'button'}
      title={label || ''}
      aria-pressed={pressed === undefined ? undefined : !!pressed}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        // Desktop: fixed box. Mobile: floor to >=44 in both axes (min-* lets the
        // box grow without forcing desktop sizes up).
        width:  mobileFloor != null ? undefined : s.box,
        height: mobileFloor != null ? undefined : s.box,
        minWidth:  mobileFloor != null ? mobileFloor : undefined,
        minHeight: mobileFloor != null ? mobileFloor : undefined,
        padding: 0,
        background: pressed ? TONES.active.bg : t.bg,
        color:      pressed ? TONES.active.fg : t.fg,
        border: `1px solid ${pressed ? TONES.active.border : t.border}`,
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 120ms, border-color 120ms',
      }}
      {...rest}
    >
      {iconsOn
        ? <Icon size={s.icon} aria-hidden="true" />
        : (glyph != null
            ? <span aria-hidden="true" style={{ fontSize: s.icon + 3, lineHeight: 1, fontWeight: 700 }}>{glyph}</span>
            : <Icon size={s.icon} aria-hidden="true" />)}
    </button>
  );
}
