import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
function isProse(v){ if(typeof v!=='string') return false; const s=v.trim();
  if(s.split(/\s+/).length<3) return false; if(!/[a-z]/.test(s)) return false;
  if(/^[A-Z0-9_]+$/.test(s)) return false; if(/^[a-z0-9]+([_-][a-z0-9]+)+$/.test(s)) return false; return true; }
async function open(rel){ return import(pathToFileURL(path.join(DOCK,rel)).href); }
function harvest(mod,names,register){ const rows=[];
  const walk=(node,p,d)=>{ if(d>8) return;
    if(Array.isArray(node)){ const pr=node.filter(isProse);
      if(pr.length){const pid=`${register}::${p.join('.')}`; pr.forEach(t=>rows.push({poolId:pid,text:String(t)}));}
      for(const [i,c] of node.entries()) if(c&&typeof c==='object') walk(c,[...p,String(i)],d+1); return; }
    if(!node||typeof node!=='object') return; const singles=[];
    for(const [k,v] of Object.entries(node)){ if(isProse(v)){singles.push(String(v));continue;} walk(v,[...p,k],d+1); }
    if(singles.length){const pid=`${register}::${p.join('.')}::single`; singles.forEach(t=>rows.push({poolId:pid,text:t}));}
  };
  for(const n of names){ if(!(n in mod)) throw new Error('missing '+n); walk(mod[n],[n],0); } return rows; }
const census=(rows)=>`rows ${rows.length} pools ${new Set(rows.map(r=>r.poolId)).size} distinct ${new Set(rows.map(r=>r.text)).size} singletonPools ${[...new Set(rows.filter(r=>r.poolId.endsWith('::single')).map(r=>r.poolId))].length}`;
function privateArray(src,name){ const a=new RegExp(`\\bconst\\s+${name}\\s*=\\s*Object\\.freeze\\(\\[|\\bconst\\s+${name}\\s*=\\s*\\[`);
  const m=a.exec(src); if(!m) throw new Error('no '+name); const open=src.indexOf('[',m.index); let d=0,end=-1;
  for(let i=open;i<src.length;i++){const c=src[i]; if(c==="'"||c==='"'||c==='`'){const q=c;i++;while(i<src.length&&src[i]!==q){if(src[i]==='\\')i++;i++;}continue;}
    if(c==='[')d++; else if(c===']'){d--; if(d===0){end=i;break;}}}
  const body=src.slice(open+1,end);
  return [...body.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)].map(x=>(x[1]??x[2]).replace(/\\'/g,"'").replace(/\\"/g,'"')).filter(isProse); }

// CHRONICLE
let ch=[];
ch.push(...harvest(await open('src/domain/display/chronicleReadModel.js'),['QUIET_FALLBACK'],'R12'));
ch.push(...harvest(await open('src/domain/display/treatyDocument.js'),['TREATY_COMPLIANCE_VOICE','TREATY_COMPLIANCE_FLOOR'],'R12'));
ch.push(...harvest(await open('src/domain/display/demographicReading.js'),['OCCUPANCY_SENTENCES','READING_VOCABULARIES'],'R12'));
const ta=await open('src/domain/display/threatAssessment.js');
console.log('threatAssessment Object.keys:', JSON.stringify(Object.keys(ta)), 'types:', Object.keys(ta).map(k=>typeof ta[k]).join(','));
const taTables=Object.keys(ta).filter(k=>ta[k]&&typeof ta[k]==='object');
ch.push(...harvest(ta,taTables,'R12'));
const letterSrc=readFileSync(path.join(DOCK,'src/domain/display/chroniclersLetter.js'),'utf8');
let letterN=0; for(const n of ['GREETINGS','CLOSINGS','QUIET']){ const arr=privateArray(letterSrc,n); letterN+=arr.length;
  arr.forEach(t=>ch.push({poolId:`R11::letter.${n}`,text:t})); }
console.log('chronicle', census(ch), '| letter(R11-stamped) rows:', letterN);

// R5
const r5=[];
r5.push(...harvest(await open('src/domain/display/newsVoice.js'),['VOICE_LINES','VOICE_FLOOR'],'R5'));
r5.push(...harvest(await open('src/domain/display/newsBody.js'),['BODY_POOLS'],'R5'));
console.log('R5(harvester approx)', census(r5));

// R7
const r7=[];
r7.push(...harvest(await open('src/data/institutionalCatalog.js'),['institutionalCatalog'],'R7'));
r7.push(...harvest(await open('src/data/institutionServices.js'),['INSTITUTION_SERVICES'],'R7'));
r7.push(...harvest(await open('src/data/institutionDescVariants.js'),['INSTITUTION_DESC_VARIANTS'],'R7'));
r7.push(...harvest(await open('src/data/institutionLadders.js'),['UPGRADE_CHAINS','SUBSUMPTION_RULES'],'R7'));
const iv=await open('src/domain/display/institutionVocabulary.js');
r7.push(...harvest(iv,Object.keys(iv).filter(k=>iv[k]&&typeof iv[k]==='object'),'R7'));
console.log('R7', census(r7));

// D-d
const dd=[];
dd.push(...harvest(await open('src/data/npcData.js'),['NPC_PLOT_HOOKS','MANNERISMS','SPEECH_PATTERNS'],'D-d'));
dd.push(...harvest(await open('src/data/stressInstitutionEffects.js'),['STRESS_INSTITUTION_EFFECTS'],'D-d'));
console.log('D-d', census(dd));

// R9
const r9=[];
for(const [rel,n] of [['src/copy/en.js','en'],['src/copy/landing.js','landing'],['src/copy/pricingPage.js','pricingPage'],['src/copy/deityAuthoring.js','deityAuthoring'],['src/copy/footer.js','footer']]){
  r9.push(...harvest(await open(rel),[n],'R9')); }
console.log('R9', census(r9));

// duty kinds probe on institutionServices
const svc=await open('src/data/institutionServices.js');
const names=new Set();
const collect=(n,d=0)=>{ if(d>8)return; if(Array.isArray(n)){n.forEach(x=>collect(x,d+1));return;}
  if(n&&typeof n==='object'){ if(typeof n.name==='string') names.add(n.name); Object.values(n).forEach(x=>collect(x,d+1)); } };
collect(svc.INSTITUTION_SERVICES);
const RE=/\b(tithe|dues|tax|taxation|toll|customs|custom commissions?|record keeping|records?|register|registration|census|levy|muster|rolls?)\b/i;
const OLD=/\b(tithe|dues|tax|taxation|toll|customs|custom|custom commissions?|record keeping|records?|register|registration|census|levy|muster|rolls?)\b/i;
const now=[...names].filter(n=>RE.test(n)).sort();
const before=[...names].filter(n=>OLD.test(n)).sort();
console.log('menu service names total:', names.size);
console.log('duty-matching NOW ('+now.length+'):', now.join(' · '));
console.log('dropped by removing bare `custom`:', before.filter(n=>!now.includes(n)).join(' · ')||'(none)');
