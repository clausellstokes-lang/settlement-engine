/**
 * The two steps that DRAW but move no declared key — strict mode on the rows where they
 * actually draw (the earlier probe rows were not necessarily among them).
 */
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);
const TARGETS = ['isolationPass', 'factionCorrelationPass'];
const hits = new Map(TARGETS.map(t => [t, []]));
for (const row of goldenCorpus()) {
  const inst = instrumentedRoot(row._seed);
  runHeadless(row, inst.root);
  for (const t of TARGETS) if (inst.perStep.get(t).draws > 0) hits.get(t).push(row);
}
for (const t of TARGETS) console.log(`${t}: draws in ${hits.get(t).length} rows; first = ${hits.get(t)[0] ? keyOf(hits.get(t)[0]) : '-'}`);

const violations = new Map();
let n = 0;
for (const t of TARGETS) {
  for (const row of hits.get(t)) {
    n += 1;
    runHeadless(row, instrumentedRoot(row._seed).root, {
      onStrictViolation: (v) => {
        const k = `${v.step}\t${v.kind || 'undeclared-write'}`;
        const s = violations.get(k) || new Set();
        for (const key of v.keys) s.add(key);
        violations.set(k, s);
      },
    });
  }
}
console.log(`\nstrict mode run over ${n} rows (every row in which either step draws)`);
if (!violations.size) console.log('NO undeclared write and NO out-of-order read, on any of them.');
for (const [k, s] of violations) console.log(`  ${k}\t[${[...s].join('|')}]`);
