import {towns} from './iter.mjs';
const {chainPrintName}=await import('/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/domain/display/chainPrintName.js');
let a=0,t=new Set(),a7=0,t7=new Set();
for await (const {seed,s} of towns(process.argv[2])) for(const c of s.economicState?.activeChains||[]){ if(chainPrintName(c,s).resource===c.resource) continue; a++; t.add(seed); if(/^r2[rs]-/.test(seed)){a7++;t7.add(seed);} }
console.log({all:a,towns:t.size,r720:a7,t720:t7.size});
