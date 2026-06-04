import { Loader2 } from 'lucide-react';
import {
  AMBER, AMBER_BG, BLUE, BLUE_BG, BORDER, CARD, ELEV, FS, GOLD, GOLD_BG,
  GREEN, GREEN_BG, INK, RED, RED_BG, R, SECOND, SP, VIOLET, VIOLET_BG,
  sans, swatch,
} from '../theme.js';

const VARIANTS = {
  primary: {
    bg: GOLD,
    fg: swatch.white,
    border: GOLD,
    shadow: ELEV[1],
  },
  secondary: {
    bg: CARD,
    fg: INK,
    border: BORDER,
    shadow: 'none',
  },
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
    fg: VIOLET,
    border: VIOLET,
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
    fg: AMBER,
    border: AMBER,
    shadow: 'none',
  },
  info: {
    bg: BLUE_BG,
    fg: BLUE,
    border: BLUE,
    shadow: 'none',
  },
  gold: {
    bg: GOLD_BG,
    fg: GOLD,
    border: BORDER,
    shadow: 'none',
  },
};

const SIZES = {
  sm: { fontSize: FS.xs, padding: `${SP.xs}px ${SP.sm}px`, icon: 12, minHeight: 28 },
  md: { fontSize: FS.sm, padding: `${SP.sm}px ${SP.md}px`, icon: 14, minHeight: 34 },
  lg: { fontSize: FS.md, padding: `${SP.md}px ${SP.lg}px`, icon: 16, minHeight: 40 },
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
  const Icon = busy ? <Loader2 className="sf-spin" size={s.icon} /> : icon;

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
      {trailingIcon}
    </button>
  );
}
