/**
 * AccountSubscriptionSection.jsx — Subscription, credits, saves, billing
 * portal, inline credit-pack purchase, and the Founder tile for the Account
 * page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Purely
 * presentational: all state, handlers, and store access stay in AccountPage
 * and arrive via props.
 *
 * This is the page's one "feature" section (tone="feature") and its conversion
 * region: for free users it carries the single high-emphasis primary upgrade
 * CTA, and the per-tile upsell footers route to that same next step rather than
 * dead-ending in prose. The tier tile is the dominant stat (P4); credits and
 * saves recede one step.
 */
import { lazy as _lazy, Suspense as _Suspense } from 'react';
import { Crown, CreditCard, ArrowRight } from 'lucide-react';
import { getTierDisplayName, getActivePacks } from '../../config/pricing.js';
import { isConfigured } from '../../lib/supabase.js';
import { t } from '../../copy/index.js';
import {
  GOLD_DEEP, GOLD_BG, INK, MUTED, BODY, SECOND, serif_, SP, R, FS, swatch,
  AMBER_DEEP, DANGER_BORDER, TINT_VIOLET, TINT_VIOLET_HI, TINT_GREEN, TINT_AMBER_HI,
} from '../theme.js';
import Section from './AccountSection.jsx';
import Button from '../primitives/Button.jsx';
import Pill from '../primitives/Pill.jsx';
import { useFounderTileEligible } from '../../hooks/useFounderTileEligible.js';
import useIsMobile from '../../hooks/useIsMobile.js';
// Founder Lifetime tile, audience-gated to worldbuilder behavior.
// Self-gates inside; renders null for non-worldbuilder users.
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
  onNavigatePricing,
}) {
  const isFree = !isElevated && auth.tier !== 'premium';
  // P8 — one primary per region. When the audience-earned Founder tile is
  // eligible it renders its OWN solid-gold "Claim seat" primary lower in this
  // section; a free worldbuilder would then satisfy both that and the generic
  // "See Cartographer" primary below, stacking two co-equal gold CTAs. The $99
  // conviction offer is the higher-intent action, so it keeps the primary and
  // the generic CTA drops to secondary — exactly one focal click survives.
  const founderTileShowing = useFounderTileEligible();
  // Mobile raises the credit-pack tile basis floor so a wrapped tile keeps a
  // usable width for its multi-line copy (credits / price / per-each) instead of
  // collapsing toward ~110px. Desktop keeps the 110px basis byte-identical.
  const isMobile = useIsMobile();
  return (
    <Section title={t('account.subscriptionHeading')} tone="feature">
      <div style={{ display: 'flex', gap: SP.lg, flexWrap: 'wrap' }}>
        {/* Tier card — the dominant stat (larger value), grows an "unlock"
            footer for free users. */}
        <div style={{
          flex: '1.4 1 200px',
          background: GOLD_BG, borderRadius: R.lg,
          overflow: 'hidden',
        }}>
          <div style={{ padding: SP.lg, textAlign: 'center' }}>
            <div style={{ fontSize: FS.sm, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              {t('account.cardCurrentTier')}
            </div>
            <div style={{
              fontSize: FS['28'], fontWeight: 700, fontFamily: serif_,
              color: isElevated ? swatch['#7C3AED'] : auth.tier === 'premium' ? swatch['#2A7A2A'] : GOLD_DEEP,
              textTransform: 'uppercase',
            }}>
              {isElevated ? t('account.fullAccess') : getTierDisplayName(auth.tier)}
            </div>
          </div>
          {isFree && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: TINT_VIOLET,
              fontSize: FS.xs, color: swatch['#3A2F18'], lineHeight: 1.5,
            }}>
              <b style={{ color: swatch['#7C3AED'] }}>Cartographer unlocks:</b> unlimited saves,
              cloud sync, neighbours, AI prose pass.
            </div>
          )}
        </div>

        {/* Credits card — recedes one step; grows "try Narrate" footer when
            balance is 0. */}
        <div style={{
          flex: '1 1 180px',
          background: TINT_VIOLET, borderRadius: R.lg,
          overflow: 'hidden',
        }}>
          <div style={{ padding: SP.lg, textAlign: 'center' }}>
            <div
              style={{ fontSize: FS.sm, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}
              title="A credit funds one narrated prose pass on a settlement."
            >
              {t('account.cardCredits')}
            </div>
            <div style={{ fontSize: FS.xxl, fontWeight: 700, color: swatch['#7C3AED'] }}>
              {isElevated ? '∞' : creditBalance}
            </div>
          </div>
          {!isElevated && creditBalance === 0 && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: TINT_VIOLET_HI,
              fontSize: FS.xs, color: swatch['#3A2F18'], lineHeight: 1.5,
            }}>
              <b style={{ color: swatch['#7C3AED'] }}>Try Narrate.</b> Turn this town's data
              into table-ready prose.{' '}
              <span style={{ color: swatch['#2A7A2A'], fontWeight: 700 }}>First credit free.</span>
            </div>
          )}
        </div>

        {/* Saves card — recedes one step; grows "one save left" / "saves
            full" footer. */}
        <div style={{
          flex: '1 1 180px',
          background: TINT_GREEN, borderRadius: R.lg,
          overflow: 'hidden',
        }}>
          <div style={{ padding: SP.lg, textAlign: 'center' }}>
            <div style={{ fontSize: FS.sm, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              {t('account.cardSaves')}
            </div>
            <div style={{ fontSize: FS.xxl, fontWeight: 700, color: swatch['#2A7A2A'] }}>
              {activeSaves} / {maxSaves === Infinity ? '∞' : maxSaves}
            </div>
            {inactiveSaves > 0 && (
              <div style={{ fontSize: FS.xs, color: BODY, marginTop: SP.xs }}>
                {inactiveSaves} inactive retained
              </div>
            )}
          </div>
          {!isElevated && maxSaves !== Infinity && activeSaves >= maxSaves - 1 && (
            <div style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: TINT_AMBER_HI,
              fontSize: FS.xs, color: swatch['#3A2F18'], lineHeight: 1.5,
            }}>
              {/* Two-channel warning: AMBER_DEEP (amber-700, AA on the amber
                  tint — brand AMBER failed at 2.72:1) carries the colour, and
                  the bold warning text carries the meaning, so the state reads
                  in weight + text + colour, never amber alone (P7). */}
              <b style={{ color: AMBER_DEEP }}>
                {activeSaves >= maxSaves ? 'Saves full.' : 'One save left.'}
              </b>{' '}
              Cartographer lifts the cap and syncs your library across every device.
            </div>
          )}
        </div>
      </div>

      {/* Conversion CTA — the one high-emphasis primary action of this region.
          Free users get an obvious first click to Pricing; the per-tile upsell
          footers above all point here. */}
      {isFree && (
        <div style={{ marginTop: SP.lg }}>
          <Button
            variant={founderTileShowing ? 'secondary' : 'primary'}
            size="lg"
            icon={<Crown size={16} />}
            trailingIcon={<ArrowRight size={16} />}
            onClick={onNavigatePricing}
          >
            See Cartographer
          </Button>
        </div>
      )}

      {auth.tier === 'premium' && !isElevated && (
        <div style={{ marginTop: SP.lg }}>
          <Button
            variant="secondary"
            size="md"
            icon={<CreditCard size={15} />}
            onClick={handleManageBilling}
            disabled={portalBusy || !isConfigured}
          >
            {portalBusy ? 'Opening portal...' : 'Manage subscription'}
          </Button>
          {/* Billing-portal error sits with the control that produced it
              (handleManageBilling sets purchaseError). */}
          {purchaseError && (
            <div role="alert" style={{
              marginTop: SP.sm, padding: `${SP.sm}px ${SP.md}px`,
              background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md,
              fontSize: FS.sm, color: swatch.danger,
            }}>
              {purchaseError}
            </div>
          )}
          {!isConfigured && (
            <div style={{ marginTop: SP.sm, fontSize: FS.xs, color: BODY }}>
              Billing is unavailable in this environment.
            </div>
          )}
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
            {t('account.purchaseCreditsLabel')}
          </div>

          {/* Show the purchase error here only when there's no premium Manage
              block above (where it already renders adjacent to its button). */}
          {purchaseError && auth.tier !== 'premium' && (
            <div role="alert" style={{
              padding: `${SP.sm}px ${SP.md}px`, marginBottom: SP.md,
              background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md,
              fontSize: FS.sm, color: swatch.danger,
            }}>
              {purchaseError}
            </div>
          )}

          {!isConfigured && auth.tier !== 'premium' && (
            <div style={{ marginBottom: SP.md, fontSize: FS.xs, color: BODY }}>
              Billing is unavailable in this environment.
            </div>
          )}

          <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
            {/* Read packs from getActivePacks() so the
                `packsRepriced` flag wins. Hardcoded list was bypassing
                the flag and showing legacy 5/15/40 even when the new
                25/60/150 catalog was active. The pack record carries
                its own `tier` ('starter' | 'value' | 'best') — use
                that for accent color so a future repricing doesn't
                need a UI update. */}
            {Object.values(getActivePacks()).map(p => {
              const key = p.key;
              const isBest = p.tier === 'best';
              const accent = isBest
                ? swatch['#2A7A2A']
                : p.tier === 'value' ? GOLD_DEEP : SECOND;
              const ariaLabel = `${p.credits} credits for ${p.price}${p.discount ? ', ' + p.discount + ' off' : ''}`;
              return (
                <Button
                  key={key}
                  variant={isBest ? 'gold' : 'secondary'}
                  size="md"
                  onClick={() => handlePurchase(key)}
                  disabled={purchasing || !isConfigured}
                  busy={purchasing === key}
                  aria-label={ariaLabel}
                  style={{
                    flex: isMobile ? '1 1 140px' : '1 1 110px', flexDirection: 'column', gap: SP.xs,
                    padding: `${SP.md}px ${SP.sm}px`, position: 'relative',
                    whiteSpace: 'normal',
                  }}
                >
                  {p.discount && (
                    <Pill
                      absolute
                      bg={accent}
                      color={swatch.white}
                      style={{ top: -8, right: -4, fontWeight: 800, letterSpacing: 0 }}
                    >{p.discount}</Pill>
                  )}
                  <span style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>{p.credits}</span>
                  <span style={{ fontSize: FS.xs, color: BODY, fontWeight: 400 }}>credits</span>
                  <span style={{ fontSize: FS.md, fontWeight: 700, color: accent }}>{p.price}</span>
                  <span style={{ fontSize: FS.xs, color: BODY, fontWeight: 400 }}>{purchasing === key ? 'Redirecting...' : p.perCredit + '/ea'}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Founder Lifetime tile. Self-gates on
          audience='worldbuilder' + flag + seats-remaining > 0.
          Renders null for everyone else, so this is safe to mount
          unconditionally here. */}
      <_Suspense fallback={null}>
        <FounderTile />
      </_Suspense>
    </Section>
  );
}
