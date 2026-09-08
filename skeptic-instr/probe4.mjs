const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const { walkEntry } = await import(`${D}/src/domain/prose/entryWalker.js`);
const fx = await import(`${D}/tests/fixtures/brackwaterTables.js`);
const show = (label, text, ground=fx.TABLE_EMPTY) => {
  const r = walkEntry({id:label, text, slots:[]}, ground);
  console.log(`${label}: ${JSON.stringify(text)}`);
  console.log('   FAILS  ', JSON.stringify(r.fails.map(f=>`${f.klass}/${f.arm}`)));
  console.log('   NOTES  ', JSON.stringify(r.notes.map(f=>`${f.klass}/${f.arm}|${f.value}`)));
};
// 1. the indexOf-vs-word-boundary hazard on the totality arm
show('T1 control (no earlier substring)', 'All souls are counted here.');
show('T2 "wall" precedes "all"', 'The wall is old, and all souls are counted here.');
show('T3 "hall" precedes "any"', 'The company keeps its hall, and any household may be counted.');
show('T4 "not" precedes "no"', 'The roll is not kept, and no households are counted.');
// 2. positive controls, full findings
for (const c of fx.POSITIVE_CONTROLS) {
  const entry = { id: c.id, text: c.text, slots: [...c.text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map(m=>m[1]) };
  const r = walkEntry(entry, fx.TABLE_EMPTY);
  console.log(`\nPOS ${c.id}`);
  for (const k of ['fails','withheld','notes','notExecutable']) console.log('   ', k, JSON.stringify(r[k].map(f=>`${f.klass}/${f.arm}|${f.value}`)));
}
