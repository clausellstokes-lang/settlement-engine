#!/usr/bin/env node
// preflight-gate-lint.mjs <repo> <base>..<tip>   (or <repo> <base> <tip>)
// Scans a car's diff for the known gate trip-wire families BEFORE the full gate runs.
// Advisory: exit 1 when any trip-wire fires, 0 when clean. Every finding cites its law.
// Families are drawn from measured reds (ODQ §633.2 run-1, §349.2, the three-ratchet law,
// the census-tuple serializer law, the scoped third ratchet, the edge-bundle bill).
import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';

const [repo, a, b] = process.argv.slice(2);
if (!repo || !a) { console.error('usage: preflight-gate-lint.mjs <repo> <base>..<tip> | <repo> <base> <tip>'); process.exit(2); }
const [base, tip] = b ? [a, b] : a.split('..');
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const nameStatus = git('diff', '--name-status', `${base}..${tip}`).trim();
const rows = nameStatus ? nameStatus.split('\n').map(l => { const [st, ...p] = l.split('\t'); return { st: st[0], path: p[p.length - 1] }; }) : [];
const findings = [];
const hit = (family, path, law) => findings.push({ family, path, law });

const INVARIANT_BASE = /(census|scan|baseline|ratchet|walker|pin)/i;

for (const { st, path } of rows) {
  // 1. New test file → three ratchets
  if (st === 'A' && /^tests\/.*\.test\.[jt]sx?$/.test(path))
    hit('NEW_TEST_FILE', path, 'a new test file reds THREE ratchets at landing — prefer added cases in an existing file, else budget all three deltas');
  // 2. package.json byte change → mint trigger
  if (/^package(-lock)?\.json$/.test(path))
    hit('PACKAGE_JSON', path, 'ANY package.json byte change is a MINT TRIGGER (§349.2 widened) — the /-lock pair is governed');
  // 3. Census-tuple serializer
  if (/sovereigntyLighting|Census|census/.test(path) && /^tests\//.test(path))
    hit('CENSUS_TUPLE', path, 'this car may move a shared census tuple — re-derive the tuple BY EXECUTION at the merged tip; never merge it as text or add deltas');
  // 4. Enforcer-dir / invariant basename → scoped third ratchet
  if (st === 'A' && /^tests\/(lint|build)\//.test(path) && INVARIANT_BASE.test(basename(path)))
    hit('THIRD_RATCHET_SCOPE', path, 'mutationCoverageManifest TOTALITY fires for enforcer dirs / invariant basenames — settle by DIFFERENTIAL (plant probes), never by reading the rule');
  // 5. Edge-bundle sources without the generated set
  if (/^supabase\/functions\/_shared\//.test(path) && !/\.meta\.json$/.test(path))
    hit('EDGE_BUNDLE', path, 'edge-bundle bill is PER-FILE and invisible to targeted runs — run npm run build:edge-shared and commit all six generated files as a set');
  // 6. Hook / npm behavior shifts
  if (/^\.husky\/|^\.npmrc$|^\.nvmrc$/.test(path))
    hit('HOOKCHAIN', path, 'hook/npm config change — pre-commit may re-stage (eslint --fix), making git diff HEAD blind; re-prove at the committed tip');
}

// 7. Non-literal .each tables INTRODUCED by this car (added lines only, comments stripped)
//    → sovereignty-walker parking. Pre-existing .each in a touched file is the file's own
//    settled business; only what the car adds is the car's bill.
for (const { st, path } of rows) {
  if (st === 'D' || !/^tests\/.*\.test\.[jt]sx?$/.test(path)) continue;
  let diff; try { diff = git('diff', '-U0', `${base}..${tip}`, '--', path); } catch { continue; }
  const added = diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).map(l => l.slice(1));
  let n = 0, sample = '';
  for (const raw of added) {
    const line = raw.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    for (const m of line.matchAll(/\b(?:test|it|describe)\.each\s*\(\s*([^\s)])/g))
      if (m[1] !== '[' && m[1] !== '`') { n++; if (!sample) sample = m[1]; }
  }
  if (n > 0)
    hit('NONLITERAL_EACH', `${path} (${n} added call(s), e.g. .each(${sample}…))`,
      'a non-literal .each table parks the file under the sovereignty-lighting walker — spell the arms as literal-title tests (SP-D idiom)');
}
// Dedupe: one row per family+path.
const seen = new Set();
const deduped = findings.filter(f => { const k = `${f.family}|${f.path}`; if (seen.has(k)) return false; seen.add(k); return true; });
findings.length = 0; findings.push(...deduped);

if (findings.length === 0) { console.log(`PREFLIGHT CLEAN — ${rows.length} changed path(s), 0 trip-wires (${base.slice(0, 9)}..${tip.slice(0, 9)})`); process.exit(0); }
console.log(`PREFLIGHT: ${findings.length} trip-wire(s) over ${rows.length} changed path(s) — each cites its law; none is auto-fatal, all are pre-gate work:`);
for (const f of findings) console.log(`  [${f.family}] ${f.path}\n      → ${f.law}`);
process.exit(1);
