/**
 * tests/helpers/sourceContract.js — FAIL-CLOSED source extractors for contract tests.
 *
 * THE CLASS THIS CLOSES ("tests that lie"). A contract/security/lint test that reads a
 * source file and asserts on a slice of it is only as trustworthy as its extractor. The
 * defect class the cycle-3 review found (H8/M6/M7/M8) is the SILENT extractor: a helper
 * that returns `''` (or an empty set) when its target is renamed, moved, or removed —
 * after which the test's assertion runs against emptiness and PASSES vacuously. A
 * `expect(body).not.toMatch(secret)` on an empty `body` is trivially green; an
 * `expect(sql).toContain(token)` that never had a token to check is green having proved
 * nothing. The producer moved and the guard went dark WITHOUT reddening — the worst
 * failure mode for a security pin.
 *
 * THE CHOKEPOINT. Every source-extraction a contract test needs routes through these
 * functions, and every one of them THROWS (never returns '') when its target is absent.
 * A renamed function or a reshaped regex now turns the test ERROR (loud) instead of
 * green-on-nothing. Extractors that produce token SETS additionally throw on a zero-size
 * result and refuse to silently drop a token they cannot normalize — the M8 failure mode
 * (`.filter(Boolean)` swallowing a mangled token) is structurally impossible here.
 *
 * These are DELIBERATELY strict: they cover the shapes this repo's contract tests use and
 * fail closed on anything else, so an author who hits a throw is forced to widen the
 * extractor consciously rather than paper over a miss with an empty string. The companion
 * guard tests/lint/contractTestAntiVacuity.walker.test.js keeps new contract tests on
 * these helpers instead of hand-rolling the next silent extractor.
 */

/**
 * Assert `needle` (a string or RegExp) is present in `src`; return the matched text.
 * Throws — never returns a falsy sentinel — when the target is absent, so a caller can
 * never accidentally assert against "not found".
 * @param {string} src
 * @param {string|RegExp} needle
 * @param {string} [label]  human context for the throw message
 * @returns {string} the matched text (the needle itself for a string search)
 */
export function mustExtract(src, needle, label) {
  const ctx = label || String(needle);
  if (typeof src !== 'string') {
    throw new Error(`sourceContract.mustExtract: source is not a string (${ctx})`);
  }
  if (needle instanceof RegExp) {
    const m = src.match(needle);
    if (!m) throw new Error(`sourceContract.mustExtract: pattern ${needle} not found (${ctx})`);
    return m[0];
  }
  if (typeof needle !== 'string' || needle.length === 0) {
    throw new Error(`sourceContract.mustExtract: needle must be a non-empty string or RegExp (${ctx})`);
  }
  if (src.indexOf(needle) < 0) {
    throw new Error(`sourceContract.mustExtract: "${needle}" not found in source (${ctx})`);
  }
  return needle;
}

/**
 * Extract a JS `function NAME ...` body — from the `function NAME` anchor to the next
 * top-level `\nexport ` (or end of file). Matches the long-standing local idiom the
 * cycle-3 contract tests used, but THROWS instead of returning '' when the anchor is
 * absent. (`indexOf('function NAME')` matches `export async function NAME` too, and is
 * intentionally tolerant of `public.NAME` SQL anchors the same way the prior local helper
 * was — a renamed target still fails loud.)
 * @param {string} src
 * @param {string} fnName
 * @returns {string} the function's source slice (guaranteed non-empty)
 */
export function functionBody(src, fnName) {
  if (typeof src !== 'string') throw new Error(`sourceContract.functionBody: source is not a string (${fnName})`);
  const anchor = `function ${fnName}`;
  const start = src.indexOf(anchor);
  if (start < 0) throw new Error(`sourceContract.functionBody: "${anchor}" not found in source`);
  const nextExport = src.indexOf('\nexport ', start + 1);
  return src.slice(start, nextExport < 0 ? src.length : nextExport);
}

/**
 * Extract a SQL function definition — from `create or replace function NAME` to the
 * closing `$$;` of its dollar-quoted body (or end of source). THROWS when the function is
 * absent, so a dropped/renamed migration function turns the test ERROR, not green.
 * @param {string} src
 * @param {string} fnName  e.g. `public._gallery_chronicle_entry`
 * @returns {string} the definition slice (guaranteed non-empty)
 */
export function sqlFunctionBody(src, fnName) {
  if (typeof src !== 'string') throw new Error(`sourceContract.sqlFunctionBody: source is not a string (${fnName})`);
  const anchor = `create or replace function ${fnName}`;
  const start = src.indexOf(anchor);
  if (start < 0) throw new Error(`sourceContract.sqlFunctionBody: "${anchor}" not found in source`);
  const end = src.indexOf('$$;', start);
  return src.slice(start, end < 0 ? src.length : end);
}

/**
 * Normalize ONE regex alternation alternative (from either a JS `/(a|b)/` source or a SQL
 * `~* ('^(a|b)$')` denylist) to the set of CONCRETE lowercase key stems it denies.
 * Strips whole-key/word-boundary/anchor/contains noise (`\b \B \m \M \y \Y ^ $ .* .+`) and
 * expands a single optional-char quantifier `c?` into its present/absent forms. FAILS
 * CLOSED — throws — on an empty result or any regex metachar it does not deliberately
 * handle, so no alternative is ever silently dropped or mangled to '' (the M8 defect).
 * @param {string} raw
 * @param {string} ctx
 * @returns {string[]}
 */
