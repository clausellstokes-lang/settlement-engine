// sheet.mjs <tree> <lines.json> <sel.json> <dumps> <births.gz> <fd-neut.jsonl> <outdir>: one reading sheet per line.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [T, lf, sf, dd, births, fdn, od] = process.argv.slice(2); fs.mkdirSync(od,{recursive:true});
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js');
const L=JSON.parse(fs.readFileSync(lf)); const SEL=JSON.parse(fs.readFileSync(sf));
const want=new Set(Object.values(SEL).flatMap(x=>x.pick)); const rec=new Map();
const rl=readline.createInterface({input:fs.createReadStream(births).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const seed=line.slice(9,line.indexOf('","s"')); if(want.has(seed)) rec.set(seed, JSON.parse(line).s); }
const FD={}; for(const l of fs.readFileSync(fdn,'utf8').trim().split('\n')){ const r=JSON.parse(l); (FD[r.seed]||(FD[r.seed]=[])).push(r); }
const esc=(t)=>String(t).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const fact=(s)=>{ const es=s.economicState||{}; const fs_=es.foodSecurity||{}; const fr=fs_.foodRecord||{}; const inst=(s.institutions||[]).map(x=>x.name); let f={}; try{ f=factsOf(s);}catch{}
  const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]);
  return [`tier ${s.tier} pop ${s.population} band ${f.populationBand} · crisis ${st.map(x=>x.type+(x.name?`(${x.name})`:'')).join('+')||'none'} · prosperity ${es.prosperity} · route ${s.config?.tradeRouteAccess} · terrain ${s.config?.terrainType} · water ${JSON.stringify(f.water)} · market ${f.hasMarket ?? f.market} · war ${f.warState}`,
   `powers: ${(s.powerStructure?.factions||[]).map(x=>`${x.faction||x.name}[${x.category||''} ${Math.round(x.power||0)}]`).join('; ')} · govt ${s.powerStructure?.government?.name||s.powerStructure?.governmentType||''} · governing ${s.powerStructure?.governingFaction||''}`,
   `houses (${inst.length}): ${inst.join('; ')}`,
   `resources: ${JSON.stringify(s.config?.nearbyResources)} depleted ${JSON.stringify((s.resourceAnalysis?.resourceConditions||[]).filter(c=>/deplet/i.test(String(c.type||c.status||''))).map(c=>c.key))}`,
   `food: sources ${JSON.stringify(fr.foodSources)} failed ${fr.failedSource} granary ${fr.hasGranary} · importCoverage ${fs_.importCoverage} channel ${fs_.importChannel} deficit ${s.economicViability?.metrics?.foodBalance?.deficit ?? ''} · imports ${JSON.stringify(es.primaryImports)} · exports ${JSON.stringify(es.primaryExports)}`,
   `isolationSupport paths: ${JSON.stringify((s.isolationSupport?.paths||[]).map(p=>({type:p.type,ev:(p.evidence||[]).slice(0,3)})))}`,
   `founding: reason ${JSON.stringify(s.history?.founding?.reason)} · foundedBy ${JSON.stringify(s.history?.founding?.foundedBy)}`,
   `history events: ${(s.history?.historicalEvents||s.history?.events||[]).map(e=>`${e.name}(${e.severity||''},${e.yearsAgo??''}y)`).join('; ').slice(0,500)}`].join('\n    '); };
for(const l of L){ const sel=SEL[l.id]; if(!sel) continue; let md=`# ${l.id} · ${l.file} · ${l.where}\n# declared: ${l.cond} · prints in ${sel.n} of 3,048 births\n`;
  for(const seed of sel.pick){ const s=rec.get(seed); let rx=l.rx, extra='';
    if(l.src){ const path=l.id==='L25'?'.history.founding.reason':l.id==='L32'?'.settlementReason':'.npcs'; const d=(FD[seed]||[]).filter(r=>r.path.startsWith(path)); extra=d.map(r=>`    WITHOUT THE STAGE'S RESOLUTION: ${JSON.stringify(r.base)}\n    AT THE TIP:                     ${JSON.stringify(r.tip)}  (${r.path})`).join('\n'); rx=d.map(r=>esc(String(r.tip??'').slice(0,60))).filter(Boolean).join('|')||'^$';
      if(l.id==='L49'){ const m=d[0]?.path.match(/^\.npcs\[(\d+)\]/); const n=m&&s.npcs[+m[1]]; if(n) extra+=`\n    HOLDER: ${n.name} · role ${n.role} · category ${n.category} · faction ${n.factionAffiliation||n.faction||''}`; } }
    const f=`${dd}/${seed}.txt`; let ctx=[]; if(fs.existsSync(f)){ const R=new RegExp(rx); let tab=''; for(const x of fs.readFileSync(f,'utf8').split('\n')){ if(x.startsWith('== ')){tab=x.replace(/==/g,'').trim();continue;} if(R.test(x)) ctx.push(`[${tab}] ${x.length>900?x.slice(0,900)+'…':x}`); } }
    md+=`\n## ${seed}\n    ${s?fact(s):'(no record)'}\n${extra?extra+'\n':''}    PAGE (${ctx.length} lines): ${ctx.length?ctx.slice(0,8).join('\n      '):'(NOT ON THE PAGE)'}\n`; }
  fs.writeFileSync(`${od}/${l.id}.md`, md); }
console.log('sheets', fs.readdirSync(od).length);
