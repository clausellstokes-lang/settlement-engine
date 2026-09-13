import { readFileSync } from 'node:fs';
import { composerSources } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/tests/helpers/dossierComposedFill.js';
import { poolKeyFunctions } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
const { rows } = JSON.parse(readFileSync('./rows.json','utf8'));
const src = composerSources();
// name collisions
const fns=[]; for (const [f,s] of src) fns.push(...poolKeyFunctions(s,f));
const names = new Set(fns.map(f=>f.name));
console.log('key functions', fns.length, 'DISTINCT NAMES', names.size, '=> collisions lost:', fns.length-names.size);
const dup = {}; for (const f of fns) dup[f.name]=(dup[f.name]||0)+1;
console.log('duplicated names:', Object.entries(dup).filter(([,n])=>n>1));
// unresolved not-unmounted
const u = rows.filter(r=>r.status!=='RESOLVED' && !/UNMOUNTED/.test(r.reason));
console.log('UNRESOLVED, mounted:', u.length);
const all = [...src.values()].join('\n');
let appears=0; const sample=[];
for (const r of u) {
  const lit = all.includes(`'${r.pool}'`) || all.includes(`"${r.pool}"`) || all.includes('`'+r.pool+'`');
  if (lit) { appears++; if (sample.length<12) sample.push(r.pool+'  ['+r.block+']'); }
}
console.log('  of those, the pool key appears VERBATIM as a string in composer source:', appears);
console.log(sample.join('\n'));
