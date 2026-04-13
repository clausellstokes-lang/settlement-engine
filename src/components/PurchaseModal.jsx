/**
 * PurchaseModal.jsx — Credit pack and premium upgrade purchase UI.
 *
 * Displays available products and initiates Stripe Checkout
 * via the create-checkout edge function.
 */
import React, { useState } from 'react';
import { X, Zap, Crown, AlertCircle } from 'lucide-react';
import { useStore } from '../store/index.js';
import { startCheckout, PRODUCTS } from '../lib/stripe.js';
import { isConfigured } from '../lib/supabase.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, sans, serif_, SP, R, FS } from './theme.js';

export default function PurchaseModal({ onClose }) {
  const creditBalance = useStore(s => s.creditBalance);
  const authTier      = useStore(s => s.auth.tier);
  const [loading, setLoading] = useState(null); // product key being purchased
  const [error, setError]     = useState(null);

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

  const creditPacks = [
    { key: 'credits_10', icon: <Zap size={20} />, highlight: false },
    { key: 'credits_50', icon: <Zap size={20} />, highlight: true },
  ];

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
        style={{
          background: CARD, borderRadius: R.xl,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          width: '90%', maxWidth: 440, overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${SP.lg}px ${SP.xl}px`,
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          color: GOLD,
        }}>
          <h2 style={{ margin: 0, fontSize: FS.xl + 1, fontFamily: serif_, fontWeight: 600 }}>
            Purchase
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: `${SP.xxl}px ${SP.xl}px`, display: 'flex', flexDirection: 'column', gap: SP.lg }}>
          {/* Current balance */}
          <div style={{
            padding: `${SP.md}px ${SP.lg}px`, background: GOLD_BG,
            borderRadius: R.lg, border: `1px solid rgba(160,118,42,0.2)`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: FS.sm, color: SECOND, fontFamily: sans }}>Current Balance</span>
            <span style={{ fontSize: FS.xl, fontWeight: 700, color: GOLD, fontFamily: sans }}>
              {creditBalance} credits
            </span>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.sm + 2}px ${SP.md}px`,
              background: '#fdf4f4', border: '1px solid #e8b0b0', borderRadius: R.md,
              fontSize: FS.sm, color: '#8b1a1a',
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

          {/* Credit packs */}
          <div style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Credit Packs
          </div>

          <div style={{ display: 'flex', gap: SP.md }}>
            {creditPacks.map(({ key, icon, highlight }) => {
              const p = PRODUCTS[key];
              return (
                <button
                  key={key}
                  onClick={() => handlePurchase(key)}
                  disabled={loading || !isConfigured}
                  style={{
                    flex: 1, padding: `${SP.lg}px ${SP.md}px`,
                    background: highlight ? 'rgba(42,122,42,0.08)' : CARD,
                    border: `2px solid ${highlight ? 'rgba(42,122,42,0.4)' : BORDER}`,
                    borderRadius: R.xl, cursor: loading ? 'wait' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm,
                    fontFamily: sans, transition: 'border-color 0.2s',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <div style={{ color: highlight ? '#2a7a2a' : GOLD }}>{icon}</div>
                  <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>{p.credits} Credits</div>
                  <div style={{ fontSize: FS.xl, fontWeight: 700, color: highlight ? '#2a7a2a' : GOLD }}>{p.price}</div>
                  {highlight && <div style={{ fontSize: FS.xxs, color: '#2a7a2a', fontWeight: 600 }}>BEST VALUE</div>}
                  <div style={{ fontSize: FS.xxs, color: MUTED }}>
                    {loading === key ? 'Redirecting...' : 'One-time purchase'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Premium upgrade (only if not already premium) */}
          {authTier !== 'premium' && (
            <>
              <div style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: SP.sm }}>
                Premium Subscription
              </div>
              <button
                onClick={() => handlePurchase('premium')}
                disabled={loading || !isConfigured}
                style={{
                  padding: `${SP.lg}px ${SP.xl}px`,
                  background: 'linear-gradient(135deg, rgba(160,118,42,0.1) 0%, rgba(160,118,42,0.05) 100%)',
                  border: `2px solid ${GOLD}`,
                  borderRadius: R.xl, cursor: loading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: SP.lg,
                  fontFamily: sans, transition: 'border-color 0.2s',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Crown size={28} color={GOLD} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>
                    Premium {PRODUCTS.premium.price}
                  </div>
                  <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5, marginTop: 2 }}>
                    Unlimited saves, Neighbourhood System, PDF/JSON export, Map supply chains
                  </div>
                </div>
                <div style={{ fontSize: FS.sm, fontWeight: 600, color: GOLD }}>
                  {loading === 'premium' ? 'Redirecting...' : 'Upgrade'}
                </div>
              </button>
            </>
          )}

          <div style={{ fontSize: FS.xxs, color: MUTED, textAlign: 'center', lineHeight: 1.5 }}>
            Payments processed securely by Stripe. Credits never expire.
          </div>
        </div>
      </div>
    </div>
  );
}
