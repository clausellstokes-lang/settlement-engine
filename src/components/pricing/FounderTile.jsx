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
import { startCheckout } from '../../lib/stripe.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { INK, sans, serif_, FS, SP, R, swatch } from '../theme.js';

const GOLD_500 = '#C9A24C';
const GOLD_400 = '#D9B566';
const INK_900 = '#1B1408';
const INK_800 = '#2C2210';

export default function FounderTile() {
  const audience = useReaderAudience();
  const tier = useStore(s => s.auth.tier);
  const recognitionEnabled = flag('founderRecognition');
  const [seatsRemaining, setSeatsRemaining] = useState(null);
  const [loading, setLoading] = useState(false);

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
    Funnel.track(EVENTS.FOUNDER_TILE_CLICKED, { seatsRemaining, audience });
    try {
      await startCheckout('founder_lifetime');
    } catch (e) {
      console.warn('[FounderTile] checkout failed:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 380, margin: `${SP.lg}px auto`,
      background: `linear-gradient(180deg, ${INK_900} 0%, ${INK_800} 100%)`,
      border: `1.5px solid ${GOLD_500}`,
      borderRadius: R.lg, overflow: 'hidden',
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
          padding: '3px 10px', borderRadius: R.sm,
          background: 'rgba(201,162,76,0.18)',
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
          <div style={{
            marginTop: 6, fontSize: FS.xs, color: swatch['#C8B098'],
            fontStyle: 'italic',
          }}>
            {seatsRemaining} of 500 seats remaining
          </div>
        )}
      </div>
      <div style={{ padding: SP.lg }}>
        <div style={{
          padding: SP.md, background: 'rgba(201,162,76,0.06)',
          border: `1px solid rgba(201,162,76,0.20)`,
          borderRadius: R.sm, fontSize: FS.sm, color: swatch['#C8B098'],
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
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          style={{
            marginTop: SP.md,
            width: '100%', padding: SP.md,
            background: `linear-gradient(135deg, ${GOLD_500}, #8C6F32)`,
            color: INK, border: 'none', borderRadius: R.sm,
            fontFamily: serif_, fontSize: FS.lg, fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? 'Starting checkout…'
            : claimSeat
              ? `Claim seat ${claimSeat}, $99 one-time`
              : 'Claim a Founder seat, $99 one-time'}
        </button>
      </div>
    </div>
  );
}
