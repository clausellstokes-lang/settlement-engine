const M = await import('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/data/dossierStateProse/defense.generated.js');
const table = Object.values(M).find(v=>v && v['DS-DEF-11']);
const b = table['DS-DEF-11'];
let tot=0;
for (const [pk,pool] of Object.entries(b.pools)) {
  console.log('POOL', pk, 'n='+pool.length);
  pool.forEach((v,i)=>{
    const t=v.text; tot++;
    const sents=(t.match(/[.!?](\s|$)/g)||[]).length;
    console.log(`  [${i}] angle=${v.angle} marks=${JSON.stringify(v.marks||[])} sent=${sents} semi/colon=${/[;:]/.test(t)} words=${t.split(/\s+/).length} which=${/\bwhich\b/.test(t)}`);
  });
}
console.log('total variants', tot, 'slots', JSON.stringify(b.slots));
