/**
 * staleDeploy.js - recovery for a tab left open across a deploy.
 *
 * THE DEFECT THIS CURES (2026-09-16). Every production build renames its lazy
 * chunks, and the previous build's files stop being served (they 404). A tab
 * opened before a deploy keeps the old entry chunk in memory, so the first lazy
 * load it attempts afterwards fails. The route boundary in App.jsx already
 * catches a lazily loaded PAGE that fails ("This page couldn't be loaded"), but
 * a lazy load started by an ACTION does not render through that boundary: the
 * Generate button's engine load surfaced as "The forge stalled before your
 * settlement took shape", and a retry fails the same way until a reload.
 *
 * Two shapes reach us, and both are handled:
 *   - Vite's preload helper wraps most dynamic imports and dispatches a
 *     cancelable `vite:preloadError` event on window before rethrowing. We never
 *     cancel it: the caller still sees its error and keeps its own message.
 *   - About a third of the imports in the entry chunk are raw `import()` calls
 *     (measured on the live 743779742 build: 66 wrapped, 33 raw, the engine among
 *     both). Those only reject. A caller that catches one hands it to
 *     `recoverFromChunkError`; one that does not surfaces as `unhandledrejection`.
 *
 * A chunk failure is not proof of a deploy: a dropped connection looks the same.
 * So before acting we fetch the live `index.html` (no-store) and compare the entry
 * chunk it references with the one this tab is running. Only a CHANGED entry
 * counts; an unreachable server, a non-HTML answer or the same entry does nothing.
 *
 * THE RELOAD IS WITHHELD WHENEVER WORK IS ON SCREEN. Generated worlds are not
 * persisted locally (store/persistProjection.js excludes them by construction),
 * so reloading over an unsaved settlement would destroy it. With work on screen
 * the notice asks the user to reload when ready instead. A reload that did not
 * cure the staleness (the same target again within the guard window) falls back
 * to the notice as well, so a mis-served CDN can never loop the page.
 *
 * Zero eager cost beyond this file: no imports, and nothing runs until a lazy
 * load actually fails. It must stay eager, because a recovery module that is
 * itself lazy would be one more chunk the stale tab cannot load.
 */

/** The window event the notice component listens for. */
export const STALE_DEPLOY_EVENT = 'sf:stale-deploy';

/** sessionStorage key of the last automatic reload: `{ target, at }`. */
export const RELOAD_GUARD_KEY = 'sf.staleDeploy.reload';

/** A second stale failure for the same target inside this window shows the notice. */
export const RELOAD_GUARD_MS = 5 * 60 * 1000;

/** A negative check is trusted for this long before the server is asked again. */
export const NEGATIVE_CHECK_TTL_MS = 15 * 1000;

/**
 * The failure texts of a module script that could not be fetched, per engine.
 * Chromium, Firefox and WebKit each word it differently; Vite's preload helper
 * adds its CSS variant; and a host whose SPA fallback answers a missing chunk
 * with index.html fails on the MIME type instead of a 404.
 */
const CHUNK_ERROR_PATTERNS = Object.freeze([
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Unable to preload CSS for/i,
  /is not a valid JavaScript MIME type/i,
]);

/**
 * True when the error is a lazy chunk that could not be loaded.
 * @param {unknown} error
 * @returns {boolean}
 */
