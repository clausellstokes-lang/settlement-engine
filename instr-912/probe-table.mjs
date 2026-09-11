const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const { generateSettlementPipeline } = await import(`file://${D}/src/generators/generateSettlementPipeline.js`);
const T = await import(`file://${D}/src/domain/institutions/institutionTable.js`);
for (const t of ['hamlet','town','city']) {
  const s = generateSettlementPipeline({settType:t,culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'}, null, {seed:'car4-table-'+t, customContent:{}});
  const tab = T.institutionTableOf(s);
  console.log(`=== ${t}  rows ${tab.rows.length}  population ${s.population}`);
  for (const r of T.columnCensus(tab)) console.log(`   ${r.column.padEnd(16)} closed=${String(r.closed).padEnd(5)} held=${String(r.held).padStart(4)}  ${r.sample.slice(0,86)}`);
}
// estate-wide: is whoIsExempt null on every settlement?
let exemptHits=0, n=0, offices=new Set(), duties=new Set();
for (const t of ['thorp','hamlet','village','town','city','metropolis']) for (let i=0;i<5;i++){
  const s = generateSettlementPipeline({settType:t,culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'}, null, {seed:`car4-est-${t}${i}`, customContent:{}});
  const tab = T.institutionTableOf(s); n++;
  if (tab.columns.whoIsExempt.values.length) exemptHits++;
  for (const v of tab.columns.office.values) offices.add(v);
  for (const v of tab.columns.whatItCounts.values) duties.add(v);
}
console.log(`\nESTATE SCAN over ${n} settlements: whoIsExempt non-empty on ${exemptHits}; distinct offices ${offices.size}; distinct duty rows ${duties.size}`);
console.log('bailiff anywhere in the office column:', [...offices].some(o=>/bailiff/i.test(o)));
console.log('duty rows:', [...duties].sort().join(' | '));
