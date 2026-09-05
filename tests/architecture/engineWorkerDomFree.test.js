/**
 * engineWorkerDomFree.test.js — V-8 THE PATIENT ENGINE, the worker-loadability scan.
 *
 * The multi-tick advance runs inside a Web Worker (src/workers/advanceInterval.worker.js),
 * which imports the domain engine spine (src/domain/worldPulse/advanceInterval.js and its
 * whole graph). A Worker context has NO `window`, NO `document`, NO `localStorage`,
 * NO `sessionStorage` — a bare reference to any of them throws `ReferenceError` the moment
 * the module is imported or the function runs, silently forcing every advance back onto the
 * in-thread fallback (or crashing it). This scan makes the "the engine is worker-loadable"
 * property STRUCTURAL: it fails the moment a domain (or kernel) file reaches for a
 * browser-only global.
 *
 * It is the token-level complement to layerBoundaries.test.js's headless-engine spine
 * (which forbids IMPORTING React/Zustand/the store): that guards what the engine imports;
 * this guards what it references. `typeof window` guards are explicitly allowed — they are
 * worker-safe (a `typeof` of an undeclared global yields 'undefined', never throws), so a
 * capability probe is fine; only UNGUARDED access is forbidden.
 *
 * SCOPE: src/domain + src/kernel — the deterministic engine spine the worker loads. (lib
 * seams the worker also imports — customContentSource.js, dependencyEngine.js — are held to
 * the same bar by their own de-eager guards; this scan owns the engine graph the brief names.)
 *
 * `window` is OVERLOADED in this engine: a "window" is a first-class domain concept
 * (festival windows, defection windows, challenge windows), used as a local variable and
 * parameter name across the traditions/ladder kernels. So a bare `window` token is almost
 * always a local, not the DOM global. The scan handles this by SKIPPING the `window` check
 * in any file that locally binds `window` (as a param, declaration, or destructure) — those
 * references are the local. The other three globals are never domain concepts, so they are
 * scanned strictly.
 *
 * CANNOT-CATCH (documented per the guard-honesty rule):
 *   • A file that BOTH binds a local `window` AND separately reaches for the DOM `window`
 *     global — the local-binding skip suppresses the whole file's `window` check. Vanishingly
 *     unlikely in a headless engine; the byte-identity pin (advanceWorkerByteIdentity.test.js)
 *     is the behavioral backstop — an advance that touched the DOM would throw in the real
 *     worker and diverge from the sync path, failing that pin regardless of the token used.
 *   • Indirect access via an alias (`const w = globalThis; w.localStorage`) or
 *     bracket-string access (`globalThis['window']`). The engine uses none.
 *   • Globals reached through an imported helper OUTSIDE src/domain|kernel. layerBoundaries
 *     forbids the store/React import edges that would carry such helpers into the spine.
 */

import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(import.meta.dirname, '../..');
// The worker-loadable engine spine. WIDENED when settlement generation gained a
// Web Worker transport: the generation core under src/workers runs the WHOLE
// pipeline off-thread, so src/generators and the realm composer under
// src/lib/instantWorld are now worker-loadable code in exactly the sense this
// scan means, and src/workers itself holds the shells that would be the first
// place a DOM reference silently arrived. A guard whose scope lags the code it
// guards is a guard that passes on the day it stops covering anything.
const SCAN_DIRS = ['src/domain', 'src/kernel', 'src/generators', 'src/lib/instantWorld', 'src/workers']
  .map((d) => join(ROOT, d));

// Browser-only globals absent from a Web Worker global scope.
const FORBIDDEN = ['window', 'document', 'localStorage', 'sessionStorage'];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(e)) out.push(p);
  }
  return out;
}

/**
 * ⭐ THE STRIP IS THE ESTATE'S ONE SHARED STRIP, and it was a MEASURED swap, not a
 * tidy-up. This file used to carry its own char scanner. It has the same shape as
 * `codeOnly` but one different recovery rule, and that difference is load-bearing:
 * NEITHER scanner knows what a regex literal is, so both mistake the apostrophe in
 * the `mages' quarter` regex (src/generators/power/governanceNarrative.js:229) for
 * an opening quote. The local scanner then ran to the NEXT apostrophe anywhere in
 * the file and desynced everything after it, leaking prose out of a string 353
 * lines later and convicting `governanceNarrative.js:582` of touching `document`.
 * `codeOnly` terminates an unterminated quote at end-of-line, so the same blind
 * spot costs one line of over-blanking instead of the rest of the file.
 *
 * MEASURED at the swap, both scanners, both scopes: over the PREVIOUS scope
 * (src/domain + src/kernel, 1,022 files) the two agree at ZERO violations, so the
 * swap changes nothing that was already guarded. Over the WIDENED scope (1,145
 * files) the local scanner reported exactly one violation and it was that false
 * positive; `codeOnly` reports none. The widening is what exposed the defect, and
 * a scan that cannot be trusted about a generator must not be pointed at one.
 *
 * CANNOT-CATCH, inherited and stated: a regex literal containing a quote still
 * over-blanks to end of line, so a DOM global on the REMAINDER of such a line is
 * invisible. That is a miss confined to one line, never a file-wide desync, and it
 * is why the widening was safe to take with this strip and not with the other.
 */

