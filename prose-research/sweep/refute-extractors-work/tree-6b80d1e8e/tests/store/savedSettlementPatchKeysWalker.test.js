/**
 * savedSettlementPatchKeysWalker.test.js — Wave R-4 lane P-4 (prevention for the
 * R-3 atlas VI.12 #163b cure): the SOURCE-DERIVED census→allowlist coupling for
 * updateSavedSettlement's patch-key validation.
 *
 * WHY THIS EXISTS. R-3 froze the writer's patch surface as
 * SAVED_SETTLEMENT_PATCH_KEYS (src/store/settlementSliceHelpers.js) and pinned it
 * in tests/store/updateSavedSettlementAllowlist.test.js. But that pin's census is
 * a HAND-COPIED literal (CENSUS_KEYS) sitting beside the hand-copied allowlist, so
 * "the allowlist IS the census" only ever proved list == list. Combined with the
 * writer's ATOMIC refusal — one unlisted key refuses the WHOLE patch — and with
 * the fact that every caller ignores the returned envelope, a future call site
 * that adds one key would, in production (where import.meta.env.DEV is false and
 * the helper's console.error never fires), silently drop an entire settlement/
 * campaignState/timestamp fold onto the cached save row. Survives-one-path,
 * ghosts-another: the dev build screams, the shipped build says nothing.
 *
 * WHAT IT DOES. It re-derives the census from source on every run — no literal to
 * drift — and asserts both directions:
 *   (a) FAIL-CLOSED admission: every key any real call site patches is in
 *       SAVED_SETTLEMENT_PATCH_KEYS, so a new call-site key reds HERE, before it
 *       can silently refuse in prod.
 *   (b) LIVENESS: every allowlist member is either censused or an explicitly
 *       listed INERT_CARRY with a reason, so the allowlist cannot quietly grow a
 *       surface nothing writes.
 * Derivation as of 2026-07-27: 21 call sites (settlementSlice x6, aiSlice x9,
 * ShareToGallery x6) yielding exactly the 17 allowlist keys, zero inert carries —
 * an independent re-derivation of R-3's counts, not a reuse of them.
 *
 * METHOD (mirrors tests/generators/configPatchAllowlistWalker.test.js, hardened
 * where that walker's regex approach could not reach):
 *   - comments are stripped before scanning, so prose mentioning the writer name
 *     cannot register as a call site (settlementSlice.js has exactly such a
 *     comment: "stamp editedAt → updateSavedSettlement (the in-memory save ...");
 *   - calls are found textually (`updateSavedSettlement(` / `?.(`), their second
 *     argument taken by balanced-paren scan;
 *   - an object-literal argument is walked by a depth-tracking scanner that
 *     collects BOTH `key:` and SHORTHAND `{ aiData }` properties. Shorthand is not
 *     optional here: aiSlice's nine writes are shorthand, so the R-3 walker's
 *     deliberate shorthand blind spot would have made this census vacuous;
 *   - a spread of an INLINE object (`...(cond ? { aiData: v } : {})`, the real
 *     shape at settlementSlice.js applyEvent) is traversed — its keys are top-
 *     level keys of the patch;
 *   - an IDENTIFIER argument (the five `savePartial` folds) resolves to the
 *     nearest preceding `const/let/var <name> = { ... }` in the same file;
 *   - anything the walker cannot resolve to a key set is an UNRESOLVED site and
 *     REDS the suite. Silence is never treated as absence.
 * Two adversarial self-tests drive synthetic sources through the same extractor,
 * so the walker's catching power is executed on every ordinary run rather than
 * asserted (the manifest's self-proving-meta pattern).
 *
 * KNOWN EDGES (deliberate, reviewed):
 *   - Computed keys (`{ [k]: v }`) are skipped: a runtime-computed patch key
 *     cannot be censused from source. There are none today; one would need its
 *     own pin at the call site.
 *   - Bare identifier spreads (`{ ...patch }`) cannot be expanded, so they are
 *     reported as UNRESOLVED rather than passed over. None exist today.
 *   - Identifier resolution takes the nearest preceding declaration in the same
 *     file; two same-named patch variables in different scopes could resolve to
 *     the wrong one. Fail-closed in practice — a miss lands in UNRESOLVED, and a
 *     wrong-scope hit over-collects keys (a red), never under-collects silently.
 *   - Indirect dispatch would escape the textual anchor. Verified absent: nothing
 *     in src reaches this action through a computed member (`get()[opType]`), and
 *     ShareToGallery's `useStore` binding keeps the action's own name.
 *   - Only src/ is scanned. The writer is a store action; test doubles and edge
 *     functions cannot patch a real save row.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { SAVED_SETTLEMENT_PATCH_KEYS } from '../../src/store/settlementSliceHelpers.js';

const ROOT = process.cwd();

/**
 * Allowlist members no call site writes today, each with the reason it stays.
 * EMPTY as of 2026-07-27: all 17 keys are live. An entry here is a deliberate,
 * reviewed carry (e.g. a key only legacy save blobs replay), never a parking spot
 * for a key whose writer was deleted.
 */
