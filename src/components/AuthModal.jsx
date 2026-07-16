/**
 * AuthModal.jsx — the overlay entry point into auth.
 *
 * Signed-out visitors only: App hard-gates the mount to `authTier === 'anon'`,
 * and signed-in account affordances live in the AccountMenu header chip + the
 * Account page (the legacy in-modal account card was unreachable dead code and
 * was removed in W5.1). A successful sign-in closes the modal (onAuthed =
 * onClose).
 *
 * The form body itself lives in components/auth/AuthPanel.jsx and is shared
 * byte-for-byte with the dedicated /signin · /register · /reset-password
 * pages; the presentational primitives live in components/auth/authUI.jsx.
 * This file is now just modal chrome.
 */
import { X } from 'lucide-react';
import { GOLD, INK, INK_DEEP, BORDER, CARD, serif_, SP, R, FS } from './theme.js';
import { t } from '../copy/index.js';
import IconButton from './primitives/IconButton.jsx';
import AuthPanel from './auth/AuthPanel.jsx';
import useIsMobile from '../hooks/useIsMobile.js';

export default function AuthModal({ onClose }) {
  // Read the shared reactive viewport flag (updates on resize + rotate) so the
  // mobile scroll-bound applies wherever the modal is mounted, not only when a
  // caller happens to thread an isMobile prop.
  const isMobile = useIsMobile();
  return (
    <div
      onClick={onClose}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      role="button"
      tabIndex={0}
      aria-label={t('common.close')}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Propagation guard only: stops a click inside the card from bubbling to the backdrop's close handler — not a real interaction, so no keyboard handler is warranted. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        style={{
          background: CARD, borderRadius: R.xl,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          width: '90%', maxWidth: 420, overflow: 'hidden',
          // Mobile: the tall sign-up form (email + 2 passwords + CTA +
          // alternatives) can overrun a short phone viewport. Bound the dialog
          // to the visible height and let the body scroll within it. Desktop
          // keeps its natural-height card untouched.
          ...(isMobile ? { maxHeight: '90dvh', display: 'flex', flexDirection: 'column' } : null),
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${SP.lg}px ${SP.xl}px`,
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          color: GOLD,
        }}>
          <h2 id="auth-modal-title" style={{ margin: 0, fontSize: FS.xl + 1, fontFamily: serif_, fontWeight: 600 }}>
            {t('auth.modalTitle')}
          </h2>
          <IconButton Icon={X} label={t('common.close')} onClick={onClose} tone="ghost" size="lg" />
        </div>

        <div style={{
          padding: `${SP.xxl}px ${SP.xl}px`,
          // Mobile: this body owns the overflow so the header stays pinned while
          // the form scrolls. flex:1 + minHeight:0 lets it shrink inside the
          // height-bounded flex-column dialog above. Desktop is unchanged.
          ...(isMobile ? { flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } : null),
        }}>
          {/* Shared with the dedicated auth pages. */}
          <AuthPanel initialMode="signin" onAuthed={onClose} />
        </div>
      </div>
    </div>
  );
}
