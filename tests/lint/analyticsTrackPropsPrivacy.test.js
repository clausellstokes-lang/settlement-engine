/**
 * analyticsTrackPropsPrivacy.test.js — W-R2-TRUST structural guard closing the
 * class behind findings components-dossier-library-1 and -6.
 *
 * THE CLASS: analytics.track(event, props, opts) mirrors ESSENTIAL-class events
 * to the third-party provider and stores every event first-party beside the
 * pseudonymous actor_id. The `props` (2nd positional) argument is contractually
 * COARSE ONLY — enums, bands, counts, booleans, hashes; never PII, never raw
 * free-text. The privacy floor for identity is the hashed OPTS lane
 * (`track(EVENT, {}, { userId })`, the signupCompleted pattern), which hashes the
 * id before any mirror. THREE call sites had drifted: WelcomeCreditCard shipped
 * the raw Supabase `userId` in props (two calls), CompendiumGlobalSearch shipped
 * the raw typed search `query`, and store/index.js's SAVE_SIGNUP_INTENT_FULFILLED
 * shipped the raw `userId` (this third site was surfaced by THIS guard, not the
 * original findings). All are fixed; this guard forbids the shape from returning.
 *
 * THE GUARD: an argument-aware source scan. For every `track(...)` /
 * `Funnel.track(...)` call in src, it parses the top-level call arguments and
 * inspects ONLY the props (2nd) argument for a forbidden key — userId / user_id /
 * query / email. The opts (3rd) argument, where `userId` is the SANCTIONED hashed
 * lane, is never inspected, so the legitimate pattern is not a false positive.
 *
 * CLEARED 2026-07-16 (was 3 offending call sites across 3 files). ALLOWLIST is
 * empty and uses exact equality: a new offender fails immediately, and any
 * sanctioned coarse prop that genuinely must live in props (none today) is added
 * here with a written reason — a new leak is a bug to FIX at the call site, not
 * an entry to append.
 *
 * CANNOT-CATCH (accepted regex/parser gaps; covered by code review + the props
 * contract in analytics.js):
 *   - a props object passed as a VARIABLE (`track(EVENT, builtProps)`) rather than
 *     an inline literal — the key is invisible to a static scan;
 *   - a forbidden value spread in from elsewhere (`{ ...meta }`) where `meta`
 *     carries userId/query;
 *   - a forbidden key spelled differently (e.g. `uid`, `q`, `searchText`).
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Forbidden keys in the PROPS argument. Matches a shorthand (`{ userId }`) or a
// keyed (`{ query: ... }`) property anywhere inside the props object literal.
const FORBIDDEN_KEY = /\b(userId|user_id|query|email)\b\s*[:,}]/;

// Sanctioned exceptions: coarse props that legitimately share a forbidden spelling.
// Empty by design — a real leak is fixed at the call site, not allowlisted here.
const ALLOWLIST = []; // e.g. { file: 'src/x.jsx', key: 'query', why: '...' }

/** Strip comments so a mention inside a doc/line comment never false-matches. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?)$/.test(e)) out.push(p);
  }
  return out;
}

/**
 * From `src[openParen] === '('`, return the top-level argument substrings,
 * respecting (){}[] nesting and string/template literals.
 */
function topLevelArgs(src, openParen) {
  const args = [];
  let depth = 0, cur = '', str = null;
  for (let i = openParen; i < src.length; i++) {
    const c = src[i];
    if (str) {
      cur += c;
      if (c === '\\') { cur += src[i + 1] ?? ''; i++; }
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { str = c; cur += c; continue; }
    if (c === '(' || c === '[' || c === '{') { if (depth > 0) cur += c; depth++; continue; }
    if (c === ')' || c === ']' || c === '}') {
      depth--;
      if (depth === 0) { if (cur.trim()) args.push(cur.trim()); return args; }
      cur += c;
      continue;
    }
    if (c === ',' && depth === 1) { args.push(cur.trim()); cur = ''; continue; }
    if (depth >= 1) cur += c;
  }
  return args;
}

// A track() call: bare `track(` (not a member of another object, not part of a
// longer identifier) OR `Funnel.track(`. Global so we find every call in a file.
const CALL_RE = /(?:Funnel\.track|(?<![\w.])track)\s*\(/g;

function offendersIn(rel) {
  const src = stripComments(readFileSync(join(ROOT, rel), 'utf8'));
  const out = [];
  let m;
  CALL_RE.lastIndex = 0;
  while ((m = CALL_RE.exec(src))) {
    const open = src.indexOf('(', m.index);
    if (open === -1) continue;
    const args = topLevelArgs(src, open);
    const props = args[1];
    if (!props || props[0] !== '{') continue; // no inline props literal to inspect
    const hit = props.match(FORBIDDEN_KEY);
    if (hit) out.push({ file: rel, key: hit[1] });
  }
  return out;
}

const offenders = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .flatMap(offendersIn)
  .filter((o) => !ALLOWLIST.some((a) => a.file === o.file && a.key === o.key))
  .sort((a, b) => (a.file + a.key).localeCompare(b.file + b.key));

describe('analytics track() props privacy scan (W-R2-TRUST)', () => {
  test('no track() call passes userId/user_id/query/email inside its props argument', () => {
    // Each offender: the raw id/free-text belongs in the hashed opts lane
    // (track(EVENT, {}, { userId })), or must be dropped (raw query text is not a
    // coarse prop). Fix the call site — never add it to ALLOWLIST.
    expect(offenders).toEqual([]);
  });

  test('the scanner actually inspects the props arg (self-check: a synthetic offender is caught)', () => {
    // Guard-the-guard: prove the parser flags a props-lane userId but not an
    // opts-lane one, so a green scan means "clean", not "scanner broke".
    const sample = "track(EVENTS.X, { userId }); track(EVENTS.Y, {}, { userId }); track(EVENTS.Z, { term, tab });";
    const open1 = sample.indexOf('(');
    expect(topLevelArgs(sample, open1)[1]).toBe('{ userId }');
    expect(FORBIDDEN_KEY.test('{ userId }')).toBe(true);
    expect(FORBIDDEN_KEY.test('{}')).toBe(false);
    expect(FORBIDDEN_KEY.test('{ term, tab }')).toBe(false);
  });
});