const INERT_CARRIES = Object.freeze({});

function walkFiles(dir, exts, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, exts, acc);
    else if (exts.some(ext => name.endsWith(ext))) acc.push(full);
  }
  return acc;
}

/** Skip a quoted run starting at src[i] (i points at the quote). Returns the index past it. */
function skipString(src, i) {
  const q = src[i];
  i++;
  while (i < src.length) {
    if (src[i] === '\\') { i += 2; continue; }
    if (src[i] === q) return i + 1;
    i++;
  }
  return i;
}

/**
 * Strip line and block comments, preserving string/template runs (and their
 * lengths, so nothing downstream depends on offsets shifting predictably).
 */
export function stripComments(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const end = skipString(src, i);
      out += src.slice(i, end);
      i = end;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** The balanced open..close run beginning at openIdx, or null if unbalanced. */
function balancedFrom(src, openIdx, open, close) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(src, i) - 1; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return src.slice(openIdx, i + 1); }
  }
  return null;
}

/** The text of a call's SECOND argument, or null when there is no second argument. */
function secondArgText(callText) {
  const inner = callText.slice(1, -1);
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(inner, i) - 1; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ',' && depth === 0) return inner.slice(i + 1).trim();
  }
  return null;
}

/**
 * Top-level property keys of an object-literal source text, counting keys reached
 * only through an INLINE spread as top-level too. Returns { keys, blockers } —
 * blockers naming constructs (computed keys, bare-identifier spreads) whose keys
 * this scanner cannot know, so the caller can fail closed instead of guessing.
 */
export function objectLiteralKeys(objText) {
  const keys = new Set();
  const blockers = [];
  /** transparent[d] — do properties at brace depth d belong to the patch? */
  const transparent = [false];
  /** sawSpread[d] — is the property currently being read at depth d a spread? */
  const sawSpread = [false];
  let depth = 0;
  let i = 0;
  while (i < objText.length) {
    const c = objText[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(objText, i); continue; }
    if (c === '{') {
      const inherit = depth === 0 ? true : (transparent[depth] && sawSpread[depth]);
      depth++;
      transparent[depth] = inherit;
      sawSpread[depth] = false;
      i++;
      continue;
    }
    if (c === '}') { depth = Math.max(0, depth - 1); i++; continue; }
    if (objText.startsWith('...', i)) {
      if (depth >= 1 && transparent[depth]) {
        sawSpread[depth] = true;
        let k = i + 3;
        while (k < objText.length && /\s/.test(objText[k])) k++;
        // An inline spread ('...(' / '...{') is traversed by the brace handling
        // above; a bare identifier spread hides its keys from any source scan.
        if (/[A-Za-z_$]/.test(objText[k] || '')) {
          let e = k;
          while (e < objText.length && /[\w$]/.test(objText[e])) e++;
          blockers.push(`spread of identifier '${objText.slice(k, e)}'`);
        }
      }
      i += 3;
      continue;
    }
    if (c === '[' && depth >= 1 && transparent[depth]) {
      const run = balancedFrom(objText, i, '[', ']');
      let after = i + (run ? run.length : 1);
      while (after < objText.length && /\s/.test(objText[after])) after++;
      if (objText[after] === ':') blockers.push(`computed key ${run || '[...]'}`);
      i += run ? run.length : 1;
      continue;
    }
    if (depth >= 1 && transparent[depth] && /[A-Za-z_$]/.test(c)) {
      let p = i - 1;
      while (p >= 0 && /\s/.test(objText[p])) p--;
      const atPropertyStart = objText[p] === '{' || objText[p] === ',';
      let j = i;
      while (j < objText.length && /[\w$]/.test(objText[j])) j++;
      const word = objText.slice(i, j);
      let k = j;
      while (k < objText.length && /\s/.test(objText[k])) k++;
      if (atPropertyStart && objText[k] === ':') { keys.add(word); i = k + 1; continue; }
      if (atPropertyStart && (objText[k] === ',' || objText[k] === '}')) { keys.add(word); i = k; continue; }
      i = j;
      continue;
    }
    i++;
  }
  return { keys, blockers };
}

