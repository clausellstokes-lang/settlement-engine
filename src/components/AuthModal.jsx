/**
 * AuthModal.jsx - the overlay entry point into auth.
 *
 * Two faces, frozen at open time:
 *   - signed-out → the shared <AuthPanel> (sign-in / sign-up / reset / verify),
 *     rendered with its tab toggle and in-place mode switching. A successful
 *     sign-in closes the modal (onAuthed = onClose).
 *   - signed-in  → the compact account card (tier, credits, upgrade, support,
 *     sign out) plus a deep link to the full Account page.
 *
 * The form body itself lives in components/auth/AuthPanel.jsx and is shared
 * byte-for-byte with the dedicated /signin · /register · /reset-password
 * pages; the presentational primitives live in components/auth/authUI.jsx.
 * This file is now just modal chrome + the account view.
 */
import { useState } from 'react';
import { X, User, ExternalLink, Headphones } from 'lucide-react';
import { useStore } from '../store/index.js';
import { GOLD, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, CARD_HDR, serif_, SP, R, FS, swatch } from './theme.js';
import { getTierDisplayName } from '../config/pricing.js';
import { t } from '../copy/index.js';
import FounderBadge from './primitives/FounderBadge.jsx';
import AuthPanel from './auth/AuthPanel.jsx';
import { Button, RoleBadge } from './auth/authUI.jsx';

export default function AuthModal({ onClose, onNavigateAccount }) {
  const auth        = useStore(s => s.auth);
  const authSignOut = useStore(s => s.authSignOut);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const creditBalance = useStore(s => s.creditBalance);
  const isElevated  = useStore(s => s.isElevated());

  // Frozen at open time. The signed-out → signed-in transition is never made
  // in place: a completed sign-in calls onClose, so this only ever flips when
  // the modal is re-opened.
  const [showAccount] = useState(!!auth.user);

  const handleSignOut = async () => {
    await authSignOut();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
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
            {showAccount ? 'Account' : 'Welcome'}
          </h2>
          <button onClick={onClose} aria-label={t('common.close')} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: `${SP.xxl}px ${SP.xl}px` }}>
          {!showAccount ? (
            /* ── Auth flow (shared with the dedicated auth pages) ── */
            <AuthPanel initialMode="signin" onAuthed={onClose} />
          ) : (
            /* ── Account view ───────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
              {/* User info card */}
              <div style={{ padding: `${SP.md}px ${SP.lg - 2}px`, background: CARD_HDR, borderRadius: R.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: swatch.white, fontWeight: 700, fontSize: FS.lg,
                  }}>
                    {(auth.displayName || auth.user?.email || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    {auth.displayName && (
                      <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK, fontFamily: serif_ }}>
                        {auth.displayName}
                      </div>
                    )}
                    <div style={{ fontSize: FS.sm, color: MUTED }}>{auth.user?.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RoleBadge role={auth.role} />
                    <FounderBadge size="sm" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: SP.lg, marginTop: SP.md, paddingTop: SP.sm, borderTop: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tier</div>
                    <div style={{
                      fontSize: FS.md, fontWeight: 700,
                      color: isElevated ? '#7c3aed' : auth.tier === 'premium' ? '#2a7a2a' : GOLD,
                      textTransform: 'uppercase',
                    }}>
                      {isElevated ? 'Full Access' : getTierDisplayName(auth.tier)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits</div>
                    <div style={{ fontSize: FS.md, fontWeight: 700, color: swatch['#7C3AED'] }}>
                      {isElevated ? '∞' : creditBalance}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!isElevated && auth.tier !== 'premium' && (
                <Button variant="success" onClick={() => { onClose(); setPurchaseModalOpen(true); }}>
                  Upgrade to {getTierDisplayName('premium')}
                </Button>
              )}

              {onNavigateAccount && (
                <Button variant="ghost" onClick={() => { onClose(); onNavigateAccount(); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.sm }}
                >
                  <User size={14} /> Full Account Settings <ExternalLink size={12} />
                </Button>
              )}

              <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.6 }}>
                {isElevated ? (
                  <>
                    <strong>Developer Access:</strong> All features unlocked, unlimited saves, unlimited AI credits, admin panel.
                  </>
                ) : (
                  <>
                    <strong>Free Account:</strong> All tiers, 10 saves, custom content
                    <br />
                    <strong>Premium:</strong> Unlimited saves, Neighbourhood System, PDF/JSON export, Map supply chains
                  </>
                )}
              </div>

              {/* Support link */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: SP.sm,
                padding: `${SP.sm}px ${SP.md}px`,
                background: swatch['#FEF9EE'], borderRadius: R.md,
                border: `1px solid rgba(160,118,42,0.2)`,
              }}>
                <Headphones size={14} color={GOLD} />
                <span style={{ fontSize: FS.sm, color: SECOND }}>
                  Need help?{' '}
                  <a href="mailto:clausellstokes@aol.com" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                    Contact Support
                  </a>
                </span>
              </div>

              <Button variant="danger" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
