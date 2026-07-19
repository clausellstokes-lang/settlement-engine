/**
 * SessionEvictedBanner.jsx — the single-session eviction notice (§7.3, M-9d).
 *
 * Rendered when the store's `sessionEvicted` flag is up (this device's session was
 * superseded by a sign-in elsewhere). A quiet top strip, NOT a modal — the user's
 * unsaved work is intact behind it (THE LIFECYCLE PIN guarantees the persist survives
 * eviction), so it informs rather than blocks. Auto-clears on the next sign-in.
 *
 * ZERO EAGER: a lazy component (App renders it in the existing Suspense block); its
 * body never touches the first-paint closure. FLAT MATERIALS (kill-list): a solid ink
 * strip with a hairline rule — no rounded corners / shadows / rgba washes / tints.
 */
import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/index.js';
import IconButton from './primitives/IconButton.jsx';
import { INK, CARD, BORDER, sans, FS, SP } from './theme.js';

export default function SessionEvictedBanner() {
  const evicted = useStore((s) => s.sessionEvicted);
  const [dismissed, setDismissed] = useState(false);

  if (!evicted || dismissed) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.md,
        padding: `${SP.sm}px ${SP.md}px`, minHeight: 44,
        background: INK, color: CARD, borderBottom: `1px solid ${BORDER}`,
        fontFamily: sans, fontSize: FS.sm, lineHeight: 1.4, textAlign: 'center',
      }}
    >
      <span>
        Signed out because your account signed in on another device. Your work is saved —
        sign in again to continue.
      </span>
      <span style={{ flexShrink: 0 }}>
        <IconButton Icon={X} label="Dismiss" onClick={() => setDismissed(true)} size="md" />
      </span>
    </div>
  );
}
