/**
 * FounderTile.jsx — P116 / X-8 personalized Founder Lifetime recognition.
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
import { FOUNDER_SEAT_CAP } from '../../lib/founderSeats.js';
import { startCheckout } from '../../lib/stripe.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { t } from '../../copy/index.js';
import { sans, serif_, FS, SP, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const GOLD_500 = swatch['#C9A24C'];
const GOLD_400 = swatch['#D9B566'];
const INK_900 = swatch['#1B1408'];
const INK_800 = swatch['#2C2210'];
// The faint gold wash shared by the eyebrow badge and the P7 seat meter — named
// once so the two reuse one value (this const replaces the eyebrow's inline
// literal, so the file's rgba line count is unchanged).
const GOLD_WASH = 'rgba(201,162,76,0.18)';

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

  const claimSeat = seatsRemaining ? FOUNDER_SEAT_CAP - seatsRemaining + 1 : null;
  // P7 — same computation as the PricingPage founder card so the seat-scarcity
  // meter reads identically on both surfaces (the fraction of seats taken).
  const seatsPct = typeof seatsRemaining === 'number'
    ? Math.min(100, Math.max(0, ((FOUNDER_SEAT_CAP - seatsRemaining) / FOUNDER_SEAT_CAP) * 100))
    : null;

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

  return (
    <div style={{
      maxWidth: 380, margin: `${SP.lg}px auto`,
      background: `linear-gradient(180deg, ${INK_900} 0%, ${INK_800} 100%)`,
      border: `1.5px solid ${GOLD_500}`,
      overflow: 'hidden',
      boxShadow: '0 12px 32px rgba(27,20,8,0.40)',
      fontFamily: sans,
    }}>
      <div style={{
        padding: `${SP.md}px ${SP.lg}px ${SP.sm}px`,
        borderBottom: `1px solid rgba(201,162,76,0.20)`,
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '3px 10px',
          background: GOLD_WASH,
          color: GOLD_500, fontSize: FS.xxs, fontWeight: 800,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          You’ve earned this offer
        </div>
        <h2 style={{
          margin: `${SP.sm}px 0 0`, fontFamily: serif_, fontWeight: 600,
          fontSize: FS['22'], color: GOLD_500, letterSpacing: '-0.005em',
        }}>
          👑 Founder Lifetime
        </h2>
        {typeof seatsRemaining === 'number' && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: FS.xs, color: swatch['#C8B098'], fontStyle: 'italic' }}>
              {seatsRemaining} of {FOUNDER_SEAT_CAP} seats remaining
            </div>
            {/* P7 — the accessible live count PLUS a thin filled meter
                (aria-hidden), matching the PricingPage founder card's two-channel
                scarcity idiom. Square-cut (flat idiom) — no rounded track. */}
            <div aria-hidden="true" style={{ height: 4, overflow: 'hidden', background: GOLD_WASH }}>
              <div style={{ height: '100%', background: GOLD_500, width: `${seatsPct}%` }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: SP.lg }}>
        <div style={{
          padding: SP.md, background: 'rgba(201,162,76,0.06)',
          border: `1px solid rgba(201,162,76,0.20)`,
          fontSize: FS.sm, color: swatch['#C8B098'],
          lineHeight: 1.6, fontFamily: serif_,
        }}>
          <div>Two years of Cartographer = <b style={{ color: GOLD_400 }}>$144</b></div>
          <div>Founder = <b style={{ color: GOLD_400 }}>$99 forever</b></div>
          {claimSeat && (
            <div style={{ marginTop: SP.xs, fontStyle: 'italic', color: swatch['#A08060'] }}>
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
