/**
 * hooks/useRoute.js - path-based routing for the App view machine.
 *
 * The app has ~18 destinations and a single navigation chokepoint (App's
 * `setView` / the `onNavigate` prop threaded into every panel). Rather than
 * pull in a router dependency, this hook syncs the existing `view` state
 * machine to the URL via the History API:
 *
 *   - `useRoute()` subscribes to location changes (popstate + our synthetic
 *     navigation event) and resolves the current URL to { view, params }.
 *   - `navigate(view, opts)` is the imperative entry point. It's signature-
 *     compatible with the old `setView(viewString)`, so existing call sites
 *     (`onNavigate('settlements')`, `setView('account')`) keep working - they
 *     just push a path now.
 *
 * pushState/replaceState do NOT emit popstate, so navigate() dispatches a
 * synthetic NAV_EVENT to wake same-tab subscribers. Back/Forward fire
 * popstate natively.
 *
 * See src/lib/routes.js for the (pure, unit-tested) path ↔ view table.
 */

import { useSyncExternalStore } from 'react';
import { resolveLocation, viewToPath, isSafeNextPath } from '../lib/routes.js';

const NAV_EVENT = 'sf:navigate';

function currentHref() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname + window.location.search + window.location.hash;
}

function subscribe(onChange) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', onChange);
  window.addEventListener(NAV_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(NAV_EVENT, onChange);
  };
}

function emit() {
  // Dispatched after a programmatic history change so useSyncExternalStore
  // subscribers in this tab re-read the location (pushState/replaceState
  // are silent by spec).
  window.dispatchEvent(new Event(NAV_EVENT));
}

/**
 * Imperative navigation. `view` is an internal view id - the same strings
 * App's render switch and nav arrays use.
 *
 * opts:
 *   - params  {object}  route params (e.g. { id } → /settlements/:id)
 *   - replace {boolean} replaceState instead of pushState (no history entry)
 *   - search  {string}  query string to append (include the leading '?')
 *   - hash    {string}  hash to append (include the leading '#')
 *   - scroll  {boolean} scroll to top after navigating (default true)
 */
export function navigate(view, opts = {}) {
  if (typeof window === 'undefined') return;
  const { params, replace = false, search = '', hash = '', scroll = true } = opts;
  const url = viewToPath(view, params) + search + hash;
  if (url === currentHref() && !replace) return; // don't stack identical entries
  if (replace) window.history.replaceState(window.history.state, '', url);
  else window.history.pushState(null, '', url);
  emit();
  if (scroll) window.scrollTo(0, 0);
}

/**
 * Navigate to a raw internal path (used for the post-auth `?next=` redirect,
 * where we have a path string rather than a view id). Unsafe / external
 * paths fall back to the default view, never an open redirect.
 */
export function navigatePath(path, opts = {}) {
  if (typeof window === 'undefined') return;
  if (!isSafeNextPath(path)) { navigate('generate', opts); return; }
  const { replace = false, scroll = true } = opts;
  if (replace) window.history.replaceState(window.history.state, '', path);
  else window.history.pushState(null, '', path);
  emit();
  if (scroll) window.scrollTo(0, 0);
}

/**
 * Rewrite the current URL in place with no new history entry and no scroll.
 * Used to silently upgrade legacy / root URLs to their canonical path.
 */
export function replacePath(url) {
  if (typeof window === 'undefined') return;
  window.history.replaceState(window.history.state, '', url);
  emit();
}

/**
 * Subscribe to the current route. Returns { view, params, notFound?, legacy? }.
 */
export function useRoute() {
  const href = useSyncExternalStore(subscribe, currentHref, () => '/');
  return resolveLocation(href);
}
