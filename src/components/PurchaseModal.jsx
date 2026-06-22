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
import { getTierDisplayName, getActivePacks } from '../config/pricing.js';
import { t } from '../copy/index.js';
import { GOLD, GOLD_DEEP, GOLD_B, GOLD_BG, GREEN_DEEP, INK, INK_DEEP, BODY, SECOND, BORDER, CARD, sans, serif_, SP, R, FS, ELEV, swatch, TINT_GOLD, TINT_GREEN, TINT_VIOLET_HI, DANGER_BORDER } from './theme.js';
import IconButton from './primitives/IconButton.jsx';
import Button from './primitives/Button.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';

export default function PurchaseModal({ onClose }) {
  const creditBalance = useStore(s => s.creditBalance);
  const authTier      = useStore(s => s.auth.tier);
  const isElevated    = useStore(s => s.isElevated());
  const [loading, setLoading] = useState(null); // product key being purchased
  const [error, setError]     = useState(null);

  // Shared modal focus management: focus-in, Tab cycling, Escape-to-close, and
  // focus restore on unmount. Replaces the hand-rolled backdrop role=button.
  const dialogRef = useDialogFocusTrap(true, onClose);

  const handlePurchase = async (product) => {
    setError(null);
    setLoading(product);
    try {
      await startCheckout(product);
      // Redirects to Stripe — won't reach here unless it fails
    } catch (e) {
      setError(e.message);
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
          background: CARD, borderRadius: R.xl,
          border: `1px solid ${BORDER}`,
          boxShadow: ELEV[3],
          width: '90%', maxWidth: 520, overflow: 'hidden',
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
            padding: `${SP.md}px ${SP.lg}px`, background: GOLD_BG,
            borderRadius: R.lg, border: `1px solid ${GOLD_B}`,
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
              background: TINT_VIOLET_HI, border: `1px solid ${swatch['#7C3AED']}`,
              borderRadius: R.md, fontSize: FS.sm, color: swatch['#7C3AED'], textAlign: 'center',
            }}>
              Developer accounts have unlimited credits. Purchases are not required.
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.sm + 2}px ${SP.md}px`,
              background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md,
              fontSize: FS.sm, color: swatch.danger,
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!isConfigured && (
            <div style={{
              textAlign: 'center', fontSize: FS.sm, color: BODY,
              fontStyle: 'italic', padding: `${SP.md}px 0`,
            }}>
              Payments are not available in this environment.
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
              const borderColor = isBest ? GREEN_DEEP : isValue ? GOLD : BORDER;
              // Text/badge fills must clear WCAG AA on the light tint card, so the
              // value tier uses GOLD_DEEP (gold-700, ~4.7:1 on white) rather than
              // the lighter GOLD that the 2px border can safely use.
              const accentColor = isBest ? GREEN_DEEP : isValue ? GOLD_DEEP : SECOND;
              return (
                // Bespoke column-stacked offer card (icon over credits over
                // price): the Button primitive's inline-row layout cannot
                // express it. Grandfathered in scripts/.raw-button-baseline.json.
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePurchase(key)}
                  aria-label={`Buy ${p.credits} credits for ${p.price}`}
                  disabled={loading || !isConfigured}
                  style={{
                    flex: 1, padding: `${SP.lg}px ${SP.sm}px`,
                    background: isBest ? TINT_GREEN : isValue ? TINT_GOLD : CARD,
                    border: `2px solid ${borderColor}`,
                    borderRadius: R.xl, cursor: loading ? 'wait' : 'pointer',
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
                      padding: '2px 8px', borderRadius: R.md,
                      background: accentColor, color: swatch.white,
                      fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.02em',
                    }}>
                      {p.discount}
                    </div>
                  )}

                  <div style={{ color: accentColor }}>{icon}</div>
                  <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>{p.credits}</div>
                  <div style={{ fontSize: FS.xxs, color: BODY, textTransform: 'uppercase' }}>Credits</div>
                  <div style={{ fontSize: FS.xl, fontWeight: 700, color: accentColor }}>{p.price}</div>
                  <div style={{ fontSize: FS.xxs, color: BODY }}>
                    {loading === key ? 'Redirecting...' : p.perCredit + '/ea'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Free users: a soft upsell to the subscription (which includes a
              monthly credit allowance) instead of repeat credit top-ups. */}
          {authTier !== 'premium' && !isElevated && (
            <div style={{ fontSize: FS.sm, color: SECOND, textAlign: 'center', lineHeight: 1.55 }}>
              Buying credits often?{' '}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePurchase('premium')}
                disabled={loading || !isConfigured}
                busy={loading === 'premium'}
                style={{
                  display: 'inline-flex', minHeight: 0, padding: 0,
                  color: GOLD, fontWeight: 700, fontSize: 'inherit',
                  textDecoration: 'underline', verticalAlign: 'baseline',
                }}
              >
                {loading === 'premium' ? 'Redirecting...' : `or upgrade to ${getTierDisplayName('premium')}`}
              </Button>
              {' '}for a monthly credit allowance.
            </div>
          )}

          <div style={{ fontSize: FS.xxs, color: BODY, textAlign: 'center', lineHeight: 1.5 }}>
            Payments processed securely by Stripe. Credits never expire.
          </div>
        </div>
      </div>
    </div>
  );
}
