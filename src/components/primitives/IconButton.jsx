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
 *
 * THE ICONS-OFF CHANNEL (lane LU-2). This primitive used to be the ONE the
 * icons-off gate could not close: its whole child was `<Icon />`, so
 * suppressing the glyph left an empty labelled box rather than a quieter
 * control, and its ~70 call sites each had to import lucide directly — every
 * one of them a frozen row in tests/lint/lucideTotality.test.js.
 *
 * The cure is the shape Dialog/Badge/BottomSheet already use for their close
 * affordance: a unicode TEXT twin, which IconsContext rules "not icons and
 * unaffected by this gate". A caller passes `glyph` INSTEAD of `Icon` and
 * drops its lucide import; the control keeps its box, its tone, its focus
 * ring, its `title`, and its required `aria-label`, and renders a text mark
 * where the glyph used to be. The affordance survives; only the artwork goes.
 *
 * THE RENDER RULE IS DELIBERATELY INCREMENTAL — read it before changing it:
 *   - `glyph` supplied and icons are OFF  -> the text twin (the redesign's
 *     state on every surface except the Realm map).
 *   - `glyph` supplied and NO `Icon`      -> the text twin even inside the map
 *     Provider. Fail-safe: a converted call site can never render an empty
 *     box, whatever subtree it is mounted in.
 *   - otherwise                           -> `Icon`, exactly as before.
 * The last arm is why this change is safe to land ahead of the sweep: a call
 * site that has NOT yet been converted passes no `glyph` and behaves
 * byte-identically to the pre-LU-2 primitive. Conversion is per-call-site and
 * reversible, never a big bang.
 */

import { useIconsOn } from './IconsContext.js';
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
 * @param {React.ComponentType<{size?:number}>} [props.Icon]  lucide-react icon
 *   component. Optional since LU-2: pass `glyph` instead to render icons-off.
 * @param {string} [props.glyph]              unicode TEXT twin (× + − ‹ › ⌄ ...)
 *   rendered in place of `Icon` when icons are suppressed. Supplying it is what
 *   lets a call site drop its lucide import.
 * @param {string} props.label                aria-label / tooltip — REQUIRED
 * @param {() => void} [props.onClick]
 * @param {keyof typeof TONES} [props.tone='default']
 * @param {keyof typeof SIZES} [props.size='md']
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.pressed]           for toggle buttons — sets aria-pressed
 * @param {string} [props.type='button']
 */
export default function IconButton({
  Icon, glyph, label, onClick,
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
  if (!Icon && !glyph) {
    // An IconButton with neither channel is an empty labelled box — the exact
    // failure that kept this primitive outside the icons-off gate. Surface it
    // at the call site in development rather than shipping a blank control.
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('IconButton: pass `Icon` or `glyph` (a unicode text twin).');
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
  // THE ICONS-OFF CHANNEL. The text twin wins wherever the glyph is suppressed,
  // and also wherever no `Icon` was given at all (so a converted call site can
  // never render an empty box, even mounted inside the map's Provider). With no
  // `glyph`, this is false and the render below is the pre-LU-2 behaviour.
  const iconsOn = useIconsOn();
  const useTwin = !!glyph && (!iconsOn || !Icon);
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
      {useTwin
        ? <span aria-hidden="true" style={{ fontSize: s.icon + 2, lineHeight: 1, fontWeight: 700 }}>{glyph}</span>
        : <Icon size={s.icon} aria-hidden="true" />}
    </button>
  );
}
