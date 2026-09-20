#!/usr/bin/env node
/**
 * prose-numerics-readdress.mjs — chair tooling, DELIBERATELY OUTSIDE THE REPO.
 * Re-addresses tests/lint/.prose-numerics-baseline.json after pure line moves, using the
 * test's OWN scanner and the test's OWN corpus walk (every .js/.jsx under src, sorted).
 *   - a live hit whose (path, category, snippet) identity is NOT in the baseline = a NEW LEAK,
 *     REFUSED, nothing written (humanize it; never bank it);
 *   - a baseline row whose identity is no longer live = DEBT FELL, listed for review, dropped
 *     (the baseline may only shrink);
 *   - everything else = the same debt at a new address, re-addressed.
 * DRY RUN unless --write. Usage: node <this> --root <tree> [--write]
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(n); return i === -1 ? null : argv[i + 1] ?? null; };
const root = resolve(flag('--root') || process.cwd());
const write = argv.includes('--write');
const SEP = String.fromCharCode(0);
const BASELINE = join(root, 'tests/lint/.prose-numerics-baseline.json');
const { scanProseNumericsSource } = await import(pathToFileURL(join(root, 'tests/helpers/proseNumericsWalk.js')).href);

// Mirrors the test's GENERATED_SOURCES (2026-09-19): the landing fixture is engine output,
// never authored prose — skipped here exactly as the test skips it.
const GENERATED_SOURCES = new Set(['src/components/home/landingFixture.js']);
function walkSourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (GENERATED_SOURCES.has(relative(root, join(dir, entry)).replace(/\\/g, '/'))) continue;
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walkSourceFiles(abs, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
}
const hits = []; const parseErrors = [];
for (const abs of walkSourceFiles(join(root, 'src')).sort()) {
  const path = relative(root, abs).replace(/\\/g, '/');
  const r = scanProseNumericsSource({ source: readFileSync(abs, 'utf8'), path });
  hits.push(...r.hits);
  if (r.parseError) parseErrors.push(`${path}: ${r.parseError}`);
}
if (parseErrors.length) { console.error('REFUSED: parse errors\n' + parseErrors.join('\n')); process.exit(2); }

const raw = readFileSync(BASELINE, 'utf8');
const baseline = JSON.parse(raw);
const key = (h) => [h.path, h.category, h.snippet].join(SEP);
const show = (k) => k.split(SEP).join(' · ');
const count = (rows) => rows.reduce((m, h) => m.set(key(h), (m.get(key(h)) || 0) + 1), new Map());
const oldC = count(baseline); const liveC = count(hits);
const leaks = []; for (const [k, n] of liveC) if (n > (oldC.get(k) || 0)) leaks.push(`${show(k)} (+${n - (oldC.get(k) || 0)})`);
const fell = []; for (const [k, n] of oldC) if (n > (liveC.get(k) || 0)) fell.push(`${show(k)} (-${n - (liveC.get(k) || 0)})`);
if (leaks.length) { console.error(`REFUSED: ${leaks.length} NEW prose-numeric leak(s) — humanize, never bank:\n  ` + leaks.join('\n  ')); process.exit(2); }

const oldAt = new Set(baseline.map((h) => key(h) + SEP + h.line));
const readdressed = hits.filter((h) => !oldAt.has(key(h) + SEP + h.line));
console.log(`baseline ${baseline.length} rows -> live ${hits.length} rows; re-addressed ${readdressed.length}; debt fell on ${fell.length} identit${fell.length === 1 ? 'y' : 'ies'}`);
for (const h of readdressed) { const prev = baseline.find((b) => key(b) === key(h)); console.log(`  ${h.path}: ${prev ? prev.line : '?'} -> ${h.line}  [${h.category}] ${h.snippet.slice(0, 60)}`); }
if (fell.length) console.log('DEBT FELL (review each: a cure, not a bank):\n  ' + fell.join('\n  '));
if (!write) { console.log('DRY RUN. Nothing written. Re-run with --write.'); process.exit(hits.length === baseline.length && readdressed.length === 0 ? 0 : 1); }
const indent = /\n( +)"/.exec(raw)?.[1]?.length ?? 2;
writeFileSync(BASELINE, JSON.stringify(hits, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
console.log(`WROTE ${BASELINE} (${hits.length} rows). The receipt is the plain test run.`);
