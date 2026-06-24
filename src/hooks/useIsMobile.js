import { useSyncExternalStore } from 'react';

// ── Shared mobile-flag store ──────────────────────────────────────────────────
// The whole app shares ONE reactive source of truth for "are we at a mobile
// width". Buttons, IconButtons and the dossier tabs all read from here, so we
// must not add one resize/matchMedia listener per consumer — thousands of
// Buttons would each attach a listener. Instead a single matchMedia listener per
// breakpoint feeds a tiny subscribe/notify store; every hook instance just
// subscribes to the store.

const DEFAULT_BREAKPOINT = 640;

/** @type {Map<number, { mql: MediaQueryList, subs: Set<() => void>, matches: boolean }>} */
const stores = new Map();

function getStore(breakpoint) {
  let store = stores.get(breakpoint);
  if (store) return store;
  // SSR / non-DOM env: a degenerate store that always reports "not mobile" and
  // never notifies. Kept in the map so callers get a stable reference.
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    store = { mql: null, subs: new Set(), matches: false };
    stores.set(breakpoint, store);
    return store;
  }
  // `max-width: (bp - 1)px` so the flag flips below the breakpoint, matching the
  // historical `innerWidth < breakpoint` semantics exactly (640 → <640 is mobile).
  const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  store = { mql, subs: new Set(), matches: mql.matches };
  const onChange = (e) => {
    store.matches = e.matches;
    store.subs.forEach((fn) => fn());
  };
  // addEventListener('change') also fires on orientation change, since rotation
  // re-evaluates the media query. One listener serves every subscriber.
  if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onChange);
  else if (typeof mql.addListener === 'function') mql.addListener(onChange); // older Safari
  stores.set(breakpoint, store);
  return store;
}

/**
 * Read the current mobile state synchronously, without subscribing. Useful for
 * non-React callers (see components/new/tabConstants.js `isMobile()`), which need
 * a fresh read on each call rather than a React subscription.
 *
 * @param {number} [breakpoint=640]
 * @returns {boolean} true when the viewport is narrower than `breakpoint`.
 */
export function getIsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  return getStore(breakpoint).matches;
}

/**
 * Reactive mobile-width flag, backed by a single shared matchMedia listener per
 * breakpoint. Updates on resize AND orientation change. All consumers across the
 * app fan into the same store, so adding more callers does not add listeners.
 *
 * @param {number} [breakpoint=640]
 * @returns {boolean} true when the viewport is narrower than `breakpoint`.
 */
export default function useIsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  // useSyncExternalStore is the idiomatic external-store subscription: it
  // subscribes to the shared store, re-reads on notify, resyncs across the
  // mount gap automatically, and is tearing-safe — no effect/setState dance.
  const subscribe = (onStoreChange) => {
    const store = getStore(breakpoint);
    store.subs.add(onStoreChange);
    return () => store.subs.delete(onStoreChange);
  };
  const getSnapshot = () => getStore(breakpoint).matches;
  // Server snapshot: no viewport, so "not mobile" — matches the SSR store.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
