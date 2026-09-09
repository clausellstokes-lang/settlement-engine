import { readFileSync } from 'fs';
const [,, author, ...terms] = process.argv;
const j = JSON.parse(readFileSync(`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kept-${author}.json`,'utf8'));
const re = new RegExp(terms.join('|'), 'i');
const hits = j.filter(r => re.test(`${r.feature} ${r.claim} ${r.quote||''}`));
console.log(`# ${author}: ${hits.length} of ${j.length}`);
const srcs = new Set();
for (const r of hits) { srcs.add(r.source); console.log(`${author}:${r.index} [${r.verdict?.verdict||'?'}] SRC=${(r.source||'').slice(0,70)}`); console.log(`   feat=${(r.feature||'').slice(0,80)} | claim=${(r.claim||'').slice(0,150)}`); console.log(`   quote="${(r.quote||'').slice(0,110)}"`); }
console.log(`DISTINCT SOURCES: ${srcs.size}`);
[...srcs].forEach(s=>console.log('  -',s));
