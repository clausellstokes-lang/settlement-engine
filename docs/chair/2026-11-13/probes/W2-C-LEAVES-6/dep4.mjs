import { load } from './load.mjs';
const R=process.env.TREE+'/src';
const { importsAsPrinted, needMetBy } = await import(R+'/domain/display/tradeListDisplay.js');
const { liveInstitutionNames } = await import(R+'/domain/facts/institutions.js');
const T=load(process.argv[2]); const imp=new Map(), cnt={}; const inc=(k)=>cnt[k]=(cnt[k]||0)+1;
for(const {seed,s} of T){ const arr=importsAsPrinted(s).arriving; const live=liveInstitutionNames(s); const near=(s.config?.nearbyResources||[]).join(',');
 for(const c of s.economicState?.activeChains||[]){ const d=c.dependency; if(!d) continue;
  inc('impact:'+d.impact.slice(0,30)); inc('live:'+live.includes(d.institution)); if(/^access to/i.test(d.institution)) inc('access house');
  if(d.resource==='Magical ley lines') inc('ley near='+/ley/.test(near));
  const parts=d.resource.split(/\s*\+\s*/).map(p=>p.toLowerCase()).filter(p=>!/trade access|capital|harbour|water power|knowledge|ley/.test(p));
  for(const p of parts){ const met=arr.some(a=>needMetBy(p,a)||a.toLowerCase().includes(p.split(/[ /]/)[0])); const k=p+' imported='+met; imp.set(k,(imp.get(k)||0)+1);} } }
console.log(cnt); console.log([...imp].sort().join('\n'));
