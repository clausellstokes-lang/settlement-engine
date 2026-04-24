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
 * Returns a throttled version of the given function.
 * The function will execute at most once per `limit` ms.
 */
export function throttle(fn, limit = 300) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}
