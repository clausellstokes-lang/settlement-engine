import fs from 'node:fs';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const seeds=fs.readFileSync(process.env.IN,'utf8').trim().split('\n').map(JSON.parse).filter(o=>o.hit.mineOld).map(o=>o.seed);
let n=0,working=0; const rows=[];
for(const seed of seeds){ const s=born(seed); const ch=(s.economicState?.activeChains||[]).filter(c=>/mining|^iron$|precious|petty/.test(c.chainId||c.id||'')).map(c=>(c.chainId||c.id)+':'+(c.status||c.state));
  const ok=ch.some(x=>/running|vulnerable/.test(x)); n++; if(ok)working++; rows.push(seed+' '+ch.join(','));}
console.log('mineOld prints',n,'a mining chain running/vulnerable',working); fs.writeFileSync(process.env.OUT,rows.join('\n')+'\n');
