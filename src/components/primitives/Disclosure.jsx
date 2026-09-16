import { useId, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BORDER, CARD, CARD_HDR, FS, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import { useIconsOn } from './IconsContext.js';
import Badge from './Badge.jsx';

export default function Disclosure({
  title,
  count = null,
  hint = null,
  defaultOpen = false,
  children,
  actions = null,
  compact = false,
  onFirstOpen,
  style,
}) {
  // a11y: the trigger names its panel (ported master fix — aria-controls pairs
  // with aria-expanded so AT users can jump to the disclosed region).
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);
  // Fire onFirstOpen once, the first time the section is revealed. Lets a
  // call site lazily teach a deep control (analytics step, coach) without a
  // separate effect. Pre-armed when defaultOpen so it doesn't fire on mount.
  const fired = useRef(defaultOpen);
  // Icons-off everywhere but the Realm map (IconsContext). The open/closed
  // chevron is an AFFORDANCE, not decoration, so it keeps a channel: outside
  // the map it falls back to the unicode TEXT chevron IconsContext.js names as
  // exempt from the gate. The fallback keeps the icon's 14px box so the title
  // does not shift horizontally between the open and closed states.
  const iconsOn = useIconsOn();
  const Icon = open ? ChevronDown : ChevronRight;
  const toggle = () => setOpen((value) => {
    const next = !value;
    if (next && !fired.current && onFirstOpen) { fired.current = true; onFirstOpen(); }
    return next;
  });

  return (
    <section
      style={{
        border: `1px solid ${BORDER}`,
        background: CARD,
        overflow: 'hidden',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: SP.sm,
          padding: compact ? `${SP.sm}px ${SP.md}px` : `${SP.md}px ${SP.lg}px`,
          border: 'none',
          borderBottom: open ? `1px solid ${BORDER}` : 'none',
          background: open ? CARD_HDR : CARD,
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: sans,
        }}
      >
        {iconsOn
          ? <Icon size={14} color={MUTED} />
          : <span aria-hidden="true" style={{
              width: 14, flexShrink: 0, textAlign: 'center',
              fontSize: FS.xs, lineHeight: 1, color: MUTED,
            }}>{open ? '▾' : '▸'}</span>}
        <span style={{
          flex: 1,
          minWidth: 0,
          color: INK,
          fontSize: FS.sm,
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
        {count != null && <Badge tone="muted">{count}</Badge>}
        {hint && !open && (
          <span style={{
            fontFamily: sans, fontSize: FS.sm, fontWeight: 500,
            color: MUTED, letterSpacing: 0, textTransform: 'none',
          }}>
            {hint}
          </span>
        )}
        {actions && <span style={{ color: SECOND }}>{actions}</span>}
      </button>
      {open && (
        <div id={panelId} style={{ padding: compact ? SP.md : SP.lg }}>
          {children}
        </div>
      )}
    </section>
  );
}
