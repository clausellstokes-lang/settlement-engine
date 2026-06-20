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
import { GOLD, GOLD_BG, INK, MUTED, BORDER, FS, sans, swatch } from '../theme.js';

// The premium pitch — names the SIMULATION, not size or saves. Single source so
// the test can assert the copy references the simulation and never a size cap.
export const PREMIUM_PITCH = 'Unlock the simulation — advance time, run campaigns, author your pantheon.';

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
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '9px 12px', background: swatch['#FBF5E6'], border: `1px solid ${BORDER}`,
        borderRadius: 7, fontFamily: sans, fontSize: FS.xs, color: INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
        <Save size={14} color={GOLD} />
        {isAnon ? (
          <span data-testid="quota-label" style={{ color: MUTED }}>
            <strong style={{ color: INK }}>Sign in to save</strong> — keep your settlements across sessions.
          </span>
        ) : isPremium ? (
          <span data-testid="quota-label" style={{ color: MUTED }}>
            <strong style={{ color: INK }}>Unlimited saves</strong> · the living world is unlocked.
          </span>
        ) : (
          <span data-testid="quota-label" style={{ color: MUTED }}>
            <strong style={{ color: INK }}>{used} of {max} saves</strong> used
          </span>
        )}
      </div>

      {/* Meter (free only) — the COUNT limit, never a size cap. */}
      {!isAnon && !isPremium && (
        <div data-testid="quota-bar" style={{ flex: '0 1 140px', minWidth: 100, height: 7, background: swatch['#E8D9B0'], borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, max > 0 ? (used / max) * 100 : 0)}%`, height: '100%',
            background: used >= max ? swatch['#8B1A1A'] : GOLD, transition: 'width 200ms',
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
            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: FS.xxs, color: GOLD,
            fontWeight: 700, background: GOLD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '2px 8px',
          }}>
            <Sparkles size={10}/> {PREMIUM_PITCH}
          </span>
          <Button variant="gold" size="sm" onClick={() => onUpgrade?.()}>
            Upgrade
          </Button>
        </div>
      ) : null}
    </div>
  );
}
