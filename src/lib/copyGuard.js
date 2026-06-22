/**
 * copyGuard.js — content-copy deterrent.
 *
 * Makes casual copying of the site's text harder: blocks the copy + cut
 * clipboard events and the right-click context menu, and disables text
 * selection site-wide (via the `copy-guard` class consumed in index.css).
 *
 * This is a DETERRENT, not security. The text still lives in the DOM — it has
 * to, to render and to stay readable by search crawlers and screen readers — so
 * a determined reader can always extract it through devtools, view-source,
 * reader mode, or by disabling JavaScript. The job here is narrow: stop the
 * casual select-and-copy so readers are nudged toward the sanctioned PDF export
 * and a premium account.
 *
 * Copying STILL works in these cases, so legitimate use is never broken:
 *   - form controls (input, textarea, select, [contenteditable]) — typing and
 *     editing depend on selection;
 *   - anything inside [data-allow-copy] — share links, slugs, codes, and a
 *     user's own data they legitimately need to copy;
 *   - elevated users (developer / admin) — operators keep full selection AND
 *     clipboard so they are never locked out of their own site.
 *
 * Dragstart is intentionally NOT blocked: the Realm map relies on native
 * drag-and-drop to place settlements, and a global dragstart block would break
 * it. Selection-disable plus the clipboard/contextmenu block already cover the
 * casual-copy paths.
 *
 * Gated by the `copyGuard` flag (default on). Idempotent; returns a teardown.
 */
import { useStore } from '../store/index.js';
import { flag } from './flags.js';

// Selection + clipboard stay enabled inside these. closest() walks ancestors,
// so a [data-allow-copy] wrapper exempts its whole subtree.
const ALLOW_SELECTOR =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], [data-allow-copy]';

const GUARDED_EVENTS = ['copy', 'cut', 'contextmenu'];

function isExemptTarget(target) {
  if (!target || typeof target.closest !== 'function') return false;
  return !!target.closest(ALLOW_SELECTOR);
}

// Operators (developer / admin) keep full copy so they can work on the site.
function isElevatedUser() {
  try { return useStore.getState().isElevated?.() === true; }
  catch { return false; }
}

let teardown = null;

/**
 * Install the copy guard once. No-op when the `copyGuard` flag is off, when
 * already installed, or outside a DOM (SSR/tests without jsdom).
 * @returns {(() => void) | undefined} teardown, or undefined if not installed
 */
export function installCopyGuard() {
  if (teardown) return teardown;
  if (typeof document === 'undefined') return undefined;
  if (!flag('copyGuard')) return undefined;

  const block = (e) => {
    if (isElevatedUser()) return;       // operators are exempt
    if (isExemptTarget(e.target)) return; // forms + opted-in nodes
    e.preventDefault();
  };

  // Capture phase so the guard wins ahead of any component-level handler.
  const opts = { capture: true };
  for (const type of GUARDED_EVENTS) document.addEventListener(type, block, opts);

  // The selection-disable class follows elevation too (operators keep
  // selection, not only the clipboard). Elevation resolves AFTER boot, so
  // re-evaluate whenever the role changes rather than only once at install.
  const syncSelectionClass = () => {
    document.documentElement.classList.toggle('copy-guard', !isElevatedUser());
  };
  syncSelectionClass();
  let unsubscribe = () => {};
  try {
    unsubscribe = useStore.subscribe(s => s.auth?.role, syncSelectionClass);
  } catch { /* store without subscribeWithSelector — class stays as synced */ }

  teardown = () => {
    for (const type of GUARDED_EVENTS) document.removeEventListener(type, block, opts);
    unsubscribe();
    document.documentElement.classList.remove('copy-guard');
    teardown = null;
  };
  return teardown;
}

/** Remove the guard if installed (test/teardown convenience). */
export function removeCopyGuard() { teardown?.(); }
