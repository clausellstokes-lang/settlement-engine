// CENSUS-2 writers: each hit's line traced to its writer IN THE COUNTED TREE, as ROUND-3-CUT traced the cold lines
// (attrib.mjs + writers-fix.mjs): the sentence that carries the trigger, the town's own names, tier nouns and figures
// folded out, the longest fixed runs searched with `git grep -F -i` in src/ and docs/content; ranked generated pools
// first, then data, then code; the function is the nearest top-level definition (code), the top-level const and its
// first key (data), or for the generated corpus the pool, combination and variant. A line no run finds is
// "(untraced)" with its sentence kept: never guessed. Writes OUT/hits.json back with `writer` and `sentence` on each hit.
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
import { loadCorpus } from './load.mjs';
const TREE = process.env.TREE; const OUT = process.env.OUT;
const H = JSON.parse(fs.readFileSync(OUT + '/hits.json', 'utf8'));
const C = Object.fromEntries(loadCorpus(OUT + '/corpus.ndjson.gz').map((x) => [x.seed, x.s]));
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const nameRe = {}; function names(seed) { if (nameRe[seed]) return nameRe[seed]; const r = C[seed] || {};
  const n = [r.name, ...(r.npcs || []).map((n) => n.name), ...(r.npcs || []).flatMap((n) => String(n.name || '').split(' ')), ...(r.powerStructure?.factions || []).map((f) => f.faction || f.name),
    ...(r.institutions || []).map((i) => i.name), ...(r.institutions || []).map((i) => String(i.name || '').replace(/\s*\([^)]*\)\s*$/, ''))].filter((s) => s && String(s).length > 2).map(String);
  const u = [...new Set(n)].sort((a, b) => b.length - a.length); return (nameRe[seed] = u.length ? new RegExp(u.map(esc).join('|'), 'g') : null); }
// the sentence of the line that carries the trigger word quoted in `why`
export function sentenceOf(h) { const w = (h.why.match(/^"([^"]+)"/) || [])[1]; const parts = h.line.split(/(?<=[.!?])\s+(?=[A-Z"“])/); if (!w) return h.line; return parts.find((p) => p.includes(w)) || h.line; }
function runs(seed, sent) { let s = sent; const re = names(seed); if (re) s = s.replace(re, '\u0001');
  s = s.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi, '\u0001').replace(/[\d,.]+%?/g, '\u0001').replace(/[“”"]/g, '\u0001');
  return s.split('\u0001').map((t) => t.trim()).filter((t) => t.length >= 14).sort((a, b) => b.length - a.length); }
const gcache = {}; function grep(t) { return gcache[t] ??= (() => { try { return execFileSync('git', ['-C', TREE, 'grep', '-n', '-F', '-i', t, '--', 'src', 'docs/content'], { encoding: 'utf8', maxBuffer: 5e7 }).trim().split('\n').filter(Boolean); } catch { return []; } })(); }
const fcache = {}; const L = (f) => fcache[f] ??= fs.readFileSync(`${TREE}/${f}`, 'utf8').split('\n');
const KW = new Set(['if', 'for', 'while', 'switch', 'return', 'catch', 'else', 'do', 'try', 'x', 'at', 'pick']);
function topDef(f, ln) { const A = L(f); for (let i = Math.min(ln, A.length) - 1; i >= 0; i--) { const l = A[i]; const m = l.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/) || l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/) || l.match(/^\s{2}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/); if (m && !KW.has(m[1])) return m[1]; } return ''; }
function dataKey(f, ln) { const A = L(f); let key = ''; for (let i = Math.min(ln, A.length) - 1; i >= 0; i--) { const l = A[i]; const k = !key && l.match(/^\s{2}['"]?([\w$ '-]+?)['"]?\s*:\s*[\[{(]/); if (k) key = k[1]; const m = l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/); if (m) return key ? `${m[1]}.${key}` : m[1]; } return key; }
function poolKey(f, ln) { const A = L(f); let comb = '', pk = '', vid = ''; for (let i = ln; i < Math.min(ln + 12, A.length); i++) { const v = A[i].match(/"vid":\s*(\d+)/); if (v) { vid = v[1]; break; } }
  const ti = A[ln - 1].match(/^\s*/)[0].length; for (let i = ln - 1; i >= 0; i--) { const m = A[i].match(/^(\s*)"([^"]+)":\s*[\[{]\s*$/); if (!m) continue; const d = m[1].length; if (!comb && d === ti - 4) comb = m[2]; else if (d === 2) { pk = m[2]; break; } } return `${pk} › ${comb} · v${vid}`; }
function trace(seed, sent) {
  for (const t0 of runs(seed, sent).slice(0, 5)) { let t = t0; let h = grep(t); while (!h.length && t.length > 22) { t = t.slice(0, Math.floor(t.length * 0.7)).trim(); h = grep(t); }
    if (!h.length) continue;
    const nonTest = h.filter((l) => !/\.test\.|\/tests?\/|__tests__|\.census2?\.jsx/.test(l.split(':')[0]));
    const ranked = [...nonTest.filter((l) => /^src\/data\/dossierStateProse\/.*generated/.test(l)), ...nonTest.filter((l) => /^src\/data\//.test(l) && !/generated/.test(l)), ...nonTest.filter((l) => /^src\//.test(l) && !/^src\/data\//.test(l)), ...nonTest.filter((l) => /^docs\//.test(l))];
    if (!ranked.length) continue;
    const m = ranked[0].match(/^([^:]+):(\d+):/); const file = m[1]; const line = +m[2]; let fn = '';
    try { fn = /dossierStateProse\/.*generated/.test(file) ? poolKey(file, line) : /^src\/data\//.test(file) ? dataKey(file, line) : /^src\//.test(file) ? topDef(file, line) : ''; } catch {}
    // a receipt pool in docs/content is the generated pool's source: give the line to the generated pool when it is there
    if (/^docs\/content\//.test(file)) { const g = grep(t).filter((l) => /^src\/data\/dossierStateProse\/.*generated/.test(l)); if (g.length) { const mm = g[0].match(/^([^:]+):(\d+):/); return { file: mm[1], line: +mm[2], fn: poolKey(mm[1], +mm[2]), run: t, also: [...new Set(ranked.map((l) => l.split(':')[0]))].slice(0, 6), evidence: 'git grep -F (receipt pool -> generated pool)' }; } }
    return { file, line, fn, run: t, also: [...new Set(ranked.map((l) => l.split(':')[0]))].slice(0, 6), evidence: 'git grep -F at the counted tree' };
  }
  return { file: '(untraced)', fn: '', run: '', evidence: 'no fixed run of the sentence found in src/ or docs/content' };
}
const memo = {}; let traced = 0, untraced = 0;
for (const h of H) { const sent = sentenceOf(h); h.sentence = sent; const key = h.pattern + '|' + h.norm + '|' + sent.replace(/\d[\d,.]*/g, '#');
  const w = memo[key] ??= trace(h.seed, sent); h.writer = w; if (w.file === '(untraced)') untraced++; else traced++; }
fs.writeFileSync(OUT + '/hits.json', JSON.stringify(H));
console.log(`writers: ${traced} hits traced, ${untraced} untraced; ${Object.keys(memo).length} distinct sentences; ${Object.keys(gcache).length} greps`);
