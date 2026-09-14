import { readFileSync } from 'node:fs';
import { tierRows, rootOf } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
const { rows, held } = JSON.parse(readFileSync('./rows.json','utf8'));
const t = tierRows({ rows, held });
const missing = t.filter(x=>x.tier==='MISSING').map(x=>x.subject);
console.log('MISSING facts:', missing.length);
// fieldsRead is populated on every RESOLVED row, predicate is not.
const readRoots = new Set(rows.flatMap(r=>r.fieldsRead.map(rootOf)));
const readFull = new Set(rows.flatMap(r=>r.fieldsRead));
const alsoRead = missing.filter(m=>readRoots.has(m) || readFull.has(m));
console.log('MISSING facts that a key function DOES read (fieldsRead):', alsoRead.length);
console.log(alsoRead.join('\n'));
console.log('--- all 58 ---');
console.log(missing.join(' | '));
// histogram independent
const h={}; for(const r of rows) h[r.variants]=(h[r.variants]||0)+1;
console.log('histogram', h, 'sum', Object.entries(h).reduce((a,[k,v])=>a+ +k*v,0));
