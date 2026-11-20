import { load } from './load.mjs';
const R=process.env.TREE+'/src';
const { chainNeedLine } = await import(R+'/domain/display/chainNeedShown.js');
const { importsAsPrinted } = await import(R+'/domain/display/tradeListDisplay.js');
const { crisisOf } = await import(R+'/domain/facts/crisisKind.js');
const want=new Set(process.env.SEEDS?.split(',')||[]); const byTier={};
for (const f of process.argv.slice(2)) for(const {seed,s} of load(f)){ let first=false; let n=0;
 for(const c of s.economicState?.activeChains||[]){ const l=chainNeedLine(c,s,!first); if(l){first=true;n++;} 
  if(want.has(seed)&&c.dependency) console.log(`${seed} [${s.tier} ${crisisOf(s).types.join('+')||'calm'} ${s.economicState.tradeAccess}] card=${c.label} status=${c.status} house=${c.dependency.institution} need=${c.dependency.resource}\n   imports=${importsAsPrinted(s).arriving.join('; ')}\n   => ${l||'(nothing)'}`); }
 const k=s.tier+' '+(crisisOf(s).types.join('+')||'calm'); if(n) byTier[k]=(byTier[k]||0)+1; }
if(!want.size) console.log(byTier);
