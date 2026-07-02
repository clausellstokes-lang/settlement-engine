/**
 * PricingPage.jsx — Public pricing page.
 *
 * Reads the catalog from `src/config/pricing.js` and the strings from
 * `src/copy/`. Hard-coding nothing here means a price/copy/tier change
 * is a one-file edit (in pricing.js or en.js), and the page reflects
 * it the next reload.
 *
 * Sections (UI Redesign §13):
 *   1. Three subscription tiers (Wanderer / Cartographer / Founder Lifetime)
 *   2. Credit packs (volume-discount table)
 *
 * The single-dossier ($2.99 one-shot) is deliberately NOT on this
 * subscription-focused page — it lives in-context on a freshly generated
 * dossier (BuyThisDossier).
 *
 * SEO note: this is one of the public surfaces. Eventually the route
 * needs a proper crawlable URL (currently it's a state-driven view).
 * Until the SPA gets split into per-page routes, the canonical link
 * is /?view=pricing — set by the footer + header CTA.
 */

import { useEffect, useState } from 'react';
import { useStore } from '../store/index.js';
import { startCheckout, startCustomerPortal } from '../lib/stripe.js';
import { isConfigured } from '../lib/supabase.js';
import {
  getVisibleTiers, getActivePacks, getTierDisplayName,
} from '../config/pricing.js';
import { t, tx } from '../copy/index.js';
import { useCopy } from '../hooks/useCopy.js';
import { useFlag } from '../lib/flags.js';
import { GOLD, GOLD_TXT, INK, SECOND, BORDER, CARD, PARCH, sans, serif_, SP, R, FS, BODY, swatch, PROSE_MAX, FORM_MAX } from './theme.js';
import { space } from '../design/tokens.js';

// Between-section rhythm: SP tops out at xxl=24, which also appears as
// within-block spacing — so "looser between clusters" reads the same as
// "tight within." Pull the larger steps straight from the 8-pt scale
// (space-7=32 / space-8=48) so the squint test yields distinct chunks
// from spacing alone (P5).
const SECTION_GAP = space['space-8']; // 48 — between major page regions
const HEADER_GAP = space['space-7']; // 32 — header → first region

// P12 — a deliberate inner cap for the three-up tier row so the tiers and the
// credit-packs grid below share ONE column edge under the 1200 page frame
// (the packs grid is capped to PROSE_MAX; an uncapped tier row let the page's
// vertical spine wander). Sized to fit three maxWidth-320 cards + 2×SP.lg(16)
// gaps = 992; the row stays centered, so narrower viewports still wrap+center.
const TIER_ROW_MAX = 3 * 320 + 2 * 16; // 992
import FounderBadge from './primitives/FounderBadge.jsx';
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';

function FeatureRow({ children }) {
  return (
    <li style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '4px 0', color: BODY, fontSize: FS.sm,
      fontFamily: sans, lineHeight: 1.5,
    }}>
      <span>{children}</span>
    </li>
  );
}

