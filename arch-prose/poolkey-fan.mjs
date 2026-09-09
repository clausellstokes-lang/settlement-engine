// READ-ONLY. Every *PoolKey function in the six composers: its parameter count (how many
// facts it reads) and the number of DISTINCT pool-key strings its body can return (its fan).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { balanced, topLevelSplit, COMPOSERS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/tests/helpers/dossierComposedFill.js';
const B6='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const rows=[]; const byArity={};
for (const rel of COMPOSERS) {
  const src = readFileSync(join(B6, rel), 'utf8');
  const re = /^(?:export\s+)?function\s+([A-Za-z0-9_]*PoolKey)\s*\(/gm;
  for (const m of src.matchAll(re)) {
    const open = m.index + m[0].length - 1;
    const args = balanced(src, open);
    const params = topLevelSplit(args.inner).map((p)=>(p.match(/^([A-Za-z_$][\w$]*)/)||['',''])[1]).filter(Boolean);
    const bodyOpen = src.indexOf('{', args.end);
    const body = balanced(src, bodyOpen).inner;
    const lits = new Set();
    for (const s of body.matchAll(/return\s+'([^']*)'/g)) lits.add(s[1]);
    for (const s of body.matchAll(/'([^'\n]{2,60})'\s*[:,;)]/g)) lits.add(s[1]);
    rows.push({ file: rel.split('/').pop().replace('StateProse.js',''), name: m[1], params: params.length, plist: params.join(','), fan: lits.size });
    byArity[params.length]=(byArity[params.length]||0)+1;
  }
}
rows.sort((a,b)=>b.params-a.params||b.fan-a.fan);
console.log('composer · poolKey fn · #facts read · params · distinct key strings in body (fan, LOWER bound)');
for (const r of rows) console.log(`${r.file.padEnd(10)} ${r.name.padEnd(34)} ${r.params}  (${r.plist})  fan≈${r.fan}`);
console.log('\nfunctions by number of facts read:');
for (const [k,v] of Object.entries(byArity).sort()) console.log(`  reads ${k} fact(s): ${v} functions`);
console.log(`TOTAL ${rows.length}`);
