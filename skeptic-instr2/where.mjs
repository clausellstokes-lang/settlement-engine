import { readFileSync } from 'node:fs';
import { composerSources } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/tests/helpers/dossierComposedFill.js';
import { poolKeyFunctions, codeOnly } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
const { rows } = JSON.parse(readFileSync('./rows.json','utf8'));
const src = composerSources();
const fns=[]; for (const [f,s] of src) fns.push(...poolKeyFunctions(s,f));
const u = rows.filter(r=>r.status!=='RESOLVED' && !/UNMOUNTED/.test(r.reason));
let inKeyFn=0, inCommentOnly=0, elsewhere=0; const ex=[];
for (const r of u) {
  const q = `'${r.pool}'`;
  const inFn = fns.some(f=>f.body.includes(q));
  const inCodeAnywhere = [...src.values()].some(s=>codeOnly(s).includes(q));
  const anywhere = [...src.values()].some(s=>s.includes(q));
  if (!anywhere) continue;
  if (inFn) { inKeyFn++; if(ex.length<8) ex.push(['IN A *PoolKey BODY', r.block, r.pool]); }
  else if (!inCodeAnywhere) inCommentOnly++;
  else { elsewhere++; }
}
console.log('mounted-UNRESOLVED whose key literal sits INSIDE a *PoolKey function body:', inKeyFn);
console.log('  ... only in a COMMENT:', inCommentOnly);
console.log('  ... in composer CODE but outside any *PoolKey function:', elsewhere);
for (const e of ex) console.log('   ', e.join(' | '));
