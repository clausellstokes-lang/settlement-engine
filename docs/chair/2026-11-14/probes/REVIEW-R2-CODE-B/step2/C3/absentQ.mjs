import fs from 'node:fs'; import {towns} from './iter.mjs';
const [B,DUMPS]=process.argv.slice(2); const bySize={};
for await (const {seed,s} of towns(B)){ const df=`${DUMPS}/${seed}.txt`; if(!fs.existsSync(df)) continue;
  const eco=new Set((fs.readFileSync(df,'utf8').split(/^== /m).find(x=>x.startsWith('Systems/Economics'))||'').split('\n'));
  const chains=s.economicState?.activeChains||[]; const live=new Set(chains.filter(c=>c.resourceCondition!=='absent').map(c=>c.resource));
  for(const c of chains){ if(c.resourceCondition!=='absent'||live.has(c.resource)) continue; if(!(eco.has(c.resource)||eco.has(c.resource+' (depleted)'))) continue;
    const kind=c.substituteActive&&c.resourceInputAvailable&&c.resourceInputKey!==c.resourceKey?'sub<-'+c.resourceInputKey:(c.entrepot?'entrepot':'other');
    const sz=seed.split('-')[1]; (bySize[sz]=bySize[sz]||[]).push(`${seed} ${c.chainId} "${c.resource}" ${kind} terrain=${s.config.terrainType}`); } }
for(const [sz,a] of Object.entries(bySize)){ console.log('##',sz,a.length); const step=Math.max(1,Math.floor(a.length/5)); for(let i=0;i<a.length&&i<step*5;i+=step) console.log(a[i]); }
