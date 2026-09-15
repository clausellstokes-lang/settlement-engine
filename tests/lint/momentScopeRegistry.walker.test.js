/**
 * momentScopeRegistry.walker.test.js — LD-7's structural half: NO POPUP RENDERS
 * WITHOUT A DECLARED SCOPE, made a property of the tree rather than of review.
 *
 * THE CLASS. `map_clicked` followed the visitor off the Realm to every page but
 * /pricing because its scope was never declared anywhere — it was INFERRED from
 * where the card happened to be mounted, and an App-level mount infers "global".
 * src/lib/momentScope.js now declares one scope per moment and PricingMomentCard
 * gates the render on it. That fixes the one moment. This walker is what keeps the
 * NEXT one from being born undeclared.
 *
 * FIVE ARMS, each closing a different way the registry can quietly go wrong:
 *
 *   1. TOTALITY, BOTH DIRECTIONS — the registry's key set EQUALS the `moments`
 *      copy registry's key set. A shipped moment with no scope is the bug class;
 *      a scope for a moment whose copy was deleted is a stale row that would let
 *      a future re-use inherit someone else's surface.
 *   2. VALIDITY — every view id any scope names is a real ROUTES `view`. A typo'd
 *      id is indistinguishable at runtime from "this moment never renders", which
 *      is the silent failure a render gate is most prone to.
 *   3. THE SOURCE CENSUS (the ratchet) — PER MOMENT KEY, the addresses in src/
 *      that name it (the registry module itself excluded) are frozen in the
 *      registry. A scope is a claim about where the trigger lives, and the only
 *      way that claim rots silently is a trigger moving or a new one appearing.
 *      Both move this map. ⚠️ It is keyed BECAUSE the flat-file-set version was
 *      measured blind: a planted swap of `first_canonize` for `map_clicked` inside
 *      an already-censused file left the flat set identical and this walker green.
 *   4. SHAPE — every row carries a non-empty `why`, a `firedFrom` array, and a
 *      scope that is either GLOBAL or a non-empty frozen array of ids.
 *   5. ANTI-VACUITY — the copy registry scan actually found a substantial
 *      population, so arm 1 cannot pass by comparing two empty sets.
 *
 * Source-reading, render-free: no jsdom, no store, no React.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { ROUTES } from '../../src/lib/routes.js';
import {
  GLOBAL, MOMENT_SCOPES, MOMENT_KEY_SOURCE_CENSUS, OVERLAY_SCOPE_CLASSIFICATION,
  momentAllowedOnView, momentIsDeclared,
} from '../../src/lib/momentScope.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** The declaration module — excluded from its own usage census (see the arm below). */
const REGISTRY_REL = 'src/lib/momentScope.js';

/**
 * The SHIPPED moment population, read out of the copy registry's `moments` block
 * by source rather than by import: en.js is one large frozen literal and the block
 * is what a reader edits when they add a moment, so reading the block is reading
 * the thing that actually changes.
 */
