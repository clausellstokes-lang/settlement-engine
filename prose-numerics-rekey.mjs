// prose-numerics-rekey.mjs <tree> [--write]
// Re-keys tests/lint/.prose-numerics-baseline.json after a car re-punctuated or moved lines, using the walker's OWN
// scanner (tests/helpers/proseNumericsWalk.js → scanProseNumericsSource) so the identity is the gate's identity:
// path + line + category + snippet. Rows are PAIRED, never invented:
//   RE-KEYED  — same path+line+category, snippet changed (a re-punctuation of the same debt at the same address)
//   RELOCATED — same path+category+snippet, line changed (a move)
//   FELL      — baseline row with no live counterpart (a WIN: delete after review — printed, not auto-deleted)
//   NEW       — live hit with no baseline counterpart (a NEW LEAK: never baselined — a FINDING for the car)
// --write rewrites RE-KEYED snippets and RELOCATED lines only; FELL rows stay (the chair deletes by hand after review).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const tree = resolve(process.argv[2] || ''); const WRITE = process.argv.includes('--write');
if (!tree) { console.error('usage: <tree> [--write]'); process.exit(2); }
const { scanProseNumericsSource } = await import(pathToFileURL(join(tree, 'tests/helpers/proseNumericsWalk.js')).href);
const LEDGER = 'tests/lint/.prose-numerics-baseline.json';
const raw = readFileSync(join(tree, LEDGER), 'utf8'); const baseline = JSON.parse(raw);
function walk(dir, out = []) { for (const e of readdirSync(dir)) { const a = join(dir, e); if (statSync(a).isDirectory()) walk(a, out); else if (/\.(?:js|jsx)$/.test(e)) out.push(a); } return out; }
const live = []; const parseErrors = [];
for (const abs of walk(join(tree, 'src')).sort()) { const path = relative(tree, abs).replace(/\\/g, '/'); const r = scanProseNumericsSource({ source: readFileSync(abs, 'utf8'), path }); live.push(...r.hits); if (r.parseError) parseErrors.push(`${path}: ${r.parseError}`); }
const k4 = (h) => `${h.path}|${h.line}|${h.category}|${h.snippet}`; const kAddr = (h) => `${h.path}|${h.line}|${h.category}`; const kSnip = (h) => `${h.path}|${h.category}|${h.snippet}`;
const liveBy4 = new Map(live.map((h) => [k4(h), h]));
const exact = baseline.filter((b) => liveBy4.has(k4(b)));
const vanished = baseline.filter((b) => !liveBy4.has(k4(b)));
const baseBy4 = new Set(baseline.map(k4)); const fresh = live.filter((h) => !baseBy4.has(k4(h)));
const freshByAddr = new Map(); for (const h of fresh) freshByAddr.set(kAddr(h), [...(freshByAddr.get(kAddr(h)) || []), h]);
const freshBySnip = new Map(); for (const h of fresh) freshBySnip.set(kSnip(h), [...(freshBySnip.get(kSnip(h)) || []), h]);
const rekeyed = [], relocated = [], fell = []; const used = new Set();
for (const b of vanished) {
  const a = (freshByAddr.get(kAddr(b)) || []).filter((h) => !used.has(h)); const s = (freshBySnip.get(kSnip(b)) || []).filter((h) => !used.has(h));
  if (a.length === 1) { used.add(a[0]); rekeyed.push([b, a[0]]); if (WRITE) b.snippet = a[0].snippet; }
  else if (s.length === 1) { used.add(s[0]); relocated.push([b, s[0]]); if (WRITE) b.line = s[0].line; }
  else fell.push(b);
}
const newLeaks = fresh.filter((h) => !used.has(h));
console.log(`baseline=${baseline.length} live=${live.length} parseErrors=${parseErrors.length} · exact=${exact.length} rekeyed=${rekeyed.length} relocated=${relocated.length} FELL=${fell.length} NEW=${newLeaks.length}`);
for (const [b, h] of rekeyed) console.log(`  REKEY ${b.path}:${b.line} [${b.category}]\n        - ${b.snippet.slice(0, 90)}\n        + ${h.snippet.slice(0, 90)}`);
for (const [b, h] of relocated) console.log(`  MOVE  ${b.path}:${b.line}→${h.line} [${b.category}]`);
for (const b of fell) console.log(`  FELL  ${b.path}:${b.line} [${b.category}] ${b.snippet.slice(0, 80)}`);
for (const h of newLeaks) console.log(`  NEW   ${h.path}:${h.line} [${h.category}] ${h.snippet.slice(0, 80)}`);
if (parseErrors.length) console.log('  parseErrors:\n    ' + parseErrors.join('\n    '));
if (WRITE) { if (newLeaks.length) { console.error('REFUSED --write: NEW leaks exist — a new row is never baselined'); process.exit(1); } writeFileSync(join(tree, LEDGER), JSON.stringify(baseline, null, 2) + (raw.endsWith('\n') ? '\n' : ''), 'utf8'); console.log(`  written: ${rekeyed.length} snippets re-keyed, ${relocated.length} lines moved; ${fell.length} FELL rows left for review`); }
process.exit(newLeaks.length ? 1 : 0);
