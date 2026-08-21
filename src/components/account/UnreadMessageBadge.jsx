/** Shared visual unread numeral. Accessible names live on its parent control. */
import { semantic, swatch } from '../../design/tokens.js';
import { FS } from '../theme.js';

export function normalizeUnreadCount(count) {
  const numeric = Number(count);
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : 0;
}

export function unreadMessagesLabel(base, count) {
  const unread = normalizeUnreadCount(count);
  if (!unread) return base;
  return `${base}, ${unread} unread message${unread === 1 ? '' : 's'}`;
}

export default function UnreadMessageBadge({ count, style }) {
  const unread = normalizeUnreadCount(count);
  if (!unread) return null;
  return (
    <span
      aria-hidden="true"
      data-operator-unread-badge="true"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 18, height: 18, clipPath: 'circle(50%)', boxSizing: 'border-box',
        background: semantic.operatorAlert, color: swatch.white,
        fontSize: FS.xxs, fontWeight: 800, lineHeight: 1,
        ...style,
      }}
    >
      {unread > 9 ? '9+' : unread}
    </span>
  );
}
