/**
 * PricingPage.jsx - Public pricing page.
 *
 * Reads the catalog from `src/config/pricing.js` and the strings from
 * `src/copy/`. Hard-coding nothing here means a price/copy/tier change
 * is a one-file edit (in pricing.js or en.js), and the page reflects
 * it the next reload.
 *
 * Sections (UI Redesign §13):
 *   1. Three subscription tiers (Wanderer / Cartographer / Founder Lifetime)
 *   2. Credit packs (volume-discount table)
 *   3. Single-dossier microtransaction call-out
 *
 * SEO note: this is one of the public surfaces. Eventually the route
 * needs a proper crawlable URL (currently it's a state-driven view).
 * Until the SPA gets split into per-page routes, the canonical link
 * is /?view=pricing - set by the footer + header CTA.
 */

import { useEffect, useState } from 'react';
import { Crown, Zap, Map as MapIcon, Sparkles, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { startCheckout, startCustomerPortal } from '../lib/stripe.js';
import { isConfigured } from '../lib/supabase.js';
import {
  getVisibleTiers, getActivePacks, getTierDisplayName,
  SINGLE_DOSSIER, singleDossierEnabled,
} from '../config/pricing.js';
import { t, tx } from '../copy/index.js';
import { useCopy } from '../hooks/useCopy.js';
import { GOLD, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, PARCH, sans, serif_, SP, R, FS, BODY, swatch, PAGE_MAX } from './theme.js';
import FounderBadge from './primitives/FounderBadge.jsx';

// Tier-icon mapping. Kept here (not in pricing config) because icons
// are a UI concern - the config stays headless.
const TIER_ICONS = {
  wanderer:     MapIcon,
  cartographer: Sparkles,
  founder:      Crown,
};

function FeatureRow({ children }) {
  return (
    <li style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '4px 0', color: BODY, fontSize: FS.sm,
      fontFamily: sans, lineHeight: 1.5,
    }}>
      <Check size={14} color={GOLD} style={{ flexShrink: 0, marginTop: 4 }} />
      <span>{children}</span>
    </li>
  );
}