export function isChunkLoadError(error) {
  if (error == null) return false;
  const message = typeof error === 'string'
    ? error
    : String((/** @type {{ message?: unknown }} */ (error)).message ?? '');
  if (!message) return false;
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

const ENTRY_FILE = /\/assets\/(index-[A-Za-z0-9_-]+\.js)/;

/**
 * The entry chunk file name a page references (`index-<hash>.js`), or null.
 * Development serves `/src/main.jsx`, which has no hashed entry, so the whole
 * mechanism stands down there.
 * @param {string} html
 * @returns {string | null}
 */
export function entryFileInHtml(html) {
  const scripts = String(html || '').match(/<script\b[^>]*\btype=["']module["'][^>]*>/gi) || [];
  for (const tag of scripts) {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i);
    const file = src && src[1].match(ENTRY_FILE);
    if (file) return file[1];
  }
  return null;
}

/**
 * The entry chunk this tab is running, read from the document it booted from.
 * @param {Document | undefined} doc
 * @returns {string | null}
 */
export function runningEntryFile(doc) {
  if (!doc || typeof doc.querySelectorAll !== 'function') return null;
  for (const script of doc.querySelectorAll('script[type="module"][src]')) {
    const file = String(script.getAttribute('src') || '').match(ENTRY_FILE);
    if (file) return file[1];
  }
  return null;
}

/**
 * What to do about a confirmed or unconfirmed stale deploy. Pure.
 * @param {{ running: string | null, served: string | null, workOnScreen: boolean, lastReload: { target?: string, at?: number } | null, now: number }} facts
 * @returns {'none' | 'reload' | 'notice'}
 */
export function decideRecovery({ running, served, workOnScreen, lastReload, now }) {
  if (!running || !served || running === served) return 'none';
  if (workOnScreen) return 'notice';
  const reloadedForThis = Boolean(lastReload)
    && lastReload.target === served
    && Number.isFinite(lastReload.at)
    && now - lastReload.at < RELOAD_GUARD_MS;
  return reloadedForThis ? 'notice' : 'reload';
}

/**
 * Build a recovery bound to its environment. The default export at the bottom
 * binds the browser; tests bind fakes.
 * @param {{
 *   win: Window | undefined,
 *   fetchImpl?: typeof fetch,
 *   hasWorkOnScreen?: () => boolean,
 *   now?: () => number,
 * }} env
 */
export function createStaleDeployRecovery(env) {
  const { win } = env;
  const fetchImpl = env.fetchImpl || (win && typeof win.fetch === 'function' ? win.fetch.bind(win) : null);
  const now = env.now || (() => Date.now());
  let hasWorkOnScreen = env.hasWorkOnScreen || (() => true);
  /** @type {Promise<'none' | 'reload' | 'notice'> | null} */
  let inflight = null;
  /** @type {'reload' | 'notice' | null} */
  let settled = null;
  let negativeAt = -Infinity;
  let noticeShown = false;

  const readGuard = () => {
    try {
      const raw = win && win.sessionStorage ? win.sessionStorage.getItem(RELOAD_GUARD_KEY) : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const writeGuard = (target) => {
    try {
      if (win && win.sessionStorage) {
        win.sessionStorage.setItem(RELOAD_GUARD_KEY, JSON.stringify({ target, at: now() }));
      }
    } catch { /* storage refused: the notice path still protects against a loop */ }
  };
  const showNotice = () => {
    noticeShown = true;
    try { win.dispatchEvent(new CustomEvent(STALE_DEPLOY_EVENT)); } catch { /* no DOM */ }
  };

  const servedEntryFile = async () => {
    if (!fetchImpl) return null;
    try {
      const response = await fetchImpl('/', { cache: 'no-store', credentials: 'same-origin' });
      if (!response || !response.ok) return null;
      return entryFileInHtml(await response.text());
    } catch {
      return null;
    }
  };

  const check = async () => {
    const running = runningEntryFile(win && win.document);
    if (!running) return 'none';
    const served = await servedEntryFile();
    // A predicate that throws is treated as work on screen: never reload blind.
    const workOnScreen = (() => {
      try { return hasWorkOnScreen() !== false; } catch { return true; }
    })();
    const action = decideRecovery({ running, served, workOnScreen, lastReload: readGuard(), now: now() });
    if (action === 'reload') {
      writeGuard(served);
      try { win.location.reload(); } catch { showNotice(); return 'notice'; }
    } else if (action === 'notice') {
      showNotice();
    }
    return action;
  };

  /**
   * Hand any caught error here. Resolves to what was done: 'none' when it was not
   * a chunk failure or no new deploy is live, 'reload' or 'notice' otherwise.
   * Concurrent failures share one check, and a reload or notice is never repeated.
   * @param {unknown} error
   * @returns {Promise<'none' | 'reload' | 'notice'>}
   */
  const recover = (error) => {
    if (!win || !isChunkLoadError(error)) return Promise.resolve('none');
    if (settled) return Promise.resolve(settled);
    if (inflight) return inflight;
    if (now() - negativeAt < NEGATIVE_CHECK_TTL_MS) return Promise.resolve('none');
    inflight = check()
      .then((action) => {
        if (action === 'none') negativeAt = now();
        else settled = action;
        return action;
      })
      .catch(() => /** @type {'none'} */ ('none'))
      .finally(() => { inflight = null; });
    return inflight;
  };

  /**
   * Listen for failures nobody caught. Idempotent per recovery instance.
   * @param {{ hasWorkOnScreen?: () => boolean }} [options]
   */
  let installed = false;
  const install = (options = {}) => {
    if (typeof options.hasWorkOnScreen === 'function') hasWorkOnScreen = options.hasWorkOnScreen;
    if (installed || !win || typeof win.addEventListener !== 'function') return;
    installed = true;
    win.addEventListener('vite:preloadError', (event) => {
      // Vite's helper attaches the import error as `payload` on a plain Event.
      recover(event && /** @type {Event & { payload?: unknown }} */ (event).payload);
    });
    win.addEventListener('unhandledrejection', (event) => { recover(event && event.reason); });
  };

  return {
    recover,
    install,
    isNoticeShown: () => noticeShown,
  };
}

const browserRecovery = createStaleDeployRecovery({
  win: typeof window === 'undefined' ? undefined : window,
});

/** Install the window listeners (main.jsx, once, before render). */
export const installStaleDeployRecovery = browserRecovery.install;

/** Hand a caught error to the recovery (for callers that show their own message). */
export const recoverFromChunkError = browserRecovery.recover;

/** Whether the notice has been raised, for a notice that mounts after the event. */
export const isStaleDeployNoticeShown = browserRecovery.isNoticeShown;
