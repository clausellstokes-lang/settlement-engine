/**
 * components/nav/useChromeWidth.js: the page width the painted arrow is laid across.
 *
 * The arrow is sized from the document element's clientWidth, never from 100vw (which
 * includes a classic scrollbar, so an arrow sized in vw overflows sideways), plus the
 * SHORT_QUERY flag for landscape phones. Like hooks/useIsMobile.js this is ONE shared
 * external store read through useSyncExternalStore: the listeners attach when the first
 * subscriber arrives and detach when the last one leaves, so any number of readers costs one
 * ResizeObserver.
 *
 *   - A ResizeObserver on the document element catches every width change, including a
 *     scrollbar appearing when a page grows (guarded: jsdom and old engines have none).
 *   - A window resize listener is the fallback where there is no ResizeObserver.
 *   - A matchMedia listener on SHORT_QUERY tracks the landscape-phone flag.
 *
 * Nothing touches window or document at module load, so the module imports cleanly in node.
 * The snapshot object is replaced only when a value changes, so React sees a stable
 * reference between changes. While subscribed, a render reads the cached snapshot rather
 * than forcing a layout read.
 */
import { useSyncExternalStore } from 'react';
import { SHORT_QUERY } from './arrowGeometry.js';

/** The width assumed where there is no document (or the document reports 0). */
export const CHROME_WIDTH_FALLBACK = 1024;

/** @typedef {{ clientWidth: number, short: boolean }} ChromeWidth */

/** @type {ChromeWidth} */
const SERVER_SNAPSHOT = Object.freeze({ clientWidth: CHROME_WIDTH_FALLBACK, short: false });

/** @type {Set<() => void>} */
const subscribers = new Set();

/** @type {ChromeWidth} */
let snapshot = SERVER_SNAPSHOT;

/** @type {MediaQueryList | null} */
let shortQuery = null;

/** @type {null | (() => void)} */
let detach = null;

/**
 * Read the live values and return the snapshot, replaced only if a value changed.
 * @returns {ChromeWidth}
 */
export function readChromeWidth() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return SERVER_SNAPSHOT;
  const root = document.documentElement;
  const clientWidth = (root && root.clientWidth) || window.innerWidth || CHROME_WIDTH_FALLBACK;
  const query = shortQuery
    || (typeof window.matchMedia === 'function' ? window.matchMedia(SHORT_QUERY) : null);
  const short = Boolean(query && query.matches);
  if (clientWidth !== snapshot.clientWidth || short !== snapshot.short) {
    snapshot = { clientWidth, short };
  }
  return snapshot;
}

function update() {
  const before = snapshot;
  if (readChromeWidth() !== before) subscribers.forEach((notify) => notify());
}

function attach() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  shortQuery = typeof window.matchMedia === 'function' ? window.matchMedia(SHORT_QUERY) : null;
  /** @type {ResizeObserver | null} */
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
  if (observer) observer.observe(document.documentElement);
  else window.addEventListener('resize', update);
  const query = shortQuery;
  if (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', update);
    else if (typeof query.addListener === 'function') query.addListener(update); // older Safari
  }
  // A width change between the first render and this subscription lands now; React re-reads
  // the snapshot after subscribing and re-renders if it moved.
  update();
  return () => {
    if (observer) observer.disconnect();
    else window.removeEventListener('resize', update);
    if (query) {
      if (typeof query.removeEventListener === 'function') query.removeEventListener('change', update);
      else if (typeof query.removeListener === 'function') query.removeListener(update);
    }
    shortQuery = null;
  };
}

/**
 * @param {() => void} notify
 * @returns {() => void}
 */
export function subscribeChromeWidth(notify) {
  subscribers.add(notify);
  if (!detach) detach = attach();
  return () => {
    subscribers.delete(notify);
    if (subscribers.size === 0 && detach) {
      detach();
      detach = null;
    }
  };
}

/** @returns {ChromeWidth} */
function getSnapshot() {
  return detach ? snapshot : readChromeWidth();
}

/** @returns {ChromeWidth} */
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

/**
 * The page's clientWidth and the short-viewport flag, re-rendering when either changes.
 * @returns {ChromeWidth}
 */
export default function useChromeWidth() {
  return useSyncExternalStore(subscribeChromeWidth, getSnapshot, getServerSnapshot);
}
