/**
 * AccountSubscriptionSection.jsx — Subscription, credits, saves, billing
 * portal, inline credit-pack purchase, and the Founder tile for the Account
 * page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Purely
 * presentational: all state, handlers, and store access stay in AccountPage
 * and arrive via props.
 */
import { lazy as _lazy, Suspense as _Suspense } from 'react';
import { Crown, TrendingDown, CreditCard } from 'lucide-react';
import { getTierDisplayName, getActivePacks } from '../../config/pricing.js';
import { isConfigured } from '../../lib/supabase.js';
import { t } from '../../copy/index.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, CARD, sans, serif_, SP, R, FS, swatch, AMBER } from '../theme.js';
import Section from './AccountSection.jsx';
// P116 / X-8 — Founder Lifetime tile, audience-gated to worldbuilder
// behavior. Self-gates inside; renders null for non-worldbuilder users.
const FounderTile = _lazy(() => import('../pricing/FounderTile.jsx'));

export default function AccountSubscriptionSection({
  auth,
  isElevated,
  creditBalance,
  activeSaves,
  inactiveSaves,
  maxSaves,
  portalBusy,
  handleManageBilling,
  purchaseError,
  purchasing,
  handlePurchase,
}) {
  return (
    <Section title={t('account.subscriptionHeading')} icon={Crown}>
      <div style={{ display: 'flex', gap: SP.lg, flexWrap: 'wrap' }}>
        {/* Tier card — P125 / AC-1 grows an "unlock" footer for free users. */}
        <div style={{
          flex: '1 1 180px',
          background: GOLD_BG, borderRadius: R.lg,
          border: `1px solid rgba(160,118,42,0.2)`,
          overflow: 'hidden',
        }}>
          <div style={{ padding: SP.lg, textAlign: 'center' }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              {t('account.cardCurrentTier')}
            </div>
            <div style={{
              fontSize: FS.xxl, fontWeight: 700, fontFamily: serif_,
              color: isElevated ? '#7c3aed' : auth.tier === 'premium' ? '#2a7a2a' : GOLD,
              textTransform: 'uppercase',
            }}>
              {isElevated ? t('account.fullAccess') : getTierDisplayName(auth.tier)}
            </div>
          </div>
          {!isElevated && auth.tier !== 'premium' && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: 'rgba(124,58,237,0.06)',
              borderTop: '1px solid rgba(124,58,237,0.20)',
              fontSize: FS.xs, color: swatch['#3A2F18'], lineHeight: 1.5,
            }}>
              <b style={{ color: swatch['#7C3AED'] }}>Cartographer unlocks:</b> every size,
              unlimited saves, neighbours, AI prose pass.
            </div>
          )}
        </div>

        {/* Credits card — grows "try Narrate" footer when balance is 0. */}
        <div style={{
          flex: '1 1 180px',
          background: 'rgba(124,58,237,0.06)', borderRadius: R.lg,
          border: '1px solid rgba(124,58,237,0.15)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: SP.lg, textAlign: 'center' }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              {t('account.cardCredits')}
            </div>
            <div style={{ fontSize: FS.xxl, fontWeight: 700, color: swatch['#7C3AED'] }}>
              {isElevated ? '\u221E' : creditBalance}
            </div>
          </div>
          {!isElevated && creditBalance === 0 && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: 'rgba(124,58,237,0.10)',
              borderTop: '1px solid rgba(124,58,237,0.25)',
              fontSize: FS.xs, color: swatch['#3A2F18'], lineHeight: 1.5,
            }}>
              <b style={{ color: swatch['#7C3AED'] }}>Try Narrate.</b> Turn this town's data
              into table-ready prose.{' '}
              <span style={{ color: swatch['#2A7A2A'], fontWeight: 700 }}>First credit free.</span>
            </div>
          )}
        </div>

        {/* Saves card — grows "one save left" / "saves full" footer. */}
        <div style={{
          flex: '1 1 180px',
          background: 'rgba(42,122,42,0.06)', borderRadius: R.lg,
          border: '1px solid rgba(42,122,42,0.15)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: SP.lg, textAlign: 'center' }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              {t('account.cardSaves')}
            </div>
            <div style={{ fontSize: FS.xxl, fontWeight: 700, color: swatch['#2A7A2A'] }}>
              {activeSaves} / {maxSaves === Infinity ? '\u221E' : maxSaves}
            </div>
            {inactiveSaves > 0 && (
              <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: SP.xs }}>
                {inactiveSaves} inactive retained
              </div>
            )}
          </div>
          {!isElevated && maxSaves !== Infinity && activeSaves >= maxSaves - 1 && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: 'rgba(208,128,32,0.10)',
              borderTop: '1px solid rgba(208,128,32,0.30)',
              fontSize: FS.xs, color: swatch['#3A2F18'], lineHeight: 1.5,
            }}>
              <b style={{ color: AMBER }}>
                {activeSaves >= maxSaves ? 'Saves full.' : 'One save left.'}
              </b>{' '}
              Cartographer = unlimited + cloud sync. Phone, laptop, table.
            </div>
          )}
        </div>
      </div>

      {auth.tier === 'premium' && !isElevated && (
        <div style={{ marginTop: SP.lg }}>
          <button
            type="button"
            onClick={handleManageBilling}
            disabled={portalBusy || !isConfigured}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.sm}px ${SP.lg}px`,
              background: CARD, color: GOLD,
              border: `1px solid ${GOLD}`, borderRadius: R.lg,
              cursor: portalBusy ? 'wait' : 'pointer',
              fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
              opacity: portalBusy ? 0.65 : 1,
            }}
          >
            <CreditCard size={15} /> {portalBusy ? 'Opening portal...' : 'Manage subscription'}
          </button>
        </div>
      )}

      {/* Purchase credits (inline) */}
      {!isElevated && (
        <div style={{ marginTop: SP.lg }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.md,
            fontSize: FS.xs, fontWeight: 700, color: SECOND,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <TrendingDown size={14} /> {t('account.purchaseCreditsLabel')}
          </div>

          {purchaseError && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`, marginBottom: SP.md,
              background: swatch.dangerBg, border: '1px solid #e8b0b0', borderRadius: R.md,
              fontSize: FS.sm, color: swatch.danger,
            }}>
              {purchaseError}
            </div>
          )}

          <div style={{ display: 'flex', gap: SP.sm }}>
            {/* P125 / AC-2 — Read packs from getActivePacks() so the
                `packsRepriced` flag wins. Hardcoded list was bypassing
                the flag and showing legacy 5/15/40 even when the new
                25/60/150 catalog was active. The pack record carries
                its own `tier` ('starter' | 'value' | 'best') — use
                that for accent color so a future repricing doesn't
                need a UI update. */}
            {Object.values(getActivePacks()).map(p => {
              const key = p.key;
              const accent = p.tier === 'best'
                ? '#2a7a2a'
                : p.tier === 'value' ? GOLD : SECOND;
              return (
                <button key={key} onClick={() => handlePurchase(key)}
                  disabled={purchasing || !isConfigured}
                  style={{
                    flex: 1, padding: `${SP.md}px ${SP.sm}px`,
                    background: CARD, border: `2px solid ${accent}20`,
                    borderRadius: R.lg, cursor: 'pointer', fontFamily: sans,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs,
                    opacity: purchasing ? 0.6 : 1, position: 'relative',
                  }}>
                  {p.discount && (
                    <span style={{
                      position: 'absolute', top: -8, right: -4,
                      padding: '2px 6px', borderRadius: R.sm, background: accent,
                      color: swatch.white, fontSize: FS.micro, fontWeight: 800,
                    }}>{p.discount}</span>
                  )}
                  <span style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>{p.credits}</span>
                  <span style={{ fontSize: FS.xxs, color: MUTED }}>credits</span>
                  <span style={{ fontSize: FS.md, fontWeight: 700, color: accent }}>{p.price}</span>
                  <span style={{ fontSize: FS.xxs, color: MUTED }}>{purchasing === key ? 'Redirecting...' : p.perCredit + '/ea'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* P116 / X-8 — Founder Lifetime tile. Self-gates on
          audience='worldbuilder' + flag + seats-remaining > 0.
          Renders null for everyone else, so this is safe to mount
          unconditionally here. */}
      <_Suspense fallback={null}>
        <FounderTile />
      </_Suspense>
    </Section>
  );
}
