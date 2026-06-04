/**
 * useFunnelEvent.js - One-shot funnel-event firing on condition transition.
 *
 * Many critique findings (X-2 pricing moments, X-3 save intent, X-4
 * welcome credit) want to fire an analytics event exactly once per
 * session per condition becoming true. Components doing this by hand
 * tend to either spam events on every render or forget to fire at all.
 *
 * This hook subscribes to a condition and a payload getter. Whenever
 * the condition transitions false → true, it fires the named event
 * with the resolved payload. The fire is suppressed if either:
 *   - the same event already fired this session (sessionStorage)
 *   - the user has DNT enabled (Funnel.track honors this)
 *
 * Usage:
 *   useFunnelEvent(
 *     EVENTS.WOW_REVEAL_SHOWN,
 *     isVisible,
 *     () => ({ size: settlement.tier })
 *   );
 *
 * Per-session dedupe is the right default for "first export", "first
 * save", "saw welcome card" - events that only matter once. Pass
 * `{ once: false }` to fire on every transition.
 */

import { useEffect, useRef } from 'react';
import { Funnel } from '../lib/analytics.js';

const SESSION_PREFIX = 'sf:funnel:';

function alreadyFiredThisSession(eventName) {
  try {
    return typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem(SESSION_PREFIX + eventName) === '1';
  } catch {
    return false;
  }
}

function markFiredThisSession(eventName) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_PREFIX + eventName, '1');
    }
  } catch {
    /* storage unavailable */
  }
}

/**
 * @param {string} eventName  - A value from EVENTS in lib/analytics.js
 * @param {boolean} condition - The trigger. Fires on false → true transition.
 * @param {Function|Object} [getPayload] - Either a function returning
 *   the payload at fire time, or a stable payload object.
 * @param {Object} [opts]
 * @param {boolean} [opts.once=true] - Per-session dedupe.
 */
export function useFunnelEvent(eventName, condition, getPayload, opts = {}) {
  const { once = true } = opts;
  const lastValueRef = useRef(false);

  useEffect(() => {
    const prev = lastValueRef.current;
    lastValueRef.current = !!condition;

    if (!condition || prev === !!condition) return;
    if (once && alreadyFiredThisSession(eventName)) return;

    const payload = typeof getPayload === 'function'
      ? getPayload()
      : (getPayload || {});

    Funnel.track(eventName, payload);
    if (once) markFiredThisSession(eventName);
  }, [eventName, condition, getPayload, once]);
}
