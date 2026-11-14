// ctext.mjs <tree> <births.gz> [seedsCsv|ALL] > out.jsonl : the crisis family's printed lines per town (page + crisis hooks)
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, seeds='ALL'] = process.argv.slice(2); const want = seeds==='ALL'?null:new Set(seeds.split(','));
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeCrisisPage } = await import(tree + '/src/domain/crisis/crisisPage.js');
const { collectPlotHooks } = await import(tree + '/src/domain/dossier/plotHooks.js');
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (want && !want.has(seed)) continue;
  const L=[];
  try { for (const p of composeCrisisPage(s)) { const t=p.type;
    L.push(`${t}|summary|${p.summary}`); L.push(`${t}|hook|${p.hook}`);
    for (const r of p.cast) L.push(`${t}|cast|${r.roleLabel}: ${r.name} · ${r.reason}${r.temporary?' [TEMP]':''}`);
    if(!p.cast.length) L.push(`${t}|cast|nobody`);
    if(!p.edited) for (const a of p.absent) L.push(`${t}|absent|${a.roleLabel}: ${a.reason}`);
    for (const k of p.stakes) L.push(`${t}|stake|${k.factionId} ${k.stake} · ${k.reason}`);
    for (const v of p.levers) L.push(`${t}|lever|${v.institution}${v.holderName?' · held by '+v.holderName:''}`);
    if(!p.levers.length) L.push(`${t}|lever|NONE`);
    for (const f of p.seeFirst) L.push(`${t}|see|${f.label}: ${f.text}`);
    L.push(`${t}|ifnothing|${p.ifNothingIsDone}`); } } catch(e){ L.push('ERR page '+e.message); }
  try { for (const h of collectPlotHooks(s)) if (h.crisis) L.push(`${h.crisis}|chook|${h.text}`); } catch(e){ L.push('ERR hooks '+e.message); }
  console.log(JSON.stringify({ seed, tier: s.tier, pop: s.population, L })); }
