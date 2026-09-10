import { walkEntry, verdictOf } from '../laneINSTR/src/domain/prose/entryWalker.js';
import * as F from '../laneINSTR/tests/fixtures/brackwaterTables.js';
const show = (label, ground) => {
  const r = walkEntry(F.BRACKWATER_ENTRY, ground);
  console.log(`\n### ${label}  verdict=${verdictOf(r)}  fails=${r.fails.length} withheld=${r.withheld.length} notes=${r.notes.length} notExec=${r.notExecutable.length}`);
  for (const f of r.fails) console.log(`   FAIL  ${f.klass} [${f.arm}] col=${f.column} val=${f.value} :: ${f.clause.slice(0,70)}`);
  for (const w of r.withheld) console.log(`   WITH  ${w.klass} [${w.arm}] col=${w.column} :: ${w.clause.slice(0,70)}`);
  for (const n of r.notes) console.log(`   NOTE  ${n.klass} [${n.arm}] ${n.value}`);
  for (const x of r.notExecutable) console.log(`   NEXEC ${x.klass} [${x.arm}] wants=${x.column}`);
};
show('(a) EMPTY', F.TABLE_EMPTY);
show('(b) FULL', F.TABLE_FULL);
show('(c) CLOSED', F.TABLE_CLOSED);
show('(d) ROW-CLOSED', F.TABLE_ROW_CLOSED);
console.log('\n### POSITIVE CONTROLS');
for (const c of F.POSITIVE_CONTROLS) {
  const r = walkEntry({ id: c.id, text: c.text, slots: c.text.includes('{settlement}')?['settlement']:[] }, F.TABLE_EMPTY);
  console.log(` ${verdictOf(r).padEnd(9)} ${c.id}  fails=${r.fails.map(f=>f.klass+'/'+f.arm).join(', ')||'-'}  withheld=${r.withheld.map(w=>w.klass).join(',')||'-'}`);
}
console.log('\n### GENDER FIXTURE');
for (const g of F.GENDER_FIXTURE) {
  const r = walkEntry({ id: g.id, text: g.text }, { ...F.TABLE_EMPTY, gender: g.gender });
  console.log(` expect=${g.expect} got=${verdictOf(r)} ${g.id} fails=${r.fails.map(f=>f.klass+'/'+f.arm).join(', ')||'-'}`);
}
