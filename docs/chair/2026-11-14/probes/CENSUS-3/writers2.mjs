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
const LABEL = /^(?:How they deal|Secret:|Wants|Constraint:|Founded by:|Origin:|Early trial:|How survived:|Flaw:|Temperament:|Disposition|Goal:|Needs:?|Draws on:)\s*/;
export function sentenceOf(h) { const w = (h.why.match(/^"([^"]+)"/) || [])[1]; const parts = h.line.split(/(?<=[.!?])\s+(?=[A-Z"“])/); if (!w) return h.line; const p = parts.find((q) => q.includes(w)) || h.line; return p.length < 25 ? h.line : p; }
function runs(seed, sent) { let s = sent.replace(LABEL, ''); const re = names(seed); if (re) s = s.replace(re, '\u0001');
  s = s.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi, '\u0001').replace(/[\d,.]+%?/g, '\u0001').replace(/[“”"→·▲▸]/g, '\u0001');
  return s.split('\u0001').map((t) => t.trim()).filter((t) => t.length >= 14).sort((a, b) => b.length - a.length); }
const gcache = {}; function grep(t) { return gcache[t] ??= (() => { try { return execFileSync('git', ['-C', TREE, 'grep', '-n', '-F', '-i', t, '--', 'src', 'docs/content'], { encoding: 'utf8', maxBuffer: 5e7 }).trim().split('\n').filter(Boolean); } catch { return []; } })(); }
const fcache = {}; const L = (f) => fcache[f] ??= fs.readFileSync(`${TREE}/${f}`, 'utf8').split('\n');
const KW = new Set(['if', 'for', 'while', 'switch', 'return', 'catch', 'else', 'do', 'try', 'x', 'at', 'pick']);
function topDef(f, ln) { const A = L(f); for (let i = Math.min(ln, A.length) - 1; i >= 0; i--) { const l = A[i]; const m = l.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/) || l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/) || l.match(/^\s{2}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/); if (m && !KW.has(m[1])) return m[1]; } return ''; }
function dataKey(f, ln) { const A = L(f); let key = ''; for (let i = Math.min(ln, A.length) - 1; i >= 0; i--) { const l = A[i]; const k = !key && l.match(/^\s{2,10}['"]?([\w$'-][\w$ '-]*?)['"]?\s*:\s*[\[{(]/); if (k) key = k[1]; const m = l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/); if (m) return key ? `${m[1]}.${key}` : m[1]; } return key; }
function poolKey(f, ln) { const A = L(f); let comb = '', pk = '', vid = ''; for (let i = ln; i < Math.min(ln + 12, A.length); i++) { const v = A[i].match(/"vid":\s*(\d+)/); if (v) { vid = v[1]; break; } }
  const ti = A[ln - 1].match(/^\s*/)[0].length; for (let i = ln - 1; i >= 0; i--) { const m = A[i].match(/^(\s*)"([^"]+)":\s*[\[{]\s*$/); if (!m) continue; const d = m[1].length; if (!comb && d === ti - 4) comb = m[2]; else if (d === 2) { pk = m[2]; break; } } return `${pk} › ${comb} · v${vid}`; }
let VIEW = '';
let WORD = '';
function trace(seed, sent) {
  const rs = runs(seed, sent); const lw = WORD.toLowerCase(); rs.sort((a, b) => (lw && b.toLowerCase().includes(lw) ? 1 : 0) - (lw && a.toLowerCase().includes(lw) ? 1 : 0));   // the run carrying the trigger first
  for (const t0 of rs.slice(0, 5)) { let t = t0; let h = grep(t); while (!h.length && Math.floor(t.length * 0.7) >= 22) { t = t.slice(0, Math.floor(t.length * 0.7)).trim(); h = grep(t); }
    for (let k = 1; !h.length && k <= 4; k++) { const tt = t0.split(' ').slice(k).join(' '); if (tt.length < 16) break; t = tt; h = grep(t); }
    if (!h.length) continue;
    const nonTest = h.filter((l) => !/\.test\.|\/tests?\/|__tests__|\.census2?\.jsx/.test(l.split(':')[0]));
    // rank: the view's own area first (an income line's generator for Economics, the safety profile for Defense, …),
    // then generated pools, data, code, docs — the cut's order, with the view as the tie-breaker it lacked.
    const AFF = { 'Systems/Economics': /economy|Economics|economic|income|supply|foodBalance/i, 'Systems/Defense': /defen[cs]e|safety|military|Defense/i, 'Systems/Power': /power|faction|governance|Power/i, 'World/History': /history|History/i, 'World/NPCs': /npc|people|NPC/i, 'World/Relationships': /relationship|npc/i, 'Summary/Overview': /quickGuide|culture|arrival|overview|narrative/i, 'Systems/Services': /service/i, 'Systems/Institutions': /institution/i, 'World/Faith': /faith/i, 'Systems/Magic': /magic/i, 'Systems/Resources': /resource|chain/i, 'Summary/Plot Hooks': /hook|plot/i };
    const tier = (l) => /^src\/data\/dossierStateProse\/.*generated/.test(l) ? 3 : /^src\/data\//.test(l) ? 2 : /^src\//.test(l) ? 1 : /^docs\//.test(l) ? 0 : -1;
    const ranked = nonTest.filter((l) => tier(l) >= 0).sort((a, b) => ((AFF[VIEW]?.test(b.split(':')[0]) ? 10 : 0) + tier(b)) - ((AFF[VIEW]?.test(a.split(':')[0]) ? 10 : 0) + tier(a)));
    if (!ranked.length) continue;
    const m = ranked[0].match(/^([^:]+):(\d+):/); const file = m[1]; const line = +m[2]; let fn = '';
    try { fn = /dossierStateProse\/.*generated/.test(file) ? poolKey(file, line) : /^src\/data\//.test(file) ? dataKey(file, line) : /^src\//.test(file) ? topDef(file, line) : ''; } catch {}
    // a receipt pool in docs/content is the generated pool's source: give the line to the generated pool when it is there
    if (/^docs\/content\//.test(file)) { const g = grep(t).filter((l) => /^src\/data\/dossierStateProse\/.*generated/.test(l)); if (g.length) { const mm = g[0].match(/^([^:]+):(\d+):/); return { file: mm[1], line: +mm[2], fn: poolKey(mm[1], +mm[2]), run: t, also: [...new Set(ranked.map((l) => l.split(':')[0]))].slice(0, 6), evidence: 'git grep -F (receipt pool -> generated pool)' }; } }
    return { file, line, fn, run: t, also: [...new Set(ranked.map((l) => l.split(':')[0]))].slice(0, 6), evidence: 'git grep -F at the counted tree' };
  }
  return { file: '(untraced)', fn: '', run: '', evidence: 'no fixed run of the sentence found in src/ or docs/content' };
}
// composed forms: a row the surface builds from record names (no fixed run to grep); the writer is the surface's own
// line, found by an anchor of its code in the counted tree, the words' source named beside it.
const FORMS = [
  { id: 'flow-card house list', test: (h) => h.view === 'Systems/Economics' && / · /.test(h.line) && h.line.split(' · ').every((x) => /^[A-Z]/.test(x)), file: 'src/components/new/tabs/EconomicsTab.jsx', anchor: 'facts.institutions.map(', words: 'the chain\'s processingInstitutions (src/data/supplyChainData.js) through institutionDisplayName' },
  { id: 'flow-card house (one name)', test: (h) => h.view === 'Systems/Economics' && /^[A-Z][\w'’&/ -]{2,40}$/.test(h.line.trim()) && h.line.trim().split(' ').length <= 5 && h.pattern === 'a', file: 'src/components/new/tabs/EconomicsTab.jsx', anchor: 'facts.institutions.map(', words: 'the chain\'s processingInstitutions through institutionDisplayName' },
  // a house's catalogue key printed raw (kind f): the SURFACE that prints it, by view (the cut's rule); words: the
  // catalogue (src/data/institutionalCatalog.js) not passed through institutionDisplayName at that site
  { id: 'roster heading (raw house name)', test: (h) => h.pattern === 'f' && h.view === 'Systems/Institutions', file: 'src/components/new/tabs/InstitutionsTab.jsx', anchor: 'export function InstitutionCard', words: 'src/data/institutionalCatalog.js (the key, raw)' },
  { id: 'service row house (raw house name)', test: (h) => h.pattern === 'f' && h.view === 'Systems/Services', file: 'src/components/new/tabs/ServicesTab.jsx', anchor: "svc.institution || ''", words: 'src/data/institutionalCatalog.js (the key, raw)' },
  { id: 'power support list (raw house name)', test: (h) => h.pattern === 'f' && h.view === 'Systems/Power' && !/ · /.test(h.line), file: 'src/components/new/tabs/power/PowerStrata.jsx', anchor: 'Institutions behind this power', words: 'src/data/institutionalCatalog.js (the key, raw)' },
  { id: 'criminal front row (raw house name)', test: (h) => h.pattern === 'f' && / · [^·]* · fronts for /.test(h.line), file: 'src/components/new/tabs/WhoRunsThisTownPanel.jsx', anchor: 'fronts for ${f.guild}', words: 'the front house name, raw' },
  // CENSUS-3: an NPC card's line ("<house> · member of <power>"): the card's house printed with its catalogue tag
  { id: 'NPC card line (raw house name)', test: (h) => h.pattern === 'f' && h.view === 'World/NPCs' && /· (?:member|first|second|third|head|keeper) of /.test(h.line), file: 'src/components/new/npcComponents.jsx', anchor: 'data-testid="npc-card-line"', words: 'the NPC\'s institution name (src/data/institutionalCatalog.js, its tag)' },
  // CENSUS-3: a raw house name (kind f) on the PDF or the journal: the surface's own section prints it
  { id: 'PDF section (raw house name)', test: (h) => h.pattern === 'f' && /^PDF\//.test(h.view), file: (h) => `src/pdf/sections/${h.view.slice(4)}.jsx`, anchor: (h) => `export function ${h.view.slice(4)}`, words: 'src/data/institutionalCatalog.js (the key, raw)' },
  { id: 'journal page (raw house name)', test: (h) => h.pattern === 'f' && /^Journal\//.test(h.view), file: () => 'src/foundry/journalPages.js', anchor: () => 'export function buildJournalPages', words: 'src/data/institutionalCatalog.js (the key, raw)' },
];
function formWriter(h) { for (const f0 of FORMS) { if (!f0.test(h)) continue; const f = { ...f0, file: typeof f0.file === 'function' ? f0.file(h) : f0.file, anchor: typeof f0.anchor === 'function' ? f0.anchor(h) : f0.anchor };
    const g = (() => { try { return execFileSync('git', ['-C', TREE, 'grep', '-n', '-F', f.anchor, '--', f.file], { encoding: 'utf8' }).trim().split('\n')[0]; } catch { return ''; } })();
    const ln = g ? +g.split(':')[1] : 0; return { file: f.file, line: ln, fn: ln ? topDef(f.file, ln) : '', words: f.words, evidence: `traced form: ${f.id} (anchor "${f.anchor}" in the counted tree)` }; } return null; }
const memo = {}; let traced = 0, untraced = 0;
for (const h of H) { const sent = sentenceOf(h); h.sentence = sent; const key = h.pattern + '|' + h.norm + '|' + sent.replace(/\d[\d,.]*/g, '#');
  if (h.writer) { traced++; continue; }   // CENSUS-3: kind i carries its writer by form (surfaces-i.mjs)
  VIEW = h.vtab || h.view; WORD = (h.why.match(/^"([^"]+)"/) || [])[1] || ''; const w = memo[key + '|' + h.view] ??= (formWriter(h) || trace(h.seed, sent)); h.writer = w; if (w.file === '(untraced)') untraced++; else traced++; }
fs.writeFileSync(OUT + '/hits.json', JSON.stringify(H));
console.log(`writers: ${traced} hits traced, ${untraced} untraced; ${Object.keys(memo).length} distinct sentences; ${Object.keys(gcache).length} greps`);
