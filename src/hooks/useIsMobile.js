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

// ── THE PHONE PROSE FLOOR ─────────────────────────────────────────────────────
// Measured on a 375px phone (2026-09-18): the dossier's reading text — the NPC
// card's wants, secrets and constraints, the quick guide's defining truths and
// pressure, the table-night card bodies, the Services tab's absence notes — sat
// at 10, 11, 12 and 13px. Those steps were chosen on a wide screen, where a
// paragraph has 600px of measure and 12px still scans; on a 343px column the
// same step is the size the reader has to bring the phone closer for, and the
// dossier IS the read-at-the-table surface.
//
// The floor applies to PROSE and to nothing else. Labels, eyebrows, badges,
// counts and chips keep their own scale: raising them would flatten the
// hierarchy that makes the prose findable in the first place, and they are
// glanced at rather than read.

/** The smallest a dossier prose paragraph may render below the breakpoint (px). */
export const PHONE_PROSE_FLOOR = 14;

/**
 * A prose size for the width the reader is actually at. Pure, so a surface can
 * call it once per paragraph without a hook per call site, and so it can be
 * tested without a viewport.
 *
 * Takes the DESKTOP size (an FS token) rather than returning one size for
 * everything, so a surface keeps its own typographic steps wherever they already
 * clear the floor — the ladder is preserved, only its bottom rungs lift.
 *
 * NO TOKEN IS IMPORTED HERE, deliberately: this module is a zero-import leaf that
 * dozens of components pull in, and importing the theme from it would drag the
 * token module into every one of their typecheck and bundle surfaces.
 *
 * @param {number} desktopSize the size this prose renders at on a wide screen
 * @param {boolean} mobile     the viewport flag, from `useIsMobile()`
 * @returns {number} the size to render at now
 */
export function proseFontSize(desktopSize, mobile) {
  if (!mobile) return desktopSize;
  return desktopSize < PHONE_PROSE_FLOOR ? PHONE_PROSE_FLOOR : desktopSize;
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