const CALL_RE = /updateSavedSettlement(?:\?\.)?\(/g;

/**
 * Census one file's updateSavedSettlement call sites.
 * @param {string} raw file source
 * @param {string} label repo-relative path, for messages
 * @returns {{ sites: number, keys: Set<string>, unresolved: string[] }}
 */
export function censusFile(raw, label) {
  const src = stripComments(raw);
  const keys = new Set();
  const unresolved = [];
  let sites = 0;
  let m;
  CALL_RE.lastIndex = 0;
  while ((m = CALL_RE.exec(src))) {
    sites++;
    const at = `${label}@${src.slice(0, m.index).split('\n').length}`;
    const callText = balancedFrom(src, m.index + m[0].length - 1, '(', ')');
    if (!callText) { unresolved.push(`${at}: unbalanced call parens`); continue; }
    const arg = secondArgText(callText);
    if (!arg) { unresolved.push(`${at}: no second argument`); continue; }
    let objText = null;
    if (arg.startsWith('{')) {
      objText = balancedFrom(arg, 0, '{', '}');
    } else if (/^[A-Za-z_$][\w$]*$/.test(arg)) {
      const declRe = new RegExp(`\\b(?:const|let|var)\\s+${arg}\\s*=\\s*\\{`, 'g');
      let d;
      let last = -1;
      while ((d = declRe.exec(src)) && d.index < m.index) last = d.index;
      if (last >= 0) objText = balancedFrom(src, src.indexOf('{', last), '{', '}');
      if (!objText) unresolved.push(`${at}: patch variable '${arg}' has no resolvable object literal`);
    } else {
      unresolved.push(`${at}: second argument is not an object literal or identifier (${arg.slice(0, 48)})`);
    }
    if (!objText) continue;
    const { keys: found, blockers } = objectLiteralKeys(objText);
    for (const k of found) keys.add(k);
    for (const b of blockers) unresolved.push(`${at}: ${b}`);
  }
  return { sites, keys, unresolved };
}

function censusSrc() {
  const keys = new Set();
  const unresolved = [];
  const byFile = {};
  let sites = 0;
  for (const file of walkFiles(resolve(ROOT, 'src'), ['.js', '.jsx'])) {
    const raw = readFileSync(file, 'utf-8');
    if (!raw.includes('updateSavedSettlement')) continue;
    const label = relative(ROOT, file).replace(/\\/g, '/');
    const res = censusFile(raw, label);
    if (res.sites === 0) continue;
    byFile[label] = res.sites;
    sites += res.sites;
    for (const k of res.keys) keys.add(k);
    unresolved.push(...res.unresolved);
  }
  return { keys, unresolved, byFile, sites };
}

describe('R-4 — updateSavedSettlement patch keys are the source census (walker)', () => {
  it('self-check: the census is not vacuous', () => {
    const { sites, byFile, keys } = censusSrc();
    expect(sites, `call sites by file: ${JSON.stringify(byFile)}`).toBeGreaterThanOrEqual(15);
    expect(Object.keys(byFile).length).toBeGreaterThanOrEqual(3);
    expect(keys.size).toBeGreaterThanOrEqual(10);
  });

  it('every call site resolves to a known key set (silence is never absence)', () => {
    const { unresolved } = censusSrc();
    expect(
      unresolved,
      'A call site patches keys this walker cannot derive from source. Either give the '
        + 'patch an inline object literal / a same-file `const` literal, or pin that call '
        + "site's keys explicitly and record it in this file's KNOWN EDGES.",
    ).toEqual([]);
  });

  it('(a) every censused call-site key is admitted by SAVED_SETTLEMENT_PATCH_KEYS', () => {
    const { keys } = censusSrc();
    const refused = [...keys].filter(key => !SAVED_SETTLEMENT_PATCH_KEYS.includes(key)).sort();
    expect(
      refused,
      `A call site patches ${refused.join(', ')} but SAVED_SETTLEMENT_PATCH_KEYS does not `
        + 'admit it. updateSavedSettlement refuses the patch ATOMICALLY and every caller '
        + 'ignores the envelope, so in production (import.meta.env.DEV false, no console '
        + 'error) the whole write is silently dropped. Add the key to '
        + 'SAVED_SETTLEMENT_PATCH_KEYS in src/store/settlementSliceHelpers.js.',
    ).toEqual([]);
  });

  it('(b) every allowlist member is live, or an explicitly listed inert carry', () => {
    const { keys } = censusSrc();
    const dead = SAVED_SETTLEMENT_PATCH_KEYS
      .filter(key => !keys.has(key) && !Object.hasOwn(INERT_CARRIES, key))
      .sort();
    expect(
      dead,
      `SAVED_SETTLEMENT_PATCH_KEYS admits ${dead.join(', ')} but no call site in src writes `
        + 'it. Either the writer was deleted (drop the key) or the carry is deliberate '
        + "(add it to this file's INERT_CARRIES with the reason).",
    ).toEqual([]);
  });

  it('the inert-carry list stays honest: no listed carry is actually written', () => {
    const { keys } = censusSrc();
    const contradicted = Object.keys(INERT_CARRIES).filter(key => keys.has(key)).sort();
    expect(contradicted, 'These keys are listed inert but a call site writes them.').toEqual([]);
    for (const [key, reason] of Object.entries(INERT_CARRIES)) {
      expect(SAVED_SETTLEMENT_PATCH_KEYS, `${key} is carried but not admitted`).toContain(key);
      expect(String(reason).length, `${key} needs a real reason`).toBeGreaterThan(20);
    }
  });

  // --- adversarial self-tests: the extractor's catching power, executed ---------

  it('negative control: a NEW call-site key is collected (so assertion (a) would red)', () => {
    const planted = `
      function handler(saveId, blob) {
        updateSavedSettlement?.(saveId, {
          gallery_title: blob.title,
          gallery_watermark_url: blob.mark,
        });
      }
    `;
    const { keys, unresolved } = censusFile(planted, 'planted.js');
    expect(unresolved).toEqual([]);
    expect([...keys].sort()).toEqual(['gallery_title', 'gallery_watermark_url']);
    const refused = [...keys].filter(key => !SAVED_SETTLEMENT_PATCH_KEYS.includes(key));
    expect(refused).toEqual(['gallery_watermark_url']);
  });

  it('negative control: the real argument shapes all extract, and opaque ones fail closed', () => {
    const shapes = `
      const savePartial = {
        settlement: cloneJson(afterState.settlement),
        campaignState: pickle(afterState),
        timestamp: now,
        ...(nextAiData ? { aiData: nextAiData } : {}),
      };
      updateSavedSettlement(id, savePartial);
      get().updateSavedSettlement(saveId, { aiData });
      // updateSavedSettlement (a prose mention, not a call site)
      updateSavedSettlement?.(saveId, { visibility: 'public', unlisted_slug: null });
    `;
    const resolved = censusFile(shapes, 'shapes.js');
    expect(resolved.sites, 'the commented mention must not count as a site').toBe(3);
    expect(resolved.unresolved).toEqual([]);
    expect([...resolved.keys].sort()).toEqual([
      'aiData', 'campaignState', 'settlement', 'timestamp', 'unlisted_slug', 'visibility',
    ]);

    const opaque = `
      updateSavedSettlement(id, buildPatch(row));
      updateSavedSettlement(id, { ...incomingPatch });
      updateSavedSettlement(id, { [dynamicKey]: 1 });
    `;
    const blocked = censusFile(opaque, 'opaque.js');
    expect(blocked.sites).toBe(3);
    expect(blocked.unresolved).toHaveLength(3);
    expect(blocked.unresolved.join(' | ')).toMatch(/not an object literal or identifier/);
    expect(blocked.unresolved.join(' | ')).toMatch(/spread of identifier 'incomingPatch'/);
    expect(blocked.unresolved.join(' | ')).toMatch(/computed key/);
  });
});
