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
import { purchasesOpen } from '../../lib/launchGate.js';
import { t, tierPriceSlot, tx } from '../../copy/index.js';
import {
  GOLD, GOLD_DEEP, GOLD_SOFT, INK, SECOND, BORDER, BORDER_STRONG, CARD, sans, serif_, SP, FS, BODY,
} from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';
import FounderBadge from '../primitives/FounderBadge.jsx';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill, { AVAILABLE_AT_LAUNCH } from '../primitives/AvailableAtLaunchPill.jsx';

/**
 * ⭐ THE FEATURE MARK IS A CHECK, AND IT NOW LOOKS LIKE ONE (ODQ §934.63 noticed 4).
 *
 * It was `†`. The estate's own instrument already called the glyph what it is —
 * tests/design/contrast.test.js names this site "PricingPage decorative gold marks
 * (FeatureRow CHECK)" — and the review found the consequence: a dagger is the reader's
 * FOOTNOTE mark, it stood before every Wanderer and Cartographer line on /pricing, and
 * the page carries no footnote anywhere. A mark that promises a target it does not have
 * is a small dishonesty on the page that asks for money, which is why the fix is the
 * glyph and not a footnote invented to justify it.
 *
 * ⚠ WHAT STILL DIVERGES, SAID PLAINLY. `components/organic/samples/PricingSample.jsx`
 * (the taste-approved pricing-desk sample this row was cut from) still draws `†`. A
 * sample is the RECORD of what was approved, and re-cutting it is a taste decision this
 * lane does not own; the chair carries it. Everything else is unchanged: the mark stays
 * decorative and aria-hidden, so the feature TEXT still carries the whole meaning and the
 * mark still owes no contrast floor.
 */
const FEATURE_MARK = '✓';

function FeatureRow({ children }) {
  const mobile = useIsMobile();
  return (
    <li style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '4px 0', color: BODY, fontSize: proseFontSize(FS.sm, mobile),
      fontFamily: sans, lineHeight: 1.5,
    }}>
      <span aria-hidden="true" style={{ color: 'var(--oc-rubric)', fontWeight: 700, flexShrink: 0 }}>{FEATURE_MARK}</span>
      <span>{children}</span>
    </li>
  );
}

/**
 * `ctaDisabled` (LD-6 item 2, the hydration gate): a caller-supplied hard block
 * on the CTA that is NOT an in-flight checkout. It exists because `loading`
 * swaps the label to "Redirecting…", which would be a lie while the auth store
 * is merely hydrating — the button must stay disabled UNDER ITS OWN LABEL.
 * Defaults false, so every existing caller is byte-identical in behaviour.
 */
