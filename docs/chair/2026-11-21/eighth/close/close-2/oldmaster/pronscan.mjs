// usage: node pronscan.mjs <treeThen> <treeNow> -- count rows with an object pronoun in subject position
const trees = process.argv.slice(2);
const gens = []; for (const t of trees) gens.push((await import(`${t}/src/generators/generateSettlementPipeline.js`)).generateSettlementPipeline);
const { goldenCorpus } = await import(`${trees[0]}/tests/helpers/goldenMasterCorpus.js`);
const RE = /\b(him|her) (cannot|distrusts|has|is|was|will|would|knows|wants|needs|holds|asked|gave|refuses|fears|owes|says|thinks|believes|could|must|does|did|never)\b/;
const counts = trees.map(() => ({ rows: 0, hits: 0, byPath: {}, ex: [] }));
function walk(x, p, cb) { if (x && typeof x === 'object') { for (const k of Object.keys(x)) walk(x[k], Array.isArray(x) ? `${p}[]` : `${p}.${k}`, cb); } else if (typeof x === 'string') cb(p, x); }
for (const c of goldenCorpus()) {
  const { _seed, ...cfg } = c;
  gens.forEach((g, i) => { const s = g(cfg, null, { seed: _seed, customContent: {} }); let hit = false;
    walk(s, '', (p, v) => { if (p.startsWith('.generationCoherenceReceipt')) return; const m = v.match(RE); if (m) { hit = true; counts[i].hits++; counts[i].byPath[p] = (counts[i].byPath[p] || 0) + 1; if (counts[i].ex.length < 4) counts[i].ex.push(c.settType + ': ' + v.slice(Math.max(0, m.index - 80), m.index + 40)); } });
    if (hit) counts[i].rows++; });
}
console.log(JSON.stringify(counts, null, 1));
