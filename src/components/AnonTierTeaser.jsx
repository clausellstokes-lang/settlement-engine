/**
 * AnonTierTeaser.jsx — Inline subscription telegraphing for the anon cap.
 *
 * Shown beneath the "Sign in to unlock" card on the Create page once an
 * anonymous visitor exhausts their daily generations. It surfaces the PUBLIC
 * subscription tiers (NOT the AI-credit packs) so a capped visitor sees what
 * an account unlocks before they leave. Anonymous visitors can't check out
 * directly, so every card routes to sign-in.
 *
 * ⛔ THE FOUNDER IS NOT AMONG THEM (the owner, 2026-09-19: "an invitation-only tier does
 * not appear on the public path"). This teaser used to walk `getVisibleTiers()` WHOLE,
 * so an anonymous visitor at their daily cap was shown a Founder Lifetime card — a tier
 * with no price, no checkout and no path from this page, offered at the one reader who
 * has least standing to ask for it. It now reads `getPublicTiers()`, which filters on
 * the TIER'S OWN `invitationOnly` flag rather than on the spelling 'founder', so the rule
 * holds for a fourth tier of the same kind. The Founders' Hall, the pricing page's
 * charter band and a founder's own account state are untouched — those are where the
 * owner invites, not listings of an offer.
 *
 * Reuses the pricing tier data + copy (getPublicTiers / pricing.tiers.*),
 * presented compactly for the hero rather than the full pricing-page layout.
 * Colors come from theme tokens (no raw hex) so visual-budget lint stays clean.
 *
 * @enforced-by tests/components/invitationOnlyTiers.census.test.jsx
 */
import { getPublicTiers, getTierDisplayName } from '../config/pricing.js';
import { t, tierPriceSlot, tx } from '../copy/index.js';
import { GOLD_TXT, INK, BODY, BORDER, sans, serif_, FS, SP, PROSE_MAX } from './theme.js';
import Button from './primitives/Button.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../design/proseScale.js';

export default function AnonTierTeaser({ onSignIn }) {
  const mobile = useIsMobile();
  const tiers = getPublicTiers();

  // One quiet comparison strip subordinate to the unlock card's headline, not
  // three bordered cards inside the hero's own bordered card. A single top
  // hairline fences the whole teaser off as a group; the tiers below are
  // borderless clusters separated by spacing. Width is routed through the shared
  // prose cap so the columns reflow cleanly (auto-fit) to one legible column on
  // narrow widths instead of stranding a 2+1 orphan.
  return (
    <div style={{
      maxWidth: PROSE_MAX, margin: `${SP.lg}px auto 0`,
      paddingTop: SP.lg, borderTop: `1px solid ${BORDER}`,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: GOLD_TXT, marginBottom: SP.lg,
      }}>
        What a free account unlocks
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(196px, 1fr))',
        gap: SP.lg, textAlign: 'left',
      }}>
        {tiers.map(tier => {
          const name = getTierDisplayName(tier.legacyKey) || t(`pricing.tiers.${tier.key}.name`);
          // ⛔ NOT `t()` ON THE TWO PRICE KEYS. This teaser used to walk getVisibleTiers()
          // WHOLE — the Founder included — and the Founder's price keys were deleted by
          // ruling. `t()` renders the key it cannot resolve, so this card printed
          // `pricing.tiers.founder.priceLabel` and `.priceSub` as literal text at every
          // width (ODQ §934.22 item 1). The tier has since left this surface altogether
          // (the docblock's invitation-only rule), but the RESOLVER stays: a price-less
          // tier is answered by its STANDING and the standing's own sub-line, and the two
          // ladders never mix — a tier reads as a price or as a standing, label and
          // sub-line together. Keeping it here is what stops the raw keys returning the
          // day any other tier loses a price.
          const { label: priceLabel, sub: priceSub } = tierPriceSlot(tier.key);
          const tagline = t(`pricing.tiers.${tier.key}.tagline`);
          const features = (tx(`pricing.tiers.${tier.key}.features`) || []).slice(0, 3);
          const emphasised = tier.key === 'cartographer';

          return (
            // Borderless cluster: tight intra-tier spacing carries the grouping
            // the card border used to. The recommended tier reads as recommended
            // via its name in GOLD_TXT, not via a competing box or a second
            // solid-gold primary.
            <article
              key={tier.key}
              style={{
                display: 'flex', flexDirection: 'column', gap: SP.xs,
              }}
            >
              <div style={{
                fontFamily: serif_, fontSize: FS.lg, fontWeight: 600,
                color: emphasised ? GOLD_TXT : INK,
              }}>
                {name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 600, color: INK, lineHeight: 1 }}>
                  {priceLabel}
                </span>
                {/* "forever" / "per month" — the unit beside the price, read on a phone and
                    drawn at 11px until the floor reached this page. */}
                {priceSub && <span style={{ fontSize: chromeFontSize(FS.xs, mobile), color: BODY, fontFamily: sans }}>{priceSub}</span>}
              </div>
              {tagline && (
                <p style={{ margin: 0, fontSize: proseFontSize(FS.xs, mobile), color: BODY, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>
                  {tagline}
                </p>
              )}
              <ul style={{ listStyle: 'none', padding: 0, margin: `${SP.xs}px 0 0`, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {features.map((f, i) => (
                  <li key={i} style={{ fontSize: proseFontSize(FS.xs, mobile), color: BODY, lineHeight: 1.4 }}>
                    {'·'} {f}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                onClick={() => onSignIn?.()}
                variant="gold"
                size="md"
                fullWidth
              >
                Sign in (free)
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
