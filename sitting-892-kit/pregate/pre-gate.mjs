#!/usr/bin/env node
/**
 * pre-gate.mjs — THE CHEAP HALF OF `npm run check`, RUN WITH `;` INSTEAD OF `&&`.
 *
 * ⭐ WHY THIS EXISTS, MEASURED. `npm run check` is a 17-stage `&&` chain, so it reports
 * EXACTLY ONE failure per run and you learn about the cheapest defect at the same price as
 * the dearest. Measured on the night of 2026-09-02 at f5a6c3bbf:
 *
 *     gate-885 run 1  23:06:39 -> 23:07:10   31 s   RED at stage 13 (typecheck:domain:strict)
 *     gate-885 run 2  23:12:37 -> 23:29:18  1001 s  RED inside stage 15 (lighting census)
 *     gate-885 run 3  00:19:01 -> 00:37:57  1136 s  RED inside stage 15 (writerReach budget)
 *     gate-instr      21:09:30 -> 21:27:18  1068 s  GREEN, all 17
 *
 * Run 1 shows the whole point: the first thirteen stages cost 31 seconds. A red that lives in
 * them is discoverable in half a minute, and yet a lane that has three of them pays three full
 * cycles to find all three, because `&&` stops at the first.
 *
 * ⭐ THE STAGE LIST IS DERIVED FROM `package.json`, NEVER HAND-COPIED. A hand-copied list goes
 * stale the day a stage is added, and a pre-gate that silently skips a new stage is worse than
 * no pre-gate: it hands out a green that the real gate will refuse. So the roster is read out of
 * the repo's own `check` script every run, and it is PRINTED BEFORE ANYTHING RUNS so that drift
 * is visible to the reader rather than inferred.
 *
 * ⭐ THE CHEAP/EXPENSIVE SPLIT IS ALSO DERIVED, AND IT FAILS SAFE. A stage is EXPENSIVE only if
 * its resolved command text (following `npm run` references and npm's own pre/post hooks) names
 * one of the suite/build markers below. Anything else — INCLUDING A STAGE NOBODY HAS SEEN
 * BEFORE — is treated as cheap and IS RUN. The failure mode of that default is a slower pre-gate;
 * the failure mode of the opposite default is a false green. Only one of those is recoverable.
 *
 * ⛔ THIS IS NOT THE GATE. A green here means the cheap stages passed. It says NOTHING about
 * `test:ratchet`, `build` or `verify:dist`, and it is never a substitute for `npm run check`.
 *
 * Usage:
 *   node scripts/pre-gate.mjs            # print the roster, run every cheap stage, table, exit
 *   node scripts/pre-gate.mjs --list     # print the roster and exit 0, running nothing
 *
 * Exit: 0 = every cheap stage passed. 1 = at least one cheap stage failed.
 *       2 = the pre-gate could not derive its own roster (it refuses to guess one).
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG_PATH = join(ROOT, 'package.json');

/**
 * The markers that make a stage too dear for a pre-gate. These name MECHANISMS (the test
 * runner, the bundler, the suite mutex), not stage names, which is why adding a stage called
 * `test:something-new` needs no edit here: its command will name `vitest` or the mutex and be
 * classified on that evidence.
 */
const EXPENSIVE_MARKERS = Object.freeze([
  'vitest',
  'vite build',
  'gate-mutex.sh',
  'check-test-ratchet',
]);

function readScripts() {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8'));
  } catch (error) {
    console.error(`[pre-gate] cannot read ${PKG_PATH}: ${error.message}`);
    process.exit(2);
  }
  const scripts = pkg && pkg.scripts;
  if (!scripts || typeof scripts !== 'object') {
    console.error('[pre-gate] package.json has no "scripts" object — refusing to guess a roster.');
    process.exit(2);
  }
  if (typeof scripts.check !== 'string' || scripts.check.trim() === '') {
    console.error('[pre-gate] package.json has no "check" script — refusing to guess a roster.');
    process.exit(2);
  }
  return scripts;
}

