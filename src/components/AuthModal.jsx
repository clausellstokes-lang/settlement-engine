/**
 * AuthModal.jsx — the signed-out entry point into auth.
 *
 * One face: the shared <AuthPanel> (sign-in / sign-up / reset / verify),
 * rendered with its tab toggle and in-place mode switching. A successful
 * sign-in closes the modal (onAuthed = onClose).
 *
 * The modal is mounted by App only for signed-out visitors (authTier ===
 * 'anon'). The former signed-in "account card" face was removed: it
 * duplicated the AccountMenu's actions (Upgrade / Account / Sign Out),
 * giving the same global region two chromes for account management. The
 * AccountMenu + /account are now the single account-management entry point;
 * a signup/unlock PricingMomentCard that fires for an already-authed user is
 * a no-op at the App mount gate rather than surfacing this card.
 *
 * The form body itself lives in components/auth/AuthPanel.jsx and is shared
 * byte-for-byte with the dedicated /signin · /register · /reset-password
 * pages; the presentational primitives live in components/auth/authUI.jsx.
 * This file is now just modal chrome.
 */
import { X } from 'lucide-react';
import { GOLD, INK, INK_DEEP, BORDER, CARD, serif_, SP, R, FS, FORM_MAX } from './theme.js';
import { t } from '../copy/index.js';
import IconButton from './primitives/IconButton.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';
import AuthPanel from './auth/AuthPanel.jsx';

export default function AuthModal({ onClose }) {
  // Focus trap owns focus-into-dialog on open, Tab/Shift+Tab wrap, Escape
  // (via onCancel), and focus restore to the trigger on close.
  const dialogRef = useDialogFocusTrap(true, onClose);
  return (
    // Backdrop: click-to-close only. It is NOT a role=button — a button-role
    // backdrop swallows Enter/Space bubbling from inner controls and would
    // close the modal on an unrelated keypress (wrong button→function
    // mapping). Keyboard dismissal (Escape) now lives in the focus-trap hook,
    // the single dismissal source; the visible close IconButton carries the
    // explicit affordance in the header.
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div
      onClick={onClose}
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
        ref={dialogRef}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        style={{
          background: CARD, borderRadius: R.xl,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          width: '90%', maxWidth: FORM_MAX, overflow: 'hidden',
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

        <div style={{ padding: `${SP.xxl}px ${SP.xl}px` }}>
          {/* Shared with the dedicated auth pages. */}
          <AuthPanel initialMode="signin" onAuthed={onClose} />
        </div>
      </div>
    </div>
  );
}
