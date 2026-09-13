import { readFileSync } from 'node:fs';
import { composerSources } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/tests/helpers/dossierComposedFill.js';
import { poolKeyFunctions } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
const { rows } = JSON.parse(readFileSync('./rows.json','utf8'));
const src = composerSources();
const fns=[]; for (const [f,s] of src) fns.push(...poolKeyFunctions(s,f));
const u = rows.filter(r=>r.status!=='RESOLVED' && !/UNMOUNTED/.test(r.reason));
const hits=[];
for (const r of u) {
  const forms = [`'${r.pool}'`, `"${r.pool}"`, '`'+r.pool+'`'];
  const f = fns.find(fn=>forms.some(q=>fn.body.includes('return '+q) || fn.body.includes('? '+q) || fn.body.includes(': '+q)));
  if (f) hits.push([r.block, r.pool, f.name, f.file.split('/').pop()]);
}
console.log('mounted-UNRESOLVED rows whose key IS returned as a literal by a *PoolKey fn:', hits.length);
for (const h of hits) console.log('   ', h.join(' | '));
