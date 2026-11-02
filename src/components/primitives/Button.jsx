import { Children, isValidElement } from 'react';
import { Loader2 } from 'lucide-react';
import { useIconsOn } from './IconsContext.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';
import {
  AMBER, AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, FS,
  GOLD, GOLD_SOFT, GOLD_TXT, GREEN, GREEN_BG, INK, RED, RED_BG, R, SECOND, SP,
  SLATE, SLATE_BG, SLATE_DEEP, sans, swatch, launchSkin,
} from '../theme.js';

// Variant foreground/background pairs are chosen so every text+surface pair
// clears WCAG AA (4.5:1 for the label). The recurring rule: the gold/amber
// mid-tones (-500) are FILLS only; their darker -700/-800 steps carry text.
// Verified ratios live in tests/design/contrast.test.js.
const VARIANTS = {
  // Brand CTA — solid gold fill with dark ink text (7.6:1). White-on-gold was
  // 2.4:1 and failed AA; ink-on-gold also reads more "parchment cartouche".
  primary: {
    bg: GOLD,
    fg: INK,
    border: GOLD,
    shadow: 'none',
  },
  // Neutral action — THE OC INSTRUMENT BASE FACE (organic craft §2): the quiet
  // machined parchment surface, ink label, perceivable gold-hairline boundary.
  // The values are the reserved instrument tokens (design/organic/instruments.js,
  // projected to --oc-btn-* at :root), whose label/fill + boundary/ground pairs
  // are pinned AA / 1.4.11 in contrast.test.js.
  secondary: {
    bg: 'var(--oc-btn-fill)',
    fg: 'var(--oc-btn-ink)',
    border: 'var(--oc-btn-border)',
    shadow: 'none',
  },
  // Low-stakes / link-style. NOTE: ghost has no fill or border, so it must only
  // be used on guaranteed-flat opaque surfaces — never over the page painting
  // and never as a primary CTA.
  ghost: {
    bg: 'transparent',
    fg: SECOND,
    border: 'transparent',
    shadow: 'none',
  },
  danger: {
    bg: RED_BG,
    fg: RED,
    border: RED,
    shadow: 'none',
  },
  ai: {
    bg: SLATE_BG,
    fg: SLATE_DEEP,
    border: SLATE,
    shadow: 'none',
  },
  // Solid violet primary — the LOUD form of the AI/upgrade affordance, peer to
  // `primary` in weight so a Cartographer upsell can be the region's dominant
  // CTA without borrowing brand-gold. White on violet-500 is 5.44:1 (AA). The
  // washed `ai` variant stays for in-flow/secondary AI controls; `aiSolid` is
  // for the one place the violet upgrade must out-shout everything (recurring
  // app-wide pricing nudge).
  aiSolid: {
    bg: SLATE,
    fg: swatch.white,
    border: SLATE,
    shadow: 'none',
  },
  success: {
    bg: GREEN_BG,
    fg: GREEN,
    border: GREEN,
    shadow: 'none',
  },
  warning: {
    bg: AMBER_BG,
    fg: AMBER_DEEP,
    border: AMBER,
    shadow: 'none',
  },
  info: {
    bg: BLUE_BG,
    fg: BLUE,
    border: BLUE,
    shadow: 'none',
  },
  // Tertiary / "soft brand" + active-toggle state. Opaque soft-gold fill (so it
  // stays legible even over the painted background), dark gold-800 text (6.1:1),
  // and a gold border to distinguish it from `secondary`. Was gold-on-gold-wash
  // at 2.0:1 — the root of the "New Campaign button can't be read" report.
  gold: {
    bg: GOLD_SOFT,
    fg: GOLD_TXT,
    border: GOLD,
    shadow: 'none',
  },
  // THE LAUNCH SKIN (the owner, 2026-11-01, X-39): "a regal purple dark with a gloss and
  // shimmering gold lettering just to give the feel that it is in fact till launch". The
  // fill is the glossed ground (a gradient, never a shadow), the letters shimmer on their
  // own span below. Worn explicitly by the AI pass button, and IMPLICITLY by every control
  // that carries the Available-at-launch pill (lib/launchGate.js): a launch-locked purchase
  // button never has to ask for it. Gold-400 on the sheen is 5.8:1 (contrast.test.js).
  launch: {
    bg: launchSkin.ground,
    fg: launchSkin.ink,
    border: launchSkin.border,
    shadow: 'none',
  },
};

/**
 * A control carrying the Available-at-launch pill as a direct child is launch-locked. The pill
 * marks itself (`AvailableAtLaunchPill.isLaunchPill`), so this reads a flag and imports nothing:
 * the Button sits in every route's first-paint graph and must not pull the pill into it.
 * @param {import('react').ReactNode} children
 */
