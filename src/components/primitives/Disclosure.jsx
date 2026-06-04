import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BORDER, CARD, CARD_HDR, FS, INK, MUTED, R, SECOND, SP, sans } from '../theme.js';
import Badge from './Badge.jsx';

export default function Disclosure({
  title,
  count = null,
  defaultOpen = false,
  children,
  actions = null,
  compact = false,
  style,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = open ? ChevronDown : ChevronRight;

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
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
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
        <Icon size={14} color={MUTED} />
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
        {actions && <span style={{ color: SECOND }}>{actions}</span>}
      </button>
      {open && (
        <div style={{ padding: compact ? SP.md : SP.lg }}>
          {children}
        </div>
      )}
    </section>
  );
}
