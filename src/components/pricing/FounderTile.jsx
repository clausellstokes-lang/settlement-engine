/**
 * FounderTile.jsx — personalized Founder Lifetime recognition.
 *
 * $99 lifetime is a conviction product. Wrong for the new DM (premature),
 * neutral for the intermediate (don't know they'll use it long-term),
 * a no-brainer for the worldbuilder who recognizes they'll use the tool
 * for a year. The current pricing page shows it to everyone equally.
 *
 * This tile surfaces only when the user has demonstrated worldbuilder
 * behavior (audience='worldbuilder'). Then it's not a discount — it's
 * a recognition: "you've earned this offer."
 *
 * Self-gates on:
 *   - flag('founderRecognition') (default off; flip when audience hook is stable)
 *   - useReaderAudience() === 'worldbuilder'
 *   - founderSeatsRemaining > 0 (live RPC; null tolerated)
 *
 * Click → opens checkout for `founder_lifetime` (same path the
 * PricingPage uses).
 */

import { useEffect, useState } from 'react';
import { useStore } from '../../store/index.js';
import { useReaderAudience } from '../../hooks/useReaderAudience.js';
import { flag } from '../../lib/flags.js';
import { startCheckout } from '../../lib/stripe.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { t } from '../../copy/index.js';
import { GOLD, GOLD_B, sans, serif_, FS, SP, R, swatch, FORM_MAX } from '../theme.js';
import Button from '../primitives/Button.jsx';

// P11 — route the founder gold through the SAME named tokens the PricingPage
// founder card uses, not bespoke swatch hex, so the two founder surfaces share
// one source of truth (a palette edit moves both together). On the dark ink
// gradient both clear AA as text: GOLD (gold-500) = 7.6:1, GOLD_B (gold-400) =
// 9.4:1 — the migration is to named tokens of the same values, not a recolor.
const GOLD_500 = GOLD;     // gold-500 — heading, eyebrow, border
const GOLD_400 = GOLD_B;   // gold-400 — value-math figures (brighter on ink)
const INK_900 = swatch['#1B1408'];
const INK_800 = swatch['#2C2210'];

