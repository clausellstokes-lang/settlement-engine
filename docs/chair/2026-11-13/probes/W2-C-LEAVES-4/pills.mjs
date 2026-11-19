// Every Produced-locally and Exports pill as printed at tree T, classed. Writes JSON to OUT; prints a frequency table.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T,OUT]=process.argv.slice(2);
const t=await import(T+'/src/domain/display/tradeListDisplay.js');
const { RESOURCE_DATA } = await import(T+'/src/data/goods/identity.js');
const { liveInstitutionNames, ACCESS_ONLY } = await import(T+'/src/domain/facts/institutions.js');
const { tradeMarkOf } = t;
const COMM=new Map(); for(const [k,r] of Object.entries(RESOURCE_DATA)) for(const c of r.commodities||[]) { const x=String(c).toLowerCase().replace(/_/g,' '); COMM.set(x,[...(COMM.get(x)||[]),k]); }
const TG=new Map(); for(const [k,r] of Object.entries(RESOURCE_DATA)) for(const c of r.tradeGoods||[]) { const x=String(c).toLowerCase(); TG.set(x,[...(TG.get(x)||[]),k]); }
const rows=[]; const freq={};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const eco=s.economicState||{}; const roster=liveInstitutionNames(s).map(n=>n.toLowerCase()); const own=roster.filter(n=>!ACCESS_ONLY.test(n));
  const imp=t.importsAsPrinted(s).arriving.map(x=>tradeMarkOf(x).label.toLowerCase());
  const lists={ local:t.localProductionAsPrinted(s), exports:(t.exportsAsPrinted?t.exportsAsPrinted(s):t.displayTradeList(eco.primaryExports,s,{side:'exports'})) };
  for(const [side,list] of Object.entries(lists)) for(const raw of list){
    const p=tradeMarkOf(raw).label; const lo=p.toLowerCase();
    const mk=(eco.activeChains||[]).filter(c=>(c.outputs||[]).some(o=>String(o).toLowerCase()===lo));
    const svc=(eco.institutionalServices||[]).filter(v=>[v.output,v.exportLabel].map(x=>String(x||'').toLowerCase()).includes(lo));
    const cls= COMM.has(lo.replace(/_/g,' '))?'comm': TG.has(lo)?'tradegood': mk.length?'output': svc.length?'service':'other';
    const houseHeld=mk.map(c=>(c.processingInstitutions||[]).filter(h=>own.some(n=>n.includes(String(h).toLowerCase().split(/[\s(]/)[0]))));
    const row={seed,side,p,cls,makers:mk.map((c,i)=>({id:c.chainId,st:c.status,held:houseHeld[i]})),svc:svc.map(v=>v.institutions),bought:imp.includes(lo)};
    rows.push(row); const k=`${side}|${cls}|${p}`; freq[k]=(freq[k]||0)+1;
  }
}
fs.writeFileSync(OUT,JSON.stringify(rows));
const by={}; for(const [k,n] of Object.entries(freq)){const [sd,c]=k.split('|'); (by[sd+'|'+c]=by[sd+'|'+c]||[]).push([n,k.split('|')[2]]);}
for(const [k,v] of Object.entries(by)) { v.sort((a,b)=>b[0]-a[0]); console.log(k, v.reduce((a,b)=>a+b[0],0), '::', v.slice(0,40).map(([n,p])=>`${p}(${n})`).join(', ')); }
