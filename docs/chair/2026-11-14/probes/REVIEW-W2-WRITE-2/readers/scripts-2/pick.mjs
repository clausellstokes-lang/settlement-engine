import * as L from './lib.mjs';
const order=['thorp','hamlet','village','town','city','metropolis'];
export function pick(i){ const ps=L.LINES[i].prints; if(ps.length<=3) return ps.map(p=>p.town);
 const fs=ps.map(p=>({p,f:L.facts(p.town)})); fs.sort((a,b)=>a.f.pop-b.f.pop);
 const sel=[fs[0].p.town, fs[fs.length-1].p.town];
 const cr=fs.find(x=>!sel.includes(x.p.town)&&x.f.crisis.types.some(t=>['under_siege','famine','occupied'].includes(t)));
 sel.push(cr?cr.p.town:fs[Math.floor(fs.length/2)].p.town); return sel; }
const i=+process.argv[2]; const l=L.LINES[i]; console.log('#####',i,l.id,'|',l.text);
for(const town of (process.argv[3]?process.argv.slice(3):pick(i))){ const f=L.facts(town); const p=l.prints.find(x=>x.town===town);
 console.log(`== ${town} ${f.tier} pop=${f.pop} ${f.name} crisis=${f.crisis.types.join('+')||'none'} monster=${f.monster} walls=${f.d.walls}/${f.d.wallKind} gate=${f.d.gate} watch=${f.d.watch} gar=${f.d.garrison} mil=${f.d.militia} merc=${f.d.mercenary} charter=${(f.t.defenseProfile.institutions.charter||[]).map(x=>x.name)} gov=${f.gov} econ=${f.econScore} chainMod=${JSON.stringify(f.chainMod)} fp=${f.chains.food_processing} stores=${f.stores} famine=${f.famine.band} prosp=${f.prosperity}`);
 console.log('  PRINTED:',p?p.page.map(v=>v.printed).join(' || '):'(not printed)');
 const s=L.sec(L.page(town),'Systems/Defense').split('\n'); const a=s.findIndex(x=>/^Guard assessment/.test(x)); const b=s.findIndex(x=>/^Criminal Architecture/.test(x));
 s.slice(a+1,b).forEach(x=>console.log('   | '+x.slice(0,+process.env.W||260)));
}
