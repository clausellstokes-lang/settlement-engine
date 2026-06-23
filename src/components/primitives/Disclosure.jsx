import { useId, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BORDER, CARD, CARD_HDR, FS, INK, MUTED, R, SECOND, SP, sans } from '../theme.js';
import Badge from './Badge.jsx';
import { useIconsOn } from './IconsContext.js';

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
  const [open, setOpen] = useState(defaultOpen);
  const fired = useRef(defaultOpen);
  const panelId = useId();
  const iconsOn = useIconsOn();
  const Icon = open ? ChevronDown : ChevronRight;

  // Fire onFirstOpen once, the first time the section is revealed. Lets a
  // call site lazily teach a deep control (analytics step, coach) without a
  // separate effect. Pre-armed when defaultOpen so it doesn't fire on mount.
  const toggle = () => setOpen((value) => {
    const next = !value;
    if (next && !fired.current && onFirstOpen) { fired.current = true; onFirstOpen(); }
    return next;
  });

  return (
    <section
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
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
          : <span aria-hidden="true" style={{ width: 14, textAlign: 'center', color: MUTED, fontWeight: 800, lineHeight: 1, flexShrink: 0 }}>{open ? '−' : '+'}</span>}
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
