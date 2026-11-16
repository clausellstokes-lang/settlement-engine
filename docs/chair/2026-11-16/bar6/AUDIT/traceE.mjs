// BAR6-AUDIT-E · the writer of each LAW 9 line, and of the line it is read against, IN A COUNTED TREE.
//   node docs/chair/2026-11-16/bar6/AUDIT/traceE.mjs <tree-root> <runE out.json> [<render-dir>]
// The method of PAGE-COPY's writers2.mjs (not imported: that file runs on import): the sentence's town names, tier
// nouns and figures folded out, its longest fixed runs searched with `git grep -F -i` in src/; generated pools first,
// then data, then code; the function is the nearest top-level definition, or for a generated pool its pool key and
// variant. A sentence no run finds is "(untraced)", never guessed. Writes <out>.writers.json: one row per rule and
// distinct line, with the writer of the line, the writer of its `against`, the towns and the instances.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';

const [TREE, IN, RENDER] = process.argv.slice(2);
if (!TREE || !IN) { console.error('usage: traceE.mjs <tree-root> <runE out.json> [<render-dir>]'); process.exit(2); }
const xs = JSON.parse(fs.readFileSync(IN, 'utf8'));
const recs = new Map();
if (RENDER) for (const l of zlib.gunzipSync(fs.readFileSync(path.join(RENDER, 'corpus.ndjson.gz'))).toString().split('\n')) { if (l.trim()) { const o = JSON.parse(l); recs.set(o.seed, o.s); } }
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const nameCache = new Map();
function namesRe(seed) {
  if (nameCache.has(seed)) return nameCache.get(seed);
  const r = recs.get(seed) || {};
  const n = [r.name, ...(r.npcs || []).flatMap((p) => [p.name, ...String(p.name || '').split(' ')]), ...(r.institutions || []).map((i) => i.name), ...(r.powerStructure?.factions || []).map((f) => f.faction || f.name)]
    .filter((s) => s && String(s).length > 2).map(String);
  const u = [...new Set(n)].sort((a, b) => b.length - a.length);
  const re = u.length ? new RegExp(u.map(esc).join('|'), 'g') : null; nameCache.set(seed, re); return re;
}
function runs(seed, s) {
  const re = namesRe(seed); if (re) s = s.replace(re, '\u0001');
  s = s.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi, '\u0001').replace(/[\d,.]+%?/g, '\u0001').replace(/[“”"→·▲▸▼:]/g, '\u0001');
  return s.split('\u0001').map((t) => t.trim()).filter((t) => t.length >= 14).sort((a, b) => b.length - a.length);
}
const gcache = new Map();
const grep = (t) => { if (gcache.has(t)) return gcache.get(t); let r = []; try { r = execFileSync('git', ['-C', TREE, 'grep', '-n', '-F', '-i', t, '--', 'src'], { encoding: 'utf8', maxBuffer: 5e7 }).trim().split('\n').filter(Boolean); } catch { r = []; } gcache.set(t, r); return r; };
const fcache = new Map(); const L = (f) => { if (!fcache.has(f)) fcache.set(f, fs.readFileSync(path.join(TREE, f), 'utf8').split('\n')); return fcache.get(f); };
const KW = new Set(['if', 'for', 'while', 'switch', 'return', 'catch', 'else', 'do', 'try']);
function topDef(f, ln) { const A = L(f); for (let i = Math.min(ln, A.length) - 1; i >= 0; i--) { const l = A[i]; const m = l.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/) || l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/); if (m && !KW.has(m[1])) return m[1]; } return ''; }
function poolKey(f, ln) { const A = L(f); let comb = '', pk = '', vid = ''; for (let i = ln; i < Math.min(ln + 12, A.length); i++) { const v = A[i].match(/"vid":\s*(\d+)/); if (v) { vid = v[1]; break; } }
  const ti = A[ln - 1].match(/^\s*/)[0].length; for (let i = ln - 1; i >= 0; i--) { const m = A[i].match(/^(\s*)"([^"]+)":\s*[[{]\s*$/); if (!m) continue; const d = m[1].length; if (!comb && d === ti - 4) comb = m[2]; else if (d === 2) { pk = m[2]; break; } } return `${pk} › ${comb} · v${vid}`; }
const tier = (l) => (/^src\/data\/dossierStateProse\/.*generated/.test(l) ? 3 : /^src\/data\//.test(l) ? 2 : /^src\//.test(l) ? 1 : -1);
function trace(seed, sent) {
  if (!sent) return { file: '(none)' };
  for (const t0 of runs(seed, sent).slice(0, 5)) {
    let t = t0; let h = grep(t);
    while (!h.length && Math.floor(t.length * 0.7) >= 18) { t = t.slice(0, Math.floor(t.length * 0.7)).trim(); h = grep(t); }
    const ranked = h.filter((l) => !/\.test\.|\/tests?\//.test(l.split(':')[0]) && tier(l) >= 0).sort((a, b) => tier(b) - tier(a));
    if (!ranked.length) continue;
    const m = ranked[0].match(/^([^:]+):(\d+):/); const file = m[1]; const line = +m[2];
    let fn = ''; try { fn = /dossierStateProse\/.*generated/.test(file) ? poolKey(file, line) : topDef(file, line); } catch { fn = ''; }
    return { file, line, fn, run: t, also: [...new Set(ranked.map((l) => l.split(':')[0]))].slice(0, 5) };
  }
  return { file: '(untraced)' };
}
const rows = new Map();
for (const x of xs) {
  const k = `${x.rule}|${x.form}`;
  const r = rows.get(k) || { rule: x.rule, held: x.held, status: x.status, form: x.form, n: 0, towns: [], sample: x, against: x.against?.line };
  r.n++; r.towns.push(x.town); rows.set(k, r);
}
const out = [];
for (const r of rows.values()) {
  const w = trace(r.sample.town, r.sample.sentence);
  const a = r.sample.against?.tab === 'record' ? { file: '(record field)', fn: r.sample.against.line } : trace(r.sample.town, r.sample.against?.line || '');
  out.push({ rule: r.rule, held: r.held, status: r.status, n: r.n, towns: r.towns.length, form: r.form, writer: w, againstLine: r.against, againstWriter: a, eg: r.sample.town });
}
out.sort((a, b) => a.rule.localeCompare(b.rule) || b.n - a.n);
const dest = IN.replace(/\.json$/, '.writers.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 1));
console.log(`traced ${out.length} distinct lines (${out.filter((o) => o.writer.file === '(untraced)').length} untraced) -> ${dest}`);
