import { walkEntry } from '../skepINSTR2/src/domain/prose/entryWalker.js';
import { settlementGround, withEntryContext } from '../skepINSTR2/src/domain/prose/entryGround.js';
import { institutionTableOf } from '../skepINSTR2/src/domain/institutions/institutionTable.js';
import { generateSettlementPipeline } from '../skepINSTR2/src/generators/generateSettlementPipeline.js';
import { quantityWords } from '../skepINSTR2/src/domain/worldPulse/demographicsHerald.js';
import { loadStateLeaves, loadCausalLeaf, loadCrierVoice, loadInFunctionNarratives } from '../skepINSTR2/tests/helpers/dossierCorpus.js';
const town=(t,seed)=>generateSettlementPipeline({settType:t,culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'},null,{seed,customContent:{}});
const WORLD=Object.freeze({bandOf:quantityWords});
const corpus=[...await loadStateLeaves(), ...await loadCausalLeaf(), ...await loadCrierVoice(), ...loadInFunctionNarratives()];
const s=town('town','census-town');
const table=institutionTableOf(s,WORLD);
const THREE=['whatItCounts','whatItDoes','whatItDoesNotDo'];
console.log('shipped closed flags:', THREE.map(c=>`${c}=${table.columns[c].closed}`).join(' '));
function ground(force){
  const cols={};
  for (const [k,v] of Object.entries(table.columns)) cols[k]= (force!==null && THREE.includes(k)) ? {...v, closed: force} : v;
  return settlementGround({...table, columns: cols});
}
function walk(g){
  const out=new Map();
  for (const e of corpus){ const r=walkEntry(e, withEntryContext(g,{})); out.set(e.id||e.text, r.fails.map(f=>`${f.klass}/${f.arm}`).sort().join(',')); }
  return out;
}
const closed=walk(ground(true)); const open=walk(ground(false));
let failClosed=0, failOpen=0, flips=0; const flipped=[];
for (const [k,v] of closed){ const w=open.get(k); if(v)failClosed+=1; if(w)failOpen+=1; if(v!==w){flips+=1; flipped.push([k,v,w]);} }
console.log('corpus',corpus.length,'| entries failing with the three CLOSED:',failClosed,'| with the three OPEN:',failOpen,'| verdicts that FLIP:',flips);
for (const f of flipped.slice(0,5)) console.log('   FLIP', f[0], '|', f[1], '->', f[2]);
