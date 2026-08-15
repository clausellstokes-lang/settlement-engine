/**
 * Cross-document exclusion for browser-local read/modify/write authorities.
 *
 * `localStorage.setItem()` is atomic, but a load/compare/write transaction is
 * not. Web Locks serialize same-origin tabs, workers, and windows. IndexedDB
 * read/write transactions provide the same exclusion in browsers without Web
 * Locks, while a process queue preserves ordering in tests, SSR, and other
 * non-browser runtimes.
 *
 * Critical sections must remain synchronous. Local authorities perform no
 * network work, and an arbitrary await would let the IndexedDB transaction
 * close before its protected localStorage write.
 */

const LOCK_DATABASE = 'settlementforge-local-authority';
// Kept for compatibility with the v1 database created by the original
// custom-content-only mutex. The values are harmless lock turn markers.
const LOCK_STORE = 'custom-content-ledger-locks';
const LOCK_PREFIX = 'settlementforge:';

/** @type {Map<string, Promise<void>>} */
const processTails = new Map();

/** @type {Promise<IDBDatabase>|null} */
let databasePromise = null;

/**
 * @template T
 * @param {() => T} criticalSection
 * @returns {T}
 */
function runSynchronous(criticalSection) {
  const result = criticalSection();
  if (
    result
    && typeof result === 'object'
    && typeof /** @type {{then?:unknown}} */ (result).then === 'function'
  ) {
    throw new TypeError(
      'A local authority critical section must be synchronous.',
    );
  }
  return result;
}

/** @returns {Promise<IDBDatabase>} */
function openLockDatabase() {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCK_DATABASE, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(LOCK_STORE)) {
        database.createObjectStore(LOCK_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(
      request.error
      || new Error('The local authority lock database failed to open.'),
    );
    request.onblocked = () => reject(
      new Error('The local authority lock database upgrade is blocked.'),
    );
  }).catch((error) => {
    databasePromise = null;
    throw error;
  });
  return databasePromise;
}

/**
 * @template T
 * @param {string[]} names
 * @param {() => T} criticalSection
 * @returns {Promise<T>}
 */
async function withIndexedDbLocks(names, criticalSection) {
  const database = await openLockDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCK_STORE, 'readwrite');
    const store = transaction.objectStore(LOCK_STORE);
    const requests = names.map(name => store.get(name));
    /** @type {T|undefined} */
    let result;
    let entered = false;
    let remaining = requests.length;

    for (const request of requests) {
      request.onsuccess = () => {
        remaining -= 1;
        if (remaining !== 0) return;
        try {
          result = runSynchronous(criticalSection);
          entered = true;
        } catch (error) {
          transaction.abort();
          reject(error);
        }
      };
      request.onerror = () => reject(
        request.error
        || new Error('The local authority lock request failed.'),
      );
    }
    transaction.oncomplete = () => {
      if (entered) resolve(/** @type {T} */ (result));
    };
    transaction.onerror = () => {
      if (!entered) {
        reject(
          transaction.error
          || new Error('The local authority lock transaction failed.'),
        );
      }
    };
    transaction.onabort = () => {
      if (!entered && transaction.error) reject(transaction.error);
    };
  });
}

/**
 * @template T
 * @param {string[]} names
 * @param {() => T} criticalSection
 * @returns {Promise<T>}
 */
async function withBrowserLocks(names, criticalSection) {
  const lockManager = globalThis.navigator?.locks;
  if (typeof lockManager?.request === 'function') {
    // Keep exceptions inside the lock callback. Some Web Locks implementations
    // can strand a lock name when the callback promise rejects; returning an
    // outcome releases the lock normally, after which the original exception
    // can be rethrown without poisoning subsequent authority operations.
    const enterCriticalSection = () => {
      try {
        return {
          ok: true,
          value: runSynchronous(criticalSection),
        };
      } catch (error) {
        return { ok: false, error };
      }
    };
    const acquire = index => (
      index >= names.length
        ? enterCriticalSection()
        : lockManager.request(
            names[index],
            { mode: 'exclusive' },
            () => acquire(index + 1),
          )
    );
    const outcome = await acquire(0);
    if (!outcome.ok) throw outcome.error;
    return outcome.value;
  }
  if (typeof globalThis.indexedDB !== 'undefined') {
    return withIndexedDbLocks(names, criticalSection);
  }
  return runSynchronous(criticalSection);
}

function lockSegment(value, field) {
  const segment = String(value || '').trim();
  if (
    !segment
    || segment.length > 500
    || segment.includes('\0')
    || segment.includes('\r')
    || segment.includes('\n')
  ) {
    throw new TypeError(`${field} is invalid.`);
  }
  return segment;
}

/**
 * Run one synchronous local-authority transaction after every earlier
 * transaction for any requested namespace identity.
 *
 * @template T
 * @param {unknown} namespace
 * @param {unknown[]} identities
 * @param {() => T} criticalSection
 * @returns {Promise<T>}
 */
export async function withLocalAuthorityLocks(
  namespace,
  identities,
  criticalSection,
) {
  if (typeof criticalSection !== 'function') {
    throw new TypeError('A local authority critical section is required.');
  }
  if (!Array.isArray(identities) || identities.length === 0) {
    throw new TypeError('At least one local authority identity is required.');
  }
  const prefix = `${LOCK_PREFIX}${lockSegment(
    namespace,
    'Local authority namespace',
  )}:`;
  const names = [...new Set(identities.map(identity => (
    `${prefix}${lockSegment(identity, 'Local authority identity')}`
  )))].sort();
  const predecessors = names.map(
    name => processTails.get(name) || Promise.resolve(),
  );
  /** @type {() => void} */
  let release = () => {};
  /** @type {Promise<void>} */
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const predecessor = Promise.all(predecessors.map(promise => (
    promise.catch(() => {})
  )));
  const tail = predecessor.then(() => gate);
  for (const name of names) processTails.set(name, tail);

  await predecessor;
  try {
    return await withBrowserLocks(names, criticalSection);
  } finally {
    release();
    await tail;
    for (const name of names) {
      if (processTails.get(name) === tail) processTails.delete(name);
    }
  }
}

/**
 * Backward-compatible single-authority convenience wrapper.
 *
 * @template T
 * @param {unknown} namespace
 * @param {unknown} identity
 * @param {() => T} criticalSection
 * @returns {Promise<T>}
 */
export function withLocalAuthorityLock(
  namespace,
  identity,
  criticalSection,
) {
  return withLocalAuthorityLocks(namespace, [identity], criticalSection);
}
