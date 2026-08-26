#!/usr/bin/env node
/**
 * harness/laneREGF0/makeTrace.mjs — ⭐ REG-F0 · builds `folioTrace.mjs`, a LINE-PRESERVING traced
 * twin of `harness/renderFolio.mjs`.
 *
 * ⛔ WHY A TWIN AND NOT AN EDIT: `renderFolio.mjs` is the SHIPPING surface's renderer and this
 * lane's dormancy rests on it being untouched. The twin exists so a root-level element can be
 * ATTRIBUTED TO THE STAGE THAT EMITTED IT — the folio pushes 888 ungrouped `<path>`s and no
 * source census can say which stage owns which.
 *
 * ⭐ THE TRANSFORM IS LINE-PRESERVING BY CONSTRUCTION (three same-line substitutions, prologue
 * APPENDED at EOF) so every trace line number is a line number in the ORIGINAL file. The control
 * that this is a pure superset is `traceControl.mjs`: the twin's SVG must be byte-identical.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'renderFolio.mjs');
const OUT = join(HERE, 'folioTrace.mjs');

/**
 * ⭐ REGENERATED ON EVERY RUN, NEVER COMMITTED. `folioTrace.mjs` is a 3,273-line twin of a file
 * this lane must not touch; a committed copy would go stale the moment `renderFolio.mjs` moved and
 * a successor would trace last month's drawing. Its consumers call `buildTrace()` first.
 */
export function buildTrace() {
const lines = readFileSync(SRC, 'utf8').split('\n');
const n0 = lines.length;
const sub = (idx, from, to) => {
  const L = lines[idx];
  if (!L.includes(from)) throw new Error(`ANCHOR_MISSING at line ${idx + 1}: ${from}`);
  lines[idx] = L.replace(from, to);
};
// ⚠ Every anchor is ASSERTED, never assumed — a moved line throws rather than tracing nothing.
sub(461, 'prims.n++;', 'prims.n++; __T.push({ k: "add", line: __at(), style });');
sub(465, 'flush(id) {', 'flush(id) { __T.push({ k: "flush", id: id || null, line: __at(), n: order.length });');
sub(673, 'const push = (s) => { out.push(s); els++; };',
  'const push = (s) => { out.push(s); els++; __T.push({ k: "push", line: __at(), idx: out.length - 1 }); };');
// ⭐ `prims.n` is incremented at ~140 SITES, of which the batcher's `add` is only one — a trace
//   that watched `add` alone reported 3,624 primitives against a true 82,405. The Proxy catches
//   EVERY write with the writing stack, which is the only complete accounting available.
sub(672, 'const prims = { n: 0 };',
  'const prims = new Proxy({ n: 0 }, { set(t, k, v) { if (k === "n") __T.push({ k: "prim", line: __at(), d: v - t.n }); t[k] = v; return true; } });');
// ⭐ publish the raw draw list so group NESTING is computed off the real array rather than
//   re-parsed out of the concatenated string.
sub(3248, 'return {', 'return { __out: out.slice(),');
// Also fix the import path — the twin sits one directory deeper.
for (let i = 0; i < lines.length; i++) {
  lines[i] = lines[i].replace(/(['"])\.\.\/src\//g, '$1../../src/');
}
if (lines.length !== n0) throw new Error('LINE_COUNT_MOVED');

lines.push(
  '',
  '/* ── REG-F0 TRACE PROLOGUE — APPENDED AT EOF so every line number above is unmoved. */',
  'export const __T = [];',
  'export function __resetTrace() { __T.length = 0; }',
  'function __at() {',
  '  const s = String(new Error().stack || "").split("\\n");',
  '  const hits = [];',
  '  for (let i = 2; i < s.length && hits.length < 4; i++) {',
  '    const m = s[i].match(/folioTrace\\.mjs:(\\d+):/);',
  '    if (m) hits.push(Number(m[1]));',
  '  }',
  '  // hits[0] is the traced helper itself (add/flush/push); hits[1] is ITS CALLER — the stage.',
  '  return hits;',
  '}',
);
writeFileSync(OUT, lines.join('\n'));
return { path: OUT, lines: n0 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildTrace();
  console.log(`folioTrace.mjs written — ${r.lines} original line(s) preserved, prologue appended.`);
}
