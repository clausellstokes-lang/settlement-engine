// Print chain cards (state as shown) for given seeds of a corpus.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T,...want]=process.argv.slice(2);
const { chainStateShown } = await import(T+'/src/domain/display/chainStateShown.js');
const { chainCarrierOf } = await import(T+'/src/domain/facts/chainCarrier.js');
const { crisisOf } = await import(T+'/src/domain/facts/crisisKind.js');
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  if(want.length && !want.includes(seed)) continue;
  console.log('##',seed,[...crisisOf(s).keys?.()||[]].join('+'),'near:',(s.config?.nearbyResources||[]).join(','),'| inst:',(s.institutions||[]).map(i=>i.name).join('; ').slice(0,600));
  for(const c of s.economicState?.activeChains||[]) console.log('  ',c.chainId,'|',c.label,'| st',c.status,'→',chainStateShown(c,s),'| carrier',chainCarrierOf(c,s).kind,'| rk',c.resourceKey,'rik',c.resourceInputKey,'| inst',JSON.stringify(c.institutions||c.processingInstitutions||[]).slice(0,160),'| need',c.needKey);
}