function TierCard({ tier, ctaLabel, ctaKind, isPrimaryCta, onCta, loading, emphasised, founderSeatsRemaining, audienceLine, simulationVariant }) {
  // P9 / decision 4 — when the simulation-led A/B variant is on, source the
  // feature list + tagline from pricing.variant.tiers.<key>.*, falling back to
  // the current copy. The variant DELIBERATELY names no size as premium (size
  // is free); the audience pitch line still takes precedence when present.
  const variantFeatures = simulationVariant ? tx(`pricing.variant.tiers.${tier.key}.features`) : null;
  const features = (Array.isArray(variantFeatures) && variantFeatures.length)
    ? variantFeatures
    : (tx(`pricing.tiers.${tier.key}.features`) || []);
  const variantTagline = simulationVariant ? t(`pricing.variant.tiers.${tier.key}.tagline`) : null;
  // Prefer audience-led pitch over generic tagline when the
  // flag is on and a per-audience line is available. Falls back to the
  // simulation-variant tagline, then the legacy tagline.
  const tagline  = audienceLine || variantTagline || t(`pricing.tiers.${tier.key}.tagline`);
  const priceLabel = t(`pricing.tiers.${tier.key}.priceLabel`);
  const priceSub   = t(`pricing.tiers.${tier.key}.priceSub`);
  const name       = getTierDisplayName(tier.legacyKey) || t(`pricing.tiers.${tier.key}.name`);

  // Content-as-hero (P1/P4/P6): the FIRST feature is the "why pay" benefit for
  // this tier (e.g. Cartographer: advance-time / run-the-region). Promote it to
  // a single bold lead line directly under the price; the remaining features
  // become an equal-weight checklist so the card has one content focal point
  // instead of a flat list where the simulation value reads like a storage bullet.
  const [leadFeature, ...restFeatures] = features;

  const headingId = `tier-${tier.key}-name`;
  const recommendedId = `tier-${tier.key}-recommended`;

  return (
    <article
      aria-labelledby={headingId}
      aria-describedby={emphasised ? recommendedId : undefined}
      style={{
        flex: '1 1 240px', minWidth: 240, maxWidth: 320,
        background: CARD,
        // P4 — exactly one focal card. The recommended tier carries the heavy
        // gold border + lift; siblings stay quiet (hairline border, no shadow)
        // so the single highlight survives the squint test instead of three
        // near-identical bordered boxes competing (P5 anti-box-soup).
        border: emphasised ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
        borderRadius: R.xl,
        padding: emphasised
          ? `${SP.lg}px ${SP.lg}px ${SP.xl}px`
          : `${SP.md}px ${SP.lg}px ${SP.lg}px`,
        display: 'flex', flexDirection: 'column', gap: SP.md,
        boxShadow: emphasised
          ? '0 6px 24px rgba(201,162,76,0.25)'
          : 'none',
        position: 'relative',
      }}
    >
      {emphasised && (
        <span
          id={recommendedId}
          style={{
            position: 'absolute', top: -10, right: 16,
            // P7 — the page's most-emphasised label must clear AA. White-on-gold
            // was 2.4:1 (the exact pairing the app already retired in Button +
            // FounderBadge); ink-on-gold is 7.6:1, the house recommended-badge idiom.
            background: GOLD, color: INK,
            fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.06em',
            padding: '3px 9px', borderRadius: 4,
            textTransform: 'uppercase',
          }}
        >
          Most popular
        </span>
      )}

      <header style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        {/* P4 — the name is the card's quiet tier label, not a second focal
            point. Held at FS.lg/BODY so the price stays the unambiguous single
            focus and the card caps at ~3 levels (price > lead benefit >
            everything else). */}
        <h3 id={headingId} style={{
          margin: 0,
          fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: BODY,
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
        {/* P4 — the price is the per-card focal point: it wins on size (FS.32),
            weight (700) and color (INK) over every other element, so nothing
            competes for the single squint-test focus. */}
        <span style={{ fontSize: FS['32'], fontFamily: serif_, fontWeight: 700, color: INK, lineHeight: 1 }}>
          {priceLabel}
        </span>
        <span style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
          {priceSub}
        </span>
      </div>

      {leadFeature && (
        // P4 — the "why pay" lead is level 2 of three. At FS.md it sat 1px above
        // the FS.sm checklist and the two levels blurred together. Lift to FS.lg
        // (held apart from the tier NAME, also FS.lg, by INK+700 vs name's
        // BODY+600) and add a clear gap below so the checklist visibly begins a
        // new cluster — three levels survive the squint: price > lead > list.
        <p style={{
          margin: `${SP.xs}px 0 ${SP.sm}px`,
          fontSize: FS.lg, fontWeight: 700, color: INK,
          fontFamily: sans, lineHeight: 1.4,
        }}>
          {leadFeature}
        </p>
      )}

      {tier.key === 'founder' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* P3/P7 — scarcity is the founder card's live delta. Carry it in two
              channels (count + filled meter), in legible BODY weight-600 rather
              than violet-hue-alone. Live count via the founder_seats_taken RPC
              (migration 010); the fetch may fail or be pending, so fall back to
              the safe "Limited to 500 seats" copy with no meter in those cases. */}
          <p style={{ margin: 0, fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 600 }}>
            {typeof founderSeatsRemaining === 'number'
              ? `${founderSeatsRemaining} of 500 seats remaining.`
              : 'Limited to 500 seats.'}
          </p>
          {typeof founderSeatsRemaining === 'number' && (
            <div
              aria-hidden="true"
              style={{
                height: 4, borderRadius: R.sm, overflow: 'hidden',
                background: BORDER,
              }}
            >
              <div style={{
                height: '100%', borderRadius: R.sm, background: GOLD,
                width: `${Math.min(100, Math.max(0, ((500 - founderSeatsRemaining) / 500) * 100))}%`,
              }} />
            </div>
          )}
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        {restFeatures.map((f, i) => <FeatureRow key={i}>{f}</FeatureRow>)}
      </ul>

      {(() => {
        const notConfigured = !isConfigured && tier.priceCents > 0;
        return (
          <Button
            type="button"
            onClick={onCta}
            disabled={loading || notConfigured}
            // P8 — button emphasis follows the ACTION's importance, not the card's
            // position. Only a real purchase action gets the solid-gold primary
            // (decided by the parent so the region has exactly one). A billing/
            // portal "manage" or a "current plan" self-state drops to secondary,
            // so a low-stakes maintenance action never out-shouts the conversion
            // path on the emphasised card.
            variant={isPrimaryCta && ctaKind === 'purchase' ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
            // ~44px target for the page's highest-value tap (Fitts) — lg is 40px.
            style={{ minHeight: 44 }}
            // The disabled reason rides on opacity alone otherwise; name it.
            title={notConfigured ? 'Payments are not available in local mode.' : undefined}
            aria-disabled={notConfigured || undefined}
          >
            {loading ? 'Redirecting…' : ctaLabel}
          </Button>
        );
      })()}
    </article>
  );
}

function PackTile({ pack, onBuy, loading, emphasised }) {
  return (
    <button
      type="button"
      onClick={onBuy}
      disabled={loading || !isConfigured}
      title={!isConfigured ? 'Payments are not available in local mode.' : undefined}
      // The tile is several stacked divs with no single accessible name; name
      // the affordance for screen readers as "<N credits>, <price>".
      aria-label={`${t('pricing.creditPacks.pack', { credits: pack.credits })}, ${pack.price}`}
      style={{
        flex: '1 1 160px', minWidth: 160,
        padding: `${SP.lg}px ${SP.md}px`,
        // P5 anti-box-soup — ONE elevation channel per tile. The non-emphasised
        // tiles separate from the parchment section tint by the faint shadow
        // ALONE (border + shadow was two channels doing one job, re-creating the
        // bordered spreadsheet grid the section comment claims to have removed);
        // the focal pack carries the single gold border (no shadow) so exactly
        // one tile reads as elevated.
        background: emphasised ? 'rgba(201,162,76,0.06)' : CARD,
        border: emphasised ? `2px solid ${GOLD}` : 'none',
        boxShadow: emphasised ? 'none' : '0 1px 4px rgba(27,20,8,0.06)',
        borderRadius: R.xl,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: sans, opacity: loading ? 0.6 : 1,
        position: 'relative',
      }}
    >
      {/* P3/P4/P6 — three ranked levels, delta-first. The PRICE keeps the
          size-dominant focal level (FS.xxl). The per-credit value + the N%-off
          discount are the WHY-buy-bigger delta — the entire purpose of a
          volume-discount table — so they form a clear secondary level just under
          the price (FS.md + weight, gold-dominant on the focal tile) instead of
          a detached FS.xs corner badge + the page's quietest line. The credit
          quantity recedes to a single supporting label (it was stated twice
          before — the bare number AND the "N credits" label). */}
      <div style={{ fontSize: FS.xxl, fontWeight: 700, color: emphasised ? GOLD_TXT : INK }}>
        {pack.price}
      </div>
      <div style={{ fontSize: FS.md, fontWeight: 700, color: emphasised ? GOLD_TXT : BODY }}>
        {t('pricing.creditPacks.perEach', { price: pack.perCredit })}
      </div>
      {pack.discount && (
        <div style={{
          fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: emphasised ? GOLD_TXT : SECOND,
        }}>
          {pack.discount}
        </div>
      )}
      <div style={{ fontSize: FS.xs, color: BODY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('pricing.creditPacks.pack', { credits: pack.credits })}
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
  // Remember the last attempted checkout action so the error banner can offer a
  // real "try again" path instead of being a terminal dead-end (P10).
  const [lastAttempt, setLastAttempt] = useState(null);

  const tiers = getVisibleTiers();
  const packs = Object.values(getActivePacks());

  // P9 / decision 4 — simulation-led pricing copy A/B. When ON, the page
  // subtitle + tier taglines + feature lists lead with the living simulation
  // (and name NO size as premium); when OFF, the current "unlimited saves /
  // full size" copy stands. The storage/saves line stays a secondary bullet
  // either way.
  const simulationVariant = useFlag('pricingSimulationCopy');
  const pageSubtitle = simulationVariant
    ? t('pricing.variant.pageSubtitle')
    : t('pricing.pageSubtitle');

  // Audience-led pricing pitch. The same tier gets a
  // different lead line depending on the current reader's archetype.
  const copy = useCopy();
  const audienceLineFor = (tierKey) => {
    // P2 coherence — the audience line is OPT-IN, only when there is a genuine
    // audience signal. copy.audience() always returns a non-empty string (it
    // falls back to the "…New" line), so returning it unconditionally made it
    // ALWAYS win in TierCard and silently buried both the simulation-variant
    // tagline and the base tagline as dead code. For the default 'new' reader
    // (incl. every anonymous visitor) return null so those layers can render.
    if (copy.currentAudience === 'new') return null;
    // tier.key in pricing config is one of: wanderer / cartographer / founder
    const prefix = `pricingPitch.${tierKey}.line`;
    return copy.audience(prefix);
  };

  // Live founder seat counter. Null until the RPC resolves
  // OR on any failure — TierCard falls back to "Limited to 500 seats"
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
        // Lazy-import or fetch failure — leave null and show the
        // safe fallback copy.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function buy(product) {
    setCheckoutError(null);
    setLastAttempt({ kind: 'buy', product });
    setLoading(product);
    try {
      await startCheckout(product);
    } catch (e) {
      // P11 — keep the raw Stripe/network text out of the UI (console only);
      // surface a domain-language message the reader can act on (P10).
      console.error('Checkout failed:', e);
      setCheckoutError(t('purchase.failureMessage'));
      setLoading(null);
    }
  }

  async function manageBilling() {
    setCheckoutError(null);
    setLastAttempt({ kind: 'portal' });
    setLoading('portal');
    try {
      await startCustomerPortal();
    } catch (e) {
      console.error('Billing portal failed:', e);
      setCheckoutError(t('purchase.failureMessage'));
      setLoading(null);
    }
  }

  // Re-run the last attempted checkout action from the error banner's retry CTA.
  function retryLastAttempt() {
    if (!lastAttempt) return;
    if (lastAttempt.kind === 'portal') manageBilling();
    else buy(lastAttempt.product);
  }

  // ctaFor() also returns the task `kind` so the Button emphasis can be derived
  // structurally (P8): only a 'purchase' kind may render as the loud primary; a
  // billing 'manage' action or a 'current'/self-state stays secondary.
  function ctaFor(tier) {
    if (tier.key === 'wanderer') {
      // 'Current plan' only for the actual free-tier user — a paying/founder/
      // elevated user is NOT on Wanderer, so they get the normal CTA.
      const onWanderer = authTier === 'free' && !isElevated && !isFounder;
      // The Wanderer CTA only ever NAVIGATES (to the generator) — it is never a
      // Stripe checkout. Labelling it kind:'purchase' let the primary-selection
      // fallback (below) pick the free tier as the page's single loud primary
      // for a paying user, burying the intended Founder upgrade. 'current' when
      // this reader is actually on the free tier; otherwise 'navigate' — neither
      // of which the fallback's kind==='purchase' filter nor the primary Button
      // variant will treat as the loud conversion action.
      return {
        label: onWanderer ? 'Current plan' : t('pricing.tiers.wanderer.cta'),
        onCta: () => onNavigate?.('generate'),
        kind: onWanderer ? 'current' : 'navigate',
      };
    }
    if (tier.key === 'founder') {
      return {
        label: isFounder ? 'Founder active' : t('pricing.tiers.founder.cta'),
        onCta: isFounder ? manageBilling : () => buy('founder_lifetime'),
        kind: isFounder ? 'manage' : 'purchase',
      };
    }
    // Cartographer (premium)
    const currentPaid = authTier === 'premium' || isElevated;
    return {
      label: currentPaid ? 'Manage subscription' : t('pricing.tiers.cartographer.cta'),
      onCta: currentPaid ? manageBilling : () => buy('premium'),
      kind: currentPaid ? 'manage' : 'purchase',
    };
  }

  return (
    <Page style={{ fontFamily: sans, color: INK }}>
      <PageHeader
        eyebrow={t('pricing.eyebrow')}
        title={t('pricing.pageTitle')}
        subtitle={pageSubtitle}
      />

      {/* ── Anti-AI positioning ──────────────────────────────────────── */}
      {/* P1/P12 — the "simulates, not generates" claim is the page's core
          credibility line, not small print. Re-homed from inside the old
          centered header into its own block under PageHeader, left-aligned
          with the single gold left-border idiom intact. The line is body
          prose, so it carries the BODY token (not a muted aside). */}
      <p style={{
        margin: `0 0 ${HEADER_GAP}px`, maxWidth: PROSE_MAX,
        padding: `${SP.xs}px ${SP.md}px`,
        borderLeft: `2px solid ${GOLD}`,
        fontSize: FS.md, color: BODY,
        fontFamily: sans, fontStyle: 'italic', lineHeight: 1.55,
      }}>
        {t('pricing.antiAi')}
      </p>

      {checkoutError && (
        <div
          role="alert"
          style={{
            margin: `0 auto ${HEADER_GAP}px`,
            maxWidth: FORM_MAX,
            padding: `${SP.sm}px ${SP.md}px`,
            background: swatch.dangerBg,
            border: '1px solid #e8b0b0',
            borderRadius: R.md,
            color: swatch.danger,
            fontFamily: sans,
            fontSize: FS.sm,
            display: 'flex', flexDirection: 'column', gap: SP.sm,
            alignItems: 'center',
          }}
        >
          <span>{checkoutError}</span>
          {lastAttempt && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={retryLastAttempt}
              disabled={!!loading}
            >
              Try again
            </Button>
          )}
        </div>
      )}

      {/* ── Subscription tiers ──────────────────────────────────────────── */}
      <section
        aria-labelledby="pricing-tiers-heading"
        style={{
          display: 'flex', gap: SP.lg, flexWrap: 'wrap', justifyContent: 'center',
          maxWidth: TIER_ROW_MAX, margin: '0 auto',
          marginBottom: SECTION_GAP,
        }}
      >
        {/* The tier row carries no visible title by design, but the document
            outline needs a real section heading between the page h1 and the
            tier-card h3s so the level is never skipped (WCAG 1.3.1) and the
            Credit Packs h2 below reads as a sibling section, not a deeper one. */}
        <h2 id="pricing-tiers-heading" className="sr-only">
          {t('pricing.tiers.heading')}
        </h2>
        {(() => {
          const ctas = tiers.map(tier => ({ tier, cta: ctaFor(tier) }));
          // P8 — the region carries EXACTLY ONE dominant primary, chosen for the
          // most important purchasable action (never a manage/current self-state,
          // never picked by card position alone). Prefer the emphasised
          // Cartographer card when it is still purchasable; otherwise fall back to
          // the highest-value remaining purchase card (e.g. for an already-premium
          // user, the Founder upgrade) so the region never ends up all-secondary
          // with no obvious first click.
          const primaryKey = (() => {
            const emphasisedEntry = ctas.find(({ tier }) => tier.key === 'cartographer');
            if (emphasisedEntry && emphasisedEntry.cta.kind === 'purchase') {
              return emphasisedEntry.tier.key;
            }
            const fallback = ctas.find(({ cta }) => cta.kind === 'purchase');
            return fallback ? fallback.tier.key : null;
          })();

          return ctas.map(({ tier, cta }) => (
            <TierCard
              key={tier.key}
              tier={tier}
              ctaLabel={cta.label}
              ctaKind={cta.kind}
              isPrimaryCta={tier.key === primaryKey}
              onCta={cta.onCta}
              // Wanderer has no in-flight checkout product (its CTA only
              // navigates), so map it to a sentinel that buy()/manageBilling()
              // never pass to setLoading. Mapping to null instead matched the
              // page's initial loading===null at rest, which left the free
              // tier's button permanently disabled showing 'Redirecting…'.
              loading={loading === (tier.key === 'founder' ? 'founder_lifetime' : tier.key === 'cartographer' ? 'premium' : 'wanderer')}
              emphasised={tier.key === 'cartographer'}
              founderSeatsRemaining={tier.key === 'founder' ? founderSeatsRemaining : undefined}
              audienceLine={audienceLineFor(tier.key)}
              simulationVariant={simulationVariant}
            />
          ));
        })()}
      </section>

      {/* ── Credit packs ────────────────────────────────────────────────── */}
      {/* P5 — the section is grouped by its parchment tint + the larger top gap
          (SECTION_GAP) alone, NOT by a border. The earlier 1px section border sat
          around tinted tiles on a page of bordered tier cards = three concentric
          parchment-family box levels; differential spacing carries the grouping
          without the third fence. */}
      <section
        aria-label="Credit packs"
        style={{
          background: PARCH,
          borderRadius: R.xl,
          padding: `${SP.xl}px ${SP.lg}px`,
          marginBottom: SECTION_GAP,
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: SP.lg }}>
          {/* First-contact gloss: a new DM reads prices for an abstract token
              with no sense of what it buys. The native title= names the
              affordance from the copy registry's own fact (one credit refines a
              settlement into prose), no new marketing wording. */}
          <h2
            title="A credit refines one settlement's data into prose. The structural simulation stays free."
            style={{
              margin: 0, fontFamily: serif_, fontSize: FS.xxl, color: INK,
            }}
          >
            {t('pricing.creditPacks.heading')}
          </h2>
          <p style={{
            margin: `${SP.xs}px auto 0`, maxWidth: PROSE_MAX,
            fontSize: FS.sm, color: BODY, lineHeight: 1.5,
          }}>
            {t('pricing.creditPacks.subhead')}
          </p>
        </header>

        <div style={{
          display: 'flex', gap: SP.md, flexWrap: 'wrap', justifyContent: 'center',
          maxWidth: PROSE_MAX, margin: '0 auto',
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
            fontSize: FS.xs, color: BODY, fontStyle: 'italic',
          }}>
            Payments are not available in local mode. Configure Supabase + Stripe to enable purchases.
          </p>
        )}
      </section>

      {/* P9 — the page-end onward path was a SECOND copy of the Wanderer tier's
          exact CTA (same label + same onNavigate('generate')), so the page
          closed on a duplicate of a control already visible above rather than a
          distinct next step. Removed: the Wanderer card already offers the
          "Begin a settlement" generate path as its own primary, so the footer
          repeat only added an ambiguous twin. The single-dossier ($2.99
          one-shot) stays intentionally absent — it's the in-context one-shot on
          a freshly generated dossier (BuyThisDossier), not a pricing-page CTA. */}
    </Page>
  );
}
