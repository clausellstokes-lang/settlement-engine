import { readFileSync } from 'fs';
const B='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/';
for (const spec of process.argv.slice(2)) {
  const [a, ...ix] = spec.split(':');
  const j = JSON.parse(readFileSync(`${B}kept-${a}.json`,'utf8'));
  for (const i of ix[0].split(',')) {
    const r = j.find(x=>String(x.index)===i);
    if(!r){console.log(`${a}:${i} NOT FOUND`);continue;}
    console.log(`${a}:${i} [${r.verdict?.verdict}] SRC=${r.source}`);
    console.log(`   feat=${r.feature}`);
    console.log(`   claim=${r.claim}`);
    console.log(`   quote="${(r.quote||'').slice(0,120)}"`);
  }
}
