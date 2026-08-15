#!/usr/bin/env node
/**
 * count-transcendental-math.mjs — the sim-path transcendental-float counter/ratchet.
 *
 * WHY. IEEE-754 (and the ECMAScript spec) require +, -, *, /, and Math.sqrt to be
 * correctly rounded — bit-identical on every engine. Every TRANSCENDENTAL Math
 * function (sin/cos/tan/exp/log/pow/…) and the `**` operator (spec'd as Math.pow)
 * are only "implementation-approximated": V8, JSC, and SpiderMonkey may disagree in
 * the last ulp. A transcendental result that feeds a threshold, an rng-consuming
 * branch, or a persisted value in seeded code can therefore fork same-seed worlds
 * ACROSS engines while every same-engine golden stays green — the same silent class
 * the Math.random / Date / locale bans close, which until now had NO structural
 * guard of its own (the cross-engine caveat lived as prose in contestMath.js only).
 *
 * WHAT. Counts transcendental Math.<fn>( calls plus `**` / `**=` operators OUTSIDE
 * comments and string literals, per file, across the same seeded/persisted trees the
 * localeCompare source-scan covers (localeCompareGuard.test.js TREES). The tally is
 * a frozen shrink-only baseline (tests/lint/.transcendental-math-baseline.json,
 * enforced by tests/lint/transcendentalMathBaseline.test.js): existing sites are
 * grandfathered — they are covered by the same-engine goldens + the worker
 * byte-identity pin, and contestMath.js carries the cross-engine caveat — but a NEW
 * site cannot land invisibly: it reds the exact-match test, and total growth is
 * additionally capped by the CEILING pinned in the test (the domain-any idiom, so
 * even `--update` cannot quietly raise the total).
 *
 * CANNOT-CATCH (documented, pinned by fixtures where checkable): code inside
 * template-literal `${…}` interpolations (skipped with the string), and regex
 * literals (not lexed; an unescaped `**` cannot occur in a valid regex body, and
 * escaped `\*\*` is excluded by the detector's look-behind).
 *
 * Run `node scripts/count-transcendental-math.mjs` for the tally, or `--update` to
 * re-freeze the baseline after a burn-down (the committed total must never rise).
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
export const BASELINE = path.join(ROOT, 'tests', 'lint', '.transcendental-math-baseline.json');

// The seeded/persisted trees — kept in lockstep with localeCompareGuard.test.js.
export const TREES = ['src/generators', 'src/domain', 'src/workers', 'src/kernel', 'src/pdf', 'src/lib/instantWorld'];

// Every implementation-approximated Math function (ES2026 §21.3.2). Math.sqrt is
// deliberately ABSENT: the spec requires it correctly rounded (cross-engine exact).
export const TRANSCENDENTAL_FNS = [
  'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'cbrt', 'cos', 'cosh',
  'exp', 'expm1', 'hypot', 'log', 'log10', 'log1p', 'log2', 'pow', 'sin', 'sinh',
  'tan', 'tanh',
];

const CALL_RE = new RegExp(`\\bMath\\s*\\.\\s*(?:${TRANSCENDENTAL_FNS.join('|')})\\s*\\(`, 'g');
// `**` / `**=` as an operator: not preceded by another `*` or a backslash (regex
// `\*\*` escapes), not followed by another `*`. Comments are already stripped.
const POW_OP_RE = /(?<![*\\])\*\*(?!\*)/g;

/**
 * Strip comments and string literals (a small state machine — regex-only stripping
 * mis-nests on strings containing `//` such as URLs). Template `${…}` interpolations
 * are skipped with their template (documented CANNOT-CATCH). Regex literals are not
 * lexed (see header). Stripped spans are replaced with spaces so nothing concatenates.
 * @param {string} text
 * @returns {string}
 */
export function stripCommentsAndStrings(text) {
  let out = '';
  let i = 0;
  const n = text.length;
  while (i < n) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      out += text.slice(i, stop).replace(/[^\n]/g, ' ');
      i = stop;
    } else if (ch === '/' && next === '/') {
      const end = text.indexOf('\n', i + 2);
      const stop = end === -1 ? n : end;
      out += ' '.repeat(stop - i);
      i = stop;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      let j = i + 1;
      while (j < n) {
        if (text[j] === '\\') j += 2;
        else if (text[j] === quote) { j += 1; break; }
        else j += 1;
      }
      out += text.slice(i, j).replace(/[^\n]/g, ' ');
      i = j;
    } else {
      out += ch;
      i += 1;
    }
  }
  return out;
}

/**
 * Count transcendental Math calls + `**` operators in one file's source text.
 * @param {string} text
 * @returns {number}
 */
export function countText(text) {
  const code = stripCommentsAndStrings(text);
  const calls = (code.match(CALL_RE) || []).length;
  const pows = (code.match(POW_OP_RE) || []).length;
  return calls + pows;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.js') || e.endsWith('.jsx')) out.push(p);
  }
  return out;
}

/**
 * Tally all six trees. Only files with sites appear in `files`.
 * @returns {{ total: number, files: Record<string, number> }}
 */
export function countTrees() {
  /** @type {Record<string, number>} */
  const files = {};
  let total = 0;
  for (const tree of TREES) {
    for (const abs of walk(path.join(ROOT, tree)).sort()) {
      const count = countText(fs.readFileSync(abs, 'utf8'));
      if (!count) continue;
      const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
      files[rel] = count;
      total += count;
    }
  }
  return { total, files };
}

// CLI: report, or `--update` to re-freeze the baseline.
if (import.meta.url === url.pathToFileURL(process.argv[1] || '').href) {
  const tally = countTrees();
  if (process.argv.includes('--update')) {
    fs.writeFileSync(BASELINE, `${JSON.stringify(tally, null, 2)}\n`);
    console.log(`[transcendental-math] baseline updated: ${tally.total} sites across ${Object.keys(tally.files).length} files.`);
  } else {
    const top = Object.entries(tally.files).sort(([, a], [, b]) => b - a).slice(0, 15);
    console.log(`[transcendental-math] ${tally.total} sites across ${Object.keys(tally.files).length} files.`);
    console.log('top files:');
    for (const [f, c] of top) console.log(`  ${c}\t${f}`);
  }
}
