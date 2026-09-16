/**
 * staleDeploy.test.js - the stale-deploy recovery (src/lib/staleDeploy.js).
 *
 * The defect: a tab left open across a deploy fails its next lazy load, and an
 * action-started load (the Generate button) surfaced as "The forge stalled". The
 * recovery must (1) recognise a chunk failure in every engine's wording, (2) act
 * only when the live index.html names a DIFFERENT entry chunk, (3) never reload
 * over work on screen (generated worlds are not persisted locally), and (4) never
 * loop. Each arm below has a control that fails if the guard it pins is removed.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  RELOAD_GUARD_KEY,
  RELOAD_GUARD_MS,
  NEGATIVE_CHECK_TTL_MS,
  STALE_DEPLOY_EVENT,
  createStaleDeployRecovery,
  decideRecovery,
  entryFileInHtml,
  isChunkLoadError,
  runningEntryFile,
} from '../../src/lib/staleDeploy.js';

const RUNNING = 'index-oYqJ-rHz.js';
const NEXT = 'index-Z9x8Y7w6.js';

// The shape Vite emits, attribute order included (crossorigin before src).
const htmlFor = (entry) => [
  '<!doctype html><html><head>',
  `<script type="module" crossorigin src="/assets/${entry}"></script>`,
  '<link rel="modulepreload" crossorigin href="/assets/vendor-react-1ny_Qquz.js">',
  '</head><body><div id="root"></div></body></html>',
].join('\n');

function fakeDoc(entry) {
  return {
    querySelectorAll: () => (entry
      ? [{ getAttribute: (name) => (name === 'src' ? `/assets/${entry}` : null) }]
      : []),
  };
}

function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    map,
  };
}

function fakeWin({ entry = RUNNING, storage = fakeStorage() } = {}) {
  const target = new EventTarget();
  return {
    document: fakeDoc(entry),
    sessionStorage: storage,
    location: { reload: vi.fn() },
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    CustomEvent,
  };
}

const htmlResponse = (entry) => ({ ok: true, text: async () => htmlFor(entry) });
const chunkError = () => new TypeError(
  'Failed to fetch dynamically imported module: https://settlementforge.com/assets/engine-Xo8AF_Nn.js',
);

describe('isChunkLoadError: every engine wording, and nothing else', () => {
  it('recognises the Chromium, Firefox, WebKit, Vite CSS and SPA-fallback wordings', () => {
    // One named test looping over the rows (a generated `each` title would park this file in
    // the lighting census, whose each-family park debt may only shrink); fails by engine name.
    const WORDINGS = [
      ['Chromium', 'Failed to fetch dynamically imported module: https://x/assets/a-1.js'],
      ['Firefox', 'error loading dynamically imported module: https://x/assets/a-1.js'],
      ['WebKit', 'Importing a module script failed.'],
      ['Vite CSS preload', 'Unable to preload CSS for /assets/a-1.css'],
      ['SPA fallback MIME', "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of \"text/html\". 'text/html' is not a valid JavaScript MIME type."],
    ];
    for (const [engine, message] of WORDINGS) {
      expect(isChunkLoadError(new TypeError(message)), engine).toBe(true);
      expect(isChunkLoadError(message), engine).toBe(true);
    }
  });

  it('refuses ordinary failures, empties and non-errors', () => {
    expect(isChunkLoadError(new Error('Generation completed without a settlement.'))).toBe(false);
    expect(isChunkLoadError(new TypeError('Failed to fetch'))).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
    expect(isChunkLoadError({})).toBe(false);
    expect(isChunkLoadError('')).toBe(false);
  });
});

describe('the entry chunk: served and running', () => {
  it('reads the module entry from a Vite index.html and ignores preload links', () => {
    expect(entryFileInHtml(htmlFor(NEXT))).toBe(NEXT);
    expect(entryFileInHtml("<script type='module' src='/assets/index-A_b-1.js'></script>")).toBe('index-A_b-1.js');
  });

  it('stands down on a dev page, a non-module script or garbage', () => {
    expect(entryFileInHtml('<script type="module" src="/src/main.jsx"></script>')).toBe(null);
    expect(entryFileInHtml('<script src="/assets/index-abc.js"></script>')).toBe(null);
    expect(entryFileInHtml('<link rel="modulepreload" href="/assets/index-abc.js">')).toBe(null);
    expect(entryFileInHtml(undefined)).toBe(null);
  });

  it('reads the running entry from the booted document', () => {
    expect(runningEntryFile(fakeDoc(RUNNING))).toBe(RUNNING);
    expect(runningEntryFile(fakeDoc(null))).toBe(null);
    expect(runningEntryFile(undefined)).toBe(null);
  });
});

describe('decideRecovery: the table', () => {
  const base = { running: RUNNING, served: NEXT, workOnScreen: false, lastReload: null, now: 10_000_000 };

  it('does nothing unless a DIFFERENT entry is served', () => {
    expect(decideRecovery({ ...base, served: RUNNING })).toBe('none');
    expect(decideRecovery({ ...base, served: null })).toBe('none');
    expect(decideRecovery({ ...base, running: null })).toBe('none');
  });

  it('reloads a changed deploy only with nothing on screen', () => {
    expect(decideRecovery(base)).toBe('reload');
    expect(decideRecovery({ ...base, workOnScreen: true })).toBe('notice');
  });

  it('never reloads twice for the same target inside the guard window', () => {
    const recent = { target: NEXT, at: base.now - 1000 };
    expect(decideRecovery({ ...base, lastReload: recent })).toBe('notice');
    expect(decideRecovery({ ...base, lastReload: { target: NEXT, at: base.now - RELOAD_GUARD_MS - 1 } })).toBe('reload');
    expect(decideRecovery({ ...base, lastReload: { target: 'index-older.js', at: base.now - 1000 } })).toBe('reload');
    expect(decideRecovery({ ...base, lastReload: { target: NEXT, at: 'soon' } })).toBe('reload');
  });
});

describe('createStaleDeployRecovery: the orchestration', () => {
  it('ignores a non-chunk error without asking the server', async () => {
    const win = fakeWin();
    const fetchImpl = vi.fn();
    const r = createStaleDeployRecovery({ win, fetchImpl, hasWorkOnScreen: () => false });
    expect(await r.recover(new Error('engine unavailable'))).toBe('none');
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(win.location.reload).not.toHaveBeenCalled();
  });

  it('reloads once when a new deploy is live and nothing is on screen, and writes the guard', async () => {
    const storage = fakeStorage();
    const win = fakeWin({ storage });
    const fetchImpl = vi.fn(async () => htmlResponse(NEXT));
    const r = createStaleDeployRecovery({ win, fetchImpl, hasWorkOnScreen: () => false, now: () => 5000 });
    expect(await r.recover(chunkError())).toBe('reload');
    expect(win.location.reload).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.getItem(RELOAD_GUARD_KEY))).toEqual({ target: NEXT, at: 5000 });
    expect(fetchImpl).toHaveBeenCalledWith('/', { cache: 'no-store', credentials: 'same-origin' });
    // Settled: a later failure repeats nothing.
    expect(await r.recover(chunkError())).toBe('reload');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(win.location.reload).toHaveBeenCalledTimes(1);
  });

  it('raises the notice instead of reloading over work on screen', async () => {
    const win = fakeWin();
    const seen = vi.fn();
    win.addEventListener(STALE_DEPLOY_EVENT, seen);
    const r = createStaleDeployRecovery({ win, fetchImpl: async () => htmlResponse(NEXT), hasWorkOnScreen: () => true });
    expect(r.isNoticeShown()).toBe(false);
    expect(await r.recover(chunkError())).toBe('notice');
    expect(win.location.reload).not.toHaveBeenCalled();
    expect(seen).toHaveBeenCalledTimes(1);
    expect(r.isNoticeShown()).toBe(true);
    expect(await r.recover(chunkError())).toBe('notice');
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('treats a throwing work predicate as work on screen (never reload blind)', async () => {
    const win = fakeWin();
    const r = createStaleDeployRecovery({
      win,
      fetchImpl: async () => htmlResponse(NEXT),
      hasWorkOnScreen: () => { throw new Error('store not ready'); },
    });
    expect(await r.recover(chunkError())).toBe('notice');
    expect(win.location.reload).not.toHaveBeenCalled();
  });

  it('does nothing when the same build is still served (a dropped connection, not a deploy)', async () => {
    const win = fakeWin();
    const r = createStaleDeployRecovery({ win, fetchImpl: async () => htmlResponse(RUNNING), hasWorkOnScreen: () => false });
    expect(await r.recover(chunkError())).toBe('none');
    expect(win.location.reload).not.toHaveBeenCalled();
  });

  it('does nothing offline or on a bad answer, and does not hammer the server', async () => {
    let clock = 0;
    const win = fakeWin();
    const fetchImpl = vi.fn(async () => { throw new TypeError('Failed to fetch'); });
    const r = createStaleDeployRecovery({ win, fetchImpl, hasWorkOnScreen: () => false, now: () => clock });
    expect(await r.recover(chunkError())).toBe('none');
    clock += NEGATIVE_CHECK_TTL_MS - 1;
    expect(await r.recover(chunkError())).toBe('none');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    clock += 2;
    fetchImpl.mockImplementation(async () => ({ ok: false, text: async () => '' }));
    expect(await r.recover(chunkError())).toBe('none');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(win.location.reload).not.toHaveBeenCalled();
  });

  it('shares one check between concurrent failures', async () => {
    const win = fakeWin();
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    const fetchImpl = vi.fn(async () => { await gate; return htmlResponse(NEXT); });
    const r = createStaleDeployRecovery({ win, fetchImpl, hasWorkOnScreen: () => false });
    const a = r.recover(chunkError());
    const b = r.recover(chunkError());
    release();
    expect(await a).toBe('reload');
    expect(await b).toBe('reload');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(win.location.reload).toHaveBeenCalledTimes(1);
  });

  it('shows the notice when a reload for the same target already failed to cure it (no loop)', async () => {
    const storage = fakeStorage({ [RELOAD_GUARD_KEY]: JSON.stringify({ target: NEXT, at: 1000 }) });
    const win = fakeWin({ storage });
    const r = createStaleDeployRecovery({ win, fetchImpl: async () => htmlResponse(NEXT), hasWorkOnScreen: () => false, now: () => 2000 });
    expect(await r.recover(chunkError())).toBe('notice');
    expect(win.location.reload).not.toHaveBeenCalled();
  });

  it('falls back to the notice if the reload itself throws', async () => {
    const win = fakeWin();
    win.location.reload = vi.fn(() => { throw new Error('blocked'); });
    const r = createStaleDeployRecovery({ win, fetchImpl: async () => htmlResponse(NEXT), hasWorkOnScreen: () => false });
    expect(await r.recover(chunkError())).toBe('notice');
    expect(r.isNoticeShown()).toBe(true);
  });

  it('stands down on a page with no hashed entry (development) and without a window', async () => {
    const devWin = fakeWin({ entry: null });
    const fetchImpl = vi.fn(async () => htmlResponse(NEXT));
    expect(await createStaleDeployRecovery({ win: devWin, fetchImpl, hasWorkOnScreen: () => false }).recover(chunkError())).toBe('none');
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(await createStaleDeployRecovery({ win: undefined, fetchImpl }).recover(chunkError())).toBe('none');
  });

  it('install listens for vite:preloadError and unhandledrejection, once, and never cancels the event', async () => {
    const win = fakeWin();
    const fetchImpl = vi.fn(async () => htmlResponse(NEXT));
    const r = createStaleDeployRecovery({ win, fetchImpl });
    r.install({ hasWorkOnScreen: () => true });
    r.install({ hasWorkOnScreen: () => true });

    const preload = new Event('vite:preloadError', { cancelable: true });
    preload.payload = chunkError();
    win.dispatchEvent(preload);
    expect(preload.defaultPrevented).toBe(false);
    await vi.waitFor(() => expect(r.isNoticeShown()).toBe(true));
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    const rejection = new Event('unhandledrejection');
    rejection.reason = chunkError();
    win.dispatchEvent(rejection);
    await Promise.resolve();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('install routes an uncaught rejection on its own', async () => {
    const win = fakeWin();
    const r = createStaleDeployRecovery({ win, fetchImpl: async () => htmlResponse(NEXT) });
    r.install({ hasWorkOnScreen: () => false });
    const rejection = new Event('unhandledrejection');
    rejection.reason = chunkError();
    win.dispatchEvent(rejection);
    await vi.waitFor(() => expect(win.location.reload).toHaveBeenCalledTimes(1));
  });

  it('the default work predicate is conservative (no install options means never reload)', async () => {
    const win = fakeWin();
    const r = createStaleDeployRecovery({ win, fetchImpl: async () => htmlResponse(NEXT) });
    expect(await r.recover(chunkError())).toBe('notice');
    expect(win.location.reload).not.toHaveBeenCalled();
  });
});
