/**
 * debounce.js — Utility for debouncing function calls.
 */

/**
 * Returns a debounced version of the given function.
 * The function will only execute after `delay` ms of inactivity.
 */
export function debounce(fn, delay = 300) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

/**
 * Returns a throttled version of the given function with standard
 * leading-AND-trailing-edge semantics.
 *
 * The function fires immediately on the leading edge, then at most once per
 * `limit` ms. Crucially, if one or more calls arrive DURING a throttle window,
 * the most recent of those calls is invoked once on the trailing edge (when the
 * window closes) with its own arguments — so the final call in a burst is never
 * dropped. This matters for save/drag paths: a leading-edge-only throttle would
 * silently discard the last drag position or the final keystroke's save.
 *
 * `.cancel()` clears any pending trailing invocation and resets the window.
 *
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {number} [limit=300]
 * @returns {((...args: Parameters<F>) => void) & { cancel: () => void }}
 */
export function throttle(fn, limit = 300) {
  let timer = null;
  /** @type {Parameters<F> | null} */
  let trailingArgs = null;

  const invoke = (/** @type {Parameters<F>} */ args) => {
    fn(...args);
    // Open a window; when it closes, fire the trailing call if one is pending.
    timer = setTimeout(() => {
      timer = null;
      if (trailingArgs) {
        const pending = trailingArgs;
        trailingArgs = null;
        invoke(pending);
      }
    }, limit);
  };

  const throttled = (/** @type {Parameters<F>} */ ...args) => {
    if (timer === null) {
      // Leading edge — no active window, fire now.
      invoke(args);
    } else {
      // Inside the window — remember the latest args for the trailing edge.
      trailingArgs = args;
    }
  };

  throttled.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    trailingArgs = null;
  };

  return throttled;
}
