/**
 * SaveQuotaMeter — the Library save-quota meter + premium funnel header (UX
 * overhaul Phase 3, plan §4.2 / §3.3).
 *
 * NOT A SIZE GATE. Free accounts generate up to metropolis; the ONLY free limit
 * is the save COUNT (3 active slots). This header therefore references the save
 * count and pitches the SIMULATION (advance time / campaigns / custom content) as
 * the premium product — never settlement size, never "more saves" alone.
 *
 *   - anon    → "Sign in to save" (anon has 0 slots).
 *   - free    → "N of 3 saves" meter + the upgrade card naming the real product.
 *   - premium → "Unlimited saves" + a quiet "living world unlocked" line; no meter.
 *
 * Pure presentational. Receives the resolved counts/tier + an onUpgrade callback
 * (routes to the canonical premium-value surface) and an onSignIn callback. No
 * store reads, no rng.
 */

import { Save, Sparkles } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { GOLD, GOLD_BG, INK, BODY, GOLD_TXT, FS, sans, swatch } from '../theme.js';

// The premium pitch — names the SIMULATION, not size or saves. Single source so
// the test can assert the copy references the simulation and never a size cap.
export const PREMIUM_PITCH = 'Unlock the simulation: advance time, run campaigns, author your pantheon.';

/**
 * @param {{
 *   tier: 'anon'|'free'|'premium',
 *   used: number,
 *   max: number,
 *   onUpgrade?: () => void,
 *   onSignIn?: () => void,
 * }} props
 */
export default function SaveQuotaMeter({ tier, used, max, onUpgrade, onSignIn }) {
  const isPremium = tier === 'premium' || max === Infinity;
  const isAnon = tier === 'anon';

  return (
    <div
      data-testid="save-quota-meter"
      data-tier={tier}
      style={{
        // Borderless tinted strip — demoted so this monetization frame doesn't
        // add to the list's box-soup or out-rank the page header above it.
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '7px 12px', background: swatch['#FBF5E6'],
        borderRadius: 7, fontFamily: sans, fontSize: FS.xs, color: INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
        <Save size={14} color={GOLD_TXT} aria-hidden="true" />
        {isAnon ? (
          <span data-testid="quota-label" style={{ color: BODY }}>
            <strong style={{ color: INK }}>Sign in to save</strong>. Keep your settlements across sessions.
          </span>
        ) : isPremium ? (
          <span data-testid="quota-label" style={{ color: BODY }}>
            <strong style={{ color: INK }}>Unlimited saves</strong> · the living world is unlocked.
          </span>
        ) : (
          <span data-testid="quota-label" style={{ color: BODY }}>
            <strong style={{ color: INK }}>{used} of {max} saves</strong> used
            {used >= max && (
              <strong style={{ color: swatch.danger, marginLeft: 6 }}>· at cap</strong>
            )}
          </span>
        )}
      </div>

      {/* Meter (free only) — the COUNT limit, never a size cap. role=progressbar
          + aria-value* give the fill a non-visual channel; the 'at cap' state is
          also carried by the inline '· at cap' text label beside the count above
          the bar, plus a hatch/border cue on the fill, so it is never color-alone. */}
      {!isAnon && !isPremium && (
        <div
          data-testid="quota-bar"
          role="progressbar"
          aria-label="Saves used"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={`${used} of ${max} saves used`}
          style={{ flex: '0 1 140px', minWidth: 100, height: 7, background: swatch['#E8D9B0'], borderRadius: 4, overflow: 'hidden' }}
        >
          <div style={{
            width: `${Math.min(100, max > 0 ? (used / max) * 100 : 0)}%`, height: '100%',
            // At-cap rides a second visual channel beyond the red/gold hue swap:
            // a diagonal hatch + high-contrast inset border so a near-full gold
            // fill and the at-cap fill are distinguishable without color alone.
            background: used >= max
              ? `repeating-linear-gradient(45deg, ${swatch['#8B1A1A']}, ${swatch['#8B1A1A']} 4px, ${swatch.danger} 4px, ${swatch.danger} 8px)`
              : GOLD,
            boxShadow: used >= max ? `inset 0 0 0 1px ${INK}` : 'none',
            transition: 'width 200ms',
          }}/>
        </div>
      )}

      {/* Funnel CTA — anon signs in; free upgrades. The pitch names the SIMULATION. */}
      {isAnon ? (
        <Button variant="gold" size="sm" onClick={() => onSignIn?.()}>
          Sign in
        </Button>
      ) : !isPremium ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span data-testid="premium-pitch" style={{
            // Tint-only token-pill (no border): a bordered chip inside the
            // borderless meter strip re-introduced a box-on-tint and undercut the
            // strip's demotion (P5). GOLD_BG fill + the Sparkles glyph + bold
            // GOLD_TXT carry it, matching the card pips' tint-only pattern.
            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: FS.xs, color: GOLD_TXT,
            fontWeight: 700, background: GOLD_BG, borderRadius: 8, padding: '2px 8px',
          }}>
            <Sparkles size={10} aria-hidden="true"/> {PREMIUM_PITCH}
          </span>
          <Button variant="gold" size="sm" onClick={() => onUpgrade?.()}>
            Upgrade
          </Button>
        </div>
      ) : null}
    </div>
  );
}
