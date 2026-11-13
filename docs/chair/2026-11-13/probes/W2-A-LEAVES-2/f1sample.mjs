import fs from 'node:fs'; import zlib from 'node:zlib';
const S = process.argv[2];
const recs = new Map(zlib.gunzipSync(fs.readFileSync(`${S}/out/base/corpus.ndjson.gz`)).toString().split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const t = JSON.parse(fs.readFileSync(`${S}/out/gaps.tip1.json`)); const l = JSON.parse(fs.readFileSync(`${S}/out/gaps.lane.json`));
const restored = []; for (const k of Object.keys(l).sort()) for (const g of l[k].gaps) if (!t[k].gaps.includes(g)) restored.push([k, g]);
const pick = restored.filter((_, i) => i % 14 === 7).slice(0, 30);
let n = 0;
for (const [k, g] of pick) {
  const s = recs.get(k); const ra = s.resourceAnalysis || {}; const es = s.economicState || {};
  const good = g.match(/^No (.+?) (?:reaches|reach)/)[1];
  const goods = good.split(/, | or | and /);
  const inTrade = (es.primaryImports || []).filter((x) => goods.some((w) => x.toLowerCase().includes(w.split(' ')[0].toLowerCase())));
  const house = g.match(/the (.+)\.$/)[1];
  const gap = (ra.gaps || []).filter((x) => house.toLowerCase().includes(String(x.institution).toLowerCase().split(' ')[0]) || String(x.institution).toLowerCase().includes(house.split(' ')[0]));
  const reasons = Object.entries(ra.imports?.reasons || {}).filter(([kk]) => goods.some((w) => kk.toLowerCase().includes(w.split(' ')[0].toLowerCase()))).map(([kk, v]) => `${kk}: ${v}`);
  const local = (es.localProduction || []).filter((x) => goods.some((w) => x.toLowerCase().includes(w.split(' ')[0].toLowerCase())));
  const chains = (es.activeChains || []).filter((c) => goods.some((w) => JSON.stringify(c).toLowerCase().includes(w.split(' ')[0].toLowerCase()))).map((c) => `${c.chainId || c.id || c.label}:${c.status || c.state || ''}${c.entrepot ? ' entrepot' : ''}`);
  console.log(`${++n}. ${k} | ${g} | record gap: ${gap.map((x) => `${x.institution}/${x.kind}: ${x.description || x.reason || ''}`).join('; ') || 'NONE MATCHED'} | trade imports naming it: ${inTrade.join(',') || 'none'} | produced locally: ${local.join(',') || 'none'} | need list: ${reasons.join('; ') || '-'} | chains: ${chains.join(',') || 'none'}`);
}
console.log('restored', restored.length);
