/**
 * PurchaseModal.jsx — Credit pack and premium upgrade purchase UI.
 *
 * Displays available products with volume discount pricing and
 * initiates Stripe Checkout via the create-checkout edge function.
 *
 * Credit packs:
 *   5 credits  / $4.99  ($1.00/ea)
 *   15 credits / $9.99  ($0.67/ea, 33% off)
 *   40 credits / $19.99 ($0.50/ea, 50% off)
 */
import { useState } from 'react';
import { X, Zap, AlertCircle, TrendingDown } from 'lucide-react';
import { useStore } from '../store/index.js';
import { startCheckout, PRODUCTS } from '../lib/stripe.js';
import { isConfigured } from '../lib/supabase.js';
import { getPendingRedeemCode, setPendingRedeemCode, clearPendingRedeemCode } from '../lib/referralRedeem.js';
import { useReferralIntent } from '../hooks/useReferralIntent.js';
import { getTierDisplayName, getActivePacks } from '../config/pricing.js';
import { t } from '../copy/index.js';
import { GOLD, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, sans, serif_, SP, FS, swatch } from './theme.js';
import IconButton from './primitives/IconButton.jsx';
import RedeemCodeField from './purchase/RedeemCodeField.jsx';
import ReferralIntentField from './purchase/ReferralIntentField.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';
import CaptchaGate from './perimeter/CaptchaGate.jsx';

