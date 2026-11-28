// K3 MEASURE: what a POWER's rename (F) and a HOUSE's rename (H) through the product's own writers change on the page, put down
// to the kind readers whose verdict on the renamed entity changed (old name before against new name after)
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s) => String(s).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
for (const C of ['C', 'V']) {
  const R = { births: 0, errors: 0, stored: { powerCategory: 0, powerArchetype: 0, houseCategory: 0, houseCatalogId: 0, houseTags: 0, houseFacets: 0, power: 0, house: 0 } };
  for (const k of ['F', 'H']) R[k] = { renamed: 0, skip: {}, pagesMoved: 0, linesMoved: 0, byView: {}, readerChanged: {}, pagesByReader: {}, pagesMovedNoReader: 0, ex: [] };
  const rl = readline.createInterface({ input: createReadStream(`/home/user/scratch/work/K3-${C}.jsonl`), crlfDelay: Infinity });
  for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); if (j.error) { R.errors++; continue; } R.births++;
    const st = j.stored || {}; if (st.power) { R.stored.power++; if (st.power.category) R.stored.powerCategory++; if (st.power.archetype) R.stored.powerArchetype++; }
    if (st.house) { R.stored.house++; if (st.house.category) R.stored.houseCategory++; if (st.house.catalogId) R.stored.houseCatalogId++; if (st.house.tags?.length) R.stored.houseTags++; if (st.house.facets && Object.keys(st.house.facets).length) R.stored.houseFacets++; }
    const verdicts = (kinds, nm) => { const m = new Map(); for (const e of kinds || []) { const [f, , n, v] = e.split('\t'); if (n === nm) { if (!m.has(f)) m.set(f, new Set()); m.get(f).add(v); } } return m; };
    for (const k of ['F', 'H']) { const v = j.vars?.[k]; const S = R[k]; if (!v || v.skip) { S.skip[v?.skip || 'none'] = (S.skip[v?.skip || 'none'] || 0) + 1; continue; } S.renamed++;
      const re = new RegExp(esc(v.old), 'g'); let moved = 0;
      for (const [view, d] of Object.entries(v.diff)) { const came = [...(d.came || [])].map(norm); let n = 0;
        for (const g of (d.gone || []).map(norm)) { const want = g.replace(re, v.neu); const i = came.indexOf(want); if (i >= 0 && want !== g) came.splice(i, 1); else n++; }
        n += came.length; if (n) { S.byView[view] = (S.byView[view] || 0) + n; moved += n; } }
      if (moved) { S.pagesMoved++; S.linesMoved += moved; }
      const before = verdicts(j.kinds, v.old); const after = verdicts(v.kinds, v.neu); const changed = [];
      for (const f of new Set([...before.keys(), ...after.keys()])) { const a = [...(before.get(f) || [])].sort().join('|'); const b = [...(after.get(f) || [])].sort().join('|'); if (a !== b) { changed.push(f); const key = `${f}: ${a} -> ${b}`; S.readerChanged[key] = (S.readerChanged[key] || 0) + 1; } }
      for (const f of changed) if (moved) S.pagesByReader[f] = (S.pagesByReader[f] || 0) + 1;
      if (moved && !changed.length) { S.pagesMovedNoReader++; if (S.ex.length < 4) S.ex.push(`${j.seed} ${v.old}->${v.neu}: ${Object.keys(v.diff).join(',')}`); } }
  }
  const top = (o, n = 14) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n));
  console.log(`== ${C}`, JSON.stringify({ births: R.births, errors: R.errors, stored: R.stored }));
  for (const k of ['F', 'H']) { const S = R[k]; console.log(` ${k}`, JSON.stringify({ renamed: S.renamed, skip: S.skip, pagesMoved: S.pagesMoved, linesMoved: S.linesMoved, pagesMovedNoReader: S.pagesMovedNoReader }));
    console.log('   byView', JSON.stringify(top(S.byView))); console.log('   pagesByReader', JSON.stringify(top(S.pagesByReader))); console.log('   readerChanged', JSON.stringify(top(S.readerChanged, 20))); console.log('   ex', S.ex.join(' | ')); }
}
