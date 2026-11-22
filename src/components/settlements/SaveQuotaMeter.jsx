/**
 * SaveQuotaMeter — the Library save-quota meter + premium funnel header (UX
 * overhaul Phase 3, plan §4.2 / §3.3).
 *
 * NOT A SIZE GATE. Free accounts generate up to metropolis; the ONLY free limit
 * is the save COUNT (3 active slots). This header therefore references the save
 * count and pitches the SIMULATION (advance time / campaigns / custom content) as
 * the premium product — never settlement size, never "more saves" alone.
 *
 *   - anon    → "Sign in free to save up to N settlements" (anon has 0 slots; N is
 *               the FREE tier's derived cap, since the line is a promise about the
 *               account this visitor does not have yet, not about their own quota).
 *   - free    → "N of 3 saves" meter + the upgrade card naming the real product.
 *   - premium → "Unlimited saves" + a quiet "living world unlocked" line; no meter.
 *
 * Pure presentational. Receives the resolved counts/tier + an onUpgrade callback
 * (routes to the canonical premium-value surface) and an onSignIn callback. No
 * store reads, no rng. The cap (`max`) is passed in by the parent from the store's
 * maxSaves() — the free floor of 3 is never hardcoded here.
 */

import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { GOLD, GOLD_BG, INK, BODY, GOLD_TXT, FS, sans, swatch } from '../theme.js';
import { getTierDisplayName } from '../../config/pricing.js';
import { FREE_SAVE_LIMIT } from '../../config/tierFacts.js';
import { purchasesOpen } from '../../lib/launchGate.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

// The premium pitch — names the SIMULATION, not size or saves. Single source so
// the test can assert the copy references the simulation and never a size cap.
export const PREMIUM_PITCH = 'Unlock the simulation: advance time, run campaigns, create your own gods.';

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
  const mobile = useIsMobile();
  const isPremium = tier === 'premium' || max === Infinity;
  const isAnon = tier === 'anon';
  // Pre-launch lockout (lib/launchGate.js): Upgrade is a purchase control, so it
  // renders disabled and wears the pill until purchases open. Sign in stays live.
  const purchasesAreOpen = purchasesOpen();

  return (
    <div
      data-testid="save-quota-meter"
      data-tier={tier}
      style={{
        // Borderless tinted strip — demoted so this monetization frame doesn't
        // add to the list's box-soup or out-rank the page header above it.
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '7px 12px', background: swatch['#FBF5E6'],
        fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), color: INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
        {isAnon ? (
          // The anon line used to say only "Sign in to save … keep your
          // settlements across sessions": true, but silent about the two facts
          // that decide whether a visitor bothers — that the account is FREE and
          // that it holds a bounded number of settlements. Both are named here,
          // and the number is the DERIVED free-tier cap (config/tierFacts.js,
          // pinned to TIER_GATE.free.maxSaves by the contract test), never a
          // hand-typed 3. `max` is this viewer's own cap and is 0 for anon, so it
          // cannot be the source of the promise being made about an account.
          <span data-testid="quota-label" style={{ color: BODY }}>
            <strong style={{ color: INK }}>Sign in free</strong> to save up to {FREE_SAVE_LIMIT} settlements and keep them across sessions.
          </span>
        ) : isPremium ? (
          <span data-testid="quota-label" style={{ color: BODY }}>
            <strong style={{ color: INK }}>Unlimited saves</strong> · the living world is unlocked.
          </span>
        ) : (
          <span data-testid="quota-label" style={{ color: BODY }}>
            <strong style={{ color: INK }}>{Math.max(0, max - used)} of {max} saves</strong> left on {getTierDisplayName(tier)}
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
          aria-valuetext={`${Math.max(0, max - used)} of ${max} saves left on ${getTierDisplayName(tier)}${used >= max ? '. at cap' : ''}`}
          style={{ flex: '0 1 140px', minWidth: 100, height: 7, background: swatch['#E8D9B0'], overflow: 'hidden' }}
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
            // strip's demotion (P5). GOLD_BG fill + bold GOLD_TXT carry it,
            // matching the card pips' tint-only pattern.
            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: chromeFontSize(FS.xs, mobile), color: GOLD_TXT,
            fontWeight: 700, background: GOLD_BG, padding: '2px 8px',
          }}>
            {PREMIUM_PITCH}
          </span>
          <Button variant="gold" size="sm" disabled={!purchasesAreOpen} onClick={() => onUpgrade?.()} style={purchasesAreOpen ? undefined : { flexWrap: 'wrap' }}>
            Upgrade
            {!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
