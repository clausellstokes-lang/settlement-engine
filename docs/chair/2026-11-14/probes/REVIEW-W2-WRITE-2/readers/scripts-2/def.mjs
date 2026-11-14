import * as L from './lib.mjs';
const [town,...pats]=process.argv.slice(2); const s=L.sec(L.page(town),'Systems/Defense').split('\n');
const re=pats.length?new RegExp(pats.join('|'),'i'):null;
s.forEach((x,i)=>{ if(!re||re.test(x)) console.log(i+': '+x.slice(0,300)); });
