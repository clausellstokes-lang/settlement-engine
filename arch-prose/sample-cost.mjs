// READ-ONLY: how expensive is an N-town composed-prose sample, and what does one town yield?
// Composes through the SHIPPED desk-read caller (generalDeskLines), never with `{}` readings.
import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const imp=(p)=>import(pathToFileURL(D+'/'+p).href);
const {generateSettlementPipeline}=await imp('src/generators/generateSettlementPipeline.js');
const {generalDeskLines}=await imp('src/components/new/generalDeskRead.js');
const N=Number(process.argv[2]||5);
const config={settType:'town',culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'};
const walk=(o,out,depth=0)=>{if(!o||typeof o!=='object'||depth>10)return;
  if(typeof o.blockId==='string'&&typeof o.poolKey==='string'&&typeof o.text==='string'){out.push({b:o.blockId,p:o.poolKey,a:o.angle||'',t:o.text});return;}
  if(typeof o.sentence==='string'&&o.provenance&&typeof o.provenance.blockId==='string'){out.push({b:o.provenance.blockId,p:o.provenance.poolKey,a:o.provenance.angle||'',t:o.sentence});return;}
  for(const v of Object.values(o)) walk(v,out,depth+1);};
const t0=Date.now(); let genMs=0, compMs=0; const cellHits=new Map(); let lines=0;
for(let i=0;i<N;i++){
  const g0=Date.now(); const s=generateSettlementPipeline(config,null,{seed:`occ-${i}`,customContent:{}}); genMs+=Date.now()-g0;
  const seed=String(s._seed??s.id??''); const c0=Date.now(); const out=[];
  try{ walk(generalDeskLines(s,{seed,audience:'dm'}),out); }catch(e){ console.log('threw',e.message.slice(0,100)); }
  compMs+=Date.now()-c0; lines+=out.length;
  for(const l of out) cellHits.set(`${l.b}::${l.p}`,(cellHits.get(`${l.b}::${l.p}`)||0)+1);
}
const total=Date.now()-t0;
console.log(`N=${N} towns · total ${total} ms (generate ${genMs} ms, compose ${compMs} ms) = ${(total/N).toFixed(0)} ms/town`);
console.log(`general-desk lines: ${lines} total, ${(lines/N).toFixed(1)} per town; distinct (block,pool) cells hit: ${cellHits.size}`);
const top=[...cellHits].sort((a,b)=>b[1]-a[1]).slice(0,8);
console.log('most-occurring cells: '+top.map(([k,v])=>`${k} ${v}/${N}`).join(' · '));
const once=[...cellHits].filter(([,v])=>v===1).length;
console.log(`cells hit on exactly one of ${N} towns: ${once}`);
console.log(`PROJECTED 200-town cost from this rate: ${(total/N*200/1000).toFixed(1)} s (general desk only)`);