function TierCard({ tier, ctaLabel, ctaSub, onCta, loading, emphasised, founderSeatsRemaining, audienceLine }) {
  const Icon = TIER_ICONS[tier.key] || Sparkles;
  const features = tx(`pricing.tiers.${tier.key}.features`) || [];
  // P122 / X-10 - Prefer audience-led pitch over generic tagline when the
  // flag is on and a per-audience line is available. Falls back cleanly
  // to the legacy tagline.
  const tagline  = audienceLine || t(`pricing.tiers.${tier.key}.tagline`);
  const priceLabel = t(`pricing.tiers.${tier.key}.priceLabel`);
  const priceSub   = t(`pricing.tiers.${tier.key}.priceSub`);
  const name       = getTierDisplayName(tier.legacyKey) || t(`pricing.tiers.${tier.key}.name`);

  return (
    <article
      style={{
        flex: '1 1 240px', minWidth: 240, maxWidth: 320,
        background: CARD,
        border: emphasised ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
        borderRadius: R.xl,
        padding: `${SP.lg}px ${SP.lg}px ${SP.xl}px`,
        display: 'flex', flexDirection: 'column', gap: SP.md,
        boxShadow: emphasised
          ? '0 6px 24px rgba(201,162,76,0.25)'
          : '0 2px 10px rgba(27,20,8,0.08)',
        position: 'relative',
      }}
    >
      {emphasised && (
        <span
          style={{
            position: 'absolute', top: -10, right: 16,
            background: GOLD, color: swatch.white,
            fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.06em',
            padding: '3px 9px', borderRadius: 4,
            textTransform: 'uppercase',
          }}
        >
          Most popular
        </span>
      )}

      <header style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <Icon size={22} color={GOLD} aria-hidden="true" />
        <h3 style={{
          margin: 0,
          fontFamily: serif_, fontSize: FS.xl, fontWeight: 600, color: INK,
        }}>
          {name}
        </h3>
        {tier.key === 'founder' && <FounderBadge force size="sm" />}
      </header>

      <p style={{
        margin: 0, fontSize: FS.sm, color: BODY,
        fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.5,
      }}>
        {tagline}
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: FS['32'], fontFamily: serif_, fontWeight: 600, color: INK, lineHeight: 1 }}>
          {priceLabel}
        </span>
        <span style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
          {priceSub}
        </span>
      </div>

      {tier.key === 'founder' && (
        <p style={{ margin: 0, fontSize: FS.xs, color: swatch['#7C3AED'], fontFamily: sans, fontWeight: 600 }}>
          {/* Tier 7.6: live seat count via the founder_seats_taken RPC
              (migration 010). The fetch may fail or be pending; fall
              back to the safe "Limited to 500 seats" copy in those
              cases so the card stays informative either way. */}
          {typeof founderSeatsRemaining === 'number'
            ? `${founderSeatsRemaining} of 500 seats remaining.`
            : 'Limited to 500 seats.'}
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        {features.map((f, i) => <FeatureRow key={i}>{f}</FeatureRow>)}
      </ul>

      <button
        type="button"
        onClick={onCta}
        disabled={loading || (!isConfigured && tier.priceCents > 0)}
        style={{
          width: '100%', padding: `${SP.md}px 0`,
          background: emphasised
            ? `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`
            : 'transparent',
          color: emphasised ? '#fff' : GOLD,
          border: emphasised ? 'none' : `1.5px solid ${GOLD}`,
          borderRadius: R.lg,
          fontSize: FS.md, fontWeight: 700, fontFamily: sans,
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.6 : 1,
          letterSpacing: '0.02em',
        }}
      >
        {loading ? 'Redirecting...' : ctaLabel}
      </button>
      {ctaSub && (
        <p style={{
          margin: 0, fontSize: FS.xxs, color: MUTED,
          fontFamily: sans, textAlign: 'center',
        }}>
          {ctaSub}
        </p>
      )}
    </article>
  );
}

function PackTile({ pack, onBuy, loading, emphasised }) {
  return (
    <button
      type="button"
      onClick={onBuy}
      disabled={loading || !isConfigured}
      style={{
        flex: '1 1 160px', minWidth: 160,
        padding: `${SP.lg}px ${SP.md}px`,
        background: emphasised ? 'rgba(201,162,76,0.06)' : CARD,
        border: `2px solid ${emphasised ? GOLD : BORDER}`,
        borderRadius: R.xl,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: sans, opacity: loading ? 0.6 : 1,
        position: 'relative',
      }}
    >
      {pack.discount && (
        <span style={{
          position: 'absolute', top: -10, right: -4,
          padding: '2px 8px', borderRadius: R.md,
          background: emphasised ? GOLD : SECOND, color: swatch.white,
          fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.02em',
        }}>
          {pack.discount}
        </span>
      )}
      <Zap size={20} color={emphasised ? GOLD : SECOND} aria-hidden="true" />
      <div style={{ fontSize: FS.xl, fontWeight: 700, color: INK }}>{pack.credits}</div>
      <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('pricing.creditPacks.pack', { credits: pack.credits })}
      </div>
      <div style={{ fontSize: FS.xl, fontWeight: 700, color: emphasised ? GOLD : INK }}>
        {pack.price}
      </div>
      <div style={{ fontSize: FS.xxs, color: MUTED }}>
        {t('pricing.creditPacks.perEach', { price: pack.perCredit })}
      </div>
    </button>
  );
}

