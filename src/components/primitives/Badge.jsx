import { X } from 'lucide-react';
import {
  AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, BORDER, CARD_ALT, FS, GOLD_BG, GOLD_TXT,
  GREEN, GREEN_BG, MUTED, RED, RED_BG, R, SECOND, SP, SLATE_BG, SLATE_DEEP,
  sans,
} from '../theme.js';
import { useIconsOn } from './IconsContext.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

const TONES = {
  neutral: { bg: CARD_ALT, fg: SECOND, border: BORDER },
  muted: { bg: CARD_ALT, fg: MUTED, border: BORDER },
  gold: { bg: GOLD_BG, fg: GOLD_TXT, border: BORDER },
  success: { bg: GREEN_BG, fg: GREEN, border: BORDER },
  warning: { bg: AMBER_BG, fg: AMBER_DEEP, border: BORDER },
  danger: { bg: RED_BG, fg: RED, border: BORDER },
  info: { bg: BLUE_BG, fg: BLUE, border: BORDER },
  ai: { bg: SLATE_BG, fg: SLATE_DEEP, border: BORDER },
};

// The DESKTOP ladder. The phone floor is applied where the ladder is READ, at the
// `fontSize:` in the style below — the only place the viewport flag is bound.
const SIZES = {
  // phone-floor: floored at the read below.
  sm: { fontSize: FS.xxs, padding: `${SP.xs / 2}px ${SP.sm}px`, icon: 10 },
  // phone-floor: floored at the read below.
  md: { fontSize: FS.xs, padding: `${SP.xs}px ${SP.sm}px`, icon: 12 },
};

export default function Badge({
  children,
  tone = 'neutral',
  size = 'sm',
  icon = null,
  onRemove,
  title,
  style,
}) {
  const t = TONES[tone] || TONES.neutral;
  const s = SIZES[size] || SIZES.sm;
  const iconsOn = useIconsOn();
  const mobile = useIsMobile();

  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: s.padding,
        border: `1px solid ${t.border}`,
        borderRadius: R.lg,
        background: t.bg,
        color: t.fg,
        fontFamily: sans,
        fontSize: chromeFontSize(s.fontSize, mobile),
        fontWeight: 800,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {iconsOn ? icon : null}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: t.fg,
            cursor: 'pointer',
          }}
        >
          {iconsOn
            ? <X size={s.icon} />
            : <span aria-hidden="true" style={{ fontSize: s.icon + 2, lineHeight: 1, fontWeight: 700 }}>×</span>}
        </button>
      )}
    </span>
  );
}
