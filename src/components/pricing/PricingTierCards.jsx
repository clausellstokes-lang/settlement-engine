/**
 * pricing/PricingTierCards.jsx — the pricing page's card components (TierCard +
 * PackTile + the private FeatureRow), split out of PricingPage.jsx for the
 * 600-line ceiling during the W-DOC five-band rework. Statically imported by
 * the lazy PricingPage chunk — same chunk, zero eager. All P-annotations
 * (P4/P7/P8 emphasis + a11y decisions) carried verbatim.
 */

import { getTierDisplayName } from '../../config/pricing.js';
import { FOUNDER_SEAT_CAP } from '../../lib/founderSeats.js';
import { isConfigured } from '../../lib/supabase.js';
import { t, tx } from '../../copy/index.js';
import {
  GOLD, GOLD_DEEP, INK, SECOND, BORDER, CARD, sans, serif_, SP, R, FS, BODY,
} from '../theme.js';
import FounderBadge from '../primitives/FounderBadge.jsx';
import Button from '../primitives/Button.jsx';

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

export function TierCard({ tier, ctaLabel, ctaKind, isPrimaryCta, onCta, loading, emphasised, founderSeatsRemaining, audienceLine, simulationVariant }) {
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
              the safe "Limited to N seats" copy with no meter in those cases. */}
          <p style={{ margin: 0, fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 600 }}>
            {typeof founderSeatsRemaining === 'number'
              ? `${founderSeatsRemaining} of ${FOUNDER_SEAT_CAP} seats remaining.`
              : `Limited to ${FOUNDER_SEAT_CAP} seats.`}
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
                width: `${Math.min(100, Math.max(0, ((FOUNDER_SEAT_CAP - founderSeatsRemaining) / FOUNDER_SEAT_CAP) * 100))}%`,
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
            // The disabled reason: the native title= gloss died with the move
            // (the source ratchet); the page's local-mode note names it visibly.
            aria-disabled={notConfigured || undefined}
          >
            {loading ? 'Redirecting…' : ctaLabel}
          </Button>
        );
      })()}
    </article>
  );
}

export function PackTile({ pack, onBuy, loading, emphasised }) {
  return (
    // The Button primitive (jsx-hygiene rule — the extraction converted the
    // page's one tracked raw <button>): focus-ring/disabled/target-size come
    // from the primitive; the tile's whole look rides the style override. The
    // native title= gloss died with the move (the source ratchet); the
    // section's local-mode note carries the not-configured explanation.
    <Button
      type="button"
      onClick={onBuy}
      disabled={loading || !isConfigured}
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
      <div style={{ fontSize: FS.xxl, fontWeight: 700, color: emphasised ? GOLD_DEEP : INK }}>
        {pack.price}
      </div>
      <div style={{ fontSize: FS.md, fontWeight: 700, color: emphasised ? GOLD_DEEP : BODY }}>
        {t('pricing.creditPacks.perEach', { price: pack.perCredit })}
      </div>
      {pack.discount && (
        <div style={{
          fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: emphasised ? GOLD_DEEP : SECOND,
        }}>
          {pack.discount}
        </div>
      )}
      <div style={{ fontSize: FS.xs, color: BODY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('pricing.creditPacks.pack', { credits: pack.credits })}
      </div>
    </Button>
  );
}
