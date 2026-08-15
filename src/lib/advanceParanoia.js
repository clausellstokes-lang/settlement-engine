/**
 * advanceParanoia.js — R-18 WORKER PARANOIA MODE.
 *
 * Continuous, dev-only self-verification of the worker↔sync determinism claim that
 * V-8's byte-identity pin asserts once: with the paranoia flag on, EVERY Web Worker
 * advance is re-run in-thread and the two worldStates are diffed. A divergence means
 * the thread boundary broke determinism in the field — a constitutional crisis
 * (A+ bar 11) — so it is surfaced loudly through the R-14 error pipeline.
 *
 * THE GATE IS STRUCTURAL, not honor-system: paranoiaEnabled() ANDs the flag with
 * `import.meta.env.DEV`, which Vite replaces with the literal `false` in production
 * builds — so the second advance + the diff are dead code in prod REGARDLESS of the
 * flag's value. Off, the whole thing is byte-neutral: one flag read, no second run.
 *
 * @enforced-by tests/lib/advanceParanoia.test.js (the gate + the diff).
 */

import { flag } from './flags.js';
import { reportError } from './errorReporter.js';

export const PARANOIA_FLAG = 'advanceWorkerParanoia';

/**
 * The gate: dev-only AND flag-on. `import.meta.env.DEV` is a build-time constant —
 * `false` in every production bundle — so this can only be true in dev/test.
 * @returns {boolean}
 */
export function paranoiaEnabled() {
  try {
    const isDev = !!(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV);
    return isDev && flag(PARANOIA_FLAG) === true;
  } catch {
    return false;
  }
}

/**
 * The first structural divergence between two values, as a dotted path + a short
 * reason — or null if they are deep-equal. Deterministic key ordering (sorted) so
 * the reported path is stable. Bounded description; NEVER emits values that could
 * carry world state / PII (only the path and a type/length reason — the R-14 law).
 * @param {unknown} a @param {unknown} b @param {string} [path]
 * @returns {string|null}
 */
export function firstDivergence(a, b, path = 'worldState') {
  if (a === b) return null;
  const ta = typeOf(a);
  const tb = typeOf(b);
  if (ta !== tb) return `${path}: type ${ta} ≠ ${tb}`;
  if (ta === 'array') {
    const arrA = /** @type {unknown[]} */ (a);
    const arrB = /** @type {unknown[]} */ (b);
    if (arrA.length !== arrB.length) return `${path}: length ${arrA.length} ≠ ${arrB.length}`;
    for (let i = 0; i < arrA.length; i++) {
      const d = firstDivergence(arrA[i], arrB[i], `${path}[${i}]`);
      if (d) return d;
    }
    return null;
  }
  if (ta === 'object') {
    const objA = /** @type {Record<string, unknown>} */ (a);
    const objB = /** @type {Record<string, unknown>} */ (b);
    const ka = Object.keys(objA).sort();
    const kb = Object.keys(objB).sort();
    if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) {
      const onlyA = ka.filter((k) => !(k in objB));
      const onlyB = kb.filter((k) => !(k in objA));
      return `${path}: keys differ (+${JSON.stringify(onlyA)} / -${JSON.stringify(onlyB)})`;
    }
    for (const k of ka) {
      const d = firstDivergence(objA[k], objB[k], `${path}.${k}`);
      if (d) return d;
    }
    return null;
  }
  // Primitives that were not === (covers NaN-vs-number, 1-vs-'1', etc.).
  return `${path}: primitive differs (${briefPrimitive(a)} ≠ ${briefPrimitive(b)})`;
}

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v === 'object' ? 'object' : typeof v;
}

// A short, non-leaky rendering of a primitive for the divergence message.
function briefPrimitive(v) {
  if (typeof v === 'string') return `str(len ${v.length})`;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return typeOf(v);
}

/**
 * If paranoia is enabled, re-run the advance in-thread and diff its worldState
 * against the worker's. Reports any divergence through the R-14 pipeline. A no-op
 * (returns null, never invokes runSync) when the gate is closed — the byte-neutral
 * production/flag-off path. Never throws into the caller's advance.
 *
 * @param {{ workerResult: any, runSync: () => (Promise<any>|any), report?: (e:unknown, ctx:object)=>void }} args
 * @returns {Promise<string|null>} the divergence description, or null
 */
export async function verifyAdvanceDeterminism({ workerResult, runSync, report = reportError }) {
  if (!paranoiaEnabled()) return null;   // THE GATE — dead code in prod, no-op when off
  let syncResult;
  try {
    syncResult = await runSync();
  } catch {
    // A sync-path throw is a different failure than a determinism divergence; the
    // caller's own rollback owns real sim errors. Paranoia only judges divergence.
    return null;
  }
  const divergence = firstDivergence(workerResult?.worldState, syncResult?.worldState, 'worldState');
  if (divergence) {
    try {
      // Report ONLY the path + reason (no world state) — the R-14 no-leak law.
      report(new Error(`worker↔sync determinism divergence — ${divergence}`), {
        kind: 'determinism.worker-sync-divergence',
      });
      if (typeof console !== 'undefined') console.error('[paranoia] worker↔sync divergence:', divergence);
    } catch { /* reporting must never break the advance */ }
  }
  return divergence;
}