export function TierCard({ tier, ctaLabel, ctaKind, isPrimaryCta, onCta, loading, ctaDisabled = false, emphasised, founderSeatsRemaining, audienceLine, simulationVariant }) {
  const mobile = useIsMobile();
  const purchasesAreOpen = purchasesOpen();
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
  // The focal slot through the ONE resolver (copy/index.js): a tier that carries no
  // price carries its STANDING and the standing's own sub-line. Reading the two price
  // keys with `t()` here printed the Founder's dotted key paths wherever this card drew
  // that tier — the anon teaser does, on /create (ODQ §934.22 item 1). Under the purchase
  // lock the Founder's slot is the owner's approved words (§934.24(3)); what every tier
  // slot says while purchases are locked is ruled in
  // tests/components/lockedPriceSlots.census.test.js.
  const { label: priceLabel, sub: priceSub } = tierPriceSlot(tier.key);
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
        // THE DIFFERENTIATED BENCH (organic-craft law §3 + the pricing-desk
        // sample): the tiers are ruled columns on the page ground, NOT three
        // uniform rounded shadow-cards (the AI-slop tell). The recommended tier
        // wins on a heavier GOLD TOP RULE + more ink/scale + the flag — one
        // focal channel that survives the squint test, never a shadow or a wash.
        borderTop: emphasised ? `3px solid ${GOLD}` : `2px solid ${BORDER}`,
        padding: emphasised
          ? `${SP.lg}px ${SP.lg}px ${SP.xl}px`
          : `${SP.md}px ${SP.lg}px ${SP.lg}px`,
        display: 'flex', flexDirection: 'column', gap: SP.md,
      }}
    >
      {emphasised && (
        <span
          id={recommendedId}
          style={{
            alignSelf: 'flex-start',
            // The recommended flag as a small gold STAMP at the head of the
            // column (a rationed, meaningful mark — law §3), square-cut, in
            // flow beneath the gold rule, not a rounded corner pill. Ink-on-gold
            // is the house AA pairing (7.6:1; white-on-gold 2.4:1 was retired).
            background: GOLD, color: INK,
            fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, letterSpacing: '0.06em',
            padding: '3px 9px',
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
        margin: 0, fontSize: proseFontSize(FS.sm, mobile), color: BODY,
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
        {priceSub && (
          <span style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
            {priceSub}
          </span>
        )}
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
          <p style={{ margin: 0, fontSize: proseFontSize(FS.xs, mobile), color: BODY, fontFamily: sans, fontWeight: 600 }}>
            {typeof founderSeatsRemaining === 'number'
              ? `${founderSeatsRemaining} of ${FOUNDER_SEAT_CAP} seats remaining.`
              : `Limited to ${FOUNDER_SEAT_CAP} seats.`}
          </p>
          {typeof founderSeatsRemaining === 'number' && (
            <div
              aria-hidden="true"
              style={{
                height: 4, overflow: 'hidden',
                background: BORDER,
              }}
            >
              <div style={{
                height: '100%', background: GOLD,
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
        // THE LAUNCH GATE (lib/launchGate.js), narrowed to the CHECKOUT action the
        // same way the hydration gate is: only a 'purchase' CTA (Cartographer's
        // Subscribe) is closed until launch. 'manage' opens the billing portal, and
        // 'current'/'navigate' take no money, so they stay live and wear no pill.
        const launchLocked = !purchasesAreOpen && ctaKind === 'purchase';
        return (
          <Button
            type="button"
            onClick={onCta}
            disabled={launchLocked || loading || notConfigured || ctaDisabled}
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
            // While launch-locked the pill may wrap below the label on a narrow card.
            style={{ minHeight: 44, ...(launchLocked ? { flexWrap: 'wrap' } : null) }}
            // The disabled reason: the native title= gloss died with the move
            // (the source ratchet); the page's local-mode note names it visibly.
            aria-disabled={notConfigured || undefined}
          >
            {loading ? 'Redirecting…' : ctaLabel}
            {/* The opaque soft-gold ground keeps the pill's gold ink legible when it
                sits on the solid gold primary fill (GOLD_TXT on GOLD_SOFT, the gold
                Button variant's pair); the translucent tint alone reads ~3:1 there. */}
            {launchLocked && <AvailableAtLaunchPill style={{ marginLeft: 6, background: GOLD_SOFT }} />}
          </Button>
        );
      })()}
    </article>
  );
}

export function PackTile({ pack, onBuy, loading, emphasised }) {
  const mobile = useIsMobile();
  const purchasesAreOpen = purchasesOpen();
  const packName = `${t('pricing.creditPacks.pack', { credits: pack.credits })}, ${pack.price}`;
  return (
    // The Button primitive (jsx-hygiene rule — the extraction converted the
    // page's one tracked raw <button>): focus-ring/disabled/target-size come
    // from the primitive; the tile's whole look rides the style override. The
    // native title= gloss died with the move (the source ratchet); the
    // section's local-mode note carries the not-configured explanation.
    <Button
      type="button"
      onClick={onBuy}
      disabled={!purchasesAreOpen || loading || !isConfigured}
      // The tile is several stacked divs with no single accessible name; name
      // the affordance for screen readers as "<N credits>, <price>". While
      // purchases are closed the name also carries the launch pill's words, which
      // the aria-label would otherwise hide from a screen reader.
      aria-label={purchasesAreOpen ? packName : `${packName}, ${AVAILABLE_AT_LAUNCH}`}
      style={{
        flex: '1 1 160px', minWidth: 160,
        padding: `${SP.lg}px ${SP.md}px`,
        // Plates in hairline frames (law §3): each pack is a square-cut plate on
        // the parchment card ground — the focal pack carries the single gold
        // rule, the rest a perceivable hairline (BORDER_STRONG ≥3:1). One ink
        // channel, no shadow, no rounded-card tell, no off-palette wash.
        background: CARD,
        border: emphasised ? `2px solid ${GOLD}` : `1px solid ${BORDER_STRONG}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: loading ? 'wait' : (purchasesAreOpen ? 'pointer' : 'not-allowed'),
        fontFamily: sans, opacity: loading ? 0.6 : 1,
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
          fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: emphasised ? GOLD_DEEP : SECOND,
        }}>
          {pack.discount}
        </div>
      )}
      <div style={{ fontSize: chromeFontSize(FS.xs, mobile), color: BODY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('pricing.creditPacks.pack', { credits: pack.credits })}
      </div>
      {/* The launch pill wraps inside a narrow tile instead of overflowing it. */}
      {!purchasesAreOpen && <AvailableAtLaunchPill style={{ whiteSpace: 'normal', textAlign: 'center' }} />}
    </Button>
  );
}
