// usage: node eye.js <lineId> <pickspec: auto|town1,town2> [grepRegex] [instRegex]
const {L,rec,crises,page}=require('./lib');
const [id,pick,greps,instre]=process.argv.slice(2);
const l=L.find(x=>x.id===id);const P=l.prints;
const order=['thorp','hamlet','village','town','city','metropolis'];
let towns;
if(pick==='auto'){const s=[...P].sort((a,b)=>a.pop-b.pop);towns=[s[0].town,s[s.length-1].town];
 for(const c of ['under_siege','famine','occupied','plague_onset']){const f=P.find(p=>crises(p.town).includes(c)&&!towns.includes(p.town));if(f)towns.push(f.town);}}
else towns=pick.split(',');
for(const t of towns){const p=P.find(x=>x.town===t);const r=rec(t);
 console.log('=====',t,r.tier,r.population,'crises:',crises(t).join('+')||'calm','access:',r.config.tradeRouteAccess,'entrepot:',r.economicState.isEntrepot,'prosp:',r.economicState.prosperity);
 if(!p){console.log(' (does not print here)');}
 else for(const v of p.page){console.log(' ['+v.view+'] PRINTED:',v.printed);}
 const lines=page(t).split('\n');let tab='';
 if(p)lines.forEach((ln,i)=>{const m=/^== (.*) ==$/.exec(ln);if(m)tab=m[1];if(p.page.some(v=>ln.includes(v.printed.slice(0,40))))console.log('  ctx',tab,'|',lines.slice(Math.max(0,i-2),i+3).map(x=>x.slice(0,260)).join(' // '));});
 if(instre){const re=new RegExp(instre,'i');console.log('  inst:',r.institutions.filter(i=>re.test(i.name)||re.test(i.category||'')).map(i=>i.name+'['+(i.status||'')+']').join('; '));}
 if(greps){const re=new RegExp(greps,'i');tab='';const hits=[];lines.forEach((ln,i)=>{const m=/^== (.*) ==$/.exec(ln);if(m)tab=m[1];if(re.test(ln))hits.push(tab+': '+ln.trim().slice(0,220));});console.log('  grep('+hits.length+'):');hits.slice(0,14).forEach(h=>console.log('    '+h));}
}