function shippedMomentKeys() {
  const src = readFileSync(join(ROOT, 'src/copy/en.js'), 'utf8');
  const start = src.indexOf('\n  moments: {');
  expect(start, 'the `moments:` block was not found in src/copy/en.js — update this walker with the refactor').toBeGreaterThan(-1);
  // Walk braces from the block's opening `{` so a nested object can never end it early.
  let depth = 0;
  let end = -1;
  for (let i = src.indexOf('{', start); i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') { depth -= 1; if (depth === 0) { end = i; break; } }
  }
  expect(end, 'the `moments:` block never closed').toBeGreaterThan(-1);
  const block = src.slice(start, end);
  // Top-level keys only: a moment row is `key: {` at exactly four spaces of indent.
  return [...block.matchAll(/^ {4}([a-z][a-z0-9_]*):\s*\{/gm)].map((m) => m[1]);
}

function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const shipped = shippedMomentKeys();
const declaredKeys = Object.keys(MOMENT_SCOPES);
const knownViews = new Set(ROUTES.map((r) => r.view));

describe('LD-7 — the popup scope registry (no moment renders without a declared scope)', () => {
  test('anti-vacuity: the copy registry scan found a substantial moment population', () => {
    expect(shipped.length).toBeGreaterThan(12);
    expect(declaredKeys.length).toBeGreaterThan(12);
  });

  test('TOTALITY: the declared set equals the shipped set, in both directions', () => {
    // Only-in-shipped ⇒ a moment that can fire and then never render (or, since
    // triggerPricingMoment refuses it, never fire at all): declare its scope.
    // Only-in-declared ⇒ a stale row whose copy is gone: delete it, so a later
    // re-use of the key cannot silently inherit this surface.
    expect([...declaredKeys].sort()).toEqual([...shipped].sort());
  });

  test('VALIDITY: every view id a scope names is a real route', () => {
    const bad = [];
    for (const [key, row] of Object.entries(MOMENT_SCOPES)) {
      if (row.scope === GLOBAL) continue;
      for (const v of row.scope) {
        if (!knownViews.has(v)) bad.push(`${key} → '${v}' is not a ROUTES view`);
      }
    }
    expect(bad).toEqual([]);
  });

  test('SHAPE: every row declares a usable scope, a firedFrom list and a reason', () => {
    const bad = [];
    for (const [key, row] of Object.entries(MOMENT_SCOPES)) {
      if (row.scope !== GLOBAL) {
        if (!Array.isArray(row.scope) || row.scope.length === 0) bad.push(`${key}: scope must be GLOBAL or a non-empty array of view ids`);
        else if (!Object.isFrozen(row.scope)) bad.push(`${key}: scope array must be frozen`);
      }
      if (!Array.isArray(row.firedFrom)) bad.push(`${key}: firedFrom must be an array (empty is the honest record for an unfired moment)`);
      if (typeof row.why !== 'string' || row.why.trim().length < 20) bad.push(`${key}: why must say, in a sentence, why this scope is the right one`);
    }
    expect(bad).toEqual([]);
  });

  test('THE SOURCE CENSUS, PER KEY: each moment key is named at exactly its frozen addresses', () => {
    // THE REGISTRY ITSELF IS EXCLUDED, and by address rather than by luck. It is
    // the DECLARATION, not a usage, so counting it would make the census mean two
    // things at once — and it would flicker in and out of the list on nothing more
    // than whether a doc comment happened to quote a key in the illustration. (It
    // did, on the first cut, and this arm caught it.)
    const sources = walkSrc(join(ROOT, 'src'))
      .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'))
      .filter((rel) => rel !== REGISTRY_REL)
      .sort()
      .map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]);
    const found = Object.fromEntries(shipped.map((k) => [
      k, sources.filter(([, text]) => text.includes(`'${k}'`)).map(([rel]) => rel),
    ]));
    const frozen = Object.fromEntries(
      Object.entries(MOMENT_KEY_SOURCE_CENSUS).map(([k, v]) => [k, [...v].sort()]),
    );
    // ⚠️ DO NOT JUST RE-FREEZE THIS. A file entering this list is a moment key
    // appearing at a new address, which is precisely when that moment's DECLARED
    // SCOPE must be re-read against the surface the new address renders on. A file
    // leaving it is a trigger that moved or died — same obligation. Update
    // MOMENT_KEY_SOURCE_CENSUS *and* the affected row's `scope` / `firedFrom`
    // together, in the same commit.
    //
    // ⚠️ KEYED BY MOMENT, NOT A FLAT FILE SET, AND THAT WAS MEASURED. A planted
    // mutation swapping `first_canonize` for `map_clicked` inside PhaseBadge.jsx —
    // a trigger firing the WRONG moment from a surface the wrong scope covers —
    // left the flat set byte-identical and this arm green. Per key it reds.
    expect(found).toEqual(frozen);
  });

  test('every curated firedFrom address is one the mechanical census actually found', () => {
    // `firedFrom` is documentation; the census is measurement. Documentation that
    // names an address the measurement cannot see is documentation that has rotted.
    const bad = [];
    for (const [key, row] of Object.entries(MOMENT_SCOPES)) {
      const census = new Set(MOMENT_KEY_SOURCE_CENSUS[key] ?? []);
      for (const f of row.firedFrom) {
        if (!census.has(f)) bad.push(`${key}: firedFrom names ${f}, which does not contain the key`);
      }
    }
    expect(bad).toEqual([]);
  });

  test('the predicate itself: declared scopes admit their own views and refuse every other', () => {
    for (const [key, row] of Object.entries(MOMENT_SCOPES)) {
      if (row.scope === GLOBAL) {
        expect(momentAllowedOnView(key, 'pricing'), `${key} is GLOBAL and must travel`).toBe(true);
        continue;
      }
      for (const v of row.scope) expect(momentAllowedOnView(key, v), `${key} must render on ${v}`).toBe(true);
      const outside = [...knownViews].filter((v) => !row.scope.includes(v));
      for (const v of outside) expect(momentAllowedOnView(key, v), `${key} must NOT render on ${v}`).toBe(false);
    }
  });

  test('the gate fails CLOSED: an undeclared reason is refused on every route', () => {
    expect(momentIsDeclared('not_a_registered_moment')).toBe(false);
    for (const v of knownViews) expect(momentAllowedOnView('not_a_registered_moment', v)).toBe(false);
    expect(momentAllowedOnView(undefined, 'realm')).toBe(false);
    expect(momentAllowedOnView('map_clicked', undefined)).toBe(false);
  });
});

describe('LD-7 — the audit slice (every other overlay classified as data)', () => {
  test('every classified overlay names a module that exists', () => {
    const missing = OVERLAY_SCOPE_CLASSIFICATION
      .filter((row) => {
        try { return !statSync(join(ROOT, row.surface)).isFile(); } catch { return true; }
      })
      .map((row) => row.surface);
    // A classification pointing at a deleted or moved module is a table that has
    // stopped describing the tree — exactly the stale-record failure LD-7's own
    // build-state table was re-measured to cure.
    expect(missing).toEqual([]);
  });

  test('every classified overlay carries a scope and a reason', () => {
    const bad = [];
    for (const row of OVERLAY_SCOPE_CLASSIFICATION) {
      if (!['registry', GLOBAL, 'by-mount', 'route-gated'].includes(row.scope)) bad.push(`${row.surface}: unknown scope '${row.scope}'`);
      if (typeof row.why !== 'string' || row.why.trim().length < 20) bad.push(`${row.surface}: why must be a sentence`);
    }
    expect(bad).toEqual([]);
  });

  test('the auth modal is a declared cross-page member, which is what makes "global" mean something', () => {
    // The order names it: the sign-in door legitimately travels. If NOTHING were
    // ever global the vocabulary would be decoration.
    const auth = OVERLAY_SCOPE_CLASSIFICATION.find((r) => r.surface.endsWith('AuthModal.jsx'));
    expect(auth, 'the auth modal must stay classified — it is the order\'s own example').toBeTruthy();
    expect(auth.scope).toBe(GLOBAL);
  });
});