// Does the file locally bind `name` (param / declaration / destructure / catch)? If so, its
// bare references to `name` are the local, not the global. Only consulted for `window`, the
// one overloaded token. Operates on comment/string-stripped source.
function bindsLocally(strippedSrc, name) {
  const patterns = [
    new RegExp(`\\b(?:const|let|var)\\s+${name}\\b`),          // const/let/var window
    new RegExp(`\\bfunction\\b[^(]*\\([^)]*\\b${name}\\b`),     // function f(window)
    new RegExp(`\\(([^()]*,\\s*)?${name}\\s*[,)]`),             // (window) / (a, window) params, arrow args
    new RegExp(`\\{[^{}]*\\b${name}\\b[^{}]*\\}\\s*=>`),        // ({ window }) =>
    new RegExp(`\\bcatch\\s*\\(\\s*${name}\\b`),                // catch (window)
  ];
  return patterns.some((re) => re.test(strippedSrc));
}

// A global reference = the identifier NOT preceded by `.` or a word char (so `rec.window`
// and `treatyDocument` never match), and NOT immediately `typeof`-guarded.
function findGlobalRefs(strippedSrc, name) {
  const re = new RegExp(`(^|[^\\w$.])${name}\\b`, 'g');
  const hits = [];
  let m;
  while ((m = re.exec(strippedSrc)) !== null) {
    const identStart = m.index + m[1].length;
    // Allow `typeof window` — worker-safe capability probe.
    const before = strippedSrc.slice(Math.max(0, identStart - 8), identStart);
    if (/typeof\s*$/.test(before)) continue;
    // Allow an object PROPERTY KEY definition `window:` (defines a field, not the global).
    const after = strippedSrc.slice(identStart + name.length).replace(/^\s*/, '');
    if (after.startsWith(':')) continue;
    const line = strippedSrc.slice(0, identStart).split('\n').length;
    hits.push(line);
  }
  return hits;
}

describe('V-8 worker-loadability — the engine spine is DOM-free', () => {
  const files = SCAN_DIRS.flatMap((d) => walk(d));

  test('the worker-loadable engine spine references no browser-only globals (window/document/localStorage/sessionStorage)', () => {
    expect(files.length).toBeGreaterThan(100); // the scan actually covered the spine

    const violations = [];
    for (const file of files) {
      const stripped = codeOnly(readFileSync(file, 'utf8'));
      for (const name of FORBIDDEN) {
        // `window` is an overloaded domain concept — skip files that bind it locally.
        if (name === 'window' && bindsLocally(stripped, 'window')) continue;
        for (const line of findGlobalRefs(stripped, name)) {
          violations.push(`${relative(ROOT, file)}:${line} — ${name}`);
        }
      }
    }

    expect(violations, `Worker-hostile browser globals in the engine spine:\n${violations.join('\n')}`).toEqual([]);
  });

  test('the scanner itself works: it flags an unguarded global but passes a typeof guard and a property access', () => {
    expect(findGlobalRefs(codeOnly('const x = window.location;'), 'window')).toHaveLength(1);
    expect(findGlobalRefs(codeOnly('localStorage.getItem("k");'), 'localStorage')).toHaveLength(1);
    // Worker-safe / non-global uses must NOT flag.
    expect(findGlobalRefs(codeOnly('if (typeof window !== "undefined") {}'), 'window')).toHaveLength(0);
    expect(findGlobalRefs(codeOnly('const w = rec.window; obj.document = 1;'), 'window')).toHaveLength(0);
    expect(findGlobalRefs(codeOnly('const rec = { window: {...w} };'), 'window')).toHaveLength(0);
    expect(findGlobalRefs(codeOnly('// see the advance window.\nconst n = 1;'), 'window')).toHaveLength(0);
    expect(findGlobalRefs(codeOnly('const s = "close the window.";'), 'window')).toHaveLength(0);
  });

  test('the local-binding heuristic recognizes window as a param/declaration (a domain "window")', () => {
    expect(bindsLocally(codeOnly('function describeTraditionWindow(window) { return window?.weeks; }'), 'window')).toBe(true);
    expect(bindsLocally(codeOnly('function inWindow(weekOfYear, window) {}'), 'window')).toBe(true);
    expect(bindsLocally(codeOnly('const window = rec.observanceWindow;'), 'window')).toBe(true);
    // A file that only reaches for the DOM global does NOT bind it → not skipped.
    expect(bindsLocally(codeOnly('const x = window.localStorage;'), 'window')).toBe(false);
    // The unambiguous globals are never treated as bindable.
    expect(bindsLocally(codeOnly('localStorage.getItem("k");'), 'localStorage')).toBe(false);
  });
});
