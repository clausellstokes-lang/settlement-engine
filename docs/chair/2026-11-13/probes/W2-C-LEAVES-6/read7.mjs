import { load } from './load.mjs';
const B=await import(process.env.TREE+'/src/domain/display/tradeListDisplay.js');
const { liveInstitutionNames } = await import(process.env.TREE+'/src/domain/facts/institutions.js');
const { chainCarrierOf } = await import(process.env.TREE+'/src/domain/facts/chainCarrier.js');
const want=process.env.WANT.split(','); const got={}; 
for (const f of process.argv.slice(2)) for(const {seed,s} of load(f)){
 for(const c of s.economicState?.activeChains||[]){ const before=(c.outputs||[]).slice(0,3), after=B.chainOutputsShown(c,s).slice(0,3); const gone=before.filter(o=>!after.includes(o)); if(!gone.length) continue;
  for(const w of want){ const [cid,g]=w.split(':'); if(c.chainId===cid && gone.includes(g) && (got[w]=(got[w]||0)+1)<=2){
   const live=liveInstitutionNames(s); const heads=c.processingInstitutions.map(h=>h.toLowerCase().split(/[\s(]/)[0]);
   console.log(`${seed} [${s.tier}] ${c.label} (${c.status}, ground ${c.resourceInputKey}, carrier ${chainCarrierOf(c,s).kind}) procs=${c.processingInstitutions.join('/')}\n  roster-matches=${live.filter(n=>heads.some(h=>n.toLowerCase().includes(h))).join('; ')||'none'}\n  outputs ${before.join(' · ')}  =>  ${after.join(' · ')||'(no box)'}`);}}}}
