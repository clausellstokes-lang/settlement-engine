import { useSyncExternalStore } from 'react';
import { POSTURE_QUERIES, readPosture, SSR_POSTURE } from '../design/organic/posture.js';

/**
 * hooks/usePosture — the three-posture reader (Organic Craft law §10).
 *
 * EXTENDS the existing isMobile layer (hooks/useIsMobile.js) rather than
 * greenfielding a parallel one: it reuses that file's exact shared-store idiom —
 * ONE matchMedia listener per query, fanned to every subscriber via a tiny
 * subscribe/notify store, read through useSyncExternalStore (tearing-safe, resyncs
 * across the mount gap). useIsMobile answers a single width boolean; posture needs
 * five capability queries (two width thresholds + pointer + hover + orientation),
 * so the store map is keyed by query STRING and the snapshot composes all five
 * through the pure derivePosture/readPosture in design/organic/posture.js.
 *
 * Nothing here is eager — usePosture is imported only by the (lazy) organic
 * surfaces, so it never joins the first-paint closure.
 */

/** @type {Map<string, { mql: MediaQueryList|null, subs: Set<() => void>, matches: boolean }>} */
const stores = new Map();

function getStore(query) {
  let store = stores.get(query);
  if (store) return store;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    store = { mql: null, subs: new Set(), matches: false };
    stores.set(query, store);
    return store;
  }
  const mql = window.matchMedia(query);
  store = { mql, subs: new Set(), matches: mql.matches };
  const onChange = (e) => { store.matches = e.matches; store.subs.forEach((fn) => fn()); };
  if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onChange);
  else if (typeof mql.addListener === 'function') mql.addListener(onChange); // older Safari
  stores.set(query, store);
  return store;
}

function matches(query) { return getStore(query).matches; }

// A single subscribe covers all five queries: any of their listeners re-runs the
// React snapshot, which recomputes the posture. One shared store per query means
// thousands of consumers add zero extra listeners (the useIsMobile invariant).
function subscribeAll(onStoreChange) {
  const qs = Object.values(POSTURE_QUERIES);
  const unsubs = qs.map((q) => { const s = getStore(q); s.subs.add(onStoreChange); return () => s.subs.delete(onStoreChange); });
  return () => unsubs.forEach((u) => u());
}

// The snapshot object must be referentially stable while the underlying media
// state is unchanged (useSyncExternalStore compares by identity — a fresh object
// every read would loop). Cache the last reading, keyed by a cheap capability
// signature, and only rebuild when a query actually flips.
let _lastKey = '';
let _lastValue = SSR_POSTURE;
function getSnapshot() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  // Width classes matter, not exact px — bucket to the two thresholds so a 1px
  // resize inside a class does not churn the cached object.
  const mediumUp = matches(POSTURE_QUERIES.mediumUp);
  const expandedUp = matches(POSTURE_QUERIES.expandedUp);
  const finePointer = matches(POSTURE_QUERIES.finePointer);
  const canHover = matches(POSTURE_QUERIES.canHover);
  const landscape = matches(POSTURE_QUERIES.landscape);
  const key = `${mediumUp}|${expandedUp}|${finePointer}|${canHover}|${landscape}`;
  if (key === _lastKey) return _lastValue;
  _lastKey = key;
  _lastValue = readPosture({ width, finePointer, canHover, landscape });
  return _lastValue;
}

/**
 * Reactive posture — { posture, isField, isSpread, isDesk, orientation, canHover,
 * finePointer }. Updates on resize, orientation change, and pointer/hover changes
 * (a trackpad attaching to a tablet). SSR returns the DESK default.
 * @returns {ReturnType<typeof readPosture>}
 */
export default function usePosture() {
  return useSyncExternalStore(subscribeAll, getSnapshot, () => SSR_POSTURE);
}