/** Split the `check` chain on `&&` into its stages, preserving order. */
function deriveStages(checkScript) {
  return checkScript
    .split('&&')
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

/** `npm run foo` -> `foo`; anything else -> null (the token is a raw shell command). */
function stageScriptName(token) {
  const m = /^npm\s+run\s+(?:--\S+\s+)*([^\s]+)\s*$/.exec(token);
  return m ? m[1] : null;
}

/**
 * The full command text a stage will execute, following `npm run` references and npm's own
 * pre/post lifecycle hooks, bounded so a cyclic script cannot hang the classifier.
 */
function resolveCommandText(scripts, name, seen = new Set(), depth = 0) {
  if (depth > 8 || seen.has(name)) return '';
  seen.add(name);
  const parts = [];
  for (const key of [`pre${name}`, name, `post${name}`]) {
    const body = scripts[key];
    if (typeof body !== 'string') continue;
    parts.push(body);
    for (const seg of body.split(/&&|\|\||;/)) {
      const ref = stageScriptName(seg.trim());
      if (ref && ref !== name) parts.push(resolveCommandText(scripts, ref, seen, depth + 1));
    }
  }
  return parts.join(' ; ');
}

function classify(scripts, token) {
  const name = stageScriptName(token);
  const resolved = name === null ? token : resolveCommandText(scripts, name, new Set(), 0);
  const hit = EXPENSIVE_MARKERS.find((m) => resolved.includes(m));
  return {
    token,
    name,
    resolved: resolved.replace(/\s+/g, ' ').trim(),
    expensive: Boolean(hit),
    marker: hit ?? null,
    unresolved: name !== null && typeof scripts[name] !== 'string',
  };
}

function pad(s, n) {
  const t = String(s);
  return t.length >= n ? t : t + ' '.repeat(n - t.length);
}

function printRoster(stages) {
  console.log('[pre-gate] ROSTER — derived from package.json "check" this run, not hand-copied.');
  console.log(`[pre-gate] ${stages.length} stage(s) in the chain.`);
  console.log('');
  console.log(`  ##  ${pad('STAGE', 34)}${pad('CLASS', 10)}WHY`);
  console.log(`  --  ${pad('-----', 34)}${pad('-----', 10)}---`);
  for (const [i, st] of stages.entries()) {
    const why = st.unresolved
      ? 'NO SUCH SCRIPT in package.json — will run and let npm report it'
      : st.expensive
        ? `names "${st.marker}"`
        : 'no suite/build marker in its resolved command';
    console.log(
      `  ${pad(i + 1, 2)}  ${pad(st.name ?? `(raw) ${st.token}`, 34)}${pad(st.expensive ? 'SKIP' : 'CHEAP', 10)}${why}`,
    );
  }
  console.log('');
  const skipped = stages.filter((s) => s.expensive);
  console.log(
    `[pre-gate] ${stages.length - skipped.length} cheap stage(s) will RUN with ";" semantics; ` +
      `${skipped.length} expensive stage(s) SKIPPED (${skipped.map((s) => s.name).join(', ')}).`,
  );
  console.log('[pre-gate] ⛔ A green here is NOT a gate. The skipped stages are unmeasured.');
  console.log('');
}

function main() {
  const listOnly = process.argv.includes('--list');
  const scripts = readScripts();
  const tokens = deriveStages(scripts.check);
  if (tokens.length === 0) {
    console.error('[pre-gate] the "check" script split to zero stages — refusing to guess.');
    process.exit(2);
  }
  const stages = tokens.map((t) => classify(scripts, t));
  printRoster(stages);
  if (listOnly) return 0;

  const cheap = stages.filter((s) => !s.expensive);
  const results = [];
  for (const st of cheap) {
    const label = st.name ?? st.token;
    console.log(`\n[pre-gate] ───── STAGE ${label} ─────`);
    const t0 = Date.now();
    // `;` semantics live HERE: every stage is spawned regardless of what the last one returned.
    const argv = st.name === null ? ['-c', st.token] : ['run', st.name];
    const bin = st.name === null ? 'sh' : 'npm';
    const r = spawnSync(bin, argv, { cwd: ROOT, stdio: 'inherit' });
    const secs = (Date.now() - t0) / 1000;
    // A spawn that never started has a null status; that is a FAILURE, not a pass.
    const code = r.error ? 127 : r.status === null ? 129 : r.status;
    if (r.error) console.error(`[pre-gate] stage ${label} could not be spawned: ${r.error.message}`);
    results.push({ label, code, secs });
  }

  const failed = results.filter((r) => r.code !== 0);
  const total = results.reduce((a, r) => a + r.secs, 0);
  console.log('\n[pre-gate] ══════ VERDICT ══════');
  console.log(`  ${pad('STAGE', 34)}${pad('EXIT', 7)}SECONDS`);
  console.log(`  ${pad('-----', 34)}${pad('----', 7)}-------`);
  for (const r of results) {
    console.log(`  ${pad(r.label, 34)}${pad(r.code === 0 ? 'ok' : `FAIL ${r.code}`, 7)}${r.secs.toFixed(1)}`);
  }
  console.log(`  ${pad('(total)', 34)}${pad('', 7)}${total.toFixed(1)}`);
  console.log('');
  if (failed.length === 0) {
    console.log(
      `[pre-gate] ALL ${results.length} CHEAP STAGE(S) PASSED in ${total.toFixed(1)}s. ` +
        'The expensive stages remain unmeasured — run the real gate.',
    );
    return 0;
  }
  console.log(
    `[pre-gate] ${failed.length} of ${results.length} CHEAP STAGE(S) FAILED: ` +
      `${failed.map((r) => r.label).join(', ')}. ` +
      'Every stage after each failure still ran, so this list is COMPLETE for the cheap half.',
  );
  return 1;
}

process.exit(main());
