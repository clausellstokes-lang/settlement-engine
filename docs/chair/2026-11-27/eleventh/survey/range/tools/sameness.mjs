// RANGE-MEASURE (C)(i) and (iii): what a reader sees across towns, and the shapes of the code-composed sentences.
// node sameness.mjs <keys.json> <out.json> <name>:<matched.jsonl>:<names.json> ...
import { readFileSync, writeFileSync, createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
const [KEYS, OUT, ...CORP] = process.argv.slice(2);
const { keys, code } = JSON.parse(readFileSync(KEYS, 'utf8'));
const homeOf = (a) => (!a ? '' : a[0] === 'K' ? keys[+a.slice(1).split('.')[0]].key : `${code[+a.slice(1)].home}`);
const fileOf = (a) => (!a ? '' : a[0] === 'K' ? keys[+a.slice(1).split('.')[0]].file : code[+a.slice(1)].site.split(':')[0]);
const tmplOf = (a) => (a[0] === 'K' ? (() => { const [k, l] = a.slice(1).split('.'); return keys[+k].lines[+l].text; })() : code[+a.slice(1)].text);
const isChromeA = (a) => a && (/^src\/copy\//.test(fileOf(a)) || (a[0] === 'X' && code[+a.slice(1)].jsx));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const result = {};
for (const spec of CORP) {
  const [name, matched, namesF] = spec.split(':');
  const { names } = JSON.parse(readFileSync(namesF, 'utf8'));
  const pages = [];
  const rl = createInterface({ input: createReadStream(matched), crlfDelay: Infinity });
  for await (const L of rl) {
    if (!L) continue; const r = JSON.parse(L); if (r.error) continue;
    const ns = names[r.seed] || [];
    const re = ns.length ? new RegExp(`(?<![\\p{L}])(${ns.map(esc).join('|')})(?![\\p{L}])`, 'gu') : null;
    pages.push({ seed: r.seed, size: r.size, s: r.sents.map(([tab, s, a]) => [tab, re ? s.replace(re, '#') : s, a]) });
  }
  // towns per masked sentence, by size and overall
  const bySize = new Map(); const all = new Map();
  for (const p of pages) {
    const seen = new Set(p.s.map((x) => x[1]));
    for (const m of seen) {
      const k = `${p.size}\u0000${m}`; bySize.set(k, (bySize.get(k) || 0) + 1); all.set(m, (all.get(m) || 0) + 1);
    }
  }
  const N = pages.length; const perSizeN = {}; for (const p of pages) perSizeN[p.size] = (perSizeN[p.size] || 0) + 1;
  // chrome: an interface line (copy, JSX text) or a sentence on 90%+ of all pages
  const chrome = (m, a) => isChromeA(a) || ((!a || /^src\/(components|pdf)\//.test(fileOf(a))) && all.get(m) >= 0.9 * N);
  const perPage = {}; const tabs = {}; const sizes = {}; let tot = 0; let rep = 0; let chromeN = 0;
  const top = new Map();
  const shapes = new Map(); let codeN = 0; let poolN = 0; let noneN = 0;
  for (const p of pages) {
    const z = (sizes[p.size] ||= { sents: 0, rep: 0 });
    for (const [tab, m, a] of p.s) {
      if (chrome(m, a)) { chromeN++; continue; }
      const c = bySize.get(`${p.size}\u0000${m}`);
      const t = (tabs[tab] ||= { sents: 0, rep: 0, bySize: {} });
      const tz = (t.bySize[p.size] ||= { sents: 0, rep: 0 });
      t.sents++; tz.sents++; z.sents++; tot++;
      if (c >= 2) { t.rep++; tz.rep++; z.rep++; rep++; }
      if (c >= 0.1 * perSizeN[p.size]) { t.r10 = (t.r10 || 0) + 1; z.r10 = (z.r10 || 0) + 1; tz.r10 = (tz.r10 || 0) + 1; }
      if (c >= 0.5 * perSizeN[p.size]) { t.r50 = (t.r50 || 0) + 1; z.r50 = (z.r50 || 0) + 1; tz.r50 = (tz.r50 || 0) + 1; }
      { const pg = (perPage[p.seed] ||= { size: p.size, n: 0, rep: 0, r10: 0, r50: 0 }); pg.n++; if (c >= 2) pg.rep++; if (c >= 0.1 * perSizeN[p.size]) pg.r10++; if (c >= 0.5 * perSizeN[p.size]) pg.r50++; }
      if (!top.has(m)) top.set(m, { towns: all.get(m), a, tab, sizes: {} });
      // shape
      let shape;
      if (a) shape = tmplOf(a).replace(/\{[^}]*\}|\u0001/g, '…');
      else shape = m.replace(/\d[\d,.]*/g, 'N');
      const kind = !a ? 'none' : a[0] === 'K' ? (keys[+a.slice(1).split('.')[0]].lines.length >= 2 ? 'pool' : 'cell') : 'code';
      if (kind === 'pool') poolN++; else if (kind === 'none') noneN++; else codeN++;
      const sk = `${kind}\u0000${shape}`;
      const e = shapes.get(sk) || { n: 0, kind, shape, home: a ? homeOf(a) : '(unhomed)' };
      e.n++; shapes.set(sk, e);
    }
  }
  for (const [m, e] of top) for (const p of []) void p;
  // sizes of each top sentence
  const topList = [...top.entries()].sort((x, y) => y[1].towns - x[1].towns).slice(0, 300);
  const want = new Set(topList.map(([m]) => m));
  for (const p of pages) for (const m of new Set(p.s.map((x) => x[1]))) if (want.has(m)) { const e = top.get(m); e.sizes[p.size] = (e.sizes[p.size] || 0) + 1; }
  const shapeList = [...shapes.values()].sort((x, y) => y.n - x.n);
  result[name] = {
    perPage, pages: N, sentences: tot, chrome: chromeN, repeatedSameSize: rep, tabs, sizes,
    top: topList.map(([m, e]) => ({ s: m, towns: e.towns, sizes: e.sizes, tab: e.tab, home: e.a ? homeOf(e.a) : '(unhomed)' })),
    shapes: { pool: poolN, cellAndCode: codeN, unhomed: noneN, distinct: { all: shapeList.length, code: shapeList.filter((x) => x.kind !== 'pool').length }, top: shapeList.slice(0, 400) },
  };
  console.log(`${name}: pages ${N} sentences ${tot} (chrome left out ${chromeN}); in another town of its size ${(100 * rep / tot).toFixed(1)}%; pool ${poolN} cell+code ${codeN} unhomed ${noneN}; shapes ${shapeList.length}`);
}
writeFileSync(OUT, JSON.stringify(result));