export default function PurchaseModal({ onClose }) {
  const creditBalance = useStore(s => s.creditBalance);
  const authTier      = useStore(s => s.auth.tier);
  const isElevated    = useStore(s => s.isElevated());
  const isSignedIn    = useStore(s => Boolean(s.auth?.user?.id));
  const [loading, setLoading] = useState(null); // product key being purchased
  const [error, setError]     = useState(null);
  // Auto-reload consent (§4.2): OFF by default. Drives savePaymentMethod on the
  // credit-pack checkout so a future off-session reload can charge the saved card.
  const [saveCard, setSaveCard] = useState(false);
  // Redeem code (107): seeded from the Account-page handoff, editable inline.
  // Advisory input only — create-checkout re-validates and reserves it.
  const [redeemCode, setRedeemCode]     = useState(() => getPendingRedeemCode());
  const [redeemNotice, setRedeemNotice] = useState(null);
  // Wave-D human verification (INERT until the perimeterCaptcha flag + Turnstile
  // keys are set): a managed-Turnstile token, ADDITIVE onto the create-checkout
  // body. Null while the flag is off — the checkout body is then byte-identical.
  const [captchaToken, setCaptchaToken] = useState(null);
  // Referral intent (107): self-gates to signed-in, unpaid, never-referred.
  const referral = useReferralIntent();

  // Shared modal focus management: focus-in, Tab cycling, Escape-to-close, and
  // focus restore on unmount. Replaces the hand-rolled backdrop role=button.
  const dialogRef = useDialogFocusTrap(true, onClose);

  // Keep the cross-surface stash in sync with the field so the code survives
  // closing this modal and buying from Pricing instead (and vice versa).
  const handleRedeemChange = (v) => {
    setRedeemCode(v);
    if (v.trim()) setPendingRedeemCode(v.trim());
    else clearPendingRedeemCode();
  };

  const handlePurchase = async (product) => {
    setError(null);
    setLoading(product);
    try {
      // Referral intent rides AHEAD of checkout so the pending row exists
      // before the first payment lands. recordIntent never throws and a
      // rejection surfaces as a note — it must never block the purchase.
      await referral.recordIntent();
      const { redeemNotice: notice } = await startCheckout(product, { redeemCode, savePaymentMethod: saveCard, captchaToken: captchaToken || undefined });
      // The code is consumed (reserved or declined server-side) — drop the
      // stash so it cannot resurface on a later, unrelated purchase.
      clearPendingRedeemCode();
      if (notice) setRedeemNotice(notice);
      // Redirects to Stripe — won't reach here unless it fails
    } catch (e) {
      // P11 — keep the raw Stripe/network text out of the purchase surface
      // (console only) and show the reader a domain-language message, matching
      // PricingPage's checkout error handling.
      console.error('Checkout failed:', e);
      setError(t('purchase.failureMessage'));
      setLoading(null);
    }
  };

  // Derive from the active catalog (pricing.js) so the keys always match
  // PRODUCTS. Hardcoding legacy keys (credits_5/15/40) crashed this modal once
  // the catalog was repriced to credits_25/60/150 and PRODUCTS[key] went undefined.
  const creditPacks = Object.values(getActivePacks()).map((pack) => ({
    key: pack.key,
    icon: <Zap size={20} />,
    tier: pack.tier,
  }));

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click-to-close; keyboard dismissal (Escape) is handled by useDialogFocusTrap.
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- handlers only stop propagation to the backdrop, not real interactivity */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-modal-title"
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          width: '90%', maxWidth: 520,
          // Bound to the viewport and scroll inside, matching the Dialog Shell
          // primitive (H13). The old `overflow: hidden` with no height cap
          // clipped the lower form fields and the close button on short
          // (landscape-phone) viewports, leaving them unreachable.
          maxHeight: 'min(90vh, 680px)', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${SP.lg}px ${SP.xl}px`,
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          color: GOLD,
        }}>
          <h2 id="purchase-modal-title" style={{ margin: 0, fontSize: FS.xl + 1, fontFamily: serif_, fontWeight: 600 }}>
            {t('purchase.title')}
          </h2>
          <IconButton
            Icon={X}
            label={t('common.close')}
            onClick={onClose}
            tone="ghost"
            size="lg"
          />
        </div>

        <div style={{ padding: `${SP.xxl}px ${SP.xl}px`, display: 'flex', flexDirection: 'column', gap: SP.lg }}>
          {/* Current balance */}
          <div style={{
            padding: `${SP.md}px ${SP.lg}px`, background: swatch['#FAF8F4'],
            border: `1px solid ${GOLD}33`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: FS.sm, color: SECOND, fontFamily: sans }}>Current Balance</span>
            <span style={{ fontSize: FS.xl, fontWeight: 700, color: GOLD, fontFamily: sans }}>
              {isElevated ? '\u221E Unlimited' : `${creditBalance} credits`}
            </span>
          </div>

          {/* Developer bypass notice */}
          {isElevated && (
            <div style={{
              padding: `${SP.sm + 2}px ${SP.md}px`,
              background: swatch['#FAF8F4'], border: '1px solid #5A6E82',
              fontSize: FS.sm, color: swatch['#7C3AED'], textAlign: 'center',
            }}>
              Developer accounts have unlimited credits. Purchases are not required.
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.sm + 2}px ${SP.md}px`,
              background: swatch['#FAF8F4'], border: '1px solid #e8b0b0', borderLeft: `3px solid ${swatch.danger}`,
              fontSize: FS.sm, color: swatch.danger,
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!isConfigured && (
            <div style={{
              textAlign: 'center', fontSize: FS.sm, color: MUTED,
              fontStyle: 'italic', padding: `${SP.md}px 0`,
            }}>
              Payments are not available in local mode.
              Configure Supabase + Stripe to enable purchases.
            </div>
          )}

          {/* Credit packs with volume discount */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: SP.sm,
            fontSize: FS.xs, fontWeight: 700, color: SECOND,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <TrendingDown size={14} /> {t('purchase.packsHeading')}
          </div>

          <div style={{ display: 'flex', gap: SP.sm }}>
            {creditPacks.map(({ key, icon, tier }) => {
              const p = PRODUCTS[key];
              if (!p) return null;
              const isBest = tier === 'best';
              const isValue = tier === 'value';
              const borderColor = isBest ? '#2a7a2a' : isValue ? GOLD : BORDER;
              const accentColor = isBest ? '#2a7a2a' : isValue ? GOLD : SECOND;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePurchase(key)}
                  aria-label={`Buy ${p.credits} credits for ${p.price}`}
                  disabled={loading || !isConfigured}
                  style={{
                    flex: 1, padding: `${SP.lg}px ${SP.sm}px`,
                    background: isBest ? swatch['#FAF8F4'] : isValue ? swatch['#FAF8F4'] : CARD,
                    border: `2px solid ${borderColor}`,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs + 2,
                    fontFamily: sans, transition: 'border-color 0.2s, transform 0.1s',
                    opacity: loading ? 0.6 : 1,
                    position: 'relative',
                  }}
                >
                  {/* Discount badge */}
                  {p.discount && (
                    <div style={{
                      position: 'absolute', top: -10, right: -4,
                      padding: '2px 8px',
                      background: accentColor, color: swatch.white,
                      fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.02em',
                    }}>
                      {p.discount}
                    </div>
                  )}

                  <div style={{ color: accentColor }}>{icon}</div>
                  <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>{p.credits}</div>
                  <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase' }}>Credits</div>
                  <div style={{ fontSize: FS.xl, fontWeight: 700, color: accentColor }}>{p.price}</div>
                  <div style={{ fontSize: FS.xxs, color: MUTED }}>
                    {loading === key ? 'Redirecting...' : p.perCredit + '/ea'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auto-reload consent (§4.2 / #13). Signed-in only (a saved card needs an
              account). OFF by default; the whole label is the ~44px tap target. */}
          {isSignedIn && (
            <label htmlFor="auto-reload-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: SP.sm, marginTop: SP.sm, cursor: 'pointer' }}>
              <input
                id="auto-reload-consent"
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                style={{ marginTop: 2, width: 18, height: 18, flexShrink: 0 }}
                aria-label="Save my card for automatic credit reloads"
              />
              <span style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
                Save my card for automatic credit reloads. When your balance runs low we'll
                top it back up to your target and charge this card. Off by default. Manage or
                cancel anytime from your account.
              </span>
            </label>
          )}

          {/* Redeem-code disclosure (107). The typed code rides along on
              whichever pack the reader buys; the server decides whether it fits
              and answers with a notice when it does not. */}
          {isConfigured && !isElevated && (
            <RedeemCodeField code={redeemCode} onChange={handleRedeemChange} idPrefix="purchase-modal" />
          )}
          {redeemNotice && (
            <div role="status" style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
              {redeemNotice}
            </div>
          )}

          {/* Referral intent (107) — renders nothing unless the reader is
              signed in, unpaid, and never referred. */}
          <ReferralIntentField referral={referral} idPrefix="purchase-modal" />

          {/* Free users: a soft upsell to the subscription (which includes a
              monthly credit allowance) instead of repeat credit top-ups. */}
          {authTier !== 'premium' && !isElevated && (
            <div style={{ fontSize: FS.sm, color: SECOND, textAlign: 'center', lineHeight: 1.55 }}>
              Buying credits often?{' '}
              <button
                type="button"
                onClick={() => handlePurchase('premium')}
                disabled={loading || !isConfigured}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: GOLD, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                  textDecoration: 'underline', fontFamily: sans, fontSize: 'inherit',
                }}
              >
                {loading === 'premium' ? 'Redirecting...' : `or upgrade to ${getTierDisplayName('premium')}`}
              </button>
              {' '}for a monthly credit allowance.
            </div>
          )}

          {/* Wave-D human verification (INERT until activated). Managed/invisible:
              silent for humans, so it adds no visible step; renders nothing while
              the perimeterCaptcha flag is off. */}
          <CaptchaGate action="checkout" onToken={setCaptchaToken} className="captcha-checkout" />

          <div style={{ fontSize: FS.xxs, color: MUTED, textAlign: 'center', lineHeight: 1.5 }}>
            Payments processed securely by Stripe. Credits never expire.
          </div>

          {/* Point-of-purchase legal links (additive only — no paid-surface
              behavior change). New tab so the checkout flow is never disrupted.
              The refund/cancellation policy lives in Terms §Refunds; /refunds
              resolves to it. */}
          <div style={{ fontSize: FS.xxs, color: MUTED, textAlign: 'center', lineHeight: 1.5, marginTop: SP.xs }}>
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: 'underline' }}>{t('footer.terms')}</a>
            {' · '}
            <a href="/refunds" target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: 'underline' }}>{t('footer.refunds')}</a>
            {' · '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: 'underline' }}>{t('footer.privacy')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
