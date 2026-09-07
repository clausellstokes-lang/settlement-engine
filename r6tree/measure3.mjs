import { ROLE_CONTENT } from './src/domain/display/causeConjunctionRoleContent.js';
import { CLASS_CONTENT } from './src/domain/display/causeConjunctionClassContent.js';
import { FULL_CONTENT } from './src/domain/display/causeConjunctionContent.js';
const pools=[]; const walk=(o,p,t)=>{for(const[k,v]of Object.entries(o)){if(Array.isArray(v))pools.push({tier:t,path:[...p,k],lines:v});else if(v&&typeof v==='object')walk(v,[...p,k],t);}};
walk(ROLE_CONTENT,[],'role'); walk(CLASS_CONTENT,[],'class'); walk(FULL_CONTENT,[],'full');
const all=pools.flatMap(p=>p.lines.map(t=>({...p,text:t})));
const stage=a=>a.path[a.path.length-1];
const words=s=>s.trim().split(/\s+/).filter(Boolean).length;

const byStage={};
for(const a of all){const s=stage(a); byStage[s]=byStage[s]||{n:0,itIsPublic:0,isOut:0,cameClean:0,semi:0,colon:0,commaAnd:0,w:[]};
  const b=byStage[s]; b.n++; if(/^it is public/i.test(a.text))b.itIsPublic++; if(/\bis out\b/i.test(a.text))b.isOut++;
  if(/came clean/i.test(a.text))b.cameClean++; if(/;/.test(a.text))b.semi++; if(/:/.test(a.text))b.colon++;
  if(/, and /.test(a.text))b.commaAnd++; b.w.push(words(a.text)); }
for(const[k,v]of Object.entries(byStage)){const m=(v.w.reduce((x,y)=>x+y,0)/v.w.length).toFixed(1);
  const sd=Math.sqrt(v.w.reduce((x,y)=>x+(y-v.w.reduce((p,q)=>p+q,0)/v.w.length)**2,0)/v.w.length).toFixed(1);
  console.log(k.padEnd(16), 'n='+String(v.n).padEnd(5), 'mean='+m, 'sd='+sd, 'min='+Math.min(...v.w), 'max='+Math.max(...v.w),
   '| ItIsPublic='+v.itIsPublic, 'isOut='+v.isOut, 'cameClean='+v.cameClean, 'semi='+(v.semi/v.n).toFixed(2), 'colon='+(v.colon/v.n).toFixed(2), ',and='+(v.commaAnd/v.n).toFixed(2)); }

// chain arity: count clause segments separated by , and / ; / :
const arity=t=>{const s=t.replace(/\{[a-z_0-9]+\}/g,'X'); return s.split(/;|:|, (?:and|but|so|yet) /).filter(x=>x.trim()).length;};
const ar={}; for(const a of all) ar[arity(a.text)]=(ar[arity(a.text)]||0)+1;
console.log('\nclause-chain arity:', JSON.stringify(Object.entries(ar).sort((x,y)=>x[0]-y[0])));
console.log('three-part chains:', all.filter(a=>arity(a.text)===3).length, 'of', all.length, '=', (all.filter(a=>arity(a.text)===3).length/all.length).toFixed(3));

// per-tier length
for(const t of ['role','class','full']){const L=all.filter(a=>a.tier===t).map(a=>words(a.text));
 console.log(t, 'n='+L.length, 'mean='+(L.reduce((x,y)=>x+y,0)/L.length).toFixed(1), 'min='+Math.min(...L),'max='+Math.max(...L));}

// stage-formula concentration in exposed-public
const ep=all.filter(a=>stage(a)==='exposed-public');
console.log('\nexposed-public n='+ep.length, 'opening "It is public/out" =', ep.filter(a=>/^it is (public|out)/i.test(a.text)).length,
  '| any disclosure formula (public|out|known) =', ep.filter(a=>/\b(is public|is out|it is known)\b/i.test(a.text)).length);
const rf=all.filter(a=>stage(a)==='reformed');
console.log('reformed n='+rf.length, '"came clean" =', rf.filter(a=>/came clean/i.test(a.text)).length,
  '| "with ... again," opener =', rf.filter(a=>/^with .{0,40}again,/i.test(a.text)).length);
const ra=all.filter(a=>stage(a)==='re-adjudicated');
console.log('re-adjudicated n='+ra.length, '"destroyed, but" =', ra.filter(a=>/destroyed, but/i.test(a.text)).length,
  '| "is gone, but"/"are gone, but" =', ra.filter(a=>/(is|are) gone, but/i.test(a.text)).length,
  '| either =', ra.filter(a=>/(destroyed|gone), but/i.test(a.text)).length);
const hi=all.filter(a=>stage(a)==='historicized');
console.log('historicized n='+hi.length, '", but ... still" =', hi.filter(a=>/, but .{0,60}\bstill\b/i.test(a.text)).length,
  '| ends on origin-past clause (";" + past) =', hi.filter(a=>/;/.test(a.text)).length);
const rc=all.filter(a=>stage(a)==='re-caused');
console.log('re-caused n='+rc.length, '"now"/"reasons for them now" =', rc.filter(a=>/\bnow\b/i.test(a.text)).length,
  '| "has passed"/"is gone"/"eased" =', rc.filter(a=>/(has passed|is gone|eased|passed;)/i.test(a.text)).length);
const at=all.filter(a=>stage(a)==='attributed');
console.log('attributed n='+at.length, '"so the {role}" =', at.filter(a=>/\bso the \w+/i.test(a.text)).length);
