/**
 * Iterable weak subscriptions for process-wide reporters.
 *
 * A WeakMap alone cannot be iterated, while a normal Map strongly retains the
 * store key and its callback forever. This registry keeps an iterable set of
 * weak key/callback references plus a WeakMap replacement index. Live stores
 * hold their callbacks in a symbol lease; once a store and its lease become
 * unreachable, publish() prunes the dead entry without retaining either.
 *
 * The one-listener legacy API is intentionally separate. One-argument callers
 * historically installed one process-wide reporter, so a later legacy install
 * replaces only that reporter and remains strongly held until replaced/cleared.
 */

const noop = () => {};

function weakReference(value) {
  if (typeof globalThis.WeakRef === 'function') return new globalThis.WeakRef(value);
  // Old engines still get correct replacement/unsubscribe behavior. They cannot
  // provide collection-aware cleanup, so the explicit disposer remains the
  // fallback lifetime boundary.
  return { deref: () => value };
}

export function createWeakReporterRegistry(makeReference = weakReference) {
  const keyed = new WeakMap();
  const entries = new Set();
  let legacyReporter = null;

  const retire = entry => {
    if (!entry?.active) return;
    entry.active = false;
    entries.delete(entry);
  };

  const subscribe = (storeKey, reporter) => {
    if (
      (typeof storeKey !== 'object' || storeKey === null)
      && typeof storeKey !== 'function'
    ) {
      throw new TypeError('A keyed reporter subscription requires an object or function key');
    }

    const previous = keyed.get(storeKey);
    retire(previous);
    keyed.delete(storeKey);
    if (typeof reporter !== 'function') return noop;

    const entry = {
      active: true,
      keyRef: makeReference(storeKey),
      reporterRef: makeReference(reporter),
    };
    keyed.set(storeKey, entry);
    entries.add(entry);

    return () => {
      if (!entry.active) return;
      const liveKey = entry.keyRef.deref();
      retire(entry);
      if (liveKey && keyed.get(liveKey) === entry) keyed.delete(liveKey);
    };
  };

  const replaceLegacy = reporter => {
    legacyReporter = typeof reporter === 'function' ? reporter : null;
    const installed = legacyReporter;
    return () => {
      if (legacyReporter === installed) legacyReporter = null;
    };
  };

  const publish = (...args) => {
    if (legacyReporter) {
      try { legacyReporter(...args); } catch { /* reporting must never throw */ }
    }
    for (const entry of [...entries]) {
      const key = entry.keyRef.deref();
      const reporter = entry.reporterRef.deref();
      if (!entry.active || !key || !reporter) {
        retire(entry);
        if (key && keyed.get(key) === entry) keyed.delete(key);
        continue;
      }
      try { reporter(...args); } catch { /* reporting must never throw */ }
    }
  };

  return Object.freeze({ publish, replaceLegacy, subscribe });
}