export default function FounderTile() {
  const audience = useReaderAudience();
  const tier = useStore(s => s.auth.tier);
  const recognitionEnabled = flag('founderRecognition');
  const [seatsRemaining, setSeatsRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  // P10 — a $99 CTA that silently no-ops on failure is a dead-end worse than the
  // sibling PricingPage path. Surface a domain-language error + a retry path.
  const [error, setError] = useState(null);

  // Pull live seat counter once on mount. If the RPC errors, we leave
  // seatsRemaining null and fall back to the static "limited seats" copy.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchFounderSeatsRemaining } = await import('../../lib/founderSeats.js');
        const n = await fetchFounderSeatsRemaining();
        if (!cancelled) setSeatsRemaining(typeof n === 'number' ? n : null);
      } catch { /* RPC unavailable; stay null */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // Compute eligibility booleans up front so the effect's dep array
  // captures them cleanly.
  const eligible =
    recognitionEnabled &&
    audience === 'worldbuilder' &&
    tier !== 'premium' &&
    !(typeof seatsRemaining === 'number' && seatsRemaining <= 0);

  // FOUNDER_TILE_SHOWN fires once per session on first eligible render.
  // Putting this in an effect avoids the render-side analytics call
  // (purity rule) and the useState-as-ref hack that linted unhappy.
  useEffect(() => {
    if (!eligible) return;
    Funnel.track(EVENTS.FOUNDER_TILE_SHOWN, {
      seatsRemaining,
      audience,
    });
  }, [eligible, seatsRemaining, audience]);

  if (!eligible) return null;

  const claimSeat = seatsRemaining ? 500 - seatsRemaining + 1 : null;

  async function handleClick() {
    setLoading(true);
    setError(null);
    Funnel.track(EVENTS.FOUNDER_TILE_CLICKED, { seatsRemaining, audience });
    try {
      await startCheckout('founder_lifetime');
    } catch (e) {
      // Keep the raw error in the console; show a recoverable, domain-language
      // message inline so the highest-value CTA is never a silent dead-end.
      console.warn('[FounderTile] checkout failed:', e);
      setError(t('purchase.failureMessage'));
    } finally {
      setLoading(false);
    }
  }

  // P7 — match the PricingPage founder card's two-channel scarcity idiom: the
  // live count (accessible channel) PLUS a thin filled meter (aria-hidden). Same
  // computation as PricingPage so the seat-scarcity reads identically on both.
  const seatsPct = typeof seatsRemaining === 'number'
    ? Math.min(100, Math.max(0, ((500 - seatsRemaining) / 500) * 100))
    : null;

  return (
    <div style={{
      maxWidth: FORM_MAX, margin: `${SP.lg}px auto`,
      background: `linear-gradient(180deg, ${INK_900} 0%, ${INK_800} 100%)`,
      border: `1.5px solid ${GOLD_500}`,
      borderRadius: R.lg, overflow: 'hidden',
      // P5 — this tile mounts INSIDE the Account feature card, on top of a tinted
      // sub-block: card → tint → tile is already three elevations. A 32px-blur
      // drop shadow made the innermost element the LOUDEST, inverting the
      // hierarchy and re-creating box-soup. The dark gradient + gold border are a
      // sufficient (two-channel) boundary on their own; a 1px hairline lift is
      // all the elevation it needs as a peer of its sibling tinted blocks.
      boxShadow: '0 1px 3px rgba(27,20,8,0.18)',
      fontFamily: sans,
    }}>
      {/* P5 — one elevation level. The header is separated from the body by
          spacing rhythm (tight within header, looser before the body), not a
          false-floor borderBottom divider; the single outer gold border is the
          only card boundary. */}
      <div style={{
        padding: `${SP.lg}px ${SP.lg}px 0`,
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '3px 10px', borderRadius: R.sm,
          background: 'rgba(201,162,76,0.18)',
          color: GOLD_500, fontSize: FS.xs, fontWeight: 800,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          You’ve earned this offer
        </div>
        {/* Text-only title, matching the icons-off PricingPage founder card. */}
        <h2 style={{
          margin: `${SP.sm}px 0 0`, fontFamily: serif_, fontWeight: 600,
          fontSize: FS['22'], color: GOLD_500, letterSpacing: '-0.005em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.xs,
        }}>
          Founder Lifetime
        </h2>
        {typeof seatsRemaining === 'number' && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: FS.xs, color: swatch['#C8B098'], fontStyle: 'italic' }}>
              {seatsRemaining} of 500 seats remaining
            </div>
            <div
              aria-hidden="true"
              style={{
                height: 4, borderRadius: R.sm, overflow: 'hidden',
                background: 'rgba(201,162,76,0.18)',
              }}
            >
              <div style={{ height: '100%', borderRadius: R.sm, background: GOLD_500, width: `${seatsPct}%` }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: SP.lg }}>
        {/* P3 — the value delta is the card's conviction, so make it the focal
            level rather than the smallest, most-muted line. The "$99 forever"
            figure is promoted to display size (gold-400 on ink = 9.4:1) so the
            save-this-much math is what the eye lands on; the "$144" comparison
            stays a quiet supporting line above it, and the decorative title is
            already the demoted label. P5 — grouped by spacing alone now (no
            tint/radius box); the bold gold figures carry the emphasis the faint
            tint used to. WORDING is unchanged from the original two lines. */}
        <div style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.6, fontFamily: serif_ }}>
          <div>Two years of Cartographer = <b style={{ color: GOLD_400 }}>$144</b></div>
          <div style={{
            fontSize: FS['28'], fontWeight: 700, color: GOLD_400,
            lineHeight: 1.1, marginTop: SP.xs,
          }}>
            Founder = $99 forever
          </div>
          {claimSeat && (
            // P7 — #A08060 on the dark gradient was ~3.5:1; the GOLD_400 tone
            // clears 4.5:1 so the "name in the credits" line is legible.
            <div style={{ marginTop: SP.sm, fontStyle: 'italic', color: GOLD_400 }}>
              …plus your name in the credits (seat {claimSeat}).
            </div>
          )}
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleClick}
          disabled={loading}
          style={{ marginTop: SP.md }}
        >
          {loading
            ? 'Starting checkout…'
            : claimSeat
              ? `Claim seat ${claimSeat}, $99 one-time`
              : 'Claim a Founder seat, $99 one-time'}
        </Button>
        {error && (
          <div
            role="alert"
            style={{
              marginTop: SP.sm, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: SP.xs,
              fontSize: FS.sm, color: GOLD_400, textAlign: 'center',
            }}
          >
            <span>{error}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={loading}
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
