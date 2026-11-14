const {L,rec,crises,tabs}=require('./lib');
const [id,pick]=process.argv.slice(2);const l=L.find(x=>x.id===id);const P=l.prints;
let towns;if(pick==='auto'){const s=[...P].sort((a,b)=>a.pop-b.pop);towns=[s[0].town,s[s.length-1].town];for(const c of ['under_siege','famine','occupied']){const f=P.find(p=>crises(p.town).includes(c)&&!towns.includes(p.town));if(f)towns.push(f.town);}}else towns=pick.split(',');
for(const t of towns){const p=P.find(x=>x.town===t);const r=rec(t);const a=r.history.legacyAnnotations[0];
 console.log('=====',t,r.tier,r.population,crises(t).join('+')||'calm');console.log(' PRINTED:',p.page.map(v=>v.printed).join(' | '));
 console.log(' ann0:',a.annotation.slice(0,300),'| yrs',a.yearsAgo,a.severity);
 const ev=r.history.historicalEvents.find(e=>e.name===a.eventName);console.log(' event:',ev&&JSON.stringify({y:ev.yearsAgo,s:ev.severity,a:ev.anchored,t:ev.type,le:ev.lastingEffects}).slice(0,300));
 const H=tabs(t)['World/History'];const i=H.findIndex(x=>x.includes(p.page[0].printed.slice(0,30)));console.log(' ctx:',H.slice(Math.max(0,i-3),i+3).map(x=>x.slice(0,250)).join(' // '));
 const nm=a.eventName.replace(/^The /,'');H.forEach(x=>{if(x.includes(nm)&&!x.includes(p.page[0].printed.slice(0,30)))console.log('   H-mention:',x.slice(0,250));});
}
