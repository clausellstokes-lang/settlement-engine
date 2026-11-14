import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {L,rec,crises,page,ctx}=require('./lib.js');
const T='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip';
const {defenceOf}=await import(T+'/src/domain/facts/defence.js');
const [id,pick]=process.argv.slice(2);const l=L.find(x=>x.id===id);
let wo=0,woDen=0;for(const p of l.prints){const d=defenceOf(rec(p.town));if(d.watch&&!d.garrison&&!d.mercenary){wo++;if(/no wall and no soldiers|no soldiers/.test(page(p.town)))woDen++;}}
console.log('watch-only',wo,'with denial',woDen);
const s=[...l.prints].sort((a,b)=>a.pop-b.pop);let towns=[s[0].town,s[s.length-1].town];for(const c of ['under_siege','famine','occupied']){const f=l.prints.find(p=>crises(p.town).includes(c)&&!towns.includes(p.town));if(f)towns.push(f.town);}
if(pick)towns=pick.split(',');
for(const t of towns){const r=rec(t);const d=defenceOf(r);const p=l.prints.find(x=>x.town===t);console.log('==',t,r.tier,r.population,crises(t).join('+')||'calm',JSON.stringify({w:d.walls,k:d.wallKind,g:d.garrison,wa:d.watch,m:d.mercenary,mi:d.militia}));
 console.log('  PRINTED:',p.page[0].printed);
 const dl=page(t).split('\n');let tab='';const hits=[];dl.forEach(x=>{const m=/^== (.*) ==$/.exec(x);if(m)tab=m[1];if(tab==='Systems/Defense'&&/wall|garrison|soldier|watch|militia|wage|paid|mercenar|siege/i.test(x)&&x.length>40)hits.push(x.slice(0,230));});hits.slice(0,5).forEach(h=>console.log('   D:',h));
 const ov=ctx(t,p.page[0].printed.slice(0,30),0)[0];console.log('   OV:',ov.around[0].slice(0,400));}