function carriesLaunchPill(children) {
  return Children.toArray(children).some((child) =>
    isValidElement(child) && typeof child.type === 'function' && /** @type {any} */ (child.type).isLaunchPill === true);
}

// minHeights are raised toward the ~44px at-the-table usability floor (P7/P8):
// the prompt notes mobile matters and the previous 28/34/40 sat under it. Bumped
// in small increments (sm 28→32, md 34→40, lg 40→44) so every caller inherits a
// more reachable target without a rhythm-breaking jump in dense rows. Padding is
// unchanged; minHeight does the lifting.
// The DESKTOP ladder. The phone floor is applied where the ladder is READ, at the
// `fontSize:` in the style below — the only place the viewport flag is bound.
const SIZES = {
  // phone-floor: floored at the read below.
  sm: { fontSize: FS.xs, padding: `${SP.xs}px ${SP.sm}px`, icon: 12, minHeight: 32 },
  md: { fontSize: FS.sm, padding: `${SP.sm}px ${SP.md}px`, icon: 14, minHeight: 40 },
  lg: { fontSize: FS.md, padding: `${SP.md}px ${SP.lg}px`, icon: 16, minHeight: 44 },
};

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon = null,
  trailingIcon = null,
  busy = false,
  disabled = false,
  fullWidth = false,
  title,
  type = 'button',
  onClick,
  style,
  className = '',
  ...rest
}) {
  // The launch skin is worn by request or by the pill (X-39); the pill is the launch gate's
  // own mark, so a locked purchase control wears the register without naming it.
  const launch = variant === 'launch' || carriesLaunchPill(children);
  const v = launch ? VARIANTS.launch : (VARIANTS[variant] || VARIANTS.secondary);
  const s = SIZES[size] || SIZES.md;
  // Mobile-only 44px tap floor (at-the-table reachability). Desktop density is
  // unchanged: the existing SIZES.minHeight (sm 32 / md 40 / lg 44) win there.
  // Reads the ONE shared reactive flag, so a rotate past 640 re-floors live.
  const isMobile = useIsMobile();
  const minHeight = isMobile ? Math.max(s.minHeight, 44) : s.minHeight;
  const inert = disabled || busy;
  // Icons-off everywhere but the Realm map (IconsContext). The busy spinner is
  // a functional status, not decoration, so it always renders; leading/trailing
  // lucide icons render only inside the map's Provider.
  const iconsOn = useIconsOn();
  const Icon = busy ? <Loader2 className="sf-spin" size={s.icon} /> : (iconsOn ? icon : null);

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={inert}
      // The instrument gives under the finger (organic motion #5 press). Any
      // caller-supplied className is preserved after it (prop-compatible).
      // sf-btn = the interactive state floor (a11y.css): the fill rides the
      // --sf-btn-bg custom property so :hover can derive a perceivable shift
      // for EVERY variant; a caller's inline `background` override still wins.
      className={`oc-m-press sf-btn ${className}`.trim()}
      data-skin={launch ? 'launch' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: fullWidth ? '100%' : undefined,
        minHeight,
        padding: s.padding,
        border: `1px solid ${v.border}`,
        borderRadius: R.sm,
        '--sf-btn-bg': v.bg,
        color: v.fg,
        // THE LAUNCH SKIN'S TWO LAYERS. The letters: the gold gradient clipped to the glyphs
        // of the button's OWN text, so the label stays a direct text node (a screen reader,
        // a test and a copy all read the button as before). The ground: the glossed gradient
        // on an inert layer beneath (the span below), inside the button's own stacking
        // context. The border stays the button's. The hover rule's flat fill sits under the
        // gradient and is never seen.
        ...(launch ? {
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden', // the ground layer takes the button's own rounded edge
          backgroundImage: launchSkin.shimmer.backgroundImage,
          backgroundSize: launchSkin.shimmer.backgroundSize,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: launchSkin.shimmer.animation,
        } : null),
        fontFamily: sans,
        fontSize: chromeFontSize(s.fontSize, isMobile),
        fontWeight: 800,
        cursor: inert ? 'not-allowed' : 'pointer',
        // A launch-locked control is not a dimmed control: the register IS its state.
        opacity: inert && !launch ? 0.62 : 1,
        boxShadow: v.shadow,
        transition: 'background 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {launch && <span aria-hidden="true" data-launch-ground="" style={{ position: 'absolute', inset: 0, zIndex: -1, background: launchSkin.ground }} />}
      {Icon && (launch ? <span style={{ display: 'inline-flex', color: launchSkin.ink }}>{Icon}</span> : Icon)}
      {children}
      {iconsOn && trailingIcon ? (launch ? <span style={{ display: 'inline-flex', color: launchSkin.ink }}>{trailingIcon}</span> : trailingIcon) : null}
    </button>
  );
}
