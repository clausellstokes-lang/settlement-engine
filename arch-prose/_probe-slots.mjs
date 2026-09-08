import * as D from '../laneB6/src/data/dossierStateProse/defense.generated.js';
import * as E from '../laneB6/src/data/dossierStateProse/economy.generated.js';
import * as G from '../laneB6/src/data/dossierStateProse/general.generated.js';
import * as P from '../laneB6/src/data/dossierStateProse/power.generated.js';
import * as S from '../laneB6/src/data/dossierStateProse/stressors.generated.js';
import * as W from '../laneB6/src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_CAUSAL_PROSE } from '../laneB6/src/data/dossierCausalProse.generated.js';
const leaves = [D,E,G,P,S,W].map(m=>Object.values(m)[0]);
let blocks=0, pools=0, variants=0;
const slotCount={}, blocksWithSlot={};
for (const leaf of leaves) {
  for (const [bid,b] of Object.entries(leaf)) {
    blocks++;
    const seen=new Set();
    for (const [pk,pool] of Object.entries(b.pools)) {
      pools++;
      for (const v of pool) { variants++; for (const s of (v.slots||[])) { slotCount[s]=(slotCount[s]||0)+1; seen.add(s);} }
    }
    for (const s of seen) blocksWithSlot[s]=(blocksWithSlot[s]||0)+1;
  }
}
console.log('STATE corpus: blocks',blocks,'pools',pools,'variants',variants,'mean/pool',(variants/pools).toFixed(2));
console.log('slot -> variants naming it:', JSON.stringify(Object.fromEntries(Object.entries(slotCount).sort((a,b)=>b[1]-a[1]))));
console.log('slot -> blocks naming it :', JSON.stringify(Object.fromEntries(Object.entries(blocksWithSlot).sort((a,b)=>b[1]-a[1]))));
// causal register
let cb=0, cv=0, cp=0;
for (const [id,f] of Object.entries(DOSSIER_CAUSAL_PROSE)) { cb++; for (const [pk,pool] of Object.entries(f.pools)) { cp++; cv+=pool.length; } }
console.log('CAUSAL register: families',cb,'pools',cp,'variants',cv);
// which blocks name {reason}
const reasonBlocks=[];
for (const leaf of leaves) for (const [bid,b] of Object.entries(leaf))
  for (const [pk,pool] of Object.entries(b.pools))
    for (const v of pool) if ((v.slots||[]).includes('reason')) { reasonBlocks.push(bid+' :: '+pk); }
console.log('{reason}-naming (block::pool) entries:', [...new Set(reasonBlocks)].join(' | '));
