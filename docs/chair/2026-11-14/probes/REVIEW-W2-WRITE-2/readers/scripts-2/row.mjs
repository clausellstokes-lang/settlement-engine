import * as L from './lib.mjs';
const [town,row]=process.argv.slice(2); const f=L.facts(town); const s=L.sec(L.page(town),'Systems/Defense').split('\n');
const order=['Beasts & Monsters','Invasion & War','Internal Security','Economic Survival','Disasters & Famine'];
const a=s.findIndex(x=>x===row); const nxt=order[order.indexOf(row)+1]; const b=s.findIndex((x,i)=>i>a&&x===nxt);
console.log(`== ${town} ${f.tier} pop=${f.pop} crisis=${f.crisis.types.join('+')||'none'} monster=${f.monster} walls=${f.d.walls} gate=${f.d.gate} watch=${f.d.watch} gar=${f.d.garrison} mil=${f.d.militia} merc=${f.d.mercenary} guard=${f.guard} insts(def)=${f.t.institutions.filter(i=>/Defen|Advent|Milit/.test(i.category)).map(i=>i.name).join('/')}`);
console.log(s.slice(a,b).map(x=>'   | '+x.slice(0,400)).join('\n'));
