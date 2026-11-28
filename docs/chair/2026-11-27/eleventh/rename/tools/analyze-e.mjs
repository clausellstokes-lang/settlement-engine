// node analyze-e.mjs <C|V> : the cure's size. The owner's page of each birth on the current tree against the same birth on
// the scratch tree whose name keys are re-keyed to the town's id (and the people headline to the person's id).
// Pages moved (any line), by surface; and by site: the sequence of lines a site chose, base against re-keyed.
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import readline from 'node:readline';
const C = process.argv[2]; const W = '/tmp/rename/work';
const mk = (b) => { const B = readFileSync(`${W}/${b}.mjs`, 'utf8').split('\n'); const MM = JSON.parse(readFileSync(`${W}/modmap-${b}.json`, 'utf8'));
  const cache = new Map();
  const siteOf = (l) => { if (cache.has(l)) return cache.get(l); let m = '?'; for (const [a, x] of MM) { if (a <= l) m = x; else break; }
    let fn = '?'; for (let i = l - 1; i >= 0 && i > l - 4000; i--) { const s = B[i]; const r = /^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/.exec(s) || /^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.exec(s); if (r) { fn = r[1]; break; } if (/^\/\/ /.test(s)) break; }
    const out = `${m.replace(/^.*?src\//, 'src/')} :: ${fn.replace(/\d+$/, '')}`; cache.set(l, out); return out; };
  return (fr) => { for (const l of String(fr).split(',').map(Number).filter(Boolean)) { const s = siteOf(l); if (!/proseHash|drawDeclared|rename-harness|e-harness/.test(s)) return s; } return '?'; };
};
const siteB = mk('e-base'); const siteR = mk('e-rekey');
async function load(f, site) { const m = new Map(); const rl = readline.createInterface({ input: createReadStream(f), crlfDelay: Infinity });
  for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); if (j.error) { m.set(j.seed, { error: j.error }); continue; }
    const bySite = {}; for (const p of j.picks) { const [k, fr, key, ch] = p.split('\t'); let s = `${k} ${site(fr)}`; if (/seedPick/.test(s)) s += (key === j.name || key === j.id) ? ' [overview: town key]' : /\|/.test(key) ? ' [crisis|tier key, no name]' : ' [people: person key]'; (bySite[s] ||= []).push(ch); }
    m.set(j.seed, { size: j.size, views: j.views, bySite }); }
  return m; }
const base = await load(`${W}/E-base-${C}.jsonl`, siteB); const rek = await load(`${W}/E-rekey-${C}.jsonl`, siteR);
const surf = (v) => (/^PDF\//.test(v) ? 'PDF' : /^Foundry\//.test(v) ? 'Foundry' : /^Tonight\//.test(v) ? 'Tonight' : /^Session\//.test(v) ? 'Session' : 'tabs');
const R = { corpus: C, pairs: 0, errors: 0, pagesMoved: 0, tabsMoved: 0, bySurface: {}, bySize: {}, linesMoved: 0, byView: {}, sites: {} };
for (const [seed, b] of base) {
  const r = rek.get(seed); if (!r) continue; if (b.error || r.error) { R.errors++; continue; }
  R.pairs++; const sz = (R.bySize[b.size] ||= { births: 0, moved: 0 }); sz.births++;
  let moved = false; let tabs = false; const surfs = new Set();
  for (const v of new Set([...Object.keys(b.views), ...Object.keys(r.views)])) {
    const A = new Set(b.views[v] || []); const n = (r.views[v] || []).filter((x) => !A.has(x)).length + [...A].filter((x) => !(r.views[v] || []).includes(x)).length;
    if (n) { moved = true; surfs.add(surf(v)); if (surf(v) === 'tabs') tabs = true; R.byView[v] = (R.byView[v] || 0) + 1; R.linesMoved += n; }
  }
  if (moved) { R.pagesMoved++; sz.moved++; } if (tabs) R.tabsMoved++;
  for (const s of surfs) R.bySurface[s] = (R.bySurface[s] || 0) + 1;
  for (const s of new Set([...Object.keys(b.bySite), ...Object.keys(r.bySite)])) {
    const x = (b.bySite[s] || []).join('|'); const y = (r.bySite[s] || []).join('|');
    const S = (R.sites[s] ||= { pages: 0, moved: 0 }); S.pages++; if (x !== y) S.moved++;
  }
}
for (const [s, S] of Object.entries(R.sites)) if (!S.moved) delete R.sites[s];
writeFileSync(`${W}/E-${C}.res.json`, JSON.stringify(R, null, 1));
console.log(`${C}: pairs ${R.pairs} errors ${R.errors} | pages moved ${R.pagesMoved} (owner tabs ${R.tabsMoved}) lines ${R.linesMoved}`, JSON.stringify(R.bySurface), JSON.stringify(R.bySize));
for (const [s, S] of Object.entries(R.sites).sort((a, b) => b[1].moved - a[1].moved)) console.log(`   ${s}: moved on ${S.moved} of ${S.pages} pages that call it`);
console.log(JSON.stringify(Object.entries(R.byView).sort((a, b) => b[1] - a[1]).slice(0, 14)));
