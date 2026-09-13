import { readFileSync } from 'node:fs';
import { composerSources } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/tests/helpers/dossierComposedFill.js';
import { codeOnly } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
const { rows } = JSON.parse(readFileSync('./rows.json','utf8'));
const u = rows.filter(r=>r.status!=='RESOLVED' && !/UNMOUNTED/.test(r.reason));
const pairs = new Map(); // pool key -> table name
for (const [file, src] of composerSources()) {
  const code = codeOnly(src);
  for (const m of code.matchAll(/\bconst\s+([A-Z][A-Z0-9_]*)\s*=\s*(?:Object\.freeze\()?\s*\[([\s\S]*?)\]\s*\)?\s*;/g)) {
    for (const e of m[2].matchAll(/\[\s*'([^']*)'\s*,\s*'([^']*)'\s*\]/g)) pairs.set(e[2], `${m[1]} (${file.split('/').pop()}) value=${e[1]}`);
  }
}
const hits = u.filter(r=>pairs.has(r.pool));
console.log('module-level PAIR-ARRAY key tables found:', new Set([...pairs.values()].map(v=>v.split(' value=')[0])).size);
console.log('mounted-UNRESOLVED rows a pair-array table NAMES:', hits.length);
for (const h of hits) console.log('   ', h.block,'::',h.pool,'|',pairs.get(h.pool));
