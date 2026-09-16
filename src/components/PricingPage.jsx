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
import { getPendingRedeemCode, setPendingRedeemCode, clearPendingRedeemCode } from '../lib/referralRedeem.js';
import { useReferralIntent } from '../hooks/useReferralIntent.js';
import useLivePricing from '../hooks/useLivePricing.js';
import {
  getVisibleTiers, getActivePacks, SINGLE_DOSSIER, TIERS,
} from '../config/pricing.js';
import { tp } from '../copy/pricingPage.js';
import { t } from '../copy/index.js';
import { useCopy } from '../hooks/useCopy.js';
import { useFlag } from '../lib/flags.js';
import { GOLD, INK, PARCH, sans, serif_, SP, FS, BODY, PROSE_MAX, FORM_MAX } from './theme.js';
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
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import RedeemCodeField from './purchase/RedeemCodeField.jsx';
import ReferralIntentField from './purchase/ReferralIntentField.jsx';
import { TierCard, PackTile } from './pricing/PricingTierCards.jsx';
import {
  SurveyorBand, FounderCharterBand, TaskMenu, ComparisonTable, PricingFaq,
} from './pricing/PricingBands.jsx';
import { ClerkNote } from './generate/ClerkNote.jsx';



export default function PricingPage({ onNavigate }) {
  const isElevated = useStore(s => s.isElevated());
  const authTier   = useStore(s => s.auth.tier);
  const isFounder  = useStore(s => s.auth.isFounder);
  const [loading, setLoading] = useState(null); // product key in flight
  const [checkoutError, setCheckoutError] = useState(null);
  // Remember the last attempted checkout action so the error banner can offer a
  // real "try again" path instead of being a terminal dead-end (P10).
  const [lastAttempt, setLastAttempt] = useState(null);
  // Redeem code (107): seeded from the Account-page handoff, editable inline.
  // Advisory input only — create-checkout re-validates and reserves it.
  const [redeemCode, setRedeemCode]     = useState(() => getPendingRedeemCode());
  const [redeemNotice, setRedeemNotice] = useState(null);
  // Referral intent (107): self-gates to signed-in, unpaid, never-referred.
  const referral = useReferralIntent();
  const livePricing = useLivePricing();

  // Keep the cross-surface stash in sync with the field so the code survives
  // leaving for the credit-pack modal (and vice versa).
  const handleRedeemChange = (v) => {
    setRedeemCode(v);
    if (v.trim()) setPendingRedeemCode(v.trim());
    else clearPendingRedeemCode();
  };

  const tiers = getVisibleTiers();
  const packs = Object.values(getActivePacks());

  // P8 (W-DOC): ONE dominant primary across band 2 + the charter band. The
  // emphasised Cartographer wins while purchasable; an already-premium reader's
  // primary falls through to the Founder upgrade on the charter band.
  const pricingPrimaryKey = (() => {
    if (ctaFor(TIERS.cartographer).kind === 'purchase') return 'cartographer';
    if (ctaFor(TIERS.founder).kind === 'purchase') return 'founder';
    return null;
  })();

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
  // OR on any failure — TierCard falls back to "Limited to N seats"
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
      // Referral intent rides AHEAD of checkout so the pending row exists
      // before the first payment lands. recordIntent never throws and a
      // rejection surfaces as a note — it must never block the purchase.
      await referral.recordIntent();
      const { redeemNotice: notice } = await startCheckout(product, { redeemCode });
      // The code is consumed (reserved or declined server-side) — drop the
      // stash so it cannot resurface on a later, unrelated purchase.
      clearPendingRedeemCode();
      if (notice) setRedeemNotice(notice);
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
        margin: `0 0 ${SP.md}px`, maxWidth: PROSE_MAX,
        padding: `${SP.xs}px ${SP.md}px`,
        borderLeft: `2px solid ${GOLD}`,
        fontSize: FS.md, color: BODY,
        fontFamily: sans, fontStyle: 'italic', lineHeight: 1.55,
      }}>
        {t('pricing.antiAi')}
      </p>

      {/* Band 1 (brief §3) — the no-hidden-fees sentence (the Stripe pattern):
          one plain declarative line, document register, no box. */}
      <p style={{
        margin: `0 0 ${HEADER_GAP}px`, maxWidth: PROSE_MAX,
        fontSize: FS.sm, color: BODY, fontFamily: sans, lineHeight: 1.55,
      }}>
        {tp('band1.noHiddenFees')}
      </p>

      {checkoutError && (
        // The tinted danger callout becomes a rubric-headed clerk's note (the
        // C1c idiom): the apparatus speaks the failure in one oxblood rubric
        // voice on a drawn left rule — no wash, no radius. Text + retry action
        // + alert semantics unchanged.
        <ClerkNote
          rubric="Checkout"
          role="alert"
          style={{ margin: `0 auto ${HEADER_GAP}px`, maxWidth: FORM_MAX }}
          actions={lastAttempt && (
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
        >
          {checkoutError}
        </ClerkNote>
      )}

      {/* ── Checkout riders (107): redeem code + referral intent ────────── */}
      {/* A quiet strip above the tiers: both are optional inputs that attach
          to whichever purchase follows, so they must be set BEFORE a tier or
          pack CTA is clicked. Neither ever blocks checkout. */}
      {isConfigured && (
        <div style={{
          margin: `0 auto ${HEADER_GAP}px`, maxWidth: FORM_MAX,
          display: 'flex', flexDirection: 'column', gap: SP.md,
        }}>
          <RedeemCodeField code={redeemCode} onChange={handleRedeemChange} idPrefix="pricing" />
          {redeemNotice && (
            <div role="status" style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5, fontFamily: sans }}>
              {redeemNotice}
            </div>
          )}
          <ReferralIntentField referral={referral} idPrefix="pricing" />
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
          // W-DOC (brief §3 band 2): the subscription row is the THREE-way scan
          // Free / Cartographer / Surveyor — the Founder leaves the row and
          // renders below as the charter band (a different KIND of object), so
          // the subscription decision stays a three-way scan (ruling #3).
          const rowTiers = tiers.filter(tier => tier.key !== 'founder');
          const ctas = rowTiers.map(tier => ({ tier, cta: ctaFor(tier) }));
          // P8 — the region carries EXACTLY ONE dominant primary, chosen for the
          // most important purchasable action (never a manage/current self-state,
          // never picked by card position alone). Prefer the emphasised
          // Cartographer card when it is still purchasable; otherwise fall back
          // (the charter band below handles the already-premium Founder case via
          // pricingPrimaryKey).
          return ctas.map(({ tier, cta }) => (
            <TierCard
              key={tier.key}
              tier={tier}
              ctaLabel={cta.label}
              ctaKind={cta.kind}
              isPrimaryCta={tier.key === pricingPrimaryKey}
              onCta={cta.onCta}
              // Wanderer has no in-flight checkout product (its CTA only
              // navigates), so map it to a sentinel that buy()/manageBilling()
              // never pass to setLoading. Mapping to null instead matched the
              // page's initial loading===null at rest, which left the free
              // tier's button permanently disabled showing 'Redirecting…'.
              loading={loading === (tier.key === 'cartographer' ? 'premium' : 'wanderer')}
              emphasised={tier.key === 'cartographer'}
              audienceLine={audienceLineFor(tier.key)}
              simulationVariant={simulationVariant}
            />
          ));
        })()}
        {/* The Surveyor band — walled violet, AT LAST (ruling #3): the AI lane
            is task-priced + BYOK, never a lookalike subscription. */}
        <SurveyorBand onSeeMenu={() => {
          const el = typeof document !== 'undefined' && document.getElementById('task-menu');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }} />
      </section>

      {/* Cartographer framed as SERVICE, not unlock (brief §3 / the Forge
          precedent): the recurring fee maps to a recurring service, said once. */}
      <p style={{
        margin: `0 auto ${SECTION_GAP}px`, maxWidth: PROSE_MAX,
        padding: `${SP.xs}px ${SP.md}px`, borderLeft: `2px solid ${GOLD}`,
        fontSize: FS.sm, color: BODY, fontFamily: sans, lineHeight: 1.6,
      }}>
        {tp('band2.serviceLine')}
      </p>

      {/* THE FOUNDER CHARTER (brief §3 band 2): live meter + the arithmetic and
          sustainability sentences, all config-derived. */}
      <FounderCharterBand
        founderSeatsRemaining={founderSeatsRemaining}
        cta={ctaFor(TIERS.founder)}
        isPrimaryCta={pricingPrimaryKey === 'founder'}
        loading={loading === 'founder_lifetime'}
      />

      {/* The Founder tier's proof surface: THE FOUNDERS' HALL. A quiet link so a
          visitor can see who is already seated — the Hall is the proof.
          LABEL ONLY. The Founder CARD above still carries the purchase copy of the
          superseded design; abolishing that path (DESIGN_FOUNDERS_HALL §1/§5) is a
          paid-surface change gated on the build-time never-sold verification
          against the seat ledger and purchase history, and is NOT this lane's to
          make. Renaming the destination is not the same act as removing the door,
          and the two must not ride in one commit. */}
      <div style={{ textAlign: 'center', marginTop: `-${SP.md}px`, marginBottom: SECTION_GAP }}>
        <Button variant="ghost" size="sm" onClick={() => onNavigate?.('founders')}>
          Visit the Founders&rsquo; Hall &rarr;
        </Button>
      </div>

      {/* ── Credit packs ────────────────────────────────────────────────── */}
      {/* P5 — the section is grouped by its parchment tint + the larger top gap
          (SECTION_GAP) alone, NOT by a border. The earlier 1px section border sat
          around tinted tiles on a page of bordered tier cards = three concentric
          parchment-family box levels; differential spacing carries the grouping
          without the third fence. */}
      {/* ── Band 3 (brief §3): the ONE-TIME LANE — led by the $2.99 bundle (the
          a-la-carte pattern this market mourned), then packs, then THE TASK
          MENU. One clearly-labeled lane: "no subscription required". */}
      <section
        aria-labelledby="one-time-heading"
        style={{
          background: PARCH,
          padding: `${SP.xl}px ${SP.lg}px`,
          marginBottom: SECTION_GAP,
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: SP.lg }}>
          <h2 id="one-time-heading" style={{ margin: 0, fontFamily: serif_, fontSize: FS.xxl, color: INK }}>
            {tp('band3.heading')}
          </h2>
        </header>

        {/* The bundle LEADS. Informational-with-a-path: the buy itself lives on
            a forged settlement's dossier (the in-context purchase), so the CTA
            routes to the forge instead of a contextless checkout. */}
        <div style={{ maxWidth: PROSE_MAX, margin: `0 auto ${SP.xl}px`, textAlign: 'center' }}>
          <h3 style={{ margin: `0 0 ${SP.xs}px`, fontFamily: serif_, fontSize: FS.xl, color: INK }}>
            {tp('band3.bundle.name')}
          </h3>
          <p style={{ margin: `0 0 ${SP.xs}px`, fontSize: FS.lg, fontWeight: 700, color: INK, fontFamily: sans, lineHeight: 1.5 }}>
            {tp('band3.bundle.lead', { price: SINGLE_DOSSIER.priceLabel })}
          </p>
          <p style={{ margin: `0 0 ${SP.xs}px`, fontSize: FS.sm, color: BODY, lineHeight: 1.55 }}>
            {tp('band3.bundle.body')}
          </p>
          <p style={{ margin: `0 0 ${SP.md}px`, fontSize: FS.sm, color: BODY, lineHeight: 1.55 }}>
            {tp('band3.bundle.where')}
          </p>
          <Button variant="secondary" size="lg" style={{ minHeight: 44 }} onClick={() => onNavigate?.('generate')}>
            {tp('band3.bundle.cta')}
          </Button>
        </div>

        <header style={{ textAlign: 'center', marginBottom: SP.lg }}>
          <h3 style={{ margin: 0, fontFamily: serif_, fontSize: FS.xl, color: INK }}>
            {tp('band3.packs.heading')}
          </h3>
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
        {/* Expiry honesty, in the same visual block as the prices (never a
            help-article footnote): no expiry machinery exists — say so. */}
        <p style={{ margin: `${SP.md}px 0 0`, textAlign: 'center', fontSize: FS.sm, color: BODY, fontWeight: 600 }}>
          {tp('band3.packs.note')}
        </p>

        <TaskMenu livePricing={livePricing} />

        {!isConfigured && (
          <p style={{
            margin: `${SP.lg}px 0 0`, textAlign: 'center',
            fontSize: FS.xs, color: BODY, fontStyle: 'italic',
          }}>
            Payments are not available in local mode. Configure Supabase + Stripe to enable purchases.
          </p>
        )}
      </section>

      {/* ── Band 4: the comparison table (THE ENTITLEMENT LADDER, ruled
          2026-07-17, rendered from config). ── */}
      <ComparisonTable />

      {/* ── Band 5: the objection-first FAQ. ── */}
      <PricingFaq />

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
