/**
 * usePricingMoment.js - Fire a pricing moment on rising-edge condition.
 *
 * The library `lib/pricingMoments.js` enforces 24h cooldown + premium-skip
 * and looks up copy from COPY.pricing.moments. This hook wraps it for
 * declarative use:
 *
 *   usePricingMoment(
 *     'first_save',
 *     savedCount === 1,
 *     openPricingMomentCard,
 *   );
 *
 * Behavior:
 *   - Fires once per render-lifetime, on condition false → true.
 *   - Honors the lib's 24h-per-moment cooldown + premium-skip.
 *   - Dispatches PRICING_MOMENT_SHOWN analytics on fire.
 *   - The `openModal` callback receives `{ headline, body, reason }`
 *     and is responsible for actually rendering the card.
 *
 * Design choice: the consumer supplies the modal opener (typically a
 * Zustand setter). This keeps the hook decoupled from any specific UI.
 * The PricingMomentCard component is the conventional consumer.
 */

import { useEffect, useRef } from 'react';
import { triggerPricingMoment } from '../lib/pricingMoments.js';
import { useStore } from '../store/index.js';
import { Funnel, EVENTS } from '../lib/analytics.js';

/**
 * @param {string} reason - A key in COPY.pricing.moments
 * @param {boolean} condition - Trigger; fires on false → true transition
 * @param {(content: { headline:string, body:string, reason:string }) => void} openModal
 * @param {Object} [opts]
 * @param {boolean} [opts.force=false] - Bypass the cooldown (testing)
 */
export function usePricingMoment(reason, condition, openModal, opts = {}) {
  const tier = useStore(s => s.auth.tier);
  const prevRef = useRef(false);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = !!condition;
    if (!condition || prev === !!condition) return;

    const fired = triggerPricingMoment(/** @type {any} */ (reason), openModal, {
      tier,
      force: !!opts.force,
    });

    if (fired) {
      Funnel.track(EVENTS.PRICING_MOMENT_SHOWN, { reason, tier });
    }
  }, [reason, condition, openModal, tier, opts.force]);
}
