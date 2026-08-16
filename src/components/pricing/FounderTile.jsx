/**
 * FounderTile.jsx — P116 / X-8 personalized Founder recognition.
 *
 * ⛔ THIS TILE NO LONGER SELLS ANYTHING (DESIGN_FOUNDERS_HALL §1/§5, ODQ §118).
 * It used to open a $99 `founder_lifetime` checkout — the second live purchase
 * path for a chair, beside the pricing page's own. The owner attested on
 * 2026-08-15 that no chair has ever been sold, and a chair is given rather than
 * bought, so the checkout call, the price arithmetic and the error/retry
 * recovery around it are all GONE. There is no failure to recover from: the CTA
 * is a link to the Founders' Hall, where the letterbox already lives.
 *
 * What survives is the recognition itself. The tile surfaces only when the user
 * has demonstrated worldbuilder behavior (audience='worldbuilder'), and then it
 * says the Hall should know their name.
 *
 * Self-gates on:
 *   - flag('founderRecognition') (default off; flip when audience hook is stable)
 *   - useReaderAudience() === 'worldbuilder'
 *   - founderSeatsRemaining > 0 (live RPC; null tolerated)
 *
 * Click → navigates to the Hall. `lib/stripe.js` is deliberately NOT imported.
 */

import { useEffect, useState } from 'react';
import { useStore } from '../../store/index.js';
import { useReaderAudience } from '../../hooks/useReaderAudience.js';
import { flag } from '../../lib/flags.js';
import { FOUNDER_SEAT_CAP } from '../../lib/founderSeats.js';
import { viewToPath } from '../../lib/routes.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { sans, serif_, FS, SP, swatch } from '../theme.js';

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

  const chairsHeld = typeof seatsRemaining === 'number'
    ? FOUNDER_SEAT_CAP - seatsRemaining
    : null;
  // P7 — same computation as the PricingPage charter band so the meter reads
  // identically on both surfaces (the fraction of chairs held).
  const seatsPct = typeof seatsRemaining === 'number'
    ? Math.min(100, Math.max(0, ((FOUNDER_SEAT_CAP - seatsRemaining) / FOUNDER_SEAT_CAP) * 100))
    : null;

  function handleClick() {
    Funnel.track(EVENTS.FOUNDER_TILE_CLICKED, { seatsRemaining, audience });
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
          The Hall should know your name
        </div>
        <h2 style={{
          margin: `${SP.sm}px 0 0`, fontFamily: serif_, fontWeight: 600,
          fontSize: FS['22'], color: GOLD_500, letterSpacing: '-0.005em',
        }}>
          The Founders&rsquo; Hall
        </h2>
        {typeof seatsRemaining === 'number' && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: FS.xs, color: swatch['#C8B098'], fontStyle: 'italic' }}>
              {chairsHeld} of {FOUNDER_SEAT_CAP} chairs held
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
          <div>A chair is a place in the credits, for as long as SettlementForge runs.</div>
          <div style={{ marginTop: SP.xs, color: GOLD_400 }}>
            Thirty chairs, given by invitation and never sold.
          </div>
        </div>
        <a
          href={viewToPath('founders')}
          onClick={handleClick}
          style={{
            marginTop: SP.md, display: 'block', textAlign: 'center',
            padding: '12px 16px', minHeight: 44, boxSizing: 'border-box',
            background: GOLD_500, color: INK_900,
            fontFamily: sans, fontSize: FS.md, fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Request a chair
        </a>
      </div>
    </div>
  );
}
