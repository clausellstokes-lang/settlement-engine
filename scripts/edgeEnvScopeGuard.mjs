/**
 * edgeEnvScopeGuard.mjs — HABITAT REMOVAL FOR THE SHARED-`Deno.env` LEAK CLASS.
 *
 * ⛔⛔ THE CLASS. `deno.json`'s `test:edge` task runs `deno test` WITHOUT `--parallel`, so
 * every edge suite shares ONE process and ONE `Deno.env`. A `Deno.env.set` at MODULE TOP
 * therefore runs during import — before any test body anywhere — and is never restored, so
 * it is ambient for every other suite in the run. `_shared/cors.ts` re-reads `CLIENT_URL`
 * per request to compose `configuredOrigins()`, whose FIRST entry is what a fail-closed
 * response pins to; one suite's unrestored `CLIENT_URL` re-pointed exactly that value under
 * another suite's CORS pins and red the `deno-tests` CI job (laneTE33 §1).
 *
 * ⛔ THE CURE IS A SEAM, SO THE GUARD IS A SCAN. `supabase/functions/_shared/scopedTestEnv.ts`
 * applies a suite's stubs for its module-scope import, releases them immediately, and
 * re-applies them only for the duration of each test body. Curing the 88 sites that existed
 * fixes today; this scan is what stops the 89th, because the leak is SILENT — it does not
 * break the file that causes it, only some alphabetically later stranger.
 *
 * ⚠ WHY THE GUARD LIVES HERE AND NOT IN A DENO TEST. A source-scanning Deno test would need
 * `--allow-read`, which `test:edge`'s flags do not grant; adding the flag changes the CI
 * job's own command. This module is pure and is driven by `validate-edge-functions.mjs`,
 * which already walks the same tree inside `npm run check`.
 *
 * PURE: a function of (source, label). No filesystem, no process, no exit — the caller does
 * the I/O, which is what lets the planted controls run the REAL detector over fixtures.
 */

/**
 * Blank out string literals, template literals and comments, replacing each with spaces of
 * the same length so byte offsets and line numbers are preserved. Depth counting then reads
 * only real code punctuation.
 *
 * ⚠ A TEMPLATE LITERAL'S `${…}` INTERPOLATION IS BLANKED WHOLE. Code inside an
 * interpolation is not module-top code by any reading that matters here, and treating the
 * literal as opaque is what keeps the brace counter from being desynchronised by a stray
 * unbalanced brace inside a string.
 * @param {string} source
 * @returns {string}
 */
export function blankLiterals(source) {
  const out = source.split('');
  const blank = (from, to) => {
    for (let k = from; k < to && k < out.length; k += 1) {
      if (out[k] !== '\n') out[k] = ' ';
    }
  };
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      blank(i, end === -1 ? source.length : end);
      i = end === -1 ? source.length : end;
      continue;
    }
    if (ch === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      blank(i, stop);
      i = stop;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < source.length) {
        if (source[j] === '\\') { j += 2; continue; }
        if (source[j] === ch) break;
        j += 1;
      }
      blank(i, Math.min(j + 1, source.length));
      i = j + 1;
      continue;
    }
    i += 1;
  }
  return out.join('');
}

/** The mutating members of `Deno.env`. A read (`get`) is harmless; these are not. */
export const ENV_MUTATORS = Object.freeze(['set', 'delete']);

const MUTATION_RE = /\bDeno\.env\.(set|delete)\s*\(/g;

/**
 * Every `Deno.env.set` / `Deno.env.delete` that executes at MODULE SCOPE — depth zero in
 * the blanked source, so a call inside any function body, test body or block is not an
 * offender.
 *
 * @param {string} source  the file's text
 * @param {string} label   how the offender should name itself (a repo-relative path)
 * @returns {string[]} one line per offender; empty means the file is clean
 */
export function moduleTopEnvMutationOffenders(source, label) {
  const code = blankLiterals(String(source ?? ''));
  const depthAt = new Int32Array(code.length);
  let depth = 0;
  for (let i = 0; i < code.length; i += 1) {
    depthAt[i] = depth;
    const ch = code[i];
    if (ch === '{' || ch === '(' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
  }
  const offenders = [];
  MUTATION_RE.lastIndex = 0;
  let match = MUTATION_RE.exec(code);
  while (match) {
    if (depthAt[match.index] === 0) {
      const line = code.slice(0, match.index).split('\n').length;
      offenders.push(
        `${label}:${line}: Deno.env.${match[1]} at MODULE SCOPE. \`deno test\` runs the edge `
        + 'suites in ONE process with ONE Deno.env, so this mutation is ambient for every '
        + 'other suite and is never restored — it has red the deno-tests job before. Use '
        + '`installScopedTestEnv({…})` from supabase/functions/_shared/scopedTestEnv.ts: it '
        + 'applies the stubs for the module-scope import, `release()`s them immediately, and '
        + 're-applies them only inside each `scopedEnv.test(...)` body.',
      );
    }
    match = MUTATION_RE.exec(code);
  }
  return offenders;
}
