// X2/X3/X4 — THE IMPORT-AND-WALK EXTRACTOR (arrow-function receipt pools, `(r) => string[]`,
// template literals with ${x.slot}, and arrays/objects of plain strings).
// READ-ONLY: imports modules out of the composed dock and writes ONLY to the scratchpad.
// Usage: node x2-walk.mjs <DOCK> <OUT.json>
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
process.on('unhandledRejection', () => {});

const D = process.argv[2];
const OUT = process.argv[3];

// ── which modules are in scope ───────────────────────────────────────────────
// EXCLUSIONS (each with its reason; reported in the dossier):
//  certification/**            dev-only audit evidence rows, not reader prose (inventory §4 R13)
//  compendium/generated/**     BUILD ARTIFACT that re-emits operationRegistry+glossary+bandLadders
//  copy/index.js               re-export of copy/en.js (double count)
//  copy/pseudo.js              pseudo-localisation harness, not authored prose
//  data/sampleDossier*         fixture payloads, not authored corpus
//  *.test.js / __mocks__       test scaffolding
const EXCLUDE = [
  /^src\/domain\/certification\//,
  /^src\/domain\/compendium\/generated\//,
  /^src\/copy\/index\.js$/,
  /^src\/copy\/pseudo\.js$/,
  /^src\/data\/sampleDossier/,
  /\.test\.m?js$/,
  /__mocks__/,
];

const files = [];
(function walkDir(p) {
  for (const e of readdirSync(p)) {
    const q = path.join(p, e);
    const st = statSync(q);
    if (st.isDirectory()) walkDir(q);
    else if (/\.m?js$/.test(q)) files.push(q);
  }
})(path.join(D, 'src'));
const cands = files
  .map((f) => path.relative(D, f))
  .filter((f) => !EXCLUDE.some((r) => r.test(f)))
  .sort();

// ── the dual-mode slot stand-in ──────────────────────────────────────────────
// Answers BOTH estate idioms: `(x) => `…${x.settlement}…`` (property access) and
// `(r) => `…${r}…`` (the value IS the name). Materialised slots print as {name},
// the same brace convention the projected corpus uses literally.
const slotProxy = (name) => new Proxy(function () {}, {
  get: (_t, k) => {
    if (k === Symbol.toPrimitive || k === 'toString' || k === 'valueOf') return () => `{${name}}`;
    if (k === 'length') return 1;
    if (typeof k === 'symbol') return undefined;
    return slotProxy(String(k));
  },
  has: () => true,
  apply: () => `{${name}}`,
});

// A function is CALLED only if it is small, synchronous and free of any I/O or
// global-state token. The dock must come out byte-identical (verified after).
const IO = /\b(writeFile|writeFileSync|appendFile|unlink|mkdir|rmSync|execSync|spawn|require\s*\(|localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|document\.|window\.|navigator\.|process\.exit|Math\.random|Date\.now|new Date)\b/;

const rows = [];
const failures = {};
const perFile = {};

for (const rel of cands) {
  let ns;
  try {
    ns = await import(path.join(D, rel));
  } catch (e) {
    failures[rel] = String(e && e.message ? e.message : e).slice(0, 200);
    continue;
  }
  const seen = new WeakSet();
  let n = 0;
  const push = (p, text, shape, viaFn) => {
    if (typeof text !== 'string') return;
    const t = text.replace(/\s+/g, ' ').trim();
    if (t.length < 12 || t.length > 2000) return;
    rows.push({ file: rel, p, shape, viaFn: viaFn ? 1 : 0, text: t });
    n++;
  };
  const walk = (v, p, depth, viaFn, inArray) => {
    if (depth > 12 || n > 12000) return;
    if (typeof v === 'string') {
      const hasSlot = /\{[a-z_][a-z_0-9]*\}/i.test(v);
      const shape = viaFn
        ? (hasSlot ? 'fn-template' : 'fn-plain')
        : (hasSlot ? 'slot-string' : (inArray ? 'array-string' : 'object-string'));
      push(p, v, shape, viaFn);
      return;
    }
    if (typeof v === 'function') {
      if (v.length > 3) return;
      let src = '';
      try { src = String(v); } catch { return; }
      if (src.length > 4000) return;
      if (/^class[\s{]/.test(src)) return;
      if (/\basync\b|\bawait\b/.test(src)) return;
      if (IO.test(src)) return;
      let r;
      try {
        r = v(...['a', 'b', 'c'].slice(0, Math.max(1, v.length)).map(slotProxy));
      } catch { return; }
      if (r && typeof r.then === 'function') { try { r.catch(() => {}); } catch { /* */ } return; }
      if (typeof r === 'string') { walk(r, p + '()', depth + 1, true, false); return; }
      if (r && typeof r === 'object') {
        // the `(r) => string[]` shape: the RETURN is walked, and every leaf is tagged fn-array
        const before = rows.length;
        walk(r, p + '()', depth + 1, true, Array.isArray(r));
        for (let i = before; i < rows.length; i++) rows[i].shape = 'fn-array';
      }
      return;
    }
    if (!v || typeof v !== 'object') return;
    if (seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`, depth + 1, viaFn, true)); return; }
    for (const k of Object.keys(v)) {
      try { walk(v[k], p ? `${p}.${k}` : k, depth + 1, viaFn, false); } catch { /* getter threw */ }
    }
  };
  for (const k of Object.keys(ns)) { try { walk(ns[k], k, 0, false, false); } catch { /* getter threw */ } }
  if (n) perFile[rel] = n;
}

writeFileSync(OUT, JSON.stringify(rows));
writeFileSync(OUT.replace(/\.json$/, '.failures.json'), JSON.stringify(failures, null, 1));
console.log('# modules in scope:', cands.length, ' import failures:', Object.keys(failures).length, ' string leaves >=12ch:', rows.length);
const byShape = {};
for (const r of rows) byShape[r.shape] = (byShape[r.shape] || 0) + 1;
console.log('# shapes:', JSON.stringify(byShape));
const top = Object.entries(perFile).sort((a, b) => b[1] - a[1]).slice(0, 25);
for (const [f, c] of top) console.log(String(c).padStart(6), f);
