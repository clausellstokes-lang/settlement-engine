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

import useIsMobile from '../../hooks/useIsMobile.js';

const TONES = {
  // THE OC INSTRUMENT BASE FACE (organic craft §2): quiet machined parchment,
  // ink glyph, perceivable gold-hairline boundary — the reserved instrument
  // tokens (--oc-btn-*), AA / 1.4.11 pinned in contrast.test.js.
  default:  { bg: 'var(--oc-btn-fill)',         fg: 'var(--oc-btn-ink)', border: 'var(--oc-btn-border)', hover: '#fffbf5' },
  primary:  { bg: '#a0762a',                    fg: '#ffffff', border: '#a0762a', hover: '#8c651e' },
  ghost:    { bg: 'transparent',                fg: '#6b5340', border: 'transparent', hover: 'rgba(160,118,42,0.08)' },
  active:   { bg: 'rgba(160,118,42,0.12)',      fg: '#1c1409', border: '#a0762a', hover: 'rgba(160,118,42,0.18)' },
  danger:   { bg: '#fff',                       fg: '#8b1a1a', border: '#c89a9a', hover: '#fff5f5' },
  // Borderless white glyph for use ON a saturated/colored surface (e.g. a
  // dismiss × on a fixed toast/banner). The only tone whose contrast is
  // guaranteed by its host, not the app background — reach for it only when
  // the button sits on a dark/colored fill.
  inverse:  { bg: 'transparent',                fg: '#ffffff', border: 'transparent', hover: 'rgba(255,255,255,0.18)' },
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
  Icon, label, onClick,
  tone = 'default', size = 'md',
  disabled, pressed, type = 'button',
  className = '',
  ...rest
}) {
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
      // Instrument press (organic motion #5); caller className preserved after.
      // sf-btn = the interactive state floor (a11y.css). The fill + the tone's
      // DESIGNED hover fill ride custom properties so :hover actually applies
      // the TONES.hover data (it was defined-but-dead before Fix wave 4).
      className={`oc-m-press sf-btn ${className}`.trim()}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        // Desktop: fixed box. Mobile: floor to >=44 in both axes (min-* lets the
        // box grow without forcing desktop sizes up).
        width:  mobileFloor != null ? undefined : s.box,
        height: mobileFloor != null ? undefined : s.box,
        minWidth:  mobileFloor != null ? mobileFloor : undefined,
        minHeight: mobileFloor != null ? mobileFloor : undefined,
        padding: 0,
        '--sf-btn-bg': pressed ? TONES.active.bg : t.bg,
        '--sf-btn-hover-bg': pressed ? TONES.active.hover : t.hover,
        color:      pressed ? TONES.active.fg : t.fg,
        border: `1px solid ${pressed ? TONES.active.border : t.border}`,
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 120ms, border-color 120ms',
      }}
      {...rest}
    >
      <Icon size={s.icon} aria-hidden="true" />
    </button>
  );
}
