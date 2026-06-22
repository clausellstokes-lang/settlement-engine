import { Loader2 } from 'lucide-react';
import { useIconsOn } from './IconsContext.js';
import {
  AMBER, AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, BORDER_STRONG, CARD, ELEV, FS,
  GOLD, GOLD_SOFT, GOLD_TXT, GREEN, GREEN_BG, INK, RED, RED_BG, R, SECOND, SP,
  VIOLET, VIOLET_BG, VIOLET_DEEP, sans, swatch,
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
    shadow: ELEV[1],
  },
  // Neutral action — card fill with a >=3:1 border so the boundary (the only
  // affordance cue) is perceivable (WCAG 1.4.11).
  secondary: {
    bg: CARD,
    fg: INK,
    border: BORDER_STRONG,
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
    bg: VIOLET_BG,
    fg: VIOLET_DEEP,
    border: VIOLET,
    shadow: 'none',
  },
  // Solid violet primary — the LOUD form of the AI/upgrade affordance, peer to
  // `primary` in weight so a Cartographer upsell can be the region's dominant
  // CTA without borrowing brand-gold. White on violet-500 is 5.44:1 (AA). The
  // washed `ai` variant stays for in-flow/secondary AI controls; `aiSolid` is
  // for the one place the violet upgrade must out-shout everything (recurring
  // app-wide pricing nudge).
  aiSolid: {
    bg: VIOLET,
    fg: swatch.white,
    border: VIOLET,
    shadow: ELEV[1],
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
};

// minHeights are raised toward the ~44px at-the-table usability floor (P7/P8):
// the prompt notes mobile matters and the previous 28/34/40 sat under it. Bumped
// in small increments (sm 28→32, md 34→40, lg 40→44) so every caller inherits a
// more reachable target without a rhythm-breaking jump in dense rows. Padding is
// unchanged; minHeight does the lifting.
const SIZES = {
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
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.secondary;
  const s = SIZES[size] || SIZES.md;
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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: fullWidth ? '100%' : undefined,
        minHeight: s.minHeight,
        padding: s.padding,
        border: `1px solid ${v.border}`,
        borderRadius: R.lg,
        background: v.bg,
        color: v.fg,
        fontFamily: sans,
        fontSize: s.fontSize,
        fontWeight: 800,
        cursor: inert ? 'not-allowed' : 'pointer',
        opacity: inert ? 0.62 : 1,
        boxShadow: v.shadow,
        transition: 'background 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {Icon}
      {children}
      {iconsOn ? trailingIcon : null}
    </button>
  );
}
