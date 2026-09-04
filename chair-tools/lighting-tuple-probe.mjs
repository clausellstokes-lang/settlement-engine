#!/usr/bin/env node
// lighting-tuple-probe.mjs — print a tree's LIVE lighting-census tuple in ONE pass.
// Usage:  node lighting-tuple-probe.mjs <tree-path>     (a repo checkout or `git archive` extract
//         with node_modules resolvable)  ->  files / parked / credited / titles / suiteTitles
// Why:    measure your census bill before HOLD instead of predicting it by arithmetic.
//
// ⭐ IT RUNS THE TARGET TREE'S OWN CLASSIFIER, IT DOES NOT REIMPLEMENT IT. The tool reads
// tests/lint/sovereigntyLightingContract.walker.test.js FROM THE TREE UNDER TEST, truncates it
// at the first top-level `describe(` — everything above that line is pure: the imports, ROOT,
// the TEST_FILES walk, classify(), parkReasonsFor/liveTitlesIn/liveSuiteTitlesIn and
// measureCensus() itself — and calls measureCensus() directly. So the tool cannot drift from
// the walker: if the walker's park grammar changes, this reports the new grammar's answer.
//
// ⛔ THE CLASS IT EXISTS FOR. The walker's census assertion throws on its FIRST mismatching
// figure, so a red tells you one number and hides the other four; and the natural fallback —
// predicting the delta from per-file title counts — is wrong whenever a file's PARK STATE
// flips, because a parked file's titles are census-invisible at both ends. A single
// parameterised callback (`it.each`, `test.each`, a `for…of` at a describe/test statement
// position) parks a file WHOLE and takes every literal title in it out of evidence. That shape
// has now bitten three times: INSTR-2, HYGIENE, and GLYPH car B (2026-09-01), where one
// `it.each` moved four of the five figures at once — parked +1, credited -1, titles -12,
// suiteTitles -1 — while the assertion could only ever name the first.
//
// ⚠ It measures the WORKING TREE, exactly as the walker does. Measure a clean tree, or a
// `git archive` extract, or you will charge another lane's uncommitted files to yourself.
// This tool only READS the target tree apart from one temp file it writes into tests/lint/
// and always removes; that file is `.mjs`, which TEST_FILES (`\.test\.(js|jsx)$`) cannot see,
// so the probe can never count itself.

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const WALKER_REL = 'tests/lint/sovereigntyLightingContract.walker.test.js';
const KEYS = ['files', 'parked', 'credited', 'titles', 'suiteTitles'];

const treeArg = process.argv[2];
if (!treeArg) {
  console.error('usage: node lighting-tuple-probe.mjs <tree-path>');
  process.exit(2);
}
const tree = resolve(treeArg);
const walkerPath = join(tree, WALKER_REL);

let src;
try {
  src = readFileSync(walkerPath, 'utf8');
} catch {
  console.error(`no walker at ${walkerPath} — is that a repo tree?`);
  process.exit(2);
}

// Truncate at the first TOP-LEVEL `describe(` — column 0, so a nested/indented one cannot
// match. Everything above is the pure region.
const cut = src.search(/^describe\(/m);
if (cut < 0) {
  console.error('could not find a top-level `describe(` — the walker changed shape; re-read it.');
  process.exit(2);
}

const pure = src.slice(0, cut)
  // The pure region imports vitest for the assertions we just cut away. Stub it so the probe
  // needs no test runner; if anything above the cut actually CALLS expect(), we want to know
  // rather than silently measure under a fake, so the stub throws.
  .replace(
    /^import \{[^}]*\} from 'vitest';$/m,
    'const describe = () => {}; const test = () => {};\n'
    + "const expect = () => { throw new Error('probe: expect() called in the pure region'); };\n"
    + 'expect.soft = expect; expect.extend = () => {};',
  );

const probe = `${pure}\nconsole.log(JSON.stringify(measureCensus().figures));\n`;
const tmp = join(tree, 'tests', 'lint', `.lighting-tuple-probe.${process.pid}.mjs`);

let out;
try {
  writeFileSync(tmp, probe, 'utf8');
  out = execFileSync(process.execPath, [tmp], { cwd: tree, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (err) {
  console.error('probe failed:', err.stderr || err.message);
  try { unlinkSync(tmp); } catch { /* already gone */ }
  process.exit(1);
} finally {
  try { unlinkSync(tmp); } catch { /* already gone */ }
}

const figures = JSON.parse(out.trim().split('\n').pop());
if (figures.parked + figures.credited !== figures.files) {
  console.error(`INCOHERENT: ${figures.parked} parked + ${figures.credited} credited !== ${figures.files} files`);
  process.exit(1);
}
for (const k of KEYS) console.log(`${k.padEnd(12)} ${figures[k]}`);
console.log(`tuple        ${KEYS.map((k) => figures[k]).join('/')}`);
