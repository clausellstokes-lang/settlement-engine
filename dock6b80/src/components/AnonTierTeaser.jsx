/**
 * AnonTierTeaser.jsx — Inline subscription telegraphing for the anon cap.
 *
 * Shown beneath the "Sign in to unlock" card on the Create page once an
 * anonymous visitor exhausts their daily generations. It surfaces the three
 * subscription tiers (NOT the AI-credit packs) so a capped visitor sees what
 * an account unlocks before they leave. Anonymous visitors can't check out
 * directly, so every card routes to sign-in.
 *
 * Reuses the pricing tier data + copy (getVisibleTiers / pricing.tiers.*),
 * presented compactly for the hero rather than the full pricing-page layout.
 * Colors come from theme tokens (no raw hex) so visual-budget lint stays clean.
 */
import { getVisibleTiers, getTierDisplayName } from '../config/pricing.js';
import { t, tx } from '../copy/index.js';
import { GOLD_TXT, INK, BODY, BORDER, sans, serif_, FS, SP, PROSE_MAX } from './theme.js';
import Button from './primitives/Button.jsx';

export default function AnonTierTeaser({ onSignIn }) {
  const tiers = getVisibleTiers();

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
        fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.10em',
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
          const priceLabel = t(`pricing.tiers.${tier.key}.priceLabel`);
          const priceSub = t(`pricing.tiers.${tier.key}.priceSub`);
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
                {priceSub && <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>{priceSub}</span>}
              </div>
              {tagline && (
                <p style={{ margin: 0, fontSize: FS.xs, color: BODY, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>
                  {tagline}
                </p>
              )}
              <ul style={{ listStyle: 'none', padding: 0, margin: `${SP.xs}px 0 0`, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {features.map((f, i) => (
                  <li key={i} style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.4 }}>
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
