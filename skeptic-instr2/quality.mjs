import { readFileSync } from 'node:fs';
const { rows } = JSON.parse(readFileSync('./rows.json','utf8'));
const res = rows.filter(r=>r.status==='RESOLVED');
console.log('RESOLVED', res.length);
const empty = res.filter(r=>r.predicate.length===0);
console.log('RESOLVED with EMPTY predicate:', empty.length);
const byRungEmpty = {}; for (const r of empty) byRungEmpty[r.rung]=(byRungEmpty[r.rung]||0)+1;
console.log('  by rung:', byRungEmpty);
const bleed = res.filter(r=>r.predicate.some(p=>/return |;|\breturn\b|=>/.test(String(p.value)) || String(p.value).length>40));
console.log('RESOLVED whose predicate VALUE looks like code (contains return/;/=> or >40 chars):', bleed.length);
for (const r of bleed.slice(0,10)) console.log('   ', r.block,'::',r.pool,'|',JSON.stringify(r.predicate.map(p=>p.field+' '+p.op+' '+String(p.value).slice(0,60))));
const bleedField = res.filter(r=>r.predicate.some(p=>/[();]|return/.test(String(p.field)) && !/\(via /.test(String(p.field))));
console.log('RESOLVED whose predicate FIELD looks like code:', bleedField.length);
for (const r of bleedField.slice(0,8)) console.log('   ', r.block,'::',r.pool,'|',JSON.stringify(r.predicate.map(p=>p.field)));
// distribution of predicate row counts
const dist={}; for(const r of res) dist[r.predicate.length]=(dist[r.predicate.length]||0)+1;
console.log('predicate-row-count distribution over RESOLVED:', dist);
