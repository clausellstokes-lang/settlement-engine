// readsheet.mjs <lines.json> <sel.json> <dumps dir> <births.gz> <out.md> [ids,comma]: for each line and each of its reading
// towns: the page lines (with their tab) that carry the line's text, as the owner's page prints them, and the town's own
// record facts a reader needs to judge it (size, crisis, powers, houses, the food record, prosperity, history, the
// holder for a person's line). The reviewer reads this sheet line by line and writes the verdicts by hand.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [lf, sf, dd, births, outf, only] = process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(lf)); const SEL=JSON.parse(fs.readFileSync(sf)); const ids=only?only.split(','):Object.keys(SEL);
const want=new Set(ids.flatMap(i=>SEL[i]?.pick||[])); const rec=new Map();
const rl=readline.createInterface({input:fs.createReadStream(births).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const i=line.indexOf('","s"'); const seed=line.slice(9,i); if(want.has(seed)) rec.set(seed, JSON.parse(line).s); }
const fact=(s)=>{ const es=s.economicState||{}; const fr=es.foodSecurity?.foodRecord||{}; const inst=(s.institutions||[]).map(x=>x.name);
  const key=inst.filter(n=>/granar|market|wall|palisade|gate|garrison|militia|watch|guard|harbou|dock|port|mill|church|temple|shrine|chapel|priest|abbey|monaster|thieves|council|hall|court|guild/i.test(n));
  return [`tier ${s.tier} pop ${s.population} · crisis ${(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type+(x.name?`(${x.name})`:'')).join('+')||'none'} · prosperity ${es.prosperity} · route ${s.config?.tradeRouteAccess} · terrain ${s.config?.terrainType}`,
   `powers ${(s.powerStructure?.factions||[]).length}: ${(s.powerStructure?.factions||[]).map(f=>`${f.faction||f.name}[${f.category||''} ${Math.round(f.power||0)}]`).join('; ')} · govt ${s.powerStructure?.government?.name||s.powerStructure?.governmentType||''}`,
   `houses (${inst.length}) key: ${key.join('; ')}`,
   `food: sources ${JSON.stringify(fr.foodSources)} failed ${fr.failedSource} granary ${fr.hasGranary} · balance ${JSON.stringify({imp:es.foodSecurity?.importCoverage, ch:es.foodSecurity?.importChannel})} · exports ${JSON.stringify(es.primaryExports)} imports ${JSON.stringify(es.primaryImports)}`,
   `history: ${(s.history?.events||s.history?.historicalEvents||[]).map(e=>`${e.name}(${e.severity||''},${e.yearsAgo??''}y,${e.type||''})`).join('; ')}`].join('\n    '); };
let md=`# Reading sheet ${ids.join(',')}\n`;
for(const id of ids){ const l=L.find(x=>x.id===id); const sel=SEL[id]; if(!l||!sel) continue; const rx=new RegExp(l.rx.replace(/^\^/,'').replace(/\$$/,''));
  md+=`\n## ${id} · ${l.file} · ${l.where} · ${l.cond} · prints in ${sel.n} towns (${sel.sizes.join(',')})\n`;
  for(const seed of sel.pick){ const s=rec.get(seed); const f=`${dd}/${seed}.txt`; let page='(no dump)'; let ctx=[];
    if(fs.existsSync(f)){ const ls=fs.readFileSync(f,'utf8').split('\n'); let tab=''; for(const x of ls){ if(x.startsWith('== ')) { tab=x; continue; } if(rx.test(x)) ctx.push(`[${tab.replace(/==/g,'').trim()}] ${x.length>700?x.slice(0,700)+'…':x}`); } page=ctx.length?ctx.slice(0,6).join('\n      '):'(NOT ON THE PAGE)'; }
    md+=`\n### ${seed}\n    ${s?fact(s):'(no record)'}\n    PAGE: ${page}\n`; } }
fs.writeFileSync(outf, md); console.log('wrote', outf, md.length);
