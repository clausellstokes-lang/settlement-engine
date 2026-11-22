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
  // ⚠ ANCHORED AT LINE START (`^` + m) and NET-CURRENT (the LAST definition
  // wins), matching the house extractor idiom: the old indexOf substring
  // search took the FIRST occurrence anywhere, so a header quoting the
  // statement in prose became the "definition" and a later re-creation of the
  // same function was never seen. Canonical writeup:
  // tests/security/moneyRpcNetCurrentGuards.test.js.
  const nameEsc = fnName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+${nameEsc}\\b`, 'gim');
  let m;
  let start = -1;
  while ((m = re.exec(src)) !== null) start = m.index;
  if (start < 0) throw new Error(`sourceContract.sqlFunctionBody: "create or replace function ${fnName}" not found in source`);
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

/**
 * The STATEMENT WINDOW a source offset belongs to: from the start of its physical
 * line forward to the close of whatever brackets that line opens, plus the rest of
 * the statement.
 *
 * WHY THIS EXISTS. A source scan that requires two patterns to match ONE PHYSICAL
 * LINE goes blind the moment a formatter splits the call — and prettier's
 * multi-line call form is the LIKELY shape for a long argument list, which is
 * exactly the shape a leaked secret travels in. `console.log(` on one line and
 * `providerKey.key,` on the next satisfies neither half of a per-line conjunction,
 * so the guard passes while the leak ships.
 *
 * The window is bounded by the line's OWN brackets, so it can never sweep in an
 * unrelated neighbouring statement: a balanced call closes and the scan stops at
 * the terminator. That is what makes this a restored dimension rather than a
 * widened claim.
 *
 * @param {string} src
 * @param {number} index  any offset inside the line the window should start at
 * @returns {string} the statement text, starting at that line's first column
 */
export function statementWindowAt(src, index) {
  if (typeof src !== 'string') throw new Error('sourceContract.statementWindowAt: source is not a string');
  if (!Number.isInteger(index) || index < 0 || index >= src.length) {
    throw new Error(`sourceContract.statementWindowAt: offset ${index} is outside the source`);
  }
  const start = src.lastIndexOf('\n', index) + 1;
  let depth = 0;
  let cursor = start;
  for (; cursor < src.length; cursor += 1) {
    const ch = src[cursor];
    if (ch === '(' || ch === '[' || ch === '{') depth += 1;
    else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
    else if (ch === ';' && depth === 0) { cursor += 1; break; }
    else if (ch === '\n' && depth === 0) break;
  }
  return src.slice(start, cursor);
}

/**
 * STATEMENT-GRANULAR sink × carrier scan. For every line that matches `sinkRe`,
 * test `carrierRe` over that line's whole STATEMENT window. Returns one
 * `label:line: text` row per offending statement.
 *
 * Fail-closed like every other extractor here: an empty source or a non-RegExp
 * pattern throws rather than returning an empty offender list, because "no
 * offenders" and "nothing was scanned" must never be the same value.
 *
 * @param {string} src
 * @param {RegExp} sinkRe      the logging/telemetry sink pattern
 * @param {RegExp} carrierRe   the forbidden-value carrier pattern
 * @param {string} label       file label for the offender rows
 * @returns {string[]}
 */
export function sinkStatementOffenders(src, sinkRe, carrierRe, label) {
  const ctx = label || 'sinkStatementOffenders';
  if (typeof src !== 'string' || src.length === 0) {
    throw new Error(`sourceContract.sinkStatementOffenders: source is empty or not a string (${ctx})`);
  }
  if (!(sinkRe instanceof RegExp) || !(carrierRe instanceof RegExp)) {
    throw new Error(`sourceContract.sinkStatementOffenders: both patterns must be RegExp (${ctx})`);
  }
  const scan = new RegExp(sinkRe.source, sinkRe.flags.includes('g') ? sinkRe.flags : `${sinkRe.flags}g`);
  const carrier = new RegExp(carrierRe.source, carrierRe.flags.replace('g', ''));
  const offenders = [];
  const seenLines = new Set();
  let match = scan.exec(src);
  while (match !== null) {
    if (match[0] === '') { scan.lastIndex += 1; match = scan.exec(src); continue; }
    const lineStart = src.lastIndexOf('\n', match.index) + 1;
    if (!seenLines.has(lineStart) && carrier.test(statementWindowAt(src, match.index))) {
      seenLines.add(lineStart);
      const lineEnd = src.indexOf('\n', lineStart);
      const text = src.slice(lineStart, lineEnd === -1 ? src.length : lineEnd).trim();
      offenders.push(`${ctx}:${src.slice(0, lineStart).split('\n').length}: ${text}`);
    }
    match = scan.exec(src);
  }
  return offenders;
}

/**
 * ⛔ DELIBERATELY BLIND. The PRE-CURE per-physical-line conjunction, kept as an
 * executable record of the dimension `sinkStatementOffenders` restored.
 *
 * It exists for ONE purpose: a cure's control arm can plant a multi-line offender,
 * assert the statement scan catches it, and assert THIS returns nothing — which is
 * what makes the pair discriminating rather than decorative. If a future edit
 * narrows the window back to one physical line, the control arm above it stops
 * passing and the loss is named instead of silent.
 *
 * ⛔ NEVER call this from a live guard. It is the defect, preserved on purpose.
 *
 * @param {string} src
 * @param {RegExp} sinkRe
 * @param {RegExp} carrierRe
 * @returns {string[]} the offending physical lines, trimmed
 */
export function sinkLineOffendersBlind(src, sinkRe, carrierRe) {
  if (typeof src !== 'string') throw new Error('sourceContract.sinkLineOffendersBlind: source is not a string');
  const sink = new RegExp(sinkRe.source, sinkRe.flags.replace('g', ''));
  const carrier = new RegExp(carrierRe.source, carrierRe.flags.replace('g', ''));
  return src.split('\n').map((line) => line.trim())
    .filter((line) => sink.test(line) && carrier.test(line));
}
