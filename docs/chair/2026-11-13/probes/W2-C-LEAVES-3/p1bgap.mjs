import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T,diff]=process.argv.slice(2); const D=new Map(JSON.parse(fs.readFileSync(diff)).filter(d=>d.gap).map(d=>[d.seed,d.gap.added]));
const { liveInstitutions } = await import(T+'/src/domain/institutions/institutionRoster.js');
const L=await import(T+'/src/domain/facts/chainWorking.js');
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); if(!D.has(seed)) continue;
  const houses=liveInstitutions(s).map(i=>i.name).filter(n=>/wood|saw|carpent|lumber|bow|charcoal|boat|ship|cooper|salt|thatch|joiner/i.test(n));
  const ch=(s.economicState.activeChains||[]).filter(c=>/forest|timber|salt/.test(c.resourceInputKey||'')).map(c=>`${c.chainId}:${c.status}:${c.resourceInputKey}:${c.resourceInputAvailable}`);
  console.log(seed,'|',D.get(seed)[0].slice(0,60),'| houses:',houses.join(', ')||'-','| chains:',ch.join('; ')||'-','| exports:',(s.economicState.primaryExports||[]).filter(e=>/wood|timber|salt|lumber|beam/i.test(e)).join('; '),'| nearby:',(s.config.nearbyResources||[]).filter(k=>/forest|timber|grove|salt/.test(k)).join(','),'| depl:',(s.config.nearbyResourcesDepleted||[]).filter(k=>/forest|timber|grove|salt/.test(k)).join(','));
}
