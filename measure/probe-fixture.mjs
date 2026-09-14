import { wiringCensus, attachSets } from '../laneMEASURE/src/domain/prose/wiringCensus.js';
import { COMPOSER_BRANCH_GRAIN, COMPOSER_BRANCH_FLAT, SETTLEMENT_ONLY } from '../laneMEASURE/tests/fixtures/wiringFixtures.js';
const pools = new Map([['DS-FIX-13', new Map([
  ['WALLED-STRAINED', SETTLEMENT_ONLY], ['WALLED-QUIET', SETTLEMENT_ONLY],
  ['WALLED-THREATENED', SETTLEMENT_ONLY], ['UNWALLED-SMALL', SETTLEMENT_ONLY],
  ['UNWALLED-LARGE', SETTLEMENT_ONLY],
])]]);
for (const [name, src] of [['LADDER', COMPOSER_BRANCH_GRAIN], ['FLAT', COMPOSER_BRANCH_FLAT]]) {
  const rows = wiringCensus({ sources: new Map([['fixture/composer.js', src]]), pools }).rows;
  console.log('==', name);
  for (const r of rows) console.log('  ', r.pool.padEnd(20), r.status === 'RESOLVED' ? 'R' : '.', r.readsGrain, JSON.stringify(r.reads), 'fieldsRead', JSON.stringify(r.fieldsRead));
  const [b] = attachSets(rows);
  if (b) console.log('   attach: spines', b.spines, 'facts', b.facts, 'reached', b.spinesReachedBp, 'bp');
}
