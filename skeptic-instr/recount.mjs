// Independent recount of car-3 loader censuses. Reads the pinned dock read-only.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
// my own predicate, written from the lane's published description (3+ words, has lowercase,
// not SCREAMING_SNAKE, not kebab/snake slug)
function isProse(v){ if(typeof v!=='string') return false; const s=v.trim();
  if(s.split(/\s+/).length<3) return false; if(!/[a-z]/.test(s)) return false;
  if(/^[A-Z0-9_]+$/.test(s)) return false; if(/^[a-z0-9]+([_-][a-z0-9]+)+$/.test(s)) return false; return true; }
async function open(rel){ return import(pathToFileURL(path.join(DOCK,rel)).href); }
function harvest(mod, names, register){
  const rows=[];
  const walk=(node,p,depth)=>{ if(depth>8) return;
    if(Array.isArray(node)){ const prose=node.filter(isProse);
      if(prose.length){ const pid=`${register}::${p.join('.')}`; prose.forEach((t,i)=>rows.push({poolId:pid,text:String(t)})); }
      for(const [i,c] of node.entries()) if(c&&typeof c==='object') walk(c,[...p,String(i)],depth+1);
      return; }
    if(!node||typeof node!=='object') return;
    const singles=[];
    for(const [k,v] of Object.entries(node)){ if(isProse(v)){singles.push(String(v));continue;} walk(v,[...p,k],depth+1); }
    if(singles.length){ const pid=`${register}::${p.join('.')}::single`; singles.forEach(t=>rows.push({poolId:pid,text:t})); }
  };
  for(const n of names){ if(!(n in mod)) throw new Error('missing '+n); walk(mod[n],[n],0); }
  return rows;
}
const census=(rows)=>({rows:rows.length,pools:new Set(rows.map(r=>r.poolId)).size,distinct:new Set(rows.map(r=>r.text)).size,
  singleton:[...new Set(rows.filter(r=>r.poolId.endsWith('::single')).map(r=>r.poolId))].length});

// R4b
const r4b=[];
r4b.push(...harvest(await open('src/domain/display/heraldIntegrity.js'),['DISCLOSURE_LINES'],'R4b'));
r4b.push(...harvest(await open('src/domain/display/causeLifecycleVocabulary.js'),['CAUSE_MECHANISM_PHRASE','STAGE_TEMPLATES'],'R4b'));
r4b.push(...harvest(await open('src/domain/display/causeWalk.js'),['NO_DEEPER_MEMORY','LEDGER_DARK_LINE','REDACTED_HOP'],'R4b'));
console.log('R4b', JSON.stringify(census(r4b)));
// per-source breakdown
console.log('  DISCLOSURE_LINES only:', harvest(await open('src/domain/display/heraldIntegrity.js'),['DISCLOSURE_LINES'],'R4b').length);

// R6
const r6=[];
for(const [rel,name] of [['src/domain/display/causeConjunctionRoleContent.js','ROLE_CONTENT'],
  ['src/domain/display/causeConjunctionClassContent.js','CLASS_CONTENT'],
  ['src/domain/display/causeConjunctionContent.js','FULL_CONTENT']]){
  r6.push(...harvest(await open(rel),[name],'R6')); }
console.log('R6', JSON.stringify(census(r6)));
// pool size stats
const sizes=new Map(); for(const r of r6) sizes.set(r.poolId,(sizes.get(r.poolId)||0)+1);
const c=[...sizes.values()]; const mean=c.reduce((a,b)=>a+b,0)/c.length; const singl=c.filter(n=>n===1).length;
console.log(`R6 pools ${c.length} mean ${mean.toFixed(2)} singletons ${singl} (${(singl/c.length*100).toFixed(0)}%)`);
// RAW leaf count with NO predicate at all, for R6
function rawCount(node,depth=0){ if(depth>12) return 0; if(typeof node==='string') return 1;
  if(Array.isArray(node)) return node.reduce((a,x)=>a+rawCount(x,depth+1),0);
  if(node&&typeof node==='object') return Object.values(node).reduce((a,x)=>a+rawCount(x,depth+1),0); return 0; }
let raw=0; for(const [rel,name] of [['src/domain/display/causeConjunctionRoleContent.js','ROLE_CONTENT'],
  ['src/domain/display/causeConjunctionClassContent.js','CLASS_CONTENT'],
  ['src/domain/display/causeConjunctionContent.js','FULL_CONTENT']]){ const m=await open(rel); raw+=rawCount(m[name]); }
console.log('R6 RAW string leaves (no predicate):', raw);
