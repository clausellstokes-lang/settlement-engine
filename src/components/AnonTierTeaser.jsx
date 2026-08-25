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
import { GOLD, GOLD_DEEP, INK, BODY, MUTED, BORDER, CARD, sans, serif_, FS, SP, R } from './theme.js';
import Button from './primitives/Button.jsx';

export default function AnonTierTeaser({ onSignIn }) {
  const tiers = getVisibleTiers();

  return (
    <div style={{ marginTop: SP.lg, textAlign: 'center' }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: GOLD_DEEP, marginBottom: SP.md,
      }}>
        What a free account unlocks
      </div>

      <div style={{
        display: 'flex', gap: SP.md, flexWrap: 'wrap', justifyContent: 'center',
        textAlign: 'left',
      }}>
        {tiers.map(tier => {
          const name = getTierDisplayName(tier.legacyKey) || t(`pricing.tiers.${tier.key}.name`);
          const priceLabel = t(`pricing.tiers.${tier.key}.priceLabel`);
          const priceSub = t(`pricing.tiers.${tier.key}.priceSub`);
          const tagline = t(`pricing.tiers.${tier.key}.tagline`);
          const features = (tx(`pricing.tiers.${tier.key}.features`) || []).slice(0, 3);
          const emphasised = tier.key === 'cartographer';

          return (
            <article
              key={tier.key}
              style={{
                flex: '1 1 200px', minWidth: 196, maxWidth: 232,
                background: CARD,
                border: emphasised ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                borderRadius: R.lg,
                padding: SP.lg,
                display: 'flex', flexDirection: 'column', gap: SP.sm,
              }}
            >
              <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>
                {name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 600, color: INK, lineHeight: 1 }}>
                  {priceLabel}
                </span>
                {priceSub && <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>{priceSub}</span>}
              </div>
              {tagline && (
                <p style={{ margin: 0, fontSize: FS.xs, color: BODY, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>
                  {tagline}
                </p>
              )}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {features.map((f, i) => (
                  <li key={i} style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.4 }}>
                    {'·'} {f}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                onClick={onSignIn}
                variant={emphasised ? 'primary' : 'gold'}
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