export default function PricingPage({ onNavigate }) {
  const isElevated = useStore(s => s.isElevated());
  const authTier   = useStore(s => s.auth.tier);
  const isFounder  = useStore(s => s.auth.isFounder);
  const [loading, setLoading] = useState(null); // product key in flight
  const [checkoutError, setCheckoutError] = useState(null);

  const tiers = getVisibleTiers();
  const packs = Object.values(getActivePacks());

  // P122 / X-10 - Audience-led pricing pitch. The same tier gets a
  // different lead line depending on the current reader's archetype.
  const copy = useCopy();
  const audienceLineFor = (tierKey) => {
    // tier.key in pricing config is one of: wanderer / cartographer / founder
    const prefix = `pricingPitch.${tierKey}.line`;
    return copy.audience(prefix);
  };

  // Tier 7.6: live founder seat counter. Null until the RPC resolves
  // OR on any failure - TierCard falls back to "Limited to 500 seats"
  // when null, so a transient backend hiccup doesn't break the page.
  const [founderSeatsRemaining, setFounderSeatsRemaining] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchFounderSeatsRemaining } = await import('../lib/founderSeats.js');
        const remaining = await fetchFounderSeatsRemaining();
        if (!cancelled) setFounderSeatsRemaining(remaining);
      } catch {
        // Lazy-import or fetch failure - leave null and show the
        // safe fallback copy.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function buy(product) {
    setCheckoutError(null);
    setLoading(product);
    try {
      await startCheckout(product);
    } catch (e) {
      console.error('Checkout failed:', e);
      setCheckoutError(e.message || 'Checkout failed');
      setLoading(null);
    }
  }

  async function manageBilling() {
    setCheckoutError(null);
    setLoading('portal');
    try {
      await startCustomerPortal();
    } catch (e) {
      console.error('Billing portal failed:', e);
      setCheckoutError(e.message || 'Billing portal failed');
      setLoading(null);
    }
  }

  function ctaFor(tier) {
    if (tier.key === 'wanderer') {
      return {
        label: authTier === 'anon' ? t('pricing.tiers.wanderer.cta') : 'Current plan',
        onCta: () => onNavigate?.('generate'),
      };
    }
    if (tier.key === 'founder') {
      return {
        label: isFounder ? 'Founder active' : t('pricing.tiers.founder.cta'),
        onCta: isFounder ? manageBilling : () => buy('founder_lifetime'),
      };
    }
    // Cartographer (premium)
    const currentPaid = authTier === 'premium' || isElevated;
    return {
      label: currentPaid ? 'Manage subscription' : t('pricing.tiers.cartographer.cta'),
      onCta: currentPaid ? manageBilling : () => buy('premium'),
    };
  }

  return (
    <div style={{
      maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.xxl}px ${SP.lg}px`,
      fontFamily: sans, color: INK,
    }}>
      <header style={{ textAlign: 'center', marginBottom: SP.xxl }}>
        <h1 style={{
          margin: 0, fontFamily: serif_, fontSize: FS['36'], fontWeight: 600,
          color: INK, letterSpacing: '0.01em',
        }}>
          {t('pricing.pageTitle')}
        </h1>
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 540,
          fontSize: FS.lg, color: BODY,
          fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.5,
        }}>
          {t('pricing.pageSubtitle')}
        </p>
        {/* ── Anti-AI positioning (Tier 7.13) ─────────────────────────── */}
        <p style={{
          margin: `${SP.md}px auto 0`, maxWidth: 580,
          padding: `${SP.xs}px ${SP.md}px`,
          borderLeft: `2px solid ${GOLD}`,
          fontSize: FS.sm, color: swatch['#5A4A2A'],
          fontFamily: sans, fontStyle: 'italic', lineHeight: 1.55,
          textAlign: 'left',
        }}>
          {t('pricing.antiAi')}
        </p>
        {checkoutError && (
          <div style={{
            margin: `${SP.lg}px auto 0`,
            maxWidth: 560,
            padding: `${SP.sm}px ${SP.md}px`,
            background: swatch.dangerBg,
            border: '1px solid #e8b0b0',
            borderRadius: R.md,
            color: swatch.danger,
            fontFamily: sans,
            fontSize: FS.sm,
          }}>
            {checkoutError}
          </div>
        )}
      </header>

      {/* ── Subscription tiers ──────────────────────────────────────────── */}
      <section
        aria-label="Subscription tiers"
        style={{
          display: 'flex', gap: SP.lg, flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: SP.xxl,
        }}
      >
        {tiers.map(tier => {
          const cta = ctaFor(tier);
          return (
            <TierCard
              key={tier.key}
              tier={tier}
              ctaLabel={cta.label}
              onCta={cta.onCta}
              loading={loading === (tier.key === 'founder' ? 'founder_lifetime' : 'premium')}
              emphasised={tier.key === 'cartographer'}
              founderSeatsRemaining={tier.key === 'founder' ? founderSeatsRemaining : undefined}
              audienceLine={audienceLineFor(tier.key)}
            />
          );
        })}
      </section>

      {/* ── Credit packs ────────────────────────────────────────────────── */}
      <section
        aria-label="Credit packs"
        style={{
          background: PARCH,
          border: `1px solid ${BORDER}`,
          borderRadius: R.xl,
          padding: `${SP.xl}px ${SP.lg}px`,
          marginBottom: SP.xxl,
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: SP.lg }}>
          <h2 style={{
            margin: 0, fontFamily: serif_, fontSize: FS.xxl, color: INK,
          }}>
            {t('pricing.creditPacks.heading')}
          </h2>
          <p style={{
            margin: `${SP.xs}px auto 0`, maxWidth: 500,
            fontSize: FS.sm, color: BODY, lineHeight: 1.5,
          }}>
            {t('pricing.creditPacks.subhead')}
          </p>
        </header>

        <div style={{
          display: 'flex', gap: SP.md, flexWrap: 'wrap',
          maxWidth: 720, margin: '0 auto',
        }}>
          {packs.map(pack => (
            <PackTile
              key={pack.key}
              pack={pack}
              onBuy={() => buy(pack.key)}
              loading={loading === pack.key}
              emphasised={pack.tier === 'best'}
            />
          ))}
        </div>

        {!isConfigured && (
          <p style={{
            margin: `${SP.lg}px 0 0`, textAlign: 'center',
            fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
          }}>
            Payments are not available in local mode. Configure Supabase + Stripe to enable purchases.
          </p>
        )}
      </section>

      {/* ── Single-dossier microtransaction ─────────────────────────────── */}
      {singleDossierEnabled() && (
        <section
          aria-label="Single dossier"
          style={{
            background: `linear-gradient(135deg, ${INK} 0%, ${INK_DEEP} 100%)`,
            color: GOLD, borderRadius: R.xl,
            padding: `${SP.xl}px ${SP.lg}px`, textAlign: 'center',
          }}
        >
          <h2 style={{
            margin: 0, fontFamily: serif_, fontSize: FS.xxl, color: GOLD,
          }}>
            {t('pricing.singleDossier.title')}
          </h2>
          <p style={{
            margin: `${SP.sm}px auto 0`, maxWidth: 500,
            fontSize: FS.sm, color: BORDER, lineHeight: 1.5,
          }}>
            {t('pricing.singleDossier.description')}
          </p>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'center',
            gap: 8, marginTop: SP.md,
          }}>
            <span style={{ fontFamily: serif_, fontSize: FS['32'], fontWeight: 600 }}>
              {SINGLE_DOSSIER.priceLabel}
            </span>
            <span style={{ fontSize: FS.sm, color: BORDER }}>
              one-time
            </span>
          </div>
          <button
            type="button"
            onClick={() => buy(SINGLE_DOSSIER.key)}
            disabled={loading === SINGLE_DOSSIER.key || !isConfigured}
            style={{
              marginTop: SP.lg,
              padding: `${SP.md}px ${SP.xl}px`,
              background: GOLD, color: INK,
              border: 'none', borderRadius: R.lg,
              fontFamily: sans, fontSize: FS.md, fontWeight: 700,
              cursor: 'pointer', opacity: loading === SINGLE_DOSSIER.key ? 0.6 : 1,
            }}
          >
            {loading === SINGLE_DOSSIER.key ? 'Redirecting...' : t('pricing.singleDossier.cta')}
          </button>
        </section>
      )}
    </div>
  );
}
