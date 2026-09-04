const TEN = new Set(['overview','viability','economy','power','defense','history','population','faith','stressors','relations']);
let total=0, withKey=0, none=0; const strings=new Set(); const stray=[];
for (const f of ['defense','economy','general','power','stressors','warFaith']) {
  const m = await import(`./leaves/${f}.generated.js`);
  const table = Object.values(m).find(v => v && typeof v === 'object');
  for (const [id, block] of Object.entries(table)) {
    total++;
    const st = block.sectionTarget;
    if (Array.isArray(st) && st.length) { withKey++; for (const s of st) { strings.add(s); } }
    else none++;
  }
}
const causal = await import('./leaves/dossierCausalProse.generated.js');
const ctable = Object.values(causal).find(v => v && typeof v === 'object');
const cs = new Set(); let cfam=0, ccanon=0;
for (const fam of Object.values(ctable)) { cfam++; const st = fam.sectionTarget||[]; for (const s of st) cs.add(s); }
console.log('state blocks total:', total, 'with sectionTarget:', withKey, 'without:', none);
console.log('distinct state strings:', strings.size, [...strings].sort().join(','));
console.log('causal families:', cfam, 'distinct causal strings:', cs.size, [...cs].sort().join(','));