function normalizeAlternative(raw, ctx) {
  let s = String(raw).trim();
  s = s.replace(/\\[bByYmM]/g, '');       // JS \b\B and Postgres \m\M \y\Y word boundaries
  s = s.replace(/^\^/, '').replace(/\$$/, ''); // anchors
  s = s.replace(/\.\*/g, '').replace(/\.\+/g, ''); // contains-wildcards
  s = s.trim();
  const forms = expandOptional(s, ctx);
  const out = [];
  for (const form of forms) {
    const tok = form.toLowerCase();
    if (tok === '') throw new Error(`sourceContract.normalizeAlternative: empty token from ${ctx}`);
    if (/[.*+?[\]{}()|\\^$]/.test(tok)) {
      throw new Error(`sourceContract.normalizeAlternative: unhandled regex metachar in "${tok}" from ${ctx}`);
    }
    out.push(tok);
  }
  return out;
}

/**
 * Expand a single optional-char quantifier `c?` into [without-c, with-c]. Multiple `?`,
 * a leading `?`, or a `?` applied to a metachar are unhandled → throw (fail closed).
 */
function expandOptional(s, ctx) {
  const qi = s.indexOf('?');
  if (qi < 0) return [s];
  if (s.indexOf('?', qi + 1) >= 0) throw new Error(`sourceContract: multiple '?' in "${s}" from ${ctx} — unhandled`);
  if (qi === 0) throw new Error(`sourceContract: leading '?' in "${s}" from ${ctx}`);
  const optChar = s[qi - 1];
  if (/[.*+[\]{}()|\\^$]/.test(optChar)) throw new Error(`sourceContract: '?' applies to a metachar in "${s}" from ${ctx}`);
  const without = s.slice(0, qi - 1) + s.slice(qi + 1);
  const withChar = s.slice(0, qi) + s.slice(qi + 1);
  return [without, withChar];
}

/** Split a top-level regex alternation on `|`; throws on nested groups or an empty alt. */
function splitTopLevelAlternation(body, ctx) {
  if (/[()]/.test(body)) {
    throw new Error(`sourceContract: nested group/paren in alternation "${body}" (${ctx}) — unhandled`);
  }
  const parts = body.split('|').map((p) => p.trim());
  for (const p of parts) {
    if (p === '') throw new Error(`sourceContract: empty alternative in "${body}" (${ctx})`);
  }
  return parts;
}

/**
 * Extract the CONCRETE denied-key stems from a JS regex SOURCE string (e.g.
 * `COVERT_KEY_RE.source`). Strips a single wrapping capture group, splits the top-level
 * alternation, and normalizes each alternative. THROWS on a zero-token result — a reshaped
 * regex that no longer parses reddens instead of quietly checking nothing.
 * @param {string} regexSource
 * @returns {string[]} deduped, lowercase concrete key stems
 */
export function jsRegexTokens(regexSource) {
  if (typeof regexSource !== 'string') throw new Error('sourceContract.jsRegexTokens: expected a regex source string');
  let body = regexSource.trim();
  if (body.startsWith('(') && body.endsWith(')')) body = body.slice(1, -1);
  const alts = splitTopLevelAlternation(body, 'jsRegexTokens');
  const tokens = new Set();
  for (const alt of alts) {
    for (const tok of normalizeAlternative(alt, `jsRegex alt "${alt}"`)) tokens.add(tok);
  }
  if (tokens.size === 0) throw new Error('sourceContract.jsRegexTokens: produced zero tokens (vacuous)');
  return [...tokens];
}

/**
 * Extract the SQL denylist alternation from a `key ~* ('^(a|b|.*c.*)$')` scanner body as
 * an array of JS-RegExp-usable alternative SOURCES (`\m`/`\y` boundaries stripped; `.*` and
 * `?` preserved). Comments are stripped FIRST so comment prose cannot pollute the tokens,
 * and the alternation is rebuilt from the CONCATENATED single-quoted string literals in
 * the `~* (...)` expression. THROWS when the expression is absent, an alternative is empty,
 * or an alternative is not a valid regex — never returns an empty set.
 *
 * Each returned alternative is meant to be applied as `^alt$` against a candidate key, so
 * membership is "the SQL denylist would deny this key" — NOT a substring match against the
 * whole scanner blob (the M8 defect: `hook` passing merely because `plothook` contains it).
 * @param {string} sql  a SQL function body (already-lowercased is fine)
 * @returns {string[]} lowercase JS-regex alternative sources
 */
export function sqlRegexAlternation(sql) {
  if (typeof sql !== 'string') throw new Error('sourceContract.sqlRegexAlternation: expected a SQL string');
  const noComments = sql.replace(/--[^\n]*/g, '');
  const expr = noComments.match(/~\*\s*\(([\s\S]*?)\)\s*then/i);
  if (!expr) throw new Error('sourceContract.sqlRegexAlternation: no `key ~* (...) then` regex expression found');
  const literals = [...expr[1].matchAll(/'((?:[^']|'')*)'/g)].map((m) => m[1].replace(/''/g, "'"));
  if (literals.length === 0) throw new Error('sourceContract.sqlRegexAlternation: no string literals in the regex expression');
  let re = literals.join('');
  re = re.replace(/^\^\(/, '').replace(/\)\$$/, ''); // ^( ... )$ anchors
  re = re.replace(/\\[myMY]/g, '');                  // Postgres \m \M \y \Y (invalid in JS RegExp)
  const alts = re.split('|').map((a) => a.trim().toLowerCase());
  for (const a of alts) {
    if (a === '') throw new Error(`sourceContract.sqlRegexAlternation: empty alternative in "${re}"`);
    try { new RegExp(`^${a}$`); } catch { throw new Error(`sourceContract.sqlRegexAlternation: alternative "${a}" is not a valid regex`); }
  }
  if (alts.length === 0) throw new Error('sourceContract.sqlRegexAlternation: zero alternatives (vacuous)');
  return alts;
}
