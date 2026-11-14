import {towns} from './iter.mjs';
const [B,seedRe,chainRe]=process.argv.slice(2); const sr=new RegExp(seedRe), cr=new RegExp(chainRe);
for await (const {seed,s} of towns(B)){ if(!sr.test(seed)) continue; for(const c of s.economicState?.activeChains||[]) if(cr.test(c.chainId)) { const {outputs,services,upstreamChains,needColor,...r}=c; console.log(seed, JSON.stringify(r)); } }
