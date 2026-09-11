const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const { walkEntry, verdictOf } = await import(`${D}/src/domain/prose/entryWalker.js`);
const fx = await import(`${D}/tests/fixtures/brackwaterTables.js`);
const { estateGround, withEntryContext, settlementGround } = await import(`${D}/src/domain/prose/entryGround.js`);
const arms = (r) => r.fails.map(f => `${f.klass}/${f.arm}`).sort();
for (const [name, t] of [['a EMPTY', fx.TABLE_EMPTY], ['b FULL', fx.TABLE_FULL], ['c CLOSED', fx.TABLE_CLOSED], ['d ROW_CLOSED', fx.TABLE_ROW_CLOSED]]) {
  const r = walkEntry(fx.BRACKWATER_ENTRY, t);
  console.log(`\n== ${name} verdict=${verdictOf(r)} nFails=${r.fails.length}`);
  console.log('  FAILS:', JSON.stringify(arms(r)));
  console.log('  WITHHELD:', JSON.stringify(r.withheld.map(w=>`${w.klass}/${w.arm}`)));
  console.log('  NOTES:', JSON.stringify(r.notes.map(w=>`${w.klass}/${w.arm}`)));
  console.log('  NOTEXEC:', JSON.stringify(r.notExecutable.map(w=>`${w.klass}/${w.arm}`)));
}
console.log('\n== POSITIVE CONTROLS (ground = TABLE_EMPTY)');
for (const c of fx.POSITIVE_CONTROLS) {
  const entry = { id: c.id, text: c.text, slots: [...c.text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map(m=>m[1]) };
  const r = walkEntry(entry, fx.TABLE_EMPTY);
  console.log(` ${c.id}: verdict=${verdictOf(r)} fails=${JSON.stringify(arms(r))} withheld=${JSON.stringify(r.withheld.map(w=>w.arm))} notexec=${r.notExecutable.length} notes=${r.notes.length}`);
}
console.log('\n== GENDER FIXTURE');
for (const f of fx.GENDER_FIXTURE) {
  const r = walkEntry({id:f.id, text:f.text}, {...fx.TABLE_EMPTY, gender: f.gender});
  console.log(` ${f.gender}: expect=${f.expect} got=${verdictOf(r)} fails=${JSON.stringify(arms(r))}`);
}
